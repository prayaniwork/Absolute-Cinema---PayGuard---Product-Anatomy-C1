# Audit 05: The contract (freelancer review and sign, client signing page, Contract tab)

Screens: f14 (freelancer "Review and sign the contract"), c02 (client "Contract for ..."), c13 (client Contract tab), f23 (freelancer Contract tab).
Code: `sContractF`, `cContract`, `contractView`, `contractHTML`, `sigPadHTML`, `tplCard`, `printContract` in `prototype/nazar/app.js`.

One fact helps everything below. All four screens use the **same** `contractHTML()` function. So the contract text is identical on both sides. That is good (both people sign the same words). The problems are about what is wrapped around it and in what order.

---

## Screen 1: Freelancer "Review and sign the contract" (f14, `sContractF`)

### 1. The job of this page
The freelancer has just finished planning and now needs to check the contract says what they meant, sign it, and send it, in under 10 seconds of understanding what they are being asked to do.
Smaller jobs, in order:
1. Confirm the money, stages and dates are right (and go back and fix if not).
2. Sign.
3. (Optional, rare) Make it look like their own paper: letterhead, footer, own clauses.

### 2. What is on the page today
- Top: breadcrumb "New project > Contract", "Back to edit" (top right).
- Heading block: "Step 2 of 2", "Review and sign the contract", "Built from what you just entered. Sign it and we send it to Dev with the link. Work starts once you have both signed."
- Card 1 (before the contract): "Your letterhead. Upload a header so the contract comes on your own format. It's saved in Settings for next time." Inside: a dashed "No letterhead yet" box, "Upload your header", "Footer line (optional)", "Your own clauses (optional, one per line)".
- Card 2: the whole contract. Title, parties, then 5 numbered sections (The work, Payment, Review and approval, Files and ownership, Problems), a blank two-column signature area ("Not signed yet" / "Awaiting signature"), and a small line "Signed electronically. This template is a starting point for the prototype and is not legal advice."
- Card 3: "Sign as Meera Iyer", a Draw / Type switch, a drawing box, a checkbox "I have read the contract and I sign it electronically."
- Bottom: a grey disabled "Sign and send to Dev" and "Back to edit".
- On a 1360 px screen the page is about 3200 px tall. The Sign button is at the very bottom, roughly 1500 px (of 2000 on screen) down.

Things competing for attention: 3 cards, 3 form inputs, 2 signature areas (an empty one inside the contract and the real pad below), a draw/type switch, a checkbox, 2 buttons plus a duplicate "Back to edit" in the top bar and breadcrumb (three ways to say "go back").

### 3. What is going wrong
1. **Optional setup comes first and looks like a required step. (Big)** The first thing on the page is a form: letterhead, footer, own clauses. A beginner thinks "I must fill this in". All three are optional and most people will skip them. This is exactly the "required and optional mixed" finding from the test. It also pushes the contract (the point of the page) below the first screen.
2. **The page asks for two different things at once: edit and sign. (Big)** The top card is "make it pretty" (a setup task). The rest is "read and sign" (a decision task). Mixing them makes people unsure whether they are editing or confirming.
3. **Two signature areas. (Medium)** Inside the contract there is an empty "Not signed yet" line, and further down a separate "Sign as Meera Iyer" box. People will try to click or draw on the line inside the contract. Nothing happens there.
4. **Signing is Draw by default. (Big)** The meeting said typing is better, and a popup like a rental agreement. Today Draw is the default, and drawing with a mouse on a laptop gives a scribble. Typed is the faster, cleaner and more common choice in India (e-sign style).
5. **Draw and type need extra steps to unlock the button. (Medium)** The button stays grey until three things are true: a signature, and the tick box. The page never says what is missing. A grey button with no reason is a dead end. (Disabled button, no hint.)
6. **The contract is long and every section is open. (Medium)** Five sections, about 25 lines plus the stage table. For one stage it already fills a page; for four stages (f23) it is more than two screens. Section 5 "Problems" and section 4 "Files and ownership" are things the freelancer wrote in the product, not in their own plan, so they have never read them.
7. **The freelancer is told to "review" but the things they set are not visually marked. (Medium)** They should check money, dates, advance. These are buried in sentences ("The client pays a 25% advance (Rs 15,000) before work starts") instead of a short summary above the text. A person who fixes a typo in the amount has to read prose to find it.
8. **"Sign and send to Dev" mixes two actions. (Medium)** It signs and also sends the link. The freelancer may want to check the link first. The next thing that happens (a popup "invite", see code `U.modal = invite`) is not mentioned on this page.
9. **Contract wording talks about "the client" and "the freelancer" and also uses first names. (Small)** E.g. "Meera will deliver" but "The client reviews". Mixed styles read as sloppy in a legal text.
10. **"PayGuard" and "not legal advice for the prototype" sit inside the contract itself. (Small to Medium)** The line "This template is a starting point for the prototype and is not legal advice" and "PayGuard does not hold or handle the money" would be printed in the PDF the freelancer sends to their client. The client side is supposed to show the studio, not PayGuard. The text in section 2 and 5 names PayGuard three times.
11. **Footer line says "Signed electronically" even when nothing is signed. (Small)**
12. **Stage 1 and "Step 2 of 2". (Small)** "Step 2 of 2" is a good thing: it tells people there is an end. Keep it.

