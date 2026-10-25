# IA audit 03: Clients, Payments, Calendar

Screens: `f06-clients.png`, `f07-payments.png`, `f08-calendar.png`.
Code: `sClients` / `clientsTable` / `fTable` / `sPayments` / `sCalendar` / `bigCalInner` / `calEvents` / `eventsOf` in `prototype/nazar/app.js`.

## First: what is the difference between Today, Clients, Payments and Calendar?

Right now a beginner cannot tell. All four are "lists of the same projects, sliced differently", and each one shows client name, stage name, amount and a coloured status word.

| Page | The question it should answer | What it actually shows today |
|---|---|---|
| Today | "What do I need to do right now?" | Needs you / Waiting / Coming up, plus money tiles, plus a Board view |
| Clients | "Who am I working with?" | One row per client with status, value, next stage |
| Payments | "Where is my money?" | One row per **stage** with a status word that is really *work progress* |
| Calendar | "What is due when?" | Stage due dates and reply deadlines |

The structure underneath is a tree: **Client > Project > Stage**. The code already builds it (`clientsTable` groups projects by client email). But the screen never shows it. Clients shows only one project per client ("+ 2 more" if there are others). The left sidebar also lists projects, named after the client. So the sidebar "Projects" list and the "Clients" page look like the same list twice. In the demo data every client has exactly one project, so the problem is invisible. A real freelancer with 5 to 15 clients will have repeat clients, and then it breaks.

The main idea of the fix: give each page **one job and one kind of row**.
- Today: rows are **actions** ("Remind Priya", "Review changes").
- Clients: rows are **people** (Client > their projects).
- Payments: rows are **money** (an amount and who owes it, or who paid it).
- Calendar: rows are **dates**.

---

# Screen 1: Clients (`sClients`)

## 1. The job of this page
A freelancer comes here when they think "where do I stand with Priya?" or "who haven't I heard from?". In under 10 seconds they must be able to find one client and see their state. Smaller jobs, in order:
1. Find a client (search or scan).
2. See who needs me, and who I am waiting on.
3. Open a client's project (or start a new one for a repeat client).

## 2. What is on the page today
- **Top bar:** "Clients" (the same word is repeated right below as the big heading).
- **Heading block:** H1 "Clients". Subtitle "10 clients, including finished work."
- **Filter row:** chips "All 10", "Needs you 7", "Waiting 1", "On track 1", "Done 1", then a search box "Search clients".
- **Table columns:** Client | Project | Next up | Value | Status.
  - Client cell: logo + studio name (Bloom Studio) + contact person (Priya Nair).
  - Project cell: project name (Website redesign) + "1 of 4 stages approved". If a client has more than one project: "+ 1 more" and "2 projects ·".
  - Next up: stage name + "Due Wed 21 Oct".
  - Value: "₹1,60,000".
  - Status: a coloured pill: "Needs you" (red or amber), "Waiting" (grey), "On track" (blue), "Done" (green).
- **Bottom:** "10 clients" (the count is repeated a third time).
- **Left sidebar:** a "Projects" list with the same 10 names and red dots. The red dots again mean "needs you".
- **Number of things competing:** 10 rows x 5 columns, 7 of which say "Needs you". That is about 50 cells and 7 identical pills. Nothing stands out.

## 3. What is going wrong
1. **7 of 10 rows say "Needs you".** (Big) A label that is on 70% of rows tells you nothing. It does not say *what* they need from me, so I still have to open each one. Red and amber pills carry the same words but different colours (`projStatus`: red vs amber severity), so the colour hides a second meaning that nobody explains.
2. **Status words mean different things on different pages.** (Big) "Waiting" here is a grey pill for "the client has to act". On Today, "Waiting on clients" is a section. In the sidebar there is no word at all. "On track" has a blue pill that is styled as "In progress" (class `funded`). On the Payments page "In progress" is used for stage work. A beginner will think "On track" and "In progress" are different states, or the same one.
3. **A client page that hides projects.** (Big) The row represents a client, but opens "the most urgent project" only. A repeat client's second project is only reachable through "+ 1 more" text, which is not clickable on its own. The tree Client > Project > Stage exists in the code but is not visible.
4. **Same list as the sidebar.** (Medium) The sidebar "Projects" lists 10 items named after clients; the Clients page lists the same 10. With one project per client, a beginner sees two lists of the same thing and asks "what is a project and what is a client?"
5. **Repeated words.** (Small) "Clients" appears in the top bar, the H1, the subtitle and the footer count. "10 clients" is shown 3 times (subtitle, "All 10" chip, footer).
6. **Columns the page does not need.** (Medium) "Value" is the sum of all stages across all projects. That is a Payments question, and it is not clear if it means "total contract" or "what I'm owed". "Project" and "Next up" both talk about the same project, so there are two lines of text per cell, 4 lines of text per row.
7. **What this page needs but hides.** (Medium) No "what exactly do they need from me". The reason is already known by the app (`attentionFor`: "Signature missing", "Approve payment", "Reply to changes"), but the row only says "Needs you". Also missing: contact for the client (email, to send a link again), and "last activity".
8. **Next up for a finished client.** (Small) "Done" in grey text under Next up, and "Done" green pill under Status. Two "Done"s on the same row.
9. **Nothing here for adding a client or new project.** (Small) "New project" is only in the sidebar. A freelancer on the Clients page expects "Add client" or "New project for this client".

