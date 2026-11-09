---
id: FD-13
type: frontend-delivery
module: connections
feature: connections
status: done
scope: feature
deployedTo: []
screens: [s11, s19, s44, s45, s46, s47, s68]
owner: "Omar Fostok"
depends: ["BI-16 Connections Backend Integration"]
affects: []
related: ["FR-14 Connections Frontend Requirements", "S-23 Connections Story", "BD-14 Connections Backend Delivery", "D-10 Connect sends what the requester already has", "D-13 The requester sees a declined request", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-24 One pending request per pair", "D-26 A disconnect is not announced", "D-27 Sent keeps declined and expired requests for 30 days", "D-29 Connection detail opens a member who is not a connection", "FD-06 Counts Frontend Delivery", "FD-10 Ring Access Engine Frontend Delivery", "FD-12 Rings Frontend Delivery", "S-37 Badge & QR Story", "GET /views/pin/:pinName"]
pending: []
created: 2026-11-09
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/connections, layer/frontend]
---

# ✅ Connections · Frontend Delivery

> ⚠ Affected by [[BD-14 Connections Backend Delivery]] (2026-11-09): Connect, Block and the card's button after a scan exist on backend main ebdca36 (local, not pushed yet): POST /connections/requests { qrToken }, POST /blocks { qrToken }, GET /connections/relationship?qrToken= (s44); every refusal is the views' 404 E_RING_ACCESS_01, 429 E_BADGE_01 past 20 a minute; shapes in BI-16. A deleted account now leaves contacts, Sent, Incoming and Blocked people (D-25)

**Feature:** [[F-14 Connections]] · **Status:** Done · **Built from:** [[BI-16 Connections Backend Integration]] · **Against:** [[S-23 Connections Story]] · **Requirements:** [[FR-14 Connections Frontend Requirements]] · **QA:** [[Connections QA Frontend]]

