---
type: feature
id: badge-qr
name: "Badge & QR"
status: partial
priority: P0
module: discovery
screens: [s34, s43, s44, s56]
related: ["Account", "Rings"]
updated: 2026-10-18
tags: [feature, status/partial, module/discovery, priority/P0]
---

# 🟡 Badge & QR

**Status:** Partial (needs more) · **Priority:** P0 · **Module:** [[Discovery Module|Discovery]]

**Layers:** [[Badge & QR Story|Story]] · [[Badge & QR Frontend Requirements|Frontend Requirements]] · [[Badge & QR Backend Delivery|Backend Delivery]] · [[Badge & QR Backend Integration|Backend Integration]] · [[Badge & QR Frontend Delivery|Frontend Delivery]] · [[Badge & QR QA Backend|QA Backend]] · [[Badge & QR QA Frontend|QA Frontend]]

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

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
