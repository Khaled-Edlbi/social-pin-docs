---
id: FR-16
type: frontend-requirements
module: shared-rings
feature: delegated-admins
status: draft
scope: feature
screens: [s15, s16, s22, s69, s73]
blockedBy: []
depends: ["S-31 Delegated Admins Story"]
affects: ["BD-16 Delegated Admins Backend Delivery"]
related: ["S-31 Delegated Admins Story", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "D-32 Several join codes per Ring", "D-33 Work email joining waits for real emails and Companies", "D-35 A join code can be shown as a QR", "BI-06 Ring Members Backend Integration", "BI-08 Rings Backend Integration", "BI-17 Ring Invitations & Join Backend Integration", "FD-12 Rings Frontend Delivery", "FR-09 Ring Members Frontend Requirements", "FR-11 Rings Frontend Requirements", "FR-15 Companies Frontend Requirements", "FR-17 Ring Invitations & Join Frontend Requirements", "S-29 Companies Story", "S-96 Notifications Story", "S-87 Error Contract Story", "Frontend Contract", "GET /rings", "GET /rings/:id", "PATCH /rings/:id", "GET /rings/:ringId/members", "E_RING_02", "E_RING_05"]
pending: []
created: 2026-10-18
updated: 2026-11-16
tags: [frontend-requirements, frontend-requirements/draft, module/shared-rings, layer/frontend]
---

# Delegated Admins · Frontend Requirements

**Feature:** [[F-16 Delegated Admins]] · **Status:** Draft · **Story:** [[S-31 Delegated Admins Story]] (draft, updated 2026-11-16) · **Backend Integration:** not yet (no admin routes: [[BD-16 Delegated Admins Backend Delivery]])

