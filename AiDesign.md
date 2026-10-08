# AiDesign.md: frontend design brief for AI agents

Read this file before you touch any styling in `Frontend/`. It holds the site's theme and the owner's rules
for design work. **When your design task is finished, update this file** (status table, pending requests,
changelog) so the next session starts with the current picture.

---

## 1. The rules (from the project owner, non-negotiable)

1. **CSS files only.** You may create and edit `.css` files. You may **not** change any `.tsx` / `.ts` file,
   not even a className, a wrapper `<div>` or a typo in visible text.
2. **Need a TSX change? Ask first.** If you see a real reason to change a TSX file (missing markup, a bug
   that CSS can't hide, accessibility), **stop and ask the owner for permission**. Explain what you'd change
   and why. Never decide on your own. Record the request in section 6 while it's pending.
3. **Don't redesign what's already designed.** Components marked *Designed* in section 5 stay as they are
   unless the owner asks for a change. Your job is to style the missing pieces and make sure the existing
   design holds (no broken layouts, overflow, overlap or mobile breakage). Fix breakage with minimal CSS
   and keep the existing look.
4. **Stay on theme.** Use the tokens and patterns below so every page feels like the same site.
5. **Update this file when you're done.**

---

## 2. Theme: "Coastal Editorial"

**Mature, calm, boutique-travel-magazine.** The owner found the first theme (rainbow gradients, emoji,
bouncing pills, script font) too childish. Keep it grown-up:

- **No emoji in the UI.** Not as icons, watermarks or prefixes. If an icon is needed, use a small inline SVG
  (as a `mask` or `background-image` data URI) so it takes a token color. Typographic glyphs (♥ → $ ·) are fine.
- **No idle motion.** Nothing floats, sways, spins for decoration or animates a gradient forever. Motion
  is only for entrances (short `fade-up`), loading (spinner ring) and hover feedback (1–3px lift, color).
- **No glowing pills or rainbow borders.** Solid fills, 1px borders, soft ink-tinted shadows.
- **One accent at a time.** Terracotta is the accent; deep sea is the secondary. Most of the page is
  ivory, white and ink.

### Palette (tokens in `index.css`)
| Role | Token | Value |
|---|---|---|
| Page background (warm paper) | `--bg` | `#f6f2ea` with two faint static light washes |
| Cards / surfaces | `--surface-solid` | `#ffffff` |
| Ink (text, footer) | `--text`, `--ink` | `#15222c` |
| Muted / faint text | `--text-muted`, `--text-faint` | `#56636d`, `#8b959c` |
| Accent: terracotta | `--coral`, `--primary` (hover `--primary-hover`) | `#c0532b` (`#a8461f`) |
| Secondary: deep sea | `--ocean` | `#1d5f77` |
| Supporting | `--sun` (muted gold), `--lagoon`, `--mint`, `--sand` | |
| Hairlines | `--border`, `--border-strong` | ink at 9% / 17% |

Legacy token names are kept so older CSS still works, but their values changed:
`--g-sunset` = terracotta fill, `--g-ocean` = sea fill, `--g-text` = solid ink, `--g-rainbow` = the muted
gold → terracotta → sea hairline (used only for the 2px strip on top of the viewport), `--bounce` = no
overshoot. **In new work use solid tokens (`--primary`, `--ocean`, `--text`), not the `--g-*` ones.**

### Type
- **Fraunces** (`--font-serif`, also `--font-display`): headlines, page titles, wordmark, destination
  names, prices, the 404. Weight 500–600, letter-spacing −0.01 to −0.02em. Italic for quiet accents
  (footer tagline, empty states, About letter).
- **Inter** (`--font-sans`): all UI and body text. Labels 0.8rem/600 in sentence case.
- **Kickers** (small text above a headline): 0.72rem, weight 600, uppercase, letter-spacing 0.16–0.18em, in
  `--coral` or `--ocean`, with a 1.5rem × 1px rule before it
  (`padding-left: 2.1rem; background: linear-gradient(color,color) left center / 1.5rem 1px no-repeat`).
  There's also an `.eyebrow` utility.
- **JetBrains Mono** (`--font-mono`): dates and code only.

### Shape & elevation
Radii: `--radius-sm` 6, `--radius` 10 (buttons, inputs), `--radius-lg` 14 (cards), `--radius-xl` 20 (hero
and prompt cards). Pills (`--radius-full`) only for badges. Shadows: `--shadow-sm` on controls, `--shadow` on
cards, `--shadow-lg` on hero cards, dropdowns and auth cards.

### Buttons (global defaults in `index.css` section 4)
- **Primary:** every `<button>` is solid terracotta with white text, radius 10px, 1px lift and a soft shadow on
  hover. No gradients, glow, text-shadow or emoji.
- **Secondary:** sea (`.btn-ocean`, or set `background: var(--ocean)`), used for admin "Edit".
- **Quiet / outline:** transparent background, ink text, `--border-strong` border, used for Like, Logout
  and `.btn-ghost`.
- **Destructive:** white with a red outline that fills red on hover (`.btn-danger`, Delete).
- **Text-link button:** no background, sea-colored underlined text, used for "Already a user? Login" on Home.
- At most **one primary button per view**; everything else steps down.

### Signature motif
**Sun setting over a lined sea**: a sky gradient, a terracotta or gold sun disc half-set into a deep-sea
band with thin white horizontal lines. It appears as the Home arch window, the VacCard banners (4 muted
palettes) and the header logo tile. Reuse it for any new illustration need instead of emoji.

### Dark mode
Opt-in through `<html data-theme="dark">` (night variant, tokens only). Nothing sets it yet. Components
only need overrides where they hard-code a color.

---

## 3. Where things live

| File | What it holds |
|---|---|
| `Frontend/src/index.css` | **The design system.** Tokens, reset, typography, global form/button/table styles, utility classes (`.card .badge .alert .grid .stack .eyebrow ...`), **every shared `@keyframes`**, iziToast overrides. Read its header first. |
| `Frontend/src/components/**/x.css` | One plain-CSS file per component, imported by its TSX. Pages are grouped by who can see them: `Pages/all-users/`, `Pages/logged-users/`, `Pages/admin/`. |

---

## 4. How CSS is written here

- **Plain CSS.** No modules, no preprocessors, no Tailwind, no inline styles.
- **Scope under the component's root class.** It's the PascalCase component name, for example
  `.AiRecommendationPage form input`. Never style bare elements in a component file.
- **Start each file with a header comment** that maps the DOM order and the layout plan (see
  `home.css` or `vac-card.css`). The TSX usually has no classes on children, so the next agent needs that map.
- **Target structure, not classes.** Since you can't add classes, use child/type selectors (`> p:first-of-type`,
  `:nth-of-type`), `:has()`, `:empty` (to hide empty answer boxes or error spans), grid `order` and
  explicit `grid-row`/`grid-column` to rearrange without touching the TSX. Page titles and subtitles that
  the TSX lacks are added as `::before` / `::after` text with flex `order`.
