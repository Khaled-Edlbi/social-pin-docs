---
id: BD-07
type: backend-delivery
module: identity
feature: profiles
status: done
scope: feature
screens: [s06]
pending: ["[[S-14 Profiles & Pin Name Story]]: S9–S11 Main profile fields from D-02 (was T-078)", "[[S-14 Profiles & Pin Name Story]]: S12 Enforce the once-a-year Pin name rename (was T-079)", "[[FR-07 Profiles & Pin Name Frontend Requirements]]: clear the nickname with nickname: null on PATCH /profiles/:id (S3)", "[[FR-07 Profiles & Pin Name Frontend Requirements]]: my Rings with their five show* switches in one call, for Me's privacy rows (S4)", "[[FR-07 Profiles & Pin Name Frontend Requirements]]: a signed avatarUrl (15 minutes) for the main photo on GET /profiles (D-16)"]
created: 2026-10-15
updated: 2026-11-05
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Profiles & Pin Name · Backend Delivery

> ⚠ Affected by [[D-02 One main profile every Ring starts from]] (2026-10-25): ND-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[D-06 Yearly rename, old name freed, case-insensitive]] (2026-10-25): ND-06 decided, a Pin name can be changed once a year, the old name is free at once, names ignore capitals, suggestions come only from the person's own name.

**Feature:** [[F-07 Profiles & Pin Name]] · **Status:** Done · **Integration guide:** [[BI-04 Profiles & Pin Name Backend Integration]] · **Requirements:** [[FR-07 Profiles & Pin Name Frontend Requirements]] · **QA:** [[Profiles & Pin Name QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /profiles/pin-name/:pinName/availability (public)`
- `GET /profiles`
- `POST /profiles`
- `GET /profiles/:id`
- `PATCH /profiles/:id`
- `POST /profiles/:id/default`
- `DELETE /profiles/:id`

**Tables / models:** `Profile`

**Code:** `src/modules/profile/`

## How it works

`ProfileService` owns Pin-name uniqueness and the canonical personal fields; what a Ring shows of them belongs to `RingProfileService`. Uniqueness is global and case-insensitive, decided on `pinNameNormalized` (lower-cased), while the original casing is kept for display; `GET /profiles/pin-name/:pinName/availability` is `@Public()` and answers only a boolean. `POST /profiles` and a `PATCH` that changes the handle run the check and the write in one transaction (409 `E_PROFILE_02` on a clash; two concurrent requests cannot both win). The first profile is created inside `completeRegistration`'s transaction and is the default; `POST /profiles/:id/default` demotes then promotes in one transaction because the partial unique index `profiles_one_default_per_user` allows a single default. `DELETE /profiles/:id` is a soft delete and refuses the default (409 `E_PROFILE_03`): an account with no default profile has no Ring projection to fall back on. `GET /profiles` lists the owner's own rows, default first, through `ProfileQueryBuilderService` (`pinName` partial match, `profileType`), and `meta.total` is the unpaginated count. The three sensitive fields are nullable on the profile and `@MyIsOptional(true)` on the DTO, so `null` clears them; whether an audience sees them is decided per Ring.

### What exists

- Pin name uniqueness via `pinNameNormalized`; the availability check never says who holds a taken name.
- Default profile with a partial unique index (one default per account); deleting the default is a 409.
- Sensitive fields live once on `Profile`, nullable; each Ring opts in with its own `show*` flags.

### Gaps

- No work fields (headline, role, company, location, base photo, base bio) even though every screen shows them. Decided in [[D-02 One main profile every Ring starts from]]; to build: [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]].
- No rename limit: a rename is unlimited and no field says when the next one is allowed. Decided in [[D-06 Yearly rename, old name freed, case-insensitive]] (suggestions are the client's, from the person's own name); to build: [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S12–S13]].
- `nickname` cannot be cleared: the DTO uses `@MyIsOptional()` (not nullable), so `nickname: null` is a 400; only the three sensitive fields accept `null` ([[FR-07 Profiles & Pin Name Frontend Requirements]], S3).
- No call returns my Rings with their `show*` switches: `GET /rings` returns the Ring alone, so Me's privacy rows need one `GET /rings/:ringId/projection` per Ring ([[FR-07 Profiles & Pin Name Frontend Requirements]], S4).
- No photo on the profile and no signed `avatarUrl` on `GET /profiles` ([[D-16 Files load from signed links that expire in 15 minutes]]).

## Log

- 2026-10-18 · split out of [[F-07 Profiles & Pin Name]] when the vault moved to layers
- 2026-11-05 · [[FR-07 Profiles & Pin Name Frontend Requirements]] reviewed against the backend's `main` (80e7fa2) and approved; three new asks added to `pending` (clear the nickname, my Rings' `show*` switches in one call, a signed `avatarUrl` on `GET /profiles`), beside the two already there (S9–S11, S12)
