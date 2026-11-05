---
id: BI-04
type: backend-integration
module: identity
feature: profiles
status: current
scope: feature
screens: [s05b, s06, s23, s68]
depends: ["BD-07 Profiles & Pin Name Backend Delivery"]
affects: ["FR-07 Profiles & Pin Name Frontend Requirements"]
related: ["D-02 One main profile every Ring starts from", "D-06 Yearly rename, old name freed, case-insensitive", "D-16 Files load from signed links that expire in 15 minutes", "BI-03 Files Upload Backend Integration", "BI-07 Ring Projection Backend Integration", "GET /profiles/pin-name/:pinName/availability", "GET /profiles", "GET /profiles/ring-privacy", "POST /profiles", "GET /profiles/:id", "PATCH /profiles/:id", "POST /profiles/:id/default", "DELETE /profiles/:id", "PATCH /rings/:ringId/projection", "POST /files", E_PROFILE_01, E_PROFILE_02, E_PROFILE_03, E_PROFILE_05, E_FILE_02, E_FILE_04]
created: 2026-10-15
updated: 2026-11-05
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Profiles & Pin Name · Backend Integration

**Feature:** [[F-07 Profiles & Pin Name]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]]

What the client builds: the Pin-name claim, *Profile basics* at sign-up, the owner's profile editor (name, nickname, Pin name, the main profile: headline, role, company, location, photo, bio) and Me's privacy rows (the three sensitive fields and which Rings show each). Plus, for accounts that use it, several profiles and the choice of the default.

