---
type: requirements
id: meetings
feature: meetings
status: draft
domain: meetings
screens: [s59, s61, s64, s66, s67]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/meetings]
---

# Meetings · Frontend Requirements

**Feature:** [[Meetings]] · **Status:** Draft · **Story:** [[Meetings Story]] · **API Integration:** not yet (backend not built)

What the client needs for the slot-based request, the incoming list, the calendar and the detail, and whether each need is met today. Only the Ring lifecycle (list, view, disposition) exists.

## Per screen

### [[Screen Index#s59|s59]] Request a meeting

- Needs: the other party's free availability slots for the event (start, end, in the event's timezone); create a request with slot, title, note, optional reference to a meeting being rescheduled; for the exhibitor, my own free slots to offer and an accept call with up to three slots.
- Source today: not yet ([[T-041 Availability slots CRUD]], [[T-042 Meeting request, accept with slots, decline with reason]]).

### [[Screen Index#s61|s61]] My meetings

- Needs: today's meetings and requests for the active event with status and the offered slots to confirm; confirm call.
- Source today: not yet ([[T-044 My meetings, calendar, detail, reschedule, cancel]], T-042).

### [[Screen Index#s64|s64]] Incoming meetings

- Needs: requests addressed to me or my business, grouped by status; accept and decline (with reason).
- Source today: not yet (T-042).

### [[Screen Index#s66|s66]] Meetings

- Needs: all my meetings, paginated, with filters (upcoming, past, event) and the fields for a calendar; the meeting Ring id per card for the visual link.
- Source today: not yet (T-044). The Ring itself will be readable with `GET /rings/:id` or under `GET /rings/shared-with-me` depending on ownership (T-043).

### [[Screen Index#s67|s67]] Meeting detail

- Needs: participants, agenda, shared files, slot, booth, status; reschedule (new request referencing this meeting) and cancel.
- Source today: not yet (T-044). The other participant's card renders with `GET /views/ring/:ringId` through the meeting Ring once T-043 creates it; the disposition after the window is `POST /rings/:id/disposition` (available).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| My availability slots: list, create, delete | — | ❌ | [[T-041 Availability slots CRUD]] |
| Another party's free slots for an event | — | ❌ | [[T-041 Availability slots CRUD]] |
| Create a request with a slot | — | ❌ | [[T-042 Meeting request, accept with slots, decline with reason]] |
| Accept (confirm or offer slots), decline with reason, requester confirms | — | ❌ | [[T-042 Meeting request, accept with slots, decline with reason]] |
| Meeting Ring created per request, both parties members | — | ❌ | [[T-043 Temporary meeting Ring per meeting]] |
| The other participant as the meeting Ring shows them | `GET /views/ring/:ringId` | ✅ | — (needs the Ring from T-043) |
| My meetings list, calendar, detail, reschedule, cancel | — | ❌ | [[T-044 My meetings, calendar, detail, reschedule, cancel]] |
| Decline notification with reason | — | ❌ | [[T-045 NotificationService.emit and the inbox]] |
| Keep / merge / auto-delete the lapsed meeting Ring | `POST /rings/:id/disposition` | ✅ | — |
| Calendar sync (`CalendarIntegration`) | — | ❌ | no task yet |

## Behaviour expectations

- Refetch / realtime: a request's status is refetched on focus and when a meeting notification arrives; while a request is "Requested" or "Slots offered", s61 and s64 poll the request every 30 s in event mode. Slots are refetched on opening s59 and after any failed send.
- Caching keys: `slots:{userId}:{eventId}`, `meetingRequest:{id}`, `meetingRequests:incoming:{status}`, `meetings:{filter}`, `meeting:{id}`, `ring:{meetingRingId}`. Drop `meeting:{id}` and the Ring key at the meeting window's end.
- Pagination / ordering: s66 paginated (`limit` 20, `TABLE_MAX_LIMIT = 50`), ordered by start time ascending for upcoming and descending for past; `meta.total` is the unpaginated count. s61 and s64 are per event and unpaginated in the UI.
- Idempotency: one request per send; the button is disabled in flight; a 409 on a taken slot refreshes the slots and re-opens the picker with the taken slot removed.
- Timezones: slots are stored in UTC and rendered in the event's `timezone`; the user's zone is a secondary line when it differs.
- Reschedule is a new request that references the old meeting; the client keeps showing the old meeting as confirmed until the new one is.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 409 slot already booked (exclusion constraint) | to be defined by [[T-041 Availability slots CRUD]] | "That slot was just taken", refresh the slots |
| 409 request already answered or withdrawn | to be defined by [[T-042 Meeting request, accept with slots, decline with reason]] | Refetch and show the current state |
| 400 decline without a reason | to be defined by [[T-042 Meeting request, accept with slots, decline with reason]] | Field error; the client validates first |
| 404 on `GET /views/ring/:ringId` (window not open, declined, blocked) | `E_RING_ACCESS_01` | "Profile not available", same copy for every cause |
| 404 on `GET /views/ring/:ringId` (window ended) | `E_RING_ACCESS_02` | "This meeting has ended", open the disposition sheet |
| 400 / 404 on the disposition | `E_RING_07` / `E_RING_02` | As in [[Post-Event Requirements]] |
| 403 Pro gate on Gemma auto-request | to be defined by [[T-049 Subscription endpoints and a single Pro gate]] | "Go Pro" → s70 |

## Blocked by

- No decision note. Upstream tasks:
- [[T-041 Availability slots CRUD]] — s59 and the exhibitor's offer; unblocks T-042.
- [[T-042 Meeting request, accept with slots, decline with reason]] — s59, s61, s64; unblocks T-043 and T-044.
- [[T-043 Temporary meeting Ring per meeting]] — the Ring behind every card and the participant card on s67.
- [[T-044 My meetings, calendar, detail, reschedule, cancel]] — s61, s66, s67.
- [[T-045 NotificationService.emit and the inbox]] — the decline reason reaching the requester.
