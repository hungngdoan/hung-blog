# Architecture and Technical-Debt Review: Hung Blog

Draft review artifact. Created untracked on 2026-07-16 (the review itself changed no production code, tracked files, or commits); the owner may commit this file to keep the tracker in history, or keep it local.

Revision note (2026-07-17, post-HB-1): HB-1 was implemented and its clean rebuild exposed that this review's own baseline was contaminated by the exact defect NEW-5 describes. The "45 pages" figure recorded below (and in the original handoff) included one stale output file, `_site/posts/the-repair-log/index.html`, which has no source in `src/posts/` and no history on any git ref (verified with `git log --all --follow`): it was a never-committed local draft whose output survived in `_site/` because Eleventy does not clean. The true clean count is 44 pages (17 root + 27 posts), 27 posts, ~1503 KB HTML; Eleventy's "Wrote 45 files" line is 44 HTML pages plus `random-index.json`, a numeric coincidence that masked the ghost. CI deploys were never affected (fresh checkout). Recorded observations in section A are preserved as observed, with correction notes; HB-1's acceptance criterion is corrected from 45 to 44; HB-1 is verified complete as of 2026-07-17 (pending the owner's commit). This outcome upgrades NEW-5 from "demonstrated by a planted ghost" to "occurred naturally and skewed a real audit baseline."

Revision note (2026-07-16, same day): re-audited against the non-negotiable UI and content constraints (technical review only; no visual, editorial, URL, navigation, or ordering changes; a11y and performance work must be presentation-preserving). Changes in this revision: HB-5 rewritten to a strictly presentation-preserving mechanism; former owner options that trimmed editorial content (Quotes stratagems) or altered navigation presentation (hiding Style Lab) retracted; the skip link reclassified from backlog candidate to Owner Decision because it is visible on keyboard focus; every ticket now carries a "No unintended visual or content changes" acceptance criterion; every ticket touching templates, styles, assets, or browser behavior now requires before/after verification at 375 px and desktop widths.

## Progress tracker

| # | Ticket | Status |
|---|---|---|
| 1 | HB-1 clean builds (prebuild rm of `_site/`) | DONE 2026-07-17, verified, committed as `461a893` |
| 2 | HB-2 documentation reconciliation | DONE 2026-07-17, committed as `00a4d70` |
| 3 | HB-3 Games portrait prefix fix | DONE 2026-07-17, owner browser check passed, committed as `756f328` |
| 4 | HB-5 footer counter body-class sync | CODE DONE, awaiting owner browser check (2026-07-17) |
| 5 | HB-4 PJAX focus + announcement | PENDING, do last (needs ~10 min of browser verification) |

Open owner decisions: O5 skip link (blocks nothing). Phase 2 items (image re-encode, lang="vi", CI hygiene, story landmark) start after the table above is all DONE.

Update this table when a ticket lands; a ticket is DONE only when its acceptance criteria, including "no unintended visual or content changes", have been verified.

## Review constraints in force

- This is a technical architecture and engineering-debt review, not a redesign, rebranding, information-architecture, or editorial review.
- No changes, and no recommendations to change: visual design, layout, typography, colors, animations, responsive presentation, navigation presentation, retro aesthetic, or component appearance.
- No rewriting, shortening, reorganizing, removing, or adding posts, quotes, page copy, labels, images, music, or other editorial content.
- Existing URLs, visible page order, navigation labels, and content ordering are preserved.
- Intentional user-facing behavior is preserved unless correcting a confirmed bug; direct-load rendering is treated as the canonical statement of intended appearance.
- Accessibility work may add semantic markup, ARIA, focus handling, and screen-reader announcements only where visible content and presentation remain unchanged.
- Performance work may re-encode or resize assets only where rendered appearance remains materially identical.
- Any confirmed defect that cannot be corrected without visible UI or editorial change is routed to Owner Decisions, not the backlog. (After re-audit, no finding required this routing: presentation-preserving fixes exist for all backlog items.)

---

## A. Audit header

