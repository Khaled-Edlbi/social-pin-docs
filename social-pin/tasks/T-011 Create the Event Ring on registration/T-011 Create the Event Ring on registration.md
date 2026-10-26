---
type: task
id: T-011
status: blocked
priority: critical
effort: M
feature: event-ring-auto
module: events
screens: [s52]
depends: [T-033]
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/blocked, module/events, priority/critical]
---

# ⛔ T-011 · Create the Event Ring on registration

**Feature:** [[Event Ring Auto-creation]] · **Status:** Blocked · **Priority:** Critical · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-011-be Backend · Create the Event Ring on registration|Backend]] · **Story:** [[T-011 Story]]

## What

Inside the registration transaction: create an `EVENT` Ring (temporary, window = event dates), add the participant, link `EventParticipant.ringId`.

## Design

- [[Screen Index#s52|s52]] Event Ring granted

## Dependencies

- Waits on [[T-033 Events list, detail, schedule]]
- Unblocks [[T-037 Event pass with a 60 s rotating code]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
