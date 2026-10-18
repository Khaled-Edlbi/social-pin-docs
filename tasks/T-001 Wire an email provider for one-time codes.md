---
type: task
id: T-001
status: todo
priority: P0
effort: S
feature: code-delivery
module: platform
screens: [s02]
depends: []
created: 2026-10-15
tags: [task, task/todo, module/platform, priority/P0]
---

# ⬜ T-001 · Wire an email provider for one-time codes

**Feature:** [[Code Delivery]] · **Status:** To do · **Priority:** P0 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

Replace `AuthService.issueCode`'s log line with a mail send. Keep the `devCode` gate until delivery is verified in staging.

## Design

- [[Screen Index#s02|s02]] Verify

## Dependencies

- Unblocks [[T-002 Wire an SMS provider for one-time codes]]
- Unblocks [[T-003 Remove devCode once delivery works]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
