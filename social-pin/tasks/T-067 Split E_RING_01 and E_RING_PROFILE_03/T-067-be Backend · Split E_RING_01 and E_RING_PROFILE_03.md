---
type: task
id: T-067-be
status: todo
priority: critical
effort: M
feature: error-contract
module: platform
parent: T-067
labels: [backend]
screens: []
depends: []
affects: []
related: []
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/critical, backend]
---

# ⬜ T-067-be · Backend: Split E_RING_01 and E_RING_PROFILE_03

> ⚠ Affected by [[T-067 Split E_RING_01 and E_RING_PROFILE_03]] (2026-10-26): the parent declares `depends: [T-063]` and reads ⛔ Blocked, but this half was scaffolded with `depends: []`, so the board offers it as pickable. [[Agent Rules#2 · Codes, scopes and the "sum of" rule]] says a half inherits its parent's `depends`; the build does not compute that, so it has to be typed. `/backend` sets `depends: [T-063]` here and clears this flag. The work itself does not start until [[T-063 Put the ErrorCode on the error body]] is done.

**Parent:** [[T-067 Split E_RING_01 and E_RING_PROFILE_03]] · **Feature:** [[Error Contract]] · **Side:** Backend · **Status:** To do · **Priority:** critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-067-be` when the team picks it up): [[T-067-be Backend Delivery|Backend Delivery]] · [[T-067-be Backend Integration|Backend Integration]] · [[T-067-be QA Backend|QA Backend]]

## What

The API side of [[T-067 Split E_RING_01 and E_RING_PROFILE_03]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-067-be Backend Delivery]] and how to call it in [[T-067-be Backend Integration]], and roll both up into [[Error Contract Backend Delivery]] and [[Error Contract Backend Integration]].

## Design

- [[Screen Index#sNN|sNN]] …

## Impact

Same as the parent's: [[T-067 Split E_RING_01 and E_RING_PROFILE_03#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created as the backend half of T-067