What already works: the contract is one clean "paper" card; "Back to edit" exists; "Built from what you just entered" explains where the text came from; the typed signature (see c02) looks good.

### 4. What the page should look like
Keep: the heading and "Step 2 of 2", the contract card as "the paper", the sign box, "Back to edit".
Move: letterhead / footer / own clauses go **out of this page's main path**. They live in Settings (already "saved in Settings for next time") and on this page become a single small link under the contract: "Use your own letterhead or add your own clauses". It opens a popup or expands a small box.
Merge: the empty signature line inside the contract and the sign box. The contract's signature area stays as a read-only record. The sign action is a popup.
Remove: "Back to edit" duplicated in breadcrumb, top bar and bottom (keep one, in the bottom).
Add: a 5-line "check these first" summary above the text.

Sketch:

```
New project > Contract                         (one back link)

Step 2 of 2
Review and sign the contract
Check the details below. When you sign, Dev gets a link to read and sign too.

+-- Check before you sign --------------------+
| Project: Brand refresh      Total: Rs 60,000 |
| Stages: 1    Advance: 25% (Rs 15,000)        |
| Client pays within 7 days of approval        |
|                          [Edit these details]|
+---------------------------------------------+

+-- Contract (paper) --------------------------+
| (your letterhead, if you added one)          |
| Service agreement: Brand refresh             |
| Parties                                      |
| 1 The work  2 Payment  3 Review  4 Files  5 Problems
| (sections 3-5 collapsed to a heading + one line) |
| Signatures: you [not yet]   Dev [not yet]    |
+---------------------------------------------+
Optional: Add your letterhead or own clauses  (small link)

[ Sign and send to Dev ]    Back to edit
   -> popup: "Sign as Meera Iyer" with Type (default) / Draw
```

Visible by default: summary, contract, one button. Behind a click: letterhead/footer/clauses, the full text of sections 3 to 5 (readable by "Show full text", but the PDF always has everything), the draw option.

