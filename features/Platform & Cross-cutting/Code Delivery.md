---
type: feature
id: code-delivery
name: "Code Delivery"
status: partial
priority: P0
domain: platform
screens: [s02]
updated: 2026-10-15
tags: [feature, status/partial, domain/platform, priority/P0]
---

# 🟡 Code Delivery

**Status:** Partial (needs more) · **Priority:** P0 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]]

Delivering the one-time code by email or SMS. Today the code is only logged, and returned as `devCode` in development, test and local environments.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s02|s02]] | Verify | Resend timer, expired code |

Wireframe brief sections: [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `POST /auth/sign-up (devCode)`
- `POST /auth/request-code (devCode)`

**Tables / models:** `VerificationCode`

**Code:** `src/modules/auth/auth.service.ts (issueCode, TODO(delivery))`

### What exists

- The whole OTP flow works end to end; the single line to replace is `AuthService.issueCode`.
- The `devCode` gate is an allow-list of `NODE_ENV` values, not `!== 'production'`.

### Gaps

- No mail provider.
- No SMS provider.
- `devCode` must be deleted from `VerificationChallengeEntity` once delivery is wired.
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
