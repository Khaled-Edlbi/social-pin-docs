---
type: task
id: T-031-be
status: todo
priority: medium
effort: M
feature: discover-hub
module: discovery
parent: T-031
labels: [backend]
screens: [s38]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/discovery, priority/medium, backend]
---

# ⬜ T-031-be · Backend: Import contacts

**Parent:** [[T-031 Import contacts]] · **Feature:** [[Discover Hub & Search]] · **Side:** Backend · **Status:** To do · **Priority:** Medium · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-031-be` when the team picks it up): [[T-031-be Backend Delivery|Backend Delivery]] · [[T-031-be Backend Integration|Backend Integration]] · [[T-031-be QA Backend|QA Backend]]

## What

The API side of [[T-031 Import contacts]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-031-be Backend Delivery]] and how to call it in [[T-031-be Backend Integration]], and roll both up into [[Discover Hub & Search Backend Delivery]] and [[Discover Hub & Search Backend Integration]].

## Design

- [[Screen Index#s38|s38]]

## Impact

Same as the parent's: [[T-031 Import contacts#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-031
