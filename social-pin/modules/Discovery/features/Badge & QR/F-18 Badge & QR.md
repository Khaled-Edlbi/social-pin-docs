---
id: F-18
type: feature
module: discovery
feature: badge-qr
priority: critical
release: mvp
screens: [s34, s43, s44, s56]
related: ["F-01 Account", "F-11 Rings"]
created: 2026-10-15
updated: 2026-11-08
tags: [feature, module/discovery, priority/critical, release/mvp]
---

# Badge & QR

**Backend:** Done (main `1c460b0`: the code, reset, scan count and resolve; the domain routes later) · **Priority:** Critical · **Release:** MVP · **Module:** [[M-04 Discovery Module|Discovery]]

**Layers:** [[S-37 Badge & QR Story|Story]] · [[FR-18 Badge & QR Frontend Requirements|Frontend Requirements]] · [[BD-18 Badge & QR Backend Delivery|Backend Delivery]] · [[BI-15 Badge & QR Backend Integration|Backend Integration]] · [[Badge & QR Frontend Delivery|Frontend Delivery]] · [[QB-16 Badge & QR QA Backend|QA Backend]] · [[Badge & QR QA Frontend|QA Frontend]]

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

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-37 Badge & QR Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-007 | Issue and rotate the QR token for a Ring | To do | critical | S7–S12 |
| T-008 | Resolve a scanned QR token | To do | critical | S13–S18 |
| T-009 | Scan counter and share link | To do | high | S19 |
| T-010 | Public browser page for viewers without the app | Needs a decision | high | S20 |

### Log of the merged tasks

- T-007 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-007 · 2026-10-18 · created as the backend half of T-007
- T-007 · 2026-10-18 · created as the frontend half of T-007
- T-008 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-008 · 2026-10-18 · created as the backend half of T-008
- T-008 · 2026-10-18 · created as the frontend half of T-008
- T-009 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-009 · 2026-10-18 · created as the backend half of T-009
- T-009 · 2026-10-18 · created as the frontend half of T-009
- T-010 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-010 · 2026-10-18 · created as the backend half of T-010
- T-010 · 2026-10-18 · created as the frontend half of T-010

## Decisions

- [[ND-10 How Connect addresses the scanned person]] — decided, Connect sends the scanned code or the Pin name, never a user id ([[D-10 Connect sends what the requester already has|D-10]])
- [[ND-11 Get or rotate the badge token]] — decided, the same code all day, a new one past 24 h, and a reset ([[D-11 The badge code stays the same for its day|D-11]])
- [[ND-12 What the badge QR encodes]] — decided, a https://socialpin.me/q/<token> link the app reads without the domain ([[D-12 The badge QR is a socialpin.me link|D-12]])
- [[D-22 The public page only says the Pin exists]] — the web page shows only the name and Pin name
- [[D-28 Scan someone in is not in the MVP]] — a scan never adds anyone to a Ring
- [[D-35 A join code can be shown as a QR]] — a Ring's join QR, never a badge, offers a Ring to join

## Related

- [[F-12 View As & Pin Views]]
- [[F-14 Connections]]
- [[F-23 Events During]]
- [[F-33 Devices & NFC]]
- [[F-28 Subscription (Free vs Pro)]]
- [[F-08 Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
