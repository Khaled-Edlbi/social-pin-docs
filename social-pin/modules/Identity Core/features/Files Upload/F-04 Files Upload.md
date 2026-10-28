---
type: feature
id: files
name: "Files Upload"
priority: high
release: v1
module: identity
screens: [s14, s20, s36]
related: ["F-11 Rings"]
created: 2026-10-18
updated: 2026-10-28
tags: [feature, module/identity, priority/high, release/v1]
---

# Files Upload

**Backend:** Done · **Priority:** High · **Release:** v1 · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-06 Files Upload Story|Story]] · [[FR-04 Files Upload Frontend Requirements|Frontend Requirements]] · [[BD-04 Files Upload Backend Delivery|Backend Delivery]] · [[BI-03 Files Upload Backend Integration|Backend Integration]] · [[Files Upload Frontend Delivery|Frontend Delivery]] · [[Files Upload QA Backend|QA Backend]] · [[Files Upload QA Frontend|QA Frontend]]

Multipart upload with type and size checks, metadata read, delete. A file becomes visible only when a reachable context (a Ring projection) references it.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s14|s14]] | Ring data |  |
| [[Screen Index#s20|s20]] | New Ring · step 3 (what it shows) | Field library → ND-03 |
| [[Screen Index#s36|s36]] | Add to this Ring |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-06 Files Upload Story]] — upload, attach and delete (S1–S6) and showing files (S7–S11, formerly T-062, waiting on [[ND-16 Viewer access to file bytes]]).

## Related

- [[F-06 Photo Library]]
- [[F-10 Ring Projection]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
