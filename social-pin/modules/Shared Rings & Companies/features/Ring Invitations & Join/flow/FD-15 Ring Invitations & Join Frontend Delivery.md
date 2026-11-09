---
id: FD-15
type: frontend-delivery
module: shared-rings
feature: ring-invitations
status: done
scope: feature
screens: [s15, s17, s19, s26, s43, s74]
owner: "Omar Fostok"
depends: ["BI-17 Ring Invitations & Join Backend Integration"]
affects: []
related: ["FR-17 Ring Invitations & Join Frontend Requirements", "S-33 Ring Invitations & Join Story", "BD-17 Ring Invitations & Join Backend Delivery", "FD-14 Ring Members Frontend Delivery", "FR-15 Companies Frontend Requirements", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "D-32 Several join codes per Ring", "D-33 Work email joining waits for real emails and Companies", "D-34 A member shows one of their own Rings", "D-35 A join code can be shown as a QR", "D-36 Who it's for stays the owner's alone", "GET /rings/shared-with-me", "GET /rings/invitations/mine", "POST /rings/invitations/:id/accept", "POST /rings/join-codes/resolve", "POST /rings/join-codes/join", "GET /rings/join-requests/mine", "DELETE /rings/join-requests/:id", "GET /rings/:ringId/my-card", "PUT /rings/:ringId/my-card", "POST /rings/:ringId/leave", "GET /rings/:ringId/colleagues"]
pending: ["[[S-33 Ring Invitations & Join Story]]: S10 the Your card step on the first open of a Ring whose join request was approved (today only the row's Your card here)", "[[S-33 Ring Invitations & Join Story]]: S12 notifications, with F-39"]
created: 2026-11-09
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/shared-rings, layer/frontend]
---

# ✅ Ring Invitations & Join · Frontend Delivery

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** Done · **Built from:** [[BI-17 Ring Invitations & Join Backend Integration]] · **Against:** [[S-33 Ring Invitations & Join Story]] · **Requirements:** [[FR-17 Ring Invitations & Join Frontend Requirements]] · **QA:** [[Ring Invitations & Join QA Frontend]]

