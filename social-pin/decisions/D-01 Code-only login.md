---
id: D-01
type: decision
status: decided
features: [auth, linked-accounts]
decision: ND-01
decidedBy: "product + backend lead"
decidedAt: 2026-10-15
owner: "khaled"
affects: ["F-02 Auth & Sign-up", "F-38 Linked Accounts (OAuth)", "S-94 Linked Accounts (OAuth) Story", "S-02 Auth & Sign-up Story"]
related: ["ND-01 Passwordless login", "F-32 Code Delivery"]
created: 2026-10-22
updated: 2026-10-29
tags: [decision, decision/decided]
---

# ⚖️ D-01 · Code-only login

**Answers:** [[ND-01 Passwordless login]] · **Decided by:** product + backend lead · **On:** 2026-10-15 · **Feature:** [[F-02 Auth & Sign-up]], [[F-38 Linked Accounts (OAuth)]]

> This card is the answer to [[ND-01 Passwordless login]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. It is written when the decision is taken, by the PM or the owner on the user's word, never before; the needs-decision card is `decided` once this card exists.

## What was decided

**Option A on ND-01: code-only login.** A user signs in with a one-time code and never sets a password, as s01 says. Shipped in `social-pin` PR #1 (`feat(auth): passwordless sign-in with OTP codes`):

- `POST /auth/login { identifier }` issues a LOGIN code; `POST /auth/login/verify { identifier, code }` returns the session.
- `complete-registration` takes only `pinName` / `fullName`; `reset-password` and `change-password` are removed; `users.password_hash` is dropped.
- `devCode` is returned in every environment until [[F-32 Code Delivery]] is wired, so the decision did **not** wait on delivery; Code Delivery · S8 removes it later.

Options B (password and code) and C (password only) are ruled out.

## Why

- The prototype (s01) promises "no password to remember"; option A keeps that promise and is the simplest for users.
- The backend already had a `LOGIN` value in `VERIFICATION_PURPOSE` and a `verify-code` that returns a token, so a LOGIN purpose returning a session was a small change.
- Traded away: every login costs a code delivery, and the brief's §3.1 "create password" no longer describes the product. The needs-decision card had recommended B; product and the backend lead chose A.

## What it changes

- [[F-02 Auth & Sign-up]]: login and registration are code-only; client-facing write-up in [[Frontend Passwordless Migration]].
- [[F-38 Linked Accounts (OAuth)]]: no password to link against; [[S-94 Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]] is no longer blocked by this decision.
- [[S-02 Auth & Sign-up Story|Auth & Sign-up · Decide passwordless login]]: done.

## Still open

Nothing on this decision; wiring real code delivery is [[F-32 Code Delivery]]'s.
