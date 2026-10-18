---
type: feature
id: connections
name: "Connections"
status: todo
priority: P0
domain: connections
screens: [s44, s45, s46, s47, s62]
updated: 2026-10-18
tags: [feature, status/todo, domain/connections, priority/P0]
---

# ❌ Connections

**Status:** TODO · **Priority:** P0 · **Domain:** [[Feature Tree#Connections|Connections]] · **Story:** [[Connections Story]] · **Requirements:** [[Connections Requirements]]

A connection is an **access request**, not a content subscription. Send a request after a scan, review the inbox, accept and pick a Ring (this sets `ConnectionRequest.grantedRingId`), connection detail, introduce, block and unblock, contacts list.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s44|s44]] | Scanned Pin | Read part done; Connect todo |
| [[Screen Index#s45|s45]] | Requests |  |
| [[Screen Index#s46|s46]] | Accept · pick a Ring |  |
| [[Screen Index#s47|s47]] | Connection detail | Reassign / revoke done; detail todo |
| [[Screen Index#s62|s62]] | Post-event summary | Keep / merge / expire done |

Wireframe brief sections: [[Wireframe Brief#Connections & networking|§5 Connections & networking]], [[Wireframe Brief#Contacts & Devices|§6.4 Contacts & Devices]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

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
- Gemma suggests the Ring on accept (see [[Gemma AI]]).

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-021 Connect request send, inbox, cancel]] | ⬜ To do | P0 | M |
| [[T-022 Accept into a Ring (sets grantedRingId)]] | ⬜ To do | P0 | M |
| [[T-023 Connection detail and contacts list]] | ⬜ To do | P0 | M |
| [[T-024 Block and unblock]] | ⬜ To do | P0 | S |
| [[T-025 Introduce a connection to another]] | ❓ Needs a decision / info | P2 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "connections" SORT priority ASC
```

## Related

- [[Ring Members]]
- [[Ring Access Engine]]
- [[View As & Pin Views]]
- [[Badge & QR]]
- [[Counts]]
- [[Notifications]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
