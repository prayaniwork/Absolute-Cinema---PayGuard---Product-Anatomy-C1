# 14. Words and status labels across PayGuard

Scope: every user-facing status word, badge, button, toast, log line and heading in `prototype/nazar/app.js` (statuses at lines 166, 173-174, 1106; attention strings 251-281; dashboard 626-636 and 761-777; payments 876-900; stage pages 1066-1100 and 1280-1315; modals 1370-1392; log lines 399-475, 1614-1736).

How money really moves (the test for every word): the client pays the freelancer directly (UPI, QR or card). PayGuard holds nothing and takes no fee. PayGuard only holds the **originals** (the real files) and unlocks them. So any word that sounds like "PayGuard has the money" or "PayGuard sends the money" is wrong.

---

## 1. The big picture in plain words

The product has **one hidden status list** (8 values in code: draft, funded, submitted, changes, approved, released, dispute, refunded). The screens then show those 8 values with **at least 3 different sets of names**, and add **extra names on top** (attention texts, "Advance due", "Awaiting signature", "Closed"). A beginner sees a different word for the same moment depending on which page they are on.

Also: a code comment at line 164 still says "Not funded, Funded". "Funded" is leftover escrow language (money in, then work starts). It no longer matches reality. The word does not show on screen, but the internal names (`funded`, `moneyBuckets().held`) show the old thinking has not been cleaned up, and it is why some labels are odd (see "Awaiting payment" below).

---

## 2. Same idea, many words (the main table)

### 2a. Stage status (what state is one stage in?)

| Moment in real life | Freelancer sees | Client sees | Other places | Problem |
|---|---|---|---|---|
| Stage has not begun, waiting on the previous stage | "Not started" (badge, payments filter) | "Not started" | STI pill "Not started" | OK, consistent |
| Stage 1, contract not signed yet | "Awaiting signature" (badge) and "Waiting for signature" (Today row) and "Waiting for Rahul to sign the contract." (stage page) and "Signature 2 days late" | the same "Not started" or a signing page | Contract card: "Waiting" next to client name | 4 wordings for one thing: **Awaiting / Waiting for / Waiting**. Also the badge says "Awaiting" but the Today row says "Waiting" |
| Stage 1, contract signed, advance not paid | "Advance due" (badge) and "Waiting for advance" (Today row) and "Advance 2 days late" | "Advance due" (badge) and "Pay Rs X to start" | | "Advance due" reads as "**you** owe the advance" on the freelancer side. The freelancer is the one waiting. Same badge text, opposite meaning (see section 3) |
| Freelancer is working | "In progress" | "In progress" | Code comment says "Funded" | OK on screen. Old name is "Funded" |
| Freelancer sent a preview | "In review" | "Awaiting your approval" (client stage header) and "Review" (tab name) | Today: "Awaiting approval", "Approval 2 days late" | **In review / Awaiting approval / Awaiting your approval / Review** for one moment. Freelancer and client even use different names |
| Client asked for changes | "Changes requested" (badge) | "Changes requested" | STI pill: "Changes" (short); client page text: "Changes in progress"; Today row: "Changes requested . round 1 of 3" | Mostly OK. STI pill says "Changes" only. Client sees "Changes requested" even though the freelancer is the one working: it reads as if the client still has to do something |
| Client approved, balance not yet paid | "Awaiting payment" | "Awaiting payment" (client sees it too!) | Today: "Awaiting payment", dashboard card "Awaiting payment", payments card "Awaiting payment", filter "Awaiting payment", trail text "approved. Awaiting payment." | One phrase, but two meanings and two audiences (section 3) |
| Client paid, originals open | "Unlocked" | "Unlocked" | Receipt stamp "UNLOCKED", log "Originals unlocked", payments card "Paid to you", filter "Unlocked", receipt "Paid" | Status says **Unlocked** but money pages say **Paid**. They are the same moment but different ideas (paid vs unlocked), see below |
| Freelancer waived payment | "Unlocked" (same as paid) | "Unlocked" | Receipt: "Unlocked by Asha without payment" | Same badge as a paid stage. In the Payments table it counts as "Paid to you" if you read the stat cards, but it was not paid. Small |
| Client reported a problem | "On hold" | "On hold" | Today: "Rahul reported a problem" | "On hold" is vague: on hold **what**? (the approval). Call it "Problem reported" |
| Freelancer refunded | "Refunded" | "Closed" | Toast "Refund sent", "You were refunded" | **Refunded vs Closed**: two words, and "refund" is not even possible in a no-money-held product (section 3) |

