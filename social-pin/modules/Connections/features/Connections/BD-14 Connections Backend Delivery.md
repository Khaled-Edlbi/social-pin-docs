---
type: backend-delivery
code: connections
scope: feature
feature: connections
module: connections
status: todo
screens: [s44, s45, s46, s47, s62]
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/todo, module/connections, layer/backend]
---

# ⬜ Connections · Backend Delivery

**Feature:** [[F-14 Connections]] · **Status:** To do · **Integration guide:** [[Connections Backend Integration]] · **Requirements:** [[FR-14 Connections Frontend Requirements]] · **QA:** [[Connections QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Connection`, `ConnectionRequest`, `UserBlock`, `ContactNote`, `RelationshipTag`

### What exists

- Schema with canonical pair (`user_a_id < user_b_id`) CHECK, `grantedRingId` never exposed to the requester, `UserBlock` already enforced by the access engine.

### Gaps

- Send a Connect request after a scan (s44).
- Requests inbox, incoming and sent (s45).
- Accept and pick a Ring (s46) in one transaction: create the connection, add the member, set `grantedRingId`.
- Connection detail: events in common, mutual connections, introduce (s47).
- Block / unblock.
- Contacts list, searchable.
- Gemma suggests the Ring on accept (see [[F-36 Gemma AI]]).

## Log

- 2026-10-18 · split out of [[F-14 Connections]] when the vault moved to layers
