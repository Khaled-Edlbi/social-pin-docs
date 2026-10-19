---
type: task
id: T-055
status: todo
priority: critical
effort: S
feature: e2e-tests
module: platform
screens: []
depends: []
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/critical]
---

# ⬜ T-055 · Run the e2e suite in CI against PostGIS

**Feature:** [[E2E Test Run]] · **Status:** To do · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-055-be Backend · Run the e2e suite in CI against PostGIS|Backend]] · **Story:** [[T-055 Story]]

## What

Service container `postgis/postgis`; `prisma:deploy`, `db:seed`, `test:e2e`.

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
