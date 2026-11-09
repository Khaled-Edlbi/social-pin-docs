---
id: P-07
type: project
layer: frontend
created: 2026-10-15
updated: 2026-11-09
tags: [project]
---
# Frontend API guide

What the client needs to know to build against this API. The OpenAPI document
at `/docs` is the contract; this explains the parts that are a *model* rather
than a signature.

Base URL: `/api/v1`. All versioning is in the URI.

---

## The one concept to get right

**You never fetch "a user's profile". You fetch a ring projection.**

Every response about another person is a `RingProfileViewEntity` — the
perspective of whichever of their rings the viewer is in. Three consequences for
the client:

1. **The same pin name returns different bodies to different viewers.** Do not
   cache a projection under the person's id alone; key it by (viewer, person).
2. **A field being `null` does not mean the person left it blank.** It means
   *this ring does not share it*. Render "not shared", not "none".
3. **The response never tells you which ring you are in.** There is no `ringId`.
   Do not build UI that implies one, and do not expect the field to appear later
   — its absence is the privacy model.

A viewer may hold several perspectives of one person (they were added to more
than one of their rings). `GET /views/user/:userId/perspectives` returns them
all, which is what the "switch modes" UI is for. They arrive in a stable order:
the ring the viewer was put in first, then the others in the order they were
added (D-15), whatever the person's default ring is. The first one is what
`GET /views/pin/:pinName` renders and the ring a Shared with me row opens, so
View 1 always matches both. Your own perspectives start with your default
ring. They carry no identifier, so the switcher must index by position.

### 404 is not always "missing"

`GET /views/pin/:pinName` returns the same 404 body for all of:

- no such pin name,
- the pin name exists but is not shared with you,
- you are blocked.

This is deliberate: distinguishable errors would let the endpoint be used to
test who exists and who has whom in a ring. Show one message — *"This profile
isn't available to you"* — and do not try to infer which case it was.

---

## Authentication

**There are no passwords.** Every sign-up and every sign-in is a 6-digit
one-time code sent to an email or a phone.

### Sign-up is three calls, in order

```
POST /auth/sign-up               { email } or { phone }
  → 201 { destination, channel, expiresAt, devCode }   a 6-digit code is issued

POST /auth/verify-code           { destination, code, purpose: "SIGN_UP" }
  → 201 { onboardingToken, purpose, expiresIn }        valid 15 minutes

POST /auth/complete-registration { onboardingToken, pinName, fullName? }
  → 201 { accessToken, refreshToken, tokenType, expiresIn }
```

Step 3 creates the person's profile, their default ring and that ring's
projection, so a successful response means they have a working identity — not
just an account.

The `onboardingToken` is **not** a session. It proves only "this destination was
verified, for this purpose", and the API rejects it on every other route. Keep
it in memory for the length of the form; do not persist it.

Check the handle before submitting: `GET /profiles/pin-name/:pinName/availability`
is public and returns `{ pinName, available }`. It never says who holds a taken
handle.

### Sign-in is two calls

```
POST /auth/login          { identifier }          email or E.164 phone
  → 201 { destination, channel, expiresAt, devCode }

POST /auth/login/verify   { identifier, code }
  → 201 { accessToken, refreshToken, tokenType, expiresIn }
```

`login/verify` errors: `400 E_AUTH_05` wrong or expired code, `429 E_AUTH_06`
after 5 wrong tries (request a new code), `403 E_AUTH_03` if the account is
suspended or never finished sign-up.

To resend a code: `POST /auth/request-code { destination, purpose }` with
`purpose` `"SIGN_UP"` or `"LOGIN"`. A new code replaces the previous one.

### `devCode` — temporary

OTP delivery (email/SMS) is not wired yet, so every response that issues a
code also returns it as `devCode`, **in every environment**. Pre-fill or
auto-submit it for now. It will be removed once codes are sent, so keep the
code-entry screen working without it.

