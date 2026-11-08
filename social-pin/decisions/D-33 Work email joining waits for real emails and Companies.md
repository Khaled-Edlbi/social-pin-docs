---
id: D-33
type: decision
status: decided
features: [ring-invitations]
decision: ND-33
decidedBy: "Omar Fostok"
decidedAt: 2026-11-08
owner: "Omar Fostok"
affects: ["S-33 Ring Invitations & Join Story", "FR-17 Ring Invitations & Join Frontend Requirements", "BD-17 Ring Invitations & Join Backend Delivery", "S-29 Companies Story"]
related: ["ND-33 When a work email is checked", "F-17 Ring Invitations & Join", "F-15 Companies", "S-78 Code Delivery Story", "D-04 Ring settings at launch and their defaults", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "D-32 Several join codes per Ring"]
created: 2026-11-08
updated: 2026-11-08
tags: [decision, decision/decided]
---

# ✅ D-33 · Work email joining waits for real emails and Companies

**Answers:** [[ND-33 When a work email is checked]] · **Decided by:** Omar Fostok · **On:** 2026-11-08 · **Feature:** [[F-17 Ring Invitations & Join]]

> This card is the answer to [[ND-33 When a work email is checked]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-33 When a work email is checked]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Not now.** Joining a company Ring with a verified work email ([[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S4]]) is **left out of this version**. Neither of ND-33's options is chosen yet.

- **It waits on two things:**
  - **real emails:** a code sent to the address, which [[S-78 Code Delivery Story|Code Delivery]] builds; today codes only ride in `devCode`;
  - **the company's work-email domain** on a Ring, from [[S-29 Companies Story|Companies · S12]].
- **Until then S4 stays hidden in the app:** s74 offers no work-email way in, and nothing names it as "coming soon".
- **When both exist,** a **new needs-decision card** settles whether the address is checked **once at joining** or **again every 12 months**, starting from ND-33's notes and options (ND-33 recommended once, at joining).

The other ways in are not affected: invitations ([[D-31 An invitation is its own record]]) and join codes ([[D-32 Several join codes per Ring]]) go ahead without it.

## Why

- **The check can't be real yet.** With no email sent, the code would come back through the same stand-in as sign-in's `devCode`, so anyone could "verify" any address. A proof that proves nothing shouldn't open a company Ring.
- **The domain it checks against doesn't exist yet:** it comes with Companies.
- **Leaving the question open would block the whole story.** S-33 would stay blocked for a part nobody can build now; deciding "later" lets invitations, codes and approvals move.
- **Traded away:** a company can't let employees join by work address in this version; it hands out a join code or sends invitations instead.

## What it changes

- [[S-33 Ring Invitations & Join Story]] (`/pm`): S4 is marked **not in this version**, waiting on [[S-78 Code Delivery Story]] and [[S-29 Companies Story|Companies · S12]]. s74 and s72's "Join a company Ring" list only the ways that exist (invitation, code), not "work email". The ND-33 line under *Open questions* points here.
- [[FR-17 Ring Invitations & Join Frontend Requirements]] (`/frontend`): no work-email rows in this version; the work-email verification need is listed as later.
- [[BD-17 Ring Invitations & Join Backend Delivery]] (`/backend`): nothing to build for work email now; no verification route, no address on the membership.
- [[S-29 Companies Story]] (`/pm`):
  - S12's work-email domain no longer has a join flow behind it in this version;
  - "Verified email" on Company detail and P5's "the work email I verified stops counting" apply only once work-email joining exists;
  - the *Join a company Ring* hint ("Invite code, work email or a QR from a colleague") drops "work email" until then.

## Still open

- **Once or every 12 months:** on a new needs-decision card, raised when Code Delivery and the work-email domain both exist.
- Whether the verified address can be offered to the person's profile: part of that card.

## Log

- 2026-11-08 · flagged [[S-33 Ring Invitations & Join Story]]: ND-33 decided "not now": work-email joining (S4) left out of this version, hidden in the app, waits on Code Delivery and Companies S12; a new card decides once vs yearly later
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: the same; no work-email rows in this version
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: the same; nothing to build for work email now
- 2026-11-08 · flagged [[S-29 Companies Story]]: work-email joining is not in this version; S12's domain has no join flow yet; "Verified email" and P5's rule apply once it exists
