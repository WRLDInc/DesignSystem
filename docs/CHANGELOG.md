# Changelog

All notable changes to the WRLD Design System are documented here. This project follows semantic versioning.

## [0.2.1] — 2026-08-17

### Fixed

- **Favicon is the starburst, not the circular disc.** Regenerated `logos/favicons/` (and the `assets/logos/favicons/` mirror) from the 18-ray mark. Added `favicon.svg` (white starburst on `#0a0a0a`). Styleguide and UI-kit pages now point at `favicon.svg` with PNG fallbacks. The old circle/gear raster set is gone.

## [0.2.0] — 2026-08-11

Synced this repository to the canonical Claude Design project
([`6276ea8b`](https://claude.ai/design/p/6276ea8b-b376-4583-9364-88bd47131659), revision dated 2026-08-11),
which had advanced well past the last repo push. Repo-only assets — `brand/`, `logos/`, `scripts/`, `docs/`,
CI, and `tokens/tokens.ts` — were preserved; the design project does not carry them.

### Changed

- **Type system consolidated to two families.** Dropped `Inter`, `JetBrains Mono`, and `Fira Code` from every
  fallback stack, across all three token sources (`tokens.css`, `tokens.json`, `tokens.ts`) plus
  `colors_and_type.css`. Body is now `'Ubuntu', system-ui, -apple-system, sans-serif`; mono is
  `'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace`. Every required face is vendored under
  `fonts/`, so third-party fallbacks bought nothing and risked rendering drift.
- **Master brand brief** (`brand/CLAUDE.md`) typography table corrected — it still advertised the dropped
  families and now contradicted the tokens it is supposed to govern.
- Refreshed all 25 `preview/*.html` cards, both `styleguide/` pages, and every `ui_kits/` component to the
  project's current revision.

### Added

- **TypeScript typings for every UI-kit component** — 17 `.d.ts` files across `ui_kits/_shared`,
  `ui_kits/wrld-ai`, and `ui_kits/wrld-tech`.
- `styles.css` — shared preview/styleguide stylesheet.
- `preview/svg-check.html` — SVG rendering verification card.
- `ui_kits/_shared/index.html` — shared-kit index page.
- `_adherence.oxlintrc.json` — lint rules encoding design-system adherence.
- `_ds_manifest.json` / `_ds_bundle.js` — design-bundle index and runtime, so the repo loads directly as a
  Claude Design bundle.

### Known gaps

- `templates/pitch-deck/` and `templates/quote/` (8 files), `doc-page.js`, and `thumbnail.html` exist in the
  design project but are **not** yet mirrored here.
- Single-file builds (`WRLD Design System (standalone).html`, `… PDF.html`, `WRLD.AI Dashboard (standalone).html`)
  exceed the sync API's 256 KiB per-file ceiling and must come from a ZIP export.
- `assets/logos/svg/` uses `-black`/`-white` suffixes in the design project but `-dark`/`-light` here, and this
  repo carries 24 sub-brand variants against the project's 8. The **assets** are left untouched pending a naming
  decision; only the *references* were repointed (see Fixed below). Anything re-synced from the project will
  arrive with `-black`/`-white` again until the naming is reconciled upstream.

### Fixed during review

- **Broken logo references.** The synced `styleguide/index.html` and `preview/svg-check.html` pointed at
  `assets/logos/svg/wrld-{mark,tech,lockup}-{black,white}.svg`, which do not exist in this repo — 10 broken
  images in total. Repointed to the checked-in `-dark`/`-light` files. Mapping verified against fill values,
  not guessed: repo `-dark` is `#0a0a0a` and `-light` is `#fafafa`, so the rename carries no change of meaning.
  (Pre-sync, the styleguide used the `assets/logos/*.png` rasters; upstream moved these to SVG.)
- **Broken favicon references.** `styleguide/index.html` pointed all four favicon links at
  `assets/logos/favicons/`, which holds only `favicon-32x32.png` and `favicon-180x180.png` — so
  `favicon-16x16.png`, `apple-touch-icon.png`, and `site.webmanifest` were all 404s. Repointed to
  `logos/favicons/`, which carries the complete generated set. Found by sweeping every local `src`/`href` in
  the synced HTML rather than only the files review flagged; all 83 local references now resolve.
- **False type contracts.** `AgentList.onSelect`, `Sidebar.onNavigate`, and `Header.onNavigate` were declared
  optional while their components invoke them unconditionally — a consumer trusting the typings got a runtime
  `TypeError` on first click. Made required. Types-only; no runtime behaviour changed. `Button.onClick` is
  correctly optional and was left alone: it is spread onto a DOM `<button>`, never called directly.
- **Wrong duration values in `_ds_manifest.json`.** All four `--wrld-duration-*` tokens were recorded as `1ms`.
  That is the `prefers-reduced-motion` override, not the base value — the generator appears to take the last
  declaration and drop the media-query scope. Restored to `120ms` / `200ms` / `320ms` / `600ms`. This is a
  **generated** file, so the fix will be undone by the next export until the generator is corrected upstream.

## [0.1.0] — 2026-04-18

### Added

- **Master brand brief** (`brand/CLAUDE.md`) — Claude-ready overview of entities, visual direction, voice, tone matrix, and messaging pillars.
- **Per-brand briefs** for WRLD Tech, WRLD Inc., wrld.host, wrld.design, wrld.one, WRLD.AI, and WRLD.Services.
- **Design tokens** in three formats:
  - `tokens/tokens.css` — CSS custom properties with light/dark/auto modes.
  - `tokens/tokens.json` — Design Tokens Community Group format.
  - `tokens/tokens.ts` — TypeScript exports with `as const` typing.
- **Logo pack** — 27 SVG variants (mark, wordmark, full lockup + 9 sub-brand lockups, each in dark / light / mono).
- **Raster exports** — PNG mark (64–1024px), PNG lockup (512w/1024w/2048w), sub-brand lockup (2048w), all dark/light/mono.
- **Favicons** — 16 → 512 PNG, `favicon.ico`, `apple-touch-icon.png`, android-chrome icons, `site.webmanifest`.
- **Interactive HTML styleguide** (`styleguide/index.html`) — dark/light toggle, signature WRLD wordmark hover with cycling accent glow, live token swatches, type scale, logo gallery, component samples.
- **Repository scaffolding** — README, LICENSE, `.gitignore`, `package.json`, CI-ready structure.
- **Governance docs** — `CONTRIBUTING.md` and this changelog.

### Visual direction

- Established **modern minimalist monochromatic** as the default — `#0a0a0a` anchor in light mode, `#fafafa` anchor in dark mode.
- **Montserrat** for display, **Ubuntu**/**Inter** for body, **JetBrains Mono** for code.
- **Interactive accents** preserved from the legacy palette (`#007fee`, `#00adee`, `#EE9300`) — applied *only* to hover, focus, motion, and gradient sweeps on brand elements.

### Sources consolidated

- 2026-03-29 Brand Discovery Report (SharePoint + Notion/Craft + Canva + Granola).
- 2026-03-29 Brand Voice Guidelines v1.0.
- WRLD Tech Co. custom project context and values documentation.
- WRLD logo image (authoritative mark reference).
