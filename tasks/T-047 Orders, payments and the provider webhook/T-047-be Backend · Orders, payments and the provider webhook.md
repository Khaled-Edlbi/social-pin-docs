---
type: task
id: T-047-be
status: todo
priority: P1
effort: L
feature: payments
module: commerce
parent: T-047
labels: [backend]
screens: [s51]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/commerce, priority/P1, backend]
---

# ⬜ T-047-be · Backend: Orders, payments and the provider webhook

**Parent:** [[T-047 Orders, payments and the provider webhook]] · **Feature:** [[Payments & Orders]] · **Side:** Backend · **Status:** To do · **Priority:** P1 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-047-be` when the team picks it up): [[T-047-be Backend Delivery|Backend Delivery]] · [[T-047-be Backend Integration|Backend Integration]] · [[T-047-be QA Backend|QA Backend]]

## What

The API side of [[T-047 Orders, payments and the provider webhook]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-047-be Backend Delivery]] and how to call it in [[T-047-be Backend Integration]], and roll both up into [[Payments & Orders Backend Delivery]] and [[Payments & Orders Backend Integration]].

## Design

- [[Screen Index#s51|s51]]

## Impact

Same as the parent's: [[T-047 Orders, payments and the provider webhook#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-047
