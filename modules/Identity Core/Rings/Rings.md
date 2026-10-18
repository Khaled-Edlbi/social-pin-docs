---
type: feature
id: rings
name: "Rings"
priority: P0
module: identity
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
updated: 2026-10-18
tags: [feature, module/identity, priority/P0]
---

# Rings

**Backend:** Done · **Priority:** P0 · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Rings Story|Story]] · [[Rings Frontend Requirements|Frontend Requirements]] · [[Rings Backend Delivery|Backend Delivery]] · [[Rings Backend Integration|Backend Integration]] · [[Rings Frontend Delivery|Frontend Delivery]] · [[Rings QA Backend|QA Backend]] · [[Rings QA Frontend|QA Frontend]]

My Rings and Shared-with-me lists, create a Ring with name, colour, type, expiry and temporary flag, edit, set default, delete, and the keep / merge / auto-delete disposition for temporary Rings.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s08|s08]] | First Ring | Default Ring is created by complete-registration |
| [[Screen Index#s09|s09]] | Create first Ring |  |
| [[Screen Index#s16|s16]] | My Rings |  |
| [[Screen Index#s17|s17]] | Shared with me | List done; review / decline invite todo |
| [[Screen Index#s18|s18]] | New Ring · step 1 | Copy a Ring → D-05 |
| [[Screen Index#s19|s19]] | New Ring · step 2 (who is in it) | Audience settings → D-04 |
| [[Screen Index#s20|s20]] | New Ring · step 3 (what it shows) | Field library → D-03 |
| [[Screen Index#s21|s21]] | New Ring · step 4 (how you appear) |  |
| [[Screen Index#s22|s22]] | Edit · name & purpose | Purpose → D-04 |
| [[Screen Index#s26|s26]] | Edit · access | Settings → D-04 |
| [[Screen Index#s62|s62]] | Post-event summary | Keep / merge / expire done |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Post-event|§8.5 Post-event]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-059 Decide Ring settings]] | ❓ Needs a decision / info | P0 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "rings" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]
- [[D-05 Copy or inherit]]

## Related

- [[Ring Members]]
- [[Ring Projection]]
- [[Ring Access Engine]]
- [[Counts]]
- [[Delegated Admins]]
- [[Ring Invitations & Join]]
- [[Event Ring Auto-creation]]
- [[Cleanup Jobs]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
