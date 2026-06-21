# Flow 1 — The Contract · Overview

---

## Plain English Glossary

| Term | What it means |
|------|---------------|
| **Maker** | The living person using Ovyu. They upload their voice, memories, and personality. They set up the Contract and decide who receives it. |
| **Keeper** | The one person the Maker has chosen to receive everything after they die. Could be a partner, child, sibling, best friend. The Keeper either knows they've been named (Aware path) or doesn't know until after the Maker passes (Private path). |
| **Transfer Contact (TC)** | A trusted third party — only used on the Private path. The Keeper doesn't know they've been named, so the TC is the person the Maker trusts to notify Ovyu when they pass. The TC has no access to the upload content, ever. They just initiate the handoff. |
| **The Contract** | A formal bilateral agreement between the Maker and either the Keeper (Aware path) or the TC (Private path). Nothing is uploaded until the Contract is locked. |
| **The Transfer** | The moment the Keeper gains access to everything the Maker left. Triggered by the TC (Private) or directly by the Maker (Aware, future flow). |
| **LOCKED** | The Contract is fully signed by both parties. The Maker can now begin uploading. |
| **Magic Link** | A secure single-use email link. Used to authenticate Keepers and TCs without requiring them to create a password. Expires in 15 minutes. |

---

## The Two Paths

```
                        ┌─────────────────────┐
                        │   Maker registers   │
                        │   and fills in the  │
                        │   contract form      │
                        └──────────┬──────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               │                                       │
    "Yes, my Keeper knows"                  "No, this is private"
               │                                       │
     [AWARE PATH]                             [PRIVATE PATH]
               │                                       │
    Keeper is emailed an                    TC is emailed an
    invitation to sign                      invitation to sign
               │                                       │
    Keeper reviews contract                 TC reviews contract
    and signs with their name              and signs with their name
               │                                       │
         Contract → LOCKED                       Contract → LOCKED
               │                                       │
    Maker gets email:                       Maker gets email:
    "Begin your upload"                     "Begin your upload"
               │                                       │
               └───────────────────┬───────────────────┘
                                   │
                         Maker begins Flow 2
                         (Memory Upload)
```

---

## Full Flow Chart (all 4 sub-flows)

```
MAKER REGISTRATION (shared entry point)
────────────────────────────────────────
  /                → Begin button
  /signup          → Fill: name, email, keeper name/email, relationship,
                     aware/private toggle, TC name/email (if private)
                     POST /contracts
  Email sent       → Maker checks inbox
  /verify?token=   → verifyToken() → stores reg token
  /register        → completeRegistration() → session created
  /plan            → Choose plan (Free / Standard / Legacy)


AWARE PATH — Maker side
────────────────────────
  /contract/sign   → Maker types name to sign
                     POST /contracts/{id}/sign
                     Status: PENDING_KEEPER
                     SES sends Keeper invitation email
  /contract/status → Polls every 5s for LOCKED
                     On LOCKED → "Continue →" → /upload/start


AWARE PATH — Keeper side
──────────────────────────
  Email arrives    → "Review and sign the agreement"
  /invite/{token}  → No Keeper session?
                       → /keeper/begin/{token} (name + email setup)
                       → Email sent → /keeper/verify?token=
                       → /keeper/register → /keeper/contract
                     Has session?
                       → Shows contract inline
  Signs            → POST /contracts/accept/{token}
                     Status: LOCKED
                     SES sends Maker "contract locked" email
  /invite/{token}  → Inline "You've signed." confirmation


PRIVATE PATH — Maker side
───────────────────────────
  /contract/sign   → Maker types name to sign
                     POST /contracts/{id}/sign
                     Status: PENDING_TC
                     SES sends TC designation email
  /contract/status → Shows Maker signed + TC pending


PRIVATE PATH — TC side
────────────────────────
  Email arrives    → TC opens invite link
  /invite/{token}  → Shows TC contract (responsibilities list)
  Signs            → POST /contracts/accept/{token}
                     Status: LOCKED
                     SES sends Maker "contract locked" email
  /invite/{token}  → Inline "You've signed." confirmation


ACTIVATE TRANSFER (future — post-passing)
───────────────────────────────────────────
  /activate-transfer → TC enters email → magic link sent
                       → /activate-transfer/coming-soon (not yet built)
```

---

## UI Spec

### Design system (from Figma file `MMjrYY4ixpDpWMKQ4FXHWP`)

| Element | Value |
|---------|-------|
| Page background | `#f8f7f5` (cream) |
| Primary text | `#1a1a1a` (black) |
| Secondary text | `#888888` (dark grey) |
| Muted / placeholder | `#9c9c9c` |
| Border / divider | `#e1e1e1` |
| Gold accent (section labels) | `#c9a84c` |
| Olive accent (Begin button only) | `#916d21` |
| Lavender (Maker cards) | `#6a4d7d` |
| Error | `#B4372C` |
| Success / Signed status | `#4FB07D` |
| Pending status | `#EC9B42` |
| Callout fill (post-sign) | `#fef3e2` |
| Callout border | `#c9a84c` |
| Heading font | Georgia, serif — italic, 64px |
| Body font | Helvetica Neue, Helvetica, Arial, sans-serif |
| Buttons | Black pill (`border-radius: 9999px`), 62px tall |
| Cards | White, `border: 2px solid #e1e1e1`, `border-radius: 15px` |
| Canvas width | 1920px (`minWidth: 1920px` on every page) |
| Header height | 103px |
| Footer height | 103px |

