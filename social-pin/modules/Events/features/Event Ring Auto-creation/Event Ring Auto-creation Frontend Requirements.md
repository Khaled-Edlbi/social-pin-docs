---
type: frontend-requirements
code: event-ring-auto
scope: feature
feature: event-ring-auto
module: events
status: draft
screens: [s52]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/events, layer/frontend]
---

# Event Ring Auto-creation · Frontend Requirements

**Feature:** [[Event Ring Auto-creation]] · **Status:** Draft · **Story:** [[Event Ring Auto-creation Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build s52 and the two screens the granted Ring flows into, and whether each need is met today. The Ring lifecycle endpoints exist; the creation does not.

## Per screen

### [[Screen Index#s52|s52]] Event Ring granted

- Needs: the new Ring's `id`, `name`, `type` (`EVENT`), `isTemporary`, `startsAt`, `expiresAt`; the event's name and cover; a pending state while the Ring is not yet readable.
- Actions: Enter event mode (local active-Ring switch), See it in my Ring hub.
- Source today: not yet. The registration response ([[T-035 Registration transaction with order and payment]]) should return the Ring id, or the client filters `GET /rings?type=EVENT` for the newest Ring (available).

### [[Screen Index#s16|s16]] My Rings

- Needs: the Event Ring in the list with its window and temporary flag; "View as".
- Source today: `GET /rings` with the `type` and `isTemporary` filters; `GET /views/ring/:ringId` for the preview. Both available; the Ring row is not, until Event Ring Auto-creation · S6.

### [[Screen Index#s53|s53]] Event mode

- Needs: an existing Event Ring id to make active; everything else is [[Events During Frontend Requirements]].
- Source today: `GET /rings/:id` (available) once the Ring exists.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Create the Event Ring inside the registration transaction | — | ❌ | [[Event Ring Auto-creation Story|Event Ring Auto-creation · S6]] |
| Registration response carrying the Ring id | — | ❌ | [[T-035 Registration transaction with order and payment]] |
| List my Rings, including the Event Ring | `GET /rings` (`type`, `isTemporary` filters) | ✅ | — |
| Ring detail (name, window, flags) | `GET /rings/:id` | ✅ | — |
| Preview the Event Ring as a member sees it | `GET /views/ring/:ringId` | ✅ | — |
| Organizer / exhibitor side membership rules | — | ❌ | [[Event Ring Auto-creation Story|Event Ring Auto-creation · S6]] |
| Event pass bound to the Event Ring | — | ❌ | [[T-037 Event pass with a 60 s rotating code]] |
| Keep / merge / auto-delete after the event | `POST /rings/:id/disposition` | ✅ | — |

## Behaviour expectations

- Refetch / realtime: after a succeeded payment on s51, invalidate the Rings list and refetch `GET /rings` before showing s52. If the Ring is not in the list, poll the registration status (endpoint and interval set by T-035) and show the pending state; stop polling when the Ring appears or after a timeout the design must set.
- Caching keys: `rings:list` (per filter set), `ring:{id}`, `ringView:{id}`. Drop `ringView:{id}` at the Ring's `expiresAt`; nothing cached before expiry is valid after it.
- Pagination / ordering: `GET /rings` returns default first, then newest; the new Event Ring is therefore the first non-default row. The list honours `TABLE_MAX_LIMIT = 50`.
- Active Ring: client state only; persist the id per device so event mode survives a restart, and clear it when the Ring's `expiresAt` passes.
- Never call `POST /rings` with `type = EVENT`; the backend rejects it and the client has no legitimate reason to try.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 404 on `GET /rings/:id` | `E_RING_02` | "Setting up your Ring…" with retry (s52 pending state); after the timeout, "We could not find your Event Ring" with a link to My Rings |
| 404 on `GET /views/ring/:ringId` | `E_RING_ACCESS_02` | "This event has ended" and the disposition entry (s62) |
| 400 on `POST /rings` | `E_RING_01` | Never shown; the client does not make this call |
| registration pending / failed | to be defined by [[T-035 Registration transaction with order and payment]] | Stay on s51 with the payment state; do not open s52 |
| webhook late | to be defined by [[Payments & Orders Story|Payments & Orders · S7]] | s52 pending state |

## Blocked by

- No decision note. Upstream tasks:
- [[Event Ring Auto-creation Story|Event Ring Auto-creation · S6]] — waits on [[T-033 Events list, detail, schedule]]; every ❌ row above.
- [[T-035 Registration transaction with order and payment]] — waits on [[T-034 Tickets, packages, levels, sold-out]] and [[Payments & Orders Story|Payments & Orders · S7]] (payment provider undecided); the registration response and the pending-state polling.
- [[T-037 Event pass with a 60 s rotating code]] — waits on Event Ring Auto-creation · S6 and [[T-007 Issue and rotate the QR token for a Ring]].