The sign popup (like the rental agreement idea from the meeting):
- Title "Sign as Meera Iyer".
- A single field "Type your full name" with a live preview in handwriting font. A small link "Draw instead".
- One tick box "I have read the contract and agree to sign."
- Button "Sign". The disabled state explains itself: "Type your name and tick the box to sign."

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Heading | Review and sign the contract | Check and sign the contract | "Check" tells the freelancer what to do |
| Intro | Built from what you just entered. Sign it and we send it to Dev with the link. Work starts once you have both signed. | Made from the plan you just wrote. After you sign, Dev gets a link to read and sign it too. Work starts when you have both signed. | Says what Dev will do, in order |
| Letterhead card | Your letterhead. Upload a header so the contract comes on your own format. | Optional: your own letterhead | Removes "format", says optional |
| Footer line | Footer line (optional) | Footer line | Whole box is optional, no need to repeat |
| Own clauses | Your own clauses (optional, one per line) | Extra terms you want to add | Plain words |
| Sign box | I have read the contract and I sign it electronically. | I have read this contract and agree to it. | "Electronically" is jargon |
| Button | Sign and send to Dev | Sign and send to Dev (keep) but add helper under: "Dev gets a link by email." | Shows the next step |
| Disabled hint (new) | (nothing) | Type your name and tick the box to sign. | Explains the grey button |
| Contract fine print | Signed electronically. This template is a starting point for the prototype and is not legal advice. | Remove from the contract text. Put a line "This is a template. Check it with a lawyer if the project is large." under the contract on the freelancer page only. | Client should not read prototype notes |
| Section 2 | PayGuard does not hold or handle the money. | The money goes straight from the client to Meera. | Keeps PayGuard out of client-facing text |
| Section 5 | PayGuard records the scope, approvals and messages but does not decide disputes. | Meera and Dev settle disagreements between themselves. The project page keeps a record of what was agreed. | Same |

### 6. Questions for the owner
- **Default to Type, not Draw?** I would pick Type default with "Draw instead". The meeting said typing is better, and typing works on a laptop.
- **Is the sign popup required, or just a card?** I would pick a popup, because it matches the "rental agreement" idea and removes the long scroll to reach the button.
- **Should the freelancer see letterhead on this page at all?** I would pick only in Settings, plus one small link here. It is a once-per-account choice, not a per-contract one.
- **Should the contract text be shortened?** I would collapse sections 3 to 5, keep the PDF full. Needs the owner's view on legal comfort.

### 7. Related screens
- Before: the plan page (stage 1 of 2). The user expects the same numbers they entered. After signing, they land on the project page with an "invite" popup (client link). They then expect a clear "Waiting for Dev to sign" first step (see the project-page audit). Today the only trace is a small badge on the Contract tab ("Dev: waiting to sign").
- After: the project page, Contract tab (below).

---

## Screen 2: Client signing page (c02, `cContract`)

### 1. The job of this page
Dev, the client, opened a link from Meera. He must be able to see that Meera has signed, understand what he is agreeing to (what he gets, what he pays, when), and sign, in under 10 seconds of orientation.
Smaller jobs:
1. See the price, stages and dates.
2. See any advance he must pay.
3. Sign.

### 2. What is on the page today
- Top bar: "Meera Iyer Studio" > "Brand refresh", client name and avatar "FL" on the right (see issue below).
- "< Back", "From Meera Iyer", "Contract for Brand refresh", "Read it through, then sign. Meera has already signed."
- The full contract card (the same as f14, but the freelancer side shows a cursive "Meera Iyer" signature and "Signed 22 Oct 2026").
- "Sign as Dev Malhotra" card: Draw/Type, canvas, checkbox, "Sign and continue" (grey).
- No side panel, no stages, no money summary. Page is about 2000 px tall.

