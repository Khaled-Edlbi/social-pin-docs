---
type: frontend-requirements
code: profiles
scope: feature
feature: profiles
module: identity
status: draft
screens: [s06, s68]
depends: []
affects: ["T-078 Main profile fields from DR-02"]
related: ["DR-02 One main profile every Ring starts from", "DR-06 Yearly rename, old name freed, case-insensitive", "Onboarding Imports", "Auth & Sign-up", "Files Upload", "T-062 Serve uploaded file bytes by id", "T-020 LinkedIn import → review → base profile", "T-063 Put the ErrorCode on the error body"]
created: 2026-10-18
updated: 2026-10-26
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Profiles & Pin Name · Frontend Requirements

**Feature:** [[Profiles & Pin Name]] · **Status:** Draft · **Story:** [[Profiles & Pin Name Story]] · **Backend Integration:** [[Profiles & Pin Name Backend Integration]]

What the client needs from the backend for the Pin-name claim, sign-up's *Profile basics* step and the owner's profile editor, and whether each need is met today. The main profile of [[DR-02 One main profile every Ring starts from]] (headline, role, company, location, photo, bio) is asked of the backend in [[T-078 Main profile fields from DR-02]]; the Pin-name rules are [[DR-06 Yearly rename, old name freed, case-insensitive]]. Shapes, field limits and the enum values are in [[Profiles & Pin Name Backend Integration]].

## Per screen

### [[Screen Index#s06|s06]] Claim your Pin

- Needs: live availability for a handle; the rule for a valid handle; completion of registration with the handle.
- Actions: type, Continue.
- States: typing, checking, available, taken, invalid format, taken-at-submit, suggestions.
- Suggestions: built **on the client** from the person's own name, as DR-06 decided (never from anyone else's); shown as chips. No endpoint needed.
- Capitals don't matter: the backend already decides uniqueness on the lower-cased name and keeps the casing typed.
- Source today: `GET /profiles/pin-name/:pinName/availability` (public, no token), `POST /auth/complete-registration`.

### *Profile basics* (sign-up, no screen id in [[Screen Index]] yet)

- Where it sits: after Start from (s03) or an import's review (s05), **before** Claim your Pin (s06). The account doesn't exist yet.
- Fields: full name (required), photo, headline, company, location; the photo from the camera or the library.
- Needs: the full name goes into `POST /auth/complete-registration` (`fullName`) ✅. The other four are written to the new main profile **right after registration**, with `PATCH /profiles/:id` (the photo as a `POST /files` id): ❌ until [[T-078 Main profile fields from DR-02]].
- Source today: the name is saved; photo, headline, company and location are kept in memory and lost.

### Privacy rows on Me ([[Screen Index#s68|s68]])

