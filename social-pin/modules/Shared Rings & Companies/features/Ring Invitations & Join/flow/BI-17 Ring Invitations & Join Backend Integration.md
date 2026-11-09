---
id: BI-17
type: backend-integration
module: shared-rings
feature: ring-invitations
status: current
scope: feature
screens: [s15, s17, s19, s26, s43, s74]
depends: ["BD-17 Ring Invitations & Join Backend Delivery"]
affects: ["FR-17 Ring Invitations & Join Frontend Requirements"]
related: ["S-33 Ring Invitations & Join Story", "BI-08 Rings Backend Integration", "FR-15 Companies Frontend Requirements", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "D-32 Several join codes per Ring", "D-35 A join code can be shown as a QR", "D-36 Who it's for stays the owner's alone", "GET /rings/shared-with-me", "GET /rings/invitations/mine", "POST /rings/invitations/:id/accept", "POST /rings/join-codes/resolve", "POST /rings/join-codes/join", "GET /rings/join-requests/mine", "DELETE /rings/join-requests/:id"]
pending: []
created: 2026-11-08
updated: 2026-11-09
tags: [backend-integration, backend-integration/current, module/shared-rings, layer/backend]
---

# 🔌 Ring Invitations & Join · Backend Integration

> Blocked by default until [[BD-17 Ring Invitations & Join Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-17 Ring Invitations & Join]] · **Backend:** [[BD-17 Ring Invitations & Join Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

How the app calls invitations, join codes and join requests, as on backend `main` `1c460b0`. All routes are under `/api/v1`, signed in (`Authorization: Bearer <access token>`).

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s17|s17]] Shared with me | opens the tab, resumes the app | `GET /rings/shared-with-me` · `GET /rings/invitations/mine` · `GET /rings/join-requests/mine`, each on its own |
| [[Screen Index#s17|s17]] | *Review* an invitation | → s74 with the invitation row already loaded (no read by id) |
| [[Screen Index#s17|s17]] | *Dismiss* an invitation with `valid: false` | `POST /rings/invitations/:id/dismiss` |
| [[Screen Index#s17|s17]] / [[Screen Index#s72|s72]] | *Cancel* a pending request, *Dismiss* a declined one | `DELETE /rings/join-requests/:id` |
| [[Screen Index#s74|s74]] | *Join Ring* on an invitation | `POST /rings/invitations/:id/accept` → open `GET /views/ring/:ringId` |
| [[Screen Index#s74|s74]] | *Decline* | `POST /rings/invitations/:id/decline` |
| [[Screen Index#s74|s74]] | types a code, submits | `POST /rings/join-codes/resolve` `{ code }` → the review |
| [[Screen Index#s74|s74]] | *Join Ring* on a code's review | `POST /rings/join-codes/join` `{ code }` |
| [[Screen Index#s43|s43]] Scanner | reads `socialpin://join/…` | the same two code routes, with the scanned text as `code` |
| [[Screen Index#s15|s15]] / [[Screen Index#s19|s19]] | *Invite* | `POST /rings/:ringId/invitations` |
| [[Screen Index#s15|s15]] | Invited · N, *Withdraw* | `GET /rings/:ringId/invitations` · `POST /rings/:ringId/invitations/:id/withdraw` |
| [[Screen Index#s15|s15]] | Waiting on you · N, *Add*, *Decline* | `GET /rings/:ringId/join-requests` · `POST /rings/:ringId/join-requests/:id/approve` · `POST /rings/:ringId/join-requests/:id/decline` |
| [[Screen Index#s26|s26]] Joining → Join codes | the list, *Make a new code*, *Turn off* | `GET /rings/:ringId/join-codes` · `POST /rings/:ringId/join-codes` · `POST /rings/:ringId/join-codes/:codeId/turn-off` |
| [[Screen Index#s26|s26]] | *Show as QR* | draw the code's `qrPayload`, with `displayCode` under it |

## Flow

1. **Invitation:** the owner (or an admin, or a member while the Ring lets members invite) sends one → it shows in the invitee's `GET /rings/invitations/mine` → *Join Ring* = accept → the answer's `ringId` opens the card → refetch s17: the owner's row carries `ringName` when this is the first of their Rings the invitee is in. A row opens the Ring the viewer was put in **first**, however it was made (D-15, the same Ring as `GET /views/pin`): if the owner had already placed them in an older Ring, the row stays on that one, with no `ringName`, and the joined Ring is the next perspective (`GET /views/user/:userId/perspectives`). Awaiting the PM's confirmation ([[BD-17 Ring Invitations & Join Backend Delivery]]).
2. **Code, approval on (the default):** resolve → review ("Join Acme Team?", `requireApproval: true`) → join → `{ outcome: "REQUESTED", requestId }` → "Request sent: {owner} will approve it" → the request is in `GET /rings/join-requests/mine` as `PENDING` → the owner approves on s15 → it leaves my list and the Ring is on Shared with me, named.
3. **Code, approval off:** resolve → review (`requireApproval: false`) → join → `{ outcome: "JOINED", ringId }` → open the card.
4. After accept, decline, dismiss, cancel or join: refetch the three s17 lists (and s72).

## Shapes that matter

`GET /rings/invitations/mine` (newest first, `{ data, meta: { total } }`):

```json
{ "id": "uuid", "ringName": "Acme Team",
  "owner": { "pinName": "AcmeStudio", "displayName": "Acme Studio", "headline": null, "avatarUrl": "https://…" },
  "invitedBy": { "pinName": "SaraAz", "displayName": "Sara Azzam", "headline": null, "avatarUrl": null },
  "startsAt": null, "expiresAt": "2027-01-01T00:00:00.000Z",
  "lapsesAt": "2026-12-08T10:00:00.000Z", "createdAt": "2026-11-08T10:00:00.000Z",
  "valid": true, "business": { "id": "uuid", "name": "Acme Studio", "logoFileId": null } }
```

No `ringId`, colour, type or purpose. `invitedBy` is `null` when that account is gone; `business` is `null` unless it's a company Ring.

`POST /rings/invitations/:id/accept` → `{ "ringId": "uuid", "ringName": "Acme Team" }`.

`POST /rings/join-codes/resolve` → `{ "ringName": "Acme Team", "owner": { … }, "requireApproval": true, "business": null }`.

`POST /rings/join-codes/join` → `{ "outcome": "JOINED" | "REQUESTED", "ringName": "Acme Team", "ringId": "uuid" | null, "requestId": "uuid" | null }`.

`GET /rings/join-requests/mine` → rows `{ "id", "status": "PENDING" | "DECLINED", "createdAt", "ringName", "business" }`.

`GET /rings/shared-with-me` (changed): a row I joined knowingly has `ringName` set, and `memberCount` set when the Ring lets members see each other; a Ring I was placed in keeps both `null`. Each row is the Ring I was put in first of that person's (D-15), so these are set only when that first Ring was joined knowingly.

Owner side:

- an invitation: `{ id, ringId, inviteeUserId, invitee: { pinName, displayName, headline, avatarUrl }, invitedById, status, startsAt, expiresAt, lapsesAt, respondedAt, createdAt, updatedAt }`;
- a code: `{ id, ringId, code: "K7QM4RXT", displayCode: "K7QM-4RXT", qrPayload: "socialpin://join/K7QM4RXT", label, endsAt, useLimit, useCount, state: "ACTIVE" | "OFF" | "ENDED" | "USED_UP", turnedOffAt, createdById, createdAt, updatedAt }`;
- a request: `{ id, ringId, userId, person: { … }, codeLabel: "Onboarding week", status, createdAt }`;
- approve answers the membership, with `origin: "JOIN_REQUEST"`.

Request bodies:

- invite: `{ "userId": "uuid" }` **or** `{ "pinName": "SamKassem" }`, plus optional `startsAt` / `expiresAt` (ISO);
- make a code: `{ "label": "Onboarding week", "endsAt"?: ISO, "useLimit"?: 1–100000 }`;
- a code: `{ "code": "k7qm-4rxt" }`, any case, dash optional, or the scanned QR text.

## State to keep on the client

- Lists keyed by the signed-in user (invitations, my requests) and by `ringId` (a Ring's invitations, requests, codes). Refetch on focus and after each action; no polling.
- Keep `ringId` as an opaque handle: never show or compare it.
- Hold the typed code only until the review answers; send it again with *Join Ring*.

## Errors to handle

The body has no `ErrorCode` yet ([[S-87 Error Contract Story|Error Contract]]); the code below is the server's name for it. Branch on the status, and the message where two share a status.

| Status | ErrorCode | Meaning | Show |
|---|---|---|---|
| 404 | `E_RING_JOIN_CODE_01` | the code doesn't work: wrong, off, ended, used up, invitation-only, your own, blocked | "This code doesn't work", whatever the cause |
| 429 | `E_RING_JOIN_CODE_02` | 10 failed codes in 15 minutes | "Too many tries. Try again later." |
| 409 | `E_RING_MEMBER_01` | already a member (code join; owner's invite) | open the card |
| 409 | `E_RING_JOIN_REQUEST_02` | already asked to join | "Request sent" state |
| 404 | `E_RING_ACCESS_02` | accept on a Ring that ended or was deleted | "This invitation is no longer valid", *Dismiss* |
| 404 | `E_RING_INVITATION_01` | invitation not found, answered, withdrawn or lapsed | drop it on refetch |
| 409 | `E_RING_INVITATION_06` | dismiss on a still-valid invitation | offer accept / decline |
| 409 | `E_RING_INVITATION_02` | this person can't be invited | "Can't invite this person" |
| 409 | `E_RING_INVITATION_03` | already invited (owner and admins only) | "Already invited" |
| 403 | `E_RING_INVITATION_04` | you may not invite to this Ring | hide *Invite* |
| 400 | `E_RING_INVITATION_05` / `07` | exactly one of userId and pinName / a bad window | inline |
| 409 | `E_RING_03` | invite to a Ring that has ended | inline |
| 409 | `E_RING_JOIN_CODE_03` | 10 active codes already | "Turn a code off first" |
| 409 | `E_RING_JOIN_CODE_04` | codes are off: the Ring joins by invitation only | hide the list |
| 400 | `E_RING_JOIN_CODE_06` / — | end date not in the future / a bad label or limit | inline |
| 404 | `E_RING_JOIN_CODE_05` · `E_RING_JOIN_REQUEST_01` | no such code / request | refetch |
| 409 | `E_RING_MEMBER_04` | approve across a block | drop the request on refetch |
| 403 | `E_RING_05` | not the owner or an admin (lists, codes, decisions) | hide the owner's sections |

## Rules the UI must respect

- An invitation and a code review show the Ring's **name** only: never its colour, type or `purpose` (D-36), and never a code's label to anyone but the owner.
- One message for every code that doesn't work; never branch the copy on why.
- Uppercase and strip spaces and the dash before showing the code back grouped (K7QM-4RXT); the server takes any form, so don't validate the shape.
- A pending invitation or request is never a member: don't count or list it as one.
- The owner's *Invite* works under every "who can request to join"; *Join codes* is hidden under "only by invitation" (the codes are kept).
- After *Join Ring* go to Shared with me (s17), not My Rings.

## Not available yet

- "Your card in <Ring>" (the picked Ring): → [[S-33 Ring Invitations & Join Story|S-33 S10]].
- The members' roster inside a Ring, and *Leave this Ring*: → [[S-33 Ring Invitations & Join Story|S-33 S11]].
- Notifications: → [[S-33 Ring Invitations & Join Story|S-33 S12]].
- Work email: not in this version ([[S-33 Ring Invitations & Join Story|S-33 S4]]).

## Checklist

- [ ] s17 loads people, invitations and my requests separately; one failing doesn't blank the others
- [ ] a joined-knowingly row shows "Acme Team · Shared by …"; "· N people" only when `memberCount` is not null
- [ ] accept opens `GET /views/ring/:ringId`, then s17
- [ ] code entry: any case, dash optional; one neutral message; 429 has its own message
- [ ] the scanner routes `socialpin://join/` to the code review, and a badge (`https://socialpin.me/q/<token>`, [[F-18 Badge & QR]]) to the badge flow; a badge never offers a Ring to join
- [ ] s15 shows Invited (with Withdraw) and Waiting on you (code label, Add, Decline), never as members
- [ ] s26 Join codes: list, make (label ≤ 40, end date, limit), turn off, Share (`displayCode`), Show as QR (`qrPayload`)

## Log

- 2026-11-08 · `docs/backend/M-03-shared-rings/F-17-ring-invitations/BI-17-draft` · written as a draft against the backend branch `FR-17/ring-invitation/invitations-codes-origin` @ `21899a6`
- 2026-11-08 · backend `main` `1c460b0` (the merge of that branch) · matches `main`: the routes, shapes, errors and rules above, unchanged by the merge; → current. The badge payload F-18 shipped (`https://socialpin.me/q/<token>`) added to the scanner checklist line
- 2026-11-09 · `docs/backend/M-03-shared-rings/F-17-ring-invitations/BI-17-d-15-first-ring` · matches backend `main` `d8267d3`: after *Join Ring* the Shared with me row names the Ring only when it is the invitee's first Ring of that owner; the row opens the oldest membership however it was made (D-15), no longer a Ring joined knowingly first. No shape changed.
