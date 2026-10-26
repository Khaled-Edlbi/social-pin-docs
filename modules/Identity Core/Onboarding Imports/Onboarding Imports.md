---
type: feature
id: onboarding-imports
name: "Onboarding Imports"
priority: high
release: mvp
module: identity
screens: [s03, s03a, s03b, s04, s05]
related: ["Files Upload"]
created: 2026-10-15
updated: 2026-10-26
owner: "omar"
tags: [feature, module/identity, priority/high, release/mvp]
---

# Onboarding Imports

**Backend:** TODO · **Priority:** High · **Release:** MVP · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Onboarding Imports Story|Story]] · [[Onboarding Imports Frontend Requirements|Frontend Requirements]] · [[Onboarding Imports Backend Delivery|Backend Delivery]] · [[Onboarding Imports Backend Integration|Backend Integration]] · [[Onboarding Imports Frontend Delivery|Frontend Delivery]] · [[Onboarding Imports QA Backend|QA Backend]] · [[Onboarding Imports QA Frontend|QA Frontend]]

Start from an import: LinkedIn OAuth → importing → review fields (s04, s05), scan a paper business card (s03a), import from a portfolio or Behance URL (s03b). Only `SocialIdentity` has a table.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s03|s03]] | Start from |  |
| [[Screen Index#s03a|s03a]] | Scan a card |  |
| [[Screen Index#s03b|s03b]] | Portfolio URL |  |
| [[Screen Index#s04|s04]] | Importing |  |
| [[Screen Index#s05|s05]] | Review import | Needs base profile → D-02 |

Wireframe brief sections: [[Wireframe Brief#LinkedIn profile import|§3.3 LinkedIn profile import]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-020 LinkedIn import → review → base profile]] | ⛔ Blocked | High | L |
| [[T-020b Business card scan and portfolio URL import]] | ⛔ Blocked · D-20 | Medium | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "onboarding-imports" SORT priority ASC
```

## Decisions

- [[D-02 Base profile work fields]] — decided, one main profile every Ring starts from; imports fill it ([[DR-02 One main profile every Ring starts from|DR-02]])
- [[D-20 How a business card and a portfolio page are read]] — open: on the phone or on the server, and what each import reads; blocks [[T-020b Business card scan and portfolio URL import|T-020b]]

## Related

- [[Linked Accounts (OAuth)]]
- [[Profiles & Pin Name]]
- [[Ring Projection]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
