# Claude Code implementation prompt — Flow 1

Paste the block between the fences below into Claude Code, run from the repo root (`ovyu/`).

---

```
Read these two files end-to-end before you touch any code:

  1. docs/flow-1-contract-spec.md   (the verbatim UX spec, source of truth)
  2. docs/GAP-ANALYSIS.md           (what is missing or wrong vs the spec)

Also read CLAUDE.md at the repo root for canonical terminology. Never use
the words Creator, Recipient, consent_relationships, or death verification.

Your goal is to implement the 12 priority fixes in docs/GAP-ANALYSIS.md §9,
in that order. Do not skip ahead.

Ground rules:

- One commit per priority item. Commit title format:
    "feat(flow-1): [P{N}] {short description}"
  Example: "feat(flow-1): [P1] wire up ovyu color + typography tokens"
- Do not modify database schema without asking me first.
- Do not invent copy. Every string in a quotation in the spec is verbatim
  and must be used exactly. If copy is unclear, stop and ask.
- Do not introduce new third-party packages without asking first. Prefer
  shadcn primitives that are already in the project.
- Keep the existing repo layout: frontend in frontend/, backend in backend/,
  IaC in infrastructure/.
- Use SQLAlchemy 2.0 async patterns for any new queries; use Alembic for
  schema changes.
- Every new endpoint must have a corresponding Pydantic v2 request +
  response schema in backend/app/schemas/.
- Typed-signature validation: case-insensitive, trimmed, unicode-normalised
  match against the canonical name stored on the contract. Persist the
  typed string plus IP and user-agent in the signatures table.
- Magic-link auth: tokens are sha256-hashed in the invites table, expire in
  7 days, single-use (consumed_at). The session is scoped to the contract
  the invite belongs to, never global.
- The only olive button in the whole flow is the "Begin" button on
  Screen 1. Every other primary CTA is ink black (#1A1A1A).
- Cream is the page background everywhere (#F7F8F3). Never bg-white.

Workflow:

1. Before each priority, restate what you understand the change to be and
   list the files you plan to touch. Wait for me to say "go".
2. Implement, run the local build (frontend: `npm run build`; backend:
   `pytest` if tests exist), then commit.
3. After commit, post a 2-line summary of what changed. Then move on to
   the next priority.
4. Open questions listed in GAP-ANALYSIS.md §10 are blockers for the items
   that depend on them. When you reach one, stop and ask me.

Open questions to resolve before you start or as they come up:

  None. All Flow 1 design decisions are resolved. If you find a new
  question during implementation, stop and ask before guessing.

Context for what is already resolved (do NOT re-ask these):

  - The flow model is 4 actor-based flows:
      Flow 1 — Maker, aware path, waiting (PENDING_KEEPER).
      Flow 2 — Keeper signs. Completes Flow 1.
      Flow 3 — Maker, private path, waiting (PENDING_TC).
      Flow 4 — TC signs. Completes Flow 3.
    Flow 2 and Flow 4 are the same screens parameterised by role. Build
    one <InviteSignPage role="keeper" | "tc"> and render both from it.
  - The private path always requires TC signing. There is no "informed
    only" variant and no requireTransferContactSignature policy flag.
  - The locking window is 12 months. When the Maker signs, set
    pending_expires_at = now() + interval '12 months'. A daily job
    expires PENDING_KEEPER / PENDING_TC past that date to EXPIRED.
    Clear pending_expires_at on LOCKED. Send Maker reminders at T-30d
    and T+0.
  - Add `EXPIRED` to the status enum and `pending_expires_at` to the
    contracts table.
  - The post-passing Transfer timeline ("up to 2 months") is NOT part of
    Flow 1. It is out of scope here. Do not add a 2-month clause to
    Screen 26 Email or Screen 27 clause 4. It will be handled in Flow 3.
  - Screen 27 has 5 numbered clauses (not 6). The old clause 4 about
    "2 months from passing" is removed.
  - Screen 25a row 3 is "Pending" (orange). The label "Informed" is retired.
  - Screens 25a and 25b ship as one component. 25a = TC invitation sent
    and Maker is waiting; 25b = TC is actively signing.
  - Screens 8 and 28 share one <SignedConfirmation> component with
    identical copy.
  - Card surface color (cards on Screens 5, 7, 24, 27) = paler cream
    #FBFBF7, exposed as the --ovyu-paper token. NOT pure white.
  - Relationship select on Screen 2: options are Partner, Parent, Child,
    Sibling, Best friend, Other. Picking Other reveals a free-text
    input labelled "In a word or two" (required, max 40 chars). The
    typed word is stored in contracts.relationship. The literal word
    "Other" is never stored by itself.

Begin with P1. Tell me what files you will touch in tailwind.config.ts,
globals.css, and the shared components folder, then wait for "go".
```

---

## Why two docs, not one

`docs/flow-1-contract-spec.md` is the **designer-authored** source of truth. It describes what the product should be.

`docs/GAP-ANALYSIS.md` is the **engineer-authored** delta against the current repo. It tells Claude Code what to change and in what order.

Keep both up to date. When the spec changes, regenerate the gap analysis. When the code catches up, shorten the gap analysis.
