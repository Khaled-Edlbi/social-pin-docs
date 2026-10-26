---
type: backend-delivery
code: counts
scope: feature
feature: counts
module: identity
status: in-progress
screens: [s11, s12, s14, s16, s17, s68]
created: 2026-10-18
updated: 2026-10-26
tags: [backend-delivery, backend-delivery/in-progress, module/identity, layer/backend]
---

# 🟡 Counts · Backend Delivery

**Feature:** [[Counts]] · **Status:** In progress · **Integration guide:** [[Counts Backend Integration]] · **Requirements:** [[Counts Frontend Requirements]] · **QA:** [[Counts QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `RingMember`, `Connection`

**Code:** `src/modules/ring/`

### What exists

- All the data exists; counts are derived.

### Gaps

- No endpoint returns a member count per Ring.
- No endpoint returns a connection count (and connections do not exist yet).
- Decide whether counts ride on the list entities (`memberCount` on `RingEntity`) or on a separate stats endpoint.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Counts]] when the vault moved to layers
