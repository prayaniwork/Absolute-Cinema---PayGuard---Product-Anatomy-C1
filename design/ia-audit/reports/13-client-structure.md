# Report 13: The client's page structure (top bar, tabs, stage list, side panel)

Screens covered: the client's project page frame, as seen in `c12-all-stages.png`, `c13-contract-tab.png`, `c05-review-preview.png` and `c14-not-started.png`. Code: `cProject`, `clientTop`, `cSide`, `msRows`, `stageDetail`, `stageLine`, `contractView` in `prototype/nazar/app.js`.

"Information architecture" here just means: what sits where, what it is called, and how a person finds their way around. This report is about the frame around the client's page, not the content of each stage (other reviewers cover that).

---

## 1. The job of this page

**Who, when, and the 10-second test.** A client (for example Priya) opens the link she was sent. In under 10 seconds she must be able to answer: "Which project is this, where am I in it (stage 2 of 4), and what do I need to do right now?"

Smaller jobs, in order:
1. See the one thing waiting on her (sign, pay the advance, review a preview, pay for a stage), and do it.
2. See the whole path: what is done, what is now, what comes next, and what each stage costs.
3. Look things up when she wants to: the contract, the terms (days to reply, rounds of changes), the dates.

---

## 2. What is on the page today

**Top bar** (`clientTop`): the studio logo and "Meera Iyer Studio", a chevron, then the project name "Website redesign". On the right: the client's name ("Priya Nair") and a round avatar. In the screenshots the avatar reads "BS" (Bloom Studio, the client's company) next to the name "Priya Nair", so the two do not match. There is no link back to anything and no switcher.

**Tabs** (below the top bar): "Current stage" (becomes "Review" when a preview is waiting), "All stages" with a small count "4", and "Contract". Only one is active at a time.

**Main area** changes with the tab.
- *Current stage / Review*: a small line "Stage 2 of 4 · in review · Due Wed 21 Oct", then the stage card, which repeats "Stage 2 of 4" and the title "Homepage design" and a badge "Awaiting your approval", then "Preview only", the file tabs and the preview. Feedback card underneath.
- *All stages*: one card with four rows (accordion). Each row: number or tick, stage name, "Due ...", price, status badge, chevron. Opening a row shows only "What's included". The current stage is already open in c12.
- *Contract*: two badges "Meera signed" and "Priya signed", a "Download PDF" button, then the full contract (parties, 1. The work, 2. Payment, 3. Review and approval, 4. Files and ownership...). The contract table lists the same four stages, dates and prices again.

**Right-hand side panel** (always there, on every tab):
- Top: the "decide" block. In review it shows "Please reply by / Wed 21 Oct", the auto-approve sentence, "What's included", the **Approve** and **Ask for changes (2 left)** buttons, and the "After you approve, you pay ₹60,000 to Meera... Report a problem" note. In other states this block is empty.
- Then the studio card: "Meera Iyer Studio / Meera Iyer".
- Then three folded sections. "Project" is open: Total ₹1,60,000, Stages 4, Originals unlock "After each stage is paid". "Terms" is folded (reply days, if no reply, rounds, extra round fee). "Next up" is folded (dates).

**Bottom:** a dark prototype switcher ("View as ... Meera / Priya") that belongs to the prototype, not the product. Ignore it.

**Count of competing things** on the review screen (c05): 3 tabs, a stage line, a stage heading, a badge, a lock note, file tabs, the preview, a reply-by date, a scope list, two big buttons, a reassurance note, the studio card and three folded sections. That is about 15 separate things before she has looked at the work.

---

## 3. What is going wrong

1. **The client has no map of the project. (Big)**
   What you see: the only "where am I" clue is one grey line, "Stage 2 of 4 · in review · Due Wed 21 Oct", in small type above the content. The real path (Discovery done, Homepage design now, Inner pages and Handoff next) is only visible after she clicks the "All stages" tab.
   Why it confuses: a beginner reads the page as one lonely screen called "Homepage design". She does not see that stage 1 is finished and paid, or that two more come after. This is the biggest structure gap and matches the test finding that stages should feel like a stepper.

