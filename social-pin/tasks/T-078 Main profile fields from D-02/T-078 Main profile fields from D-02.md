---
type: task
id: T-078
status: todo
priority: high
effort: L
feature: profiles
module: identity
labels: []
screens: [s05, s23, s68]
depends: ["D-02 One main profile every Ring starts from"]
affects: ["Profiles & Pin Name Backend Integration", "Onboarding Imports", "T-020 LinkedIn import → review → base profile", "T-020b Business card scan and portfolio URL import"]
related: ["D-05 Inherit per field, copy without members", "Files Upload Story", "T-020 LinkedIn import → review → base profile", "T-020b Business card scan and portfolio URL import", "Onboarding Imports", "Ring Projection", "Files Upload", "Auth & Sign-up"]
pending: []
created: 2026-10-26
updated: 2026-10-27
owner: "Omar Fostok"
tags: [task, task/todo, module/identity, priority/high]
---

# ⬜ T-078 · Main profile fields from D-02

**Feature:** [[Profiles & Pin Name]] · **Status:** To do · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-078-fe Frontend · Main profile fields from D-02|Frontend]] · [[T-078-be Backend · Main profile fields from D-02|Backend]] · **Story:** [[T-078 Story]]

## What

Give the profile the six main-profile fields [[D-02 One main profile every Ring starts from]] decided: **headline, role, company, location, photo, bio**, written once on the person's own profile and read by every Ring that has not changed them. Today the profile has none of them, so sign-up's *Profile basics* step and the imports collect values the app cannot save, and every Ring keeps its own copy. Backend: the `Profile` entity and its migration, the six fields on `GET /profiles`, `GET /profiles/:id` and `PATCH /profiles/:id` (photo as the id of a file from `POST /files`), with their limits stated in the integration note; full name stays the one field no Ring may change. Frontend: sign-up saves what *Profile basics* collected right after registration, and Me shows and edits the six fields. Not in this task: how a Ring follows the main value field by field ([[D-05 Inherit per field, copy without members]], on [[Ring Projection]]), serving the photo's bytes ([[Files Upload Story|Files Upload · showing files]]), and the imports that fill these fields ([[T-020 LinkedIn import → review → base profile]], [[T-020b Business card scan and portfolio URL import]]).

## Design

- [[Screen Index#s05|s05]] Review import: the reviewed fields land on the main profile.
- Sign-up's *Profile basics* step (no screen id in [[Screen Index]] yet; the client draws it between s03 and s06): headline, company, location and photo, typed by hand.
- [[Screen Index#s23|s23]] Edit · how you appear: "Inherit from your Pin" reads the main values.
- [[Screen Index#s68|s68]] Me / Account: the header and the profile editor show and change them.

## Impact

Output of `node scripts/build-tree.mjs --impact T-078` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-078 Story]] · S-114 — same task
- [[T-078-be Backend · Main profile fields from D-02]] · T-078-be — same task
- [[T-078-fe Frontend · Main profile fields from D-02]] · T-078-fe — same task
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
