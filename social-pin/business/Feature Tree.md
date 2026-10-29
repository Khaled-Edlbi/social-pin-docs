---
id: P-02
type: map
layer: business
created: 2026-10-15
updated: 2026-10-29
tags: [map]
---

# Feature Tree

Every feature of Social Pin, grouped by domain, with its backend status. Status comes from the comparison of the backend against the 78 prototype screens, the click-through map and the wireframe brief ([[Status Report 2026-10-15]]).

| | Meaning | Features |
|---|---|---|
| ✅ | Done | 9 |
| 🟡 | Partial (needs more) | 11 |
| ❌ | TODO | 18 |
| ⬜ | Frontend only | 1 |

Open tasks: **64** (35 to do, 15 need a decision, 14 blocked). Open decisions: **5** (ND-01 decided 2026-10-15). See the [[Docs Tree]] page. Frontend notes for every ✅ feature: [[Frontend Contract]]. The same tree, clickable, with every feature's Docs / Story / Requirements / Frontend notes, tasks and decisions: the [[Docs Tree]] page.

## The tree

```
Social Pin backend
├── Identity Core  (✅9 🟡3 ❌1)
│   ├── ✅ Auth & Sign-up  [Critical]
│   ├── ✅ Account  [Critical]
│   ├── ✅ Profiles & Pin Name  [Critical]
│   ├── ✅ Rings  [Critical]
│   ├── ✅ Ring Members  [Critical]
│   ├── ✅ Ring Projection  [Critical]
│   ├── ✅ View As & Pin Views  [Critical]
│   ├── ✅ Files Upload  [High]
│   ├── ✅ Ring Access Engine  [Critical]
│   ├── 🟡 Counts  [High]
│   ├── 🟡 Photo Library  [High]
│   ├── 🟡 Widgets  [High]
│   └── ❌ Onboarding Imports  [Medium]
├── Connections  (❌1)
│   └── ❌ Connections  [Critical]
├── Shared Rings & Companies  (🟡1 ❌2)
│   ├── 🟡 Delegated Admins  [High]
│   ├── ❌ Ring Invitations & Join  [High]
│   └── ❌ Companies  [High]
├── Discovery  (🟡1 ❌2)
│   ├── 🟡 Badge & QR  [Critical]
│   ├── ❌ Discover Hub & Search  [High]
│   └── ❌ PinCast & Nearby  [High]
├── Events  (🟡1 ❌4)
│   ├── 🟡 Event Ring Auto-creation  [Critical]
│   ├── ❌ Events Before  [Critical]
│   ├── ❌ Events During  [Critical]
│   ├── ❌ Exhibitor  [High]
│   └── ❌ Post-Event  [High]
├── Meetings  (❌1)
│   └── ❌ Meetings  [Critical]
├── Commerce  (❌2)
│   ├── ❌ Payments & Orders  [High]
│   └── ❌ Subscription (Free vs Pro)  [High]
└── Platform & Cross-cutting  (🟡5 ❌5 ⬜1)
    ├── 🟡 Error Contract  [Critical]
    ├── 🟡 Code Delivery  [Critical]
    ├── 🟡 Devices & NFC  [High]
    ├── 🟡 Interests  [High]
    ├── 🟡 Linked Accounts (OAuth)  [High]
    ├── ❌ Notifications  [High]
    ├── ❌ Gemma AI  [Medium]
    ├── ❌ Audit Log  [Critical]
    ├── ❌ Cleanup Jobs  [High]
    ├── ❌ E2E Test Run  [Critical]
    └── ⬜ App Shell & Onboarding Narrative  [Medium]
```

## Identity Core

Account, profile, Rings, what each Ring shows, and the access engine. The part of the product the backend is built around.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[F-02 Auth & Sign-up]] | ✅ Done | Critical | s01, s02, s06, s08, s68 | 0 |
| [[F-01 Account]] | ✅ Done | Critical | s68 | 0 |
| [[F-07 Profiles & Pin Name]] | ✅ Done | Critical | s06 | 0 |
| [[F-11 Rings]] | ✅ Done | Critical | s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62 | 0 |
| [[F-09 Ring Members]] | ✅ Done | Critical | s15, s47 | 0 |
| [[F-10 Ring Projection]] | ✅ Done | Critical | s14, s20, s23, s24, s25, s29, s36 | 0 |
| [[F-12 View As & Pin Views]] | ✅ Done | Critical | s10, s31, s44 | 0 |
| [[F-04 Files Upload]] | ✅ Done | High | s14, s20, s36 | 0 |
| [[F-08 Ring Access Engine]] | ✅ Done | Critical | — | 0 |
| [[F-03 Counts]] | 🟡 Partial (needs more) | High | s11, s12, s14, s16, s17, s68 | 0 |
| [[F-06 Photo Library]] | 🟡 Partial (needs more) | High | s29, s30 | 0 |
| [[F-13 Widgets]] | 🟡 Partial (needs more) | High | s36, s37 | 0 |
| [[F-05 Onboarding Imports]] | ❌ TODO | Medium | s03, s03a, s03b, s04, s05 | 0 |

