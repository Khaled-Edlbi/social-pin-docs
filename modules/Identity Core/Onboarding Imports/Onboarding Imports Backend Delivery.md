---
type: backend-delivery
code: onboarding-imports
scope: feature
feature: onboarding-imports
module: identity
status: todo
screens: [s03, s03a, s03b, s04, s05]
created: 2026-10-18
updated: 2026-10-26
tags: [backend-delivery, backend-delivery/todo, module/identity, layer/backend]
---

# ⬜ Onboarding Imports · Backend Delivery

> ⚠ Affected by [[DR-02 One main profile every Ring starts from]] (2026-10-25): D-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

**Feature:** [[Onboarding Imports]] · **Status:** To do · **Integration guide:** [[Onboarding Imports Backend Integration]] · **Requirements:** [[Onboarding Imports Frontend Requirements]] · **QA:** [[Onboarding Imports QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `SocialIdentity`

### Gaps

- Imported fields populate the **base profile**, which feeds the first Ring: blocked on [[D-02 Base profile work fields]].
- Card OCR and URL scraping need a provider decision.
- A review step with include / skip per field before anything is written.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Onboarding Imports]] when the vault moved to layers
