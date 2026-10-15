---
type: task
id: T-003
status: blocked
priority: P1
effort: S
feature: code-delivery
domain: platform
screens: [s02]
depends: [T-001, T-002]
created: 2026-10-15
tags: [task, task/blocked, domain/platform, priority/P1]
---

# ⛔ T-003 · Remove devCode once delivery works

**Feature:** [[Code Delivery]] · **Status:** Blocked · **Priority:** P1 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

Delete `devCode` from `VerificationChallengeEntity` and the allow-list in `AuthService`.

## Design

- [[Screen Index#s02|s02]] Verify

## Dependencies

- Waits on [[T-001 Wire an email provider for one-time codes]]
- Waits on [[T-002 Wire an SMS provider for one-time codes]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
