---
id: FR-17
type: frontend-requirements
module: shared-rings
feature: ring-invitations
status: approved
scope: feature
screens: [s15, s17, s19, s26, s43, s74]
approvedBy: "khaled"
approvedAt: 2026-11-08
owner: "Omar Fostok"
affects: ["BD-17 Ring Invitations & Join Backend Delivery"]
related: ["S-33 Ring Invitations & Join Story", "BI-08 Rings Backend Integration", "FR-15 Companies Frontend Requirements", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "D-32 Several join codes per Ring", "D-33 Work email joining waits for real emails and Companies", "D-34 A member shows one of their own Rings", "D-35 A join code can be shown as a QR", "D-36 Who it's for stays the owner's alone", "S-37 Badge & QR Story", "S-87 Error Contract Story", "S-96 Notifications Story", "Frontend Contract"]
created: 2026-10-18
updated: 2026-11-09
tags: [frontend-requirements, frontend-requirements/approved, module/shared-rings, layer/frontend]
---

# 📨 Ring Invitations & Join · Frontend Requirements

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** Approved 2026-11-08 by khaled · **Story:** [[S-33 Ring Invitations & Join Story]] (approved 2026-11-08) · **API Integration:** [[BI-17 Ring Invitations & Join Backend Integration]] (backend `main` `1c460b0`)

What the client needs from the backend to build [[S-33 Ring Invitations & Join Story]] S1–S12, and whether each need is met today. **Rewritten 2026-11-08** against the approved story, [[D-31 An invitation is its own record|D-31]] to [[D-36 Who it's for stays the owner's alone|D-36]], and backend `main` @ `12172c6` ([[BI-08 Rings Backend Integration]]). Routes that don't exist yet are asked for as needs, not names: the backend names them in [[BD-17 Ring Invitations & Join Backend Delivery]]; the two join-request routes keep the names [[FR-15 Companies Frontend Requirements|FR-15]] already asked for.

Each screen ends with **What changes in the app**: the app as it is today (`social_pin`, `rings/F-11/honest-rings`) and what this feature changes on it.

## Per screen

### [[Screen Index#s17|s17]] Shared with me (S1, S5, S10)

- **Needs:**
  - the people who share with me (exists): one row per person, `ringId`, `pinName`, `displayName`, `avatarUrl`, `expiresAt`, `ringName`, `memberCount`;
  - on a row I **joined knowingly**: `ringName` set, and `memberCount` set only when the Ring lets members see each other (D-18);
  - on that row, **my picked Ring** for my card there (its id and name: it is my own Ring, so I may see its name) (S10, D-34);
  - my **pending invitations**: invitation id, Ring name, owner (display name, Pin name, photo), inviter (display name), sent at, optional access window, `valid` (false once the Ring ended or was deleted), and `business { id, name, logoFileId }` on a company Ring (D-31, FR-15);
  - my **join requests**: `id`, `status` (`PENDING` | `DECLINED`), `createdAt`, `ringName`, `business` (FR-15).
- **Source today:** `GET /rings/shared-with-me` ✅ (`ringName` on a row I joined knowingly, `memberCount` when the Ring lets members see each other); `GET /rings/invitations/mine` ✅; `GET /rings/join-requests/mine` ✅. The picked Ring: `myCardRingId` / `myCardRingName` on each named row ✅.
- **What changes in the app:** today the tab lists people only. It gains an **Invitations** section and a **My requests** section above the people (each hidden while empty, each loading on its own); a joined-knowingly row shows "Acme Team · Shared by …" and **"Your card here: <my Ring> ›"**, which opens the picker (s74 step below). *Join with a code* opens s74.
- **Which Ring a row opens (2026-11-09, [[S-33 Ring Invitations & Join Story|S-33 S1]], D-15 stands):** the row's `ringId` as the server gives it, the first Ring the person put me in, however it was made; the app never picks another. After *Join Ring*, a row that already opened a Ring I was placed in stays on it, unnamed (`ringName` null, no "Your card here"); the Ring joined later is that person's next view. A row with `myCardRingId` null shows no *Your card here*.

### [[Screen Index#s74|s74]] Review an invitation, join with a code (S2, S3, S4)

