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
related: ["T-065-be QA Backend", "T-066-be QA Backend", "Pay for an order Backend Delivery", "Pay for an order Backend Integration", "Pay for an order Story", "GET /orders/:id", "POST /orders/:id/checkout", "POST /payments/stripe/webhook", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "E_PAY_02", "E_AUTH_04"]
pending: []
owner: "khaled"
updated: 2026-10-25
tags: [qa-backend, qa-backend/passing, module/payments-gateway, layer/qa]
---

# 🧪 Pay for an order · QA Backend

> **Simulated runs** for the M-09 agent-flow test: builds `t065-sim-2026-10-25` and `t066-sim-2026-10-25` have no code behind them.

**Feature:** [[Pay for an order]] · **Verifies:** [[Pay for an order Backend Delivery]] against [[Pay for an order Story]] and [[Pay for an order Frontend Requirements]], with the shapes of [[Pay for an order Backend Integration]] · **Verdict:** ✅ Passing, every row (S1–S4)

Expected behaviour of the API, as artefacts a person can check a build against: tables and diagrams, **not test code** (the specs live in the backend repo). The sum of the task-level QA Backend notes.

## Scope

Covered: every story of [[Pay for an order Story]]: S1 and S2 through [[T-065-be QA Backend]], S3 and S4 through [[T-066-be QA Backend]]. Not covered: creating the order on s50 ([[T-035 Registration transaction with order and payment]]); the runs seed an order.

## Expected behaviour

| # | Story | Given | When | Then | Checked |
|---|---|---|---|---|---|
| F1 | S1 | my unpaid order | `GET /orders/:id`, then `POST /orders/:id/checkout` | the order's state and hold; a Stripe card checkout, reused while open, expiring with the hold | ✅ (T-065-be B1, B4–B6) |
| F2 | S1 | not my order, or none | either endpoint | the same 404 `E_ORDER_01` | ✅ (B2, B3) |
| F3 | S2 | a failed attempt | `GET /orders/:id`, then checkout again | `FAILED` with the reason; the same order can be paid again until the hold ends | ✅ (B12, T-066-be W4) |
| F4 | S2 | the hold ended, or the order paid | checkout | 410 `E_ORDER_03` / 409 `E_ORDER_02` | ✅ (B7, B8) |
| F5 | S3 | a checkout paid on Stripe | Stripe sends the webhook, then sends it again | the order is `PAID` once: one payment, one registration, one Event Ring, one audit entry; a bad signature is 400 `E_PAY_02` | ✅ (T-066-be W1–W3, W5, W6) |
| F6 | S4 | a paid order | read the order | `registrationComplete: true` and the Event Ring id; never a half-written registration | ✅ (W7–W9) |

## State diagram

The order's states: [[T-065-be QA Backend#State diagram]] (checkout, failure, hold) and [[T-066-be QA Backend#State diagram]] (settlement).

## Error matrix

| Situation | Status | ErrorCode | Same body as |
|---|---|---|---|
| order not mine / does not exist | 404 | `E_ORDER_01` | each other |
| checkout on a paid order | 409 | `E_ORDER_02` | — |
| checkout after the hold ended | 410 | `E_ORDER_03` | — |
| Stripe unreachable | 502 | `E_PAY_01` | — |
| webhook without a valid Stripe signature | 400 | `E_PAY_02` | — |
| no or expired token | 401 | `E_AUTH_04` | every authenticated endpoint |

## Privacy and access checks

- Another user's order is indistinguishable from a missing one; the webhook takes only Stripe's signature; no body carries card data, the Stripe secret or the `providerReference` ([[T-065-be QA Backend]] B2, B3, B11; [[T-066-be QA Backend]] W3, W10).

## Tasks verified

| Task | QA note | Build | Result |
|---|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-be QA Backend]] | `t065-sim-2026-10-25` | ✅ Passing |
| [[T-066 Settle an order and confirm it on s52]] | [[T-066-be QA Backend]] | `t066-sim-2026-10-25` | ✅ Passing |

## Verdict

- Run on: 2026-10-25 · builds: `t065-sim-2026-10-25`, `t066-sim-2026-10-25` (simulated) · result: ✅ passing, F1–F6 · failing rows: none · pending: none
