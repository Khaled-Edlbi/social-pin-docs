---
type: feature
id: companies
name: "Companies"
status: todo
priority: P1
domain: shared-rings
screens: [s72, s73]
updated: 2026-10-15
tags: [feature, status/todo, domain/shared-rings, priority/P1]
---

# ❌ Companies

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Shared Rings & Companies|Shared Rings & Companies]]

My companies (s72) and company detail (s73): the business tables exist (`Business`, `BusinessMember`, tags, files), no endpoints.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s72|s72]] | My companies |  |
| [[Screen Index#s73|s73]] | Company detail |  |

Wireframe brief sections: [[Wireframe Brief#Business account setup|§9.1 Business account setup]], [[Wireframe Brief#Organizer touchpoints|§9.3 Organizer touchpoints]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Business`, `BusinessMember`, `BusinessTag`, `BusinessFile`

### What exists

- Business schema with members, tags and files.

### Gaps

- List my companies, company detail, leave company.
- Company Rings (`CORPORATE` with `parentRingId` hierarchy: public / employees / c-suite) and their admins.
- Overlaps with [[Exhibitor]] business account setup.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-029 My companies and company detail]] | ⬜ To do | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "companies" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]

## Related

- [[Ring Invitations & Join]]
- [[Delegated Admins]]
- [[Exhibitor]]
- [[Rings]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
