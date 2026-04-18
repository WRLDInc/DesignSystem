#!/usr/bin/env python3
"""
WRLD logo SVG generator.

Generates all canonical SVG variants of the WRLD mark and lockups from a single
programmatic definition — so the logo stays consistent and is easy to regenerate
if the rotation count, taper, or spacing ever needs to change.

Run from repo root:
    python3 scripts/generate_svgs.py

Outputs into logos/svg/
"""
from __future__ import annotations

import math
import os
from pathlib import Path

# --- Mark geometry -----------------------------------------------------------
# The starburst is N narrow triangular rays arranged around a center hub.
# Each ray is skewed slightly off-radial to produce the signature pinwheel feel.

RAYS = 18                 # number of triangular rays
CENTER = 100              # canvas center for a 200x200 mark box
OUTER_R = 96              # outer radius of the ray tips
INNER_R = 6               # tiny inner hub radius (rays don't quite meet at a point)
RAY_HALF_WIDTH = 8.5      # half-angle width at the outer edge, in degrees
SKEW = 5.0                # pinwheel skew, in degrees — positive = clockwise lean


def polar_to_cart(cx: float, cy: float, r: float, deg: float) -> tuple[float, float]:
    rad = math.radians(deg - 90)  # -90 so 0deg points up
    return (cx + r * math.cos(rad), cy + r * math.sin(rad))


def build_ray_path(index: int) -> str:
    """Build one triangular ray as an SVG path string."""
    step = 360 / RAYS
    center_angle = index * step
    # Leading edge (skewed forward), trailing edge (skewed back)
    outer_lead_angle = center_angle - RAY_HALF_WIDTH + SKEW
    outer_trail_angle = center_angle + RAY_HALF_WIDTH + SKEW
    inner_lead_angle = center_angle - RAY_HALF_WIDTH * 0.3
    inner_trail_angle = center_angle + RAY_HALF_WIDTH * 0.3

    p1 = polar_to_cart(CENTER, CENTER, OUTER_R, outer_lead_angle)
    p2 = polar_to_cart(CENTER, CENTER, OUTER_R, outer_trail_angle)
    p3 = polar_to_cart(CENTER, CENTER, INNER_R, inner_trail_angle)
    p4 = polar_to_cart(CENTER, CENTER, INNER_R, inner_lead_angle)

    return (
        f"M{p1[0]:.2f},{p1[1]:.2f} "
        f"L{p2[0]:.2f},{p2[1]:.2f} "
        f"L{p3[0]:.2f},{p3[1]:.2f} "
        f"L{p4[0]:.2f},{p4[1]:.2f} Z"
    )


