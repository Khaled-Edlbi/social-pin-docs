---
type: backend-delivery
code: subscription
scope: feature
feature: subscription
module: commerce
status: todo
screens: [s34, s70]
created: 2026-10-18
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/todo, module/commerce, layer/backend]
---

# ⬜ Subscription (Free vs Pro) · Backend Delivery

**Feature:** [[Subscription (Free vs Pro)]] · **Status:** To do · **Integration guide:** [[Subscription (Free vs Pro) Backend Integration]] · **Requirements:** [[Subscription (Free vs Pro) Frontend Requirements]] · **QA:** [[Subscription (Free vs Pro) QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Subscription`, `User.accountType`

### What exists

- `User.accountType` FREE / PRO and `Subscription` with one live row per owner and plan.

### Gaps

- Subscribe / cancel / status endpoints and store receipts.
- A single `ProGate` helper every gated feature calls, instead of scattered `accountType` checks.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Subscription (Free vs Pro)]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
