---
type: story
code: linked-accounts
scope: feature
feature: linked-accounts
module: platform
status: approved
screens: [s01, s04, s68]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-26
tags: [story, story/approved, module/platform, layer/business]
---

# Linked Accounts (OAuth) · User Story

**Feature:** [[Linked Accounts (OAuth)]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Linked Accounts (OAuth) Frontend Requirements]] · **API Integration:** not yet (backend not built)

On the welcome screen a new user can choose "Continue with LinkedIn" instead of typing an email; the OAuth hand-off returns with a profile to import, which feeds the base profile and then the first Ring. Later, from Me, the same user links or unlinks providers and, once decided, signs in with one. The `SocialIdentity` table exists; no OAuth route does, and whether a provider can log a user in without a password is an open decision.

## Persona

A first-time user who would rather import than type; and an existing user on s68 managing which providers are attached to the account.

## Stories

### S1 · Continue with LinkedIn ([[Screen Index#s01|s01]])

**As a** new user **I want** "Continue with LinkedIn" as an equal, primary choice next to Email and Phone **so that** sign-up starts from a profile I already maintain.

Acceptance criteria:
- [ ] The three methods are shown as equals on one screen ([[Wireframe Brief#The three login/signup methods|§3.2]]).
- [ ] Tapping LinkedIn opens the provider's OAuth page in a secure browser context, not a plain web view, and returns to the app on completion.
- [ ] The ring progress anchor persists through the hand-off and return.

### S2 · Return from OAuth into Importing ([[Screen Index#s04|s04]])

**As a** user back from LinkedIn **I want** the app to show my profile being assembled **so that** I see the import is not a dead end.

Acceptance criteria:
- [ ] The callback creates the `SocialIdentity` keyed by the provider's own user id, never by email.
- [ ] Imported fields (avatar, name, headline, company, location) animate into their slots; the review step that follows is owned by [[Onboarding Imports]].
- [ ] "Skip and fill it in myself" goes to s06; the identity stays linked even if nothing is imported.

### S3 · OAuth cancelled, failed or denied ([[Screen Index#s01|s01]])

**As a** user who backed out of LinkedIn or denied permissions **I want** to land back on s01 with one short message **so that** I can pick another method.

Acceptance criteria:
- [ ] Cancelled, failed and permission-denied each return to s01 with the other two methods untouched.
- [ ] No partial account is left behind: a failed hand-off creates no user and no identity.

### S4 · Link a provider from Me ([[Screen Index#s68|s68]])

**As a** signed-in user **I want** to attach LinkedIn (or another provider) to my account **so that** I can import later and sign in with it once that exists.

Acceptance criteria:
- [ ] The linked-accounts section lists each identity with the provider and the provider email when known.
- [ ] Linking runs the same OAuth hand-off and returns to s68; more than one account of the same provider type is allowed, as the brief's §12 says.
- [ ] Linking an identity already attached to another account fails with one message and attaches nothing.

### S5 · Unlink a provider ([[Screen Index#s68|s68]])

**As a** user **I want** to remove a linked provider **so that** a sold or compromised social account cannot reach mine.

Acceptance criteria:
- [ ] Unlink removes the `SocialIdentity` row and refreshes the list.
- [ ] Unlinking is always allowed: the email or phone code remains a way to sign in, so no identity is ever the last one.

### S6 · Sign in with a linked provider ([[Screen Index#s01|s01]])

**As a** returning user **I want** "Continue with LinkedIn" to sign me in when the identity is already linked **so that** I skip even the code step.

Acceptance criteria:
- [ ] [[ND-01 Passwordless login]] is decided (code-only): provider login must return the same session pair as `POST /auth/login/verify`; the client treats LinkedIn as sign-up plus import only.
- [ ] When decided, a successful provider login issues the normal session pair and records `lastLoginAt`.

## States and motion the design asks for

- State: OAuth in progress, cancelled, failed, permissions denied; partial import; nothing returned (fall back to manual) ([[Wireframe Brief#The three login/signup methods|§3.2]], [[Wireframe Brief#LinkedIn profile import|§3.3]]).
- Motion: the three choices converge into one flow; imported fields assemble into a profile being built ([[Wireframe Brief#Motion principles|§14 Motion principles]], item 3).

## Rules the backend already enforces

- `SocialIdentity` is unique on (`provider`, `providerUserId`) and indexed by user; providers are GOOGLE, APPLE, FACEBOOK, LINKEDIN, MICROSOFT; `email` is optional and informational.
- Registration today ends with the Pin name in one transaction (no password, [[ND-01 Passwordless login]] decided); a provider sign-up still has to pass through `complete-registration` ([[Auth Model]]).
- Nothing OAuth exists; [[T-019 LinkedIn OAuth link, unlink, login]] is ❓.

## Open questions

- None open: [[ND-01 Passwordless login]] is decided (code-only). What remains is [[T-019 LinkedIn OAuth link, unlink, login]].
