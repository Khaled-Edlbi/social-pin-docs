---
id: BI-16
type: backend-integration
module: connections
feature: connections
status: current
scope: feature
screens: [s11, s15, s17, s19, s38, s44, s45, s46, s47, s68]
depends: ["BD-14 Connections Backend Delivery", "FR-14 Connections Frontend Requirements"]
affects: ["FR-14 Connections Frontend Requirements"]
related: ["S-23 Connections Story", "D-10 Connect sends what the requester already has", "D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-16 Files load from signed links that expire in 15 minutes", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-23 A count of mutual connections, events where both were visible", "D-24 One pending request per pair", "D-26 A disconnect is not announced", "D-27 Sent keeps declined and expired requests for 30 days", "D-29 Connection detail opens a member who is not a connection", "BI-06 Ring Members Backend Integration", "BI-09 View As & Pin Views Backend Integration", "Frontend Contract", "POST /connections/requests", "GET /connections/requests", "DELETE /connections/requests/:id", "POST /connections/requests/:id/accept", "POST /connections/requests/:id/decline", "GET /connections/relationship", "GET /connections/count", "GET /connections", "GET /connections/:userId", "DELETE /connections/:userId", "POST /blocks", "GET /blocks", "DELETE /blocks/:id", "GET /views/pin/:pinName", "GET /rings", "POST /rings/:ringId/members", E_CONNECTION_01, E_CONNECTION_02, E_BLOCK_01, E_BLOCK_02, E_RING_02, E_RING_05]
pending: []
created: 2026-11-08
updated: 2026-11-08
tags: [backend-integration, backend-integration/current, module/connections, layer/backend]
---

# 🔌 Connections · Backend Integration

> ⚠ Affected by [[FD-13 Connections Frontend Delivery]] (2026-11-09): the client follows every Checklist row on social_pin f70c791: relationship after the view picks the button; 201 and 200 both sent, a 409 re-reads; Connect again with againFor, no 30-day count on the phone; one accept call then s47 from its answer; decline after the 5-second Undo; Contacts search on the server, debounced; a block drops the Connections caches; no Ring name, colour or type to the person in it. Tick the Checklist (/backend)

> Blocked by default until [[BD-14 Connections Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-14 Connections]] · **Backend:** [[BD-14 Connections Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

Written by the **backend** team for the frontend: how to call what was delivered. It matches backend `main` `1c460b0` (F-14 merged as `25fcc8c`, with F-18 and F-17 on either side). Every route is under `/api/v1`, bearer-authenticated, and acts for the signed-in user.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s44|s44]] Scanned Pin, opened by Pin name | the card opens | `GET /views/pin/:pinName`, then `GET /connections/relationship` `?pinName=` for the button |
| [[Screen Index#s44|s44]] | *Connect* | `POST /connections/requests` `{ pinName, note? }` |
| [[Screen Index#s44|s44]] | *Requested* → *Cancel request* | `DELETE /connections/requests/:id` (the `requestId` from relationship) |
| [[Screen Index#s44|s44]] | *Declined* / *Expired* → *Connect* | `POST /connections/requests` `{ againFor: requestId, note? }` |
| [[Screen Index#s44|s44]] | *Accept* (they asked) | opens s46 for relationship's `requestId` |
| [[Screen Index#s44|s44]] ⋯ | *Block* | `POST /blocks` `{ pinName }` |
| [[Screen Index#s45|s45]] Incoming · N | the tab | `GET /connections/requests` `?direction=incoming&limit=&skip=` |
| [[Screen Index#s45|s45]] Sent · N | the tab | `GET /connections/requests` `?direction=sent&limit=&skip=` |
| [[Screen Index#s45|s45]] Sent row | *Cancel* / *Connect* again | `DELETE /connections/requests/:id` / `POST /connections/requests` `{ againFor: id }` |
| [[Screen Index#s45|s45]] Incoming row | ✕ *Decline* (after the 5-second Undo) | `POST /connections/requests/:id/decline` |
| [[Screen Index#s45|s45]] Incoming row | tap the row | `GET /views/user/:userId/perspectives` with `from.userId` |
| [[Screen Index#s46|s46]] Accept into a Ring | the Ring list | `GET /rings` (filter live Rings on the phone; `memberCount` is there) |
| [[Screen Index#s46|s46]] | *Accept & add to Ring* | `POST /connections/requests/:id/accept` `{ ringId, startsAt?, expiresAt? }` |
| [[Screen Index#s38|s38]] / [[Screen Index#s68|s68]] Contacts | list, search, *No Ring yet* | `GET /connections` `?q=&noAccess=&limit=&skip=` |
| [[Screen Index#s68|s68]] Me | "N connections" | `GET /connections/count`, or `meta.total` of `GET /connections` `?limit=1` |
| [[Screen Index#s38|s38]], [[Screen Index#s11|s11]] | pending count | `meta.total` of `GET /connections/requests` `?direction=incoming&limit=1` |
| [[Screen Index#s47|s47]] Connection detail | opens | `GET /connections/:userId` |
| [[Screen Index#s47|s47]] | tick / untick / window | `POST /rings/:ringId/members` `{ userId }`, `DELETE /rings/:ringId/members/:userId`, `PATCH /rings/:ringId/members/:userId` ([[BI-06 Ring Members Backend Integration]]) |
| [[Screen Index#s47|s47]] | *Disconnect* | `DELETE /connections/:userId` |
| [[Screen Index#s47|s47]] ⋯ | *Block* | `POST /blocks` `{ userId }` |
| [[Screen Index#s19|s19]] step 2 | search my connections | `GET /connections` `?q=`, and `noAccess=true` for *No Ring yet* |
| [[Screen Index#s68|s68]] Blocked people | list, *Unblock* | `GET /blocks`, `DELETE /blocks/:id` |

## Flow

1. **Open a card by Pin name**, then ask where you stand: `GET /connections/relationship` `?pinName=` → `{ state, requestId }`. Both 404 the same way when the card is not available; show the card's "This profile isn't available to you".
2. **Connect**: `POST /connections/requests` `{ pinName, note? }` → **201** (new) or **200** (yours was already pending: the same request). Show *Requested* only after the answer.
3. **The receiver** sees it on Incoming, opens s46, picks a Ring, and accepts. One call does all of it: the membership, the connection, the Ring kept private. Open s47 from the answer.
4. **The requester** refetches: the request leaves Sent, relationship reads `CONNECTED`, and the person appears on Shared with me (`GET /rings/shared-with-me`, unchanged).
5. **Decline** closes it as `DECLINED`; the requester sees it on Sent and on the card, and may ask again at once with `againFor`.
6. **Disconnect** or **Block** end it. Neither is announced.

## Shapes that matter

A request. `from` on Incoming only (with the requester's `userId`); `to` on Sent and on the send answer (never a `userId`). No field ever names a Ring.

```json
{
  "id": "6c1e…",
  "status": "PENDING",
  "note": "We met at TechSummit",
  "source": "PIN_NAME",
  "createdAt": "2026-11-08T09:41:22.104Z",
  "expiresAt": "2026-12-08T09:41:22.104Z",
  "to": { "displayName": "Sam Kassem", "pinName": "samkassem", "avatarUrl": "https://…/files/content/…" }
}
```

Where you stand with the card (`state`: `NONE`, `REQUESTED`, `DECLINED`, `EXPIRED`, `CONNECTED`, `THEY_ASKED`):

```json
{ "state": "THEY_ASKED", "requestId": "9a0d…" }
```

The accept answer (to the receiver only):

```json
{
  "connection": { "userId": "…", "displayName": "Maya Fadel", "pinName": "mayafadel", "avatarUrl": null,
                  "connectedAt": "2026-11-08T10:02:11.000Z", "source": "PIN_NAME", "ringCount": 1 },
  "membership": { "id": "…", "ringId": "…", "userId": "…", "status": "ACTIVE", "addedById": "…",
                  "startsAt": null, "expiresAt": null, "createdAt": "…", "updatedAt": "…" }
}
```

A contact (a `GET /connections` row) is `connection` above. Connection detail adds `mutualCount` and `memberships`; `connectedAt` and `source` are `null` for a member of your Rings who is not a connection (D-29):

```json
{ "userId": "…", "displayName": "Maya Fadel", "pinName": "mayafadel", "avatarUrl": null,
  "connectedAt": "2026-11-04T10:00:00.000Z", "source": "PIN_NAME", "mutualCount": 4,
  "memberships": [ { "ringId": "…", "status": "ACTIVE", "startsAt": null, "expiresAt": null, "createdAt": "…" } ] }
```

A block row: `{ id, displayName, pinName, avatarUrl: null, blockedAt }`. Lists are `{ data, meta: { total } }`, `limit` ≤ 50, `skip`.

## State to keep on the client

- The card keeps **what it was opened with** (the Pin name) and sends it with *Connect* and *Block*. Never hold the other person's user id before the accept: no response gives you one.
- Key requests by their own `id`, contacts and details by `userId`, blocks by their `id`; never by Pin name.
- Refetch the lists after every write. **On a block, drop** the contacts list, both request lists, that detail, Shared with me and every cached view of that person. On sign-out, drop everything.
- The pending count: refetch on focus, at most once a minute.

## Errors to handle

Until [[S-87 Error Contract Story|Error Contract]] puts `ErrorCode` on the wire, branch on the status and the route; the codes are here for when it does.

| Status | ErrorCode | Meaning | Show |
|---|---|---|---|
| 404 | `E_RING_ACCESS_01` | relationship, send by Pin name, ask again, block by Pin name: no such Pin, not shared with you, or blocked either way (one body, the card's) | "This profile isn't available to you"; the button back to *Connect* |
| 409 | `E_CONNECTION_01` | send: already connected | the button becomes *Connected* |
| 409 | `E_CONNECTION_REQUEST_03` | send: they asked you first (D-24) | refetch relationship (`THEY_ASKED` gives their `requestId`), open s46 |
| 404 | `E_CONNECTION_REQUEST_01` | cancel, accept, decline, `againFor`: no such request, or not yours | refetch, no error |
| 409 | `E_CONNECTION_REQUEST_02` | cancel, accept, decline: answered, cancelled or expired | refetch; on s46 "This request is no longer open" |
| 400 | `E_CONNECTION_REQUEST_04` | send: your own Pin name | not reachable from the app (your card is a preview) |
| 400 | `E_CONNECTION_REQUEST_05` | accept: `expiresAt` not after now and after `startsAt` | inline under *Expires* |
| 404 | `E_RING_02` | accept: the Ring is gone, ended or archived | "That Ring isn't available any more", refetch `GET /rings` |
| 403 | `E_RING_05` | accept: you don't administer that Ring | the same, refetch |
| 409 | `E_RING_MEMBER_04` | accept: this person cannot be added (a block) | "Can't add this person", never why |
| 404 | `E_CONNECTION_02` | detail, disconnect: not a contact or member of your Rings (disconnected, blocked, deleted) | "This person isn't in your contacts any more", back to Contacts |
| 404 | `E_BLOCK_02` | block by `userId`: not someone you can block from here | refetch |
| 404 | `E_BLOCK_01` | unblock: no such block of yours | refetch, no error |
| 400 | validation (`message` is an array) | both or neither of `pinName` / `againFor` (or `pinName` / `userId`), a note over 200, `direction` missing, `noAccess` not `true`/`false`, `limit` over 50 | inline |

## Rules the UI must respect

- **Status codes**: send and block answer 201 when they made something and 200 when it already existed; both are success. Cancel, disconnect and unblock answer **204**; decline answers **200** with no body; accept answers 201.
- **Who you can ask by Pin name**: only someone whose card you can open. A Pin name that 404s on the card 404s on *Connect* too; the scan is how a stranger connects (not available yet).
- **A note** is trimmed; an empty one is no note; over 200 characters is a 400. Show it as plain text, never as a link.
- **Sent** returns `PENDING`, `DECLINED` and `EXPIRED`; a declined or expired row for 30 days after it ended, then it is gone. Count nothing on the phone.
- **Expiry**: a request lapses 30 days after it was sent (`expiresAt`). It leaves Incoming at once and reads `EXPIRED` on Sent.
- **The person on a row** is the card you may see: someone who asked you shows their public card; someone who shares with you, the card they share with you (the same Ring their Shared with me row opens: one you joined knowingly if there is one, else the one they put you in first); anyone else only their Pin name (`displayName` and `avatarUrl` null: show the Pin name and initials).
- **Contacts search** (`q`) matches the name or Pin name you see, among your contacts only; never filter the loaded page yourself.
- **`ringCount` 0** is *No access*: a contact in none of your live Rings.
- **Detail's `memberships`** are your Rings only, oldest first; "What they can see" is the oldest live one's projection (`GET /rings/:ringId/projection`). `mutualCount` 0 hides the row.
- **Disconnect** is only for a contact (`connectedAt` set); a member who is not a connection has no *Disconnect*.
- **Block by `userId`** works for a contact, a member of your Rings or someone in your Incoming; from a card, block by `pinName`.
- **Unblock restores nothing.**
- **Never tell the other person**: no copy says they were disconnected, blocked or removed.

## Not available yet

- *Connect*, *Block* and the button after a **scan** (`{ qrToken }`): the scan itself is on `main` ([[S-37 Badge & QR Story|Badge & QR · S13–S18]]), but these three routes take a Pin name only and refuse `qrToken` with a 400 → [[BD-14 Connections Backend Delivery]] `pending`. After a scan, *Connect* works only when the card also opens by its Pin name.
- `relationship` **on the views** themselves: it is its own call, `GET /connections/relationship` → [[FR-12 View As & Pin Views Frontend Requirements|FR-12]].
- The 409 body carrying `requestId` and `ErrorCode` → [[S-87 Error Contract Story|Error Contract · S4–S8]]; use relationship meanwhile.
- `source` other than `PIN_NAME`, `eventName`, `eventRingId` and the event filter on Incoming → [[S-23 Connections Story|Connections · S15]] (v1).
- Rings you administer listed on s46 → [[S-31 Delegated Admins Story]] (accept already allows them).
- A photo on Blocked people (`avatarUrl` is always null).
- Names on a Ring's roster (s15) → [[FR-09 Ring Members Frontend Requirements|FR-09]]; first-Ring order on `/views/pin` and the perspectives → [[FR-12 View As & Pin Views Frontend Requirements|FR-12]]; notifications → [[S-96 Notifications Story]]; Gemma's suggested Ring → [[S-89 Gemma AI Story|Gemma AI · S7]].

## Checklist

- [ ] The card calls relationship after the view and picks the button from `state`.
- [ ] *Connect* treats 201 and 200 as sent; a 409 refetches relationship.
- [ ] Sent's *Connect* again uses `againFor`; nothing on the phone counts the 30 days.
- [ ] s46 sends one accept call and opens s47 from its answer; no optimistic accept.
- [ ] Decline waits for the 5-second Undo on the phone, then sends.
- [ ] Contacts search goes to the server, debounced.
- [ ] A block drops every Connections cache.
- [ ] No screen shows a Ring's name, colour or type to the person in it.
