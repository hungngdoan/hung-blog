# Design Doc: Hung Blog

**Author:** Hung Doan  
**Last updated:** 2026-07-12
**Status:** Current application reference

---

## Objective

Hung Blog is a personal static site published at:

```
https://hungngdoan.github.io/hung-blog/
```

The site should stay fast, low-cost, easy to edit, and expressive. It uses Eleventy to remove duplicated page chrome while keeping the output as plain static HTML, CSS, JavaScript, images, and audio.

The site is not a product dashboard or CMS. It is a personal web space with a retro/Y2K visual language, a shared music player, and a few richer interactive content pages.

---

## Current State

- Eleventy 3 builds the site from `src/` into `_site/`.
- Nunjucks pages use the shared layout `src/_includes/base.njk`.
- Shared partials handle the marquee, header, nav, sidebar, footer, and music player script.
- Navigation is data-driven from `src/_data/nav.json`.
- Posts publish at stable `/posts/<slug>/` URLs through a shared post layout.
- Home is capped at the newest 10 posts; `archive.html` lists the full collection.
- Internal URLs are root-relative and rewritten for `/hung-blog/` by `HtmlBasePlugin`.
- `pearls.html` and `guestbook.html` are intentionally built but hidden from the top nav.
- Static assets are copied through from `src/css`, `src/js`, `src/img`, and `src/music`.
- GitHub Actions builds and deploys `_site/` to GitHub Pages on pushes to `main`.
- The old `plan_sample/` prototype is no longer required by the built app and has been moved to the gitignored `assets-work/plan_sample/`. The 36 Ke experience now lives in `src/36ke.njk` with its image in `src/img/chineseDragon1.jpg`.

---

## Architecture

```
src/
  Eleventy input
  Nunjucks pages, shared layout, partials, data, assets
    |
    v
npm run build
    |
    v
_site/
  Static HTML/CSS/JS/assets
    |
    v
GitHub Actions Pages artifact
    |
    v
GitHub Pages
```

At runtime, there is no backend. The browser loads static files from GitHub Pages.

The page shell is shared by `base.njk`. Safe same-origin page links are enhanced by `src/js/page-transitions.js`, which fetches the target page, swaps only `.main-content`, updates navigation and head metadata, and reactivates page-local scripts. This keeps the sidebar music player outside the swapped area so playback can continue across navigation.

Page scripts register cleanup for global listeners or timers in `window.pageTeardowns`. PJAX runs those functions before replacing the current content.

Every page must still work when loaded directly, without relying on PJAX.

---

## File Map

```
.github/workflows/deploy.yml       # GitHub Pages build and deploy workflow
.eleventy.js                       # Eleventy input/output and passthrough config
package.json                       # npm scripts and Eleventy dependency
scripts/                           # Output measurement and integrity checks
VERIFY.md                          # Manual browser regression matrix
README.md                          # Contributor-facing project summary
DESIGN.md                          # This application design reference

src/
  _data/
    nav.json                       # Top-nav items
    site.json                      # Site title, subtitle, banner, default fonts
    build.js                       # Build-time updated date
    music.json                     # Music player playlist (title/artist/src/credit)
    characterQuotes.js             # Games dialogue data
    reddingtonQuotes.js            # Reddington quote data
    taothaoCards.json              # Tao Thao card content and art data
  _includes/
    base.njk                       # Shared document shell
    post.njk                       # Individual post layout
    partials/                      # Shared chrome, music pieces, story-player shell
    css/                           # Inlined page and one-off post styles
  posts/                           # Body-only post content and shared settings
  archive.njk                     # Complete month-grouped post archive
  random-index.njk                # Compact random-post URL index
  css/style.css                    # Global site styles
  js/site.js                       # Shared nav dropdown and scroll controls
  js/page-transitions.js           # PJAX-style nav enhancement
  js/random-post.js                # Lazy random encounter modal
  js/story-player.js               # Persistent beat-by-beat story modal
  img/                             # Published image assets
  music/                           # Published audio assets
  *.njk                            # Page templates

_site/                             # Build output, not source of truth
assets-work/                       # Local-only working files (gitignored)
```

---

## Pages

### Visible top-nav pages