When the email or phone has no account, `login` and `request-code` still
return `201` with the same fields **but no `devCode`**, because no code was
issued.

### Sessions

| Token | Lifetime | Sent as | Used for |
|---|---|---|---|
| `accessToken` | 15 min | `Authorization: Bearer` | every API call |
| `refreshToken` | 7 days | `Authorization: Bearer` | **only** `/auth/refresh` and `/auth/logout` |

**Refresh tokens are single-use.** `POST /auth/refresh` returns a new pair and
invalidates the one you sent, in the same transaction. The client must replace
what it stored; a replay returns `401 E_AUTH_04`.

Two practical consequences:

- **Serialise your refreshes.** If two requests 401 at once and both refresh,
  the second one rotates a token the first already consumed and the session
  dies. Queue the refresh and let the waiters retry with the new token.
- A `401 E_AUTH_04` means "sign in again", not "retry".

Sending an access token to `/auth/refresh` fails, and vice versa — they are
signed with different secrets and carry a `scope` claim.

`POST /auth/logout-everywhere` revokes every session, including the caller's.

---

## Error shape

One body for every failure:

```json
{
  "statusCode": 409,
  "message": "You already have a ring with this name",
  "error": "Conflict",
  "path": "/api/v1/rings",
  "timestamp": "2026-10-07T09:41:22.104Z"
}
```

Domain errors are thrown with a stable `ErrorCode` (`E_RING_01`, `E_AUTH_04`, …)
and the intent is **branch on the code, display the message**: the message is
for humans and may be reworded at any time; the code will not change meaning.

**Today the code is not on the wire.** The exception filter writes only
`statusCode`, `message`, `error`, `path` and `timestamp`, and `error` reads
`HttpException` for domain errors. Until that is fixed (Error Contract · S4–S8 in
`social-pin-docs`), branch on the status and the endpoint; the per-feature
frontend notes in the docs vault list the code each endpoint will carry, so the
switch can be written now and lit up later.

Validation failures set `message` to a **string array**, one entry per failed
constraint. Handle both shapes.

Unknown body keys are rejected with a 400 rather than ignored, so a typo'd field
name fails loudly in development.

Booleans are `true` / `false`: JSON booleans in a body, the strings `"true"` /
`"false"` in a query string (either is accepted in both places). Any other value
(`"yes"`, `"0"`, `1`, `null`) is a 400, never read as `true`.

