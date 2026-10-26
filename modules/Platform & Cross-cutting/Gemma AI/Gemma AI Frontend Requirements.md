---
type: frontend-requirements
code: gemma
scope: feature
feature: gemma
module: platform
status: draft
screens: [s13, s60]
created: 2026-10-18
updated: 2026-10-26
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Gemma AI · Frontend Requirements

> ⚠ Affected by [[D-06 Yearly rename, old name freed, case-insensitive]] (2026-10-25): ND-06 decided, a Pin name can be changed once a year, the old name is free at once, names ignore capitals, suggestions come only from the person's own name.

**Feature:** [[Gemma AI]] · **Status:** Draft · **Story:** [[Gemma AI Story]] · **API Integration:** not yet (backend not built)

What the client needs to build the Gemma sheet, Smart Match and the inline suggestions. Nothing is available; the schema fixes the vocabulary the client will see.

## Per screen

### [[Screen Index#s13|s13]] Gemma sheet

- Needs: a session for the current context (`contextType` and the Ring, meeting or event id); the message thread; suggestion cards with an `actionType`, a target, a `status` (`AWAITING_CONFIRMATION`, `CONFIRMED`, `EXECUTED`, `REJECTED`, `FAILED`) and a reason; confirm / reject per card; "Later".
- Source today: not yet.

### [[Screen Index#s60|s60]] Smart Match

- Needs: the match list for the current event with `strength` (`STRONG` | `GOOD` | `WEAK`), `reasons`, the matched person's perspective as the user may see it, and `status` (`SUGGESTED`, `VIEWED`, `ACTED_ON`, `DISMISSED`); "Request meeting"; a Pro lock for Free accounts.
- Source today: not yet.

### Inline suggestions (s06 Pin name, Ring name, bio; no screen of their own)

- Needs: a list of candidate strings for the field being typed, each pre-checked for availability where that applies.
- Source today: not yet; the Pin-name availability check (`GET /profiles/pin-name/:pinName/availability`, owned by [[Profiles & Pin Name]]) returns no suggestions by design.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Open a session, send a message, receive suggestion cards | — | ❌ | [[T-051 Gemma assistant sheet and suggestions]] (needs a model / provider decision) |
| Confirm or reject an AI action | — | ❌ | [[T-051 Gemma assistant sheet and suggestions]] |
| Smart Match list for an event; mark viewed / dismissed | — | ❌ | [[T-052 Smart Match]] (blocked on T-051 and [[T-036 Event mode exhibitors list and detail]]) |
| Auto-send meeting requests from matches (Pro) | — | ❌ | [[T-052 Smart Match]] via [[T-042 Meeting request, accept with slots, decline with reason]] |
| Pro gate on Smart Match and automation | — | ❌ | [[T-049 Subscription endpoints and a single Pro gate]] |
| Interests feeding matchmaking | — | ❌ | [[T-016 Interests vocabulary and my interests]] |
| Pin-name suggestions | — | ❌ | [[Pin name rules]] |

## Behaviour expectations

- Scoping: every suggestion, match and reason the client renders was already filtered by what the asking user may see; the client never fetches a matched person except through `/views`, so a person the user cannot see is a 404 there and the card must handle it.
- Confirmation: any action that changes a Ring or sends something arrives as `AWAITING_CONFIRMATION` and is executed only after the client posts a confirm; the client never performs the side effect itself.
- Refetch / realtime: refetch the session after each confirm; refetch Smart Match on entering event mode and after a request is sent. No streaming is specified.
- Caching keys: `gemma:session:{contextType}:{contextId}`; `smartMatch:{eventId}`; clear both on logout and on a Ring switch.
- Pagination / ordering: Smart Match ordered by `strength` then `score` descending; the paginated envelope `{ data, meta: { total } }` with `limit` ≤ 50 applies if the list is paginated.
- Pro: render the Smart Match entry for every user; the list for Pro only. The gate's error is not defined until T-049.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 403 | not defined yet (Pro gate, T-049) | upgrade prompt |
| 404 | `E_RING_ACCESS_*` on `/views` for a matched person who became invisible | drop the card; one generic message |
| 409 | not defined yet | action already confirmed or executed; refetch the session |

No Gemma codes exist yet. `ErrorCode` is not on the wire until [[T-063 Put the ErrorCode on the error body]] ships.

## Blocked by

- [[Pin name rules]] — the Pin-name suggestion row waits on it.
- [[T-051 Gemma assistant sheet and suggestions]] is ❓ (model and provider undecided); [[T-052 Smart Match]] is ⛔ behind it and T-036.
