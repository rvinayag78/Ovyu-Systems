# Flow 1 — The Contract · UX Spec

> **Source of truth** for Flow 1. Every string inside `"` in a Copy row is verbatim from the frames and must not be rewritten. Color values are sampled from the exported PNGs.
>
> Source frames: FigJam board `ovyu • ux frames`, file key `MMjrYY4ixpDpWMKQ4FXHWP`. Exported PNGs live in the UX spec folder (`1.png` … `10.png`, `21.png` … `28.png`, 20 frames total).

---

## 0. Flow structure

Flow 1 is modelled as **four actor-based flows**, driven by one question on Screen 2: is the Keeper aware that they have been named?

| Flow | Actor | Path | What happens | Screens (in order) |
|------|-------|------|--------------|--------------------|
| **Flow 1** | Maker | Aware (Maker said **Yes**) | Maker signs, Keeper is emailed, contract sits in `PENDING_KEEPER` for up to **12 months**. Times out to `EXPIRED` if Keeper never signs. | 1 · 2 · 3 (Email 1) · 4 · 5 · 6a · 6b (Email 2) · 9 (Email 3) · 10 |
| **Flow 2** | Keeper | Aware | Keeper opens the magic link, reads the contract, types name, signs. Completes Flow 1 and flips contract to `LOCKED`. | 7 · 8 |
| **Flow 3** | Maker | Private (Maker said **No**) | Maker signs, Transfer Contact is emailed, contract sits in `PENDING_TC` for up to **12 months**. Times out to `EXPIRED` if TC never signs. | 1 · 21 · 22 (Email 1) · 23 · 24 · 25a → 25b · 26 (Email) · 9 (Email 3) · 10 |
| **Flow 4** | TC | Private | TC opens the magic link, reads the contract, types name, signs. Completes Flow 3 and flips contract to `LOCKED`. | 27 · 28 |

**Flow 2 and Flow 4 are structurally the same.** Same two-card layout, same typed-signature pattern, same confirmation screen. The only things that change are the actor label ("Keeper" vs "Transfer Contact"), the contract copy, and which email brought the actor in. Implement them as **one shared signing component** parameterised by role.

Notes:

- **Locking window = 12 months.** The clock starts when the Maker signs. If the counterparty (Keeper on aware, TC on private) has not signed within 12 months, the contract transitions to `EXPIRED`. The Maker is emailed when the clock starts, when there is ~30 days left, and when it expires.
- **Screens 3, 6b, 22, 26 and 9 are transactional emails**, not in-product pages. They are delivered via SES and open a magic link back to ovyu.com.
- **Screen 2 is one combined page** with Maker details, Keeper details, "does your Keeper know?" toggle, and (when `No` is chosen) the Transfer Contact block.
- **Screen 10 is the pricing page** (`Choose your plan`), reached after the post-lock handoff email.
- **Flow 3 is entered when the Maker answers `"No, this is something I'm doing privately."` on Screen 2.** The Keeper is never contacted during Flow 1. The Transfer Contact must co-sign. The Contract only moves to `LOCKED` once the TC has signed.
- **Screens 25a and 25b are two progress states of the same Maker-facing status page** in Flow 3. 25a is what the Maker sees right after they sign, while the TC invitation is pending. 25b is what the Maker sees once the TC is actively signing (optionally gated on a TC-opened-email signal; safe to ship as the same page as 25a for v1).
- **Post-passing Transfer timeline is out of scope for Flow 1.** It belongs to Flow 3 "The Transfer" and is documented there.

---

## 1. Brand and global rules

| Element | Rule |
|---------|------|
| Page background | Cream (`--ovyu-cream`, `#F7F8F3`). Never pure white on page-level surfaces. |
| H1 font | Editorial serif (e.g. Instrument Serif, Fraunces, or Canela). Large, generous line height (1.05–1.15). |
| Body font | Geometric sans serif (e.g. Inter, Söhne, or system-ui as fallback). |
| Primary CTA color | **Black** (`--ovyu-ink`, `#1A1A1A`) on cream for every button in the flow **except** the single **`Begin`** button on Screen 1, which is **olive / gold** (`--ovyu-olive`, `#916D21`). This is the only olive button in the entire flow. |
| Button radius | Pill (`border-radius: 9999px`). |
| Email header | Solid dark bar (`--ovyu-ink`, `#1A1A1A`) across the top of every transactional email, with the `ovyu` wordmark in cream. |
| Callouts | Soft yellow fill (`--ovyu-callout`, `#FBEDD3`) with charcoal text. Used on Screens 8, 21, 25b, 28, and inside the TC email. |
| Voice | Warm, first-person, plain English. No legalese unless the Contract text requires it. |
| Emoji and decorative icons | None. The only decorative element allowed is the tiny yellow-circle check on Screens 8 and 28. |
| Mobile | All screens must work at 375 px width. |

### 1a. Color tokens

All hex values were sampled from the exported frames. Use these as the canonical design tokens. Tailwind or shadcn consumers should map them under `theme.extend.colors.ovyu.*`.

