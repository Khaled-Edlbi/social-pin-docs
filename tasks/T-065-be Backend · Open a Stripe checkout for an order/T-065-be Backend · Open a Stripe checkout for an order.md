---
type: task
id: T-065-be
status: done
priority: high
effort: M
feature: pay-for-an-order
module: payments-gateway
parent: T-065
labels: [backend]
screens: [s51]
depends: []
affects: ["T-065-fe Frontend · Open a Stripe checkout for an order"]
related: ["T-065-be Backend Delivery", "T-065-fe Frontend Requirements"]
pending: ["@qa: QA Backend run on the T-065 build (T-065-be QA Backend not written yet)"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [task, task/done, module/payments-gateway, priority/high, backend]
---

# ✅ T-065-be · Backend: Open a Stripe checkout for an order

**Parent:** [[T-065 Open a Stripe checkout for an order]] · **Feature:** [[Pay for an order]] · **Side:** Backend · **Status:** Done (simulated) · **Priority:** high · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-065-be` when the team picks it up): [[T-065-be Backend Delivery|Backend Delivery]] · [[T-065-be Backend Integration|Backend Integration]] · [[T-065-be QA Backend|QA Backend]]

## What

The API side of [[T-065 Open a Stripe checkout for an order]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-065-be Backend Delivery]] and how to call it in [[T-065-be Backend Integration]], and roll both up into [[Pay for an order Backend Delivery]] and [[Pay for an order Backend Integration]].

## Design

- [[Screen Index#s51|s51]] Payment: the order and its state, the Stripe checkout. s52 and the webhook are the next task.

## Impact

Same as the parent's: [[T-065 Open a Stripe checkout for an order#Impact]].

## Definition of done

- [x] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`) (simulated)
- [x] `pnpm typecheck && pnpm test` green (simulated)
- [x] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes
- [ ] QA Backend run; `pending` cleared or handed over (handed to QA in `pending`)
- [x] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-25 · created as the backend half of T-065
- 2026-10-25 · `payments-gateway/T-065/stripe-checkout` (simulated, no code: M-09 agent-flow test) · `GET /orders/:id`, `POST /orders/:id/checkout` shipped for s51 ([[T-065-be Backend Delivery]]); FR-40 and FR-41 accepted; the PM's s52 flag cleared (screens narrowed to s51); QA Backend handed over in `pending`
