"""WRLD email signatures: six designs, three social styles, one data source per person.

    py -3 email/signature.py        # writes email/signatures/<person>/... + email/dist/signatures.html
    py -3 email/signature_icons.py  # re-rasterizes assets/email/signature/*.png (badge + social icons)

Every image is hotlinked from wrld.design (PNG only; Gmail and Outlook drop SVG).
Inline styles only: signature fields in Spark, Outlook and Gmail strip <head> CSS.
EmailBrandingWRLD ports these layouts to templates/wrld-signatures.mjs (images on emailsig.wrld.tech);
change both together.
"""
import html
from pathlib import Path
from urllib.parse import urlencode

from build import T, FONT_DISPLAY, FONT_BODY, FONT_MONO, ADDRESS

ROOT = Path(__file__).parent / "signatures"
ASSETS = "https://wrld.design/assets/logos"
LOGO_BLACK = f"{ASSETS}/wrld-tech-black.png"        # 999x173, transparent: light surfaces only
LOGO_WHITE = f"{ASSETS}/wrld-tech-white.png"        # 999x173, transparent: dark surfaces only
MARK_TILE = f"{ASSETS}/favicons/favicon-256x256.png"  # starburst on #0a0a0a: survives dark mode
SIG_ASSETS = "https://wrld.design/assets/email/signature"  # badge + social PNGs (email/signature_icons.py)

# Corner radius: 3px on small controls, never above 4px anywhere in a signature.
R_SMALL, R_MAX = 3, 4
MARK_PAD = 5  # ink padding around the starburst so the blades clear the tile edge

MAP_URL = "https://g.page/wrldtech"
PROPERTIES = [("WRLD.tech", "https://wrld.tech"), ("WRLD.host", "https://wrld.host"), ("WRLD.one", "https://wrld.one")]
SOCIALS = [
    ("LinkedIn", "https://linkedin.com/company/wrldtech"),
    ("Facebook", "https://facebook.com/WRLDTechCo"),
    ("X", "https://x.com/WRLDTechCo"),
    ("Instagram", "https://instagram.com/wrldtechco"),
    ("Teams", "https://teams.microsoft.com/l/team/19%3Aa6H9kVWXIiPQKY-2rYCoCpW1hbhw1rv6amcmh0aJ7HA1%40thread.tacv2/conversations?groupId=35c9b1e9-ea3a-41a9-8eb3-76b4861756f8&tenantId=5625da99-1355-4fea-accf-2a83bef5ce42"),
    ("GitHub", "https://github.com/WRLDInc"),
]
SOCIAL_KEYS = ["linkedin", "facebook", "x", "instagram", "teams", "github"]  # same order as SOCIALS
SOCIAL_STYLES = {"text": "Text", "line": "Line icons", "tile": "Ink tiles"}

# CTAs. UTMs say where the click came from: source + medium (kept from round 1 so analytics
# history lines up), campaign = which CTA, content = which signature design, term = whose signature.
SCHEDULE = ("Schedule a meeting", "https://calendar.wrld.tech/", "schedule-meeting")
DIRECTORY = ("View the WRLD Directory", "https://wrld.one/", "wrld-directory")


def utm(base, campaign, design, slug):
    return base + "?" + urlencode({"utm_source": "emailsignature", "utm_medium": "email",
                                   "utm_campaign": campaign, "utm_content": design, "utm_term": slug})


BADGE_ICONS = {"user-pen": "Person with pen", "signature": "Signature", "pen-line": "Pen", "fingerprint": "Fingerprint"}
BADGE_LABEL = "Human written"
CONFIDENTIALITY = (
    "Confidentiality statement: This communication and any information contained within it are intended solely "
    "for the individual or entity to whom they are addressed and may contain confidential, privileged, or otherwise "
    "protected material. Any unauthorized review, use, disclosure, copying, or distribution of this communication is "
    "prohibited. If you have received it in error, please treat its contents as confidential and refrain from sharing "
    "or relying on the information.")

PEOPLE = {
    "ridgeway-lawrence": {
        "name": "Ridgeway Lawrence",
        "title": "Senior engineer · Managing partner",
        "company": "WRLD Tech Co. · WRLD Inc.",
        "email": "ridge@wrld.tech",
        "office": ("469.299.9598 x107", "tel:+14692999598,107"),
        "direct": ("972.536.6559", "tel:+19725366559"),
    },
}

INK, BODY, MUTED, RULE = T["mono950"], T["mono700"], T["mono500"], T["mono200"]
ACCENT = T["accentPrimary"]


