---
id: F-06
type: feature
module: identity
feature: photo-library
name: "Photo Library"
priority: high
release: v1
screens: [s23, s29, s30, s68]
owner: "Omar Fostok"
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/identity, priority/high, release/v1]
---

# Photo Library

**Backend:** Partial (needs more) · **Priority:** High · **Release:** v1 · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-11 Photo Library Story|Story]] · [[FR-06 Photo Library Frontend Requirements|Frontend Requirements]] · [[BD-06 Photo Library Backend Delivery|Backend Delivery]] · [[Photo Library Backend Integration|Backend Integration]] · [[Photo Library Frontend Delivery|Frontend Delivery]] · [[Photo Library QA Backend|QA Backend]] · [[Photo Library QA Frontend|QA Frontend]]

The user's uploaded photos, reusable across Rings, with the Rings that use each photo (s30).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s23|s23]] | Edit · how you appear | The photo entry: Change → s29, Upload → s30 |
| [[Screen Index#s29|s29]] | Photo for this Ring | A picker: the Pin photo or a library photo; "Reset to Pin" waits on the main photo (D-02, not built) |
| [[Screen Index#s30|s30]] | Photo library | Grid with the Rings using each photo; management mode from Me |
| [[Screen Index#s68|s68]] | Me / Account | The "Photo library" row and its count |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-11 Photo Library Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-012 | List my files (photo library) | To do | high | S7 |
| T-013 | Usage count per file across Rings | To do | medium | S8 |

### Log of the merged tasks

- T-012 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-012 · 2026-10-18 · created as the backend half of T-012
- T-012 · 2026-10-18 · created as the frontend half of T-012
- T-013 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-013 · 2026-10-18 · created as the backend half of T-013
- T-013 · 2026-10-18 · created as the frontend half of T-013

## Decisions

- [[ND-02 Base profile work fields]] — decided, one main profile every Ring starts from; a Ring may pick its own photo ([[D-02 One main profile every Ring starts from|D-02]])
- [[ND-05 Copy or inherit]] — decided, inherit per field, copy without members ([[D-05 Inherit per field, copy without members|D-05]])

## Related

- [[F-04 Files Upload]]
- [[F-10 Ring Projection]]
- [[F-07 Profiles & Pin Name]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
