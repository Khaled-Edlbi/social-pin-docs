---
type: feature
id: view-as
name: "View As & Pin Views"
priority: critical
release: mvp
module: identity
screens: [s10, s31, s44]
created: 2026-10-18
updated: 2026-10-28
tags: [feature, module/identity, priority/critical, release/mvp]
---

# View As & Pin Views

> ⚠ Affected by [[S-19 View As & Pin Views Story]] (2026-10-29): the story now also uses s62 (S6: View as is never used on an expired Ring); s31 has an owner face ("where each field goes") and s44 a Save contact button; photos and files come from D-16's signed links. Ask: `/owner add s62 to View As & Pin Views' screens and say photos and files load from signed links (D-16)`.

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-19 View As & Pin Views Story|Story]] · [[FR-12 View As & Pin Views Frontend Requirements|Frontend Requirements]] · [[BD-12 View As & Pin Views Backend Delivery|Backend Delivery]] · [[BI-09 View As & Pin Views Backend Integration|Backend Integration]] · [[View As & Pin Views Frontend Delivery|Frontend Delivery]] · [[View As & Pin Views QA Backend|QA Backend]] · [[View As & Pin Views QA Frontend|QA Frontend]]

The viewer-facing read path: open someone by Pin name, render one Ring (QR scan and the owner's "View as"), and list every perspective you hold of one person.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s10|s10]] | View as teaser |  |
| [[Screen Index#s31|s31]] | View as (flip) |  |
| [[Screen Index#s44|s44]] | Scanned Pin | Read part done; Connect todo |

Wireframe brief sections: [[Wireframe Brief#Core product concept|§1 Core product concept]], [[Wireframe Brief#View as|§4.3 View as]], [[Wireframe Brief#QR scan|§4.5 QR scan]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Related

- [[F-08 Ring Access Engine]]
- [[F-10 Ring Projection]]
- [[F-18 Badge & QR]]
- [[F-14 Connections]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