def esc(s): return html.escape(s, quote=True)


def a(label, href, color=INK, weight=400, extra=""):
    return (f'<a href="{esc(href)}" target="_blank" style="color:{color};text-decoration:none;'
            f'font-weight:{weight};{extra}">{esc(label)}</a>')


def eyebrow(text, color=MUTED):
    return (f'<span style="font-family:{FONT_DISPLAY};font-size:9px;line-height:12px;font-weight:600;'
            f'letter-spacing:0.12em;text-transform:uppercase;color:{color};">{esc(text)}</span>')


def dot(color=T["mono300"]):
    return f'<span style="color:{color};">&nbsp;&middot;&nbsp;</span>'


SEP = "&nbsp;&nbsp;&nbsp;"  # link rows read as spaced words, no separators


def joined(items, color=INK, weight=400):
    return SEP.join(a(l, h, color, weight) for l, h in items)


def table(rows, width=None, extra=""):
    w = f' width="{width}"' if width else ""
    mw = f"max-width:{width}px;" if width else ""
    return (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"{w} '
            f'style="border-collapse:collapse;{mw}{extra}">{rows}</table>')


def td(content, style=""):
    return f'<td style="font-family:{FONT_BODY};font-size:12px;line-height:18px;color:{BODY};{style}">{content}</td>'


def tr(*cells): return "<tr>" + "".join(cells) + "</tr>"


def gap(h): return tr(f'<td style="height:{h}px;line-height:{h}px;font-size:0;">&nbsp;</td>')


def name_block(p, size=16, color=INK, sub=BODY):
    return (f'<div style="font-family:{FONT_DISPLAY};font-size:{size}px;line-height:{size + 4}px;font-weight:600;'
            f'letter-spacing:-0.01em;color:{color};">{esc(p["name"])}</div>'
            f'<div style="font-family:{FONT_BODY};font-size:12px;line-height:18px;color:{sub};">{esc(p["title"])}</div>')


def contact_rows(p, label_color=MUTED, value_color=INK):
    rows = [("Email", p["email"], f"mailto:{p['email']}"), ("Office", *p["office"]), ("Direct", *p["direct"])]
    out = ""
    for label, value, href in rows:
        out += tr(td(eyebrow(label, label_color), "width:56px;vertical-align:baseline;padding:1px 0;"),
                  td(a(value, href, value_color), "padding:1px 0;"))
    out += tr(td(eyebrow("Visit", label_color), "width:56px;vertical-align:baseline;padding:1px 0;"),
              td(a(ADDRESS, MAP_URL, value_color), "padding:1px 0;"))
    return table(out)


BUTTONS = {  # bg, fg, border
    "ink": (INK, T["mono0"], INK),
    "accent": (ACCENT, T["mono0"], ACCENT),  # Directory: the one CTA we want people drawn to
}


def button(label, href, kind="ink", padx=14):
    bg, fg, border = BUTTONS[kind]
    weight = 600 if kind == "accent" else 500
    return (f'<td bgcolor="{bg}" style="background-color:{bg};border:1px solid {border};border-radius:{R_SMALL}px;'
            f'mso-padding-alt:7px {padx}px;"><a href="{esc(href)}" target="_blank" style="display:inline-block;'
            f'font-family:{FONT_BODY};font-size:12px;line-height:16px;font-weight:{weight};color:{fg};text-decoration:none;'
            f'padding:7px {padx}px;border-radius:{R_SMALL}px;white-space:nowrap;">{esc(label)}&nbsp;&rarr;</a></td>')


def buttons(design, slug, padx=14):
    return table(tr(button(SCHEDULE[0], utm(SCHEDULE[1], SCHEDULE[2], design, slug), "ink", padx),
                    '<td style="width:8px;font-size:0;">&nbsp;</td>',
                    button(DIRECTORY[0], utm(DIRECTORY[1], DIRECTORY[2], design, slug), "accent", padx)))


def logo(src, width, alt="WRLD Tech", href="https://wrld.tech"):
    h = round(width * 173 / 999)
    return (f'<a href="{href}" target="_blank" style="text-decoration:none;"><img src="{src}" width="{width}" height="{h}" '
            f'alt="{alt}" style="display:block;width:{width}px;height:auto;border:0;font-family:{FONT_DISPLAY};'
            f'font-size:13px;font-weight:700;color:{INK};"></a>')


