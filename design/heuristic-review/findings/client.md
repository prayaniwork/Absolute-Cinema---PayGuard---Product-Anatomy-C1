# PayGuard review: client (guest) journey, as "Rohan"

Evidence: the client shots plus my re-renders in `scratchpad/client_extra/shots/`, because `client-changes-dialog.png` was captured mid-fade and is unreadable. PDF/DOCX previews are inferred from code.

## 1. Verdict
A short, calm, no-account flow with a clear decision card. But it answers none of Rohan's five questions where he asks them: who is PayGuard (never said), where is my money (implied), what do I get (no text), what if I'm unhappy (shown only after paying), how much extra (revealed on the last step). He WhatsApps Meera instead.

Scores: first-glance clarity 6 | task efficiency 7 | trust 4 | visual polish 7 | consistency 6 | mobile 6 | accessibility 5 | plain language 4

**Rohan's walk (what he'd message instead)**
- **Invite:** "I pay ₹38,000 before she starts" is the upfront payment that burned him. *"Does the money go to you straight away? Who runs this site?"*
- **Checkout:** ₹40,466, and "PayGuard" first appears as a charge. *"Why 2,466 extra to some third party? Can I just UPI you?"* Abandon point.
- **Review:** understands the buttons, can't judge on a phone. *"Mail me the clean file."*
- **Changes:** doesn't know what a "round" is. *"Does asking for changes cost me?"*
- **Approve:** "can't be undone", no safety net. *"I'm 70% sure. Can we talk?"*
- **Released:** fine; wants Download and a GST invoice.

## 2. What is working: keep it
- No account, and `Pay by card or UPI. No account needed.` sits under the CTA (client-invite).
- Checkout shows the total first, then a 3-line breakdown with GST on its own line. Honest and scannable.
- Decision card (client-review): `Approve and release ₹60,000` vs `Ask for changes · 2 left`. Amount in the label, clear primary and secondary.
- `View only until you approve. The watermark comes off and downloads unlock when you approve.` Plain and early.
- Approve dialog: `It can't be undone.` with a non-scolding `Not yet`.
- Declined-card copy (code): "You have not been charged." The receipt table in client-released is clear.

## 3. Findings

**F1 | S1 | client-invite, client-checkout.** Money safety is never stated up front.
- Evidence: invite bullets say `You pay for one milestone at a time, before Meera starts it.` and `Approving unlocks the original files`. Release-at-approval appears only in a checkout bullet and 12px grey text in client-review.
- Why: for a once-burned client, "pay first" is the story. `released to them when you approve` is an escrow claim that never names who holds the money, which conflicts with the "no escrow-style claims" decision.
- Fix: first invite line: "Your ₹38,000 isn't paid to Meera until you approve." Name the holder or soften the claim. Say what happens if it goes wrong.
- Effort: S copy, M legal.

**F2 | S1 | invite, checkout.** Fee surprise on the last step.
- Evidence: CTA `Fund the first milestone · ₹38,000`, checkout `₹40,466` (+6.5%). `PayGuard service fee (example 5.5%)` and `GST on service fee (18%)` are the first time the brand appears.
- Why: "(example)" on a pay screen reads as "not the real number"; a fee with no stated purpose feels like a tax.
- Fix: show `₹40,466 incl. ₹2,466 fees` on the CTA and rows. Add "Covers secure payment, protected previews, receipts." Remove "example" from client-facing copy. See bet 2.
- Effort: S/M.

