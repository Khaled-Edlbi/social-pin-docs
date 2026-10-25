---
type: task
id: T-058
status: done
priority: critical
effort: S
feature: ring-projection
module: identity
screens: [s24]
depends: []
related: ["DR-03 Links entered once, switched on or off per Ring"]
created: 2026-10-15
updated: 2026-10-25
owner: "omar"
tags: [task, task/done, module/identity, priority/critical]
decision: D-03
---

# ✅ T-058 · Decide: field library vs per-Ring copies

**Feature:** [[Ring Projection]] · **Status:** Done · **Priority:** Critical · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

Take [[D-03 Field library vs per-Ring copies]]. Decided by [[DR-03 Links entered once, switched on or off per Ring]]: one library of links, each Ring only switches them on or off. Building it is not ticketed yet.

## Design

- [[Screen Index#s24|s24]] Edit · what it shows

## Definition of done

- [x] The decision is recorded on its decision card ([[DR-03 Links entered once, switched on or off per Ring]]), decided
- [x] The feature's *Decisions* list says so ([[Ring Projection]])

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · `tickets/pm/M-01-identity/F-10-ring-projection/T-058-closed` · closed: D-03 decided by molham on [[DR-03 Links entered once, switched on or off per Ring]]; the empty T-058 Story template retired (a Decide task has no story of its own); flag cleared.
