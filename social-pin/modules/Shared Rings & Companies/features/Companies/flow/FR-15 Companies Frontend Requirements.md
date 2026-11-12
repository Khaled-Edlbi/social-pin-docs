---
id: FR-15
type: frontend-requirements
module: shared-rings
feature: companies
status: ready
scope: feature
screens: [s14, s15, s26, s38, s63, s68, s72, s73, s74]
blockedBy: []
depends: ["S-29 Companies Story"]
affects: ["BD-15 Companies Backend Delivery"]
related: ["S-29 Companies Story", "D-02 One main profile every Ring starts from", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-16 Files load from signed links that expire in 15 minutes", "D-18 Ring names shown when joined knowingly", "S-15 Ring Access Engine Story", "BI-06 Ring Members Backend Integration", "BI-08 Rings Backend Integration", "BI-09 View As & Pin Views Backend Integration", "FR-07 Profiles & Pin Name Frontend Requirements", "FR-09 Ring Members Frontend Requirements", "FR-10 Ring Projection Frontend Requirements", "FR-11 Rings Frontend Requirements", "FR-16 Delegated Admins Frontend Requirements", "FR-17 Ring Invitations & Join Frontend Requirements", "FR-24 Exhibitor Frontend Requirements", "S-87 Error Contract Story", "Frontend Contract", "GET /rings", "GET /rings/shared-with-me", "PATCH /rings/:id", "GET /views/ring/:ringId", "GET /rings/:ringId/members", "PATCH /rings/:ringId/projection", "E_RING_02", "E_RING_05"]
pending: []
created: 2026-10-18
updated: 2026-11-05
tags: [frontend-requirements, frontend-requirements/ready, module/shared-rings, layer/frontend]
---

# 📨 Companies · Frontend Requirements

> ⚠ Affected by [[D-39 The company domain and the title switch show in the MVP]] (2026-11-12): s73's "Verified · {domain}" and s72's "Let {company} update my title" are shown in the MVP (not hidden); what they stand for starts right after the MVP

**Feature:** [[F-15 Companies]] · **Status:** Ready (waiting on the backend's review) · **Story:** [[S-29 Companies Story]] (approved 2026-11-05) · **Backend Integration:** not yet (no routes: [[BD-15 Companies Backend Delivery]])

What the client needs from the backend to build every part of [[S-29 Companies Story]], S1 to S14, and whether each need is met today. **Rewritten 2026-11-05** against the approved story and its decisions P1–P11 ([[S-29 Companies Story#Decided in this story|Decided in this story]]). This answers the flags the old list carried: D-18 and D-04 are applied row by row below, every link names the story's current parts (the old *Companies · S6* is now S2, S5, S9 and P2), and P9–P11 are cited where they apply.

**What exists today.** `CORPORATE` Rings with `parentRingId` (`POST /rings`), the Rings shared with me (`GET /rings/shared-with-me`), a Ring's card (`GET /views/ring/:ringId`) and the owner's or admin's roster (`GET /rings/:ringId/members`). Everything about a **business**: no route; the `Business` tables exist and no Ring points at a business. In the app, s72, s73 and s74 are **sample screens** (Acme Studio, Northstar, Loop, Alma Group) and send nothing.

**Four rules that shape every row below:**

1. **A company is only the ones I chose** (P1). Joined by invitation, code or work email, or accepted the owner's team invitation. A Ring the owner placed me in never makes a company appear on my s72, and the backend decides this, not the app.
2. **A Ring's name only when I joined it knowingly** (D-18, P7). The server sends `name: null` for a Ring I was placed in or moved into; the app shows "{Company} card". **No colour, no type, no `parentRingId`** ever reaches a member: the server sends the Rings already in order.
3. **A count only where I may see the people** (D-04, S7). Owner, admin at member level, or "members can see each other" on. Otherwise the server sends `null` and the app shows nothing: never 0, never a sample. The app never calls a roster to find out.
4. **The business is the server's to resolve** (P2). The app never groups Rings into companies itself (`GET /rings/shared-with-me` carries no business and shouldn't be used for this).

## Per screen

### Entry points: Discover [[Screen Index#s38|s38]] and Me [[Screen Index#s68|s68]] (S1)

- **Companies** tile on s38 and **Companies** row on Me → s72.
- Me's row: "Companies · 2" from `meta.total` of `GET /businesses/mine?limit=1` ❌; no number at 0.
- *Create a business account* on Me when I own no business: no company in the list has `myBadge: OWNER`. → the setup ([[FR-24 Exhibitor Frontend Requirements|FR-24]]).
- Refetched when Me opens; no polling.

### [[Screen Index#s72|s72]] My companies (S2)

- **List:** `GET /businesses/mine?limit=&skip=` ❌ → `{ data: BusinessSummaryEntity[], meta: { total } }`, by name, `limit` ≤ 50.
- **`BusinessSummaryEntity`** needs:

  | Shown | Field | Notes |
  |---|---|---|
  | Logo | `logoFileId` | initial until files load (D-16) |
  | Name | `name` | |
  | Badge | `myBadge`: `OWNER` / `ADMIN` / `MEMBER` | *Owner*, *Admin*, nothing |
  | Verified email | `verifiedEmail` | only when I joined one of its Rings with a work email; else null |
  | People | `peopleCount` | **null** unless rule 3 allows; each person once, me not counted, blocked pairs not counted |
  | Joined | `joinedAt` | used on s73 |

- **My title on a row** comes from my profile (P4, P10), not from the company: the row shows my *role* only on the company whose name matches my profile's *company*; the others show no title (P11). One field, never per company (S4).
- Listed **while I have at least one live membership** in its Rings (S2, S10); the server filters, the app shows what it gets.
- *+ Join a company Ring* → s74 with nothing picked ([[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]]).
- Empty: "You're not part of a company yet", with *Join a company Ring*.
- Footnote: "Leaving a company removes its shared Rings. Connections you made stay yours."
- Refetch on open, on pull, after leave, and when coming back from s74.
- States: loading, list, waiting section (S3), empty, offline ("You're offline").

### [[Screen Index#s72|s72]] Waiting: invitations and my join requests (S3)

- Above the list, hidden when both are empty. The invitations and join requests are [[S-33 Ring Invitations & Join Story]]'s ([[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]]); s72 needs them **by company**:
  - **Invitations to me** for a company Ring: FR-17's pending-invitations route, with each row carrying `business { id, name, logoFileId }`, the Ring's name (an invitation names its Ring, D-18) and its "who it's for" label. `GET /rings/invitations/mine` ✅ (backend `main` `1c460b0`, [[BI-17 Ring Invitations & Join Backend Integration|BI-17]]): `business` is on each row, `null` until a company Ring is linked to its business (the business ↔ Ring row below); no "who it's for" label, which stays the owner's ([[D-36 Who it's for stays the owner's alone|D-36]]). *Review* → s74 for it.
  - **My join requests** to a company Ring: `GET /rings/join-requests/mine` ✅ → `{ id, status: PENDING | DECLINED, createdAt, business { id, name, logoFileId } | null, ringName }`.
- *Cancel* a pending request: `DELETE /rings/join-requests/:id` ✅ → 200, no body; the same call dismisses a declined one. The row leaves at once (optimistic) and comes back with "Couldn't cancel" on failure. Already answered (approved, cancelled, dismissed): 404 `E_RING_JOIN_REQUEST_01` → refetch, no error.
- **Approved:** the request is not returned any more, and the company is in `GET /businesses/mine` on the next refetch.
- **Declined:** "Not approved" with *Dismiss*, never why. *Dismiss*: `DELETE /rings/join-requests/:id` (the same call removes it from my list).
- **An invitation to a Ring that ended or was deleted:** the row carries `valid: false` → "This invitation is no longer valid", *Dismiss* only (FR-17's dismiss).
- Copy: "Loop · Requested 2 days ago · waiting on their admin"; "Alma Group invited you · Company Ring · brand kit, directory, support line".

### [[Screen Index#s72|s72]] My work identity (S4)

- **Shown as** "Design lead, Acme Studio": my main profile's **role** and **company** (D-02, P10) from `GET /profiles` ✅ once the fields exist ❌ ([[FR-07 Profiles & Pin Name Frontend Requirements|FR-07]]). Tap → edit them, `PATCH /profiles/:id { role, company }` ❌ (FR-07). Hidden until the fields exist.
- **Verified email:** `verifiedEmail` of the companies (S2); one line per address; hidden when none.
- **Show company on my Public Ring:** the *company & role* switch on my **default Ring's** projection, `PATCH /rings/:ringId/projection` ✅ once the projection has those fields ❌ ([[FR-10 Ring Projection Frontend Requirements|FR-10]]). The same value s24 shows: the app reads it from the projection, never keeps its own. Saved at once; on failure the switch goes back with "Couldn't save". Hidden until the field exists.
- *Let Acme Studio update my title*: **hidden** (P4, v1). No backend need.

### [[Screen Index#s73|s73]] Company detail (S5, S6, S7, S8, S11)

- **One call:** `GET /businesses/:id` ❌ →
  ```
  { id, name, logoFileId, domain,            // "acme.co" or null; never "verified" in the MVP (P6)
    cardRingId,                               // the company's public card, for the header tap (P9)
    myBadge, verifiedEmail, joinedAt,
    rings: [{ ringId, name, label, myExpiresAt, peopleCount }],   // in order, top first (S6)
    adminRights: { level, ringName } | null,  // the highest, S8
    colleagues: { count, alreadyInMyRings } | null }              // null unless rule 3 allows (S7)
  ```
- **Header** (S5): logo, name, **domain** ("acme.co", no *Verified*, P6, hidden when null), my title (as on s72, P11), "joined 12 Feb 2026" from `joinedAt`, the badge.
  - Tap → the company's public card: `GET /views/ring/:cardRingId`. **Every member of the company may read it**, even when they're only in a lower Ring ([[S-29 Companies Story#Decided in this story|S-29 P9]]): today the views answer only members of that Ring. ❌ Asked: the access engine answers the company's card Ring for every company member (P1), through the same view; reading it gives no membership, no roster and no other Ring.
  - s73 never repeats the company's address, contacts or files (S5): they're on that card.
- **RINGS IT SHARES WITH YOU** (S6): `rings`, in the server's order; for the owner, every Ring of the company (S11).
  - `name` set → the name ("Acme Team"); `name: null` → "{Company} card" (D-18, P7).
  - Under it: `peopleCount` ("22 people") when not null, then `label` (the Ring's "who it's for", D-04), "until 12 Nov" from `myExpiresAt` when set.
  - A row → `GET /views/ring/:ringId` ✅ (s14). An ended Ring: 404 `E_RING_ACCESS_02` → "This Ring has ended", s73 refetches.
  - "Company · Your own Ring": **not shown** (P3).
- **PEOPLE** (S7): from `colleagues`; hidden when null.
  - "22 colleagues" and "14 already in one of your Rings" (`alreadyInMyRings`, hidden at 0; a number only).
  - Tap → the people of that company I may see:
    - **owner or admin**: the Rings I administer; one Ring → its roster on s15 (`GET /rings/:ringId/members` ✅; names ❌, [[FR-09 Ring Members Frontend Requirements|FR-09]]); several → pick the Ring first;
    - **plain member with "members can see each other"**: the member-facing list of that Ring ❌ ([[FR-09 Ring Members Frontend Requirements|FR-09]]).
  - The server says which Rings in `rings[].peopleCount` (not null = I may see that Ring's people); the app never tries a roster and reads a 403.
- **MY ROLE HERE** (S8): *Title* (as in S4, P10; tap edits it); *Verified email* when set; *Admin rights* from `adminRights`: the level in words ("Can edit what the Ring shows" / "Can manage who's in it", [[FR-16 Delegated Admins Frontend Requirements|FR-16]]'s levels) and the Ring's name when not null ("Can manage who's in Acme Team"). Hidden for a member.
- **Leave company** (S9): hidden when `myBadge` is `OWNER` (P5).
- **Errors on load:** 404 `E_BUSINESS_01` (proposed; not part of it any more, or no such company) → "You're no longer part of this company", back to s72, s72 refetches.
- States: loading; header with or without the domain; Rings named and unnamed; PEOPLE shown or hidden; MY ROLE with or without admin rights; leaving; "no longer part of this company"; offline.

### [[Screen Index#s73|s73]] → [[Screen Index#s72|s72]] Leave (S9)

- Confirmation, from the detail: "Leave {name}? You leave its {n} Rings and lose your admin rights there. The connections you made stay yours." (`n` = `rings.length`; the admin clause only when `adminRights`).
- `POST /businesses/:id/leave` ❌ → 204. **One transaction** on the server (P5): every membership of mine in its Rings, my admin rights on them, my pending join requests to it, my place in the company, and the work email counting for it. All or nothing. My connections and my own Rings: untouched.
- **No optimistic leave:** *Leaving…* until the answer; then back to s72, the row collapses out (a fade with reduced motion), and the app drops: the businesses list, that company, Shared with me, and the views of its Rings.
- **The owner:** never sent (hidden); if it is, 409 `E_BUSINESS_02` (proposed) → "The owner can't leave their company", nothing changes.
- **Already gone** (removed a moment ago): 404 `E_BUSINESS_01` → treated as left.
- Offline or 5xx: "Couldn't leave. Try again." Nothing changes; nothing queued.

### When a company leaves my list without me (S10)

- Removed by an admin, its Rings ended or deleted, a block with the owner, the business deleted: **no call and no notification**. The server stops returning the company; the next refetch of s72 drops it, and an open s73 gets `E_BUSINESS_01` (above). Nothing tells the reasons apart.
- A block with a colleague (not the owner): only `colleagues` changes (the server stops counting them).

### [[Screen Index#s26|s26]] A company Ring's settings: the work email domain (S12)

- Only on a `CORPORATE` Ring, only for its owner and its admins (as the other settings, [[FR-11 Rings Frontend Requirements|FR-11]], [[FR-16 Delegated Admins Frontend Requirements|FR-16]]).
- **Read:** `requiredEmailDomain` on `GET /rings/:id` ❌. **Save:** `PATCH /rings/:id { requiredEmailDomain: "acme.co" | null }` ❌; `null` clears it (members who joined that way stay).
- The phone checks the shape (a domain, no `@`, no scheme, lower-cased); the server checks it is **the business's website domain** (S12): 400 `E_BUSINESS_03` (proposed) → "This must be your company's domain, {domain}". The field shows the business's domain as its hint.
- With it set, s74's *Work email* path works for that Ring: the join-by-email routes are FR-17's ❌ ([[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S4, S8]]).
- 403 `E_RING_05` → the field is read-only.

### [[Screen Index#s63|s63]] → [[Screen Index#s72|s72]] A business forms after setup (S13)

- The setup itself is [[FR-24 Exhibitor Frontend Requirements|FR-24]]; its last call must create the business **and** its first `CORPORATE` Ring in one step (P2), and answer both ids.
- After it: refetch `GET /businesses/mine` (the new one, `OWNER`) and `GET /rings` (the Ring on s16); the Ring-forming motion plays once (a fade with reduced motion).
- Team colleagues get an invitation (FR-17); until invitations exist, the team step is skipped.

### Account changes (S14)

- Businesses and memberships are keyed by id, never by Pin name.
- Signing out clears every Companies cache on the phone. Deleting the account: nothing extra for the app.

## Field map

| Shown | Source | Available |
|---|---|---|
| Companies list, count on Me | `GET /businesses/mine`, `meta.total` | ❌ |
| Logo | `logoFileId` → signed link (D-16) | ❌ initial until then |
| Badge, verified email, joined | `myBadge`, `verifiedEmail`, `joinedAt` | ❌ |
| People count on a row / a Ring | `peopleCount`, null when not allowed | ❌ |
| My title | the main profile's `role`, `company` (D-02, P10) | ❌ FR-07 |
| *Show company on my Public Ring* | the default Ring's projection | ❌ FR-10 |
| Waiting: invitations | `GET /rings/invitations/mine`, with `business` (`null` until the business ↔ Ring link) | ✅ |
| Waiting: my join requests | `GET /rings/join-requests/mine` | ✅ |
| Domain on s73 | `domain` | ❌ |
| The company's card | `GET /views/ring/:cardRingId`, readable by every company member (P9) | 🟡 the view ✅, the access rule ❌ |
| Its Rings for me, named or not, in order | `rings[]` | ❌ |
| A Ring's card | `GET /views/ring/:ringId` | ✅ |
| Colleagues and "already in your Rings" | `colleagues` | ❌ |
| Admin rights | `adminRights` | ❌ |
| The roster (owner / admin) | `GET /rings/:ringId/members` | ✅ (names ❌, FR-09) |
| Required work email domain | `requiredEmailDomain` on the Ring | ❌ |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| **The business ↔ Ring link** (every company Ring carries its business) | — (server side) | ❌ | P2 |
| **How a membership was made** (invitation, code, work email, owner add, connection accept, owner move) | server side: `RingMember.origin` (`PLACED` for an owner add, a connection accept and an owner move; `INVITATION`, `JOIN_CODE`, `JOIN_REQUEST`); work email is not in this version (D-33) | ✅ | P1, P7, D-18 · shared with [[FR-09 Ring Members Frontend Requirements\|FR-09]], [[FR-17 Ring Invitations & Join Frontend Requirements\|FR-17]] |
| My companies, paged, with `meta.total` | `GET /businesses/mine` | ❌ | [[S-29 Companies Story\|S1, S2]] · P1, P11 |
| Company detail, with its Rings for me, admin rights, colleagues | `GET /businesses/:id` | ❌ | S5–S8, S11 · P6, P7 |
| The company's card, readable by every member | `GET /views/ring/:cardRingId` with a company-member rule in the access engine | 🟡 | S5 · P1, P9 · [[S-15 Ring Access Engine Story]] |
| A Ring's card | `GET /views/ring/:ringId` | ✅ | S6 |
| Invitations to me, by company | `GET /rings/invitations/mine`, with `business` (`null` until the business ↔ Ring link) | ✅ | S3 · [[FR-17 Ring Invitations & Join Frontend Requirements\|FR-17]] |
| My join requests, cancel, dismiss | `GET /rings/join-requests/mine`, `DELETE /rings/join-requests/:id` | ✅ | S3 · [[FR-17 Ring Invitations & Join Frontend Requirements\|FR-17]] |
| Leave, one transaction | `POST /businesses/:id/leave` | ❌ | S9 · P5 |
| My title (role, company) | `GET` / `PATCH /profiles/:id` | ❌ | S4, S8 · D-02, P10 · [[FR-07 Profiles & Pin Name Frontend Requirements\|FR-07]] |
| *Company & role* on the default Ring | `PATCH /rings/:ringId/projection` | ❌ | S4 · [[FR-10 Ring Projection Frontend Requirements\|FR-10]] |
| The roster for owner and admin | `GET /rings/:ringId/members` | ✅ | S7 |
| Names on the roster; the member-facing list | — | ❌ | S7 · [[FR-09 Ring Members Frontend Requirements\|FR-09]] |
| Admin levels | — | ❌ | S8 · [[FR-16 Delegated Admins Frontend Requirements\|FR-16]] |
| "Members can see each other" | the launch settings | ❌ | S7 · [[FR-11 Rings Frontend Requirements\|FR-11]] |
| Required work email domain, read and save | `requiredEmailDomain` on `GET` / `PATCH /rings/:id` | ❌ | S12 · D-04 |
| Join by verified work email | — | ❌ | S12 · [[FR-17 Ring Invitations & Join Frontend Requirements\|FR-17]] |
| Setup creates the business and its Ring together | FR-24's setup route | ❌ | S13 · P2 · [[FR-24 Exhibitor Frontend Requirements\|FR-24]] |
| Logos | signed links | ❌ | D-16 |

## Behaviour expectations

- **Refetch, no realtime:** s72 on open, on pull, after leave, after returning from s74 or s73; s73 on open and after every write; Me's count on open. No polling.
- **Caching keys:** businesses by viewer; a business by (viewer, id); waiting items by viewer; Ring cards by (viewer, ringId) as in [[BI-09 View As & Pin Views Backend Integration]]. **On leave:** drop the businesses, that business, Shared with me and its Ring cards. **On sign-out:** drop everything.
- **Paging:** `{ data, meta: { total } }`, `limit` ≤ 50; companies A→Z; a company's Rings in the server's order (never re-sorted on the phone).
- **Optimistic:** *Cancel* a join request only. Never leave, never the domain setting.
- **Offline:** nothing queued; each write says it couldn't be sent and leaves the screen as it was.
- **Privacy:** never call a roster or a members-facing list to learn a count or a role; a `null` from the server means hide. Never show a Ring's colour, type or hierarchy to a member; never infer a company from `GET /rings/shared-with-me`.
- **One message for every way out:** removed, ended, blocked, deleted: "You're no longer part of this company", or the company simply isn't listed.

## Error states the UI must handle

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] puts `ErrorCode` on the wire, the app branches on status and endpoint ([[Frontend Contract]]). The **proposed** codes are names for the backend to keep or rename; the meaning is what's asked.

| Status | ErrorCode | Where | Show |
|---|---|---|---|
| 404 | `E_BUSINESS_01` (proposed) not part of it, or no such company | detail, leave | "You're no longer part of this company", back to s72; on leave, treated as left |
| 409 | `E_BUSINESS_02` (proposed) the owner can't leave | leave | "The owner can't leave their company" |
| 400 | `E_BUSINESS_03` (proposed) not the company's domain | the domain setting | "This must be your company's domain, {domain}" |
| 409 | `E_JOIN_REQUEST_02` (proposed) no longer pending | cancel a join request | refetch, no error |
| 404 | `E_JOIN_REQUEST_01` (proposed) no such request, or not mine | cancel, dismiss | refetch, no error |
| 404 | `E_RING_ACCESS_02` | a Ring's card | "This Ring has ended"; s73 refetches |
| 404 | `E_RING_ACCESS_01` | a Ring's card, the company's card | the same neutral message; s73 refetches |
| 404 | `E_RING_02` | the domain setting | back to My Rings |
| 403 | `E_RING_05` | the roster, the domain setting | hide the roster; the setting read-only |
| 400 | validation (`message` an array) | the domain setting | inline on the field |
| 401 | `E_AUTH_04` | all | sign in again |
| — | offline, 5xx | all writes | "Couldn't … Try again."; nothing queued |

## Blocked by

The story is approved and its decisions P1–P11 are in it, so this list isn't blocked by it. Rows wait on:

- [[FR-07 Profiles & Pin Name Frontend Requirements|FR-07]] / [[S-14 Profiles & Pin Name Story|S-14]]: the main profile's **role** field next to company, decided by S-29 P10, for *Shown as* and *Title* (S4, S8). Until it is built, the app shows the company only.
- [[S-15 Ring Access Engine Story|S-15]]: the company-member read of the company's card Ring (P9), for the header tap (S5).
- [[FR-10 Ring Projection Frontend Requirements|FR-10]]: *company & role* on a Ring's projection, for the Public Ring switch (S4).
- [[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]]: invitations, join requests, join by code and by work email (S3, S12). FR-17 is a draft that predates D-18 and this story: flagged to add `business` on its rows, my join requests and their cancel.
- [[FR-16 Delegated Admins Frontend Requirements|FR-16]]: admin levels, for *Admin rights* and for who may set the domain (S8, S12).
- [[FR-09 Ring Members Frontend Requirements|FR-09]]: names on the roster and the member-facing list (S7).
- [[FR-11 Rings Frontend Requirements|FR-11]]: "members can see each other" (S7).
- [[FR-24 Exhibitor Frontend Requirements|FR-24]]: the setup creating the business and its Ring together (S13, P2).
- D-16: logos.
- [[S-87 Error Contract Story|Error Contract · S4–S8]]: the codes above are by status until then.

## Sign-off

- Approved by: — · on: —

## Log

- 2026-11-05 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: FR-15 (Companies) asks FR-17 for: business { id, name, logoFileId } on each pending invitation to a company Ring, my join requests GET /rings/join-requests/mine (id, status PENDING | DECLINED, createdAt, business, ringName), cancel and dismiss DELETE /rings/join-requests/:id, and valid: false on an invitation whose Ring ended. Add these rows (S-29 S3).
- 2026-11-05 · flagged [[FR-07 Profiles & Pin Name Frontend Requirements]]: FR-15 (Companies) needs the main profile's role field next to company (S-29 P10): read on GET /profiles, edited with PATCH /profiles/:id { role, company }, for the work identity on s72 and the title on s73. Add the row (S-29 S4, S8).
- 2026-11-08 · `tickets/backend/M-03-shared-rings/F-15-companies/FR-15-f17-rows` · backend `main` `1c460b0` (F-17, [[BI-17 Ring Invitations & Join Backend Integration]]) delivers four rows → ✅: invitations to me with `business`, my join requests with cancel / dismiss, and how a membership was made (`RingMember.origin`). On the wire: cancel answers 200 with no body (not 204), an already-answered request 404 `E_RING_JOIN_REQUEST_01` (not the proposed `E_JOIN_REQUEST_02`), `business` is `null` until the business ↔ Ring link exists, and an invitation carries no "who it's for" label ([[D-36 Who it's for stays the owner's alone|D-36]]). The list stays `ready` for its own backend review
