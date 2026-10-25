# IA audit 02: Today (the dashboard), sidebar, Cmd+K, phone

Screens covered: Today (list layout), the Board layout, the Waiting on clients and Coming up folds, the Cmd+K search, the sidebar, and the phone version.
Evidence: `f03-today.png`, `f04-today-waiting-open.png`, `f05-today-board.png`, `f10-cmdk.png`, `m01-today.png`, and the code (`sToday`, `dashboard`, `attLv`, `attentionFor`, `boardView`, `upcomingLv`, `openCmd`, `moneyBuckets`, `shell`).

A quick plain-words note first: "information architecture" (IA) just means *what is on a page, in what order, and what it is called.*

**Two things I found in the code that the screenshots hide:**
- **The List/Board toggle is not on the page.** `sToday()` builds the toggle and the three tabs (Needs you / Waiting / Coming up) but only puts them on screen in Board mode. In the normal List mode it shows the dashboard instead, and the toggle is never drawn. So nobody can reach Board. This is why `f05-today-board.png` looks identical to `f03`. The Board is dead code today.
- **Needs your attention shows 5 of 7 rows.** The panel is 292 px tall and scrolls inside itself, with a fade at the bottom. The header says 7. Two rows are hidden with no "show all" link.

---

## Today (the dashboard)

### 1. The job of this page
**Who and when:** the freelancer opens PayGuard in the morning (or between tasks) and must know in under 10 seconds: "Is anything on fire, and what is the one thing I do first?"

Smaller jobs, in order:
1. Act on the thing that needs me (remind a client, upload a preview, reply to a problem) in one click.
2. Know who I am waiting on, so I do not worry about them.
3. See roughly what money is coming, and what is due soon.

So this should be a **"what do I do today"** page. Right now it is half that and half a **"how is my business"** report (money tiles, payment table). The two jobs fight each other.

### 2. What is on the page today
- **Top bar:** "Today  Thursday, 22 October". Then a big heading again: "Today" and "Here's what's happening with your clients." (the page name appears twice, plus a filler sentence).
- **Left sidebar:** studio name "Meera Iyer Studio / Meera Iyer"; "Search ⌘K"; "Today" with a red badge "7"; "Clients"; "Calendar"; "Payments"; a "Projects" label with 10 coloured client names (Bloom Studio, Acme Logistics, Northwind Cafe, Tidal Health, Orbit Labs, Greenleaf Foods, Lumen Realty, Kite Fitness, Saffron Hotels, Studio Nine), 6 of them with a red dot; "New project"; "Settings".
- **Row of 4 stat cards:**
  - "Needs you / 7 / clients"
  - "Waiting / 1 / on clients"
  - "Awaiting payment / ₹35,000 / Approved, not yet paid"
  - "Expected / ₹7,42,000 / Next 30 days"
- **Left panel "Needs your attention 7":** rows with an initials avatar, client name, project name, a coloured pill, and a round icon button.
  - "Saffron Hotels, Logo refresh: Advance 5 days late" (bell)
  - "Northwind Cafe, Menu and packaging: Payment 4 days late" (bell)
  - "Kite Fitness, Landing page: Delivery 1 day late" (upload arrow)
  - "Studio Nine, Illustration set: Isha reported a problem" (speech bubble)
  - "Bloom Studio, Website redesign: Approval 1 day late" (bell)
  - (2 more hidden below the fade)
- **Right panel "Payment status" + "View all" button:** two grey tiles ("₹35,000 Awaiting payment", "₹7,42,000 Expected, 30 days") then 4 rows: "Studio Nine, Style frames, ₹52,000, On hold"; "Bloom Studio, Homepage design, ₹60,000, In review"; "Kite Fitness, Landing page, ₹42,000, In progress"; "Acme Logistics, UI kit, ₹70,000, In progress".
- **Bottom, two collapsed folds:** "Waiting on clients 1" and "Coming up 6". Opening Waiting shows "Lumen Realty, Brochure, [Link not opened yet] Not opened yet, ₹38,000, arrow button". Coming up lists up to 6 dates.
- **Hidden:** the List/Board toggle and tabs (see note above). Cmd+K search.
- **Count of competing things above the fold:** 4 cards + 2 panels (9 rows) + 2 grey tiles + 2 folds + sidebar of 10 projects = about 12 separate blocks. That is a lot for a page whose job is "what do I do first".

