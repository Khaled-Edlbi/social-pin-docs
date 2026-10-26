---
type: backend-integration
code: ring-members
scope: feature
feature: ring-members
module: identity
status: current
screens: [s15, s47]
created: 2026-10-15
updated: 2026-10-26
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Ring Members · Backend Integration

> ⚠ Affected by [[DR-18 Ring names shown when joined knowingly]] (2026-10-25): a membership has to record how it was created (invitation, code, work email, connection accept, owner add); only the first three let the member see the Ring's name.

> ⚠ Affected by [[DR-04 Ring settings at launch and their defaults]] (2026-10-25): D-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[DR-14 Shared with me lists people, never the Ring]] (2026-10-25): D-14 decided, option 2: Shared with me lists the people who share with me and never shows a Ring's name, colour or type to a member.

> ⚠ Affected by [[DR-15 Several Rings per connection, remove or disconnect]] (2026-10-25): D-15 decided, one person can be in several of my Rings and sees the oldest version first; removing them from my last Ring offers Remove from Rings or Disconnect.

**Feature:** [[Ring Members]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Ring Access Model]]

What the client builds: the owner's "Ring people" roster: list who is in a Ring, add someone, set or change their access window, move them to another Ring, revoke. **Owner and delegated admins only**; nothing here is shown to a member.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s15\|s15]] Ring people | opens the roster | `GET /rings/:ringId/members` |
| s15 | adds a person | `POST /rings/:ringId/members` |
| s15, [[Screen Index#s47\|s47]] Connection detail | changes the access window | `PATCH /rings/:ringId/members/:userId` |
| s47 | moves them to another Ring | `POST /rings/:ringId/members/:userId/reassign` |
| s47 | revokes access | `DELETE /rings/:ringId/members/:userId` |

## Flow

1. **Roster.** `GET /rings/:ringId/members?status=ACTIVE` → `{ data: RingMemberEntity[], meta: { total } }`, newest first. Without the `status` filter the list includes `REMOVED` rows (the row is kept as the record that this person was once in the Ring). Filter by `ACTIVE` for the people screen.
2. **Add.** `POST /rings/:ringId/members` with `{ userId, startsAt?, expiresAt? }` → 201 `RingMemberEntity`. Re-adding someone whose row is `REMOVED` or lapsed reactivates it with the new window. 400 `E_RING_MEMBER_03` for the owner themselves; 409 `E_RING_MEMBER_04` when a block exists in either direction; 409 `E_RING_MEMBER_01` when already active.
3. **Window.** `PATCH …/members/:userId` with `{ startsAt?: iso | null, expiresAt?: iso | null }`. `null` removes a bound ("until removed"). The membership's window is checked **together with** the Ring's; whichever closes first ends access.
4. **Reassign.** `POST …/members/:userId/reassign` with `{ toRingId }` → 201 with the new row. Both Rings must have the same owner (400 `E_RING_07`). The window travels with the person. Both writes are one transaction, so the person is never in both or neither; what they see changes on their very next request.
5. **Revoke.** `DELETE …/members/:userId` → 200. The row becomes `REMOVED`.

## Shapes that matter

`RingMemberEntity`: `id`, `ringId`, `userId`, `status` (`PENDING` / `ACTIVE` / `EXPIRED` / `REMOVED`), `addedById`, `startsAt`, `expiresAt`, `createdAt`, `updatedAt`.

- `EXPIRED` is never set by the backend today; compute "lapsed" from `expiresAt` on the client.
- The roster carries **`userId` only**. There is no endpoint that turns a user id into a name or Pin name, and `GET /views/user/:userId/perspectives` returns what *that person shares with the viewer*, which is empty unless they added the owner to a Ring of theirs. A people screen with names needs the contacts work: [[T-023 Connection detail and contacts list]]. See [[Ring Members#Gaps]].

## State to keep on the client

The roster per Ring, refetched after every write. Do not keep a member's "what they see" cached across a reassign or revoke: the backend resolves access per request and the next `/views` call already reflects it.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 403 | `E_RING_05` | caller is neither owner nor a `MEMBER_MANAGER`+ admin | hide the roster |
| 404 | `E_RING_02` | Ring not found / not administrable | treat as missing |
| 400 | `E_RING_MEMBER_03` | adding the owner to their own Ring | validation |
| 409 | `E_RING_MEMBER_04` | a block exists either way | "Cannot add this user" (do not say "blocked") |
| 409 | `E_RING_MEMBER_01` | already an active member | no-op, refresh the list |
| 404 | `E_RING_MEMBER_02` | no membership row for that user in that Ring | refresh the list |
| 400 | `E_RING_07` | reassign across owners | validation |

## Rules the UI must respect

- **Membership is private to the owner.** No screen on the member's side may show "you are in Sara's *Clients* Ring"; there is no route that would tell it, and the design must not imply one.
- The roster screens are for the owner and delegated admins. A 403 means the current user is a member looking at someone else's Ring: show nothing, not an error.

## Not available yet

- Where a `userId` comes from: today the only in-app sources would be a scan or a connect request, and neither exists yet. The roster works once [[Connections]] delivers [[T-021 Connect request send, inbox, cancel]] and [[T-022 Accept into a Ring (sets grantedRingId)]].
- Names and photos on the roster: [[T-023 Connection detail and contacts list]].
- "Scan someone in" (s15): [[T-008 Resolve a scanned QR token]].
- "Members can see each other" (s27): [[Ring settings]].
- Adding or removing delegated admins: [[T-006 Delegated admin endpoints]].

## Checklist

- [ ] Roster filtered to `ACTIVE`; lapsed computed from `expiresAt`.
- [ ] Add / reassign / revoke refetch the roster; no local "what they see" cache.
- [ ] Access-window editor sends `null` to clear a bound.
- [ ] 403 hides the screen quietly.
