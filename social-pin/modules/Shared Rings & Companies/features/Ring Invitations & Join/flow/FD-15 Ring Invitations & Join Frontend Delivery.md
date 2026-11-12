---
id: FD-15
type: frontend-delivery
module: shared-rings
feature: ring-invitations
status: done
scope: feature
screens: [s15, s17, s19, s26, s43, s72, s73, s74]
owner: "Omar Fostok"
depends: ["BI-17 Ring Invitations & Join Backend Integration"]
affects: []
related: ["FR-17 Ring Invitations & Join Frontend Requirements", "S-33 Ring Invitations & Join Story", "BD-17 Ring Invitations & Join Backend Delivery", "FD-14 Ring Members Frontend Delivery", "FR-15 Companies Frontend Requirements", "S-29 Companies Story", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "D-32 Several join codes per Ring", "D-33 Work email joining waits for real emails and Companies", "D-34 A member shows one of their own Rings", "D-35 A join code can be shown as a QR", "D-36 Who it's for stays the owner's alone", "GET /rings/shared-with-me", "GET /rings/invitations/mine", "POST /rings/invitations/:id/accept", "POST /rings/join-codes/resolve", "POST /rings/join-codes/join", "GET /rings/join-requests/mine", "DELETE /rings/join-requests/:id", "GET /rings/:ringId/my-card", "PUT /rings/:ringId/my-card", "POST /rings/:ringId/leave", "GET /rings/:ringId/colleagues"]
pending: ["[[S-33 Ring Invitations & Join Story]]: S12 notifications, with F-39"]
created: 2026-11-09
updated: 2026-11-11
tags: [frontend-delivery, frontend-delivery/done, module/shared-rings, layer/frontend]
---

# ✅ Ring Invitations & Join · Frontend Delivery

> ⚠ Affected by [[D-39 The company domain and the title switch show in the MVP]] (2026-11-12): s73's "Verified · {domain}" and s72's "Let {company} update my title" are kept in the MVP on purpose; the app already matches, so the open points against S-29 P4 and P6 close

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** Done · **Built from:** [[BI-17 Ring Invitations & Join Backend Integration]] · **Against:** [[S-33 Ring Invitations & Join Story]] · **Requirements:** [[FR-17 Ring Invitations & Join Frontend Requirements]] · **QA:** [[Ring Invitations & Join QA Frontend]]

