---
type: report
date: 2026-10-15
created: 2026-10-15
updated: 2026-10-26
tags: [project, report]
layer: business
---

# Status Report · Backend vs Design (2026-10-15)

The comparison this vault was built from. The backend was checked against the design's 78 prototype screens (`.proto2.json`), the click-through map (`.wire.json`) and the wireframe brief. Screen ids (`s01` … `s75`) are the prototype's own numbering; see [[Screen Index]].

**Overall.** The backend covers the identity core: sign-up, profiles, Rings, members, what each Ring shows, "View as", and the central access engine. The database schema covers almost everything else in the design, but about 30 tables have no service or endpoints yet: connections, PinCast, events, meetings, business, payments, notifications, Gemma and analytics. There are 49 endpoints. Typecheck passes and all 168 unit tests pass (9 suites). The e2e tests have never been run, because they need a test database.

## ✅ Done (endpoints exist and are tested)

| Design area | Screens | Backend | Note |
|---|---|---|---|
| Sign up with email or phone, verify the code, resend it | s01, s02 | `POST /auth/sign-up`, `/auth/verify-code`, `/auth/request-code` | [[Auth & Sign-up]] |
| Finish sign-up: profile, default Ring and its view in one go | s06 → s08 | `POST /auth/complete-registration` | [[Auth & Sign-up]] |
| Claim your Pin: live availability check | s06 | `GET /profiles/pin-name/:pinName/availability` | [[Profiles & Pin Name]] |
| Log in, refresh, log out, log out everywhere, change or reset password | s68 | `/auth/*` (rotating, hashed refresh tokens) | [[Auth Model]] |
| My Rings list | s16 | `GET /rings` | [[Rings]] |
| Shared with me (list only) | s17 | `GET /rings/shared-with-me` | [[Rings]] |
| Create a Ring: name, colour, type (incl. Event), expiry, temporary | s09, s18, s21 | `POST /rings` | [[Rings]] |
| Edit name and colour, set default, delete | s22, s26 | `PATCH`, `POST /:id/default`, `DELETE /rings/:id` | [[Rings]] |
| Ring people: list, add, edit, remove | s15 | `/rings/:ringId/members` | [[Ring Members]] |
| Move a connection to another Ring live; revoke access | s47 | `POST …/members/:userId/reassign`, `DELETE` | [[Ring Members]] |
| Photo and bio per Ring | s23, s29 | `PATCH /rings/:ringId/projection` | [[Ring Projection]] |
| Social profiles per Ring | s25 | `…/projection/links` (hidden flag, sort order) | [[Ring Projection]] |
| "Add a field" per Ring | s24, s36 | `…/projection/info-blocks` | [[Ring Projection]] |
| Files per Ring (Portfolio.pdf) | s14, s20 | `POST /files` + `…/projection/attachments` | [[Files Upload]] |
| Sensitive fields per Ring | s09, s68 | `show*` flags, all off by default | [[Ring Projection]] |
| View as | s10, s31 | `GET /views/ring/:ringId` (same path a real viewer hits) | [[View As & Pin Views]] |
| Open someone's Pin by name | s44 (read part) | `GET /views/pin/:pinName` (one 404 body) | [[View As & Pin Views]] |
| See another user's views of me | Shared Rings | `GET /views/user/:userId/perspectives` | [[View As & Pin Views]] |
| After an event: keep, merge or let the Event Ring expire | s62 (bottom) | `POST /rings/:id/disposition` | [[Rings]] |
| Manage account | s68 | `GET / PATCH / DELETE /users/me` | [[Account]] |
| Access engine | everywhere | `RingAccessService` | [[Ring Access Engine]] |

## 🟡 Partial (started, but the design needs more)

- [[Code Delivery]] (s02): no email / SMS provider. The code is only logged, and returned as `devCode` in dev.
- [[Counts]] (s11, s14, s16, s68): "148 people" and "218 connections". No endpoint returns member or connection counts.
- [[Delegated Admins]] (s26, s27): `RingAdmin` exists and is enforced; no endpoints to add, change or remove an admin.
- [[Badge & QR]] (s34): `RingQrToken` exists. Missing: issuing and rotating every 24 h, resolve-on-scan, a scan counter, "Share link", the browser page for people without the app.
- [[Event Ring Auto-creation]]: the type exists; nothing creates one from a registration (s52).
- [[Photo Library]] (s30): upload works; no "list my files", no "N Rings inherit it" count.
- [[Devices & NFC]] (s75): sessions exist; `UserDevice` has no endpoints; no NFC pairing.
- [[Interests]] (s07, s71): table and seed exist; no endpoints.
- [[Widgets]] (s37): table exists; no endpoints; type list misses Map (present), Availability, Payment, Now playing, Testimonial.
- [[Linked Accounts (OAuth)]] (s68): `SocialIdentity` exists; no OAuth.

