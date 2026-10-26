---
type: task
id: T-060
status: done
priority: high
effort: S
feature: ring-projection
module: identity
screens: [s28]
depends: [ND-02]
related: ["D-05 Inherit per field, copy without members", "D-02 One main profile every Ring starts from"]
created: 2026-10-15
updated: 2026-10-26
owner: "omar"
tags: [task, task/done, module/identity, priority/high]
decision: ND-05
---

# ✅ T-060 · Decide: copy or inherit

**Feature:** [[Ring Projection]] · **Status:** Done · **Priority:** High · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

Take [[ND-05 Copy or inherit]]. Decided by [[D-05 Inherit per field, copy without members]]: Rings inherit the main profile field by field, and copying a Ring never copies its members. Building it is not ticketed yet.

## Design

- [[Screen Index#s28|s28]] Copy from a Ring

## Dependencies

- Waited on decision [[ND-02 Base profile work fields]], decided by [[D-02 One main profile every Ring starts from]]

## Definition of done

- [x] The decision is recorded on its decision card ([[D-05 Inherit per field, copy without members]]), decided
- [x] The feature's *Decisions* list says so ([[Ring Projection]])

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · `tickets/pm/M-01-identity/F-10-ring-projection/T-060-closed` · closed: ND-05 decided by molham on [[D-05 Inherit per field, copy without members]]; the empty T-060 Story template retired (a Decide task has no story of its own); flag cleared.
