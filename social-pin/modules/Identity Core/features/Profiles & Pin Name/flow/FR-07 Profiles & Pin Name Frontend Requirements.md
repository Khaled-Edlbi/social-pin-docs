---
type: frontend-requirements
code: profiles
scope: feature
feature: profiles
module: identity
status: ready
screens: [s05b, s06, s23, s44, s68]
depends: ["S-14 Profiles & Pin Name Story"]
affects: ["BD-07 Profiles & Pin Name Backend Delivery"]
related: ["D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "D-06 Yearly rename, old name freed, case-insensitive", "ND-16 Viewer access to file bytes", "ND-22 Public web page by Pin name", "FR-01 Account Frontend Requirements", "FR-10 Ring Projection Frontend Requirements", "FR-12 View As & Pin Views Frontend Requirements", "S-08 Onboarding Imports Story", "S-89 Gemma AI Story", "S-87 Error Contract Story", "F-02 Auth & Sign-up", "F-04 Files Upload", "F-05 Onboarding Imports", "F-18 Badge & QR", "GET /profiles/pin-name/:pinName/availability", "GET /profiles", "GET /profiles/:id", "PATCH /profiles/:id", "POST /profiles", "POST /profiles/:id/default", "DELETE /profiles/:id", "POST /auth/complete-registration", "POST /files", E_PROFILE_01, E_PROFILE_02]
created: 2026-10-18
updated: 2026-10-29
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/ready, module/identity, layer/frontend]
---

# Profiles & Pin Name · Frontend Requirements

**Feature:** [[F-07 Profiles & Pin Name]] · **Status:** 📨 Ready 2026-10-29, waiting on the backend's review · **Story:** [[S-14 Profiles & Pin Name Story]] · **Backend Integration:** [[BI-04 Profiles & Pin Name Backend Integration]]

What the client needs from the backend for *Profile basics* and the Pin-name claim during sign-up, and for the profile editor opened from the Me header, and whether each need is met today. The main profile of [[D-02 One main profile every Ring starts from]] (headline, role, company, location, photo, bio) is asked of the backend in [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]; the Pin-name rules are [[D-06 Yearly rename, old name freed, case-insensitive]]. Shapes, field limits and the enum values are in [[BI-04 Profiles & Pin Name Backend Integration]]. One profile per person in v1: the client uses the default profile (`data[0]`) only.

## Per screen

### [[Screen Index#s05b|s05b]] Profile basics (sign-up; built in the app, not in the prototype) (S9)

- Where it sits: reached from "Fill it in myself" on s03; from Edit and each "Add" on s05 (Continue returns to s05, so the import is still confirmed); from Skip on the portfolio step; after a failed import. Continue → s06. The account doesn't exist yet.
- Fields: **full name** (required, ≤ 120); photo (camera or library), headline, company, location (optional).
- Needs: the full name goes into `POST /auth/complete-registration` (`fullName`) ✅. The other four are written to the new main profile **right after registration**, with `PATCH /profiles/:id` (the photo as a `POST /files` id): ❌ until [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]].
- States: name missing (error under the field), photo picked / removed, optional fields empty.
- Source today: the name is saved; photo, headline, company and location are kept in memory for the session and lost.

### [[Screen Index#s06|s06]] Claim your Pin (S1, S2, S13)

- Needs: live availability for a handle; the rule for a valid handle; completion of registration with the handle.
- Rule: **3–30** characters, letters, digits, `.` and `_`; the counter reads /30 (the prototype's "/24" is out of date).
- Available: "Available — socialpin.me/<handle>", **as text, not a link**, until [[ND-22 Public web page by Pin name]] is decided and the page exists.
- Suggestions: chips built **on the client** from the person's own name, as D-06 decided (never from anyone else's). No endpoint. The **"Gemma: suggest"** chip is hidden until [[S-89 Gemma AI Story|Gemma AI · S6]] is built.
- The "Your code is ready" card is [[F-18 Badge & QR]]'s.
- Actions: type, pick a chip, Continue.
- States: typing, checking, available, taken, invalid format, taken-at-submit (409, the full name from s05b kept), suggestions.
- Source today: `GET /profiles/pin-name/:pinName/availability` (public, no token), `POST /auth/complete-registration`.

