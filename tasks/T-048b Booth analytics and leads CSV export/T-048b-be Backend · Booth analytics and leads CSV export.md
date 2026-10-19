---
type: task
id: T-048b-be
status: todo
priority: high
effort: M
feature: exhibitor
module: events
parent: T-048b
labels: [backend]
screens: [s65]
depends: [T-009, T-036]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/events, priority/high, backend]
---

# ⬜ T-048b-be · Backend: Booth analytics and leads CSV export

**Parent:** [[T-048b Booth analytics and leads CSV export]] · **Feature:** [[Exhibitor]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-048b-be` when the team picks it up): [[T-048b-be Backend Delivery|Backend Delivery]] · [[T-048b-be Backend Integration|Backend Integration]] · [[T-048b-be QA Backend|QA Backend]]

## What

The API side of [[T-048b Booth analytics and leads CSV export]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-048b-be Backend Delivery]] and how to call it in [[T-048b-be Backend Integration]], and roll both up into [[Exhibitor Backend Delivery]] and [[Exhibitor Backend Integration]].

## Design

- [[Screen Index#s65|s65]]

## Impact

Same as the parent's: [[T-048b Booth analytics and leads CSV export#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-048b
