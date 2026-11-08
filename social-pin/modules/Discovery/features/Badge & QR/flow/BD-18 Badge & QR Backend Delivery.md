---
id: BD-18
type: backend-delivery
module: discovery
feature: badge-qr
status: in-progress
scope: feature
screens: [s34, s43, s44, s56]
depends: ["FR-18 Badge & QR Frontend Requirements", "S-37 Badge & QR Story", "D-10 Connect sends what the requester already has", "D-11 The badge code stays the same for its day", "D-12 The badge QR is a socialpin.me link", "D-28 Scan someone in is not in the MVP", "BD-08 Ring Access Engine Backend Delivery", "BD-12 View As & Pin Views Backend Delivery"]
affects: ["FR-18 Badge & QR Frontend Requirements", "BD-14 Connections Backend Delivery"]
related: ["POST /rings/:ringId/qr", "POST /rings/:ringId/qr/reset", "GET /rings/:ringId/qr/scans", "GET /views/qr/:token", "GET /views/ring/:ringId", "E_RING_02", "E_RING_03", "E_BADGE_01", "D-22 The public page only says the Pin exists", "D-35 A join code can be shown as a QR", "Ring Access Model", "F-28 Subscription (Free vs Pro)", "F-23 Events During"]
created: 2026-10-18
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/in-progress, module/discovery, layer/backend]
---

# 🟡 Badge & QR · Backend Delivery

**Feature:** [[F-18 Badge & QR]] · **Status:** In progress · **Integration guide:** [[Badge & QR Backend Integration]] · **Requirements:** [[FR-18 Badge & QR Frontend Requirements]] · **QA:** [[Badge & QR QA Backend]]

What the backend built for this feature and how it works. **Not on `main` yet:** everything below is on the code branch `FR-18/badge/qr-token-issue-resolve` (`a566a2e`, from `main` `cb95a39`), waiting for review and merge. Until it merges, `main` has the `RingQrToken` table and no route that issues or resolves a code.

## Endpoints, tables and code

**Endpoints** (all signed in; on the branch)

| Method and path | Who | What | Story |
|---|---|---|---|
| `POST /rings/:ringId/qr` | the Ring's owner | the badge code `{ token, issuedAt, expiresAt, url }`: the same while inside its 24 h window, a new one past it (201 either way) | S1, S4, D-11, D-12 |
| `POST /rings/:ringId/qr/reset` | the Ring's owner | revokes the code now, issues a new one (201) | S2, D-11 |
| `GET /rings/:ringId/qr/scans` | the Ring's owner | `{ scanCount }`: counted scans across every code the Ring has had | S10, S13 |
| `GET /views/qr/:token` | any signed-in viewer | the scanned code's card: `GET /views/ring/:ringId`'s body plus the code's `expiresAt` | S6, S8 |

**Tables / models:** `RingQrToken` (`ring_qr_tokens`), unchanged: no migration. `NfcToken` is F-33's.

**Code:** `src/modules/badge/` (`badge.service.ts`, `badge-token.service.ts`, `badge-rate-limit.service.ts`, `badge.controller.ts`, `badge-scan.controller.ts`, `entities/`); one new method in `src/modules/ring-access/ring-access.service.ts` (`assertRingPresented`); config `QR_TOKEN_SECRET`, `QR_LINK_BASE_URL` (both optional).

## How it works

**The code (D-11, D-12).**
- A token is `base64url(HMAC-SHA256(key, "ring-qr:" + rowId))` cut to 24 bytes: **32 characters**, opaque. The row id is a random UUID nobody is ever shown, so the token carries no Ring id, user id or Pin name, readable or not.
- Only `sha256(token)` is stored (`token_hash`). The server re-derives the plaintext from the row id and the key, which is how the **same code all day, on any phone** works without storing the code. The key is `QR_TOKEN_SECRET`, else one derived from `JWT_SECRET`; changing it retires every live code, and the next badge open issues a new one.
- `url` is `QR_LINK_BASE_URL` (default `https://socialpin.me/q/`) + the token.
- **Lifetime:** `expiresAt = issuedAt + 24 h`, exclusive. Inside the window the route hands back the same code; past it, the old row is revoked and a new one issued in the same transaction. The Ring's row is locked (`SELECT … FOR UPDATE`) first, so phones opening the badge at the same moment get one code (checked live: 5 parallel opens, one code, one live row).
- **Reset** revokes every live code of the Ring and issues the next, whatever the window.
- **Only my live Rings (S4):** a Ring that isn't mine, or doesn't exist, answers 404 `E_RING_02` (`RingService.findOneForOwner`, the same body either way; a delegated Ring admin gets it too: a badge is personal). A Ring of mine that has ended (window over, or archived) answers 409 `E_RING_03`. The scan count is owner-only too, and an ended Ring keeps its count.