- **Use tokens, not raw values.** A raw hex is fine only inside an illustration (the sun/sea motif).
- **Put keyframes in `index.css`** (section 7). Use `fade-up`, `fade-in`, `rise`, `card-in`, `spin`, `pulse`.
  `float`, `sway`, `flow`, `gradient-shift` and the wave keyframes are legacy: don't use them.
- **Mobile first-class.** Common breakpoints: 560px (stack prompt cards), 600px and 900px (grids), 720px (app
  shell), 860px (Home art hides). Every page must work at 400px wide with no horizontal scroll.

### Recurring page pattern: AI pages (`AskMcpPage`, `AiRecommendationPage`)
A centered column at `min(100%, 760px)`: kicker (`::before`) → serif headline → **prompt card** (white,
1px border, `--radius-xl`, `--shadow`) with a small field label, an input and a primary button side by side
(stacked under 560px) → reply card (white, 3px sea left border, "Answer" label) → a loading line with a
small spinning ring. New AI features follow this pattern.

### Recurring page pattern: admin dashboards (`LikeAnalytics`)
Left-aligned column at `min(100%, 960px)`: sea kicker "Admin · Insights" (`::before`) → serif headline →
muted subtitle with a hairline under it (`::after`, flex `order: 2`) → **chart card** (white, 1px border,
`--radius-lg`, `--shadow`) with a small uppercase label in its top padding ("Likes per destination").

