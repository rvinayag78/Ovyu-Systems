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
MAX_WAIT_S = 840  # 14 min — leave headroom before Lambda timeout


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

    title = _title_from_transcript(transcript_text)
    tags = extract_entry_tags(transcript_text)

    _update_entry(entry_id, body=transcript_text, title=title, tags=tags)
    logger.info("transcribe_worker: entry %s updated — title=%r tags=%s", entry_id, title, tags)


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


def _update_entry(entry_id: str, body: str, title: str, tags: dict) -> None:
    """Write transcript + title + tags back to dimension_entries via psycopg2."""
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
                cur.execute(
                    """
                    UPDATE dimension_entries
                       SET body  = %s,
                           title = %s,
                           tags  = %s
                     WHERE id = %s
                    """,
                    (body, title, json.dumps(tags), entry_id),
                )
    finally:
        conn.close()
