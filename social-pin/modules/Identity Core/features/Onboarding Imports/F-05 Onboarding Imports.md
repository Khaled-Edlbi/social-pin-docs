---
type: feature
id: onboarding-imports
name: "Onboarding Imports"
priority: medium
release: mvp
module: identity
screens: [s03, s03a, s03b, s04, s05]
related: ["F-04 Files Upload"]
created: 2026-10-15
updated: 2026-10-29
owner: "khaled"
tags: [feature, module/identity, priority/medium, release/mvp]
---

# Onboarding Imports

**Backend:** TODO · **Priority:** Medium · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-08 Onboarding Imports Story|Story]] · [[FR-05 Onboarding Imports Frontend Requirements|Frontend Requirements]] · [[BD-05 Onboarding Imports Backend Delivery|Backend Delivery]] · [[Onboarding Imports Backend Integration|Backend Integration]] · [[Onboarding Imports Frontend Delivery|Frontend Delivery]] · [[Onboarding Imports QA Backend|QA Backend]] · [[Onboarding Imports QA Frontend|QA Frontend]]

Start from an import: LinkedIn OAuth → importing → review fields (s04, s05), scan a paper business card (s03a), import from a portfolio or Behance URL (s03b). Only `SocialIdentity` has a table.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s03|s03]] | Start from |  |
| [[Screen Index#s03a|s03a]] | Scan a card |  |
| [[Screen Index#s03b|s03b]] | Portfolio URL |  |
| [[Screen Index#s04|s04]] | Importing |  |
| [[Screen Index#s05|s05]] | Review import | Needs base profile → ND-02 |

Wireframe brief sections: [[Wireframe Brief#LinkedIn profile import|§3.3 LinkedIn profile import]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-08 Onboarding Imports Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-020 | LinkedIn import → review → base profile | To do | high | S7 |
| T-020b | Business card scan and portfolio URL import | To do | medium | S8 |

### Log of the merged tasks

- T-020 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-020 · 2026-10-25 · ND-02 decided ([[D-02 One main profile every Ring starts from]]); What and Dependencies updated, flag cleared. Still waits on Linked Accounts (OAuth) · S7.
- T-020 · 2026-10-26 · `tickets/pm/…/S-09-depends-dr-02` · `depends` points at the decision card D-02 instead of ND-02; the hand-typed `blocked` removed: the build shows it blocked by Linked Accounts (OAuth) · S7, the one real blocker.
- T-020 · 2026-10-18 · created as the backend half of T-020
- T-020 · 2026-10-18 · created as the frontend half of T-020
- T-020b · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-020b · 2026-10-25 · ND-02 decided ([[D-02 One main profile every Ring starts from]]); What and Dependencies updated, flag cleared. The provider choice (OCR, scraping) is still open.
- T-020b · 2026-10-26 · `tickets/pm/…` · ND-21 raised for the open provider question (where the card and the page are read, and what is read); `depends` points at D-02; the hand-typed `needs-info` removed: the build shows it Blocked · ND-21.
- T-020b · 2026-10-18 · created as the backend half of T-020b
- T-020b · 2026-10-18 · created as the frontend half of T-020b

## Decisions

- [[ND-02 Base profile work fields]] — decided, one main profile every Ring starts from; imports fill it ([[D-02 One main profile every Ring starts from|D-02]])
- [[ND-21 How a business card and a portfolio page are read]] — open: on the phone or on the server, and what each import reads; blocks [[S-08 Onboarding Imports Story|T-020b]]

## Related

- [[F-38 Linked Accounts (OAuth)]]
- [[F-07 Profiles & Pin Name]]
- [[F-10 Ring Projection]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
