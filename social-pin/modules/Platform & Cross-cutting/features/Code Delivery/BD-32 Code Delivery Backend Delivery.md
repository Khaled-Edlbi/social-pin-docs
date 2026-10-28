---
type: backend-delivery
code: code-delivery
scope: feature
feature: code-delivery
module: platform
status: in-progress
screens: [s02]
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/in-progress, module/platform, layer/backend]
---

# 🟡 Code Delivery · Backend Delivery

**Feature:** [[F-32 Code Delivery]] · **Status:** In progress · **Integration guide:** [[Code Delivery Backend Integration]] · **Requirements:** [[FR-32 Code Delivery Frontend Requirements]] · **QA:** [[Code Delivery QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

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

## Log

- 2026-10-18 · split out of [[F-32 Code Delivery]] when the vault moved to layers
