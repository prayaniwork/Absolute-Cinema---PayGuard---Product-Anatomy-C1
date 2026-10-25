# PayGuard: the information architecture audit (plain-language edition)

**What this is.** After your user test, fifteen reviewers went through every screen of the current prototype (46 screenshots plus the code). Each wrote a full report. This page pulls them together so you can see the whole picture in one sitting. Nothing has been built or changed. This is planning only.

**New words, explained once.**
- **Information architecture (IA)**: what things exist in the product, where each one lives, and how a person moves between them. Like the floor plan of a house: which rooms, what is in each room, which doors connect them.
- **Job of a page**: the one thing a person came to that page to do. If a page has no clear job, people feel lost.
- **Stepper**: a small row of numbered steps (Sign, Advance, Stage 1, Stage 2, Done) that shows where you are in a path.

**Where the detail is.** `design/ia-audit/reports/` has one report per screen group, each with: the job of the page, what is on it today, what is going wrong, the structure it should have, copy fixes, and questions. The screenshots the reviewers used are in `design/ia-audit/shots/`.

---

## 1. The diagnosis in six sentences

1. PayGuard's real structure is **Client, then Projects, then Stages**, but the screens do not show that. There is no Client page, and the "Clients" list is really a list of projects.
2. One project page shows the **same stage three or four times** (big card, Files card, Approvals table, side panel), so it feels long and repetitive.
3. **The path is never drawn.** Sign the contract, pay the advance, do stage 1, stage 2, finish: nobody can see this as a path. "Waiting for signature" is only a small grey pill inside stage 1.
4. **The same fact appears everywhere.** The amount shows up on 12+ screens, the due date on 12, the advance on 10. When a fact lives in many places, people cannot tell which one is true.
5. **The words change from page to page.** The same moment has up to four names, and some words mean "you owe" to one person and "they owe me" to the other.
6. **The client side leaks PayGuard** (the watermark says PAYGUARD, "PayGuard never holds it" appears in sentences), which breaks our own rule that the client sees the freelancer's studio.

Why this matches what you heard in testing: "too much information", "the same details again and again", "money words confusing", "optional and required mixed" are all symptoms of these six things.

---

## 2. The ten biggest structural problems (ranked)

| # | Problem | In plain words |
|---|---|---|
| 1 | No Client object | The client is a few fields copied into every project. A client with two projects shows as one row plus "+ 1 more". |
| 2 | One stage shown 3 to 4 times | Big card, "Files & links" card, "Approvals" table, "Next up" in the side panel: all the same stage. |
| 3 | No stepper | Signature and advance are not steps. They are a pill and a sentence. |
| 4 | Facts repeat on every page | Amount 12+ times, due date 12, advance 10, "what is included" 7. |
| 5 | Money and paperwork have no home inside a project | Money is split across the side panel, the hero card and the Payments page. Receipt, invoice, contract and "files" are four separate places. |
| 6 | The Details side panel is a second page of repeats | Hidden by default on the freelancer side, always open on the client side, and on the client side it holds the main buttons. |
| 7 | Too many doors, no reason for entry | Six ways to open a project, all landing on the same tab. Today, Clients, Payments, Board and the sidebar list overlap. |
| 8 | Status words differ per screen and per person | About 12 wordings for about 8 real states. |
| 9 | Rule leaks | "PAYGUARD" on the client's watermark, "PayGuard" in client sentences, the PayGuard logo on the empty client page, a "PayGuard" avatar in activity. |
| 10 | Demo tools and popups muddy the product | The "View as / Account / Restart" bar floats over real content. Popups act as navigation (Documents, Contract), and celebration popups make you click before you see the new state. |

---

## 3. Page by page: job, what is wrong, what it should be

Each block is a short version. Open the numbered report for the full detail.

