# Report 11: The client reviewing a stage (Review tab, popups, phone)

Screens covered: the client's "Review" tab when a stage is waiting for approval, the Approve popup, the Ask for changes popup, the "in progress" version of the same page, and the phone version.
Code read: `cProject` (the `submitted` and `funded/changes` branches), `lockedPreview`, `previewStage`, `wmStyle`, `cSide`, `stageLine`, `feedbackCard`, and the approve popup. Screenshots: c04, c05, c06, c07, m03.

---

## Screen A: Review tab (stage is waiting for approval)

### 1. The job of this page
**Who and when:** the client (Priya) opens her link after the freelancer says "stage is ready". In under 10 seconds she must know: "I have to decide on this stage, by this date, and here is the work."

Smaller jobs, in order:
1. Look at the preview (the watermarked work).
2. Press **Approve** or **Ask for changes**.
3. Know what happens next (she pays, then originals unlock) and by when she must reply.

### 2. What is on the page today
**Top bar:** "Meera Iyer Studio > Website redesign", client name "Priya Nair" with an avatar ("BS").
**Tabs:** "Review", "All stages 4", "Contract".
**Left, top:** a line "Stage 2 of 4 · in review · Due Wed 21 Oct". Right below it, again: "Stage 2 of 4" (small label), the title "Homepage design", and a purple badge "Awaiting your approval".
**Left, middle:** a grey box: "Preview only. The original files unlock when you approve and pay." Then (if the freelancer wrote one) a "Note from Meera" box. Then file tabs "Moodboard.svg / References.pdf / Notes.docx", then a big preview with a tiled watermark.
**Left, bottom:** "Feedback history" appears only after a change round.
**Right panel (352px wide), top to bottom:**
- "Please reply by / Wed 21 Oct / That date has passed. It's approved automatically on Sat 24 Oct unless you reply."
- "What's included" with 3 ticks (Desktop and mobile homepage in Figma, One visual direction, refined, Copy placed from your doc). In c05 this list is empty because of an animation; it is there in the code and in c06.
- Black **Approve** button, outlined **Ask for changes (2 left)** button.
- A shield line: "After you approve, you pay ₹60,000 to Meera and the original files unlock. Something wrong? Report a problem".
- Studio card: "Meera Iyer Studio / Meera Iyer".
- Folded blocks: "Project" (open: Total ₹1,60,000, Stages 4, Originals unlock After each stage is paid), "Terms", "Next up".

**Popups:**
- Approve: "Approve this stage? Next you pay ₹60,000 to Meera and the original files unlock. You can't undo this." + "What's included" ticks again + buttons "Not yet" / "Approve".
- Changes: "What would you like changed? This uses 1 of your 2 rounds of changes." + "Note to Meera" box + an AI strip ("Ask to rewrite your note / Improve / Shorten") + "Cancel" / "Send to Meera".

**Count of competing things on the first screen:** 3 tabs, 2 stage labels, 1 status badge, 1 lock box, 3 file tabs, 1 preview, 2 buttons, 1 date block, 3 ticks, 1 reassurance, 1 studio card, 3 folded blocks. About 20 things. The one thing that matters (the decision) is 1 of them.

