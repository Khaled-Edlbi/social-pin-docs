---
type: backend-delivery
code: payments
scope: feature
feature: payments
module: commerce
status: todo
screens: [s50, s51]
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/todo, module/commerce, layer/backend]
---

# ⬜ Payments & Orders · Backend Delivery

**Feature:** [[Payments & Orders]] · **Status:** To do · **Integration guide:** [[Payments & Orders Backend Integration]] · **Requirements:** [[Payments & Orders Frontend Requirements]] · **QA:** [[Payments & Orders QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Order`, `OrderItem`, `Payment`

### What exists

- Schema: one buyer per order CHECK, `OrderItem` price snapshot, `Payment.providerReference` unique, `collectedBy` ORGANIZER vs SOCIAL_PIN.

### Gaps

- Provider choice (card / e-payment per organizer) is undecided.
- Order → payment → webhook → registration completes → Event Ring granted.
- Audit log on every payment action.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Payments & Orders]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
