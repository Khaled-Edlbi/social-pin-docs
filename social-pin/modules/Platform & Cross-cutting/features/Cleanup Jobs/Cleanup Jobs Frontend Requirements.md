---
type: frontend-requirements
code: cleanup-jobs
scope: feature
feature: cleanup-jobs
module: platform
status: draft
screens: []
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Cleanup Jobs · Frontend Requirements

**Feature:** [[Cleanup Jobs]] · **Status:** Draft · **Story:** [[Cleanup Jobs Story]] · **API Integration:** not yet (backend not built)

What the client depends on from the sweepers: that they never remove something a screen still shows as current, and that the statuses they write are values the client already renders. There is no screen and no endpoint.

## Per screen

### No screen

- Needs: nothing rendered. The jobs are invisible; their effects show up in lists the client already fetches.
- Source today: none. `GET /rings` already returns `status` with `EXPIRED` in `RING_STATUS` ([[Frontend Contract]]); the client should render that value now, since a job will start setting it.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| AUTO_DELETE Rings removed; recipients and expired codes purged; EXPIRED materialised | — (scheduled, no route) | ❌ | [[Cleanup Jobs Story|Cleanup Jobs · S4]] |

## Behaviour expectations

- The disposition the job acts on is set by the owner through `POST /rings/:id/disposition`, which exists and is owned by [[Rings]]; this feature adds no route of its own.
- Refetch / realtime: a Ring deleted by the job disappears from `GET /rings` on the next fetch; the client must tolerate a 404 on `GET /rings/:id` for an id it cached after the owner chose `AUTO_DELETE`.
- The client must never assume a Ring is gone because its window lapsed: until the owner picks a disposition it is `UNDECIDED` and stays listed, and even `AUTO_DELETE` waits for the job.
- Guarantee the client needs: a job must not delete `PincastRecipient` rows that the PinCast results screen ([[Screen Index#s42|s42]], owned by [[PinCast & Nearby]]) still shows; the retention window must be longer than the period in which results are reachable, and is not yet stated.
- Statuses: `EXPIRED` is a reporting value. Access is decided live, so the client must not gate any action on it; expired Rings stay editable by the owner.
- Caching keys: none specific. Invalidate the Rings list cache when the owner sets a disposition.
- Pagination / ordering: none.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 on `GET /rings/:id` | `E_RING_02` (not on the wire until [[T-063 Put the ErrorCode on the error body]]) | "This Ring was deleted"; remove it from local state |

## Blocked by

- No decision. [[Cleanup Jobs Story|Cleanup Jobs · S4]] is To do; the recipient retention window must be set when it ships.
