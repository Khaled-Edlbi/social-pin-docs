---
type: frontend
id: <feature slug — same as the feature note>
feature: "<Feature name>"
domain: <identity|connections|shared-rings|discovery|events|meetings|commerce|platform>
screens: []
updated: <date>
tags: [frontend, domain/<domain>]
---

# 📱 <Feature name> · Frontend

**Feature note:** [[<Feature name>]] · **Backend:** ✅ Done / 🟡 Partial · **Read first:** [[Frontend Contract]]

One paragraph: what the client builds for this feature, in design terms.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#sNN\|sNN]] Name | | `GET /…` |

## Flow

1. Step, with the request and what to do with the response.
2. …

## Shapes that matter

Request fields with their rules (lengths, formats, `null` semantics) and the
response fields the UI renders. Point to `/docs` for the full schema.

## State to keep on the client

What to cache, keyed by what, and when to refetch.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 404 | `E_…` | | |

## Rules the UI must respect

Privacy and product rules the backend enforces that the UI must not undermine.

## Not available yet

- What the design shows that has no endpoint, with the task: [[T-NNN …]]

## Checklist

- [ ] …
