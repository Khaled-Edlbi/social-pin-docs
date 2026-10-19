---
type: task
id: T-NNN-be
status: todo
priority: P1
effort: M
feature: <feature id>
module: <module id>
parent: T-NNN
labels: [backend]
screens: []
depends: []
affects: []
related: []
pending: []
created: <date>
updated: <date>
tags: [task, task/todo, module/<module id>, priority/P1, backend]
---

# ⬜ T-NNN-be · Backend: <Title>

**Parent:** [[T-NNN <Title>]] · **Feature:** [[<Feature name>]] · **Side:** Backend · **Status:** To do · **Priority:** <priority> · **Effort:** <effort> (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-NNN-be` when the team picks it up): [[T-NNN-be Backend Delivery|Backend Delivery]] · [[T-NNN-be Backend Integration|Backend Integration]] · [[T-NNN-be QA Backend|QA Backend]]

## What

The API side of [[T-NNN <Title>]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-NNN-be Backend Delivery]] and how to call it in [[T-NNN-be Backend Integration]], and roll both up into [[<Feature name> Backend Delivery]] and [[<Feature name> Backend Integration]].

## Design

- <screens>

## Impact

Same as the parent's: [[T-NNN <Title>#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- <date> · created as the backend half of T-NNN