### 3. What is going wrong
1. **Same numbers shown 2 to 3 times (Big).** The Today badge "7", the card "7 clients" and the panel counter "7" are all the same fact. "₹35,000 Awaiting payment" and "₹7,42,000 Expected" appear in the stat cards AND again as two grey tiles in Payment status. The user's own complaint was "it just shows the same details again and again". It happens here too.
2. **The page has no single "do this first".** (Big) Five rows look equally important. The page does sort by urgency (red first), but the visual weight is the same for "Isha reported a problem" (a client is upset) and "Advance 5 days late". A beginner scans and does not know where to start.
3. **"Payment status" is not about payments. (Big)** The rows show "On hold", "In review", "In progress". These are stage states, not payment states. A beginner reads "Payment status: In progress" and thinks the payment is in progress. This is the "In process / Awaiting payment" confusion from the user test, appearing again. The amount next to it is the stage price, not what is owed.
4. **The money tiles use words that mean two things. (Big)** "Awaiting payment ₹35,000, Approved, not yet paid" means: the client approved the work and now owes you. But "Awaiting payment" is also the column name for a stage in the hidden Board. And a blue padlock icon on the card suggests "locked" or "secure", not "money owed to me". "Expected ₹7,42,000, Next 30 days" is the sum of every unfinished stage due in 30 days, which is a forecast, not an expectation that money arrives. It sounds like a promise.
5. **Card counts use different units. (Medium)** "Needs you: 7 clients" counts clients, but the code counts items (one per project, so usually the same, but not always). "Waiting: 1 on clients" reads like broken grammar. "Waiting" and "Needs you" overlap: "Advance 5 days late" is really "I am waiting on the client", yet it sits under "Needs you". A beginner cannot tell which column a thing belongs in.
6. **Pills do not say who is late. (Big)** "Advance 5 days late" (client late), "Delivery 1 day late" (you are late), "Approval 1 day late" (client late), "Payment 4 days late" (client late). All look the same amber. "Delivery 1 day late" means the freelancer missed a promise. That is the most serious one for her reputation, but looks the same as a late advance.
7. **Icon-only buttons hide what will happen. (Big)** The round buttons are a bell, an upload arrow, a speech bubble. The name is only in a hover tooltip ("Remind Isha", "Upload", "Reply to Isha"). On a phone there is no hover. A beginner does not know if the bell sends a message instantly or opens a draft. (Code: it opens a reminder composer first, which is safe, but nothing says so.) Also, the row itself is clickable (opens the project) AND the button does something else. Two click targets in one row with no visual difference.
8. **Hidden rows with no clue. (Medium)** Panel header says 7, 5 rows show, the bottom is faded and it scrolls inside. A scroll area inside a scrolling page is easy to miss, and the mouse wheel gets stuck in it.
9. **The List/Board toggle and tabs are built but unreachable. (Medium, for the build)** And on the design side: even if shown, Board duplicates the Projects list in the sidebar, the Clients page, and this dashboard. Four ways to see the same 10 clients.
10. **Waiting row repeats itself. (Small)** "Link not opened yet" in a pill AND "Not opened yet" below it, in the same row. Also the button here is an arrow (open project), but in the panel above the same kind of row has a bell (remind). Same kind of row, different button.
11. **Two collapsed sections hold the calm-down info. (Medium)** "Waiting on clients" is actually the answer to the second job ("who am I waiting on?"), and it is the thing the user test said should be obvious. It is hidden behind a chevron with a tiny grey "1". Meanwhile "Coming up" hides what is probably the next-most-useful thing (what is due this week).
12. **Sidebar mixes two kinds of things. (Medium)** Under "Projects" it lists client names, not projects ("Bloom Studio", not "Website redesign"). It duplicates the Clients page. 10 items with a red dot on 6 of them, so the dot stops meaning anything when most things have it. And "Today 7" badge plus 6 red dots plus the panel all say "needs you" in three different ways.
13. **Page name appears twice and a filler line adds nothing. (Small)** Top bar "Today Thursday, 22 October" and then "Today" as a heading, then "Here's what's happening with your clients."
14. **Cmd+K is the only fast way to search, and it is not discoverable on a phone or on Windows. (Small/Medium)** The "⌘K" label is Mac only. Pressing "/" also opens it, with no hint. The screenshot shows it fading in. Rows say "Go to" and "Create" in grey on the right, which tell little. Project rows show the project name plus the status pill text ("Website redesign · Approval 1 day late"), which is useful. But there is no "recent" or empty-state suggestion when the box is empty: it just dumps all 10 clients first and the pages after, so "Payments" is below the fold of the list.
15. **Phone version breaks. (Big)** On `m01-today.png`:
   - The attention rows show only initials ("SH", "NC") with no client name, because the name column is hidden.
   - The amount is cut off ("₹ ... 0") and the round button overlaps it.
   - Only about 3 rows are visible inside a short scroll box. The fourth is sliced in half.
   - The stat cards are different heights and the last one ("₹7,42,000") pokes past the card edge.
   - The page is long: 4 cards, then the attention list, then the payment panel, before the first fold. The user has to scroll past money to reach "Waiting on clients".
