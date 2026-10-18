---
type: feature
id: code-delivery
name: "Code Delivery"
status: partial
priority: P0
domain: platform
screens: [s02]
updated: 2026-10-18
tags: [feature, status/partial, domain/platform, priority/P0]
---

# 🟡 Code Delivery

**Status:** Partial (needs more) · **Priority:** P0 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]] · **Story:** [[Code Delivery Story]] · **Requirements:** [[Code Delivery Requirements]]

Delivering the one-time code by email or SMS. Today the code is only logged, and returned as `devCode` **in every environment** (product decision 2026-10-15, so the passwordless app can sign in before a provider exists).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s02|s02]] | Verify | Resend timer, expired code |

Wireframe brief sections: [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `POST /auth/sign-up (devCode)`
- `POST /auth/login (devCode)`
- `POST /auth/request-code (devCode)`

**Tables / models:** `VerificationCode`

**Code:** `src/modules/auth/auth.service.ts (issueCode, TODO(delivery))`

### What exists

- The whole OTP flow works end to end; the single line to replace is `AuthService.issueCode`.
- `devCode` is returned on every issued code, in every environment; absent only when no code was issued (unknown destination). Since login is passwordless, the code is the only credential: while `devCode` is returned, anyone who knows an account's email or phone can sign in as it.

### Gaps

- No mail provider.
- No SMS provider.
- `devCode` must be deleted from `AuthService.issueCode` and `VerificationChallengeEntity` once delivery is wired. The client is told to build the code screen as if it did not exist ([[Frontend Passwordless Migration]]).
- Resend timer and expired-code states (s02) depend on the provider's latency.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-001 Wire an email provider for one-time codes]] | ⬜ To do | P0 | S |
| [[T-002 Wire an SMS provider for one-time codes]] | ⬜ To do | P0 | S |
| [[T-003 Remove devCode once delivery works]] | ⛔ Blocked | P1 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "code-delivery" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]
- [[Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
