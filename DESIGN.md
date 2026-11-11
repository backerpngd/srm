# Self Regulation Mastery — Design Blueprint (v3)

Colours and fonts come **only** from COLOR.html (Cognitive Blue). The single
addition is **Amiri** for the Quranic Arabic. Layout, components and motion use
modern mobile patterns.

## 1. Colour roles (60‑30‑10)
| Role | Light | Dark (COLOR.html Phase 07) |
|---|---|---|
| 60 · Canvas | Ice Blue `#eff6ff` | Very Dark `#0f172a` |
| 30 · Surface (cards) | Pure White `#ffffff` | Dark Slate `#1e293b` (Elev 1) |
| 30 · Fill (tracks, insets) | Ice Blue `#eff6ff` | Very Dark `#0f172a` |
| Raised (sheet, thumb) | Pure White | Slate Dark `#334155` (Elev 2) |
| Line | Pale Blue `#dbeafe` | `#334155` |
| Line strong | Light Blue `#93c5fd` | `#475569` |
| Heading | Deep Navy `#1e3a8a` | White |
| Body | Very Dark `#0f172a` | Ice Blue `#eff6ff` |
| Muted | Slate Muted `#64748b` | Light Blue `#93c5fd` |
| **10 · Accent** | Electric Blue `#3b82f6` (hover `#2563eb`, active `#1d4ed8`) | same; text accents Sky `#60a5fa` |
| Gradient | `--grad-primary`, used once per screen: splash, primary CTA, summary card | same |
| Semantic | Success `#10b981`, Warning `#f59e0b`, Error `#ef4444`, shown as 12 % tints with ink text | same |

Accent rule: Electric Blue only marks **the** primary action, the active tab,
the current selection indicator and focus. Everything else is navy / slate.

## 2. Typography
| Token | Font | Size / line | Use |
|---|---|---|---|
| display | Space Grotesk · Anek Malayalam 700 | 28/1.15 | Screen title |
| title | Space Grotesk · Anek 600 | 20/1.3 | Sheet title, profile name |
| headline | Space Grotesk · Anek 600 | 17/1.35 | Card titles, prayer names |
| body | Inter · Noto Sans Malayalam 400 | 15/1.5 | Text |
| label | Inter · Noto 600 | 13/1.35 | Buttons, chips, list labels |
| caption | Inter · Noto 500 | 12/1.35 | Meta, axis |
| data | JetBrains Mono 600 | — | Counters, ref, numbers |
| arabic | Amiri 400 | 26/2 | Quran verse |
| ml‑verse | Manjari | 15/1.7 | Malayalam translation |
Malayalam: +0.1 line‑height, no letter‑spacing / uppercase.

## 3. Space, shape, depth
4/8 grid. Screen gutter 16 · card padding 16 · gap between cards 12 · between sections 24.
Radii: control 12 · card/tile 16 · sheet 28 · pill 9999.
Cards and tiles are flat (1 px line, no shadow). Shadows only on things that float: the bottom nav and the sheets (soft upward shadow).
Glass (blur 20 px) only on the bottom nav.

## 4. Components
- **App bar**: on the blue band — white-glass icon tile + white title + subtitle; the content sheet rises over it.
- **Bottom nav**: floating glass pill; active tab = pale indicator behind icon, accent icon + label.
- **Card / tile**: surface colour, 1 px line, radius 16, no shadow.
- **Segmented control** (Yes/No, Motive, chart ranges): fill track with a 1 px line; the chosen option tinted inside it, no shadow — Yes/others accent-soft + accent ✓, No warn-tint + amber ✕. On the blue band (language, theme) the chosen option is white.
- **Choice card** (Life Impact): neutral outline → selected gets semantic border, 12 % tint, filled glyph.
- **Happiness** (Track): same build as Life Impact. "When you think about today, how happy do you feel?" → Well ✓ / Moderate – / Not at all ✕ (green / amber / red), one choice, needed to save.
- **Primary button**: gradient, 52 px; disabled = fill + muted text (no ghost gradient).
- **Action tiles**: each action its own tile (60 px, icon tile 36, chevron), 8 px apart; danger tiles in Error.
- **Sheet**: canvas colour, 28 px top corners, thin edge, handle, centred title, body, stacked actions; danger variant uses Error tint.
- **Status**: badge circle (number → ✓ / ✕) + one status line (warning / success / muted).

