---
type: task
id: T-020b
status: needs-info
priority: medium
effort: L
feature: onboarding-imports
module: identity
screens: [s03a, s03b]
depends: [D-02]
created: 2026-10-15
updated: 2026-10-26
owner: "omar"
tags: [task, task/needs-info, module/identity, priority/medium]
---

# ❓ T-020b · Business card scan and portfolio URL import

**Feature:** [[Onboarding Imports]] · **Status:** Needs a decision / info · **Priority:** Medium · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-020b-fe Frontend · Business card scan and portfolio URL import|Frontend]] · [[T-020b-be Backend · Business card scan and portfolio URL import|Backend]] · **Story:** [[T-020b Story]]

## What

Provider decision (OCR, scraping). Same review step as T-020, writing to the main profile ([[DR-02 One main profile every Ring starts from]]).

## Design

- [[Screen Index#s03a|s03a]] Scan a card
- [[Screen Index#s03b|s03b]] Portfolio URL

## Dependencies

- Waited on decision [[Base profile work fields]], decided by [[DR-02 One main profile every Ring starts from]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · D-02 decided ([[DR-02 One main profile every Ring starts from]]); What and Dependencies updated, flag cleared. The provider choice (OCR, scraping) is still open.
