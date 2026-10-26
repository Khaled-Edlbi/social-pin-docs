---
type: task
id: T-018
status: needs-info
priority: high
effort: M
feature: widgets
module: identity
screens: [s36, s37]
depends: [T-017, ND-03]
created: 2026-10-15
updated: 2026-10-26
owner: "omar"
tags: [task, task/needs-info, module/identity, priority/high]
---

# ❓ T-018 · Widget CRUD on the projection

**Feature:** [[Widgets]] · **Status:** Needs a decision / info · **Priority:** High · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-018-fe Frontend · Widget CRUD on the projection|Frontend]] · [[T-018-be Backend · Widget CRUD on the projection|Backend]] · **Story:** [[T-018 Story]]

## What

`…/projection/widgets` with `type`, `config` (validated per type), `sortOrder`, `isVisible`. Viewer rendering in `toView`. Built on the library model ND-03 chose (one library, on/off per Ring: [[D-03 Links entered once, switched on or off per Ring]]), not on the per-Ring copies.

## Design

- [[Screen Index#s36|s36]] Add to this Ring
- [[Screen Index#s37|s37]] Widgets

## Dependencies

- Waits on [[T-017 Extend WIDGET_TYPE to the design's list]]
- Waited on decision [[ND-03 Field library vs per-Ring copies]], decided by [[D-03 Links entered once, switched on or off per Ring]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · ND-03 decided ([[D-03 Links entered once, switched on or off per Ring]]); What and Dependencies updated, flag cleared. Status left as typed; still waits on T-017.
