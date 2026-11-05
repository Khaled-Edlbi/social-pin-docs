---
id: BD-07
type: backend-delivery
module: identity
feature: profiles
status: done
scope: feature
screens: [s05b, s06, s23, s68]
depends: ["FR-07 Profiles & Pin Name Frontend Requirements", "D-02 One main profile every Ring starts from", "D-06 Yearly rename, old name freed, case-insensitive", "D-16 Files load from signed links that expire in 15 minutes"]
affects: ["BI-04 Profiles & Pin Name Backend Integration", "BD-06 Photo Library Backend Delivery"]
related: ["S-14 Profiles & Pin Name Story", "BD-04 Files Upload Backend Delivery", "BD-12 View As & Pin Views Backend Delivery", "F-10 Ring Projection", "GET /profiles/pin-name/:pinName/availability", "GET /profiles", "GET /profiles/ring-privacy", "POST /profiles", "GET /profiles/:id", "PATCH /profiles/:id", "POST /profiles/:id/default", "DELETE /profiles/:id", "PATCH /rings/:ringId/projection", "POST /files", E_PROFILE_01, E_PROFILE_02, E_PROFILE_03, E_PROFILE_05, E_FILE_02, E_FILE_04]
pending: ["[[S-14 Profiles & Pin Name Story]]: S9–S11 Main profile fields from D-02 (was T-078) · shipped on branch FR-07/profile/main-profile-fields (743f390), waits on the merge", "[[S-14 Profiles & Pin Name Story]]: S12 Enforce the once-a-year Pin name rename (was T-079) · shipped on branch FR-07/profile/main-profile-fields (743f390), waits on the merge", "[[FR-07 Profiles & Pin Name Frontend Requirements]]: clear the nickname with nickname: null on PATCH /profiles/:id (S3) · shipped on branch FR-07/profile/main-profile-fields (743f390), waits on the merge", "[[FR-07 Profiles & Pin Name Frontend Requirements]]: my Rings with their five show* switches in one call, for Me's privacy rows (S4) · shipped on branch FR-07/profile/main-profile-fields (743f390) as GET /profiles/ring-privacy, waits on the merge", "[[FR-07 Profiles & Pin Name Frontend Requirements]]: a signed avatarUrl (15 minutes) for the main photo on GET /profiles (D-16) · shipped on branch FR-07/profile/main-profile-fields (743f390), waits on the merge"]
created: 2026-10-15
updated: 2026-11-05
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Profiles & Pin Name · Backend Delivery

> ⚠ Affected by [[D-22 The public page only says the Pin exists]] (2026-11-05): ND-22 decided: the public page needs a look-up by Pin name with no sign-in that returns the name and the Pin name only, one not-found answer for a name nobody holds; for /backend

**Feature:** [[F-07 Profiles & Pin Name]] · **Status:** Done · **Integration guide:** [[BI-04 Profiles & Pin Name Backend Integration]] · **Requirements:** [[FR-07 Profiles & Pin Name Frontend Requirements]] · **QA:** [[Profiles & Pin Name QA Backend]]

