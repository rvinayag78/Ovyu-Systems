# Ovyu — MVP Scope & Post-MVP Backlog

One place for what is in scope for MVP vs what is deferred. Update here when scope decisions change.

---

## Flow 1 — The Contract

### MVP TODO
- [ ] Keeper decline flow — add Decline button to `InviteClient.tsx` → `POST /contracts/decline/{token}` → `WITHDRAWN_BY_KEEPER`

### Post-MVP
- **12-month expiry timer** — `pending_expires_at` column already exists in `contracts` table. A scheduled SQS + Lambda job needs to flip `PENDING_KEEPER` / `PENDING_TC` → `EXPIRED` when the date passes. No expiry enforcement at MVP; contracts stay pending indefinitely.
- **Activate Transfer flow** — `/activate-transfer` currently sends a magic link then shows a "coming soon" page. Full Transfer activation belongs to Flow 3.
- **Suspended / Withdrawn contract states** — UI for `SUSPENDED_BY_MAKER` and `WITHDRAWN_BY_MAKER` actions not yet built.

---

## Flow 2 — The Upload

### MVP TODO
- [ ] **Prompt decks** — 10 unique questions per dimension needed in `DimensionClient.tsx` `PROMPTS` map. Currently 5 working-copy placeholders. User to provide content.

### Post-MVP
- **Voice cloning** — ElevenLabs integration for synthesised voice playback.
- **Video / facial expressions** — Voice row shows "Facial expressions and video coming soon."
- **Scheduled message delivery** — "For when" messages stored but not delivered on a trigger date.
- **Text auto-tagging async** — Currently synchronous (~1s). Move to SQS + worker; show "tagging…" chip.
- **StatusCircle threshold** — 3 entries = full is a placeholder. Confirm per-dimension target with product.
- **Voice playback in edit view** — Decorative waveform shown; no actual play/pause wired to S3 URL.
- **VoiceName / VoiceProfile manual fetch()** — Bypass `api.ts`; migrate for consistency.

---

## Flow 3 — The Transfer

### MVP TODO
- [ ] Nothing — Flow 3 is entirely Post-MVP.

### Post-MVP
- **Full Transfer activation** — TC goes to `/activate-transfer`, submits evidence, Keeper is notified and granted access.
- **Keeper access portal** — Keeper logs in and sees the Maker's uploaded content.
- **AI recall (Claude in Nitro Enclave)** — Keeper can converse with the AI trained on the Maker's uploads.
- **Transfer audit trail** — Immutable log of Transfer initiation, access grants, and timestamps.
