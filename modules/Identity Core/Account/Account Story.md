---
type: story
code: account
scope: feature
feature: account
module: identity
status: approved
screens: [s68]
approvedBy: "khaled"
approvedAt: 2026-10-25
related: ["D-20 Whether an unverified new address may sign in", "DR-20 The changed address still signs in, the words are corrected", "B-01 An unverified changed email still signs in"]
owner: "khaled"
created: 2026-10-18
updated: 2026-10-26
tags: [story, story/approved, module/identity, layer/business]
---

# Account · User Story

**Feature:** [[Account]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Account Frontend Requirements]] · **Backend Integration:** [[Account Backend Integration]]

A signed-in person opens Me to check which email and phone their account is on, to change one of them, and, rarely, to leave. The account is the thin layer under the profile: it holds the sign-in identity, the verified state of each destination and the Free / Pro type. Everything that describes the person (name, photo, bio) lives on the profile and on Ring projections, so the Me header is composed from three sources, never fetched from one.

## Persona

A personal user on the Me tab ([[Wireframe Brief#Account, subscription & settings|§12]]), between networking moments: they changed phone number, they want to know whether their email is verified, or they decided to delete the account. They are the owner of this data; nobody else ever reaches it, because there is no `GET /users/:id`.

## Stories

### S1 · Open Me / Account ([[Screen Index#s68|s68]])

**As a** signed-in user **I want** to see who I am signed in as **so that** I can trust that the account, the Pin name and the Pro state shown are mine.

Acceptance criteria:
- [ ] The header shows the default profile's full name and `!pinName` and the default Ring's photo, composed from `GET /profiles` (`data[0]`) and the default Ring's projection; `GET /users/me` carries no name and no photo.
- [ ] Email and phone each show a verified / unverified chip derived from `emailVerifiedAt` / `phoneVerifiedAt` (`null` = unverified).
- [ ] A Pro badge appears when `accountType` is `PRO`; "Upgrade" leads to s70, which has no backend yet.
- [ ] The screen refetches on app resume and after any 401 recovery.
- [ ] No code or token is ever rendered or logged; there is no password to show.

### S2 · Change the email ([[Screen Index#s68|s68]])

**As a** user **I want** to replace my sign-in email **so that** codes and the login go to the address I use.

Acceptance criteria:
- [ ] Inline edit with client-side email validation; the value is sent lower-cased and trimmed to `PATCH /users/me { email }`.
- [ ] On 200 the row re-renders from the response with the email marked **unverified**. The copy says only that confirming a new address is not in the app yet; it does **not** promise a verification email, and it does **not** say the address must be verified before it can be used to sign in — the new address signs in straight away, unverified, and that is the behaviour the product accepts for now ([[DR-20 The changed address still signs in, the words are corrected]]).
- [ ] 409 reads "This email is already on another account", inline, field kept focused.
- [ ] Cancel restores the previous value without a request.

### S3 · Change the phone ([[Screen Index#s68|s68]])

**As a** user **I want** to replace my phone number **so that** SMS codes reach the device I carry.

Acceptance criteria:
- [ ] Country-code selector plus number, formatted to E.164 before `PATCH /users/me { phone }`.
- [ ] On 200 the phone shows as unverified, with the same copy as S2.
- [ ] 409 reads "This number is already on another account".
- [ ] Clearing a destination is not offered: the account keeps at least one way to sign in.

### S4 · Delete the account ([[Screen Index#s68|s68]])

**As a** user **I want** to delete my account **so that** my Rings stop resolving and my email and phone are released.

Acceptance criteria:
- [ ] A destructive action behind a confirmation sheet that names the consequence: every Ring, projection and session goes away; the email and phone become free to sign up again.
- [ ] On 200 the token store is cleared and the app returns to Welcome (s01) with no back navigation into the signed-in shell.
- [ ] A later 404 from `GET /users/me` (deleted elsewhere) is treated as a sign-out, not as an error toast.

### S5 · Privacy defaults row ([[Screen Index#s68|s68]])

**As a** user **I want** Me to remind me that birthdate, gender and marital status are shared per Ring **so that** I do not look for a global switch that does not exist.

Acceptance criteria:
- [ ] The row shows whether each sensitive value is set on the profile (from `GET /profiles`), never whether it is "public".
- [ ] Tapping it opens the profile editor ([[Profiles & Pin Name Story]]); the per-Ring opt-in lives on each Ring's "what it shows" screen ([[Ring Projection Story]]).

### S6 · Lose access while signed in (journey, no prototype screen)

**As a** user whose account was suspended **I want** the app to sign me out cleanly **so that** I am not left on screens that fail one by one.

Acceptance criteria:
- [ ] A 401 `E_AUTH_03` on any call is treated as a sign-out state; no refresh is attempted.
- [ ] The sign-out screen says the account is not active and offers a support contact, not a retry loop.

## States and motion the design asks for

- State: verified / unverified per destination; Free / Pro badge; confirmation sheet for delete.
- State: linked accounts, devices and subscription rows (§12) are placeholders until their features ship; render them as "coming soon", never as empty errors.
- Motion: the Me tab arrives through the tab bar's shared horizontal slide; nothing screen-specific. Respect reduced motion.

## Rules the backend already enforces

- `GET /users/me` reads through a narrow select of the `users` row; there is no password column since 2026-10-15 ([[D-01 Passwordless login]]).
- `PATCH /users/me` normalises (email lower-cased and trimmed, phone to E.164), checks uniqueness (409 `E_USER_02` / `E_USER_03`) and clears the matching `…VerifiedAt`, so the destination reads as unverified. The cleared flag is **not** a gate: `POST /auth/login` and `POST /auth/login/verify` accept the changed address at once ([[B-01 An unverified changed email still signs in]], accepted by [[DR-20 The changed address still signs in, the words are corrected]]).
- `DELETE /users/me` is a soft delete: the row stays (meetings, orders and audit logs reference it), the unique email and phone are released, every refresh token is revoked.
- There is no `GET /users/:id` and no user search. Another person is reachable only through a Ring projection.

## Open questions

- No decision blocks this feature. Re-verifying a changed email or phone has no dedicated route; it is recorded in [[Account#Gaps]] and needs a task when the Me screen is built.
- Whether an unverified new address may sign in was answered **for now**, not for good: [[DR-20 The changed address still signs in, the words are corrected]] leaves the gate out while `POST /auth/login` still returns `devCode`, and asks for the question again when [[T-003 Remove devCode once delivery works]] lands. S2's and S3's copy changes back with it.
- The connection count and linked accounts on s68 belong to [[Counts]] and [[Linked Accounts (OAuth)]].
