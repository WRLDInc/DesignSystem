# WRLD · CLAUDE.md — Master Brand Brief

> **Read me first.** This is the authoritative brief for any Claude-assisted design or content work for WRLD. Load this file at the start of a session before you produce anything. For sub-brand work, also load the relevant `brand/wrld-<brand>.md`.

**Version:** 0.1.0 · 2026-04-18
**Owner:** Ridgeway Lawrence — Lead Dev & Design | Founder
**Canonical:** github.com/WRLDInc/DesignSystem/brand/CLAUDE.md

---

## 1. Entity map

| Name | Kind | Use when |
|---|---|---|
| **WRLD Inc.** | Legal entity | Contracts, MSAs, SOWs, compliance docs, formal legal contexts |
| **WRLD Tech Co.** | DBA / operating brand | Proposals, invoices, client-facing business comms, website hero |
| **wrld.tech** | Flagship property | Primary website, consultancy, cross-service marketing |
| **wrld.host** | Hosting platform | cPanel/WHM hosting, domains, SSL, VoIP, dedicated servers |
| **wrld.design** | Design services | Web design and dev proposals, brand work, creative decks |
| **wrld.one** | Unified platform (emerging) | Reserved — confirm scope before producing externally |
| **WRLD.AI** | AI assistant product | Business AI, Copilot agents, automation, Power Platform work |
| **WRLD.Services** | MSP / managed IT | IT management, network security, cloud, data backup |
| **WRLD.Support** | 24/7 support | Technical support, troubleshooting, SLA-backed response |
| **WRLD.Press** | WordPress premium | WP plugins, premium hosting for WP clients |
| **WRLD.Systems MSP** | Ops-facing | Internal MSP operations, IT ops contacts |

**Identifiers:** EIN 84-5122446 · DUNS 03-999-5454 · HQ 4707 Algiers St. Ste 101, Dallas TX 75207

**Naming rules:**
- Brand capitalization is always **WRLD** (uppercase) in running text. Never "Wrld" or "wrld".
- Domain-style lowercase (`wrld.tech`, `wrld.host`) when literally referring to the URL or property.
- `WRLD.AI`, `WRLD.Services`, `WRLD.Support`, `WRLD.Press` — capital WRLD with a dot-prefixed descriptor for service brands.

---

## 2. Mission, vision, values

**Mission.** Provide clients with the most proficient technology-focused solutions to expedite and streamline their growth.

**Vision.** Be the leading technology partner for businesses looking to leverage modern tools and services to unlock new levels of productivity, efficiency, and growth.

**Values (five, equally weighted):**

1. **Move with urgency and focus.** Responsiveness is a feature, not a favor.
2. **Innovation at the edge.** Adopt new tools early — but ship, don't experiment, in production.
3. **Foundational integrity.** Transparency and ethical practice are non-negotiable.
4. **Excellence measured by action.** Quality is proved by outcomes, not promises.
5. **Collaboration and humility.** Over-communicate, share context, stay approachable.

These values shape *every* design and copy decision. When in doubt, ask: "Does this feel urgent, innovative, honest, excellent, and collaborative?"

---

## 3. Visual direction

### 3.1 Core aesthetic

**Modern minimalist. Dark/light mode monochromatic.** Static surfaces stay grayscale, with near-black `#0a0a0a` as the anchoring value in light mode and `#fafafa` as the anchoring value in dark mode. Negative space is generous. Geometry is precise. The system should read as confident, technical, and quietly premium — never busy, never "tech-bro neon".

The logo matches the surface it sits on: the **dark** logo on light backgrounds; the **light** logo on dark backgrounds. Pair the starburst mark with the wordmark unless you use the mark alone as a favicon or small-scale icon. The favicon is that same 18-ray starburst on `#0a0a0a`, rasterized straight from the master artwork (`logos/favicons/`). Never a circle, disc, gear, or any other radial substitute.

### 3.2 Accent usage (interactive-only)

Three legacy colors survive as **interactive accents**, applied subtly and only on brand-touching elements — the WRLD wordmark, logo, primary CTAs, and selected focus states. They do **not** appear as static fills on pages.

