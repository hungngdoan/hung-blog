# Eleventy Migration Plan

## Goal

Migrate the static HTML blog to Eleventy (11ty) to eliminate duplicated layout across 9 pages, without changing any styles or visual output.

## Current Architecture

9 static HTML pages sharing an identical shell (marquee, header, nav, sidebar, footer) with per-page differences in title, nav active state, and main content. A few pages have unique extras (music player, visitor counter, extra fonts).

## New Directory Structure

```
hung-blog/
  src/
    _includes/
      base.njk                    # Full HTML shell layout
      partials/
        marquee.njk               # Scrolling marquee bar
        header.njk                # Site title, subtitle, banner
        nav.njk                   # Navigation with active state logic
        sidebar.njk               # Avatar, stats, hangouts, quests
        sidebar-music.njk         # Music player widget (all pages)
        footer.njk                # Footer with optional visitor counter
        music-player-script.njk   # Inline music player JS (all pages)
    _data/
      site.json                   # Site-wide metadata (title, subtitle, banner, etc.)
      nav.json                    # Navigation items array
    index.njk                     # Home page (unique content only)
    about.njk
    entries.njk
    books.njk
    music.njk
    games.njk
    links.njk
    guestbook.njk
    roadmap.njk
    css/
      style.css                   # Passthrough copy (untouched)
    js/
      site.js                     # Passthrough copy (untouched)
      page-transitions.js         # PJAX content swapping for persistent music
    img/                          # Passthrough copy
    music/                        # Passthrough copy
  _site/                          # Build output (gitignored)
  .eleventy.js                    # Eleventy config
  package.json
```

## Per-Page Variations

Each page sets front matter variables. Most pages only need `title`, `navActive`, and `permalink`.

| Variable             | Default          | Override on    | Purpose                          |
| -------------------- | ---------------- | -------------- | -------------------------------- |
| `layout`             | `base.njk`       | (all pages)    | Shared layout template           |
| `title`              | -                | (all pages)    | `<title>` tag content            |
| `navActive`          | -                | (all pages)    | Which nav link gets `.active`    |
| `permalink`          | -                | (all pages)    | Output filename (e.g. about.html)|
| `showVisitorCounter` | `false`          | index          | Footer visitor counter           |
| `marqueeText`        | standard text    | index          | Custom emoji marquee variant     |
| `fontsUrl`           | default 2 fonts  | about          | Extra Comic Neue font            |

Note: `showMusicPlayer` has been removed — the music player is now part of the shared sidebar on all pages (see "Persistent Music Player" section below).

## Template Details

### base.njk

Full HTML document shell consuming front matter variables:

```nunjucks
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ title }}</title>
    <link href="{{ fontsUrl if fontsUrl else site.defaultFontsUrl }}" rel="stylesheet" />
    <link rel="stylesheet" href="css/style.css" />
    <script src="js/site.js" defer></script>
  </head>
  <body>
    {% include "partials/marquee.njk" %}
    <div class="page-wrapper">
      {% include "partials/header.njk" %}
      {% include "partials/nav.njk" %}
      <div class="content-grid">
        {% include "partials/sidebar.njk" %}
        <main class="main-content">
          {{ content | safe }}
        </main>
      </div>
      {% include "partials/footer.njk" %}
    </div>
    {% include "partials/music-player-script.njk" %}
    <script src="js/page-transitions.js" defer></script>
  </body>
</html>
```

### nav.njk

Loops over `nav.json` and applies active class:

```nunjucks
<nav class="nav-bar">
  {% for item in nav %}
    <a href="{{ item.url }}"{% if item.url == navActive %} class="active"{% endif %}>{{ item.label }}</a>
  {% endfor %}
</nav>
```

### sidebar.njk

The music player is always included (no longer index-only) so it persists across page transitions:

```nunjucks
{% include "partials/sidebar-music.njk" %}
```

### footer.njk

Conditionally includes the visitor counter:

```nunjucks
{% if showVisitorCounter %}
  <p class="footer-counter">...</p>
{% endif %}
```

