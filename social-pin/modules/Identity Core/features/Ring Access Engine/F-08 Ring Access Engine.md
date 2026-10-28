---
type: feature
id: ring-access
name: "Ring Access Engine"
priority: critical
release: mvp
module: identity
screens: []
created: 2026-10-18
updated: 2026-10-28
owner: "omar"
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Ring Access Engine

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-15 Ring Access Engine Story|Story]] · [[FR-08 Ring Access Engine Frontend Requirements|Frontend Requirements]] · [[BD-08 Ring Access Engine Backend Delivery|Backend Delivery]] · [[BI-05 Ring Access Engine Backend Integration|Backend Integration]] · [[Ring Access Engine Frontend Delivery|Frontend Delivery]] · [[Ring Access Engine QA Backend|QA Backend]] · [[Ring Access Engine QA Frontend|QA Frontend]]

`RingAccessService`: the one place that decides whether a viewer may see something. Every read path, and every future feature (events, meetings, chat, posts, Gemma), routes through it.

## Design reference

_No prototype screen. This is a backend-only concern._

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