> **Branch, not `main`.** Everything marked **(branch)** below is on the backend branch `FR-07/profile/main-profile-fields` (743f390) and reaches `main` when it is merged ([[BD-07 Profiles & Pin Name Backend Delivery]]). Until then `main` answers as before: no main-profile fields, no `avatarUrl`, no rename limit, no `GET /profiles/ring-privacy`.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s05b\|s05b]] Profile basics | types name, headline, company, location, picks a photo | `POST /auth/complete-registration` (`fullName`), then `POST /files` for the photo and one `PATCH /profiles/:id` with the rest **(branch)** |
| [[Screen Index#s06\|s06]] Claim your Pin | types a handle | `GET /profiles/pin-name/:pinName/availability` (public) |
| Profile editor (from the Me header, [[Screen Index#s68\|s68]]) | reads and edits name, nickname, Pin name, the work section | `GET /profiles`, `PATCH /profiles/:id` (one key per save), `POST /files` for a new photo |
| [[Screen Index#s68\|s68]] Me · privacy rows | sets birthdate / gender / marital status; sees and switches which Rings show each | `PATCH /profiles/:id`; `GET /profiles/ring-privacy` **(branch)**; `PATCH /rings/:ringId/projection` for a switch |
| [[Screen Index#s23\|s23]] Edit · how you appear | "Inherit from your Pin" | the main profile's values from `GET /profiles` ([[BI-07 Ring Projection Backend Integration]] for the Ring's own) |
| Profiles (if the app exposes more than one) | adds one, picks the default, deletes one | `POST /profiles`, `POST /profiles/:id/default`, `DELETE /profiles/:id` |

## Flow

1. **`GET /profiles`** → `{ data: ProfileEntity[], meta: { total } }`, the default profile first, then oldest first. Filters: `pinName` (partial, case-insensitive), `profileType`. In v1 read `data[0]`.
2. **Sign-up (S9, branch).** `POST /auth/complete-registration` with `pinName` and `fullName`; as soon as it returns, `GET /profiles` for the id, upload the photo with `POST /files` (multipart field `file`), then one `PATCH /profiles/:id` with what was typed (`headline`, `company`, `location`, `avatarFileId`); a field left empty is not sent. A failure here does not undo the account: keep the values and send them again.
3. **`PATCH /profiles/:id`** with any of `pinName`, `profileType`, `fullName` (≤ 120), `nickname` (≤ 60), `birthdate` (ISO date), `gender`, `maritalStatus` and **(branch)** `headline` (≤ 120), `role` (≤ 80), `company` (≤ 120), `location` (≤ 120), `bio` (≤ 2000), `avatarFileId` (uuid). Send only the keys you change. `null` clears: the nickname **(branch)**, the three sensitive fields and **(branch)** the six main-profile fields (`avatarFileId: null` removes the photo). `null` on `pinName`, `profileType` or `fullName` is a 400 **(branch)**. The response is the updated `ProfileEntity`: replace the held profile with it.
4. **Changing the Pin name (S12, branch).** `PATCH /profiles/:id { pinName }`. A change beyond capitals is a rename: allowed when `nextPinNameChangeAt` is `null`, then the answer carries `pinNameChangedAt` (now) and `nextPinNameChangeAt` (a year later). Inside the year: 429 `E_PROFILE_05`, the profile unchanged. A taken name: 409 `E_PROFILE_02`. A change of capitals only (`SaraAz` → `saraaz`) is always allowed and does not start a year. The old handle is a 404 for everyone at once and free for anyone to claim.
5. **Me's privacy rows (S4, branch).** `GET /profiles/ring-privacy` → `{ data: RingPrivacyEntity[], meta: { total } }`, every Ring you own, the default first, then newest (the order of `GET /rings`), not paginated. "Family Ring only" = the rows whose `showBirthdate` is `true`. A switch is `PATCH /rings/:ringId/projection { showBirthdate: true }`; refetch the list after it.
6. **`POST /profiles`** creates an additional profile with the same fields; `pinName` is required and must be free. `profileType` defaults to `PERSONAL` (also `PROFESSIONAL`, `BUSINESS`). Not a rename.
7. **`POST /profiles/:id/default`** → 201 with the promoted profile; the previous default is demoted in the same transaction.
8. **`DELETE /profiles/:id`** → 200. The default profile cannot be deleted (409 `E_PROFILE_03`): make the user promote another first.

## Shapes that matter

`ProfileEntity`: `id`, `userId`, `profileType`, `isDefault`, `pinName` (without the `!`), `fullName`, `nickname`, `birthdate`, `gender`, `maritalStatus`, `createdAt`, `updatedAt`, and **(branch)**:

| Field | Type | Meaning |
|---|---|---|
| `headline` | string or `null` | main profile |
| `role` | string or `null` | job title; with `company`, the work identity |
| `company` | string or `null` | main profile |
| `location` | string or `null` | free text |
| `bio` | string or `null` | main profile |
| `avatarFileId` | uuid or `null` | the main photo, a file you uploaded |
| `avatarUrl` | string or `null` | signed link to the main photo, valid 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes]]); `null` without a photo. Load it like any image, no token. When it fails (expired), read `GET /profiles` again for a fresh one |
| `pinNameChangedAt` | ISO date-time or `null` | the last rename; `null` until the first |
| `nextPinNameChangeAt` | ISO date-time or `null` | when the next rename is allowed; `null` when it is allowed now. Show "You can change it again on <date>" only when it is set |

`RingPrivacyEntity` **(branch)**: `ringId`, `name`, `isDefault`, `showBirthdate`, `showGender`, `showMaritalStatus`, `showPhone`, `showEmail` (booleans; `false` for a Ring never edited).

- `pinName` rules: 3 to 30 characters of letters, digits, `.` and `_`; sent and stored without the `!`. Render the `!` as decoration. Uniqueness is global and ignores case.
- `birthdate`, `gender`, `maritalStatus` are **owner-only here**. Whether an audience sees them is decided per Ring by its `show*` flags ([[BI-07 Ring Projection Backend Integration]]). The editor should say so next to each field ("shared only with Rings you choose").
- The main profile is **never shown to another person** as such. A viewer sees a Ring's projection: **(branch)** a Ring with no bio or photo of its own shows the main bio and photo (as `avatarUrl`; a viewer never receives the main photo's file id). Headline, role, company and location are not on a viewer's view yet ([[F-10 Ring Projection]]).

## State to keep on the client

Cache the owner's profiles (`profiles:<userId>`); refetch after any write. The default profile's `pinName` is what the badge shows and what `GET /views/pin/:pinName` resolves for others: after a rename refresh the badge and the Me header. `avatarUrl` expires after 15 minutes: do not persist it, read the profile again. Cache `GET /profiles/ring-privacy` with the profile and refetch it after a switch.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 409 | `E_PROFILE_02` | Pin name already taken (also at `complete-registration`) | inline, keep the field focused |
| 429 | `E_PROFILE_05` **(branch)** | a rename within a year of the last one; `message` ends `Next change: <ISO date>` | "You can change your Pin name once a year. Next change: <date>." under the field, from the profile's `nextPinNameChangeAt`; keep the current name |
| 409 | `E_PROFILE_03` | deleting the default profile | "Choose another default first" |
| 404 | `E_PROFILE_01` | not one of the caller's profiles | treat as missing; refetch the list |
| 400 | `E_FILE_04` **(branch)** | `avatarFileId` is not a live file you uploaded | "Pick the photo again"; upload it with `POST /files` first |
| 400 | `E_FILE_02` **(branch)** | `avatarFileId` is not an image (JPEG, PNG, WebP, GIF) | "Pick a photo" |
| 400 | — (validation; `message` is a string array) | a field too long, a bad format or enum, `null` on `pinName` / `profileType` / `fullName`, an unknown key | inline on the field |

The error body does not carry `ErrorCode` yet: until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on the status and the endpoint. On `PATCH /profiles/:id` that is unambiguous: 409 is "taken", 429 is "too soon", 400 is the field or the photo.

## Rules the UI must respect

- The availability check returns only a boolean. Suggestions are built on the client from the person's own name only ([[D-06 Yearly rename, old name freed, case-insensitive]]); never from the check.
- These endpoints return the caller's **own** profiles and Rings only. For anyone else's identity use `/views/…`.
- Send `null` to clear; omit the key to leave it. The photo is uploaded first and sent as its id; never send image bytes to `/profiles`.
- A rename refused with 429 changed nothing: keep showing the current name.

## Not available yet

- Everything marked **(branch)**, until `FR-07/profile/main-profile-fields` is merged to `main`.
- Headline, role, company and location on a Ring's viewer view, and a Ring's own value per field: [[F-10 Ring Projection]] ([[D-05 Inherit per field, copy without members]]).
- The public web page by Pin name: [[D-22 The public page only says the Pin exists]], not built.
- LinkedIn / card / portfolio import into the main profile: [[F-05 Onboarding Imports]].

## Checklist

- [ ] Pin field: client rule (3–30), debounced check, `!` decoration only.
- [ ] Sign-up: one `PATCH /profiles/:id` right after `complete-registration`, retried on the next launch if it fails.
- [ ] Editor: one key per save, `null` to clear, the response replaces the held profile.
- [ ] Rename: show `nextPinNameChangeAt` when set; handle 429 `E_PROFILE_05` and 409 `E_PROFILE_02` separately.
- [ ] Photo: `POST /files` then `avatarFileId`; show `avatarUrl`; re-read the profile when the image fails to load.
- [ ] Sensitive fields labelled as owner-only, with a clear "clear" action that sends `null`.
- [ ] Privacy rows from `GET /profiles/ring-privacy`; a switch is `PATCH /rings/:ringId/projection`, then refetch.
- [ ] Default profile promoted before delete is offered.

## Log

- 2026-11-05 · rewritten for the backend branch `FR-07/profile/main-profile-fields` (743f390), **not merged**: the main-profile fields, `avatarUrl`, the rename dates, 429 `E_PROFILE_05`, the photo errors, `null` clearing the nickname and refused on `pinName` / `profileType` / `fullName`, `GET /profiles/ring-privacy`, the S11 fallback; marked **(branch)** throughout. Stays `current`: it describes `main` plus the marked parts. D-02 and D-06 handled: their flags cleared.
