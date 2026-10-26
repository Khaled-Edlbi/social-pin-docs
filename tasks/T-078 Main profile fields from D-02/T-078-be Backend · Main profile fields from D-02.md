---
type: task
id: T-078-be
status: todo
priority: high
effort: L
feature: profiles
module: identity
parent: T-078
labels: [backend]
screens: [s05, s23, s68]
depends: ["D-02 One main profile every Ring starts from"]
affects: []
related: ["D-05 Inherit per field, copy without members", "T-062 Serve uploaded file bytes by id", "T-020 LinkedIn import → review → base profile", "T-020b Business card scan and portfolio URL import", "Onboarding Imports", "Ring Projection", "Files Upload", "Auth & Sign-up"]
pending: []
created: 2026-10-26
updated: 2026-10-26
owner: "Omar Fostok"
tags: [task, task/todo, module/identity, priority/high, backend]
---

# ⬜ T-078-be · Backend: Main profile fields from D-02

**Parent:** [[T-078 Main profile fields from D-02]] · **Feature:** [[Profiles & Pin Name]] · **Side:** Backend · **Status:** To do · **Priority:** high · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-078-be` when the team picks it up): [[T-078-be Backend Delivery|Backend Delivery]] · [[T-078-be Backend Integration|Backend Integration]] · [[T-078-be QA Backend|QA Backend]]

## What

The API side of [[T-078 Main profile fields from D-02]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-078-be Backend Delivery]] and how to call it in [[T-078-be Backend Integration]], and roll both up into [[Profiles & Pin Name Backend Delivery]] and [[Profiles & Pin Name Backend Integration]].

## Design

- [[Screen Index#s05|s05]] Review import: the reviewed fields land on the main profile.
- Sign-up's *Profile basics* step (no screen id in [[Screen Index]] yet; the client draws it between s03 and s06): headline, company, location and photo, typed by hand.
- [[Screen Index#s23|s23]] Edit · how you appear: "Inherit from your Pin" reads the main values.
- [[Screen Index#s68|s68]] Me / Account: the header and the profile editor show and change them.

## Impact

Same as the parent's: [[T-078 Main profile fields from D-02#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created as the backend half of T-078
