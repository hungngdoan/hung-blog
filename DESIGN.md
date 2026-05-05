# Design Doc: hung-blog GitHub Pages Deployment

**Author:** Hung Doan
**Date:** 2026-05-03
**Status:** Draft

---

## Objective

Deploy a static personal site to GitHub Pages so it is publicly accessible via URL. No frameworks, no build tools, no backend.

---

## Current State

- Multi-page static site served directly by GitHub Pages
- Shared stylesheet at `css/style.css`
- Shared image assets in `img/`
- Git repo on GitHub, branch `main`
- No framework, build step, backend, or deployment pipeline

## Target State

- Site live at `https://hungngdoan.github.io/hung-blog/`
- Any push to `main` auto-deploys within 2 minutes
- Zero ongoing cost

---

## Architecture

```
GitHub Repo (main branch)
    |
    v
GitHub Pages (static file serving)
    |
    v
Public URL --> index.html
```

There is no build step. GitHub Pages serves HTML, CSS, and image files directly from the repo root.

---

## Implementation Steps

### Step 1: Verify repo structure

Ensure repo root contains:

```
hung-blog/
  index.html        <-- home/posts page
  about.html        <-- bio, stats, quests, personal context
  entries.html      <-- blog entries archive
  links.html        <-- links and blogroll
  guestbook.html    <-- decorative guestbook
  css/style.css     <-- shared stylesheet
  img/              <-- shared image assets
  music/            <-- mp3 assets for song-of-the-day player
  README.md         <-- project description
```

No build config is required.

### Step 2: Push to main

Merge `daily-updates` branch into `main` (or push directly to `main`).

### Step 3: Enable GitHub Pages

1. Go to repo on GitHub
2. Settings > Pages
3. Source: "Deploy from a branch"
4. Branch: `main`
5. Folder: `/ (root)`
6. Save

### Step 4: Verify deployment

- Wait 1-2 minutes
- Visit `https://hungngdoan.github.io/hung-blog/`
- Confirm the page renders correctly

---

## Adding Content (ongoing)

To update the site:

1. Edit the relevant HTML page
2. Edit `css/style.css` for shared visual changes
3. Push to `main`
4. Site updates automatically in ~60 seconds

No build step. No CI. No templating. Just edit static files and push.

---

## Future Considerations (do NOT implement now)

| If this happens | Then consider |
|---|---|
| Writing 3+ posts/week gets tedious | Migrate to Hugo or 11ty |
| Want a custom domain (e.g. hung.dev) | Buy domain, configure CNAME in repo settings |
| Want comments/guestbook to work | Add Giscus (GitHub-backed comments) |
| Shared page shell gets tedious | Consider Hugo, 11ty, or a tiny static include workflow |

---

## Music Player: Song of the Day

**Added:** 2026-05-04

### Purpose

A sidebar widget that lets visitors play a single featured track directly on the homepage. Positioned immediately below the avatar/profile box to reinforce the personal, expressive feel of the site. The design leans into the retro anime fansite aesthetic already established by the rest of the layout.

### Components

| File | What was added |
|---|---|
| `index.html` | `music-box` sidebar section with `<audio>` element, play/pause button, progress bar, volume slider, and inline `<script>` |
| `css/style.css` | `.music-*` class family: scrolling title marquee, circular play button with glow states, gradient progress bar, range-input volume slider with cross-browser thumb styling |
| `music/` | Directory for mp3 assets (not checked into git by default) |

### Design decisions

- **No autoplay.** Browsers block it, and it is hostile UX. Visitor must click play.
- **Scrolling title.** The sidebar is 225px wide. Song titles overflow. A CSS marquee animation handles this without JS, matching the site's existing marquee bar aesthetic.
- **Volume control with mute toggle.** Clicking the music note icon toggles mute and remembers the previous volume level. The range slider gives fine-grained control.
- **Click-to-seek on progress bar.** Maps click position to `audio.currentTime` proportionally. No drag-seek (unnecessary complexity for a single-track widget).
- **No external dependencies.** Pure HTML5 Audio API + vanilla JS (~60 lines, IIFE-scoped). No libraries, no build step.
- **Accessible.** Play button and volume slider have `aria-label` attributes. Keyboard-operable via native button and range input semantics.

### How to update the song

1. Replace `music/song-of-the-day.mp3` with the new track
2. Edit the song title text in the `.music-title-scroll` div in `index.html`
3. If the filename changes, update the `src` attribute on the `<audio>` element

### Constraints

- MP3 files should not be excessively large; target under 5MB for reasonable page load on GitHub Pages
- Only one track at a time; this is not a playlist player
- GitHub Pages has a 100MB repo size soft limit; audio files count toward this

---

## Non-Goals

- No CMS
- No JavaScript frameworks
- No server-side logic
- No database
- No analytics (unless added later via simple script tag)

---

## Rollback

If something breaks: revert the commit on `main`. GitHub Pages redeploys from the previous state automatically.
