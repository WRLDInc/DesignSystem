"""Rasterize signature icons to PNG; Gmail and Outlook drop SVG, so the signature hotlinks these.

    npm i --no-save lucide-static@0.544.0 simple-icons@15.10.0   # 0.544 is the last Lucide with brand glyphs
    py -3 email/signature_icons.py                                # needs rsvg-convert on PATH

Writes assets/email/signature/*.png at 3x display size. X comes from Simple Icons (Lucide never shipped it);
Teams uses Lucide users-round (no Microsoft glyph in either set).
"""
import re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).parent.parent
NM = ROOT / "node_modules"
LU, SI, OUT = (map(Path, sys.argv[1:4]) if len(sys.argv) == 4 else
               (NM / "lucide-static/icons", NM / "simple-icons/icons", ROOT / "assets/email/signature"))
OUT.mkdir(parents=True, exist_ok=True)
ACCENT, MUTED, INK, WHITE = "#007fee", "#71717a", "#0a0a0a", "#ffffff"

def inner_lucide(name):
    s = (LU / f"{name}.svg").read_text()
    return re.search(r"<svg[^>]*>(.*)</svg>", s, re.S).group(1)

def inner_si(name):
    s = (SI / f"{name}.svg").read_text()
    return re.search(r'<path d="([^"]+)"', s).group(1)

def glyph(kind, name, color, stroke):
    if kind == "lucide":
        return (f'<g fill="none" stroke="{color}" stroke-width="{stroke}" stroke-linecap="round" '
                f'stroke-linejoin="round">{inner_lucide(name)}</g>')
    # simple-icons glyph is a filled 24-box path; inset to 18px so its optical size matches the line set
    return f'<g transform="translate(3 3) scale(0.75)"><path d="{inner_si(name)}" fill="{color}"/></g>'

def render(svg, out, px):
    p = OUT / f"{out}.svg"; p.write_text(svg)
    subprocess.run(["rsvg-convert", "-w", str(px), "-h", str(px), "-o", str(OUT / f"{out}.png"), str(p)], check=True)
    p.unlink()

def box(body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">{body}</svg>'

# Human-written badge icons: accent stroke, 14px display -> 3x
for name in ["user-pen", "signature", "pen-line", "fingerprint"]:
    render(box(glyph("lucide", name, ACCENT, 2)), f"human-{name}", 42)

SOCIAL = [("linkedin", "lucide", "linkedin"), ("facebook", "lucide", "facebook"), ("x", "si", "x"),
          ("instagram", "lucide", "instagram"), ("teams", "lucide", "users-round"), ("github", "lucide", "github")]
for key, kind, name in SOCIAL:
    # line set: muted glyph on transparent, 16px display -> 3x
    render(box(glyph(kind, name, MUTED, 1.75)), f"social-line-{key}", 48)
    # tile set: white glyph on an ink tile, 22px display -> 3x (rx 4.36 = 4px radius cap at 22px)
    g = glyph(kind, name, WHITE, 2.25)
    render(box(f'<rect width="24" height="24" rx="4.36" fill="{INK}"/><g transform="translate(5 5) scale(0.5833)">{g}</g>'),
           f"social-tile-{key}", 66)
print("\n".join(sorted(x.name for x in OUT.glob("*.png"))))
