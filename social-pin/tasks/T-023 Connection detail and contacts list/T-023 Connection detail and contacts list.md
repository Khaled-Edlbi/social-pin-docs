---
type: task
id: T-023
status: todo
priority: critical
effort: M
feature: connections
module: connections
screens: [s47]
depends: [T-022]
created: 2026-10-15
updated: 2026-10-26
owner: "omar"
related: ["D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect"]
tags: [task, task/todo, module/connections, priority/critical]
---

# ⬜ T-023 · Connection detail and contacts list

**Feature:** [[Connections]] · **Status:** To do · **Priority:** Critical · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-023-fe Frontend · Connection detail and contacts list|Frontend]] · [[T-023-be Backend · Connection detail and contacts list|Backend]] · **Story:** [[T-023 Story]]

## What

Owner-side detail shows which Rings (owner only; a connection may sit in several), events in common, mutual connections. `GET /connections` searchable, including connections with no access. Removing someone from my last Ring offers *Remove from Rings* or *Disconnect*; only a disconnect ends the connection ([[D-15 Several Rings per connection, remove or disconnect]]).

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
- 2026-10-25 · `tickets/pm/M-02-connections/F-14-connections/S-26-decisions` · story S1, S2, S6 and What updated for D-04, D-14 and D-15; flags cleared.