On a `PATCH`, `null` clears a field only where its note says so (a Ring's
`purpose`, a link's `label`, …); `null` on any other field is a 400. To leave a
field unchanged, leave it out.

---

## List endpoints

Every list returns the same envelope:

```json
{ "data": [ … ], "meta": { "total": 137 } }
```

`meta.total` is the **unpaginated** count — use it for the page count, not
`data.length`.

Query parameters: `?limit=20&skip=40`. **`limit` is capped at 50**; asking for
more is a 400, not a silent clamp.

Ordering is per endpoint and documented on each one. Where an endpoint states it
is unordered, `skip` paging over it is not coherent — do not build a pager for
it.

---

## Endpoint summary

### Auth — `/auth`

| Method | Path | Auth | |
|---|---|---|---|
| POST | `/auth/sign-up` | public | Start sign-up; issues a code |
| POST | `/auth/request-code` | public | Resend a SIGN_UP or LOGIN code |
| POST | `/auth/verify-code` | public | Answer a sign-up code → onboarding token |
| POST | `/auth/complete-registration` | public | Pin name → session |
| POST | `/auth/login` | public | Email or phone → issues a code |
| POST | `/auth/login/verify` | public | Answer the login code → session |
| POST | `/auth/refresh` | **refresh** | Rotates the pair |
| POST | `/auth/logout` | **refresh** | Revokes the presented token |
| POST | `/auth/logout-everywhere` | access | Revokes all sessions |

### Account — `/users`

| Method | Path | |
|---|---|---|
| GET | `/users/me` | The authenticated account |
| PATCH | `/users/me` | Email / phone. Changing either clears its verified flag |
| DELETE | `/users/me` | Soft-deletes and revokes every session |

There is no `GET /users/:id` and no user search. Another person is reachable
only through a ring projection.

### Profiles — `/profiles`

| Method | Path | |
|---|---|---|
| GET | `/profiles/pin-name/:pinName/availability` | **Public.** `{ pinName, available }` |
| GET | `/profiles` | Your own profiles, default first |
| POST | `/profiles` | An additional profile |
| GET | `/profiles/:id` | One of your own |
| PATCH | `/profiles/:id` | |
| POST | `/profiles/:id/default` | Promote; demotes the previous default |
| DELETE | `/profiles/:id` | 409 on the default — promote another first |

These return **your own** profile, including the sensitive fields. Whether an
audience sees them is set per ring, not here.

### Rings — `/rings`

| Method | Path | |
|---|---|---|
| GET | `/rings` | Rings you own ("My Rings") |
| GET | `/rings/shared-with-me` | The **people** who share with you, one row each: `{ ringId, pinName, displayName, avatarUrl, expiresAt, ringName, memberCount }`; pagination only (D-14). `ringName` only on a Ring you joined knowingly (an invitation, a code, an approved request, D-18), `memberCount` there only when its members may see each other; both `null` otherwise |
| GET | `/rings/shared-with-me/count` | `{ people }`, equal to the list's `meta.total` |
| POST | `/rings` | PERSONAL or CORPORATE only; takes the six D-04 settings |
| GET | `/rings/:id` | |
| PATCH | `/rings/:id` | Owner, or an admin at CONTENT_MANAGER+; includes the settings |
| POST | `/rings/:id/default` | Owner only; 409 `E_RING_09` on a temporary ring |
| POST | `/rings/:id/copy` | Owner only; a new ring with the settings and what it shows, never the members (D-05) |
| POST | `/rings/:id/disposition` | `KEEP` / `MERGE` / `AUTO_DELETE` for a temporary ring whose window has ended; 409 `E_RING_10` on any other ring, the default included |
| DELETE | `/rings/:id` | 409 on the default |

Filters on `GET /rings`: `name`, `type`, `status`, `isTemporary`. `GET /rings/shared-with-me` takes none (a 400): a filter on a Ring would tell a member which Ring they are in. Shapes and errors: [[BI-08 Rings Backend Integration]].

`EVENT`, `MINI_EVENT` and `MEETING` rings are created by their own flows and are
rejected here with a 400 — they would otherwise exist with no context behind
them.

### Ring members — `/rings/:ringId/members`

**Owner or delegated admin only — all of it.** A member cannot read this, not
even their own row, because the row names the ring.

| Method | Path | |
|---|---|---|
| GET | `/rings/:ringId/members` | The roster |
| POST | `/rings/:ringId/members` | Grant this ring's perspective |
| PATCH | `/rings/:ringId/members/:userId` | Adjust the access window |
| POST | `/rings/:ringId/members/:userId/reassign` | Move to another of your rings |
| DELETE | `/rings/:ringId/members/:userId` | Revoke |

Both `reassign` and expiry take effect **immediately** — access is resolved per
request, so there is nothing to invalidate client-side beyond refetching.

Each row carries `origin`: `PLACED` (added by you or an admin, a connection
accepted into the ring, a reassign) or joined knowingly through an
`INVITATION`, a `JOIN_CODE` or an approved `JOIN_REQUEST`. Read-only; an add or
a reassign always makes it `PLACED`.

### Joining a ring — invitations, join codes, join requests

How a person gets into **someone else's** ring knowingly ([[F-17 Ring Invitations & Join]]).
Literal routes first; the owner's hang off one ring (owner, or an admin at
MEMBER_MANAGER+).

