# Hung's Journal

Blog: https://hungngdoan.github.io/hung-blog/

A freestyle personal site -- retro/Y2K-inspired, built with Eleventy (11ty).

## What is this

A personal corner of the internet where I write about whatever I feel like:

- Life updates, goals, and reflections
- Fitness progress and gym logs
- Coding and software engineering thoughts
- Cat pics (eventually)
- Hobbies -- fish keeping, games, books
- Philosophy and random musings

## Tech

- [Eleventy (11ty)](https://www.11ty.dev/) static site generator with Nunjucks templates
- Shared layout (`base.njk`) + partials eliminate duplicated HTML across 9 pages
- PJAX page transitions so the music player keeps playing across navigation
- Retro aesthetic: pixel art, glow effects, starfield background, marquee
- Fonts: VT323, Press Start 2P
- Deployed via GitHub Actions to GitHub Pages

## Nostalgic 9x Vietnamese text style

For a nostalgic Vietnamese 9x/Y2K mood, the site can use decorative Unicode text like:

`ᥫ᭡Trͬướcͨ saͣuͧ nhͪư mͫộtͭ mͫộtͭ mͫìnhͪ aͣnhͪᥫ᭡`

This is not a standalone font. It is regular text styled with Unicode decoration characters and combining marks, similar to Zalgo or fancy Unicode text. The base letters still render with the reader's normal font, while marks such as `ͬ`, `ͨ`, `ͣ`, `ͧ`, `ͪ`, `ͫ`, and `ͭ` create the nostalgic embellished look.

Useful generators for this style:

- LingoJam Zalgo Text Generator -- best match for floating marks above letters, with a "crazy" intensity slider.
- LingoJam Glitch Text Generator -- good for distorted, noisy, broken-letter effects.
- LingoJam Fancy Text Generator -- useful for softer decorative Unicode variants.
- FSymbols Font Generator -- useful for extra symbols and wrappers.
- CoolSymbol Fancy Text Generator -- useful for hearts, stars, flowers, and other sentence decorations.

Basic workflow:

1. Type the normal Vietnamese sentence.
2. Choose a Zalgo or Glitch style and copy the generated Unicode result.
3. Use FSymbols or CoolSymbol to add decorations around the sentence, such as `ᥫ᭡`, `♡`, `✿`, `☆`, `ꕤ`, `ღ`, `✧`, or `༺༻`.

## Getting Started

```bash
npm install          # install dependencies (first time only)
npm start            # dev server with live reload (for local development)
npm run build        # build to _site/ (used by CI for deployment)
```

## Navigation

Main navigation is driven by `src/_data/nav.json`.

Some pages are intentionally built but hidden from the top nav:

- `pearls.html`
- `guestbook.html`

Keep hidden pages out of `nav.json`; link to them from relevant content when needed.

## Structure

```
src/
  _includes/
    base.njk                  # Shared HTML layout
    post.njk                  # Individual post page layout
    partials/                 # shared chrome, music player, story-player shell
    css/                      # Per-page CSS, inlined at build time via include
  _data/
    site.json                 # Site metadata (title, url, description, banner)
    nav.json                  # Navigation items
  posts/                      # Body-only journal entries with structured front matter
    posts.json                # Shared collection, layout, and permalink settings
  index.njk                   # Homepage: newest 10 posts + guestbook teaser
  archive.njk                 # Complete month-grouped post archive
  random-index.njk            # Compact random-post URL index
  about.njk, ...              # Other pages (front matter + unique content only)
  404.njk                     # Self-contained 404 page (works at any URL depth)
  css/style.css               # Global stylesheet
  js/site.js                  # Last-updated script
  js/page-transitions.js      # PJAX content swapping
  js/random-post.js           # Lazy random encounter modal
  js/story-player.js          # Beat-by-beat narrative dialog
  img/                        # Published images only (referenced by the site)
  music/                      # Published audio files
assets-work/                  # Local-only working files (gitignored): image
                              # sources, debug crops, extraction scripts, old
                              # prototypes (former plan_sample/)
_site/                        # Build output (gitignored)
.eleventy.js                  # Eleventy config
scripts/                      # Build measurement and integrity checks
```

## Writing a new post

Add a file to `src/posts/` named `YYYY-MM-DD-slug.njk`. Post files contain
front matter plus body content only. The shared layout renders the article,
heading, date, mood, tags, and archive link:

```
---
title: "Post Title"
date: 2026-06-10T12:00:00Z
description: "One sentence for search, sharing, and the archive."
titleHtml: "&#128161; Post Title"
displayDate: "Jun 10th 2026"
moodHtml: "Mood: Focused | Quest: Keep Going"
postTags: ["#life", "#growth"]
---
<p>The post body starts here.</p>
```

The homepage lists the newest 10 posts. `archive.html` lists the complete
collection. Every post gets a stable URL at `/posts/<slug>/`, where Eleventy
removes the date prefix from the filename. For multiple posts on the same day,
give the post that should appear higher a later time.

Post bodies must not contain `<script>` or an outer `<article>`. A decorated
post may inline a scoped style include, as Two Plates does. Keep one-off post
styles out of the global stylesheet.

Internal assets and links must be root-relative, such as `/img/photo.png`.
Eleventy's HTML base plugin applies the `/hung-blog/` GitHub Pages prefix.

Before deployment, run:

```bash
npm run build
npm run check
npm run measure
```

## Music and NCS tracks

Music files are third-party copyrighted works unless noted otherwise. "NoCopyrightSounds" does not mean public domain or copyright-free; NCS tracks are licensed under NCS's current usage policy, which generally allows independent creators to use NCS music in credited user-generated content.

For any NCS song used on this site:

- Verify the track is still available from an official NCS source before publishing.
- Credit the artist, track title, NoCopyrightSounds, and the official NCS download/stream or watch link.
- Do not treat local files in `music/` as part of this site's own license.
- Do not redistribute NCS music separately from permitted content unless you have the right license.

The player is a data-driven playlist. The track list lives in `src/_data/music.json`; the markup is in `src/_includes/partials/sidebar-music.njk` and the logic in `src/_includes/partials/music-player-script.njk`. To add a track, drop an ASCII-slug `.opus` into `src/music/` and add a `{ title, artist, src, credit, creditLabel }` entry to `music.json` (`src` is root-relative, e.g. `/music/song.opus`).

Current music-player tracks:

- `src/music/manh-ba-2.opus` ("Mạnh Bà" by Linh Hương Luz) -- committed and copied to `_site/music/` by Eleventy.
- `src/music/canon-in-d.opus` ("Canon in D") -- committed and copied to `_site/music/` by Eleventy.
- Audio filenames stay ASCII slugs; the display title and per-track credit link carry the real name.
- MP3s are local working files only: `src/music/*.mp3` is gitignored, so they are neither committed nor deployed. Keep them in `assets-work/music/`. Verify exact official title, artist credit, and current NCS availability before publishing any NCS MP3.

## Fan art and nostalgia assets

Some profile/avatar imagery references Mega Man X4 / Zero purely for personal nostalgia and fun. This site is non-commercial, makes no profit from those assets, and is not affiliated with or endorsed by Capcom. Mega Man, Mega Man X, Zero, and related characters/artwork belong to their respective rights holders.

## Philosophy

"We plan, but heaven decides. Doesn't mean we stop planning though."
