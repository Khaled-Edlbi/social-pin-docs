---
type: task
id: T-045-fe
status: todo
priority: high
effort: M
feature: notifications
module: platform
parent: T-045
labels: [frontend]
screens: [s69]
depends: [T-045-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/high, frontend]
---

# ⬜ T-045-fe · Frontend: NotificationService.emit and the inbox

**Parent:** [[T-045 NotificationService.emit and the inbox]] · **Feature:** [[Notifications]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-045-fe` when the team picks it up): [[T-045-fe Frontend Requirements|Frontend Requirements]] · [[T-045-fe Frontend Delivery|Frontend Delivery]] · [[T-045-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-045 NotificationService.emit and the inbox]]: the screens below show what its *What* describes, built against [[Notifications Backend Integration]] once the backend half ([[T-045-be Backend · NotificationService.emit and the inbox]]) is current. Write the asks in [[T-045-fe Frontend Requirements]] first; it is blocked by default until [[T-045 Story]] is approved.

## Design

- [[Screen Index#s69|s69]]

## Impact

Same as the parent's: [[T-045 NotificationService.emit and the inbox#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Notifications Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-045
