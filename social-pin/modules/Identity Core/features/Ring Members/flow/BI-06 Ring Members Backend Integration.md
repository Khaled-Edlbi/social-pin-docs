---
id: BI-06
type: backend-integration
module: identity
feature: ring-members
status: current
scope: feature
screens: [s15, s47]
created: 2026-10-15
updated: 2026-11-09
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Ring Members · Backend Integration

> ⚠ Affected by [[FD-14 Ring Members Frontend Delivery]] (2026-11-09): the client follows every Checklist row on social_pin b646053: the roster filtered to ACTIVE, lapsed from expiresAt; add, reassign and revoke read the roster again, no 'what they see' cache; the window editor sends null to clear a bound; a 403 hides the roster quietly. Names come from GET /connections/:userId per member (D-29), which 'Not available yet' still says has no source. Tick the Checklist and refresh 'Not available yet' (/backend)

> ⚠ Affected by [[QB-11 Ring Members QA Backend]] (2026-11-05): QA run on main 12172c6: RING_MEMBER_STATUS has a fifth value LEFT that Shapes that matter does not list (the B-09 and B-10 parts of this flag were fixed on backend main e483d49, 2026-11-08: see [[BD-09 Ring Members Backend Delivery]] Log)

> ⚠ Affected by [[S-31 Delegated Admins Story]] (2026-11-05): S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.

> ⚠ Affected by [[S-23 Connections Story]] (2026-11-04): S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.

> ⚠ Affected by [[D-18 Ring names shown when joined knowingly]] (2026-10-25): a membership has to record how it was created (invitation, code, work email, connection accept, owner add); only the first three let the member see the Ring's name.

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[D-14 Shared with me lists people, never the Ring]] (2026-10-25): ND-14 decided, option 2: Shared with me lists the people who share with me and never shows a Ring's name, colour or type to a member.

> ⚠ Affected by [[D-15 Several Rings per connection, remove or disconnect]] (2026-10-25): ND-15 decided, one person can be in several of my Rings and sees the oldest version first; removing them from my last Ring offers Remove from Rings or Disconnect.

**Feature:** [[F-09 Ring Members]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Ring Access Model]]

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

1. **Roster.** `GET /rings/:ringId/members?status=ACTIVE&limit=…&skip=…` → `{ data: RingRosterMemberEntity[], meta: { total } }`, newest first (`createdAt` desc, then `id`). Each row carries the member's `displayName`, `pinName` and `avatarUrl` **as you see them**, the same card `GET /connections/:userId` answers, so s15 is one call. Without the `status` filter the list includes `REMOVED` rows (the row is kept as the record that this person was once in the Ring). Filter by `ACTIVE` for the people screen.
   - **Search:** add `name=<text>` (up to 100 characters, trimmed): part of the display name or the Pin name (without `!`), any case, matched on that same card, so it never finds a name the member has not shown you. It pages like the plain list, and `meta.total` is the number of matches. Debounce it and send it to the backend; do not filter only the loaded page.
2. **Add.** `POST /rings/:ringId/members` with `{ userId, startsAt?, expiresAt? }` → 201 `RingMemberEntity`. Re-adding someone whose row is `REMOVED` or lapsed (an `ACTIVE` row whose window has closed) reactivates it with the new window and answers 201. 400 `E_RING_MEMBER_03` for the owner themselves; 409 `E_RING_MEMBER_04` when the `userId` names no user, a deleted one, or a block exists in either direction (one body for all three); 409 `E_RING_MEMBER_01` only when the person is a live member right now.
3. **Window.** `PATCH …/members/:userId` with `{ startsAt?: iso | null, expiresAt?: iso | null }`. `null` removes a bound ("until removed"). The membership's window is checked **together with** the Ring's; whichever closes first ends access.
4. **Reassign.** `POST …/members/:userId/reassign` with `{ toRingId }` → 201 with the new row. Both Rings must have the same owner (400 `E_RING_07`). The window travels with the person. Both writes are one transaction, so the person is never in both or neither; what they see changes on their very next request.
5. **Revoke.** `DELETE …/members/:userId` → 200. The row becomes `REMOVED`.

