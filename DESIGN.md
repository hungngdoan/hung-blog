# Design Doc: hung-blog GitHub Pages Deployment

**Author:** Hung Doan
**Date:** 2026-05-03
**Status:** Draft

---

## Objective

Deploy a static personal site to GitHub Pages so it is publicly accessible via URL. No frameworks, no build tools, no backend.

---

## Current State

- 9-page static site served directly by GitHub Pages
- Pages: index, about, roadmap, books, music, games, links, guestbook, entries
- Shared stylesheet at `css/style.css` (CSS custom properties: `--font-pixel`, `--font-display`)
- Shared image assets in `img/`, audio assets in `music/` (gitignored)
- Shell (header, nav, sidebar, footer) is copy-pasted across all 9 pages
- 9 nav links: Home, About, Roadmap, Books, Music, Games, Links, Guestbook, Entries
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
  index.html        <-- home/posts page + music player widget
  about.html        <-- bio, stats, quests, personal context
  roadmap.html      <-- AI engineering career roadmap (3 phases)
  books.html        <-- reading list (currently reading, completed, want to read)
  music.html        <-- music favorites (rotation, artists, albums, songs)
  games.html        <-- game library (playing, all-time, completed, want to play)
  entries.html      <-- blog entries archive (under construction)
  links.html        <-- links and blogroll
  guestbook.html    <-- decorative guestbook
  css/style.css     <-- shared stylesheet
  js/               <-- shared scripts (i18n engine, future shared JS)
  img/              <-- shared image assets
  music/            <-- mp3 assets for song-of-the-day player (gitignored)
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
| Shell maintenance across 9 pages gets tedious | Migrate to a static site generator (11ty recommended over Hugo for this project). See **Shell Duplication: Migration Options** section for detailed analysis. This is the highest-priority migration trigger. |
| Want a custom domain (e.g. hung.dev) | Buy domain, configure CNAME in repo settings |
| Want working guestbook/comments | Giscus (GitHub Discussions-backed, free, one `<script>` tag) |
| Want analytics | GoatCounter (free for personal, privacy-friendly, one `<script>` tag) |
| Want contact form | Formspree (free tier, 50 submissions/month) |
| Want search across pages | Pagefind (static search index, client-side, Hugo plugin available) |
| Need custom backend logic | Cloudflare Workers (100k requests/day free) or Supabase (free tier PostgreSQL) |
| 12+ pages | Migrate to 11ty before adding more pages. Current shell duplication is already at pain threshold. See **Shell Duplication: Migration Options** section. |

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

## Internationalization (i18n): English / Vietnamese Toggle

**Added:** 2026-05-05
**Author:** Hung Doan
**Status:** Design

---

### Problem Statement

The site owner is bilingual (English/Vietnamese). The site should allow visitors to toggle between English and Vietnamese with a single click. The chosen language must persist across page navigations and return visits. The solution must work on GitHub Pages (static files only, no server, no build step, zero cost).

---

### Constraints

| Constraint | Detail |
|---|---|
| No server | GitHub Pages serves static files only |
| No build step | No Hugo, 11ty, webpack, or any compilation |
| No cost | No paid CDN, no paid translation API |
| No framework | Vanilla HTML/CSS/JS only |
| 9 pages | index, about, roadmap, books, music, games, links, guestbook, entries |
| 9 nav links | Home, About, Roadmap, Books, Music, Games, Links, Guestbook, Entries |
| Duplicated shell | Header, nav (9 links), sidebar (4 boxes), and footer are copy-pasted across all 9 pages (no shared template) |
| Heavy content pages | books.html (9 entries), music.html (13 entries), games.html (11 entries), roadmap.html (3 phases with extensive prose) |

---

### Approach: Embedded translations in a shared JS file

All translations for both languages are embedded as objects in a single `js/i18n.js` file. Elements are marked with `data-i18n` attributes. The JS file applies translations synchronously on load.

| Pros | Cons |
|---|---|
| No async fetch, no FOUC | Translation strings live in a JS file, not a standalone JSON |
| Single source of truth for all translations | JS file grows with content (estimated 8-40KB for EN/VI across 9 pages depending on Tier 2 coverage) |
| One file loaded across all pages | Requires JS enabled (acceptable for a toggle feature) |
| Adding a third language = add one object | |
| English fallback is free (hardcoded in HTML) | |
| Zero cost, zero dependencies | |

Why this approach over alternatives: duplicating pages (18 HTML files) is unmaintainable at 9 pages. Inline dual-language elements double the HTML size and make long-form content editing painful. Async JSON fetch introduces FOUC that cannot be eliminated on a static site without a service worker. Embedded JS is the only option that is zero-FOUC, zero-cost, and zero-dependency.

---

### Architecture