- Birthdate, gender and marital status: what is set on the profile, set from the row with `PATCH /profiles/:id`, one field per request ✅ (shipped in the client 2026-10-26). Under each row, which Rings show it (from the Rings' projections).

### Profile editor (reached from [[Screen Index#s68|s68]], no prototype screen)

- Needs: the owner's profiles, default first; edit `pinName`, `fullName`, `nickname`, `birthdate`, `gender`, `maritalStatus`; clear a sensitive field; create a profile; set the default; delete a non-default profile.
- Fields shown: `pinName` (with `!` decoration), `fullName`, `nickname`, the three sensitive fields with "shared only with Rings you choose", `profileType`, `isDefault`.
- States: loading, saving, cleared, default badge, delete disabled on the default.
- Source today: `GET /profiles`, `GET /profiles/:id`, `PATCH /profiles/:id`, `POST /profiles`, `POST /profiles/:id/default`, `DELETE /profiles/:id`.
- Not available: headline, role, company, location, photo, bio ([[T-078 Main profile fields from DR-02]]); the once-a-year rename limit (no task yet).

## Field map

| Shown | Source | Rule |
|---|---|---|
| `!pinName` | `ProfileEntity.pinName` | 3–30 chars, letters, digits, `.`, `_`; sent without `!` |
| Full name | `fullName` | ≤ 120 |
| Nickname | `nickname` | ≤ 60 |
| Birthdate | `birthdate` | ISO date or `null` |
| Gender | `gender` | enum from `/docs` or `null` |
| Marital status | `maritalStatus` | enum from `/docs` or `null` |
| Type | `profileType` | `PERSONAL` (default), `PROFESSIONAL`, `BUSINESS` |
| Default | `isDefault` | one per account |
| Headline | main profile (T-078) | length set by T-078; a Ring may change it |
| Role | main profile (T-078) | behaves like headline until product says otherwise (DR-02 *Still open*) |
| Company | main profile (T-078) | a Ring may change it |
| Location | main profile (T-078) | a Ring may change it |
| Photo | main profile (T-078), a file id from `POST /files` | shown once [[T-062 Serve uploaded file bytes by id]] ships; a Ring may pick another |
| Bio | main profile (T-078) | a Ring may change it |

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Live availability of a handle | `GET /profiles/pin-name/:pinName/availability` | ✅ | — |
| List my profiles, default first | `GET /profiles` | ✅ | — |
| Create an additional profile | `POST /profiles` | ✅ | — |
| Read one of my profiles | `GET /profiles/:id` | ✅ | — |
| Edit name, nickname, handle, sensitive fields | `PATCH /profiles/:id` | ✅ | — |
| Make a profile the default | `POST /profiles/:id/default` | ✅ | — |
| Delete a non-default profile | `DELETE /profiles/:id` | ✅ | — |
| Claim the handle at registration | `POST /auth/complete-registration` | ✅ | — (listed under [[Auth & Sign-up]]) |
| Main profile fields (headline, role, company, location, photo, bio) on read and `PATCH` | `GET /profiles`, `PATCH /profiles/:id` | ❌ | [[T-078 Main profile fields from DR-02]] |
| Upload the profile photo | `POST /files` | ✅ | — ([[Files Upload]]) |
| Show the profile photo | — | ❌ | [[T-062 Serve uploaded file bytes by id]] |
| Once-a-year rename limit, enforced and its next date readable | — | ❌ | no task yet ([[DR-06 Yearly rename, old name freed, case-insensitive]]) |
| Suggested handles on s06 | — (client, from the person's own name) | ✅ | — ([[DR-06 Yearly rename, old name freed, case-insensitive]]) |
| Import into the profile | — | ❌ | [[T-020 LinkedIn import → review → base profile]] |

## Behaviour expectations

- Refetch / realtime: refetch `GET /profiles` after every write; the editor state is replaced by the returned entity. No push.
- Caching keys: `profiles:<userId>`; the default profile's `pinName` is also what the badge and Me header show, so invalidate `account:<userId>` views that embed it.
- Pagination / ordering: `GET /profiles` returns the default first, then oldest first, with `meta.total`; filters `pinName` (partial, case-insensitive) and `profileType`. Most screens need only `data[0]`.
- Availability check: debounce 300 ms, cancel in-flight requests on each keystroke, run the client regex first, send without the `!`, treat the answer as a boolean only.
- Clearing: send `null` explicitly for a sensitive field; omitting the key leaves it unchanged (`@MyIsOptional(true)` semantics).
- Rename: after a successful handle change, refresh anything that printed the old handle (badge, Me header); the old handle is a 404 for everyone at once.
- Default: offer delete only when `isDefault` is false; after `POST …/default`, refetch the list rather than flipping flags locally.
- Public route: the availability check sends no bearer token; everything else does.
- **Sign-up writes after registration.** What *Profile basics* (and an import's review) collected is sent with one `PATCH /profiles/:id` as soon as `complete-registration` returns; a failure never undoes the account and is retried on the next launch.
- **The photo** is uploaded first (`POST /files`), then its id is sent; the client never sends image bytes to `/profiles`.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 409 | `E_PROFILE_02` | "That Pin name is taken", inline, field focused |
| 409 | `E_PROFILE_03` | "Choose another default first" |
| 404 | `E_PROFILE_01` | treat as missing; refetch the list |
| 400 | — (validation; `message` is a string array) | inline on the field (length, format, enum) |

Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint.

## Blocked by

- [[T-078 Main profile fields from DR-02]] — *Profile basics*, the editor's work section, and the headline every design screen shows.
- [[T-062 Serve uploaded file bytes by id]] — the photo, once saved.
- The once-a-year rename limit has no task: the client shows the copy but nothing enforces it.