def mark(size):
    """Starburst on an ink tile. The PNG runs blade-to-edge, so the tile adds MARK_PAD of ink around it."""
    inner = size - 2 * MARK_PAD
    img = (f'<a href="https://wrld.tech" target="_blank" style="text-decoration:none;"><img src="{MARK_TILE}" '
           f'width="{inner}" height="{inner}" alt="WRLD" style="display:block;width:{inner}px;height:{inner}px;border:0;"></a>')
    return table(tr(f'<td bgcolor="{INK}" style="background-color:{INK};padding:{MARK_PAD}px;border-radius:{R_MAX}px;'
                    f'font-size:0;line-height:0;">{img}</td>'), extra="border-collapse:separate;")


def rule(color=RULE): return tr(f'<td style="border-top:1px solid {color};font-size:0;line-height:0;height:1px;">&nbsp;</td>')


def icon(src, size, alt):
    return (f'<img src="{src}" width="{size}" height="{size}" alt="{esc(alt)}" style="display:block;width:{size}px;'
            f'height:{size}px;border:0;font-family:{FONT_BODY};font-size:9px;color:{MUTED};">')


def social_icons(style, label=None):
    """Icon row as a table so Outlook keeps spacing. style: line | tile."""
    size, pad, kind = (16, 12, "line") if style == "line" else (22, 6, "tile")
    cells = ""
    if label:
        cells += f'<td style="vertical-align:middle;padding-right:10px;font-family:{FONT_BODY};font-size:11px;color:{MUTED};">{label}</td>'
    for (name, href), key in zip(SOCIALS, SOCIAL_KEYS):
        cells += (f'<td style="vertical-align:middle;padding-right:{pad}px;font-size:0;line-height:0;">'
                  f'<a href="{esc(href)}" target="_blank" title="{esc(name)}" style="text-decoration:none;">'
                  f'{icon(f"{SIG_ASSETS}/social-{kind}-{key}.png", size, name)}</a></td>')
    return table(tr(cells))


def link_rows(socials, font=11):
    """Round 1 link block: properties then socials. Text keeps them on one spaced line; icons get their own row."""
    if socials == "text":
        return tr(td(joined(PROPERTIES, weight=500) + SEP + joined(SOCIALS, MUTED), f"font-size:{font}px;"))
    return tr(td(joined(PROPERTIES, weight=500), f"font-size:{font}px;")) + gap(4) + tr(td(social_icons(socials)))


def confidentiality(width):
    return (f'<div style="max-width:{width}px;padding-top:12px;font-family:{FONT_MONO};font-size:10px;line-height:16px;'
            f'font-style:italic;color:{T["mono400"]};">{esc(CONFIDENTIALITY)}</div>')


def band_name(p):
    return (f'<div style="font-family:{FONT_DISPLAY};font-size:15px;line-height:19px;font-weight:600;color:{T["mono0"]};">'
            f'{esc(p["name"])}</div><div style="font-family:{FONT_BODY};font-size:11px;line-height:16px;color:{T["mono400"]};">'
            f'{esc(p["title"])}</div>')


def card(band, body, width):
    """Ink band over an explicit white body (bgcolor for Outlook) so it reads as a card on grey or dark panes.
    No outer fill: it shows as square white corners behind the rounded band."""
    return table(
        tr(td(band, f"background-color:{INK};padding:14px 18px;border-radius:{R_MAX}px {R_MAX}px 0 0;")
           .replace("<td ", f'<td bgcolor="{INK}" ', 1))
        + tr(td(body, f"background-color:{T['mono0']};padding:14px 18px 16px;border:1px solid {RULE};"
                      f"border-top:0;border-radius:0 0 {R_MAX}px {R_MAX}px;").replace("<td ", f'<td bgcolor="{T["mono0"]}" ', 1)),
        width)


# ---- Round 1 directions -----------------------------------------------------------------------

def split_stack(p, slug, socials="text"):
    """Logo column, hairline divider, details column. Closest to the current layout."""
    left = td(mark(56) + f'<div style="height:10px;font-size:0;">&nbsp;</div>' + logo(LOGO_BLACK, 96),
              "vertical-align:top;width:96px;padding-right:20px;")
    links = (tr(td(joined(PROPERTIES, weight=500))) + tr(td(joined(SOCIALS, MUTED), "font-size:11px;"))
             if socials == "text" else
             tr(td(joined(PROPERTIES, weight=500))) + gap(4) + tr(td(social_icons(socials))))
    right = table(
        tr(td(name_block(p))) + tr(td(eyebrow(p["company"]), "padding-top:2px;")) + gap(10)
        + tr(td(contact_rows(p))) + gap(10) + links + gap(12) + tr(td(buttons("split-stack", slug, 11))))
    divider = f'<td style="width:1px;background-color:{RULE};font-size:0;">&nbsp;</td>'
    return table(tr(left, divider, td(right, "vertical-align:top;padding-left:20px;")), 500) + confidentiality(500)


