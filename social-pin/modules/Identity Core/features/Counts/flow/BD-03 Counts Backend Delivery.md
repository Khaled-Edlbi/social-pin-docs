---
id: BD-03
type: backend-delivery
module: identity
feature: counts
status: in-progress
scope: feature
screens: [s11, s12, s14, s16, s17, s68]
depends: ["FR-03 Counts Frontend Requirements", "S-03 Counts Story"]
affects: ["BI-14 Counts Backend Integration", "FR-03 Counts Frontend Requirements"]
related: ["F-11 Rings", "BD-11 Rings Backend Delivery", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "GET /rings", "GET /rings/:id", "GET /rings/shared-with-me", E_RING_02]
pending: ["[[FR-03 Counts Frontend Requirements]]: memberCount on GET /rings and GET /rings/:id (Counts · S6–S10) is built on the backend branch FR-03/ring/member-count (f5b48c7) and waits on its merge to main; then this note records the merge, FR-03's row flips ✅ and BI-14 goes current"]
created: 2026-10-18
updated: 2026-11-05
tags: [backend-delivery, backend-delivery/in-progress, module/identity, layer/backend]
---

# 🟡 Counts · Backend Delivery

**Feature:** [[F-03 Counts]] · **Status:** In progress · **Integration guide:** [[BI-14 Counts Backend Integration]] · **Requirements:** [[FR-03 Counts Frontend Requirements]] · **QA:** [[Counts QA Backend]]

What the backend built for this feature and how it works. [[S-03 Counts Story|Counts · S6–S10]] (the live member count per Ring) is built on the backend branch `FR-03/ring/member-count` and **not merged to `main` yet**: nothing below is available to the client until it is. [[S-03 Counts Story|Counts · S11]] (connections on Me) is not started.

## Endpoints, tables and code

**Endpoints** (no new route; two existing ones gain a field, on the branch)

| Method | Path | Auth | Who may call it | What changes |
|---|---|---|---|---|
| `GET` | `/rings` | bearer | any signed-in user, for their own Rings | every Ring carries `memberCount` |
| `GET` | `/rings/:id` | bearer | the Ring's owner; anyone else gets 404 `E_RING_02` | the Ring carries `memberCount` |
| `GET` | `/rings/shared-with-me` | bearer | any signed-in user | unchanged: **no** `memberCount`, by design (S10) |

**Tables / models:** `RingMember`, `Ring`, `UserBlock` (read only; no schema change, no migration)

**Code:** `src/modules/ring-access/ring-access.service.ts` (`countLiveMembers`), `src/modules/ring/ring.service.ts` (`findOwned`, `findOneForOwner`), `src/modules/ring/entities/owned-ring.entity.ts` (`OwnedRingEntity`), `src/modules/ring/ring.controller.ts`

## How it works

- **The count is a visibility question, so it lives in the access engine.** `RingAccessService.countLiveMembers(ownerUserId, ringIds, now)` is the only code that counts members; `RingService` never queries `ring_members` for it ([[Ring Access Model]]).
- **Live members only, with the engine's own filters.** A member counts while `membershipLiveFilter(now)` holds (status `ACTIVE`, the membership's `startsAt` ≤ now < `expiresAt`), the Ring passes `ringLiveFilter(now)` (status `ACTIVE`, not deleted, the Ring's own window open) and no block stands between the member and the owner, in either direction: the same three rules every read path applies. So a removed, left or pending member is not counted, nor one whose window closed, and an expired, archived or deleted Ring counts 0. Expiry is exclusive, as on read: at the `expiresAt` instant the member (or the Ring) no longer counts.
- **Evaluated against `now` on every request**, nothing cached: an add, remove, reassign or an expiry shows on the next fetch.
- **One grouped query per page.** `GET /rings` reads the page, then one `groupBy` on `ring_members` by `ringId` for all the page's Ring ids; a Ring absent from the result is a real 0. `GET /rings/:id` runs the same count for one id. Never a query per Ring.
- **Owner-only.** The owner's routes return `OwnedRingEntity` (`RingEntity` + `memberCount`); `GET /rings/shared-with-me` keeps `RingEntity`, which has no such field, so the size of someone else's Ring cannot reach a member even if a service handed it one (the serializer's allow-list drops it). The count is also scoped to `ownerUserId` in the query itself.
- **Errors.** `GET /rings/:id` answers 404 `E_RING_02` for a Ring that is gone and for one that is not yours alike, and counts nothing in that case. `memberCount` adds no error of its own.
- **Not the roster.** `GET /rings/:ringId/members?status=ACTIVE` → `meta.total` still counts `ACTIVE` rows whose window has lapsed; `memberCount` is the number to show.

### What exists

- On the branch `FR-03/ring/member-count` (`f5b48c7`), not on `main`: `memberCount` on every owned Ring in `GET /rings` and on `GET /rings/:id` (Counts · S6, S7, S8, S9, S10).
- Specs: `ring-access.service.spec.ts` (one grouped query; a real 0; the membership filter, the Ring filter and the block rule in the query), `ring.service.spec.ts` (the count on the list and the detail; 404 `E_RING_02` without counting; shared-with-me never counted), `owned-ring.entity.spec.ts` (`memberCount` on `GET /rings`, absent on `GET /rings/shared-with-me`). `pnpm typecheck` clean, `pnpm test` 281 passed. The grouped query was also run once, read only, against a local PostgreSQL.
- On `main` already: the number of Rings I own, `meta.total` of `GET /rings`.

### Gaps

- Nothing of S6–S10 is on `main` until `FR-03/ring/member-count` is merged.
- **Connections on Me** ([[S-03 Counts Story|Counts · S11]]): no endpoint; connections themselves do not exist yet ([[F-14 Connections]]).
- **"Shared with me · N" as people**: no endpoint counts the people sharing with me; `meta.total` of `GET /rings/shared-with-me` counts live Rings, so someone sharing two Rings counts twice ([[D-14 Shared with me lists people, never the Ring]]). No story part covers it yet.
- **"N added today"** on Home is not built (an open question of the story).
- A member-side count for a Ring with "members can see each other" on is not built; that setting does not exist yet ([[D-04 Ring settings at launch and their defaults]]).

## Log

- 2026-10-18 · split out of [[F-03 Counts]] when the vault moved to layers
- 2026-11-05 · backend branch `FR-03/ring/member-count` (`f5b48c7`), pushed, **not merged** · Counts · S6–S10: `memberCount` on `GET /rings` and `GET /rings/:id`, live members only (the engine's membership and Ring filters plus the block rule, through `RingAccessService.countLiveMembers`), one grouped query per page, owner-only (`GET /rings/shared-with-me` has no `memberCount`). No new error code, no migration. 281 tests pass. Wrote [[BI-14 Counts Backend Integration]] as `draft`. The rows of [[FR-03 Counts Frontend Requirements]] stay ❌ until the merge; flagged nothing. This note stays `in-progress` with the merge in `pending`.
