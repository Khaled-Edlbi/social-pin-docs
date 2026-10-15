---
type: feature
id: profiles
name: "Profiles & Pin Name"
status: done
priority: P0
domain: identity
screens: [s06]
updated: 2026-10-15
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Profiles & Pin Name

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

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
