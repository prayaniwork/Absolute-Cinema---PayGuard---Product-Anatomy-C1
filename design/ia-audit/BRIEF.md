# Information architecture audit: brief for every reviewer

## What PayGuard is (one paragraph)
PayGuard is a workspace for freelance designers in India who have 5 to 15 clients. The freelancer plans a project in stages, both sides sign a contract, the client reviews watermarked previews, approves, and pays the freelancer **directly** (UPI, QR code or card). PayGuard holds no money and charges no fee (beta). The original files unlock when the balance is paid (the freelancer can also unlock early). The client never makes an account: they get a link. The client side shows the freelancer's studio name, not PayGuard.

## Why this audit exists
In a user test the biggest finding was: **the information architecture is not good.** People got confused, and a lot of the copy was confusing. The owner (Prayani) wants to understand, screen by screen, what is wrong, in plain language, and what the right structure is, before any more building.

Things already heard in that session (use them, do not repeat them as news):
- Waiting for the client's signature should be a first-class, obvious first step, not a small pill on stage 1.
- Stages on the project page should feel like a stepper / clear path. Files and links should live inside a stage.
- Too much information appears at once (plan page, contract page, project page). Too many tabs and repeated information ("it just shows the same details again and again").
- Money words confuse: "Paid to you", "In process", "Awaiting payment" mean different things to different people.
- Contract setup mixes required and optional things.
- Calendar: one person wanted colour coding, another wanted a simple single-colour view (unresolved).
- Calendar, collaborators (a client's developer or copywriter), link password and data retention were discussed but are undecided.

## Your job
You own 2 to 4 screens. For each screen, think like a product designer who is explaining things to a complete beginner.

For **each screen** write a section with exactly these headings:

1. **The job of this page** — one sentence: who is here, when, and what must they be able to do in under 10 seconds. Then 2 to 3 smaller jobs, in order of importance.
2. **What is on the page today** — a short inventory by area (top, left, right, middle, bottom, popups). Quote the exact words you see. Note how many different things compete for attention.
3. **What is going wrong** — a numbered list. For each problem: what you see, why a beginner gets confused, and how bad it is (Big / Medium / Small). Cover: things shown that this page does not need, things this page needs but hides, the same information shown twice, words that mean two things, buttons whose result is unclear, wrong order of information, anything about the other person's view leaking in, anything that contradicts the product rules above (for example showing "PayGuard" to a client).
4. **What the page should look like (information architecture)** — the ideal structure, top to bottom, with a one-line reason for each block. Say what to **keep**, **move** (and where), **remove**, and **merge**. Give a plain text sketch of the layout. Say what is visible by default and what hides behind a click.
5. **Copy fixes** — a table: Where | Now | Better | Why. Use short, everyday words. No jargon.
6. **Questions for the owner** — only things you truly cannot decide yourself. Say what you would pick and why.
7. **Related screens** — how this page connects to the one before and after it (what the user expects to see next).

End the file with a short **"Top 5 things to fix on these screens"** list, ranked.

## Rules
- Write for a beginner. Short sentences. No design jargon (if you must use a term like "information architecture", explain it in the same sentence). Examples beat theory.
- Be specific and honest. Point at real things on the screen. Do not praise for the sake of it, but do name what already works so we keep it.
- Look at the screenshots AND read the code. The screenshots are in `design/ia-audit/shots/` (open them with the Read tool; they are 1360 px wide unless the name starts with `m`, which is phone width). The code is `prototype/nazar/app.js` (screens are string templates in functions; find them by the names given in your assignment) and `prototype/nazar/head.html` (styles). Some screenshots catch an animation half-way; trust the code for exact copy.
- Do NOT edit any file except your own report. Do NOT use the browser tools or start servers (another process is using them). Do not run the app.
- Other reviewers are covering the other screens at the same time. Stay inside your screens, but mention connections.
- Words to use consistently in your suggestions: **stage** (not milestone), **preview** (watermarked copy), **originals** (the real files), **approve**, **pay**, **unlock**, **advance** (optional upfront payment paid straight to the freelancer), **contract**. Suggest a better word only if you can explain why.
- Length: as long as it needs to be to be useful, but easy to scan. Use headings, short bullets, tables for copy.
- Save your report to the exact path in your assignment. When finished, reply with just: the path, and your 5 top findings in one line each.

## Useful background files (read only if you need them)
- `design/flow-state-model.md` — the unlock model, stage states, decisions made.
- `design/copy-review.md` — earlier copy decisions.
- `design/heuristic-review/README.md` — an earlier simulated expert review (not user evidence).
