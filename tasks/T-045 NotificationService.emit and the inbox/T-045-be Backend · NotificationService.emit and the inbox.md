---
type: task
id: T-045-be
status: todo
priority: P1
effort: M
feature: notifications
module: platform
parent: T-045
labels: [backend]
screens: [s69]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P1, backend]
---

# ⬜ T-045-be · Backend: NotificationService.emit and the inbox

**Parent:** [[T-045 NotificationService.emit and the inbox]] · **Feature:** [[Notifications]] · **Side:** Backend · **Status:** To do · **Priority:** P1 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-045-be` when the team picks it up): [[T-045-be Backend Delivery|Backend Delivery]] · [[T-045-be Backend Integration|Backend Integration]] · [[T-045-be QA Backend|QA Backend]]

## What

The API side of [[T-045 NotificationService.emit and the inbox]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-045-be Backend Delivery]] and how to call it in [[T-045-be Backend Integration]], and roll both up into [[Notifications Backend Delivery]] and [[Notifications Backend Integration]].

## Design

- [[Screen Index#s69|s69]]

## Impact

Same as the parent's: [[T-045 NotificationService.emit and the inbox#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-045
