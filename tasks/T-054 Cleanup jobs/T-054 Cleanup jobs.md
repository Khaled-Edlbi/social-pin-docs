---
type: task
id: T-054
status: todo
priority: P1
effort: M
feature: cleanup-jobs
module: platform
screens: []
depends: []
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P1]
---

# ⬜ T-054 · Cleanup jobs

**Feature:** [[Cleanup Jobs]] · **Status:** To do · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-054-be Backend · Cleanup jobs|Backend]] · **Story:** [[T-054 Story]]

## What

`@nestjs/schedule`: AUTO_DELETE Rings, PinCast recipients, expired codes, materialise EXPIRED statuses.

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
