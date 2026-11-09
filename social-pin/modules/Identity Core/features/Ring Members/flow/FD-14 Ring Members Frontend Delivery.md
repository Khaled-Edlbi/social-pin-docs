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
related: ["FR-09 Ring Members Frontend Requirements", "S-16 Ring Members Story", "BD-09 Ring Members Backend Delivery", "BI-16 Connections Backend Integration", "FD-13 Connections Frontend Delivery", "FD-12 Rings Frontend Delivery", "FD-06 Counts Frontend Delivery", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "D-26 A disconnect is not announced", "D-28 Scan someone in is not in the MVP", "D-29 Connection detail opens a member who is not a connection", "S-33 Ring Invitations & Join Story", "GET /rings/:ringId/members", "POST /rings/:ringId/members", "PATCH /rings/:ringId/members/:userId", "DELETE /rings/:ringId/members/:userId", "POST /rings/:ringId/members/:userId/reassign", "GET /connections/:userId", "GET /connections", "DELETE /connections/:userId", "GET /rings"]
pending: []
created: 2026-11-09
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Ring Members · Frontend Delivery

**Feature:** [[F-09 Ring Members]] · **Status:** Done · **Built from:** [[BI-06 Ring Members Backend Integration]] · **Against:** [[S-16 Ring Members Story]] · **Requirements:** [[FR-09 Ring Members Frontend Requirements]] · **QA:** [[Ring Members QA Frontend]]

What the client shipped for the owner's roster of a Ring, on `social_pin` `rings/F-11/honest-rings` @ `b646053` (2026-11-09), not on `main` yet, against backend `main` `1c460b0` (B-09 and B-10 fixed on `e483d49`). The data layer came first, in `f32f1ed`; Connection detail's ticks and windows shipped with Connections ([[FD-13 Connections Frontend Delivery|FD-13]]). The work is tracked in the client's `docs/gap-reviews/BI-06 Ring Members gap review.md` (M1–M11). Unit and widget tests only so far; not yet tried on a device.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s15\|s15]] Ring people | ✅ | The real roster: every page of `?status=ACTIVE`, **newest first**, "People · N" from the Ring's `memberCount`. A row: photo or initials, the name ("Someone" until read), `!pinName`; the window only when set ("Until 16 Mar", "From …", "… to …"); a lapsed row **dimmed**, "Ended <date>"; how they joined only when not `PLACED` ("Joined with a code", "Joined by invitation", "Asked to join"). **Search** "Search N people" over the names loaded (display name and Pin name), "No one here matches that search." States: loading, list, empty ("No one in this Ring yet"), failed + Try again, gone (404), not yours (403: nothing shown). Tap a row → s47, read again on return. Footnote: "Members never see who else is in this Ring — only you do." (S1, S6) |
| s15 **+ Add** | ✅ | *Add people*: a sheet of my connections, people already here marked "In this Ring"; one person per add; "Added to <Ring>."; "Can't add this person" on `E_RING_MEMBER_04`, never why (S2). |
| s15 **⋯** on a row | ✅ | *When they're in*: the Ring dates sheet, "When <name> is in <Ring>", `null` clears a bound (S3) · *Move to another Ring*: my other live Rings, "They leave <Ring> and see the Ring you pick instead. They aren't told." (S4) · *Remove from this Ring*: "Remove <name> from <Ring>?", or at a connection's last Ring the D-15 sheet (S5). |
| [[Screen Index#s47\|s47]] Connection detail | ✅ | Unticking a Ring removes at once; at a **connection's last Ring** it asks first with the [[D-15 Several Rings per connection, remove or disconnect\|D-15]] sheet (below). A member who isn't a connection ([[D-29 Connection detail opens a member who is not a connection\|D-29]]) is just removed (S5). |
| D-15 sheet, s15 and s47 | ✅ | "<name> isn't in any other Ring": **Remove from Rings** (stay connected) or **Disconnect** (removed from the Ring first, then disconnected; "They aren't told either way", [[D-26 A disconnect is not announced\|D-26]]). Whether it is the last Ring is read fresh from `GET /connections/:userId`. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings/:ringId/members?status=ACTIVE&limit=50&skip=` | s15 | Every page, then sorted newest first; read again after each write. |
| `GET /connections/:userId` | s15 names, D-15 check | `displayName`, `pinName`, `avatarUrl` per member, in batches of 6 once the roster is in, once per person per session; `memberships` for the last-Ring check, always fresh. |
| `GET /connections` | s15 + Add | My connections for the sheet. |
| `POST /rings/:ringId/members` | s15 + Add, s47 tick | `{ userId }`; 201; re-adding a lapsed member reactivates it (201). |
| `PATCH /rings/:ringId/members/:userId` | s15 ⋯ window, s47 | `{ startsAt?, expiresAt? }`, `null` clears a bound. |
| `POST /rings/:ringId/members/:userId/reassign` | s15 ⋯ move | `:ringId` this Ring, `{ toRingId }` the one picked; both Rings and their counts read again. |
| `DELETE /rings/:ringId/members/:userId` | s15 ⋯ remove, s47 untick, D-15 | 200; the row becomes `REMOVED`. |
| `DELETE /connections/:userId` | D-15 *Disconnect* | After the Ring removal; 204. |
| `GET /rings` | s15 ⋯ move | My other live Rings (not this one). |

## State kept on the client

- **Names for the session:** one `GET /connections/:userId` per person while the app runs, forgotten when my connections change (an accept, disconnect, block or unblock).
- The roster and the Ring's count are read again after every add, window, move and remove (both Rings after a move); a stale "already in it" or "not in it" re-reads quietly.
- Lapsed is computed from `expiresAt` (`EXPIRED` is never set); an unknown `origin` reads as `PLACED`.
- No member's "what they see" is cached: the card is read again on return.

## Deviations from the story or the integration note

- **Search runs on the phone**, over the roster's pages and the names read so far, not on the server: the roster has no `?name=` yet (asked in [[FR-09 Ring Members Frontend Requirements|FR-09]], M10).
- **Names cost one call per member** (`GET /connections/:userId`) because the roster carries `userId` only; slow on a big Ring until the roster carries names (FR-09, M10).
- **Moving goes out, one person at a time**: S-16 S4 brings several people *in* from another Ring ("Move from a Ring"); the app moves one member *out* of this Ring from ⋯. The same reassign route; "Move from a Ring" is gone from s15.
- **+ Add takes one person at a time**, and the window is set afterwards from ⋯, not in the add sheet.
- **No added date and no headline** on a row: nothing serves a headline, and the added date was dropped from FR-09.

## Not done yet

- **Waiting on you** and the Pending filter: this Ring's join requests → [[S-33 Ring Invitations & Join Story]] (S-16 S9). The sample list is gone.
- **The member's side** (members who may see each other): no route and no setting yet (S-16 S8, [[S-18 Rings Story|Rings · S9]]).
- Delegated admins: the 403 path hides the roster, reachable only once admins exist ([[S-31 Delegated Admins Story]]).
- Removed from s15 with no API behind them: the Recent / Never met filters, **Scan someone in** ([[D-28 Scan someone in is not in the MVP]]), *Move from a Ring* (moving is per row now).

## Log

- 2026-11-09 · `rings/F-11/honest-rings` @ `b646053` (social_pin, not on `main` yet) · s15 real (roster newest first, names from Connections kept for the session, window and origin labels, search, empty/loading/failed/gone/not-yours states), + Add, ⋯ window/move/remove, D-15 on s15 and s47; samples removed (waiting list, filters, Scan someone in, Move from a Ring) · flagged [[BI-06 Ring Members Backend Integration]] for its checklist
