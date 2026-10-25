# PayGuard: project brief and prototype v5 handover

Written for another LLM (or a new teammate) who has none of the earlier conversation. It says what the project is, how it got here, what prototype v5 does, and why each major decision was made. Where something is unknown or unresolved, it says so instead of guessing.

Last updated: 25 Oct 2026. Prototype file: `prototype/PayGuard-prototype-v5.html` (single self-contained HTML file).

---

## 1. One-paragraph summary

PayGuard is a client-operations workspace for **independent freelancers in India** (INR, UPI, QR and card). A freelancer plans a project as a list of **deliverables**, signs a contract, and sends the client one link. The client needs no account: they read the work, sign the contract, pay any advance, review watermarked previews, approve or ask for changes, and pay. The original files **unlock only after payment**. **PayGuard never holds money and takes no fee in the beta.** Clients pay the freelancer directly. The product's job is to remove chasing, ambiguity and awkward conversations.

## 2. Where the project started

- **Research (Sept 2026).** Files in the repo root: `PAY_GUARD_MASTER_RESEARCH_REPORT.md`, `PASS_1_RESEARCH_AND_EVIDENCE_BANK.md`, `PASS_2_SYNTHESIS_AND_INTERVIEW_GUIDE.md`, and `research/`. It is secondary research plus an interview plan, **not** primary user research. Primary interviews are still to be run.
- **Core problem.** Freelancers run work across 5 to 6 unconnected tools (chat for talk, drive links for files, a separate invoicing app, UPI for money). Nothing ties a deliverable to its preview, its approval and its payment. The result is late payments, scope arguments, and freelancers who look less organised than their work deserves.
- **Target user.** Established freelancers (designers, developers, writers, video editors and similar) earning roughly ₹1L+ a month and handling about 5 to 15 clients at once. Clients are small businesses and founders who dislike "portal fatigue", so the client side must need no account.
- **First PRD (`PRD.md`, 22 Sept 2026)** called the product "Absolute Cinema" and was built around **escrow**: client funds a milestone, freelancer delivers watermarked previews, client approves, money is released, receipt issued. The flow was Fund, Deliver, Approve, Release, Receipt, with fee split leaning about 55/45 toward the freelancer.
- **Rename and pivot (Oct 2026).** The name became **PayGuard**. The escrow model was dropped (see section 6): PayGuard now holds no money. `DESIGN.md` and `design/flow-state-model.md` describe the earlier direction and the newer "unlock model" respectively. Where they disagree with this brief, **this brief and `design/flow-state-model.md` section 12 win**.

## 3. How the work progressed

1. Research and PRD (Sept).
2. A first clickable prototype (v2) and a Vite + React skeleton in `src/`. Both are reference only now.
3. **Nazar-based single-file prototype.** The live prototype is built from `prototype/nazar/` (`head.html` for CSS and icon sprite, `app.js` for all logic, `tail.html`, and `build.py` which assembles `index.html`). It is vanilla JavaScript with string-template rendering and event delegation. A separate `prototype/PayGuard-pixel.html` variant also exists but is not the current base.
4. A heuristic review and a flow and state model (`design/heuristic-review/`, `design/flow-state-model.md`).
5. A user test, then an **information architecture audit** by fifteen reviewers (`design/ia-audit/README.md` and `reports/01` to `15`).
6. Page-by-page narrated feedback from the product owner (`design/ia-audit/owner-feedback-01.md`) and a questionnaire. Static mocks were made and approved (`design/ia-audit/mocks/png/`).
7. **Build of all redesigned pages**, then many small rounds of owner feedback (this brief documents the result: prototype **v5**).
8. A planned, not built, Today-screen direction inspired by Ackee (`design/today-ackee-direction.md` and two mock images).

## 4. Working style of the product owner (important for any LLM continuing this)

- Wants things explained in **plain, simple language**. Often writes in Hinglish, voice-style. Messages can be long and informal, and sometimes cut off mid-sentence. If one is cut off, ask what the rest was.
- **Process rule: screenshot, then approval, then build.** Mocks were approved before the big build. Small changes are applied directly.
- Strongly dislikes visual noise: capsules, legends, boxes within boxes, decorative icons. Repeatedly asked for "just a list" and for equal heights, equal spacing, consistent button sizes.
- Notices detail: line heights, padding near the bell, hover states, copy wording. Check the screen after every change.
- Verify with a real screenshot before saying something is done. A class-name collision has broken the whole layout twice.

