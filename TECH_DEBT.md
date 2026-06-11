# Tech Debt: UI and Layout

**Source:** Site-wide design review, 2026-06-11
**Status legend:** OPEN = not started, FIXED = done with date

| # | Item | Severity | Status |
|---|------|----------|--------|
| 1 | Inner pages pay full header tax | High | FIXED 2026-06-11 |
| 2 | Pixel font used for long-form prose | - | CLOSED 2026-06-11, decision: pixel font everywhere is deliberate |
| 3 | Accent colors have no assigned roles | Medium | FIXED 2026-06-11, partial by owner choice |
| 4 | No global motion policy | Medium | FIXED 2026-06-11 |
| 5 | Sidebar identical on every page | - | CLOSED 2026-06-11, decision: deliberate identity |
| 6 | Mobile nav takes four rows | Low | FIXED 2026-06-11 |
| 7 | Scroll-jump buttons overlapped content on mobile | High | FIXED 2026-06-11 |
| 8 | Quote box polish backlog | Low | OPEN |

---

## 1. Inner pages pay full header tax (FIXED 2026-06-11)

- Marquee + banner + title + tagline + nav consumed ~40% of a desktop viewport before content began, on every page.
- Fix: `body` gets `is-home` or `is-inner` class from `navActive` in `base.njk`. CSS in `style.css` collapses `.marquee-bar`, `.site-title`, `.site-subtitle` on inner pages via an animated max-height/opacity/padding transition (0.35s ease), so PJAX navigation slides the header instead of snapping it. Banner and nav stay everywhere.
- `page-transitions.js` syncs `document.body.className` from the fetched page so PJAX navigation flips the header correctly.
- Transitions are disabled under `prefers-reduced-motion: reduce` (instant swap is the accessible behavior there).
- To re-enable the marquee on inner pages, remove `.marquee-bar` from the `body.is-inner` rule.
- Follow-up (same day): inner-to-inner navigation was also abrupt because the PJAX swap replaced `.main-content` in one frame. `page-transitions.js` now crossfades (180ms out, swap while invisible, 180ms in), scrolls to top during the invisible window on forward navigation, and `html { scrollbar-gutter: stable }` stops the width jolt when the scrollbar appears or disappears. Rapid clicks are guarded by a navigation token; the latest click wins.

## 2. Pixel font used for long-form prose (CLOSED 2026-06-11)

- A readable prose font was implemented, reviewed, and rejected. Decision: the all-pixel typography is part of the site's identity and stays, accepting the readability cost on long passages. Do not re-raise without new evidence (e.g. reader complaints).

## 3. Accent colors have no assigned roles (DOCUMENTED 2026-06-11)

- The role map is documented at the top of `style.css` above `:root`, as guidance for new styles: cyan = structure, gold = identity/highlights, pink = interaction, lime = signals and tags, red = warnings only.
- Audit findings (computed styles, not eyeballed): the original claim that About mixes heading colors was wrong; all its headings are cyan. Exactly two existing violations were found:
  - `.post-opener` on Home renders a motivational quote in red (#ff5c5c), the only red on the site, conventionally an error/danger signal.
  - `.tracker-beacon-tag` on Roadmap uses gold chips while every other topic chip site-wide (`.tag`) is lime.
- Owner decisions after visual review: the Home quote fix is in (now gold with a soft glow, red freed up for real warnings). The Roadmap beacon chips stay gold deliberately; the owner prefers gold there, so gold chips on the beacon are an accepted exception to the lime tag rule.

## 4. No global motion policy (FIXED 2026-06-11)

- The full audit found ten infinite animations in style.css, not four: stars twinkle, marquee scroll, title glow, music title scroll, playing-button glow, footer rainbow, blink class, warp zone glow, tracker beacon border, and LIVE dot.
- Fix: one `@media (prefers-reduced-motion: reduce)` block at the end of style.css sets `animation: none` on all ten. Page-local CSS (games, 36ke, taothao) already had its own reduce blocks.
- Zero change for normal visitors, verified both ways in the browser: a reduced-motion context computes `animationName: none` everywhere; a default context still runs twinkle, marquee, glow-pulse, and rainbow.
- Frozen states remain informative: marquee text sits readable, the playing button keeps its pink border, the LIVE dot stays lit.

## 5. Sidebar identical on every page (CLOSED 2026-06-11)

- Profile, Now Playing, Stats, Hangouts repeat on all ten pages, costing about a quarter of the content grid.
- Owner decision: this is deliberate GeoCities-style identity and stays as is. The consistent sidebar is part of the site's character, not an oversight. Do not re-raise.

## 6. Mobile nav takes four rows (FIXED 2026-06-11)

- Measured baseline at 375x760: nav block 216px tall, first post started at y=586, Warp Zone above all content.
- Fix, all inside a `@media (max-width: 560px)` block so desktop is untouched:
  - Nav links: font 21px to 17px, tighter padding and gap.
  - Removed the invisible reserved space for the `>>` hover arrow on touch widths (it was `opacity: 0`, still costing ~25px per link; hover does not exist on touch).
  - On Home only (`body.is-home`), flex `order` moves the Warp Zone below the first post so content leads.
- Measured after: nav 110px (two rows), first post starts at y=348. The full first post including tags fits in the first screenful. Games page element order verified unaffected.
- All nav items remain visible; the scroll-snap chip row option was rejected for hiding links off-screen.

## 7. Scroll-jump buttons overlapped content on mobile (FIXED 2026-06-11)

- At <=800px the fixed scroll buttons sat at `bottom: +100px`, floating mid-screen over interactive content (covered the quote box NEXT indicator).
- Fix: tucked to bottom corner (`bottom: +12px`), shrunk to 36px. Nothing else occupies the bottom edge.

## 8. Quote box polish backlog (games page)

- Short quotes leave the box two-thirds empty; min-height is sized for the longest quote. Consider min-height matched to the 84px portrait, letting the box grow.
- The hint line under the box is documentation for a one-click interaction. Consider deleting it or replacing with a console-style prompt in the footer.
- Typewriter replays on every PJAX revisit (2 to 4 seconds before readable). Consider sessionStorage to animate once per session, and ~22ms per character instead of 30ms.
- Component uses four accent colors (cyan border, gold frame, lime NEXT, pink hover). Consider holding to two.
