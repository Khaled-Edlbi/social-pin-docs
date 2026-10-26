---
type: decision
id: D-03
decision: ND-03
status: decided
decidedBy: "molham"
decidedAt: 2026-10-25
features: [ring-projection, widgets]
affects: ["Ring Projection", "Widgets", "T-018 Widget CRUD on the projection", "T-058 Decide field library vs per-Ring copies"]
related: ["Field library vs per-Ring copies", "D-02 One main profile every Ring starts from"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-26
tags: [decision, decision/decided]
---

# ⚖️ D-03 · Links entered once, switched on or off per Ring

**Answers:** [[Field library vs per-Ring copies]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[Ring Projection]], [[Widgets]]

> This card is the answer to [[Field library vs per-Ring copies]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[Field library vs per-Ring copies]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option A on ND-03: one library of links, switched on or off per Ring.**

- A link (LinkedIn, a booking page, a phone number…) is **entered once**; editing it changes it in every Ring that shows it.
- A Ring can only switch a link **on or off**; a link never has a different value in different Rings. Someone who wants a work email for Clients and a personal one for Family enters two links and switches each on where it belongs.
- **Link types:** Facebook, Facebook page, WhatsApp, WhatsApp Business, Messenger, LinkedIn, Instagram, X, TikTok, Telegram, location, website, phone, email and custom links, as today, plus **booking, Behance, Dribbble, GitHub and YouTube**.
- **The type is detected from what is pasted**: the person pastes a link and the app recognises the service; a link it does not recognise is a website (or custom) link.

Option B (a copy per Ring with an "apply to all Rings" action) is ruled out.

Answered on the product-questions page, 2026-10-22, recorded on molham's word on 2026-10-25.

## Why

- s20 and s24 ("4 of 7 on") are drawn on a library; only option A lets that screen be built honestly.
- On/off only keeps one answer to "what is my LinkedIn" and avoids a link that silently differs between Rings; two different values are two links.
- Deciding now, before [[Widgets]] is built on the copy model, saves a second migration.
- Traded away: a migration (links and info blocks owned by the profile, a per-Ring visibility row) and a rewrite of the projection service, which the needs-decision card had already priced.

## What it changes

- [[Ring Projection]]: links (and info blocks) belong to the profile; each Ring holds only which of them are on. Hidden rows stay excluded by the query.
- [[Widgets]]: built on the library from the start; [[T-018 Widget CRUD on the projection]] is no longer waiting on this decision.
- [[T-058 Decide field library vs per-Ring copies]]: its decision is taken; the PM closes it.

## Still open

- Whether info blocks and files follow exactly the same on/off rule as links was not asked separately; the needs-decision card treated them as one library, and so does this answer unless product says otherwise.
- The order of links within a Ring (shared or per Ring) is the Ring Projection story's to say.
