---
type: feature
id: audit-log
name: "Audit Log"
priority: critical
release: mvp
module: platform
screens: []
created: 2026-10-15
updated: 2026-10-27
tags: [feature, module/platform, priority/critical, release/mvp]
---

# Audit Log

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Audit Log Story|Story]] · [[Audit Log Frontend Requirements|Frontend Requirements]] · [[Audit Log Backend Delivery|Backend Delivery]] · [[Audit Log Backend Integration|Backend Integration]] · [[Audit Log Frontend Delivery|Frontend Delivery]] · [[Audit Log QA Backend|QA Backend]] · [[Audit Log QA Frontend|QA Frontend]]

The `AuditLog` table exists with indexes; nothing writes to it. Required for sensitive admin, access, payment and AI actions.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[Audit Log Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-053 | Audit log writes | In progress | critical | S4 |

### Log of the merged tasks

- T-053 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-053 · 2026-10-26 · in progress: `AuditLogService` and the panel's writes sit on
- T-053 · 2026-10-18 · created as the backend half of T-053
- T-053 · 2026-10-26 · the service and the panel's writes sit on

## Related

- [[Auth & Sign-up]]
- [[Ring Members]]
- [[Payments & Orders]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