2. **Tabs and an accordion do the same job in two places. (Big)**
   "Current stage" and "All stages" both describe stages. The accordion rows in "All stages" open to show only "What's included", which is already in the side panel (in review state) and in the contract. A row cannot be opened to see that stage's preview, files, note or receipt. So the list looks like a place to go, but it is a dead end. The code even passes `go: true` to `msRows`, but nothing uses it, so the rows never take you to the stage.
   Why it confuses: the client clicks "Discovery" (already unlocked) expecting to download its files and only gets a bullet list of what was promised.

3. **The same facts are shown again and again. (Big)**
   - Stage number and title: top line "Stage 2 of 4", the card's "Stage 2 of 4 / Homepage design", and the accordion row.
   - Status: line "in review", badge "Awaiting your approval", and the "In review" pill on the All stages row.
   - Due date: stage line, "Please reply by", row "Due Wed 21 Oct".
   - "What's included": in the side panel (Review tab) and again in the accordion row (All stages tab), and a third time in the contract.
   - Total and stages: side panel "Project" and the contract table.
   - Money and unlock rule: "Originals unlock: After each stage is paid", plus "After you approve, you pay ₹60,000...", plus "The original files unlock when you approve and pay" in the lock note, plus contract section 4.
   This is exactly the "it shows the same details again and again" feedback.

4. **The side panel changes its job depending on the tab, and is wrong on two tabs. (Big)**
   On "All stages" (c12) and "Contract" (c13) the side panel still shows "Please reply by Wed 21 Oct" with Approve and Ask for changes buttons. On c12 it says "That date has passed", which reads as a warning while the client is just browsing the list. On the Contract tab, a client could press Approve while reading a legal document. The decision block belongs to the stage, not to the project frame.

5. **The side panel is half "what to do" and half "reference", with no clear order. (Medium)**
   The top (act now) and the lower parts (the studio card, project facts, terms, next up) are stacked in one column of the same weight. "Terms" and "Next up" are folded, so the client does not learn that "If you don't reply, it's approved automatically" or "2 rounds of changes" exist until she goes looking. In c05 the "What's included" heading in the side panel is empty (the screenshot caught the animation, but the code confirms the block is only drawn when a stage has a scope).
   Why it matters: the rules that most affect her money and time (auto-approval, change rounds, pay-within-days) are the ones hidden.

6. **The "Next up" section is too small to be useful, and the wrong kind of thing. (Medium)**
   It lists dates and labels ("Wed 21 Oct / Homepage design"), not what the client has to do. The real "what is next" is the next stage and what she must do then. Dates come from `nextEvents(3)`, which covers only this project.

7. **Tab names do not match what is inside. (Medium)**
   - "Current stage" turns into "Review" when something is waiting, so the first tab's name changes under her. "Review" and "Contract" read as if they are the same kind of thing as "All stages", but "Review" is a state and "All stages" is a list.
   - After approving, the first tab is called "Current stage" and shows "Awaiting payment" or "Unlocked". The client may think she is on a different stage than the one she just approved, because `focusMs` picks the first stage not yet closed.
   - The Contract tab holds the signature status ("Priya signed") which is a task when she has not signed, but a quiet record afterwards. Before signing the client is shown a separate page (`cContract`), so signing and viewing the contract are in two different places.

8. **The top bar says almost nothing and shows "who" in a confusing way. (Medium)**
   The crumb shows the studio and project, which is good, and correctly uses the studio name rather than PayGuard. But the right corner shows "Priya Nair" with a "BS" avatar: a person's name next to a company's initials. The avatar and name do not look like one person. Also nothing in the top bar tells her where to go if she has other projects with this freelancer.

9. **A client with 3 projects from the same freelancer has no structure for it. (Medium now, Big later)**
   The code has one current project (`D.cur`) per client view and no client-side project list. In c14 the top bar says "Meera Iyer Studio > Logo refresh" and the sidebar says nothing about "Website redesign". A client who has three links would have to remember three separate links. The side panel's "Next up" also sees only the project open now. With 3 projects she would want one tiny switcher: "Website redesign / Logo refresh / Brand guide" and one thing per project that needs her ("Review due Wed 21 Oct").
   This is a Medium today (the product targets one link per project) but it will become a real hole as soon as a happy freelancer reuses PayGuard with the same client.

