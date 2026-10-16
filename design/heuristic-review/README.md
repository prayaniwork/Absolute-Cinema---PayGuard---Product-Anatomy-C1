# PayGuard heuristic review: consolidated findings

Ten reviewers, each with a different mind, evaluated the prototype (version 7, 14 Oct 2026) from screenshots, live-DOM measurements in headless Chrome, and the source. Their full reports are in `findings/`; the screenshots they used are in `shots/settled/` (animations off) plus extras in `shots/ui-visual` and `shots/content-brand`.

| Reviewer | File | Lens |
|---|---|---|
| Chief Product Officer | `findings/cpo.md` | activation, core abstraction, day-30 gaps, monetisation |
| Principal UX Designer | `findings/ux-ia.md` | task walk-throughs, IA, state model, Nielsen matrix |
| Head of Visual Design | `findings/ui-visual.md` | hierarchy, colour, type, identity, components |
| Pixel-craft / design-systems lead | `findings/spacing-craft.md` | 35 spacing and alignment issues, implementation-ready |
| Freelancer (Ananya, 12 clients) | `findings/freelancer.md` | the 10-second morning test, migration, pricing |
| Client (Rohan, sceptical SMB owner) | `findings/client.md` | guest journey, checkout, approve |
| Accessibility lead | `findings/a11y.md` | measured contrast, keyboard, semantics, weight |
| Content and brand director | `findings/content-brand.md` | microcopy audit, glossary, tone, mascot |
| Trust, payments and compliance | `findings/trust-risk.md` | promises, GST/TDS, failure paths, legal flags |
| Skeptical CEO / investor | `findings/skeptic-ceo.md` | wedge, moat, pricing, experiments |

Caveats. These are simulated expert lenses, not user research. Regulatory, tax and RBI points are flags for a CA or lawyer, not advice. Some of my first screenshots were captured mid fade-in, so several reviewers re-rendered settled shots; findings marked "code" are inferred from the source, not seen on screen.

## Scorecard (each reviewer's own scale, /10)

| Area | Score | By |
|---|---|---|
| Today first-glance clarity | 7-8 | CPO 7, UX 7, freelancer 8 |
| Visual polish | 7-8 | visual 7, CEO 8, freelancer 8, client 7 |
| Task efficiency | 6 | UX 6, CPO 5, freelancer 6, visual 6 |
| State-model coherence / consistency | 4-5 | UX 4, content 4, visual 5 |
| Trust (client side) | 4 | client 4, CEO 4, trust 4, visual 6 |
| Promise accuracy / compliance readiness | 2-3 | trust 3 and 2 |
| Monetisation clarity | 2 | CPO 2, CEO 2 |
| India fit (GST, TDS, UPI) | 2 | freelancer 2 |
| Failure-path design | 2 | trust 2 |
| Mobile | 4-5 | UX 4, spacing 4, a11y 4, visual 5 |
| Accessibility: operable / robust | 3 | a11y 3 and 3 |
| Brand distinctiveness | 4 | visual 4, CEO 4 |

## The one-paragraph verdict
Today is the right front door and the best thing in the product; the visual layer is clean and well built. But the product does not yet keep the promise it makes. It says "stop chasing" and ships a manual chase list. It says "no escrow claims" while the copy says secured, held and released. It shows the client one price and charges another. It runs five different vocabularies for the same stage. It has no Client object and freezes a project after the invite. It assumes every client will prepay in a market where that is rare. Fix the money story and the state model first; polish second.

## What is working: keep it (reviewers agree)
- Today row anatomy: client and project, one bold status sentence, a context line, the amount, one verb button. Scannable in about 6 to 10 seconds at 8 clients. (CPO, UX, freelancer, visual)
- "See a busy day" and "Look around with sample clients": the aha happens before any data entry.
- Upload, automatic protected preview, Submit for review: the best workflow in the product.
- Client side is short, calm and account-free. "Ask for changes · 2 left", the honest "can't be undone" approve dialog, and "You have not been charged" on a declined card.
- Itemised checkout that ties out (38,000 + 2,090 + 376 = 40,466), three separate documents, and the receipts as paper with the PAID stamp ("the most designed object in the product").
- "Card details go straight to the payment provider. PayGuard never sees them" is the best trust sentence in the product.
- Plan with templates plus live calendar preview; dark tokens that hold together; reduced-motion handling; plain copy.

