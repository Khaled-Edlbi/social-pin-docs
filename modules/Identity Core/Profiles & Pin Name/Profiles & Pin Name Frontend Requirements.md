---
type: frontend-requirements
code: profiles
scope: feature
feature: profiles
module: identity
status: draft
screens: [s06]
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Profiles & Pin Name · Frontend Requirements

> ⚠ Affected by [[DR-02 One main profile every Ring starts from]] (2026-10-25): D-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[DR-06 Yearly rename, old name freed, case-insensitive]] (2026-10-25): D-06 decided, a Pin name can be changed once a year, the old name is free at once, names ignore capitals, suggestions come only from the person's own name.

**Feature:** [[Profiles & Pin Name]] · **Status:** Draft · **Story:** [[Profiles & Pin Name Story]] · **Backend Integration:** [[Profiles & Pin Name Backend Integration]]

What the client needs from the backend for the Pin-name claim and the owner's profile editor, and whether each need is met today. Shapes, field limits and the enum values are in [[Profiles & Pin Name Backend Integration]].

## Per screen

### [[Screen Index#s06|s06]] Claim your Pin

- Needs: live availability for a handle; the rule for a valid handle; completion of registration with the handle.
- Actions: type, Continue.
- States: typing, checking, available, taken, invalid format, taken-at-submit, suggestions (not available).
- Source today: `GET /profiles/pin-name/:pinName/availability` (public, no token), `POST /auth/complete-registration`.

### Profile editor (reached from [[Screen Index#s68|s68]], no prototype screen)

- Needs: the owner's profiles, default first; edit `pinName`, `fullName`, `nickname`, `birthdate`, `gender`, `maritalStatus`; clear a sensitive field; create a profile; set the default; delete a non-default profile.
- Fields shown: `pinName` (with `!` decoration), `fullName`, `nickname`, the three sensitive fields with "shared only with Rings you choose", `profileType`, `isDefault`.
- States: loading, saving, cleared, default badge, delete disabled on the default.
- Source today: `GET /profiles`, `GET /profiles/:id`, `PATCH /profiles/:id`, `POST /profiles`, `POST /profiles/:id/default`, `DELETE /profiles/:id`.
- Not available: headline, role, company, location, base photo, base bio; rename limit; suggestions.

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
| Work fields (headline, role, company, location, photo, bio) | — | ❌ | [[D-02 Base profile work fields]] |
| Once-a-year rename limit | — | ❌ | [[D-06 Pin name rules]] |
| Suggested handles on s06 | — | ❌ | [[D-06 Pin name rules]] |
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

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 409 | `E_PROFILE_02` | "That Pin name is taken", inline, field focused |
| 409 | `E_PROFILE_03` | "Choose another default first" |
| 404 | `E_PROFILE_01` | treat as missing; refetch the list |
| 400 | — (validation; `message` is a string array) | inline on the field (length, format, enum) |

Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint.

## Blocked by

- [[D-02 Base profile work fields]] — the work section of the editor and the headline shown on every design screen.
- [[D-06 Pin name rules]] — the "once a year" copy and suggestion chips on s06.