### Profile editor (opened from the **Me header**, [[Screen Index#s68|s68]]; not drawn, needs a screen id) (S3, S10, S12)

- Opened by tapping the header card on Me (the header itself is [[FR-01 Account Frontend Requirements|Account's]]).
- Fields:
  - **Full name** (≤ 120), the same in every Ring.
  - **"What friends call you"**: the nickname, optional (≤ 60); clearing it sends `null` (see Endpoints). Rings show it unless a Ring sets its own ([[FR-10 Ring Projection Frontend Requirements|FR-10]], [[FR-12 View As & Pin Views Frontend Requirements|FR-12]]).
  - **Pin name** (`!` decoration), with the **next allowed rename date** when it's in the future; the same live check and chips as s06.
  - **Work details**: headline, role, company, location, photo, bio ❌ until S9–S11.
- Each field is saved on its own (`PATCH /profiles/:id`, only that key); the response replaces the held profile.
- States: loading, saving (loader on that field only), an empty field reads "Add", refused rename (the message under the field, the current name kept), next-rename date shown.
- Not in v1: several profiles. No create, no "Make default", no delete.
- Source today: `GET /profiles`, `PATCH /profiles/:id` (name, nickname, Pin name). Work details, the rename limit and clearing the nickname: not available yet.

### [[Screen Index#s68|s68]] Me (S3, S4)

- The header card opens the profile editor.
- Privacy rows: birthdate, gender and marital status, set from the row with `PATCH /profiles/:id`, one field per request, `null` clears ✅ (shipped in the client 2026-10-26). Under each row, which Rings show it (from the Rings' projections).

### [[Screen Index#s23|s23]] Edit · how you appear (S11)

The screen is [[FR-10 Ring Projection Frontend Requirements|Ring Projection's]]. "Inherit from your Pin" means the main profile's values; nothing is asked here beyond S9–S11.

### [[Screen Index#s44|s44]] Scanned Pin (S7)

The screen and the look-up by Pin name are [[FR-12 View As & Pin Views Frontend Requirements|View As & Pin Views']]. A public web page by Pin name is [[ND-22 Public web page by Pin name]].

## Field map

| Shown | Source | Rule |
|---|---|---|
| `!pinName` | `ProfileEntity.pinName` | 3–30 chars, letters, digits, `.`, `_`; sent without `!` |
| Next allowed rename | the profile (S12) | ❌ not available yet; shown only when in the future |
| Full name | `fullName` | ≤ 120 |
| What friends call you | `nickname` | ≤ 60; `null` clears (❌ not accepted yet) |
| Birthdate | `birthdate` | ISO date or `null` |
| Gender | `gender` | enum from `/docs` or `null` |
| Marital status | `maritalStatus` | enum from `/docs` or `null` |
| Headline | main profile (S9–S11) | length set by S9–S11; a Ring may change it |
| Role | main profile (S9–S11) | behaves like headline until product says otherwise (D-02 *Still open*) |
| Company | main profile (S9–S11) | a Ring may change it |
| Location | main profile (S9–S11) | a Ring may change it |
| Photo | main profile (S9–S11), a file id from `POST /files` | shown once [[ND-16 Viewer access to file bytes]] is served; a Ring may pick another |
| Bio | main profile (S9–S11) | a Ring may change it |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Live availability of a handle | `GET /profiles/pin-name/:pinName/availability` | ✅ | S1, S12 |
| Claim the handle and the full name at registration | `POST /auth/complete-registration` | ✅ | S1, S9 (listed under [[F-02 Auth & Sign-up]]) |
| List my profiles, default first | `GET /profiles` | ✅ | S3, S10 (the client reads `data[0]`) |
| Read one of my profiles | `GET /profiles/:id` | ✅ | — |
| Edit name, nickname, handle, sensitive fields | `PATCH /profiles/:id` | ✅ | S3, S4, S12 |
| **Clear the nickname** (`nickname: null`, as the sensitive fields already accept) | `PATCH /profiles/:id` | ❌ | S3 |
| Main profile fields (headline, role, company, location, photo, bio) on read and `PATCH` | `GET /profiles`, `PATCH /profiles/:id` | ❌ | [[S-14 Profiles & Pin Name Story\|Profiles & Pin Name · S9–S11]] |
| **Once-a-year rename**: the next allowed rename date on the profile, and a refused rename (inside the year) answered with its **own `ErrorCode`**; a change of capitals only is not a rename; the first rename after sign-up is allowed. Field and code to be named by the backend. | `GET /profiles`, `PATCH /profiles/:id` | ❌ | [[S-14 Profiles & Pin Name Story\|Profiles & Pin Name · S12–S13]] |
| Upload the profile photo | `POST /files` | ✅ | S9 ([[F-04 Files Upload]]) |
| Show the profile photo | — | ❌ | [[ND-16 Viewer access to file bytes]] |
| Public web page by Pin name (`socialpin.me/<pinName>`) | — | ❌ | [[ND-22 Public web page by Pin name]] |
| Suggested handles on s06 and in the editor | — (client, from the person's own name) | ✅ | S1 ([[D-06 Yearly rename, old name freed, case-insensitive]]) |
| Gemma's handle suggestions | — | ❌ | [[S-89 Gemma AI Story\|Gemma AI · S6]]; the chip is hidden until then |
| Import into the profile | — | ❌ | [[S-08 Onboarding Imports Story\|Onboarding Imports · S7]] |
| Create a profile, make one the default, delete a non-default one | `POST /profiles`, `POST /profiles/:id/default`, `DELETE /profiles/:id` | ✅ | not used in v1 (one profile per person) |

## Behaviour expectations

- Refetch / realtime: refetch `GET /profiles` after every write; the editor state is replaced by the returned entity. No push.
- Caching keys: `profiles:<userId>`; the default profile's `pinName` is also what the badge and the Me header show, so invalidate `account:<userId>` views that embed it.
- Pagination / ordering: the client reads `data[0]` (the default profile) only.
- Availability check: debounce 300 ms, cancel in-flight requests on each keystroke, run the client rule (3–30) first, send without the `!`, treat the answer as a boolean only.
- Clearing: send `null` explicitly for a sensitive field (and for the nickname, once accepted); omitting the key leaves it unchanged.
- Rename: after a successful handle change, refresh anything that printed the old handle (badge, Me header); the old handle is a 404 for everyone at once. Show the next allowed date from the profile once it exists; until then the editor shows "You can change it once a year" without a date and nothing enforces it.
- Public route: the availability check sends no bearer token; everything else does.
- **Sign-up writes after registration.** What s05b (and an import's review) collected is sent with one `PATCH /profiles/:id` as soon as `complete-registration` returns; a failure never undoes the account and is retried on the next launch.
- **The photo** is uploaded first (`POST /files`), then its id is sent; the client never sends image bytes to `/profiles`.
- **s06's extras:** the Gemma chip is not shown; the socialpin.me line is plain text.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 409 | `E_PROFILE_02` | "That Pin name is taken", inline, field focused (at sign-up: "That Pin name was just taken", the name kept) |
| 404 | `E_PROFILE_01` | treat as missing; refetch the list |
| — | refused rename, its own code (S12, to be named by the backend) | "You can change your Pin name once a year. Next change: <date>." under the field; the current name kept |
| 400 | — (validation; `message` is a string array) | inline on the field (length, format, enum) |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]: s05b's optional fields saved, the editor's work section.
- [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S12–S13]]: the once-a-year limit and its date.
- [[ND-16 Viewer access to file bytes]]: the photo, once saved.
- [[ND-22 Public web page by Pin name]]: s06's socialpin.me line as a link (text until then).
