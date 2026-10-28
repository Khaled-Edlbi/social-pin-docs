---
type: frontend-requirements
code: post-event
scope: feature
feature: post-event
module: events
status: draft
screens: [s62]
created: 2026-10-18
updated: 2026-10-28
tags: [frontend-requirements, frontend-requirements/draft, module/events, layer/frontend]
---

# Post-Event · Frontend Requirements

**Feature:** [[F-25 Post-Event]] · **Status:** Draft · **Story:** [[S-62 Post-Event Story]] · **API Integration:** not yet (backend not built)

What the client needs for the post-event summary and the Ring disposition sheet, and whether each need is met today. The disposition is built; the summary and follow-ups are not.

## Per screen

### [[Screen Index#s62|s62]] Post-event summary

- Needs: the lapsed Ring (id, name, `isTemporary`, `expiresAt`, `disposition`); the event's name; counters (connections, meetings, scans; leads for an exhibitor); follow-up suggestions with a count of pending connection requests; my other Rings as merge targets; the three disposition actions.
- Actions: Confirm (one disposition call), Review N (→ s46), Later (→ s11), Export leads (exhibitor).
- Source today: `GET /rings/:id` and `GET /rings` for the Ring and the merge targets, `POST /rings/:id/disposition` for the choice (all available); counters and suggestions not yet ([[S-62 Post-Event Story|Post-Event · S6]]).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| The lapsed Ring, owner view (works after expiry) | `GET /rings/:id` | ✅ | — |
| My Rings as merge targets | `GET /rings` (`type`, `isTemporary` filters) | ✅ | — |
| Keep / merge / auto-delete | `POST /rings/:id/disposition` (`disposition`, `mergedIntoRingId` for MERGE) | ✅ | — |
| Connections, meetings, scans counters (`EventSummary`) | — | ❌ | [[S-62 Post-Event Story|Post-Event · S6]] |
| Scan counts feeding the summary | — | ❌ | [[S-37 Badge & QR Story|Badge & QR · S19]] |
| Connections made during the event | — | ❌ | [[S-23 Connections Story|Connections · S19–S24]] |
| Meetings held during the event | — | ❌ | [[S-64 Meetings Story|Meetings · S11]] |
| Follow-up suggestions (Gemma) | — | ❌ | [[S-62 Post-Event Story|Post-Event · S6]], [[S-89 Gemma AI Story|Gemma AI · S7]] |
| Pending requests for "Review N" | — | ❌ | [[S-23 Connections Story|Connections · S8–S12]] |
| Leads export (exhibitor) | — | ❌ | [[S-59 Exhibitor Story|Exhibitor · S8]] |

## Behaviour expectations

- Refetch / realtime: open s62 from a local trigger when the active Event Ring's `expiresAt` passes, or from the "event ended" notification once [[F-39 Notifications]] exist. Refetch `GET /rings/:id` on open; refetch the summary on focus until it is ready. After a disposition, invalidate `rings:list`, `ring:{id}` and the target Ring's member count.
- Caching keys: `ring:{id}`, `rings:list`, `eventSummary:{eventId}`, `followUps:{eventId}`. The summary is immutable once computed and may be cached for the session.
- Pagination / ordering: merge targets use `GET /rings` ordering (default first, then newest), excluding the lapsed Ring and other `EVENT` / `MEETING` Rings by default; the list is small and unpaginated in the UI.
- Idempotency: one disposition call per Confirm; disable the button while in flight. A second call on a decided Ring is not sent.
- Never call `GET /views/ring/:ringId` for the lapsed Ring; it returns 404 `E_RING_ACCESS_02` to the owner as well.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[S-87 Error Contract Story|Error Contract · S4–S8]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 404 on `GET /rings/:id` or the disposition (also for a non-owner: the lookup is by owner, so a delegated admin gets the same 404) | `E_RING_02` | "This Ring no longer exists", back to s11 |
| 400 on MERGE without a target, or target = source | `E_RING_07` | "Pick another of your Rings to merge into", reopen the target picker |
| 404 on `GET /views/ring/:ringId` | `E_RING_ACCESS_02` | Never shown; the client does not make this call here |
| summary not ready | to be defined by [[S-62 Post-Event Story|Post-Event · S6]] | "Summary coming" placeholder; the Ring choice stays available |
| 401 | `E_AUTH_04` | Sign in again; return to s62 afterwards |

## Blocked by

- No decision note. Upstream tasks:
- [[S-62 Post-Event Story|Post-Event · S6]] — the counters and suggestions; waits on [[S-37 Badge & QR Story|Badge & QR · S19]], [[S-23 Connections Story|Connections · S19–S24]], [[S-64 Meetings Story|Meetings · S11]].
- [[S-47 Event Ring Auto-creation Story|Event Ring Auto-creation · S6]] — without an Event Ring there is nothing to dispose of on s62; the disposition endpoint can be exercised today only on a manually created temporary Ring.
- [[S-76 Cleanup Jobs Story|Cleanup Jobs · S4]] — the purge of `AUTO_DELETE` Rings; the client sees an archived Ring until it runs.
