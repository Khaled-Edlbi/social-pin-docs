---
type: frontend-requirements
code: interests
scope: feature
feature: interests
module: platform
status: draft
screens: [s07, s71]
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Interests · Frontend Requirements

**Feature:** [[Interests]] · **Status:** Draft · **Story:** [[Interests Story]] · **API Integration:** not yet (backend not built)

What the client needs for the two interest pickers: the vocabulary, the user's own selection, and a way to replace it. The tables and the seed exist; the three endpoints do not.

## Per screen

### [[Screen Index#s07|s07]] Interests (onboarding)

- Needs: the vocabulary as `{ id, name, category }` grouped by `category`; the user's selection (empty on first run); "Continue · N picked" and "Skip" → s08.
- Source today: not yet. The vocabulary is seeded in the database but has no route.

### [[Screen Index#s71|s71]] Interests (from Me)

- Needs: the vocabulary; the saved selection pre-applied; "Save · N picked" and "Cancel" → s68.
- Source today: not yet.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Vocabulary (public reference data) | — | ❌ | [[T-016 Interests vocabulary and my interests]] (`GET /interests` proposed) |
| My selection | — | ❌ | [[T-016 Interests vocabulary and my interests]] (`GET /users/me/interests` proposed) |
| Replace my selection | — | ❌ | [[T-016 Interests vocabulary and my interests]] (`PUT /users/me/interests` proposed) |
| Interests used in matchmaking | — | ❌ | [[T-051 Gemma assistant sheet and suggestions]] (owned by [[Gemma AI]]) |

## Behaviour expectations

- Refetch / realtime: fetch the vocabulary once per app version and reuse it across s07 and s71; fetch "my selection" on entering s71 and after a save. No push.
- Caching keys: `interests:vocabulary` (long-lived, reference data, seeded; invalidate on app update); `interests:mine:{userId}` (invalidate on save and logout).
- Save semantics: `PUT` replaces the whole selection with the list of interest ids; send the full list, not a diff. Whether `weight` is accepted is for T-016 to state; the client should send ids only until then.
- Pagination / ordering: the vocabulary is small reference data; assume one unpaginated list ordered by `category` then `name`. If T-016 paginates it, the `{ data, meta: { total } }` envelope with `limit` ≤ 50 applies.
- Privacy: never send interests to any screen other than s07 and s71, never include them in a share payload, and never render them on a perspective even if a future response carried them.
- Onboarding: the step is optional; the sign-up transaction (`complete-registration`) does not touch interests, so saving on s07 is a separate call made with the session issued at the end of registration, after s08 is reached. If product wants interests saved before the session exists, T-016 must say how.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 400 | validation (string array) | an unknown interest id in the PUT body; refetch the vocabulary and retry |
| 401 | `E_AUTH_04` | session gone: sign in again |
| 404 | not defined yet | interest id removed from the vocabulary: drop it and resave |

No interest codes exist yet; T-016 adds any it needs. `ErrorCode` is not on the wire until [[T-063 Put the ErrorCode on the error body]] ships.

## Blocked by

- No decision. [[T-016 Interests vocabulary and my interests]] is To do; it unblocks [[T-051 Gemma assistant sheet and suggestions]].