- **Needs:**
  - one invitation to review: the fields above (never the Ring's colour, type or `purpose`: D-36); accept, decline, dismiss (an invalid one);
  - accept returns the new membership (its `ringId`), so the card opens and the next step can save my pick;
  - **a code resolved to a review** before anything happens: the Ring's name, the owner (display name, Pin name, photo), and whether joining makes a request (`requireApproval`); then join, or send the request;
  - one neutral refusal for a code that is wrong, off, ended or used up, and one for too many tries (with when I may try again, if the backend gives it);
  - a code refused under "only by invitation" reads the same as a wrong one.
- **Source today:** `POST /rings/invitations/:id/accept` ✅, `POST /rings/invitations/:id/decline` ✅, `POST /rings/invitations/:id/dismiss` ✅, `POST /rings/join-codes/resolve` ✅, `POST /rings/join-codes/join` ✅. `GET /views/ring/:ringId` ✅ opens the owner's card only **after** joining (before, the viewer gets the neutral 404).
- **What changes in the app:** today `join_company_ring_screen.dart` is a sample (Alma Group) with four ways in and a "What you contribute" list. It keeps **This invite** and **Invite code** only:
  - **Work email** goes (D-33), with "verified domain alma.co";
  - **Scan a colleague** goes: the app's scanner opens this screen instead (D-35);
  - **"What you contribute"** (name, work email, phone, photo) goes: replaced by the "Your card in <Ring>" step (D-34);
  - no "who it's for" line (D-36); "What joining gives you" is the Ring's bio once joined, not before;
  - the code field takes K7QM-4RXT, any case, dash optional; with approval on, *Join Ring* shows "Request sent: {owner} will approve it".

### s74 → "Your card in <Ring>" (S10, D-34)

- **Needs:** my own Rings (exists, `GET /rings`); **set** the picked Ring on my membership in that Ring, and **read** it back; a picked Ring that is not one of my live Rings refused; when the picked Ring is deleted, the read answers my default Ring.
- **Source today:** `GET /rings` ✅; the pointer: `GET` / `PUT /rings/:ringId/my-card` ✅ (`picked: false` on the default; 400 `E_RING_MEMBER_05` on a Ring that is not mine and live).
- **What changes in the app:** a **new step** after *Join Ring* (and the first time I open a Ring whose request was approved): "Your card in Acme Team", my Rings with the default pre-selected, one line on who sees it ("Members see this card" / "Nobody sees it unless the owner lets members see each other"), *Done*. Not drawn: the app's own list style.
- **Only for a Ring I joined knowingly (2026-11-09, [[S-33 Ring Invitations & Join Story|S-33 S10]]):** a member the owner **placed** gets no step and no *Your card here*; the app never calls `my-card` for them. If it is reached anyway, the 404 `E_RING_ACCESS_01` is intended: the step closes quietly, no error shown.

### [[Screen Index#s43|s43]] Scanner (S9, D-35)

- **Needs:** a scanned **join QR** resolved to the same review as a typed code, with the same refusals; a way to tell a join QR from a badge (the backend writes it in BD-17); a badge resolve that never returns a join offer.
- **Source today:** a join QR carries `socialpin://join/<code>` and goes to `POST /rings/join-codes/resolve` ✅ with the scanned text as `code`; a badge carries `https://socialpin.me/q/<token>` ([[S-37 Badge & QR Story|Badge & QR]]).
- **What changes in the app:** today the scanner is a timer that shows a sample card. When it reads a join QR it opens s74 with the code's review; a badge still opens only a person's card.

### [[Screen Index#s15|s15]] The Ring's people, the owner's side (S6, S8)

- **Needs:**
  - **invite** one person: a connection or a Pin name, an optional access window; refused when I may not invite (not the owner, not an admin at "can also manage who's in it", or a member while "members can invite others" is off);
  - **Invited · N**: the invitations sent and not answered (invitee display name, Pin name, photo, sent at, status `PENDING` | `DECLINED`), **withdraw** one;
  - **Waiting on you · N**: the join requests (person display name, headline, photo, **the label of the code they used**, asked at), **approve**, **decline**.
- **Source today:** the members list ✅ ([[S-16 Ring Members Story|Ring Members]]); `POST /rings/:ringId/invitations` ✅, `GET /rings/:ringId/invitations` ✅, `POST /rings/:ringId/invitations/:id/withdraw` ✅, `GET /rings/:ringId/join-requests` ✅, `POST /rings/:ringId/join-requests/:id/approve` ✅, `POST /rings/:ringId/join-requests/:id/decline` ✅.
- **What changes in the app:** *Invite* on the Ring's people; two new sections, **Invited · N** (with *Withdraw*) and **Waiting on you · N** ("asked with *Onboarding week*", *Add*, *Decline*). Pending invitations are never shown or counted as members.

### [[Screen Index#s19|s19]] New Ring wizard, step 2 (S6)

- **Needs:** the same invite as s15, sent for the Ring just created.
- **What changes in the app:** step 2 offers *Invite* beside adding members, with the D-18 line "People who join this way will see this Ring's name."

### [[Screen Index#s26|s26]] Edit Ring → Joining → Join codes (S7, S9, D-32, D-35)

- **Needs:**
  - **list** the Ring's codes: id, label, the code text, end date, use limit, uses so far, state (active, off, ended, used up);
  - **make** a code: label (required, ≤ 40), optional end date, optional use limit; refused at 10 active;
  - **turn off** a code;
  - the code text is what *Share* sends and what *Show as QR* draws (the client draws the QR from what the backend says a join QR carries);
  - managed by the owner (later admins at "can also manage who's in it"); refused, and the list hidden, under "only by invitation".
- **Source today:** the Ring's settings ✅ (`PATCH /rings/:id`, `joinPolicy`, `requireApproval`); `GET /rings/:ringId/join-codes` ✅, `POST /rings/:ringId/join-codes` ✅, `POST /rings/:ringId/join-codes/:codeId/turn-off` ✅.
- **What changes in the app:** today *Joining* has who can join and approval, each with "Takes effect when…", an approval line "Auto-accept is set per QR code" and an old **"Verified email required"** row. It gains a **Join codes** list (label, K7QM-4RXT, "12 of 20 used", *Off* / *Ended*), *Make a new code* (a sheet: label, end date, use limit), and per active code **Share**, **Show as QR** (a new full-screen QR with the code under it) and **Turn off**. The "Verified email" row and the "per QR code" wording go. Not drawn: the app's own style.

### Inside a Ring I joined (S11, D-34)

- **Needs:** when `membersCanSeeEachOther` is on: **Members · N** and each member's card rendered from **the Ring they picked**, never that Ring's name or id; nothing at all while it's off. **Leave this Ring** as a member.
- **Source today:** the owner's card `GET /views/ring/:ringId` ✅; the roster `GET /rings/:ringId/colleagues` ✅ (404 while members can't see each other); leave `POST /rings/:ringId/leave` ✅.
- **What changes in the app:** the owner's card gains **Members · N** (only when allowed), each colleague opening their picked card; a colleague who is also my connection opens that card here and the card they share with me everywhere else. **Leave this Ring** at the bottom, only on a Ring I joined knowingly (a named row).
- **A placed member (2026-11-09, [[S-33 Ring Invitations & Join Story|S-33 S11]]):** sees **Members · N** while allowed (the roster answers any live member), but has **no *Leave this Ring***: the owner placed them and only the owner removes them. The 404 `E_RING_ACCESS_01` on `POST /rings/:ringId/leave` for them is intended; the app never shows the button, so never meets it.
- **A member invites (2026-11-09, [[S-33 Ring Invitations & Join Story|S-33 S6]]):** "+ Invite someone to <Ring>" on the owner's card, a connection or a Pin name, **no access window**, only while the Ring lets members invite. Needs: `POST /rings/:ringId/invitations` ✅ (403 `E_RING_INVITATION_04` when members may not); **whether this Ring lets members invite**, readable by a member ❌ (today the app offers it on every Ring joined knowingly and hides it after a 403); **the invitations I sent** to this Ring, and *Withdraw* on mine ❌ (the Ring's list is the owner's and admins'). Shipped as far as the routes allow: [[FD-15 Ring Invitations & Join Frontend Delivery|FD-15]].

