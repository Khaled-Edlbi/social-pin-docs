---
type: task
id: T-066-be
status: done
priority: high
effort: M
feature: pay-for-an-order
module: payments-gateway
parent: T-066
labels: [backend]
screens: [s51, s52]
depends: []
affects: ["T-066-fe Frontend · Settle an order and confirm it on s52"]
related: ["T-066-be Backend Delivery", "T-066-fe Frontend Requirements"]
pending: []
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [task, task/done, module/payments-gateway, priority/high, backend]
---

# ✅ T-066-be · Backend: Settle an order and confirm it on s52

**Parent:** [[T-066 Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Side:** Backend · **Status:** Done (simulated) · **Priority:** high · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-066-be` when the team picks it up): [[T-066-be Backend Delivery|Backend Delivery]] · [[T-066-be Backend Integration|Backend Integration]] · [[T-066-be QA Backend|QA Backend]]

## What

The API side of [[T-066 Settle an order and confirm it on s52]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-066-be Backend Delivery]] and how to call it in [[T-066-be Backend Integration]], and roll both up into [[Pay for an order Backend Delivery]] and [[Pay for an order Backend Integration]].

## Design

- [[Screen Index#s51|s51]], [[Screen Index#s52|s52]]: the order read turns `PAID` with the registration and the Event Ring; the settlement itself is server to server.

## Impact

Same as the parent's: [[T-066 Settle an order and confirm it on s52#Impact]].

## Definition of done

- [x] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`) (simulated)
- [x] `pnpm typecheck && pnpm test` green (simulated)
- [x] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes
- [x] QA Backend run ([[T-066-be QA Backend]], passing on `t066-sim-2026-10-25`); `pending` cleared
- [x] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-25 · created as the backend half of T-066
- 2026-10-25 · `payments-gateway/T-066/stripe-webhook` (simulated, no code: M-09 agent-flow test) · `POST /payments/stripe/webhook`, `registrationComplete` and `eventRingId` on `GET /orders/:id` ([[T-066-be Backend Delivery]]); FR-42 accepted; rolled up into BD-41 and BI-11, BD-41's pending cleared; QA Backend handed over in `pending`
- 2026-10-25 · `tickets/backend/M-09-payments-gateway/F-41-pay-for-an-order/T-066-be-qa-cleared` · QB-03 passing on `t066-sim-2026-10-25` (simulated, W1–W10): the `@qa` pending item cleared, QA's flag removed
