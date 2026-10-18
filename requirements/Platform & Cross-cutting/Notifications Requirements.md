---
type: requirements
id: notifications
feature: notifications
status: draft
domain: platform
screens: [s69]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/platform]
---

# Notifications · Frontend Requirements

**Feature:** [[Notifications]] · **Status:** Draft · **Story:** [[Notifications Story]] · **API Integration:** not yet (backend not built)

What the client needs for the inbox, the bell, the deep links, push and preferences. Nothing is available; the schema fixes the fields and the type list.

## Per screen

### [[Screen Index#s69|s69]] Notifications

- Needs: a list of `{ id, type, title, body, data, readAt, createdAt }` newest first; an unread count; "Mark all read"; per-row mark read; the deep-link target from `data`; states empty, loading, offline.
- Source today: not yet.

### Bell on Home (persistent chrome, no screen id)

- Needs: the unread count only.
- Source today: not yet. Render the bell without a number until the count exists.

### Preferences (reached from Me; no prototype screen)

- Needs: one row per `NOTIFICATION_TYPE` with `inAppEnabled`, `pushEnabled`, `emailEnabled`; save per toggle.
- Source today: not yet.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| List my notifications (grouped by day, newest first) | — | ❌ | [[T-045 NotificationService.emit and the inbox]] (`GET /notifications` proposed) |
| Unread count for the bell | — | ❌ | [[T-045 NotificationService.emit and the inbox]] |
| Mark one read / mark all read | — | ❌ | [[T-045 NotificationService.emit and the inbox]] |
| Producers emit (connections, meetings, PinCast, events) | — (internal `emit`) | ❌ | [[T-045 NotificationService.emit and the inbox]]; each producer's own task |
| Push to registered devices | — | ❌ | [[T-046 Push delivery and preferences]] (blocked on T-045 and [[T-014 Register devices on login; list and remove]]) |
| Preferences read / update | — | ❌ | [[T-046 Push delivery and preferences]] |

## Behaviour expectations

- Refetch / realtime: refetch the list and the count on app foreground, on opening s69, and when a push arrives; no socket is specified. Push delivery itself waits on device registration ([[Devices & NFC]]).
- Badge count: the number of rows with `readAt` null; decrement optimistically on tap and reconcile with the next fetch.
- Grouping: Today / Yesterday / Last 7 days computed client-side from `createdAt` in the device timezone; the backend orders, the client groups.
- Deep links: read `data` for the target id and screen; then fetch the target through its own authorized endpoint (`/views`, PinCast results, meeting detail). Never render content from `data`; it carries no sensitive fields by design.
- Idempotency: `dedupeKey` is server-side; the client may still receive the same push twice from the platform and must de-duplicate by `id`.
- Caching keys: `notifications:{userId}` (list), `notifications:unread:{userId}` (count), `notificationPrefs:{userId}`; clear on logout.
- Pagination / ordering: the `{ data, meta: { total } }` envelope with `limit` ≤ 50, `createdAt` descending; load older pages on scroll. `meta.total` is unpaginated.
- Preferences: defaults are in-app on, push on, email off; a type with in-app off is excluded server-side from the list.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | not defined yet | mark read on an id that is gone: drop the row |
| 404 | `E_RING_ACCESS_*` on the deep-link target | the target's own "not found" message; the notification stays |
| 401 | `E_AUTH_04` | session gone: sign in again |
| 400 | validation (string array) | `limit` above 50, or an unknown type in a preference update |

No notification codes exist yet; T-045 and T-046 add them. `ErrorCode` is not on the wire until [[T-063 Put the ErrorCode on the error body]] ships.

## Blocked by

- No decision. [[T-045 NotificationService.emit and the inbox]] is To do; [[T-046 Push delivery and preferences]] is ⛔ behind it and [[T-014 Register devices on login; list and remove]].
