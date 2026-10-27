---
type: backend-integration
code: rings
scope: feature
feature: rings
module: identity
status: current
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
created: 2026-10-15
updated: 2026-10-27
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Rings · Backend Integration

> ⚠ Affected by [[D-18 Ring names shown when joined knowingly]] (2026-10-25): `GET /rings/shared-with-me` may return a Ring's name only for a membership created by invitation, code or work email; never for a connection accept or an owner add (an exception to D-14).

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

> ⚠ Affected by [[D-05 Inherit per field, copy without members]] (2026-10-25): ND-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

> ⚠ Affected by [[D-14 Shared with me lists people, never the Ring]] (2026-10-25): ND-14 decided, option 2: Shared with me lists the people who share with me and never shows a Ring's name, colour or type to a member.

**Feature:** [[Rings]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Ring Access Model]]

What the client builds: My Rings and Shared with me, the create-a-Ring wizard (name, colour, type, expiry, temporary), edit, set default, delete, and the keep / merge / let-it-expire choice for a temporary Ring after its event.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s16\|s16]] My Rings | lists the Rings they own | `GET /rings` |
| [[Screen Index#s17\|s17]] Shared with me | lists Rings of others they are in | `GET /rings/shared-with-me` |
| [[Screen Index#s09\|s09]], [[Screen Index#s18\|s18]] – [[Screen Index#s21\|s21]] New Ring | creates one | `POST /rings`, then `PATCH /rings/:id/projection` for what it shows ([[Ring Projection Backend Integration]]) |
| [[Screen Index#s22\|s22]], [[Screen Index#s26\|s26]] Edit | renames, recolours, changes expiry | `PATCH /rings/:id` |
| s16 | makes one the default | `POST /rings/:id/default` |
| s16 | deletes one | `DELETE /rings/:id` |
| [[Screen Index#s62\|s62]] Post-event | keeps, merges or lets a temporary Ring go | `POST /rings/:id/disposition` |

## Flow

1. **My Rings.** `GET /rings?limit=20&skip=0` → `{ data: RingEntity[], meta: { total } }`, the default Ring first, then newest first. Filters: `name` (partial), `type`, `status`, `isTemporary` (`false` is a real filter). `limit` is capped at 50.
2. **Shared with me.** `GET /rings/shared-with-me` → the same envelope, newest first, containing **only Rings whose access is live right now** (the Ring's window, the membership's window, no block). It returns the Ring row (name, colour, type, owner id, expiry), not the owner's projection: to show the person, call `GET /views/ring/:id` ([[View As & Pin Views Backend Integration]]).
3. **Create.** `POST /rings` with `{ name, type?, parentRingId?, profileId?, startsAt?, expiresAt?, isTemporary?, colorHex?, style? }` → 201 `RingEntity`. The new Ring has a projection created on its first `GET /rings/:id/projection`; send the user on to "what it shows" next.
4. **Edit.** `PATCH /rings/:id` with any subset of the create fields. Allowed for the owner or a delegated admin at `CONTENT_MANAGER` level or above; otherwise 403 `E_RING_05`.
5. **Default.** `POST /rings/:id/default` → 201 with the Ring. The previous default is demoted in the same transaction. The default Ring is what a scanned QR or a Pin-name lookup resolves to for someone who is in no other Ring of this person.
6. **Delete.** `DELETE /rings/:id` → 200. Soft delete. The default Ring cannot be deleted (409 `E_RING_04`): make the user pick another default first.
7. **Disposition** (temporary Rings, s62). `POST /rings/:id/disposition` with `{ disposition, mergedIntoRingId? }` → 201 with the updated Ring:
   - `KEEP`: the Ring becomes permanent (`isTemporary: false`, `expiresAt: null`, `ACTIVE`).
   - `MERGE`: requires `mergedIntoRingId`, another Ring of the same owner (400 `E_RING_07` otherwise). Every active member moves to the target with their access window; the source becomes `ARCHIVED` with `mergedIntoRingId` set.
   - `AUTO_DELETE`: the Ring becomes `ARCHIVED` and expires now. It is flagged, not deleted, so the owner can still change their mind until the retention job runs ([[Cleanup Jobs]], not written).

## Shapes that matter

`RingEntity`: `id`, `ownerUserId`, `name`, `type`, `parentRingId`, `profileId`, `isDefault`, `isTemporary`, `startsAt`, `expiresAt`, `status`, `disposition`, `mergedIntoRingId`, `colorHex`, `style`, `createdAt`, `updatedAt`.

- `name`: 1 to 80 characters, unique per owner (409 `E_RING_01`).
- `type`: `PERSONAL` (default) or `CORPORATE`. `EVENT`, `MINI_EVENT` and `MEETING` are rejected with 400 `E_RING_01`; their own flows create them.
- `parentRingId` and `profileId` must be the caller's own (400 `E_RING_06` / `E_RING_08`). `profileId` defaults to the default profile.
- `startsAt` / `expiresAt`: ISO datetimes; `null` clears. Expiry is enforced server-side on every access resolution, exclusive at the instant.
- `colorHex`: `#RRGGBB`. `style`: a free-form JSON object for the badge theme; the backend stores, it does not interpret.
- `status`: `ACTIVE`, `EXPIRED`, `ARCHIVED`, `DELETED`. **`EXPIRED` is never set by the backend today** (expiry is evaluated live from `expiresAt`). An expired Ring still reads `status: "ACTIVE"` with a past `expiresAt`: compute the "expired" chip on the client from `expiresAt`.
- `disposition`: `UNDECIDED`, `KEEP`, `MERGE`, `AUTO_DELETE`. Show the s62 choice when `isTemporary` and `disposition === "UNDECIDED"` and `expiresAt` is past (or the event ended).

## State to keep on the client

Cache the owned list and the shared list separately, keyed by the signed-in user. The shared list changes without any action of the viewer (the owner reassigns, a Ring expires): refetch on screen focus. Nothing on the shared list carries the viewer's membership row, by design.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 409 | `E_RING_01` | another Ring of yours has this name | inline |
| 400 | `E_RING_01` | type `EVENT` / `MINI_EVENT` / `MEETING` on `POST /rings` | should not happen from the UI: do not offer those types |
| 404 | `E_RING_02` | not one of your Rings (or deleted) | treat as missing |
| 403 | `E_RING_05` | delegated admin below the needed level | read-only state |
| 400 | `E_RING_06` / `E_RING_08` | parent Ring or profile is not yours | validation |
| 400 | `E_RING_07` | MERGE without a different Ring of yours | ask for a target |
| 409 | `E_RING_04` | deleting the default Ring | "Choose another default first" |

## Rules the UI must respect

- A member of a Ring sees the Ring's name and colour on Shared with me, and the owner's projection through `/views`. They never see the roster or their own membership row.
- An expired Ring is unreadable by its members but **stays editable** by its owner (the keep / merge / delete choice depends on it). My Rings should still list it; Shared with me will not.
- Do not offer `EVENT`, `MINI_EVENT` or `MEETING` in the type picker; they arrive from the event and meeting flows.

## Not available yet

- Member counts on the list ("148 people"): [[Counts Story|Counts · S6–S10]].
- Who the Ring is for, join policy, "members can see each other", required email domain (s19, s22, s26, s27): [[ND-04 Ring settings]].
- "Copy a Ring" when creating (s18): [[ND-05 Copy or inherit]].
- Review / decline an invitation on Shared with me (s17): [[T-026 Ring invitations invite, review, decline]].
- The sweeper that purges `AUTO_DELETE` Rings: [[T-054 Cleanup jobs]].

## Checklist

- [ ] My Rings: default first, "expired" computed from `expiresAt`, temporary badge from `isTemporary`.
- [ ] Shared with me: refetch on focus; open a Ring through `/views/ring/:id`.
- [ ] Create wizard: type picker limited to `PERSONAL` / `CORPORATE`; name uniqueness error inline.
- [ ] Delete guarded by "is default".
- [ ] Post-event: the three dispositions, MERGE with a picker of the owner's other Rings.
