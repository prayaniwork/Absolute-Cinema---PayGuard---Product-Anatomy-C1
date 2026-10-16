# Content design and brand review (content-brand)

Extra renders (decline, rounds exhausted, settled project, reminder toast): `scratchpad/content-brand/shots/`. Motion and hover are inferred from code unless stated.

## 1. Verdict
Calm, plain voice with some excellent lines, undercut by three things: escrow-flavoured money words (against the locked "no escrow claims" decision), an "overdue" the client never agreed to, and a mascot used as notification chrome. The landing H1 is the weakest sentence on the page; the real hook sits one scroll lower.

Scores: copy clarity 6 | terminology consistency 4 | tone in tense moments 5 | claim honesty 4 | landing conversion 5 | mascot fit 5 | motion carries meaning 5 | name fit 5.

## 2. Keep
- "You're all caught up. Nothing needs you right now." and "Uploads open once it's funded" (lock plus reason).
- Landing final CTA ("Start with your first client. It takes about two minutes. Add the rest whenever you are ready.") and "See a busy day".
- Today row anatomy: org, what, context, the client's own words quoted.
- Setup "in plain words"; approve dialog says "Not yet", not "Cancel".
- No mascot in tables or lists; one animated per screen; reduced motion honoured everywhere (head.html l.428); seal check-draw on "Payment received" is meaningful motion.

## 3. Findings

**F1 | S2 | landing-top, m-landing.** H1 "Run your freelance business like a business." is circular, fits any CRM, and implies the reader isn't one. The pain ("chasing people on WhatsApp") is 18px grey; the better hook, "Know who needs you. Skip the chasing.", is the H2 below the fold; "Your clients never need an account" (12px muted) is the biggest objection-handler. *Rec:* H1 "Know who needs you today. Skip the chasing." Sub: "Every client, project, approval and payment in one calm place. Clients pay and approve from a link, no account." | S

**F2 | S2 | landing-full.** No fees shown (5.5% client / 3.5% you exist only in-app); no guest-side screenshot (the differentiator); step 4 "so nobody waits in silence" implies a mechanism that doesn't exist. "Chasing/follow-up" appears 4 times. Steps mix subjects ("Client funds…", "You deliver", "you are paid"). "Sign in" runs the same action as "Get started". *Rec:* client-view frame, one fee line, steps all "You… / Your client…". | M

**F3 | S2 | today-active, project-overdue (settled), client-invite.** "Overdue" is invented: `Not funded · 3 days overdue` is days since you asked minus 2; the project page shows "Overdue" three times on a stage "Due Sat, 17 Oct · 3 days" away. The client never sees a pay-by date, and invite row "Due Mon, 26 Oct · ₹38,000 · Not funded" reads as an invoice date (it means delivery). "1 payment" in the Today summary reads as one you must make. *Why:* accusing without an agreed date erodes goodwill. *Rec:* add "Pay by" per stage; say "Overdue" only after it; "Due" becomes "Delivery"; "1 unpaid stage". | M

**F4 | S2 | toasts, client-review, checkout.** Escrow vocabulary: "₹60,000 is secured. You can start."; "Approve and release ₹60,000"; "It is released to Meera when you approve." It implies held, guaranteed money; with no dispute system, a freelancer whose client never approves will feel misled. *Rec:* write to the true mechanism, with one canonical line reused verbatim: "You pay now to start this stage. Your payment goes to Meera when you approve." | M

**F5 | S2 | everywhere.** Drift (see glossary): *stage* in the plan form vs *Milestones* card; reply by / reply date / Review closes / Client replies within; "round 1 of 2" vs "1 of 2 rounds left" vs "1 of your 2 remaining" (same "1 of 2", opposite meanings); Remind / Nudge / Resend / Send a reminder; Plan a project / Tell us how this project works / Create and invite (three "Plan a project" buttons on Clients); client / contact / guest. | S

**F6 | S2 | today-active.** The reminder, the most delicate sentence in the product, doesn't exist. `remind()` only logs and toasts; the row stays "Remind Sana" (double-send, no "reminded today"). Landing says "skip the chasing", yet the top rows' primary buttons are Remind and Nudge. *Rec:* editable two-line preview before sending; row state "Reminded today"; offer "Remind automatically Thursday". Draft: "Hi Sana, Concepts is ready to start on Thu 22 Oct. Your link to pay is below, whenever suits. Just a heads-up on the date." | M

**F7 | S2 | client-invite, client-checkout.** Button "Fund the first milestone · ₹38,000", then "Pay ₹40,466" (+6.5%). "PayGuard service fee (example 5.5%)" has no purpose, so PayGuard meets the guest only as a fee and a watermark. Stage "Layout" has no scope text. "Pay by card or UPI", but the form is card-only. Top bar tags the payer "Priya Nair · guest". *Rec:* total on the button; one-line fee reason; two-line "What's included" per stage; "Priya Nair · Bloom Studio"; build UPI or stop promising it. | M

**F8 | S3 | client screens.** The same reassurance appears 5 times in 3 wordings (invite bullets, checkout bullets, review reassure line, Pays/Releases/Unlocks, approve dialog), while the moments needing care blame: "Your card was declined", "You've used all your rounds", "Be specific. This uses 1 of your 2 remaining rounds." *Rec:* state the mechanism twice; spend the words on rewrites 6-9. | S