10. **PayGuard leaks into the client's view. (Medium)**
    The preview watermark text reads "22 OCT 2026 · PAYGUARD" (see c05; code in `wmStyle`). The contract text says "PayGuard does not hold or handle the money". The top bar itself is clean (studio name only), and "PayGuard never holds your money" is on the payment page. Mentioning PayGuard in a small reassurance is fine, but the watermark brands the studio's work with a third party name, and the product rule is that the client side shows the studio name. Also `cEmpty` (no project) shows a "PayGuard" top bar.

11. **The first view is a card, not the next step. (Medium)**
    In c14 (not started) the top line says "Stage 1 of 2 · not started · Due Mon 26 Oct", but the card says "Pay ₹15,000 to start" and a badge "Advance due". The word "stage" is used for something that has not started and cannot be done until she pays. Better to say "Step 1: Pay the advance". The advance is not a stage, but it sits inside Stage 1 as if it were.

12. **Small things. (Small)**
    - The accordion uses a tick for approved stages but a number for the rest, and a black filled circle for the current one. Good idea, but no label says "You are here".
    - "In review" (row pill) vs "Awaiting your approval" (badge) vs "in review" (stage line) are three phrases for one state.
    - Prices ("₹30,000") are shown on every stage row, even before the client has to care. Fine, but this is where "Paid / Unlocked / Awaiting payment" money confusion begins, because the badge next to the price says "Unlocked", not "Paid".
    - On the All stages tab, the empty white space below the card (half the screen) could hold the path.

**What already works (keep):**
- The top bar crumb: studio name then project name, with no PayGuard.
- One short line saying "Stage 2 of 4". It is the right idea, just too small and in the wrong place.
- The accordion row pattern: number or tick, name, due date, price, status. It is easy to scan.
- The studio card in the side panel: it answers "who is this from?"
- Folded details for the project facts and terms: right idea, wrong content split (see below).
- The decide block is nicely tight: date, scope, two buttons, one reassurance line.

---

## 4. What the page should look like (information architecture)

**Short answer on "stepper vs tabs plus accordion":** use a **stepper** as the spine of the page, always visible. Replace "Current stage / All stages" with it. A stepper (a row or column of numbered stages with ticks for done and a highlight on the current one) answers "where am I, what is done, what is next" in one glance, without a click. Keep **one** extra tab only for the contract.

**Sketch (desktop):**

```
+-----------------------------------------------------------------------------+
| [M] Meera Iyer Studio  >  Website redesign        [Other projects v]  Priya |
+-----------------------------------------------------------------------------+
| Website redesign   ₹1,60,000 total      Contract: signed by both  [View]    |
|                                                                             |
|  (v) Discovery ----- (2) Homepage design ----- (3) Inner pages --- (4) Handoff
|   Unlocked          YOU ARE HERE: Review       Not started        Not started|
|                                                                             |
|  +---------------------------------------------+  +----------------------+  |
|  | NEXT STEP FOR YOU                           |  | About this project   |  |
|  | Review Homepage design, reply by Wed 21 Oct |  | From Meera Iyer      |  |
|  | [Approve]  [Ask for changes (2 left)]       |  | Total, advance       |  |
|  +---------------------------------------------+  | How replying works   |  |
|  | Preview (watermarked)                       |  |  (3 days, auto-      |  |
|  |  file tabs, the work                        |  |  approve, 2 rounds)  |  |
|  +---------------------------------------------+  | Dates                |  |
|  | Changes and notes                           |  +----------------------+  |
|  +---------------------------------------------+                            |
+-----------------------------------------------------------------------------+
```

Top to bottom, with reasons:

