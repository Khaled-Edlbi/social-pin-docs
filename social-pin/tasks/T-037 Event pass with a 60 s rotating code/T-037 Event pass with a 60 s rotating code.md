---
type: task
id: T-037
status: blocked
priority: high
effort: M
feature: events-during
module: events
screens: [s56]
depends: []
created: 2026-10-15
updated: 2026-10-27
tags: [task, task/blocked, module/events, priority/high]
related: ["Event Ring Auto-creation Story", "Badge & QR Story"]
---

# ⛔ T-037 · Event pass with a 60 s rotating code

**Feature:** [[Events During]] · **Status:** Blocked · **Priority:** High · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-037-fe Frontend · Event pass with a 60 s rotating code|Frontend]] · [[T-037-be Backend · Event pass with a 60 s rotating code|Backend]] · **Story:** [[T-037 Story]]

## What

Same token mechanism as the badge, shorter window, bound to the Event Ring.

## Design

- [[Screen Index#s56|s56]] Event pass

## Dependencies

- Waits on [[Badge & QR Story|Badge & QR · S7–S12]]
- Waits on [[Event Ring Auto-creation Story|Event Ring Auto-creation · S6]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
