---
type: task
id: T-017-be
status: todo
priority: high
effort: S
feature: widgets
module: identity
parent: T-017
labels: [backend]
screens: [s37]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/identity, priority/high, backend]
---

# ⬜ T-017-be · Backend: Extend WIDGET_TYPE to the design's list

**Parent:** [[T-017 Extend WIDGET_TYPE to the design's list]] · **Feature:** [[Widgets]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-017-be` when the team picks it up): [[T-017-be Backend Delivery|Backend Delivery]] · [[T-017-be Backend Integration|Backend Integration]] · [[T-017-be QA Backend|QA Backend]]

## What

The API side of [[T-017 Extend WIDGET_TYPE to the design's list]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-017-be Backend Delivery]] and how to call it in [[T-017-be Backend Integration]], and roll both up into [[Widgets Backend Delivery]] and [[Widgets Backend Integration]].

## Design

- [[Screen Index#s37|s37]]

## Impact

Same as the parent's: [[T-017 Extend WIDGET_TYPE to the design's list#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-017
