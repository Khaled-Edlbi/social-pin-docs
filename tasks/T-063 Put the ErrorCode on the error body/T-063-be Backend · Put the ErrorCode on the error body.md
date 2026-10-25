---
type: task
id: T-063-be
status: todo
priority: critical
effort: S
feature: error-contract
module: platform
parent: T-063
labels: [backend]
screens: []
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/critical, backend]
---

# ⬜ T-063-be · Backend: Put the ErrorCode on the error body

> ⚠ Affected by [[T-063 Put the ErrorCode on the error body]] (2026-10-25): [[DR-19 A ticket's layer notes live on the parent task]] puts this ticket's layer notes on the parent task. The **Layer notes** line below still sends this half to `T-063-be Backend Delivery`, `T-063-be Backend Integration` and `T-063-be QA Backend`, which are not the ticket's cards any more; it should point at [[T-063 Backend Delivery]], [[T-063 Backend Integration]] and [[T-063 QA Backend]], scaffolded with `--scaffold <kind> T-063`, and roll up into [[Error Contract Backend Delivery]] and [[Error Contract Backend Integration]] as it says. `/backend` owns this note and clears the flag.

**Parent:** [[T-063 Put the ErrorCode on the error body]] · **Feature:** [[Error Contract]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-063-be` when the team picks it up): [[T-063-be Backend Delivery|Backend Delivery]] · [[T-063-be Backend Integration|Backend Integration]] · [[T-063-be QA Backend|QA Backend]]

## What

The API side of [[T-063 Put the ErrorCode on the error body]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-063-be Backend Delivery]] and how to call it in [[T-063-be Backend Integration]], and roll both up into [[Error Contract Backend Delivery]] and [[Error Contract Backend Integration]].

## Design

- —

## Impact

Same as the parent's: [[T-063 Put the ErrorCode on the error body#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-063
