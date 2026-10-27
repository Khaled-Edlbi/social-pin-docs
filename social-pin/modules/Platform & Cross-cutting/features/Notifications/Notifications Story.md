---
type: story
code: notifications
scope: feature
feature: notifications
module: platform
status: approved
screens: [s69]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-27
tags: [story, story/approved, module/platform, layer/business]
---

# Notifications · User Story

**Feature:** [[Notifications]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Notifications Frontend Requirements]] · **API Integration:** not yet (backend not built)

Things happen to a user while the app is closed: someone asks to connect, a PinCast ends, pins are nearby, a meeting is accepted. The user wants a bell with a count, an inbox grouped by day, and a tap that lands on the thing itself. Nothing is built; the table, its idempotency key and the preference table exist.

## Persona

Any signed-in user, most often returning to the app from a push. The owner of a Ring deciding on a request, the broadcaster checking who a PinCast reached, the attendee with a meeting at 3 pm.

## Stories

### S1 · Inbox grouped by day ([[Screen Index#s69|s69]])

**As a** user **I want** my notifications grouped under Today, Yesterday and Last 7 days **so that** I can tell new from old at a glance.

Acceptance criteria:
- [ ] Each row shows a type icon, the `title`, the optional `body` and a relative time; unread rows are visually distinct.
- [ ] Groups are computed from `createdAt` in the device's timezone; an empty group is not shown; older than seven days is a fourth, collapsed group or absent, product to confirm.
- [ ] The list is reached from s68 and from the bell on Home ([[Navigation Map]]).

### S2 · The bell shows what is unread

**As a** user on any tab **I want** the bell to carry an unread indicator **so that** I know to look without opening the inbox.

Acceptance criteria:
- [ ] The indicator reflects the count of rows with `readAt` null; it clears when the last unread row is read.
- [ ] The count updates when the app comes to the foreground and after a push is received.

### S3 · Mark one read, mark all read ([[Screen Index#s69|s69]])

**As a** user **I want** opening a notification to mark it read and a "Mark all read" action at the top **so that** the badge means something.

Acceptance criteria:
- [ ] Tapping a row sets its `readAt` before navigating; "Mark all read" sets every unread row and clears the bell in one call.
- [ ] Both are idempotent; marking a read row again changes nothing.

### S4 · Tap deep-links to the thing ([[Screen Index#s69|s69]])

**As a** user **I want** a tap to open the screen the notification is about, with a shared-element transition **so that** "PinCast ended" lands me on the results, not on a list.

Acceptance criteria:
- [ ] "See results" → s42; "Scan now" → s35; "Choose a Ring" → s46; "Temporary Ring created" → s67; "Suggest another day" → s59, per the prototype.
- [ ] The row's `data` holds only the deep-link target and counters; the client fetches the content through the authorized endpoint after the tap, so a target the user can no longer see shows the same 404 as everywhere else ([[Wireframe Brief#Notifications|§11]]).

### S5 · Push delivery

**As a** user with the app closed **I want** a push for the types I care about **so that** a connect request does not wait until I happen to open the app.

Acceptance criteria:
- [ ] A push is sent to each registered device with a `pushToken` when the type's `pushEnabled` is true.
- [ ] The push payload carries no profile fields, Ring names or message bodies; tapping it opens s69 or the deep-link target.
- [ ] A producer that retries reuses the `dedupeKey`, so the user is never notified twice for one event.

### S6 · Preferences per type

**As a** user **I want** to switch in-app, push and email on or off per type **so that** "pins nearby" does not buzz me at every event.

Acceptance criteria:
- [ ] One row per `NOTIFICATION_TYPE` with `inAppEnabled`, `pushEnabled`, `emailEnabled`; defaults in-app on, push on, email off.
- [ ] Turning in-app off for a type stops it appearing on s69; the preference screen itself is not in the prototype and is reached from Me.

### S7 · NotificationService.emit and the inbox

*From T-045 (status then: To do), merged 2026-10-27.*

Internal emit with `dedupeKey`; `GET /notifications` grouped by day; mark one / all read. Other modules import the module.

Screens: [[Screen Index#s69|s69]] Notifications


### S8 · Push delivery and preferences

*From T-046 (status then: Blocked), merged 2026-10-27.*

Push via device tokens; preferences CRUD.

Screens: [[Screen Index#s69|s69]] Notifications

## States and motion the design asks for

- State: empty inbox, unread rows, all read, loading, offline (last fetched list); bell with and without indicator ([[Wireframe Brief#Notifications|§11]], [[Wireframe Brief#Global navigation & app shell|§2]]).
- Motion: tapping a row deep-links with a shared-element transition into the target screen; "Mark all read" clears rows in place.

## Rules the backend already enforces

- `Notification` carries `type`, `title`, `body`, `data` (deep-link target and counters only), `readAt`, `dedupeKey` (unique), indexed by (user, readAt, createdAt); `NotificationPreference` is unique per (user, type).
- The types are fixed by the enum: connection request received / accepted, Ring membership added, Ring expiring, PinCast ended, pins nearby, meeting request received / accepted / declined, meeting reminder, event reminder, exhibitor approved / rejected, order paid, system.
- Nothing emits, lists or pushes yet ([[Notifications Story|Notifications · S7]], [[Notifications Story|Notifications · S8]]); push needs registered devices from [[Devices & NFC]].

## Open questions

- No decision note names this feature. Whether a fourth "Older" group exists, and where the preferences screen lives, are for product to add to the design.
