# OVYU Voice Cloning Comparison Spike

A throwaway side-by-side test of **ElevenLabs** vs **Chatterbox** (via Replicate). Open a webpage, read a passage aloud, then listen to the same target sentence rendered by both providers — blind, A/B — and decide which becomes OVYU's primary voice provider behind the adapter interface.

This is **not** production code. No auth, no database, no encryption, no AWS. Lives in `spikes/voice-clone-comparison/`, gets deleted once a decision is made.

## What you need

- Python 3.12+
- A microphone and a modern browser (Chrome or Safari recommended)
- An **ElevenLabs** API key — Starter tier ($5/mo) or higher *is required for Instant Voice Cloning*. The free tier does not include cloning.
  - Get one at https://elevenlabs.io/app/settings/api-keys
- A **Replicate** API token (free credit on signup is plenty for this spike — Chatterbox costs ~$0.01–$0.05 per generation)
  - Get one at https://replicate.com/account/api-tokens

## Setup

```bash
cd /Users/rvinayagam/Downloads/rvinayag-Projects/ovyu/spikes/voice-clone-comparison

# Copy the env template and fill in both keys
cp .env.example .env
$EDITOR .env

# Install deps — either uv (fast) or plain pip
uv sync
# or:
# python -m venv .venv && source .venv/bin/activate && pip install -e .
```

## Run

```bash
uv run uvicorn app:app --reload
# or, inside the venv:
# uvicorn app:app --reload
```

Open <http://127.0.0.1:8000/> in your browser.

Verify the keys loaded by visiting <http://127.0.0.1:8000/healthz> — both flags should be `true`.

## How to use

1. Read the passage shown on screen — pick a new one with the **New passage** button if you want a different tone
2. Click **Record**, read the passage aloud at a normal pace (~30–60s), then **Stop**
3. Listen to the preview — re-record if you weren't happy
4. Click **Clone & Compare** — both providers run in parallel; typical wait is 10–30 seconds
5. The page renders **three audio players**:
   - **Your original recording** — the reference
   - **Clone A** and **Clone B** — both providers, **labels randomized** so you compare blind
6. Listen, then click **Reveal which is which**

## Listening rubric

For each clone, score 1–5 on:

- **Identity fidelity** — does it sound like *you*?
- **Naturalness** — pauses, breath, intonation feel human?
- **Emotional appropriateness** — would this voice be comforting to a grieving Keeper?
- **Artifacts** — any robotic tones, glitches, mispronunciations?

Worth doing 2–3 different recordings (different passages, ideally a second speaker like Leila) to test robustness before deciding.

## Cost & quota notes

- **ElevenLabs**: each comparison consumes characters from your monthly quota (just the target sentence — ~80 chars). Voice slots in your library: this app creates an Instant Voice Clone, generates one render, then **deletes** the clone so it doesn't accumulate. If the deletion fails for any reason, manually clean up at https://elevenlabs.io/app/voice-lab.
- **Replicate**: pay-per-second, Chatterbox runs ~5–20s on an L40S GPU. Expect $0.01–$0.05 per comparison.

## Files

```
spikes/voice-clone-comparison/
├── README.md            this file
├── .env.example         template — copy to .env, fill in keys
├── .gitignore           protects .env, samples/, out/
├── pyproject.toml       deps
├── app.py               FastAPI server + both provider calls
├── static/
│   └── index.html       single-page UI: record, upload, blind A/B
├── samples/             your uploaded recordings (gitignored)
└── out/                 generated clone audio (gitignored)
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Mic permission denied | Browser blocked it for `127.0.0.1` | Click the padlock in the address bar, allow mic |
| `ElevenLabs clone failed (401)` | Bad / missing API key | Recheck `.env` and restart `uvicorn` |
| `ElevenLabs clone failed (402)` / quota error | Free tier — Instant Voice Cloning not enabled | Upgrade to Starter ($5/mo) |
| `Replicate predict failed (401)` | Bad / missing token | Recheck `.env`, restart |
| Replicate prediction timed out | Cold-start on the model | Try again — second run is usually fast |
| `playerA` shows no audio, error visible | That provider failed; the other still ran | See the error message; the working one still plays |

## After this spike

Once you've picked a winner, the production work is:

1. Define a `VoiceProvider` interface in `backend/app/services/voice_provider/`
2. Implement the chosen provider as the first adapter
3. Self-host the model inside OVYU's AWS account (the data-residency requirement does not apply to this spike but **does** apply to production — voice data must not transit a third-party SaaS)
4. Wire to Flow 2 (Memory Upload) and Flow 3 (Transfer)

See `/Users/rvinayagam/.claude/plans/can-you-read-the-zany-barto.md` for the planning record.
