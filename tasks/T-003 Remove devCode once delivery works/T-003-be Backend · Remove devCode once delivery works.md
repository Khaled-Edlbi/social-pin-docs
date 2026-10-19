---
type: task
id: T-003-be
status: todo
priority: high
effort: S
feature: code-delivery
module: platform
parent: T-003
labels: [backend]
screens: [s02]
depends: [T-001, T-002]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/high, backend]
---

# ⬜ T-003-be · Backend: Remove devCode once delivery works

**Parent:** [[T-003 Remove devCode once delivery works]] · **Feature:** [[Code Delivery]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-003-be` when the team picks it up): [[T-003-be Backend Delivery|Backend Delivery]] · [[T-003-be Backend Integration|Backend Integration]] · [[T-003-be QA Backend|QA Backend]]

## What

The API side of [[T-003 Remove devCode once delivery works]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-003-be Backend Delivery]] and how to call it in [[T-003-be Backend Integration]], and roll both up into [[Code Delivery Backend Delivery]] and [[Code Delivery Backend Integration]].

## Design

- [[Screen Index#s02|s02]]

## Impact

Same as the parent's: [[T-003 Remove devCode once delivery works#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-003
