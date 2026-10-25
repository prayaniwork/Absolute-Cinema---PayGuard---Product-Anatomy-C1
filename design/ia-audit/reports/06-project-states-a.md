# Report 06: Freelancer project page, three states (In review, Awaiting payment, In progress with upload)

Screens covered: `f15-project-in-review.png`, `f16-project-awaiting-payment.png`, `f17-project-in-progress-upload.png`.
Code read: `sProject`, `homeHero` (all branches), `stageLine`, `feedbackCard`, `filesCard`, `approvalsCard`, `stageDetail`, `projSide`, `fileRows`, `remTrace`.

All three states share one page frame. So most problems are in the frame, and each state adds its own small problems. I write the shared frame first, then each state.

## The shared frame (same on all three states)

Top to bottom today:
1. Breadcrumb: "Clients > Bloom Studio > Website redesign", plus three buttons: "Details", "View as Priya", "Client link".
2. A summary strip: client name, "You get ₹1,60,000", "Next: Inner pages · Mon 9 Nov".
3. Four tabs: "Stages 4", "Files 3", "Contract", "Activity 1".
4. Stage line: "Stage 2 of 4 · in review · Due Wed 21 Oct".
5. Big card: stage name, status pill, one sentence, buttons, included items.
6. (Only when there is history) "Feedback history" card.
7. "Files & links" card.
8. "Approvals" table with every stage.
9. Hidden by default: a "Details" side panel (Next up, Money, Contract, Terms, Contact).

---

# Screen A: Stage is "In review" (f15)

## 1. The job of this page
**Who and when:** the freelancer (Meera) has sent a stage to the client and is waiting. She opens the project to answer: "Has Priya looked at it, when will it be approved, and should I nudge her?" In under 10 seconds she must know: **the client has not replied yet, and the stage will be approved automatically on Sat 24 Oct.**

Smaller jobs, in order:
1. Nudge the client ("Remind Priya") if she is quiet.
2. Check what the client is actually seeing (the files sent).
3. See where this stage sits in the whole project.

## 2. What is on the page today
- **Stage line:** "Stage 2 of 4 · in review · Due Wed 21 Oct".
- **Big card:** title "Homepage design"; pill "In review"; sentence "Sent 4 days ago. Priya's reply was due yesterday. It's approved automatically on Sat 24 Oct."; line "2 rounds of changes left"; a collapsed bar "What's included · agreed 10 Oct · 3 items"; button "Remind Priya" next to grey text "Auto-reminded today · Link opened 29 days ago"; then three file rows (Moodboard.svg, References.pdf, Notes.docx), each saying "Preview ready".
- **Files & links card:** "3", "View all", and the **same three files** again, each with "Homepage design" under it.
- **Approvals table:** "1 of 4 approved". Four rows. Columns: Stage, Approver, Updated, Status. Approver is "Priya" in every row.
- Count: roughly 9 separate things compete here (stage line, title, pill, sentence, rounds, included bar, remind row, file list, plus two more cards below). Nothing is bold enough to be "the one thing".

