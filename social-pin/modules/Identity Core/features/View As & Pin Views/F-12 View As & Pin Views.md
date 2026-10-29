---
type: feature
id: view-as
name: "View As & Pin Views"
priority: critical
release: mvp
module: identity
screens: [s10, s31, s44, s62]
created: 2026-10-18
updated: 2026-10-29
owner: "Omar Fostok"
tags: [feature, module/identity, priority/critical, release/mvp]
---

# View As & Pin Views

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-19 View As & Pin Views Story|Story]] · [[FR-12 View As & Pin Views Frontend Requirements|Frontend Requirements]] · [[BD-12 View As & Pin Views Backend Delivery|Backend Delivery]] · [[BI-09 View As & Pin Views Backend Integration|Backend Integration]] · [[View As & Pin Views Frontend Delivery|Frontend Delivery]] · [[View As & Pin Views QA Backend|QA Backend]] · [[View As & Pin Views QA Frontend|QA Frontend]]

The viewer-facing read path: open someone by Pin name, render one Ring (QR scan and the owner's "View as", with the owner's own "where each field goes" face), and list every perspective you hold of one person. **Photos and files load from signed links that expire in 15 minutes** ([[D-16 Files load from signed links that expire in 15 minutes]]): the view carries the links, never a file id.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s10|s10]] | View as teaser | The View as component on the new Ring and Public, both faces |
| [[Screen Index#s31|s31]] | View as (flip) | Audience face and owner face ("where each field goes"); read part done |
| [[Screen Index#s44|s44]] | Scanned Pin | Read part done; photo and files from signed links (D-16, not built); Save contact; Connect and Block todo |
| [[Screen Index#s62|s62]] | Post-event summary | Never previews an expired Ring with the view route (S6) |

Wireframe brief sections: [[Wireframe Brief#Core product concept|§1 Core product concept]], [[Wireframe Brief#View as|§4.3 View as]], [[Wireframe Brief#QR scan|§4.5 QR scan]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Related

- [[F-08 Ring Access Engine]]
- [[F-10 Ring Projection]]
- [[F-18 Badge & QR]]
- [[F-14 Connections]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
