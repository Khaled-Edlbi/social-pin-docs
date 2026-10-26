---
type: project
created: 2026-10-15
updated: 2026-10-26
tags: [project]
layer: backend
---
# Spec → code map

Every entity in *Social Pin — Database Entities & Backend Data Design* and every
feature in *Features List V0.9.1*, mapped to where it lives and what state it is
in.

**Status key**

| | Meaning |
|---|---|
| **schema + API** | Table, migration, module, endpoints and specs all exist. |
| **schema** | Table, migration and relations exist. No module yet — the data model is settled, the behaviour is not written. |

The schema is complete for the whole document, including the §2 future features.
The implemented modules are the entities doc's phases 1–2, which it calls the
centre of the system: *"The Ring Access Model should be treated as the central
database/business concept."*

---

## 1. Main entities

| Spec entity | P | Prisma model | Schema file | Status | Code |
|---|---|---|---|---|---|
| `users` | Critical | `User` | `user.prisma` | **schema + API** | `modules/user/` |
| `profiles` | Critical | `Profile` | `profile.prisma` | **schema + API** | `modules/profile/` |
| `rings` | Critical | `Ring` | `ring.prisma` | **schema + API** | `modules/ring/` |
| `ring_members` | Critical | `RingMember` | `ring.prisma` | **schema + API** | `modules/ring/ring-member.service.ts` |
| `ring_profiles` | Critical | `RingProfile` | `ring.prisma` | **schema + API** | `modules/ring-profile/` |
| `ring_profile_links` | Critical | `RingProfileLink` | `ring.prisma` | **schema + API** | `modules/ring-profile/` |
| `connections` | Critical | `Connection` | `connection.prisma` | schema | — |
| `connection_requests` | Critical | `ConnectionRequest` | `connection.prisma` | schema | — |
| `businesses` | High | `Business` | `business.prisma` | schema | — |
| `business_members` | High | `BusinessMember` | `business.prisma` | schema | — |
| `events` | Critical | `Event` | `event.prisma` | schema | — |
| `event_participants` | Critical | `EventParticipant` | `event.prisma` | schema | — |
| `event_packages` | High | `EventPackage` | `event.prisma` | schema | — |
| `package_entitlements` | High | `PackageEntitlement` | `event.prisma` | schema | — |
| `exhibitors` | High | `Exhibitor` | `event.prisma` | schema | — |
| `booths` | High | `Booth` | `event.prisma` | schema | — |
| `mini_events` | High | `MiniEvent` | `event.prisma` | schema | — |
| `mini_event_access` | High | `MiniEventAccess` | `event.prisma` | schema | — |
| `availability_slots` | Critical | `AvailabilitySlot` | `meeting.prisma` | schema | — |
| `meeting_requests` | Critical | `MeetingRequest` | `meeting.prisma` | schema | — |
| `meetings` | Critical | `Meeting` | `meeting.prisma` | schema | — |
| `meeting_participants` | Critical | `MeetingParticipant` | `meeting.prisma` | schema | — |
| `pincasts` | High | `Pincast` | `discovery.prisma` | schema | — |
| `pincast_recipients` | High | `PincastRecipient` | `discovery.prisma` | schema | — |
| `files` | High | `File` | `file.prisma` | **schema + API** | `modules/file/` |
| `notifications` | High | `Notification` | `notification.prisma` | schema | — |
| `orders` | High | `Order` | `commerce.prisma` | schema | — |
| `payments` | High | `Payment` | `commerce.prisma` | schema | — |
| `subscriptions` | High | `Subscription` | `commerce.prisma` | schema | — |
| `ai_sessions` | Medium | `AiSession` | `ai.prisma` | schema | — |
| `ai_messages` | Medium | `AiMessage` | `ai.prisma` | schema | — |
| `ai_actions` | Medium | `AiAction` | `ai.prisma` | schema | — |
| `match_results` | Medium | `MatchResult` | `discovery.prisma` | schema | — |
| `analytics_events` | High | `AnalyticsEvent` | `analytics.prisma` | schema | — |
| `roles` | Critical | `Role` | `auth.prisma` | **schema + API** | seeded by `prisma/seed/role.seed.ts`; read by `GET /admin/roles` |
| `permissions` | Critical | `Permission` | `auth.prisma` | **schema + API** | seeded by `prisma/seed/permission.seed.ts`; read by `GET /admin/roles/permissions` |
| `user_roles` | Critical | `UserRole` | `auth.prisma` | **schema + API** | read by `modules/auth/strategies/jwt.strategy.ts`; granted/revoked via `/admin/users/:userId/roles` |
| `audit_logs` | Critical | `AuditLog` | `analytics.prisma` | **schema + API** | written by `modules/audit/audit-log.service.ts`; read by `GET /admin/audit-logs` |

