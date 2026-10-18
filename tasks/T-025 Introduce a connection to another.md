---
type: task
id: T-025
status: needs-info
priority: P2
effort: M
feature: connections
module: connections
screens: [s47]
depends: [T-023]
created: 2026-10-15
tags: [task, task/needs-info, module/connections, priority/P2]
---

# ❓ T-025 · Introduce a connection to another

**Feature:** [[Connections]] · **Status:** Needs a decision / info · **Priority:** P2 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

Semantics unclear: does an introduction create a request on behalf of someone? Needs product input.

## Design

- [[Screen Index#s47|s47]] Connection detail

## Dependencies

- Waits on [[T-023 Connection detail and contacts list]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
