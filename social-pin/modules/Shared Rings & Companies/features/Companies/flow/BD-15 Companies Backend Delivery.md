---
id: BD-15
type: backend-delivery
module: shared-rings
feature: companies
status: todo
scope: feature
screens: [s72, s73]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/todo, module/shared-rings, layer/backend]
---

# ⬜ Companies · Backend Delivery

> ⚠ Affected by [[FR-15 Companies Frontend Requirements]] (2026-11-15): FR-15 is `ready` again for review, rewritten to S-29 of 2026-11-15: new `meta.ownsBusiness` on `GET /businesses/mine` (for *Create a business account*); team members with no Ring listed, `rings: []` on `GET /businesses/:id`, the team place ended by leave (P12); `domain` is the business's website (P6); no `verifiedEmail`, no Ring `label`, no `requiredEmailDomain` (D-33, D-36, S12 not in this version)

> ⚠ Affected by [[S-29 Companies Story]] (2026-11-15): P12 added: a team member (accepted the owner's team invitation, Exhibitor · S2) is part of the company with no Ring membership; `GET /businesses/mine` lists the company for them (S2: "at least one live membership, or on its team"), and leaving the last Ring doesn't drop a company they're still on the team of (S10)

> ⚠ Affected by [[D-39 The company domain and the title switch show in the MVP]] (2026-11-12): s73's "Verified · {domain}" and s72's title switch show in the MVP; nothing new for the MVP, the proof of the domain and the company's title updates start right after it

> ⚠ Affected by [[S-29 Companies Story]] (2026-11-05): S-29 added P9 (every company member reads the company's card Ring, through the access engine) and P11 (the title shows only on the company matching the profile's company).

**Feature:** [[F-15 Companies]] · **Status:** To do · **Integration guide:** [[Companies Backend Integration]] · **Requirements:** [[FR-15 Companies Frontend Requirements]] · **QA:** [[Companies QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Business`, `BusinessMember`, `BusinessTag`, `BusinessFile`

### What exists

- Business schema with members, tags and files.

### Gaps

- List my companies, company detail, leave company.
- Company Rings (`CORPORATE` with `parentRingId` hierarchy: public / employees / c-suite) and their admins.
- Overlaps with [[F-24 Exhibitor]] business account setup.

## Log

- 2026-10-18 · split out of [[F-15 Companies]] when the vault moved to layers
