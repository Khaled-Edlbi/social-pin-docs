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
all, which is what the "switch modes" UI is for. They arrive in a stable order —
the person's default ring first, if the viewer is in it — but carry no
identifier, so the switcher must index by position.

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

Domain errors also carry a stable `ErrorCode` (`E_RING_01`, `E_AUTH_04`, …).
**Branch on the code, display the message.** The message is for humans and may
be reworded at any time; the code will not change meaning.

Validation failures set `message` to a **string array**, one entry per failed
constraint. Handle both shapes.

Unknown body keys are rejected with a 400 rather than ignored, so a typo'd field
name fails loudly in development.

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
| GET | `/rings/shared-with-me` | Rings of others you are a live member of |
| POST | `/rings` | PERSONAL or CORPORATE only |
| GET | `/rings/:id` | |
| PATCH | `/rings/:id` | Owner, or an admin at CONTENT_MANAGER+ |
| POST | `/rings/:id/default` | |
| POST | `/rings/:id/disposition` | `KEEP` / `MERGE` / `AUTO_DELETE` for a temporary ring |
| DELETE | `/rings/:id` | 409 on the default |

Filters: `name`, `type`, `status`, `isTemporary`.

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
| GET | `/views/ring/:ringId` | Render one named ring — QR scan, and the owner's "View as" |
| GET | `/views/user/:userId/perspectives` | Every perspective you hold of one person |

`GET /views/ring/:ringId` is the same code path for the owner and for a member,
which is what makes "View as" trustworthy rather than an approximation: the
owner sees byte-for-byte what that audience sees.

### Files — `/files`

| Method | Path | |
|---|---|---|
| POST | `/files` | `multipart/form-data`, field `file`. Max 25 MB |
| GET | `/files/:id` | Metadata for a file you uploaded |
| DELETE | `/files/:id` | |

Accepted types: JPEG, PNG, WebP, GIF, PDF, DOCX/XLSX/PPTX, DOC/PPT, TXT, CSV.
Anything else is a 415.

Uploading does **not** make a file visible to anyone. It becomes readable when a
context the viewer can reach references it — attach it to a ring projection. The
response deliberately omits the storage path.

---

## Enums

All enums are documented in `/docs` with stable `enumName`s, so a generator
produces named types rather than inline unions. Values are
`SCREAMING_SNAKE_CASE` and safe to switch on.

Worth knowing up front:

- `RING_TYPE`: `PERSONAL`, `CORPORATE`, `EVENT`, `MINI_EVENT`, `MEETING`
- `RING_STATUS`: `ACTIVE`, `EXPIRED`, `ARCHIVED`, `DELETED`
- `RING_DISPOSITION`: `UNDECIDED`, `KEEP`, `MERGE`, `AUTO_DELETE`
- `LINK_TYPE`: 15 values, including `FACEBOOK_PAGE` and `WHATSAPP_BUSINESS` as
  distinct from `FACEBOOK` and `WHATSAPP`
- `ACCOUNT_TYPE`: `FREE`, `PRO`

## Not yet available

Schema exists, endpoints do not: connections and connection requests, events and
participation, exhibitors and booths, mini-events, meetings and availability
slots, PinCast and nearby discovery, businesses, orders and payments,
notifications, analytics, and Gemma. See `SPEC_MAP.md` for the current state of
each.

QR tokens are partially available: `GET /views/ring/:ringId` renders a scanned
ring, but the endpoints to issue and revoke a badge token are not written yet.
