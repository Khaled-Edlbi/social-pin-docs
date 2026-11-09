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
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Photo Library · Frontend Delivery

**Feature:** [[F-06 Photo Library]] · **Status:** Done · **Built from:** [[BI-13 Photo Library Backend Integration]] · **Against:** [[S-11 Photo Library Story]] · **Requirements:** [[FR-06 Photo Library Frontend Requirements]] · **QA:** [[Photo Library QA Frontend]]

What the client shipped for a Ring's photo and the photo library, on `social_pin` `rings/F-11/honest-rings` @ `3369288` (2026-11-05), not on `main` yet: the library and the Ring photo in `8939d8e` (shared with [[FD-07 Files Upload Frontend Delivery]]), the polish from [[BI-13 Photo Library Backend Integration]] in `3369288`; the main photo and the camera on every upload in `f801aaa`, s29 as a picker and s30's picking mode in `0005f00` (2026-11-09). The QA checklist is PH-01…PH-15 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s29\|s29]] Photo for this Ring | ✅ | A **picker** (`0005f00`, S1): "Photo for <Ring>", "Pick from your library"; **Use my Pin photo** ("Follows your Pin if you change it later", DEFAULT; "You have no Pin photo yet, so the Ring shows its colour" without one), a new photo (Pick a photo, Take a photo) and the "Your library" grid with the PIN mark on the main photo. A tap only selects (✓); **Use for <Ring>** saves the selection and returns, Back changes nothing; **Reset to Pin** saves the Pin photo straight away and returns (S6). "+ Upload" and "All photos" open s30 in picking mode. The Ring's photo shows on the header, the switcher, My Rings and Home, and after relaunch; a library photo no longer mine asks for another. |
| [[Screen Index#s30\|s30]] Photo library | ✅ | Every photo I uploaded, newest first. The **main photo** (`f801aaa`, S2, S4): the PIN mark and "N Rings inherit it" (`followerCount`, with any Ring that picked it by name); another photo: "Family, Work +2"; unused: "Not used yet". **+ Add** and "Upload a photo" offer **Camera or Library** (S3). **Management mode**, from Me: a tap opens the tile's sheet with **Make this my main photo** (not on the main one; the PIN mark moves, the Rings that follow change with it) and **Delete**. **Picking mode** (`0005f00`), from s29: a tap selects, **Done** hands it back to s29 as the candidate, **Cancel** changes nothing, a photo uploaded there comes back selected; nothing is saved on a Ring until s29's Use for <Ring>. |
| s30 · Delete | ✅ | Main-photo-safe (S5, `f801aaa`): the warning says what changes ("It's your Pin photo. The N Rings that follow it will show your initials instead.", plus the Rings that picked it); the main photo is cleared from the profile first, then each Ring in `usedBy`, then the file; any step that fails stops it and the photo is kept ("Couldn't stop it being your Pin photo, so it wasn't deleted."). |
| [[Screen Index#s68\|s68]] Me · Photo library | ✅ | The row shows the real count and opens s30. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /files?kind=image` | s30, s29 ("Your library"), Me (count) | Paged by `skip`, newest first; `usedBy` drives the usage line and the delete warning; `meta.total` is the count on Me. Read again when the app comes back to the foreground. |
| `POST /files` | s30, s29 | Image types only, downsized to 1600 × 1600 on the phone first, with progress; the new photo is first in the list. |
| `PATCH /rings/:ringId/projection { avatarFileId }` | s29 | Set, or `null` to remove. A 400 `E_FILE_04` (not my file) asks for another photo. |
| `PATCH /profiles/:id { avatarFileId }` | s30 · Make this my main photo; Delete of the main photo (`null`) | The list (PIN mark, inherit count) and the profile are read again after; `GET /files?kind=image` gives `isMainPhoto` and `followerCount`, `GET /profiles` the main photo. |
| `PATCH /rings/:ringId/projection { avatarFileId: null }` | s29 · Use my Pin photo, Reset to Pin | The Ring follows the main photo again. |
| `PATCH /rings/:ringId/projection { avatarFileId: null }`, then `DELETE /files/:id` | s30, Delete | The main photo off the profile first when it is this one, then every Ring in `usedBy`, so nothing points at a deleted photo. A 404 (already deleted elsewhere) is no error: the photo just leaves the list. |

## State kept on the client

- The list of my photos, read again on return to the foreground; nothing stored on the phone.
- Thumbnails and Ring photos from their signed `url` / `avatarUrl`, never stored; a link that fails is read again once ([[D-16 Files load from signed links that expire in 15 minutes]]).

## Deviations from the story or the integration note

- **s29 keeps its own "Your library" grid and new-photo rows** beside "+ Upload" / "All photos" to s30, so a photo can be picked or added without opening s30.
- **Camera is always offered** (S3): on a device with no camera the pick fails with a message, rather than only Library being shown.
- **Camera access denied**: the message carries **Settings** (to the phone's settings) on iOS only; on Android the message says where to go, with no link.
- **Delete is live**, not disabled: `usedBy` shipped (S8), so the client knows every Ring to clear first.

## Not done yet

- "Pull the one from LinkedIn" → [[S-94 Linked Accounts (OAuth) Story]]; "Crop for this Ring" is not in v1.

## Log

- 2026-11-05 · `rings/F-11/honest-rings` @ `8939d8e` (social_pin, not on `main` yet) · s29 Ring photo (gallery, camera, library, remove), s30 library with usage and delete, the count on Me; PH-01…PH-11 · flagged nothing
- 2026-11-05 · `rings/F-11/honest-rings` @ `3369288` · usage line with two names then "+N", re-read on return to the app, a photo deleted elsewhere just leaves, s29 asks for another photo when one is no longer mine; PH-12…PH-15 · flagged nothing
- 2026-11-09 · `rings/F-11/honest-rings` @ `f801aaa`, `0005f00` (social_pin, not on `main` yet) · S2 / S4 the main photo (PIN mark, "N Rings inherit it", Make this my main photo, the management mode's tile sheet), S1 / S6 Use my Pin photo and Reset to Pin, S5 main-photo-safe delete, S3 Camera or Library on every upload (`f801aaa`); S1 s29 as a picker (select, then Use for <Ring>), S2 s30's picking mode with Done / Cancel (`0005f00`); s29, s30 · the BD-06 flag cleared · flagged [[S-11 Photo Library Story]] (camera always offered; the Settings link on iOS only)
