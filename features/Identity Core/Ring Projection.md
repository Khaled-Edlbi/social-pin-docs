---
type: feature
id: ring-projection
name: "Ring Projection"
status: done
priority: P0
domain: identity
screens: [s14, s20, s23, s24, s25, s29, s36]
updated: 2026-10-15
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Ring Projection

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

What a Ring shows: photo, bio, nickname, theme, social and contact links, info blocks ("Add a field"), file attachments, and the per-Ring opt-ins for birthdate, gender, marital status, phone and email.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s14|s14]] | Ring data |  |
| [[Screen Index#s20|s20]] | New Ring · step 3 (what it shows) | Field library → D-03 |
| [[Screen Index#s23|s23]] | Edit · how you appear | Inherit → D-05 / D-02 |
| [[Screen Index#s24|s24]] | Edit · what it shows | "4 of 7 on" → D-03 |
| [[Screen Index#s25|s25]] | Edit · social profiles |  |
| [[Screen Index#s29|s29]] | Photo for this Ring | "Reset to Pin" → D-02 |
| [[Screen Index#s36|s36]] | Add to this Ring |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]], [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `GET /rings/:ringId/projection`
- `PATCH /rings/:ringId/projection`
- `POST /rings/:ringId/projection/links`
- `PATCH …/links/:linkId`
- `DELETE …/links/:linkId`
- `POST …/info-blocks`
- `PATCH …/info-blocks/:blockId`
- `DELETE …/info-blocks/:blockId`
- `POST …/attachments`
- `DELETE …/attachments/:attachmentId`

**Tables / models:** `RingProfile`, `RingProfileLink`, `RingInfoBlock`, `RingProfileFile`

**Code:** `src/modules/ring-profile/`, `src/prisma/validators/ring-profile.validator.ts`

### What exists

- Owner entity (`RingProfileOwnerEntity`) includes `isVisible` flags and hidden rows; the viewer entity never does.
- Hidden rows are excluded by the query, not the serializer, so they are never read into a response.
- Sensitive fields are gated in exactly one place: `RingProfileService.toView`. All `show*` flags default to `false`.
- Link values are validated by type: absolute `http(s)` URLs, E.164 phones, `lat,lng` locations. Several links of one type are allowed.

### Gaps

- The design assumes **one library of fields** that each Ring turns on or off ("4 of 7 on", s20 / s24). The backend stores a separate copy per Ring. See [[D-03 Field library vs per-Ring copies]].
- "Inherit, stays in sync with your Pin" (s23) and "Copy another Ring's bio" (s28) need the base profile bio and photo. See [[D-05 Copy or inherit]] and [[D-02 Base profile work fields]].
- Widgets (s37) have a table but no endpoints. See [[Widgets]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-058 Decide field library vs per-Ring copies]] | ❓ Needs a decision / info | P0 | S |
| [[T-060 Decide copy or inherit]] | ❓ Needs a decision / info | P1 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-projection" SORT priority ASC
```

## Open decisions

- [[D-02 Base profile work fields]]
- [[D-03 Field library vs per-Ring copies]]
- [[D-05 Copy or inherit]]

## Related

- [[Rings]]
- [[View As & Pin Views]]
- [[Files Upload]]
- [[Widgets]]
- [[Profiles & Pin Name]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
