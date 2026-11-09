---
id: FR-09
type: frontend-requirements
module: identity
feature: ring-members
status: approved
scope: feature
screens: [s15, s16, s35, s46, s47]
approvedBy: "khaled"
approvedAt: 2026-11-09
owner: "Omar Fostok"
depends: ["S-16 Ring Members Story"]
affects: ["BD-09 Ring Members Backend Delivery"]
related: ["BI-06 Ring Members Backend Integration", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "FR-08 Ring Access Engine Frontend Requirements", "FR-11 Rings Frontend Requirements", "S-18 Rings Story", "S-23 Connections Story", "S-33 Ring Invitations & Join Story", "S-87 Error Contract Story", "S-31 Delegated Admins Story", "D-28 Scan someone in is not in the MVP", "D-29 Connection detail opens a member who is not a connection", "BI-16 Connections Backend Integration", "GET /connections/:userId", "GET /connections", "DELETE /connections/:userId", "GET /rings/:ringId/members", "POST /rings/:ringId/members", "PATCH /rings/:ringId/members/:userId", "DELETE /rings/:ringId/members/:userId", "POST /rings/:ringId/members/:userId/reassign", "GET /rings", E_RING_05, E_RING_02]
created: 2026-10-18
updated: 2026-11-09
tags: [frontend-requirements, frontend-requirements/approved, module/identity, layer/frontend]
---

# Ring Members · Frontend Requirements

> ⚠ Affected by [[BD-09 Ring Members Backend Delivery]] (2026-11-09): backend main 516a78f: GET /rings/:ringId/members rows now carry displayName, pinName, avatarUrl (as GET /connections/:userId answers) and take ?name= with paging, so s15's 'Names today' (one call per member), on-phone search and 'Source today' lines are stale; shapes in BI-06 (/frontend)

> ⚠ Affected by [[BD-09 Ring Members Backend Delivery]] (2026-11-09): membersCanSeeEachOther exists on a Ring since backend main 12172c6 (BD-11), so the 'the setting doesn't exist' lines (s15 footnote, s17 Source today, Blocked by S-18 S9) are stale; only the member-facing roster read is missing, pending on BD-09 (/frontend)

**Feature:** [[F-09 Ring Members]] · **Status:** Approved by the backend 2026-11-09 (names on the roster and `?name=` search shipped 2026-11-09; the member-facing roster is pending on [[BD-09 Ring Members Backend Delivery]]) · **Story:** [[S-16 Ring Members Story]] · **Backend Integration:** [[BI-06 Ring Members Backend Integration]]

What the client needs from the backend to build the owner's roster, the per-person checklist of Rings, the "bring people in" flow, join approvals and the members a member may see, and whether each need is met today. Shapes, the `status` filter and the window semantics are in [[BI-06 Ring Members Backend Integration]].

## Per screen

### [[Screen Index#s15|s15]] Ring people (S1, S2, S4, S6, S9)

