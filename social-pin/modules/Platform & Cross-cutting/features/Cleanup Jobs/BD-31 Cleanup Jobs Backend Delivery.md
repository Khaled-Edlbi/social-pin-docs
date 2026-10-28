---
type: backend-delivery
code: cleanup-jobs
scope: feature
feature: cleanup-jobs
module: platform
status: todo
screens: []
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/todo, module/platform, layer/backend]
---

# ⬜ Cleanup Jobs · Backend Delivery

**Feature:** [[F-31 Cleanup Jobs]] · **Status:** To do · **Integration guide:** [[Cleanup Jobs Backend Integration]] · **Requirements:** [[FR-31 Cleanup Jobs Frontend Requirements]] · **QA:** [[Cleanup Jobs QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Ring`, `PincastRecipient`, `VerificationCode`, `RefreshToken`

### What exists

- The schema carries everything a job needs (`disposition`, indexed `detectedAt`, `expiresAt`).

### Gaps

- Pick a scheduler (`@nestjs/schedule`).
- Each job idempotent and logged.
- Access is already correct without them: expiry is evaluated live.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[F-31 Cleanup Jobs]] when the vault moved to layers