1. **Top bar: studio name > project name, plus a small project switcher if there is more than one project.** Keep as is. Add the switcher only when needed. Reason: the client always knows whose work this is and which project. Fix the avatar so name and initials match (use the client's person initials, "PN").
2. **Project strip (one line): project name, total, contract state with a "View contract" link.** Move the Contract tab here. Reason: the contract is a record, not a place she works in. A first-class "Waiting for your signature" state goes in this strip (and becomes the big first step before signing), then fades to "Signed by both" once done.
3. **Stepper, always visible: Advance (only if there is one), then each stage, as numbered dots with ticks, the current one filled.** Under each dot: short name and one status word from a small set: "Done", "Your turn", "Meera's turn", "Not started". Clicking a dot opens that stage below. Reason: replaces "Current stage", "All stages" and the stage line, and removes three repeated facts. The advance should be its own first dot ("Pay advance") rather than a stage.
4. **The "Your next step" card, directly under the stepper.** It holds the one thing she must do and the buttons, such as "Review Homepage design, reply by Wed 21 Oct" with Approve and Ask for changes. Reason: this is what moves out of the side panel's top and stops showing on the wrong tabs. If nothing is waiting, it says what happens next: "Meera is working on Inner pages. Due Mon 9 Nov."
5. **The selected stage's content**: preview or files, notes, receipts. Reason: files and links live inside the stage (user test finding). Every stage dot opens its own content: a past stage shows its originals and receipt; a future stage shows what is included.
6. **Right panel = reference only, never actions.** Keep: the studio card, "Project" facts (total, advance, when originals unlock), and the rules ("Terms") **open by default**, written as plain sentences. Move "Next up" out (the stepper now covers it) or keep a three-line "Dates" list. Reason: one job for each place.
7. **Contract**: a link in the project strip that opens the contract (a side sheet or a page). Reason: the contract is already summarised in the right panel; the full text is read once.

**Keep / move / remove / merge**
- **Keep:** top crumb, accordion row look (reuse for the stepper's detail), studio card, decide block content.
- **Move:** the decide block (Approve / Ask for changes) from the side panel into the main column under the stepper; the Contract tab into a link in the project strip; "What's included" into the stage the client is looking at.
- **Remove:** the "Current stage / Review" tab that renames itself; the stage line "Stage 2 of 4 · in review · Due ..." (the stepper replaces it); the "What's included" duplicate in the side panel; "Next up" as a separate folded section.
- **Merge:** "All stages" and "Current stage" into the stepper; the three status wordings into one set; "Project" and "Terms" side-panel sections into one "How this works" section.

**Visible by default vs behind a click**
- Visible: top bar, project strip, stepper, "your next step", the selected stage.
- One click: another stage's content, the full contract, the other projects, the dates list.
- Terms: on by default on first visit (it is the part clients miss); after that, folded.

**What the side panel gives that the main page does not today:** who the work is from (studio card), the money and unlock rule, and the review rules (days, auto-approve, rounds, extra round fee). These are real, but today they are hidden behind two folds. What the side panel does *not* give is a way around the project, which is what the stepper should give.

**With 3 projects from the same freelancer:** the top bar gets a project switcher ("Website redesign, Logo refresh, Brand guide"), and each item shows one status word ("Your turn: review", "Waiting on Meera", "Pay advance"). Pick the project that needs the client first. Inside a project, nothing changes. The side panel stays about the open project only.

**Phone:** stepper becomes a vertical list or a compact "Stage 2 of 4" bar that expands; the next-step card comes right under it; the "About this project" panel moves to the bottom behind a fold.

---

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Tab | "Current stage" / "Review" (renames itself) | Remove; use the stepper | A tab that changes its name is confusing. |
| Tab | "All stages 4" | Stepper | Same job, one place. |
| Stage line | "Stage 2 of 4 · in review · Due Wed 21 Oct" | Stepper label: "Stage 2 of 4: Your turn" | One short status set. |
| Card heading status | "Awaiting your approval" | "Your turn: approve or ask for changes" | Says who acts. |
| Row pill | "In review" | "Your turn" (client) | Same state as above, one name. |
| Row pill | "Not started" | "Next" or "Not started" | Fine; keep consistent. |
| Row pill | "Unlocked" | "Done: originals unlocked" | A client may not know "unlocked" means paid. |
| Pre-start card | "Pay ₹15,000 to start" with badge "Advance due" | "Step 1: Pay your advance, ₹15,000" | The advance is a step, not a stage. |
| Pre-start line | "Stage 1 of 2 · not started" | Hide until the advance is paid | Do not number a stage that cannot start. |
| Side panel | "Please reply by / Wed 21 Oct" | "Reply by Wed 21 Oct" | Shorter. Say it inside the next-step card. |
| Side panel | "That date has passed. It's approved automatically on Sat 24 Oct unless you reply." | "The reply date has passed. If you do nothing, this stage is approved on Sat 24 Oct." | Plain, says what happens. |
| Side panel | "Project" | "About this project" | Names what is in it. |
| Side panel | "Terms" | "How replying and changes work" | "Terms" sounds legal and gets skipped. |
| Side panel | "Originals unlock: After each stage is paid" | "You get the original files after you pay for each stage" | Full sentence, user-first. |
| Side panel | "Next up" | "Coming up" or remove | It lists dates only. |
| Top right | "Priya Nair" + "BS" avatar | "Priya Nair" + "PN" avatar | Match name and initials. |
| Watermark | "22 OCT 2026 · PAYGUARD" | "22 OCT 2026 · Meera Iyer Studio" (or no brand) | The client side shows the studio, not PayGuard. |
| Contract tab | "Priya signed" / "waiting to sign" | "Signed by you on 20 Sep" / "Needs your signature" | Say "you" to the client. |
| Contract page | "Meera signed" | "Signed by Meera Iyer Studio" | Say who in full. |
| Empty page | "PayGuard" top bar | The studio name, or nothing | Same rule. |

---

## 6. Questions for the owner

1. **Should the client's Contract live as a tab or as a link?** I would pick a link in the project strip, because it is a record she reads once. If you want to keep a tab, keep it, but remove the decide block from it either way.
2. **Does a client with several projects come in through separate links or one link with a list?** I would pick one link per project for now, and add a small switcher later. The structure above leaves room for it.
3. **Should the advance be its own step before Stage 1 in the stepper?** I would pick yes. It is paid separately and to the freelancer; calling it part of "Stage 1" blurs the path.
4. **Do you want "Terms" open by default on the first visit?** I would pick yes, because they affect money and time and clients skip folded sections.
5. **Is it acceptable to take PayGuard off the watermark?** I would pick yes for the studio's trust, but you may want a small "Preview, protected by PayGuard" label somewhere neutral. That is a brand choice.

---

## 7. Related screens

- **Before:** the invite page (`cInvite`, c01) and the contract-signing page (`cContract`, c02) use the same top bar and side panel but without tabs. After she signs, the client lands on this frame with no first-run explanation. The stepper should appear from the invite page on, so the path she saw before signing is the path she sees after.
- **After:** the stage content pages (preview and approve modals c05-c07, checkout c08-c09, unlocked c10, dispute c11) all sit inside this frame. After Approve, she should return to the same stepper with the current stage showing "Pay ₹60,000". After pay, the stage dot turns to a tick, and the next step moves to the next dot. Today the "Next: Inner pages" button on the unlocked card is the only forward link; with a stepper it becomes a dot.
- **Freelancer side:** the freelancer's project page has its own tabs (Stages, Files, Contract, Activity). Keep the client's structure shorter and mirrored: same stage names and the same status words, so when they talk on a call they describe the same thing.

---

## Top 5 things to fix on these screens

1. Add an always-visible stepper (advance, then each stage, with ticks and "you are here") and remove the "Current stage / All stages" tab pair and the tiny stage line.
2. Take the decide block (Approve, Ask for changes, reply-by date) out of the side panel and put it in a "Your next step" card in the main column, so it never shows on the Contract or All stages views.
3. Stop repeating the same facts: stage number, status, due date, "What's included", total and unlock rule each appear in two to four places. Pick one home for each.
4. Make stages clickable into their own content (preview, originals, receipt), so the list is a path and not a dead-end list of bullets; use one set of status words ("Your turn", "Meera's turn", "Done", "Not started").
5. Open the rules that matter (reply days, auto-approve, change rounds, when originals unlock) by default in plain sentences, and fix the small leaks: PayGuard in the watermark, the "BS" avatar next to "Priya Nair", and the missing project switcher for clients with several projects.
