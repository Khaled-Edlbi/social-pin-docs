---
id: BI-15
type: backend-integration
module: discovery
feature: badge-qr
status: current
scope: feature
screens: [s34, s43, s44, s56]
depends: ["BD-18 Badge & QR Backend Delivery", "FR-18 Badge & QR Frontend Requirements", "S-37 Badge & QR Story"]
affects: ["FR-18 Badge & QR Frontend Requirements"]
related: ["POST /rings/:ringId/qr", "POST /rings/:ringId/qr/reset", "GET /rings/:ringId/qr/scans", "GET /views/qr/:token", "GET /views/ring/:ringId", "GET /views/pin/:pinName", "E_RING_02", "E_RING_03", "E_BADGE_01", "BI-09 View As & Pin Views Backend Integration", "D-10 Connect sends what the requester already has", "D-11 The badge code stays the same for its day", "D-12 The badge QR is a socialpin.me link", "D-28 Scan someone in is not in the MVP", "D-35 A join code can be shown as a QR", "FR-14 Connections Frontend Requirements", "BI-16 Connections Backend Integration", "POST /connections/requests", "POST /blocks", "GET /connections/relationship"]
pending: []
created: 2026-11-08
updated: 2026-11-09
tags: [backend-integration, backend-integration/current, module/discovery, layer/backend]
---

# 🔌 Badge & QR · Backend Integration

**Feature:** [[F-18 Badge & QR]] · **Backend:** ✅ [[BD-18 Badge & QR Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]], [[BI-09 View As & Pin Views Backend Integration]]