### 3. What is going wrong
1. **The advance appears as a sentence, not a heading. (Big)** "The client pays a 25% advance (Rs 15,000) before work starts" is in section 2, line 1. After signing, the code immediately opens an advance payment checkout (`U.checkout = 'advance'`). The client is surprised that signing leads to paying. The sign page should say so before the button.
2. **"Sign and continue" does not say what continues. (Big)** It could mean next page, pay now, or just a save. Real result: signing, then maybe the advance checkout screen with a toast "Next, pay the Rs 15,000 advance to start." The button should say it.
3. **The contract is written about "the client" while Dev is the client. (Medium)** "The client pays..." reads as someone else. "You" for the person reading would be easier, but the same text goes to both sides, so a neutral solution is to put the **key terms in a "you" summary** above the contract.
4. **Draw is the default. (Big)** On a phone it works; on a laptop it is awkward. Meeting wants typing and a popup.
5. **Two signature areas again. (Medium)** The empty "Not signed yet" line inside the contract and the Sign card below.
6. **Back button leads where? (Medium)** "< Back" returns to the project page (`closecontract`) without signing, where the contract is still unsigned. The page does not tell him he can come back later.
7. **The top right says "Dev Malhotra" and avatar "FL". (Small)** Avatar initials show the wrong thing (FL from Flux Labs). Not a contract problem but visible here.
8. **No "what is this?" for a person who has never used it. (Medium)** Nothing says that Meera will not see his signature until he signs, or that the files are protected until paid. The contract says it only in section 4, deep.
9. **PayGuard shown to the client. (Medium)** Section 2 and 5 say "PayGuard" (see rule: the client sees the studio). The top bar is correct (shows studio name).
10. **Page is long with no landmark. (Medium)** Dev must scroll about 1800 px to find where to sign. A client who just wants to sign has no "Skip to sign" and no progress.
11. **Wide empty space below the button (Small).** Not an issue on its own.

What works: freelancer signature already shown with a date, which proves the seriousness; "Meera has already signed" is the right reassurance; the client page has no clutter like tabs.

### 4. What the page should look like
```
Meera Iyer Studio > Brand refresh                  Dev Malhotra

Contract from Meera Iyer
Meera has signed. Read it, then sign to start the project.

+-- What you are agreeing to --------------------+
| You get: Logo and palette, by Sat 31 Oct       |
| You pay: Rs 60,000 in total                    |
| First: Rs 15,000 advance, paid to Meera        |
|        after you sign                           |
| Then: Rs 45,000 within 7 days of approving     |
| You can ask for 2 rounds of changes per stage  |
+-----------------------------------------------+

+-- Contract (paper), Meera signed ---------------+
| (full text)                                    |
+-----------------------------------------------+

[ Sign and pay Rs 15,000 advance ]   (or: Sign contract)
```
Clicking the button opens the sign popup (Type by default). After signing: a clear confirmation, see "moment after signing" below.

Keep: the contract card, Meera's signature shown, plain top bar. Move: the key terms up front. Remove: the empty signature line for the client (show only after signing). Merge: draw/type into the popup.

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Heading | Contract for Brand refresh | Contract from Meera Iyer | The client wants to know who it is from |
| Intro | Read it through, then sign. Meera has already signed. | Meera has signed. Read the contract, then add your signature. | Order: what happened, what to do |
| Button | Sign and continue | Sign contract (or: Sign and pay Rs 15,000 advance) | Says what happens |
| Checkbox | I have read the contract and I sign it electronically. | I have read this contract and agree to it. | Plain words |
| Back | < Back | < Back to project (and the helper: "You can sign later.") | Reassures |
| Section 2 | The client pays a 25% advance | You pay a 25% advance (Rs 15,000) before work starts | Reader is the client. If one text is needed for both, keep the summary box in "you" words |
| PayGuard lines | PayGuard does not hold or handle the money. | The money goes straight to Meera. | Studio, not PayGuard |

### 6. Questions for the owner
- **Does signing trigger the advance payment directly?** Today yes (code). I would keep it but say it on the button, since it is a surprise otherwise.
- **Should the client be able to refuse or ask for a change to the contract?** There is no such control. I would add a small "Ask Meera a question" link, but it is out of scope unless the owner wants it.

### 7. Related screens
- Before: the client opens the link and lands on the project (or a welcome). The "Contract" is reached by a button (`opencontract`), so he should see "Sign the contract to start" as the first obvious step.
- After: advance checkout (if any), otherwise the Review screen. The toast "Contract signed" disappears; see below.

---

## Screen 3: Client Contract tab (c13, `contractView` in the client project)

### 1. The job of this page
Priya, a client who already signed, wants to look something up in the contract ("how many rounds do I get?"), and maybe download it.
Smaller jobs: 1) check both signed; 2) download a PDF; 3) find the clause.

