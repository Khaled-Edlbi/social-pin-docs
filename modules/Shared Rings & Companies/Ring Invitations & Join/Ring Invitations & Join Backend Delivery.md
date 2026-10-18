---
type: backend-delivery
code: ring-invitations
scope: feature
feature: ring-invitations
module: shared-rings
status: todo
screens: [s17, s74]
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/todo, module/shared-rings, layer/backend]
---

# ⬜ Ring Invitations & Join · Backend Delivery

**Feature:** [[Ring Invitations & Join]] · **Status:** To do · **Integration guide:** [[Ring Invitations & Join Backend Integration]] · **Requirements:** [[Ring Invitations & Join Frontend Requirements]] · **QA:** [[Ring Invitations & Join QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /rings/shared-with-me (list only)`

**Tables / models:** `RingMember`, `Ring`

### What exists

- The shared-with-me list.

### Gaps

- Invitation object (or a `RingMember` in an INVITED state) with accept / decline.
- Join code and required verified email domain: both need Ring settings, see [[D-04 Ring settings]].
- "What you contribute" is a member-side projection into a shared Ring: new concept, not in the schema.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Ring Invitations & Join]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
