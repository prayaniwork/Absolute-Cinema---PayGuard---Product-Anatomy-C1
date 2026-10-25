# Report 07: Freelancer project page, "stuck or finished" states

Screens covered (freelancer view, Stages tab):
- A. Changes requested (`f18-project-changes.png`, Tidal Health / Flows)
- B. Waiting: advance due (`f19`, Saffron Hotels / Logo options). The same code branch also shows "contract unsigned" and "previous stage not unlocked yet" (no screenshot, read from code).
- C. On hold, client reported a problem (`f20`, Studio Nine / Style frames)
- D. Unlocked, all done (`f21`, Orbit Labs / Final deck)

Code read: `sProject`, `homeHero` (every branch), `stageLine`, `feedbackCard`, `approvalsCard`, `projSide`, plus `filesCard`, `attentionFor`, `stageDetail` for context.

## First, how this page is built (so the problems make sense)

Every state of the Stages tab is the same stack of boxes, top to bottom:

1. A small line: "Stage 2 of 3 · changes requested · Due Tue 27 Oct" (`stageLine`)
2. A big "hero" card for the current stage (`homeHero`). This is the only part that changes a lot between states.
3. "Feedback history" card (`feedbackCard`), only if there was feedback.
4. "Files & links" card (`filesCard`).
5. "Approvals" table (`approvalsCard`): one row per stage.
6. An optional "Details" side panel on the right (`projSide`): Next up, Money, Contract, Terms, Contact.

Above all that: a summary strip ("You get ₹1,25,000 · Next: Flows · Tue 27 Oct") and four tabs (Stages, Files, Contract, Activity).

So the page always says "here are four more boxes", even when the freelancer's only real question is "what do I do now?". That is the root of most problems below.

---

# Screen A. Changes requested

## 1. The job of this page
**Who and when:** the freelancer, after the client asked for changes. In under 10 seconds they must see *what the client asked for* and *where to upload the fix*.

Smaller jobs, in order:
1. Read the client's note.
2. Upload the revised work and send it back.
3. Know how many change rounds are left (so they are not surprised by a charge or a "no").

## 2. What is on the page today
- **Top strip:** "Tidal Health · Vikram Rao · You get ₹1,25,000 · Next: Flows · Tue 27 Oct". Tabs: Stages 3, Files, Contract, Activity.
- **Stage line:** "Stage 2 of 3 · changes requested · Due Tue 27 Oct".
- **Hero card:** badge "Changes requested"; title "Flows"; "Upload the revised files."; "Due Tue 27 Oct · in 5 days · 1 round of changes left"; a collapsed box "What's included · agreed 10 Oct · 2 items"; a yellow note "Changes requested · round 1 of 2 — The second step feels crowded. Can we split it into two screens?"; then a three-step upload box ("1 Add your work, 2 Add a note, 3 Preview and send"), a big drop zone with "Choose files", "Or add a link (Figma, Loom, Miro and others)" with an input and "Add link", the hint "Use a view-only link. Vikram opens it in a new tab.", and a small "Try it with sample files" link.
- **Feedback history card:** "1 of 2 rounds used"; "Meera sent version 1 · 20 Oct"; "Vikram asked for changes (round 1) · 22 Oct" and the *same note again* in a grey bubble.
- **Files & links card:** "0" and "Files and links appear here once the work starts."
- **Approvals table:** three rows. Row 2 has a purple "Changes" pill.
- **Right panel (when open):** Next up, Money, Contract, Terms, Contact.

Competing things on screen: about 8 separate blocks, 3 different places that say "1 of 2 / 1 left" about rounds, and 2 places that show the same client note.