**F3 | S1 | all client screens.** "Who is this?" is unanswered; it reads as a third-party gatekeeper.
- Evidence: header is a blue shield plus `Meera Iyer Studio` (the shield reads as Meera's logo). PayGuard then appears as a fee, as the watermark `PREVIEW · PAYGUARD`, and in `PayGuard never sees them`. Reminders say `We'll remind you`.
- Fix: invite line "Meera uses PayGuard to run her projects", footer "Powered by PayGuard", Meera's logo as the main mark, watermark `MEERA IYER STUDIO · PREVIEW`, reminders "from Meera".
- Effort: S.

**F4 | S2 | client-invite.** "What exactly do I get?" has no text.
- Evidence: rows are only `Layout ₹38,000 Due Mon, 26 Oct` and `Print-ready files`; the plan has no deliverable field.
- Fix: optional "You'll get" line per milestone (max 140 characters) and a short "Not included".
- Effort: M.

**F5 | S2 | invite, checkout.** Limits are hidden until needed.
- Evidence: the invite gives `3 days` but never the revision rounds. `2 left` first appears in client-review. `By paying you accept the terms` has no link.
- Fix: `2 rounds of changes included` in the invite and checkout bullets. Link the terms. Say what silence does (F8).
- Effort: S.

**F6 | S2 | client-checkout.** UPI is promised and missing; no GST detail.
- Evidence: invite says `card or UPI`; the form is card number, expiry, CVC only. No GSTIN field, yet the invoice is addressed `To: <org>`.
- Why: UPI is the Indian default; a 25-person business wants input-tax credit on that 18%.
- Fix: UPI first (intent/QR), card second. Optional "Add GST number" carried onto the documents.
- Effort: M.

**F7 | S2 | client-review, client-approve-dialog.** No way to ask a question or be unsure.
- Evidence: only `Approve and release` or `Ask for changes`, which burns a round. No contact anywhere, including the funded state.
- Why: this is the WhatsApp leak the product exists to close; with no middle option, hesitant clients stall.
- Fix: a quiet `Message Meera` that costs no round. In the dialog add "Not sure? Ask for changes instead (2 left)" and "3 files · ₹60,000 · can't be undone". Put the amount on the dialog button.
- Effort: M.

**F8 | S2 | client-review.** The deadline is loud, and its tone and consequence are unclear.
- Evidence: `Reply by Tue, 13 Oct` at 28px bold is the biggest text in the decision card. Late copy: `The reply date has passed. Take a look when you can.` The milestone row reads `Due Tue, 13 Oct · reply by Tue, 13 Oct`.
- Why: a big clock says "hurry", the late line says "no rush", and neither says who set the date or what happens next. If silence will auto-release (PRD P2), say so.
- Fix: 13px muted "Meera asked for your reply by Tue 13 Oct." Late: "Meera is waiting on your reply." Then the real consequence. Label the row dates "Delivered" and "Reply by".
- Effort: S.

**F9 | S2 | client-review, m-client-review.** The watermarked preview is hard to judge, especially on a phone.
- Evidence: 12px, 20% black stamps cross the headline, `REVIE` is clipped top-left. On the 390px phone the artboard is ~330×206px, headline ~9px, no zoom. In code PDF/DOCX show a generic `Protected preview` placeholder. Tabs are ~30px tall.
- Fix: tap for full-screen with pinch zoom, sparser stamps, real PDF pages, 44px tabs, hide extensions (`Moodboard.svg`).
- Effort: M/L.

**F10 | S2 | client-review.** Decision card wording and order.
- Evidence: `Pays Meera Iyer / Releases ₹60,000 / Unlocks Original files` reads like an API response. The key trust line is 12px grey, after the buttons.
- Fix: one sentence above the buttons: "Approving pays Meera ₹60,000 and unlocks your 3 original files." Sticky bottom action bar on phone.
- Effort: S.

**F11 | S2 | client-changes-dialog.** The tidy bar is mostly weird and can lose his requests.
- Evidence: placeholder `Describe edits` collides with the dialog's job (he is describing design edits), so he'll type "make logo bigger" into it. "Improve" doesn't say what happens to his words or whether AI is involved. My Shorten run on a four-request note ("palette cold… dont change the logo… heading font too thin… darker background version") returned `The palette feels cold. We need warmer tones.` Three requests vanished (code: `slice(0, 2)`). "Tone" adds `Thanks for sending this over.`, words he didn't say. On phone the bar truncates to `Describe`.
- Why: a lost request costs a paid round; auto-softening tilts toward the freelancer.
- Fix: drop Shorten and Tone. Keep one "Tidy" that only fixes spelling or adds bullets, with a visible before/after (or see bet 3).
- Effort: S/M.

**F12 | S3 | client-review, changes dialog.** The rounds counter is inconsistent and creates scarcity.
- Evidence: `2 left`, `1 of your 2 remaining rounds`, `Round 1 of 2 used`; at 0, `Talk to Meera about extending the scope.`
- Fix: define once: "2 rounds included. A round is one message with all your changes." At 0: "Meera will quote extra changes."
- Effort: S.

**F13 | S3 | client-approve-dialog, client-released.** Tone and next action.
- Evidence: a sunglasses mascot beside `It can't be undone` (a third of the phone dialog). `Nicely done, Priya.` congratulates the payer. `is on its way` has no timing. Primary button is `Continue`.
- Fix: no mascot on approve. Primary `Download originals`, secondary `Receipt`, add "Receipt emailed to…".
- Effort: S.

**F14 | S3 | documents.** Three documents, two issuers, one charge.
- Evidence: tabs `Payment summary / Invoice for the work / PayGuard service fee`; footnote `Tax details follow Meera's own registration.`
- Fix: lead with "You paid ₹63,894 = ₹60,000 to Meera + ₹3,894 PayGuard fee (GST invoice)". Offer PDFs. Say whether Meera's amount includes GST.
- Effort: M.

**F15 | S3 | client-invite.** First-impression noise.
- Evidence: a full-month calendar takes 40% of the width (half the phone page) for two dates under `Dates agreed`. Grey `Not funded` pills read as debt. `Karan Bhatia · guest` plus an avatar looks logged in. A 96px sunglasses mascot leads.
- Fix: remove the calendar here, status "To pay" / "Next", drop `· guest`, shrink the mascot.
- Effort: S.

**F16 | S4 | all.** Jargon and numerals.
- Plainer words: milestone → stage; fund → pay; released → paid out; watermark → PREVIEW stamp; scope; `Protected preview`.
- `₹40 , 466` in 40px Geist Mono has a full-width comma that looks like a typo; use proportional digits.
- Effort: S.

## 4. Rethink / bold bets
1. **A trust block, not a footnote.** One promise card on invite and checkout: "Your money goes to Meera only after you approve. If you're not happy: [real policy]". If the product can't promise it, change the flow, not the copy.
2. **Fee ownership.** The client carries ~6.5% for a service he didn't pick. Let the freelancer choose "I cover the fee" so the client sees ₹38,000 flat. It removes the biggest checkout objection and makes it Meera's tool, not a toll.
3. **Feedback pinned to the work.** Replace free text plus the AI bar with tap-to-pin comments on the preview (plus optional voice note or screenshot). Non-designers point at things. One round equals one batch of pins.

## 5. Top 5 fixes, in order
1. State, before payment, where the money is and when it moves (F1).
2. Show the fee total on the invite, drop "example", say what it buys (F2).
3. Make it Meera's: one-line PayGuard intro, her name on the watermark (F3).
4. Add UPI and a GSTIN field to checkout (F6).
5. Add `Message Meera` and a safety line in the approve dialog (F7).
