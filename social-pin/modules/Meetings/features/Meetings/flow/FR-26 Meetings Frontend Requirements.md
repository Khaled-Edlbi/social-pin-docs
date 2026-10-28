---
type: frontend-requirements
code: meetings
scope: feature
feature: meetings
module: meetings
status: draft
screens: [s59, s61, s64, s66, s67]
created: 2026-10-18
updated: 2026-10-28
tags: [frontend-requirements, frontend-requirements/draft, module/meetings, layer/frontend]
---

# Meetings · Frontend Requirements

**Feature:** [[F-26 Meetings]] · **Status:** Draft · **Story:** [[S-64 Meetings Story]] · **API Integration:** not yet (backend not built)

What the client needs for the slot-based request, the incoming list, the calendar and the detail, and whether each need is met today. Only the Ring lifecycle (list, view, disposition) exists.

## Per screen

### [[Screen Index#s59|s59]] Request a meeting

- Needs: the other party's free availability slots for the event (start, end, in the event's timezone); create a request with slot, title, note, optional reference to a meeting being rescheduled; for the exhibitor, my own free slots to offer and an accept call with up to three slots.
- Source today: not yet ([[S-64 Meetings Story|Meetings · S8]], [[S-64 Meetings Story|Meetings · S9]]).

### [[Screen Index#s61|s61]] My meetings

- Needs: today's meetings and requests for the active event with status and the offered slots to confirm; confirm call.
- Source today: not yet ([[S-64 Meetings Story|Meetings · S11]], Meetings · S9).

### [[Screen Index#s64|s64]] Incoming meetings

- Needs: requests addressed to me or my business, grouped by status; accept and decline (with reason).
- Source today: not yet (Meetings · S9).

### [[Screen Index#s66|s66]] Meetings

- Needs: all my meetings, paginated, with filters (upcoming, past, event) and the fields for a calendar; the meeting Ring id per card for the visual link.
- Source today: not yet (Meetings · S11). The Ring itself will be readable with `GET /rings/:id` or under `GET /rings/shared-with-me` depending on ownership (Meetings · S10).

### [[Screen Index#s67|s67]] Meeting detail

- Needs: participants, agenda, shared files, slot, booth, status; reschedule (new request referencing this meeting) and cancel.
- Source today: not yet (Meetings · S11). The other participant's card renders with `GET /views/ring/:ringId` through the meeting Ring once Meetings · S10 creates it; the disposition after the window is `POST /rings/:id/disposition` (available).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| My availability slots: list, create, delete | — | ❌ | [[S-64 Meetings Story|Meetings · S8]] |
| Another party's free slots for an event | — | ❌ | [[S-64 Meetings Story|Meetings · S8]] |
| Create a request with a slot | — | ❌ | [[S-64 Meetings Story|Meetings · S9]] |
| Accept (confirm or offer slots), decline with reason, requester confirms | — | ❌ | [[S-64 Meetings Story|Meetings · S9]] |
| Meeting Ring created per request, both parties members | — | ❌ | [[S-64 Meetings Story|Meetings · S10]] |
| The other participant as the meeting Ring shows them | `GET /views/ring/:ringId` | ✅ | — (needs the Ring from Meetings · S10) |
| My meetings list, calendar, detail, reschedule, cancel | — | ❌ | [[S-64 Meetings Story|Meetings · S11]] |
| Decline notification with reason | — | ❌ | [[S-96 Notifications Story|Notifications · S7]] |
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

`ErrorCode` is not on the wire yet ([[S-87 Error Contract Story|Error Contract · S4–S8]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 409 slot already booked (exclusion constraint) | to be defined by [[S-64 Meetings Story|Meetings · S8]] | "That slot was just taken", refresh the slots |
| 409 request already answered or withdrawn | to be defined by [[S-64 Meetings Story|Meetings · S9]] | Refetch and show the current state |
| 400 decline without a reason | to be defined by [[S-64 Meetings Story|Meetings · S9]] | Field error; the client validates first |
| 404 on `GET /views/ring/:ringId` (window not open, declined, blocked) | `E_RING_ACCESS_01` | "Profile not available", same copy for every cause |
| 404 on `GET /views/ring/:ringId` (window ended) | `E_RING_ACCESS_02` | "This meeting has ended", open the disposition sheet |
| 400 / 404 on the disposition | `E_RING_07` / `E_RING_02` | As in [[FR-25 Post-Event Frontend Requirements]] |
| 403 Pro gate on Gemma auto-request | to be defined by [[S-71 Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]] | "Go Pro" → s70 |

## Blocked by

- No decision note. Upstream tasks:
- [[S-64 Meetings Story|Meetings · S8]] — s59 and the exhibitor's offer; unblocks Meetings · S9.
- [[S-64 Meetings Story|Meetings · S9]] — s59, s61, s64; unblocks Meetings · S10 and Meetings · S11.
- [[S-64 Meetings Story|Meetings · S10]] — the Ring behind every card and the participant card on s67.
- [[S-64 Meetings Story|Meetings · S11]] — s61, s66, s67.
- [[S-96 Notifications Story|Notifications · S7]] — the decline reason reaching the requester.
