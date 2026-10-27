---
type: frontend-requirements
code: interests
scope: feature
feature: interests
module: platform
status: draft
screens: [s07, s71]
depends: []
affects: ["Interests Story"]
related: ["Auth & Sign-up", "Gemma AI", "T-051 Gemma assistant sheet and suggestions", "T-063 Put the ErrorCode on the error body"]
created: 2026-10-18
updated: 2026-10-27
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Interests · Frontend Requirements

**Feature:** [[Interests]] · **Status:** Draft · **Story:** [[Interests Story]] · **API Integration:** not yet (backend not built)

What the client needs for the two interest pickers: the vocabulary, the person's own selection, a way to replace it, and the two preferences s71 shows. The client already shows both screens with a sample vocabulary; nothing is saved: a pick made at sign-up is lost. The tables and the seed exist on the backend; the routes do not. In the MVP since 2026-10-26, because sign-up as designed has this step.

## Per screen

### [[Screen Index#s07|s07]] Interests (sign-up)

- Where it sits: **after** Claim your Pin (s06), so the account and the session already exist; saving needs no onboarding token.
- Needs: the vocabulary grouped by category (the design's groups: Work, Craft, Off the clock); "Continue · N picked"; "Skip" goes on with nothing saved.
- Copy: "Interests decide who Gemma suggests at events. They never appear on your badge."
- Source today: not yet. The client shows a sample vocabulary and keeps the picks in memory only.

### [[Screen Index#s71|s71]] Interests (from Me)

- Needs: the vocabulary; the saved selection pre-ticked; search over the vocabulary; "Save · N picked" and "Cancel".
- Also on the screen:
  - **Suggested from your Rings**: interests proposed from the person's own Rings.
  - Two switches: **"Use interests for event suggestions"** ("Recommend events that match, not just contacts") and **"Let Gemma add interests it notices"** ("From talks you save and people you meet").
- Copy: "Feeds Gemma's matching · never on your badge".
- Source today: not yet; sample picks and switches, not saved.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Vocabulary, `{ id, name, category }` (public reference data) | — | ❌ | [[Interests Story|Interests · S5]] (`GET /interests` proposed) |
| My selection | — | ❌ | [[Interests Story|Interests · S5]] (`GET /users/me/interests` proposed) |
| Replace my selection | — | ❌ | [[Interests Story|Interests · S5]] (`PUT /users/me/interests` proposed) |
| The two s71 switches (use for event suggestions, let Gemma add) | — | ❌ | no task yet: asked here, for Interests · S5 or a task of its own |
| Suggested from your Rings | — | ❌ | [[T-051 Gemma assistant sheet and suggestions]] (owned by [[Gemma AI]]) |
| Interests used in matchmaking | — | ❌ | [[T-051 Gemma assistant sheet and suggestions]] |

## Behaviour expectations

- **Sign-up saves at once.** s07's Continue sends the picks with `PUT` using the session from registration; Skip sends nothing. A failed save is retried in the background and never stops sign-up.
- **Refetch:** the vocabulary once per app version, shared by s07 and s71; "my selection" on entering s71 and after a save. No push.
- **Caching keys:** `interests:vocabulary` (long-lived; invalidate on app update); `interests:mine:{userId}` (invalidate on save and on sign-out).
- **Save semantics:** `PUT` replaces the whole selection with the list of interest ids, never a diff; ids only until Interests · S5 says whether a weight is accepted.
- **Search** runs on the client over the cached vocabulary; no search endpoint is needed while the vocabulary is small.
- **Ordering:** one unpaginated list ordered by category then name; if Interests · S5 pages it, the `{ data, meta: { total } }` envelope with `limit` ≤ 50 applies.
- **Privacy:** interests are shown on s07 and s71 only; never in a share payload, on a badge or on a perspective, even if a response carried them.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 400 | validation (string array) | an unknown interest id in the `PUT`: refetch the vocabulary and retry |
| 404 | not defined yet | an interest removed from the vocabulary: drop it and resave |
| 401 | `E_AUTH_04` | session gone: sign in again |

No interest codes exist yet; Interests · S5 adds any it needs. `ErrorCode` is not on the wire until [[T-063 Put the ErrorCode on the error body]] ships.

## Blocked by

- [[Interests Story|Interests · S5]] — s07 and s71 (vocabulary, selection, save). No decision needed.
- The two s71 switches have no task yet.
- "Suggested from your Rings" waits on [[T-051 Gemma assistant sheet and suggestions]].
