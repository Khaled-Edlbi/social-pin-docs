---
type: map
updated: 2026-10-15
tags: [map, frontend]
---

# Frontend Index

One note per feature, for the client: which screens call which endpoints, the flow step by step, the request and response fields that matter, what to cache, which errors to branch on, the product rules the UI must respect, and what the design shows that the backend cannot serve yet. The API-wide rules are in [[Frontend Contract]]; the full guide is [[FRONTEND_API_GUIDE]]; the OpenAPI document at `/docs` is the signature.

A frontend note exists for every feature whose backend is ✅ done. When a 🟡 or ❌ feature ships, its note is created from `templates/Frontend Template.md` and added here ([[Workflow]]).

## Read in this order

1. [[Frontend Contract]]: the one concept (you fetch a Ring projection, never "a user"), sessions, lists, errors.
2. [[Auth & Sign-up Frontend]]: sign-up, login, the token store.
3. [[View As & Pin Views Frontend]]: the shape every other-person screen renders.
4. The rest, per screen.

## Identity Core

| Frontend note | Feature | Backend | Screens |
|---|---|---|---|
| [[Auth & Sign-up Frontend]] | [[Auth & Sign-up]] | ✅ | s01, s02, s06, s08, s68 |
| [[Account Frontend]] | [[Account]] | ✅ | s68 |
| [[Profiles & Pin Name Frontend]] | [[Profiles & Pin Name]] | ✅ | s06 |
| [[Rings Frontend]] | [[Rings]] | ✅ | s08, s09, s16 – s22, s26, s62 |
| [[Ring Members Frontend]] | [[Ring Members]] | ✅ | s15, s47 |
| [[Ring Projection Frontend]] | [[Ring Projection]] | ✅ | s14, s20, s23 – s25, s29, s36 |
| [[View As & Pin Views Frontend]] | [[View As & Pin Views]] | ✅ | s10, s31, s44 |
| [[Files Upload Frontend]] | [[Files Upload]] | ✅ | s14, s20, s36 |
| [[Ring Access Engine Frontend]] | [[Ring Access Engine]] | ✅ | (what the client must assume) |

## Cross-cutting, worth knowing before the first screen

- **The error body does not carry `ErrorCode` yet.** The guide says to branch on it; the filter drops it today. Branch on status and endpoint until [[T-063 Put the ErrorCode on the error body]] ships. See [[Error Contract]].
- **No file bytes can be fetched.** `avatarFileId` and attachment ids have no URL: placeholders until [[T-062 Serve uploaded file bytes by id]].
- **Code delivery is not wired.** On a dev server the sign-up response carries `devCode`; see [[Code Delivery]].

## Not yet documented here (no backend yet)

Connections, Badge & QR, Discover, PinCast, Events, Meetings, Companies, Notifications, Subscription, Gemma: see [[Feature Tree]] for status and the tasks that unblock each.

## Live view (Dataview plugin)

```dataview
TABLE feature, screens, updated FROM #frontend SORT file.name ASC
```
