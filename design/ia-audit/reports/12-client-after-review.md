# Client screens after review: Approved, Unlocked, Problem reported, Not started

Screens covered (all in `cProject()`, client link view, "Current stage" tab):
- **Approved (pay to unlock)**: `c08-approved-pay.png`
- **Unlocked**: `c10-unlocked.png`
- **Problem reported (on hold)**: `c11-dispute.png`
- **Not started**: `c14-not-started.png`

Shared frame on all four: top bar (studio name, project name, client name), three tabs (Current stage / All stages 2 / Contract), a one-line stage status, one big card, optional extra card(s), and a right column ("Project / Terms / Next up", Terms and Next up closed).

A note on the screenshots. In `c08` the "Preview" card and in `c10` the "Your files" card look empty. The code shows why: the sample stages have no files, so `lockedPreview()` and the file list draw nothing. A real project would show a preview or files. But it is still an empty state nobody designed (see problem A2 and U2).

---

# Screen 1: Approved (pay to unlock)

## 1. The job of this page
The client has just approved a stage and is here to **pay and get the original files**. In under 10 seconds they must see how much to pay, by when, and a button that does it.

Smaller jobs, in order:
1. Understand what paying gives them (the originals unlock right away).
2. See what they are paying for (stage name, what was approved).
3. Know that the money goes to the freelancer, not to PayGuard.

## 2. What is on the page today
- **Top**: logo, "Meera Iyer Studio > Menu and packaging", client name "Sana Qureshi".
- **Tabs**: "Current stage", "All stages 2", "Contract".
- **Status line**: "Stage 1 of 2 · awaiting payment · Due Sun 25 Oct".
- **Main card**: badge "Awaiting payment"; heading "Pay ₹35,000 to unlock the originals"; text "Pay by Sun 18 Oct. The money goes straight to Meera and the original files unlock right away."; black button "Pay ₹35,000".
- **Second card**: title "Preview", right-hand label "Locked until you pay", then (in this sample) nothing.
- **Right column**: studio logo and name; "Project" (Total ₹75,000, Stages 2, Originals unlock "After each stage is paid"); "Terms" (closed); "Next up" (closed).
- **Popups**: the Pay button goes to a full checkout page (UPI / QR / Card).

Things competing for attention: about 5 (heading, badge, button, preview card, right column). That is fine. The page is calm.

## 3. What is going wrong
1. **Two dates that look like one deadline (Medium).** The status line says "Due Sun 25 Oct" and the card says "Pay by Sun 18 Oct". The "Due" date is the date the freelancer was meant to deliver. It is already past because the work is done and approved. A beginner reads "Due 25 Oct" as the payment deadline and sees two different dates. Show only the pay-by date once a stage is approved.
2. **The status line repeats the card (Medium).** "awaiting payment" appears in the status line, in the badge, and in the heading. Three times for one fact. This is the "same details again and again" the testers complained about.
3. **"Awaiting payment" is a freelancer word on the client's side (Medium).** For the freelancer it means "I am waiting for money". For the client it should say what *they* must do: "Payment due" or "Pay now". Same badge, two meanings depending on who reads it.
4. **The pay-by date can be in the past with no warning (Medium).** In the screenshot "Pay by Sun 18 Oct" is already before today (the app date is 22 Oct). The page does not say "late" or what happens next. The freelancer's side has a "Payment late" badge, the client's side has nothing. A late client gets no nudge, and a client who sees a past date will feel they have already failed.
5. **The Preview card is the wrong thing to show here (Medium).** After approving, the client has already seen the preview. The card says "Locked until you pay", which is useful ("this is what I get"), but a blank card with a title looks broken. If there is a preview, it is a nice reminder of what is being unlocked; if not, hide the card. It sits under the button but pushes nothing important.
6. **The approval is not acknowledged (Medium).** The client approved moments ago and the page never says "You approved this on 16 Oct". The page jumps straight to a demand for money. It feels abrupt. The natural order in the client's head is: approved, thank you, now pay to get the files.
7. **No breakdown on this page (Small).** If an advance was already paid, the ₹35,000 may not match the stage price (₹40,000 minus advance). The amount only gets explained on the checkout page. One line here ("₹40,000 stage, ₹5,000 advance already paid") removes doubt.
8. **Project mode confusion (Medium).** In "whole project" mode the heading changes to "[Stage] is approved" with no button, and the text says "You'll pay once, after the last stage is approved". The client sees "Approved" but no next step and no money. That is a dead end that reads like a mistake. It needs its own clear "Nothing to pay yet. Next: [Stage 2]".
9. **Right column repeats the contract and plan (Small).** "Project: Total, Stages, Originals unlock" is shown on every stage page. The client does not need it at the moment of paying. "Originals unlock: After each stage is paid" is the one line that does help here, and it already appears in the card.
10. **Whose money is it? Only one line says it (Small, works).** "The money goes straight to Meera" is the right message and the right place. Keep it.

