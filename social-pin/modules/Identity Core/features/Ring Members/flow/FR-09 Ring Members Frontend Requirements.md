---
id: FR-09
type: frontend-requirements
module: identity
feature: ring-members
status: ready
scope: feature
screens: [s15, s16, s35, s46, s47]
owner: "Omar Fostok"
depends: ["S-16 Ring Members Story"]
affects: ["BD-09 Ring Members Backend Delivery"]
related: ["BI-06 Ring Members Backend Integration", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "FR-08 Ring Access Engine Frontend Requirements", "FR-11 Rings Frontend Requirements", "S-18 Rings Story", "S-23 Connections Story", "S-33 Ring Invitations & Join Story", "S-87 Error Contract Story", "GET /rings/:ringId/members", "POST /rings/:ringId/members", "PATCH /rings/:ringId/members/:userId", "DELETE /rings/:ringId/members/:userId", "POST /rings/:ringId/members/:userId/reassign", "GET /rings", E_RING_05, E_RING_02]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/ready, module/identity, layer/frontend]
---

# Ring Members · Frontend Requirements

**Feature:** [[F-09 Ring Members]] · **Status:** 📨 Ready 2026-10-29, waiting on the backend's review · **Story:** [[S-16 Ring Members Story]] · **Backend Integration:** [[BI-06 Ring Members Backend Integration]]

What the client needs from the backend to build the owner's roster, the per-person checklist of Rings, the "bring people in" flow, join approvals and the members a member may see, and whether each need is met today. Shapes, the `status` filter and the window semantics are in [[BI-06 Ring Members Backend Integration]].

## Per screen

### [[Screen Index#s15|s15]] Ring people (S1, S2, S4, S6, S9)

