---
type: task
id: T-069
status: in-progress
priority: high
effort: M
feature: operator-panel
module: platform
labels: []
screens: []
depends: [T-068]
affects: ["Spec Map", "Frontend API Guide", "Auth & Sign-up"]
related: ["Delegated Admins Story"]
pending: []
created: 2026-10-26
updated: 2026-10-27
tags: [task, task/in-progress, module/platform, priority/high]
---

# 🟡 T-069 · Scoped role grants

**Feature:** [[Operator Panel]] · **Status:** In progress · **Priority:** High · **Deadline:** — · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-069-be Backend · Scoped role grants|Backend]] · **Story:** [[T-069 Story]]

## What

List, grant and revoke the scoped grants in `user_roles`:
`GET/POST /admin/users/:userId/roles` and `DELETE .../roles/:assignmentId`.
The scope type comes from the role rather than the request; a GLOBAL role
takes no scope id and every other scope requires one, which is what the
partial unique index on the null case and the duplicate check both depend
on. A revoke is scoped by user as well as assignment id, so a grant cannot
be revoked through another user's route. Codes `E_ADMIN_03` to `E_ADMIN_07`.

A GLOBAL grant is SUPER_ADMIN-only: `JwtStrategy` puts GLOBAL-scoped role
names into the same array `RolesGuard` matches, so granting a role named
`ADMIN` globally is the same privilege as writing `users.role`, and it is
gated the same way — in the service, because the route itself stays open to
ADMIN for the scoped grants that are the common case.

Not to be confused with [[Delegated Admins Story|Delegated Admins · S6]], which is
ring-level (`/rings/:ringId/admins`, owner only, `assertCanAdminister`).
Both have to exist; neither closes the other.

## Design

- —

## Impact

Output of `node scripts/build-tree.mjs --impact T-069` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-069 Story]] · S-110 — same task
- [[T-069-be Backend · Scoped role grants]] · T-069-be — same task
- [[Operator Panel]] · F-42 — wikilink ←, wikilink →

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · filed under [[Operator Panel]], after the code: the backend
  was written before any ticket named it and now sits on `T-069-be/admin/scoped-role-grants`
  in `social-pin`, `pnpm typecheck && pnpm test` green, not merged. Priority,
  effort and the feature's `release:` are first guesses for the owner.