| Method | Path | |
|---|---|---|
| GET | `/rings/invitations/mine` | My pending invitations: the ring's **name**, owner, inviter, window, `valid`, `business`; never the ring's id, colour, type or purpose |
| POST | `/rings/invitations/:id/accept` | Join: a member at once, with the invitation's window → `{ ringId, ringName }` |
| POST | `/rings/invitations/:id/decline` | Decline |
| POST | `/rings/invitations/:id/dismiss` | Dismiss one with `valid: false` (409 `E_RING_INVITATION_06` on a valid one) |
| GET | `/rings/:ringId/invitations` | Invited · N: pending and declined |
| POST | `/rings/:ringId/invitations` | Invite `{ userId }` or `{ pinName }`, optional `startsAt` / `expiresAt`; the owner, an admin, or a member while `membersCanInvite`; works under every `joinPolicy` |
| POST | `/rings/:ringId/invitations/:id/withdraw` | Whoever sent it, the owner or an admin |
| POST | `/rings/join-codes/resolve` | `{ code }` → the review `{ ringName, owner, requireApproval, business }` before anything happens |
| POST | `/rings/join-codes/join` | `{ code }` → `{ outcome: JOINED \| REQUESTED, ringName, ringId, requestId }` |
| GET / POST | `/rings/:ringId/join-codes` | The ring's codes / make one `{ label, endsAt?, useLimit? }` (up to 10 active; 409 under `INVITATION_ONLY`) |
| POST | `/rings/:ringId/join-codes/:codeId/turn-off` | Stop a code and its QR at once |
| GET | `/rings/join-requests/mine` | My pending and declined requests |
| DELETE | `/rings/join-requests/:id` | Cancel a pending one, dismiss a declined one (200, no body) |
| GET | `/rings/:ringId/join-requests` | Waiting on you · N, with the label of the code each person used |
| POST | `/rings/:ringId/join-requests/:id/approve` · `/decline` | Approve (a member at once, origin `JOIN_REQUEST`) or decline |

A code is 8 characters without look-alikes, shown `K7QM-4RXT`; send it in any
case, dash optional. A **join QR** carries `socialpin://join/<code>`: send the
scanned text as `code` (a badge carries `https://socialpin.me/q/<token>` and goes
to `/views/qr/:token`). Every code that doesn't work (wrong, off, ended, used
up, an invitation-only ring, your own, a block) is one 404,
`E_RING_JOIN_CODE_01`; 10 such tries in 15 minutes is 429 `E_RING_JOIN_CODE_02`.
A pending invitation or request grants nothing. Details:
[[BI-17 Ring Invitations & Join Backend Integration]].

### Ring projection — `/rings/:ringId/projection`

The owner's editing surface. Responses include the `isVisible` flags and hidden
rows, which the viewer shape never does.

| Method | Path | |
|---|---|---|
| GET | `/rings/:ringId/projection` | Created on first access |
| PATCH | `/rings/:ringId/projection` | Bio, nickname, avatar, theme, and the `show*` opt-ins |
| POST / PATCH / DELETE | `…/links[/:linkId]` | Social and contact links |
| POST / PATCH / DELETE | `…/info-blocks[/:blockId]` | "Add information to your ring" |
| POST / DELETE | `…/attachments[/:attachmentId]` | Files |

Link `value` is validated against `type`: URL types must be absolute `http(s)`
(a `javascript:` URL is rejected), phone types must be E.164, `LOCATION` must be
`"latitude,longitude"`. Several links of the same type are allowed — label them
to tell them apart.

The `show*` flags all default to **false**. A newly created ring shares no
birthdate, gender, marital status, phone or email until the owner turns it on
for that ring specifically.

### Views — `/views`

| Method | Path | |
|---|---|---|
| GET | `/views/pin/:pinName` | Resolve a person by handle |
| GET | `/views/ring/:ringId` | Render one named ring — the owner's "View as" |
| GET | `/views/user/:userId/perspectives` | Every perspective you hold of one person |
| GET | `/views/qr/:token` | Resolve a scanned badge code: the ring's view plus the code's `expiresAt` |