### Example Page (about.njk)

```nunjucks
---
layout: base.njk
title: "About ~ Hung's Journal"
navActive: about.html
fontsUrl: "https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&family=Comic+Neue:wght@400;700&display=swap"
permalink: about.html
---

<section class="page-section">
  <h2>About Me</h2>
  <!-- unique about content only -->
</section>
```

## Persistent Music Player & Page Transitions

### Problem

Currently, navigating between pages causes a full page reload, which stops any playing music. The music player also only exists on the index page.

### Solution

Two changes work together:

1. **Music player on all pages** — Move the music player widget from index-only to the shared `sidebar.njk` partial, so it appears on every page alongside Stats, Hangouts, and Quests.

2. **PJAX-style page transitions** — A small JS script (`page-transitions.js`) intercepts nav link clicks and swaps only the `<main>` content + updates the active nav state, without reloading the full page. The sidebar (including the music player) stays alive.

### page-transitions.js

```js
(function () {
  document.addEventListener("click", function (e) {
    const link = e.target.closest(".nav-bar a");
    if (!link || link.origin !== location.origin) return;
    e.preventDefault();

    fetch(link.href)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");

        // Swap main content
        var newMain = doc.querySelector(".main-content");
        document.querySelector(".main-content").replaceWith(newMain);

        // Update active nav link
        document.querySelectorAll(".nav-bar a").forEach(function (a) {
          a.classList.remove("active");
        });
        link.classList.add("active");

        // Update document title
        document.title = doc.title;

        // Update URL without reload
        history.pushState(null, "", link.href);
      });
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", function () {
    fetch(location.href)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        document.querySelector(".main-content").replaceWith(
          doc.querySelector(".main-content")
        );
        document.title = doc.title;

        var current = location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav-bar a").forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === current);
        });
      });
  });
})();
```

### Directory Structure Update

```
src/
  js/
    site.js                     # Existing (passthrough)
    page-transitions.js         # New — PJAX content swapping
```

### What Changes From the Original Plan

- `sidebar-music.njk` is always included in `sidebar.njk` (not conditional)
- `music-player-script.njk` is always included in `base.njk` (not conditional)
- `showMusicPlayer` front matter variable is removed
- New `page-transitions.js` added and loaded in `base.njk`

## Implementation Steps

1. `npm init -y` + `npm install --save-dev @11ty/eleventy`
2. Create `.eleventy.js` config (input: `src/`, output: `_site/`, passthrough copies for css/js/img/music)
3. Create `src/_data/site.json` and `src/_data/nav.json`
4. Create `base.njk` layout + all partials
5. Convert simplest page first (`entries.njk`) and verify visual match
6. Convert remaining simple pages: links, guestbook, roadmap, books, music, games
7. Convert `about.njk` (tests `fontsUrl` override)
8. Convert `index.njk` last (most complex: visitor counter, custom marquee)
9. Create `page-transitions.js` for PJAX content swapping
10. Move `css/`, `js/`, `img/`, `music/` into `src/`
11. Verify all 9 pages match originals visually
12. Test music playback persists across page navigation
13. Delete original root-level HTML files
14. Update `.gitignore` to add `node_modules/` and `_site/`
15. Add GitHub Actions workflow for deployment

## GitHub Actions Deployment

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site
      - id: deployment
        uses: actions/deploy-pages@v4
```

After adding this workflow, go to repo Settings > Pages and set source to "GitHub Actions".

## Risks and Notes

- **HTML entity escaping**: Use `| safe` filter for subtitle content containing `&#12539;` to prevent double-escaping
- **Sidebar text normalization**: Minor quest wording differences across pages will be unified to one canonical version
- **URL preservation**: Each page must set `permalink: pagename.html` to avoid Eleventy's default `pagename/index.html` output pattern
- **Deployment model change**: Goes from pushing static files to CI-builds-then-deploys via GitHub Actions
- **`data-last-updated` script**: The `js/site.js` script depends on `<time data-last-updated>` being present in the marquee partial — must be preserved