| Token name | Hex | RGB | Used for |
|------------|-----|-----|----------|
| `--ovyu-cream` | `#F7F8F3` | 247, 248, 243 | Page background on every Flow 1 screen. |
| `--ovyu-paper` | `#FBFBF7` | 251, 251, 247 | Card surfaces on the contract screens (5, 7, 24, 27) when a card sits on top of cream. A **paler cream**, not pure white — slightly warmer than `#FFFFFF` and clearly lighter than `--ovyu-cream`. |
| `--ovyu-ink` | `#1A1A1A` | 26, 26, 26 | Primary text, primary buttons (black CTAs), email header bar. |
| `--ovyu-ink-soft` | `#373737` | 55, 55, 55 | Secondary text, table body. |
| `--ovyu-muted` | `#9C9C9C` | 156, 156, 156 | Helper copy under inputs, footer fine print, placeholder text. |
| `--ovyu-border` | `#E5E5E5` | 229, 229, 229 | Input borders, card borders, table dividers. |
| `--ovyu-olive` | `#916D21` | 145, 109, 33 | The one and only `Begin` button on Screen 1. Also used for section-heading accents on Screen 2 / 21 (`About you`, `Who is this for?`, `Transfer Contact`). |
| `--ovyu-callout` | `#FBEDD3` | 251, 237, 211 | Yellow callout fill — Screens 8, 21 TC notice, 25b footer, 26 email callout, 28 yellow-circle-check background. |
| `--ovyu-callout-border` | `#E8DCA8` | 232, 220, 168 | Optional 1 px inner border inside the yellow callout on Screen 21 (subtle). |
| `--ovyu-status-signed` | `#4FB07D` | 79, 176, 125 | "Signed" label in the status table (Screens 6a, 25a, 25b). Appears as colored text plus a small filled dot. |
| `--ovyu-status-pending` | `#EC9B42` | 236, 155, 66 | "Pending" label plus dot in the status table. |
| `--ovyu-status-notified` | `#9C9C9C` | 156, 156, 156 | "Notified at Transfer" label (grey) in Screen 25a / 25b for the Keeper row. |
| `--ovyu-link` | `#1A1A1A` | 26, 26, 26 | Inline links. Underline on hover; weight 500. |
| `--ovyu-focus` | `#916D21` | 145, 109, 33 | Focus ring (2 px outline, 2 px offset). Matches the olive accent. |
| `--ovyu-error` | `#B4372C` | 180, 55, 44 | Form validation error text and 1 px error border on inputs. (Not sampled from frames — derived to harmonize with the palette.) |
| `--ovyu-success` | `#4FB07D` | 79, 176, 125 | Reuse of `--ovyu-status-signed`. Toast confirmations after sign. |

#### Typography tokens

| Token | Value |
|-------|-------|
| `--ovyu-font-serif` | `'Instrument Serif', 'Fraunces', Georgia, serif` |
| `--ovyu-font-sans` | `'Inter', 'Söhne', system-ui, sans-serif` |
| H1 size | clamp(40 px, 5vw, 72 px), line-height 1.05, letter-spacing −0.01 em |
| H2 size | 28 px / 1.15 |
| H3 / section label | 14 px uppercase, tracking 0.12 em, color `--ovyu-olive` |
| Body size | 16 px / 1.55 |
| Helper / fine print | 13 px / 1.5, color `--ovyu-muted` |

#### Radius and spacing tokens

| Token | Value |
|-------|-------|
| `--ovyu-radius-sm` | 8 px (inputs, small chips) |
| `--ovyu-radius-md` | 16 px (cards) |
| `--ovyu-radius-pill` | 9999 px (buttons, pills, status dots) |
| Page gutter (desktop) | 80 px |
| Page gutter (mobile) | 24 px |
| Card padding | 32 px (desktop), 24 px (mobile) |

---

## 2. Auth rules (global)

- **Maker** must have an ovyu account. Screens 3 (Email 1 verification) → 4 (Create a password) enforce this. Sign-in on return visits uses email + password or magic link.
- **Keeper** (Screens 7 and 8) lands from **Email 2** via a **magic link**. No ovyu account is required. Clicking the link authenticates the Keeper for that one Contract only. Do **not** show a password screen.
- **Transfer Contact** (Screens 26 and 27) lands from **Email 26 (designation)** via a **magic link**. No account required.
- **Signature validation**: on Screens 5, 7/8 and 27 the signer must type their own full legal name into a single-line input. The server must validate the typed string matches the captured name (case-insensitive, trimmed, unicode-normalised). Store the typed string, the matched-against name, the IP, the user agent, and a server timestamp in the `signatures` table.

---

## 3. Aware path — Flow 1 (Maker waits) and Flow 2 (Keeper signs)

### Screen 1 — Landing (shared with all subflows)

| Field | Value |
|-------|-------|
| Route | `/` |
| Background | `--ovyu-cream` |
| Header | Left: `ovyu` wordmark in `--ovyu-ink`. Right: text link `"Activate Transfer"` + pill button `"Log In"` (outlined, ink border). |
| H1 (serif) | `"A bit of you."` |
| Sub-heading | `"Keep yourself for the one person who needs you most."` |
| Body | `"Ovyu lets you upload your voice, stories, and personality for one named person to access when you're gone. Private. Consensual. Yours."` |
| Primary CTA | `"Begin →"` — olive pill (`--ovyu-olive`), cream text, 48 px tall. |
| Right rail (3 numbered items) | `01  The Contract` / `"You and your Keeper agree on the terms before anything begins."` · `02  Your Upload` / `"You share your voice, memories, and stories at your own pace."` · `03  The Transfer` / `"When the time comes, your Keeper receives what you left for them."` |
| Footer | `CONTACT · ABOUT · OVYU DOES NOT SHARE, SELL, OR RETAIN PERSONAL DATA, INCLUDING UPLOAD, CONTRACT, AND CONVERSATIONS, BEYOND WHAT IS REQUIRED TO OPERATE THIS SERVICE. · © 2026 OVYU · MANAGE COOKIES · LEGAL · PRIVACY` (all uppercase, `--ovyu-muted`, 12 px). |
| Post-action | `Begin` → Screen 2. |