## ❌ TODO (no endpoints yet)

- **Onboarding imports** (no tables apart from `SocialIdentity`): LinkedIn OAuth → importing → review (s04, s05); scan a paper card (s03a); portfolio / Behance URL (s03b). → [[Onboarding Imports]]
- **Connections**, the next most important feature after Rings: send after a scan (s44); inbox incoming and sent (s45); accept and pick a Ring (s46, sets `grantedRingId`); detail with events in common, mutual connections, introduce (s47); block / unblock; contacts list. → [[Connections]]
- **Shared Rings and companies**: review / decline invitations (s17); join with a code, work email or a colleague's QR (s74); "what you contribute" (s74); my companies and company detail (s72, s73). → [[Ring Invitations & Join]], [[Companies]]
- **Discover and PinCast**: hub, `!pinname` search, recent searches (s38); PinCast setup, live, hidden, results (s39 – s42) and the geo query; nearby by Ring; import contacts. → [[Discover Hub & Search]], [[PinCast & Nearby]]
- **Events, before**: list, filters, "your contacts are going" (s48); landing and schedule (s49); tickets, levels, sub-events, sold out (s50); payment, order, webhook (s51); Event Ring on registration (s52). → [[Events Before]], [[Payments & Orders]]
- **Events, during**: event mode (s53); exhibitors (s54, s55); pass with a 60 s code (s56); floor map (s57); catalogue (s58, no table yet); lounges and upgrades. → [[Events During]]
- **Meetings**: slots; request with a slot (s59); temporary Ring per meeting; accept with slots or decline with reason (s64); my meetings and calendar (s61, s66); detail, reschedule, cancel (s67). → [[Meetings]]
- **Exhibitor**: business account and Ring (s63); team on the stand; "Discoverable via Gemma"; booth analytics and leads CSV (s65). → [[Exhibitor]]
- **Post-event**: summary stats and follow-up suggestions (s62). → [[Post-Event]]
- **Cross-cutting**: notifications grouped, mark all read, push, preferences (s69); subscription Free vs Pro and the Pro limits (s70); Gemma sheet (s13), Smart Match (s60), suggestions everywhere. → [[Notifications]], [[Subscription (Free vs Pro)]], [[Gemma AI]]
- **Infrastructure**: audit log writes; cleanup jobs; run the e2e tests. → [[Audit Log]], [[Cleanup Jobs]], [[E2E Test Run]]

## ⚠️ Where the design and the backend disagree (needs a decision)

1. **Login without a password.** s01 promises a one-time code; the backend requires a password after the code. A `LOGIN` code type exists with no route. → [[ND-01 Passwordless login]]
2. **The profile has no work fields.** Every screen shows headline, role, company, location, photo, base bio; `Profile` has only name, nickname, birthdate, gender, marital status. → [[ND-02 Base profile work fields]]
3. **How fields are shared.** The design assumes one library of fields each Ring turns on or off; the backend stores a copy per Ring. → [[ND-03 Field library vs per-Ring copies]]
4. **Missing Ring settings** (s22, s26, s27): who the Ring is for, who can request to join, members see each other, members can invite / save attachments / message me, event presence, auto-accept, required email domain. "Members see each other" changes the owner-only rule. → [[ND-04 Ring settings]]
5. **Copy or inherit** (s18, s23, s28). → [[ND-05 Copy or inherit]]
6. **Pin name rules** (s06): once-a-year rename and suggested names vs no limit and deliberately no suggestions. → [[ND-06 Pin name rules]]

All six are tracked in [[Decisions]]; the tasks they block are on the [[Task Board]].

## Addendum · frontend documentation pass (2026-10-15, later the same day)

Re-verified against the code: 49 endpoints, 9 suites, 168 unit tests green, typecheck green. Writing the per-feature frontend notes ([[Frontend Contract]]) surfaced three things the first comparison did not:

1. **`ErrorCode` never reaches the client.** `AllExceptionsFilter` copies `message` and `error` from the exception but not the code, so the body the guide tells clients to branch on does not carry it. → [[Error Contract]], [[T-063 Put the ErrorCode on the error body]] (P0).
2. **No route serves file bytes by id.** `avatarFileId` and attachment ids are dead ends for a client; `storageKey` is private by design and nothing maps an id to a download. → [[T-062 Serve uploaded file bytes by id]] (P0).
3. **The members roster carries `userId` only**, and no endpoint resolves a user id to a name, so s15 cannot show people until the contacts work lands. Recorded under [[Ring Members#Gaps]]; belongs to [[T-023 Connection detail and contacts list]].

Smaller notes: an expired Ring 404s on `GET /views/ring/:ringId` for its owner too (View as is for live Rings); a changed email or phone has no dedicated re-verify route ([[Account#Gaps]]).
