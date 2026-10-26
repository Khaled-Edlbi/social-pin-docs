---
type: task
id: T-039
status: needs-info
priority: high
effort: L
feature: events-during
module: events
screens: [s58]
depends: [T-036]
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/needs-info, module/events, priority/high]
---

# ❓ T-039 · Catalogue: products and talks (new table)

**Feature:** [[Events During]] · **Status:** Needs a decision / info · **Priority:** High · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-039-fe Frontend · Catalogue products and talks (new table)|Frontend]] · [[T-039-be Backend · Catalogue products and talks (new table)|Backend]] · **Story:** [[T-039 Story]]

## What

No products table yet. Schema design needed: product belongs to an exhibitor, talk belongs to a mini-event?

## Design

- [[Screen Index#s58|s58]] Catalogue

## Dependencies

- Waits on [[T-036 Event mode exhibitors list and detail]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
