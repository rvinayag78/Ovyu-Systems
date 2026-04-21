# Flow 1 — Gap Analysis: Spec vs Code

**Spec:** `docs/flow-1-contract-spec.md` (verbatim-aligned to the 20 source PNG frames)
**Code:** `ovyu/` (Next.js 15 frontend + FastAPI backend)
**Date:** 2026-04-19 (rev 2 — aligned to corrected screen map)

This document lists what the current code does, what the spec now asks for after the verbatim pass, and what is missing or wrong. It is written so Claude Code (or any developer) can work through it top to bottom.

**Flow model (confirmed 2026-04-19, revision 2):**

Four actor-based flows, driven by one question on Screen 2 (`does your Keeper know?`):

- **Flow 1** — Maker, aware path. Maker signs, Keeper is emailed. Contract sits in `PENDING_KEEPER` for up to **12 months**. Times out to `EXPIRED`.
- **Flow 2** — Keeper signs. Completes Flow 1. Structurally identical to Flow 4.
- **Flow 3** — Maker, private path. Maker signs, Transfer Contact is emailed. Contract sits in `PENDING_TC` for up to **12 months**. Times out to `EXPIRED`.
- **Flow 4** — TC signs. Completes Flow 3. Structurally identical to Flow 2.

Screen 6a is the Maker's waiting view for Flow 1. Screen 6b (Email 2) is what starts the Keeper's workflow (Flow 2). Screens 25a and 25b are two progress snapshots of the Maker's waiting view on Flow 3 — ship as one component for v1. **Flow 2 and Flow 4 share one signing component**, parameterised by role (`keeper` or `tc`). Post-passing Transfer timelines are out of scope for Flow 1.

---

## 1. Headline summary

| Area | Status |
|------|--------|
| End-to-end path coverage (aware + private) | Partially present, but screen shapes are wrong |
| Data model (Contract, Signature, InvitationToken) | Mostly good — 3 columns missing |
| Brand (cream bg, serif H1, olive `Begin`, ink CTAs, yellow callouts) | **Missing** — generic white / zinc / sans-serif |
| Color tokens wired up (`--ovyu-*`) | **Missing** |
| Screen 2 is one combined form (Maker + Keeper + awareness toggle + TC block) | **Wrong — split across multiple pages** |
| Email 1 (Maker verification) before password | **Missing** — `/register` goes straight to password |
| Screen 6a / 25a / 25b as **status tables** with Party / Role / Status / Date | **Wrong — uses text + spinner** |
| Keeper full name captured at contract creation | **Missing — only email** |
| TC full name captured at contract creation | **Missing — only email** |
| Typed-signature validation (Maker, Keeper, TC) | **Missing — checkbox only** |
| Private-path additional clause on Screen 24 | **Missing — copy is identical to aware** |
| Magic-link auth for Keeper / TC | **Missing — ovyu account required** |
| Email 3 (post-lock Maker email) | **Missing** — no post-lock email at all |
| Screen 10 (Choose your plan / pricing) | **Missing** |
| Suspend / Withdraw / Transfer endpoints | **Missing (status enum values exist but unreachable)** |
| 12-month locking window (`pending_expires_at`, `EXPIRED` status, daily expiry job, T-30d + T+0 Maker reminder emails) | **Missing — no pending_expires_at column, no EXPIRED status, no expiry job, no reminder emails** |
| Flow 2 and Flow 4 implemented as one shared signing component | **Missing — Keeper and TC signing live in the same file but are not generalised** |

Overall: the **state machine and plumbing are good**, but the **UI, copy, brand, screen composition, and path-specific behaviour are wrong or missing**. Roughly 70% of the spec is unmet on the frontend side; roughly 40% on the backend side.

---

## 2. Per-screen findings

Screen numbering in this section matches the corrected spec (`docs/flow-1-contract-spec.md`). Where the spec says a screen is an **email** rather than a page, that is called out.

### Screen 1 — Landing