## Convergent findings (raised by three or more reviewers)

**C1. Price shock and a hidden fee model.** (CEO, CPO, freelancer, client, trust, UX, visual; 7 of 10)
The invite button says ₹38,000; one click later checkout charges ₹40,466 (client fee 5.5% plus 18% GST on it, +6.5%). The freelancer silently nets 3.5% less. "(example 5.5%)" is printed on a live checkout. All-in take is about 9% of stage value against roughly 2.4% for a Razorpay link and ₹0 for direct UPI. GST is charged on one fee and not the other, and the PRD says GST applies only past ₹20L. Nothing about price appears on the landing page, Setup or Plan.
Fix direction: decide who pays; show the all-in total on the invite button; show "Client pays ₹X · you receive ₹Y" in Plan; say what the fee buys; remove "example" from anything the client sees; add a pricing line to the landing.

**C2. Money language contradicts "no escrow claims".** (trust, content, UX, CEO, client)
"Secured", "released to Meera when you approve", "Releases ₹60,000", "₹40,000 is secured", the shield mascot beside "you funded this stage before work began". Both sides read "someone holds the money". The PRD's Phase 1 is direct pay; holding is Phase 2 and the holder is never named. "Paid ₹63,894" shown at approval reads like a second charge.
Fix direction: pick direct-pay or held-funds, then rewrite every sentence to match, with one canonical line (content suggests: "You pay now to start this stage. Your payment goes to Meera when you approve.").

**C3. Five status vocabularies for one stage.** (UX, CPO, content, trust, visual)
Milestone badge, money state, project pill, Today bucket, Payments tile and filter chips each name the same stage differently. "Overdue" appears next to "Due in 3 days". The Clients "Needs you 4" chip contains rows labelled Overdue and Awaiting approval. "Stage" and "milestone" are mixed in single sentences. "Open as Priya" reads like impersonation. Purple means two different things.
Fix direction (UX proposal): two axes, whose turn (You / Client / Done) and one ladder (To fund, Funded, In review, Changes, Approved, Paid out). Lateness is a "late 3d" chip, never a status.

**C4. "Overdue" is invented.** (content, CPO, trust, UX)
There is no "fund by" date, so "3 days overdue" fires three days after the freelancer asked, on a stage not due until 17 Oct. The client never agreed to that deadline.
Fix direction: add a client-visible "Pay by" date and compute overdue from it; rename the delivery "Due" to "Delivery".

**C5. The chase loop never closes.** (CPO, UX, freelancer, trust, content, CEO, client; 7 of 10)
`remind()` only logs and shows a toast. The row doesn't change, nothing is remembered, there is no preview, channel, cooldown or auto-cadence, and no WhatsApp even though the landing promises to end WhatsApp chasing. The reply-by date has no consequence ("Take a look when you can"), and "so nobody waits in silence" claims a mechanism that doesn't exist. After the last reminder there is no Extend, Call or Close.
Fix direction: PayGuard sends reminders as itself on a cadence set once; the row flips to "Reminded Tue · next Fri"; a visible silence rule (trust suggests reply-by, one reminder, 48h grace, then auto-approve, with a "report a problem" pause).

**C6. Today needs two lanes and a real sort.** (CPO, UX, visual, freelancer)
"Needs you" mixes work the freelancer owes (upload, answer changes) with chasing clients. The sort is severity then amount ascending, so ₹35,000 sits above ₹60,000. At 15 clients it becomes "12 things need you" with four identical rows. Four equal black buttons, a rainbow calendar and a 14px headline bury the point.
Fix direction: "Your move" and "Their move" with a ₹ total ("₹2.1L waiting on 5 clients"); sort by money then age; collapse same-kind rows; one black button; a 7-day strip instead of the month grid.

**C7. No Client object; plans are frozen after the invite.** (UX, CPO, freelancer, trust)
A project is the only entity, so "All 8 clients" counts projects and a repeat client becomes two rows with two colours and retyped contacts. After the invite you cannot edit stages, add a stage, grant an extra round, pause or archive. At zero rounds the client sees a disabled button and "Talk to Meera" with no way to do so.
Fix direction: client as a first-class object (company, contacts, colour, logo, default terms) with projects beneath it; Plan starts with a client picker; edit stages until funded; "Grant a round".

