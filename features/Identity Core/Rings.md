---
type: feature
id: rings
name: "Rings"
status: done
priority: P0
domain: identity
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
updated: 2026-10-18
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Rings

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]] · **Frontend guide:** [[Rings Frontend]] · **Story:** [[Rings Story]] · **Requirements:** [[Rings Requirements]]

My Rings and Shared-with-me lists, create a Ring with name, colour, type, expiry and temporary flag, edit, set default, delete, and the keep / merge / auto-delete disposition for temporary Rings.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s08|s08]] | First Ring | Default Ring is created by complete-registration |
| [[Screen Index#s09|s09]] | Create first Ring |  |
| [[Screen Index#s16|s16]] | My Rings |  |
| [[Screen Index#s17|s17]] | Shared with me | List done; review / decline invite todo |
| [[Screen Index#s18|s18]] | New Ring · step 1 | Copy a Ring → D-05 |
| [[Screen Index#s19|s19]] | New Ring · step 2 (who is in it) | Audience settings → D-04 |
| [[Screen Index#s20|s20]] | New Ring · step 3 (what it shows) | Field library → D-03 |
| [[Screen Index#s21|s21]] | New Ring · step 4 (how you appear) |  |
| [[Screen Index#s22|s22]] | Edit · name & purpose | Purpose → D-04 |
| [[Screen Index#s26|s26]] | Edit · access | Settings → D-04 |
| [[Screen Index#s62|s62]] | Post-event summary | Keep / merge / expire done |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Post-event|§8.5 Post-event]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

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

- Lists carry no member counts ("148 people"). See [[Counts]].
- The create wizard's step 2 (who is in it, s19) and the Access / Permissions screens (s26, s27) need Ring settings the schema does not have. See [[D-04 Ring settings]].
- "Copy a Ring" when creating (s18) has no endpoint. See [[D-05 Copy or inherit]].
- The sweeper that materialises `RING_STATUS.EXPIRED` and purges `AUTO_DELETE` Rings is not written. See [[Cleanup Jobs]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-059 Decide Ring settings]] | ❓ Needs a decision / info | P0 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "rings" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]
- [[D-05 Copy or inherit]]

## Related

- [[Ring Members]]
- [[Ring Projection]]
- [[Ring Access Engine]]
- [[Counts]]
- [[Delegated Admins]]
- [[Ring Invitations & Join]]
- [[Event Ring Auto-creation]]
- [[Cleanup Jobs]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
