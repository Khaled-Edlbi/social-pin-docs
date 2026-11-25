---
id: FD-18
type: frontend-delivery
module: discovery
feature: discover-hub
status: done
scope: feature
deployedTo: []
screens: [s38, s44, s46, s68]
owner: "Omar Fostok"
blockedBy: []
depends: ["BI-19 Discover Hub & Search Backend Integration", "BI-09 View As & Pin Views Backend Integration"]
affects: []
related: ["S-42 Discover Hub & Search Story", "FR-19 Discover Hub & Search Frontend Requirements", "BD-19 Discover Hub & Search Backend Delivery", "D-41 Discover searches people by part of their Pin name", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "B-30 Connect from a Discover search row is refused for a person you can't already open", "BI-16 Connections Backend Integration", "FD-17 View As & Pin Views Frontend Delivery", "FD-13 Connections Frontend Delivery", "S-01 Account Story", "S-23 Connections Story", "S-45 PinCast & Nearby Story", "GET /search/pin-names", "GET /views/pin/:pinName", "GET /users/me", "PATCH /users/me", "POST /connections/requests", "POST /connections/requests/:id/accept", E_SEARCH_01, E_SEARCH_02]
pending: []
created: 2026-11-15
updated: 2026-11-24
tags: [frontend-delivery, frontend-delivery/done, module/discovery, layer/frontend]
---

# ✅ Discover Hub & Search · Frontend Delivery

> ⚠ Affected by [[BI-19 Discover Hub & Search Backend Integration]] (2026-11-25): /frontend: Connect from a search row is accepted for every NONE row since backend main 198d76f (B-30), canOpenCard false included: 201 with the request. A 404 on Connect now means a stale row. Do not call GET /connections/relationship for a search row (404 for a stranger, also after the request); a stranger's Sent row has the Pin name only. BI-19 Flow 5, Errors, Checklist

> ⚠ Affected by [[QF-06 Discover Hub & Search QA Frontend]] (2026-11-23): /frontend: QF-06 ran DS-01 to DS-11 on social_pin db62e4d (fake backend), all passing. Two lines to correct here: (1) on that build the Requested button reads "Requested" (connect.requested) and Connect confirms with "Request sent." (connect.requestSent), as S-42 says; s38's note and Deviations say "Request sent" and "Request sent to {name}"; (2) the status line links the QA note as [[Discover Hub & Search QA Frontend]]; it is now QF-06 Discover Hub & Search QA Frontend

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Done · **Built from:** [[BI-19 Discover Hub & Search Backend Integration]] (current 2026-11-23, backend `main @ e83682d`) · **Against:** [[S-42 Discover Hub & Search Story]] (approved, [[D-41 Discover searches people by part of their Pin name|D-41]]) · **Requirements:** [[FR-19 Discover Hub & Search Frontend Requirements]] · **QA:** [[QF-06 Discover Hub & Search QA Frontend]]

What the client shipped for the Discover tab:
- the search by part of a Pin name, as you type, with its four kinds of row, Connect and Accept (S2);
- every state of the search (S4);
- recent searches kept on the phone (S3);
- the switch "Let people find me by Pin name" on Me › Privacy (S5).

It is on `social_pin` `rings/F-11/honest-rings` @ `db62e4d` (2026-11-23), on `main` since 2026-11-24 at `866240a`. Earlier work on the same branch:
- the hub and its demo came in `e03ddf9`;
- the exact-name lookup, recent searches and People → Contacts came in `778d9b4`;
- the as-you-type search replaces that lookup.

Tested with widget tests and Patrol against a fake backend. **Not yet tried against the development server.**

