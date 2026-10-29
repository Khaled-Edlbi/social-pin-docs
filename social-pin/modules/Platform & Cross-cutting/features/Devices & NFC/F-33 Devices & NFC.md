---
id: F-33
type: feature
module: platform
feature: devices
priority: high
release: v1
screens: [s75]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/platform, priority/high, release/v1]
---

# Devices & NFC

**Backend:** Partial (needs more) · **Priority:** High · **Release:** v1 · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-82 Devices & NFC Story|Story]] · [[FR-33 Devices & NFC Frontend Requirements|Frontend Requirements]] · [[BD-33 Devices & NFC Backend Delivery|Backend Delivery]] · [[Devices & NFC Backend Integration|Backend Integration]] · [[Devices & NFC Frontend Delivery|Frontend Delivery]] · [[Devices & NFC QA Backend|QA Backend]] · [[Devices & NFC QA Frontend|QA Frontend]]

Linked-device management (s75): list devices, remove one, sign out all others, pair an NFC card.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s75|s75]] | My devices |  |

Wireframe brief sections: [[Wireframe Brief#Contacts & Devices|§6.4 Contacts & Devices]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-82 Devices & NFC Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-014 | Register devices on login; list and remove | To do | high | S6 |
| T-015 | Pair and revoke an NFC card | To do | medium | S7 |

### Log of the merged tasks

- T-014 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-014 · 2026-10-18 · created as the backend half of T-014
- T-014 · 2026-10-18 · created as the frontend half of T-014
- T-015 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-015 · 2026-10-18 · created as the backend half of T-015
- T-015 · 2026-10-18 · created as the frontend half of T-015

## Related

- [[F-02 Auth & Sign-up]]
- [[F-18 Badge & QR]]
- [[F-39 Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
