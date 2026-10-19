---
type: task
id: T-028-be
status: todo
priority: medium
effort: L
feature: ring-invitations
module: shared-rings
parent: T-028
labels: [backend]
screens: [s74]
depends: [T-027]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/shared-rings, priority/medium, backend]
---

# ⬜ T-028-be · Backend: What you contribute to a shared Ring

**Parent:** [[T-028 What you contribute to a shared Ring]] · **Feature:** [[Ring Invitations & Join]] · **Side:** Backend · **Status:** To do · **Priority:** Medium · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-028-be` when the team picks it up): [[T-028-be Backend Delivery|Backend Delivery]] · [[T-028-be Backend Integration|Backend Integration]] · [[T-028-be QA Backend|QA Backend]]

## What

The API side of [[T-028 What you contribute to a shared Ring]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-028-be Backend Delivery]] and how to call it in [[T-028-be Backend Integration]], and roll both up into [[Ring Invitations & Join Backend Delivery]] and [[Ring Invitations & Join Backend Integration]].

## Design

- [[Screen Index#s74|s74]]

## Impact

Same as the parent's: [[T-028 What you contribute to a shared Ring#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-028