What the backend shipped for this feature and how it works. The parts in `pending` (S3, S4, S9–S12 and D-16's `avatarUrl`) are built on the backend branch `FR-07/profile/main-profile-fields` (743f390) and **are not on `main` until that branch is merged**: they are marked *on the branch* below.

## Endpoints, tables and code

**Endpoints**

| Method and path | Auth | Who may call it | Where |
|---|---|---|---|
| `GET /profiles/pin-name/:pinName/availability` | public | anyone | `main` |
| `GET /profiles` | bearer | the owner (own profiles only) | `main`; the main-profile fields, `avatarUrl` and the rename dates *on the branch* |
| `GET /profiles/ring-privacy` | bearer | the owner (own Rings only) | *on the branch* (new) |
| `POST /profiles` | bearer | the owner | `main`; the main-profile fields *on the branch* |
| `GET /profiles/:id` | bearer | the owner | `main`; as `GET /profiles` |
| `PATCH /profiles/:id` | bearer | the owner | `main`; the main-profile fields, clearing the nickname and the yearly rename *on the branch* |
| `POST /profiles/:id/default` | bearer | the owner | `main` |
| `DELETE /profiles/:id` | bearer | the owner | `main` |

**Tables / models:** `Profile` (`profiles`). On the branch it gains `headline`, `role`, `company`, `location`, `bio` (text, nullable), `avatar_file_id` (uuid, nullable, FK to `files` with `ON DELETE SET NULL`, indexed) and `pin_name_changed_at` (`timestamptz(3)`, nullable), in one migration, `20261105140700_profile_main_fields_and_rename`: every column nullable, no backfill. `RingProfile` is read, not changed.

**Code:** `src/modules/profile/` (`ProfileService`, `ProfileController`, `pin-name.ts`); on the branch also `RingProfileService.listPrivacy` and `RingPrivacyEntity` in `src/modules/ring-profile/`, `FileService.assertOwnImage` in `src/modules/file/`, `E_PROFILE_05` in `src/common/enums/error-code.enum.ts`.

## How it works

`ProfileService` owns Pin-name uniqueness, the yearly rename, the canonical personal fields and the main profile; what a Ring shows of them belongs to `RingProfileService`. Uniqueness is global and case-insensitive, decided on `pinNameNormalized` (lower-cased, by `normalizePinName` in `profile/pin-name.ts`, the one definition of the rule), while the original casing is kept for display; `GET /profiles/pin-name/:pinName/availability` is `@Public()` and answers only a boolean. `POST /profiles` and a `PATCH` that changes the handle run the check and the write in one transaction (409 `E_PROFILE_02` on a clash; two concurrent requests cannot both win). The first profile is created inside `completeRegistration`'s transaction and is the default; `POST /profiles/:id/default` demotes then promotes in one transaction because the partial unique index `profiles_one_default_per_user` allows a single default. `DELETE /profiles/:id` is a soft delete and refuses the default (409 `E_PROFILE_03`): an account with no default profile has no Ring projection to fall back on. `GET /profiles` lists the owner's own rows, default first, through `ProfileQueryBuilderService` (`pinName` partial match, `profileType`), and `meta.total` is the unpaginated count. The three sensitive fields are nullable; whether an audience sees them is decided per Ring in `RingProfileService.toView`, nowhere else.

**On the branch:**

- **The main profile (D-02, S9–S11).** Six fields on `Profile`: `headline` (≤ 120), `role` (≤ 80, the job title), `company` (≤ 120), `location` (≤ 120), `bio` (≤ 2000) and the photo as `avatarFileId`. They are read on every owner route and written with `POST /profiles` and `PATCH /profiles/:id`; a key not sent is left alone, `null` clears it. Sign-up keeps what was typed (S9) the way the story asks: `complete-registration` takes the full name, and the client sends the rest with one `PATCH /profiles/:id` right after.
- **The photo (D-16).** `avatarFileId` must be a live file the caller uploaded (`POST /files`) and an image (JPEG, PNG, WebP, GIF), checked by `FileService.assertOwnImage` before the write: 400 `E_FILE_04` for a file that is not the caller's (or deleted, or unknown, the same answer, so it never says whose file it is), 400 `E_FILE_02` for a document. Every owner response carries `avatarUrl`, a signed link from `FileLinkService` valid 15 minutes, made in `ProfileService.toOwnerView` (the one place a row becomes the owner's response), `null` without a photo.
- **The nickname (S3).** `nickname: null` clears it. Validation now refuses `null` where it means nothing: `UpdateProfileDto` uses `PartialType(…, { skipNullProperties: false })`, because the helper's default let `null` past every rule (`{ pinName: null }` was a 500 and `{ fullName: null }` cleared the full name). `null` is accepted only on the nickname, the three sensitive fields and the six main-profile fields; `pinName`, `profileType` and `fullName` answer 400.
- **The yearly rename (D-06, S12, S13).** A `pinName` that changes beyond its capitals is a rename. `pinNameChangedAt` is `null` until the first one (claiming the name at sign-up, or on `POST /profiles`, is not a rename), so the first rename is allowed; it sets `pinNameChangedAt` and the old name is free for anyone the moment the transaction commits (the unique key moves with it; `GET /views/pin/:old` is a 404 at once). A second rename before the same date and time a calendar year later (UTC; 29 February rolls to 1 March) is refused with **429 `E_PROFILE_05`**, message `You can change your Pin name once a year. Next change: <ISO date>`, checked before the availability lookup, so a refused rename never says whether the name is free. A change of capitals only (`SaraAz` → `saraaz`) is the same name: not checked, not limited, not counted. Every owner response carries `pinNameChangedAt` and `nextPinNameChangeAt` (the next allowed moment, `null` when a rename is allowed now). The write is guarded on `pinNameChangedAt` still holding what was read, so two concurrent renames cannot both pass: the second matches no row and gets the same 429. **Why 429, not 409:** the error body does not carry `ErrorCode` on the wire yet ([[S-87 Error Contract Story|Error Contract]]), so on `PATCH /profiles/:id` the client tells "taken" (409) from "too soon" (429) by the status.
- **My Rings' switches (S4).** `GET /profiles/ring-privacy` answers `{ data, meta: { total } }`, one row per Ring the caller owns (soft-deleted ones left out, the default first, then newest, as `GET /rings`), each `ringId`, `name`, `isDefault` and the five switches `showBirthdate`, `showGender`, `showMaritalStatus`, `showPhone`, `showEmail`. One query, unpaginated (`meta.total` is the number of Rings). A Ring whose projection was never created reads every switch as `false`, which is exactly what its viewers get. It names the owner's Rings, so it is owner-only by construction (scoped to the caller), and it is not an access decision: it says what the owner set, not what anyone may see. Switching is unchanged: `PATCH /rings/:ringId/projection`. The route sits on `ProfileController` (declared before `/:id`); the rows come from `RingProfileService`, which owns `ring_profiles`.
- **A Ring starts from the main profile (S11), kept to a fallback.** In `RingProfileService.toView` a Ring with no bio of its own shows the main bio, and a Ring with no photo of its own shows the main photo as `avatarUrl` (a `null` on the projection follows the main profile, as `nickname` already did). The viewer gets the main photo as a link only: `avatarFileId` on the view stays the Ring's own, so the main photo's file id never reaches a viewer. Headline, role, company and location are not on the viewer's view at all yet: that, and a Ring's own value per field, is [[F-10 Ring Projection]]'s ([[D-05 Inherit per field, copy without members]]).

