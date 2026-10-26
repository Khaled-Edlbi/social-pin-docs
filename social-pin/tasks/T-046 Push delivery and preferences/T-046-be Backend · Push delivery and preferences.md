---
type: task
id: T-046-be
status: todo
priority: high
effort: M
feature: notifications
module: platform
parent: T-046
labels: [backend]
screens: [s69]
depends: [T-045, T-014]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/high, backend]
---

# ⬜ T-046-be · Backend: Push delivery and preferences

**Parent:** [[T-046 Push delivery and preferences]] · **Feature:** [[Notifications]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-046-be` when the team picks it up): [[T-046-be Backend Delivery|Backend Delivery]] · [[T-046-be Backend Integration|Backend Integration]] · [[T-046-be QA Backend|QA Backend]]

## What

The API side of [[T-046 Push delivery and preferences]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-046-be Backend Delivery]] and how to call it in [[T-046-be Backend Integration]], and roll both up into [[Notifications Backend Delivery]] and [[Notifications Backend Integration]].

## Design

- [[Screen Index#s69|s69]]

## Impact

Same as the parent's: [[T-046 Push delivery and preferences#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-046
