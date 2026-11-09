---
id: BD-08
type: backend-delivery
module: identity
feature: ring-access
status: done
scope: feature
screens: []
related: ["S-29 Companies Story", "BD-03 Counts Backend Delivery", "BD-11 Rings Backend Delivery", "FR-08 Ring Access Engine Frontend Requirements", "D-04 Ring settings at launch and their defaults", "D-18 Ring names shown when joined knowingly", "GET /views/ring/:ringId", "GET /rings/shared-with-me"]
pending: ["[[S-29 Companies Story]]: P9, every member of a company reads the company's card Ring (its top Ring) even from a lower Ring of it, with no membership, roster or other Ring; decided in the story 2026-11-05, to build in RingAccessService", "[[FR-08 Ring Access Engine Frontend Requirements]]: GET /views/ring/:ringId answers an expired Ring with its own body (E_RING_ACCESS_02) before the membership check; decide whether a non-member should get the not-shared body instead"]
created: 2026-10-15
updated: 2026-11-09
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Ring Access Engine · Backend Delivery

> ⚠ Affected by [[BD-14 Connections Backend Delivery]] (2026-11-09): RingAccessService.resolveColleagueCard on backend branch FR-14/connection/block-a-colleague @ 7af98be (not merged): whether a person is listed to the viewer in a roster they may read (GET /rings/:ringId/colleagues rules, person-level) and with which Ring's card; POST /blocks { userId } uses it to block a colleague

**Feature:** [[F-08 Ring Access Engine]] · **Status:** Done · **Integration guide:** [[BI-05 Ring Access Engine Backend Integration]] · **Requirements:** [[FR-08 Ring Access Engine Frontend Requirements]] · **QA:** [[QB-09 Ring Access Engine QA Backend]]

