---
type: frontend-requirements
code: subscription
scope: feature
feature: subscription
module: commerce
status: draft
screens: [s34, s70]
created: 2026-10-18
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/commerce, layer/frontend]
---

# Subscription (Free vs Pro) · Frontend Requirements

**Feature:** [[Subscription (Free vs Pro)]] · **Status:** Draft · **Story:** [[Subscription (Free vs Pro) Story]] · **API Integration:** not yet (backend not built)

What the client needs to show the plan, sell Pro and render every Pro lock truthfully, and whether each need is met today. Nothing is available; the account entity carries no plan field on the wire yet.

## Per screen

### [[Screen Index#s34|s34]] Badge (flip)

- Needs: my plan (`FREE` / `PRO`) to decide whether "make permanent" is locked; the permanent QR itself on Pro.
- Source today: not yet ([[T-049 Subscription endpoints and a single Pro gate]] for the plan, [[T-007 Issue and rotate the QR token for a Ring]] for the token). The badge's Ring data is available ([[Badge & QR]]).

### [[Screen Index#s70|s70]] Subscription

- Needs: plan status (plan, started, renews or ends at, cancel pending), price and period, the list of gates (static copy), subscribe, cancel.
- Source today: not yet (T-049).

### [[Screen Index#s53|s53]] Event mode (locks)

- Needs: the plan to render locks on Smart Match, Lounges and the Gemma assistant; the server's 403 on a gated call as the source of truth.
- Source today: not yet (T-049; the gated features themselves are [[T-052 Smart Match]], [[T-040 Lounges and upgrades]], [[T-051 Gemma assistant sheet and suggestions]]).

### [[Screen Index#s68|s68]] Me / Account

- Needs: plan badge and the entry to s70.
- Source today: not yet (T-049).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| My subscription status (plan, dates, cancel pending) | — | ❌ | [[T-049 Subscription endpoints and a single Pro gate]] |
| Subscribe (start, store receipt) | — | ❌ | [[T-049 Subscription endpoints and a single Pro gate]] |
| Cancel at period end | — | ❌ | [[T-049 Subscription endpoints and a single Pro gate]] |
| One `ProGate` returning 403 on every gated call | — | ❌ | [[T-049 Subscription endpoints and a single Pro gate]] |
| Permanent QR on Pro | — | ❌ | [[T-007 Issue and rotate the QR token for a Ring]] |
| Any-lounge access on Pro | — | ❌ | [[T-040 Lounges and upgrades]] |
| Smart Match on Pro | — | ❌ | [[T-052 Smart Match]] |
| Gemma automation on Pro | — | ❌ | [[T-051 Gemma assistant sheet and suggestions]] |
| Billing channel and receipts | — | ❌ | [[T-049 Subscription endpoints and a single Pro gate]] (channel undecided; see [[T-047 Orders, payments and the provider webhook]]) |

## Behaviour expectations

- Refetch / realtime: fetch the subscription status at sign-in and on app foreground; refetch after subscribe or cancel and poll while pending (interval set by T-049). Every gated screen reads the plan from the one cached status, and treats a 403 from a gated call as "locked" regardless of the cached plan.
- Caching keys: `subscription:mine` (one key, invalidated on any plan change and at `renewsAt` / `endsAt`); gated features keep their own keys and drop them on a plan change.
- Pagination / ordering: none; one status object. Receipts, if listed, newest first.
- Idempotency: one subscribe call per attempt with a client key; the button is disabled while pending; a store purchase that completes after the app was closed is reconciled on the next status fetch.
- Copy: the gate list on s70 is static client copy (Smart Match, any-lounge access, Gemma automation, permanent QR) and must match [[Glossary]]; the price comes from the server or the store, never hard-coded beyond the design's placeholder.
- Never gate on the client alone: a lock is shown from the plan, but the feature call is still made and its 403 is the final answer.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 403 on any gated call (Free account) | to be defined by [[T-049 Subscription endpoints and a single Pro gate]] | Lock with the one-line benefit and "Get Pro" → s70 |
| 409 already subscribed | to be defined by [[T-049 Subscription endpoints and a single Pro gate]] | Refetch status, show "Manage" |
| 402 / store purchase failed | to be defined by [[T-049 Subscription endpoints and a single Pro gate]] | Failed state with the reason; stay on Free |
| 409 cancel when no live subscription | to be defined by [[T-049 Subscription endpoints and a single Pro gate]] | Refetch status |
| 401 | `E_AUTH_04` | Sign in again; return to s70 |

## Blocked by

- No decision note. Upstream tasks:
- [[T-049 Subscription endpoints and a single Pro gate]] — every row above; the billing channel is undecided within it.
- [[T-007 Issue and rotate the QR token for a Ring]] — the permanent QR on s34.
- [[T-040 Lounges and upgrades]], [[T-052 Smart Match]], [[T-051 Gemma assistant sheet and suggestions]] — the gated features the locks sit on; each waits on T-049.