Written by the **backend** team for the frontend: how to call what was delivered. **`current`:** matches backend `main` `ebdca36` (local, not pushed yet): the badge module from `FR-18/badge/qr-token-issue-resolve` (`a566a2e`, in `1c460b0`), and since 2026-11-09 Connect, Block and the relationship by the scanned token (`FR-14/connection/scan-token`, `2a1821b`).

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s34\|s34]] Badge | opens the badge, or picks another Ring | `POST /rings/:ringId/qr` → draw the QR from `url` |
| s34 | *Reset code* (after the confirm) | `POST /rings/:ringId/qr/reset` → redraw from the new `url` |
| s34 | sees the scan count | `GET /rings/:ringId/qr/scans` on badge open, no polling |
| [[Screen Index#s43\|s43]] Scanner | reads a `https://socialpin.me/q/<token>` code, camera or *From photos* | `GET /views/qr/:token` → s44 |
| s43 | *Enter a Pin name* | `GET /views/pin/:pinName` (exists, [[BI-09 View As & Pin Views Backend Integration\|BI-09]]) |
| [[Screen Index#s44\|s44]] Scanned card | the button, *Connect*, *Block* | `GET /connections/relationship?qrToken=`, `POST /connections/requests { qrToken, note? }`, `POST /blocks { qrToken }` with the token the card was opened with ([[BI-16 Connections Backend Integration\|BI-16]]) |

## Flow

1. **Badge open / Ring switch:** `POST /rings/:ringId/qr`. Inside the code's window the answer is the **same** code (same `token`, `issuedAt`, `expiresAt`), on this phone or another; past `expiresAt` it is a new one. It is a POST and answers **201** both times.
2. Draw the QR from `url`. Show "Changes in {time}" from `expiresAt`, against the server's clock (offset the phone's by the response's `Date` header).
3. **Reset:** `POST /rings/:ringId/qr/reset` → 201 with a new code and a fresh 24 h window. The old token answers 404 from that moment.
4. **Scan:** take everything after `https://socialpin.me/q/` and send it as is: `GET /views/qr/<token>`. 200 → render s44 from the body; keep the token and `expiresAt` with the card for *Connect* and *Save for later*.
5. **Own badge:** compare the scanned token with the codes you hold for my Rings first; on a match open View as, no request (S-37 S7). If one reaches the server anyway, it answers the card and does not count it.

## Shapes that matter

`POST /rings/:ringId/qr` and `POST /rings/:ringId/qr/reset` (201):

```json
{
  "token": "ll52hi8Hfiks-CHChYJl5KDFHxx0mz9H",
  "issuedAt": "2026-11-08T11:29:16.614Z",
  "expiresAt": "2026-11-09T11:29:16.614Z",
  "url": "https://socialpin.me/q/ll52hi8Hfiks-CHChYJl5KDFHxx0mz9H"
}
```

- `token`: 32 characters, `A–Z a–z 0–9 _ -`. Opaque: no Ring id, user id or Pin name in it; never parse it.
- `expiresAt` is always `issuedAt` + 24 h.

`GET /views/qr/:token` (200): exactly the `RingProfileViewEntity` of `GET /views/ring/:ringId` ([[BI-09 View As & Pin Views Backend Integration|BI-09]]) plus one field:

```json
{
  "pinName": "SaraAz",
  "displayName": "Sara Aziz",
  "headline": null,
  "avatarUrl": "https://…/files/content/…",
  "links": [],
  "attachments": [],
  "expiresAt": "2026-11-09T11:29:16.614Z"
}
```

- `expiresAt` is the **code's** end, not the Ring's: *Connect* from a saved scan works until then (S-37 S8).
- No `ringId`, `userId`, owner id or file id, ever; `null` is "not shared".

`GET /rings/:ringId/qr/scans` (200): `{ "scanCount": 12 }`: successful scans by other people across every code the Ring has had (rotations and resets included).

## State to keep on the client

- Per (signed-in user, Ring id): the last code, with `issuedAt` and `expiresAt`. Reuse it while `now < expiresAt`; cleared on reset, sign-out and Ring delete. Offline past `expiresAt`: *Expired*, no QR.
- Per scan: the card, the token and `expiresAt` (Saved scans, on the phone only).
- Never log a token.

## Errors to handle

| Status | ErrorCode | Meaning | Show |
|---|---|---|---|
| 404 | `E_RING_ACCESS_01` | resolve refused: a malformed, unknown, forged, expired, reset or rotated code, an ended or deleted Ring, or a block either way. One body, "This profile is not shared with you", and the same answer time for all | "This profile isn't available"; keep scanning |
| 429 | `E_BADGE_01` | more than 20 in a minute by this account: every resolve counts, and so does every refused token sent to relationship, *Connect* or *Block* (a successful one does not) | "Slow down"; keep the camera open, try again after a minute |
| 404 | `E_RING_02` | code, reset or count for a Ring that isn't mine (or doesn't exist) | read `GET /rings` again, reset the picked Ring |
| 409 | `E_RING_03` | code or reset for a Ring of mine that has ended (window over, or archived) | pick another live Ring, or *No Ring* |
| 401 | `E_AUTH_04` | session over | sign in again |

The error body carries no `ErrorCode` field today: branch on `statusCode` (and the route) until [[S-87 Error Contract Story|Error Contract · S4–S8]].

## Rules the UI must respect

- **Any signed-in user may scan.** A valid code shows the Ring's card to whoever holds it, member or not; a scan never adds anyone to a Ring ([[D-28 Scan someone in is not in the MVP|D-28]]) and a badge never offers a Ring to join ([[D-35 A join code can be shown as a QR|D-35]]).
- Only a link starting with `https://socialpin.me/q/` is a badge; send the rest unchanged, no shape check on the phone needed (a malformed token answers the same 404).
- One resolve per code per 5 s (the server's limit is 20 a minute per account).
- Never show a Ring id, a Ring name on someone else's card, or that a scan was counted.

## Not available yet

- A deleted account's badge: a code issued before the account was deleted still opens the card until its `expiresAt`; *Connect* and *Block* from it answer the 404 ([[BD-18 Badge & QR Backend Delivery]] *Gaps*).
- Scanning someone into a Ring: not in the MVP ([[D-28 Scan someone in is not in the MVP|D-28]]).
- Telling a join QR from a badge: BD-17 ([[D-35 A join code can be shown as a QR|D-35]]).
- *Share link*, the `/q/<token>` web page, app links: wait on the domain ([[D-12 The badge QR is a socialpin.me link|D-12]], [[S-37 Badge & QR Story|S-37 S12]]).
- A Pro permanent code (S14) and the 60 s event pass (S15): not built.

## Checklist

- [ ] QR drawn from `url`; "Changes in {time}" from `expiresAt` on the server clock.
- [ ] The same code reused while valid; a new one only past `expiresAt` or after a reset.
- [ ] *Reset code* asks first, then redraws.
- [ ] Scanner sends the token after `/q/` as is; own codes open View as without a request.
- [ ] Every 404 on the resolve shows one message; 429 shows "Slow down".
- [ ] `expiresAt` kept with a saved scan; *Connect* off after it.
- [ ] `E_RING_02` re-reads `GET /rings`; `E_RING_03` picks another live Ring.

## Log

- 2026-11-08 · `docs/backend/M-04-discovery/F-18-badge-qr/BI-15-backend-integration` (stacked on `BD-18-qr-code-route`) · written as `draft` against the backend branch `FR-18/badge/qr-token-issue-resolve` (`a566a2e`, not merged): the code, reset, scan count and resolve routes, shapes, errors (`E_BADGE_01` new, `E_RING_03` now used), rules; goes `current` when the branch merges
- 2026-11-08 · `docs/backend/M-04-discovery/F-18-badge-qr/BI-15-current` (stacked on `BD-18-shipped`) · `current`: checked against backend `main` `1c460b0` (badge module unchanged since `a566a2e`; `assertRingPresented` and the `E_RING_ACCESS_01` body unchanged by the F-14 and F-17 merges): token 32 characters, 24 h from `issuedAt`; the four routes; the one 404 body; 429 `E_BADGE_01` past 20 a minute. Connect by `{ qrToken }` marked not accepted yet
- 2026-11-09 · `docs/backend/M-04-discovery/F-18-badge-qr/BI-15-scan-presenter` · stays `current`, checked against backend local `main` `ebdca36` (not pushed yet): the scanned card's relationship, *Connect* and *Block* by `{ qrToken }` (shapes in [[BI-16 Connections Backend Integration]]); the 429 now also counts refused tokens on those three; the "not accepted yet" line replaced by the deleted-account badge gap ([[BD-18 Badge & QR Backend Delivery]])