## 3. What is going wrong
1. **The same three files are shown twice, one above the other.** Big card file list, then the Files & links card. Beginner thinks: "Did I upload them twice?" (Big)
2. **The stage is described three times before you reach the table.** Stage line says "Stage 2 of 4 · in review", the pill says "In review", the table row says "In review". Same fact, three places. The stage line adds nothing the pill does not already say. (Medium)
3. **The key fact is buried in a long sentence.** "Sent 4 days ago. Priya's reply was due yesterday. It's approved automatically on Sat 24 Oct." is the most important message and it is small grey text. The big bold word is the stage name, which she already knows. (Big)
4. **Two different dates compete.** "Due Wed 21 Oct" (stage line) is when Meera's work was due. "approved automatically on Sat 24 Oct" is when the client's time runs out. A beginner reads "Due Wed 21 Oct" as the date something is expected from the client. It is in the past already and looks like a warning. (Big)
5. **"Link opened 29 days ago" sits beside "Auto-reminded today".** It reads as nonsense: the project was agreed 10 Oct, yet the link was opened 29 days ago. Even if it is only sample data, the wording "Link opened" is vague. Whose link? Did she open this stage? The information that matters is "Has Priya seen this delivery?" (Medium)
6. **"Remind Priya" is tiny and sits among grey text.** It is the only action on the page, yet it looks the same weight as a filter. It also does not say what it does (email? WhatsApp? both?). (Medium)
7. **"2 rounds of changes left" is shown while in review.** It is a rule of the contract, not news about this moment. It matters only after the client asks for changes. Here it adds noise. (Small)
8. **"What's included · agreed 10 Oct · 3 items" is confusing next to "Preview ready" files.** "3 items" in the included bar looks like it counts the three files right below it, but it is the agreed scope list (what the freelancer promised). Two different "3 things" within a few pixels. (Medium)
9. **The "Approvals" table is mislabelled.** It is really the list of stages. "Approver" is always the same person (the client has no choice of approver, so the column is pure repetition). "Updated" has no clear meaning (date of what?). A beginner looking for "where are my stages?" would never call it "Approvals". The earlier test comment "Stages should feel like a stepper" applies directly. (Big)
10. **The Approvals table repeats the stage names, the due dates and the status** that the stage line already showed for the current stage. And the page also has a tab called "Stages" which opens this same page. So "Stages" tab, "Stage 2 of 4", and "Approvals" are three names for the same idea. (Big)
11. **The summary strip says "Next: Inner pages · Mon 9 Nov"** while the page is about stage 2 "Homepage design". She is looking at stage 2 but the header jumps ahead to stage 3. The word "Next" is ambiguous (next event? next stage?). (Medium)
12. **"You get ₹1,60,000" is the project total, not what happens next.** On a stage in review, the money that matters is this stage's amount and whether it is already paid. A beginner may read "You get" as "you will get it now". (Medium)
13. **Page order puts the stage line above the big card, and the stage table last.** The one place that shows the whole path is at the bottom, below two cards. (Medium)

## 4. What the page should look like (information architecture)
"Information architecture" here just means: what goes where, and in what order.

**Principle:** the page has one job per state. Top = a stepper showing the path. Directly under it = one card for the current stage. Nothing else repeats it.

Sketch:

```
Clients > Bloom Studio > Website redesign                [View as Priya] [Client link]
Bloom Studio · Priya Nair        (Details panel is a drawer, closed)

[ Stages ]  Files  Contract  Activity

(1 Discovery ✓)───(2 Homepage design ●)───(3 Inner pages)───(4 Handoff)     <- stepper, each step clickable
 Unlocked           In review              Not started       Not started

┌───────────────────────────────────────────────────────────────┐
│ Homepage design                                   [In review] │
│ WAITING FOR PRIYA                                             │
│ She has until Sat 24 Oct to reply. After that it is           │
│ approved automatically.                                       │
│ Sent 4 days ago · Priya opened the preview: yes / not yet     │
│ [ Remind Priya ]                                              │
│ ─────────────────────────────────────────────────────────── │
│ Sent to Priya (3)                                             │
│  Moodboard.svg · References.pdf · Notes.docx   (preview)      │
│ ▸ What's included (agreed 10 Oct)                             │
└───────────────────────────────────────────────────────────────┘
```

