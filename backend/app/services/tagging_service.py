"""Entry auto-tagging via Amazon Bedrock (Claude Haiku).

Extracts the title and three tags shown on every dimension entry card —
Title, People, Year, Place — from an entry's text (or, for voice, its
transcript). Anything that cannot be confidently extracted is returned as
``None``/empty so the caller can fall back (title → first words of the
body; tags → the "unknown" chip).

Kept deliberately simple and cheap: one short, structured Haiku call per entry.
The call is best-effort — any failure (Bedrock unavailable, malformed output)
degrades gracefully to empty output rather than blocking entry creation.
"""
import json
import logging
import string

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.core.config import settings

logger = logging.getLogger(__name__)

# Shape stored on DimensionEntry.tags (title is handled separately by the caller)
EMPTY_TAGS: dict = {"title": None, "people": [], "year": None, "place": None}

_SYSTEM_PROMPT = (
    "You extract structured information from a personal memory written or "
    "spoken by someone recording their life story. Return ONLY a compact "
    "JSON object with exactly these keys: "
    "\"title\" (a short, natural title for this memory in a warm, human "
    "voice, under 8 words, e.g. \"The day I met my best friend\" or \"This "
    "is the story of when I got lost in Tokyo\" — capturing what the memory "
    "is really about, not a generic summary; null if the text is too short "
    "or unclear to title), "
    "\"people\" (array of distinct person names mentioned, [] if none), "
    "\"year\" (a single 4-digit year the memory is about as a string, or "
    "null if none is stated or implied), \"place\" (one city/place name "
    "central to the memory, or null if none). Do not invent values. "
    "Output JSON only, no prose."
)


def _build_messages(text: str) -> list[dict]:
    return [{"role": "user", "content": [{"type": "text", "text": text.strip()[:6000]}]}]


def extract_entry_tags(text: str) -> dict:
    """Return ``{"title": str|None, "people": [...], "year": str|None, "place": str|None}``.

    Always returns a well-formed dict; falls back to ``EMPTY_TAGS`` on any error.
    """
    if not text or not text.strip():
        return dict(EMPTY_TAGS)

    try:
        client = boto3.client("bedrock-runtime", region_name=settings.aws_region)
        resp = client.invoke_model(
            modelId=settings.bedrock_haiku_model_id,
            body=json.dumps(
                {
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 256,
                    "temperature": 0,
                    "system": _SYSTEM_PROMPT,
                    "messages": _build_messages(text),
                }
            ),
        )
        payload = json.loads(resp["body"].read())
        content = payload.get("content", [])
        raw = content[0]["text"] if content else ""
        return _normalize(json.loads(_strip_fences(raw)))
    except (BotoCoreError, ClientError, KeyError, ValueError, json.JSONDecodeError) as e:
        logger.warning("entry auto-tagging failed, defaulting to empty tags: %s", e)
        return dict(EMPTY_TAGS)


def _strip_fences(raw: str) -> str:
    """Tolerate ```json fenced output."""
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1] if "```" in raw[3:] else raw[3:]
        if raw.startswith("json"):
            raw = raw[4:]
    return raw.strip()


def _normalize(data: dict) -> dict:
    title = data.get("title")
    title = str(title).strip() if title not in (None, "", "null") else None

    people = data.get("people") or []
    if isinstance(people, str):
        people = [people]
    people = [str(p).strip() for p in people if str(p).strip()]

    year = data.get("year")
    year = str(year).strip() if year not in (None, "", "null") else None

    place = data.get("place")
    place = str(place).strip() if place not in (None, "", "null") else None

    return {"title": title, "people": people, "year": year, "place": place}


def first_words_title(text: str, max_words: int = 9) -> str:
    """Fallback title: first ``max_words`` words of ``text``, "…" if truncated.

    Used when AI title extraction returns nothing (short/unclear text, or the
    call failed) — a short, readable phrase instead of an arbitrary character
    slice that could cut off mid-word.
    """
    words = text.strip().split()
    if not words:
        return "Untitled entry"
    truncated = len(words) > max_words
    snippet = " ".join(words[:max_words]).rstrip(string.punctuation + " ")
    return snippet + "…" if truncated else snippet
