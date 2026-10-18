---
type: story
id: photo-library
feature: photo-library
status: draft
domain: identity
screens: [s29, s30]
updated: 2026-10-18
tags: [story, story/draft, domain/identity]
---

# Photo Library · User Story

**Feature:** [[Photo Library]] · **Status:** Draft (awaiting product sign-off) · **Requirements:** [[Photo Library Requirements]] · **API Integration:** not yet (backend not built)

A Ring owner keeps a handful of photos, a formal headshot, a casual one, a team picture, and picks a different one per Ring. The library is the owner's private pool of uploads; a photo reaches an audience only when a Ring's projection points at it. The library screen shows each photo with "N Rings inherit it", and the per-Ring screen lets the owner pick, upload, or reset to the Pin's base photo.

## Persona

A Ring owner on "Edit · how you appear" ([[Screen Index#s23|s23]]) choosing the face a Ring shows, or on Me ([[Screen Index#s68|s68]]) tidying their photos. Owner only; no viewer ever sees the library.

## Stories

### S1 · Photo for this Ring ([[Screen Index#s29|s29]])

**As a** Ring owner **I want** to choose which photo this Ring shows **so that** my clients see a different picture from my family.

Acceptance criteria:
- [ ] The current Ring photo is shown large with the Ring's name ("Use for Clients").
- [ ] "Use for Clients" sets the chosen photo with `PATCH /rings/:ringId/projection { avatarFileId }` and returns to s23.
- [ ] "Upload" opens s30; "Reset to Pin" is shown disabled with "coming soon" until a base photo exists.
- [ ] The photo cannot be fetched from the server yet; the client keeps the picked image locally for the session and shows a placeholder after relaunch.

### S2 · Photo library ([[Screen Index#s30|s30]])

**As a** Ring owner **I want** a grid of my uploaded photos with how many Rings use each **so that** I can reuse one instead of uploading again.

Acceptance criteria:
- [ ] A grid of the owner's image files, newest first, each with "N Rings inherit it" (0 shown as "Not used").
- [ ] Selecting one and tapping "Done" returns it to s29 as the candidate; "Cancel" returns with no change.
- [ ] Until the list endpoint exists, the grid holds only the photos uploaded in this session, and says "Your earlier uploads will appear here soon".

### S3 · Add a photo ([[Screen Index#s30|s30]])

**As a** Ring owner **I want** to add a photo from my camera roll **so that** it is in the library for any Ring.

Acceptance criteria:
- [ ] "+ Add" opens the picker; JPEG, PNG, WebP or GIF under 25 MB are uploaded with `POST /files`; the new tile appears first.
- [ ] A rejected type or size reads the same message as the client check ("Unsupported file type", "Too large (max 25 MB)").
- [ ] Uploading alone does not change any Ring; the tile reads "Not used" until a Ring picks it.

### S4 · Reach the library from Me ([[Screen Index#s68|s68]])

**As a** user **I want** a "Photo library" row on Me **so that** I can manage photos without opening a Ring.

Acceptance criteria:
- [ ] The row leads to s30 in a management mode: no "Done" target, delete available.
- [ ] Back returns to Me.

### S5 · Remove a photo ([[Screen Index#s30|s30]])

**As a** Ring owner **I want** to delete a photo **so that** it is gone from storage and from every Ring.

Acceptance criteria:
- [ ] Delete on a tile with "N Rings inherit it" > 0 warns which effect it has; the client clears `avatarFileId` (`PATCH … { avatarFileId: null }`) on the Rings it knows about, then calls `DELETE /files/:id`.
- [ ] Delete on an unused tile goes straight to `DELETE /files/:id`.
- [ ] A 404 is treated as already gone.

### S6 · Reset to Pin ([[Screen Index#s29|s29]])

**As a** Ring owner **I want** a Ring to fall back to my base photo **so that** I do not have to pick one per Ring.

Acceptance criteria:
- [ ] Sends `PATCH … { avatarFileId: null }`; the Ring then shows the base photo, once a base photo exists on the profile.
- [ ] Until [[D-02 Base profile work fields]] is decided, the action is disabled with "coming soon"; clearing would show no photo at all.

## States and motion the design asks for

- State: grid, empty ("No photos yet"), uploading tile, selected tile, "N Rings inherit it", "Not used", delete confirmation.
- Motion: picking a photo for a Ring is part of the Ring re-compose on return to s14; a new tile slides into the grid. Reduced motion: fade.

## Rules the backend already enforces

- `POST /files` enforces the allow-list and 25 MB; the row carries `mimeType` and `sizeBytes`, so the client can filter images when a list exists.
- Files are private to the uploader (`GET` / `DELETE /files/:id` are 404 for anyone else). `avatarFileId` must be the caller's own file (400 `E_FILE_04`).
- No route serves the bytes, so a photo cannot be shown from the server; no list route, so earlier uploads cannot be enumerated.
- `null` on `avatarFileId` falls back to the base profile, which has no photo field today.

## Open questions

- [[D-02 Base profile work fields]] — "Reset to Pin" needs a base photo; blocks S6.
- [[D-05 Copy or inherit]] — whether a Ring photo inherits from the base profile by default; shapes what "N Rings inherit it" counts (explicit picks, inherited uses, or both).