### What exists

On `main`:

- Pin name uniqueness via `pinNameNormalized`; the availability check never says who holds a taken name.
- Default profile with a partial unique index (one default per account); deleting the default is a 409.
- Sensitive fields live once on `Profile`, nullable; each Ring opts in with its own `show*` flags.

On the branch `FR-07/profile/main-profile-fields`, waiting on the merge:

- The six main-profile fields on `GET /profiles`, `GET /profiles/:id`, `POST /profiles` and `PATCH /profiles/:id`, `null` clearing one; the photo as an own image and a signed `avatarUrl`.
- `nickname: null` clears the nickname; `null` on the Pin name, the type or the full name is a 400, no longer a 500 or a cleared name.
- The yearly rename: `pinNameChangedAt`, `nextPinNameChangeAt`, 429 `E_PROFILE_05`, concurrent renames refused, capitals-only changes free.
- `GET /profiles/ring-privacy`: my Rings with their five switches in one call.
- A Ring's view falls back to the main bio and photo.
- Specs: unit 21 suites, 319 tests green (`pnpm typecheck && pnpm test`); six new e2e cases green against a throwaway database; the migration replays on a fresh PostgreSQL 17 database and leaves only the known `pincasts_geo_gist` diff.

### Gaps

- Not on `main` yet: everything under *On the branch* above, until `FR-07/profile/main-profile-fields` is merged.
- The viewer's view has no headline, role, company or location, and a Ring cannot set its own value for them or hide the main bio or photo (a `null` follows the main profile): [[F-10 Ring Projection]] ([[S-17 Ring Projection Story|Ring Projection · S10]], [[D-05 Inherit per field, copy without members]]).
- The viewer's view still carries the Ring's **own** `avatarFileId` (it did before this change), although [[D-16 Files load from signed links that expire in 15 minutes]] says viewers never receive a file id: [[F-10 Ring Projection]] / [[BD-12 View As & Pin Views Backend Delivery]]'s to remove.
- `ErrorCode` is not in the error body yet, so `E_PROFILE_05` is told apart by its status (429) until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships.
- A file deleted while it is the main photo leaves `avatarFileId` set; its `avatarUrl` answers 404, the same as a Ring photo's ([[BD-04 Files Upload Backend Delivery]]).
- The public page by Pin name ([[D-22 The public page only says the Pin exists]]) is not a story part yet and is not built.
- Imports into the main profile are [[F-05 Onboarding Imports]]' and not built.
- `followerCount` on the main photo ([[BD-06 Photo Library Backend Delivery]]) builds on this branch's photo field and is not built.

## Log

- 2026-10-18 · split out of [[F-07 Profiles & Pin Name]] when the vault moved to layers
- 2026-11-05 · [[FR-07 Profiles & Pin Name Frontend Requirements]] reviewed against the backend's `main` (80e7fa2) and approved; three new asks added to `pending` (clear the nickname, my Rings' `show*` switches in one call, a signed `avatarUrl` on `GET /profiles`), beside the two already there (S9–S11, S12)
- 2026-11-05 · flagged [[FR-07 Profiles & Pin Name Frontend Requirements]]: backend review of FR-07 (approved): for /frontend: (1) the Main profile fields row and the Field map should say what S-14 S10 says, that GET /profiles returns the six work fields as null when not set and PATCH /profiles/:id with null clears one; (2) the role field asked by S-29 P10 is already in the Main profile fields row: add S-29 S4, S8 to that row and clear the two flags above (FR-15, S-29).
- 2026-11-05 · flagged [[S-14 Profiles & Pin Name Story]]: backend review of FR-07 (approved): for /pm: S9 still says the photo shows as initials until ND-16 is decided; ND-16 is decided as D-16 (files load from signed links that expire in 15 minutes), and FR-07 asks for a signed avatarUrl on GET /profiles, now pending on BD-07. S9's photo line should follow D-16.
- 2026-11-05 · branch `FR-07/profile/main-profile-fields` (743f390, from `main` f186ba1), **not merged** · S3, S4, S9–S12, D-16 · the six main-profile fields and the photo with a signed `avatarUrl` on the profile routes; `nickname: null` clears; the yearly rename with `pinNameChangedAt`, `nextPinNameChangeAt` and 429 `E_PROFILE_05`; `GET /profiles/ring-privacy`; a Ring's view falls back to the main bio and photo; `null` refused on `pinName`, `profileType`, `fullName`; migration `20261105140700_profile_main_fields_and_rename`. The five `pending` entries stay until the merge. D-02 and D-06 handled: their flags cleared here and on [[BI-04 Profiles & Pin Name Backend Integration]]; FR-07's rows left for the merge.
