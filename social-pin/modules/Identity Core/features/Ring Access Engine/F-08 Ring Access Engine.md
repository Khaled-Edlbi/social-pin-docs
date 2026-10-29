---
id: F-08
type: feature
module: identity
feature: ring-access
name: "Ring Access Engine"
priority: critical
release: mvp
screens: [s15, s16, s17, s26, s27, s44, s47, s62]
owner: "Omar Fostok"
created: 2026-10-18
updated: 2026-10-29
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Ring Access Engine

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-15 Ring Access Engine Story|Story]] · [[FR-08 Ring Access Engine Frontend Requirements|Frontend Requirements]] · [[BD-08 Ring Access Engine Backend Delivery|Backend Delivery]] · [[BI-05 Ring Access Engine Backend Integration|Backend Integration]] · [[Ring Access Engine Frontend Delivery|Frontend Delivery]] · [[Ring Access Engine QA Backend|QA Backend]] · [[Ring Access Engine QA Frontend|QA Frontend]]

`RingAccessService`: the one place that decides whether a viewer may see something. Every read path, and every future feature (events, meetings, chat, posts, Gemma), routes through it.

## Design reference

The engine has **no screen of its own**: it's a backend-only concern. These are the screens **its promises show on**, owned by other features; each must keep the promise beside it ([[S-15 Ring Access Engine Story]]):

| Screen | Name | The promise it must keep |
|---|---|---|
| [[Screen Index#s17|s17]] | Shared with me | One row per person; a Ring's name only when joined knowingly; a count only when members can see each other (S1) |
| [[Screen Index#s44|s44]] | Scanned Pin | You see one Ring's version, never which Ring; one "not available" for every refusal (S1, S7) |
| [[Screen Index#s16|s16]] | My Rings | Membership is private to the owner; expiry computed for the owner (S2) |
| [[Screen Index#s47|s47]] | Connection detail | A move between Rings is live; mutual connections wait on [[ND-23 Mutual connections and events in common|ND-23]] (S3) |
| [[Screen Index#s62|s62]] | Post-event summary | An expired Ring stays editable by its owner, never previewed (S5) |
| [[Screen Index#s26|s26]] | Edit · access | Admins below the level see no editing; settings are enforced (S6, S8) |
| [[Screen Index#s27|s27]] | Edit · permissions | D-04's settings and join choices; no switch that saves nothing (S8) |
| [[Screen Index#s15|s15]] | Ring people | The roster footnote tells the truth about "members can see each other" (S8) |

Wireframe brief sections: [[Wireframe Brief#Core product concept|§1 Core product concept]], [[Wireframe Brief#Connections & networking|§5 Connections & networking]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Decisions

- [[ND-04 Ring settings]] — decided, six settings at launch with private defaults ([[D-04 Ring settings at launch and their defaults|D-04]])

## Related

- [[F-11 Rings]]
- [[F-09 Ring Members]]
- [[F-12 View As & Pin Views]]
- [[F-14 Connections]]
- [[F-23 Events During]]
- [[F-26 Meetings]]
- [[F-20 PinCast & Nearby]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
