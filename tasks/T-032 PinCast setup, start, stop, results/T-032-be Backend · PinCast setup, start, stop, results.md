---
type: task
id: T-032-be
status: todo
priority: high
effort: L
feature: pincast
module: discovery
parent: T-032
labels: [backend]
screens: [s39, s40, s41, s42]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/discovery, priority/high, backend]
---

# ⬜ T-032-be · Backend: PinCast setup, start, stop, results

**Parent:** [[T-032 PinCast setup, start, stop, results]] · **Feature:** [[PinCast & Nearby]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-032-be` when the team picks it up): [[T-032-be Backend Delivery|Backend Delivery]] · [[T-032-be Backend Integration|Backend Integration]] · [[T-032-be QA Backend|QA Backend]]

## What

The API side of [[T-032 PinCast setup, start, stop, results]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-032-be Backend Delivery]] and how to call it in [[T-032-be Backend Integration]], and roll both up into [[PinCast & Nearby Backend Delivery]] and [[PinCast & Nearby Backend Integration]].

## Design

- [[Screen Index#s39|s39]], [[Screen Index#s40|s40]], [[Screen Index#s41|s41]], [[Screen Index#s42|s42]]

## Impact

Same as the parent's: [[T-032 PinCast setup, start, stop, results#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-032
