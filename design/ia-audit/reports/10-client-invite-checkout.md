# Client invite and checkout: IA review

Reviewer scope: `cInvite` (c01), `cCheckout` for the advance (c03) and for the balance (c09), plus the helpers `payTerms`, `payTarget`, `cSide`, `clientTop`.

Note on screenshots: c03 and c09 were caught mid-fade, so I read the exact copy from the code.

Who is looking: a small-business owner (for example Dev Malhotra) who tapped a WhatsApp link from a freelancer (Meera). They have never heard of PayGuard. They have not made an account. They are about to promise to pay money.

---

# Screen 1: The invitation (`cInvite`, c01)

## 1. The job of this page
**Who and when:** the client opens the link for the first time. In under 10 seconds they must know: *Meera sent me a plan for "Brand refresh", it costs 60,000 rupees, and I need to read and sign a contract to begin.*

Smaller jobs, in order:
1. See what they will get and when (the stages).
2. See what they will pay and when (advance, then balance).
3. Feel safe: who they pay, what happens if they are unhappy.

## 2. What is on the page today
**Top bar:** a blue PayGuard shield icon + "Meera Iyer Studio" > "Brand refresh". Right side: "Dev Malhotra" and a round "FL" avatar.

**Middle column, top to bottom:**
- Small label "From Meera Iyer", big title "Brand refresh", line "Hi Dev, here's the plan for Brand refresh. Read and sign the contract to get started."
- Card "1 stage" with one row: "1 Logo and palette, Due Sat 31 Oct, ₹60,000, [Awaiting signature], >"
- Card "How it works" with **7 bullets** (listed below).
- Big black button "Review and sign the contract" and "No account needed."

**Right panel (always open):** studio logo "MI", "Meera Iyer Studio / Meera Iyer", then "Project": Total ₹60,000, Stages 1, Advance 25% · ₹15,000, Originals unlock "Once, after all stages". Then a collapsed "Next up".

**The 7 "How it works" bullets today:**
1. You and Meera sign a contract first. Then work starts.
2. Meera asks for a 25% advance (₹15,000) before starting. It goes straight to Meera.
3. Review each preview within 3 days. If you don't reply, it's approved automatically on day 6.
4. Once every stage is approved, you pay the balance once. All the original files unlock.
5. Pay by UPI, QR code or card, within 7 days of approving. The money goes straight to Meera. PayGuard never holds it.
6. 2 rounds of changes per stage. An extra round costs ₹6,000.
7. If something's wrong, report a problem. Approval is on hold until it's sorted.

Things competing for attention: the title, 1 stage card, 7 bullets, 4 rows in the side panel, one button. About 13 separate facts before the button.

