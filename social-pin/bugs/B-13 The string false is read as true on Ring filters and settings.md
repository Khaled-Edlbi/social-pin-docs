---
id: B-13
type: bug
module: identity
feature: rings
status: todo
priority: high
effort: S
foundOn: "BI-08 Rings Backend Integration"
screens: [s16, s21, s26, s27]
depends: []
affects: []
related: ["BI-08 Rings Backend Integration", "QB-12 Rings QA Backend", "BD-11 Rings Backend Delivery", "D-04 Ring settings at launch and their defaults", "GET /rings", "POST /rings", "PATCH /rings/:id"]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [bug, bug/todo, module/identity, priority/high]
---

# ⬜ B-13 · The string false is read as true on Ring filters and settings

**Found against:** [[BI-08 Rings Backend Integration]] · **Feature:** [[F-11 Rings]] · **Status:** To do · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-12 Rings QA Backend]] rows B4 and B37, on build backend `main @ 12172c6` (2026-11-05).

## What

**What happens.** Any string sent where a Ring takes a boolean is read as `true`, `"false"` included, and is never refused:

- `GET /rings?isTemporary=false` returns the owner's **temporary** Rings only (one Ring, `meta.total: 1`, among thirteen of which twelve are permanent); `?isTemporary=0` and `?isTemporary=maybe` answer the same, 200. My Rings cannot list the permanent Rings alone.
- In a JSON body, `POST /rings { "requireApproval": "false", "membersCanSeeEachOther": "false" }` answers 201 and saves **both as `true`**: a request meant to keep "members can see each other" off switches it **on**. `PATCH /rings/:id { "requireApproval": "yes" }` answers 200 and saves `true`.

**What should happen.** [[BI-08 Rings Backend Integration]], *Flow* step 1: "`isTemporary` (`false` is a real filter)", which [[S-18 Rings Story]] repeats under *Rules the backend already enforces*; the six settings are booleans ([[D-04 Ring settings at launch and their defaults]], *Shapes that matter*), so a value that is not a boolean is a 400 like every other validation failure (*Errors to handle*). `?isTemporary=false` lists the permanent Rings; `"false"`, `"yes"` or `"maybe"` in a body is 400.

**Where.** `GET /rings`, `POST /rings`, `PATCH /rings/:id` (and `isTemporary` on the last two). The global `ValidationPipe` in `src/common/bootstrap/configure-app.ts` runs with `transformOptions: { enableImplicitConversion: true }`, which turns every non-empty string into `true` for a `boolean` property before `@IsBoolean()` runs (`SearchRingDto.isTemporary`, `CreateRingDto` / `UpdateRingDto` booleans). The same cause shows on the projection switches in the F-10 QA run (B-11 there, on its own branch, not merged), so the fix is likely one shared transform for booleans.

**On which build.** Backend `main @ 12172c6`, localhost:3111, throwaway database, 2026-11-05.

The fix is `/backend`'s. That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s16|s16]] (My Rings, the temporary badge and any filter), [[Screen Index#s21|s21]], [[Screen Index#s26|s26]], [[Screen Index#s27|s27]] (the settings switches)

## Impact

Output of `node scripts/build-tree.mjs --impact B-13` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-08 Rings Backend Integration]] — related →
- [[QB-12 Rings QA Backend]] — pending ← (rows B4, B37)
- [[F-11 Rings]] — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-08 Rings Backend Integration
- 2026-11-05 · filled from [[QB-12 Rings QA Backend]] B4 and B37 on backend `main @ 12172c6`
