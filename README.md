# shaharbrook.github.io

Single-page bilingual (English / Hebrew RTL) portfolio site. Plain HTML, CSS
and ~2 KB of JavaScript — no build step, no dependencies, no framework. Push to
`main` and GitHub Pages serves it.

```
index.html              all the copy and markup, EN + HE
assets/css/styles.css   design tokens + every style rule
assets/js/main.js       language switch, footer year, header border, fade-in
assets/img/favicon.svg  favicon (accent-coloured)
.nojekyll               tells GitHub Pages to serve files as-is
robots.txt / sitemap.xml
```

---

## Content status

**Nothing is outstanding.** Every value is real and every placeholder is gone —
verify with:

```bash
grep -c 'class="fill"' index.html   # expect 0
```

Wired and live:

| What | Value | Where |
|---|---|---|
| **WhatsApp** | `972544994592` | 6 `wa.me/` links — header, hero, `#contact`, EN + HE each |
| **Email** | `bro.shahar@gmail.com` | 4 `mailto:` links |
| **LinkedIn** | `linkedin.com/in/shahar-brook/` | `#contact` socials + JSON-LD |
| **GitHub** | `github.com/ShaharBrook` | `#contact` socials + JSON-LD |

WhatsApp numbers are international format — no `+` and no leading zero, so an
Israeli `05X-XXX-XXXX` becomes `9725XXXXXXXX`. To change either contact later:

```bash
sed -i '' 's/972544994592/NEW_NUMBER/g' index.html
sed -i '' 's/bro\.shahar@gmail\.com/NEW@EMAIL.COM/g' index.html
```

The only thing still worth adding is `assets/img/og.png` — see below.

To change either later:

```bash
sed -i '' 's/972544994592/NEW_NUMBER/g' index.html
sed -i '' 's/bro\.shahar@gmail\.com/NEW@EMAIL.COM/g' index.html
```

### How the CTAs are wired

**WhatsApp is the primary action** everywhere — the accent button in the hero
and in `#contact`, and the header button goes straight to it from any scroll
position. Email is the secondary ghost button, for people who want to send
detail rather than start a chat. On this market that ordering converts better;
to flip it, swap `btn-primary` and `btn-ghost` between the two.

Each `wa.me` link carries a **prefilled message** (`?text=…`, URL-encoded, one
per language) so the conversation opens with context instead of a blank box.
Edit the text and re-encode it, or drop the `?text=` part entirely.

**Note on the case studies:** both are real projects with live links —
Greenroom (`crm.lrdigital-marketing.com`) and the L.R Digital Marketing
landing page (`lrdigital-marketing.com`).

The Greenroom card is written from **`greenroom-case-study.md`** in this repo
root, which is `.gitignore`d — working notes, not published. Every technical
claim on the card traces back to that file. If you change the architecture,
update the notes and then the card, in that order; the notes are the source of
truth and the card is a 4-bullet edit of them.

**Both cards are complete — there are no yellow placeholders left anywhere on
the site.** The landing-page card's last two entries were written from
measurements taken against the live site rather than from memory: Cloudflare
edge delivery, a 30 ms server response, zero main-thread blocking time, and the
Lighthouse scores quoted in the result (100 best practices / 94 accessibility /
92 SEO / 86 performance on a throttled mobile run).

If you change that site, re-measure before trusting those numbers:

```bash
npx lighthouse@12 https://lrdigital-marketing.com/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --screenEmulation.mobile --view
```

The `.fill` CSS rule is still in `styles.css` on purpose — it costs nothing and
it will make any future placeholder glow yellow so you cannot ship it by
accident.

### Adding the Greenroom screenshots

The gallery is already built — CSS, captions in both languages, and a native
`<dialog>` lightbox. It is **commented out** in `index.html` (search for
`SCREENSHOTS — currently disabled`) because a broken `<img>` looks worse than
no gallery. Three steps:

1. **Capture from a demo account with invented client data.** Not the real
   studio's data. Before publishing, check browser tabs, tooltips,
   notification badges and autocomplete dropdowns — that is where real data
   survives a redaction pass. Cropping beats blurring; blurred regions look
   evasive and are occasionally recoverable.

2. **Convert to WebP at 1600px.** No extra tooling needed on macOS:

   ```bash
   sips -Z 1600 -s format webp -s formatOptions 80 \
     raw-board.png --out assets/img/greenroom-board.webp
   ```

   Expected filenames: `greenroom-board.webp`, `greenroom-campaign.webp`,
   `greenroom-files.webp`. Keep each **under ~150 KB** — images are by far the
   easiest way to lose the Lighthouse 100 this site currently scores. Check
   with `ls -lh assets/img/`.

3. **Uncomment the block** — delete its opening `<!-- …` line and the closing
   `… -->` line. Then rewrite each `alt` and each caption to match what you
   actually captured. The `alt` is read aloud by screen readers, so it should
   describe the screen rather than repeat the caption.

The gallery does nothing until then: no images, no requests, no JS runs.

**On the lightbox:** each screenshot is a plain
`<a class="shot" href="full-size.webp">` that already works with JavaScript
off — it just opens the image. `main.js` upgrades it to a `<dialog>`, which
brings Escape-to-close and focus trapping for free. Same progressive-
enhancement pattern as the language switch.

