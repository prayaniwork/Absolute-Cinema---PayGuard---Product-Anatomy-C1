# PayGuard flow and state model: the "unlock" model

Status: proposal for discussion. Base: `index(Mohith Version).html` (pay-first today; this redraws its spine).
Decisions already made: mixed creatives; freelancer chooses the unlock rule per project; pricing later; originals stored by PayGuard (capped, expiring after unlock).

## 1. The idea in one line
PayGuard holds **files, not money**. The client sees previews, approves, pays, and the originals unlock the moment payment lands. Nothing is paid before the client has seen the work (unless the freelancer asks for a deposit).

## 2. Words (one word per concept)
| Use | Don't use |
|---|---|
| **Stage** (a chunk of work with its own scope, price and date) | milestone, phase |
| **Preview** (reduced, watermarked copy the client can review) | proof, draft |
| **Originals** (the real files, locked until paid) | source, raw, final files |
| **Approve** (the client accepts the previews) | sign off |
| **Pay** / **Paid** | fund, secured, released |
| **Unlock** (originals become downloadable) | release |
| **Deposit** (optional advance, paid straight to the freelancer, not held) | advance, escrow |
| **Awaiting payment** (approved, originals still locked) | overdue (unless past the pay-by date) |

## 3. The unlock rule (the freelancer's choice per project)
Two settings, not a menu of models:
1. **Deposit**: none, or 10 to 50% paid before work starts.
2. **Unlock scope**: **per stage** (each stage is approved, paid and unlocked separately) or **whole project** (everything unlocks once all stages are approved and the remainder is paid).

Default: no deposit, whole project for short jobs (1 to 2 stages), per stage for 3+ stages.
Always shown to the client on the invite as a plain sentence: *"You'll review previews, approve, then pay ₹40,000 to unlock the original files."*

## 4. Stage lifecycle
One ladder, plus a derived "whose turn".

| # | Stage state | Whose turn | What is true | Originals |
|---|---|---|---|---|
| 0 | **Deposit due** (project level, only if a deposit is set) | Client | Work hasn't started | none yet |
| 1 | **In progress** | You | Stage is open; freelancer uploads originals; previews auto-generate | locked |
| 2 | **In review** | Client | Previews submitted; reply-by date set | locked |
| 3 | **Changes requested** (round r of N) | You | Client's note attached; rounds limited | locked |
| 4 | **Approved, awaiting payment** | Client | Approval is bound to the exact file versions; pay-by date shown; price frozen | locked |
| 5 | **Unlocked** | Done | Paid; originals downloadable; documents issued | **open** |
| x | **On hold** (a problem was reported) | You respond | Reply-by and pay-by clocks pause | locked |
| x | **Closed unpaid** | Done | Freelancer cancelled after the pay-by date plus grace; originals stay locked and expire | locked, then deleted |

Late is a chip, never a state: *"late 3d"* on In progress (past delivery date), In review (past reply-by), Awaiting payment (past pay-by), Deposit due.

```
Deposit due ─pay─▶ In progress ─submit─▶ In review ─approve─▶ Approved, awaiting payment ─pay─▶ UNLOCKED
                       ▲                      │  ▲ silence (optional auto-approve)┘                │
                       └──── Changes ◀────────┘                                                    ▼
                          requested (r of N)                                        documents + payout (money axis)
     any state ──report a problem──▶ On hold ──reply / resolve──▶ back to the previous state
```

Payment never moves anything backwards. Because nothing is paid until after approval, **the stage refund path disappears.** Only a deposit can be refunded, and that is between the freelancer and the client under the freelancer's stated rule.

## 5. Money axis (separate, only for the freelancer's Payments view)
Where the state ladder says what happened to the work, this says where the rupees are.

| Money state | Meaning |
|---|---|
| **Not yet payable** | Stage not approved |
| **Awaiting payment** | Approved; originals locked until paid |
| **Paid** | Client paid; originals unlocked |
| **Payout on its way** | Paid, being sent to the freelancer's account (timing placeholder) |
| **Paid out** | In the freelancer's account |
| **Paid another way** | Freelancer confirmed bank transfer or cash; originals unlocked |

Payments tiles become: **Locked and approved** (₹ waiting on clients to pay, the leverage number), **In review** (not yet payable), **Paid, payout pending**, **Paid out**. The headline money line on Today becomes *"₹1,65,000 approved and waiting for payment."*

## 6. Rules of this project (one object, shown everywhere)
Set once in Plan, shown on the invite, the review page and every reminder:
- Reply within **N days**; if there is no reply, **optional auto-approve** after M more days (safe now: approving only moves it to Awaiting payment, nothing unlocks without payment).
- Pay within **N days** of approval.
- **Rounds** of changes included; extra rounds available at the set price.
- Deposit and its refund rule, in one sentence the freelancer writes or picks.
- Who pays PayGuard's fee (me / split / client): kept from Mohith's version; pricing discussion later.

