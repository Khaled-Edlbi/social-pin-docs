---
type: task
id: T-046
status: blocked
priority: high
effort: M
feature: notifications
module: platform
screens: [s69]
depends: [T-045, T-014]
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/blocked, module/platform, priority/high]
---

# ⛔ T-046 · Push delivery and preferences

**Feature:** [[Notifications]] · **Status:** Blocked · **Priority:** High · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-046-fe Frontend · Push delivery and preferences|Frontend]] · [[T-046-be Backend · Push delivery and preferences|Backend]] · **Story:** [[T-046 Story]]

## What

Push via device tokens; preferences CRUD.

## Design

- [[Screen Index#s69|s69]] Notifications

## Dependencies

- Waits on [[T-045 NotificationService.emit and the inbox]]
- Waits on [[T-014 Register devices on login; list and remove]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
