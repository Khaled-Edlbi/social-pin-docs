---
type: task
id: T-037
status: blocked
priority: P1
effort: M
feature: events-during
module: events
screens: [s56]
depends: [T-007, T-011]
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/blocked, module/events, priority/P1]
---

# ⛔ T-037 · Event pass with a 60 s rotating code

**Feature:** [[Events During]] · **Status:** Blocked · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-037-fe Frontend · Event pass with a 60 s rotating code|Frontend]] · [[T-037-be Backend · Event pass with a 60 s rotating code|Backend]] · **Story:** [[T-037 Story]]

## What

Same token mechanism as the badge, shorter window, bound to the Event Ring.

## Design

- [[Screen Index#s56|s56]] Event pass

## Dependencies

- Waits on [[T-007 Issue and rotate the QR token for a Ring]]
- Waits on [[T-011 Create the Event Ring on registration]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
