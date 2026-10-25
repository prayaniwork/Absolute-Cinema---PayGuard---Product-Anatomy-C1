# PayGuard: whole-product map and structure audit

Scope: the big picture, not one screen. "Information architecture" (IA) means: what things exist in the product, where each one lives, and how a person moves between them. Based on `prototype/nazar/app.js` (functions `screen()`, `shell()`, `sToday`, `sClients`, `sPayments`, `sCalendar`, `sSettings`, `sPlan`, `sContractF`, `sProject`, `cInvite`, `cContract`, `cCheckout`, `cProject`, `modalHTML`, `protoBar`) and all screenshots in `design/ia-audit/shots/`.

---

## 1. Map of every screen and how you get there

### 1a. Freelancer (Meera)

```
Landing page  --(Get started)-->  Setup (name, brand colour, UPI, agree)
                                        |
                                        v
  +--------------------- LEFT SIDEBAR (always visible) ----------------------+
  | Studio name (click = Today)                                              |
  | Search (Cmd+K popup)                                                     |
  | Today | Clients | Calendar | Payments                                    |
  | "Projects" list (one dot per CLIENT name, red dot = needs you)           |
  | New project | Settings                                                   |
  +--------------------------------------------------------------------------+
     |        |          |          |             |
   Today   Clients    Calendar   Payments      Settings
     |        |                      |
     |        +--(click a row)-------+--(click a row)--> PROJECT PAGE
     +--(click a row / bell / upload)--------------------^
                                                         |
 PROJECT PAGE  tabs: Stages | Files | Contract | Activity
   + "Details" side panel (Next up, Money, Contract, Terms, Contact)
   + header buttons: Details | View as <client> | Client link
   + popups: Client link, Remind, Receipt/Invoice/Contract, Edit client,
             Reply to problem, Refund, Unlock anyway, "Preview as client"

 NEW PROJECT (from sidebar, Today empty state, Cmd+K)
   Plan page (tabs: Project | Stages | Terms, summary side panel)
     --(Review the contract)--> Contract step ("Step 2 of 2": letterhead,
                                  contract text, signature pad)
     --(Sign and send)--> back to project page + "Project created" popup with the client link
```

Ways to reach a project: sidebar project list, Clients row, Today row (list, board, payment-status rows, coming-up rows), Payments row, Cmd+K, the "Client link" popup. That is 6+ doors into one page, and each lands on the same Stages tab no matter why you came (a late payment, a signature, an upload).

### 1b. Client (Priya, Dev, ...), opens a link, no account

```
Link opens
  |-- contract NOT signed by client --> "Invite" page (stages list + "How it works" + side panel)
  |         --(Review and sign the contract)--> Contract page (sign)
  |         --(Sign and continue)--> Project page
  |-- contract signed --> PROJECT PAGE (client)
        tabs: Current stage (called "Review" when a preview waits) | All stages | Contract
        right panel: "Please reply by" + Approve / Ask for changes (only while in review),
                     then studio card, Project (total, stages, advance, unlock), Terms, Next up
        pays --> Checkout page (advance, or balance for a stage / whole project)
        popups: Approve?, What would you like changed?, Report a problem,
                Add a change round, "Approved" (Pay now / Pay later), "Unlocked",
                Documents (Receipt / Invoice / Contract)
  |-- no project --> "Nothing shared with you yet" (shows the PayGuard logo, see problem 9)
```

### 1c. The prototype-only bar
Bottom of every screen: `View as [Meera] [Client] | Account [First day] [Active] [Restart]`. This is a demo tool, not product. It is also mirrored inside the product by "View as Priya" in the project header and an eye icon in the Details panel, so the "switch sides" idea exists twice, one of them real (the freelancer previewing what the client sees).

---

## 2. The objects in the product and how they relate

### What the owner and the meeting asked for

```
Client
  └── Project (one or many)
        ├── Contract (+ who signed)
        ├── Stages 1..n  (each: price, date, what is included, files, approval, payment/unlock)
        ├── Payments (advance + one per stage, or one at the end)
        └── Documents (contract, receipt, invoice)
Reminder = a small action on a stage, not a thing with its own place.
```

### What the code actually has

```
Project  (the only real top-level object)
  ├── client { name, org, email, phone, colour, logo }   <-- the client is just a few fields INSIDE each project
  ├── contract { freelancer signature, client signature }
  ├── terms (reply days, auto-approve, rounds, extra fee, advance %, pay days, unlock mode)
  └── ms[]  = stages
        ├── files[] + links[]        (live inside a stage: good)
        ├── status (draft / funded / submitted / changes / approved / released / dispute / refunded)
        ├── approval  (just the status + dates; no separate object)
        ├── payment   (just the status + amount; no separate object)
        └── history / notes / dispute
Settings: studio, payout, tax, defaults, contract template, notifications
Reminder: two date fields on the project (remindedAt, openedAt)
```