### 2. What is on the page today
Top: "Meera Iyer Studio > Website redesign"; tabs "Review", "All stages 4", "Contract". Under tabs: two green badges "Meera signed", "Priya signed" and "Download PDF". Then the full contract card (over 2 screens long). On the right: the side panel, "Please reply by Wed 21 Oct", "Approve", "Ask for changes (2 left)", studio card, "Project > Total / Stages / Originals unlock", "Terms", "Next up".

### 3. What is going wrong
1. **The side panel keeps the Approve buttons on screen while the user reads a legal document. (Medium)** The right column is for the review task. In the Contract tab it competes, and the same terms are on both sides: "Total Rs 1,60,000", "Stages 4", "Originals unlock" repeat the contract text; "Terms" repeats section 3. The test finding "it shows the same details again and again" applies exactly here.
2. **The contract's signature area is at the very bottom of a very long page. (Medium)** The badges at the top are the only proof of signing, and are not tied to the text.
3. **Badge words differ between roles. (Small)** The client sees "Meera signed / Priya signed". Their own name, third person. "You signed" is clearer.
4. **Too long for a lookup. (Medium)** Four stages make the contract about 2.5 screens, with no table of contents or way to jump to a section.
5. **Same page as the freelancer's with an extra panel. (Small)** OK as intent, but the sidebar differs, so it looks like a different place.
6. **"Download PDF" prints a browser print window. (Small)** The toast says "Choose Save as PDF in the print window", which is clumsy for a beginner. The button says "Download".
7. **Date wording. (Small)** "Dated 20 September 2026" is the signing date for a sample contract; for others it is the created date, not the signing date.

What works: signed state at the top is shown clearly with green badges; Download is next to it.

### 4. What the page should look like
```
Review | All stages | Contract

You signed on 20 Sep. Meera signed on 20 Sep.        [Download PDF]
Jump to: The work | Payment | Review | Files | Problems

(contract text)

(no side panel on this tab, or only the studio card)
```
Keep the contract. Remove the review side panel on this tab (Approve, Terms, Project). Add a one-line status and jump links. Collapse sections by default except the one asked for.

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Badges | Meera signed / Priya signed | You signed on 20 Sep / Meera signed on 20 Sep | Shows date and who is who |
| Waiting badge | Priya: waiting to sign | Waiting for you to sign | Same |
| Button | Download PDF | Save as PDF | What actually happens |

### 6. Questions for the owner
- Should the client see the contract as a tab at all, or just a link in a corner? I would pick a tab, since people look things up, but hide the review panel.

### 7. Related screens
Reached from the project Review page; after it the user goes back to Review. Side panel details are also in "Details" on the freelancer side.

---

## Screen 4: Freelancer Contract tab (f23, `contractView` in `sProject`)

### 1. The job of this page
Meera wants to check who has signed (is Dev blocking the project?), re-read a term, and send or download the contract.
Smaller jobs: 1) see sign status; 2) download; 3) find a clause.

### 2. What is on the page today
Breadcrumb "Clients > Bloom Studio > Website redesign", buttons "Details", "View as Priya", "Client link". Summary strip "You get Rs 1,60,000 . Next: Inner pages . Mon 9 Nov". Tabs "Stages 4, Files 3, Contract, Activity 1". Then the badges "Meera signed", "Priya signed", "Download PDF", and the full contract. The sample here has both signed.

### 3. What is going wrong
1. **"Waiting for client signature" has no first-class place. (Big)** When Dev has not signed, the only sign is a grey badge "Dev: waiting to sign", on the Contract tab. A user on the Stages tab will not see it. This repeats the meeting finding. The contract tab is not where the freelancer is looking.
2. **No action when the client has not signed. (Big)** There is no "Send a reminder" or "Copy link" here. The badge is a dead end.
3. **Contract tab count is always 0 and shows no badge. (Small)** `['contract','Contract',0]`. A pending signature should show a dot.
4. **Contract is shown even to the person who wrote it, in full, every time. (Medium)** The freelancer rarely needs to read it again; they need status and download.
5. **Contract can no longer be edited, and the page does not say so. (Medium)** After signing, a change needs a new agreement. Nothing explains.
6. **The money summary strip above the tabs shows "You get Rs 1,60,000", and the contract shows the same total in 2 places. (Small)**
7. **The "Details" side panel is hidden here, but if opened repeats the terms. (Small)**
8. **"View as Priya" shows the client's same contract page but with the review panel. (Small)** Good for checking, but the freelancer may think the client sees it exactly like the tab.

