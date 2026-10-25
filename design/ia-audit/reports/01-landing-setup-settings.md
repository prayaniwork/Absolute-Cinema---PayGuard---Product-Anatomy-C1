# IA audit 01: Landing page, first-time setup, Settings

Screens: Landing (`sLanding`), Setup (`sSetup`, `setupOk`), Settings (`sSettings`, `tplCard`).
Screenshots: `f01-landing.png`, `f02-setup.png`, `f09-settings.png`.

Quick background. "Information architecture" just means: what is on the page, in what order, and what is hidden behind a click. A good page answers "what is this, what do I do next?" in a few seconds.

---

# Screen 1: Landing page

## 1. The job of this page
**Who is here:** a freelance designer who just heard about PayGuard (or a tester who was sent a link). **In 10 seconds they must understand:** "This helps me stop chasing clients for approvals and payments, and I can try it now."

Smaller jobs, in order:
1. Let them start (Get started) or look first (See a busy day).
2. Show what the product looks like in real use.
3. Answer the two worries: "Do my clients need an account?" and "Does PayGuard hold my money?"

## 2. What is on the page today
- **Top bar:** logo, "How it works", "Why PayGuard", "Sign in", "Get started".
- **Hero:** small label "For freelance designers with 5 to 15 clients". Headline "Run your freelance business like a business." Sub-line "Clients, projects, approvals and payments in one place. No more chasing on WhatsApp." Two buttons: "Get started" and "See a busy day". Small line "Your clients don't need an account."
- **Product picture** (fake browser, "payguard.app/today"): "Awaiting payment ₹35,000", "Expected, next 30 days ₹7,57,000", tabs "Needs you 4 / Waiting / Coming up", four client rows with pills ("Approval 1 day late", "Payment 4 days late", "Delivery 1 day late", "Advance 5 days late") and buttons ("Remind Priya", "Upload"...). The last row fades out.
- **"Why PayGuard":** headline "Know who needs you. Skip the chasing." Three cards: "See every client at a glance", "Send one link, skip the follow-ups", "Get paid, straight to you".
- **"How it works":** "From plan to paid in four steps": Plan the project, Both sign a contract, You deliver, Client approves and pays.
- **Closing card:** "Start with your first client. Takes about 2 minutes." plus a third "Get started".
- **Footer:** "Prototype. All names and amounts are samples."
- Four different "Get started" buttons (nav, hero, closing, plus "Sign in" which does the same thing). One clear action, repeated sensibly.

## 3. What is going wrong
1. **"Sign in" and "Get started" do the same thing** (both go to setup, code: `data-a="start"`). A returning user clicks "Sign in" and is asked to set up a studio again. Medium. (In a prototype this is fine, but it will be tested, so make it honest: either remove "Sign in" for now or make it go to the existing workspace.)
2. **The headline says nothing about the product.** "Run your freelance business like a business" could be any invoicing tool. The real promise (client approves watermarked previews, pays you directly, originals unlock) is hidden in card 3 and step 4. Big. A beginner cannot tell this is about *getting paid safely for design work*.
3. **The product picture shows the busiest, most stressful screen** (4 late items, a ₹7,57,000 figure) and uses the words that the user test showed are confusing: "Awaiting payment" here, in the app, means money the *client* owes after approval, but a beginner reads it as "money I am waiting for in general". Medium. It also teaches the wrong first lesson: "this tool is about chasing people" rather than "this tool protects my work".
4. **Two ways to start with different outcomes but unclear labels.** "Get started" (empty account) vs "See a busy day" (fills the account with sample clients, `peek`). "See a busy day" does not say it loads fake data. Medium. Better: "Try it with sample clients".
5. **The two biggest worries are small or missing.** "Your clients don't need an account" is tiny grey text under the buttons. "PayGuard never holds your money / no fee in beta" is only in the third card and on the setup page. Medium.
6. **"Why PayGuard" comes before "How it works".** A beginner needs to know *how it works* before being convinced *why*. Small/Medium. Also the nav links are in the opposite order of the page.
7. **"Takes about 2 minutes" is not true as designed.** Setup asks for ~8 fields plus terms, and then the first project is a plan page plus a contract (see Setup). Medium. A broken promise at the first moment.
8. **Overused big-title tone and repeated information.** Card 1 ("See every client at a glance") repeats the product picture right above it. Small. The page is longer than needed; the picture and card 1 say the same thing.
9. **Nothing for the *client* side.** Freelancers worry "will my client be scared of a new tool?" The page never shows what the client sees (a link, studio name, no PayGuard branding). Small/Medium.

