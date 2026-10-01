# PanelAlpha Style Manager — applied values

The client-area **Style Manager** (admin → Configuration → Client Area →
Branding → Configure) holds the settings that `client-area.css` cannot
reach: logos, favicon, the default mode, and the five "primary" colours
PanelAlpha derives its theme from. These are the values saved on
`deployboi.wrld.host` on 2026-09-30.

## Logos and favicon

| Slot | Asset in this repo | Why |
| --- | --- | --- |
| Light mode logo | `assets/logos/wrld-tech-black.png` (999×173, transparent) | Authentic WRLD.TECH lockup, dark on light |
| Dark mode logo | `assets/logos/wrld-tech-white.png` (999×173, transparent) | Same lockup, light on dark |
| Favicon | `assets/logos/favicons/favicon-128x128.png` | The starburst mark, never a disc |

PanelAlpha stores uploads as data URLs, so the panel does not depend on
wrld.design for the logos. Fonts are the only runtime dependency.

## Mode

| Setting | Value |
| --- | --- |
| Dark/Light Mode (default) | Light |
| Let Users Switch | On — the system is dual-mode by design |
| Disable Shadows | Off — `client-area.css` flattens shadows to `--wrld-shadow-xs` itself |

## Primary colours — applied scheme: "Monochrome mainline"

Primary = `--wrld-fg`. Buttons, the active tab underline and links take the
near-black fill; `client-area.css` inverts them to near-white in dark mode
and reserves the wrld.host accent (`#00adee`) for hover and focus.

| Field | Value | Token |
| --- | --- | --- |
| Base Color | `#0A0A0A` | `--wrld-mono-950` |
| Darken Color 1 | `#000000` | pressed / hover fill |
| Lighten Color 1 | `#3F3F46` | `--wrld-mono-700` |
| Lighten Color 2 | `#E4E4E7` | `--wrld-mono-200` |
| Faded Color | `#F4F4F5` | `--wrld-mono-100` |

## Alternatives considered

Three schemes were weighed. Only the first matches the README's
"accents are interactive, never decorative" rule, which is why it shipped.
The other two are a five-field swap in the Style Manager if the team wants
a louder panel; `client-area.css` works unchanged with any of them because
it only overrides the dark-mode primary.

| Scheme | Fields (Base · Darken 1 · Lighten 1 · Lighten 2 · Faded) | Pros | Cons |
| --- | --- | --- | --- |
| **Monochrome mainline** (applied) | `#0A0A0A` · `#000000` · `#3F3F46` · `#E4E4E7` · `#F4F4F5` | Canonical WRLD button (fg fill, inverse text); surfaces stay mono; accent only on hover/focus; highest contrast | Links are mono too, so they lean on underline/hover; the least "colourful" option |
| Flagship blue | `#007FEE` · `#0066C2` · `#3399F2` · `#CCE5FC` · `#E6F2FE` | Instantly reads as WRLD blue; no dark-mode inversion needed | Static accent fills everywhere, which the brand reserves for interaction; white-on-`#007fee` is 4.0:1, under AA for 14px text |
| Sky signal (wrld.host weighting) | `#00ADEE` · `#0090C9` · `#33BDF1` · `#CCEFFC` · `#E6F7FE` | The wrld.host hover colour as primary; cooler, more technical feel | White text on `#00adee` is 2.6:1 — fails AA; needs dark button text and extra CSS |

## Re-applying

1. Branding → Configure opens the client area with the Style Manager drawer.
2. Upload the two logos and the favicon from the paths above.
3. Enter the five hex values; the drawer previews them live.
4. Switch "Let Users Switch" on, leave the default mode on Light.
5. Save Changes.