What the client shipped for joining someone else's Ring knowingly, and the owner's side of it, on `social_pin` `rings/F-11/honest-rings` @ `0005f00` (2026-11-09), with the first half in `f801aaa` (invitations, join codes, Waiting on you, named Shared with me rows). It is not on `main` yet. Built against backend `main` `14c6916` ([[BI-17 Ring Invitations & Join Backend Integration|BI-17]]). Unit and widget tests only so far; not yet tried on a device.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s17\|s17]] Shared with me | ✅ | **Invitations · N** above the people: the Ring's name, the owner or company, "Invited by …" when someone else sent it, when it was sent; *Review invite* → s74; a `valid: false` one reads "no longer valid". **My requests · N** under it (S5): pending "Waiting for <owner>" with *Cancel*, declined "Not accepted" (never why) with *Dismiss*. Then the people, one row per person; a row joined knowingly is named ("Acme Team" over "Shared by Acme Studio · N people", the count only when `memberCount` is set) and carries "**Your card here: <my Ring> ›**" (S10). Each list loads on its own; all read again after accept, decline, dismiss, cancel, join, a card picked or a Ring left. Empty: *Join with a code*. A row opens the server's `ringId`, the first Ring (D-15). (S1, S5) |
| [[Screen Index#s74\|s74]] Review an invitation | ✅ | The Ring's name, the owner (name, `!pinName`, photo), who invited me, the window if any; *Join Ring*, *Decline*; *Dismiss* only when no longer valid (also when accept meets `E_RING_ACCESS_02`). Never a colour, type or purpose (D-36); the same neutral avatar for every Ring. (S2) |
| s74 Join with a code | ✅ | One field with *Paste*, grouped as it is typed (K7QM-4RXT), any case, dash optional, checked only for "not empty"; *Continue* resolves to the review ("Join Acme Team?", the owner, whether it asks first); *Join Ring* joins, or shows "Request sent: <owner> will approve it". One message for every code that doesn't work, one for too many tries. No work email (D-33). (S3) |
| s74 → "Your card in <Ring>" | ✅ | Right after *Join Ring* (`JOINED`, or an accepted invitation): my Rings, `shownRingId` pre-selected, the who-sees-it line from `seenByMembers`; *Done* sends the pick, or `null` to keep following my default. A 404 closes it quietly; `E_RING_MEMBER_05` reads my Rings again and asks to pick again. The same picker opens as a sheet from the s17 row link. Then back to s17, never My Rings. (S10, D-34) |
| The owner's card from s17 (inside the Ring) | ✅ | **Members · N** (`meta.total`) only on a 200 from colleagues, each opening the card they picked for this Ring (a colleague screen: no Connect, no Block); nothing at all on a 404. **+ Invite someone to <Ring>** and **Leave this Ring** only on a named row; *Leave* asks first, then back to s17 read again; a 404 hides the button quietly. A placed member sees Members · N while allowed, never *Leave* or the card step. (S6, S11) |
| [[Screen Index#s43\|s43]] Scanner | ✅ | A `socialpin://join/<CODE>` join QR opens s74 with the code, resolved at once; a badge (`https://socialpin.me/q/<token>`) only ever opens a person's card; anything else is "Not a Social Pin code". (S9, D-35) |
| [[Screen Index#s15\|s15]] Ring people, the owner's side | ✅ | **+ Invite** beside *+ Add people* (hidden once the server refuses), **Invited · N** (the person, "Waiting · sent 3 Nov" or "Declined", *Withdraw* while pending, never counted as members), and **Waiting on you · N** (the person, the code label they used, *Add*, *Decline*; shipped in `f801aaa`, closing what [[FD-14 Ring Members Frontend Delivery\|FD-14]] left). (S6, S8) |
| Invite sheet (s15, s19, Edit Ring → Joining) | ✅ | One of my connections (server-searched) or a **Pin name typed in full**; people already invited are marked; *Send*, or *Send with an access window* for the owner. "People who join this way will see this Ring's name." (D-18). Edit Ring → Joining also has an Invitations screen with the same Invite and Invited · N. (S6) |
| [[Screen Index#s19\|s19]] New Ring, step 2 | ✅ | *Invite* a connection or a Pin name beside picking members, each a chip with ×, with the D-18 line; the invitations are sent right after the Ring is created, one by one. (S6) |
| [[Screen Index#s26\|s26]] Edit Ring → Joining → Join codes | ✅ | The codes, active first then newest: label, K7QM-4RXT, "12 of 20 used · ends 16 Mar", *Off* / *Ended* / used up; *Make a new code* (label ≤ 40, optional end date, optional use limit; waits at 10 active); per active code **Share** (the phone's share sheet: the Ring's name, the code, where to type it; copies when the sheet can't open), **Copy**, **Show as QR** (full screen, `qrPayload` on a white card, `displayCode` under it) and **Turn off**. The D-18 line under the list. Hidden under "only by invitation"; reachable by the Ring's admins too; a 403 hides everything. (S7, S9) |

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
| `GET` / `PUT /rings/:ringId/my-card` | card step, s17 row link | `PUT { shownRingId \| null }`. |
| `GET /rings/:ringId/colleagues` | the owner's card | Every page; read again on app resume; 404 → no section. |
| `POST /rings/:ringId/leave` | the owner's card | After the confirm; 404 → the button goes. |
| `POST /rings/:ringId/invitations` | s15, s19, Joining, the owner's card (member) | `{ userId }` or `{ pinName }`; `startsAt` / `expiresAt` only from the owner's window sheet, never from a member. |
| `GET /rings/:ringId/invitations` · `POST …/invitations/:id/withdraw` | s15 Invited · N, Joining | Every page; read again after invite and withdraw. |
| `GET /rings/:ringId/join-requests` · `POST …/:id/approve` · `…/:id/decline` | s15 Waiting on you | Then the roster and the requests read again. |
| `GET /rings/:ringId/join-codes` · `POST /rings/:ringId/join-codes` · `POST …/:codeId/turn-off` | s26 Join codes | On open and after every write. |

## State kept on the client

- Data sources `ring_joining_remote_data_source.dart` (invitations, codes) and `ring_membership_remote_data_source.dart` (my requests, my card, colleagues, leave), routes in `rings_end_points.dart`, under `lib/src/features/rings/data/`.
- s17: `RingsController` (people, count, invitations) and `MyJoinRequestsController`; nothing cached between visits, all read again after each action (BI-17 Flow 4).
- s74: `JoinRingController`, one step at a time (enter code, review invitation, review code, request sent, pick card); the typed code is held only until *Join Ring*.
- Card step: `MyRingCardController` (`my_card_picker.dart`, also `MyCardSheet` from the row); my Rings from `MyRingsController`.
- Inside the Ring: `RingMembershipController` on `person_card_screen.dart` (colleagues, *Leave*, member *Invite*); `ColleagueCardController` for a colleague's card. The members invited from here are remembered for the visit only, to mark them in the picker.
- Owner side: `RingInvitationsController`, `RingJoinRequestsController` (s15 via `RingPeopleController`), `RingJoinCodesController`; the wizard's invitees live in `NewRingDraft` until the Ring exists.
- Placed or joined knowingly is told only by the row: `SharedPerson.joinedKnowingly` is a non-empty `ringName` (FR-17); `ringId` is opaque, never shown or compared.
- Error codes (`RingJoiningErrorCode`, `RingMembershipErrorCode`) are read from the body when present, else from the status and, where two share one, the message, until [[S-87 Error Contract Story|Error Contract]].

## Deviations from the story or the integration note

- **A member's *Invite* is offered on every Ring joined knowingly, and goes after a 403:** S-33 S6 shows it only while `membersCanInvite` is on, but no route tells a member that setting (it is on the owner's Ring only). Flagged on S-33 and BI-17.
- **A member can't see or withdraw the invitations they sent:** S-33 S6 says "the invitation is theirs to withdraw", but `GET /rings/:ringId/invitations` is the owner's and admins'. Only the ones sent this visit are marked in the picker. Flagged on S-33 and BI-17.
- **No "Your card in <Ring>" step on the first open of a Ring whose request was approved** (S-33 S5, S10, BI-17 Flow 5): the member changes it from "Your card here ›" on the row; the step itself only follows *Join Ring*. Pending.
- **An invitation by Pin name takes the Pin name typed in full**, with no lookup before sending; the server's answer is the only check.
- **Copy** sits beside *Share* on each join code (S-33 S7 names Share only).
- **Waiting on you** is on s15 only; s72 My companies stays with [[FR-15 Companies Frontend Requirements|FR-15]].

## Not done yet

- S10 the card step on the first open of an approved request's Ring → [[S-33 Ring Invitations & Join Story]] (pending).
- S12 notifications (invitation received, request approved, request waiting) → [[S-33 Ring Invitations & Join Story|S-33 S12]], with [[F-39 Notifications]]; until then s17 and s15 read on focus, no polling (pending).
- S4 work email: not in this version (D-33), and nothing names it.
- Blocking a colleague met only in Members · N: no route yet (BI-17).
- s72 My companies (invitations and requests by company): [[FR-15 Companies Frontend Requirements|FR-15]].
- Not drawn: the Join codes list and sheet, Show as QR, the card step, Invited and Waiting on s15 use the app's own style.

## Tests

`test/features/rings/`: `ring_joining_test.dart`, `join_ring_screen_test.dart`, `ring_membership_test.dart` (my requests, my card, colleagues, leave), `member_invite_test.dart`, `ring_invite_placement_test.dart`, `shared_with_me_test.dart`; `test/features/ring_detail/ring_people_view_test.dart` and `ring_people_controller_test.dart` (Invited, Waiting on you); `test/features/badge/scanner_controller_test.dart` (join QR vs badge).

## Log

- 2026-11-09 · app branch `rings/F-11/honest-rings` @ `0005f00` (with `f801aaa`; social_pin, not on `main` yet) · S-33 S1–S3, S5–S11 · s17 (invitations, My requests, named rows, Your card here), s74 (review, code, the card step), s43 join QR, the owner's card (Members · N, Leave, member Invite), s15 (Invite, Invited · N, Waiting on you), s19 Invite, s26 Join codes (make, Share, Copy, Show as QR, turn off, admins) · flagged [[S-33 Ring Invitations & Join Story]] and [[BI-17 Ring Invitations & Join Backend Integration]] (a member's Invite shown without `membersCanInvite`, no list or withdraw of what a member sent); [[FR-17 Ring Invitations & Join Frontend Requirements]] S6 flag settled and cleared
