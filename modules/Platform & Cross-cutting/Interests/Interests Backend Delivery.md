---
type: backend-delivery
code: interests
scope: feature
feature: interests
module: platform
status: in-progress
screens: [s07, s71]
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/in-progress, module/platform, layer/backend]
---

# 🟡 Interests · Backend Delivery

**Feature:** [[Interests]] · **Status:** In progress · **Integration guide:** [[Interests Backend Integration]] · **Requirements:** [[Interests Frontend Requirements]] · **QA:** [[Interests QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Interest`, `UserInterest`

**Code:** `prisma/seed/interest.seed.ts`

### What exists

- Table and seeded vocabulary.

### Gaps

- `GET /interests` vocabulary.
- `GET/PUT /users/me/interests`.
- No outward entity, ever: interests feed [[Gemma AI]] matchmaking only.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Interests]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
