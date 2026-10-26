---
type: task
id: T-024
status: todo
priority: critical
effort: S
feature: connections
module: connections
screens: [s47]
depends: []
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/todo, module/connections, priority/critical]
---

# ⬜ T-024 · Block and unblock

**Feature:** [[Connections]] · **Status:** To do · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-024-fe Frontend · Block and unblock|Frontend]] · [[T-024-be Backend · Block and unblock|Backend]] · **Story:** [[T-024 Story]]

## What

`POST/DELETE /blocks/:userId`. `UserBlock` is already enforced by `RingAccessService`. Blocking removes both directions of membership.

## Design

- [[Screen Index#s47|s47]] Connection detail

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
