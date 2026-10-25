---
type: decision
id: D-16
status: draft
features: [files]
blocks: ["T-062 Story"]
decider: "owner"
screens: [s14, s29, s30, s31, s44]
affects: []
related: ["Files Upload", "Ring Projection", "View As & Pin Views"]
owner: "omar"
created: 2026-10-25
updated: 2026-10-25
tags: [decision, decision/draft]
---

# ❓ D-16 · Viewer access to file bytes

**Status:** draft · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[T-062 Story]] · **Feature:** [[Files Upload]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (DR-NN) is `decided`. The cards in `blocks` are **Blocked · D-16** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

How a client gets the bytes of a Ring photo or attachment, and with which id: an authenticated route keyed by file id, or a signed `url` handed out on the entities. The owner has the file id everywhere; a viewer does not: the view's attachments carry only the attachment `id`. Until this is chosen, [[T-062 Serve uploaded file bytes by id]] cannot name its route or its response fields, and every photo and file in the app ([[Screen Index#s14|s14]], [[Screen Index#s29|s29]], [[Screen Index#s30|s30]], [[Screen Index#s31|s31]], [[Screen Index#s44|s44]]) stays a placeholder.

## Notes

- Nothing serves file bytes today: `storageKey` is private, the static `/uploads` mount is keyed by it, and `GET /files/:id` returns metadata to the uploader only ([[Files Upload Backend Delivery]], [[Files Upload Backend Integration]]).
- The owner's `RingProfileOwnerEntity` carries `avatarFileId` and `fileId` per attachment ([[Ring Projection Backend Integration]]); the viewer's `RingProfileViewEntity` carries `avatarFileId` and, per attachment, `id`, `label`, `filename`, `mimeType`, `sizeBytes`, no `fileId` ([[View As & Pin Views Backend Integration]]).
- The task names `GET /files/:id/content` or a signed `url` on the view entities; access is the uploader, or anyone who may see a live Ring that references the file, through `RingAccessService`. `PUBLIC` files skip the check.
- A refused file must look like a missing one (one 404), a hidden attachment is never served, and a link copied out of the app must be useless without access ([[T-062 Story]] S5).
- Context-scoped files are served from the API's own origin, which is why uploads are limited to an allow-list of types ([[Files Upload Backend Delivery]]).

## Options

1. **`GET /files/:id/content`, and the view adds `fileId`**: one route for owner and viewer, bearer token on every request, access checked per request. The app needs an image loader that adds the token and refreshes it on 401; file ids reach every viewer.
2. **`GET /files/:id/content` for the owner, an attachment route for viewers** (`GET /views/ring/:ringId/attachments/:attachmentId/content` and one for the avatar): access follows the projection the viewer already sees; no file id reaches a viewer; two routes to keep in step.
3. **A signed, short-lived `url` on the entities**: the API adds `avatarUrl` and a `url` per attachment when it builds the owner and view entities, after the access check it already runs; images load and cache like any web image, a copied link expires. The app re-reads the entity when a url has expired.

Recommendation: option 3. It answers which id a viewer has, keeps file ids off the view, and gives the expiring links S5 asks for.

## Responsible

`decider` above: the owner, before [[T-062 Story]] is approved, after hearing from the backend how urls would be signed and how long they live, and from the frontend how images are cached.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold record D-16 "<the answer>"`, fills the decision card DR-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact DR-NN` and flag the notes it lists)