### Recurring page pattern: admin forms (`AddVacationPage`, `UpdateVacation`)
A centered column at `min(100%, 620px)`: the outside "Back" `<button>` becomes a quiet "← Back" text link on
top (`order: -1`) → kicker "Admin · Vacations" (`::before`) → serif headline (`::after`) → **form card**
(white, 1px border, `--radius-xl`, `--shadow`, 3px top hairline in `--form-accent`: terracotta for Add,
sea for Edit). Inside the card a 2-column grid places each field **by its `name` attribute**
(`input[name="startAt"]`, `label:has(+ input[name="…"])`, `input[name="…"] + .error`) on fixed rows, so the
conditional error spans never shift the layout. The two dates sit side by side and stack under 480px. Price
gets a "$" inside the field. The cover image is a 3:2 preview box (dashed "No image selected" state when
`:empty`, the same crop as VacCard) with a separate outline "Select Image" label-button under it. Full-width
primary submit. The two CSS files are copies with the root class, accent and headline swapped: keep them in sync.

### Recurring pattern: pagination (`VacList`, react-paginate)
The `ul.pagination` spans the full grid width under the cards (`grid-column: 1 / -1`), centered, with a
`--border` hairline above it. Each control is a 2.5rem quiet square (radius `--radius`, Inter 600, tabular
numbers) that gets a white surface, a border and a 1px lift on hover. The current page (`li.active`) is solid
ink (`--text` fill, `--surface-solid` text), not terracotta, so it never competes with the primary button.
Prev/next are outlined squares: their label is hidden with `font-size: 0` and drawn as `←` / `→` in `::before`.
`li.disabled` fades to 35%. The whole pager hides when it has fewer than 4 `<li>` (one page or none).
Squares shrink to 2.25rem under 480px; 10+ pages wrap to a second line on phones (fine for now).

**Styling Recharts from CSS** (the TSX passes colors as props, but CSS still wins):
- SVG attributes (`fill="#15222c"`, `stroke="#666"`) are presentation attributes, so any CSS rule overrides
  them. Bars: `.recharts-bar-rectangle path`. Axes: `.recharts-xAxis` / `.recharts-yAxis` with
  `.recharts-cartesian-axis-line`, `-tick-line`, `-tick-value`. Hover row: `.recharts-tooltip-cursor`.
- Inline `style` (the tooltip box `.recharts-default-tooltip`, the item color, the responsive container's
  `width: 100%`) needs `!important`. Use it only there.
- To make `.recharts-responsive-container` the card, give it `box-sizing: content-box; width: auto !important`
  and padding. Recharts re-measures its content box with a ResizeObserver, so the chart still fits.
- Bar thickness and rounding without props: `clip-path: inset(max(0px, calc(50% - 10px)) 0 round 0 4px 4px 0)`
  caps a horizontal bar at 20px and rounds only the data end.
- Chart specs (dataviz): one series → no legend. Bars in `--primary`, hairline axes, tick text in ink tokens
  (never the bar color). In the tooltip the value leads (serif, ink) with a terracotta `♥` key.

### Gotchas we've hit
- An absolutely positioned grid child uses its grid area as the containing block **only if both lines
  are explicit** (`grid-column: 1 / 2`). An `auto` end line falls back to the padding edge.
- Huge `border-radius` values (999px) get scaled down together with the other corners. For an arch, use
  exact half-width radii.
- An emoji written with a variation selector (`©️`) ignores `font-variant-emoji: text`.
- **Broken `<img>`:** Chrome renders `img::after` only when the image fails to load. VacCard uses it
  (`position: absolute; inset: 0; background: inherit`) to paint the fallback over the broken-image icon.
  Use the same trick for any future photo.
- **Photos of mixed sizes:** give the `<img>` a fixed `aspect-ratio`, `height: auto` and `object-fit: cover`.
  Uploads range from 275px wide to 2048px, portrait to panorama.
- A **numeric** `height` on `ResponsiveContainer` is used as is: CSS `min-height` grows the box but not the chart.
- **A library that always renders a wrapper breaks `:empty`.** react-paginate renders its `<ul>` even with
  0 pages, so VacList's empty state matches `.VacList:not(:has(> .VacCard, > span))` instead of `:empty`.
- **Grid with conditional children:** give every child an explicit `grid-row` and set `row-gap: 0` (spacing
  goes in margins). Empty implicit rows then collapse to 0, so one row numbering works whether or not an
  error span is rendered, and a breakpoint can move items into rows that are empty on desktop.

---

## 5. Design status

