---
type: frontend-requirements
code: error-contract
scope: feature
feature: error-contract
module: platform
status: approved
approvedBy: "khaled"
approvedAt: 2026-10-29
screens: [s01, s02, s06, s18, s68]
depends: []
affects: ["S-87 Error Contract Story"]
related: ["S-87 Error Contract Story", "BD-35 Error Contract Backend Delivery", "BI-02 Auth & Sign-up Backend Integration", "BI-01 Account Backend Integration", "Frontend API Guide", "Frontend Contract", "API Conventions", E_AUTH_03, E_AUTH_04, E_AUTH_05, E_AUTH_06, E_USER_01]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/approved, module/platform, layer/frontend]
---

# Error Contract · Frontend Requirements

**Feature:** [[F-35 Error Contract]] · **Status:** Approved 2026-10-29 by khaled · **Story:** [[S-87 Error Contract Story]] · **API Integration:** not yet (backend not built)

What the client's error layer needs from every error the API sends. There is no screen of its own: every screen renders its errors through one parser, and the per-feature requirements notes list which codes their endpoints carry. This note fixes the shape they all share, how the client reads it, and the cases that are easy to get wrong.

## Per screen

### No screen: the error layer every screen uses

- **Needs:** one parser for every error body; a switch on a stable code; a fallback for a code it does not know; one rule for when a 401 may trigger a token refresh and when it must not.
- **Source today:** the body is the same on every route ([[S-87 Error Contract Story]] S1, true today). The stable code is **not** on it yet ([[S-87 Error Contract Story|Error Contract · S4–S8]]), and `error` reads `"HttpException"` for every domain error.

## The body the client parses

```
{
  statusCode: number,
  errorCode?: string,          // the stable code, e.g. "E_AUTH_05" — after Error Contract · S4–S8
  message: string | string[],  // string on a domain error, array on a validation error
  error: string,               // never branched on
  path: string,
  timestamp: string
}
```

| Key | The client relies on | The client never |
|---|---|---|
| `errorCode` | Present on every **domain** error once S4–S8 ships. **Absent** on validation errors (S8), on a 500, and on a plain 401 for a missing or expired token. Read it as optional, so a body without it still parses. | assumes it is present; reads `ErrorCode` (the PascalCase name the services throw internally is not the wire name) |
| `message` | Display-only English text for a fallback. | branches on its wording |
| `error` | Nothing. | branches on it; it is the server's exception class today and will change |
| `statusCode` | The status, together with the endpoint called, until `errorCode` arrives. | — |

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| One error body for every route | — (cross-cutting, `AllExceptionsFilter`) | ✅ | [[S-87 Error Contract Story]] S1 |
| `errorCode` on the body of every domain error, camelCase, optional | — | ❌ | [[S-87 Error Contract Story|Error Contract · S4–S8]] |
| `error` no longer the exception class name | — | ❌ | [[S-87 Error Contract Story|Error Contract · S4–S8]] (S2) |
| Codes with one meaning each (`E_RING_01`, `E_RING_PROFILE_03` split) | — | ❌ | [[S-87 Error Contract Story|Error Contract · S9–S11]] |
| A retired code never returns with a new meaning | — | ✅ | [[API Conventions]], [[S-87 Error Contract Story]] S11 |

## Behaviour expectations

**Reading the code.** Write the switch on `errorCode` now, keyed by the per-feature tables, so it takes over the moment the field appears. Until then, branch on `statusCode` plus the endpoint called, as the table below gives both. A code the client does not know falls back to the status's generic copy, with `message` shown only as secondary text.

**Validation errors (decided: the list stays plain).** A 400 from validation has no `errorCode` and a `message` array of English sentences, one per failed constraint, each starting with the field's property name (`"email must be an email"`, `"pinName must be 3-30 characters …"`). The client:
- shows every entry, as a list at the form's top or above the submit button, so nothing is lost;
- may place an entry under its field when the sentence starts with that field's property name, as a convenience only;
- never depends on the wording for correctness: the client validates the same rules before sending, so a validation 400 is a last line of defence, not the normal path.

No structured `{ field, constraints }` shape is asked of the backend for the MVP; [[S-87 Error Contract Story]] S8 keeps the plain array.

**When a 401 may refresh the session.** Only one kind of 401 is fixed by a refresh:

| 401 from | Body today | Meaning | The client |
|---|---|---|---|
| any route, access token missing, malformed or expired | `message: "Unauthorized"`, no code | the access token is stale | refreshes **once** (one refresh in flight for the whole app), retries the call once |
| `POST /auth/refresh`, or a token of the wrong scope anywhere | `E_AUTH_04` | the session is over | signs out: "Please sign in again"; no further refresh |
| any route, suspended account | `E_AUTH_03`, `message: "Account is not active"` | the account is locked | signs out with the "can't sign in right now" copy; **no** refresh |
| `POST /auth/complete-registration` | `E_AUTH_05`, `message: "Verification session is invalid or expired"` | the onboarding token expired | back to s02 for a new code; **no** refresh: there is no session yet |

