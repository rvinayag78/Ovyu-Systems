# Ovyu — TODO

---

## Phase 1 — Consent Flow (The Contract)

### Design & Brand
- [ ] Add color + typography tokens: `tailwind.config.ts` `theme.extend.colors.ovyu.*` + `:root` CSS vars in `globals.css`
  - `--ovyu-cream` `#F7F8F3` · `--ovyu-paper` `#FBFBF7` · `--ovyu-ink` `#1A1A1A` · `--ovyu-olive` `#916D21`
  - `--ovyu-callout` `#FBEDD3` · `--ovyu-border` `#E5E5E5` · `--ovyu-muted` `#9C9C9C`
  - `--ovyu-status-signed` `#4FB07D` · `--ovyu-status-pending` `#EC9B42` · `--ovyu-status-notified` `#9C9C9C`
- [ ] Swap in serif H1 font (Instrument Serif or Fraunces) — all H1s are currently sans-serif
- [ ] Create reusable `<Pill variant="primary|olive|outlined">` button component

### Landing & Registration (Screens 1–4)
- [ ] Rebuild Screen 1 (landing): cream bg, serif `"A bit of you."`, olive `Begin →` pill, 3-item right rail, `Activate Transfer` + `Log In` header, footer legal line
- [ ] Rebuild Screen 2 as one combined form: first name, last name, email, keeper name, keeper email, relationship select (`Partner/Parent/Child/Sibling/Best friend/Other` — `Other` reveals free-text input max 40 chars), awareness toggle (2 cards), TC block revealed on private path with yellow callout + TC name + TC email fields. CTA: `"Continue to verify email →"`
- [ ] Implement Email 1 (Maker verification): send on Screen 2 submit, 24h link, ink header bar + cream body
- [ ] Implement `GET /auth/verify?token=` route — confirms email, redirects to Screen 4 (password)
- [ ] Fix registration order: Screen 2 → Email 1 → verify click → Screen 4 (password) → Screen 5 (contract)
- [ ] Screen 4: add legal line below CTA; change CTA to `"Create account and review contract →"`

### The Contract (Screens 5 & 24)
- [ ] Replace checkbox signature with typed full-name input on Screen 5; validate case-insensitive trim match server-side; persist `typed_name`, `matched_against`, `ip`, `user_agent`, `signed_at` in `signatures`
- [ ] Branch Contract copy by `path` on Screen 24 (private variant): add TC row, add private-path clause, add yellow helper note `"Your Transfer Contact will also receive this contract to sign."`

### Contract Status (Screens 6a, 25a)
- [ ] Rebuild Screen 6a as status TABLE (Party / Role / Status / Date) — 2 rows: Maker (Signed, green) + Keeper (Pending, orange). Footer: `"The contract locks once both parties have signed. You'll receive an email to begin your upload."`
- [ ] Rebuild Screen 25a as 3-row status table: Maker (Signed, green) · Keeper (Notified at Transfer, grey) · TC (Pending, orange). Footer: `"The contract locks once the Transfer Contact has signed. Your Keeper will be notified when the Transfer is activated."`

### Keeper & TC Signing (Screens 7, 27, 8, 28)
- [ ] Magic-link auth: landing on `/invite/{token}` creates a short-lived session bound to that contract — no password/account required
- [ ] Unify Flow 2 (Keeper) + Flow 4 (TC) into one `<InviteSignPage role="keeper"|"tc">` component: two-card layout, typed-name input, 5 clauses for TC (verbatim), role-parameterised copy
- [ ] Add `Decline` secondary CTA on Screens 7 and 27; implement `POST /contracts/decline/{token}`
- [ ] Build `<SignedConfirmation>` component — shared by Screen 8 (Keeper) and Screen 28 (TC): yellow circle check, serif H1 `"You've signed."`, yellow callout `"What happens when the time comes"`

### Emails
- [ ] Email 3 — post-lock to Maker: subject `"Your contract is locked."`, CTA `"Begin my upload"`, path variants (aware: `"{{keeper_name}} has signed."` / private: `"{{tc_name}} has signed."`) — trigger from `contract_service.mark_locked`
- [ ] Bring Email 2 (Keeper invite) verbatim to spec copy; remove account requirement from invite link
- [ ] Bring Email 26 (TC designation) verbatim: add yellow numbered callout with 2 TC duties; subject `"{{maker_name}} has chosen you as their Transfer Contact."`
- [ ] Enforce ink header bar + cream body on all transactional emails

