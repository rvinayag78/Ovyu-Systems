"""OVYU voice cloning comparison spike.

Side-by-side ElevenLabs vs Chatterbox (via Replicate). Record a passage in the
browser, the same target sentence is rendered through both providers, listen
A/B with blind labels.

Run:
    cp .env.example .env  # then fill in keys
    uv sync               # or: pip install -e .
    uvicorn app:app --reload

Then open http://127.0.0.1:8000/
"""

from __future__ import annotations

import asyncio
import os
import random
import shutil
import tempfile
import time
import uuid
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
SAMPLES_DIR = BASE_DIR / "samples"
OUT_DIR = BASE_DIR / "out"
SAMPLES_DIR.mkdir(exist_ok=True)
OUT_DIR.mkdir(exist_ok=True)

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "").strip()
REPLICATE_API_TOKEN = os.environ.get("REPLICATE_API_TOKEN", "").strip()
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8000"))

ELEVENLABS_MODEL = "eleven_multilingual_v2"
# Chatterbox public model on Replicate; uses latest version automatically when
# called via the model-scoped predictions endpoint.
CHATTERBOX_MODEL_OWNER = "resemble-ai"
CHATTERBOX_MODEL_NAME = "chatterbox"

# The one fixed target sentence — apples-to-apples comparison across runs.
# Phrased in OVYU's emotional register: a brief, warm farewell message.
TARGET_SENTENCE = (
    "I just wanted you to know how much I loved being your friend, "
    "and I always will."
)

# Reading passages — original prose, varied emotional tone, each ~75-150 words
# so a normal reader produces 30-60 seconds of clean reference audio.
PASSAGES: list[str] = [
    # 1. Warm, nostalgic
    "When I think about the kitchen in the old house, what I remember is the "
    "light. It came through the window above the sink late in the afternoon, "
    "and it made everything gold for about twenty minutes. The wooden bowl on "
    "the table. The edge of the bread board. The handles of the cups in the "
    "drying rack. I used to stand there with a glass of water and watch it "
    "happen, and then I would go and do something else, and forget about it "
    "for years, until now.",

    # 2. Reflective, quiet
    "There is a particular kind of silence in early winter mornings, before "
    "the heating turns on and before any cars start up on the street. It is "
    "not really silence. If you listen, there is the small sound of the "
    "refrigerator, and the wind pressing softly against the windows, and "
    "somewhere far off a train moving across the valley. But it feels like "
    "silence, because nothing in the silence asks anything of you. You can "
    "just sit in it and be a person who is awake.",

    # 3. Descriptive, sensory
    "The market opens at six, and by seven the long tables are covered with "
    "tomatoes, peaches, bunches of basil tied with string, jars of honey, "
    "loaves of bread still warm at the bottom. The woman who sells the eggs "
    "always wears a green apron with a white pocket on the front. The man "
    "who sells the flowers wraps each bouquet in brown paper and ties it "
    "twice. By nine, everything good is already gone, so I try to be there "
    "before the light gets harsh.",

    # 4. Practical, everyday voice
    "If you are going to make the soup, do not skip the part where you cook "
    "the onions slowly. It takes twenty minutes and it is the only step that "
    "really matters. Put them in the pot with a little butter and a pinch of "
    "salt, and stir them every couple of minutes, but otherwise leave them "
    "alone. They will go translucent first, and then golden, and then dark "
    "and sweet at the edges. After that, whatever else you add, the soup "
    "will be good. That is the whole trick.",

    # 5. Tender, loving
    "I want to tell you something that I am not sure I ever said out loud. "
    "You were not a difficult child. You were a careful one. You watched "
    "everything, and you remembered everything, and when you were not sure "
    "what to do, you waited. People sometimes mistook that for shyness, but "
    "I always thought of it as kindness, because you were trying not to get "
    "anything wrong. I hope you have learned to forgive yourself for the "
    "times when you did, because all of us do.",

    # 6. Curious, wondering
    "I have been wondering lately about the way people remember music. You "
    "can go years without hearing a particular song, and then it comes on "
    "somewhere, in a shop or a taxi, and within four notes your whole body "
    "knows it. Not just the melody, but the next words, the way the chorus "
    "lifts, the place in your life where you first heard it. Where does all "
    "that live, in the meantime? It must be folded up somewhere very small, "
    "waiting to be opened.",

    # 7. Grateful
    "Thank you for the small things. Thank you for the way you remembered "
    "that I do not like cilantro, and for warming the towel before you "
    "handed it to me, and for sitting through the long movie even though "
    "you knew within the first ten minutes that you would not enjoy it. "
    "None of these are big things, and that is exactly why I am thanking "
    "you for them. The big things take care of themselves. It is the small "
    "things that build a life with another person.",

    # 8. Childhood memory
    "The summer I was nine, my grandmother taught me how to play a card "
    "game whose name I have since forgotten. We played it every afternoon "
    "on the porch, and she always won, and she always pretended to be "
    "surprised that she had won. I was old enough to know she was "
    "pretending, but not old enough to be insulted by it. Later, I "
    "understood that she was teaching me how to lose gracefully without "
    "ever saying that was what she was doing.",

    # 9. Letter-to-future tone
    "By the time you hear this, a lot of things will be different. The "
    "house may not be there. The dog will certainly not be there. The "
    "tree in the back, the one I always said was going to fall, will "
    "probably have fallen. But I hope the feeling of standing in the "
    "garden in the evening, with the air cooling and the birds settling "
    "down for the night, I hope that feeling is still available to you "
    "somewhere. It does not have to be that garden. Any garden will do.",

    # 10. Simple, observational
    "There is a cafe near the bridge where the chairs are uncomfortable on "
    "purpose, so that people do not stay too long. I go there anyway, "
    "because the coffee is good and because from the window you can watch "
    "the boats coming up the river. The waiter knows my order and brings "
    "it without asking. We do not exchange more than a few words, but "
    "there is a kind of friendship in that, in being known well enough "
    "that nothing needs to be said.",
]

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="OVYU Voice Cloning Comparison Spike")

