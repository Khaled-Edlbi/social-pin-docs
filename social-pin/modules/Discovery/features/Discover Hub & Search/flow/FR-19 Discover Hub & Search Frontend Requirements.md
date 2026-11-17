---
id: FR-19
type: frontend-requirements
module: discovery
feature: discover-hub
status: approved
scope: feature
screens: [s38, s44]
approvedBy: "khaled"
approvedAt: 2026-11-16
blockedBy: []
depends: ["S-42 Discover Hub & Search Story"]
affects: ["BD-19 Discover Hub & Search Backend Delivery"]
related: ["S-42 Discover Hub & Search Story", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "BI-09 View As & Pin Views Backend Integration", "S-29 Companies Story", "S-89 Gemma AI Story", "S-87 Error Contract Story", "Frontend Contract", "GET /views/pin/:pinName"]
pending: []
created: 2026-10-18
updated: 2026-11-16
tags: [frontend-requirements, frontend-requirements/approved, module/discovery, layer/frontend]
---

# Discover Hub & Search · Frontend Requirements

> ⚠ Affected by [[D-41 Discover searches people by part of their Pin name]] (2026-11-17): /frontend: partial Pin-name search as you type from 3 letters, 20 a page with the next page loading at the bottom. The result row's states: opens the card, Connect, Requested, "Asked to connect" with Accept. The person outline, and the Pin name when there's no name. The submit-only rule goes. Wait for S-42's rewrite.

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Approved, 2026-11-16 (the backend's review) · **Story:** [[S-42 Discover Hub & Search Story]] (approved 2026-10-25, tidied 2026-11-16) · **Backend Integration:** [[BI-09 View As & Pin Views Backend Integration]] (the one call the MVP needs)

What the client needs from the backend to build [[S-42 Discover Hub & Search Story]], and whether each need is met today. **Rewritten 2026-11-16** against the story as of that day and [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]: the MVP is S1, S2 and S3, and it needs **one call that already exists**, `GET /views/pin/:pinName`. Recent searches stay on the phone; the tiles only navigate. Gemma, contact matching, search by name and a business Pin opening s55 are later.

## Per screen

### [[Screen Index#s38|s38]] The hub (S1)

- The field "Open a Pin by name · !pinname", then *PinCast* and *Import contacts* ("Coming soon", doesn't open, S5), **RECENT SEARCHES** (S3), and **BROWSE**.
- **The tiles only navigate** to other features and need nothing from this one: *People* → Contacts ("Requests · N" is Connections'), *Events* → the Events tab, *Companies* → s72, *Exhibitors* → s54, *PinCast* → s39. What each shows is the owning feature's requirements list.
- No backend need.

### [[Screen Index#s38|s38]] → [[Screen Index#s44|s44]] Open a Pin by its exact Pin name (S2)

- **Resolve:** `GET /views/pin/:pinName` ✅ ([[BI-09 View As & Pin Views Backend Integration|BI-09]]) → the `RingProfileViewEntity` of what that person shares with me. On success s44 opens with **that body**, not re-fetched.
- **Input:** strip a leading `!` or `@`, trim, lowercase before calling; an empty result sends nothing. **Submit only** (enter or the search action), never on a keystroke: no autocomplete, no partial match, no suggestions, so the API is never a prefix probe.
- A spinner under the field while it looks.
- **Not available:** a 404 `E_RING_ACCESS_01` (unknown, not shared, blocked) **and** a 400 (the name failed validation) read the same one line under the field, "This Pin isn't available to you". The field keeps the text; typing again clears the line.
- **Offline or no answer** (no connection, timeout, 5xx): said under the field; the name can be sent again. Nothing is added to recent searches.
- **My own Pin name:** compared on the phone with mine from `GET /profiles` ✅; opens View as on my default Ring ([[BI-09 View As & Pin Views Backend Integration|BI-09]]), no resolve call.
- **Demo people** only outside production builds, from the app's own samples; a production build never shows them and sends nothing for them.
- Later (D-37): a business Pin name opening s55 needs to know a name is a business's ([[S-29 Companies Story#Open questions|S-29 · Open questions]]); in the MVP every resolve lands on s44.

### [[Screen Index#s38|s38]] Recent searches (S3)

- **Kept on the phone, per user** (D-37): **no backend need**. Only a search that opened is added; newest first, one per normalised name, at most 20; each with the Pin name and the display name at the time.
- Tagged with the signed-in user's id, so another account on the phone reads none of it; cleared on sign-out; not synced across devices.
- A tap re-resolves (S2) every time: never a cached view, because access is answered per request. An entry whose lookup now fails stays, with the not-available line.
- Swipe to remove one; *Clear all*.

### Later (D-37): not asked for now

- **Ask Gemma** (S4): the field searches Pin names only, nothing goes to Gemma ([[S-89 Gemma AI Story]]).
- **Import contacts** (S5): no contacts permission is asked and nothing leaves the phone until the privacy review.
- **Search by name**: needs its own decision first.
- **A business Pin opening s55** (S2).

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Resolve an exact Pin name to what the person shares with me | `GET /views/pin/:pinName` | ✅ | S2 · D-37 |
| My own Pin name, to open View as instead | `GET /profiles` | ✅ | S2 |
| Recent searches | — (on the phone) | no backend need | S3 · D-37 |
| The tiles | — (other features) | no backend need | S1 |
| Gemma, contact matching, search by name, a business Pin to s55 | — | later | S2, S4, S5 · D-37 |

## Behaviour expectations

- **Refetch, no realtime:** nothing loads on tab open except the recent searches from the phone; a resolve only on submit or on a tap of a recent entry. No polling.
- **Caching keys:** a resolved view by (viewer, pin name) for the open s44 only; recent searches by (signed-in user), on the phone. Never cache a 404.
- **Input:** strip `!` and `@`, trim, lowercase; submit only.
- **Privacy:** one message for every way a resolve fails (404 and 400 alike); never time or retry a 404 to tell the cases apart; **never call the Pin-name availability endpoint** (`GET /profiles/pin-name/:pinName/availability`) from this screen; never infer which Ring a result came from.
- **Offline:** nothing queued; the line under the field, and the name can be sent again.

## Error states the UI must handle

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] puts `ErrorCode` on the wire everywhere, the app branches on status and endpoint ([[Frontend Contract]]).

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | "This Pin isn't available to you" under the field; keep the text; not added to recent searches |
| 400 | validation | the same line, never a different one |
| 401 | `E_AUTH_04` | sign in again |
| — | offline, timeout, 5xx | said under the field; the name can be sent again; not added to recent searches |

## Blocked by

Nothing for the MVP: the story is approved and its one call exists. The later rows wait on their own decisions (D-37): Gemma ([[S-89 Gemma AI Story]]), the contacts privacy review (S5), search by name, and whether a business has a Pin name ([[S-29 Companies Story#Open questions|S-29 · Open questions]]).

## Sign-off

- Approved by: khaled · on: 2026-11-16 (the backend's review, against `main @ 3cef5d7`)

## Log

- 2026-11-16 · `tickets/frontend/M-04-discovery/F-19-discover-hub/FR-19-s-42-2026-11-16` · rewritten to S-42 as of 2026-11-16 and D-37: the MVP needs only `GET /views/pin/:pinName` ✅; recent searches on the phone per user (no backend need); the tiles only navigate to other features; my own Pin name opens View as; demo people only outside production; the offline / no-answer state; Gemma, contact matching, name search and a business Pin to s55 later. Kept the input and privacy rules (strip `!` and `@`, trim, lowercase, submit only, one message for 404 and 400, no availability probe). Dropped the server recent-searches row, the tile rows and the S6 / S7 blocks. Cleared the S-42 (2026-11-12, 2026-11-16), D-37, S-29 and S-23 flags. Kept `draft`
- 2026-11-16 · `tickets/frontend/M-04-discovery/F-19-discover-hub/FR-19-ready` · every screen, endpoint row and error state is in: set `ready` (📨) on Omar Fostok's word, handed to the backend; flagged [[BD-19 Discover Hub & Search Backend Delivery]]
- 2026-11-16 · `tickets/backend/M-04-discovery/F-19-discover-hub/FR-19-accepted` · backend review against S-42 and backend `main` `3cef5d7`: the list holds, `ready` → `approved` on khaled's word. The MVP (S1–S3, D-37) needs nothing new: `GET /views/pin/:pinName` exists and answers the view with `pinName` and `displayName`, no Ring id and no user id; unknown, deleted, not shared and blocked all answer 404 `E_RING_ACCESS_01`; `GET /profiles` gives my own `pinName`. Two things on the wire for the app to know: the route has no name validation today, so the 400 row never fires (harmless: the app treats it as the 404), and `displayName` may be `null`. [[BD-19 Discover Hub & Search Backend Delivery]] → `in-progress`; flagged [[S-42 Discover Hub & Search Story]] (which Ring the resolve renders)
- 2026-11-16 · flagged [[S-42 Discover Hub & Search Story]]: for /pm: 'Rules the backend already enforces' says GET /views/pin/:pinName renders the default Ring if the viewer is in it, else the oldest Ring they can see; backend main 3cef5d7 renders the viewer's oldest live membership (D-15). The story's line to bring to that; nothing changes for FR-19 or the app