## 4. What the page should look like (information architecture)
Make Clients the **people** page, and make the tree visible.

```
Clients                                        [ Search ]  [ + New project ]
10 clients · 3 need you · 1 waiting on a client

[All] [Need you 3] [Waiting on client 1] [In progress 5] [Finished 1]

Client                  What is happening                       Money
-----------------------------------------------------------------------------
Bloom Studio            Sign contract: not yet signed            Owed ₹0
 Priya Nair             1 project - Website redesign             of ₹1,60,000
  > Website redesign    Stage 2 of 4: Homepage design, due 21 Oct
  > Brand kit           Finished
```
- **Keep:** logo + name + contact, search, status filters, "stage x of y", the due date.
- **Move:** "Value" into a plain "Money" column that says one thing (for example "Owed ₹35,000" or "Paid ₹80,000 of ₹1,10,000"). Details stay on Payments.
- **Remove:** the H1 + top bar duplicate (keep the top bar only), the footer count, and the second "Done".
- **Merge:** "Project" and "Next up" into one "What is happening" cell: *plain sentence first* ("Waiting for Priya to sign"), project and stage below in grey.
- **Make visible:** a client row expands (click the arrow) to show its projects; click a project to open it. A client with one project can open straight away.
- **Replace "Needs you" with the reason.** Pill text = the one thing: "Send contract", "Review changes", "Remind to pay", "Waiting for client", "On track", "Finished". Use red only for late things.
- **Sidebar:** rename "Projects" to "Recent projects" or keep it but show only projects that need you. Then it is not a copy of this page.
- **Hidden behind a click:** the list of a client's other projects, finished projects, the client's contact details.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Subtitle | "10 clients, including finished work." | "10 clients. 3 need you." | Tells the one fact that matters. |
| Chip | "Needs you" | "Your turn" (or the reason, e.g. "Review changes") | "Needs you" is on every row and is vague. |
| Chip | "Waiting" | "Waiting on client" | Says who is being waited on. |
| Chip / pill | "On track" | "In progress" | Same word as Payments and the stage stepper. One word for one state. |
| Chip | "Done" | "Finished" | "Done" is used for stages and for the whole project; "Finished" is only for the project. |
| Column | "Next up" | "Next stage" | Uses the product word "stage". |
| Column | "Value" | "Project value" or "Owed" | "Value" could be any money. |
| Cell | "1 of 4 stages approved" | "Stage 2 of 4" | Beginner-friendly; approved is only one of the stage states. |
| Search | "Search clients" | "Search clients or projects" | The search also matches project names (the code does). |
| Footer | "10 clients" | (remove) | Already said twice. |

## 6. Questions for the owner
1. **Is a repeat client common?** I would pick "yes" and show Client > Project, because freelancers with 5 to 15 clients almost always have repeat work. If "no, one project per client" is the rule, then merge Clients and the sidebar and drop the Clients page as a separate place.
2. **Should clients get their own page** (contact details, all projects, history)? I would pick "not yet": use the expanding row. A page per client is more building and no one asked for it.

## 7. Related screens
- **Before:** the sidebar or Today ("Remind Priya" opens a project).
- **After:** the project page of the most urgent project (should open the one the status is about, and show the others in a switcher).
- Clients and Today must use the same status words. Today decides the words; Clients reuses them.

---

# Screen 2: Payments (`sPayments`)

