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
depends: []
affects: ["Account Backend Integration", "Account QA Backend"]
related: ["B-02 Deleted account answers 401, not the documented 404 E_USER_01", "DELETE /users/me", E_USER_01, E_AUTH_03]
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Account · Backend Delivery

> ⚠ Affected by [[B-01 An unverified changed email still signs in]] (2026-10-26): answered by [[D-20 The changed address still signs in, the words are corrected]], option 2 — the build is right and this note is wrong. No gate ships. Correct "a changed address must be proven again before it can be used to sign in or receive a reset code" to say that the cleared flag only marks the destination unverified and does **not** stop it signing in, then clear the QA flag below. `/backend`.

> ⚠ Affected by [[Account QA Backend]] (2026-10-26): "a changed address must be proven again before it can be used to sign in" is not what the build does. An email changed by `PATCH /users/me` comes back with `emailVerifiedAt: null` and still signs in immediately — `POST /auth/login` issues a code for it and `login/verify` returns a session. Gate the sign-in on the verified flags, or correct this note and [[Account Story]] S2.

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

`UserService` owns the `users` row; `AuthService` only orchestrates flows over it. `GET /users/me` reads through `selectUserAccount`, a narrow select rather than the full `users` row (there is no password column any more; sign-in is passwordless). `PATCH /users/me` normalises the value (email lower-cased and trimmed, phone stripped to E.164), checks uniqueness (409 `E_USER_02` / `E_USER_03`) and **clears the matching `…VerifiedAt`**, so a changed address must be proven again before it can be used to sign in or receive a reset code. `DELETE /users/me` is a soft delete that keeps the row (meetings, orders and audit logs reference it) but releases the unique email and phone so the person can sign up again, and revokes every refresh token. An access token issued before the delete is refused by `JwtStrategy` (it re-reads the user on every request) with **404 `E_USER_01`** on every route, kept apart from the 401 `E_AUTH_03` a suspended account gets ([[B-02 Deleted account answers 401, not the documented 404 E_USER_01]]). There is deliberately no `GET /users/:id` and no search: another person is reachable only through a Ring projection.

### What exists

- `PATCH /users/me` changes email or phone and clears the matching verified flag.
- `DELETE /users/me` soft-deletes and revokes every session; the account's live access tokens then answer 404 `E_USER_01` (code: `src/modules/auth/strategies/jwt.strategy.ts`).
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
- 2026-10-26 · backend `B-02/auth/deleted-account-404` · [[B-02 Deleted account answers 401, not the documented 404 E_USER_01]]: `JwtStrategy` answers a DELETED account (or a missing row) 404 `E_USER_01` instead of 401 `E_AUTH_03`; SUSPENDED and PENDING keep the 401. The contract row was right, the build moved to it. Flagged: the bug card, [[Account QA Backend]], [[Account QA Frontend]], [[Account Frontend Delivery]].