## 3. What is going wrong
1. **The client's note appears twice.** Yellow box in the hero, then again in "Feedback history". The user thinks "did he ask twice?". *Medium.*
2. **Rounds are counted three ways.** Hero: "1 round of changes left". Yellow box: "round 1 of 2". Feedback card: "1 of 2 rounds used". Same fact, three phrasings ("left", "of 2", "used"). Beginners have to do maths to see they agree. *Medium.*
3. **"Files & links: 0 — appear here once the work starts" is wrong here.** Version 1 was already sent (20 Oct), and the freelancer is mid-work. The empty message contradicts the history right above it. It also duplicates the upload box in the hero. This is the "same thing again and again" complaint. *Big.*
4. **The upload box is a three-step wizard (Add your work / Add a note / Preview and send), but the steps are tiny and only a label.** The note step is not visible until a file is added, so the freelancer does not know it exists. Also the stepper in the hero is a different stepper from the stage list below. Two steppers on one page. *Medium.*
5. **No sign of what the client's change refers to.** The note says "the second step", but the freelancer cannot see the version 1 files they sent (Files card is empty). They have to remember. *Medium.*
6. **"What's included · agreed 10 Oct · 2 items" is a collapsed grey bar between the title and the client's note.** It is useful (it settles arguments about scope) but it sits before the more urgent note and looks like a disabled control. *Small.*
7. **"Stage 2 of 3 · changes requested · Due Tue 27 Oct" repeats the badge, the title area and the "Due" line.** Status shown three times (stage line, badge, Approvals pill, which says "Changes" not "Changes requested"). *Medium.*
8. **Approvals table says "Approver: Vikram" on every row.** One person is the approver for all rows, so the column carries no information. *Small.*
9. **"Try it with sample files" is a prototype helper** sitting in the real UI, styled like a real link. *Small* (remove before real users).
10. **What happens when rounds run out is hidden.** "1 round of changes left" does not say what happens after (extra round fee? free?). The answer is only in the Terms section of the side panel, collapsed. *Small now, Big on the last round.*

## 4. What the page should look like (information architecture)

Rule for every state: **one "current stage" card that answers "what do I do next?", then the path, then the history.** Everything else is behind a click.

```
[ Client · You get ₹ · Next date ]            tabs: Stages · Contract · Activity
-------------------------------------------------------------
STAGE PATH (stepper)
 (1 Research ✓ Unlocked) ── (2 Flows ● Changes requested) ── (3 Specs ○ Not started)
-------------------------------------------------------------
CURRENT STAGE: Flows                           [Changes requested]
  Vikram asked for changes (round 1 of 2, 22 Oct)
  "The second step feels crowded. Can we split it into two screens?"
  Version 1 you sent: [file] [file]            <- link, collapsed
  ---------------------------------------------
  Your fix:   [ Drop files / Choose files ]  [ or paste a link ]
              Note to Vikram (optional)
              [ Send version 2 for review ]
  Small print: 1 change round left after this one. Due Tue 27 Oct.
-------------------------------------------------------------
  > What's included in this stage (2 items)        (collapsed)
  > Feedback history (1 round)                      (collapsed, only if >1 round)
```

- **Keep:** the yellow client note as the top item; the upload area; the "What's included" bar.
- **Merge:** hero note + feedback history first entry (show only the latest note up top; older rounds collapse). Hero "rounds left" + yellow "round x of y" + history "x of y used" into one line.
- **Move:** the Files & links card and Approvals table into the stepper. Files belong *inside the stage* (the team already said so). The Approvals table becomes the stepper; clicking a step opens that stage.
- **Remove:** "Files & links 0" card on this page; "Approver" column; "Try it with sample files".
- **Visible by default:** stepper, client note, upload, send button. **Behind a click:** history, what's included, terms.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Hero subtitle | "Upload the revised files." | "Vikram wants changes. Upload version 2." | Names the client and the next version |
| Rounds | "1 round of changes left" / "round 1 of 2" / "1 of 2 rounds used" | One phrase everywhere: "Round 1 of 2 used" | One way to count |
| Stage line | "Stage 2 of 3 · changes requested · Due Tue 27 Oct" | Delete (the stepper says this) | Said three times |
| Approvals pill | "Changes" | "Changes requested" | Same word as the badge |
| Files card empty | "Files and links appear here once the work starts." | (remove) or "Version 1: 2 files" | Work has already started |
| Step 3 label | "Preview and send" | "Send for review" | The button says "Send for review" |
| Link hint | "Use a view-only link. Vikram opens it in a new tab." | "Make sure the link is view-only. Vikram opens it in a new tab." | Clearer instruction |

