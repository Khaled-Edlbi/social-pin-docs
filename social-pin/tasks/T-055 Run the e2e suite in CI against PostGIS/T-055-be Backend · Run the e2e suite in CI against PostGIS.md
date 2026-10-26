---
type: task
id: T-055-be
status: todo
priority: critical
effort: S
feature: e2e-tests
module: platform
parent: T-055
labels: [backend]
screens: []
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/critical, backend]
---

# ⬜ T-055-be · Backend: Run the e2e suite in CI against PostGIS

**Parent:** [[T-055 Run the e2e suite in CI against PostGIS]] · **Feature:** [[E2E Test Run]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-055-be` when the team picks it up): [[T-055-be Backend Delivery|Backend Delivery]] · [[T-055-be Backend Integration|Backend Integration]] · [[T-055-be QA Backend|QA Backend]]

## What

The API side of [[T-055 Run the e2e suite in CI against PostGIS]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-055-be Backend Delivery]] and how to call it in [[T-055-be Backend Integration]], and roll both up into [[E2E Test Run Backend Delivery]] and [[E2E Test Run Backend Integration]].

## Design

- —

## Impact

Same as the parent's: [[T-055 Run the e2e suite in CI against PostGIS#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-055