What the client shipped for asking, answering and keeping connections, on `social_pin` `rings/F-11/honest-rings` @ `f70c791` (2026-11-09), not on `main` yet, against backend `main` `1c460b0`. The work and what is left are tracked in the client's `docs/gap-reviews/BI-16 Connections gap review.md` (CN1–CN13). Unit and widget tests only so far (59 new); not yet tried on a device.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s44\|s44]] A person's card | ✅ | Opens by Ring (Shared with me) **or by Pin name** (*Enter a Pin name* on the scanner). The bar under the card follows the relationship: **Connect** · **Requested → Cancel request** · **Not accepted / Request expired → Connect again** · **{name} asked to connect → Accept** (s46) · **Connected**. A stale button (already connected, they asked first, the request gone) reads the relationship again instead of erroring. ⋯ **Block**, asked first, by Pin name; it leaves the card with "Blocked." (S1, S2, S13). |
| [[Screen Index#s44\|s44]] after a scan | 🟡 | *Connect* says Coming soon: Connect after a scan needs the badge's `qrToken` (see *Deviations*). |
| [[Screen Index#s45\|s45]] Requests | ✅ | **Incoming · N** and **Sent · N** from the API, paged. Incoming ✕ **Decline** is sent only after a 5-second Undo. Sent **Cancel**, and **Connect again** on a declined or expired one. Reloaded after every change and when the app comes back (S3, S4, S6). |
| [[Screen Index#s46\|s46]] Accept into a Ring | ✅ | My **live** Rings with their member counts, an optional access window, one accept, then Connection detail from the answer; every accept error has its message (S5). |
| [[Screen Index#s47\|s47]] Connection detail | ✅ | The person, my live Rings as chips (tick adds, untick removes), each Ring's window editable, **What they can see** from the oldest live Ring's card, the mutual count (hidden at 0), **Disconnect** only for a real connection ([[D-29 Connection detail opens a member who is not a connection]]), ⋯ **Block** (S9, S11, S13). |
| [[Screen Index#s68\|s68]] Me · Contacts | ✅ | "Connections · N" under YOUR PIN opens **Contacts**: server search (debounced), **No Ring yet**, "No access" on a person in none of my Rings, a "Requests · N" link. The profile card reads "· N connections" (S8, S14). |
| [[Screen Index#s68\|s68]] Me · Blocked people | ✅ | The list, **Unblock** asked first; no photo (the API sends none) (S13). |
| [[Screen Index#s11\|s11]] Home | ✅ | The pending count as a badge on the Requests tile, read at most once a minute and again when Requests closes (S14). |
| [[Screen Index#s19\|s19]] New Ring · step 2 | ✅ | Pick people from my connections (search, No Ring yet); they are added once the Ring exists, and a failed add never fails the Ring (S12). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /views/pin/:pinName` | s44 by Pin name | The card; a 404 shows "This profile isn't available to you." |
| `GET /connections/relationship?pinName=` | s44 | The button's state and `requestId`. |
| `POST /connections/requests` | s44, s45 Sent | `{ pinName }`, or `{ againFor }` to ask again; 201 and 200 both mean sent; a 409 reads the relationship again. |
| `DELETE /connections/requests/:id` | s44, s45 Sent | Cancel; 204. |
| `GET /connections/requests?direction=incoming\|sent` | s45, s11 (`limit=1`) | Paged; `meta.total` for the tabs and the badge. |
| `POST /connections/requests/:id/decline` | s45 Incoming | After the 5-second Undo; 200, no body. |
| `POST /connections/requests/:id/accept` | s46 | `{ ringId, startsAt?, expiresAt? }`; 201; never optimistic. |
| `GET /connections?q=&noAccess=` | Contacts, s19 | Debounced search on the server; paged. |
| `GET /connections/count` | Me | "N connections". |
| `GET /connections/:userId` | s47 | `mutualCount`, my Rings they're in with their windows. |
| `DELETE /connections/:userId` | s47 | Disconnect; 204; never announced ([[D-26 A disconnect is not announced]]). |
| `POST /blocks`, `GET /blocks`, `DELETE /blocks/:id` | s44, s47, Blocked people | Block by `pinName` or `userId`; unblock 204. |
| `POST / PATCH / DELETE /rings/:ringId/members…` | s47 chips and windows, s19 | The Ring members routes. |

## State kept on the client

- No person's user id is held before an accept: the card keeps the Pin name and sends it.
- After an accept, disconnect, block or unblock, Contacts, Requests, the pending count, Blocked people, Shared with me and My Rings' member counts are read again; a block also drops that person's cached cards. Sign-out drops everything.
- A list page that answers after a refresh is dropped, so an old search never lands in the new list.
- Nothing counts the 30 days on the phone: `expiresAt` and the Sent list decide ([[D-27 Sent keeps declined and expired requests for 30 days]]).

## Deviations from the story or the integration note

- **Contacts lives on Me** ([[Screen Index#s68\|s68]], "Connections · N"), not on Discover ([[Screen Index#s38\|s38]]), which isn't built.
- **Scanned Pin's *Connect* says Coming soon.** The app doesn't send the badge's `qrToken` yet, and the backend refuses Connect and Block by `qrToken` until [[BD-14 Connections Backend Delivery]]'s pending item ships. *Connect* no longer opens Pick a Ring: the receiver picks the Ring, on accept.

## Not done yet

- **Unticking someone's last Ring** on s47 removes them from that Ring; the choice [[D-15 Several Rings per connection, remove or disconnect]] asks for (*Remove from Rings* or *Disconnect*) is not offered yet ([[S-23 Connections Story|Connections · S11]]).
- **Tapping an Incoming row** opens nothing: no screen shows someone's perspectives yet ([[S-23 Connections Story|Connections · S3]]).
- **Connect and Block after a scan** → [[BD-14 Connections Backend Delivery]] (`qrToken`), [[S-37 Badge & QR Story|Badge & QR · S18]].
- The event a request came from, admins' Rings on s46, photos on Blocked people → [[S-23 Connections Story|Connections · S15]] and v1.

## Log

- 2026-11-09 · `rings/F-11/honest-rings` @ `f70c791` (social_pin, not on `main` yet) · s44 the card by Pin name with the relationship button and Block; s45 Incoming and Sent with Undo; s46 accept into a live Ring; s47 Connection detail; Me Contacts, Blocked people and the count; Home's pending badge; s19 from connections; 59 tests · flagged [[BI-16 Connections Backend Integration]] for its checklist
