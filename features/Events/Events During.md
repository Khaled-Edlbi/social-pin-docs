---
type: feature
id: events-during
name: "Events During"
status: todo
priority: P0
domain: events
screens: [s53, s54, s55, s56, s57, s58]
updated: 2026-10-18
tags: [feature, status/todo, domain/events, priority/P0]
---

# ❌ Events During

**Status:** TODO · **Priority:** P0 · **Domain:** [[Feature Tree#Events|Events]] · **Story:** [[Events During Story]] · **Requirements:** [[Events During Requirements]]

Event mode hub (s53), exhibitors list and detail (s54, s55), event pass with a 60-second rotating code (s56), floor map and booths (s57), catalogue of products and talks (s58), lounges and upgrades.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s53|s53]] | Event mode |  |
| [[Screen Index#s54|s54]] | Exhibitors |  |
| [[Screen Index#s55|s55]] | Exhibitor |  |
| [[Screen Index#s56|s56]] | Event pass |  |
| [[Screen Index#s57|s57]] | Floor map |  |
| [[Screen Index#s58|s58]] | Catalogue | No products table |

Wireframe brief sections: [[Wireframe Brief#In-event hub|§8.1 In-event hub]], [[Wireframe Brief#Sub-events, lounges, upgrades|§8.3 Sub-events, lounges, upgrades]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Exhibitor`, `Booth`, `MiniEvent`, `MiniEventAccess`, `EventParticipant`

### What exists

- Exhibitors, booths and mini-events schema.

### Gaps

- Exhibitor list / detail scoped by the Event Ring.
- Event pass: rotating code (shares the mechanism of [[Badge & QR]]).
- Floor map data (booth positions).
- **No products / catalogue table yet**: schema change needed.
- Lounges and upgrades gate on package and Pro, see [[Subscription (Free vs Pro)]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-036 Event mode exhibitors list and detail]] | ⛔ Blocked | P0 | M |
| [[T-037 Event pass with a 60 s rotating code]] | ⛔ Blocked | P1 | M |
| [[T-038 Floor map and booths]] | ⛔ Blocked | P1 | M |
| [[T-039 Catalogue products and talks (new table)]] | ❓ Needs a decision / info | P1 | L |
| [[T-040 Lounges and upgrades]] | ⛔ Blocked | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "events-during" SORT priority ASC
```

## Related

- [[Events Before]]
- [[Badge & QR]]
- [[Meetings]]
- [[Exhibitor]]
- [[Subscription (Free vs Pro)]]
- [[Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
