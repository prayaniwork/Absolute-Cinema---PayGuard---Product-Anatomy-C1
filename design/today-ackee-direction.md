# Today screen: an Ackee-style direction (plan only, nothing built)

Status: **plan for approval.** No code has been changed for this.

## Reference we are keeping

Ackee (self-hosted analytics, MIT licence), pinned to one commit so the reference never moves under us:

```bash
git -c core.hooksPath=/dev/null clone --no-checkout -- 'https://github.com/electerious/Ackee' 'ackee' && git -C 'ackee' -c core.hooksPath=/dev/null checkout --detach 'c9fe8f889e4f3264e39cdf2343e12b465aa29446'
```

We use it as **inspiration for structure and behaviour**, not code. It is React + SCSS + GraphQL; our prototype is vanilla JS. Nothing is copied, so the licence is not a concern. The clone was only read, never run.

## What Ackee actually does (from reading the source)

1. **A facts strip first.** One rounded block, a grid of equal tiles separated by 1px gaps (`_facts.scss`). Each tile: small headline, one big number with a small unit ("per day", "views"), and a small badge at the right. 3 columns, then 2, then 1 on small screens.
2. **Two kinds of badge.** A change badge (up or down arrow plus a percentage, with a plain-English tooltip: "a 12% increase when comparing the last 7 days with the previous 7 days") and a "Live" badge for real-time data.
3. **Wide cards under it.** Each card has a clickable headline that drills into a full page ("More"), a one-line status under the headline, then a bar chart or a ranked list. Charts show 14 days. Hovering a bar writes its value into the status line instead of floating a tooltip.
4. **Status line that is always honest.** The same slot says "Loading", "Updating", "No data", or the hovered value. "No data" has a tooltip saying why. The card height never jumps because the slot reserves space.
5. **Overview versus one site.** The home page merges all sites. Opening a site shows the same layout filtered to it.
6. **Keyboard shortcuts** to jump between views (o, v, p, r) with small key hints.

## What to borrow, and what not to

The Today page we approved is **action first**: a To do list, payment status, Coming up. Ackee is **reading first**: numbers and charts, nothing to do. Dropping the action list would be a regression for Meera, so this plan keeps the list as the hero and uses Ackee's ideas for everything around it.

| Borrow | Leave |
|---|---|
| Facts strip with big number, unit, change badge | The dark teal gradient skin. We stay on the zinc, Geist system |
| Clickable card headline that opens the full page | GraphQL and polling. We read from local data |
| Status line that doubles as the hover readout | Per-site merging. Our Clients page already does this |
| Same-height cards that never jump | Analytics wording (views, referrers) |
| Honest empty and updating states with a reason | |
| Key hints and shortcuts | |

## Proposed Today layout

```
Hey Meera, it's Sunday. (greeting stays)

[ Received ] [ Pending ] [ Late ] [ Avg days to get paid ]     <- facts strip, 4 tiles
 ₹2,43,000    ₹7,57,000   ₹62,000   9 days
 +12% badge   Live badge  2 clients  -3 days badge

┌ To do (7) ───────────────────────────┐ ┌ Earned per week ─────────┐
│ list, as built today                  │ │ 12 bars, hover = value   │
│ ...                                   │ │ status line under title  │
│ Show all 7  ->  Clients               │ │ More ->  Payments        │
└───────────────────────────────────────┘ └──────────────────────────┘
┌ Coming up (4) ───────────────────────────────────────────────────┐
│ list, next 2 days + late, More -> Calendar                        │
└───────────────────────────────────────────────────────────────────┘
```

Changes from today's screen:

- The **Payment status** panel (two numbers plus the mascot) is replaced by the **facts strip** across the top. The mascot moves into the **Received** tile as the small Easter egg (grows with the amount), so the delight is kept without a big empty box.
- A new **Earned per week** bar chart card beside To do. Hover a bar and the status line reads "Week of 12 Oct: ₹58,000".
- Every card headline is a link: To do goes to Clients, Earned goes to Payments, Coming up goes to Calendar.
- To do stays a plain list (your earlier instruction). It is not turned into a table or chart.