## 1. The job of this page
A freelancer comes here when they ask "who owes me money, and how much have I received?". In under 10 seconds they must see: money owed, money late, money received. Smaller jobs:
1. Chase a late payment (Remind).
2. See what was paid and get a receipt or invoice.
3. See what is coming (stages not yet started).

## 2. What is on the page today
- **Heading:** "Payments", subtitle "Every stage, and where its money is."
- **Three cards:**
  - "Awaiting payment ₹35,000 / 2 late" (clock icon, red tint)
  - "In progress ₹3,49,000 / ₹60,000 in review" (lock icon, blue)
  - "Paid to you ₹2,43,000 / Straight to your account" (wallet icon, green)
- **Filter row:** chips "All 27", "Awaiting payment 1", "In progress 5", "In review 1", "On hold 1", "Unlocked 8", "Not started 11", and at right "Paid straight to you".
- **Table:** Client | Stage | Amount | Status | (button "Documents").
  - Status pills: "On hold" + "Reply by Mon 26 Oct", "Awaiting payment" + "Payment late", "In review", "In progress", "Changes requested", "Advance due" + "Waiting on the client", "Not started".
- **Bottom:** "27 stages · No PayGuard fee in the beta".
- **Number of things competing:** 3 cards, 7 chips, 27 rows, 9 different status words, a button on most rows.

## 3. What is going wrong
1. **The page is about money, but the status words are about work.** (Big) "In progress", "In review", "On hold", "Not started", "Changes requested" say how the *design work* is going, not whether the money has been paid. A beginner reading "In progress ₹3,49,000" asks: has this been paid, or not? (In the code, "In progress" = `funded`, `submitted`, `dispute`, which includes stages that are in review and on hold, and the card says "₹60,000 in review" as a subline of the same number.) So the card double-counts the idea: "In progress" includes "In review" and "On hold", but the chips below separate them.
2. **The three cards disagree with the chips.** (Big) The cards say 3 things; the chips say 7. "In progress ₹3,49,000" has no matching chip total. "Awaiting payment" card = approved stages; chip "Awaiting payment 1" matches, but chip "Unlocked 8" has no card; "Paid to you" counts unlocked balances **plus advances**, so it does not equal the "Unlocked" rows added up.
3. **"Paid to you" vs "Awaiting payment" vs "In progress" is the confusing trio from the user test.** (Big) Reasons:
   - "In progress" next to a lock icon looks like "money locked" (as in escrow). PayGuard holds no money. The lock icon contradicts the product.
   - "Paid to you / Straight to your account" is fine as an idea but the words do not say *when* money counted. After unlock? After the client pays?
   - "Awaiting payment" is reused as both a card and a row status, and on Today it means something slightly different ("Approved, not yet paid").
4. **"Paid straight to you" appears 3 times.** (Medium) Card sub-line ("Straight to your account"), the filter row, and the footer ("No PayGuard fee"). It is true and reassuring but it is noise on every visit.
5. **Stage rows with no money state.** (Medium) 11 of 27 rows are "Not started" and sit at the bottom, scrolling the page; they are future money, not payments yet. Mixing "what has happened" with "what might happen" makes the page long (the screenshot is cut at row 13).
6. **"Advance due" shows up in a table about stages.** (Medium) Advance is paid to the freelancer *before* work. It lives on the first stage row ("Saffron Hotels, Logo options ₹36,000, Advance due, Waiting on the client") so the amount shown (₹36,000) is the stage price, not the advance amount. A beginner cannot see how much advance is due.
7. **Two lines of red text with no clear action.** (Medium) "Payment late", "Waiting on the client", "Reply by Mon 26 Oct". These are the most urgent facts on the page, but they are small text under a pill, and there is no "Remind" button on the row. The only button is "Documents".
8. **"Documents" is an unclear button.** (Medium) What is inside? An invoice, receipt, contract? It opens the receipt modal (`data-a="receipt"`). On a row that has not been paid yet, "Documents" shows nothing useful.
9. **Hidden: who the money is from, and when it was paid.** (Medium) "Paid 12 Oct" is only added for unlocked rows. There is no date column, so "when" is split between "Due Tue 20 Oct" (stage deadline, not payment date) and a hint.
10. **"Due" date means stage delivery, not payment date.** (Small) "Due Tue 20 Oct" under a stage next to an amount reads like "payment due". It is the delivery date.
11. **Heading + top bar duplicate** (Small): "Payments" twice.