### Tables added beyond the document

Each exists because the document references it without defining it, or because a
feature in the features list needs it.

| Model | Why |
|---|---|
| `Location` | The doc's `events`, `mini_events` and `meetings` all carry a `location_id` but no `locations` table is defined. Modelled so those FKs are real, with an IANA `timezone` for the "handle event/user timezones explicitly" rule. |
| `RefreshToken` | Rotating refresh tokens, stored hashed and revocable. Required by the auth rules; not in the entity list. |
| `VerificationCode` | The email/phone OTP in features §8. |
| `SocialIdentity` | "or via social providers" (§8). |
| `UserDevice` | "Devices (linked-device management)" (§6). |
| `UserBlock` | `connections` says "Respect blocks/privacy" but defines no block table. Its own table so a block survives connection and ring churn. |
| `Interest`, `UserInterest` | §4 interests, "used for search & matchmaking; **not shown to others**". |
| `RingAdmin` | "delegated ring admins at different permission levels" (§5). |
| `RingInfoBlock` | "Add information to your ring / Added info" (§4). |
| `RingWidget` | "Add widgets" (§4). |
| `RingProfileFile` | "File attachments on profile (Portfolio.pdf, Pitch Deck)" (§4). |
| `RingQrToken` | "QR / badge is bound to the currently selected ring" (§5). Opaque, hashed, revocable. |
| `RolePermission` | The join the doc implies between `roles` and `permissions`. |
| `OrderItem` | Needed to satisfy "Do not derive historical totals from mutable prices" — a price snapshot per line. |
| `BusinessTag`, `BusinessFile` | The business setup form's tags and uploads (§10). |
| `ExhibitorDocument` | "Upload requested files (exhibitor documents)" (§11). |
| `EventSummary` | "Post-event summary → Result" (§9). |
| `NotificationPreference` | `notifications` says "Support notification preferences" without a table. |

## 2. Future features (spec §2)

All present in the schema. Nothing is implemented; the point of modelling them
now is the document's instruction that *"These additions should extend the Ring
model instead of turning Social Pin into a generic social network."*

| Spec entity | Prisma model | Schema file | How it extends the Ring model |
|---|---|---|---|
| `chat_conversations` | `ChatConversation` | `chat.prisma` | Carries `ringId`; access derives from the same rules. |
| `chat_members` | `ChatMember` | `chat.prisma` | `leftAt` rather than deletion, so membership history survives. |
| `chat_messages` | `ChatMessage` | `chat.prisma` | Keyset-indexed `(conversationId, createdAt, id)` for a high-write table. |
| `posts` | `Post` | `post.prisma` | **CHECK constraint** requires a `ringId` or an `eventId` — a context-free post is the global feed the product does not have. |
| `post_reactions` | `PostReaction` | `post.prisma` | Composite PK enforces one reaction per user. |
| `post_comments` | `PostComment` | `post.prisma` | No own context; inherits the post's. |
| `polls` | `Poll` | `post.prisma` | Eligibility is ring membership; `resultVisibility` and `isAnonymous` are explicit. |
| `poll_options` | `PollOption` | `post.prisma` | — |
| `poll_votes` | `PollVote` | `post.prisma` | `@@unique([pollId, userId, optionId])` supports multi-choice while still bounding votes. |
| `contact_notes` | `ContactNote` | `contact.prisma` | Owner-private. Deliberately **not** indexed by `targetUserId` alone — there is no legitimate "who holds notes about me" query. |
| `relationship_tags` | `RelationshipTag` | `contact.prisma` | Private categories, unrelated to rings. |
| `contact_relationship_tags` | `ContactRelationshipTag` | `contact.prisma` | — |
| `tasks` | `Task` | `contact.prisma` | Polymorphic target (user/ring/event/meeting). |
| `calendar_integrations` | `CalendarIntegration` | `contact.prisma` | Tokens held as application-encrypted ciphertext; no entity exposes them. |
| `ring_templates` | `RingTemplate` | `ring.prisma` | No members, no access columns — "Templates should create Rings, not become a second permission system." |
| `nfc_tokens` | `NfcToken` | `ring.prisma` | Mirrors `RingQrToken`: opaque, hashed, revocable. |
| `follow_up_automations` | `FollowUpAutomation` | `contact.prisma` | Unique `dedupeKey` for idempotency; `BLOCKED_BY_PERMISSION` status rather than a silent drop. |

