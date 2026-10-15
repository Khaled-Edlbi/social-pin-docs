---
type: task
id: T-024
status: todo
priority: P0
effort: S
feature: connections
domain: connections
screens: [s47]
depends: []
created: 2026-10-15
tags: [task, task/todo, domain/connections, priority/P0]
---

# ⬜ T-024 · Block and unblock

**Feature:** [[Connections]] · **Status:** To do · **Priority:** P0 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

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
