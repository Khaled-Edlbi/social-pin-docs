---
id: D-22
type: decision
status: decided
features: [profiles]
decision: ND-22
decidedBy: "khaled"
decidedAt: 2026-11-05
owner: ""
affects: ["S-14 Profiles & Pin Name Story", "FR-07 Profiles & Pin Name Frontend Requirements", "BD-07 Profiles & Pin Name Backend Delivery"]
related: ["ND-22 Public web page by Pin name", "D-06 Yearly rename, old name freed, case-insensitive", "ND-12 What the badge QR encodes", "S-19 View As & Pin Views Story", "F-18 Badge & QR"]
created: 2026-11-05
updated: 2026-11-05
tags: [decision, decision/decided]
---

# ⚖️ D-22 · The public page only says the Pin exists

**Answers:** [[ND-22 Public web page by Pin name]] · **Decided by:** khaled · **On:** 2026-11-05 · **Feature:** [[F-07 Profiles & Pin Name]]

> This card is the answer to [[ND-22 Public web page by Pin name]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-22 Public web page by Pin name]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 2.** `socialpin.me/<pinName>` is a real public web page, and it only says the Pin exists: the person's name and their Pin name, with "Open in Social Pin" (or "Get the app" where the app isn't installed). It shows **nothing from any Ring**, not the Public Ring either: seeing more takes the app, where the visitor gets the Ring they are in, or nothing ([[S-19 View As & Pin Views Story]]). A Pin name nobody holds answers with the same "not found" page as any other address.

**After a rename, [[D-06 Yearly rename, old name freed, case-insensitive]] stands:** the old address stops answering for the person at once, nothing redirects, and the old name is free for anyone to claim. The page then shows its new holder's name, if anyone claims it.

**The frontend builds the page, on `socialpin.me`**, reading a public look-up from the backend that returns the name and the Pin name only. It shares the domain and the app links with the badge QR links of [[ND-12 What the badge QR encodes]].

Ruled out: a page that shows the Public Ring (option 1), and no page at all (option 3); holding a freed name for a period, or a "this Pin was renamed" page.

## Why

- **It reveals nothing a Ring hasn't been chosen to show.** A browser visitor is in none of the owner's Rings, and the rule "the Ring you are in, or nothing" has no answer for them; a page with only the name and the Pin name needs none.
- **It keeps the rename risk small.** Because the page holds no Ring content, a printed or shared old address that a stranger later claims shows only the stranger's own name, never something the first holder shared. So D-06 needs no change.
- **It makes the s06 line true.** "Available — socialpin.me/<handle>" becomes an address that answers, so the line can be a link once the page is built.
- **One set-up for two needs.** The domain and the app links are the same ones the badge QR needs (ND-12), so the frontend builds them once.
- Chosen by khaled on 2026-11-05, as the PM recommended on ND-22.

## What it changes

- [[S-14 Profiles & Pin Name Story]]: S1's "socialpin.me/<handle>" line becomes a link once the page ships; the story is no longer blocked by ND-22. The page itself is new scope for the story, to be written as a part by the PM.
- [[FR-07 Profiles & Pin Name Frontend Requirements]]: needs the page (`socialpin.me/<pinName>`: name, Pin name, "Open in Social Pin", the not-found page) and the app links, and the public look-up it reads. Flagged for `/frontend`.
- [[BD-07 Profiles & Pin Name Backend Delivery]]: needs a public look-up by Pin name, with no sign-in, that returns the name and the Pin name only, and one not-found answer for a name nobody holds (no difference between "never existed" and "freed"). Flagged for `/backend`.

## Still open

- **The domain set-up itself** (`socialpin.me`, the app links on both platforms): who owns the domain and hosting, shared with [[ND-12 What the badge QR encodes]], which is not decided yet.
- **The page's look**: copy, the "Get the app" store links, the not-found page. A design task, not a decision.
- **The story part**: the PM adds the page to [[S-14 Profiles & Pin Name Story]] as a new part; product approves it.

## Log

- 2026-11-05 · flagged [[FR-07 Profiles & Pin Name Frontend Requirements]]: ND-22 decided: socialpin.me/<pinName> is a public page showing only the name, the Pin name and Open in Social Pin, built by the frontend on socialpin.me with the app links; add the page and the public look-up it reads; for /frontend
- 2026-11-05 · flagged [[BD-07 Profiles & Pin Name Backend Delivery]]: ND-22 decided: the public page needs a look-up by Pin name with no sign-in that returns the name and the Pin name only, one not-found answer for a name nobody holds; for /backend