### Landing, setup, settings (report 01)
- **Job:** a first-time freelancer decides "is this for me?" and gets set up in a couple of minutes.
- **Wrong:** Setup says "Step 1 of 2", but step 2 (the contract) only arrives after a whole project plan, so the promise is false. Only the UPI ID says "Required", the rest is unclear. "Sign in" does the same as "Get started". Settings is one 26-field scroll with no groups, and Contract and Tax come before Defaults.
- **Should be:** show the real path up front (studio, first project, contract). One rule for required and optional, with optional groups behind "+ Add" (bank details, tax, letterhead). Settings in groups with a left list. Lead the landing page with the real promise: preview, approve, pay directly, originals unlock.

### Today (report 02)
- **Job:** "What do I do first today?" in under 10 seconds.
- **Wrong:** It tries to be both a to-do list and a business dashboard, so numbers repeat (the same 7, the same ₹35,000). "Waiting on clients" is hidden in a closed fold, and the attention list shows 5 of 7 in a hidden inner scroll. The pills do not say whose fault a delay is. The round icon buttons have no words. The phone layout is broken (names missing, amounts clipped). The List/Board toggle is not drawn in List view, so Board cannot be reached at all.
- **Should be:** one clear list, "Do these first", then "Waiting on clients" open by default. Text buttons (Remind, Upload preview, Reply) instead of bare icons. Money cut to one line, with the detail on Payments. Drop the Board view.

### Clients, Payments, Calendar (report 03)
- **Job:** Clients = find a client or project. Payments = who owes me, what have I received. Calendar = what is due when.
- **Wrong:** Payments mixes work states ("In review", "On hold") with money states, and its three cards do not match its seven filters. A lock icon on a money card suggests PayGuard holds money. Clients says "Needs you" on 7 of 10 rows with no reason. The Client > Project > Stage tree exists in the code but is hidden. Calendar chips cut off names and use 10 colours.
- **Should be:** Payments with only money words (Owed, Late, Received, Coming up) and a visible Remind on late rows. Clients showing the reason, not just "Needs you". Calendar in one base colour, with colour only for meaning (late, reply due, finished), an optional "colour by client" switch, and payment dates added.

### Plan: creating a project (report 04)
- **Job:** get a project and its contract ready to send, with as few decisions as possible.
- **Wrong:** The "tabs" are really one long scrolling form of about 20 fields. Terms asks 8 decisions that are usually left as defaults. The brief banner and template buttons push the real stage form down. "Runs alongside the previous stage" is jargon and only silences a date error. The summary panel pops up late and is missing on phone. The UPI ID (required) is hidden at the bottom.
- **Should be:** a real 3-step flow (Project, Stages, Terms) with a Next button. Show only advance, the unlock choice and UPI on the Terms step, and fold the rest into one sentence-style block. Turn auto-approve off by default. Put the stage form first, with brief upload as a small secondary link. Keep a small always-visible total, advance and balance.

### The contract and signing (report 05)
- **Job:** both sides read what they are agreeing to and sign, knowing what happens next.
- **Wrong:** The signing page opens with an optional letterhead card that looks required and pushes the Sign button about 1500px down. Draw is the default signature. The client signs and is suddenly sent to pay the advance, which is only mentioned in section 2. "Waiting for the client to sign" is a small grey badge. The contract text says "PayGuard" and ends with a "not legal advice" line that the client sees.
- **Should be:** a "what you are agreeing to" summary on top, then the contract, then a signing popup with typing as the default. The button says what follows ("Sign and pay ₹15,000 advance"). Letterhead moves to Settings plus one small link.

### The project page, freelancer side (reports 06, 07, 08)
- **Job:** "Where is this project, and what is my next move?"
- **Wrong:** One stage shown 3 to 4 times. Text that is wrong or stale ("0 of 2 approved" while one is approved, "Files appear once the work starts" after the work is done, "You get ₹1,60,000" showing the total). "Mark as paid" and "Unlock anyway" do not say what they do. The same grey sentence for "waiting for the client to sign" and "waiting for the advance". "Next up" skips late items. The Activity tab misses the real history.
- **Should be:** next-step banner, stepper, current stage open (with its files inside it), other stages collapsed, then one Money block and one Paperwork block (contract, receipts), then Activity collapsed at the bottom. No Files tab, no Approvals table, no side panel by default.