```
User clicks toggle
        |
        v
  localStorage.setItem('lang', 'vi')
        |
        v
  js/i18n.js walks all [data-i18n] elements
        |
        v
  Replaces textContent/innerHTML from embedded translation object
        |
        v
  Sets <html lang="vi" class="lang-vi i18n-ready">
        |
        v
  On next page load, inline <head> script reads localStorage
  and sets lang class BEFORE first paint
```

#### File structure

```
hung-blog/
  js/
    i18n.js            <-- translation engine + embedded translations (~25-40KB)
  css/
    style.css          <-- add FOUC prevention rules + toggle button styles
  index.html           <-- add data-i18n attributes + toggle button + head script
  about.html           <-- same
  roadmap.html         <-- same
  books.html           <-- same
  music.html           <-- same
  games.html           <-- same
  entries.html         <-- same
  links.html           <-- same
  guestbook.html       <-- same
```

---

### Detailed Design

#### 1. Translation key convention

Keys use dot-notation namespaced by location:

| Prefix | Scope | Example |
|---|---|---|
| `nav.*` | Navigation links (9 links) | `nav.home`, `nav.roadmap`, `nav.books` |
| `sidebar.*` | Sidebar headings and labels | `sidebar.stats`, `sidebar.mood`, `sidebar.quests` |
| `footer.*` | Footer text | `footer.made_with`, `footer.best_viewed` |
| `marquee.*` | Marquee banner | `marquee.welcome` |
| `music_player.*` | Sidebar music player (index.html only) | `music_player.now_playing` |
| `gb.*` | Guestbook elements | `gb.heading`, `gb.placeholder_name`, `gb.note` |
| `page.<name>.*` | Page-specific content | `page.about.title`, `page.roadmap.phase1.title` |
| `page.<name>.entry_<n>.*` | Repeating entries (books, music, games) | `page.books.entry_1.body`, `page.games.entry_3.body` |

#### 2. Two attribute types

| Attribute | Replacement method | Use for |
|---|---|---|
| `data-i18n="key"` | `element.textContent = value` | Plain text (nav links, headings, labels, stat lines) |
| `data-i18n-html="key"` | `element.innerHTML = value` | Content with HTML markup (blog post bodies, about paragraphs with links) |

**Security note:** `data-i18n-html` uses innerHTML. Since all translation strings are authored by the site owner (not user input), this is safe. Never use `data-i18n-html` with external or user-supplied data.

#### 3. HTML markup pattern

Before (current):
```html
<a href="index.html">Home</a>
<h3>Stats</h3>
<div class="post-body">
  <p>Big news: I was admitted to the <a href="...">UT Austin MSAI program</a>.</p>
</div>
```

After (with i18n attributes):
```html
<a href="index.html" data-i18n="nav.home">Home</a>
<h3 data-i18n="sidebar.stats">Stats</h3>
<div class="post-body" data-i18n-html="page.index.post1.body">
  <p>Big news: I was admitted to the <a href="...">UT Austin MSAI program</a>.</p>
</div>
```

The English text remains in the HTML as the default fallback. When the active language is English, JS does nothing to these elements. When Vietnamese is active, JS replaces the content with the Vietnamese translation from the embedded object.

#### 4. Translation object structure (js/i18n.js)

```js
var I18N_TRANSLATIONS = {
  vi: {
    // -- Shared shell (all 9 pages) --
    "nav.home": "Trang Chu",
    "nav.about": "Gioi Thieu",
    "nav.roadmap": "Lo Trinh",
    "nav.books": "Sach",
    "nav.music": "Nhac",
    "nav.games": "Game",
    "nav.links": "Lien Ket",
    "nav.guestbook": "So Luu But",
    "nav.entries": "Bai Viet",
    "sidebar.stats": "Thong Ke",
    "sidebar.posts_label": "Bai viet",
    "sidebar.mood_label": "Tam trang",
    "sidebar.mood_value": "Uong cafe",
    "sidebar.listening_label": "Dang nghe",
    "sidebar.reading_label": "Dang doc",
    "sidebar.hangouts": "Ket Noi",
    "sidebar.quests": "Thu Thach",
    "sidebar.online": "truc tuyen",
    "footer.made_with": "lam voi &#9829; va qua nhieu cafe",
    "footer.best_viewed": "xem tot nhat o 1024x768",
    "music_player.now_playing": "Dang Phat",
    "marquee.welcome": "★ ★ ★ Chao mung den goc nho cua toi tren Internet! ...",

    // -- Tier 1: Section headings (all pages) --
    "page.about.heading_about": "Ve Toi",
    "page.about.heading_arc": "Hanh Trinh Hien Tai",
    "page.roadmap.heading_main": "Lo Trinh Ky Su AI",
    "page.books.heading_reading": "Dang Doc",
    "page.books.heading_completed": "Da Doc Xong",
    "page.music.heading_rotation": "Dang Nghe",
    "page.games.heading_playing": "Dang Choi",
    // ... etc

    // -- Tier 2: Long-form content (translate incrementally) --
    "page.about.bio1": "Xin chao, toi la Hung. Ky su phan mem ban ngay...",
    "page.roadmap.phase1.body": "<p>Tu bay gio den He 2027. Chu de: ...</p>",
    // ... etc
  }
};
```

