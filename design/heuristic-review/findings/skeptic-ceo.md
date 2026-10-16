# PayGuard review: skeptic-ceo (fund-or-build lens)

## 1. Verdict
Today this is a feature (a Today view plus a pay link) wrapped around one genuinely differentiated mechanism (fund first, watermarked preview, approve-to-unlock) that the landing buries. The model also contradicts itself: it targets *established freelancers with repeat clients* (who need escrow least) and monetises like an escrow marketplace (about 9% all-in). I would not fund it on this prototype; I would fund four weeks of the experiments in section 6.
**Scores /10:** wedge clarity 3 | first-30-seconds 5 | daily pull (Today) 6 | client conversion and trust 4 | monetisation and growth design 2 | visual polish 8 | brand distinctiveness 4 | client mobile 7. (Several project/payments/m-today shots were captured mid fade-in; I judged those from code.)

## 2. What is working: keep it
- **client-review.png "Pays / Releases / Unlocks" block** above "Approve and release ₹60,000": consequence stated in three rows. Best screen in the product; it is the product.
- **Guest by link** ("No account needed", "Your clients never need an account"): correct for conversion.
- **today-waiting-open.png**: "Needs you" vs collapsed "Waiting on clients", money on every row. Right information scent.
- **"Your usual terms" in plan.png** (reply within, rounds included): lets the freelancer say "these are my terms", not "I'm being difficult".
- **Three separate documents** (documents-modal.png): clean GST separation; a real India edge once GSTIN and TDS exist.
- **Soft-orange overdue, "It can't be undone" confirm** (client-approve-dialog.png): relationship-preserving and honest.

## 3. Findings
**F1** S1 | landing-top, landing-full | Hero "Run your freelance business like a business." with a calendar dashboard; "funded before you start" appears only as card 3 ("Get paid with less chasing") and step 2. | Interchangeable with Bonsai, HoneyBook, Dubsado. No number, no price, no enemy beyond "WhatsApp". 30-second read: tidy tracker. | Lead with the outcome and a number: "Get paid before you start. Clients approve a watermarked preview; you unlock the files." Hero visual = client link, approve, "originals unlocked", not the calendar. | S

**F2** S1 | client-checkout, payments, PRD s.7 | Client pays ₹38,000 + 5.5% + 18% GST = ₹40,466 (+6.5%); freelancer pays another 3.5% (₹1,330): about ₹3,420, or 9%, per stage before gateway cost. Razorpay payment links: 2% + GST (about 2.4%), UPI included, and its own page says govt UPI MDR is 0. Zoho Invoice: free, with reminders and a Pay Now button. Bonsai: $19-25 per month flat. A freelancer moving ₹1.5L a month pays about ₹5,250 (2-3x Bonsai) and her clients about ₹9,750 more, rising with her success. | Take-rate on repeat relationships is the Upwork leakage problem: once trust exists they pay by UPI directly. | Choose one: (a) ₹499-999 per month SaaS (Today, auto-chase, GST/TDS docs) with payments at cost; or (b) one fee of 3% or less, paid by the freelancer, zero client surcharge by default. Never both sides. | M

**F3** S1 | client-invite to client-checkout; plan | Invite button "Fund the first milestone · ₹38,000", then "Pay ₹40,466" with "PayGuard service fee (example 5.5%)". Plan footer shows only "Total ₹1,20,000 across 4 stages". | Price shock on click three. Resentment lands on Meera (the "strict one" cost), and "example" is visible to a paying client. Meera never sees what her client will pay. | Plan shows "Client pays ₹X". Per-project toggle "I cover the fee / client covers". The invite button shows the all-in price. Delete "example". | S

**F4** S1 | client-invite, client-approve-dialog, payments | The client is asked to prepay a name. Nothing says who Meera is, where the money sits, which regulated provider processes it, or what happens if she never delivers (zero refund copy in app.js). Copy implies holding: "It is released to Meera when you approve", while the Payments footnote promises "1 to 2 days after approval". That contradicts the locked "no escrow-style claims". Razorpay's summary of the 2025 RBI PA directions says T+1 merchant settlement and restricts Route; get counsel. | Either an unlicensed escrow claim or a false one, at the moment of payment. | Pick: partner with a licensed PA for held funds and say so, with provider name and logo and a written refund rule; or drop "release/hold" language and sell "paid, then files unlock". | L

**F5** S1 | plan, client-invite | "Clients fund each stage before you start it." is fixed text. In India advance payment is rare and 30-90 day credit cycles are common (anecdotal; one cited survey, global: about 12% of freelancers refuse to start unpaid). This is the weakest assumption in the product and the spine of everything. | If 1 in 3 clients refuses, Today is half-empty. | Per-project terms: advance %, pay on delivery, net-15. The platform's value (approval, reminders, docs) must hold even when payment is not upfront. | M

**F6** S1 | first-day, plan; no "mark paid outside" action in app.js | Today needs 5+ clients, each a separate behaviour change. Meera's 15 clients are mid-project; there is no import of in-flight work. Day 1 is a checklist ("Your first client link is two steps away"), not a command centre. | Cold-start. The headline promise is unreachable until most clients comply. | Track-only projects: log stages, "paid outside PayGuard", send a view-only status link. Payments become the upgrade. | M

