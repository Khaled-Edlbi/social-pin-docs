---
type: task
id: T-038
status: blocked
priority: P1
effort: M
feature: events-during
module: events
screens: [s57]
depends: [T-036]
created: 2026-10-15
tags: [task, task/blocked, module/events, priority/P1]
---

# ⛔ T-038 · Floor map and booths

**Feature:** [[Events During]] · **Status:** Blocked · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

Booth positions on a map asset; `Booth` already exists.

## Design

- [[Screen Index#s57|s57]] Floor map

## Dependencies

- Waits on [[T-036 Event mode exhibitors list and detail]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