## 3. What is going wrong
1. **"How it works" is too long and mixes three different jobs. (Big)** The 7 bullets mix the order of events (1, 2, 4), the rules (3, 6, 7) and the money (2, 4, 5). A beginner reads a wall of 7 sentences before the button. They will skip all of it and sign, or leave. Rule: a person remembers about 3 steps. The order of events needs 4 short steps. The rules (rounds, auto-approval, problems) belong behind a click, and they are already inside the contract.
2. **The page never says the most important thing plainly: total price and what the advance is. (Big)** "₹60,000" only appears in the stage row and the right panel. The advance is in the middle of bullet 2. Someone who opens this on a phone (the side panel drops below) may not see the money at all before signing.
3. **The same facts are shown twice or three times. (Medium)** Advance: the bullet and the side panel row. Total and "1 stage": the card, the side panel and the row. "Originals unlock once, after all stages": the side panel and bullet 4. This is the "same details again and again" complaint from the test.
4. **Single-stage projects read oddly. (Medium)** "1 stage" as a card title, "Stages: 1", "Once every stage is approved", "Originals unlock: Once, after all stages", "approving each stage". With one stage there is no "all stages" to talk about. The page copy is written for the multi-stage case only.
5. **The stage row has a badge and an arrow that lead nowhere clear. (Medium)** "Awaiting signature" is a status of the project, not of this stage, and the client is the one who has to sign. It looks like Meera is waiting on something. The ">" arrow suggests the stage can be opened, but the client has nothing to open yet. The real action is the black button below. (This matches the finding that waiting for a signature should be a first-class step.)
6. **"If you don't reply, it's approved automatically on day 6." (Medium)** "Day 6" of what? Nobody knows when day 1 is. It is also a surprising rule (silence means you accept) that is hidden in the middle of the list. This one has real consequences for the client and should be easy to find, not lost at bullet 3.
7. **PayGuard branding leaks onto the client side. (Medium)** The top-left icon is the PayGuard shield (`mark()`), shown as if it were Meera's logo. Meera's own initials logo "MI" appears in the side panel instead. Two different logos for the same studio. The words "PayGuard never holds it" are in bullet 5. The client has never heard of PayGuard, so this sentence either confuses ("what is PayGuard?") or looks like a stranger. The rule says the client should see the studio name, not PayGuard.
8. **The top-right corner shows the client their own name and a company avatar "FL". (Small)** "Dev Malhotra" plus "FL" (their company initials) is fine, but "FL" is easy to read as "Freelancer". It does nothing useful on a page that is not a logged-in account.
9. **"Next up" in the side panel is empty at this point. (Small)** It is collapsed and, when opened, would say "Nothing coming up" or show dates from a project that has not started. It adds a row of noise.
10. **The button does not say what happens next after signing. (Medium)** "Review and sign the contract" is clear. But the client does not learn that the next thing is paying the 25% advance. Money after a signature is a surprise unless you warn them.
11. **"No account needed." is good, but tiny and grey. (Small)** It answers a real worry. Keep it, give it a bit more weight, put it next to the button (it already is).
12. **"Meera" and "Meera Iyer" and "Meera Iyer Studio" all appear. (Small)** Studio name, person name and first name all appear on one screen. It is not confusing here, but a beginner wonders if these are three different parties. Pick: studio name in the bar, first name in the sentences.

## 4. What the page should look like (information architecture)
**Principle:** the client is deciding "should I sign this?". Answer in this order: who, what, how much, what happens next, what if. Show the rules only on request.

```
[Studio logo (Meera's)] Meera Iyer Studio                       Dev Malhotra
------------------------------------------------------------------------
From Meera Iyer
Brand refresh
Hi Dev, here's the plan. Read and sign the contract to get started.

┌ What you get ─────────────────────────────────────────────┐
│ 1  Logo and palette        Due Sat 31 Oct         ₹60,000  │
│ (stage rows; for 1 stage just this row, no "1 stage" title)│
└────────────────────────────────────────────────────────────┘

┌ What you pay ─────────────────────────────────────────────┐
│ Total                                            ₹60,000   │
│ Advance, paid now to Meera                       ₹15,000   │
│ Balance, paid when you approve                   ₹45,000   │
│ Pay by UPI, QR code or card. Straight to Meera.            │
└────────────────────────────────────────────────────────────┘

┌ How it goes (4 short steps) ──────────────────────────────┐
│ 1 You sign. Meera signs.                                   │
│ 2 You pay the advance. Work starts.                        │
│ 3 You see a preview and approve it or ask for changes.     │
│ 4 You pay the rest. You get the original files.            │
│ > The rules (changes, review time, problems)   [opens]     │
└────────────────────────────────────────────────────────────┘

[ Review and sign the contract ]
No account needed. You pay Meera directly.
```

- **Keep:** the title and greeting, the stage list, the single button, "No account needed."
- **Move:** the money into its own small block ("What you pay"). It replaces the side panel's Total / Advance rows.
- **Merge:** "How it works" bullets 1, 2, 4, 5 become the 4 steps. Bullets 3, 6, 7 become one collapsed "The rules" block (review time and auto-approval, rounds of changes, report a problem). Their wording stays; only their position changes.
- **Remove:** the always-open right panel on this page (it repeats the middle column), the empty "Next up", the arrow on the stage row, the "Awaiting signature" badge on the row (move to a single line near the button: "Waiting for your signature"), the PayGuard shield in the header, "PayGuard never holds it".
- **Visible by default:** who, what, price, 4 steps, button. **Behind a click:** the rules.
- On single-stage projects, drop the "1 stage" heading and write "Logo and palette" only.

