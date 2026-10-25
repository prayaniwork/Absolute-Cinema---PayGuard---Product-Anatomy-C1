# Audit 09: The popups (modals)

A "popup" here means a box that appears on top of the page and greys out everything behind it. The code calls it a modal. I looked at five screenshots and every branch of `modalHTML` in `prototype/nazar/app.js`.

I split the 16 popups into five groups, because the questions are different for each:

1. Project created / Client link (freelancer)
2. Remind (freelancer)
3. Documents: Receipt, Invoice, Contract (both sides)
4. Client decisions: Approve, Ask for changes, Approved, Report a problem, Extra round (client)
5. The rest: Reply to problem, Unlock without payment, Preview as client, Edit client, Advance paid, Unlocked / paid, Refund (mixed)

## First, the big picture

Popups are for short, one-question moments: "Are you sure?", "Pick one", "Copy this". Some of PayGuard's popups do that well. Others hold whole pages (Documents, Preview as client, Edit client). Those are pages wearing a popup costume. They can't be linked to, they can't be reopened after a refresh, and they cover the page the person was just using.

What already works and should be kept:
- The **Approve** popup says what you are approving, lists "What's included", says "You can't undo this", and the buttons are "Not yet" and "Approve". Two clear buttons, honest about consequences.
- **Unlock without payment?** says what happens and that you can't lock again.
- **Remind** puts the message in front of the freelancer to edit before it is sent. Good: nothing is sent behind their back.
- Every popup closes with Cancel or a click outside it.

---

## 1. Project created / Client link

### 1. The job of this page
The freelancer has just finished setting up a project and signing the contract (or has clicked "Client link" later). In under 10 seconds they must be able to get the link to their client.

Smaller jobs, in order:
1. Copy the link.
2. Send it by WhatsApp or email.
3. Understand what the client will do with it (sign the contract).

### 2. What is on the page today
Screenshot `f26-modal-invite.png`.
- Title: "Project created" (when new) or "Client link" (when opened from the top-right button).
- Line: "Share this link with Dev. No account needed."
- A read-only box with `payguard.app/p/xexnujs17` and a "Copy" button.
- Two buttons: "Send by WhatsApp or email" (outline) and "View as Dev >" (black, the main button).
- Behind it: the project page, with "Awaiting signature", "Waiting for Dev to sign the contract." and a "Remind Dev" button.

### 3. What is going wrong
1. **The main (black) button is the wrong one.** What you see: "View as Dev" is the loudest button. Why it confuses: the job is to get the link to Dev. "View as Dev" is a test-the-product shortcut, not a real step. A beginner reads it as "this is the next thing I must do." Big.
2. **The popup never says why the link matters.** It says "Share this link with Dev" but not "Dev must sign the contract before you can start." The user test said waiting for the signature should be the obvious first step. This is the moment to say it. Big.
3. **"Send by WhatsApp or email" does not send.** It opens a second popup (Remind) where you pick WhatsApp or Email, edit the message, then click again ("Open WhatsApp"). That is three clicks for one job, and the second popup is titled "Remind Dev" for something that is not a reminder yet. Big.
4. **Two titles for one popup.** "Project created" and "Client link" are the same popup with a different title. "Project created" is good news but the person came to copy a link; "Client link" is a label, not a sentence. Small.
5. **Another popup stacking on top of a page that already has the same job.** The page behind has "Remind Dev", "Link not opened yet", "Client link" (top right) and this popup. Four ways to do one thing. Medium.
6. **Closing it leaves the user unsure.** There is no Close or Done button and no X. Only clicking outside or pressing the grey area closes it. Medium.
7. **It says nothing about what the client sees.** The client sees the studio name, never PayGuard. The link text itself says `payguard.app`, which is fine for a link, but the user is not told what Dev will see when they open it. Small.

### 4. What the page should look like (information architecture)
Keep: the link box and Copy button. Keep: "No account needed".
Move: "Send by WhatsApp or email" into this popup as two direct buttons (see sketch). Move "View as Dev" to a small text link at the bottom.
Remove: the black "View as Dev" as the main button.
Merge: this popup and the Remind popup's first use. One "Send the contract link" experience.