| Field | Spec | Code (`frontend/src/app/page.tsx`) |
|-------|------|------------------------------------|
| Background | Cream `#F7F8F3` | `bg-white` |
| H1 (serif) | `"A bit of you."` | `"ovyu"` (sans-serif wordmark) |
| Sub + body | `"Keep yourself for the one person who needs you most."` + 3-sentence paragraph | `"Your legacy, for the one who matters."` |
| Primary CTA | `"Begin →"` — olive/gold `#916D21` pill (the one and only olive button in the flow) | `"Get started"` — `bg-zinc-900` black |
| Right rail (3 numbered items 01/02/03) | Required | Missing |
| Header right | `"Activate Transfer"` link + `"Log In"` pill | Only a `Sign in` link |
| Footer legal line | Verbatim string | Missing |

**Status: MISMATCH.**

---

### Screen 2 — One combined registration form (aware default)

| Field | Spec | Code (`frontend/src/app/contract/new/page.tsx` + `/register`) |
|-------|------|---------------------------------------------------------------|
| Shape | **One page** with: `About you` (first, last, email), `Who is this for?` (keeper name, keeper email, relationship), awareness toggle (2 checkbox cards on the right), optional TC block revealed on private | **Split** across `/register` (name+email+password) and `/contract/new` (email + path toggle) |
| Keeper **full name** field | Required (matches Screen 7 signature) | **Missing** |
| `Your relationship to them` select | Required. Options: `Partner`, `Parent`, `Child`, `Sibling`, `Best friend`, `Other`. Picking `Other` reveals a free-text input (`"In a word or two"`, required, max 40 chars). | **Missing** |
| Awareness toggle | 2 single-select checkbox cards with verbatim labels `"Yes, they know and we're doing this together."` / `"No, this is something I'm doing privately."` | Two toggle cards with different labels |
| CTA | `"Continue to verify email →"` | `"Continue"` |

**Status: MISMATCH (structural).** The whole page composition needs to be rebuilt to a single combined form.

---

### Screen 3 — Email 1 · Maker verification (transactional email)

| Field | Spec | Code |
|-------|------|------|
| Email sent on Screen 2 submit | Required (subject `"Confirm your email address"`, 24 h link) | **Missing** — registration commits the Cognito user immediately |
| Header bar | Ink bar with cream `ovyu` wordmark | Missing |
| CTA | `"Verify my email"` | Missing |

**Status: MISSING.** An email template + verification flow is required before the password screen.

---

### Screen 4 — Create a password

| Field | Spec | Code (`frontend/src/app/register/page.tsx`) |
|-------|------|---------------------------------------------|
| Arrives from Email 1 verify link | Required | Not the current flow — `/register` is entered directly from landing |
| H1 (serif) | `"Create your account."` | `"Create your account"` — ok |
| Fields | `Create a password` + `Confirm password` + helper | Password + confirm — ok |
| Legal line below CTA | `"By creating an account you agree to Ovyu's Terms of Use and Privacy Policy."` | Missing |
| CTA | `"Create account and review contract →"` | `"Create account"` |

**Status: PARTIAL.** Screen exists but its trigger (Email 1) and downstream link to Screen 5 need to be wired up. Also name capture currently lives here, but per the spec it should move to Screen 2.

---

### Screen 5 — The Contract (Maker signs)

| Field | Spec | Code (`frontend/src/app/contract/sign/page.tsx`) |
|-------|------|--------------------------------------------------|
| Background | Cream | White |
| H1 (serif) | `"Your contract."` | `"Sign the contract"` |
| Left card | `"Ovyu Agreement"` with full legal block, Maker/Keeper/Relationship/Access begins/Access duration/Transferable/Interaction limit, two paragraphs, and footer | Generic 5-clause `CONTRACT_TEXT` constant |
| Signature field | **Typed full legal name**, validates case-insensitive trim match against captured Maker name | **Checkbox** only |
| Date field | Read-only server timestamp | Missing |
| CTA | `"Sign and continue →"` disabled until match | `"Sign the Contract"` |

**Status: MISMATCH.** The largest single change in this screen is the signature pattern.

---

### Screen 6a — Contract status (aware, status TABLE)

