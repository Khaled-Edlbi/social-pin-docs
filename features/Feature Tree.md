---
type: map
updated: 2026-10-15
tags: [map]
---

# Feature Tree

Every feature of Social Pin, grouped by domain, with its backend status. Status comes from the comparison of the backend against the 78 prototype screens, the click-through map and the wireframe brief ([[Status Report 2026-10-15]]).

| | Meaning | Features |
|---|---|---|
| ✅ | Done | 9 |
| 🟡 | Partial (needs more) | 10 |
| ❌ | TODO | 18 |
| ⬜ | Frontend only | 1 |

Open tasks: **63** (32 to do, 17 need a decision, 14 blocked). Open decisions: **6**. See [[Task Board]] and [[Backlog]].

## The tree

```
Social Pin backend
├── Identity Core  (✅9 🟡3 ❌1)
│   ├── ✅ Auth & Sign-up  [P0]
│   │   └── ✅ T-056 Decide: passwordless login (decided: code-only)
│   ├── ✅ Account  [P0]
│   ├── ✅ Profiles & Pin Name  [P0]
│   │   ├── ❓ T-057 Decide: base profile work fields
│   │   └── ❓ T-061 Decide: Pin name rules
│   ├── ✅ Rings  [P0]
│   │   └── ❓ T-059 Decide: Ring settings
│   ├── ✅ Ring Members  [P0]
│   ├── ✅ Ring Projection  [P0]
│   │   ├── ❓ T-058 Decide: field library vs per-Ring copies
│   │   └── ❓ T-060 Decide: copy or inherit
│   ├── ✅ View As & Pin Views  [P0]
│   ├── ✅ Files Upload  [P1]
│   ├── ✅ Ring Access Engine  [P0]
│   ├── 🟡 Counts  [P1]
│   │   ├── ⬜ T-004 Member count per Ring on list and detail
│   │   └── ⛔ T-005 Connection count on Me and Home
│   ├── 🟡 Photo Library  [P1]
│   │   ├── ⬜ T-012 List my files (photo library)
│   │   └── ⬜ T-013 Usage count per file across Rings
│   ├── 🟡 Widgets  [P1]
│   │   ├── ⬜ T-017 Extend WIDGET_TYPE to the design's list
│   │   └── ❓ T-018 Widget CRUD on the projection
│   └── ❌ Onboarding Imports  [P1]
│       ├── ⛔ T-020 LinkedIn import → review → base profile
│       └── ❓ T-020b Business card scan and portfolio URL import
├── Connections  (❌1)
│   └── ❌ Connections  [P0]
│       ├── ⬜ T-021 Connect request: send, inbox, cancel
│       ├── ⬜ T-022 Accept into a Ring (sets grantedRingId)
│       ├── ⬜ T-023 Connection detail and contacts list
│       ├── ⬜ T-024 Block and unblock
│       └── ❓ T-025 Introduce a connection to another
├── Shared Rings & Companies  (🟡1 ❌2)
│   ├── 🟡 Delegated Admins  [P1]
│   │   └── ⬜ T-006 Delegated admin endpoints
│   ├── ❌ Ring Invitations & Join  [P1]
│   │   ├── ❓ T-026 Ring invitations: invite, review, decline
│   │   ├── ⛔ T-027 Join a Ring with a code or verified work email
│   │   └── ❓ T-028 "What you contribute" to a shared Ring
│   └── ❌ Companies  [P1]
│       └── ⬜ T-029 My companies and company detail
├── Discovery  (🟡1 ❌2)
│   ├── 🟡 Badge & QR  [P0]
│   │   ├── ⬜ T-007 Issue and rotate the QR token for a Ring
│   │   ├── ⬜ T-008 Resolve a scanned QR token
│   │   ├── ⬜ T-009 Scan counter and share link
│   │   └── ❓ T-010 Public browser page for viewers without the app
│   ├── ❌ Discover Hub & Search  [P1]
│   │   ├── ⬜ T-030 Discover search by !pinname and recent searches
│   │   └── ❓ T-031 Import contacts
│   └── ❌ PinCast & Nearby  [P1]
│       └── ⬜ T-032 PinCast: setup, start, stop, results
├── Events  (🟡1 ❌4)
│   ├── 🟡 Event Ring Auto-creation  [P0]
│   │   └── ⛔ T-011 Create the Event Ring on registration
│   ├── ❌ Events Before  [P0]
│   │   ├── ⬜ T-033 Events list, detail, schedule
│   │   ├── ⬜ T-034 Tickets, packages, levels, sold-out
│   │   └── ⛔ T-035 Registration transaction with order and payment
│   ├── ❌ Events During  [P0]
│   │   ├── ⛔ T-036 Event mode: exhibitors list and detail
│   │   ├── ⛔ T-037 Event pass with a 60 s rotating code
│   │   ├── ⛔ T-038 Floor map and booths
│   │   ├── ❓ T-039 Catalogue: products and talks (new table)
│   │   └── ⛔ T-040 Lounges and upgrades
│   ├── ❌ Exhibitor  [P1]
│   │   ├── ⬜ T-048 Business account setup → business Ring
│   │   └── ⛔ T-048b Booth analytics and leads CSV export
│   └── ❌ Post-Event  [P1]
│       └── ⛔ T-050 Post-event summary and follow-ups
├── Meetings  (❌1)
│   └── ❌ Meetings  [P0]
│       ├── ⬜ T-041 Availability slots CRUD
│       ├── ⬜ T-042 Meeting request, accept with slots, decline with reason
│       ├── ⬜ T-043 Temporary meeting Ring per meeting
│       └── ⬜ T-044 My meetings, calendar, detail, reschedule, cancel
├── Commerce  (❌2)
│   ├── ❌ Payments & Orders  [P1]
│   │   └── ❓ T-047 Orders, payments and the provider webhook
│   └── ❌ Subscription (Free vs Pro)  [P1]
│       └── ⬜ T-049 Subscription endpoints and a single Pro gate
└── Platform & Cross-cutting  (🟡4 ❌5 ⬜1)
    ├── 🟡 Code Delivery  [P0]
    │   ├── ⬜ T-001 Wire an email provider for one-time codes
    │   ├── ⬜ T-002 Wire an SMS provider for one-time codes
    │   └── ⛔ T-003 Remove devCode once delivery works
    ├── 🟡 Devices & NFC  [P1]
    │   ├── ⬜ T-014 Register devices on login; list and remove
    │   └── ⬜ T-015 Pair and revoke an NFC card
    ├── 🟡 Interests  [P1]
    │   └── ⬜ T-016 Interests vocabulary and my interests
    ├── 🟡 Linked Accounts (OAuth)  [P1]
    │   └── ❓ T-019 LinkedIn OAuth: link, unlink, login
    ├── ❌ Notifications  [P1]
    │   ├── ⬜ T-045 NotificationService.emit and the inbox
    │   └── ⛔ T-046 Push delivery and preferences
    ├── ❌ Gemma AI  [P2]
    │   ├── ❓ T-051 Gemma assistant sheet and suggestions
    │   └── ⛔ T-052 Smart Match
    ├── ❌ Audit Log  [P0]
    │   └── ⬜ T-053 Audit log writes
    ├── ❌ Cleanup Jobs  [P1]
    │   └── ⬜ T-054 Cleanup jobs
    ├── ❌ E2E Test Run  [P0]
    │   └── ⬜ T-055 Run the e2e suite in CI against PostGIS
    └── ⬜ App Shell & Onboarding Narrative  [P2]
```