Block by block:
- **Stepper (new, merges stage line + Approvals table).** Reason: shows the whole path in one glance, answers "where am I?" Replaces the stage line and the Approvals card. Click a step to open that stage in the big card. Each step carries name and one status word.
- **Current-stage card (keep, simplified).** Reason: it is the one thing she acts on. Order inside: what we are waiting for (bold, one line), the deadline, one primary button, then the files of this stage, then "What's included" collapsed.
- **Files live inside the stage card (move).** Reason: the earlier user feedback was "files and links should live inside a stage". Delete the separate "Files & links" card from this tab. The "Files" tab stays as the all-projects archive.
- **Feedback history (keep, only when it exists).** Put it **inside** the stage card, under the files, not as its own card. It belongs to this stage.
- **Remove** "2 rounds of changes left" from the in-review state. Show it only when the client asked for changes, or inside "Terms".
- **Remove** "Approver" column. **Remove** the "Updated" column (or turn it into "Approved 16 Oct" inside the step).
- **Hide behind a click:** What's included, Details panel, reminder history ("Reminded today").
- **Visible by default:** stepper, one sentence of status, one button, the files.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Stage line | "Stage 2 of 4 · in review · Due Wed 21 Oct" | Delete (the stepper replaces it) | Repeats the pill; "Due" date is confusing |
| Big card sentence | "Sent 4 days ago. Priya's reply was due yesterday. It's approved automatically on Sat 24 Oct." | Bold line: "Waiting for Priya." Under it: "She was meant to reply by Tue 20 Oct. If she says nothing, this stage is approved on Sat 24 Oct." | Leads with the fact; plain dates |
| Remind row | "Auto-reminded today · Link opened 29 days ago" | "Last reminder: today (automatic). Priya last opened the link 29 days ago." | Says who and what |
| Button | "Remind Priya" | "Send Priya a reminder" | Says the action |
| Rounds line | "2 rounds of changes left" | Hide in review. Later: "Priya can ask for changes 2 more times." | Only useful when it can change something |
| Included bar | "What's included · agreed 10 Oct · 3 items" | "What you agreed to deliver (3)" | Separates it from the files |
| File status | "Preview ready" | "Preview sent" | It has been sent, not just made |
| Table title | "Approvals" | "Stages" | It is the stage list |
| Header strip | "Next: Inner pages · Mon 9 Nov" | "Stage 3 Inner pages is due Mon 9 Nov" or drop it | "Next" is ambiguous |
| Header strip | "You get ₹1,60,000" | "Project total ₹1,60,000" | "You get" sounds like it is arriving now |

## 6. Questions for the owner
- **Does a stage "in review" need to show the deadline of the freelancer's work at all?** I would pick: no. Once sent, only the client's deadline matters.
- **Is "Link opened" about the client link in general or about this delivery?** I would pick: "opened the preview" for this delivery only, because that is what she wonders about.

## 7. Related screens
- **Before:** the freelancer clicked "Send for review" on the upload state (Screen C below). She expects to land here and see "Sent" confirmed with the date the client has to reply by.
- **After:** the client approves (state becomes "Awaiting payment", Screen B) or asks for changes (state "Changes requested"). The page should show the same stepper so she can see the change instantly.
- The client's view of the same stage is a different page. Nothing in this page should show client-only wording such as the client's own buttons.

---

# Screen B: Stage is "Awaiting payment" (f16)

## 1. The job of this page
**Who and when:** the freelancer, after the client approved a stage and the balance is due. Question in her head: "Has Sana paid? If not, what do I do?" In under 10 seconds she must know: **Sana approved on 14 Oct, owes ₹35,000, is 4 days late, the originals are locked.**

Smaller jobs, in order:
1. Remind Sana, or mark the stage paid if money arrived.
2. Unlock the originals early if she chooses to trust the client.
3. Understand what is locked and what the client can already see.

## 2. What is on the page today
- **Stage line:** "Stage 1 of 2 · awaiting payment · Due Sun 25 Oct".
- **Big card:** "Concepts" + pill "Awaiting payment"; sentence "Sana approved this 11 days ago. The originals stay locked until they pay ₹35,000 (by Sun 18 Oct)."; amber pill "Payment 4 days late"; included bar "2 items"; three buttons "Remind Sana", "Mark as paid" (black), "Unlock anyway"; grey "Auto-reminded today · Link opened 4 days ago". No file list (none exist).
- **Files & links card:** "0" and "Files and links appear here once the work starts."
- **Approvals table:** "0 of 2 approved". Row 1 status "Awaiting payment" (text wraps onto two lines inside the pill). Row 2 "Not started".

