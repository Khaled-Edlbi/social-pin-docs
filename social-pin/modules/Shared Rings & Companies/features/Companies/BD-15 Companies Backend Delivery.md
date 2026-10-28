---
type: backend-delivery
code: companies
scope: feature
feature: companies
module: shared-rings
status: todo
screens: [s72, s73]
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/todo, module/shared-rings, layer/backend]
---

# ⬜ Companies · Backend Delivery

**Feature:** [[F-15 Companies]] · **Status:** To do · **Integration guide:** [[Companies Backend Integration]] · **Requirements:** [[FR-15 Companies Frontend Requirements]] · **QA:** [[Companies QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Business`, `BusinessMember`, `BusinessTag`, `BusinessFile`

### What exists

- Business schema with members, tags and files.

### Gaps

- List my companies, company detail, leave company.
- Company Rings (`CORPORATE` with `parentRingId` hierarchy: public / employees / c-suite) and their admins.
- Overlaps with [[F-24 Exhibitor]] business account setup.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[F-15 Companies]] when the vault moved to layers
