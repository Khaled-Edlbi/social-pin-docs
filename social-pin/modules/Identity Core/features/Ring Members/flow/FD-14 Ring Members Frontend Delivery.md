---
id: FD-14
type: frontend-delivery
module: identity
feature: ring-members
status: done
scope: feature
deployedTo: []
screens: [s15, s47]
owner: "Omar Fostok"
depends: ["BI-06 Ring Members Backend Integration"]
affects: []
related: ["FR-09 Ring Members Frontend Requirements", "S-16 Ring Members Story", "BD-09 Ring Members Backend Delivery", "BI-16 Connections Backend Integration", "BI-17 Ring Invitations & Join Backend Integration", "FD-13 Connections Frontend Delivery", "FD-12 Rings Frontend Delivery", "FD-06 Counts Frontend Delivery", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "D-26 A disconnect is not announced", "D-28 Scan someone in is not in the MVP", "D-29 Connection detail opens a member who is not a connection", "D-31 An invitation is its own record", "D-32 Several join codes per Ring", "D-34 A member shows one of their own Rings", "S-23 Connections Story", "S-33 Ring Invitations & Join Story", "GET /rings/:ringId/members", "POST /rings/:ringId/members", "PATCH /rings/:ringId/members/:userId", "DELETE /rings/:ringId/members/:userId", "POST /rings/:ringId/members/:userId/reassign", "GET /rings/:ringId/join-requests", "POST /rings/:ringId/join-requests/:requestId/approve", "POST /rings/:ringId/join-requests/:requestId/decline", "GET /rings/:ringId/invitations", "POST /rings/:ringId/invitations", "GET /rings/:ringId/colleagues", "GET /connections/:userId", "GET /connections", "DELETE /connections/:userId", "GET /rings"]
pending: ["[[S-23 Connections Story]]: s47's checklist and s15's move picker drop ended Rings only; a Ring that has not started yet is still listed (S9: live Rings only)"]
created: 2026-11-09
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Ring Members · Frontend Delivery

**Feature:** [[F-09 Ring Members]] · **Status:** Done · **Built from:** [[BI-06 Ring Members Backend Integration]] · **Against:** [[S-16 Ring Members Story]] · **Requirements:** [[FR-09 Ring Members Frontend Requirements]] · **QA:** [[Ring Members QA Frontend]]