## 6. Questions for the owner
- Do old rounds need to stay visible on this page, or only in Activity? **I would pick:** latest round on the page, the rest in a collapsed list, because the freelancer only acts on the latest note.
- Can the freelancer *reply* to the client's note without uploading (for example "I will split it, new version tomorrow")? **I would pick:** yes, optional, it already exists on the dispute branch and costs nothing.

## 7. Related screens
- **Before:** the client's "Ask for changes" screen and the Today row "Changes requested · round 1 of 2 … Open". The note text should match word for word.
- **After:** the freelancer sends version 2 and the page becomes "In review". The client sees a new preview. The upload area should visibly turn into "Sent. Vikram has until 27 Oct to reply."

---

# Screen B. Waiting: advance due / contract unsigned / not started

## 1. The job of this page
**Who and when:** the freelancer, right after the project is set up, or when the client is slow. In under 10 seconds they must see *what exactly is blocking work* and *who has to act* (the client) and *what they can do about it* (remind, or mark paid).

Smaller jobs:
1. Remind the client with one click.
2. Mark the advance as paid if the money already arrived by UPI.
3. Check the "waiting" is real (has the client even opened the link?).

## 2. What is on the page today
Three different sub-states share one code branch (`status === 'draft'`):

- **Contract unsigned:** subtitle "Waiting for Meher to sign the contract." Buttons "Remind Meher" plus trace "Link opened …". Lock box: "Uploads open when this stage starts. Once Meher signs the contract."
- **Advance due (screenshot):** badge top-right "Advance due" (grey). Title "Logo options". Subtitle "Waiting for Meher to pay the ₹15,000 advance (25%)." Amber chip "Advance 5 days late · link opened 6 days ago". Line "Due Mon 26 Oct · in 4 days · 2 rounds of changes left". Grey "What's included · 1 item". Buttons "Remind Meher" (outline) and "Mark advance as paid" (black). Text "Auto-reminded today · Link opened 6 days ago". Then the grey locked box "Uploads open when this stage starts / Once the advance is paid."
- **Not started, previous stage not unlocked:** subtitle "This stage starts once the previous one is unlocked." No buttons. Lock box "After the previous stage is unlocked."
- Below, as always: "Files & links 0 — Files and links appear here once the work starts." and Approvals with "Not started" on every row.
- Summary strip: "You get ₹60,000 · Next: Logo options · Mon 26 Oct".

Things competing: grey status badge, amber late chip, due/rounds line, scope bar, two buttons, a grey trace line, a locked box, an empty files card, an approvals table full of "Not started". About 9 items, and none of them is bigger than the title.

