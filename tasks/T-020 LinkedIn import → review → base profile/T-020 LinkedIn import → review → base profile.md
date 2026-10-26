---
type: task
id: T-020
status: todo
priority: high
effort: L
feature: onboarding-imports
module: identity
screens: [s04, s05]
depends: [T-019, "DR-02 One main profile every Ring starts from"]
created: 2026-10-15
updated: 2026-10-26
owner: "Omar Fostok"
tags: [task, task/todo, module/identity, priority/high]
---

# ⬜ T-020 · LinkedIn import → review → base profile

**Feature:** [[Onboarding Imports]] · **Status:** To do · **Priority:** High · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-020-fe Frontend · LinkedIn import → review → base profile|Frontend]] · [[T-020-be Backend · LinkedIn import → review → base profile|Backend]] · **Story:** [[T-020 Story]]

## What

Import endpoint returns candidate fields; confirm endpoint writes the chosen ones to the main profile (headline, role, company, location, photo, bio: [[DR-02 One main profile every Ring starts from]]), which every Ring then inherits field by field.

## Design

- [[Screen Index#s04|s04]] Importing
- [[Screen Index#s05|s05]] Review import

## Dependencies

- Waits on [[T-019 LinkedIn OAuth link, unlink, login]]
- Waited on decision [[Base profile work fields]], decided by [[DR-02 One main profile every Ring starts from]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · D-02 decided ([[DR-02 One main profile every Ring starts from]]); What and Dependencies updated, flag cleared. Still waits on T-019.
- 2026-10-26 · `tickets/pm/…/S-09-depends-dr-02` · `depends` points at the decision record DR-02 instead of D-02; the hand-typed `blocked` removed: the build shows it blocked by T-019, the one real blocker.