## 7. The flow, each role

**Freelancer**
1. Plan: per stage: name, **what it includes** (scope list), price, delivery date. Then unlock rule, rules, fee payer.
2. Send the link (WhatsApp, email, copy).
3. [Deposit paid] → stage **In progress**.
4. Upload originals → previews are made automatically; a per-file note says how strong the lock is (*"Preview is reduced size"* vs *"Preview shows the full work; a screenshot can capture it"*).
5. Submit for review → client reviews.
6. Changes? Upload the next version; the old one is kept in the round history.
7. Approved → **Awaiting payment**; PayGuard sends the reminders; "Mark as paid another way" is always available.
8. Paid → **Unlocked**; documents issued.

**Client (guest, no account)**
1. Invite: stages with what each includes, the unlock rule sentence, the rules card, the deposit if any. Studio name and logo first; PayGuard named once, as the tool.
2. [Pay deposit.]
3. Review: previews plus a manifest ("4 files · 1.2 GB originals · locked until you pay"). Actions: **Approve**, **Ask for changes**, **Report a problem**.
4. Approve confirms the exact files (*"Approve these 4 files, version 2?"*).
5. Pay: amount, fee line per who pays, UPI or card.
6. Unlock: download originals, documents, a quiet celebration.

## 8. What changes in Mohith's code
| Today (pay-first) | Becomes |
|---|---|
| `draft` "Not funded" | `deposit` (only if a deposit is set) or `progress` |
| `funded` | `progress` ("In progress") |
| `submitted` "In review" | `review` |
| `changes` | `changes` (unchanged) |
| `released` "Approved" | split into `approved` (awaiting payment) and `unlocked` |
| `dispute` "On hold" | `hold` (pauses clocks; no stage refund) |
| `refunded` | removed for stages; deposit refund only |
| `doFund` at checkout | `doDeposit` (optional) and `doPay` after approval |
| `doApprove` releases money | `doApprove` only moves to `approved`; `doPay` unlocks |
| `sweepAuto` auto-releases money | auto-approves only; never unlocks |
| `attentionFor` kinds: fund, deliver, approve, changes, dispute, invite | `deposit`, `deliver`, `approve`, `changes`, `hold`, `pay`, `invite` |
| Client checkout before work | Client pay screen after approval |
| `payState` money words | money axis above |

Kept as is: per-stage scope lists, rounds and `doExtra`, WhatsApp reminder text, fee payer modes, auto-approve setting, the Frappe-style list layout and tokens, funding clock per stage (becomes the pay-by clock).

## 9. Edge cases and the rule for each
| Case | Rule |
|---|---|
| Client approves, never pays | Reminders on a cadence; "late Nd" chip; freelancer can extend, mark paid another way, or close unpaid. Originals stay locked, so exposure is time, not files |
| Client silent after submit | Reminder cadence, then (if enabled) auto-approve, which only starts the pay clock |
| Wrong files uploaded | Freelancer can withdraw until the client first opens the previews; afterwards upload a new version, which needs a fresh approval |
| Changes beyond the rounds | Extra round at the stage's set price (Mohith's `doExtra`), or hold and talk |
| Client reports a problem | On hold; clocks pause; freelancer replies; either continues or closes |
| Partial or pending payment (UPI timeout) | Not unlocked until the full amount is confirmed; the page says "Confirming with your bank. Don't pay again." |
| Bank transfer or PO terms | "I've paid another way" by the client, **confirmed by the freelancer**, then unlock |
| Link forwarded | Later: one-time code to the invited email or phone at Approve and Pay |
| Freelancer disappears after approval | Paid stages unlock automatically with no freelancer action; unpaid stages stay locked until the freelancer returns or retention ends |
| Storage cap reached | Upload blocked with a plain explanation and the cap |
| Preview too weak a lock (text, code, a logo) | Per-file strength note for the freelancer; honest copy, never "protected" |
| Chargeback after unlock | Freelancer's risk, stated in the terms (needs legal review) |

## 10. What this resolves from the review
- Escrow language and custody: gone. The only promise is "originals unlock when payment is confirmed".
- Refund machinery for stages: gone. Only deposits.
- Prepay as the weakest assumption: the default needs no prepay.
- Five status vocabularies: replaced by one ladder plus a money axis plus a lateness chip.
- "Overdue" invented from nothing: replaced by a visible pay-by date the client saw on approval.
- Client price shock: disappears when the fee is the freelancer's (or split, shown on the invite).
- Silence rule: safe to automate.

## 11. Open decisions
1. Confirm the base: Mohith's version.
2. "Stage" or "milestone" as the word.
3. Defaults for reply window, pay-by window, auto-approve (suggest 3 days, 7 days, on).
4. Whether originals' expiry after unlock is 60 or 90 days.
5. Whether the freelancer can see the client's preview views (opened, last seen) in v1.
