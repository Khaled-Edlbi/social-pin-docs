---
type: task
id: T-071
status: in-progress
priority: high
effort: S
feature: operator-panel
module: platform
labels: []
screens: []
depends: ["T-068"]
affects: ["Spec Map", "Frontend API Guide", "Audit Log"]
related: ["Audit Log Story"]
pending: []
created: 2026-10-26
updated: 2026-10-27
tags: [task, task/in-progress, module/platform, priority/high]
---

# 🟡 T-071 · Audit-log read endpoints

**Feature:** [[Operator Panel]] · **Status:** In progress · **Priority:** High · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-071-be Backend · Audit-log read endpoints|Backend]] · **Story:** [[T-071 Story]]

## What

The trail the panel writes, made readable: `GET /admin/audit-logs`, filtered
by actor, action, resource and time window, and `GET /admin/audit-logs/:id`
for one entry with its full `metadata`.

The detail route is SUPER_ADMIN-only because `metadata` is the one field
that can carry the shape of a change; `E_ADMIN_08` when the entry is not
there. The reads come from `AuditLogService`, which already owns the table
([[Audit Log Story|Audit Log · S4]]), rather than a second query path into
`audit_logs`. The table stays append-only: no route deletes an entry at any
role.

## Design

- —

## Impact

Output of `node scripts/build-tree.mjs --impact T-071` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-071 Story]] · S-112 — same task
- [[T-071-be Backend · Audit-log read endpoints]] · T-071-be — same task
- [[Operator Panel]] · F-42 — wikilink ←, wikilink →

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · filed under [[Operator Panel]], after the code: the backend
  was written before any ticket named it and now sits on `T-071-be/admin/audit-log-reads`
  in `social-pin`, `pnpm typecheck && pnpm test` green, not merged. Priority,
  effort and the feature's `release:` are first guesses for the owner.
