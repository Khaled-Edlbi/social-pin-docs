---
type: requirements
id: onboarding-imports
feature: onboarding-imports
status: draft
domain: identity
screens: [s03, s03a, s03b, s04, s05]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/identity]
---

# Onboarding Imports · Frontend Requirements

**Feature:** [[Onboarding Imports]] · **Status:** Draft · **Story:** [[Onboarding Imports Story]] · **API Integration:** not yet (backend not built)

What the client needs to build the import screens of onboarding, and the fact that none of it is served today. The only calls these screens can make now are the fallbacks into [[Auth & Sign-up Frontend]] and [[Profiles & Pin Name Frontend]].

## Per screen

### [[Screen Index#s03|s03]] Start from

- Needs: nothing from the backend; a static chooser. Which options are enabled is a build-time flag until the imports exist.
- Source today: none needed.

### [[Screen Index#s04|s04]] Importing

- Needs: start a LinkedIn OAuth hand-off; receive candidate fields (avatar, full name, headline, company, location, links) for review.
- States: waiting, cancelled, failed, permissions denied, nothing returned.
- Source today: not yet.

### [[Screen Index#s03a|s03a]] Scan a card

- Needs: send a card image, receive candidate fields.
- Source today: not yet. `POST /files` accepts the image, but nothing reads it.

### [[Screen Index#s03b|s03b]] Portfolio URL

- Needs: send a URL, receive candidate fields.
- Source today: not yet.

### [[Screen Index#s05|s05]] Review import

- Needs: a confirm call that writes the included fields to the base profile and the first Ring's projection in one transaction; the profile does not exist yet at this point of the flow (it is created by `complete-registration`), so the order of operations is itself an open design question for the task.
- Source today: not yet. The fallback writes `fullName` through `POST /auth/complete-registration`.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Continue without an import (full name at registration) | `POST /auth/complete-registration` | ✅ | — (listed under [[Auth & Sign-up]]) |
| Pin-name step after the import | `GET /profiles/pin-name/:pinName/availability` | ✅ | — (listed under [[Profiles & Pin Name]]) |
| LinkedIn OAuth start / callback | — | ❌ | [[T-019 LinkedIn OAuth link, unlink, login]] |
| Candidate fields from LinkedIn | — | ❌ | [[T-020 LinkedIn import → review → base profile]] |
| Confirm the reviewed fields into the base profile and first Ring | — | ❌ | [[T-020 LinkedIn import → review → base profile]] |
| Base profile fields to write into (headline, company, location, photo, bio) | — | ❌ | [[D-02 Base profile work fields]] |
| Card image recognition | — | ❌ | [[T-020b Business card scan and portfolio URL import]] |
| Portfolio URL extraction | — | ❌ | [[T-020b Business card scan and portfolio URL import]] |

## Behaviour expectations

- Refetch / realtime: none today. When the import exists, the candidate set is fetched once per hand-off and held in memory until confirm or skip; a relaunch restarts from s03.
- Caching keys: none. Candidate fields are never persisted on the device.
- Pagination / ordering: none; the candidate set is small and ordered by the review screen's fixed field order.
- Writes: a single confirm request carrying only included fields, so a half-reviewed import is never written. Edits made inline are sent as the field value, not as a diff.
- Fallback: every screen keeps a route to s06; the manual path must not depend on any import call.
- Onboarding token: the review step runs before `complete-registration`, so the client holds only the onboarding token. The task must decide whether confirm accepts that token or runs after the session exists.
- Images: a card photo is a temporary file; if `POST /files` is used to carry it, delete it after the import completes.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| — | — | no import codes exist yet; they will be defined by [[T-020 LinkedIn import → review → base profile]] |
| 409 | `E_PROFILE_02` | on the fallback s06: "That Pin name is taken" |
| 400 | `E_AUTH_05` | onboarding token expired during a long import: back to s02 |

Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint.

## Blocked by

- [[D-02 Base profile work fields]] — s05 has nowhere to write headline, company, location, photo or bio.
- [[T-019 LinkedIn OAuth link, unlink, login]] — s04 cannot start.
- [[T-020 LinkedIn import → review → base profile]] — s04 and s05.
- [[T-020b Business card scan and portfolio URL import]] — s03a and s03b, waiting on a provider decision.
