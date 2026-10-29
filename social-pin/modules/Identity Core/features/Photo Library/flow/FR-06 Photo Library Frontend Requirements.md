---
type: frontend-requirements
code: photo-library
scope: feature
feature: photo-library
module: identity
status: ready
screens: [s23, s29, s30, s68]
owner: "Omar Fostok"
depends: ["S-11 Photo Library Story"]
affects: ["BD-06 Photo Library Backend Delivery"]
related: ["BI-03 Files Upload Backend Integration", "BI-07 Ring Projection Backend Integration", "FR-04 Files Upload Frontend Requirements", "FR-07 Profiles & Pin Name Frontend Requirements", "FR-10 Ring Projection Frontend Requirements", "FR-01 Account Frontend Requirements", "S-14 Profiles & Pin Name Story", "ND-16 Viewer access to file bytes", "D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "POST /files", "GET /files", "GET /files/:id", "DELETE /files/:id", "GET /rings/:ringId/projection", "PATCH /rings/:ringId/projection", E_FILE_01, E_FILE_02, E_FILE_03, E_FILE_04, E_RING_02, E_RING_05]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/ready, module/identity, layer/frontend]
---

# Photo Library · Frontend Requirements

**Feature:** [[F-06 Photo Library]] · **Status:** 📨 Ready 2026-10-29, waiting on the backend's review · **Story:** [[S-11 Photo Library Story]] · **API Integration:** not yet (backend not built)

What the client needs to build the per-Ring photo picker, the library grid and its management mode, and which of it exists. Upload works ([[BI-03 Files Upload Backend Integration]]); setting a Ring's photo works ([[BI-07 Ring Projection Backend Integration]]); listing, the Rings per photo, the main photo and displaying do not.

A Ring follows the main photo until it picks its own ([[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]): `avatarFileId: null` on a Ring means "follow the main photo".

## Per screen

### [[Screen Index#s23|s23]] Edit · how you appear: the photo entry (S1, S3)

The screen is [[FR-10 Ring Projection Frontend Requirements|Ring Projection's]]; this section is its photo entry.

- Actions: Change → s29; Upload → s30 (picking mode).
- Source today: `GET /rings/:ringId/projection` (`avatarFileId`).

### [[Screen Index#s29|s29]] Photo for this Ring (S1, S6)

- Needs: this Ring's `avatarFileId`; the library's images (`GET /files?kind=image`, S7) for the "Your library" grid; which file is the main photo (to tell the Pin choice from a library choice).
- Choices: **"Use my Pin photo"** (DEFAULT, "Follows your Pin if you change it later") or a photo in the grid; the current choice carries the ✓. No large preview of the current photo.
- Actions: "Use for <Ring>" saves the selection and returns to s23 (`PATCH /rings/:ringId/projection { avatarFileId }` for a library photo, `{ avatarFileId: null }` for the Pin photo); "Reset to Pin" saves the Pin photo straight away, whatever is selected; the "+ Upload" tile → Camera or Library (as on s30).
- Not in v1: the "Crop for this Ring" row is not shown.
- States: Pin photo selected, library photo selected, saving, placeholder (bytes not available), grid holding only this session's uploads (until S7), "Use my Pin photo" and "Reset to Pin" disabled with "coming soon" (until the main photo exists).
- Source today: `GET /rings/:ringId/projection`, `PATCH /rings/:ringId/projection`, `POST /files`. List: not available yet. Main photo: not available yet. Bytes: not available yet.

### [[Screen Index#s30|s30]] Photo library (S2, S3, S4, S5)

- Needs: the owner's images (`GET /files?kind=image`), newest first, each with `id`, `mimeType`, `createdAt`, `usedBy: [{ ringId, name }]`, and `followerCount` on the main photo (S8); which file is the main photo.
- A tile: the photo, the **PIN** mark on the main photo, and the usage line. **No name**: never the `filename`.
  - main photo: "N Rings inherit it" (`followerCount`), plus the names in its `usedBy`;
  - a photo in `usedBy` of one or more Rings: their names ("Family", "Family, Company"); past two, "Family, Company +1";
  - an unused photo: "Not used yet".
  - Until S8 ships, no usage line.
- Upload: "Upload a photo", the header "+ Add" → a choice of **Camera** or **Library** → device check → `POST /files`; the new tile first, "Not used yet". "Pull the one from LinkedIn" is not shown ([[S-94 Linked Accounts (OAuth) Story]]).
- **Picking mode** (from s29 or s23): a tap selects a tile; Done returns it to s29 as the candidate; Cancel returns with no change.
- **Management mode** (from s68): no Done / Cancel; Back → Me. A tap opens the **tile sheet**: "Make this my main photo" (not on the main photo) and "Delete". Neither the mode nor the sheet is in the prototype (S4).
  - Make main: writes the main photo (the same field [[FR-07 Profiles & Pin Name Frontend Requirements|FR-07]] asks for, [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]); the PIN mark moves. Disabled with "coming soon" until it exists.
  - Delete, three cases: unused → confirm, `DELETE /files/:id`; in `usedBy` → the warning names the Rings, each is cleared (`PATCH … { avatarFileId: null }`), then delete; the main photo → the warning says N Rings will show initials, the main photo is cleared, then delete. Disabled with "coming soon" until S8 ships.
- States: grid, empty ("No photos yet"), uploading tile, selected tile, usage line, tile sheet, delete confirmation (three wordings), camera permission (asking, denied with a link to settings, no camera: Library only), "coming soon" on Make main and Delete.
- Source today: `POST /files`, `DELETE /files/:id`, `GET /files/:id`. List, Rings per photo, main photo, thumbnails: not available yet.

### [[Screen Index#s68|s68]] Me: the Photo library row (S4)

The screen is [[FR-01 Account Frontend Requirements|Account's]]; this section is its Photo library row.

- Needs: the number of photos (`meta.total` of `GET /files?kind=image`).
- Actions: the row → s30 in management mode.
- Until S7 ships, the row shows no count.

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Upload a photo | `POST /files` | ✅ | S3 |
| Set a Ring's photo, or follow the main photo (`null`) | `PATCH /rings/:ringId/projection` | ✅ | S1, S5, S6 (listed under [[F-10 Ring Projection]]) |
| Read a Ring's current photo id | `GET /rings/:ringId/projection` | ✅ | S1 (listed under [[F-10 Ring Projection]]) |
| Delete a photo | `DELETE /files/:id` | ✅ | S5 (listed under [[F-04 Files Upload]]) |
| List my photos: `kind=image` (JPEG, PNG, WebP, GIF), paginated (`limit` ≤ 50, `meta.total`), newest first, owner only; `kind=document` on the same endpoint for [[FR-04 Files Upload Frontend Requirements\|FR-04]] | `GET /files?kind=` | ❌ | [[S-11 Photo Library Story\|Photo Library · S7]] |
| Rings using each photo: `usedBy: [{ ringId, name }]` (live Rings whose `avatarFileId` is the file; attachments not counted) and `followerCount` on the main photo, on the list items | `GET /files?kind=image` | ❌ | [[S-11 Photo Library Story\|Photo Library · S8]] |
| Read and set the main photo (by file id) | — | ❌ | the main profile fields: [[S-14 Profiles & Pin Name Story\|Profiles & Pin Name · S9–S11]], as [[FR-07 Profiles & Pin Name Frontend Requirements\|FR-07]] asks; not asked twice here |
| Thumbnails and the full photo | — | ❌ | [[ND-16 Viewer access to file bytes]] |
| A photo's name (`label`) | — | not asked | later, not in v1 (S2) |
| A crop frame per Ring | — | not asked | later, not in v1 (S1) |

## Behaviour expectations

- Refetch / realtime: refetch `GET /files?kind=image` (once it exists) on screen focus and after every upload, delete or main-photo change; refetch the Ring's projection after `PATCH`; invalidate `view:<viewer>:ring:<ringId>` so "View as" shows the new photo once bytes can be served.
- Caching keys: `files:<userId>:image` for the grid and the s68 count; `projection:<ringId>` for the current photo. A session-only list of uploaded ids until S7.
- Pagination / ordering: newest first; the grid uses infinite scroll on `skip`.
- Usage line: the client never computes it by reading every projection; it shows what S8 returns, and nothing until then.
- Delete: clear every Ring in `usedBy` (and the main photo, when it is the one), then delete; the backend does not cascade. A 404 `E_FILE_01` on any step means already gone.
- Camera: the permission is asked on first use; denied or unavailable falls back to Library.
- Images: client-side downsizing for very large photos before upload; the server allow-list and 25 MB limit still apply.
- Placeholders: without bytes, show the locally picked image during the session and initials afterwards; never build a URL from an id.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 413 | `E_FILE_03` | "Too large (max 25 MB)" |
| 415 | `E_FILE_02` | "Unsupported file type" |
| 404 | `E_FILE_01` | tile removed: "This photo is no longer available"; on delete, already gone |
| 400 | `E_FILE_04` | "Choose a photo from your library" |
| 403 | `E_RING_05` | the Ring is not editable by this user: picker read-only |
| 404 | `E_RING_02` | the Ring is gone: back to My Rings (on delete, skip that Ring and go on) |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[S-11 Photo Library Story|Photo Library · S7]]: the grids on s29 and s30 beyond this session's uploads, and the count on s68.
- [[S-11 Photo Library Story|Photo Library · S8]]: the usage line and Delete.
- [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]: the main photo, for "Use my Pin photo", "Reset to Pin" and "Make this my main photo".
- [[ND-16 Viewer access to file bytes]]: every thumbnail and photo.