## Identity Core

Account, profile, Rings, what each Ring shows, and the access engine. The part of the product the backend is built around.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[Auth & Sign-up]] | ✅ Done | P0 | s01, s02, s06, s08, s68 | 1 |
| [[Account]] | ✅ Done | P0 | s68 | 0 |
| [[Profiles & Pin Name]] | ✅ Done | P0 | s06 | 2 |
| [[Rings]] | ✅ Done | P0 | s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62 | 1 |
| [[Ring Members]] | ✅ Done | P0 | s15, s47 | 0 |
| [[Ring Projection]] | ✅ Done | P0 | s14, s20, s23, s24, s25, s29, s36 | 2 |
| [[View As & Pin Views]] | ✅ Done | P0 | s10, s31, s44 | 0 |
| [[Files Upload]] | ✅ Done | P1 | s14, s20, s36 | 0 |
| [[Ring Access Engine]] | ✅ Done | P0 | — | 0 |
| [[Counts]] | 🟡 Partial (needs more) | P1 | s11, s12, s14, s16, s17, s68 | 2 |
| [[Photo Library]] | 🟡 Partial (needs more) | P1 | s29, s30 | 2 |
| [[Widgets]] | 🟡 Partial (needs more) | P1 | s36, s37 | 2 |
| [[Onboarding Imports]] | ❌ TODO | P1 | s03, s03a, s03b, s04, s05 | 2 |

