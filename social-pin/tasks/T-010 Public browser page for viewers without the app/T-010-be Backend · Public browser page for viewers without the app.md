---
type: task
id: T-010-be
status: todo
priority: high
effort: M
feature: badge-qr
module: discovery
parent: T-010
labels: [backend]
screens: [s34]
depends: [T-008]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/discovery, priority/high, backend]
---

# ⬜ T-010-be · Backend: Public browser page for viewers without the app

**Parent:** [[T-010 Public browser page for viewers without the app]] · **Feature:** [[Badge & QR]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-010-be` when the team picks it up): [[T-010-be Backend Delivery|Backend Delivery]] · [[T-010-be Backend Integration|Backend Integration]] · [[T-010-be QA Backend|QA Backend]]

## What

The API side of [[T-010 Public browser page for viewers without the app]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-010-be Backend Delivery]] and how to call it in [[T-010-be Backend Integration]], and roll both up into [[Badge & QR Backend Delivery]] and [[Badge & QR Backend Integration]].

## Design

- [[Screen Index#s34|s34]]

## Impact

Same as the parent's: [[T-010 Public browser page for viewers without the app#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-010
