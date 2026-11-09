---
id: BI-08
type: backend-integration
module: identity
feature: rings
status: current
scope: feature
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
related: ["BD-11 Rings Backend Delivery", "D-03 Links entered once, switched on or off per Ring", "BI-14 Counts Backend Integration", "BI-09 View As & Pin Views Backend Integration", "D-04 Ring settings at launch and their defaults", "D-05 Inherit per field, copy without members", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "GET /rings/shared-with-me", "GET /rings/shared-with-me/count", "POST /rings/:id/copy", "POST /rings/:id/default", "PATCH /rings/:id", "POST /rings/:id/disposition", "E_RING_09", "E_RING_10"]
created: 2026-10-15
updated: 2026-11-08
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Rings · Backend Integration

> ⚠ Affected by [[FD-12 Rings Frontend Delivery]] (2026-11-09): app @ 0005f00 shows named Shared with me rows from ringName / memberCount and the invitation and join-code flows; 'Rules the UI must respect' still says ringName is set 'never today', and 'Not available yet' still lists a Ring's name on Shared with me and joining by code, approvals and member invitations, all shipped since main 1c460b0 (/backend)

**Feature:** [[F-11 Rings]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Ring Access Model]]

Matches backend `main` `e483d49` ([[BD-11 Rings Backend Delivery]]).

