# PayGuard design system v4 ("Soft Cards, blue")

Mocks: `01-today` to `11-client-checkout` PNGs in this folder. Source: `ds.css`, `build.py`.

## Type scale (one scale for every screen)
Font: Inter Tight (display, numerals, headings), Inter (UI). Tabular figures for money.
| Role | Spec |
|---|---|
| Greeting / page hero | Inter Tight 700, 40 / 46, -2.5% |
| Hero number | Inter Tight 700, 44 / 48 (goal card 80 / 84) |
| Page title (h1) | Inter Tight 700, 28 / 34 |
| Section title (h2) | Inter Tight 600, 20 / 26 |
| Card title (h3) | Inter 600, 16 / 24 |
| Row title, body | Inter 600 / 400, 14 / 20 |
| Secondary | Inter 400, 13 / 18, Mute |
| Overline, chart axis | Inter 600 / 400, 12 / 16 |
Nothing smaller than 12.

## Edges and grid
- Cards 12 px radius, inner wells and plan cards 10 px, buttons, inputs and icon buttons 8 px, chips 6 px, avatars circle.
- Every card has a 1 px line (`#E4E7EC`) and a barely visible shadow. No other depth.
- 12-column grid, 20 px gutter, 24 px card padding (20 on compact cards), page margin 16, rail 76 px at 16 px radius.
- All cards in a row share the same top and bottom edges; right-hand column cards stack with the same 20 px gap.

## Colour
Canvas `#F5F6F8`, Surface `#FFFFFF`, Line `#E4E7EC`, Ink `#101828`, Ink 2 `#344054`, Mute `#667085`.
Blue `#2F5BEA` (actions, progress, current period, charts), Blue soft `#EAF0FF`.
Received `#157A3E` on `#D6F5DE`; Late `#B4233C` on `#FFD9DE`; Waiting `#8A5A00` on `#FFE9B8`.
Goal card: navy to blue gradient with violet and teal glows (`#0A1750` to `#1E3FA8`).
Client colour only on avatars; calendar is monochrome.

## Components
Buttons 40 (default), 48, 32; primary = blue, secondary = white with line, ghost, icon = square 8 px. Status chip with optional dropdown arrow. Seg control with white active tab. 6 px blue progress bar, tick strip, "n of m" pill. Line chart with area fill, dashed previous period, tooltip. Tree checklist. Avatar pills. Inputs 40 to 44 px, blue focus ring, red error with message. Plan cards with pie. Inline signature box (Draw / Aa Type). Client side shows the studio, never PayGuard.