| Field | Spec | Code (`frontend/src/app/contract/status/page.tsx`) |
|-------|------|----------------------------------------------------|
| H1 | `"Contract status."` | `"Waiting for your Keeper to accept"` |
| Design | **Table** with columns Party · Role · Status · Date; 2 rows: Maker (Signed green) and Keeper (Pending orange) | Spinner + sub-text; no table |
| Row status styling | Green / orange text + filled dot at left | None |
| Footer copy | `"The contract locks once both parties have signed. You'll receive an email to begin your upload."` | Missing |
| Poll | 5 s — `GET /contracts/{id}` | ✓ already 5 s |

**Status: MISMATCH (structural).**

---

### Screen 6b — Email 2 · Keeper invitation (transactional email)

| Field | Spec | Code (`backend/app/services/email_service.py`) |
|-------|------|------------------------------------------------|
| Subject | `"{{maker_name}} has created something for you."` | Close, not verbatim |
| Body | 3 paragraphs, verbatim in spec | Close but not verbatim |
| CTA | `"Review and sign the agreement"` → magic link to `/invite/{token}` | Link present, but link requires ovyu account to act on it |
| Header bar | Ink bar with cream `ovyu` wordmark | Not enforced |

**Status: PARTIAL.** Copy must be brought verbatim to match, and the target page must accept magic-link auth.

---

### Screen 7 — Keeper lands and reviews+signs

| Field | Spec | Code (`frontend/src/app/invite/[token]/InviteClient.tsx`) |
|-------|------|-----------------------------------------------------------|
| Auth | **Magic link**, no account | Requires ovyu account (explicit message in client: `"You will need an ovyu account"`) |
| H1 (serif) | `"{{maker_name}} has created something for you."` | `"You have been named as a Keeper"` |
| Two-card layout (left = contract, right = sign) | Required | Single column — no two-card layout |
| Contract clauses | Verbatim block — 5 body lines + footer line | 4-clause `KEEPER_TEXT` — close but not verbatim, different structure |
| Signature | Typed name matching `keeper_name` | Checkbox only |
| Primary CTA | `"I accept and sign"` (black pill) | `"Accept as Keeper"` |
| Secondary | `"Decline"` outlined | Missing |

**Status: MISMATCH.**

---

### Screen 8 — "You've signed." (Keeper confirmation)

| Field | Spec | Code |
|-------|------|------|
| Standalone confirmation view with yellow circle check, H1 `"You've signed."`, and a yellow `--ovyu-callout` callout titled `"What happens when the time comes"` | Required | **Missing** — current flow returns the Keeper to a generic `/invite/{token}/thank-you` or similar |

**Status: MISSING.**

---

### Screen 9 — Email 3 · Contract locked (transactional email to Maker)

| Field | Spec | Code |
|-------|------|------|
| Subject `"Your contract is locked."` + body with `"Begin my upload"` CTA | Required | **Missing** — no post-lock email exists in `email_service.py` |
| Body variants for aware vs private subflows | Required (see §6 in spec) | Missing |

**Status: MISSING.**

---

### Screen 10 — Choose your plan

| Field | Spec | Code |
|-------|------|------|
| New page `/plan` with 3 pricing cards (Free, Standard, Legacy) | Required | **Missing** — no pricing page in the frontend |

**Status: MISSING.** This is brand-new build.

---

### Screen 21 — Private path selected on Screen 2

| Field | Spec | Code |
|-------|------|------|
| Same page as Screen 2, but `"No, this is something I'm doing privately."` selected + **yellow TC callout revealed** | Required | Toggle exists, callout missing |
| Callout copy | `"Because your Keeper is not aware, we need someone you trust to confirm the Transfer when the time comes. They will have no access to your upload."` | Short inline caption only |
| TC fields | `Their name`, `Their email` | Only `Their email` present |

**Status: MISMATCH.**

---

### Screen 22 — Email 1 on private path

Same as Screen 3 — missing.

**Status: MISSING.**

---

### Screen 23 — Create a password on private path

Same as Screen 4. Same PARTIAL status. Critically, **on private path the server must NOT send any email to the Keeper** — only to the TC. Verify `contract_service.create_contract` branches on `path`.

