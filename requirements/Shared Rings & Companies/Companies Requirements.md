---
type: requirements
id: companies
feature: companies
status: draft
domain: shared-rings
screens: [s72, s73]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/shared-rings]
---

# Companies · Frontend Requirements

**Feature:** [[Companies]] · **Status:** Draft · **Story:** [[Companies Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build the screens in [[Companies Story]], and whether each need is met today. The business tables exist with no endpoints; the only parts that work are the shared-Rings list and reading a company Ring's projection.

## Per screen

### [[Screen Index#s72|s72]] My companies

- Needs: the businesses I am a member of (id, name, logo file id, industry, my role), pending company invitations, the two entry actions, the empty state.
- Source today: not yet. `GET /rings/shared-with-me` gives the `CORPORATE` Rings I am in but no business behind them; it cannot group Rings into companies.

### [[Screen Index#s73|s73]] Company detail

- Needs: one business with its tags, address, contact fields, links, about, files (name, mime type, size); the company Rings I am a live member of; the colleague count for owner / admin; *Leave company*.
- Source today: the Rings I am in: `GET /rings/shared-with-me` filtered client-side by `type === "CORPORATE"` and the company's Ring ids once T-029 provides them; each Ring's projection: `GET /views/ring/:ringId`; the roster count for an admin: `GET /rings/:ringId/members?status=ACTIVE` (`meta.total`). Business detail and leave: not yet.

### Company Ring from s73 ([[Screen Index#s14|s14]])

- Needs: the Ring's projection as a member sees it.
- Source today: `GET /views/ring/:ringId` ✅.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| List my companies with my role | — | ❌ | [[T-029 My companies and company detail]] |
| Company detail (facts, tags, files, its Ring ids) | — | ❌ | [[T-029 My companies and company detail]] |
| Leave a company | — | ❌ | [[T-029 My companies and company detail]] |
| Company Rings I am in (name, colour, `parentRingId`) | `GET /rings/shared-with-me` | ✅ | — |
| A company Ring's projection | `GET /views/ring/:ringId` | ✅ | — |
| Colleague count / roster for owner or admin | `GET /rings/:ringId/members` | ✅ | — |
| Member count on the Ring row itself | — | ❌ | [[T-004 Member count per Ring on list and detail]] |
| Pending company invitations, review, decline | — | ❌ | [[T-026 Ring invitations invite, review, decline]] |
| Join a company Ring with a code or work email | — | ❌ | [[T-027 Join a Ring with a code or verified work email]] |
| Business account setup creating the business Ring | — | ❌ | [[T-048 Business account setup → business Ring]] |
| Who administers a company Ring | — | ❌ | [[T-006 Delegated admin endpoints]] |
| Logo and file bytes | — | ❌ | [[T-062 Serve uploaded file bytes by id]] |

## Behaviour expectations

- Refetch / realtime: s72 refetches on screen focus (invitations and memberships change without any action of the viewer); s73 refetches after *Leave*. No polling.
- Caching keys: companies by (signed-in user); a company by (signed-in user, business id); the Ring projections by (viewer, ring id) as in [[View As & Pin Views Frontend]]. Invalidate the shared-Rings cache on leave.
- Pagination / ordering: companies `{ data, meta: { total } }`, ordered by name; Rings inside a company ordered parent first, then by name; files by name. `limit` ≤ 50.
- Role display: derive "owner / admin / member" from what T-029 returns, never from calling the roster for every Ring.
- Hidden counts: do not call `GET /rings/:ringId/members` speculatively for a plain member; call it only when the user is known to be owner or admin, and treat a 403 as "hide the count".

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_02` | the company Ring opened from s73 has expired: "This Ring has expired" and remove it from the section on next refetch |
| 404 | `E_RING_ACCESS_01` | not a member any more or blocked: same neutral message, remove the row |
| 403 | `E_RING_05` | roster requested without admin rights: hide the colleague count silently |
| 404 | `E_RING_02` | Ring id unknown to the caller: refetch s73 |
| 401 | `E_AUTH_04` | sign in again |
| — | business-specific codes | to be defined by T-029; branch on `statusCode` until [[T-063 Put the ErrorCode on the error body]] |

## Blocked by

- [[D-04 Ring settings]] — the colleague count and list for plain members ("members can see each other").
- [[T-029 My companies and company detail]] — the business ↔ Ring link that lets s72 group Rings under a company; every ❌ row above except invitations and setup.
- [[T-048 Business account setup → business Ring]] — the owner's path into s72; how team members are seeded into the employees Ring.
- [[T-063 Put the ErrorCode on the error body]] — the error table is by status until then.
