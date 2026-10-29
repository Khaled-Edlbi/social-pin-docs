---
type: feature
id: profiles
name: "Profiles & Pin Name"
priority: critical
release: mvp
module: identity
screens: [s06]
created: 2026-10-18
updated: 2026-10-28
owner: "omar"
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Profiles & Pin Name

> ⚠ Affected by [[S-14 Profiles & Pin Name Story]] (2026-10-29): the story now covers s05b (*Profile basics*), s06, s23, s44 and s68; `screens:` lists s06 only. One profile per person in v1, so the summary's "Multiple profiles per account" is later. Ask: `/owner add s05b, s23, s44, s68 to Profiles & Pin Name's screens, and say multiple profiles are later`.

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-14 Profiles & Pin Name Story|Story]] · [[FR-07 Profiles & Pin Name Frontend Requirements|Frontend Requirements]] · [[BD-07 Profiles & Pin Name Backend Delivery|Backend Delivery]] · [[BI-04 Profiles & Pin Name Backend Integration|Backend Integration]] · [[Profiles & Pin Name Frontend Delivery|Frontend Delivery]] · [[Profiles & Pin Name QA Backend|QA Backend]] · [[Profiles & Pin Name QA Frontend|QA Frontend]]

Multiple profiles per account, the `!`-prefixed unique Pin name with a public live availability check, and the sensitive base fields (birthdate, gender, marital status) that Rings opt into.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s06|s06]] | Claim your Pin | Availability check done; yearly rename + suggestions decided ([[D-06 Yearly rename, old name freed, case-insensitive|D-06]]), not built |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **One main profile every Ring starts from**: headline, role, company, location, photo and bio, and nothing more. Full name is the same in every Ring; the other fields a Ring may change for itself ([[D-02 One main profile every Ring starts from]]). Not built yet: `Profile` has none of these fields today.
- A Pin name can be **changed once a year**; the old name is **free for anyone** at the rename, with no redirect ([[D-06 Yearly rename, old name freed, case-insensitive]]). Not built yet: renames are unlimited today.
- Pin names **ignore capitals**: `Omar.Fostok` and `omar.fostok` are one name.
- When a name is taken, **suggestions come only from the person's own name**; the availability check never reveals who holds a name.

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-14 Profiles & Pin Name Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-057 | Decide base profile work fields | Done | critical | history only |
| T-061 | Decide Pin name rules | Done | high | history only |
| T-078 | Main profile fields from D-02 | To do | high | S9–S11 |
| T-079 | Enforce the once-a-year Pin name rename | To do | medium | S12–S13 |

### Log of the merged tasks

- T-057 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-057 · 2026-10-25 · `tickets/pm/M-01-identity/F-07-profiles/T-057-closed` · closed: ND-02 decided by molham on [[D-02 One main profile every Ring starts from]]; the empty T-057 Story template retired (a Decide task has no story of its own); flag cleared.
- T-061 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-061 · 2026-10-25 · `tickets/pm/M-01-identity/F-07-profiles/T-061-closed` · closed: ND-06 decided by molham on [[D-06 Yearly rename, old name freed, case-insensitive]]; the empty T-061 Story template retired (a Decide task has no story of its own); flag cleared.
- T-078 · 2026-10-26 · created with --scaffold task
- T-078 · 2026-10-26 · created as the backend half of T-078
- T-078 · 2026-10-26 · created as the frontend half of T-078
- T-079 · 2026-10-26 · created with --scaffold task

## Decisions

- [[ND-02 Base profile work fields]] — decided, one main profile every Ring starts from ([[D-02 One main profile every Ring starts from|D-02]])
- [[ND-06 Pin name rules]] — decided, yearly rename, old name freed, case-insensitive ([[D-06 Yearly rename, old name freed, case-insensitive|D-06]])
- [[ND-22 Public web page by Pin name]] — open: whether `socialpin.me/<pinName>` is a real page, what a visitor sees, and what happens after a rename; blocks [[S-14 Profiles & Pin Name Story]] (S1's link)

## Related

- [[F-02 Auth & Sign-up]]
- [[F-10 Ring Projection]]
- [[F-05 Onboarding Imports]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
