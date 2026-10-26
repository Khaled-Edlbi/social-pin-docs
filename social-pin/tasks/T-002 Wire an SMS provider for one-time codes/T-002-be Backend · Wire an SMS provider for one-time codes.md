---
type: task
id: T-002-be
status: todo
priority: critical
effort: S
feature: code-delivery
module: platform
parent: T-002
labels: [backend]
screens: [s02]
depends: [T-001]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/critical, backend]
---

# ⬜ T-002-be · Backend: Wire an SMS provider for one-time codes

**Parent:** [[T-002 Wire an SMS provider for one-time codes]] · **Feature:** [[Code Delivery]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-002-be` when the team picks it up): [[T-002-be Backend Delivery|Backend Delivery]] · [[T-002-be Backend Integration|Backend Integration]] · [[T-002-be QA Backend|QA Backend]]

## What

The API side of [[T-002 Wire an SMS provider for one-time codes]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-002-be Backend Delivery]] and how to call it in [[T-002-be Backend Integration]], and roll both up into [[Code Delivery Backend Delivery]] and [[Code Delivery Backend Integration]].

## Design

- [[Screen Index#s02|s02]]

## Impact

Same as the parent's: [[T-002 Wire an SMS provider for one-time codes#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-002
