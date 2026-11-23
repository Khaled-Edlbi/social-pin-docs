---
id: FR-19
type: frontend-requirements
module: discovery
feature: discover-hub
status: approved
scope: feature
screens: [s38, s44, s46, s68]
approvedBy: "khaled"
approvedAt: 2026-11-23
blockedBy: []
depends: ["S-42 Discover Hub & Search Story", "D-41 Discover searches people by part of their Pin name"]
affects: ["BD-19 Discover Hub & Search Backend Delivery"]
related: ["S-42 Discover Hub & Search Story", "D-41 Discover searches people by part of their Pin name", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "D-10 Connect sends what the requester already has", "BI-09 View As & Pin Views Backend Integration", "BI-16 Connections Backend Integration", "FR-14 Connections Frontend Requirements", "S-23 Connections Story", "S-01 Account Story", "S-29 Companies Story", "S-89 Gemma AI Story", "S-87 Error Contract Story", "Frontend Contract", "GET /views/pin/:pinName"]
pending: []
created: 2026-10-18
updated: 2026-11-23
tags: [frontend-requirements, frontend-requirements/approved, module/discovery, layer/frontend]
---

# 📨 Discover Hub & Search · Frontend Requirements

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Approved by the backend 2026-11-23 · **Story:** [[S-42 Discover Hub & Search Story]] (approved 2026-11-17 by Omar Fostok) · **Backend Integration:** [[BI-19 Discover Hub & Search Backend Integration]] (the exact-name lookup only) · **Design:** [Discover search, 8 screens](https://claude.ai/artifact/VtuKA2ezgz1snhMbBUmSbd)

What the client needs from the backend to build [[S-42 Discover Hub & Search Story]], and whether each need is met today. **Rewritten 2026-11-17** against the story as of that day and [[D-41 Discover searches people by part of their Pin name|D-41]]: the MVP is S1–S5. **Two routes don't exist yet:** the search by part of a Pin name, and reading and saving "Let people find me by Pin name". Opening a card, Connect and Accept reuse calls that exist. Recent searches stay on the phone. Gemma (S6), Import contacts (S7) and a business Pin opening s55 are later.

## Per screen

### [[Screen Index#s38|s38]] The hub (S1, S3)

- The field **"Search by Pin name"**, then *PinCast* and *Import contacts* ("Coming soon", doesn't open, S7), **RECENT SEARCHES**, and **BROWSE**.
- **The tiles only navigate** and need nothing from this feature: *People* → Contacts ("Requests · N" is Connections'), *Events* → the Events tab, *Companies* → s72, *Exhibitors* → s54, *PinCast* → s39.
- **Recent searches** (S3), **kept on the phone, per user**, with no backend need:
  - Only people whose card opened are added: newest first, one per Pin name, at most 20, each with the Pin name and the display name at the time. Never typed text, never someone only seen in results.
  - Tagged with the signed-in user's id; cleared on sign-out; not synced.
  - A tap opens the card again with `GET /views/pin/:pinName` ✅, read afresh every time. A 404 keeps the entry, with "This Pin isn't available to you".
  - Swipe to remove one; *Clear all*. Hidden while results are shown.

### [[Screen Index#s38|s38]] Results (S2, S4)

- **Input:** strip a leading `!` or `@`, trim, lowercase. Under 3 letters, nothing is sent and the hint says to type at least 3 letters.
- **As you type:** the search runs **300 ms after the last keystroke** (debounced). A new query cancels the one in flight, and an answer for an older query is dropped, so the list always matches the text in the field.
- **The search** (proposed, not built): `GET /search/pin-names?q=&limit=20&skip=` → `{ data: [...], meta: { total } }`. **Next page** when the list nears the bottom: the same `q` with `skip` moved by 20, until `meta.total` is reached.
- **Matching and order are the server's** (S-42 Q1, Q2): the letters match anywhere in the Pin name. An exact Pin name match comes first, then people who have me in one of their Rings, then everyone else. The app shows the rows in the order they come and never re-sorts them.
- **A full Pin name typed** is just a search: its row is listed first and **no card opens by itself** (Q2).
- **Each result:**

  | Field | Use |
  |---|---|
  | `pinName` | shown under the name, and the address for Connect and for opening the card |
  | `accountName` | the name from sign-up, never a Ring's; `null` → show the Pin name as the name |
  | `avatarUrl` | the photo from sign-up, a signed link; `null` → a person outline |
  | `relationship` | where I stand: `CONNECTED`, `REQUESTED`, `ASKED_ME` or `NONE` |
  | `requestId` | for `REQUESTED` and `ASKED_ME`: the request to accept |
  | `canOpenCard` | `true` only when they have me in one of their Rings |

  The result never carries a user id, a Ring id or anything shared in a Ring.
- **Every row shows the sign-up name and photo** (`accountName`, `avatarUrl`), the Connected row included, never a Ring's: a Ring's name or photo in the list would say which Ring I'm in (S-42 Q5). The card (s44) shows the Ring's.
- **The four kinds of row:**
  - **Connected** (`canOpenCard: true`): the sign-up name and photo, like every row; a tap opens their card (s44), with the Ring's name and photo, read with `GET /views/pin/:pinName` ✅ ([[BI-09 View As & Pin Views Backend Integration|BI-09]]); the person goes into recent searches.
  - **Not connected** (`NONE`): name, photo, Pin name and **Connect**. A tap on the row does nothing; only Connect works (Q2).
  - **Requested:** the button reads **Requested** and does nothing.
  - **Asked to connect** (`ASKED_ME`): "Asked to connect" with **Accept**. Accept opens Accept into a Ring ([[Screen Index#s46|s46]]) for that `requestId`, as on [[S-23 Connections Story|Connections · S5]]. Once accepted, the row becomes Connected.
- **Connect:** `POST /connections/requests` `{ pinName }` ✅ ([[BI-16 Connections Backend Integration|BI-16]]; [[D-10 Connect sends what the requester already has|D-10]]: what I have is the Pin name). On success the row reads Requested and "Request sent." shows. The button is disabled while it sends. Not available yet on a stranger's row (`canOpenCard: false`): the server answers 404 `E_RING_ACCESS_01` until [[B-30 Connect from a Discover search row is refused for a person you can't already open|B-30]] is fixed; the app shows "This Pin isn't available to you" and the row keeps Connect.
- **Never in the list:** blocked people (either side), myself, and anyone with the switch off who doesn't have me in a Ring. The **server** filters all three; the app filters nothing and never hides rows on its own.
- **Demo people:** outside production builds only, from the app's own samples. A production build never shows them and sends nothing for them.

### [[Screen Index#s38|s38]] The states (S4)

| State | Shown |
|---|---|
| Fewer than 3 letters | the hint, no call |
| Searching (first page) | shimmer rows in place of the list |
| No matches (`data: []`, `total: 0`) | "No Pin names match "{q}"" |
| No connection (offline, timeout, 5xx) on the first page | said in place of the list, with **Try again**, which sends the same query |
| The next page loading | shimmer rows under the results (S-42 Q7) |
| The next page failing | a row under the results with Try again; the rows already shown stay |
| Connect sent | "Request sent."; the row reads Requested |
| Connect failing | the row keeps Connect, and a line says it didn't go |
| Too many searches (429) | "Too many searches, try again in a minute" in place of the list; typing again searches as usual |

### Me › Privacy · "Let people find me by Pin name" ([[Screen Index#s68|s68]], S5)

- A switch under **PEOPLE** on the Privacy screen ([[S-01 Account Story|Account · S1]]), with the line saying what a stranger sees: only my account name and photo from sign-up, and Connect. No "NEW" tag on it (S-42 Q6).
- **Read** (proposed, not built): `findableByPinName` on `GET /users/me`, `true` when never set.
- **Save** (proposed, not built): `PATCH /users/me` `{ findableByPinName }`, saved at once when the switch moves. Off takes effect on the server at once: I leave the next search anyone makes (Q3, [[S-01 Account Story|Account · S7]]). The switch shows the new value straight away; if the save fails, it goes back and a line says so.

### Later (D-37): not asked for now

- **Ask Gemma** (S6): the field searches Pin names only, nothing goes to Gemma ([[S-89 Gemma AI Story]]).
- **Import contacts** (S7): no contacts permission is asked and nothing leaves the phone until the privacy review.
- **A business Pin opening s55** ([[S-29 Companies Story#Open questions|S-29 · Open questions]]): every card opens on s44.

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Search by part of a Pin name, 3+ letters, paged 20; letters anywhere; an exact match first, then people who have me in a Ring | `GET /search/pin-names?q=&limit=&skip=` | ✅ `GET /search/pin-names` on backend `main` since 2026-11-23 ([[BI-19 Discover Hub & Search Backend Integration\|BI-19]]) | S2, S4 · D-41, Q1, Q2 |
| A per-person limit on searches (about 30 a minute, the number the backend's) | the same, 429 `E_SEARCH_02` (30 a minute) | ✅ | S4 · Q4 |
| Each result: `pinName`, `accountName`, `avatarUrl`, `relationship`, `requestId`, `canOpenCard`; never blocked people, myself, or the switched-off who don't have me in a Ring | the same | ✅ | S2, S5 · D-41 |
| Read "Let people find me by Pin name" | `findableByPinName` on `GET /users/me` | ✅ `GET /users/me` | S5 · D-41 |
| Save it | `PATCH /users/me` `{ findableByPinName }` | ✅ `PATCH /users/me` | S5 · D-41 |
| Open a connected person's card, or a recent search | `GET /views/pin/:pinName` | ✅ | S2, S3 |
| Connect | `POST /connections/requests` `{ pinName }` | ✅ ([[BI-16 Connections Backend Integration\|BI-16]]) | S2 · S-23 S2 |
| Accept | `POST /connections/requests/:id/accept` `{ ringId }`, through s46 | ✅ ([[BI-16 Connections Backend Integration\|BI-16]]) | S2 · S-23 S5 |
| Recent searches | — (on the phone) | no backend need | S3 · D-37 |
| The tiles | — (other features) | no backend need | S1 |
| Gemma, contact matching, a business Pin to s55 | — | later | S6, S7 · D-37 |

## Behaviour expectations

- **Refetch, no realtime:** nothing loads on tab open except recent searches from the phone. The search runs on the debounced text; the card on a tap. No polling.
- **Caching keys:** search pages by (viewer, `q`) for the list on screen only, dropped when the text changes. An opened view by (viewer, Pin name) for the open s44 only. Recent searches by signed-in user, on the phone. Never cache a 404. After Connect or Accept, the row is updated in place, not refetched.
- **Debounce and order:** 300 ms; a new query cancels the old one; a stale answer is dropped.
- **Privacy:** the app shows only what each result carries and never asks for more. It never opens the card of a row with `canOpenCard: false`. It never calls the Pin-name availability route (`GET /profiles/pin-name/:pinName/availability`). It never says which Ring a card came from.
- **Offline:** nothing queued; the states above, with Try again.

## Error states the UI must handle

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] puts `ErrorCode` on the wire everywhere, the app branches on status and endpoint ([[Frontend Contract]]).

| Endpoint | Status | ErrorCode | Show |
|---|---|---|---|
| search | 400 | `E_SEARCH_01`: fewer than 3 letters | never reached: the app sends 3 or more; treated like no matches |
| search | 429 | `E_SEARCH_02`: over the per-person limit (30 a minute) | "Too many searches, try again in a minute" in place of the list; no automatic retry |
| search | — | offline, timeout, 5xx | the no-connection state, with Try again |
| `GET /views/pin/:pinName` | 404 | `E_RING_ACCESS_01` | "This Pin isn't available to you" (a recent entry stays; a result row may have changed since the search) |
| `POST /connections/requests` | 4xx | `E_CONNECTION_REQUEST_*` ([[BI-16 Connections Backend Integration\|BI-16]]) | as on Connections: already requested → Requested; already connected → refresh the row; otherwise the row keeps Connect with the line |
| `PATCH /users/me` | 4xx, 5xx | — | the switch goes back, with a line |
| any | 401 | `E_AUTH_04` | sign in again |

## Blocked by

- Nothing from the story: [[S-42 Discover Hub & Search Story]] was approved 2026-11-17.
- Nothing from the backend: approved 2026-11-23, and every endpoint row is ✅ on backend `main` the same day ([[BD-19 Discover Hub & Search Backend Delivery]]).
- **The account name and photo question is answered**: yes, apart from the Ring profiles. The default profile holds the sign-up name (`fullName`) and the main photo (`avatarFileId`, handed out as a signed `avatarUrl`, D-16), the same for every searcher. `accountName` and `avatarUrl` read those.

## Sign-off

- Approved by: khaled · on: 2026-11-23

## Log

- 2026-11-16 · `tickets/frontend/M-04-discovery/F-19-discover-hub/FR-19-s-42-2026-11-16` · rewritten to S-42 as of 2026-11-16 and D-37: the MVP needs only `GET /views/pin/:pinName` ✅; recent searches on the phone per user (no backend need); the tiles only navigate to other features; my own Pin name opens View as; demo people only outside production; the offline / no-answer state; Gemma, contact matching, name search and a business Pin to s55 later. Kept the input and privacy rules (strip `!` and `@`, trim, lowercase, submit only, one message for 404 and 400, no availability probe). Dropped the server recent-searches row, the tile rows and the S6 / S7 blocks. Cleared the S-42 (2026-11-12, 2026-11-16), D-37, S-29 and S-23 flags. Kept `draft`
- 2026-11-16 · `tickets/frontend/M-04-discovery/F-19-discover-hub/FR-19-ready` · every screen, endpoint row and error state is in: set `ready` (📨) on Omar Fostok's word, handed to the backend; flagged [[BD-19 Discover Hub & Search Backend Delivery]]
- 2026-11-16 · `tickets/backend/M-04-discovery/F-19-discover-hub/FR-19-accepted` · backend review against S-42 and backend `main` `3cef5d7`: the list holds, `ready` → `approved` on khaled's word. The MVP (S1–S3, D-37) needs nothing new: `GET /views/pin/:pinName` exists and answers the view with `pinName` and `displayName`, no Ring id and no user id; unknown, deleted, not shared and blocked all answer 404 `E_RING_ACCESS_01`; `GET /profiles` gives my own `pinName`. Two things on the wire for the app to know: the route has no name validation today, so the 400 row never fires (harmless: the app treats it as the 404), and `displayName` may be `null`. [[BD-19 Discover Hub & Search Backend Delivery]] → `in-progress`; flagged [[S-42 Discover Hub & Search Story]] (which Ring the resolve renders)
- 2026-11-16 · flagged [[S-42 Discover Hub & Search Story]]: for /pm: 'Rules the backend already enforces' says GET /views/pin/:pinName renders the default Ring if the viewer is in it, else the oldest Ring they can see; backend main 3cef5d7 renders the viewer's oldest live membership (D-15). The story's line to bring to that; nothing changes for FR-19 or the app
- 2026-11-17 · `tickets/frontend/M-04-discovery/F-19-discover-hub/FR-19-pin-name-search` · rewritten to S-42 as of 2026-11-17 and D-41, set back to **draft** from approved, since it changes what the backend approved:
  - The hub, results, states and the Privacy switch per screen.
  - Proposed: `GET /search/pin-names?q=&limit=20&skip=`, each result with `pinName`, `accountName`, `avatarUrl`, `relationship` (`CONNECTED`, `REQUESTED`, `ASKED_ME`, `NONE`), `requestId` and `canOpenCard`; blocked people, myself and the switched-off who don't have me in a Ring are filtered on the server.
  - Proposed: `findableByPinName` on `GET` and `PATCH /users/me`.
  - Reused: Connect with `POST /connections/requests` `{ pinName }` and Accept through s46, from BI-16; a connected card opens with `GET /views/pin/:pinName`.
  - A 300 ms debounce, cancelling and dropping stale answers.
  - Proposed codes `E_SEARCH_01` and `E_SEARCH_02`.
  - Dropped: submit only, "my own Pin name opens View as", and the 400 row for names.
  - Cleared the S-42 and D-41 flags.
- 2026-11-17 · `tickets/frontend/M-04-discovery/F-19-discover-hub/FR-19-s-42-answers` · S-42's Q1–Q4 applied (decided by Omar Fostok 2026-11-17):
  - Q1 and Q2: the letters match anywhere; an exact match first, then people who have me in a Ring, in the server's order, never re-sorted. A full Pin name opens nothing by itself, and a tap on a not-connected row does nothing.
  - Q3: switched off applies at once.
  - Q4: a per-person limit as an endpoint row; the 429 reads "Too many searches, try again in a minute", with no automatic retry, and is a row in the states.

  *Blocked by* is down to the backend's account name and photo question. Cleared the S-42 flag. Kept `draft`
- 2026-11-17 · `tickets/frontend/M-04-discovery/F-19-discover-hub/FR-19-ready` · S-42 approved the same day; every screen, endpoint row and error state is in: set `ready` (📨) on Omar Fostok's word, handed to the backend. `blockedBy` cleared. Flagged [[BD-19 Discover Hub & Search Backend Delivery]]
- 2026-11-23 · `tickets/backend/M-04-discovery/F-19-discover-hub/FR-19-accepted` · backend review against [[S-42 Discover Hub & Search Story]] (approved 2026-11-17, D-41, Q1–Q4) and backend `main` `3cef5d7`: the list holds, `ready` → `approved` on khaled's word. Every S1–S5 criterion and the six items of *What the backend has to build* have a row; S6, S7 and the s55 path are later as the story says. The reused routes are on `main`: `GET /views/pin/:pinName`, `GET /profiles`, `POST /connections/requests` `{ pinName }`, `POST /connections/requests/:id/accept`. The open question answered in *Blocked by*: the sign-up name and photo exist on the default profile. The four new rows were built the same day on backend branch `BD-19/search/pin-name-search` (`c5bc838`, 1098 unit tests green) and read 🔵 until merged; [[BI-19 Discover Hub & Search Backend Integration]] says how to call them. Two wordings settled for the backend: every result row, the Connected one included, carries the sign-up name and photo, never a Ring's (S-42 S2's Connected row says "their card's name and photo", flagged for /pm); and `ASKED_ME` here is what `GET /connections/relationship` calls `THEY_ASKED`
- 2026-11-23 · `docs/backend/M-04-discovery/F-19-discover-hub/BD-19-merged` · the backend's branch merged to `main`: the four rows flipped 🔵 → ✅ with their endpoints, *Blocked by* cleared. Still `approved`: ✅ Delivered is the build's once BD-19 and BI-19 are done with nothing pending
- 2026-11-23 · `tickets/frontend/M-04-discovery/F-19-discover-hub/FR-19-s42-q5-q7` · S-42's Q5–Q7 applied (decided by Omar Fostok 2026-11-23):
  - Q5: every result row, the Connected one included, shows the sign-up name and photo, never a Ring's; the card (s44) shows the Ring's (*Results*);
  - Q6: no "NEW" tag on the find-me switch (*Me › Privacy*);
  - Q7: the next page loads with shimmer rows (*The states*).

  Connect on a stranger's row is noted as not available yet ([[B-30 Connect from a Discover search row is refused for a person you can't already open|B-30]]). Cleared the S-42 flag. It records decisions already made, so the list stays `approved`; no endpoint row changed
