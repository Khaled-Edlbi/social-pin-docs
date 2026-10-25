---
type: frontend-requirements
code: devices
scope: feature
feature: devices
module: platform
status: draft
screens: [s75]
created: 2026-10-18
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Devices & NFC · Frontend Requirements

**Feature:** [[Devices & NFC]] · **Status:** Draft · **Story:** [[Devices & NFC Story]] · **API Integration:** not yet (backend not built)

What the client needs for My devices: a device list keyed by a client-generated id, a way to revoke one, registration on login, and later NFC pairing. One endpoint exists, and it signs out everything.

## Per screen

### [[Screen Index#s75|s75]] My devices

- Needs: list rows with `name`, `platform` (`IOS` | `ANDROID` | `WEB`), `lastSeenAt`, and a "this device" flag computed by matching the row's `deviceId` to the one the client generated; "Remove" per row; "Sign out all other devices"; "Pair NFC card" and "Revoke card" with the card's `label`, `status` and `expiresAt`.
- Source today: not yet for the list, remove, register and NFC. `POST /auth/logout-everywhere` exists and revokes every session, this one included.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Sign out everywhere (all sessions, caller included) | `POST /auth/logout-everywhere` | ✅ | — |
| Register this device on login (`deviceId`, `name`, `platform`, `pushToken`) | — | ❌ | [[T-014 Register devices on login; list and remove]] |
| List my devices | — | ❌ | [[T-014 Register devices on login; list and remove]] |
| Remove one device, revoking its refresh tokens | — | ❌ | [[T-014 Register devices on login; list and remove]] |
| Sign out all *other* devices, keeping this one | — | ❌ | [[T-014 Register devices on login; list and remove]] (not yet specified; today's route signs out all) |
| Pair an NFC card to a Ring; revoke it | — | ❌ | [[T-015 Pair and revoke an NFC card]] (waits on [[T-007 Issue and rotate the QR token for a Ring]]) |
| Resolve a tapped card to a perspective | — | ❌ | [[T-008 Resolve a scanned QR token]] (shared resolve path) |

## Behaviour expectations

- Device identity: generate one stable `deviceId` per installation, persist it locally, and send it on every login and on `complete-registration` once T-014 defines where. Highlight the row whose `deviceId` matches.
- Refetch / realtime: refetch the list after a remove or a pair; no push or polling for device changes. A device removed from elsewhere finds out on its next `POST /auth/refresh` (401).
- `logout-everywhere` today: clear the token store and go to s01 afterwards. Do not label the button "Sign out all other devices" until a route that keeps the caller exists.
- Push token: send on grant and on rotation; `pushToken` is nullable, so a device without push is still listed. This also unblocks [[T-046 Push delivery and preferences]].
- Caching keys: `devices:{userId}`; invalidate on remove, pair, revoke and logout-everywhere.
- Pagination / ordering: not defined by the task; a user holds few devices, so the client should assume a plain list, current device first, then `lastSeenAt` descending.
- NFC: the raw token is written to the card once at pairing and never shown again; the list shows `label`, `status`, `expiresAt` only.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 401 | `E_AUTH_04` | refresh refused after this device was removed: sign in again |
| 401 | `E_AUTH_03` | account suspended on any call: sign-out state |
| 404 | not defined yet | remove or revoke on an id that is gone: refetch the list |

No device or NFC codes exist yet; T-014 and T-015 will add them to `error-code.enum.ts`. `ErrorCode` is not on the wire until [[T-063 Put the ErrorCode on the error body]] ships.

## Blocked by

- No decision. [[T-014 Register devices on login; list and remove]] is To do; [[T-015 Pair and revoke an NFC card]] waits on [[T-007 Issue and rotate the QR token for a Ring]].
