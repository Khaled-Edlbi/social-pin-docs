---
type: feature
id: profiles
name: "Profiles & Pin Name"
status: done
priority: P0
domain: identity
screens: [s06]
updated: 2026-10-18
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Profiles & Pin Name

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]] · **Frontend guide:** [[Profiles & Pin Name Frontend]] · **Story:** [[Profiles & Pin Name Story]] · **Requirements:** [[Profiles & Pin Name Requirements]]

Multiple profiles per account, the `!`-prefixed unique Pin name with a public live availability check, and the sensitive base fields (birthdate, gender, marital status) that Rings opt into.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s06|s06]] | Claim your Pin | Availability check done; yearly rename + suggestions → D-06 |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

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

- No work fields (headline, role, company, location, base photo, base bio) even though every screen shows them. See [[D-02 Base profile work fields]].
- No rename limit and no suggested names, while s06 says "change it once a year" and shows suggestions. See [[D-06 Pin name rules]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-057 Decide base profile work fields]] | ❓ Needs a decision / info | P0 | S |
| [[T-061 Decide Pin name rules]] | ❓ Needs a decision / info | P1 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "profiles" SORT priority ASC
```

## Open decisions

- [[D-02 Base profile work fields]]
- [[D-06 Pin name rules]]

## Related

- [[Auth & Sign-up]]
- [[Ring Projection]]
- [[Onboarding Imports]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
