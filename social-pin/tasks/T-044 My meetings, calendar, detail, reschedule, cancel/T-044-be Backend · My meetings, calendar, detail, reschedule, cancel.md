---
type: task
id: T-044-be
status: todo
priority: critical
effort: M
feature: meetings
module: meetings
parent: T-044
labels: [backend]
screens: [s61, s66, s67]
depends: [T-042]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/meetings, priority/critical, backend]
---

# ⬜ T-044-be · Backend: My meetings, calendar, detail, reschedule, cancel

**Parent:** [[T-044 My meetings, calendar, detail, reschedule, cancel]] · **Feature:** [[Meetings]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-044-be` when the team picks it up): [[T-044-be Backend Delivery|Backend Delivery]] · [[T-044-be Backend Integration|Backend Integration]] · [[T-044-be QA Backend|QA Backend]]

## What

The API side of [[T-044 My meetings, calendar, detail, reschedule, cancel]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-044-be Backend Delivery]] and how to call it in [[T-044-be Backend Integration]], and roll both up into [[Meetings Backend Delivery]] and [[Meetings Backend Integration]].

## Design

- [[Screen Index#s61|s61]], [[Screen Index#s66|s66]], [[Screen Index#s67|s67]]

## Impact

Same as the parent's: [[T-044 My meetings, calendar, detail, reschedule, cancel#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-044
