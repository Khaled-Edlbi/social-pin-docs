---
type: frontend-requirements
code: delegated-admins
scope: feature
feature: delegated-admins
module: shared-rings
status: draft
screens: [s26, s27]
created: 2026-10-18
updated: 2026-10-26
tags: [frontend-requirements, frontend-requirements/draft, module/shared-rings, layer/frontend]
---

# Delegated Admins · Frontend Requirements

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

**Feature:** [[Delegated Admins]] · **Status:** Draft · **Story:** [[Delegated Admins Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build the screens in [[Delegated Admins Story]], and whether each need is met today. The engine already honours admins on every write; the list, add, change and remove calls do not exist.

## Per screen

### [[Screen Index#s26|s26]] Edit · access

- Needs: the Ring (done), the admins of this Ring with user id, level and the person's name / Pin name / avatar id, add an admin with a level, remove an admin, the owner-only visibility rule, the disabled audience settings, *Delete Ring*.
- Source today: `GET /rings/:id` and `PATCH /rings/:id` for the Ring fields; `DELETE /rings/:id`. Admin list, add, remove: not yet. Names for a user id: not yet.

### [[Screen Index#s27|s27]] Edit · permissions

- Needs: the level enum with a label per level, change an admin's level, the disabled "all settings" block.
- Source today: not yet. Levels known from the engine: `CONTENT_MANAGER`, `MEMBER_MANAGER`; the full enum ships with T-006.

### Admin's own view (journey through s26)

- Needs: which Rings I administer and at what level, so the client can show *Edit* on the right rows.
- Source today: not yet. `GET /rings/shared-with-me` lists Rings I am a member of, which is a different set; the client cannot tell an admin from a member without a call.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Edit Ring fields as owner or `CONTENT_MANAGER`+ | `PATCH /rings/:id` | ✅ | — |
| Read the Ring as owner | `GET /rings/:id` | ✅ | — |
| Delete the Ring (owner) | `DELETE /rings/:id` | ✅ | — |
| Manage members as owner or `MEMBER_MANAGER`+ | `GET / POST /rings/:ringId/members`, `PATCH / DELETE …/:userId`, `POST …/:userId/reassign` | ✅ | — |
| List admins of a Ring | — | ❌ | [[T-006 Delegated admin endpoints]] |
| Add an admin at a level | — | ❌ | [[T-006 Delegated admin endpoints]] |
| Change an admin's level | — | ❌ | [[T-006 Delegated admin endpoints]] |
| Remove an admin | — | ❌ | [[T-006 Delegated admin endpoints]] |
| Rings I administer, with my level | — | ❌ | [[T-006 Delegated admin endpoints]] |
| Names and avatars for admin rows, picker over my connections | — | ❌ | [[T-023 Connection detail and contacts list]] |
| Notify the person made admin | — | ❌ | [[T-045 NotificationService.emit and the inbox]] |
| Audience settings on s26 / s27 | — | ❌ | [[ND-04 Ring settings]] |
| Avatar bytes | — | ❌ | [[T-062 Serve uploaded file bytes by id]] |

## Behaviour expectations

- Refetch / realtime: the admin list refetches after every add, change or remove, and on screen focus. No polling; an admin learns of a level change on their next 403 or success.
- Caching keys: admins by (ring id); "Rings I administer" by (signed-in user). Invalidate the second on any admin write that targets the signed-in user (only possible from another device; refetch on focus covers it).
- Pagination / ordering: admins are a short list, owner first then by name; still expect `{ data, meta: { total } }`.
- Save semantics on s26: send only fields the backend has (`name`, `colorHex`, `style`, `startsAt`, `expiresAt`); never send the disabled settings, or `forbidNonWhitelisted` returns a 400.
- 403 handling for an admin: on `E_RING_05` hide the control that failed for this Ring for the rest of the session; do not retry.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 403 | `E_RING_05` | "Your role doesn't allow this" (admin below the needed level); hide the control |
| 404 | `E_RING_02` | not the owner's Ring (or deleted): close the editor |
| 409 | `E_RING_01` | renamed to a name already used by this owner: inline |
| 409 | `E_RING_04` | deleting the default Ring: "Choose another default first" |
| 400 | — | validation on unknown keys: should not happen once disabled settings are never sent |
| 401 | `E_AUTH_04` | sign in again |
| — | admin-specific codes | to be defined by T-006; branch on `statusCode` until [[T-063 Put the ErrorCode on the error body]] |

## Blocked by

- [[ND-04 Ring settings]] — the audience settings rows on s26 / s27.
- [[T-006 Delegated admin endpoints]] — all five admin rows above, including the level enum the s27 labels depend on.
- [[T-023 Connection detail and contacts list]] — the picker and the names on the rows.
- [[T-063 Put the ErrorCode on the error body]] — the error table is by status until then.
