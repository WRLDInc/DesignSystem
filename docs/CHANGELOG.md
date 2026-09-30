# Changelog

All notable changes to the WRLD Design System are documented here. This project follows semantic versioning.

## [0.6.0] — 2026-09-30

Native support for Cloudflare AI Search and Cloudflare Agents, and the **API / MCP / Agents** card the wrld.design
review asked for ([BugSmash r37kW](https://wrld.bugsmash.io/review/r37kW) #1 and #5).

### Added

- **The WRLD.AI search overlay on wrld.design.** A search button in the pill nav's tool cluster (the spot the review
  pointed at) opens the same dialog wrld.tech ships: Search and Ask WRLD.AI tabs over Cloudflare's pinned v0.0.40 web
  components, talking to the AI Search **namespace endpoint** `https://search.wrld.ai` (instances `wereallylovedesign`
  + `wrld-search`) straight from the browser — the Worker stays assets-only. ⌘K / Ctrl K, Esc, focus return, theme
  sync, reduced motion, the dark-mode label fix and the mobile history drawer are all ported from `AISearch.astro`.
  Script loads on first open. Needs `wrld.design` in the endpoint's authorized hosts (previews already are).
- **`docs/AI_SEARCH_AGENTS.md`** — the company-wide guideline: verified inventory of the WRLD Inc. account's
  instances and endpoints, namespace and instance rules (`default` for WRLD properties, `client-<slug>` per client),
  public vs private use (browser, same-origin proxy, Cloudflare Access on a custom domain, Workers bindings with
  `remote: true`), request/response shapes as observed, the overlay's anatomy / tokens / behaviour / copy for every
  state, Agents SDK patterns (McpAgent, `createMcpHandler`, `Agent` + `@callable`), MCP client registration, the web
  rules and the five-field `<meta wrld_*>` metadata schema every property ships, and an operations checklist.
- **`/system#agents`** — a new Agents section fed by three annotated preview cards: `preview/agents-search-overlay.html`
  (the dialog anatomy, numbered), `preview/agents-answer.html` (streamed answer, sources first, outage notice) and
  `preview/agents-discovery.html` (the agent surfaces per property). Registered in `_ds_manifest.json`; the landing's
  fourth system card links here.
- **Registry:** `WrldSearchTrigger` (`registry/ui`) and `WrldSearchDialog` (`registry/blocks`) — the React / shadcn port
  with debounced `/search`, streamed `/chat/completions` (SSE: `event: chunks` → deltas → `[DONE]`), instance chips,
  replaceable `search` / `ask` functions for proxies and demos. Both typecheck strict and are listed in
  `registry/manifest.json`, unpublished until the next `npm run registry:publish`.
- **`agents/wrld-search-agent/`** — a reference Cloudflare `McpAgent` (Durable Object + SQLite migration +
  `ai_search_namespaces` binding) exposing `search_wrld` and `list_wrld_properties`, to copy and rename. Not part of
  the site build.
- **`.mcp.json`** at the repo root registering `https://search.wrld.ai/mcp`, per the guideline's rule for every WRLD repo.
- Discovery: `llms.txt` gains a "Search, MCP and agents" section; `.well-known/api-catalog` gains an anchor for
  `https://search.wrld.ai/`; `openapi.json` publishes the guideline path and an `x-wrld-ai-search` description; README,
  `SKILL.md`, `CONSUMERS.md` and the deploy runbook (check 14) point at all of it.

### Changed

- `package.json` → 0.6.0. `deploy/system/app.js` aliases the new section for the local filter.

### Not done here, on purpose

- Adding `wrld.design` to the namespace endpoint's authorized hosts is an account change for @Ridgelawrence; the exact
  read-append-write call is in the guideline (§3.3). Until then the apex overlay shows its unavailable state and the
  branch previews work.
- No AI Search instance crawls wrld.design itself yet; the guideline proposes `wrld-design-system`.

## [0.5.1] — 2026-09-30

Fixes from the wrld.design review on BugSmash ([r37kW](https://wrld.bugsmash.io/review/r37kW)), reviewer Ridgeway Lawrence.

### Changed

- **Landing nav.** The pill nav no longer strands its tagline and CTA in the middle of the bar: `.right` and `.tools`
  now sit together at the trailing edge (the nav was `space-between` across three children, so the free space split
  evenly on both sides of the CTA). Two links added, desktop and mobile sheet: **Directory** → `https://wrld.one`,
  **About** → `https://wrld.tech`.
- **Footer contact line** is now `helpdesk@wrld.tech | 469.299.9598` (mailto/tel links) instead of the maintainer's
  address. Mirrored in `registry/blocks/wrld-cta.tsx` (+ demo), both styleguide footers and `brand/wrld-tech.md`.
- **Property links.** WRLD.Services → `https://wrld.tech/services`; WRLD.Support → `https://wrld.support`; the
  footer's WRLD.Press link is replaced by **WRLD.help** → `https://wrld.help`. The property cards on the landing and
  the registry's `WrldFooter` / `WrldServicesGrid` defaults follow the same destinations.
- `brand/wrld-one.md` records that wrld.design links to wrld.one as **Directory** (scope of the product itself is
  still unconfirmed).
- `package.json` → 0.5.1.

## [0.5.0] — 2026-09-30

### Added

- **Agent discovery on wrld.design.** The site now declares itself to AI agents and crawlers instead of leaving
  them to scrape HTML:
  - `deploy/robots.txt` carries a `Content-Signal: search=yes, ai-input=yes, ai-train=yes` directive with the
    contentsignals.org preamble. Every signal is deliberately *yes* — the system is published so that agents build
    WRLD surfaces correctly — which is the opposite of wrld.tech's marketing opt-out, and the file says why.
  - `deploy/llms.txt` — the llmstxt.org overview: what the system is, the non-negotiables, and links to every
    machine-readable surface.
  - `deploy/.well-known/api-catalog` — an RFC 9727 linkset served as `application/linkset+json`, pointing at the
    OpenAPI description, the human docs and the identity documents.
  - `deploy/openapi.json` — an OpenAPI 3.1 description of the static GET surface (tokens, theme, manifests, brand
    docs, discovery documents), so the catalog has a real `service-desc`.
  - `Link` response headers on `/` (`api-catalog`, `service-desc`, `service-doc`, `describedby`) via
    `deploy/_headers`, scoped to the root document only.
  - `deploy/.well-known/agent-skills/index.json`, **generated at build** by `scripts/build_site.mjs` with a SHA-256
    digest of the `SKILL.md` that ships, so the digest can never go stale. `SKILL.md` is now published at
    `/SKILL.md`.
- **Auth.md and OAuth protected resource metadata.** `deploy/auth.md` follows the Auth.md protocol's step
  structure (discover → pick a method → register → exchange → use → errors → revocation) as a self-contained flow,
  mapping `anonymous`, `service_auth` and `identity_assertion` onto the standard endpoints the authorization server
  (`https://auth.wrld.tech/`) actually publishes: RFC 7591 dynamic registration, RFC 8628 device authorization and
  the ID-JAG grant profile. Served as `text/markdown`. `deploy/.well-known/oauth-protected-resource` is the RFC 9728 document with `resource`,
  `authorization_servers`, `scopes_supported`, `bearer_methods_supported: ["header"]` and an `agent_auth` block.
- **Login design guidelines** — `docs/LOGIN_DESIGN.md`: which identity provider fronts which door (end-user
  portals, staff tools, automation), the anatomy of a WRLD sign-in page, the tokens it uses, every state and its
  copy, accessibility requirements, and a do / do-not list for agents implementing it. `auth.md` points authorised
  agents at it.
- `preview/components-login.html` — the reference card for the sign-in pattern (default, inline error and
  second-factor states), registered in `_ds_manifest.json` so `/system` and the landing page list it.

### Changed

- `package.json` → 0.5.0.
- `scripts/build_site.mjs` publishes `SKILL.md`, generates the agent-skills index, and fails the build if any
  discovery document is missing, if `robots.txt` loses its `Content-Signal` line, or if a JSON discovery document
  does not parse.
- `deploy/_headers` adds the `/` Link rule, `Content-Type` for the two extensionless well-known files, and a
  `text/markdown` override for `/auth.md` (unset-then-set, because `/*.md` also matches it).
- `docs/CLOUDFLARE_DEPLOY.md` gains an agent-discovery verification block; `README.md` documents the agent-readable
  surfaces.

## [0.4.0] — 2026-09-03

### Added

- **A 21st.dev registry for the design system** (`registry/`). Every UI-kit component now has a self-contained
  TypeScript port with a demo, ready for `21st publish`: eight atoms in `registry/ui` (`WrldButton`, `WrldEyebrow`,
  `WrldLockup`, `WrldHelpButton`, `WrldStatCard`, `WrldTopBar`, `WrldRunHistory`, `WrldAgentList`) and eight sections
  in `registry/blocks` (`WrldHero`, `WrldCta`, `WrldValuesStrip`, `WrldServicesGrid`, `WrldFooter`, `WrldSidebar`,
  `WrldAgentDetail`, `WrldHeader`). Ports carry a provenance header naming the source kit file, resolve tokens as
  `--wrld-*` → host shadcn theme (`--color-*`) → WRLD literal, carry the authentic mark inline (128px renders in
  `registry/assets/`, `markSrc` for the full-resolution file) because 21st's renderer blocks cross-origin requests,
  use `lucide-react` where the kits used the Lucide CDN, and render interactive rows as real buttons for keyboard
  access. Demos declare a `settings` object so 21st shows live controls and load nothing external.
- **A generated shadcn / Tailwind v4 theme** — `registry/theme/wrld.css`, produced by `scripts/build_21st_theme.mjs`
  from `tokens/tokens.css`: the full shadcn token set (`--background` … `--sidebar-ring`, `--radius`, `--font-*`)
  mapped from the WRLD semantics for light and `.dark`, plus the `--wrld-*` tokens resolved to literals. Exposed as
  `@wrldinc/design-system/theme.css` and at `https://wrld.design/registry/theme/wrld.css`. CI fails if it drifts.
- **A manifest-driven publisher** — `registry/manifest.json` names every component, slug, description, tags and
  registry kind, plus the target library (`wrld-tech`) and visibility (`private`); `scripts/publish_21st.mjs` drives
  the pinned `@21st-dev/cli` from it (`npm run registry:render | registry:publish | registry:publish:theme`), writes
  the stable `component:<id>` refs back after a publish, refuses to publish the theme without `--yes-public` because
  21st themes are public, stages a verified local render as the cover so 21st does not regenerate one blind, polls the
  draft allowance with `--wait` instead of letting the CLI sleep an hour per retry, and mirrors the CLI exit codes.
- **CI** — a `registry` job in `validate.yml` (theme freshness + strict typecheck of every port and demo) and a
  manual `publish-21st.yml` workflow that publishes headlessly with the `API_KEY_21ST` repository secret and pushes
  the recorded refs to a branch.
- `docs/21ST_PUBLISHING.md` — the runbook: credentials, layout rules, commands, exit codes, install instructions.

### Changed

- `package.json` → 0.4.0. `files` ships `registry/`; `exports` adds `./theme.css`; `check` now runs the registry
  gates; React, TypeScript, `lucide-react` and the 21st CLI are pinned devDependencies with optional peer ranges.
- `scripts/build_site.mjs` publishes `registry/` (minus `tsconfig.json` and local renders) so the theme is linkable;
  `deploy/_headers` caches `/registry/*` like the tokens and labels `.tsx` as `text/plain`; the landing page lists
  the theme and the registry.

## [0.3.0] — 2026-08-23

### Removed

- **The parametric SVG logo set is retired, everywhere.** `logos/svg/` (27 files), its `assets/logos/svg/` mirror, the `logos/png/` exports rendered from them, `favicon.svg` in both favicon trees, the `preview/svg-check.html` comparison page, and the `scripts/generate_svgs.py` generator are all deleted. The generated geometry drew 18 identical rays whose tips all landed on one circle — it read as a disc and never matched the authentic asymmetric mark. Resolves the tension tracked in [issue #11](https://github.com/WRLDInc/DesignSystem/issues/11).
- `assets/logos/wrld-mark-light-bg-fallback.png` and its styleguide card — white-on-transparent artwork that rendered invisible on the light card and duplicated the white master's role.

### Changed

- **Every logo surface now uses the authentic artwork.** Styleguide logo cards show `wrld-mark-black/white.png`, the raster favicon set, and the original `wrld-tech-black/white.png` lockups. All favicon `<link>`s across the styleguide, preview, and UI kits drop the SVG entry and lead with the authentic PNG rasters; `site.webmanifest` (both trees) lists PNG icons only. The landing page's `og:image` moves off the deleted `logos/png/` export to `favicon-512x512.png`.
- `scripts/render_logo_pngs.py` is now a pure-Pillow pipeline from `wrld-mark-master`'s white sibling — no cairosvg, no generator import — and actively deletes `favicon.svg` if it reappears. The CI `logos` job gates on the pipeline running and the retired set staying dead, instead of diffing generated SVGs.
- README, SKILL, brand briefs, and contributor docs describe the raster-only source of truth; review scope moves from `/logos/svg/*` to `/assets/logos/*`.

## [0.2.2] — 2026-08-23

### Fixed

- **Auto theme renders dark correctly in `colors_and_type.css`.** The semantic-surface tokens (`--fg`, `--bg`, and friends) only flipped under an explicit `data-theme="dark"`, so with `data-theme="auto"` on a dark OS every heading kept its light-mode near-black and vanished against the dark background. Added the missing `@media (prefers-color-scheme: dark) { :root[data-theme="auto"] }` block, mirroring the one `tokens/tokens.css` already had.
- **Landing-page header shows the authentic mark, at a readable size.** `deploy/index.html` linked the parametric `assets/logos/svg/wrld-design-*.svg` lockups — the disc-reading generated geometry, at 22px. The header now composes the authentic raster mark (`assets/logos/wrld-mark-black.png` / `-white.png`, theme-swapped) at 36px with a live-text WRLD / Design wordmark. The generated SVG set itself is still tracked in [issue #11](https://github.com/WRLDInc/DesignSystem/issues/11).
- **Styleguide header mark now inverts on auto + dark OS.** The `invert(1)` filter on the header mark only matched `data-theme="dark"`; the same rule now also applies under `data-theme="auto"` with a dark color scheme (both `styleguide/index.html` and the bundle-prep copy).

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
