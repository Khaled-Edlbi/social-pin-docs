---
id: BD-16
type: backend-delivery
module: shared-rings
feature: delegated-admins
status: in-progress
scope: feature
screens: [s26, s27]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/in-progress, module/shared-rings, layer/backend]
---

# 🟡 Delegated Admins · Backend Delivery

> ⚠ Affected by [[S-31 Delegated Admins Story]] (2026-11-05): S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.

**Feature:** [[F-16 Delegated Admins]] · **Status:** In progress · **Integration guide:** [[Delegated Admins Backend Integration]] · **Requirements:** [[FR-16 Delegated Admins Frontend Requirements]] · **QA:** [[Delegated Admins QA Backend]]

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

## Log

- 2026-10-18 · split out of [[F-16 Delegated Admins]] when the vault moved to layers
