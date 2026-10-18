---
type: task
id: T-011-be
status: todo
priority: P0
effort: M
feature: event-ring-auto
module: events
parent: T-011
labels: [backend]
screens: [s52]
depends: [T-033]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/events, priority/P0, backend]
---

# ⬜ T-011-be · Backend: Create the Event Ring on registration

**Parent:** [[T-011 Create the Event Ring on registration]] · **Feature:** [[Event Ring Auto-creation]] · **Side:** Backend · **Status:** To do · **Priority:** P0 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-011-be` when the team picks it up): [[T-011-be Backend Delivery|Backend Delivery]] · [[T-011-be Backend Integration|Backend Integration]] · [[T-011-be QA Backend|QA Backend]]

## What

The API side of [[T-011 Create the Event Ring on registration]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-011-be Backend Delivery]] and how to call it in [[T-011-be Backend Integration]], and roll both up into [[Event Ring Auto-creation Backend Delivery]] and [[Event Ring Auto-creation Backend Integration]].

## Design

- [[Screen Index#s52|s52]]

## Impact

Same as the parent's: [[T-011 Create the Event Ring on registration#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-011
