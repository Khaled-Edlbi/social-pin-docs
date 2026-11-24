---
id: S-03
type: story
module: identity
feature: counts
status: verified
scope: feature
screens: [s11, s12, s14, s16, s17, s68]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "Omar Fostok"
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "S-33 Ring Invitations & Join Story", "BI-17 Ring Invitations & Join Backend Integration", "S-11 Photo Library Story", "GET /connections/count"]
created: 2026-10-18
updated: 2026-11-24
tags: [story, story/verified, module/identity, layer/business]
---

# Counts · User Story

**Feature:** [[F-03 Counts]] · **Status:** Fulfilled 2026-11-24 by Omar Fostok (approved 2026-10-25 by khaled) · **Frontend Requirements:** [[FR-03 Counts Frontend Requirements]] · **API Integration:** not yet (backend not built)

A Ring owner glances at Home or My Rings and wants a sense of scale: how many people each Ring reaches ("148 people"), how many Rings they own and how many people share with them, and, on Me, how many connections they have (the Connections tile on the profile card). The numbers are derived from data that exists today; what is missing is a way to read them.

**Task stories:** [[S-03 Counts Story|Counts · S6–S10]] (Counts · S6–S10: the member count in S1, S2, S3 and S5). S4 waits on [[S-03 Counts Story|Counts · S11]].

## Persona

