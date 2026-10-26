---
type: task
id: T-012-be
status: todo
priority: high
effort: S
feature: photo-library
module: identity
parent: T-012
labels: [backend]
screens: [s30]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/identity, priority/high, backend]
---

# ⬜ T-012-be · Backend: List my files (photo library)

**Parent:** [[T-012 List my files (photo library)]] · **Feature:** [[Photo Library]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-012-be` when the team picks it up): [[T-012-be Backend Delivery|Backend Delivery]] · [[T-012-be Backend Integration|Backend Integration]] · [[T-012-be QA Backend|QA Backend]]

## What

The API side of [[T-012 List my files (photo library)]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-012-be Backend Delivery]] and how to call it in [[T-012-be Backend Integration]], and roll both up into [[Photo Library Backend Delivery]] and [[Photo Library Backend Integration]].

## Design

- [[Screen Index#s30|s30]]

## Impact

Same as the parent's: [[T-012 List my files (photo library)#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-012