## 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Intro line | "Hi Dev, here's the plan for Brand refresh. Read and sign the contract to get started." | "Hi Dev, Meera sent you the plan for Brand refresh. Read and sign the contract to start." | Says who sent it, in everyday words. Title already says the project name. |
| Card title | "1 stage" | (single stage) hide title. (many) "3 stages" | A card titled "1 stage" is noise. |
| Row badge | "Awaiting signature" | remove; use "Needs your signature" next to the button | The client is the one being waited on. |
| Block title | "How it works" | "How it goes" or "What happens next" | It is a sequence, not a manual. |
| Step 1 | "You and Meera sign a contract first. Then work starts." | "You and Meera sign the contract." | One idea per line. |
| Step 2 | "Meera asks for a 25% advance (₹15,000) before starting. It goes straight to Meera." | "You pay a ₹15,000 advance (25%) straight to Meera. Then she starts." | Says what the client does, not what Meera does. |
| Rules: reviews | "Review each preview within 3 days. If you don't reply, it's approved automatically on day 6." | "Reply to each preview within 3 days. If you say nothing, it is approved 3 days later." | "Day 6" has no start point. |
| Step 4 | "Once every stage is approved, you pay the balance once. All the original files unlock." | "When you approve, you pay the rest (₹45,000) and get the original files." | Uses "originals", gives a number. |
| Payment bullet | "...The money goes straight to Meera. PayGuard never holds it." | "Pay Meera directly by UPI, QR code or card." | Removes a brand the client does not know. |
| Rules: changes | "2 rounds of changes per stage. An extra round costs ₹6,000." | same | Fine. Move behind "The rules". |
| Rules: problem | "If something's wrong, report a problem. Approval is on hold until it's sorted." | "Something wrong? Tell Meera on the preview page. Nothing is approved until it's sorted." | Says where, in plain words. |
| Button note | "No account needed." | "No account needed. You pay Meera directly." | The two biggest worries together. |
| Side "Originals unlock" | "Once, after all stages" | "When you pay the balance" | "Once, after all stages" means nothing to a person with one stage. |

## 6. Questions for the owner
- **Should the client see the contract text on this page, or only after clicking?** I would pick "only after clicking", because the contract is long, and the page already has a summary.
- **Is the advance always required, or can the client decline it?** The brief calls it optional for the freelancer to ask. I would pick showing it as part of the price (not a choice) if Meera asked for it. If it can be waived, say so in the setup, not here.
- **Does the client ever need to see "PayGuard" at all?** I would pick a tiny "Secured by PayGuard" line in the footer, not in the middle of sentences. If the answer is "never", remove it everywhere (see checkout).

## 7. Related screens
- **Before:** a WhatsApp message with the link (see `remindText`: "here's the contract for Brand refresh. Have a look and sign it so we can start"). The message says "contract" and the page says "plan". Pick one word. I suggest the page title stays the project name, the button says "contract".
- **After:** clicking the button opens `cContract` ("Contract for Brand refresh", sign with a pad, "Sign and continue"). Then comes the advance checkout (c03) if an advance is due, otherwise the project page. The client should be told on this page that payment may be next.

---

# Screen 2: Pay the advance (`cCheckout`, kind = advance, c03)

## 1. The job of this page
**Who and when:** the client has just signed the contract and now has to pay the advance. In under 10 seconds they must know: *I am paying Meera ₹15,000 now so she can start Brand refresh, and the rest comes later.*

Smaller jobs:
1. Pick how to pay and complete the payment.
2. Trust that the money goes to Meera and the amount is right.
3. Know what happens after (work starts, a preview comes, the rest is paid later).

## 2. What is on the page today
**Top bar:** shield icon + "Meera Iyer Studio" on the left; "Dev Malhotra" and "FL" on the right. No project name in the crumbs.

