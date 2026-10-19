---
type: task
id: T-054-be
status: todo
priority: high
effort: M
feature: cleanup-jobs
module: platform
parent: T-054
labels: [backend]
screens: []
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/high, backend]
---

# ⬜ T-054-be · Backend: Cleanup jobs

**Parent:** [[T-054 Cleanup jobs]] · **Feature:** [[Cleanup Jobs]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-054-be` when the team picks it up): [[T-054-be Backend Delivery|Backend Delivery]] · [[T-054-be Backend Integration|Backend Integration]] · [[T-054-be QA Backend|QA Backend]]

## What

The API side of [[T-054 Cleanup jobs]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-054-be Backend Delivery]] and how to call it in [[T-054-be Backend Integration]], and roll both up into [[Cleanup Jobs Backend Delivery]] and [[Cleanup Jobs Backend Integration]].

## Design

- —

## Impact

Same as the parent's: [[T-054 Cleanup jobs#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-054