## 4. What the page should look like
Keep one job: pay. Everything else steps back.

```
[Studio name > Project name]                     [Client name]

Stage 1 of 2: Concepts                     (small, one line)

 +----------------------------------------------------------+
 | You approved this on 16 Oct. Thank you.                  |
 | Pay ₹35,000 to get the original files.                   |
 | Pay by Sun 18 Oct                                        |
 | (₹40,000 stage, ₹5,000 advance already paid)             |
 |                                                          |
 | [ Pay ₹35,000 ]    Paid straight to Meera. Files open    |
 |                    right after.                          |
 +----------------------------------------------------------+

 What you get when you pay            (only if a preview exists)
 [ locked preview thumbnails ]

 Right column: studio, then "Details" (closed by default)
```

- **Keep**: the big heading with the amount, the black Pay button, "money goes straight to Meera", the preview card with the lock label (only when it has content).
- **Merge**: the badge, status line and heading into one message. The badge can stay as a small label but not repeat the words.
- **Move**: "Project / Terms / Next up" into one closed block called "Details".
- **Remove**: "Due 25 Oct" from the status line once approved.
- **Add**: the approval line, a late message ("This is 2 days past the pay-by date. Pay now to unlock."), and the amount breakdown line.
- **Visible by default**: amount, date, button, what you get. **Behind a click**: project details, terms, next stages.

## 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Badge | Awaiting payment | Payment due | Tells the client what they must do |
| Status line | Stage 1 of 2 · awaiting payment · Due Sun 25 Oct | Stage 1 of 2: Concepts | The rest is repeated or confusing |
| Heading | Pay ₹35,000 to unlock the originals | Pay ₹35,000 to get your original files | "Originals" is our word; "your original files" is plain |
| Subtext | Pay by Sun 18 Oct. The money goes straight to Meera and the original files unlock right away. | You approved this on 16 Oct. Pay by Sun 18 Oct. The money goes straight to Meera and your files open as soon as you pay. | Adds the thank-you and keeps the promise |
| Late case | (nothing) | This was due Sun 18 Oct. Pay now to unlock your files. | A late client needs a clear next step, not blame |
| Preview card label | Locked until you pay | Unlocks when you pay | Says what will happen, not what is blocked |
| Project mode | [Stage] is approved | Approved. Nothing to pay yet. Next: [Stage 2] | Gives the client a next step |

## 6. Questions for the owner
- **Should the client see the approval date and a "thank you"?** I would add it. It costs one line and makes paying feel like the next step, not a surprise bill.
- **What should a late client see?** I would pick a neutral "Pay now" message with no scolding. The freelancer already gets a "Payment late" flag.

## 7. Related screens
- **Before**: the Review screen ("Awaiting your approval") where the client pressed Approve. After approving, they expect either a short confirmation or this page. Today they land here with no bridge sentence.
- **After**: the checkout page, then Unlocked. The button text "Pay ₹35,000" matches the checkout title, which is good. Checkout says "The original files unlock as soon as the payment is confirmed", which repeats this page and is fine.

---

# Screen 2: Unlocked (downloads, documents)

## 1. The job of this page
The client has paid and wants the **files**. In under 10 seconds they must find and download them.

Smaller jobs, in order:
1. Download all files in one tap, or one by one.
2. Keep proof of payment (receipt and contract).
3. Know what happens next (next stage, or "all done").

