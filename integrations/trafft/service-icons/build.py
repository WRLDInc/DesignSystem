"""WRLD meeting-type tiles for the Trafft services at calendar.wrld.tech.

Composes one 512px hairline tile per service (Lucide glyph at the WRLD 1.5px
stroke on the off-white dot grid) and rasterises it with macOS QuickLook.

    python3 integrations/trafft/service-icons/build.py

Lucide SVGs are fetched from unpkg (lucide-static, pinned) into .lucide/ on
first run. a-mono and c-starburst were the two directions not chosen on
2026-10-05; their tile functions stay here so either can be rebuilt.
"""
import base64, re, subprocess, pathlib, urllib.request

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parents[2]
LUCIDE = HERE / ".lucide"
LUCIDE_VERSION = "0.544.0"
OUT = HERE
MARK = REPO / "assets/logos/wrld-mark-white.png"

# Trafft service → Lucide glyph (slug is the output filename)
SERVICES = [
    ("general-meeting",        "General/Other Meeting",                                   "calendar-days"),
    ("quick-call",             "Quick Meeting / Call",                                    "phone"),
    ("online-meeting",         "Online Meeting (Consult / Intros / Discovery)",           "video"),
    ("remote-training-1on1",   "ONE-ON-ONE Remote Training / Onboarding / Troubleshooting", "monitor-play"),
    ("office-visit",           "Meet at WRLD Tech Office",                                "building-2"),
    ("partner-vendor",         "Partner / Vendor Meeting",                                "handshake"),
    ("group-call",             "Group Online / Conference Call (Teams)",                  "users"),
    ("site-survey",            "Site Survey / IT Audit / Other On Site",                  "clipboard-check"),
    ("business-review",        "Technology Business Review",                              "chart-line"),
    ("web-presence",           "WRLD.host / Website & Online Presence Intros, Audit Analysis, Updating Guidance and Training", "globe"),
    ("onsite-training",        "In person Training / Onboarding",                         "graduation-cap"),
    ("service-appointment",    "Service Appointment at your Location with WRLD Tech",     "wrench"),
    ("onsite-meeting",         "Meeting at your Location with WRLD Tech",                 "map-pin"),
    ("group-training",         "GROUP Remote Training / Onboarding",                      "presentation"),
    ("intros-your-location",   "Intros & Consultations @ Your Location",                  "messages-square"),
    ("direct-ridge",           "Direct Book w/ Ridge (Extended Hours) (copy)",            "user-round"),
    ("direct-wrld",            "Direct Book w/ WRLD (Extended)",                          "calendar-clock"),
    ("remote-collab",          "Remote Collab / Project Work / Etc. (private)",           "folder-kanban"),
    ("office-visit-private",   "Meet at WRLD Tech Office (private)",                      "building-2"),
    ("online-call-extended",   "Online / Conference Call (Zoom, Teams) (Extended)",       "video"),
    ("online-call",            "Online / Conference Call (Zoom, Teams)",                  "video"),
    ("onsite-extended",        "Scheduled On-Site/Extended Hours",                        "clock"),
]

S = 512                       # tile size
G = 224                       # glyph box
SCALE = G / 24
OFF = (S - G) / 2
STROKE = 1.5                  # WRLD: 1.5px at 24px

def lucide(name):
    p = LUCIDE / f"{name}.svg"
    if not p.exists():
        LUCIDE.mkdir(exist_ok=True)
        url = f"https://unpkg.com/lucide-static@{LUCIDE_VERSION}/icons/{name}.svg"
        p.write_bytes(urllib.request.urlopen(url).read())
    return p

def glyph(name, color):
    lucide(name)
    svg = re.sub(r"<!--.*?-->", "", (LUCIDE / f"{name}.svg").read_text(), flags=re.S)
    inner = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1)
    return (f'<g transform="translate({OFF} {OFF}) scale({SCALE})" fill="none" stroke="{color}" '
            f'stroke-width="{STROKE}" stroke-linecap="round" stroke-linejoin="round">{inner}</g>')

mark_b64 = base64.b64encode(MARK.read_bytes()).decode()

def tile_mono(icon):
    return f'<rect width="{S}" height="{S}" fill="#0a0a0a"/>{glyph(icon, "#fafafa")}'

def tile_hairline(icon):
    dots = "".join(f'<circle cx="{x}" cy="{y}" r="2.6" fill="#0a0a0a" fill-opacity="0.07"/>'
                   for x in range(16, S, 32) for y in range(16, S, 32))
    return (f'<rect width="{S}" height="{S}" fill="#fafafa"/>{dots}'
            f'<rect x="3" y="3" width="{S-6}" height="{S-6}" rx="46" fill="none" stroke="#e4e4e7" stroke-width="6"/>'
            f'{glyph(icon, "#0a0a0a")}')

def tile_starburst(icon):
    return (f'<rect width="{S}" height="{S}" fill="#0a0a0a"/>'
            f'<image href="data:image/png;base64,{mark_b64}" x="214" y="214" width="420" height="422" opacity="0.13"/>'
            f'{glyph(icon, "#fafafa")}')

OPTIONS = {"b-hairline": tile_hairline}  # chosen 2026-10-05; a-mono / c-starburst kept above for reference

for opt, fn in OPTIONS.items():
    d = OUT
    for slug, _title, icon in SERVICES:
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">{fn(icon)}</svg>'
        p = d / f"{slug}.svg"
        p.write_text(svg)
        subprocess.run(["qlmanage", "-t", "-s", str(S), "-o", str(d), str(p)],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        png = d / f"{slug}.svg.png"
        if png.exists():
            png.rename(d / f"{slug}.png")
    print(opt, len(SERVICES), "tiles")