## The four tiles, and where each number comes from

All of these come from data we already hold on each deliverable and payment. Nothing new needs to be asked of the user.

| Tile | Big number | Unit / badge | Source |
|---|---|---|---|
| Received | Money in your account | change badge: this month versus last month | sum of paid deliverables and advances, grouped by `releasedAt` and `advanceAt` |
| Pending | Approved or still in progress | "Live" badge when anything is awaiting payment | existing `moneyNow().pend` |
| Late | Money past its due date | "2 clients" | deliverables where `fundLate()` is true |
| Avg days to get paid | mean of (paid date minus approved date) | change badge versus the previous 30 days | `approvedAt` to `releasedAt` |

If we want a fifth later: "Deliverables due this week" (count), or "Rounds of changes per deliverable" (average).

## Building blocks to add

Reusable pieces in the prototype, named so they do not clash with existing classes (we have been bitten by that twice):

- `factTile` (headline, value, unit, badge)
- `chgBadge` (arrow plus percent, tooltip sentence, green when better, amber when worse; for "days to get paid", down is good, so direction is per tile)
- `liveBadge`
- `statCard` (headline link, status line, body, optional footer link). We already have a `statCard` helper that is unused after the Payments rewrite; it will be replaced, not extended.
- `barChart` (CSS bars, 12 columns, hover and focus write to the status line, bars are focusable buttons)
- `statusLine` (reserved height, states: updating, no data with reason, hover value)

## States (the part Ackee does well)

| State | What shows |
|---|---|
| First day, no projects | Today's existing empty state, unchanged |
| Projects but nothing paid yet | Received tile shows ₹0 with "Nothing received yet"; chart status says "No payments yet" with a tooltip: "Payments appear here once a client pays." |
| One payment only | Chart draws one bar; change badge hidden (no previous period to compare) |
| Everything caught up | To do shows the existing "You're all caught up" |
| Updating | Short "Updating" in the status line after Mark as paid, then the new value |

## Mobile

- Facts strip: 2 columns, then 1 on small phones.
- Earned chart moves under To do and shows 8 bars, scrolls sideways beyond that.
- To do and Coming up keep the "Show all N" collapse we already added.

## Accessibility

- Bars are buttons with `aria-label="Week of 12 Oct, ₹58,000"`; the status line is `aria-live="polite"`.
- A visually hidden table carries the same numbers for screen readers.
- Change badges never rely on colour alone (arrow plus sentence in the tooltip and label).

## Phases

1. **Facts strip** and badges (tiles, derived numbers, mascot moves into Received). About half a day.
2. **Earned per week** chart with status-line hover. About half a day.
3. **Drill-down links** and the status line states. Short.
4. **Mobile and keyboard** pass: shortcuts `t`, `c`, `p` with key hints (Cmd+K stays removed). Short.
5. Regression: re-run the create, sign, pay, approve, unlock flow and confirm the tiles update after each step.

## Risks and calls for you

1. **Is this too analytical for the Today page?** Meera's job here is "what do I do now". The facts strip is glanceable, but if it competes with To do, we can collapse it to two tiles (Received and Late) and drop the chart.
2. **The earlier decision "just a list, no capsules, no big numbers box" for Payment status.** This plan brings big numbers back as tiles. That is a reversal of your feedback on the mocks, so please confirm before anything is built.
3. **Sample data has little history.** The chart needs several weeks of paid dates to look alive. We would seed 8 to 10 weeks of sample payments so the demo is not empty.
4. **Change badges need a previous period.** For a new freelancer they are hidden rather than showing a misleading 0%.

## Decisions I need from you

1. Facts strip with four tiles, or the lighter two-tile version?
2. Keep the To do list as the hero on the left, with the chart beside it? (recommended)
3. Is it fine to move the mascot into the Received tile, so the big empty mascot box goes away?
4. Should the chart show weeks or months by default?
5. Any shortcut keys, or leave keyboard shortcuts out entirely since we removed Cmd+K?

Once these are answered, phase 1 can start.
