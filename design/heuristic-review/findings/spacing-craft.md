# spacing-craft: pixel-craft / design-systems audit

Length note: this runs past the ~1,600-word guideline because the lens asks for per-selector, implementation-ready values. Tables are terse on purpose.

**Method.** The supplied shots for `payments`, `calendar` and all five `project-*` were captured mid-fade (opacity under 0.15, milestone rows missing), so I re-rendered every scenario with animations off (`scratchpad/spacing-craft/shots/`, plus 14 extra states: Files/Activity tabs, edit-client, empty Clients, plan errors, six more phone screens). I also measured the live DOM with headless Chrome (`probe.py`: bounding boxes and computed styles at 1360 and 390). All px below are measured, not eyeballed. Inferences from code are marked (code).

## 1. Verdict
Desktop Today, Clients and the client review screen are clean at a glance; the damage is in the seams. There is no spacing system: 22 distinct paddings, 12 gaps, 11 radii and 14 font sizes are rendered, and sibling cards disagree by 4px on content edges. Real defects: a phone Plan form that overflows sideways, a missing doctype (quirks mode), ragged money columns, a calendar that jitters, clipped tables on phones.
Scores (spacing lens): spacing-system consistency 4/10 | alignment precision 5 | vertical rhythm 6 | truncation/wrapping 5 | component sizing 5 | mobile layout 4 | desktop first-glance polish 7.

## 2. Proposed system (snap CSS to this)
**Spacing scale (4-pt): 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64.** 20 stays because it is already the dominant card inset (322 computed 20px sides across the screens). Banned: 1,2,3,5,6,10,14,26,28,40,56,72,120 (except 1px hairlines).
- Card inset `--card-pad:20px`; at max-width 640 it is 16. Every card-chrome rule reads it (card-h/b, rows, att, ag, easy, waitb, clear, hero, drop, files, note, pay form). One inset per column, no exceptions. Dialog 24 (isolated). Compact tile 16 (kpi, fee box, alert, table cells).
- Row padding: 12 vertical (1-2 line rows), 16 (3-line Today rows). Field label to input 8; field to field 16; tile-grid gap 16; card stack gap 24; section gap 64; icon to text 8.
**Radius: 4 (micro chips) / 8 (controls, nested boxes, tab track) / 12 (cards, kpi, stage, toast) / 16 (dialog) / pill / 50%.** Tab trigger = 4.
**Type: 12/16 caption, 14/20 body, 18/24 card title, 24/32 title, 28/32 page h1 + kpi, 32/40 landing h2, 40/44 display, 56/60 hero.** Explicit px line-heights replace the global 1.5 (which makes 19.5, 27, 32.2, 58.24).
**Heights: btn 32 / 36 / 44; input 36; nav item 32; chip and tab trigger 28 (tab track 36); badge 24; icon button 32x32; leading row icon 32.**

```css
:root{--s1:4px;--s2:8px;--s3:12px;--s4:16px;--s5:20px;--s6:24px;--s7:32px;--s8:48px;--s9:64px;
--r1:4px;--r2:8px;--r3:12px;--r4:16px;--card-pad:20px;--row-y:12px}
@media(max-width:640px){:root{--card-pad:16px}}
```
**Snap map (now to proposed):** gap 2/3/5/6/10/14 to 4 or 8 (6 and 10 to 8; 14 to 16). padding 14 to 16 (att) / 12; 10 to 12 (file, textarea, fbar, fchip); 28 to 32 (.main top, lp-head mb, lp-final); 40 to 48; 56 to 64 (lp-sec); 72 to 64 (lp-hero); 120 to 128. radius 3/6/7/9/10/14 to 4/8/8/8/8/12. font 10.5/11/12.5 to 12; 13 to 14; 22 to 24; 26 to 28; 34 to 32. Heights 26/29/30/33 to 28/28/32/32.
**Dead CSS (zero markup uses), delete:** `.landing` `.chain` `.pcard` `.grphead` `.sampleb` `.rules` `.docs2` `.legend` `.clickrow` `.glbl`. They carry 48px type, 10px 14px padding and other off-scale values.

