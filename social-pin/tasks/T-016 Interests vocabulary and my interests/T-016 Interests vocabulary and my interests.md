---
type: task
id: T-016
status: todo
priority: high
effort: S
feature: interests
module: platform
screens: [s07, s71]
depends: []
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/high]
---

# ⬜ T-016 · Interests vocabulary and my interests

**Feature:** [[Interests]] · **Status:** To do · **Priority:** High · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-016-fe Frontend · Interests vocabulary and my interests|Frontend]] · [[T-016-be Backend · Interests vocabulary and my interests|Backend]] · **Story:** [[T-016 Story]]

## What

`GET /interests` (public reference data), `GET/PUT /users/me/interests`. No outward entity.

## Design

- [[Screen Index#s07|s07]] Interests
- [[Screen Index#s71|s71]] Interests

## Dependencies

- Unblocks [[T-051 Gemma assistant sheet and suggestions]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