---

### Screen 24 — The Contract (private variant)

| Field | Spec | Code |
|-------|------|------|
| Left card gains a row `"Transfer Contact: {{tc_name}}"` | Required | Missing |
| Left card body appends 1 clause: `"Your Keeper is not aware of this upload. Your Transfer Contact has been designated to confirm the Transfer when the time comes. Your Keeper will be notified at that point."` | Required | Missing — `CONTRACT_TEXT` is identical for both paths |
| Right card yellow helper note | `"Your Transfer Contact will also receive this contract to sign."` | Missing |

**Status: MISMATCH.** Branch Contract copy by `contract.path`.

---

### Screen 25a — Contract status (private, TC invitation sent)

| Field | Spec | Code |
|-------|------|------|
| 3-row status table: Maker (Signed, green), Keeper (Notified at Transfer, grey), TC (Pending, orange) | Required | **Missing** — no 3-row table, no grey "Notified at Transfer" label |
| Footer | `"The contract locks once the Transfer Contact has signed. Your Keeper will be notified when the Transfer is activated."` | **Missing** |
| Poll → `LOCKED` | Row 3 flips to `Signed`; page transitions to Screen 28 copy for the TC, stays on status table for the Maker | **Partial** (polling exists, row UI missing) |

**Status: MISMATCH.**

---

### Screen 25b — Contract status (private, TC actively signing)

Same component as 25a. Optional enhancement: surface an "In review" label on row 3 when we detect that the TC has opened their invitation email. **Implementation guidance: ship 25a and 25b as the same page for v1.**

**Status: MISMATCH — covered by Screen 25a implementation.**

---

### Screen 26 — Email · Transfer Contact designation (transactional email)

| Field | Spec | Code |
|-------|------|------|
| Subject `"{{maker_name}} has chosen you as their Transfer Contact."` + yellow numbered callout with 2 TC duties (evidence of passing, confirm Keeper name/email) + CTA `"Review the contract and accept this role"` | Required | Generic TC invitation exists, but without the yellow callout and without the numbered format. (Old "3. up to 2 months" duty has been retired; post-passing timeline is Flow 3.) |

**Status: MISMATCH.**

---

### Screen 27 — Transfer Contact signs

| Field | Spec | Code (`invite/[token]/InviteClient.tsx` — `TC_TEXT`) |
|-------|------|-------------------------------------------------------|
| H1 (serif) | `"{{maker_name}} has named you as their Transfer Contact."` | Different |
| Two-card layout | Required | Missing |
| **5 numbered clauses** (verbatim in spec — reduced from 6 after removing the post-passing "2 months" clause) | Required | Only 4 clauses present |
| Clause count | **5 clauses** (old clause 4 with the "2 months" timeline has been removed; post-passing timeline is deferred to Flow 3) | 4 clauses, none matching |
| Signature | Typed name matching `tc_name` | Checkbox only |
| Secondary | `"Decline"` outlined | Missing |

**Status: MISMATCH.** Add the 2 missing clauses plus typed-signature validation.

---

### Screen 28 — "You've signed." (TC confirmation)

Identical component to Screen 8. Same callout copy. Reuse one `<SignedConfirmation>` component for both.

**Status: MISSING.**

---

## 3. State model diff

Compared spec to `backend/app/models/contract.py` and `backend/app/schemas/contract.py`.

| Field | Spec | Code | Note |
|-------|------|------|------|
| `id` | ✓ | ✓ UUID | |
| `maker_id` | ✓ | ✓ | |
| `relationship` | **Required by spec** (Screen 2) | **Missing** | Needed to render on Screen 5 "Relationship" row. |
| `keeper_name` | **Required by spec** | **Missing** (only `keeper_email`) | Needed for Screen 7 signature match. |
| `keeper_email` | ✓ | ✓ | |
| `keeper_id` | ✓ | ✓ | |
| `tc_name` | **Required on the private path** | **Missing** | Needed for Screen 27 signature match (Flow 4). |
| `tc_email` | ✓ | ✓ | |
| `tc_id` | ✓ | ✓ | |
| `path` | `aware \| private` | ✓ enum | |
| `status` enum | 9 values (adds `EXPIRED`) | ✓ 8 present, `EXPIRED` **Missing** | Add `EXPIRED` for the 12-month timeout. |
| `pending_expires_at` | **Required** — set on Maker sign to `now() + 12 months`, cleared on `LOCKED` | **Missing** | New column. Drives Flow 1 / Flow 3 expiry. |
| `created_at` / `updated_at` / `locked_at` | ✓ | ✓ | |

