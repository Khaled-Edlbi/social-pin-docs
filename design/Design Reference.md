---
type: reference
updated: 2026-10-15
tags: [design, reference]
---

# Design Reference

The design is the reference for every feature note in this vault. It lives in `socialPin-design/` at the root of the backend repo (`social-pin`), not in this docs repo; this note says what each file is and how the vault points into it.

## Files

| File | What it is | Used by |
|---|---|---|
| `socialPin-design/.proto2.json` | The **78 prototype screens** (`s00a` … `s75`): id, name, inner HTML, flow. The screen ids used everywhere in this vault are this file's own numbering. | [[Screen Index]] |
| `socialPin-design/.wire.json` | The **click-through map**: for each screen, the tappable labels and the screen each leads to. | [[Navigation Map]], "Leads to" lines in [[Screen Index]] |
| `socialPin-design/.proto-screens.json`, `.proto3.json` | Earlier / alternative screen sets. Not mapped. | — |
| `socialPin-design/uploads/SocialPin_Mobile_UIUX_Wireframe_Brief.md` | The **wireframe brief**: purpose, elements, states and motion for every screen, by journey. Copied verbatim to [[Wireframe Brief]]. | [[Brief Section Map]] |
| `socialPin-design/SocialPin Prototype Aurora Sky.dc.html` and siblings | Clickable HTML prototypes in several visual styles (Aurora, Aurora Sky, Liquid Light, Wireframe). Open in a browser. `(offline)` variants need no network. | Visual reference |
| `socialPin-design/SocialPin Wireframes.dc.html` | Wireframe-fidelity version of the same flows. | Structure reference |
| `socialPin-design/screenshots/` | Five captures, copied below. | — |

## How to open the prototype

Open `socialPin-design/SocialPin Prototype Aurora Sky (offline).html` in a browser. Screens are numbered in the prototype's own order; the number shown on a screen is its `s` id.

## Screenshots

![[events.png]]
![[gemma.png]]
![[ll-azure.png]]
![[01-ll-check.png]]
![[02-ll-check.png]]

## How the vault references the design

- Every feature note has a **Design reference** section listing its screens and brief sections.
- Every task note lists its screens.
- [[Screen Index]] is the inverse map: screen → features → status.
- The six [[Decisions]] are exactly the places where a screen and the backend cannot both be right.

## Design-side gaps noticed while mapping

- `s35` (scanner) is referenced by the click-through map but has no screen in `.proto2.json`.
- `s32`, `s33`, `s35` are skipped in the numbering.
- The brief's §3.1 says "create password"; the prototype's s01 says "no password to remember". See [[D-01 Passwordless login]].
