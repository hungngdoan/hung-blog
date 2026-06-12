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
    partials/                 # marquee, header, nav, sidebar, footer, music player
    css/                      # Per-page CSS, inlined at build time via include
  _data/
    site.json                 # Site metadata (title, url, description, banner)
    nav.json                  # Navigation items
  posts/                      # One file per journal post, rendered on the homepage
    posts.json                # Shared post settings (tags, no standalone pages)
  index.njk                   # Homepage: warp zone + post loop + guestbook teaser
  about.njk, ...              # Other pages (front matter + unique content only)
  404.njk                     # Self-contained 404 page (works at any URL depth)
  css/style.css               # Global stylesheet
  js/site.js                  # Last-updated script
  js/page-transitions.js      # PJAX content swapping
  img/                        # Published images only (referenced by the site)
  music/                      # Published audio files
assets-work/                  # Local-only working files (gitignored): image
                              # sources, debug crops, extraction scripts, old
                              # prototypes (former plan_sample/)
_site/                        # Build output (gitignored)
.eleventy.js                  # Eleventy config
```

## Writing a new post

Add a file to `src/posts/` named `YYYY-MM-DD-slug.njk` with front matter and
the usual `<article class="blog-post">` markup:

```
---
title: "Post Title"
date: 2026-06-10T12:00:00Z
---
<article class="blog-post">
  ...
</article>
```

The homepage lists all posts newest-first using the `date` field. For multiple
posts on the same day, give the post that should appear higher a later time.
Posts do not get standalone pages (`permalink: false` in `posts.json`), so the
published site structure is unchanged.

## Music and NCS tracks

Music files are third-party copyrighted works unless noted otherwise. "NoCopyrightSounds" does not mean public domain or copyright-free; NCS tracks are licensed under NCS's current usage policy, which generally allows independent creators to use NCS music in credited user-generated content.

For any NCS song used on this site:

- Verify the track is still available from an official NCS source before publishing.
- Credit the artist, track title, NoCopyrightSounds, and the official NCS download/stream or watch link.
- Do not treat local files in `music/` as part of this site's own license.
- Do not redistribute NCS music separately from permitted content unless you have the right license.

Current music-player track:

- `src/music/manh-ba-2.opus` ("Mạnh Bà" by Linh Hương Luz) -- committed to the repo and copied to `_site/music/` by Eleventy. The player is wired up in `src/_includes/partials/sidebar-music.njk`. Audio filenames stay ASCII slugs; the display title and credit link carry the real name.
- MP3s are local working files only: `src/music/*.mp3` is gitignored, so they are neither committed nor deployed. Keep them in `assets-work/music/`. Verify exact official title, artist credit, and current NCS availability before publishing any NCS MP3.

## Fan art and nostalgia assets

Some profile/avatar imagery references Mega Man X4 / Zero purely for personal nostalgia and fun. This site is non-commercial, makes no profit from those assets, and is not affiliated with or endorsed by Capcom. Mega Man, Mega Man X, Zero, and related characters/artwork belong to their respective rights holders.

## Philosophy

"We plan, but heaven decides. Doesn't mean we stop planning though."
