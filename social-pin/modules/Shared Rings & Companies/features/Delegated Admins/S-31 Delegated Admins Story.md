---
id: S-31
type: story
module: shared-rings
feature: delegated-admins
status: draft
scope: feature
screens: [s15, s16, s22, s26, s27, s69, s73]
approvedBy: ""
approvedAt: ""
owner: "Omar Fostok"
depends: []
affects: ["S-18 Rings Story", "S-16 Ring Members Story", "S-29 Companies Story", "S-15 Ring Access Engine Story", "S-96 Notifications Story"]
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "D-32 Several join codes per Ring", "D-33 Work email joining waits for real emails and Companies", "D-35 A join code can be shown as a QR", "FD-12 Rings Frontend Delivery", "BD-11 Rings Backend Delivery", "BD-09 Ring Members Backend Delivery", "S-29 Companies Story", "S-33 Ring Invitations & Join Story", "Ring Access Model"]
pending: []
created: 2026-10-18
updated: 2026-11-16
tags: [story, story/draft, module/shared-rings, layer/business]
---

# Delegated Admins · User Story

**Feature:** [[F-16 Delegated Admins]] · **Status:** Draft (awaiting product sign-off; first approved 2026-10-25 by khaled, rewritten 2026-11-05) · **Frontend Requirements:** [[FR-16 Delegated Admins Frontend Requirements]] · **Backend Integration:** not yet · **Verified by:** [[Delegated Admins QA Backend]], [[Delegated Admins QA Frontend]]

> **Rewritten 2026-11-05.** The earlier story (S1–S6, approved 2026-10-25) was built on two design screens, Edit · access (s26) and Edit · permissions (s27), that the app has since merged into one **Edit Ring** screen; admins and joining sit behind its *Joining and permissions* row, shown as *Soon* today. It also reached a managed Ring "from the shared-Rings list", which [[D-14 Shared with me lists people, never the Ring]] rules out, and picked admins among connections, which the Companies rules ([[S-29 Companies Story|S-29 P1]]) no longer fit. This version follows the app, the backend as it is ([[BD-16 Delegated Admins Backend Delivery]]: `RingAdmin` and its levels enforced, no routes), and seven rules decided by Omar Fostok on 2026-11-05, recorded **in this story** under *Decided in this story* (A1–A7), on purpose without decision cards. The old S6 (the merged task T-006, four routes) is now *What the backend has to build*.

> **Updated 2026-11-16** to the app ([[FD-12 Rings Frontend Delivery]], `rings/F-11/honest-rings` @ `778d9b4`) and the decisions since: there is no *Joining and permissions* screen and no *Soon* row any more. The six settings are on **Edit Ring** itself (s22, which merges s26 and s27), invitations and join codes on the Ring's **People tab** (s15), and, decided by Omar Fostok on 2026-11-16 (A8), the **ADMINS** section lives on that People tab too. The work email domain is out of this version ([[D-33 Work email joining waits for real emails and Companies|D-33]]); join codes and their QR are part of managing who's in it ([[D-32 Several join codes per Ring|D-32]], [[D-35 A join code can be shown as a QR|D-35]]).

A company Ring is too big for one person to run. The owner hands parts of the job to colleagues at a level: one may edit what the Ring shows, another may also manage who is in it. The owner stays the owner; admins act on the owner's Ring, and the access engine already honours them on every write. What is missing is any way to appoint, change or remove them, and any way for an admin to find the Rings they manage.

