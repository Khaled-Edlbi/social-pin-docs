---
type: backend-delivery
code: delegated-admins
scope: feature
feature: delegated-admins
module: shared-rings
status: in-progress
screens: [s26, s27]
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/in-progress, module/shared-rings, layer/backend]
---

# 🟡 Delegated Admins · Backend Delivery

**Feature:** [[Delegated Admins]] · **Status:** In progress · **Integration guide:** [[Delegated Admins Backend Integration]] · **Requirements:** [[Delegated Admins Frontend Requirements]] · **QA:** [[Delegated Admins QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `RingAdmin`

**Code:** `src/modules/ring-access/`

### What exists

- `RingAdmin` table with permission levels; `PATCH /rings/:id` accepts an admin at CONTENT_MANAGER or above.

### Gaps

- No list / add / change-level / remove admin endpoints.
- No notification to the person made admin.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Delegated Admins]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
