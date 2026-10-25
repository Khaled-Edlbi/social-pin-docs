---
type: task
id: T-057
status: needs-info
priority: critical
effort: S
feature: profiles
module: identity
screens: [s05]
depends: []
created: 2026-10-15
tags: [task, task/needs-info, module/identity, priority/critical]
decision: D-02
---

# ❓ T-057 · Decide: base profile work fields

> ⚠ Affected by [[DR-02 One main profile every Ring starts from]] (2026-10-25): D-02 is decided; this task's decision is taken and the PM can close it.

**Feature:** [[Profiles & Pin Name]] · **Status:** Needs a decision / info · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

See [[D-02 Base profile work fields]].

## Design

- [[Screen Index#s05|s05]] Review import

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
