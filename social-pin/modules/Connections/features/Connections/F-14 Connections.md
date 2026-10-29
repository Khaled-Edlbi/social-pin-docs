---
id: F-14
type: feature
module: connections
feature: connections
priority: critical
release: mvp
screens: [s44, s45, s46, s47, s62]
owner: "omar"
related: ["F-11 Rings"]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/connections, priority/critical, release/mvp]
---

# Connections

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[M-02 Connections Module|Connections]]

**Layers:** [[S-23 Connections Story|Story]] · [[FR-14 Connections Frontend Requirements|Frontend Requirements]] · [[BD-14 Connections Backend Delivery|Backend Delivery]] · [[Connections Backend Integration|Backend Integration]] · [[Connections Frontend Delivery|Frontend Delivery]] · [[Connections QA Backend|QA Backend]] · [[Connections QA Frontend|QA Frontend]]

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

## Product rules

- A request is pending, accepted, declined, cancelled or expired, and **the requester sees each of these**: a decline is shown as declined ([[D-13 The requester sees a declined request]]). A block still reads as "This profile isn't available to you", never as a decline.
- **A request expires after 30 days** unanswered; it **may carry an optional note** of up to 200 characters; after a decline or an expiry the requester **can ask again straight away** ([[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- **The requester never learns which Ring they were accepted into**; Shared with me lists people, never Rings ([[D-14 Shared with me lists people, never the Ring]]).
- **One person can be in several of my Rings** and sees the version from the Ring they were put in first. Removing them from my last Ring offers *Remove from Rings* (still a connection, no access) or *Disconnect* (the connection ends) ([[D-15 Several Rings per connection, remove or disconnect]]).
- Not built yet: the connection request flow is TODO.

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-23 Connections Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-021 | Connect request send, inbox, cancel | To do | critical | S8–S12 |
| T-022 | Accept into a Ring (sets grantedRingId) | To do | critical | S13–S18 |
| T-023 | Connection detail and contacts list | To do | critical | S19–S24 |
| T-024 | Block and unblock | To do | critical | S25 |
| T-025 | Introduce a connection to another | Needs a decision | medium | S26 |

### Log of the merged tasks

- T-021 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-021 · 2026-10-25 · `tickets/pm/M-02-connections/F-14-connections/S-24-decisions` · story and What updated for D-13 (decline visible) and D-17 (30-day expiry, optional note, ask again at once); flags cleared. Still Blocked · ND-10.
- T-021 · 2026-10-18 · created as the backend half of T-021
- T-021 · 2026-10-18 · created as the frontend half of T-021
- T-022 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-022 · 2026-10-25 · `tickets/pm/M-02-connections/F-14-connections/S-25-decisions` · story S3, S4 and What updated for D-13, D-14 and D-17; flags cleared.
- T-022 · 2026-10-18 · created as the backend half of T-022
- T-022 · 2026-10-18 · created as the frontend half of T-022
- T-023 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-023 · 2026-10-25 · `tickets/pm/M-02-connections/F-14-connections/S-26-decisions` · story S1, S2, S6 and What updated for D-04, D-14 and D-15; flags cleared.
- T-023 · 2026-10-18 · created as the backend half of T-023
- T-023 · 2026-10-18 · created as the frontend half of T-023
- T-024 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-024 · 2026-10-18 · created as the backend half of T-024
- T-024 · 2026-10-18 · created as the frontend half of T-024
- T-025 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-025 · 2026-10-18 · created as the backend half of T-025
- T-025 · 2026-10-18 · created as the frontend half of T-025

## Decisions

- [[ND-10 How Connect addresses the scanned person]] — open (draft); blocks [[S-23 Connections Story|Connections · S8–S12]] and [[S-37 Badge & QR Story|Badge & QR · S13–S18]]
- [[ND-13 Whether the requester sees a declined request]] — decided, the requester sees a decline ([[D-13 The requester sees a declined request|D-13]])
- [[ND-14 Connection-granted Ring on Shared with me]] — decided, Shared with me lists people, never the Ring ([[D-14 Shared with me lists people, never the Ring|D-14]])
- [[ND-15 One Ring or several per connection]] — decided, several Rings per connection, remove or disconnect ([[D-15 Several Rings per connection, remove or disconnect|D-15]])
- [[ND-17 Request expiry, note and asking again]] — decided, 30-day expiry, optional note, ask again at once ([[D-17 Requests expire after 30 days, optional note, ask again at once|D-17]])
- [[ND-23 Mutual connections and events in common]] — open: what s47 may show about the people and events two connections share; blocks [[S-23 Connections Story|Connections · S24]]

## Related

- [[F-09 Ring Members]]
- [[F-08 Ring Access Engine]]
- [[F-12 View As & Pin Views]]
- [[F-18 Badge & QR]]
- [[F-03 Counts]]
- [[F-39 Notifications]]
- [[F-36 Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
