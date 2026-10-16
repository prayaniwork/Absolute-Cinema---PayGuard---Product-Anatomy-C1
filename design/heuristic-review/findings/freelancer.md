# PayGuard review: freelancer lens (Ananya, brand/web designer, 12 clients, GST-registered)

## 1. Verdict
Best Today screen I have seen in this category: I knew what to do in about 6 seconds. But it only works for clients already inside it, and I cannot get 12 mid-project clients in. The money layer (client pays 5.5% + GST, I pay 3.5%, card-only, no GST-valid invoice) would embarrass me with my best client. I would adopt Today, not the payment rail, as built.
Scores: first-glance clarity 8 | morning task efficiency 6 | setup / migration fit 3 | trust (me and my client) 5 | India fit (GST/TDS/UPI) 2 | visual polish 8 | consistency 6 | mobile 7. Accessibility not scored.
Note: `m-today`, `payments`, `calendar`, `project-*` shots were captured mid fade-in. I re-shot settled versions (`review/fl/shots/`) and checked the rest in code.

## 2. What is working: keep it
- `today-active`: one sentence, then rows of client, state, amount, one black verb. The row "Vikram asked for changes · round 1 of 2" with his quote saves me opening anything.
- `m-today` (settled): amount and button stack under each row; all four rows plus CTAs fit above the fold. This is where I would live.
- "Waiting on clients" collapsed under Needs you separates my move from theirs; soft-orange "Overdue" suits a relationship tool.
- `client-review`: "Reply by / Pays / Releases / Unlocks" and "Ask for changes · 2 left" state the rules without me saying them. "2 of 2 change rounds left" on `project-*` makes my round-six problem visible.
- `setup` plain-words terms and the three-tab `documents-modal` with PAID stamp feel trustworthy.

## 3. Findings

**F1. Cannot onboard clients who are mid-project** | S1 | `plan`, `first-day`, `client-invite` | Evidence: `validateDraft` rejects stage dates before today ("Pick a date from today on"); every stage is created unfunded; the invite says "Fund the first milestone · ₹38,000". No Paid / Delivered / In progress state, no existing-client picker (client data lives inside each project). Landing promises "about two minutes". | Why: about 9 of my 12 have a UPI deposit paid. I would ask them to pay twice, or leave them in Notion, so Today is never complete. Cost: ~18 fields each, 3 to 4 minutes per client, 45 to 60 minutes total. | Rec: "Add a client already in progress": per stage choose Done / Paid outside PayGuard / Delivered / Upcoming, allow past dates, log a manual payment, pick existing client, paste-a-table bulk add. Never send "fund the first milestone" for these. | Effort: L

**F2. My client sees a price jump and a fee I did not quote** | S1 | `client-invite` vs `client-checkout`, `m-checkout`, `documents-modal` | Evidence: button "Fund the first milestone · ₹38,000" becomes "You pay today ₹40,466" with "PayGuard service fee (example 5.5%) ₹2,090" and "GST on service fee (18%) ₹376". On a ₹30,000 stage the client adds ₹1,947 and I lose ₹1,050: about 10% friction against UPI at 0%. "(example …)" is visible to the client; card 4242 is prefilled. | Why: my best client will ask "why am I paying for your tool?" | Rec: all-in total on the invite button; per project "I cover the fee" or "add to quote"; strip "(example)" and prefill. | Effort: M

**F3. "Card or UPI" promised, only a card form exists** | S1 | `client-invite`, `landing-full` step 2, `client-checkout`, `m-checkout` | Evidence: Card number / Expiry / CVC only; receipt hardcodes "Card ···· 4242". | Why: corporates pay by NEFT against an invoice, often after TDS; founders prefer UPI. Card-only misses the people who pay me late. | Rec: UPI first on phone, netbanking, card last; "pay by bank transfer against this invoice" with matching. | Effort: L

**F4. Documents are not GST-usable; no payout, GSTIN or export anywhere** | S1 | `documents-modal` (Invoice tab), `setup`, `payments`, `today-active` | Evidence: invoice "INV-SJK8" is random, with no GSTIN, SAC, place of supply or GST on my work. Footer: "Tax details follow Meera Iyer Studio's own registration. Layout shown is a prototype." Fee tab: "Tax details to be confirmed." No TDS. Setup never asks for bank/UPI or GSTIN. "Expected ₹6,14,705, after your fee" ignores GST payable and TDS. No CSV/PDF export. | Why: I would re-issue every invoice in Zoho, so PayGuard adds work; my CA wants a monthly sheet; clients cannot claim credit without GSTIN. | Rec: setup collects GSTIN, PAN, payout account. Sequential invoices with SAC and GST on the work. Show invoiced / TDS / net received. "Export for CA" on Payments. | Effort: L

**F5. Morning list: right idea, wrong order, vague words** | S2 | `today-active`, `m-today` | Evidence: `attention()` sorts by severity then **ascending** amount, so Northwind ₹35,000 sits above Bloom ₹60,000 though both are late. Summary "1 payment, 1 approval" reads as money arrived or something I must approve; both mean "client owes". Four identical black buttons (Remind / Nudge / Open / Upload) hide chasing versus working. Desktop truncates "reply was due Tue, 13 O…". | Rec: sort descending by amount inside severity; group "Owed to you ₹95,000" apart from "You owe work"; reword to "1 unfunded, 1 awaiting client approval"; outline buttons for chasing, black for work; wrap context. I would still open WhatsApp, Notion and my bank app: nothing shows money that arrived outside PayGuard. | Effort: S

