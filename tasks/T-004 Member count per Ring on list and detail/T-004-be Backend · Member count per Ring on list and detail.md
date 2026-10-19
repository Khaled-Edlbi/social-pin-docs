---
type: task
id: T-004-be
status: todo
priority: high
effort: S
feature: counts
module: identity
parent: T-004
labels: [backend]
screens: [s14, s16]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/identity, priority/high, backend]
---

# ⬜ T-004-be · Backend: Member count per Ring on list and detail

**Parent:** [[T-004 Member count per Ring on list and detail]] · **Feature:** [[Counts]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-004-be` when the team picks it up): [[T-004-be Backend Delivery|Backend Delivery]] · [[T-004-be Backend Integration|Backend Integration]] · [[T-004-be QA Backend|QA Backend]]

## What

The API side of [[T-004 Member count per Ring on list and detail]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-004-be Backend Delivery]] and how to call it in [[T-004-be Backend Integration]], and roll both up into [[Counts Backend Delivery]] and [[Counts Backend Integration]].

## Design

- [[Screen Index#s14|s14]], [[Screen Index#s16|s16]]

## Impact

Same as the parent's: [[T-004 Member count per Ring on list and detail#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-004
