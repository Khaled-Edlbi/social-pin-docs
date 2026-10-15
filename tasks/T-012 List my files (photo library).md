---
type: task
id: T-012
status: todo
priority: P1
effort: S
feature: photo-library
domain: identity
screens: [s30]
depends: []
created: 2026-10-15
tags: [task, task/todo, domain/identity, priority/P1]
---

# ⬜ T-012 · List my files (photo library)

**Feature:** [[Photo Library]] · **Status:** To do · **Priority:** P1 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

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
