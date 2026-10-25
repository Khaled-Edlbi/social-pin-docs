---
type: feature
id: ring-members
name: "Ring Members"
priority: critical
release: mvp
module: identity
screens: [s15, s47]
related: ["View As & Pin Views"]
updated: 2026-10-25
owner: "omar"
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Ring Members

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Ring Members Story|Story]] · [[Ring Members Frontend Requirements|Frontend Requirements]] · [[Ring Members Backend Delivery|Backend Delivery]] · [[Ring Members Backend Integration|Backend Integration]] · [[Ring Members Frontend Delivery|Frontend Delivery]] · [[Ring Members QA Backend|QA Backend]] · [[Ring Members QA Frontend|QA Frontend]]

The owner's roster of a Ring: list, add, edit the access window, move someone to another Ring live, revoke.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s15|s15]] | Ring people |  |
| [[Screen Index#s47|s47]] | Connection detail | Reassign / revoke done; detail todo |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Connection screens|§5.1 Connection screens]], [[Wireframe Brief#Connection motion & states|§5.2 Connection motion & states]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **One person can be in several of my Rings**; they see the version from the Ring they were put in first ([[DR-15 Several Rings per connection, remove or disconnect]]).
- **Removing someone from the last of my Rings asks**: *Remove from Rings* keeps them a connection with no access, *Disconnect* ends the connection.
- **The roster is the owner's**: members see each other only when the Ring's "members can see each other" is on, and then with full cards ([[DR-04 Ring settings at launch and their defaults]]).
- **A member never learns which Ring they are in** ([[DR-14 Shared with me lists people, never the Ring]]).
- Not built yet: the choice at the last removal and the members-see-each-other setting.

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-members" SORT priority ASC
```

## Decisions

- [[D-04 Ring settings]] — decided, six settings at launch with private defaults ([[DR-04 Ring settings at launch and their defaults|DR-04]])
- [[D-14 Connection-granted Ring on Shared with me]] — decided, Shared with me lists people, never the Ring ([[DR-14 Shared with me lists people, never the Ring|DR-14]])
- [[D-15 One Ring or several per connection]] — decided, several Rings per connection, remove or disconnect ([[DR-15 Several Rings per connection, remove or disconnect|DR-15]])

## Related

- [[Rings]]
- [[Ring Access Engine]]
- [[Connections]]
- [[Delegated Admins]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
