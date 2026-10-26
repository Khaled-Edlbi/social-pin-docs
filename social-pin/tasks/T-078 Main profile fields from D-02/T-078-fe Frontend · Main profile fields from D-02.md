---
type: task
id: T-078-fe
status: todo
priority: high
effort: L
feature: profiles
module: identity
parent: T-078
labels: [frontend]
screens: [s05, s23, s68]
depends: [T-078-be]
affects: []
related: ["D-05 Inherit per field, copy without members", "T-062 Serve uploaded file bytes by id", "T-020 LinkedIn import → review → base profile", "T-020b Business card scan and portfolio URL import", "Onboarding Imports", "Ring Projection", "Files Upload", "Auth & Sign-up"]
pending: []
created: 2026-10-26
updated: 2026-10-26
owner: "Omar Fostok"
tags: [task, task/todo, module/identity, priority/high, frontend]
---

# ⬜ T-078-fe · Frontend: Main profile fields from D-02

**Parent:** [[T-078 Main profile fields from D-02]] · **Feature:** [[Profiles & Pin Name]] · **Side:** Frontend · **Status:** To do · **Priority:** high · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-078-fe` when the team picks it up): [[T-078-fe Frontend Requirements|Frontend Requirements]] · [[T-078-fe Frontend Delivery|Frontend Delivery]] · [[T-078-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-078 Main profile fields from D-02]]: the screens below show what its *What* describes, built against [[Profiles & Pin Name Backend Integration]] once the backend half ([[T-078-be Backend · Main profile fields from D-02]]) is current. Write the asks in [[T-078-fe Frontend Requirements]] first; it is blocked by default until [[T-078 Story]] is approved.

## Design

- [[Screen Index#s05|s05]] Review import: the reviewed fields land on the main profile.
- Sign-up's *Profile basics* step (no screen id in [[Screen Index]] yet; the client draws it between s03 and s06): headline, company, location and photo, typed by hand.
- [[Screen Index#s23|s23]] Edit · how you appear: "Inherit from your Pin" reads the main values.
- [[Screen Index#s68|s68]] Me / Account: the header and the profile editor show and change them.

## Impact

Same as the parent's: [[T-078 Main profile fields from D-02#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Profiles & Pin Name Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created as the frontend half of T-078
