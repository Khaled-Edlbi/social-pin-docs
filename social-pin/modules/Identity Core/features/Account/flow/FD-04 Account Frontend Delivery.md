---
id: FD-04
type: frontend-delivery
module: identity
feature: account
status: done
scope: feature
deployedTo: []
screens: [s68]
depends: []
affects: []
related: ["FR-01 Account Frontend Requirements", "F-07 Profiles & Pin Name", "S-06 Files Upload Story", "S-03 Counts Story", "S-94 Linked Accounts (OAuth) Story", "S-82 Devices & NFC Story", "S-71 Subscription (Free vs Pro) Story", "S-87 Error Contract Story"]
pending: []
created: 2026-10-26
updated: 2026-11-05
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Account · Frontend Delivery

> ⚠ Affected by [[QF-04 Account QA Frontend]] (2026-11-09): re-run on social_pin 0aaca9e, 36 of 36: the AC-14 point of the flag below is withdrawn (a test fault, B-23 cannot-reproduce: a 404 does end the session at startup). Record 0aaca9e here: a fresh GET /users/me saying SUSPENDED or DELETED now ends the session (B-24), the change sheet focuses the field on an error (B-25), the delete sheet names the Rings and what they show (B-26), the country-code button is one semantics node (B-27). The card-opens-the-editor and not-active-message points still stand (/frontend)

> ⚠ Affected by [[QF-04 Account QA Frontend]] (2026-11-09): the Patrol run on social_pin b646053 differs from this note: the profile card opens the profile editor (AC-21 passes; 'The profile card opens nothing' is out of date); a deleted account is not signed out on a cold start to Home, because the app doesn't read GET /users/me then (AC-14, B-23; this note says a 404 ends the session 'at startup too'); the not-active message shows on a 401 E_AUTH_03 mid-session (AC-15 passes; 'Not done yet' still says 'Your session has expired'). B-23 to B-27 filed against this note (/frontend)

> ⚠ Affected by [[BI-02 Auth & Sign-up Backend Integration]] (2026-11-05): the 403 noted on 2026-11-05 is fixed on backend main @ 8997be1: POST /auth/refresh for a SUSPENDED account now answers 401 E_AUTH_03 'Account is not active', the same as every other route, so the refused-refresh path ends the session with no 403 case

> ⚠ Affected by [[BI-02 Auth & Sign-up Backend Integration]] (2026-11-05): POST /auth/refresh for a SUSPENDED account answers 403 E_AUTH_03, not 401, on backend main @ 504cb21 (open on BD-02); a session that ends on 'the refresh that follows is refused' must treat a 403 from /auth/refresh as a sign-out too. Also: of two concurrent refreshes with one token, the loser now gets 401 E_AUTH_04 (B-03)

> ⚠ Affected by [[B-02 Deleted account answers 401, not the documented 404 E_USER_01]] (2026-10-26): the 404 branch on `GET /users/me` is live now (backend branch `B-02/auth/deleted-account-404`): keep it. The 404 comes from the auth guard, so **any** authenticated route can answer it for a deleted account, not only `GET /users/me`; decide whether the network layer ends the session on such a 404 elsewhere too, or relies on the next `GET /users/me`. `/frontend`.

**Feature:** [[F-01 Account]] · **Status:** Done · **Built from:** [[BI-01 Account Backend Integration]] · **Against:** [[S-01 Account Story]] · **Requirements:** [[FR-01 Account Frontend Requirements]] · **QA:** [[QF-04 Account QA Frontend]]