### 2b. Project status (a whole project, shown in lists and the dashboard)

| Where | Words |
|---|---|
| Project label (`projStatus`) | "Needs you", "Waiting", "On track", "Done" |
| Code comment | "Needs you, Waiting on client, On track, Complete" (so "Complete" in comment, "Done" on screen) |
| Today tabs | "Needs you", "Waiting", "Coming up" |
| Today fold | "Waiting on clients" (fold) vs "Waiting" (tab) vs "Waiting" (stat card) vs "Waiting on the client" (payments) |
| Board columns (line 734) | "Not started, In progress, In review, Changes requested, Awaiting payment, On hold, Done": this is the **stage** list used as the **project** list |

Problem: a project has three different vocabularies (attention bucket, stage-status board, "On track"). "On track" means nothing is needed from anyone, but it sits next to "Waiting" which also means nothing is needed from you. A beginner cannot tell "On track" from "Waiting".

### 2c. Words for "somebody has to do something and it is late"

"Signature 2 days late", "Advance 2 days late", "Payment 2 days late", "Approval 2 days late", "Delivery 2 days late". Good pattern, consistent. Keep it. But the **non-late** versions are inconsistent: "Waiting for signature", "Waiting for advance", "Awaiting payment", "Awaiting approval", "Due tomorrow". Pick one: "Waiting for X".

### 2d. Words for the money moments

| Idea | Words used today | Count of different words |
|---|---|---|
| Money the client must pay now | "Awaiting payment", "Balance due", "Balance after approval", "Pay Rs X", "Pay now", "Payment due" | 6 |
| Money the client paid first | "Advance", "Advance (30%)", "Advance paid earlier", "Advance already paid", "Advance before work starts" | 5 variants of one word (fine, the root word is the same) |
| Money paid in full | "Paid", "Paid to you", "Balance paid", "Paid, originals unlocked", "X paid you directly", "You received", "You paid" | 7 |
| Money coming in later | "Expected, next 30 days", "Expected" | 2 |
| Money in stages not yet approved | "In progress" (payments stat card, shows rupees), "Work under way" | 2 |

---

## 3. Words that mean different things on each side

| Word | Freelancer side meaning | Client side meaning | Why it is a problem |
|---|---|---|---|
| **Advance due** | "I am waiting for the client to pay" (it is a status of **my** stage) | "I must pay now" (a call to action) | Same badge, opposite person is on the hook. Freelancer should read "Waiting for advance" |
| **Awaiting payment** | "The client owes me" | "I owe the freelancer" | One word, two roles. The client badge should be a call to act: "Pay now" or "Payment due". It also appears on the client side when payment is **not yet due** (project pays once after the last stage), where it is wrong |
| **Awaiting approval / In review** | "Waiting for the client" (passive) | "Your turn" (active) | Fine if each side gets its own name (see glossary) |
| **Changes requested** | "The client wants changes: your turn" | "I asked for changes: freelancer's turn" | Same label, opposite turn. Client should see "Changes sent" or "With Asha for changes" |
| **In progress** | "I am working" | "Asha is working" | Fine, same truth |
| **On hold** | "The client reported a problem; I must reply" | "I reported a problem; waiting" | Vague on both sides |
| **Paid to you** | Payments card | (never shown) | Fine as a freelancer-only word. But it also counts advance, and a waived stage is not "paid" |
| **Unlocked** | "The client can open the originals" | "I can open the originals" | Fine. The one word that is truly shared |
| **Expected** | "Money I should get" | (never shown) | Fine as long as the client never sees it |
| **Closed / Refunded** | "Refunded" | "Closed" | Different words on each side for the same event |
| **Waiting** | Project label "Waiting" = waiting on a client | Contract card "Waiting" = client has not signed | Same word, different thing in the two places |

