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
related: ["BI-03 Files Upload Backend Integration", "BI-07 Ring Projection Backend Integration", "D-16 Files load from signed links that expire in 15 minutes", "FR-06 Photo Library Frontend Requirements", "GET /files", "GET /files/content/:token", "POST /files", "DELETE /files/:id", "PATCH /rings/:ringId/projection", E_FILE_01, E_FILE_04]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Photo Library · Backend Integration

**Feature:** [[F-06 Photo Library]] · **Backend:** [[BD-06 Photo Library Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]], [[BI-03 Files Upload Backend Integration]] (the shared file endpoints, in full)

Written by the **backend** team for the frontend: how to call what was delivered. It matches backend `main @ 80e7fa2`. The photo library has no endpoint of its own: it is `GET /files?kind=image` from [[BI-03 Files Upload Backend Integration]] plus a Ring's `avatarFileId` / `avatarUrl` from [[BI-07 Ring Projection Backend Integration]]. This note says how the Photo Library screens use them.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s30\|s30]] Photo library | sees every photo they uploaded, newest first | `GET /files?kind=image&limit=&skip=`; thumbnails from each item's `url` |
| s30 | sees which Rings use a photo | each item's `usedBy` |
| s30 | uploads a photo | `POST /files` (image types only), then refetch the list |
| s30 | deletes a photo | clear it on every Ring in its `usedBy` (`PATCH /rings/:ringId/projection { avatarFileId: null }`), then `DELETE /files/:id` |
| [[Screen Index#s29\|s29]] Photo for this Ring | picks a library photo for this Ring | `PATCH /rings/:ringId/projection { avatarFileId }`; shows it from the projection's `avatarUrl` |
| [[Screen Index#s68\|s68]] Me | the photo count | `meta.total` of `GET /files?kind=image&limit=1` |

## Flow

1. **List.** `GET /files?kind=image` → `{ data: FileListItem[], meta: { total } }`, the caller's own photos only, newest first; `limit` ≤ 50 (default 20), infinite scroll on `skip`.
2. **Show.** Each item's `url` is a signed link, valid 15 minutes, loaded with no bearer token ([[D-16 Files load from signed links that expire in 15 minutes]]). When one fails to load, refetch the page for fresh links.
3. **Use on a Ring.** `PATCH /rings/:ringId/projection { avatarFileId }` with a file from the list; the next list shows that Ring in the photo's `usedBy`.
4. **Delete.** Clear the photo on every Ring in its `usedBy`, then `DELETE /files/:id`. The backend does not cascade; a Ring left pointing at a deleted file shows no photo (its `avatarUrl` answers 404).

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
      "usedBy": [{ "ringId": "20b0…", "name": "Family" }]
    }
  ],
  "meta": { "total": 12 }
}
```

The full `FileEntity` (with `checksum`, `visibility`, `createdById`) is in [[BI-03 Files Upload Backend Integration]]. `usedBy` lists the caller's live Rings whose photo is this file, by name, alphabetically; attachments are not counted.

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
- Delete names the Rings in `usedBy` in its warning and clears them first.
- Thumbnails are the original image: downsize on the client for the grid.

## Not available yet

- **`followerCount` on the main photo** ("N Rings inherit it") and **reading or setting the main photo**: there is no main photo until the main profile ships ([[BD-07 Profiles & Pin Name Backend Delivery]], [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]). Until then show no inherit count, and treat no photo as the main one.
- "Reset to Pin" (s29): waits on the same main photo.
- Resized thumbnails: not part of D-16.

## Checklist

- [ ] Grid from `GET /files?kind=image`, infinite scroll on `skip`, count from `meta.total`.
- [ ] Every thumbnail from a signed `url`, no bearer; one refetch when a link fails.
- [ ] Usage line from `usedBy` ("Family, Company +1" past two).
- [ ] Delete clears every Ring in `usedBy`, then deletes.