## 5. Motion
State changes 200 ms ease‑out; selection 300 ms spring; one entrance stagger per screen;
charts grow once. `prefers-reduced-motion` disables all of it.

## 6. Screen layouts
- **Welcome**: blue brand band (language English | മലയാളം top-left, theme ☀ | ☾ top-right; logo → title → kicker pill → tagline, centred) and a sheet with rounded top corners running to the bottom (a faint layer peeks above it): centred "Log in" + subtitle (no profile yet: "Welcome" / "Create your profile to start."), the profile list (name only; each profile its own rounded tile, 8px apart), dashed "+ Create profile" (main gradient button when there is no profile; its form has Create on top and Cancel below), and at the bottom the web address "srmastery.com" with a small globe (plain text, not a link).
- **App tabs (Track, Progress, Insights, Profile)** use the login language: the title sits on the blue band (white title, white 85% subtitle, white-glass icon tile, the same decorative circle); the content is a sheet with 28px top corners, a thin edge and a soft shadow that rises 28px over the band and scrolls inside.
- **One surface rule everywhere**: containers (login sheet, tab sheet, bottom sheets) = canvas colour; tiles and cards on them = surface colour + 1px line, no shadow. A ghost button placed straight on a container gets the surface colour.
- **PDF summary**: profile + quick 7 / 30 / All + From / To dates (never after today; until today is saved the period ends yesterday, like Insights). The browser prints an A4 report ("Save as PDF") so Malayalam stays perfect offline: header, the five areas with the same counts and sentences as the Insights cards, then one row per day.
- **Track**: Motive asks "Why did you pray?" with three options Out of habit / Pressure from others / Purpose of life (കേവല ശീലം / മറ്റുള്ളവരുടെ സമ്മർദ്ദം / ജീവിതലക്ഷ്യം; Purpose in accent; no meaning line under them); Manner "On time and in the right way" stays Yes/No (Malayalam അതെ / അല്ല, while "Did you pray?" keeps അതെ / ഇല്ല).
- **Track layout**: day card → rest row (female) → honesty reminder (17:14) → 5 prayer cards / rest card → Life Impact → Happiness → Save + hint. Saved: done banner on top, everything read‑only.
- **Progress**: Today (rings; Life impact and Happiness rows under a thin line — no inner box, two-line labels: top word 600 + bottom word 400 — Prayer/Performed · Motive/Purpose of life · Manner/Right way (the Daily prayers legend uses the same words) + Life Impact / Happiness badges + stats) → Daily prayers → Life Impact → Happiness, each chart with its 7-day control at the bottom ("Last 7 days"; same window rule as Insights, ‹ › step 7 days). Life Impact and Happiness: one label column width for both (days line up), ✓ – ✕ dot per answered day, solid line between next-day answers, faint dashed line across a day without an answer; that day shows the Daily prayers marks: "Rest" pill on a rest day, small grey dot on any other day.
- **Insights**: the last 7 days (ends yesterday until today is saved), from the first saved day growing to 7. Hero (hidden until the first save): bold "Based on N days" (1–7), then "r days recorded · x rest · y not recorded" (only the parts there are), + a warn line when no prayer was performed. Rest days and rest prayers are left out; a day marked "not prayed" and a day not recorded both count as its due prayers missed. Prayer: Consistency ("8 of 35 prayers were missed (Fajr 3, Isha 2 …)", most first) · Motive · Manner (performed prayers: all ✓ / "w of p were not …"). Prayer in life: Life Impact (all strong ✓ / "Of 7 days: moderate x, weak y, could not be assessed on z days") · Happiness (each day's feeling set against whether the day earned it — every due prayer performed with purpose, on time and in the right way, and a strong Life Impact: earned·well ✓, earned·low, not earned·well, not earned·low; only groups with days). If no prayer was performed, Motive, Manner and Life Impact are not shown. One line per card (Happiness up to four). Footer: "This is only a reflection of your own entries." 
- **Insights verses**: each card ends with its verse in the Track verse box (Arabic in Amiri, meaning, "Quran x:y"): Consistency 4:103 · Motive 98:5 (to "establish prayer…") · Manner 23:1–2 · Life Impact 29:45 (same text as the Track card, which keeps it) · Happiness 13:28. Malayalam meanings supplied by the owner.
- **Language / theme switches** (on the band): small segmented controls, 36px to the eye with a 48px touch strip, the chosen option white inside the track; first run = English + Dark.
- **Profile tab**: a centred card (avatar, name; under a thin line two columns: "Joined" with the day-month-year date and "Streak" in days), then every action as its own tile — Account (Switch profile, Edit name) · Data management (Export, Import, Delete — Malayalam titles drop the repeated "ഡാറ്റ"; Delete in red) · Delete profile alone at the end (no "Danger zone" label). Export = this profile only, file `srm-<name>-<date>.json`; Import = into the open profile only (an older all-profiles file → same id or same name+gender is taken, otherwise the user chooses whose days; day in both → newer save wins; rest periods only into a female profile; nothing deleted); Delete = red confirm, this profile's days only.
- **Track honesty reminder**: under the day header and before the prayers (only while the day can still be answered; hidden once saved and on a full rest day): "Answer every question honestly, keeping the final reckoning in mind. At that reckoning, each person will be told:" / "ഓരോ ഉത്തരവും പരലോക വിചാരണ മനസ്സിൽ കണ്ട് സത്യസന്ധമായി രേഖപ്പെടുത്തുക. അവിടെ ഓരോരുത്തരോടും പറയപ്പെടും:" followed by Quran 17:14 (`HV`).
- **Track day card** (`.hero2`): a flat tile like every other card (no gradient). Date small, count big in blue; avatar = blue circle; five steps: prayed blue, not prayed amber (`--cb-warn`), not answered light, rest outline. Saved with every due prayer done → count and steps turn green (`.ok`). Before saving the count = answered prayers; after saving = prayed prayers.
- **Prayer card**: ✓ / ✕ in the circle are CSS masks placed absolutely (exact centre); "No" circle amber. Open card: questions sit in the card under a thin line (no inner box); small label amber while open, blue once answered. **All choice controls** (`.seg`, `.yn`): flat track with a 1px line; chosen option tinted inside (accent-soft / accent-ink; "No" = warn-tint / warn-txt), no shadow.
- **PDF**: "PDF summary" at the bottom of Insights → sheet with a two-way choice: **Last 31 days** (default; ends on the last tracked day, starts no earlier than the first) shown as one range card, or **Choose dates** (From / To, within the tracked days, at most 31 days). One A4 page (browser print → "Save as PDF"), the Insights analysis for exactly those dates, same engine and sentences, no verses, current profile.
  - Order: title; name · period · made (one line); "Based on N days" + recorded / rest / not recorded; **Day by day** map (5 prayers × up to 31 day cells, month + day labels, per-prayer Consistency / Motive / Manner counts on the right, legend with counts); Prayer (Consistency, Motive, Manner) and Prayer in life (Life Impact, Happiness), each card with a thin bar beside its title and the ✓ / ! sentences below; footer note.
  - No card legend: the numbers in each sentence are chips in the colour of their bar segment (missed red; not with purpose / not on time & right way / moderate amber; weak red; not assessed grey; Happiness marks + numbers in their segment colours). Motive bar = purpose vs not. The engine marks these numbers only while building the PDF (`NC`); Insights text is unchanged.
  - Page: `@page{margin:0}` (no browser header/footer); white space is padding on #print (15 / 14 / 14 mm). Always one page: before printing, the report is measured at A4 width; if taller than 297 mm it is zoomed to fit (width kept at A4).
  - Graph colours = COLOR.html diverging scale: green `--cb-ok` good / complete, amber `--cb-warn` shortfall (habit, not on time & right way, moderate), red `--cb-err` missed / pressure / weak, red outline = not recorded, grey hatch = rest / not assessed; happiness also uses `--cb-ok-pale` and `--cb-warn-pale`. Bars sit on `--cb-blue-ice`. Every graph number uses the same counting as the sentence beside it.
  - Print is always light (`color-scheme:light` in `@media print`) so a dark theme never paints the page margins.
- **Rest period** (female profiles, Track): slim row "Rest period · Rest started" → sheet "Rest from which prayer today?" (5 prayers). During rest Track shows only the rest card ("Day N · since d", "Has your rest ended?" within 7 days, "Is your rest still continuing?" + Continuing after 7) and nothing to record; days fill in as rest by themselves (auto entries) even when the app is not opened. "Ended" → "Prayers again from which prayer today?"; prayers before it are rest that day. Start and end days are part days: rest prayers show a "Rest" chip, counts use the due prayers only (e.g. 0 / 4). Undo on the start day and on the end day before saving. Progress: Rest pill in all three charts, rest message only in Today. Periods travel in export/import (same start day = same period; an ended copy wins).
- **Wording (v5.0.4, reviewed tab by tab with the owner)**: Malayalam first, English second, one word per idea everywhere.
  - Cancel = **വേണ്ട** (not റദ്ദാക്കുക). Locked = ലോക്ക്. Consistency = സ്ഥിരത; Streak = തുടർച്ച; "Days recorded" (not "Total days").
  - Women's rest = ഒഴിവ് in Malayalam and **Exempt / exemption** in English (Exempt period, Exempt day, exempt prayers, Exemption started / ended).
  - Happiness answers: നല്ല സന്തോഷം / കുറച്ച് സന്തോഷം / സന്തോഷമില്ല · Very happy / Somewhat happy / Not happy (chart axis short: നല്ലത് / കുറച്ച് / ഇല്ല · Very / Somewhat / Not). Unanswered impact = "Not assessed" (never "No impact").
  - Praise lines start "അഭിനന്ദനങ്ങൾ!"; Malayalam result sentences end in a verb (…ആയിരുന്നു / ആയിരുന്നില്ല). Manner messages speak of time and the right way (as the question does), not "attention".
  - One save hint: "Answer every question to save." Save sheet: "Save today?" / "Once saved, it is locked and cannot be changed." Done card: "Today is done" / "See you tomorrow."
  - Delete sheets name the scope ("all saved days of this profile", "this profile and all its data") and end "This cannot be undone." (no "Warning:" prefix; the sheet is already red).
  - PDF map legend: Performed, no shortfall / Performed, with shortfall / Missed / Not recorded / Exempt (കുറവില്ലാതെ / കുറവോടെ നിർവഹിച്ചു …), so "complete" is kept for the Happiness meaning only. PDF header: "Self Regulation Mastery" on top (13pt, navy), the report name below (Prayer summary / നമസ്കാര സംഗ്രഹം, 12.5pt, electric blue); sections 11.5pt, cards 10.5pt.
- **How to use (ഉപയോഗക്രമം)**: an outline button (1.5px accent-ink border, 48px) on the login sheet right under Create profile and its form; opens only when tapped. A bottom sheet with 7 short steps (Profile, Time, Answers, Impact & happiness, Save, Exemption, Results & backup): title + "n / 7", one card (icon, heading, 1–2 sentences), dots, Back / Next, "Got it" on the last step; swipe works too. All cards share one grid cell, so the card height stays fixed and the buttons never jump.
- Wide screens: phone column (max 480 px) centred on Pale Blue / Midnight.
