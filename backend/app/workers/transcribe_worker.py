"""Lambda worker — Amazon Transcribe → Bedrock Haiku auto-tag pipeline.

Triggered by SQS messages produced by the POST /entries endpoint whenever a
voice dimension entry is saved.  Each message has the shape:

    {"entry_id": "<uuid>", "media_s3_key": "makers/<upload_id>/entries/<uuid>.webm"}

The worker:
1. Starts an Amazon Transcribe job for the audio file.
2. Polls until the job completes (or fails).
3. Reads the transcript JSON from S3 and extracts the text.
4. Generates a title from the first sentence of the transcript (≤ 80 chars).
5. Calls Bedrock Haiku to extract people / year / place tags.
6. Updates the dimension_entries row with body, title, and tags.

Maximum Lambda timeout should be set to 900 s (15 min) — Transcribe
typically finishes in 1–2× real-time for short clips (<5 min ≈ <10 min wait).
"""

import json
import logging
import os
import re
import time
import uuid

import boto3
import psycopg2
from botocore.exceptions import BotoCoreError, ClientError

from app.services.tagging_service import extract_entry_tags

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

AWS_REGION = os.environ.get("AWS_REGION", "us-west-2")
MEDIA_BUCKET = os.environ.get("MEDIA_BUCKET", "")

# Transcribe writes its output JSON to the same S3 bucket under a predictable key.
TRANSCRIBE_OUTPUT_PREFIX = "transcribe-output/"

POLL_INTERVAL_S = 8
MAX_WAIT_S = 600  # 10 min — abort triangulation after this; entry stays as-is


def handler(event: dict, context) -> None:
    for record in event.get("Records", []):
        try:
            _process(json.loads(record["body"]))
        except Exception:
            logger.exception("transcribe_worker: unhandled error for record %s", record.get("messageId"))
            raise  # let SQS retry


def _process(msg: dict) -> None:
    entry_id: str = msg["entry_id"]
    media_s3_key: str = msg["media_s3_key"]

    logger.info("transcribe_worker: processing entry_id=%s key=%s", entry_id, media_s3_key)

    job_name = f"ovyu-entry-{entry_id}-{uuid.uuid4().hex[:8]}"
    media_uri = f"s3://{MEDIA_BUCKET}/{media_s3_key}"
    output_key = f"{TRANSCRIBE_OUTPUT_PREFIX}{job_name}.json"

    transcribe = boto3.client("transcribe", region_name=AWS_REGION)

    transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={"MediaFileUri": media_uri},
        MediaFormat="webm",
        LanguageCode="en-US",
        OutputBucketName=MEDIA_BUCKET,
        OutputKey=output_key,
    )

    transcript_text = _poll_and_read(transcribe, job_name, output_key)
    if transcript_text is None:
        logger.error("transcribe_worker: job %s failed or timed out — leaving entry %s unchanged", job_name, entry_id)
        return

    extracted = extract_entry_tags(transcript_text)
    ai_title = extracted.get("title") or _title_from_transcript(transcript_text)

    _update_entry(entry_id, body=transcript_text, ai_title=ai_title, extracted=extracted)
    logger.info("transcribe_worker: entry %s updated — title=%r tags=%s", entry_id, ai_title, extracted)


def _poll_and_read(transcribe, job_name: str, output_key: str) -> str | None:
    """Poll until the Transcribe job completes, then return the transcript text."""
    waited = 0
    while waited < MAX_WAIT_S:
        resp = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        status = resp["TranscriptionJob"]["TranscriptionJobStatus"]

        if status == "COMPLETED":
            return _read_transcript(output_key)
        if status == "FAILED":
            logger.error(
                "transcribe_worker: job %s FAILED: %s",
                job_name,
                resp["TranscriptionJob"].get("FailureReason"),
            )
            return None

        time.sleep(POLL_INTERVAL_S)
        waited += POLL_INTERVAL_S

    logger.error("transcribe_worker: job %s timed out after %ds", job_name, waited)
    return None


def _read_transcript(output_key: str) -> str | None:
    """Read the Transcribe output JSON from S3 and return the transcript text."""
    try:
        s3 = boto3.client("s3", region_name=AWS_REGION)
        obj = s3.get_object(Bucket=MEDIA_BUCKET, Key=output_key)
        data = json.loads(obj["Body"].read())
        return data["results"]["transcripts"][0]["transcript"]
    except (ClientError, BotoCoreError, KeyError, json.JSONDecodeError) as e:
        logger.error("transcribe_worker: failed to read transcript from S3 key %s: %s", output_key, e)
        return None


def _title_from_transcript(text: str) -> str:
    """Return the first sentence of the transcript, capped at 80 chars."""
    # Split on sentence-ending punctuation followed by whitespace or end.
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    first = sentences[0] if sentences else text
    if len(first) > 80:
        return first[:77] + "…"
    return first


def _merge_tags(existing: dict | None, extracted: dict) -> dict:
    """Merge AI-extracted tags INTO whatever the Maker saved while the
    transcription was running — never overwrite. User values keep their rows;
    AI values append as extra rows in the same column, deduped
    case-insensitively. Stored shape is always people/years/places arrays."""
    existing = existing or {}

    def norm_list(values) -> list[str]:
        return [str(v).strip() for v in (values or []) if str(v).strip()]

    people = norm_list(existing.get("people"))
    # Fold legacy singular year/place into the array shape.
    years = norm_list(existing.get("years")) or norm_list([existing.get("year")] if existing.get("year") else [])
    places = norm_list(existing.get("places")) or norm_list([existing.get("place")] if existing.get("place") else [])

    def add_unique(target: list[str], value: str | None) -> None:
        if value and value.strip() and value.strip().lower() not in {t.lower() for t in target}:
            target.append(value.strip())

    for p in extracted.get("people") or []:
        add_unique(people, p)
    add_unique(years, extracted.get("year"))
    add_unique(places, extracted.get("place"))

    merged = dict(existing)  # preserves call_them/full_name/what_happened/when
    merged.pop("year", None)
    merged.pop("place", None)
    merged.update({"people": people, "years": years, "places": places})
    return merged


def _update_entry(entry_id: str, body: str, ai_title: str, extracted: dict) -> None:
    """Write transcript back to dimension_entries, MERGING with any edits the
    Maker made while transcription ran (tags added, title renamed)."""
    conn = psycopg2.connect(
        host=os.environ["RDS_HOST"],
        port=int(os.environ.get("RDS_PORT", 5432)),
        dbname=os.environ["RDS_DATABASE"],
        user=os.environ["RDS_USERNAME"],
        password=os.environ["RDS_PASSWORD"],
    )
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("SELECT title, tags FROM dimension_entries WHERE id = %s FOR UPDATE", (entry_id,))
                row = cur.fetchone()
                if row is None:
                    logger.warning("transcribe_worker: entry %s no longer exists (deleted?) — skipping", entry_id)
                    return
                current_title, current_tags = row[0], row[1]
                if isinstance(current_tags, str):
                    current_tags = json.loads(current_tags)

                merged = _merge_tags(current_tags, extracted)
                # Only replace the placeholder title — a Maker-typed title wins.
                title = ai_title if (current_title or "").strip() in ("", "Voice note") else current_title

                cur.execute(
                    """
                    UPDATE dimension_entries
                       SET body  = %s,
                           title = %s,
                           tags  = %s
                     WHERE id = %s
                    """,
                    (body, title, json.dumps(merged), entry_id),
                )
    finally:
        conn.close()
