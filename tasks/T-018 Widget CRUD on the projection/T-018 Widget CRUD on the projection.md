---
type: task
id: T-018
status: needs-info
priority: P1
effort: M
feature: widgets
module: identity
screens: [s36, s37]
depends: [T-017, D-03]
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/needs-info, module/identity, priority/P1]
---

# ❓ T-018 · Widget CRUD on the projection

**Feature:** [[Widgets]] · **Status:** Needs a decision / info · **Priority:** P1 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-018-fe Frontend · Widget CRUD on the projection|Frontend]] · [[T-018-be Backend · Widget CRUD on the projection|Backend]] · **Story:** [[T-018 Story]]

## What

`…/projection/widgets` with `type`, `config` (validated per type), `sortOrder`, `isVisible`. Viewer rendering in `toView`. Wait for D-03 so widgets are not built on the copy model twice.

## Design

- [[Screen Index#s36|s36]] Add to this Ring
- [[Screen Index#s37|s37]] Widgets

## Dependencies

- Waits on [[T-017 Extend WIDGET_TYPE to the design's list]]
- Waits on decision [[D-03 Field library vs per-Ring copies]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
