---
type: task
id: T-NNN
status: todo
priority: P1
effort: M
feature: <feature slug>
domain: <domain>
screens: []
depends: []
created: <date>
tags: [task, task/todo, domain/<domain>, priority/P1]
---

# ⬜ T-NNN · <Title>

**Feature:** [[<Feature name>]] · **Status:** To do · **Priority:** P1 · **Effort:** M

## What

## Design

- [[Screen Index#sNN|sNN]]

## Dependencies

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Branch `feat/T-NNN-<slug>` in both repos
- [ ] Feature note updated (status, endpoints, How it works, gaps)
- [ ] Requirements note rows flipped to ✅; story updated (approved only with product sign-off)
- [ ] Frontend note created / updated and listed in [[Frontend Index]]
- [ ] `node scripts/build-tree.mjs --check` passes; `tree/tree.json` and `tree/tree.md` committed
- [ ] [[Task Board]], [[Backlog]], [[Feature Tree]], [[Frontend Contract]] updated; mirrored files changed in both repos if the contract moved

## Log

- <date> · created
