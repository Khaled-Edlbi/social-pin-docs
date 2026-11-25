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
updated: 2026-11-25
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Photo Library · Frontend Delivery

> ⚠ Affected by [[S-11 Photo Library Story]] (2026-11-25): decided by Omar Fostok: s29's "+ Upload" tile opens s30 in picking mode, where "+ Add" offers Camera or Library; it does not open the Camera / Library sheet itself. The s29 row ("+ Upload" offers Camera or Library, opens the library directly with no camera) and the 2026-11-25 Log line's "s29 + Upload" in the photo sheet say otherwise. For /frontend

**Feature:** [[F-06 Photo Library]] · **Status:** Done · **Built from:** [[BI-13 Photo Library Backend Integration]] · **Against:** [[S-11 Photo Library Story]] · **Requirements:** [[FR-06 Photo Library Frontend Requirements]] · **QA:** [[QF-09 Photo Library QA Frontend]]

What the client shipped for a Ring's photo and the photo library, on `social_pin` `rings/F-11/honest-rings` @ `3369288` (2026-11-05), on `main` since 2026-11-24 at `866240a`: the library and the Ring photo in `8939d8e` (shared with [[FD-07 Files Upload Frontend Delivery]]), the polish from [[BI-13 Photo Library Backend Integration]] in `3369288`; the main photo and the camera on every upload in `f801aaa`, s29 as a picker and s30's picking mode in `0005f00` (2026-11-09); Open settings on Android in `9e0f3be` (2026-11-10) and no Camera on a phone without one in `e65b7f7` (2026-11-25), a server refusal in the phone check's words and the F-06 Patrol suites in `d790c11` (2026-11-25), all on `main`. The QA checklist is PH-01…PH-15 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s29\|s29]] Photo for this Ring | ✅ | A **picker** (`0005f00`, S1): "Photo for <Ring>", "Pick from your library"; **Use my Pin photo** ("Follows your Pin if you change it later", DEFAULT; "You have no Pin photo yet, so the Ring shows its colour" without one), a new photo (Pick a photo, Take a photo; Take a photo hidden on a phone with no camera, `e65b7f7`) and the "Your library" grid with the PIN mark on the main photo. A tap only selects (✓); **Use for <Ring>** saves the selection and returns, Back changes nothing; **Reset to Pin** saves the Pin photo straight away and returns (S6). "+ Upload" and "All photos" open s30 in picking mode; "+ Upload" offers Camera or Library, and on a phone with no camera opens the library directly. The Ring's photo shows on the header, the switcher, My Rings and Home, and after relaunch; a library photo no longer mine asks for another. |
| [[Screen Index#s30\|s30]] Photo library | ✅ | Every photo I uploaded, newest first. The **main photo** (`f801aaa`, S2, S4): the PIN mark and "N Rings inherit it" (`followerCount`, with any Ring that picked it by name); another photo: "Family, Work +2"; unused: "Not used yet". **+ Add** and "Upload a photo" offer **Camera or Library** (S3); on a phone with no camera, Camera is not offered and the phone's library opens directly (`e65b7f7`). Camera or photo access denied: the message carries **Open settings** on iOS and on Android (`9e0f3be`), and Library stays available. **Management mode**, from Me: a tap opens the tile's sheet with **Make this my main photo** (not on the main one; the PIN mark moves, the Rings that follow change with it) and **Delete**. **Picking mode** (`0005f00`), from s29: a tap selects, **Done** hands it back to s29 as the candidate, **Cancel** changes nothing, a photo uploaded there comes back selected; nothing is saved on a Ring until s29's Use for <Ring>. |
| s30 · Delete | ✅ | Main-photo-safe (S5, `f801aaa`): the warning says what changes ("It's your Pin photo. The N Rings that follow it will show your initials instead.", plus the Rings that picked it); the main photo is cleared from the profile first, then each Ring in `usedBy`, then the file; any step that fails stops it and the photo is kept ("Couldn't stop it being your Pin photo, so it wasn't deleted."). |
| [[Screen Index#s68\|s68]] Me · Photo library | ✅ | The row shows the real count and opens s30. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /files?kind=image` | s30, s29 ("Your library"), Me (count) | Paged by `skip`, newest first; `usedBy` drives the usage line and the delete warning; `meta.total` is the count on Me. Read again when the app comes back to the foreground. |
| `POST /files` | s30, s29 | Image types only, downsized to 1600 × 1600 on the phone first, with progress; the new photo is first in the list. A refusal (415 `E_FILE_02`, 413 `E_FILE_03`, or the status alone) shows the phone check's own words, "That file type isn't supported." / "Too large (max 25 MB)", not the network error (`d790c11`). |
| `PATCH /rings/:ringId/projection { avatarFileId }` | s29 | Set, or `null` to remove. A 400 `E_FILE_04` (not my file) asks for another photo. |
| `PATCH /profiles/:id { avatarFileId }` | s30 · Make this my main photo; Delete of the main photo (`null`) | The list (PIN mark, inherit count) and the profile are read again after; `GET /files?kind=image` gives `isMainPhoto` and `followerCount`, `GET /profiles` the main photo. |
| `PATCH /rings/:ringId/projection { avatarFileId: null }` | s29 · Use my Pin photo, Reset to Pin | The Ring follows the main photo again. |
| `PATCH /rings/:ringId/projection { avatarFileId: null }`, then `DELETE /files/:id` | s30, Delete | The main photo off the profile first when it is this one, then every Ring in `usedBy`, so nothing points at a deleted photo. A 404 (already deleted elsewhere) is no error: the photo just leaves the list. |

## State kept on the client

- The list of my photos, read again on return to the foreground; nothing stored on the phone.
- Thumbnails and Ring photos from their signed `url` / `avatarUrl`, never stored; a link that fails is read again once ([[D-16 Files load from signed links that expire in 15 minutes]]).
- Whether the phone has a camera: `DeviceCamera` asks the phone once over the `social_pin/device` channel (Android `FEATURE_CAMERA_ANY`, iOS `isSourceTypeAvailable(.camera)`) and keeps the answer; when the phone cannot answer, Camera stays offered (`e65b7f7`). The same check hides "Take a photo" on s29 and on the Pin photo screen, and sign-up's photo field opens the library directly.

## Deviations from the story or the integration note

- **s29 keeps its own "Your library" grid and new-photo rows** beside "+ Upload" / "All photos" to s30, so a photo can be picked or added without opening s30.
- **Delete is live**, not disabled: `usedBy` shipped (S8), so the client knows every Ring to clear first.

## Not done yet

- "Pull the one from LinkedIn" → [[S-94 Linked Accounts (OAuth) Story]]; "Crop for this Ring" is not in v1.

## Log

- 2026-11-05 · `rings/F-11/honest-rings` @ `8939d8e` (social_pin, on `main` since 2026-11-24 at `866240a`) · s29 Ring photo (gallery, camera, library, remove), s30 library with usage and delete, the count on Me; PH-01…PH-11 · flagged nothing
- 2026-11-05 · `rings/F-11/honest-rings` @ `3369288` · usage line with two names then "+N", re-read on return to the app, a photo deleted elsewhere just leaves, s29 asks for another photo when one is no longer mine; PH-12…PH-15 · flagged nothing
- 2026-11-09 · `rings/F-11/honest-rings` @ `f801aaa`, `0005f00` (social_pin, on `main` since 2026-11-24 at `866240a`) · S2 / S4 the main photo (PIN mark, "N Rings inherit it", Make this my main photo, the management mode's tile sheet), S1 / S6 Use my Pin photo and Reset to Pin, S5 main-photo-safe delete, S3 Camera or Library on every upload (`f801aaa`); S1 s29 as a picker (select, then Use for <Ring>), S2 s30's picking mode with Done / Cancel (`0005f00`); s29, s30 · the BD-06 flag cleared · flagged [[S-11 Photo Library Story]] (camera always offered; the Settings link on iOS only)
- 2026-11-10 · `main` @ `9e0f3be` (social_pin) · S3 camera or photo access denied: the message carries **Open settings** on Android too, to the app's App info page through a channel in `MainActivity.kt` (iOS already had it); the "Settings link on iOS only" deviation removed (2026-11-25) · flagged nothing
- 2026-11-25 · `main` @ `e65b7f7` (social_pin, pushed) · S3 no camera on the device: Camera is not offered; the photo sheet (s30 "+ Add" / "Upload a photo", s29 "+ Upload") and sign-up's photo field open the phone's library directly, and "Take a photo" on s29 and on the Pin photo screen is hidden; `DeviceCamera` asks the phone once over `social_pin/device` (Android `FEATURE_CAMERA_ANY`, iOS `isSourceTypeAvailable(.camera)`), Camera stays offered if the phone cannot answer; the "Camera is always offered" deviation removed. Both now match the approved [[S-11 Photo Library Story]] (2026-11-25): no deviation left on S3 · the S-11 flag (2026-11-25) cleared · flagged nothing
- 2026-11-25 · `main` @ `d790c11` (social_pin, pushed) · S3 a server refusal of an upload (415 `E_FILE_02`, 413 `E_FILE_03`, or the status alone) shows the phone check's own words in the photo library, "That file type isn't supported." / "Too large (max 25 MB)", not the generic network error (decided by Omar Fostok 2026-11-25); unit test `test/features/photo/photo_uploader_test.dart`. The same commit adds the F-06 Patrol suites (`patrol_test/fake/h_photo_library_test.dart`, `patrol_test/real/photo_library_test.dart`) and the test id `ringPhoto.tile.<fileId>` on s29's library tiles · flagged nothing
