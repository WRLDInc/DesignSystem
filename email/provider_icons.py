"""Rasterize the third-party sign-in marks used by the portal invite email.

Email clients block SVG, so the Google "G" and the Microsoft four-square mark ship as
transparent PNGs at 3x (54 px, displayed at 18 px). Output goes to assets/email/, which
wrld.design publishes, so the email can hotlink https://wrld.design/assets/email/<file>.png.

These are the providers' own marks, used as their sign-in guidelines require.
They are not WRLD logos and do not belong in assets/logos/.

Run:  py -3 email/provider_icons.py      (needs Playwright + Chromium)
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent.parent
OUT = ROOT / "assets" / "email"
SIZE = 54

GOOGLE_G = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>"""

MICROSOFT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
<rect x="1" y="1" width="9" height="9" fill="#F25022"/>
<rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
<rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
<rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
</svg>"""

PAGE = """<!doctype html><html><head><style>html,body{margin:0;background:transparent}
svg{display:block;width:%dpx;height:%dpx}</style></head><body>%s</body></html>"""

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": SIZE, "height": SIZE}, device_scale_factor=1)
        for name, svg in [("google-g", GOOGLE_G), ("microsoft", MICROSOFT)]:
            await page.set_content(PAGE % (SIZE, SIZE, svg))
            el = await page.query_selector("svg")
            await el.screenshot(path=str(OUT / f"{name}.png"), omit_background=True)
            (OUT / f"{name}.svg").write_text(svg, encoding="utf-8")
            print("wrote", OUT / f"{name}.png")
        await browser.close()

asyncio.run(main())
