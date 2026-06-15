# Flow 2 — Maker Upload · UX Spec

> **Source of truth** for Flow 2 ("FLOW TWO // MAKER UPLOAD"). Every string inside `"` is verbatim from the frames and must not be rewritten.
>
> Source: Figma file `ovyu • frames • flow-two`, file key `7eUxhN3sNdvXaPcwUhIlfh`.
>
> Status: **work in progress** — being assembled frame by frame with the product owner. Frames marked _coded_ already exist in the app and are the baseline; new work begins after them.

---

## 0. Baseline — already coded (do not rebuild)

These frames exist and are the entry point for Flow 2. They are listed only to anchor the navigation graph.

| Step | Screen | Frame node | Status |
|------|--------|-----------|--------|
| 1 | Home Page → log in | `3:2` | coded |
| 2 | Log In — enter email | `2003:1302` | coded |
| 3 | Magic-link email received → click → lands on Profile Dashboard | (email) | coded |
| 4 | Profile Dashboard — first visit; "Your contract" card shows a **"View contract"** button (first time only) | `2024:738` | coded |
| 4a | Click **"View contract"** → Signed Contract (Maker & Keeper) | `2022:574` | coded |
| 4b | On contract: **"Ready to begin, start with your voice"** → Profile Dashboard | `2026:583` | coded |

**Also already coded / complete:**
- All **Entry / Auth** screens: Home Page, Logged Out, Log In, Email Auth, Account, Contact, Contact (message received).
- **Profile Dashboard** sections: **"Your contract / Ready to upload"**, **"Your Name"**, and **"The sound of you"** are all complete. The Profile Dashboard **upload** is also complete.

> New design/build work begins at the frame **after `2026:583`**. The sections below will document those frames as they are walked through.

---

## 1. Navigation graph (live — updates as we go)

```
Home Page (3:2)
  └─ log in ─▶ Log In (2003:1302)
       └─ enter email ─▶ magic-link email
            └─ click link ─▶ Profile Dashboard — first visit (2024:738)
                 └─ "View contract" ─▶ Signed Contract (Maker & Keeper) (2022:574)
                      └─ "Ready to begin, start with your voice" ─▶ Profile Dashboard (2026:583)
                           └─ ... (next frames — to be documented)
```

---

## 2. Frames to document

_(Captured one at a time with the product owner. Each will get: purpose, verbatim copy, layout, interactive elements, and transitions.)_
