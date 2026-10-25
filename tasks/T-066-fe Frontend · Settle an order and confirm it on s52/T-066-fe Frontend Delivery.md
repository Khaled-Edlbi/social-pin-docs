---
type: frontend-delivery
code: T-066-fe
scope: task
feature: pay-for-an-order
module: payments-gateway
status: done
screens: [s51, s52]
depends: []
affects: []
related: ["T-066-be Backend Integration", "T-066-fe Frontend Requirements", "T-066 Story", "T-065-fe Frontend Delivery", "Event Ring Auto-creation Story", "GET /orders/:id", "E_ORDER_01", "E_AUTH_04"]
pending: []
blockedBy: []
owner: "khaled"
updated: 2026-10-25
tags: [frontend-delivery, frontend-delivery/done, module/payments-gateway, layer/frontend]
task: T-066-fe
---

# ✅ T-066-fe · Settle an order and confirm it on s52 · Frontend Delivery

> **Simulated delivery** for the M-09 agent-flow test: build `t066-fe-sim-2026-10-25` has no client code behind it. `blockedBy: []` because the integration note this builds on is the backend half's, [[T-066-be Backend Integration]] (`current`).

**Task:** [[T-066-fe Frontend · Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Frontend Delivery]] · **Status:** Done · **Built from:** [[T-066-be Backend Integration]] · **Against:** [[T-066 Story]] and [[T-066-fe Frontend Requirements]] · **QA:** [[T-066-fe QA Frontend]] (not run yet)

Written by the **frontend** team after shipping: what the client built, so the backend, QA and product know what exists. A feature-level note is the sum of its task-level notes (table at the end).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s51\|s51]] Payment | ✅ | `PAID` now goes on to s52 once `registrationComplete` is `true` (it stopped at "Payment received" in [[T-065-fe Frontend Delivery]]) |
| [[Screen Index#s52\|s52]] Event Ring granted | ✅ | reached only from a `PAID` order; the Ring by `eventRingId` as [[Event Ring Auto-creation Story]] S1 shows it; "Setting up your Ring…" with a retry while `registrationComplete` is `false`; the Ring joins the carousel (a fade with reduced motion) |
| app start | ✅ | the stored unpaid order is read once; `PAID` → s52 once, then cleared |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /orders/:id` | s51 while pending (3 s for 2 minutes, then on focus), s52 while setting up (2 s for 30 s, then on focus), app start | `order:{id}`; on `PAID` with `registrationComplete`, invalidate `events:mine`, `event:{id}`, `rings:list` before s52 renders |
| the Rings read by `eventRingId` | s52 | through the Rings endpoints ([[Event Ring Auto-creation]]); nothing new on the payments side |

## State kept on the client

- `order:{id}`; the id of the last unpaid order per device, cleared after its s52 or when its hold ends.
- No paid state decided on the device: neither Stripe's success URL nor a timer marks an order paid.

## Deviations from the story or the integration note

- None ([[T-066-be Backend Integration]], [[T-066-fe Frontend Requirements]]).

## Not done yet

- Reaching s51 with a real order: [[T-035 Registration transaction with order and payment]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| [[T-066-fe Frontend · Settle an order and confirm it on s52]] | this note | ✅ Done (simulated) |

## Log

- 2026-10-25 · `payments-gateway/T-066/s52-confirmation` in the frontend repo (simulated, no code) · s51 → s52 and app start shipped on `t066-fe-sim-2026-10-25`
