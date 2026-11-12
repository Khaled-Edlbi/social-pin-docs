---
id: D-39
type: decision
status: decided
features: [companies]
decision: ND-39
decidedBy: "Omar Fostok"
decidedAt: 2026-11-11
owner: "Omar Fostok"
affects: ["S-29 Companies Story", "FR-15 Companies Frontend Requirements", "BD-15 Companies Backend Delivery", "FD-15 Ring Invitations & Join Frontend Delivery"]
related: ["ND-39 Whether the company domain and the title switch show in the MVP", "F-15 Companies"]
created: 2026-11-12
updated: 2026-11-12
tags: [decision, decision/decided]
---

# ✅ D-39 · The company domain and the title switch show in the MVP

**Answers:** [[ND-39 Whether the company domain and the title switch show in the MVP]] · **Decided by:** Omar Fostok · **On:** 2026-11-11 · **Feature:** [[F-15 Companies]]

> This card is the answer to [[ND-39 Whether the company domain and the title switch show in the MVP]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-39 Whether the company domain and the title switch show in the MVP]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: both are kept on purpose; they aren't hidden in the MVP.**

- Company detail ([[Screen Index#s73|s73]]) shows the subtitle "Verified · {domain}".
- My companies ([[Screen Index#s72|s72]]) shows the switch "Let {company} update my title".
- What they stand for (a real proof that the company owns its domain, and the company keeping my title current) starts right after the MVP.

## Why

- Kept on purpose on the owner's word, after the vault-vs-app review of 2026-11-11: the app already shows both.
- **Traded away:** in the MVP, "Verified" rests only on the domain matching the business's website.

## What it changes

- [[S-29 Companies Story]] (`/pm`):
  - P4: the switch is shown in the MVP, not hidden. Its effect starts right after the MVP.
  - P6: the subtitle reads "Verified · {domain}" in the MVP. A real proof of ownership follows right after.
  - The acceptance criteria that say "hidden" or "without *Verified*" change with them, and so does the table row for s72.
- [[FR-15 Companies Frontend Requirements]] (`/frontend`): both are on screen in the MVP.
- [[BD-15 Companies Backend Delivery]] (`/backend`): nothing new for the MVP. The proof of ownership and title updates come right after.
- [[FD-15 Ring Invitations & Join Frontend Delivery]] (`/frontend`): the app's s72 and s73 match. The open points against P4 and P6 close.

## Still open

- What the switch does in the MVP, before a company can update titles (for example, saved but with no effect yet): `/pm` writes it in P4.

## Log

- 2026-11-12 · flagged [[S-29 Companies Story]]: D-39: P4's "Let {company} update my title" and P6's "Verified · {domain}" are shown in the MVP (kept on purpose); what they stand for starts right after the MVP
- 2026-11-12 · flagged [[FR-15 Companies Frontend Requirements]]: the same; both are on screen in the MVP
- 2026-11-12 · flagged [[BD-15 Companies Backend Delivery]]: the same; nothing new for the MVP
- 2026-11-12 · flagged [[FD-15 Ring Invitations & Join Frontend Delivery]]: the same; s72 and s73 already match, the P4/P6 open points close
