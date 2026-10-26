---
type: task
id: T-067
status: todo
priority: critical
effort: M
feature: error-contract
module: platform
labels: []
screens: []
depends: [T-063]
affects: ["Error Contract", "Error Contract Backend Delivery", "Rings", "Ring Projection", "API Conventions", "Frontend Contract"]
related: ["T-067 Story", "Error Contract Story", "T-063"]
pending: []
owner: "khaled"
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/critical]
---

# ⬜ T-067 · Split E_RING_01 and E_RING_PROFILE_03

**Feature:** [[Error Contract]] · **Status:** To do · **Priority:** Critical · **Deadline:** — · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-067-fe Frontend · Split E_RING_01 and E_RING_PROFILE_03|Frontend]] · [[T-067-be Backend · Split E_RING_01 and E_RING_PROFILE_03|Backend]] · **Story:** [[T-067 Story]]

**Layer notes** (this ticket's chain, on the parent task per [[D-19 A ticket's layer notes live on the parent task]]; each layer scaffolds its own with `node scripts/build-tree.mjs --scaffold <kind> T-067`): Frontend Requirements → Backend Delivery → Backend Integration → Frontend Delivery, with QA Backend after the delivery and QA Frontend after the client. None written yet.

## What

Two error codes each carry more than one meaning, so a client that branches on them cannot tell which refusal it got. `E_RING_01` answers both a Ring **name clash** and a **disallowed Ring type**; `E_RING_PROFILE_03` answers a **bad link value**, a **missing link** and a **missing info block**. [[Error Contract Backend Delivery]] records both and says the split is "worth a split when T-063 lands, since the code becomes something clients switch on"; [[Error Contract Story]] S3 asks for it as an acceptance criterion, and [[T-063 Story]] names the same ambiguity in its *Open questions*, where the app only gets away with treating `E_RING_01` as "name taken" because it never sends a refused type.

Give each meaning its own code in the service enum, keep the retired meanings' codes where they still hold, and never reuse a number that was taken away. The backend changes what each service throws (`RingService` for the Ring codes, `RingProfileService` for the projection ones) and records the new codes and their meanings in its delivery note; the frontend keys its copy on the new codes instead of inferring the meaning from the endpoint. The code enum, `API Conventions` and the error tables in the Frontend API Guide move with it.

## Design

No screen of its own. It changes which copy appears in error states the design already draws: the Ring name field on [[Screen Index#s18|s18]] (rename) and the New Ring wizard's name step, and the projection editor's link and info-block rows. The frontend half says which copy belongs to which new code.

## Impact

`node scripts/build-tree.mjs --impact T-067`, 2026-10-26.

- [[T-067 Story]] · S-108 — same task
- [[T-067-be Backend · Split E_RING_01 and E_RING_PROFILE_03]] · T-067-be — same task
- [[T-067-fe Frontend · Split E_RING_01 and E_RING_PROFILE_03]] · T-067-fe — same task
- [[T-063 Put the ErrorCode on the error body]] · T-063 — depends: this task waits until the code is on the wire
- [[Error Contract Story]] · S-87 — its S3 is the acceptance criterion this task meets
- [[Error Contract]] · F-35 and [[Error Contract Backend Delivery]] · BD-35 — the feature that owns the codes, and the note that records the ambiguity
- [[Rings]] · F-11 — owns the name clash and the disallowed type behind `E_RING_01`
- [[Ring Projection]] · F-10 — owns the link and info-block refusals behind `E_RING_PROFILE_03`
- [[Delegated Admins]] · F-16, [[Event Ring Auto-creation]] · F-21, [[Exhibitor]] · F-24, [[Meetings]] · F-26 — share `E_RING_01`; each creates Rings and will see the new codes
- [[Frontend API Guide]] · P-07, [[API Conventions]] · P-10, [[Frontend Contract]] — carry the code tables the split rewrites

## Definition of done

- [ ] Each meaning has its own code in the enum; no retired number reused ([[API Conventions]])
- [ ] `RingService` throws the name-clash code and the disallowed-type code separately
- [ ] `RingProfileService` throws the bad-link-value, missing-link and missing-info-block codes separately
- [ ] Specs assert each refusal's code; `pnpm typecheck && pnpm test` green
- [ ] Branch `ring/T-067/split-error-codes` in both repos
- [ ] `Frontend API Guide.md` (both repos), [[API Conventions]], [[Frontend Contract]] and the code tables updated; [[Error Contract Backend Delivery]]'s "one code, two meanings" gap removed
- [ ] The app keys its copy on the new codes; the "treated as name taken only because we never send a refused type" workaround in [[T-063 Story]] removed
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · created with `--scaffold task` under [[Error Contract]], for S3 of [[Error Contract Story]], which had no ticket. Critical, both sides, `depends: [T-063]` so it reads Blocked until the code is on the wire — splitting before that changes nothing a client can see, splitting after it is a contract change. **Flagged:** [[T-067-be Backend · Split E_RING_01 and E_RING_PROFILE_03]], scaffolded with `depends: []` while this parent waits on T-063, so the board offers it as pickable; `/backend` types the inherited `depends` and clears it. The same is true of every half the scaffold writes, which is `/owner`'s to settle. **Next:** the ticket waits on [[T-063 Put the ErrorCode on the error body]]; when that is done, `/frontend` writes `T-067 Frontend Requirements`.
