---
type: task
id: T-045
status: todo
priority: high
effort: M
feature: notifications
module: platform
screens: [s69]
depends: []
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/high]
---

# ⬜ T-045 · NotificationService.emit and the inbox

**Feature:** [[Notifications]] · **Status:** To do · **Priority:** High · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-045-fe Frontend · NotificationService.emit and the inbox|Frontend]] · [[T-045-be Backend · NotificationService.emit and the inbox|Backend]] · **Story:** [[T-045 Story]]

## What

Internal emit with `dedupeKey`; `GET /notifications` grouped by day; mark one / all read. Other modules import the module.

## Design

- [[Screen Index#s69|s69]] Notifications

## Dependencies

- Unblocks [[T-046 Push delivery and preferences]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
