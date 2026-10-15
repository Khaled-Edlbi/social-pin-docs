---
type: feature
id: event-ring-auto
name: "Event Ring Auto-creation"
status: partial
priority: P0
domain: events
screens: [s52]
updated: 2026-10-15
tags: [feature, status/partial, domain/events, priority/P0]
---

# 🟡 Event Ring Auto-creation

**Status:** Partial (needs more) · **Priority:** P0 · **Domain:** [[Feature Tree#Events|Events]]

The `EVENT` Ring type exists and is rejected on manual create; nothing creates one when a registration succeeds (s52 "Event Ring granted").

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s52|s52]] | Event Ring granted |  |

Wireframe brief sections: [[Wireframe Brief#Tickets, access levels, RSVP, payment|§7.3 Tickets, access levels, RSVP, payment]], [[Wireframe Brief#In-event hub|§8.1 In-event hub]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Ring`, `Event`, `EventParticipant`

**Code:** `src/modules/ring/ring.service.ts`

### What exists

- `RING_TYPE.EVENT`, `MINI_EVENT`, `MEETING`; `parentRingId` for MiniRings; `isTemporary` and the disposition flow.

### Gaps

- Create the Event Ring inside the registration transaction.
- Grant the organizer / exhibitor side membership rules.
- Enter event mode switches the active Ring (frontend) but needs the Ring to exist.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-011 Create the Event Ring on registration]] | ⛔ Blocked | P0 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "event-ring-auto" SORT priority ASC
```

## Related

- [[Rings]]
- [[Events Before]]
- [[Events During]]
- [[Post-Event]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