## 3. Cross-cutting database rules (spec §3)

| Rule | Where it is enforced |
|---|---|
| UUID primary keys; never email/phone as a relational key | Every model: `@id @default(uuid()) @db.Uuid`. Email and phone are unique columns on `User`, never referenced. |
| Timestamps in UTC; timezones explicit | All 187 `DateTime` columns are `@db.Timestamptz(3)`. `Location.timezone` and `Event.timezone` hold the IANA zone a schedule is authored in. |
| Foreign keys and unique constraints on important relationships | 135 FKs; `@@unique` on every natural key. The loose `scopeId`/`featureId`/`targetId` columns are documented polymorphic references, resolved in services. |
| Index FKs and common filters (`user_id`, `ring_id`, `event_id`, `status`, time windows) | 176 indexes in the init migration, plus the composite `(status, expiresAt)` and `(status, startsAt)` pairs the access and schedule queries use. |
| PostGIS / geospatial indexes for PinCast and nearby discovery | `…_extensions` migration creates `postgis`; `pincasts.geo` is a `geography(Point, 4326)` kept in sync by the `pincasts_sync_geo` trigger, with a GiST index. |
| Centralize Ring access checks; do not duplicate privacy logic | `RingAccessService` — golden rule 8 in `CLAUDE.md`. |
| Treat ring membership, hidden links, private notes, interests and exact location as privacy-sensitive | Membership is owner-only; hidden rows are excluded by the select; `ContactNote` and `Interest` have no outward entity; `Pincast` coordinates never reach a recipient. |
| File binaries in object storage, metadata in the database | `File.storageKey`; `FileService.persist`/`discard` are the only two methods that touch bytes. |
| Transactions for meeting booking and other atomic changes | `@Transactional<PrismaTxAdapter>()`; `availability_slots` additionally has an exclusion constraint, because a service check cannot stop two concurrent inserts. |
| Idempotency for payment webhooks, notifications and automations | `Payment.providerReference`, `Notification.dedupeKey` and `FollowUpAutomation.dedupeKey` are each unique. |
| Retention for temporary rings, PinCast recipients, chat, analytics, events | Modelled: `Ring.disposition` + `RING_DISPOSITION`, `PincastRecipient.detectedAt` indexed for purging, `AnalyticsEvent.createdAt` indexed. The jobs are not written. |
| Audit logs for sensitive admin, access, payment and AI actions | `AuditLogService` owns the table. Every admin-panel mutation records one, inside the same transaction as the change, so the log cannot claim something the database rolled back. Access, payment and AI writers are not wired yet. |

## 4. Features list coverage

