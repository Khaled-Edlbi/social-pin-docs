---
id: FR-18
type: frontend-requirements
module: discovery
feature: badge-qr
status: draft
scope: feature
screens: [s34, s43, s44, s56]
owner: "Omar Fostok"
affects: ["BD-18 Badge & QR Backend Delivery"]
related: ["S-37 Badge & QR Story", "BI-09 View As & Pin Views Backend Integration", "FR-14 Connections Frontend Requirements", "FR-17 Ring Invitations & Join Frontend Requirements", "D-10 Connect sends what the requester already has", "D-11 The badge code stays the same for its day", "D-12 The badge QR is a socialpin.me link", "D-22 The public page only says the Pin exists", "D-28 Scan someone in is not in the MVP", "D-35 A join code can be shown as a QR", "S-53 Events During Story", "S-71 Subscription (Free vs Pro) Story", "S-82 Devices & NFC Story", "S-87 Error Contract Story", "Frontend Contract"]
created: 2026-10-18
updated: 2026-11-08
tags: [frontend-requirements, frontend-requirements/draft, module/discovery, layer/frontend]
---

# Badge & QR · Frontend Requirements

**Feature:** [[F-18 Badge & QR]] · **Status:** Draft · **Story:** [[S-37 Badge & QR Story]] (approved 2026-11-08) · **API Integration:** not yet (backend not built)

What the client needs from the backend to build [[S-37 Badge & QR Story]] S1–S15, and whether each need is met today. **Rewritten 2026-11-08** against the approved story and [[D-10 Connect sends what the requester already has|D-10]], [[D-11 The badge code stays the same for its day|D-11]], [[D-12 The badge QR is a socialpin.me link|D-12]], [[D-35 A join code can be shown as a QR|D-35]]. The route names come from the story and the decisions; anything they don't name is asked as a need, for the backend to name in [[BD-18 Badge & QR Backend Delivery]].

Each screen ends with **What changes in the app**: the app as it is today (`social_pin`, `rings/F-11/honest-rings`) and what this feature changes on it.

## Per screen

### [[Screen Index#s34|s34]] Badge (S1–S4, S12–S14)

- **Needs:**
  - **the picked Ring's code**: `POST /rings/:ringId/qr` → `{ token, issuedAt, expiresAt, url }`; the same token while inside its window, a new one past `expiresAt` (D-11); `url` is `https://socialpin.me/q/<token>` (D-12);
  - **reset**: kill the code and get a new one (`{ reset: true }` or a reset route: the backend chooses);
  - refusals: a Ring that isn't mine (404 `E_RING_02`), a Ring that has ended (the backend names the code);
  - **the scan count** for the picked Ring (S13);
  - my Rings (exists) and my Pro state (exists) for the "changes every 24 h" line and *Get Pro*.
- **Source today:** `GET /rings` ✅, `GET /users/me` ✅ (`accountType`). The code, reset and count: not yet.
- **What changes in the app:** today the QR is a painted placeholder with a fixed "A-2213-7741", and `BadgeEndPoints` is empty.
  - The QR is drawn from `url`, with "Changes in {time}" from `expiresAt`; picking another Ring re-draws it with that Ring's code.
  - **Reset code** is new (asks first).
  - **Offline:** *Refreshing* within the window, *Expired* past it (no QR); *No Ring* when none is live.
  - **Removed:** "Accept scans automatically" and "Auto-accept until 18:00" (D-28: a scan never adds anyone to a Ring); the caption "Anyone without the app lands on your {ring} card in a browser" (D-22: no Ring is shown without the app).
  - **Save image** saves the badge to photos with "Works until {time}"; **Share link** reads "Not available yet" until `socialpin.me` works; **NFC tap** "Not available yet" (Devices & NFC).
  - The scan count shows nothing until its route exists (no sample number).
  - The "rotates every 24 h" note and *Get Pro* stay; the permanent code is S-71's and waits on the domain.

### [[Screen Index#s43|s43]] Scanner (S5–S7, S9)

- **Needs:**
  - **resolve a badge**: `GET /views/qr/:token` → `RingProfileViewEntity` (the same body as `GET /views/ring/:ringId`) **plus the code's `expiresAt`** (for Save for later, S8); never a Ring id or a user id;
  - one neutral 404 for unknown, expired, reset, ended, deleted, not shared and blocked, with even timing;
  - **429** when I scan too often, with when I may scan again if the backend gives it;
  - **how a Ring's join QR is told apart from a badge** (D-35), written in BD-17, so the phone can route it to the join review ([[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]] s43) without a request;
  - **a Pin name lookup**: `GET /views/pin/:pinName` (exists).
