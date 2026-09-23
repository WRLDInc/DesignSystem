# Consumers of wrld.design

Who links the tokens, type, and components served from <https://wrld.design>,
and what each depends on. Keep this current: a token rename or a `_headers`
change is a contract change for every row below.

| Consumer | Repo | What it links | Components used | Notes |
| --- | --- | --- | --- | --- |
| wrld.tech (rebuild) | `WRLDInc/wrld.tech` | `styles.css`, fonts, logos | `Header`, `Hero`, `ServicesGrid`, `ValuesStrip`, `CTA`, `Footer` | Flagship marketing kit |
| WRLD.one | `WRLDInc/wrld.one` | `tokens/tokens.css`, `registry/theme/wrld.css` | `WrldButton`, `WrldStatCard`, `WrldTopBar` | Reads Better Stack for its own status strip |
| WRLD.AI dashboard | `WRLDInc/CentralizeWRLD` | `registry/theme/wrld.css` | `WrldSidebar`, `WrldTopBar`, `WrldStatCard`, `WrldAgentList`, `WrldAgentDetail`, `WrldRunHistory`, `WrldHelpButton` | shadcn host |
| **PulseWRLD** — public services status | `WRLDInc/publicServicesStatus-web` | `styles.css`, favicons, `wrld-mark-white.png` | `WrldTopBar`, `WrldEyebrow`, `WrldStatCard`; local stand-ins for a status pill and an uptime bar | Cloudflare Worker at a `*.wrld.tech` subdomain (name pending). Needs two new atoms — see below. |
| **WRLD.domains** — domain search | `WRLDInc/wrld.domains_quick` | Vendored copies of `tokens/tokens.css` and `colors_and_type.css` (v0.4.0, `180910c`), fonts, `wrld-mark-*.png`, favicons | Local ports of `Header`, `Hero`, `Button`, `Lockup`, `CTA`, `ValuesStrip` (as HowItWorks), `Footer`; `.eyebrow` from `colors_and_type.css`; local domain status pill and a search console with a primary commerce CTA | Cloudflare Worker `wrld-domains-quick`. Copies rather than links, so a token rename needs a manual re-sync there. Follows the wrld.host brief: `--accent-secondary` hover, `--accent-warm` for register. |

## Requested atoms

PulseWRLD needs two atoms that do not exist in the kit or the registry. They
are tracked in [issue #15 — Status pill and uptime bar atoms](https://github.com/WRLDInc/DesignSystem/issues/15) and belong in
`registry/ui/` with a mirrored `ui_kits/wrld-ai/` source, per CONTRIBUTING.

| Atom | Behaviour | Token rules |
| --- | --- | --- |
| `WrldStatusPill` | Dot + label. Six states: `operational`, `slow`, `degraded`, `outage`, `maintenance`, `unknown`. | Colour on the dot only, from `--wrld-status-*`. `unknown` renders a hollow dot, never grey-green. Hairline border, pill radius, mono surface. |
| `WrldUptimeBar` | 90 cells (configurable), one per day, hover tooltip with day, availability, worst state. | `null` days render hatched, not green — a figure is either measured or absent. Cells are 1px-gapped rectangles, radius 0 or 2, no gradients. |

Until they land, PulseWRLD carries local equivalents built on the same tokens
in `public/index.html`; the swap is a one-file change on their side.

WRLD.domains has a second use for the pill: six domain states (`checking`,
`available`, `likely` for an unconfirmed "looks available", `premium`,
`taken`, `unknown`) on the same dot-only rule, with `likely` drawn as a green
ring rather than a fill. `WrldStatusPill` should take its states as a map
(label + dot style) so both consumers can adopt it without forking.
