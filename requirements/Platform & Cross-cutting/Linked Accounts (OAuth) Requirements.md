---
type: requirements
id: linked-accounts
feature: linked-accounts
status: draft
domain: platform
screens: [s01, s04, s68]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/platform]
---

# Linked Accounts (OAuth) · Frontend Requirements

**Feature:** [[Linked Accounts (OAuth)]] · **Status:** Draft · **Story:** [[Linked Accounts (OAuth) Story]] · **API Integration:** not yet (backend not built)

What the client needs for the LinkedIn button, the return into Importing, and the linked-accounts section on Me. No OAuth route exists; the table does.

## Per screen

### [[Screen Index#s01|s01]] Welcome

- Needs: a hand-off URL or client id for the provider; a redirect or deep link the app receives on return; states in progress, cancelled, failed, denied.
- Source today: not yet. Email and Phone on the same screen are served by `POST /auth/sign-up` and `POST /auth/login`, owned by [[Auth & Sign-up]].

### [[Screen Index#s04|s04]] Importing

- Needs: confirmation that the identity is linked; the imported field set (avatar, name, headline, company, location) to animate in; "Skip and fill it in myself" → s06.
- Source today: not yet. The review step and the write into the base profile belong to [[Onboarding Imports]] ([[T-020 LinkedIn import → review → base profile]]).

### [[Screen Index#s68|s68]] Me / Account

- Needs: the list of identities (`provider`, `email` when known, `createdAt`); "Link" per provider; "Unlink" per row; a reason when unlink is refused.
- Source today: not yet. `GET /users/me`, owned by [[Account]], does not include identities.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Start the LinkedIn OAuth hand-off | — | ❌ | [[T-019 LinkedIn OAuth link, unlink, login]] |
| Callback writing `SocialIdentity` | — | ❌ | [[T-019 LinkedIn OAuth link, unlink, login]] |
| List my linked identities | — | ❌ | [[T-019 LinkedIn OAuth link, unlink, login]] |
| Link / unlink a provider from Me | — | ❌ | [[T-019 LinkedIn OAuth link, unlink, login]] |
| Log in with a linked provider | — | ❌ | [[D-01 Passwordless login]] then [[T-019 LinkedIn OAuth link, unlink, login]] |
| Import the provider profile into the base profile | — | ❌ | [[T-020 LinkedIn import → review → base profile]] (owned by [[Onboarding Imports]]) |

## Behaviour expectations

- Hand-off: open the provider in the system browser or an auth session, carry a one-time state value, and accept the return only when the state matches; the client never handles provider secrets.
- Return: on success go to s04 for a new user or s68 for a link; on cancel, failure or denial return to the originating screen with one message and no retry loop.
- Refetch / realtime: refetch the identity list after link and unlink; nothing else changes it.
- Caching keys: `linkedAccounts:{userId}`; clear on logout.
- Pagination / ordering: none; a user holds a handful of identities, ordered by `createdAt`.
- Sign-up path today: after a successful hand-off the user still goes through the Pin name and password steps, because `complete-registration` requires both; the client must not promise "no password" on s01 until D-01 is decided.
- Multiple identities per provider type are allowed by the schema (unique per provider user id, not per user); render them as separate rows.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| provider error | — | cancelled / failed / denied: one message on s01 or s68 |
| 409 | not defined yet | identity already linked to another account: one message, nothing attached |
| 400 | not defined yet | unlink refused (last sign-in method): say what to add first |
| 401 | `E_AUTH_04` | session gone during link: sign in again |

No OAuth codes exist yet; T-019 adds them. `ErrorCode` is not on the wire until [[T-063 Put the ErrorCode on the error body]] ships.

## Blocked by

- [[D-01 Passwordless login]] — the login row, and the copy on s01, wait on it; [[T-019 LinkedIn OAuth link, unlink, login]] is ❓ because of it.