## 3. What is working: keep it
- Page chrome is consistent: `.ph` to first block is exactly 24 on Today, Clients, Payments, Calendar; `.cols` and `.stack` gutters are 24 everywhere.
- Table and list row pitch is already 64 (`.fr`, `.rows li`), good rhythm. Sidebar to main 232/32 and the 330 rail are stable.
- Bottom-bar clearance is correct: `.main` 120, `.centerpage` 64, `.lp-foot` 64 all clear the ~50px bar; nothing is permanently hidden behind it.
- Today's dot, avatar and title columns share one x (285/307/351); card-h 20 matches row 20 on desktop.
- Tabular mono numerals in lists, dialog rhythm (24 pad, 16 gap, 8 footer gap), badge text-height 24 all consistent.

## 4. Findings (grouped by severity; screen index in section 6)

### S1
**F1. Plan form overflows on phone.** Screen: Plan at 390 (x-m-plan; the brief's set has no phone Plan shot). Evidence: `documentElement.scrollWidth` 448 vs 390; cards 432 wide inside a 358 column; fields and the "Three stages" chip are cut off. Cause: `.stack{display:grid}` (head L117) has no template, so its auto track grows to the min-content of `.swatches` (flex, no wrap, 10 x 24 + gaps, L352/L284, app L515). Why: this is the first-run activation path. Fix: `.stack{grid-template-columns:minmax(0,1fr)}`; `.swatches{flex-wrap:wrap}`. Effort S.

### S2
**F2. No `<!doctype html>`: page is in quirks mode.** Screen: Files tab (x-files); `compatMode` is `BackCompat`. Evidence: `<table>` text is 16px / normal line-height instead of 14px (td 16, th 12, rows 49px). Quirks also changes inline line-box heights app-wide (code). Fix: first line of head.html `<!doctype html>`. I tested it (pixel-diffed 5 screens): Files becomes 14px; Today, Payments, Project, Review change only by a 1-2px shift of the agenda date numerals and the sidebar user block. Effort S.

**F3. Amount column is ragged in every milestone list.** Screens: project-* (Milestones), client-invite, client-review, m-project. `.rows li` (L145) is a per-row grid `28px 1fr auto auto`, so badge width decides the amount's x. Measured right edges 890.4 / 814.9 / 851.5 / 851.5 (project-awaiting-approval); 772.8 / 724.9 / 761.5 (client-review). Fix: `grid-template-columns:32px minmax(0,1fr) 88px 132px; .rows .mono{text-align:right} .rows .badge{justify-self:end}`. Bonus defect: at max-width 900, `.rows li .mono{display:none}` (L422) removes the amount from every phone milestone list (m-project, m-client-review, client invite); show it in the sub-line instead ("Due Tue, 13 Oct · ₹60,000"). Effort S.

**F4. Today action column breaks amount alignment.** Screen: today-waiting-open. `.att .act .btn{min-width:108}` (L253) but "Resend to Karan" is 118.3 wide, so that row's amount ends at 818.7 vs 829 (10.3px). Fix: `.att .act{display:grid;grid-template-columns:80px 120px;gap:16px}`, `.att .act .btn{width:120px;padding:0 8px}`; or label it "Resend". Effort S.

**F5. Phone tables hide columns with no affordance.** Screens: m-clients (grid min 480 in 356 box: Status column entirely invisible), m-payments (min 680: "You receive", Status and Documents invisible; client names truncated to 86px, "Northwind …"). `.ftable{scrollbar-width:none}` (L161), `fTable min` (app L468/L501). Fix at max-width 640: stack each `.fr` into a 2-line card (client + status badge; milestone + amount); fallback: edge fade mask and `--min:560`. Effort M.

**F6. Phone nav pills are 434px in 390.** Screens: all `m-*` freelancer. `.mnav` (L216): "Payments" clipped by 28px, no fade, reads as a bug. Fix: hide `.ico` in `.mnav button` at max-width 480 (saves 88px, fits 346), or `flex:1 1 auto;justify-content:center` and `mask-image` fade. Effort S.

**F7. Stacked cards disagree on the content edge (24 vs 20), plus three table insets.** Screens: project-* (hero vs Milestones: badge/title x=289 vs "Milestones" x=285), m-project (41 vs 37), client-review/invite, plan. `.hero{padding:24px}` (L121), `.drop{margin:0 24px 24px}` (L125), `.files{padding:0 24px 20px}` (L132), `.note`, `.submitbar` (L140-141), pay form `padding:24px` (app L596) vs `.card-h/.card-b/.rows` 20. Tables: `.fc/.fhead` 16, plain `th/td` 20 (L151), rows 20. Fix: `--card-pad` token (section 2): hero 24 to 20, drop/note/submitbar margins 24 to 20, files 0 20 20, pay form 24 to 20; plain `th,td` 20 to 16 (filter-table cells stay 16 as compact tile). Effort M.

**F8. Phone rows 16 vs card header 20.** Screen: m-today. `@media(max-width:900px){.att-list li,.att{padding:14px 16px}}` (L272) vs `.card-h` 20: dot x=33 vs "Needs you today" x=37; badge right 353 vs button right 357. Fix: both read `--card-pad` (16 at 640). Effort S.

**F9. Mini-calendar numbers jump.** Screens: today-*, all rails, client calendars, plan. `.d` is flex-column (L285): cells with `.dots` (5px + 1px gap) lift the number to y=270.9 vs 273.9 in cells without, 3px of jitter along every row; cell width is a fractional 39.4. Fix: always emit `<span class="dots"></span>` (app L281, empty slot height 5) or `.dots{position:absolute;bottom:5px}`; today ring 1.5 to 2px. Effort S.

**F10. Agenda text touches the tint edge.** Screens: every calendar rail (today, project, client, plan). `.ag li{padding:8px 0}` (L210) then `padding-left:12px` (L291) gives computed `8px 0 8px 12px`; "in 2 days" right edge 1307 = tint right edge 1307. Fix `.ag li{padding:8px 12px}`. Effort S.

**F11. Filter bar is detached from its table.** Screens: clients, payments, m-clients, m-payments. `.fbar{margin-bottom:12px}` (L154) stacked on grid gap 24 = 36px (clients 197 to 233; payments 321 to 357) vs 24 from the block above, so chips group with the wrong thing. Same 36 under the payments table before the footnote. Fix `.fbar{margin-bottom:-8px}` (16 total) and footnote inline `margin-top:-8px` (app L502). Phone is the same 36-37px. Effort S.

**F12. Calendar client chips wrap and orphan.** Screens: calendar, x-m-calendar. 9 chips need 1055px, row has 1022: "Studio Nine" sits alone on row 2; on phone the legend is 6 rows (~170px) before the calendar; at the target 15 clients it is 3 rows on desktop. `calLegend` (app L289, inline `padding:16px 20px 0`), `.cl` padding 3px 12px (26 high). Fix: one nowrap row, `overflow-x:auto` + edge fade; `.cl` height 28, padding 0 10. Effort M.

**F13. Big-calendar event chips truncate and are uneven.** Screens: calendar, x-m-calendar. 7-9 of 14 chips ellipsize at 130px ("Greenleaf Foods: Str…"); `.chip.rv` has a 1px dashed border so it is 22.5px vs 20.5 for the rest (rows stop being even). Phone: chips shrink to 6px pastel dots, almost invisible. `.bigcal .chip` 11px/2px 6px (L225, L292-293, bigCalInner app L298). Fix: label = milestone name only (colour already encodes client; org in `title`), or 2-line clamp with cell min-height 112; every chip `border:1px solid transparent; font:12px/16px`; phone dots 8px solid `--c`. Effort M.

**F14. Phone file rows truncate the filename.** Screen: m-project. Name box is 63px ("Moodbo…", "Referen…", "Notes.d…") because "Protected preview ready" claims 159px; `.file` grid `36px 1fr auto` (L133), `fileRows` (app L528). Fix at 640: hide the text (keep the check + sr-only), or stack status under the name. Effort S.

**F15. Segmented tabs stretch.** Screens: documents-modal (track 770, tabs fill 463), client-review (track 752, fill 347), m-documents (third tab "PayGuard service fee" clipped). `.tabs{display:inline-flex}` (L90) becomes a stretched grid item inside `.dialog`/`.stack`. Fix `.tabs{justify-self:start}`; on phone make it a 3-col grid or shorten labels. Effort S.

**F16. Selected row bleeds past rounded corners; "Not funded" badge disappears.** Screens: project-complete (last-row grey square corners over the 14px radius), project-*, client-invite. `.rows li.sel/:hover` fills a square, `.card` has no overflow clip. Also `.badge.draft` bg (muted) equals `.rows li.sel` bg (muted): row 1 "Not funded" is plain text vs a pill in row 2 (client-invite measured both rgb(244,244,245)). Fix `.card:has(.rows){overflow:hidden}`; `.badge.draft{background:color-mix(in srgb,var(--muted-fg) 14%,transparent)}`. Effort S.

**F17. Widows and mid-date truncation.** Screens: m-today ("…1 day past the reply / date"), m-payments subtitle ("…not funded to / paid."), client-review + m-client-review ("Take a look when / you can." / "can."), landing why-card 1 ("coming up." alone), m-landing final h2 ("Start with your first / client."), Today desktop `.ctx` cut mid-date ("reply was due Tue, 13 O…", "…split it into two screen…"; the cut point shifts with webfont load). Fix: global `p,.what,.ctx,.muted{text-wrap:pretty}`, `h1,h2,h3{text-wrap:balance}` (`.lp-final h2` lacks it); `.att .ctx{white-space:normal;display:-webkit-box;-webkit-line-clamp:2}` and put the date first in the string. Effort S.

**F18. Landing why-cards do not align.** Screen: landing-full. Card h3 is 22/18/18px and wraps 1/2/1 lines, so bodies start at y=1275.9 / 1294 / 1270.7 (23px spread). `.lp-card.lead h3{22px}` (L323), `text-wrap:balance` wraps "Less admin, fewer follow-ups". Fix all h3 18px/24px and `min-height:48px`, or shorten to one line ("Fewer follow-ups"). Effort S.

### S3
**F19. Topbar gutter is 12px off the content gutter; landing nav links off-centre.** Screens: every app screen (crumb x=252, button right 1340 vs content 264 / 1328). `.topbar{padding:0 20px}` (L104) vs `.main{padding:28px 32px}` (L113). Fix `.topbar{padding:0 32px}` (or inner wrapper `max-width:1180`). Landing: `.lp-nav` links centre at 630 vs page centre 680; `.lp-nav{display:grid;grid-template-columns:1fr auto 1fr}`. Effort S.

**F20. Card headings: three styles and 3.5px baseline split.** Screens: today-*, plan, client-invite. `.card-h h3` 14/600, `.card.focus h3` 18/600 (L255, padding-top 20), and `.lbl` 12/500 muted used as a card title ("How you get paid", "Your usual terms", "How it works for you", app L516-517/587). Side by side, "Needs you today" centre y=220.7 vs "October 2026" 217.2. Fix: one title style (14/20 600; 18/24 only inside the hero), label style stays for fields; give `.cal-head` the same 20 top inset and a 28px row. Effort S.

**F21. Control sizes are not on a scale; the same CTA appears at 30 / 33 / 36 / 44.** "Plan a project": topbar `.btn.sm` 30, sidebar nav item 33 (6+21+6), Clients page header 36, plan footer lg 44. Pills: badge 24, chipb 26, `.cl` 26, fchip 28, tab trigger 29 (odd), mnav 28. Icon buttons 28, 24, 42x30. Fix per section 2 (btn 32/36/44; nav 32 via 20px line-height; chips and triggers 28; tab padding 4 so track = 36 = input; icon buttons 32x32). Hide topbar "Plan a project" on pages that already have one (Clients). Effort M.

**F22. Checkout: layout jump and dead space.** Screens: client-checkout, m-checkout. `.pay2{width:min(900px)}` (L373) puts the left edge at x=230 vs 122 on invite/review (108px shift between consecutive steps). `#payform` stretches to 425px; content ends y=429, card ends y=513 (60px empty below the disclaimer). Fix: same `.main` width, `.pay2{align-items:start}`. Form gap 14 to 16, fee box 16 vs form 24 to 20. Effort S.

**F23. Ghost "Back" text is inset 12px.** Screens: client-checkout (text x=243 vs heading 230), m-checkout (29 vs 16). `.btn.ghost.sm` padding 12 (app L593). Fix `margin-left:-12px` on back/ghost-leading buttons. Effort S.

**F24. client-review grid columns disagree.** Screen: client-review. Inline `grid-template-columns:minmax(0,1fr) 340px` (app L611) vs `330px` (L624) vs `.cols` 330: preview right edge 874 vs milestones 884; aside left 898 vs calendar 908. Fix: delete both inline overrides (one rail width). Effort S.

**F25. Project header and client-review heading rhythm.** Screens: project-*, client-review. Project h1 is 24px inline (app L573) vs 28 on all other pages; the "Edit" ghost button sits inside the h1 (`vertical-align:middle`) and inflates its line box to 30.6 vs 27.6; the "·" sits 4px from the status badge and dangles at line end on phone ("Priya Nair ·" / badge below). Client-review stacks h1 28 "Website redesign" and h2 24 "Homepage design" 58px apart. Fix: header = flex row with gap 8; Edit outside h1; separators via gap, not "·" characters; client h2 to 18/24 card-title style. Effort S.

**F26. Title to subtitle gap.** Screens: today (4px, app L422 `margin-top:4px`) vs clients/payments/calendar/plan (0). Fix `.ph p{margin-top:4px}` and drop the inline. Effort S.

**F27. Plan form details.** Screen: plan. First `.mrow` shows a rule only 4px under the chips row (`.mrow:first-of-type` fails because the header is also a div; chips bottom 634.2, rule 638.2). Remove "x" is 3px low (30px sm button bottom-aligned to a 36 input: centre 696 vs 693). Setup: checkbox x=425 vs card text edge 421; its label x=454 vs bullet text 437. Fix: `.mrow + .mrow{border-top}` and drop `:first-of-type`; `.mrow .btn{width:36px;height:36px}`; `.check input{margin:2px 0 0}`. Effort S.

**F28. Phone chrome.** Screens: m-project (crumbs truncated to "Bloom …" / "Website r…" while the title repeats in the h1, Client link button 107px), m-clients (search `flex:0 1 260px` ends x=276 vs table edge 374; chip rows clip with no fade), m-approve (76px mascot squeezes text to 5 lines; "Describe edits" cut to "Describe"). Fix: hide crumbs at 640 (back chevron only); `.fbar .input{flex:1 1 100%}`; hide mascot in approve dialog at 480. Effort S.

**F29. Mono commas at display size.** Screens: payments KPIs, Today expected, checkout (₹3,86,000 renders "₹3 , 86 , 000"). Geist Mono comma takes a full cell; `.kv2` 28, `.exp-t` 26, checkout 40. Fix: sizes 18+ use `var(--font)` with `font-variant-numeric:tabular-nums` (check Geist has `tnum`); mono only at 14 or below. Effort S.

**F30. Landing mock ellipsizes.** Screens: landing-top, m-landing. "…you submitted 4 days ago · reply w…", "Acme Logistics · Delive…" appear in the hero screenshot (`shotHTML` reuses `attRow`/`calendar`, `.ctx`/`.ag` nowrap). Fix: `.shot .ctx,.shot .ag div{white-space:normal}` or shorter seed strings. Effort S.

### S4
**F31. Landing rhythm.** hero label to h1 to sub = 20, cta +4; shot to "Why" 80 (24 + 56); cards to "How" 64; steps to final 64; final to footer 48; `.lp-head` mb 28; nav 61 vs app topbar 56; phone gutters 16 (nav, hero) vs 24 (rest). Fix `.lp-sec{padding:64px 24px 0}`, `.lp-shotwrap{padding:8px 24px 0}`, `.lp-head{margin-bottom:32px}`, `.lp-foot{padding:48px 24px 64px}`, nav `height:56`, one phone gutter 20. Effort S.

**F32. Mascot art sits ~30px inside its box.** setup (art x=430 vs card edge 400), client-invite (155 vs 122), review reassure (935 vs 919), landing final. Fix: trim viewBox or `margin-left:-24px` on hero `.bd` (check each pose). Effort S.

**F33. Sidebar.** Item 33px; `.side{gap:20}` to 24; `.grp gap:2` to 4; `.who{margin:0 -4px}` rule runs x=8-224 vs nav items 12-219: set margin 0. Effort S.

**F34. Dialog close button.** documents-modal: ghost sm is 42x30, icon inset 13px from the content edge (1052 vs 1065) and 30px tall hit area. Fix 32x32 icon button, `margin:-6px -6px 0 0`. Effort S.

**F35. Fractional heights.** 1.5 line-height gives Today rows 89.5/90.5, first milestone row 63 vs 64 (no border-top), steps 48/49, chips 20.5, h1 32.2, hero h1 58.24; first-child rows lose 1px. Fix: explicit px line-heights (section 2), draw hairlines as `li+li{border-top}` plus equal padding so every row is identical. Effort S.

## 5. Rethink / bold bets
1. **One `.row` primitive** (fixed column tracks, `--card-pad` inset, 12/16 vertical) for milestone, attention, agenda, file and activity rows. Dissolves F3, F4, F7, F8, F10, F14 instead of patching six rule-sets.
2. **Phone Clients/Payments as stacked cards, not clipped grids** (F5): amount + status are the point of Payments, and today they are the part you cannot see.
3. **Calendar for 15 clients:** single-row scrolling filter, label-only 2-line chips, and an agenda list as the phone default (F12, F13). The current legend + "Org: label" chips cannot scale to the target user.

## 6. Screen index
today-*: F4 F8 F9 F10 F11 F17 F19 F20 F26 F35 | clients: F11 F19 F21 | payments: F7 F11 F29 | calendar: F12 F13 | project-*: F3 F7 F9 F10 F16 F25 | documents-modal: F15 F34 | plan: F1 F20 F27 | setup/first-day: F27 F32 | client-*: F3 F15 F16 F22 F23 F24 F25 | landing: F17 F18 F19 F30 F31 | phone: F1 F5 F6 F8 F14 F15 F17 F28.

## 7. Overall plan (one pass)
1. head.html: add doctype; add tokens; delete dead CSS; set line-heights. Verify with shots.
2. Token sweep: replace every padding/margin/gap/radius/font per the snap map (about 120 declarations in head.html, 150 inline styles in app.js; move the repeated `margin-top:8px` after `.card-h` into `.card-h + *`).
3. Component fixes: `.rows`/`.att` fixed tracks (F3, F4, F10), `.d` dots slot (F9), `.tabs`, `.fbar`, `.card` overflow, badge.draft, chips (F11-F16).
4. Phone pass at 390: F1, F5, F6, F8, F14, F28; add `max-width:640` rules.
5. Landing and client polish (F18, F19, F22-F25, F31-F32).
6. Regression guard: reuse the `probe.py` approach to assert `scrollWidth<=clientWidth` on all 29 scenarios and equal amount right edges per list.

## 8. Top 5 fixes
1. F1 + F5 + F6: phone overflow and clipped nav/tables (`.stack` template, `.swatches` wrap, stacked rows).
2. F2 + F7 + token sweep: doctype, `--card-pad`, one card inset, off-scale values snapped.
3. F3 + F4 + F10: fixed-track row grids so money columns align and agenda text clears its edge.
4. F9 + F11 + F12 + F13: calendar dots slot, filter-bar gap, single-row client legend, chip height and truncation.
5. F15-F17 + F24: tabs `justify-self`, selected-row clip/badge, `text-wrap`, one rail width.