Until `errorCode` is on the wire, the client cannot tell the first and third rows apart on an ordinary route; it tries the one refresh, which fails for a suspended account (its sessions were revoked), and then signs out. That is acceptable; what must never happen is a refresh loop or a refresh from the onboarding step.

**403 is two different things.** `E_AUTH_03` from `POST /auth/login/verify` or `POST /auth/refresh` means the **account** is not active (suspended, or sign-up never finished): on sign-in, "This account is not active" with *Start sign-up again*; on refresh, sign-out. Every other 403 is a role or ownership refusal: "You can't do that here".

**404 on any authenticated route can mean the account is gone.** `E_USER_01` with `message: "User not found"` comes from the auth check itself, on any route, once the account was deleted (on another device): sign out with "Your account has been deleted." ([[BI-01 Account Backend Integration]]). Every other 404 is "not found" for the thing asked for; on the privacy-sensitive routes (`/views/pin/:pinName`) it is one copy for missing, not shared and blocked, and the client never derives a difference from timing or wording.

**429 is a burned code, not a busy server.** The only 429 is `E_AUTH_06`: five wrong guesses used up the one-time code. Disable the code cells and offer *Send a new code*; retrying the same request never succeeds, so the client never retries it automatically.

**500.** An unexpected server error: a generic message, a retry action, never any part of the body on screen.

Caching keys, pagination, realtime: none.

## Error states the UI must handle

| Status | `errorCode` | When | Show |
|---|---|---|---|
| 400 | — (validation) | a body field failed a rule | every entry of the `message` array, placed under its field when the property name matches |
| 400 | domain code | a domain rule refused the request, e.g. `E_AUTH_05` wrong or expired one-time code | the per-feature copy for that code |
| 401 | — | access token missing or expired | nothing: one silent refresh, then retry |
| 401 | `E_AUTH_04` | session over | Welcome, "Please sign in again" |
| 401 | `E_AUTH_03` | account suspended | Welcome, "This account can't sign in right now" |
| 401 | `E_AUTH_05` | onboarding token expired (`complete-registration` only) | back to s02, "Your code expired, request a new one" |
| 403 | `E_AUTH_03` | account not active, on `login/verify` or `refresh` | "This account is not active" + *Start sign-up again* (sign-in) / sign-out (refresh) |
| 403 | other domain code | role or ownership refusal | "You can't do that here" |
| 404 | `E_USER_01` | account deleted, any authenticated route | Welcome, "Your account has been deleted." |
| 404 | other domain code | the resource does not exist, or is not shared | "Not found"; one identical copy on the privacy-sensitive routes |
| 409 | domain code | a conflict, e.g. `E_PROFILE_02` Pin taken, `E_RING_01` Ring name taken | the per-feature copy, at the field |
| 429 | `E_AUTH_06` | one-time code burned | cells disabled, *Send a new code* |
| 500 | — | unhandled server error | generic failure, retry |

Before [[S-87 Error Contract Story|Error Contract · S4–S8]] ships the `errorCode` column is empty on the wire; the client uses the *When* column (status plus endpoint) instead.

## Blocked by

- No decision blocks this list. The client's switch on `errorCode` activates when [[S-87 Error Contract Story|Error Contract · S4–S8]] ships; the split of the two double-meaning Ring codes waits on [[S-87 Error Contract Story|Error Contract · S9–S11]].

## Sign-off

- Approved by: khaled · on: 2026-10-29 (the backend's review, against `main @ b4984d6`)
- Two notes from the review, for `/frontend`; neither holds the approval up:
  - `POST /auth/complete-registration` also answers **404 `E_USER_01`** when the onboarding token's account is gone. That route is public and has no session, so the "account deleted → sign out" handler applies to authenticated routes only; there it is "start sign-up again".
  - `POST /auth/complete-registration` also answers **400 `E_AUTH_05`** (`"This verification was not for a sign-up"`) when the code was issued for a sign-in. The 401 row covers only the expired onboarding token; this one falls to the "400 · domain code" row, back to s02.

## Log

- 2026-10-27 · branch `tickets/frontend/M-08-platform/F-35-error-contract/FR-35-ready` · rewritten on khaled's request after the backend's review of the draft (eight points, branch `tickets/backend/M-08-platform/F-35-error-contract/FR-35-reviewed`): the wire key named (`errorCode`, optional); the four kinds of 401 and when a refresh is allowed; 403 `E_AUTH_03` as an account state; 404 `E_USER_01` as a deleted account; 429 as a burned code; validation decided as a plain list with best-effort field placement (S8 unchanged); the stale "no task yet" row pointed at Error Contract · S9–S11; `error` never branched on. Set `ready` for the backend to approve or send back. The 401 on `complete-registration` is the build today; it is filed as bug B-05 against the integration note, which promises 400.
- 2026-10-29 · branch `tickets/backend/M-08-platform/F-35-error-contract/FR-35-accepted` · approved by the backend: the eight review points are answered and every status and code in the list matches `main @ b4984d6`. Two notes added under *Sign-off* (the second 404 `E_USER_01` and 400 `E_AUTH_05` on `complete-registration`). [[BD-35 Error Contract Backend Delivery]] stays `in-progress`; Error Contract · S4–S8 is the next backend work.
