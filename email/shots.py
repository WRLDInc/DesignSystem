"""Rasterize logos with Playwright (fonts embedded via Google Fonts), then screenshot mockups at desktop and mobile."""
import asyncio, base64, sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
DIST = ROOT / "dist"
ASSETS = ROOT / "assets"
SHOTS = DIST / "screenshots"

LOGO_PAGE = """<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
<style>body{margin:0;background:transparent}svg{width:528px;height:auto;display:block}</style></head>
<body>%s</body></html>"""

async def raster(page, svg_path, out_png):
    svg = svg_path.read_text()
    await page.set_content(LOGO_PAGE % svg)
    await page.wait_for_timeout(600)
    el = await page.query_selector("svg")
    await el.screenshot(path=str(out_png), omit_background=True)

async def main():
    SHOTS.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 700, "height": 300}, device_scale_factor=1)
        await raster(page, ASSETS / "wrld-tech-black.svg", ASSETS / "wrld-tech-black.png")
        await raster(page, ASSETS / "wrld-tech-white.svg", ASSETS / "wrld-tech-white.png")
        await raster(page, ASSETS / "wrld-host-black.svg", ASSETS / "wrld-host-black.png")
        await raster(page, ASSETS / "wrld-host-white.svg", ASSETS / "wrld-host-white.png")
        hblack = base64.b64encode((ASSETS / "wrld-host-black.png").read_bytes()).decode()
        hwhite = base64.b64encode((ASSETS / "wrld-host-white.png").read_bytes()).decode()
        black = base64.b64encode((ASSETS / "wrld-tech-black.png").read_bytes()).decode()
        white = base64.b64encode((ASSETS / "wrld-tech-white.png").read_bytes()).decode()

        # Inject logos into mockups (data URIs) so previews are self-contained
        for f in (DIST / "mockups").rglob("*.html"):
            s = f.read_text()
            s = s.replace("{{WRLD_LOGO_LIGHT_URL}}", "data:image/png;base64," + black)
            s = s.replace("{{WRLD_LOGO_DARK_URL}}", "data:image/png;base64," + white)
            s = s.replace("{{WRLDHOST_LOGO_LIGHT_URL}}", "data:image/png;base64," + hblack)
            s = s.replace("{{WRLDHOST_LOGO_DARK_URL}}", "data:image/png;base64," + hwhite)
            f.write_text(s)

        targets = sys.argv[1:] or ["syncro-ticket-comment", "gleap-message-reply", "whmcs-support-ticket-reply", "whmcs-invoice-failed"]
        for d in ["ledger", "signal", "thread"]:
            for key in targets:
                f = DIST / "mockups" / d / f"{key}.html"
                for label, w, dark in [("desktop", 800, False), ("mobile", 390, False), ("mobile-dark", 390, True)]:
                    ctx = await browser.new_context(viewport={"width": w, "height": 900}, device_scale_factor=1,
                                                    color_scheme="dark" if dark else "light")
                    pg = await ctx.new_page()
                    await pg.goto(f.as_uri())
                    await pg.wait_for_timeout(700)
                    await pg.screenshot(path=str(SHOTS / f"{d}--{key}--{label}.png"), full_page=True)
                    await ctx.close()
        await browser.close()
    print("done")

asyncio.run(main())
