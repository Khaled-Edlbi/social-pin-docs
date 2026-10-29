---
type: backend-delivery
code: event-ring-auto
scope: feature
feature: event-ring-auto
module: events
status: in-progress
screens: [s52]
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/in-progress, module/events, layer/backend]
---

# 🟡 Event Ring Auto-creation · Backend Delivery

**Feature:** [[F-21 Event Ring Auto-creation]] · **Status:** In progress · **Integration guide:** [[Event Ring Auto-creation Backend Integration]] · **Requirements:** [[FR-21 Event Ring Auto-creation Frontend Requirements]] · **QA:** [[Event Ring Auto-creation QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Ring`, `Event`, `EventParticipant`

**Code:** `src/modules/ring/ring.service.ts`

### What exists

- `RING_TYPE.EVENT`, `MINI_EVENT`, `MEETING`; `parentRingId` for MiniRings; `isTemporary` and the disposition flow.

### Gaps

- Create the Event Ring inside the registration transaction.
- Grant the organizer / exhibitor side membership rules.
- Enter event mode switches the active Ring (frontend) but needs the Ring to exist.

## Log

- 2026-10-18 · split out of [[F-21 Event Ring Auto-creation]] when the vault moved to layers
