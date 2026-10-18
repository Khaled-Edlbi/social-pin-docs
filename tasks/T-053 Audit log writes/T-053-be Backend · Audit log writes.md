---
type: task
id: T-053-be
status: todo
priority: P0
effort: S
feature: audit-log
module: platform
parent: T-053
labels: [backend]
screens: []
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P0, backend]
---

# ⬜ T-053-be · Backend: Audit log writes

**Parent:** [[T-053 Audit log writes]] · **Feature:** [[Audit Log]] · **Side:** Backend · **Status:** To do · **Priority:** P0 · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-053-be` when the team picks it up): [[T-053-be Backend Delivery|Backend Delivery]] · [[T-053-be Backend Integration|Backend Integration]] · [[T-053-be QA Backend|QA Backend]]

## What

The API side of [[T-053 Audit log writes]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-053-be Backend Delivery]] and how to call it in [[T-053-be Backend Integration]], and roll both up into [[Audit Log Backend Delivery]] and [[Audit Log Backend Integration]].

## Design

- —

## Impact

Same as the parent's: [[T-053 Audit log writes#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-053