**Left column:**
- "‹ Back"
- Small label "Pay your advance", heading "Brand refresh"
- Huge "₹15,000"
- Card: "25% advance on ₹60,000 ... ₹15,000" and "You pay Meera ... ₹15,000"
- Box "The plan": "Logo and palette · ₹60,000", checkbox "I agree to the plan and what each stage includes."
- Two bullets: "This is paid straight to Meera so they can start." and "PayGuard never holds your money. It goes to Meera's account."

**Right column (card):**
- Alert "Test mode: No real money moves in this prototype. Payments are simulated."
- "Receipt email" (prefilled), "How would you like to pay?" UPI / QR code / Card
- UPI tab: "Your UPI ID", hint "You'll get a request in your UPI app. Approve it there to pay Meera."
- Big button "Send request for ₹15,000" (disabled until the checkbox is ticked)
- Hint "Agree to the plan to continue."
- Shield line: "You approve the payment in your own UPI app. PayGuard never sees your PIN. By paying you accept the terms."

The amount appears 4 times (big number, line, total, button). The word "advance" appears 4 times. "Meera" appears 7 times.

## 3. What is going wrong
1. **The client is asked to agree again, right after signing a contract. (Big)** The checkbox "I agree to the plan and what each stage includes" duplicates the contract they just signed. The button stays grey until they tick it, with a small hint far below the button. A beginner thinks "did my signature not count?". Agreeing twice is also a legal muddle.
2. **"The plan" box shows ₹60,000 next to a ₹15,000 payment. (Big)** The box lists "Logo and palette · ₹60,000". A person scanning for "how much?" sees two prices. It does not say that ₹45,000 will be paid later.
3. **Missing: what the rest costs and when. (Big)** "Advance" and "balance" are never explained together. The client does not learn "₹45,000 is due after you approve the work". People hesitate to pay when they do not know the full path.
4. **Missing: what they get for this payment. (Medium)** The page says "so they can start", but not "Meera starts work, and you will see a preview by Sat 31 Oct". The stage due date is not shown here.
5. **The payee is not clearly named. (Medium)** "You pay Meera" is good, but only the first name. The legal name and studio ("Meera Iyer Studio", UPI ID) are only visible on the QR tab. On the UPI tab the client sends a request without ever seeing who receives it. Someone who pays money wants to see a name and UPI ID first.
4b. **"Test mode: No real money moves in this prototype" sits as the first thing in the form. (Medium)** Fine for a prototype, but it is the first block the client reads and pushes everything down. It should be a small ribbon, not inside the card.
6. **PayGuard appears three times on a page where the client has not heard of it. (Medium)** "PayGuard never holds your money", "PayGuard never sees your PIN", plus the header shield. It could reassure, but with no explanation it raises the question "who are they?". It also contradicts the rule that the client side shows the studio's name.
7. **Duplicated reassurance. (Small)** Three lines say the money goes straight to Meera: the bullet "paid straight to Meera", "It goes to Meera's account", the line "You pay Meera". Say it once, near the amount.
8. **"By paying you accept the terms." has no link. (Small)** Which terms? The contract? Remove it (they signed) or link it to the contract.
9. **Heading hierarchy is upside down. (Small)** The tiny grey label "Pay your advance" is the only thing that says what this page is for; the bold heading is "Brand refresh" (the project name). The action should be the heading.
10. **No project name in the top bar, and the back button is small. (Small)** Other client pages show "Meera Iyer Studio > Brand refresh". Here the context is lost.
11. **Payment-method order and wording. (Small)** "UPI / QR code / Card" is right for India. But "Your UPI ID" next to "Send request" is two steps in one: the client enters their ID, a request appears in their app. The hint explains it, but after the field. Fine to keep, small improvement possible.