**Why only `vi` is in the object:** English is the fallback language hardcoded in HTML. No need to store English translations -- they are already in the DOM. This cuts the JS file size in half.

**Translation tiers (critical architectural decision):**

The site has grown to 9 pages with heavy content pages (books: 9 entries, music: 13 entries, games: 11 entries, roadmap: 3 phases). Translating every string is ~237 items. This is a large effort. To ship incrementally without blocking, translations are split into two tiers:

| Tier | What | Scope | Priority |
|---|---|---|---|
| Tier 1: UI chrome | Nav links, sidebar headings/labels, footer, marquee, section headings, form labels, page titles | ~45 strings, shared + per-page structural | Ship first. The site feels bilingual with just this. |
| Tier 2: Long-form content | Blog post bodies, book/music/game descriptions, roadmap paragraphs, about me prose | ~192 strings, page-specific, many contain HTML | Ship incrementally, one page at a time. Start with about.html and roadmap.html (most personal). |

The i18n engine supports both tiers from day one. Tier 2 strings that are not yet translated simply display the English fallback. A Vietnamese user sees Vietnamese nav/sidebar/headings with English body text -- better than nothing, and it ships faster.

#### 5. FOUC prevention

Two mechanisms work together:

**Mechanism A: Inline `<head>` script (runs before paint)**

Every HTML page gets this in `<head>`, after the CSS `<link>`:

```html
<script>
(function(){
  var l = localStorage.getItem('lang') || 'en';
  document.documentElement.lang = l;
  document.documentElement.className = 'lang-' + l;
})();
</script>
```

This sets `<html lang="vi" class="lang-vi">` synchronously before the browser paints the body. It is 3 lines. It does not load any external file.

**Mechanism B: CSS hiding rule**

```css
html.lang-vi:not(.i18n-ready) [data-i18n],
html.lang-vi:not(.i18n-ready) [data-i18n-html] {
  opacity: 0;
  transition: opacity 0.1s;
}
```

When the language is Vietnamese and JS has not yet applied translations, all translatable elements are invisible. Once `js/i18n.js` finishes applying translations, it adds the `i18n-ready` class to `<html>`, and elements fade in over 100ms.

**For English users:** No hiding, no flash, no delay. The HTML already contains English text.

**For Vietnamese users:** Elements are invisible for < 50ms while JS applies translations. On any modern browser with a local JS file, this is imperceptible.

#### 6. Toggle button

Placed in the nav bar as the last element, after all 9 page links:

```html
<nav class="nav-bar">
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="roadmap.html">Roadmap</a>
  <a href="books.html">Books</a>
  <a href="music.html">Music</a>
  <a href="games.html">Games</a>
  <a href="links.html">Links</a>
  <a href="guestbook.html">Guestbook</a>
  <a href="entries.html">Entries</a>
  <button class="lang-toggle" id="langToggle" aria-label="Switch language">EN | VI</button>
</nav>
```

Styled to match the nav aesthetic but visually distinct (it is a control, not a navigation link). Uses the existing CSS custom properties:

```css
.lang-toggle {
  font-family: var(--font-pixel);
  font-size: 21px;
  background: none;
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold);
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 3px;
  margin-left: auto;
  transition: all 0.2s;
}

.lang-toggle:hover {
  background: rgba(255, 215, 0, 0.15);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}
```

The button text updates to show the active language highlighted. When English is active, display shows `[EN] | VI`. When Vietnamese is active, display shows `EN | [VI]`.

#### 7. js/i18n.js engine (pseudocode)

```
1. Read lang from localStorage (default: 'en')
2. If lang is 'en':
     - Do nothing to DOM content (HTML is already English)
     - Add 'i18n-ready' class to <html>
3. If lang is 'vi':
     - Query all [data-i18n] elements
     - For each, look up key in I18N_TRANSLATIONS.vi
     - If found, set element.textContent = translation
     - Query all [data-i18n-html] elements
     - For each, set element.innerHTML = translation
     - Add 'i18n-ready' class to <html>
4. Update toggle button display
5. On toggle click:
     - Flip lang ('en' <-> 'vi')
     - Save to localStorage
     - If switching to 'en': restore original English text (stored on first load)
     - If switching to 'vi': apply Vietnamese translations
     - Update <html lang="..."> and toggle button display
```

**Critical detail: Restoring English.** When switching from Vietnamese back to English, JS needs the original English text. On first load, before applying any translations, JS stores the original textContent/innerHTML of every `[data-i18n]` and `[data-i18n-html]` element in a Map keyed by the element. This costs ~1KB of memory and eliminates the need to store English in the translation object.

