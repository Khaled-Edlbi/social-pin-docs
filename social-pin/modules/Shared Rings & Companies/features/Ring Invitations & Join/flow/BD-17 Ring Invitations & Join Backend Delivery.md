---
id: BD-17
type: backend-delivery
module: shared-rings
feature: ring-invitations
status: todo
scope: feature
screens: [s17, s74]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/todo, module/shared-rings, layer/backend]
---

# ⬜ Ring Invitations & Join · Backend Delivery

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** To do · **Integration guide:** [[Ring Invitations & Join Backend Integration]] · **Requirements:** [[FR-17 Ring Invitations & Join Frontend Requirements]] · **QA:** [[Ring Invitations & Join QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /rings/shared-with-me (list only)`

**Tables / models:** `RingMember`, `Ring`

### What exists

- The shared-with-me list.

### Gaps

- Invitation object (or a `RingMember` in an INVITED state) with accept / decline.
- Join code and required verified email domain: both need Ring settings, see [[ND-04 Ring settings]].
- "What you contribute" is a member-side projection into a shared Ring: new concept, not in the schema.

## Log

- 2026-10-18 · split out of [[F-17 Ring Invitations & Join]] when the vault moved to layers
