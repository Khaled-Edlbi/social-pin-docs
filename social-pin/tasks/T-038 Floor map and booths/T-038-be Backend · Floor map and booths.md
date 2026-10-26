---
type: task
id: T-038-be
status: todo
priority: high
effort: M
feature: events-during
module: events
parent: T-038
labels: [backend]
screens: [s57]
depends: [T-036]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/high, backend]
---

# ⬜ T-038-be · Backend: Floor map and booths

**Parent:** [[T-038 Floor map and booths]] · **Feature:** [[Events During]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-038-be` when the team picks it up): [[T-038-be Backend Delivery|Backend Delivery]] · [[T-038-be Backend Integration|Backend Integration]] · [[T-038-be QA Backend|QA Backend]]

## What

The API side of [[T-038 Floor map and booths]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-038-be Backend Delivery]] and how to call it in [[T-038-be Backend Integration]], and roll both up into [[Events During Backend Delivery]] and [[Events During Backend Integration]].

## Design

- [[Screen Index#s57|s57]]

## Impact

Same as the parent's: [[T-038 Floor map and booths#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-038