**`signatures` table** — spec requires that the typed-name string is stored alongside the canonical name, plus IP and user agent. Verify that columns `typed_name`, `matched_against`, `ip`, `user_agent` all exist.

**`invites` table** — spec requires `token_hash` (sha256 of the raw token) and `consumed_at`. Verify.

---

## 4. API endpoints diff

Endpoints expected in `backend/app/api/v1/endpoints/contracts.py` (and `auth.py`):

| Endpoint | Spec action | Status |
|----------|-------------|--------|
| `POST /contracts` | Maker creates contract **and** send Email 1 | Creation ok, but Email 1 is missing |
| `GET /verify?token=` | Confirm Maker email, redirect to Screen 4 | **Missing** |
| `POST /auth/register` | Set password, create Cognito user | ✓ (but step order needs to move after Email 1 verify) |
| `POST /contracts/{id}/sign` | Maker sign, validate typed name | Exists; **missing typed-name validation** |
| `GET /contracts/{id}` | Read contract + status | ✓ |
| `GET /contracts/invite/{token}` | Public invitation preview | ✓ |
| `POST /contracts/accept/{token}` | Keeper or TC accept with typed name | Exists; **missing typed-name validation and magic-link session** |
| `POST /contracts/decline/{token}` | Keeper or TC decline | **Missing** |
| `POST /contracts/{id}/suspend` | Maker suspend | **Missing** |
| `POST /contracts/{id}/resume` | Maker resume | **Missing** |
| `POST /contracts/{id}/withdraw` | Maker withdraw | **Missing** |
| `POST /contracts/{id}/keeper-withdraw` | Keeper withdraw | **Missing** |
| `POST /contracts/{id}/transfer/initiate` | TC (or Maker) initiate | **Missing** (placeholder for Flow 3) |
| `POST /plans/subscribe` | Screen 10 free-tier subscription | **Missing** |

---

## 5. Email templates diff

File: `backend/app/services/email_service.py`

| Email | Spec | Code |
|-------|------|------|
| Email 1 — Maker verification (Screens 3 and 22) | Required | **Missing** |
| Email 2 — Keeper invite (Screen 6b) | Required — kicks off the Keeper workflow | Present but not verbatim; link requires an ovyu account |
| Email 26 — TC designation | Required (single variant, always sign required) | Present but not verbatim, no yellow callout, no 2-item numbered list |
| Email 3 — Post-lock confirmation (Screen 9) | Required; preheader swaps `keeper_name` ↔ `tc_name` by path | **Missing** |
| All emails: ink header bar + cream body + two-line footer `"{context}" / "ovyu.com · {reason}"` | Required | Not enforced |

---

## 6. Flow coverage (actor-based)

| Flow | Actor | Path | Sign required? | Outcome | Code status |
|------|-------|------|----------------|---------|-------------|
| 1 | Maker | Aware | n/a (Maker has already signed) | Waits in `PENDING_KEEPER`; transitions to `LOCKED` on Flow 2, or `EXPIRED` after 12 months | Backend sets `PENDING_KEEPER` ok; **no `pending_expires_at`, no `EXPIRED` transition, no expiry job, no Maker reminder emails** |
| 2 | Keeper | Aware | Yes — magic-link sign | Flips contract to `LOCKED` | Reachable, but UI copy wrong, no typed-signature, no magic-link auth (still requires ovyu account) |
| 3 | Maker | Private | n/a (Maker has already signed) | Waits in `PENDING_TC`; transitions to `LOCKED` on Flow 4, or `EXPIRED` after 12 months | Backend sets `PENDING_TC` ok; **same gaps as Flow 1 — no expiry mechanism** |
| 4 | TC | Private | Yes — magic-link sign, always | Flips contract to `LOCKED` | Reachable, but UI wrong (no TC callout, no 5 clauses, no typed-signature, no Screen 28). **Should share component with Flow 2.** |