| Component | Status | Notes |
|---|---|---|
| index.css (design system) | Designed | Coastal Editorial |
| Layout, Header, Menu, Copyrights | Designed | Frosted ivory bar, 2px hairline on top, text nav with terracotta underline on the active link, ink footer with terracotta top rule |
| Login, Register, LogoutBtn | Designed | White auth cards with a colored top hairline (terracotta / sea) |
| Home | Designed | Left-aligned editorial hero, arch-window art on the right (hidden under 860px), one primary CTA plus a text-link Login |
| About, Page404 | Designed | Letter card / large italic serif 404 |
| VacationPage, VacList, VacCard | Designed | Full-bleed destination photo on top of each card, cropped to 3:2 (`object-fit: cover`) so every card matches. The sun/sea motif is the photo's loading / broken-image fallback. Rows of cards are equal height with the buttons pinned to the bottom. Pagination (react-paginate) under the grid, see section 4. Three TSX requests in section 6. |
| Spinner | Designed | GIF in a thin terracotta ring |
| AskMcpPage | Designed | Reference for the AI-page pattern |
| AiRecommendationPage | Designed (form + loading) | Search card with an SVG-pin suggestions dropdown (shown on focus). The result isn't rendered by the TSX yet, see section 6. |
| LikeAnalytics (admin) | Designed | Reference for the admin-dashboard pattern: terracotta 20px bars in a white chart card, ♥ tooltip, italic empty state. Two TSX requests in section 6. |
| AddVacationPage (admin) | Designed | Reference for the admin-form pattern (terracotta accent). One TSX request in section 6. |
| UpdateVacation (admin) | Designed | Same layout as AddVacationPage with a sea accent; the preview box shows the current photo. |

---

## 6. Pending TSX requests (need the owner's permission)

- **AiRecommendationPage: render the result.** `completion` (a `VacationRecommendation`: title, summary,
  sections with highlights, tips, matching vacations, notice) is fetched but never rendered, so nothing
  shows after loading. Once markup exists, style it as a reply card in the AI-page pattern.
- **AiRecommendationPage: suggestion details (minor).** Duplicate destinations show twice (one `<li>` per
  vacation, no de-dupe). The `<li>`s aren't keyboard-focusable (`<button>`s inside would fix it), and
  picking one doesn't clear `destinations` (CSS already hides the list on blur, so this is cosmetic).
- **LikeAnalytics: load the vacations.** The page only reads `state.vacation`, which gets filled when
  `VacList` mounts. Opening `/admin/likes` directly (or refreshing it) shows an empty chart. Calling
  `vacationService.getAllVacations()` in a `useEffect`, as `VacList` does, would fix it. Until then, CSS
  shows "No likes to chart yet." in the card (keyed off the container's inline `height: 0px`).
- **LikeAnalytics: chart height (minor).** `height={data.length * 40}` also has to fit the X axis (~40px),
  so with 1–2 vacations the rows get squeezed and Recharts drops labels. `data.length * 40 + 40` fixes it.
  Nice to have: `name="Likes"` on `<Bar>` (CSS currently hides the raw "likeCount :" in the tooltip), and
  dropping `fill="#15222c"` (CSS overrides it anyway).
- **VacCard: `alt` on the photo.** The `<img>` has no `alt`, so screen readers announce nothing (or the
  file URL). `alt={props.vacacation.destination}` fixes it; `loading="lazy"` would also help once the list
  grows. CSS already hides any alt text that shows while a photo is broken.
- **VacCard: Like vs UnLike state (minor).** Both buttons look identical apart from the word, because CSS
  can't match on text. `aria-pressed={props.vacacation.isLiked}` on the button (also good for
  accessibility) would let CSS fill the heart and tint the button for liked vacations.
