# Tech Debt: UI and Layout

**Source:** Site-wide design review, 2026-06-11
**Status legend:** OPEN = not started, FIXED = done with date

| # | Item | Severity | Status |
|---|------|----------|--------|
| 1 | Inner pages pay full header tax | High | FIXED 2026-06-11 |
| 2 | Pixel font used for long-form prose | - | CLOSED 2026-06-11, decision: pixel font everywhere is deliberate |
| 3 | Accent colors have no assigned roles | Medium | FIXED 2026-06-11, partial by owner choice |
| 4 | No global motion policy | Medium | OPEN |
| 5 | Sidebar identical on every page | Medium | OPEN |
| 6 | Mobile nav takes four rows | Low | OPEN |
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

## 4. No global motion policy

- Marquee, twinkling stars, rainbow footer icons, and the quote box typewriter all animate permanently. Only the quote box respects `prefers-reduced-motion`.
- Plan: one site-wide `@media (prefers-reduced-motion: reduce)` block in style.css that stops the marquee scroll, star twinkle, and rainbow cycle.

## 5. Sidebar identical on every page

- Profile, Now Playing, Stats, Hangouts repeat on all ten pages. Costs about a quarter of the content grid while adding nothing after the first page.
- Options, pick one consciously:
  - Contextual sidebar: Books shows currently reading, Games shows now playing.
  - Slim sidebar on inner pages: profile and music player only.
  - Accept as deliberate GeoCities identity and close this item.

## 6. Mobile nav takes four rows

- On a 375px screen, nav plus the Warp Zone banner pushes all content below the fold.
- Options: tighter padding (three rows), or a horizontal scroll-snap chip row (one row, items hidden off-screen).

## 7. Scroll-jump buttons overlapped content on mobile (FIXED 2026-06-11)

- At <=800px the fixed scroll buttons sat at `bottom: +100px`, floating mid-screen over interactive content (covered the quote box NEXT indicator).
- Fix: tucked to bottom corner (`bottom: +12px`), shrunk to 36px. Nothing else occupies the bottom edge.

## 8. Quote box polish backlog (games page)

- Short quotes leave the box two-thirds empty; min-height is sized for the longest quote. Consider min-height matched to the 84px portrait, letting the box grow.
- The hint line under the box is documentation for a one-click interaction. Consider deleting it or replacing with a console-style prompt in the footer.
- Typewriter replays on every PJAX revisit (2 to 4 seconds before readable). Consider sessionStorage to animate once per session, and ~22ms per character instead of 30ms.
- Component uses four accent colors (cyan border, gold frame, lime NEXT, pink hover). Consider holding to two.