## Shapes that matter

`RingMemberEntity` (add, window, reassign): `id`, `ringId`, `userId`, `status` (`PENDING` / `ACTIVE` / `EXPIRED` / `REMOVED`), `origin`, `addedById`, `startsAt`, `expiresAt`, `createdAt`, `updatedAt`.

`RingRosterMemberEntity` (the roster, since backend `main` `516a78f`): every `RingMemberEntity` field plus `displayName`, `pinName`, `avatarUrl`, all nullable. Which card it is: someone you are connected to who asked you shows their public card; someone who shares a Ring with you shows the card they share; anyone else only their Pin name (`displayName` and `avatarUrl` null: show initials). `avatarUrl` is a signed link valid 15 minutes (D-16). A delegated admin sees each member as the admin sees them, not as the owner does. The write routes still answer `RingMemberEntity` (no names): refetch the roster after them.

- `origin` (since backend `main` `1c460b0`, [[BD-17 Ring Invitations & Join Backend Delivery|F-17]]) says how the membership was made: `PLACED` (you or an admin added them, a connection accepted into this Ring, a reassign) or joined knowingly through an `INVITATION`, a `JOIN_CODE` or an approved `JOIN_REQUEST`. Read-only: no route takes it. An add or a reassign always makes the row `PLACED`. The owner may show it ("joined with a code"); only a non-`PLACED` member sees the Ring's name on their side.

- `EXPIRED` is never set by the backend today; compute "lapsed" from `expiresAt` on the client.

## State to keep on the client

The roster per Ring, refetched after every write. Do not keep a member's "what they see" cached across a reassign or revoke: the backend resolves access per request and the next `/views` call already reflects it.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 403 | `E_RING_05` | caller is neither owner nor a `MEMBER_MANAGER`+ admin | hide the roster |
| 404 | `E_RING_02` | Ring not found / not administrable | treat as missing |
| 400 | `E_RING_MEMBER_03` | adding the owner to their own Ring | validation |
| 409 | `E_RING_MEMBER_04` | a block exists either way, or the `userId` names no user or a deleted one: one body, "This user cannot be added", so the owner cannot probe which ids exist | "Cannot add this user" (do not say "blocked" or "not found") |
| 409 | `E_RING_MEMBER_01` | already a live member right now (a lapsed member is reactivated instead) | no-op, refresh the list |
| 404 | `E_RING_MEMBER_02` | no membership row for that user in that Ring | refresh the list |
| 400 | `E_RING_07` | reassign across owners | validation |

## Rules the UI must respect

- **Membership is private to the owner.** No screen on the member's side may show "you are in Sara's *Clients* Ring"; there is no route that would tell it, and the design must not imply one.
- The roster screens are for the owner and delegated admins. A 403 means the current user is a member looking at someone else's Ring: show nothing, not an error.

## Not available yet

- "Scan someone in" (s15): not in the MVP ([[D-28 Scan someone in is not in the MVP]]).
- The members a member may see when "members can see each other" is on ([[FR-09 Ring Members Frontend Requirements|FR-09]] S8): no member-facing route yet. Each colleague will show the Ring they picked ([[D-34 A member shows one of their own Rings]]); the route comes with [[BD-17 Ring Invitations & Join Backend Delivery]] (S-33 S10, S11).
- Adding or removing delegated admins: [[S-31 Delegated Admins Story|Delegated Admins · S6]].

## Checklist

- [ ] Roster filtered to `ACTIVE`; lapsed computed from `expiresAt`.
- [ ] Names, Pin names and photos read from the roster rows, not one `GET /connections/:userId` per member; search sent as `name=`, debounced.
- [ ] Add / reassign / revoke refetch the roster; no local "what they see" cache.
- [ ] Access-window editor sends `null` to clear a bound.
- [ ] 403 hides the screen quietly.
