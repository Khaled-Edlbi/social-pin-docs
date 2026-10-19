---
type: task
id: T-008-be
status: todo
priority: critical
effort: M
feature: badge-qr
module: discovery
parent: T-008
labels: [backend]
screens: [s43, s44]
depends: [T-007]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/discovery, priority/critical, backend]
---

# ⬜ T-008-be · Backend: Resolve a scanned QR token

**Parent:** [[T-008 Resolve a scanned QR token]] · **Feature:** [[Badge & QR]] · **Side:** Backend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-008-be` when the team picks it up): [[T-008-be Backend Delivery|Backend Delivery]] · [[T-008-be Backend Integration|Backend Integration]] · [[T-008-be QA Backend|QA Backend]]

## What

The API side of [[T-008 Resolve a scanned QR token]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-008-be Backend Delivery]] and how to call it in [[T-008-be Backend Integration]], and roll both up into [[Badge & QR Backend Delivery]] and [[Badge & QR Backend Integration]].

## Design

- [[Screen Index#s43|s43]], [[Screen Index#s44|s44]]

## Impact

Same as the parent's: [[T-008 Resolve a scanned QR token#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-008
