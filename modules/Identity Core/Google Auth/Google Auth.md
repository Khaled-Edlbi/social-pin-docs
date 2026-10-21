---
type: feature
id: google-auth
name: "Google Auth"
priority: high
module: identity
screens: [s01, s68]
depends: ["Auth & Sign-up"]
affects: []
related: ["Linked Accounts (OAuth)", "Account", "D-01 Passwordless login"]
updated: 2026-10-21
tags: [feature, module/identity, priority/high]
---

# Google Auth

**Backend:** not started · **Priority:** High · **Deadline:** — · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Google Auth Story|Story]] · [[Google Auth Frontend Requirements|Frontend Requirements]] · [[Google Auth Backend Delivery|Backend Delivery]] · [[Google Auth Backend Integration|Backend Integration]] · [[Google Auth Frontend Delivery|Frontend Delivery]] · [[Google Auth QA Backend|QA Backend]] · [[Google Auth QA Frontend|QA Frontend]]

Sign up and sign in with a Google account: a *Continue with Google* choice on Welcome next to email, phone and LinkedIn, and a Google row under linked accounts on Me so an existing account can add or remove it. It is a third way into the same account, not a second account: whoever signs in with Google lands in the passwordless flow at the step they have not finished yet (Pin name, first Ring), exactly as after a one-time code ([[Auth & Sign-up]]). Not available yet: no task has been filed; the design's §3.2 lists email, phone and LinkedIn only, so the Google choice is new to the design as well.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s01|s01]] | Welcome | *Continue with Google* as a fourth choice; the design draws three (email, phone, LinkedIn) |
| [[Screen Index#s68|s68]] | Me / Account | A Google row under linked accounts: link, unlink, which email it carries |

Wireframe brief sections: [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

## Product rules

- One person, one account: a Google sign-in whose email already belongs to an account signs that account in; it never creates a second one.
- Google is a way in, not a profile source: nothing is imported from Google without the user seeing it first (the same rule as the LinkedIn import review in §3.3), and the Pin name is still chosen by the user.
- Unlinking Google must leave at least one way to sign in (email or phone verified, or another provider); the last one cannot be removed.
- Passwordless stays passwordless ([[D-01 Passwordless login]]): no password is created or asked for on the Google path.
- What the account exposes to viewers does not change: a linked Google account is never visible on a Ring, a view or a Pin page.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| — | not filed yet | | |

## Decisions

- None raised yet. The story's open questions name what may need one.

## Related

- [[Auth & Sign-up]] — the account, the passwordless flow and `complete-registration` that a Google sign-in lands in.
- [[Linked Accounts (OAuth)]] — the social-provider feature (LinkedIn today, `SocialIdentity` on the backend); the same linked-accounts list on s68.
- [[Account]] — `/users/me` and the account screen that lists linked providers.

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
