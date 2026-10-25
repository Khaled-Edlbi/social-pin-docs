---
type: backend-delivery
code: photo-library
scope: feature
feature: photo-library
module: identity
status: in-progress
screens: [s29, s30]
created: 2026-10-18
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/in-progress, module/identity, layer/backend]
---

# 🟡 Photo Library · Backend Delivery

> ⚠ Affected by [[DR-02 One main profile every Ring starts from]] (2026-10-25): D-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

**Feature:** [[Photo Library]] · **Status:** In progress · **Integration guide:** [[Photo Library Backend Integration]] · **Requirements:** [[Photo Library Frontend Requirements]] · **QA:** [[Photo Library QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `POST /files (upload works)`

**Tables / models:** `File`, `RingProfile`

**Code:** `src/modules/file/`

### What exists

- Upload, metadata, delete.

### Gaps

- `GET /files` list of my files (paginated, filter by kind).
- Usage count per file across Ring projections.
- "Reset to Pin" (s29) needs a base profile photo. See [[D-02 Base profile work fields]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Photo Library]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
