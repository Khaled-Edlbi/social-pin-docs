---
id: BD-18
type: backend-delivery
module: discovery
feature: badge-qr
status: in-progress
scope: feature
screens: [s34, s43, s44, s56]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/in-progress, module/discovery, layer/backend]
---

# 🟡 Badge & QR · Backend Delivery

> ⚠ Affected by [[S-37 Badge & QR Story]] (2026-11-08): S-37 rewritten (S1–S15): "What the backend has to build" lists the code route with url and reset, the resolve with expiresAt, a 429 rate limit and the scan count, Connect sharing the token lookup, and the domain routes later

> ⚠ Affected by [[D-12 The badge QR is a socialpin.me link]] (2026-11-08): url on the token response (next to token, issuedAt, expiresAt), built from a configured base https://socialpin.me/q/; the /q/<token> web route and the app-link files on the domain come later

> ⚠ Affected by [[D-11 The badge code stays the same for its day]] (2026-11-04): ND-11 decided, option 2: the route returns the valid token or issues one past its window, plus a reset; issuedAt and expiresAt in the response.

> ⚠ Affected by [[D-10 Connect sends what the requester already has]] (2026-11-04): ND-10 decided, option 3: the resolve stays without a user id; the token lookup is shared with the connection request route.

**Feature:** [[F-18 Badge & QR]] · **Status:** In progress · **Integration guide:** [[Badge & QR Backend Integration]] · **Requirements:** [[FR-18 Badge & QR Frontend Requirements]] · **QA:** [[Badge & QR QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /views/ring/:ringId (render after resolve)`

**Tables / models:** `RingQrToken`, `NfcToken`

**Code:** `src/modules/ring-profile/profile-view.controller.ts`

### What exists

- `RingQrToken` table: opaque, hashed, revocable.
- Rendering a scanned Ring is `GET /views/ring/:ringId`.

### Gaps

- Issue a token for the active Ring and rotate it every 24 h (permanent QR is a Pro gate, see [[F-28 Subscription (Free vs Pro)]]).
- Resolve-on-scan endpoint that maps a token to a Ring view without exposing the ring id.
- Scan counter (feeds [[F-25 Post-Event]] and [[F-24 Exhibitor]] analytics).
- "Share link" and a public browser page for viewers without the app.
- Event pass code rotating every 60 s (s56) is the same mechanism with a shorter window. See [[F-23 Events During]].

## Log

- 2026-10-18 · split out of [[F-18 Badge & QR]] when the vault moved to layers
