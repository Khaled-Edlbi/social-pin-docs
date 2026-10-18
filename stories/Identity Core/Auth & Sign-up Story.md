---
type: story
id: auth
feature: auth
status: draft
domain: identity
screens: [s01, s02, s06, s08, s68]
updated: 2026-10-18
tags: [story, story/draft, domain/identity]
---

# Auth & Sign-up · User Story

**Feature:** [[Auth & Sign-up]] · **Status:** Draft (awaiting product sign-off) · **Requirements:** [[Auth & Sign-up Requirements]] · **API Integration:** [[Auth & Sign-up Frontend]]

A new person arrives with an email or a phone number and wants to be inside the app with a Pin name and a first Ring in under two minutes. A returning person wants to sign in and stay signed in without thinking about tokens. Onboarding is one continuous narrative ([[Wireframe Brief#Onboarding flow|§3.1]]): a ring-shaped progress indicator fills segment by segment, and the three auth choices converge into one verification flow.

## Persona

A personal user at the door: first launch (sign-up), a new device (login), or a forgotten password. They have not seen a Ring yet; the flow must teach Rings by doing, and must never reveal whether an address is already registered.

## Stories

### S1 · Welcome, choose a destination ([[Screen Index#s01|s01]])

**As a** new user **I want** to continue with my email or my phone **so that** a one-time code reaches me and I can start.

Acceptance criteria:
- [ ] Three equal primary choices (Email, Phone, LinkedIn); LinkedIn is shown but disabled with "coming soon" until OAuth exists.
- [ ] Email field with client validation; phone with country-code selector, sent as E.164. Exactly one destination goes to `POST /auth/sign-up`.
- [ ] On 201 the app moves to s02 with the `destination`, `channel` and `expiresAt` from the response; the ring progress fills one segment.
- [ ] 409 `E_AUTH_01` ("already registered") switches the screen to the returning-user form with the destination pre-filled; it is the one case the product accepts as an existence signal, because the person typed their own address.
- [ ] The screen copy does not promise "no password" until [[D-01 Passwordless login]] is decided.

### S2 · Verify the code ([[Screen Index#s02|s02]])

**As a** new user **I want** to type the 6-digit code and get through **so that** the app knows the address is mine.

Acceptance criteria:
- [ ] Six-cell input that auto-advances and submits `POST /auth/verify-code { destination, code, purpose: "SIGN_UP" }` on the sixth digit.
- [ ] A resend timer counts down from `expiresAt`; "Resend" is enabled when it reaches zero and calls `POST /auth/request-code` with the same destination.
- [ ] A wrong or expired code (400 `E_AUTH_05`) clears the cells and reads "Invalid or expired code", with resend offered.
- [ ] After the sixth wrong guess (429 `E_AUTH_06`) the input locks and the only action is "Request a new code".
- [ ] On a dev build `devCode` from the sign-up response pre-fills the cells; a production build never depends on it.
- [ ] "Use a different email" returns to s01 and discards the onboarding state.
- [ ] The onboarding token stays in memory only, for 15 minutes; it is never stored.

### S3 · Claim your Pin and set a password ([[Screen Index#s06|s06]])

**As a** new user **I want** to pick my `!handle` and a password **so that** my account is complete and others can find me by Pin name.

Acceptance criteria:
- [ ] The Pin field shows `!` as decoration and validates 3 to 30 characters of letters, digits, `.` and `_` before any request.
- [ ] A debounced `GET /profiles/pin-name/:pinName/availability` shows "available" / "taken" live; the answer never names who holds a taken handle.
- [ ] Password field: 10 to 72 characters, with a strength hint; optional full name up to 120 characters.
- [ ] Submit calls `POST /auth/complete-registration { onboardingToken, password, pinName, fullName? }`; on 201 the session pair is stored atomically and the ring progress completes the identity segment.
- [ ] 409 `E_PROFILE_02` (taken between check and submit) keeps the user on s06 with the field focused; 400 `E_AUTH_05` (token expired) returns to s02; 409 `E_AUTH_08` goes to login.

### S4 · First Ring ([[Screen Index#s08|s08]])

**As a** new user **I want** to see that my first Ring already exists **so that** I understand the app is usable before I customise anything.

Acceptance criteria:
- [ ] After `complete-registration` the default Ring, the profile and its projection exist; s08 reads them with `GET /rings` and shows the default Ring by name.
- [ ] "Create my first Ring" leads to s09 ([[Rings Story]]); "Take me to the app" lands on Home with the default Ring active and the badge ready.
- [ ] The ring progress indicator closes with a completion animation when the user lands on Home.

### S5 · Sign in on a new device ([[Screen Index#s01|s01]])

**As a** returning user **I want** to sign in with my email or phone and password **so that** I get back to my Rings.

Acceptance criteria:
- [ ] One identifier field (email or E.164 phone, told apart by the `@`) and a password field; `POST /auth/login`.
- [ ] 401 `E_AUTH_02` shows one message, "Email, phone or password is incorrect", whatever the cause.
- [ ] 403 `E_AUTH_03` shows "This account is not active".
- [ ] On 201 the session pair is stored and the app goes to Home.

### S6 · Stay signed in (journey, no prototype screen)

**As a** returning user **I want** the app to refresh my session silently **so that** I never see a login prompt mid-task.

Acceptance criteria:
- [ ] A 401 on any call triggers one `POST /auth/refresh` with the refresh token as bearer; concurrent 401s wait on the same promise and retry once.
- [ ] The new pair replaces the old atomically; the old refresh token is discarded at once.
- [ ] 401 `E_AUTH_04` from `/auth/refresh` clears the store and shows login; 401 `E_AUTH_03` does the same without a refresh attempt.

### S7 · Password and sessions on Me ([[Screen Index#s68|s68]])

**As a** signed-in user **I want** to change my password, sign out, or sign out everywhere **so that** I control where my account is open.

Acceptance criteria:
- [ ] Change password asks for the current and the new one; 400 `E_USER_04` reads "Current password is incorrect"; on 201 the store is cleared and login is shown, because every session was revoked.
- [ ] Sign out calls `POST /auth/logout` with the **refresh** token as bearer, then clears the store even if the call fails.
- [ ] Sign out everywhere calls `POST /auth/logout-everywhere` with the access token and then clears the store.

### S8 · Forgot the password (journey, no prototype screen)

**As a** returning user **I want** to reset my password with a code **so that** I can get back in without support.

Acceptance criteria:
- [ ] Destination → `POST /auth/request-code { purpose: "PASSWORD_RESET" }` → the same s02 pattern with `purpose: "PASSWORD_RESET"` → `POST /auth/reset-password { onboardingToken, password }`.
- [ ] The confirmation copy reads "If an account exists for this address, a code is on its way"; the 201 is identical for unknown destinations.
- [ ] On 201 the user is sent to login; all previous sessions are gone.

## States and motion the design asks for

- State ([[Wireframe Brief#The three login/signup methods|§3.2]]): invalid email, invalid number, code sent, wrong / expired code, resend timer, OAuth cancelled or failed (LinkedIn, not available).
- Motion: the ring-shaped progress indicator is the shared, morphing anchor between steps; steps slide horizontally; the three auth choices converge into one verification flow.
- Motion: landing on Home after s08 triggers the first "Ring re-compose" so the badge and profile visibly build from the new Ring. Reduced motion gets a cross-fade.

## Rules the backend already enforces

- Sign-up is three calls in order; `complete-registration` creates the password, the profile, the default Ring and its projection in **one transaction**. The app can go to Home right after it.
- Codes are 6 digits, bcrypt-hashed, 10 minutes long, burned after 5 wrong guesses; `request-code` answers a plausible challenge whether or not the account exists.
- Three token scopes (`access`, `refresh`, `onboarding`), checked on every route; an onboarding token is never a session. `JwtStrategy` re-reads the user on every request, so a suspended account is out immediately.
- Refresh tokens are single-use and rotated in the same transaction; a replay is 401 `E_AUTH_04`.
- Login runs a bcrypt compare even for a missing account and returns one failure body; `request-code` does not reveal existence.
- No delivery provider is wired: the code is logged server-side and returned as `devCode` only in development.

## Open questions

- [[D-01 Passwordless login]] — s01 promises "no password to remember"; the backend requires a password after the code. Blocks the s01 copy and whether S3 keeps its password field.
