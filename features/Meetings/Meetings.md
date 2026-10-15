---
type: feature
id: meetings
name: "Meetings"
status: todo
priority: P0
domain: meetings
screens: [s59, s61, s64, s66, s67]
updated: 2026-10-15
tags: [feature, status/todo, domain/meetings, priority/P0]
---

# ❌ Meetings

**Status:** TODO · **Priority:** P0 · **Domain:** [[Feature Tree#Meetings|Meetings]]

Availability slots, request a meeting with a slot (s59), a temporary Ring created per meeting, accept by offering slots or decline with a reason (s64), my meetings and calendar (s61, s66), meeting detail with agenda, shared files, reschedule and cancel (s67).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s59|s59]] | Request a meeting |  |
| [[Screen Index#s61|s61]] | My meetings |  |
| [[Screen Index#s64|s64]] | Incoming meetings |  |
| [[Screen Index#s66|s66]] | Meetings |  |
| [[Screen Index#s67|s67]] | Meeting detail |  |

Wireframe brief sections: [[Wireframe Brief#Exhibitor discovery → request a meeting|§8.2 Exhibitor discovery → request a meeting]], [[Wireframe Brief#Meetings & scheduling|§10 Meetings & scheduling]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `AvailabilitySlot`, `MeetingRequest`, `Meeting`, `MeetingParticipant`, `CalendarIntegration`

### What exists

- Schema with the `availability_slots` exclusion constraint (`tstzrange`, `btree_gist`) so two concurrent bookings cannot both commit.
- `SLOT_SOURCE` records where a slot came from.

### Gaps

- Slot CRUD.
- Request → accept (offer slots) / decline (reason) → confirm, each `@Transactional`.
- `MEETING` Ring created automatically and tied to the meeting; keep / merge / delete after.
- Calendar view and detail; reschedule and cancel.
- Decline sends a notification with the reason.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-041 Availability slots CRUD]] | ⬜ To do | P0 | M |
| [[T-042 Meeting request, accept with slots, decline with reason]] | ⬜ To do | P0 | L |
| [[T-043 Temporary meeting Ring per meeting]] | ⬜ To do | P0 | M |
| [[T-044 My meetings, calendar, detail, reschedule, cancel]] | ⬜ To do | P0 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "meetings" SORT priority ASC
```

## Related

- [[Rings]]
- [[Event Ring Auto-creation]]
- [[Events During]]
- [[Exhibitor]]
- [[Notifications]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
