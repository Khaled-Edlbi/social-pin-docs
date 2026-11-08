---
id: BI-03
type: backend-integration
module: identity
feature: files
status: current
scope: feature
screens: [s14, s20, s29, s30, s36]
related: ["D-02 One main profile every Ring starts from", "D-16 Files load from signed links that expire in 15 minutes", "BD-04 Files Upload Backend Delivery", "BI-13 Photo Library Backend Integration", "BI-07 Ring Projection Backend Integration", "BI-09 View As & Pin Views Backend Integration", "GET /files", "GET /files/content/:token", "GET /files/:id", "POST /files", "DELETE /files/:id", E_FILE_01, E_FILE_02, E_FILE_03, E_FILE_04]
created: 2026-10-15
updated: 2026-11-08
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Files Upload · Backend Integration

**Feature:** [[F-04 Files Upload]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]]

What the client builds: the upload step behind a Ring photo and a Ring attachment (Portfolio.pdf, pitch deck), with the type and size checks done before the request leaves the device; the file library (my photos, my documents); and showing any file from its signed link.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s29\|s29]] Photo for this Ring | picks a photo | `POST /files` then `PATCH /rings/:ringId/projection { avatarFileId }`; shows it from the projection's `avatarUrl` |
| [[Screen Index#s30\|s30]] Photo library | sees every photo they uploaded, and which Rings use each | `GET /files?kind=image` (thumbnails from each item's `url`, Rings from `usedBy`, the PIN mark from `isMainPhoto`, "N Rings inherit it" from `followerCount`) |
| [[Screen Index#s24\|s24]], [[Screen Index#s20\|s20]] | switches files on and off for a Ring | `GET /files?kind=document`, merged with the projection's `attachments[]` by `fileId` |
| [[Screen Index#s36\|s36]], [[Screen Index#s20\|s20]], [[Screen Index#s14\|s14]] | attaches a file; opens one | `POST /files` then `POST /rings/:ringId/projection/attachments { fileId }`; opens it from the attachment's `url` |
| any | checks a file they uploaded | `GET /files/:id` |
| any | deletes a file | `DELETE /files/:id` |

## Flow

1. **Upload.** `POST /files` as `multipart/form-data` with one field named `file`, the access token as bearer → 201 `FileEntity`, with its `url`. The file is now in the caller's library and visible to nobody else.
2. **Reference it** from a context: `avatarFileId` or an attachment on a Ring projection ([[BI-07 Ring Projection Backend Integration]]). Visibility follows the context: whoever may see that Ring gets a link to the file in what they read.
3. **The library.** `GET /files?kind=image|document&limit=&skip=` → `{ data: FileListItem[], meta: { total } }`, the caller's own files only, newest first. `limit` ≤ 50 (default 20), infinite scroll on `skip`; `meta.total` is the full count (the photo count on Me). Absent `kind` lists both.
4. **Metadata.** `GET /files/:id` → `FileEntity`, only for files the caller uploaded (404 otherwise).
5. **Show or download it.** Load the `url` (or a projection's / view's `avatarUrl` / `attachments[].url`) like any web image or download: **no bearer token**, the link is the credential. It is valid **15 minutes** ([[D-16 Files load from signed links that expire in 15 minutes]]).
6. **Delete.** `DELETE /files/:id` → 200. Soft delete; the bytes are removed and every link to the file answers 404 from then on. Contexts that referenced it keep their row: clear `avatarFileId` / detach first (the `usedBy` of the photo names the Rings to clear).

## Shapes that matter

`FileEntity`: `id`, `filename`, `mimeType`, `sizeBytes`, `checksum` (SHA-256), `visibility` (`CONTEXT_SCOPED` / `PUBLIC`), `createdById`, `createdAt`, **`url`** (signed, 15 minutes). **No storage path**, on purpose.

`FileListItem` (`GET /files`): `FileEntity` plus
- **`usedBy: [{ ringId, name }]`**: the caller's Rings whose photo (`avatarFileId`) is this file, by name. Attachments are not counted. Deleted Rings are left out; an expired or archived one is still named. Empty for a file no Ring uses as its photo (every document).
- **`isMainPhoto: boolean`**: `true` on the main photo (the main profile's `avatarFileId`, set with `PATCH /profiles/:id`), `false` on every other file and on every file while there is no main photo.
- **`followerCount: number | null`**: on the main photo, how many of the caller's **live** Rings follow it, because their projection has no photo of its own (`avatarFileId: null`), `0` included; Rings that picked the main photo themselves are in its `usedBy` instead. `null` on every other file. Always present.

```json
{ "id": "5a0c…", "filename": "me.png", "mimeType": "image/png", "url": "/api/v1/files/content/Qm9…",
  "usedBy": [{ "ringId": "20b0…", "name": "Clients" }], "isMainPhoto": true, "followerCount": 3 }
{ "id": "7c41…", "filename": "Portfolio.pdf", "mimeType": "application/pdf", "url": "/api/v1/files/content/Zx1…",
  "usedBy": [], "isMainPhoto": false, "followerCount": null }
```

(abridged: every item carries the full `FileEntity` too).

A **signed link** looks like `/api/v1/files/content/<opaque token>` (absolute, `https://…/api/v1/files/content/…`, when the API is deployed with `PUBLIC_BASE_URL`; otherwise prefix the API's origin). The token names no file id. The response carries the file's own `Content-Type`, `Content-Disposition: inline` with the original name, `X-Content-Type-Options: nosniff`, and `Cache-Control: private, max-age=<seconds left>`: an image cache keeps it no longer than the link lives.

Limits, enforced server-side and worth checking client-side first:

| Rule | Value |
|---|---|
| Max size | 25 MB (413 `E_FILE_03`) |
| Accepted types | `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `application/pdf`, DOCX, XLSX, PPTX, `application/msword`, `application/vnd.ms-powerpoint`, `text/plain`, `text/csv` (anything else 415 `E_FILE_02`) |
| Missing field | 400 `E_FILE_02` |
| `kind` | `image` (the four image types) or `document` (every other accepted type); anything else 400 |

Send the real MIME type with the part; the allow-list is checked on the declared type.

## State to keep on the client

- Cache keys: `file:<fileId>` for metadata, `files:<kind>` for the library pages; refetch `files:image` after every upload, delete or photo change.
- **Never keep a link past the session.** A link that fails to load (403/404 from an image cache, or 404 on a download) has most likely expired: read the entity that carried it again (`GET /files`, `GET /files/:id`, the projection, the view) for a fresh one, once. There is no expiry field beside the link; re-read on the first failed load.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 413 | `E_FILE_03` | over 25 MB | "Too large" before upload where possible |
| 415 | `E_FILE_02` | type not on the allow-list | "Unsupported type" |
| 400 | `E_FILE_02` | no `file` part | client bug |
| 404 | `E_FILE_01` | not one of the caller's files | missing |
| 404 | `E_FILE_01` | a signed link that expired, was altered, or points at a deleted file (`GET /files/content/:token`): one answer for all three | re-read the entity once for a fresh link; if it is still 404 the file is gone |
| 400 | `E_FILE_04` | referencing someone else's file from a projection | re-pick |
| 400 | — | `kind` other than `image` / `document` | client bug |

## Rules the UI must respect

- Uploading does not publish. Do not show a file as "on your profile" until it is attached to a Ring.
- Do not build a URL from the id or the filename: load bytes only from a signed `url` / `avatarUrl` the API handed you. The storage path is private and the static mount is not the contract.
- A link copied out of the app stops working after 15 minutes: never store one, never share one.
- Deleting a photo: clear it on every Ring in its `usedBy` first; the backend does not cascade.

## Not available yet

- Thumbnails and resized images: every link serves the original; downsize on the client.

## Checklist

- [ ] Client-side type and size check mirroring the table.
- [ ] Multipart field named `file`, correct MIME type set.
- [ ] Upload → reference as two steps, with the id held in between.
- [ ] Library pages from `GET /files?kind=`, infinite scroll on `skip`, `meta.total` for the count.
- [ ] Every image and download from a signed link, no bearer; one re-read of the entity when a link fails, never a URL built from ids.
- [ ] Delete clears the Rings in `usedBy` first.
- [ ] PIN mark from `isMainPhoto`; the inherit count from `followerCount`, never computed on the client.
