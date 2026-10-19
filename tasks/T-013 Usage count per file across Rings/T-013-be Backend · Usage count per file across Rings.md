---
type: task
id: T-013-be
status: todo
priority: medium
effort: S
feature: photo-library
module: identity
parent: T-013
labels: [backend]
screens: [s30]
depends: [T-012]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/identity, priority/medium, backend]
---

# ⬜ T-013-be · Backend: Usage count per file across Rings

**Parent:** [[T-013 Usage count per file across Rings]] · **Feature:** [[Photo Library]] · **Side:** Backend · **Status:** To do · **Priority:** Medium · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-013-be` when the team picks it up): [[T-013-be Backend Delivery|Backend Delivery]] · [[T-013-be Backend Integration|Backend Integration]] · [[T-013-be QA Backend|QA Backend]]

## What

The API side of [[T-013 Usage count per file across Rings]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-013-be Backend Delivery]] and how to call it in [[T-013-be Backend Integration]], and roll both up into [[Photo Library Backend Delivery]] and [[Photo Library Backend Integration]].

## Design

- [[Screen Index#s30|s30]]

## Impact

Same as the parent's: [[T-013 Usage count per file across Rings#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-013
