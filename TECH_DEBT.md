# Tech Debt: UI and Layout

**Source:** Site-wide design review, 2026-06-11
**Status legend:** OPEN = not started, FIXED = done with date, CLOSED = decided not to do, with date

| # | Item | Severity | Status |
|---|------|----------|--------|
| 1 | Inner pages pay full header tax | High | FIXED 2026-06-11 |
| 2 | Pixel font used for long-form prose | - | CLOSED 2026-06-11, decision: pixel font everywhere is deliberate |
| 3 | Accent colors have no assigned roles | Medium | FIXED 2026-06-11, partial by owner choice |
| 4 | No global motion policy | Medium | FIXED 2026-06-11 |
| 5 | Sidebar identical on every page | - | CLOSED 2026-06-11, decision: deliberate identity |
| 6 | Mobile nav takes four rows | Low | FIXED 2026-06-11 |
| 7 | Scroll-jump buttons overlapped content on mobile | High | FIXED 2026-06-11 |
| 8 | Quote box polish backlog | Low | FIXED 2026-06-11 |
| 9 | Link previews: og:image too small for chat apps | Medium | FIXED 2026-06-11 |
| 10 | Audio policy in .gitignore was never implemented | Low | FIXED 2026-06-12 |
| 11 | Stray working file Kayle.jpg tracked at repo root | Low | FIXED 2026-06-12 |
| 12 | Flat-URL layout is an unstated invariant | Medium | OPEN |
| 13 | Posts have no individual URLs and no RSS feed | Low | OPEN |
| 14 | No build check before merge; breakage found at deploy | Low | CLOSED 2026-06-18, decision: not needed |
| 15 | Oversized sidebar avatar shipped at source resolution | Low | OPEN |

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

## 8. Quote box polish backlog (FIXED 2026-06-11)

All four backlog items addressed in `games.njk` and `games.css`:

- Min-height: `.dialogue-text` now uses `min-height: 84px` (matches the portrait) instead of `4.35em` sized for the longest quote; `60px` at phone widths where the portrait is 60px. The box grows for longer quotes.
- Hint line deleted, including its CSS. The bouncing NEXT prompt, `role="button"`, and the aria-label already document the interaction; the hint was redundant prose.
- Typewriter: the on-load quote animates only once per session (`sessionStorage` key `hungDialogueTyped`); PJAX revisits render the quote finished immediately. Click-driven quotes still animate, at 22ms per character (was 30ms). `sessionStorage` calls are try/catch-wrapped for private-mode browsers.
- Colors: held to the role map from item 3 rather than a strict count of two. The lime NEXT prompt (a role violation: lime is for tags/signals, NEXT is interaction) and the gold focus outline both became pink, unifying every interaction cue (hover, focus, NEXT) on pink. Cyan stays on structure (border, cursor), gold stays on identity (name tag, portrait frame). Three colors remain, each role-correct. If the owner wants a strict two, the next cut is gold-to-cyan on the name tag and portrait frame.

## 9. Link previews: og:image too small for chat apps (FIXED 2026-06-11)

- Original finding (2026-06-11, same OG pass as BiKipCuaGai): the OG plumbing in `base.njk` was correct, but og:image pointed at `img/banner.gif` (597x50, 770 KB). Facebook, Messenger, and Zalo require roughly 200x200 minimum, so shares rendered as text-only cards. No `twitter:card` tag, so X showed no card at all.
- Fix: dedicated static share card at `src/img/share-card.png` (1200x630, 60 KB PNG) built from the site palette, the two site fonts, and a 2x nearest-neighbor first frame of the banner GIF. og:image now points at it via `site.shareCardSrc` in `site.json`; added `og:image:width`, `og:image:height`, `og:image:alt`, and `twitter:card` (`summary_large_image`). og:url unchanged. The banner GIF stays in the page header.
- The card generator is `assets-work/img/make-share-card.py` (not published; needs Pillow plus the two TTFs noted in its header). Rerun it after palette or title changes.
- After deploy, run the card through the Facebook Sharing Debugger once to flush the old cached scrape.

## 10. Audio policy in .gitignore was never implemented (FIXED 2026-06-12)

- Original finding: `.gitignore` excluded `src/music/*.mp3` with the comment "Audio assets hosted via GitHub Releases", but both audio files were committed before the rule was added, so git still tracked them: `Tobu-Cloud9.mp3` (4.3 MB) and `Mạnh Bà 2.opus` (3.7 MB, not covered by the mp3-only rule anyway). The stated Releases hosting never existed.
- Worse than the clone weight: because the mp3 was tracked and `src/music/` is passthrough-copied, the unreferenced NCS mp3 with unverified licensing was being deployed to the public site on every build, while README claimed it was "neither committed nor deployed".
- Decision: published audio stays in the repo. Releases/CDN hosting was rejected: the blobs stay in clone history regardless of untracking, and it adds a deploy-time fetch dependency for zero user-facing gain.
- Fix:
  - `Tobu-Cloud9.mp3` untracked and moved to `assets-work/music/` (gitignored), implementing the README's stated intent. It no longer deploys. The blob remains in old history; rewriting history was not worth it for 4 MB.
  - `Mạnh Bà 2.opus` renamed to `manh-ba-2.opus` (ASCII slug, kills the URL-encoding fragility); player `src` updated in `sidebar-music.njk`. Display title and credit link keep the Vietnamese name.
  - `.gitignore` comment rewritten to state the real policy (opus committed and deployed, mp3 local-only); stale `music/*.mp3` line for a nonexistent root dir dropped.
  - README "Music and NCS tracks" and DESIGN.md audio section updated to match reality.
