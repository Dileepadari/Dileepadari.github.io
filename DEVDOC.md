# Developer documentation

Notes for whoever touches this repo next - most likely future me. The site is
archived (see [README.md](README.md)), so this is written to make occasional
edits painless rather than to encourage a rewrite.

---

## 1. Architecture

Two independent portfolios live side by side, with no shared code:

### The root site - `/`

A single hand-written page. No build step, no framework, no bundler. Open
`index.html`, edit HTML, save, refresh.

```
index.html          everything: markup and copy
css/style.css       all styles (~930 lines)
js/script.js        three small behaviours
js/archive-banner.js  the "this is my old portfolio" strip
images/             every image the page uses
```

Sections, in document order: `#home`, `#about`, `#projects`, `#interest`,
a Notion embed (`.for_me`), `#contact`, footer.

### The Jinja site - `/jinja/`

A config-driven rewrite. Content lives in TOML; templates render it to a single
HTML file.

```
jinja/main.py             the generator (~100 lines, no CLI, no args)
jinja/config/*.toml       all content
jinja/config/assets/      its images, icons and avatars
jinja/src/jinja/*.jinja   index.jinja + 7 partials
jinja/src/css/style.css   its styles (~1900 lines)
jinja/src/js/script.js    sidebar toggle, filter dropdown, page router, modal
jinja/requirements.txt    jinja2, toml
```

`main.py` is a thin `Portfolio` class: each method loads one TOML file, and
`__main__` passes them all into `index.jinja` as template variables
(`about`, `social`, `doing`, `softskills`, `technologies`, `resume`, `projects`,
`blog`, `categories`). `categories` is derived - the set of `category` values
across all projects, used to build the portfolio filter dropdown. There is one
custom filter, `format_date`, which turns `YYYY-MM-DD` into `Mon DD, YYYY`.

**The two sites duplicate their content.** The same projects are described in
`index.html` and in `jinja/config/projects.toml`, and the same images exist
twice (`images/` and `jinja/config/assets/projects/`). Editing one does not
touch the other. That duplication is the main reason this repo was retired
rather than extended.

---

## 2. Deployment

`.github/workflows/jinja.yml` runs on every push to `main` and publishes to
GitHub Pages. There is one non-obvious thing about it, so read this before you
wonder why your change did or did not appear.

1. Checkout.
2. Install `jinja/requirements.txt`.
3. `cd jinja && python main.py`.
4. `actions/upload-pages-artifact` with `path: .` - **the whole checkout**.
5. `actions/deploy-pages`.

The catch is in steps 3 and 4. `main.py` writes to `index.html` *relative to its
working directory*, and the workflow `cd`s into `jinja/` first - so the generated
file lands at `jinja/index.html`. That path is excluded by `.gitignore`
(`/jinja/*.html`), so it is never committed. But the artifact upload takes the
entire working tree *after* the build step, so the freshly generated file ships
anyway. Net effect:

- `/jinja/` on the live site is **built in CI, from the TOML files** - it is
  never a committed artifact, and it does not exist in a fresh clone until you
  build it.
- `/` on the live site is **the committed `index.html`, verbatim**. The build
  step does not touch it.

So: to change the root site, commit HTML. To change the Jinja site, commit TOML
and let CI render it.

---

## 3. Making changes

### Root site: add or edit a project

Projects are `.row` blocks in `index.html`, in one of two containers:

- `.project-content` inside `#projects` - the six always-visible projects.
- `.project-content2#more-projs` - the six revealed by the **Show More** button.

Copy an existing `.row` and edit it. The shape is fixed:

```html
<div class="row">
    <img src="images/<file>" alt="project image N" loading="lazy">
    <div class="main-row">
        <div class="row-text">
            <h5>Title</h5>
            <p>Description.</p>
        </div>
    </div>
    <div class="source-links">
        <a href="..." target="_blank" rel="noopener noreferrer">View Source</a>
        <a href="..." target="_blank" rel="noopener noreferrer">Open Demo</a>
    </div>
</div>
```