What the client builds: My Rings and Shared with me, the create-a-Ring wizard (name, colour, expiry, temporary, copy, settings), edit, set default, delete, and the keep / merge / let-it-expire choice for a temporary Ring after its event.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s16\|s16]] My Rings | lists the Rings they own, with the purpose on each row | `GET /rings` |
| [[Screen Index#s17\|s17]] Shared with me | lists the **people** who share with them | `GET /rings/shared-with-me`, then `GET /views/ring/:ringId` on tap |
| [[Screen Index#s09\|s09]], [[Screen Index#s18\|s18]] – [[Screen Index#s21\|s21]] New Ring | creates one (Blank or Event Ring) | `POST /rings`, then `PATCH /rings/:id/projection` for what it shows ([[BI-07 Ring Projection Backend Integration]]) |
| [[Screen Index#s18\|s18]] "Copy an existing Ring" | creates one from another of theirs | `POST /rings/:id/copy` |
| [[Screen Index#s21\|s21]], [[Screen Index#s22\|s22]], [[Screen Index#s26\|s26]], [[Screen Index#s27\|s27]] | changes the purpose and the settings | `PATCH /rings/:id` (settings fields) |
| [[Screen Index#s22\|s22]], [[Screen Index#s26\|s26]] Edit | renames, recolours, changes expiry | `PATCH /rings/:id` |
| s26 | makes one the default | `POST /rings/:id/default` (refuses a temporary Ring) |
| s26 | deletes one | `DELETE /rings/:id` |
| [[Screen Index#s62\|s62]] Post-event | keeps, merges or lets a temporary Ring go | `POST /rings/:id/disposition` |

## Flow

1. **My Rings.** `GET /rings?limit=20&skip=0` → `{ data: OwnedRingEntity[], meta: { total } }`, the default Ring first, then newest first. Filters: `name` (partial), `type`, `status`, `isTemporary` (`false` is a real filter: `?isTemporary=false` lists the permanent Rings; any value other than `true` / `false` is 400). `limit` is capped at 50. Each Ring carries `memberCount` ([[BI-14 Counts Backend Integration]]) and its six settings, `purpose` included for the row's short line.
2. **Shared with me.** `GET /rings/shared-with-me?limit=20&skip=0` → `{ data: SharedWithMePersonEntity[], meta: { total } }`: **one row per person** who shares at least one Ring with you right now (the Ring live, your membership live, no block between you either way), newest first (the person who most recently started sharing). `meta.total` is the number of people and equals `GET /rings/shared-with-me/count` → `{ people }`. Pagination only: `name`, `type`, `status`, `isTemporary` are **rejected with 400** here. Tapping a row opens `GET /views/ring/:ringId` with the row's `ringId` ([[BI-09 View As & Pin Views Backend Integration]]).
3. **Create.** `POST /rings` with `{ name, type?, parentRingId?, profileId?, startsAt?, expiresAt?, isTemporary?, colorHex?, style?, purpose?, joinPolicy?, requireApproval?, membersCanSeeEachOther?, membersCanInvite?, membersCanSaveAttachments? }` → 201 `RingEntity`. Leave the six settings out and the server applies D-04's private defaults (never send defaults from the client). Booleans are JSON `true` / `false` (the strings `"true"` / `"false"` are read the same); any other value (`"yes"`, `"0"`, `1`, `null`) is 400, never a switch turned on. The new Ring has a projection created on its first `GET /rings/:id/projection`; send the user on to "what it shows" next.
4. **Copy.** `POST /rings/:id/copy` with `{ name, colorHex?, style?, purpose? }` → 201 `RingEntity` of the **new** Ring: the source's settings, colour, style, purpose and profile (each of colour, style, purpose overridable), and its projection: bio, photo, and **the same library items switched on** ([[D-03 Links entered once, switched on or off per Ring]]; the same links and info blocks from the owner's library, in the same order, hidden ones staying hidden, nothing new in the library, so editing a library item later changes it on both Rings); **no members, no admins, no window**; always `PERSONAL`, permanent, not the default. The two Rings are independent afterwards. Owner-only.
5. **Edit.** `PATCH /rings/:id` with any subset of the create fields, the settings included. `null` clears only `purpose`, `colorHex`, `style`, `startsAt`, `expiresAt` and `parentRingId` (detaches the parent); `null` on any other field is a 400: to leave a field as it is, leave it out. Allowed for the owner or a delegated admin at `CONTENT_MANAGER` level or above; otherwise 403 `E_RING_05`.
6. **Default.** `POST /rings/:id/default` → 201 with the Ring. The previous default is demoted in the same transaction. The default Ring is what a scanned QR or a Pin-name lookup resolves to for someone who is in no other Ring of this person. A temporary Ring is refused with 409 `E_RING_09`, and so is `PATCH /rings/:id { isTemporary: true }` on the current default. Owner-only.
7. **Delete.** `DELETE /rings/:id` → 200. Soft delete. The default Ring cannot be deleted (409 `E_RING_04`): make the user pick another default first. Owner-only.
8. **Disposition** (temporary Rings, s62). `POST /rings/:id/disposition` with `{ disposition, mergedIntoRingId? }` → 201 with the updated Ring. Only for a temporary Ring whose window has ended (`isTemporary` and `expiresAt` past, the moment s62 is offered): a permanent Ring, the default Ring, a temporary Ring still live or with no `expiresAt` is 409 `E_RING_10`, and nothing changes. `disposition` is one of the three below; `UNDECIDED` is 400. The owner can change their mind while the Ring is still temporary (`AUTO_DELETE`, then `KEEP`); after `KEEP` it is permanent and disposition is refused.
   - `KEEP`: the Ring becomes permanent (`isTemporary: false`, `expiresAt: null`, `ACTIVE`).
   - `MERGE`: requires `mergedIntoRingId`, another Ring of the same owner (400 `E_RING_07` otherwise). Every active member moves to the target with their access window; the source becomes `ARCHIVED` with `mergedIntoRingId` set.
   - `AUTO_DELETE`: the Ring becomes `ARCHIVED` and expires now. It is flagged, not deleted, so the owner can still change their mind until the retention job runs ([[F-31 Cleanup Jobs]], not written).

## Shapes that matter

`RingEntity` (owner only): `id`, `ownerUserId`, `name`, `type`, `parentRingId`, `profileId`, `isDefault`, `isTemporary`, `startsAt`, `expiresAt`, `status`, `disposition`, `mergedIntoRingId`, `colorHex`, `style`, `purpose`, `joinPolicy`, `requireApproval`, `membersCanSeeEachOther`, `membersCanInvite`, `membersCanSaveAttachments`, then `createdAt`, `updatedAt`. `OwnedRingEntity` (`GET /rings`, `GET /rings/:id`) adds `memberCount`.

- `name`: 1 to 80 characters, unique per owner (409 `E_RING_01`).
- `type`: `PERSONAL` (default) or `CORPORATE`. `EVENT`, `MINI_EVENT` and `MEETING` are rejected with 400 `E_RING_01`; their own flows create them.
- `parentRingId` and `profileId` must be the caller's own (400 `E_RING_06` / `E_RING_08`). `profileId` defaults to the default profile.
- `startsAt` / `expiresAt`: ISO datetimes; `null` clears. Expiry is enforced server-side on every access resolution, exclusive at the instant.
- `colorHex`: `#RRGGBB`. `style`: a free-form JSON object for the badge theme and the icon; the backend stores, it does not interpret.
- `status`: `ACTIVE`, `EXPIRED`, `ARCHIVED`, `DELETED`. **`EXPIRED` is never set by the backend today** (expiry is evaluated live from `expiresAt`). An expired Ring still reads `status: "ACTIVE"` with a past `expiresAt`: compute the "expired" chip on the client from `expiresAt`.
- `disposition`: `UNDECIDED`, `KEEP`, `MERGE`, `AUTO_DELETE`. Show the s62 choice when `isTemporary` and `disposition === "UNDECIDED"` and `expiresAt` is past (or the event ended).

**The six settings ([[D-04 Ring settings at launch and their defaults]]):**

| Field | Values | Default on a new Ring | Enforced today |
|---|---|---|---|
| `purpose` | string, 1–140 after trim, or `null` | `null` | owner-only label, never shown to a member |
| `joinPolicy` | `ANYONE_WHO_SCANS` · `CODE_OR_INVITATION` · `INVITATION_ONLY` | `CODE_OR_INVITATION` | yes, since `main` `1c460b0`: a join code works under the first two, never `INVITATION_ONLY`; an invitation works under all three ([[BI-17 Ring Invitations & Join Backend Integration]]) |
| `requireApproval` | boolean ("approve each one"; `false` = auto-accept) | `true` | yes: on, a code makes a join request the owner approves; off, it joins at once (BI-17) |
| `membersCanSeeEachOther` | boolean | `false` | yes: off means no member-facing roster or count anywhere |
| `membersCanInvite` | boolean | `false` | yes: a live member may invite only while it is on (BI-17) |
| `membersCanSaveAttachments` | boolean | `false` | saved; enforced when a save flow exists |

s26's summary uses the same words ("Only with a code"); "Permissions · N set" counts only the settings shown. Show the three later settings nowhere.

**Shared with me, before and after** (the shape changed with backend `main` `12172c6`):

| | before (`main` f186ba1) | now (`main` 12172c6) |
|---|---|---|
| Envelope | `{ data: RingEntity[], meta: { total } }` | `{ data: SharedWithMePersonEntity[], meta: { total } }` |
| One row per | Ring you are in (two Rings of one person = two rows) | **person** who shares with you |
| Row fields | `id`, `ownerUserId`, `name`, `type`, `parentRingId`, `profileId`, `isDefault`, `isTemporary`, `startsAt`, `expiresAt`, `status`, `disposition`, `mergedIntoRingId`, `colorHex`, `style`, `createdAt`, `updatedAt` | `ringId`, `pinName`, `displayName`, `avatarUrl`, `expiresAt`, `ringName`, `memberCount` |
| `meta.total` | Rings | people (= `GET /rings/shared-with-me/count`) |
| Ordering | newest Ring first | the person who started sharing most recently first |
| Query params | pagination + `name`, `type`, `status`, `isTemporary` | pagination only; any Ring filter is 400 |

`SharedWithMePersonEntity`:

```json
{
  "ringId": "7a1e…",
  "pinName": "SamKassem",
  "displayName": "Sam Kassem",
  "avatarUrl": "https://…/files/content/<signed token>",
  "expiresAt": null,
  "ringName": null,
  "memberCount": null
}
```

- `ringId`: only to open `GET /views/ring/:ringId`; never show it, never compare it. When the person shares several Rings with you, it is the oldest one you joined knowingly, else the one you were put in first ([[D-15 Several Rings per connection, remove or disconnect]]; the knowing one first since `main` `1c460b0`).
- `pinName`, `displayName`, `avatarUrl`: the person as the card they share with you renders them (the card's own name, else their profile name; the signed photo link, D-16). `pinName` is `null` only for an account with no profile left; `displayName` and `avatarUrl` may be `null` (render a placeholder).
- `expiresAt`: when that card stops being shared with you (the earlier of the Ring's end and your membership's end); `null` = no end.
- `ringName`: the Ring's name **only for a Ring you joined knowingly**: an invitation you accepted, a join code, a join request the owner approved ([[D-18 Ring names shown when joined knowingly]], [[BI-17 Ring Invitations & Join Backend Integration]], since `main` `1c460b0`). `null` for a Ring you were placed in (added by the owner or an admin, a connection accepted into it, a reassign). Never use anything else as a Ring title.
- `memberCount`: only on a row with a `ringName` whose Ring lets members see each other; `null` otherwise. Never show "· N people" when it is `null`.
- Never on a row: a Ring's colour, type, style, settings, the owner's user id, or anything about your membership.

## State to keep on the client

Cache the owned list and the shared list separately, keyed by the signed-in user (`rings:<userId>`, `rings-shared:<userId>`). The shared list changes without any action of the viewer (the owner reassigns, a Ring expires): refetch on screen focus. Nothing on the shared list carries the viewer's membership row, by design. After `POST /rings/:id/copy`, refetch `GET /rings`.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 409 | `E_RING_01` | another Ring of yours has this name (create, edit, copy) | inline |
| 400 | `E_RING_01` | type `EVENT` / `MINI_EVENT` / `MEETING` on `POST /rings` | should not happen from the UI: do not offer those types |
| 404 | `E_RING_02` | not one of your Rings (or deleted); also any non-owner on set-default, copy, disposition, delete | treat as missing |
| 403 | `E_RING_05` | delegated admin below the needed level on `PATCH` | read-only state |
| 400 | `E_RING_06` / `E_RING_08` | parent Ring or profile is not yours | validation |
| 400 | `E_RING_07` | MERGE without a different Ring of yours | ask for a target |
| 409 | `E_RING_04` | deleting the default Ring | "Choose another default first" |
| 409 | `E_RING_10` | disposition on a Ring that is not temporary (the default included) or whose window has not ended | should not happen from the UI: offer s62 only when `isTemporary` and `expiresAt` is past |
| 409 | `E_RING_09` | making a temporary Ring the default, or making the default temporary | "A temporary Ring can't be your default." (keep the row disabled client-side too) |
| 400 | — (validation; `message` is a string array) | name length, `#RRGGBB`, ISO dates, `purpose` empty after trim or over 140, a boolean other than `true` / `false`, `null` on a field that does not clear, `disposition: "UNDECIDED"`, an unknown `joinPolicy`, `limit` > 50, a Ring filter on `GET /rings/shared-with-me` | inline / client bug |

## Rules the UI must respect

- A member never learns which of someone's Rings they are in: Shared with me shows the **person**; no Ring name, colour or type, unless `ringName` is set (never today). They never see the roster or their own membership row.
- An expired Ring is unreadable by its members but **stays editable** by its owner (the keep / merge / delete choice depends on it). My Rings should still list it; Shared with me will not.
- Do not offer `EVENT`, `MINI_EVENT` or `MEETING` in the type picker; they arrive from the event and meeting flows. The s18 wizard sends no `type` (every Ring it makes is `PERSONAL`).
- Never show a settings switch the backend does not save; a new Ring's defaults come from the server.

## Not available yet

- A Ring's name and a member count on Shared with me: memberships must first record how they were made ([[F-09 Ring Members]]); until then every row is the person.
- Joining by scan or code, approvals, member invitations, saving attachments: the settings are stored but the flows are [[F-17 Ring Invitations & Join]]'s.
- My connections for the wizard's step 2 (s19): [[S-23 Connections Story|Connections · S8–S12]].
- Review / decline an invitation on Shared with me (s17): [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]].
- Delegated admins' per-setting levels: [[S-31 Delegated Admins Story]].
- The sweeper that purges `AUTO_DELETE` Rings: [[S-76 Cleanup Jobs Story|Cleanup Jobs · S4]].

## Checklist

- [ ] My Rings: default first, "expired" computed from `expiresAt`, temporary badge from `isTemporary`, the purpose as the row's short line.
- [ ] Shared with me: one row per person from `pinName` / `displayName` / `avatarUrl`; refetch on focus; open with `GET /views/ring/:ringId`; no Ring name or count unless the API sends one; no filters.
- [ ] Create wizard: no type picker; name uniqueness error inline; "Copy an existing Ring" calls `POST /rings/:id/copy`; settings left to the server's defaults unless changed.
- [ ] s26: "Make this my default Ring" disabled on a temporary Ring; handle 409 `E_RING_09`; Delete guarded by "is default".
- [ ] Post-event: the three dispositions, MERGE with a picker of the owner's other Rings.

## Log

- 2026-11-05 · `docs/backend/M-01-identity/F-11-rings/BD-11-settings-copy-default-shared` · describes the backend branch `FR-11/ring/settings-copy-default-shared` (`d1a6204`), **not merged**: the six settings on `RingEntity`, `POST` and `PATCH /rings`; `POST /rings/:id/copy`; 409 `E_RING_09`; the new Shared-with-me shape (before / after table) and the 400 on Ring filters there. Status kept `current` for what is on `main`; the ⏳ parts become `main` at the merge. The D-04, D-05, D-14 and D-18 flags under the H1 cleared: this note carries all four.
- 2026-11-05 · same vault branch, after merging vault `main` · describes the backend branch at `4aad168` (up to date with backend `main` a249ab2): `POST /rings/:id/copy` switches on the same library items as the source ([[D-03 Links entered once, switched on or off per Ring]]); no request or response shape changed. Still **not merged**.
- 2026-11-05 · `docs/backend/M-01-identity/F-11-rings/BD-11-shipped-settings` · backend `main` `12172c6` merged the branch: this note now describes `main` (the branch banner and the ⏳ marks removed), `current`. Nothing in the shapes changed from what the branch described.
- 2026-11-08 · `docs/backend/M-01-identity/F-11-rings/BD-11-bugs-fixed` · matches backend `main` `e483d49`: [[B-13 The string false is read as true on Ring filters and settings]], [[B-14 PATCH a Ring with null on a required field answers 500]], [[B-15 Disposition runs on a permanent Ring, the default included]] and [[B-16 Ring colour and purpose accept values the contract refuses]] fixed. Contract written down: booleans `true` / `false` only (*Flow* 1, 3); `null` only on the six fields that clear (*Flow* 5); disposition only on a temporary Ring whose window has ended, 409 `E_RING_10` (new) otherwise, `UNDECIDED` 400 (*Flow* 8, *Errors*). `colorHex` `#RRGGBB` and `purpose` 1–140 after trim were already this note's words; the server now enforces them. Routes and shapes unchanged.
- 2026-11-08 · `docs/backend/M-01-identity/F-11-rings/BI-08-f17-shared-with-me` · matches backend `main` `1c460b0` (F-17, [[BD-17 Ring Invitations & Join Backend Delivery]]): `ringName` and `memberCount` on Shared with me are filled for a Ring joined knowingly (no longer always `null`), a row opens the oldest Ring joined knowingly first, and `joinPolicy`, `requireApproval`, `membersCanInvite` are enforced. Shapes unchanged; stays current
