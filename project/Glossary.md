---
type: project
updated: 2026-10-15
tags: [project]
---

# Glossary

| Term | Meaning | Where |
|---|---|---|
| **Ring** | An audience bound to one perspective of a user's profile. Types: `PERSONAL`, `CORPORATE`, `EVENT`, `MINI_EVENT`, `MEETING`. | [[Rings]] |
| **Default Ring** | The Ring a scanned QR or a Pin-name lookup resolves to when the viewer is in no other. Created at registration. | [[Auth & Sign-up]] |
| **Projection** (ring profile) | What a Ring shows: photo, bio, nickname, theme, links, info blocks, attachments, widgets, `show*` flags. | [[Ring Projection]] |
| **Perspective** | A viewer's rendered view of one person through one Ring. A viewer in several Rings of one person holds several perspectives. | [[View As & Pin Views]] |
| **View as** | The owner previewing a Ring exactly as its members see it. Same code path as the member's view. | [[View As & Pin Views]] |
| **Pin name** | The `!handle`, unique, with a public availability check that never says who holds a taken name. | [[Profiles & Pin Name]] |
| **Member** | A user granted a Ring's perspective, with an optional access window. Private to the owner. | [[Ring Members]] |
| **Delegated admin** | A user allowed to administer someone else's Ring at a permission level. | [[Delegated Admins]] |
| **Block** | Mutual, overrides membership in both directions. | [[Ring Access Engine]] |
| **Connection / Connect request** | An access request; on accept the owner picks the Ring (`grantedRingId`, never exposed to the requester). | [[Connections]] |
| **Badge / QR** | The shareable code bound to the active Ring, rotated every 24 h. | [[Badge & QR]] |
| **PinCast** | Proximity broadcast of a Ring, limited by distance and time; results list who was reached. | [[PinCast & Nearby]] |
| **Event Ring** | An `EVENT` Ring granted on registration; entering event mode makes it active. | [[Event Ring Auto-creation]] |
| **Temporary Ring** | `isTemporary` with a window; after it lapses the owner chooses a disposition. | [[Rings]] |
| **Disposition** | `UNDECIDED → KEEP | MERGE | AUTO_DELETE` for a temporary Ring. | [[Rings]] |
| **Sensitive fields** | Birthdate, gender, marital status, phone, email. Live once on the profile, opt-in per Ring, default off. | [[Ring Projection]] |
| **Gemma** | The AI layer: assistant sheet, Smart Match, suggestions everywhere. Pro gates its automation. | [[Gemma AI]] |
| **Pro** | The paid account type; gates Smart Match, any-lounge access, Gemma automation, permanent QR. | [[Subscription (Free vs Pro)]] |
| **Onboarding token** | A 15-minute token proving "this destination was verified for this purpose". Not a session. | [[Auth Model]] |
| **devCode** | The plaintext OTP returned on every issued code, in every environment, because delivery is not wired. Removed once it is. | [[Code Delivery]] |
| **sNN** | A prototype screen id, e.g. `s44`. | [[Screen Index]] |
