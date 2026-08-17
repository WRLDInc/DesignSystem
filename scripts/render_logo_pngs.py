#!/usr/bin/env python3
"""
Render PNG and favicon exports from the canonical SVGs.

Run after ``generate_svgs.py`` — or together via ``npm run build:favicons``.
"""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

from PIL import Image

try:
    import cairosvg
except ImportError:
    cairosvg = None

REPO = Path(__file__).resolve().parent.parent
SVG_DIR = REPO / "logos" / "svg"
PNG_DIR = REPO / "logos" / "png"
FAV_DIR = REPO / "logos" / "favicons"
ASSET_FAV_DIR = REPO / "assets" / "logos" / "favicons"
MARK_WHITE_PNG = REPO / "assets" / "logos" / "wrld-mark-white.png"

PNG_DIR.mkdir(parents=True, exist_ok=True)
FAV_DIR.mkdir(parents=True, exist_ok=True)

# Mark exports — square, multiple sizes
MARK_SIZES = [64, 128, 256, 512, 1024]
# Lockup exports — horizontal, one pixel-denser for prints
LOCKUP_WIDTHS = [512, 1024, 2048]


def render(svg_path: Path, out_path: Path, *, width: int | None = None, height: int | None = None) -> None:
    if cairosvg is None:
        raise RuntimeError("cairosvg is required for SVG → PNG mark exports")
    kwargs = {}
    if width:
        kwargs["output_width"] = width
    if height:
        kwargs["output_height"] = height
    cairosvg.svg2png(url=str(svg_path), write_to=str(out_path), **kwargs)
    print(f"  → {out_path.relative_to(REPO)}")


def _load_generate_svgs():
    spec = importlib.util.spec_from_file_location(
        "generate_svgs", REPO / "scripts" / "generate_svgs.py"
    )
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def main() -> None:
    if cairosvg is None:
        print("cairosvg not installed — skipping mark/lockup PNG exports")
    else:
        _render_mark_and_lockup_pngs()
    print("\nRendering favicons…")
    write_starburst_favicons()
    print("\nDone.")


def _render_mark_and_lockup_pngs() -> None:
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


def _square_mark(src: Path) -> Image.Image:
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return im.crop((left, top, left + side, top + side))


def _resize_mark(square: Image.Image, size: int) -> Image.Image:
    return square.resize((size, size), Image.Resampling.LANCZOS)


def write_starburst_favicons() -> None:
    """Rasterize the starburst mark for every published favicon size.

    Source of truth is the white-on-black mark PNG (same geometry as
    ``logos/svg/wrld-mark-light.svg``). CairoSVG is optional; this path
    must work with Pillow alone so the circle set cannot linger.
    """
    if not MARK_WHITE_PNG.exists():
        raise SystemExit(f"missing starburst source: {MARK_WHITE_PNG}")

    square = _square_mark(MARK_WHITE_PNG)
    FAV_DIR.mkdir(parents=True, exist_ok=True)
    ASSET_FAV_DIR.mkdir(parents=True, exist_ok=True)

    favicon_sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512]
    pngs: dict[int, Path] = {}
    for size in favicon_sizes:
        out = FAV_DIR / f"favicon-{size}x{size}.png"
        _resize_mark(square, size).save(out, format="PNG")
        pngs[size] = out
        print(f"  → {out.relative_to(REPO)}")

    apple = FAV_DIR / "apple-touch-icon.png"
    _resize_mark(square, 180).save(apple, format="PNG")
    print(f"  → {apple.relative_to(REPO)}")

    for size, name in ((192, "android-chrome-192x192.png"), (512, "android-chrome-512x512.png")):
        out = FAV_DIR / name
        _resize_mark(square, size).save(out, format="PNG")
        print(f"  → {out.relative_to(REPO)}")

    ico_sizes = [16, 32, 48, 64]
    images = [Image.open(pngs[s]).convert("RGBA") for s in ico_sizes]
    ico = FAV_DIR / "favicon.ico"
    images[0].save(ico, format="ICO", sizes=[(s, s) for s in ico_sizes])
    print(f"  → {ico.relative_to(REPO)}")

    svg_text = _load_generate_svgs().build_favicon_svg()
    (FAV_DIR / "favicon.svg").write_text(svg_text)
    print(f"  → {(FAV_DIR / 'favicon.svg').relative_to(REPO)}")

    manifest = {
        "name": "WRLD",
        "short_name": "WRLD",
        "icons": [
            {"src": "/logos/favicons/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/logos/favicons/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/logos/favicons/favicon.svg", "sizes": "any", "type": "image/svg+xml"},
        ],
        "theme_color": "#0a0a0a",
        "background_color": "#0a0a0a",
        "display": "standalone",
    }
    (FAV_DIR / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"  → {(FAV_DIR / 'site.webmanifest').relative_to(REPO)}")

    # Mirror into the remix/preview path so leftover circle files cannot win.
    stale = {"favicon.png"}
    for path in ASSET_FAV_DIR.iterdir():
        if path.name in stale or path.suffix.lower() in {".png", ".ico", ".svg", ".webmanifest"}:
            if path.name != ".DS_Store":
                path.unlink()
    for src in FAV_DIR.iterdir():
        if src.name == ".DS_Store":
            continue
        dest = ASSET_FAV_DIR / src.name
        dest.write_bytes(src.read_bytes())
        print(f"  → {dest.relative_to(REPO)}")


if __name__ == "__main__":
    main()
