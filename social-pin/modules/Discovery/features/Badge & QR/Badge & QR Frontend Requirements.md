---
type: frontend-requirements
code: badge-qr
scope: feature
feature: badge-qr
module: discovery
status: draft
screens: [s34, s43, s44, s56]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/discovery, layer/frontend]
---

# Badge & QR · Frontend Requirements

**Feature:** [[Badge & QR]] · **Status:** Draft · **Story:** [[Badge & QR Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build the screens in [[Badge & QR Story]], and whether each need is met today. Rendering a resolved Ring is done; issuing a token, resolving one, counting scans and sharing are not.

## Per screen

### [[Screen Index#s34|s34]] Badge (flip)

- Needs: the active Ring (name, colour), an opaque token for it with its issue time and rotation window, the scan count, a share URL, the Pro state for the "permanent" hint.
- Source today: `GET /rings` for the Ring (the client keeps "active Ring" locally); `GET /users/me` for `accountType`. Token, counter, share URL: not yet.

### [[Screen Index#s43|s43]] Reading the code

- Needs: resolve a token to a Ring view with one neutral failure.
- Source today: not yet. Until T-008, the only encoding the API can resolve is a Ring id through `GET /views/ring/:ringId`; treat any such QR as temporary and never ship it as the real format.

### [[Screen Index#s44|s44]] Scanned Pin

- Needs: `RingProfileViewEntity` (done); the presenter's user id for *Connect*.
- Source today: `GET /views/ring/:ringId` ✅ for the view; the user id is not in it and must come with the resolve response or the request endpoint.

### [[Screen Index#s56|s56]] Event pass

- Needs: a token for the Event Ring with a 60 s window, server time to align the countdown.
- Source today: not yet.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Render a resolved Ring | `GET /views/ring/:ringId` | ✅ | — |
| My Rings for the active-Ring label | `GET /rings` | ✅ | — |
| Pro state for the permanent-code hint | `GET /users/me` | ✅ | — |
| Issue / rotate the token for a Ring | — | ❌ | [[T-007 Issue and rotate the QR token for a Ring]] |
| Resolve a scanned token, same body and same 404 as the view | — | ❌ | [[T-008 Resolve a scanned QR token]] |
| Scan count per Ring | — | ❌ | [[T-009 Scan counter and share link]] |
| Share link URL | — | ❌ | [[T-009 Scan counter and share link]] |
| Browser page behind the share link | — | ❌ | [[T-010 Public browser page for viewers without the app]] |
| Permanent token (Pro) | — | ❌ | [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]] |
| Event pass token, 60 s window | — | ❌ | [[T-037 Event pass with a 60 s rotating code]] |
| NFC card bound to the same token | — | ❌ | [[Devices & NFC Story|Devices & NFC · S7]] |
| Connect from s44 | — | ❌ | [[T-021 Connect request send, inbox, cancel]] |
| Avatar bytes on the badge and the resolved card | — | ❌ | [[Files Upload Story|Files Upload · showing files]] |

## Behaviour expectations

- Refetch / realtime: fetch the token when the badge opens if the cached one is older than its window or belongs to another Ring; refetch the counter on open and on pull-down, no polling. The event pass re-fetches at the window boundary from a timer aligned to server time (use the response `Date` header or a `serverTime` field once T-037 defines it).
- Caching keys: token by (signed-in user, ring id) with `issuedAt`; resolved views by (viewer, token) for 60 s at most, so a re-scan after a revoke is honoured; "recent scans" on the device only, holding the view and the user id, never the token.
- Pagination / ordering: none on these screens.
- Scanner: debounce one resolve per token per 5 s; cancel an in-flight resolve on flip-back; never log the token.
- Offline: show the last token with a *Refreshing* chip; after the window has passed on a free account, show *Expired* and refuse to render it as a QR.
- Reduced motion: every signature motion here has a crossfade fallback; the badge must be usable with animations off.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | one neutral message on s43 / s44: "This profile isn't available"; keep scanning |
| 404 | `E_RING_ACCESS_02` | the same message to a scanner; "This Ring has expired" when scanning my own badge |
| 404 | `E_RING_02` | issuing a token for a Ring that is not mine: refetch `GET /rings` and reset the active Ring |
| 403 | `E_RING_05` | an admin below the needed level asked for a token: hide the badge for that Ring |
| 401 | `E_AUTH_04` | sign in again |
| — | token-specific codes | to be defined by T-007 / T-008 (invalid, rotated, revoked must share the neutral 404); branch on `statusCode` until [[Error Contract Story|Error Contract · S4–S8]] |
| client | camera permission denied | inline state with *Open settings* |
| client | not a Social Pin code | "Not a Social Pin code", keep scanning |

## Blocked by

- [[T-010 Public browser page for viewers without the app]] — the share link row and the anonymous-visitor persona (needs a decision on which Ring is public).
- [[T-007 Issue and rotate the QR token for a Ring]] and [[T-008 Resolve a scanned QR token]] — the token rows; nothing on s34 or s43 is real without them.
- [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]] — the permanent-code row.
- [[Error Contract Story|Error Contract · S4–S8]] — the error table is by status until then.
