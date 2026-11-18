---
id: FR-15
type: frontend-requirements
module: shared-rings
feature: companies
status: draft
scope: feature
screens: [s14, s15, s26, s38, s63, s68, s72, s73, s74]
blockedBy: []
depends: ["S-29 Companies Story"]
affects: ["BD-15 Companies Backend Delivery"]
related: ["S-29 Companies Story", "D-02 One main profile every Ring starts from", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-16 Files load from signed links that expire in 15 minutes", "D-18 Ring names shown when joined knowingly", "D-33 Work email joining waits for real emails and Companies", "D-34 A member shows one of their own Rings", "D-35 A join code can be shown as a QR", "D-36 Who it's for stays the owner's alone", "D-39 The company domain and the title switch show in the MVP", "S-15 Ring Access Engine Story", "BI-04 Profiles & Pin Name Backend Integration", "BI-06 Ring Members Backend Integration", "BI-07 Ring Projection Backend Integration", "BI-08 Rings Backend Integration", "BI-09 View As & Pin Views Backend Integration", "BI-17 Ring Invitations & Join Backend Integration", "FR-07 Profiles & Pin Name Frontend Requirements", "FR-09 Ring Members Frontend Requirements", "FR-10 Ring Projection Frontend Requirements", "FR-11 Rings Frontend Requirements", "FR-16 Delegated Admins Frontend Requirements", "FR-17 Ring Invitations & Join Frontend Requirements", "FR-24 Exhibitor Frontend Requirements", "S-87 Error Contract Story", "Frontend Contract", "GET /rings", "GET /rings/shared-with-me", "PATCH /rings/:id", "GET /views/ring/:ringId", "GET /rings/:ringId/members", "GET /rings/:ringId/colleagues", "PATCH /rings/:ringId/projection", "GET /profiles", "PATCH /profiles/:id", "E_RING_02", "E_RING_05"]
pending: []
created: 2026-10-18
updated: 2026-11-18
tags: [frontend-requirements, frontend-requirements/draft, module/shared-rings, layer/frontend]
---

# Companies · Frontend Requirements

**Feature:** [[F-15 Companies]] · **Status:** Draft, 2026-11-18 (the backend's 2026-11-16 review settled, decided by Omar Fostok; waiting on his word for `ready`) · **Story:** [[S-29 Companies Story]] (approved 2026-11-05) · **Backend Integration:** not yet (no business routes: [[BD-15 Companies Backend Delivery]])

What the client needs from the backend to build every part of [[S-29 Companies Story]], S1 to S14, and whether each need is met today. **Rewritten 2026-11-05** against the approved story and its decisions P1–P11 ([[S-29 Companies Story#Decided in this story|Decided in this story]]). **Brought back to `draft` 2026-11-15** to match the story as of that day: P12 (a team member in no Ring is listed), D-39 (the title switch and "Verified · {domain}" are shown), D-33 (no verified work email, S12 not in this version), D-36 (no "who it's for" for a member), the owner's line in place of *Leave*, "YOUR COLLEAGUES · {n}", the domain from the business's website (P6), and a new `ownsBusiness` need for *Create a business account*. Rows the backend has built since are marked ✅.

**What exists today.** `CORPORATE` Rings with `parentRingId` (`POST /rings`), the Rings shared with me (`GET /rings/shared-with-me`), a Ring's card (`GET /views/ring/:ringId`), the owner's or admin's roster with names (`GET /rings/:ringId/members`), the member-facing list (`GET /rings/:ringId/colleagues`), my invitations and join requests ([[BI-17 Ring Invitations & Join Backend Integration|BI-17]]), the main profile's `role` and `company` ([[BI-04 Profiles & Pin Name Backend Integration|BI-04]]) and a Ring's `showRole` / `showCompany` switches ([[BI-07 Ring Projection Backend Integration|BI-07]]). Everything about a **business**: no route; the `Business` tables exist and no Ring points at a business. In the app, s72, s73 and s74 are **sample screens** (Acme Studio, Northstar, Loop, Alma Group) and send nothing.

**Four rules that shape every row below:**

1. **A company is only the ones I chose** (P1). Joined by invitation, code or a join QR, or accepted the owner's team invitation; a team member is listed even while in none of its Rings (P12). A Ring the owner placed me in never makes a company appear on my s72, and the backend decides this, not the app. No work email way in this version ([[D-33 Work email joining waits for real emails and Companies|D-33]]).
2. **A Ring's name only when I joined it knowingly** (D-18, P7). The server sends `name: null` for a Ring I was placed in or moved into; the app shows "{Company} card". **No colour, no type, no `parentRingId`, no "who it's for"** ([[D-36 Who it's for stays the owner's alone|D-36]]) ever reaches a member: the server sends the Rings already in order.
3. **A count only where I may see the people** (D-04, S7). Owner, admin at member level, or "members can see each other" on. Otherwise the server sends `null` and the app shows nothing: never 0, never a sample. The app never calls a roster to find out.
4. **The business is the server's to resolve** (P2). The app never groups Rings into companies itself (`GET /rings/shared-with-me` carries no business and shouldn't be used for this).

## Per screen

### Entry points: Discover [[Screen Index#s38|s38]] and Me [[Screen Index#s68|s68]] (S1)

- **Companies** tile on s38 and **Companies** row on Me → s72.
- Me's row: "Companies · 2" from `meta.total` of `GET /businesses/mine?limit=1` ❌; no number at 0.
- *Create a business account* on Me when I **own no business and am in no company** (S1): needs **`ownsBusiness`** (boolean) in the `meta` of `GET /businesses/mine` ❌. Me asks for one row (`limit=1`), and one row can't tell whether I own one of the others, so the app can't work it out from `myBadge`. → the setup ([[FR-24 Exhibitor Frontend Requirements|FR-24]]).
- Refetched when Me opens; no polling.

### [[Screen Index#s72|s72]] My companies (S2)

- **List:** `GET /businesses/mine?limit=&skip=` ❌ → `{ data: BusinessSummaryEntity[], meta: { total, ownsBusiness } }`, by name, `limit` ≤ 50.
- **`BusinessSummaryEntity`** needs:

  | Shown | Field | Notes |
  |---|---|---|
  | Logo | `logoFileId` | initial until files load (D-16) |
  | Name | `name` | |
  | Badge | `myBadge`: `OWNER` / `ADMIN` / `MEMBER` | *Owner*, *Admin*, nothing |
  | People | `peopleCount` | **null** unless rule 3 allows; each person once, me not counted, blocked pairs not counted |
  | Joined | `joinedAt` | used on s73; for a team member with no Ring, when they accepted the team invitation; **for the owner, when the business was created** |

  No verified email on a row in this version (D-33).
- **My title on a row** comes from my profile (P4, P10), not from the company: the row shows my *role* only on the company whose name matches my profile's *company*; the others show no title (P11). One field, never per company (S4).
- Listed **while I have at least one live membership in its Rings, or I'm on its team** (S2, S10, P12): the server filters, the app shows what it gets.
- *+ Join a company Ring*, "Invitation, code or a join QR" (D-33, [[D-35 A join code can be shown as a QR|D-35]]) → s74 with nothing picked ([[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]]). No work email, and nothing names it as coming soon.
- Empty: "You're not part of a company yet", with *Join a company Ring*.
- Footnote: "Leaving a company removes its shared Rings. Connections you made stay yours."
- Refetch on open, on pull, after leave, and when coming back from s74.
- States: loading, list, waiting section (S3), empty, offline ("You're offline").

### [[Screen Index#s72|s72]] Waiting: invitations and my join requests (S3)

- Above the list, hidden when both are empty. The invitations and join requests are [[S-33 Ring Invitations & Join Story]]'s ([[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]]); s72 needs them **by company**:
  - **Invitations to me** for a company Ring: `GET /rings/invitations/mine` ✅ (backend `main` `1c460b0`, [[BI-17 Ring Invitations & Join Backend Integration|BI-17]]), each row with `business { id, name, logoFileId }` (`null` until a company Ring is linked to its business, the business ↔ Ring row below), the inviter and the Ring's name (an invitation names its Ring, D-18). **Never what the Ring is for**: no "who it's for" label ([[D-36 Who it's for stays the owner's alone|D-36]]). *Review* → s74 for it.
  - **My join requests** to a company Ring: `GET /rings/join-requests/mine` ✅ → `{ id, status: PENDING | DECLINED, createdAt, business { id, name, logoFileId } | null, ringName }`.
- *Cancel* a pending request: `DELETE /rings/join-requests/:id` ✅ → 200, no body; the same call dismisses a declined one. The row leaves at once (optimistic) and comes back with "Couldn't cancel" on failure. Already answered (approved, cancelled, dismissed): 404 `E_RING_JOIN_REQUEST_01` → refetch, no error.
- **Approved:** the request is not returned any more, and the company is in `GET /businesses/mine` on the next refetch.
- **Declined:** "Not approved" with *Dismiss*, never why. *Dismiss*: `DELETE /rings/join-requests/:id` (the same call removes it from my list).
- **An invitation to a Ring that ended or was deleted:** the row carries `valid: false` → "This invitation is no longer valid", *Dismiss* only (FR-17's dismiss).
- Copy: "Loop · Requested 2 days ago · waiting on their admin"; "Alma Group invited you · From {inviter} · {Ring name}".

### [[Screen Index#s72|s72]] My work identity (S4)

- **Shown as** "Design lead, Acme Studio": my main profile's **role** and **company** (D-02, P10) from `GET /profiles` ✅ ([[BI-04 Profiles & Pin Name Backend Integration|BI-04]]). Tap → edit them, `PATCH /profiles/:id { role, company }` ✅ (`null` clears one).
- No *Verified email* line in this version (D-33).
- **Show company on my Public Ring:** the *company & role* switches (`showCompany`, `showRole`) on my **default Ring's** projection, `PATCH /rings/:ringId/projection` ✅ ([[BI-07 Ring Projection Backend Integration|BI-07]]). The same value s24 shows: the app reads it from the projection, never keeps its own. Saved at once; on failure the switch goes back with "Couldn't save".
- *Let {company} update my title*, "Admins keep your role current when it changes": **shown** in the MVP (P4, [[D-39 The company domain and the title switch show in the MVP|D-39]]), on by default and kept on screen only: nothing is sent and nothing is saved. **No backend need in this version**; whether the choice should be saved now is the story's open question.

### [[Screen Index#s73|s73]] Company detail (S5, S6, S7, S8, S11)

- **One call:** `GET /businesses/:id` ❌ →
  ```
  { id, name, logoFileId, domain,            // the business's website domain, "acme.co", or null (P6)
    cardRingId,                               // the company's public card, for the header tap (P9)
    myBadge, joinedAt,                        // joinedAt: for the owner, when the business was created
    rings: [{ ringId, name, myExpiresAt, peopleCount,
              myAdminLevel }],                // in order, top first (S6); [] for a team member in no Ring (P12)
                                              // myAdminLevel: my admin level on that Ring, null for a plain member
    adminRights: { level, ringName } | null,  // the highest, S8
    colleagues: { count, alreadyInMyRings } | null }              // null unless rule 3 allows (S7)
  ```
- **Header** (S5): logo, name, **"Verified · acme.co"** from `domain` (P6, D-39: the domain is the business's website, set in the setup, [[FR-24 Exhibitor Frontend Requirements|FR-24]]; hidden when null), my title (as on s72, P11), "joined 12 Feb 2026" from `joinedAt` (for the owner, the day the business was created), the badge.
  - Tap → the company's public card: `GET /views/ring/:cardRingId`. **Every member of the company may read it**, even when they're only in a lower Ring, or in none as a team member ([[S-29 Companies Story#Decided in this story|S-29 P9, P12]]): today the views answer only members of that Ring. ❌ Asked: the access engine answers the company's card Ring for every company member (P1), through the same view; reading it gives no membership, no roster and no other Ring.
  - s73 never repeats the company's address, contacts or files (S5): they're on that card.
- **RINGS IT SHARES WITH YOU** (S6): `rings`, in the server's order; for the owner, every Ring of the company (S11). **Hidden when `rings` is empty** (a team member in no Ring, P12).
  - `name` set → the name ("Acme Team"); `name: null` → "{Company} card" (D-18, P7).
  - Under it: `peopleCount` ("22 people") when not null, "until 12 Nov" from `myExpiresAt` when set. Never what the Ring is for (D-36).
  - A row → `GET /views/ring/:ringId` ✅ (s14). An ended Ring: 404 `E_RING_ACCESS_02` → "This Ring has ended", s73 refetches.
  - "Company · Your own Ring": **not shown** (P3).
- **YOUR COLLEAGUES · {n}** (S7): from `colleagues`; the section reads "YOUR COLLEAGUES · 22" with `count`; hidden when null.
  - "14 already in one of your Rings" (`alreadyInMyRings`, hidden at 0; a number only).
  - Tap → the people of that company I may see, chosen per Ring from `rings[]` alone:
    - **the roster** when `myBadge` is `OWNER` or that Ring's `myAdminLevel` is the member level (`MEMBER_MANAGER`, [[FR-16 Delegated Admins Frontend Requirements|FR-16]]): `GET /rings/:ringId/members` ✅ on s15, with names and `?name=` ([[BI-06 Ring Members Backend Integration|BI-06]]);
    - **the colleagues list** when `myAdminLevel` is `null` (a plain member) or a level without the roster, and `peopleCount` is not null ("members can see each other" is on): `GET /rings/:ringId/colleagues` ✅, each colleague as the card of the Ring they picked ([[D-34 A member shows one of their own Rings|D-34]]);
    - nothing for a Ring whose `peopleCount` is `null`.
  - One such Ring → straight to its list; several → pick the Ring first. The app never tries a roster and reads a 403.
- **MY ROLE HERE** (S8): *Title* (as in S4, P10; tap edits it); *Admin rights* from `adminRights`: the level in words ("Can edit what the Ring shows" / "Can manage who's in it", [[FR-16 Delegated Admins Frontend Requirements|FR-16]]'s levels) and the Ring's name when not null ("Can manage who's in Acme Team"). No rights line for a member; no *Verified email* line in this version (D-33).
- **Leave company** (S9): hidden when `myBadge` is `OWNER`; in its place, "You own {company}. Hand it over before you leave." (P5, S11), no action.
- **Errors on load:** 404 `E_BUSINESS_01` (proposed; not part of it any more, or no such company) → "You're no longer part of this company", back to s72, s72 refetches.
- States: loading; header with or without "Verified · {domain}"; Rings named and unnamed, or none (P12); YOUR COLLEAGUES shown or hidden; MY ROLE with or without admin rights; the owner's line; leaving; "no longer part of this company"; offline.

### [[Screen Index#s73|s73]] → [[Screen Index#s72|s72]] Leave (S9)

- Confirmation, from the detail: "Leave {company}?" and
  - with `adminRights`: "You leave its {n} Rings and lose your admin rights there. The connections you made stay yours.";
  - without: "You leave its {n} Rings. The connections you made stay yours."
  - `n` = `rings.length`, "its Ring" for one;
  - **in none of its Rings** (`rings: []`, a team member, P12): "Leave {company}? You'll no longer be on its team."
- `POST /businesses/:id/leave` ❌ → **201**, as `POST /rings/:ringId/leave` answers. **One transaction** on the server (P5): every membership of mine in its Rings, my admin rights on them, my pending join requests to it, and my place in the company and on its team. All or nothing. My connections and my own Rings: untouched.
- **No optimistic leave:** *Leaving…* until the answer; then back to s72, the row collapses out (a fade with reduced motion), and the app drops: the businesses list, that company, Shared with me, and the views of its Rings.
- **The owner:** never sent (hidden); if it is, 409 `E_BUSINESS_02` (proposed) → "The owner can't leave their company", nothing changes.
- **Already gone** (removed a moment ago): 404 `E_BUSINESS_01` → treated as left.
- Offline or 5xx: "Couldn't leave. Try again." Nothing changes; nothing queued.

### When a company leaves my list without me (S10)

- Removed by an admin, its Rings ended or deleted, a block with the owner, the business deleted: **no call and no notification**. The server stops returning the company; the next refetch of s72 drops it, and an open s73 gets `E_BUSINESS_01` (above). Nothing tells the reasons apart.
- **Still on its team** (P12): losing the last Ring keeps the company on my list; s73 then shows no Rings.
- A block with a colleague (not the owner): only `colleagues` changes (the server stops counting them).

### [[Screen Index#s26|s26]] A company Ring's settings: the work email domain (S12) · not in this version

- **Not in this version** ([[D-33 Work email joining waits for real emails and Companies|D-33]]): the app shows no *Required work email domain* setting and no *Work email* way in on s74, and nothing names them as coming soon. **No backend need now.** The domain on s73 is the business's website (P6), not this setting.
- Kept for when it comes back: read `requiredEmailDomain` on `GET /rings/:id`, save `PATCH /rings/:id { requiredEmailDomain: "acme.co" | null }`, the server checking it is the business's website domain (400 `E_BUSINESS_03`, proposed), owner and admins only (403 `E_RING_05` → read-only), and FR-17's join-by-email routes.

### [[Screen Index#s63|s63]] → [[Screen Index#s72|s72]] A business forms after setup (S13)

- The setup itself is [[FR-24 Exhibitor Frontend Requirements|FR-24]]; its last call must create the business **and** its first `CORPORATE` Ring in one step (P2), and answer both ids. The business's **website** set there is the domain s73 shows (P6).
- After it: refetch `GET /businesses/mine` (the new one, `OWNER`, and `ownsBusiness: true`) and `GET /rings` (the Ring on s16); the Ring-forming motion plays once (a fade with reduced motion).
- Team colleagues get an invitation ([[S-59 Exhibitor Story|Exhibitor · S2]]); one who accepts is part of the company and listed on their s72 **before any Ring** (P12): `GET /businesses/mine` returns it with `rings: []` on the detail. Until the team invitation exists, the team step is skipped.

### Account changes (S14)

- Businesses and memberships are keyed by id, never by Pin name.
- Signing out clears every Companies cache on the phone. Deleting the account: nothing extra for the app.

## Field map

| Shown | Source | Available |
|---|---|---|
| Companies list, count on Me | `GET /businesses/mine`, `meta.total` | ❌ |
| *Create a business account* on Me | `meta.ownsBusiness` on `GET /businesses/mine` | ❌ |
| Logo | `logoFileId` → signed link (D-16) | ❌ initial until then |
| Badge, joined | `myBadge`, `joinedAt` | ❌ |
| People count on a row / a Ring | `peopleCount`, null when not allowed | ❌ |
| My title | the main profile's `role`, `company` (D-02, P10) on `GET /profiles` | ✅ |
| *Show company on my Public Ring* | the default Ring's projection, `showCompany` / `showRole` | ✅ |
| *Let {company} update my title* | on screen only, on by default (D-39) | — no backend need |
| Waiting: invitations | `GET /rings/invitations/mine`, with `business` (`null` until the business ↔ Ring link) | ✅ |
| Waiting: my join requests | `GET /rings/join-requests/mine` | ✅ |
| "Verified · {domain}" on s73 | `domain`, the business's website (P6) | ❌ |
| The company's card | `GET /views/ring/:cardRingId`, readable by every company member (P9, P12) | 🟡 the view ✅, the access rule ❌ |
| Its Rings for me, named or not, in order | `rings[]` (`[]` for a team member in no Ring) | ❌ |
| Roster or colleagues list, per Ring | `rings[].myAdminLevel` (`null` for a plain member) with `rings[].peopleCount` | ❌ |
| A Ring's card | `GET /views/ring/:ringId` | ✅ |
| YOUR COLLEAGUES · {n}, "already in your Rings" | `colleagues` | ❌ |
| Admin rights | `adminRights` | ❌ |
| The roster (owner / admin) | `GET /rings/:ringId/members`, with names | ✅ |
| The member-facing list | `GET /rings/:ringId/colleagues` | ✅ |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| **The business ↔ Ring link** (every company Ring carries its business) | — (server side) | ❌ | P2 |
| **How a membership was made** (invitation, code, owner add, connection accept, owner move) | server side: `RingMember.origin` (`PLACED` for an owner add, a connection accept and an owner move; `INVITATION`, `JOIN_CODE`, `JOIN_REQUEST`); work email is not in this version (D-33) | ✅ | P1, P7, D-18 · shared with [[FR-09 Ring Members Frontend Requirements\|FR-09]], [[FR-17 Ring Invitations & Join Frontend Requirements\|FR-17]] |
| **Team members as company members** (accepted the owner's team invitation, in no Ring yet) | server side, read by the two routes below | ❌ | P1, P12 · [[S-59 Exhibitor Story\|Exhibitor · S2]] |
| My companies, paged, with `meta.total` and `meta.ownsBusiness`; team members with no Ring included | `GET /businesses/mine` | ❌ | [[S-29 Companies Story\|S1, S2]] · P1, P11, P12 |
| Company detail, with its Rings for me (each with `myAdminLevel`), admin rights, colleagues, the website domain, `joinedAt` (the owner's: when the business was created) | `GET /businesses/:id` | ❌ | S5–S8, S11 · P6, P7, P12 · S-29 backend item 4 |
| The company's card, readable by every member | `GET /views/ring/:cardRingId` with a company-member rule in the access engine | 🟡 | S5 · P1, P9, P12 · [[S-15 Ring Access Engine Story]] |
| A Ring's card | `GET /views/ring/:ringId` | ✅ | S6 |
| Invitations to me, by company | `GET /rings/invitations/mine`, with `business` (`null` until the business ↔ Ring link) | ✅ | S3 · [[FR-17 Ring Invitations & Join Frontend Requirements\|FR-17]] |
| My join requests, cancel, dismiss | `GET /rings/join-requests/mine`, `DELETE /rings/join-requests/:id` | ✅ | S3 · [[FR-17 Ring Invitations & Join Frontend Requirements\|FR-17]] |
| Leave, one transaction, the team place included; answers 201 | `POST /businesses/:id/leave` | ❌ | S9 · P5, P12 |
| My title (role, company) | `GET` / `PATCH /profiles/:id` | ✅ | S4, S8 · D-02, P10 · [[FR-07 Profiles & Pin Name Frontend Requirements\|FR-07]] |
| *Company & role* on the default Ring | `PATCH /rings/:ringId/projection` (`showCompany`, `showRole`) | ✅ | S4 · [[FR-10 Ring Projection Frontend Requirements\|FR-10]] |
| The roster for owner and admin, with names | `GET /rings/:ringId/members` | ✅ | S7 · [[FR-09 Ring Members Frontend Requirements\|FR-09]] |
| The member-facing list | `GET /rings/:ringId/colleagues` | ✅ | S7 · D-34 · [[FR-09 Ring Members Frontend Requirements\|FR-09]] |
| "Members can see each other" | `membersCanSeeEachOther` | ✅ | S7 · [[FR-11 Rings Frontend Requirements\|FR-11]] |
| Admin levels | — | ❌ | S8 · [[FR-16 Delegated Admins Frontend Requirements\|FR-16]] |
| Setup creates the business and its Ring together, with its website | FR-24's setup route | ❌ | S13 · P2, P6 · [[FR-24 Exhibitor Frontend Requirements\|FR-24]] |
| Logos | signed links on the business routes | ❌ | D-16 |
| Required work email domain; join by verified work email | — | not in this version | S12 · D-33 |

## Behaviour expectations

- **Refetch, no realtime:** s72 on open, on pull, after leave, after returning from s74 or s73; s73 on open and after every write; Me's count on open. No polling.
- **Caching keys:** businesses by viewer; a business by (viewer, id); waiting items by viewer; Ring cards by (viewer, ringId) as in [[BI-09 View As & Pin Views Backend Integration]]. **On leave:** drop the businesses, that business, Shared with me and its Ring cards. **On sign-out:** drop everything.
- **Paging:** `{ data, meta: { total, ownsBusiness } }`, `limit` ≤ 50; companies A→Z; a company's Rings in the server's order (never re-sorted on the phone).
- **Optimistic:** *Cancel* a join request only. Never leave.
- **On screen only:** *Let {company} update my title* (D-39); nothing sent.
- **Offline:** nothing queued; each write says it couldn't be sent and leaves the screen as it was.
- **Privacy:** never call a roster or a members-facing list to learn a count or a role; a `null` from the server means hide. Never show a Ring's colour, type, hierarchy or "who it's for" to a member; never infer a company from `GET /rings/shared-with-me`.
- **One message for every way out:** removed, ended, blocked, deleted: "You're no longer part of this company", or the company simply isn't listed.

## Error states the UI must handle

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] puts `ErrorCode` on the wire, the app branches on status and endpoint ([[Frontend Contract]]). The **proposed** codes are names for the backend to keep or rename; the meaning is what's asked.

| Status | ErrorCode | Where | Show |
|---|---|---|---|
| 404 | `E_BUSINESS_01` (proposed) not part of it, or no such company | detail, leave | "You're no longer part of this company", back to s72; on leave, treated as left |
| 409 | `E_BUSINESS_02` (proposed) the owner can't leave | leave | "The owner can't leave their company" |
| 404 | `E_RING_JOIN_REQUEST_01` already answered, no such request, or not mine | cancel, dismiss | refetch, no error |
| 404 | `E_RING_ACCESS_02` | a Ring's card | "This Ring has ended"; s73 refetches |
| 404 | `E_RING_ACCESS_01` | a Ring's card, the company's card | the same neutral message; s73 refetches |
| 403 | `E_RING_05` | the roster | hide the roster |
| 400 | validation (`message` an array) | editing the title | inline on the field |
| 401 | `E_AUTH_04` | all | sign in again |
| — | offline, 5xx | all writes | "Couldn't … Try again."; nothing queued |

`E_BUSINESS_03` (not the company's domain) waits with S12 (D-33).

## Blocked by

The story is approved and its decisions P1–P12 are in it, so this list isn't blocked by it. Built since 2026-11-05 and no longer waited on: the role field ([[FR-07 Profiles & Pin Name Frontend Requirements|FR-07]]), *company & role* on a projection ([[FR-10 Ring Projection Frontend Requirements|FR-10]]), names on the roster and the member-facing list ([[FR-09 Ring Members Frontend Requirements|FR-09]]), "members can see each other" ([[FR-11 Rings Frontend Requirements|FR-11]]), invitations and join requests ([[FR-17 Ring Invitations & Join Frontend Requirements|FR-17]]). Rows wait on:

- [[BD-15 Companies Backend Delivery|BD-15]]: every business route (`GET /businesses/mine`, `GET /businesses/:id`, `POST /businesses/:id/leave`), the business ↔ Ring link (P2) and team members as company members (P12).
- [[S-15 Ring Access Engine Story|S-15]]: the company-member read of the company's card Ring (P9), for the header tap (S5).
- [[FR-16 Delegated Admins Frontend Requirements|FR-16]]: admin levels, for *Admin rights* (S8).
- [[FR-24 Exhibitor Frontend Requirements|FR-24]]: the setup creating the business and its Ring together with its website (S13, P2, P6), and the team invitation (P12, [[S-59 Exhibitor Story|Exhibitor · S2]]).
- D-16: logos, on the business routes.
- [[S-87 Error Contract Story|Error Contract · S4–S8]]: the codes above are by status until then.

## Sign-off

- Approved by: — · on: —

## Log

- 2026-11-05 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: FR-15 (Companies) asks FR-17 for: business { id, name, logoFileId } on each pending invitation to a company Ring, my join requests GET /rings/join-requests/mine (id, status PENDING | DECLINED, createdAt, business, ringName), cancel and dismiss DELETE /rings/join-requests/:id, and valid: false on an invitation whose Ring ended. Add these rows (S-29 S3).
- 2026-11-05 · flagged [[FR-07 Profiles & Pin Name Frontend Requirements]]: FR-15 (Companies) needs the main profile's role field next to company (S-29 P10): read on GET /profiles, edited with PATCH /profiles/:id { role, company }, for the work identity on s72 and the title on s73. Add the row (S-29 S4, S8).
- 2026-11-08 · `tickets/backend/M-03-shared-rings/F-15-companies/FR-15-f17-rows` · backend `main` `1c460b0` (F-17, [[BI-17 Ring Invitations & Join Backend Integration]]) delivers four rows → ✅: invitations to me with `business`, my join requests with cancel / dismiss, and how a membership was made (`RingMember.origin`). On the wire: cancel answers 200 with no body (not 204), an already-answered request 404 `E_RING_JOIN_REQUEST_01` (not the proposed `E_JOIN_REQUEST_02`), `business` is `null` until the business ↔ Ring link exists, and an invitation carries no "who it's for" label ([[D-36 Who it's for stays the owner's alone|D-36]]). The list stays `ready` for its own backend review
- 2026-11-15 · `tickets/frontend/M-03-shared-rings/F-15-companies/FR-15-s-29-2026-11-15` · back to `draft` to match S-29 as of 2026-11-15: title switch and "Verified · {domain}" shown, the switch on screen only (D-39); the owner's "You own {company}. Hand it over before you leave."; "YOUR COLLEAGUES · {n}"; the member's Leave copy without the admin clause; no "who it's for" (D-36) and no `verifiedEmail` (D-33); S12 not in this version (D-33); the domain from the business's website (P6); new `meta.ownsBusiness` for *Create a business account*; team members with no Ring listed, with `rings: []` (P12); role, projection switches, roster names, colleagues list and `membersCanSeeEachOther` now ✅; the two proposed join-request codes replaced by the shipped `E_RING_JOIN_REQUEST_01`; Blocked by refreshed. Cleared the S-29 (2026-11-12, 2026-11-15) and D-39 flags. Set `ready` on Omar Fostok's word; flagged [[BD-15 Companies Backend Delivery]]
- 2026-11-16 · `tickets/backend/M-03-shared-rings/F-15-companies/FR-15-sent-back` · backend review of the `ready` list against S-29 (S1–S14, P1–P12) and backend `main` `3cef5d7`: `ready` → `draft`. Missing, for `/frontend` (the line under the title): my admin level per Ring on `rings[]` of `GET /businesses/:id` (S-29 backend item 4), so s73 can choose the roster or the colleagues list without probing; `POST /businesses/:id/leave` answers 201, not 204; the leave copy when `n` is 0 (a team member in no Ring, P12); `joinedAt` for the owner. Everything else held, and every ✅ row exists on `main` as described. No row changed; [[BD-15 Companies Backend Delivery]] stays blocked until the list is `approved`
- 2026-11-18 · `tickets/frontend/M-03-shared-rings/F-15-companies/FR-15-backend-review` · the backend's four points settled, decided by Omar Fostok:
  - (1) `rings[]` on `GET /businesses/:id` carries `myAdminLevel` per Ring, `null` for a plain member. s73 picks the roster (owner, or the member level) or the colleagues list (`peopleCount` not null) from it, never by probing; a new field-map row.
  - (2) `POST /businesses/:id/leave` answers 201.
  - (3) The leave confirmation in none of its Rings (P12): "Leave {company}? You'll no longer be on its team."
  - (4) The owner's `joinedAt` is when the business was created.

  Cleared the sent-back line. Kept `draft`
