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
