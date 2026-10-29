---
id: ND-01
type: needs-decision
status: open
features: [auth, linked-accounts]
screens: [s01, s02]
created: 2026-10-15
updated: 2026-10-29
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-01 · Passwordless login

**Status:** decided (2026-10-15, option A) · **Decider:** product + backend lead · **Raised:** 2026-10-15

## Where the design and the backend disagree

s01 says "We send a one-time code. No password to remember." The backend requires creating a password after the code and logs in with a password. The brief's §3.1 says "create password", so the design and the brief contradict each other.

## Facts

- A `LOGIN` value already exists in `VERIFICATION_PURPOSE` but has no route.
- `verify-code` already returns an onboarding token; a `LOGIN` purpose could return a session instead.

## Options

- **A. Code-only login.** Add `purpose: LOGIN` to `request-code` / `verify-code` returning a session. Remove the password step from registration. Simplest for users; every login costs a delivery.
- **B. Both.** Keep the password, add code login as an alternative. Covers the brief and the prototype.
- **C. Keep the brief.** Password stays; update s01 copy.

## Recommendation

B, because the brief is the signed-off scope and the prototype is newer. Needs [[F-32 Code Delivery]] first either way.

## Affects

- [[F-02 Auth & Sign-up]]
- [[F-38 Linked Accounts (OAuth)]]

Screens: [[Screen Index#s01|s01]], [[Screen Index#s02|s02]]

## Tasks waiting on this

- [[S-94 Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]]
- [[S-02 Auth & Sign-up Story|Auth & Sign-up · Decide passwordless login]]

## Decision

Fulfilled by [[D-01 Code-only login]], decided 2026-10-15 by product + backend lead: option A (what was decided, why, what it changes).