| URL | Source | Purpose |
|---|---|---|
| `index.html` | `src/index.njk` | Home page and recent personal content |
| `about.html` | `src/about.njk` | Bio and personal context |
| `roadmap.html` | `src/roadmap.njk` | Goals and progress |
| `quotes.html` | `src/quotes.njk` | Quote collection |
| `taothao.html` | `src/taothao.njk` | Interactive Tao Thao card deck |
| `36ke.html` | `src/36ke.njk` | Native 36 Ke strategy page |
| `books.html` | `src/books.njk` | Book notes and reading list |
| `music.html` | `src/music.njk` | Music notes and current rotation |
| `games.html` | `src/games.njk` | Games page |
| `smooth.html` | `src/smooth.njk` | Pickup lines, puns, and dad jokes: a slot-machine and a filterable card grid |
| `archive.html` | `src/archive.njk` | Complete journal archive grouped by month |
| `links.html` | `src/links.njk` | Links and references |

Every file in `src/posts/` also publishes at `/posts/<slug>/`, with the date
prefix removed from the source filename.

### Hidden but built pages

| URL | Source | Purpose |
|---|---|---|
| `pearls.html` | `src/pearls.njk` | Pearl/gem color reference matching the Tao Thao card gems |
| `guestbook.html` | `src/guestbook.njk` | Decorative guestbook page |

Hidden pages should not be added to `src/_data/nav.json`. Link to them directly from relevant content when needed.

---

## Navigation

`src/_data/nav.json` is the source of truth for the top nav.

Each visible page should define:

```yaml
layout: base.njk
title: "Page Title ~ Hung's Journal"
navActive: page.html
permalink: page.html
```

`navActive` is the root page filename without the leading slash. URLs in
`nav.json` are root-relative so `HtmlBasePlugin` can apply the deployment path
prefix. The nav partial handles direct-load state; PJAX compares resolved URL
pathnames after navigation.

A top-level nav item may include an optional `title` field. When present, the rendered link gets both a `title` tooltip and an `aria-label` from it. This exists so a tab whose visible `label` is icon-led (for example the `smooth.html` tab) still has an accessible name and a hover hint. The `smooth.html` tab keeps a readable word in its label; the `title` is there as a safety net rather than a requirement.

To create a hidden built page, keep the front matter and permalink, but omit it from `nav.json`.

---

## Visual System

The global visual system lives mostly in `src/css/style.css`.

Core direction:

- Retro/Y2K personal-site feel.
- Pixel-style typography with `VT323` and `Press Start 2P` as defaults.
- Shared chrome: marquee, banner, left sidebar, nav tabs, content card area, footer.
- Compact, information-first page layouts rather than marketing-style landing pages.
- Feature pages can introduce scoped local styles when their visual world is genuinely different.

Page-specific visual worlds:

- `taothao.html` uses a dark fantasy card-table style with gold borders, glowing gems, animated atmosphere, and card flip interactions.
- `36ke.html` uses a compact classical strategy layout with a dragon image background, gold/red accents, one strategy row per line, and native expandable rows.
- `pearls.html` isolates the Tao Thao gem/pearl colors into a color-reference gallery with names and hex codes.

---

## Core Features

### Shared layout

All pages render through `base.njk`, which includes:

- Global fonts and stylesheet.
- `src/js/site.js`.
- Marquee.
- Header.
- Data-driven nav.
- Sidebar.
- Main content slot.
- Footer.
- Music player script.
- PJAX page transition script.
- Reusable story-player dialog.

### Music player

The sidebar music player is a data-driven playlist player. The track list lives in `src/_data/music.json`; the markup is rendered by `sidebar-music.njk` and wired up by `music-player-script.njk`. Because the player sits in the sidebar (outside `.main-content`), PJAX never swaps it, so playback continues across navigation.

Current behavior:

- User-initiated playback only.
- Multi-track playlist rendered from `music.json`; each track is a real `<a href>` row, and the script reads track URLs from the DOM-resolved `href` (no hard-coded paths, prefix-safe).
- Play/pause, previous, and next (previous restarts the current track once past 3s).
- Three playback modes on one cycling button: repeat-all (default), repeat-one (native `audio.loop`, gapless), and shuffle (random other track, never the same one twice in a row). The mode persists in `localStorage`.
- Scrubbable seek bar with elapsed/total time.
- Volume slider and mute toggle; volume persists in `localStorage`.
- Active-row highlight, animated equalizer, and a per-track credit link.
- MediaSession metadata and handlers (lock-screen / headphone / media-key controls).
- Error state if audio cannot load.
- Degrades cleanly to a single track: prev/next/shuffle simply stay on the one track.

