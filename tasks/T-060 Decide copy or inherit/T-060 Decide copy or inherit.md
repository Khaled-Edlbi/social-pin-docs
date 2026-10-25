---
type: task
id: T-060
status: needs-info
priority: high
effort: S
feature: ring-projection
module: identity
screens: [s28]
depends: [D-02]
created: 2026-10-15
tags: [task, task/needs-info, module/identity, priority/high]
decision: D-05
---

# ❓ T-060 · Decide: copy or inherit

> ⚠ Affected by [[DR-05 Inherit per field, copy without members]] (2026-10-25): D-05 is decided (and D-02, which it needed, by [[DR-02 One main profile every Ring starts from]]); this task's decision is taken and the PM can close it.

**Feature:** [[Ring Projection]] · **Status:** Needs a decision / info · **Priority:** High · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

See [[D-05 Copy or inherit]].

## Design

- [[Screen Index#s28|s28]] Copy from a Ring

## Dependencies

- Waits on decision [[D-02 Base profile work fields]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
