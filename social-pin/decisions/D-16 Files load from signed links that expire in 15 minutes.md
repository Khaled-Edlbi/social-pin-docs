---
id: D-16
type: decision
status: decided
features: [files]
decision: ND-16
decidedBy: "khaled"
decidedAt: 2026-10-29
owner: "khaled"
affects: ["S-06 Files Upload Story", "FR-04 Files Upload Frontend Requirements", "BD-04 Files Upload Backend Delivery", "BI-03 Files Upload Backend Integration", "BI-07 Ring Projection Backend Integration", "BI-09 View As & Pin Views Backend Integration", "S-11 Photo Library Story", "FR-06 Photo Library Frontend Requirements", "FR-12 View As & Pin Views Frontend Requirements"]
related: ["ND-16 Viewer access to file bytes", "F-10 Ring Projection", "F-12 View As & Pin Views", "B-07 Context-scoped uploads are served by the public static mount", E_FILE_01]
created: 2026-10-29
updated: 2026-10-29
tags: [decision, decision/decided]
---

# ✅ D-16 · Files load from signed links that expire in 15 minutes

**Answers:** [[ND-16 Viewer access to file bytes]] · **Decided by:** khaled · **On:** 2026-10-29 · **Feature:** [[F-04 Files Upload]]

> This card is the answer to [[ND-16 Viewer access to file bytes]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-16 Viewer access to file bytes]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 3: a signed link that expires.** Wherever the API hands out a Ring photo or an attachment, the entity carries a ready-to-load link: `avatarUrl` beside `avatarFileId`, and a `url` on each attachment, on the owner's entities, on the viewer's view, and on the uploader's own file metadata. The link is made only after the access check the request already ran, so a person gets a link for exactly what they may see, and a hidden attachment gets none. **Each link lives 15 minutes.** When one has expired, the app reads the entity again and gets fresh links. A link that is forged, expired, or points at a file that was deleted answers the same "not found" as a file that never existed. This rules out a route keyed by file id with the bearer token on every image (option 1) and a second set of viewer-only attachment routes (option 2); viewers never receive a file id.

## Why

Three facts on [[ND-16 Viewer access to file bytes]] weighed. A viewer has **no file id** to call a route with, only the attachment's own id, and handing every viewer the file ids was the thing to avoid. The story asks that **a link copied out of the app is useless** to someone without access ([[S-06 Files Upload Story]] S11), and an expiring link gives that by itself. And the links **load like any web image**: the app's image loader and cache work unchanged, where option 1 needed a loader that adds the token and refreshes it on every 401.

The backend's input settled the rest: the link is signed by the server and checked by one route, it keeps the contract when the bytes move to object storage (the field becomes the provider's pre-signed link and the client does not change), and option 1 would have kept the API streaming every byte for good.

What was traded away: a link stays valid until it expires, so a viewer who loses access to a Ring keeps a link they already hold for up to 15 minutes. 15 minutes, the shortest of the range offered, keeps that window small, at the price of the app re-reading entities more often.

## What it changes

- [[S-06 Files Upload Story]]: *Showing files* (S7–S11) no longer waits; the criteria that say "a route or a signed `url`" mean the signed `url`, and S11's copied link expires after 15 minutes (`/pm`). Its approval stands: the decision picks one of the two paths the criteria already allow.
- [[FR-04 Files Upload Frontend Requirements]]: the rows for showing files ask for `avatarUrl` and `url` on the entities, and a re-read when a link has expired (`/frontend`).
- [[BD-04 Files Upload Backend Delivery]] and [[BI-03 Files Upload Backend Integration]]: the signed-link route, its secret and its 15-minute lifetime are the next backend work; `url` on the uploader's file metadata (`/backend`).
- [[BI-07 Ring Projection Backend Integration]]: the owner's projection carries `avatarUrl` and a `url` per attachment (`/backend`).
- [[BI-09 View As & Pin Views Backend Integration]]: the viewer's view carries `avatarUrl` and a `url` per attachment, and still no file id (`/backend`).
- [[S-11 Photo Library Story]] and [[FR-06 Photo Library Frontend Requirements]]: library thumbnails load from the same links (`/pm`, `/frontend`).
- [[FR-12 View As & Pin Views Frontend Requirements]]: the pin view shows photos and files from `avatarUrl` and `url` (`/frontend`).

## Still open

- How the client knows a link is about to expire (an expiry time beside each link, or re-read on the first failed load) is the backend's to propose in [[BI-03 Files Upload Backend Integration]]; nothing waits on it.
- `PUBLIC` files (event covers, logos) stay on the public static mount and need no signed link; nothing writes one yet ([[B-07 Context-scoped uploads are served by the public static mount]]).
- Thumbnails and resized images are not part of this decision.