To add a track: drop an ASCII-slug `.opus` into `src/music/` and add a `{ title, artist, src, credit, creditLabel }` entry to `src/_data/music.json` (`src` is root-relative, e.g. `/music/song.opus`).

Audio under `src/music/` is copied into `_site/music/`, so everything in that directory is published. Policy (decided 2026-06-12): published audio is committed to the repo as `.opus` with an ASCII slug filename; MP3 working files are gitignored and live in `assets-work/music/`, never in `src/music/`. Published tracks: `src/music/manh-ba-2.opus` ("Mạnh Bà") and `src/music/canon-in-d.opus` ("Canon in D").

### Last updated display

`src/_data/build.js` creates the build date once during Eleventy rendering. The
marquee emits it directly, so page loads do not depend on the GitHub API.

### PJAX-style navigation

`src/js/page-transitions.js` enhances safe same-origin page links inside the
persistent page wrapper. External links, downloads, hashes, media links, and
modified clicks retain normal browser behavior.

It:

- Fetches the destination HTML.
- Replaces `.main-content`.
- Re-runs page-local scripts inside the new content.
- Updates `document.title`, description, Open Graph state, canonical URL,
  body classes, and page-specific fonts.
- Updates the active nav class.
- Handles browser back/forward.

Page-local element listeners disappear with `.main-content`. Any script that
creates a timer or attaches to `document` or `window` must push a cleanup
function into `window.pageTeardowns`. PJAX runs and clears that registry before
the swap. Tao Thao, Smooth, and Games follow this contract.

### Post publishing

`src/posts/posts.json` assigns the `post.njk` layout and the
`posts/{{ page.fileSlug }}/index.html` permalink. Each post provides title,
date, description, display title/date, optional mood, tags, and optional
`postClass`, followed by body-only HTML. The shared post card partial renders
the same semantic `<article>` on Home and individual post pages.

Home renders only the newest 10 posts. `archive.html` lists every post grouped
by month. This keeps Home bounded while preserving complete access.

### Random encounter

`random-index.njk` generates a compact JSON array of post URLs.
`random-post.js` fetches that index only when the die is opened, then fetches
and extracts the selected post article. It caches the index, avoids immediate
repeats, and falls back to the selected post URL when its HTML request fails.
Feature pages may continue to declare a local `[data-rp-source]` for synchronous
draws from filtered page content.

No full post content is embedded in the shared shell.

### Story player

`story-player.njk` provides one persistent full-screen dialog outside
`.main-content`. A post opts in with a launch button marked `[data-story-open]`
and an inert `<template data-story-source>` containing ordered
`[data-story-beat]` sections. `story-player.js` clones one beat at a time into
the dialog, updates progress, traps focus, restores focus on close, and supports
Back, Next, Escape, arrow keys, Page Up/Down, Home/End, and Space.

The shell persists across PJAX swaps, but closes before newly navigated content
is shown. Since the source travels with the post article, the experience works
on the individual post, Home, and inside a fetched random encounter. The
ordinary post text remains the no-JavaScript fallback. Reduced-motion users get
the same content and controls without scene transitions.

### Tao Thao card deck

Source:

- Page shell and interaction: `src/taothao.njk`
- Card data: `src/_data/taothaoCards.json`

Behavior:

- Card data renders the initial card server-side.
- Inline JSON feeds the browser-side deck controls.
- Previous/next buttons, side arrows, thumbnails, keyboard arrows, swipe navigation, and card flipping are supported.
- The card face uses per-card `artColors`, `artShapes`, and `rune`.
- Gem colors are assigned by card index from the page-local gem palette. All gems on one card share the same color; different cards receive different colors in an alternating spectrum.
- Reduced-motion preferences disable decorative motion where appropriate.

### Pearls color reference

Source:

- `src/pearls.njk`

Behavior:

- Built as `pearls.html` but hidden from the top nav.
- Uses the same pearl/gem visual format as the Tao Thao card gems.
- Annotates each pearl with a color name and the primary inner hex code.
- Acts as the reference page for expanding or adjusting card gem colors.

