---
type: backend-integration
code: profiles
scope: feature
feature: profiles
module: identity
status: current
screens: [s06]
created: 2026-10-15
updated: 2026-10-26
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Profiles & Pin Name · Backend Integration

> ⚠ Affected by [[D-02 One main profile every Ring starts from]] (2026-10-25): ND-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[D-06 Yearly rename, old name freed, case-insensitive]] (2026-10-25): ND-06 decided, a Pin name can be changed once a year, the old name is free at once, names ignore capitals, suggestions come only from the person's own name.

**Feature:** [[Profiles & Pin Name]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]]

What the client builds: the Pin-name claim and the owner's profile editor: name, nickname and the three sensitive base fields (birthdate, gender, marital status) that each Ring later opts into. Plus, for accounts that use it, several profiles and the choice of the default.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s06\|s06]] Claim your Pin | types a handle | `GET /profiles/pin-name/:pinName/availability` (public) |
| Me / profile editor | reads and edits their own profile | `GET /profiles`, `GET /profiles/:id`, `PATCH /profiles/:id` |
| Profiles (if the app exposes more than one) | adds one, picks the default, deletes one | `POST /profiles`, `POST /profiles/:id/default`, `DELETE /profiles/:id` |

## Flow

1. **`GET /profiles`** → `{ data: ProfileEntity[], meta: { total } }`, the default profile first, then oldest first. Filters: `pinName` (partial, case-insensitive), `profileType`. Most clients need only `data[0]`.
2. **`PATCH /profiles/:id`** with any of `pinName`, `profileType`, `fullName` (≤120), `nickname` (≤60), `birthdate` (ISO date), `gender`, `maritalStatus`. The three sensitive fields accept `null` to clear. Changing `pinName` re-checks uniqueness: 409 `E_PROFILE_02`.
3. **`POST /profiles`** creates an additional profile with the same fields; `pinName` is required and must be free. `profileType` defaults to `PERSONAL` (also `PROFESSIONAL`, `BUSINESS`).
4. **`POST /profiles/:id/default`** → 201 with the promoted profile; the previous default is demoted in the same transaction.
5. **`DELETE /profiles/:id`** → 200. The default profile cannot be deleted (409 `E_PROFILE_03`): make the user promote another first.

## Shapes that matter

`ProfileEntity`: `id`, `userId`, `profileType`, `isDefault`, `pinName` (without the `!`), `fullName`, `nickname`, `birthdate`, `gender`, `maritalStatus`, `createdAt`, `updatedAt`.

- `pinName` rules: 3 to 30 characters of letters, digits, `.` and `_`; sent and stored without the `!`. Render the `!` as decoration. Uniqueness is global and ignores case.
- `birthdate`, `gender`, `maritalStatus` are **owner-only here**. Whether an audience sees them is decided per Ring by its `show*` flags ([[Ring Projection Backend Integration]]). The editor should say so next to each field ("shared only with Rings you choose").

## State to keep on the client

Cache the owner's profiles; refetch after any write. The default profile's `pinName` is what the badge shows and what `GET /views/pin/:pinName` resolves for others.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 409 | `E_PROFILE_02` | pin name already taken | inline, keep the field focused |
| 409 | `E_PROFILE_03` | deleting the default profile | "Choose another default first" |
| 404 | `E_PROFILE_01` | not one of the caller's profiles | treat as missing |

## Rules the UI must respect

- The availability check returns only a boolean. Do not build "did you mean" from it; suggestions are an open decision ([[Pin name rules]]).
- These endpoints return the caller's **own** profiles only. For anyone else's identity use `/views/…`.

## Not available yet

- Work fields on the base profile (headline, role, company, location, base photo, base bio) that every design screen shows: [[Base profile work fields]]. Until decided, those live only per Ring on the projection.
- The once-a-year rename limit and suggested handles on s06: [[Pin name rules]]. Today a rename is unlimited.
- LinkedIn / card / portfolio import into the profile: [[Onboarding Imports]].

## Checklist

- [ ] Pin field: client regex, debounced check, `!` decoration only.
- [ ] Sensitive fields labelled as owner-only, with a clear "clear" action that sends `null`.
- [ ] Default profile promoted before delete is offered.
