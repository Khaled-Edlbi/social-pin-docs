---
type: feature
id: delegated-admins
name: "Delegated Admins"
status: partial
priority: P1
domain: shared-rings
screens: [s26, s27]
updated: 2026-10-18
tags: [feature, status/partial, domain/shared-rings, priority/P1]
---

# 🟡 Delegated Admins

**Status:** Partial (needs more) · **Priority:** P1 · **Domain:** [[Feature Tree#Shared Rings & Companies|Shared Rings & Companies]] · **Story:** [[Delegated Admins Story]] · **Requirements:** [[Delegated Admins Requirements]]

Company Rings delegate administration at permission levels (`RingAdmin`). The rules are enforced by `assertCanAdminister`; there is no way to add, change or remove an admin.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s26|s26]] | Edit · access | Settings → D-04 |
| [[Screen Index#s27|s27]] | Edit · permissions | All settings → D-04 |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `RingAdmin`

**Code:** `src/modules/ring-access/`

### What exists

- `RingAdmin` table with permission levels; `PATCH /rings/:id` accepts an admin at CONTENT_MANAGER or above.

### Gaps

- No list / add / change-level / remove admin endpoints.
- No notification to the person made admin.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-006 Delegated admin endpoints]] | ⬜ To do | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "delegated-admins" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]

## Related

- [[Rings]]
- [[Companies]]
- [[Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