---

## 4. Money words: would a beginner understand, and is it true?

| Word | Beginner understands? | True for PayGuard? | Verdict |
|---|---|---|---|
| **Advance** | Mostly. "Advance" can be confused with "advance payment to PayGuard" | True. Paid straight to the freelancer | Keep. Always add "to {Name}" the first time. Never "advance paid to PayGuard" |
| **Balance** | Medium. People ask "balance of what?" Some read it as "account balance" | True in meaning (rest of the stage price after the advance) | Replace with "Remaining" or "Rest of payment". The brief says use plain words |
| **Awaiting payment** | Medium. Passive and vague: who is awaiting what from whom? | **Not fully true.** On the Today dashboard it sums stages that are approved and not yet paid, but its helper text says "Approved, not yet paid" and its internal name is `held`, an escrow idea. In project-pays-once mode the client does not owe anything yet, but the stage still says "Awaiting payment" | Rename: freelancer "Client owes you", client "Pay now" |
| **Paid to you** | Mostly. It was one of the confusing words in testing | True (client pays directly). But it adds advances and includes waived stages by mistake | Rename "Received" and make it count only real money. Show "Advance" and "Remaining" as the parts |
| **Expected, next 30 days** | Medium. "Expected" by whom? Based on due dates, not on a promise | **Partly false.** It adds every stage that is not closed and due in 30 days, including stages the client has already approved (also counted in "Awaiting payment"), so the two cards double count. Not a real forecast | Rename "Coming in (next 30 days)" and count only not-yet-approved stages, or drop the card |
| **Funded** | Not on screen. Beginners would think "client put money into PayGuard" | **False.** PayGuard holds nothing | Remove from code and comments. Never use |
| **In progress (money card)** | Confusing: a money card named like a work status | Shows full stage price, not a payment | Rename "Work in progress" with caption "Not yet approved" |
| **Payments page "Amount"** | Full stage price shown in the row, but the client only pays the **remaining** part after an advance. The two numbers do not match the "Awaiting payment" card | True but incomplete | Show "Remaining" per row; show the full price in the stage detail |
| **Refund, "Refund sent", "Refunded", "Includes their share of the fee"** | Understood | **False.** PayGuard holds nothing, takes no fee, and cannot send money back. The refund modal even says "Includes their share of the fee" and calls `fees()` (which returns zero). A freelancer has to refund outside PayGuard | Remove the word. Use "Cancel stage" (client keeps the previews, no originals). If money was paid, tell them "Send the money back yourself" |
| **Held** (code name `b.held`, `moneyBuckets`) | Not on screen | Wrong idea | Rename in code to `owedNow` |
| **Unlocked / Unlock** | Mostly. Good, new, and PayGuard's own idea | True | Keep. Define once: "Unlocked means the client can download the originals" |
| **Unlock anyway / Unlock without payment** | Clear | True | Keep. "Unlock anyway" button is vague: use "Unlock without payment" on the button too |
| **Mark as paid / Mark as paid another way** | Clear | True, this is how a freelancer records a direct payment | Keep. Use "Mark as paid" (drop "another way" where a payment already came in a different way, or explain it once) |
| **PROOF OF DELIVERY / PAYMENT SUMMARY / RCT-id** | OK | "Receipt" wording: PayGuard does not issue receipts, the freelancer does, but "PAYMENT SUMMARY" is safe | Keep "Payment summary"; avoid "Receipt" unless it says "from {Studio}" |
| **"Waiting for payment..."** (QR screen, line 1269) | Fine | Truthful | Keep |

---

## 5. Other vocabulary inconsistencies

