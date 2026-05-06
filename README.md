# WRLD.Tech Design System

> **Modern minimalist. Dark/light monochromatic. Accents are interactive, never decorative.**
> The single source of truth for any WRLD-branded interface, deck, mock, or asset.

**Owner:** WRLD Inc. (DBA WRLD Tech Co.) · EIN 84-5122446 · DUNS 03-999-5454
**Maintainer:** Ridgeway Lawrence — Lead Dev & Design | Founder
**Source of truth:** [github.com/WRLDInc/DesignSystem](https://github.com/WRLDInc/DesignSystem)

---

## What this is

A Claude-readable design system that bundles brand briefs, design tokens, fonts, logos, sample slides, and per-product UI kits. Use it to make any new artifact (mock, slide, prototype, production component) look unmistakably WRLD without having to reverse-engineer the brand.

## Sources used to build this

| Source | What we pulled |
|---|---|
| `github.com/WRLDInc/DesignSystem` (main) | `tokens/tokens.css`, `tokens/tokens.json`, `styleguide/index.html`, all SVG logo lockups (mark + wordmark + per-sub-brand), favicons, the master brand brief `brand/CLAUDE.md`, and per-sub-brand briefs (wrld-tech, wrld-host, wrld-design, wrld-ai, wrld-services). |
| Uploaded fonts | Montserrat (variable), Ubuntu Light/Regular/Medium/Bold, Ubuntu Mono Regular/Bold. |
| Uploaded logos | `cr-wrld-tech-black.png`, `cr-wrld-tech-white.png`, `wrld-logo-dark-bg.png`, `WRLD_logo_dark-color-Master.png` — preserved as PNG fallbacks alongside the SVG set. |
| `wrld.host/brand` (referenced) | Not crawled — content reflected via the brand briefs above. Refresh on next pass if Ridgeway publishes a public web version. |

---

## Entity map

WRLD is a federation of brands under one parent. Names matter.

| Name | Kind | Use when |
|---|---|---|
| **WRLD Inc.** | Legal entity | Contracts, MSAs, SOWs, compliance |
| **WRLD Tech Co.** | DBA / operating brand | Proposals, invoices, business comms |
| **wrld.tech** | Flagship property | Primary website, cross-service marketing |
| **wrld.host** | Hosting platform | cPanel/WHM hosting, domains, SSL, VoIP, dedicated servers |
| **wrld.design** | Design services | Web design + dev proposals, brand decks |
| **wrld.one** | Unified platform (emerging) | Reserved — confirm scope before externalizing |
| **WRLD.AI** | AI assistant product | Business AI, Copilot agents, automations |
| **WRLD.Services** | MSP / managed IT | IT management, network security, cloud, backup |
| **WRLD.Support** | 24/7 support | Technical support, troubleshooting, SLA |
| **WRLD.Press** | WordPress premium | WP plugins, premium hosting for WP clients |

**Naming rules.** Brand cap is always `WRLD` (uppercase) in running prose. Domain-style lowercase (`wrld.tech`) when literally referencing the URL. Service brands use `WRLD.AI`, `WRLD.Services`, etc. (capital WRLD, dot-prefixed descriptor). Never "Wrld" or "wrld".

## Mission, vision, values

- **Mission.** Provide clients the most proficient technology-focused solutions to expedite and streamline their growth.
- **Vision.** Be the leading technology partner for businesses leveraging modern tools to unlock productivity, efficiency, growth.
- **Values.** Move with urgency · Innovation at the edge · Foundational integrity · Excellence measured by action · Collaboration and humility.

## Taglines

- Primary: **"Your Strategic Partner in Technology and Business Growth."**
- Descriptor: *WRLD · Tech · Design · Support — SMB Business Technology, Automation and AI Solutions.*
- Short: *Tech that moves with you.*

---

## Content fundamentals

### Voice (constant)
**Confident, direct, and warm.** A knowledgeable friend who happens to be a technologist. Authoritative but never condescending. Always explains the *why* alongside the *how*.

| We are | We are not |
|---|---|
| Confident, knowledgeable | Arrogant or condescending |
| Approachable, human | Slangy or overly casual |
| Direct, clear | Blunt or cold |
| Proactive, forward-looking | Passive, wait-and-see |
| Honest about trade-offs | Overselling, "10x", "revolutionary" |
| Technical when needed | Jargon-heavy by default |
| Urgency-driven | Panicky, alarmist |
| Partner-minded | Vendor-like, transactional |

### Tone dial (by product)

| Product | Warmth | Formality | Technicality | Urgency |
|---|---|---|---|---|
| wrld.tech (flagship) | High | Medium | Low | Low |
| wrld.host | Medium | Low–Med | Med–High | Medium |
| wrld.design | High | Medium | Low–Med | Low |
| WRLD.AI | High | Medium | Low–Med | Medium |
| WRLD.Services / Support | Medium | Medium | Med–High | Med–High |

### Casing & typography in copy
- Sentence case for headings and buttons. **Not** Title Case Like This. Not ALL CAPS as a default — caps are reserved for the wordmark, eyebrow labels, and `h6`-level micro-headings.
- Use the brand's tall, ultra-tracked uppercase treatment (`letter-spacing: 0.28em`) for the WRLD wordmark when rendering it as type, never for body.
- Numbers: spell out one through nine, numerals 10+, always numerals for specs (`24/7`, `99.99%`, `512GB`).

### Pronouns & directness
- Use **"we"** for WRLD, **"you"** for the client. We never say "the client" or "the user" in client-facing copy.
- Active voice always. *"We detected an issue."* — never *"An issue was detected."*
- Contractions are fine: *we're*, *you'll*, *don't*.
- No hedging. *"We believe we can"* → *"We will."* (Unless honestly uncertain — say so plainly.)
- Short paragraphs (2–3 sentences) in client-facing comms.

### Emoji & ornamentation
**No emoji** in product UI, marketing pages, decks, or proposals. WRLD never uses emoji as iconography. The internal brand brief permits ✅ / ⚠️ / ❌ in *internal docs only* (e.g., the AI-claims policy table) — never in client-facing surfaces.

### Vibe
**Quietly premium.** Confident-without-shouting. Reads more like a high-end consultancy than a bargain MSP — but technical enough that a developer respects it.

### Examples — on-brand vs off-brand
| ✅ On-brand | ❌ Off-brand |
|---|---|
| "Your strategic partner in technology and business growth." | "We're the BEST IT company in Dallas! 🚀" |
| "Hosting chosen deliberately. Fast by default. No noisy neighbors." | "Unlimited hosting with FREE everything, sign up now!" |
| "Agents tuned by humans who know your operations." | "Revolutionary AI that 10x's your team overnight." |
| "Start a conversation." | "Buy now / Click here / Limited time!" |
| "We detected an SSL renewal issue and rotated the cert." | "An SSL issue may have been detected by our system." |

### Avoid (anti-patterns)
- *"IT guy"*, *"tech support"*, *"call us when it breaks"*. We are explicitly not break-fix.
- Enterprise-coded language: *"Fortune 500"*, *"hyperscale"*, unless literally accurate.
- Sci-fi AI tropes: *"revolutionary"*, *"game-changing"*, *"sentient"*, glowing-brain imagery.
- Comparing competitors by name. Lead with WRLD's philosophy.
- "Unlimited" anything without an asterisk.

---

## Visual foundations

### Aesthetic
**Modern minimalist, monochromatic, dark/light dual-mode.** Static surfaces stay grayscale, with `#0a0a0a` as the near-black anchor in light mode and `#fafafa` as the near-white anchor in dark mode. Negative space is generous. Geometry is precise. The system reads as confident, technical, quietly premium — never busy, never "tech-bro neon".

### Color
- Static surfaces are 100% monochromatic. No gradient hero backgrounds. No accent fills behind cards.
- The three legacy accents — `#007fee` (primary blue), `#00adee` (sky), `#EE9300` (warm) — are **interactive only**. They appear on hover glows, focus rings, motion sweeps, and brand-touching elements (the wordmark, the logo, primary CTAs).
- Per-product accent weighting: wrld.tech → `#007fee`. wrld.host → `#00adee` (cooler, more technical). WRLD.AI → `#00adee` (signal/intelligence). Commerce moments anywhere → `#EE9300`.
- Status colors (`success #10b981`, `warning #f59e0b`, `danger #ef4444`, `info #3b82f6`) are system semantic, not brand. Use them on alerts/health, not on marketing surfaces.

### Type
- **Display / headings:** Montserrat, weight 500–700, `letter-spacing: -0.02em`, line-height ~1.05–1.2.
- **Body:** Ubuntu, weight 300–500, body line-height 1.6.
- **Mono:** Ubuntu Mono (substituted for the brief's "JetBrains Mono" since Ubuntu Mono ships with the system and reads identically in tone).
- **Eyebrow labels & tall wordmark:** uppercase Montserrat with `letter-spacing: 0.12em` (eyebrow) or `0.28em` (wordmark-as-type).

### Spacing
4px base. Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120`. Sections breathe — minimum vertical rhythm of 64px between major hero blocks.

### Backgrounds
- Solid mono surfaces are the default. `--bg`, `--bg-subtle`, `--bg-muted` cover 99% of cases.
- **No** stock photography. **No** AI-generated imagery in the showcase.
- Repeating textures and full-bleed gradients are off-brand. Geometry, rules, dot-grids, and the starburst mark are the canonical visual ornaments.
- Subtle dot-grid or hairline ruled overlays (`rgb(0 0 0 / 0.04)` light · `rgb(255 255 255 / 0.06)` dark) are acceptable for technical surfaces (dashboards, infrastructure pages).

### Animation
- Durations: 120ms (micro), 200ms (default), 320ms (emphasis), 600ms (reveal).
- Easings: `cubic-bezier(0.2, 0.8, 0.2, 1)` standard · `cubic-bezier(0.4, 0, 0.2, 1)` enter · `cubic-bezier(0.4, 0, 1, 1)` exit · `cubic-bezier(0.83, 0, 0.17, 1)` precise.
- **Tight, precise** — never bouncy, springy, or playful. WRLD does not use overshoot.
- Honor `prefers-reduced-motion: reduce` — collapse all durations to 1ms.

### Hover states
- Default: text shifts to `--accent-primary`, with a subtle `0 10px 40px -8px` accent-tinted shadow lift on cards and buttons.
- WRLD wordmark hover cycles a glow through `#007fee → #00adee → #EE9300`.
- Buttons: background fills with `--fg`, text inverts. Borders strengthen one step.
- Links: underline thickness stays 1px; color shifts to `--accent-primary`.

### Press states
- 1–2px translateY down, no shadow. No color change beyond removing hover-state lift. We never use the "shrink-on-press" pattern (off-brand, too playful).

### Focus rings
- 3px outset ring at `rgb(var(--accent-primary-rgb) / 0.28)` light, `0.40` dark. Never blurred. Always visible — accessibility-first.

### Borders
- Hairline (1px) is the workhorse. Standard (2px) for emphasis. Emphasis (3px) only on selected/active states.
- Border color: `--border` (mono-200 light / mono-800 dark). On hover: `--border-strong`.

### Shadows
- **Static (neutral):** `xs / sm / md / lg` with neutral black-alpha. Light-mode alphas 0.04–0.10; dark mode 0.30–0.55.
- **Interactive (tinted):** `--shadow-accent-primary / -secondary / -warm` — only appear on hover/focus, never static.
- No inner shadows on cards. No glow-around-everything.

### Radii
- `0` (sharp), `4` (inputs), `8` (cards), `12` (modals), `9999` (pills). **Sharp or 4px is preferred.** Avoid 16+ radii — too soft for the brand.

### Cards
- Border: 1px hairline `--border`. Background: `--bg-elevated`. Radius 8px. Padding 24px+.
- Resting shadow: none or `--shadow-xs`. On hover: `--shadow-md` plus the accent-tinted shadow if interactive.
- Never: rounded corners with a colored left-border accent (off-brand cliché).

### Layout rules
- One hero element per view. No visual competition.
- Max content width 1280px. Hero copy max-width ~640px.
- Grids you can feel — 12-col on desktop, 4-col on mobile, 24px gutter default.
- Sticky chrome: minimal. Top nav at 64px height max.

### Transparency & blur
- Avoid glassmorphism as primary chrome. A subtle `backdrop-filter: blur(12px)` on a sticky nav at 80% bg-alpha is acceptable. Floating buttons / cards do not use glass.

### Imagery vibe
- When photography is unavoidable: cool, technical, b&w or low-saturation. No warm sunset gradients. No people-pointing-at-screens stock.
- **Geometry beats illustration.** Diagrams, dot-grids, the starburst mark, network topology — these are the brand's visual vocabulary.

---

## Iconography

### Approach
WRLD does **not** ship a custom icon font. Iconography is sparse — the brand favors typography and whitespace over icon-rich UI. When icons are used, they need to feel like the rest of the system: precise, monochrome, geometry-driven.

### What we use
1. **The starburst mark** is the hero. SVG variants in `assets/logos/svg/`. It does double duty as logo, favicon, and ornamental geometric element.
2. **Per-sub-brand wordmark lockups** — each property has dark/light SVG variants in `assets/logos/svg/wrld-<brand>-{dark,light}.svg`. Use these wherever a sub-brand is referenced.
3. **Lucide** as the working icon set (CDN: `https://unpkg.com/lucide@latest`). Stroke-based, geometric, monochrome — matches brand DNA. Substituted because the design-system repo doesn't (yet) ship a curated icon set. **Flagged for the maintainer** — see "Open questions" below.
4. **Emoji are not used.** Never as iconography in product, marketing, slides, or proposals.
5. **Unicode arrows / glyphs** (→, ↗, ✕, ⌘) are acceptable inline within UI labels and are preferred over importing a stroke icon for one-off use.

### Iconography rules
- Stroke weight 1.5px at 24px size (Lucide default). Round line caps + joins.
- Color: `currentColor` always. Never tinted.
- Size scale: 16, 20, 24, 32. 24 is default.
- No filled variants for primary UI. Filled only for status badges (success/warning/danger).

### Files
- `assets/logos/svg/wrld-mark-{dark,light,mono}.svg` — starburst alone.
- `assets/logos/svg/wrld-lockup-{dark,light,mono}.svg` — starburst + WRLD wordmark.
- `assets/logos/svg/wrld-wordmark-{dark,light,mono}.svg` — wordmark only.
- `assets/logos/svg/wrld-{tech,host,design,ai,services,support,press,one}-{dark,light}.svg` — full per-sub-brand lockups.
- `assets/logos/favicons/` — favicon-32x32, favicon-180x180.
- `assets/logos/wrld-tech-{black,white}.png` and `wrld-mark-master.png` — uploaded PNG references, preserved as fallbacks.

---

## Index — what's where

```
WRLD.Tech Design System/
├── README.md                         ← you are here
├── SKILL.md                          ← Claude Code skill manifest
├── colors_and_type.css               ← drop-in tokens + semantic styles + @font-face
├── fonts/                            ← Montserrat + Ubuntu (Light/Regular/Medium/Bold) + Ubuntu Mono
├── tokens/
│   ├── tokens.css                    ← canonical full token suite (mirrors upstream repo)
│   └── tokens.json                   ← platform-agnostic JSON copy
├── styleguide/
│   └── index.html                    ← upstream interactive reference, viewable as-is
├── assets/logos/
│   ├── svg/                          ← all sub-brand lockups + starburst + wordmark, dark/light/mono
│   ├── favicons/                     ← favicon-32, favicon-180
│   └── *.png                         ← uploaded PNG references
├── preview/                          ← Design System tab cards (one HTML file each)
└── ui_kits/
    ├── wrld-tech/                    ← flagship marketing site UI kit
    └── wrld-ai/                      ← AI product / dashboard UI kit
```

## Caveats & open questions

- **Mono font substitution.** The brief specifies *JetBrains Mono*; the user supplied *Ubuntu Mono*. We use Ubuntu Mono throughout (loaded from `/fonts`) since it shipped with the project and reads cleanly alongside Ubuntu body. JetBrains Mono remains as the second fallback in `--font-mono`. **Flag for Ridgeway:** confirm this substitution or supply JetBrains Mono TTFs.
- **Source Sans Pro.** Mentioned in the original ask but not present in the upstream design-system repo or among the uploaded fonts. We did **not** add it. Confirm whether to source it from Google Fonts or drop the reference.
- **Inter (body alt).** Brief lists Inter as a body fallback. Not bundled — uses system fallback chain.
- **Icon set.** Lucide is substituted via CDN until WRLDInc/WRLD_Iconibrary publishes a curated set. Pull that repo in on a future revision.
- **wrld.host/brand crawl.** Not fetched in this pass. Re-fetch and reconcile when the public brand site is canonical.
