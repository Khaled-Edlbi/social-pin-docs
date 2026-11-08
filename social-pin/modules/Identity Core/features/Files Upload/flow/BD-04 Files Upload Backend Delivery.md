---
id: BD-04
type: backend-delivery
module: identity
feature: files
status: done
scope: feature
screens: [s14, s20, s36]
related: ["D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "D-16 Files load from signed links that expire in 15 minutes", "BD-06 Photo Library Backend Delivery", "BD-07 Profiles & Pin Name Backend Delivery", "GET /files", "GET /files/content/:token", "GET /files/:id", "POST /files", E_FILE_01]
pending: []
created: 2026-10-15
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Files Upload · Backend Delivery

**Feature:** [[F-04 Files Upload]] · **Status:** Done · **Integration guide:** [[BI-03 Files Upload Backend Integration]] · **Requirements:** [[FR-04 Files Upload Frontend Requirements]] · **QA:** [[QB-06 Files Upload QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `POST /files`
- `GET /files` (`?kind=image|document`, paginated)
- `GET /files/:id`
- `GET /files/content/:token` (public: the signed link is the credential)
- `DELETE /files/:id`
- `avatarUrl` and `attachments[].url` on `GET/PATCH /rings/:ringId/projection` and on every `/views/*` response

**Tables / models:** `File`, `RingProfile` (read for `usedBy`), `Profile` and `Ring` (read for the main photo and its `followerCount`)

**Code:** `src/modules/file/` (`file-link.service.ts`, `file.query-builder.service.ts`), `src/modules/ring-profile/` (`toView`, `toOwnerView`, `avatarUsage`), `src/modules/ring-access/` (`countMainPhotoFollowers`), `src/prisma/validators/file.validator.ts`, `src/common/upload/`, `src/config/` (`FILE_LINK_SECRET`, `PUBLIC_BASE_URL`)

## How it works

`POST /files` runs through `FileInterceptor('file')`; `FileService.upload` rejects a missing part (400 `E_FILE_02`), a MIME type outside the allow-list (415 `E_FILE_02`; an allow-list because a context-scoped file is served from the API's own origin and an unexpected type is a stored-XSS risk) and anything over 25 MB (413 `E_FILE_03`). The row is written **before** the bytes are flushed to `<uploadsDir>/files/<random-uuid><safe-ext>`, inside a transaction, so a failed write rolls the row back rather than leaving a reference to a file that is not there; `checksum` is the SHA-256 of the bytes. `persist` and `discard` are the only two methods that touch bytes, so moving to object storage replaces those two. `GET /files/:id` and `DELETE /files/:id` are scoped to the uploader (404 `E_FILE_01`); delete is a soft delete followed by a best-effort unlink, and the row survives because `ring_profile_files`, `exhibitor_documents` and `chat_messages` reference it. Who may *read* a file is not this service's question: it follows the context that references the file (`RingProfileService.assertOwnFile` on write, the access engine on read). `FileEntity` omits `storageKey`, so a client cannot address the bucket directly. The static mount serves **only** `<uploadsDir>/public`, at `/uploads/public`, for `PUBLIC` files (event covers, logos; nothing writes one yet). Context-scoped uploads live in `<uploadsDir>/files/`, beside that folder, and the mount never reaches them: it runs before every guard, so anything it served would be readable by anyone with the path, with no way to revoke it ([[B-07 Context-scoped uploads are served by the public static mount]]).

**Signed links ([[D-16 Files load from signed links that expire in 15 minutes]]).** The only way to the bytes of a context-scoped file. `FileLinkService` makes a link **after** the request's own access check has run: the uploader's `GET /files` / `GET /files/:id` / `POST /files` (`url`), the owner's projection (`avatarUrl`, `attachments[].url`, hidden rows included, since the owner may see them), and the viewer's view (`avatarUrl`, `attachments[].url`, made in `RingProfileService.toView` after `RingAccessService` let the request through, so a hidden attachment, never read by the query, never gets one). The token is **AES-256-GCM encrypted**, not only signed: it carries the file id and an expiry 15 minutes ahead (`FILE_LINK_TTL_SECONDS = 900`), and a viewer never sees the file id. Nothing is stored. `GET /files/content/:token` is `@Public()`: it opens the token, reads the live row and streams the bytes with the file's own `Content-Type`, `Content-Disposition: inline`, `X-Content-Type-Options: nosniff`, a sandboxing `Content-Security-Policy` and `Cache-Control: private, max-age=<seconds left>`. A malformed, tampered or expired token, a deleted file and bytes missing on disk all answer the **same 404 `E_FILE_01`**, so the route tells a caller nothing. The key is `FILE_LINK_SECRET`, or, when unset, a key derived from `JWT_SECRET` (`sha256("social-pin:file-links:" + JWT_SECRET)`), so a deployment needs no new secret and can still rotate links alone. Links are paths from the API root (`/api/v1/files/content/…`) unless `PUBLIC_BASE_URL` makes them absolute. Moving the bytes to object storage replaces `persist`, `discard` and the read in `openByLink`; the `url` fields keep their contract and become the provider's pre-signed links. *How the client knows a link expired* (D-16's open point): it re-reads the entity on the first failed load; no expiry field is sent beside each link.

**The library ([[S-11 Photo Library Story|Photo Library · S7]]).** `GET /files?kind=image|document` lists the caller's own live files (`createdById` = caller, `deletedAt: null`, both always applied), newest first (`createdAt desc, id`), paginated by `limit` (≤ 50) and `skip`, with `meta.total` the unpaginated count of the same `where`. `kind=image` is JPEG, PNG, WebP and GIF; `kind=document` every other allowed type; absent lists both; anything else is 400. Each item is `FileEntity` plus `url` and **`usedBy: [{ ringId, name }]`** ([[S-11 Photo Library Story|Photo Library · S8]]): the caller's live Rings (`deletedAt: null`) whose projection has `avatarFileId` = the file, by name, from `RingProfileService.avatarUsage` (the projection table is that module's). Attachments are not counted. `usedBy` leaves out deleted Rings only: an expired or archived Ring that picked the photo is still named.

**The main photo ([[S-11 Photo Library Story|Photo Library · S8]]).** Every item also carries **`isMainPhoto`** and **`followerCount`**. `findAllForOwner` reads the caller's default profile once (`selectMainPhoto`: its id and `avatarFileId`, the main photo of [[D-02 One main profile every Ring starts from]]). When that file is on the page, its item gets `isMainPhoto: true` and `followerCount` from `RingAccessService.countMainPhotoFollowers(ownerUserId, mainProfileId)`: one `COUNT` over the caller's Rings with `ringLiveFilter`, that present the main profile (`profileId` null or the main profile) and whose projection for it has no `avatarFileId` (null follows the main photo, [[D-05 Inherit per field, copy without members]]; a Ring with no projection row counts too). The count lives in the access engine, beside `countLiveMembers` (golden rule 8). Every other item gets `isMainPhoto: false`, `followerCount: null`. No main photo, an empty page, or the main photo on another page or outside `kind`: no item is marked and no count runs.

### What exists

- Max 25 MB. Accepted: JPEG, PNG, WebP, GIF, PDF, DOCX / XLSX / PPTX, DOC / PPT, TXT, CSV. Anything else is a 415.
- Binaries in object storage, metadata in the database; `FileService.persist` / `discard` / `openByLink` are the only methods touching bytes.
- The response omits the storage path.
- Signed 15-minute links to the bytes: `url` on every file the uploader receives, `avatarUrl` and `attachments[].url` on the owner's projection and on the viewer's view, answered by `GET /files/content/:token` with one 404 for every failure ([[D-16 Files load from signed links that expire in 15 minutes]]).
- The library: `GET /files?kind=image|document`, owner only, newest first, paginated, each item with its `url`, `usedBy`, `isMainPhoto` and `followerCount` (a number on the main photo, `null` elsewhere) ([[S-11 Photo Library Story|Photo Library · S7–S8]]).

### Gaps

- **`usedBy` is not filtered to live Rings** (deleted Rings only are left out), while `followerCount` counts live Rings only. Right for Delete, wider than S8's wording.
- **The viewer's view still carries `avatarFileId`.** D-16 says viewers never receive a file id; the attachments follow it (no `fileId`), but `avatarFileId` predates the decision and the client may still read it ([[FR-12 View As & Pin Views Frontend Requirements|FR-12]]). Removing it is a contract change: flagged on [[BI-09 View As & Pin Views Backend Integration]] for `/frontend` to stop reading it first.
- Thumbnails and resized images: not part of D-16; every link serves the original.

## Log

- 2026-10-18 · split out of [[F-04 Files Upload]] when the vault moved to layers
- 2026-10-29 · branch `B-07/file/uploads-public-only`, merged to `main @ c85db4b` · fixes [[B-07 Context-scoped uploads are served by the public static mount]]: the static mount serves only `<uploadsDir>/public` at `/uploads/public`; context-scoped uploads are no longer reachable at `/uploads/files/…`. No endpoint or response shape changed. Spec: `src/common/bootstrap/configure-app.spec.ts`. Flagged nothing: no client calls the mount.
- 2026-10-29 · [[FR-04 Files Upload Frontend Requirements]] approved by the backend (branch `tickets/backend/M-01-identity/F-04-files/FR-04-accepted`). This note stays `done`; its three open asks are in `pending` (the library list, the signed links of [[D-16 Files load from signed links that expire in 15 minutes]], `usedBy`), so it reads Partial until they ship.
- 2026-11-05 · branch `FR-04/file/signed-links-and-library` (`df93921`), merged to `main @ 80e7fa2` · ships two of the three asks of [[FR-04 Files Upload Frontend Requirements]]: the signed links of [[D-16 Files load from signed links that expire in 15 minutes]] (`GET /files/content/:token`; `url` on `POST /files`, `GET /files`, `GET /files/:id`; `avatarUrl` and `attachments[].url` on the owner's projection and the viewer's view) and the library list `GET /files?kind=image|document` with `usedBy` (Photo Library · S7, S8). New config, both optional: `FILE_LINK_SECRET`, `PUBLIC_BASE_URL`. No new error code (`E_FILE_01` for every refused link). Specs: `file-link.service.spec.ts`, `file.service.spec.ts` (new), `ring-profile.service.spec.ts` (267 tests pass). Checked live on localhost: upload → `url`, no `storageKey`, no file id in the link; the list, both kinds, owner only (another account sees 0), `kind=video` 400; a link loads with no bearer (bytes identical, `nosniff`, `private, max-age=900`); `usedBy` names the Ring after `PATCH { avatarFileId }`, an attached document is not counted; the owner's and the View-as links load; tampered, deleted and garbage links all 404 with one body. `followerCount` stays in `pending`, waiting on [[BD-07 Profiles & Pin Name Backend Delivery]]. The D-16 flag is cleared. Updated [[BI-03 Files Upload Backend Integration]], [[BI-07 Ring Projection Backend Integration]], [[BI-09 View As & Pin Views Backend Integration]], [[BD-06 Photo Library Backend Delivery]], the ✅ rows of [[FR-04 Files Upload Frontend Requirements]], [[FR-06 Photo Library Frontend Requirements]] and [[FR-12 View As & Pin Views Frontend Requirements]]; flagged [[QB-06 Files Upload QA Backend]] (rows to add).
- 2026-11-05 · flagged [[QB-06 Files Upload QA Backend]]: shipped on backend main @ 80e7fa2: GET /files?kind=image|document (owner only, newest first, paginated, usedBy), signed 15-minute links (url on files, avatarUrl and attachments[].url on the projection and the view) served by public GET /files/content/:token, one 404 E_FILE_01 for forged, expired or deleted links. Rows to add and run (/qa)
- 2026-11-08 · backend `main @ cb95a39` (branch `FR-06/file/follower-count`, `d5f1026`) · the last ask of [[FR-04 Files Upload Frontend Requirements]]: `isMainPhoto` and `followerCount` on every item of `GET /files` (`followerCount` the main photo's live followers, `null` on every other item), counted by `RingAccessService.countMainPhotoFollowers`, one `COUNT`. No schema change, no new error code, no new config. Specs: `file.service.spec.ts`, `ring-access.service.spec.ts`; the merged build: typecheck clean, 716/716 tests, migrations and seed on a fresh database. The `pending` entry is cleared and the BD-07 flag with it. Updated [[BI-03 Files Upload Backend Integration]] (the list shape) and the ✅ row of [[FR-04 Files Upload Frontend Requirements]]; the Photo Library side is on [[BD-06 Photo Library Backend Delivery]] (branch `docs/backend/M-01-identity/F-06-photo-library/BD-06-follower-count`), with [[QB-08 Photo Library QA Backend]] flagged there.
- 2026-11-08 · flagged [[FD-07 Files Upload Frontend Delivery]]: followerCount shipped on backend main cb95a39: every GET /files item has isMainPhoto and followerCount (a number on the main photo, null elsewhere); the s30 inherit count is no longer waiting; shapes in BI-03; for /frontend
