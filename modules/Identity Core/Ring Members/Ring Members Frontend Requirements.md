---
type: frontend-requirements
code: ring-members
scope: feature
feature: ring-members
module: identity
status: draft
screens: [s15, s47]
created: 2026-10-18
updated: 2026-10-26
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Ring Members · Frontend Requirements

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[D-14 Shared with me lists people, never the Ring]] (2026-10-25): ND-14 decided, option 2: Shared with me lists the people who share with me and never shows a Ring's name, colour or type to a member.

> ⚠ Affected by [[D-15 Several Rings per connection, remove or disconnect]] (2026-10-25): ND-15 decided, one person can be in several of my Rings and sees the oldest version first; removing them from my last Ring offers Remove from Rings or Disconnect.

**Feature:** [[Ring Members]] · **Status:** Draft · **Story:** [[Ring Members Story]] · **Backend Integration:** [[Ring Members Backend Integration]]

What the client needs from the backend to build the owner's roster and the per-person actions, and whether each need is met today. Shapes, the `status` filter and the window semantics are in [[Ring Members Backend Integration]].

## Per screen

### [[Screen Index#s15|s15]] Ring people

- Needs: the active roster with `userId`, `status`, `startsAt`, `expiresAt`, `addedById`, `createdAt`; `meta.total` for the header; add a member; entry points to scan someone in and to move someone from another Ring.
- Fields shown per row: identity (placeholder today), window, lapsed chip, added date.
- Actions: Add, Scan someone in, Move from a Ring, open a row (s47), Rename (s22), Ring data (s14).
- States: list, empty, loading, lapsed, read-only (403), placeholder identity.
- Source today: `GET /rings/:ringId/members?status=ACTIVE&limit=…&skip=…`, `POST /rings/:ringId/members`. Names, scan and connect: not yet.

### [[Screen Index#s47|s47]] Connection detail (member actions)

- Needs: the member's row; edit the window; reassign to another Ring of the same owner; revoke.
- Actions: change window, Move to…, Revoke access; Request meeting and Introduce belong to other features.
- States: editing, saving, confirmation, lapsed.
- Source today: `PATCH …/members/:userId`, `POST …/members/:userId/reassign`, `DELETE …/members/:userId`. The person's detail (name, events in common, mutuals): not yet.

### Member side (no prototype screen)

- Needs: nothing. There must be no call and no UI that reads the member's own row.

## Field map

| Shown | Source | Notes |
|---|---|---|
| Identity | — | placeholder until [[T-023 Connection detail and contacts list]] |
| Window | `startsAt`, `expiresAt` | `null` = open-ended |
| Lapsed | `expiresAt < now` on an `ACTIVE` row | `EXPIRED` is never set server-side |
| Added | `createdAt`, `addedById` | relative time |
| Count | `meta.total` of the `ACTIVE` list | roster header; not the design's live member count ([[T-004 Member count per Ring on list and detail]]) |

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Roster, newest first, filter by status | `GET /rings/:ringId/members` | ✅ | — |
| Add a member with an optional window | `POST /rings/:ringId/members` | ✅ | — |
| Edit the window | `PATCH /rings/:ringId/members/:userId` | ✅ | — |
| Move to another Ring of mine | `POST /rings/:ringId/members/:userId/reassign` | ✅ | — |
| Revoke | `DELETE /rings/:ringId/members/:userId` | ✅ | — |
| Picker of my other Rings for reassign | `GET /rings` | ✅ | — (listed under [[Rings]]) |
| Name, Pin name and photo per row | — | ❌ | [[T-023 Connection detail and contacts list]] |
| A `userId` to add (connect request accepted) | — | ❌ | [[T-021 Connect request send, inbox, cancel]], [[T-022 Accept into a Ring (sets grantedRingId)]] |
| Scan someone in | — | ❌ | [[T-008 Resolve a scanned QR token]] |
| Delegated admins managing the roster | — | ❌ | [[T-006 Delegated admin endpoints]] |
| Members can see each other | — | ❌ | [[Ring settings]] |

## Behaviour expectations

- Refetch / realtime: refetch the roster after every add, window edit, reassign and revoke, and on screen focus. After a reassign, refetch both Rings' rosters. No push.
- Caching keys: `members:<ringId>:ACTIVE`; never cache a member's "what they see"; the next `/views` call already reflects the change.
- Pagination / ordering: newest first; `limit` ≤ 50; `meta.total` unpaginated; infinite scroll on `skip`. Always send `status=ACTIVE` on the people screen; omit it only on an audit view that wants `REMOVED` rows.
- Window editor: send ISO datetimes; send `null` to clear a bound; omit a key to leave it unchanged. Show the Ring's own `expiresAt` next to the editor so the owner sees which closes first.
- Reassign picker: only Rings with the same `ownerUserId` (the owner's own list); exclude the current Ring; the backend refuses the rest with 400 `E_RING_07`.
- Revoke: optimistic removal is allowed; on failure restore the row and refetch.
- 403: hide the roster and the actions; no toast. 404 `E_RING_MEMBER_02` on a row action: refetch the list.
- Privacy: no member-side request; no copy on the member's side names the Ring they are in.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 403 | `E_RING_05` | hide the roster (member or admin below `MEMBER_MANAGER`) |
| 404 | `E_RING_02` | Ring not found: back to My Rings |
| 400 | `E_RING_MEMBER_03` | "You are the owner of this Ring" |
| 409 | `E_RING_MEMBER_04` | "Cannot add this user" (never "blocked") |
| 409 | `E_RING_MEMBER_01` | already active: refresh the list, no error |
| 404 | `E_RING_MEMBER_02` | no row for that user: refresh the list |
| 400 | `E_RING_07` | reassign target is not mine: validation |
| 400 | — (validation; `message` is a string array) | inline on the window fields |

Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint.

## Blocked by

- [[T-023 Connection detail and contacts list]] — names and photos on every row; without it the roster is a list of windows.
- [[T-021 Connect request send, inbox, cancel]] and [[T-022 Accept into a Ring (sets grantedRingId)]] — the only in-app sources of a `userId` to add.
- [[Ring settings]] — "members can see each other" on s27.
