---
id: QB-12
type: qa-backend
module: identity
feature: rings
status: passing
scope: feature
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s27, s62]
depends: ["BD-11 Rings Backend Delivery", "S-18 Rings Story"]
affects: []
related: ["BI-08 Rings Backend Integration", "FR-11 Rings Frontend Requirements", "BD-03 Counts Backend Delivery", "BI-14 Counts Backend Integration", "S-15 Ring Access Engine Story", "D-03 Links entered once, switched on or off per Ring", "D-04 Ring settings at launch and their defaults", "D-05 Inherit per field, copy without members", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "B-13 The string false is read as true on Ring filters and settings", "B-14 PATCH a Ring with null on a required field answers 500", "B-15 Disposition runs on a permanent Ring, the default included", "B-16 Ring colour and purpose accept values the contract refuses", "GET /rings", "POST /rings", "GET /rings/:id", "PATCH /rings/:id", "POST /rings/:id/default", "POST /rings/:id/copy", "POST /rings/:id/disposition", "DELETE /rings/:id", "GET /rings/shared-with-me", "GET /rings/shared-with-me/count", "GET /views/ring/:ringId", E_RING_01, E_RING_02, E_RING_04, E_RING_05, E_RING_06, E_RING_07, E_RING_08, E_RING_09, E_RING_10]
pending: []
unmet: []
created: 2026-11-05
updated: 2026-11-08
tags: [qa-backend, qa-backend/passing, module/identity, layer/qa]
---

# 🧪 Rings · QA Backend

> Blocked by default until [[BD-11 Rings Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-11 Rings]] · **Verifies:** [[BD-11 Rings Backend Delivery]] against [[S-18 Rings Story]] and [[FR-11 Rings Frontend Requirements]], with the shapes and errors of [[BI-08 Rings Backend Integration]] · **Verdict:** 🟢 Passing · 2026-11-08 · backend `main @ e483d49` · 78 of 78 as expected, nothing pending, no story part unmet ([[B-13 The string false is read as true on Ring filters and settings|B-13]], [[B-14 PATCH a Ring with null on a required field answers 500|B-14]], [[B-15 Disposition runs on a permanent Ring, the default included|B-15]], [[B-16 Ring colour and purpose accept values the contract refuses|B-16]] re-tested and closed)

Expected behaviour of the API, as artefacts a person can check a build against: tables and diagrams, **not test code** (the specs live in the backend repo). `status: passing` or `failing` after a run; the verdict tells the PM whether the story can be fulfilled (passing with nothing pending or unmet). A failing row is one of two things: a story part the delivery does not fulfil (not built, or built other than the story says) goes in `unmet` and turns the story's badge ✕; a bug (built as asked, but it breaks) is filed against the Backend Integration and goes in `pending`, and leaves the story alone.

## Scope

**Covered.** The ten Ring routes of [[BI-08 Rings Backend Integration]]: My Rings (`GET /rings`, its filters, `meta.total` and the live `memberCount`), create (`POST /rings`), read and edit (`GET` / `PATCH /rings/:id`, PATCH through `assertCanAdminister`), the six settings and the purpose ([[S-18 Rings Story|Rings · S9]], [[D-04 Ring settings at launch and their defaults]]), copy a Ring ([[S-18 Rings Story|Rings · S4]], [[D-05 Inherit per field, copy without members]], [[D-03 Links entered once, switched on or off per Ring]]), set-default and the temporary-default refusal ([[S-18 Rings Story|Rings · S7]], `E_RING_09`), delete ([[S-18 Rings Story|Rings · S6]]), disposition ([[S-18 Rings Story|Rings · S8]]), and Shared with me per person with its count ([[S-18 Rings Story|Rings · S3]], [[D-14 Shared with me lists people, never the Ring]], [[D-15 Several Rings per connection, remove or disconnect]]). `GET /views/ring/:ringId` is called only to open a Shared-with-me row; its body is [[BI-09 View As & Pin Views Backend Integration]]'s.

