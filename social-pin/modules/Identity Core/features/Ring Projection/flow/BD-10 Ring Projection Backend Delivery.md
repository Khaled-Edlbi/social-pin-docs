---
id: BD-10
type: backend-delivery
module: identity
feature: ring-projection
status: done
scope: feature
screens: [s14, s20, s23, s24, s25, s29, s36]
depends: ["FR-10 Ring Projection Frontend Requirements", "D-03 Links entered once, switched on or off per Ring"]
affects: ["BI-07 Ring Projection Backend Integration"]
related: ["S-17 Ring Projection Story", "D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "D-16 Files load from signed links that expire in 15 minutes", "GET /rings/:ringId/projection", "PATCH /rings/:ringId/projection", "POST /rings/:ringId/projection/links", E_RING_05, E_RING_02, E_FILE_04, E_PROFILE_01]
pending: ["[[FR-10 Ring Projection Frontend Requirements]]: S10 per field, per Ring: off / follow the Pin / own value for headline, role, company, location; follow / own for photo and bio (D-05, D-02; the main profile fields are on main since a249ab2, BD-07, so it can be built now)"]
created: 2026-10-15
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Ring Projection · Backend Delivery

> ⚠ Affected by [[BD-07 Profiles & Pin Name Backend Delivery]] (2026-11-05): the main profile shipped on backend main a249ab2: headline, role, company, location, bio, avatarFileId on Profile; toView already falls back to the main bio and photo (S-14 S11); S10 per field (follow / own / hidden) can now build on these fields; for /backend

> ⚠ Affected by [[D-05 Inherit per field, copy without members]] (2026-10-25): ND-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

**Feature:** [[F-10 Ring Projection]] · **Status:** Done · **Integration guide:** [[BI-07 Ring Projection Backend Integration]] · **Requirements:** [[FR-10 Ring Projection Frontend Requirements]] · **QA:** [[QB-13 Ring Projection QA Backend]]

What the backend shipped for this feature and how it works, as on backend `main` (`a249ab2`). S5 and S9 ([[D-03 Links entered once, switched on or off per Ring]]) shipped there; S10 is the one open ask.

## Endpoints, tables and code

**Endpoints** (all under `/rings/:ringId/projection`, owner or a `CONTENT_MANAGER`+ delegated admin)

- `GET /rings/:ringId/projection`
- `PATCH /rings/:ringId/projection`
- `POST /rings/:ringId/projection/links`
- `PATCH …/links/:linkId`
- `DELETE …/links/:linkId`
- `POST …/info-blocks`
- `PATCH …/info-blocks/:blockId`
- `DELETE …/info-blocks/:blockId`
- `POST …/attachments`
- `DELETE …/attachments/:attachmentId`

No route was added or removed for S9: the library is read and edited through any of the owner's Rings. What `:linkId` and `:blockId` name changed (the library item, the same in every Ring), and so did what `PATCH` and `DELETE` reach; see *How it works*.

**Tables / models:** `RingProfile`, `LibraryLink` (`library_links`, new), `LibraryInfoBlock` (`library_info_blocks`, new), `RingProfileLink` (`ring_profile_links`: now a Ring's switch for one library link, `link_id`, `sort_order`, `is_visible`), `RingInfoBlock` (`ring_info_blocks`: the same for a custom field, `info_block_id`), `RingProfileFile`. `LINK_TYPE` gains `BOOKING`, `BEHANCE`, `DRIBBBLE`, `GITHUB`, `YOUTUBE`. Migration `20261105130000_ring_profile_library`.

**Code:** `src/modules/ring-profile/`, `src/prisma/validators/ring-profile.validator.ts` (the projection selects, moved out of `ring.validator.ts`), `prisma/schema/ring.prisma`.

## How it works

`RingProfileService` is the owner editing surface and the viewer read path in one service, with two select objects: `selectRingProfileForOwner` (includes `isVisible` and hidden rows) and `selectRingProfileProjection` (visible rows only, hidden ones excluded **by the query**). Every owner route starts with `RingAccessService.assertCanAdminister(…, 'CONTENT_MANAGER')`, which says who owns the Ring and whether the caller is that owner; the projection is created on first access for the Ring's profile (falling back to the owner's default), so a Ring made by any flow has something to edit. `PATCH /rings/:ringId/projection` updates `displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig` and the five `show*` flags; `null` clears and falls back to the base profile; `avatarFileId` must be a file the caller uploaded (`assertOwnFile`, 400 `E_FILE_04`).

**The library (S9, D-03).** A link (`type`, `value`, `label`) or a custom field (`title`, `body`) is an item of the **Ring owner's account**, entered once; each Ring holds only a switch row for it (`isVisible` and its own `sortOrder`; each Ring keeps its own order, as S9 says until product decides otherwise). So:

- `GET …/projection` for the **owner** lists every item of their library: first the ones this Ring has a row for (by this Ring's `sortOrder`), then the rest, `isVisible: false` and `sortOrder: 0`, oldest first. Each entry's `id` is the library item's id, the same in every Ring. A **delegated admin** gets only the items this Ring has a row for: the rest of the library is what the owner shows other audiences, and the admin's query never reads it.
- `POST …/links` / `…/info-blocks` adds the item to the owner's library (a delegated admin's addition goes to the owner's library too) and switches it on here (`isVisible` defaults to `true`). An identical item the owner already has (same type and value; same title and body) is switched on instead of copied.
- `PATCH …/links/:linkId` / `…/info-blocks/:blockId`: `type`, `value`, `label` (`title`, `body`) change the item, so every Ring that shows it shows the new value; `isVisible` and `sortOrder` change this Ring's row, and on an item this Ring never had they create the row (off unless `isVisible: true`). That is how an item is switched on in a second Ring.
- `DELETE …/links/:linkId` / `…/info-blocks/:blockId` deletes the item from the library, so from every Ring. Switching it off in one Ring is `PATCH { isVisible: false }`.
- Changing or deleting an item reaches Rings a delegated admin does not administer, so only the owner may: a delegated admin gets 403 `E_RING_05` and may only switch and order the items of their Ring.
- An id that is not an item of the Ring owner's library (or, for a delegated admin, not on this Ring) is 404 `E_RING_PROFILE_03`, so another account's link is never reachable through your Ring.

Link values are validated by `assertLinkValueMatchesType`, on add and whenever `type` or `value` changes (a new type is checked against the stored value too): fifteen URL types need an absolute `http(s)` URL (`javascript:` and `data:` refused as stored-XSS vectors), three phone types need E.164, `EMAIL` an address, `LOCATION` a `lat,lng` pair; several links of one type are allowed. Attachments are plain child rows with `sortOrder` and `isVisible`; an attachment references a `File` the caller uploaded, which is already a library of its own (upload once, attach per Ring). Every write is `@Transactional`.

The viewer shape is produced in exactly one place, `toView`: `displayName` falls back to the profile's full name (never the nickname), and `birthdate`, `gender`, `maritalStatus`, `email` and `phone` are `null` unless that Ring's `show*` flag is on. A viewer's links and custom fields come only from the Ring's rows that are on (the query's `where: { isVisible: true }`), carry the library value, and are named by the Ring's row id, never the library id, so two perspectives of one person share no id. The owner's shape is produced in one place too, `toOwnerView`: every owner route returns through it; it flattens each library item with this Ring's switch, and each attachment's file to `fileId`, `filename`, `mimeType` and `sizeBytes` ([[B-08 Owner projection drops each attachment's file details]]). Widgets are selected and returned but have no endpoints yet.