**F6. Reminders are fire-and-forget** | S2 | `today-active`, `project-awaiting-approval` ("Nudge Priya"), `project-overdue-funding` | Evidence: `remind()` only logs and toasts "Sana will get a nudge from you." The row does not change. I cannot see the message, channel, or last nudge. Nothing sends itself; no WhatsApp. | Why: I will nudge twice, or never, and unseen wording goes out in my name. | Rec: editable preview with Send by email / Copy for WhatsApp; row then reads "Reminded Tue"; optional auto cadence (day 2, day 5). | Effort: M

**F7. The ghost-after-final-tweak case is half solved** | S2 | `client-review`, `project-*` | Evidence: past the reply date the client sees "The reply date has passed. Take a look when you can." and nothing changes. At zero rounds: "Talk to Meera about extending the scope." The freelancer has no edit-stage, add-stage, extra-round or reschedule action (only Edit client). | Why: funded-but-unapproved money has no defined fate; scope talks return to WhatsApp. | Rec: state the consequence on the client page; opt-in auto-release window (PRD Phase 2); "Offer an extra round / add a paid stage" on the project. | Effort: L

**F8. The link feels like policing and carries PayGuard's brand, not mine** | S2 | `client-invite`, `client-review`, invite modal | Evidence: the modal gives a bare "payguard.app/p/…" and Copy. "Clients fund each stage before you start it" is fixed for everyone. Header is a PayGuard shield ("Your color (your clients see it)" only recolours it); no studio logo; watermark reads "PREVIEW · PAYGUARD"; a cartoon mascot sits beside Approve. | Why: for a three-year client, mandatory pre-pay plus a lock banner says "I do not trust you". I sell brand identity, so a client link in someone else's brand hurts. | Rec: per-client protection level (New: fund first + watermark; Trusted: invoice after approval); studio logo upload and my name on the watermark; a ready message ("Hi Karan, here is the plan for the brochure…") with WhatsApp and email buttons; optional no-mascot mode. I challenge the mascot beside Approve: that is my client's finance moment. | Effort: M

**F9. Deliverables assume files** | S2 | `project-funded-upload`, `client-review` | Evidence: dropzone says "images, PDFs, video, docs"; `previewStage` shows a generic "Protected preview" card for any non-image; no size limit stated; only right-click is blocked, so "Protected" oversells. | Why: half my deliverables are Figma links, staging sites, Loom videos, ZIP/AI packages. A heavy watermark across a palette also skews colour judgement. | Rec: "Add a link" deliverable; state size limits; corner-watermark option; say "Preview only". | Effort: M

**F10. Clients and Payments will not scale past 8** | S3 | `clients`, `payments`, `m-payments`, `calendar` | Evidence: filter "Needs you 4" lists rows labelled Overdue, Awaiting approval, Needs you, Needs you; "Needs you" and "Overdue" chips look identical yellow, "Awaiting approval" and "Waiting on client" identical purple. No money column, sort, archive or delete; search by name only. Ten client colours, so my 11th and 12th repeat. `m-payments` clips "You receive"; the phone tab bar cuts "Paymen…". One contact per client; anyone with the link can press "Approve and release ₹60,000". | Rec: Owed column and sort; one chip per state; Archive; more colours plus initials; stacked cards on phone; billing contact; emailed code before Approve. | Effort: M

**F11. Client note can be rewritten before I see it** | S3 | `client-changes-dialog` | Evidence: "Tone" prepends "Thanks, this is a good start."; "Shorten" strips hedges; no edited marker. | Why: raw wording is my evidence of what counts as a round. | Rec: keep the original, show a "tidied" tag. | Effort: S

## 4. Rethink / bold bets
1. **Unbundle.** Make Today, calendar, reminders and "mark paid (UPI/bank)" the flat-priced product for all 12 clients; sell protected-stage payments as an add-on. Today the value I would use daily sits behind the rail I would use rarely.
2. **Import-first onboarding.** Day one should end with all 12 clients on Today in a state I trust, not one new project.
3. **India-grade money layer:** GST-valid invoices, TDS-aware net, UPI and bank transfer, CA export. Without it I double-enter.

## 5. Pay / leave
I would pay roughly ₹500 to ₹800 a month flat if it measurably cut chasing and gave GST-ready invoices plus a CA export. Not 3.5% on trusted clients; I would use the fee rail for 2 or 3 new or risky clients, as insurance. I would leave after a client complains about the fee, double invoicing, funds stuck in "processing", or no export.
Delight: settled `m-today`. Irritation: "(example 5.5%)" on a client screen; Nudge with no preview.

## 6. Top 5 fixes, in order
1. In-flight onboarding: past dates, paid/delivered stage states, existing-client picker, bulk add (F1).
2. GST-valid invoices, GSTIN and payout in setup, TDS-aware net, CA export (F4).
3. Remove the client price shock, add UPI, per-client protection level (F2, F3, F8).
4. Real reminders with preview, WhatsApp share, auto cadence, "Reminded Tue"; sort by amount descending (F5, F6).
5. Close the ghost loop: reply-by consequence, extra-round or paid-stage action, link deliverables (F7, F9).
