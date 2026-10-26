---
type: task
id: T-079
status: todo
priority: medium
effort: M
feature: profiles
module: identity
labels: []
screens: [s06, s68]
depends: ["D-06 Yearly rename, old name freed, case-insensitive"]
affects: ["Profiles & Pin Name Backend Integration", "Profiles & Pin Name Frontend Requirements"]
related: ["D-06 Yearly rename, old name freed, case-insensitive", "Profiles & Pin Name Backend Integration", "Badge & QR", "What the badge QR encodes", "T-063 Put the ErrorCode on the error body"]
pending: []
created: 2026-10-26
updated: 2026-10-26
owner: "Omar Fostok"
tags: [task, task/todo, module/identity, priority/medium]
---

# ⬜ T-079 · Enforce the once-a-year Pin name rename

**Feature:** [[Profiles & Pin Name]] · **Status:** To do · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-079-fe Frontend · Enforce the once-a-year Pin name rename|Frontend]] · [[T-079-be Backend · Enforce the once-a-year Pin name rename|Backend]] · **Story:** [[T-079 Story]]

## What

Make the Pin-name rule [[D-06 Yearly rename, old name freed, case-insensitive]] decided true: **a person can change their Pin name once a year**. Today a rename through `PATCH /profiles/:id` is unlimited, while s06 promises "once a year". Backend: remember when each profile's Pin name was last changed; refuse a `PATCH` that changes `pinName` within a year of the last change with its own error code; expose when the next change is allowed on the profile; the old name stays free at once, as today (no redirect, no hold). Claiming the name at registration is not a rename, and the **first rename is free**: the year counts from it (D-06 *Still open*, its natural reading). A change of capitals only (`omar.fostok` → `Omar.Fostok`) is the same name and is not counted. Frontend: the profile editor shows the next allowed date next to the Pin name and turns the refusal into a plain sentence. Not in this task: suggestions (already built on the client from the person's own name) and what a printed badge does with a released name ([[Badge & QR]], [[What the badge QR encodes]]).

## Design

- [[Screen Index#s06|s06]] Claim your Pin: the copy "You can change it once a year." stays; claiming the first name is not a rename.
- Profile editor, reached from [[Screen Index#s68|s68]] (no prototype screen): the Pin-name field says when it can next be changed, and a refused rename says why.

## Impact

Output of `node scripts/build-tree.mjs --impact T-079` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-079 Story]] · S-115 — same task
- [[T-079-be Backend · Enforce the once-a-year Pin name rename]] · T-079-be — same task
- [[T-079-fe Frontend · Enforce the once-a-year Pin name rename]] · T-079-fe — same task
- [[Profiles & Pin Name Story]] · S-14 — related ←
- [[Profiles & Pin Name]] · F-07 — wikilink →
- [[Profiles & Pin Name Backend Delivery]] · BD-07 — wikilink →
- [[Profiles & Pin Name Backend Integration]] · BI-04 — wikilink →

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created with --scaffold task