- Needs: the active roster with `userId`, `status`, `origin`, `startsAt`, `expiresAt`, newest first; each member's **`displayName`, `pinName` and `avatarUrl`**; the Ring's `memberCount` for the header; my connections, for + Add; my other live Rings, for a move; this Ring's "members can see each other" value (for the footnote).
- Header: "**People · N**" (`memberCount`), "Newest first".
- **Names today** come from `GET /connections/:userId`, one call per member: it answers for a connection **and** for a member of my Rings who isn't one ([[D-29 Connection detail opens a member who is not a connection|D-29]]). Read once per person and kept for the session; forgotten when my connections change. Until a name is read the row says "Someone". This is one call per member, slow on a big Ring: **asked below** as names on the roster (M10).
- A row: photo (or initials), name, `!pinName`; **only when set** the window ("Until 16 Mar", "From 3 Nov", "3 Nov to 12 Nov"); **only when passed** the row is dimmed and reads "**Ended <date>**"; **only when `origin` is not `PLACED`** how they joined ("Joined with a code", "Joined by invitation", "Asked to join"). No added date and no headline. Tap → [[Screen Index#s47|s47]], re-read on return.
- **Search** "Search N people": by display name and Pin name, **on the phone over the names loaded**; "No one here matches that search." Asked below: `?name=` on the roster with paging (M10), so a big Ring needn't load every page and every name first.
- **+ Add** (S2): a sheet of my connections (`GET /connections`), people already in this Ring marked "In this Ring" and not pickable; one person per add → `POST /rings/:ringId/members { userId }`; the window is set afterwards from ⋯. "Can't add this person" on `E_RING_MEMBER_04`, never why.
- **⋯ per row:** *When they're in* (S3): the Ring dates sheet for that person → `PATCH …/members/:userId`, `null` clears a bound · *Move to another Ring* (S4): my other live Rings → `POST /rings/:ringId/members/:userId/reassign { toRingId }`, where `:ringId` is this Ring (the one they leave) and `toRingId` the Ring picked · *Remove from this Ring* (S5): "Remove <name> from <Ring>?" → `DELETE …/members/:userId`; at a connection's **last** of my Rings the [[D-15 Several Rings per connection, remove or disconnect|D-15]] sheet instead (see s47).
- Not on s15: "Waiting on you" and the Pending filter (join requests, S9, wait on [[S-33 Ring Invitations & Join Story]]); Recent / Never met filters (no "last met" anywhere); "Move from a Ring" (moving is per row now); **Scan someone in** ([[Screen Index#s35|s35]]), not in the MVP ([[D-28 Scan someone in is not in the MVP]]).
- Footnote: "Members never see who else is in this Ring — only you do." (setting off, and every Ring until it exists) / "Members of this Ring can see each other." (on).
- States: loading, list, empty ("No one in this Ring yet"), search with no match, failed + Try again, gone (404 `E_RING_02`, back), not yours (403 `E_RING_05`, nothing shown), lapsed, a name not read yet.
- Source today: `GET /rings/:ringId/members?status=ACTIVE&limit=…&skip=…`, `POST`, `PATCH`, `DELETE …/members/:userId`, `POST …/reassign`, `GET /rings`, `GET /connections`, `GET /connections/:userId`. Names on the roster, `?name=` search, join requests and the setting: not yet.

### [[Screen Index#s47|s47]] Connection detail: which of my Rings (S3, S5)

- Needs: **for one person, which of my Rings they're in, with each membership's window, in one call**; add to and remove from a Ring; edit a window; disconnect.
- **Checklist** "IN RING — VISIBLE TO YOU ONLY": my Rings, ticked where they're in.
  - Tick: `POST /rings/:ringId/members { userId }` (placed by me, never named to them).
  - Untick: `DELETE /rings/:ringId/members/:userId`, no question, **except** at a connection's **last** of my Rings.
  - Untick a connection's last Ring: the [[D-15 Several Rings per connection, remove or disconnect|D-15]] sheet "<name> isn't in any other Ring": **Remove from Rings** (remove from the Ring, stay a connection) or **Disconnect** (remove from the Ring, then `DELETE /connections/:userId`). A member who isn't a connection ([[D-29 Connection detail opens a member who is not a connection|D-29]]) is just removed. Whether it is the last Ring is read fresh, not from the session's copy.
  - Moving: tick the new, then untick the old; **always add first**.
  - "Revoke access": remove from all my Rings, ending with the last-Ring question; then back to s15.
  - A failed call reverts the tick and refetches.
- **Window line** under each ticked Ring: "Until removed ›", "Until 12 Nov ›", "From 3 Nov ›", "3 Nov – 12 Nov ›", "Lapsed 12 Nov ›" → start / end pickers with "No start" / "Until removed" (`null`) → `PATCH /rings/:ringId/members/:userId`; the Ring's own `expiresAt` shown beside the pickers.
- States: ticked / unticked, saving, last-Ring sheet, window editor, lapsed.
- Source today: `GET /connections/:userId` (`memberships`: my Rings they're in, oldest first, with each window, in one call), `POST`, `DELETE`, `PATCH …/members/:userId` per Ring, `DELETE /connections/:userId`. The rest of the person's detail (mutuals, events): other features ([[S-23 Connections Story]], [[ND-23 Mutual connections and events in common]]).

### A person's card, the member's side (opened from [[Screen Index#s17|s17]]) (S8)

- Needs: **only when** the Ring I'm in has "members can see each other" on, the other members' cards (each member's card for that Ring), paginated, with search; refused with the same not-shared 404 when off ([[FR-08 Ring Access Engine Frontend Requirements|FR-08]]).
- Shows: "**Members · N**" on the card; never the Ring's name (unless joined knowingly), windows, lapsed rows, waiting people, or the owner's actions; the owner isn't listed.
- Source today: no member-facing route; the setting doesn't exist ([[S-18 Rings Story|Rings · S9]], asked in [[FR-11 Rings Frontend Requirements|FR-11]]).

### Member side, otherwise (S7)

- Needs: nothing. No call and no UI reads the member's own row.

## Field map

| Shown | Source | Notes |
|---|---|---|
| Name, Pin name, photo | `GET /connections/:userId` → `displayName`, `pinName`, `avatarUrl` | one call per member today, kept for the session; "Someone" until read; ✅ on the roster itself (M10): `GET /rings/:ringId/members` rows carry the same three fields |
| Window | `startsAt`, `expiresAt` | shown only when set; `null` = open-ended |
| Lapsed | `expiresAt < now` on an `ACTIVE` row | `EXPIRED` is never set server-side; row dimmed, "Ended <date>" |
| How they joined | `origin` | shown only when not `PLACED`: `JOIN_CODE` "Joined with a code", `INVITATION` "Joined by invitation", `JOIN_REQUEST` "Asked to join"; an unknown value reads as `PLACED` |
| Count | `memberCount` of the Ring | header "People · N" |
| Which of my Rings (s47) | `GET /connections/:userId` → `memberships` | one call, each with its window |
| Waiting on you | — | ❌ this Ring's join requests ([[S-33 Ring Invitations & Join Story]]) |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Roster, newest first, filter by status | `GET /rings/:ringId/members` | ✅ | S1 |
| **Names on the roster:** `displayName`, `pinName` and `avatarUrl` on each member (the card the owner may see, as `GET /connections/:userId` answers it), so s15 is one call, not one per member | `GET /rings/:ringId/members` | ✅ | S1 (M10, backend `main` `516a78f`) |
| **Search the roster by name** (display name and Pin name), with paging | `GET /rings/:ringId/members?name=` | ✅ | S1 (M10, backend `main` `516a78f`) |
| A member's name, Pin name and photo, one at a time (today's source for s15) | `GET /connections/:userId` | ✅ | S1 ([[D-29 Connection detail opens a member who is not a connection\|D-29]]) |
| My connections, for + Add | `GET /connections` | ✅ | S2 ([[BI-16 Connections Backend Integration\|BI-16]]) |
| Add a member with an optional window | `POST /rings/:ringId/members` | ✅ | S2, S5 |
| Edit the window | `PATCH /rings/:ringId/members/:userId` | ✅ | S3 |
| Move to another of my Rings | `POST /rings/:ringId/members/:userId/reassign { toRingId }`: `:ringId` this Ring (the one they leave), `toRingId` the Ring picked | ✅ | S4 |
| Remove from a Ring | `DELETE /rings/:ringId/members/:userId` | ✅ | S5 |
| Picker of my other Rings | `GET /rings` | ✅ | S4 (listed under [[F-11 Rings]]) |
| For one person, which of my Rings they're in, with each window, in one call | `GET /connections/:userId` (`memberships`) | ✅ | S5, S3 |
| Disconnect (end the connection), the D-15 sheet's second choice | `DELETE /connections/:userId` | ✅ | S5 ([[D-15 Several Rings per connection, remove or disconnect\|D-15]]) |
| **This Ring's pending join requests** (who, how, when), approve and decline | `GET /rings/:ringId/join-requests`, `POST /rings/:ringId/join-requests/:requestId/approve`, `POST /rings/:ringId/join-requests/:requestId/decline` | ✅ | S9 ([[S-33 Ring Invitations & Join Story]], shipped by [[BD-17 Ring Invitations & Join Backend Delivery]]) |
| **The members a member may see**, when the Ring's "members can see each other" is on (each member's card for that Ring), paginated | — | ❌ | S8 (the setting: [[S-18 Rings Story\|Rings · S9]]) |
| Scan someone in | — | not in the MVP | [[D-28 Scan someone in is not in the MVP]] |
| Delegated admins managing the roster | every members route above | ✅ | an admin at `MEMBER_MANAGER` or above already passes the members routes |
| Appointing a delegated admin | — | ❌ | [[S-31 Delegated Admins Story#What the backend has to build\|Delegated Admins · What the backend has to build]] |

## Behaviour expectations

- Refetch / realtime: refetch the roster after every add, window edit, move and removal, and on screen focus. After a move, refetch both Rings' rosters; after a checklist change, refetch the person's Rings. No push.
- Caching keys: `members:<ringId>:ACTIVE`, `member-name:<userId>` (from `GET /connections/:userId`, for the session, dropped when my connections change), `member-rings:<userId>` (one person's Rings); never cache a member's "what they see"; the next `/views` call already reflects the change.
- Pagination / ordering: newest first; `limit` ≤ 50; `meta.total` unpaginated; infinite scroll on `skip`. Always send `status=ACTIVE` on the people screen; omit it only on an audit view that wants `REMOVED` rows.
- Search: today on the phone, over every page of the roster and the names read so far (display name and Pin name); once `?name=` exists, debounce and send it to the backend, never filter only the loaded page.
- Checklist: add before remove when moving; revert a tick on failure; ask only at a connection's last Ring (D-15), checked against a fresh read.
- Window editor: send ISO datetimes; send `null` to clear a bound; omit a key to leave it unchanged. Show the Ring's own `expiresAt` next to the editor so the owner sees which closes first.
- Move picker: only my other live Rings (same `ownerUserId`); exclude the current Ring; the backend refuses the rest with 400 `E_RING_07`.
- 403: hide the roster and the actions; no toast. 404 `E_RING_MEMBER_02` on a row action: refetch the list.
- Privacy: no member-side request except the members list when the setting is on; no copy on the member's side names the Ring they are in.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 403 | `E_RING_05` | hide the roster (member or admin below `MEMBER_MANAGER`) |
| 404 | `E_RING_02` | Ring not found: back to My Rings |
| 400 | `E_RING_MEMBER_03` | "You are the owner of this Ring" |
| 409 | `E_RING_MEMBER_04` | "Cannot add this user" (never "blocked") |
| 409 | `E_RING_MEMBER_01` | already active: refresh the list, no error |
| 404 | `E_RING_MEMBER_02` | no row for that user: refresh the list |
| 400 | `E_RING_07` | move target is not mine: validation |
| 400 | — (validation; `message` is a string array) | inline on the window fields |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- Names on the roster and `?name=` search (M10, above) — s15 works without them, one detail call per member and search on the phone.
- [[S-33 Ring Invitations & Join Story]] — join requests for "Waiting on you".
- [[S-18 Rings Story|Rings · S9]] — "members can see each other" (the footnote and the members section) and "approve each one".
