---
type: feature
id: ring-members
name: "Ring Members"
priority: critical
release: mvp
module: identity
screens: [s15, s16, s35, s46, s47]
related: ["F-12 View As & Pin Views"]
created: 2026-10-18
updated: 2026-10-29
owner: "Omar Fostok"
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Ring Members

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-16 Ring Members Story|Story]] · [[FR-09 Ring Members Frontend Requirements|Frontend Requirements]] · [[BD-09 Ring Members Backend Delivery|Backend Delivery]] · [[BI-06 Ring Members Backend Integration|Backend Integration]] · [[Ring Members Frontend Delivery|Frontend Delivery]] · [[Ring Members QA Backend|QA Backend]] · [[Ring Members QA Frontend|QA Frontend]]

The owner's roster of a Ring: list and search it, add people, approve those who asked to join, set each person's access window, bring people in from another Ring, choose which of my Rings someone is in, remove them. When a Ring lets members see each other, its members see the others.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s15|s15]] | Ring people | The roster: search, All / Pending, waiting join requests, "Move from a Ring"; backend done for the owner's actions, names and search not yet |
| [[Screen Index#s47|s47]] | Connection detail | A checklist of my Rings, with an access window per Ring; add / remove done, one person's Rings in one call and disconnect not yet |
| [[Screen Index#s16|s16]] | My Rings | Used as the picker for "Move from a Ring" (the steps after it aren't drawn) |
| [[Screen Index#s35|s35]] | Scanner | "Scan someone in" from s15 ([[F-18 Badge & QR]]) |
| [[Screen Index#s46|s46]] | Accept · pick a Ring | "Add" from s15, once the connect flow ships ([[F-14 Connections]]) |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Connection screens|§5.1 Connection screens]], [[Wireframe Brief#Connection motion & states|§5.2 Connection motion & states]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **One person can be in several of my Rings**; they see the version from the Ring they were put in first ([[D-15 Several Rings per connection, remove or disconnect]]).
- **Removing someone from the last of my Rings asks**: *Remove from Rings* keeps them a connection with no access, *Disconnect* ends the connection.
- **The roster is the owner's**: members see each other only when the Ring's "members can see each other" is on, and then with full cards ([[D-04 Ring settings at launch and their defaults]]).
- **A member never learns which Ring they are in** ([[D-14 Shared with me lists people, never the Ring]]), unless they joined it knowingly (invitation, code, work email); a membership records how it was created, and a person the owner added, accepted or reassigned is never told the Ring's name ([[D-18 Ring names shown when joined knowingly]]).
- Not built yet: the choice at the last removal and the members-see-each-other setting.

## Decisions

- [[ND-04 Ring settings]] — decided, six settings at launch with private defaults ([[D-04 Ring settings at launch and their defaults|D-04]])
- [[ND-14 Connection-granted Ring on Shared with me]] — decided, Shared with me lists people, never the Ring ([[D-14 Shared with me lists people, never the Ring|D-14]])
- [[ND-15 One Ring or several per connection]] — decided, several Rings per connection, remove or disconnect ([[D-15 Several Rings per connection, remove or disconnect|D-15]])

## Related

- [[F-11 Rings]]
- [[F-08 Ring Access Engine]]
- [[F-14 Connections]]
- [[F-16 Delegated Admins]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