What works: status badges at the top, one Download button, no second "view" step.

### 4. What the page should look like
```
Contract
Signed by you on 20 Sep.  Waiting for Priya to sign.   [Copy link] [Send reminder]
(or when both signed:  Both signed  [Save as PDF])

(contract, sections collapsed except The work and Payment)
```
Pending signature: show a dot on the "Contract" tab and a banner on the Stages tab: "Waiting for Priya to sign the contract" as the first step of the path.

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Badge | Priya: waiting to sign | Waiting for Priya to sign | Reads like a sentence |
| Badge | Meera signed | You signed | You are Meera |
| New | (none) | Send a reminder | The dead end |

### 6. Questions for the owner
- Can the freelancer send a reminder from here, and can the signing be undone before the client signs? I would pick: reminder yes, withdraw no (create a new project instead).

### 7. Related screens
Before: the signing popup and invite popup after f14. After: the Stages tab, which should open with "Waiting for client to sign" as step one until it is done.

---

## The moment after signing (both roles)

- **Freelancer:** `signsend` creates the project, then jumps straight to the project page with the invite popup. No confirmation says "You signed". The page the user lands on does not show a waiting step. Fix: a short success card or banner "You signed. Next: send Dev the link", the invite popup with the copy-link button, then "Waiting for Dev to sign" as step 1 on Stages.
- **Client:** `signc` shows a toast "Contract signed. Next, pay the Rs 15,000 advance to start." and either opens the advance checkout or the project page. The toast disappears quickly. Fix: a plain confirmation line in the page ("You signed on 22 Oct. A copy is in the Contract tab.") and for the advance case the page title should say "Pay the advance".

## Compare the two sides
| Thing | Freelancer | Client | Issue |
|---|---|---|---|
| Contract text | Same | Same | Good, one source |
| Before the text | Letterhead card | Nothing | Setup only for freelancer, fine but should be hidden |
| Signature | Draw default | Draw default | Both should default to Type |
| Button | Sign and send to Dev | Sign and continue | Client button is vaguer |
| After signing | Project page + invite | Toast + advance checkout | Neither confirms clearly |
| Mentions PayGuard | Yes, in text | Yes, in text | Breaks the product rule on the client side |
| Pending state | Small grey badge | Page itself is the prompt | Freelancer's waiting state is hidden |

## Required vs optional (summary)
- **Required:** project name, parties, stages, prices, dates, signature, tick box.
- **Optional:** letterhead, footer line, own clauses, advance, automatic approval, extra round fee.
- Show required things first and in the flow. Put optional things behind a link or in Settings.

## Top 5 things to fix on these screens
1. Move letterhead / footer / own clauses out of the sign page (Settings plus one small optional link), so "review and sign" is only review and sign.
2. Replace the signature card with a popup: Type by default, "Draw instead" as a link, one tick box, and a hint explaining the grey button.
3. Add a short "what you are agreeing to" summary (money, advance, dates, rounds) above the contract on both sides, and make the client button say what comes next ("Sign and pay Rs 15,000 advance").
4. Make "waiting for the client to sign" a first-class state: banner on Stages, dot on the Contract tab, "Send reminder" and "Copy link" on the Contract tab, plus a clear "You signed" confirmation after signing.
5. Remove "PayGuard" and the prototype/legal fine print from the contract text itself (client sees the studio), and shorten the contract view with collapsible sections, jump links, and no review panel on the client Contract tab.