### Screen 2 — One combined registration form (aware path default)

| Field | Value |
|-------|-------|
| Route | `/contract/new` |
| H1 (serif) | `"Let's get started."` |
| Sub | `"First, a little about you. Then we'll set up who this is for."` |
| Section 1 label | `About you` — olive, uppercase 14 px |
| Section 1 inputs | `First name` (required) · `Last name` (required) · `Your email` (required, email) |
| Section 2 label | `Who is this for?` — olive |
| Section 2 inputs | `Keeper's full name` (required, placeholder `"First and last name"`) · `Keeper's email` (required, placeholder `"email@example.com"`) · `Your relationship to them` (select, placeholder `"Select relationship"`, options `Partner`, `Parent`, `Child`, `Sibling`, `Best friend`, `Other`, helper `"e.g. Partner, Parent, Child, Sibling, Best friend, Other"`). When `Other` is picked, a free-text input appears directly below it, labelled `"In a word or two"`, required, max 40 chars. The typed value is stored in `contracts.relationship`; the literal word `"Other"` is never stored by itself. |
| Right-side block | H3 `"Does your Keeper know about this?"` + 2 single-select checkbox cards: `"Yes, they know and we're doing this together."` (sets `path = aware`, hides TC block) and `"No, this is something I'm doing privately."` (sets `path = private`, reveals the TC block — see Screen 21) |
| Primary CTA | `"Continue to verify email →"` — black pill |
| Post-action | POST `/contracts` with `{first_name, last_name, maker_email, keeper_name, keeper_email, relationship, path, tc_name?, tc_email?}`. Send Email 1 (Maker verification). Go to a "check your email" state that waits for the verification click. |
| Store | `maker.full_name = first_name + " " + last_name` (used to match the Maker's typed signature on Screen 5). |

### Screen 3 — Email 1 · Maker verification (transactional email)

> This is **not** a page. It is an email, sent from `no-reply@ovyu.com` via SES at the end of Screen 2.

| Field | Value |
|-------|-------|
| Label in frame | `Email 1 // Maker Verification` |
| Subject | `"Confirm your email address"` |
| Preheader | `"You're one step away from starting your Ovyu."` |
| Header bar | Ink bar (`--ovyu-ink`) with cream `ovyu` wordmark. |
| H1 | `"Confirm your email address"` |
| Body para 1 | `"You're one step away from starting your Ovyu."` |
| Body para 2 | `"Click the button below to verify your email. This link expires in 24 hours. If you didn't create an Ovyu account, you can safely ignore this email."` |
| CTA | `"Verify my email"` — black pill, links to `/verify?token=…` |
| Footer line 1 | `"This button takes you back to ovyu.com to confirm your account and continue."` |
| Footer line 2 | `"ovyu.com · This is a transactional email. You are receiving this because you created an account."` |
| Token | 24-hour expiry, single use. On click, mark `maker.email_verified = true` and redirect to Screen 4. |

### Screen 4 — Create a password

| Field | Value |
|-------|-------|
| Route | `/register` (arrives here via Email 1 link) |
| H1 (serif) | `"Create your account."` |
| Sub | `"Your email is verified. Now create a password to secure your account."` |
| Fields | `Create a password` (required, 8+ chars) · `Confirm password` (required, must match) |
| Helper under password | `"At least 8 characters. Use a mix of letters, numbers, and symbols."` |
| Primary CTA | `"Create account and review contract →"` — black pill |
| Legal copy below CTA | `"By creating an account you agree to Ovyu's Terms of Use and Privacy Policy."` |
| Post-action | POST `/auth/register`. On success, Cognito session is created. Redirect to Screen 5. |

### Screen 5 — The Contract (Maker signs, aware variant)

| Field | Value |
|-------|-------|
| Route | `/contract/sign` |
| H1 (serif) | `"Your contract."` |
| Sub | `"Read through carefully. This is between you and your Keeper."` |
| Left card title | `"Ovyu Agreement"` |
| Left card header | `"Party A (Maker) and Party B (Keeper)"` |
| Left card fields | `"Maker: {{maker_name}}"` · `"Keeper: {{keeper_name}}"` · `"Relationship: {{relationship}}"` · `"Access begins: Upon the Transfer, as confirmed by the Transfer Contact or Maker."` · `"Access duration: Lifetime unless otherwise specified."` · `"Transferable: No"` · `"Interaction limit: No limit"` |
| Left card body | `"The Maker retains full ownership and may pause, edit, or withdraw this upload at any time before the Transfer is activated. The Keeper may not alter the upload in any way."` · `"All data is stored securely and used solely to deliver this upload to the named Keeper. No data is shared, sold, or retained beyond the purpose of this agreement."` |
| Left card footer | `"Your digital signature carries the same intent as a handwritten signature within the Ovyu platform."` |
| Right card title | `"Sign as Maker"` |
| Right card body | `"By signing, you confirm you have read and agree to the contract."` |
| Signature field | Label `"Full legal name"`, placeholder `"Type your full name here"` |
| Date field | `"Date"` — read-only, server timestamp (e.g. `"April 5, 2026"`) |
| Primary CTA | `"Sign and continue →"` — black pill, disabled until typed name matches (case-insensitive, trimmed) |
| Post-action | POST `/contracts/{id}/sign`. Status → `PENDING_KEEPER` (aware) or `PENDING_TC` (private + co-sign) or direct `LOCKED` (private + informed only). Send Email 2 (Keeper invite, aware) or Email 26 (TC, private). Go to Screen 6a (aware) or 25a/25b (private). |

### Screen 6a — Contract status (aware, waiting on Keeper)

| Field | Value |
|-------|-------|
| Route | `/contract/status` |
| H1 (serif) | `"Contract status."` |
| Sub | `"You've signed. We're waiting on your Keeper."` |
| Table columns | `Party` · `Role` · `Status` · `Date` |
| Row 1 | `Maker (you)` · `Party A` · **`Signed`** (green dot + `--ovyu-status-signed` text) · `{{maker_signed_date}}` (e.g. `"April 5, 2026"`) |
| Row 2 | `Keeper` · `Party B` · **`Pending`** (orange dot + `--ovyu-status-pending` text) · `"Invitation sent {{invite_sent_date}}"` |
| Footer | `"The contract locks once both parties have signed. You'll receive an email to begin your upload."` |
| Poll | GET `/contracts/{id}` every 5 s. On `LOCKED`, trigger a gentle transition (no full page change) — the Keeper row updates to `Signed` and a single black `"Continue →"` appears, which sends Email 3 and routes to Screen 10. |
| Secondary | Small text link `"Withdraw Contract"` bottom-left (opens confirmation modal — POST `/contracts/{id}/withdraw`, status → `WITHDRAWN_BY_MAKER`). |

### Screen 6b — Email 2 · Keeper invitation (transactional email)

> Not a page. Sent immediately when the Maker signs on Screen 5 (aware path only).

| Field | Value |
|-------|-------|
| Label in frame | `Email 2 // Keeper Invitation` |
| Subject | `"{{maker_name}} has created something for you."` |
| Header bar | Ink bar, cream `ovyu` wordmark. |
| H1 | `"{{maker_name}} has created something for you."` |
| Body para 1 | `"They've chosen you as their Keeper on Ovyu."` |
| Body para 2 | `"Ovyu is a private platform where a person leaves a piece of themselves, their voice, stories, and memories, for one person they love. {{maker_name}} chose you."` |
| Body para 3 | `"Before anything begins, you'll need to review and sign a short agreement. It explains what you're receiving, on what terms, and what it means to say yes."` |
| CTA | `"Review and sign the agreement"` — black pill, links to `/invite/{token}` (magic link, no login) |
| Footer line 1 | `"This button takes you to ovyu.com where you can read the full contract and sign it online."` |
| Footer line 2 | `"ovyu.com · You received this because someone named you as their Keeper. If this is a mistake, you may decline."` |

### Screen 7 — Keeper lands on the invite page and reviews

| Field | Value |
|-------|-------|
| Route | `/invite/{token}` (magic-link session, no sign-in UI) |
| H1 (serif) | `"{{maker_name}} has created something for you."` |
| Sub | `"Review the agreement below. Take your time. Sign only if you're ready to accept."` |
| Left card | `"Ovyu Agreement"` · `"Party A (Maker) and Party B (Keeper)"` · `"Maker: {{maker_name}}"` · `"Keeper: You"` · `"Relationship: {{relationship}}"` |
| Left card body | `"By accepting, you agree to receive the Maker's upload upon the Transfer. You understand that the upload is the personal creation of the Maker and may not be altered, shared, or transferred."` · `"Access begins: Upon the Transfer"` · `"Access duration: Lifetime unless specified"` · `"You may withdraw your acceptance at any time before the Transfer is activated."` · `"Ovyu stores all data records and uses it solely to deliver this upload to you. No data is shared or sold."` |
| Left card footer | `"If you decline, the Maker will be notified. No data will be stored on your behalf. You can always accept later if the Maker re-sends the invitation."` |
| Right card title | `"Sign as Keeper"` |
| Right card body | `"By signing, you accept the terms of this agreement."` |
| Signature | `"Full legal name"` input, placeholder `"Type your full name"`. Validates against `keeper_name`. |
| Date | Server timestamp, read-only. |
| Primary CTA | `"I accept and sign"` — black pill, disabled until match. POST `/contracts/accept/{token}`. |
| Secondary CTA | `"Decline"` — outlined, ink border. POST `/contracts/decline/{token}` → status `WITHDRAWN_BY_KEEPER`, notifies Maker by email. |
| Post-action (accept) | Contract → `LOCKED`. Show the Keeper Screen 8's confirmation layout (inline), then send Email 3 to Maker. |

### Screen 8 — "You've signed." (Keeper confirmation, Flow 2)

| Field | Value |
|-------|-------|
| Route | `/invite/{token}/done` |
| Hero | A small yellow-filled circle (`--ovyu-callout`) with a charcoal check mark, 64 px. |
| H1 (serif) | `"You've signed."` |
| Sub | `"The contract between you and {{maker_name}} is now in place."` |
| Yellow callout (`--ovyu-callout` fill) | Heading `"What happens when the time comes"` · Body `"When {{maker_name}} passes, you will need to go to ovyu.com/activate-transfer. There you will submit evidence of their passing and confirm the details for their Keeper. Once you do that, we take it from there."` · `"There is no deadline. Do this when you are ready and able."` |
| Footer copy | `"You will always be the one to decide when you are ready to access this. Nothing happens without your confirmation."` |
| Primary CTA | None — this is a final state for the Keeper. |

> **Copy decision (resolved):** Screens 8 and 28 share the **exact same** callout copy. Both speak to "you" — the signer — stepping up when the Maker passes. Flow 2 Keepers and Flow 4 Transfer Contacts both hit `ovyu.com/activate-transfer`, submit evidence, and confirm details. Implement this as a single shared component reused on `/invite/{token}/done`.

### Screen 9 — Email 3 · Contract locked (transactional email to Maker)

> Not a page. Sent on `LOCKED`.

| Field | Value |
|-------|-------|
| Label in frame | `Email 3 // Contract Locked. Maker invited to begin upload.` |
| Subject | `"Your contract is locked."` |
| Preheader | `"{{keeper_name}} has signed. You're ready to begin."` |
| Header bar | Ink bar, cream wordmark. |
| H1 | `"Your contract is locked."` |
| Sub | `"{{keeper_name}} has signed. You're ready to begin."` |
| Body para 1 | `"Everything is in place. When you're ready, start with a welcome message to {{keeper_name}} a short video or voice recording that will be the first thing they receive."` |
| Body para 2 | `"You can take as long as you need. Come back whenever you like. There's no deadline."` |
| CTA | `"Begin my upload"` — black pill, links to `/plan` (Screen 10) |
| Footer line 1 | `"You can return to your upload at any time by logging in to ovyu.com."` |
| Footer line 2 | `"ovyu.com · This is a transactional email sent because your Keeper completed the contract."` |

> Path variants: the subject and structure are identical. On the private path (completed by Flow 4), substitute `"{{tc_name}} has signed."` for the preheader and the sub-heading; the CTA, body, and footers are unchanged.

### Screen 10 — Choose your plan

| Field | Value |
|-------|-------|
| Route | `/plan` |
| H1 (serif) | `"Choose your plan"` |
| Sub | `"Start free. Everything you build here is yours."` |
| Card 1 — Free | Title `"Free"` · Price `"$0"` · Tag `"Forever free"` · List: `"• 1 Keeper"` · `"• Voice upload"` · `"• Story prompts"` · `"• Basic contract"` · CTA `"Start free"` (black pill) |
| Card 2 — Standard | Title `"Standard"` · Price `"Coming soon"` · List: `"• Everything in Free"` · `"• Unlimited uploads"` · `"• Photo & video"` · `"• Extended contract options"` · CTA `"Notify me"` (outlined) |
| Card 3 — Legacy | Title `"Legacy"` · Price `"Coming soon"` · List: `"• Everything in Standard"` · `"• Priority Transfer support"` · `"• Dedicated Transfer Contact assist"` · `"• Lifetime storage"` · CTA `"Notify me"` (outlined) |
| Post-action | `Start free` → creates the Maker's free-tier subscription row and advances into Flow 2 (Memory Upload, out of scope for this spec). |

---

## 4. Private path — Flow 3 (Maker waits) and Flow 4 (TC signs)

### Screen 21 — Screen 2, private path selected

Same layout as Screen 2, with two differences:

1. The right-side question `"Does your Keeper know about this?"` has `"No, this is something I'm doing privately."` selected, which flips `path = private`.
2. **Reveals a yellow callout (`--ovyu-callout`, with `--ovyu-callout-border` 1 px inner border)** below the "Who is this for?" section:

> **Transfer Contact** — `"Because your Keeper is not aware, we need someone you trust to confirm the Transfer when the time comes. They will have no access to your upload."`

Below the callout, two fields appear:

- `Their name` (required, placeholder `"First and last name"`)
- `Their email` (required, placeholder `"email@example.com"`)

All three blocks (Maker, Keeper, TC) must be filled before the CTA is enabled. CTA text is unchanged: `"Continue to verify email →"`.

### Screen 22 — Email 1 · Maker verification (private path)

Identical to Screen 3. Same email, same token flow.

### Screen 23 — Create a password (private path)

Identical to Screen 4.

> **Server rule:** on the private path, **no email is sent to the Keeper** at any point in Flow 1. The Keeper only hears from ovyu after the Transfer is activated in Flow 3.

### Screen 24 — The Contract (Maker signs, private variant)

Same layout as Screen 5, with these deltas:

- Left card header becomes `"Party A (Maker) and Party B (Keeper) · Transfer Contact"`.
- Add row `"Transfer Contact: {{tc_name}}"` under the Keeper row.
- Append the following clause to the left card body, directly after the "All data is stored…" sentence:

> `"Your Keeper is not aware of this upload. Your Transfer Contact has been designated to confirm the Transfer when the time comes. Your Keeper will be notified at that point."`

- Right card adds a yellow helper note (`--ovyu-callout`) above the CTA: `"Your Transfer Contact will also receive this contract to sign."`
- Primary CTA and behaviour unchanged. On sign, server creates the TC invite token, sends Email 26 (TC designation), and routes the Maker to Screen 25a. Contract status is set to `PENDING_TC`.

### Screen 25a — Contract status (private, TC invitation sent)

| Field | Value |
|-------|-------|
| Route | `/contract/status` |
| H1 (serif) | `"Contract status."` |
| Sub | `"You've signed. We're waiting on your Keeper and Transfer Contact."` |
| Table columns | `Party` · `Role` · `Status` · `Date` |
| Row 1 | `Maker (you)` · `Party A` · `Signed` (green) · `{{maker_signed_date}}` |
| Row 2 | `Keeper` · `Party B` · `Notified at Transfer` (`--ovyu-status-notified`, grey) · `"Will receive Transfer email"` |
| Row 3 | `Transfer Contact` · `Designated contact` · **`Pending`** (`--ovyu-status-pending`, orange) · `"Invitation sent {{invite_sent_date}}"` |
| Footer | `"The contract locks once the Transfer Contact has signed. Your Keeper will be notified when the Transfer is activated."` |
| Poll | Every 5 s. Row 3 advances to `Signed` (green) once the TC submits Screen 27, and the page transitions to Screen 28 copy. |

### Screen 25b — Contract status (private, TC actively signing)

Same layout as 25a. Same table, same footer. 25b represents the state where the TC has opened their invite email and is actively on Screen 27 (optionally surfaced if we record email-opened telemetry).

**Implementation note for v1:** ship 25a and 25b as the **same component**. Only row-status labels change based on the contract state (`PENDING_TC` → `LOCKED`). Telemetry-driven "TC is reading the contract" is a later enhancement.

### Screen 26 — Email · Transfer Contact designation (transactional email)

> Not a page. Sent on Maker sign when `path = private`.

| Field | Value |
|-------|-------|
| Label in frame | `Email // Transfer Contact Designation` |
| Subject | `"{{maker_name}} has chosen you as their Transfer Contact."` |
| Preheader | `"This comes with a responsibility. Please read carefully."` |
| Header bar | Ink bar, cream wordmark. |
| H1 | `"{{maker_name}} has chosen you as their Transfer Contact."` |
| Sub | `"This comes with a responsibility. Please read carefully."` |
| Body para 1 | `"{{maker_name}} is using Ovyu to leave a piece of themselves for someone they love. They have named you as their Transfer Contact, the person responsible for initiating the Transfer when the time comes."` |
| Body para 2 | `"As Transfer Contact, your role is specific:"` |
| Yellow callout (`--ovyu-callout`, numbered) | `"1. When {{maker_name}} passes, provide Ovyu with evidence of their passing (such as a death certificate or official notice)."` · `"2. Confirm the Keeper's name and email so we can reach them."` (The post-passing timeline is out of scope for Flow 1; defer to Flow 3 "The Transfer".) |
| CTA | `"Review the contract and accept this role"` — black pill, links to `/invite/{token}` |
| Footer line 1 | `"This button takes you to ovyu.com where you can read the full contract and sign."` |
| Footer line 2 | `"ovyu.com · You received this because {{maker_name}} named you as their Transfer Contact. If this is a mistake, you may decline."` |

### Screen 27 — Transfer Contact signs

| Field | Value |
|-------|-------|
| Route | `/invite/{token}` (TC magic link) |
| H1 (serif) | `"{{maker_name}} has named you as their Transfer Contact."` |
| Sub | `"Read through the contract below. By signing, you accept the responsibility of initiating the Transfer when the time comes."` |
| Left card title | `"Ovyu Transfer Contact Agreement"` |
| Left card header | `"Maker: {{maker_name}}"` · `"Transfer Contact: You"` |
| Intro line | `"By signing this agreement, you confirm that you:"` |
| Clause 1 | `"Understand that the Maker has created a private upload on Ovyu for their named Keeper."` |
| Clause 2 | `"Accept the responsibility of notifying Ovyu when the Maker passes, by providing evidence of passing (such as a death certificate or official notice)."` |
| Clause 3 | `"Will confirm the Keeper's name and email at the time of notification so the Transfer can be delivered."` |
| Clause 4 | `"Will not access, alter, or share any content of the upload."` |
| Clause 5 | `"All information you provide is handled with strict confidentiality and used solely to facilitate the Transfer."` |
| Note | The post-passing completion timeline is intentionally omitted here. It belongs to Flow 3 "The Transfer" and will be surfaced to the TC at the point the Transfer is initiated, not at contract signing. |
| Left card footer | `"If you decline, the Maker will be notified. You can always accept later if the Maker re-sends the invitation."` |
| Right card title | `"Accept and sign"` |
| Right card body | `"By signing, you confirm you have read and accept this responsibility."` |
| Signature | `"Your full legal name"` input, `"Type your full name"`. Validates against `tc_name`. |
| Date | Server timestamp. |
| Primary CTA | `"I accept and sign"` — black pill |
| Secondary CTA | `"Decline"` — outlined, ink border |
| Post-action (accept) | POST `/contracts/accept/{token}`. Status → `LOCKED`. Send Email 3 to Maker. Show Screen 28 inline to the TC. |

### Screen 28 — "You've signed." (TC confirmation)

Identical to Screen 8 (same component, same callout copy). The "When the time comes" callout reads the same to Keepers on the aware path (Flow 2) and Transfer Contacts on the private path (Flow 4) — both are the people who will hit `ovyu.com/activate-transfer`. Reuse the single `<SignedConfirmation>` component.

---

## 5. State model (target)

### `contracts` table

```
id                                uuid, pk
maker_id                          uuid, fk users (Cognito sub)
maker_signature_id                uuid, fk signatures, nullable
relationship                      text, required
keeper_name                       text, required
keeper_email                      text, required
keeper_id                         uuid, fk users, nullable
keeper_signature_id               uuid, fk signatures, nullable
tc_name                           text, nullable (required when path = private)
tc_email                          text, nullable
tc_id                             uuid, fk users, nullable
tc_signature_id                   uuid, fk signatures, nullable
path                              enum ('aware','private')
status                            enum (see below)
pending_expires_at                timestamptz, nullable (= maker_signed_at + 12 months; set on Maker sign, cleared on LOCKED)
created_at, updated_at, locked_at timestamptz
```

### `status` enum

```
PENDING_KEEPER        — Maker signed; waiting for Keeper (aware path). Expires 12 months from Maker sign.
PENDING_TC            — Maker signed; waiting for TC (private path). Expires 12 months from Maker sign.
LOCKED                — Both required parties signed; pending_expires_at is cleared.
EXPIRED               — The 12-month locking window elapsed without the counterparty signing; contract is void.
SUSPENDED_BY_MAKER    — Maker paused.
WITHDRAWN_BY_MAKER    — Maker ended; void.
WITHDRAWN_BY_KEEPER   — Keeper ended; void.
TRANSFER_PENDING      — Transfer initiated (Flow 3, not in scope).
TRANSFER_COMPLETE     — Keeper has access (Flow 3).
```

**Locking window rules:**

- When the Maker signs, the server sets `pending_expires_at = now() + 12 months`.
- A daily cron (SQS + Lambda) scans for `PENDING_KEEPER` / `PENDING_TC` rows where `pending_expires_at < now()` and flips them to `EXPIRED`.
- When the counterparty signs (Keeper in Flow 2, TC in Flow 4), the server sets `status = LOCKED`, `locked_at = now()`, `pending_expires_at = null`.
- Reminder emails are sent to the Maker at `T-30d` and at expiry (`T+0`) on the pending window.

The TC always signs on the private path. There is no "informed only" variant.

### `signatures` table

```
id                 uuid, pk
role               enum ('maker','keeper','tc')
contract_id        uuid, fk contracts
user_id            uuid, fk users, nullable
typed_name         text
matched_against    text
ip                 inet
user_agent         text
signed_at          timestamptz
```

### `invites` table (magic-link tokens for Keeper / TC)

```
id               uuid, pk
contract_id      uuid, fk contracts
role             enum ('keeper','tc')
token_hash       text, unique (sha256 of the raw token)
expires_at       timestamptz
consumed_at      timestamptz, nullable
```

---

## 6. API endpoints (target)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/contracts` | Maker (pre-verify ok) | Create Contract, send Email 1 |
| `GET`  | `/verify?token=` | public | Confirm Maker email, redirect to Screen 4 |
| `POST` | `/auth/register` | Maker | Set password, create Cognito user |
| `POST` | `/contracts/{id}/sign` | Maker | Maker sign, validate typed name; send Email 2 or Email 26 |
| `GET`  | `/contracts/{id}` | Maker | Read Contract + status (used by Screen 6a polling) |
| `GET`  | `/contracts/invite/{token}` | public | Load invite preview for Keeper or TC |
| `POST` | `/contracts/accept/{token}` | magic-link session | Keeper or TC accept, validate typed name |
| `POST` | `/contracts/decline/{token}` | magic-link session | Keeper or TC decline |
| `POST` | `/contracts/{id}/suspend` | Maker | → `SUSPENDED_BY_MAKER` |
| `POST` | `/contracts/{id}/resume` | Maker | Leave suspended |
| `POST` | `/contracts/{id}/withdraw` | Maker | → `WITHDRAWN_BY_MAKER` |
| `POST` | `/contracts/{id}/keeper-withdraw` | Keeper | → `WITHDRAWN_BY_KEEPER` |
| `POST` | `/contracts/{id}/transfer/initiate` | TC (or Maker in future) | → `TRANSFER_PENDING` (placeholder for Flow 3) |
| `POST` | `/plans/subscribe` | Maker | Create free-tier subscription on `Start free` (Screen 10) |

Every `POST` that changes status must write an audit row to a future `contract_events` table (not in scope for this spec, but API handlers should be structured to allow it).

---

## 7. Email templates summary

| Email | Trigger | Subject | Recipient | Notes |
|-------|---------|---------|-----------|-------|
| Email 1 (Maker verification) | Screen 2 submit | `"Confirm your email address"` | Maker | 24 h token. |
| Email 2 (Keeper invitation) | Maker signs, aware path | `"{{maker_name}} has created something for you."` | Keeper | Magic link, no account. |
| Email 26 (TC designation) | Maker signs on private path | `"{{maker_name}} has chosen you as their Transfer Contact."` | TC | Magic link, no account, signature required. |
| Email 3 (Contract locked) | Status → `LOCKED` | `"Your contract is locked."` | Maker | Preheader swaps `{{keeper_name}}` ↔ `{{tc_name}}` by path. |

All emails share the ink header bar, cream body, and the two-line footer format `"{context line}"` / `"ovyu.com · {reason line}"`.

---

## 8. Acceptance checklist

### Global

- [ ] Cream background (`#F7F8F3`) on every Flow 1 page — not white.
- [ ] Serif font for every H1.
- [ ] Exactly one olive/gold button exists in the flow: the `Begin` button on Screen 1.
- [ ] All other primary CTAs are ink black (`#1A1A1A`) pills.
- [ ] Every transactional email has the ink header bar with cream `ovyu` wordmark.
- [ ] All screens work at 375 px width.
- [ ] No forbidden terms in copy or code: `Creator`, `Recipient`, `consent_relationships`, `death verification`.
- [ ] Keeper and TC authenticate via magic link only — no password screen on Screens 7/8/27.
- [ ] Typed-name signature validation enforced server-side (case-insensitive, trimmed).
- [ ] All design tokens from §1a are exposed as CSS variables on `:root` and mirrored in `tailwind.config.ts`.
- [ ] `pending_expires_at` is set to `now() + 12 months` on Maker sign and cleared on `LOCKED`.
- [ ] A daily job flips any `PENDING_KEEPER` / `PENDING_TC` past `pending_expires_at` to `EXPIRED`.
- [ ] Maker reminder emails fire at T-30d and at expiry (T+0) on the 12-month window.
- [ ] Flow 2 (Keeper signs) and Flow 4 (TC signs) are implemented as **one shared signing component**, parameterised by role.

### Aware path (Flow 1 + Flow 2)

- [ ] Screen 2 is one combined page — Maker + Keeper + the awareness question on one screen.
- [ ] Screen 2 CTA text is verbatim: `"Continue to verify email →"`.
- [ ] Screen 3 (Email 1) arrives at `no-reply@ovyu.com`, 24 h expiry.
- [ ] Screen 5 Contract text includes all "Access begins / Access duration / Transferable / Interaction limit" bullets verbatim.
- [ ] Screen 6a is a status **table** with 2 rows — not a spinner.
- [ ] Screen 6a polls `/contracts/{id}` every 5 s.
- [ ] Screen 7 requires no password — arrives via magic link.
- [ ] Screen 8 signature validates against `keeper_name`.

### Private path (Flow 3 + Flow 4)

- [ ] Screen 21 shows the yellow TC callout when `path = private`, with verbatim copy.
- [ ] Screen 23 does not send any email to the Keeper.
- [ ] Screen 24 contract text appends the 1 clause about the Keeper being unaware and the TC being designated.
- [ ] Screen 25a rows are: Maker (Signed), Keeper (Notified at Transfer, grey), TC (Pending, orange).
- [ ] Screen 25a footer is verbatim: `"The contract locks once the Transfer Contact has signed. Your Keeper will be notified when the Transfer is activated."`
- [ ] Screen 26 shows the yellow callout with 2 numbered TC responsibilities (the post-passing timeline is deferred to Flow 3).
- [ ] Screen 27 contract text has exactly 5 numbered clauses.
- [ ] Screen 27 signature validates against `tc_name`.
- [ ] Screen 8 and Screen 28 render the same `<SignedConfirmation>` component with identical callout copy.

### Emails

- [ ] Email 2 (Keeper) uses a magic link, not a password-login URL.
- [ ] Email 26 (TC) uses a magic link and always requires the TC to sign.
- [ ] Email 3 sent on `LOCKED`, preheader adjusted for aware vs private.

---

## 9. Resolved and open questions

**Resolved** (confirmed by product owner on 2026-04-19):

- ✅ **Four actor-based flows**: Flow 1 (Maker aware, waiting), Flow 2 (Keeper signs), Flow 3 (Maker private, waiting), Flow 4 (TC signs). Flow 2 and Flow 4 share one signing component.
- ✅ **Locking window = 12 months.** Pending contracts (`PENDING_KEEPER` / `PENDING_TC`) expire to `EXPIRED` after 12 months from the Maker's signature. A new `pending_expires_at` column tracks the deadline; reminders fire at T-30d and at expiry.
- ✅ **Private path** always requires the Transfer Contact to sign. There is no "informed only" variant. No policy flag is needed.
- ✅ **Screen 25a row 3** = `Pending` (orange). `Informed` (grey) is retired.
- ✅ **25a vs 25b** are two progress snapshots of the same Maker-facing status page. Ship as one component in v1.
- ✅ **Post-passing timeline is out of scope for Flow 1.** The previous "up to 2 months" clauses on Screen 26 and Screen 27 are removed. This timeline belongs to Flow 3 "The Transfer".
- ✅ **Screen 8 and Screen 28 copy** is identical. Use one shared `<SignedConfirmation>` component; the "submitting evidence" copy applies to whoever signs (Keeper on Flow 2, TC on Flow 4).
- ✅ **Card surface color** on Screens 5, 7, 24, 27 = **paler cream** `#FBFBF7` (not pure white). Exposed as `--ovyu-paper`.
- ✅ **Relationship `Other` behaviour.** When `Other` is picked from the Screen 2 dropdown, a free-text input appears below the select, labelled `"In a word or two"`, required, max 40 chars. The typed word (e.g. `"Mentor"`) is stored in `contracts.relationship`. The literal string `"Other"` is never stored.

**Still open:**

_None._ All Flow 1 design decisions are resolved as of 2026-04-19.

---

*This spec is the single source of truth for Flow 1. When in doubt, check the FigJam frames, then ask before deviating. Do not invent copy.*
