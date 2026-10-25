---
type: frontend-delivery
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: done
screens: [s51, s52]
depends: []
affects: []
related: ["T-065-fe Frontend Delivery", "Pay for an order Backend Integration", "Pay for an order Frontend Requirements", "Pay for an order Story", "GET /orders/:id", "POST /orders/:id/checkout"]
pending: ["@pm: s52 (story S4) needs a task; the client cannot carry a paid order on to it until the backend delivers it (see Pay for an order Backend Delivery)"]
owner: "khaled"
updated: 2026-10-25
tags: [frontend-delivery, frontend-delivery/done, module/payments-gateway, layer/frontend]
---

# ✅ Pay for an order · Frontend Delivery

> **Simulated delivery** for the M-09 agent-flow test: build `t065-fe-sim-2026-10-25` has no client code behind it.

**Feature:** [[Pay for an order]] · **Status:** Done for what its tasks delivered (s51); s52 handed to the PM in `pending` (Partial) · **Built from:** [[Pay for an order Backend Integration]] · **Against:** [[Pay for an order Story]] and [[Pay for an order Frontend Requirements]] · **QA:** [[Pay for an order QA Frontend]] (not run yet)

Written by the **frontend** team after shipping: what the client built, so the backend, QA and product know what exists. The sum of this feature's task-level Frontend Delivery notes (table at the end).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s51\|s51]] Payment | ✅ | the order from the server, Pay → Stripe's card page, pending / failed with the hold countdown / hold ended / paid ([[T-065-fe Frontend Delivery]]) |
| [[Screen Index#s52\|s52]] Event Ring granted | ⬜ | not reachable from a payment yet: no backend, no task ([[Event Ring Auto-creation]] owns the screen) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /orders/:id` | s51 | `order:{id}`; on entry, return and foreground; polled every 3 s for 2 minutes while `PENDING` |
| `POST /orders/:id/checkout` | s51 Pay / Try again | in-flight taps ignored; `checkoutUrl` opened in an in-app browser tab, not stored |

## State kept on the client

- `order:{id}`; an unpaid order's id per device until `holdEndsAt`; the hold countdown from `holdEndsAt`. No card data, no stored checkout URL, no computed amounts.

## Deviations from the story or the integration note

- None ([[T-065-fe Frontend Delivery]]).

## Not done yet

- s52 after a paid order (story S4) and the payment settling while the app is closed (S3): no backend, no task; handed to the PM in `pending`.
- Reaching s51 with a real order: [[T-035 Registration transaction with order and payment]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-fe Frontend Delivery]] | ✅ Done (simulated) |
| Confirmation and settlement (story S3, S4) | — | no task yet |

## Log

- 2026-10-25 · rolled up T-065-fe (simulated): s51 shipped on `t065-fe-sim-2026-10-25`
