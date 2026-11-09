---
id: FD-13
type: frontend-delivery
module: connections
feature: connections
status: done
scope: feature
deployedTo: []
screens: [s11, s19, s43, s44, s45, s46, s47, s68]
owner: "Omar Fostok"
depends: ["BI-16 Connections Backend Integration"]
affects: []
related: ["FR-14 Connections Frontend Requirements", "S-23 Connections Story", "BD-14 Connections Backend Delivery", "D-10 Connect sends what the requester already has", "D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-24 One pending request per pair", "D-26 A disconnect is not announced", "D-27 Sent keeps declined and expired requests for 30 days", "D-29 Connection detail opens a member who is not a connection", "FD-06 Counts Frontend Delivery", "FD-10 Ring Access Engine Frontend Delivery", "FD-12 Rings Frontend Delivery", "S-37 Badge & QR Story", "S-16 Ring Members Story", "S-89 Gemma AI Story", "D-28 Scan someone in is not in the MVP", "GET /views/pin/:pinName"]
pending: ["[[BD-14 Connections Backend Delivery]]: backend main ebdca36 pushed and deployed; until then a scanned card (s44) answers 400 qrToken should not exist and its Connect reads Coming soon; the client side is built (social_pin d4cbd1f) and switches on by itself after the deploy", "[[S-23 Connections Story]]: S9, s47's checklist still lists a Ring that has not started yet (only ended and archived Rings are left out)", "[[S-23 Connections Story]]: S5, s46 offers my own live Rings only, not the Rings I manage as a MEMBER_MANAGER admin under their owner's name"]
created: 2026-11-09
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/connections, layer/frontend]
---

# ✅ Connections · Frontend Delivery

**Feature:** [[F-14 Connections]] · **Status:** Done · **Built from:** [[BI-16 Connections Backend Integration]] · **Against:** [[S-23 Connections Story]] · **Requirements:** [[FR-14 Connections Frontend Requirements]] · **QA:** [[Connections QA Frontend]]