def build_mark_svg(fill: str, viewbox: str = "0 0 200 200", *, id_prefix: str = "") -> str:
    """Build the starburst mark SVG."""
    rays = "\n    ".join(
        f'<path d="{build_ray_path(i)}"/>' for i in range(RAYS)
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-label="WRLD mark">
  <title>WRLD — mark</title>
  <g fill="{fill}" fill-rule="evenodd">
    {rays}
  </g>
</svg>
'''


def build_mark_svg_current_color() -> str:
    """Mono variant — inherits currentColor so a single file themes everywhere."""
    rays = "\n    ".join(
        f'<path d="{build_ray_path(i)}"/>' for i in range(RAYS)
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="WRLD mark">
  <title>WRLD — mark</title>
  <g fill="currentColor" fill-rule="evenodd">
    {rays}
  </g>
</svg>
'''


# --- Wordmark ----------------------------------------------------------------
# Rendered with Montserrat-like geometric proportions. We reference the font by
# name so consuming pages with Montserrat loaded render it correctly; the bundled
# "outlined" variant (below) is provided for when no fonts are available.

WORDMARK_FONT_STACK = "'Montserrat', 'Helvetica Neue', Arial, sans-serif"


def build_wordmark_svg(fill: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 200" role="img" aria-label="WRLD wordmark">
  <title>WRLD wordmark</title>
  <text x="0" y="158" font-family="{WORDMARK_FONT_STACK}" font-weight="700" font-size="200" letter-spacing="-6" fill="{fill}">WRLD</text>
</svg>
'''


def build_wordmark_svg_current_color() -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 200" role="img" aria-label="WRLD wordmark">
  <title>WRLD wordmark</title>
  <text x="0" y="158" font-family="{WORDMARK_FONT_STACK}" font-weight="700" font-size="200" letter-spacing="-6" fill="currentColor">WRLD</text>
</svg>
'''


# --- Full lockup -------------------------------------------------------------
# Mark + wordmark horizontal, balanced on a 1080x240 art-board.

LOCKUP_W = 1080
LOCKUP_H = 240
MARK_BOX = 200
MARK_X = 20
MARK_Y = (LOCKUP_H - MARK_BOX) / 2
WORDMARK_X = 260
WORDMARK_Y_BASELINE = 180


def build_lockup_svg(fill: str) -> str:
    # Inline the ray paths, shifted into the lockup canvas.
    rays = []
    for i in range(RAYS):
        p = build_ray_path(i)
        rays.append(
            f'<path transform="translate({MARK_X},{MARK_Y})" d="{p}"/>'
        )
    rays_str = "\n    ".join(rays)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LOCKUP_W} {LOCKUP_H}" role="img" aria-label="WRLD">
  <title>WRLD</title>
  <g fill="{fill}" fill-rule="evenodd">
    {rays_str}
  </g>
  <text x="{WORDMARK_X}" y="{WORDMARK_Y_BASELINE}" font-family="{WORDMARK_FONT_STACK}" font-weight="700" font-size="220" letter-spacing="-8" fill="{fill}">WRLD</text>
</svg>
'''


def build_lockup_svg_current_color() -> str:
    rays = []
    for i in range(RAYS):
        p = build_ray_path(i)
        rays.append(
            f'<path transform="translate({MARK_X},{MARK_Y})" d="{p}"/>'
        )
    rays_str = "\n    ".join(rays)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LOCKUP_W} {LOCKUP_H}" role="img" aria-label="WRLD">
  <title>WRLD</title>
  <g fill="currentColor" fill-rule="evenodd">
    {rays_str}
  </g>
  <text x="{WORDMARK_X}" y="{WORDMARK_Y_BASELINE}" font-family="{WORDMARK_FONT_STACK}" font-weight="700" font-size="220" letter-spacing="-8" fill="currentColor">WRLD</text>
</svg>
'''


def build_sub_brand_lockup(label: str, fill: str) -> str:
    """Full lockup with a sub-brand descriptor underneath the wordmark."""
    rays = []
    for i in range(RAYS):
        p = build_ray_path(i)
        rays.append(
            f'<path transform="translate({MARK_X},{MARK_Y})" d="{p}"/>'
        )
    rays_str = "\n    ".join(rays)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LOCKUP_W} {LOCKUP_H}" role="img" aria-label="WRLD {label}">
  <title>WRLD {label}</title>
  <g fill="{fill}" fill-rule="evenodd">
    {rays_str}
  </g>
  <text x="{WORDMARK_X}" y="152" font-family="{WORDMARK_FONT_STACK}" font-weight="700" font-size="180" letter-spacing="-6" fill="{fill}">WRLD</text>
  <text x="{WORDMARK_X + 4}" y="210" font-family="{WORDMARK_FONT_STACK}" font-weight="500" font-size="56" letter-spacing="14" fill="{fill}" opacity="0.85">{label.upper()}</text>
</svg>
'''


# --- Main --------------------------------------------------------------------

DARK = "#0a0a0a"
LIGHT = "#fafafa"

SUB_BRANDS = ["Tech", "Inc.", "Host", "Design", "One", "AI", "Services", "Support", "Press"]


def main() -> None:
    out = Path(__file__).resolve().parent.parent / "logos" / "svg"
    out.mkdir(parents=True, exist_ok=True)

    files: dict[str, str] = {
        # Marks
        "wrld-mark-dark.svg":  build_mark_svg(DARK),
        "wrld-mark-light.svg": build_mark_svg(LIGHT),
        "wrld-mark-mono.svg":  build_mark_svg_current_color(),

        # Wordmark-only
        "wrld-wordmark-dark.svg":  build_wordmark_svg(DARK),
        "wrld-wordmark-light.svg": build_wordmark_svg(LIGHT),
        "wrld-wordmark-mono.svg":  build_wordmark_svg_current_color(),

        # Full lockup (mark + wordmark)
        "wrld-lockup-dark.svg":  build_lockup_svg(DARK),
        "wrld-lockup-light.svg": build_lockup_svg(LIGHT),
        "wrld-lockup-mono.svg":  build_lockup_svg_current_color(),
    }

    for brand in SUB_BRANDS:
        slug = brand.lower().replace(".", "").replace(" ", "-") or brand.lower()
        files[f"wrld-{slug}-dark.svg"]  = build_sub_brand_lockup(brand, DARK)
        files[f"wrld-{slug}-light.svg"] = build_sub_brand_lockup(brand, LIGHT)

    for name, content in files.items():
        (out / name).write_text(content)
        print(f"wrote {name}")

    print(f"\n{len(files)} files written to {out}")


if __name__ == "__main__":
    main()