#### 8. Elements that need special handling

| Element | Challenge | Solution |
|---|---|---|
| `<title>` | Not in the DOM body, no `data-i18n` | JS sets `document.title` directly from a `page.<name>.title` key |
| `<input placeholder>` | Not textContent | Use `data-i18n-placeholder="key"`, JS sets `element.placeholder` |
| `<button>` text | Contains HTML entities | Use `data-i18n-html` |
| `<img alt>` | Accessibility text | Use `data-i18n-alt="key"`, JS sets `element.alt` |
| `<html lang>` | Must match active language | JS sets `document.documentElement.lang` |
| Marquee content | Contains decorative symbols (stars) | Translation includes the symbols: `"marquee.welcome": "★ ★ ★ Chao mung den goc nho cua toi..."` |

#### 9. What NOT to translate

| Element | Reason |
|---|---|
| Usernames in guestbook entries | User-generated, language-neutral |
| Dates | Already in numeric/short format (02/22/2026) |
| External link URLs | URLs are language-neutral |
| Brand names (GitHub, BigQuery, etc.) | Proper nouns |
| Code snippets (if any) | Code is code |
| Song title in music player | Artist names are language-neutral |
| Vietnamese proverbs in English mode | Already intentionally Vietnamese; add a translation note instead |

---

### Implementation Plan

Ordered by dependency. Steps 1-4 can each be a standalone PR. Steps 5+ are incremental Tier 2 work that can ship per-page over time.

**Prerequisites:** Confirm all 9 pages are stable with consistent shell markup before starting. Any structural HTML changes (adding/removing pages, changing nav links, modifying sidebar) should be completed first.

---

#### Step 1: Create js/i18n.js engine + CSS infrastructure

**Goal:** The i18n engine exists and works. No HTML changes yet. Testable in isolation by manually adding attributes to one element in dev tools.

**Create `js/i18n.js`** with:

1. Embedded `I18N_TRANSLATIONS` object with Tier 1 Vietnamese strings only (~45 strings). Leave Tier 2 empty for now.
2. `init()` function that runs on DOMContentLoaded:
   - Read `lang` from `localStorage` (default: `'en'`)
   - Cache original English text of all `[data-i18n]` and `[data-i18n-html]` elements into a `Map<Element, string>`
   - If lang is `'vi'`, walk and apply Vietnamese translations
   - Add `i18n-ready` class to `<html>`
   - Update toggle button display
3. `toggle()` function bound to the toggle button:
   - Flip lang, save to `localStorage`
   - Walk all `[data-i18n]` elements: if `'vi'`, apply translation; if `'en'`, restore from cache
   - Walk all `[data-i18n-html]` elements: same logic using `innerHTML`
   - Walk all `[data-i18n-placeholder]` elements: set `element.placeholder`
   - Walk all `[data-i18n-alt]` elements: set `element.alt`
   - Update `document.documentElement.lang`
   - Update toggle button text
   - Update `document.title` from a `title.<pagename>` key

**Add to `css/style.css`:**

```css
/* i18n: FOUC prevention */
html.lang-vi:not(.i18n-ready) [data-i18n],
html.lang-vi:not(.i18n-ready) [data-i18n-html] {
  opacity: 0;
  transition: opacity 0.15s;
}

/* i18n: toggle button */
.lang-toggle {
  font-family: var(--font-pixel);
  font-size: 21px;
  background: none;
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold);
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 3px;
  margin-left: auto;
  transition: all 0.2s;
}

.lang-toggle:hover {
  background: rgba(255, 215, 0, 0.15);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}
```

**Files changed:** `js/i18n.js` (new), `css/style.css`
**Test:** Open any page, add `data-i18n="nav.home"` to a nav link via dev tools, call `window.I18N.apply('vi')` from console, confirm it swaps.

---

#### Step 2: Wire infrastructure into all 9 pages

**Goal:** Every page has the toggle button, the head script, and the i18n.js script tag. No `data-i18n` attributes on real elements yet -- just the plumbing.

For each of the 9 HTML files, make these 3 additions:

**2a. Add inline script to `<head>` (after the CSS `<link>`, before `</head>`):**

```html
<script>
(function(){
  var l = localStorage.getItem('lang') || 'en';
  document.documentElement.lang = l;
  document.documentElement.className = 'lang-' + l;
})();
</script>
```

**2b. Add toggle button as the last child of `<nav class="nav-bar">`:**

```html
<button class="lang-toggle" id="langToggle" aria-label="Switch language">EN | VI</button>
```

**2c. Add script tag before `</body>`:**

```html
<script src="js/i18n.js"></script>
```

Note: `index.html` already has an inline `<script>` for the music player before `</body>`. Place the i18n script tag **before** the music player script.

