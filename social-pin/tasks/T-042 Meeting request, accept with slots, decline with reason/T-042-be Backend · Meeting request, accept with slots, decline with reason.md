---
type: task
id: T-042-be
status: todo
priority: critical
effort: L
feature: meetings
module: meetings
parent: T-042
labels: [backend]
screens: [s59, s64]
depends: [T-041]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/meetings, priority/critical, backend]
---

# ⬜ T-042-be · Backend: Meeting request, accept with slots, decline with reason

**Parent:** [[T-042 Meeting request, accept with slots, decline with reason]] · **Feature:** [[Meetings]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-042-be` when the team picks it up): [[T-042-be Backend Delivery|Backend Delivery]] · [[T-042-be Backend Integration|Backend Integration]] · [[T-042-be QA Backend|QA Backend]]

## What

The API side of [[T-042 Meeting request, accept with slots, decline with reason]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-042-be Backend Delivery]] and how to call it in [[T-042-be Backend Integration]], and roll both up into [[Meetings Backend Delivery]] and [[Meetings Backend Integration]].

## Design

- [[Screen Index#s59|s59]], [[Screen Index#s64|s64]]

## Impact

Same as the parent's: [[T-042 Meeting request, accept with slots, decline with reason#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-042