# Serve generated audio and uploaded samples as static files.
app.mount("/out", StaticFiles(directory=OUT_DIR), name="out")
app.mount("/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/passages")
async def get_passage() -> dict[str, str]:
    """Return a random reading passage and the fixed target sentence."""
    return {
        "passage": random.choice(PASSAGES),
        "target": TARGET_SENTENCE,
    }


@app.get("/healthz")
async def healthz() -> dict[str, Any]:
    return {
        "ok": True,
        "elevenlabs_key_set": bool(ELEVENLABS_API_KEY),
        "replicate_token_set": bool(REPLICATE_API_TOKEN),
        "passages": len(PASSAGES),
    }


# ---------------------------------------------------------------------------
# Provider calls
# ---------------------------------------------------------------------------


async def clone_elevenlabs(
    audio_path: Path,
    audio_mime: str,
    target_text: str,
    out_path: Path,
) -> dict[str, Any]:
    """Instant Voice Clone -> TTS -> cleanup. Writes mp3 to out_path."""
    if not ELEVENLABS_API_KEY:
        raise RuntimeError("ELEVENLABS_API_KEY is not set in environment.")

    start = time.perf_counter()
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    voice_id: str | None = None

    async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
        # 1. Create an Instant Voice Clone from the uploaded sample.
        with audio_path.open("rb") as f:
            files = {"files": (audio_path.name, f.read(), audio_mime)}
        data = {"name": f"ovyu-spike-{uuid.uuid4().hex[:8]}"}
        r = await client.post(
            "https://api.elevenlabs.io/v1/voices/add",
            headers=headers,
            files=files,
            data=data,
        )
        if r.status_code >= 400:
            raise RuntimeError(
                f"ElevenLabs clone failed ({r.status_code}): {r.text}"
            )
        voice_id = r.json()["voice_id"]

        try:
            # 2. Render the target sentence with the cloned voice.
            r = await client.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers={
                    **headers,
                    "accept": "audio/mpeg",
                    "content-type": "application/json",
                },
                json={
                    "text": target_text,
                    "model_id": ELEVENLABS_MODEL,
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.85,
                        "style": 0.2,
                        "use_speaker_boost": True,
                    },
                },
            )
            if r.status_code >= 400:
                raise RuntimeError(
                    f"ElevenLabs TTS failed ({r.status_code}): {r.text}"
                )
            out_path.write_bytes(r.content)
        finally:
            # 3. Delete the cloned voice so it doesn't pile up in the library.
            try:
                await client.delete(
                    f"https://api.elevenlabs.io/v1/voices/{voice_id}",
                    headers=headers,
                )
            except Exception:
                pass  # cleanup is best-effort

    return {
        "elapsed_s": round(time.perf_counter() - start, 2),
        "bytes": out_path.stat().st_size,
    }