What the client shipped for joining someone else's Ring knowingly, and the owner's side of it, on `social_pin` `rings/F-11/honest-rings` @ `0005f00` (2026-11-09), with the first half in `f801aaa` (invitations, join codes, Waiting on you, named Shared with me rows), and the product owner's decisions of 2026-11-11 in `dbef63e` (join codes on the People tab, the join-option wording, the card step's default and its first open after an approved request, the company Ring screens). It is not on `main` yet. Built against backend `main` `14c6916` ([[BI-17 Ring Invitations & Join Backend Integration|BI-17]]). Unit and widget tests only so far; not yet tried on a device.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s17\|s17]] Shared with me | ✅ | **Invitations · N** above the people: the Ring's name, the owner or company, "Invited by …" when someone else sent it, when it was sent; *Review invite* → s74; a `valid: false` one reads "no longer valid". **My requests · N** under it (S5): pending "Waiting for <owner>" with *Cancel*, declined "Not accepted" (never why) with *Dismiss*. Then the people, one row per person; a row joined knowingly is named ("Acme Team" over "Shared by Acme Studio · N people", the count only when `memberCount` is set) and carries "**Your card here: <my Ring> ›**" (S10). Each list loads on its own; all read again after accept, decline, dismiss, cancel, join, a card picked or a Ring left. Empty: *Join with a code*. A row opens the server's `ringId`, the first Ring (D-15). (S1, S5) |
| [[Screen Index#s74\|s74]] Review an invitation | ✅ | The Ring's name, the owner (name, `!pinName`, photo), who invited me, the window if any; *Join Ring*, *Decline*; *Dismiss* only when no longer valid (also when accept meets `E_RING_ACCESS_02`). Never a colour, type or purpose (D-36); the same neutral avatar for every Ring. (S2) |
| s74 Join with a code | ✅ | One field with *Paste*, grouped as it is typed (K7QM-4RXT), any case, dash optional, checked only for "not empty"; *Continue* resolves to the review ("Join Acme Team?", the owner, whether it asks first); *Join Ring* joins, or shows "Request sent: <owner> will approve it". One message for every code that doesn't work, one for too many tries. No work email (D-33). (S3) |
| s74 → "Your card in <Ring>" | ✅ | Right after *Join Ring* from an invitation, a join code or a join QR (`JOINED`, or an accepted invitation): my Rings, **starting on my default Ring** (Public) even when the server's `shownRingId` names another Ring; a pick I already made stays ticked. The who-sees-it line from `seenByMembers`; *Done* sends the pick, or `null` to keep following my default. A 404 closes it quietly; `E_RING_MEMBER_05` reads my Rings again and asks to pick again. The same picker opens as a sheet from the s17 row link. Then back to s17, never My Rings. Never for a Ring I was placed in: no step, no "Your card here", no *Leave*. (S10, D-34) |
| s17 → the card step, first open after an approved request | ✅ | A Ring joined by an approved join request (S5) offers the step once, the first time I open it from Shared with me. The app keeps the Rings already offered on this phone (Ring ids only, cleared on sign-out); a Ring is recorded once its card is read or on a 404, not on a failure, and the in-app join flow records the Ring when it shows the step, so it never asks twice. Its two limits are under Deviations below. (S5, S10) |
| The owner's card from s17 (inside the Ring) | ✅ | **Members · N** (`meta.total`) only on a 200 from colleagues, each opening the card they picked for this Ring (a colleague screen: no Connect, no Block); nothing at all on a 404. **+ Invite someone to <Ring>** and **Leave this Ring** only on a named row; *Leave* asks first, then back to s17 read again; a 404 hides the button quietly. A placed member sees Members · N while allowed, never *Leave* or the card step. (S6, S11) |
| [[Screen Index#s43\|s43]] Scanner | ✅ | A `socialpin://join/<CODE>` join QR opens s74 with the code, resolved at once; a badge (`https://socialpin.me/q/<token>`) only ever opens a person's card; anything else is "Not a Social Pin code". (S9, D-35) |
| [[Screen Index#s15\|s15]] Ring people, the owner's side | ✅ | **+ Invite** beside *+ Add people* (hidden once the server refuses), **Invited · N** (the person, "Waiting · sent 3 Nov" or "Declined", *Withdraw* while pending, never counted as members), and **Waiting on you · N** (the person, the code label they used, *Add*, *Decline*; shipped in `f801aaa`, closing what [[FD-14 Ring Members Frontend Delivery\|FD-14]] left). (S6, S8) |
| Invite sheet (s15, s19) | ✅ | One of my connections (server-searched) or a **Pin name typed in full**; people already invited are marked; *Send*, or *Send with an access window* for the owner. "People who join this way will see this Ring's name." (D-18). (S6) |
| [[Screen Index#s19\|s19]] New Ring, step 2 | ✅ | *Invite* a connection or a Pin name beside picking members, each a chip with ×, with the D-18 line; the invitations are sent right after the Ring is created, one by one. (S6) |
| s15 People tab → *Add people* (s15a) → *Share a join code* → Join codes (s15d), Make a new code (s15g), Code QR (s15f) | ✅ | *Add people* (s15a) offers *Invite someone*, *Place your connections* and *Share a join code*; the fourth link, "Manage join codes and invitations", is gone (it opened Edit Ring → Joining, which only points back to People: a loop). **Join codes** (s15d): active first then newest, label, K7QM-4RXT, "12 of 20 used · ends 16 Mar", *Off* / *Ended* / used up; per active code **Share** (the phone's share sheet: the Ring's name, the code, where to type it; copies when the sheet can't open), **Copy**, **Show as QR** and **Turn off**. **Make a new code** (s15g): label required (≤ 40), end date and use limit optional, waits at 10 active. **Code QR** (s15f): full screen, `qrPayload` on a white card, `displayCode` under it. The D-18 line under the list. Hidden under "only by invitation"; reachable by the Ring's admins too; a 403 hides everything. The codes, the calls and the rules are unchanged. (S7, S9) |
| [[Screen Index#s26\|s26]] Edit Ring → Joining | ✅ | One row, "Invitations and join codes are on the People tab ›", which opens s15. (S7) |
| Join option wording: [[Screen Index#s21\|s21]] wizard, Edit Ring, Ring detail's WHEN AND WHO, the policy sheet, the wizard summary | ✅ | The way in reads **"Anyone with a join code or its QR"** (ar "أي شخص لديه رمز انضمام أو رمز QR الخاص به"), was "Anyone who scans your badge" / "Anyone who scans". No scan or badge wording is left in any policy label, en or ar. (S3, S9, D-35) |
| [[Screen Index#s74\|s74]] Join a company Ring | ✅ demo | Ways in only **This invitation**, **Invite code** (K7QM-4RXT: 8 characters, no 0/O/1/I, left to right in Arabic too) and **Join QR** (*Scan a join QR* opens the scanner). Header "Invited by {name} · {people}". Gone: Work email, Scan a colleague, "What joining gives you" (the purpose), "What you contribute", the verified-domain line. After *Join Ring*: the "Your card in <Ring>" step, then Shared with me. (S2–S4, S10, D-33, D-35, D-36) |
| [[Screen Index#s72\|s72]] My companies | ✅ demo | Add row "Invitation, code or a join QR"; no verified work email row; member row "{role} · {people}"; invite row "From {name} · {Ring name}". Still shows *Let {company} update my title* (S-29 P4 hides it in the MVP). (S1, S4, S5) |
| [[Screen Index#s73\|s73]] Company detail | ✅ demo | No verified email line, no purpose text on the team Ring row. The subtitle still reads "Verified · {domain}" (S-29 P6 drops *Verified* in the MVP). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings/shared-with-me` | s17 | Pages as it scrolls; `ringName`, `memberCount`, `myCardRingId` / `myCardRingName` read per row. A failed photo link reads the list again, once per link. |
| `GET /rings/invitations/mine` | s17 | Every page (`limit` = the API's max, until `meta.total`); on its own. |
| `GET /rings/join-requests/mine` | s17 My requests | Every page; on its own; again on app resume and after each action. |
| `DELETE /rings/join-requests/:id` | s17 *Cancel* / *Dismiss* | Then the list reads again. |
| `POST /rings/invitations/:id/accept` | s74 *Join Ring* | `{ ringId, ringName }` → the card step. `E_RING_ACCESS_02` → no longer valid, *Dismiss*; `E_RING_INVITATION_01` → back to s17. |
| `POST /rings/invitations/:id/decline` · `…/dismiss` | s74 | A gone invitation is no failure; dismiss on a still-valid one shows accept / decline again. |
| `POST /rings/join-codes/resolve` | s74 code, s43 join QR | `{ code }` uppercase, no spaces or dash; the scanned text stripped of `socialpin://join/`. |
| `POST /rings/join-codes/join` | s74 code review | The same code again; `JOINED` → card step, `REQUESTED` (or `E_RING_JOIN_REQUEST_02`) → "Request sent"; `E_RING_MEMBER_01` → back to s17, "already a member"; a refusal after the review goes back to the field with the one message. |
| `GET /rings` | card step | My Rings for the picker. |
| `GET` / `PUT /rings/:ringId/my-card` | card step, s17 row link, s17 first open after an approved request | `PUT { shownRingId \| null }`. The step starts on my default Ring whatever `shownRingId` says. A company Ring (s74 demo) has no route: its demo Ring id is unknown to the server, so the `GET` answers 404 and the step closes quietly. |
| `GET /rings/:ringId/colleagues` | the owner's card | Every page; read again on app resume; 404 → no section. |
| `POST /rings/:ringId/leave` | the owner's card | After the confirm; 404 → the button goes. |
| `POST /rings/:ringId/invitations` | s15, s19, Joining, the owner's card (member) | `{ userId }` or `{ pinName }`; `startsAt` / `expiresAt` only from the owner's window sheet, never from a member. |
| `GET /rings/:ringId/invitations` · `POST …/invitations/:id/withdraw` | s15 Invited · N, Joining | Every page; read again after invite and withdraw. |
| `GET /rings/:ringId/join-requests` · `POST …/:id/approve` · `…/:id/decline` | s15 Waiting on you | Then the roster and the requests read again. |
| `GET /rings/:ringId/join-codes` · `POST /rings/:ringId/join-codes` · `POST …/:codeId/turn-off` | s15d Join codes, s15g | On open and after every write. |

## State kept on the client

- Data sources `ring_joining_remote_data_source.dart` (invitations, codes) and `ring_membership_remote_data_source.dart` (my requests, my card, colleagues, leave), routes in `rings_end_points.dart`, under `lib/src/features/rings/data/`.
- s17: `RingsController` (people, count, invitations) and `MyJoinRequestsController`; nothing cached between visits, all read again after each action (BI-17 Flow 4).
- s74: `JoinRingController`, one step at a time (enter code, review invitation, review code, request sent, pick card); the typed code is held only until *Join Ring*.
- Card step: `MyRingCardController` (`my_card_picker.dart`, also `MyCardSheet` from the row); my Rings from `MyRingsController`. The Rings already offered the step: `card_step_offered_local_data_source.dart` (`StorageData.cardStepOffered`, a set of Ring ids on this phone, cleared on sign-out); `RingsController` reads it when a Shared with me row opens.
- Company Rings (s72, s73, s74): demo data only (`my_companies_data.dart`, `JoinCompanyRingController`); there is no company Ring API yet.
- Inside the Ring: `RingMembershipController` on `person_card_screen.dart` (colleagues, *Leave*, member *Invite*); `ColleagueCardController` for a colleague's card. The members invited from here are remembered for the visit only, to mark them in the picker.
- Owner side: `RingInvitationsController`, `RingJoinRequestsController` (s15 via `RingPeopleController`), `RingJoinCodesController`; the wizard's invitees live in `NewRingDraft` until the Ring exists.
- Placed or joined knowingly is told only by the row: `SharedPerson.joinedKnowingly` is a non-empty `ringName` (FR-17); `ringId` is opaque, never shown or compared.
- Error codes (`RingJoiningErrorCode`, `RingMembershipErrorCode`) are read from the body when present, else from the status and, where two share one, the message, until [[S-87 Error Contract Story|Error Contract]].

## Deviations from the story or the integration note

- **A member's *Invite* is offered on every Ring joined knowingly, and goes after a 403:** S-33 S6 shows it only while `membersCanInvite` is on, but no route tells a member that setting (it is on the owner's Ring only). Flagged on S-33 and BI-17.
- **A member can't see or withdraw the invitations they sent:** S-33 S6 says "the invitation is theirs to withdraw", but `GET /rings/:ringId/invitations` is the owner's and admins'. Only the ones sent this visit are marked in the picker. Flagged on S-33 and BI-17.
- **The card step after an approved request asks once per phone** (S-33 S5, S10, since `dbef63e`): the request rows carry no Ring id, so the app can't tell which Ring an approved request was for; it remembers the Rings it offered on this phone. A Ring joined on another phone, or before this build, asks once more.
- **No card step when the Shared with me row stays on a placed Ring** (S-33 S1, S10, D-15): if the person had already placed me in another Ring, their row keeps opening that one, so there is no row to open the Ring I joined by request and the step doesn't show there; "Your card here" is not offered either. Flagged on S-33.
- **Company Rings have no API** (s72, s73, s74): the screens run on demo data; on a real backend the demo Ring id is unknown, so the card step after *Join Ring* gets a 404, closes quietly and the user lands on Shared with me.
- **s73 subtitle still "Verified · {domain}"**: [[S-29 Companies Story|S-29 P6]] drops *Verified* in the MVP. Flagged on S-29.
- **s72 still shows "Let {company} update my title"**: [[S-29 Companies Story|S-29 P4]] hides it in the MVP. Flagged on S-29.
- **An invitation by Pin name takes the Pin name typed in full**, with no lookup before sending; the server's answer is the only check.
- **Copy** sits beside *Share* on each join code (S-33 S7 names Share only).
- **Waiting on you** is on s15 only; s72 My companies stays with [[FR-15 Companies Frontend Requirements|FR-15]].

## Not done yet

- S12 notifications (invitation received, request approved, request waiting) → [[S-33 Ring Invitations & Join Story|S-33 S12]], with [[F-39 Notifications]]; until then s17 and s15 read on focus, no polling (pending).
- S4 work email: not in this version (D-33), wanted later; nothing names it, on s74 or s72.
- Blocking a colleague met only in Members · N: no route yet (BI-17).
- s72 My companies, s73 and the company s74 on a real backend (invitations and requests by company): no company Ring API yet, [[FR-15 Companies Frontend Requirements|FR-15]].
- Not drawn: the card step, Invited and Waiting on s15 use the app's own style.

## Tests

`test/features/rings/`: `ring_joining_test.dart`, `join_ring_screen_test.dart`, `ring_membership_test.dart` (my requests, my card, colleagues, leave), `member_invite_test.dart`, `ring_invite_placement_test.dart`, `shared_with_me_test.dart`; `test/features/ring_detail/ring_people_view_test.dart` and `ring_people_controller_test.dart` (Invited, Waiting on you); `test/features/badge/scanner_controller_test.dart` (join QR vs badge). Since `dbef63e`: `test/features/rings/make_join_code_sheet_test.dart` and `join_policy_labels_test.dart` (new); `ring_membership_test.dart` and `join_ring_screen_test.dart` (default Ring, first open after an approved request), `ring_detail/add_people_menu_sheet_test.dart`, `ring_people_view_test.dart`, `edit_ring_states_test.dart`, `ring_data_view_test.dart`, `rings/new_ring_wizard_test.dart` updated; `test/features/account/my_companies_demo_test.dart` (s72, s73, s74). `dart analyze lib test patrol_test`: 0 errors; `flutter test`: 1692 passed, 0 failed.

## Log

- 2026-11-09 · app branch `rings/F-11/honest-rings` @ `0005f00` (with `f801aaa`; social_pin, not on `main` yet) · S-33 S1–S3, S5–S11 · s17 (invitations, My requests, named rows, Your card here), s74 (review, code, the card step), s43 join QR, the owner's card (Members · N, Leave, member Invite), s15 (Invite, Invited · N, Waiting on you), s19 Invite, s26 Join codes (make, Share, Copy, Show as QR, turn off, admins) · flagged [[S-33 Ring Invitations & Join Story]] and [[BI-17 Ring Invitations & Join Backend Integration]] (a member's Invite shown without `membersCanInvite`, no list or withdraw of what a member sent); [[FR-17 Ring Invitations & Join Frontend Requirements]] S6 flag settled and cleared
- 2026-11-11 · app branch `rings/F-11/honest-rings` @ `dbef63e` (social_pin, not on `main` yet) · S-33 S4, S7, S9, S10 (the product owner's decisions of 2026-11-11) · s15a / s15d / s15f / s15g join codes on the People tab with the looping *Manage join codes and invitations* link removed, s26 one row; "Anyone with a join code or its QR" on s21, Edit Ring, Ring detail, the policy sheet and the wizard summary; the card step starting on the default Ring and shown on the first open after an approved join request (stored set of offered Rings; S10 pending entry cleared); s74 / s72 / s73 company screens (invitation, code or join QR only; demo, no API) · tests: make_join_code_sheet, join_policy_labels, my_companies_demo, ring_membership, join_ring_screen and five updated; 1692 passed · flagged [[S-33 Ring Invitations & Join Story]] (the step asks once per phone; none when the row stays on a placed Ring, D-15) and [[S-29 Companies Story]] (s73 still "Verified · {domain}", P6; s72 still "Let {company} update my title", P4)