## 5. Product model (the rules the prototype enforces)

### Roles
- **Freelancer** (the demo persona is "Meera Iyer", studio "Meera Iyer Studio"). Has an account. Sidebar: Today, Clients, Calendar, Payments, Settings, plus New project.
- **Client** (for example "Priya Nair" of Bloom Studio). **Never needs an account**. Opens a link. The client side shows the **studio name, not PayGuard** (watermark, contract text, checkout all use the studio).
- A demo bar at the bottom switches between Meera, a client, "First day" (empty account) and "Active" (sample clients), and Restart. It is for demos only and is meant to go away.

### Vocabulary (one word per concept)
**Deliverable** (never "stage" or "milestone" in the UI), **Contract**, **Advance**, **Unlock**, **Paid / Not paid** (the only two payment statuses in the Payments page). Client-facing copy never says "escrow".

### Money rules
- PayGuard holds no money and takes no fee in the beta. Clients pay **directly to the freelancer** by UPI, QR code or card (credit or debit). The freelancer's UPI ID is set at onboarding and is used to make the QR code. A bank account is optional and receives card payments.
- **Payment plan** chosen per project (three cards with a pie chart): **One payment** (no advance), **Half and half** (50% advance), **Three payments** (30% advance). The rest is paid when each deliverable is approved, or once at the end when files unlock for the whole project. *Interpretation note:* "Three payments" being a 30% advance was the assistant's reading of the owner's feedback and has not been explicitly confirmed.
- Client pays within N days of approving (default 7). Original files unlock **deliverable by deliverable** or **once for the whole project** (the default is by deliverable when there are 3 or more).
- The freelancer can also **Mark as paid** (paid another way) or **Unlock without payment** at any time. Every critical choice stays with the freelancer.
- Everything is simulated: payments, UPI, QR, cards. No real money moves.

### Deliverable statuses
Not started (`draft`), In progress (`funded`), In review (`submitted`), Changes requested (`changes`), Awaiting payment (`approved`), Unlocked (`released`), On hold (`dispute`). Refunds were removed.

### The end-to-end flow
1. Freelancer creates the project in three steps (Project and client, Deliverables, Terms).
2. Freelancer reviews the contract and signs it inline (draw or type), then sends it. Contract is signed **before** work starts.
3. Client opens the link: step 1 **The work** (deliverables and money split), step 2 **The contract** (sign inline, button "Sign and pay ₹X to start" or "Sign and continue").
4. Client pays any advance (UPI, QR or card).
5. Freelancer uploads work (or re-uploads after changes) and clicks Send for review. Client sees a **watermarked** preview.
6. Client approves or asks for changes (rounds are limited per deliverable). If the client doesn't reply within the window, an auto-approve setting can apply.
7. Client pays. Originals unlock.

## 6. Why the big decisions were taken

