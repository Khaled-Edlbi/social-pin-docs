---
id: FR-14
type: frontend-requirements
module: connections
feature: connections
status: ready
scope: feature
screens: [s11, s15, s17, s19, s34, s38, s42, s43, s44, s45, s46, s47, s62, s68, s69]
blockedBy: []
depends: ["S-23 Connections Story"]
affects: ["BD-14 Connections Backend Delivery"]
related: ["S-23 Connections Story", "D-04 Ring settings at launch and their defaults", "D-06 Yearly rename, old name freed, case-insensitive", "D-10 Connect sends what the requester already has", "D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-16 Files load from signed links that expire in 15 minutes", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-18 Ring names shown when joined knowingly", "D-23 A count of mutual connections, events where both were visible", "D-24 One pending request per pair", "D-25 A deleted account's connections, requests and blocks end silently", "D-26 A disconnect is not announced", "D-27 Sent keeps declined and expired requests for 30 days", "D-28 Scan someone in is not in the MVP", "D-29 Connection detail opens a member who is not a connection", "BI-06 Ring Members Backend Integration", "BI-08 Rings Backend Integration", "BI-09 View As & Pin Views Backend Integration", "FR-03 Counts Frontend Requirements", "FR-09 Ring Members Frontend Requirements", "FR-11 Rings Frontend Requirements", "FR-12 View As & Pin Views Frontend Requirements", "FR-16 Delegated Admins Frontend Requirements", "FR-18 Badge & QR Frontend Requirements", "FR-39 Notifications Frontend Requirements", "S-87 Error Contract Story", "Frontend Contract", "GET /views/pin/:pinName", "GET /views/user/:userId/perspectives", "GET /rings", "GET /rings/shared-with-me", "POST /rings/:ringId/members", "PATCH /rings/:ringId/members/:userId", "DELETE /rings/:ringId/members/:userId", "POST /rings/:ringId/members/:userId/reassign", "GET /rings/:ringId/projection", "E_RING_02", "E_RING_05"]
pending: []
created: 2026-10-18
updated: 2026-11-04
tags: [frontend-requirements, frontend-requirements/ready, module/connections, layer/frontend]
---

# 📨 Connections · Frontend Requirements

**Feature:** [[F-14 Connections]] · **Status:** Ready (waiting on the backend's review) · **Story:** [[S-23 Connections Story]] (approved 2026-11-04) · **Backend Integration:** not yet (no routes: [[BD-14 Connections Backend Delivery]])

What the client needs from the backend to build every part of [[S-23 Connections Story]], S1 to S16, and whether each need is met today. **Rewritten 2026-11-04** against the approved story and the decisions D-10, D-23 and D-24 to D-29: every link names the story's current parts, *Connect* sends `{ qrToken }` or `{ pinName }`, s47 shows the mutual count, and the questions the story left open are answered below.

**What exists today.** Showing the other person (`/views`), the Ring members routes (add, window, move, remove), `GET /rings` and `GET /rings/shared-with-me`. Everything that creates, lists, answers or closes a request, the contacts list, the connection detail, disconnect and blocks: **no route**. In the app every connection screen is sample data except the person card on Shared with me.

**Three rules that shape every row below:**

1. **The requester never gets the other person's user id before being accepted** ([[D-10 Connect sends what the requester already has]]). The card, *Connect*, *Block* from the card and the Sent list work from the token or the Pin name the card was opened with, or from the request's own id. A user id first reaches the requester on the contacts list, after the accept.
2. **Nothing tells a block apart** ([[Frontend Contract]]): not the card, not *Connect*, not the Sent list, not an error code. A blocked pair reads as "This profile isn't available to you", and a request to someone who blocked me stays *Pending* until it expires.
3. **No Ring reaches the requester** ([[D-14 Shared with me lists people, never the Ring]]): no `ringId`, no `grantedRingId`, no Ring name, colour or type in any response the requester gets.

## Per screen

### [[Screen Index#s43|s43]] Scan → [[Screen Index#s44|s44]] Scanned Pin: the card (S1)

- Needs: the person's card from a scanned code; from a `!pinname`; from a PinCast row. The same card for all three.
- **By scan:** `GET /views/qr/:token` → `RingProfileViewEntity` ❌ ([[FR-18 Badge & QR Frontend Requirements|FR-18]], [[S-37 Badge & QR Story|Badge & QR · S13–S18]]). Today the reader is a timer that opens a sample card.
- **By Pin name:** `GET /views/pin/:pinName` ✅.
- **From PinCast:** ❌ ([[S-45 PinCast & Nearby Story]]).
- The app **keeps what it opened the card with**, `{ qrToken }` or `{ pinName }`, for as long as the card is open; it is what *Connect* and *Block* send (D-10).
- **The card needs to know where I stand with this person**, to show the right button. Without a user id the app can't work it out, so the view the card is opened with must say so. Asked: `GET /views/qr/:token` and `GET /views/pin/:pinName` carry, **for the viewer only**:
  ```
  relationship: {
    state: NONE | REQUESTED | DECLINED | EXPIRED | CONNECTED | THEY_ASKED,
    requestId?: string   // mine when REQUESTED / DECLINED / EXPIRED; theirs when THEY_ASKED
  }
  ```
  This answers D-10's *Still open* (opening the same person by another token, or by Pin name, still shows *Requested*): the server knows the pair, the app doesn't need to. It adds no new id the requester can keep: `requestId` names the request, not the person, and dies with it. A blocked pair never gets this far: it is the 404.
- **My own card:** the app compares the view's `pinName` with mine and opens View as, marked as a preview, with no *Connect* and no ⋯. No call needed.
- **Not a Social Pin code:** decided on the phone, no call ("Not a Social Pin code", S-37 S15).
- *Save for later*: kept on the phone only (S-37 S4); sends nothing.
- Copy on the card: "You see what their Ring shares, never which Ring you are in."
- States: loading; resolved; not available (one 404); my own (preview); offline ("You're offline").

### [[Screen Index#s44|s44]] Scanned Pin: Connect, and what the button says (S2)

- **Button states**, from `relationship.state`:

  | State | Button | Tap |
  |---|---|---|
  | `NONE` | *Connect* | the note sheet, then send |
  | (sending) | *Sending…*, disabled | — |
  | `REQUESTED` | *Requested* | *Cancel request* → `DELETE /connections/requests/:requestId` |
  | `DECLINED` | "Declined" + *Connect* | a **new** request at once (D-17) |
  | `EXPIRED` | "Expired" + *Connect* | a new request at once |
  | `CONNECTED` | *Connected* | opens Connection detail (s47) once the contacts list exists |
  | `THEY_ASKED` | *Accept* | opens the accept sheet (s46) for `requestId` |

- **Send:** `POST /connections/requests` ❌ with **exactly one** of `{ qrToken }` / `{ pinName }`, plus `note?`:
  - `note`: optional, **≤ 200 characters**, trimmed; empty means no note. The sheet counts as you type and won't send over 200; the server refuses over 200 too (400).
  - → 201 `{ id, status: PENDING, note, createdAt, expiresAt }`. No user id, no Ring.
  - **Already pending from me:** 200 with **that same request**, not a new one and not an error.
  - **Already connected:** 409 `E_CONNECTION_01` (proposed) → the button becomes *Connected*, no error shown.
  - **They already asked me:** 409 `E_CONNECTION_REQUEST_03` (proposed) **with their `requestId`** → the app opens s46 for it. Only reached when two people tap at the same moment: otherwise the card already showed *Accept*. There is one pending request per pair, whichever way ([[D-24 One pending request per pair]]).
  - **Blocked either way, token expired or revoked, Pin name freed:** the card's 404 (`E_RING_ACCESS_01`), same message; the button goes back to *Connect*.
- **Offline or a 5xx:** "Couldn't send your request. Try again." The button stays *Connect*; **nothing is queued**.
- No optimistic *Requested*: it shows after the 201 or 200.

### [[Screen Index#s45|s45]] Requests · Incoming (S3)

- **List:** `GET /connections/requests?direction=incoming&limit=&skip=` ❌ → `{ data: ConnectionRequestEntity[], meta: { total } }`. Pending only, newest first, `limit` ≤ 50.
- **A row needs** (incoming):

  | Shown | Field | Notes |
  |---|---|---|
  | Who | `from.userId`, `from.displayName`, `from.pinName`, `from.avatarFileId` | the requester chose to ask, so the receiver may know who: their main profile's name and Pin name. The `userId` is needed to open what they share with me (S10) and to add them later |
  | When | `createdAt` | "2 h ago" |
  | Where from | `source`: `SCAN` / `PIN_NAME` / `PINCAST` / `EVENT`, and `eventName` for `EVENT` | "Scanned your badge", "Found you by Pin name"; hidden when absent |
  | Their note | `note` | up to 200 characters, quoted; hidden when null |
  | Expires | `expiresAt` | not shown on the row; used for nothing else in the MVP |

- Tab label "Incoming · N" from `meta.total`. Photos: initials until files load (D-16).
- *Accept* → s46. *Decline* (✕) → S6. The row → what they share with me, `GET /views/user/:userId/perspectives` ✅ (empty: "Nothing shared with you right now").
- **Expired** requests are simply not returned (the 30 days are the server's job, D-17).
- Empty: "No requests yet. Share your badge to get found."
- Refetch on screen open, on pull, after every accept, decline and cancel. A row answered on another phone, cancelled or expired disappears on the next fetch, without an error.

### [[Screen Index#s45|s45]] Requests · Sent (S4)

- **List:** `GET /connections/requests?direction=sent&limit=&skip=` ❌. Statuses returned: `PENDING`, `DECLINED`, `EXPIRED`. **Accepted and cancelled are not returned.** Newest first.
- **A row needs** (sent): `id`, `status`, `createdAt`, `note`, and the person **as I found them**: `to.displayName`, `to.pinName`, `to.avatarFileId` as the card showed them. **No `to.userId`** (D-10); no Ring.
- **A block reads as `PENDING`** until the 30 days are up, then `EXPIRED`, or the row is dropped. Never `DECLINED`, never a status of its own.
- *Cancel* on a pending row: `DELETE /connections/requests/:id` ❌ → 204. Optimistic: the row leaves at once and comes back with "Couldn't cancel" if the call fails. Gone from their inbox too.
  - Already answered or expired a moment ago: 409 `E_CONNECTION_REQUEST_02` (proposed) → refetch, no error.
- *Declined* and *Expired* rows: *Connect* again → a new request to the same person; the row has no token, no Pin name of mine and no user id, so it is addressed by the old request. **Asked:** `POST /connections/requests { againFor: requestId, note? }`, which sends a new request to the same person, after the same access checks (a block is the 404).
- **Declined and expired rows stay 30 days** after they ended, then the server stops returning them; no reminder before a request expires ([[D-27 Sent keeps declined and expired requests for 30 days]]). The app shows what the server returns and counts nothing itself.
- Tab label "Sent · N"; empty: "You haven't asked anyone yet."

### [[Screen Index#s46|s46]] Accept into a Ring (S5)

- A bottom sheet: "Add {name} to a Ring", "They will only see what that Ring shares", the request's note.
- **The Ring list:** `GET /rings` ✅, filtered on the phone:
  - only **live** Rings: `status` ACTIVE, not ended (`expiresAt` null or later than now), started or not;
  - **Event / temporary Rings** only when the request came from that event: the request carries `eventRingId` when `source` is `EVENT` ❌;
  - each row: name, colour, member count (`memberCount` ❌, asked in [[FR-11 Rings Frontend Requirements|FR-11]]);
  - Rings where I'm a **delegated admin** at `MEMBER_MANAGER`, under their owner's name: ❌ ([[FR-16 Delegated Admins Frontend Requirements|FR-16]]); my own Rings only until then.
- **Picked to start:** my default Ring (`isDefault` ✅). Gemma's suggestion: not yet ([[S-89 Gemma AI Story|Gemma AI · S7]]).
- *+ New Ring for this person*: the New Ring wizard (s19), back to the sheet with the new Ring picked. App only.
- **Access window:** *Starts* and *Expires*, both optional (none = until removed). *Expires* must be after *Starts* and after now; checked on the phone before sending. The Ring's own *Expires* is shown next to them ("This Ring ends 12 Nov"): whichever comes first ends access.
- **Accept:** `POST /connections/requests/:id/accept { ringId, startsAt?, expiresAt? }` ❌. **One transaction**: the connection, the membership, `grantedRingId`. All three or none.
  - → 201 `{ connection: ConnectionEntity, membership: RingMemberEntity }`, so the app can open s47 without another call.
  - Already a member of that Ring: **treat as success** (create the connection, keep the membership, 201). If the server answers 409 `E_RING_MEMBER_01` instead, the app refreshes and goes on as if accepted.
- **No optimistic accept:** *Adding…* until the answer, then the card slides into the Ring (a fade with reduced motion) and s47 opens.
- *Not now*: closes; the request stays pending. *Decline* on the sheet: S6.
- **Errors:**

  | Answer | Show |
  |---|---|
  | 404 `E_RING_02` | the Ring is gone or isn't mine: "That Ring isn't available any more", the list refetches, nothing else picked |
  | 403 `E_RING_05` | no longer admin of that Ring: the same, and the list refetches |
  | 409 `E_RING_MEMBER_04` | "Can't add this person", never why; the sheet closes, the inbox refetches |
  | 409 `E_CONNECTION_REQUEST_02` (proposed) | "This request is no longer open"; the sheet closes, the row leaves |
  | 400 (window) | inline under *Starts* / *Expires* |

### [[Screen Index#s45|s45]] / [[Screen Index#s46|s46]] Decline (S6)

- `POST /connections/requests/:id/decline` ❌ → 200. No body.
- **No confirmation; *Undo* for 5 seconds, and the undo is on the phone:** the row leaves at once, the call is sent when the 5 seconds end. *Undo* cancels the call; nothing reached the server. If the app is closed inside the 5 seconds, nothing was sent and the request is still pending next time. No server undo needed.
- Already no longer open: 409 `E_CONNECTION_REQUEST_02` → nothing shown, the row stays gone.

### [[Screen Index#s17|s17]] Shared with me, and their card (S7, S10)

- `GET /rings/shared-with-me` ✅, **as people**, never with the Ring's name, colour or type (D-14). Today the API still returns the Ring's name; the app hides it. Asked in [[FR-11 Rings Frontend Requirements|FR-11]].
- One row per person, however many of their Rings I'm in (S10).
- Their card shows **the Ring they put me in first** (D-15): `GET /views/pin/:pinName` and `GET /views/user/:userId/perspectives` must put the **oldest membership first**, not the owner's default Ring ❌ (asked in [[FR-12 View As & Pin Views Frontend Requirements|FR-12]]). The app uses the oldest membership until then.
- The card's button reads *Connected* (`relationship.state`, s44).
- "Maya accepted your request" notification → her card: ❌ ([[FR-39 Notifications Frontend Requirements|FR-39]]).

### Contacts, from People ([[Screen Index#s38|s38]]) and Me ([[Screen Index#s68|s68]]) (S8)

- **List:** `GET /connections?q=&noAccess=&limit=&skip=` ❌ → `{ data: ConnectionEntity[], meta: { total } }`, by display name A→Z, `limit` ≤ 50.
- **`ConnectionEntity`** needs: `userId`, `displayName`, `pinName`, `avatarFileId`, `connectedAt`, `source` (as on a request), `ringCount` (how many of **my** Rings they're in; 0 shows **No access**).
- **Search** `q`: name or Pin name, **among my connections only**, never strangers; debounced, sent to the server, never filtered on the loaded page. No match: "No one by that name."
- `noAccess=true`: only connections in none of my Rings (s19's *No Ring yet* filter, S12).
- **Not listed:** people I disconnected; anyone in a block with me, either way; deleted accounts (D-25).
- Header: "Requests · N" (incoming `meta.total`) → s45.
- Empty: "No connections yet. Scan someone to start." A row → s47.
- Today the People tile opens Requests; it will open Contacts.

### [[Screen Index#s47|s47]] Connection detail (S9, S10, S11)

- **The person and where they are, in one call:** `GET /connections/:userId` ❌ →
  ```
  { userId, displayName, pinName, avatarFileId, connectedAt, source,
    mutualCount,                       // D-23
    memberships: [{ ringId, status, startsAt, expiresAt, createdAt }] }  // my Rings only
  ```
  `memberships` is the "which of my Rings" call that [[FR-09 Ring Members Frontend Requirements|FR-09]] also asks for: one ask, two screens.
- **Header:** name, Pin name, initials, "Connected 4 Nov", how we met (`source`).
- **IN RING · VISIBLE TO YOU ONLY:** every Ring of mine (`GET /rings` ✅) as a checklist, ticked from `memberships`, each with its window ("Until removed ›", "Until 12 Nov ›", "Lapsed 12 Nov ›"):
  - tick: `POST /rings/:ringId/members { userId }` ✅; untick: `DELETE …/members/:userId` ✅; the window: `PATCH …/members/:userId` ✅;
  - **a move is add, then remove**, so they're never in none by accident;
  - a failed call reverts the tick and refetches;
  - after each change: "What they see just changed", and a refetch.
- **WHAT THEY CAN SEE:** the fields of the **first** Ring they're in (D-15): the oldest **live** membership by `createdAt` → that Ring's projection, `GET /rings/:ringId/projection` ✅. Not the union of all their Rings. In none: "Nothing: they're a connection without access."
- **What they share with me:** `GET /views/user/:userId/perspectives` ✅; several = "View 1 / View 2", never Ring names. Empty: "Nothing shared with you right now."
- **Mutual connections:** "4 mutual connections" from `mutualCount`, **hidden at 0**, never names, never counting a blocked pair (D-23).
- **Events in common:** hidden in the MVP (D-23: Events aren't in the MVP).
- *Request meeting*: hidden (Meetings is v1). *Introduce*: shown disabled, "Not available yet".
- **The last Ring** (S11): unticking it asks **Remove from Rings** (they stay; *No access*; a tick later needs no new request) or **Disconnect**.
- **Disconnect** (also in ⋯ for someone in several Rings): `DELETE /connections/:userId` ❌, which **in one transaction** ends every membership of theirs in my Rings and the connection. The app does not loop over the Rings itself. → 204, back to Contacts. **Nothing is sent to them** ([[D-26 A disconnect is not announced]]).
- ⋯ → *Block* (S13).
- **Errors:**
  - 404 `E_CONNECTION_02` (proposed) on load: they disconnected, blocked me or deleted their account since. "This person isn't in your contacts any more", back to Contacts. One message for all three.
  - 409 `E_RING_MEMBER_04` on a tick: "Can't add this person".
  - 404 `E_RING_MEMBER_02` on untick or window: refetch.
  - 403 `E_RING_05`: that Ring's row is read-only.
- **A member who isn't a connection** (joined one of my Rings by code or invite, [[S-33 Ring Invitations & Join Story]]) opens here too ([[D-29 Connection detail opens a member who is not a connection]]): `GET /connections/:userId` answers them with `connectedAt: null` and their `memberships`, not a 404. The header reads "Member of your Rings" in place of "Connected …"; the checklist, the windows, what they can see and what they share with me work the same; there is **no *Disconnect*** (no connection to end), and unticking their last Ring removes them without the last-Ring question.

### [[Screen Index#s19|s19]] New Ring · step 2, and [[Screen Index#s15|s15]] a Ring's People tab (S12)

- **s19 step 2:** search my connections (`GET /connections?q=`), picked ones as chips, filters **All** / **No Ring yet** (`noAccess=true`), skippable. After `POST /rings` ✅ creates the Ring, one `POST /rings/:ringId/members { userId }` ✅ per pick.
  - **Some adds fail** (blocked since, `E_RING_MEMBER_04`): the Ring is still made; "Added 4 of 5. 1 couldn't be added." No names of who failed or why.
  - Today the step says people come later; it switches when the contacts list exists.
- **s15:** names, Pin names and photos for the roster in one call ❌ (asked in [[FR-09 Ring Members Frontend Requirements|FR-09]]); every row → s47 (`userId` ✅ on the roster), connections and members alike (D-29). *Move from a Ring*: reassign ✅.
- **Waiting on you:** join requests to that Ring only ([[S-33 Ring Invitations & Join Story]]), **never** connection requests: those have no Ring yet.
- *Scan someone in*: shown disabled, "Not available yet". **Not in the MVP** ([[D-28 Scan someone in is not in the MVP]]): no route is asked for it.

### Block and unblock: [[Screen Index#s44|s44]], [[Screen Index#s47|s47]], Blocked people on [[Screen Index#s68|s68]] (S13)

- Confirmation: "Block {name}? They stop seeing every Ring of yours and can't ask to connect. They aren't told."
- **From the card (s44)** there is no user id (D-10), so block takes what *Connect* takes: `POST /blocks { qrToken } | { pinName }` ❌. **From s47:** `POST /blocks { userId }` ❌. One route, exactly one of the three.
  - → 201. In one transaction: their memberships in my Rings and mine in theirs end, the connection closes, pending requests both ways close.
  - Blocking someone already blocked: 200, not an error.
- After a block, the app drops: the contacts list, both request lists, that connection's detail, Shared with me, and every cached view of that person. Then back to where I came from (s44 → back; s47 → Contacts).
- **Blocked people** (Me → s68): `GET /blocks?limit=&skip=` ❌ → `{ data: [{ id, displayName, pinName, avatarFileId, blockedAt }], meta: { total } }`: the name and Pin name **as I saw them** when I blocked. No user id needed: unblock by the block's id.
- **Unblock:** `DELETE /blocks/:id` ❌ → 204. **Restores nothing**: no connection, no membership, no request. The row leaves.
- Empty: "You haven't blocked anyone."

### Counts: Me ([[Screen Index#s68|s68]]), People ([[Screen Index#s38|s38]]), Home ([[Screen Index#s11|s11]]) (S14, S3)

- **Me, "N connections":** `meta.total` of `GET /connections?limit=1`, or the Counts call if [[FR-03 Counts Frontend Requirements|FR-03]] gets one first; either is fine. Accepted, each person once; *No access* still counts; disconnected, blocked, pending, declined and expired don't. **Hidden, not 0, until the route exists**: today Me shows a sample "218", which goes.
- **Pending incoming** on the People tile and in Home's Gemma card: `meta.total` of `GET /connections/requests?direction=incoming&limit=1`. Refetched on focus, **at most once a minute**, while the app is open (no push yet). No extra count route needed.
- Home shows no connection count.

### [[Screen Index#s69|s69]] Notifications (S3, S7)

- "Maya wants to connect" with *Choose a Ring* → s46 for its `requestId`; "Maya accepted your request" → her card. ❌ ([[FR-39 Notifications Frontend Requirements|FR-39]]).
- A notification for a request that is no longer open: s46 isn't opened; "This request is no longer open".
- A push carries the request id and the event, **no profile field and no Ring name**.
- No notification for a disconnect (D-26), a block, a removal or a deleted account (D-25).

### [[Screen Index#s62|s62]] After an event (S15) · v1

- The pending incoming requests created during the event: `GET /connections/requests?direction=incoming&eventRingId=` ❌, one s46 sheet each, *Not now* skips. Out of the MVP; listed so `source` / `eventRingId` are on the request from the start.

### [[Screen Index#s34|s34]] Badge: the auto-accept switch (open question)

- The app's switch starts *on*, but D-04 makes "approve each one" the default. Until auto-accept is defined (into which Ring?), the app **hides the switch**; nothing is sent. No backend need today.

### Account changes (S16)

- Every connection, request and block is kept and cached **by user id or by its own id, never by Pin name**; a new Pin name shows on the next fetch.
- A Pin name given up is free at once (D-06): a saved or recent `!pinname` may now open someone else, or the neutral 404.
- **Signing out** clears every Connections cache on the phone; nothing is sent.
- **Deleting an account** ends its connections, closes its requests both ways and removes its blocks, silently ([[D-25 A deleted account's connections, requests and blocks end silently]]). The app needs only that the deleted person's rows **stop being returned**, and that s47 answers the 404 above.

## Field map

| Shown | Source | Available |
|---|---|---|
| The card | `RingProfileViewEntity` from `/views/qr/:token`, `/views/pin/:pinName` | 🟡 pin ✅, qr ❌ |
| The card's button | `relationship { state, requestId }` on the views | ❌ |
| A request row (incoming) | `id`, `status`, `createdAt`, `expiresAt`, `note`, `source`, `eventName`, `eventRingId`, `from { userId, displayName, pinName, avatarFileId }` | ❌ |
| A request row (sent) | the same, with `to { displayName, pinName, avatarFileId }`, **no userId** | ❌ |
| Tab counts, badge counts | `meta.total` | ❌ |
| The Ring list on s46 | `GET /rings`: `id`, `name`, `colour`, `type`, `status`, `expiresAt`, `isDefault`, `memberCount` | 🟡 `memberCount` ❌ |
| A contact | `userId`, `displayName`, `pinName`, `avatarFileId`, `connectedAt`, `source`, `ringCount` | ❌ |
| Connection detail | the contact plus `mutualCount`, `memberships[]`; `connectedAt: null` for a member who isn't a connection | ❌ |
| What they can see | `GET /rings/:ringId/projection` of the oldest live membership | ✅ |
| What they share with me | `GET /views/user/:userId/perspectives` | ✅ (order ❌, FR-12) |
| Blocked people | `id`, `displayName`, `pinName`, `avatarFileId`, `blockedAt` | ❌ |
| Photos everywhere | `avatarFileId` → signed link (D-16) | ❌ initials until then |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| The card by Pin name | `GET /views/pin/:pinName` | ✅ | [[S-23 Connections Story\|S1]] |
| The card by scanned code | `GET /views/qr/:token` | ❌ | S1 · [[FR-18 Badge & QR Frontend Requirements\|FR-18]] |
| **Where I stand with the person on the card** | `relationship` on both views | ❌ | S2 · D-10 *Still open* |
| Send, with the token or the Pin name, and a note; one pending request per pair | `POST /connections/requests { qrToken \| pinName, note? }` | ❌ | S2 · D-10, D-17, D-24 |
| Ask again from a Sent row | `POST /connections/requests { againFor, note? }` | ❌ | S4 · D-17 |
| Incoming list, paged, with `meta.total` | `GET /connections/requests?direction=incoming` | ❌ | S3 |
| Sent list with status; declined and expired kept 30 days | `GET /connections/requests?direction=sent` | ❌ | S4 · D-13, D-27 |
| Cancel | `DELETE /connections/requests/:id` | ❌ | S2, S4 |
| Accept into a Ring with a window, one transaction | `POST /connections/requests/:id/accept { ringId, startsAt?, expiresAt? }` | ❌ | S5 |
| Decline | `POST /connections/requests/:id/decline` | ❌ | S6 · D-13 |
| The picker | `GET /rings` | ✅ | S5 |
| Member count on the picker | `memberCount` on `GET /rings` | ❌ | S5 · [[FR-11 Rings Frontend Requirements\|FR-11]] |
| Rings I administer, under their owner | — | ❌ | S5 · [[FR-16 Delegated Admins Frontend Requirements\|FR-16]] |
| Shared with me as people | `GET /rings/shared-with-me` without Ring names | 🟡 | S7 · D-14 · [[FR-11 Rings Frontend Requirements\|FR-11]] |
| First Ring first | `/views/pin`, `/perspectives` ordered by oldest membership | ❌ | S7 · D-15 · [[FR-12 View As & Pin Views Frontend Requirements\|FR-12]] |
| What they share with me | `GET /views/user/:userId/perspectives` | ✅ | S9, S10 |
| Contacts, search, *No access* filter | `GET /connections?q=&noAccess=` | ❌ | S8, S12 |
| Connection detail, with my Rings for them and the mutual count; members who aren't connections too | `GET /connections/:userId` | ❌ | S9 · D-23, D-29 · [[FR-09 Ring Members Frontend Requirements\|FR-09]] |
| Add to a Ring, window, remove, move | `POST`, `PATCH`, `DELETE /rings/:ringId/members…`, `…/reassign` | ✅ | S9, S11, S12 |
| What they can see | `GET /rings/:ringId/projection` | ✅ | S9 |
| Disconnect, one transaction, not announced | `DELETE /connections/:userId` | ❌ | S11 · D-15, D-26 |
| Names and photos on the roster | — | ❌ | S12 · [[FR-09 Ring Members Frontend Requirements\|FR-09]] |
| Block from the card or from detail | `POST /blocks { qrToken \| pinName \| userId }` | ❌ | S13 |
| Blocked people, unblock | `GET /blocks`, `DELETE /blocks/:id` | ❌ | S13 |
| Connections count on Me | `meta.total` of `GET /connections`, or [[FR-03 Counts Frontend Requirements\|FR-03]] | ❌ | S14 |
| A deleted account leaves every list | the deletion ends connections, requests and blocks | ❌ | S16 · D-25 |
| Requests during an event | `eventRingId` filter on the incoming list | ❌ | S15 (v1) |
| Push on request and accept | — | ❌ | S3, S7 · [[FR-39 Notifications Frontend Requirements\|FR-39]] |
| Photos | signed links | ❌ | D-16 |

## Behaviour expectations

- **Refetch, no realtime:** s45 on open, on pull and after every write; s47 after every tick, window, disconnect; the contacts list on open and after s47 changes something; the pending count on focus, at most once a minute. Never patch "what they see" on the phone.
- **Caching keys:** a card by (viewer, token) or (viewer, Pin name), with its `relationship`; requests by (viewer, direction); a contact and its detail by (viewer, userId); blocks by viewer. **On a block, drop all of them.** On sign-out, drop everything.
- **Paging:** `{ data, meta: { total } }`, `limit` ≤ 50, `skip`, infinite scroll; requests newest first; contacts A→Z by display name; blocks newest first.
- **Optimistic:** *Cancel* only (put back on failure). *Decline* waits 5 seconds on the phone (Undo), then sends. **Never** accept, block or disconnect.
- **Offline:** nothing queued. Every write says it couldn't be sent and leaves the screen as it was.
- **Identity:** the requester's side never holds the other person's user id until they are connected (D-10). The app sends what it opened the card with, or the request's id.
- **One message for every "not available":** no copy, no code and no state tells a block, a deleted account, a freed Pin name, an expired token or an unshared Ring apart.
- **Silence:** no notification, copy or state tells anyone they were disconnected (D-26), blocked, removed from a Ring, or that an account was deleted (D-25).
- **Notes:** trimmed; ≤ 200; shown as plain text, never as a link.

## Error states the UI must handle

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] puts `ErrorCode` on the wire, the app branches on status and endpoint ([[Frontend Contract]]). The **proposed** codes are names for the backend to keep or rename; the meaning is what's asked.

| Status | ErrorCode | Where | Show |
|---|---|---|---|
| 404 | `E_RING_ACCESS_01`, `E_RING_ACCESS_02` | the views, send, block from the card | "This profile isn't available to you"; never "blocked" |
| 409 | `E_CONNECTION_01` (proposed) already connected | send | the button becomes *Connected*; no error |
| 409 | `E_CONNECTION_REQUEST_03` (proposed) they already asked you, with their `requestId` (D-24) | send | open s46 for their request |
| 409 | `E_CONNECTION_REQUEST_02` (proposed) no longer open: answered, cancelled or expired | cancel, accept, decline | refetch; on s46: "This request is no longer open" |
| 404 | `E_CONNECTION_REQUEST_01` (proposed) no such request, or not mine | cancel, accept, decline | refetch, no error |
| 404 | `E_CONNECTION_02` (proposed) not a connection or member any more | detail, disconnect | "This person isn't in your contacts any more", back to Contacts |
| 404 | `E_BLOCK_01` (proposed) no such block | unblock | refetch, no error |
| 404 | `E_RING_02` | accept, a tick | "That Ring isn't available any more"; refetch the Rings |
| 403 | `E_RING_05` | accept, a tick, a window | that Ring is read-only; refetch |
| 409 | `E_RING_MEMBER_04` | accept, a tick, s19 adds | "Can't add this person"; never why |
| 409 | `E_RING_MEMBER_01` | accept, a tick | already in it: treat as done, refetch |
| 404 | `E_RING_MEMBER_02` | untick, window | refetch s47 |
| 400 | validation (`message` an array) | note over 200, window order, both `qrToken` and `pinName` sent | inline on the field |
| 401 | `E_AUTH_04` | all | sign in again |
| — | offline, 5xx | all writes | "Couldn't … Try again."; nothing queued |

## Blocked by

The story is approved and its open questions are decided (D-24 to D-29), so this list isn't blocked by it. Rows wait on:

- **Introduce** (s47): disabled until defined; proposed v1.
- **Auto-accept on the badge** (s34): hidden until defined.
- [[S-37 Badge & QR Story|Badge & QR · S13–S18]]: `GET /views/qr/:token`. Scanning, and *Connect* or *Block* after a scan.
- [[S-89 Gemma AI Story|Gemma AI · S7]]: the suggested Ring on s46.
- [[S-31 Delegated Admins Story]]: Rings I administer on s46 and s47.
- [[S-96 Notifications Story]]: s69 and push.
- [[S-06 Files Upload Story]] / D-16: photos.
- [[S-87 Error Contract Story|Error Contract · S4–S8]]: the codes above are by status until then.

## Sign-off

- Approved by: — · on: —
