# PayGuard heuristic review: shared brief (read fully before starting)

## What you are reviewing
PayGuard is a **freelancer-first client operations workspace** for *established* freelancers managing roughly 5-15+ clients (India-first: INR, GST, UPI/card). Promise: "Run your freelance business like a business. Every client, project, approval and payment in one calm place, so you stop chasing people on WhatsApp."
Core loop per project (milestones, freelancer-defined, flexible): client funds a stage -> freelancer uploads work (client sees a watermarked, view-only preview) -> client approves or asks for changes (limited rounds) -> payment released -> payment summary + freelancer invoice + separate PayGuard fee document.
Clients are **guests**: they open a link, no account, no password.
It is a **single-file working HTML prototype** (vanilla JS, localStorage, sample data). No backend. A hosted web product comes later. The business goal of this review: find everything that will stop a freelancer with 15 clients from opening this every morning and knowing what to do in under 10 seconds, and everything that will make a client hesitate to pay.

## Evidence you have (use it; do not review from imagination)
Screenshots (PNG, real renders): `/private/tmp/claude-501/-Users-prayanipohekar-PayGuard/0c1b16e5-daec-4bf2-ba12-8af5d6437fca/scratchpad/review/shots/`
Desktop 1360px wide unless prefixed `m-` (390px phone). Read them with the Read tool (images display). Date in the shots is 14 Oct 2026; sample dates are relative to today.
- `landing-top`, `landing-full`: public landing page. `setup`: step 1 of onboarding (studio details + terms). `first-day`: Today for a brand-new account (0 clients). `plan`: "Plan a project" form (stages, amounts, dates, client color/logo, terms).
- `today-active`, `today-waiting-open`: the command centre with 8 sample clients (Needs you today / Waiting on clients / calendar / expected money).
- `clients` (filter table), `calendar` (month view, color per client), `payments` (3 tiles + filter table of every stage).
- `project-awaiting-approval`, `project-overdue-funding`, `project-funded-upload`, `project-changes-requested`, `project-complete`: the freelancer's project workspace in five different states. `documents-modal`: payment summary / invoice / PayGuard fee tabs.
- Client (guest) side: `client-invite` (first visit), `client-checkout`, `client-review` (watermarked preview + approve/ask for changes), `client-changes-dialog` (feedback note with an AI-style tidy-up bar), `client-approve-dialog`, `client-released` (celebration).
- Phone: `m-landing`, `m-today`, `m-clients`, `m-payments`, `m-project`, `m-client-review`, `m-checkout`.
Source (read selectively with Grep/Read; app.js is ~120 KB, head.html holds all CSS): `/Users/prayanipohekar/PayGuard/prototype/app.js` (all logic and every piece of copy), `/Users/prayanipohekar/PayGuard/prototype/head.html` (CSS tokens, components, motion). Product requirements: `/Users/prayanipohekar/PayGuard/PRD.md`.
Ignore the black "View as / Account / Restart" pill at the bottom of every screen: it is prototype scaffolding, not product UI. Ignore the sample data being invented.
Motion, hover states and the interactive behaviour can only be judged from code (CSS keyframes/transitions in head.html, handlers in app.js); say when you are inferring from code rather than seeing it.

## Decisions already made by the product owner (respect them, but you may challenge any of them, say so explicitly if you do)
One professional tonality for both freelancer and client. shadcn/Apple-clean UI, Geist fonts, black primary buttons, blue accent, blue hard offset shadow (no blur) on button hover. A blue line-illustration mascot ("PayGuard buddy") used only for emotional moments (onboarding, success, empty, error), never beside every card. Each client has a color and optional logo. No client accounts, no escrow-style claims. Flexible milestone templates (one payment / half and half / three stages / add a stage). Revision rounds with a limit, no dispute system. Three separate payment documents. "Overdue" is shown in soft orange, not red.

## Your job
Act as the senior person described in your persona prompt. Run a rigorous **heuristic evaluation of the whole product** through your lens: UX and UI, what is good, what is bad, what is missing, what does not work, what needs rethinking, and how the visuals could be better. Be specific and opinionated. Cite the screen (file name) and the exact element or copy for every finding. No generic advice, no flattery, no padding. If you disagree with a locked decision, say why. Use established heuristics where they help (Nielsen's 10, cognitive load, Gestalt, WCAG 2.2, fintech trust patterns), but evidence beats framework-name-dropping.

## Rules
- Do NOT use any browser tool, browser pane, MCP browser, or start any server (the product owner is using the browser). Screenshots + code only. You may run headless Chrome yourself for extra states by copying `scratchpad/review/shoot.py` into your own folder and adding scenarios, only if you genuinely need it.
- Do NOT edit any prototype file. Write only to `scratchpad/review/findings/<your-slug>.md`.
- Keep the file under ~1,600 words, dense and scannable.

## Required structure of your findings file
1. **Verdict** (max 4 lines) + a score out of 10 for each: first-glance clarity, task efficiency, trust, visual polish, consistency, mobile, accessibility (adapt to your lens; score only what you can judge).
2. **What is working: keep it** (bullets, specific).
3. **Findings**: numbered F1..Fn. Each: `Severity` (S1 blocks adoption / S2 major / S3 moderate / S4 polish) | `Screen(s)` | `Evidence` (what you saw, quote the copy or element) | `Why it matters` | `Recommendation` (concrete: what to change, to what) | `Effort` (S/M/L).
4. **Rethink / bold bets** (max 3): things worth redesigning rather than polishing.
5. **Your top 5 fixes, in order.**

Your final chat reply (what the orchestrator reads) must be: the path of your file, your verdict line + scores, and your top 5 fixes with one line each. Max 300 words.