## 3. What is going wrong
1. **"0 of 2 approved" is false.** Sana already approved stage 1. The table counts "Unlocked" as "approved". So the page says "approved" in the big card and "0 approved" at the bottom. (Big)
2. **"Files and links appear here once the work starts."** The work is finished and approved. This sentence tells her the files are lost. It is the wrong empty message for this state. (Big)
3. **"Awaiting payment" means different things to different people** (already heard in the test). On this screen it is the name of the stage state, but the beginner also has the stage sentence "until they pay ₹35,000". Is "awaiting" the client's job or PayGuard's? PayGuard does not hold money, so "awaiting payment" is really "Waiting for Sana to pay you". (Big)
4. **Two dates for the same event.** "Due Sun 25 Oct" in the stage line (work due date) and "by Sun 18 Oct" (payment date), and "11 days ago". She cannot tell which date is the payment deadline. The stage line date is wrong for this state: the work is done. (Big)
5. **"Payment 4 days late" sits in its own little amber line** under the sentence, instead of being the headline. It is the most urgent fact on the page. (Medium)
6. **Three buttons with unclear result.** "Mark as paid" - does PayGuard collect anything? Does Sana get an email? "Unlock anyway" - anyway despite what? Does the client get the originals right now? It is a ghost link-style button that looks smaller than "Remind", but it is the most dangerous action (it gives away the files). Order should be: reminder (soft), mark paid (money came), unlock early (risky, with a confirm that says what happens). (Big)
7. **"Mark as paid" is black, the primary look,** while the likely next step is "Remind". In late state either could be right. Pick the one that follows from what she knows, and say it. (Medium)
8. **Reminder text "Auto-reminded today · Link opened 4 days ago" is the only proof of what the client has seen.** It does not say if the client has seen the payment request. (Medium)
9. **The status pill in the table wraps onto two lines** ("Awaiting / payment") and the lock icon sits to the side. Small bug, but it makes this row look broken. (Small)
10. **Same repeats as Screen A:** stage line says "awaiting payment", the pill says "Awaiting payment", the table row says "Awaiting payment". Three times. (Medium)
11. **Header strip: "Next: Concepts · Sun 25 Oct"** names the stage she is looking at as "next". And "You get ₹75,000" is the whole project, while this page is about ₹35,000. (Medium)
12. **The scope bar ("2 items") shows scope, but the file list is empty.** So the page says "2 items" and "0 files". Looks like a missing upload. (Medium)
13. **Contradiction in the code:** when the project is paid once at the end, the stage says "You can start the next stage. Sana pays once after the last stage is approved." That is a very different state from this screenshot but it uses the same pill "Awaiting payment". So the same label can mean "you may start the next stage" or "money is overdue". (Big)

## 4. What the page should look like

**Principle:** this is a money state. The card should read like a bill: who owes what, by when, what is locked, what you can do.

```
(1 Concepts ●)────────(2 Final artwork)
 Waiting for payment    Not started

┌───────────────────────────────────────────────────────────────┐
│ Concepts                                    [Waiting for Sana]│
│ SANA OWES YOU ₹35,000                                         │
│ Due Sun 18 Oct · 4 days late                                  │
│ She approved on Tue 14 Oct. The originals are locked until    │
│ she pays.                                                     │
│                                                               │
│ [ Mark as paid ]  [ Send reminder ]   Unlock without payment ▸│
│ Last reminder today · Sana last opened the link 4 days ago    │
│ ─────────────────────────────────────────────────────────── │
│ Locked originals (2)   Preview copies shown to Sana (2)       │
│ ▸ What's included                                              │
└───────────────────────────────────────────────────────────────┘
```

