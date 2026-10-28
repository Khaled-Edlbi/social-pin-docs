---
type: backend-delivery
code: devices
scope: feature
feature: devices
module: platform
status: in-progress
screens: [s75]
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/in-progress, module/platform, layer/backend]
---

# 🟡 Devices & NFC · Backend Delivery

**Feature:** [[F-33 Devices & NFC]] · **Status:** In progress · **Integration guide:** [[Devices & NFC Backend Integration]] · **Requirements:** [[FR-33 Devices & NFC Frontend Requirements]] · **QA:** [[Devices & NFC QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

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

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[F-33 Devices & NFC]] when the vault moved to layers
