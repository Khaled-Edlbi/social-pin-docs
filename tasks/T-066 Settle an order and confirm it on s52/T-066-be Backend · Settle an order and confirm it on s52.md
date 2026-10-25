---
type: task
id: T-066-be
status: todo
priority: high
effort: M
feature: pay-for-an-order
module: payments-gateway
parent: T-066
labels: [backend]
screens: [s51, s52]
depends: []
affects: []
related: []
pending: []
created: 2026-10-25
updated: 2026-10-25
tags: [task, task/todo, module/payments-gateway, priority/high, backend]
---

# ⬜ T-066-be · Backend: Settle an order and confirm it on s52

**Parent:** [[T-066 Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Side:** Backend · **Status:** To do · **Priority:** high · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-066-be` when the team picks it up): [[T-066-be Backend Delivery|Backend Delivery]] · [[T-066-be Backend Integration|Backend Integration]] · [[T-066-be QA Backend|QA Backend]]

## What

The API side of [[T-066 Settle an order and confirm it on s52]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-066-be Backend Delivery]] and how to call it in [[T-066-be Backend Integration]], and roll both up into [[Pay for an order Backend Delivery]] and [[Pay for an order Backend Integration]].

## Design

- [[Screen Index#s51|s51]], [[Screen Index#s52|s52]]

## Impact

Same as the parent's: [[T-066 Settle an order and confirm it on s52#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-25 · created as the backend half of T-066
