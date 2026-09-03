---
name: wrld-design
description: Use this skill to generate well-branded interfaces and assets for WRLD (the WRLD.Tech federation of brands — wrld.tech, WRLD.AI, WRLD.host, wrld.design, WRLD.Services, WRLD.Support, WRLD.Press, WRLD.One), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# WRLD design skill

Read `README.md` first — it's the source of truth for entity naming, tone, visual foundations, and iconography. Then explore the other available files:

- `colors_and_type.css` — drop-in stylesheet. Includes `@font-face` for Ubuntu, Ubuntu Mono, and Montserrat; primitive + semantic CSS variables; light/dark theming via `[data-theme]`.
- `tokens/tokens.css` and `tokens/tokens.json` — canonical full token suite mirroring the upstream `WRLDInc/DesignSystem` repo.
- `fonts/` — bundled TTFs. Reference these directly; do not pull from Google Fonts.
- `assets/logos/` — the authentic raster artwork: `wrld-mark-{master,black,white}.png` and the `wrld-tech-{black,white}.png` lockups. Other sub-brand lockups are a markup recipe (mark + Montserrat WRLD + uppercase sub-label), not separate files.
- `logos/favicons/` — tab icon set. White 18-ray starburst on `#0a0a0a`, resized straight from the master artwork. Never a circle or disc.
- `preview/` — small HTML cards demonstrating each token group, type scale, component, and brand asset. Useful for quickly seeing what's in the system.
- `ui_kits/wrld-tech/` — flagship marketing site UI kit (header, hero, services grid, values strip, CTA, footer).
- `ui_kits/wrld-ai/` — WRLD.AI product dashboard UI kit (sidebar, agent list, agent detail, run history, stat cards).
- `styleguide/index.html` — upstream interactive reference, viewable as-is.
- `registry/` — the 21st.dev registry: self-contained TypeScript ports of every kit component (`Wrld*`) with demos, the generated shadcn theme `registry/theme/wrld.css`, and `manifest.json`. Use these when the target project is React + shadcn; publish with `npm run registry:publish` (see `docs/21ST_PUBLISHING.md`).

## How to use this skill

If creating visual artifacts (slides, mocks, throwaway prototypes, demos): copy what you need from `assets/` and `fonts/` into your output directory and create static HTML files for the user to view. Link `colors_and_type.css` and you have the full type + color system.

If working on production code: copy assets, lift the token values from `tokens/tokens.css`, and read the rules in `README.md` to design like a WRLD designer would.

If the user invokes this skill without any other guidance, ask them what they want to build or design — including which sub-brand it's for (the tone and accent weighting differ per property; see README's Brand axis matrix). Ask a few questions, then act as an expert designer who outputs HTML artifacts or production code, depending on the need.

## Non-negotiables (do not skip)

- **Sub-brand naming is sensitive.** `wrld.tech` and `wrld.design` are lowercase. `WRLD.AI`, `WRLD.host`, `WRLD.Services`, `WRLD.Support`, `WRLD.Press`, `WRLD.One` follow the casing shown. Never write "Wrld" or "wrld.AI". See README's Entity map.
- **Accents are interactive, not decorative.** Surfaces stay monochrome. Color appears on hover, focus, status, and pressed states only. No gradient backgrounds.
- **No emoji as iconography.** Use Lucide (CDN: `unpkg.com/lucide@latest`) at 1.5px stroke, monochrome, `currentColor`. Unicode arrows (→, ↗) are fine inline.
- **Sentence case for everything** — UI labels, headings, buttons, slide titles. No Title Case, no ALL CAPS except for eyebrow microtype.
- **The starburst mark** is the brand's hero geometric element. Use it as logo, favicon, or ornamental texture — but always at intentional sizes, never decoratively scattered.
