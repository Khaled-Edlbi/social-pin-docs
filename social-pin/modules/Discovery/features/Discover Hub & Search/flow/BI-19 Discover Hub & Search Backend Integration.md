---
id: BI-19
type: backend-integration
module: discovery
feature: discover-hub
status: current
scope: feature
screens: [s38, s44, s68]
depends: ["BD-19 Discover Hub & Search Backend Delivery", "BI-09 View As & Pin Views Backend Integration", "BI-16 Connections Backend Integration"]
affects: ["FD-18 Discover Hub & Search Frontend Delivery"]
related: ["FR-19 Discover Hub & Search Frontend Requirements", "S-42 Discover Hub & Search Story", "D-41 Discover searches people by part of their Pin name", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "D-15 Several Rings per connection, remove or disconnect", "D-16 Files load from signed links that expire in 15 minutes", "BI-04 Profiles & Pin Name Backend Integration", "BI-01 Account Backend Integration", "GET /search/pin-names", "GET /users/me", "PATCH /users/me", "GET /views/pin/:pinName", "GET /profiles", "POST /connections/requests", "POST /connections/requests/:id/accept", "E_SEARCH_01", "E_SEARCH_02"]
pending: []
created: 2026-11-16
updated: 2026-11-25
tags: [backend-integration, backend-integration/current, module/discovery, layer/backend]
---

# 🔌 Discover Hub & Search · Backend Integration

**Feature:** [[F-19 Discover Hub & Search]] · **Backend:** [[BD-19 Discover Hub & Search Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]], [[BI-09 View As & Pin Views Backend Integration]], [[BI-16 Connections Backend Integration]]

