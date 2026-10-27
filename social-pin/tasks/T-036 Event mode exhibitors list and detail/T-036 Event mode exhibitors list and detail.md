---
type: task
id: T-036
status: blocked
priority: critical
effort: M
feature: events-during
module: events
screens: [s53, s54, s55]
depends: [T-033]
created: 2026-10-15
updated: 2026-10-27
tags: [task, task/blocked, module/events, priority/critical]
---

# ⛔ T-036 · Event mode: exhibitors list and detail

**Feature:** [[Events During]] · **Status:** Blocked · **Priority:** Critical · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-036-fe Frontend · Event mode exhibitors list and detail|Frontend]] · [[T-036-be Backend · Event mode exhibitors list and detail|Backend]] · **Story:** [[T-036 Story]]

## What

Scoped by the viewer's Event Ring membership (access engine).

## Design

- [[Screen Index#s53|s53]] Event mode
- [[Screen Index#s54|s54]] Exhibitors
- [[Screen Index#s55|s55]] Exhibitor

## Dependencies

- Waits on [[T-033 Events list, detail, schedule]]
- Unblocks [[T-038 Floor map and booths]]
- Unblocks [[T-039 Catalogue products and talks (new table)]]
- Unblocks [[Exhibitor Story|Exhibitor · S8]]
- Unblocks [[T-052 Smart Match]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
