---
type: backend-integration
code: account
scope: feature
feature: account
module: identity
status: current
screens: [s68]
updated: 2026-10-18
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Account · Backend Integration

**Feature:** [[Account]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]]

What the client builds: the Me / Account screen's account section: who is signed in, email and phone with their verified state, Free vs Pro, delete the account.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s68\|s68]] Me / Account | opens the screen | `GET /users/me` |
| s68 | edits email or phone | `PATCH /users/me` |
| s68 | deletes the account | `DELETE /users/me` |

## Flow

1. **`GET /users/me`** → `AccountEntity`:
   `id`, `email`, `phone`, `status` (`PENDING` / `ACTIVE` / `SUSPENDED` / `DELETED`), `accountType` (`FREE` / `PRO`), `role` (platform role), `emailVerifiedAt`, `phoneVerifiedAt`, `lastLoginAt`, `createdAt`, `updatedAt`. There is no password on the account at all: sign-in is passwordless ([[Auth & Sign-up Backend Integration]]).
2. **`PATCH /users/me`** with `{ email? }` and / or `{ phone? }`. Changing a value clears its `…VerifiedAt`, so render the new address as *unverified* straight away. 409 `E_USER_02` (email in use) or `E_USER_03` (phone in use).
3. **`DELETE /users/me`** → 200, no body. The account is soft-deleted, its email and phone released, and every session revoked. Clear the token store and return to Welcome.

## Shapes that matter

- The account carries **no name and no photo**. The person's name lives on their profile (`GET /profiles`, default first; see [[Profiles & Pin Name Backend Integration]]) and the photo on a Ring projection ([[Ring Projection Backend Integration]]). Compose the Me header from those.
- `accountType` drives the Pro badge and the Pro gates in the design (s70). There is no endpoint to change it yet.
- `role` is the platform role, not a ring or event role. Do not derive permissions from it for ring screens; the ring endpoints answer with 403 themselves.

## State to keep on the client

Cache the account per signed-in user; refetch after a `PATCH`, on app resume, and after any 401 recovery. `status` can change server-side (suspension): a 401 `E_AUTH_03` on any call is the signal, see [[Auth & Sign-up Backend Integration]].

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 409 | `E_USER_02` | email already on another account | inline error |
| 409 | `E_USER_03` | phone already on another account | inline error |
| 404 | `E_USER_01` | the account no longer exists (deleted elsewhere) | sign-out state |

## Rules the UI must respect

- There is no `GET /users/:id` and no user search, by design. Another person is reachable only through a Ring projection (`/views/…`). Do not build a screen that expects a user object for someone else.
- After an email or phone change, the new address is unverified. The backend has **no dedicated re-verify route yet**; until there is one, show the unverified state and do not promise a verification email.

## Not available yet

- Connection count ("218 connections") on s68: [[T-005 Connection count on Me and Home]].
- Linked accounts (LinkedIn): [[T-019 LinkedIn OAuth link, unlink, login]].
- Devices list and NFC: [[T-014 Register devices on login; list and remove]], [[T-015 Pair and revoke an NFC card]].
- Subscription management: [[T-049 Subscription endpoints and a single Pro gate]].
- Re-verifying a changed email or phone: no route; see [[Account#Gaps]].

## Checklist

- [ ] Me header composed from `GET /users/me` + the default profile + the default Ring's projection.
- [ ] Verified / unverified state rendered from `emailVerifiedAt` / `phoneVerifiedAt`.
- [ ] Pro badge from `accountType`.
- [ ] Delete account: confirmation, then clear the store on 200.