### Badge — `/rings/:ringId/qr` (owner only)

| Method | Path | |
|---|---|---|
| POST | `/rings/:ringId/qr` | The ring's badge code `{ token, issuedAt, expiresAt, url }`: the same for its 24 h window, then a new one (201) |
| POST | `/rings/:ringId/qr/reset` | Revoke the code now and issue a new one (201) |
| GET | `/rings/:ringId/qr/scans` | `{ scanCount }` across every code the ring has had |

A badge code is 32 opaque base64url characters; the QR draws `url`,
`https://socialpin.me/q/<token>`. Any signed-in user may scan
(`GET /views/qr/:token`): a valid code is the owner presenting that ring, and a
scan adds nobody to it. Every refusal (malformed, unknown, expired, reset, an
ended or deleted ring, a block) is the views' one 404 body, `E_RING_ACCESS_01`,
with the same answer time; more than 20 scans a minute is 429 `E_BADGE_01`. A
code for a ring that is not yours is 404 `E_RING_02`; for your ring that has
ended, 409 `E_RING_03`. Details: BI-15 Badge & QR Backend Integration.

`GET /views/ring/:ringId` is the same code path for the owner and for a member,
which is what makes "View as" trustworthy rather than an approximation: the
owner sees byte-for-byte what that audience sees.

### Files — `/files`

| Method | Path | |
|---|---|---|
| POST | `/files` | `multipart/form-data`, field `file`. Max 25 MB. Returns the file with its signed `url` |
| GET | `/files` | Your own library, newest first, paginated: `?kind=image\|document&limit=&skip=`. Each item has `url` and `usedBy: [{ ringId, name }]` (the Rings using it as their photo) |
| GET | `/files/:id` | Metadata for a file you uploaded, with its signed `url` |
| GET | `/files/content/:token` | **Public.** The bytes behind a signed link. You never build this URL: load the `url` / `avatarUrl` the API gave you |
| DELETE | `/files/:id` | |

Accepted types: JPEG, PNG, WebP, GIF, PDF, DOCX/XLSX/PPTX, DOC/PPT, TXT, CSV.
Anything else is a 415. `kind=image` is the four image types; `kind=document` the rest.

Uploading does **not** make a file visible to anyone. It becomes readable when a
context the viewer can reach references it — attach it to a ring projection. The
response deliberately omits the storage path.

**Showing a file: signed links ([[D-16 Files load from signed links that expire in 15 minutes]]).**
Every place the API hands out a file carries a ready-to-load link: `url` on your
own files, `avatarUrl` and `attachments[].url` on a Ring's projection (owner) and
on every `/views/*` response (viewer). A link is made only after the request's
access check, so it opens exactly what that person may see. It needs **no
bearer token**, so an image loader and its cache work unchanged, and it is valid
**15 minutes**. When one fails to load, read the entity that carried it again
for a fresh link; never store a link or build one from an id. A forged, expired
or deleted link answers 404 `E_FILE_01`, the same as a missing file. Links are
paths from the API root (`/api/v1/files/content/…`) unless the API runs with
`PUBLIC_BASE_URL`, in which case they are absolute.

### Admin panel — `/admin`

Operator-only, and the only part of the API gated on the platform `USER_ROLE`.
Everything else in this guide is `role: []` — any authenticated user, scoped to
their own data.

