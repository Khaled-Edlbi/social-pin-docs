---
type: backend-integration
code: account
scope: feature
feature: account
module: identity
status: current
screens: [s68]
created: 2026-10-15
updated: 2026-10-27
depends: []
affects: ["Account Frontend Delivery", "Account QA Frontend"]
related: ["B-02 Deleted account answers 401, not the documented 404 E_USER_01", "B-01 An unverified changed email still signs in", "D-20 The changed address still signs in, the words are corrected", "PATCH /users/me", "POST /auth/login", "POST /auth/login/verify", "GET /users/me", "DELETE /users/me", E_USER_01, E_AUTH_03, "T-063 Put the ErrorCode on the error body"]
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
2. **`PATCH /users/me`** with `{ email? }` and / or `{ phone? }`. Changing a value clears its `…VerifiedAt`, so render the new address as *unverified* straight away. **Unverified does not mean locked out:** the new address signs in at once through `POST /auth/login` and `POST /auth/login/verify`, and no 403 is coming for it ([[D-20 The changed address still signs in, the words are corrected]]). 409 `E_USER_02` (email in use) or `E_USER_03` (phone in use).
3. **`DELETE /users/me`** → 200, no body. The account is soft-deleted, its email and phone released, and every session revoked. Clear the token store and return to Welcome. Any access token the account still holds elsewhere now answers **404 `E_USER_01`** on every route until it expires, and its refresh token 401 `E_AUTH_04`.

## Shapes that matter

- The account carries **no name and no photo**. The person's name lives on their profile (`GET /profiles`, default first; see [[Profiles & Pin Name Backend Integration]]) and the photo on a Ring projection ([[Ring Projection Backend Integration]]). Compose the Me header from those.
- `accountType` drives the Pro badge and the Pro gates in the design (s70). There is no endpoint to change it yet.
- `role` is the platform role, not a ring or event role. Do not derive permissions from it for ring screens; the ring endpoints answer with 403 themselves.

## State to keep on the client

Cache the account per signed-in user; refetch after a `PATCH`, on app resume, and after any 401 recovery. `status` can change server-side: a 401 `E_AUTH_03` on any call means suspended, a 404 `E_USER_01` on any call means deleted (on another device); see [[Auth & Sign-up Backend Integration]]. Both are a sign-out, neither is refreshed.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 409 | `E_USER_02` | email already on another account | inline error |
| 409 | `E_USER_03` | phone already on another account | inline error |
| 404 | `E_USER_01` | the account no longer exists (deleted elsewhere); any authenticated route, from the auth guard | sign-out state, "Your account has been deleted." |
| 401 | `E_AUTH_03` | the account is suspended; any authenticated route | sign-out state, no refresh |

Until [[T-063 Put the ErrorCode on the error body]] puts the code on the wire, branch on the status: a 404 on `GET /users/me` is the deleted account.

## Rules the UI must respect

- There is no `GET /users/:id` and no user search, by design. Another person is reachable only through a Ring projection (`/views/…`). Do not build a screen that expects a user object for someone else.
- After an email or phone change, the new address is unverified **and still signs in**. The backend has **no dedicated re-verify route yet**; until there is one, show the unverified state, do not promise a verification email, and do not tell the user the address must be confirmed before they can sign in with it.

## Not available yet

- Connection count ("218 connections") on s68: [[Counts Story|Counts · S11]].
- Linked accounts (LinkedIn): [[Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]].
- Devices list and NFC: [[T-014 Register devices on login; list and remove]], [[T-015 Pair and revoke an NFC card]].
- Subscription management: [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]].
- Re-verifying a changed email or phone: no route; see [[Account#Gaps]].

## Checklist

- [ ] Me header composed from `GET /users/me` + the default profile + the default Ring's projection.
- [ ] Verified / unverified state rendered from `emailVerifiedAt` / `phoneVerifiedAt`.
- [ ] Pro badge from `accountType`.
- [ ] Delete account: confirmation, then clear the store on 200.