- **Stepper at the top (move/merge)** instead of the Approvals table. Same reason as Screen A.
- **The amount and the lateness are the headline (move up).** Not in the sentence.
- **Files for this stage (keep, move inside the card).** Show the original files as locked, with the preview next to them. Never show "once the work starts" here.
- **Merge** stage line + pill + table row into one status word, "Waiting for Sana to pay".
- **Hide** "Unlock without payment" behind a small menu with a confirm sheet: "Sana will get the originals now. She will not be asked to pay. Continue?"
- **Remove** the Files & links card and the table.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Pill / table / stage line | "Awaiting payment" | "Waiting for payment" with the name in the card: "Sana owes ₹35,000" | Says who owes whom |
| Sentence | "Sana approved this 11 days ago. The originals stay locked until they pay ₹35,000 (by Sun 18 Oct)." | Headline: "Sana owes you ₹35,000." Under: "Due Sun 18 Oct. Her approval was on 14 Oct. The originals stay locked until she pays." | The amount comes first |
| Late pill | "Payment 4 days late" | "4 days late" next to the amount | It belongs to the amount |
| Button | "Mark as paid" | "I received the money" | Beginners do not know what "mark" does |
| Button | "Unlock anyway" | "Unlock without payment" | Says what is being skipped |
| Button | "Remind Sana" | "Send Sana a reminder" | Names the action |
| Table "Approved" count | "0 of 2 approved" | "0 of 2 unlocked" (or drop count if stepper) | It really counts unlocks |
| Empty files | "Files and links appear here once the work starts." | "The originals are locked until payment." | True for this state |
| Table status wrap | "Awaiting payment" in a narrow pill | "Waiting for payment" (shorter pill) | Stops line wrap |
| Stage line "Due Sun 25 Oct" | shown | Remove in this state | The work is done |

## 6. Questions for the owner
- **For "paid once at the end" projects, is a stage that is approved but not yet payable still shown as "Awaiting payment"?** I would pick: show "Approved" (green), and keep "Waiting for payment" only for the stage where money is really due. Otherwise the same word means two things.
- **Should "Mark as paid" and "Unlock anyway" be two buttons or one "Unlock" menu with two choices?** I would pick: one "Unlock originals" button that asks "Did Sana pay you?" (Yes / No, unlock anyway). It makes the decision visible and removes one button.

## 7. Related screens
- **Before:** the client approved. The freelancer comes here from a notification or the Today page and expects to see the amount owed first.
- **After:** the client pays (QR / UPI) and the stage becomes Unlocked, or the freelancer clicks "I received the money". She expects a confirmation saying the originals are now unlocked for Sana.
- The Payments page lists the same amount. The wording there must match ("owes you", not "In process").

---

# Screen C: Stage is "In progress" with the upload area (f17)

## 1. The job of this page
**Who and when:** the freelancer is working on a stage and is ready to hand over files. In under 10 seconds she must know: **where to drop files and what happens next ("Rohit sees a watermarked preview").**

Smaller jobs, in order:
1. Add files or a link.
2. Write a short note to the client.
3. Send for review.

## 2. What is on the page today
- **Stage line:** "Stage 3 of 4 · in progress · Due Sat 24 Oct".
- **Big card:** "UI kit" + pill "In progress"; "Upload your files. Rohit sees a watermarked preview."; "Due Sat 24 Oct · in 2 days · 2 rounds of changes left"; included bar "3 items"; a three-step line "1 Add your work, 2 Add a note, 3 Preview and send"; a dashed drop zone with "Drop files here, or choose them", "Images, PDFs, videos and docs", black "Choose files"; "Or add a link (Figma, Loom, Miro and others)" + input + "Add link"; hint "Use a view-only link. Rohit opens it in a new tab."; "Try it with sample files".
- **Files & links card:** "0", "Files and links appear here once the work starts."
- **Approvals table:** "2 of 4 approved", four rows.
- When files are added the code also shows: a file list with remove buttons, then a "Note for Rohit (optional)" box, then a bar "Reply due ..." with "Preview as Rohit" and "Send for review".

