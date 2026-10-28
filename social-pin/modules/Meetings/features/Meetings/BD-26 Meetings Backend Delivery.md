---
type: backend-delivery
code: meetings
scope: feature
feature: meetings
module: meetings
status: todo
screens: [s59, s61, s64, s66, s67]
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/todo, module/meetings, layer/backend]
---

# ⬜ Meetings · Backend Delivery

**Feature:** [[F-26 Meetings]] · **Status:** To do · **Integration guide:** [[Meetings Backend Integration]] · **Requirements:** [[FR-26 Meetings Frontend Requirements]] · **QA:** [[Meetings QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

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

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[F-26 Meetings]] when the vault moved to layers
