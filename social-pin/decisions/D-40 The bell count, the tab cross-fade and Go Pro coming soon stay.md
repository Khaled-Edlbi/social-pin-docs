---
id: D-40
type: decision
status: decided
features: [app-shell, subscription]
decision: ND-40
decidedBy: "Omar Fostok"
decidedAt: 2026-11-11
owner: "Omar Fostok"
affects: ["S-73 App Shell & Onboarding Narrative Story", "FR-29 App Shell & Onboarding Narrative Frontend Requirements", "S-71 Subscription (Free vs Pro) Story", "FR-28 Subscription (Free vs Pro) Frontend Requirements", "BD-28 Subscription (Free vs Pro) Backend Delivery", "S-96 Notifications Story", "FR-39 Notifications Frontend Requirements"]
related: ["ND-40 Which app choices the MVP keeps as they are", "F-29 App Shell & Onboarding Narrative", "F-28 Subscription (Free vs Pro)", "F-39 Notifications"]
created: 2026-11-12
updated: 2026-11-12
tags: [decision, decision/decided]
---

# ✅ D-40 · The bell count, the tab cross-fade and Go Pro coming soon stay

**Answers:** [[ND-40 Which app choices the MVP keeps as they are]] · **Decided by:** Omar Fostok · **On:** 2026-11-11 · **Feature:** [[F-29 App Shell & Onboarding Narrative]], [[F-28 Subscription (Free vs Pro)]]

> This card is the answer to [[ND-40 Which app choices the MVP keeps as they are]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-40 Which app choices the MVP keeps as they are]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: all three are kept on purpose, as the app has them.**

- **The bell on Home shows a count.** The notifications feature comes later.
- **A tab change cross-fades.** It doesn't slide.
- **"Go Pro" on Subscription ([[Screen Index#s70|s70]]) stays "coming soon", with no price.** It doesn't buy anything in the MVP.

## Why

Kept on the owner's word, after the vault-vs-app review of 2026-11-11: the app already does all three.

## What it changes

- [[S-73 App Shell & Onboarding Narrative Story]] (`/pm`):
  - S5's bell criterion: it shows a count, and no longer "no number until F-39 ships".
  - Tab changes cross-fade, and no longer slide along a horizontal axis.
- [[FR-29 App Shell & Onboarding Narrative Frontend Requirements]] (`/frontend`): the same two changes.
- [[S-71 Subscription (Free vs Pro) Story]] (`/pm`):
  - S2 shows "Go Pro" as "coming soon", with no price.
  - S3's purchase isn't in the MVP.
- [[FR-28 Subscription (Free vs Pro) Frontend Requirements]] (`/frontend`): the same; no purchase call in the MVP.
- [[BD-28 Subscription (Free vs Pro) Backend Delivery]] (`/backend`): no purchase needed for the MVP.
- [[S-96 Notifications Story]] (`/pm`) and [[FR-39 Notifications Frontend Requirements]] (`/frontend`): the bell's count is on Home before the notifications list ships.

## Still open

- **Where the bell's count comes from** while notifications aren't there, for example pending connection requests: `/pm` writes it in S-73.
- **[[F-39 Notifications]] still has `release: mvp`,** while this decision says the notifications feature comes later. The owner moves it if it should be `v1`.

## Log

- 2026-11-12 · flagged [[S-73 App Shell & Onboarding Narrative Story]]: D-40: the Home bell shows a count before F-39 ships; tab changes cross-fade, not slide
- 2026-11-12 · flagged [[FR-29 App Shell & Onboarding Narrative Frontend Requirements]]: the same
- 2026-11-12 · flagged [[S-71 Subscription (Free vs Pro) Story]]: D-40: "Go Pro" on s70 is "coming soon" with no price; no purchase in the MVP
- 2026-11-12 · flagged [[FR-28 Subscription (Free vs Pro) Frontend Requirements]]: the same
- 2026-11-12 · flagged [[BD-28 Subscription (Free vs Pro) Backend Delivery]]: the same; no purchase for the MVP
- 2026-11-12 · flagged [[S-96 Notifications Story]]: D-40: the Home bell shows a count before the notifications list ships
- 2026-11-12 · flagged [[FR-39 Notifications Frontend Requirements]]: the same
