---
type: story
code: google-auth
scope: feature
feature: google-auth
module: identity
status: draft
screens: [s01, s68]
depends: []
affects: []
related: ["Auth & Sign-up", "Linked Accounts (OAuth)", "Account", "D-01 Passwordless login"]
pending: []
approvedBy: ""
approvedAt: ""
updated: 2026-10-21
tags: [story, story/draft, module/identity, layer/business]
---

# Google Auth · User Story

**Feature:** [[Google Auth]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Google Auth Frontend Requirements]] · **Backend Integration:** [[Google Auth Backend Integration]] · **Verified by:** [[Google Auth QA Backend]], [[Google Auth QA Frontend]]

Someone who wants into Social Pin with one tap on the Google account already on their phone, and later wants that account to stay a way in, or to stop being one. Nothing here is available yet: no endpoint, no task; the vault's passwordless flow and the `SocialIdentity` table are the ground it builds on. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

## Persona

A **new user** on Welcome ([[Screen Index#s01|s01]]) who would rather not type an email and wait for a code; a **returning user** on a new phone who remembers signing up with Google; and an **existing user** on Me ([[Screen Index#s68|s68]]) who signed up with email and wants Google as a second way in, or had it and wants it gone. All three are personal users; none of this is seen by a viewer, a Ring member or an organizer.

## Stories

### S1 · Sign up with Google ([[Screen Index#s01|s01]])

**As a** new user **I want** *Continue with Google* on Welcome **so that** I get in without typing an email or waiting for a code.

Acceptance criteria:
- [ ] Welcome offers *Continue with Google* beside email, phone and LinkedIn; the hand-off goes to Google and comes back to the app. Not available yet: no endpoint exists; the task that brings it will name the callback route.
- [ ] A Google account the vault has never seen creates one Social Pin account with a `SocialIdentity` keyed by Google's user id, never by the email, and lands on Claim your Pin ([[Screen Index#s06|s06]]), the same step a one-time code sign-up reaches after `POST /auth/verify-code`.
- [ ] The rest of onboarding is unchanged: Pin name, then First Ring ([[Screen Index#s08|s08]]), created by `POST /auth/complete-registration` as today.
- [ ] Cancelling or failing at Google returns to Welcome with the three other choices intact and no account created.

### S2 · Sign in with Google ([[Screen Index#s01|s01]])

**As a** returning user **I want** the same tap to sign me into my existing account **so that** I never make a second one by mistake.

Acceptance criteria:
- [ ] A Google id already linked to an account signs that account in and lands on Home, with the same tokens as `POST /auth/login/verify` issues.
- [ ] A Google account whose email matches an account that has never linked Google does **not** sign in silently and does not create a second account: it asks the user to verify that email with a one-time code first, then links. (Open question below: whether that link is offered or required.)
- [ ] An account that is suspended or never finished registration answers like the code path does (`E_AUTH_03`): the user is offered to sign up again, and the two causes stay indistinguishable.

### S3 · Add Google to my account ([[Screen Index#s68|s68]])

**As an** existing user **I want** to link Google from Me **so that** I can sign in with it next time.

Acceptance criteria:
- [ ] Linked accounts on Me shows a Google row with *Link*; linking runs the same hand-off and stores the `SocialIdentity` on the signed-in account.
- [ ] A Google id already linked to **another** account is refused with one message ("This Google account is already in use"); the other account is not named.
- [ ] The row then shows the Google email, read-only, as information only.

### S4 · Remove Google from my account ([[Screen Index#s68|s68]])

**As an** existing user **I want** to unlink Google **so that** a lost or shared Google account cannot open Social Pin.

Acceptance criteria:
- [ ] *Unlink* removes the `SocialIdentity` row and the row returns to *Link*.
- [ ] Unlinking the last way in is refused: the account must keep a verified email or phone, or another linked provider, so the user can still sign in.
- [ ] Sessions already signed in through Google stay signed in until they expire; nothing is revoked by the unlink itself.

### S5 · Nothing leaks

**As any** user **I want** my Google link kept to myself **so that** nobody learns which account I sign in with.

Acceptance criteria:
- [ ] No view, Ring, Pin page or perspective ever carries a provider, a Google email or a `SocialIdentity`.
- [ ] The Google email is used to match an existing account only with the user's consent on screen (S2), never to enrich a profile silently.

## States and motion the design asks for

- Welcome: the Google choice in the same list as the three the design draws; the design has no fourth button yet, so the frontend asks design for one.
- Hand-off: leaving for Google, returning; a returning user sees Home, a new user Claim your Pin.
- Me: a Google row in *Link* / *Linked (email)* states; refusals inline under the row.
- Motion: none asked for beyond the design's screen transitions.

## Rules the backend already enforces

- Sign-up is three calls, `sign-up` → `verify-code` → `complete-registration`; the last one activates the account and creates the profile, the default Ring and its projection in one transaction. A Google sign-up must land in that same `complete-registration`, not beside it ([[Auth & Sign-up Backend Delivery]]).
- `SocialIdentity` exists and is unique on (`provider`, `providerUserId`), with GOOGLE among its providers and `email` optional and informational ([[Linked Accounts (OAuth) Story]]). No OAuth route exists for any provider yet.
- `E_AUTH_03` covers both a suspended and a never-finished account; the two stay indistinguishable ([[Error Contract]]).
- Passwordless since [[D-01 Passwordless login]]: no password field anywhere on this path.

## Open questions

- **Match by email: offered or required.** When Google's email equals an existing account's verified email, S2 proposes a code check then a link. Whether the user may instead decline and create nothing, or whether the link is automatic after the check, is product's call.
- **Provider login at all.** [[Linked Accounts (OAuth) Story]] still carries the question whether a provider can sign a user in; this story assumes yes for Google. One decision should settle it for every provider, raised from [[Linked Accounts (OAuth)]] or from here.
- **Where the code lives.** Whether Google reuses the OAuth route shape that [[T-019 LinkedIn OAuth link, unlink, login]] will set, so a second provider is a configuration, not a second flow. Backend's call once T-019 is designed; this story only needs the behaviour above.
- **Design.** s01 draws three choices; a fourth needs the design's word before the frontend requirements are written.
