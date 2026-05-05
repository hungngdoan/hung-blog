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

### Audio hosting strategy: GitHub Releases

MP3 files are **not committed to git**. They are hosted as GitHub Release assets to avoid git history bloat. The `music/` directory is gitignored (`music/*.mp3`). A local copy can live in `music/` for testing, but the production `<audio src>` points to a GitHub Release URL.

#### Why not commit mp3s directly?

Git stores every version of every file in history permanently. Even if you delete and replace a file, the old blob stays in `.git/objects/`. Swapping one 5MB song weekly means ~260MB of dead weight in history after a year. `git clone` downloads all of it every time. GitHub Releases don't have this problem -- deleting a release asset actually frees the storage.

#### GitHub Releases limits (free tier)

| Limit | Value |
|---|---|
| Max file size per asset | 2GB |
| Total release storage | Shares repo soft limit (~1GB), loosely enforced |
| Bandwidth (public repos) | No cap |
| Cost | Free for public repos |

At 5MB per song, you can host 200 songs before approaching 1GB. For a personal blog, this is effectively unlimited.

#### How to upload a new song

1. Go to the repo on GitHub -> **Releases** -> **Create a new release**
2. Tag: use a sequential tag like `music-v1`, `music-v2`, etc.
3. Title: song name and artist (e.g. "Cloud 9 - Tobu")
4. Drag the mp3 file into the **Attach binaries** area
5. Click **Publish release**
6. Right-click the uploaded file link -> **Copy link address**
7. Update two things in `index.html`:
   - The `src` attribute on the `<audio id="musicAudio">` element
   - The song title text inside `.music-title-scroll`

The release URL format is:
```
https://github.com/hungngdoan/hung-blog/releases/download/<tag>/<filename>
```

Example:
```
https://github.com/hungngdoan/hung-blog/releases/download/music-v1/Tobu-Cloud9.mp3
```

#### How to swap the current song

1. Upload the new mp3 as a new release (e.g. `music-v2`)
2. Update `index.html` with the new release URL and song title
3. Commit and push the HTML change (a few bytes, no audio in git)
4. The old release stays on GitHub as an archive (or delete it if you want)

#### Scaling to 100+ songs

If the library grows large, organize releases by batches rather than one-per-song:

| Scale | Strategy |
|---|---|
| 1-20 songs | One release per song. Tags: `music-v1`, `music-v2`, etc. Easy to browse on the Releases page. |
| 20-100 songs | Batch releases by month or quarter. Tag: `music-2026-q2`. Attach multiple mp3s to a single release. Reduces clutter on the Releases page. |
| 100+ songs | Consider migrating to Cloudflare R2 (10GB free, no egress fees) or Backblaze B2 (10GB free). At this scale you are building a music library, not a "song of the day" widget. The player UI would also need to evolve into a playlist/selector, which is a separate design effort. |

#### Cleanup

- Deleting a release on GitHub permanently removes the assets. No history bloat.
- Old release URLs will 404 after deletion. Make sure the current `<audio src>` in `index.html` always points to a live release.
- The `music/` folder is gitignored. Local mp3s are for testing only and won't be pushed.

#### Local development

Keep a copy of the current song in `music/` for local testing. The `<audio>` element works with both local paths and full URLs. When developing locally, you can temporarily set `src="music/Tobu-Cloud9.mp3"`. Before pushing, switch it back to the GitHub Release URL.

### Constraints

- MP3 files should be under 10MB per track for reasonable streaming on slow connections
- Only one track at a time; this is not a playlist player
- GitHub Releases shares the repo's ~1GB soft storage limit
- Release asset URLs are public; do not upload copyrighted material you don't have rights to distribute

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