## 3. What is going wrong
1. **"Waiting for the client" is a sentence under the title, not the main message.** This is exactly what the meeting flagged. The first thing a freelancer needs to know ("you cannot start; Meher has to do X") is grey 14px text. The biggest thing on the card is the *stage name* "Logo options", which is not the problem. *Big.*
2. **The page has the wrong shape for the first step.** Signing the contract, then paying the advance, then work starts, is a path with 2 or 3 steps. The page shows it as one sentence that changes. A beginner cannot see "contract ✓ → advance ○ → stage 1 ○". *Big.*
3. **Status words clash.** Header badge says "Advance due" (grey). The stage line says "not started". The amber chip says "Advance 5 days late". The Approvals row says "Not started". Four labels for one situation. "Advance due" in grey sounds like a neutral note, while the amber chip says it is late. *Big.*
4. **Contradiction in time.** The card says "Due Mon 26 Oct · in 4 days" for a stage that cannot start. It is the stage's delivery date, but a freelancer reads it as "I have 4 days to deliver", while work is locked. Also "2 rounds of changes left" is meaningless before any work exists. *Medium.*
5. **The locked "Uploads open…" box is a big grey dead area.** It takes the space of the upload box, which is the biggest control on the other states. It does nothing and cannot be clicked. It repeats the subtitle ("Once the advance is paid" = "Waiting for Meher to pay the advance"). It looks like a disabled form, which makes beginners think something is broken. *Big.*
6. **"Remind Meher" and "Mark advance as paid" are both unclear.** "Remind" does not say how (WhatsApp? email? what will it say?). "Mark advance as paid" does not say what happens next (does the stage start? is the client told?). *Medium.*
7. **"Mark advance as paid" is the black (primary) button, "Remind" is outline.** The more common, safer action is Remind. The primary style pushes the freelancer toward a record-keeping action that is easy to do by mistake. *Medium.*
8. **Trace text is easy to miss and long:** "Auto-reminded today · Link opened 6 days ago", plus the amber chip also says "link opened 6 days ago". The same "link opened" fact appears twice on one card. *Medium.*
9. **"Files & links 0" and the Approvals table of "Not started" rows add nothing here.** Both are empty or identical. The history of a project that has not started is empty by definition. *Medium.*
10. **In the contract-unsigned branch the freelancer cannot open the contract from the hero.** The "Open the contract tab" link is buried in the collapsed Contract section of the side panel. The tab itself exists, but nothing on the card points to it. *Medium.*
11. **Money split: advance shown as a "payment".** "Advance 5 days late" suggests Meher broke a rule. If the contract gave a different deadline, the freelancer is not told what it was. *Small.*
12. **"Uploads open when this stage starts"** uses "starts", but the stage line says "not started" and the badge says "Advance due". Three verbs for the same gate: starts / due / not started. *Small.*

## 4. What the page should look like (information architecture)

Make this a **"Get started" checklist**. It is the same stepper as the rest of the project, with two extra steps in front of stage 1.

```
[ Client · You get ₹ · Next date ]            tabs: Stages · Contract · Activity
-------------------------------------------------------------
BIG STATUS BANNER (amber, top of the page)
  Waiting for Meher to pay the ₹15,000 advance
  5 days late · link opened 6 days ago · reminded today
  [ Remind Meher ]   [ Already paid? Mark as paid ]  (text link style)
-------------------------------------------------------------
THE PATH (stepper, always visible)
 (✓ Contract signed by both)──(● Advance ₹15,000  WAITING FOR MEHER)──(○ 1 Logo options)──(○ 2 Brand sheet)
-------------------------------------------------------------
  > Logo options: what's included (1 item) · due Mon 26 Oct   (collapsed)
```

For **contract unsigned**, the banner and first step are "Waiting for Meher to sign the contract" with a "View contract" button and "Remind Meher". For **previous stage not unlocked**, show a small note on the stage ("Starts after Stage 1 is unlocked") with no banner, and the stepper does the rest.

