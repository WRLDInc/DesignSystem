# WRLD Design System

> The single source of truth for WRLD brand design — human-readable, Claude-readable, and machine-consumable.

**Owner:** WRLD Inc. (DBA WRLD Tech Co.) · EIN 84-5122446 · DUNS 03-999-5454
**Maintainer:** Ridgeway Lawrence — Lead Dev & Design | Founder
**Version:** 0.1.0 · Initialized 2026-04-18
**Canonical URL:** https://github.com/WRLDInc/DesignSystem

---

## What this is

This repo is the prep package for **Claude-assisted design work** across every WRLD property. It contains:

1. **Brand briefs** (`/brand`) — Markdown files Claude loads at the start of any design task. One master brief plus per-brand briefs for WRLD Tech, WRLD Inc., wrld.host, wrld.design, wrld.one, WRLD.AI, and WRLD.Services.
2. **Design tokens** (`/tokens`) — Colors, typography, spacing, radius, shadows, and motion as CSS custom properties, JSON, and TypeScript — drop-in ready for any project.
3. **Logo pack** (`/logos`) — SVG, PNG, and favicon variants of the WRLD starburst + wordmark, in dark, light, monochrome, and per-sub-brand lockups.
4. **Reference style guide** (`/styleguide`) — A single-file HTML page that demonstrates the full system applied, with a live dark/light toggle and interactive accent-color hover states on the WRLD wordmark.

## Visual direction at a glance

- **Modern minimalist.** Dark/light mode monochromatic as the default. The logo correlates — dark logo on light, light logo on dark.
- **Typography.** Montserrat for display/headers. Ubuntu (primary) or Inter (fallback) for body.
- **Accents are interactive, not decorative.** The legacy palette — `#007fee`, `#00adee`, `#EE9300` — appears only in hover shadows, focus glows, border accents, and motion moments on brand elements (the WRLD wordmark, logo, primary CTAs). Static pages stay monochromatic.

See [`/brand/CLAUDE.md`](./brand/CLAUDE.md) for the authoritative brief.

## Quick start

```bash
# Clone
git clone git@github.com:WRLDInc/DesignSystem.git
cd DesignSystem

# Drop tokens into a new project
cp tokens/tokens.css your-project/src/styles/wrld-tokens.css

# Or install as a package (once published)
pnpm add @wrldinc/design-system
```

## Using with Claude

At the start of any design task, load the brand brief:

> "Load `github.com/WRLDInc/DesignSystem/brand/CLAUDE.md` as context before you begin."

For sub-brand work, also load the specific brand brief (e.g. `brand/wrld-host.md`).

## Repository map

```
DesignSystem/
├── brand/              # Brand briefs (Markdown — Claude-ready)
│   ├── CLAUDE.md       # MASTER brief — load this first
│   ├── wrld-tech.md
│   ├── wrld-inc.md
│   ├── wrld-host.md
│   ├── wrld-design.md
│   ├── wrld-one.md
│   ├── wrld-ai.md
│   └── wrld-services.md
├── tokens/             # Design tokens
│   ├── tokens.css      # CSS custom properties (dark + light)
│   ├── tokens.json     # Platform-agnostic JSON
│   └── tokens.ts       # Typed token exports
├── logos/              # Logo pack
│   ├── svg/            # All SVG variants (edit these)
│   ├── png/            # Raster exports
│   └── favicons/       # .ico, apple-touch, 16/32/180/192/512 PNG
├── styleguide/
│   └── index.html      # Interactive reference — open in a browser
├── scripts/            # Build helpers (logo PNG export, etc.)
├── docs/               # Governance, contributing, changelog
└── .github/workflows/  # CI (lint, token validation)
```

## Governance

This is a **living system**. Changes to any token, logo, or brief must land through a PR reviewed by Ridgeway. See [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md).

## License

© WRLD Inc. All rights reserved. Internal use only unless otherwise licensed in writing.