### 3. What is going wrong
1. **The decision is far from the thing being decided (Big).** The preview is on the left, the buttons are on the right. On a laptop the eye must travel across the page. On a phone (m03) the buttons sit *below* the preview, after "Please reply by". A real preview (a tall PDF or long page) is much taller than the sample, so the buttons can be several screens down. The client reads, scrolls, and has to hunt for the buttons. There is no always-visible decision bar.
2. **The right panel is two pages stacked (Big).** The top half is "the decision" (date, buttons, what you get). The bottom half is "about this project" (studio, total, stages, terms, next up). These are different jobs. The second half is reference material the client does not need to decide. It looks as important as the buttons because it is the same column and the same size of text.
3. **"What's included" is shown three times (Medium).** Once in the side panel, once in the Approve popup, and once on the "All stages" tab (scope rows). Same information again and again, the exact complaint from the test. In the popup it is useful as a last check; in the panel it pushes the buttons down.
4. **Stage name and number are shown twice, one above the other (Medium).** "Stage 2 of 4 · in review · Due Wed 21 Oct" and then "Stage 2 of 4 / Homepage design / Awaiting your approval". Same number, same status in two words ("in review" and "Awaiting your approval"). The due date also competes with "Please reply by" (see next).
5. **Three dates with three names (Big).** "Due Wed 21 Oct" (top line), "Please reply by Wed 21 Oct" (panel), and "approved automatically on Sat 24 Oct" (panel). A beginner asks: is due the freelancer's date or mine? Why does the page say "That date has passed" and still show the buttons? The sentence "That date has passed. It's approved automatically on Sat 24 Oct unless you reply" is scary and hard to parse. It says "approved automatically": the client may not realise this means "you will be asked to pay".
6. **"Awaiting your approval" and "Preview only" say things the client already knows (Medium).** The badge is correct but the client does not need a badge to tell them the thing they are looking at is waiting on them; a heading like "Your decision" does the job. The word "Awaiting" sounds like someone else is waiting. "Preview only" is good (it explains the watermark) but it takes a full box above the preview and repeats the sentence in the shield text below the buttons ("...the original files unlock").
7. **The money sentence is split and repeated (Medium).** "The original files unlock when you approve and pay" (top box), "Next you pay ₹60,000 ... You can't undo this" (popup), "After you approve, you pay ₹60,000 to Meera and the original files unlock" (panel), and "Originals unlock: After each stage is paid" (panel). Four versions of one rule. Also "approve and pay" in the top box reads like one action, but the page has two steps. The shield text is the clearest, but it sits under the buttons in small grey text.
8. **The watermark says PAYGUARD to a client (Big, breaks a product rule).** `wmStyle` writes the second line as "22 OCT 2026 · PAYGUARD" and the first as "PREVIEW · PRIYA NAIR". The client side must show the freelancer's studio name, not PayGuard. Fix: "PREVIEW · PRIYA NAIR" and "22 OCT 2026 · MEERA IYER STUDIO". It also fills the preview heavily; in c05 it covers the headline "Warm, handmade, quietly precise" so the client cannot read the work being judged. (Medium: readability.)
9. **PayGuard also leaks in the feedback history (Medium).** `feedbackCard` shows "PayGuard approved automatically" when the system approves. A client should see "Approved automatically" with no actor, or the studio name.
10. **The decision buttons do not explain what they do (Medium).** "Approve" does not say it does not charge you yet. "Ask for changes (2 left)": "2 left" of what? Rounds? It is not clear that this *uses up* a round until the popup says "This uses 1 of your 2 rounds of changes". Better to say it on the button area. When rounds run out, the button becomes "Add a change round · ₹X" or "free", which is a different action (a purchase or a request) and the label does not say it is extra.
11. **"Approve" is irreversible but the popup is calm (Small to Medium).** "You can't undo this" is in the same grey text as everything else. The primary button in the popup is also just "Approve", the same word, so there is no extra signal. The "Not yet" button is a good friendly cancel; keep it.
12. **The AI strip in the Ask for changes popup is noise (Medium).** "Ask to rewrite your nc" is cut off in c07. It appears when the client is about to write a note to a person. It adds a third decision (improve? shorten?) at the wrong moment, and it is not part of the client's single job. Also no way to attach a screenshot or point at a spot on the preview, which is how clients actually give feedback.
13. **Tabs "Review / All stages 4 / Contract" are three places for a person with one job (Medium).** The first tab renames itself ("Review" when waiting, "Current stage" when not, see c04). The name change makes it feel like a different page. "All stages" and "Contract" are fine as secondary, but on a phone they take a full row at the top before the client sees anything about the decision.
14. **File tabs and preview have no signal of "have I seen everything?" (Small).** Three files, and the client can approve after seeing only one. Not a bug, but a client might wonder whether all files are included. A count ("3 files") near the preview heading would help.
15. **The studio card and "Project" block repeat what the client knows (Small to Medium).** "Meera Iyer Studio / Meera Iyer" is already in the top bar. "Total ₹1,60,000 / Stages 4 / Originals unlock..." is repeated in "All stages" and the contract.
16. **"Report a problem" appears twice and with two different feelings (Small).** Once under the buttons (inline in the shield sentence) and also on the in-progress page (c04). It is useful and should stay. But in the shield text it is buried in a sentence and looks like part of the legal text.
17. **Sample content leak (Small).** The avatar shows "BS" while the name is "Priya Nair". Prototype data issue; mention so it is not copied into tests.

