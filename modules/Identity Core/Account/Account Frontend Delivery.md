---
type: frontend-delivery
code: account
scope: feature
feature: account
module: identity
status: done
screens: [s68]
depends: []
affects: []
related: ["Account Frontend Requirements", "Profiles & Pin Name", "T-062 Serve uploaded file bytes by id", "T-005 Connection count on Me and Home", "T-019 LinkedIn OAuth link, unlink, login", "T-014 Register devices on login; list and remove", "T-049 Subscription endpoints and a single Pro gate", "T-063 Put the ErrorCode on the error body"]
pending: []
deployedTo: []
created: 2026-10-26
updated: 2026-10-26
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Account · Frontend Delivery

**Feature:** [[Account]] · **Status:** Done · **Built from:** [[Account Backend Integration]] · **Against:** [[Account Story]] · **Requirements:** [[Account Frontend Requirements]] · **QA:** [[Account QA Frontend]]

What the client shipped for the account section of Me, on `social_pin` `main` @ `e032a48` (s68 in `99b97e7`, the account kept current and the sign-out states in `e032a48`; delete in `461958f`, the header in `a58e6b8`). The QA checklist is AC-01…AC-15 and DA-01…DA-08 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s68\|s68]] Me / Account | 🟡 | Header (name, `!pinName`), plan card from `accountType`, ACCOUNT group (email, phone, verified chips, last signed in), change email / phone in a sheet, delete account. Photo, connections, devices, linked accounts and subscription still sample or placeholder (see *Not done yet*). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /users/me` | startup; Me, the first time it is built; every return to the foreground; after a token refresh | Saved on the phone after every success (secure storage) and held in one app-wide holder; startup shows the saved copy first and waits 10 s for the server. Triggers that coincide make one request. A refresh that fails keeps what is there; a 404 (`E_USER_01`, or the bare status until [[T-063 Put the ErrorCode on the error body]]) ends the session, at startup too. |
| any authenticated call | network layer | A 401 carrying `E_AUTH_03` ends the session without a refresh. Lights up with [[T-063 Put the ErrorCode on the error body]]; until then the refresh that follows is refused and ends it. |
| `PATCH /users/me` | s68, the change email / phone sheet | Sends only the changed key: email trimmed and lower-cased, phone in E.164 from the country picker. Unchanged value → no request. The response replaces the held and saved account. Not optimistic: one request at a time behind the loader. |
| `DELETE /users/me` | s68, Delete account | Behind a confirmation sheet. On 200 the token store and every cache are cleared and Welcome replaces the whole stack; `POST /auth/logout` is not called. A failure keeps the session. |
| `GET /profiles` | Me header | `data[0]`: full name and Pin name ([[Profiles & Pin Name]]). |

## State kept on the client

- The account: one holder for the app's lifetime plus a saved copy on the phone; both cleared the moment the session ends, whatever ended it (sign-out, delete, a refresh that fails).
- Why a session ended (session over, account suspended, account deleted) decides the one message shown on Welcome: "Your session has expired…", "This account can't sign in right now. Contact support…", or "Your account has been deleted."
- Verified state is never set on the client: the chip reads `emailVerifiedAt` / `phoneVerifiedAt` from the last answer.
- Errors branch on `ErrorCode` (`E_USER_02`, `E_USER_03`), falling back to a bare 409 until [[T-063 Put the ErrorCode on the error body]] ships; `message` is never shown for these.

## Deviations from the story or the integration note

- **Email and phone are edited in a bottom sheet, not inline** (S2, S3). One field with the same input and checks as Welcome; Cancel sends nothing. A taken address shows under the field and the sheet stays open.
- **The unverified copy** says "Confirming a new email or number isn't in the app yet", shown under the ACCOUNT group while anything is unverified. S2 asks for "must be verified before it can be used to sign in"; the backend does not refuse sign-in on an unverified address, so the copy does not claim it.
- **No "saved" message after a change.** The row showing the new value as Unverified is the confirmation. A snack bar raised inside a tab has no scaffold to show on (auto_route 11.2's tab scaffold is not Flutter's), which affects every tab screen; to be fixed in the client shell.
- **Pro:** the plan card reads "Pro plan" and hides Upgrade; there is no separate Pro badge in the header (S1).
- **The not-active state (S6) is Welcome with a message**, not a screen of its own: the same place a suspended account lands at startup, with the support line in the message.
- **Privacy rows (S5)** show which of your Rings expose each sensitive field, not whether it is set on the profile, and open nothing yet; unchanged from before this delivery.

## Not done yet

- A suspension mid-session (S6) says "Your session has expired" rather than "not active" until [[T-063 Put the ErrorCode on the error body]] puts `E_AUTH_03` on the wire; the client branch is in and needs no change then.
- Header photo: initials → [[T-062 Serve uploaded file bytes by id]].
- Connection count (sample 218) → [[T-005 Connection count on Me and Home]].
- Linked accounts → [[T-019 LinkedIn OAuth link, unlink, login]]; devices → [[T-014 Register devices on login; list and remove]]; subscription / Upgrade → [[T-049 Subscription endpoints and a single Pro gate]].
- Re-verifying a changed email or phone: no backend route and no task yet ([[Account#Gaps]]).

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | feature-level only: no task-level notes for Account | — |

## Log

- 2026-10-26 · `main` @ `99b97e7` (social_pin) · s68 ACCOUNT group, change email / phone, plan from `accountType`; delete (`461958f`) and header (`a58e6b8`) shipped earlier · flagged nothing
- 2026-10-26 · `main` @ `e032a48` (social_pin) · the account re-read on resume and after a refresh; 404 on `GET /users/me` and 401 `E_AUTH_03` end the session with their own message · flagged nothing
