---
type: task
id: T-014
status: todo
priority: P1
effort: M
feature: devices
module: platform
screens: [s75]
depends: []
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P1]
---

# ⬜ T-014 · Register devices on login; list and remove

**Feature:** [[Devices & NFC]] · **Status:** To do · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-014-fe Frontend · Register devices on login; list and remove|Frontend]] · [[T-014-be Backend · Register devices on login; list and remove|Backend]] · **Story:** [[T-014 Story]]

## What

`UserDevice` row on login (name, platform, push token). `GET /users/me/devices`, `DELETE …/devices/:id` revoking that device's refresh tokens.

## Design

- [[Screen Index#s75|s75]] My devices

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