## 3. What is going wrong
1. **Due date is shown twice in a row.** Stage line "Due Sat 24 Oct" and card line "Due Sat 24 Oct · in 2 days". (Medium)
2. **Empty "Files & links" card sits directly under the upload zone.** "Files and links appear here once the work starts" while she is on the upload form. A user thinks: "Where will my upload go: here or in the zone?" Files go to two places (inside the big card as a list, and in this card). (Big)
3. **Where do the files go and where does the "Send" button appear?** The Send bar appears only after a file is uploaded, far below the page, under the big card. In the empty state she cannot see that sending exists. The three-step line "1 Add your work, 2 Add a note, 3 Preview and send" helps, but it looks like a tab strip and is not clickable. (Medium)
4. **"Preview and send" is vague.** Does she preview first, then send? The button is called "Send for review", and a separate button is "Preview as Rohit". Three words for the same idea (Preview, send, review). (Medium)
5. **Upload zone has two entry points that look equal** (drop zone, then a link field). Fine in principle, but the "Choose files" black button competes with "Add link" and with "Try it with sample files" (a test helper that a real user should never see). (Medium)
6. **"Try it with sample files" is a prototype helper left in the real UI.** Small, but a new beginner will click it and get fake files. (Small)
7. **The included bar says "3 items" with no way to see them next to the upload.** While uploading, the freelancer needs the checklist of what she promised to deliver, open, beside the drop zone. It is collapsed by default, so she must open it, and when opened it pushes the drop zone down. (Medium)
8. **"2 rounds of changes left"** is shown for a stage nobody has seen yet. Not needed. (Small)
9. **Approvals table has "2 of 4 approved"** with rows saying "Unlocked" for stages 1 and 2. Same mismatch as Screen B: it counts unlocked as approved. And it is shown below an empty files card, far from the action. (Medium)
10. **Stage number appears three times:** stage line "Stage 3 of 4", the title "UI kit" with the pill "In progress", and the table row 3 "In progress". (Medium)
11. **"Rohit sees a watermarked preview" appears in the card, and again in the Send bar** ("Rohit sees a watermarked preview."). Said twice in different places. (Small)
12. **The word "preview" is used for two things in the same flow:** the watermarked copy the client sees, and the button "Preview as Rohit". They are related, but a beginner may think "Preview and send" means a preview of the sending. (Small)

## 4. What the page should look like

**Principle:** in this state the whole page is a three-step form for one stage. The rest of the project should step back.

```
(1 Audit ✓)──(2 Wireframes ✓)──(3 UI kit ●)──(4 Prototype)

┌───────────────────────────────────────────────────────────────┐
│ UI kit                                           [In progress]│
│ Add your work for Rohit. He sees a watermarked preview.        │
│ Due Sat 24 Oct (in 2 days)                                    │
│                                                               │
│ ▾ You agreed to deliver (3)   [checklist shown, ticks as files │
│                                 are added]                    │
│                                                               │
│ 1. Add files or a link                                        │
│    [  Drop files here · Choose files  ]                       │
│    Or paste a link: [ ........ ] [Add link]                  │
│ 2. Add a note (optional)                                      │
│ 3. [ Send for review ]   Preview as Rohit                     │
└───────────────────────────────────────────────────────────────┘
```

