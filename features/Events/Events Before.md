---
type: feature
id: events-before
name: "Events Before"
status: todo
priority: P0
domain: events
screens: [s48, s49, s50, s51, s52]
updated: 2026-10-15
tags: [feature, status/todo, domain/events, priority/P0]
---

# ❌ Events Before

**Status:** TODO · **Priority:** P0 · **Domain:** [[Feature Tree#Events|Events]]

Events list with filters and "your contacts are going" (s48), event landing page and schedule (s49), tickets, access levels, sub-events, sold out (s50), payment (s51), Event Ring granted on registration (s52).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s48|s48]] | Events tab |  |
| [[Screen Index#s49|s49]] | Event landing |  |
| [[Screen Index#s50|s50]] | Tickets & levels |  |
| [[Screen Index#s51|s51]] | Payment |  |
| [[Screen Index#s52|s52]] | Event Ring granted |  |

Wireframe brief sections: [[Wireframe Brief#Before-event journeys|§7 Before-event journeys]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Event`, `EventParticipant`, `EventPackage`, `PackageEntitlement`, `MiniEvent`, `MiniEventAccess`, `Location`

### What exists

- Full event schema, package → mini-event entitlement as data.

### Gaps

- Event list + detail + schedule.
- Packages and visitor levels; sold-out state.
- Registration transaction: participant + order + Event Ring (see [[Event Ring Auto-creation]], [[Payments & Orders]]).

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-033 Events list, detail, schedule]] | ⬜ To do | P0 | L |
| [[T-034 Tickets, packages, levels, sold-out]] | ⬜ To do | P0 | M |
| [[T-035 Registration transaction with order and payment]] | ⛔ Blocked | P0 | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "events-before" SORT priority ASC
```

## Related

- [[Event Ring Auto-creation]]
- [[Payments & Orders]]
- [[Events During]]
- [[Connections]]
- [[Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