What the client shipped for the owner's roster of a Ring, on `social_pin` `rings/F-11/honest-rings` @ `0005f00` (2026-11-09; first `b646053`, then `f801aaa`, `f9c19e3`), not on `main` yet, against backend `main` `516a78f` (names and `?name=` on the roster) and `14c6916` (join requests, invitations, colleagues). The data layer came first, in `f32f1ed`; Connection detail's ticks and windows shipped with Connections ([[FD-13 Connections Frontend Delivery|FD-13]]). The work is tracked in the client's `docs/gap-reviews/BI-06 Ring Members gap review.md` (M1–M11). Unit and widget tests only so far; not yet tried on a device.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s15\|s15]] Ring people | ✅ | The real roster: every page of `?status=ACTIVE`, **newest first**, "People · N" from the Ring's `memberCount`. A row: photo or initials, the name and `!pinName` **from the roster row itself** ("Someone" when it carries none); the window only when set ("Until 16 Mar", "From …", "… to …"); a lapsed row **dimmed**, "Ended <date>"; how they joined only when not `PLACED` ("Joined with a code", "Joined by invitation", "Asked to join"). **Search** "Search N people" is the server's: `?name=`, sent 350 ms after the typing stops, every page of the matches; "No one here matches that search." States: loading, list, empty ("No one in this Ring yet", no *Scan someone in*: [[D-28 Scan someone in is not in the MVP\|D-28]]), failed + Try again, gone (404), not yours (403: nothing shown). Tap a row → s47, read again on return. **Footnote follows the Ring's "members can see each other"**: off "Members never see who else is in this Ring — only you do.", on "Members of this Ring can see each other." (S1, S6) |
| s15 **Waiting on you · N** | ✅ | This Ring's join requests (`GET /rings/:ringId/join-requests`) above the members, never counted with them: photo, name (else `!pinName`), headline, "Asked with <code label>" ([[D-32 Several join codes per Ring\|D-32]]) or "Asked to join", how long ago; **Add** (approve: a member at once, `JOIN_REQUEST`, roster and count read again) and a ✕ that **declines** ("Request declined."). Hidden while nobody waits. The filter row **All · Pending · N** shows only while someone waits, and falls back to All once the last request is handled (S1, S9). |
| s15 **+ Add** | ✅ | *Add people*: a sheet of my connections, people already here marked "In this Ring"; one person per add; "Added to <Ring>."; "Can't add this person" on `E_RING_MEMBER_04`, never why (S2). |
| s15 **+ Invite**, **Invited · N** | ✅ | *+ Invite* beside *+ Add people*: a connection or a Pin name, *Send* or *Send with an access window*, with "People who join this way will see this Ring's name." ([[D-18 Ring names shown when joined knowingly\|D-18]]); hidden once the server says I may not. **Invited · N**: the invitations not answered, "!pin · Waiting · sent 3 Nov", each with *Withdraw* (asks first); a declined one reads "Declined", never why, and isn't counted. Never members, never in a count ([[S-33 Ring Invitations & Join Story\|Ring Invitations · S6]], [[D-31 An invitation is its own record\|D-31]]). |
| s15 **⋯** on a row | ✅ | *When they're in*: the Ring dates sheet, "When <name> is in <Ring>", `null` clears a bound, and, when the Ring has an end, "This Ring ends <date>" with "The Ring's own end date also applies: whichever comes first ends their access." (S3) · *Move to another Ring*: my other live Rings, "They leave <Ring> and see the Ring you pick instead. They aren't told."; the row slides out and fades while the move is sent (fades only with reduced motion), then "Moved to <Ring>. What they see just changed." (S4) · *Remove from this Ring*: "Remove <name> from <Ring>?", or at a connection's last Ring the D-15 sheet (S5). |
| [[Screen Index#s47\|s47]] Connection detail | ✅ | The checklist lists my Rings that haven't ended; each ticked one has its window line, "**Until removed ›**" by default, "Until 12 Nov ›", "From 3 Nov ›", "3 Nov – 12 Nov ›", "**Lapsed** 12 Nov ›"; its sheet shows the Ring's end too (S3). Unticking a Ring removes at once; at a **connection's last Ring** it asks first with the [[D-15 Several Rings per connection, remove or disconnect\|D-15]] sheet (below). A member who isn't a connection ([[D-29 Connection detail opens a member who is not a connection\|D-29]]) is just removed. **Revoke access** at the bottom (while they're in any of my Rings, lapsed included): "Revoke <name>'s access?", then for a connection the D-15 choice; out of every Ring, "Access revoked. What they see just changed.", back to s15. *Disconnect* and *Block* live in ⋯ ([[S-23 Connections Story\|Connections · S11]]) (S5). |
| D-15 sheet, s15 and s47 | ✅ | "<name> isn't in any other Ring": **Remove from Rings** (stay connected) or **Disconnect** (removed from the Ring first, then disconnected; "They aren't told either way", [[D-26 A disconnect is not announced\|D-26]]). Whether it is the last Ring is read fresh from `GET /connections/:userId`. |
| A person's card from [[Screen Index#s17\|s17]], the member's side | ✅ | **Members · N** on the owner's card inside a Ring, from `GET /rings/:ringId/colleagues`, each as the card they picked ([[D-34 A member shows one of their own Rings\|D-34]]); shown only on a 200, a 404 (members can't see each other) shows nothing. Shipped with Ring Invitations & Join (`0005f00`, S-33 S11) (S8). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings/:ringId/members?status=ACTIVE&limit=50&skip=` (`&name=`) | s15 | Every page; `name` only when the search box has text, debounced 350 ms; sorted newest first; read again after each write. Rows carry `displayName`, `pinName`, `avatarUrl`. |
| `GET /rings/:ringId/join-requests` | s15 Waiting on you | Every page; read again after an approve or decline. |
| `POST /rings/:ringId/join-requests/:requestId/approve`, `…/decline` | s15 Add / ✕ | After an approve the roster and the Ring's count are read again. |
| `GET /rings/:ringId/invitations`, `POST /rings/:ringId/invitations`, withdraw | s15 + Invite, Invited · N | `{ userId }` or `{ pinName }`, an optional window. |
| `GET /connections/:userId` | D-15 check | `memberships`, always fresh, for the last-Ring check. No longer read for names. |
| `GET /connections` | s15 + Add, + Invite | My connections for the sheets. |
| `POST /rings/:ringId/members` | s15 + Add, s47 tick | `{ userId }`; 201; re-adding a lapsed member reactivates it (201). |
| `PATCH /rings/:ringId/members/:userId` | s15 ⋯ window, s47 | `{ startsAt?, expiresAt? }`, `null` clears a bound. |
| `POST /rings/:ringId/members/:userId/reassign` | s15 ⋯ move | `:ringId` this Ring, `{ toRingId }` the one picked; both Rings and their counts read again. |
| `DELETE /rings/:ringId/members/:userId` | s15 ⋯ remove, s47 untick, Revoke access, D-15 | 200; the row becomes `REMOVED`. |
| `DELETE /connections/:userId` | D-15 *Disconnect* | After the Ring removal; 204. |
| `GET /rings` | s15 ⋯ move, footnote, s47 | My other live Rings; this Ring's `membersCanSeeEachOther`. |
| `GET /rings/:ringId/colleagues` | person card, member side | A 404 hides the section. |

## State kept on the client

- No names cache: the roster rows carry them (the per-person `GET /connections/:userId` reads are gone since `f801aaa`).
- The roster and the Ring's count are read again after every add, window, move, remove and approve (both Rings after a move); a stale "already in it" or "not in it" re-reads quietly.
- Lapsed is computed from `expiresAt` (`EXPIRED` is never set); an unknown `origin` reads as `PLACED`.
- The footnote reads `membersCanSeeEachOther` from My Rings as last read; off for a Ring not listed.
- No member's "what they see" is cached: the card is read again on return.

## Deviations from the story or the integration note

- **Moving goes out, one person at a time**: S-16 S4 brings several people *in* from another Ring ("Move from a Ring"); the app moves one member *out* of this Ring from ⋯. The same reassign route; "Move from a Ring" is gone from s15.
- **+ Add takes one person at a time**, and the window is set afterwards from ⋯, not in the add sheet.
- **No added date and no headline** on a member row: the roster serves no headline, and the added date was dropped from FR-09.
- **Waiting on you copy**: "Asked with <code label>" or "Asked to join", not S-16 S9's "Asked to join with your code" / "… from your public card"; *Decline* is a ✕ (labelled "Decline <name>" for screen readers), not a word button.
- **Live Rings** on s47 and in the move picker leave out ended Rings only; S-23 S9 (2026-11-09) also leaves out a Ring that hasn't started (pending).

## Not done yet

- A Ring not started yet still shows on s47's checklist and in the move picker (pending, above).
- Delegated admins: the 403 path hides the roster, reachable only once admins exist ([[S-31 Delegated Admins Story]]).
- Removed from s15 with no API behind them: the Recent / Never met filters, **Scan someone in** ([[D-28 Scan someone in is not in the MVP]]), *Move from a Ring* (moving is per row now).

## Log

- 2026-11-09 · `rings/F-11/honest-rings` @ `b646053` (social_pin, not on `main` yet) · s15 real (roster newest first, names from Connections kept for the session, window and origin labels, search, empty/loading/failed/gone/not-yours states), + Add, ⋯ window/move/remove, D-15 on s15 and s47; samples removed (waiting list, filters, Scan someone in, Move from a Ring) · flagged [[BI-06 Ring Members Backend Integration]] for its checklist
- 2026-11-09 · `rings/F-11/honest-rings` @ `f801aaa`, `f9c19e3`, `0005f00` (social_pin, not on `main` yet) · S-16 S1, S3, S5, S8, S9; S-33 S6; S-23 S9, S11, S12 · s15 names from the roster and `?name=` search, Waiting on you with Add / Decline and the Pending filter, + Invite and Invited · N, footnote follows members-can-see-each-other, window sheet shows the Ring's end, move copy and motion; s47 Until removed / Lapsed lines, Revoke access with the D-15 choice; the member-side Members · N · pending: not-started Rings still listed · flagged [[BI-06 Ring Members Backend Integration]] (names and `?name=` now from the roster), [[S-16 Ring Members Story]] (Waiting on you copy, move direction), [[S-23 Connections Story]] (not-started Rings still listed)
