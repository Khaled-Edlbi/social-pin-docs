---
id: S-01
type: story
module: identity
feature: account
status: verified
scope: feature
screens: [s68]
approvedBy: "Omar Fostok"
approvedAt: 2026-11-09
owner: "Omar Fostok"
related: ["ND-20 Whether an unverified new address may sign in", "D-20 The changed address still signs in, the words are corrected", "B-01 An unverified changed email still signs in", "FD-04 Account Frontend Delivery", "QF-04 Account QA Frontend", "F-07 Profiles & Pin Name"]
created: 2026-10-18
updated: 2026-11-09
tags: [story, story/verified, module/identity, layer/business]
---

# Account · User Story

> ⚠ Affected by [[BD-01 Account Backend Delivery]] (2026-11-09): S4 says deleting an account makes every Ring, projection and session go; DELETE /users/me (backend local main ebdca36) ends the sessions and, since D-25, the connections, requests and blocks, but leaves the account's Rings, memberships and badge codes untouched: a badge code issued before the deletion still opens the card (GET /views/qr/:token) until it expires. Written down as a gap in BD-01 and BD-18; nothing decided

**Feature:** [[F-01 Account]] · **Status:** Fulfilled 2026-11-09 (approved 2026-11-09 by Omar Fostok; QB-04 and QF-04 passing, nothing pending) · **Frontend Requirements:** [[FR-01 Account Frontend Requirements]] · **Backend Integration:** [[BI-01 Account Backend Integration]]

A signed-in person opens Me to check which email and phone their account is on, to change one of them, and, rarely, to leave. The account is the thin layer under the profile: it holds the sign-in identity, the verified state of each destination and the Free / Pro type. Everything that describes the person (name, photo, bio) lives on the profile and on Ring projections, so the Me header is composed from three sources, never fetched from one.

## Persona

A personal user on the Me tab ([[Wireframe Brief#Account, subscription & settings|§12]]), between networking moments: they changed phone number, they want to know whether their email is verified, or they decided to delete the account. They are the owner of this data; nobody else ever reaches it, because there is no `GET /users/:id`.

## Stories

### S1 · Open Me / Account ([[Screen Index#s68|s68]])

**As a** signed-in user **I want** to see who I am signed in as **so that** I can trust that the account, the Pin name and the Pro state shown are mine.

Acceptance criteria:
- [ ] The header shows the default profile's full name and `!pinName`, the Ring count, and the profile photo, or initials when there is none, composed from `GET /profiles` (`data[0]`) and the Rings; `GET /users/me` carries no name and no photo.
- [ ] Email and phone each show a verified / unverified chip derived from `emailVerifiedAt` / `phoneVerifiedAt` (`null` = unverified).
- [ ] The plan card reads "Pro plan" when `accountType` is `PRO`, with no Upgrade and no separate badge in the header; on Free it reads "Free plan" with "Upgrade", which leads to s70, which has no backend yet.
- [ ] The header card opens the profile editor ([[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S3]], [[F-07 Profiles & Pin Name]]).
- [ ] There is no "Manage account" row. What the brief puts under it is elsewhere: email, phone and delete on Me itself (S2–S4), personal info in the profile editor, no password (sign-in is by code, [[ND-01 Passwordless login]]).
- [ ] The screen refetches on app resume and after any 401 recovery.
- [ ] No code or token is ever rendered or logged; there is no password to show.

### S2 · Change the email ([[Screen Index#s68|s68]])

**As a** user **I want** to replace my sign-in email **so that** codes and the login go to the address I use.

Acceptance criteria:
- [ ] Edit in a sheet from the Email row (one field, Save and Cancel) with client-side email validation; the value is sent lower-cased and trimmed to `PATCH /users/me { email }`.
- [ ] On 200 the row re-renders from the response with the email marked **unverified**. The copy says only that confirming a new address is not in the app yet; it does **not** promise a verification email, and it does **not** say the address must be verified before it can be used to sign in — the new address signs in straight away, unverified, and that is the behaviour the product accepts for now ([[D-20 The changed address still signs in, the words are corrected]]).
- [ ] 409 reads "This email is already on another account", inline, field kept focused.
- [ ] Cancel restores the previous value without a request.

### S3 · Change the phone ([[Screen Index#s68|s68]])

**As a** user **I want** to replace my phone number **so that** SMS codes reach the device I carry.

Acceptance criteria:
- [ ] The same sheet from the Phone row: country-code selector plus number, formatted to E.164 before `PATCH /users/me { phone }`.
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
- [ ] Tapping a row opens a picker for that one value (a date picker for the birthdate, a sheet of the API's values for gender and marital status) and saves it with `PATCH /profiles/:id`; under each row's title, which of your Rings show it, or "Hidden from all Rings". The full profile is edited in the profile editor ([[S-14 Profiles & Pin Name Story]]); the per-Ring opt-in lives on each Ring's "what it shows" screen ([[S-17 Ring Projection Story]]).

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

- `GET /users/me` reads through a narrow select of the `users` row; there is no password column since 2026-10-15 ([[ND-01 Passwordless login]]).
- `PATCH /users/me` normalises (email lower-cased and trimmed, phone to E.164), checks uniqueness (409 `E_USER_02` / `E_USER_03`) and clears the matching `…VerifiedAt`, so the destination reads as unverified. The cleared flag is **not** a gate: `POST /auth/login` and `POST /auth/login/verify` accept the changed address at once ([[B-01 An unverified changed email still signs in]], accepted by [[D-20 The changed address still signs in, the words are corrected]]).
- `DELETE /users/me` is a soft delete: the row stays (meetings, orders and audit logs reference it), the unique email and phone are released, every refresh token is revoked.
- There is no `GET /users/:id` and no user search. Another person is reachable only through a Ring projection.

## Open questions

- No decision blocks this feature. Re-verifying a changed email or phone has no dedicated route; it is recorded in [[F-01 Account#Gaps]] and is not a part of this story yet.
- Whether an unverified new address may sign in was answered **for now**, not for good: [[D-20 The changed address still signs in, the words are corrected]] leaves the gate out while `POST /auth/login` still returns `devCode`, and asks for the question again when [[S-78 Code Delivery Story|Code Delivery · S8]] lands. S2's and S3's copy changes back with it.
- The connection count and linked accounts on s68 belong to [[F-03 Counts]] and [[F-38 Linked Accounts (OAuth)]].