- **Keep** the drop zone, the link field and the three steps. They already work and read clearly.
- **Make the steps a real vertical form** (1, 2, 3 in order), not a decoration. Send button visible from the start but disabled with "Add at least one file first".
- **Merge** the empty "Files & links" card into the stage card. Show the added files as a list under step 1.
- **Merge** the checklist (What's included) into the upload area, ticking items as files are added. This makes the promise and the delivery visible together.
- **Remove** "Try it with sample files" from the real UI (move to a prototype tool). **Remove** "2 rounds left" and the second due date.
- **Hidden by default:** the checklist expands only if there are many items; the Details panel.
- **Visible by default:** stepper, one sentence, drop zone, link field, disabled Send button.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Stage line | "Stage 3 of 4 · in progress · Due Sat 24 Oct" | Delete (stepper) | Repeats card |
| Intro | "Upload your files. Rohit sees a watermarked preview." | "Add your work for Rohit. He will see a preview with a watermark. The originals stay with you until he pays." | Reminds her of the protection |
| Step 3 | "Preview and send" | "Send for review" | Matches the button |
| Step 2 | "Add a note" | "Add a note (optional)" | The optional note box says so later; say it early |
| Included | "What's included · agreed 10 Oct · 3 items" | "You agreed to deliver (3)" | Plain |
| Empty files card | "Files and links appear here once the work starts." | Removed. In the stage: "Nothing added yet" | The work has started |
| Link hint | "Use a view-only link. Rohit opens it in a new tab." | "Use a view-only link so Rohit cannot edit it." | Says why |
| Helper | "Try it with sample files" | Remove from the real page | Prototype helper |
| Send bar | "Reply due Wed 28 Oct" | "Rohit has 3 days to reply (by Wed 28 Oct)" | Plainer |
| Button | "Preview as Rohit" | "See what Rohit will see" | Clear |

## 6. Questions for the owner
- **Is the scope checklist ("What's included") something she should tick off while uploading?** I would pick: yes, as a gentle checklist that never blocks Send, because it is the main reason someone forgets a file.
- **Should "Send for review" be allowed with zero files?** I would pick: no, button stays disabled and says why.

## 7. Related screens
- **Before:** the previous stage was unlocked (or the contract was signed and the first stage started). She expects the next stage to open ready to upload.
- **After:** she clicks Send and lands on Screen A (In review). The page should confirm "Sent to Rohit. He has until Wed 28 Oct to reply" and show the same files.
- **Also:** the Files tab lists all files across stages. Files added here must appear there too; the tab should not be the only home.

---

# Side panel ("Details", closed by default in all three shots)

What it holds: client name + three icon buttons; "Next up"; "Money" (project value, advance, "Originals unlock: Once, after all stages / Stage by stage", "Balance due: 7 days after approval", "Clients pay you directly. No PayGuard fee in the beta."); "Contract" (You: Signed, client: Signed/Waiting, "Open the contract tab"); "Terms" (reply days, if no reply, rounds, extra round); "Contact".

Problems:
1. **It duplicates the page.** "Next up" repeats the header strip "Next: ...". "Contract" repeats the Contract tab. "Money" repeats the header "You get". (Medium)
2. **It mixes two kinds of things:** facts that change (Next up, advance paid) and fixed agreement terms (Terms, Contract). Someone opening it for "what did we agree?" must scan five sections. (Medium)
3. **Hidden, but its most useful part (the terms: reply window and auto-approval) is exactly what explains Screen A.** A beginner sees "approved automatically" with no way to know why without opening Details. (Medium)
4. **Three icon-only buttons** (email, edit, "view as") with no labels. (Small)

What to do: **keep the panel closed by default and turn it into "Agreement and client".** Remove "Next up", "Contract status" (the tab says it), and "Money" duplicates. Keep Terms, Money terms, Contact. In the in-review state, put one link in the card: "Why approved automatically? See terms".

---

# Page order (stage line, big card, feedback, files, approvals)

Today it is: stage line, big card, feedback history, files card, approvals table.
What she needs: where am I (path), what must I do now (stage card, with its files and its feedback), then everything else only if she asks.
So:
1. **Stepper** (replaces stage line and approvals table).
2. **Stage card** (with files and feedback inside).
3. Nothing else. The old cards go to the Files tab (all files) and the Activity tab (history).

Dead end with the current order: the real overview (the table) is the last block, and on the in-progress screen it sits below an empty card that apologises for having nothing in it.

---

# Top 5 things to fix on these screens

1. **Stop showing the same facts 3 or 4 times** (stage line, pill, big card, table row; files in the big card and the Files card). Replace stage line and Approvals table with one stepper; put the files inside the stage card.
2. **Make the one important thing the headline of each state:** "Waiting for Priya, approved automatically Sat 24 Oct" (in review); "Sana owes you ₹35,000, 4 days late" (awaiting payment); "Add your work, then Send for review" (in progress).
3. **Fix wrong or misleading text:** "0 of 2 approved" when a stage is approved; "Files appear once the work starts" after the work is done; "Due" dates shown when the work is already delivered; "Next:" pointing at a different stage.
4. **Make money buttons say what they do:** "I received the money", "Send Sana a reminder", "Unlock without payment" (with a confirm). Replace "Awaiting payment" with "Waiting for Sana to pay".
5. **Make the upload state a real three-step form** with a visible, disabled Send button, the checklist beside the drop zone, and no prototype helper ("Try it with sample files").
