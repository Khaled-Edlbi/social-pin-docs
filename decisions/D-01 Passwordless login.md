---
type: decision
id: D-01
status: open
features: [auth, linked-accounts]
screens: [s01, s02]
created: 2026-10-15
tags: [decision, decision/open]
---

# ❓ D-01 · Passwordless login

**Status:** open · **Decider:** product + backend lead · **Raised:** 2026-10-15

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

B, because the brief is the signed-off scope and the prototype is newer. Needs [[Code Delivery]] first either way.

## Affects

- [[Auth & Sign-up]]
- [[Linked Accounts (OAuth)]]

Screens: [[Screen Index#s01|s01]], [[Screen Index#s02|s02]]

## Tasks waiting on this

- [[T-019 LinkedIn OAuth link, unlink, login]]
- [[T-056 Decide passwordless login]]

## Outcome

_Not decided yet. When decided: set `status: decided` above, write the choice here, move the waiting tasks out of ❓._
