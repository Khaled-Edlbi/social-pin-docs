---
type: needs-decision
id: ND-21
status: open
features: [onboarding-imports]
blocks: [T-020b]
decider: "owner"
screens: [s03a, s03b]
affects: ["T-020b Business card scan and portfolio URL import", "Onboarding Imports"]
related: ["D-02 One main profile every Ring starts from", "D-03 Links entered once, switched on or off per Ring", "T-078 Main profile fields from D-02", "T-020 LinkedIn import → review → base profile", "Files Upload"]
created: 2026-10-26
owner: "Omar Fostok"
tags: [needs-decision, needs-decision/open]
---

# ❓ ND-21 · How a business card and a portfolio page are read

**Status:** open · **Decider:** owner · **Raised:** 2026-10-26 · **Needed by:** [[T-020b Business card scan and portfolio URL import]] · **Feature:** [[Onboarding Imports]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-21** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Two sign-up options on *Start from* (s03) need a way to turn something the person has into profile fields: **Scan a card** (s03a) takes a photo of their own business card, and **Portfolio URL** (s03b) takes the address of their own site. [[T-020b Business card scan and portfolio URL import]] can't be built, or even sized, until it is decided **where the reading happens** (on the phone, or on the server with a service) and **what it reads** from each. The answer decides whether the backend needs an endpoint and a paid provider at all, whether the card's photo ever leaves the phone, and how good the fields that reach the review step (s05) are.

## Notes

- Both imports end on the same review step as LinkedIn (s05) and write to the **main profile** ([[D-02 One main profile every Ring starts from]]), whose fields come with [[T-078 Main profile fields from D-02]]: full name, headline, role, company, location, photo, bio. Phone, email and links go where [[D-03 Links entered once, switched on or off per Ring]] puts them.
- Nothing is built on either side: the app shows s03a and s03b with sample data; the backend has no endpoint for either ([[Onboarding Imports Frontend Requirements]] rows "Card image recognition" and "Portfolio URL extraction", ❌).
- `POST /files` exists if an image has to reach the server ([[Files Upload]]); its bytes can't be read back yet (T-062), which doesn't matter for reading a card on the server.
- It is the person's **own** card and site. Whatever is read is a suggestion: nothing is saved until they confirm it on s05. Which fields an import may overwrite is the [[Onboarding Imports]] story's to say, not this card's.
- Since 2026-10-26 Onboarding Imports is in the **MVP**, so this decision is on the MVP path.

## Options

**Business card (s03a)**

1. **On the phone (recommended).** The phone's own text recognition reads the photo; the app splits the text into name, title, company, phone, email, website and shows them on s05. No backend endpoint, no provider, no cost per scan, works offline, and the photo never leaves the phone. Weaker on unusual layouts; the person corrects on s05.
2. **On the server, with a text-recognition service.** The photo goes up with `POST /files`; the backend sends it to an OCR service and returns candidate fields. Better on poor photos, but a paid provider, a new endpoint, and the card's image leaves the phone.
3. **On the server, with an AI model** that reads the image and returns the fields already sorted. Best at telling a title from a company, but the highest cost per scan and the same privacy trade as 2.

**Portfolio page (s03b)**

1. **The page's own metadata (recommended).** The backend fetches the address and reads what sites publish about themselves: title, description, the preview image, and a structured "person" block when there is one. Suggests headline, bio and photo; the address itself is kept as a link. Cheap and predictable; thin for sites that publish little.
2. **The page read by an AI model** into the profile fields. Richer suggestions, but a cost per import, slower, and harder to predict.
3. **Read nothing**: keep the address as a link only, no suggested fields. Simplest; then s03b imports nothing but the link.

The two halves can be decided separately (for example card 1 with portfolio 1).

## Responsible

The **owner** decides, before T-020b is sized; needs to hear from the backend (provider cost and limits for options 2 and 3) and the frontend (on-phone recognition for option 1). Raised by the PM from [[T-020b Business card scan and portfolio URL import]] on omar's request, 2026-10-26.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold decision ND-21 "<the answer>"`, fills the decision card D-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided 2026-10-26 by <who>: option <n>"; then `--impact D-NN` and flag the notes it lists)