## 2. What is on the page today
- **Status line**: "Stage 3 of 3 · approved".
- **Main card**: badge "Unlocked"; heading "Final deck"; "Paid. The original files are unlocked."; "That was the last stage. Thank you." (or "Next up: [name], due [date]. [Studio] starts it soon."); four buttons: "Download all", "Documents", "Receipt and contract", and, if there is another stage, a black "Next: [name] >".
- **Second card**: "Your files", a list with file icon, name, "size · original" and a "Download" button per file (links get "Open link"). Empty in this sample.
- **Green box** (last stage only): "All stages unlocked."
- **Right column**: same Project / Terms / Next up.

Things competing for attention: the three similar download-ish buttons plus the Next button, the files list, the green box. About 6.

## 3. What is going wrong
1. **The files, which are the whole point, are below the buttons (Big).** The client came to get the files. The first thing they see is a heading and four buttons. The actual files are one card lower. The list should come first or be inside the main card.
2. **Three buttons that all mean "give me a document" (Big).** "Download all", "Documents", and "Receipt and contract". A beginner cannot tell them apart. Does "Download all" include the receipt? What is the difference between "Documents" and "Receipt and contract"? In the code, "Documents" opens a window with the payment summary and invoice; "Receipt and contract" prints a PDF pack of summary, invoice and contract. These are two ways to get the same papers.
3. **Status line contradicts the badge (Medium).** The line says "Stage 3 of 3 · approved" while the badge says "Unlocked". For a client "approved" feels like a step before paying. After paying the right word is "paid" or "unlocked".
4. **"Original" is repeated on every file (Small).** "size · original" on each row. The client does not need to be told each time; the card heading can say "Your original files".
5. **The green "All stages unlocked." box is detached and far from the thing it refers to (Small).** It appears under the files card with no icon or link. It says the same as "That was the last stage. Thank you." in the card above. Two messages for "everything is done".
6. **No receipt-style confirmation (Medium).** The client has just paid money. The page says "Paid." but not how much, when, or to whom. A person who just paid ₹20,000 wants "You paid ₹20,000 to Meera on 22 Oct". That is a trust moment. Today it is hidden behind "Documents".
7. **Link files and "Download" mix (Small).** Link deliverables (Figma, Loom) show "Open link" and still sit in "Your files". Fine, but the heading of "Download all" does not say that links are not included.
8. **Next stage is mentioned in two places and the button is the loudest thing (Medium).** The text says "Next up: Homepage, due 30 Oct" and a black "Next: Homepage >" button. The black button looks like the main action, but the client's current task (download what they paid for) is more important. Make Next a quiet link.
9. **Right column "Next up" repeats the same next stage (Small).** Third place for the same information.
10. **Freelancer-view leak (Small).** "Originals unlock: After each stage is paid" in the right column is fine, but the word "originals" is internal jargon for clients.
11. **Empty files (Medium).** If a stage somehow has no files (as in the sample) the card shows a title and nothing. Should say "No files attached to this stage" or hide the card.

## 4. What the page should look like
```
Stage 3 of 3: Final deck                       (small)

 +----------------------------------------------------------+
 | Unlocked                                                 |
 | Your files for Final deck                                |
 | You paid ₹20,000 to Meera on 22 Oct.                     |
 |                                                          |
 | [icon] Deck_final.pdf       12 MB        [Download]      |
 | [icon] Deck_source.fig      48 MB        [Download]      |
 | [icon] Figma link                         [Open link]    |
 |                                                          |
 | [ Download all files ]                                   |
 +----------------------------------------------------------+

 Your papers
 [ Receipt ]   [ Contract ]      (one row, two plain buttons)

 Next: Inner pages, due 30 Oct   >         (quiet link)
 -- or --
 All stages are done. Thank you.            (only on last stage)
```

- **Keep**: the badge, "Download all", the per-file Download buttons, "Open link" for links, the thank-you on the last stage.
- **Move**: the file list into the main card, above everything else. Move the paid line up to sit under the heading.
- **Merge**: "Documents" and "Receipt and contract" into a "Your papers" row with two clearly named buttons (Receipt, Contract). Merge "That was the last stage" and "All stages unlocked" into one sentence.
- **Remove**: "approved" from the status line; "original" on each file row; the black Next button (turn it into a quiet link).
- **Visible by default**: files, Download all, paid line. **Behind a click**: right-column details.