| Decision | Why |
|---|---|
| Dropped escrow, hold no money, no fee | Holding money brings payment-licence and legal risk, and slows a beta. Direct UPI is what Indian freelancers already do. The product still protects the freelancer by locking the originals until paid. |
| Unlock files only after payment | This is the real leverage. A watermarked preview lets the client judge the work without being able to walk away with it. |
| Client needs no account, link only | Clients suffer portal fatigue. The link-only flow is the main adoption advantage. |
| Contract signed before work starts | Fixes the scope and terms in writing. Freelancer signs first, then client. |
| Freelancer controls advance, due days, unlock mode | Meera's own terms, set per project. The tool shouldn't impose a policy. |
| "Deliverables" instead of "stages" | Plainer to freelancers and clients. Renamed everywhere including the contract. |
| Remove search bar and Cmd+K | Owner decision: it added noise and wasn't needed for a small client list. |
| Client page is one vertical timeline, no tabs | The page's only job is "what state is the work in". Tabs hid that. Contract, optional Advance, then deliverables: done ones ticked, the current one open, upcoming ones collapsed. |
| Details drawer hidden by default | Keeps the timeline clean. Holds Contract, Money, Terms and Activity (no contact, no "Next up"). |
| Payments only shows Paid / Not paid | Two money states are all that matter: received or not. In-progress and done-this-week lists were removed from Payments. |
| Notifications are a bell popover, not a board | Notifications are other people's actions (opened the link, signed, asked for changes with the comment text, paid). No buttons inside them. |
| Today is a plain To do list, Payment status, Coming up | The owner asked for "just a list", equal heights, no capsules or boxes. |
| Calendar kept as it was | Owner first asked for monochrome, then reversed and kept the original. |
| Plan in 3 steps with Review the contract at the end | Smaller steps, summary on the side, no delivery-dates calendar, no logo colour swatches (initials on a colour derived from the client's name instead). |
| One merged upload box with one Send for review button | Drop zone and add-a-link were two separate things doing one job. After a change request the wording becomes "Re-upload". |
| Change requests shown as their own amber card below the uploaded files | They were getting lost in the content. The same comment text appears in the notification. |
| Icon-only secondary actions with instant tooltips | Remind Priya stays text on the far right. Mark as paid (tick) and Unlock (open padlock) are icons, to save space. |
| One button scale: 36px, with 32px for the header toolbar and 28px for small inline | Owner noticed inconsistent heights and line heights. |
| Phone number with country dropdown and per-country digit rules | India 10 digits, US 10, UK 10, UAE 9, Singapore 8 and so on. Error states appear on invalid or missing input. |
| Card brand logos (Visa, Mastercard, RuPay, Amex), UPI and QR marks, app-logo stack for Figma, Loom, Miro and Drive | Owner asked for logos wherever they simplify. They are simple self-drawn marks, **not official brand assets**, and should be replaced before any public use. |

## 7. Prototype v5, page by page

**Look and feel.** A shadcn-style system: Geist font, zinc greys, small radii, 6px badges, type scale 12/14/16/24/28, 8px corners on buttons. Brand blue is used sparingly. The mascot is an animated character (see section 9).

**Today.** Greeting that changes by weekday ("Hey Meera, it's Sunday. Look at you, working."; "Fun Friday, Meera!"). The top bar still says Today and the date. Bell icon with count opens notifications. Then: **To do** (plain list: bold action line with reason first, then "Client · Deliverable", a chevron; no price), **Payment status** (Received and Pending as big numbers, plus a mascot whose size grows with the amount received, from about 55% to 120%), **Coming up** (next two days plus late items in red). On phones, To do shows 4 items and Coming up shows 3, each with "Show all".

**Clients.** A filterable list (All, Needs you, Waiting, On track, Done) with search. On phones each row is the client, status badge and project.

**Client page (inside a client).** Breadcrumb Clients > Org. Header with avatar, org, contact. Buttons: Client link, View as X, Details. Vertical timeline as described above. An open deliverable card has three columns (What's included, Files shared, Changes) and a right-aligned action area. A change request appears as an amber card with the client's comment.

**Calendar.** Month grid with colour-coded client legend, unchanged from the earlier version.

**Payments.** Two cards (Earned to date, Not received yet), a client dropdown and All / Paid / Not paid filter, and a table. On phones it becomes cards with "Show all".

**Settings.** Sections for Studio, How you get paid, Contract template, Tax and invoices, Defaults for new projects, Notifications. On phones the sections open and close.

**New project (freelancer).** Three steps with a stepper: Project and client, Deliverables (with "Start from a brief": upload a brief, try a sample brief, or write), Terms (reply window, auto-approve, rounds, price of extra round, payment plan cards with pie chart, pay-within days, unlock mode, UPI ID). A live Summary panel on the side. Button at the end of step 3: Review the contract.

**Freelancer contract step.** The full contract with an inline signing box (Draw or Type icons), "I have read…" as the contract's last line, button "Sign and send to {client}".

**Client side.** First visit in two steps (The work, then The contract). Then the timeline view: Current deliverable, All deliverables, Contract tabs. Watermarked preview. Checkout for UPI, QR or card with field-level errors, card-brand detection, and "Test mode" labelling.

## 8. Form and validation rules

- Email: empty gives "Enter an email address."; malformed gives a suggestion. Used in New project, Edit client and checkout.
- Phone: optional, country dropdown, digit counter, per-country length check.
- Card: number must pass a length and checksum test, expiry must be MM / YY and not past, CVC 3 digits (4 for Amex). Test cards: numbers ending in 0002 simulate a declined card; a UPI ID containing "fail" simulates a rejected request.
- Required fields on New project show red inline errors, and the stepper marks the step that has errors. Fix them and the flow continues.

## 9. Technical handover

**Stack.** Vanilla JS in a single IIFE, string-template rendering, `render()` rebuilds `#app`, events handled by one delegated listener using `data-a="action"` attributes. State is held in `U` (transient UI) and `D` (persisted data, saved to `localStorage` under `payguard.proto.v5`). No framework, no network calls.

**Files.**
- `prototype/nazar/head.html`: all CSS plus the SVG icon sprite and mascot symbols.
- `prototype/nazar/app.js`: all logic and rendering.
- `prototype/nazar/tail.html`, `build.py`: assemble `index.html`.
- `prototype/PayGuard-prototype-v5.html`: the delivered copy. Copy `prototype/nazar/index.html` over it after each build (`python3 build.py` in `prototype/nazar`).
- Backups of earlier states were kept outside the repo in `/tmp/bak-nazar/` and will not survive.

**Useful helpers.** `advPct`, `advAmt`, `balOf`, `projMode`, `allApproved`, `payAmt`, `contractOk`, `canPay`, `startNext`, `doApprove`, `doPay`, `doAdvance`, `attentionFor`, `projStatus`, `moneyNow`, `comingUp`, `notifFeed`, `timelineHTML`, `dCard`, `uploadArea`, `sPlan`, `contractHTML`, `sigPadHTML`, `phoneHTML`, `cardBrand`, `emailErr`, `xbtn` (mobile collapse).

**Mobile.** Breakpoints at 900px and 700px. Below 700px the side nav becomes a bottom bar, long lists collapse behind "Show all N", tables become cards, Settings sections become accordions, and the plan stepper shrinks to numbered dots.

**Lessons that bit us (read before editing).**
1. **CSS class-name collisions.** A new class called `.app` (for UPI app chips) collided with the main layout container and collapsed the whole screen. `.more`, `.dash`, `.kv`, `.pay2` and others have collided before. Use distinctive prefixes for new classes and grep `head.html` first.
2. Python patch scripts that edit `app.js` can silently lose edits if you mix local variables with the patch object. Prefer exact-string replace with an assertion that the old string exists.
3. Always screenshot at desktop (1360 wide) and phone (390 wide) after a change. Headless screenshots are possible with Chrome; a preview server config named `nazar` exists for the Claude desktop app.
4. Use `ico('name')` only for icons that exist in the sprite. A missing name shows nothing (a missing download icon went unnoticed for a while).

**Verified end to end** in the browser with no console errors: create project, freelancer signs, client signs and pays the advance, freelancer uploads and sends for review, client approves, client pays, originals unlock, notifications update.

## 10. What is not done or not decided

- **Today-screen direction (planned, not built).** `design/today-ackee-direction.md` plus mocks `design/today-ackee-direction-mock.png` and `...-months.png`. Three tiles (Received, Pending not-yet-due, Late) each with a two-row breakdown, a To do list, and an "Earned per week / per month" bar chart with a Weeks / Months toggle. The Ackee average-days tile and the mascot were removed in the mock. Needs the owner's go-ahead. The owner's last message about To do was cut off mid-sentence, so that request is unknown.
- **Unresolved topics:** collaborators on a project, link password protection, data retention, expiry of originals after unlock (60 or 90 days), whether the freelancer sees the client's preview views.
- **Legal and risk, open:** review of the contract template, provider rules for paying freelancers directly, and chargebacks after unlock.
- **Research:** primary interviews not yet run; the research plan's kill criterion is not set.
- **Delivery:** GitHub push and a shareable link are not done.
- **Assets:** brand marks are placeholders. Sample data has little payment history, so any chart needs seeded history.
- **Not built (by design):** real payments, real file storage, real watermarking engine (the prototype overlays a text watermark), real email or WhatsApp sending (it opens prefilled links), authentication.

## 11. How to continue from here

1. Read this brief, then `design/flow-state-model.md` (section 12), then `design/ia-audit/owner-feedback-01.md`.
2. Open the prototype and walk the flow once as Meera and once as a client.
3. Before any change: propose it, show a mock or screenshot if it is visual, wait for the owner's approval, then build.
4. After any change: rebuild, screenshot desktop and phone, check the console, copy the build to `prototype/PayGuard-prototype-v5.html`.
5. Keep language plain. Keep the three-state money model (Received, Pending, Late) and the two-state payment status (Paid, Not paid) consistent everywhere.