Written by the **backend** team for the frontend: how to call what Discover needs. Matches backend `main @ 198d76f` (2026-11-25), after the merge of `BD-19/search/pin-name-search` (`c5bc838`) and the fixes that followed it: opening a person by their exact Pin name (View As & Pin Views' `GET /views/pin/:pinName`), Connect and Accept (Connections' routes), the search by part of a Pin name (`GET /search/pin-names`) and the switch "Let people find me by Pin name" (`findableByPinName` on `/users/me`). The search needs the migration deployed on the environment the app points at (BD-19, *Gaps*). Checked by [[QB-18 Discover Hub & Search QA Backend]] on `main @ e83682d` (2026-11-23). **Connect works on every `NONE` row since `main @ 198d76f`** ([[B-30 Connect from a Discover search row is refused for a person you can't already open|B-30]]), a row that cannot open included; QA's re-test of it is pending, and an older build answers 404 there.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s38\|s38]] The hub | opens the tab | nothing: the tiles navigate to other features, recent searches are read from the phone |
| s38 Results | types 3+ letters (300 ms after the last keystroke) | `GET /search/pin-names?q=<text>&limit=20` |
| s38 Results | reaches the bottom of the list | the same `q`, `skip` moved by 20, until `meta.total` |
| s38 → [[Screen Index#s44\|s44]] | taps a row with `canOpenCard: true` | `GET /views/pin/:pinName` ([[BI-09 View As & Pin Views Backend Integration\|BI-09]]) |
| s38 Results | taps **Connect** on a `NONE` row | `POST /connections/requests` `{ pinName }` ([[BI-16 Connections Backend Integration\|BI-16]]) with the row's `pinName`: 201 with the request, whatever `canOpenCard` says |
| s38 → [[Screen Index#s46\|s46]] | taps **Accept** on an `ASKED_ME` row | `POST /connections/requests/:id/accept` `{ ringId }` with the row's `requestId` (BI-16) |
| s38 Recent searches | taps an entry | `GET /views/pin/:pinName` again, every time |
| [[Screen Index#s68\|s68]] Me › Privacy | opens the screen | `findableByPinName` on `GET /users/me` ([[BI-01 Account Backend Integration\|BI-01]]) |
| s68 | moves the switch | `PATCH /users/me` `{ "findableByPinName": false }` (or `true`) |

## Flow

1. **Normalise on the phone, then search.** Strip a leading `!` or `@`, trim, lowercase; under 3 letters send nothing (the hint). The server does the same normalisation, so sending the raw text also works. `GET /search/pin-names?q=&limit=20&skip=` → 200 `{ data: PinNameResultEntity[], meta: { total } }`. Debounce 300 ms; cancel the call in flight when the text changes and drop an answer for an older query.
2. **The order is the server's** (S-42 Q1, Q2): the exact Pin name first, then people who have you in one of their Rings, then everyone else, A→Z by Pin name within each. Show the rows as they come; never re-sort. A full Pin name typed is just a search: its row is first and no card opens by itself.
3. **Next page.** The same `q` with `skip` += 20 until `data.length` reaches `meta.total` (the unpaginated count). A page can straddle the server's groups; nothing to do about that on the client.
4. **Which rows open.** `canOpenCard` alone decides: true only when they have you in one of their Rings, computed per request against now. A tap then opens `GET /views/pin/:pinName` with the row's `pinName` and lands on s44 with that body (BI-09). A row with `canOpenCard: false` never opens, whatever `relationship` says.
5. **The button** is `relationship`: `NONE` → Connect; `REQUESTED` → Requested, disabled; `ASKED_ME` → Accept, which opens s46 for `requestId` (BI-16, Accept into a Ring); `CONNECTED` → no button (a tap opens the card when `canOpenCard`). Connect sends `POST /connections/requests` `{ pinName }` with the row's `pinName` and is accepted for every row the search returned, a stranger's (`canOpenCard` false) included: 201 with the request (200 when your request to them was already pending). After Connect succeeds, set the row to `REQUESTED` in place with the answer's `id` as `requestId`; after Accept, to `CONNECTED` with `canOpenCard: true` (they put you in a Ring by accepting). No refetch. A row can be stale: if the person hid themselves or a block was made since the search, Connect answers the 404 `E_RING_ACCESS_01` (*Errors to handle*). **Never ask `GET /connections/relationship?pinName=` for a search row's state**: that route needs a card that opens, so for a stranger it answers 404 before and after the request is sent; the row's `relationship` and the Sent list are the state. In the Sent list (`GET /connections/requests?direction=outgoing`, BI-16) a stranger's `to` carries the Pin name only, `displayName` and `avatarUrl` `null`: less than the search row showed, so do not expect the name and photo there.
6. **Which Ring the card shows.** The perspective of the person's Ring you were put in first, your oldest live membership in their Rings ([[D-15 Several Rings per connection, remove or disconnect|D-15]]; BI-09, *Flow* 1). The view never says which.
7. **Not available.** On the resolve, unknown name, deleted account, nothing shared and a block all answer the same 404 `E_RING_ACCESS_01`, with the same body. A result row may have changed since the search (they removed you from the Ring, blocked you): show "This Pin isn't available to you" and leave the row. A deleted account answers that 404 too since backend `main @ e83682d` ([[B-28 A deleted account's card still opens for a member of its Ring|B-28]]); on an older build someone who was in one of its Rings still got 200 and the card.
8. **The switch** (S5). Read `findableByPinName` from `GET /users/me` (true when never set); `PATCH /users/me` with the one field the moment it moves; the answer is the whole account. Off applies to the next search anyone makes: the server reads the column on every search and caches nothing.
9. **Recent searches.** No route: they stay on the phone, per signed-in user (S-42 S3). The backend stores nothing about what was looked up.

## Shapes that matter

**`PinNameResultEntity`**, one per row of `GET /search/pin-names`:

| Field | Type | Meaning |
|---|---|---|
| `pinName` | string | shown as `!SaraAz`; the address for Connect and for opening the card |
| `accountName` | string \| null | the name from sign-up (the default profile's full name), never a Ring's; `null` → show the Pin name as the name |
| `avatarUrl` | string \| null | signed link to the sign-up photo, a path (`/api/v1/files/content/<token>`) to put the API origin in front of; loads with no `Authorization` header; valid 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes|D-16]]); `null` → a person outline. Search again rather than reuse a link past its time |
| `relationship` | `CONNECTED` \| `REQUESTED` \| `ASKED_ME` \| `NONE` | where you stand; `ASKED_ME` is what `GET /connections/relationship` calls `THEY_ASKED`; a request of yours that was declined or expired reads `NONE` here (Connect again) |
| `requestId` | uuid \| null | with `REQUESTED` and `ASKED_ME` only: the pending request; Accept takes it |
| `canOpenCard` | boolean | true only when they have you in one of their Rings |

A row carries **no user id, no Ring id and nothing shared in a Ring**; name and photo are the same for every searcher. `data: []` with `total: 0` is "No Pin names match".

**`AccountEntity`** (`GET` / `PATCH /users/me`): `findableByPinName: boolean`, beside email and phone; the rest as in [[BI-01 Account Backend Integration|BI-01]].

`RingProfileViewEntity` (the opened card), as in [[BI-09 View As & Pin Views Backend Integration#Shapes that matter|BI-09 · Shapes that matter]]: `pinName` and `displayName` (may be `null`) for the recent-searches entry; no Ring id, no user id.

## State to keep on the client

- The search page by (viewer, `q`) for the list on screen only, dropped when the text changes. Rows updated in place after Connect or Accept, not refetched.
- A resolved view by (viewer, Pin name), for the open s44 only. Never cache a 404.
- Recent searches by signed-in user, on the phone; re-resolve on every tap, because access is answered per request.
- The switch's value from `GET /users/me`; on a failed `PATCH`, put it back.

## Errors to handle

| Route | Status | ErrorCode | Meaning | Show |
|---|---|---|---|---|
| search | 400 | `E_SEARCH_01` | fewer than 3 letters after normalisation | never reached: the app sends 3 or more; treat as no matches |
| search | 400 | — (validation) | `q` missing or over 64 characters, `limit` over 50 | a client bug; treat as no matches |
| search | 429 | `E_SEARCH_02` | more than 30 searches in a sliding minute, per person; only searches that ran count (one under 3 letters, or one refused with 429, adds nothing) | "Too many searches, try again in a minute" in place of the list; no automatic retry; typing again searches as usual |
| search | — | offline, timeout, 5xx | | the no-connection state, with Try again |
| `GET /views/pin/:pinName` | 404 | `E_RING_ACCESS_01` | no such Pin name, or deleted, or not shared with you, or blocked | "This Pin isn't available to you" |
| `POST /connections/requests` | 4xx | `E_CONNECTION_REQUEST_*` | as on Connections ([[BI-16 Connections Backend Integration\|BI-16]]): `_03` they already asked you (body carries `requestId`: show Accept), `E_CONNECTION_01` already connected (refresh the row) | the row keeps Connect with a line otherwise |
| `POST /connections/requests` | 404 | `E_RING_ACCESS_01` | the row is stale: since the search the person turned the switch off (and has you in no Ring), a block was made either way, or the account is gone; one body for all. On a build older than `main @ 198d76f`: every row with `canOpenCard: false` ([[B-30 Connect from a Discover search row is refused for a person you can't already open\|B-30]]) | "This Pin isn't available to you"; the row keeps Connect until the next search |
| `POST /connections/requests` | 400 | `E_CONNECTION_REQUEST_04` | your own Pin name | never reached: the search never returns you |
| `PATCH /users/me` | 4xx, 5xx | — | the save did not go | the switch goes back, with a line |
| `PATCH /users/me` | 400 | — (validation) | `findableByPinName` is not `true` or `false` (the strings `"true"` and `"false"` are accepted as such), since backend `main @ e83682d` ([[B-29 The find-me switch reads the string false as true\|B-29]]); an older build saved `"false"` as true. Send a real boolean | a client bug; the switch goes back |
| any | 401 | `E_AUTH_04` | the session ended | sign in again |

`errorCode` is on the body of every domain error since `3cef5d7` ([[Frontend API Guide#Error shape]]).

## Rules the UI must respect

- Search as you type, 300 ms after the last keystroke, from 3 letters; one query in flight; a stale answer is dropped.
- Show the rows in the server's order; never re-sort, never filter: blocked people, yourself and the switched-off strangers are already gone.
- Open a card only for a row with `canOpenCard: true`; a tap on any other row does nothing.
- One message for every 404 on the resolve; never time or retry it to tell the cases apart (BI-09, *Errors to handle*).
- Never call `GET /profiles/pin-name/:pinName/availability` from the hub: it answers whether a name is taken, which the search deliberately does not for a hidden person.
- Never infer or show which Ring a result or a card came from.
- Demo people only outside production builds, from the app's own samples; nothing is sent for them.

## Not available yet

- **Where you stand with a stranger, from the relationship route.** `GET /connections/relationship?pinName=` answers 404 for a person whose card you cannot open, also after your request to them is pending. Use the search row or the Sent list (*Flow* 5).
- **A stranger's name and photo in the Sent list.** The request's `to` has the Pin name only until they share something with you (*Flow* 5).

Later, by [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]; no route exists for any of them:

- Ask Gemma ([[S-42 Discover Hub & Search Story|S-42]] S6, [[S-89 Gemma AI Story]]).
- Import contacts, matching the phone book (S-42 S7, after the privacy review).
- Knowing a Pin name is a business's, to open s55 ([[S-29 Companies Story#Open questions|S-29 · Open questions]]): every resolve lands on s44.

## Checklist

- [ ] Input normalised (strip `!` / `@`, trim, lowercase); nothing sent under 3 letters; 300 ms debounce; in-flight call cancelled, stale answers dropped.
- [ ] Rows in the server's order; `accountName` `null` → the Pin name; `avatarUrl` `null` → the outline.
- [ ] The four rows by `relationship`; Connect sent from every `NONE` row, `canOpenCard` false included, and sets `REQUESTED` in place; a 404 on Connect shows the line and keeps the row; Accept through s46 with `requestId`.
- [ ] No call to `GET /connections/relationship` for a search row.
- [ ] A tap opens s44 only when `canOpenCard`; s44 opens with the resolve's body, not re-fetched.
- [ ] Next page by `skip` until `meta.total`; a failing next page keeps the rows shown.
- [ ] 429 `E_SEARCH_02` shown in place of the list, no automatic retry.
- [ ] One line for every 404 on the resolve; the text stays in the field.
- [ ] Recent searches on the phone, per user, keyed by Pin name; `displayName` `null` handled; a tap re-resolves.
- [ ] Me › Privacy reads and saves `findableByPinName`; a failed save puts the switch back.
- [ ] No call to the Pin-name availability route from this screen.

## Log

- 2026-11-16 · `docs/backend/M-04-discovery/F-19-discover-hub/BD-19-shipped` · written against backend `main` `3cef5d7` and the approved [[FR-19 Discover Hub & Search Frontend Requirements]]: the MVP's one call is View As & Pin Views' `GET /views/pin/:pinName` (shape and rules in [[BI-09 View As & Pin Views Backend Integration]]), plus `pinName` on `GET /profiles`; no route of this feature's own. Set `current` with [[BD-19 Discover Hub & Search Backend Delivery]] `done`
- 2026-11-23 · `docs/backend/M-04-discovery/F-19-discover-hub/BD-19-pin-name-search` · the search by part of a Pin name added, against backend branch `BD-19/search/pin-name-search` (`c5bc838`, not on `main` yet): `GET /search/pin-names` (screens → calls, flow, `PinNameResultEntity`, errors, rules), Connect and Accept from a row through BI-16, and `findableByPinName` on `/users/me` for Me › Privacy. "Submit only, no partial match" and "my own Pin name opens View as" dropped (D-41: I never see myself); the S-42 and D-41 flags (2026-11-17) cleared. Stays `current`: what is on `main` still matches; the branch part is marked as such until the merge
- 2026-11-23 · `docs/backend/M-04-discovery/F-19-discover-hub/BD-19-merged` · the branch merged to backend `main` (khaled's word): the branch markers dropped, the note matches `main` whole. `current`
- 2026-11-23 · `docs/backend/M-04-discovery/F-19-discover-hub/BD-19-qa-findings` · corrected from [[QB-18 Discover Hub & Search QA Backend]]'s first run on `main @ c5bc838`, its flag cleared: Connect by Pin name is refused on a row that cannot open (*Screens → calls*, *Flow* 5, *Errors*, *Not available yet*); a deleted account still resolves for a member of its Ring until B-28 merges (*Flow* 7); only searches that ran count toward the limit; `avatarUrl` is a path; a string for `findableByPinName` is converted until B-29 merges. Stays `current`: it now says what `main` does
- 2026-11-23 · `docs/backend/M-04-discovery/F-19-discover-hub/BD-19-qa-findings` · B-28 and B-29 merged to backend `main` (`e83682d`, GitHub): *Flow* 7 and the `PATCH /users/me` error row now say a deleted account answers the 404 and a non-boolean answers 400. `current`, matching `main @ e83682d`; QA's re-test of both is pending
- 2026-11-25 · `tickets/backend/M-04-discovery/F-19-discover-hub/B-30-in-progress` · [[B-30 Connect from a Discover search row is refused for a person you can't already open|B-30]] merged to backend `main` (`198d76f`, on the GitLab remote; GitHub's `main` still `e83682d`): Connect is accepted from every row the search returns. *Screens → calls*, *Flow* 5, the two `POST /connections/requests` error rows, *Not available yet* and the *Checklist* brought to it: the 404 on Connect now means a stale row; the relationship route is not for search rows; a stranger's Sent row has the Pin name only. No shape and no code moved. `current`, matching `main @ 198d76f`; QA's re-test (QB-18 B43, B44) is pending
- 2026-11-25 · flagged [[FD-18 Discover Hub & Search Frontend Delivery]]: /frontend: Connect from a search row is accepted for every NONE row since backend main 198d76f (B-30), canOpenCard false included: 201 with the request. A 404 on Connect now means a stale row. Do not call GET /connections/relationship for a search row (404 for a stranger, also after the request); a stranger's Sent row has the Pin name only. BI-19 Flow 5, Errors, Checklist