## 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Status line | Stage 3 of 3 · approved | Stage 3 of 3: Final deck, paid | Matches what really happened |
| Subtext | Paid. The original files are unlocked. | You paid ₹20,000 to Meera on 22 Oct. Your files are ready. | Confirms the money, plain words |
| Card title | Your files | Your original files | Say it once here, not on every row |
| File row sub | 12 MB · original | 12 MB | Less noise |
| Buttons | Download all / Documents / Receipt and contract | Download all files / Receipt / Contract | One name per thing |
| Next stage | Next: Homepage > (black button) | Next: Homepage, due 30 Oct (text link) | Do not compete with the download |
| Last stage | That was the last stage. Thank you. + All stages unlocked. | All stages are done. Thank you. | One message |
| Empty files | (blank card) | No files were attached to this stage. | Never show an empty box |

## 6. Questions for the owner
- **Does "Documents" need to exist as a separate window?** I would remove it and give the client Receipt and Contract directly, because the client has no reason to browse documents.
- **Should the client be able to come back later and still download?** I assume yes (the link keeps working). If files expire, the page should say so. This links to the unresolved data-retention topic.

## 7. Related screens
- **Before**: checkout ("Pay ₹X"). After the "payment confirmed" moment the client expects to see their files straight away. Does the app go there directly? The code goes to this page, which is right.
- **After**: either the next stage (Not started or In progress) or the end. The client does not need to do anything, so the page should end calmly.

---

# Screen 3: Problem reported (On hold)

## 1. The job of this page
The client reported a problem and wants to know **"Did they hear me, and what happens now?"** In under 10 seconds they must see that the report was sent, who must reply, and by when.

Smaller jobs, in order:
1. See what they reported (to check it was right).
2. See the deadline for the freelancer's reply.
3. Be able to take it back, or follow up if there is no reply.

## 2. What is on the page today
- **Status line**: "Stage 1 of 2 · on hold · Due Tue 20 Oct".
- **Main card**: red badge "On hold"; heading "You reported a problem"; "Approval is on hold. Meera has until Mon 26 Oct to reply."; red box "The work wasn't delivered" + the client's own message; collapsed grey row "What's included · agreed 10 Oct · 1 item"; button "Withdraw".
- **Second card**: "Feedback history", "0 of 2 rounds used", and one line "Isha reported a problem 21 Oct" with the same message again.
- **Right column**: Project / Terms / Next up.

Things competing: heading, red box, grey scope row, Withdraw, Feedback history, right column. About 6.

## 3. What is going wrong
1. **The client's message is shown twice (Big).** Once in the red box, once in "Feedback history". Same words, same screen. Pure repeat.
2. **"Feedback history · 0 of 2 rounds used" is the wrong idea here (Big).** Rounds of changes are about asking for edits. This client reported a problem, which is a different thing. "0 of 2 rounds used" next to a problem report makes the client wonder if they did it wrong and used the wrong tool. It also leaks a freelancer-contract rule. Show only a simple timeline of this problem.
3. **Naming mix: "You reported" and "Isha reported" (Medium).** The heading says "You reported a problem", the history says "Isha reported a problem". It is the same person, shown in two voices. In history use "You".
4. **"Withdraw" is unclear (Big).** Withdraw what? The report? The stage? The project? A beginner could fear that it cancels the whole job. It also has no explanation of what happens after (does approval resume? does the freelancer get told?). It needs a real name and a one-line result.
5. **The client has no way to do anything except withdraw (Big).** No message box, no "add more details", no way to contact the freelancer. The text says "The reply window has passed. You can follow up with Meera." but there is no follow-up button. A person with a problem needs to be able to add to their message.
6. **The page does not say what happens next (Big).** "Approval is on hold" is a state, not a plan. A client wants: "Meera has been told. She has until 26 Oct to reply. We will show her reply here. After that you can ..." One short sequence of three steps does this.
7. **Status line shows an irrelevant delivery date (Small).** "Due Tue 20 Oct" is the original delivery date, now past. The relevant date is the reply-by date, already in the card. Two dates again.
8. **"On hold" says what is paused, not who is waiting (Medium).** "On hold" in red looks like something broke. Better: "Waiting for Meera".
9. **Scope row sneaks in (Small).** "What's included · agreed 10 Oct · 1 item" is closed, grey, and its meaning is unclear. It is useful when the problem is "doesn't match what's included", but not for "wasn't delivered". Show it only for that reason, or call it "What was agreed".
10. **Freelancer's reply not shown (Medium).** If the freelancer has replied, `m.reply` exists but cProject's dispute branch does not show it. The client sees "On hold" while a reply may already exist. (Code: the `funded` branch shows "[Studio]'s reply"; the `dispute` branch does not.)
11. **"PayGuard" shows as a name (Small).** In Feedback history, system events use the name "PayGuard" (`name()` in `feedbackCard`), which breaks the rule that the client sees the studio, not PayGuard. For auto-approval it would read "PayGuard approved automatically".