### The popups (report 09)
- **Job:** a popup should be for a quick decision, not for navigating.
- **Wrong:** The "Client link" popup's main button is "View as Dev" and never says the client must sign first. Money wording in popups contradicts "PayGuard holds no money" ("Paying…", "sent to Meera", the Refund popup that mentions a fee, and the refund popup has no way to open it). Contract, Receipt and Invoice appear in three places. Decision popups do not say what happens next. Close buttons are inconsistent (Not yet, Cancel, Back, Close, Continue).
- **Should be:** send buttons first on the link popup, small "preview as client" link, no refund popup, one consistent pattern for the buttons, and each decision popup saying what happens next.

### The client side (reports 10, 11, 12, 13)
- **Job:** a small-business owner who opened a link must always know what to do next and be able to do it.
- **Wrong:** The invite's "How it works" is 7 mixed bullets. The money is never shown plainly. After signing, a second "I agree to the plan" checkbox blocks payment. The approve and ask-for-changes block lives in the side panel, away from the preview, and on a phone it comes after the whole preview. The first tab renames itself ("Current stage" becomes "Review"). The unlocked page puts three overlapping buttons above the files. The "problem reported" page shows the client's message twice and has an unclear "Withdraw". A client with several projects has no way to switch.
- **Should be:** the same stepper as the freelancer, a "Your next step" card at the top of the main column (a sticky bar on phones), money shown once as total, advance now, rest later. The unlocked page shows files first, then Download, Receipt and Contract. No side panel, no PayGuard branding.

---

## 4. The proposed structure (for your approval)

