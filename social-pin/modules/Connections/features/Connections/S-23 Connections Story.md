---
id: S-23
type: story
module: connections
feature: connections
status: approved
scope: feature
screens: [s11, s15, s17, s19, s38, s42, s43, s44, s45, s46, s47, s62, s68, s69]
approvedBy: "Omar Fostok"
approvedAt: 2026-11-04
owner: "Omar Fostok"
depends: ["ND-10 How Connect addresses the scanned person"]
affects: ["S-16 Ring Members Story", "S-18 Rings Story", "S-19 View As & Pin Views Story", "S-37 Badge & QR Story", "S-03 Counts Story", "S-96 Notifications Story", "S-42 Discover Hub & Search Story"]
related: ["D-04 Ring settings at launch and their defaults", "D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-18 Ring names shown when joined knowingly", "ND-10 How Connect addresses the scanned person", "ND-23 Mutual connections and events in common", "Ring Access Model"]
pending: []
created: 2026-10-18
updated: 2026-11-04
tags: [story, story/approved, module/connections, layer/business]
---

# Connections · User Story

> ⚠ Affected by [[D-23 A count of mutual connections, events where both were visible]] (2026-11-04): ND-23 decided: s47 shows a count of mutual connections, never names (hidden at zero), and the events we were both visible at (hidden until Events ship). S9 no longer waits on ND-23.

> ⚠ Affected by [[D-10 Connect sends what the requester already has]] (2026-11-04): ND-10 decided, option 3: Connect sends { qrToken } after a scan or { pinName } after a lookup; S2 no longer waits on ND-10.

**Feature:** [[F-14 Connections]] · **Status:** Approved 2026-11-04 by Omar Fostok · **Frontend Requirements:** [[FR-14 Connections Frontend Requirements]] · **Backend Integration:** not yet · **Verified by:** [[Connections QA Backend]], [[Connections QA Frontend]]

> **Rewritten 2026-11-04.** The earlier draft had two sets of parts covering the same ground (S1–S7, and S8–S26 merged from T-021…T-025) and two empty ones (Block, Introduce). This version is one set, ordered as the journey happens, checked against the design (Wireframe Brief §4.5, §5, §6.4, §11, the prototype), the backend as it is today (BD-14: no routes yet), the decisions D-13, D-14, D-15, D-17, D-18, and every screen of the app that a connection touches. *Where the design disagrees* lists what the designer has to redraw.

Two people met. One of them wants to keep seeing the other after the moment passes. In Social Pin that is an **access request**, not a follow: the requester asks to be let in, the receiver decides **which of their Rings** the requester lands in, and from then on the requester sees exactly what that Ring shares, and never which Ring it is ([[D-14 Shared with me lists people, never the Ring]]). A request is *pending*, *accepted*, *declined*, *cancelled* or *expired* (30 days), and the requester sees which ([[D-13 The requester sees a declined request]], [[D-17 Requests expire after 30 days, optional note, ask again at once]]). A person can sit in several of the receiver's Rings; a connection outlives access unless the receiver disconnects ([[D-15 Several Rings per connection, remove or disconnect]]). There is no feed, no follower count on show, no "following back".

**What exists today.** The backend has the tables (`Connection`, `ConnectionRequest`, `UserBlock`, `ContactNote`, `RingQrToken`) and **no route** for connections, requests, blocks or QR resolution ([[BD-14 Connections Backend Delivery]]: "Endpoints: none yet"). What Connections can already use: the Ring members routes (add, change the window, move, remove), the views (`/views/pin/:pinName`, `/views/ring/:ringId`, `/views/user/:userId/perspectives`) and `GET /rings`. In the app, every connection screen is sample data except the person card on Shared with me, which is real.

## Persona

Two people on one journey.

- **The requester**, a personal user who has just scanned someone's badge (s43 → s44), looked up a `!pinname` on Discover (s38), or seen someone in PinCast results (s42). They want to be let in.
- **The receiver**, who owns the Rings. They see the request (Home s11, Notifications s69, Requests s45), choose a Ring for the person (s46), and later manage them from Connection detail (s47), the contacts list, a Ring's People tab (s15) and the New Ring wizard (s19).

The same person is both, with different people, on the same day.

## Stories