## 4. What the page should look like
```
Stage 1 of 2: Style frames                       (small)

 +----------------------------------------------------------+
 | Waiting for Meera                         (amber badge)  |
 | You reported a problem on 21 Oct.                        |
 |                                                          |
 | "The work wasn't delivered"                              |
 | "These were due two days ago and I haven't seen..."      |
 |                                                          |
 | What happens next                                        |
 |  1. Meera has been told.                                 |
 |  2. She has until Mon 26 Oct to reply here.              |
 |  3. After her reply you can approve, or ask for changes. |
 |                                                          |
 | [ Add a message ]            Take back my report (link)  |
 +----------------------------------------------------------+

 Timeline (only if there is more than one event)
 You reported a problem - 21 Oct
 Meera replied - 23 Oct     (when it happens)

 What was agreed  (closed)
```

- **Keep**: the red or amber box with the client's own words (it proves we listened), the reply-by date, a way to take the report back.
- **Remove**: the duplicate message in history, the "0 of 2 rounds used" counter, the original Due date in the status line.
- **Merge**: the history becomes a short timeline that appears only when there is more than one event (a reply or a follow-up).
- **Move**: "What's included" below the timeline.
- **Add**: "What happens next" (3 lines), an "Add a message" button, and the freelancer's reply when it exists.
- **Visible by default**: status, your report, next steps, reply-by date. **Behind a click**: what was agreed, project details.

## 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Badge | On hold | Waiting for Meera | Says who must act |
| Status line | Stage 1 of 2 · on hold · Due Tue 20 Oct | Stage 1 of 2: Style frames | Remove the stale date |
| Heading | You reported a problem | You reported a problem on 21 Oct | Adds when |
| Subtext | Approval is on hold. Meera has until Mon 26 Oct to reply. | Meera has been told. She has until Mon 26 Oct to reply. You can't approve or pay for this stage until then. | Says what is and is not possible |
| Button | Withdraw | Take back my report | Clear object and result |
| New button | (none) | Add a message | Needs a way to talk |
| History title | Feedback history | What's happened so far | The word "feedback" refers to change requests |
| History counter | 0 of 2 rounds used | (remove) | Not about problems |
| History name | Isha reported a problem | You reported a problem | Same voice as the heading |
| After reply window | The reply window has passed. You can follow up with Meera. | Meera hasn't replied by 26 Oct. [Message Meera] | Gives the button the text promises |

## 6. Questions for the owner
- **Can the client write to the freelancer on this page?** I would add one "Add a message" box, because without it the "report a problem" feature is a one-way shout. If you want to avoid chat, make it WhatsApp or email prefilled, like the reminders already work for the freelancer.
- **What does "Take back my report" do to the clock?** I assume the stage goes back to where it was (the code stores `prev`). The button text should promise that.

## 7. Related screens
- **Before**: the "Report a problem" link that appears on In progress and Review pages (a small text link; it opens a small popup with a reason and a note). The client arrives here straight after pressing Send, so this page should start with "Sent. Meera has been told."
- **After**: the stage returns to In progress, Review or Approved depending on the reply. The freelancer's page shows "[Client] reported a problem" with Reply. The client should get a visible echo of the freelancer's reply here.

---

# Screen 4: Not started

## 1. The job of this page
The client is looking at a stage that has not begun. There are two very different cases and the page mixes them:
- **Advance due**: the client must pay an advance to start. (This is what `c14` shows.)
- **Plain not started**: nothing to do, a later stage is waiting for the earlier one.