### [[Screen Index#s72|s72]] My companies (FR-15)

- Owned by [[FR-15 Companies Frontend Requirements]], and it stays there (2026-11-09): nothing about s72 is asked here. FR-17 brings it `business` on invitations and my join requests (rows below).
- **What changes in the app:** "Invite code, work email or a QR from a colleague" reads "Invitation, code or a join QR" (D-33, D-35); the invitation row ("Company Ring · brand kit, directory, support line") shows no purpose (D-36). FR-15 takes the copy.

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| People who share with me | `GET /rings/shared-with-me` | ✅ | S1 |
| The owner's card of a Ring I'm in | `GET /views/ring/:ringId` | ✅ | S2, S11 |
| My own Rings (for the card picker) | `GET /rings` | ✅ | S10 |
| The Ring's joining settings | `PATCH /rings/:id` (`joinPolicy`, `requireApproval`) | ✅ | S7 |
| `ringName` / `memberCount` filled when joined knowingly | `GET /rings/shared-with-me` | ✅ | S1, D-18 |
| My pending invitations, with `valid` and `business` | `GET /rings/invitations/mine` | ✅ | S1, D-31, FR-15 |
| Accept an invitation (returns the membership) | `POST /rings/invitations/:id/accept` (returns `ringId`, `ringName`) | ✅ | S2, D-31 |
| Decline an invitation | `POST /rings/invitations/:id/decline` | ✅ | S2, D-31 |
| Dismiss an invitation that is no longer valid | `POST /rings/invitations/:id/dismiss` | ✅ | S1, D-31 |
| Resolve a join code to a review | `POST /rings/join-codes/resolve` | ✅ | S3, D-32 |
| Join, or send a request, with a code | `POST /rings/join-codes/join` | ✅ | S3, D-32 |
| Resolve a scanned join QR to a review | `POST /rings/join-codes/resolve` (the scanned `socialpin://join/…` text as `code`) | ✅ | S9, D-35 |
| My join requests | `GET /rings/join-requests/mine` | ✅ | S5, FR-15 |
| Cancel or dismiss my join request | `DELETE /rings/join-requests/:id` | ✅ | S5, FR-15 |
| Set / read my picked Ring in a Ring I joined | `GET` / `PUT /rings/:ringId/my-card`; `myCardRingId` / `myCardRingName` on `GET /rings/shared-with-me` | ✅ | S10, D-34 |
| Invite a person (connection or Pin name, window) | `POST /rings/:ringId/invitations` | ✅ | S6, D-31 |
| The Ring's invitations (Invited · N), withdraw | `GET /rings/:ringId/invitations`, `POST /rings/:ringId/invitations/:id/withdraw` | ✅ | S6, D-31 |
| The Ring's join requests with the code label, approve, decline | `GET /rings/:ringId/join-requests`, `POST /rings/:ringId/join-requests/:id/approve`, `POST /rings/:ringId/join-requests/:id/decline` | ✅ | S8, D-32 |
| The Ring's join codes: list, make, turn off | `GET /rings/:ringId/join-codes`, `POST /rings/:ringId/join-codes`, `POST /rings/:ringId/join-codes/:codeId/turn-off` | ✅ | S7, D-32 |
| The member-facing roster (picked cards) | `GET /rings/:ringId/colleagues` | ✅ | S11, D-34 |
| Leave a Ring as a member | `POST /rings/:ringId/leave` | ✅ | S11 |
| A member invites (no window) | `POST /rings/:ringId/invitations` | ✅ | S6 |
| Whether members may invite, told to a member; a member's own sent invitations, withdraw | — | ❌ | S6 |
| Notifications: invitation received, request approved, request waiting | — | ❌ | S12, [[S-96 Notifications Story|Notifications]] |
| Join with a verified work email | — | not in this version | S4, D-33 |

