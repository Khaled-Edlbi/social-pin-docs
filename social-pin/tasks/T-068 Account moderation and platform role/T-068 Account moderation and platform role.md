---
type: task
id: T-068
status: in-progress
priority: high
effort: M
feature: operator-panel
module: platform
labels: []
screens: []
depends: [T-053]
affects: ["Spec Map", "Frontend API Guide", "Account", "Auth & Sign-up"]
related: [T-006]
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/in-progress, module/platform, priority/high]
---

# 🟡 T-068 · Account moderation and platform role

**Feature:** [[Operator Panel]] · **Status:** In progress · **Priority:** High · **Deadline:** — · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-068-be Backend · Account moderation and platform role|Backend]] · **Story:** [[T-068 Story]]

## What

The panel's first screens, for staff rather than users: find an account,
read its state, suspend or reactivate it, and set the platform role on it.
`GET /admin/users` with a search over email and phone and filters for
status, account type, role and creation window, `GET /admin/users/:id`,
`PATCH .../:id/status` and `PATCH .../:id/role`, the last SUPER_ADMIN-only
because `users.role` is the string `RolesGuard` matches. Code:
`src/modules/admin/admin-user.*`, `entities/admin-user.entity.ts`,
`E_ADMIN_01` and `E_ADMIN_02`.

Two behaviours carry the weight. Suspension ends the session now: the
account's live refresh tokens are revoked in the same transaction as the
status change, so it cannot mint a new access token. And the detail screen
returns `_count`s, not rows — how many rings and profiles an account has,
never whose they are or what is in them, so what a viewer may see stays
with `RingAccessService`.

## Design

- —

## Impact

Output of `node scripts/build-tree.mjs --impact T-068` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-068 Story]] · S-109 — same task
- [[T-068-be Backend · Account moderation and platform role]] · T-068-be — same task
- [[Operator Panel]] · F-42 — wikilink ←, wikilink →

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · filed under [[Operator Panel]], after the code: the backend
  was written before any ticket named it and now sits on `T-068-be/admin/account-moderation`
  in `social-pin`, `pnpm typecheck && pnpm test` green, not merged. Priority,
  effort and the feature's `release:` are first guesses for the owner.
