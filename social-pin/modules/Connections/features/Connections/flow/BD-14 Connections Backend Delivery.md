---
id: BD-14
type: backend-delivery
module: connections
feature: connections
status: in-progress
scope: feature
screens: [s11, s15, s17, s19, s38, s44, s45, s46, s47, s62, s68]
depends: ["FR-14 Connections Frontend Requirements", "S-23 Connections Story"]
affects: ["FR-14 Connections Frontend Requirements", "BD-03 Counts Backend Delivery"]
related: ["F-14 Connections", "BD-08 Ring Access Engine Backend Delivery", "BD-09 Ring Members Backend Delivery", "BD-12 View As & Pin Views Backend Delivery", "D-10 Connect sends what the requester already has", "D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-18 Ring names shown when joined knowingly", "D-23 A count of mutual connections, events where both were visible", "D-24 One pending request per pair", "D-25 A deleted account's connections, requests and blocks end silently", "D-26 A disconnect is not announced", "D-27 Sent keeps declined and expired requests for 30 days", "D-28 Scan someone in is not in the MVP", "D-29 Connection detail opens a member who is not a connection", "Ring Access Model", "POST /connections/requests", "GET /connections/requests", "DELETE /connections/requests/:id", "POST /connections/requests/:id/accept", "POST /connections/requests/:id/decline", "GET /connections/relationship", "GET /connections/count", "GET /connections", "GET /connections/:userId", "DELETE /connections/:userId", "POST /blocks", "GET /blocks", "DELETE /blocks/:id", "POST /rings/:ringId/members", "GET /views/pin/:pinName", E_CONNECTION_01, E_CONNECTION_02, E_BLOCK_01, E_BLOCK_02, E_RING_02, E_RING_05]
pending: ["[[S-23 Connections Story]]: merge backend branch FR-14/connection/requests-accept-contacts-block to main"]
created: 2026-10-18
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/in-progress, module/connections, layer/backend]
---

# 🟡 Connections · Backend Delivery

**Feature:** [[F-14 Connections]] · **Status:** In progress · **Integration guide:** [[Connections Backend Integration]] · **Requirements:** [[FR-14 Connections Frontend Requirements]] · **QA:** [[Connections QA Backend]]

What the backend built for this feature and how it works. **Nothing below is on `main` yet:** it is on the backend branch `FR-14/connection/requests-accept-contacts-block` (`345daf1`, `7b58cc8`, `4beb29e`), pushed and not merged. Until the merge, `main` has the tables and no route.

## Endpoints, tables and code

**Endpoints** (13, all bearer, any signed-in user acting for themselves)

| Endpoint | Who may call it, with what | Story part |
|---|---|---|
| `POST /connections/requests` | the requester: `{ pinName }` or `{ againFor }`, `note?` | S2, S4 |
| `GET /connections/requests` | `?direction=incoming` the receiver, `?direction=sent` the requester | S3, S4 |
| `DELETE /connections/requests/:id` | the requester, on their pending request | S2, S4 |
| `POST /connections/requests/:id/accept` | the receiver: `{ ringId, startsAt?, expiresAt? }` | S5 |
| `POST /connections/requests/:id/decline` | the receiver | S6 |
| `GET /connections/relationship` | `?pinName=`, anyone who can open that card | S2 |
| `GET /connections/count` | me | S14 |
| `GET /connections` | me, `?q=&noAccess=` | S8, S12 |
| `GET /connections/:userId` | me, for a contact or a member of my Rings | S9, S10 |
| `DELETE /connections/:userId` | me, for a contact | S11 |
| `POST /blocks` | me: `{ pinName }` or `{ userId }` | S13 |
| `GET /blocks` | me | S13 |
| `DELETE /blocks/:id` | me, for my block | S13 |

**Error codes** (new): `E_CONNECTION_01` already connected (409) · `E_CONNECTION_02` not a contact or member of your Rings (404) · `E_CONNECTION_REQUEST_01` no such request, or not yours (404) · `E_CONNECTION_REQUEST_02` no longer open (409) · `E_CONNECTION_REQUEST_03` they already asked you (409, D-24) · `E_CONNECTION_REQUEST_04` cannot ask yourself (400) · `E_CONNECTION_REQUEST_05` access window invalid (400) · `E_BLOCK_01` no such block (404) · `E_BLOCK_02` no such person to block (404). Reused: `E_RING_ACCESS_01`, `E_RING_02`, `E_RING_05`, `E_RING_MEMBER_04`.

