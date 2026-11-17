---
id: D-41
type: decision
status: decided
features: [discover-hub]
decision: ND-41
decidedBy: "Omar Fostok"
decidedAt: 2026-11-17
owner: "Omar Fostok"
affects: ["S-42 Discover Hub & Search Story", "FR-19 Discover Hub & Search Frontend Requirements", "BD-19 Discover Hub & Search Backend Delivery", "BI-19 Discover Hub & Search Backend Integration", "FD-18 Discover Hub & Search Frontend Delivery", "S-01 Account Story", "S-23 Connections Story", "F-19 Discover Hub & Search"]
related: ["ND-41 Who Discover finds by part of a Pin name", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "D-10 Connect sends what the requester already has", "F-14 Connections", "F-01 Account"]
created: 2026-11-17
updated: 2026-11-17
tags: [decision, decision/decided]
---

# ✅ D-41 · Discover searches people by part of their Pin name

**Answers:** [[ND-41 Who Discover finds by part of a Pin name]] · **Decided by:** Omar Fostok · **On:** 2026-11-17 · **Feature:** [[F-19 Discover Hub & Search]]

> This card is the answer to [[ND-41 Who Discover finds by part of a Pin name]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-41 Who Discover finds by part of a Pin name]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 2: in the MVP, Discover searches people by part of their Pin name. Anyone can be found unless they opt out.** This replaces [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]'s rule of "exact Pin name only, no partial match, nobody you aren't in a Ring of". The rest of D-37 (recent searches on the phone, Gemma and import contacts later) is unchanged.

1. **Search as you type:** by part of a Pin name, from 3 letters. 20 results per page; the next page loads at the bottom of the list.
2. **Who can be found:** anyone, unless they turn off **"Let people find me by Pin name"**, a new switch in Me › Privacy under PEOPLE, on by default. With it off, only people already in their Rings find them.
3. **Someone I'm not connected with** shows only their account name and photo (from sign-up, nothing from their Rings) and a **Connect** button. The row doesn't open their card.
4. **Someone who has me in one of their Rings:** a tap opens their card, as today.
5. **Connect** sends the normal connection request, and the button then reads **Requested**. Someone who asked me shows **"Asked to connect"** with **Accept**.
6. **Blocked people never appear,** whichever side blocked. I never see myself.
7. **No photo:** a person outline. **No name:** the Pin name is shown as the name.

**The design:** [Discover search, 8 screens](https://claude.ai/artifact/VtuKA2ezgz1snhMbBUmSbd). The screens are the hub, fewer than 3 letters, searching with a shimmer, results, the next page and Connect, no matches, no connection, and the Privacy switch.

## Why

- **The MVP needs a way to find people:** with exact names only, you can find just someone whose Pin name you already know.
- **Privacy is kept:** a stranger sees only the account name and photo, never what anyone shares in a Ring. Anyone can opt out with the switch.
- **Traded away:** a person is findable by default, and part of a name can surface people the searcher has never met.

## What it changes

- [[S-42 Discover Hub & Search Story]] (`/pm`): rewrite S1–S3 to rules 1–7 and the 8 screens. The partial search, the Connect states and the opt-out become MVP parts. The no-partial-match and no-autocomplete rules go.
- [[S-01 Account Story]] (`/pm`): the new "Let people find me by Pin name" switch on the Privacy screen, under PEOPLE, on by default.
- [[S-23 Connections Story]] (`/pm`): Connect from a search result sends the normal request. Requested and "Asked to connect" with Accept show in the result row.
- [[FR-19 Discover Hub & Search Frontend Requirements]] (`/frontend`): a search route with paging, the result row's states, and the switch. Back to draft.
- [[BD-19 Discover Hub & Search Backend Delivery]] and [[BI-19 Discover Hub & Search Backend Integration]] (`/backend`): a new search by part of a Pin name. It returns the account name and photo, the relationship state, and whether the row opens a card. It hides blocked people, opted-out people outside their Rings, and the searcher. The opt-out needs a new setting on the account. BI-19's "submit only, no partial match" rule no longer holds.
- [[FD-18 Discover Hub & Search Frontend Delivery]] (`/frontend`): what shipped at `778d9b4` is exact-name lookup on submit, which is now not the MVP's search.
- [[F-19 Discover Hub & Search]] (owner): release stays `mvp`; the product rules follow this card.

## Still open

- **Matching:** whether part of a name matches anywhere in the Pin name or only at the start, and in what order results come.
- **Typing an exact Pin name:** whether it still opens that Pin's card directly, or only lists it.
- **Recent searches:** whether they keep names opened from results, the typed text, or both.
- **Turning the switch off:** whether it applies at once to searches already open, and whether someone who has a pending request from me still finds me.
- **Abuse:** a rate limit on the search, so that walking through every 3-letter part can't list everyone.
- **The account name and photo:** whether the backend keeps them apart from the Ring profiles today (`/backend`).

## Log

- 2026-11-17 · raised [[ND-41 Who Discover finds by part of a Pin name]] and decided it in one step, on Omar Fostok's word: option 2 (rules 1–7, the design artifact)
- 2026-11-17 · flagged [[S-42 Discover Hub & Search Story]], [[S-01 Account Story]] and [[S-23 Connections Story]] (`/pm`); [[FR-19 Discover Hub & Search Frontend Requirements]] and [[FD-18 Discover Hub & Search Frontend Delivery]] (`/frontend`); [[BD-19 Discover Hub & Search Backend Delivery]] and [[BI-19 Discover Hub & Search Backend Integration]] (`/backend`); and [[D-37 Discover opens a Pin by its exact Pin name in the MVP]] as replaced in part
