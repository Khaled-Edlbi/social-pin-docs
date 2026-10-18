---
type: feature
id: cleanup-jobs
name: "Cleanup Jobs"
status: todo
priority: P1
domain: platform
screens: []
updated: 2026-10-18
tags: [feature, status/todo, domain/platform, priority/P1]
---

# ❌ Cleanup Jobs

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]] · **Story:** [[Cleanup Jobs Story]] · **Requirements:** [[Cleanup Jobs Requirements]]

Scheduled sweepers: auto-delete Rings whose disposition is `AUTO_DELETE`, purge `PincastRecipient` rows, delete expired verification codes, and materialise `EXPIRED` statuses for reporting.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Ring`, `PincastRecipient`, `VerificationCode`, `RefreshToken`

### What exists

- The schema carries everything a job needs (`disposition`, indexed `detectedAt`, `expiresAt`).

### Gaps

- Pick a scheduler (`@nestjs/schedule`).
- Each job idempotent and logged.
- Access is already correct without them: expiry is evaluated live.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-054 Cleanup jobs]] | ⬜ To do | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "cleanup-jobs" SORT priority ASC
```

## Related

- [[Rings]]
- [[PinCast & Nearby]]
- [[Auth & Sign-up]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
