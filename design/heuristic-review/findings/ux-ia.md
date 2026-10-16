# PayGuard UX / IA heuristic review (ux-ia)

Evidence: shots plus code. Several shots were captured mid-fade, so I re-rendered settled ones in `review/ux-ia/shots/`. *(code)* = inferred from app.js, not seen.

## 1. Verdict
Today is the right front door and its row anatomy is the best thing here. But the IA has no Client object, freezes a project after invite, leaves the chase loop open, and describes one stage with five colliding status vocabularies. At 15 clients with repeat work these break the "10 seconds" promise faster than any visual issue.

Scores: first-glance clarity 7 | task efficiency 6 | state-model coherence 4 | edge/empty/error coverage 4 | wayfinding 5 | mobile 4 | consistency 4

## 2. What is working: keep it
- Today is the landing page and the sidebar badge equals the "Needs you" count: 0 clicks to know, 1 to act.
- Row anatomy is self-contained: "Northwind Cafe · Menu and packaging / Not funded · 3 days overdue / you asked 5 days ago / ₹35,000 / [Remind Sana]". Verb buttons beat "Open".
- "Waiting on clients" collapsed and quiet; first-day checklist plus "Look around with sample clients".
- Project hero: one headline, one action per state; locked dropzone explains itself.
- Client page: no account, "Ask for changes · 2 left", honest approve dialog ("can't be undone"), declined card says "You have not been charged".
- Plan: templates plus live calendar preview. Role-aware documents.

## 3. Task walk-throughs
| Task | Path | Count |
|---|---|---|
| This morning | open, read, act | 0 clicks to see, 1 to act; headline nouns mislead (F4) |
| Plan and invite | Get started, agree, Continue, Plan, Create, Copy | 6 clicks, ~16 fields; repeat client re-types everything (F1) |
| Chase unfunded | Today, Remind | 1 click, blind toast (F5); from Payments 3 |
| Respond to changes | Today, Open, Choose, pick, Submit | 4 clicks; file/note gaps (F9) |
| Where is my money | Payments | 1 click, then 4+ reconciliations (F6) |

## 4. Findings

**F1. No Client entity.** S1 | `clients`, `plan`, project breadcrumb | `p.client` is embedded per project; Clients is one row per project; colour is per project; Plan re-asks company/contact/email; the breadcrumb middle crumb ("Bloom Studio") is dead. | A repeat client (the norm at 5-15) becomes two rows, two colours, retyped contacts. | Client becomes an object: Clients lists clients with project count and worst status; Plan starts "Choose client / New client"; colour lives on the client. | L

**F2. Projects freeze after invite; rounds-exhausted is a dead end.** S1 | `project-*`, `client-review` | Only client colour/logo/contact is editable. No stage edit, add, pause, archive or extra round (`m.limit` set once). At 0 rounds the client sees a disabled button plus "Talk to Meera about extending the scope" with no contact path; the freelancer has no matching state or action. | Scope change is weekly life; "flexible milestones" ends at creation. | Edit stage until funded; "Grant a round" with client notice; client "Request more rounds"; pause/archive. | L

**F3. Five status vocabularies for one stage.** S1 | `clients`, `payments`, `project-overdue`, `project-complete`, `today-active` | Milestone, money, project pill, Today bucket and Payments tile all name the same state differently. (a) "Awaiting approval" and "Waiting on client" share purple but sit in different buckets; the Clients "Needs you 4" chip contains rows labelled Overdue and Awaiting approval. (b) `project-overdue`: stage badge "Overdue" beside "Due Sat, 17 Oct · 3 days"; "Overdue" shows three times. (c) `project-complete`: pill "Complete", stage "Payment processing", note "whole project, paid". (d) Acme pill "Needs you", stage "Funded". (e) "stage"/"milestone" mixed even in one sentence ("Fund milestone 1 of 2" / "You fund one stage"), plus "Delivery" for a due date; "Open as Priya" reads as impersonation. (f) "secured" and "released to Meera when you approve" imply custody, which the locked "no escrow claims" decision forbids. | Users cannot predict where a task or rupee will appear. | Two axes. Whose turn: *You / Client / Done*. One ladder: *To fund, Funded, In review, Changes, Approved, Paid out*. Lateness is a "late 3d" chip, never a status or bucket. Pick "Milestone". "Preview as client". | M

**F4. "Needs you today" mixes work I owe with chasing.** S2 | `today-active` | Headline "1 payment, 1 approval, 1 change request, 1 delivery" reads as my to-dos, but payment and approval are the client's. Sort is severity then amount ascending (`a.amount - b.amount`): ₹35,000 above ₹60,000, no rationale. Rows show gross (Bloom ₹60,000); the widget beside shows net (₹57,900). Four equal black buttons. | The scan must separate do from chase, and numbers do not reconcile. | Two lists: **You owe** (upload, respond) and **You're owed** (late first). Summary "2 to do · 2 clients late · 2 waiting". Sort by money-at-risk, then age. Label gross/net once. Chase buttons secondary. | M