### Backend / Data
- [ ] Add `EXPIRED` value to `contracts.status` enum; Alembic migration
- [ ] Implement 12-month locking window: on Maker sign set `pending_expires_at = now() + interval '12 months'`; clear on `LOCKED`; daily Lambda/SQS job flips `PENDING_KEEPER`/`PENDING_TC` past expiry to `EXPIRED`; Maker reminder emails at T-30d and T+0
- [ ] Add missing endpoints: `POST /contracts/{id}/suspend`, `/resume`, `/withdraw`, `/keeper-withdraw`

### Pricing
- [ ] Build Screen 10 — `/plan` pricing page: 3 cards (Free / Standard / Legacy)
- [ ] `POST /plans/subscribe` endpoint (free-tier stub for now)

---

## Phase 2 — Maker Upload (Memory)

### Foundation + Voice Gate
- [ ] Alembic migration: `uploads`, `voice_recordings` tables
- [ ] Backend: presigned S3 URL endpoint for voice uploads
- [ ] Backend: `POST /upload/voice/name` and `POST /upload/voice/profile`
- [ ] Backend: `GET /upload/voice/status` and `GET /upload/progress`
- [ ] Frontend: `/upload` dashboard page skeleton
- [ ] Frontend: Voice recording component (browser MediaRecorder)
- [ ] Frontend: Section lock/unlock gate logic based on `voice_status`
- [ ] Lambda async worker: transcription stub (hook for AI layer — see AI TODO below)
- [ ] S3 bucket policy for Maker media; Terraform: Lambda role `uploads/` prefix permissions

### YOU (8 Dimensions)
- [ ] Alembic migration: `dimensions`, `dimension_entries` tables
- [ ] Backend: `PUT /upload/dimensions/{slug}` and `POST /upload/dimensions/{slug}/entries`
- [ ] Frontend: Dimension page/drawer for each of 8 slugs
- [ ] Frontend: Structured form per dimension + free-entry list (add / edit / delete)
- [ ] Frontend: Per-dimension progress indicator

### YOUR LIFE
- [ ] Alembic migration: `people`, `years`, `places` tables
- [ ] Backend: CRUD endpoints for people, years, places
- [ ] Frontend: People list + add-person form
- [ ] Frontend: History/Years list + add-entry form
- [ ] Frontend: Places list + add-place form

### FOR [KEEPER]
- [ ] Alembic migration: `keeper_messages`, `keeper_profile` tables
- [ ] Backend: `POST /upload/messages` (welcome + for-when) and `PUT /upload/keeper-profile`
- [ ] Frontend: Welcome message textarea
- [ ] Frontend: For-when message builder (trigger phrase + body)
- [ ] Frontend: 5-section keeper profile form (Who they are / Who they're becoming / What you want for them / What you want them to know / Advice)

### AI Layer (FUTURE — stubs only for now)
> Wire the endpoints to return empty/passthrough responses. Implement when AI layer is prioritised.
- [ ] `POST /upload/ai/prompts` — returns `[]`
- [ ] `POST /upload/ai/expand` — returns input unchanged
- [ ] For-when trigger suggestions — stub
- [ ] Keeper profile reflection prompts — stub
- [ ] ElevenLabs voice clone trigger — stub (fires after both recordings complete)
- [ ] RAG indexing: push dimension entries to pgvector after save — stub

---

## Phase 3 — Keeper Transfer (The Transfer)

> Flow 3 is not yet designed. Placeholder items only.

- [ ] Figma design for Flow 3 (The Transfer) — not started
- [ ] `POST /contracts/{id}/transfer/initiate` — TC submits evidence of Maker passing
- [ ] Keeper notification on Transfer initiation
- [ ] Keeper-side view: access to Maker's uploaded memories
- [ ] Transfer complete state (`TRANSFER_COMPLETE`)
- [ ] Mobile responsive pass

---

## Infrastructure / CI-CD
- [ ] Verify GitHub Actions CI runs on first PR to `staging`
- [ ] Confirm Amplify staging auto-deploy wired to `staging` branch
- [ ] Production custom domain — add in Amplify Domain Management when domain is ready

---

## Testing
- [ ] E2E tests for Phase 2 upload dashboard (after voice gate ships)
- [ ] Unit tests for voice upload presigned URL endpoint
- [ ] E2E: voice gate — sections locked before recording, unlocked after
- [ ] E2E: typed-signature validation (Phase 1 — match / mismatch cases)
- [ ] E2E: magic-link auth flow for Keeper and TC
