---
type: task
id: T-008-fe
status: todo
priority: P0
effort: M
feature: badge-qr
module: discovery
parent: T-008
labels: [frontend]
screens: [s43, s44]
depends: [T-007, T-008-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/discovery, priority/P0, frontend]
---

# ⬜ T-008-fe · Frontend: Resolve a scanned QR token

**Parent:** [[T-008 Resolve a scanned QR token]] · **Feature:** [[Badge & QR]] · **Side:** Frontend · **Status:** To do · **Priority:** P0 · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-008-fe` when the team picks it up): [[T-008-fe Frontend Requirements|Frontend Requirements]] · [[T-008-fe Frontend Delivery|Frontend Delivery]] · [[T-008-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-008 Resolve a scanned QR token]]: the screens below show what its *What* describes, built against [[Badge & QR Backend Integration]] once the backend half ([[T-008-be Backend · Resolve a scanned QR token]]) is current. Write the asks in [[T-008-fe Frontend Requirements]] first; it is blocked by default until [[T-008 Story]] is approved.

## Design

- [[Screen Index#s43|s43]], [[Screen Index#s44|s44]]

## Impact

Same as the parent's: [[T-008 Resolve a scanned QR token#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Badge & QR Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-008
