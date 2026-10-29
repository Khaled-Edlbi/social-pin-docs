---
type: needs-decision
id: ND-16
status: open
features: [files]
blocks: ["S-06 Files Upload Story"]
decider: "owner"
screens: [s14, s29, s30, s31, s44]
affects: []
related: ["F-04 Files Upload", "F-10 Ring Projection", "F-12 View As & Pin Views", "D-16 Files load from signed links that expire in 15 minutes"]
owner: "omar"
created: 2026-10-25
updated: 2026-10-29
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-16 · Viewer access to file bytes

**Status:** open · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[S-06 Files Upload Story]] · **Feature:** [[F-04 Files Upload]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-16** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

How a client gets the bytes of a Ring photo or attachment, and with which id: an authenticated route keyed by file id, or a signed `url` handed out on the entities. The owner has the file id everywhere; a viewer does not: the view's attachments carry only the attachment `id`. Until this is chosen, [[S-06 Files Upload Story|Files Upload · showing files]] cannot name its route or its response fields, and every photo and file in the app ([[Screen Index#s14|s14]], [[Screen Index#s29|s29]], [[Screen Index#s30|s30]], [[Screen Index#s31|s31]], [[Screen Index#s44|s44]]) stays a placeholder.

## Notes

- Nothing serves file bytes today: `storageKey` is private, the static `/uploads` mount is keyed by it, and `GET /files/:id` returns metadata to the uploader only ([[BD-04 Files Upload Backend Delivery]], [[BI-03 Files Upload Backend Integration]]).
- The owner's `RingProfileOwnerEntity` carries `avatarFileId` and `fileId` per attachment ([[BI-07 Ring Projection Backend Integration]]); the viewer's `RingProfileViewEntity` carries `avatarFileId` and, per attachment, `id`, `label`, `filename`, `mimeType`, `sizeBytes`, no `fileId` ([[BI-09 View As & Pin Views Backend Integration]]).
- The task names `GET /files/:id/content` or a signed `url` on the view entities; access is the uploader, or anyone who may see a live Ring that references the file, through `RingAccessService`. `PUBLIC` files skip the check.
- A refused file must look like a missing one (one 404), a hidden attachment is never served, and a link copied out of the app must be useless without access ([[S-06 Files Upload Story]] S5).
- Context-scoped files are served from the API's own origin, which is why uploads are limited to an allow-list of types ([[BD-04 Files Upload Backend Delivery]]).
- **Backend input (2026-10-29, checked against `main @ b4984d6`): how option 3 would be built.**
  - *Signing.* One public route, `GET /files/content/:token`. The token is opaque and carries the file id and an expiry, signed (HMAC) with its own server secret, required at boot like the JWT secrets. The route checks the signature and the expiry, then serves the bytes with the stored `mimeType`, `nosniff`, inline for images and as a download for documents, cached privately for no longer than the link has left.
  - *Who gets a url.* The url is minted only after the access check that already runs: on the owner's entities after the ownership check, on the view after the Ring access check, so every visibility decision still goes through the Ring access engine. The signer never decides access. A hidden attachment is excluded by the query and never gets a url. The fields would be `avatarUrl` and a `url` per attachment, on the owner's and the viewer's entities, and `url` on the uploader's file metadata.
  - *Lifetime.* 15 to 60 minutes; the owner picks. When a url expires the app re-reads the entity. The trade-off: a url stays valid until it expires, even if the viewer loses access to the Ring in between; a short lifetime keeps that window small.
  - *Refusals.* A bad signature, an expired url and a deleted file answer the same 404 `E_FILE_01`, so a refused file looks like a missing one (S5).
  - *Object storage.* When the bytes move to object storage, the url becomes the provider's own pre-signed url and the field does not change, so the client is unaffected. Options 1 and 2 would keep the API streaming every byte, or change the contract at that point.
  - *Option 1, from the backend's side.* It works, but every image load needs a bearer token and the 401 refresh, which ordinary image loaders and caches do not do, and it hands file ids to every viewer.
- **Found during this review, separate from the decision.** The static `/uploads` mount serves the whole uploads folder with no access check, and every upload, including context-scoped Ring photos and attachments, is stored there. Today a context-scoped file is protected only by its random storage key never being handed out, and once that key leaks it cannot be revoked. Whatever is decided, the mount should serve only `PUBLIC` files, and context-scoped bytes should leave only through the route chosen here. This is a backend fix that does not wait on the decision.

## Options

1. **`GET /files/:id/content`, and the view adds `fileId`**: one route for owner and viewer, bearer token on every request, access checked per request. The app needs an image loader that adds the token and refreshes it on 401; file ids reach every viewer.
2. **`GET /files/:id/content` for the owner, an attachment route for viewers** (`GET /views/ring/:ringId/attachments/:attachmentId/content` and one for the avatar): access follows the projection the viewer already sees; no file id reaches a viewer; two routes to keep in step.
3. **A signed, short-lived `url` on the entities**: the API adds `avatarUrl` and a `url` per attachment when it builds the owner and view entities, after the access check it already runs; images load and cache like any web image, a copied link expires. The app re-reads the entity when a url has expired.

Recommendation: option 3. It answers which id a viewer has, keeps file ids off the view, and gives the expiring links S5 asks for.

## Responsible

`decider` above: the owner, before [[S-06 Files Upload Story]] is approved, after hearing from the backend how urls would be signed and how long they live, and from the frontend how images are cached.

## Decision

Fulfilled by [[D-16 Files load from signed links that expire in 15 minutes]] — decided 2026-10-29 by khaled: option 3.
