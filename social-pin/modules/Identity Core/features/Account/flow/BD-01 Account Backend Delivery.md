---
id: BD-01
type: backend-delivery
module: identity
feature: account
status: done
scope: feature
screens: [s68]
depends: []
affects: ["BI-01 Account Backend Integration", "QB-04 Account QA Backend"]
related: ["B-02 Deleted account answers 401, not the documented 404 E_USER_01", "B-01 An unverified changed email still signs in", "D-20 The changed address still signs in, the words are corrected", "S-78 Code Delivery Story", "DELETE /users/me", "BD-14 Connections Backend Delivery", "D-25 A deleted account's connections, requests and blocks end silently", "PATCH /users/me", "POST /auth/login", "POST /auth/login/verify", "E_USER_01", "E_AUTH_03"]
created: 2026-10-15
updated: 2026-11-09
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Account · Backend Delivery

**Feature:** [[F-01 Account]] · **Status:** Done · **Integration guide:** [[BI-01 Account Backend Integration]] · **Requirements:** [[FR-01 Account Frontend Requirements]] · **QA:** [[QB-04 Account QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me`

**Tables / models:** `User`

**Code:** `src/modules/user/`

## How it works

`UserService` owns the `users` row; `AuthService` only orchestrates flows over it. `GET /users/me` reads through `selectUserAccount`, a narrow select rather than the full `users` row (there is no password column any more; sign-in is passwordless). `PATCH /users/me` normalises the value (email lower-cased and trimmed, phone stripped to E.164), checks uniqueness (409 `E_USER_02` / `E_USER_03`) and **clears the matching `…VerifiedAt`**. The cleared flag only marks the destination unverified: it does **not** stop it signing in. `POST /auth/login` issues a code for the new address and `POST /auth/login/verify` returns a session, by decision ([[D-20 The changed address still signs in, the words are corrected]]); a sign-in gate on the verified flags is deferred to [[S-78 Code Delivery Story|Code Delivery · S8]], since while `devCode` is returned it would buy nothing. `DELETE /users/me` is a soft delete that keeps the row (meetings, orders and audit logs reference it) but releases the unique email and phone so the person can sign up again, and revokes every refresh token. In the same transaction it ends the account's connections (`REMOVED`), closes its pending connection requests both ways (`CANCELLED`) and removes every block it made or received, silently (`ConnectionService.endEverythingFor`, [[D-25 A deleted account's connections, requests and blocks end silently|D-25]], [[BD-14 Connections Backend Delivery]]); a failure there rolls the whole deletion back. It does not end the account's Rings, its memberships in other people's Rings or its badge codes. An access token issued before the delete is refused by `JwtStrategy` (it re-reads the user on every request) with **404 `E_USER_01`** on every route, kept apart from the 401 `E_AUTH_03` a suspended account gets ([[B-02 Deleted account answers 401, not the documented 404 E_USER_01]]). There is deliberately no `GET /users/:id` and no search: another person is reachable only through a Ring projection.

### What exists

- `PATCH /users/me` changes email or phone and clears the matching verified flag; the new destination still signs in (D-20).
- `DELETE /users/me` soft-deletes and revokes every session; the account's live access tokens then answer 404 `E_USER_01` (code: `src/modules/auth/strategies/jwt.strategy.ts`). Since 2026-11-09 (backend local `main` `ebdca36`, not pushed yet) it also ends the account's connections, requests and blocks (D-25; `UserModule` imports `ConnectionModule`).
- There is deliberately no `GET /users/:id` and no user search: another person is reachable only through a Ring projection.

### Gaps

- The Me screen (s68) shows linked accounts, missing: [[F-38 Linked Accounts (OAuth)]]. (The connection count is `GET /connections/count`, [[F-03 Counts]], [[BD-14 Connections Backend Delivery]].)
- **A deleted account's Rings stay as they were.** [[S-01 Account Story|Account · S4]] (and the delete sheet, B-26) says every Ring, projection and session goes; `softDelete` ends the sessions and, since D-25, the connections, but leaves the Rings, their memberships and their badge codes untouched. The routes that check the owner's account refuse them (a Pin name, Connect and Block); `GET /views/qr/:token` does not, so a badge code issued before the deletion still opens the card until it expires ([[BD-18 Badge & QR Backend Delivery]] *Gaps*).
- A changed email or phone comes back unverified and there is **no dedicated re-verify route**: `request-code` + `verify-code` with purpose `SIGN_UP` would mark it verified, but that path is not designed for it and not tested. Worth a task when the Me screen is built.

## Log

- 2026-11-09 · backend local `main` `ebdca36` (merge of `D-25/connection/account-deletion`, `768b3b4`; not pushed yet) · [[D-25 A deleted account's connections, requests and blocks end silently|D-25]]: `UserService.softDelete` calls `ConnectionService.endEverythingFor` in its own transaction (connections `REMOVED`, pending requests both ways `CANCELLED`, blocks either way deleted); Rings, memberships and badge codes untouched. Three new specs; 1026/1026 tests. The connection side is [[BD-14 Connections Backend Delivery]]'s. New gap: the account's Rings and badge codes stay; flagged [[S-01 Account Story]], whose S4 says every Ring goes.
- 2026-10-18 · split out of [[F-01 Account]] when the vault moved to layers
- 2026-10-26 · backend `B-02/auth/deleted-account-404` · [[B-02 Deleted account answers 401, not the documented 404 E_USER_01]]: `JwtStrategy` answers a DELETED account (or a missing row) 404 `E_USER_01` instead of 401 `E_AUTH_03`; SUSPENDED and PENDING keep the 401. The contract row was right, the build moved to it. Flagged: the bug card, [[QB-04 Account QA Backend]], [[QF-04 Account QA Frontend]], [[FD-04 Account Frontend Delivery]].
- 2026-10-26 · vault `tickets/qa/M-01-identity/F-01-account/B-02-fixed` · [[B-01 An unverified changed email still signs in]]: the "proven again before it can sign in" sentence corrected to what the build does — a changed destination is unverified and still signs in ([[D-20 The changed address still signs in, the words are corrected]]). Both B-01 flags cleared. No code changed.
