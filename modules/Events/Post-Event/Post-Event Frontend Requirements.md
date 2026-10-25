---
type: frontend-requirements
code: post-event
scope: feature
feature: post-event
module: events
status: draft
screens: [s62]
created: 2026-10-18
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/events, layer/frontend]
---

# Post-Event · Frontend Requirements

**Feature:** [[Post-Event]] · **Status:** Draft · **Story:** [[Post-Event Story]] · **API Integration:** not yet (backend not built)

What the client needs for the post-event summary and the Ring disposition sheet, and whether each need is met today. The disposition is built; the summary and follow-ups are not.

## Per screen

### [[Screen Index#s62|s62]] Post-event summary

- Needs: the lapsed Ring (id, name, `isTemporary`, `expiresAt`, `disposition`); the event's name; counters (connections, meetings, scans; leads for an exhibitor); follow-up suggestions with a count of pending connection requests; my other Rings as merge targets; the three disposition actions.
- Actions: Confirm (one disposition call), Review N (→ s46), Later (→ s11), Export leads (exhibitor).
- Source today: `GET /rings/:id` and `GET /rings` for the Ring and the merge targets, `POST /rings/:id/disposition` for the choice (all available); counters and suggestions not yet ([[T-050 Post-event summary and follow-ups]]).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| The lapsed Ring, owner view (works after expiry) | `GET /rings/:id` | ✅ | — |
| My Rings as merge targets | `GET /rings` (`type`, `isTemporary` filters) | ✅ | — |
| Keep / merge / auto-delete | `POST /rings/:id/disposition` (`disposition`, `mergedIntoRingId` for MERGE) | ✅ | — |
| Connections, meetings, scans counters (`EventSummary`) | — | ❌ | [[T-050 Post-event summary and follow-ups]] |
| Scan counts feeding the summary | — | ❌ | [[T-009 Scan counter and share link]] |
| Connections made during the event | — | ❌ | [[T-023 Connection detail and contacts list]] |
| Meetings held during the event | — | ❌ | [[T-044 My meetings, calendar, detail, reschedule, cancel]] |
| Follow-up suggestions (Gemma) | — | ❌ | [[T-050 Post-event summary and follow-ups]], [[T-051 Gemma assistant sheet and suggestions]] |
| Pending requests for "Review N" | — | ❌ | [[T-021 Connect request send, inbox, cancel]] |
| Leads export (exhibitor) | — | ❌ | [[T-048b Booth analytics and leads CSV export]] |

## Behaviour expectations

- Refetch / realtime: open s62 from a local trigger when the active Event Ring's `expiresAt` passes, or from the "event ended" notification once [[Notifications]] exist. Refetch `GET /rings/:id` on open; refetch the summary on focus until it is ready. After a disposition, invalidate `rings:list`, `ring:{id}` and the target Ring's member count.
- Caching keys: `ring:{id}`, `rings:list`, `eventSummary:{eventId}`, `followUps:{eventId}`. The summary is immutable once computed and may be cached for the session.
- Pagination / ordering: merge targets use `GET /rings` ordering (default first, then newest), excluding the lapsed Ring and other `EVENT` / `MEETING` Rings by default; the list is small and unpaginated in the UI.
- Idempotency: one disposition call per Confirm; disable the button while in flight. A second call on a decided Ring is not sent.
- Never call `GET /views/ring/:ringId` for the lapsed Ring; it returns 404 `E_RING_ACCESS_02` to the owner as well.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 404 on `GET /rings/:id` or the disposition (also for a non-owner: the lookup is by owner, so a delegated admin gets the same 404) | `E_RING_02` | "This Ring no longer exists", back to s11 |
| 400 on MERGE without a target, or target = source | `E_RING_07` | "Pick another of your Rings to merge into", reopen the target picker |
| 404 on `GET /views/ring/:ringId` | `E_RING_ACCESS_02` | Never shown; the client does not make this call here |
| summary not ready | to be defined by [[T-050 Post-event summary and follow-ups]] | "Summary coming" placeholder; the Ring choice stays available |
| 401 | `E_AUTH_04` | Sign in again; return to s62 afterwards |

## Blocked by

- No decision note. Upstream tasks:
- [[T-050 Post-event summary and follow-ups]] — the counters and suggestions; waits on [[T-009 Scan counter and share link]], [[T-023 Connection detail and contacts list]], [[T-044 My meetings, calendar, detail, reschedule, cancel]].
- [[T-011 Create the Event Ring on registration]] — without an Event Ring there is nothing to dispose of on s62; the disposition endpoint can be exercised today only on a manually created temporary Ring.
- [[T-054 Cleanup jobs]] — the purge of `AUTO_DELETE` Rings; the client sees an archived Ring until it runs.