### 36 Ke page

Source:

- `src/36ke.njk`
- `src/img/chineseDragon1.jpg`

Behavior:

- Built as `36ke.html` and visible in the top nav.
- Contains six chapters and all 36 strategies.
- Uses a compact hero so the page can fit naturally inside the main blog layout.
- Shows one strategy per long row, with the short sentence on the row.
- Uses native `<details>` and `<summary>` for expandable explanations and examples.
- Requires no runtime JavaScript.

### Smooth page

Source:

- Page shell, line data, and script: `src/smooth.njk`
- Scoped styles: `src/_includes/css/smooth.css` (inlined on the page)

Behavior:

- Built as `smooth.html` and visible in the top nav.
- Holds a single data array of one-liners; each entry carries a category, a smoothness score, and a cheese rating. The slot-machine, the card grid, and the random-post die all read from the rendered cards, so the array is the one source of truth.
- The SMOOTH-O-MATIC machine deals a random line with a spin animation and an animated smoothness meter.
- The grid supports category-chip filtering and free-text search.
- The slot-machine and the random-post die both draw only from lines currently visible in the grid, so they respect the active filter. The die selector uses `:not(.smooth-hidden)` for this.
- Page-local script is a PJAX-safe IIFE. The copy-to-clipboard handler is a single document-level delegated listener guarded by `window.__smoothCopyBound`, so cloned cards in the die popup can also be copied. Any in-flight spin interval is cleared through the shared `window.pageTeardowns` contract.
- Internal file, class, and id names use the `smooth` token to match the visible name. The legacy working name during development was "rizz"; no `rizz` token should remain.

---

## Build And Deploy

Local commands:

```bash
npm install
npm start
npm run build
```

Deployment is defined in `.github/workflows/deploy.yml`.

On push to `main`, GitHub Actions:

1. Checks out the repo.
2. Sets up Node 20.
3. Runs `npm ci`.
4. Runs `npm run build`.
5. Runs `npm run check` for metadata, link, post-schema, random-index, and size invariants.
6. Uploads `_site/` as a Pages artifact.
7. Deploys to GitHub Pages.

---

## Change Guidelines

- Treat `src/` as source of truth. Do not hand-edit `_site/`.
- Use shared layout/partials for chrome changes.
- Use `src/_data/nav.json` for top-nav changes.
- Keep hidden pages out of `nav.json`.
- Put reusable site-wide styles in `src/css/style.css`.
- Keep highly specific feature-page styles scoped by `pageClass`.
- Keep one-off decorated-post styles with that post, not in the global stylesheet.
- Write internal links and asset paths as root-relative URLs so the configured
  path prefix is applied at build time.
- Prefer static HTML and native browser behavior before adding JavaScript.
- Register cleanup for page timers and global listeners in `window.pageTeardowns`.
- When adding new assets, place them under the matching `src/img`, `src/js`, `src/css`, or `src/music` folder so Eleventy copies them.
- Run `npm run build && npm run check` before considering a change complete.

---

## Verification Checklist

Before deploying meaningful changes:

- `npm run build` completes successfully.
- `npm run check` completes successfully.
- Direct-load each touched page by its generated URL.
- Direct-load at least one nested post page under `/hung-blog/posts/`.
- Navigate to touched pages through the top nav.
- Confirm hidden pages still build if they were touched.
- Confirm the music player can start, pause, seek, change volume, and continue across nav transitions.
- Confirm `taothao.html` still supports flip, prev/next, thumbnails, keyboard arrows, and swipe after PJAX navigation.
- Confirm `36ke.html` rows expand/collapse and the dragon image renders.
- Confirm the random encounter works with both fetched posts and local page sources.
- Check a narrow viewport for text overflow or broken layout.

---

## Non-Goals

- No backend server.
- No database.
- No CMS.
- No analytics by default.
- No client-side app framework.
- No dependency on legacy prototypes (`assets-work/plan_sample/`) for production output.
- No dynamic guestbook submissions unless a separate design introduces a hosted comment system.

---

## Rollback

If a deployed change breaks the site, revert the commit on `main`. GitHub Actions will rebuild and redeploy the previous static output.