What the client needs from the backend to build every part of [[S-31 Delegated Admins Story]], S1 to S9, and whether each need is met today. **Rewritten 2026-11-16** against the story as updated that day and its rules A1–A8 ([[S-31 Delegated Admins Story#Decided in this story|Decided in this story]]): the old two-screen layout (s26 Edit · access, s27 Edit · permissions), the picker over connections and the links to the old *Delegated Admins · S6* are gone; the six settings exist, so the ND-04 block is gone too.

**What exists today.** `RingAdmin` with the levels `CONTENT_MANAGER` and `MEMBER_MANAGER`; `assertCanAdminister` lets the owner or an admin at the right level write (`PATCH /rings/:id` at `CONTENT_MANAGER`+, member writes at `MEMBER_MANAGER`+). The six settings of [[D-04 Ring settings at launch and their defaults|D-04]] on `GET` / `PATCH /rings/:id` ([[BI-08 Rings Backend Integration|BI-08]]); the roster with names, Pin names, photos and `?name=` ([[BI-06 Ring Members Backend Integration|BI-06]]). In the app ([[FD-12 Rings Frontend Delivery|FD-12]] @ `778d9b4`): Edit Ring (s22) for the owner, read-only on a 403 with "Only the Ring's owner can change these."; the People tab (s15) with members, invitations and join codes; **no admin section anywhere**.

**Three rules that shape every row below:**

1. **Company Rings, owner only** (A1, A3). The ADMINS section, and every admin write, exist only on a `CORPORATE` Ring and only for its owner. The app decides what to show from the server's answer (`type`, `myLevel`), never from a guess.
2. **What a level may not do is absent, not disabled** (S6). The server says my level on the Ring (`myLevel`); the app hides what it doesn't allow. It never tries a write to find out.
3. **Each admin change saves at once** (A8): its own call, its own result; never batched with Edit Ring's *Save*.

## Per screen

### [[Screen Index#s15|s15]] People tab: ADMINS (S1, S2, S3, S4)

- **Where:** the Ring's People tab, next to invitations and join codes. Shown only when the Ring is `CORPORATE` **and** I'm its owner (A1, A3, A8). Hidden for a personal Ring and for every admin.
- **List:** `GET /rings/:ringId/admins` ❌ → `{ data: RingAdminEntity[], meta: { total } }`, owner only.

  | Shown | Field | Notes |
  |---|---|---|
  | Name | `displayName` | as I see them, like the roster |
  | Pin name | `pinName` | |
  | Photo | `avatarUrl` | initials until files load (D-16) |
  | Level in words | `level`: `CONTENT_MANAGER` / `MEMBER_MANAGER` | "Can edit what the Ring shows" / "Can also manage who's in it" (A3) |
  | — | `userId`, `createdAt` | for the writes; by name on screen |

- **Owner first**, marked *Owner*, not editable (from the Ring, no admin row); then the admins A→Z.
- **Empty:** "Only you run this Ring."
- **Add admin** (S2): a picker over **this Ring's current members** (A2): `GET /rings/:ringId/members?status=ACTIVE&name=…` ✅ (BI-06, with `displayName`, `pinName`, `avatarUrl`; search debounced as on s15). Members already admins are left out by the app, using the admins list it just read. Then the level sheet: the two levels with one line each.
  - *Add*: `POST /rings/:ringId/admins { userId, level }` ❌ → 201 with the `RingAdminEntity`. Saved at once; the row appears; the person is told once (A7, S9: the server's job).
  - The person stopped being a member meanwhile: 400 / 404 (proposed `E_RING_ADMIN_02`, not a member) → "Can't add this person", the picker refetches.
- **Change a level** (S3): tap a row → the level sheet; choosing saves at once: `PATCH /rings/:ringId/admins/:userId { level }` ❌ → 200. Nobody is told.
- **Remove** (S4): *Remove as admin* on the row, confirmation "{name} stays a member of {Ring}, but can't change it any more."; confirming saves at once: `DELETE /rings/:ringId/admins/:userId` ❌ → 204. The membership stays.
- **Optimistic:** none. Each change shows progress on its row and applies on success; on failure the row stays as it was with "Couldn't save. Try again."
- **Already gone** (removed or changed from another device): 404 (proposed `E_RING_ADMIN_03`, not an admin) → refetch the list, no error.
- States: loading; owner and admins; empty; picker (members, search, none left to add); level sheet; saving a row; "Can't add this person".

### [[Screen Index#s16|s16]] My Rings: Rings you manage (S5)

- A **Rings you manage** section below my own Rings, shown only when I administer at least one (A5).
- **Source:** `GET /rings/managed` ❌ (or a flag on `GET /rings`; the backend's choice) → each Ring with `id`, `name` (always: being made an admin is knowing, D-18), `colorHex`, `style`, the owner's `displayName`, and `myLevel`.
- A row: the Ring's name, its owner's name, its colour, my level in words; it opens the Ring's page with *Edit*.
- **Never** on Shared with me (D-14); the app never infers it from `GET /rings/shared-with-me`.
- When my rights end (A6), the Ring is no longer returned; the section drops it on the next refetch, without a message.

### [[Screen Index#s73|s73]] Company detail: MY ROLE HERE (S5)

- The same Rings, from the company's side: `adminRights { level, ringName }` on `GET /businesses/:id` ([[FR-15 Companies Frontend Requirements|FR-15]], [[S-29 Companies Story|S-29 S8]]). Nothing extra here; the levels in words are the same two.

### [[Screen Index#s22|s22]] Edit Ring, as an admin (S6, S7)

- **Load:** `GET /rings/:id` for an admin ❌: today it answers the owner only (404 `E_RING_02` for anyone else). Asked: the same Ring for a `RingAdmin`, with **`myLevel`** (`OWNER` / `CONTENT_MANAGER` / `MEMBER_MANAGER`).
- **"Can edit what the Ring shows"** (`CONTENT_MANAGER`): name, colour and icon, dates; and *What this Ring shows* (s24). None of the six settings.
- **"Can also manage who's in it"** (`MEMBER_MANAGER`): all of the above, plus the three **joining settings** (who can request to join, approve each one, members can invite others).
- **Absent at every level** (A4): *Who it's for*, members can see each other, members can save attachments, *Make this my default Ring*, *Delete Ring*. No work email domain (D-33).
- **Save** sends only what changed and only what `myLevel` allows (`PATCH /rings/:id` ✅ for the fields; by level ❌, below).
- **Settings by level** ❌: today a `CONTENT_MANAGER` can change all six settings through `PATCH /rings/:id` ([[BI-08 Rings Backend Integration|BI-08]]). Asked (A4): `joinPolicy`, `requiresApproval`, `membersCanInvite` accept `MEMBER_MANAGER`+ only; `purpose`, `membersCanSeeEachOther`, `membersCanSaveAttachments`, delete and default the owner only; 403 `E_RING_05` otherwise.
- An admin keeps editing a Ring past its end date, as the owner can.

### [[Screen Index#s15|s15]] People tab, as an admin (S6)

- **`MEMBER_MANAGER`**: the members (add, change the window, move, remove: `GET` / `POST /rings/:ringId/members`, `PATCH` / `DELETE …/:userId`, `POST …/:userId/reassign` ✅), invitations, and the **join codes and their QR** (make one, turn one off, [[D-32 Several join codes per Ring|D-32]], [[D-35 A join code can be shown as a QR|D-35]]; the routes are [[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]]'s, asked to accept `MEMBER_MANAGER`+). No ADMINS section.
- **`CONTENT_MANAGER`**: no People tab writes; the tab shows what any member may see, or nothing.
- Which applies comes from `myLevel` (above).

### When my level changes under me (S6)

- Any write answering **403 `E_RING_05`** (my level changed or my rights ended since the screen opened): "Your role on this Ring has changed", **once**; the app refetches `GET /rings/:id` and reloads the screen with what `myLevel` allows now. A 404 `E_RING_02` on that refetch (no rights left, or the Ring is gone): close the editor, back to My Rings, which refetches.
- This replaces, for an admin, the app's owner-only "Only the Ring's owner can change these." ([[S-31 Delegated Admins Story#Where the design disagrees (for the designer)|S-31, design row]]).

### When admin rights end (S8)

- Removed as admin, left or removed from the Ring, left the company, the Ring or the account deleted, a block with the owner: **no call and no notification** for the app. *Rings you manage* drops the Ring on the next refetch; an open screen gets the 403 or 404 above.

### [[Screen Index#s69|s69]] Being made an admin (S9)

- One notification, "{owner} made you an admin of {Ring}", opening the Ring's page with *Edit* ([[S-96 Notifications Story]]) ❌. Until notifications exist, the Ring simply appears in *Rings you manage*. No notification for a level change or a removal.

## Field map

| Shown | Source | Available |
|---|---|---|
| ADMINS list: name, Pin name, photo, level | `GET /rings/:ringId/admins` | ❌ |
| The picker: this Ring's members, searchable | `GET /rings/:ringId/members?status=ACTIVE&name=` | ✅ |
| Add, change, remove an admin | `POST` / `PATCH` / `DELETE /rings/:ringId/admins…` | ❌ |
| Rings you manage, by name, owner, colour, my level | `GET /rings/managed` (or a flag on `GET /rings`) | ❌ |
| My level on a Ring, for Edit Ring and s15 | `myLevel` on `GET /rings/:id` for an admin | ❌ |
| The Ring's fields and six settings | `GET` / `PATCH /rings/:id` | ✅ for the owner |
| Admin rights on s73 | `adminRights` on `GET /businesses/:id` | ❌ FR-15 |
| The notification on appointment | — | ❌ S-96 |

## Endpoints required

| Need | Endpoint | Available | Story part / rule |
|---|---|---|---|
| The admins of a Ring (owner only) | `GET /rings/:ringId/admins` | ❌ | S2 · A3, A8 |
| Add an admin at a level; refused on a non-company Ring, a non-member, the owner | `POST /rings/:ringId/admins { userId, level }` | ❌ | S2 · A1, A2, A3 |
| Change an admin's level | `PATCH /rings/:ringId/admins/:userId { level }` | ❌ | S3 · A3 |
| Remove an admin (membership stays) | `DELETE /rings/:ringId/admins/:userId` | ❌ | S4 · A3, A6 |
| The Rings I manage, with my level | `GET /rings/managed` (or a flag on `GET /rings`) | ❌ | S5 · A5 |
| The admin read of a Ring, with `myLevel` | `GET /rings/:id` for an admin | ❌ | S6 |
| Settings by level | `PATCH /rings/:id` (joining settings `MEMBER_MANAGER`+; `purpose`, the two privacy settings, delete, default owner only) | ❌ (today `CONTENT_MANAGER`+ for all six) | S6, S7 · A4 |
| Join codes and invitations for a `MEMBER_MANAGER` | FR-17's routes | ❌ | S6 · A4, D-32, D-35 · [[FR-17 Ring Invitations & Join Frontend Requirements\|FR-17]] |
| The picker over this Ring's members, with names and search | `GET /rings/:ringId/members?name=` | ✅ | S2 · A2 · [[FR-09 Ring Members Frontend Requirements\|FR-09]] |
| Member writes as owner or `MEMBER_MANAGER` | `GET` / `POST /rings/:ringId/members`, `PATCH` / `DELETE …/:userId`, `POST …/:userId/reassign` | ✅ | S6 |
| Edit the Ring's fields as owner or `CONTENT_MANAGER`+ | `PATCH /rings/:id` | ✅ | S6 |
| Ending the rights with the membership, the company, the Ring, the account | server side | ❌ | S8 · A6 |
| The notification on appointment | — | ❌ | S9 · A7 · [[S-96 Notifications Story]] |
| Admin error codes: not a company Ring, not a member, already an admin, not an admin | — | ❌ | S2–S4 |

## Behaviour expectations

- **Refetch, no realtime:** the admins list on opening the People tab and after every add, change or remove; *Rings you manage* when My Rings opens; Edit Ring's `GET /rings/:id` on open and after a 403. No polling.
- **Caching keys:** admins by (ringId); Rings I manage by (signed-in user); the admin read of a Ring by (user, ringId). After a 403 drop the last two for that Ring. On sign-out drop everything.
- **Paging:** `{ data, meta: { total } }`; admins are a short list, owner first then A→Z.
- **Saves:** each admin change on its own call, at once (A8); Edit Ring keeps its one *Save* for the Ring and its settings, sending only what changed and only what `myLevel` allows.
- **Optimistic:** none.
- **Offline:** nothing queued; "Couldn't save. Try again."; the screen stays as it was.
- **Privacy:** an admin never sees the ADMINS section; a Ring I manage is never shown on Shared with me (D-14).

## Error states the UI must handle

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] puts `ErrorCode` on the wire, the app branches on status and endpoint ([[Frontend Contract]]). The **proposed** codes are names for the backend to keep or rename.

| Status | ErrorCode | Where | Show |
|---|---|---|---|
| 403 | `E_RING_05` | any admin write, Edit Ring, s15 | "Your role on this Ring has changed", once; refetch and reload with what `myLevel` allows |
| 404 | `E_RING_02` | the admin read of a Ring | no rights left or the Ring is gone: close, back to My Rings |
| 400 | `E_RING_ADMIN_01` (proposed) not a company Ring | add | should not happen (hidden); "Admins are for company Rings" |
| 400 | `E_RING_ADMIN_02` (proposed) not a current member, or the owner | add | "Can't add this person"; the picker refetches |
| 409 | `E_RING_ADMIN_04` (proposed) already an admin | add | refetch the list, no error |
| 404 | `E_RING_ADMIN_03` (proposed) not an admin | change, remove | refetch the list, no error |
| 400 | validation (`message` an array) | add, change | should not happen; "Couldn't save" |
| 401 | `E_AUTH_04` | all | sign in again |
| — | offline, 5xx | all writes | "Couldn't save. Try again."; nothing queued |

## Blocked by

The story is a draft (updated 2026-11-16, not approved yet): this list waits on its approval as well as on:

- [[BD-16 Delegated Admins Backend Delivery|BD-16]]: the admin routes, Rings I manage, the admin read with `myLevel`, the settings by level, ending the rights.
- [[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]]: join codes and invitations accepting a `MEMBER_MANAGER`.
- [[FR-15 Companies Frontend Requirements|FR-15]]: `adminRights` on s73.
- [[S-96 Notifications Story]]: the notification on appointment (S9).
- [[S-87 Error Contract Story|Error Contract · S4–S8]]: the codes above are by status until then.

## Sign-off

- Approved by: — · on: —

## Log

- 2026-11-16 · `tickets/frontend/M-03-shared-rings/F-16-delegated-admins/FR-16-s-31-2026-11-16` · rewritten from S-31 as updated 2026-11-16 (A1–A8): ADMINS on the People tab s15, company Rings and owner only; the picker over the Ring's members (`GET /rings/:ringId/members?name=` ✅); the two levels in words; add, change, remove each saved at once; Rings you manage on s16 and s73; the admin's Edit Ring (s22) and s15 with owner-only controls absent, from `myLevel`; "Your role on this Ring has changed" on 403 `E_RING_05`; the endpoints S-31 lists as not built (admins list, add, change, remove, Rings I manage, `GET /rings/:id` for an admin with `myLevel`, settings by level); proposed `E_RING_ADMIN_01`–`04`. Dropped the s26/s27 two-screen layout, the connections picker, the *Delegated Admins · S6* links and the ND-04 block. Cleared the S-31 (2026-11-05, 2026-11-16), S-23 and D-04 flags. Kept `draft`