| Method | Path | Role | |
|---|---|---|---|
| GET | `/admin/stats` | SUPER_ADMIN, ADMIN | Dashboard tiles: account lifecycle breakdown, live ring/profile/role counts, `generatedAt` |
| GET | `/admin/users` | SUPER_ADMIN, ADMIN | `search` matches email or phone; `status`, `accountType`, `role`, `createdFrom`/`createdTo`, `includeDeleted` |
| GET | `/admin/users/:id` | SUPER_ADMIN, ADMIN | Account, scoped grants, and `counts` of profiles/rings |
| PATCH | `/admin/users/:id/status` | SUPER_ADMIN, ADMIN | `ACTIVE` or `SUSPENDED` only, plus an optional `reason` |
| PATCH | `/admin/users/:id/role` | **SUPER_ADMIN** | The platform role on the JWT |
| GET | `/admin/users/:userId/roles` | SUPER_ADMIN, ADMIN | Scoped grants, unpaged |
| POST | `/admin/users/:userId/roles` | SUPER_ADMIN, ADMIN | `{ roleId, scopeId? }` — scope type comes from the role |
| DELETE | `/admin/users/:userId/roles/:assignmentId` | SUPER_ADMIN, ADMIN | |
| GET | `/admin/roles` | SUPER_ADMIN, ADMIN | Roles with permission keys and holder counts |
| GET | `/admin/roles/permissions` | SUPER_ADMIN, ADMIN | The whole catalogue, unpaged |
| GET | `/admin/audit-logs` | SUPER_ADMIN, ADMIN | `actorId`, `action`, `resourceType`+`resourceId`, `from`/`to` |
| GET | `/admin/audit-logs/:id` | **SUPER_ADMIN** | Full `metadata` |

Four things a client should expect:

- **A 403 here is `RolesUnauthorizedException`**, not the usual domain-error
  body: `{ statusCode, message, error, requiredRoles }`. It comes from the guard,
  before any handler runs.
- **SUPER_ADMIN does not inherit ADMIN.** The guard matches role names with no
  hierarchy, so each route lists every role that may call it. A SUPER_ADMIN can
  use the ADMIN routes because they are listed, not because of rank.
- **Some refusals come from the service, not the guard.** `E_ADMIN_01` (never
  your own account), `E_ADMIN_02` (an ADMIN may not act on another
  administrator) and `E_ADMIN_07` (a GLOBAL-scope grant is SUPER_ADMIN-only)
  are 403s with the normal error body. Expect them on a route your role can
  otherwise reach.
- **Suspending ends the session immediately.** The live refresh tokens are
  revoked in the same transaction, so the account cannot mint a new access
  token; the next `/auth/login/verify` is a 403 `E_AUTH_03`.

The panel reads account state only. It cannot read anybody's profile contents,
ring projections or memberships — those stay behind `RingAccessService`, so the
detail screen returns counts rather than rows. There is no delete route for an
audit entry at any role.

**Files are shown from signed links**, not from ids: `avatarUrl` and
`attachments[].url` on the projection and on every view, `url` on your own files
(see *Files* above). Never render from `avatarFileId` or an attachment id.

---

## Enums

All enums are documented in `/docs` with stable `enumName`s, so a generator
produces named types rather than inline unions. Values are
`SCREAMING_SNAKE_CASE` and safe to switch on.

Worth knowing up front:

- `RING_TYPE`: `PERSONAL`, `CORPORATE`, `EVENT`, `MINI_EVENT`, `MEETING`
- `RING_STATUS`: `ACTIVE`, `EXPIRED`, `ARCHIVED`, `DELETED`
- `RING_DISPOSITION`: `UNDECIDED`, `KEEP`, `MERGE`, `AUTO_DELETE`
- `LINK_TYPE`: 20 values, including `FACEBOOK_PAGE` and `WHATSAPP_BUSINESS` as
  distinct from `FACEBOOK` and `WHATSAPP`, and D-03's `BOOKING`, `BEHANCE`,
  `DRIBBBLE`, `GITHUB`, `YOUTUBE` (all `http(s)` URLs); the value rules per type
  are in [[BI-07 Ring Projection Backend Integration]]
- `ACCOUNT_TYPE`: `FREE`, `PRO`
- `USER_STATUS`: `PENDING`, `ACTIVE`, `SUSPENDED`, `DELETED`
- `USER_ROLE`: `SUPER_ADMIN`, `ADMIN`, `ORGANIZER`, `EXHIBITOR`, `USER` — the
  platform role on the JWT, distinct from the scoped `roles` table