What the client shipped for asking, answering and keeping connections, on `social_pin` `rings/F-11/honest-rings`, not on `main` yet: first @ `f70c791` (2026-11-09) against backend `main` `1c460b0`, then @ `0005f00` (2026-11-09, with `f801aaa`, `f9c19e3` and `d4cbd1f` before it) against backend `main` `ebdca36` as [[BI-16 Connections Backend Integration]] describes it. `ebdca36` is local and not pushed yet, so what it adds (Connect, Block and the relationship by `qrToken`) is built in the app but not switched on. The work and what is left are tracked in the client's `docs/gap-reviews/BI-16 Connections gap review.md` (CN1–CN13). Unit and widget tests only so far; not yet tried on a device.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s43\|s43]] Scanner · *Enter a Pin name* | ✅ | Another person's Pin name opens their card (s44); **my own** Pin name opens View as on my default Ring, marked as a preview, with no *Connect* (S1). `0005f00`. |
| [[Screen Index#s44\|s44]] A person's card | ✅ | Opens by Ring (Shared with me), by Pin name (*Enter a Pin name* on the scanner) or by user id (an Incoming row). The bar under the card follows the relationship: **Connect** · **Requested → Cancel request** · **Not accepted / Request expired → Connect again** · **{name} asked to connect → Accept** (s46) · **Connected**. *Connect* and *Connect again* first open a **note** sheet (optional, up to 200 characters with a live `used/200` counter; a 201st character can't be typed), then read **Sending…** until the server answers; a failure says "Couldn't send your request. Try again." and stays *Connect*, nothing queued (`0005f00`). **Connected** opens their Connection detail (s47): by the card's user id, or, on a card that has none, by finding the Pin name among my contacts (`GET /connections?q=`, exact, case-insensitive); not found, nothing opens (`0005f00`). A stale button (already connected, they asked first, the request gone) reads the relationship again instead of erroring. ⋯ **Block**, asked first, by Pin name; it leaves the card with "Blocked." Several versions of a connection: the **perspectives switcher** (View 1 / View 2, never Ring names): by user id from `/perspectives`, by Ring with the row's Ring as View 1 and the others after it (`f801aaa`) (S1, S2, S7, S13). |
| [[Screen Index#s44\|s44]] after a scan | 🟡 | Built on `d4cbd1f`: while the code is live (server clock before `expiresAt`) the bar, *Connect* and ⋯ *Block* go by the scanned `qrToken`, never the Pin name (D-10); a refusal is the neutral 404, past 20 a minute "Slow down" (429); after `expiresAt`, "This code has expired. Scan {name} again to connect." and nothing is sent. **Not switched on yet:** the backend that takes `qrToken` (`ebdca36`) is not pushed or deployed, so the calls answer 400 "property qrToken should not exist"; the app reads that as *Connect* off, "coming soon", no Block, remembers it for the app run and asks again on the next start, so it switches on by itself after the deploy. |
| [[Screen Index#s45\|s45]] Requests | ✅ | **Incoming · N** and **Sent · N** from the API, paged. An Incoming row shows **where from** when known ("Scanned your badge", "Found you by Pin name", …), the note and when; tapping it opens their card by user id with every version they share with me, *Accept* under it (`f801aaa`, `0005f00`). Incoming ✕ **Decline** is sent only after a 5-second Undo. Sent rows read *Pending*, **Not accepted** or **Request expired** with **Connect again**, *Cancel* on a pending one. Reloaded after every change and when the app comes back (S3, S4, S6). |
| [[Screen Index#s46\|s46]] Accept into a Ring | ✅ | Their **note** in a panel; my **live** Rings (active, not past their end, archived and deleted left out) with their member counts, **Event Rings not offered** (no request says which event it came from yet); **my default Ring picked** to start; **+ New Ring** opens the wizard and comes back with the new Ring picked (the one that wasn't there before; closing the wizard keeps the pick); an optional access window with **the picked Ring's own end** beside it ("This Ring ends …"); **Decline** on the sheet, which closes it and runs Requests' decline with its Undo; *Not now*; one accept (*Adding…*, never optimistic), then the **accept motion**: their photo slides from the card into the picked Ring's avatar, a short fade with reduced motion; then Connection detail from the answer; every accept error has its message (S5, S6; `0005f00`). |
| [[Screen Index#s47\|s47]] Connection detail | ✅ | The person, with their Pin name, **"Connected today" / "Connected 4 Nov 2026"** and **how we met** when known ("Met by a badge scan", "Met by Pin name"); a member who isn't a connection reads as a member ([[D-29 Connection detail opens a member who is not a connection]]). My Rings that have not ended as chips (tick adds, untick removes; see *Not done yet* for a Ring not started), each Ring's window editable ("Until removed", "Lapsed 12 Nov"); after a tick, untick or window, **"What they see just changed."** Unticking a connection's **last** Ring asks [[D-15 Several Rings per connection, remove or disconnect]]'s choice, *Remove from Rings* or *Disconnect* (`f9c19e3`). **What they can see** from the oldest live Ring's card; **what they share with me** opens the perspectives; the mutual count (hidden at 0). **Introduce** shown disabled, "Not available yet"; *Request meeting* hidden. ⋯ holds **Disconnect** (a real connection only, D-29) and **Block**, each asked first (`0005f00`). **Revoke access**, a button on the page (S-16 S5, `f9c19e3`): asks first, then for a connection D-15's choice, and takes them out of every Ring of mine (S9, S11, S13). |
| [[Screen Index#s68\|s68]] Me · Contacts | ✅ | "Connections · N" under YOUR PIN opens **Contacts**: server search (debounced), **No Ring yet**, each row with **"Connected {date}"** (`0005f00`), "No access" on a person in none of my Rings, a "Requests · N" link. The profile card reads "· N connections" (S8, S14). |
| [[Screen Index#s68\|s68]] Me · Blocked people | ✅ | The list, **Unblock** asked first; no photo (the API sends none) (S13). |
| [[Screen Index#s11\|s11]] Home | ✅ | The pending count as a badge on the Requests tile, read at most once a minute and again when Requests closes (S14). |
| [[Screen Index#s19\|s19]] New Ring · step 2 | ✅ | Pick people from my connections (search, No Ring yet); they are added once the Ring exists, and a failed add never fails the Ring (S12). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /views/pin/:pinName` | s44 by Pin name | The card; a 404 shows "This profile isn't available to you." |
| `GET /connections/relationship?pinName=` | s44 | The button's state and `requestId`. |
| `GET /connections/relationship?qrToken=` | s44 after a scan | Built (`d4cbd1f`), only while the code is live; off until the backend takes `qrToken` (a 400 "should not exist" turns it off for the app run). |
| `POST /connections/requests` | s44, s45 Sent | `{ pinName, note? }`, `{ qrToken, note? }` after a scan (built, off until the deploy), or `{ againFor, note? }` to ask again; 201 and 200 both mean sent; a 409 reads the relationship again. |
| `GET /views/user/:userId/perspectives` | s44 by user id or by Ring, s47 | The versions they share with me, View 1 / View 2 (`f801aaa`). |
| `DELETE /connections/requests/:id` | s44, s45 Sent | Cancel; 204. |
| `GET /connections/requests?direction=incoming\|sent` | s45, s11 (`limit=1`) | Paged; `meta.total` for the tabs and the badge. |
| `POST /connections/requests/:id/decline` | s45 Incoming | After the 5-second Undo; 200, no body. |
| `POST /connections/requests/:id/accept` | s46 | `{ ringId, startsAt?, expiresAt? }`; 201; never optimistic. |
| `GET /connections?q=&noAccess=` | Contacts, s19, s44 *Connected* | Debounced search on the server; paged. On s44, `q=` the card's Pin name, `limit=50`, the exact match's `userId` opens s47. |
| `GET /rings` | s46 | My Rings, filtered on the phone: active, not past `expiresAt`, not an Event or Mini-event Ring; read again after *+ New Ring*. |
| `GET /connections/count` | Me | "N connections". |
| `GET /connections/:userId` | s47 | `mutualCount`, my Rings they're in with their windows. |
| `DELETE /connections/:userId` | s47 | Disconnect; 204; never announced ([[D-26 A disconnect is not announced]]). |
| `POST /blocks`, `GET /blocks`, `DELETE /blocks/:id` | s44, s47, Blocked people | Block by `pinName` or `userId`, or `{ qrToken }` after a scan (built, off until the deploy); unblock 204. |
| `POST / PATCH / DELETE /rings/:ringId/members…` | s47 chips and windows, s19 | The Ring members routes. |

## State kept on the client

- No person's user id is held before an accept: the card keeps the Pin name and sends it.
- After an accept, disconnect, block or unblock, Contacts, Requests, the pending count, Blocked people, Shared with me and My Rings' member counts are read again; a block also drops that person's cached cards. Sign-out drops everything.
- A list page that answers after a refresh is dropped, so an old search never lands in the new list.
- Nothing counts the 30 days on the phone: `expiresAt` and the Sent list decide ([[D-27 Sent keeps declined and expired requests for 30 days]]).
- Whether the backend takes `qrToken` yet is kept in memory for the app run (`ScanAddressing`), never on disk; the next start asks once more. A scanned code is never logged (`0005f00` redacts it in debug logs).
- A card opened by Ring that finds the person among my contacts by Pin name keeps the found user id for its perspectives, and looks again on every read until found.

## Deviations from the story or the integration note

- **Contacts lives on Me** ([[Screen Index#s68\|s68]], "Connections · N"), not on Discover ([[Screen Index#s38\|s38]]), which isn't built.
- **Scanned Pin's *Connect* still says Coming soon**, now only because the backend that takes `qrToken` ([[BD-14 Connections Backend Delivery]], backend `main` `ebdca36`) is not pushed or deployed: the app sends the code (`d4cbd1f`) and switches on by itself after the deploy. *Connect* no longer opens Pick a Ring: the receiver picks the Ring, on accept.
- **s47 also carries *Revoke access* as a button on the page** ([[S-16 Ring Members Story|Ring Members · S5]], `f9c19e3`): for a connection it ends in D-15's choice, so *Disconnect* is reachable from it as well as from ⋯, while [[S-23 Connections Story|Connections · S11]] says *Disconnect* is never a button on the page. Flagged on the story.
- **s47's checklist leaves out ended and archived Rings, not Rings that have not started yet**, while [[S-23 Connections Story|Connections · S9]] (decided 2026-11-09) lists live Rings only. Pending.

The other decisions of 2026-11-09 match the app: the request states read **"Not accepted"** and **"Request expired"** on s44 and on Sent (S2, S4); *Disconnect* is in ⋯ beside *Block*, for a connection only (S11); *Scan someone in* is not shown on a Ring's People tab (s15, S12, [[D-28 Scan someone in is not in the MVP]]).

## Not done yet

- **Connect, Block and the relationship after a scan** switch on once backend `ebdca36` is deployed → [[BD-14 Connections Backend Delivery]], [[S-37 Badge & QR Story|Badge & QR · S18]].
- **A Ring that has not started yet** is still listed on s47 ([[S-23 Connections Story|Connections · S9]]).
- **Admins' Rings on s46**: Rings I manage as a `MEMBER_MANAGER` admin are not offered under their owner's name ([[S-23 Connections Story|Connections · S5]]).
- Gemma's suggested Ring on s46 → [[S-89 Gemma AI Story|Gemma AI · S7]]; the default Ring is picked until then.
- The event a request came from (and the Event Ring offered for it on s46), photos on Blocked people → [[S-23 Connections Story|Connections · S15]] and v1.

## Log

- 2026-11-09 · `rings/F-11/honest-rings` @ `f70c791` (social_pin, not on `main` yet) · s44 the card by Pin name with the relationship button and Block; s45 Incoming and Sent with Undo; s46 accept into a live Ring; s47 Connection detail; Me Contacts, Blocked people and the count; Home's pending badge; s19 from connections; 59 tests · flagged [[BI-16 Connections Backend Integration]] for its checklist
- 2026-11-09 · `rings/F-11/honest-rings` @ `0005f00` (social_pin, with `f801aaa`, `f9c19e3`, `d4cbd1f`; not on `main` yet) · S1, S2, S3, S5, S6, S8, S9, S11, S13 · s43 my own Pin name opens View as; s44 note sheet and *Sending…*, *Connected* opens s47, perspectives switcher, Connect / Block / relationship by `qrToken` built (off until backend `ebdca36` deploys); s45 where from, Incoming row opens the card; s46 note, default Ring, Decline, the Ring's end, no Event Rings, + New Ring comes back picked, accept motion; s47 connected date and how we met, ⋯ Disconnect / Block, Introduce disabled, "What they see just changed", D-15 last-Ring sheet and Revoke access; Contacts connected date · the 2026-11-09 decisions checked: request states, ⋯ Disconnect and no *Scan someone in* match; s47 still lists a not-started Ring (pending) · cleared the [[BD-14 Connections Backend Delivery]] flag (client built, deploy pending) · flagged [[S-23 Connections Story]]: Revoke access on the page reaches Disconnect, and the not-started Ring on s47
