---
type: frontend-delivery
code: T-065-fe
scope: task
feature: pay-for-an-order
module: payments-gateway
status: done
screens: [s51]
depends: []
affects: []
related: ["T-065-be Backend Integration", "T-065-fe Frontend Requirements", "T-065 Story", "GET /orders/:id", "POST /orders/:id/checkout", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "E_AUTH_04"]
pending: []
blockedBy: []
owner: "khaled"
updated: 2026-10-25
tags: [frontend-delivery, frontend-delivery/done, module/payments-gateway, layer/frontend]
task: T-065-fe
---

# ✅ T-065-fe · Open a Stripe checkout for an order · Frontend Delivery

> **Simulated delivery** for the M-09 agent-flow test: build `t065-fe-sim-2026-10-25` has no client code behind it. `blockedBy: []` because the integration note this builds on is the backend half's, [[T-065-be Backend Integration]] (`current`), not a `T-065-fe` one.

**Task:** [[T-065-fe Frontend · Open a Stripe checkout for an order]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Frontend Delivery]] · **Status:** Done · **Built from:** [[T-065-be Backend Integration]] · **Against:** [[T-065 Story]] and [[T-065-fe Frontend Requirements]] · **QA:** [[T-065-fe QA Frontend]] (not run yet)

Written by the **frontend** team after shipping: what the client built, so the backend, QA and product know what exists. A feature-level note is the sum of its task-level notes (table at the end).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s51\|s51]] Payment | ✅ | lines, total and currency from the server; "Pay $160"; pending, failed with the hold countdown and "Try again", hold ended, paid ("Payment received") |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /orders/:id` | s51 on entry, on return from the card page, on foreground; every 3 s for 2 minutes while `PENDING`, then on focus | cache key `order:{id}`; no optimistic state, the screen renders `state` only |
| `POST /orders/:id/checkout` | s51 "Pay $160" and "Try again" | a second tap while in flight is ignored; `checkoutUrl` opened in an in-app browser tab, never kept beyond the screen |

## State kept on the client

- `order:{id}` from the last read; the countdown is computed from `holdEndsAt` and the device clock and corrected on every read.
- The id of an unpaid order, per device, until `holdEndsAt`, so s51 resumes it after a restart.
- No card data, no `checkoutUrl` stored, no amount computed: amounts are formatted from minor units as returned.

## Deviations from the story or the integration note

- None. Errors branch on the status and the endpoint, not the `ErrorCode`, as [[T-065-be Backend Integration]] asks until [[T-063 Put the ErrorCode on the error body]] ships.

## Not done yet

- Carrying a `PAID` order on to s52: no backend for it and no task yet (story S4; handed to the PM on [[Pay for an order Backend Delivery]]).
- Reaching s51 with a real order: the order is created on s50 by [[T-035 Registration transaction with order and payment]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| [[T-065-fe Frontend · Open a Stripe checkout for an order]] | this note | ✅ Done (simulated) |

## Log

- 2026-10-25 · `payments-gateway/T-065/stripe-checkout` in the frontend repo (simulated, no code) · s51 shipped on `t065-fe-sim-2026-10-25`