### S1 · Find the person ([[Screen Index#s43|s43]], [[Screen Index#s44|s44]], [[Screen Index#s38|s38]], [[Screen Index#s42|s42]])

**As a** requester **I want** to open the card of the person I just met **so that** I can see what they share and ask to connect.

Acceptance criteria:
- [ ] **By scan:** the camera reads a Social Pin code and resolves it through `GET /views/qr/:token` ([[S-37 Badge & QR Story|Badge & QR · S13–S18]]). Not available yet: no QR route exists; the app's reader (s43) is a timer that opens a sample card.
- [ ] **By Pin name:** `!pinname` on Discover resolves through `GET /views/pin/:pinName` (exists), exact and case-insensitive ([[S-42 Discover Hub & Search Story]]).
- [ ] **From PinCast results** (s42): a row opens the same card. Not available yet (no PinCast API).
- [ ] The card (s44) shows what their Ring shares with me (`RingProfileViewEntity`) and never the Ring's name, colour or type; the note "You see what their Ring shares, never which Ring you are in."
- [ ] Every failure reads the same, "This profile isn't available to you": no such Pin, not shared, blocked either way, Ring gone or not live, token rotated or revoked (one 404, `E_RING_ACCESS_01` / `E_RING_ACCESS_02`). Nothing says "blocked".
- [ ] A code that isn't a Social Pin code reads "Not a Social Pin code" on the phone, without a call (S-37 S15).
- [ ] **My own code or Pin name** opens View as, marked as a preview, and offers no *Connect* (S-37 S16, S-42).
- [ ] *Save for later* keeps the card in a recent list on the phone and sends nothing (S-37 S4).

### S2 · Ask to connect ([[Screen Index#s44|s44]])

**As a** requester **I want** one tap to ask, with a line saying how we met **so that** they remember me and let me in.