```
+-------------------------------------------+
|  Project created. Now send Dev the link.  |
|  Dev signs the contract, then you can     |
|  start. No account needed.                |
|                                           |
|  [ payguard.app/p/xexnujs17 ] [ Copy ]    |
|                                           |
|  [ Send on WhatsApp ] [ Send by email ]   |
|                                           |
|  Done                    See what Dev sees|
+-------------------------------------------+
```
Visible by default: title, one-line reason, link, two send buttons, Done. Hidden behind a click: the message text (shown when you tap WhatsApp or email, as it is today in Remind).

### 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Title (new) | Project created | Project created. Send Dev the link. | Says the next step |
| Title (later) | Client link | Dev's link | Plain, and uses their name |
| Line | Share this link with Dev. No account needed. | Dev uses this link to read and sign the contract. No account needed. | Says what the link is for |
| Button | Send by WhatsApp or email | Send on WhatsApp / Send by email (two buttons) | One tap, no surprise second popup |
| Button | View as Dev | See what Dev sees (text link) | It is a preview, not a step |
| Missing | (no close) | Done | Clear way out |

### 6. Questions for the owner
- Should "View as Dev" exist for real users, or only in the prototype? I would keep it as a small link: freelancers like to check what the client sees before sending.

### 7. Related screens
Before: the contract setup / "Sign and create project" step. The user expects to see "now what?" After closing: the project page, which shows "Awaiting signature" with a "Remind Dev" button. The user should land there with the same message ("Waiting for Dev to sign"), which it does. Good.

---

## 2. Remind

### 1. The job of this page
The freelancer wants to nudge a client who has not done something (sign, approve, pay the advance, pay the balance). In under 10 seconds: see a ready message and send it.

Smaller jobs:
1. Pick WhatsApp or email.
2. Check or edit the message.
3. Know whether it reached them.

### 2. What is on the page today
Screenshot `f27-modal-remind.png`.
- Title "Remind Meher". Sub-line "Saffron Hotels · Logo refresh".
- Two tabs: "WhatsApp" (selected) and "Email".
- Label "Message to +91 98200 1063", a text box: "Hi Meher, a quick reminder about the ₹15,000 advance for Logo refresh so I can start: payguard.app/p/bpbk3iz  Thanks, Meera".
- Buttons: "Cancel" and "Open WhatsApp".
- Behind: the Today page, with the Saffron Hotels row and a bell icon next to each client.

### 3. What is going wrong
1. **The popup does not say what the reminder is about.** Only the message text tells you ("the ₹15,000 advance"). The title says "Remind Meher", the sub-line says project name. A beginner who clicked a bell on a row with five things going on cannot tell which problem this reminder fixes. Big.
2. **"Open WhatsApp" is not "send".** The user thinks they are sending. A new tab opens and they must press send there. If they close that tab, PayGuard has still logged "Reminded Meher" and shows "Reminder ready in WhatsApp". Why it confuses: the log says a reminder happened that may not have. Big.
3. **The popup is the same for four different jobs.** Signing, approving, advance, and paying all use the same popup titled "Remind". The code (`remindText`) writes four different messages, but the user is never told which one they got. The fifth case ("an update on...") is a catch-all with no ask in it. Medium.
4. **Tabs look like a setting, not a choice.** "WhatsApp / Email" is a toggle, and "Email" is disabled when there's no phone, with a small note "No WhatsApp number. Add one in Edit client." that points to another popup the user may not find. Medium.
5. **The WhatsApp text is also used for the email body.** An email needs a subject and a more formal tone. The subject is built from the project name and the studio's business name, not shown to the user. Small.
6. **Where else does a reminder live?** A "Remind" appears on the Today list (bell icon), on the project page ("Remind Dev"), and in "Send by WhatsApp or email" from the Client link popup. The same popup serves all three, which is good for consistency, but the button name changes each time. Medium.
7. **The link in the message says `payguard.app`.** This is what the client reads in WhatsApp. It is fine as a URL, but the message is from "Meera" and the client sees a PayGuard domain with no explanation. Product rule is the client sees the studio name, not PayGuard. Small, and a question for the owner.

### 4. What the page should look like (information architecture)
Keep: editable message, WhatsApp or email choice, Cancel.
Move: the reason into the title ("Remind Meher to pay the advance").
Merge: the three entry points use one popup, title always names the ask.
Remove: the catch-all "an update on" message. If there is nothing to remind about, don't show the bell.