def ledger_line(p, slug, socials="text"):
    """Single column, rules between groups. Reads well narrow; mirrors the ledger email direction."""
    return table(
        tr(td(logo(LOGO_BLACK, 132))) + gap(14)
        + tr(td(name_block(p, 17))) + tr(td(eyebrow(p["company"]), "padding-top:2px;")) + gap(12)
        + rule() + gap(10) + tr(td(contact_rows(p))) + gap(10) + rule() + gap(8)
        + link_rows(socials) + gap(12) + tr(td(buttons("ledger-line", slug))), 440) + confidentiality(440)


def signal_strip(p, slug, socials="text"):
    """Dark band with the white lockup and name, light body below. Mirrors the signal email direction."""
    band = table(tr(td(logo(LOGO_WHITE, 112), "vertical-align:middle;"),
                    td(band_name(p), "vertical-align:middle;text-align:right;")), extra="width:100%;")
    body = table(
        tr(td(eyebrow(p["company"]))) + gap(8) + tr(td(contact_rows(p))) + gap(10)
        + link_rows(socials) + gap(12) + tr(td(buttons("signal-strip", slug))), extra="width:100%;")
    return card(band, body, 480) + confidentiality(480)


def minimal_mark(p, slug, socials="text"):
    """Mark tile plus three tight lines. Built for replies and mobile; dark-mode safe end to end."""
    contacts = (a(p["email"], f"mailto:{p['email']}") + dot() + a("O " + p["office"][0], p["office"][1])
                + dot() + a("D " + p["direct"][0], p["direct"][1]))
    links = (joined(PROPERTIES, weight=500) + SEP + a("Schedule", utm(SCHEDULE[1], SCHEDULE[2], "minimal-mark", slug), INK, 500)
             + SEP + a("WRLD Directory", utm(DIRECTORY[1], DIRECTORY[2], "minimal-mark", slug), ACCENT, 600))
    social_row = (tr(td(joined(SOCIALS, MUTED), "font-size:10px;")) if socials == "text"
                  else gap(4) + tr(td(social_icons(socials))))
    right = table(
        tr(td(f'<span style="font-family:{FONT_DISPLAY};font-size:14px;font-weight:600;color:{INK};">{esc(p["name"])}</span>'
              f'<span style="color:{MUTED};">&nbsp;&nbsp;{esc(p["title"])}</span>'))
        + tr(td(eyebrow(p["company"])))
        + tr(td(contacts, "font-size:11px;padding-top:4px;"))
        + tr(td(a(ADDRESS, MAP_URL, MUTED), "font-size:11px;"))
        + tr(td(links, "font-size:11px;"))
        + social_row)
    return table(tr(td(mark(48), "vertical-align:top;padding-right:14px;"), td(right, "vertical-align:top;")), 460) \
        + confidentiality(460)


# ---- Round 2: signal strip with the human-written badge ---------------------------------------

def badge_cells(icon_key, label_color, size=14):
    """Icon + eyebrow label as two cells so Outlook keeps them on one baseline. Accent lives only in the icon."""
    img = icon(f"{SIG_ASSETS}/human-{icon_key}.png", size, "")
    return (f'<td style="vertical-align:middle;padding-right:6px;font-size:0;line-height:0;">{img}</td>'
            f'<td style="vertical-align:middle;white-space:nowrap;">{eyebrow(BADGE_LABEL, label_color)}</td>')


def badge_tag(icon_key):
    """Annotation 1: outlined tag, top right of the body. Separate borders: collapsed tables ignore radius."""
    inner = table(tr(badge_cells(icon_key, INK)))
    return table(tr(f'<td style="border:1px solid {T["mono300"]};border-radius:{R_SMALL}px;padding:3px 10px 3px 8px;">{inner}</td>'),
                 extra="border-collapse:separate;margin-left:auto;")


def badge_band(icon_key):
    """Annotation 2: bare icon + label under the white lockup on the ink band."""
    return table(tr(badge_cells(icon_key, T["mono400"], 13)))