| § | Feature | Status | Where |
|---|---|---|---|
| 4 | Multiple profiles per account | **API** | `POST /profiles` |
| 4 | Pin name, `!`-prefixed, unique | **API** | `pinNameNormalized` unique; `GET /profiles/pin-name/:pinName/availability` |
| 4 | Different bio / image per ring | **API** | `PATCH /rings/:ringId/projection` |
| 4 | Linked accounts / social links per ring, multiple of a type | **API** | `POST /rings/:ringId/projection/links` |
| 4 | "Add information to your ring" | **API** | `.../projection/info-blocks` |
| 4 | **View as** — preview as a chosen ring sees it | **API** | `GET /views/ring/:ringId` — same code path as the member's view |
| 4 | Add widgets | schema | `RingWidget` |
| 4 | Ring colour & style | **API** | `colorHex`, `style` on `CreateRingDto` |
| 4 | File attachments on profile | **API** | `.../projection/attachments` |
| 4 | Interests, not shown to others | schema | `Interest`, `UserInterest`, seeded vocabulary |
| 4 | Connections counter | — | Derived; not yet exposed |
| 5 | Multiple rings + a default ring | **API** | `POST /rings`, `POST /rings/:id/default` |
| 5 | Add users to a ring → they see that perspective | **API** | `POST /rings/:ringId/members` |
| 5 | Switch modes across several rings of one user | **API** | `GET /views/user/:userId/perspectives` |
| 5 | Ring expiry dates | **API** | Enforced in `RingAccessService`, both windows |
| 5 | Shared Rings vs My Rings | **API** | `GET /rings` and `GET /rings/shared-with-me` |
| 5 | QR / badge bound to the selected ring | partial | `RingQrToken` table + `GET /views/ring/:ringId`; token issue/scan endpoints not written |
| 5 | Corporate rings (public/employees/c-suite), delegated admins | partial | `RING_TYPE.CORPORATE`, `parentRingId`, `RingAdmin` + `assertCanAdminister` enforce it; no corporate-specific endpoints |
| 5 | MiniRings for sub-events | schema | `Ring.parentRingId`, `MiniEvent.ringId` |
| 5 | Temporary rings → keep / merge / auto-delete | **API** | `POST /rings/:id/disposition` |
| 6 | Connect / follow as an access request | schema | `ConnectionRequest.grantedRingId` |
| 6 | Re-assignment is live | **API** | `POST /rings/:ringId/members/:userId/reassign` |
| 6 | Ring membership private to the owner | **API** | Enforced; see the privacy section of `CLAUDE.md` |
| 6 | PinCast, nearby discovery, search by ring | schema | `Pincast`, `PincastRecipient`, PostGIS index |
| 7 | Notifications | schema | `Notification`, `NotificationPreference` |
| 8 | Sign up with email or phone | **API** | `POST /auth/sign-up` |
| 8 | Email OTP → enter code (passwordless; design s01) | **API** | Sign-up: `verify-code` → `complete-registration`. Sign-in: `login` → `login/verify`. **Delivery not wired** — see below |
| 8 | Social providers | schema | `SocialIdentity` |
| 8 | Manage account | **API** | `PATCH /users/me` (no password — sign-in is OTP only) |
| 8 | Free vs Pro | schema | `User.accountType`, `Subscription` |
| 9–11 | Events: visitor, exhibitor, organizer | schema | `event.prisma`, `business.prisma` |
| 12 | Meetings and slot-based scheduling | schema | `meeting.prisma`, with the overlap exclusion constraint |
| 13 | Gemma AI | schema | `ai.prisma` |
| 14 | Analytics | schema | `analytics.prisma` |

## 4b. Platform operator panel (`/admin`)

Not a numbered spec feature — it is what §1's `roles`, `permissions`,
`user_roles` and `audit_logs` are for. 12 routes in `src/modules/admin/`, every
one gated on the `USER_ROLE` enum.

| Route | Role | Notes |
|---|---|---|
| `GET /admin/stats` | SUPER_ADMIN, ADMIN | Aggregate counts only. |
| `GET /admin/users` | SUPER_ADMIN, ADMIN | Soft-deleted hidden unless `includeDeleted=true`. |
| `GET /admin/users/:id` | SUPER_ADMIN, ADMIN | Counts of profiles/rings, never the rows. |
| `PATCH /admin/users/:id/status` | SUPER_ADMIN, ADMIN | ACTIVE/SUSPENDED; suspending revokes live refresh tokens. |
| `PATCH /admin/users/:id/role` | **SUPER_ADMIN** | `users.role` is a string `RolesGuard` matches. |
| `GET /admin/users/:userId/roles` | SUPER_ADMIN, ADMIN | Scoped grants. |
| `POST /admin/users/:userId/roles` | SUPER_ADMIN, ADMIN | A **GLOBAL**-scope grant is SUPER_ADMIN-only (`E_ADMIN_07`). |
| `DELETE /admin/users/:userId/roles/:assignmentId` | SUPER_ADMIN, ADMIN | Same GLOBAL restriction. |
| `GET /admin/roles` | SUPER_ADMIN, ADMIN | Read-only; roles are seeded. |
| `GET /admin/roles/permissions` | SUPER_ADMIN, ADMIN | Unpaged catalogue. |
| `GET /admin/audit-logs` | SUPER_ADMIN, ADMIN | Append-only; no delete route exists. |
| `GET /admin/audit-logs/:id` | **SUPER_ADMIN** | Full `metadata`. |

Two constraints worth keeping:

- **The panel does not answer the viewer question.** It reads account and
  moderation state, never a profile's contents, a ring projection or a
  membership row — `RingAccessService` stays the only place that decides what a
  viewer may see (golden rule 8). An operator who must look at a reported
  profile is added to a ring and uses the normal view endpoints, where the
  access is attributable.
