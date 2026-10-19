---
type: task
id: T-031
status: needs-info
priority: medium
effort: M
feature: discover-hub
module: discovery
screens: [s38]
depends: []
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/needs-info, module/discovery, priority/medium]
---

# ❓ T-031 · Import contacts

**Feature:** [[Discover Hub & Search]] · **Status:** Needs a decision / info · **Priority:** Medium · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-031-fe Frontend · Import contacts|Frontend]] · [[T-031-be Backend · Import contacts|Backend]] · **Story:** [[T-031 Story]]

## What

Match hashed emails / phones against users; must not reveal who is on the platform beyond the match. Privacy review needed.

## Design

- [[Screen Index#s38|s38]] Discover hub

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