### 4. What the page should look like (information architecture)
(Information architecture means: what goes where, in what order, so people find things without thinking.)

**Principle:** one page, one decision. The top of the page says what to decide. The preview is under it. The buttons are right next to the preview and stay visible on a phone.

```
TOP BAR     Meera Iyer Studio  >  Website redesign                 Priya Nair
TABS        Stage 2 · Homepage design   |  All stages (4)  |  Contract

DECISION BANNER (the first thing you read)
 ┌────────────────────────────────────────────────────────────────┐
 │ Stage 2 of 4: Homepage design                                  │
 │ Your turn: approve this stage or ask for changes.              │
 │ Reply by Wed 21 Oct.   [Approve]  [Ask for changes · 2 left]   │
 │ After you approve you pay ₹60,000 to Meera. Then the           │
 │ original files unlock.                                         │
 └────────────────────────────────────────────────────────────────┘
 Note from Meera (if any)

PREVIEW  (preview only: originals unlock after you pay)
 [Moodboard.svg] [References.pdf] [Notes.docx]
 ...preview with a lighter watermark: "PREVIEW · PRIYA NAIR · MEERA IYER STUDIO"

WHAT'S INCLUDED (3 ticks)  ← one place only, under the preview
 
FEEDBACK HISTORY  (only after a change round)

SIDE (desktop only, quiet)  Studio card, Project, Terms, Next up  ← all folded by default
```

- **Keep:** the "Please reply by" idea, the ticks for what is included, the preview file tabs, "Not yet", the shield sentence (reworded), "Report a problem", the studio name everywhere.
- **Move:**
  - The Approve and Ask for changes buttons and the reply date go to a banner directly above the preview (desktop) and into a bar that stays at the bottom of the phone screen while the preview is on screen (phone). They are not in the right column at the end of the page.
  - "What's included" goes under the preview, so the client can tick off what they are looking at before deciding. Remove it from the side panel. Keep it in the Approve popup as a final check (short).
- **Remove:**
  - The second "Stage 2 of 4" label and the duplicate stage line. Keep one heading.
  - The "Preview only" box as a big block. Make it a small line right above the preview.
  - The AI "Improve / Shorten" strip.
  - "PAYGUARD" in the watermark and in the feedback history.
  - "Originals unlock: After each stage is paid" from the panel on this stage (the decision banner already says it).
- **Merge:**
  - "Due date" and "Please reply by" into one date, called "Reply by". If they are truly different dates, say so: "Meera plans to deliver by X" is not the client's concern here, so drop "Due".
  - The status badge and the heading line: the heading says "Your turn". No separate "Awaiting your approval" badge.
  - The side panel's "Project", "Terms" and "Next up" into one folded block "About this project" (or move to the Contract tab).
- **Visible by default:** banner, buttons, reply date, money sentence, preview. **Behind a click:** auto-approval details ("What if I don't reply?"), terms, project summary, next up, all stages.
- **Phone:** order is banner (decision text only), preview, what's included, then a sticky bottom bar with the two buttons. The studio card and project facts go at the very bottom, folded.