**The resolve (S6, S8, S10).**
1. 20 resolves a minute per signed-in viewer, every attempt counted (a refused one too: guessing is what the limit stops); the 21st answers 429 `E_BADGE_01` before any lookup. The proposal S-37 asked `/backend` for.
2. The token's shape is checked; then its hash is looked up, **unrevoked and unexpired**.
3. `RingAccessService.assertRingPresented(ringId, viewer)` decides: a valid code is its owner **presenting** that Ring to whoever holds it, so membership is not asked; the Ring must be live (not ended, archived or deleted) and **no block** may stand between the viewer and the owner, either way. It makes no membership and reads none ([[D-28 Scan someone in is not in the MVP|D-28]]); a badge never offers a Ring to join ([[D-35 A join code can be shown as a QR|D-35]]).
4. The card is drawn by `RingProfileService.viewByRing` as the owner's View as: the Ring's audience view, the same `RingProfileViewEntity` (no Ring id, user id, owner id or file id), plus `expiresAt`. Checked live: the card equals `GET /views/ring/:ringId`'s body byte for byte.
5. A scan by anyone but the owner adds 1 to that code's `scanCount`; the scanner is never told. `GET …/qr/scans` sums the Ring's codes.

**One refusal.** A malformed, unknown, forged, expired, reset or rotated code, an ended or deleted Ring, and a block either way all answer **404 `E_RING_ACCESS_01`, "This profile is not shared with you"**: the same body as `GET /views/pin/:pinName`'s not-found, and no sooner than **300 ms** after the request began, so the answer time does not tell them apart (checked live: 303–313 ms for all eight). A Ring that ends between the decision and the card (`E_RING_ACCESS_02` from the renderer) is folded into the same body.

**Connect by scanned code (D-10).** `BadgeModule` exports `BadgeService.resolveCode(token, viewer)`: the lookup and the access decision without the card, the count, the limit or the floor, throwing the same 404. [[BD-14 Connections Backend Delivery]] calls it for `POST /connections/requests { qrToken }`; `access.ownerUserId` is who to address.

### What exists

On the branch `FR-18/badge/qr-token-issue-resolve`, not on `main`:

- The code route with the 24 h window and `url`, the reset, the scan count, the resolve with `expiresAt`, the 429, the even-timed single 404, and `resolveCode` for Connect.
- `RingQrToken`: opaque, hashed at rest, revocable (on `main`).
- Specs: every refusal, the identical bodies, no Ring id, user id, file id, row id or token in a response, the lock order, the window, the reset, the count, the limit. 763 unit tests green; a live run on a throwaway database passed all 34 checks.

### Gaps

- **Not merged:** nothing above is on `main` until the branch is reviewed and merged.
- The 429 limit is kept in the process's memory: behind several instances each counts alone.
- A deleted Ring's codes are not revoked on delete (`RingService.remove` is F-11's); they are refused because the engine requires a live Ring. The same holds for an ended Ring.
- The 429 carries no `Retry-After`; the window is one minute.
- **Later, with the domain (D-12, D-22):** the `/q/<token>` web route, the public page and the app-link files.
- A Pro permanent code ([[F-28 Subscription (Free vs Pro)]]) and the 60 s event pass ([[F-23 Events During]]): the same rows with other windows, not built.
- Telling a join QR from a badge: BD-17's (D-35).

## Log

- 2026-10-18 · split out of [[F-18 Badge & QR]] when the vault moved to layers
- 2026-11-08 · FR-18 approved by the backend on `tickets/backend/M-04-discovery/F-18-badge-qr/FR-18-accepted`; stays `in-progress`
- 2026-11-08 · code branch `FR-18/badge/qr-token-issue-resolve` (`a566a2e`, not merged) · S-37 S1–S4, S6, S10, S13 · `POST /rings/:ringId/qr`, `POST /rings/:ringId/qr/reset`, `GET /rings/:ringId/qr/scans`, `GET /views/qr/:token`; new `E_BADGE_01`; `E_RING_03` now used; `RingAccessService.assertRingPresented`; no migration · the four flags (S-37, D-12, D-11, D-10) settled by this note and cleared