**Files changed:** `index.html`, `about.html`, `roadmap.html`, `books.html`, `music.html`, `games.html`, `entries.html`, `links.html`, `guestbook.html` (all 9)
**Test:** Open every page. Confirm toggle button appears in nav bar. Click it. Confirm `localStorage.getItem('lang')` flips between `'en'` and `'vi'`. Navigate between pages. Confirm language persists. Confirm no visual changes yet (no attributes to act on).

---

#### Step 3: Mark up shared shell + Tier 1 translations

**Goal:** All shared UI chrome across all 9 pages is translatable and has Vietnamese translations. After this step, clicking the toggle switches nav, sidebar, footer, and marquee to Vietnamese on every page. The site feels bilingual.

**3a. Add `data-i18n` attributes to shared shell elements in all 9 pages.**

This is the most repetitive step. Each of the following elements appears in all 9 pages and must be tagged identically:

| Element | Attribute to add | Key |
|---|---|---|
| Marquee text | `data-i18n="marquee.welcome"` | On the `.marquee-content` div |
| Site subtitle | `data-i18n="shell.subtitle"` | On the `.site-subtitle` p |
| Nav: Home | `data-i18n="nav.home"` | On the `<a>` |
| Nav: About | `data-i18n="nav.about"` | On the `<a>` |
| Nav: Roadmap | `data-i18n="nav.roadmap"` | On the `<a>` |
| Nav: Books | `data-i18n="nav.books"` | On the `<a>` |
| Nav: Music | `data-i18n="nav.music"` | On the `<a>` |
| Nav: Games | `data-i18n="nav.games"` | On the `<a>` |
| Nav: Links | `data-i18n="nav.links"` | On the `<a>` |
| Nav: Guestbook | `data-i18n="nav.guestbook"` | On the `<a>` |
| Nav: Entries | `data-i18n="nav.entries"` | On the `<a>` |
| Sidebar: "Stats" heading | `data-i18n="sidebar.stats"` | On the `<h3>` |
| Sidebar: "Hangouts" heading | `data-i18n="sidebar.hangouts"` | On the `<h3>` |
| Sidebar: "Quests" heading | `data-i18n="sidebar.quests"` | On the `<h3>` |
| Footer: "made with..." | `data-i18n-html="footer.made_with"` | On the `<p>` (contains &#9829; entity) |
| Footer: "best viewed..." | `data-i18n="footer.best_viewed"` | On the `<span class="blink">` |

Total: 16 attributes x 9 pages = **144 attribute additions**.

**3b. Index.html-only elements:**

| Element | Attribute | Key |
|---|---|---|
| Music player "Now Playing" heading | `data-i18n-html="music_player.now_playing"` | On the `<h3>` (contains blinking note entity) |
| Guestbook heading | `data-i18n-html="gb.heading"` | On the guestbook `<h3>` |
| Guestbook "view all" link | `data-i18n-html="gb.view_all"` | On the `<a>` inside `.gb-view-all` |

**3c. Section headings on each page (Tier 1):**

These are the `<h2>` headings inside `.page-section` on each page:

| Page | Headings to tag |
|---|---|
| about.html | "About Me", "Current Arc", "Interests", "Philosophy" (4) |
| roadmap.html | "AI Engineering Roadmap", "Phase 1: Foundation", "Phase 2: Depth and Proof", "Phase 3: Apply and Grow", "How to Hold Me Accountable" (5) |
| books.html | "Currently Reading", "Completed", "Want to Read" (3) |
| music.html | "Current Rotation", "Favorite Artists", "Favorite Albums", "Favorite Songs" (4) |
| games.html | "Currently Playing", "All-Time Favorites", "Completed", "Want to Play" (4) |
| links.html | "My Links", "Cool Sites", "Tools I Use", "Link Me" (4) |
| guestbook.html | Guestbook heading, note text, placeholders, button (4) |
| entries.html | "Entries" heading, description text (2) |

Total section headings: **30 strings**

**3d. Write Tier 1 Vietnamese translations in `js/i18n.js`.**

Fill in the `I18N_TRANSLATIONS.vi` object with all ~45 Tier 1 strings (shared shell + section headings).

**Files changed:** all 9 HTML files, `js/i18n.js`
**Test:** Toggle on every page. All nav links, sidebar headings, footer text, section headings, and marquee switch to Vietnamese. Body content stays English (Tier 2 not yet done). Navigate between pages -- Vietnamese persists. Hard-reload in Vietnamese mode -- no English flash.

---

#### Step 4: Mark up page-specific content (Tier 2) -- incremental, per-page

**Goal:** Translate long-form content. This is the largest effort by volume. Ship one page at a time. Each page is an independent PR.

**Recommended order** (most personal/impactful first):

| Order | Page | Elements to tag | Estimated strings | Notes |
|---|---|---|---|---|
| 4a | about.html | 3 bio paragraphs, 8 interest list items, 4 arc list items, philosophy quote | ~16 | Short page, high value -- this is the "who am I" page |
| 4b | roadmap.html | 12 prose paragraphs, 12 milestone list items, 2 closing paragraphs | ~26 | Long but deeply personal. Use `data-i18n-html` for paragraphs with links |
| 4c | index.html | 4 blog post titles, 4 post bodies (use `data-i18n-html`), 4 mood lines | ~16 | Post bodies contain links, use `data-i18n-html` |
| 4d | guestbook.html | Note text, 2 form placeholders (`data-i18n-placeholder`), button text | ~4 | Small. Guestbook entry text stays English (user-generated) |
| 4e | entries.html | Heading, 2 description paragraphs | ~3 | Tiny page, under construction |
| 4f | links.html | Link descriptions, "coming soon" text, paragraph text | ~12 | Descriptions of external sites |
| 4g | books.html | 9 book entry bodies, 9 mood/progress lines | ~20 | Subjective reviews. Consider whether translation adds value. |
| 4h | music.html | 13 music entry bodies, mood lines | ~28 | Same consideration as books |
| 4i | games.html | 11 game entry bodies, mood lines | ~24 | Same consideration as books |

**Note on 4g/4h/4i:** The books, music, and games pages contain subjective English-language reviews with culturally specific references ("you know the one", "hit different"). The team should decide whether literal translation serves the reader or whether these pages are better left in English with only section headings translated (already done in Step 3). This is a content decision, not a technical one. The engine supports it either way.

For each page, the work is:
1. Add `data-i18n` or `data-i18n-html` attributes to each element
2. Add the corresponding Vietnamese string to `I18N_TRANSLATIONS.vi` in `js/i18n.js`
3. Test toggle on that page

**Estimated Tier 2 total: ~149 strings** (or ~60 if books/music/games are left English-only)

---

#### Step 5: Final testing and polish

**Goal:** Confirm the complete i18n system works end-to-end across all pages.

| Test | How | Pass criteria |
|---|---|---|
| Toggle EN->VI on every page | Click toggle on each of the 9 pages | All tagged elements show Vietnamese text |
| Toggle VI->EN on every page | Click toggle back on each page | All elements restore to original English |
| Persistence across navigation | Set VI on index.html, click every nav link | Vietnamese persists on all pages without flash |
| Hard reload in VI mode | Set VI, close tab, reopen | Page loads in Vietnamese, no English flash |
| JS disabled fallback | Disable JS in browser, load each page | English content renders correctly. Toggle button visible but non-functional. No broken layout. |
| Mobile nav wrapping | Resize to <800px in both EN and VI | Toggle button wraps cleanly in the nav bar. All 9 links + toggle fit without overflow. |
| Screen reader | Use NVDA or VoiceOver | `<html lang>` updates to `vi`. Toggle button `aria-label` is announced. |
| Missing translation key | Add a `data-i18n="nonexistent.key"` to a test element | Element keeps English text (no blank, no error) |

**Files changed:** none (testing only)

---

### Updated string count summary

| Category | Tier 1 (UI chrome) | Tier 2 (content) | Total |
|---|---|---|---|
| Shared shell (nav, sidebar, footer, marquee) | 20 | 0 | 20 |
| index.html (posts, music player, guestbook preview) | 5 | 16 | 21 |
| about.html (bio, lists) | 4 | 16 | 20 |
| roadmap.html (3 phases, prose) | 5 | 26 | 31 |
| books.html (9 entries) | 3 | 20 | 23 |
| music.html (13 entries) | 4 | 28 | 32 |
| games.html (11 entries) | 4 | 24 | 28 |
| links.html (headings, descriptions) | 4 | 12 | 16 |
| guestbook.html (form, note) | 4 | 4 | 8 |
| entries.html (heading, placeholder) | 2 | 3 | 5 |
| **Total** | **~55** | **~149** | **~204** |

Estimated `js/i18n.js` file size:
- Tier 1 only: ~8KB (engine + 55 short strings)
- Tier 1 + Tier 2 (excluding books/music/games): ~20KB
- Full Tier 2 (all pages): ~35-40KB

All sizes are acceptable for a static site. No splitting needed.

---

### Scaling considerations

| If this happens | Then do this |
|---|---|
| Adding a 3rd language | Add another object to `I18N_TRANSLATIONS`. Update toggle button to cycle through EN/VI/XX or show a dropdown. Update FOUC CSS to cover the new language class. |
| i18n.js exceeds 50KB | Split into `i18n-engine.js` (engine, ~3KB) and `i18n-vi.js` (translations). Load the translation file with a `<script>` tag -- still synchronous, no fetch, no FOUC. |
| Adding page 12+ | The duplicated shell (9 nav links x 16 shell attributes = 144 edits per shell change) is already painful at 9 pages. At 12+, migrate to 11ty before adding more pages. The JS i18n engine ports into an 11ty layout with zero changes. See **Shell Duplication: Migration Options** section. |
| Need professional translation | Export the `vi` object from `i18n.js` as a standalone JSON file (`jq` one-liner), send to translator, import back. The key structure is self-documenting. |
**Architecture warning (9 pages):** The site is already at 9 pages with a duplicated shell. The i18n implementation adds 16 attributes per page to the shell, meaning every new page requires copying 16 `data-i18n` attributes correctly. This is exactly the kind of maintenance cost that a static site generator eliminates. The i18n design intentionally keeps the engine decoupled so it can be ported into an SSG template system when that migration happens. See the **Shell Duplication: Migration Options** section below for the recommended approach.

---

### Rollback

If the i18n feature causes issues:
1. Remove `data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, and `data-i18n-alt` attributes from all 9 HTML files
2. Remove the inline `<head>` script from all 9 pages
3. Remove the `<script src="js/i18n.js">` tag from all 9 pages
4. Remove the toggle button from all 9 nav bars
5. Remove the FOUC and toggle CSS rules from `style.css`
6. Delete `js/i18n.js`

The site reverts to English-only with no side effects. All English content is still hardcoded in HTML.

---

## Shell Duplication: Migration Options

**Added:** 2026-05-05
**Status:** Not started -- migrate before adding page 10

---

### Problem

The site header, nav (9 links + toggle button), sidebar (4 boxes), and footer are copy-pasted across all 9 HTML files. Every change to any shared element requires editing all 9 files and hoping nothing drifts.

**Observed symptoms (all fixed, but root cause remains):**

- Marquee text and date drifted between pages (some said "05.03.2026", others "05.04.2026")
- Quest sidebar text was inconsistent ("Mathematics for ML" vs "Finish Mathematics for Machine Learning")
- about.html loaded a Google Font (Comic Neue) that no other page used and no CSS rule referenced

These bugs were caused by the duplication, not by i18n. The i18n system made the duplication more visible (16 additional `data-i18n` attributes per page in the shared shell), but the underlying problem is architectural.

**Scale of the problem:** Each new page requires copying ~120 lines of shared shell HTML and 16 `data-i18n` attributes. One missed attribute means one page silently fails to translate a UI element.

---

### Option A: JS Web Components (no build step)

Define custom elements (`<site-nav>`, `<site-sidebar>`, `<site-footer>`) that render shared HTML in `connectedCallback()`. Each page's HTML shrinks to just the main content block plus custom element tags.

```html
<!-- about.html would become -->
<site-header></site-header>
<site-nav active="about"></site-nav>
<div class="content-grid">
  <site-sidebar></site-sidebar>
  <main class="main-content">
    <!-- page content here -->
  </main>
</div>
<site-footer></site-footer>
```

| Pros | Cons |
|---|---|
| No build step, pure browser | Page shell is JS-rendered (SEO impact on crawlers that don't execute JS) |
| Custom elements are a web standard | i18n timing: components must render before `cacheOriginals()` runs |
| Single definition for each shared element | FOUC: the entire shell flashes into existence on page load |
| | Contradicts "no framework, no build step" philosophy (now dependent on JS for basic layout) |
| | Shadow DOM breaks existing CSS; Light DOM works but is fragile |

**Verdict: Do not use.** The i18n system depends on DOM elements existing synchronously before it runs. JS-rendered shells create timing and FOUC problems that don't exist today. The shell would be invisible until JS executes, which is a regression from the current instant-render behavior.

---

### Option B: Python build script (minimal build step)

A ~40-line Python script reads a base template with placeholder markers and per-page content blocks, then outputs the 9 final HTML files. The shared shell lives in one file.

```
_templates/
  base.html              <- shared shell with {{ content }} placeholder
  index.content.html     <- main content block only
  about.content.html
  ...
build.py                 <- reads templates, outputs to root (string.Template or Jinja2)
```

Run `python build.py` before deploying. Output files are the final HTML that GitHub Pages serves.

| Pros | Cons |
|---|---|
| Minimal tooling (Python + string.Template or Jinja2) | Adds a build step you have to remember to run |
| Source of truth for shell is one file | You are building a toy SSG |
| No new framework to learn | No support for conditionals, filters, data files, collections |
| Easy to understand and debug | When you need "show music player only on index," you start reimplementing SSG features badly |
| Works with existing deployment (commit output, push) | Maintenance of the script itself becomes a side project |

**Verdict: Skip.** This is a trap. You spend an hour writing a build script, then another hour when you want conditionals, then another when you want page-specific metadata in frontmatter. Within a month you are maintaining a custom SSG that does 20% of what 11ty does with 5x the bugs. If you are going to add a build step, use a real tool.

---

### Option C: Static site generator -- 11ty (recommended)

Migrate to Eleventy (11ty). The shared shell becomes a layout template. Per-page content stays as individual files with YAML frontmatter. The existing i18n system, CSS, and JS port directly with zero changes.

**Why 11ty over Hugo:**

1. **Existing HTML is almost valid 11ty input.** Strip the shared shell, add 3-line frontmatter, done. Hugo requires learning Go templates from scratch.
2. **The current `js/i18n.js` works as-is.** 11ty does not force its own i18n system. The `data-i18n` attributes, FOUC prevention head script, and toggle button all live in the layout template. When you eventually want server-side translations, 11ty supports that too, but it is not mandatory.
3. **JS ecosystem.** The site already uses JS. 11ty is Node-based. Extending the build (process images, generate RSS, add search) uses familiar tools.
4. **Minimal learning curve.** 11ty uses Nunjucks templates, which are close to Jinja2 (familiar if you know Python). Hugo's Go templates have a steeper learning curve and different conventions.

#### Migration structure

```
hung-blog/
  _includes/
    base.html              <- current shared shell (one copy, with {{ content | safe }})
    sidebar.html           <- extracted sidebar partial (optional, can stay inline in base)
  src/
    index.html             <- frontmatter + main content only
    about.html
    roadmap.html
    books.html
    music.html
    games.html
    links.html
    guestbook.html
    entries.html
  css/style.css            <- unchanged
  js/i18n.js               <- unchanged
  img/                     <- unchanged
  music/                   <- unchanged (still gitignored)
  .eleventy.js             <- ~15 lines of config
  _site/                   <- generated output (add to .gitignore)
```

#### Per-page file format after migration

```html
---
layout: base.html
title: "About ~ Hung's Journal"
active: about
---
<section class="page-section">
  <h2 data-i18n="page.about.heading_about">About Me</h2>
  <p>Hey, I'm Hung. Software engineer by day, lifter by night...</p>
  ...
</section>
```

The `active` frontmatter variable controls which nav link gets `class="active"`. The layout template uses a simple conditional:

```html
<a href="about.html" {% if active == "about" %}class="active"{% endif %} data-i18n="nav.about">About</a>
```

#### Layout template (base.html) sketch

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ title }}</title>
  <link href="https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  <script>
    (function () {
      var l = "en";
      try { l = localStorage.getItem("lang") || "en"; } catch (e) {}
      if (l !== "vi") { l = "en"; }
      document.documentElement.lang = l;
      document.documentElement.className = "lang-" + l;
    })();
  </script>
</head>
<body>
  <!-- marquee, header, nav (with active logic), sidebar all defined once here -->
  <div class="content-grid">
    {% include "sidebar.html" %}
    <main class="main-content">
      {{ content | safe }}
    </main>
  </div>
  <!-- footer defined once here -->
  <script src="js/i18n.js"></script>
</body>
</html>
```

#### i18n compatibility

Everything ports with zero changes:

| Component | Migration effort |
|---|---|
| `js/i18n.js` | None. Loaded via `<script>` in the layout template. |
| `data-i18n` attributes in layout | Written once in `base.html` instead of 9 times. |
| `data-i18n` attributes in page content | Stay in the per-page content files. No change. |
| FOUC prevention head script | Written once in `base.html`. |
| FOUC prevention CSS | No change. |
| Toggle button | Written once in `base.html` nav. |
| `document.title` translation | Works as-is. 11ty sets `<title>` from frontmatter; i18n.js overrides it at runtime for Vietnamese. |

#### Deployment options

| Method | How | Tradeoff |
|---|---|---|
| GitHub Actions (recommended) | Add a workflow that runs `npx @11ty/eleventy` on push, deploys `_site/` to GitHub Pages | Fully automatic. Free. ~30 seconds build time. |
| Local build + commit output | Run `npx @11ty/eleventy` locally, commit `_site/`, push | Works but output files clutter the repo and can cause merge conflicts. |
| Netlify or Vercel | Connect repo, auto-build on push | Free tier. Adds a third-party dependency. |

#### When to migrate

The original trigger was "12+ pages." But the trigger should be when duplication causes bugs, not a page count threshold. That threshold has already been crossed. The marquee, quest text, and font inconsistencies were all direct consequences of maintaining 9 copies of the same HTML.

**Recommended: migrate before adding page 10.** The migration is approximately 2-4 hours of work:

1. `npm init -y && npm install @11ty/eleventy` (~2 minutes)
2. Create `.eleventy.js` config (~15 lines)
3. Extract shared shell into `_includes/base.html` (~30 minutes)
4. Strip shell from each of the 9 pages, add frontmatter (~10 minutes per page, ~90 minutes total)
5. Set up GitHub Actions workflow (~15 minutes)
6. Test all 9 pages in both languages (~15 minutes)

After migration, adding a new page is: create one file with frontmatter + content. No shell to copy, no attributes to remember, no drift possible.

---

## Non-Goals

- No CMS
- No JavaScript frameworks
- No server-side logic
- No database
- No analytics (unless added later via simple script tag)
