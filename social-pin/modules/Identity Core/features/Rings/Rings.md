---
type: feature
id: rings
name: "Rings"
priority: critical
release: mvp
module: identity
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
created: 2026-10-18
updated: 2026-10-27
owner: "omar"
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Rings

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Rings Story|Story]] · [[Rings Frontend Requirements|Frontend Requirements]] · [[Rings Backend Delivery|Backend Delivery]] · [[Rings Backend Integration|Backend Integration]] · [[Rings Frontend Delivery|Frontend Delivery]] · [[Rings QA Backend|QA Backend]] · [[Rings QA Frontend|QA Frontend]]

My Rings and Shared-with-me lists, create a Ring with name, colour, type, expiry and temporary flag, edit, set default, delete, and the keep / merge / auto-delete disposition for temporary Rings.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s08|s08]] | First Ring | Default Ring is created by complete-registration |
| [[Screen Index#s09|s09]] | Create first Ring |  |
| [[Screen Index#s16|s16]] | My Rings |  |
| [[Screen Index#s17|s17]] | Shared with me | List done; review / decline invite todo |
| [[Screen Index#s18|s18]] | New Ring · step 1 | Copy a Ring decided (D-05), not built |
| [[Screen Index#s19|s19]] | New Ring · step 2 (who is in it) | Audience settings decided (D-04), not built |
| [[Screen Index#s20|s20]] | New Ring · step 3 (what it shows) | Field library decided (D-03), not built |
| [[Screen Index#s21|s21]] | New Ring · step 4 (how you appear) |  |
| [[Screen Index#s22|s22]] | Edit · name & purpose | Purpose decided (D-04), not built |
| [[Screen Index#s26|s26]] | Edit · access | Settings decided (D-04), not built |
| [[Screen Index#s62|s62]] | Post-event summary | Keep / merge / expire done |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Post-event|§8.5 Post-event]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **Six settings at launch**, each defaulting to the private choice: who it's for (empty), who can request to join (**only with a code or by invitation**), **approve each one**, members can see each other (**off**), members can invite others (**off**), members can save attachments (**off**). Required work email domain, "members can message me" and "see when I'm at an event" come later, with companies, messaging and events ([[D-04 Ring settings at launch and their defaults]]).
- The **owner and the Ring's admins** can change a Ring's settings.
- When "members can see each other" is on, members see each other's **full cards**; while it is off, only the owner sees who is in the Ring.
- **A member never learns which Ring they are in**: Shared with me lists the people who share with me, never a Ring's name, colour or type ([[D-14 Shared with me lists people, never the Ring]]). The one exception: a Ring the member **joined knowingly** (an accepted invitation, a code, a verified work email) shows its name; one the owner placed them in never does ([[D-18 Ring names shown when joined knowingly]]).
- **Copying a Ring** copies its fields, bio, photo, colour and settings, **never its members**; afterwards the two are independent ([[D-05 Inherit per field, copy without members]]).
- Not built yet: none of the settings exist on a Ring today, and `GET /rings/shared-with-me` still returns the Ring's name to members.

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[Rings Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-059 | Decide Ring settings | Done | critical | history only |

### Log of the merged tasks

- T-059 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-059 · 2026-10-25 · `tickets/pm/M-01-identity/F-11-rings/T-059-closed` · closed: ND-04 decided by molham on [[D-04 Ring settings at launch and their defaults]]; the empty T-059 Story template retired (a Decide task has no story of its own); flag cleared.

## Decisions

- [[ND-04 Ring settings]] — decided, six settings at launch with private defaults ([[D-04 Ring settings at launch and their defaults|D-04]])
- [[ND-05 Copy or inherit]] — decided, inherit per field, copy without members ([[D-05 Inherit per field, copy without members|D-05]])
- [[ND-14 Connection-granted Ring on Shared with me]] — decided, Shared with me lists people, never the Ring ([[D-14 Shared with me lists people, never the Ring|D-14]])

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
