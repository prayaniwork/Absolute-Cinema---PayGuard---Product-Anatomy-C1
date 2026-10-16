# CPO review: PayGuard (activation, core abstraction, day-30, admin burden, monetisation)

Extra evidence: headless re-runs of a copy (no files edited) for Today at 1, 2 and 15 clients and a repeat-client plan. Tags [F1]-[F5] map to the five focus questions.

## 1. Verdict
Today is a strong morning ritual and landing-to-first-link is short on paper. But the product sells "stop chasing" and ships a manual chase list; the fee model is invisible until the client's card screen; and a funded, fee-bearing milestone cannot be the unit for all 15 clients the promise is about. A good feature set, not yet a habit.

Scores: Today first-glance clarity 7 | activation / time-to-value 5 | daily-loop efficiency 5 | day-30 completeness 3 | scope discipline 5 | monetisation clarity 2 | retention loop 4

## 2. What is working: keep it
- Today row grammar: client + project, one bold status sentence, context line, amount, one verb button (today-active). Scannable in 10 seconds at 8 clients.
- "See a busy day" / "Look around with sample clients": aha before any data entry (fix labelling, F13).
- Upload then automatic protected preview then "Submit for review" is three steps. Best workflow in the product.
- Client invite (client-invite): plan, three bullets, one CTA, "No account needed".
- "You receive" in Payments and the three documents answer "where is my money?".
- Quoting the client's change note on the Today row (Tidal Health) gives the "why" in one line.

## 3. Findings

**F1. S1 | landing, setup, plan, client-invite, client-checkout, payments | [F5]** Fee model hidden from the freelancer, a surprise for the client. Evidence: no price on landing or setup; Plan footer only "Total ₹1,20,000 across 4 stages". Client-invite CTA "Fund the first milestone · ₹38,000"; one click later client-checkout headlines "₹40,466" (5.5% plus 18% GST on the fee, +6.5%). Freelancer silently nets -3.5%. Labels read "PayGuard service fee (example 5.5%)"; Payments footnote: "placeholders until pricing is decided". Why: the client hesitates at the card; the freelancer learns the cost after quoting; "example" in a checkout kills trust. PayGuard's take is about 9% of stage value, so the value must be stated. Rec: Plan footer "Client pays ₹1,27,788 · you receive ₹1,15,800"; invite CTA shows the real total; pricing line on landing and setup plus FAQ "Do my clients pay extra?"; remove "(example ...)" from client copy; headline Today's money card "Funded: safe to start" (the paid-for value). Effort M.

**F2. S1 | today-active, today-waiting-open, landing mock, client-review | [F4]** "Skip the chasing" ships as a chase list. Evidence: 3 of 4 Today buttons are "Remind Sana", "Nudge Priya", "Remind Anil". `remind()` only logs and toasts; the row is unchanged, so no "reminded yesterday", no cooldown, no channel, no preview. The reply-by date has no effect: client sees "The reply date has passed. Take a look when you can."; landing promises "so nobody waits in silence". Why: the pain is the social cost of chasing; at 15 clients that is six daily taps with no memory. Rec: PayGuard sends reminders as itself on a cadence set once in "Your usual terms" (approval day -1, 0, +2; funding +1, +3); row reads "Auto-reminded yesterday, next Fri"; manual button becomes "Send now" with preview and WhatsApp; after the last step offer Extend / Call / Close. Effort L.

**F3. S2 | today-active, today-15 and today-1 (my renders), m-today | [F2]** "Needs you" mixes "I owe" with "they owe" and does not scale. Evidence: "4 things need you: 1 payment, 1 approval..." (payment and approval are client duties). At 15 clients (12 needing action): badge 12, four identical rows "Not funded · 2 days overdue", "Show 8 more"; sort is severity then amount ascending (`a.amount - b.amount`), smallest money first. At 1-2 clients Today becomes plain cards, no money card, layout jumps at 3. Rec: two lanes, "Your move" (upload, answer changes) then "Their move" with ₹ total ("₹2.1L waiting on 5 clients"); sort ₹ descending then age; collapse same-kind rows with "Remind all 5"; badge counts Your move only; "Upload" opens the file picker. Effort M.

**F4. S2 | today-active, project-overdue-funding, clients | [F2]** "Overdue" contradicts the date. Evidence: Northwind "Not funded · 3 days overdue" while stage is due Sat 17 Oct; project page shows "Overdue" beside "Due Sat, 17 Oct · 3 days". Logic: asked over 2 days ago equals overdue. Clients table: late funding "Overdue", late approval "Awaiting approval", late delivery "Needs you". Rec: "Asked 5 days ago, no payment yet"; add a "fund by" date to Plan; "Overdue" only for passed dates; one label rule everywhere. Effort S.

**F5. S2 | plan, invite modal, first-day, today | [F1][F4]** Activation stops at "copy this link". Evidence: button says "Create and invite Arjun"; modal says "Send Arjun this link", Copy only. No WhatsApp despite the promise, email-only contact, first-day checklist ("Invite your client") vanishes once any project exists, nothing records sent/opened, no freelancer notifications anywhere (pull-only). Rec: "Send on WhatsApp" (prefilled), "Email", "Copy"; optional phone; stay in first-client mode ("Link not opened, sent 3h ago") until the client opens it; notify the freelancer on open, fund, approve. Effort M.

