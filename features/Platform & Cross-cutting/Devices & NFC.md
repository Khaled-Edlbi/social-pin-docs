---
type: feature
id: devices
name: "Devices & NFC"
status: partial
priority: P1
domain: platform
screens: [s75]
updated: 2026-10-15
tags: [feature, status/partial, domain/platform, priority/P1]
---

# 🟡 Devices & NFC

**Status:** Partial (needs more) · **Priority:** P1 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]]

Linked-device management (s75): list devices, remove one, sign out all others, pair an NFC card.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s75|s75]] | My devices |  |

Wireframe brief sections: [[Wireframe Brief#Contacts & Devices|§6.4 Contacts & Devices]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `POST /auth/logout-everywhere`

**Tables / models:** `UserDevice`, `NfcToken`, `RefreshToken`

**Code:** `src/modules/auth/`

### What exists

- Sessions exist; logout-everywhere revokes all refresh tokens.

### Gaps

- Register a device on login (name, platform, push token).
- List devices with the current one highlighted; remove one (revoke its sessions).
- Pair / revoke an NFC card (`NfcToken` mirrors `RingQrToken`).

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

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