def properties_row():
    sep = f'<span style="color:{T["mono300"]};">&nbsp;||&nbsp;</span>'
    return f'<span style="color:{MUTED};">www.</span>&nbsp;' + sep.join(a(l, h, INK, 600) for l, h in PROPERTIES)


def follow_row(socials):
    label = f'<span style="color:{MUTED};">follow:</span>'
    if socials == "text":
        sep = f'<span style="color:{T["mono300"]};">&nbsp;|&nbsp;</span>'
        return td(label + "&nbsp;" + sep.join(a(l, h, MUTED) for l, h in SOCIALS), "font-size:11px;")
    return td(social_icons(socials, label))


def signal_strip_v2(p, slug, socials="text", badge="body", icon_key="user-pen"):
    """Signal strip plus the Nov 2026 review: human-written badge (body or band), split link rows,
    social style, confidentiality footer. Logo stays vertically centred in the band like round 1."""
    design = f"signal-strip-v2-{badge}"
    left = logo(LOGO_WHITE, 112)
    if badge == "band":
        left += f'<div style="height:8px;line-height:8px;font-size:0;">&nbsp;</div>' + badge_band(icon_key)
    band = table(tr(td(left, "vertical-align:middle;"),
                    td(band_name(p), "vertical-align:middle;text-align:right;")), extra="width:100%;")
    top = (table(tr(td(eyebrow(p["company"]), "vertical-align:middle;"),
                    td(badge_tag(icon_key), "vertical-align:middle;text-align:right;")), extra="width:100%;")
           if badge == "body" else eyebrow(p["company"]))
    body = table(
        tr(td(top)) + gap(8) + tr(td(contact_rows(p))) + gap(10)
        + tr(td(properties_row(), "font-size:12px;")) + gap(2) + tr(follow_row(socials))
        + gap(12) + tr(td(buttons(design, slug))), extra="width:100%;")
    return card(band, body, 480) + confidentiality(480)


# ---- Catalogue --------------------------------------------------------------------------------
# key: (title, blurb, render, badge position or None, dark mode by social style)
DESIGNS = {
    "signal-strip-v2-body": ("Option A: badge in the body",
                             "Annotation 1. Outlined tag, top right of the white body, accent only on the icon.",
                             lambda p, s, so, ik: signal_strip_v2(p, s, so, "body", ik), "body",
                             ("Safe", "Partial", "Safe")),
    "signal-strip-v2-band": ("Option B: badge under the logo",
                             "Annotation 2. Badge sits under the lockup on the ink band, block centred against the name.",
                             lambda p, s, so, ik: signal_strip_v2(p, s, so, "band", ik), "band",
                             ("Safe", "Partial", "Safe")),
    "split-stack": ("Split stack", "Mark and lockup on the left, details on the right. Closest to today's layout.",
                    lambda p, s, so, ik: split_stack(p, s, so), None, ("Partial", "Partial", "Partial")),
    "ledger-line": ("Ledger line", "One column with hairline rules. Calm, narrow, mobile-friendly.",
                    lambda p, s, so, ik: ledger_line(p, s, so), None, ("At risk", "At risk", "At risk")),
    "signal-strip": ("Signal strip", "Ink band with the white lockup. The boldest; matches the signal email direction.",
                     lambda p, s, so, ik: signal_strip(p, s, so), None, ("Safe", "Partial", "Safe")),
    "minimal-mark": ("Minimal mark", "Mark tile and three lines. For replies and threads.",
                     lambda p, s, so, ik: minimal_mark(p, s, so), None, ("Safe", "Partial", "Safe")),
}
DARK_NOTE = {
    "Safe": "Holds up when a client darkens the message.",
    "Partial": "Grey text or icons on transparent PNGs can dim when a client darkens the message.",
    "At risk": "Black lockup on a transparent PNG; clients that darken the page without touching images hide it.",
}


def variant_key(design, socials, icon_key):
    return f"{design}|{socials}|{icon_key if DESIGNS[design][3] else 'none'}"


def variant_path(slug, design, socials, icon_key):
    name = socials + (f"-{icon_key}" if DESIGNS[design][3] else "")
    return f"email/signatures/{slug}/{design}/{name}.html"


def all_variants(slug):
    p, out = PEOPLE[slug], {}
    for d, (_, _, fn, badge, _) in DESIGNS.items():
        for so in SOCIAL_STYLES:
            for ik in (BADGE_ICONS if badge else ["none"]):
                out[variant_key(d, so, ik)] = (variant_path(slug, d, so, ik), fn(p, slug, so, ik))
    return out