| Token | Hex | Role |
|---|---|---|
| `--accent-primary` | `#007fee` | Default hover glow, primary focus ring |
| `--accent-secondary` | `#00adee` | Secondary hover mid-tone, gradient companion |
| `--accent-warm` | `#EE9300` | Commerce / sales CTA hover, celebratory moments |

**Application patterns:**

- Hovering the WRLD wordmark cycles a subtle glow through `#007fee → #00adee → #EE9300` (see `styleguide/index.html` for the canonical interaction).
- Focus rings on primary CTAs use `#007fee` at 28% opacity with a 3px outset.
- Button hover elevates a 0 10px 40px `#007fee` at 14% opacity shadow.
- Motion accents (page transitions, reveal underlines) may use the three colors as a gradient sweep.
- Commerce-related CTAs (cart, purchase, upgrade, renew) use `#EE9300` on hover instead of `#007fee`.

**Never:**
- Fill a static card, hero background, or large area with accent color.
- Combine all three accents in a single static gradient. Reserve that for *motion*.
- Use any accent on body copy. Text color stays in the monochrome scale.

### 3.3 Typography

| Role | Family | Fallback stack |
|---|---|---|
| Display / headings | **Montserrat** | `'Montserrat', 'Helvetica Neue', Arial, sans-serif` |
| Body (primary) | **Ubuntu** | `'Ubuntu', system-ui, -apple-system, sans-serif` |
| Body (alt) | **Ubuntu** | `'Ubuntu', system-ui, -apple-system, sans-serif` |
| Mono | **Ubuntu Mono** | `'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace` |

The type system is deliberately **two families only** — Montserrat for display, Ubuntu (and Ubuntu Mono) for
everything else. Inter, JetBrains Mono, and Fira Code were dropped: every font the system needs is vendored
under `fonts/`, so third-party fallbacks added supply-chain surface and rendering drift for no gain.

- Montserrat weights: 400, 500, 600, 700. Prefer 600 for h1–h3, 500 for h4–h6.
- Ubuntu weights: 300, 400, 500, 700.
- Letter-spacing: `-0.02em` for display, `0` for body, `+0.12em` uppercase for eyebrow labels and the WRLD wordmark when rendered as type (not as logo).
- Line heights: 1.1 for display, 1.3 for headings, 1.6 for body, 1.4 for UI labels.

### 3.4 Spacing, radius, shadow, motion