**F5. Chase loop never closes, and it can misfire.** S2 | `today-active`, `project-overdue` | `remind()` only toasts "Sana will get a nudge"; the row still says "you asked 5 days ago"; repeat clicks resend; no preview, channel or history; four verbs (Remind/Nudge/Resend/Send a reminder). *(code)* `askedAt` is set once per project, never per stage, so after stage 1 is released stage 2 instantly reads "Not funded · N days overdue" (sample data hides it). The 2-day grace is hidden and unconfigurable. | "Needs you" never reaches zero, and one false red row kills trust. | Composer with preview, then row flips to "Reminded Tue · next Fri" under Waiting. Per-stage `askedAt`. "Client funds within N days" term. One verb. | M

**F6. Payments gives three groupings of the same money.** S2 | `payments`, `today-active` | Tile "Funded ₹2,28,705" includes awaiting approval; chip "Funded 3" excludes it. "Paid to you" excludes the ₹19,300 processing shown under it. "Not funded yet ₹3,86,000" is the whole pipeline with "1 overdue" in grey. Today's widget (Pending/Funded/Upcoming) omits money in transit. Rows are not links and the Overdue row has no Remind *(code)*. Clients is unsorted (Orbit "Complete" mid-list) while Payments is ranked. | The money screen is a dead end for the one money action. | One bucket set: *Overdue, In review, In transit, Paid, Later*. Lead with Overdue and In transit. Rows open the stage; Overdue rows get Remind. Sort Clients by urgency. | M

**F7. Client price shock and UPI gap.** S2 | `client-invite`, `client-checkout` | Button "Fund the first milestone · ₹38,000", checkout ₹40,466 ("service fee (example 5.5%)"). After paying: modal "₹40,466 is funded", hero "Your ₹38,000 is funded". "Pay by card or UPI" but card-only, prefilled 4242, re-typed every stage. | Guests meet +6.5% at the last step and hesitate; UPI promise unmet. | Show total incl. fee and GST on the invite; UPI first; one amount per payment; drop "(example)". | M

**F8. Mobile loses amounts and calendar.** S2 | `m-project`, `m-client-review`, `m-calendar`, `m-payments` | `.rows li .mono{display:none}` at ≤900px hides every milestone amount, including on the client's approval page. Calendar becomes pale 6px dots with no agenda. Top pill nav clips "Paymen…". Payments table scrolls sideways with Status off-screen. | The phone is the morning device. | Show amounts; agenda list; bottom tab bar; card rows for Payments. | M

**F9. Revision hygiene.** S2 | `project-changes-requested` *(code)* | `attach()` appends v2 beside v1, so the client sees duplicate tabs "Moodboard.svg" twice. Hero shows only the latest note; Activity omits note text, so round 1 vanishes in round 2. No remove/replace file, no un-submit, no clarifying reply. | The trust moment shows stale files. | Group by version; keep a round timeline with note text; remove until submitted; "Withdraw". | M

**F10. Scale, edge states, wayfinding.** S3 | `today-active`, `calendar`, `plan` *(code)* | Under 3 clients Today flips to cards (no Needs list, no money widget). 10-colour palette, so clients 11-15 repeat, and Tidal/Studio Nine/Greenleaf are near-identical teal-greens at 8. Mini-calendar days look tappable but aren't; "+N more" is plain text. No history API (Back leaves app, no deep links). Plan says "Step 2 of 2" to a returning user, is prefilled with fake "Arjun Rao", validates only on submit with no scroll to error, and discards the draft if "Plan a project" is clicked again. Setup has no payout/GSTIN step; invite copy says "send this link" while "Resend to Karan" implies PayGuard sends. No project total ("₹70,000 of ₹1,20,000 released"). | Orientation and data loss fail once hosted. | One Today layout; logos on calendar chips; routes; draft guard; payout step; "We emailed Arjun" plus copy link; project summary strip. | M

## 5. Nielsen matrix (1-5)
1 Status visibility 3 (reminder, invite delivery invisible) | 2 Real-world match 3 ("secured", "payment" nouns) | 3 Control 2 (no stage edit, un-submit, draft discard) | 4 Consistency 2 (F3) | 5 Error prevention 3 (approve confirm good; fake prefill) | 6 Recognition 4 (rich rows; mobile hides amounts) | 7 Efficiency 3 (inline CTAs; no client reuse) | 8 Minimalism 4 (calm; triple Plan CTA) | 9 Error recovery 3 (decline copy good; rounds dead end) | 10 Help 2 ("(example 5.5%)" in client UI; bucket rules unexplained)

## 6. Rethink / bold bets
1. **Two-axis state model plus "You owe / You're owed" Today.** Replaces five vocabularies; fixes F3, F4, F6.
2. **Client as a first-class object with a project lifecycle** (edit, extend, pause, archive). This is the real 15-client IA.
3. **Close the chase loop** (composer, reminded/snoozed state, nudge history) so Today can reach zero and "stop chasing" is provable.

## 7. Top 5 fixes
1. One state model across every screen (F3).
2. Client object and Plan client picker (F1).
3. Post-invite edits, extra rounds, rounds-exhausted path (F2).
4. Split do/chase, close the reminder loop, per-stage `askedAt` (F4, F5).
5. Consistent money: fee up front, UPI, gross/net rule, Payments buckets and mobile amounts (F6, F7, F8).
