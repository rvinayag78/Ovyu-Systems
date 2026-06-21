# Ovyu — State Machines

One place for all flow state machines. Update here when a status enum changes.

---

## Flow 1 — The Contract (`contracts.status`)

```
Maker registers
      │
      ▼
  [contract created]
      │
  Maker signs
      │
      ├── AWARE path ──► PENDING_KEEPER ──► (Keeper signs) ──► LOCKED
      │
      └── PRIVATE path ─► PENDING_TC ────► (TC signs)     ──► LOCKED
                                                                  │
                               ┌──────────────────────────────────┤
                               │
                    SUSPENDED_BY_MAKER    Maker pauses temporarily
                    WITHDRAWN_BY_MAKER    Maker cancels; void
                    WITHDRAWN_BY_KEEPER   Keeper declines; void
                    EXPIRED               12-month window elapsed; no counter-signature
                    TRANSFER_PENDING      TC has initiated the Transfer
                    TRANSFER_COMPLETE     Keeper has been given access
```

| Status | Who triggers it | Condition |
|--------|----------------|-----------|
| `PENDING_KEEPER` | System | Maker signs, path = aware |
| `PENDING_TC` | System | Maker signs, path = private |
| `LOCKED` | System | Keeper or TC signs |
| `SUSPENDED_BY_MAKER` | Maker | Maker pauses the contract |
| `WITHDRAWN_BY_MAKER` | Maker | Maker permanently cancels |
| `WITHDRAWN_BY_KEEPER` | Keeper | Keeper declines the invitation |
| `EXPIRED` | Scheduled job (POST-MVP) | `pending_expires_at` passes with no counter-signature |
| `TRANSFER_PENDING` | TC | TC submits evidence of Maker passing |
| `TRANSFER_COMPLETE` | System | Keeper access granted |

---

## Flow 2 — Memory Upload (in progress)

State machines for voice status, dimension completion, and upload progress to be documented here when Flow 2 is fully designed.

---

## Flow 3 — The Transfer (POST-MVP)

Not yet designed. State machine to be added here.