**C8. It doesn't work for India yet.** (freelancer, trust, CPO, client, UX)
"Card or UPI" is promised but checkout is card-only with a prefilled 4242. No GSTIN, PAN, state, SAC or TDS anywhere. The invoice number is random and it is issued on funding date, before work. No payout account or KYC step, so a client could pay someone PayGuard cannot pay. Stages above ₹1 lakh exceed common UPI caps and B2B pays by NEFT/RTGS.
[LEGAL] seller of record, TDS/TCS, payment-aggregator rules.

**C9. The prepay assumption is the weakest bet.** (CEO, freelancer, CPO)
Established freelancers with repeat clients need escrow least; advance payment is rare in Indian freelancing. Mid-project clients can't be added at all: Plan rejects past dates and every stage starts unfunded, so there is no "paid outside PayGuard". Realistic setup for 12 clients is 45 to 60 minutes, against the landing page's "two minutes". Today has no value until 5+ clients each change behaviour.
Fix direction: per-project payment terms (advance %, on delivery, net-15), a free tracking-only mode so all 15 clients can sit on Today, import-first onboarding.

**C10. Mobile hides the important columns.** (UX, visual, a11y, spacing, CPO)
Clients shows no Status, Payments clips amounts, the nav clips "Paymen…", milestone amounts are hidden at ≤900px (including on the client's approval page), the Plan form overflows sideways (448px page in a 390 viewport), checkout inputs are 14px so iOS zooms. Phone preview is about 330×206px with a 12px watermark and no zoom.
Fix direction: card rows under 640px, a 4-item bottom tab bar, 16px/44px inputs, amounts always visible.

**C11. The client doesn't know who PayGuard is, where the money sits or what happens if it goes wrong.** (client, trust, CEO)
First time PayGuard appears on the client's path is as a charge. No named processor or support contact. No refund, non-delivery or cancellation sentence ("Refund" appears zero times in the code). Anyone with the link is the client; approval is not bound to specific files; the watermark says PAYGUARD and the studio's own work reads as a third-party gatekeeper.
Fix direction: a trust block on invite and checkout; "Rules of this project" card; one-time code at Pay and Approve; approval lists the file versions; watermark with the studio name and the client name and date.

**C12. Accessibility is good in appearance, weak in engineering.** (a11y, spacing, visual)
Every action rebuilds the whole DOM, so focus is lost (after opening Approve, Documents and Released dialogs `activeElement` is `body`); dialogs aren't trapped or named; rows are `li`/`div` acting as buttons; the Clients row focus ring is fully clipped; Tone, Grammar and Send in the feedback bar are tabbable while invisible. `--muted-fg` is 4.40:1 on `--muted` (the "Not funded" badge fails, 41 instances); input borders are 1.27:1; amber and yellow dots are about 2:1; the watermark is 1.57:1 on light and about 1.06:1 over dark. No doctype (quirks mode) and no `lang`. The page is 683 KB, 80% of it the mascot sprite.

**C13. The visual system collides with itself and the identity is mostly default shadcn.** (visual, CEO, content)
Client colours include the accent blue, the amber, the green and the purple used for status, so one colour means two things. Mascot: the `celebrating` frame has a clear frown under "Approved. Nicely done"; 11 sizes; a mascot chip on all 13 toasts (against "emotional moments only"); a sunglasses cube beside "can't be undone". Amounts set in mono read "₹40 , 466" at 40px. The ownable assets (mascot, hard-offset shadow, paper receipts) are under-used.
Fix direction: colour means "something wants you" (amber/orange only); lifecycle as grey glyph pills; Geist sans with tabular numerals for money; an "ink and paper" identity.

## Concrete defects found (quick wins)
- Today sort is amount ascending (`a.amount - b.amount`).
- `askedAt` is set once per project, so when stage 1 is released stage 2 instantly reads "Not funded · N days overdue".
- The tidy-up bar's Shorten keeps only the first two sentences (`slice(0,2)`) and silently dropped three of four requests in a test; Tone adds words the client didn't write; the "Describe edits" placeholder collides with the dialog's own job.
- Resubmitting appends v2 beside v1, so the client sees duplicate tabs "Moodboard.svg" twice; Activity omits the note text, so round 1 disappears in round 2.
- Payments tiles and chips disagree: the Funded tile includes awaiting approval, the Funded chip excludes it; the Paid tile excludes processing; Today rows show gross while the widget beside them shows net.
- Payments rows aren't links and the Overdue row has no Remind.
- Loading sample data overwrites projects with no banner or Clear; "Step 2 of 2" is static on every project; Plan is prefilled with a fake "Arjun Rao" and discards the draft if you click Plan again.
- The landing H1 is tautological; the real hook ("Know who needs you. Skip the chasing.") is the H2 below the fold. The product shot shows one row at the fold.
- Under 3 clients Today flips to a different card layout with no money widget.
- Five calendar instances in total; the client decision screen gives about half its width to a calendar.

## Tensions and challenges to locked decisions
1. **"No escrow claims"** is locked, but the copy still makes them (C2). Either the copy changes or the model does.
2. **"No dispute system"** (trust): at least a pause-and-contact state, a refund rule and a silence rule are needed.
3. **Is the payment rail the product?** Freelancer: "I'd adopt Today, not the payment rail." CEO: "a feature wrapped around one real mechanism." CPO: add a free tracking-only mode. Trust: decide direct-pay or held funds first.
4. **Who pays the fee.** Freelancer: ₹500 to ₹800 a month flat is fine, 3.5% on trusted clients is not. Client: a surprise 6.5% at the card screen hurts conversion. CEO: pick one and remove the price shock.
5. **The name and shield.** Content-brand: PayGuard, the shield mark, the shield-holding mascot and the watermark all promise protection while the product promises calm and refuses guarantees (clearance check unverified; alternative name directions are in the file).
6. **Vocabulary: "Funded" vs "Paid".** Content recommends "pay / Paid"; UX proposes a six-step ladder. Needs one decision.
7. **The AI tidy-up bar.** CPO says defer it (cost, and it rewrites a client's words); client calls it helpful-or-weird and found a real bug; accessibility found keyboard issues.
8. **Mascot in toasts** breaks the locked "emotional moments only" rule today.

## Bold bets proposed
- Invert Today: PayGuard does the chasing, the freelancer ships (CPO, UX, CEO).
- Client as the object plus a free tracking-only mode (CPO, freelancer).
- "Rules of this project" as one visible object: fees, reply window, silence rule, rounds, refund rule, rights (trust, client).
- Re-found the colour system around "something wants you" (visual).
- "Ink and paper" identity built on the mascot's cream, the PAID stamp and the hard-offset shadow shown at rest (visual).
- A compliance-grade document set: advance receipt, tax invoice for the work, tax invoice for the fee with GST split, TDS note (trust).
- Unbundle Today from the fee rail; import-first onboarding (freelancer).
- Cheap experiments (CEO): see `findings/skeptic-ceo.md`.

## Spacing audit (to be applied after we discuss)
Measured from the live DOM: 22 distinct paddings, 12 gaps, 11 radii and 14 font sizes are in use, and stacked cards disagree by 4px on their content edge. Proposed one scale: 4/8/12/16/20/24/32/48/64, radii 4/8/12/16, type 12/14/18/24/28/32/40/56 with explicit line-heights, one 20px card inset (16 on phone). Top items: phone overflow (Plan form, nav, Clients and Payments tables); missing doctype putting the page in quirks mode (Files table text renders at 16px); row grids where milestone amounts end at four different x positions and one Today button pushes its amount 10px out of line; calendar numbers jumping 3px between cells with and without dots; filter chips 36px above their table instead of about 16; chips orphaning "Studio Nine"; segmented tabs stretching full width; the selected milestone row's grey fill bleeding past the rounded card corners; widows like "can." and "paid."; the client-review rail at 340 in one place and 330 in another. 35 findings in all, implementation-ready (selector, current value, proposed value) in `findings/spacing-craft.md`.

## Suggested order of work
1. **No-regret fixes (days).** Doctype and `lang`; contrast tokens; focus management and real controls; Today sort and one-button hierarchy; `askedAt` per stage; the "celebrating" frame; watermark; mobile card rows and amounts; the spacing pass; remove "(example)" and "secured/released" copy; tidy-bar Shorten fix.
2. **Coherence (1 to 2 weeks).** One state model and glossary; "Pay by" date and silence rule; Your move / Their move; consistent money (gross/net, Payments buckets); colour discipline; trust block on the client side.
3. **Product decisions (need you).** Direct-pay vs held funds; who pays the fee; tracking-only mode; Client object and edit-after-invite; India money layer (UPI, GST, payout KYC); reminders that send themselves.