Acceptance criteria:
- [ ] *Connect* sends `POST /connections/requests` addressed to the person on the card. **How it addresses them is [[ND-10 How Connect addresses the scanned person]]** (open; recommended: send what I already have, `{ qrToken }` after a scan or `{ pinName }` after a lookup). Until it's decided, *Connect* is shown disabled with "Not available yet". Not available yet: the route.
- [ ] An optional **note** of up to **200 characters** ("We met at TechSummit"), with a live counter; longer is refused before sending ([[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- [ ] After sending, the button reads **Requested** and stays so when I come back to the card; tapping it offers *Cancel request* (S4).
- [ ] Sending while one of mine is already pending to this person returns that same request (no duplicate).
- [ ] Someone **already connected** with me: the card shows *Connected* instead of *Connect* and sends nothing.
- [ ] **They already asked me** (a pending request from them): the card shows *Accept* instead of *Connect*, which opens S5 for their request (as PinCast does, [[S-45 PinCast & Nearby Story]]). What the server does if both send at the same moment is open (*Open questions*).
- [ ] A blocked pair, either way: the request fails with the same 404 as the card (S1); the button returns to *Connect*.
- [ ] After a **decline** or an **expiry**, the button reads *Declined* or *Expired* with *Connect* again, which sends a **new** request at once; no waiting period.
- [ ] Offline: *Connect* says the request couldn't be sent and stays *Connect*; nothing is queued.

### S3 · See who wants to connect ([[Screen Index#s45|s45]], [[Screen Index#s11|s11]], [[Screen Index#s69|s69]])

**As a** receiver **I want** my incoming requests in one place, with who, how we met and their note **so that** nothing waits on me unnoticed.

Acceptance criteria:
- [ ] `GET /connections/requests?direction=incoming` lists **pending** requests, newest first, paged (`limit` ≤ 50, `meta.total`). Not available yet.
- [ ] Each row: the person's `displayName`, `pinName`, photo (initials until photos load, [[D-16 Files load from signed links that expire in 15 minutes]]), when it was sent, **where from** when known (scan, Pin name, PinCast, an event), and the **note**.
- [ ] The *Incoming* tab reads "Incoming · N" from `meta.total`.
- [ ] *Accept* opens S5. *Decline* (✕) is S6. Tapping the row opens what they share with me, if anything (S10).
- [ ] A request unanswered for **30 days expires** and leaves the list.
- [ ] Empty: "No requests yet. Share your badge to get found."
- [ ] The list refetches when the screen opens and after every accept, decline or cancel; a row already answered, cancelled or expired elsewhere leaves without an error.
- [ ] **Where I hear about one:** a count on the People tile (Discover s38) and in Home's Gemma card (s11); a "wants to connect" row in Notifications (s69) with *Choose a Ring* → S5. Until push exists, counts refetch on focus at most once a minute ([[S-96 Notifications Story]]). Not available yet.

### S4 · My sent requests and what happened to them ([[Screen Index#s45|s45]])

**As a** requester **I want** to see my requests and take one back **so that** I know where I stand.

Acceptance criteria:
- [ ] `GET /connections/requests?direction=sent` lists my requests with their **status**: *Pending*, *Declined* or *Expired* ([[D-13 The requester sees a declined request]]). Accepted and cancelled ones leave the list. Not available yet.
- [ ] *Declined* and *Expired* each offer *Connect* again (a new request, S2).
- [ ] *Cancel* on a pending one (`DELETE /connections/requests/:id`) removes it at once, from my list and from their inbox.
- [ ] Cancelling one that was answered or expired a moment ago refreshes the list instead of failing.
- [ ] The tab reads "Sent · N". Empty: "You haven't asked anyone yet."
- [ ] A **block** never shows here as a decline: the request reads as *Pending* until it expires, or disappears; it never says "blocked" (S13).

### S5 · Accept into a Ring ([[Screen Index#s46|s46]])

**As a** receiver **I want** to accept and choose the Ring they go into **so that** they see the version of me I meant.

Acceptance criteria:
- [ ] A sheet titled "Add Maya to a Ring", "She will only see what that Ring shares", with the request's **note**.
- [ ] It lists my **live** Rings from `GET /rings` (exists): name, colour, member count; Rings that have **ended** are not offered; **temporary** (Event) Rings are offered only when the request came from that event. Rings where I'm a delegated admin at `MEMBER_MANAGER` level are offered too, under their owner's name.
- [ ] One Ring is picked to start: **my default Ring** (Gemma's suggestion, "Gemma suggests TechSummit '26", is not available yet, [[S-89 Gemma AI Story|Gemma AI · S7]]).
- [ ] *+ New Ring for this person* opens the New Ring wizard and comes back to the sheet with the new Ring picked.
- [ ] An optional access window, **Starts** and **Expires**, for this membership; none means until removed ([[S-16 Ring Members Story|Ring Members · S3]]). The Ring's own Expires still applies; whichever comes first ends access.
- [ ] *Accept & add to Ring* sends the request id, the `ringId` and the window; **in one transaction** the server creates the connection, adds them as a member of that Ring and records `grantedRingId`. All three or none. Not available yet.
- [ ] No optimistic accept: the sheet shows *Adding…* until the server answers, then opens Connection detail (S9).
- [ ] Motion: the person's card **slides into the chosen Ring** on the sheet; reduced motion fades.
- [ ] *Not now* closes the sheet; the request stays pending.
- [ ] Errors, quiet and specific:
  - the Ring was deleted or isn't mine any more: 404 `E_RING_02`, the list refetches;
  - a block exists either way: 409 `E_RING_MEMBER_04`, "Can't add this person", never why;
  - they're already in that Ring: 409 `E_RING_MEMBER_01`, treated as done;
  - the request was cancelled, expired or already answered: "This request is no longer open", the sheet closes and the row leaves the inbox.

### S6 · Decline ([[Screen Index#s45|s45]], [[Screen Index#s46|s46]])

**As a** receiver **I want** to decline **so that** the request goes away without a connection.

Acceptance criteria:
- [ ] *Decline* (✕ on the row, or on the sheet) closes the request as **declined**: no connection, no membership. Not available yet.
- [ ] No confirmation; an *Undo* for a few seconds instead.
- [ ] The requester **sees** the decline (S4) and may ask again straight away; to stop that, the receiver blocks them (S13), which never reads as a decline.

### S7 · What the requester gets ([[Screen Index#s17|s17]])

**As a** requester who was accepted **I want** to find their card again **so that** the connection is useful.

Acceptance criteria:
- [ ] The request leaves my Sent list; the card's button reads *Connected*.
- [ ] They appear on **Shared with me** (s17) as a **person** ("Maya Fadel", `!mayafadel`, initials), never with the Ring's name, colour or type ([[D-14 Shared with me lists people, never the Ring]]). Exists in the app today; the API still returns the Ring's name, which [[F-11 Rings]] has to stop.
- [ ] Their card shows **the version from the Ring they put me in first** when I'm in several ([[D-15 Several Rings per connection, remove or disconnect]]). Not available yet on the server: `/views/pin` and the perspectives put the owner's default Ring first; the app stands in with the oldest membership.
- [ ] `grantedRingId` reaches me in no response.
- [ ] A notification "Maya accepted your request" opens her card. Not available yet ([[S-96 Notifications Story]]).

### S8 · My contacts ([[Screen Index#s38|s38]], [[Screen Index#s68|s68]])

**As a** user **I want** everyone I'm connected with in one searchable list **so that** I find someone without scanning them twice.

Acceptance criteria:
- [ ] Reached from the **People** tile on Discover (s38) and from **Connections** on Me (s68); the Requests inbox (S3) is one tap from its header ("Requests · 3"). Today the People tile opens Requests.
- [ ] `GET /connections?q=&limit=&skip=` lists my connections by display name, paged (`limit` ≤ 50, `meta.total`). Not available yet.
- [ ] Each row: `userId`, `displayName`, `pinName`, photo, when we connected, and **No access** when they're in none of my Rings (after *Remove from Rings*, S11).
- [ ] Search (`q`) matches name or Pin name **within my own connections only**; it never finds strangers. No results: "No one by that name."
- [ ] People I **disconnected**, or who **blocked** me, aren't listed.
- [ ] Empty: "No connections yet. Scan someone to start."
- [ ] A row opens Connection detail (S9).

### S9 · Connection detail ([[Screen Index#s47|s47]])

**As a** receiver **I want** one screen per person **so that** I see where they sit, what they see, and change it.

Acceptance criteria:
- [ ] Header: the person (name, Pin name, initials), "Connected 4 Nov" and how we met when known.
- [ ] **IN RING · VISIBLE TO YOU ONLY**: every Ring of mine as a **checklist** ([[S-16 Ring Members Story|Ring Members · S5]]). Ticked = they're in it, each with its window ("Until removed ›", "Until 12 Nov ›", "Lapsed 12 Nov ›"). Tick adds (`POST /rings/:ringId/members`), untick removes (`DELETE …/members/:userId`), a window opens `PATCH …/members/:userId` (all exist). A move is add, then remove, so they're never in none by accident. Not available yet: one call that says which of my Rings a person is in (today it would be one roster call per Ring).
- [ ] The copy after a change: "What they see just changed." Motion: the chip moves; reduced motion fades.
- [ ] **WHAT THEY CAN SEE**: the fields of the **first** Ring they're in (D-15), the same rule the server uses, not the union of all their Rings. In no Ring: "Nothing: they're a connection without access."
- [ ] **What they share with me**: their card through `GET /views/user/:userId/perspectives` (exists); several perspectives are "View 1 / View 2", never Ring names ([[S-19 View As & Pin Views Story|View As · S5]]). Empty: "Nothing shared with you right now."
- [ ] Events in common and mutual connections are **hidden** (not empty) until [[ND-23 Mutual connections and events in common]] is decided.
- [ ] *Request meeting* is hidden in the MVP (Meetings is v1). *Introduce* is shown disabled, "Not available yet" ([[#Open questions]]).
- [ ] The ⋯ menu: *Block* (S13).
- [ ] The screen refetches after every change; a 409 `E_RING_MEMBER_04` on a tick (they blocked me since) reads "Can't add this person".

### S10 · Someone I'm connected with, from the other side ([[Screen Index#s17|s17]], [[Screen Index#s47|s47]])

**As a** user connected both ways (I'm in their Rings and they're in mine) **I want** one person, not two **so that** I'm not confused by two rows.

Acceptance criteria:
- [ ] One connection per pair: Connection detail shows both my Rings for them (S9) and what they share with me.
- [ ] On Shared with me they're one person row however many of their Rings I'm in.

### S11 · Remove from Rings, or Disconnect ([[Screen Index#s47|s47]])

**As a** receiver **I want** to take away access without losing the connection, or to end it **so that** I control both separately.

Acceptance criteria:
- [ ] Unticking a Ring that isn't their last asks nothing.
- [ ] Unticking the **last** Ring asks: **Remove from Rings** (they stay a connection with no access, listed as *No access*; I can tick a Ring again without a new request) or **Disconnect** (the connection ends, they leave my contacts, getting back in takes a new request) ([[D-15 Several Rings per connection, remove or disconnect]]).
- [ ] *Disconnect* is also in the ⋯ menu for someone in several Rings: it removes them from all of them first.
- [ ] Not available yet: the disconnect route; whether the other person is told is open (D-15 *Still open*).
- [ ] Either way, nothing reaches the other person beyond losing access: no notification "you were removed".

### S12 · Connections everywhere a person is picked ([[Screen Index#s19|s19]], [[Screen Index#s15|s15]])

**As a** Ring owner **I want** my connections where I add people to a Ring **so that** I don't have to scan people I already know.

Acceptance criteria:
- [ ] **New Ring, step 2** (s19): search my connections (S8's list), picked ones as chips; filters **All** and **No Ring yet** (connections in none of my Rings); each pick is a `POST /rings/:ringId/members` after the Ring is created; skippable ([[S-18 Rings Story|Rings · S4]]). Today the step says connections come later.
- [ ] **A Ring's People tab** (s15): members by name, Pin name and photo, in one request for the whole roster (the members route gives `userId` only today, [[S-16 Ring Members Story|Ring Members · S1]]); a row opens Connection detail (S9). *Move from a Ring* is the reassign route (exists). *Scan someone in* opens the scanner, and the person scanned is added straight to this Ring once ND-10 allows it.
- [ ] The People tab's **Waiting on you** shows join requests to that Ring only (invitations and codes, [[S-16 Ring Members Story|Ring Members · S9]]), **not** connection requests: a connection request has no Ring until I choose one (S5).

### S13 · Block and unblock ([[Screen Index#s44|s44]], [[Screen Index#s47|s47]], [[Screen Index#s68|s68]])

**As a** user **I want** to block someone so they lose every view of me at once, and to undo it later **so that** I'm safe without a fuss.

Acceptance criteria:
- [ ] *Block* is in the ⋯ menu on their card (s44) and on Connection detail (s47), with a confirmation: "Block Maya? She stops seeing every Ring of yours and can't ask to connect. She isn't told."
- [ ] `POST /blocks/:userId`: their memberships in my Rings and mine in theirs end, the connection closes, pending requests between us close. Not available yet; `UserBlock` is already honoured by the access engine.
- [ ] From then on each of us reads the other as "This profile isn't available to you" (S1); a request between us fails the same way (S2); nothing says "blocked".
- [ ] **Blocked people** on Me (s68): the list with *Unblock* (`DELETE /blocks/:userId`). Unblocking **restores nothing**; a new request is needed.

### S14 · Counts ([[Screen Index#s68|s68]], [[Screen Index#s38|s38]])

**As a** user **I want** honest numbers **so that** I trust them.

Acceptance criteria:
- [ ] Me shows **N connections**: accepted, each person once; *Remove from Rings* still counts, *Disconnect* doesn't; pending, declined and expired requests don't ([[S-03 Counts Story|Counts · S11]]). **Hidden, not "0" and not a sample**, until the backend has connections. Today Me shows a sample "218".
- [ ] Home shows no connection count ([[S-03 Counts Story|Counts · S4]]).
- [ ] The pending incoming count (S3) on the People tile.

### S15 · After an event ([[Screen Index#s62|s62]]) · v1

**As a** receiver closing an event **I want** to place the people I met before the Event Ring ends **so that** none of them is lost.

Acceptance criteria:
- [ ] *Review N* walks through the pending requests created during the event's window, one S5 sheet each; *Not now* skips. Out of the MVP with the Events features; listed so the routes are built to allow it.
- [ ] Whatever happens to the Event Ring, the people stay in my contacts; only their access changes.

### S16 · When the account or the Pin name changes

**As a** user **I want** connections to follow the person, not a name **so that** nothing points at the wrong person.

Acceptance criteria:
- [ ] Connections and requests are kept by **user id**, never by Pin name; a new Pin name shows everywhere on the next fetch.
- [ ] A Pin name given up is free at once ([[D-06 Yearly rename, old name freed, case-insensitive]]): a saved `!pinname` may lead to someone else; a stale recent search shows the neutral 404 (S1).
- [ ] **Deleting an account** ends its connections, closes its requests both ways and its blocks; the other person loses the row without being told. Not decided yet (*Open questions*).
- [ ] Signing out keeps everything on the server; only the phone's caches clear.

## States and motion the design asks for

- **s44:** resolved card; *Connect* → *Sending…* → *Requested*; *Declined* / *Expired* + *Connect* again; *Connected*; *Accept* (they asked me); not available (neutral 404); my own card (preview, no *Connect*).
- **s45:** Incoming · N / Sent · N; a row with where from and the note; Sent rows with *Pending*, *Declined*, *Expired*; empty per tab; a row leaving after an answer; *Undo* after a decline.
- **s46:** the Ring list with one picked; the note; the window; *Adding…*; the card sliding into the Ring; the four errors of S5.
- **s47:** loading; the checklist with windows; the last-Ring choice; "What they see just changed"; what they share with me; *No access*.
- **Contacts:** list, search with no results, empty, *No access* marker.
- **Me:** the connections count hidden until real; Blocked people.
- No photos until files load (D-16): initials everywhere.
- Reduced motion: every slide becomes a fade.

## Where the design disagrees (for the designer)

| Screen | What's drawn | What the decisions need |
|---|---|---|
| s44, s42 | *Connect* opens s46, the **receiver's** accept sheet | *Connect* sends a request on the spot and turns into *Requested* (S2) |
| s44 | No note field | A note, up to 200 characters, with a counter (D-17) |
| s44 | Only the resolved card | *Requested*, *Declined*, *Expired*, *Connected*, *Accept*, not available, my own card |
| s45 | *Sent · 5* goes nowhere; no note; no *Undo* | A Sent list with *Pending* / *Declined* / *Expired*, *Cancel*, *Connect* again (D-13, D-17); the note on incoming rows |
| s46 | A full screen | The brief asks for a bottom sheet; either is fine, but one is needed. Plus the note, the window, *Decline* |
| s47 | Only *Revoke access* | The checklist, windows, *Remove from Rings* / *Disconnect* (D-15), *Block* in ⋯ |
| s47 | "2 events in common", "4 mutual connections" | Hidden until ND-23 |
| s17 | Ring names ("Acme Team") | People, never the Ring (D-14) |
| s15 | "Waiting on you" shows scans of my badge in a Ring | Join requests to that Ring only (S12) |
| s62 | *Review 4* as a group | One s46 sheet per person (S15) |
| s68 | "218 connections", no Contacts, no Blocked | Count hidden until real; Contacts and Blocked people entries |
| — | Contacts list, Blocked people: not drawn | Both needed for the MVP (S8, S13) |

## What the backend has to build

Not available yet, in the order the journey needs them:

1. **Addressing** ([[ND-10 How Connect addresses the scanned person]]) and the QR resolve `GET /views/qr/:token` ([[S-37 Badge & QR Story]]).
2. **Requests:** `POST /connections/requests { to, note? }`; `GET /connections/requests?direction=incoming|sent` with the person, `status`, `note`, `createdAt`, where from; `DELETE /connections/requests/:id`; the 30-day expiry; no duplicate while pending.
3. **Accept and decline:** `POST /connections/requests/:id/accept { ringId, startsAt?, expiresAt? }` (one transaction: connection, membership, `grantedRingId`) and `…/decline`.
4. **Contacts:** `GET /connections?q=` with the person and *no access*; one call for which of my Rings a person is in.
5. **Disconnect:** a route; and whether the other person is told.
6. **Blocks:** `POST/DELETE /blocks/:userId`, `GET /blocks`; ending memberships both ways and pending requests.
7. **Names on the roster:** `displayName`, `pinName`, photo per `RingMemberEntity`, or one join call.
8. **First-Ring order:** `/views/pin` and the perspectives return the oldest membership first (D-15), not the default Ring.
9. **Shared with me without Ring names** (D-14, on [[F-11 Rings]]).
10. **Counts:** connections on Me; pending incoming.
11. **Notifications:** request received, accepted (push carries no profile fields or Ring names).
12. **Request error codes** (none defined yet): not found, already connected, already pending, no longer open.

## Rules the backend already enforces

- A block is mutual and overrides membership both ways ([[Ring Access Model]]); `POST /rings/:ringId/members` refuses a blocked pair with 409 `E_RING_MEMBER_04`.
- "Not shared", "blocked" and "no such Pin" are one 404 (`E_RING_ACCESS_01`); a Ring not live is `E_RING_ACCESS_02` with the same message.
- `RingProfileViewEntity` carries no `userId`, `ringId` or owner id.
- Members are managed only by the owner or a delegated admin at `MEMBER_MANAGER` level (403 `E_RING_05`).
- Re-adding someone removed or lapsed reactivates their membership; reassign moves them in one transaction (both Rings must have the same owner, 400 `E_RING_07`); remove marks the row `REMOVED`, never deletes it.
- The owner can't add themselves (400 `E_RING_MEMBER_03`); an active member again is 409 `E_RING_MEMBER_01`.
- Access is checked on every request against both windows, the Ring's and the membership's.

## Open questions

- [[ND-10 How Connect addresses the scanned person]] — open; blocks S2 and the QR resolve. Recommended: `{ qrToken }` after a scan, `{ pinName }` after a lookup.
- [[ND-23 Mutual connections and events in common]] — open; S9 hides both until decided.
- **Both ask each other** (new, needs a decision card): when A asks B while B's request to A is pending, does the server accept B's request, merge them, or keep both? Proposed: the second *Connect* shows *Accept* (S2), so it never happens from the app; the server keeps one pending request per pair.
- **Deleting an account** (new, needs a decision card): what happens to its connections, the requests it sent and received, and the blocks it made or received. Proposed: all end; the other person loses the row silently.
- **Disconnect:** the route, and whether the other person is told (D-15 *Still open*). Proposed: not told.
- How long a declined or expired request stays on Sent, and whether the receiver is reminded before one expires (D-17 *Still open*). Proposed: 30 days on Sent; no reminder in the MVP.
- **Introduce** (s47): what it means (a request on someone's behalf, or a suggestion). Disabled until decided; proposed v1.
- **Auto-accept on the badge** (s34): the app's switch starts *on*; D-04 makes "approve each one" the default. Either the switch starts off, or what auto-accept does (into which Ring) needs a decision. Proposed: off, and hidden until defined.
- The suggested Ring on s46: [[S-89 Gemma AI Story|Gemma AI · S7]]; the default Ring until then.

## Log

- 2026-11-04 · flagged [[BD-09 Ring Members Backend Delivery]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[BI-05 Ring Access Engine Backend Integration]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[BI-06 Ring Members Backend Integration]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[BI-09 View As & Pin Views Backend Integration]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[D-13 The requester sees a declined request]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[D-14 Shared with me lists people, never the Ring]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[D-15 Several Rings per connection, remove or disconnect]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[D-17 Requests expire after 30 days, optional note, ask again at once]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[F-03 Counts]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[F-14 Connections]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-03 Counts Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-08 Ring Access Engine Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-09 Ring Members Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-11 Rings Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-12 View As & Pin Views Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-14 Connections Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-16 Delegated Admins Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-18 Badge & QR Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-19 Discover Hub & Search Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-20 PinCast & Nearby Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-22 Events Before Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[FR-25 Post-Event Frontend Requirements]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[ND-10 How Connect addresses the scanned person]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[ND-13 Whether the requester sees a declined request]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[ND-14 Connection-granted Ring on Shared with me]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[ND-15 One Ring or several per connection]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[ND-17 Request expiry, note and asking again]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[ND-23 Mutual connections and events in common]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[S-15 Ring Access Engine Story]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[S-16 Ring Members Story]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[S-18 Rings Story]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[S-19 View As & Pin Views Story]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[S-31 Delegated Admins Story]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[S-37 Badge & QR Story]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[S-49 Events Before Story]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[S-62 Post-Event Story]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
- 2026-11-04 · flagged [[Status Report 2026-10-15]]: S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.