Implementation note: Flow 2 and Flow 4 are the same screens with role-based copy. Build a single `<InviteSignPage role="keeper" | "tc">` and render both from it.

---

## 7. Brand / design tokens

| Token | Spec value | Code status |
|-------|------------|-------------|
| `--ovyu-cream` (`#F7F8F3`) | Page bg everywhere | **Missing** — uses `bg-white` |
| `--ovyu-ink` (`#1A1A1A`) | Primary text + black CTAs + email header bar | Partially (uses `bg-zinc-900`) |
| `--ovyu-olive` (`#916D21`) | The one Begin button + section labels | **Missing** |
| `--ovyu-callout` (`#FBEDD3`) | Yellow callouts on Screens 8, 21, 28, and in Email 26 | **Missing** |
| `--ovyu-border` (`#E5E5E5`) | Inputs + cards + tables | Not enforced |
| `--ovyu-muted` (`#9C9C9C`) | Helper + footer text | Not enforced |
| `--ovyu-status-signed` (`#4FB07D`) / `--ovyu-status-pending` (`#EC9B42`) / `--ovyu-status-notified` (`#9C9C9C`) | Status table row styling | **Missing** — no status table component yet |
| Serif H1 font | Instrument Serif / Fraunces / Canela | **Missing** — all sans |
| Email header bar | Ink bar with cream wordmark | **Missing** |
| Pill radius | 9999 px on all CTAs | Mostly using `rounded-md`, not pills |

**Status: MISSING across the board.** Add `tailwind.config.ts` `theme.extend.colors.ovyu.*`, a `:root` CSS variable block in `globals.css`, and a reusable `<Pill>` button component.

---

## 8. Terminology check

No forbidden words found in code (no `Creator`, `Recipient`, `consent_relationships`, `death verification`). Terminology (`Maker`, `Keeper`, `Transfer Contact`, `Contract`, `Transfer`) is used correctly throughout backend and frontend.

**Status: PASS.**

---

## 9. Top 12 priority fixes (ordered)

