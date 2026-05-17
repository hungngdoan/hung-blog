# Hung's Journal

Blog: https://hungngdoan.github.io/hung-blog/

Guestbook page (hidden from top nav): https://hungngdoan.github.io/hung-blog/guestbook.html

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
  _data/
    site.json                 # Site metadata
    nav.json                  # Navigation items
  index.njk, about.njk, ...  # Pages (front matter + unique content only)
  css/style.css               # Stylesheet
  js/site.js                  # Last-updated script
  js/page-transitions.js      # PJAX content swapping
  img/                        # Images
  music/                      # Published audio files
_site/                        # Build output (gitignored)
.eleventy.js                  # Eleventy config
```

## Music and NCS tracks

Music files are third-party copyrighted works unless noted otherwise. "NoCopyrightSounds" does not mean public domain or copyright-free; NCS tracks are licensed under NCS's current usage policy, which generally allows independent creators to use NCS music in credited user-generated content.

For any NCS song used on this site:

- Verify the track is still available from an official NCS source before publishing.
- Credit the artist, track title, NoCopyrightSounds, and the official NCS download/stream or watch link.
- Do not treat local files in `music/` as part of this site's own license.
- Do not redistribute NCS music separately from permitted content unless you have the right license.

Current music-player track:

- `src/music/Tobu-Cloud9.mp3` -- copied to `_site/music/Tobu-Cloud9.mp3` by Eleventy. Verify the exact official title, artist credit, and current NCS availability before changing or deploying the MP3.

## Fan art and nostalgia assets

Some profile/avatar imagery references Mega Man X4 / Zero purely for personal nostalgia and fun. This site is non-commercial, makes no profit from those assets, and is not affiliated with or endorsed by Capcom. Mega Man, Mega Man X, Zero, and related characters/artwork belong to their respective rights holders.

## Philosophy

"We plan, but heaven decides. Doesn't mean we stop planning though."