## 4. What the page should look like (information architecture)
```
Meera Iyer Studio > Brand refresh                        Dev Malhotra
------------------------------------------------------------------
‹ Back

Pay Meera ₹15,000 to start Brand refresh
This is the 25% advance. It goes straight to Meera Iyer Studio.

 Left: the summary                    Right: pay
 ┌────────────────────────────┐       Pay with  [ UPI | QR code | Card ]
 │ Advance (25%)     ₹15,000  │       Your UPI ID  [__________]
 │ Paid later        ₹45,000  │       Receipt email [prefilled]
 │ Total             ₹60,000  │       [ Send request for ₹15,000 ]
 │ ----                       │       You approve it in your UPI app.
 │ Next: Meera starts         │
 │ Logo and palette, due      │
 │ Sat 31 Oct                 │
 └────────────────────────────┘
```
- **Keep:** the two-column layout, UPI / QR / Card, the receipt email, the explanation of how a UPI request works.
- **Move:** the heading becomes the action ("Pay Meera ₹15,000 to start"). The big number can stay, but only once.
- **Remove:** the "I agree to the plan" checkbox and the disabled button state, the whole "The plan" stage list (replace with a one-line next step), the duplicate "paid straight to Meera" bullets, "Test mode" inside the card (use a small banner on the page), PayGuard mentions.
- **Merge:** the "25% advance on ₹60,000" line and "You pay Meera" total into one 3-row summary: advance now, rest later, total.
- **Visible by default:** amount, payee, three payment options, the button. **Behind a click:** the stage list ("See what's included").

## 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Heading | label "Pay your advance" + heading "Brand refresh" | "Pay ₹15,000 to start Brand refresh" | The action and the amount are the first thing read. |
| Sub line | (none) | "25% advance. It goes straight to Meera Iyer Studio." | Says what it is and who gets it. |
| Summary line | "25% advance on ₹60,000" | "Advance (25% of ₹60,000)" | Fewer words. |
| Missing line | (none) | "Paid later, after you approve: ₹45,000" | Removes surprise. |
| Total | "You pay Meera" | "Pay now" | The name is in the heading. |
| Plan box | "The plan / Logo and palette · ₹60,000" | "Next: Meera starts Logo and palette, due Sat 31 Oct" | Shows what they get, not the full price. |
| Checkbox | "I agree to the plan and what each stage includes." | remove | Already signed. |
| Bullets | "This is paid straight to Meera so they can start." / "PayGuard never holds your money. It goes to Meera's account." | one line: "Goes straight to Meera's UPI account." | One message, no brand. |
| Test banner | "Test mode: No real money moves in this prototype. Payments are simulated." | (keep, but as a thin top ribbon) | Prototype only. |
| Reassure | "You approve the payment in your own UPI app. PayGuard never sees your PIN. By paying you accept the terms." | "You approve the payment in your own UPI app. We never see your PIN." | Shorter; the terms line is removed. |
| Disabled hint | "Agree to the plan to continue." | remove | No checkbox, no hint. |
| Button (UPI) | "Send request for ₹15,000" | "Send ₹15,000 request to my UPI app" or keep | Shows where the request goes. Optional. |

## 6. Questions for the owner
- **Is a second "I agree" required for legal or product reasons?** I would pick no. The signed contract is the agreement. If a reason exists, put the checkbox on the contract page, not after it.
- **Should the client see Meera's UPI ID before paying?** I would pick yes (show "Paying to meera@okaxis" under the amount), so they can check it against what Meera told them on WhatsApp.
- **Should the app say what happens if Meera never starts?** I would pick yes, a one-line promise in the contract, not here. This is outside this screen but worth deciding.

## 7. Related screens
- **Before:** two entry points: the signed contract (`cContract`) or the "Pay ₹15,000 advance" button on the client project page (`gocheckout` with `advance`). The client expects to see this immediately after signing, so the copy should continue the story ("You signed. Now pay the advance to start.").
- **After:** a success popup "Advance paid" (`paid`) then back to the project page, where the stage reads "In progress". The client expects to know when the first preview comes. The success popup should say the due date.

---

# Screen 3: Pay the balance (`cCheckout`, kind = balance, c09)

## 1. The job of this page
**Who and when:** the client has approved a preview and wants the original files. In under 10 seconds they must know: *I am paying Meera ₹35,000 for the "Concepts" stage, and the originals open as soon as I pay.*

Smaller jobs:
1. Pay with the method they prefer.
2. Know what will unlock.
3. Know the amount is correct (and any advance already counted).

## 2. What is on the page today
**Top bar:** same as the advance page (shield icon, "Meera Iyer Studio", "Sana Qureshi", "NC" avatar).

