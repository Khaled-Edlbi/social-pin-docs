---
id: FD-12
type: frontend-delivery
module: identity
feature: rings
status: done
scope: feature
deployedTo: []
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s27, s62]
owner: "Omar Fostok"
depends: ["BI-08 Rings Backend Integration"]
affects: []
related: ["FR-11 Rings Frontend Requirements", "S-18 Rings Story", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "D-28 Scan someone in is not in the MVP", "FD-06 Counts Frontend Delivery", "FD-10 Ring Access Engine Frontend Delivery", "FD-11 Ring Projection Frontend Delivery", "F-17 Ring Invitations & Join", "S-23 Connections Story", "S-31 Delegated Admins Story", "S-33 Ring Invitations & Join Story", "E_RING_09", "E_RING_10"]
pending: ["[[S-18 Rings Story]]: S1 and the motion list, a new Ring forming and taking its place in the carousel, a deleted Ring collapsing out (not built; only s62's motion is)"]
created: 2026-11-08
updated: 2026-11-11
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Rings · Frontend Delivery

**Feature:** [[F-11 Rings]] · **Status:** Done · **Built from:** [[BI-08 Rings Backend Integration]] · **Against:** [[S-18 Rings Story]] · **Requirements:** [[FR-11 Rings Frontend Requirements]] · **QA:** [[Rings QA Frontend]]

