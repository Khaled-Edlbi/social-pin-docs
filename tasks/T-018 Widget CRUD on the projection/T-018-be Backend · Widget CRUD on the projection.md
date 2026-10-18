---
type: task
id: T-018-be
status: todo
priority: P1
effort: M
feature: widgets
module: identity
parent: T-018
labels: [backend]
screens: [s36, s37]
depends: [T-017, D-03]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/identity, priority/P1, backend]
---

# ⬜ T-018-be · Backend: Widget CRUD on the projection

**Parent:** [[T-018 Widget CRUD on the projection]] · **Feature:** [[Widgets]] · **Side:** Backend · **Status:** To do · **Priority:** P1 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-018-be` when the team picks it up): [[T-018-be Backend Delivery|Backend Delivery]] · [[T-018-be Backend Integration|Backend Integration]] · [[T-018-be QA Backend|QA Backend]]

## What

The API side of [[T-018 Widget CRUD on the projection]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-018-be Backend Delivery]] and how to call it in [[T-018-be Backend Integration]], and roll both up into [[Widgets Backend Delivery]] and [[Widgets Backend Integration]].

## Design

- [[Screen Index#s36|s36]], [[Screen Index#s37|s37]]

## Impact

Same as the parent's: [[T-018 Widget CRUD on the projection#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-018
