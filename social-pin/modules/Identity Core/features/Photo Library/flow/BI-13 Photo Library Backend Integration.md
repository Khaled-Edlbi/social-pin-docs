---
id: BI-13
type: backend-integration
module: identity
feature: photo-library
status: current
scope: feature
screens: [s23, s29, s30, s68]
depends: []
affects: []
related: ["BI-03 Files Upload Backend Integration", "BI-04 Profiles & Pin Name Backend Integration", "BI-07 Ring Projection Backend Integration", "D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "D-16 Files load from signed links that expire in 15 minutes", "FR-06 Photo Library Frontend Requirements", "GET /files", "GET /files/content/:token", "POST /files", "DELETE /files/:id", "PATCH /rings/:ringId/projection", "PATCH /profiles/:id", E_FILE_01, E_FILE_04]
pending: []
created: 2026-11-05
updated: 2026-11-08
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Photo Library · Backend Integration

**Feature:** [[F-06 Photo Library]] · **Backend:** [[BD-06 Photo Library Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]], [[BI-03 Files Upload Backend Integration]] (the shared file endpoints, in full)

Written by the **backend** team for the frontend: how to call what was delivered. It matches backend `main @ cb95a39`. The photo library has no endpoint of its own: it is `GET /files?kind=image` from [[BI-03 Files Upload Backend Integration]], a Ring's `avatarFileId` / `avatarUrl` from [[BI-07 Ring Projection Backend Integration]], and the main photo (`PATCH /profiles/:id { avatarFileId }`) from [[BI-04 Profiles & Pin Name Backend Integration]]. This note says how the Photo Library screens use them.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s30\|s30]] Photo library | sees every photo they uploaded, newest first | `GET /files?kind=image&limit=&skip=`; thumbnails from each item's `url` |
| s30 | sees which Rings use a photo | each item's `usedBy`; on the main photo also `followerCount` ("N Rings inherit it") |
| s30 | sees the PIN mark | the item with `isMainPhoto: true` |
| s30 (management) | "Make this my main photo" | `PATCH /profiles/:id { avatarFileId }` on the default profile, then refetch the list |
| s30 | uploads a photo | `POST /files` (image types only), then refetch the list |
| s30 | deletes a photo | clear it on every Ring in its `usedBy` (`PATCH /rings/:ringId/projection { avatarFileId: null }`), then `DELETE /files/:id` |
| [[Screen Index#s29\|s29]] Photo for this Ring | picks a library photo for this Ring | `PATCH /rings/:ringId/projection { avatarFileId }`; shows it from the projection's `avatarUrl` |
| s29 | "Use my Pin photo" / "Reset to Pin" | `PATCH /rings/:ringId/projection { avatarFileId: null }`: the Ring follows the main photo |
| [[Screen Index#s68\|s68]] Me | the photo count | `meta.total` of `GET /files?kind=image&limit=1` |

## Flow

1. **List.** `GET /files?kind=image` → `{ data: FileListItem[], meta: { total } }`, the caller's own photos only, newest first; `limit` ≤ 50 (default 20), infinite scroll on `skip`.
2. **Show.** Each item's `url` is a signed link, valid 15 minutes, loaded with no bearer token ([[D-16 Files load from signed links that expire in 15 minutes]]). When one fails to load, refetch the page for fresh links.
3. **Use on a Ring.** `PATCH /rings/:ringId/projection { avatarFileId }` with a file from the list; the next list shows that Ring in the photo's `usedBy`.
4. **Main photo.** The item with `isMainPhoto: true` is the main photo; its `followerCount` is how many live Rings follow it. Changing the main photo (`PATCH /profiles/:id { avatarFileId }`) or making a Ring follow it (`{ avatarFileId: null }` on the projection) changes the marker or the count: refetch the list.
5. **Delete.** Clear the photo on every Ring in its `usedBy` (and, for the main photo, clear the main photo with `PATCH /profiles/:id { avatarFileId: null }`), then `DELETE /files/:id`. The backend does not cascade; a Ring left pointing at a deleted file shows no photo (its `avatarUrl` answers 404).

## Shapes that matter

```json
{
  "data": [
    {
      "id": "5a0c…",
      "filename": "me.png",
      "mimeType": "image/png",
      "sizeBytes": 184320,
      "createdAt": "2026-11-05T10:00:00.000Z",
      "url": "/api/v1/files/content/Qm9…",
      "usedBy": [{ "ringId": "20b0…", "name": "Clients" }],
      "isMainPhoto": true,
      "followerCount": 3
    },
    {
      "id": "7c41…",
      "filename": "casual.png",
      "mimeType": "image/png",
      "sizeBytes": 90112,
      "createdAt": "2026-11-04T08:12:00.000Z",
      "url": "/api/v1/files/content/Zx1…",
      "usedBy": [],
      "isMainPhoto": false,
      "followerCount": null
    }
  ],
  "meta": { "total": 12 }
}
```

The full `FileEntity` (with `checksum`, `visibility`, `createdById`) is in [[BI-03 Files Upload Backend Integration]]. `usedBy` lists the caller's Rings whose photo is this file, by name, alphabetically; attachments are not counted. It leaves out deleted Rings only: an expired or archived Ring that picked the photo is still named, so Delete clears it too.

`isMainPhoto` is `true` on one item only, the main photo, when it is on the page; `false` everywhere else, and on every item while there is no main photo. `followerCount` is a number on the main photo (the live Rings with no photo of their own, `0` included) and `null` on every other item; both fields are always present. Rings that picked the main photo themselves are in its `usedBy`, not in `followerCount`, so its usage line is "N Rings inherit it" plus those names.

## State to keep on the client

- Cache key `files:image`; refetch on screen focus and after every upload, delete or photo change.
- Never keep a `url` past the session; never build one from an id.

## Errors to handle

| Status | ErrorCode | Meaning | Show |
|---|---|---|---|
| 404 | `E_FILE_01` | the photo is gone, or a link expired / was altered | refetch the list once; if still missing, drop it |
| 400 | `E_FILE_04` | `avatarFileId` is not one of the caller's files | pick from the library again |
| 413 / 415 | `E_FILE_03` / `E_FILE_02` | too large / not an image type | as in [[BI-03 Files Upload Backend Integration]] |

## Rules the UI must respect

- The grid is the caller's own photos only: there is no way to list anyone else's, and none should be implied.
- Delete names the Rings in `usedBy` in its warning and clears them first; for the main photo it says `followerCount` Rings will show your initials, and clears the main photo first.
- Never compute the inherit count from projections: show `followerCount`.
- Thumbnails are the original image: downsize on the client for the grid.

## Not available yet

- Resized thumbnails: not part of D-16.

## Checklist

- [ ] Grid from `GET /files?kind=image`, infinite scroll on `skip`, count from `meta.total`.
- [ ] Every thumbnail from a signed `url`, no bearer; one refetch when a link fails.
- [ ] Usage line from `usedBy` ("Family, Company +1" past two); on the main photo "N Rings inherit it" from `followerCount`.
- [ ] PIN mark on the item with `isMainPhoto: true`; refetch after a main-photo change.
- [ ] Delete clears every Ring in `usedBy`, then deletes.