## Connections

Connect requests after a scan, accept into a Ring, blocks, contacts. The next most important feature after Rings.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[Connections]] | ❌ TODO | P0 | s44, s45, s46, s47, s62 | 5 |

## Shared Rings & Companies

Rings owned by someone else that you belong to: invitations, joining by code or work email, companies, delegated admins.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[Delegated Admins]] | 🟡 Partial (needs more) | P1 | s26, s27 | 1 |
| [[Ring Invitations & Join]] | ❌ TODO | P1 | s17, s74 | 3 |
| [[Companies]] | ❌ TODO | P1 | s72, s73 | 1 |

## Discovery

Badge / QR, Discover hub, PinCast proximity broadcast, nearby by Ring, contact import.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[Badge & QR]] | 🟡 Partial (needs more) | P0 | s34, s43, s44, s56 | 4 |
| [[Discover Hub & Search]] | ❌ TODO | P1 | s38 | 2 |
| [[PinCast & Nearby]] | ❌ TODO | P1 | s11, s39, s40, s41, s42 | 1 |

## Events

Before the event (discover, tickets, payment, Event Ring), during (event mode, exhibitors, pass, map, catalogue), exhibitor tools, post-event.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[Event Ring Auto-creation]] | 🟡 Partial (needs more) | P0 | s52 | 1 |
| [[Events Before]] | ❌ TODO | P0 | s48, s49, s50, s51, s52 | 3 |
| [[Events During]] | ❌ TODO | P0 | s53, s54, s55, s56, s57, s58 | 5 |
| [[Exhibitor]] | ❌ TODO | P1 | s63, s64, s65 | 2 |
| [[Post-Event]] | ❌ TODO | P1 | s62 | 1 |

## Meetings

Availability slots, slot-based requests, temporary meeting Rings, accept / decline, calendar.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[Meetings]] | ❌ TODO | P0 | s59, s61, s64, s66, s67 | 4 |

## Commerce

Orders, payments, payment webhook, Free vs Pro subscription and the Pro gates.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[Payments & Orders]] | ❌ TODO | P1 | s50, s51 | 1 |
| [[Subscription (Free vs Pro)]] | ❌ TODO | P1 | s34, s70 | 1 |

## Platform & Cross-cutting

Notifications, Gemma AI, devices, interests, widgets, linked accounts, code delivery, audit log, cleanup jobs, e2e tests.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[Code Delivery]] | 🟡 Partial (needs more) | P0 | s02 | 3 |
| [[Devices & NFC]] | 🟡 Partial (needs more) | P1 | s75 | 2 |
| [[Interests]] | 🟡 Partial (needs more) | P1 | s07, s71 | 1 |
| [[Linked Accounts (OAuth)]] | 🟡 Partial (needs more) | P1 | s01, s04, s68 | 1 |
| [[Notifications]] | ❌ TODO | P1 | s69 | 2 |
| [[Gemma AI]] | ❌ TODO | P2 | s13, s60 | 2 |
| [[Audit Log]] | ❌ TODO | P0 | — | 1 |
| [[Cleanup Jobs]] | ❌ TODO | P1 | — | 1 |
| [[E2E Test Run]] | ❌ TODO | P0 | — | 1 |
| [[App Shell & Onboarding Narrative]] | ⬜ Frontend only | P2 | s00a, s00b, s00c, s00d | 0 |

## Live view (Dataview plugin)

```dataview
TABLE status, priority, domain, screens FROM #feature SORT domain ASC, status ASC
```

See also: [[Feature Graph]] (Mermaid) · [[Feature Map.canvas|Feature Map]] (Obsidian canvas) · [[Screen Index]] · [[Decisions]]
