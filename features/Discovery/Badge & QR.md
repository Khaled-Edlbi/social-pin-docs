---
type: feature
id: badge-qr
name: "Badge & QR"
status: partial
priority: P0
domain: discovery
screens: [s34, s43, s44, s56]
updated: 2026-10-15
tags: [feature, status/partial, domain/discovery, priority/P0]
---

# 🟡 Badge & QR

**Status:** Partial (needs more) · **Priority:** P0 · **Domain:** [[Feature Tree#Discovery|Discovery]]

The centre-tab badge: a QR bound to the active Ring, rotated every 24 h, a share link, a scan counter, and a browser page for people without the app. Scanning resolves the token into that Ring's view.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s34|s34]] | Badge (flip) |  |
| [[Screen Index#s43|s43]] | Reading the code |  |
| [[Screen Index#s44|s44]] | Scanned Pin | Read part done; Connect todo |
| [[Screen Index#s56|s56]] | Event pass |  |

Wireframe brief sections: [[Wireframe Brief#Badge / QR|§4.4 Badge / QR]], [[Wireframe Brief#QR scan|§4.5 QR scan]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

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

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-007 Issue and rotate the QR token for a Ring]] | ⬜ To do | P0 | M |
| [[T-008 Resolve a scanned QR token]] | ⬜ To do | P0 | M |
| [[T-009 Scan counter and share link]] | ⬜ To do | P1 | S |
| [[T-010 Public browser page for viewers without the app]] | ❓ Needs a decision / info | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "badge-qr" SORT priority ASC
```

## Related

- [[View As & Pin Views]]
- [[Connections]]
- [[Events During]]
- [[Devices & NFC]]
- [[Subscription (Free vs Pro)]]
- [[Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
