---
type: frontend-requirements
code: onboarding-imports
scope: feature
feature: onboarding-imports
module: identity
status: draft
screens: [s01, s03, s03a, s03b, s04, s05]
depends: []
affects: ["Linked Accounts (OAuth) Story", "T-020 LinkedIn import → review → base profile", "T-020b Business card scan and portfolio URL import"]
related: ["D-02 One main profile every Ring starts from", "D-03 Links entered once, switched on or off per Ring", "ND-21 How a business card and a portfolio page are read", "Profiles & Pin Name Story", "Files Upload Story", "T-063 Put the ErrorCode on the error body", "Auth & Sign-up", "Files Upload", "Ring Projection"]
created: 2026-10-18
updated: 2026-10-27
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Onboarding Imports · Frontend Requirements

**Feature:** [[Onboarding Imports]] · **Status:** Draft · **Story:** [[Onboarding Imports Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend so the import steps of sign-up work as the design draws them. The client already shows every one of these screens, with sample data; nothing is imported and nothing they show is saved. In the MVP since 2026-10-26.

## How the imports fit sign-up

The client's sign-up runs Welcome → Verify → **Start from (s03)** → an import (**s04 / s03a / s03b** → **s05 Review**) or *Fill it in myself* → *Profile basics* → Claim your Pin (s06, where `complete-registration` creates the account) → Interests → First Ring.

The imports therefore run **before the account exists**: the client holds only the onboarding token from `verify-code`. The proposed split, so the backend needs no write that runs without a session:

1. **Before registration** the backend only **reads**: it returns candidate fields for an import, authorised by the onboarding token. Nothing is written to a profile.
2. The client holds the confirmed fields in memory, through *Profile basics* and s06.
3. **Right after `complete-registration`** the client writes them to the new main profile with `PATCH /profiles/:id` ([[Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]), and a link to the first Ring as [[D-03 Links entered once, switched on or off per Ring]] says.

If the backend prefers to write at registration instead (candidates confirmed into `complete-registration`), say so in the integration note and the client follows; the screens don't change.

## Per screen

### [[Screen Index#s01|s01]] Welcome · Continue with LinkedIn

- The same LinkedIn hand-off as s04, offered before an email or phone is typed. Whether LinkedIn can **create** the account (no email code) or only feeds an import after the code is [[Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]]'s to say; until then the client sends it to s03.

### [[Screen Index#s03|s03]] Start from

- Four choices: **Import from LinkedIn** (recommended), **Scan a business card**, **Portfolio URL**, **Fill it in myself**.
- Needs: nothing from the backend. A choice whose import isn't served yet shows "Coming soon" and stays tappable to *Fill it in myself*.

### [[Screen Index#s04|s04]] Importing (LinkedIn)

- Needs: start the LinkedIn OAuth hand-off with the scopes the design names (`openid · profile · email`), come back to the app, and receive the candidate fields.
- States: signing in with LinkedIn, reading photo and name, done; cancelled by the person; permission denied; LinkedIn unreachable; nothing returned. "Skip and fill it in myself" at any time.
- Copy: "Nothing saves until you review it."

### [[Screen Index#s03a|s03a]] Scan a card

- Needs: a photo of the person's own card turned into candidate fields (name, title, company, phone, email, website).
- **Where it is read is open:** [[ND-21 How a business card and a portfolio page are read]]. If the card is read **on the phone** (ND-21 option 1), the client needs no endpoint here. If it is read **on the server**, the client sends the photo with `POST /files` and asks for candidates by the file's id; the photo is deleted after the import.

### [[Screen Index#s03b|s03b]] Portfolio URL

- Needs: an address turned into candidate fields (headline, bio, photo) plus the address itself, kept as a link. Read on the server; what is read is [[ND-21 How a business card and a portfolio page are read]].

### [[Screen Index#s05|s05]] Review import

- Shows what came back as rows with a tick each (all ticked by default), every value editable: "Everything here is editable. Untick what you'd rather keep off your Pin."
- **Returned by LinkedIn** (as the design draws it): profile photo, full name (required), email (shown "verified"), language & country, the LinkedIn account link.
- **Not returned — add yourself** ("needs partner access"): headline & current role, company & industry, location, work history. The client collects these on *Profile basics*.
- Confirm: nothing is written here (see *How the imports fit sign-up*); the client keeps the ticked values for after registration.

## Field map

| Candidate field | Comes from | Written to, after registration | With |
|---|---|---|---|
| Full name | LinkedIn, card | the profile's `fullName` (same on every Ring) | `complete-registration` (`fullName`) |
| Photo | LinkedIn, portfolio | main profile photo (a file id) | `PATCH /profiles/:id` ([[Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]) |
| Headline / role | card, portfolio; typed for LinkedIn | main profile `headline` / `role` | Profiles & Pin Name · S9–S11 |
| Company | card; typed for LinkedIn | main profile `company` | Profiles & Pin Name · S9–S11 |
| Location | typed | main profile `location` | Profiles & Pin Name · S9–S11 |
| Bio | portfolio | main profile `bio` | Profiles & Pin Name · S9–S11 |
| LinkedIn account link, website | LinkedIn, card, portfolio | a link on the first Ring | the Ring's links ([[Ring Projection]]) per D-03 |
| Email, phone | LinkedIn, card | **not written**: the account keeps the email or phone it signed up with | — |
| Language & country | LinkedIn | the app's language on this phone only | — |

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Continue without an import (full name at registration) | `POST /auth/complete-registration` | ✅ | — (listed under [[Auth & Sign-up]]) |
| Pin-name step after the import | `GET /profiles/pin-name/:pinName/availability` | ✅ | — (listed under [[Profiles & Pin Name]]) |
| Carry a card photo to the server, if ND-21 says so | `POST /files` | ✅ | — ([[Files Upload]]) |
| LinkedIn OAuth start and callback back into the app, with the onboarding token | — | ❌ | [[Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]] |
| Candidate fields from LinkedIn (photo already stored as a file id, not a LinkedIn URL) | — | ❌ | [[T-020 LinkedIn import → review → base profile]] |
| Candidate fields from a card photo | — or ❌ | depends on ND-21 | [[T-020b Business card scan and portfolio URL import]] · [[ND-21 How a business card and a portfolio page are read]] |
| Candidate fields from a portfolio address | — | ❌ | [[T-020b Business card scan and portfolio URL import]] · [[ND-21 How a business card and a portfolio page are read]] |
| Main profile fields to write the confirmed values into | `PATCH /profiles/:id` (new fields) | ❌ | [[Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]] |
| Show the imported photo back | — | ❌ | [[Files Upload Story|Files Upload · showing files]] |

## Behaviour expectations

- **Read before, write after.** No import call writes to a profile; the only writes are after `complete-registration`, with the session, each field once.
- **Candidates live in memory only**, from s05 to the write after registration; never on disk. A relaunch before registration restarts from s03.
- **A failed write never undoes the account**: the confirmed values are retried on the next launch, and can be edited on Me.
- **Every import screen keeps "Skip and fill it in myself"**; the manual path never waits on an import call.
- **The onboarding token can run out** during a slow import: the client asks for a new code and goes back to Verify, keeping what was reviewed.
- **The photo** arrives as a file id the backend stored (from LinkedIn or the portfolio), so the client never downloads and re-uploads it.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| — | to be defined by Linked Accounts (OAuth) · S7 / T-020 / T-020b | LinkedIn cancelled or denied, nothing returned, page unreachable, unreadable card: "We couldn't read that. Fill it in yourself?" with the manual path |
| 401 | — (onboarding token expired) | a new code is sent; back to Verify, the review kept |
| 409 | `E_PROFILE_02` | on s06: "That Pin name is taken" |

Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint.

## Blocked by

- [[Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]] — s01's LinkedIn button and s04 can't start.
- [[T-020 LinkedIn import → review → base profile]] — s04's candidates and s05's LinkedIn rows.
- [[Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]] — nowhere to save headline, company, location, photo or bio after review.
- [[ND-21 How a business card and a portfolio page are read]] → [[T-020b Business card scan and portfolio URL import]] — s03a and s03b.
