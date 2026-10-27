---
type: task
id: T-020
status: todo
priority: high
effort: L
feature: onboarding-imports
module: identity
screens: [s04, s05]
depends: ["D-02 One main profile every Ring starts from"]
created: 2026-10-15
updated: 2026-10-27
owner: "Omar Fostok"
tags: [task, task/todo, module/identity, priority/high]
related: ["Linked Accounts (OAuth) Story"]
---

# ⬜ T-020 · LinkedIn import → review → base profile

**Feature:** [[Onboarding Imports]] · **Status:** To do · **Priority:** High · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-020-fe Frontend · LinkedIn import → review → base profile|Frontend]] · [[T-020-be Backend · LinkedIn import → review → base profile|Backend]] · **Story:** [[T-020 Story]]

## What

Import endpoint returns candidate fields; confirm endpoint writes the chosen ones to the main profile (headline, role, company, location, photo, bio: [[D-02 One main profile every Ring starts from]]), which every Ring then inherits field by field.

## Design

- [[Screen Index#s04|s04]] Importing
- [[Screen Index#s05|s05]] Review import

## Dependencies

- Waits on [[Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]]
- Waited on decision [[ND-02 Base profile work fields]], decided by [[D-02 One main profile every Ring starts from]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · ND-02 decided ([[D-02 One main profile every Ring starts from]]); What and Dependencies updated, flag cleared. Still waits on Linked Accounts (OAuth) · S7.
- 2026-10-26 · `tickets/pm/…/S-09-depends-dr-02` · `depends` points at the decision card D-02 instead of ND-02; the hand-typed `blocked` removed: the build shows it blocked by Linked Accounts (OAuth) · S7, the one real blocker.