16. **Right side leaking from the client view? (Small)** No client-facing words appear here. Good. The only "PayGuard" appearance is the logo/shield. Fine for the freelancer side.

What already works and should be kept:
- The attention list is sorted by urgency and has a clear "what": "Advance 5 days late".
- Plain "late" language. The red/amber severity idea is good.
- "You're all caught up" empty state with the buddy illustration.
- Rows are whole-row clickable and lead to the project.
- Cmd+K is fast and searches by client, project and person name.
- Count badge on Today in the sidebar.

### 4. What the page should look like (information architecture)
**Rule:** Today answers "what do I do?" and "who am I waiting on?" Money reporting lives on Payments. Today shows just one line of money.

Top to bottom:
1. **Header: page name once, with the date.** "Today, Thursday 22 October". Remove the second "Today" heading and the filler sentence. (One name per page.)
2. **A one-line summary that replaces the 4 cards.** e.g. "7 things need you. 1 client has not replied. ₹35,000 is owed to you." Each part is a link that jumps to that section. This is 1 line instead of 4 big cards. (Keep the idea, shrink the size. Merge the card and the panel counters.)
3. **"Do these first" list.** The main thing. Show 3 rows by default and "Show 4 more" instead of a hidden scroll. Each row: client, project, one plain sentence of what is wrong and **who owes what** ("Saffron Hotels has not paid the ₹20,000 advance. 5 days late."), then a **text button** that says what happens ("Remind", "Upload preview", "Reply"). The button has text, not just an icon.
4. **"Waiting on clients" as an open list (not folded)**, right under. Same row style, softer colour. The user test said waiting is a first-class state. Show them open when there are 1 to 5 items.
5. **"Coming up this week" (next 7 days, max 5 rows)** as a small list. Open by default when it has items. Link "See calendar".
6. **Money: one small card, or a single line**: "Owed to you now: ₹35,000" with a link to Payments. Remove the 4-row "Payment status" table and its two tiles from Today (the Payments page already does this job; that reviewer owns it).

**Keep:** attention list, severity order, empty state, whole-row click, Cmd+K, count badge.
**Move:** money tiles and the payment table to Payments. Board to the Clients page (as its alternate view), or drop it.
**Remove:** the 4 stat cards, the duplicate "Today" heading and tagline, the "Payment status" panel, the internal scroll box, the hidden List/Board toggle code from Today.
**Merge:** the "Needs you" card + panel counter + sidebar badge into one number shown in two places (the badge and the list header). "Waiting" card + fold into one visible section.

Text sketch (desktop):
```
Today · Thursday 22 October

 7 need you · 1 waiting on a client · ₹35,000 owed to you

 DO THESE FIRST                                        (3 of 7)
 [SH] Saffron Hotels · Logo refresh
      Client has not paid the advance. 5 days late.        [Remind]
 [SN] Studio Nine · Illustration set
      Isha reported a problem. Reply by 24 Oct.            [Reply]
 [KF] Kite Fitness · Landing page
      You are late: preview was due yesterday.             [Upload preview]
                                           Show 4 more

 WAITING ON CLIENTS (1)
 [LR] Lumen Realty · Brochure · link not opened yet · ₹38,000   [Resend link]

 COMING UP THIS WEEK                         See calendar
 24 Oct  Kite Fitness · preview due
 ...
```
**Visible by default:** the summary line, 3 rows to do, waiting list, a week of events.
**Behind a click:** the other 4 to-do rows, full calendar, all money (go to Payments), Cmd+K.

Phone: same order, one column. Row = name on line 1, plain sentence on line 2, full-width text button on line 3. No cards before the list. Bottom nav stays.

Sidebar (touches every screen, mention to the owner): rename the section "Clients" or "Projects" to match what is shown. Pick one: show project names (since you are clicking into a project) or move the list into the Clients page. Show the red dot only for "needs you now", not for every late thing.

