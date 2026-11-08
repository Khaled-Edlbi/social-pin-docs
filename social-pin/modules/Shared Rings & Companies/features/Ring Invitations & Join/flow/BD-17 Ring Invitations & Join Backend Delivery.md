---
id: BD-17
type: backend-delivery
module: shared-rings
feature: ring-invitations
status: in-progress
scope: feature
screens: [s15, s17, s19, s26, s43, s74]
depends: ["FR-17 Ring Invitations & Join Frontend Requirements", "S-33 Ring Invitations & Join Story"]
affects: ["BD-11 Rings Backend Delivery", "BD-08 Ring Access Engine Backend Delivery"]
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "D-32 Several join codes per Ring", "D-33 Work email joining waits for real emails and Companies", "D-34 A member shows one of their own Rings", "D-35 A join code can be shown as a QR", "D-36 Who it's for stays the owner's alone", "FR-15 Companies Frontend Requirements", "S-37 Badge & QR Story", "GET /rings/shared-with-me", "GET /rings/invitations/mine", "POST /rings/invitations/:id/accept", "POST /rings/invitations/:id/decline", "POST /rings/invitations/:id/dismiss", "GET /rings/:ringId/invitations", "POST /rings/:ringId/invitations", "POST /rings/:ringId/invitations/:id/withdraw", "POST /rings/join-codes/resolve", "POST /rings/join-codes/join", "GET /rings/:ringId/join-codes", "POST /rings/:ringId/join-codes", "POST /rings/:ringId/join-codes/:codeId/turn-off", "GET /rings/join-requests/mine", "DELETE /rings/join-requests/:id", "GET /rings/:ringId/join-requests", "POST /rings/:ringId/join-requests/:id/approve", "POST /rings/:ringId/join-requests/:id/decline"]
created: 2026-10-18
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/in-progress, module/shared-rings, layer/backend]
---

# 🟡 Ring Invitations & Join · Backend Delivery

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** In progress · **Integration guide:** [[Ring Invitations & Join Backend Integration]] · **Requirements:** [[FR-17 Ring Invitations & Join Frontend Requirements]] · **QA:** [[Ring Invitations & Join QA Backend]]

What the backend built for [[S-33 Ring Invitations & Join Story]] S1–S3 and S5–S9 and how it works. **Not on `main` yet:** everything below is on the backend branch `FR-17/ring-invitation/invitations-codes-origin` @ `21899a6` (from `main` `cb95a39`), pushed, not merged. Until the merge, `main` has none of it, and `ringName` / `memberCount` on Shared with me stay `null`.

## Endpoints, tables and code

**Endpoints** (all signed in, `/api/v1`; literal routes declared before `/:ringId`)

