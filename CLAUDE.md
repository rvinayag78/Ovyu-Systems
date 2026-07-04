# Ovyu — Codebase Reference

## UI / Layout Rule — STRICT

> **Before writing or editing any UI/layout code, follow `FIGMA_READ_SPEC.md` exactly:**
> 1. Fetch the Figma frame with `get_design_context` (file key `7eUxhN3sNdvXaPcwUhIlfh`).
> 2. Output the spec table (every node, every property) in the response.
> 3. Read the existing code.
> 4. Output the discrepancy table (Figma value vs. current code, ✓/✗ per row).
> 5. Fix all ✗ rows in one pass.
> 6. Do NOT report done until every ✗ row is re-marked ✓.
>
> Skipping any step is not allowed. Use `/figma-ui <node-id>` to trigger this workflow.

---

## Project Isolation — STRICT

> **AWS account `860350045111`, AWS CLI profile `ovyu`, and GitHub repo `rvinayag78/Ovyu-Systems` are exclusively for OVYU.**
> No other project may deploy resources into this account or push code to this repo.
> If asked to work on another project, use that project's own AWS profile and GitHub repo.
> Flag and refuse any action that would deploy non-OVYU resources into account `860350045111`.

## Product Context

Ovyu is a **private digital legacy platform**. A living person (the **Maker**) uploads their voice, memories, and personality so that one named person (the **Keeper**) can access them after the Maker dies.

There is an optional **Transfer Contact (TC)** — a trusted third party in the private path — who initiates the Transfer when the Maker dies.

Flow 1 — **The Contract** — is the registration and bilateral consent flow. No AI is involved in this flow.

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

### Aware Path
The Keeper knows they have been named. After the Maker signs the Contract, an invitation is sent to the Keeper, who must also sign to lock the Contract.

### Private Path
The Keeper does **not** know. A Transfer Contact (TC) is nominated instead. The TC is notified of their role. When the Maker dies, the TC initiates the Transfer, and the Keeper is notified at that point.

---

## Contract Status State Machine

```
PENDING_KEEPER        → Maker has signed; waiting for Keeper to accept (aware path)
PENDING_TC            → Maker has signed; waiting for TC to accept (private path)
LOCKED                → Both parties have signed; Contract is active
SUSPENDED_BY_MAKER    → Maker has temporarily suspended the Contract
WITHDRAWN_BY_MAKER    → Maker has permanently withdrawn; Contract is void
WITHDRAWN_BY_KEEPER   → Keeper has withdrawn; Contract is void
TRANSFER_PENDING      → Transfer has been initiated (TC submitted or Maker-triggered)
TRANSFER_COMPLETE     → Keeper has been given access
```

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | AWS Amplify — Next.js 15 + TypeScript + shadcn/ui | App Router, RSC, hosted on Amplify |
| Backend API | AWS Lambda + API Gateway — Python FastAPI via Mangum | Async-first, Pydantic v2, Lambda adapter |
| Orchestration | LlamaIndex RAG + SQS + Lambda workers | RAG pipeline for AI recall in Flow 2+ |
| AI Brain | Claude API — called from inside Nitro Enclave | Secure inference; no model data leaves enclave |
| Memory Store | Amazon RDS — PostgreSQL + pgvector | Relational core + vector search for AI recall |
| Vault (Media) | Amazon S3 — client-side encrypted, envelope encryption | Maker media files; DEK per file, KEK per Maker |
| Auth & Consent | AWS Cognito + PostgreSQL RLS | Managed user pools; RLS enforces data isolation |
| Email | Amazon SES | Transactional email — invitations, confirmations |
| Key Management | AWS KMS — KEK per Maker, wraps file DEKs | Envelope encryption; KMS never sees plaintext |
| Secure AI Inference | AWS Nitro Enclaves | Isolated compute for Claude calls; attestable |
| Job Queue | Amazon SQS + Lambda workers | Async jobs: Transfer initiation, reminders |
| Voice Cloning | ElevenLabs — called from Lambda | Maker voice synthesis in Flow 2+ |
| Guardrails | Guardrails AI (open-source) — Lambda / Enclave | Output validation on all AI responses |
| Monitoring | CloudWatch + X-Ray + Sentry (frontend) | Traces, logs, frontend error tracking |
| IaC | Terraform | Reproducible AWS infra |
| ORM | SQLAlchemy 2.0 + Alembic | Async ORM, migration management |

---

## AWS Configuration

- **Region:** `us-west-2`
- **Account ID:** `860350045111`
- **Bedrock primary model:** `us.anthropic.claude-sonnet-4-20250514-v1:0`
- **Bedrock classification model:** `us.anthropic.claude-haiku-4-5-20251001-v1:0`

---

## Repository Structure

```
ovyu/
  backend/          FastAPI app (runs via Mangum on Lambda, uvicorn locally)
  frontend/         Next.js 15 app
  infrastructure/   Terraform for all AWS resources
  CLAUDE.md         This file
  .env.example      All required environment variables
  .gitignore
```

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

## Flows

### Flow 1 — The Contract (current)
Registration and bilateral consent. No AI. Steps:
1. Maker registers and chooses a path (aware or private).
2. Maker signs the Contract.
3. Invitation token sent to Keeper (aware) or TC (private).
4. Keeper / TC accepts → Contract status → `LOCKED`.

Future flows (not yet built): Flow 2 Memory Upload, Flow 3 The Transfer.
