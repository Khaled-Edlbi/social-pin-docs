---
id: BD-03
type: backend-delivery
module: identity
feature: counts
status: done
scope: feature
screens: [s11, s12, s14, s16, s17, s68]
depends: ["FR-03 Counts Frontend Requirements", "S-03 Counts Story"]
affects: ["BI-14 Counts Backend Integration", "FR-03 Counts Frontend Requirements"]
related: ["F-11 Rings", "BD-11 Rings Backend Delivery", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "GET /rings", "GET /rings/:id", "GET /rings/shared-with-me", "GET /rings/shared-with-me/count", "GET /connections/count", "GET /connections", "BD-14 Connections Backend Delivery", E_RING_02]
pending: []
created: 2026-10-18
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Counts · Backend Delivery

**Feature:** [[F-03 Counts]] · **Status:** Done · **Integration guide:** [[BI-14 Counts Backend Integration]] · **Requirements:** [[FR-03 Counts Frontend Requirements]] · **QA:** [[QB-07 Counts QA Backend]]

What the backend shipped for this feature and how it works. On `main` since 2026-11-05 (`f186ba1`): the live member count per Ring ([[S-03 Counts Story|Counts · S6–S10]]) and the people count on Shared with me ([[S-03 Counts Story|Counts · S2]]). The connection count on Me ([[S-03 Counts Story|Counts · S11]]) shipped with [[F-14 Connections]] on `main` `1c460b0` (2026-11-08), built and documented in [[BD-14 Connections Backend Delivery]].

## Endpoints, tables and code

**Endpoints** (two existing routes gained a field, one route is new)

| Method | Path | Auth | Who may call it | What it gives Counts |
|---|---|---|---|---|
| `GET` | `/rings` | bearer | any signed-in user, for their own Rings | every Ring carries `memberCount`; `meta.total` is the number of Rings I own |
| `GET` | `/rings/:id` | bearer | the Ring's owner; anyone else gets 404 `E_RING_02` | the Ring carries `memberCount` |
| `GET` | `/rings/shared-with-me` | bearer | any signed-in user | **no** `memberCount`, by design (S10) |
| `GET` | `/rings/shared-with-me/count` | bearer | any signed-in user, about themselves | `{ "people": N }`, the people sharing with me (S2) |
| `GET` | `/connections/count` | bearer | any signed-in user, about themselves | `{ "connections": N }`, "N connections" on Me (S11); built by [[BD-14 Connections Backend Delivery]] |

**Tables / models:** `RingMember`, `Ring`, `User`, `UserBlock` (read only; no schema change, no migration)

**Code:** `src/modules/ring-access/ring-access.service.ts` (`countLiveMembers`, `countPeopleSharingWith`, `sharedWithFilter`), `src/modules/ring/ring.service.ts` (`findOwned`, `findOneForOwner`, `findSharedWithMe`, `countSharedWithMe`), `src/modules/ring/entities/owned-ring.entity.ts` (`OwnedRingEntity`), `src/modules/ring/entities/shared-with-me-count.entity.ts` (`SharedWithMeCountEntity`), `src/modules/ring/ring.controller.ts`

## How it works