## 4. What the page should look like

```
[Logo]  How it works   [Try with sample clients]  [Get started]
------------------------------------------------------------
HERO
 Get paid for your design work, without chasing.
 Your client reviews watermarked previews, approves, and pays you
 directly. The real files unlock when you are paid.
 [Get started]  [Try it with sample clients]
 "No account for your clients. We never hold your money. Free in beta."
------------------------------------------------------------
PICTURE: one project, one client's link (what the client sees),
         NOT the whole busy Today screen
------------------------------------------------------------
HOW IT WORKS (4 steps)
------------------------------------------------------------
WHY (3 short cards, no repeated picture)
------------------------------------------------------------
FINAL: [Get started]   "Set up takes about a minute"
```
- **Keep:** the four-step list, "Your clients don't need an account", the honest footer, the three cards' copy for "link" and "get paid".
- **Move:** "How it works" above "Why". Move the three trust facts (clients need no account, no money held, no fee in beta) into the hero, as one line.
- **Merge:** card 1 and the product picture (drop card 1, or drop the late-items framing).
- **Remove:** "Sign in" until accounts exist; the fading fourth row can stay as a decorative fade.
- **Visible by default:** everything. Nothing needs to hide behind a click on a landing page.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Headline | Run your freelance business like a business. | Get paid for your design work, without chasing. | Says what you get. |
| Sub-line | Clients, projects, approvals and payments in one place. No more chasing on WhatsApp. | Clients review a watermarked preview, approve, and pay you directly. The originals unlock when you are paid. | This is the actual product in one sentence. |
| Hero button 2 | See a busy day | Try it with sample clients | Says what happens. |
| Under buttons | Your clients don't need an account. | Your clients don't need an account. We never hold your money. Free in beta. | The three worries together. |
| Nav | Sign in | (remove, or "Sign in" that really signs in) | It does the same as Get started. |
| Final card | Takes about 2 minutes. | Set up takes a minute. Your first project takes a few more. | True. |
| Picture stat | Awaiting payment | Clients owe you | Beginner-safe money word. (Matches the app fix on Today; see other reports.) |
| Section order | Why, then How | How, then Why | Natural order. |

## 6. Questions for the owner
- **Should "Sign in" exist in the prototype?** I would remove it; a fake sign-in hides the real first-time flow. Pick: remove.
- **Should the landing page lead with the freelancer's pain (chasing) or the safety promise (previews, then pay, then unlock)?** I would pick the safety/payment promise, because that is what makes this different from a CRM.

## 7. Related screens
- **Before:** nothing (first thing the visitor sees; or an ad/link).
- **After:** "Get started" goes to Setup. "See a busy day" goes straight to Today with 10 sample clients. The user expects Today to look like the picture; it does (good).

---

# Screen 2: First-time setup (onboarding)

## 1. The job of this page
**Who is here:** a new freelancer who just clicked Get started. **In 10 seconds they must know:** "I am setting up my studio, it is short, and I will be able to make my first project right after."

Smaller jobs, in order:
1. Collect the minimum needed to send a client a link: studio name and a way to get paid.
2. Get agreement to the terms.
3. Show where they are in the journey.

## 2. What is on the page today
- **Top:** logo, mascot, "Step 1 of 2", "Set up your studio".
- **Card 1 (studio):** Your name, Studio or business name, Brand color (4 swatches).
- **Card 2 "Where you get paid":** explainer "Clients pay you directly, so PayGuard never holds your money. We use your UPI ID to make your payment QR code." UPI ID ("Required. Used for UPI requests and your QR code."), "Bank account holder (optional)", "Account number (optional)", "IFSC (optional)" with hint "Card payments are sent to this account."
- **Card 3 "What you're agreeing to":** four bullets, then checkbox "I agree to the Terms and Privacy Policy".
- **Bottom:** "Continue" (greyed until UPI is valid and the box is ticked).
- 3 cards, 10 inputs, 4 bullets, 1 checkbox, 1 button. All visible at once.