What the client shipped for owning Rings. On `social_pin` `main`: real Rings created, edited and deleted (`bdc8d18`, 2026-10-21), when a Ring is open and the default on Access (`00407c0`, `6970819`), one Edit Ring screen (`e2dd0ec`). On `rings/F-11/honest-rings` @ `bf5b5ae` (2026-11-08), not on `main` yet: ended Rings that say so (`acbd1ee`), Shared with me from the API's person rows, the six Ring settings, Copy an existing Ring, and the after-event choice. On the same branch @ `0005f00` (2026-11-09, with `f801aaa`, `dde0533`, `f9c19e3`), not on `main` yet: no sample Rings anywhere (loading and error states instead), the wizard's Access settings and connections, Event Ring end required, s08 templates, the Ring icon, `E_RING_09` / `E_RING_10`, the post-event motion, and Shared with me with invitations, join codes and named rows ([[F-17 Ring Invitations & Join]] owns those flows). On the same branch @ `dbef63e` (2026-11-11), not on `main` yet: the join option reads "Anyone with a join code or its QR" everywhere ([[D-28 Scan someone in is not in the MVP]]), and the Ring name line on s09 and s18. Counts are in [[FD-06 Counts Frontend Delivery]], what a Ring shows in [[FD-11 Ring Projection Frontend Delivery]]. The QA checklist is SH-03 and RS-01…RS-04 in the client's `docs/TEST_CASES_2026-10-18.md`, with the Maestro Ring flows (`3b82dc6`).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s08\|s08]], [[Screen Index#s09\|s09]] First Ring | ✅ | At sign-up: the Pin is live, then a first Ring named and coloured, with what it shows ([[FD-05 Auth & Sign-up Frontend Delivery]]). s08 names your default Ring from `GET /rings` and offers the three **templates** (Work picked by default, Events, Personal), which only pre-fill s09's name, rows and end (Events: 7 days); nothing is sent before "Create Ring". Under s09's name field: "Only you see this name, unless someone joins it with an invitation or a code." (ar "أنتم وحدكم ترون هذا الاسم، إلا إذا انضمّ إليها أحد بدعوة أو برمز."); the partial sentence is gone from the body. |
| [[Screen Index#s16\|s16]] My Rings | ✅ | Real Rings only: until `GET /rings` (or the saved copy) answers, a loading state; a failed first read, an error with *Try again* and "—" for the count; no sample Ring or number anywhere (Home, the picker and the switcher too). Default first, then newest; DEFAULT, EVENT, "expires 16 Mar", "ended 16 Mar"; who it's for under the name; each Ring's icon on its avatar. An ended event Ring still undecided shows **DECIDE** and "This event has ended — decide what happens". Archived Rings leave the list. "Join" opens s74 to join with a code ([[F-17 Ring Invitations & Join]]). |
| [[Screen Index#s17\|s17]] Shared with me | ✅ | People, from the API's person rows, one per person, never a Ring's colour or type; a row whose `ringName` is set (joined knowingly) is **named**: "Acme Team" over "Shared by Acme Studio", "· N people" only when `memberCount` is sent ([[D-18 Ring names shown when joined knowingly]]); empty state "Nothing shared with you yet". Above the people, my pending invitations with *Review invite*, then my join requests; "Join with a code" below; the flows behind them are [[F-17 Ring Invitations & Join]]'s. Tapping a row opens their card ([[FD-10 Ring Access Engine Frontend Delivery]]). |
| [[Screen Index#s18\|s18]]–[[Screen Index#s21\|s21]] New Ring | ✅ | Step 1: name (under it the same line as s09: "Only you see this name, unless someone joins it with an invitation or a code."), colour and **icon** (kept in `style` as `{ "icon": … }`, other `style` keys left as they are), who it's for, Blank, Copy or **Event Ring**, whose end is required (Next and Create wait for it; the start is optional). Step 2: my connections (`GET /connections`, searched on the server, *All* / *No Ring yet*), **picked people as chips** with ×, kept across a search; added once the Ring exists; *Invite* is [[F-17 Ring Invitations & Join]]'s. Step 3: what it shows from the library. Step 4: bio and photo, and **Access**: Expiry (the dates sheet, the same dates as step 1's), who can request to join, members see each other; a setting is sent only when it differs from D-04's default; the join choices and the wizard's summary read as on Edit Ring. **Copy an existing Ring** on step 1: pick one → "Create copy" (settings, colour, bio, photo and what it shows; never its people). |
| [[Screen Index#s22\|s22]], [[Screen Index#s26\|s26]], [[Screen Index#s27\|s27]] → Edit Ring | ✅ | One screen: name, colour and icon, who it's for (≤ 140, "Only you see this"); Starts and Expires (an end on the default Ring is refused before Save: `E_RING_09`); "Make this my default Ring", or "This is your default Ring" on the default; delete, **off on the default Ring** (a tap says to choose another default first, no confirm); **Delegated admins** only on a company Ring, as coming soon ([[S-31 Delegated Admins Story]]); Invitations and Join codes rows ([[F-17 Ring Invitations & Join]]; codes hidden under "only by invitation"); and **the six settings** ([[D-04 Ring settings at launch and their defaults]]): who can request to join (**anyone with a join code or its QR** / only with a code or invitation / only by invitation; ar "أي شخص لديه رمز انضمام أو رمز QR الخاص به"; no scan or badge wording in any policy label, en or ar, here, in the policy sheet or in Ring detail's WHEN AND WHO), approve each one, members see each other's cards, members can invite, members can save files, who it's for. Members seeing each other and inviting act today; saving attachments says when it takes effect. "Only the Ring's owner can change these." |
| [[Screen Index#s62\|s62]] Event ended | ✅ | From DECIDE: **Keep it** (a regular Ring, no end date), **Merge into…** (pick another of my Rings; everyone moves with the same dates; this one is archived), **Let it go** (archived, everyone loses access), each confirmed; or Later. Once saved, the Ring's avatar plays the choice: Keep pulses and stays, Merge slides into the other Ring, Let it go collapses out; a fade under reduced motion. A 409 `E_RING_10` (stale Rings) reloads my Rings. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings` | s16, Home, the wizard's copy list | Every page loaded; reloaded after create, copy, edit, delete and a disposition. |
| `GET /rings/shared-with-me` | s17 | The person rows as sent, `ringName` and `memberCount` only as sent; no view call per person. Read again when the tab gains focus and after an accept, decline, dismiss or join. |
| `GET /connections` | New Ring, step 2 | Searched on the server as you type; *No Ring yet* filter. |
| `POST /rings` | s09, New Ring | Name, colour, `style` (the icon), `isTemporary` (an Event Ring, or any end date) and the dates, `purpose`; `joinPolicy` and `membersCanSeeEachOther` only when they differ from D-04's defaults. Then what it shows ([[FD-11 Ring Projection Frontend Delivery]]), then `POST /rings/:ringId/members` per picked person, one by one (a refusal is counted, never fails the Ring). |
| `POST /rings/:id/copy` | New Ring, step 1 | The new name ("<Ring> copy" proposed). A gone source → "That Ring is gone. Pick another one." |
| `PATCH /rings/:id` | Edit Ring | Only what changed: name, colour, `style`, `purpose`, `startsAt` / `expiresAt` (`null` clears), the settings. 409 `E_RING_09` (the default made temporary elsewhere): a snack bar, my Rings reloaded. |
| `POST /rings/:id/default` | Edit Ring | After a confirmation; a temporary Ring is refused by the app first, and 409 `E_RING_09` says "A temporary Ring can't be your default." |
| `DELETE /rings/:id` | Edit Ring | Behind a confirmation. |
| `POST /rings/:id/disposition` | s62 | `KEEP`, `MERGE` with `mergedIntoRingId`, `AUTO_DELETE`; a refused merge target → "That Ring can't take them. Choose another of your Rings."; 409 `E_RING_10` → my Rings reloaded. |

## State kept on the client

- One list of my Rings for the app's lifetime, saved on the phone and shown first at startup; replaced on every reload. Its status (loading, loaded, failed) drives every screen that lists Rings; there are no sample Rings left in the app.
- The wizard's draft lives until it closes; nothing is sent before the last step (or Create copy).

## Deviations from the story or the integration note

- **New Ring creates the Ring at the end, not in step 1** (S4), so Cancel has nothing to delete; Copy creates it at once from step 1.
- **Who is in it (s19) adds people after Create**, not as they are picked (S4 adds each with `POST …/members` on a Ring made at step 1); its note no longer says "by scanning them in" (not in the MVP, D-28).
- **s08's templates leave off what s09 has no row for**: Work's and Events' Email and Personal's photo (S1's table switches them on).
- **s22, s26 and s27 are one Edit Ring screen**, as [[S-31 Delegated Admins Story]] now describes; the Delegated admins row shows on a company Ring only (S-31 A1), still coming soon.
- **A temporary Ring can't be the default**: refused by the app first, and by the backend with 409 `E_RING_09` (S7).
- **The join choice "anyone who scans" (S9) reads "Anyone with a join code or its QR"** in the wizard (s21), its summary, Edit Ring, the policy sheet and Ring detail's WHEN AND WHO: nobody joins a Ring by scanning a badge in the MVP ([[D-28 Scan someone in is not in the MVP]]); the value sent is unchanged.
- **Motion**: only s62's choice animates; a new Ring forming in the carousel and a deleted Ring collapsing out are not built (pending).

## Not done yet

- A new Ring forming and a deleted Ring collapsing out (S1, *States and motion*) → `pending`.
- Admins changing the settings → [[S-31 Delegated Admins Story]]; until then only the owner can.
- Members saving attachments: the setting is saved, the save flow is [[F-17 Ring Invitations & Join]]'s.

## Log

- 2026-10-21 · `main` @ `bdc8d18` (social_pin) · create, rename, recolour and delete real Rings; Maestro Ring flows `3b82dc6` · flagged nothing
- 2026-11-03 · `main` @ `00407c0`, `6970819` · when a Ring is open; make a Ring the default · flagged nothing
- 2026-11-04 · `main` @ `e2dd0ec` · Edit a Ring in one screen · flagged nothing
- 2026-11-04 · `rings/F-11/honest-rings` @ `acbd1ee` · ended Rings say so; Join said what wasn't there yet · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `bf5b5ae` (social_pin, not on `main` yet) · Shared with me from person rows; the six settings; who it's for; Copy an existing Ring; DECIDE → Keep / Merge / Let it go; SH-03, RS-01…RS-04 · flagged nothing
- 2026-11-09 · app branch `rings/F-11/honest-rings` @ `0005f00` (with `f801aaa`, `dde0533`, `f9c19e3`; social_pin, not on `main` yet) · S1 (s08 templates pre-fill s09), S2 (no sample Rings, loading and error states, Ring icon), S3 (named Shared with me rows, invitations and join codes on s17 for [[F-17 Ring Invitations & Join]]), S4 (icon in `style`, Event Ring end required, connections picked as chips, step 4 Access), S6 (Delete off on the default, Delegated admins on company Rings only), S7 (`E_RING_09`), S8 (post-event motion, `E_RING_10`), S9 · s08, s09, s16, s17, s18–s21, s22/s26/s27, s62 · flagged [[S-18 Rings Story]], [[BI-08 Rings Backend Integration]]; FR-11's four flags cleared, its rows updated · pending: the new-Ring and delete motion
- 2026-11-11 · app branch `rings/F-11/honest-rings` @ `dbef63e` (social_pin, not on `main` yet) · S9 and S4 (join option "Anyone with a join code or its QR", en and ar, in s21, the wizard summary, Edit Ring, the policy sheet and Ring detail's WHEN AND WHO; D-28), S1 and S4 (the Ring name line under the name on s09 and s18; s22 already right, S5) · s09, s18, s21, s22 · tests `join_policy_labels_test` (new), `ring_data_view_test`, `new_ring_wizard_test`, `first_ring_test`, `edit_ring_states_test` · flagged [[S-18 Rings Story]] (S9's "anyone who scans" label)