- Note: the live audio URL changed (`music/M%E1%BA%A1nh%20B%C3%A0%202.opus` to `music/manh-ba-2.opus`). The file is loaded only by the sidebar player, never linked externally, so no redirect is needed.

## 11. Stray working file Kayle.jpg tracked at repo root (FIXED 2026-06-12)

- `Kayle.jpg` (40 KB) sat tracked at the repo root. Nothing referenced it; the published portrait is `src/img/kayle.png` (24 KB, verified present). The repo convention (commit 8345cc6) is that source/working images live in `assets-work/` and are never committed.
- Fix: moved to `assets-work/img/Kayle.jpg` (gitignored), untracked from the repo. The file is preserved locally as the source image and remains recoverable from git history.

## 12. Flat-URL layout is an unstated invariant (FIXED 2026-07-12)

- Every page declares a root-level permalink (`games.html`, `about.html`, ...) and `base.njk` loads assets with relative paths (`css/style.css`, `js/site.js`, `img/...`). This is deliberate: the site lives under `/hung-blog/` on GitHub Pages, and relative paths avoid path-prefix handling.
- The trap: any future page at a nested URL (for example individual post pages under `posts/...`) silently loses all CSS, JS, and images, and `page-transitions.js` (`getPageName` splits on the last path segment) misidentifies nav state. Nothing in the repo documents this constraint.
- Fix: added Eleventy's `HtmlBasePlugin` with `pathPrefix: "/hung-blog/"`, converted internal assets and navigation to root-relative URLs, and changed PJAX nav matching to compare resolved pathnames. Nested post pages now load the same CSS, JavaScript, images, navigation, and music as root pages.

## 13. Posts have no individual URLs and no RSS feed (PARTIALLY FIXED 2026-07-12)

- Original finding: `posts.json` set `permalink: false`, so posts existed only as collection items rendered on the home page. No post could be deep-linked or shared individually, and there was no RSS/Atom feed for readers to subscribe.
- Owner approved individual post pages. Posts now use a shared schema and layout, publish at `/posts/<slug>/`, carry unique descriptions and canonicals, and appear in a bounded 10-post homepage plus `archive.html`. RSS remains optional and was not added because it is not required for the architecture fix.

## 14. No build check before merge (CLOSED 2026-06-18)

- `deploy.yml` runs only on push to main. A template error merged from a branch is discovered when the deploy job fails, after merge.
- Possible fix (not taken): add a `pull_request` trigger running just `npm ci && npm run build` (no deploy steps), or a separate minimal build-check workflow.
- Owner decision: not needed. For a solo, low-traffic journal a failed deploy is a sufficient signal, and the extra workflow is not worth maintaining. Do not re-raise without new evidence (e.g. repeated broken deploys).

## 15. Oversized sidebar avatar shipped at source resolution (OPEN)

- `src/img/avatar-zero-saber.png` is 831x687 and 540 KB but renders as a small sidebar profile image on every page. Together with the 756 KB banner GIF that is ~1.3 MB of imagery per first visit, mostly wasted pixels on the avatar.
- Fix: export the avatar at 2x its rendered size (likely lands around 20-40 KB for pixel art with a reduced palette); keep the source in `assets-work/`. The banner GIF is the site's identity and stays as is.

## 16. Full post collection embedded in every page (FIXED 2026-07-12)

- Original finding: `base.njk` rendered every post into `#rp-pool` on every page. The pool consumed 577.7 KB, or 41.7%, of generated HTML before individual post pages existed. Home rendered every post twice.
- Fix: removed the pool. `random-index.json` contains only post URLs; `random-post.js` loads the index and selected post on demand. Page-local random sources on Smooth, Quotes, and Reddington remain synchronous. Home is capped at 10 posts.
- Result: About fell from 61 KB to about 22 KB and Home from 99.5 KB to about 45 KB. No generated page embeds another post.

## 17. PJAX page scripts used bespoke cleanup conventions (FIXED 2026-07-12)

- Original finding: Tao Thao, Smooth, and Games each managed global listeners and timers differently. Navigating away from an open Millennium Item modal could leave a capture-phase keyboard listener attached to `document`.
- Fix: `window.pageTeardowns` is the single cleanup contract. PJAX runs registered cleanup functions before replacing `.main-content`. The three interactive pages now register teardown functions, and PJAX covers safe same-origin page links beyond the top navigation so music continues through archive, post, and guestbook links.