## 4. What the page should look like (information architecture)
Split by *money state*, in the order the money moves: **Asked > Paid > (later) Upcoming.**

```
Payments
Money straight from your clients to you. PayGuard holds nothing.     (one line, once)

[ Owed to you ]            [ Late ]               [ Received ]
  ₹35,000                    ₹35,000 (2)             ₹2,43,000
  1 payment waiting          Remind                  this year

[Owed 1] [Received 8] [Coming up 17]       <- 3 chips, not 7

Owed
  Northwood Cafe   Concepts    ₹35,000   Late by 3 days        [Remind]
  Saffron Hotels   Advance    ₹18,000   Waiting for client      [Remind]
Received
  Orbit Labs       Final deck  ₹30,000   Paid 12 Oct             [Receipt]
Coming up  (collapsed by default)
  11 stages not yet started, ₹3,49,000 total
```
- **Keep:** one row per payment (with client, stage, amount, date), Amount in mono type, filtering, "late" in red.
- **Change the cards** to the 3 money facts: **Owed to you**, **Late** (only when there is one), **Received**. Drop the "In progress" card.
- **Move** the work states (In review, On hold, Changes requested, In progress) off this page. They live on Today and the project stepper. If someone is "on hold", show it as a small note on the row, not a status.
- **Remove:** the lock icon; "Paid straight to you" in the filter row and footer (say it once, at the top).
- **Merge:** "Not started" stages into one collapsed line "Coming up".
- **Add:** a visible **Remind** button on late rows. Show the **advance** as its own row ("Advance, Saffron Hotels, ₹18,000").
- **Hidden:** receipts/invoices (behind "Receipt" or a row click), coming-up list.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Card 1 | "Awaiting payment" | "Owed to you" | Plain: someone owes me. "Awaiting" is passive and mixes with a stage state. |
| Card 2 | "In progress ₹3,49,000" | (remove) or "Coming up ₹3,49,000" | "In progress" is about work, and the lock suggests held money. |
| Card 3 | "Paid to you" | "Received" | Shorter; "to you" is obvious on your own page. |
| Card sub | "Straight to your account" | "Paid straight to you, 2 advances included" | Says what is inside the number. |
| Subtitle | "Every stage, and where its money is." | "Money your clients owe you and have paid you." | "Where its money is" suggests PayGuard holds it. |
| Chip | "Unlocked 8" | "Received 8" | On a money page, say money. "Unlocked" is the file state. |
| Row status | "Awaiting payment" | "Waiting for payment" with the date: "Pay by 25 Oct" | Beginners read "awaiting" as formal; the date is the point. |
| Row status | "Payment late" | "Late by 3 days" | A number is clearer than a word. |
| Row status | "Advance due" | "Advance, ₹18,000, not paid yet" | Shows what and how much. |
| Row button | "Documents" | "Receipt" (paid) / "Remind" (owed) | A button should say what happens. |
| Footer | "27 stages · No PayGuard fee in the beta" | (remove, or put once in the subtitle) | Repeated. |
| Column | "Stage" with "Due Tue 20 Oct" | "Stage" with "Delivery due 20 Oct" | Avoids reading it as a payment date. |

## 6. Questions for the owner
1. **Should Payments show stages that are not started?** I would pick "no, collapse them". The user test asked for clearer money words; future stages add noise.
2. **Does "Received" count the advance?** I would pick "yes, and show it as its own row", because it is real money received.
3. **Should the Payments page have the word "unlocked" at all?** I would pick "no". Unlocked is about files; on this page use only money words.

## 7. Related screens
- **Before:** the Today money tiles ("Payment status", "Awaiting payment", "Expected 30 days") and the Today "Awaiting payment" action. They must show the same numbers and the same names as this page. Right now Today has "Awaiting payment ₹…, Approved, not yet paid" and "Expected, Next 30 days", and Payments has "Awaiting payment" and "In progress". Four different money words across two pages.
- **After:** clicking a row opens the project, scrolled to that stage (`data-mid`). That works and is good. "Remind" opens the remind modal.

---

# Screen 3: Calendar (`sCalendar`)

## 1. The job of this page
A freelancer comes here to answer "what is due this week, and is anything piling up?". In under 10 seconds they must find "today" and see the next dates. Smaller jobs:
1. See what is due soon (deliveries, replies from clients).
2. See one client's dates only.
3. Open the project for a date.