| Where | Now | Issue | Fix |
|---|---|---|---|
| Toasts: "Advance marked as paid" "Work can start." | Good | Keep | |
| Toast: "Marked as paid" "The originals are unlocked for Rahul." vs "Originals unlocked" "Rahul can download them now." | Two toasts, almost the same idea | Keep one pattern: "Marked as paid. Originals unlocked." |
| Toast: "Sent to Rahul" vs "Sent to Asha" vs "Sent for review" (button) vs "Send to Asha" (client) vs "Preview and send" (step) | "Send for review", "Send to X", "Submit" (log: "Submitted ... for review") | 3 verbs for one action: send / submit / deliver ("Delivered for review" in proof) | Use **send**. Log: "Sent X for review" |
| "Delivery 2 days late" / "Delivered for review" / "Upload" | "Delivery" means sending the preview in Today but "Delivered" means the preview is sent in proof, while originals are what finally get delivered | Rename "Preview 2 days late" |
| "Approve" vs "approved automatically" | OK | Keep |
| "Stage" vs "milestone" | Code uses `ms`, UI says "stage" | Good, keep |
| "Originals" vs "original files" vs "the real files" | "Originals" (log, modals), "original files" (client), "Your original files are unlocked" | Fine, but pick "originals" in short copy and "original files" in sentences |
| "Preview" vs "watermarked preview" | Mixed | Fine; "watermarked" once, then "preview" |
| "Round of changes" / "rounds" / "change round" / "revisions" | "round of changes", "Add a change round", "Round 1 of 3", `m.revisions` | Mixed; use "round" | "Ask for changes (2 left)" is good, keep |
| "Problem" / "Report a problem" / "issue" / "dispute" | UI says "problem"; code and one modal comment say "issue"/"dispute"; client link text "Report a problem" and button "Report problem" | Pick "Report a problem" everywhere |
| "Remind" / "Reminded" / "Reminder ready" / "Automatic reminder sent" | Good | Keep. Make sure the log and toast never say "Nudged" |
| "Documents" | Button opens Receipt / Invoice / Contract in tabs | Calling a payment summary "Documents" is vague | OK if it is the only entry point; label "Contract and receipt" |
| "Client link" vs "Project created" | Modal title changes with state | Fine |
| "Today", "Clients", "Calendar", "Payments", "Settings" | Navigation | Good, short |
| "Coming up" (Today tab) | OK | Keep |
| "Stage 1 of 4" client | Good | Keep |
| "Current stage / All stages / Contract / Review" (client tabs) | The first tab renames itself to "Review" when a preview is waiting. Same tab, two names | Keep "Current stage" always |
| Log: "Created X with 4 stages and signed the contract" | Freelancer signs at creation | OK |
| Log: "Reminded Rahul by WhatsApp" | Good | Keep |

---

## 6. The proposed vocabulary

### 6a. Glossary (short, one sentence each)

| Word | Meaning (one sentence) |
|---|---|
| **Project** | The whole job for one client, made of stages. |
| **Stage** | One part of a project with its own price, due date and files. |
| **Contract** | The agreement both sides sign before work starts. |
| **Preview** | A watermarked copy of the work that the client can look at but not use. |
| **Originals** | The real, final files without a watermark. |
| **Send** | The freelancer gives the client a preview to review. (Not "submit", not "deliver".) |
| **Approve** | The client says the preview is good. It does not unlock anything by itself. |
| **Ask for changes** | The client sends notes on a preview; it uses one round. |
| **Round** | One go at changes; each stage has a limit. |
| **Advance** | An optional payment the client makes before work starts, paid straight to the freelancer. |
| **Remaining** | What the client still owes for a stage after any advance. (Replaces "Balance".) |
| **Pay** | The client sends money straight to the freelancer by UPI, QR or card; PayGuard never touches it. |
| **Mark as paid** | The freelancer records that they got money some other way. |
| **Unlock** | PayGuard lets the client download the originals. It happens when the remaining amount is paid, or when the freelancer chooses to unlock early. |
| **Report a problem** | The client pauses approval and tells the freelancer what is wrong. |
| **Cancel stage** | End a stage without finishing it. PayGuard moves no money; the two sides settle it themselves. (Replaces "Refund".) |
| **Reminder** | A message to the client by WhatsApp or email. |