**Not covered.** Screens, copy and motion (the QA Frontend's). The member routes (`/rings/:ringId/members`) beyond setting up rows and checking that a member gets no roster: [[F-09 Ring Members]]'s QA. The projection routes beyond comparing a copy with its source: [[F-10 Ring Projection]]'s QA.

**Not delivered yet** (BD-11's `pending`, not run as failures): a Ring's name and a member count on a Shared-with-me row for a Ring joined knowingly ([[D-18 Ring names shown when joined knowingly]]; waits on [[F-09 Ring Members]] recording how a membership was made, so `ringName` and `memberCount` are `null` on every row today, B66); `joinPolicy`, `requireApproval`, `membersCanInvite` and `membersCanSaveAttachments` are stored but enforced only when [[F-17 Ring Invitations & Join]] and a save flow ship (B32–B35 check that they are saved and returned, nothing more). Which admin level may change which setting comes with [[F-16 Delegated Admins]]; today it is `CONTENT_MANAGER` and above for all six (B28, B29).

**How it was run.** Two runs, each on a fresh throwaway database: 2026-11-05 on backend `main @ 12172c6` (every row; 7 differed), and 2026-11-08 on backend `main @ e483d49` (every row again: the seven, and the other 71 on the same routes, to check nothing else moved; all 78 as expected). Both from a worktree, `PORT=3111`, Node 22.22.2, against a throwaway PostgreSQL database `social_pin_qa_f11` on localhost (migrated with `pnpm prisma:deploy`, seeded with `pnpm db:seed`, **dropped after each run**); the dev database was never touched. Users signed in through `POST /auth/login` → `login/verify` with the returned `devCode`: Sara (`SaraAz`, the owner), Omar (`OmarK`, a member of her E-commerce Clients Ring), Gulf Expo (`GulfExpo`, a member of her Family Ring), the platform admin account (a stranger to her Rings) and one throwaway account made for the run (`QaEve11`). Set up **directly in the throwaway database with SQL** (no route for them yet): the two delegated admins (`ring_admins`: Omar `CONTENT_MANAGER` on E-commerce Clients, Gulf Expo `MEMBER_MANAGER` on Family), every block (`user_blocks`, B10 and B77), and the membership windows moved after the fact (B9's start moved to now, B72, B74, B75). Every other state came from the API itself. Calls made with curl.

**Error bodies.** The API answers `{ statusCode, message, error, path, timestamp }`; `ErrorCode` is not on the wire until [[S-87 Error Contract Story|Error Contract · S4–S8]], so each row names the code the contract promises and checks the status and the message. "Same body" means equal except `path` and `timestamp`.

## Expected behaviour

✅ as expected · 🔴 differs · ⬜ not run.

### `GET /rings` — S2 My Rings (s16), S1 (s08)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B1 | Sara with her three seeded Rings (My Ring the default) | `GET /rings` | 200 `{ data, meta: { total: 3 } }`; the default first, then newest first; each row the `RingEntity` fields, the six settings and `memberCount` | ✅ |
| B2 | — | `?name=comm` | partial match: E-commerce Clients only, `total: 1` | ✅ |
| B3 | — | `?type=CORPORATE`; `?type=PERSONAL` | `total: 0`; `total: 3` | ✅ |
| B4 | one temporary Ring and permanent ones | `?isTemporary=true`; `?isTemporary=false`; `=0`, `=1`, `=maybe`, `=TRUE`, an empty value | the temporary Ring only; **the permanent ones only** ("`false` is a real filter", BI-08); 400 "isTemporary must be a boolean value" for each of the rest | ✅ re-run 2026-11-08 on `main @ e483d49`: as expected ([[B-13 The string false is read as true on Ring filters and settings]], fixed; on `12172c6` every string read as `true`) |
| B5 | Rings archived by a disposition | `?status=ARCHIVED`; `?status=BOGUS` | the archived Rings only; 400 naming the four statuses | ✅ |
| B6 | the three seeded Rings | `?limit=1&skip=1`; `?limit=51` | one row (Family, the second), `meta.total: 3` (unpaginated); 400 "limit must not be greater than 50" | ✅ |
| B7 | Omar | `GET /rings` | his own Ring only: nobody lists another owner's Rings | ✅ |
| B8 | no token | `GET /rings` | 401 | ✅ |
| B9 | a Ring with Omar live, Gulf Expo whose membership ended on 2026-11-01, the admin account added then removed (`REMOVED`), Eve whose membership starts 2026-12-01 (all added through the member route) | `GET /rings/:id` and `GET /rings` | `memberCount: 1` on both; Eve's start moved to now → 2 | ✅ |
| B10 | B9's Ring with Eve live | a block Eve → Sara; then Sara → Eve | `memberCount: 1` each way (a blocked member is not counted) | ✅ |
| B11 | B9's Ring | the owner sets its `expiresAt` in the past | `memberCount: 0`; the Ring still listed on `GET /rings` with `status: "ACTIVE"` and the past `expiresAt` (the client computes "expired"); clearing `expiresAt` brings the count back to 2 | ✅ |
| B12 | a merged temporary Ring (B60) | `GET /rings/:id` on the source and the target | the source `ARCHIVED`, `memberCount: 0`; the target 0 → 2 | ✅ |

### `POST /rings` — S1 First Ring (s09), S4 New Ring wizard (s18)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B13 | — | `{ name: "Investors" }` | 201 `RingEntity`: `type: "PERSONAL"`, `isDefault: false`, `isTemporary: false`, `status: "ACTIVE"`, `disposition: "UNDECIDED"`, `profileId` the default profile; the six settings at D-04's defaults: `purpose: null`, `joinPolicy: "CODE_OR_INVITATION"`, `requireApproval: true`, `membersCanSeeEachOther`, `membersCanInvite`, `membersCanSaveAttachments` all `false` | ✅ |
| B14 | — | `type` `EVENT`, `MINI_EVENT`, `MEETING` | 400 `E_RING_01` "<TYPE> rings are created by their own flow, not directly"; nothing created | ✅ |
| B15 | — | `type: "CORPORATE"` | 201 | ✅ |
| B16 | a Ring named "Investors" | the same name again; Omar with that name | 409 `E_RING_01` "You already have a ring with this name"; Omar 201 (unique per owner). Observed too: "investors" in lower case is accepted next to "Investors" (the check is case-sensitive; the contract does not say) | ✅ |
| B17 | — | a name of 81, 80, 0 characters, and "   " | 400, 201, 400, 400 ("name must be longer than or equal to 1 characters" after the trim) | ✅ |
| B18 | — | `parentRingId` of Omar's Ring; of a Ring that does not exist | 400 `E_RING_06` "That ring is not one of yours", the same body both times | ✅ |
| B19 | — | `profileId` of Omar's profile | 400 `E_RING_08` "That profile is not one of yours" | ✅ |
| B20 | — | her own `parentRingId` and `profileId` | 201 with both | ✅ |
| B21 | — | `colorHex: "red"`; `colorHex: "#1A2B3C", style: { icon: "briefcase" }` | 400 "colorHex must be a colour in the form #RRGGBB"; 201, both stored as sent | ✅ |
| B22 | — | `colorHex` `"#abc"`, `"1A2B3C"`, `"#1A2B3C80"` on `POST`, on `PATCH` and as a copy override; `"#1a2b3c"` | 400 "colorHex must be a colour in the form #RRGGBB" each time: `colorHex` is `#RRGGBB` (BI-08, *Shapes* and *Errors to handle*); lower-case `#1a2b3c` 201 | ✅ re-run 2026-11-08 on `main @ e483d49`: as expected ([[B-16 Ring colour and purpose accept values the contract refuses]], fixed; on `12172c6` `#abc` and `1A2B3C` were stored) |
| B23 | — | an unknown key (`isDefault: true`); `expiresAt: "tomorrow"` | 400 "property isDefault should not exist"; 400 "expiresAt must be a valid ISO 8601 date string" | ✅ |

### `GET` and `PATCH /rings/:id` — S5 Edit name & purpose (s22), S6 Edit access and expiry (s26)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B24 | the owner | `GET /rings/:id` | 200 `OwnedRingEntity` with `memberCount` and the six settings | ✅ |
| B25 | E-commerce Clients | `GET` by Omar (a member, also its `CONTENT_MANAGER` admin), by the admin account (a stranger), and by Sara for a uuid that does not exist | 404 `E_RING_02` "Ring not found", the same body all three times; a non-uuid id is 400 | ✅ |
| B26 | the owner | rename; rename to the name it already has; rename to another of her Rings' names | 200; 200; 409 `E_RING_01` | ✅ |
| B27 | the owner, the Ring's `expiresAt` past | `PATCH { purpose }` | 200: `assertCanAdminister` ignores expiry, an expired Ring stays editable | ✅ |
| B28 | Omar, `CONTENT_MANAGER` admin of E-commerce Clients | `PATCH { purpose, membersCanSeeEachOther: true }` | 200, both saved | ✅ |
| B29 | Gulf Expo (`MEMBER_MANAGER` admin of Family); Eve (a plain member); the admin account (a stranger); a uuid that does not exist | `PATCH` | 403 `E_RING_05` "You are not permitted to administer this ring" for the first three; 404 `E_RING_02` for the missing Ring | ✅ |
| B30 | the owner | `PATCH` with `null` on `name`, `type`, `isTemporary`, `joinPolicy`, `requireApproval`, `membersCanSeeEachOther`, `membersCanInvite`, `membersCanSaveAttachments`, `profileId`; then on `purpose`, `colorHex`, `style`, `startsAt`, `expiresAt`, `parentRingId` | 400 validation naming the field for the first nine; 200 and the field cleared for the six that take `null` (BI-08 *Flow* 5) | ✅ re-run 2026-11-08 on `main @ e483d49`: as expected, no 500 in the server log ([[B-14 PATCH a Ring with null on a required field answers 500]], fixed; on `12172c6` seven of them answered 500) |

### The six settings — S9 Ring settings (s19, s21, s26, s27)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B31 | the seeded Rings, made before the settings existed | `GET /rings` | every row carries the six settings at the private defaults (the migration's column defaults) | ✅ |
| B32 | — | `POST` with `purpose: "  Conference friends  "`, `joinPolicy: "ANYONE_WHO_SCANS"`, `requireApproval: false` and the three members-can switches `true` | 201, each saved as sent, `purpose` trimmed to "Conference friends" | ✅ |
| B33 | B32's Ring | `PATCH { joinPolicy: "INVITATION_ONLY", membersCanInvite: false }` | 200; only those two change | ✅ |
| B34 | B32's Ring | `PATCH { purpose: null }`; then a `PATCH` without `purpose` | `purpose: null` (cleared); a later PATCH leaves it as it was | ✅ |
| B35 | — | `purpose` of 141 characters; of 140; `joinPolicy: "CONTACTS_OF_MEMBERS"` | 400 "purpose must be shorter than or equal to 140 characters"; 200; 400 naming the three policies | ✅ |
| B36 | — | `purpose: ""` on `POST` and as a copy override; `purpose: "   "` on `PATCH`; 140 characters with surrounding spaces | 400 "purpose must be longer than or equal to 1 characters" for the first three: `purpose` is "1–140 after trim, or `null`" (BI-08); 200 for the last | ✅ re-run 2026-11-08 on `main @ e483d49`: as expected ([[B-16 Ring colour and purpose accept values the contract refuses]], fixed; on `12172c6` an empty purpose was stored as `""`) |
| B37 | — | strings in the JSON body: `requireApproval: "false"`, `membersCanSeeEachOther: "false"` and `membersCanInvite: "true"` on `POST`; `requireApproval: "yes"`, `membersCanSeeEachOther: 0` and `1` on `PATCH` | the strings `"true"` / `"false"` read as `true` / `false` (BI-08 *Flow* 3), so "members can see each other" stays **off**; every other value 400 "… must be a boolean value"; JSON booleans unchanged | ✅ re-run 2026-11-08 on `main @ e483d49`: as expected ([[B-13 The string false is read as true on Ring filters and settings]], fixed; on `12172c6` `"false"` switched the setting on) |
| B38 | Gulf Expo (`MEMBER_MANAGER`), Eve (a member) | `PATCH { membersCanSeeEachOther: true }` | 403 `E_RING_05`: a member cannot change a setting | ✅ |
| B39 | a Ring with "members can see each other" on, Eve a member | `GET /rings/:id/members`; `GET /rings/:id` | 403 `E_RING_05`; 404 `E_RING_02`: there is no member-facing roster or Ring read, on or off | ✅ |
| B40 | E-commerce Clients with "members can see each other" on, Omar a member | `GET /rings/shared-with-me` | his row has `ringName: null`, `memberCount: null` (a count only on a named row, never today) | ✅ |

### `POST /rings/:id/copy` — S4 Copy an existing Ring (s18)

The source is E-commerce Clients after it was given colour `#123456`, style `{ icon: "cart" }`, purpose "Wholesale buyers", every setting off its default, a window (2026-11-01 → 2027-01-01), one member, one admin, a name override on its card, and a projection with five library links (two on, three off) and two info blocks (one hidden).

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B41 | the source | `POST /rings/:id/copy { name: "E-commerce Copy" }` | 201 `RingEntity` of the **new** Ring: the name given; the source's `profileId`, `colorHex`, `style`, `purpose` and five other settings; `type: "PERSONAL"`, `isTemporary: false`, `startsAt` and `expiresAt` `null`, `status: "ACTIVE"`, `disposition: "UNDECIDED"`, `isDefault: false`, no parent | ✅ |
| B42 | the copy | `GET /rings/:id`, `GET /rings/:id/members`, the `ring_admins` rows | `memberCount: 0`, roster `total: 0`, no admin: members and admins are never copied (D-05) | ✅ |
| B43 | the copy and the source | `GET /rings/:id/projection` on both | the same name override, bio and `show*` switches; the **same library items** by id, each with its `sortOrder` and `isVisible` (the hidden link and the hidden info block stay hidden); the library itself unchanged (library links 7 → 7, info blocks 2 → 2): nothing duplicated (D-03) | ✅ |
| B44 | the copy | switch a link off on the copy; then edit that link's value through the copy | the source keeps it on (the switch is per Ring); the new value shows on the source too (one library item) | ✅ |
| B45 | the source | copy with `colorHex`, `style`, `purpose` given; with `purpose: null` | each override applied, the rest from the source; `purpose: null` | ✅ |
| B46 | — | copy with a name she already uses | 409 `E_RING_01` | ✅ |
| B47 | — | copy by Omar (member and `CONTENT_MANAGER` admin), by the admin account, and of a uuid that does not exist | 404 `E_RING_02`, the same body all three times: copy is owner-only | ✅ |
| B48 | — | `{}`; `{ name, isTemporary: true }` | 400 on the name; 400 "property isTemporary should not exist" | ✅ |
| B49 | a temporary Ring with a window, the default Ring, a `CORPORATE` Ring, an expired Ring | copy each | each copy permanent with no window, not the default, `PERSONAL`, `ACTIVE`; the temporary Ring's colour carried over | ✅ |

### `POST /rings/:id/default` and `DELETE /rings/:id` — S7 Make a Ring the default, S6 Delete (s26)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B50 | a temporary Ring | `POST /rings/:id/default` | 409 `E_RING_09` "A temporary ring cannot be your default ring"; My Ring is still the default | ✅ |
| B51 | the default Ring | `PATCH { isTemporary: true }`; `PATCH { isTemporary: false }` | 409 `E_RING_09`, nothing changed; 200 | ✅ |
| B52 | a permanent Ring | `POST /rings/:id/default`; again on the Ring that is now default | 201 with `isDefault: true`; the previous default demoted (`GET /rings`: exactly one default, listed first); 201 again | ✅ |
| B53 | — | set-default by Omar (admin), by the admin account (also on the temporary Ring) | 404 `E_RING_02`: ownership is checked before `E_RING_09` | ✅ |
| B54 | the default Ring (twice: Family while it was the default, then My Ring) | `DELETE /rings/:id` | 409 `E_RING_04` "Set another ring as default before deleting this one" | ✅ |
| B55 | another Ring | `DELETE /rings/:id` | 200, empty body; soft (`deleted_at` set, `status: "DELETED"`); then `GET`, `PATCH` and `DELETE` on it are 404 `E_RING_02`; gone from `GET /rings`; its name free again (201) | ✅ |
| B56 | — | `DELETE` by Omar (admin), by the admin account | 404 `E_RING_02` | ✅ |

### `POST /rings/:id/disposition` — S8 After the event (s62)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B57 | a temporary Ring whose window has ended | `{ disposition: "KEEP" }`; then `KEEP` again | 201: `isTemporary: false`, `expiresAt: null`, `ACTIVE`, `disposition: "KEEP"`; the second 409 `E_RING_10` (it is permanent now) | ✅ |
| B58 | a lapsed temporary Ring | `MERGE` without `mergedIntoRingId`; into itself | 400 `E_RING_07` "MERGE requires a different ring of yours to merge into" | ✅ |
| B59 | — | `MERGE` into Omar's Ring; into a uuid that does not exist | 400 `E_RING_07` "That ring is not one of yours" | ✅ |
| B60 | a lapsed temporary Ring with Omar (window to 2026-12-31) and Eve; the target holds an old row for Omar that ended 2026-11-01 | `MERGE` into the target | 201: the source `ARCHIVED`, `disposition: "MERGE"`, `mergedIntoRingId` the target; on the target Omar's old row reactivated with the window to 2026-12-31 and Eve added, both `ACTIVE`; the source's rows `REMOVED` | ✅ |
| B61 | a lapsed temporary Ring | `AUTO_DELETE`; then `KEEP` | 201: `ARCHIVED`, `disposition: "AUTO_DELETE"`, `expiresAt` the moment of the call; listed under `?status=ARCHIVED`; the `KEEP` 201, back to `ACTIVE` and permanent (the owner changes their mind while it is still temporary, BI-08 step 8) | ✅ |
| B62 | — | disposition by Omar (admin), by the admin account | 404 `E_RING_02` | ✅ |
| B63 | a lapsed temporary Ring | `{ disposition: "DESTROY" }`; `{ disposition: "UNDECIDED" }` | 400 both "disposition must be one of the following values: KEEP, MERGE, AUTO_DELETE" (BI-08); the Ring unchanged | ✅ re-run 2026-11-08 on `main @ e483d49`: as expected ([[B-15 Disposition runs on a permanent Ring, the default included]], fixed; on `12172c6` "UNDECIDED" ran a KEEP) |
| B64 | a permanent Ring; the default Ring; a temporary Ring whose window has not ended | `AUTO_DELETE`, `KEEP`, `MERGE` | 409 `E_RING_10` "Only a temporary ring whose window has ended can be kept, merged or let go" each time, nothing changed (the default stays `ACTIVE`): disposition is for a temporary Ring after its window (BI-08 step 8, S8) | ✅ re-run 2026-11-08 on `main @ e483d49`: as expected ([[B-15 Disposition runs on a permanent Ring, the default included]], fixed; on `12172c6` the permanent Ring and the default were archived) |

### `GET /rings/shared-with-me` and `/count` — S3 Shared with me (s17)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B65 | Omar, a member of three of Sara's Rings | `GET /rings/shared-with-me` | 200, one row with exactly `ringId`, `pinName`, `displayName`, `avatarUrl`, `expiresAt`, `ringName`, `memberCount`; **no** `name`, `colorHex`, `type`, `style`, `ownerUserId`, `isDefault`, `status`, `purpose`, `joinPolicy` or any membership field | ✅ |
| B66 | the same row | — | `ringName: null`, `memberCount: null`: no Ring name or count today (D-18 waits on [[F-09 Ring Members]]) | ✅ |
| B67 | the same | `GET /rings/shared-with-me/count` | one row for Sara however many of her Rings; `ringId` is the Ring he was put in first (E-commerce Clients, D-15); `meta.total: 1` = `{ people: 1 }` | ✅ |
| B68 | the row | `GET /views/ring/:ringId` with its `ringId` | 200, the card, with the row's `pinName` and `displayName` ("Sara (Wholesale)", the Ring's name override) | ✅ |
| B69 | Gulf Expo then adds Omar to a Ring; the admin account adds him with a window that already ended | the list and the count | Gulf Expo first, then Sara (the newest sharing first); `total: 2` = `{ people: 2 }`; the lapsed membership not listed | ✅ |
| B70 | two people | `?limit=1&skip=1`; `?limit=51` | Sara only, `total: 2`; 400 | ✅ |
| B71 | — | `?name=Sara`, `?type=PERSONAL`, `?status=ACTIVE`, `?isTemporary=false` | 400 "property <name> should not exist" each: no Ring filter here | ✅ |
| B72 | Omar's membership in E-commerce Clients ends 2026-12-15, the Ring 2027-01-01 | the list | the row's `expiresAt` is 2026-12-15 (the earlier of the two) | ✅ |
| B73 | then E-commerce Clients expires | the list | Sara still listed, through the live Ring he was put in next (D-15), with that membership's end as `expiresAt` (Count Test on the first run, Merge Target on the second, where Omar's row there predates his Count Test row) | ✅ |
| B74 | then Omar's membership in each of her other Rings lapses | the list and the count | Sara gone; `total: 1`, `{ people: 1 }` | ✅ |
| B75 | a membership that starts in the future (Gulf Expo's Ring, start 2026-12-01) | the list | Gulf Expo not listed until then | ✅ |
| B76 | the admin account in two of Sara's Rings, the first temporary | the first's window ends and it is archived by `AUTO_DELETE`, then the second deleted | the row moves to the second Ring, then disappears; `{ people: 0 }` | ✅ |
| B77 | a block Omar → Sara; then Sara → Omar | both people's lists and counts; `GET /views/ring/:ringId` | each way, Sara leaves Omar's list and count and Omar leaves Sara's; the card answers 404 "This profile is not shared with you"; removing the block brings both back | ✅ |
| B78 | Sara (owner of many Rings, a member of one of Omar's); the admin account (in none of anyone's at that point); no token | the list and the count | Sara's list shows Omar only, never her own Rings; the stranger gets `[]` and `{ people: 0 }`; 401 | ✅ |

## State diagram

A Ring's life as the routes move it. `status` holds four values; **`EXPIRED` is never written**: "expired" is computed from `expiresAt` on every read.

```mermaid
stateDiagram-v2
  [*] --> Active: POST /rings, POST /rings/:id/copy (permanent, not default)
  Active --> Expired: expiresAt passes (status still ACTIVE)
  Expired --> Active: PATCH expiresAt null or later (owner, B27)
  Active --> Default: POST /rings/:id/default (refused for a temporary Ring, E_RING_09)
  Default --> Active: another Ring made default
  state "Temporary, lapsed" as Lapsed
  Active --> Lapsed: isTemporary and expiresAt past
  Lapsed --> Active: disposition KEEP (permanent, no window)
  Lapsed --> Archived: disposition MERGE (members moved, mergedIntoRingId)
  Lapsed --> Archived: disposition AUTO_DELETE (expiresAt now; purge not written)
  Archived --> Active: disposition KEEP while still temporary (change of mind, B61)
  Active --> Deleted: DELETE /rings/:id (soft)
  Default --> [*]: DELETE refused, 409 E_RING_04
  Default --> [*]: disposition refused, 409 E_RING_10
  Deleted --> [*]: every route 404 E_RING_02
```

What each state means to someone else: a **member** reads the Ring (Shared with me, its card) only while it is Active or Default and not Expired, and only within their own window; the **owner** reads and edits it in every state but Deleted. Disposition from Active (a permanent Ring, or a temporary one still live) or Default is 409 `E_RING_10` (B64).

## Error matrix

| Situation | Status | ErrorCode (contract) | Message today | Same body as |
|---|---|---|---|---|
| Name already used by this owner (create, edit, copy) | 409 | `E_RING_01` | "You already have a ring with this name" | — |
| `type` `EVENT`, `MINI_EVENT`, `MEETING` on create | 400 | `E_RING_01` | "<TYPE> rings are created by their own flow, not directly" | — |
| Not your Ring, a member's or an admin's read, no such Ring, deleted Ring; any non-owner on set-default, copy, disposition, delete | 404 | `E_RING_02` | "Ring not found" | each other (B25, B47, B53, B55, B56, B62) |
| Deleting the default Ring | 409 | `E_RING_04` | "Set another ring as default before deleting this one" | — |
| `PATCH` by someone who is not the owner nor an admin at `CONTENT_MANAGER` or above | 403 | `E_RING_05` | "You are not permitted to administer this ring" | `GET /rings/:id/members` by a member (B39) |
| `parentRingId` not yours or missing | 400 | `E_RING_06` | "That ring is not one of yours" | each other (B18) |
| `MERGE` without a target or into itself | 400 | `E_RING_07` | "MERGE requires a different ring of yours to merge into" | — |
| `MERGE` into a Ring not yours or missing | 400 | `E_RING_07` | "That ring is not one of yours" | B18's body |
| `profileId` not yours | 400 | `E_RING_08` | "That profile is not one of yours" | — |
| A temporary Ring as default; the default made temporary | 409 | `E_RING_09` | "A temporary ring cannot be your default ring" | each other (B50, B51) |
| Disposition on a permanent Ring, the default, or a temporary Ring whose window has not ended | 409 | `E_RING_10` | "Only a temporary ring whose window has ended can be kept, merged or let go" | each other (B57, B64) |
| Validation: name length, `colorHex` not `#RRGGBB`, dates, `purpose` empty after trim or over 140, a boolean other than `true` / `false`, `null` on a field that does not clear, unknown `joinPolicy`, `disposition` outside the three (`UNDECIDED` included), `limit` over 50, an unknown key, a Ring filter on Shared with me | 400 | — | an array naming the field | — |
| No token | 401 | — | "Unauthorized" | — |

## Privacy and access checks

- A member, a delegated admin and a stranger get the **same 404 body** on `GET /rings/:id` as for a Ring that does not exist (B25): an owned Ring is never readable by anyone else, and the response does not say whether it exists.
- `PATCH /rings/:id` answers 403 `E_RING_05` to a member or a stranger on an existing Ring and 404 on a missing one (B29), as BI-08 step 5 says; it tells a member nothing beyond the `ringId` they already hold from Shared with me, and the 403 body carries no Ring data.
- Shared with me never carries the Ring's name, colour, type, style, settings, the owner's user id or the member's own row (B65, B66), and refuses every Ring filter (B71) so it cannot be used to test which Ring one is in. A person in several of someone's Rings sees one row (B67).
- Blocks hold both ways on the list, the count and the card (B77), and on the owner's `memberCount` (B10).
- An expired Ring stays editable by its owner (B27) and leaves its members' Shared with me (B73).
- Copy never carries members, admins or the window (B42, B49).
- A privacy switch is never turned on by a value that is not `true`: the string `"false"` reads as off, anything else is refused (B37; on `12172c6` `"false"` turned it on, [[B-13 The string false is read as true on Ring filters and settings]]).
- The default Ring cannot be archived through disposition (B64), as it cannot be deleted (B54).

## Verdict

- Run on: 2026-11-08 · build: backend `main @ e483d49` (localhost:3111, Node 22.22.2, a fresh throwaway database `social_pin_qa_f11`, dropped after) · result: **passing**, 78 of 78 rows as expected · failing rows: none · story parts unmet: none · bugs: [[B-13 The string false is read as true on Ring filters and settings|B-13]] (B4, B37), [[B-14 PATCH a Ring with null on a required field answers 500|B-14]] (B30), [[B-15 Disposition runs on a permanent Ring, the default included|B-15]] (B63, B64), [[B-16 Ring colour and purpose accept values the contract refuses|B-16]] (B22, B36) re-tested and closed `done`, `resolution: fixed`.
- Previous run: 2026-11-05 on backend `main @ 12172c6`, failing, 71 of 78 (the seven rows above differed; the four bugs were filed from them).
- Set up with SQL in the throwaway database only, on both runs: the two delegated admins, every block (B10, B77), and the membership windows moved after the fact (B9, B72, B74, B75).
- Observed, within the contract: a `KEEP` on the **source of a MERGE** (still temporary, window ended) answers 201 and brings it back `ACTIVE` and permanent with no members (they stay on the target) and `mergedIntoRingId` still set. BI-08 step 8 allows changing one's mind "while the Ring is still temporary", so it is not counted as a failure; whether a merged Ring should be revivable is the product's to say.
- Backend side of [[S-18 Rings Story]]: QA Backend passing with nothing pending or unmet. The story is not ready to fulfil until its QA Frontend is written and passes. Not delivered yet, and not counted as failures: Ring names and counts on Shared with me for a Ring joined knowingly (F-09), and the enforcement of `joinPolicy`, `requireApproval`, `membersCanInvite`, `membersCanSaveAttachments` (F-17).

## Log

- 2026-11-05 · written (78 rows) and run on backend `main @ 12172c6`: failing, 7 rows differ, B-13 to B-16 filed against [[BI-08 Rings Backend Integration]].
- 2026-11-05 · flagged [[BD-11 Rings Backend Delivery]]: QA run on backend main 12172c6 (failing, 71/78): the isTemporary=false filter returns temporary Rings and a string 'false' turns a setting on (B-13); PATCH null on a required field is 500 (B-14); disposition runs on a permanent Ring and the default, and UNDECIDED acts as KEEP (B-15); colorHex and an empty purpose are not refused (B-16). Bugs filed against BI-08 for /backend
- 2026-11-08 · re-run on backend `main @ e483d49`: passing, 78 of 78. B4, B22, B30, B36, B37, B63, B64 now as expected (rows reworded to BI-08's 2026-11-08 text: string booleans, `null` on the fields that clear, `E_RING_10`); the other 71 unchanged. B-13 to B-16 closed on their own branches; `pending` cleared; the BD-11 flag line cleared.
