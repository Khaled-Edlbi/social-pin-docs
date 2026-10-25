---
type: task
id: T-020
status: blocked
priority: high
effort: L
feature: onboarding-imports
module: identity
screens: [s04, s05]
depends: [T-019, D-02]
created: 2026-10-15
updated: 2026-10-25
owner: "omar"
tags: [task, task/blocked, module/identity, priority/high]
---

# ⛔ T-020 · LinkedIn import → review → base profile

**Feature:** [[Onboarding Imports]] · **Status:** Blocked · **Priority:** High · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-020-fe Frontend · LinkedIn import → review → base profile|Frontend]] · [[T-020-be Backend · LinkedIn import → review → base profile|Backend]] · **Story:** [[T-020 Story]]

## What

Import endpoint returns candidate fields; confirm endpoint writes the chosen ones to the main profile (headline, role, company, location, photo, bio: [[DR-02 One main profile every Ring starts from]]), which every Ring then inherits field by field.

## Design

- [[Screen Index#s04|s04]] Importing
- [[Screen Index#s05|s05]] Review import

## Dependencies

- Waits on [[T-019 LinkedIn OAuth link, unlink, login]]
- Waited on decision [[D-02 Base profile work fields]], decided by [[DR-02 One main profile every Ring starts from]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · D-02 decided ([[DR-02 One main profile every Ring starts from]]); What and Dependencies updated, flag cleared. Still waits on T-019.