- **Add/Update vacation: keyboard access to "Select Image" (minor).** The file input has `hidden`, so it
  can't be focused and keyboard users can't pick an image. A visually-hidden class on the input instead of
  `hidden` would fix it, and CSS could then show a focus ring on the label with `:has(input:focus-visible)`.
  Nice to have: `<textarea>` for Description (it's `<input type="textarea">`, i.e. a one-line text box).
- **VacList: pagination details (minor).** `previousLabel="'"` / `nextLabel="'"` look like typos. CSS hides
  them and draws arrows, so `"←"` / `"→"` (or the defaults) would make that swap unnecessary. Changing page
  doesn't scroll back up, so after clicking the pager under the cards the user lands at the bottom of the new
  page; `window.scrollTo({ top: 0, behavior: "smooth" })` in `onPageChange` fixes it. Nice to have:
  `renderOnZeroPageCount={null}` so the empty `<ul>` isn't rendered while loading.
- **Copyrights: use a plain `©`.** The TSX has `©️` (emoji form), which renders as a purple emoji. CSS
  currently mutes it with `filter: grayscale(1)`. Remove that line once the character is fixed.

---

## 7. Verifying your work

Protected routes need a logged-in user, so the quickest visual check is a **static mock HTML** in your
scratch folder. Paste the components' DOM, add `<base href="file:///…/Frontend/src/">`, link `index.css`,
the layout CSS and the component CSS, then screenshot it with headless Chrome. Public routes (`/home`,
`/login`, `/register`, `/about`) can be shot straight from the Vite dev server (`http://localhost:5173`).

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --allow-file-access-from-files \
  --screenshot=out.png --window-size=1280,900 --virtual-time-budget=6000 --user-data-dir=<scratch> <url>
```

**Recharts pages:** a static DOM paste won't work. Bundle the real component with a mock store instead.
Write a scratch `entry.tsx` that renders the page inside
`<Provider store={configureStore({ reducer: { vacation: () => sample, user: () => null } })}>`. Build it with
Vite's own bundler: load it through `createRequire("<Frontend>/package.json")("rolldown")`, then call `build({ input,
resolve: { modules: ["<Frontend>/node_modules"] }, moduleTypes: { ".css": "empty" }, output: { format: "iife" } })`.
Link the CSS in the mock HTML yourself. Add `--force-prefers-reduced-motion` to Chrome or the bars stay
empty (the entrance animation never runs under virtual time). For the tooltip, render a copy of the chart
with `<Tooltip defaultIndex={n} />`. Give each Chrome run its own `--user-data-dir` (or run them one at a
time): parallel runs sharing a profile silently fail.

Headless Chrome won't shrink below about 500px wide, so for mobile, screenshot a wrapper page holding 400px
`<iframe>`s. `autofocus` on an input captures focus-only states, but it also scrolls the page to that input.

---

## 8. Changelog

- **2026-10-04:** Created this file. Designed `AiRecommendationPage` (CSS only).
- **2026-10-04:** The owner found the theme too childish → re-themed the whole site from "Endless Summer"
  (rainbow gradients, emoji, Pacifico, bounce) to **"Coastal Editorial"**. Touched `index.css` and every
  component CSS. Home buttons redesigned (one solid primary CTA plus a text-link Login). The previous theme
  is in git history (commit `c21122e`) if it's ever needed.
- **2026-10-06:** Designed the admin `LikeAnalytics` page (CSS only): editorial header, chart card,
  restyled Recharts bars, axes and tooltip, and an empty state. Added the admin-dashboard pattern and
  Recharts notes (section 4), a Recharts verification recipe (section 7) and two LikeAnalytics TSX
  requests (section 6).
- **2026-10-08:** Vacations now have real photos. VacCard (CSS only): the `<img>` moves to the top with
  `order: -1`, bleeds to the card edges, and every photo is cropped to the same 3:2 box. The old CSS sun/sea
  banner is now the photo's loading / broken-image fallback. VacList stretches cards to equal height and VacCard
  pins the buttons to the bottom. Added two VacCard TSX requests (section 6) and two gotchas (section 4).
- **2026-10-08:** Designed the admin `AddVacationPage` and `UpdateVacation` forms (CSS only; the owner had
  already split the image upload into a preview box and a "Select Image" label in the TSX). Added the
  admin-form pattern and a grid gotcha (section 4), and two form TSX requests (section 6).
- **2026-10-08:** With the owner's OK, fixed the form TSX: the start date, end date and price error spans
  showed `errors.destination?.message`; each now shows its own field's message (both pages).
- **2026-10-09:** Styled the VacList pagination (CSS only). It was a bulleted list sitting in a grid cell; now
  it's a centered pager under a hairline with quiet squares, a solid-ink current page and arrow prev/next.
  Fixed the VacList empty state, which the always-rendered `<ul>` had broken. Added the pagination pattern
  and a gotcha (section 4) and a VacList TSX request (section 6).