**F7** S2 | client-released, project-complete, client-invite | No distribution loop. Client pages carry Meera's brand plus a shield glyph; the PayGuard wordmark never appears on invite, checkout or review. Released ends at "View documents / Continue". Complete project offers no "next project with Orbit Labs". Guests have no identity to accumulate, yet clients hire several freelancers. | Every client link is the cheapest ad you will own. | Released screen: "Hiring other freelancers? Send your own PayGuard link". Magic-link "all my PayGuard payments" ledger. "Secured by PayGuard" footer. Referral: one fee-free month. | M

**F8** S2 | today-active, invite dialog | Rows 1-2 are chasing buttons ("Remind Sana", "Nudge Priya"); toast says "will get a nudge from you". Channel unspecified; invite dialog offers "Copy" only. Money is a passive side card ("Expected in the next 30 days ₹6,14,705"). | The pain is chasing on WhatsApp, yet handoff and nudge are copy-paste. The freelancer stays the bad cop. | Headline the 10x number: "₹1,65,000 waiting on 4 clients · oldest 5 days" (35k+60k+32k+38k in sample data). Auto-reminders "sent by PayGuard on your behalf" via WhatsApp. "Share on WhatsApp" prefilled. | M

**F9** S2 | client-review; landing step 4 | "The reply date has passed. Take a look when you can." The deadline has no consequence (auto-release is PRD Phase 2) while landing promises "so nobody waits in silence". | Ghosted approval is the freelancer's biggest unsolved pain. | Ship auto-approve after a reminder ladder in MVP, visible to both: "Auto-approves 16 Oct unless you ask for changes." | M

**F10** S2 | client-checkout, setup | Invite says "Pay by card or UPI"; checkout is a card form only, in a UPI country. Only "Email for your receipt": no GSTIN or legal name. Corporate clients (Bloom Studio, Acme Logistics) face ITC and TDS (s.194J) rules; their AP cannot deduct TDS from a card payment or absorb a surcharge. setup.png has no PAN/bank/KYC step but first-day says "2 min". | The ₹60k-stage clients hesitate here; the real drop-off (KYC) is hidden. | UPI intent/QR first, netbanking, GSTIN capture, TDS-aware net settlement; honest KYC step. | L

**F11** S3 | landing hero, today, every project, client-invite, client-review | The same month grid on 6+ screens; on client-invite it takes about 40% of the screen for two dates while trust content is absent. | Freelancers have Google Calendar; repetition dilutes the payment story. | Remove from client pages (replace with "About Meera"); list form on freelancer side. | S

**F12** S3 | whole visual direction | shadcn defaults, Geist, black buttons, blue accent: polished, indistinguishable from any Vercel-era SaaS. The sunglasses mascot (landing CTA, invite) reads quirky beside a ₹40,466 prepayment to a stranger. "PayGuard" connotes fraud/escrow against a "calm workspace" pitch; the PRD is titled "Absolute Cinema", so the name is unresolved. | Competent and forgettable; the mascot is the only brand. | Own one asset: the watermark-to-clean-file "unlock" moment as hero motif. Keep the mascot off money surfaces. Add gravity to client pages (Meera's identity, provider logos). | M

## 4. Rethink / bold bets
1. **Narrow the wedge to pay-to-unlock deliverables** for asset-delivery freelancers (designers, video editors, photographers). The demo data is all design files; watermarks mean nothing to writers, devs or consultants. The client link is the product; Today is the retention layer.
2. **Client reliability graph.** Cross-freelancer payer history ("Karan: 6 stages, pays in 1.2 days avg") shown before a freelancer accepts work. It is the only real data moat and network effect; magic-link ledgers turn guests into identities.
3. **Flip pricing**: freelancer SaaS plus payments at cost, zero client surcharge; a take-rate only on opt-in held-funds projects for *new* clients, where escrow genuinely earns its fee.

## 5. Cut / double down
**Cut:** client calendar, per-client logo upload, the Calendar nav item (for now), "AI tidy-up" in the changes dialog until the loop works. **Double down:** the client page (trust, identity, UPI, all-in price), the money-stuck headline, auto-chase, GST/TDS documents.

## 6. Three experiments, next 4 weeks
1. **Concierge prepay (wk 1-2).** 10 freelancers, 1 real upcoming stage each; manual Razorpay link, watermarked Drive preview, WhatsApp reminders. Two arms: client pays surcharge vs freelancer absorbs. Measure paid within 72h vs her own baseline, requests to pay direct, GSTIN/TDS asks. **Kill:** fewer than 6 of 10 prepay on first ask, or no faster than baseline.
2. **Landing A/B (wk 1-3).** Current hero vs "Get paid before you start", ₹10-15k spend on designer/video communities, with a screener: "of your last 10 projects, how many paid before you started?" **Kill:** under 5% visitor-to-waitlist, or under 25% say 3+ clients would accept prepay.
3. **Track-only pull (wk 2-4).** 12 freelancers with 5+ clients get a manual or prototype Today, no payments. Measure D7 return on 4+ of 7 mornings, clients added, and whether they send one link to an overdue client. **Kill:** under 40% return.

## 7. Top 5 fixes, in order
1. Decide who pays; remove the client surcharge and price shock (F2, F3).
2. Re-pitch landing and Today around prepay-then-unlock and the money-stuck number (F1, F8).
3. Resolve escrow/"release" language, provider naming and refund rule (F4).
4. Per-project payment terms plus track-only mode (F5, F6).
5. Build the loop: WhatsApp share, auto-reminders, "Secured by PayGuard" and referral on client pages (F7, F8, F9).
