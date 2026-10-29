---
type: map
updated: 2026-10-26
tags: [map, design]
---

# Screen Index

All 78 screens of the prototype (`socialPin-design/.proto2.json`, ids are the prototype's own numbering) plus `s35`, which the click-through map references but the prototype file lacks. Each screen links to the backend feature(s) behind it; the status column is the worst case across those features.

| Screen | Name | Status | Features | Note |
|---|---|---|---|---|
| <a id="s00a"></a>**s00a** | Splash | ⬜ | [[App Shell & Onboarding Narrative]] |  |
| <a id="s00b"></a>**s00b** | Value · Rings | ⬜ | [[App Shell & Onboarding Narrative]] |  |
| <a id="s00c"></a>**s00c** | Value · PinCast | ⬜ | [[App Shell & Onboarding Narrative]] |  |
| <a id="s00d"></a>**s00d** | Value · Events | ⬜ | [[App Shell & Onboarding Narrative]] |  |
| <a id="s01"></a>**s01** | Welcome | 🟡 | [[Auth & Sign-up]], [[Linked Accounts (OAuth)]] | Promises no password → ND-01 |
| <a id="s02"></a>**s02** | Verify | 🟡 | [[Auth & Sign-up]], [[Code Delivery]] | Resend timer, expired code |
| <a id="s03"></a>**s03** | Start from | ❌ | [[Onboarding Imports]] |  |
| <a id="s03a"></a>**s03a** | Scan a card | ❌ | [[Onboarding Imports]] |  |
| <a id="s03b"></a>**s03b** | Portfolio URL | ❌ | [[Onboarding Imports]] |  |
| <a id="s04"></a>**s04** | Importing | 🟡 | [[Onboarding Imports]], [[Linked Accounts (OAuth)]] |  |
| <a id="s05"></a>**s05** | Review import | ❌ | [[Onboarding Imports]] | Needs base profile → ND-02 |
| <a id="s06"></a>**s06** | Claim your Pin | ✅ | [[Profiles & Pin Name]] | Availability check done; yearly rename + suggestions → ND-06 |
| <a id="s07"></a>**s07** | Interests | 🟡 | [[Interests]] |  |
| <a id="s08"></a>**s08** | First Ring | ✅ | [[Rings]], [[Auth & Sign-up]] | Default Ring is created by complete-registration |
| <a id="s09"></a>**s09** | Create first Ring | ✅ | [[Rings]], [[Ring Projection]] |  |
| <a id="s10"></a>**s10** | View as teaser | ✅ | [[View As & Pin Views]] |  |
| <a id="s11"></a>**s11** | Home · Broadcasting | 🟡 | [[Rings]], [[PinCast & Nearby]], [[Counts]] |  |
| <a id="s12"></a>**s12** | Home · Idle | 🟡 | [[Rings]], [[PinCast & Nearby]], [[Counts]], [[Gemma AI]] |  |
| <a id="s13"></a>**s13** | Gemma sheet | ❌ | [[Gemma AI]] |  |
| <a id="s14"></a>**s14** | Ring data | 🟡 | [[Ring Projection]], [[Counts]], [[Widgets]], [[Files Upload]] |  |
| <a id="s15"></a>**s15** | Ring people | 🟡 | [[Ring Members]], [[Connections]] |  |
| <a id="s16"></a>**s16** | My Rings | 🟡 | [[Rings]], [[Counts]] |  |
| <a id="s17"></a>**s17** | Shared with me | 🟡 | [[Rings]], [[Ring Invitations & Join]] | List done; review / decline invite todo |
| <a id="s18"></a>**s18** | New Ring · step 1 | ✅ | [[Rings]] | Copy a Ring → ND-05 |
| <a id="s19"></a>**s19** | New Ring · step 2 (who is in it) | ✅ | [[Rings]], [[Ring Members]] | Audience settings → ND-04 |
| <a id="s20"></a>**s20** | New Ring · step 3 (what it shows) | ✅ | [[Ring Projection]], [[Files Upload]] | Field library → ND-03 |
| <a id="s21"></a>**s21** | New Ring · step 4 (how you appear) | ✅ | [[Rings]], [[Ring Projection]] |  |
| <a id="s22"></a>**s22** | Edit · name & purpose | ✅ | [[Rings]] | Purpose → ND-04 |
| <a id="s23"></a>**s23** | Edit · how you appear | ✅ | [[Ring Projection]] | Inherit → ND-05 / ND-02 |
| <a id="s24"></a>**s24** | Edit · what it shows | ✅ | [[Ring Projection]], [[Files Upload]] | "4 of 7 on" → ND-03 |
| <a id="s25"></a>**s25** | Edit · social profiles | ✅ | [[Ring Projection]] |  |
| <a id="s26"></a>**s26** | Edit · access | 🟡 | [[Rings]], [[Delegated Admins]] | Settings → ND-04 |
| <a id="s27"></a>**s27** | Edit · permissions | 🟡 | [[Rings]], [[Delegated Admins]] | All settings → ND-04 |
| <a id="s28"></a>**s28** | Copy from a Ring | ✅ | [[Ring Projection]] | → ND-05 |
| <a id="s29"></a>**s29** | Photo for this Ring | 🟡 | [[Ring Projection]], [[Photo Library]] | "Reset to Pin" → ND-02 |
| <a id="s30"></a>**s30** | Photo library | 🟡 | [[Photo Library]] |  |
| <a id="s31"></a>**s31** | View as (flip) | ✅ | [[View As & Pin Views]] |  |
| <a id="s34"></a>**s34** | Badge (flip) | 🟡 | [[Badge & QR]], [[Subscription (Free vs Pro)]] |  |
| <a id="s35"></a>**s35** | Scanner | 🟡 | [[Badge & QR]] | Referenced by the click-through map, not in the prototype file |
| <a id="s36"></a>**s36** | Add to this Ring | 🟡 | [[Ring Projection]], [[Widgets]], [[Files Upload]] |  |
| <a id="s37"></a>**s37** | Widgets | 🟡 | [[Widgets]] |  |
| <a id="s38"></a>**s38** | Discover hub | ❌ | [[Discover Hub & Search]] |  |
| <a id="s39"></a>**s39** | PinCast · hidden | ❌ | [[PinCast & Nearby]] |  |
| <a id="s40"></a>**s40** | PinCast · live | ❌ | [[PinCast & Nearby]] |  |
| <a id="s41"></a>**s41** | PinCast setup | ❌ | [[PinCast & Nearby]] |  |
| <a id="s42"></a>**s42** | PinCast results | ❌ | [[PinCast & Nearby]], [[Connections]] |  |
| <a id="s43"></a>**s43** | Reading the code | 🟡 | [[Badge & QR]] |  |
| <a id="s44"></a>**s44** | Scanned Pin | 🟡 | [[View As & Pin Views]], [[Badge & QR]], [[Connections]] | Read part done; Connect todo |
| <a id="s45"></a>**s45** | Requests | ❌ | [[Connections]] |  |
| <a id="s46"></a>**s46** | Accept · pick a Ring | ❌ | [[Connections]], [[Gemma AI]] |  |
| <a id="s47"></a>**s47** | Connection detail | 🟡 | [[Connections]], [[Ring Members]] | Reassign / revoke done; detail todo |
| <a id="s48"></a>**s48** | Events tab | ❌ | [[Events Before]] |  |
| <a id="s49"></a>**s49** | Event landing | ❌ | [[Events Before]] |  |
| <a id="s50"></a>**s50** | Tickets & levels | ❌ | [[Events Before]], [[Payments & Orders]] |  |
| <a id="s51"></a>**s51** | Payment | ❌ | [[Payments & Orders]] |  |
| <a id="s52"></a>**s52** | Event Ring granted | 🟡 | [[Event Ring Auto-creation]], [[Events Before]] |  |
| <a id="s53"></a>**s53** | Event mode | ❌ | [[Events During]] |  |
| <a id="s54"></a>**s54** | Exhibitors | ❌ | [[Events During]] |  |
| <a id="s55"></a>**s55** | Exhibitor | ❌ | [[Events During]], [[Meetings]] |  |
| <a id="s56"></a>**s56** | Event pass | 🟡 | [[Events During]], [[Badge & QR]] |  |
| <a id="s57"></a>**s57** | Floor map | ❌ | [[Events During]] |  |
| <a id="s58"></a>**s58** | Catalogue | ❌ | [[Events During]] | No products table |
| <a id="s59"></a>**s59** | Request a meeting | ❌ | [[Meetings]] |  |
| <a id="s60"></a>**s60** | Smart Match | ❌ | [[Gemma AI]] |  |
| <a id="s61"></a>**s61** | My meetings | ❌ | [[Meetings]] |  |
| <a id="s62"></a>**s62** | Post-event summary | 🟡 | [[Post-Event]], [[Rings]], [[Connections]] | Keep / merge / expire done |
| <a id="s63"></a>**s63** | Business account | ❌ | [[Exhibitor]], [[Companies]] |  |
| <a id="s64"></a>**s64** | Incoming meetings | ❌ | [[Meetings]], [[Exhibitor]] |  |
| <a id="s65"></a>**s65** | Booth analytics | ❌ | [[Exhibitor]] |  |
| <a id="s66"></a>**s66** | Meetings | ❌ | [[Meetings]] |  |
| <a id="s67"></a>**s67** | Meeting detail | ❌ | [[Meetings]] |  |
| <a id="s68"></a>**s68** | Me / Account | 🟡 | [[Account]], [[Linked Accounts (OAuth)]], [[Counts]], [[Subscription (Free vs Pro)]] |  |
| <a id="s69"></a>**s69** | Notifications | ❌ | [[Notifications]] |  |
| <a id="s70"></a>**s70** | Subscription | ❌ | [[Subscription (Free vs Pro)]] |  |
| <a id="s71"></a>**s71** | Interests | 🟡 | [[Interests]] |  |
| <a id="s72"></a>**s72** | My companies | ❌ | [[Companies]] |  |
| <a id="s73"></a>**s73** | Company detail | ❌ | [[Companies]] |  |
| <a id="s74"></a>**s74** | Join a company Ring | ❌ | [[Ring Invitations & Join]], [[Companies]] |  |
| <a id="s75"></a>**s75** | My devices | 🟡 | [[Devices & NFC]] |  |

## Per screen

Headings so that `[[Screen Index#s44]]` links land on the screen.

### s00a

**Splash** · ⬜ Frontend only · Features: [[App Shell & Onboarding Narrative]]

Leads to: SocialPin → [[Screen Index#s00b|s00b]]

### s00b

**Value · Rings** · ⬜ Frontend only · Features: [[App Shell & Onboarding Narrative]]

Leads to: Next → [[Screen Index#s00c|s00c]], Skip → [[Screen Index#s01|s01]]

Reached from: [[Screen Index#s00a|s00a]]

### s00c

**Value · PinCast** · ⬜ Frontend only · Features: [[App Shell & Onboarding Narrative]]

Leads to: Next → [[Screen Index#s00d|s00d]], Skip → [[Screen Index#s01|s01]]

Reached from: [[Screen Index#s00b|s00b]]

### s00d

**Value · Events** · ⬜ Frontend only · Features: [[App Shell & Onboarding Narrative]]

Leads to: Get started → [[Screen Index#s01|s01]], Skip → [[Screen Index#s01|s01]]

Reached from: [[Screen Index#s00c|s00c]]

### s01

**Welcome** · 🟡 Partial (needs more) · Features: [[Auth & Sign-up]], [[Linked Accounts (OAuth)]] · Promises no password → ND-01

Leads to: Send me a code → [[Screen Index#s02|s02]], Continue with LinkedIn → [[Screen Index#s04|s04]]

Reached from: [[Screen Index#s00b|s00b]], [[Screen Index#s00c|s00c]], [[Screen Index#s00d|s00d]], [[Screen Index#s02|s02]]

### s02

**Verify** · 🟡 Partial (needs more) · Features: [[Auth & Sign-up]], [[Code Delivery]] · Resend timer, expired code

Leads to: Verify and continue → [[Screen Index#s03|s03]], Use a different email → [[Screen Index#s01|s01]]

Reached from: [[Screen Index#s01|s01]]

### s03

**Start from** · ❌ TODO · Features: [[Onboarding Imports]]

Leads to: Import from LinkedIn → [[Screen Index#s04|s04]], Fill it in myself → [[Screen Index#s06|s06]], Scan a paper business card → [[Screen Index#s03a|s03a]], Behance or a portfolio URL → [[Screen Index#s03b|s03b]]

Reached from: [[Screen Index#s02|s02]], [[Screen Index#s38|s38]]

### s03a

**Scan a card** · ❌ TODO · Features: [[Onboarding Imports]]

Leads to: Use this card → [[Screen Index#s05|s05]], Type it in instead → [[Screen Index#s06|s06]]

Reached from: [[Screen Index#s03|s03]]

### s03b

**Portfolio URL** · ❌ TODO · Features: [[Onboarding Imports]]

Leads to: Import from this site → [[Screen Index#s05|s05]], Skip for now → [[Screen Index#s06|s06]]

Reached from: [[Screen Index#s03|s03]]

### s04

**Importing** · 🟡 Partial (needs more) · Features: [[Onboarding Imports]], [[Linked Accounts (OAuth)]]

Leads to: Skip and fill it in myself → [[Screen Index#s06|s06]]

Reached from: [[Screen Index#s01|s01]], [[Screen Index#s03|s03]]

### s05

**Review import** · ❌ TODO · Features: [[Onboarding Imports]] · Needs base profile → ND-02

Leads to: Confirm & continue → [[Screen Index#s06|s06]], Skip → [[Screen Index#s06|s06]]

Reached from: [[Screen Index#s03a|s03a]], [[Screen Index#s03b|s03b]]

### s06

**Claim your Pin** · ✅ Done · Features: [[Profiles & Pin Name]] · Availability check done; yearly rename + suggestions → ND-06

Leads to: Continue → [[Screen Index#s07|s07]]

Reached from: [[Screen Index#s03a|s03a]], [[Screen Index#s03b|s03b]], [[Screen Index#s03|s03]], [[Screen Index#s04|s04]], [[Screen Index#s05|s05]]

### s07

**Interests** · 🟡 Partial (needs more) · Features: [[Interests]]

Leads to: Continue · 3 picked → [[Screen Index#s08|s08]], Skip → [[Screen Index#s08|s08]]

Reached from: [[Screen Index#s06|s06]]

### s08

**First Ring** · ✅ Done · Features: [[Rings]], [[Auth & Sign-up]] · Default Ring is created by complete-registration

Leads to: Create my first Ring → [[Screen Index#s09|s09]], Take me to the app → [[Screen Index#s11|s11]]

Reached from: [[Screen Index#s07|s07]]

### s09

**Create first Ring** · ✅ Done · Features: [[Rings]], [[Ring Projection]]

Leads to: Create Ring → [[Screen Index#s10|s10]], Later → [[Screen Index#s11|s11]]

Reached from: [[Screen Index#s08|s08]]

### s10

**View as teaser** · ✅ Done · Features: [[View As & Pin Views]]

Leads to: Got it → [[Screen Index#s11|s11]]

Reached from: [[Screen Index#s09|s09]]

### s11

**Home · Broadcasting** · 🟡 Partial (needs more) · Features: [[Rings]], [[PinCast & Nearby]], [[Counts]]

Leads to: My badge → [[Screen Index#s34|s34]], PinCast → [[Screen Index#s40|s40]], Scan → [[Screen Index#s35|s35]], Meetings → [[Screen Index#s66|s66]], All 5 → [[Screen Index#s16|s16]], Browse all → [[Screen Index#s48|s48]], Events → [[Screen Index#s48|s48]], Discover → [[Screen Index#s38|s38]], Me → [[Screen Index#s68|s68]], Badge → [[Screen Index#s34|s34]], Home → [[Screen Index#s11|s11]], Stop → [[Screen Index#s12|s12]], See → [[Screen Index#s48|s48]], Add manually → [[Screen Index#s45|s45]], TechSummit '26 → [[Screen Index#s53|s53]], Clients → [[Screen Index#s14|s14]], Investors → [[Screen Index#s14|s14]]

Reached from: [[Screen Index#s08|s08]], [[Screen Index#s09|s09]], [[Screen Index#s10|s10]], [[Screen Index#s11|s11]], [[Screen Index#s12|s12]], [[Screen Index#s13|s13]], [[Screen Index#s16|s16]], [[Screen Index#s17|s17]], [[Screen Index#s38|s38]], [[Screen Index#s39|s39]], [[Screen Index#s40|s40]], [[Screen Index#s42|s42]], [[Screen Index#s44|s44]], [[Screen Index#s48|s48]], [[Screen Index#s53|s53]], [[Screen Index#s62|s62]], [[Screen Index#s68|s68]]

### s12

**Home · Idle** · 🟡 Partial (needs more) · Features: [[Rings]], [[PinCast & Nearby]], [[Counts]], [[Gemma AI]]

Leads to: Go visible · Clients, 30 min → [[Screen Index#s11|s11]], My badge → [[Screen Index#s34|s34]], Meetings → [[Screen Index#s66|s66]], All 5 → [[Screen Index#s16|s16]], Change → [[Screen Index#s41|s41]], Ask Gemma → [[Screen Index#s13|s13]], Events → [[Screen Index#s48|s48]], Discover → [[Screen Index#s38|s38]], Me → [[Screen Index#s68|s68]], Badge → [[Screen Index#s34|s34]], Home → [[Screen Index#s12|s12]], Browse all → [[Screen Index#s48|s48]], Clients → [[Screen Index#s14|s14]], Investors → [[Screen Index#s14|s14]], Family → [[Screen Index#s14|s14]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s12|s12]]

### s13

**Gemma sheet** · ❌ TODO · Features: [[Gemma AI]]

Leads to: Accept into Clients → [[Screen Index#s46|s46]], Later → [[Screen Index#s11|s11]], Open meeting → [[Screen Index#s67|s67]], Ask Gemma for intros → [[Screen Index#s60|s60]], Reschedule → [[Screen Index#s67|s67]]

Reached from: [[Screen Index#s12|s12]]

### s14

**Ring data** · 🟡 Partial (needs more) · Features: [[Ring Projection]], [[Counts]], [[Widgets]]

Leads to: People · 148 → [[Screen Index#s15|s15]], View as Clients → [[Screen Index#s31|s31]], Rename → [[Screen Index#s22|s22]], + Add information to this Ring → [[Screen Index#s36|s36]], + Add → [[Screen Index#s36|s36]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s12|s12]], [[Screen Index#s15|s15]], [[Screen Index#s16|s16]], [[Screen Index#s17|s17]], [[Screen Index#s21|s21]], [[Screen Index#s22|s22]], [[Screen Index#s23|s23]], [[Screen Index#s24|s24]], [[Screen Index#s25|s25]], [[Screen Index#s26|s26]], [[Screen Index#s36|s36]], [[Screen Index#s37|s37]], [[Screen Index#s73|s73]]

### s15

**Ring people** · 🟡 Partial (needs more) · Features: [[Ring Members]], [[Connections]]

Leads to: Ring data → [[Screen Index#s14|s14]], Rename → [[Screen Index#s22|s22]], Scan someone in → [[Screen Index#s35|s35]], Move from a Ring → [[Screen Index#s16|s16]], Add → [[Screen Index#s46|s46]]

Reached from: [[Screen Index#s14|s14]], [[Screen Index#s47|s47]], [[Screen Index#s73|s73]]

### s16

**My Rings** · 🟡 Partial (needs more) · Features: [[Rings]], [[Counts]]

Leads to: Shared with me · 2 → [[Screen Index#s17|s17]], + New → [[Screen Index#s18|s18]], Join → [[Screen Index#s74|s74]], Create a Ring → [[Screen Index#s18|s18]], Public → [[Screen Index#s14|s14]], Family → [[Screen Index#s14|s14]], Clients → [[Screen Index#s14|s14]], Company → [[Screen Index#s14|s14]], Investors → [[Screen Index#s14|s14]], TechSummit '26 → [[Screen Index#s14|s14]], Home → [[Screen Index#s11|s11]], Events → [[Screen Index#s48|s48]], Discover → [[Screen Index#s38|s38]], Me → [[Screen Index#s68|s68]], Badge → [[Screen Index#s34|s34]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s12|s12]], [[Screen Index#s15|s15]], [[Screen Index#s17|s17]], [[Screen Index#s18|s18]], [[Screen Index#s19|s19]], [[Screen Index#s20|s20]], [[Screen Index#s21|s21]], [[Screen Index#s26|s26]], [[Screen Index#s52|s52]], [[Screen Index#s74|s74]]

### s17

**Shared with me** · 🟡 Partial (needs more) · Features: [[Rings]], [[Ring Invitations & Join]] · List done; review / decline invite todo

Leads to: My Rings · 5 → [[Screen Index#s16|s16]], + New → [[Screen Index#s18|s18]], Acme Team → [[Screen Index#s14|s14]], TechSummit Speakers → [[Screen Index#s14|s14]], Review invite → [[Screen Index#s74|s74]], Join with a code → [[Screen Index#s74|s74]], Home → [[Screen Index#s11|s11]], Me → [[Screen Index#s68|s68]], Discover → [[Screen Index#s38|s38]], Events → [[Screen Index#s48|s48]], Badge → [[Screen Index#s34|s34]]

Reached from: [[Screen Index#s16|s16]]

### s18

**New Ring · step 1** · ✅ Done · Features: [[Rings]] · Copy a Ring → ND-05

Leads to: Next · who is in it → [[Screen Index#s19|s19]], Cancel → [[Screen Index#s16|s16]]

Reached from: [[Screen Index#s16|s16]], [[Screen Index#s17|s17]], [[Screen Index#s19|s19]]

### s19

**New Ring · step 2 (who is in it)** · ✅ Done · Features: [[Rings]], [[Ring Members]] · Audience settings → ND-04

Leads to: Next · what it shows → [[Screen Index#s20|s20]], Cancel → [[Screen Index#s16|s16]], Back → [[Screen Index#s18|s18]]

Reached from: [[Screen Index#s18|s18]], [[Screen Index#s20|s20]]

### s20

**New Ring · step 3 (what it shows)** · ✅ Done · Features: [[Ring Projection]] · Field library → ND-03

Leads to: Next · how you appear → [[Screen Index#s21|s21]], Cancel → [[Screen Index#s16|s16]], Back → [[Screen Index#s19|s19]]

Reached from: [[Screen Index#s19|s19]], [[Screen Index#s21|s21]]

### s21

**New Ring · step 4 (how you appear)** · ✅ Done · Features: [[Rings]], [[Ring Projection]]

Leads to: Create Ring → [[Screen Index#s14|s14]], Cancel → [[Screen Index#s16|s16]], Back → [[Screen Index#s20|s20]]

Reached from: [[Screen Index#s20|s20]]

### s22

**Edit · name & purpose** · ✅ Done · Features: [[Rings]] · Purpose → ND-04

Leads to: Save → [[Screen Index#s14|s14]], Cancel → [[Screen Index#s14|s14]]

Reached from: [[Screen Index#s14|s14]], [[Screen Index#s15|s15]]

### s23

**Edit · how you appear** · ✅ Done · Features: [[Ring Projection]] · Inherit → ND-05 / ND-02

Leads to: Save → [[Screen Index#s14|s14]], Cancel → [[Screen Index#s14|s14]], Change → [[Screen Index#s29|s29]], Copy a Ring → [[Screen Index#s28|s28]], Upload → [[Screen Index#s30|s30]]

Reached from: [[Screen Index#s28|s28]], [[Screen Index#s29|s29]]

### s24

**Edit · what it shows** · ✅ Done · Features: [[Ring Projection]] · "4 of 7 on" → ND-03

Leads to: Save → [[Screen Index#s14|s14]], Cancel → [[Screen Index#s14|s14]], + Add a field, link or file → [[Screen Index#s36|s36]]

Reached from: [[Screen Index#s36|s36]]

### s25

**Edit · social profiles** · ✅ Done · Features: [[Ring Projection]]

Leads to: Save → [[Screen Index#s14|s14]], Cancel → [[Screen Index#s14|s14]], + Connect another account → [[Screen Index#s36|s36]]

Reached from: [[Screen Index#s36|s36]]

### s26

**Edit · access** · 🟡 Partial (needs more) · Features: [[Rings]], [[Delegated Admins]] · Settings → ND-04

Leads to: Save → [[Screen Index#s14|s14]], Cancel → [[Screen Index#s14|s14]], Permissions → [[Screen Index#s27|s27]], Delete Ring → [[Screen Index#s16|s16]]

Reached from: [[Screen Index#s27|s27]]

### s27

**Edit · permissions** · 🟡 Partial (needs more) · Features: [[Rings]], [[Delegated Admins]] · All settings → ND-04

Leads to: Save → [[Screen Index#s26|s26]], Cancel → [[Screen Index#s26|s26]]

Reached from: [[Screen Index#s26|s26]]

### s28

**Copy from a Ring** · ✅ Done · Features: [[Ring Projection]] · → ND-05

Leads to: Use this bio → [[Screen Index#s23|s23]], Cancel → [[Screen Index#s23|s23]]

Reached from: [[Screen Index#s23|s23]]

### s29

**Photo for this Ring** · 🟡 Partial (needs more) · Features: [[Ring Projection]], [[Photo Library]] · "Reset to Pin" → ND-02

Leads to: Use for Clients → [[Screen Index#s23|s23]], Reset to Pin → [[Screen Index#s23|s23]], Upload → [[Screen Index#s30|s30]]

Reached from: [[Screen Index#s23|s23]], [[Screen Index#s30|s30]]

### s30

**Photo library** · 🟡 Partial (needs more) · Features: [[Photo Library]]

Leads to: Done → [[Screen Index#s29|s29]], Cancel → [[Screen Index#s29|s29]], + Add → [[Screen Index#s29|s29]]

Reached from: [[Screen Index#s23|s23]], [[Screen Index#s29|s29]], [[Screen Index#s68|s68]]

### s31

**View as (flip)** · ✅ Done · Features: [[View As & Pin Views]]

Reached from: [[Screen Index#s14|s14]]

### s34

**Badge (flip)** · 🟡 Partial (needs more) · Features: [[Badge & QR]], [[Subscription (Free vs Pro)]]

Leads to: Get Pro → [[Screen Index#s70|s70]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s12|s12]], [[Screen Index#s16|s16]], [[Screen Index#s17|s17]], [[Screen Index#s38|s38]], [[Screen Index#s39|s39]], [[Screen Index#s40|s40]], [[Screen Index#s48|s48]], [[Screen Index#s56|s56]], [[Screen Index#s67|s67]], [[Screen Index#s68|s68]]

### s35

**Scanner** · 🟡 Partial (needs more) · Features: [[Badge & QR]] · Referenced by the click-through map, not in the prototype file

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s15|s15]], [[Screen Index#s69|s69]]

### s36

**Add to this Ring** · 🟡 Partial (needs more) · Features: [[Ring Projection]], [[Widgets]], [[Files Upload]]

Leads to: Widget → [[Screen Index#s37|s37]], Done → [[Screen Index#s14|s14]], Field → [[Screen Index#s24|s24]], Social profile → [[Screen Index#s25|s25]], File → [[Screen Index#s24|s24]], Add → [[Screen Index#s37|s37]]

Reached from: [[Screen Index#s14|s14]], [[Screen Index#s24|s24]], [[Screen Index#s25|s25]], [[Screen Index#s37|s37]]

### s37

**Widgets** · 🟡 Partial (needs more) · Features: [[Widgets]]

Leads to: Add 2 widgets → [[Screen Index#s14|s14]], Cancel → [[Screen Index#s36|s36]]

Reached from: [[Screen Index#s36|s36]]

### s38

**Discover hub** · ❌ TODO · Features: [[Discover Hub & Search]]

Leads to: PinCast → [[Screen Index#s39|s39]], Import contacts → [[Screen Index#s03|s03]], People → [[Screen Index#s45|s45]], Events → [[Screen Index#s48|s48]], Companies → [[Screen Index#s72|s72]], Exhibitors → [[Screen Index#s54|s54]], Home → [[Screen Index#s11|s11]], Me → [[Screen Index#s68|s68]], Badge → [[Screen Index#s34|s34]], Discover → [[Screen Index#s38|s38]], !vertexlabs → [[Screen Index#s55|s55]], !tareknassar → [[Screen Index#s44|s44]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s12|s12]], [[Screen Index#s16|s16]], [[Screen Index#s17|s17]], [[Screen Index#s38|s38]], [[Screen Index#s39|s39]], [[Screen Index#s40|s40]], [[Screen Index#s48|s48]], [[Screen Index#s68|s68]]

### s39

**PinCast · hidden** · ❌ TODO · Features: [[PinCast & Nearby]]

Leads to: Go visible · Clients, 30 min → [[Screen Index#s40|s40]], Change → [[Screen Index#s41|s41]], Home → [[Screen Index#s11|s11]], Events → [[Screen Index#s48|s48]], Me → [[Screen Index#s68|s68]], Badge → [[Screen Index#s34|s34]], Discover → [[Screen Index#s38|s38]]

Reached from: [[Screen Index#s38|s38]]

### s40

**PinCast · live** · ❌ TODO · Features: [[PinCast & Nearby]]

Leads to: Stop → [[Screen Index#s42|s42]], Change Ring or range → [[Screen Index#s41|s41]], Dana Al-Amin → [[Screen Index#s44|s44]], Rami Nasser → [[Screen Index#s44|s44]], Hala Sabbagh → [[Screen Index#s44|s44]], Ziad Kanaan → [[Screen Index#s44|s44]], Home → [[Screen Index#s11|s11]], Events → [[Screen Index#s48|s48]], Me → [[Screen Index#s68|s68]], Badge → [[Screen Index#s34|s34]], Discover → [[Screen Index#s38|s38]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s39|s39]], [[Screen Index#s41|s41]], [[Screen Index#s53|s53]]

### s41

**PinCast setup** · ❌ TODO · Features: [[PinCast & Nearby]]

Leads to: Start PinCast → [[Screen Index#s40|s40]]

Reached from: [[Screen Index#s12|s12]], [[Screen Index#s39|s39]], [[Screen Index#s40|s40]], [[Screen Index#s42|s42]]

### s42

**PinCast results** · ❌ TODO · Features: [[PinCast & Nearby]], [[Connections]]

Leads to: Done → [[Screen Index#s11|s11]], Broadcast again → [[Screen Index#s41|s41]], Connect → [[Screen Index#s46|s46]], Accept → [[Screen Index#s46|s46]]

Reached from: [[Screen Index#s40|s40]], [[Screen Index#s69|s69]]

### s43

**Reading the code** · 🟡 Partial (needs more) · Features: [[Badge & QR]]

Leads to: Checking which Ring they belong in → [[Screen Index#s44|s44]]

### s44

**Scanned Pin** · 🟡 Partial (needs more) · Features: [[View As & Pin Views]], [[Badge & QR]], [[Connections]] · Read part done; Connect todo

Leads to: Connect → [[Screen Index#s46|s46]], Save for later → [[Screen Index#s11|s11]]

Reached from: [[Screen Index#s38|s38]], [[Screen Index#s40|s40]], [[Screen Index#s43|s43]]

### s45

**Requests** · ❌ TODO · Features: [[Connections]]

Leads to: Accept → [[Screen Index#s46|s46]], Omar Zayed → [[Screen Index#s47|s47]], Sent · 5 → [[Screen Index#s45|s45]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s38|s38]], [[Screen Index#s45|s45]], [[Screen Index#s46|s46]], [[Screen Index#s47|s47]]

### s46

**Accept · pick a Ring** · ❌ TODO · Features: [[Connections]], [[Gemma AI]]

Leads to: Accept & add to Ring → [[Screen Index#s47|s47]], Not now → [[Screen Index#s45|s45]]

Reached from: [[Screen Index#s13|s13]], [[Screen Index#s15|s15]], [[Screen Index#s42|s42]], [[Screen Index#s44|s44]], [[Screen Index#s45|s45]], [[Screen Index#s62|s62]], [[Screen Index#s69|s69]]

### s47

**Connection detail** · 🟡 Partial (needs more) · Features: [[Connections]], [[Ring Members]] · Reassign / revoke done; detail todo

Leads to: Request meeting → [[Screen Index#s59|s59]], Introduce → [[Screen Index#s45|s45]], Revoke access → [[Screen Index#s15|s15]]

Reached from: [[Screen Index#s45|s45]], [[Screen Index#s46|s46]]

### s48

**Events tab** · ❌ TODO · Features: [[Events Before]]

Leads to: TechSummit '26 → [[Screen Index#s49|s49]], Design Week Beirut → [[Screen Index#s49|s49]], Founders Mixer → [[Screen Index#s49|s49]], Retail Futures Forum → [[Screen Index#s49|s49]], Founders Night → [[Screen Index#s49|s49]], Home → [[Screen Index#s11|s11]], Events → [[Screen Index#s48|s48]], Me → [[Screen Index#s68|s68]], Badge → [[Screen Index#s34|s34]], Discover → [[Screen Index#s38|s38]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s12|s12]], [[Screen Index#s16|s16]], [[Screen Index#s17|s17]], [[Screen Index#s38|s38]], [[Screen Index#s39|s39]], [[Screen Index#s40|s40]], [[Screen Index#s48|s48]], [[Screen Index#s68|s68]]

### s49

**Event landing** · ❌ TODO · Features: [[Events Before]]

Leads to: RSVP & get tickets → [[Screen Index#s50|s50]], Exhibitors → [[Screen Index#s54|s54]], Floor map → [[Screen Index#s57|s57]], Catalogue → [[Screen Index#s58|s58]], Mini-events → [[Screen Index#s58|s58]], Lounges → [[Screen Index#s53|s53]]

Reached from: [[Screen Index#s48|s48]]

### s50

**Tickets & levels** · ❌ TODO · Features: [[Events Before]], [[Payments & Orders]]

Leads to: Continue · $160 → [[Screen Index#s51|s51]], Set up → [[Screen Index#s63|s63]]

Reached from: [[Screen Index#s49|s49]]

### s51

**Payment** · ❌ TODO · Features: [[Payments & Orders]]

Leads to: Pay $160 → [[Screen Index#s52|s52]]

Reached from: [[Screen Index#s50|s50]]

### s52

**Event Ring granted** · 🟡 Partial (needs more) · Features: [[Event Ring Auto-creation]], [[Events Before]]

Leads to: Enter event mode → [[Screen Index#s53|s53]], See it in my Ring hub → [[Screen Index#s16|s16]]

Reached from: [[Screen Index#s51|s51]]

### s53

**Event mode** · ❌ TODO · Features: [[Events During]]

Leads to: Your pass · Full Access → [[Screen Index#s56|s56]], Schedule → [[Screen Index#s58|s58]], Floor map → [[Screen Index#s57|s57]], Catalogue → [[Screen Index#s58|s58]], Exhibitors → [[Screen Index#s54|s54]], Smart Match → [[Screen Index#s60|s60]], Lounges → [[Screen Index#s70|s70]], Nearby by Ring → [[Screen Index#s40|s40]], My meetings today → [[Screen Index#s61|s61]], Upgrade access → [[Screen Index#s70|s70]], Exit → [[Screen Index#s11|s11]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s49|s49]], [[Screen Index#s52|s52]]

### s54

**Exhibitors** · ❌ TODO · Features: [[Events During]]

Leads to: Meet → [[Screen Index#s59|s59]], Vertex Labs → [[Screen Index#s55|s55]], Northwind Retail → [[Screen Index#s55|s55]], Cedar Cloud → [[Screen Index#s55|s55]], Loop Studio → [[Screen Index#s55|s55]], Alma Group → [[Screen Index#s55|s55]], Tide → [[Screen Index#s55|s55]]

Reached from: [[Screen Index#s38|s38]], [[Screen Index#s49|s49]], [[Screen Index#s53|s53]], [[Screen Index#s55|s55]], [[Screen Index#s57|s57]]

### s55

**Exhibitor** · ❌ TODO · Features: [[Events During]], [[Meetings]]

Leads to: Request a meeting → [[Screen Index#s59|s59]], Save → [[Screen Index#s54|s54]]

Reached from: [[Screen Index#s38|s38]], [[Screen Index#s54|s54]], [[Screen Index#s57|s57]], [[Screen Index#s58|s58]], [[Screen Index#s59|s59]]

### s56

**Event pass** · 🟡 Partial (needs more) · Features: [[Events During]], [[Badge & QR]]

Leads to: Show my badge → [[Screen Index#s34|s34]]

Reached from: [[Screen Index#s53|s53]]

### s57

**Floor map** · ❌ TODO · Features: [[Events During]]

Leads to: Northwind Retail → [[Screen Index#s55|s55]], Alma Group → [[Screen Index#s55|s55]], List → [[Screen Index#s54|s54]]

Reached from: [[Screen Index#s49|s49]], [[Screen Index#s53|s53]], [[Screen Index#s67|s67]]

### s58

**Catalogue** · ❌ TODO · Features: [[Events During]] · No products table

Leads to: Northwind · Shelf-edge displays → [[Screen Index#s55|s55]], Loop POS 3 → [[Screen Index#s55|s55]], Alma Fulfil → [[Screen Index#s55|s55]], Tide Checkout → [[Screen Index#s55|s55]], Northstar CRM → [[Screen Index#s55|s55]]

Reached from: [[Screen Index#s49|s49]], [[Screen Index#s53|s53]]

### s59

**Request a meeting** · ❌ TODO · Features: [[Meetings]]

Leads to: Send request · 11:20 → [[Screen Index#s61|s61]], Cancel → [[Screen Index#s55|s55]]

Reached from: [[Screen Index#s47|s47]], [[Screen Index#s54|s54]], [[Screen Index#s55|s55]], [[Screen Index#s60|s60]], [[Screen Index#s61|s61]], [[Screen Index#s64|s64]], [[Screen Index#s66|s66]], [[Screen Index#s67|s67]], [[Screen Index#s69|s69]]

### s60

**Smart Match** · ❌ TODO · Features: [[Gemma AI]]

Leads to: Request meeting → [[Screen Index#s59|s59]]

Reached from: [[Screen Index#s13|s13]], [[Screen Index#s53|s53]]

### s61

**My meetings** · ❌ TODO · Features: [[Meetings]]

Leads to: Propose a new meeting → [[Screen Index#s59|s59]], Confirm → [[Screen Index#s67|s67]], View → [[Screen Index#s67|s67]]

Reached from: [[Screen Index#s53|s53]], [[Screen Index#s59|s59]]

### s62

**Post-event summary** · 🟡 Partial (needs more) · Features: [[Post-Event]], [[Rings]], [[Connections]] · Keep / merge / expire done

Leads to: Confirm → [[Screen Index#s11|s11]], Review 4 → [[Screen Index#s46|s46]], Later → [[Screen Index#s11|s11]]

### s63

**Business account** · ❌ TODO · Features: [[Exhibitor]], [[Companies]]

Leads to: Create business Ring → [[Screen Index#s64|s64]]

Reached from: [[Screen Index#s50|s50]], [[Screen Index#s68|s68]]

### s64

**Incoming meetings** · ❌ TODO · Features: [[Meetings]], [[Exhibitor]]

Leads to: Accept — offer slots → [[Screen Index#s59|s59]], Offer slots → [[Screen Index#s59|s59]], See booth analytics → [[Screen Index#s65|s65]]

Reached from: [[Screen Index#s63|s63]]

### s65

**Booth analytics** · ❌ TODO · Features: [[Exhibitor]]

Reached from: [[Screen Index#s64|s64]]

### s66

**Meetings** · ❌ TODO · Features: [[Meetings]]

Leads to: Propose a meeting → [[Screen Index#s59|s59]], Vertex Labs → [[Screen Index#s67|s67]], Northwind Retail → [[Screen Index#s67|s67]], Rami Nasser → [[Screen Index#s67|s67]], Alma Group → [[Screen Index#s67|s67]], Cedar Cloud → [[Screen Index#s67|s67]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s12|s12]], [[Screen Index#s67|s67]]

### s67

**Meeting detail** · ❌ TODO · Features: [[Meetings]]

Leads to: Show my badge → [[Screen Index#s34|s34]], Reschedule → [[Screen Index#s59|s59]], Cancel → [[Screen Index#s66|s66]], Directions → [[Screen Index#s57|s57]]

Reached from: [[Screen Index#s13|s13]], [[Screen Index#s61|s61]], [[Screen Index#s66|s66]], [[Screen Index#s69|s69]]

### s68

**Me / Account** · 🟡 Partial (needs more) · Features: [[Account]], [[Linked Accounts (OAuth)]], [[Counts]], [[Subscription (Free vs Pro)]]

Leads to: Upgrade → [[Screen Index#s70|s70]], Photo library → [[Screen Index#s30|s30]], Interests → [[Screen Index#s71|s71]], My companies → [[Screen Index#s72|s72]], My devices → [[Screen Index#s75|s75]], Business account → [[Screen Index#s63|s63]], Notifications → [[Screen Index#s69|s69]], Home → [[Screen Index#s11|s11]], Events → [[Screen Index#s48|s48]], Me → [[Screen Index#s68|s68]], Badge → [[Screen Index#s34|s34]], Discover → [[Screen Index#s38|s38]]

Reached from: [[Screen Index#s11|s11]], [[Screen Index#s12|s12]], [[Screen Index#s16|s16]], [[Screen Index#s17|s17]], [[Screen Index#s38|s38]], [[Screen Index#s39|s39]], [[Screen Index#s40|s40]], [[Screen Index#s48|s48]], [[Screen Index#s68|s68]], [[Screen Index#s70|s70]], [[Screen Index#s71|s71]], [[Screen Index#s75|s75]]

### s69

**Notifications** · ❌ TODO · Features: [[Notifications]]

Leads to: See results → [[Screen Index#s42|s42]], Scan now → [[Screen Index#s35|s35]], Choose a Ring → [[Screen Index#s46|s46]], Temporary Ring created → [[Screen Index#s67|s67]], Suggest another day → [[Screen Index#s59|s59]]

Reached from: [[Screen Index#s68|s68]]

### s70

**Subscription** · ❌ TODO · Features: [[Subscription (Free vs Pro)]]

Leads to: Go Pro — $9 / month → [[Screen Index#s68|s68]]

Reached from: [[Screen Index#s34|s34]], [[Screen Index#s53|s53]], [[Screen Index#s68|s68]]

### s71

**Interests** · 🟡 Partial (needs more) · Features: [[Interests]]

Leads to: Save · 3 picked → [[Screen Index#s68|s68]], Cancel → [[Screen Index#s68|s68]]

Reached from: [[Screen Index#s68|s68]]

### s72

**My companies** · ❌ TODO · Features: [[Companies]]

Leads to: Acme Studio → [[Screen Index#s73|s73]], Northstar → [[Screen Index#s73|s73]], Review → [[Screen Index#s74|s74]], Join a company Ring → [[Screen Index#s74|s74]]

Reached from: [[Screen Index#s38|s38]], [[Screen Index#s68|s68]], [[Screen Index#s73|s73]], [[Screen Index#s74|s74]]

### s73

**Company detail** · ❌ TODO · Features: [[Companies]]

Leads to: Acme Team → [[Screen Index#s14|s14]], Company → [[Screen Index#s14|s14]], 22 colleagues → [[Screen Index#s15|s15]], Leave company → [[Screen Index#s72|s72]]

Reached from: [[Screen Index#s72|s72]]

### s74

**Join a company Ring** · ❌ TODO · Features: [[Ring Invitations & Join]], [[Companies]]

Leads to: Join Ring → [[Screen Index#s16|s16]], Decline → [[Screen Index#s72|s72]]

Reached from: [[Screen Index#s16|s16]], [[Screen Index#s17|s17]], [[Screen Index#s72|s72]]

### s75

**My devices** · 🟡 Partial (needs more) · Features: [[Devices & NFC]]

Leads to: Sign out all other devices → [[Screen Index#s68|s68]]

Reached from: [[Screen Index#s68|s68]]