In under 10 seconds they must know whether they need to do something or just wait.

Smaller jobs:
1. If an advance is due: pay it, and know what it covers.
2. Otherwise: see when the stage should start and what it includes.
3. See the order of events (what comes before this).

## 2. What is on the page today
- **Status line**: "Stage 1 of 2 · not started · Due Mon 26 Oct".
- **Main card (advance case)**: grey badge "Advance due"; heading "Pay ₹15,000 to start"; "Meera starts once the 25% advance is paid. It goes straight to Meera."; open box "What's included · 1 item" with one bullet "Everything listed in the brief for this stage"; black button "Pay ₹15,000 advance".
- **Plain case**: badge "Not started"; stage name; "[Studio] starts this stage after the previous one is unlocked. Due [date]."; the "What's included" box open.
- **Right column**: Project (Total, Stages, **Advance 25% · ₹15,000**, Originals unlock "Once, after all stages"), Terms, Next up.

## 3. What is going wrong
1. **The advance case does not show the project (Big).** "Pay ₹15,000 to start" appears before the client has been reminded what the project is. The heading never names the stage or project. The advance is a big decision. The page should say "advance for Logo refresh" plus the total and what the rest looks like.
2. **Advance is explained in three places (Medium).** The heading, the sentence, and the right column ("Advance 25% · ₹15,000") all say the same. The right column row is the extra one.
3. **"What's included" shows a placeholder, not a real list (Medium).** "Everything listed in the brief for this stage" is a stand-in used when the freelancer did not list what's included. The client is asked to pay ₹15,000 and the list says nothing. It is also open by default and takes space with no value. If there is no list, hide the box and link to the contract.
4. **The page never says the contract is signed (Medium).** The right order is: contract signed, then advance, then work starts, then preview. The client sees "Pay ₹15,000 to start" and may wonder whether the contract step was missed. A tiny "Contract signed on 14 Oct" line builds trust before asking for money.
5. **The pay-first step feels like a trap without a plan (Medium).** There is no view of what happens after paying: "Meera starts, sends a preview by 26 Oct, you review, then you pay the rest". The beginner has no picture of the route. A three-step sentence fixes it.
6. **"Advance due" is a grey badge (Small).** Grey means "nothing happening" to most people. It is the only thing the client must do, so it should look like the main action (use the same colour as "Payment due").
7. **"Due Mon 26 Oct" in the status line is the delivery date, shown before work started (Small).** Fine to show, but the client might think this is the pay-by date for the advance. Label it "Delivery by Mon 26 Oct".
8. **Plain "Not started" is a dead end (Medium).** The heading is the stage name, the text says it starts later, and nothing is offered. The client does not need to act, so the page should say "Nothing to do now. Meera will start after Stage 1 is unlocked". Today it reads like a hint, not a clear "you can relax".
9. **"Originals unlock: Once, after all stages" appears only when there is an advance (Small, but important).** Project mode changes the rule: one payment at the end. This rule affects what the client expects from the later Pay pages but is hidden in a closed side column. When a project works this way, the first card should say so in one line.
10. **Language: "starts this stage after the previous one is unlocked" (Small).** "Unlocked" here means the previous stage's files were unlocked by payment. For a client it is unclear that "unlocked" means "paid".

## 4. What the page should look like
**Case A: advance due**
```
Stage 1 of 2: Logo options                        (small)

 +----------------------------------------------------------+
 | Pay the advance to start                  (blue badge)   |
 | ₹15,000 (25% of ₹60,000), paid straight to Meera         |
 |                                                          |
 | Contract signed on 14 Oct                                |
 |                                                          |
 | What happens next                                        |
 |  1. You pay the advance.                                 |
 |  2. Meera starts and sends a preview by 26 Oct.          |
 |  3. You review it, approve it and pay the rest.          |
 |                                                          |
 | [ Pay ₹15,000 advance ]                                  |
 +----------------------------------------------------------+
 What's included (closed, or the contract link if no list)
```
**Case B: waiting for earlier stage**
```
Stage 2 of 2: Brand sheet
 Nothing to do yet.
 Meera will start this after Stage 1 is paid and unlocked.
 Planned delivery: Mon 26 Oct
 What's included (closed)
```
- **Keep**: the "Pay ₹X to start" idea and the black button, "goes straight to Meera", what's included.
- **Merge**: advance info into the card only. Remove the duplicate "Advance" row from the side column here.
- **Add**: "Contract signed", the 3-step "What happens next", and a "Nothing to do" line for case B.
- **Remove**: the placeholder bullet "Everything listed in the brief".
- **Visible by default**: the one thing the client must do (or "nothing"). **Behind a click**: what's included, project details.