### Layout pattern (all contract pages)
Two-column grid: `1130px` contract card + `613px` sign panel, `49px` gap, centered in a `1804px` container.

### Inline CSS only — no Tailwind.

---

## Backend Table Flow

### Tables involved

| Table | Purpose |
|-------|---------|
| `users` | One row per Maker or Keeper who creates an account |
| `contracts` | Core record — one per Maker/Keeper pair, holds path, status, all names/emails |
| `signatures` | One row per signing event (Maker, Keeper, TC) — stores typed name, IP, timestamp |
| `invitation_tokens` | Single-use hashed token sent to Keeper or TC via email |
| `magic_link_tokens` | Single-use hashed token for passwordless login (`login` or `tc` mode) |
| `auth_attempts_unknown` | Tracks failed login attempts by IP |

### State machine — `contracts.status`

```
  Registration
       │
       ▼
  (contract created, no status yet)
       │
  Maker signs
       │
       ├── AWARE  path ──► PENDING_KEEPER ──► (Keeper signs) ──► LOCKED
       │
       └── PRIVATE path ──► PENDING_TC ────► (TC signs)     ──► LOCKED
                                                                    │
                                         ┌──────────────────────────┤
                                         │
                              SUSPENDED_BY_MAKER   (Maker pauses)
                              WITHDRAWN_BY_MAKER   (Maker cancels)
                              WITHDRAWN_BY_KEEPER  (Keeper declines)
                              TRANSFER_PENDING     (TC initiates Transfer)
                              TRANSFER_COMPLETE    (Keeper has access)
                              EXPIRED              (12 months, no counter-sign)
```

### What happens to each table per event

| Event | Tables written |
|-------|---------------|
| Maker submits registration form | `users` (Maker row), `contracts` (status = draft) |
| Maker verifies email | `users.email_verified = true` |
| Maker completes registration | `users.cognito_sub` linked, session created |
| Maker signs contract | `signatures` (role=maker), `contracts.status` → PENDING_KEEPER or PENDING_TC, `invitation_tokens` (for Keeper or TC) |
| Keeper/TC opens invite link | `invitation_tokens.used = true` |
| Keeper sets up account | `users` (Keeper row created) |
| Keeper/TC signs | `signatures` (role=keeper or tc), `contracts.status` → LOCKED, `contracts.locked_at` set |
| TC requests magic link | `magic_link_tokens` (mode=tc) |

---

## Pending Issues

### 1. `MagicLinkForm` — unstyled (affects `/login` and `/activate-transfer`)
The login and TC activation pages use CSS class names (`ovyu-page`, `ovyu-btn--primary`, `ovyu-input`, `ovyu-field`) and CSS variables (`var(--ovyu-font-serif)`, `var(--ovyu-ink-soft)`) that are not defined anywhere in the codebase. These pages will render completely unstyled.

**Fix:** Rewrite `MagicLinkForm.tsx` to inline styles matching all other Flow 1 components.

---

### 2. `Header` missing `minWidth: 1920px`
The `<header>` element in `Header.tsx` has no `minWidth`. The inner content container uses `maxWidth: 1800px, margin: "0 auto"`, which is correct — but on sub-1920px viewports the header bar itself doesn't extend full width, breaking visual alignment between the OVYU logo, CONTACT in the footer, and YOU bar.

**Fix:** Add `minWidth: "1920px"` to the `<header>` element in `Header.tsx`.

---

### 3. `/contract/status` page — likely dead code
The file `frontend/src/app/contract/status/page.tsx` exists but is not referenced from any page in the flow. The Maker's status view (waiting on Keeper) is handled differently in the current code.

**Fix:** Confirm whether it's used, then delete if not.

---

### 4. Keeper decline flow — not wired
The UX spec (Screen 7) calls for a `"Decline"` button that POSTs to `/contracts/decline/{token}` → status `WITHDRAWN_BY_KEEPER` + notifies Maker. The current `InviteClient.tsx` has no Decline button.

**Fix:** Add Decline button and `api.declineInvitation(token)` call to `InviteClient.tsx`.

---

### 5. `/activate-transfer` — TC transfer activation not built
After the TC signs the Contract, their future responsibility is to go to `/activate-transfer` when the Maker passes and initiate the Transfer. That page currently just sends a magic link and then shows a "coming soon" page. The actual Transfer activation flow belongs to a future Flow 3.

**Status:** By design — not a bug.

---

### 6. 12-month expiry timer — not implemented
The spec says contracts expire to `EXPIRED` if the counterparty doesn't sign within 12 months. The `pending_expires_at` column exists in the `contracts` table but no background job or Lambda worker enforces the transition.

**Fix:** SQS + Lambda scheduled job to flip `PENDING_KEEPER`/`PENDING_TC` → `EXPIRED` when `pending_expires_at` is passed.
