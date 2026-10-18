---
type: task
id: T-009-fe
status: todo
priority: P1
effort: S
feature: badge-qr
module: discovery
parent: T-009
labels: [frontend]
screens: [s34]
depends: [T-008, T-009-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/discovery, priority/P1, frontend]
---

# ⬜ T-009-fe · Frontend: Scan counter and share link

**Parent:** [[T-009 Scan counter and share link]] · **Feature:** [[Badge & QR]] · **Side:** Frontend · **Status:** To do · **Priority:** P1 · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-009-fe` when the team picks it up): [[T-009-fe Frontend Requirements|Frontend Requirements]] · [[T-009-fe Frontend Delivery|Frontend Delivery]] · [[T-009-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-009 Scan counter and share link]]: the screens below show what its *What* describes, built against [[Badge & QR Backend Integration]] once the backend half ([[T-009-be Backend · Scan counter and share link]]) is current. Write the asks in [[T-009-fe Frontend Requirements]] first; it is blocked by default until [[T-009 Story]] is approved.

## Design

- [[Screen Index#s34|s34]]

## Impact

Same as the parent's: [[T-009 Scan counter and share link#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Badge & QR Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-009
