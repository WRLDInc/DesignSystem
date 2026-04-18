#!/usr/bin/env python3
"""
Render PNG and favicon exports from the canonical SVGs.

Run after ``generate_svgs.py`` — or together via ``npm run build:favicons``.
"""
from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image

REPO = Path(__file__).resolve().parent.parent
SVG_DIR = REPO / "logos" / "svg"
PNG_DIR = REPO / "logos" / "png"
FAV_DIR = REPO / "logos" / "favicons"

PNG_DIR.mkdir(parents=True, exist_ok=True)
FAV_DIR.mkdir(parents=True, exist_ok=True)

# Mark exports — square, multiple sizes
MARK_SIZES = [64, 128, 256, 512, 1024]
# Lockup exports — horizontal, one pixel-denser for prints
LOCKUP_WIDTHS = [512, 1024, 2048]


def render(svg_path: Path, out_path: Path, *, width: int | None = None, height: int | None = None) -> None:
    kwargs = {}
    if width:
        kwargs["output_width"] = width
    if height:
        kwargs["output_height"] = height
    cairosvg.svg2png(url=str(svg_path), write_to=str(out_path), **kwargs)
    print(f"  → {out_path.relative_to(REPO)}")


def main() -> None:
    # ------------------------------------------------------------------
    # PNG exports of marks
    # ------------------------------------------------------------------
    print("Rendering mark PNGs…")
    for variant in ("dark", "light", "mono"):
        src = SVG_DIR / f"wrld-mark-{variant}.svg"
        if not src.exists():
            continue
        for size in MARK_SIZES:
            out = PNG_DIR / f"wrld-mark-{variant}-{size}.png"
            render(src, out, width=size, height=size)

    # ------------------------------------------------------------------
    # PNG exports of lockups
    # ------------------------------------------------------------------
    print("\nRendering lockup PNGs…")
    for variant in ("dark", "light", "mono"):
        src = SVG_DIR / f"wrld-lockup-{variant}.svg"
        if not src.exists():
            continue
        for width in LOCKUP_WIDTHS:
            out = PNG_DIR / f"wrld-lockup-{variant}-{width}w.png"
            render(src, out, width=width)

    # ------------------------------------------------------------------
    # Sub-brand lockups — single 2048w reference export each
    # ------------------------------------------------------------------
    print("\nRendering sub-brand lockup PNGs…")
    for svg in sorted(SVG_DIR.glob("wrld-*-dark.svg")):
        if svg.stem in {"wrld-mark-dark", "wrld-lockup-dark", "wrld-wordmark-dark"}:
            continue
        out = PNG_DIR / f"{svg.stem}-2048w.png"
        render(svg, out, width=2048)

    # ------------------------------------------------------------------
    # Favicons — derived from the mark. Solid dark (for light contexts).
    # ------------------------------------------------------------------
    print("\nRendering favicons…")
    fav_src = SVG_DIR / "wrld-mark-dark.svg"
    favicon_sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512]
    pngs: dict[int, Path] = {}
    for size in favicon_sizes:
        out = FAV_DIR / f"favicon-{size}x{size}.png"
        render(fav_src, out, width=size, height=size)
        pngs[size] = out

    # apple-touch-icon — conventionally 180 w/ padding-safe dark
    render(fav_src, FAV_DIR / "apple-touch-icon.png", width=180, height=180)

    # Android / PWA icons
    render(fav_src, FAV_DIR / "android-chrome-192x192.png", width=192, height=192)
    render(fav_src, FAV_DIR / "android-chrome-512x512.png", width=512, height=512)

    # Classic favicon.ico (multi-resolution)
    ico_sizes = [16, 32, 48, 64]
    images: list[Image.Image] = []
    for s in ico_sizes:
        images.append(Image.open(pngs[s]).convert("RGBA"))
    images[0].save(FAV_DIR / "favicon.ico", format="ICO", sizes=[(s, s) for s in ico_sizes])
    print(f"  → {(FAV_DIR / 'favicon.ico').relative_to(REPO)}")

    # ------------------------------------------------------------------
    # Web manifest
    # ------------------------------------------------------------------
    manifest = {
        "name": "WRLD",
        "short_name": "WRLD",
        "icons": [
            {"src": "/favicons/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/favicons/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
        ],
        "theme_color": "#0a0a0a",
        "background_color": "#0a0a0a",
        "display": "standalone",
    }
    import json as _json
    (FAV_DIR / "site.webmanifest").write_text(_json.dumps(manifest, indent=2))
    print(f"  → {(FAV_DIR / 'site.webmanifest').relative_to(REPO)}")

    print("\nDone.")


if __name__ == "__main__":
    main()
