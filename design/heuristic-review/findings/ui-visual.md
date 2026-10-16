# ui-visual: PayGuard visual design review (art director lens)

Evidence note: several supplied shots (calendar, payments, project-*, plan, m-today, m-clients) were captured mid fade-in. I re-rendered them settled, plus dark mode, document tabs and a mascot pose sheet, in `scratchpad/ui-visual/shots/`. Hover/motion points are inferred from code.

## 1. Verdict
Clean, well-built shadcn base with real craft (type, dark tokens, receipts, dialogs, an ownable mascot). But the colour system collides with itself, Today buries its headline under four black buttons and a rainbow calendar, and the identity is ~90% default shadcn: the ownable assets (mascot, hard-offset shadow, paper receipts) are under-used.
Scores: first-glance clarity 6 | task efficiency (visual) 6 | trust 6 | visual polish 7 | consistency 5 | mobile 5 | accessibility (colour/contrast) 5 | distinctiveness 4

## 2. Working: keep
- Landing H1 (56px/600/-.04em) and one restrained mascot at the bottom CTA.
- Today's tinted "Needs you today" card vs quiet "Waiting on clients" strip.
- Client review: artwork as hero; "Pays / Releases / Unlocks" list; black Approve over outline "Ask for changes".
- Dark tokens are complete: my render of today/review/project holds together (primary inverts, semantics re-lit, mascot ink #9DB4FF).
- Receipts as paper with rotated PAID stamp: the most designed object in the product.
- No mascot on Today/Clients/Payments/working states; dialogs are well made.

## 3. Findings

**F1. Client colours collide with status/accent colours.** S2 | today-active, clients, calendar | `CC` in app.js includes #2F5BEA (= `--accent`), #E8A317 (~amber needs-you dot), #2B8A3E (~`--ok`), #9B51E0 (~`--rev`), #E4572E/#C2410C (~`--late`), #D6336C (~err), plus three teal/green near-twins. Today's Acme row: blue triangle + blue delivery dot + blue "4" badge + blue "Funded" legend dot. | You can't tell "this is Acme" from "this is funded". | Drop accent/amber/green/purple/red hues from the picker; ~8 muted hues at one lightness (clay #A65D3F, plum #8A4B7B, olive #77802F, slate #4E6A8A, rose #B0506A, sand #A8895B, pine #2F7A78, dusk #5B5F9E); client colour = 32px tile + 3px rail only. | M

**F2. Two status vocabularies.** S2 | clients, payments | Filter chips: Needs you (amber), Waiting (yellow). Row pills: "Awaiting approval" and "Waiting on client" both purple, "Overdue" shares `--warn` with "Needs you", "On track" blue; Bloom's purple pill sits inside the amber "Needs you 4" filter. | Colour can't be learned. | Two tiers: attention = amber dot + text (orange for overdue); lifecycle = neutral grey pill with glyph (○ not funded, ◐ funded, ● awaiting, ✓ paid), green only for Paid. Retire purple/blue as status. | M

**F3. Today hierarchy is inverted.** S2 | today-active | Eye lands on H1 "Good evening, Meera" (28px), then four identical solid-black 108px buttons, then the coloured calendar; the real headline "4 things need you:" is 14px. Severity dots are 8px orange #D9731B (3.3:1), amber #F5A524 (2.0:1), yellow #E3B341 (1.9:1): one colour to the eye. | The 10-second test is lost to chrome. | "4 things need you today" becomes the 22px headline, greeting a 12px eyebrow. Row 1 keeps solid black; rows 2-4 `btn outline`. Replace dots with a 3px left rail (orange late, amber soon, none info). | S

**F4. Calendar over-coloured and duplicated.** S2 | today-active, calendar | Mini-cal tints 12 of 31 cells plus dots; the agenda repeats each client as tinted row + bar + date tile. Big-calendar chips truncate the discriminator and keep the redundant prefix: "Bloom Studio: Home…". Today marker differs (black disc vs outlined square). | Most chromatic block on the screen duplicates the list beside it. | Today: 7-day strip (dots only, today black fill) + untinted 4-row agenda. Chips: milestone first, client by rail. One today idiom. | M

**F5. Mascot frowns while celebrating.** S2 | client-released, project-complete | `celebrating` pose (base of `party`) has a clear downturned mouth: "Approved. Nicely done, Priya." and "That's the whole project, paid." are illustrated by a sulking cube. | The payoff moment reads as disapproval. | Redraw the mouth as the `excited` smile; QA every frame on the sheet; `party.settle:'happy'`. | S

**F6. Project hero omits the money; primary action is weak.** S2 | project-awaiting-approval, project-overdue-funding | ₹60,000 appears only in a 14px milestone row; "Nudge Priya"/"Send a reminder" is outline; status says "Awaiting approval" 4× (header pill, eyebrow, row, calendar); three identical green "Protected preview ready" rows; 330px calendar rail is irrelevant; hero H3 (28px) outsizes page H1 (24px). | The central screen of a payment product doesn't show what's at stake. | "₹57,900 you receive" (28px) top-right of hero; nudge = the one black button; files collapse to "3 files · previews ready"; rail = payment breakdown + link status; one status pill. | M

**F7. Watermark barely exists.** S2 | client-review | `.wm span` rgba(9,9,11,.2): 1.57:1 on the light stage, ~1.06:1 over the dark swatch (it vanishes); top-left clips to "REVIE". | Looks accidental; weakens freelancer confidence in "view-only". | White 55% text + 1px dark text-shadow, ~50% denser tiling, inset so it never clips. | S

**F8. Money typography.** S2 | client-checkout, payments, milestone rows | All amounts are Geist Mono. At 40px the comma takes a full cell: "₹40 , 466". KPI tiles are bold mono. Numeric columns are left-aligned; milestone amounts glue to variable-width badges so the amount column zig-zags (x≈861/786/852). | The most important number is the worst-set. | Display amounts: Geist sans + `tabular-nums`; mono only for IDs/refs; right-align numeric columns; fixed status slot in rows. | S

**F9. Flat surfaces, default-shadcn identity.** S3 | all freelancer screens | The blue hard-offset shadow is hover-only (code), invisible at rest/on touch. `.shell`/`.side` are white; `--page` (#F4F4F5) is defined but unused; white cards on white held by 1px lines; nested bordered boxes (hero > file rows > milestones); `.fgrid` draws vertical rules between every column. | Generic, no depth. | `.shell`/`.side` on `--page`, cards white; borderless `--muted` file rows; delete column rules; see Bold bet 3. | S

**F10. The three documents look identical.** S3 | documents-modal, doc-invoice, doc-fee | All 12px Geist Mono on the same paper; the freelancer invoice carries no studio colour/logo; nothing signals PayGuard issued the fee doc. | "Three separate documents" is a trust promise. | Invoice: studio header, sans body, GST/SAC fields. Fee doc/summary: PayGuard paper template. | M

**F11. Mascot system drift.** S3 | toasts, review, approve dialog | 11 sizes (34-190px); mascot chip on all 13 toast sites (against "emotional moments only"); `guard` at 50px clumps; ink #0A39B8 vs UI #2F5BEA; 9 `prop-*` sprites shipped, 0 used, while the dropzone uses a thin geometric tray (third line language next to hand-traced art and 2px Lucide icons); a sunglasses cube beside "It can't be undone" on an irreversible-payment dialog feels flippant. | Dilutes the asset and money gravity. | 3 sizes (48/96/160); plain check toasts, mascot for fund/approve/release only; `prop-shield` in the approve dialog, `prop-files` in the dropzone. | M

**F12. Mobile drops the key columns.** S2 | m-clients, m-payments, m-today | Clients shows Client/Next up; Status is off-screen, scrollbar hidden. Payments clips "You re…"/"₹33,". Chip nav clips "Paymen". Checkout inputs 36px/14px (iOS zoom). Four black buttons stack. | "Where every client stands" can't show standing; amounts invisible. | <640px: card rows (name+project left, amount+status right); 4-item bottom tab bar; inputs 16px/44px. | M

**F13. Contrast.** S3 | tiles, pills, dots | Client initials on 16% tint: amber 1.9:1, teal 2.8:1, orange 3.0:1. `--muted-fg` on `--muted` 4.40:1 ("Not funded"). Amber dot 2.0:1. | Fails AA / 3:1 non-text. | Initials in `--fg`; pill text one step darker. | S

**F14. Type scale sprawl.** S3 | global, client-review | 16 distinct sizes (9-56), 22/24/26/28/32/34 near-twins. Client review stacks two 28px titles ("Website redesign"/"Homepage design"); "Reply by Tue, 13 Oct" is 28px for a lapsed date, bigger than ₹60,000 (14px). Today context truncates mid-date: "reply was due Tue, 13 O…". | Flat rhythm; truncation hits the key datum. | Scale 12/14/16/20/28/48. H1 = milestone, project as eyebrow, card headline "Release ₹60,000"; copy "due yesterday". | M

**F15. Redundant chrome.** S3 | clients, all | Topbar title repeats the H1; "Plan a project" ×3 on Clients; count shown twice (black "4" and blue "4"); sidebar is mostly empty yet gives no client navigation. | 56px of chrome says nothing; client colour never works as wayfinding. | Topbar for breadcrumbs only; one Plan CTA; sidebar "Clients" list of top 5 by urgency with colour dots. | S

**F16. Landing proof is thin.** S3 | landing-top, landing-full | At the 900px fold the shot shows one row; the 78% mask cuts the money shot. No client-side shot (the differentiator). Fragment tiles are weak; link chip wraps "payguard.app/p/kiln-/x7". | First glance reads "any SaaS". | Trim hero padding so four rows show; add client-review shot with watermark; `nowrap` the chip. | M

**F17. Client trust surface.** S2 | client-invite, client-checkout | CTA "Fund the first milestone · ₹38,000" but checkout charges ₹40,466. "Card or UPI" promised, card form only. `--brand` recolours the PayGuard shield to the studio colour; the studio has no avatar lockup. Shield note is 12px grey; form card has ~80px dead space. | Price shock; ambiguous "who am I paying". | Show "+ fees" or total on the button; UPI | Card segmented control; studio avatar+name with constant "Secured by PayGuard". | M

**F18. Dark mode and native controls.** S4 | dark-today, plan | Acme logo is a hard white square (`.logo-av img{background:#fff}`); `.avatar.warm` peach hard-coded; no toggle. Plan form: native selects/dates, raw "25000" (no ₹/grouping), 10 near-duplicate swatches. | Polish gaps. | Tint-aware logo tile; styled selects; ₹-grouped inputs. | M

## 4. Rethink / bold bets
1. **Re-found the colour system.** Colour = "something wants you" (amber/orange only); lifecycle by grey shape glyphs; client colour as tile + rail. Resolves F1, F2, F4, F13.
2. **Today as a ranked queue, calendar demoted.** One hero row, the rest quiet; money as a single line; week strip; the Calendar page owns the month.
3. **"Ink and paper" identity.** Use what exists: the mascot's cream (#FFFDF5) as the surface for money moments (receipts, approve card, checkout summary); ink-blue line art; Geist Mono caps micro-labels everywhere (not only receipts); the PAID stamp as a motif (APPROVED, FUNDED); the hard-offset shadow shown at rest on each screen's single primary CTA; empty states redrawn from `prop-*`. A ledger-and-stamp feel no freelancer tool has, touching no locked decision.

## 5. Top 5 fixes, in order
1. Today hierarchy: headline first, one black button, severity rail, week strip (F3, F4).
2. Colour discipline: purge accent/status hues from client colours; one two-tier status vocabulary (F1, F2).
3. Money type: sans tabular numerals, right-aligned columns, amount in project hero and client "Release ₹60,000" card (F8, F6, F14).
4. Fix the frowning `celebrating` frame; cut mascot sizes and toast usage (F5, F11).
5. Mobile: cards not clipped tables, bottom tab bar, 16px inputs (F12); then the two-tone watermark (F7).
