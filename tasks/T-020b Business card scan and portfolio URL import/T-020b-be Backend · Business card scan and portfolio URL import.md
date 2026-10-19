---
type: task
id: T-020b-be
status: todo
priority: medium
effort: L
feature: onboarding-imports
module: identity
parent: T-020b
labels: [backend]
screens: [s03a, s03b]
depends: [D-02]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/identity, priority/medium, backend]
---

# ⬜ T-020b-be · Backend: Business card scan and portfolio URL import

**Parent:** [[T-020b Business card scan and portfolio URL import]] · **Feature:** [[Onboarding Imports]] · **Side:** Backend · **Status:** To do · **Priority:** Medium · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-020b-be` when the team picks it up): [[T-020b-be Backend Delivery|Backend Delivery]] · [[T-020b-be Backend Integration|Backend Integration]] · [[T-020b-be QA Backend|QA Backend]]

## What

The API side of [[T-020b Business card scan and portfolio URL import]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-020b-be Backend Delivery]] and how to call it in [[T-020b-be Backend Integration]], and roll both up into [[Onboarding Imports Backend Delivery]] and [[Onboarding Imports Backend Integration]].

## Design

- [[Screen Index#s03a|s03a]], [[Screen Index#s03b|s03b]]

## Impact

Same as the parent's: [[T-020b Business card scan and portfolio URL import#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-020b
