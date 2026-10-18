---
type: story
code: meetings
scope: feature
feature: meetings
module: meetings
status: draft
screens: [s59, s61, s64, s66, s67]
updated: 2026-10-18
tags: [story, story/draft, module/meetings, layer/business]
---

# Meetings · User Story

**Feature:** [[Meetings]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Meetings Frontend Requirements]] · **API Integration:** not yet (backend not built)

A visitor wants to meet an exhibitor (or an exhibitor another exhibitor). They pick a slot from the other party's availability, the request spawns a temporary meeting Ring that holds the meeting's details, the other party accepts by offering slots or declines with a reason, and confirmed meetings land on a calendar. The meeting Ring makes both parties visible to each other for the meeting window only. The schema exists, with the exclusion constraint that stops two bookings of one slot; no endpoint does.

## Persona

Visitor (User A) requesting; exhibitor (User B) receiving on s64 and also requesting exhibitor-to-exhibitor. Gemma's auto-requests (Pro, [[T-052 Smart Match]]) enter the same flow as requests from the visitor.

## Stories

### S1 · Request a meeting ([[Screen Index#s59|s59]])

**As a** visitor on an exhibitor's card, **I want** to pick one of their available slots and send a request, **so that** we have a time without a message thread.

Acceptance criteria:
- [ ] Slots come from the other party's availability for this event, shown in the event's timezone, only those still free; a slot taken between load and send fails cleanly and refreshes the list.
- [ ] The request carries the slot, an optional title and note; "Send request · 11:20" names the chosen slot; "Cancel" returns to s55.
- [ ] On send, a temporary meeting Ring animates in with the dashed treatment, and the request appears on [[Screen Index#s61|s61]] as "Requested".
- [ ] From Smart Match (s60) the exhibitor and a suggested slot are pre-selected; the user still confirms.

### S2 · My meetings today ([[Screen Index#s61|s61]])

**As a** visitor in event mode, **I want** today's meetings and pending requests in one list, **so that** I know where to be next.

Acceptance criteria:
- [ ] Cards show the other party, time slot, booth or room, status (requested, confirmed, declined with reason, cancelled, past).
- [ ] "Confirm" appears on a request where the other party offered slots; it picks one and confirms. "View" opens s67. "Propose a new meeting" opens s59.
- [ ] A declined request shows the reason inline and offers "Propose another time".

### S3 · Incoming meetings ([[Screen Index#s64|s64]])

**As an** exhibitor, **I want** requests grouped by Need action, Accepted and Declined, **so that** leads are handled in order.

Acceptance criteria:
- [ ] Need action lists requests with the requester's card as my meeting Ring lets me see it, the requested slot and the event.
- [ ] Accept and Decline are the only actions; a request withdrawn by the requester disappears on refetch.

### S4 · Accept by offering slots ([[Screen Index#s59|s59]])

**As an** exhibitor, **I want** to accept by confirming the requested slot or offering alternatives from my availability, **so that** the meeting gets a time we both hold.

Acceptance criteria:
- [ ] The requested slot is pre-selected; I can add up to three alternatives from my free slots.
- [ ] Accepting with exactly the requested slot confirms the meeting at once; offering alternatives sends them back and the request waits for the requester's "Confirm" (S2).
- [ ] A confirmed meeting animates onto both calendars; the meeting Ring's window becomes the meeting time plus the margin the backend sets.

### S5 · Decline with a reason ([[Screen Index#s64|s64]])

**As an** exhibitor, **I want** to decline with a short reason, **so that** the requester knows why and whether to try again.

Acceptance criteria:
- [ ] The reason is required; the requester receives a notification with it and sees it on s61 / s66.
- [ ] Declining closes the meeting Ring at once; neither party sees the other through it afterwards.

### S6 · Meetings and calendar ([[Screen Index#s66|s66]])

**As a** user, **I want** all my meetings across events as cards and in a calendar, **so that** I can plan beyond today.

Acceptance criteria:
- [ ] Cards: event, date, time slot, title, organisation, room or location; a calendar view with the same data; each card is visibly linked to its temporary Ring.
- [ ] Filters: upcoming, past, by event; ordering by start time.

### S7 · Meeting detail ([[Screen Index#s67|s67]])

**As a** participant, **I want** the agenda, shared files, directions, my badge, and the power to reschedule or cancel, **so that** the meeting goes well.

Acceptance criteria:
- [ ] Shows participants as the meeting Ring lets each see the other, agenda, shared files (`File` rows), the slot, the booth; "Directions" → s57, "Show my badge" → s34.
- [ ] "Reschedule" opens s59 as a new request referencing this meeting; the old meeting stays until the new one is confirmed. "Cancel" asks for confirmation and returns to s66 as cancelled.
- [ ] After the meeting window, the meeting Ring lapses; the keep / merge / auto-delete sheet reuses [[Post-Event Story]] S3 with `POST /rings/:id/disposition`.

## States and motion the design asks for

- Motion: requesting a meeting **spawns a temporary Ring** that animates in as a distinct, time-limited object, differentiated by structure (dashed), not colour (brief §8.2, signature motion 9).
- Motion: **confirmed meetings animate onto the calendar**; each meeting's temporary Ring is visibly linked to its card (brief §10).
- State: requested, confirmed, declined (with reason), cancelled, past (brief §10); need-action, accepted, declined, no requests (brief §9.2).
- Motion: accepting a Smart Match suggestion flows straight into the slot-based request (brief §8.4).

## Rules the backend already enforces

- `availability_slots` carries an exclusion constraint (`tstzrange`, `btree_gist`): two concurrent bookings of one slot cannot both commit; the loser gets a domain error, not a duplicate meeting ([[T-041 Availability slots CRUD]]).
- `SLOT_SOURCE` records where a slot came from (`MANUAL`, `CALENDAR_SYNC`, `PACKAGE`); a revoked calendar integration removes only what it created.
- The meeting Ring (`RING_TYPE.MEETING`) cannot be created by `POST /rings` (400 `E_RING_01`); the request flow creates it with both participants as members ([[T-043 Temporary meeting Ring per meeting]]).
- The meeting Ring makes both parties visible to each other for the meeting window only, resolved on every request; a block overrides it in both directions ([[Ring Access Model]]).
- Neither party learns which Ring the other placed them in; the meeting Ring view carries no `ringId`.
- Disposition after the window is the existing `UNDECIDED → KEEP | MERGE | AUTO_DELETE` ([[Rings]]).

## Open questions

- No decision note exists. Open points:
- [[T-043 Temporary meeting Ring per meeting]] — who owns the meeting Ring (requester, receiver, or both as members of a Ring without an owner) decides who sees the disposition sheet in S7.
- [[T-042 Meeting request, accept with slots, decline with reason]] — the margin around the meeting window and whether offering alternatives holds those slots.
- [[T-045 NotificationService.emit and the inbox]] — the decline notification and its reason depend on it.
