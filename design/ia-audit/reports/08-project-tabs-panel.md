# Report 08: Project page tabs and Details side panel

Screens covered: the **Files tab**, the **Activity tab**, and the **Details side panel** (Next up, Money, Contract, Terms, Contact). I also look at the Stages tab (f15) only to see what repeats.

Code read: `projFiles`, `projActivity`, `projSide` (with its `fr` and `sec` helpers), `filesCard`, `sProject`, `nextEvents`, `paneOpen` in `prototype/nazar/app.js`.

A quick map of the project page today, so the rest makes sense:

```
Header: Details | View as Priya | Client link
Strip:  BS Bloom Studio  Priya Nair  . You get 1,60,000 . Next: Inner pages . Mon 9 Nov
Tabs:   Stages 4 | Files 3 | Contract | Activity 1
Body:   (depends on tab)
Panel:  (hidden by default, opens on "Details")
```

---

## Screen A: Files tab (f22)

### 1. The job of this page
The freelancer is here when a client says "where is that file I sent?" or when they want to check what the client can currently see. In under 10 seconds they must find one file and know whether the client sees a preview or the original.

Smaller jobs, in order:
1. Find a file or link by name.
2. See which stage it belongs to and whether it is locked (preview) or unlocked (original).
3. Add a new file or link.

### 2. What is on the page today
- **Top:** the project strip (client, "You get ₹1,60,000", "Next: Inner pages · Mon 9 Nov"), then the tabs.
- **Middle:** "3 items". A table with columns `File | Stage | Size | Status`. Rows: Moodboard.svg, References.pdf, Notes.docx, all under "Homepage design", all "Preview only".
- **Add button:** "Add to Homepage design" appears only when the stage is in progress or has changes requested (`canAdd`). In f22 the stage is in review, so there is no add button at all.
- **Bottom:** empty white space.
- Empty state text: "No files yet" / "Files and links appear here once the work starts."

Competing things: low. The page itself is calm. The problem is that it exists at all (see below).

### 3. What is going wrong
1. **Files now live in three places.** Inside the stage card on the Stages tab, in a "Files & links" card right under it (same three files again), and on this Files tab. A beginner sees the same three files twice on one screen and a third time one click away. This matches the test finding "it just shows the same details again and again". **Big.**
2. **The Files tab splits files away from their stage.** The team already heard "files and links should live inside a stage". This tab does the opposite: it makes a flat list across stages. With 4 stages and 15 files, you lose the story of "this stage, these files, this status". **Big.**
3. **"Preview only" is a confusing label.** It is the status of every file, so it carries no information, and it is wrong for the freelancer's own mental model: the freelancer uploaded the *originals*; the client sees a *preview*. A beginner reads "Preview only" and thinks "my file is broken". It also does not say what will unlock it. **Medium.**
4. **The status badge says the same thing for every row of a stage.** Status belongs to the stage, not the file. Repeating it three times adds noise. **Medium.**
5. **Links are mixed in the same table with a fake size.** The "Size" column shows the word "Link" and the status badge also says "Link". Same word twice in one row. Links also have no "preview/original" meaning (a Figma link is live, not watermarked), so the status column is meaningless for them. **Small.**
6. **"Add to Homepage design" disappears without explanation** when the stage is in review. The freelancer wonders where the upload went. A hidden reason is worse than a disabled button with a reason. **Medium.**
7. **No way to see what the client sees.** The tab is about files, but the single most important question ("what can Priya open right now?") is only answerable via the "View as Priya" button in the header. **Small to Medium.**
8. **Tab count "3" on "Files" and "Stages 4"** are counts of different kinds of things next to each other. Counts on tabs are fine for files but "Stages 4" does not help anyone. **Small.**

### 4. What the page should look like

**Recommendation: remove the Files tab and the "Files & links" card on the Stages tab.** Files and links live inside each stage, which is what the meeting asked for. If the owner wants to keep a "find anything" view, keep it as a small search ("Find a file") on the Stages tab, not as a tab.

If the owner keeps the tab (fallback), make it a *grouped* list:

```
Files                                   [ Search files ]   [ Add file or link ]
---------------------------------------------------------------
Stage 1 Discovery        Originals unlocked
   Brief.pdf              1.2 MB
Stage 2 Homepage design  In review (client sees previews)
   Moodboard.svg          18 KB
   References.pdf         2.4 MB
   Figma link             link
Stage 3 Inner pages      Not started
   (nothing yet)
```

- **Keep:** the file icon tags (IMG, PDF, DOC), clickable link names.
- **Remove:** the per-row "Preview only" badge and the "Link" badge.
- **Move:** the status to the stage heading (one status per group).
- **Merge:** with the Stages tab so each stage owns its files.
- **Always visible:** file name, which stage. **Behind a click:** size, upload date.
- The "Add" button should always exist. When the stage is in review, show it greyed with the line "You can add files again if Priya asks for changes."

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Status badge | Preview only | Priya sees a preview | Says who sees what |
| Status badge (after unlock) | Original unlocked | Originals unlocked | Matches product word "originals" |
| Column head | Status | (remove, put on stage heading) | Status is per stage |
| Link row size | Link | link icon, no text | Said twice |
| Count line | 3 items | 3 files and links | Tells what an item is |
| Add button | Add to Homepage design | Add file or link | Shorter; stage is clear from group |
| Empty state | No files yet | Nothing added yet | Softer, same meaning |
| Empty state hint | Files and links appear here once the work starts. | Add your first file or link when this stage starts. | Says what to do, not just what happens |
| Tab name | Files | (remove) or "All files" | Only if kept |

### 6. Questions for the owner
- **Keep a Files tab at all?** I would remove it. The test said files belong in the stage, and the data model already works that way. Cost: someone who wants "all files in one place" loses it. I would add a search box later if people ask.
- **Do links (Figma, Loom) get a preview/original status?** I would say no. Links are always live, so they carry no lock label.

### 7. Related screens
- **Before:** the Stages tab. The user clicks "View all" on the Files & links card to get here. If the card is removed, there is no path here, which is the point.
- **After:** a file row currently goes nowhere (it is a static row; only links open). The user expects to click a file and see its preview. Add that, or rows feel dead.

---

## Screen B: Activity tab (f24)

### 1. The job of this page
The freelancer is here to answer "what happened, and when?", usually after a dispute or a missed reply ("Did Priya actually see it? Did I send the reminder?"). In under 10 seconds they must find the last thing that happened and who did it.

Smaller jobs:
1. See the order of events (sent, viewed, asked for changes, approved, paid, unlocked).
2. Know who did each (me, the client, or the system).
3. Use it as proof if there is a disagreement.

### 2. What is on the page today
- **Top:** same strip and tabs. Tab shows "Activity 1".
- **Middle:** one row: shield icon, "Automatic reminder sent to Priya by WhatsApp (now late)", right-aligned "22 Oct, 2:46 am".
- **Rest:** empty.
- Empty state: "No activity yet."

Competing things: none. It is almost empty.

### 3. What is going wrong
1. **The log is almost empty on a project that clearly has history.** The project has a signed contract, an unlocked stage 1 and a stage 2 sent for review 4 days ago. None of that appears. The code only shows the stage-history fallback when there are *zero* log lines, so as soon as one reminder is logged, all real history vanishes. This is a bug that makes the tab look broken. **Big.**
2. **The one item shown is the least important one.** An automatic reminder is a side-detail; "Sent Homepage design for review" is the headline. Wrong order of importance. **Big.**
3. **"(now late)" is unexplained.** Late compared to what? A beginner cannot tell if it is the reminder or the client that is late. **Medium.**
4. **The shield icon means "system" but its hover label says "PayGuard".** Fine on the freelancer side, but the same wording must never reach the client view. It is also unclear to a beginner what a shield means. **Small.**
5. **Missing events a freelancer expects:** contract sent, client signed, link opened ("Link opened 29 days ago" is shown on the Stages tab but not here), preview viewed, advance paid, balance paid. Activity is the natural home for "Link opened 29 days ago", which today sits as a half-sentence next to the Remind button. **Medium.**
6. **The tab count "1"** looks like "1 unread", but it is a total. Counts on Activity tabs normally mean new things. **Small.**
7. **Time shown as "2:46 am"** for an automatic WhatsApp reminder looks odd (reminders at night). Either a bug in sample data or a real concern. **Small.**
8. **No grouping or filter.** With 15 events a week it becomes a long flat list. Not a problem yet. **Small.**