### 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Badge | Awaiting your approval | Your turn to review (or drop the badge and use a heading) | "Awaiting" sounds like someone else is waiting; say it is the client's action |
| Duplicate line | Stage 2 of 4 · in review · Due Wed 21 Oct | Remove (keep one "Stage 2 of 4: Homepage design") | Said twice |
| Reply date | Please reply by / That date has passed. It's approved automatically on Sat 24 Oct unless you reply. | Reply by Wed 21 Oct. If you don't reply, this stage is approved on Sat 24 Oct and you will be asked to pay. | Says what "approved" leads to; "That date has passed" is cold |
| Lock box | Preview only. The original files unlock when you approve and pay. | Preview only. You get the original files after you approve and pay. | Says it from the client's side |
| Button | Approve | Approve this stage | Matches the popup question |
| Button | Ask for changes (2 left) | Ask for changes (2 rounds left) | "2 left" of what? |
| Button when rounds used | Add a change round · ₹X / free | Ask for one more round · ₹X | Says it is extra |
| Shield text | After you approve, you pay ₹60,000 to Meera and the original files unlock. Something wrong? Report a problem | Approving doesn't charge you. Next you pay ₹60,000 straight to Meera, then the original files unlock. | Money rule in plain words; put "Report a problem" on its own line |
| Approve popup | Next you pay ₹60,000 to Meera and the original files unlock. You can't undo this. | You're approving Homepage design. Next you pay ₹60,000 to Meera, and the original files unlock. You can't undo approval. | Names the stage; says what can't be undone |
| Approve popup buttons | Not yet / Approve | Not yet / Yes, approve | Confirms the choice |
| Changes popup | What would you like changed? This uses 1 of your 2 rounds of changes. | What would you like changed? Sending this uses 1 of your 2 change rounds. | Clear that sending, not typing, uses the round |
| Changes note label | Note to Meera | What should Meera change? | Plain |
| Watermark line 2 | 22 OCT 2026 · PAYGUARD | 22 OCT 2026 · MEERA IYER STUDIO | Client sees the studio, not PayGuard |
| Feedback history | PayGuard approved automatically | Approved automatically | Client side must not show PayGuard |
| First tab | Review / Current stage | Current stage (same name always) | A tab that renames itself feels like two pages |
| Side card | Meera Iyer Studio / Meera Iyer | (move to top bar only) | Already shown |