What the backend shipped for this feature and how it works.

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Ring`, `RingMember`, `RingAdmin`, `UserBlock`

**Code:** `src/modules/ring-access/`

## How it works

`RingAccessService` exposes two reusable `where` fragments and four decisions. `ringLiveFilter(now)`: `ACTIVE`, not deleted, `startsAt` null or past, `expiresAt` null or **strictly** future. `membershipLiveFilter(now)`: the same on the membership row. `resolveAccessibleRings(viewer, owner)`: the owner's own live Rings (default first, then oldest) when viewer = owner; otherwise an empty list if `isBlockedEitherWay`, else the owner's live Rings the viewer is a live member of, **in the order the viewer was put in them**: `FIRST_MEMBERSHIP_ORDER`, the viewer's own `ring_members` rows by `createdAt`, the row's `id` breaking a tie, so the oldest live membership comes first whatever the owner's default Ring is and however old each Ring is ([[D-15 Several Rings per connection, remove or disconnect]], S-19 S4, S5). Adding the viewer to another Ring later never changes the first one. A membership that is re-activated (removed and added again, or a lapsed window renewed) keeps its row and so its first date, because every membership write is an upsert that leaves `createdAt` alone; a reassign into a Ring the person was never in makes a new row, dated then. `resolveDefaultAccess` returns the first of those or throws the not-shared 404 (`E_RING_ACCESS_01`) so that "no such person" and "not shared" are one answer. `assertRingReadable(ringId, viewer)`: the Ring must pass `ringLiveFilter` (404 `E_RING_ACCESS_02`), the owner passes, a block or no live membership gives the not-shared 404. `assertCanAdminister(ringId, actor, minimumLevel)`: finds the Ring **without** the live filter (an expired Ring must stay editable), the owner passes, otherwise a `RingAdmin` row at or above the level (`MEMBER_MANAGER` < `CONTENT_MANAGER` < `FULL`) is required or it is 403 `E_RING_05`. Every call takes `now` as a parameter and queries fresh; nothing is cached. `RingService`, `RingMemberService` and `RingProfileService` import this service and never query `rings` or `ring_members` to decide access themselves.

Since 2026-11-05 (backend `main` f186ba1, [[BD-03 Counts Backend Delivery]] and [[BD-11 Rings Backend Delivery]]) it also answers the counts and Shared with me, so they cannot disagree with what a viewer may open. `sharedWithFilter(viewer, now)` is the one definition of "shared with me": someone else's live Ring, the viewer's live membership in it, and no block between the viewer and its owner, either way. `GET /rings/shared-with-me` lists with it, and `countPeopleSharingWith(viewer, now)` counts the distinct owners behind it (`GET /rings/shared-with-me/count`). `countLiveMembers(owner, ringIds, now)` is the owner's "N people": one grouped query over the owner's live Rings, live memberships only, members in a block with the owner left out.

Since backend `main` `12172c6` ([[BD-11 Rings Backend Delivery]]) Shared with me lists **people**: `resolvePeopleSharingWith(viewer, now)` reads the viewer's live memberships in Rings `sharedWithFilter` allows and keeps one entry per owner, the Ring the viewer was put in first ([[D-15 Several Rings per connection, remove or disconnect]]), read with the same `FIRST_MEMBERSHIP_ORDER`, so a row, `GET /views/pin` and View 1 of the perspectives always open the same Ring; the oldest membership wins however it was made (a placed one before a later one joined knowingly: built so since backend `main` `d8267d3`, the PM's confirmation pending on [[BD-17 Ring Invitations & Join Backend Delivery]]). Rows are newest first, ending at the earlier of that Ring's and the membership's end. Two gates decide what a row may say: `isRingNamedToMember` (D-18: the Ring's name only for a Ring joined knowingly, read from `RingMember.origin` since [[BD-17 Ring Invitations & Join Backend Delivery|F-17]]: anything but `PLACED`) and the member count, only on a named row whose Ring has `membersCanSeeEachOther` on (D-04, [[S-15 Ring Access Engine Story|Ring Access Engine · S8]]). A row whose first Ring is placed names nothing, even when a later Ring of the same person was joined knowingly.

### What exists

- Resolved on every request against `now`; nothing is cached. Re-assignment is live and expiry is a real boundary.
- Both windows are checked (the Ring's and the membership's). Expiry is exclusive, so a Ring is dead at its `expiresAt` instant.
- A block is mutual and overrides membership in both directions.
- `assertCanAdminister` deliberately ignores expiry for owner editing paths. It guards `PATCH /rings/:id`, the members routes and the projection routes; set-default, disposition and delete are owner-only by an owner-filtered lookup in `RingService` (404 `E_RING_02` for anyone else, an admin included).
- Shared with me and the two counts go through the engine (`sharedWithFilter`, `countPeopleSharingWith`, `countLiveMembers`), blocks included; the per-person rows through `resolvePeopleSharingWith`, with the D-18 and D-04 gates.
- One order for "the Ring a viewer meets first" (`FIRST_MEMBERSHIP_ORDER`, D-15): the Pin lookup, the perspectives list and the Shared with me row; the owner's own lookup keeps the default Ring first.
- "Members can see each other" off (the default) means no member-facing roster or count anywhere; the other D-04 settings are stored on the Ring and enforced when invitations, codes and a save flow exist ([[F-17 Ring Invitations & Join]]).

### Gaps

- Nothing can create a `UserBlock` yet, so the block rule is enforced but unreachable. See [[F-14 Connections]].
- `GET /views/ring/:ringId` checks the Ring's window before the membership: an expired Ring answers *"Ring is not available"* (`E_RING_ACCESS_02`) to any caller, a Ring not shared *"This profile is not shared with you"* (`E_RING_ACCESS_01`). Someone holding a Ring id can tell that it existed and expired. Pending: whether a non-member should get the not-shared body.
- A company's card Ring readable by every member of the company ([[S-29 Companies Story]] P9): not built. Pending.
- New domains (events, meetings, PinCast, chat) must add their checks **here**, not in their own modules. Golden rule 8 in `CLAUDE.md`.

## Log

- 2026-10-18 · split out of [[F-08 Ring Access Engine]] when the vault moved to layers
- 2026-11-05 · `docs/backend/M-01-identity/F-08-ring-access/BD-08-engine-update` · brought up to backend `main` f186ba1: `sharedWithFilter`, `countPeopleSharingWith`, `countLiveMembers` (from `FR-03/ring/shared-with-me-blocks`); owner-only routes named; the `/views/ring` expired-body gap and [[S-29 Companies Story]] P9 added as `pending` (its flag cleared). [[FR-08 Ring Access Engine Frontend Requirements]] sent back to `draft` the same day on its own branch.
- 2026-11-05 · backend branch `FR-11/ring/settings-copy-default-shared` (`d1a6204`), pushed, **not merged** ([[BD-11 Rings Backend Delivery]]) · the engine gains `resolvePeopleSharingWith`: Shared with me per person on `sharedWithFilter` (one entry per owner, the Ring the viewer was put in first, the earlier of the Ring's and the membership's end), with the D-18 gate `isRingNamedToMember` (false for every membership until [[F-09 Ring Members]] records how one was made) and the D-04 gate on the member count (only on a named row whose Ring has `membersCanSeeEachOther`), so today no row names a Ring or counts its members ([[S-15 Ring Access Engine Story|Ring Access Engine · S1]], S8). The Ring carries the six settings; `membersCanInvite`, `membersCanSaveAttachments`, `joinPolicy` and `requireApproval` are stored and enforced when their flows ship. This note's sections describe `main` until the merge.
- 2026-11-05 · `docs/backend/M-01-identity/F-11-rings/BD-11-shipped-settings` · backend `main` `12172c6` merged `FR-11/ring/settings-copy-default-shared` (`4aad168`): `resolvePeopleSharingWith` and its two gates are on `main`; *How it works* and *What exists* now say so. Typecheck clean, 398/398 unit tests on `main`. Nothing added to `pending`.
- 2026-11-08 · `tickets/backend/M-01-identity/F-08-ring-access/FR-08-accepted` · [[FR-08 Ring Access Engine Frontend Requirements]] reviewed again against backend `main` e483d49 and approved: the 2026-11-05 points are answered, and every ✅ row matches. Shared with me per person and the six settings (saved, members-can-see-each-other enforced) marked ✅, shipped with F-11. No new engine work for `pending`: the open asks are other features' (membership origin F-09, blocks F-14, delegated admins F-16, invitations F-17, QR F-18, ND-23). FR-08's *Source today* lines are left for `/frontend` under the BD-11 flag.
- 2026-11-09 · branch `D-15/ring-access/first-ring-order` (`537e8f8`), merged to backend `main @ d8267d3` · [[D-15 Several Rings per connection, remove or disconnect]] (S-19 S4, S5; [[QB-09 Ring Access Engine QA Backend]] B58): `resolveAccessibleRings` orders another person's Rings by the viewer's membership, oldest live membership first (`FIRST_MEMBERSHIP_ORDER`: `createdAt`, then `id`), no longer by the Ring's `isDefault` and age; the owner's own keep the default first. `resolvePeopleSharingWith` reads the same order and no longer prefers a Ring joined knowingly over an older placed one (the PM's confirmation stays pending on [[BD-17 Ring Invitations & Join Backend Delivery]]). Re-activated memberships keep their first date (upserts leave `createdAt` alone). Specs in `ring-access.first-ring.spec.ts` sort by the order the service asks for, and 8 of its 10 fail on the old service; typecheck clean, 991/991 unit tests on the merged `main`; checked live on a throwaway database (B58's set-up, a later membership, the owner's own, a remove and re-add). The S-19 flag and the F-17 flag (the knowingly preference it described no longer holds) are cleared; *How it works* also says how `isRingNamedToMember` reads `origin`.
