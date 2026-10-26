---
type: task
id: T-012
status: todo
priority: high
effort: S
feature: photo-library
module: identity
screens: [s30]
depends: []
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/todo, module/identity, priority/high]
---

# ⬜ T-012 · List my files (photo library)

**Feature:** [[Photo Library]] · **Status:** To do · **Priority:** High · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-012-fe Frontend · List my files (photo library)|Frontend]] · [[T-012-be Backend · List my files (photo library)|Backend]] · **Story:** [[T-012 Story]]

## What

`GET /files` paginated with `kind` filter, owner only, via a `FileQueryBuilderService`.

## Design

- [[Screen Index#s30|s30]] Photo library

## Dependencies

- Unblocks [[T-013 Usage count per file across Rings]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
