---
type: task
id: T-050-be
status: todo
priority: P1
effort: M
feature: post-event
module: events
parent: T-050
labels: [backend]
screens: [s62]
depends: [T-009, T-023, T-044]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/events, priority/P1, backend]
---

# ⬜ T-050-be · Backend: Post-event summary and follow-ups

**Parent:** [[T-050 Post-event summary and follow-ups]] · **Feature:** [[Post-Event]] · **Side:** Backend · **Status:** To do · **Priority:** P1 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-050-be` when the team picks it up): [[T-050-be Backend Delivery|Backend Delivery]] · [[T-050-be Backend Integration|Backend Integration]] · [[T-050-be QA Backend|QA Backend]]

## What

The API side of [[T-050 Post-event summary and follow-ups]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-050-be Backend Delivery]] and how to call it in [[T-050-be Backend Integration]], and roll both up into [[Post-Event Backend Delivery]] and [[Post-Event Backend Integration]].

## Design

- [[Screen Index#s62|s62]]

## Impact

Same as the parent's: [[T-050 Post-event summary and follow-ups#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-050
