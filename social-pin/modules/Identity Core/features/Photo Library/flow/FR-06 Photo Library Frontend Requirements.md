---
type: frontend-requirements
code: photo-library
scope: feature
feature: photo-library
module: identity
status: draft
screens: [s29, s30]
created: 2026-10-18
updated: 2026-10-28
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Photo Library · Frontend Requirements

> ⚠ Affected by [[S-11 Photo Library Story]] (2026-10-29): design review. S1 (s29 is a picker: "Use my Pin photo" or a library photo from `GET /files?kind=image`; no large preview; no crop in v1), S2 (no names; usage line with Ring names from S8), S3 (Camera or Library, permission states), S4 (management mode from Me, tile sheet, count on s68), S5 (three delete cases, Delete disabled until S8), S6 ("Reset to Pin" shortcut), S7 (`GET /files?kind=image|document`) and S8 (`usedBy`, `followerCount`, photos only) changed; s23 and s68 added. "Base photo ❌ ND-02" and "Inherit ❌ ND-05" are decided (D-02, D-05); the bytes row is now ND-16.

> ⚠ Affected by [[D-02 One main profile every Ring starts from]] (2026-10-25): ND-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[D-05 Inherit per field, copy without members]] (2026-10-25): ND-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

**Feature:** [[F-06 Photo Library]] · **Status:** Draft · **Story:** [[S-11 Photo Library Story]] · **API Integration:** not yet (backend not built)

What the client needs to build the per-Ring photo picker and the library grid, and which of it exists. Upload works ([[BI-03 Files Upload Backend Integration]]); setting a Ring's photo works ([[BI-07 Ring Projection Backend Integration]]); listing, counting and displaying do not.

## Per screen

### [[Screen Index#s29|s29]] Photo for this Ring

- Needs: this Ring's current `avatarFileId`; set it to a chosen file; clear it ("Reset to Pin"); open the library.
- Actions: Use for <Ring>, Upload, Reset to Pin.
- States: current photo, candidate selected, saving, placeholder (bytes not available), "Reset to Pin" disabled.
- Source today: `GET /rings/:ringId/projection`, `PATCH /rings/:ringId/projection { avatarFileId }`. Bytes: not yet. Base photo: not yet.

### [[Screen Index#s30|s30]] Photo library

- Needs: the owner's image files, newest first, with `id`, `mimeType`, `createdAt` and a per-file "N Rings inherit it"; upload; delete; select for s29.
- Actions: + Add, select, Done, Cancel, delete (management mode from s68).
- States: grid, empty, uploading, selected, usage count, delete confirmation.
- Source today: `POST /files`, `DELETE /files/:id`, `GET /files/:id`. List and usage count: not yet. Thumbnails: not yet.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Upload a photo | `POST /files` | ✅ | — |
| Set a Ring's photo / clear it | `PATCH /rings/:ringId/projection` | ✅ | — (listed under [[F-10 Ring Projection]]) |
| Read a Ring's current photo id | `GET /rings/:ringId/projection` | ✅ | — (listed under [[F-10 Ring Projection]]) |
| Delete a photo | `DELETE /files/:id` | ✅ | — (listed under [[F-04 Files Upload]]) |
| List my files, filter by kind (images) | — | ❌ | [[S-11 Photo Library Story|Photo Library · S7]] |
| "N Rings inherit it" per file | — | ❌ | [[S-11 Photo Library Story|Photo Library · S8]] |
| Thumbnails and the full photo | — | ❌ | [[S-06 Files Upload Story|Files Upload · showing files]] |
| Base profile photo for "Reset to Pin" | — | ❌ | [[ND-02 Base profile work fields]] |
| Inherit-by-default semantics | — | ❌ | [[ND-05 Copy or inherit]] |

## Behaviour expectations

- Refetch / realtime: refetch `GET /files` (once it exists) on screen focus and after every upload or delete; refetch the Ring's projection after `PATCH`; invalidate `view:<viewer>:ring:<ringId>` so "View as" shows the new photo once bytes can be served.
- Caching keys: `files:<userId>:images` for the grid; `projection:<ringId>` for the current photo. Session-only list of uploaded ids until Photo Library · S7.
- Pagination / ordering: `GET /files` is expected paginated (`limit` ≤ 50, `meta.total`), newest first, with a `kind` filter; the grid uses infinite scroll on `skip`.
- Usage count: the client does not compute "N Rings inherit it" by scanning every projection; it waits for `ringCount` on the entity (Photo Library · S8) and shows nothing until then.
- Delete: detach from known Rings first (`avatarFileId: null`), then delete; the backend does not cascade.
- Images: client-side downsizing for very large photos is allowed before upload; the server allow-list and 25 MB limit still apply.
- Placeholders: without bytes, show the locally picked image during the session and initials afterwards; never build a URL from an id.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 413 | `E_FILE_03` | "Too large (max 25 MB)" |
| 415 | `E_FILE_02` | "Unsupported file type" |
| 404 | `E_FILE_01` | tile removed: "This photo is no longer available" |
| 400 | `E_FILE_04` | "Choose a photo from your library" |
| 403 | `E_RING_05` | the Ring is not editable by this user: picker read-only |
| 404 | `E_RING_02` | the Ring is gone: back to My Rings |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[S-11 Photo Library Story|Photo Library · S7]] — the grid on s30 beyond this session's uploads.
- [[S-11 Photo Library Story|Photo Library · S8]] — "N Rings inherit it".
- [[S-06 Files Upload Story|Files Upload · showing files]] — every thumbnail and the large preview on s29.
- [[ND-02 Base profile work fields]] — "Reset to Pin".
