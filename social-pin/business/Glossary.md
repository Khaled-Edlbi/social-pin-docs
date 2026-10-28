---
type: project
created: 2026-10-15
updated: 2026-10-28
tags: [project]
layer: business
---

# Glossary

| Term | Meaning | Where |
|---|---|---|
| **Ring** | An audience bound to one perspective of a user's profile. Types: `PERSONAL`, `CORPORATE`, `EVENT`, `MINI_EVENT`, `MEETING`. | [[F-11 Rings]] |
| **Default Ring** | The Ring a scanned QR or a Pin-name lookup resolves to when the viewer is in no other. Created at registration. | [[F-02 Auth & Sign-up]] |
| **Projection** (ring profile) | What a Ring shows: photo, bio, nickname, theme, links, info blocks, attachments, widgets, `show*` flags. | [[F-10 Ring Projection]] |
| **Perspective** | A viewer's rendered view of one person through one Ring. A viewer in several Rings of one person holds several perspectives. | [[F-12 View As & Pin Views]] |
| **View as** | The owner previewing a Ring exactly as its members see it. Same code path as the member's view. | [[F-12 View As & Pin Views]] |
| **Pin name** | The `!handle`, unique, with a public availability check that never says who holds a taken name. | [[F-07 Profiles & Pin Name]] |
| **Member** | A user granted a Ring's perspective, with an optional access window. Private to the owner. | [[F-09 Ring Members]] |
| **Delegated admin** | A user allowed to administer someone else's Ring at a permission level. | [[F-16 Delegated Admins]] |
| **Block** | Mutual, overrides membership in both directions. | [[F-08 Ring Access Engine]] |
| **Connection / Connect request** | An access request; on accept the owner picks the Ring (`grantedRingId`, never exposed to the requester). | [[F-14 Connections]] |
| **Badge / QR** | The shareable code bound to the active Ring, rotated every 24 h. | [[F-18 Badge & QR]] |
| **PinCast** | Proximity broadcast of a Ring, limited by distance and time; results list who was reached. | [[F-20 PinCast & Nearby]] |
| **Event Ring** | An `EVENT` Ring granted on registration; entering event mode makes it active. | [[F-21 Event Ring Auto-creation]] |
| **Temporary Ring** | `isTemporary` with a window; after it lapses the owner chooses a disposition. | [[F-11 Rings]] |
| **Disposition** | `UNDECIDED → KEEP | MERGE | AUTO_DELETE` for a temporary Ring. | [[F-11 Rings]] |
| **Sensitive fields** | Birthdate, gender, marital status, phone, email. Live once on the profile, opt-in per Ring, default off. | [[F-10 Ring Projection]] |
| **Gemma** | The AI layer: assistant sheet, Smart Match, suggestions everywhere. Pro gates its automation. | [[F-36 Gemma AI]] |
| **Pro** | The paid account type; gates Smart Match, any-lounge access, Gemma automation, permanent QR. | [[F-28 Subscription (Free vs Pro)]] |
| **Onboarding token** | A 15-minute token proving "this destination was verified for this purpose". Not a session. | [[Auth Model]] |
| **devCode** | The plaintext OTP returned on every issued code, in every environment, because delivery is not wired. Removed once it is. | [[F-32 Code Delivery]] |
| **sNN** | A prototype screen id, e.g. `s44`. | [[Screen Index]] |