- Needs: the active roster with `userId`, `status`, `startsAt`, `expiresAt`, `addedById`, `createdAt`; `meta.total` for the header; the person's name, headline and photo per row; **search by name**; this Ring's **pending join requests**; this Ring's "members can see each other" value (for the footnote).
- Header: "**N people**" (`meta.total`), not "connections".
- A row: **always** name, headline, when added ("Today", from `createdAt`); **only when set** the window ("until 12 Nov"); **only when passed** a "lapsed" chip. Until names exist: "Member" with the added date and the window.
- **Search** "Search N people": by name and Pin name over the whole roster, sent to the backend (works with paging); "No one here matches that search."
- **Filters: All · Pending · N.** Pending is hidden while nobody waits; the filter row is hidden until join requests exist. Not "Recent" or "Never met" (later).
- **Waiting on you · N** (S9): this Ring's join requests: the person, how they asked ("with your code", "from your public card"), when; **Add** (approve, recorded as joined knowingly) and **Decline**. People who only scanned my badge are not here. Hidden while empty.
- **Move from a Ring** (S4): my other Rings ([[Screen Index#s16|s16]]-like list, without this one) → that Ring's roster, tick several (with search) → "Move N people to <Ring>": `reassign` each into this Ring. Someone already here is ticked and can't be picked.
- Add → [[Screen Index#s46|s46]] and Scan someone in → [[Screen Index#s35|s35]], once those flows ship.
- Footnote: "Members never see who else is in this Ring — only you do." (setting off, and every Ring until it exists) / "Members of this Ring can see each other." (on).
- States: list, empty, loading, search with no match, waiting requests, lapsed, read-only (403), placeholder identity.
- Source today: `GET /rings/:ringId/members?status=ACTIVE&limit=…&skip=…`, `POST /rings/:ringId/members`, `POST …/members/:userId/reassign`, `GET /rings`. Names, search, join requests, the setting, scan and connect: not yet.

### [[Screen Index#s47|s47]] Connection detail: which of my Rings (S3, S5)

- Needs: **for one person, which of my Rings they're in, with each membership's window, in one call**; add to and remove from a Ring; edit a window; disconnect.
- **Checklist** "IN RING — VISIBLE TO YOU ONLY": my Rings, ticked where they're in.
  - Tick: `POST /rings/:ringId/members { userId }` (placed by me, never named to them).
  - Untick: "Remove <name> from <Ring>?" → `DELETE /rings/:ringId/members/:userId`.
  - Untick the last Ring: **Remove from Rings** (stay a connection) or **Disconnect** (❌ no route yet).
  - Moving: tick the new, then untick the old; **always add first**.
  - "Revoke access": remove from all my Rings, ending with the last-Ring question; then back to s15.
  - A failed call reverts the tick and refetches.
- **Window line** under each ticked Ring: "Until removed ›", "Until 12 Nov ›", "From 3 Nov ›", "3 Nov – 12 Nov ›", "Lapsed 12 Nov ›" → start / end pickers with "No start" / "Until removed" (`null`) → `PATCH /rings/:ringId/members/:userId`; the Ring's own `expiresAt` shown beside the pickers.
- States: ticked / unticked, saving, untick confirmation, last-Ring question, window editor, lapsed.
- Source today: `POST`, `DELETE`, `PATCH …/members/:userId` per Ring. One person's Rings in one call and disconnect: not yet. The person's detail (name, mutuals, events): other features ([[S-23 Connections Story]], [[ND-23 Mutual connections and events in common]]).

### A person's card, the member's side (opened from [[Screen Index#s17|s17]]) (S8)

- Needs: **only when** the Ring I'm in has "members can see each other" on, the other members' cards (each member's card for that Ring), paginated, with search; refused with the same not-shared 404 when off ([[FR-08 Ring Access Engine Frontend Requirements|FR-08]]).
- Shows: "**Members · N**" on the card; never the Ring's name (unless joined knowingly), windows, lapsed rows, waiting people, or the owner's actions; the owner isn't listed.
- Source today: no member-facing route; the setting doesn't exist ([[S-18 Rings Story|Rings · S9]], asked in [[FR-11 Rings Frontend Requirements|FR-11]]).

### Member side, otherwise (S7)

- Needs: nothing. No call and no UI reads the member's own row.

## Field map

| Shown | Source | Notes |
|---|---|---|
| Name, headline, photo | — | ❌ until [[S-23 Connections Story\|Connections · S19–S24]]; placeholder "Member" until then |
| Added | `createdAt` | relative time |
| Window | `startsAt`, `expiresAt` | shown only when set; `null` = open-ended |
| Lapsed | `expiresAt < now` on an `ACTIVE` row | `EXPIRED` is never set server-side |
| Count | `meta.total` of the `ACTIVE` list | header "N people" |
| Which of my Rings (s47) | — | ❌ one call per person, with each window |
| Waiting on you | — | ❌ this Ring's join requests ([[S-33 Ring Invitations & Join Story]]) |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Roster, newest first, filter by status | `GET /rings/:ringId/members` | ✅ | S1 |
| **Search the roster by name** (name and Pin name the person shares with me), with paging | `GET /rings/:ringId/members?name=` | ❌ | S1 (needs names: Connections · S19–S24) |
| Add a member with an optional window | `POST /rings/:ringId/members` | ✅ | S2, S5 |
| Edit the window | `PATCH /rings/:ringId/members/:userId` | ✅ | S3 |
| Move into this Ring from another of mine | `POST /rings/:ringId/members/:userId/reassign` | ✅ | S4 |
| Remove from a Ring | `DELETE /rings/:ringId/members/:userId` | ✅ | S5 |
| Picker of my other Rings | `GET /rings` | ✅ | S4 (listed under [[F-11 Rings]]) |
| **For one person, which of my Rings they're in, with each window**, in one call | — | ❌ | S5, S3 |
| Disconnect (end the connection) | — | ❌ | S5 ([[S-23 Connections Story]]) |
| **This Ring's pending join requests** (who, how, when), approve and decline | — | ❌ | S9 ([[S-33 Ring Invitations & Join Story]]) |
| **The members a member may see**, when the Ring's "members can see each other" is on (each member's card for that Ring), paginated | — | ❌ | S8 (the setting: [[S-18 Rings Story\|Rings · S9]]) |
| Name, Pin name and photo per row | — | ❌ | [[S-23 Connections Story\|Connections · S19–S24]] |
| A `userId` to add (connect request accepted) | — | ❌ | [[S-23 Connections Story\|Connections · S8–S12]], [[S-23 Connections Story\|Connections · S13–S18]] |
| Scan someone in | — | ❌ | [[S-37 Badge & QR Story\|Badge & QR · S13–S18]] |
| Delegated admins managing the roster | — | ❌ | [[S-31 Delegated Admins Story\|Delegated Admins · S6]] |

## Behaviour expectations

- Refetch / realtime: refetch the roster after every add, window edit, move and removal, and on screen focus. After a move, refetch both Rings' rosters; after a checklist change, refetch the person's Rings. No push.
- Caching keys: `members:<ringId>:ACTIVE`, `member-rings:<userId>` (one person's Rings); never cache a member's "what they see"; the next `/views` call already reflects the change.
- Pagination / ordering: newest first; `limit` ≤ 50; `meta.total` unpaginated; infinite scroll on `skip`. Always send `status=ACTIVE` on the people screen; omit it only on an audit view that wants `REMOVED` rows.
- Search: debounce, send to the backend, never filter only the loaded page.
- Checklist: add before remove when moving; revert a tick on failure.
- Window editor: send ISO datetimes; send `null` to clear a bound; omit a key to leave it unchanged. Show the Ring's own `expiresAt` next to the editor so the owner sees which closes first.
- Move picker: only Rings with the same `ownerUserId` (the owner's own list); exclude the current Ring; the backend refuses the rest with 400 `E_RING_07`.
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

- [[S-23 Connections Story|Connections · S19–S24]] — names and photos on every row, and search by name.
- [[S-23 Connections Story|Connections · S8–S12]] and [[S-23 Connections Story|Connections · S13–S18]] — the only in-app sources of a `userId` to add; the disconnect route.
- [[S-33 Ring Invitations & Join Story]] — join requests for "Waiting on you".
- [[S-18 Rings Story|Rings · S9]] — "members can see each other" (the footnote and the members section) and "approve each one".
