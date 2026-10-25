---
type: feature
id: audit-log
name: "Audit Log"
priority: critical
release: mvp
module: platform
screens: []
updated: 2026-10-25
tags: [feature, module/platform, priority/critical, release/mvp]
---

# Audit Log

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Audit Log Story|Story]] · [[Audit Log Frontend Requirements|Frontend Requirements]] · [[Audit Log Backend Delivery|Backend Delivery]] · [[Audit Log Backend Integration|Backend Integration]] · [[Audit Log Frontend Delivery|Frontend Delivery]] · [[Audit Log QA Backend|QA Backend]] · [[Audit Log QA Frontend|QA Frontend]]

The `AuditLog` table exists with indexes; nothing writes to it. Required for sensitive admin, access, payment and AI actions.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-053 Audit log writes]] | ⬜ To do | Critical | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "audit-log" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]
- [[Ring Members]]
- [[Payments & Orders]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
