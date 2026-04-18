# Changelog

All notable changes to the WRLD Design System are documented here. This project follows semantic versioning.

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