⚠️ **HTML comments cannot nest.** If you add a `<!-- note -->` inside the
disabled block, its `-->` terminates the outer comment early and the rest of
the gallery goes live as broken markup. Use a plain-text line instead.

**Note on the About section:** this one is built from what you told me — an IDF
technology unit (developer → commander → software-engineering instructor), BSc
in Computer Science finished during high school before enlisting, developer and
team lead in startups, and technical partner in a digital marketing agency. The
unit is deliberately unnamed. Check the wording says what you want it to say
publicly, in both languages.

### Images

The site deliberately ships **no raster images in the page itself**. The four
service icons, the social icons and the external-link glyph are all inline
SVG; the hero glow and the contact card are CSS gradients. That is most of the
reason it is ~25 KB and scores 100 on performance. Adding photographs is the
easiest way to lose that, so weigh each one.

What exists:

| File | What it is | Loaded by |
|---|---|---|
| `assets/img/favicon.svg` | Vector favicon, accent-coloured | Browsers, tab bar |
| `assets/img/og.png` | 1200×630 link-preview card | WhatsApp / LinkedIn / Slack crawlers only — never by a visitor |

**Regenerating the preview card.** It is generated from HTML, not designed in
an image editor, so it stays in sync with the site's type and colour:

```bash
npm install --no-save playwright     # once
node tools/og-render.mjs             # writes assets/img/og.png
```

Edit `tools/og-template.html` to change the wording. Keep the headline to two
lines — three overflows the card at that size.

⚠️ **The link preview is always English.** Crawlers read the static `<head>`
and do not run the JavaScript that swaps the title and description, so a
Hebrew visitor sharing `?lang=he` still gets the English card. Fixing that
properly needs a second HTML file (`he.html`) with Hebrew `og:` tags. Worth
doing only if most of your sharing happens in Hebrew.

---

## Bilingual: how it works

Every piece of copy exists **twice** in `index.html`, as adjacent sibling
elements — one `lang="en"`, one `lang="he"`:

```html
<h2 class="section-title" lang="en">Problems, decisions, results</h2>
<h2 class="section-title" lang="he">בעיות, החלטות, תוצאות</h2>
```

A single CSS rule (section 2b of `styles.css`) decides which one is on screen,
based on the `lang` attribute of `<html>`:

```css
html[lang="en"] [lang="he"]:not(.lang-btn),
html[lang="he"] [lang="en"]:not(.lang-btn) { display: none; }
```

Why this shape rather than swapping strings from a JS dictionary:

- It works with **JavaScript disabled** — English renders, and `?lang=he` still
  switches, because the EN/עב control is two real `<a href="?lang=…">` links.
- Both languages are **in the DOM**, so both are crawlable, and the bold/accent
  markup inside a sentence survives translation.
- `display: none` also removes the hidden copy from the **accessibility tree**,
  so a screen reader never reads the page twice.

**Which language loads first:** `?lang=` in the URL → the visitor's saved
choice (`localStorage`) → browser language (`he*` gets Hebrew) → English. That
is decided by the inline script in `<head>`, before first paint, so the page
never flashes the wrong language or direction.

### Editing the copy

Edit the two siblings together and you cannot drift. To sanity-check that
nothing lost its pair, every `lang="en"` element should have a `lang="he"`
sibling — a missing one shows up immediately as a gap on the page.

Three things live **outside** the body and are swapped by JS instead:

| What | Where |
|---|---|
| `<title>` and meta description per language | `LANG_META` at the top of `assets/js/main.js` |
| `hreflang` alternates | `<head>` of `index.html` |
| `alternateName` (Hebrew name) | the JSON-LD block at the bottom |

### RTL

The stylesheet uses **logical properties** throughout — `padding-inline-start`,
`border-inline-start`, `inset-inline-start`, `margin-inline` — so the entire
layout mirrors itself when `dir="rtl"` is set. There are only three explicit
RTL rules in the file, all cosmetic: mirroring the hero gradient, flipping the
arrow icon, and switching tags off the monospace font (which has no Hebrew).

If you add layout CSS, **use logical properties, not `left`/`right`** or you
will break the Hebrew side without noticing on the English one.

### Numbers, %, emails inside Hebrew

The bidi algorithm moves trailing symbols to the wrong side: `10+` renders as
`+10`, `X%` as `%X`, and a sentence ending in a Latin word puts the full stop
on the far left. Two tools for this:

- `.fill` placeholders are already bidi-isolated.
- Wrap anything else in `<span class="ltr">` — e.g. `<span class="ltr">99.9%</span>`,
  emails, URLs, version numbers.

Easiest fix is usually to phrase around it: `מעל 10 שנות` instead of `10+ שנות`,
`X אחוזים` instead of `X%`.

### Adding a third language

Add `lang="xx"` siblings, extend the CSS rule and `LANG_META`, add a third
`.lang-btn`, and add its `hreflang`. Past three languages, the duplication
stops being worth it — that is the point to move to one file per language.

---

## Customising

### Colours

