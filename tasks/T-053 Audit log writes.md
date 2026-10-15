---
type: task
id: T-053
status: todo
priority: P0
effort: S
feature: audit-log
domain: platform
screens: []
depends: []
created: 2026-10-15
tags: [task, task/todo, domain/platform, priority/P0]
---

# ⬜ T-053 · Audit log writes

**Feature:** [[Audit Log]] · **Status:** To do · **Priority:** P0 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

`AuditService.record()` from auth, ring members, payments, AI actions.

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
