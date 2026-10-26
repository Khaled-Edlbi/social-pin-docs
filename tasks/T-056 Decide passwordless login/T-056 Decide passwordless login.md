---
type: task
id: T-056
status: done
priority: critical
effort: S
feature: auth
module: identity
screens: [s01]
depends: []
created: 2026-10-15
tags: [task, task/done, module/identity, priority/critical]
decision: D-01
---

# ✅ T-056 · Decide: passwordless login

**Feature:** [[Auth & Sign-up]] · **Status:** Done · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

See [[Passwordless login]]. Decided: option A, code-only login. Shipped in `social-pin` PR #1. Frontend write-up: [[Frontend Passwordless Migration]].

## Design

- [[Screen Index#s01|s01]] Welcome

## Definition of done

- [x] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [x] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]) — n/a, no read path touched
- [x] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [x] `pnpm typecheck && pnpm test` green
- [x] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-15 · decided A and shipped (`feat(auth): passwordless sign-in with OTP codes`, merged to `main`)
- 2026-10-18 · vault updated; [[Frontend Passwordless Migration]] written for the client team
