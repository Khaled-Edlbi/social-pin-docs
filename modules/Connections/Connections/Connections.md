---
type: feature
id: connections
name: "Connections"
priority: critical
release: mvp
module: connections
screens: [s44, s45, s46, s47, s62]
related: ["Rings"]
updated: 2026-10-25
owner: "omar"
tags: [feature, module/connections, priority/critical, release/mvp]
---

# Connections

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[Connections Module|Connections]]

**Layers:** [[Connections Story|Story]] · [[Connections Frontend Requirements|Frontend Requirements]] · [[Connections Backend Delivery|Backend Delivery]] · [[Connections Backend Integration|Backend Integration]] · [[Connections Frontend Delivery|Frontend Delivery]] · [[Connections QA Backend|QA Backend]] · [[Connections QA Frontend|QA Frontend]]

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

- A request is pending, accepted, declined, cancelled or expired, and **the requester sees each of these**: a decline is shown as declined ([[DR-13 The requester sees a declined request]]). A block still reads as "This profile isn't available to you", never as a decline.
- **A request expires after 30 days** unanswered; it **may carry an optional note** of up to 200 characters; after a decline or an expiry the requester **can ask again straight away** ([[DR-17 Requests expire after 30 days, optional note, ask again at once]]).
- **The requester never learns which Ring they were accepted into**; Shared with me lists people, never Rings ([[DR-14 Shared with me lists people, never the Ring]]).
- **One person can be in several of my Rings** and sees the version from the Ring they were put in first. Removing them from my last Ring offers *Remove from Rings* (still a connection, no access) or *Disconnect* (the connection ends) ([[DR-15 Several Rings per connection, remove or disconnect]]).
- Not built yet: the connection request flow is TODO.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-021 Connect request send, inbox, cancel]] | ⬜ To do | Critical | M |
| [[T-022 Accept into a Ring (sets grantedRingId)]] | ⬜ To do | Critical | M |
| [[T-023 Connection detail and contacts list]] | ⬜ To do | Critical | M |
| [[T-024 Block and unblock]] | ⬜ To do | Critical | S |
| [[T-025 Introduce a connection to another]] | ❓ Needs a decision / info | Medium | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "connections" SORT priority ASC
```

## Decisions

- [[D-10 How Connect addresses the scanned person]] — open (draft); blocks [[T-021 Story]] and [[T-008 Story]]
- [[D-13 Whether the requester sees a declined request]] — decided, the requester sees a decline ([[DR-13 The requester sees a declined request|DR-13]])
- [[D-14 Connection-granted Ring on Shared with me]] — decided, Shared with me lists people, never the Ring ([[DR-14 Shared with me lists people, never the Ring|DR-14]])
- [[D-15 One Ring or several per connection]] — decided, several Rings per connection, remove or disconnect ([[DR-15 Several Rings per connection, remove or disconnect|DR-15]])
- [[D-17 Request expiry, note and asking again]] — decided, 30-day expiry, optional note, ask again at once ([[DR-17 Requests expire after 30 days, optional note, ask again at once|DR-17]])

## Related

- [[Ring Members]]
- [[Ring Access Engine]]
- [[View As & Pin Views]]
- [[Badge & QR]]
- [[Counts]]
- [[Notifications]]
- [[Gemma AI]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
