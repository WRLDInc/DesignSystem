#!/usr/bin/env python3
"""
Compare a snapshot of the committed favicon set against freshly rendered
output. Fails if the committed files are stale — same guarantee the old
regenerate-and-diff gate gave, but at the pixel level so Pillow encoder
differences across versions cannot false-alarm.

Usage: check_favicons_fresh.py <committed-snapshot-dir> <regenerated-dir>
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

IGNORE = {".DS_Store"}


def images_differ(a: Path, b: Path) -> bool:
    im_a = Image.open(a)
    im_b = Image.open(b)
    frames_a = getattr(im_a, "n_frames", 1)
    frames_b = getattr(im_b, "n_frames", 1)
    if frames_a != frames_b or im_a.size != im_b.size:
        return True
    for frame in range(frames_a):
        im_a.seek(frame)
        im_b.seek(frame)
        # Compare decoded pixels, not encoded bytes (encoders vary across
        # Pillow versions) and not getbbox() (alpha-only for RGBA in
        # Pillow >= 10, which hides same-alpha color changes).
        if im_a.convert("RGBA").tobytes() != im_b.convert("RGBA").tobytes():
            return True
    return False


def main() -> None:
    committed, regenerated = (Path(p) for p in sys.argv[1:3])
    names_committed = {p.name for p in committed.iterdir() if p.name not in IGNORE}
    names_regenerated = {p.name for p in regenerated.iterdir() if p.name not in IGNORE}

    problems: list[str] = []
    for name in sorted(names_regenerated - names_committed):
        problems.append(f"missing from the committed set: {name}")
    for name in sorted(names_committed - names_regenerated):
        problems.append(f"committed but no longer rendered (stale): {name}")

    for name in sorted(names_committed & names_regenerated):
        a, b = committed / name, regenerated / name
        if a.suffix.lower() in {".png", ".ico"}:
            if images_differ(a, b):
                problems.append(f"pixel content differs (stale commit): {name}")
        elif a.read_bytes() != b.read_bytes():
            problems.append(f"content differs (stale commit): {name}")

    if problems:
        for p in problems:
            print(f"::error::{p}")
        print("Run `npm run build:favicons` and commit the outputs.")
        sys.exit(1)
    print(f"favicon set is fresh: {len(names_committed)} files match")


if __name__ == "__main__":
    main()
