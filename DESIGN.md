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
  links.html        <-- links and blogroll
  guestbook.html    <-- decorative guestbook
  css/style.css     <-- shared stylesheet
  img/              <-- shared image assets
  README.md     <-- project description
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

## Non-Goals

- No CMS
- No JavaScript frameworks
- No server-side logic
- No database
- No analytics (unless added later via simple script tag)

---

## Rollback

If something breaks: revert the commit on `main`. GitHub Pages redeploys from the previous state automatically.