### 4. What the page should look like
Keep Activity as a tab, but treat it as a *history book*, not a place to act. Newest first, grouped by day.

```
Activity
-------------------------------------------------
Today
  2:46 am   System   Reminder sent to Priya on WhatsApp
18 Oct
  4:10 pm   You      Sent "Homepage design" for review
16 Oct
  11:05 am  Priya    Paid for "Discovery". Originals unlocked
10 Oct
  9:30 am   Priya    Signed the contract
  9:12 am   You      Sent the contract to Priya
```

- **Keep:** the avatar for who did it, the time on the right, the plain sentence.
- **Add:** the missing events from point 5, and "Priya opened the link".
- **Fix:** always merge log lines with the stage history. Never show only one source.
- **Group** by day with a small date heading.
- **Hide:** nothing. It is already a quiet page.
- **Alternative:** if the owner wants fewer tabs, fold Activity into the Details panel as a "Recent" section (last 3 events) and drop the tab. See Screen C.

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Reminder row | Automatic reminder sent to Priya by WhatsApp (now late) | Reminder sent to Priya on WhatsApp. Her reply was due yesterday. | Explains "late" |
| Sent row | Sent Homepage design for review | You sent "Homepage design" for review | Says who, quotes the stage |
| Approval row | Priya approved Discovery | Priya approved "Discovery" | Same style |
| Paid row | Priya paid for Discovery. Originals unlocked | Priya paid for "Discovery". Originals are unlocked. | Whole sentence |
| System avatar title | PayGuard | Automatic | Never name the product as an actor; "Automatic" is clearer |
| Empty state | No activity yet. | Nothing has happened yet. You will see every send, reply and payment here. | Tells what will appear |
| Tab count | 1 | (remove) | Not a count of anything the user needs |

### 6. Questions for the owner
- **Keep Activity as a tab or fold it into the side panel?** I would keep it as a tab for now. Disputes need a full list. But I would remove the count.
- **Should "Link opened" and "Preview viewed" be logged?** I would say yes. They answer "did they even see it?", the most common freelancer worry.

### 7. Related screens
- **Before:** any action on the Stages tab (send, remind, approve) should create a row here. The user expects to press "Remind Priya" and see it appear within a click.
- **After:** a row should link to the stage it talks about. Today it is plain text.

---

## Screen C: Details side panel (f25)

### 1. The job of this page
The freelancer is working on a stage and wants a quick answer to "what did we agree?" without leaving the page: how much, when is the next date, what are the client's contact details. In under 10 seconds they must find the amount, the next date, or the client's email.

Smaller jobs:
1. See the next dates.
2. See money terms (value, advance, balance days).
3. Contact the client (email, WhatsApp) or edit the client.
4. Check terms (reply window, rounds of changes).

### 2. What is on the page today
Hidden by default (`paneOpen` is false until the person presses "Details"; the choice is remembered). When open, it takes the right third of the page.
- **Top:** "BS Bloom Studio" with three icon buttons: mail, pencil (edit), eye (view as Priya). The eye is also in the header as "View as Priya".
- **Next up (open):** "Mon 9 Nov | Inner pages", "Sat 21 Nov | Handoff".
- **Money (open):** "Project value ₹1,60,000", "Advance None", "Originals unlock Stage by stage", "Balance due 7 days after approval", then "Clients pay you directly. No PayGuard fee in the beta."
- **Contract (closed):** inside: "You Signed", "Priya Signed/Waiting", "Open the contract tab".
- **Terms (closed):** "Client replies within 3 days", "If no reply ...", "Rounds of changes 2 per stage", "Extra round Free/₹".
- **Contact (closed):** Name, Email, WhatsApp.

Competing things: 5 collapsible sections plus 3 icon buttons plus a note. Two are open at first sight.

