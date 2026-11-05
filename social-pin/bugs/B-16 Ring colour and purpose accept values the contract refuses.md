---
id: B-16
type: bug
module: identity
feature: rings
status: todo
priority: low
effort: S
foundOn: "BI-08 Rings Backend Integration"
screens: [s09, s18, s22]
depends: []
affects: []
related: ["BI-08 Rings Backend Integration", "QB-12 Rings QA Backend", "BD-11 Rings Backend Delivery", "D-04 Ring settings at launch and their defaults", "POST /rings", "PATCH /rings/:id", "POST /rings/:id/copy"]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [bug, bug/todo, module/identity, priority/low]
---

# ⬜ B-16 · Ring colour and purpose accept values the contract refuses

**Found against:** [[BI-08 Rings Backend Integration]] · **Feature:** [[F-11 Rings]] · **Status:** To do · **Priority:** Low (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-12 Rings QA Backend]] rows B22 and B36, on build backend `main @ 12172c6` (2026-11-05).

## What

**What happens.**

- `POST /rings { "colorHex": "#abc" }` and `{ "colorHex": "1A2B3C" }` answer 201 and store the value as sent (`#abc`, `1A2B3C`): any hex colour is taken, with or without `#`, three to eight digits. A client reading `colorHex` as `#RRGGBB` gets something else back.
- `POST /rings { "purpose": "" }` answers 201 and `PATCH /rings/:id { "purpose": "   " }` answers 200; both store `purpose: ""`, an empty "who it's for" that is neither a purpose nor `null`.

**What should happen.** [[BI-08 Rings Backend Integration]], *Shapes that matter*: "`colorHex`: `#RRGGBB`"; the settings table: `purpose` is "string, 1–140 after trim, or `null`"; *Errors to handle*: both are 400 validation errors ("`#RRGGBB`", "`purpose` over 140"). An empty purpose should be refused (or stored as `null`, which the contract would then say).

**Where.** `POST /rings`, `PATCH /rings/:id` (and the `colorHex` / `purpose` overrides of `POST /rings/:id/copy`, same DTO rules); `CreateRingDto.colorHex` uses `@IsHexColor()`, which admits every hex form, and `purpose` has `@MaxLength(140)` without a minimum after `@Trim()`.

**On which build.** Backend `main @ 12172c6`, localhost:3111, throwaway database, 2026-11-05.

The fix is `/backend`'s. That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s09|s09]], [[Screen Index#s18|s18]] (colour swatches, "Who is it for"), [[Screen Index#s22|s22]] (edit name and purpose)

## Impact

Output of `node scripts/build-tree.mjs --impact B-16` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-08 Rings Backend Integration]] — related →
- [[QB-12 Rings QA Backend]] — pending ← (rows B22, B36)
- [[F-11 Rings]] — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-08 Rings Backend Integration
- 2026-11-05 · filled from [[QB-12 Rings QA Backend]] B22 and B36 on backend `main @ 12172c6`