**The merge of copies** (migration `20261105130000_ring_profile_library`, once): the copies of one owner (the Ring's owner) with the same type and value become one library link (a custom field: the same title and body, a missing body equal to a missing body). The item keeps the id, `created_at` and type of its oldest copy, the label of the oldest copy that has one, and the newest `updated_at`; every Ring that had a copy keeps one switch row with that copy's `sort_order` and `is_visible`. Where one Ring held two identical copies, the row kept is the one a viewer saw (visible first), then the lower `sort_order`. Two owners never share an item. Checked on a seeded throwaway database with extra copies added: 12 link copies became 9 library links and 11 switch rows, 5 custom-field copies 3 fields and 5 rows, and another owner's copy of the same URL stayed that owner's.

### What exists

- Owner entity (`RingProfileOwnerEntity`) includes `isVisible` flags and hidden rows; the viewer entity never does.
- Hidden rows are excluded by the query, not the serializer, so they are never read into a response; a library item a Ring never switched on is not read for its viewers at all.
- Links and custom fields are one library per account, switched on or off per Ring, each Ring with its own order; an edit shows in every Ring (D-03, S9).
- `LINK_TYPE` has 20 values: the 15 of before plus `BOOKING`, `BEHANCE`, `DRIBBBLE`, `GITHUB`, `YOUTUBE`, all `http(s)` URLs (S5).
- The viewer's `bio` and `avatarUrl` follow the main profile's when the Ring sets none (`null` on the projection), from [[BD-07 Profiles & Pin Name Backend Delivery]]'s main profile fields (S-14 S11), merged with this note's work in `a249ab2`.
- Sensitive fields are gated in exactly one place: `RingProfileService.toView`. All `show*` flags default to `false`.
- Link values are validated by type: absolute `http(s)` URLs, E.164 phones, `lat,lng` locations. Several links of one type are allowed.
- The owner's projection carries `avatarUrl` and a `url` per attachment (hidden rows included), and the viewer's view the same for what it shows: signed links, valid 15 minutes, made in `toOwnerView` / `toView` after the request's access check ([[D-16 Files load from signed links that expire in 15 minutes]]; served by `GET /files/content/:token`, [[BD-04 Files Upload Backend Delivery]]).

### Gaps

- Per field, per Ring (S10): "follow your Pin", "own for this Ring" and "hidden in this Ring" for headline, role, company and location are not built ([[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]). The main profile fields they follow are on `main` ([[BD-07 Profiles & Pin Name Backend Delivery]]), so S10 can be built now. The photo and the bio already follow the main profile for viewers while the Ring's own is `null`. "Copy another Ring's bio" (s28) works today on the client: read the other Ring's projection, `PATCH` this one.
- The library has no route of its own: it is read and edited through any of the owner's Rings (`GET /rings/:ringId/projection` lists all of it). A screen outside a Ring that wants the list has to pick one of the owner's Rings.
- A delegated admin cannot correct the value of a link or field, even one they added: the change would reach the owner's other Rings (403 `E_RING_05`). They can switch it off and add a corrected one.
- Type detection from a pasted link is the client's (S5); the backend validates the value against the type it is sent.
- Widgets (s37) have a table but no endpoints. See [[F-13 Widgets]].

## Log

- 2026-10-18 · split out of [[F-10 Ring Projection]] when the vault moved to layers
- 2026-10-29 · branch `B-08/ring-profile/owner-attachment-file-details`, merged to `main @ c80ed9d` · fixes [[B-08 Owner projection drops each attachment's file details]]: `GET` and `PATCH /rings/:ringId/projection` and `POST …/attachments` return each attachment's `fileId`, `filename`, `mimeType` and `sizeBytes`, as [[BI-07 Ring Projection Backend Integration]] documents. No contract change; the viewer's shape is untouched. Specs in `ring-profile.service.spec.ts` (*owner editing view*). The flag on BI-07 is cleared.
- 2026-11-05 · branch `FR-04/file/signed-links-and-library` (`df93921`), merged to `main @ 80e7fa2` · the projection and the view carry `avatarUrl` and `attachments[].url`, signed links valid 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes]]); the rest is on [[BD-04 Files Upload Backend Delivery]]'s log. The viewer's attachments still carry no `fileId`; the view's `avatarFileId` stays for now ([[BI-09 View As & Pin Views Backend Integration]]). Specs in `ring-profile.service.spec.ts`. Updated [[BI-07 Ring Projection Backend Integration]].
- 2026-11-05 · `tickets/backend/M-01-identity/F-10-ring-projection/FR-10-accepted` · [[FR-10 Ring Projection Frontend Requirements]] reviewed against backend `main` f186ba1 and approved: every ✅ row, field and error code matches; the signed links and `memberCount` rows marked ✅ (shipped). Three new asks added to `pending` (S9 the library, S10 per field, S5 the five link types); widget routes are [[BD-13 Widgets Backend Delivery]]'s. The [[D-02 One main profile every Ring starts from]] flag is cleared: its work is the S10 entry.
- 2026-11-05 · branch `FR-10/ring-profile/library-and-link-types` (`b0c14f2`), pushed, **not merged** · [[S-17 Ring Projection Story|Ring Projection · S5, S9]] ([[D-03 Links entered once, switched on or off per Ring]]): `LINK_TYPE` + `BOOKING`, `BEHANCE`, `DRIBBBLE`, `GITHUB`, `YOUTUBE`; links and custom fields moved into a per-account library (`library_links`, `library_info_blocks`) with a switch row per Ring; the projection routes keep their shapes; migration `20261105130000_ring_profile_library` merges today's copies once. No new `ErrorCode`: a delegated admin changing or deleting an item for every Ring is 403 `E_RING_05`. Specs in `ring-profile.service.spec.ts` (*link types added by D-03*, *the library (D-03)*), 326 unit tests green; the migration and the merge checked on a throwaway database. The S5 and S9 `pending` entries wait on the merge; S10 stays. The [[D-03 Links entered once, switched on or off per Ring]] flag is cleared: this entry is its work. Updated [[BI-07 Ring Projection Backend Integration]] to describe the branch.
- 2026-11-05 · backend `main` `a249ab2` (merge of `FR-10/ring-profile/library-and-link-types`, `b0c14f2`, after F-07's `FR-07/profile/main-profile-fields`) · [[S-17 Ring Projection Story|Ring Projection · S5, S9]] shipped: the five link types and the library, as the entry above describes; migration `20261105130000_ring_profile_library` on `main`. At the merge `selectRingProfileProjection` (now in `ring-profile.validator.ts`) took F-07's `bio` and `avatarFileId` on the profile, so a viewer's bio and photo follow the main profile while the Ring's own is `null`. The S5 and S9 `pending` entries are removed; S10 stays and can be built now. [[BI-07 Ring Projection Backend Integration]] matches `main`; [[FR-10 Ring Projection Frontend Requirements]]'s library and link-type rows ✅. [[Database & Migrations]] and [[Frontend API Guide]] updated (the migration, 20 link types). Flagged [[Frontend Contract]] (its `LINK_TYPE` count) and [[FR-12 View As & Pin Views Frontend Requirements]] (the library). No Ring Projection QA Backend exists yet; QA for S5 / S9 is unblocked.
- 2026-11-05 · flagged [[Frontend Contract]]: LINK_TYPE has 20 values on main a249ab2: BOOKING, BEHANCE, DRIBBBLE, GITHUB, YOUTUBE added (S-17 S5)
- 2026-11-05 · flagged [[FR-12 View As & Pin Views Frontend Requirements]]: links and custom fields are one library per account on main a249ab2 (S-17 S9): the view's links[] / infoBlocks[] shapes are unchanged, but a value is now the same in every Ring that shows it; the owner's GET /rings/:ringId/projection gives each item's isVisible per Ring, which 'where each field goes' can read
- 2026-11-05 · flagged [[FR-10 Ring Projection Frontend Requirements]]: S5 and S9 are on main a249ab2: the prose that still says 15 LINK_TYPE values, per-Ring copies and the phone-side imitation (s25, Blocked by) is the frontend's to update
- 2026-11-08 · branch `B-17/ring-profile/new-ring-view-and-null-fields` (`52bb683`), merged to `main @ e483d49` · fixes [[B-12 Null on a link or custom field's required field answers 500]]. `UpdateRingProfileLinkDto` and `UpdateRingInfoBlockDto` are now `PartialType(…, { skipNullProperties: false })`, the same fix as `UpdateProfileDto`. `null` on a link's `type`, `value`, `isVisible` or `sortOrder`, or on a field's `title`, `isVisible` or `sortOrder`, answers 400 (validation) on `PATCH` and `POST` instead of reaching Prisma as a 500. `label: null` and `body: null` still clear. Specs in `dto/ring-profile-link-and-field.dto.spec.ts`; checked live on a throwaway database. [[BI-07 Ring Projection Backend Integration]] now states the rule. B-12 is `ready` for QA's re-test. The same merge carries [[B-17 A new Ring answers 404 to its own owner until its projection is opened]] (`90fc7b3`, `RingProfileService`'s viewer paths), logged on [[BD-12 View As & Pin Views Backend Delivery]].
