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
related: ["T-065-fe QA Frontend", "T-066-fe QA Frontend", "Pay for an order Frontend Delivery", "Pay for an order Story", "Pay for an order Frontend Requirements", "Pay for an order QA Backend"]
pending: []
owner: "khaled"
updated: 2026-10-25
tags: [qa-frontend, qa-frontend/passing, module/payments-gateway, layer/qa]
---

# 🧪 Pay for an order · QA Frontend

> **Simulated runs** for the M-09 agent-flow test: builds `t065-fe-sim-2026-10-25` and `t066-fe-sim-2026-10-25` have no client code behind them.

**Feature:** [[Pay for an order]] · **Verifies:** [[Pay for an order Frontend Delivery]] against [[Pay for an order Story]] and [[Pay for an order Frontend Requirements]] · **Verdict:** ✅ Passing, every journey (S1–S4)

Expected behaviour of the screens, as artefacts: journeys, states and copy to check a build against, **not test code**. The sum of the task-level QA Frontend notes.

## Scope

Covered: every story of [[Pay for an order Story]]: S1 and S2 on s51 through [[T-065-fe QA Frontend]], S3 and S4 (the payment counting with the app closed, s52) through [[T-066-fe QA Frontend]]. Not covered: reaching s51 from s50 with a real order ([[T-035 Registration transaction with order and payment]]); the runs seed an order.

## Journeys

| # | Story | Steps | Expected | Checked |
|---|---|---|---|---|
| J1 | S1 | open s51, tap Pay | the order from the server; Stripe's card page, card only; one call on a double tap | ✅ (T-065-fe F1–F3) |
| J2 | S2 | back from Stripe: closed, declined, waiting | the state from the server; failed with the reason, the hold countdown and "Try again" on the same order; waiting polls | ✅ (F4–F7) |
| J3 | S2 | restart, hold ended | resumes the same order; "Your tickets were released" | ✅ (F8, F9) |
| J4 | S3 | pay, close the app before Stripe answers, reopen | the order paid, s52 once, the Event Ring in the hub | ✅ (T-066-fe G1, G6, G9) |
| J5 | S4 | a paid order | s52 with the Event Ring; "Setting up your Ring…" while not readable, with a retry; the carousel motion; never reached from an unpaid order | ✅ (G2–G5, G7, G8) |

## Screen states

| Screen | State | Expected rendering |
|---|---|---|
| [[Screen Index#s51\|s51]] | loading, unpaid, pending, failed, hold ended, paid → s52, error | as in [[T-065-fe QA Frontend#Screen states]] and [[T-066-fe QA Frontend#Screen states]] ✅ |
| [[Screen Index#s52\|s52]] | granted, setting up, not ready after 30 s | as in [[T-066-fe QA Frontend#Screen states]] ✅ |

## Flow diagram

s51 in [[T-065-fe QA Frontend#Flow diagram]]; from a paid order on to s52, and the app start after paying, in [[T-066-fe QA Frontend#Flow diagram]].

## Error copy

| ErrorCode | Where | Copy shown |
|---|---|---|
| `E_AUTH_04` | s51, s52, app start | sign-in, back to the same order ✅ |
| `E_ORDER_01` | s51, app start | "This order is not available" ✅ |
| `E_ORDER_02` | s51 Pay | "Payment received", on to s52 ✅ |
| `E_ORDER_03` | s51 Pay | "Your tickets were released" ✅ |
| `E_PAY_01` | s51 Pay | "Payment is not available right now" ✅ |

## Tasks verified

| Task | QA note | Build | Result |
|---|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-fe QA Frontend]] | `t065-fe-sim-2026-10-25` | ✅ Passing |
| [[T-066 Settle an order and confirm it on s52]] | [[T-066-fe QA Frontend]] | `t066-fe-sim-2026-10-25` | ✅ Passing |

## Verdict

- Run on: 2026-10-25 · builds: `t065-fe-sim-2026-10-25`, `t066-fe-sim-2026-10-25` (simulated) · result: ✅ passing, J1–J5 and every error copy · failing rows: none · pending: none