## 3. What is going wrong
1. **"Step 1 of 2" is a lie.** Step 2 is "Review and sign the contract" (code, line 1219), which only appears *after* you have also filled in a whole project plan. So the real path is: setup, plan a project, then sign. The user does not know a big plan page sits between. Big. They think they are one click from done.
2. **The word "Required" appears only once, as a hint under UPI, and "(optional)" is on three other fields.** Name and Studio name are *also* effectively required (they are used everywhere) but are not marked, and they come prefilled in the demo, so a real empty form gives no signal. The Continue button is greyed with no message saying why (it could be the missing UPI or the unticked box). Big. This is the "required vs optional is confusing" finding.
3. **Bank details appear in the first-time flow but are optional, and the reason is buried.** The hint "Card payments are sent to this account" is under IFSC only. A beginner reads "bank account number" and hesitates: "why do you want my account number if you hold no money?" Also it contradicts nothing, but it feels like a trust risk at the very first screen. Medium/Big. What they need to know: UPI/QR works without it; **card payments cannot work** without it. Say that plainly.
4. **Terms are shown before the user has seen the product do anything** and are written as a long grey list that people do not read. Medium. Also "You can ask us to delete your data. We keep invoices as the law requires." is a data-retention statement, which the team said is still undecided (BRIEF). Medium.
5. **Brand colour is asked first, before the thing that matters (getting paid).** It is a nice-to-have in the most important form. Small/Medium. The user does not know *where* the colour/studio name will show (it shows on the client's link; this is the key fact and is only said in Settings: "Your clients see this on every link").
6. **Tax details, contract letterhead and project defaults are not in setup at all.** That is mostly right (they can wait), but the user is never told they exist or when they will be needed. The first time they appear is at the contract step (letterhead card) or in Settings. Medium. No "you can add these later in Settings" line.
7. **No way back or out.** No "back to the site" link; clicking the logo does nothing. Small.
8. **The form repeats the Settings page almost field for field** (name, studio, colour, UPI, bank). Same labels, same order. That is fine for consistency, but it means there are two places to edit the same facts; make sure they stay identical. Small.
9. **Mascot and big title take a lot of room** while the important explanation (what your clients will see) is missing. Small.

## 4. What the page should look like
Goal: setup collects only what is needed to send the first link. Everything else is "later, in Settings".

```
Logo
Set up your studio          (progress: 1 Studio  2 First project  3 Contract)
"Takes about a minute. You can change all of this later in Settings."

[Card: Your studio]  (all required, marked)
  Your name
  Studio name          hint: "Your clients see this name on their link. Not PayGuard."
  Brand colour         (small, below, with a tiny preview of the client link header)

[Card: How clients pay you]
  UPI ID  (required)   hint: "Used to make your payment QR code."
  [+ Add bank account for card payments]   <- closed by default (optional)
       opens: Holder, Account number, IFSC
       note: "Without this, clients can only pay by UPI or QR."

[ ] I agree to the Terms and Privacy Policy   (links open the full text;
    the 4 bullets shrink to one line: "PayGuard never holds your money.")

[Continue]   (if disabled, a line says what is missing: "Add your UPI ID")
```
- **Keep:** UPI as the only hard requirement; the explanation that PayGuard never holds money; the checkbox gate.
- **Move:** bank details behind a "+ Add bank account" click (optional things hide). Move brand colour below the studio name with a preview.
- **Merge:** the four agreement bullets into one trust line plus links.
- **Remove:** "Step 1 of 2" as written. Replace with the real journey (setup, first project, contract). Remove the mascot's large size.
- **Not here (say "Later, in Settings"):** tax details, contract letterhead, defaults, notifications.

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Step label | Step 1 of 2 | Step 1 of 3: Your studio | True to the real path. |
| Title | Set up your studio | Set up your studio (about a minute) | Sets expectation. |
| Studio name label | Studio or business name | Studio name (clients see this) | Says where it shows. |
| Required marks | (only UPI says "Required") | Mark every required field "Required"; keep "(optional)" for the others | One rule everywhere. |
| UPI hint | Required. Used for UPI requests and your QR code. | Required. Clients pay this ID. We use it to make your QR code. | Plain. |
| Bank section | Bank account holder (optional) / Account number (optional) / IFSC (optional) | Add a bank account to accept cards (optional) | One choice instead of three questions. |
| IFSC hint | Card payments are sent to this account. | Without a bank account, clients can pay only by UPI or QR. | Tells the consequence. |
| Agreement | What you're agreeing to + 4 bullets | PayGuard connects you and your client. It never holds your money. [Terms] [Privacy] | Short enough to read. |
| Disabled button | Continue (no reason) | Continue + line "Add your UPI ID and tick the box" | Tells why it is greyed. |
| Data bullet | You can ask us to delete your data. We keep invoices as the law requires. | (hold until retention is decided) | Undecided policy. |

## 6. Questions for the owner
- **Is a bank account ever needed in beta, or can card be switched off until later?** I would pick: hide bank details behind a click now, because it cuts the scariest fields from the first screen. If card is a launch feature, keep the click-to-add.
- **Should setup include the first project in the same flow (as one guided path)?** I would pick yes: "Step 1 studio, 2 project, 3 contract", because the landing page promises "start with your first client".

## 7. Related screens
- **Before:** Landing ("Get started").
- **After:** Today (empty, with "New project"). Expectation after Continue: "now I add my first client". Today is empty with a mascot and a "New project" button (code `emptyPage`). That works, but a brand-new user should get a clear **single next step** ("Create your first project") rather than an empty command centre. Then the plan page, then "Step 2 of 2: Review and sign the contract".

---

# Screen 3: Settings

## 1. The job of this page
**Who is here:** a freelancer who already works in PayGuard and wants to change *one specific thing* (UPI ID, letterhead, default terms). **In 10 seconds they must be able to find that one thing.**

Smaller jobs, in order:
1. Fix payment details.
2. Set up the contract look (letterhead, footer, clauses) once.
3. Set defaults so each new project fills itself.
4. Add tax details when needed (invoices).

## 2. What is on the page today
- **Top:** header "Settings", line "Changes save as you type."
- One long single column, six sections divided by lines, no navigation inside:
  1. **Studio:** "Your clients see this on every link." Your name, Studio name, Brand colour.
  2. **How you get paid:** "Clients pay you directly by UPI, QR or card. Clients never see your bank details." UPI ID, Bank account holder, Account number, IFSC. (No "optional" labels any more.)
  3. **Contract template:** "Upload your own header so every contract comes on your letterhead, and add your own clauses." Letterhead drop area ("No letterhead yet", "Upload your header"), "Footer line (optional)", "Your own clauses (optional, one per line)".
  4. **Tax and invoices:** "Shown on the invoice for your work." Legal name, State, GSTIN ("Leave blank if you are not GST-registered."), PAN.
  5. **Defaults for new projects:** "Used to fill the Terms on every new project. You can change them per project." Six dropdown/inputs: Client replies within, If they don't reply, Rounds of changes per stage, Price of an extra round (₹), Advance before work starts, Balance due within.
  6. **Notifications:** "Tell me when something happens." Four checkboxes.
- About 26 fields on one scrolling page (roughly 2,000 px tall on desktop). No save button (auto-save).

## 3. What is going wrong
1. **One very long page with no way to jump.** 26 fields, six topics, no in-page menu. To change a notification you scroll past everything. Medium. Settings is the one place where a short list of groups on the left (or tabs) would help, because the user arrives with a specific goal.
2. **Required and optional disappear.** In setup, UPI is "Required" and bank fields are "(optional)". In Settings, the same fields lose those labels, so a user cannot tell what they can empty. Tax fields say nothing about when they are needed (only GSTIN has a hint). Big (this is the confusion the meeting named).
3. **Order is wrong for a first-timer's needs.** Contract template (a nice-to-have) sits *above* Tax and Defaults, and Defaults (which makes every future project faster) is fifth. The order should follow "what you need first": Studio, Get paid, Defaults, Contract template, Tax, Notifications. Medium.
4. **Tax is a form with no consequence shown.** "Shown on the invoice for your work." Which invoice? When? Legal name "As on your PAN" and PAN are the same identity data asked twice in a way. A freelancer under the GST limit does not know whether to fill it. Medium. Also these are sensitive IDs entered with no reassurance who sees them (the client? the invoice?).
5. **"Defaults for new projects" is where the contract rules are really set, but the name does not say so.** The sub-line says "fill the Terms". "Terms" is a new word on this page; elsewhere it is "contract". Medium. Also the six controls are jargon-heavy: "Client replies within / If they don't reply / Approve after 3 days" really mean *review time* and *automatic approval*. The consequence of automatic approval ("the work is approved without them clicking") is not said. Big for trust: this is the setting that can approve work without the client acting.
6. **"Advance before work starts" lives only here and on the plan page, and the word "advance" is shown without saying it is paid straight to you.** Medium. Setup never mentions it.
7. **The contract template is presented as a feature (letterhead) but is also asked for again inside the contract step** (`tplCard()` is reused at the "Review and sign the contract" screen, with a note "It's saved in Settings for next time"). So the same card lives in two places. That is helpful in context, but the user should be told on both pages that it is the same thing. Small/Medium.
8. **Studio section is a duplicate of setup and not editable in a safe way**: changing the studio name changes what every client sees, with no warning or preview. Small/Medium.
9. **"Changes save as you type." is the only status.** No "Saved" confirmation next to a field. A tester will wonder if it worked. Small.
10. **The words "Account number", "IFSC", "Bank account holder" appear without the explanation that this is only for card payments** (that explanation is under IFSC at the bottom of the block). Small/Medium. Users who skip the bank section never learn card is then unavailable.
11. **Notifications sub-line "Tell me when something happens."** is vague, and the last checkbox is a very long sentence mixing two ideas (reminders before a date, and once late). Small. Also "Remind clients automatically" is a client-facing action (it messages the client), but is filed under "Notifications to me". Medium.

## 4. What the page should look like
```
Settings                                     (saved: "All changes saved")

[ Left list ]            [ Right: one group at a time ]
  Studio                   
  Payments                 
  Contract
  Defaults
  Tax details
  Reminders

Studio   : name, studio name, colour + a tiny "what your client sees" preview
Payments : UPI ID (required), bank account (optional, for cards)
Contract : letterhead, footer, own clauses (all optional) + preview
Defaults : "Review and payment rules" in plain words, grouped:
             - Reviews: client replies within / automatic approval
             - Changes: rounds, extra round price
             - Money: advance, balance due
Tax      : optional, with "Only needed if you invoice with GST" note
Reminders: what I get told + what clients get nudged about (two groups)
```
- **Keep:** auto-save, the Studio and Payments wording ("Clients never see your bank details" is good, keep it), the "you can change them per project" line on defaults, the letterhead preview card.
- **Move:** Defaults up to third (before Contract and Tax). Move "Remind clients automatically" out of "Notifications" into a "Reminders" group with the automatic approval explanation.
- **Merge:** Payments fields into one card with bank details in an optional sub-block (same as setup). Merge "Legal name" with studio info only if the owner wants one identity (see question).
- **Remove:** nothing outright; but hide the Tax group until the user opens it (collapsed, "Optional").
- **Visible by default:** the left list and the first group (Studio). Everything else loads on click. On phone, the list is the whole page and each item opens its own page.

Where each thing belongs for a first-time user:

| Thing | Where it should be asked | Required? |
|---|---|---|
| Name, studio name | Setup | Required |
| Brand colour | Setup (below, optional, has a default) | Optional |
| UPI ID | Setup | Required |
| Bank account (for cards) | Settings, optional "add" in setup | Optional |
| Contract letterhead, footer, extra clauses | Contract step of first project, saved to Settings | Optional |
| Defaults (review days, auto-approve, rounds, advance, balance) | Settings, preset with sensible values; changeable per project on the plan page | Preset, never blank |
| Tax (legal name, state, GSTIN, PAN) | Settings, when they first need an invoice | Optional (needed only for GST invoices) |
| Notifications | Settings | Preset on |

## 5. Copy fixes

| Where | Now | Better | Why |
|---|---|---|---|
| Top line | Changes save as you type. | Changes save as you type. (show "Saved" after each change) | Confirms it worked. |
| Section | Contract template | Contract look and clauses | It is not a template of the whole contract. |
| Section | Defaults for new projects | Rules for new projects | Plainer. |
| Section sub | Used to fill the Terms on every new project. | Every new project starts with these rules. You can change them for one project. | "Terms" vs "contract". |
| Field | Client replies within | Client has to review within | Clear verb. |
| Field | If they don't reply | If they don't reply, the stage is... | Clear result. |
| Option | Approve after 3 days | Approve it automatically after 3 days | Says the work is approved without them. |
| Option | Never approve automatically | Wait for the client (no automatic approval) | Same. |
| Field | Rounds of changes per stage | Free rounds of changes per stage | Says what is free. |
| Field | Price of an extra round (₹) | Price for each extra round (₹) | Plain. |
| Field | Advance before work starts | Advance (paid to you before work starts) | Uses the shared word and says who gets it. |
| Field | Balance due within | Client must pay the balance within ... of approval | Says what starts the clock. |
| Section | Tax and invoices | Tax details (optional) | Marks it optional. |
| Section sub | Shown on the invoice for your work. | Only needed if you send invoices with GST. Shown on your invoices. | Tells who needs it. |
| Section | Notifications | Notifications | Keep, but split. |
| Last tick box | Remind clients automatically: a day before a reply or payment date, and once it's late | Send my clients automatic reminders (a day before a date, and when late) | Shorter, and in its own "Client reminders" group. |
| Bank fields | (no label) | Bank account (optional, needed for card payments) | Required/optional visible. |

## 6. Questions for the owner
- **Do you want Tax details at all in the beta?** I would pick: keep, but collapsed and marked optional, because Indian freelancers below the GST limit will skip it and it should not look like a requirement.
- **Where should the "automatic approval" rule live, given it can approve work without the client?** I would pick: keep the default in Settings but always show it on the project's contract/plan page, with the plain sentence, because it affects trust on both sides.
- **Should the contract letterhead live in setup, in the contract step, or both?** I would pick: only in the contract step (first use) and in Settings (later edits), with the same card and a "Saved in Settings" note on both.

## 7. Related screens
- **Before:** any freelancer screen via the "Settings" link at the bottom of the left bar (and the Settings item in the phone bottom bar).
- **After / linked:** the Defaults feed the plan page (new project, "Terms" section) and the contract page; the Letterhead card is reused in the contract step; UPI/bank feed the payment QR the client sees; Studio name and colour feed the client link. A user who changes something here expects to see it on the next new project/client link.

---

# Required vs optional: one rule for the whole product

The meeting said this was confusing. Use **one rule**, on every form:
- **Required** = you cannot continue without it, and the field says "Required" in plain text next to the label.
- **Optional** = the field says "(optional)" and, if it is a group (bank account, tax, letterhead), it sits behind a click ("+ Add ...").
- **Preset** = has a safe default (defaults, notifications). It never shows empty.
- A disabled Continue button always shows a line saying what is missing.

Today's actual requirements in code: only UPI ID format and the checkbox are checked (`setupOk`). Names are not validated, so a person can continue with an empty name and the client link will show a blank studio name. Add name and studio name as required.

---

# Top 5 things to fix on these screens

1. **Fix the fake "Step 1 of 2".** Show the real path (studio, first project, contract) so the "2 minutes" promise is true, and explain on Today what the next step is.
2. **Apply one required/optional rule.** Mark required fields, hide optional ones (bank account, tax, letterhead) behind "+ Add", and tell the user why Continue is disabled. Also make name and studio name actually required.
3. **Rewrite the landing headline and hero** to say the real promise (previews, approve, pay you directly, originals unlock), put the trust facts under the buttons, and rename "See a busy day" and remove the fake "Sign in".
4. **Split Settings into groups with a left list** and reorder to Studio, Payments, Defaults, Contract, Tax, Reminders; rewrite the Defaults labels so automatic approval clearly says the work gets approved without the client.
5. **Cut setup to the minimum** (names, UPI, agree) and tell the user that bank, tax, letterhead and defaults live in Settings and can wait. Explain that a bank account is only needed to accept cards.
