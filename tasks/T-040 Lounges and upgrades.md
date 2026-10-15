---
type: task
id: T-040
status: blocked
priority: P1
effort: M
feature: events-during
domain: events
screens: [s53]
depends: [T-034, T-049]
created: 2026-10-15
tags: [task, task/blocked, domain/events, priority/P1]
---

# ⛔ T-040 · Lounges and upgrades

**Feature:** [[Events During]] · **Status:** Blocked · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

Mini-event access by package or Pro.

## Design

- [[Screen Index#s53|s53]] Event mode

## Dependencies

- Waits on [[T-034 Tickets, packages, levels, sold-out]]
- Waits on [[T-049 Subscription endpoints and a single Pro gate]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