```
+-----------------------------------------+
| Remind Meher to pay the ₹15,000 advance |
| Saffron Hotels · Logo refresh           |
|                                         |
| Send by: (WhatsApp) (Email)             |
| To: +91 98200 1063                      |
| +-------------------------------------+ |
| | Hi Meher, a quick reminder ...      | |
| +-------------------------------------+ |
| Opens WhatsApp. You press send there.   |
|                                         |
| Cancel                [Open WhatsApp]   |
+-----------------------------------------+
```
Visible by default: reason title, channel, message. Hidden: nothing needed.

### 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Title | Remind Meher | Remind Meher to pay the advance (or: to sign, to approve, to pay) | Says what for |
| Label | Message to +91 98200 1063 | To +91 98200 1063 | Shorter; the box below is the message |
| Button | Open WhatsApp | Open WhatsApp to send | Makes clear you press send there |
| Toast | Reminder ready in WhatsApp | Opened WhatsApp. Press send there. | Does not claim it was sent |
| Hint | No WhatsApp number. Add one in Edit client. | No WhatsApp number for Meher. Use email, or add a number from the client page. | Gives an option |
| Message | an update on {project} | (remove) | No ask, nothing to remind |

### 6. Questions for the owner
- Should PayGuard record "Reminded" only when the freelancer confirms they sent it? I would not log it as done; I would log "Opened WhatsApp" because PayGuard can't know.
- Should reminder links say `payguard.app`? I would keep it for now (it is a real link), but plan a studio-branded domain later.

### 7. Related screens
Before: Today (the bell on a row), the project page ("Remind Dev"), and the Client link popup. After closing: the user goes back to where they were. They expect the row to show "Reminded today", which the app does track via `remindedAt`. Good.

---

## 3. Documents (Receipt, Invoice, Contract)

### 1. The job of this page
Either side, after a stage is paid (or after signing), wants proof: "What did I pay / get paid, and what did we agree?" In under 10 seconds: see the receipt or download it.

Smaller jobs:
1. Download one document or all.
2. Switch between receipt, invoice, contract.
3. Check dates (started, delivered, approved, paid).

### 2. What is on the page today
Screenshot `f28-modal-receipt.png`.
- Title: the stage name ("Final deck"), sub-line "Orbit Labs". An X in the corner.
- Three tabs: "Receipt", "Invoice", "Contract".
- A paper-like sheet: "PAYMENT SUMMARY", "RCT-A9II", "Paid 21 Oct 2026", a green stamp "UNLOCKED", "Paid by Neha Kapoor", "Paid to Meera Iyer Studio", "How: UPI, QR or card, straight to Meera", "Final deck ₹20,000", "Balance paid ₹20,000", "Started → delivered → approved → paid → originals unlocked."
- Then "PROOF OF DELIVERY": "Files: See the contract scope", "Work started 10 Oct 2026", "Delivered for review —", "Approved —", "Paid, originals unlocked 21 Oct 2026".
- Buttons: "Download this", "Download all three", "Close".
- Behind: the project page, which already has a "Contract" tab and a "Documents" button on other pages.

### 3. What is going wrong
1. **The popup title is the stage name, not what the thing is.** "Final deck" tells you nothing about "this is a receipt". The tab says "Receipt" but the first thing you read is a stage name. Medium.
2. **Blank dashes in the proof.** "Delivered for review —" and "Approved —" appear blank next to a stage marked "Unlocked". A receipt with holes looks broken and weakens trust. This is likely because the test data was jumped straight to paid, but a real "freelancer unlocked early" stage will also have blanks. Big.
3. **"Files: See the contract scope"** is not an answer. A proof of delivery should list what was delivered (file names). Medium.
4. **Same words, different meaning: "Paid".** The receipt says "Paid by Neha Kapoor", "Balance paid", "Paid, originals unlocked". But PayGuard does not move money. The client says they paid and the freelancer confirms (or the freelancer unlocks free). Calling it a payment receipt from PayGuard may be read as PayGuard proving the payment. Big (a trust and legal-feel risk).
5. **A whole contract inside a popup.** The Contract tab here repeats the Contract tab on the project page and the contract popup (`t: 'contract'`) shown elsewhere. Three places for one document. Big (matches the user test finding: the same details again and again).
6. **Three document names and a button "Download all three".** The user has to know the three are receipt, invoice, contract. "Download this" changes meaning depending on the tab. Small.
7. **Receipt number "RCT-A9II"** looks like a typo (capital I, I and 9). It is random. Small.
8. **Entry points are named differently.** The same popup opens from "Documents", "Receipt and contract", and a receipt link elsewhere. Medium.
9. **It is wide, scrolls, and contains a lot.** A popup that scrolls is a page. Medium.