## Connections

Connect requests after a scan, accept into a Ring, blocks, contacts. The next most important feature after Rings.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[F-14 Connections]] | ❌ TODO | Critical | s44, s45, s46, s47, s62 | 0 |

## Shared Rings & Companies

Rings owned by someone else that you belong to: invitations, joining by code or work email, companies, delegated admins.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[F-16 Delegated Admins]] | 🟡 Partial (needs more) | High | s26, s27 | 0 |
| [[F-17 Ring Invitations & Join]] | ❌ TODO | High | s17, s74 | 0 |
| [[F-15 Companies]] | ❌ TODO | High | s72, s73 | 0 |

## Discovery

Badge / QR, Discover hub, PinCast proximity broadcast, nearby by Ring, contact import.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[F-18 Badge & QR]] | 🟡 Partial (needs more) | Critical | s34, s43, s44, s56 | 0 |
| [[F-19 Discover Hub & Search]] | ❌ TODO | High | s38 | 0 |
| [[F-20 PinCast & Nearby]] | ❌ TODO | High | s11, s39, s40, s41, s42 | 0 |

## Events

Before the event (discover, tickets, payment, Event Ring), during (event mode, exhibitors, pass, map, catalogue), exhibitor tools, post-event.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[F-21 Event Ring Auto-creation]] | 🟡 Partial (needs more) | Critical | s52 | 0 |
| [[F-22 Events Before]] | ❌ TODO | Critical | s48, s49, s50, s51, s52 | 0 |
| [[F-23 Events During]] | ❌ TODO | Critical | s53, s54, s55, s56, s57, s58 | 0 |
| [[F-24 Exhibitor]] | ❌ TODO | High | s63, s64, s65 | 0 |
| [[F-25 Post-Event]] | ❌ TODO | High | s62 | 0 |

## Meetings

Availability slots, slot-based requests, temporary meeting Rings, accept / decline, calendar.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[F-26 Meetings]] | ❌ TODO | Critical | s59, s61, s64, s66, s67 | 0 |

## Commerce

Orders, payments, payment webhook, Free vs Pro subscription and the Pro gates.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[F-27 Payments & Orders]] | ❌ TODO | High | s50, s51 | 0 |
| [[F-28 Subscription (Free vs Pro)]] | ❌ TODO | High | s34, s70 | 0 |

## Platform & Cross-cutting

The error contract, notifications, Gemma AI, devices, interests, widgets, linked accounts, code delivery, audit log, cleanup jobs, e2e tests.

| Feature | Status | Priority | Screens | Open tasks |
|---|---|---|---|---|
| [[F-35 Error Contract]] | 🟡 Partial (needs more) | Critical | — | 0 |
| [[F-32 Code Delivery]] | 🟡 Partial (needs more) | Critical | s02 | 0 |
| [[F-33 Devices & NFC]] | 🟡 Partial (needs more) | High | s75 | 0 |
| [[F-37 Interests]] | 🟡 Partial (needs more) | High | s07, s71 | 0 |
| [[F-38 Linked Accounts (OAuth)]] | 🟡 Partial (needs more) | High | s01, s04, s68 | 0 |
| [[F-39 Notifications]] | ❌ TODO | High | s69 | 0 |
| [[F-36 Gemma AI]] | ❌ TODO | Medium | s13, s60 | 0 |
| [[F-30 Audit Log]] | ❌ TODO | Critical | — | 0 |
| [[F-31 Cleanup Jobs]] | ❌ TODO | High | — | 0 |
| [[F-34 E2E Test Run]] | ❌ TODO | Critical | — | 0 |
| [[F-29 App Shell & Onboarding Narrative]] | ⬜ Frontend only | Medium | s00a, s00b, s00c, s00d | 0 |

## Live view (Dataview plugin)

```dataview
TABLE status, priority, domain, screens FROM #feature SORT domain ASC, status ASC
```

See also: [[Feature Graph]] (Mermaid) · [[Feature Map.canvas|Feature Map]] (Obsidian canvas) · [[Screen Index]] · [[Decisions]]