### 6. Questions for the owner
1. **Does a late client still approve normally?** The page shows "That date has passed" and "approved automatically on Sat 24 Oct" at once. I would pick: show the buttons as usual and one calm line "Reply by Sat 24 Oct, or this stage is approved for you." Why: the first date is the freelancer's wish, the second is the real deadline.
2. **Is there one date or two?** I would pick one date for the client (the last day to reply) and show the other only in the freelancer's view.
3. **Should "Approve" and "pay" be one step later?** Today approve then pay are two steps. I would keep two steps but say so on the button area ("Approving doesn't charge you"). The alternative (approve and pay together) is faster but lets clients pay before they feel sure.
4. **Keep the AI note helper?** I would remove it for now (it is not the client's job), and add "attach a screenshot" later.
5. **Is "ask for changes" limited to a note?** I would keep a note now. Comments pinned on the preview can wait.

### 7. Related screens
- **Before:** the freelancer submits the stage; the client gets a WhatsApp or email "Stage 2 is ready to review". The link must land them on this page with the decision banner visible without scrolling. Before that, the contract page (signed) and the "in progress" page (Screen B).
- **After Approve:** the "Awaiting payment" page ("Pay ₹60,000 to unlock the originals"). The client expects the amount to match the one shown here, and expects the same preview to still be there, locked.
- **After Ask for changes:** the "Changes requested" page (Screen B, branch `changes`) which shows "Your note" and the freelancer's reply. The client expects to see their own words and the rounds left.
- **After Report a problem:** the "On hold" page.

---

## Screen B: Stage in progress / changes requested (c04)

### 1. The job of this page
**Who and when:** the client opens the link while the freelancer is working. In under 10 seconds: "Is the work moving, and is there anything I need to do?" (Answer is usually: no.)
Smaller jobs: (1) see when the next preview is due, (2) see what is included in this stage, (3) report a problem if something is wrong.

### 2. What is on the page today
- Top bar: "Meera Iyer Studio > Dashboard UI kit", "Rohit Mehta".
- Tabs: "Current stage", "All stages 4", "Contract".
- Line: "Stage 3 of 4 · in progress · Due Sat 24 Oct".
- A big card: "UI kit" + blue badge "In progress", "Meera is working on it · due Sat 24 Oct.", a grey row "What's included · agreed 10 Oct / 3 items", and a link "Report a problem".
- Right: studio card, "Project" (open), "Terms", "Next up". The right column has no decision, so it is only reference.
- In the `changes` branch: badge "Changes requested", "Changes in progress · round 1 of 2.", a box "Your note", and a box "Meera's reply".

### 3. What is going wrong
1. **Same title, status and date twice (Medium).** "Stage 3 of 4 · in progress · Due Sat 24 Oct" above, and "In progress" + "due Sat 24 Oct" in the card. Four sentences carry one fact.
2. **"What's included · agreed 10 Oct / 3 items" hides the items (Medium).** A grey row that looks like a label, not a button; the client must guess it opens. The thing the client most wants while waiting (what will I get?) is behind a closed box.
3. **Most of the page is empty and the right column is full (Small to Medium).** The main column has one small card; the side has facts the client already knows. On a waiting page the right column draws attention away from "nothing to do".
4. **"Report a problem" sits alone with no explanation (Small).** A new client does not know what counts as a problem (late? not what we agreed?). It is fine as a quiet link, but needs one line.
5. **In-progress page has no "what happens next" (Medium).** It says Meera is working, but not "You'll get a message when the preview is ready. Nothing to do now." That is the single reassurance a waiting client needs.
6. **Changes branch: "round 1 of 2" is ambiguous (Small).** It could mean "you used 1 of 2" or "Meera is on her 1st of 2". Say "You've used 1 of 2 change rounds."
7. **Tab name changes (Medium).** "Current stage" here, "Review" on Screen A. Same tab, two names.

### 4. What the page should look like
```
Stage 3 of 4: UI kit              [In progress]
Meera is working on this. Next preview due Sat 24 Oct.
Nothing to do now. We'll message you when it's ready to review.

What you'll get (agreed 10 Oct)
 ✓ item 1   ✓ item 2   ✓ item 3     ← open by default (only 3 items)

[Changes requested only]  Your note: "..."   Meera's reply: "..."
Report a problem (small link, with a one-line hint)

About this project (folded)
```
- **Keep:** the clear "Meera is working on it" sentence, the quiet "Report a problem" link, the folded right-side blocks.
- **Move:** "What's included" items out of the closed row and into the card, visible.
- **Remove:** the duplicate line above the card, and the always-open "Project" block.
- **Merge:** the status badge and the sentence "Meera is working on it".

### 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Top line | Stage 3 of 4 · in progress · Due Sat 24 Oct | (remove) | Repeated in the card |
| Card text | Meera is working on it · due Sat 24 Oct. | Meera is working on this stage. Preview due Sat 24 Oct. Nothing to do for now. | Tells the client they can relax |
| Grey row | What's included · agreed 10 Oct / 3 items | What you'll get (agreed 10 Oct) and show the 3 items | Visible, plain |
| Changes | Changes in progress · round 1 of 2. | Meera is making your changes. You've used 1 of 2 change rounds. | Clear who and what |
| Link | Report a problem | Something not right? Report a problem | Explains when to use it |

### 6. Questions for the owner
1. **Show the side panel at all on waiting pages?** I would fold everything by default here, because there is nothing to decide.
2. **Should the client be able to nudge or message the freelancer here?** I would keep it out for now (WhatsApp already exists between them).

### 7. Related screens
Before: contract signed, stage starts. After: freelancer submits and the page turns into Screen A. The client expects the same tab, same position, so the page should not look like a new place when it changes.

---

## Screen C: Phone version (m03)

### 1. The job of this page
Same as Screen A, but the client is on WhatsApp, taps the link, and has a thumb and 30 seconds. In under 10 seconds: "I can see the work, and where to tap to approve."

### 2. What is on the page today
In order from the top: top bar (studio name cut off: "Meera Iyer Studi", project "Website re..."), three tabs, stage line, stage title and badge, lock box, file tabs, small preview, a thin line, then "Please reply by", what's included (3 ticks), Approve, Ask for changes, shield text, studio card, Project (open), Terms, Next up.

### 3. What is going wrong
1. **The buttons are well below the preview (Big).** In m03 the sample preview is short, so they appear at about the first screen and a half. A real tall preview pushes them away. No sticky decision bar.
2. **The top of the page is crowded before the work appears (Medium).** Top bar, tabs, stage line, title, badge, lock box (3 lines of text), and file tabs all come before the preview. About 7 blocks above the work.
3. **Names are cut off (Small to Medium).** "Meera Iyer Studi" and "Website re..." in the top bar. The client sees a cut studio name, the one brand they should trust.
4. **The watermark crosses the small preview and blocks the headline (Medium).** On a small preview the diagonal text covers the text under review.
5. **Reply date and money explanation come before the buttons, so the buttons look like the end of a form (Small).** The client reads "That date has passed" then ticks, then decides. The order should be: what to do, then the buttons, then the details.
6. **The bottom half (studio, Project, Terms, Next up) adds a lot of length for no decision (Medium).** Folded blocks are good; the "Project" block is open by default.
7. **The grey "View as" switcher at the bottom is prototype only.** Ignore, but make sure it never covers the sticky bar when that is added.

### 4. What the page should look like
```
[Studio name]  >  Website redesign            (name wraps or shortens project, not studio)
Stage 2 of 4: Homepage design
Your turn. Reply by Wed 21 Oct.
Preview only. Originals unlock after you approve and pay.
[file tabs]
[PREVIEW  (light watermark, studio name)]
What's included  ✓ ✓ ✓
About this project  (folded)
─────────────────────────────────────
STICKY BAR:  [Approve]  [Ask for changes · 2 left]
```
- **Keep:** large, full-width, finger-sized buttons; the file tabs; folded blocks.
- **Move:** the buttons into a bar fixed to the bottom of the screen; the reply date into the heading area.
- **Remove:** the open "Project" block; the studio card (name is in the top bar); the separate lock box (becomes one line).
- **Merge:** tabs onto one row with shorter names ("Stage", "All", "Contract") or move "All stages" and "Contract" into a menu.

### 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Top bar | Meera Iyer Studi > Website re... | Meera Iyer Studio (own line), project name below | No cut-off brand |
| Tabs | Review / All stages 4 / Contract | Stage / All stages / Contract | Short, stable names |
| Sticky bar | (none) | Approve · Ask for changes (2 left) | Always reachable |
| Lock box | Preview only. The original files unlock when you approve and pay. (3 lines) | Preview only. Originals unlock after you pay. | One line |

### 6. Questions for the owner
1. **Sticky bar or buttons at the top of the page?** I would pick sticky at the bottom because the thumb is there and the preview stays in view.
2. **Should the phone hide the "All stages" tab inside a menu?** I would keep it as a tab but shorten it.

### 7. Related screens
Opened from a WhatsApp or email link (the client has no account). After approve the client lands on the pay screen; the sticky bar must disappear then, so two bars never compete.

---

## Top 5 things to fix on these screens
1. Put the decision (Approve, Ask for changes, reply date, money sentence) directly above the preview, and make it a sticky bar on phones, instead of in the far-right column.
2. Remove PayGuard from everything the client sees: the watermark ("· PAYGUARD") and the feedback history ("PayGuard approved automatically"); use the studio name.
3. Split the right column: keep only the decision on this page; fold or move "Project", "Terms", "Next up" and the studio card; show "What's included" once, under the preview.
4. Collapse the repeated headings and dates: one "Stage 2 of 4: Homepage design" line, one "Reply by" date, one clear sentence that approving does not charge you but leads to paying.
5. Reword the buttons and statuses: "Ask for changes (2 rounds left)", "Your turn" instead of "Awaiting your approval", one name for the first tab, and no AI helper strip in the changes popup.