- Review date: 2026-07-16.
- Branch: `july-daily-updates` at `39e8605e9b53c84f3d5dfbace448061d79d73ac6`.
- Base comparison: 78 commits ahead of `main` (`c76e5be`), 0 behind. Merge base is `main` itself.
- Worktree: clean at start and at end of review (verified with `git status --porcelain` both times).
- Toolchain: Node v25.9.0 local, npm 11.12.1, Eleventy 3.1.5 (`@11ty/eleventy ^3.1.5`, package-lock.json committed). CI pins Node 20.
- Scope: all tracked source (`src/`, `scripts/`, config, workflow, docs). Generated `_site/` inspected for verification only. `node_modules/`, `assets-work/` (gitignored), and `archive/` (raw content source material) excluded from production-source review.
- Commands run, all from a fresh state:
  - `npm run build`: pass. "Copied 23 Wrote 45 files in 0.23 seconds (v3.1.5)".
  - `npm run check`: pass. "45 pages, 27 posts, 56.4 KB homepage". Matched the handoff baseline. [CORRECTION 2026-07-17: both this observation and the handoff baseline included one stale page, `posts/the-repair-log/index.html`, with no corresponding source; the true clean count is 44 pages, 27 posts. See the post-HB-1 revision note.]
  - `npm run measure`: pass. 45 HTML pages, 1526.7 KB total HTML, 0.0 KB embedded pools. Matched handoff (~1.5 MB). [CORRECTION 2026-07-17: clean figures are 44 pages, 1503.0 KB; the delta is the stale repair-log page.]
  - Stale-output experiment: copied `_site/about.html` to `_site/stale-ghost.html`, ran `npm run check`: PASSED reporting "46 pages". Removed the ghost, re-ran: pass at 45 pages. This confirms the checker validates whatever exists in `_site/` without a source/output manifest. [2026-07-17: the review environment turned out to contain a second, naturally occurring ghost the whole time; the experiment's "45" baseline was itself 44 + 1 stale.]
  - `du`: `_site` about 15 MB on disk; `_site/music` 8.0 MB, `_site/img` 4.5 MB (consistent with the ~13.9 MB logical-size handoff figure).
  - Read-only git history queries for churn and commit inventory.
- Checks NOT performed (evidence gaps):
  - No browser session: PJAX behavior, focus movement, scroll restoration on Back/Forward, music continuity, story player, and mobile layout were traced in source only, not executed.
  - No screen-reader or Lighthouse run.
  - The Eleventy `--serve` incremental collection-drop bug (TECH_DEBT #18) was not re-reproduced.
  - No live-deploy verification.
- Overall confidence: High on code-traced findings and empirically tested ones; Medium wherever browser runtime behavior is part of the claim (labeled per finding).

---

## B. Executive verdict

**Retain and repair incrementally.**

Steelman: a zero-dependency static Eleventy site with one shared shell, root-relative URLs rewritten by `HtmlBasePlugin`, a real teardown contract for page scripts, and a CI check script that validates metadata, links, prefixing, and content invariants on every deploy is close to the platonic ideal for a solo retro journal; it is cheap, fast, debuggable, and hard to break.

Findings that drive the verdict:

1. The architecture is sound and the previous debt round (items 12, 16, 17) was genuinely completed and verified in code and output. Nothing justifies re-platforming.
2. One confirmed runtime defect exists at the PJAX seam: Games dialogue portraits 404 when Games is entered via PJAX from a nested post URL, because `characterQuotes.js` ships page-relative icon paths and inline scripts execute before `history.pushState` (Confirmed, High confidence).
3. The persistent shell has one page-dependent piece: the footer visitor counter renders only when `showVisitorCounter` is set (Home), but the footer is never swapped by PJAX, so counter presence depends on navigation history, not the current page (Confirmed, High confidence).
4. PJAX swaps content without moving focus or announcing the change; keyboard and screen-reader users get silent navigation. This is the largest gap in an otherwise strong accessibility posture (High confidence from code; runtime severity not browser-verified).
5. `npm run check` empirically accepts stale pages left in `_site/` (proven with a planted ghost file). CI is immune (fresh checkout), but local verification can validate output that no longer corresponds to source.

Strong decisions worth preserving: see section G0 ("Do not change") list.

Load-bearing assumptions:

- The site remains served under `/hung-blog/` on GitHub Pages (the prefix is currently written in four places).
- All content is author-authored; `| safe` template usage and inline JSON dumps rely on this trust model.
- CI always builds from a fresh checkout (this is what makes the stale-`_site` gap local-only).
- Google Fonts stays reachable; it is the only external runtime dependency.

Evidence that would change the verdict: a real need for dynamic features (comments, submissions), repeated broken deploys (would reopen the closed PR-check decision per its own terms), or growth that makes the single 3,543-line stylesheet a demonstrated change bottleneck rather than a churn statistic.

---

## C. Current-state architecture

### Diagram

```
AUTHOR EDITS                         BUILD (local or CI)              SERVE
src/_data/*.{json,js}  ---+
src/_includes/{base,post}.njk  ---+ |
src/_includes/partials/*.njk  ---+| |          +--> _site/*.html (44 pages)
src/_includes/css/*.css (inlined)+|-+--eleventy+--> _site/random-index.json
src/*.njk (pages)      ----------+|            +--> _site/{css,js,img,music}/ (passthrough)
src/posts/*.njk (27)   ----------+|                     |
src/{css,js,img,music} (copied) --+                     v
                                        GitHub Actions (push to main):
                                        npm ci -> build -> check -> Pages artifact -> deploy
                                                        |
                                                        v
                              https://hungngdoan.github.io/hung-blog/  (+ Google Fonts CDN)
```

### Build and deployment flow

- `.eleventy.js`: input `src/`, output `_site/`, `HtmlBasePlugin` with `pathPrefix: "/hung-blog/"`, three filters (`isoDate`, `limit`, `groupPostsByMonth`), passthrough for css/js/img/music/favicon.
- Posts: `src/posts/posts.json` assigns `tags: post`, layout `post.njk`, permalink `posts/{{ page.fileSlug }}/index.html` (date prefix stripped by fileSlug).
- `random-index.njk` emits `random-index.json` of prefixed post URLs; `check-site.js` cross-validates it against the post count.
- Deploy: `.github/workflows/deploy.yml` on push to `main`, Node 20, `npm ci`, build, check, upload `_site/`, `deploy-pages@v4`. No PR workflow (closed owner decision #14). No concurrency group.
- Rollback: revert the commit on `main`; Actions redeploys previous output. Documented in DESIGN.md.

### Runtime interaction flow

- Shell (never swapped): marquee, header, nav, sidebar (incl. music player), footer, scroll-jump buttons, random-post FAB and overlay, story-player overlay, and the four shell scripts (`site.js`, `page-transitions.js`, `random-post.js`, `story-player.js`) plus the inline music-player script.
- Swapped per navigation: `.main-content` only. PJAX (`page-transitions.js`) fetches the target page, runs `window.pageTeardowns`, replaces `.main-content`, re-executes inline scripts inside it, syncs title, description/OG meta, canonical, `body.className`, and the `data-page-fonts` stylesheet link, updates nav active state, then pushes history. Failures fall back to `location.href`.
- Ordering fact that matters: inline page scripts execute during `swapMain`, BEFORE `history.pushState`, so during initialization `location` is still the previous page.
- Music player: DOM-driven playlist from `music.json` rendered in the sidebar; script binds once (`player.dataset.bound`), reads track URLs from resolved `href`s (prefix-safe), persists volume/mode in localStorage, MediaSession wired. Playback survives PJAX because the player is outside `.main-content`.
- Random encounter: `random-post.js` prefers a page-local `[data-rp-source]` (Smooth, Quotes, Reddington define one); otherwise lazily fetches `random-index.json` and then the chosen post, extracting `.main-content .blog-post`. On post-fetch failure it navigates to the post URL (designed fallback). Escape/focus-trap implemented; it yields Escape handling when another dialog is open.
- Story player: persistent dialog shell; sources travel inside post articles as inert `<template data-story-source>`; works on the post page, Home, and inside a fetched random encounter; closes on PJAX (`hung:pjax-complete`); full keyboard support and focus restore.
- Teardown contract: Games (Millennium modal), Tao Thao, and Smooth register cleanups in `window.pageTeardowns`; PJAX splices and runs them pre-swap. The Games dialogue typewriter interval instead self-terminates via a `document.body.contains(box)` check (works, but is a second idiom).
- No-JS: content pages are server-rendered readable HTML; `document.documentElement.classList.add("js")` gates JS-only controls (story launch buttons) so no-JS visitors never see dead buttons; guestbook form is disabled and labeled decorative; 36 Kế uses native `<details>`.

### Component and data ownership

| # | Concern | Owner (source of truth) |
|---|---|---|
| 1 | Page inventory / nav | `src/_data/nav.json` |
| 2 | Site identity, URL, share card | `src/_data/site.json` |
| 3 | Post schema and permalinks | `src/posts/posts.json` + `check-site.js` field checks |
| 4 | Playlist | `src/_data/music.json` |
| 5 | Games dialogue data | `src/_data/characterQuotes.js` |
| 6 | Reddington quotes (100) | `src/_data/reddingtonQuotes.js` |
| 7 | Tao Thao cards | `src/_data/taothaoCards.json` |
| 8 | Global styles + color roles | `src/css/style.css` (role map documented at top) |
| 9 | Page-scoped styles | `src/_includes/css/*.css`, inlined per page |
| 10 | Build date | `src/_data/build.js` |
| 11 | Integrity gates | `scripts/check-site.js` (metadata, canonical, link resolution, prefix, home cap/order, random index) |

### Critical invariants and enforcement points

| # | Invariant | Enforced by |
|---|---|---|
| 1 | Internal URLs root-relative; prefix applied at build | HtmlBasePlugin + `check-site.js` "unprefixed" failure |
| 2 | Post bodies contain no `<script>` / outer `<article>` | `check-site.js` |
| 3 | Home caps at 10 posts, discovery order fixed | `check-site.js` |
| 4 | No embedded random pool anywhere | `check-site.js` |
| 5 | Every page has description + canonical | `check-site.js` |
| 6 | Page scripts clean global state | `window.pageTeardowns` convention (not statically enforced) |
| 7 | Shell content identical on every page | Convention only, and currently violated once (footer counter, finding D2) |
| 8 | Pages work on direct load without PJAX | Convention + VERIFY.md manual matrix |

### Trust boundaries and external dependencies

- Google Fonts (fonts.googleapis.com) is the only external runtime dependency: default URL in `site.json`, page overrides on About, 36 Kế, Tao Thao, and Style Lab (the Style Lab URL requests ~20 families), plus the self-contained 404 page. If it is unreachable, text falls back to system monospace; no functional breakage.
- Build-time supply chain: single dev dependency `@11ty/eleventy` (locked), GitHub Actions v3/v4 official actions.
- Content trust: all HTML/JSON injected with `| safe` is repo-authored. No user input anywhere. Audio/fan-art licensing posture documented in README (NCS policy, Capcom disclaimer).

### High-risk seams and failure modes

1. PJAX inline-script re-execution (highest-risk seam). Every interactive page IIFE re-runs per visit; correctness depends on per-script discipline (teardowns, `__smoothCopyBound` guard, DOM-liveness checks). A new page script that binds `document`/`window` without registering teardown reintroduces the exact bug class item 17 fixed. Failure mode: duplicated listeners or timers surfacing only after repeated PJAX visits.
2. Script-before-pushState ordering. Any page script that resolves relative URLs or reads `location` during init sees the previous page. Already bit once (finding D1). Failure mode: wrong-base resource fetches when arriving from nested post URLs.
3. Persistent-shell divergence. Anything conditional in marquee/header/sidebar/footer varies by entry page, not by current page (finding D2 is the one live instance).
4. `_site/` accretion locally. Eleventy never cleans output; renamed/deleted pages leave ghosts that `check` blesses (empirically confirmed). CI unaffected.
5. Nested-URL depth. Only `/posts/<slug>/` is nested today. New nested sections must keep using root-relative URLs; page-relative references (D1) are the failure template.
6. Eleventy `--serve` incremental collections bug (#18): local preview can silently drop posts; full build restores. External tool limitation with a documented workaround.

### Traced flows (required list)

| # | Flow | Result |
|---|---|---|
| 1 | Content file -> page -> Pages | Verified: post source -> `posts/pop-quiz/index.html` with correct prefixed assets and canonical `https://hungngdoan.github.io/hung-blog/posts/pop-quiz/` |
| 2 | Direct load of nested post | Verified in output: prefixed CSS/JS/img, shell present, post article rendered (code + output inspection; not browser-run) |
| 3 | PJAX nested post -> feature page | Traced in code; works, except finding D1 (Games portraits) and D2 (footer counter carryover) |
| 4 | Back/Forward | `popstate` refetches and swaps without history push. Scroll restoration is left to the browser against asynchronously-swapped content; correctness not verifiable without a browser (Medium confidence risk, stays on the manual matrix) |
| 5 | Music across navigation | Player outside swap region; bind-once guard; no rebinding path found. High confidence in code |
| 6 | Random post + story dialog | Both traced including the layered-Escape case (random-post defers while another dialog is open) and story-over-encounter focus restore. Consistent with VERIFY.md expectations |
| 7 | Teardown across repeated visits | Games/Tao Thao/Smooth register teardowns; PJAX splices registry pre-swap; Smooth's document-level copy listener is one-shot guarded and resolves toast DOM at call time (no stale closure). No duplicate-listener path found in current pages |
| 8 | No-JS / reduced motion | No-JS: readable content, hidden JS-only launchers, native details, disabled decorative form. Reduced motion: 6 `prefers-reduced-motion` blocks in style.css plus per-feature checks in every JS module (`FADE_MS` skip, instant swaps, no typewriter, no card animations) |

---

## D. Reconciled debt register

### D-i. Reconciliation of existing TECH_DEBT.md items

| # | Item | Documented | Verified actual | Outcome |
|---|---|---|---|---|
| 1 | Header tax | FIXED | `is-home`/`is-inner` in base.njk:34; PJAX syncs body class | Keep closed |
| 2 | Pixel prose font | CLOSED (deliberate) | Owner decision on record | Preserve; do not re-raise |
| 3 | Color roles | FIXED | Role map present at style.css:1-6 | Keep closed |
| 4 | Motion policy | FIXED | 6 reduced-motion blocks in style.css + page CSS | Keep closed (full 10-animation coverage not re-audited; Medium confidence) |
| 5 | Identical sidebar | CLOSED (deliberate) | Still identical | Preserve; do not re-raise |
| 6 | Mobile nav rows | FIXED | CSS present; not browser re-measured | Keep closed |
| 7 | Scroll-button overlap | FIXED | CSS present; not browser re-measured | Keep closed |
| 8 | Quote box polish | FIXED | `hungDialogueTyped` sessionStorage logic verified in games.njk | Keep closed |
| 9 | og:image share card | FIXED | share-card.png (61 KB) + OG/twitter tags in base.njk | Keep closed |
| 10 | Audio policy | FIXED | Only 2 ASCII-slug .opus in src/music; gitignore states real policy | Keep closed |
| 11 | Kayle.jpg stray | FIXED | Not tracked | Keep closed |
| 12 | Flat-URL invariant | Table: OPEN. Body: FIXED 2026-07-12 | HtmlBasePlugin live; built output fully prefixed | RECONCILE: table is stale, mark FIXED (see NEW-6) |
| 13 | Post URLs + RSS | Table: OPEN. Body: PARTIALLY FIXED | Posts publish at `/posts/<slug>/` (verified). RSS absent | SPLIT: URL half closed; RSS reclassified as optional feature, remove from debt register |
| 14 | No PR build check | CLOSED (owner) | Still no PR workflow; no evidence of repeated broken deploys | Preserve per its own re-open terms |
| 15 | Oversized avatar | OPEN | Still true: avatar-zero-saber.png = 552,220 bytes | Keep open; fold into NEW-4 (a larger offender now exists) |
| 16 | Embedded pool | FIXED | measure: 0.0 KB pools; Home = 10 articles | Keep closed |
| 17 | Teardown conventions | FIXED | 3 pages registered; PJAX runs registry | Keep closed. Note: Games typewriter uses DOM-liveness self-termination instead; acceptable second idiom, worth one doc line |
| 18 | --serve drops collections | OPEN | Not re-reproduced; CI immune; workaround documented | Keep open as external tool limitation |

### D-ii. New findings

**NEW-1: Games dialogue portrait 404s after PJAX entry from a nested post**
- Classification: Confirmed defect. Severity: Minor. Priority: P1. Confidence: High (code-traced end to end; built output inspected; not browser-run).
- Evidence: `src/_data/characterQuotes.js:11` ships `icon: "img/kayle.png"` (page-relative). Built `_site/games.html` JSON contains `"icon":"img/kayle.png"` (verified by grep). `src/games.njk:102` assigns `portrait.src = quote.icon` at script init. `src/js/page-transitions.js:145-148`: `swapMain` (which executes inline scripts) runs before `history.pushState`.
- Failure scenario: reader is on `/hung-blog/posts/pop-quiz/` (direct link, or random-encounter fallback), clicks Games in the top nav. The dialogue script initializes while `location` is still the post URL, so the portrait resolves to `/hung-blog/posts/pop-quiz/img/kayle.png`, a 404. All six quotes carry icons, so the initial portrait is always broken in this path.
- Impact: broken image in the page's hero interaction. Workaround: clicking to the next quote fixes it (by then the URL has been pushed).
- Likelihood: medium (nav from any nested post). Blast radius: Games page only, but the root cause (init-time relative resolution before pushState) is a repeatable trap.
- Root cause: page-relative asset path in data + script-before-pushState ordering; everything else in the repo is root-relative and build-prefixed.
- Corrective path (recommended): store icons root-relative (`/img/kayle.png`) and emit the JSON through a Nunjucks loop that applies the `url` filter per icon, so the built JSON carries `/hung-blog/img/...` and runtime resolution no longer matters.
- Alternatives: (a) keep data as-is and resolve icons in JS against a build-prefixed base carried in a data attribute: works, but leaves the trap armed for the next consumer of the data file; (b) move pushState before swapMain in PJAX: fixes the class of bug but changes ordering semantics for every page script and needs regression of all interactive pages, disproportionate for one site.
- Effort: S. Dependencies: none. Deferral consequence: visible defect persists on a nav-reachable path. Status: do now (ticket HB-3).

**NEW-2: Footer visitor counter depends on navigation history, not current page**
- Classification: Confirmed defect (shell-invariant violation). Severity: Minor. Priority: P2 (bundled into P1 work as HB-5 because it is trivial). Confidence: High.
- Evidence: `partials/footer.njk:6-18` renders the counter only `{% if showVisitorCounter %}`; only `src/index.njk:6` sets it; footer sits outside `.main-content` (`base.njk:45`) and PJAX swaps only `.main-content`.
- Failure scenario: direct-load About: no counter. Home then PJAX to About: counter present on About. About then PJAX to Home: Home shows no counter. Same URL, three different footers.
- Impact: cosmetic inconsistency, but it is the only page-dependent content in the persistent shell, and it silently breaks invariant #7.
- Root cause: page-level front matter feeding a non-swapped region.
- Corrective path (recommended, strictly presentation-preserving): render the counter markup unconditionally in `footer.njk`, and gate its visibility with a body-level class emitted by `base.njk` from the existing `showVisitorCounter` flag (for example `has-counter`), with CSS defaulting the counter to `display: none` and showing it under `body.has-counter`. PJAX already syncs `document.body.className` from the fetched page (`page-transitions.js:124`), so PJAX and direct load agree automatically. Direct-load rendering of every page remains pixel-identical to today (counter in the footer on Home, absent elsewhere); only the buggy PJAX divergence disappears. No-JS visitors are unaffected (the class is server-rendered).
- Alternatives considered and rejected under the UI constraints: moving the counter into Home's content, showing it site-wide, or deleting it all change visible placement or content; teaching PJAX to swap the footer adds swap surface for a decorative widget. None is needed, since the class-gated fix preserves presentation exactly.
- Effort: S. Dependencies: none (no owner decision required; appearance is unchanged). Deferral consequence: standing counterexample to the "shell is identical" rule that future changes may copy. Status: do now (ticket HB-5).

**NEW-3: PJAX navigation does not move focus or announce the new page**
- Classification: Accessibility risk. Severity: Major (for keyboard and screen-reader users, primary navigation is silent and focus is stranded on a removed node, collapsing to `<body>`). Priority: P1. Confidence: High that the code does nothing here (no focus call, no live region in `page-transitions.js`); Medium on exact AT behavior since no screen reader was run.
- Evidence: `page-transitions.js:107-136` (swapMain) and `138-155` (navigate) manage scroll, title, and nav classes only. `grep` confirms no skip link and no shell-level live region for navigation (the only live regions are feature-local: story stage, dialogue box, smooth toast, taothao status).
- Failure scenario: keyboard user tabs to "Books" in the nav, presses Enter; content swaps, focus resets to body; Tab restarts at the marquee/shell. Screen-reader user hears nothing on navigation; the page appears unchanged until they explore.
- Impact: every PJAX navigation, all pages. The site otherwise invests heavily in a11y (focus traps, focus restore, aria-live in features, reduced motion), which makes this the odd gap.
- Root cause: PJAX was built for visual and audio continuity; focus/announcement was never in its spec (VERIFY.md checks dialogs' focus, not navigation focus).
- Corrective path (recommended): after swap, `newMain.setAttribute("tabindex","-1")` (or bake `tabindex="-1"` into base.njk) and `newMain.focus({ preventScroll: true })` before the scroll-to-top; add one polite `aria-live` announcer in the shell that PJAX fills with the new `document.title`. Roughly 15 lines.
- Alternatives: (a) announce only, without moving focus: less disruptive to sighted keyboard users' expectations but leaves focus stranded; (b) pair with a skip link for direct loads: requires Owner Decision O5 first, since a skip link is visible on focus and therefore a presentation addition.
- Effort: S. Dependencies: none; verify no interaction with dialog focus traps (they key off their own overlays). Deferral consequence: core journey remains inaccessible-by-silence. Status: do now (ticket HB-4).

**NEW-4: 1.9 MB PNG book cover is the site's heaviest asset (and item 15's avatar is still open)**
- Classification: Performance risk. Severity: Minor. Priority: P2. Confidence: High.
- Evidence: `src/img/hatgiongtamhon.png` = 1,900,593 bytes, intrinsic 1024x1536, photographic book-cover content stored as PNG; referenced from `posts/2026-06-29-one-plus-one-greater-than-two.njk:129` with `loading="lazy"` and width/height set (good). The post is currently in Home's newest-10, so the image is reachable from Home, the post page, and random-encounter fetches. Companion open item: `avatar-zero-saber.png` 552 KB on every page (TECH_DEBT #15). For scale: total generated HTML is 1.5 MB; this one image exceeds it.
- Failure scenario: mobile reader scrolls Home or opens the post; a ~1.9 MB download for an image rendered at a few hundred CSS pixels. Lazy loading defers but does not shrink it.
- Root cause: photo saved as PNG at source resolution; no size policy for post images (engineer_principle_local.md's 500 KB budget predates current reality and is not enforced anywhere).
- Corrective path: re-encode as JPEG (or WebP) at about 2x rendered width; expected 60-150 KB; keep the original in `assets-work/`. Do the avatar (item 15's own fix plan) in the same pass. Constraint: permitted only because rendered appearance must remain materially identical; the ticket must include side-by-side before/after screenshots at 375 px and desktop (Home, the post page, and the sidebar for the avatar) and any visible quality regression fails the ticket. Filename may stay the same to preserve the URL, or the reference updates with it; either way the visible result is unchanged. Optionally add a soft warning to `check-site.js` for images over ~400 KB so the next one gets caught.
- Alternatives for the checker half: hard-fail threshold (risks blocking a deliberate future hero asset) vs warn-only (recommended) vs no automation (policy lives in docs only, which is how this one slipped in).
- Effort: S. Dependencies: none. Deferral consequence: cost is paid per reader; grows as similar posts are added. Status: plan (Phase 2).

**NEW-5: `npm run check` blesses stale pages in `_site/` (empirically confirmed)**
- Classification: Technical debt (verification tooling). Severity: Minor (CI is immune; local only). Priority: P1 as the Phase 0 safety prerequisite, because every other ticket's verification relies on trusting `check`. Confidence: High (experiment in section A).
- Evidence: Eleventy does not clean `_site/`; `check-site.js:84` walks `_site/` and validates whatever it finds; planted `stale-ghost.html` passed as page 46. No source-to-output manifest exists. [Strengthened 2026-07-17: HB-1's clean rebuild revealed a naturally occurring instance that predated this review: `_site/posts/the-repair-log/index.html` had no source file and no history on any git ref, yet was counted and blessed by `check` in both the handoff baseline and this review's own section A baseline. Confidence: High, now observed in the wild, not only planted.]
- Failure scenario: a page is renamed (`rizz.html` to `smooth.html` happened in history); the old file lingers in `_site/`; local checks pass and local preview shows a page that no longer exists in source; conclusions drawn from local verification are wrong. A stale page could also mask a broken internal link during local testing (the link resolves against the ghost).
- Root cause: build is additive; checker has no expected-set concept.
- Corrective path (recommended): make `npm run build` clean first, zero new dependencies: `"prebuild": "node -e \"fs.rmSync('_site',{recursive:true,force:true})\""`. Every build is then a manifest by construction, and `check` results are trustworthy locally and in CI alike.
- Alternatives: (a) checker asserts exact expected page count derived from `src/` (duplicates Eleventy's routing knowledge, brittle as pages are added); (b) document "always rm -rf _site first" (relies on memory, which is the current failure).
- Effort: S. Dependencies: none; do before other tickets. Deferral consequence: local verification remains untrustworthy after any rename/delete. Status: do now (ticket HB-1).

**NEW-6: Documentation drift across TECH_DEBT.md, README.md, DESIGN.md, and the local engineering guide**
- Classification: Documentation/configuration drift. Severity: Minor. Priority: P1 (doc-only, zero risk, restores the register's authority). Confidence: High.
- Evidence, all verified against source this review:
  - TECH_DEBT.md table says #12 OPEN while its own body says FIXED 2026-07-12; table says #13 OPEN ("no individual URLs") while posts demonstrably publish at `/posts/<slug>/` and the body says PARTIALLY FIXED.
  - README.md:62-66 and DESIGN.md:135-142 state `pearls.html` is hidden from the nav; `nav.json:16` lists Pearls under Misc. DESIGN.md explicitly says "Hidden pages should not be added to nav.json".
  - DESIGN.md's page table omits `reddington.html` (nav.json:6) and `page-styles.html` / Style Lab (nav.json:18) entirely.
  - README.md:88 describes `js/site.js` as "Last-updated script"; it is the nav-dropdown and scroll-controls module (DESIGN.md has it right); the build date actually comes from `_data/build.js`.
  - README.md:21 says the shared layout eliminates duplication "across 9 pages"; the site builds 45.
  - engineer_principle_local.md (untracked, local-only) still mandates "No JavaScript", a 500 KB page budget, and "copy an existing page's shell", all predating the Eleventy/PJAX architecture; its embedded AI prompt would steer any assistant that reads it toward stale constraints.
- Failure scenario: a future contributor (or AI session) trusts the table, re-fixes #12, or "restores" pearls to hidden, or obeys the no-JS rule.
- Root cause: multi-file documentation with no single owner per fact; the table/body split in TECH_DEBT.md invites divergence.
- Corrective path: one doc pass (ticket HB-2). Recommend one authoritative location per fact type: nav.json for page inventory (DESIGN table shrinks to prose or links out), TECH_DEBT.md body as the sole status field (table regenerated from headings or deleted), DESIGN.md for runtime contracts, VERIFY.md for the manual matrix, README for policy (music/licensing) and quickstart. Update or delete engineer_principle_local.md.
- Effort: S. Status: do now (ticket HB-2).

**NEW-7: Vietnamese-dominant pages declare `lang="en"`**
- Classification: Accessibility risk. Severity: Minor. Priority: P2. Confidence: High.
- Evidence: `base.njk:2` hardcodes `<html lang="en">` for all 44 pages. `36ke.njk` contains 0 `lang="vi"` attributes across an almost entirely Vietnamese page (it does mark `zh-Hant` hanzi correctly, 44 lang attrs, all zh); `taothao.njk` 0; `quotes.njk` does it right (14 `lang="vi"` blocks). PJAX never touches `documentElement.lang`, but since every page declares `en` there is nothing to sync; the defect is in the static declarations.
- Failure scenario: screen reader reads 36 Kế's Vietnamese prose with an English voice; pronunciation is garbled. Search engines get wrong language signals for those pages.
- Corrective path: wrap 36 Kế's content (and Tao Thao's Vietnamese card area) in `lang="vi"` containers, mirroring quotes.njk's existing pattern. If a fully-Vietnamese page ever sets a page-level lang, PJAX must then also sync `documentElement.lang`; today container-level marking avoids that requirement.
- Constraint note: `lang` attributes can influence browser font fallback and hyphenation in some engines. Both pages set explicit font families, so a visible change is unlikely, but the ticket must include before/after visual comparison at 375 px and desktop on 36 Kế and Tao Thao; any rendering difference is a failure.
- Effort: S. Status: plan (Phase 2).

**NEW-8: `pathPrefix` and site URL duplicated across four locations**
- Classification: Technical debt (configuration duplication). Severity: Minor. Priority: P3. Confidence: High.
- Evidence: `.eleventy.js:39` (`pathPrefix: "/hung-blog/"`), `package.json:8` (`--pathprefix=/hung-blog/` in start), `scripts/check-site.js:7` (`const pathPrefix = "/hung-blog"`), `site.json:4` (URL embeds `/hung-blog`).
- Failure scenario: site moves to a custom domain or repo rename; three of four spots get updated; the checker or canonicals silently disagree. Note `check-site.js` would actually catch a prefix mismatch in output, which is why this is P3 not P2.
- Corrective path: export the prefix from one small module consumed by `.eleventy.js` and `check-site.js`; document that `site.json` URL and the start script must match (npm scripts cannot cheaply import it). Full unification is not worth machinery beyond that.
- Effort: S. Status: defer until touched (opportunistic).

**NEW-9: Story stage is a second `<main>` (landmark violation); skip link routed to Owner Decisions**
- Classification: Accessibility risk. Severity: Minor. Priority: P3. Confidence: High on the markup facts.
- Evidence: `partials/story-player.njk:44` uses `<main class="story-stage">` inside the dialog, so while the story is open the document has two non-hidden `main` elements (spec violation; landmark confusion for AT). Separately, no skip-to-content link exists (grep over base.njk/style.css).
- Corrective path for the landmark: change the story stage element to `<div role="region">` or `<section>`. Verified presentation-safe: all story-stage styling in style.css is class-based (`.story-stage`, lines 535-565); no `main` element selectors exist; default display is block either way. Ticket still requires the standard before/after check at 375 px and desktop with the story open.
- Skip link: NOT included in the engineering backlog. A skip link is visually hidden until keyboard focus, at which point it becomes a new visible element; under the review constraints that is a presentation change, so it is offered as Owner Decision O5 instead. HB-4's focus-to-main on PJAX already removes most of the repeat-tabbing cost; only direct loads would benefit.
- Effort: S (landmark fix). Status: plan (Phase 2; fold into any story-player touch). Skip link: needs owner decision.

**NEW-10: CI runs Node 20 (end-of-life since April 2026); no engines policy**
- Classification: Operational risk (dependency/runtime policy). Severity: Minor. Priority: P2. Confidence: High on the workflow pin (`deploy.yml:21`); Medium on the EOL date (from model knowledge, not verified online this session).
- Evidence: `deploy.yml` `node-version: 20`; local dev observed on Node 25.9.0; package.json has no `engines` field; Eleventy 3 supports Node 18+.
- Failure scenario: no immediate breakage (build-only usage, static output), but security fixes stop landing on the CI runtime and the local/CI version gap (20 vs 25) widens until something behaves differently in one place only.
- Corrective path: bump CI to Node 22 (active LTS), add `"engines": { "node": ">=22" }` as a statement of intent, run build+check once to confirm.
- Effort: S. Status: plan (Phase 2, bundle with NEW-11).

**NEW-11: Deploy workflow has no concurrency group**
- Classification: Operational risk. Severity: Minor. Priority: P3. Confidence: High.
- Evidence: no `concurrency:` key in deploy.yml (grep). Two rapid pushes to main can run deploy jobs concurrently; GitHub's own Pages template serializes with `concurrency: group: pages`.
- Failure scenario: push A (older) deploys after push B (newer); site serves stale output until the next push. Low likelihood for a solo author; self-heals on next deploy.
- Corrective path: add the standard three-line concurrency block (`cancel-in-progress: false`).
- Effort: S. Status: plan (bundle with NEW-10 as one CI-hygiene PR).

**NEW-12: Duplicated client-side search logic and a shell/page class-name coupling**
- Classification: Technical debt (duplication/coupling). Severity: Minor. Priority: P3. Confidence: High.
- Evidence: `quotes.njk:690-723` and `reddington.njk:58-86` implement the same filter widget with different hidden-class names (`quotes-search-hidden` vs `hidden`) and different matching sources (live textContent vs precomputed `data-quote` attribute, which also duplicates every quote's text into an attribute). `random-post.js:100` hardcodes both class names (`card.classList.remove("hidden", "quotes-search-hidden")`), meaning the shared shell knows page-private CSS classes; a third searchable page would need to edit shell JS.
- Also: `reddington.njk:43-56` renders all 100 quotes a second time inside `<template data-rp-source>` (article-card chrome for the die), roughly doubling the page (96.9 KB, the "100 articles" in measure). Quotes and Smooth instead point the die at live elements via `data-rp-entries`. The Reddington duplication is a deliberate presentation choice (die deals styled cards, not raw blockquotes) and works; it costs ~40 KB of HTML.
- Failure scenario: next searchable page copies one of the two idioms, diverges further, and the shell's class list grows again; or a filter-class rename breaks the die's un-hiding silently.
- Corrective path: extract one search partial/helper with a single hidden-class contract (e.g. `data-rp-hidden-class` declared on the rp-source so the shell reads it instead of knowing names); optionally rebuild Reddington's die cards client-side from the visible list to drop the second render.
- Constraint note: any such refactor must be strictly behavior- and presentation-preserving: the search inputs, counts, empty states, and filtering behavior must look and act exactly as today on both pages, and the die's dealt Reddington card must keep its current article-card chrome pixel-for-pixel (if built client-side, the generated markup must reproduce the current template's structure and classes). The die is JS-only, so no-JS behavior is unaffected either way. Before/after at 375 px and desktop on Quotes, Reddington, and the die modal required.
- Effort: M for full unification; S for just the class-contract decoupling. Status: defer until a third searchable page appears or either file is next touched.

### D-iii. Investigated, no debt declared

- `style.css` (3,543 lines, 18 touches in 78 commits): highest churn, but an extraction convention already exists and works (10 page-scoped CSS files in `_includes/css/`, inlined; `pageClass` scoping; documented change guidelines; color-role map enforced at review time). Churn is consistent with active feature work, not with a change bottleneck. No action; re-examine only if unrelated-page regressions from global CSS edits start appearing.
- Quotes page hosting all 36 stratagems while 36 Kế is a dedicated page: the two are different texts (quotes.njk carries the Trịnh Ngọc Hòa prose, matching `archive/tam-thap-luc-ke-trinh-ngoc-hoa-2003.md`; 36ke.njk is the classical set with hanzi and short meanings). Content curation choice, not rendering/data duplication; editorial content is out of scope for this review, so no consolidation is proposed. Only action: one DESIGN.md line recording the two surfaces as deliberate (folded into HB-2). No debt entry.
- Cross-page hash links / popstate hash handling: PJAX would not scroll to anchors after cross-page hash navigation, but zero cross-page hash links exist in src (grep). Latent edge, documented here, no ticket.
- Guestbook "fake functionality" concern: properly labeled decorative with disabled controls (guestbook.njk:11,26-30). Meets the site's own principle. No action.
- `| dump | safe` JSON into inline scripts and `titleHtml | safe`: safe under the author-only content trust model; a `</script>` inside a quote would break the page, but content is repo-controlled. No action beyond noting the trust boundary in DESIGN if desired.
- Back/Forward scroll restoration quality: cannot be assessed without a browser; stays on VERIFY.md's manual matrix. Not asserted as a defect.

---

## E. Engineer-ready backlog

Sequencing: HB-1 and HB-2 first (independent of each other); then HB-3, HB-4, HB-5 in any order (all independent). Each ticket is one PR.

Global acceptance rules, binding on every ticket below and on all future tickets cut from this review:

- "No unintended visual or content changes" is an acceptance criterion of every ticket. The only permitted visible difference is the corrected behavior named by the ticket's own defect statement (e.g. a portrait that previously 404ed now renders).
- Every ticket that touches templates, styles, assets, or browser behavior requires before/after verification at 375 px and desktop widths on the affected pages, comparing against the current direct-load rendering as the canonical appearance.
- URLs, page order, navigation labels, content ordering, editorial content, typography, colors, and animations are out of bounds for all tickets.

---

**HB-1: Clean `_site/` on every build so checks validate only current output**
- Objective: make `npm run build && npm run check` trustworthy locally; a build's output equals exactly what source produces. Closes NEW-5.
- Current behavior/evidence: planted `_site/stale-ghost.html` passed `npm run check` as "46 pages" (empirical, this review). Eleventy 3 does not clean output.
- In scope: add `"prebuild": "node -e \"fs.rmSync('_site',{recursive:true,force:true})\""` to package.json scripts (npm runs pre-scripts automatically); README/DESIGN one-line note that builds are clean.
- Out of scope: any change to check-site.js logic; CI changes (CI is already fresh-checkout).
- Affected files: package.json; README.md build section.
- Approach: exactly the prebuild script above; verify `npm run build` still exits 0 on a machine with no `_site/`.
- Dependencies: none. Do first.
- Risks: `--serve` (npm start) does not run prebuild (start is not build); dev-server behavior unchanged, which is correct. Windows path handling: fs.rmSync with force handles the missing-dir case.
- Acceptance criteria (observable): (1) create `_site/stale-ghost.html`, run `npm run build && npm run check`; check reports exactly 44 pages and the ghost is gone [corrected 2026-07-17: originally written as 45; that figure itself included a stale page, see revision note]; (2) fresh clone simulation: delete `_site/`, `npm run build` succeeds; (3) no unintended visual or content changes (structurally guaranteed: no template, style, or asset is touched; built page bytes identical apart from the build date).
- Verification commands: `cp _site/about.html _site/stale-ghost.html; npm run build; npm run check` then `ls _site/stale-ghost.html` (must not exist; check must report 44 pages, 27 posts).
- STATUS: IMPLEMENTED AND VERIFIED 2026-07-17 (prebuild script + README note; clean rebuild yields 44 pages / 27 posts / 56.4 KB homepage / 1503.0 KB HTML; ghost experiment now fails closed; independently re-verified by the reviewing session). Pending owner commit.
- Manual regression: none required (build-time only; no template/style/asset/browser surface, so the 375 px / desktop rule does not trigger).
- Docs: README "Getting Started" note.
- Rollback: remove the prebuild line.
- Effort: S. Open questions: none.

---

**HB-2: Reconcile the debt register and documentation with reality**
- Objective: TECH_DEBT.md, README.md, DESIGN.md agree with code; the register is trustworthy again. Closes NEW-6.
- Current behavior/evidence: contradictions itemized in NEW-6 (table #12/#13 vs bodies; pearls hidden-page claims vs nav.json:16; DESIGN page table missing reddington.html and page-styles.html; README site.js description; "9 pages"; stale local guide).
- In scope: TECH_DEBT.md table rows 12 and 13 corrected (12 FIXED 2026-07-12; 13 split: URLs FIXED, RSS moved to an "optional features" note outside the debt table); add new open items from this review that the owner accepts; README hidden-pages section rewritten (only guestbook.html remains hidden); README structure annotation for site.js corrected; "9 pages" claim updated or dropped; DESIGN page tables gain reddington.html and page-styles.html rows and move pearls to the visible (Misc) list; DESIGN "hidden but built" reduced to guestbook; engineer_principle_local.md either updated to current architecture or reduced to a pointer at DESIGN.md (owner's call, it is untracked).
- Out of scope: any source-code change; re-litigating closed decisions 2, 5, 14 (explicitly preserved).
- Affected files: TECH_DEBT.md, README.md, DESIGN.md, engineer_principle_local.md (local).
- Dependencies: none. Risks: none (doc-only).
- Acceptance criteria: grep checks pass: TECH_DEBT table row 12 contains "FIXED"; row 13 no longer claims posts lack URLs; README no longer lists pearls.html as hidden; DESIGN tables contain reddington.html and page-styles.html; every TECH_DEBT table status matches its body heading. Plus: no unintended visual or content changes (doc-only ticket; `src/` untouched, built output byte-identical apart from the build date).
- Verification commands: `npm run build && npm run check` (unchanged, sanity); `grep -n "pearls" README.md DESIGN.md`; `grep -n "OPEN" TECH_DEBT.md`.
- Manual regression: none.
- Rollback: revert the doc edits.
- Effort: S. Open questions: whether the owner wants the table regenerated from body headings going forward (recommended: single status source).

---

**HB-3: Prefix-safe Games dialogue portraits under PJAX from nested URLs**
- Objective: the dialogue portrait renders correctly no matter which page the visitor navigates from. Closes NEW-1.
- Current behavior/evidence: NEW-1; built JSON carries `"icon":"img/kayle.png"`; `games.njk:102` assigns it to `portrait.src`; PJAX executes inline scripts before pushState (`page-transitions.js:145-148`), so arrival from `/hung-blog/posts/<slug>/` resolves the icon against the post URL and 404s.
- In scope: change `characterQuotes.js` icon values to root-relative (`/img/kayle.png`, `/img/zed.png`); in `games.njk`, replace `{{ characterQuotes | dump | safe }}` with a loop-built JSON array applying the `url` filter to each icon (or an Eleventy-computed variant) so built output contains `/hung-blog/img/...`; update the data-file comment describing the path convention.
- Out of scope: PJAX ordering changes; other consumers (none exist today; verify with grep).
- Affected files: `src/_data/characterQuotes.js`, `src/games.njk` (JSON emission block only), comment in the data file.
- Approach note: keep the JSON shape identical (`text`, `character`, `source`, `icon`) so the page script needs zero changes.
- Dependencies: HB-1 recommended first (trustworthy check). Sequencing: any time.
- Compatibility risks: direct-load Games must keep working (icons become absolute-prefixed, strictly safer); random-encounter and story flows untouched.
- Acceptance criteria: (1) `grep -o '"icon":"[^"]*"' _site/games.html` yields only `/hung-blog/img/...` values; (2) manual: from a direct load of any `/hung-blog/posts/<slug>/` page (local serve with prefix: `npm start`), click Games in the nav; the initial portrait renders, no 404 in the network panel; (3) direct load of games.html still renders the portrait; (4) no unintended visual or content changes: the dialogue box, quotes, names, sources, and portraits look exactly as today on direct load; the only visible difference anywhere is the previously broken portrait now rendering in the PJAX-from-nested-post path (the confirmed bug this ticket corrects).
- Verification commands: `npm run build && npm run check && grep -c '"icon":"/hung-blog/img/' _site/games.html` (expect 6).
- Manual regression (from VERIFY.md): dialogue box advance by click and keyboard; typewriter once-per-session behavior; Millennium modal open/navigate/Escape after PJAX. Before/after comparison of the Games page at 375 px and desktop (ticket touches a template).
- Docs: none beyond the data-file comment (README post rules already mandate root-relative paths; this aligns the last stragglers).
- Rollback: revert the two files.
- Effort: S. Open questions: none.

---

**HB-4: Move focus and announce the page after every PJAX swap**
- Objective: keyboard and assistive-tech users perceive and continue from PJAX navigation the way a full load would behave. Closes NEW-3.
- Current behavior/evidence: NEW-3; `swapMain`/`navigate` never touch focus and no live region exists for navigation.
- In scope: in `base.njk`, add `tabindex="-1"` to `.main-content` and one visually-hidden `aria-live="polite"` element in the persistent shell; in `page-transitions.js`, after swap (and after the scroll handling for forward nav): focus the new main with `preventScroll: true`, set the announcer's text to the new `document.title`. Apply on both `navigate()` paths (push and popstate).
- Out of scope: skip link (Owner Decision O5; visible-on-focus, presentation addition); dialog focus traps (already correct); scroll-restoration changes; any visible styling.
- Affected files: `src/js/page-transitions.js`, `src/_includes/base.njk`, `src/css/style.css` (one `.sr-only`-style utility if none exists at shell level; games/reddington have page-local sr-only classes only).
- Compatibility risks: a visible focus ring may appear on `.main-content` once it is focusable; that would be an unintended presentation change, so the ticket MUST suppress it (`.main-content:focus { outline: none }` is safe on a non-interactive container; interactive elements inside keep their existing focus styles untouched). The announcer element must be visually hidden (clip-based sr-only pattern), adding zero visible pixels. Verify the fade-in animation is unaffected by early focus (focus happens on the already-inserted node; no interaction expected).
- Acceptance criteria: (1) keyboard-only: navigate Home to Books via nav; next Tab lands on the first link inside Books content, not the marquee; (2) with a screen reader (or by inspecting the live region in devtools), the new page title text appears in the announcer node after each PJAX nav, including Back/Forward; (3) music keeps playing across the same navigation; (4) reduced-motion mode behaves identically apart from the existing instant swap; (5) no unintended visual or content changes: no focus ring on the content container, no visible announcer, no layout shift; every page renders pixel-identically to today for mouse users.
- Verification commands: `npm run build && npm run check` (structural); behavioral checks are manual by nature here.
- Manual regression: VERIFY.md "Navigation and persistent shell" block in full; story player open during PJAX still closes correctly; random modal focus return still works. Before/after comparison at 375 px and desktop on Home, one post, and one feature page (ticket touches base template, shell script, and stylesheet).
- Docs: DESIGN.md PJAX section gains one line ("moves focus to the swapped main and announces the new title").
- Rollback: revert the three files.
- Effort: S. Open questions: whether the owner prefers announce-only (no focus move); default is move focus, matching full-load semantics.

---

**HB-5: Synchronize the footer visitor counter with the current page under PJAX (presentation-preserving)**
- Objective: counter presence always matches the current page's canonical direct-load appearance (visible in the footer on Home, absent elsewhere), regardless of how the visitor navigated there. Closes NEW-2 with zero change to any page's direct-load rendering.
- Current behavior/evidence: NEW-2; `footer.njk:6-18` renders the counter only when `showVisitorCounter` is set (index.njk only); the footer is outside `.main-content`, so PJAX never updates it and counter presence tracks navigation history instead of the current page.
- In scope: (1) `base.njk`: append a marker class (e.g. `has-counter`) to the body class list when `showVisitorCounter` is set, alongside the existing `is-home`/`is-inner` logic; (2) `footer.njk`: render the counter markup unconditionally; (3) `style.css`: `.footer-counter { display: none }` and `body.has-counter .footer-counter { display: block }` (match the current computed display). PJAX already syncs `document.body.className` (`page-transitions.js:124`), so no JS change is needed.
- Out of scope: moving the counter, showing it on more or fewer pages, restyling it, making PJAX swap the footer, or any new counter functionality. Visible placement, styling, and which-pages-show-it are all locked to today's direct-load behavior.
- Affected files: `src/_includes/base.njk` (body class attribute), `src/_includes/partials/footer.njk`, `src/css/style.css` (two rules).
- Approach note: the counter markup now ships in every page's HTML (~300 bytes) but is hidden by CSS everywhere except Home; `display: none` keeps it out of the accessibility tree, matching today's "absent" semantics. No-JS visitors get the server-rendered class, so behavior is unchanged for them.
- Dependencies: none. No owner decision required, since appearance is unchanged on every page.
- Compatibility risks: none identified; `is-home` already proves the body-class sync path works for presentation state.
- Acceptance criteria: (1) direct-load Home shows the counter in the footer exactly as today; direct-load of every other page shows no counter (computed `display: none`); (2) Home -> About via PJAX: counter disappears; About -> Home via PJAX: counter appears; (3) `grep -l "has-counter" _site/*.html` matches only `index.html`; (4) `npm run check` passes (home size cap unaffected); (5) no unintended visual or content changes: footer on every page is pixel-identical to its current direct-load rendering; the only behavioral difference is the corrected PJAX synchronization (the confirmed bug).
- Verification commands: `npm run build && npm run check && grep -l 'has-counter' _site/*.html` (expect exactly `_site/index.html`); `grep -c 'counter-digits' _site/about.html` (expect 1, present but CSS-hidden).
- Manual regression: footer renders correctly on a nested post direct load; before/after comparison at 375 px and desktop on Home and About footers (ticket touches templates and stylesheet).
- Docs: none.
- Rollback: revert the three files.
- Effort: S. Open questions: none.

---

## F. Delivery roadmap

No calendar dates (no velocity data). Order within phases is dependency order; bullets marked (parallel) can run simultaneously.

**Phase 0: safety and truth prerequisites**
- HB-1 clean builds (parallel with HB-2).
- HB-2 documentation reconciliation (parallel with HB-1).
- Exit criteria: ghost-file experiment fails closed (44 pages exactly; corrected 2026-07-17); TECH_DEBT table matches bodies; README/DESIGN page inventory matches nav.json. HB-1 half met 2026-07-17.

**Phase 1: confirmed defects and the P1 risk**
- HB-3 portrait prefix fix (parallel).
- HB-4 PJAX focus + announcement (parallel).
- HB-5 footer counter PJAX sync (parallel; no owner decision needed, presentation-preserving).
- Exit criteria: all HB-3/4/5 acceptance criteria green, including the no-unintended-visual-change criterion and 375 px / desktop before/after comparisons; VERIFY.md navigation and dialog blocks re-run once in a browser; `npm run build && npm run check` green.

**Phase 2: scheduled maintainability and hygiene (each item S, independent, opportunistic order)**
- NEW-4: re-encode hatgiongtamhon.png + item 15 avatar in one image pass; optional check-site size warning.
- NEW-7: `lang="vi"` containers on 36 Kế and Tao Thao.
- NEW-10 + NEW-11: one CI-hygiene PR (Node 22, engines field, concurrency group).
- NEW-9 (part): story stage `<main>` to `section`/`role="region"` whenever story-player is next touched, or as its own 5-minute PR.
- Exit criteria: largest published image under ~400 KB; Vietnamese-dominant pages carry correct lang containers; CI on a supported LTS with serialized deploys.

**Phase 3: optional / deferred**
- NEW-8 prefix consolidation: defer until the site URL actually changes or check-site is next edited.
- NEW-12 search unification and rp hidden-class contract: defer until a third searchable page exists or quotes/reddington is next touched; strictly presentation-preserving per its constraint note.
- Reddington die-template dedupe (~40 KB): optional, only with NEW-12, and only if the dealt card stays visually identical.
- Skip link: gated on Owner Decision O5 (visible-on-focus element, therefore a presentation addition; not schedulable by this review).
- RSS, sitemap, robots.txt: optional product features per standing decision; build only on owner demand.

**Rejected / not planned, with rationale**
- PR build workflow: closed owner decision #14; no new evidence (zero broken deploys found in recent history).
- Framework adoption, CSS framework, bundlers, image pipelines/CDNs: no requirement they would serve; violates the simplicity core.
- PJAX reordering (pushState before script activation): disproportionate blast radius for a defect fixable in data (HB-3).
- Splitting style.css beyond the existing page-CSS convention: churn signal does not currently demonstrate change-isolation failures.
- Rewriting git history for old committed MP3 blobs: already correctly rejected in item 10.
- Retracted by the UI/content constraints (previously floated in an earlier draft of this review): relocating or globalizing the footer counter (superseded by the presentation-preserving HB-5), trimming or consolidating the Quotes page's stratagem content (editorial), and hiding Style Lab from the nav (navigation presentation).

---

## G. Owner decisions

**G0. Standing decisions this review explicitly preserves (no action, do not re-raise without their stated evidence bars)**
- Static Eleventy architecture; no backend, CMS, analytics, client framework (DESIGN non-goals).
- Pixel typography everywhere (#2, closed with an evidence bar: reader complaints).
- Persistent identical sidebar (#5).
- Banner GIF at current weight as site identity (#15's carve-out).
- Committed .opus audio in-repo; MP3s local-only (#10 policy).
- No PR build workflow (#14; re-open only on repeated broken deploys).
- Flat root URLs + HtmlBasePlugin prefixing (#12's resolution) and root-relative asset rule.
- The teardown contract (`window.pageTeardowns`) as the single cleanup mechanism (#17).
- RSS/sitemap as optional features, not debt (#13 resolution and review instructions).

**G1 (O1). RETIRED: footer visitor counter placement**
- An earlier draft of this review asked where the counter should live, because every relocation option changed visible UI. The re-audit found a strictly presentation-preserving fix (HB-5: unconditional markup, visibility gated by a PJAX-synced body class), so no decision is required. Kept here only for traceability. If the owner ever independently wants the counter moved, shown site-wide, or removed, that is a product/design change outside this review's charter.

**G2 (O2). Two 36-stratagem surfaces (Quotes section vs 36 Kế page): documentation only**
- Why listed: an engineer touching either page needs to know the overlap is deliberate, or they may "helpfully" deduplicate it.
- This review proposes no content change: the two sections are different texts (Trịnh Ngọc Hòa prose vs the classical set), and editorial content is out of scope under the review constraints.
- Decision requested: confirm the two surfaces are deliberate so HB-2 can record one line in DESIGN.md saying so. Recommended default: confirm and document.
- Can proceed: everything else is independent of this.

**G3 (O3). Google Fonts dependency**
- Why it matters: sole external runtime dependency; privacy exposure (visitor IPs to Google) and a render dependency; Style Lab requests ~20 families.
- Options: (a) keep as-is, document the trust boundary in DESIGN (recommended for simplicity); (b) self-host the same font files for the two core pixel fonts (VT323, Press Start 2P) and keep Google for feature-page display fonts; (c) fully self-host.
- Constraint note: (b) and (c) are admissible only because serving identical font files changes no rendering; any option that substitutes different fonts or subsets that alter glyph rendering is out of scope. If chosen, the work inherits the standard 375 px / desktop before/after comparison.
- Can proceed: yes; unrelated to all tickets.

**G4 (O4). Style Lab (`page-styles.html`): documentation only**
- Why listed: the page is public in the nav but absent from DESIGN's page inventory; HB-2 needs to know what to write.
- This review proposes no navigation change: an earlier draft offered "build-but-hide", but removing a nav item changes navigation presentation and is out of scope under the review constraints.
- Decision requested: confirm Style Lab is intentionally public so HB-2 adds it to DESIGN's page table. Recommended default: confirm and document. If the owner independently wants it hidden, that is a product decision outside this review.
- Can proceed: yes; HB-2 documents the confirmed state.

**G5 (O5). Skip-to-content link (moved here from the backlog)**
- Why it is a decision: a skip link is visually hidden until keyboard focus, then appears as a new visible element. Under the constraints that is a presentation addition, so this review cannot schedule it unilaterally.
- Why it is worth considering: on direct loads, keyboard users must tab through marquee, header, nav, and sidebar before reaching content on every page. HB-4 fixes this for PJAX navigations only.
- Options: (a) approve a standard visible-on-focus skip link styled to the site's existing pixel aesthetic; (b) decline; direct-load tabbing stays as today (HB-4 still lands the PJAX half).
- Recommended default: (a), implemented after HB-4, as its own small PR with the standard before/after checks.
- Can proceed before decision: yes; nothing depends on it.

**G6 (O6). Accepting the new Phase 2 items into TECH_DEBT.md**
- Why it matters: HB-2 should add only owner-accepted items so the register stays authoritative.
- Recommendation: accept NEW-4, NEW-7, NEW-9 (landmark half), NEW-10, NEW-11 as OPEN items; record NEW-8 and NEW-12 as noted-deferred; record the skip link as pending decision O5.

---

## Final quality gate self-check

- UI/content constraint compliance re-audited item by item: every backlog ticket is presentation- and content-preserving (the only visible deltas are the two confirmed bugs being corrected: the 404ing portrait and the PJAX counter desync, both restored to direct-load canon); every ticket carries the "No unintended visual or content changes" criterion; every template/style/asset/browser ticket carries the 375 px and desktop before/after requirement; recommendations that would have touched editorial content or navigation presentation were retracted (see Rejected list) or routed to Owner Decisions (skip link, O5).
- Every Major finding (NEW-3) has code evidence and a concrete failure scenario; no Fatal findings exist; P0 is empty because nothing threatens deploys or data.
- All 18 legacy debt items reconciled with per-item verdicts; two table/body contradictions resolved on paper and ticketed (HB-2).
- Features (RSS, sitemap), defects (NEW-1, NEW-2), risks (NEW-3, 4, 7, 9, 10, 11), debt (NEW-5, 6, 8, 12), and accepted tradeoffs (G0) are kept in separate buckets.
- Every ticket has observable acceptance criteria and exact commands; each fits one PR; none is XL.
- Critical flows traced through source, build, output, deployment config, and (where possible without a browser) runtime; browser-dependent claims are labeled and left on VERIFY.md.
- Unknowns are labeled: browser/AT behavior, Node 20 EOL date precision, #18 reproduction, mobile CSS re-measurement.
- Worktree verified clean before and after; only this untracked draft file and the gitignored `_site/` were written.
