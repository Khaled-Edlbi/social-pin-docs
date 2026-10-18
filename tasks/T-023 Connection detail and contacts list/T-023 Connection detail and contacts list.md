---
type: task
id: T-023
status: todo
priority: P0
effort: M
feature: connections
module: connections
screens: [s47]
depends: [T-022]
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/todo, module/connections, priority/P0]
---

# ⬜ T-023 · Connection detail and contacts list

**Feature:** [[Connections]] · **Status:** To do · **Priority:** P0 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-023-fe Frontend · Connection detail and contacts list|Frontend]] · [[T-023-be Backend · Connection detail and contacts list|Backend]] · **Story:** [[T-023 Story]]

## What

Owner-side detail shows which Ring (owner only), events in common, mutual connections. `GET /connections` searchable.

## Design

- [[Screen Index#s47|s47]] Connection detail

## Dependencies

- Waits on [[T-022 Accept into a Ring (sets grantedRingId)]]
- Unblocks [[T-025 Introduce a connection to another]]
- Unblocks [[T-050 Post-event summary and follow-ups]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