- **Source today:** `GET /views/pin/:pinName` ✅ (defined in the app's `SharedEndPoints.pinView`, never called). The QR resolve: not yet.
- **What changes in the app:** today tapping the viewfinder stands in for a code and opens a sample "Reading" screen; there is no camera package.
  - A **real camera reader** (a QR scanning package) and *From photos* with the same reader.
  - **On the phone, no request:** `https://socialpin.me/q/<token>` → resolve; a join QR → s74 review (FR-17); anything else → "Not a Social Pin code", keep scanning. One resolve per code per 5 s; cancel an in-flight resolve on flip-back.
  - **Own badge:** the app compares the scanned token with the codes it holds for my Rings → View as, marked preview; no request.
  - **Removed:** "They will land in {Ring}" and its *Change* (D-28): the scanner lands nowhere.
  - **Enter a Pin name** becomes real: a field → `GET /views/pin/:pinName` → s44, or the neutral "This profile isn't available".
  - States: looking, checking ("Checking who this is"), not available, not a Social Pin code, slow down, camera denied (*Open settings*), offline.

### [[Screen Index#s44|s44]] Scanned card (S8)

- **Needs:**
  - the card: `RingProfileViewEntity` (exists in shape, [[BI-09 View As & Pin Views Backend Integration|BI-09]]);
  - **Connect** by the scanned code: `POST /connections/requests { qrToken }` (D-10, [[FR-14 Connections Frontend Requirements|FR-14]]); from a Pin-name card, `{ pinName }`;
  - the code's `expiresAt` from the resolve (above).
- **Source today:** the card shape ✅ (via `/views/ring` and `/views/pin`); Connect: not yet (FR-14).
- **What changes in the app:** today `scanned_pin_screen.dart` shows a sample person, *Connect* goes to *Pick a Ring*, and *Save for later* does nothing.
  - The card is the resolved one (null is "not shared", no Ring name anywhere).
  - **Save for later** keeps the card, the code and its `expiresAt` on the phone only, in a new **Saved scans** list (with remove).
  - From a saved scan, *Connect* works until `expiresAt`; after it, "This code has expired. Scan {name} again to connect." and *Connect* off. The saved card is never read again from the server.

### [[Screen Index#s56|s56]] Event pass (S15)

- Owned by [[S-53 Events During Story|Events During · S9]]: the same kind of code with a 60 s window. Nothing asked here.
- **What changes in the app:** none in this feature.

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| My Rings (the badge's picker) | `GET /rings` | ✅ | S1 |
| My Pro state | `GET /users/me` (`accountType`) | ✅ | S14 |
| A card by Pin name | `GET /views/pin/:pinName` | ✅ | S9 |
| The picked Ring's code `{ token, issuedAt, expiresAt, url }`, same while valid | `POST /rings/:ringId/qr` | ❌ | S1, D-11, D-12 |
| Reset the code | `{ reset: true }` or a reset route | ❌ | S2, D-11 |
| Resolve a scanned code → the card + `expiresAt`, one neutral 404, even timing | `GET /views/qr/:token` | ❌ | S6, S8 |
| Rate limit on resolving (429) | on `GET /views/qr/:token` | ❌ | S6 |
| Tell a join QR from a badge | in BD-17 | ❌ | S6, D-35 |
| Connect by scanned code / by Pin name | `POST /connections/requests` | ❌ | S8, S9, D-10, FR-14 |
| Scan count for a Ring | — | ❌ | S13 |
| Permanent code (Pro) | — | ❌ | S14, [[S-71 Subscription (Free vs Pro) Story|S-71]] |
| The `/q/<token>` web page, app links (deep links), Share link | the domain | later | S12, D-12, D-22 |

## Behaviour expectations

- **The code:** asked when the badge opens and when the picked Ring changes; reused from the cache while `now < expiresAt` (server time: offset the phone's clock by the response's `Date` header); never shown past `expiresAt`. Cache key: (signed-in user, ring id) with `issuedAt` and `expiresAt`; cleared on reset, on sign-out and when the Ring is deleted.
- **Reading a link on the phone:** a QR matches only if it starts with `https://socialpin.me/q/`; the token is the rest, sent as is; no other check on its shape. The join-QR form follows BD-17.
- **Resolve:** debounce one call per token per 5 s; cancel on flip-back; never log the token; one neutral message for every 404.
- **Saved scans:** on the device only (the card, the token, `expiresAt`, the date); removed on sign-out; never synced.
- **Own badge:** compare with the cached tokens of my Rings before any request.
- **Scan count:** read on badge open; no polling.
- **Never shown:** a Ring id; a Ring name on someone else's card; that a scan was counted.
- **Reduced motion:** the rise, the re-compose, the flip and the found-code animation each have a crossfade.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | resolve or Pin name: "This profile isn't available"; keep scanning |
| 404 | `E_RING_ACCESS_02` | the same to a scanner; on my own code, "This Ring has ended" |
| 404 | `E_RING_02` | asking a code for a Ring that isn't mine: read `GET /rings` again and reset the picked Ring |
| 429 | — (named in BD-18) | "Slow down", keep the camera open |
| 401 | `E_AUTH_04` | sign in again |
| — | an ended Ring, the reset, the count | named by the backend in BD-18; branch on `statusCode` until [[S-87 Error Contract Story|Error Contract · S4–S8]] |
| client | camera permission denied | inline, *Open settings* |
| client | not a Social Pin code | "Not a Social Pin code", keep scanning |
| client | a saved scan past `expiresAt` | "This code has expired. Scan {name} again to connect." |

## Blocked by

- [[BD-18 Badge & QR Backend Delivery]]: the code, reset, resolve, rate limit and count rows.
- [[BD-17 Ring Invitations & Join Backend Delivery]]: telling a join QR from a badge.
- [[FR-14 Connections Frontend Requirements]] / BD-14: Connect.
- The `socialpin.me` domain and app links (D-12): Share link, the web page, deep links, the Pro code.
- [[S-87 Error Contract Story|Error Contract · S4–S8]]: the error table is by status until then.

## Log

- 2026-11-08 · `tickets/frontend/M-04-discovery/F-18-badge-qr/FR-18-draft` · rewritten against the approved S-37 (S1–S15) and D-10, D-11, D-12, D-35: per screen s34, s43, s44, s56 with **What changes in the app** under each; the code route with `url` and reset, the resolve with `expiresAt` and a 429, Connect by code or Pin name, the Pin name lookup (exists), Saved scans until the code expires, the join QR routed to FR-17; removed: auto-accept, "They will land in", the browser caption; Share link not available until the domain; the five ⚠ flags settled and cleared (D-10, D-11, D-12, S-23's renumbering, S-37); stays draft
