---
id: FD-08
type: frontend-delivery
module: identity
feature: photo-library
status: done
scope: feature
deployedTo: []
screens: [s29, s30, s68]
owner: "Omar Fostok"
depends: ["BI-13 Photo Library Backend Integration"]
affects: []
related: ["FR-06 Photo Library Frontend Requirements", "S-11 Photo Library Story", "FD-07 Files Upload Frontend Delivery", "D-02 One main profile every Ring starts from", "D-16 Files load from signed links that expire in 15 minutes", "S-14 Profiles & Pin Name Story", "S-94 Linked Accounts (OAuth) Story"]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Photo Library · Frontend Delivery

**Feature:** [[F-06 Photo Library]] · **Status:** Done · **Built from:** [[BI-13 Photo Library Backend Integration]] · **Against:** [[S-11 Photo Library Story]] · **Requirements:** [[FR-06 Photo Library Frontend Requirements]] · **QA:** [[Photo Library QA Frontend]]

What the client shipped for a Ring's photo and the photo library, on `social_pin` `rings/F-11/honest-rings` @ `3369288` (2026-11-05), not on `main` yet: the library and the Ring photo in `8939d8e` (shared with [[FD-07 Files Upload Frontend Delivery]]), the polish from [[BI-13 Photo Library Backend Integration]] in `3369288`. The QA checklist is PH-01…PH-15 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s29\|s29]] Photo for this Ring | 🟡 | A new photo from the gallery or the camera, one from "Your library", or none (remove). The choice saves the Ring's photo and shows it there, on the header, the switcher, My Rings and Home, and after relaunch. A library photo that is no longer yours asks you to pick another. "Use my Pin photo" and "Reset to Pin" are not shown (see *Not done yet*). |
| [[Screen Index#s30\|s30]] Photo library | 🟡 | Every photo I uploaded, newest first, with its usage line: "Used on Family, Work +2" (two Rings by name, then the rest as a number), nothing when unused. Upload from the gallery. Tap a photo to select it, then delete it: the warning says which Rings it's on; those are cleared first. No PIN mark and no "Make this my main photo" (see *Not done yet*). |
| [[Screen Index#s68\|s68]] Me · Photo library | ✅ | The row shows the real count and opens s30. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /files?kind=image` | s30, s29 ("Your library"), Me (count) | Paged by `skip`, newest first; `usedBy` drives the usage line and the delete warning; `meta.total` is the count on Me. Read again when the app comes back to the foreground. |
| `POST /files` | s30, s29 | Image types only, downsized to 1600 × 1600 on the phone first, with progress; the new photo is first in the list. |
| `PATCH /rings/:ringId/projection { avatarFileId }` | s29 | Set, or `null` to remove. A 400 `E_FILE_04` (not my file) asks for another photo. |
| `PATCH /rings/:ringId/projection { avatarFileId: null }`, then `DELETE /files/:id` | s30, Delete | Every Ring in `usedBy` cleared first, so no Ring points at a deleted photo. A 404 (already deleted elsewhere) is no error: the photo just leaves the list. |

## State kept on the client

- The list of my photos, read again on return to the foreground; nothing stored on the phone.
- Thumbnails and Ring photos from their signed `url` / `avatarUrl`, never stored; a link that fails is read again once ([[D-16 Files load from signed links that expire in 15 minutes]]).

## Deviations from the story or the integration note

- **No management mode on s30** (S4): the screen opened from Me is the only s30. Tapping a photo selects it and the bar offers Delete; there is no tile sheet. Picking a photo for a Ring happens in s29's own "Your library" grid, so s30 never returns a choice to s29 (S2's Done / Cancel as a picker).
- **"Use my Pin photo" and "Reset to Pin" are not shown on s29**, rather than shown disabled with "coming soon" (S1, S6): with no main photo there is nothing for them to do.
- **s30 uploads from the gallery only**; the camera is offered on s29 (S3 asks for Camera or Library on every upload entry).
- **Delete is live**, not disabled: `usedBy` shipped (S8), so the client knows every Ring to clear first.

## Not done yet

- The main photo: the PIN mark, "N Rings inherit it", "Make this my main photo", "Use my Pin photo" and "Reset to Pin" → [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]] ([[D-02 One main profile every Ring starts from]]); [[BD-06 Photo Library Backend Delivery]] keeps `followerCount` pending.
- The camera on s30, and a short message with a link to the phone's settings when camera access is denied (S3).
- "Pull the one from LinkedIn" → [[S-94 Linked Accounts (OAuth) Story]]; "Crop for this Ring" is not in v1.

## Log

- 2026-11-05 · `rings/F-11/honest-rings` @ `8939d8e` (social_pin, not on `main` yet) · s29 Ring photo (gallery, camera, library, remove), s30 library with usage and delete, the count on Me; PH-01…PH-11 · flagged nothing
- 2026-11-05 · `rings/F-11/honest-rings` @ `3369288` · usage line with two names then "+N", re-read on return to the app, a photo deleted elsewhere just leaves, s29 asks for another photo when one is no longer mine; PH-12…PH-15 · flagged nothing