**Not working yet: Connect on a stranger's row.** On a row that can't open a card, the server refuses the request with 404. The app shows "This Pin isn't available to you" and keeps *Connect* on the row. That stays so until the backend fixes [[B-30 Connect from a Discover search row is refused for a person you can't already open|B-30]]. Once the server answers 201, the app needs no change.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s38\|s38]] Discover hub | ✅ | **The field:** "Search by Pin name". The search runs as you type, from 3 letters, 300 ms after the last key. The text is normalised first: a leading `!` or `@` removed, trimmed, lowercased. A new search replaces the one in flight, and an answer for older text is dropped. With nothing typed, the hub shows (S1): *PinCast* (demo data, [[S-45 PinCast & Nearby Story\|S-45]]), *Import contacts* ("Coming soon"), **RECENT SEARCHES** and **BROWSE** (People → Contacts with "Requests · N", Events, Companies → s72, Exhibitors → s54). The ✕ empties the field and brings the hub back. **Results** come 20 a page in the server's order. The next 20 load as the list nears its end, with shimmer rows at the bottom while they load, then "That's everyone for "{query}"". **The four rows:**<br>• **Connected:** *Connected*; a tap opens the card.<br>• **Not connected:** *Connect*.<br>• **Requested:** "Request sent", disabled.<br>• **Asked to connect:** *Accept*, which opens s46 for their `requestId`.<br>Each row shows the account name and photo (`accountName`, `avatarUrl`). With no name it shows the Pin name; with no photo, the outline. **Connect** sends the request by Pin name, turns the row to *Requested* in place with no new search, and "Request sent to {name}" confirms it. If they were already connected or had asked first, the list is read again and the row says so. **A tap opens a card only when `canOpenCard`:** the card is read first (`GET /views/pin/:pinName`) and s44 opens with that answer. If it no longer opens, "This Pin isn't available to you" shows under the field. A row that can't open does nothing when tapped. **States (S4):**<br>• one or two letters: "Type at least 3 letters of a Pin name", and nothing is sent;<br>• searching: shimmer rows;<br>• no matches: "No Pin names match "{query}"" with "Check the spelling, or ask them for their Pin name.";<br>• too many searches (429 `E_SEARCH_02`): "Too many searches. Try again in a minute." in place of the list, with no automatic retry;<br>• offline or no answer: "Couldn't search right now" with *Try again*;<br>• the next page failing: "Couldn't load more" with *Try again* under the list; the rows already shown stay.<br>**Recent searches** keep only people whose card opened: newest first, one per name, at most 20, with the name their card showed. A tap reads the card again. A swipe removes one, and *Clear all* empties the list (S3). **Demo people:** outside production builds, a sample person's Pin name submitted opens their sample card; production searches it like any other name |
| [[Screen Index#s44\|s44]] Person card | ✅ | Opened from a row or a recent search with the view just read, not read again |
| [[Screen Index#s46\|s46]] Accept into a Ring | ✅ | Opened by *Accept* on an *Asked to connect* row, for its `requestId` ([[S-23 Connections Story\|S-23]] S5) |
| [[Screen Index#s68\|s68]] Me › Privacy | ✅ | Under **PEOPLE**, the switch **"Let people find me by Pin name"** with "People who aren't connected with you see your name and photo in Discover, and can send a request. Off: only people in your Rings find you." It shows `findableByPinName` from the account (on when never set), read again when the screen opens. It moves at once and saves straight away; if the save fails it goes back and says "Couldn't save that. Try again." No "NEW" tag (S5) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /search/pin-names?q=&limit=20&skip=` | s38, as you type | From 3 letters (fewer is `E_SEARCH_01`, never sent), 300 ms after the last key. The call in flight is cancelled and a stale answer dropped. Next page by `skip` until `meta.total`. A 429 `E_SEARCH_02` is shown, never retried on its own. Nothing cached. |
| `GET /views/pin/:pinName` | s38, a row with `canOpenCard`, a recent search | s44 opens with this body. Every 404 `E_RING_ACCESS_01` (and a 400 or 422) gives the one message, never which case, and is never kept in recent searches. A recent search is read again on every tap. |
| `POST /connections/requests` `{ pinName }` | s38, *Connect* | The row turns *Requested* with the returned `requestId`. If already connected or they asked first, the search is read again. A 404 shows "This Pin isn't available to you" and the row keeps *Connect* ([[B-30 Connect from a Discover search row is refused for a person you can't already open\|B-30]]). |
| `POST /connections/requests/:id/accept` | s46, from *Accept* | Connections' accept flow ([[BI-16 Connections Backend Integration\|BI-16]]). |
| `GET /users/me` | s68 | `findableByPinName`; read again when Privacy opens. |
| `PATCH /users/me` `{ findableByPinName }` | s68, the switch | Optimistic: the switch moves first and goes back if the save fails. |
| `GET /profiles` (already loaded) | s38, my own Pin name from a recent search | No lookup: View as opens on my default Ring. |

The hub never calls `GET /profiles/pin-name/:pinName/availability`.

## State kept on the client

- **Recent searches** (Pin name, the name shown, when): newest first, at most 20, one per name. Kept in the phone's storage, tagged with the signed-in user's id, so another account on the phone reads none of them. Cleared on sign-out. Not synced: the API has no list.
- **In memory:**
  - the search (the text, the pages read, the state);
  - the rows being connected;
  - the card being read;
  - the switch's save in flight.

## Deviations from the story or the integration note

- **Import contacts** is a card on the hub that says "Coming soon" and opens nothing (S7, later).
- **Demo people** open their sample card in non-production builds, for demos. Production never does.
- **Copy:**
  - the Requested button reads "Request sent";
  - the confirmation names the person: "Request sent to {name}";
  - the end of the list says "That's everyone for "{query}"".

## Not done yet

- **Connect on a stranger's row** (a row with `canOpenCard` false) doesn't work until the backend fixes [[B-30 Connect from a Discover search row is refused for a person you can't already open|B-30]]. The app shows the 404 as "This Pin isn't available to you", and the row keeps *Connect*.
- **Not tried against the development server:** every check so far ran against a fake backend. `deployedTo` stays empty.
- **Later, per [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]:**
  - Gemma queries (S6);
  - matching imported contacts (S7);
  - a business Pin opening its company screen.
- **PinCast** on the hub runs on demo data: [[S-45 PinCast & Nearby Story|S-45]].

## Tests

At `db62e4d`, all passing:
- **13 widget tests** in `test/features/discover/discover_search_test.dart`. They cover:
  - the search: the hint under 3 letters, one call once typing pauses, the four rows;
  - opening: a connected row opens its card read once, a row that can't open does nothing, a row no longer shared shows the message;
  - Connect, sent and refused (404);
  - no matches, too many searches, offline with Try again;
  - the next page and the end of the list, and the ✕;
  - demo people in production and outside it;
  - my own Pin name, and recent searches;
  - People → Contacts.
- **11 Patrol tests** against a fake backend, DS-01 … DS-11, in `patrol_test/fake/f_discover_search_test.dart`. They cover the same journeys on a device, plus Accept → s46 (DS-07) and the Privacy switch saved at once and put back when the save fails (DS-11).

## BI-19 checklist

At `db62e4d`:

- [x] Input normalised (strip `!` / `@`, trim, lowercase); nothing sent under 3 letters; 300 ms debounce; in-flight call cancelled, stale answers dropped.
- [x] Rows in the server's order; `accountName` `null` → the Pin name; `avatarUrl` `null` → the outline.
- [x] The four rows by `relationship`; Connect sets `REQUESTED` in place; Accept through s46 with `requestId`.
- [x] A tap opens s44 only when `canOpenCard`; s44 opens with the resolve's body, not re-fetched.
- [x] Next page by `skip` until `meta.total`; a failing next page keeps the rows shown.
- [x] 429 `E_SEARCH_02` shown in place of the list, no automatic retry.
- [x] One line for every 404 on the resolve; the text stays in the field.
- [x] Recent searches on the phone, per user, keyed by Pin name; `displayName` `null` handled; a tap re-resolves.
- [x] Me › Privacy reads and saves `findableByPinName`; a failed save puts the switch back.
- [x] No call to the Pin-name availability route from this screen.

## Log

- 2026-11-15 · app branch `rings/F-11/honest-rings` @ `e03ddf9`, `778d9b4` (social_pin, on `main` since 2026-11-24 at `866240a`; analyze 0 errors, 1752 tests pass) · S1–S3 (D-37's MVP) · s38 (Pin name lookup before opening, "This Pin isn't available to you", recent searches on the phone per user, People → Contacts, Import contacts "Coming soon", demo people outside production) · written; `blockedBy: []` because the MVP calls only BI-09's `GET /views/pin/:pinName` · flagged nothing (S-42's 2026-11-12 update, `S-42-app-778d9b4`, already says this)
- 2026-11-16 · `docs/frontend/M-04-discovery/F-19-discover-hub/FD-18-built-from-bi-19` · built from [[BI-19 Discover Hub & Search Backend Integration]] (current 2026-11-16), which uses BI-09's `GET /views/pin/:pinName`; the app at `778d9b4` matches its checklist; the route answers no 400, so the 400 row is never hit; own Pin name compared with `GET /profiles`, `displayName` `null` and the 401 written in · flagged nothing (BI-19 already names FD-18 in `affects`)
- 2026-11-23 · `docs/frontend/M-04-discovery/F-19-discover-hub/FD-18-pin-name-search` · app branch `rings/F-11/honest-rings` @ `db62e4d` (social_pin, on `main` since 2026-11-24 at `866240a`) · S-42 S2, S4, S5 (D-41), built against [[BI-19 Discover Hub & Search Backend Integration|BI-19]] (current, backend `main @ e83682d`) · s38: the search by part of a Pin name, the four rows, Connect in place, every state; s46: Accept; s68: "Let people find me by Pin name". 13 widget tests and 11 Patrol tests (DS-01 … DS-11, fake backend) pass. Not yet tried against the development server. Connect on a stranger's row is refused until [[B-30 Connect from a Discover search row is refused for a person you can't already open|B-30]] is fixed. BI-19's checklist ticked. Cleared the D-41 and BD-19 flags · flagged nothing