### 3. What is going wrong
1. **The panel repeats the page.** "You get ₹1,60,000" is in the strip, "Project value ₹1,60,000" is in Money. "Next: Inner pages · Mon 9 Nov" is in the strip and again in Next up. The eye button duplicates "View as Priya" in the header. The "Details" button in the header and the whole strip both toggle the same panel. **Big.**
2. **Contract and Terms duplicate the Contract tab.** The Contract tab shows the same agreement in full. A beginner does not know where "the truth" lives, and in the test people said "the same details again and again". **Big.**
3. **"Next up" skips the thing that matters now.** It lists Inner pages and Handoff, but the live item is *Homepage design, reply was due yesterday*. Overdue and "reply due" items are filtered out (`x.date >= TODAY`). The panel says "Next up" while the real next thing is late. **Big.**
4. **The "Contract" section shows "Signed / Waiting" in a closed fold.** The product's first step is "waiting for the client's signature". Hiding it behind a collapsed arrow is the opposite of first-class. (The owner heard this already.) **Big when unsigned; Small once signed.**
5. **Money words contradict the Stages tab.** The panel says "Originals unlock: Stage by stage" and "Balance due: 7 days after approval", while the stage list says "Unlocked" and elsewhere "Awaiting payment". Same idea, three phrasings. **Medium.**
6. **"Advance: None" takes a whole row to say nothing.** And "Advance (30%) ₹X · due/paid" is the more useful state, so it is right to show when there is one; hide the row when there is none. **Small.**
7. **The sentence "Clients pay you directly. No PayGuard fee in the beta."** is a good reassurance but sits as grey small text under Money, where nobody reads it. It belongs at the moment of choosing how to pay or at contract setup. **Small.**
8. **Panel closed by default, but its best parts are needed all the time.** Closing the whole panel hides the next date and amount; the strip already shows those, which is why the panel feels pointless. Result: either it is redundant (open) or invisible (closed). **Medium.**
9. **Icon-only buttons** (envelope, pencil, eye) have tooltips but no text. "Pencil" does not say what it edits. **Small.**
10. **Contact is the least-used section but the only one the page does not show elsewhere.** It is correctly hidden, but it is the only unique content here. **Small.**
11. **"Terms" mixes four unrelated things** (reply days, auto-approve, rounds, extra fee). A beginner cannot guess what "If no reply" means (`autoTxt`). **Medium.**

### 4. What the page should look like

**Recommendation: make the side panel a short "Quick facts" card, not a second copy of the contract. Keep the panel for facts that are not shown elsewhere. Everything agreed lives in one place, the Contract tab.**

Layout, top to bottom (panel closed by default, as now):

```
Strip (always visible, top of page)
  Bloom Studio . Priya Nair . ₹1,60,000 . Next: Reply due from Priya (late)

Tabs: Stages | Contract | Activity     [Details]

Details panel (opens on the right)
  [Bloom Studio]  [Email] [WhatsApp] [Edit]
  --------------------------------------
  Needs attention        <- replaces "Next up"
    Priya's reply on Homepage design was due yesterday
    Next date: Inner pages, Mon 9 Nov
  --------------------------------------
  Money (short)
    Total          ₹1,60,000
    Advance        ₹48,000 (paid)    <- hide row if no advance
    Priya pays you directly. No fee in the beta.
  --------------------------------------
  Agreement                          <- one line, opens Contract tab
    You and Priya both signed.   [View contract]
  --------------------------------------
  Contact
    Priya Nair, priya@..., WhatsApp
```