## 2. What is on the page today
- **Top:** a row of 11 pill buttons: "All clients" (selected), then one per client, each with a coloured dot ("Bloom Studio", "Acme Logistics", ... "Studio Nine"). Wraps onto 2 lines.
- **Month header:** "October 2026" with "‹" and "›" buttons.
- **Month grid:** Mon to Sun. Each day shows up to 3 chips like "Bloom Studio: Disc…", "Acme Logistics: Ul…", "Reply due" (dashed outline). Today (22) has a black circle. Past chips are faded green; future chips are the client's colour.
- **No** heading, no list of upcoming dates, no "Today" button, no legend explaining the dashed "Reply due" or faded green.
- **Hover (tooltip):** full label and sub text ("Homepage design · Delivery").
- **Competing items:** 11 filter pills, ~10 colours, 3 chip styles, plus a grid.

## 3. What is going wrong
1. **Colour is spent on the client, not on the meaning.** (Big) With 10 clients there are 10 colours. Beginners cannot memorise them, and the colour does not tell you what to do. It also repeats after 10 clients (`CC` has 10 colours), so client 11 shares a colour. Meanwhile real meaning (done, due, late, reply due) is shown only by faint opacity or a dashed outline. This is the colour-vs-single-colour question from the meeting. See the recommendation below.
2. **Chip text is cut off.** (Big) Every chip is "Client name: Stage name" in a narrow cell, so the stage name (the useful part) is cut: "Bloom Studio: Disc…", "Greenleaf Foods: S…". Nobody can tell what is due without hovering. Longer names (Greenleaf Foods) are worst.
3. **Not clear what a date means.** (Big) A chip is a *stage delivery date* or a *client reply deadline* or a *finished stage*. Only "Reply due" says which. For the rest the tooltip says "Delivery", "Payment" or "Unlocked", but not visible on the page. In the code the `sub` text for an approved stage says "Payment", but the date shown is still the stage's due date, not a payment date. So the calendar can say "Payment" on a date that is not when payment is due.
4. **Past events look like they are broken.** (Medium) Done chips are pale green with low-contrast text (the screenshot: "Orbit Labs: Story"). A beginner may read them as disabled or errors.
5. **Missing things this page needs.** (Medium)
   - No "Today" button; after clicking › you cannot get back.
   - No "Coming up" list. The code has it for the small calendar (`calendar()` shows `.ag`) but the big one drops it.
   - No payment date (`payBy`) and no advance date, even though money dates matter most.
   - No page heading, so the page looks different from Clients and Payments.
6. **Chip says "+N more" but is not clickable.** (Small) On a busy day the extra events are not reachable.
7. **Client filter takes a lot of room.** (Medium) 11 pills across 2 rows push the calendar down. With 15 clients it will be 3 rows. A dropdown is enough.
8. **Reply due shows no client.** (Medium) The chip just says "Reply due". On a day with several clients you cannot tell whose reply. The text says "Reply due" but you would expect "Priya's reply due".
9. **Mismatch with the project page.** (Small) The project page calls the same event "Stage 2" (with `Stage n` tag), the calendar uses client name. Same event, different label.
10. **Today page already has "Coming up".** (Small) Calendar duplicates the next-dates list; the difference between the two is not explained.

## 4. What the page should look like (information architecture)
Keep the month grid, but make it readable and calm.

```
Calendar                       [ All clients v ]   [ Today ]   ‹ October 2026 ›

Mon   Tue   Wed   Thu   Fri   Sat   Sun
 ...                      21 (Wed)
                          . Homepage design    (stage due)
                          . Landing page       (stage due)
                          ! Reply due: Priya   (client's turn)
                          22 = today (dark circle)

Legend (small, one line):  . stage due    ! needs a reply or payment    check finished
```
- **Keep:** the month grid, the "today" circle, clicking an event to open the project, the faded look for finished things (but darker text).
- **Change colour** (my recommendation, below).
- **Change the chip text:** stage name first, client name second: "Homepage design · Bloom". If it does not fit, show the stage name only and put the client in the tooltip and in the day popup.
- **Move** the client filter into one dropdown "All clients".
- **Add:** a "Today" button; payment-due dates; a click on a day (or "+2 more") opens a small list for that day; a one-line legend.
- **Remove:** the 11 pills.
- **Hidden:** the day details (behind a click), the legend (can be a small "?").