### 5. Copy fixes
| Where | Now | Better | Why |
|---|---|---|---|
| Page heading | "Today" (twice) + "Here's what's happening with your clients." | "Today, Thursday 22 October" (once) | Say it once; the sentence adds nothing |
| Card | "Needs you / 7 / clients" | "7 things need you" | Count things, not clients; plain sentence |
| Card | "Waiting / 1 / on clients" | "Waiting on 1 client" | Fixes the broken grammar |
| Card | "Awaiting payment ₹35,000 Approved, not yet paid" | "Owed to you now: ₹35,000" with small text "Work approved, client has not paid yet" | "Owed to you" says who owes whom; "Awaiting payment" confuses |
| Card | "Expected ₹7,42,000 Next 30 days" | "Due to be earned in 30 days" or remove from Today | It is a forecast, not money that is coming |
| Panel title | "Needs your attention" | "Do these first" | Action word, not a feeling |
| Panel title | "Payment status" | Remove from Today. On Payments call it "Stages and money" or "Who owes you" | Rows show stage state, not payment state |
| Pill | "Advance 5 days late" | "Client has not paid advance (5 days late)" | Says who is late and what |
| Pill | "Payment 4 days late" | "Client has not paid balance (4 days late)" | Same. "Balance" is what the client pays to unlock originals |
| Pill | "Delivery 1 day late" | "You are late: preview due yesterday" | The freelancer's own miss needs to look different |
| Pill | "Approval 1 day late" | "Client has not approved (1 day late)" | Says who has to act |
| Pill | "Isha reported a problem" | "Isha reported a problem. Reply by 24 Oct" | The deadline is in code but not shown in the list |
| Button (bell) | icon only | "Remind" | Text says what the click does |
| Button (upload arrow) | icon only | "Upload preview" | Same |
| Button (speech bubble) | icon only | "Reply" | Same |
| Waiting row | "Link not opened yet" + "Not opened yet" | "Link not opened yet. Sent 3 days ago." | Do not say it twice |
| Waiting row button | arrow | "Resend link" | Same job as the bell above, same label |
| Fold | "Waiting on clients 1" (closed) | "Waiting on clients (1)" open by default | First-class state from the user test |
| Fold | "Coming up 6" | "Coming up this week" | Time frame stated |
| Pill (Payment list) | "In progress" / "In review" / "On hold" | Keep on Payments only. "On hold" becomes "Problem reported" | "On hold" sounds like money is held |
| Sidebar group | "Projects" (lists clients) | "Clients" or show project names | Label must match what is listed |
| Search | "Search ⌘K" | "Search" with hint "Ctrl K" on Windows | Mac-only hint |
| Cmd+K row hint | "Go to" / "Create" | "Page" / "New" | Shorter, plainer |
| Cmd+K placeholder | "Search clients and pages" | "Search clients, projects or pages" | Projects are searched too |

### 6. Questions for the owner
1. **Should Today show any money at all?** I would pick: one line ("₹35,000 owed to you"), full details on Payments. Reason: Today is for acting; Payments is for money.
2. **Do you want the Board view at all?** I would pick: remove it from Today and keep it as an optional view on Clients only if testers ask. Reason: it is already unreachable and duplicates three other lists.
3. **Should "late" things that depend on the client sit under "Needs you" or "Waiting"?** I would pick: put a thing under "Do these first" only if the freelancer can do something *useful* now (reminding counts if it is overdue by 3 days or more, which the code already does). Everything else is Waiting. Reason: keeps both lists honest.
4. **Show 3 or 5 rows by default?** I would pick 3, because the page job is "one thing first".
5. **Sidebar: client names or project names?** I would pick project names with the client's colour dot, because the click goes to a project.

### 7. Related screens
- **Before:** first-run / onboarding ("Send your first project link", or "Try it with sample clients"). When the freelancer has no projects, Today is the empty state. That works; keep it.
- **Click a row, go to:** the Project page for that client. The user expects to land on the *thing that is late*, not on the overview. Today the row opens the project overview (`openp`). Better: open the page already focused on the right stage (the one named in the pill).
- **Bell, go to:** a reminder composer (modal). Fine, but name it.
- **"View all" / money, go to:** Payments. Make sure its first number matches "owed to you" here.
- **Coming up, go to:** Calendar. It should open on the same week.
- **Sidebar:** appears on every freelancer screen; changes here affect all of them.
- **Phone:** the same page, bottom tab bar with Today, Clients, Calendar, Payments, Settings.

---

## Top 5 things to fix on these screens
1. **Turn Today into one job: "do these first".** Replace the 4 stat cards and the Payment status panel with a one-line summary, move money details to Payments, and stop showing the same numbers 2 to 3 times.
2. **Make every pill say who must act and every icon button say what it does** ("Client has not paid advance", "You are late"; "Remind", "Upload preview", "Reply" as text buttons).
3. **Open "Waiting on clients" by default and put it right under the to-do list.** Replace the hidden scrolling box (5 of 7 rows) with "Show 4 more".
4. **Fix the phone layout.** Client names are missing, amounts are clipped under the buttons, and the first screen is all cards. Use a stacked row with a full-width text button, and no cards before the list.
5. **Remove or relabel the confusing money words and the dead List/Board toggle.** "Payment status" shows stage states; "Awaiting payment" and "Expected" mean different things to different people. The toggle never appears in the page at all.
