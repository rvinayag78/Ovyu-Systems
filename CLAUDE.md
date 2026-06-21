# Ovyu — Codebase Reference

> This file is loaded by Claude Code at the start of every session. Keep it accurate and current — do not add aspirational or future-state content here. Mark anything not yet built as POST-MVP.

---

## Project Isolation — STRICT

> **AWS account `860350045111`, AWS CLI profile `ovyu`, and GitHub repos `rvinayag78/Ovyu-Systems` (primary) and `ovyuSystems/OVYU` (backup) are exclusively for OVYU.**
> No other project may deploy resources into this account or push code to these repos.
> Flag and refuse any action that would deploy non-OVYU resources into account `860350045111`.

---

## Canonical Terminology

| Term | Meaning | Never say |
|------|---------|-----------|
| **Maker** | The living person uploading themselves | Creator, User, Owner |
| **Keeper** | The single named recipient of the legacy | Recipient, Beneficiary |
| **Transfer Contact (TC)** | Trusted third party who initiates the Transfer (private path only) | Witness, Notifier |
| **The Contract** | The bilateral consent relationship between Maker and Keeper | Consent agreement, Relationship |
| **The Transfer** | The moment a Keeper gains access after the Maker dies | Activation, Death event |
| **contracts** | The core database table | consent_relationships, agreements |

> **NEVER** use the words: Creator, Recipient, consent_relationships, death verification.

---

## The Two Paths

**Aware path** — Keeper knows they have been named. Maker signs → Keeper is emailed → Keeper signs → `LOCKED`.

**Private path** — Keeper does not know. TC is nominated instead. Maker signs → TC is emailed → TC signs → `LOCKED`. TC initiates the Transfer when the Maker dies.

> For full state machines across all flows see `docs/state-machines.md`.

---

## Tech Stack — What Is Actually Built

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 + TypeScript, `output: 'export'` (static), hosted on AWS Amplify |
| Styling | **Inline CSS only — no Tailwind, no CSS modules, no class names** |
| Design tokens | `frontend/src/styles/tokens.ts` — typed `CSSProperties`, spread into `style={}` |
| Backend API | Python FastAPI via Mangum, deployed as AWS Lambda + API Gateway |
| Database | Amazon RDS PostgreSQL, SQLAlchemy 2.0 async ORM, Alembic migrations |
| Auth | AWS Cognito (user pools) + magic-link tokens (passwordless for Keeper/TC) |
| Email | Amazon SES — transactional (invitations, verifications, confirmations) |
| Media storage | Amazon S3 — Maker voice/media files |
| AI tagging | AWS Bedrock — Claude Haiku (`us.anthropic.claude-haiku-4-5-20251001-v1:0`) for dimension entry auto-tagging (Flow 2) |

### POST-MVP (not yet built — do not reference as current)
- LlamaIndex RAG, pgvector, Nitro Enclaves, KMS envelope encryption
- ElevenLabs voice cloning, Guardrails AI, SQS async workers
- Terraform IaC, CloudWatch/X-Ray/Sentry monitoring

---

## AWS Configuration

- **Region:** `us-west-2`
- **Account ID:** `860350045111`
- **AWS CLI profile:** `ovyu` — always pass `--profile ovyu` to all `aws` commands
- **Amplify app ID:** `d21q10npjg05eb`
- **Amplify staging branch:** `staging` — auto-deploys on every push; do NOT run `amplify start-job` manually
- **Bedrock primary model:** `us.anthropic.claude-sonnet-4-20250514-v1:0`
- **Bedrock classification model:** `us.anthropic.claude-haiku-4-5-20251001-v1:0`

---

## Figma

- **File key:** `7eUxhN3sNdvXaPcwUhIlfh` (Flow 1 + Flow 2 frames)
- **Rules:** See `docs/figma-workflow.md` — read it before touching any UI component
- **Process:** `get_variable_defs` → `get_design_context` → inline CSS using `tokens.ts` → `get_screenshot` to verify
- **Never** guess dimensions, colors, or spacing from memory. Always fetch from Figma first.

---

## Key Docs

| File | What it covers |
|------|---------------|
| `docs/figma-workflow.md` | Step-by-step Figma→code rules — mandatory before any UI work |
| `docs/flow-1-overview.md` | Flow 1 spec: glossary, flow chart, UI spec, backend table flow, pending issues |
| `docs/state-machines.md` | All flow state machines — contract statuses, transitions, triggers |
| `docs/cicd-pipeline.md` | CI/CD pipeline design — **POST-MVP, not yet implemented** |

---

## Repository Structure

```
ovyu/
  backend/                  FastAPI app (Lambda via Mangum, uvicorn locally)
    app/
      api/v1/endpoints/     Route handlers
      models/               SQLAlchemy models
      schemas/              Pydantic schemas
      services/             Business logic
    alembic/versions/       DB migrations
  frontend/                 Next.js 15 app
    src/
      app/                  App Router pages
      components/           Shared components (Header, Footer, etc.)
      lib/                  API client, utilities
      styles/tokens.ts      Design tokens — colors, spacing, text styles
  docs/                     Specs and workflow rules
  infrastructure/           Terraform (POST-MVP)
  CLAUDE.md                 This file
```

---

## Frontend Rules

- `"use client"` only when state, effects, or event handlers are needed — prefer Server Components
- All styles are inline CSS on `style={{}}` — no Tailwind, no CSS class names
- Import and use `tokens` and `textStyles` from `src/styles/tokens.ts`
- Canvas width is `1920px` — every page wrapper uses `minWidth: "1920px"`
- Font stacks: serif → `"Georgia, serif"` · sans → `"Helvetica Neue, Helvetica, Arial, sans-serif"`

---

## Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm run dev
```

---

## Deploy — Staging

```bash
# Backend
cd backend && bash deploy.sh staging

# Frontend — push to staging branch; Amplify auto-triggers
git push origin staging

# Check Amplify build
aws amplify list-jobs --app-id d21q10npjg05eb --branch-name staging --profile ovyu --max-items 1
```

When job count reaches 20, delete the oldest 15 to keep history clean.

---

## Flows

| Flow | Status |
|------|--------|
| Flow 1 — The Contract | Complete. See `docs/flow-1-overview.md` |
| Flow 2 — Memory Upload | In progress |
| Flow 3 — The Transfer | Not started (POST-MVP) |