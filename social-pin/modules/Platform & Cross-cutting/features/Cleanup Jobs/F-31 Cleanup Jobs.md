---
id: F-31
type: feature
module: platform
feature: cleanup-jobs
priority: high
release: v1
screens: []
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/platform, priority/high, release/v1]
---

# Cleanup Jobs

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-76 Cleanup Jobs Story|Story]] · [[FR-31 Cleanup Jobs Frontend Requirements|Frontend Requirements]] · [[BD-31 Cleanup Jobs Backend Delivery|Backend Delivery]] · [[Cleanup Jobs Backend Integration|Backend Integration]] · [[Cleanup Jobs Frontend Delivery|Frontend Delivery]] · [[Cleanup Jobs QA Backend|QA Backend]] · [[Cleanup Jobs QA Frontend|QA Frontend]]

Scheduled sweepers: auto-delete Rings whose disposition is `AUTO_DELETE`, purge `PincastRecipient` rows, delete expired verification codes, and materialise `EXPIRED` statuses for reporting.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-76 Cleanup Jobs Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-054 | Cleanup jobs | To do | high | S4 |

### Log of the merged tasks

- T-054 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-054 · 2026-10-18 · created as the backend half of T-054

## Related

- [[F-11 Rings]]
- [[F-20 PinCast & Nearby]]
- [[F-02 Auth & Sign-up]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
