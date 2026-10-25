---
type: qa-backend
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: passing
screens: [s51, s52]
depends: []
affects: []
related: ["T-065-be QA Backend", "Pay for an order Backend Delivery", "Pay for an order Backend Integration", "Pay for an order Story", "GET /orders/:id", "POST /orders/:id/checkout", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "E_AUTH_04"]
pending: ["@qa: run S3 (webhook settlement) and S4 (s52) rows once their task ships; no task yet, see Pay for an order Backend Delivery"]
owner: "khaled"
updated: 2026-10-25
tags: [qa-backend, qa-backend/passing, module/payments-gateway, layer/qa]
---

# 🧪 Pay for an order · QA Backend

> **Simulated run** for the M-09 agent-flow test: build `t065-sim-2026-10-25` has no code behind it.

**Feature:** [[Pay for an order]] · **Verifies:** [[Pay for an order Backend Delivery]] against [[Pay for an order Story]] and [[Pay for an order Frontend Requirements]], with the shapes of [[Pay for an order Backend Integration]] · **Verdict:** ✅ Passing for s51 on `t065-sim-2026-10-25`; S3 and S4 not run (not delivered)

Expected behaviour of the API, as artefacts a person can check a build against: tables and diagrams, **not test code** (the specs live in the backend repo). The sum of the task-level QA Backend notes.

## Scope

Covered: what the backend delivered, s51's two endpoints ([[Pay for an order Story]] S1, S2), through [[T-065-be QA Backend]]. Not covered, because it is not delivered: S3 (the Stripe webhook settlement) and S4 (s52); the rows below wait for their task.

## Expected behaviour

| # | Story | Given | When | Then | Checked |
|---|---|---|---|---|---|
| F1 | S1 | my unpaid order | `GET /orders/:id`, then `POST /orders/:id/checkout` | the order's state and hold; a Stripe card checkout, reused while open, expiring with the hold | ✅ (T-065-be B1, B4–B6) |
| F2 | S1 | not my order, or none | either endpoint | the same 404 `E_ORDER_01` | ✅ (B2, B3) |
| F3 | S2 | a failed attempt | `GET /orders/:id`, then checkout again | `FAILED` with the reason; the same order can be paid again until the hold ends | ✅ (B12) |
| F4 | S2 | the hold ended, or the order paid | checkout | 410 `E_ORDER_03` / 409 `E_ORDER_02` | ✅ (B7, B8) |
| F5 | S3 | a checkout paid on Stripe | Stripe sends the webhook, then sends it again | the order is `PAID` once, one payment, one audit entry | ⬜ not delivered |
| F6 | S4 | a paid order | read the order | registration complete and the Event Ring id | ⬜ not delivered |

## State diagram

The order's states and the transitions tested are in [[T-065-be QA Backend#State diagram]]; `PENDING → PAID` (the webhook) is not delivered.

## Error matrix

| Situation | Status | ErrorCode | Same body as |
|---|---|---|---|
| order not mine / does not exist | 404 | `E_ORDER_01` | each other |
| checkout on a paid order | 409 | `E_ORDER_02` | — |
| checkout after the hold ended | 410 | `E_ORDER_03` | — |
| Stripe unreachable | 502 | `E_PAY_01` | — |
| no or expired token | 401 | `E_AUTH_04` | every authenticated endpoint |

## Privacy and access checks

- Another user's order is indistinguishable from a missing one; no body carries card data, the Stripe secret or the `providerReference` ([[T-065-be QA Backend]] B2, B3, B11).

## Tasks verified

| Task | QA note | Build | Result |
|---|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-be QA Backend]] | `t065-sim-2026-10-25` | ✅ Passing |
| Webhook settlement and s52 (S3, S4) | — | — | not delivered, no task |

## Verdict

- Run on: 2026-10-25 · build: `t065-sim-2026-10-25` (simulated) · result: ✅ passing for every delivered row (F1–F4) · failing rows: none · not run: F5, F6 (in `pending`)