**Recommendation on colour (the meeting's open question).**
Pick **one calm base colour for all events, and spend colour only on meaning.**
- Normal stage due date: neutral/blue (one colour).
- Needs attention (late, reply due, payment due): amber or red.
- Finished: grey with a tick.
- Client identity: shown by text and the filter, not by hue. Offer an optional toggle "Colour by client" for the person who asked for it. Default it **off**.

Why: the person who wanted colours wants to *see which client at a glance*. The person who wanted one colour wants *to not be overloaded*. The text label solves the first need (once the stage text is not cut off), and meaning-colours solve "what needs me". With 10+ clients, 10 colours cannot be learned anyway. Test it: ask users to find "everything late this week" in both versions.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Chip | "Bloom Studio: Homepage design" | "Homepage design" (client in tooltip) or "Homepage design · Bloom" | Do not lose the stage name to truncation. |
| Chip | "Reply due" | "Priya's reply due" | Says whose. |
| Tooltip sub | "Delivery" | "Stage due" | Matches "stage" word. |
| Tooltip sub | "Payment" | "Payment due" (and use the real payment date) | A date label should match the date it sits on. |
| Tooltip sub | "Unlocked" | "Finished" | Calendar is about dates, not file state. |
| Filter | 11 pills with "All clients" | one dropdown "All clients" | Saves space, scales to 15 clients. |
| Nav | (none) | "Today" button | Always a way back. |
| Heading | (none) | "Calendar" H1 or just the top-bar title | Same pattern as the other pages. |
| Empty state | "Nothing scheduled" / "Dates appear once you create a project." | Keep | Clear and helpful. |

## 6. Questions for the owner
1. **Colour:** I would pick the neutral plus meaning-colours with an optional "Colour by client". Needs a quick test with the two people who disagreed.
2. **Should calendar show payment dates?** I would pick "yes". Money dates matter more than delivery dates for a freelancer who worries about being paid.
3. **Collaborators and calendar sync (Google/Apple)?** Still undecided; I would pick "not now", but add a simple "Copy calendar link" later.
4. **Should past months show finished stages?** I would pick "yes, faded", as now.

## 7. Related screens
- **Before:** Today ("Coming up" list) and the project page (the stage dates the user set in Plan). Plan sets the dates, so changing a date there must move the chip here.
- **After:** clicking a chip opens the project (works). It should open the right stage.

---

# Cross-page recommendation: one vocabulary for status

The user test said "Paid to you / In process / Awaiting payment mean different things to different people." The code shows why: **one word list is being used for three different questions.**

| Question | Page where it belongs | Words to use (proposal) |
|---|---|---|
| "Whose turn is it?" | Today, Clients | Your turn / Waiting on client / On track / Finished |
| "How is the work going?" | Project page stepper | Not started / In progress / In review / Changes requested / Approved / Unlocked |
| "Where is the money?" | Payments | Owed to you / Late / Received / Coming up |

The meeting names, and my take:
- **"Paid to you"**: keep the idea, change to **"Received"**. It is short and clear. (Keep "straight to you" once as a reassurance line.)
- **"In process"** (people also meant "In progress"): this is a work word. Remove it from Payments. On the project stepper, call it **"In progress"** (and never "In process"; the product already says In progress).
- **"Awaiting payment"**: change to **"Owed to you"** on Payments (with a date), and **"Waiting for payment"** on a stage on the project page. Plain "awaiting" sounds formal.

---

# Top 5 things to fix on these screens

1. **Payments mixes work states and money states.** Cut the page down to money words (Owed / Late / Received / Coming up), remove the "In progress" card and its lock icon, and make the cards match the filter chips.
2. **Clients says "Needs you" on 7 of 10 rows.** Replace the pill with the actual reason ("Review changes", "Send contract", "Remind to pay") and use the same words as Today.
3. **Make the Client > Project > Stage tree visible.** Let a client row expand to its projects; stop the sidebar "Projects" list from being a copy of the Clients page.
4. **Calendar chips cut off the stage name and spend colour on 10 clients.** Show stage name first, use one base colour plus meaning-colours (late, reply due, finished), move the client filter to a dropdown, and offer "Colour by client" as an option.
5. **Add the actions and dates people look for:** a "Remind" button on late payment rows, payment-due dates and a "Today" button on the Calendar, and "Receipt" instead of "Documents".
