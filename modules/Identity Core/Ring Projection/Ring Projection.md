---
type: feature
id: ring-projection
name: "Ring Projection"
priority: critical
module: identity
screens: [s14, s20, s23, s24, s25, s29, s36]
updated: 2026-10-25
owner: "omar"
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
| [[Screen Index#s20|s20]] | New Ring · step 3 (what it shows) | Field library decided (DR-03), not built |
| [[Screen Index#s23|s23]] | Edit · how you appear | Inherit decided (DR-05, DR-02), not built |
| [[Screen Index#s24|s24]] | Edit · what it shows | "4 of 7 on" decided (DR-03), not built |
| [[Screen Index#s25|s25]] | Edit · social profiles |  |
| [[Screen Index#s29|s29]] | Photo for this Ring | "Reset to Pin" decided (DR-02, DR-05), not built |
| [[Screen Index#s36|s36]] | Add to this Ring |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]], [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- A Ring shows the **main profile** unless it changed a field for itself; it may change headline, company, location, photo and bio, never the full name ([[DR-02 One main profile every Ring starts from]]).
- **Inheritance is per field**: editing one field in a Ring stops that field only from following the main profile; "Reset to Pin" returns it ([[DR-05 Inherit per field, copy without members]]). A Ring that changed a field keeps its value when the main one changes.
- **Links are entered once** and each Ring only switches them **on or off**; a link never has a different value in different Rings ([[DR-03 Links entered once, switched on or off per Ring]]). The type is detected from the pasted link; booking, Behance, Dribbble, GitHub and YouTube join today's types.
- Not built yet: today each Ring keeps its own copy of every link and info block, and there is no main profile to inherit from.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-058 Decide field library vs per-Ring copies]] | ✅ Done | Critical | S |
| [[T-060 Decide copy or inherit]] | ✅ Done | High | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-projection" SORT priority ASC
```

## Decisions

- [[D-02 Base profile work fields]] — decided, one main profile every Ring starts from ([[DR-02 One main profile every Ring starts from|DR-02]])
- [[D-03 Field library vs per-Ring copies]] — decided, links entered once, on or off per Ring ([[DR-03 Links entered once, switched on or off per Ring|DR-03]])
- [[D-05 Copy or inherit]] — decided, inherit per field, copy without members ([[DR-05 Inherit per field, copy without members|DR-05]])

## Related

- [[Rings]]
- [[View As & Pin Views]]
- [[Files Upload]]
- [[Widgets]]
- [[Profiles & Pin Name]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
