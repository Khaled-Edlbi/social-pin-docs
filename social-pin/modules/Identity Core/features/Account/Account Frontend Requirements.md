---
type: frontend-requirements
code: account
scope: feature
feature: account
module: identity
status: approved
approvedBy: "omar"
approvedAt: 2026-10-26
screens: [s68]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/approved, module/identity, layer/frontend]
---

# Account · Frontend Requirements

**Feature:** [[Account]] · **Status:** Draft · **Story:** [[Account Story]] · **Backend Integration:** [[Account Backend Integration]]

What the client needs from the backend to build the account section of Me, and whether each need is met today. Call shapes, the token store and the error body are in [[Account Backend Integration]]; this note lists the needs per screen and what still waits on a task.

## Per screen

### [[Screen Index#s68|s68]] Me / Account

- Needs, fields shown:
  - header: full name, `!pinName`, photo;
  - account rows: `email` with verified chip, `phone` with verified chip, `accountType` (Free / Pro badge), `lastLoginAt` ("last signed in");
  - `status` is read but never shown; it drives the sign-out state only.
- Needs, actions: edit email, edit phone, delete account, open the profile editor, open Photo library (s30), Interests (s71), My companies (s72), My devices (s75), Business account (s63), Notifications (s69), Upgrade (s70).
- Needs, states: loading skeleton for the header; verified / unverified per destination; Pro badge; saving state on each inline edit; confirmation sheet before delete; "coming soon" rows for linked accounts, devices and subscription.
- Source today: `GET /users/me` for the account; `GET /profiles` (`data[0]`) for name and Pin name; `GET /rings` (the row with `isDefault`) then `GET /rings/:ringId/projection` for `avatarFileId`. Edits: `PATCH /users/me`; delete: `DELETE /users/me`.
- Not on this screen yet: connection count, linked accounts, devices, subscription management, the photo bytes.

### Sign-out state (no prototype screen)

- Needs: a terminal screen for a suspended or deleted account, reachable from any call.
- Source today: 401 `E_AUTH_03` on any authenticated call; 404 `E_USER_01` on `GET /users/me`.

## Field map

| Shown on s68 | Source | Notes |
|---|---|---|
| Full name | `GET /profiles` → `data[0].fullName` | default profile first |
| `!pinName` | `GET /profiles` → `data[0].pinName` | render the `!` as decoration |
| Photo | `GET /rings/:ringId/projection` → `avatarFileId` | initials until [[Files Upload Story|Files Upload · showing files]] |
| Email + chip | `GET /users/me` → `email`, `emailVerifiedAt` | `null` timestamp = unverified |
| Phone + chip | `GET /users/me` → `phone`, `phoneVerifiedAt` | E.164 on the wire |
| Free / Pro | `GET /users/me` → `accountType` | `FREE` / `PRO` |
| Last signed in | `GET /users/me` → `lastLoginAt` | relative time |
| Connections | — | [[Counts Story|Counts · S11]] |

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Read the account | `GET /users/me` | ✅ | — |
| Change email or phone | `PATCH /users/me` | ✅ | — |
| Delete the account | `DELETE /users/me` | ✅ | — |
| Full name and Pin name for the header | `GET /profiles` | ✅ | — (listed under [[Profiles & Pin Name]]) |
| Default Ring and its photo id | `GET /rings`, `GET /rings/:ringId/projection` | ✅ | — (listed under [[Rings]] and [[Ring Projection]]) |
| Photo bytes for the header | — | ❌ | [[Files Upload Story|Files Upload · showing files]] |
| Connection count ("218 connections") | — | ❌ | [[Counts Story|Counts · S11]] |
| Linked accounts (LinkedIn) | — | ❌ | [[Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]] |
| Devices list | — | ❌ | [[T-014 Register devices on login; list and remove]] |
| NFC card | — | ❌ | [[T-015 Pair and revoke an NFC card]] |
| Subscription / Upgrade | — | ❌ | [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]] |
| Re-verify a changed email or phone | — | ❌ | no task yet; gap recorded in [[Account#Gaps]] |

## Behaviour expectations

- Refetch / realtime: refetch `GET /users/me` after every `PATCH`, on app resume and after a 401 recovery. There is no push; a `status` change is discovered by the next call (401 `E_AUTH_03`).
- Caching keys: `account:<userId>`; `profiles:<userId>` and `projection:<ringId>` for the header. Clear all of them on logout, logout-everywhere, delete and on any `E_AUTH_03`.
- Pagination / ordering: none on `GET /users/me`. `GET /profiles` returns the default profile first; only `data[0]` is needed here.
- Write semantics: `PATCH` sends only the changed key, normalised on the client the same way the server does (email lower-cased and trimmed, phone in E.164). The response is the full `AccountEntity` and replaces the cached one. Unknown keys are a 400.
- Verified state: never set a destination to verified on the client. The backend clears the timestamp on every change and nothing re-verifies it yet, so the chip stays "unverified" until a re-verify route exists.
- Concurrency: one in-flight `PATCH` at a time per field; a second edit waits for the first response.
- Delete: on 200 clear the token store and every cache, then navigate to Welcome with the navigation stack reset. Do not call `POST /auth/logout` afterwards; the sessions are already revoked.
- Header composition: when `GET /profiles` or the projection fails, still render the account rows; the header degrades to initials.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 409 | `E_USER_02` | "This email is already on another account", inline |
| 409 | `E_USER_03` | "This number is already on another account", inline |
| 404 | `E_USER_01` | sign-out state (account deleted elsewhere) |
| 401 | `E_AUTH_03` | sign-out state (account suspended), no refresh |
| 401 | `E_AUTH_04` | the refresh failed: sign in again |
| 400 | — (validation; `message` is a string array) | inline on the field |

Until [[T-063 Put the ErrorCode on the error body]] ships, the body carries no `ErrorCode`: branch on status and endpoint, keep `message` display-only.

## Blocked by

- Nothing blocks the read / edit / delete part of s68. The ❌ rows wait on the tasks named and ship as placeholders.
- [[Files Upload Story|Files Upload · showing files]] — the header photo renders as initials until it ships.