| Endpoint | Who | Story |
|---|---|---|
| `GET /rings/invitations/mine` | the invitee | S1 |
| `POST /rings/invitations/:id/accept` | the invitee | S2 |
| `POST /rings/invitations/:id/decline` | the invitee | S2 |
| `POST /rings/invitations/:id/dismiss` | the invitee, an invalid invitation only | S1 |
| `GET /rings/:ringId/invitations` | owner, admin ≥ `MEMBER_MANAGER` | S6 |
| `POST /rings/:ringId/invitations` | owner, admin ≥ `MEMBER_MANAGER`, a member while `membersCanInvite` | S6 |
| `POST /rings/:ringId/invitations/:id/withdraw` | whoever sent it, owner, admin | S6 |
| `POST /rings/join-codes/resolve` | anyone signed in | S3, S9 |
| `POST /rings/join-codes/join` | anyone signed in | S3, S9 |
| `GET /rings/:ringId/join-codes` | owner, admin | S7 |
| `POST /rings/:ringId/join-codes` | owner, admin | S7 |
| `POST /rings/:ringId/join-codes/:codeId/turn-off` | owner, admin | S7 |
| `GET /rings/join-requests/mine` | the person who asked | S5 (FR-15's name) |
| `DELETE /rings/join-requests/:id` | the person who asked | S5 (FR-15's name) |
| `GET /rings/:ringId/join-requests` | owner, admin | S8 |
| `POST /rings/:ringId/join-requests/:id/approve` | owner, admin | S8 |
| `POST /rings/:ringId/join-requests/:id/decline` | owner, admin | S8 |
| `GET /rings/shared-with-me` (changed) | anyone signed in | S1 |

**Tables / models:** `ring_members.origin` (new enum `RING_MEMBER_ORIGIN`: `PLACED` default, `INVITATION`, `JOIN_CODE`, `JOIN_REQUEST`); `ring_invitations` (`RING_INVITATION_STATUS`: `PENDING`, `ACCEPTED`, `DECLINED`, `WITHDRAWN`, `EXPIRED`); `ring_join_codes`; `ring_join_code_uses`; `ring_join_code_failed_attempts`; `ring_join_requests` (`RING_JOIN_REQUEST_STATUS`: `PENDING`, `APPROVED`, `DECLINED`, `CANCELLED`). One migration, `20261108150000_ring_invitations_and_join`, additive, with partial unique indexes (one `PENDING` invitation per Ring and person, one `PENDING` request per Ring and person) and CHECKs (code form, label 1–40, use limit ≥ 1, uses ≤ limit, window order).

**Code:** `src/modules/ring-invitation/` (new); `RingAccessService` (`isRingNamedToMember`, `ringOpenFilter` / `isRingOpen`, `joinPolicyAllowsCodes`, `assertCanInvite`, `ownerNotBlockedWithFilter`, the Shared with me row choice); `RingMemberService.admitKnowingly` and the `PLACED` writes in `add` / `reassign`.

**Error codes (new):** `E_RING_INVITATION_01`–`07`, `E_RING_JOIN_CODE_01`–`06`, `E_RING_JOIN_REQUEST_01`–`02`. On the wire the body still carries only `statusCode`, `message`, `error` until [[S-87 Error Contract Story|Error Contract]] ships.

## How it works

- **How a membership was made (D-18).** `RingMember.origin` defaults to `PLACED`, so every row made before F-17, and every row an owner add or a connection accept creates, stays placed. The three knowing ways in all write through `RingMemberService.admitKnowingly` with their origin. An owner add that re-activates a row, and a reassign, write `PLACED` explicitly (an upsert's update ignores the default; D-18 *Still open* reads a reassign as placed). `RingAccessService.isRingNamedToMember` is "origin is not `PLACED`".
- **Shared with me (S1).** Still one row per person (D-14). The row names its Ring (`ringName`) only when that membership is not `PLACED`, and gives `memberCount` only on a named row whose Ring has `membersCanSeeEachOther` on. **Which Ring a row opens:** the oldest membership the viewer joined knowingly, else the oldest one (D-15). This is a change: before, always the oldest. Without it, someone already placed in one of an owner's Rings would never see the Ring they then joined by name, which S-33 S2 asks for. The placed Ring is not named or hinted at; it is just not the one the row opens. **For the PM to confirm against D-15.**
- **Invitations (D-31).** An invitation is its own row; while `PENDING` it grants nothing (no card, no roster, no count, not on Shared with me). Who may send one is `RingAccessService.assertCanInvite`: the owner, an admin at `MEMBER_MANAGER` or above, or a member whose membership and Ring are live while `membersCanInvite` is on. It works whatever `joinPolicy` says. The person is named by `userId` or Pin name, exactly one. Every reason they can't be invited answers one body (`E_RING_INVITATION_02`): unknown, deleted, inactive, a block either way with the owner or the inviter, the owner, yourself. To a *member* inviting, "already in" and "already invited" answer that same body, so inviting never reads the roster. The owner and admins get `E_RING_MEMBER_01` / `E_RING_INVITATION_03`. An invitation **lapses** 30 days after it was sent (`lapsesAt`); every read filters it out, with no job to sweep it. A lapsed row is moved to `EXPIRED` when the same person is invited again. **Accept** is one transaction: the invitation becomes `ACCEPTED` and the membership is written with its window as `INVITATION`. On an ended or deleted Ring it answers 404 `E_RING_ACCESS_02` ("no longer valid"). `valid` on my list is the same test (`ringOpenFilter`: active, not deleted, not past its end; a Ring that has not started yet is still valid). **Dismiss** works only on an invalid one (`E_RING_INVITATION_06` otherwise). My list hides invitations from an owner I blocked or who blocked me.
- **Join codes (D-32, D-35).** A code is 8 characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no 0/O/1/I), generated with `crypto.randomInt` and stored without the dash. The code text is not a secret from the owner. Its state is computed, never stored: `OFF` beats `ENDED` beats `USED_UP`, else `ACTIVE`. Up to 10 `ACTIVE` codes per Ring (`E_RING_JOIN_CODE_03`); making one is refused under `INVITATION_ONLY` (`E_RING_JOIN_CODE_04`). Codes stay listed under any policy, and the client hides the list. **A code that doesn't work** (wrong, off, ended, used up, an ended or invitation-only Ring, the owner's own, a block with the owner, empty) gets one 404 body, `E_RING_JOIN_CODE_01` "This code doesn't work", and counts as a failed try. **Try limit (proposed here, D-32 left it to the backend):** 10 failed tries per person in a rolling 15 minutes, then 429 `E_RING_JOIN_CODE_02`. The failures are written outside any transaction, so the refusal can't roll them back. **A use** is one person: `ring_join_code_uses` holds (code, person) once, and the count goes up only on a first use, guarded so it never passes the limit. **Join** with approval on writes a `PENDING` join request recording the code (`REQUESTED`); with approval off it writes the membership as `JOIN_CODE` (`JOINED`).
- **How a join QR is told from a badge (D-35, S-33's question to `/backend`).** A join QR carries `socialpin://join/<CODE>` (`qrPayload` on each code). The scanner routes that prefix to `POST /rings/join-codes/resolve`, and the whole scanned text is accepted as `code`. Anything else is a badge for [[S-37 Badge & QR Story]]. Turning a code off stops its QR at once.
- **Join requests (S5, S8).** **Approve** is one transaction: `APPROVED` (guarded on `PENDING`, so two admins can't both decide) and the membership as `JOIN_REQUEST`. A block either way since they asked refuses it with `E_RING_MEMBER_04`. **Decline** → `DECLINED`. The person's `DELETE` cancels a pending request (`CANCELLED`) or dismisses a declined one; an approved request leaves their list. Turning approval off leaves the waiting ones to decide.
- **Never shown** to an invitee, a code holder or a requester: the Ring's id (until accept or `JOINED`), colour, type, `purpose` (D-36), settings, or a code's label. People are shown from their default profile (Pin name, name, headline, signed photo).

### What exists (on the branch)

- S1: my invitations with the Ring's name, owner, inviter, window, `valid` and `business`; my join requests; Shared with me naming a Ring joined knowingly, with its member count when allowed.
- S2: accept (returns `ringId`, `ringName`), decline, dismiss.
- S3, S9: resolve a typed code or a scanned join QR to the review; join, or send a request.
- S5: my requests, cancel, dismiss.
- S6: invite by connection or Pin name with a window, the Invited list, withdraw.
- S7: list, make and turn off codes, with label, end date, use limit, uses, state and QR payload.
- S8: Waiting on you with the code's label; approve, decline.
- Enforced: `joinPolicy` (codes), `requireApproval`, `membersCanInvite`.
- Checks: typecheck and lint clean; 832/832 unit tests (716 on `main`), including the specs that assert a placed membership never shows the Ring's name. On a throwaway database (`social_pin_f17`, migrated and seeded, app on :3142, dropped after): the migration replays cleanly (the only residual diff is the known `pincasts` GiST index), and a 92-check live run of every route and refusal above passed.

### Gaps

- **Work email:** not in this version, by decision: no route and no address on the membership → [[S-33 Ring Invitations & Join Story|S-33 S4]], [[D-33 Work email joining waits for real emails and Companies]].
- **Your card in this Ring** (the picked-Ring pointer on the membership, set and read, falling back to the default Ring): not built → [[S-33 Ring Invitations & Join Story|S-33 S10]], [[D-34 A member shows one of their own Rings]].
- **The member-facing roster** (colleagues' picked cards when `membersCanSeeEachOther` is on) and **Leave this Ring** as a member: not built → [[S-33 Ring Invitations & Join Story|S-33 S11]].
- **Notifications** (invitation received, request approved, request waiting): not built → [[S-33 Ring Invitations & Join Story|S-33 S12]], [[F-39 Notifications]].
- **Error codes on the wire:** the codes above exist on the server but are not in the response body until [[S-87 Error Contract Story|Error Contract]]; the client branches on status and message until then.
- **To confirm:** the Shared with me row now prefers a Ring joined knowingly over an older placed one (above), a reading of D-15 next to S-33 S2.
- **Admins:** codes, invitations and requests accept a `RingAdmin` at `MEMBER_MANAGER` or above, as the members routes do. No route appoints admins yet ([[F-16 Delegated Admins]]).

## Log

- 2026-10-18 · split out of [[F-17 Ring Invitations & Join]] when the vault moved to layers
- 2026-11-08 · `tickets/backend/M-03-shared-rings/F-17-ring-invitations/FR-17-accepted` · [[FR-17 Ring Invitations & Join Frontend Requirements]] approved; this note → in progress
- 2026-11-08 · backend branch `FR-17/ring-invitation/invitations-codes-origin` @ `21899a6` (from `main` `cb95a39`), pushed, **not merged** · S-33 S1–S3, S5–S9 built: 17 routes above, migration `20261108150000_ring_invitations_and_join`, `RingMember.origin`, `E_RING_INVITATION_01`–`07`, `E_RING_JOIN_CODE_01`–`06`, `E_RING_JOIN_REQUEST_01`–`02`; Shared with me names a Ring joined knowingly (closes BD-11's pending on merge). 832/832 tests, 92/92 live checks on `social_pin_f17` (dropped). The nine ⚠ flags under the H1 (S-33 ×2, D-04, D-31 to D-36) are answered by this note and cleared. Flagged [[BD-11 Rings Backend Delivery]] and [[BD-08 Ring Access Engine Backend Delivery]]. Stays in progress until the merge.
- 2026-11-08 · flagged [[BD-11 Rings Backend Delivery]]: backend branch FR-17/ring-invitation/invitations-codes-origin (21899a6, not merged) records how a membership was made (RingMember.origin) and enforces joinPolicy, requireApproval and membersCanInvite: both pending entries close on its merge; a Shared with me row then names a Ring joined knowingly and opens it before an older placed one
- 2026-11-08 · flagged [[BD-08 Ring Access Engine Backend Delivery]]: RingAccessService on FR-17/ring-invitation/invitations-codes-origin (not merged): isRingNamedToMember reads RingMember.origin; new ringOpenFilter, isRingOpen, joinPolicyAllowsCodes, assertCanInvite, ownerNotBlockedWithFilter; the Shared with me row prefers a Ring joined knowingly
