---
type: feature
id: onboarding-imports
name: "Onboarding Imports"
status: todo
priority: P1
domain: identity
screens: [s03, s03a, s03b, s04, s05]
updated: 2026-10-15
tags: [feature, status/todo, domain/identity, priority/P1]
---

# ❌ Onboarding Imports

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

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

## Backend state

**Endpoints:** none yet.

**Tables / models:** `SocialIdentity`

### Gaps

- Imported fields populate the **base profile**, which feeds the first Ring: blocked on [[D-02 Base profile work fields]].
- Card OCR and URL scraping need a provider decision.
- A review step with include / skip per field before anything is written.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-020 LinkedIn import → review → base profile]] | ⛔ Blocked | P1 | L |
| [[T-020b Business card scan and portfolio URL import]] | ❓ Needs a decision / info | P2 | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "onboarding-imports" SORT priority ASC
```

## Open decisions

- [[D-02 Base profile work fields]]

## Related

- [[Linked Accounts (OAuth)]]
- [[Profiles & Pin Name]]
- [[Ring Projection]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
