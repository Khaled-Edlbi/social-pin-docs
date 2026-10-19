---
type: feature
id: ring-projection
name: "Ring Projection"
priority: critical
module: identity
screens: [s14, s20, s23, s24, s25, s29, s36]
updated: 2026-10-19
tags: [feature, module/identity, priority/critical]
---

# Ring Projection

**Backend:** Done · **Priority:** Critical · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Ring Projection Story|Story]] · [[Ring Projection Frontend Requirements|Frontend Requirements]] · [[Ring Projection Backend Delivery|Backend Delivery]] · [[Ring Projection Backend Integration|Backend Integration]] · [[Ring Projection Frontend Delivery|Frontend Delivery]] · [[Ring Projection QA Backend|QA Backend]] · [[Ring Projection QA Frontend|QA Frontend]]

What a Ring shows: photo, bio, nickname, theme, social and contact links, info blocks ("Add a field"), file attachments, and the per-Ring opt-ins for birthdate, gender, marital status, phone and email.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s14|s14]] | Ring data |  |
| [[Screen Index#s20|s20]] | New Ring · step 3 (what it shows) | Field library → D-03 |
| [[Screen Index#s23|s23]] | Edit · how you appear | Inherit → D-05 / D-02 |
| [[Screen Index#s24|s24]] | Edit · what it shows | "4 of 7 on" → D-03 |
| [[Screen Index#s25|s25]] | Edit · social profiles |  |
| [[Screen Index#s29|s29]] | Photo for this Ring | "Reset to Pin" → D-02 |
| [[Screen Index#s36|s36]] | Add to this Ring |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]], [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-058 Decide field library vs per-Ring copies]] | ❓ Needs a decision / info | Critical | S |
| [[T-060 Decide copy or inherit]] | ❓ Needs a decision / info | High | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-projection" SORT priority ASC
```

## Open decisions

- [[D-02 Base profile work fields]]
- [[D-03 Field library vs per-Ring copies]]
- [[D-05 Copy or inherit]]

## Related

- [[Rings]]
- [[View As & Pin Views]]
- [[Files Upload]]
- [[Widgets]]
- [[Profiles & Pin Name]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