- **Base unit:** 4px. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120.
- **Radius:** 0 (sharp), 4 (inputs), 8 (cards), 12 (modals), 999 (pills). Prefer sharp or 4.
- **Shadows:** defined in tokens; monochrome on static states, tinted with accent on hover/focus only.
- **Motion:** 120ms (micro), 200ms (default), 320ms (emphasis), 600ms (reveal). Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` for most, `cubic-bezier(0.4, 0, 0.2, 1)` for enter, `cubic-bezier(0.4, 0, 1, 1)` for exit.

### 3.5 What "on-brand" looks like

- Generous whitespace. Grids you can feel. Type that breathes.
- One hero element per view. No visual competition.
- Geometry > illustration. Prefer diagrams, rules, dots, and the starburst mark over stock photography.
- Interactive moments feel precise — not bouncy, not springy. Tight cubic-bezier, short durations.

### 3.6 Anti-patterns

- Purple-to-blue hero gradients.
- Glassmorphism as a primary visual (acceptable sparingly as a subtle overlay).
- Neon neon neon. We are confident, not loud.
- "AI slop" default layouts — auto-three-column feature rows with stock icons.
- Helvetica / Arial as *display* faces. They remain acceptable fallbacks in email HTML only.
- Mixing accent colors as static page fills.

---

## 4. Voice and tone

### 4.1 Voice (constant)

**Confident, direct, and warm.** A knowledgeable friend who happens to be a technologist. Authoritative but never condescending. Explains the *why* alongside the *how*.

| We are | We are not |
|---|---|
| Confident and knowledgeable | Arrogant or condescending |
| Approachable and human | Overly casual or slangy |
| Direct and clear | Blunt or cold |
| Proactive and forward-looking | Passive or wait-and-see |
| Honest about trade-offs | Overselling or making empty promises |
| Technical when needed | Jargon-heavy by default |
| Urgency-driven | Panicky or alarmist |
| Partner-minded | Vendor-like or transactional |
| Solutions-focused | Problem-dwellers |
| Innovative and modern | Bleeding-edge reckless |

### 4.2 Tone dial (by context)

| Context | Warmth | Formality | Technicality | Urgency |
|---|---|---|---|---|
| Client onboarding | High | Medium | Low | Low |
| Sales proposal | Med-High | Med-High | Medium | Medium |
| Support ticket | Med-High | Low-Med | Med-High | High |
| Incident comms | Medium | Med-High | High | High |
| Marketing / web | High | Medium | Low | Low |
| Social | High | Low | Low | Low |
| Internal team | Med-High | Low | High | Varies |
| Invoice / billing | Medium | High | Low | Medium |
| Blog / thought-leadership | Med-High | Medium | Medium | Low |
| Partner comms | Medium | Med-High | High | Medium |

### 4.3 Writing conventions

- Active voice ("We detected an issue" — not "An issue was detected").
- Contractions are fine — "we're", "you'll", "don't".
- Short paragraphs (2–3 sentences) in client-facing comms.
- Numbers: spell out one through nine, numerals for 10+, always numerals for specs (`24/7`, `512GB`, `99.99%`).
- Define a technical term on first use for clients; use freely for internal and partner contexts.
- No hedging. "We believe we can" → "We will." (unless honestly uncertain, in which case say so).

### 4.4 Messaging pillars

1. **Strategic partnership, not just IT support.** We're the technology arm of your business.
2. **Proactive protection.** We prevent before things fail — not repair after.
3. **SMB-specialized.** Built for 1–250 employees. Right-sized, not enterprise-jammed-into-small.
4. **Comprehensive one-stop.** Hosting to hardware to AI, under one roof.
5. **Innovation with integrity.** New tech, only when it's right for the client.

---

## 5. Taglines

- **Primary:** *Your Strategic Partner in Technology and Business Growth.* (website hero, proposals, decks)
- **Descriptor:** *WRLD · Tech · Design · Support — SMB Business Technology, Automation and AI Solutions.* (email footers, ticket systems, operational)
- **Short:** *Tech that moves with you.* (social, short-form)

---

## 6. How to use this file

**At the start of a Claude session:**

> Load `github.com/WRLDInc/DesignSystem/brand/CLAUDE.md` and the relevant sub-brand brief from `/brand`. Apply the tokens from `tokens/tokens.css`. Use the logos from `/assets/logos` (authentic raster artwork only — never generated geometry). When unsure, ask — never invent brand elements.

**When producing a deliverable:**

1. Identify which entity / sub-brand the work is for → load that brief.
2. Confirm the context (onboarding, proposal, support, marketing, etc.) and set the tone dial accordingly.
3. Start monochromatic. Add accent *only* on interactive elements.
4. Use Montserrat headings, Ubuntu (or Inter) body.
5. Ship with the logo that correlates to the surface (dark logo on light, light on dark).
6. If the deliverable is code, drop in `tokens/tokens.css` rather than redefining values.

**If a request conflicts with this brief,** flag it and ask. Don't quietly override brand decisions for one-off asks.

---

## 7. Open questions (carry forward)

1. **wrld.one positioning.** Confirm intended scope before public-facing work.
2. **WRLD.AI approved claims.** What specific AI capabilities can be promised? Err conservative until resolved.
3. **LadderStone relationship.** Client, subsidiary, or partner? Confirm before cross-referencing.
4. **Baseline.is guide alignment.** When the Baseline.is brand guide is re-crawled, reconcile any deltas here.

---

## 8. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-04-18 | 0.1.0 | Initial Claude-ready brief — consolidates 2026-03-29 voice guide, project context, and logo attached by Ridgeway. |