**F6. S2 | setup, first-day, plan | [F1][F4]** "About two minutes" holds only because everything is prefilled. Evidence: demo path is 5 screens, about 7 clicks; real path is 4 setup inputs plus 4 client fields plus 4 stages x 3 fields with date pickers. Plan leads with logo/colour (9 swatches, upload) before money; "Step 2 of 2" is static even on the tenth project; defaults are values ("Arjun Rao"), not placeholders. No sign-in, payout or GSTIN step, yet no real client can pay without them. Rec: setup straight into Plan (drop the first-day interstitial); template first (One / Half / Three), amounts, client email last; auto-colour, logo from email domain; payout/GST just before first send; remember last terms. Effort M.

**F7. S2 | clients, plan | [F2][F3]** A client is not an object; a project is. Evidence: `createproject` always builds a new client; "All 8 clients" counts projects. Re-running Plan with the same details produced two "Kiln & Co." in different auto-colours. One contact only. Clients (clients-15) is insertion-ordered, no ₹ column, no sort. Why: repeat work is the ICP's core; 15 clients become 25 rows. Rec: client = company + contacts + colour/logo + default terms, projects beneath; Plan autocompletes; rows show outstanding ₹ and last activity, sortable; second "send receipts to" email for accounts. Effort L.

**F8. S2 | project-* | [F3]** Plans are frozen after creation. Evidence: project page offers only "Edit" (client details). Client is told "Talk to Meera about extending the scope" but the freelancer has no grant-a-round, no add/edit stage, amount or date, no archive; no settings (payout, GSTIN, defaults, notifications); no export. Why: scope shifts in week two. Rec: edit stages, grant round, archive, Settings, monthly statement, in that order. Effort M.

**F9. S2 | today | [F3]** Shows what needs me, never what changed. Evidence: `attentionFor` shows a funded stage only if due within 7 days; the funded toast fires only on an open project page (inferred from `pendingEvents`). Rec: "Since you last looked" strip (funded, opened, approved, paid out; max 3 lines). Money landing is the retention hit. Effort S.

**F10. S2 | landing, client-checkout, m-checkout, documents-modal | [F4][F5]** "Card or UPI" promised, only card fields shown; invoice stops short. Evidence: invoice has From/To names and "Layout shown is a prototype"; no client GSTIN or billing name, no SAC or TDS handling. Why: Indian phone payers expect UPI intent; finance teams want GSTIN, so the freelancer re-issues elsewhere. Rec: UPI first on mobile with card/netbanking as equals (stages exceed common UPI caps); ask GSTIN and billing name once at first checkout. Effort M.

**F11. S3 | today, calendar, plan, client-invite, client-review | [F3]** Calendar is scope creep. Evidence: five instances (Today rail, Calendar page, project, Plan draft, both client pages), each followed by a list repeating one or two dates; about half the right rail on the client decision screen. Rec: cut client-side and Plan-draft calendars; Today gets a "Next 14 days" list; park the Calendar page until an add-to-Google-Calendar feed. Defer the AI tidy-up bar (client-changes-dialog): LLM cost, rewrites a client's words. Effort S.

**F12. S3 | today-active, payments | [F5]** Money disagrees by screen. Evidence: Today Northwind ₹35,000 (gross); Payments "You receive" ₹33,775; "Expected in the next 30 days ₹6,14,705" is net and 63% unfunded "Upcoming". Rec: stage price everywhere, net only where labelled; headline secured money, show unfunded as "Likely". Effort S.

**F13. S3 | landing-top, first-day | [F1]** Headline "Run your freelance business like a business." is tautological; the outcome hides in the grey subhead; "Sign in" equals "Get started"; sample data loads into the real workspace with no banner or Clear (`loadactive` overwrites projects). Rec: lead with "Know who owes you, every morning"; "Sample data" banner with Clear. Effort S.

**F14. S3 | client-released, project-complete | [F1]** The payoff frowns. The "celebrating" frame (base of `party`) has a downturned mouth under "Approved. Nicely done, Priya." It may animate away; the poster frame is what static and reduced-motion viewers see. Rec: use a smiling base frame. Effort S.

**F15. S4 | m-today, m-payments** Nav pills clip ("Payme..."); Payments needs horizontal scroll to reach "You receive". Rec: bottom bar of four. Effort S.

## 4. Rethink / bold bets
1. **Invert Today: PayGuard chases, the freelancer ships.** "Your move" lane, automated cadence for "They owe", "Since you looked" on top. Metric: minutes per morning at 15 clients.
2. **Client as the object, plus a free tracking-only mode.** Trusted and retainer clients will not fund stages or pay ~9%. Let any client sit on Today with manual "mark paid"; charge only when money flows through PayGuard. Otherwise the habit covers 5 clients, not 15. Recurring stages follow.
3. **Just-in-time onboarding; activation = client opens the link.** Landing to "first link" (project, total, template, client email); terms and payout asked at send; celebrate first open and first funding.

## 5. Top 5 fixes, in order
1. Show fees honestly: net and client total in Plan and on the invite CTA, a pricing line on landing, no "(example)" in client copy (F1).
2. Automatic reminders from PayGuard with a "reminded" state and an end-of-window action (F2).
3. Split Today into Your move / Their move, sort by ₹, fix "Overdue", add "Since you looked" (F3, F4, F9).
4. WhatsApp send, opened tracking, freelancer notifications (F5).
5. Plan-first onboarding plus edit-stages, extra round, repeat-client basics (F6, F7, F8).