### Do the screens reflect the hierarchy? No, in five ways

| Wanted | Reality | Effect |
|---|---|---|
| Client is a thing with its own page | No client page. "Clients" is a table of projects grouped by email. Clicking a row opens only the first project; extra projects show as "+ 1 more" with no way to open them from that row | Client with 2 projects is awkward. The Clients page is really a Projects page |
| Sidebar "Projects" | Sidebar section is titled "Projects" but lists **client names** | Two names for one thing. Same client with 2 projects shows twice |
| Stage is the unit of work | Stage is shown in 4 different shapes on one page (hero card, file list, Approvals table, side-panel "Next up") | Feels like four different things |
| Payments sit under each project | Payments live in a top-level table AND in side panel "Money" AND the hero. No payment section on the project page itself | Where do I see what this client owes? Answer: three places, none complete |
| Documents sit under each project | Contract has a tab; receipt/invoice only via "Documents" button in a popup (from Payments or an unlocked stage). "Files" tab is a different thing (work files) | "Files" vs "Documents" vs "Contract" are three words for paper |
| Approval is a step | "Approvals" is a table that is really a second stage list | Stage list appears as the hero, then again as Approvals |

---

## 3. Where each key piece of information appears (and how many times)

Example project: Bloom Studio, stage 2 in review.

| Information | Where it appears today | Count |
|---|---|---|
| **Amount due / what the client owes** | Today stat cards ("Awaiting payment"), Today row amount, Today "Payment status" panel, Clients "Value" column, Payments table + 3 stat cards, project strip "You get ₹1,60,000", side panel "Project value", hero text ("pay ₹35,000"), client side "Total", client approve text, client checkout, contract table, receipt | 12+ |
| **Due date of a stage** | Today row context, Today "Coming up", Clients "Next up", Payments row, Calendar, project strip "Next: ...", "Stage 2 of 4 ... Due Wed 21 Oct" line, hero text, Approvals row, side panel "Next up", client "Please reply by", client All stages, contract | 12 |
| **Reply-by / auto-approve date** | Hero text, side panel, client "Please reply by", client "How it works", contract section 3, Terms side panel | 6 |
| **Who signed** | Project Contract tab pills ("Meera signed", "Priya signed"), side panel Contract section, Today row "Waiting for signature", stage 1 pill, contract signature boxes, client invite status "Awaiting signature" | 6 |
| **Advance** | Plan > Terms, Settings defaults, contract section 2, side panel Money ("Advance None"), hero text, Today "Waiting for advance", client invite "How it works", client side panel, client checkout, Payments "Paid to you ... includes advances" | 10 |
| **What is included** | Plan (stage fields), "What's included" box in hero (collapsed "3 items"), client decide panel, client All stages, approve popup, contract, checkout "The plan" | 7 |
| **Status of a stage** | Same status shown as a badge in hero, a pill in Approvals, a text in "Stage 2 of 4 · in review", a coloured word in Payments, a column in Clients, Today pills, Today board columns. Words differ: "Awaiting payment" / "Approved, not yet paid" / "In process", "Paid to you" / "Unlocked" / "Paid" | 7 places, ~12 wordings |
| **Originals unlock rule** | Plan Terms, contract s.4, side panel Money, client side Project, client How it works, client checkout | 6 |
| **Terms (rounds, extra fee, reply days)** | Plan Terms, Settings defaults, side panel Terms, client side Terms, client How it works, contract s.3 | 6 |
| **Client contact** | Plan, edit popup, side panel Contact, header strip, remind popup | 5 |
| **Files** | Hero list, "Files & links" card, Files tab, Approvals detail, client preview, client "Your files" | 6 (the same 3 files listed twice on the same screen, see f15) |
| **Reminders sent / link opened** | Hero ("Auto-reminded today · Link opened 29 days ago"), Today row trace, remind popup | 3 |

Key takeaway: the same facts are repeated on every page and in the right panel. This is exactly what testers said: "it just shows the same details again and again."

---

## 4. Navigation problems