- **Every count is a visibility question, so it lives in the access engine.** `RingAccessService.countLiveMembers` and `countPeopleSharingWith` are the only code that counts; `RingService` never queries `ring_members` for it ([[Ring Access Model]]).
- **Live members only, with the engine's own filters.** A member counts while `membershipLiveFilter(now)` holds (status `ACTIVE`, the membership's `startsAt` ≤ now < `expiresAt`), the Ring passes `ringLiveFilter(now)` (status `ACTIVE`, not deleted, the Ring's own window open) and no block stands between the member and the owner, in either direction: the same three rules every read path applies. So a removed, left or pending member is not counted, nor one whose window closed, and an expired, archived or deleted Ring counts 0. Expiry is exclusive, as on read: at the `expiresAt` instant the member (or the Ring) no longer counts.
- **Evaluated against `now` on every request**, nothing cached: an add, remove, reassign or an expiry shows on the next fetch.
- **One grouped query per page.** `GET /rings` reads the page, then one `groupBy` on `ring_members` by `ringId` for all the page's Ring ids; a Ring absent from the result is a real 0. `GET /rings/:id` runs the same count for one id. Never a query per Ring.
- **Owner-only.** The owner's routes return `OwnedRingEntity` (`RingEntity` + `memberCount`); `GET /rings/shared-with-me` keeps `RingEntity`, which has no such field, so the size of someone else's Ring cannot reach a member even if a service handed it one (the serializer's allow-list drops it). The count is also scoped to `ownerUserId` in the query itself.
- **People sharing with me (S2).** `GET /rings/shared-with-me/count` → `{ "people": N }`: one `COUNT` over the users who own at least one Ring matching `RingAccessService.sharedWithFilter(viewer, now)` (the Ring is live, the caller's membership in it is live, no block between the caller and the owner either way, never the caller's own Ring). A person sharing two Rings counts once. The body is the number only: nothing that names or counts a Ring. The list `GET /rings/shared-with-me` uses the same filter ([[BD-11 Rings Backend Delivery]]), so the people count and the list cannot disagree; the list's `meta.total` counts Rings, the count route counts people.
- **Errors.** `GET /rings/:id` answers 404 `E_RING_02` for a Ring that is gone and for one that is not yours alike, and counts nothing in that case. No count adds an error of its own.
- **Connections on Me (S11).** `GET /connections/count` → `{ "connections": N }`: my `ACTIVE` connections whose other side still has an account, each person once (one row per pair). A contact with *No access* (in none of my Rings) counts; a disconnected, blocked or deleted person and every request (pending, declined, expired) do not. It uses the same `where` as `GET /connections`, so it always equals that list's `meta.total`. The code is F-14's (`ConnectionService.count`); see [[BD-14 Connections Backend Delivery]].
- **Not the roster.** `GET /rings/:ringId/members?status=ACTIVE` → `meta.total` still counts `ACTIVE` rows whose window has lapsed; `memberCount` is the number to show.

### What exists

- On `main` (`1c460b0`, with F-14): `GET /connections/count` (Counts · S11).
- On `main` (`f186ba1`): `memberCount` on every owned Ring in `GET /rings` and on `GET /rings/:id` (Counts · S6, S7, S8, S9, S10); `GET /rings/shared-with-me/count` (Counts · S2); the number of Rings I own, `meta.total` of `GET /rings`.
- Specs: `ring-access.service.spec.ts` (one grouped query; a real 0; the membership filter, the Ring filter and the block rule; people counted, not Rings; `sharedWithFilter`), `ring.service.spec.ts` (the count on the list and the detail; 404 `E_RING_02` without counting; shared-with-me never counted; list and total from one filter), `owned-ring.entity.spec.ts` (`memberCount` on `GET /rings`, absent on `GET /rings/shared-with-me`; the count body is `{ people }` only). `pnpm typecheck` clean, `pnpm test` 288 passed on `main` `f186ba1`. Both queries were run against a local PostgreSQL, the block rule inside a rolled-back transaction.

### Gaps

- `GET /rings/shared-with-me` itself still lists Rings, not people; the people list is [[S-15 Ring Access Engine Story|Ring Access Engine · S1]] ([[D-14 Shared with me lists people, never the Ring]]).
- **"N added today"** on Home is not built (an open question of the story).
- A member-side count for a Ring with "members can see each other" on is not built; that setting does not exist yet ([[D-04 Ring settings at launch and their defaults]]).

## Log

- 2026-10-18 · split out of [[F-03 Counts]] when the vault moved to layers
- 2026-11-05 · backend branch `FR-03/ring/member-count` (`f5b48c7`), pushed, **not merged** · Counts · S6–S10: `memberCount` on `GET /rings` and `GET /rings/:id`, live members only (the engine's membership and Ring filters plus the block rule, through `RingAccessService.countLiveMembers`), one grouped query per page, owner-only (`GET /rings/shared-with-me` has no `memberCount`). No new error code, no migration. 281 tests pass. Wrote [[BI-14 Counts Backend Integration]] as `draft`. The rows of [[FR-03 Counts Frontend Requirements]] stay ❌ until the merge; flagged nothing. This note stays `in-progress` with the merge in `pending`.
- 2026-11-05 · backend branch `FR-03/ring/shared-people-count` (`f516afd`, stacked on `FR-03/ring/member-count`), pushed, **not merged** · Counts · S2: `GET /rings/shared-with-me/count` → `{ people }`, one per person, live access only, blocks excluded both ways, through `RingAccessService.countPeopleSharingWith`. No new error code, no migration. 286 tests pass. [[BI-14 Counts Backend Integration]] updated (still `draft`). Found: the list `GET /rings/shared-with-me` does not exclude blocked pairs, which [[BI-08 Rings Backend Integration]] says it does; written under *Gaps*, not fixed here. FR-03's rows stay ❌ until the merge; flagged nothing. Counts · S11 stays unbuilt: no route creates connections yet, and S11 forbids "0 connections" before they exist.
- 2026-11-05 · backend branch `FR-03/ring/shared-with-me-blocks` (`0747754`, stacked on `FR-03/ring/shared-people-count`), pushed, **not merged** · the block rule on `GET /rings/shared-with-me`, found above: `RingAccessService.sharedWithFilter` now defines "shared with me" once, for the list, its `meta.total` and `GET /rings/shared-with-me/count`. 288 tests pass; checked on a local PostgreSQL in a rolled-back transaction. Recorded on [[BD-11 Rings Backend Delivery]] (Partial until the merge) and corrected in [[BI-08 Rings Backend Integration]]. Merge order: `FR-03/ring/member-count`, `FR-03/ring/shared-people-count`, `FR-03/ring/shared-with-me-blocks`.
- 2026-11-05 · backend `main` `f186ba1` (merge of `FR-03/ring/shared-with-me-blocks`, carrying `f5b48c7`, `f516afd`, `0747754`) · **shipped**: Counts · S6–S10 `memberCount` on `GET /rings` and `GET /rings/:id`, and the Shared-with-me people count `GET /rings/shared-with-me/count` (S2). Typecheck clean, 288/288 tests, rerun on `main` `f186ba1` itself. This note → `done`; the merge entries leave `pending`, which keeps only Counts · S11 (connections, waits on [[BD-14 Connections Backend Delivery]]), so the note reads Partial. [[BI-14 Counts Backend Integration]] → `current`. The rows of [[FR-03 Counts Frontend Requirements]] that shipped → ✅ with the endpoint; connections stay ❌. The feature's `**Backend:**` line and the module's *Backend* column stay Partial (S11 is open). Flagged nothing.
- 2026-11-08 · backend `main` `1c460b0` (F-14 merged as `25fcc8c`; S11 came with `FR-14/connection/requests-accept-contacts-block`, `4beb29e`) · **shipped** Counts · S11: `GET /connections/count` → `{ connections }`, accepted connections, each person once, equal to `meta.total` of `GET /connections`. The S11 entry leaves `pending`, which is now empty, so this note reads Done. The connections row of [[FR-03 Counts Frontend Requirements]] → ✅ with the endpoint. [[BI-14 Counts Backend Integration]] is corrected on its own branch. Rerun on `main` by the parent session: typecheck clean, 981/981 tests.
