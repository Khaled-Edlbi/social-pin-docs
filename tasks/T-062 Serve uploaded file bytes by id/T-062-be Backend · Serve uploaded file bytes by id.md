---
type: task
id: T-062-be
status: todo
priority: P0
effort: S
feature: files
module: identity
parent: T-062
labels: [backend]
screens: [s14, s29, s30, s31, s44]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/identity, priority/P0, backend]
---

# ⬜ T-062-be · Backend: Serve uploaded file bytes by id

**Parent:** [[T-062 Serve uploaded file bytes by id]] · **Feature:** [[Files Upload]] · **Side:** Backend · **Status:** To do · **Priority:** P0 · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-062-be` when the team picks it up): [[T-062-be Backend Delivery|Backend Delivery]] · [[T-062-be Backend Integration|Backend Integration]] · [[T-062-be QA Backend|QA Backend]]

## What

The API side of [[T-062 Serve uploaded file bytes by id]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-062-be Backend Delivery]] and how to call it in [[T-062-be Backend Integration]], and roll both up into [[Files Upload Backend Delivery]] and [[Files Upload Backend Integration]].

## Design

- [[Screen Index#s14|s14]], [[Screen Index#s29|s29]], [[Screen Index#s30|s30]], [[Screen Index#s31|s31]], [[Screen Index#s44|s44]]

## Impact

Same as the parent's: [[T-062 Serve uploaded file bytes by id#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-062
