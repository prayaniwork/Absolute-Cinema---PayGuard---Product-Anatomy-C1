# Audit 04: Plan (creating a new project)

Screens covered: Project section, Stages section, Terms section, and the phone version.
Sources: `f11-plan-project.png`, `f12-plan-stages.png`, `f13-plan-terms.png`, `m04-plan.png`, and `sPlan`, `planSum`, `planMoney`, `selC`, `orderWarn`, `sugHTML`, `parseBrief`, `briefApply`, `validateDraft` in `prototype/nazar/app.js`.

**One thing to know first.** Project, Stages and Terms look like three tabs, but they are not three pages. They are one long page with three sections. The tabs only scroll you down it, and the highlighted tab changes as you scroll (`planGo`, `planSpy`). The three screenshots are the same page at different scroll positions. So the freelancer faces one long form of about 20 fields, and the "tabs" make it look shorter than it is.

---

## Screen 1: Project section ("Project and client")

### 1. The job of this page
A freelancer has just agreed to work with a new client. They need to say who the client is and what the project is called, in under 10 seconds, so the client can get a link.

Smaller jobs, in order:
1. Name the project.
2. Say who the client is (contact name and email, which is where the link goes).
3. Optional: company, WhatsApp number, logo and colour (for the freelancer's own list).

### 2. What is on the page today
- **Top bar:** "Clients > New project", "Cancel", and a black "Review the contract" button.
- **Tabs (sticky):** "Project", "Stages" (with a small count "1"), "Terms".
- **Section "Project and client":** Project name, Client company, Contact name, Contact email, "WhatsApp number (optional)", an "Add logo" button, and 10 colour dots.
- **Right side:** nothing at first. The side panel is hidden until a price or a date is entered (`planShow`).
- **Bottom:** no summary. The sidebar shows a black "Untitled project" item.
- Seven input areas plus a logo and a colour picker, all in one block.

### 3. What is going wrong
1. **The page does not look like what it is (Big).** Three tabs suggest three short steps. In fact the user scrolls through one long form and the tab highlight jumps around on its own. A beginner cannot tell how much work is left or where they are.
2. **Required and optional are mixed (Medium).** Only WhatsApp says "(optional)". Company, logo and colour are also optional but are not marked. Project name, contact name and contact email are required but are not marked either. The user finds out only after pressing "Review the contract" and seeing red messages (`validateDraft`).
3. **Logo and colour picker take as much space as the client's name (Medium).** They are a nice-to-have for the freelancer's own view. They sit above the main job and look like a task. The tiny dot in the logo box looks like a loading glitch.
4. **Two buttons say "Review the contract" (Small).** One at the top, one in the side panel. That is fine. But "Review" is vague: the user does not know it also creates the project and asks them to sign.
5. **"WhatsApp number" is asked here, but nothing says why (Small).** A freelancer will wonder if the client gets WhatsApp messages from PayGuard.
6. **Nothing says the client will get a link (Medium).** The contact email is the most important field, but the page never says "we will send this person a link, no account needed".

### 4. What the page should look like

Keep: project name, client name, client email. Move: company, WhatsApp, logo and colour into a closed "More about the client (optional)" block. Remove: colour picker as a default (pick a colour for them automatically, as the code already does with `nextColor()`). Merge: company and contact name into one "Client" label if the user has only one.

```
New project                              [Cancel]  [Next: Stages]
Step 1 of 3   Project > Stages > Terms

What is the project called?
[ Project name                         ]

Who is it for?
[ Client's name ]      [ Client's email ]
  We will send them a link to sign. They do not need an account.

> More about the client (optional)   (company, WhatsApp, logo, colour)
```

Visible by default: project name, client name, client email. Behind a click: everything optional.

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Section title | Project and client | Project and client (keep) | Clear already |
| Contact name | Contact name | Client's name | Plain word, matches "client" everywhere |
| Contact email | Contact email | Client's email, with hint "They get a link here. No account needed." | Explains the purpose |
| Company | Client company | Company (optional) | Marks optional |
| WhatsApp | WhatsApp number (optional) | Phone or WhatsApp (optional). Used for reminders you send. | Says why |
| Top button | Review the contract | Next: Stages (on step 1) | The button should match the step |
| Placeholder | e.g. Arjun Rao | keep | Good example |

### 6. Questions for the owner
- **Is WhatsApp ever used by PayGuard, or only stored for the freelancer?** I would hide it under "optional" and keep it, because it helps a freelancer's own follow-ups.
- **Do we need the colour picker at all?** I would pick the colour automatically and let people change it later in the client page.

### 7. Related screens
- Before: Clients list (user pressed "New project" or "Add client"). They expect a short form.
- After: Stages. They expect to describe the work and prices next.

---

## Screen 2: Stages section

### 1. The job of this page
The freelancer is turning "what I promised" into stages with a price and a date each, in a way the client will agree to. They must be able to get one valid stage in under 10 seconds.

Smaller jobs, in order:
1. Name each stage, say what it includes, price it, date it.
2. Add or remove stages.
3. Get a head start (upload a brief, or pick a template).

### 2. What is on the page today
- **Heading:** "Stages", then "Your client agrees to this when they pay. Stages run one after another unless you say otherwise."
- **Brief box:** "Start from a brief. Upload the client's brief and we'll split it into stages, with what's included, prices and dates. You can edit everything." Buttons "Upload a brief" and a link "Try a sample brief".
- **Template row:** "Start from" with "One payment", "Half and half", "Three stages".
- **Stage card** (one per stage): "Hide details", number, Stage, "Amount (₹)", "Delivery date", an X button, "What's included (one per line)" text box, a line "Suggested ₹X · usually ₹A to ₹B" with "Use ₹X", and from stage 2 a checkbox "Runs alongside the previous stage".
- **Under the stages:** "Add a stage", "Suggest prices", "Collapse all", and "Suggested prices are estimates from typical freelance rates, not a quote. Adjust for your own experience."
- **Right side panel** (once a price or date exists): "Summary", a row per stage, "Project total", "Advance", "Balance after approval", "You receive", "Paid straight to you. No PayGuard fee in the beta.", then "Delivery dates" calendar and "Review the contract".
- Before the first stage field there are two "shortcuts" (brief, templates), so the top of the section has 5 buttons and a paragraph before the user types anything.

### 3. What is going wrong
1. **Two kinds of "starting help" compete before the real form (Big).** The brief box is large and has a box, an icon, a paragraph and two actions. Then there is a second row of "Start from" templates. A beginner does not know which to choose, or that the brief upload is optional. Meanwhile the real form (the stage) is pushed below the fold (see `f11`, where the first stage is cut off).
2. **The word "Start from" appears twice with different meanings (Small).** "Start from a brief" and "Start from: One payment / Half and half / Three stages". The second one means "how many stages". "Half and half" is not obviously "two stages, 50% each".
3. **"Your client agrees to this when they pay" is wrong or at least confusing (Big).** The client agrees when they sign the contract, which comes first. It also says nothing about what the stage list is for. This contradicts the owner's new rule that signing is the first step.
4. **Four fields in a row, three required (Medium).** Name, amount, date are one line; "What's included" is a second required field and is mandatory (`validateDraft`: "List at least one thing this stage includes"). A freelancer who only wants "Logo design, ₹25,000, by 30 Nov" is stopped by the scope box. Hard to see that it is required, because the label only says "(one per line)".
5. **"Runs alongside the previous stage" is confusing (Big).** It appears as a bare checkbox at the bottom of the card, only from stage 2. Beginners do not know what it changes. Under the hood it only decides whether the date must be later than the previous stage (`orderWarn`, `minDue`). It is really a date-checking exception, so the freelancer meets it as a surprise error: "Stage 2 overlaps stage 1. Pick a later date, or turn on 'Runs alongside the previous stage'." The word "overlaps" is jargon, and the fix is hidden in a checkbox far away from the date field.
7. **"Hide details" is at the top right of an open card, "Collapse all" is at the bottom (Small).** Two controls for the same idea in two places. "Hide details" also hides the thing you were just filling in.
8. **"Suggest prices" and "Suggested ₹X · usually ₹A to ₹B" are two different features (Medium).** One is a button for all stages, one is a line under each. The estimates appear to be made-up numbers for a freelancer's own work. The disclaimer is far below at the bottom, 4 lines away from the button. It is a trust risk: a freelancer may feel the tool is telling them how much to charge.
9. **The side summary appears and disappears (Medium).** Until a price or date is typed, the page is a single column (see `f11`, `f12`). When the first number is typed, a whole panel slides in and the form is squeezed. That moves what the user is looking at.
10. **The side summary repeats what the form shows (Medium).** A row per stage with its name and amount, which is the form data again. It only adds value in two places: the total and the advance/balance split. The delivery calendar repeats the dates.
11. **"You receive ₹X" is the whole project total (Medium).** With an advance, it shows "Advance", "Balance after approval", and then "You receive" = the full amount. A beginner reads "You receive" as "what I get right now". It also does not account for tax.
12. **The summary is hidden on phones (Big on phone).** In `m04`, there is no summary at all, so the freelancer never sees the total or the advance split before the contract.
13. **Order of thinking vs order of page (Medium).** A freelancer thinks: "What am I doing? When? For how much?" The row is "Stage, Amount, Delivery date" with the price first. The list of what's included, which is the heart of the stage, comes last, below the others. Price before the work is described feels backwards, and the "Suggested ₹" only works after the scope is typed.
14. **Brief upload errors and results are small (Small).** Messages like "We couldn't find anything to split. Try a brief with headings or bullet points." are fine. But a successful split silently replaces all the stages already typed (with a small Undo link). That is a destructive change with weak warning.
15. **Brief upload dates are guesses (Medium).** `briefApply` makes back-to-back dates from the days found (or 10 days by default) and prices from rates. The user is told "Check the names, prices and dates", which is good, but all three are invented. A freelancer who does not check will send a contract with invented dates.

### 4. What the page should look like

Think in the order a freelancer thinks: what, then when, then how much. Make the stage the star, and tuck the shortcuts away.

Keep: stage cards, "What's included", "Add a stage", Undo for the brief, price suggestions (as a quiet link). Move: the template buttons into the empty state; the brief upload into one link; "Runs alongside" next to the date field and rename it. Remove: the second summary rows (one row per stage in the side panel), the "Suggest prices" global button. Merge: "Hide details" and "Collapse all" into one control.

```
Stages                                   (Step 2 of 3)
What will you deliver, and when do you get paid?

[ Quick start:  Upload a brief   |  One payment  |  Two stages  |  Three stages ]   <- one slim row

 1  Stage name        [ Discovery                      ]
    What is included  [ 3 logo concepts                ]
                      [ One concept refined            ]
    Delivered by      [ 30 Nov ]   Price [ ₹25,000 ]
    > Suggest a price      > This stage runs at the same time as stage 1  (stage 2 and later)

 [+ Add a stage]

Summary (always visible, small, under the list or sticky bottom bar on phone)
   Total ₹75,000   Advance ₹0   You get paid ₹75,000 in 3 payments
```

Visible by default: stage name, what's included, date, price. Behind a click: price suggestion, the "runs at the same time" option, and the brief upload details.

Side panel: keep one small block (total, advance, balance). Drop the per-stage rows. Keep the calendar only if the owner wants it (see questions). Always show the block, even before numbers, so the layout does not jump; show "₹0" and "Add a price to see your total".

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Intro | Your client agrees to this when they pay. Stages run one after another unless you say otherwise. | Break your work into stages. The client reviews and pays stage by stage. | Describes what stages are; no wrong claim about "agrees when they pay" |
| Brief box title | Start from a brief | Have the client's brief? | Question is lighter than a feature banner |
| Brief box text | Upload the client's brief and we'll split it into stages, with what's included, prices and dates. You can edit everything. | We will make a first draft of your stages. Dates and prices are guesses, so check them. | Says honestly what is guessed |
| Template row | Start from: One payment / Half and half / Three stages | Quick start: One stage / Two stages / Three stages | Words match what happens |
| Stage name label | Stage | Stage name | "Stage" alone is a field and a noun |
| Amount | Amount (₹) | Price (₹) | Matches the contract's "Price" column |
| Date | Delivery date | Deliver by | Shorter, and says what it is |
| Scope label | What's included (one per line) | What you will deliver (one per line) | Matches the work, not "included" |
| Checkbox | Runs alongside the previous stage | This stage happens at the same time as the previous one | Plain words |
| Date error | Stage 2 overlaps stage 1. Pick a later date, or turn on "Runs alongside the previous stage". | Stage 2 is due before stage 1 ends. Choose a later date, or tick "same time as the previous stage" below. | "Overlaps" is jargon |
| Suggest | Suggested ₹X · usually ₹A to ₹B | A common price for this is ₹A to ₹B. Use ₹X | Less like a quote |
| Disclaimer | Suggested prices are estimates from typical freelance rates, not a quote. | Prices are a rough guide only. You decide. | Shorter, placed beside the link |
| Summary | You receive | You get paid in total | Does not look like "now" |
| Collapse | Hide details / Collapse all | Collapse / Collapse all (same place) | One idea, one spot |
| Brief success | Added 4 stages from Brief.docx. Check the names, prices and dates. | Added 4 stages from Brief.docx. The prices and dates are our guess. Please check them. [Undo] | States it is a guess |

### 6. Questions for the owner
- **Is the "What's included" field truly required?** I would keep it required, because the contract uses it as the proof of what was agreed and it protects the freelancer. But I would label it clearly and allow just one line.
- **Do we need the calendar in the plan screen?** I would remove it here. The calendar has its own page, and the dates are in the form. It adds a third copy of the same dates.
- **Should "same time as previous" exist at all?** I would keep it but only show it after the user picks a date that clashes, so beginners never see the term unless they need it.
- **Is brief upload an essential first-release feature?** I would keep it, but as a small secondary link, not a banner.

### 7. Related screens
- Before: Project (client details). User expects "now what am I doing for them?".
- After: Terms. They expect rules about reviews and money, ideally with sensible defaults.

---

## Screen 3: Terms section

### 1. The job of this page
The freelancer sets the rules the contract will say (reviews, extra changes, advance, when the originals unlock) and makes sure they can get paid. Most want to accept sensible defaults and move on in under 10 seconds.

Smaller jobs, in order:
1. Confirm the money rules (advance, balance days, when originals unlock).
2. Give the UPI ID so the client can pay.
3. Optionally change review and revision rules.

### 2. What is on the page today
- **Heading "Terms"**, then "Your client reads these in the contract before signing."
- **Six selects/fields in pairs:** "Client replies within" (2/3/5/7 days or Custom), "If they don't reply" (Approve after 2/3/5 days or Never approve automatically), "Rounds of changes per stage" (1/2/3), "Price of an extra round (₹)" (a number, default 6000).
- **Second heading "How you get paid"**, then "You decide. Clients pay you directly by UPI, QR or card. PayGuard never holds the money."
- "Advance before work starts" (No advance / 10% / 25% / 50%), "Balance due within" (3/7/14/30 days), "Original files unlock" (two-way switch: "Stage by stage" / "Once, for the whole project", plus a long hint), and "Your UPI ID" with a hint.
- All of these have a "Custom…" option on the selects.
- That is 8 decisions in one block, no marking of which matter.

### 3. What is going wrong
1. **Too many settings before the first contract (Big).** Eight decisions, and the defaults already come from Settings (`defaultDraft` reads `S().defaults`). Most freelancers never change reply days, auto-approve, rounds or extra price per project. Showing them as open fields makes it feel like homework.
2. **Defaults are invisible (Medium).** The fields show values (3 days, 2 rounds, ₹6000) but nothing says "these are your usual settings". A beginner thinks they must decide.
3. **Required vs optional is not shown (Big).** The UPI ID is required (an error stops "Review the contract") but sits as the last field of the last section, far from the money fields it belongs to, and nothing says it is needed. Extra round price must be a number and 0 means free, which is not said.
4. **Two section titles under one tab (Medium).** "Terms" and "How you get paid" are two headings, but there is only one "Terms" tab. A user who thinks "I want to set my money" has no tab for it.
5. **"If they don't reply: Approve after 3 days" is scary (Big).** Auto-approval by default means a client's silence leads to a payment demand. A freelancer may like it; a client will not. For the freelancer it is unclear what it triggers, and it has no explanation. The label "If they don't reply" is also unclear about replying to what.
6. **"Client replies within" and "If they don't reply" are two linked settings split into two fields (Small).** The user must read both to understand one rule.
7. **"Original files unlock" is a main product idea hidden as a small toggle (Medium).** "Stage by stage" vs "Once, for the whole project" decides how the client pays. The choice is made silently: with 3 or more stages the default is "stage", otherwise "project" (`unlockOf`), but the screen shows one pressed button without saying it was chosen for them. The word "unlock" is also used about the freelancer's own early unlock in the same hint, which makes the sentence long.
8. **"Advance before work starts" is unclear (Medium).** "Advance" is the product word for an upfront payment, but a new freelancer may not realise this is paid straight to them, and that the client is asked right after signing. The hint is in a separate paragraph above.
9. **"Balance due within 7 days of approval" is a third meaning of "days" (Small).** Three time rules sit next to each other (reply days, auto-approve days, balance days) and all read as "days". Easy to mix up.
10. **UPI ID and the money summary are far apart (Medium).** The summary panel says "You receive ₹X. Paid straight to you." but the place where you say where money goes is a section below, in a different part of the form.
11. **The "Custom…" option adds a hidden second input in every select (Small).** It is flexible but invites unusual values (like a 1-day reply) and makes it feel like more work. Most users will never use it.
12. **On the phone the Terms section is a very long list of full-width fields (Medium).** In `m04` it takes more than half of the page, and the final unlock control is half covered by the floating role bar.
13. **Copy "Your client reads these in the contract before signing" is good (keep).** It tells the user why this matters.

### 4. What the page should look like

Make Terms a short, calm summary with defaults, and let people change only what they care about.

Keep: UPI ID, advance, balance days, unlock choice, review and revision rules. Move: UPI ID to the top of the money block (or to Settings once, and show only if missing). Remove: "Custom…" from selects on this screen. Merge: "Client replies within" and "If they don't reply" into one sentence rule. Merge the two headings under "Terms".

```
Terms                                      (Step 3 of 3)
We have filled these in from your usual settings. Change only what you need.

How you get paid                           (always visible)
  Advance before work starts    [ No advance v ]
  Original files unlock         ( ) Stage by stage   ( ) Once, at the end
  Where clients pay you         [ name@bank ]   <- required, shown only if not saved in Settings

Review and changes                         (closed by default)
> Client has 3 days to reply. We approve for them after 3 more days.
  2 rounds of changes per stage. Extra rounds cost ₹6,000.      [Change]
  Balance due 7 days after approval.                            [Change]
```

Visible by default: advance, unlock choice, UPI ID (if missing). Behind a click: reply days, auto-approval, rounds, extra price, balance days.

### 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Intro | Your client reads these in the contract before signing. | We filled these in from your usual settings. Your client reads them in the contract. | Says they are defaults |
| Client replies | Client replies within | Client has this long to review | Says what they do |
| Auto approve | If they don't reply | If they still do not reply | Continues the sentence |
| Auto option | Approve after 3 days | We approve it after 3 more days | Says who acts, and "more" |
| Never option | Never approve automatically | Wait until they reply | Plain words |
| Rounds | Rounds of changes per stage | Rounds of changes included | Shorter |
| Extra round | Price of an extra round (₹) | Each extra round costs (₹). Enter 0 if free. | Explains 0 |
| Section | How you get paid | How you get paid (keep) | Clear |
| Advance | Advance before work starts | Advance paid before work starts | "Advance" is a product word; keep it and add "paid" |
| Balance | Balance due within / days of approval | Client pays within 7 days of approving | Reads as a sentence |
| Unlock | Original files unlock | When the originals unlock | Uses the product word |
| Unlock options | Stage by stage / Once, for the whole project | After each stage is paid / After everything is paid | Says the trigger, not the mechanism |
| Unlock hint | You can also unlock early whenever you choose. | You can unlock early at any time. | Shorter |
| UPI | Your UPI ID | Your UPI ID (needed so clients can pay you) | Marks it as required, and why |

### 6. Questions for the owner
- **Should auto-approval be on by default?** I would turn it off ("Wait until they reply") by default and let freelancers opt in, because silence turning into a payment demand is a risky default and it is the one thing a client will notice.
- **Should the UPI ID live only in Settings?** I would ask for it once in onboarding or here the first time, then hide the field. It is not a per-project decision.
- **Should the unlock choice be per project or a Settings default?** I would keep it per project, because it changes how the client pays, but pre-select it with a short reason ("We chose this because you have 3 stages").

### 7. Related screens
- Before: Stages. The user expects the rules to follow once the work and prices are done.
- After: Contract (opened by "Review the contract"). They expect to see everything just entered, in contract words, and a way to send it for signature. Today the button name does not say the next screen is a signing step. The Terms values appear again in the contract, in the project page "Money" side block, and in Settings defaults (the same rules in four places).

---

## Phone version (`m04-plan.png`)

### 1. The job of this page
Same as the desktop, but the freelancer is probably on the move and has just agreed a job by chat. They should be able to enter a project name and a client email in 10 seconds.

### 2. What is on the page today
- Sticky top: "New project", "Cancel", "Review the contract" (partly cut off).
- Sticky tabs: Project / Stages 1 / Terms.
- One column, full width, about 2,200 px long: seven fields, logo + 10 colour dots (they wrap onto a second line), the brief box, the template buttons (wrapping on two lines), the stage card, "Add a stage", "Suggest prices", Terms (4 fields), "How you get paid" (4 fields).
- The floating "View as" bar of the prototype covers the bottom (a testing tool, ignore).

### 3. What is going wrong
1. **No summary, no total (Big).** The summary is a desktop side panel. On the phone nothing shows the total or the split, so the user never sees what they are creating before the contract.
2. **The very long page and the tabs mislead (Big).** The tabs look like steps but scroll the same page. On a phone, scrolling 2,200 px with a changing tab highlight is disorienting.
3. **The top "Review the contract" button is cut off (Medium).** The label is clipped at the top edge in the screenshot.
4. **The first stage is a form inside a form (Medium).** Amount and date share a row with an X, but the stage name is above. The label "Hide details" floats above the card and the X looks like it closes the whole project.
5. **Brief box takes a full phone screen (Medium).** It is the tallest block before the real stage fields.
6. **Colour dots wrap awkwardly (Small).** Nine on a row, one on its own.
7. **Terms fields are as large as the stage fields (Medium).** Everything has equal weight, so nothing says "this one matters".

### 4. What it should look like
One step per screen with a bottom "Next" button (Project, Stages, Terms), a sticky bottom bar showing "Total ₹X" and "Next", and the optional pieces collapsed. The same structure as desktop, just one step at a time. On phone this is clearly better than one long scroll, and it matches the stepper idea from the user test.

```
[ <  New project            Step 1 of 3 ]
 Project name
 Client's name
 Client's email
 > More (optional)
 ------------------------------------
 [ Next: Stages ]
```

### 5. Copy fixes
Same as the desktop tables. Extra: top button on phone should be "Next" not "Review the contract" until the last step. Last step button: "Review contract".

### 6. Questions for the owner
- **Do you want real separate steps (one screen each) on phone only, or on desktop too?** I would pick steps everywhere. The code already has three sections, so the change is about navigation, not content.

### 7. Related screens
Same as desktop. On the phone the bottom navigation (Today, Clients, Calendar, Payments, Settings) stays visible during creation, which invites the user to leave and lose the draft. A draft is kept ("Untitled project" in the sidebar), which is good; keep that, and tell the user so ("Draft saved").

---

## What already works (keep it)
- Hints and errors are specific, e.g. "Include the country code, e.g. +91".
- The draft is saved and shows as "Untitled project" in the sidebar.
- The brief upload with an Undo link is a strong feature.
- "Your client reads these in the contract before signing" tells the user why the terms matter.
- Paid straight to you, no PayGuard fee, is stated where the money is shown.
- Stage cards can collapse into a one-line summary of name, price, date and number of items. That is a good pattern.

---

## Top 5 things to fix on these screens
1. **Make it a real 3-step flow (Project, Stages, Terms), not one long page with fake tabs.** Show "Step 1 of 3", one "Next" button, and on phone one step per screen.
2. **Cut the Terms section down to defaults.** Show only advance, unlock choice and UPI ID by default. Put reply days, auto-approval, rounds, extra round price and balance days in a closed "Review and changes" block that reads as one sentence. Turn auto-approval off by default.
3. **Put the stage first on the Stages step.** Order: stage name, what's included, deliver by, price. Shrink the brief box and the templates into one "Quick start" row.
4. **Fix "Runs alongside the previous stage".** Rename it ("This stage happens at the same time as the previous one"), put it next to the date, and rewrite the "overlaps" error in plain words.
5. **Keep a small, always-visible money summary (including on phone) and remove the repeated rows and calendar.** Show total, advance and balance only, label it "You get paid in total", and mark which fields are required (name, client name, client email, UPI ID, and each stage's name, what's included, date and price).