- **Keep:** the client header with email and edit, Contact, the money total, the direct-pay reassurance.
- **Move:** "Terms" (reply window, rounds, extra round, no-reply rule) into the Contract tab only, and out of the panel.
- **Move:** "Originals unlock" and "Balance due" wording into the contract; in the panel only show the advance if there is one.
- **Remove:** the eye button from the panel (it is in the header), and the "You get" figure from the strip or the "Project value" row from Money, not both. I would keep the strip.
- **Merge:** "Contract" and "Terms" into one "Agreement" line that opens the Contract tab.
- **Change:** "Next up" becomes "Needs attention", and includes overdue items first.
- **Always visible:** the strip (client, amount, next thing). **Behind a click:** the whole Details panel, and inside it, Contact.
- **Unsigned contract:** do not hide it in the panel. Show a banner at the top of the Stages tab ("Waiting for Priya to sign") and a red dot on the Contract tab. The panel should echo it as the first line.

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Section title | Next up | Needs attention | Includes late items |
| Section title | Money | Money | Keep |
| Row | Project value | Total | Shorter |
| Row | Advance None | (hide row) | Nothing to say |
| Row | Advance (30%) | Advance (30%) paid to you | Says who gets it |
| Row | Originals unlock: Stage by stage | Originals unlock after each stage is paid | Plain words |
| Row | Originals unlock: Once, after all stages | Originals unlock after the last stage is paid | Plain words |
| Row | Balance due: 7 days after approval | Priya pays within 7 days of approving | Says who does what |
| Note | Clients pay you directly. No PayGuard fee in the beta. | Priya pays you directly. PayGuard holds no money and charges nothing in the beta. | Names the person; clearer |
| Section title | Contract | Agreement | One word for the whole of contract + terms |
| Contract row | Priya: Waiting | Priya has not signed yet | Full sentence |
| Contract link | Open the contract tab | View contract | Shorter |
| Terms row | Client replies within | Priya has 3 days to reply | Says who |
| Terms row | If no reply | If Priya does not reply | Reads like a sentence |
| Terms row | Rounds of changes: 2 per stage | 2 rounds of changes per stage | Number first |
| Terms row | Extra round: Free | Extra round: free | Lower case |
| Header button | Details | Details | Keep |
| Eye icon | (tooltip: View as Priya) | (remove from panel) | Duplicate |

### 6. Questions for the owner
- **Should the panel exist at all?** I would keep it, closed by default, as a "Quick facts and contact" drawer. Without it, client contact details have no home. If the owner wants less, move Contact into an overflow menu on the strip and delete the panel. I would not delete it yet.
- **Where does "Terms" live?** I would put it only in the Contract tab. Both the contract setup page and the project page showed too much (heard in the test), so one home helps.
- **Should the panel open by default the first time?** I would keep it closed. The strip already carries amount and next date.

### 7. Related screens
- **Before:** the strip and the Stages tab. The user expects the amount and "next thing" in the strip to match the first row in the panel.
- **After:** "View contract" should land on the Contract tab with the right section open. "Edit" opens the client edit form.
- **Connection:** the contract-setup reviewer should decide the final contract wording; this panel only quotes it.

---

## Cross-cutting: do the four tabs match how people look for things?

Today: **Stages | Files | Contract | Activity.**

- People think in terms of: "What do I do next?" (Stages), "What did we agree?" (Contract), "What happened?" (Activity). "Where is the file?" is answered inside the stage.
- **Recommended tabs:** **Stages | Contract | Activity.** Three tabs. Remove Files. Remove the counts (they are noise, apart from a dot when something needs attention).
- "Stages 4" as a tab name for the main page is fine, but "Overview" or "Stages" both read OK. Keep "Stages" because it matches the product word.

**What should always be visible vs tucked away:**

| Always visible | One click away | Rarely needed |
|---|---|---|
| Client, total, next/overdue date (strip) | Contract details | Terms (reply window, rounds) |
| Current stage and its files | Activity history | Client contact |
| Signature status (banner when waiting) | Details panel | Extra-round fee |

**What the stage page repeats today (f15):** the stage card lists 3 files, "Files & links" lists the same 3 files, then "Approvals" lists the 4 stages again with status. The top line ("Stage 2 of 4 · in review · Due Wed 21 Oct") repeats the stage card's own badge ("In review"). Four things say "in review". That is the main cause of "the same details again and again", and it is worth fixing in the Stages-tab report; I only flag it here.

---

## Top 5 things to fix on these screens

1. **Remove the Files tab and the "Files & links" card.** Files live inside their stage (matches the meeting, removes the triple repetition of the same three files).
2. **Stop the panel repeating the page.** Drop duplicate amount, next date and the eye button; move Terms into the Contract tab; keep the panel as a short quick-facts and contact drawer.
3. **Fix "Next up" so it shows what is late or waiting first.** Rename it "Needs attention" and include overdue replies (today it skips them and shows only future stages).
4. **Fix the Activity log so it always includes real history** (sent, approved, paid, signed, link opened), not just the one reminder. Merge log with stage history instead of replacing it.
5. **Make signature status visible, not folded away.** A "Waiting for Priya to sign" banner and a dot on the Contract tab, instead of a closed "Contract" section in the side panel.