### 4. What the page should look like (information architecture)
Keep: the three kinds of document, "Download", the stamp, plain-language path "Started → delivered → approved → paid → originals unlocked".
Move: the contract out of here. Keep one Contract place per project (the Contract tab) and link to it.
Merge: receipt and invoice if they carry nearly the same numbers. If both must exist, say why: the invoice is what the freelancer sends for their records (GST), the receipt is proof the client paid.
Remove: dash rows. Only show a line if there is a date.

Choice of container: this is a small document viewer. A popup is acceptable if it is short and has a Download button. If you keep all three tabs, make it a proper page under the project ("Documents") instead of a popup.

```
+--------------------------------------------+
| Receipt for Final deck              [X]    |
| Orbit Labs                                 |
| (Receipt)  Invoice  Contract               |
| +----------------------------------------+ |
| | RECEIPT  RCT-0021       [UNLOCKED]     | |
| | Neha Kapoor paid Meera Iyer Studio     | |
| | ₹20,000 on 21 Oct 2026                 | |
| | Paid directly (UPI, QR or card)        | |
| | What you got: Final deck.pdf, ...      | |
| | Timeline: started 10 Oct, unlocked 21  | |
| +----------------------------------------+ |
| [ Download ]                      [ Close ]|
| More: Download receipt, invoice, contract  |
+--------------------------------------------+
```

### 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Title | Final deck | Receipt: Final deck | Says what this is |
| Row | PAYMENT SUMMARY | RECEIPT | Same word as the tab |
| Row | How: UPI, QR or card, straight to Meera | Paid directly to Meera by UPI, QR or card | Plainer |
| Row | Balance paid | Paid | "Balance" is an accounting word |
| Row | Files: See the contract scope | (list file names) | Shows what was delivered |
| Rows | Delivered for review — / Approved — | (hide when empty) | Blank lines look broken |
| Note | Paid, originals unlocked | Originals unlocked | One idea per line |
| Button | Download all three | Download receipt, invoice and contract | Names the three |
| Button | Close | Done | Matches other popups |

### 6. Questions for the owner
- Does PayGuard want to issue "receipts" at all, if it never touches the money? I would call it "Payment record" or "Receipt (confirmed by Meera)" so it is clear PayGuard is not the one confirming.
- Are Invoice and Receipt both needed? I would keep both only if GST invoices are a real need for the freelancer.

### 7. Related screens
Before: the "Unlocked" moment (the Unlocked / paid celebration popup has a "Documents" button) and the stage card on the project page. After closing: back to the stage. The user expects to still see where the files are. This is where the "files live in the stage" finding applies.

---

## 4. Client decisions (Approve, Ask for changes, Approved, Report a problem, Add a round)

These are the client's moments of choice, so they need the most care. Screenshots `c06-approve-modal.png` and `c07-changes-modal.png`.

### 1. The job of this page
The client (for example Priya) has looked at a watermarked preview. In under 10 seconds they must be able to choose: approve, ask for a change, or say something is wrong, and understand what each does.

Smaller jobs:
1. Confirm what is included.
2. Understand what comes next (pay, unlock).
3. Know how many change rounds are left.

### 2. What is on the page today
**Approve this stage?** (c06)
- Text: "Next you pay ₹60,000 to Meera and the original files unlock. You can't undo this."
- Box "What's included" with three ticks.
- Buttons "Not yet" and "Approve".
- Behind: the right column already shows "Please reply by Wed 21 Oct", the same "What's included" list, "Approve", "Ask for changes (2 left)" and "After you approve, you pay ₹60,000 to Meera and the original files unlock."

**What would you like changed?** (c07)
- "This uses 1 of your 2 rounds of changes."
- Label "Note to Meera", text box with the placeholder "e.g. The palette feels cold. Try warmer tones.", an AI-style pill ("Ask to rewrite your nc... Improve Shorten >").
- Buttons "Cancel" and "Send to Meera".

**Approved** (after approving): a thumbs-up picture, "Approved", "Pay ₹60,000 to Meera to unlock the original files.", buttons "Pay later" and "Pay now".

**Report a problem**: "Approval of {stage} is on hold until it's sorted. Meera has 5 days to reply." Three reasons (radio): "The work wasn't delivered", "It doesn't match what's included", "Something else". A "What happened?" box. Buttons "Cancel" and "Report problem" (red).

