---
id: FD-16
type: frontend-delivery
module: discovery
feature: badge-qr
status: done
scope: feature
deployedTo: []
screens: [s34, s43, s44, s56]
owner: "Omar Fostok"
depends: ["BI-15 Badge & QR Backend Integration"]
affects: []
related: ["FR-18 Badge & QR Frontend Requirements", "S-37 Badge & QR Story", "BD-18 Badge & QR Backend Delivery", "BI-09 View As & Pin Views Backend Integration", "BI-16 Connections Backend Integration", "BI-17 Ring Invitations & Join Backend Integration", "FD-13 Connections Frontend Delivery", "S-19 View As & Pin Views Story", "S-23 Connections Story", "S-33 Ring Invitations & Join Story", "S-53 Events During Story", "S-71 Subscription (Free vs Pro) Story", "S-82 Devices & NFC Story", "D-10 Connect sends what the requester already has", "D-11 The badge code stays the same for its day", "D-12 The badge QR is a socialpin.me link", "D-28 Scan someone in is not in the MVP", "D-35 A join code can be shown as a QR", "D-05 Inherit per field, copy without members", "POST /rings/:ringId/qr", "POST /rings/:ringId/qr/reset", "GET /rings/:ringId/qr/scans", "GET /views/qr/:token", "GET /views/pin/:pinName", "POST /connections/requests", "POST /blocks", "GET /connections/relationship", "E_RING_02", "E_RING_03", "E_BADGE_01"]
pending: ["[[BI-15 Badge & QR Backend Integration]]: Connect, Block and the relationship by qrToken on s44 are built and switch on by themselves once backend main ebdca36 is deployed; until then the backend answers 400 (qrToken is not a field) and the card reads \"Connecting from a scanned code is coming soon.\""]
created: 2026-11-09
updated: 2026-11-15
tags: [frontend-delivery, frontend-delivery/done, module/discovery, layer/frontend]
---

# ✅ Badge & QR · Frontend Delivery

**Feature:** [[F-18 Badge & QR]] · **Status:** Done · **Built from:** [[BI-15 Badge & QR Backend Integration]] · **Against:** [[S-37 Badge & QR Story]] · **Requirements:** [[FR-18 Badge & QR Frontend Requirements]] · **QA:** [[Badge & QR QA Frontend]]

What the client shipped for the badge, the scanner and the scanned card, on `social_pin` `rings/F-11/honest-rings` @ `0005f00` (2026-11-09), not on `main` yet: the badge work came in `875d8ee`, Connect, Block and the relationship by the scanned code in `d4cbd1f`, the polish (Pin name on the card, Pro hides the rotate note, the join QR to s74, Save contact, the motion, token redaction in the debug logs) in `0005f00`. Against backend `main` `1c460b0` for the badge routes; Connect by `{ qrToken }` waits on `ebdca36` being deployed (Not done yet). Packages: `qr_flutter`, `mobile_scanner`, `gal`, `flutter_contacts`. Unit and widget tests only so far; not yet tried on a device.

