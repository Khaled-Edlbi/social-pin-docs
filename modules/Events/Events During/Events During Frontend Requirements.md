---
type: frontend-requirements
code: events-during
scope: feature
feature: events-during
module: events
status: draft
screens: [s53, s54, s55, s56, s57, s58]
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/events, layer/frontend]
---

# Events During · Frontend Requirements

**Feature:** [[Events During]] · **Status:** Draft · **Story:** [[Events During Story]] · **API Integration:** not yet (backend not built)

What the client needs for the in-event hub and its six screens, and whether each need is met today. Only the Ring view that renders an exhibitor's perspective exists; every event-scoped list is missing.

## Per screen

### [[Screen Index#s53|s53]] Event mode

- Needs: the active Event Ring (id, name, window, level from my participant row), my package and its entitlements, mini-events with their access state (owned / purchasable / locked), account type for the Pro locks, today's meetings count.
- Source today: `GET /rings/:id` for the Ring (available); the rest not yet ([[T-040 Lounges and upgrades]], [[T-049 Subscription endpoints and a single Pro gate]], [[T-044 My meetings, calendar, detail, reschedule, cancel]]).

### [[Screen Index#s54|s54]] Exhibitors

- Needs: paginated exhibitors of the event with name, logo, booth code, tags, saved flag; search.
- Source today: not yet ([[T-036 Event mode exhibitors list and detail]]).

### [[Screen Index#s55|s55]] Exhibitor

- Needs: the exhibitor's business Ring view (about, links, gallery, video, documents), team on the stand, products, availability entry for "Request a meeting".
- Source today: `GET /views/ring/:ringId` renders a Ring view, but only for a viewer who is already a live member of that business Ring; the event-scoped card that any attendee may open is T-036.

### [[Screen Index#s56|s56]] Event pass

- Needs: a code for the Event Ring with `expiresAt` of the current window, the level label.
- Source today: not yet ([[T-037 Event pass with a 60 s rotating code]]).

### [[Screen Index#s57|s57]] Floor map

- Needs: map asset, booths with position, code and exhibitor id.
- Source today: not yet ([[T-038 Floor map and booths]]).

### [[Screen Index#s58|s58]] Catalogue

- Needs: products (exhibitor, name, image) and talks (mini-event, time, room, access state).
- Source today: not yet; no table ([[T-039 Catalogue products and talks (new table)]]).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Active Event Ring detail | `GET /rings/:id` | ✅ | — |
| Exhibitors list and detail, scoped by Event Ring | — | ❌ | [[T-036 Event mode exhibitors list and detail]] |
| Exhibitor's Ring view when I am a member of it | `GET /views/ring/:ringId` | ✅ | — |
| Event pass code, 60 s window | — | ❌ | [[T-037 Event pass with a 60 s rotating code]] |
| Floor map asset and booths | — | ❌ | [[T-038 Floor map and booths]] |
| Catalogue of products and talks | — | ❌ | [[T-039 Catalogue products and talks (new table)]] |
| Mini-event access state, upgrade purchase | — | ❌ | [[T-040 Lounges and upgrades]] |
| Pro lock state | — | ❌ | [[T-049 Subscription endpoints and a single Pro gate]] |
| Smart Match suggestions | — | ❌ | [[T-052 Smart Match]] |
| Meetings today | — | ❌ | [[T-044 My meetings, calendar, detail, reschedule, cancel]] |

## Behaviour expectations

- Refetch / realtime: the pass code is refetched when its `expiresAt` is 5 s away; the countdown is driven by the server's `expiresAt`, not by a local 60 s timer, so clock drift does not show a dead code. Exhibitor and map data refetch on focus; mini-event states refetch after any purchase and on focus.
- Caching keys: `event:{id}:exhibitors:{query}`, `exhibitor:{id}`, `event:{id}:booths`, `event:{id}:catalogue`, `event:{id}:miniEvents`, `pass:{ringId}` (never persisted to disk). All keys are dropped at the Event Ring's `expiresAt`.
- Pagination / ordering: exhibitors paginated (`limit` 20 default, `TABLE_MAX_LIMIT = 50`), saved first then by name; `meta.total` is the unpaginated count. Booths and mini-events are small and unpaginated.
- Access: every 404 on these lists is treated as "not available for this event"; the client never retries with another Ring id to probe.
- Active Ring: event mode stores the Event Ring id locally; leaving event mode restores the previous active Ring.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 404 on `GET /views/ring/:ringId` (not a member, blocked, or none) | `E_RING_ACCESS_01` | "Not available", same copy for every cause |
| 404 on `GET /views/ring/:ringId` (Ring lapsed) | `E_RING_ACCESS_02` | "This event has ended", open the post-event flow |
| 404 on any event-scoped list | to be defined by [[T-036 Event mode exhibitors list and detail]] | "Not available for this event", exit event mode |
| pass unavailable | to be defined by [[T-037 Event pass with a 60 s rotating code]] | Last code with "may be expired", retry |
| 403 Pro gate | to be defined by [[T-049 Subscription endpoints and a single Pro gate]] | Lock with "Go Pro" → s70 |
| 402 / 409 on an upgrade purchase | to be defined by [[T-040 Lounges and upgrades]] | Keep the locked state, show the payment result |

## Blocked by

- No decision note. Upstream tasks:
- [[T-036 Event mode exhibitors list and detail]] — waits on [[T-033 Events list, detail, schedule]]; s54, s55, and unblocks T-038, T-039, T-052.
- [[T-037 Event pass with a 60 s rotating code]] — waits on [[T-007 Issue and rotate the QR token for a Ring]] and [[T-011 Create the Event Ring on registration]]; s56.
- [[T-039 Catalogue products and talks (new table)]] — needs a schema decision; s58.
- [[T-040 Lounges and upgrades]] — waits on [[T-034 Tickets, packages, levels, sold-out]] and [[T-049 Subscription endpoints and a single Pro gate]]; the lounge states on s53.
