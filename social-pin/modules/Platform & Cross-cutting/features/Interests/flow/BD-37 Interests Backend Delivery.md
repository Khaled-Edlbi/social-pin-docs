---
id: BD-37
type: backend-delivery
module: platform
feature: interests
status: in-progress
scope: feature
screens: [s07, s71]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/in-progress, module/platform, layer/backend]
---

# 🟡 Interests · Backend Delivery

**Feature:** [[F-37 Interests]] · **Status:** In progress · **Integration guide:** [[Interests Backend Integration]] · **Requirements:** [[FR-37 Interests Frontend Requirements]] · **QA:** [[Interests QA Backend]]

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
- No outward entity, ever: interests feed [[F-36 Gemma AI]] matchmaking only.

## Log

- 2026-10-18 · split out of [[F-37 Interests]] when the vault moved to layers
