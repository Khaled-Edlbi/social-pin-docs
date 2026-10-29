---
type: story
code: photo-library
scope: feature
feature: photo-library
module: identity
status: approved
screens: [s23, s29, s30, s68]
approvedBy: "Omar Fostok"
approvedAt: 2026-10-29
created: 2026-10-18
updated: 2026-10-29
owner: "Omar Fostok"
related: ["D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "S-06 Files Upload Story", "S-08 Onboarding Imports Story", "S-14 Profiles & Pin Name Story", "S-94 Linked Accounts (OAuth) Story", "ND-16 Viewer access to file bytes"]
tags: [story, story/approved, module/identity, layer/business]
---

# Photo Library · User Story

> ⚠ Affected by [[D-16 Files load from signed links that expire in 15 minutes]] (2026-10-29): library photos load from the same signed links, valid 15 minutes. For `/pm`.

**Feature:** [[F-06 Photo Library]] · **Status:** Approved 2026-10-29 by Omar Fostok (first approved 2026-10-25 by khaled; reworked 2026-10-29 by the design review: S1–S8 changed) · **Frontend Requirements:** [[FR-06 Photo Library Frontend Requirements]] · **API Integration:** not yet (backend not built)

A Ring owner keeps a handful of photos, a formal headshot, a casual one, a team picture, and picks a different one per Ring. The library is the owner's private pool of uploads; a photo reaches an audience only when a Ring's projection points at it. One of them is the **main photo** of the main profile, which every Ring shows until the Ring picks its own ([[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]). The library screen shows each photo with the Rings that use it, and the per-Ring screen is a picker: the main photo or any photo of the library.

## Persona

A Ring owner on "Edit · how you appear" ([[Screen Index#s23|s23]]: Change → s29, Upload → s30) choosing the face a Ring shows, or on Me ([[Screen Index#s68|s68]]) tidying their photos. Owner only; no viewer ever sees the library.

## Stories

### S1 · Photo for this Ring ([[Screen Index#s29|s29]])

**As a** Ring owner **I want** to choose which photo this Ring shows **so that** my clients see a different picture from my family.

Acceptance criteria:
- [ ] s29 is a picker titled "Photo for <Ring>", "Pick from your library". Its choices are **"Use my Pin photo"** ("Follows your Pin if you change it later", marked DEFAULT) and every photo in the **"Your library"** grid, listed from `GET /files?kind=image` (S7); the current choice carries the ✓. There is no large preview of the current photo.
- [ ] "Use for <Ring>" saves the selected choice and returns to s23: a library photo sends `PATCH /rings/:ringId/projection { avatarFileId }`, the Pin photo sends `{ avatarFileId: null }`.
- [ ] The "+ Upload" tile opens s30.
- [ ] "Use my Pin photo" is disabled with "coming soon" until the main photo exists on the profile (S6).
- [ ] "Crop for this Ring" is not shown in v1 (Open questions).
- [ ] The photo cannot be fetched from the server yet ([[ND-16 Viewer access to file bytes]]); the client keeps the picked image locally for the session and shows a placeholder after relaunch. Until S7 ships, the grid holds only the photos uploaded in this session.

### S2 · Photo library ([[Screen Index#s30|s30]])

**As a** Ring owner **I want** a grid of my uploaded photos with the Rings that use each **so that** I can reuse one instead of uploading again.

Acceptance criteria:
- [ ] A grid of the owner's image files (`GET /files?kind=image`, S7), newest first. A tile shows the photo, the **PIN** mark on the main photo, and a usage line. **No name** on a tile in v1: the design's names ("Work headshot", "Casual") are not shown, and the `filename` is never shown.
- [ ] The usage line (S8):
  - the main photo: "N Rings inherit it", N being the Rings that follow the main photo, plus the names of any Ring that picked this same photo;
  - a photo one or more Rings picked: their names ("Family", "Family, Company"); past two names, "Family, Company +1";
  - a photo no Ring uses: "Not used yet".
  - Until S8 ships, the usage line is not shown.
- [ ] Opened to pick for a Ring (from s29 or s23): tapping a tile selects it; "Done" returns it to s29 as the candidate; "Cancel" returns with no change.
- [ ] Until S7 ships, the grid holds only the photos uploaded in this session, and says "Your earlier uploads will appear here soon".

### S3 · Add a photo ([[Screen Index#s30|s30]])

**As a** Ring owner **I want** to take a photo or pick one from my phone **so that** it is in the library for any Ring.

Acceptance criteria:
- [ ] "Upload a photo", the header "+ Add", and the "+ Upload" tile on s29 all offer **Camera** or **Library**.
- [ ] Either way the photo is checked on the device (JPEG, PNG, WebP or GIF, under 25 MB; very large photos downsized), uploaded with `POST /files`, and the new tile appears first, "Not used yet".
- [ ] Camera permission is asked the first time Camera is chosen. Denied: a short message with a link to the phone's settings, and Library stays available. No camera on the device: only Library is offered.
- [ ] A rejected type or size reads the same message as the client check ("Unsupported file type", "Too large (max 25 MB)").
- [ ] Uploading alone does not change any Ring.
- [ ] "Pull the one from LinkedIn" (in the design's upload row) is not part of this story: it belongs to [[S-94 Linked Accounts (OAuth) Story]] and is not shown until that story covers it.

### S4 · Manage the library from Me ([[Screen Index#s68|s68]], [[Screen Index#s30|s30]])

**As a** user **I want** a "Photo library" row on Me **so that** I can manage photos without opening a Ring.

Acceptance criteria:
- [ ] The row on s68 shows how many photos the library holds ("Photo library · 4", the total from `GET /files?kind=image`, S7) and leads to s30 in a **management mode**: no Done / Cancel target; Back returns to Me.
- [ ] In the management mode, tapping a tile opens a **sheet** with "Make this my main photo" (S2's main photo) and "Delete" (S5).
- [ ] "Make this my main photo" sets the main profile's photo: the PIN mark moves to that tile; every Ring that follows the main photo changes with it; Rings that picked their own keep theirs ([[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]). Not offered on the photo that already is the main one. Not available yet: the main profile has no photo field; the action is disabled with "coming soon".
- [ ] The main photo can also be set by an onboarding import ([[S-08 Onboarding Imports Story]]) and wherever the main profile is edited ([[S-14 Profiles & Pin Name Story]]); all of them write the same field.
- [ ] **For the designer:** the management mode and its tile sheet are not drawn in the prototype; they are an addition made on purpose and need designing.

### S5 · Delete a photo ([[Screen Index#s30|s30]], management mode)

**As a** Ring owner **I want** to delete a photo **so that** it is gone from storage and from every Ring.

Acceptance criteria:
- [ ] **Unused photo** ("Not used yet"): a short confirmation, then `DELETE /files/:id`.
- [ ] **A photo some Rings picked:** the warning names them ("Family and Company will show your Pin photo instead"); on confirm the client clears each Ring in `usedBy` (S8) with `PATCH /rings/:ringId/projection { avatarFileId: null }`, then deletes. Those Rings then follow the main photo.
- [ ] **The main photo:** the warning says the Rings that follow it ("N Rings") will show your initials; on confirm the client clears the main photo, then deletes. Rings that picked this same photo explicitly are cleared as above.
- [ ] A 404 `E_FILE_01` is treated as already gone: the tile is removed.
- [ ] **Until S8 ships**, "Delete" is shown disabled with "coming soon": without `usedBy` the client cannot know every Ring that uses a photo, and a Ring would be left pointing at a deleted file.

### S6 · Reset to Pin ([[Screen Index#s29|s29]])

**As a** Ring owner **I want** a Ring to follow my main photo again **so that** I do not have to pick one per Ring.

Acceptance criteria:
- [ ] "Reset to Pin" is a shortcut: it saves the Pin photo straight away (`PATCH … { avatarFileId: null }`) and returns to s23, whatever is selected in the picker. Selecting "Use my Pin photo" and tapping "Use for <Ring>" does the same.
- [ ] The Ring then follows the main photo, and changes with it from then on; only the photo stops being the Ring's own, the Ring's other fields are untouched ([[D-05 Inherit per field, copy without members]]).
- [ ] Until the main photo exists on the profile ([[D-02 One main profile every Ring starts from]], not built yet), both are disabled with "coming soon"; clearing today would show no photo at all.

### S7 · List my photos ([[Screen Index#s29|s29]], [[Screen Index#s30|s30]], [[Screen Index#s68|s68]])

*From T-012, merged 2026-10-27; criteria written 2026-10-29.*

**As a** Ring owner **I want** every photo I ever uploaded listed **so that** I can reuse it after relaunch.

Acceptance criteria:
- [ ] `GET /files?kind=image` lists the caller's own files, newest first, paginated (`limit` ≤ 50, `meta.total`); owner only: nobody else's files, ever.
- [ ] `kind=image` is JPEG, PNG, WebP and GIF; `kind=document` is every other type on the upload allow-list, which [[S-06 Files Upload Story|Files Upload · S12]] needs on the same endpoint.
- [ ] `meta.total` is the count on Me (S4).
- [ ] Not available yet.

### S8 · Which Rings use each photo ([[Screen Index#s30|s30]])

*From T-013, merged 2026-10-27; rewritten 2026-10-29.*

**As a** Ring owner **I want** to see which Rings show each photo **so that** I know what changes if I change or delete it.

Acceptance criteria:
- [ ] Per image file, `usedBy: [{ ringId, name }]`: the live Rings whose projection has `avatarFileId` = this file. File attachments (`RingProfileFile`) are not counted: they are documents on a Ring, not its photo.
- [ ] On the main photo, `followerCount`: the live Rings with no photo of their own, which follow the main photo.
- [ ] Both come on the `GET /files?kind=image` list (S7), so the grid gets them in one call; the client never computes them by reading every projection.
- [ ] Not available yet; until it ships the usage line is not shown and Delete is disabled (S2, S5).

## States and motion the design asks for

- State: picker with "Use my Pin photo" (DEFAULT) or a library photo selected (✓); grid; empty ("No photos yet"); uploading tile; selected tile; usage line ("N Rings inherit it", Ring names, "Not used yet"); management mode; tile sheet; delete confirmation (three wordings); camera permission asked, denied, unavailable; "coming soon" on the Pin photo, Reset to Pin, Make main and Delete until their parts ship.
- Motion: picking a photo for a Ring is part of the Ring re-compose on return to s14; a new tile slides into the grid. Reduced motion: fade.

## Rules the backend already enforces

- `POST /files` enforces the allow-list and 25 MB; the row carries `mimeType` and `sizeBytes`, so the client can filter images when a list exists.
- Files are private to the uploader (`GET` / `DELETE /files/:id` are 404 for anyone else). `avatarFileId` must be the caller's own file (400 `E_FILE_04`).
- No route serves the bytes, so a photo cannot be shown from the server ([[ND-16 Viewer access to file bytes]]); no list route, so earlier uploads cannot be enumerated.
- `null` on `avatarFileId` falls back to the profile, which has no photo field today.

## Open questions

- Decided: [[D-02 One main profile every Ring starts from]] (the main photo) and [[D-05 Inherit per field, copy without members]] (a Ring follows it until it picks its own). "Use my Pin photo", "Reset to Pin" and "Make this my main photo" wait for the main photo field (not ticketed yet).
- Settled by the design review (2026-10-29): the usage line counts Rings that follow the main photo plus Rings that picked a photo, and names the Rings (S2, S8).
- Later, not in v1: **naming a photo** (a `label` on the file, `PATCH /files/:id { label }`, a rename action); **"Crop for this Ring"** (s29), to be built as a crop frame kept on the Ring's projection, so the Ring shows the same photo with a tighter frame and the library gets no copy.
- Showing any photo (the s29 and s30 grids, the Ring's photo) waits on [[ND-16 Viewer access to file bytes]].