**Left sidebar**
- Three different lists share it: pages (Today, Clients, Calendar, Payments), a project list that is really a client list (10 names), and actions (New project, Settings). The long list pushes New project and Settings to the bottom edge.
- "New project" appears in the sidebar, in the top-right of Clients/Today header, and in Cmd+K. During planning the sidebar item turns into the draft's name, while the page breadcrumb says "Clients > New project". Nothing in the sidebar is highlighted as "Clients" then.
- Sidebar red dots (needs you) duplicate the red count on Today and the "Needs you" filter on Clients.
- Today vs Clients vs Payments vs Calendar all answer "what's going on with my clients" in slightly different cuts. Today has a List view and a Board view, plus a "Payment status" panel that duplicates Payments.

**Project tabs** (Stages / Files / Contract / Activity)
- The Stages tab is overloaded: hero + Files & links + Approvals. Files tab duplicates "Files & links". Files should live inside the stage (as the meeting said) so a Files tab is not needed.
- Contract is both a tab and a section in the Details panel.
- Tab named "Stages" shows one big current-stage card, so it is not a stepper; you cannot see the path at a glance except in the Approvals table far down.
- Client side has different tab names for the same idea: "Current stage / Review / All stages / Contract".

**Side panel ("Details")**
- Open or closed by default? Hidden by default on freelancer (button "Details"), always open on client. It carries five collapsed sections, so important facts (money, signatures) are hidden by default while less important ones are shown above them.
- It repeats information in the main column.
- On the client side the panel holds the **main action** (Approve / Ask for changes) above the fold of studio info, but on a phone it drops below the preview.

**Popups**
- About 18 popup types. Some are real decisions (Approve, Report a problem), but several are navigation in disguise: Documents (Receipt/Invoice/Contract tabs), Contract view, "Client link", "Preview as client". Popups inside popups are not used (good), but the Contract is reachable as a tab, as a popup, as a client page and in the plan step.
- Celebration popups ("Approved", "Unlocked", "Advance paid") make the user click Continue before they can see the new state.

**"View as" demo bar**
- Floats over the bottom of every page and covers content (see f15, f25). Labels change with context ("Meera / Client", "Meera / Priya", "Meera / Dev"), and it contains test controls (First day / Active / Restart) that a user will think are product features. In user tests, this bar competes with the real "View as Priya" button.
- It must be visually separate from the product, or moved out of the page.

**Other**
- Two different "Step X of 2": Setup ("Step 1 of 2") and the contract step ("Step 2 of 2"). They belong to different journeys.
- Plan page has 3 tabs but is one long scrolling form (tabs scroll-spy to sections), so tabs act as an outline, not as steps.
- Cmd+K search exists on freelancer only.

---

## 5. Proposed target structure

### 5a. Freelancer navigation (sidebar)

```
[Studio name]
Home            (what needs me now, one list)
Clients         (list of clients > open a client > their projects)
Calendar        (all dates; one view)
Payments        (money across all projects)
----
Settings
[+ New project]   (one button, top of the page header, not in the sidebar list)
```
Remove the "Projects" list of client names from the sidebar. It duplicates Clients and gets long with 10+ clients. Keep Cmd+K for jumping.

### 5b. What each top-level page is for

| Page | One job | Shows | Does not show |
|---|---|---|---|
| Home (rename of Today) | "What do I do next?" | One list of things needing me, grouped: Needs you / Waiting on clients. Items open the right place inside the project | Stat cards, payment panel, board view (move to Payments / drop) |
| Clients | "Find a client or project" | Client rows with their project count; open a client to see its projects | Stage-level detail |
| Calendar | "What is due when" | Dates only. Colour by client optional (single colour toggle, owner to decide) | Actions |
| Payments | "Who owes me, what have I received" | Three groups: To collect, Received, Upcoming. Row opens that stage inside the project | Stage workflow states like "In review" |
| Settings | My studio, how I get paid, defaults, contract template | Same as now | |

### 5c. Client page (new, small)
```
Client: Bloom Studio  (Priya Nair, email, WhatsApp)   [Edit]
  Projects:
   - Website redesign   Stage 2 of 4   ₹1,60,000   Needs you
   - Brand refresh      Waiting for signature
```

### 5d. Project page, top to bottom

