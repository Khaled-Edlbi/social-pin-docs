---
type: backend-delivery
code: account
scope: feature
feature: account
module: identity
status: done
screens: [s68]
created: 2026-10-15
updated: 2026-10-26
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Account · Backend Delivery

**Feature:** [[Account]] · **Status:** Done · **Integration guide:** [[Account Backend Integration]] · **Requirements:** [[Account Frontend Requirements]] · **QA:** [[Account QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me`

**Tables / models:** `User`

**Code:** `src/modules/user/`

## How it works

`UserService` owns the `users` row; `AuthService` only orchestrates flows over it. `GET /users/me` reads through `selectUserAccount`, a narrow select rather than the full `users` row (there is no password column any more; sign-in is passwordless). `PATCH /users/me` normalises the value (email lower-cased and trimmed, phone stripped to E.164), checks uniqueness (409 `E_USER_02` / `E_USER_03`) and **clears the matching `…VerifiedAt`**, so a changed address must be proven again before it can be used to sign in or receive a reset code. `DELETE /users/me` is a soft delete that keeps the row (meetings, orders and audit logs reference it) but releases the unique email and phone so the person can sign up again, and revokes every refresh token. There is deliberately no `GET /users/:id` and no search: another person is reachable only through a Ring projection.

### What exists

- `PATCH /users/me` changes email or phone and clears the matching verified flag.
- `DELETE /users/me` soft-deletes and revokes every session.
- There is deliberately no `GET /users/:id` and no user search: another person is reachable only through a Ring projection.

### Gaps

- The Me screen (s68) shows connection counts and linked accounts, both missing. See [[Counts]] and [[Linked Accounts (OAuth)]].
- A changed email or phone comes back unverified and there is **no dedicated re-verify route**: `request-code` + `verify-code` with purpose `SIGN_UP` would mark it verified, but that path is not designed for it and not tested. Worth a task when the Me screen is built.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Account]] when the vault moved to layers
