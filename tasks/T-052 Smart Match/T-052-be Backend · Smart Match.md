---
type: task
id: T-052-be
status: todo
priority: P2
effort: L
feature: gemma
module: platform
parent: T-052
labels: [backend]
screens: [s60]
depends: [T-051, T-036]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P2, backend]
---

# ⬜ T-052-be · Backend: Smart Match

**Parent:** [[T-052 Smart Match]] · **Feature:** [[Gemma AI]] · **Side:** Backend · **Status:** To do · **Priority:** P2 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-052-be` when the team picks it up): [[T-052-be Backend Delivery|Backend Delivery]] · [[T-052-be Backend Integration|Backend Integration]] · [[T-052-be QA Backend|QA Backend]]

## What

The API side of [[T-052 Smart Match]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-052-be Backend Delivery]] and how to call it in [[T-052-be Backend Integration]], and roll both up into [[Gemma AI Backend Delivery]] and [[Gemma AI Backend Integration]].

## Design

- [[Screen Index#s60|s60]]

## Impact

Same as the parent's: [[T-052 Smart Match#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-052
