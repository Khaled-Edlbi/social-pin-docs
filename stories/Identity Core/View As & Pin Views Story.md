---
type: story
id: view-as
feature: view-as
status: draft
domain: identity
screens: [s10, s31, s44]
updated: 2026-10-18
tags: [story, story/draft, domain/identity]
---

# View As & Pin Views · User Story

**Feature:** [[View As & Pin Views]] · **Status:** Draft (awaiting product sign-off) · **Requirements:** [[View As & Pin Views Requirements]] · **API Integration:** [[View As & Pin Views Frontend]]

Two people, one screen component. The owner flips to "View as" to see a Ring exactly as its members do: the "aha" that teaches the whole model. A viewer scans a badge or types a `!pinname` and gets the one perspective they are allowed, with no hint of which Ring that is or whether other Rings exist. Both render the same shape from the same route, which is what makes the preview trustworthy.

## Persona

A Ring owner in onboarding ([[Screen Index#s10|s10]]) or on Ring data flipping to the audience view ([[Screen Index#s31|s31]]); and a viewer, member or stranger, who just scanned a badge or looked up a handle ([[Screen Index#s44|s44]]).

## Stories

### S1 · View as teaser ([[Screen Index#s10|s10]])

**As a** new user **I want** to see my first Ring the way its audience will **so that** I understand what a Ring is before I reach Home.

Acceptance criteria:
- [ ] After s09, the teaser calls `GET /views/ring/:ringId` with the new Ring's id and renders the viewer shape with a "preview" frame and the Ring's colour.
- [ ] The copy explains: "This is what people in <Ring> see"; "Got it" lands on Home.
- [ ] The teaser works on a Ring with an empty projection: name from the profile, every other row "Not shared" or absent.

### S2 · View as, the flip ([[Screen Index#s31|s31]])

**As a** Ring owner **I want** to flip from my editor to the audience view and back **so that** I trust a Ring before I share it.

Acceptance criteria:
- [ ] "View as <Ring>" on s14 invalidates the cached view and calls `GET /views/ring/:ringId` with the owner's own Ring id; the response is byte for byte what a member gets.
- [ ] The flip is a perspective transition between "your view" and "their view", continuous and reversible; the audience view is clearly marked as a preview.
- [ ] Hidden rows and off toggles are absent; `null` reads "Not shared"; `displayName` is the Ring's or the profile's full name, never the nickname.
- [ ] A Ring selector lets the owner flip between their live Rings; an expired Ring reads "This Ring has expired" (404 `E_RING_ACCESS_02`) instead of a view.

### S3 · Scanned Pin from a badge ([[Screen Index#s44|s44]])

**As a** viewer **I want** a scanned badge to become the person's card **so that** I see what they chose to share with me.

Acceptance criteria:
- [ ] The scan resolves to `GET /views/ring/:ringId` (today the QR can only carry a Ring id; a rotating token is pending) and the detected code animates into the resolved profile card.
- [ ] The card shows `displayName`, `nickname`, `bio`, photo placeholder, links, info blocks, attachments (listed without download), widgets, and the sensitive rows only when not `null`.
- [ ] Any 404 reads "This profile isn't available to you", with no cause given.
- [ ] "Connect" and "Save for later" are shown; Connect is disabled until the connect flow exists.

### S4 · Open someone by Pin name ([[Screen Index#s44|s44]], reached from [[Screen Index#s38|s38]])

**As a** viewer **I want** to type `!sara` and get her profile **so that** I can find someone I met without a scan.

Acceptance criteria:
- [ ] `GET /views/pin/:pinName` without the `!`; the answer is the perspective of her default Ring if I am in it, else the oldest Ring of hers I can see.
- [ ] The same one-message 404 for "no such name", "not shared" and "blocked"; no retry hint differs by cause.
- [ ] My own handle renders my default Ring's view, which doubles as a quick self-check.

### S5 · Flip between the perspectives I hold (journey, no prototype screen)

**As a** viewer in several of one person's Rings **I want** to flip between them **so that** I see each side they gave me.

Acceptance criteria:
- [ ] `GET /views/user/:userId/perspectives` returns an array in a stable order (default Ring first, then oldest); the switcher labels them "View 1 / View 2" or by `themeConfig`, never by a Ring name.
- [ ] An empty array renders "Nothing shared with you", not an error.
- [ ] The person's `userId` comes from a connection or a scan payload, never from a view.

### S6 · An expired Ring has no preview (journey, [[Screen Index#s62|s62]])

**As a** Ring owner **I want** the post-event sheet to avoid a broken preview **so that** I can decide keep / merge / delete without a 404.

Acceptance criteria:
- [ ] s62 does not call `GET /views/ring/:id` on an expired Ring; it uses the Ring row and the owner projection instead.
- [ ] The owner's View as is offered only on live Rings.

### S7 · After the card: Connect or save (journey, [[Screen Index#s44|s44]])

**As a** viewer **I want** to ask for access or keep the card **so that** the encounter is not lost.

Acceptance criteria:
- [ ] "Save for later" keeps the handle locally and returns to Home; "Connect" waits on [[T-021 Connect request send, inbox, cancel]].
- [ ] Nothing in the saved card identifies the Ring or the owner's user id.

## States and motion the design asks for

- State ([[Wireframe Brief#QR scan|§4.5]]): scanning, no camera permission, invalid code, resolved profile; plus "not available" (one message), expired (owner only), preview frame.
- Motion: View as is a flip / perspective transition, continuous and reversible (signature motion 10); a scanned code animates into the resolved profile card (signature motion 5). Reduced motion: cross-fade.

## Rules the backend already enforces

- All three routes return `RingProfileViewEntity` and resolve access **first** through `RingAccessService`.
- `GET /views/pin/:pinName` looks up the normalised handle then `resolveDefaultAccess`: the owner's own Rings for the owner; otherwise, after the mutual-block check, the live Rings the viewer is a live member of, default first then oldest; the first is rendered. No profile, no live Ring or a block throw the **same** 404 `E_RING_ACCESS_01`, asserted by specs.
- `GET /views/ring/:ringId` uses `assertRingReadable`: not live is 404 `E_RING_ACCESS_02` (owner included); the owner passes; blocked or non-member gets the not-shared 404.
- `GET /views/user/:userId/perspectives` returns one projection per accessible Ring in order, an empty array when nothing is shared.
- Rendering goes through `selectRingProfileProjection` (hidden rows excluded) and `toView` (sensitive fields gated by `show*`). Nothing in the entity names the Ring, the owner's user id or the membership.

## Open questions

- No decision blocks the read path. The QR payload is a design gap: scanning is meant to resolve a rotating token ([[T-007 Issue and rotate the QR token for a Ring]], [[T-008 Resolve a scanned QR token]]); until then a Ring id in the QR is temporary.