**Left sidebar (freelancer):** Home (today's Today), Clients, Calendar, Payments, Settings, and one **+ New project** button in the page header (not in the sidebar). Remove the long "Projects" list of client names from the sidebar and use Cmd+K to jump.

| Page | One job | Leaves out |
|---|---|---|
| Home | What do I do next? One list: Do these first, then Waiting on clients. | Stat cards, Payment panel, Board |
| Clients | Find a client or project. Open a client to see their projects. | Stage detail |
| Calendar | What is due when. | Actions |
| Payments | Who owes me, what have I received. | Work states like "In review" |
| Settings | My studio, how I get paid, defaults, contract template. | |

**Project page (top to bottom):**
```
Clients > Bloom Studio > Website redesign        [Client link] [Preview as Priya]
1. NEXT STEP banner   "Waiting for Priya to sign the contract.   [Remind Priya]"
2. STEPPER            Contract > Advance > Stage 1 > Stage 2 > Stage 3 > Done
3. CURRENT STAGE      what is included, its files, preview/upload, reply date, state
   other stages collapsed (name, amount, date, state)
4. MONEY              total, advance, received, remaining, pay-by dates
5. PAPERWORK          contract (who signed, download), receipt, invoice
6. ACTIVITY           collapsed
```

**Client page:** the same shape, minus the freelancer-only tools. Studio name at the top, a "Your next step" card, the same stepper, the current stage, other stages collapsed, then Paperwork. No side panel.

---

## 5. The words (report 14 in short)

**Two status lists, one for each person**, because the same label today means "I owe" to one side and "they owe me" to the other.

| Real moment | Freelancer sees | Client sees |
|---|---|---|
| Waiting on an earlier stage | Not started | Not started |
| Contract not signed | Waiting for signature | Sign the contract |
| Advance not paid | Waiting for advance | Pay advance |
| Freelancer working | In progress | In progress |
| Preview sent | Waiting for approval | Review preview |
| Client asked for changes | Changes requested | Changes sent |
| Approved, rest unpaid | Waiting for payment | Pay now |
| Paid, originals open | Unlocked | Unlocked |
| Problem reported | Problem reported | Problem reported |

**Project status = "whose turn is it?"** with four words everywhere: **Needs you / Waiting on client / Working / Finished.**

**Words to retire:** Funded, Held, Balance, Refund, Released, Submit, Deliver, Dispute, Awaiting (use "Waiting for"), Closed, Expected. Several imply PayGuard holds money, which is false. **Words to add:** Remaining (replaces "Balance"), Received (replaces "Paid to you"), Cancel stage (replaces "Refund"), Send (one word for sending a preview).

**Money cards that add up:** the current cards overlap (Awaiting payment and Expected both count approved stages). Replace with Remaining owed to you, Work in progress, Received.

---

## 6. Decisions I need from you

The reviewers sometimes disagreed. These are the real choices. My pick is first in each.

**Structure**
1. **Client page or expanding row?** (Reviewers split.) Pick: give clients a small page (contact plus their projects), because repeat clients are normal at 5 to 15 clients. Cheaper alternative: a row that expands to show projects.
2. **Side panel on the project page?** (Split.) Pick: remove it. Move Money and Paperwork into the page and put contact on the client page. Alternative: keep a closed "quick facts and contact" drawer.
3. **Keep a Files tab?** Pick: no. Files live inside the stage, as the meeting said.
4. **Tabs on the project page:** Pick: Overview and Paperwork & history, or none (one scroll). Which feels right?
5. **Client's contract: tab or small link?** Pick: a link in the project header, since it is read once. A tab is fine if you want people to look it up.
6. **Sidebar project list:** remove it (my pick), or keep it but as project names?
7. **Rename Today to Home?** Pick: keep "Today" if it stays a to-do list.
8. **Board view:** remove it. It is unreachable today and duplicates the other lists.

**Rules and behaviour**
9. **Advance as its own step** before Stage 1, rather than part of stage 1. Pick: yes.
10. **Auto-approve default:** pick: off by default (freelancers can turn it on), because silence turning into a payment request is the riskiest default.
11. **Refunds:** remove the word and the popup, replace with "Cancel stage". Pick: yes, unless PayGuard will ever hold money.
12. **Signature:** typed by default with "Draw instead" as a small link, in a popup. You said typing is better. Do you want Draw removed completely?
13. **Contract extras (letterhead, footer, own clauses):** only in Settings plus one small link on the signing page. OK?
14. **A second "I agree to the plan" checkbox at checkout:** remove it. The signed contract is the agreement.
15. **Preview watermark:** show the studio's name, not "PAYGUARD". Do you want any small "protected by PayGuard" line anywhere on the client side, or none?
16. **Calendar colour:** pick: one base colour, colour only for meaning (late, reply due, finished), plus an optional "colour by client" switch. The two people who disagreed should see it.
17. **Payment dates on the Calendar:** pick: yes.
18. **Receipts:** PayGuard never touches the money. Call it "Payment record, confirmed by Meera" rather than a PayGuard receipt?
19. **Messages on a problem report:** let the client add a message, or prefill WhatsApp or email like the reminders? Pick: a message box.
20. **AI helper (Improve/Shorten) in the changes note:** remove for now.

**Words**
21. Approve the two status lists and the four project statuses in section 5.
22. Replace "Paid to you" with "Received", and "Balance" with "Remaining".

---

## 7. Suggested order of work, once you approve

1. **Words first** (cheap, big effect): the glossary, both status lists, removing escrow language, and fixing the money cards.
2. **Client side leaks:** the watermark, the PayGuard mentions, the second checkbox, the "Your next step" card.
3. **Project page restructure:** next-step banner, stepper, one stage shown once, Money and Paperwork blocks, remove the Files tab and the Approvals table and the side panel.
4. **Today, Payments, Clients, Calendar clean-up.**
5. **Plan as three steps, the contract signing popup, and the Settings groups.**
6. **Client page (if approved) and the multi-project client view.**

**Still unresolved from before:** collaborators (a client's developer or copywriter), the link password, and data retention (the 60 to 90 day idea). The reviewers did not settle these and I did not decide them.

## 8. Limits of this audit
- It was done on screenshots and code, not on real people, so it is expert opinion, not new user evidence. Your test is the evidence; this explains what in the screens likely caused it.
- Some screenshots caught an animation half-way, so reviewers trusted the code for exact words.
- Reviewers each worked alone, so a few recommendations conflict (listed in the decisions above).
