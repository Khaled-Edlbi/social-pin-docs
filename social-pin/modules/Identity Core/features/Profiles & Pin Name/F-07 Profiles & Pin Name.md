---
id: F-07
type: feature
module: identity
feature: profiles
name: "Profiles & Pin Name"
priority: critical
release: mvp
screens: [s05b, s06, s23, s44, s68]
owner: "Omar Fostok"
created: 2026-10-18
updated: 2026-10-29
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Profiles & Pin Name

**Backend:** Done · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-14 Profiles & Pin Name Story|Story]] · [[FR-07 Profiles & Pin Name Frontend Requirements|Frontend Requirements]] · [[BD-07 Profiles & Pin Name Backend Delivery|Backend Delivery]] · [[BI-04 Profiles & Pin Name Backend Integration|Backend Integration]] · [[Profiles & Pin Name Frontend Delivery|Frontend Delivery]] · [[Profiles & Pin Name QA Backend|QA Backend]] · [[Profiles & Pin Name QA Frontend|QA Frontend]]

One profile per person: the full name, the nickname, the main profile every Ring starts from, the `!`-prefixed unique Pin name with a public live availability check, and the sensitive base fields (birthdate, gender, marital status) that Rings opt into. Several profiles per account (Personal, Professional, Business) are **later**, not in v1: the backend supports them, the app uses the default profile only, and a business identity is a company ([[F-15 Companies]]).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s05b|s05b]] | Profile basics | Built in the app, not drawn in the prototype: name required; photo, headline, company, location optional |
| [[Screen Index#s06|s06]] | Claim your Pin | Availability check done; yearly rename + suggestions decided ([[D-06 Yearly rename, old name freed, case-insensitive|D-06]]), not built; the public page behind "socialpin.me/<handle>" waits on [[ND-22 Public web page by Pin name|ND-22]] |
| [[Screen Index#s68|s68]] | Me / Account | The header opens the profile editor (not drawn yet); privacy rows done |
| [[Screen Index#s23|s23]] | Edit · how you appear | "Inherit from your Pin" means the main profile's values |
| [[Screen Index#s44|s44]] | Scanned Pin | How others find you by Pin name (the look-up is [[F-12 View As & Pin Views]]') |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **One main profile every Ring starts from**: headline, role, company, location, photo and bio, and nothing more. Full name is the same in every Ring; the other fields a Ring may change for itself ([[D-02 One main profile every Ring starts from]]). Not built yet: `Profile` has none of these fields today.
- A Pin name can be **changed once a year**; the old name is **free for anyone** at the rename, with no redirect ([[D-06 Yearly rename, old name freed, case-insensitive]]). Not built yet: renames are unlimited today.
- Pin names **ignore capitals**: `Omar.Fostok` and `omar.fostok` are one name.
- When a name is taken, **suggestions come only from the person's own name**; the availability check never reveals who holds a name.
- **One profile per person in v1.** Several profiles per account are later.

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
