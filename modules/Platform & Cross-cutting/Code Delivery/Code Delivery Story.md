---
type: story
code: code-delivery
scope: feature
feature: code-delivery
module: platform
status: draft
screens: [s02]
created: 2026-10-18
updated: 2026-10-18
tags: [story, story/draft, module/platform, layer/business]
---

# Code Delivery · User Story

**Feature:** [[Code Delivery]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Code Delivery Frontend Requirements]] · **API Integration:** not yet (backend not built)

A new user has typed their email or phone on s01 and is now on s02 waiting for a six-digit code. Everything after the code works end to end; the code itself is only written to the server log, and on a development server also returned in the response as `devCode`. This feature is the delivery leg: the email, the SMS, the resend timer and the "code expired" state, all of which depend on a provider that is not wired.

## Persona

A first-time personal user signing up, or a returning user signing in (every sign-in is a code since 2026-10-15). Also the developer running a dev build who needs to get past s02 without reading the server log.

## Stories

### S1 · Receive the code by email ([[Screen Index#s02|s02]])

**As a** user who chose "Continue with Email" **I want** the six-digit code in my inbox within seconds **so that** I can finish signing up on the same screen.

Acceptance criteria:
- [ ] After `POST /auth/sign-up` with `{ email }` the screen shows the masked destination and "code sent".
- [ ] The email arrives with the code and the ten-minute validity; no link is required, the code is enough.
- [ ] The code in the email matches what `POST /auth/verify-code` accepts.

### S2 · Receive the code by SMS ([[Screen Index#s02|s02]])

**As a** user who chose "Continue with Phone" **I want** the same code by SMS **so that** phone sign-up is as fast as email.

Acceptance criteria:
- [ ] After `POST /auth/sign-up` with `{ phone }` (E.164) the SMS arrives with the six digits.
- [ ] The screen is identical to the email case except the masked destination and the wording "text".

### S3 · Resend with a timer ([[Screen Index#s02|s02]])

**As a** user whose code has not arrived **I want** a resend button that counts down before it is enabled **so that** I neither spam myself nor wait without feedback.

Acceptance criteria:
- [ ] The countdown runs from the `expiresAt` in the challenge response, not from a client clock alone.
- [ ] Resend calls `POST /auth/request-code`; the response is a new challenge with a new `expiresAt`, and the timer restarts.
- [ ] Resend never says whether the destination is registered; the copy is "if an account exists, a code is on its way" for sign-in and resend.

### S4 · Wrong or expired code ([[Screen Index#s02|s02]])

**As a** user who mistyped or waited too long **I want** one clear message and a way forward **so that** I do not get stuck.

Acceptance criteria:
- [ ] A wrong code and an expired code show the same "invalid or expired" message with the resend button.
- [ ] After the sixth wrong guess the code is burned; the screen says a new code is required and offers resend only.
- [ ] "Use a different email" returns to s01 and clears the typed digits.

### S5 · Dev build fills the code in ([[Screen Index#s02|s02]])

**As a** tester on any server **I want** the code pre-filled from `devCode` **so that** I can test the flow without the log.

Acceptance criteria:
- [ ] If `devCode` is present in the response, the six boxes are filled and the field stays editable.
- [ ] If `devCode` is absent, nothing changes; the build never requires it and never stores it.
- [ ] The build never requires `devCode`; when [[T-003 Remove devCode once delivery works]] removes it, nothing but the pre-fill changes.

## States and motion the design asks for

- State: invalid email / number (before sending), code sent, wrong or expired code, resend timer running, resend enabled ([[Wireframe Brief#The three login/signup methods|§3.2]]).
- Motion: the three auth choices converge into one verification flow; the ring progress anchor persists from s01 into s02 and fills one segment on success.

## Rules the backend already enforces

- The code is six digits, bcrypt-hashed, valid ten minutes; `sign-up` reuses a `PENDING` user and re-issues the code without error ([[Auth & Sign-up]]).
- Five wrong guesses burn the code (429 `E_AUTH_06`); wrong and expired both answer 400 `E_AUTH_05`.
- `request-code` returns a plausible challenge for unknown destinations and issues a code only for a real account.
- `devCode` is returned on every issued code, in every environment, until delivery is wired (product decision 2026-10-15); it is absent only when no code was issued ([[Auth Model]]).
- Delivery is one line, `AuthService.issueCode`, with a `TODO(delivery)`; nothing is sent today.

## Open questions

- [[D-01 Passwordless login]] — if login becomes code-based, every login costs a delivery and the resend timer appears on the login path too; the decision needs delivery first either way.