**Left column:** "‹ Back"; label "Pay for stage 1 of 2"; heading "Concepts"; big "₹35,000"; card "Concepts ... ₹35,000" and "You pay Meera ... ₹35,000"; box "Unlocks" with "Concepts · original files" and a tick; bullets "The original files unlock as soon as the payment is confirmed." and "PayGuard never holds your money. It goes to Meera's account."

**Right column:** identical to the advance page: Test mode alert, receipt email, UPI / QR / Card, button "Send request for ₹35,000", shield line with "PayGuard never sees your PIN. By paying you accept the terms."

If an advance was paid, a line "Advance already paid  −₹15,000" appears between the stage line and the total. In project mode the heading is "Pay the balance for the whole project" and the Unlocks box lists every approved stage.

The amount appears 4 times again.

## 3. What is going wrong
1. **The same number is shown three times in a row. (Medium)** Big "₹35,000", then "Concepts ₹35,000", then "You pay Meera ₹35,000". The "Concepts" name also appears 3 times (label area, heading, summary row, unlock list). This looks like a bug, not a summary. The summary card only earns its place when there is an advance to subtract.
2. **The word "balance" is used even when there is no advance. (Medium)** In the code the kind is called "balance", and project mode shows "Pay the balance for the whole project". A client who paid nothing upfront asks "balance of what?". "Balance" only makes sense next to "advance".
3. **"Pay for stage 1 of 2" is the label and "Concepts" is the heading. (Small)** Same inverted hierarchy as the advance page. The client sees the small grey label last.
4. **The approval is not acknowledged. (Medium)** The client approved a preview a minute ago. The page does not say "You approved Concepts on 14 Oct". Seeing it closes the loop and prevents "did I really approve?" fear.
5. **The "Unlocks" list is thin. (Medium)** "Concepts · original files" with a tick. It does not say what files (names, count, size) the client will get. What you get is the main reason to pay, and it is the weakest block on the page. The preview they just saw is the best clue (a thumbnail or file names).
6. **The reminder of the advance is missing in non-project mode when the first stage has none. (Small)** Not a bug, but when the advance exists the "Advance already paid" line is the only explanation. Worth keeping.
7. **What happens after paying is not said. (Medium)** "The original files unlock" is there, but not "You will also get a receipt by email" (the receipt field is the first form field, with no explanation of why).
8. **Same Test mode, PayGuard and "accept the terms" issues as the advance page. (Medium)** See screen 2, issues 5 to 8.
9. **The `sub` text "The original files unlock when you pay" is built in `payTarget` but never shown. (Small)** It is the best sentence for this page and it is lost. (Code detail for the builder.)

## 4. What the page should look like (information architecture)
```
Meera Iyer Studio > Brand refresh                          Sana Qureshi
------------------------------------------------------------------
‹ Back

Pay Meera ₹35,000 to unlock "Concepts"
You approved it on 14 Oct. The originals open as soon as you pay.

 Left: summary                        Right: pay
 ┌────────────────────────────┐       Pay with [ UPI | QR | Card ]
 │ Concepts          ₹50,000  │       Your UPI ID [________]
 │ Advance paid     −₹15,000  │       Receipt email [prefilled]
 │ Pay now           ₹35,000  │       [ Send request for ₹35,000 ]
 └────────────────────────────┘       You approve it in your UPI app.
 You get:
  ✓ Logo_concepts_v2.pdf (preview you approved)
  ✓ 3 files, original quality
```
- **Keep:** the "Advance already paid" line (it is the reason the summary exists), the "Unlocks" idea, the two-column layout.
- **Move:** the heading to the action. The approval date goes under it.
- **Remove:** the summary card when there is no advance (just the big amount), duplicate "Concepts" lines, brand mentions, the "accept the terms" line.
- **Merge:** the label, the heading and the first bullet into one heading + one sub line.
- **Visible by default:** amount, what unlocks, payment options. **Behind a click:** nothing needed.