**Add a round of changes**: "All included rounds used. One more costs ₹X. / One more round is free." Button "Pay ₹X" or "Add round" (shows "Paying…").

### 3. What is going wrong
1. **The Approve popup repeats the page behind it.** The same "What's included", the same "you pay ₹60,000" sentence, and the same "can't undo" idea are in the side column and in the popup. The user reads the same thing twice. Medium. (A confirm popup before an irreversible step is right; the side column should be shorter, not the popup.)
2. **"Approve" opens a popup that opens another popup.** Approve → "Approved" celebration → "Pay now" → checkout. Three screens for one flow, and the middle one is a "Pay later / Pay now" choice that re-asks something the Approve popup already told them. Medium.
3. **Wording of money.** "Next you pay ₹60,000 to Meera and the original files unlock" is clear. But elsewhere on the same page the badge says "Awaiting your approval", later "Awaiting payment". Different words on the same step. Medium.
4. **The approve popup has two versions of its sentence.** When more stages are still open, it says "Approving moves {stage} towards payment. You pay once after every stage is approved". "Towards payment" is vague. Medium.
5. **Approve vs Not yet.** "Not yet" is a soft, friendly cancel, but it suggests the client must come back soon. A plain "Cancel" or "Go back" is clearer. Small.
6. **"You can't undo this" vs the "Report a problem" link.** The client is told they cannot undo, but the page also says approval can be put on hold by a problem report. Are those in conflict? Unclear. Medium.
7. **Changes popup: hidden consequence.** "This uses 1 of your 2 rounds of changes." The number says 2 but the page behind says "(2 left)". After this there is 1 left. A beginner may read "uses 1 of your 2" as "you have 2 total, this one uses 1", which is correct, but does not say how many remain after. Small. Also the number and "rounds" is jargon: a "round" is not defined anywhere here. Medium.
8. **The AI-style pill inside the Changes popup** ("Ask to rewrite your note", "Improve", "Shorten") is half hidden under the text box and the placeholder text is cut off ("your nc"). It is a third thing competing with the main job (write the note, send it). Medium. A client asking for changes does not expect an AI writer inside a freelancer tool.
9. **Changes popup does not say what happens after.** Does the preview get hidden? When will Meera reply? The toast later says "Round 1 of 2 used" but the popup is silent about "Meera will update the stage and send it back by (date)". Big.
10. **Extra round shows a payment inside a popup.** "Pay ₹X" and "Paying…" contradicts the product rule: PayGuard holds no money, payments go straight to the freelancer. The popup does not say who is paid or how. When the amount is free, it is fine. Big.
11. **Report a problem sounds scary and the reasons overlap.** "The work wasn't delivered" is the only reason that fits when you are looking at a preview. The word "problem" for "I disagree with the scope" may be too strong; "Ask for changes" may be the right route. A beginner cannot tell the difference between "Ask for changes" and "Report a problem". Big.
12. **"Meera has 5 days to reply"** is shown, but there is no hint of what happens after 5 days (does the stage auto-approve? does money move?). Medium.
13. **Missing close X.** These popups have no X; only the Cancel button. Small.

### 4. What the page should look like (information architecture)
Rule: a popup is right for "Are you sure?" (Approve) and for "write one note" (Changes). It is not right for payment steps and not for a choice the user has not understood (problem).

- **Approve:** keep as a popup, shorten it. Remove the "What's included" list (it is already on the page, right above the button). Keep the consequence and the undo warning.
- **Approved:** make it a short confirmation, not a choice. Let the next page say "Pay" because it already has a Pay button.
- **Changes:** keep as a popup. Remove the AI pill from the first version. Add "Meera will send an update by {date}".
- **Report a problem:** move out of the popup into a small page, or start the popup with a plain question: "What's wrong?" and say how it differs from "Ask for changes".
- **Extra round:** say who gets paid and how, or make it a request to the freelancer ("Ask Meera for another round").

```
Approve popup
+---------------------------------------+
| Approve Homepage design?              |
| You can't undo this. Next you pay     |
| ₹60,000 to Meera, and the originals   |
| unlock.                               |
|                                       |
| Cancel                     [ Approve ]|
+---------------------------------------+

Changes popup
+---------------------------------------+
| What should Meera change?             |
| This uses 1 of 2 change rounds.       |
| 1 will be left.                       |
| [ note box.............             ] |
| Meera sends an update by Mon 26 Oct.  |
| Cancel                  [ Send to Meera ]
+---------------------------------------+
```