**Tables / models:** `Connection` (+ `connected_at`, `source`), `ConnectionRequest` (+ `expires_at`, `source`; `message` is read as `note`), `UserBlock` (+ `target_display_name`, `target_pin_name`), new enum `CONNECTION_SOURCE` (`SCAN`, `PIN_NAME`, `PINCAST`, `EVENT`). One hand-authored migration, `20261108150000_connections`: the backfills (`expires_at` = `created_at` + 30 days, `connected_at` = `created_at`), the per-direction unique key dropped, and **`connection_requests_one_pending_per_pair`**, a partial unique index on the unordered pair `WHERE status = 'PENDING'` (D-24), which Prisma's schema language cannot express. Replayed on a throwaway database over existing rows; `prisma migrate diff` still shows only the known `pincasts_geo_gist` difference.

**Code:** `src/modules/connection/` (`ConnectionController`, `BlockController`, `ConnectionService`, `ConnectionRequestService`, `BlockService`, the request query builder), `src/prisma/validators/connection.validator.ts`, and three additive methods on `RingAccessService`: `countLiveMembershipsByMember`, `resolvePublicRings`, `countMutualConnections`.

## How it works

- **Every visibility answer comes from the access engine** ([[Ring Access Model]]). Who shares with me, the Ring a requester shows, how many of my Rings someone can see and the mutual count are `RingAccessService` methods; a person's card is `RingProfileService.cardsForRings` rendering the Ring the engine picked, the same rendering as `/views` and Shared with me, so photos are signed links (D-16).
- **Addressing (D-10).** `POST /connections/requests { pinName }` resolves the Pin through the same check as `GET /views/pin/:pinName`: the account must be live and the requester must be able to open one of the person's Rings right now (`resolveDefaultAccess`). No such Pin, not shared, a block either way: the views' one 404 `E_RING_ACCESS_01`, body for body. So a stranger cannot connect by Pin name, exactly as they cannot open the card; the scan is the stranger's path (F-18). `{ againFor }` addresses the person of one of my own requests (a Sent row), and refuses a block or a gone account with the same 404. No user id is ever accepted.
- **One pending request per pair (D-24).** Before inserting, the pair's lapsed requests are written `EXPIRED`; a connection answers 409 `E_CONNECTION_01`; their pending request answers 409 `E_CONNECTION_REQUEST_03`; my own pending request comes back with 200 (no duplicate). The partial unique index holds it under concurrency: the insert is not wrapped in a transaction, so when the index refuses it the state is read again and answered as above. Checked live: three taps at once give one request (201, 200, 200), two crossing taps give one request (201, 409).
- **Expiry (D-17).** `expiresAt` = sent + 30 days, exclusive. Every read treats a `PENDING` row past it as `EXPIRED`; the next request for the pair writes it. Incoming drops it at once; Sent keeps it.
- **Sent (D-13, D-27).** `PENDING`, `DECLINED` and `EXPIRED`; a declined one until 30 days after `respondedAt`, an expired one until 30 days after `expiresAt`. Accepted and cancelled are not returned. A block cancels the blocked person's pending request, so it disappears; it never reads `DECLINED`.
- **Which card a person shows on a Connections row** (`ConnectionService.cardsFor`): someone **who asked me** (incoming, or the request I accepted) shows their public card, their live default Ring's; someone **who shares with me** shows the card they share with me, from the Ring they put me in first (D-15), which is the Sent list's "as the card showed them"; anyone else shows only their Pin name. The base profile is never read beyond the Pin name. FR-14 asked for the requester's main-profile name: the default Ring's card follows the main profile unless that Ring set its own, and never shows what the requester switched off for everyone.
- **Accept (S5)** is one transaction: `RingMemberService.add` (the members route's own rules: administration at `MEMBER_MANAGER`, no block with the Ring's owner, never the owner), the connection upserted `ACTIVE` with `connectedAt` and `source`, and the request `ACCEPTED` with `grantedRingId`, written conditionally on `PENDING` so a cancel that lands in between rolls the whole accept back. The Ring must be `ACTIVE` and not ended (started or not); otherwise 404 `E_RING_02`. Someone already live in that Ring keeps their membership (no error). A block between the two people is 409 `E_RING_MEMBER_04`. The membership is placed (D-18): its Ring is never named to them. `grantedRingId` is written here and read by no route (D-14).
- **Contacts (S8, S12)** are my `ACTIVE` connections whose other side has an account (D-25), each with `ringCount` from the engine (live memberships in my live Rings, blocks excluded). `q` and `noAccess` filter the card I see and the count, so a search never matches a name the person has not shown me nor reaches a stranger; they run in memory over my own connections, then the page is cut. `GET /connections/count` uses the same `where`, so it always equals `meta.total`.
- **Detail (S9, D-23, D-29)** answers a contact, or a member of my Rings who is not one (`connectedAt: null`), with their non-removed memberships in my Rings oldest first and `mutualCount` (people `ACTIVE`-connected with both, not deleted, no block against either). Me, a stranger, a block either way and a deleted account are one 404 `E_CONNECTION_02`.
- **Disconnect (S11, D-15, D-26)** ends the connection and every membership of theirs in my Rings in one transaction, and sends nothing. My memberships in their Rings are theirs to manage and stay. A member who is not a connection cannot be disconnected (404).
- **Block (S13)** takes `{ pinName }` (the card's own check, so blocking from a card tells nothing a card would not) or `{ userId }` for someone I can already name by id (a contact, a member of my Rings, a requester in my inbox, someone I blocked before; anyone else 404 `E_BLOCK_02`, so the route probes nothing). In one transaction it keeps the person as I saw them, removes the memberships both ways, closes the connection (`BLOCKED`) and cancels pending requests both ways; 201 when made, 200 when it already existed (also under a double tap). The engine already honoured blocks; now they can be made. **Unblock restores nothing.**

### What exists

On the branch, not on `main`: every endpoint above, checked by 102 new unit tests (818 in all, typecheck clean) and by a live run of 81 checks plus a concurrency run on a throwaway database (`social_pin_f14`, port 3141, dropped afterwards), covering S1 to S14 except where *Gaps* says otherwise.

### Gaps

- **Not merged.** Every row of [[FR-14 Connections Frontend Requirements]] for these routes stays ❌ until it is.
- **By scan (`qrToken`)**: not accepted by `POST /connections/requests`, `POST /blocks` or the relationship route; it waits on the QR resolve ([[F-18 Badge & QR]]), whose token lookup these routes should share (D-10).
- **`relationship` on the views**: FR-14 asked for it on `GET /views/pin/:pinName` and `GET /views/qr/:token`; it is its own route, `GET /connections/relationship?pinName=`, because the views are [[F-12 View As & Pin Views]]' code. One more call when a card opens.
- **The 409 `E_CONNECTION_REQUEST_03` body**: the service puts `requestId` on it, but `AllExceptionsFilter` sends only `message` and `error` until [[S-87 Error Contract Story|Error Contract]] lands, so today the client reads the id from `GET /connections/relationship` (`THEY_ASKED`). No `ErrorCode` on the wire yet either.
- **Deleting an account (D-25)**: every list and the detail already leave a deleted account out, so the people on the other side see what D-25 asks; but `UserService.softDelete` does not yet end the rows themselves (connections, requests, blocks). That belongs to the account deletion ([[F-01 Account]]).
- **Blocked people's photo**: `avatarUrl` is always null; only the name and Pin name are kept with the block.
- **A member who joined by code** shows only their Pin name on s47 until memberships record how they were made ([[F-17 Ring Invitations & Join]]).
- **Where from**: only `PIN_NAME` is produced. `SCAN` waits on F-18, `PINCAST` on PinCast, `EVENT` with `eventName` / `eventRingId` and the event filter on the incoming list on the Events features (S15, v1).
- **Rings I administer on s46**: accept already allows a Ring I administer at `MEMBER_MANAGER`, but no route lists them ([[S-31 Delegated Admins Story]]).
- Not part of this branch, asked by S-23 of other features: names and photos on the roster (FR-09), first-Ring order on `/views/pin` and the perspectives (FR-12, D-15), notifications (S-96), Gemma's suggested Ring (S-89), events in common (D-23).
- Contacts are filtered in memory over the caller's own connections: fine at MVP sizes, a limit to revisit for very large contact lists.

## Log

- 2026-11-08 · backend branch `FR-14/connection/requests-accept-contacts-block` (`345daf1` schema and migration, `7b58cc8` access engine, `4beb29e` connection module), pushed, **not merged** · S2–S14: the 13 routes above, migration `20261108150000_connections`, nine new error codes. 818/818 tests (102 new), typecheck clean; live run 81/81 and the D-24 concurrency check on throwaway `social_pin_f14` :3141, dropped. This note stays `in-progress` with the merge in `pending`. The three flags from [[S-23 Connections Story]], [[D-23 A count of mutual connections, events where both were visible]] and [[D-10 Connect sends what the requester already has]] are answered above and cleared. Flagged nothing: the requirements rows and [[BD-03 Counts Backend Delivery]]'s pending S11 move at the merge.
- 2026-11-08 · [[FR-14 Connections Frontend Requirements]] approved by the backend (`tickets/backend/M-02-connections/F-14-connections/FR-14-accepted`); this note → `in-progress`.
- 2026-10-18 · split out of [[F-14 Connections]] when the vault moved to layers