**Since then** (to `778d9b4`, 2026-11-12, still on `rings/F-11/honest-rings`): *Open settings* on Android too and the file size on the card's file rows (`9e0f3be`); after joining from a join QR the badge closes on Shared with me (`c1f152c`); the Ring's photo on the badge (`4350611`); s44 says how long the card stays open (`45bd74b`); sample people on s44 for the screens with no API yet (`e03ddf9`); the s43 loading line checked (`dbef63e`). At `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s34\|s34]] Badge | ✅ | Rises out of the centre tab (reverses on close). A real QR drawn from `url`; the Ring's name and colour, the Ring's photo (or my main photo when the Ring follows it, [[D-05 Inherit per field, copy without members|D-05]]; `4350611`), my display name and `!pinName` **on the card**, the Ring's "Role & company" when that Ring shows it; "Changes in {time}" from `expiresAt` on the server's clock. Switching Ring re-composes the card with that Ring's code. States: loading (ghost code), ready, *Refreshing* (offline, kept code in its window), *Expired* (offline past it, no QR: "This code has run out. Go online to get today's code."), *No Ring* (link to My Rings), "Couldn't load your code" + Try again. **Reset code** asks "Reset this code?" / "Anyone holding the current code won't reach you with it." then redraws. **Times scanned** row from the count, nothing when it can't be read. **Save image** to photos with "Works until {time}". *Share link* and *NFC tap* answer "Not available yet". The rotate note and *Get Pro* show for Free only; a Pro account sees neither. Auto-accept and the sample code are gone (S1–S4, S10, S12–S14, [[D-28 Scan someone in is not in the MVP\|D-28]]) |
| [[Screen Index#s43\|s43]] Scanner | ✅ | *Flip to scan* turns the card (a fade-through with reduced motion); flipping back shows the badge without asking again and drops a resolve on its way. A real camera and **From photos**, one reader. Read on the phone, no request: `https://socialpin.me/q/<token>` → resolve; my own code → **View as** for that Ring; a join QR `socialpin://join/<CODE>` → the join review **s74** ([[S-33 Ring Invitations & Join Story\|S-33]] S9, [[D-35 A join code can be shown as a QR\|D-35]]); once in (or asked to be), the badge closes on Shared with me, not back on the scanner (`c1f152c`); anything else "Not a Social Pin code", keep scanning. One resolve per code per 5 s, "Checking who this is…" (en and ar; no Ring wording, as S6 keeps it against the Nov 2026 design's "Checking which Ring they belong in", [[D-28 Scan someone in is not in the MVP\|D-28]]; checked at `dbef63e`); a found code settles into a card before s44 opens. States: looking, checking, "This profile isn't available" (every 404), "Not a Social Pin code", "No code found in this photo", "Slow down. Try again in a minute." (no resolve for a minute after a 429), "You're offline", "Couldn't check this code. Try again.", camera off ("Camera access is off", *Open settings* on iOS and Android, the app's own settings page; back from Settings the camera is tried again by itself; `9e0f3be`) and camera unavailable (*Try again*, also where Settings can't be opened). **Enter a Pin name** → the person's card (the app's person card screen, by `GET /views/pin/:pinName`, S9), my own Pin name → View as. **Saved scans · N** entry under the frame (S5–S7, S9, S11) |
| [[Screen Index#s44\|s44]] Scanned card | ✅ | The resolved card ([[BI-09 View As & Pin Views Backend Integration\|BI-09]]): `null` is not shared, no Ring name, "Scanned just now / N min ago / N h ago / {date}". While the code lives and the card isn't saved: "This card stays open until {time}. Save it to keep it here until then, or connect to ask for more." (the time today, with its date on another day; `45bd74b`). File rows read "Portfolio.pdf · 2.4 MB" (`9e0f3be`). **Save for later** keeps the card, the token and `expiresAt` on this phone; it stays on the card with "Saved for later", the note becomes "Saved on this phone. Works until {date}.", and the button turns into **Remove from saved** (asks first). Opened without a scan (PinCast, Discover and Exhibitors, which have no API yet), s44 shows a sample person from the demo, and ⋯ answers "Coming soon" (`e03ddf9`). **Save contact** only when the card shares a phone number: the phone's own new-contact editor, filled from the card. **Connect** and ⋯ **Block** by `{ qrToken }` with the relationship's button, off after `expiresAt` with "This code has expired. Scan {name} again to connect."; until the backend deploy, "Connecting from a scanned code is coming soon." (S8, [[D-10 Connect sends what the requester already has\|D-10]]) |
| Saved scans (from s43 and Me) | ✅ | Newest first, "Kept on this phone only, as you scanned them: never read again, never shared."; "Works until {date}" or *Expired*; Remove ("Their card leaves this phone. To see it again, scan their code."); a saved card opens as "Saved scan", never read again from the server; empty state. Also a **Saved scans** row on Me (S8) |
| [[Screen Index#s56\|s56]] Event pass | ⬜ | [[S-53 Events During Story\|Events During · S9]]; nothing in this feature (S15) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `POST /rings/:ringId/qr` | s34 open, Ring switch, minute tick past `expiresAt` | Not sent while the code kept for that Ring is valid on the server's clock (offset from the `Date` header). 404 `E_RING_02` → `GET /rings` again and another Ring; 409 `E_RING_03` → another live Ring or *No Ring*; a refused Ring is not offered again while the badge is open. |
| `POST /rings/:ringId/qr/reset` | s34 *Reset code*, after the confirm | The old code is forgotten whatever the answer. |
| `GET /rings/:ringId/qr/scans` | s34 open | `{ scanCount }`; once per open, no polling; its failure is also how the badge knows it is offline. |
| `GET /views/qr/:token` | s43 → s44 | The token after `https://socialpin.me/q/`, through `Uri.encodeComponent` (see Deviations). Every 404 is one message; 429 holds resolves for a minute. |
| `GET /views/pin/:pinName` | s43 *Enter a Pin name* | Unchanged from [[BI-09 View As & Pin Views Backend Integration\|BI-09]]. |
| `GET /connections/relationship?qrToken=`, `POST /connections/requests { qrToken }`, `POST /blocks { qrToken }` | s44 | Only while the code is in its window. A 400 "property qrToken should not exist" reads as *coming soon* for the rest of the app run; the next start asks again ([[BI-16 Connections Backend Integration\|BI-16]]). |
| `GET /rings`, `GET /users/me` | s34 | The picker; `accountType` for the Pro line. |

## State kept on the client

- **Each Ring's last code** (`token`, `issuedAt`, `expiresAt`, `url`), keyed by Ring id in shared storage; reused while valid, forgotten on reset and for Rings deleted or ended, cleared on sign-out.
- **Saved scans** (the card as scanned, the token, the scan time), newest first, in shared storage; on the phone only, never synced, cleared on sign-out.
- The scanner's last code and time (the 5 s window) and the 429 hold, in memory.
- Tokens are masked in the debug network logs: the `/views/qr/` path, `token` and `url` in the code answers, and `qrToken` on any route; the request itself is untouched.

## Deviations from the story or the integration note

- **Reduced motion is a fade-through** on the flip (one face out, then the other in), not a cross-fade of both (S5); the rise, the re-compose and the found code keep only their fade.
- **The token is URL-encoded** on the resolve; BI-15 says send it as is. A well-formed token (`A–Z a–z 0–9 _ -`) is unchanged by it; only a malformed one differs, and it answers the same 404.
- **Save contact sits under the card**, not in the bar beside *Save for later*, and the contact also takes the card's web links and photo, and the headline as job title when there is no role (S8 names name, phone, email, role, company).
- **Remove from saved asks first** before it takes the scan off the list (S8 says only that it removes it).
- **States the story does not list:** "No code found in this photo", "Couldn't check this code. Try again.", camera unavailable, "Scanned N min ago" on a fresh card.
- **The rotate note reads** "This code is temporary — it rotates every 24 h. A permanent code you can print on a card or badge is part of Pro."; S-37 S14 takes the same copy on its 2026-11-12 update (`S-37-app-778d9b4`), so this goes once that is merged.
- **s44 says how long the card stays open**, and a saved one until when it works: copy the story doesn't list.
- **s44 with no scan shows a demo person** for PinCast, Discover and Exhibitors, which have no API yet.
- **Saved scans has two entries**, under the scanner frame and a row on Me; the story names only the list.

## Not done yet

- **Connect, Block and the relationship by `{ qrToken }`**: built; on when backend `ebdca36` is deployed (`pending`) → [[S-37 Badge & QR Story|S-37]] S8, [[BI-15 Badge & QR Backend Integration]].
- **Share link**, the `/q/<token>` web page and deep links: wait on `socialpin.me` ([[D-12 The badge QR is a socialpin.me link|D-12]], S12).
- **NFC tap**: [[S-82 Devices & NFC Story|Devices & NFC · S7]].
- **Pro permanent code**: [[S-71 Subscription (Free vs Pro) Story|S-71]] S6, after the domain (S14).
- **Event pass** (s56, 60 s): [[S-53 Events During Story|S-53]] S9 (S15).

## Tests

Unit and widget, at `0005f00`: `badge_controller_test` (18), `badge_data_test` (14), `badge_screen_test` (7), `scanner_controller_test` (24), `scan_viewfinder_test` (3), `saved_scans_test` (9), `scanned_connect_test` (22), `save_contact_test` (12), `badge_token_redaction_test` (12), `flip_card_test` (2). At `dbef63e`: `scanner_wording_test` (new: the s43 loading line in en and ar, no Ring wording). Since: `app_settings_test` (new, `9e0f3be`), `saved_scans_test` (the open-until line and the saved note, `45bd74b`), `saved_scan_time_test`. At `778d9b4`: `flutter test` 1752 passed, `dart analyze` 0 errors. Not yet on a device.

## Log

- 2026-11-09 · app branch `rings/F-11/honest-rings` @ `0005f00` (with `875d8ee`, `d4cbd1f`; social_pin, not on `main` yet) · S1–S9, S11–S14 · s34 (real QR, Changes in, Reset, offline states, scan count, Save image, Pin name on the card, Pro hides the rotate note, rise and re-compose), s43 (camera and photos, own badge → View as, join QR → s74, states, found-code motion), s44 (resolved card, Save for later stays with Remove from saved, Saved scans, Save contact, Connect by qrToken ready, `pending` until `ebdca36` deploys); token redaction in debug logs · flagged [[S-37 Badge & QR Story]] (Android Try again, fade-through, Save contact placement and fields, extra states, rotate copy) and [[BI-15 Badge & QR Backend Integration]] (token URL-encoded; Connect by qrToken waits on the deploy); cleared the two S-37 flags on [[FR-18 Badge & QR Frontend Requirements]]
- 2026-11-11 · app branch `rings/F-11/honest-rings` @ `dbef63e` (social_pin, not on `main` yet) · S6 (s43 loading line "Checking who this is", en and ar, no Ring wording; already right, no app change; D-28) · s43 · test `scanner_wording_test` (new) · flagged nothing
- 2026-11-15 · app branch `rings/F-11/honest-rings` @ `9e0f3be`, `c1f152c`, `4350611`, `45bd74b`, `e03ddf9`, `778d9b4` (social_pin, not on `main` yet; analyze 0 errors, 1752 tests pass) · S2, S5, S8, S9 · s34 (the Ring's photo on the card), s43 (*Open settings* on Android too, a join QR lands on Shared with me after joining, a Pin name opens the person card), s44 ("This card stays open until {time}…", "Saved on this phone. Works until {date}.", file sizes, a demo person when opened without a scan) · flagged [[S-37 Badge & QR Story]] (Android now *Open settings*; the open-until and saved notes; the demo person on s44)
