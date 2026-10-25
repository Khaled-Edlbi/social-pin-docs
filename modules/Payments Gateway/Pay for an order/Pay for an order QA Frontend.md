---
type: qa-frontend
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: passing
screens: [s51, s52]
depends: []
affects: []
related: ["T-065-fe QA Frontend", "Pay for an order Frontend Delivery", "Pay for an order Story", "Pay for an order Frontend Requirements", "Pay for an order QA Backend"]
pending: ["@qa: run S3 (paid while the app was closed) and S4 (s52) journeys once their task ships; no task yet, see Pay for an order Frontend Delivery"]
owner: "khaled"
updated: 2026-10-25
tags: [qa-frontend, qa-frontend/passing, module/payments-gateway, layer/qa]
---

# 🧪 Pay for an order · QA Frontend

> **Simulated run** for the M-09 agent-flow test: build `t065-fe-sim-2026-10-25` has no client code behind it.

**Feature:** [[Pay for an order]] · **Verifies:** [[Pay for an order Frontend Delivery]] against [[Pay for an order Story]] and [[Pay for an order Frontend Requirements]] · **Verdict:** ✅ Passing for s51 on `t065-fe-sim-2026-10-25`; S3 and S4 not run (not delivered)

Expected behaviour of the screens, as artefacts: journeys, states and copy to check a build against, **not test code**. The sum of the task-level QA Frontend notes.

## Scope

Covered: s51, [[Pay for an order Story]] S1 and S2, through [[T-065-fe QA Frontend]]. Not covered, because not delivered: S3 (a payment settling while the app is closed) and S4 (s52); their journeys below wait for a task.

## Journeys

| # | Story | Steps | Expected | Checked |
|---|---|---|---|---|
| J1 | S1 | open s51, tap Pay | the order from the server; Stripe's card page, card only; one call on a double tap | ✅ (T-065-fe F1–F3) |
| J2 | S2 | back from Stripe: closed, declined, waiting | the state from the server; failed with the reason, the hold countdown and "Try again" on the same order; waiting polls | ✅ (F4–F7) |
| J3 | S2 | restart, hold ended, paid | resumes the same order; "Your tickets were released"; "Payment received" | ✅ (F8–F10) |
| J4 | S3 | pay, close the app before Stripe answers, reopen | the order paid, the Event Ring in the hub | ⬜ not delivered |
| J5 | S4 | a paid order | s52 with the Event Ring, "Setting up your Ring…" while it is not readable | ⬜ not delivered |

## Screen states

| Screen | State | Expected rendering |
|---|---|---|
| [[Screen Index#s51\|s51]] | loading, unpaid, pending, failed, hold ended, paid, error | as in [[T-065-fe QA Frontend#Screen states]] ✅ |
| [[Screen Index#s52\|s52]] | granted, setting up | ⬜ not delivered |

## Flow diagram

The s51 flow tested is in [[T-065-fe QA Frontend#Flow diagram]]; the step from a paid order to s52 is not delivered.

## Error copy

| ErrorCode | Where | Copy shown |
|---|---|---|
| `E_AUTH_04` | s51 | sign-in, back to the same order ✅ |
| `E_ORDER_01` | s51 | "This order is not available" ✅ |
| `E_ORDER_02` | s51 Pay | "Payment received" ✅ |
| `E_ORDER_03` | s51 Pay | "Your tickets were released" ✅ |
| `E_PAY_01` | s51 Pay | "Payment is not available right now" ✅ |

## Tasks verified

| Task | QA note | Build | Result |
|---|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-fe QA Frontend]] | `t065-fe-sim-2026-10-25` | ✅ Passing |
| Confirmation and settlement (S3, S4) | — | — | not delivered, no task |

## Verdict

- Run on: 2026-10-25 · build: `t065-fe-sim-2026-10-25` (simulated) · result: ✅ passing for every delivered journey (J1–J3) and error copy · failing rows: none · not run: J4, J5 (in `pending`)
