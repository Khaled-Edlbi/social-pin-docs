---
type: frontend-requirements
code: events-during
scope: feature
feature: events-during
module: events
status: draft
screens: [s53, s54, s55, s56, s57, s58]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/events, layer/frontend]
---

# Events During · Frontend Requirements

**Feature:** [[Events During]] · **Status:** Draft · **Story:** [[Events During Story]] · **API Integration:** not yet (backend not built)

What the client needs for the in-event hub and its six screens, and whether each need is met today. Only the Ring view that renders an exhibitor's perspective exists; every event-scoped list is missing.

## Per screen

### [[Screen Index#s53|s53]] Event mode

- Needs: the active Event Ring (id, name, window, level from my participant row), my package and its entitlements, mini-events with their access state (owned / purchasable / locked), account type for the Pro locks, today's meetings count.
- Source today: `GET /rings/:id` for the Ring (available); the rest not yet ([[Events During Story|Events During · S12]], [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]], [[Meetings Story|Meetings · S11]]).

### [[Screen Index#s54|s54]] Exhibitors

- Needs: paginated exhibitors of the event with name, logo, booth code, tags, saved flag; search.
- Source today: not yet ([[Events During Story|Events During · S8]]).

### [[Screen Index#s55|s55]] Exhibitor

- Needs: the exhibitor's business Ring view (about, links, gallery, video, documents), team on the stand, products, availability entry for "Request a meeting".
- Source today: `GET /views/ring/:ringId` renders a Ring view, but only for a viewer who is already a live member of that business Ring; the event-scoped card that any attendee may open is Events During · S8.

### [[Screen Index#s56|s56]] Event pass

- Needs: a code for the Event Ring with `expiresAt` of the current window, the level label.
- Source today: not yet ([[Events During Story|Events During · S9]]).

### [[Screen Index#s57|s57]] Floor map

- Needs: map asset, booths with position, code and exhibitor id.
- Source today: not yet ([[Events During Story|Events During · S10]]).

### [[Screen Index#s58|s58]] Catalogue

- Needs: products (exhibitor, name, image) and talks (mini-event, time, room, access state).
- Source today: not yet; no table ([[Events During Story|Events During · S11]]).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Active Event Ring detail | `GET /rings/:id` | ✅ | — |
| Exhibitors list and detail, scoped by Event Ring | — | ❌ | [[Events During Story|Events During · S8]] |
| Exhibitor's Ring view when I am a member of it | `GET /views/ring/:ringId` | ✅ | — |
| Event pass code, 60 s window | — | ❌ | [[Events During Story|Events During · S9]] |
| Floor map asset and booths | — | ❌ | [[Events During Story|Events During · S10]] |
| Catalogue of products and talks | — | ❌ | [[Events During Story|Events During · S11]] |
| Mini-event access state, upgrade purchase | — | ❌ | [[Events During Story|Events During · S12]] |
| Pro lock state | — | ❌ | [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]] |
| Smart Match suggestions | — | ❌ | [[Gemma AI Story|Gemma AI · S8]] |
| Meetings today | — | ❌ | [[Meetings Story|Meetings · S11]] |

## Behaviour expectations

- Refetch / realtime: the pass code is refetched when its `expiresAt` is 5 s away; the countdown is driven by the server's `expiresAt`, not by a local 60 s timer, so clock drift does not show a dead code. Exhibitor and map data refetch on focus; mini-event states refetch after any purchase and on focus.
- Caching keys: `event:{id}:exhibitors:{query}`, `exhibitor:{id}`, `event:{id}:booths`, `event:{id}:catalogue`, `event:{id}:miniEvents`, `pass:{ringId}` (never persisted to disk). All keys are dropped at the Event Ring's `expiresAt`.
- Pagination / ordering: exhibitors paginated (`limit` 20 default, `TABLE_MAX_LIMIT = 50`), saved first then by name; `meta.total` is the unpaginated count. Booths and mini-events are small and unpaginated.
- Access: every 404 on these lists is treated as "not available for this event"; the client never retries with another Ring id to probe.
- Active Ring: event mode stores the Event Ring id locally; leaving event mode restores the previous active Ring.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[Error Contract Story|Error Contract · S4–S8]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 404 on `GET /views/ring/:ringId` (not a member, blocked, or none) | `E_RING_ACCESS_01` | "Not available", same copy for every cause |
| 404 on `GET /views/ring/:ringId` (Ring lapsed) | `E_RING_ACCESS_02` | "This event has ended", open the post-event flow |
| 404 on any event-scoped list | to be defined by [[Events During Story|Events During · S8]] | "Not available for this event", exit event mode |
| pass unavailable | to be defined by [[Events During Story|Events During · S9]] | Last code with "may be expired", retry |
| 403 Pro gate | to be defined by [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]] | Lock with "Go Pro" → s70 |
| 402 / 409 on an upgrade purchase | to be defined by [[Events During Story|Events During · S12]] | Keep the locked state, show the payment result |

## Blocked by

- No decision note. Upstream tasks:
- [[Events During Story|Events During · S8]] — waits on [[Events Before Story|Events Before · S7]]; s54, s55, and unblocks Events During · S10, Events During · S11, Gemma AI · S8.
- [[Events During Story|Events During · S9]] — waits on [[Badge & QR Story|Badge & QR · S7–S12]] and [[Event Ring Auto-creation Story|Event Ring Auto-creation · S6]]; s56.
- [[Events During Story|Events During · S11]] — needs a schema decision; s58.
- [[Events During Story|Events During · S12]] — waits on [[Events Before Story|Events Before · S8]] and [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]]; the lounge states on s53.
