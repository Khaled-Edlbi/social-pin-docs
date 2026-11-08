---
id: B-11
type: bug
module: identity
feature: ring-projection
status: ready
priority: high
effort: S
foundOn: "BI-07 Ring Projection Backend Integration"
screens: [s20, s24, s25, s36, s68]
depends: []
affects: ["BI-07 Ring Projection Backend Integration", "QB-13 Ring Projection QA Backend"]
related: ["BI-07 Ring Projection Backend Integration", "QB-13 Ring Projection QA Backend", "BD-10 Ring Projection Backend Delivery", "S-17 Ring Projection Story", "PATCH /rings/:ringId/projection", "PATCH /rings/:ringId/projection/links/:linkId"]
pending: []
created: 2026-11-05
updated: 2026-11-08
tags: [bug, bug/ready, module/identity, priority/high]
---

# 📨 B-11 · Projection switches read any string as true

> ⚠ Affected by [[BD-10 Ring Projection Backend Delivery]] (2026-11-08): fixed on backend main e483d49 (562368b: `@ToBoolean()` on every switch, so `"false"` is false and any value other than true/false is a 400), ready for re-test

**Found against:** [[BI-07 Ring Projection Backend Integration]] · **Feature:** [[F-10 Ring Projection]] · **Status:** Ready · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** [[QB-13 Ring Projection QA Backend]] rows B25 and B26, on build `main @ 12172c6 · localhost:3110, Node 22.22.2`.

## What

**What happens.** Every on/off switch of the projection accepts a string and stores it as `true`, whatever the string says. `PATCH /rings/:ringId/projection { "showEmail": "false" }` on the Family Ring answered 200 with `showEmail: true`, and the Family member's `GET /views/ring/:ringId` then showed the owner's email. `"yes"` and `"0"` do the same (`showGender: "0"` → `true`). The switches of links and custom fields too: `PATCH …/links/:linkId { "isVisible": "false" }` switched a link **on** in the Ring, and `POST …/info-blocks { "isVisible": "false" }` added the field switched on. `null` is refused (400), a real boolean works.

**What should happen.** [[BI-07 Ring Projection Backend Integration]]: "`show*` sent as booleans", and *Rules the UI must respect*: the sensitive-field gate is a per-Ring decision the owner makes; a request that is not a boolean is a 400, never a share. A client that serialises a form value as a string, or a typo, must not publish a birthdate, a phone or an email to an audience, nor switch a link on ([[S-17 Ring Projection Story|S4]]: "the switch reflects the response, not the tap").

**Where.** `PATCH /rings/:ringId/projection` (`showBirthdate`, `showGender`, `showMaritalStatus`, `showPhone`, `showEmail`), `POST` / `PATCH …/links[/:linkId]`, `…/info-blocks[/:blockId]`, `POST …/attachments` (`isVisible`). The cause is global: `configureApp` runs the `ValidationPipe` with `transformOptions: { enableImplicitConversion: true }`, which turns any non-empty string into `true` for a `boolean` property **before** `@IsBoolean()` runs. Other booleans in the API likely do the same (the Ring settings of F-11, for one): worth checking when it is fixed.

**On which build.** backend `main @ 12172c6`, 2026-11-05.

The fix is the backend's (`/backend`). That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

## Design

- [[Screen Index#s20|s20]], [[Screen Index#s24|s24]], [[Screen Index#s25|s25]], [[Screen Index#s36|s36]], [[Screen Index#s68|s68]]: the switches

## Impact

Output of `node scripts/build-tree.mjs --impact B-11` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- [[BI-07 Ring Projection Backend Integration]] — related →
- [[F-10 Ring Projection]] — wikilink →

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-11-05 · filed with --scaffold bug, found against BI-07 Ring Projection Backend Integration
