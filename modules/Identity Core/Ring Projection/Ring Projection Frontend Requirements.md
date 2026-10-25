---
type: frontend-requirements
code: ring-projection
scope: feature
feature: ring-projection
module: identity
status: draft
screens: [s14, s20, s23, s24, s25, s29, s36]
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Ring Projection · Frontend Requirements

> ⚠ Affected by [[DR-02 One main profile every Ring starts from]] (2026-10-25): D-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[DR-03 Links entered once, switched on or off per Ring]] (2026-10-25): D-03 decided, links are entered once and only switched on or off per Ring; booking, Behance, Dribbble, GitHub and YouTube join the types, detected from the pasted link.

> ⚠ Affected by [[DR-05 Inherit per field, copy without members]] (2026-10-25): D-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

**Feature:** [[Ring Projection]] · **Status:** Draft · **Story:** [[Ring Projection Story]] · **Backend Integration:** [[Ring Projection Backend Integration]]

What the client needs from the backend to build the "what this Ring shows" editor across its seven screens, and whether each need is met today. Shapes, the link-type table and field limits are in [[Ring Projection Backend Integration]].

## Per screen

### [[Screen Index#s14|s14]] Ring data

- Needs: the owner entity in one call (`displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig`, five `show*`, `links[]`, `infoBlocks[]`, `attachments[]`, `widgets[]`, each child with `isVisible` and `sortOrder`); the member count; entry points.
- States: loading, empty, hidden rows greyed, read-only (403).
- Source today: `GET /rings/:ringId/projection`. Member count: not yet. Photo bytes: not yet.

### [[Screen Index#s20|s20]] New Ring · step 3 (what it shows)

- Needs: add links, info blocks and attachments to the just-created Ring; a library toggle list (design).
- Source today: `POST …/links`, `POST …/info-blocks`, `POST …/attachments`. Library: not yet.

### [[Screen Index#s23|s23]] Edit · how you appear

- Needs: set or clear `displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig`; inherit from the Pin; copy from another Ring (s28).
- Source today: `PATCH /rings/:ringId/projection`. Inherit and copy: not yet.

### [[Screen Index#s24|s24]] Edit · what it shows

- Needs: five sensitive toggles with the underlying value preview; per-row visibility on links, blocks and files; add a field.
- Source today: `PATCH …/projection` for `show*`; `PATCH …/links/:linkId` and `…/info-blocks/:blockId` for `isVisible`; the value preview from `GET /profiles` (`birthdate`, `gender`, `maritalStatus`) and `GET /users/me` (`email`, `phone`). Attachment visibility edit: not yet (create-time only).

### [[Screen Index#s25|s25]] Edit · social profiles

- Needs: add, edit, hide, reorder, remove links; the type list.
- Source today: `POST / PATCH / DELETE …/links[/:linkId]`; `LINK_TYPE` from `/docs`.

### [[Screen Index#s29|s29]] Photo for this Ring

- Needs: set `avatarFileId` from an upload; clear it.
- Source today: `POST /files` then `PATCH …/projection`. Display: not yet. Reset to a base photo: not yet.

### [[Screen Index#s36|s36]] Add to this Ring

- Needs: routes into field, social profile, file and widget flows.
- Source today: info blocks, links and attachments as above. Widgets: not yet.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Read the owner's projection | `GET /rings/:ringId/projection` | ✅ | — |
| Edit surface fields and `show*` flags | `PATCH /rings/:ringId/projection` | ✅ | — |
| Add a link | `POST /rings/:ringId/projection/links` | ✅ | — |
| Edit / hide / reorder a link | `PATCH …/links/:linkId` | ✅ | — |
| Remove a link | `DELETE …/links/:linkId` | ✅ | — |
| Add an info block | `POST …/info-blocks` | ✅ | — |
| Edit / hide / reorder an info block | `PATCH …/info-blocks/:blockId` | ✅ | — |
| Remove an info block | `DELETE …/info-blocks/:blockId` | ✅ | — |
| Attach a file | `POST …/attachments` | ✅ | — |
| Detach a file | `DELETE …/attachments/:attachmentId` | ✅ | — |
| Preview as the audience | `GET /views/ring/:ringId` | ✅ | — (listed under [[View As & Pin Views]]) |
| Display the photo and attachments | — | ❌ | [[T-062 Serve uploaded file bytes by id]] |
| One field library switched on / off per Ring | — | ❌ | [[D-03 Field library vs per-Ring copies]] |
| Inherit from the Pin / copy another Ring's bio | — | ❌ | [[D-05 Copy or inherit]], [[D-02 Base profile work fields]] |
| Widgets add / edit / remove | — | ❌ | [[T-017 Extend WIDGET_TYPE to the design's list]], [[T-018 Widget CRUD on the projection]] |
| Member count on s14 | — | ❌ | [[T-004 Member count per Ring on list and detail]] |

## Behaviour expectations

- Refetch / realtime: one editor state per Ring, refetched after every write (the sub-resource writes return the updated row; `GET` returns the whole entity). After any write, invalidate `view:<viewer>:ring:<ringId>` so View as is never stale.
- Caching keys: `projection:<ringId>` (owner entity); `profiles:<userId>` and `account:<userId>` for the sensitive-value previews.
- Pagination / ordering: none; render children by `sortOrder`. Reorder by sending the new `sortOrder` on each moved row; the server does not renumber.
- Write semantics: send only changed keys; `null` clears a text or file field (falls back to the base profile); `show*` as booleans; `isVisible` as a boolean on the child row.
- Link validation: mirror the per-type rule on the client (`http(s)` absolute URL, E.164, email, `lat,lng`) and still show the server's 400 message when it disagrees.
- Visibility: hidden rows come back in the owner entity with `isVisible: false` and never in a viewer response; the editor uses the owner shape only.
- Sensitive preview: show the stored value next to each toggle; when it is empty, say "not set" and explain the viewer would see nothing.
- Photo: keep the local image for the session; placeholder after relaunch; never build a URL from `avatarFileId`.
- Create wizard: write to the Ring created in step 1; on Cancel, delete the Ring (`DELETE /rings/:id`) so an abandoned wizard leaves nothing behind (not allowed on the default Ring).

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 403 | `E_RING_05` | read-only editor (not owner nor `CONTENT_MANAGER`+) |
| 404 | `E_RING_02` | Ring not found: back to My Rings |
| 400 | `E_RING_PROFILE_03` | link `value` does not match `type`: inline, server message |
| 404 | `E_RING_PROFILE_03` | link or block not in this projection: refetch the editor |
| 404 | `E_RING_PROFILE_04` | attachment not in this projection: refetch the editor |
| 400 | `E_FILE_04` | `avatarFileId` / `fileId` is not the caller's file: pick again |
| 409 | `E_PROFILE_01` | the Ring's profile is gone: re-pick the profile on the Ring |
| 400 | — (validation; `message` is a string array) | inline on the field (lengths, enum, JSON) |

Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint.

## Blocked by

- [[D-03 Field library vs per-Ring copies]] — the "N of 7 on" toggle list on s20 / s24; build an add-list until decided.
- [[D-05 Copy or inherit]] and [[D-02 Base profile work fields]] — "Inherit" and "Copy a Ring" on s23 / s28, "Reset to Pin" on s29.
- [[T-062 Serve uploaded file bytes by id]] — every photo and attachment preview.