## 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Label + heading | "Pay for stage 1 of 2" / "Concepts" | "Pay ₹35,000 to unlock Concepts" | Action first. |
| Project mode heading | "Pay the balance for the whole project" | "Pay ₹X to unlock all your files" | "Balance" is only clear next to "advance". |
| Sub line | (unused `sub`) "The original files unlock when you pay" | "You approved this on 14 Oct. The original files unlock as soon as you pay." | Closes the loop, uses the existing sentence. |
| Summary row | "Concepts ₹35,000" (when no advance) | hide row | Avoid repeating the big number. |
| Summary total | "You pay Meera" | "Pay now" | Name is in the heading. |
| Unlock box | "Unlocks / Concepts · original files" | "You get / 3 original files" with the file names | Shows value. |
| Bullet | "The original files unlock as soon as the payment is confirmed." | merge into the heading's sub line | One message. |
| Bullet | "PayGuard never holds your money. It goes to Meera's account." | "Goes straight to Meera's UPI account." | No brand. |
| Reassure | "...PayGuard never sees your PIN. By paying you accept the terms." | "You approve the payment in your own UPI app. We never see your PIN." | Shorter. |

## 6. Questions for the owner
- **Should payment screens show file names before the client pays?** I would pick yes, names and count only (no thumbnails, no download). It builds trust that the right thing unlocks. The risk is leaking too much for a client who might not pay; names are low risk.
- **Is "Test mode" part of the real client experience in beta?** I would pick a thin ribbon at the very top of the page, not a card inside the form.
- **Do you want one pay button wording for all methods?** I would pick the current approach (each method has its own wording) because it matches what happens next.

## 7. Related screens
- **Before:** the "Awaiting payment" page on `cProject` (status approved): hero "Pay ₹35,000 to unlock the originals", button "Pay ₹35,000". The client expects the checkout to repeat exactly that amount and that promise. Today it does, but with a different heading ("Pay for stage 1 of 2"). Make the two headings match.
- **After:** the "Unlocked" popup and then the project page with "Your files", Download all, Documents, Receipt and contract. The client expects to land on the files immediately, with the receipt one click away. The popup should end with a "See my files" button.

---

# Cross-screen findings (invite and both checkouts)
- **Branding.** `clientTop()` shows the PayGuard shield icon as if it were the studio logo, and "PayGuard" appears in 2 to 3 sentences on each page. The side panel uses the studio's own "MI" logo. Make it one consistent studio logo (initials in a coloured tile) and show "PayGuard" nowhere, or once in a quiet footer.
- **Freelancer-only info.** I found no money fee, net amount, or other freelancer-only number on these three screens (`inr(net)` is only used in the freelancer's `sProject`). The checkout shows the client only their own amounts. Good: keep it. The only leak is branding and prototype wording ("Test mode", "Prototype: simulate the payment" on the QR tab, a pre-filled test card number).
- **Words.** The page uses "advance", "balance", "stage", "originals" (as "original files"), "preview", "unlock". Use "balance" only when an advance exists. Use "the rest" in plain sentences.
- **Context.** The checkout screens drop the crumbs ("Meera Iyer Studio > Brand refresh") that the invite and contract pages show. Add them back.
- **Repetition.** Money is stated 3 to 4 times per page, "straight to Meera" 3 times, and the stage name 3 times.

---

# Top 5 things to fix on these screens
1. **Cut "How it works" from 7 bullets to 4 short steps, and put the rules behind a click** (invite). It is the biggest wall of text the client meets.
2. **Show the money plainly on the invite: total, advance now, rest later** (invite), and show the same "advance now, rest later" on the advance checkout.
3. **Remove the second "I agree to the plan" checkbox and the disabled button on the advance checkout.** The client already signed.
4. **Remove PayGuard from the client's screens** (shield icon in the header, "PayGuard never holds your money", "PayGuard never sees your PIN", "accept the terms"). Use the studio's logo and say "straight to Meera".
5. **Make the heading the action with the amount** ("Pay Meera ₹15,000 to start Brand refresh", "Pay ₹35,000 to unlock Concepts"), say who gets it, and stop repeating the same number and stage name 3 times; add what they get (the next step, or the file names).
