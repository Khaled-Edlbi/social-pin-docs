---
type: frontend-requirements
code: discover-hub
scope: feature
feature: discover-hub
module: discovery
status: draft
screens: [s38]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/discovery, layer/frontend]
---

# Discover Hub & Search · Frontend Requirements

**Feature:** [[Discover Hub & Search]] · **Status:** Draft · **Story:** [[Discover Hub & Search Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build the screen in [[Discover Hub & Search Story]], and whether each need is met today. Exact-name resolve is done; recent searches, Gemma and contact import are not. The tiles hand over to other features and are listed here only for what the hub itself needs.

## Per screen

### [[Screen Index#s38|s38]] Discover hub

- Needs: resolve an exact `!pinname` to a view; the recent-searches list with add, remove one, clear; a Gemma prompt endpoint; a contacts-match call; nothing for the tiles themselves beyond navigation.
- Source today: `GET /views/pin/:pinName` for the resolve. Recent searches, Gemma, contacts: not yet.

### Handover to [[Screen Index#s44|s44]] Scanned Pin

- Needs: the resolved `RingProfileViewEntity`.
- Source today: the same call; pass the body to the screen rather than re-fetching.

### Handover to [[Screen Index#s55|s55]] Exhibitor (a business Pin name)

- Needs: whether a Pin name belongs to a business and the business id.
- Source today: not yet; every resolve lands on s44.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Resolve an exact Pin name to what the person shares with me | `GET /views/pin/:pinName` | ✅ | — |
| Recent searches: list, add on success, remove one, clear | — | ❌ | [[Discover Hub & Search Story|Discover Hub & Search · S6]] |
| Business Pin name resolving to a company / exhibitor screen | — | ❌ | [[Companies Story|Companies · S6]] |
| Gemma prompt from the same field | — | ❌ | [[T-051 Gemma assistant sheet and suggestions]] |
| Contacts match by hashed email / phone | — | ❌ | [[Discover Hub & Search Story|Discover Hub & Search · S7]] |
| People tile (requests and contacts) | — | ❌ | [[T-021 Connect request send, inbox, cancel]] |
| Events tile | — | ❌ | [[T-033 Events list, detail, schedule]] |
| Companies tile | — | ❌ | [[Companies Story|Companies · S6]] |
| Exhibitors tile | — | ❌ | [[T-036 Event mode exhibitors list and detail]] |
| PinCast tile | — | ❌ | [[PinCast & Nearby Story|PinCast & Nearby · S7]] |
| Avatar on recent-search rows and results | — | ❌ | [[Files Upload Story|Files Upload · showing files]] |

## Behaviour expectations

- Refetch / realtime: recent searches load on tab open and after each add, remove or clear; no polling. A tap on a recent entry always re-resolves; never show a cached view from a previous session, because access is resolved per request and may have changed.
- Caching keys: a resolved view by (viewer, pin name) for the current screen only; recent searches by (signed-in user). Do not cache 404s.
- Pagination / ordering: recent searches newest first, deduplicated by normalised name, at most 20 (client cap even if the server stores more); no pagination on the hub.
- Input: strip a leading `!`, trim, lowercase before calling; submit only on enter or the search action, never on keystroke, so the API is never used as a prefix probe.
- Privacy: one message for every resolve failure; do not time or retry a 404 to tell the cases apart; do not call the Pin-name availability endpoint from this screen.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | "This Pin isn't available to you" inline under the field; keep the text; do not add to recent searches |
| 400 | — | the name failed validation (empty, bad characters): inline, generic |
| 401 | `E_AUTH_04` | sign in again |
| — | recent-search and contacts codes | to be defined by Discover Hub & Search · S6 / Discover Hub & Search · S7; branch on `statusCode` until [[Error Contract Story|Error Contract · S4–S8]] |
| client | contacts permission denied | inline state on the tile with *Open settings* |

## Blocked by

- [[Discover Hub & Search Story|Discover Hub & Search · S7]] — the contacts row and the s03 handover (privacy review, needs a decision).
- [[Discover Hub & Search Story|Discover Hub & Search · S6]] — server-side versus device-only recent searches; the list rows above.
- [[T-051 Gemma assistant sheet and suggestions]] — the Gemma row.
- [[Error Contract Story|Error Contract · S4–S8]] — the error table is by status until then.
