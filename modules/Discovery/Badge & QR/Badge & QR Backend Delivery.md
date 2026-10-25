---
type: backend-delivery
code: badge-qr
scope: feature
feature: badge-qr
module: discovery
status: in-progress
screens: [s34, s43, s44, s56]
created: 2026-10-18
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/in-progress, module/discovery, layer/backend]
---

# 🟡 Badge & QR · Backend Delivery

**Feature:** [[Badge & QR]] · **Status:** In progress · **Integration guide:** [[Badge & QR Backend Integration]] · **Requirements:** [[Badge & QR Frontend Requirements]] · **QA:** [[Badge & QR QA Backend]]

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

- Issue a token for the active Ring and rotate it every 24 h (permanent QR is a Pro gate, see [[Subscription (Free vs Pro)]]).
- Resolve-on-scan endpoint that maps a token to a Ring view without exposing the ring id.
- Scan counter (feeds [[Post-Event]] and [[Exhibitor]] analytics).
- "Share link" and a public browser page for viewers without the app.
- Event pass code rotating every 60 s (s56) is the same mechanism with a shorter window. See [[Events During]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Badge & QR]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
