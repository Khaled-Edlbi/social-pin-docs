---
type: task
id: T-051-be
status: todo
priority: P2
effort: L
feature: gemma
module: platform
parent: T-051
labels: [backend]
screens: [s13]
depends: [T-016, T-049]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P2, backend]
---

# ⬜ T-051-be · Backend: Gemma assistant sheet and suggestions

**Parent:** [[T-051 Gemma assistant sheet and suggestions]] · **Feature:** [[Gemma AI]] · **Side:** Backend · **Status:** To do · **Priority:** P2 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-051-be` when the team picks it up): [[T-051-be Backend Delivery|Backend Delivery]] · [[T-051-be Backend Integration|Backend Integration]] · [[T-051-be QA Backend|QA Backend]]

## What

The API side of [[T-051 Gemma assistant sheet and suggestions]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-051-be Backend Delivery]] and how to call it in [[T-051-be Backend Integration]], and roll both up into [[Gemma AI Backend Delivery]] and [[Gemma AI Backend Integration]].

## Design

- [[Screen Index#s13|s13]]

## Impact

Same as the parent's: [[T-051 Gemma assistant sheet and suggestions#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-051
