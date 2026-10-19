---
type: task
id: T-019
status: todo
priority: high
effort: L
feature: linked-accounts
module: platform
screens: [s01, s04, s68]
depends: []
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/high]
---

# ⬜ T-019 · LinkedIn OAuth: link, unlink, login

**Feature:** [[Linked Accounts (OAuth)]] · **Status:** To do · **Priority:** High · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-019-fe Frontend · LinkedIn OAuth link, unlink, login|Frontend]] · [[T-019-be Backend · LinkedIn OAuth link, unlink, login|Backend]] · **Story:** [[T-019 Story]]

## What

Callback writes `SocialIdentity`. Login via provider returns a session the same way `POST /auth/login/verify` does (D-01 decided: passwordless, code-only; a linked provider is the second way to prove the identity).

## Design

- [[Screen Index#s01|s01]] Welcome
- [[Screen Index#s04|s04]] Importing
- [[Screen Index#s68|s68]] Me / Account

## Dependencies

- [[D-01 Passwordless login]] — decided 2026-10-15, no longer blocking
- Unblocks [[T-020 LinkedIn import → review → base profile]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
