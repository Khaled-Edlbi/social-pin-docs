---
type: task
id: T-029
status: todo
priority: P1
effort: M
feature: companies
module: shared-rings
screens: [s72, s73]
depends: []
created: 2026-10-15
tags: [task, task/todo, module/shared-rings, priority/P1]
---

# ⬜ T-029 · My companies and company detail

**Feature:** [[Companies]] · **Status:** To do · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

`GET /businesses/mine`, `GET /businesses/:id`, leave. Company Rings as `CORPORATE` with `parentRingId`.

## Design

- [[Screen Index#s72|s72]] My companies
- [[Screen Index#s73|s73]] Company detail

## Dependencies

- Unblocks [[T-048 Business account setup → business Ring]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