## 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Badge (advance) | Advance due | Pay to start | Action, not a label |
| Heading | Pay ₹15,000 to start | Pay the ₹15,000 advance to start Logo options | Names the thing |
| Subtext | Meera starts once the 25% advance is paid. It goes straight to Meera. | The advance is 25% of ₹60,000. It goes straight to Meera. She starts as soon as you pay. | Gives the total and avoids repeating "Meera" |
| Status line | Stage 1 of 2 · not started · Due Mon 26 Oct | Stage 1 of 2: Logo options. Delivery by Mon 26 Oct | Not confused with a pay date |
| Placeholder | Everything listed in the brief for this stage | (hide the box; show "See the contract" link) | A non-answer looks careless |
| Plain not started | Meera starts this stage after the previous one is unlocked. Due 26 Oct. | Nothing to do yet. Meera starts this after Stage 1 is paid. Planned delivery: 26 Oct. | Plain words, tells the client they can wait |
| Button | Pay ₹15,000 advance | Pay ₹15,000 advance | Good, keep |

## 6. Questions for the owner
- **Should "Not started" with nothing to do be shown as a page at all?** Clients usually reach later stages by "All stages". I would keep it but make it very short. Picking is cheap.
- **Should the advance step appear on a project-level page rather than inside "Stage 1"?** I would pick yes eventually: the advance belongs to the project, not stage 1. Today it hides in the first stage's card and the client may not understand why a stage page asks for project money. This matches the earlier note that waiting for a signature should be its own first step; advance should be the same.

## 7. Related screens
- **Before**: the invite page ("Review and sign the contract"). After signing the client expects either "Pay the advance" or "Meera is starting". This page does the former. The invite page's "How it works" list says the same advance rule, which is good because it creates the expectation.
- **After**: checkout (advance version, with the tick "I agree to the plan") then In progress. The agree-to-plan tick on checkout duplicates the contract the client already signed, which is a separate issue for the checkout reviewer.

---

# The order of events a client expects (across all four screens)

The client's mental story is: **Sign, (advance), wait, preview, approve, pay, files.**
Today:
- Not started (advance) -> In progress -> Review -> Approved (pay) -> Unlocked -> next stage.
- "Report a problem" can jump in from In progress or Review and puts the stage On hold.

What works: paying sits directly after approval and has a big black button, "money goes straight to Meera" is clear, the Unlocked page has a "Download all" button and a thank-you.

What breaks the story:
- Approval is never acknowledged (Approved page starts with a money demand).
- After paying, the files are not the first thing shown.
- The problem page has no way forward.
- The status line and badge repeat or contradict each other on every page ("approved" on an Unlocked stage; "awaiting payment" three times).
- Dates change meaning: Due (delivery) is shown on stages that are already done or paused.

# Top 5 things to fix on these screens

1. **Unlocked: put the files first and cut the three "document" buttons to Download all, Receipt, Contract.** The client came for files.
2. **Problem reported: remove the duplicate message and the "0 of 2 rounds used" counter; add "What happens next", an "Add a message" button, and show the freelancer's reply when it exists.** Rename "Withdraw" to "Take back my report".
3. **Approved: add "You approved this on [date]", show only the pay-by date (drop the delivery "Due" date), and change "Awaiting payment" to "Payment due" for clients.** Make it feel like the natural next step.
4. **Not started (advance): name the stage, show "Contract signed", add a 3-step "What happens next", and remove the placeholder "Everything listed in the brief".** For the no-action case say "Nothing to do yet".
5. **Fix the status line on every client stage page.** It repeats the badge, shows stale due dates, and says "approved" on paid stages. Make it just "Stage X of Y: [name]". Also stop showing "PayGuard" as a name in Feedback history on the client side.