async def _convert_to_wav(src: Path) -> Path:
    """Convert any audio file to a temporary 24kHz mono PCM WAV via ffmpeg.

    Chatterbox on Replicate only accepts WAV; browsers record webm/opus by
    default. Returns the path to the temp WAV — caller is responsible for
    deleting it.
    """
    if shutil.which("ffmpeg") is None:
        raise RuntimeError(
            "ffmpeg is not installed. Install it with: brew install ffmpeg"
        )
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp.close()
    wav_path = Path(tmp.name)
    proc = await asyncio.create_subprocess_exec(
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(src),
        "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le",
        str(wav_path),
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr = await proc.communicate()
    if proc.returncode != 0:
        wav_path.unlink(missing_ok=True)
        msg = stderr.decode("utf-8", errors="replace").strip()[:500]
        raise RuntimeError(f"ffmpeg failed converting {src.name} to WAV: {msg}")
    return wav_path


async def clone_chatterbox(
    audio_path: Path,
    audio_mime: str,
    target_text: str,
    out_path: Path,
) -> dict[str, Any]:
    """Upload sample to Replicate Files API -> run Chatterbox -> download wav."""
    if not REPLICATE_API_TOKEN:
        raise RuntimeError("REPLICATE_API_TOKEN is not set in environment.")

    start = time.perf_counter()
    auth = {"Authorization": f"Bearer {REPLICATE_API_TOKEN}"}

    # Chatterbox requires WAV. Convert before uploading.
    wav_path = await _convert_to_wav(audio_path)

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as client:
            # 1. Upload reference audio (now WAV) to Replicate's Files API.
            with wav_path.open("rb") as f:
                r = await client.post(
                    "https://api.replicate.com/v1/files",
                    headers=auth,
                    files={"content": (wav_path.name, f.read(), "audio/wav")},
                )
            if r.status_code >= 400:
                raise RuntimeError(
                    f"Replicate file upload failed ({r.status_code}): {r.text}"
                )
            audio_url = r.json()["urls"]["get"]

            # 2. Start a prediction against the public Chatterbox model.
            r = await client.post(
                f"https://api.replicate.com/v1/models/"
                f"{CHATTERBOX_MODEL_OWNER}/{CHATTERBOX_MODEL_NAME}/predictions",
                headers={**auth, "Content-Type": "application/json"},
                json={
                    "input": {
                        "prompt": target_text,
                        "audio_prompt": audio_url,
                    }
                },
            )
            if r.status_code >= 400:
                raise RuntimeError(
                    f"Replicate predict failed ({r.status_code}): {r.text}"
                )
            pred = r.json()
            poll_url = pred["urls"]["get"]

            # 3. Poll until terminal state. Chatterbox typically finishes in <30s.
            deadline = time.monotonic() + 240
            while True:
                if time.monotonic() > deadline:
                    raise RuntimeError("Replicate prediction timed out after 4m.")
                await asyncio.sleep(2)
                r = await client.get(poll_url, headers=auth)
                r.raise_for_status()
                pred = r.json()
                if pred["status"] in ("succeeded", "failed", "canceled"):
                    break

            if pred["status"] != "succeeded":
                raise RuntimeError(
                    f"Replicate prediction {pred['status']}: {pred.get('error')}"
                )

            # 4. Download the generated audio.
            output = pred["output"]
            output_url = output[0] if isinstance(output, list) else output
            r = await client.get(output_url)
            r.raise_for_status()
            out_path.write_bytes(r.content)
    finally:
        # Always clean up the temp WAV — even on error.
        wav_path.unlink(missing_ok=True)

    return {
        "elapsed_s": round(time.perf_counter() - start, 2),
        "bytes": out_path.stat().st_size,
    }


# ---------------------------------------------------------------------------
# /clone endpoint
# ---------------------------------------------------------------------------


def _guess_ext(content_type: str | None) -> str:
    if not content_type:
        return ".webm"
    ct = content_type.lower()
    if "wav" in ct:
        return ".wav"
    if "mp4" in ct or "m4a" in ct:
        return ".m4a"
    if "mpeg" in ct or "mp3" in ct:
        return ".mp3"
    if "ogg" in ct:
        return ".ogg"
    return ".webm"


@app.post("/clone")
async def clone_endpoint(
    audio: UploadFile,
    target_text: str = Form(...),
) -> JSONResponse:
    audio_bytes = await audio.read()
    if not audio_bytes:
        raise HTTPException(400, "Empty audio upload.")
    if len(audio_bytes) < 10_000:
        raise HTTPException(
            400, "Audio is very short — please record at least a few seconds."
        )
    if not target_text.strip():
        raise HTTPException(400, "Missing target_text.")

    job_id = uuid.uuid4().hex[:12]
    ext = _guess_ext(audio.content_type)
    mime = audio.content_type or "audio/webm"
    sample_path = SAMPLES_DIR / f"{job_id}{ext}"
    sample_path.write_bytes(audio_bytes)

    el_out = OUT_DIR / f"{job_id}_elevenlabs.mp3"
    ch_out = OUT_DIR / f"{job_id}_chatterbox.wav"

    # Run both providers in parallel.
    results = await asyncio.gather(
        clone_elevenlabs(sample_path, mime, target_text, el_out),
        clone_chatterbox(sample_path, mime, target_text, ch_out),
        return_exceptions=True,
    )

    response: dict[str, Any] = {
        "job_id": job_id,
        "target_text": target_text,
        "original_url": f"/samples/{sample_path.name}",
        "elevenlabs": {"url": None, "error": None, "meta": None},
        "chatterbox": {"url": None, "error": None, "meta": None},
    }
    for key, idx, out_path in (
        ("elevenlabs", 0, el_out),
        ("chatterbox", 1, ch_out),
    ):
        result = results[idx]
        if isinstance(result, BaseException):
            response[key]["error"] = f"{type(result).__name__}: {result}"
        else:
            response[key]["url"] = f"/out/{out_path.name}"
            response[key]["meta"] = result

    return JSONResponse(response)


# ---------------------------------------------------------------------------
# Entry point for `python app.py`
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host=HOST, port=PORT, reload=True)
