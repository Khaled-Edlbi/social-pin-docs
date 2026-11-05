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
updated: 2026-11-05
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Ring Access Engine · Backend Delivery

**Feature:** [[F-08 Ring Access Engine]] · **Status:** Done · **Integration guide:** [[BI-05 Ring Access Engine Backend Integration]] · **Requirements:** [[FR-08 Ring Access Engine Frontend Requirements]] · **QA:** [[Ring Access Engine QA Backend]]

What the backend shipped for this feature and how it works.

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Ring`, `RingMember`, `RingAdmin`, `UserBlock`

**Code:** `src/modules/ring-access/`

## How it works

`RingAccessService` exposes two reusable `where` fragments and four decisions. `ringLiveFilter(now)`: `ACTIVE`, not deleted, `startsAt` null or past, `expiresAt` null or **strictly** future. `membershipLiveFilter(now)`: the same on the membership row. `resolveAccessibleRings(viewer, owner)`: the owner's own live Rings (default first, then oldest) when viewer = owner; otherwise an empty list if `isBlockedEitherWay`, else the owner's live Rings the viewer is a live member of, in the same order. `resolveDefaultAccess` returns the first of those or throws the not-shared 404 (`E_RING_ACCESS_01`) so that "no such person" and "not shared" are one answer. `assertRingReadable(ringId, viewer)`: the Ring must pass `ringLiveFilter` (404 `E_RING_ACCESS_02`), the owner passes, a block or no live membership gives the not-shared 404. `assertCanAdminister(ringId, actor, minimumLevel)`: finds the Ring **without** the live filter (an expired Ring must stay editable), the owner passes, otherwise a `RingAdmin` row at or above the level (`MEMBER_MANAGER` < `CONTENT_MANAGER` < `FULL`) is required or it is 403 `E_RING_05`. Every call takes `now` as a parameter and queries fresh; nothing is cached. `RingService`, `RingMemberService` and `RingProfileService` import this service and never query `rings` or `ring_members` to decide access themselves.

Since 2026-11-05 (backend `main` f186ba1, [[BD-03 Counts Backend Delivery]] and [[BD-11 Rings Backend Delivery]]) it also answers the counts and Shared with me, so they cannot disagree with what a viewer may open. `sharedWithFilter(viewer, now)` is the one definition of "shared with me": someone else's live Ring, the viewer's live membership in it, and no block between the viewer and its owner, either way. `GET /rings/shared-with-me` lists with it, and `countPeopleSharingWith(viewer, now)` counts the distinct owners behind it (`GET /rings/shared-with-me/count`). `countLiveMembers(owner, ringIds, now)` is the owner's "N people": one grouped query over the owner's live Rings, live memberships only, members in a block with the owner left out.

### What exists

- Resolved on every request against `now`; nothing is cached. Re-assignment is live and expiry is a real boundary.
- Both windows are checked (the Ring's and the membership's). Expiry is exclusive, so a Ring is dead at its `expiresAt` instant.
- A block is mutual and overrides membership in both directions.
- `assertCanAdminister` deliberately ignores expiry for owner editing paths. It guards `PATCH /rings/:id`, the members routes and the projection routes; set-default, disposition and delete are owner-only by an owner-filtered lookup in `RingService` (404 `E_RING_02` for anyone else, an admin included).
- Shared with me and the two counts go through the engine (`sharedWithFilter`, `countPeopleSharingWith`, `countLiveMembers`), blocks included.

### Gaps

- Nothing can create a `UserBlock` yet, so the block rule is enforced but unreachable. See [[F-14 Connections]].
- `GET /views/ring/:ringId` checks the Ring's window before the membership: an expired Ring answers *"Ring is not available"* (`E_RING_ACCESS_02`) to any caller, a Ring not shared *"This profile is not shared with you"* (`E_RING_ACCESS_01`). Someone holding a Ring id can tell that it existed and expired. Pending: whether a non-member should get the not-shared body.
- A company's card Ring readable by every member of the company ([[S-29 Companies Story]] P9): not built. Pending.
- New domains (events, meetings, PinCast, chat) must add their checks **here**, not in their own modules. Golden rule 8 in `CLAUDE.md`.

## Log

- 2026-10-18 · split out of [[F-08 Ring Access Engine]] when the vault moved to layers
- 2026-11-05 · `docs/backend/M-01-identity/F-08-ring-access/BD-08-engine-update` · brought up to backend `main` f186ba1: `sharedWithFilter`, `countPeopleSharingWith`, `countLiveMembers` (from `FR-03/ring/shared-with-me-blocks`); owner-only routes named; the `/views/ring` expired-body gap and [[S-29 Companies Story]] P9 added as `pending` (its flag cleared). [[FR-08 Ring Access Engine Frontend Requirements]] sent back to `draft` the same day on its own branch.
- 2026-11-05 · backend branch `FR-11/ring/settings-copy-default-shared` (`d1a6204`), pushed, **not merged** ([[BD-11 Rings Backend Delivery]]) · the engine gains `resolvePeopleSharingWith`: Shared with me per person on `sharedWithFilter` (one entry per owner, the Ring the viewer was put in first, the earlier of the Ring's and the membership's end), with the D-18 gate `isRingNamedToMember` (false for every membership until [[F-09 Ring Members]] records how one was made) and the D-04 gate on the member count (only on a named row whose Ring has `membersCanSeeEachOther`), so today no row names a Ring or counts its members ([[S-15 Ring Access Engine Story|Ring Access Engine · S1]], S8). The Ring carries the six settings; `membersCanInvite`, `membersCanSaveAttachments`, `joinPolicy` and `requireApproval` are stored and enforced when their flows ship. This note's sections describe `main` until the merge.