What the client shipped for the account section of Me, on `social_pin` `main` @ `47ce960` (s68 in `99b97e7`, the account kept current and the sign-out states in `e032a48`, the Privacy rows in `47ce960`; delete in `461958f`, the header in `a58e6b8`), and on branch `rings/F-11/honest-rings` @ `f462a28`, not on `main` yet, the Me cleanup of 2026-11-05 (initials in `a1c14b1`, no made-up values in `98357f1` and `3064c9d`, Manage account removed in `fbb07c0`, messages inside the tabs in `f462a28`). The QA checklist is AC-01…AC-19, DA-01…DA-08 and RP-12 / RP-13 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s68\|s68]] Me / Account | 🟡 | Header (name, `!pinName`), plan card from `accountType`, ACCOUNT group (email, phone, verified chips, last signed in), change email / phone in a sheet, PRIVACY group (birthdate, gender, marital status: what's set, which Rings show it, set it from the row), delete account. The profile card shows your initials on a disc in your default Ring's colour and your Ring count (`· 3 Rings`), with no connections count and no tap. Rows with no API show no value (Photo library, Interests, Companies, Devices, Business account, Notifications: their screens still open); Linked accounts says Coming soon and opens nothing; Language shows the language in use (see *Not done yet*). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /users/me` | startup; Me, the first time it is built; every return to the foreground; after a token refresh | Saved on the phone after every success (secure storage) and held in one app-wide holder; startup shows the saved copy first and waits 10 s for the server. Triggers that coincide make one request. A refresh that fails keeps what is there; a 404 (`E_USER_01`, or the bare status until [[S-87 Error Contract Story|Error Contract · S4–S8]]) ends the session, at startup too. |
| any authenticated call | network layer | A 401 carrying `E_AUTH_03` ends the session without a refresh. Lights up with [[S-87 Error Contract Story|Error Contract · S4–S8]]; until then the refresh that follows is refused and ends it. |
| `PATCH /users/me` | s68, the change email / phone sheet | Sends only the changed key: email trimmed and lower-cased, phone in E.164 from the country picker. Unchanged value → no request. The response replaces the held and saved account. Not optimistic: one request at a time behind the loader. |
| `DELETE /users/me` | s68, Delete account | Behind a confirmation sheet. On 200 the token store and every cache are cleared and Welcome replaces the whole stack; `POST /auth/logout` is not called. A failure keeps the session. |
| `GET /profiles` | Me header and PRIVACY group | `data[0]`: full name and Pin name, birthdate, gender, marital status ([[F-07 Profiles & Pin Name]]). |
| `PATCH /profiles/:id` | s68 PRIVACY rows | One field per request: `birthdate` as a calendar date (`2001-04-09`), `gender` or `maritalStatus` as the API's value. The same value again → no request. The response replaces the held and saved profile. Sets the value only: no Ring's `show*` changes. |

## State kept on the client

- The account: one holder for the app's lifetime plus a saved copy on the phone; both cleared the moment the session ends, whatever ended it (sign-out, delete, a refresh that fails).
- Why a session ended (session over, account suspended, account deleted) decides the one message shown on Welcome: "Your session has expired…", "This account can't sign in right now. Contact support…", or "Your account has been deleted."
- Verified state is never set on the client: the chip reads `emailVerifiedAt` / `phoneVerifiedAt` from the last answer.
- Errors branch on `ErrorCode` (`E_USER_02`, `E_USER_03`), falling back to a bare 409 until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships; `message` is never shown for these.

## Deviations from the story or the integration note

- **Email and phone are edited in a bottom sheet, not inline** (S2, S3). One field with the same input and checks as Welcome; Cancel sends nothing. A taken address shows under the field and the sheet stays open.
- **The unverified copy** says "Confirming a new email or number isn't in the app yet", shown under the ACCOUNT group while anything is unverified. S2 asks for "must be verified before it can be used to sign in"; the backend does not refuse sign-in on an unverified address, so the copy does not claim it.
- **The "saved" message is a pill inside the tab** (`f462a28`): "Email changed." / "Phone number changed." shows above the tab bar, the same frosted pill as the tab bar, besides the row showing the new value as Unverified. The tab scaffold of auto_route 11.2 is not Flutter's, so the shell now shows short messages itself; errors still use the toast.
- **No Manage account row** (`fbb07c0`): email, phone and delete are already on Me; the design's row went.
- **The profile card opens nothing** (`fbb07c0`): no chevron and no tap until the profile editor exists ([[F-07 Profiles & Pin Name]]).
- **No sample values** (`98357f1`, `3064c9d`): a row or count with no API behind it shows nothing rather than a made-up number; the card and My Rings show no Ring count until the Rings load.
- **Pro:** the plan card reads "Pro plan" and hides Upgrade; there is no separate Pro badge in the header (S1).
- **The not-active state (S6) is Welcome with a message**, not a screen of its own: the same place a suspended account lands at startup, with the support line in the message.
- **Privacy rows (S5) open a picker for that one field, not the profile editor**: the client has no profile editor screen yet. Birthdate opens a date picker, gender and marital status a sheet of the API's values. Each row also keeps, under its title, which of your Rings show it; it never says "public".

## Not done yet

- A suspension mid-session (S6) says "Your session has expired" rather than "not active" until [[S-87 Error Contract Story|Error Contract · S4–S8]] puts `E_AUTH_03` on the wire; the client branch is in and needs no change then.
- Header photo: initials (from the full name's first and last word, else the Pin name) in the default Ring's colour → [[S-06 Files Upload Story|Files Upload · showing files]].
- Connection count: not shown → [[S-03 Counts Story|Counts · S11]].
- The 2026-11-05 cleanup is on `rings/F-11/honest-rings`; it reaches `main` with that branch.
- Linked accounts (Coming soon) → [[S-94 Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]]; devices → [[S-82 Devices & NFC Story|Devices & NFC · S6]]; subscription / Upgrade → [[S-71 Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]].
- Re-verifying a changed email or phone: no backend route and no task yet ([[F-01 Account#Gaps]]).

## Log

- 2026-10-26 · `main` @ `99b97e7` (social_pin) · s68 ACCOUNT group, change email / phone, plan from `accountType`; delete (`461958f`) and header (`a58e6b8`) shipped earlier · flagged nothing
- 2026-10-26 · `main` @ `e032a48` (social_pin) · the account re-read on resume and after a refresh; 404 on `GET /users/me` and 401 `E_AUTH_03` end the session with their own message · flagged nothing
- 2026-10-26 · `main` @ `47ce960` (social_pin) · s68 PRIVACY rows: what's set on the profile, set it from the row (`PATCH /profiles/:id`) · flagged nothing
- 2026-11-05 · `rings/F-11/honest-rings` @ `f462a28` (social_pin, not on `main` yet) · s68: initials in the default Ring's colour (`a1c14b1`); no made-up connections count, Ring count only (`98357f1`); no sample values, Linked accounts Coming soon, Language as in use (`3064c9d`); Manage account removed, the card opens nothing (`fbb07c0`); "Email changed." / "Phone number changed." inside the tab (`f462a28`) · flagged nothing
