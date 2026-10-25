---
type: story
code: subscription
scope: feature
feature: subscription
module: commerce
status: draft
screens: [s34, s70]
created: 2026-10-18
updated: 2026-10-18
tags: [story, story/draft, module/commerce, layer/business]
---

# Subscription (Free vs Pro) · User Story

**Feature:** [[Subscription (Free vs Pro)]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Subscription (Free vs Pro) Frontend Requirements]] · **API Integration:** not yet (backend not built)

A user meets a Pro lock somewhere in the app (a permanent QR on the badge, Smart Match, any-lounge access, Gemma automation) and lands on one subscription screen that explains the two plans and lets them go Pro. The lock itself is a server decision: `User.accountType` and a `Subscription` row exist in the schema, but there is no endpoint and no single gate yet, so no screen can show a truthful lock today.

## Persona

Any signed-in user (visitor or exhibitor) meeting a Pro gate: from the badge (s34), the event hub (s53) or Me (s68). The organizer is not a Pro customer in the app.

## Stories

### S1 · Meet a lock ([[Screen Index#s34|s34]])

**As a** Free user flipping my badge, **I want** to see that a permanent QR is a Pro feature and what it would give me, **so that** I decide with the value in front of me.

Acceptance criteria:
- [ ] The badge keeps working on Free with the 24 h rotating token; the lock is on "make this QR permanent" only ([[Badge & QR]]).
- [ ] The lock states the benefit in one line and "Get Pro" → [[Screen Index#s70|s70]]; it never blocks the badge itself.
- [ ] The lock is rendered from the account's plan as the server reports it, not from a client flag or a cached purchase.

### S2 · Subscription screen ([[Screen Index#s70|s70]])

**As a** user, **I want** Free and Pro side by side with the four Pro gates named, **so that** I know what changes.

Acceptance criteria:
- [ ] Pro gates listed exactly: Smart Match, any-lounge access at events, Gemma automation (auto-requests, suggestions), permanent QR. The AI assistant entry is Pro per the brief.
- [ ] Shows my current plan, renewal date and price ("Go Pro — $9 / month" in the design); on Pro, the primary action becomes "Manage".
- [ ] Reached from s34, s53 and s68; "Go Pro" returns to [[Screen Index#s68|s68]] on success, and the screen that sent the user now shows the feature unlocked.

### S3 · Go Pro ([[Screen Index#s70|s70]])

**As a** Free user, **I want** to subscribe in one step with the store or provider the app uses, **so that** the lock lifts immediately.

Acceptance criteria:
- [ ] One call starts the subscription; the receipt is stored server-side; the plan flips to Pro only when the server says so.
- [ ] Pending state while the provider confirms; a failed purchase leaves the user on Free with the reason.
- [ ] A second tap during pending is ignored; reopening s70 shows the pending state, not a second purchase.

### S4 · Gates lift everywhere ([[Screen Index#s53|s53]])

**As a** new Pro user at an event, **I want** Smart Match, lounges and Gemma automation to unlock without restarting, **so that** the upgrade is felt where it matters.

Acceptance criteria:
- [ ] After S3 the client refetches the account and every gated screen re-reads the plan; tiles on s53 lose their lock.
- [ ] Any-lounge access shows mini-events as owned with no price ([[Events During Story]] S7); Smart Match opens s60 ([[Gemma AI]]).
- [ ] A gate the server still refuses (403) is shown as locked even on Pro; the client never overrides the server.

### S5 · Cancel and lapse ([[Screen Index#s70|s70]])

**As a** Pro user, **I want** to cancel and keep Pro until the period ends, **so that** I am not cut off early.

Acceptance criteria:
- [ ] "Manage" offers cancel; the screen shows "Pro until <date>" afterwards; gates stay open until then.
- [ ] At lapse the plan returns to Free: the permanent QR stops being permanent (the token rotates again), Smart Match and any-lounge lock; nothing the user created is deleted.

## States and motion the design asks for

- State: locked (needs Pro), unlocked; purchase pending / failed / succeeded; "Pro until <date>" after cancel.
- Motion: on success, the lock on the originating screen dissolves in place; the badge flip (s34) shows the permanent QR without re-rendering the Ring.
- State: the "Upgrade access" tile on s53 distinguishes an event-level upgrade (an order, [[Payments & Orders Story]] S5) from Pro (a subscription).

## Rules the backend already enforces

- `User.accountType` is `FREE` or `PRO`; `Subscription` keeps one live row per owner and plan (partial unique index).
- Nothing reads `accountType` to gate a feature yet; the plan is to have one `ProGate` helper every gated feature calls ([[T-049 Subscription endpoints and a single Pro gate]]), so a gate is a server 403, never a client check.
- Gates named in the glossary and the brief: Smart Match, any-lounge access, Gemma automation, permanent QR ([[Glossary]]).
- The badge's 24 h rotation is the Free behaviour; permanent QR is the Pro behaviour of the same token ([[Badge & QR]], [[T-007 Issue and rotate the QR token for a Ring]]).
- Every visibility decision still goes through `RingAccessService`; Pro changes what features a user may use, never what a viewer may see of a profile ([[Ring Access Model]]).

## Open questions

- No decision note exists. Open points:
- [[T-049 Subscription endpoints and a single Pro gate]] — billing channel (app store vs the payment provider of [[T-047 Orders, payments and the provider webhook]]) and receipt storage; S3 and S5 depend on it.
- Whether the AI assistant entry on s53 ("AI assistant (Pro)" in the brief) is a gate of its own or part of "Gemma automation"; S2's list has four items until decided.
- Whether an exhibitor's business account carries its own plan or inherits the owner's.
