---
type: feature
id: cleanup-jobs
name: "Cleanup Jobs"
priority: high
release: v1
module: platform
screens: []
created: 2026-10-15
updated: 2026-10-26
tags: [feature, module/platform, priority/high, release/v1]
---

# Cleanup Jobs

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Cleanup Jobs Story|Story]] · [[Cleanup Jobs Frontend Requirements|Frontend Requirements]] · [[Cleanup Jobs Backend Delivery|Backend Delivery]] · [[Cleanup Jobs Backend Integration|Backend Integration]] · [[Cleanup Jobs Frontend Delivery|Frontend Delivery]] · [[Cleanup Jobs QA Backend|QA Backend]] · [[Cleanup Jobs QA Frontend|QA Frontend]]

Scheduled sweepers: auto-delete Rings whose disposition is `AUTO_DELETE`, purge `PincastRecipient` rows, delete expired verification codes, and materialise `EXPIRED` statuses for reporting.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-054 Cleanup jobs]] | ⬜ To do | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "cleanup-jobs" SORT priority ASC
```

## Related

- [[Rings]]
- [[PinCast & Nearby]]
- [[Auth & Sign-up]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