Words to retire: **Funded, Balance, Held, Escrow, Refund, Released, Submit, Deliver, Dispute, Awaiting** (use "Waiting for"), **Closed**, **Expected**.

### 6b. Stage status names (final)

One rule: **the badge names what the stage is doing, written from the point of view of the person looking.** Two separate lists. When it is the other person's turn, the badge starts "Waiting for...". When it is your turn, it is a verb.

| Real moment | Freelancer sees | Client sees |
|---|---|---|
| Waiting on an earlier stage | **Not started** | **Not started** |
| Contract not signed (stage 1) | **Waiting for signature** | **Sign the contract** |
| Advance requested, not paid (stage 1) | **Waiting for advance** | **Pay advance** |
| Freelancer working | **In progress** | **In progress** |
| Preview sent | **Waiting for approval** | **Review preview** |
| Client asked for changes | **Changes requested** | **Changes sent** |
| Approved, remaining amount not paid yet | **Waiting for payment** | **Pay now** (or **Pay at the end** when the project pays once) |
| Paid and originals open | **Unlocked** | **Unlocked** |
| Problem reported | **Problem reported** | **Problem reported** |
| Stage cancelled | **Cancelled** | **Cancelled** |

Late versions keep the existing pattern: "Waiting for signature . 2 days late", "Payment 2 days late", "Preview 2 days late". Lateness stays text plus a red dot, as the code comment already says. Do not add status words for lateness.

Money language on cards uses the same words: **Remaining** (what a client owes), **Received** (what the freelancer has actually got), **Coming in** (not yet approved, due in 30 days).

### 6c. Project status names (final)

Project status answers one question: **whose turn is it?** Four words, same on the dashboard, project list and board.

| Name | Meaning | Today's name |
|---|---|---|
| **Needs you** | Something is waiting on the freelancer (changes requested, problem reported, preview due or late, anything late). | Needs you |
| **Waiting on client** | Everything is with the client (signature, advance, approval, payment). | Waiting |
| **Working** | Freelancer is working and nothing is late. | On track |
| **Finished** | Every stage is unlocked or cancelled. | Done |

The Board view should group by this project status, not by the 7 stage statuses.

Client side shows no project status (they only see their one project). Freelancer's studio name appears, never "PayGuard".

---

## 7. Questions for the owner

1. **Refunds.** I would remove refunds and the word "Refund" entirely, replace with "Cancel stage", because PayGuard cannot move money. Is there any real plan for PayGuard to ever hold money? If yes, the current refund text could stay for later.
2. **Client badge words.** I propose the client side uses action words ("Review preview", "Pay now") and the freelancer side uses waiting words. Do you want the client's badge to read as a task, or stay neutral like the freelancer's? I would pick tasks, because clients visit rarely and need to know what to do.
3. **"Unlocked" for a waived stage.** I would keep the same badge but add a small note "Unlocked without payment" so the payment cards are not wrong. OK?
4. **"Expected / Coming in" card.** I would drop it on the Payments page (it double counts) and keep it only on Today. Is a forecast needed at all in the beta?

---

## 8. Top 5 things to fix in the words

1. **Choose two lists, not one.** One status list for the freelancer and one for the client ("Waiting for payment" vs "Pay now"), because the same label today means "I owe" to one person and "they owe me" to the other (Advance due, Awaiting payment, Changes requested).
2. **Kill "Refund", "Funded", "Held", "Balance", "Expected" and "Closed".** They imply PayGuard holds money. The refund modal even mentions "their share of the fee", which is false. Replace with Cancel stage, Remaining, Received, Coming in.
3. **Make the money cards add up.** "Awaiting payment", "In progress", "Paid to you" and "Expected" overlap, and a stage's full price is shown where the client only owes the remaining part. Show one set: Remaining owed to you, Work in progress, Received.
4. **One word per action: send, not submit/deliver; "Waiting for" not "Awaiting"; "Report a problem" not issue/dispute.** Fix the toasts, log lines and button labels to match.
5. **Rename project status to "whose turn is it": Needs you / Waiting on client / Working / Finished.** Use the same four on Today, the project list and the board. Drop "On track" and the stage-style board columns.
