#!/usr/bin/env python3
"""
Render the published favicon set from the authentic raster mark.

Source of truth is ``assets/logos/wrld-mark-white.png`` — the original
artwork. There is no vector or generated-geometry step anywhere in this
pipeline: the retired parametric SVG set drew 18 identical rays whose tips
all landed on one circle and read as a disc, so every published icon is a
plain high-quality resize of the real mark, flattened onto the brand plate.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parent.parent
FAV_DIR = REPO / "logos" / "favicons"
ASSET_FAV_DIR = REPO / "assets" / "logos" / "favicons"
MARK_WHITE_PNG = REPO / "assets" / "logos" / "wrld-mark-white.png"


def main() -> None:
    print("Rendering favicons…")
    write_starburst_favicons()
    print("\nDone.")


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
    """Rasterize the starburst mark for every published favicon size."""
    if not MARK_WHITE_PNG.exists():
        raise SystemExit(f"missing starburst source: {MARK_WHITE_PNG}")

    square = _square_mark(MARK_WHITE_PNG)
    # The mark is white on transparency; flatten onto the brand dark plate so
    # the raster favicons stay visible on light browser chrome.
    plate = Image.new("RGBA", square.size, "#0a0a0a")
    plate.alpha_composite(square)
    square = plate
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
    # Pillow drops any requested size larger than the base image, so the
    # largest raster must be the base; the smaller ones are matched by size
    # from append_images.
    images[-1].save(
        ico,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=images[:-1],
    )
    print(f"  → {ico.relative_to(REPO)}")

    manifest = {
        "name": "WRLD",
        "short_name": "WRLD",
        "icons": [
            {"src": "/logos/favicons/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/logos/favicons/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
        ],
        "theme_color": "#0a0a0a",
        "background_color": "#0a0a0a",
        "display": "standalone",
    }
    (FAV_DIR / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"  → {(FAV_DIR / 'site.webmanifest').relative_to(REPO)}")

    # Retired outputs stay dead across re-runs: the legacy circle raster and
    # the parametric favicon.svg (generated geometry — never the real mark).
    stale = {"favicon.png", "favicon.svg"}
    for name in stale:
        (FAV_DIR / name).unlink(missing_ok=True)

    # Mirror into assets/logos/favicons so leftover files cannot win.
    for path in ASSET_FAV_DIR.iterdir():
        if path.name in stale or path.suffix.lower() in {".png", ".ico", ".svg", ".webmanifest"}:
            if path.name != ".DS_Store":
                path.unlink()
    for src in FAV_DIR.iterdir():
        if src.name == ".DS_Store" or src.name in stale:
            continue
        dest = ASSET_FAV_DIR / src.name
        dest.write_bytes(src.read_bytes())
        print(f"  → {dest.relative_to(REPO)}")


if __name__ == "__main__":
    main()