- **Keep:** the two actions, the "link opened / reminded" trace (merge into the banner), the "what's included" bar.
- **Move:** the blocking message from small text to a banner at the top. Contract and advance become the first two steps of the stepper (this is the meeting's "first-class" step).
- **Remove:** the grey locked upload box (the stepper already shows uploads come later); "Files & links 0" card; the Approvals table (replaced by the stepper); "2 rounds of changes left"; the grey "Advance due" badge (the banner replaces it).
- **Merge:** "Waiting for…" subtitle + amber late chip + "Advance due" badge + Approvals "Not started" → one banner.
- **Visible by default:** banner, path, the two actions. **Behind a click:** what's included, terms, activity.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Badge | "Advance due" | (remove, banner replaces it) | Four labels for one thing |
| Subtitle | "Waiting for Meher to pay the ₹15,000 advance (25%)." | Banner: "Waiting for Meher to pay the ₹15,000 advance" | Make it the headline; the % is in the contract |
| Amber chip | "Advance 5 days late · link opened 6 days ago" | "5 days late. Meher opened the link 6 days ago." | Plain sentences |
| Button | "Mark advance as paid" | "Meher already paid me" | Says what the freelancer knows, not what the system does |
| Button | "Remind Meher" | "Send Meher a reminder" (hint: "by WhatsApp") | Says what happens |
| Locked box | "Uploads open when this stage starts · Once the advance is paid." | Remove, or one line: "You can upload once the advance is paid." | Not a big dead box |
| Contract branch | "Waiting for Meher to sign the contract." | "Waiting for Meher to sign. Work cannot start until they do." | Says the consequence |
| Not started | "This stage starts once the previous one is unlocked." | "Starts after Stage 1 is unlocked." | Shorter |
| Due line | "Due Mon 26 Oct · in 4 days · 2 rounds of changes left" | "Planned delivery: Mon 26 Oct" (hide rounds) | Rounds mean nothing yet |
| Trace | "Auto-reminded today · Link opened 6 days ago" | "Last reminder: today. Link opened 6 days ago." | Said once |

## 6. Questions for the owner
- If the advance is late, should the due date of stage 1 move? **I would pick:** show a quiet note "Delivery date moves when the advance arrives", because the freelancer should not feel they are late.
- Should "Mark as paid" ask for the date/how (UPI, cash)? **I would pick:** yes, one small drop-down, as it feeds the receipt.
- Who sees "contract unsigned" first: the freelancer's Today list or this page? Both already do. **I would pick:** keep both, but this page must be the place that explains.

## 7. Related screens
- **Before:** the plan page, then the "Send contract" step. After sending, the freelancer lands here and should see "Contract sent to Meher. Waiting for signature" as step 1 in progress, not a grey badge.
- **After:** when the client signs or pays, this page flips to the "In progress" upload state. The banner should turn green for a moment ("Meher paid the advance. Stage 1 is open").
- The client sees the equivalent screen (sign / pay advance). The words "advance" and "contract" must match.

---

# Screen C. On hold (the client reported a problem)

## 1. The job of this page
**Who and when:** the freelancer, upset or worried, after the client reported a problem (here, "The work wasn't delivered"). In under 10 seconds they must see *what the client said* and *the Reply button*.

Smaller jobs:
1. Know the deadline to reply and what happens if they miss it.
2. Reply with a plan and a date.
3. (Maybe) just upload the work if the problem was that nothing was delivered.

## 2. What is on the page today
- **Stage line:** "Stage 1 of 2 · on hold · Due Tue 20 Oct".
- **Hero card:** red badge "On hold"; title "Isha reported a problem with Style frames"; "Approval is on hold until you reply. Reply by Mon 26 Oct (in 4 days)."; grey "What's included · agreed 10 Oct · 1 item"; red note "The work wasn't delivered — These were due two days ago and I haven't seen anything yet. Can you share where things are?"; a grey bar "Reply to Isha — Say what you'll do and by when. Approval stays on hold until you do." with black "Reply" button.
- **Feedback history:** "0 of 2 rounds used"; "Isha reported a problem 21 Oct" and the same text again.
- **Files & links:** "0 — Files and links appear here once the work starts."
- **Approvals:** row 1 red "On hold", row 2 "Not started".

## 3. What is going wrong
1. **The note appears twice** (red box and Feedback history), word for word. *Medium.*
2. **The Reply button is small, inside a grey bar below the red note.** It is the one thing the freelancer must do, and it is visually weaker than the red note. The order is right (problem, then reply), but the button should be the strongest thing on the card. *Medium.*
3. **"Approval is on hold until you reply"** is confusing. Whose approval? Beginners may think their own approval, or their money, is held. The real meaning: "Isha cannot approve or pay for this stage until you answer". Also a freelancer might think "on hold" means the *project* is paused. *Big.*
4. **The page does not say what the freelancer's real options are.** Here the problem is "nothing delivered", so the honest fix is "upload the work". But the upload box does not exist in this state, and the Files card says "appear here once the work starts". Work did not start (maybe it was done outside the app). The freelancer is stuck: Reply is the only action, and a reply is just text. *Big.*
5. **"Feedback history · 0 of 2 rounds used"** is irrelevant for a problem report and implies a revision round is in play. It is only confusing. *Medium.*
6. **Missing: what happens if I do not reply in time?** The only hint is "(in 4 days)". After the deadline the page says "The reply window has closed. Reach out to Isha directly" (code), which is a dead end with no button. *Medium.*
7. **Status words:** "On hold" (badge), "on hold" (stage line), "On hold" (Approvals pill). Consistent but the badge is red while the stage is "Due Tue 20 Oct" (a past date, shown plain). The overdue delivery is not marked as late here, while on the Waiting state it is. Lateness is shown inconsistently. *Medium.*
8. **The title is a sentence about Isha, not the stage.** Other states title the card with the stage name. Here the stage name is buried inside a sentence. It breaks the pattern, though it does work as the headline. *Small.*
9. **The "reasons" list is the client's wording** ("The work wasn't delivered"), but the freelancer sees it as bold label plus quote, so it reads like two different messages. *Small.*
10. **The right-hand Details panel and its Terms are hidden.** The rule for "what counts as a problem" and "how many days to reply" matter most here, and they are hidden. *Small.*

## 4. What the page should look like (information architecture)

```
[ Client · You get ₹ · Next date ]            tabs: Stages · Contract · Activity
-------------------------------------------------------------
RED BANNER
  Isha reported a problem with Style frames
  "The work wasn't delivered. These were due two days ago..."   (shown ONCE)
  Reply by Mon 26 Oct (4 days left). Until you reply, Isha cannot approve or pay.
  [ Reply to Isha ]   [ Upload work instead ] (only if relevant)
-------------------------------------------------------------
STAGE PATH:  (1 Style frames ● On hold) ── (2 Final set ○ Not started)
-------------------------------------------------------------
  > What's included in this stage      > Full history (1 event)
```

- **Keep:** red note; the Reply flow; the reply deadline.
- **Move:** Reply button *inside* the red banner as the primary button.
- **Remove:** the Feedback history card on this page (it duplicates the red note; keep it for later in the stage's history); the empty Files card; the "0 of 2 rounds" count.
- **Merge:** red note + history; "On hold" badge + stage line + Approvals pill.
- **Add:** a plain sentence on what "on hold" means; an "Upload work" path when the reason is "not delivered".
- **Visible by default:** banner and Reply. **Behind a click:** what's included, history, terms.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Subtitle | "Approval is on hold until you reply." | "Isha cannot approve or pay until you reply." | Says who is blocked |
| Subtitle | "Reply by Mon 26 Oct (in 4 days)." | "Please reply by Mon 26 Oct (4 days left)." | Friendlier, same info |
| Grey bar title | "Reply to Isha" | (move into banner) button: "Reply to Isha" | One place |
| Grey bar text | "Say what you'll do and by when. Approval stays on hold until you do." | "Tell Isha what you'll do and by when." | Second sentence repeats the subtitle |
| Feedback card | "0 of 2 rounds used" | (hide for problem reports) | Not a change round |
| Closed window | "The reply window has closed. Reach out to Isha directly." | "You did not reply in time. Message Isha now: [WhatsApp] [Email]" | Gives a button, not a dead end |
| Approvals pill | "On hold" | "Problem reported" | Says why, not just state |

## 6. Questions for the owner
- Is "On hold" the right word? **I would pick:** "Problem reported" for the stage and "On hold" only as a short explanation, because "hold" is vague about who holds what.
- What happens to the stage if the freelancer misses the reply window (auto-approve? auto-refund? nothing)? Not decided anywhere on this page. **I would pick:** nothing automatic; the page just offers contact buttons.
- Can the freelancer *dispute the dispute* ("I delivered it, here it is")? **I would pick:** yes, via Reply with an attached link or file.

## 7. Related screens
- **Before:** the client's "Report a problem" form (reasons list). The freelancer's red label must be the same wording.
- **After:** after Reply, the client sees the message and the stage goes back to the normal path (in progress or in review). The page should say "You replied on 22 Oct. Waiting for Isha." There is no "after replying" state on this page today. That gap is a separate finding.
- Today list shows "Isha reported a problem · Reply to Isha". Same words, good.

---

# Screen D. Unlocked (all done)

## 1. The job of this page
**Who and when:** the freelancer, after the client paid the final balance. In under 10 seconds they must see *"I got paid, everything is unlocked, I am finished"* and be able to *get the paperwork* (receipt, summary).

Smaller jobs:
1. Download or share the receipt and documents.
2. Confirm the client now has the originals (what did they get, how do they get it?).
3. Close the loop: archive, or start a new project with this client.

## 2. What is on the page today
- **Top strip:** "Orbit Labs · Neha Kapoor · You get ₹80,000". No "Next" item (nothing is coming up).
- **Stage line:** "Stage 3 of 3 · approved" (note: says "approved", not "unlocked").
- **Hero card:** green badge "Unlocked"; title "Final deck"; "Neha approved this. Neha paid ₹20,000 straight to you. Originals are unlocked."; outline button "Documents"; green note "All stages unlocked."
- **Files & links:** "0 — Files and links appear here once the work starts."
- **Approvals:** "3 of 3 approved", three green "Unlocked" pills.

## 3. What is going wrong
1. **"Files & links: 0 · appear here once the work starts" on a finished project.** The work is finished and unlocked, and the page says nothing is there. For the key moment of the product ("originals unlocked"), the freelancer cannot see *which files were unlocked*. (Prototype data may be empty, but the wording is also wrong for a finished project and must be fixed in the design.) *Big.*
2. **Mixed words: "approved" vs "unlocked".** Stage line says "approved", the card says "Unlocked", the table header says "3 of 3 approved" but each pill says "Unlocked". For a beginner, approved and unlocked sound like the same thing, but in the product they are different steps (client approves, then pays, then originals unlock). *Big.*
3. **The "done" state is just the normal page in green.** There is no celebration, no summary ("Project total ₹80,000 · received"), no next step. A finished project looks like an in-progress one that has lots of boxes left. *Medium.*
4. **Only the last stage is shown in the hero.** The summary in the hero ("Neha paid ₹20,000") covers only the final stage. The freelancer's real question is "did I get all ₹80,000?". The money is only in the Payments page. *Medium.*
5. **"All stages unlocked." green bar and "Unlocked" badge say the same thing** right next to each other. *Small.*
6. **"Documents" button is unclear.** Documents = receipt, summary, contract? The label does not say, and it sits next to nothing. *Medium.*
7. **No path out.** No "Archive", "Start another project for Orbit Labs", or "Ask Neha for a review" (though a review feature may not exist). Finished projects stay in the sidebar next to active ones. *Medium.*
8. **Summary strip says "You get ₹80,000" in the past tense situation.** Should say "You received". "You get" is a future word. *Medium.*
9. **"Neha paid ₹20,000 straight to you."** Good, plain and true to the product rules, but it says "paid" for the last stage while the contract used "advance + balance". The freelancer cannot tell what the ₹20,000 was (balance? full stage?). *Small.*
10. **Approvals table: "Approver" column and "Updated" dates** list "Neha" three times; again no information. *Small.*

## 4. What the page should look like (information architecture)

```
[ Client · You received ₹80,000 ]               tabs: Stages · Contract · Activity
-------------------------------------------------------------
GREEN SUMMARY
  Project complete. All 3 stages are unlocked.
  Neha paid ₹80,000 directly to you (last payment ₹20,000 on 21 Oct).
  [ Download receipt ]  [ Download all documents ]  [ Start a new project with Orbit Labs ]
-------------------------------------------------------------
STAGE PATH (all ticked): (1 Story ✓) ── (2 Design ✓) ── (3 Final deck ✓)   each = Unlocked, 6 Oct / 16 Oct / 21 Oct
   Click a stage -> its files (originals) and links
-------------------------------------------------------------
  > Activity (collapsed)
```

- **Keep:** the green state, the sentence "paid straight to you", the stepper of all ticks.
- **Move:** files into each stage (click a stage → the originals that were unlocked); documents into the summary.
- **Remove:** Files & links 0 card; separate "All stages unlocked." bar; the Approver column.
- **Merge:** "Unlocked" badge + "All stages unlocked" + "3 of 3 approved". One statement.
- **Add:** a total received number, and an optional "archive" or "start new project" action.
- **Visible by default:** summary and actions. **Behind a click:** stage files, activity.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Stage line | "Stage 3 of 3 · approved" | Delete, or "All stages done" | It says approved, the badge says unlocked |
| Hero text | "Neha approved this. Neha paid ₹20,000 straight to you. Originals are unlocked." | "Neha approved this and paid you ₹20,000 directly. The originals are now unlocked." | Reads as one event |
| Green bar | "All stages unlocked." | "Project complete. All originals are unlocked." | Says what happens next |
| Button | "Documents" | "Receipt and summary" | Names the contents |
| Top strip | "You get ₹80,000" | "You received ₹80,000" | Past tense when it is done |
| Files card | "Files and links appear here once the work starts." | "Originals: 6 files unlocked" with a list | The work is done |
| Table header | "3 of 3 approved" | "3 of 3 unlocked" | Same word as the pills |

## 6. Questions for the owner
- Where do the originals live after unlocking (this page, the client's link, both)? **I would pick:** both, because the freelancer needs to check what the client received.
- Should a finished project leave the main project list? **I would pick:** move it to a "Finished" group in the sidebar, so the list shows only active work.
- Does "Stage 3 of 3" ever show "approved" but not unlocked on this page? Yes, that is the "Awaiting payment" state, owned by another reviewer. Words must match between that state and this one.

## 7. Related screens
- **Before:** the "Awaiting payment" state (client approved, not paid yet), with "Mark as paid" and "Unlock anyway". This page is what that turns into. The change should feel earned, so the page needs a clear "moment".
- **After:** the client's "Unlocked, download your files" screen, the Payments page (money received) and Clients (finished project). Each should show the same total.

---

# Cross-cutting findings (all four screens)

1. **One layout for every state.** The same four boxes (hero, history, files, approvals) appear whether the freelancer must act (changes, on hold) or has nothing to do (unlocked). The page never says clearly "this is your move" or "this is the client's move".
2. **The "Files & links 0" card is wrong in three of four screens.** It says "once the work starts" on a project with work sent (A), on a locked stage (B is fine but empty) and on a finished project (D). It is also the "files should live inside a stage" finding from the meeting.
3. **Approvals table = stepper in disguise.** It is the only place the full path is visible, and it is placed at the bottom. The meeting asked for a stepper at the top.
4. **Status vocabulary drifts.** "Changes requested / Changes", "Advance due / not started / Advance late", "On hold", "approved / Unlocked". Each state has two or three names for itself.
5. **Same message twice.** Client note (A, C); link opened (B); "unlocked" (D); rounds (A).
6. **Details side panel** holds Money, Terms, Contract, Contact. It is collapsed by default in most views, yet in states B and C its content is exactly what the freelancer needs.
7. **"PayGuard" check:** in `feedbackCard`, an automatic approval is named "PayGuard" in the freelancer's view (`name()` returns 'PayGuard' for `who === 'system'`). That is fine on the freelancer side, but check the client view uses the studio name, as the product rules require. Not seen on these four screens.

---

# Top 5 things to fix on these screens

1. **Turn "waiting" into a top banner and a stepper step.** Contract signature and advance get a big banner ("Waiting for Meher to sign / pay") plus two first steps in the path. Remove the grey locked upload box and the small grey status badge. (Screen B, the meeting's main ask.)
2. **Replace the Approvals table and the "Files & links" card with one stepper where each stage holds its own files.** Never show "Files and links appear here once the work starts" on a project that has work or is finished. (All screens.)
3. **Show every message once.** Client note, rounds count, link opened, "unlocked" each appear in one place only; move history into a collapsed section. (A, B, C, D.)
4. **Make the next action the strongest thing on the card, and say whose move it is.** Reply to Isha (on hold), Upload version 2 (changes), Remind Meher (waiting), Download receipt (done). Say in one plain sentence what is blocked and why, for example "Isha cannot approve or pay until you reply". (A, B, C, D.)
5. **Fix the status words.** Use one name per state everywhere (card, stage line, stepper, Today list): "Changes requested", "Waiting for contract / advance", "Problem reported", "Unlocked". Do not use "approved" and "unlocked" for the same finished state; add a total-received summary and a way out (receipt, new project) to the finished state. (All screens.)