- **`RolesGuard` has no hierarchy.** It matches by name, so SUPER_ADMIN does
  *not* imply ADMIN; a route both may use lists both. `PANEL_OPERATOR` and
  `PANEL_SUPER_ADMIN` in `src/modules/admin/admin.roles.ts` keep that
  consistent. The guard also matches GLOBAL-scoped `user_roles` names, which is
  why a global grant is gated as tightly as `users.role`.

## 5. Open questions (spec §16) — how each is handled

| Question | Resolution in this build |
|---|---|
| Follow model vs. positioning | Already resolved in the spec. Implemented as stated: `ConnectionRequest` grants a ring, and there is no feed. |
| Keep the "Follow" label or rename to Connect/Add | **Left open.** The API uses neutral names (`connection_requests`, not `follows`), so either label can be chosen in the UI without a schema change. |
| Visitor vs Exhibitor flows are near-duplicates | Modelled as one flow with role-conditional branches: `EventParticipant.role` carries the distinction rather than two parallel structures. |
| Temporary auto-rings need a lifecycle spec | `Ring.isTemporary`, `startsAt`/`expiresAt`, `RING_DISPOSITION` (`UNDECIDED` → `KEEP`/`MERGE`/`AUTO_DELETE`) and `mergedIntoRingId`. `POST /rings/:id/disposition` implements the transitions; `AUTO_DELETE` archives and flags rather than deleting, so the owner can still change their mind. **The retention job itself is not written.** |
| Where do meeting slots come from? | Recorded per slot as `SLOT_SOURCE` (`MANUAL` / `CALENDAR_SYNC` / `PACKAGE`), with `calendarIntegrationId` set for synced ones — so a revoked integration can delete only what it created. |
| Package → mini-event entitlement mapping | Made data rather than code: `PackageEntitlement` rows with `featureType = MINI_EVENT_ACCESS` name the mini-events a package unlocks. Adding a feature type needs no migration. |
| Sensitive profile fields should be optional and ring-scoped | **Implemented.** The values live once on `Profile` (all nullable); each `RingProfile` opts in via `showBirthdate` / `showGender` / `showMaritalStatus` / `showPhone` / `showEmail`, all defaulting to `false`. Gated in one method, `RingProfileService.toView`. |
| Payment: reconciliation and who collects | Modelled, not decided: `PAYMENT_METHOD` covers cash / card / bank / wallet, `Payment.collectedBy` records `ORGANIZER` vs `SOCIAL_PIN`, and `providerReference` is unique so a replayed webhook updates rather than duplicates. |

## 6. Known gaps

Stated plainly, because a gap described as done is worse than a gap.

1. **OTP delivery is not wired.** `AuthService.issueCode` logs the code with a
   `TODO(delivery)` and no mail/SMS provider is configured. The flow is
   otherwise complete. Until it is wired, `sign-up`, `login` and
   `request-code` return the code as `devCode` **in every environment**, so
   anyone who knows an account's email or phone can sign in as it.
2. **`audit_logs` covers the panel's mutations only.** A status change, the
   platform role and a role grant or revoke each record one. The spec's other
   three categories — access, payment and AI — have no writers yet. An
   operator can read the trail; no route deletes an entry at any role, and
   there is no retention job.
3. **Retention and expiry jobs are not written.** Nothing sweeps `AUTO_DELETE`
   rings, expired `PincastRecipient` rows, or stale `verification_codes`. The
   schema carries everything such a job needs.
4. **`RING_MEMBER_STATUS.EXPIRED` and `RING_STATUS.EXPIRED` are never set.**
   Expiry is evaluated live from the timestamps on every access resolution,
   which is correct and race-free; those enum values are for a sweeper that
   would materialise the state for reporting.
5. **Phases 3–8 are schema-only.** Connections, events, meetings, PinCast,
   businesses, commerce, chat, posts and Gemma have tables, constraints,
   indexes and documented intent — and no services or endpoints.
6. **e2e specs need a seeded, disposable database.** They are written and
   typecheck, but have not been run here: no `DATABASE_URL` was available.
7. **The `ErrorCode` is not on the error body.** Services throw
   `{ ErrorCode, message }`, but `AllExceptionsFilter` copies only `message`
   and `error` into the response, so clients cannot branch on the code yet.
   Tracked as T-063 in `social-pin-docs`.
8. **No route serves file bytes by id.** `FileEntity` hides `storageKey` by
   design and nothing maps a file id to a download, so `avatarFileId` and
   attachment ids cannot be rendered by a client. Tracked as T-062.
