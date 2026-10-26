---
type: task
id: T-072
status: in-progress
priority: medium
effort: S
feature: operator-panel
module: platform
labels: []
screens: []
depends: [T-068]
affects: ["Spec Map", "Frontend API Guide"]
related: []
pending: []
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/in-progress, module/platform, priority/medium]
---

# 🟡 T-072 · Platform stats

**Feature:** [[Operator Panel]] · **Status:** In progress · **Priority:** Medium · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-072-be Backend · Platform stats|Backend]] · **Story:** [[T-072 Story]]

## What

`GET /admin/stats`: the dashboard's landing figures — the account lifecycle
broken down by status, live ring, profile and role counts, and the audit
events of the last 24 hours.

Counts only, by design. An operator learns how many rings exist, never whose
they are or what is in them: an aggregate that cannot be attributed to a
person is not a privacy decision at all. Every figure is one `count` with a
`where`, issued in parallel and deliberately without a transaction — they
are independent reads, and wrapping them would hold one open across thirteen
queries to buy a snapshot nothing here depends on. `generatedAt` is returned
so the client can say how fresh the tiles are rather than implying they are
live.

## Design

- —

## Impact

Output of `node scripts/build-tree.mjs --impact T-072` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-072 Story]] · S-113 — same task
- [[T-072-be Backend · Platform stats]] · T-072-be — same task
- [[Operator Panel]] · F-42 — wikilink ←, wikilink →

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · filed under [[Operator Panel]], after the code: the backend
  was written before any ticket named it and now sits on `T-072-be/admin/platform-stats`
  in `social-pin`, `pnpm typecheck && pnpm test` green, not merged. Priority,
  effort and the feature's `release:` are first guesses for the owner.