1. **Wire up color + typography tokens.** Add `theme.extend.colors.ovyu.{cream,paper,ink,ink-soft,muted,border,olive,callout,callout-border,status-signed,status-pending,status-notified,link,focus,error,success}` in `tailwind.config.ts`, mirror in `:root` in `globals.css`, swap in editorial serif for H1 (Instrument Serif or similar) and sans for body. Create a `<Pill variant="primary|olive|outlined">` component and use it everywhere.
2. **Rebuild Screen 1 (landing)** with cream bg, serif `"A bit of you."`, olive `Begin →` pill, 3-item numbered right rail, header `Activate Transfer` + `Log In`, footer legal line. Verbatim copy per spec §3.
3. **Rebuild Screen 2 as one combined form.** Fields: first name, last name, email, keeper name, keeper email, relationship select (with `Other` revealing a free-text `"In a word or two"` input), awareness toggle (2 cards). When the Maker picks `"No, this is something I'm doing privately."`, reveal the yellow TC callout and the TC name + email fields. CTA `"Continue to verify email →"`. Move password creation *out* of this page.
4. **Implement Email 1 (Maker verification) + `/verify?token=` route.** Registration must go: Screen 2 → Email 1 → verify click → Screen 4 (password) → Screen 5 (contract).
5. **Add columns `relationship`, `keeper_name`, `tc_name`, `pending_expires_at`** to `contracts`, plus `EXPIRED` value on the `status` enum. Alembic migration; update Pydantic schemas and `contract_service.create_contract`.
6. **Implement the 12-month locking window.** On Maker sign, set `pending_expires_at = now() + interval '12 months'`. Add a daily SQS/Lambda job (`expire_pending_contracts`) that flips any `PENDING_KEEPER` / `PENDING_TC` rows past `pending_expires_at` to `EXPIRED`. On `LOCKED`, clear `pending_expires_at`. Add Maker reminder emails at T-30d and T+0.
7. **Implement typed-signature validation** on Screens 5, 7, 27. Replace checkbox with a single-line full-name input; validate case-insensitive trim match server-side. Persist `typed_name`, `matched_against`, `ip`, `user_agent`, `signed_at` in `signatures`.
8. **Branch Contract copy by `path`** on Screen 5 / 24. Private variant adds the TC/Keeper-unaware clause and the yellow right-card helper note.
9. **Rebuild Screen 6a / 25a as a status table** (Party / Role / Status / Date) with colored status text + dot. Screen 6a is the Maker's waiting view for Flow 1. Screen 25a is the Maker's waiting view for Flow 3 (3 rows instead of 2). Polling stays at 5 s.
10. **Magic-link auth for Keeper and TC.** Token in `invites`, sha256 hash, expires, consumed. Landing on `/invite/{token}` creates a short-lived session bound to that contract only, no password. Screen 6b (Email 2) is the Keeper's entry; Email 26 is the TC's entry.
11. **Unify Flow 2 and Flow 4 into one `<InviteSignPage role="keeper" | "tc">` component.** Same two-card layout, same typed-signature pattern, same post-sign screen. Copy and clauses are parameterised by role. Implement Email 3 (post-lock) on the `LOCKED` transition — preheader `"{{keeper_name}} has signed."` on aware path, `"{{tc_name}} has signed."` on private. Trigger from `contract_service.mark_locked`.
12. **Build Screens 8, 28, and 10.** Screens 8 and 28 render the same `<SignedConfirmation>` component (identical copy). Screen 10 is the new `/plan` pricing page with 3 cards.

### Lower priority (next sprint)

- Add `suspend` / `resume` / `withdraw` / `keeper-withdraw` / `transfer/initiate` endpoints so the unreachable status enum values become reachable.
- Copy audit: bring Email 2 and Email 26 verbatim to the spec strings. Add the ink header bar.
- Add the `Decline` secondary CTA on Screens 7 and 27.
- Optional enhancement: track TC-email-opened telemetry and render Screen 25b's "In review" row label.

---

## 10. Open questions

**Resolved** (as of 2026-04-19):

- ✅ **Flow model is 4 actor-based flows** — Flow 1 (Maker, aware, waiting), Flow 2 (Keeper signs), Flow 3 (Maker, private, waiting), Flow 4 (TC signs). Flow 2 and Flow 4 are the same component parameterised by role.
- ✅ **Locking window = 12 months.** `pending_expires_at` column, `EXPIRED` status, daily expiry job, Maker reminder emails at T-30d and T+0. Private path always requires TC signing.
- ✅ **Post-passing timeline is out of scope for Flow 1.** Old "up to 2 months" clauses on Screen 26 callout and Screen 27 clause 4 are removed; that timeline belongs to Flow 3 "The Transfer".
- ✅ Screen 25a row 3 = `Pending` (orange). `Informed` label is retired.
- ✅ Screens 25a and 25b are two snapshots of the same Maker-facing status page — ship as one component.
- ✅ Screens 8 and 28 share one component with identical copy.
- ✅ **Card surface color** on Screens 5, 7, 24, 27 = paler cream `#FBFBF7` (exposed as `--ovyu-paper`). Not pure white.
- ✅ **Relationship `Other` behaviour.** Picking `Other` reveals a free-text input (`"In a word or two"`, required, max 40 chars). The typed word is stored in `contracts.relationship`; the literal word `"Other"` is never stored.

**Still open:**

_None._ All Flow 1 design decisions are resolved.

---

## 11. How to feed this to Claude Code

See the prompt at the bottom of `docs/flow-1-contract-spec.md`, or use the short version below.

---

*Gap analysis produced by comparing code in `ovyu/` against the Flow 1 UX spec (verbatim-aligned revision). All code findings were verified by direct reads of the files listed; spec-side claims are drawn from `docs/flow-1-contract-spec.md`.*
