---
type: feature
id: auth
name: "Auth & Sign-up"
priority: critical
release: mvp
module: identity
screens: [s01, s02, s06, s08, s68]
created: 2026-10-18
updated: 2026-10-28
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Auth & Sign-up

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-02 Auth & Sign-up Story|Story]] · [[FR-02 Auth & Sign-up Frontend Requirements|Frontend Requirements]] · [[BD-02 Auth & Sign-up Backend Delivery|Backend Delivery]] · [[BI-02 Auth & Sign-up Backend Integration|Backend Integration]] · [[Auth & Sign-up Frontend Delivery|Frontend Delivery]] · [[QB-05 Auth & Sign-up QA Backend|QA Backend]] · [[Auth & Sign-up QA Frontend|QA Frontend]]

Sign up with email or phone, verify the one-time code, finish registration with a Pin name, sign in with a one-time code, refresh, log out, log out everywhere. **Passwordless** since 2026-10-15 ([[ND-01 Passwordless login]]); client changes in [[Frontend Passwordless Migration]].

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s01|s01]] | Welcome | "No password to remember" — implemented (ND-01) |
| [[Screen Index#s02|s02]] | Verify | Resend timer, expired code |
| [[Screen Index#s06|s06]] | Claim your Pin | Availability check done; yearly rename + suggestions → ND-06 |
| [[Screen Index#s08|s08]] | First Ring | Default Ring is created by complete-registration |
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-02 Auth & Sign-up Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-056 | Decide passwordless login | Done | critical | history only |

### Log of the merged tasks

- T-056 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-056 · 2026-10-15 · decided A and shipped (`feat(auth): passwordless sign-in with OTP codes`, merged to `main`)
- T-056 · 2026-10-18 · vault updated; [[Frontend Passwordless Migration]] written for the client team

### Bugs

Filed from [[QB-05 Auth & Sign-up QA Backend]] on 2026-10-27; each hangs under the card it was found against.

| Bug | Status | Priority | Effort |
|---|---|---|---|
| [[B-03 Two refreshes at once both succeed and fork the session]] | ⬜ To do | high | S |
| [[B-04 Sign-up accepts an email and a phone together]] | ⬜ To do | medium | S |
| [[B-05 Expired onboarding token answers 401, not the documented 400]] | ⬜ To do | low | S |
| [[B-06 Timestamps the app writes are stored shifted by the server time zone]] | ⬜ To do | high | M |

## Decisions

- [[ND-01 Passwordless login]] — decided, code-only login

## Related

- [[F-01 Account]]
- [[F-07 Profiles & Pin Name]]
- [[F-11 Rings]]
- [[F-32 Code Delivery]]
- [[F-38 Linked Accounts (OAuth)]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