Add `class="dis"` to a link that has no real destination - it greys the link out
(`css/style.css`, `.dis`). Keep `rel="noopener noreferrer"` on every
`target="_blank"`.

### Jinja site: add or edit a project

Edit `jinja/config/projects.toml` only - no template change needed:

```toml
[[project]]
title = "Green Plant"
category = "IOT"                                   # feeds the filter dropdown
image = "./config/assets/projects/greenplant.jpg"  # path is relative to /jinja/
url = "https://greenplant.pythonanywhere.com"
source = "https://github.com/Dileepadari/Smart_farming.git"
description = """
Multi-line description.
"""
```

A new `category` value automatically appears in the filter dropdown, because
`Portfolio.categories()` derives it from the projects themselves.

The other config files follow the same pattern - edit TOML, rebuild:

| File | Drives |
| --- | --- |
| `about.toml` | Name, role, contact details, avatar, map embed, intro text |
| `social.toml` | Sidebar social links (keys are Ionicons names) |
| `doing.toml` | The "What I'm doing" cards |
| `softskills.toml` | The testimonials-style soft-skill cards |
| `technologies.toml` | The technology icon grid (also feeds `<meta keywords>`) |
| `resume.toml` | Education, experience, skills timelines |
| `projects.toml` | Portfolio grid and its filters |
| `blog.toml` | Blog cards (dates as `YYYY-MM-DD`, formatted by `format_date`) |

### Images

- Root site reads from `images/`, paths relative to `index.html`.
- Jinja site reads from `jinja/config/assets/{projects,icons,avatars,posts}/`,
  paths written relative to `/jinja/` (i.e. `./config/assets/...`).

The two sets overlap. If a project should appear on both sites, the image has to
exist in both places. Unreferenced images have been pruned once already - if you
add one, make sure something points at it.

**Branding assets are copies from the current portfolio**, kept in sync by hand:

| Here | Source in the new portfolio repo |
| --- | --- |
| `favicon.ico`, `jinja/src/images/user.ico` | `public/favicon.ico`, trimmed to 16/32/48/64 |
| `images/profilepic.jpeg`, `jinja/config/assets/avatars/dileepadari.jpg` | `src/assets/dileepadari.png`, resized to 800px and re-encoded as JPEG |
| `images/adk_dev_logo.png` (social preview) | `public/adk_dev_logo_color.png` |

The photo is re-encoded rather than copied because the source is a 1.6 MB PNG
with a fully opaque alpha channel; at 800px JPEG it is ~65 KB and visually
identical at the sizes either site displays it. If you refresh these, do the same
- this repo has no image pipeline.

Everything in this repo is served straight from disk with no image pipeline, so
keep files small. ImgBot (`.imgbotconfig`) opens a PR to losslessly compress new
images, but it does not resize them.

---

## 4. CSS and JS tour

### `css/style.css`

Plain CSS, no preprocessor, roughly in page order:

| Lines | Contents |
| --- | --- |
| 1-20 | Global reset and `:root` custom properties |
| 22-92 | `body`, fixed `header`, logo, nav list, mobile `#menu-icon`, `.h-btn` |
| 94-200 | `#home` - background image, headline, `.social` icons, `.btn` variants, `header.sticky` |
| 203-252 | `#about` - two-column grid, `.exp-area` detail rows |
| 254-392 | `#projects` - `.project-content` grids, `.row` cards, `.source-links`, `.dis` |
| 393-460 | `#interest` - skill grid |
| 460-676 | Notion embed, contact form, footer, scroll-to-top rocket |
| 677-925 | Seven `max-width` media queries: 1700, 1380, 1290, 1240, 1050, 680, 430 |

The theme is four custom properties on `:root` - `--bg-color: #1b1f24`,
`--second-bg-color`, `--main-color: #13bbff`, `--other-color` - plus three font
sizes. Change those to re-skin the page.

`header` is `position: fixed; top: 0`, which matters for the archive banner
(below).

### `js/script.js`

Three independent behaviours, each guarded by a null check so the file is safe
to include on any page:

1. Adds `.sticky` to `header` once `window.scrollY > 120`.
2. `#menu-icon` toggles `.navlist.active` for the mobile menu, and any scroll
   closes it.
3. `#more-btn` expands and collapses `#more-projs`, swapping its label between
   *Show More* and *Show Less*, and scrolls back to `#projects` on collapse.

### `js/archive-banner.js`

Self-contained, dependency-free, and shared by every page in the repo - the root
site, `/cv/`, and the Jinja site (which loads it as `../js/archive-banner.js`).
Because it is shared, it injects its own `<style>` and DOM rather than relying on
either site's CSS.

Mechanics worth knowing before you change it:

- It measures its own rendered height and publishes it as
  `--archive-banner-height` on `<html>`, then re-measures on resize. Height is
  measured, not hard-coded, because the text wraps to two lines on narrow
  screens.
- It adds `.has-archive-banner` to `<html>`, which is what actually offsets the
  page: `body` gets `padding-top`, and the root site's fixed `header` gets a
  matching `top`. If you ever add another fixed-to-the-top element, it needs the
  same treatment.
- Dismissal is remembered in `localStorage` under `archive-banner-dismissed`.
  Clear that key to see the banner again. Every `localStorage` call is wrapped in
  a `try` - Safari private mode throws.
- The footer of `index.html` repeats the archive notice, so the pointer to the
  new site survives dismissal.

### Jinja site JS

`jinja/src/js/script.js` is the template's original script: mobile sidebar
toggle, the custom `<select>` and project filtering, the testimonials modal, and
a small hash-less page router that swaps `[data-page]` sections. Its element
lookups are **not** guarded - it assumes the full template is present, so it
throws if you strip a section out of the templates.

---

## 5. Third-party runtime dependencies

Everything is loaded from a CDN at page load. Versions are pinned; do not
reintroduce `@latest` or `@next`, which is how this page silently broke before.

| Where | What |
| --- | --- |
| Root site | Boxicons 2.1.4, Remix Icon 3.6.0, AOS 2.3.4, Google Fonts (IBM Plex Sans) |
| Jinja site | Ionicons 5.5.2, Google Fonts (Poppins) |
| Root site | Formspree contact form, endpoint `meqypdyv` |
| Root site, `/tasks/`, `/resources.html` | Notion embeds and redirects |

The Formspree endpoint and the Notion pages are external accounts. If either is
deleted, the contact form silently stops delivering and the embeds go blank -
there is no error handling for that.

---

## 6. Known issues and decisions

- **Content is duplicated** between the root site and the Jinja site, with no
  shared source of truth. Living with it; the site is archived.
- **The repo history is large.** Around 87 MB of unreferenced images were
  removed from the working tree, but they are still in git history, so a fresh
  clone is still heavy. Actually reclaiming it needs `git filter-repo` and a
  force-push, which rewrites every commit hash - deliberately not done.
- **`docs/` keeps every old resume export** (`portfolio_old*.pdf`,
  `portfolio_c1.pdf`) alongside the current `portfolio.pdf` and its LaTeX and
  Typst sources. Only `portfolio.pdf` is linked from the site.
- **`todo/app.py` is a Flask backend that is not deployed.** The front end at
  `/todo/` talks to an external PythonAnywhere instance, so the local file is
  reference material only.
- **`temp_test/`** holds one-off files that used to clutter the web root - IMS
  redesign diagrams and an abandoned redirect page. See
  [`temp_test/README.md`](temp_test/README.md).
- **`/cv/` uses `<object>`** with a download link as fallback, because most
  mobile browsers refuse to render PDFs inline.

---

## 7. Checking a change

There are no tests. Serve the repo root and look:

```bash
python3 -m http.server 8000
```

- `/` - archive banner sits above the header without overlapping it; dismiss it
  and reload to confirm it stays gone; check the layout at 375px and 1440px.
- Open DevTools and confirm there are no 404s. That is the real check that no
  image reference is dangling.
- `/cv/` - the PDF fills the viewport.
- Rebuild the Jinja site (`cd jinja && python main.py`) and open `/jinja/` - the
  page router, project filter and modal all work, and the avatar loads.
