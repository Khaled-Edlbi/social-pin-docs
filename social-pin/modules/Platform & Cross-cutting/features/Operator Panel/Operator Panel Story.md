---
type: story
code: operator-panel
scope: feature
feature: operator-panel
module: platform
status: draft
screens: []
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
created: 2026-10-27
updated: 2026-10-27
tags: [story, story/draft, module/platform, layer/business]
---

# Operator Panel · User Story

**Feature:** [[Operator Panel]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Operator Panel Frontend Requirements]] · **Backend Integration:** [[Operator Panel Backend Integration]] · **Verified by:** [[Operator Panel QA Backend]], [[Operator Panel QA Frontend]]

One paragraph: who the user is here and what they are trying to get done, in product terms. `approved` (👍) when product signs off (`approvedBy`, `approvedAt`); `verified` (✅ Fulfilled) set by the PM once every QA note of its scope is `passing` with nothing pending.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · <Screen or journey name> ([[Screen Index#sNN|sNN]])

**As a** … **I want** … **so that** …

Acceptance criteria:
- [ ] …
- [ ] …

### S2 · …

### S3 · Account moderation and platform role

*From T-068 (status then: In progress), merged 2026-10-27.*

The panel's first screens, for staff rather than users: find an account,
read its state, suspend or reactivate it, and set the platform role on it.
`GET /admin/users` with a search over email and phone and filters for
status, account type, role and creation window, `GET /admin/users/:id`,
`PATCH .../:id/status` and `PATCH .../:id/role`, the last SUPER_ADMIN-only
because `users.role` is the string `RolesGuard` matches. Code:
`src/modules/admin/admin-user.*`, `entities/admin-user.entity.ts`,
`E_ADMIN_01` and `E_ADMIN_02`.

Two behaviours carry the weight. Suspension ends the session now: the
account's live refresh tokens are revoked in the same transaction as the
status change, so it cannot mint a new access token. And the detail screen
returns `_count`s, not rows — how many rings and profiles an account has,
never whose they are or what is in them, so what a viewer may see stays
with `RingAccessService`.

Screens: —


### S4 · Scoped role grants

*From T-069 (status then: In progress), merged 2026-10-27.*

List, grant and revoke the scoped grants in `user_roles`:
`GET/POST /admin/users/:userId/roles` and `DELETE .../roles/:assignmentId`.
The scope type comes from the role rather than the request; a GLOBAL role
takes no scope id and every other scope requires one, which is what the
partial unique index on the null case and the duplicate check both depend
on. A revoke is scoped by user as well as assignment id, so a grant cannot
be revoked through another user's route. Codes `E_ADMIN_03` to `E_ADMIN_07`.

A GLOBAL grant is SUPER_ADMIN-only: `JwtStrategy` puts GLOBAL-scoped role
names into the same array `RolesGuard` matches, so granting a role named
`ADMIN` globally is the same privilege as writing `users.role`, and it is
gated the same way — in the service, because the route itself stays open to
ADMIN for the scoped grants that are the common case.

Not to be confused with [[Delegated Admins Story|Delegated Admins · S6]], which is
ring-level (`/rings/:ringId/admins`, owner only, `assertCanAdminister`).
Both have to exist; neither closes the other.

Screens: —


### S5 · Roles and permissions catalogue

*From T-070 (status then: In progress), merged 2026-10-27.*

Read-only views of the seeded RBAC reference data, so the panel can show
what a grant would mean: `GET /admin/roles` for roles with their permission
keys and holder counts, and `GET /admin/roles/permissions` for the whole
catalogue. Roles are seeded, so there is deliberately no write route.

The permission catalogue is unpaged on purpose: it is reference data the
role editor needs in full to render its checkboxes, and paging it would only
make the client stitch the pages back together. The permission join rows are
flattened once, in `toView`, so the entity needs no second shape.

Screens: —


### S6 · Audit-log read endpoints

*From T-071 (status then: In progress), merged 2026-10-27.*

The trail the panel writes, made readable: `GET /admin/audit-logs`, filtered
by actor, action, resource and time window, and `GET /admin/audit-logs/:id`
for one entry with its full `metadata`.

The detail route is SUPER_ADMIN-only because `metadata` is the one field
that can carry the shape of a change; `E_ADMIN_08` when the entry is not
there. The reads come from `AuditLogService`, which already owns the table
([[Audit Log Story|Audit Log · S4]]), rather than a second query path into
`audit_logs`. The table stays append-only: no route deletes an entry at any
role.

Screens: —


### S7 · Platform stats

*From T-072 (status then: In progress), merged 2026-10-27.*

`GET /admin/stats`: the dashboard's landing figures — the account lifecycle
broken down by status, live ring, profile and role counts, and the audit
events of the last 24 hours.

Counts only, by design. An operator learns how many rings exist, never whose
they are or what is in them: an aggregate that cannot be attributed to a
person is not a privacy decision at all. Every figure is one `count` with a
`where`, issued in parallel and deliberately without a transaction — they
are independent reads, and wrapping them would hold one open across thirteen
queries to buy a snapshot nothing here depends on. `generatedAt` is returned
so the client can say how fresh the tiles are rather than implying they are
live.

Screens: —

## States and motion the design asks for

- State: …
- Motion: …

## Rules the backend already enforces

Edge cases a story must respect because the backend decides them (from the feature's Backend Delivery note).

## Open questions

- [[ND-NN …]] — what it blocks here.
