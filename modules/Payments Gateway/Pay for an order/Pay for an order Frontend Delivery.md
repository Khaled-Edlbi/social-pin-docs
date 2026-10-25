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
related: ["T-065-fe Frontend Delivery", "T-066-fe Frontend Delivery", "Pay for an order Backend Integration", "Pay for an order Frontend Requirements", "Pay for an order Story", "GET /orders/:id", "POST /orders/:id/checkout"]
pending: []
owner: "khaled"
updated: 2026-10-25
tags: [frontend-delivery, frontend-delivery/done, module/payments-gateway, layer/frontend]
---

# ✅ Pay for an order · Frontend Delivery

> **Simulated delivery** for the M-09 agent-flow test: builds `t065-fe-sim-2026-10-25` and `t066-fe-sim-2026-10-25` have no client code behind them.

**Feature:** [[Pay for an order]] · **Status:** Done: every story of [[Pay for an order Story]] shipped (T-065, T-066) · **Built from:** [[Pay for an order Backend Integration]] · **Against:** [[Pay for an order Story]] and [[Pay for an order Frontend Requirements]] · **QA:** [[Pay for an order QA Frontend]]

Written by the **frontend** team after shipping: what the client built, so the backend, QA and product know what exists. The sum of this feature's task-level Frontend Delivery notes (table at the end).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s51\|s51]] Payment | ✅ | the order from the server, Pay → Stripe's card page, pending / failed with the hold countdown / hold ended ([[T-065-fe Frontend Delivery]]); a paid order goes on to s52 ([[T-066-fe Frontend Delivery]]) |
| [[Screen Index#s52\|s52]] Event Ring granted | ✅ | reached only from a paid order; the Ring by `eventRingId`, "Setting up your Ring…" until ready, the carousel motion ([[T-066-fe Frontend Delivery]]) |
| app start | ✅ | an order paid while the app was closed is picked up once and leads to s52 ([[T-066-fe Frontend Delivery]]) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /orders/:id` | s51, s52, app start | `order:{id}`; polled every 3 s for 2 minutes while `PENDING`, every 2 s for 30 s while setting up the Ring, then on focus; on `PAID`, `events:mine`, `event:{id}`, `rings:list` invalidated |
| `POST /orders/:id/checkout` | s51 Pay / Try again | in-flight taps ignored; `checkoutUrl` opened in an in-app browser tab, not stored |
| the Rings read by `eventRingId` | s52 | through the Rings endpoints ([[Event Ring Auto-creation]]) |

## State kept on the client

- `order:{id}`; an unpaid order's id per device until it is paid (and its s52 shown) or its hold ends; the hold countdown from `holdEndsAt`. No card data, no stored checkout URL, no computed amounts, no paid state decided on the device.

## Deviations from the story or the integration note

- None ([[T-065-fe Frontend Delivery]], [[T-066-fe Frontend Delivery]]).

## Not done yet

- Reaching s51 with a real order: [[T-035 Registration transaction with order and payment]] (Events Before); nothing left in this feature.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-fe Frontend Delivery]] | ✅ Done (simulated) |
| [[T-066 Settle an order and confirm it on s52]] | [[T-066-fe Frontend Delivery]] | ✅ Done (simulated) |

## Log

- 2026-10-25 · rolled up T-065-fe (simulated): s51 shipped on `t065-fe-sim-2026-10-25`
- 2026-10-25 · `docs/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FD-02-t066-rolled-up` · rolled up T-066-fe (simulated): s51 → s52 and app start on `t066-fe-sim-2026-10-25`; the `@pm` pending item cleared (T-066 filed and delivered)
