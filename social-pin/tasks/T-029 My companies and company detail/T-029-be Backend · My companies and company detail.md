---
type: task
id: T-029-be
status: todo
priority: high
effort: M
feature: companies
module: shared-rings
parent: T-029
labels: [backend]
screens: [s72, s73]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/shared-rings, priority/high, backend]
---

# ⬜ T-029-be · Backend: My companies and company detail

**Parent:** [[T-029 My companies and company detail]] · **Feature:** [[Companies]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-029-be` when the team picks it up): [[T-029-be Backend Delivery|Backend Delivery]] · [[T-029-be Backend Integration|Backend Integration]] · [[T-029-be QA Backend|QA Backend]]

## What

The API side of [[T-029 My companies and company detail]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-029-be Backend Delivery]] and how to call it in [[T-029-be Backend Integration]], and roll both up into [[Companies Backend Delivery]] and [[Companies Backend Integration]].

## Design

- [[Screen Index#s72|s72]], [[Screen Index#s73|s73]]

## Impact

Same as the parent's: [[T-029 My companies and company detail#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-029
