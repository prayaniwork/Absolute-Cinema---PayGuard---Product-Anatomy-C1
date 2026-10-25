# PayGuard design system: "Soft Cards" (v1, for approval)

Direction taken from the component reference you shared (the white "Design System" task card): clean white cards with soft shadows, green progress, soft status chips with a small dropdown arrow, avatar pills, and tree-line checklists. The other board images were treated as component and layout references only.

Mocks: `00-design-system.png`, `01-today.png`, `02-client-page.png`, `03-calendar.png`, `04-payments.png`, `05-clients.png`. Source: `ds.css` and `build.py`.

## Fonts
| Use | Font | Weight | Size / line |
|---|---|---|---|
| Greeting, page hero | Inter Tight | 700 | 36 / 42, tracking -2% |
| Money numerals | Inter Tight | 700 | 52 / 56 hero, 32 / 36 large, 22 / 26 medium |
| Page title (h1) | Inter Tight | 700 | 28 / 34 |
| Section title (h2) | Inter Tight | 600 | 20 / 26 |
| Card title (h3) | Inter | 600 | 16 / 22 |
| Body | Inter | 400 | 14 / 20 |
| Secondary text | Inter | 400 | 13 / 18, colour Mute |
| Overline | Inter | 600 | 12 / 16, caps, +8% tracking |
Tabular figures everywhere money appears. Both fonts render ₹ correctly.

## Colour
- Canvas `#F6F6F4`, Surface `#FFFFFF`, Line `#E8E8E5`.
- Ink `#111214`, Ink 2 `#3A3D42`, Mute `#6F7278`.
- Brand blue `#2F5BEA`: actions, focus, "today".
- Progress green `#22C55E`: progress bars and "current week". Received `#157A3E` on `#D6F5DE`.
- Late `#B4233C` on `#FFD9DE`. Waiting `#8A5A00` on `#FFE9B8`. Neutral chip `#5D6066` on `#F0F0EE`.
- Client hues (avatar and calendar block only): lavender, peach, lime, mint, rose, sky. Cards stay white.

## Shape, depth, grid
- Cards 20 px radius, inner wells 14 px, buttons 12 px, chips and avatars fully round, icon box 44 px at 12 px radius.
- Shadow: 1 px hairline plus soft drop (`0 0 0 1px rgba(17,18,20,.05), 0 1px 2px …, 0 12px 28px -14px rgba(17,18,20,.14)`). Cards lift 2 px on hover.
- 12-column grid, 20 px gutter, 16 px page margin, 24 px card padding. Spacing 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48.
- Floating white rail, 76 px wide, 28 px radius. Active item is solid ink.

## Components
- **Buttons:** heights 48 / 40 / 32, 600 weight, 14 px. Primary ink, secondary white with hairline, ghost, highlight (soft green), blue for paying, danger soft red. One primary per card. Secondary actions become square icon buttons with an instant dark tooltip.
- **Chips:** pill, 26 px, soft fill with dark text, optional dot. Status chip can carry a dropdown arrow (30 px, 10 px radius).
- **Tabs / segmented:** 12 px radius track, white active tab with a small shadow.
- **Progress:** 8 px green bar. "3 of 4 · 75%" pill with a 150 px track for card headers. Tick strips for per-row progress.
- **Tree checklist:** curved connector lines, dark filled check circles, open circles for pending.
- **Avatar pills:** avatar plus name in a bordered pill, for people on a deliverable.
- **Inputs:** 44 px, 14 px radius, blue focus ring, red border plus message on error, phone with country dropdown.
- **Charts:** soft grey bars, ink for the hovered bar, green for the current period, tooltip in ink.
- **Motion:** 180 ms hover, 240 ms expand and collapse, money counts up once, respects reduced motion.