**F9 | S2 | mascot.** ~30 placements, 14 are toasts, including "Copied", "Downloading", "Client updated"; thumbs-up 9 times; poses `pay`, `sit`, `project` built, never used. The shield buddy sits beside a policy sentence on client-review. `party` celebrates the *payer* ("Nicely done, Priya"). Declined card gets `worry` plus a shake every 8s. In every pose I saw, shades hide his eyes except `worried`, so he is sympathetic only when a payment fails. Shield plus shades reads bouncer, not calm. Absent from the landing hero. *Rec:* icon-only toasts; no shield by default; client approval gets `thumbs`; decline gets `thinking`, no loop; shades-off for empathy (overdue, rounds out). Three new moments: (1) **Payout sent**, `pay`, since "Paid" arrives as a silent badge flip two days after the party; (2) **Reminder scheduled**, `sit`, calming the Overdue hero; (3) **Changes sent** (client), `focused`: "Meera's on it." | M

**F10 | S3 | motion (inferred, plus 0.9s shots).** `.main` rises .42s, then every row rises with an `n*38ms+90ms` delay, so content is at opacity 0 for ~0.9s on each view and tab switch (my payments shot at 0.9s shows an empty table). The events that matter don't move: Remind leaves the row unchanged, a cleared item doesn't leave, Paid flips silently. The hover wink (-1px offset, 3px blue shadow) also fires on "Pay ₹40,466" and "Approve and release". *Rec:* stagger once per session, under 300ms; animate row state change; no wink on money-confirm buttons. | S

**F11 | S3 | brand.** PayGuard, the shield mark, the shield mascot and the "PREVIEW · PAYGUARD" watermark all promise protection; the product promises calm and refuses guarantees. Fine as a working name through testing; run a clearance check before launch (unverified: it reads generic in payments/fraud). Directions if it fails: Steady, Settled, Daybook (check Tally overlap). | L

**F12 | S4 | setup, first-day.** "Step 1 of 2 / 2 of 2" vs checklist "1 of 3 done"; "Create and invite Arjun" but the next screen asks her to copy a link; the heaviest term ("Rights to the work pass to the client…") is bullet 3 of 4, in grey. *Rec:* one step model; "Create project"; lead with the rights bullet. | S

## 4. Proposed glossary
| Concept | Use | Retire |
|---|---|---|
| Unit of work + money | **stage** | milestone |
| Client pays | **pay / Paid** | fund(ed), secured |
| Money to freelancer | **Payout processing / sent** | released, "Paid to you" |
| Client's deadline | **Review by** | reply by/date, Review closes |
| Dates | **Pay by, Delivery, Review by** | Due, stage due |
| Chase | **Remind** | nudge, resend |
| Allowance | **"2 left"** | round x of y |
| People | **client**; never "guest" | guest, contact |
| New work | **New project** | Plan a project, Tell us how… |

## 5. Fifteen rewrites (before → after)
1. H1: "Run your freelance business like a business." → "Know who needs you today. Skip the chasing."
2. Step 4: "With a reply-by date, so nobody waits in silence." → "They get a review date. You can remind them in one tap."
3. Today: "Not funded · 3 days overdue" → "Waiting on Sana's payment · asked 5 days ago"
4. Today: "Awaiting approval · 1 day past the reply date" → "Priya hasn't reviewed this yet · was due Tue 13 Oct"
5. Toast: "Sana will get a nudge from you." → "Reminder sent to Sana, with her link."
6. Client past date: "The reply date has passed. Take a look when you can." → "Meera is waiting on your review. It was due Tue 13 Oct."
7. Rounds out: "You've used all your rounds. Talk to Meera about extending the scope." → "That was the last included round. Want more changes? Ask Meera: she can add a round or quote the extra work." (replace the disabled "· 0 left" button with this action)
8. Decline: "Your card was declined. You have not been charged…" → "Nothing was charged. That payment didn't go through: check the details, or try another card or UPI."
9. Approved: "Approved. Nicely done, Priya." → "Approved. ₹60,000 is on its way to Meera."
10. Toast: "₹60,000 is secured. You can start." → "Priya paid for Homepage design (₹60,000). You can start."
11. Invite CTA: "Fund the first milestone · ₹38,000" → "Pay for stage 1 · ₹40,466"
12. Plan: "Create and invite Arjun" → "Create project" (modal: "Copy Arjun's link")
13. Review: "You funded this stage before work began. It is released to Meera when you approve." → delete; the panel carries "Your payment goes to Meera when you approve."
14. Overdue hero: "Sana hasn't funded this milestone yet. You can start once it is funded." → "Sana hasn't paid for this stage yet. Uploads unlock when she does."
15. Changes dialog: "Be specific. This uses 1 of your 2 remaining rounds." → "Say what to change. This is round 1 of 2 included."

## 6. Rethink / bold bets
1. **Write the messages the product sends for the user.** Reminder, review-late, changes-sent: this is where "skip the chasing" is kept or broken. Ship editable, polite templates with an auto-cadence.
2. **Date-anchored language replaces blame.** Pay by / Delivery / Review by become the spine of rows, calendar and client panel; "overdue" only against a date the client saw.
3. **Brand around calm, not guard.** Mascot as calm colleague (no shield, shades-off for empathy, one feeling per moment); revisit name and shield mark alongside.

## 7. Top 5 fixes
1. Add "Pay by"; stop inventing "overdue"; "Due" becomes "Delivery" (F3).
2. Settle money vocabulary; remove secured/release/fund; one canonical mechanism sentence (F4, F5).
3. Build the reminder message; rewrite late, rounds-out, decline, approved copy (F6, F8).
4. Rework landing H1, sub, steps; add client view, fee line, silent-client answer (F1, F2).
5. Mascot: strip utility toasts, kill the worry shake, add payout and reminder-scheduled moments (F9).