def wrap(sig):
    # data-spark-custom-html keeps Spark from re-flowing the markup, same as the original signature.
    return f'<div data-spark-custom-html="true"><div dir="auto">{sig}</div></div>\n'


def seg_group(label, attr, options, current):
    btns = "".join(f'<button type="button" class="seg{" on" if k == current else ""}" data-{attr}="{k}" '
                   f'aria-pressed="{str(k == current).lower()}">{v}</button>' for k, v in options.items())
    return f'<div class="segs" role="group" aria-label="{label}">{btns}</div>'


def build_index(slug="ridgeway-lawrence"):
    """Review page. Artifacts block remote images, so previews swap in data: copies of the same
    wrld.design PNGs client side; the copy buttons hand out the real hotlinked HTML."""
    import base64, json
    repo = Path(__file__).parent.parent / "assets"
    local = {LOGO_BLACK: repo / "logos" / "wrld-tech-black.png", LOGO_WHITE: repo / "logos" / "wrld-tech-white.png",
             MARK_TILE: repo / "logos" / "favicons" / "favicon-256x256.png"}
    for f in sorted((repo / "email" / "signature").glob("*.png")):
        local[f"{SIG_ASSETS}/{f.name}"] = f
    assets = {url: "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode() for url, p in local.items()}
    variants = all_variants(slug)

    def card_html(d):
        title, blurb, _, badge, dark = DESIGNS[d]
        return f"""<article class="card" data-design="{d}" data-social="text" data-dark="{'|'.join(dark)}">
  <header><h2>{esc(title)}</h2><span class="chip" data-chip></span></header>
  <p class="blurb">{esc(blurb)}</p>
  <div class="ctrls">{seg_group("Social links", "social", SOCIAL_STYLES, "text")}</div>
  <div class="mail"><div class="mail-body">Thanks, talk soon.</div><div class="mail-sig" data-preview></div></div>
  <p class="note" data-note></p>
  <div class="actions"><button type="button" data-copy data-mode="rich">Copy signature</button><button type="button" class="ghost" data-copy data-mode="html">Copy HTML</button><span class="status" aria-live="polite"></span></div>
  <p class="path" data-path></p>
</article>"""

    icon_btns = "".join(
        f'<button type="button" class="seg{" on" if i == 0 else ""}" data-icon="{k}" aria-pressed="{str(i == 0).lower()}">'
        f'<img src="{assets[f"{SIG_ASSETS}/human-{k}.png"]}" width="14" height="14" alt="">{esc(v)}</button>'
        for i, (k, v) in enumerate(BADGE_ICONS.items()))
    round2 = "\n".join(card_html(d) for d, v in DESIGNS.items() if v[3])
    round1 = "\n".join(card_html(d) for d, v in DESIGNS.items() if not v[3])
    data = {"sigs": {k: s for k, (_, s) in variants.items()}, "paths": {k: p for k, (p, _) in variants.items()},
            "assets": assets, "notes": DARK_NOTE}
    page = (INDEX.replace("{{ICONS}}", icon_btns).replace("{{ROUND2}}", round2).replace("{{ROUND1}}", round1)
            .replace("{{DATA}}", json.dumps(data).replace("</", "<\\/")))
    out = Path(__file__).parent / "dist" / "signatures.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    print(f"wrote {out}")


INDEX = """<title>WRLD email signatures</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&family=Ubuntu:wght@400;500&family=Ubuntu+Mono&display=swap">
<style>
/* Layout: one reading column; review cards in a two-up grid, each holding a white message pane, since signatures land on message bodies. */
:root {
  --bg: #fafafa; --surface: #ffffff; --fg: #0a0a0a; --muted: #71717a; --rule: #e4e4e7; --pane: #ffffff;
  --ok: #10b981; --warn: #f59e0b; --bad: #ef4444; --accent: #007fee;
  --display: Montserrat, 'Helvetica Neue', Arial, sans-serif; --body: Ubuntu, system-ui, -apple-system, sans-serif;
  --mono: 'Ubuntu Mono', ui-monospace, Menlo, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #0a0a0a; --surface: #18181b; --fg: #fafafa; --muted: #a1a1aa; --rule: #27272a; color-scheme: dark } }
:root[data-theme="dark"] { --bg: #0a0a0a; --surface: #18181b; --fg: #fafafa; --muted: #a1a1aa; --rule: #27272a; color-scheme: dark }
body { background: var(--bg); color: var(--fg); font-family: var(--body); font-size: 15px; line-height: 1.6; }
.wrap { max-width: 1120px; margin: 0 auto; padding-block: 48px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 32px; }
.eyebrow { font-family: var(--display); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin: 0; }
h1 { font-family: var(--display); font-weight: 600; font-size: clamp(26px, 4vw, 36px); line-height: 1.15; letter-spacing: -0.02em; margin: 6px 0 10px; text-wrap: balance; }
.lede { max-width: 64ch; margin: 0; color: var(--muted); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 520px), 1fr)); gap: 20px; }
.card { background: var(--surface); border: 1px solid var(--rule); border-radius: 8px; padding: 20px; display: grid; gap: 12px; align-content: start; min-width: 0; }
.card header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
h2 { font-family: var(--display); font-size: 18px; font-weight: 600; letter-spacing: -0.01em; margin: 0; text-wrap: balance; }
.blurb, .note { margin: 0; } .note { font-size: 13px; color: var(--muted); }
.chip { font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--rule); white-space: nowrap; }
.chip::before { content: ""; display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 6px; vertical-align: 1px; }
.chip-safe::before { background: var(--ok); } .chip-partial::before { background: var(--warn); } .chip-at-risk::before { background: var(--bad); }
.mail { background: var(--pane); color: #0a0a0a; border: 1px solid var(--rule); border-radius: 4px; padding: 20px; overflow-x: auto; }
.mail-body { font-size: 14px; color: #3f3f46; padding-bottom: 14px; margin-bottom: 16px; border-bottom: 1px dashed #e4e4e7; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
button { font: 500 13px/1 var(--body); padding: 9px 14px; border-radius: 4px; border: 1px solid var(--fg); background: var(--fg); color: var(--bg); cursor: pointer; transition: box-shadow 120ms cubic-bezier(0.2,0.8,0.2,1); }
button.ghost { background: transparent; color: var(--fg); border-color: var(--rule); }
button:hover { box-shadow: 0 6px 24px rgba(0,127,238,0.18); } button:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(0,127,238,0.28); }
.status { font-size: 13px; color: var(--muted); }
.path { margin: 0; font: 13px var(--mono); color: var(--muted); overflow-wrap: anywhere; }
.section { display: grid; gap: 16px; }
.section + .section { padding-top: 32px; border-top: 1px solid var(--rule); }
.h2big { font-size: 24px; margin: 6px 0 8px; }
.segs { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.ctrls { display: flex; flex-wrap: wrap; gap: 8px 16px; }
button.seg { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: var(--fg); border-color: var(--rule); padding: 7px 12px; }
button.seg.on { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
button.seg img { display: block; }
.notes { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 20px; }
.notes section { border-top: 1px solid var(--rule); padding-top: 14px; min-width: 0; }
.notes h3 { font-family: var(--display); font-size: 15px; font-weight: 600; margin: 0 0 6px; }
.notes ul, .notes ol { margin: 0; padding-left: 18px; color: var(--muted); font-size: 14px; }
.notes li + li { margin-top: 4px; }
code { font-family: var(--mono); font-size: 0.95em; }
@media (prefers-reduced-motion: reduce) { button { transition: none; } }
</style>
<div class="wrap">
  <div>
    <p class="eyebrow">wrld.design / email signatures</p>
    <h1>Ridgeway's signature, six designs</h1>
    <p class="lede">Every design now carries WRLD.one, the confidentiality statement, an accent Directory button with full UTMs, and a choice of text, line-icon or ink-tile social links. Pick a social style on each card; Copy hands out exactly the version you see.</p>
  </div>
  <section class="section" aria-labelledby="r2">
    <div>
      <p class="eyebrow">Round 2 / signal strip with the human-written badge</p>
      <h2 id="r2" class="h2big">Badge in the body or under the logo</h2>
      <p class="lede">Properties and socials sit on their own rows (www. WRLD.tech || WRLD.host || WRLD.one, then follow:). The badge icon below applies to both options.</p>
    </div>
    <div class="segs" role="group" aria-label="Badge icon">{{ICONS}}</div>
    <div class="grid">
{{ROUND2}}
    </div>
  </section>
  <section class="section" aria-labelledby="r1">
    <div>
      <p class="eyebrow">Round 1 / original directions, updated</p>
      <h2 id="r1" class="h2big">Split stack, ledger line, signal strip, minimal mark</h2>
      <p class="lede">Same layouts as round 1. The starburst tile now has 5px of ink around the mark so the blades clear the edges.</p>
    </div>
    <div class="grid">
{{ROUND1}}
    </div>
  </section>
  <div class="notes">
    <section><h3>What changed in this pass</h3><ul>
      <li>Corners: 3px on the badge tag and buttons, 4px cap on cards and tiles.</li>
      <li>Directory button: accent <code>#007fee</code> fill, white text. White on that blue is about 4:1, a touch under the 4.5:1 AA line for 12px text, so it is set semibold.</li>
      <li>Both CTAs carry <code>utm_source=emailsignature</code>, <code>utm_medium=email</code>, <code>utm_campaign</code> (schedule-meeting or wrld-directory), <code>utm_content</code> (the design) and <code>utm_term</code> (the person).</li>
      <li>Signal strip logo stays vertically centred in the band on every variant.</li>
      <li>Icons are PNGs at 3x in <code>assets/email/signature/</code>, hotlinked from wrld.design. They load once the PR merges.</li>
    </ul></section>
    <section><h3>Icon sources</h3><ul>
      <li>Line icons are Lucide 0.544, the last release with brand glyphs (1.x dropped them).</li>
      <li>X is the Simple Icons glyph; Teams uses Lucide users-round, since neither set ships a Microsoft mark.</li>
      <li>Ink tiles carry their own background, so they hold up in dark mode. Grey line icons can dim.</li>
    </ul></section>
    <section><h3>Install</h3><ol>
      <li>Spark: Settings, Signatures, then paste Copy HTML into the HTML editor.</li>
      <li>Outlook: Copy signature (rich text), then Settings, Mail, Compose and reply, new signature, paste.</li>
      <li>Send a test to an Outlook and a Gmail address before rolling it out.</li>
    </ol></section>
  </div>
</div>
<script id="data" type="application/json">{{DATA}}</script>
<script>
const D = JSON.parse(document.getElementById('data').textContent);
const WRAP = h => '<div data-spark-custom-html="true"><div dir="auto">' + h + '</div></div>';
const STYLES = ['text', 'line', 'tile'];
let badgeIcon = document.querySelector('button[data-icon]').dataset.icon;
const keyFor = c => { const k = c.dataset.design + '|' + c.dataset.social + '|'; return D.sigs[k + badgeIcon] ? k + badgeIcon : k + 'none'; };
const preview = h => { for (const [u, d] of Object.entries(D.assets)) h = h.split(u).join(d); return h; };
function render() {
  document.querySelectorAll('.card[data-design]').forEach(c => {
    const k = keyFor(c);
    c.querySelector('[data-preview]').innerHTML = preview(D.sigs[k]);
    c.querySelector('[data-path]').textContent = D.paths[k];
    const state = c.dataset.dark.split('|')[STYLES.indexOf(c.dataset.social)];
    const chip = c.querySelector('[data-chip]');
    chip.className = 'chip chip-' + state.toLowerCase().replace(' ', '-'); chip.textContent = 'Dark mode: ' + state;
    c.querySelector('[data-note]').textContent = D.notes[state];
  });
}
function selectFallback(html) {
  const ta = document.createElement('textarea');
  ta.value = html; document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove(); return ok;
}
function press(btn) {
  btn.parentElement.querySelectorAll('.seg').forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
}
document.addEventListener('click', async e => {
  const seg = e.target.closest('button.seg');
  if (seg) {
    if (seg.dataset.icon) badgeIcon = seg.dataset.icon;
    else seg.closest('.card').dataset.social = seg.dataset.social;
    press(seg); render(); return;
  }
  const btn = e.target.closest('button[data-copy]'); if (!btn) return;
  const html = WRAP(D.sigs[keyFor(btn.closest('.card'))]);
  const status = btn.parentElement.querySelector('.status');
  let ok = false;
  try {
    if (btn.dataset.mode === 'rich' && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({'text/html': new Blob([html], {type: 'text/html'}), 'text/plain': new Blob([html], {type: 'text/plain'})})]);
    } else { await navigator.clipboard.writeText(html); }
    ok = true;
  } catch (err) { ok = selectFallback(html); }
  status.textContent = ok ? (btn.dataset.mode === 'rich' ? 'Copied. Paste into your signature editor.' : 'HTML copied.') : 'Copy blocked here. Use the file path below.';
});
render();
</script>
"""


def main():
    for slug in PEOPLE:
        n = 0
        for path, sig in all_variants(slug).values():
            out = Path(__file__).parent.parent / path
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(wrap(sig), encoding="utf-8")
            n += 1
        print(f"wrote {n} variants to {ROOT / slug}")
    build_index()


if __name__ == "__main__":
    main()