```
Breadcrumb: Clients > Bloom Studio > Website redesign        [Client link] [Preview as Priya]
------------------------------------------------------------------------------------------
1. NEXT STEP BANNER   one sentence + one button
   e.g. "Waiting for Priya to sign the contract.  [Remind Priya]"
   (signature is step 0, first-class, not a pill on stage 1)
2. STEPPER            Contract signed > Advance > Stage 1 > Stage 2 > Stage 3 > Done
   (small numbered path; current step highlighted; each step shows state + date)
3. CURRENT STAGE (expanded)  - what is included, files and links, upload / preview,
                               reply-by date, amount, approve/pay/unlock state
   Other stages: collapsed rows (name, amount, date, state). Click to expand.
4. MONEY (one block)   Total, advance paid/due, paid so far, still to pay, pay-by dates
5. PAPERWORK (one block)  Contract (who signed, download), receipts, invoices
6. ACTIVITY (collapsed, at the bottom)  history of reminders, approvals, payments
------------------------------------------------------------------------------------------
Terms (rounds, reply days, extra fee) live inside the Contract block, not a side panel.
Contact details live on the Client page, linked from the breadcrumb.
No side panel by default. No Files tab. No Approvals table.
```
Tabs become: **Overview** (items 1 to 4) and **Paperwork and history** (5 and 6). Two tabs at most, or none (one scroll).

### 5e. What the client sees (no PayGuard name, no account)

```
[Studio name]                                              Priya Nair
------------------------------------------------------------------------
1. NEXT STEP  "Review Homepage design.  Reply by Wed 21 Oct."   [Approve] [Ask for changes]
              (or: "Sign the contract", "Pay ₹15,000 advance", "Pay ₹60,000 to unlock")
2. STEPPER    same path as the freelancer sees
3. CURRENT STAGE  preview (watermarked), what is included, note from freelancer
4. Other stages (collapsed)
5. Paperwork: Contract, receipts (after payment)
------------------------------------------------------------------------
Side panel removed; the few facts the client needs (total, advance, pay-by) go in the Money line.
```
Order of the client journey stays: invite > sign > (advance) > review > approve > pay > unlocked.

---

## 6. The 10 biggest structural problems, ranked

1. **There is no Client object.** The client is a handful of fields copied into each project. "Clients" is really a projects table, the sidebar "Projects" list is client names, and a client with two projects is half-hidden. The meeting asked for client > projects > stages.
2. **The project page shows one stage three or four times** (hero card, Files & links, Approvals table, side panel "Next up", plus a status line). Same facts, repeated, in a long scroll. This is the "same details again and again" complaint.
3. **No stepper, and signature/advance are not steps.** The path (sign > advance > stage 1... > unlock) is never drawn. "Waiting for signature" is a small pill inside stage 1 and the hero text. The client's equivalent is split across Invite, Contract, Checkout.
4. **Key facts are repeated everywhere** (amount 12+ times, due date 12, advance 10; see table 3). When a fact lives in many places, people cannot tell which one is the truth and the screens get long.
5. **Payments and documents have no home under the project.** Money is scattered (side panel, hero, top-level page); receipts hide behind a "Documents" popup; "Files", "Documents" and "Contract" are three separate paper concepts.
6. **The Details side panel is a second page of duplicate info**, collapsed by default on the freelancer side, so important things (money, who signed) are hidden while repeats are shown. It also takes the primary action on the client side.
7. **Too many doors and no "why you came here".** Six ways into a project, all land on the same Stages tab. Today, Clients, Payments, the board and the sidebar list overlap: five views of "what is happening with my clients".
8. **Status words differ per screen and per person** ("Awaiting payment", "Approved, not yet paid", "In progress", "Paid to you", "Unlocked", "On hold", "Waiting"). The state model has 8 stage states but screens invent extra labels. This feeds the money-word confusion heard in the test.
9. **Product-rule leaks to the client.** Watermark text says "PAYGUARD" (f/c05), client "How it works" and checkout say "PayGuard never holds it", the no-project screen shows the PayGuard logo/topbar, the Activity log shows a "PayGuard" avatar. Per the rules the client should see the studio name. Also: freelancer-only words reach the client side panel and vice versa; "Stage 3 of 3 · approved" is shown on a stage that is already unlocked.
10. **The demo bar and navigation clutter muddy the real product.** "View as / Account / Restart" floats over content, and a real "View as Priya" button sits in the header. Popups act as navigation (Contract, Documents), celebration popups block the next state, and the planning flow has two unrelated "Step x of 2" labels and a sidebar that renames "New project" to the draft's name.

---

## Questions for the owner
- **Client page or not?** I would add a small Client page (contact + projects), because the meeting asked for client > projects > stages and clients with several projects are real. Cheaper alternative: keep Clients as a table but let a row expand to its projects.
- **Rename "Today" to "Home"?** I would keep "Today" if it stays a to-do list. Rename to Home only if you keep dashboard-style cards. I would drop the cards and the Board view.
- **Calendar colour coding:** unresolved in the test. I would default to one colour, with a "colour by client" toggle, since 10 colours become noise.
- **Side panel:** I would remove it from the project page (move facts into the Money and Paperwork blocks) and from the client page. If you keep it, keep it for contact and terms only.