## Behaviour expectations

- **Refetch:** s17 reads the people, the invitations and my requests on screen focus and on app resume, each on its own (one failing never blanks the others). After accept, decline, dismiss, cancel or join: refetch all three and My companies. s15 reads Invited and Waiting on focus; s26 reads the codes on open and after make or turn off. No polling until notifications exist.
- **Caching keys:** people, invitations and requests by (signed-in user); a Ring's invitations, requests and codes by (ring id); my picked Ring by (membership / ring id); a card by (viewer, ring id). Never compare or show `ringId` to the user.
- **Pagination / ordering:** `{ data, meta: { total } }`, `limit` ≤ 50; invitations and requests newest first; codes active first, then newest.
- **Code entry:** uppercase, strip spaces and the dash before sending; no shape check beyond non-empty, so the UI never reveals the pattern. Show it back grouped (K7QM-4RXT).
- **One neutral message** for every failed code or QR ("This code doesn't work"); a separate one only for too many tries. Never branch the copy on the cause.
- **Never shown:** a Ring's colour or type to a member or invitee; `purpose` anywhere outside the owner's own screens (D-36); the picked Ring's name to anyone but me (D-34); which Ring a badge's holder is in (D-14).
- **After *Join Ring*:** the "Your card" step, then s17 (not My Rings).
- **Placed or joined knowingly:** told apart only by the Shared with me row (`ringName` / `myCardRingId` set on a Ring I joined knowingly, null on a placed one); never by trying `my-card` or `leave` and reading the 404.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_02` | the Ring ended: "This invitation is no longer valid" (review) or "This Ring has ended" (card); drop it on the next refetch |
| 404 | `E_RING_ACCESS_01` | not a member any more, or blocked: the neutral "not available" of any view |
| 401 | `E_AUTH_04` | sign in again |
| 400 | — | an invalid label, end date, use limit or window on the owner's forms: inline |
| — | the code, invitation, request, limit and permission codes | named by the backend in BD-17; until then: a refused code → the neutral message; too many tries → "Too many tries. Try again later."; 10 active codes → "Turn a code off first"; not allowed to invite or manage → the action hidden after one refusal. Branch on `statusCode` until [[S-87 Error Contract Story|Error Contract · S4–S8]] |

## Blocked by

- [[BD-17 Ring Invitations & Join Backend Delivery]]: every ❌ row above.
- [[S-87 Error Contract Story|Error Contract · S4–S8]]: the error table is by status until then.
- [[S-96 Notifications Story|Notifications]]: S12.
- Not drawn (the app's own style until a designer): the Join codes list and its sheet, Show as QR, the "Your card in <Ring>" step, Invited and Waiting on s15.

## Log

- 2026-11-08 · `tickets/frontend/M-03-shared-rings/F-17-ring-invitations/FR-17-draft` · rewritten against the approved S-33 (S1–S12) and D-31 to D-36: per screen s17, s74, the "Your card" step, s43, s15, s19, s26, inside the Ring, with **What changes in the app** under each; the endpoints table re-keyed to S-33's parts (no work email, several join codes with QR, invitations as their own record, the picked-Ring pointer, the member roster); FR-15's asks added; no purpose anywhere; all 13 ⚠ flags settled and cleared (S-33 ×2, D-31 to D-36, D-04, D-18, FR-15, S-23's renumbering, which no longer applies: no Connections part is linked); stays draft
- 2026-11-08 · `tickets/frontend/M-03-shared-rings/F-17-ring-invitations/FR-17-ready` · set ready on Omar Fostok's word: handed to `/backend` to review, approve or send back
- 2026-11-08 · `tickets/backend/M-03-shared-rings/F-17-ring-invitations/FR-17-accepted` · reviewed by `/backend` against backend `main` @ `cb95a39` and approved (khaled): every ✅ row holds (`GET /rings/shared-with-me` and its fields, `GET /views/ring/:ringId`, `GET /rings`, `PATCH /rings/:id` with `joinPolicy` / `requireApproval`, `E_RING_ACCESS_01` / `02`, `E_AUTH_04`); the ❌ asks match S-33 S1–S12. [[BD-17 Ring Invitations & Join Backend Delivery]] → in progress; the ❌ rows stay until the backend branch is merged
- 2026-11-08 · `tickets/backend/M-03-shared-rings/F-17-ring-invitations/FR-17-rows-delivered` · backend `main` `1c460b0` shipped S-33 S1–S3, S5–S9: 14 rows → ✅ with their endpoints (`ringName` / `memberCount` on Shared with me, invitations, join codes, the join QR, join requests); the *Source today* lines and the API Integration link ([[BI-17 Ring Invitations & Join Backend Integration]]) updated. Still ❌: the picked Ring (S10), the member roster and leave (S11), notifications (S12); work email is not in this version. The error codes are named in BI-17 (on the wire once [[S-87 Error Contract Story|Error Contract]] ships)
- 2026-11-09 · `docs/backend/M-03-shared-rings/F-17-ring-invitations/BD-17-picked-ring-and-roster` · backend `main` `14c6916` shipped S-33 S10 and S11: three rows → ✅ with their endpoints (picked Ring, roster, leave) and the s17, s74 "Your card" and *Inside a Ring* *Source today* lines updated ([[BD-17 Ring Invitations & Join Backend Delivery]], [[BI-17 Ring Invitations & Join Backend Integration]]). Still ❌: notifications (S12); work email is not in this version.
- 2026-11-09 · `tickets/frontend/M-03-shared-rings/F-17-ring-invitations/FR-17-decisions-2026-11-09` · Omar Fostok's decisions on [[S-33 Ring Invitations & Join Story]]: a Shared with me row opens the server's `ringId`, the first Ring (D-15 stands), the Ring joined later is the next view (s17); a placed member gets no "Your card in <Ring>" step and no *Leave*, the 404 on `my-card` / `leave` is intended (s74 step, inside a Ring); placed and knowing told apart by the row only; s72 stays with [[FR-15 Companies Frontend Requirements|FR-15]]. No new endpoint or field: the backend's approval stands
- 2026-11-09 · `docs/frontend/M-03-shared-rings/F-17-ring-invitations/FD-15-shipped` · the S-33 S6 flag settled and cleared: the member's invite added under *Inside a Ring I joined* and to the endpoints table, with two ❌ needs the app met while shipping [[FD-15 Ring Invitations & Join Frontend Delivery|FD-15]] (whether members may invite, told to a member; a member's own sent invitations and withdraw); status unchanged
