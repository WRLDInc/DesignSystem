# Contributing to the WRLD Design System

This repo is the canonical source of truth for WRLD brand design. Changes that land here propagate out to every WRLD property, proposal, asset, and Claude-assisted deliverable — so the bar is intentionally high.

## Who can contribute

- **Maintainer.** Ridgeway Lawrence — approves all PRs that touch `/brand/*.md`, `/tokens/*`, or `/assets/logos/*`.
- **Team members and contractors.** Open PRs freely. Tag Ridgeway for review.
- **Claude.** Claude may propose changes by writing files and opening PRs via the workflow below. Claude must never modify brand identity content unilaterally.

## What requires review

| Change | Requires review |
|---|---|
| Editing `/brand/CLAUDE.md` or any sub-brand brief | Yes — Ridgeway |
| Adding / removing tokens in `/tokens/*` | Yes — Ridgeway |
| Editing logo artwork in `/assets/logos/*` | Yes — Ridgeway |
| Regenerating favicons from the master artwork (`npm run build:favicons`) | No — but commit the outputs |
| Adding new sub-brand briefs | Yes — Ridgeway |
| Fixing typos, broken links, doc clarity | No, just open a PR |
| Adding new sections to the HTML styleguide | No — but keep consistent with existing patterns |

## Workflow

1. **Branch** from `main`: `feat/topic`, `fix/topic`, or `docs/topic`.
2. **Make the smallest change** that achieves the goal.
3. **Regenerate favicons** if you touched the master artwork:
   - `python3 scripts/render_logo_pngs.py` (or `npm run build:favicons`)
4. **Run checks**: `npm run check`.
5. **Open a PR** with a description that answers: *what changed, why, and what else is affected*.
6. **Include screenshots** for any visual change.
7. **Conventional commit prefix**: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.

## Token naming rules

- Every CSS variable is prefixed `--wrld-`.
- Scale tokens mirror: `--wrld-mono-{step}`, `--wrld-space-{step}`, `--wrld-fs-{step}`.
- Semantic tokens are role-first: `--wrld-bg`, `--wrld-fg`, `--wrld-border`, `--wrld-logo`.
- Accent tokens are always marked as interactive-only in the CSS comments and the docs.

## Logo source-of-truth rule

The canonical logos are the **authentic rasters in `/assets/logos`** — `wrld-mark-master.png` with its black/white siblings, and the WRLD.TECH lockups. The old parametric SVG generator drew geometry that never matched the real mark and is retired; never reintroduce generated logo geometry.

Favicon exports are committed so downstream consumers don't need the toolchain, but they must be regenerated (`npm run build:favicons`) after any change to the master artwork.

## Brand brief edits

When editing `/brand/CLAUDE.md` or any sub-brand file:

1. Update the `Version` and add a `Changelog` row.
2. Keep sections stable (Claude loads them by structure). If you need a new section, append rather than restructure.
3. Include a **Why** line in the PR body explaining the brand decision — future maintainers will need it.

## Questions

Direct: `ridge@wrld.tech` · or open an issue on the repo.