**What exists today.** The backend has `RingAdmin` with the levels `CONTENT_MANAGER` and `MEMBER_MANAGER`, and `assertCanAdminister` lets the owner or an admin at the right level change the Ring (`PATCH /rings/:id`) and its members. The six settings of [[D-04 Ring settings at launch and their defaults|D-04]] exist (`purpose`, `joinPolicy`, `requiresApproval`, `membersCanSeeEachOther`, `membersCanInvite`, `membersCanSaveAttachments`, [[BD-11 Rings Backend Delivery]]), and the roster carries names with a `?name=` search ([[BD-09 Ring Members Backend Delivery]]). There is **no route** to list, add, change or remove an admin, no list of the Rings I manage, and `GET /rings/:id` answers the owner only. In the app, Edit Ring (s22: name, colour and icon, who it's for, dates, the six settings, default, delete) is built for the owner and goes read-only on a 403; the People tab (s15) holds the members, invitations and join codes; there is **no admin section anywhere**, and nothing marks a Ring as one I manage.

## Persona

- **The Ring owner** of a company Ring (a business owner, or the person who made the company Ring), sharing the work of running it.
- **The admin**: a member of that Ring whom the owner has made an admin, at one of two levels. Not the owner; can't make other admins.

## Decided in this story

Decided 2026-11-05 by Omar Fostok. They live here rather than on decision cards; a story or a requirements list that relies on one links this section and the rule's number.

| # | Question | Decided | Parts |
|---|---|---|---|
| A1 | **Which Rings can have admins?** | **Company (`CORPORATE`) Rings only** in the MVP. A personal Ring has no admins, and its People tab shows no ADMINS section (A8). | S1, S2 |
| A2 | **Who can be made an admin?** | **A current member of that Ring**, joined in any way. No connection is needed. The owner can't make themselves an admin. | S2 |
| A3 | **The levels, and who appoints** | Two levels: **"Can edit what the Ring shows"** (`CONTENT_MANAGER`) and **"Can also manage who's in it"** (`MEMBER_MANAGER`, which includes the first). **Only the owner** appoints an admin, changes their level or removes them. | S2, S3, S4, S6 |
| A4 | **Which settings admins can change** | **"Can also manage who's in it"** admins change the **joining settings**: who can request to join, approve each one, members can invite others; and they manage the Ring's **join codes and their QR** (make one, turn one off, [[D-32 Several join codes per Ring\|D-32]], [[D-35 A join code can be shown as a QR\|D-35]]). The required work email domain is not in this version ([[D-33 Work email joining waits for real emails and Companies\|D-33]]). **"Can edit what the Ring shows"** admins change none of them. **Owner-only**: who it's for, *Delete Ring* and *Make default*. The remaining settings, members can see each other and members can save attachments, change what members learn about each other and stay owner-only too. This answers the question [[D-04 Ring settings at launch and their defaults]] left open. | S6, S7 |
| A5 | **Where an admin finds the Rings they manage** | A **Rings you manage** section on My Rings (s16), listing each Ring **by name** (being made an admin is knowing, [[D-18 Ring names shown when joined knowingly]]), and the same Rings on the company's detail (s73, [[S-29 Companies Story\|S-29 S8]]). Never on Shared with me (D-14). | S5 |
| A6 | **When admin rights end** | When the owner removes them (S4); when they **leave the Ring or are removed from it**; when they **leave the company** ([[S-29 Companies Story\|S-29 P5]]); when the Ring is deleted. **Never announced** to anyone. | S4, S8 |
| A7 | **Is the new admin told?** | **Yes, once**: "Noor made you an admin of Acme Team", which opens the Ring, once notifications exist ([[S-96 Notifications Story]]). A level change or a removal sends nothing. | S9 |
| A8 | **Where the owner manages admins** | An **ADMINS** section on the Ring's **People tab** (s15), next to invitations and join codes; on company Rings only (A1), shown to the owner only (A3). Adding, changing or removing an admin **saves at once**, each its own call, not with Edit Ring's *Save*. | S1, S2, S3, S4 |

Added 2026-11-16 by Omar Fostok: A8.

## Stories

### S1 · Where a company Ring is run: Edit Ring and the People tab ([[Screen Index#s22|s22]], [[Screen Index#s15|s15]])

**As a** company Ring's owner **I want** the settings in one place and the people who help me next to the Ring's other people **so that** I don't look for them across screens.

Acceptance criteria:
- [ ] **Edit Ring** (s22, which merges the design's s26 and s27) holds the Ring itself and the six settings (S7), saved together with its *Save*. There is no *Joining and permissions* screen and no *Soon* row.
- [ ] The Ring's **People tab** (s15) holds its members, its invitations and join codes ([[S-33 Ring Invitations & Join Story]]), and an **ADMINS** section (A8, S2–S4).
- [ ] **ADMINS** is shown on a company Ring only (A1), and only to its owner (A3). Adding, changing or removing an admin saves at once, each its own call, never with Edit Ring's *Save* (A8).
- [ ] An admin opening Edit Ring or the People tab sees what their level may change (A4, S6, S7), and no ADMINS section.
- [ ] Available: Edit Ring with the six settings, and the People tab with members, invitations and join codes, for the owner ([[FD-12 Rings Frontend Delivery]]). Not available yet: the ADMINS section and its routes.

### S2 · See and add admins ([[Screen Index#s15|s15]])

**As a** company Ring's owner **I want** the people who help me, and a way to add one **so that** I share the work without sharing ownership.

Acceptance criteria:
- [ ] **ADMINS** lists me first, marked *Owner*, not editable; then each admin with name, Pin name, photo (initials until files load) and level in words (A3).
- [ ] Empty: "Only you run this Ring."
- [ ] *Add admin* opens a picker over **this Ring's current members** (A2), searchable by name and Pin name; members who are already admins aren't offered. Then the level, *Can edit what the Ring shows* or *Can also manage who's in it*, with one line on what each allows.
- [ ] *Add* is one call that saves at once (A8); on success the row appears and the person is told once (A7, S9).
- [ ] Someone who stopped being a member while the picker was open: "Can't add this person", the picker refetches.
- [ ] Available: the member names and the `?name=` search on the roster ([[BD-09 Ring Members Backend Delivery]]). Not available yet: the admin routes.

### S3 · Change an admin's level ([[Screen Index#s15|s15]])

**As a** company Ring's owner **I want** to change what an admin may do **so that** someone who edits the card doesn't also control who gets in.

Acceptance criteria:
- [ ] Tapping an admin row opens their level: the two choices with what each allows (A3).
- [ ] Choosing a level saves it at once (A8): their next request already runs under the new level. Nobody is told (A7).
- [ ] An admin can't change anyone's level, their own included (A3).
- [ ] Not available yet: the route.

### S4 · Remove an admin ([[Screen Index#s15|s15]])

**As a** company Ring's owner **I want** to take someone's admin rights away **so that** a colleague who changed role stops changing the Ring.

Acceptance criteria:
- [ ] *Remove as admin* on the row, with a confirmation: "Noor stays a member of Acme Team, but can't change it any more."
- [ ] Confirming saves at once (A8). Removal ends the admin rights only; their membership of the Ring stays.
- [ ] It takes effect on their next request; nobody is told (A6).
- [ ] Not available yet: the route.

### S5 · Rings you manage ([[Screen Index#s16|s16]], [[Screen Index#s73|s73]])

**As an** admin **I want** the Rings I help run in one place **so that** I can do the job I was given.

Acceptance criteria:
- [ ] My Rings (s16) has a **Rings you manage** section, below my own Rings, shown only when I administer at least one: each Ring by **name**, its owner's name, its colour, and my level in words (A5). A row opens the Ring's page with *Edit*.
- [ ] The same Rings show on the company's detail (s73) under *MY ROLE HERE* ([[S-29 Companies Story|S-29 S8]]).
- [ ] They never show on Shared with me (D-14); a Ring I manage and am a member of shows there only as its owner, a person.
- [ ] When my rights end (A6), the Ring leaves the section on the next refetch, without a message.
- [ ] Not available yet: the list of Rings I administer; reading a Ring as its admin (`GET /rings/:id` answers the owner only).

### S6 · Acting as an admin (Edit Ring [[Screen Index#s22|s22]], People tab [[Screen Index#s15|s15]])

**As an** admin **I want** the owner's screens, with only what my level allows **so that** I don't trip over controls I can't use.

Acceptance criteria:
- [ ] **"Can edit what the Ring shows"**: Edit Ring's name, colour and icon, and dates, and *What this Ring shows* (the projection: bio, photo, fields, links, files).
- [ ] **"Can also manage who's in it"**: all of the above, plus the People tab (s15: add, change the window, move, remove members; invitations; make and turn off join codes and show their QR, D-32, D-35) and the three joining settings on Edit Ring (A4, S7).
- [ ] Never, at any level: *Delete Ring*, *Make default*, *Who it's for*, the ADMINS section, the two member-privacy settings (A4). These controls are **absent**, not disabled.
- [ ] A 403 `E_RING_05` (my level changed since the screen opened) reads "Your role on this Ring has changed", once; the screen reloads with what I may do now.
- [ ] An admin keeps editing a Ring past its end date, as the owner can (the keep / merge / delete choice stays the owner's).
- [ ] Not available yet: the admin read of the Ring with `myLevel`, and the settings by level.

### S7 · The joining settings (Edit Ring, [[Screen Index#s22|s22]])

**As a** company Ring's owner, or an admin who manages who's in it **I want** to set how people get in **so that** the Ring stays the right audience ([[D-04 Ring settings at launch and their defaults]]).

Acceptance criteria:
- [ ] On Edit Ring, the three **joining settings**, with the D-04 defaults: who can request to join (Anyone with a join code or its QR / Only with a code or invitation / Only by invitation), approve each one (on), members can invite others (off). No required work email domain in this version (D-33).
- [ ] Owner only: members can see each other (off), members can save attachments (off), and *Who it's for* (A4). For an admin they're absent.
- [ ] The join codes themselves and their QR are on the People tab (s15, D-32, D-35), managed by the owner and by "Can also manage who's in it" admins (A4).
- [ ] Who may change what is A4; a plain member never opens Edit Ring.
- [ ] Available: the six settings, read and saved by the owner (`PATCH /rings/:id`, [[BD-11 Rings Backend Delivery]]; [[S-18 Rings Story|Rings · S9]]). Not available yet: the settings by level (today a "Can edit what the Ring shows" admin can change all six, *What the backend has to build* item 5), and the admin read of the Ring.

### S8 · When admin rights end

**As an** owner **I want** admin rights to end with the person's place in the Ring **so that** nobody keeps changing a Ring they've left.

Acceptance criteria:
- [ ] The rights end when the owner removes them (S4), when the admin **leaves the Ring or is removed from it**, when they **leave the company** ([[S-29 Companies Story|S-29 S9, P5]]), when the Ring is deleted, and when their account is deleted (A6).
- [ ] In every case the same: nothing is sent to anyone; the Ring leaves *Rings you manage*; their next write answers 403.
- [ ] A block between the owner and an admin ends the admin's membership ([[Ring Access Model]]), and with it the rights.

### S9 · Being made an admin ([[Screen Index#s69|s69]])

**As a** new admin **I want** to know I've been given the job **so that** I don't discover it by chance.

Acceptance criteria:
- [ ] One notification: "Noor made you an admin of Acme Team" (A7); tapping it opens the Ring's page with *Edit*.
- [ ] No notification for a level change or a removal.
- [ ] Not available yet: notifications ([[S-96 Notifications Story]]); until then, the Ring simply appears in *Rings you manage*.

## States and motion the design asks for

- **People tab (s15), ADMINS:** loading; the owner first and admins, or empty ("Only you run this Ring"); the picker (members, search, none left to add); the level sheet; adding, changing, removing (each saved at once); "Can't add this person".
- **Edit Ring (s22):** the joining settings and the owner-only settings, or for an admin only what their level allows.
- **For an admin:** the same screens with owner-only parts absent; "Your role on this Ring has changed".
- **My Rings:** *Rings you manage* shown or hidden.
- **Motion:** the Ring-edit transitions of [[BI-08 Rings Backend Integration]]; reduced motion fades.
- No photos until files load (D-16): initials.

## Where the design disagrees (for the designer)

| Screen | What's drawn | What the decisions need |
|---|---|---|
| s26, s27 | Two screens, Edit · access and Edit · permissions, admins among them | The settings on Edit Ring (s22, as the app built it); the admins in an **ADMINS** section on the Ring's People tab (s15), next to invitations and join codes, each change saved at once (A8, S1) |
| s26 | Admins picked from connections | Picked from the Ring's members (A2) |
| s27 | Levels not named | Two levels in words (A3) |
| — | No place for an admin to find a managed Ring | *Rings you manage* on My Rings (A5, S5) |
| s26, s27 | Admins on any Ring | Company Rings only (A1) |
| s22 (app, `778d9b4`) | On a 403, Edit Ring goes read-only with "Only the Ring's owner can change these." | Owner-only wording from before admins existed: for an admin, "Your role on this Ring has changed", once, and the screen reloads with what their level allows (S6) |

## What the backend has to build

Not available yet, in the order the journey needs them (the old S6, T-006):

1. **The admins of a Ring:** `GET /rings/:ringId/admins` (the owner only): each admin with `userId`, name, Pin name, photo, level.
2. **Add, change, remove:** `POST /rings/:ringId/admins { userId, level }`, `PATCH /rings/:ringId/admins/:userId { level }`, `DELETE /rings/:ringId/admins/:userId`, owner only; refused on a non-company Ring (A1), for someone who isn't a current member (A2), and for the owner themselves.
3. **The Rings I manage:** `GET /rings/managed` (or a flag on `GET /rings`): each Ring with its name, colour, owner and my level (A5).
4. **An admin read of a Ring:** `GET /rings/:id` answers an admin too, with `myLevel`, so Edit Ring can load and hide what the level doesn't allow (S6).
5. **Settings by level:** today a `CONTENT_MANAGER` admin can change all six settings through `PATCH /rings/:id` ([[BD-11 Rings Backend Delivery]]). A4 needs: the joining settings (`joinPolicy`, `requiresApproval`, `membersCanInvite`) and the join codes accept a `MEMBER_MANAGER` admin only; `purpose`, `membersCanSeeEachOther` and `membersCanSaveAttachments`, delete and default stay owner-only.
6. **Ending the rights** (A6): leaving or being removed from the Ring, leaving the company, deleting the Ring or the account remove the `RingAdmin` row in the same step.
7. **The notification** on appointment (A7), once notifications exist.
8. **Error codes** (none defined yet): not a company Ring, not a member, already an admin, not an admin.

## Rules the backend already enforces

- `assertCanAdminister` accepts the owner or a `RingAdmin` at the required level: `PATCH /rings/:id` needs `CONTENT_MANAGER` or above, for all six settings alike, every member write needs `MEMBER_MANAGER` or above (403 `E_RING_05` otherwise).
- `assertCanAdminister` ignores the Ring's end date, so an admin keeps editing an ended Ring.
- `GET /rings/:id` and `DELETE /rings/:id` are the owner's (404 `E_RING_02` for anyone else).
- Reassign requires both Rings to be administrable by the actor and to share an owner (400 `E_RING_07`).
- Membership stays private to the owner and admins; being an admin never exposes a Ring to its members.

## Open questions

- None that block this story. A personal Ring with admins (A1) and more than two levels can come later, on a new part.

## Log

- 2026-11-05 · flagged [[FR-16 Delegated Admins Frontend Requirements]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[S-29 Companies Story]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[S-15 Ring Access Engine Story]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[FR-08 Ring Access Engine Frontend Requirements]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[BI-05 Ring Access Engine Backend Integration]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[BI-06 Ring Members Backend Integration]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[FR-11 Rings Frontend Requirements]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[S-18 Rings Story]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[F-42 Operator Panel]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[S-117 Operator Panel Story]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[BD-16 Delegated Admins Backend Delivery]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-05 · flagged [[F-16 Delegated Admins]]: S-31 was rewritten (2026-11-05) to match the app's one Edit Ring screen, with rules A1–A7 decided inside the story (no decision cards): company Rings only; an admin must be a member of the Ring; two levels (edit what it shows / also manage who's in it), owner-only appointing; member-managers change the joining settings, who it's for, delete and default stay owner-only; Rings you manage on My Rings and Company detail; rights end on removal, leaving the Ring or the company, silently. The old Delegated Admins · S6 (T-006, the admin routes) is now its 'What the backend has to build'; the levels are S3/A3. Repoint the links that name Delegated Admins · S6.
- 2026-11-16 · `tickets/pm/M-03-shared-rings/F-16-delegated-admins/S-31-app-and-a8` · matched to the app (FD-12 @ `778d9b4`) and the decisions: **A8 added, decided by Omar Fostok 2026-11-16** (ADMINS on the People tab s15, company Rings, owner only, each change saved at once); S1 rewritten (no *Joining and permissions* screen or *Soon* row; the six settings on Edit Ring s22); A4, S6, S7 without the work email domain (D-33) and with join codes and their QR for member-managers (D-32, D-35); "not available yet" refreshed (six settings BD-11, roster names and `?name=` BD-09 built; admin routes, Rings I manage, the admin read with `myLevel` still missing); backend item 5 names today's gap (a `CONTENT_MANAGER` changes all six); design rows for the People tab and the app's owner-only 403 wording. Cleared the FD-12 and D-32 flags; flagged [[FR-16 Delegated Admins Frontend Requirements]] and [[BD-16 Delegated Admins Backend Delivery]]. Status kept `draft`
