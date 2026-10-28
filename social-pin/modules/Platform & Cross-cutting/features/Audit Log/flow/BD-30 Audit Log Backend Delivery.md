---
type: backend-delivery
code: audit-log
scope: feature
feature: audit-log
module: platform
status: todo
screens: []
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/todo, module/platform, layer/backend]
---

# ⬜ Audit Log · Backend Delivery

**Feature:** [[F-30 Audit Log]] · **Status:** To do · **Integration guide:** [[Audit Log Backend Integration]] · **Requirements:** [[FR-30 Audit Log Frontend Requirements]] · **QA:** [[Audit Log QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `AuditLog`

**Code:** `prisma/schema/analytics.prisma`

### What exists

- Table and indexes.

### Gaps

- `AuditService.record()` called from auth (logout-everywhere, session revocation), ring members (grant / revoke / reassign), payments, AI actions.

## Log

- 2026-10-18 · split out of [[F-30 Audit Log]] when the vault moved to layers
