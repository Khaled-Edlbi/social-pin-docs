---
type: feature
id: devices
name: "Devices & NFC"
priority: P1
module: platform
screens: [s75]
updated: 2026-10-18
tags: [feature, module/platform, priority/P1]
---

# Devices & NFC

**Backend:** Partial (needs more) · **Priority:** P1 · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Devices & NFC Story|Story]] · [[Devices & NFC Frontend Requirements|Frontend Requirements]] · [[Devices & NFC Backend Delivery|Backend Delivery]] · [[Devices & NFC Backend Integration|Backend Integration]] · [[Devices & NFC Frontend Delivery|Frontend Delivery]] · [[Devices & NFC QA Backend|QA Backend]] · [[Devices & NFC QA Frontend|QA Frontend]]

Linked-device management (s75): list devices, remove one, sign out all others, pair an NFC card.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s75|s75]] | My devices |  |

Wireframe brief sections: [[Wireframe Brief#Contacts & Devices|§6.4 Contacts & Devices]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-014 Register devices on login; list and remove]] | ⬜ To do | P1 | M |
| [[T-015 Pair and revoke an NFC card]] | ⬜ To do | P2 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "devices" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]
- [[Badge & QR]]
- [[Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