### 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Approve title | Approve this stage? | Approve Homepage design? | Names it |
| Approve text | Approving moves {stage} towards payment | Approve all stages first. Then you pay once and the originals unlock. | Says the real sequence |
| Approve button | Not yet | Go back | Plain |
| Approved title | Approved | Approved. Now pay to unlock. | Next step |
| Approved buttons | Pay later / Pay now | Pay ₹60,000 / Later | Money in the main button |
| Changes title | What would you like changed? | What should Meera change? | Names who |
| Changes line | This uses 1 of your 2 rounds of changes. | This uses 1 of 2 change rounds. 1 will be left. | Says the end result |
| Changes button | Send to Meera | Send to Meera | Keep |
| Problem title | Report a problem | Something wrong? Tell Meera | Less scary |
| Problem reason | The work wasn't delivered | Nothing was delivered | Shorter |
| Problem reason | It doesn't match what's included | It's not what we agreed | Everyday words |
| Problem line | Meera has 5 days to reply | Meera has 5 days to reply. Approval waits until then. | Says the consequence |
| Extra title | Add a round of changes | Ask for one more change round | It's a request |
| Extra button | Pay ₹X / Paying… | Add round (and say who gets the money) | Matches direct-pay |

### 6. Questions for the owner
- What should happen to the "Pay now" step? I would pick: approve, then show Pay on the page itself, not in a second popup.
- Should "Ask for changes" and "Report a problem" stay separate? I would pick: yes, but the problem route is only offered after the client has seen the preview and the freelancer has missed the date, since that is the only time it protects someone.
- Is the AI helper in the Changes note wanted? I would remove it until a real need shows up.

### 7. Related screens
Before: the client review page (the Approve button, "Ask for changes (2 left)", "Report a problem" link). After: Approve → Pay page; Changes → back to the review page with a "Waiting for Meera" state; Problem → a status page. The client expects to see which of these three states they are now in. Today they get a toast only.

---

## 5. The rest of the popups

### Reply to problem (`respond`, freelancer)
- **What it is:** "Reply to Priya. Say what you'll do and by when." One text box, "Cancel / Send reply".
- **Container:** a popup is fine, it is one note.
- **Problems:** the title does not say it is about a problem raised. Needs the client's words shown above the box so the freelancer can answer them (Medium). "by when" is asked in free text; a date picker would be clearer (Small).
- **Better:** "Reply to Priya's problem" with her note quoted; button "Send reply".

### Unlock without payment? (`unlock`, freelancer)
- **What it says:** "Priya can download the original files for {stage} straight away. You can't lock them again. Use this if you've decided to waive payment." Buttons "Cancel", "Unlock originals".
- **Good:** consequence, no undo. Keep.
- **Problems:** "waive payment" is jargon. The button "Unlock originals" does not say "for free" (Medium). The page behind shows "Mark as paid" next to "Unlock" with a ghost style, and users may mix them up: "Mark as paid" means money came; "Unlock" means no money. The popup should repeat that difference.
- **Better title:** "Unlock for free?" Body: "Priya gets the original files now without paying. You can't lock them again. If Priya already paid you, use Mark as paid instead." Button: "Unlock for free".

### Preview as client (`previewas`, freelancer)
- **What it is:** a wide popup "What Priya will see. The watermark and your note appear exactly like this." with file tabs and a preview, then "Back to editing" and "Send for review".
- **Problem:** this is a full page in a popup, and it hides the **Send** step inside the preview. A beginner might think "Send for review" belongs on the stage page. Medium. The sub-line also shows the real client view, so any "PayGuard" wording in the watermark leaks. In c06, the watermark says "PREVIEW · PRIYA NAIR · 22 OCT 2026 · PAYGUARD". The client side should show the studio name, not PayGuard (Big, product-rule contradiction, but the watermark belongs to the client page reviewer; I flag it).
- **Better:** keep as a popup for "check before sending" but title it "Check before you send" and put "Send for review" as the clear main button. Rename "Back to editing" to "Go back".

