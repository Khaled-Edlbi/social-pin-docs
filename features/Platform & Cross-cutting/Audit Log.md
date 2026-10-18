---
type: feature
id: audit-log
name: "Audit Log"
status: todo
priority: P0
domain: platform
screens: []
updated: 2026-10-18
tags: [feature, status/todo, domain/platform, priority/P0]
---

# ❌ Audit Log

**Status:** TODO · **Priority:** P0 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]] · **Story:** [[Audit Log Story]] · **Requirements:** [[Audit Log Requirements]]

The `AuditLog` table exists with indexes; nothing writes to it. Required for sensitive admin, access, payment and AI actions.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `AuditLog`

**Code:** `prisma/schema/analytics.prisma`

### What exists

- Table and indexes.

### Gaps

- `AuditService.record()` called from auth (password change, logout-everywhere), ring members (grant / revoke / reassign), payments, AI actions.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-053 Audit log writes]] | ⬜ To do | P0 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "audit-log" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]
- [[Ring Members]]
- [[Payments & Orders]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
