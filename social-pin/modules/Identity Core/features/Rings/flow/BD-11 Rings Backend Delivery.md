---
id: BD-11
type: backend-delivery
module: identity
feature: rings
status: done
scope: feature
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
created: 2026-10-15
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Rings · Backend Delivery

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[D-05 Inherit per field, copy without members]] (2026-10-25): ND-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

**Feature:** [[F-11 Rings]] · **Status:** Done · **Integration guide:** [[BI-08 Rings Backend Integration]] · **Requirements:** [[FR-11 Rings Frontend Requirements]] · **QA:** [[Rings QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /rings`
- `GET /rings/shared-with-me`
- `POST /rings`
- `GET /rings/:id`
- `PATCH /rings/:id`
- `POST /rings/:id/default`
- `POST /rings/:id/disposition`
- `DELETE /rings/:id`

**Tables / models:** `Ring`, `RingTemplate`

**Code:** `src/modules/ring/`, `src/modules/ring/ring.query-builder.service.ts`

## How it works

`RingService` owns the lifecycle; every permission question goes to `RingAccessService`. `POST /rings` defaults the type to `PERSONAL`, rejects `EVENT` / `MINI_EVENT` / `MEETING` (400 `E_RING_01`, their own flows create them with a context behind them), checks the per-owner name clash and inserts in one transaction (409 `E_RING_01`), requires `parentRingId` and `profileId` to be the caller's own (400 `E_RING_06` / `E_RING_08`) and falls back to the default profile. `GET /rings` is scoped by `RingQueryBuilderService` (`name`, `type`, `status`, `isTemporary`; `deletedAt: null` in `defaultQuery`), default first then newest. `GET /rings/shared-with-me` applies `ringLiveFilter` **and** `membershipLiveFilter` from the engine, so only Rings the caller can read right now appear, newest first. `PATCH /rings/:id` passes through `assertCanAdminister(…, 'CONTENT_MANAGER')`, which ignores the Ring's expiry so an expired Ring stays editable. `POST /rings/:id/default` demotes then promotes in one transaction (partial unique index: one default per owner). `POST /rings/:id/disposition` runs `UNDECIDED → KEEP | MERGE | AUTO_DELETE`: `KEEP` clears the expiry and the temporary flag; `MERGE` needs another Ring of the same owner (400 `E_RING_07`), upserts every active member into the target with their window (an expired row there is reactivated rather than skipped), marks the source rows `REMOVED` and the Ring `ARCHIVED` with `mergedIntoRingId`; `AUTO_DELETE` archives and sets `expiresAt` to now, leaving the purge to the retention job. `DELETE /rings/:id` is a soft delete and refuses the default (409 `E_RING_04`), because a scanned QR needs one Ring that resolves. The backend never writes `RING_STATUS.EXPIRED`; expiry is evaluated live from the timestamps.

### What exists

- Filters: `name`, `type`, `status`, `isTemporary`. One default Ring per owner (partial unique index).
- `EVENT`, `MINI_EVENT` and `MEETING` Rings are rejected on `POST /rings`; their own flows create them.
- `POST /rings/:id/disposition` runs `UNDECIDED → KEEP | MERGE | AUTO_DELETE`; `AUTO_DELETE` archives and flags rather than deleting.
- Owner editing uses `assertCanAdminister`, which ignores expiry so an expired Ring stays editable.

### Gaps

- Lists carry no member counts ("148 people"). See [[F-03 Counts]].
- The create wizard's step 2 (who is in it, s19) and the Access / Permissions screens (s26, s27) need Ring settings the schema does not have. See [[ND-04 Ring settings]].
- "Copy a Ring" when creating (s18) has no endpoint. See [[ND-05 Copy or inherit]].
- The sweeper that materialises `RING_STATUS.EXPIRED` and purges `AUTO_DELETE` Rings is not written. See [[F-31 Cleanup Jobs]].

## Log

- 2026-10-18 · split out of [[F-11 Rings]] when the vault moved to layers