### Edit client (`editclient`, freelancer)
- **What it is:** a form popup: logo, colour, Company, Contact name, Contact email, WhatsApp number, "Cancel / Save".
- **Problems:** it is a whole form in a popup, which is acceptable for four fields. But "Color" and "Logo" are decoration while the Remind popup's missing-number hint depends on the WhatsApp number. The WhatsApp field should be first and marked "used for reminders". Small. "Optional" is shown only under the logo; the others do not say required. Small.
- **Better:** order the fields: Contact name, WhatsApp, Email, Company, then Logo and colour under "Look".

### Advance paid (`paid`, shown to the client)
- **What it says:** "Advance paid. ₹15,000 sent to Meera. They can start on Logo and palette." with a "Back to project" button.
- **Problem:** "sent to Meera" and the check mark sound like PayGuard sent it. PayGuard has no payment rail; the money goes directly. If Meera has not confirmed, the popup is making a claim (Medium). "Back to project" is right.
- **Better:** "Advance paid. You've paid ₹15,000 straight to Meera. She can start on Logo and palette."

### Unlocked / paid (`released`, both sides)
- **Client:** "Unlocked. Your original files are unlocked." with a small table (stage, amount, "You paid"). Buttons "Documents", "Continue".
- **Freelancer:** "₹X paid. Priya paid you directly. The original files are unlocked for Priya."
- **Problems:**
  1. Good news with a picture, then two buttons that do not say where "Continue" goes (Medium). Should be "Download originals".
  2. Freelancer sees "₹X paid" and the client sees "Unlocked": different titles for the same event, which is fine, but the freelancer's popup appears the next time they open the app (line 1519, `seen.released`), so it may appear out of context, over another page (Medium).
  3. "Documents" opens a second popup on top (the Documents popup above). Two popups in a row. Small.
- **Better (client):** title "Unlocked. Download your originals", main button "Download originals", second "See receipt".

### Refund (`refund`)
- **What the code says:** "Refund Priya ₹X? Includes their share of the fee. The stage closes unpaid. You can't undo this." Button "Refund in full".
- **Problem:** I could not find a button that opens this popup (no `askrefund` handler). It looks like leftover code. It also contradicts the product rules: PayGuard holds no money and charges no fee, so it cannot refund. The words "fee" and "refund" will confuse (Big if ever shown).
- **Suggestion:** delete it, or turn it into "Close this stage without payment" if that case is needed.

---

## Patterns across all popups

1. **Close behaviour is inconsistent.** Some have an X (Documents, Preview as client, Contract), some have Cancel (Remind, Approve, Changes), some have "Close" or "Done" or nothing (Project created). Pick one: small popups get Cancel and the main button; big popups get X.
2. **The button names for "go back" change every time:** "Not yet", "Cancel", "Back to editing", "Back to project", "Close", "Pay later", "Continue". Pick two words: **Cancel** (for questions) and **Done** (for information).
3. **Popups stacking.** Project created → Remind; Released → Documents; Extra round → Changes. Never put a popup on top of a popup. If a second step is needed, change the content in the same box, or navigate.
4. **Pictures of the mascot** (thumbs-up, party) appear on four popups. They are friendly but take space the next step needs. Use them only for the "money arrived" moment.
5. **The popup repeats the page behind it.** Approve and Documents both say what the page already says.
6. **Fee text in code, no fee in product.** `modalHTML` still contains "fee" strings (extra round, refund). `fees()` returns zero so they usually stay hidden, but they will appear if anyone changes the constants.

---

## Top 5 things to fix on these screens

1. **Make the Client link popup about the contract signature.** Say "Dev signs the contract, then you can start", make the send buttons the main buttons, and demote "View as Dev" to a small link.
2. **Remove or rewrite the payment words inside popups** ("Pay ₹X / Paying…" in Extra round, "sent to" in Advance paid, "Refund", "fee"). PayGuard holds no money, so a popup must never look like it moved money.
3. **Put the Contract, Receipt and Invoice in one place** and stop showing the full contract in three spots. Hide blank rows ("Approved —") and list the delivered files on the receipt.
4. **Tell each decision popup what happens next** (Changes: "Meera sends an update by {date}"; Problem: what happens after 5 days; Approve: next step is pay) and clarify the difference between "Ask for changes" and "Report a problem".
5. **Use one set of button words and never stack popups.** Cancel / Done / the main action by name ("Approve", "Send to Meera", "Unlock for free"). Make Remind say what it is reminding about and stop saying "Reminded" before the freelancer has pressed send in WhatsApp.
