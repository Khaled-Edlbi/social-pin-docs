---
type: task
id: T-053
status: in-progress
priority: critical
effort: S
feature: audit-log
module: platform
screens: []
depends: []
related: [T-068, T-071]
pending: ["@backend: the access, payment and AI writers", "@backend: the retention job for audit_logs"]
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/in-progress, module/platform, priority/critical]
---

# 🟡 T-053 · Audit log writes

**Feature:** [[Audit Log]] · **Status:** In progress · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-053-be Backend · Audit log writes|Backend]] · **Story:** [[T-053 Story]]

## What

`AuditLogService.record()` from auth, ring members, payments and AI actions.
The service is `AuditLogService`, not `AuditService`: it owns the `audit_logs`
table, and `record()` deliberately carries no transaction of its own so it
joins the caller's — an entry cannot claim a change the database rolled back.

Shipped so far: the service, its reads, and the operator panel's writes (a
status change, the platform role, a role grant or revoke each record one). See
[[Operator Panel]]. Still open, and why this stays in progress: the access,
payment and AI writers, and the retention job.

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-26 · in progress: `AuditLogService` and the panel's writes sit on
  `T-053-be/audit/audit-log-writes` in `social-pin`, typecheck and tests green,
  not merged. The three other writer categories and the retention job stay open
  here, in `pending:`.
