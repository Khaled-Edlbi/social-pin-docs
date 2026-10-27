---
type: story
code: devices
scope: feature
feature: devices
module: platform
status: approved
screens: [s75]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-27
tags: [story, story/approved, module/platform, layer/business]
---

# Devices & NFC · User Story

**Feature:** [[Devices & NFC]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Devices & NFC Frontend Requirements]] · **API Integration:** not yet (backend not built)

A user opens Me → My devices to see where they are signed in, throw out a phone they no longer own, and pair the NFC card they hand out at events so a tap resolves to the active Ring the same way a QR scan does. Today only "sign out everywhere" exists; devices are not registered and NFC cards cannot be paired.

## Persona

A personal user managing their account from s68, often after losing or replacing a phone. Secondarily an exhibitor who carries an NFC card instead of raising the badge.

## Stories

### S1 · See my devices ([[Screen Index#s75|s75]])

**As a** signed-in user **I want** a list of the devices holding a session, with this one highlighted **so that** I know where my account is open.

Acceptance criteria:
- [ ] Each row shows the device name, platform (iOS / Android / Web) and last seen time; the current device is marked and listed first.
- [ ] Revoked devices do not appear.
- [ ] Empty state is impossible while signed in: the current device is always present once registration on login ships.

### S2 · Register this device on login

**As a** user signing in on a new phone **I want** the device recorded automatically **so that** it shows up on s75 without a setup step.

Acceptance criteria:
- [ ] On every successful login and registration the client sends a stable, client-generated device id, a name and the platform; the backend upserts one `UserDevice` per (user, device id).
- [ ] The push token is sent when granted and updated when it rotates; it is nullable until then.

### S3 · Remove one device ([[Screen Index#s75|s75]])

**As a** user **I want** to remove a device I no longer have **so that** its session stops working now, not in seven days.

Acceptance criteria:
- [ ] Removing a device revokes that device's refresh tokens; its next refresh fails and it is signed out.
- [ ] Removing the current device is either blocked or treated as logout; the list refreshes after the call.

### S4 · Sign out all other devices ([[Screen Index#s75|s75]])

**As a** user who suspects a leak **I want** one action that ends every other session **so that** I stay signed in here and nowhere else.

Acceptance criteria:
- [ ] Today `POST /auth/logout-everywhere` revokes every session including this one; the client must clear its store and return to login, and the copy must say so.
- [ ] Once per-device revocation ships, the button keeps the current device and the user stays on s68 as the design draws.

### S5 · Pair an NFC card ([[Screen Index#s75|s75]])

**As a** user with a physical card **I want** to pair it to a Ring **so that** a tap resolves to that Ring's perspective like a scanned QR.

Acceptance criteria:
- [ ] Pairing creates an `NfcToken` bound to one Ring with an optional label and expiry; the raw token is written to the card and only its hash stored.
- [ ] The card can be revoked from s75; a revoked or expired card resolves to the same 404 as a bad QR, never to an explanation.

### S6 · Register devices on login; list and remove

*From T-014 (status then: To do), merged 2026-10-27.*

`UserDevice` row on login (name, platform, push token). `GET /users/me/devices`, `DELETE …/devices/:id` revoking that device's refresh tokens.

Screens: [[Screen Index#s75|s75]] My devices


### S7 · Pair and revoke an NFC card

*From T-015 (status then: To do), merged 2026-10-27.*

`NfcToken` mirrors `RingQrToken`; resolve path shared with Badge & QR · S13–S18.

Screens: [[Screen Index#s75|s75]] My devices

## States and motion the design asks for

- State: current device highlighted; list with remove per row; confirm sheet for remove and for sign-out-others ([[Wireframe Brief#Contacts & Devices|§6.4]], [[Wireframe Brief#Account, subscription & settings|§12]]).
- Motion: none specific. s75 is reached from s68 and "Sign out all other devices" returns to s68 ([[Navigation Map]]).

## Rules the backend already enforces

- Refresh tokens are rotating and single-use; `logout-everywhere` revokes all of a user's rows, caller included; it is the only session-wide revocation now that there is no password ([[Auth Model]]).
- `UserDevice` exists with `deviceId` (client-generated, unique per user), `name`, `platform`, `pushToken`, `lastSeenAt`, `revokedAt`; nothing writes it yet.
- `NfcToken` mirrors `RingQrToken`: hashed, bound to a Ring, `status` ACTIVE / REVOKED / EXPIRED, revocable. Resolving a tap must go through [[Ring Access Engine]]; a blocked viewer or a dead card gets the same 404 as a missing one.

## Open questions

- No decision note names this feature. [[Devices & NFC Story|Devices & NFC · S7]] waits on [[Badge & QR Story|Badge & QR · S7–S12]] so the two tokens share one resolve path.
