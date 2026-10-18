---
type: task
id: T-009-be
status: todo
priority: P1
effort: S
feature: badge-qr
module: discovery
parent: T-009
labels: [backend]
screens: [s34]
depends: [T-008]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/discovery, priority/P1, backend]
---

# ⬜ T-009-be · Backend: Scan counter and share link

**Parent:** [[T-009 Scan counter and share link]] · **Feature:** [[Badge & QR]] · **Side:** Backend · **Status:** To do · **Priority:** P1 · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-009-be` when the team picks it up): [[T-009-be Backend Delivery|Backend Delivery]] · [[T-009-be Backend Integration|Backend Integration]] · [[T-009-be QA Backend|QA Backend]]

## What

The API side of [[T-009 Scan counter and share link]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-009-be Backend Delivery]] and how to call it in [[T-009-be Backend Integration]], and roll both up into [[Badge & QR Backend Delivery]] and [[Badge & QR Backend Integration]].

## Design

- [[Screen Index#s34|s34]]

## Impact

Same as the parent's: [[T-009 Scan counter and share link#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-009