- `ROLE_SCOPE`: `GLOBAL`, `EVENT`, `BUSINESS`, `RING`
- `RING_MEMBER_ORIGIN`: `PLACED`, `INVITATION`, `JOIN_CODE`, `JOIN_REQUEST`
- `RING_INVITATION_STATUS`: `PENDING`, `ACCEPTED`, `DECLINED`, `WITHDRAWN`, `EXPIRED`
- `RING_JOIN_REQUEST_STATUS`: `PENDING`, `APPROVED`, `DECLINED`, `CANCELLED`
- `JOIN_CODE_STATE` (computed): `ACTIVE`, `OFF`, `ENDED`, `USED_UP`; `JOIN_CODE_OUTCOME`: `JOINED`, `REQUESTED`

## Not yet available

Schema exists, endpoints do not: connections and connection requests, events and
participation, exhibitors and booths, mini-events, meetings and availability
slots, PinCast and nearby discovery, businesses, orders and payments,
notifications, analytics, and Gemma. See `Spec Map.md` for the current state of
each.

Badge codes are available (see *Badge* above); Connect by a scanned code
(`POST /connections/requests { qrToken }`), the `socialpin.me/q/<token>` web
page and the app links are not yet.

Per-feature client guides (screens → calls, flows, error tables, what is not
available yet) live in the `social-pin-docs` vault under `frontend/`.

## Log

- 2026-11-05 · backend `main` `12172c6` ([[BD-11 Rings Backend Delivery]]) · Rings table: `GET /rings/shared-with-me` lists people (new shape, no filters), `GET /rings/shared-with-me/count` listed, `POST /rings/:id/copy` added (one more endpoint), the D-04 settings on create and edit, 409 `E_RING_09` on a temporary default. Flagged [[Frontend Contract]] for the endpoint table, its count and the new code (/frontend).

- 2026-11-05 · flagged [[Frontend Contract]]: new endpoints on backend main @ 80e7fa2: GET /files (the library, with usedBy) and the public GET /files/content/:token behind every signed link; url on files, avatarUrl and attachments[].url on the projection and the view (D-16). The F-04 row and the endpoint count (48) need updating (/frontend)
- 2026-11-08 · backend `main` `e483d49` ([[BD-11 Rings Backend Delivery]]) · *Errors*: booleans are `true` / `false` only, anything else 400 ([[B-11 Projection switches read any string as true]], [[B-13 The string false is read as true on Ring filters and settings]]); `null` on a `PATCH` only where it clears ([[B-12 Null on a link or custom field's required field answers 500]], [[B-14 PATCH a Ring with null on a required field answers 500]]). Rings table: disposition only on a lapsed temporary Ring, 409 `E_RING_10` (new, [[B-15 Disposition runs on a permanent Ring, the default included]]).
- 2026-11-08 · backend `main` `1c460b0` ([[BD-17 Ring Invitations & Join Backend Delivery]]) · new section *Joining a ring*: 17 routes for invitations, join codes (and the join QR `socialpin://join/<code>`) and join requests; `ringName` / `memberCount` on Shared with me now filled for a ring joined knowingly; `origin` on the members rows; four enums. New codes `E_RING_INVITATION_01`–`07`, `E_RING_JOIN_CODE_01`–`06`, `E_RING_JOIN_REQUEST_01`–`02` (not on the body until Error Contract). [[Frontend Contract]] already flagged from BD-17
- 2026-11-09 · backend `main` `d8267d3` ([[BD-12 View As & Pin Views Backend Delivery]], [[D-15 Several Rings per connection, remove or disconnect]]) · *Perspectives*: they come in the order the viewer was put in the person's Rings, View 1 = `GET /views/pin` = the Shared with me row; your own start with your default Ring. No shape changed.