A Ring owner on Home ([[Wireframe Brief#Home — Rings hub + active profile|§4.1]]) or My Rings ([[Wireframe Brief#Ring management|§4.2]]) deciding which Ring to make active, or checking on Me how their network has grown. Counts are read-only and owner-facing.

## Stories

### S1 · Recent Rings on Home ([[Screen Index#s11|s11]], [[Screen Index#s12|s12]])

**As a** Ring owner **I want** each of my Rings listed under *Recent Rings* on Home to show how many people are in it **so that** I know which audience I am about to broadcast to.

Acceptance criteria:
- [ ] Each owned Ring card shows "N people"; the count includes live members only (both windows open, not removed).
- [ ] Until the count ships, the card shows the name and colour without a number, not "0 people".
- [ ] "All N" on the *Recent Rings* header is the number of Rings I own, `meta.total` of `GET /rings`, which exists today; never a fixed number.
- [ ] Switching Rings re-composes the profile; the count moves with its card.

### S1b · The Ring picker (Home → the *My badge* card; a sheet, no screen id)

**As a** Ring owner **I want** each of my Rings in the picker to show how many people are in it **so that** I choose the audience my badge and "go visible" are for knowing its size.

Acceptance criteria:
- [ ] Each of my own Rings in the sheet shows "N people", live members only, from the same number as S1 ([[S-03 Counts Story|Counts · S6–S10]]).
- [ ] Until the count ships, the Ring shows its name and colour with no number, never "0 people".
- [ ] Only my own Rings are in the picker; a Ring shared with me never appears with a count.

### S2 · My Rings and Shared with me tabs ([[Screen Index#s16|s16]], [[Screen Index#s17|s17]])

**As a** Ring owner **I want** the tab chips to read "My Rings · 5" and "Shared with me · 2" **so that** I can see both sides of my network at a glance.

Acceptance criteria:
- [ ] "My Rings · N" is `meta.total` of `GET /rings`; "Shared with me · N" counts the **people** who share with me right now, one per person, since Shared with me lists people, not Rings ([[D-14 Shared with me lists people, never the Ring]]). Not available yet: `meta.total` of `GET /rings/shared-with-me` counts live Rings today, so someone sharing two Rings counts twice.
- [ ] Each owned Ring row shows "N people" when the member count exists.
- [ ] A row on Shared with me is a person. It shows "· N people" only when the Ring lets members see each other: the server sends `memberCount` on a row only then (a Ring I joined knowingly, with `ringName` set, [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S1]]). When `memberCount` is `null`, which includes a Ring I was placed in, the row shows no number.
- [ ] The shared count can change without any action of the viewer; it refetches on screen focus.

### S3 · Ring data header ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** "People · 148" on the Ring's detail **so that** I can open the roster knowing how large it is.

Acceptance criteria:
- [ ] The "People" row shows the live member count and leads to s15.
- [ ] Until the count ships, the row reads "People" with no number; it still leads to the roster.
- [ ] The count refetches after any add, reassign or revoke on s15 / s47.

### S4 · Connections on Me ([[Screen Index#s68|s68]])

**As a** user **I want** a Connections tile on my profile card on Me **so that** I see how many people I have exchanged access with.

**Me only**, decided 2026-10-27 by omar: Home shows no connections count. The wireframe brief lists a "connections counter" on Home (§4.1), but the Home screens (s11, s12) have none; this story follows the screens. [[S-03 Counts Story|Counts · S11]] keeps its title but covers Me only.

**Three tiles**, decided 2026-11-24 by Omar Fostok: since the Me redesign (app `776e6ca`) the profile card shows three tiles, Rings · Connections · Photos, in place of the line "2 Rings · 218 connections"; the tiles stay.

Acceptance criteria:
- [ ] Under the name, the profile card shows three tiles, **Rings**, **Connections** and **Photos**, each a number over its label; each opens its list (My Rings [[Screen Index#s16|s16]], Contacts, the Photo library).
- [ ] A count that isn't known yet (still loading, or not read) shows "–" in its tile: never 0 and never a sample number.
- [ ] The Connections tile is the number of accepted connections, not the sum of Ring members ([[S-03 Counts Story|Counts · S11]]).

### S5 · Counts stay honest after changes (journey, no prototype screen)

**As a** Ring owner **I want** the numbers to reflect expiry and revocation **so that** a lapsed member is not counted as reach.

Acceptance criteria:
- [ ] A member whose window closed, or whose Ring expired, is not counted; the count follows the same live filter the access engine uses.
- [ ] A reassign moves one unit from the source Ring's count to the target's on the next fetch.

### S6 · How many people are in each of my Rings ([[Screen Index#s16|s16]])

*From T-004 Member count per Ring on list and detail (status then: To do), merged 2026-10-27.*

**As a** Ring owner **I want** each Ring on My Rings to show "N people" **so that** I compare my audiences at a glance.

Acceptance criteria:
- [ ] Every owned Ring in `GET /rings` carries `memberCount`; each row shows it.
- [ ] A Ring with no members shows "0 people": a real zero, now that the number is known.

### S7 · The Ring I'm on says how big it is ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** "People · N" on a Ring's screen and "N in Ring" on its header and switcher chips **so that** I open the roster knowing its size.

Acceptance criteria:
- [ ] `GET /rings/:id` carries `memberCount`; the header, each switcher chip and the People row show it.
- [ ] The People row still leads to [[Screen Index#s15|s15]].

### S8 · Choosing a Ring on Home ([[Screen Index#s11|s11]], [[Screen Index#s12|s12]])

**As a** Ring owner **I want** each Ring card on Home and in the Ring picker to show "N people" **so that** I know who I'm about to show my badge or broadcast to.

Acceptance criteria:
- [ ] The cards use the same `memberCount` as My Rings; no extra request per Ring.

### S9 · The number is honest

**As a** Ring owner **I want** the count to include only people who can see the Ring now **so that** a lapsed member isn't counted as reach.

Acceptance criteria:
- [ ] A member who was removed, left, is pending, or whose access window closed is not counted; nor is anyone once the Ring has expired.
- [ ] The count matches what the access engine lets people see (the same live filter), not the `ACTIVE` rows of the roster.
- [ ] After an add, remove or reassign, the next fetch of the Ring has the new number.

### S10 · Only the owner sees it

**As a** Ring member **I want** the size of someone else's Ring kept private **so that** membership isn't revealed.

Acceptance criteria:
- [ ] `memberCount` is on the owner's Rings (`GET /rings`, `GET /rings/:id`).
- [ ] On `GET /rings/shared-with-me`, a member gets `memberCount` only on a row whose Ring lets members see each other. That is a Ring setting, off by default ([[D-04 Ring settings at launch and their defaults]]). Otherwise it is `null` and no number shows.

### S11 · Connections on Me ([[Screen Index#s68|s68]])

*From T-005 Connection count on Me and Home (status then: To do), merged 2026-10-27.*

**As a** user **I want** the Connections tile on my profile card on Me to show N **so that** I see how many people I have exchanged access with.

Acceptance criteria:
- [ ] The profile card has three tiles (S4): **Rings** is `meta.total` of `GET /rings`; **Connections** is `connections` from `GET /connections/count`; **Photos** is `meta.total` of `GET /files?kind=image` ([[S-11 Photo Library Story]]).
- [ ] N counts **people I have an accepted connection with**, once each, however many of my Rings they are in ([[D-15 Several Rings per connection, remove or disconnect]]).
- [ ] Someone I removed from all my Rings but kept as a connection ("Remove from Rings") still counts; someone I **disconnected** does not.
- [ ] Pending, declined, cancelled and expired requests don't count ([[D-17 Requests expire after 30 days, optional note, ask again at once]]).
- [ ] Until the count is read, the Connections tile shows "–": not "0", not a sample number. Once read, 0 is a real zero and shows "0".
- [ ] The number is mine only: nobody else ever sees how many connections I have.
- [ ] It refetches when Me opens and after I accept a request or disconnect someone.

## States and motion the design asks for

- State: counts on carousel cards, tab chips and the Ring data header; a shared Ring card shows no member count.
- State: empty ("Nothing shared with you yet", the app's copy, as in [[S-18 Rings Story]] and [[S-33 Ring Invitations & Join Story]]; decided 2026-11-24 by Omar Fostok) when the shared count is 0.
- Motion: counts ride on their cards during the Ring re-compose; no counter animation is asked for.
- (Counts · S6–S10) Known: "N people", "N in Ring", "People · N", with "0" a real zero.
- (Counts · S6–S10) Not known yet (before this ships, or while loading): no number. The app shows "—" in the number's place today ("— people", "— in Ring"); never "0".
- (Counts · S6–S10) Motion: none; the count moves with its card when the Ring changes.
- (Counts · S11) State: each tile shows "–" until its count is read, then the number; 0 is a real zero and shows "0".
- (Counts · S11) Motion: none asked for.

## Rules the backend already enforces

- Access is resolved per request against `now`; a member count must apply the same `membershipLiveFilter` / `ringLiveFilter` logic or it will disagree with what viewers can actually see.
- Membership is private to the owner. "Members can see each other" is a Ring setting, off by default ([[D-04 Ring settings at launch and their defaults]], not available yet); while it is off, nothing on the member's side counts the Ring's members.
- `GET /rings/shared-with-me` already returns only live-accessible Rings, so its `meta.total` is a truthful "Shared with me · N".
- Connections are counted by `GET /connections/count` since backend `main` `1c460b0` (2026-11-08, [[BD-03 Counts Backend Delivery]]).
- (Counts · S6–S10) Access is resolved per request against `now`; a member is live only while both the membership's and the Ring's windows are open (`membershipLiveFilter`, `ringLiveFilter`). The count must use the same filters.
- (Counts · S6–S10) The roster (`GET /rings/:ringId/members`) is owner or delegated-admin only, and `status=ACTIVE` still includes members whose window has lapsed; that's why its `meta.total` is not the count.
- (Counts · S6–S10) Membership is private to the owner.
- (Counts · S11) `GET /connections/count` → `{ "connections": N }`, my accepted connections, each person once, equal to `meta.total` of `GET /connections` ([[BD-03 Counts Backend Delivery]]).
- (Counts · S11) Every visibility decision goes through `RingAccessService`; a count is owner-facing and never part of a view or a perspective.

## Open questions

- Whether the member count rides on `RingEntity` (`memberCount`) or on a separate stats endpoint is left open in [[S-03 Counts Story|Counts · S6–S10]]; the client prefers it on the entity so the list needs one call.
- Whether members of a Ring with "members can see each other" on see a member count: D-04 says they see each other's full cards, and the count follows from that list; not asked separately ([[D-04 Ring settings at launch and their defaults]], *Still open*). Answered by the backend and the app: on Shared with me, "· N people" shows only on a row whose Ring lets members see each other (S2, S10).
- (Counts · S6–S10) **On the Ring, or a stats endpoint.** The task allows either. The app asks for `memberCount` on `RingEntity` in both `GET /rings` and `GET /rings/:id`: one request for the whole list, no call per Ring.
- (Counts · S6–S10) **"N added today"** on Home ("148 people · 2 added today") isn't in this task. Either a second number here, or dropped from the design.
- (Counts · S6–S10) **My Rings wording.** The design says "148 connections" on My Rings rows and "148 people" elsewhere for the same number; one word should be chosen.
- (Counts · S11) Whether the count rides on `GET /users/me`, on a stats endpoint, or on the connections list's `meta.total` is for the backend to choose in Counts · S11; the client needs one number and no extra list call on Me.
- (Counts · S11) The task keeps its title "on Me and Home"; Home is out by the 2026-10-27 decision.

## Log

- 2026-11-24 · `tickets/pm/M-01-identity/F-03-counts/S-03-fulfilled` · **fulfilled** on Omar Fostok's word: [[QB-07 Counts QA Backend]] and [[QF-08 Counts QA Frontend]] both passing with nothing pending or unmet (QF-08: 39 of 39 on `social_pin` `main` `866240a`)
- 2026-11-24 · `tickets/pm/M-01-identity/F-03-counts/S-03-empty-state` · States: the Shared with me empty state is "Nothing shared with you yet", not "No Rings shared with you yet". Decided by Omar Fostok 2026-11-24: keep the app's wording, which S-18 and S-33 already use; nothing in the app changes. Records what shipped, so the story stays approved. Answers [[QF-08 Counts QA Frontend]]'s pending entry (CT-14 already passes on these words; /qa clears it)
- 2026-11-24 · flagged [[QF-08 Counts QA Frontend]]: the same
- 2026-11-24 · `tickets/pm/M-01-identity/F-03-counts/S-03-me-tiles` · S4 and S11: the Me profile card's three tiles, Rings · Connections · Photos (app `776e6ca`), in place of "2 Rings · 218 connections"; "–" in a tile until its count is read, never 0 or a sample; connections exist since `1c460b0`, so "hidden until connections exist" is gone. Kept by Omar Fostok 2026-11-24; records what shipped, so the story stays approved
- 2026-11-24 · flagged [[FR-03 Counts Frontend Requirements]], [[FD-06 Counts Frontend Delivery]], [[BI-14 Counts Backend Integration]], [[F-03 Counts]]: the same
- 2026-11-12 · `tickets/pm/M-01-identity/F-03-counts/S-03-app-778d9b4` · S2, S10 and the open question: "· N people" on Shared with me only when the Ring lets members see each other (the server sends memberCount only then); the "never" wording is gone. Decided by Omar Fostok 2026-11-11, app 778d9b4
- 2026-11-12 · flagged [[FR-03 Counts Frontend Requirements]], [[BD-03 Counts Backend Delivery]], [[BI-14 Counts Backend Integration]], [[FD-06 Counts Frontend Delivery]], [[QB-07 Counts QA Backend]]: the same