One block, top of `styles.css`. Change `--accent` and the whole site follows —
buttons, icons, bullets, focus rings, the hero wash, the favicon background.

```css
:root {
  --accent:       #0b6b53;   /* deep teal-green */
  --accent-hover: #095843;   /* ~8% darker */
  --accent-ink:   #ffffff;   /* text ON the accent — must contrast 4.5:1+ */
}
```

Four pre-checked alternatives are listed in a comment right there
(cobalt, plum, rust, slate-ink). If you pick your own, verify
`--accent` against `--accent-ink` at <https://webaim.org/resources/contrastchecker/>
— the current pair is 6.5:1.

The favicon has its own hardcoded copy of the accent in
`assets/img/favicon.svg`; update it to match.

**Dark mode** is a second `:root` block inside
`@media (prefers-color-scheme: dark)`. Same token names, darker values. To
ship light-only, delete that block.

### Type

`--font-sans` uses the system stack, which means text paints instantly with
zero network requests. If you want a custom face, self-host one variable font
in `assets/fonts/`, add an `@font-face` with `font-display: swap`, and put it
at the front of `--font-sans`. Avoid a Google Fonts `<link>` — it costs a
round-trip before any text can render.

Sizes are fluid (`clamp()`), so there are no font-size media queries to keep
in sync. Change `--step-4` to resize the hero headline.

### Adding a case study

Copy one whole `<article class="case reveal">` block in `#work` and edit it.
The grid takes any number of cards. Keep the four beats — **The problem /
What I built / Key decisions / Result** — that repetition is what makes the
section scan quickly. Remember to fill in both the `lang="en"` and the
`lang="he"` line of each pair.

Same for services: copy an `<article class="card reveal">`. The grid is set to
1 / 2 / 4 columns by breakpoint. If you move to 5 or 6 services, swap
`.grid-services` for the one-line `auto-fit` version noted in the comment
above it — with exactly four cards, `auto-fit` lands on 3 + 1 at common
desktop widths, which reads as a bug.

### Section order

Each section is a self-contained `<section>` in `index.html`. Move one and
nothing breaks; the nav links follow the `id` attributes.

---

## Running it locally

No build, no `npm install`. Either open `index.html` directly, or:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

(The local server is only needed if you later add anything that fetches a
file — right now `file://` works fine.)

---

## Deploying to GitHub Pages

The remote is already `ShaharBrook/ShaharBrook.github.io`, which is the magic
repo name for a user site — it publishes at **https://shaharbrook.github.io**
with no extra config.

```bash
git add -A
git commit -m "Portfolio site"
git push origin main
```

Then once, in the repo: **Settings → Pages → Build and deployment**
→ Source: **Deploy from a branch**, Branch: **`main`**, Folder: **`/ (root)`**.
Save. First publish takes a minute or two; after that pushes go live in ~30s.

`.nojekyll` is committed so GitHub serves the files untouched instead of
running them through Jekyll.

### Custom domain later

Add a `CNAME` file containing just the domain (e.g. `shaharbrook.dev`), point
a DNS `CNAME` record at `shaharbrook.github.io`, then enable **Enforce HTTPS**
in Settings → Pages. Also update `og:url`, `canonical`, the sitemap and the
JSON-LD `url` to the new domain.

### Netlify / Vercel instead

Drag the folder onto Netlify, or `vercel --prod`. There is no build command
and no output directory — it is already static.

---

## Accessibility & performance notes

Things that are already handled, so you do not undo them by accident:

- **Semantic structure** — one visible `<h1>`, headings in order, `<main>`,
  `<nav aria-label>`, `<article>` per case study. Screen readers get a real
  outline, in one language only.
- **Language is declared correctly** — `lang` and `dir` on `<html>` are the
  master switch, and every text node carries the right `lang`, so a screen
  reader uses the right voice and pronunciation.
- **Skip link** — first tab stop, jumps past the header.
- **Focus rings** — `:focus-visible` with a 2px accent outline, never removed.
- **Contrast** — body text is 8:1+ on both themes; muted text stays above 4.5:1.
- **Reduced motion** — `prefers-reduced-motion: reduce` disables the fade-ins
  and smooth scrolling entirely.
- **No-JS** — the fade-in only activates once JS confirms it is running, and an
  `onload` check un-hides everything if `main.js` fails to load. Content is
  never invisible, in any failure mode. Nothing on the site depends on JS.
- **Zero third-party requests** — no fonts, no analytics, no cookie banner
  needed. Total payload is around 20 KB gzipped, both languages included.
- **Mobile-first** — layouts are `auto-fit` grids; the few media queries are
  `min-width`. Buttons go full-width under 26em for bigger tap targets.

If you add analytics, prefer something cookieless (Plausible, Fathom, Cloudflare
Web Analytics) or you will need a consent banner and the "no cookie banner" line
in the footer becomes a lie.

---

## Lighthouse

Worth running before you send the link to anyone, because the site is itself a
work sample:

```bash
npx lighthouse https://shaharbrook.github.io --view
```

Expect 100s across the board. If Performance drops, the cause is almost always
something added later: an unoptimised image, a web font, or a third-party
script.
