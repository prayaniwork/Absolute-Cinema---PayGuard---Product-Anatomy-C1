# PayGuard — Design Direction (v0.1, pending approval)

One token system, two surfaces. A root attribute `data-surface="studio" | "client"` switches the theme.
Status: **draft for review.** Values are tagged *chosen* (a decision) or *placeholder* (needs real-use check).

## Principle
The freelancer works in a studio, so their side feels like a desk: paper, folder tabs, a pinned calendar. The client is handing over money, so their side feels like a bank statement: plain, exact, quiet. The two meet in shared state names, shared status colors and one shared document, the receipt.

## Tokens shared by both surfaces
| Token | Value | Note |
|---|---|---|
| Type: UI | Plus Jakarta Sans 400/500/600/700 | chosen |
| Type: figures | JetBrains Mono, tabular numerals | all money, IDs, dates in tables |
| Type: annotation | Caveat 600, studio only, max 1 line, ≥ 18px | labels like "pinned", never body copy |
| Type scale | 12 / 14 / 18 / 28 px (plus 40 for one hero amount) | four sizes, no others |
| Spacing | 4px base: 4, 8, 12, 16, 24, 32, 48 | |
| Focus | 2px cobalt ring, 2px offset | both surfaces |
| Motion | 150ms ease-out for state; 600ms once for "Released" stamp (studio only) | honour `prefers-reduced-motion` |

### Semantic status (identical on both surfaces)
| State | Text | Fill | Meaning |
|---|---|---|---|
| Draft | `#52525B` | `#F1F2F4` | defined, not yet funded |
| Funded | `#1D4ED8` | `#E8EFFE` | money committed, work may start |
| In progress / Changes requested | `#9A5B00` | `#FFF1D6` | freelancer has the ball |
| Submitted | `#6D28D9` | `#EFE9FE` | client has the ball |
| Released | `#176B3A` | `#E1F5E8` | approved, original unlocked, receipt issued |
| Blocked / error | `#B42318` | `#FDE8E6` | needs action |

## Studio surface (freelancer)
- Canvas: warm paper `#F6F1E7`, cards `#FFFDF8`, ink `#1B2440`, muted `#5B6275`.
- Accent: cobalt `#1D4ED8`. Milestone folder tabs take the phase tints (peach, sky, lavender, mint) as a 4px top edge and tab fill only, not as text colors.
- Shape: radius 16 on cards, 12 on tabs, pill for status. Shadow: `0 1px 2px rgba(27,36,64,.06), 0 8px 24px -8px rgba(27,36,64,.12)`.
- Texture: a faint dot grid on the canvas only (4% ink), never behind text blocks.
- Handwriting: Caveat for small pinned notes and the project's "next step" sticker. Nothing else.

## Client surface (guest)
- Canvas: `#F7F8FA`, surface `#FFFFFF`, text `#121826`, muted `#5A6272`, hairline `#E3E6EB`.
- Accent: the freelancer's brand color, applied only to the header mark and the primary button. Default cobalt. Status colors above are never overridden by the brand.
- Shape: radius 8, 1px hairlines, no decorative shadow (one `0 1px 2px` allowed on the sticky action bar).
- No Caveat, no tints, no texture, no animation beyond state confirmation.

## Trust rules (client surface, non-negotiable)
1. At every point of action show three things: **how much**, **to whom**, **what it unlocks**.
2. The watermark is visibly applied to the preview; the page says plainly that the original unlocks on release.
3. Approve and Request Changes sit together, equal weight in layout, but Approve is the filled button. Request Changes shows remaining revisions ("1 of 2 left").
4. Fees are itemised before payment, never revealed after.
5. Errors say what happened to the money first ("You have not been charged").
6. Guest access: no account wall; a one-line explanation of why the link is safe.

## Shared document: invoice and receipt
Rendered as a paper document on both surfaces: white sheet, mono figures, perforated edge, a stamp reading RELEASED once paid. This is the one place the studio and client registers overlap.

## Surfaces to prove first (see `design/direction-mock.html`)
1. Studio: project hub with milestone folders.
2. Client: guest review with watermarked preview and approval bar.
3. Client: funding checkout (normal and declined).
4. Shared: invoice and receipt.

## Open items
- Fee split shown in mock (3.5% freelancer / 5.5% client) is a *placeholder* for PRD §9.1.
- Default revision limit of 2 is a *placeholder* for PRD §9.2.
- Contrast of the phase tints and status text needs a measured pass when built.
