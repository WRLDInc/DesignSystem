#!/usr/bin/env python3
"""
WRLD transactional email design system - generator.

Outputs:
  dist/mockups/<direction>/<platform>-<template>.html   (sample data, for preview/screenshots)
  dist/templates/<platform>/...                         (copy/paste-ready with platform variables)
  dist/index.html                                       (spec page with live previews)

Directions: ledger | signal | thread
Platforms:  syncro | gleap | whmcs
"""
import os, json, html, re, textwrap
from pathlib import Path

ROOT = Path(__file__).parent
DIST = ROOT / "dist"

# ---------------------------------------------------------------------------
# Tokens (from WRLDInc/DesignSystem tokens.json)
# ---------------------------------------------------------------------------
T = {
    "mono0": "#ffffff", "mono50": "#fafafa", "mono100": "#f4f4f5", "mono200": "#e4e4e7",
    "mono300": "#d4d4d8", "mono400": "#a1a1aa", "mono500": "#71717a", "mono600": "#52525b",
    "mono700": "#3f3f46", "mono800": "#27272a", "mono900": "#18181b", "mono950": "#0a0a0a",
    "accentPrimary": "#007fee", "accentSecondary": "#00adee", "accentWarm": "#EE9300",
    "success": "#10b981", "warning": "#f59e0b", "danger": "#ef4444", "info": "#3b82f6",
}
FONT_DISPLAY = "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif"
FONT_BODY = "Ubuntu,'Helvetica Neue',Helvetica,Arial,sans-serif"
FONT_MONO = "'Ubuntu Mono',Menlo,Consolas,monospace"
GOOGLE_FONTS = "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Ubuntu:wght@400;500;700&family=Ubuntu+Mono:wght@400;700&display=swap"

# Placeholders the operator replaces once per platform (see README)
# WRLD.TECH lockups, hotlinked from wrld.design (transparent 999x173 PNGs, served by Cloudflare).
# Replace with dedicated email-sized exports when they exist; the paths are the contract.
LOGO_LIGHT = "https://wrld.design/assets/logos/wrld-tech-black.png"   # for light backgrounds
LOGO_DARK = "https://wrld.design/assets/logos/wrld-tech-white.png"    # for dark mode / dark bands
LOGO_RATIO = 173 / 999

# Social profiles, confirmed by Ridge 2026-09-23. Text links, not icons: they survive image
# blocking (Spark, Outlook) and dark mode, unlike Syncro's {{gray_social_links}} icon images.
SOCIALS = [
    ("LinkedIn", "https://www.linkedin.com/company/wrldtech"),
    ("Facebook", "https://www.facebook.com/wrldtechco"),
    ("X", "https://x.com/wrldtechco"),
]

BRANDS = {
    "tech": {
        "id": "tech", "entity": "WRLD Tech Co.", "product": "WRLD.Support",
        "site": "https://wrld.tech", "site_label": "wrld.tech",
        "portal": "https://wrld.syncromsp.com/my_profile/v2/index", "portal_label": "Support portal",
        "email": "helpdesk@wrld.tech", "accent": T["accentPrimary"],
        "phone_sla": "469.850.3968", "phone_sla_tel": "+14698503968",
        "phone_std": "469.299.9598", "phone_std_tel": "+14692999598",
        "hours": "Priority SLA line 24/7 for covered clients. Standard line Mon-Fri 9am-6pm CT.",
        "socials": SOCIALS,
    },
    "host": {
        "id": "host", "entity": "WRLD Inc.", "product": "WRLD.host",
        "site": "https://wrld.host", "site_label": "wrld.host",
        "portal": "https://wrld.host/clientarea.php", "portal_label": "Client area",
        "email": "support@wrld.host", "accent": T["accentSecondary"],
        "phone_sla": None, "phone_sla_tel": None,
        "phone_std": "469.299.9598", "phone_std_tel": "+14692999598",
        "hours": "Web support 24/7 at wrld.host. Phone Mon-Fri 9am-6pm CT.",
        "socials": SOCIALS,
    },
}
ADDRESS = "4707 Algiers St. Ste 101, Dallas, TX 75207"
LEGAL_LINKS = [("Terms", "https://wrld.tech/tos"), ("Privacy", "https://wrld.tech/privacy")]

# ---------------------------------------------------------------------------
# Low-level helpers
# ---------------------------------------------------------------------------
def esc(s): return html.escape(s, quote=True)

def spacer(h):
    return f'<tr><td style="height:{h}px;line-height:{h}px;font-size:0;">&nbsp;</td></tr>'

def css(direction):
    """Head CSS: fonts, resets, responsive, dark mode. Inline styles carry the design; this is enhancement."""
    return f"""
<!--[if !mso]><!-->
<link href="{GOOGLE_FONTS}" rel="stylesheet" type="text/css">
<!--<![endif]-->
<style>
  :root {{ color-scheme: light dark; supported-color-schemes: light dark; }}
  html, body {{ margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }}
  * {{ -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }}
  table, td {{ mso-table-lspace:0pt !important; mso-table-rspace:0pt !important; border-collapse:collapse !important; }}
  img {{ -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }}
  a {{ text-decoration:none; }}
  a[x-apple-data-detectors] {{ color:inherit !important; text-decoration:none !important; }}
  .wrld-body p {{ margin:0 0 12px 0; }}
  .wrld-body p:last-child {{ margin-bottom:0; }}
  .wrld-body ul, .wrld-body ol {{ margin:0 0 12px 22px; padding:0; }}
  .wrld-body pre, .wrld-body code {{ font-family:{FONT_MONO}; font-size:13px; }}
  .wrld-body img {{ max-width:100%; height:auto; }}
  .wrld-body blockquote {{ margin:0 0 12px 0; padding:0 0 0 12px; border-left:2px solid {T['mono200']}; color:{T['mono600']}; }}
  /* History injected by platform tags. Syncro emits TWO divs per comment: a header div (name p with
     line-height 0, then a small date) and a body div. Both are reset, then one rule is drawn per comment. */
  .wrld-history .wrld-msg {{ border-top:1px solid {T['mono200']} !important; padding:14px 0 !important; margin:0 !important; }}
  .wrld-history .wrld-msg:first-child {{ border-top:0 !important; padding-top:0 !important; }}
  /* No child combinators anywhere in this sheet. Syncro HTML-escapes the greater-than sign inside the
     wrapper style block, which silently drops the whole rule. Syncro comment divs are matched by inline style. */
  .wrld-history-syncro div[style*="#ddd"] {{ border:0 !important; margin:0 !important; }}
  .wrld-history-syncro div[style*="border-top: 1px #ddd"] {{ border-top:1px solid {T['mono200']} !important; padding:14px 0 0 0 !important; }}
  .wrld-history-syncro div[style*="border-bottom: 1px #ddd"] {{ padding:6px 0 14px 0 !important; }}
  .wrld-history-syncro div:first-child[style*="border-top: 1px #ddd"] {{ border-top:0 !important; padding-top:0 !important; }}
  .wrld-history p {{ margin:0 0 8px 0 !important; line-height:1.5 !important; color:{T['mono600']}; }}
  .wrld-history p[style*="font-weight:600"], .wrld-history p[style*="font-weight: 600"] {{ line-height:1.4 !important; color:{T['mono900']} !important; font-size:13px; margin:0 0 2px 0 !important; }}
  .wrld-history small {{ display:block; font-size:12px; line-height:16px; color:{T['mono500']} !important; }}
  .wrld-history blockquote {{ margin:0 0 8px 0; padding:0 0 0 12px; border-left:2px solid {T['mono200']}; }}
  .wrld-history img {{ max-width:100%; height:auto; }}
  .wrld-history hr {{ display:none; }}
  /* Line-item rows injected by Syncro tags (purchase order email). Bare tr/td, so style by descendant. */
  .wrld-items td {{ padding:8px 6px; border-bottom:1px solid {T['mono200']}; font-size:13px; line-height:18px; vertical-align:top; color:{T['mono950']}; }}
  @media only screen and (max-width: 620px) {{
    .container {{ width:100% !important; max-width:100% !important; }}
    .px {{ padding-left:16px !important; padding-right:16px !important; }}
    .stack {{ display:block !important; width:100% !important; }}
    .stack-gap {{ padding-top:8px !important; }}
    .right-on-desktop {{ text-align:left !important; }}
    .hide-sm {{ display:none !important; max-height:0 !important; overflow:hidden !important; }}
    .btn-full {{ display:block !important; width:100% !important; text-align:center !important; box-sizing:border-box !important; }}
    .h1 {{ font-size:22px !important; line-height:28px !important; }}
    .meta-k {{ width:96px !important; }}
  }}
  @media (prefers-color-scheme: dark) {{
    .bg-page {{ background-color:{T['mono950']} !important; }}
    .bg-card {{ background-color:{T['mono900']} !important; border-color:{T['mono800']} !important; }}
    .bg-band {{ background-color:{T['mono900']} !important; }}
    .bg-muted {{ background-color:{T['mono800']} !important; }}
    .fg, .fg a, .h1, .wrld-body, .wrld-body p, .wrld-body li {{ color:{T['mono50']} !important; }}
    .fg-muted, .fg-muted a, .wrld-history p {{ color:{T['mono400']} !important; }}
    .fg-subtle {{ color:{T['mono500']} !important; }}
    .rule, .wrld-history .wrld-msg, .wrld-history blockquote, .wrld-history-syncro div[style*="border-top: 1px #ddd"] {{ border-color:{T['mono800']} !important; }}
    .wrld-history small {{ color:{T['mono500']} !important; }}
    .wrld-items td {{ border-color:{T['mono800']} !important; color:{T['mono50']} !important; }}
    .wrld-history p[style*="font-weight:600"], .wrld-history p[style*="font-weight: 600"] {{ color:{T['mono50']} !important; }}
    .btn {{ background-color:{T['mono50']} !important; }}
    .btn-a {{ color:{T['mono950']} !important; }}
    .btn-warm {{ background-color:{T['accentWarm']} !important; }}
    .btn-a-warm {{ color:{T['mono950']} !important; }}
    .meta-k {{ border-color:{T['mono800']} !important; }}
    .logo-light {{ display:none !important; }}
    .logo-dark {{ display:block !important; max-height:none !important; }}
    .chip {{ border-color:{T['mono700']} !important; }}
  }}
  [data-ogsc] .bg-page {{ background-color:{T['mono950']} !important; }}
  [data-ogsc] .bg-card {{ background-color:{T['mono900']} !important; }}
  [data-ogsc] .fg, [data-ogsc] .h1, [data-ogsc] .wrld-body p {{ color:{T['mono50']} !important; }}
  [data-ogsc] .fg-muted {{ color:{T['mono400']} !important; }}
  [data-ogsc] .logo-light {{ display:none !important; }}
  [data-ogsc] .logo-dark {{ display:block !important; max-height:none !important; }}
  [data-ogsc] .wrld-history p {{ color:{T['mono400']} !important; }}
  [data-ogsc] .wrld-history p[style*="font-weight:600"], [data-ogsc] .wrld-history p[style*="font-weight: 600"] {{ color:{T['mono50']} !important; }}
</style>"""

def head(title, direction, preheader=""):
    return f"""<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>{esc(title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
{css(direction)}
</head>"""

def preheader_block(text):
    if not text: return ""
    return f'<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:{T["mono100"]};">{text}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>'

def open_shell(preheader=""):
    return f"""<body class="bg-page" style="margin:0;padding:0;width:100%;background-color:{T['mono100']};">
{preheader_block(preheader)}
<center role="article" aria-roledescription="email" lang="en" style="width:100%;background-color:{T['mono100']};" class="bg-page">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="bg-page" style="background-color:{T['mono100']};">
<tr><td align="center" style="padding:24px 12px;">
<!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" align="center"><tr><td><![endif]-->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="container" style="width:100%;max-width:600px;margin:0 auto;">"""

def close_shell():
    return """</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</center>
</body>
</html>"""

def logo_img(brand, variant="light", width=132):
    """Two images, CSS-swapped for dark mode. Syncro/WHMCS callers may replace with platform logo tags."""
    if isinstance(brand, dict):
        alt = brand["entity"]
        # WRLD.HOST lockups are not on wrld.design yet, so those stay placeholders.
        LOGO_LIGHT = "{{WRLDHOST_LOGO_LIGHT_URL}}" if brand["id"] == "host" else globals()["LOGO_LIGHT"]
        LOGO_DARK = "{{WRLDHOST_LOGO_DARK_URL}}" if brand["id"] == "host" else globals()["LOGO_DARK"]
    else:
        alt = brand
        LOGO_LIGHT, LOGO_DARK = globals()["LOGO_LIGHT"], globals()["LOGO_DARK"]
    hgt = round(width * LOGO_RATIO)
    light = f'<img class="logo-light" src="{LOGO_LIGHT}" width="{width}" height="{hgt}" alt="{esc(alt)}" style="display:block;width:{width}px;height:auto;border:0;font-family:Montserrat,Arial,sans-serif;font-size:14px;font-weight:700;color:#0a0a0a;">'
    # Hidden inline (display:none + mso-hide) so clients without dark-mode CSS (Gmail, Outlook desktop)
    # only ever show the light-mode lockup. No conditional comments: Syncro's editor may strip them.
    dark = f'<img class="logo-dark" src="{LOGO_DARK}" width="{width}" height="{hgt}" alt="{esc(alt)}" style="display:none;width:{width}px;height:auto;border:0;mso-hide:all;max-height:0;overflow:hidden;">'
    if variant == "dark":
        return f'<img src="{LOGO_DARK}" width="{width}" height="{round(width * LOGO_RATIO)}" alt="{esc(alt)}" style="display:block;width:{width}px;height:auto;border:0;">'
    return light + dark

def eyebrow(text, mono=False):
    fam = FONT_MONO if mono else FONT_BODY
    ls = "0" if mono else "0.12em"
    tt = "none" if mono else "uppercase"
    return f'<span class="fg-muted" style="font-family:{fam};font-size:12px;line-height:16px;letter-spacing:{ls};text-transform:{tt};color:{T["mono500"]};">{text}</span>'

def chip(text, color):
    """Status chip as a one-cell table so Outlook (Word engine) honours the padding and border.
    The dot is a glyph, not a sized span, for the same reason."""
    return (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
            f'<td class="chip" style="font-family:{FONT_BODY};font-size:12px;line-height:16px;font-weight:500;'
            f'padding:3px 10px;border:1px solid {T["mono200"]};border-radius:9999px;color:{color};white-space:nowrap;">'
            f'<span style="color:{color};font-size:10px;line-height:16px;">&#9679;</span>&nbsp;{text}</td></tr></table>')

def button(label, href, warm=False):
    bg = T["accentWarm"] if warm else T["mono950"]
    fg = T["mono950"] if warm else T["mono0"]
    cls = "btn btn-warm" if warm else "btn"
    return f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn-full"><tr>
<td class="{cls} btn-full" style="background-color:{bg};border-radius:4px;mso-padding-alt:12px 22px;">
<a href="{href}" class="btn-full {'btn-a-warm' if warm else 'btn-a'}" style="display:inline-block;font-family:{FONT_BODY};font-size:15px;line-height:20px;font-weight:500;color:{fg};text-decoration:none;padding:12px 22px;border-radius:4px;">{label}&nbsp;&rarr;</a>
</td></tr></table>"""

def text_link(label, href, muted=False):
    color = T["mono500"] if muted else T["mono950"]
    cls = "fg-muted" if muted else "fg"
    return f'<a href="{href}" class="{cls}" style="color:{color};text-decoration:underline;text-underline-offset:2px;">{label}</a>'

def meta_rows(rows):
    """rows: list of (key, value_html). Two-column definition list that stays readable on mobile."""
    out = [f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:{FONT_BODY};font-size:14px;line-height:20px;">']
    for k, v in rows:
        out.append(f'<tr><td class="meta-k fg-muted rule" valign="top" style="width:128px;padding:6px 12px 6px 0;color:{T["mono500"]};border-top:1px solid {T["mono200"]};">{k}</td>'
                   f'<td class="fg rule" valign="top" style="padding:6px 0;color:{T["mono950"]};border-top:1px solid {T["mono200"]};">{v}</td></tr>')
    out.append("</table>")
    return "".join(out)

def avatar(initials, color):
    return (f'<td valign="top" width="36" style="width:36px;"><div style="width:32px;height:32px;line-height:32px;border-radius:50%;background:{color};'
            f'color:#fff;text-align:center;font-family:{FONT_DISPLAY};font-size:12px;font-weight:600;">{initials}</div></td>')

def initials(name):
    parts = [p for p in re.split(r"\s+", name.strip()) if p]
    return (parts[0][0] + (parts[-1][0] if len(parts) > 1 else "")).upper() if parts else "?"

# ---------------------------------------------------------------------------
# Components
# ---------------------------------------------------------------------------
def header(direction, brand, ref_label, ref_value, logo_html=None):
    """Top of email. Direction changes treatment; content is identical."""
    logo = logo_html or logo_img(brand)
    logo_dark = logo_html or logo_img(brand, "dark")
    if direction == "signal":
        return f"""<tr><td class="bg-band px" style="background-color:{T['mono950']};padding:20px 28px;border-radius:4px 4px 0 0;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
<td valign="middle" class="stack">{logo_dark}</td>
<td valign="middle" align="right" class="stack stack-gap right-on-desktop" style="text-align:right;">
<span style="font-family:{FONT_MONO};font-size:12px;line-height:16px;color:{T['mono400']};">{ref_label} <span style="color:{T['mono50']};">{ref_value}</span></span>
</td></tr></table></td></tr>"""
    # ledger + thread: quiet header above the card
    return f"""<tr><td class="px" style="padding:0 4px 14px 4px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
<td valign="middle" class="stack">{logo}</td>
<td valign="middle" align="right" class="stack stack-gap right-on-desktop" style="text-align:right;">
{eyebrow(f'{ref_label} <span class="fg" style="color:{T["mono950"]};">{ref_value}</span>', mono=True)}
</td></tr></table></td></tr>"""

def card_open(direction):
    radius = "0 0 4px 4px" if direction == "signal" else "4px"
    border_top = f"border-top:0;" if direction == "signal" else ""
    return f"""<tr><td class="bg-card px" style="background-color:{T['mono0']};border:1px solid {T['mono200']};{border_top}border-radius:{radius};padding:28px 28px 8px 28px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">"""

def card_close():
    return "</table></td></tr>"

def title_block(title, status_chip_html="", kicker=""):
    k = f'<tr><td style="padding-bottom:6px;">{eyebrow(kicker)}</td></tr>' if kicker else ""
    ch = f'<tr><td style="padding-top:10px;">{status_chip_html}</td></tr>' if status_chip_html else ""
    return f"""{k}
<tr><td class="h1 fg" style="font-family:{FONT_DISPLAY};font-size:24px;line-height:30px;font-weight:600;letter-spacing:-0.02em;color:{T['mono950']};">{title}</td></tr>
{ch}
{spacer(18)}"""

def message_block(body_html, sender=None, time=None, label=None, latest=True, direction="ledger"):
    """The message the email is about. In 'thread' direction it renders as a timeline item."""
    name_row = ""
    if sender:
        # Avatars only when we know the real name (mockups). Platform tags ({{...}} / {$...}) resolve after
        # build time, so initials() would emit a literal "{" - never draw an avatar for a tag.
        is_tag = "{{" in sender or "{$" in sender
        show_avatar = direction == "thread" and not is_tag
        sender_html = sender if is_tag else esc(sender)
        time_html = time if (time and ("{{" in time or "{$" in time)) else (esc(time) if time else "")
        name_row = f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
{avatar(initials(sender), T['mono950']) if show_avatar else ''}
<td valign="middle" style="padding-left:{'10px' if show_avatar else '0'};padding-bottom:10px;">
<span class="fg" style="font-family:{FONT_BODY};font-size:14px;line-height:18px;font-weight:500;color:{T['mono950']};">{sender_html}</span>
{('&nbsp;&nbsp;<span class="fg-subtle" style="font-family:'+FONT_BODY+';font-size:12px;color:'+T['mono500']+';">'+time_html+'</span>') if time_html else ''}
</td></tr></table>"""
    lab = f'<tr><td style="padding-bottom:10px;">{eyebrow(label)}</td></tr>' if label else ""
    bg = T["mono50"] if direction == "thread" else "transparent"
    pad = "16px 18px" if direction == "thread" else "0"
    border = f"border:1px solid {T['mono200']};border-radius:4px;" if direction == "thread" else ""
    cls = "bg-muted rule" if direction == "thread" else ""
    return f"""{lab}
<tr><td class="{cls}" style="background-color:{bg};{border}padding:{pad};">
{name_row}
<div class="wrld-body fg" style="font-family:{FONT_BODY};font-size:16px;line-height:24px;color:{T['mono950']};">{body_html}</div>
</td></tr>"""

def history_block(inner_html, count_label="Earlier in this ticket", direction="ledger", note=None, syncro=False):
    """Wraps platform-provided history. Always below the latest message, visually quieter.
    syncro=True adds the class that targets Syncro's two-divs-per-comment markup."""
    hist_cls = "wrld-history wrld-history-syncro" if syncro else "wrld-history"
    n = f'<tr><td style="padding-bottom:12px;"><span class="fg-subtle" style="font-family:{FONT_BODY};font-size:13px;line-height:18px;color:{T["mono500"]};">{note}</span></td></tr>' if note else ""
    return f"""{spacer(24)}
<tr><td class="rule" style="border-top:1px solid {T['mono200']};padding-top:18px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
<td>{eyebrow(count_label)}</td></tr></table>
</td></tr>
{spacer(8)}
{n}
<tr><td class="{hist_cls} fg-muted" style="font-family:{FONT_BODY};font-size:14px;line-height:21px;color:{T['mono600']};">{inner_html}</td></tr>"""

def sample_history(items, direction, syncro=False):
    """Sample rendering of history for mockups.

    syncro=False (Gleap, WHMCS hook): one .wrld-msg div per message, the markup our own hook emits.
    syncro=True: mirrors, byte for byte in structure, what Syncro's
    {{ticket_public_comments_for_email}} emits (captured from a live preview on 2026-09-22):
      <div style="border-top:1px #ddd solid; padding:20px 0; margin-right:20px;">
        <p style="font-weight:600; color:#444; line-height:0;">Name</p><small style="color:#858585;">date</small>
      </div>
      <div style="border-bottom:1px #ddd solid; padding:20px 0; margin-right:20px;"><p>body</p></div>
    so the wrapper CSS is exercised against the real markup, not an idealised one."""
    out = []
    if not syncro:
        for who, when, body in items:
            out.append(f'<div class="wrld-msg" style="border-top:1px solid {T["mono200"]};padding:14px 0;">'
                       f'<p style="font-weight:600;margin:0 0 2px 0;color:{T["mono900"]};font-size:13px;">{esc(who)} '
                       f'<span style="font-weight:400;color:{T["mono500"]};">&nbsp;{esc(when)}</span></p>'
                       f'<div style="margin-top:6px;color:{T["mono600"]};">{body}</div></div>')
        return "".join(out)
    for who, when, body in items:
        out.append(f'<div style="border-top: 1px #ddd solid; padding: 20px 0px; margin-right: 20px;">\n'
                   f'  <p style="font-weight: 600; color: #444; line-height: 0;">{esc(who)}</p>\n'
                   f'  <small style="color: #858585; line-height: 1em;">{esc(when)}</small>\n</div>\n'
                   f'<div style="border-bottom: 1px #ddd solid; padding: 20px 0px; margin-right: 20px;">{body}</div>\n')
    return "".join(out)

def cta_row(primary_html, secondary_html=""):
    return f"""{spacer(24)}
<tr><td>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
<td class="stack" valign="middle">{primary_html}</td>
<td class="stack stack-gap" valign="middle" align="right" style="text-align:right;font-family:{FONT_BODY};font-size:14px;line-height:20px;">{secondary_html}</td>
</tr></table>
</td></tr>"""

def help_strip(brand, reply_hint=True):
    b = brand
    sla = f' Emergency? Call the priority line <a href="tel:{b["phone_sla_tel"]}" class="fg" style="color:{T["mono950"]};text-decoration:none;font-weight:500;">{b["phone_sla"]}</a>.' if b.get("phone_sla") else ""
    hint = "Reply to this email to add to the conversation." if reply_hint else ""
    return f"""{spacer(24)}
<tr><td class="rule" style="border-top:1px solid {T['mono200']};padding:16px 0 12px 0;">
<span class="fg-muted" style="font-family:{FONT_BODY};font-size:13px;line-height:20px;color:{T['mono600']};">{hint} Standard line <a href="tel:{b['phone_std_tel']}" class="fg" style="color:{T['mono950']};text-decoration:none;font-weight:500;">{b['phone_std']}</a>.{sla}</span>
</td></tr>"""

def footer(brand, extra_links=None, unsubscribe_html="", legal_line=None):
    b = brand
    links = [(b["site_label"], b["site"]), (b["portal_label"], b["portal"])] + (extra_links or []) + LEGAL_LINKS
    sep = '&nbsp;&nbsp;<span style="color:' + T["mono300"] + ';">&middot;</span>&nbsp;&nbsp;'
    link_html = sep.join(
        f'<a href="{h}" class="fg-muted" style="color:{T["mono500"]};text-decoration:none;">{l}</a>' for l, h in links)
    legal = legal_line or f"&copy; {{{{YEAR}}}} WRLD Inc. All rights reserved."
    socials = b.get("socials") or []
    social_row = ""
    if socials:
        social_html = sep.join(
            f'<a href="{h}" class="fg-muted" style="color:{T["mono500"]};text-decoration:underline;text-underline-offset:2px;">{l}</a>' for l, h in socials)
        social_row = f'<tr><td class="fg-muted" style="color:{T["mono500"]};padding-bottom:8px;">Follow us&nbsp;&nbsp;{social_html}</td></tr>'
    return f"""{spacer(20)}
<tr><td class="px" style="padding:0 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:{FONT_BODY};font-size:12px;line-height:18px;color:{T['mono500']};">
<tr><td class="fg-muted" style="color:{T['mono500']};padding-bottom:8px;">{link_html}</td></tr>
{social_row}
<tr><td class="fg-subtle" style="color:{T['mono500']};">{legal} {ADDRESS}. {b['hours']}</td></tr>
{('<tr><td class="fg-subtle" style="color:'+T['mono500']+';padding-top:8px;">'+unsubscribe_html+'</td></tr>') if unsubscribe_html else ''}
</table></td></tr>
{spacer(8)}"""

def wrld_signoff(brand):
    return f'<p style="margin:12px 0 0 0;color:{T["mono600"]};" class="fg-muted">- {brand["product"]}</p>'

# ---------------------------------------------------------------------------
# Sample data (fictional)
# ---------------------------------------------------------------------------
SAMPLE = {
    "customer": "Jordan Reyes", "company": "Northline Veterinary Group", "ticket": "431500",
    "subject": "Front desk scanner not saving to shared drive",
    "tech": "Marcus Hale", "opened": "Wed, Sep 16 at 9:12 AM CT", "status": "In progress",
    "latest_time": "Thu, Sep 17 at 10:41 AM CT",
    "latest": (f"<p>Hi Jordan,</p><p>Quick update on the scanner. The shared drive mapping dropped after last night's Windows update on the front desk PC. We re-mapped it under the clinic's service account and re-ran a test scan, which landed in <strong>Scans / Front Desk</strong> as expected.</p>"
               f"<p>We're leaving this open until end of day so your team can confirm it's holding through a full shift. Nothing needed from you unless it drops again.</p>"),
    "history": [
        ("Jordan Reyes", "Thu, Sep 17 at 8:03 AM CT", "<p>Still not working this morning. Scans go through on the printer screen but nothing shows in the folder.</p>"),
        ("Marcus Hale", "Wed, Sep 16 at 3:20 PM CT", "<p>Thanks Jordan. We pushed a driver refresh remotely and asked Priya to try again. If it fails overnight we'll look at the drive mapping directly in the morning.</p>"),
        ("Jordan Reyes", "Wed, Sep 16 at 9:12 AM CT", "<p>The front desk scanner stopped saving to the shared drive sometime yesterday. Priya has tried restarting it twice. Happens on every scan.</p>"),
    ],
    "gleap_ref": "#736", "gleap_agent": "Ridgeway Lawrence",
    "invoice_num": "2026 09-7203", "invoice_total": "$481.69", "invoice_due": "October 1, 2026",
    "invoice_items": [("Fully Managed - Business Basic - northline.wrld.pw (10/01 - 10/31)", "$44.99"), ("Dedicated IP", "$4.00"), ("Managed WordPress care plan", "$432.70")],
}

# ---------------------------------------------------------------------------
# Renderers. mode = "sample" (mockup) or "template" (platform variables)
# ---------------------------------------------------------------------------
def render_syncro_ticket_comment(direction, mode, compact=False):
    """Ticket Comment email.

    Syncro tags (verified against the live tag list in wrld.syncromsp.com on 2026-09-22):
      {{comment_body}} {{comment_sender_name}} {{comment_created_at}}  -> the comment that fired this email
      {{ticket_public_comments_for_email}}                              -> ALL public comments, newest first,
                                                                          each truncated at 2500 chars
      {{ticket_public_fulltext_comments_for_email}}                     -> same, untruncated
    There is no "history minus the latest" tag, so the newest comment is always inside the history block.
    Default: show it once as a framed "Latest reply", then the full conversation (labelled as such).
    compact=True: no framed block; the history alone carries the conversation, newest first, untruncated."""
    b = BRANDS["tech"]
    s = SAMPLE
    if mode == "sample":
        ticket, subject, status, tech, opened = s["ticket"], s["subject"], s["status"], s["tech"], s["opened"]
        customer, latest, latest_time = s["customer"], s["latest"], s["latest_time"]
        # Syncro's history tag always includes the newest comment, so the mockup does too.
        hist_items = [(s["tech"], s["latest_time"], s["latest"])] + s["history"]
        history = sample_history(hist_items, direction, syncro=True)
        url = "https://wrld.syncromsp.com/tickets/117754091"
        logo = None
    else:
        ticket, subject, status, tech = "{{ticket_number}}", "{{ticket_subject}}", "{{ticket_status}}", "{{tech_name}}"
        opened = "{{ticket_date}}"
        customer = "{{customer_full_name}}"
        latest = "{{comment_body}}"
        latest_time = "{{comment_created_at}}"
        history = "{{ticket_public_fulltext_comments_for_email}}" if compact else "{{ticket_public_comments_for_email}}"
        url = "{{ticket_url}}"
        logo = None  # hosted WRLD.TECH lockups with dark-mode swap (logo_img)
    sender = s["tech"] if mode == "sample" else "{{comment_sender_name}}"

    body = [header(direction, b, "Ticket", f"#{ticket}", logo_html=logo), card_open(direction)]
    body.append(title_block(esc(subject) if mode == "sample" else subject, chip(status, b["accent"]), kicker="Update on your ticket"))
    if not compact:
        body.append(message_block(latest, sender=sender, time=latest_time, label="Latest reply", direction=direction))
        body.append(spacer(20))
    body.append(f"<tr><td>{meta_rows([('Ticket', f'#{ticket}'), ('Status', status), ('Assigned to', tech), ('Opened', opened)])}</td></tr>")
    body.append(cta_row(button("View and reply online", url), text_link("Open the support portal", b["portal"], muted=True)))
    if compact:
        body.append(history_block(history, "Conversation", direction, syncro=True,
                                  note="Newest reply first. Everything said on this ticket so far is below, so you never have to dig for context."))
    else:
        body.append(history_block(history, "Full conversation", direction, syncro=True,
                                  note="The whole ticket, newest first. The reply above appears here again, followed by everything before it."))
    body.append(help_strip(b))
    body.append(card_close())
    body.append(footer(b))
    return body

def render_syncro_ticket_created(direction, mode, autoresponder=False):
    b = BRANDS["tech"]; s = SAMPLE
    if mode == "sample":
        ticket, subject, customer, problem = s["ticket"], s["subject"], s["customer"].split()[0], s["history"][-1][2]
        url = "https://wrld.syncromsp.com/tickets/117754091"; logo = None
    else:
        ticket, subject, customer, problem = "{{ticket_number}}", "{{ticket_subject}}", "{{customer_first_name}}", "{{initial_comment_body}}"
        url = "{{ticket_url}}"; logo = None
    kicker = "We received your request" if autoresponder else "A ticket was opened for you"
    body = [header(direction, b, "Ticket", f"#{ticket}", logo_html=logo), card_open(direction)]
    body.append(title_block(esc(subject) if mode == "sample" else subject, chip("New", b["accent"]), kicker=kicker))
    intro = (f"<p>Hi {customer},</p><p>Your request is in the queue and a technician is being assigned now. You can reply to this email at any time to add details or screenshots, and every reply lands in the same ticket.</p>")
    body.append(message_block(intro, direction="ledger"))
    body.append(spacer(16))
    body.append(message_block(problem, label="What you told us", direction=direction))
    body.append(cta_row(button("Track this ticket", url), text_link("Open the support portal", b["portal"], muted=True)))
    body.append(help_strip(b))
    body.append(card_close()); body.append(footer(b))
    return body

def render_syncro_ticket_resolved(direction, mode):
    b = BRANDS["tech"]; s = SAMPLE
    if mode == "sample":
        ticket, subject, customer, tech = s["ticket"], s["subject"], s["customer"].split()[0], s["tech"]
        history = sample_history(s["history"], direction, syncro=True); url = "https://wrld.syncromsp.com/tickets/117754091"; logo = None
    else:
        ticket, subject, customer, tech = "{{ticket_number}}", "{{ticket_subject}}", "{{customer_first_name}}", "{{tech_name}}"
        history = "{{ticket_public_comments_for_email}}"; url = "{{ticket_url}}"; logo = None
    body = [header(direction, b, "Ticket", f"#{ticket}", logo_html=logo), card_open(direction)]
    body.append(title_block(esc(subject) if mode == "sample" else subject, chip("Resolved", T["success"]), kicker="Marked resolved"))
    body.append(message_block(f"<p>Hi {customer},</p><p>{tech} marked this ticket resolved. If anything is still off, just reply to this email and it reopens automatically with the full history attached, no need to start over.</p>", direction="ledger"))
    body.append(cta_row(button("Review the ticket", url), text_link("Reopen by replying", "mailto:" + b["email"], muted=True)))
    body.append(history_block(history, "What we did", direction, syncro=True))
    body.append(help_strip(b, reply_hint=False))
    body.append(card_close()); body.append(footer(b))
    return body

def render_gleap_reply(direction, mode):
    b = BRANDS["tech"]; s = SAMPLE
    if mode == "sample":
        ref, agent, content = s["gleap_ref"], s["gleap_agent"], s["latest"].replace("Jordan", s["customer"].split()[0])
        history = sample_history(s["history"][:2], direction); avatar_url = None; unsub = f'<a href="#" class="fg-subtle" style="color:{T["mono500"]};">Unsubscribe from these emails</a>'
        logo = None
    else:
        ref, agent, content = "{{bugRef}}", "{{user.name}}", "{{{htmlContent}}}"
        history = "{{{conversationHistory}}}"; avatar_url = "{{profileImageUrl}}"
        unsub = '<a href="{{unsubscribeLink}}" class="fg-subtle" style="color:' + T["mono500"] + ';">{{unsubscribeText}}</a>'
        logo = None
    body = [header(direction, b, "Conversation", ref, logo_html=logo), card_open(direction)]
    body.append(title_block("New reply from " + (esc(agent) if mode == "sample" else agent), "", kicker="{{companyName}}" if mode == "template" else b["entity"]))
    # Gleap requires {{{htmlContent}}} wrapped in a table
    body.append(f'<tr><td><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">'
                + message_block(content, sender=agent, time=(s["latest_time"] if mode == "sample" else None), label="Latest reply", direction=direction)
                + "</table></td></tr>")
    body.append(cta_row(button("Reply", "mailto:" + b["email"]), text_link("Or just reply to this email", "mailto:" + b["email"], muted=True)))
    body.append(history_block(history, "Earlier in this conversation", direction))
    body.append(help_strip(b))
    body.append(card_close()); body.append(footer(b, unsubscribe_html=unsub))
    return body

def render_gleap_autoreply(direction, mode):
    b = BRANDS["tech"]; s = SAMPLE
    if mode == "sample":
        ref, name, form, url, shot = s["gleap_ref"], s["customer"].split()[0], f'<p><strong>Describe the issue</strong><br>{s["history"][-1][2][3:-4]}</p>', "#", ""
    else:
        ref, name, form, url, shot = "{{feedbackId}}", "{{receiverName}}", "{{{formData}}}", "{{feedbackUrl}}", "{{{screenshot}}}"
    body = [header(direction, b, "Request", ref if mode == "sample" else "#{{feedbackId}}"), card_open(direction)]
    body.append(title_block("We received your request", chip("Received", b["accent"]), kicker="{{companyName}}" if mode == "template" else b["entity"]))
    body.append(message_block(f"<p>Hi {name},</p><p>Thanks for the report. It's in our queue and a real person will follow up here. Every reply you send lands in the same thread so nothing gets lost.</p>", direction="ledger"))
    body.append(spacer(16))
    body.append(message_block(form + shot, label="What you sent", direction=direction))
    body.append(cta_row(button("View your request", url), ""))
    body.append(help_strip(b))
    body.append(card_close())
    unsub = '<a href="{{unsubscribeLink}}" class="fg-subtle" style="color:' + T["mono500"] + ';">{{unsubscribeText}}</a>' if mode == "template" else ""
    body.append(footer(b, unsubscribe_html=unsub))
    return body

def render_whmcs_ticket_reply(direction, mode, hook=True):
    b = BRANDS["host"]; s = SAMPLE
    if mode == "sample":
        tid, subject, dept, status, name, msg = "HRX-" + s["ticket"], s["subject"].replace("Front desk scanner", "Staging site 502 after PHP upgrade"), "Technical support", "Answered", s["customer"].split()[0], s["latest"].replace("scanner", "staging site").replace("shared drive mapping dropped after last night's Windows update on the front desk PC", "PHP-FPM pool ran out of children after the 8.3 upgrade").replace("re-mapped it under the clinic's service account and re-ran a test scan, which landed in <strong>Scans / Front Desk</strong> as expected", "raised the pool limits and rolled the OPcache config, and the staging site is answering in under 400ms again")
        history = sample_history(s["history"][:2], direction); url = "https://wrld.host/viewticket.php?tid=HRX-431500"; logo = None
    else:
        tid, subject, dept, status, name, msg = "{$ticket_tid}", "{$ticket_subject}", "{$ticket_department}", "{$ticket_status}", "{$client_first_name}", "{$ticket_message}"
        history = "{$wrld_ticket_history}" if hook else ""; url = "{$ticket_link}"; logo = '<img src="{$company_logo_url}" width="132" alt="{$company_name}" style="display:block;width:132px;height:auto;border:0;">'
    body = [header(direction, b, "Ticket", f"#{tid}", logo_html=logo), card_open(direction)]
    body.append(title_block(esc(subject) if mode == "sample" else subject, chip(status, b["accent"]), kicker=f"Update from {dept}"))
    body.append(message_block(msg, sender=(s["tech"] if mode == "sample" else None), time=(s["latest_time"] if mode == "sample" else None), label="Latest reply", direction=direction))
    body.append(spacer(20))
    body.append(f"<tr><td>{meta_rows([('Ticket', f'#{tid}'), ('Department', dept), ('Status', status)])}</td></tr>")
    body.append(cta_row(button("View and reply online", url), text_link("Open the client area", b["portal"], muted=True)))
    if history:
        body.append(history_block(history, "Earlier in this ticket", direction))
    body.append(help_strip(b))
    body.append(card_close()); body.append(footer(b))
    return body

def render_whmcs_ticket_opened(direction, mode):
    b = BRANDS["host"]; s = SAMPLE
    if mode == "sample":
        tid, subject, dept, name, msg = "HRX-" + s["ticket"], "Staging site 502 after PHP upgrade", "Technical support", s["customer"].split()[0], "<p>Staging returns a 502 since the PHP 8.3 upgrade this morning. Production is fine.</p>"
        url = "#"; logo = None
    else:
        tid, subject, dept, name, msg = "{$ticket_tid}", "{$ticket_subject}", "{$ticket_department}", "{$client_first_name}", "{$ticket_message}"
        url = "{$ticket_link}"; logo = '<img src="{$company_logo_url}" width="132" alt="{$company_name}" style="display:block;width:132px;height:auto;border:0;">'
    body = [header(direction, b, "Ticket", f"#{tid}", logo_html=logo), card_open(direction)]
    body.append(title_block(esc(subject) if mode == "sample" else subject, chip("Open", b["accent"]), kicker="We received your ticket"))
    body.append(message_block(f"<p>Hi {name},</p><p>Your ticket reached the {dept} team. Reply to this email any time to add details, and we'll keep the whole conversation in one place.</p>", direction="ledger"))
    body.append(spacer(16))
    body.append(message_block(msg, label="What you told us", direction=direction))
    body.append(cta_row(button("Track this ticket", url), text_link("Open the client area", b["portal"], muted=True)))
    body.append(help_strip(b))
    body.append(card_close()); body.append(footer(b))
    return body

def render_whmcs_invoice(direction, mode, kind="created"):
    b = BRANDS["host"]; s = SAMPLE
    if mode == "sample":
        num, total, due, name, url, pay, method = s["invoice_num"], s["invoice_total"], s["invoice_due"], s["customer"].split()[0], "#", "#", "ACH / Wire"
        items = "".join(f'<tr><td class="fg rule" style="padding:8px 0;border-top:1px solid {T["mono200"]};color:{T["mono950"]};">{d}</td><td class="fg rule" align="right" style="padding:8px 0;border-top:1px solid {T["mono200"]};color:{T["mono950"]};white-space:nowrap;">{a}</td></tr>' for d, a in s["invoice_items"])
        items = f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:{FONT_BODY};font-size:14px;line-height:20px;">{items}<tr><td class="fg rule" style="padding:10px 0;border-top:2px solid {T["mono950"]};font-weight:500;color:{T["mono950"]};">Total</td><td class="fg rule" align="right" style="padding:10px 0;border-top:2px solid {T["mono950"]};font-weight:600;color:{T["mono950"]};">{total}</td></tr></table>'
        logo = None
    else:
        num, total, due, name, url, pay, method = "{$invoice_num}", "{$invoice_total}", "{$invoice_date_due}", "{$client_first_name}", "{$invoice_link}", "{$invoice_payment_link}", "{$invoice_payment_method}"
        items = '<div class="wrld-body" style="font-family:' + FONT_BODY + ';font-size:14px;line-height:20px;">{$invoice_html_contents}</div>'
        logo = '<img src="{$company_logo_url}" width="132" alt="{$company_name}" style="display:block;width:132px;height:auto;border:0;">'
    if kind == "created":
        kicker, title, ch, intro, primary, warm = "New invoice", f"Invoice #{num}", chip("Due " + due, T["mono600"]), f"<p>Hi {name},</p><p>A new invoice is ready for your {b['product']} services. Your payment method on file is <strong>{method}</strong>. If that's set to auto-pay, there's nothing to do.</p>", ("Pay invoice", pay), True
    elif kind == "paid":
        kicker, title, ch, intro, primary, warm = "Payment received", f"Invoice #{num} is paid", chip("Paid", T["success"]), f"<p>Hi {name},</p><p>Thanks, we received your payment of <strong>{total}</strong>. Your receipt is available in the client area.</p>", ("View receipt", url), False
    else:
        kicker, title, ch, intro, primary, warm = "Action needed", f"Payment for #{num} didn't go through", chip("Payment failed", T["danger"]), f"<p>Hi {name},</p><p>We tried to charge your payment method for <strong>{total}</strong> and it was declined. Update your card or pay manually before <strong>{due}</strong> to avoid any interruption.</p>", ("Update payment method", "https://wrld.host/account/paymentmethods"), True
    body = [header(direction, b, "Invoice", f"#{num}", logo_html=logo), card_open(direction)]
    body.append(title_block(title, ch, kicker=kicker))
    body.append(message_block(intro, direction="ledger"))
    body.append(spacer(20))
    body.append(f'<tr><td>{items}</td></tr>')
    body.append(cta_row(button(*primary, warm=warm), text_link("View invoice", url, muted=True)))
    body.append(help_strip(b, reply_hint=False))
    body.append(card_close()); body.append(footer(b))
    return body

# ---------------------------------------------------------------------------
# Assemble
# ---------------------------------------------------------------------------
def full_email(parts, title, direction, preheader=""):
    return head(title, direction, preheader) + "\n" + open_shell(preheader) + "\n" + "\n".join(parts) + "\n" + close_shell()

def syncro_wrapper(direction):
    """Wrapper = everything except the body. Syncro injects each template into {{email_body}}.

    The wrapper is shared by EVERY Syncro email (invoices, estimates, portal invites), so nothing
    ticket-specific lives here: no preheader, no "Reply above this line". Those sit in the ticket bodies.
    {{email_body}} must be inside a <td>: the body templates are full <table> blocks and a <table> dropped
    straight between <tr>s is invalid HTML that clients foster-parent out of the container."""
    b = BRANDS["tech"]
    doc = head("{{account_name}}", direction) + "\n" + open_shell("") + "\n"
    doc += '<tr><td style="padding:0;">{{email_body}}</td></tr>\n'
    # Syncro has no year tag ({{YEAR}} rendered literally in production); the legal line is evergreen instead.
    doc += footer(b, legal_line="&copy; {{account_name}} &middot;") + "\n" + close_shell()
    return doc

def syncro_body(parts, reply_hint=True, preheader=""):
    """Ticket templates go INSIDE the wrapper's {{email_body}} cell as ONE self-contained table.

    Syncro's Simple Editor is CKEditor 4. It re-serialises whatever is pasted into Source: orphan <tr> rows
    get wrapped in their own <table>, width attributes move into style, font names are lower-cased and
    conditional comments are not guaranteed to survive. Handing it a single well-formed table keeps the
    result deterministic. Footer comes from the wrapper, so the last part is dropped."""
    rows = "\n".join(parts[:-1])
    pre = preheader_block(preheader) + "\n" if preheader else ""
    reply = ""
    if reply_hint:
        # {{reply_above_line}} is Syncro's own marker; its inbound parser strips quoted text below it.
        reply = f'<tr><td class="fg-subtle" style="font-family:{FONT_BODY};font-size:11px;line-height:14px;color:{T["mono400"]};padding:0 4px 10px 4px;">{{{{reply_above_line}}}}</td></tr>\n'
    return (f'{pre}<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">\n'
            f'{reply}{rows}\n</table>')

DIRECTIONS = ["ledger", "signal", "thread"]

MOCKUPS = {
    "syncro-ticket-comment": lambda d, m: render_syncro_ticket_comment(d, m),
    "syncro-ticket-comment-compact": lambda d, m: render_syncro_ticket_comment(d, m, compact=True),
    "syncro-ticket-created": lambda d, m: render_syncro_ticket_created(d, m),
    "syncro-ticket-resolved": lambda d, m: render_syncro_ticket_resolved(d, m),
    "gleap-message-reply": lambda d, m: render_gleap_reply(d, m),
    "gleap-auto-reply": lambda d, m: render_gleap_autoreply(d, m),
    "whmcs-support-ticket-reply": lambda d, m: render_whmcs_ticket_reply(d, m),
    "whmcs-support-ticket-opened": lambda d, m: render_whmcs_ticket_opened(d, m),
    "whmcs-invoice-created": lambda d, m: render_whmcs_invoice(d, m, "created"),
    "whmcs-invoice-paid": lambda d, m: render_whmcs_invoice(d, m, "paid"),
    "whmcs-invoice-failed": lambda d, m: render_whmcs_invoice(d, m, "failed"),
}
TITLES = {
    "syncro-ticket-comment": "Syncro: Ticket comment",
    "syncro-ticket-comment-compact": "Syncro: Ticket comment (compact)",
    "syncro-ticket-created": "Syncro: Ticket created / autoresponder",
    "syncro-ticket-resolved": "Syncro: Ticket resolved",
    "gleap-message-reply": "Gleap: Message reply",
    "gleap-auto-reply": "Gleap: Auto-reply (ticket received)",
    "whmcs-support-ticket-reply": "WHMCS: Support ticket reply",
    "whmcs-support-ticket-opened": "WHMCS: Support ticket opened",
    "whmcs-invoice-created": "WHMCS: Invoice created",
    "whmcs-invoice-paid": "WHMCS: Invoice payment confirmation",
    "whmcs-invoice-failed": "WHMCS: Invoice payment failed",
}

def year_fix(s, sample):
    return s.replace("{{YEAR}}", "2026") if sample else s

def build():
    (DIST / "mockups").mkdir(parents=True, exist_ok=True)
    for d in DIRECTIONS:
        (DIST / "mockups" / d).mkdir(exist_ok=True)
        for key, fn in MOCKUPS.items():
            parts = fn(d, "sample")
            pre = "Latest reply plus the full conversation so far." if "ticket" in key or "reply" in key else ""
            (DIST / "mockups" / d / f"{key}.html").write_text(year_fix(full_email(parts, TITLES[key], d, pre), True))

    # Templates (recommended direction is chosen at publish time; emit all three)
    for d in DIRECTIONS:
        tdir = DIST / "templates" / d
        for p in ["syncro", "gleap", "whmcs", "whmcs/hooks"]:
            (tdir / p).mkdir(parents=True, exist_ok=True)
        # Syncro: wrapper + body fragments
        (tdir / "syncro" / "00-email-wrapper.html").write_text(syncro_wrapper(d))
        (tdir / "syncro" / "ticket-comment.html").write_text(syncro_body(render_syncro_ticket_comment(d, "template"),
            preheader="{{comment_sender_name}} replied on ticket #{{ticket_number}}: {{ticket_subject}}"))
        (tdir / "syncro" / "ticket-comment.compact.html").write_text(syncro_body(render_syncro_ticket_comment(d, "template", compact=True),
            preheader="New reply on ticket #{{ticket_number}}: {{ticket_subject}}"))
        (tdir / "syncro" / "ticket-created.html").write_text(syncro_body(render_syncro_ticket_created(d, "template"),
            preheader="Ticket #{{ticket_number}} opened: {{ticket_subject}}"))
        (tdir / "syncro" / "ticket-autoresponder.html").write_text(syncro_body(render_syncro_ticket_created(d, "template", autoresponder=True),
            preheader="We received your request. Ticket #{{ticket_number}}: {{ticket_subject}}"))
        (tdir / "syncro" / "ticket-resolved.html").write_text(syncro_body(render_syncro_ticket_resolved(d, "template"),
            preheader="Ticket #{{ticket_number}} resolved: {{ticket_subject}}"))
        # Gleap: full documents
        (tdir / "gleap" / "message-reply.html").write_text(full_email(render_gleap_reply(d, "template"), "{{companyName}}", d, "New reply on {{bugRef}}"))
        (tdir / "gleap" / "auto-reply.html").write_text(full_email(render_gleap_autoreply(d, "template"), "{{companyName}}", d, "We received your request"))
        # WHMCS: header/footer (General Settings > Mail) + body templates. Two paths documented in README.
        pre = ""
        whead = head("{$company_name}", d, pre) + "\n" + open_shell(pre)
        wfoot = "\n" + close_shell()
        (tdir / "whmcs" / "00-global-email-header.html").write_text(whead)
        (tdir / "whmcs" / "00-global-email-footer.html").write_text(wfoot)
        for key, fn in [("support-ticket-reply", lambda: render_whmcs_ticket_reply(d, "template")),
                        ("support-ticket-opened", lambda: render_whmcs_ticket_opened(d, "template")),
                        ("invoice-created", lambda: render_whmcs_invoice(d, "template", "created")),
                        ("invoice-payment-confirmation", lambda: render_whmcs_invoice(d, "template", "paid")),
                        ("invoice-payment-failed", lambda: render_whmcs_invoice(d, "template", "failed"))]:
            (tdir / "whmcs" / f"{key}.html").write_text("\n".join(fn()).replace("{{YEAR}}", "{$date|date_format:'%Y'}"))
        # Lagom path: body-only variant (no header/footer rows) for use inside Lagom wrapper
        (tdir / "whmcs" / "support-ticket-reply.lagom-body.html").write_text(
            lagom_body(render_whmcs_ticket_reply(d, "template")))
        (tdir / "whmcs" / "hooks" / "wrld_ticket_history.php").write_text(HOOK_PHP)
    (DIST / "templates" / "README.md").write_text(README)
    print("built", len(DIRECTIONS) * len(MOCKUPS), "mockups")

def lagom_body(parts):
    """Strip our header and footer rows; keep the card contents as a fragment for Lagom's wrapper."""
    inner = "\n".join(parts[1:-1])  # drop header row and footer
    # unwrap card row into a plain table
    inner = re.sub(r'^<tr><td class="bg-card px"[^>]*>\s*<table[^>]*>', '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">', inner.strip(), count=1)
    inner = re.sub(r'</table></td></tr>\s*$', '</table>', inner)
    return css("ledger") + "\n" + inner

HOOK_PHP = r'''<?php
/**
 * WRLD.host - adds {$wrld_ticket_history} to Support Ticket Reply emails.
 * Drop into /includes/hooks/wrld_ticket_history.php
 *
 * WHMCS has no native merge field for prior replies, which is why clients lose context.
 * This builds a compact, newest-first thread (excluding the reply being sent) and exposes it
 * to the "Support Ticket Reply" and "Support Ticket Opened" templates.
 */
use WHMCS\Database\Capsule;

add_hook('EmailPreSend', 1, function (array $vars) {
    $templates = ['Support Ticket Reply', 'Support Ticket Opened', 'Support Ticket Auto Close Notification'];
    if (!in_array($vars['messagename'], $templates, true)) {
        return [];
    }
    $ticketId = (int) $vars['relid'];
    if ($ticketId <= 0) {
        return ['wrld_ticket_history' => ''];
    }

    $limit = 6; // most recent replies shown; older ones stay in the client area
    $ticket = Capsule::table('tbltickets')->where('id', $ticketId)->first();
    if (!$ticket) {
        return ['wrld_ticket_history' => ''];
    }

    $rows = Capsule::table('tblticketreplies')
        ->where('tid', $ticketId)
        ->orderBy('date', 'desc')
        ->limit($limit + 1)
        ->get();

    // The newest reply is the one this email is about; the template already shows it as {$ticket_message}.
    $rows = $rows->slice(1);

    $items = [];
    foreach ($rows as $r) {
        $who = $r->admin ? htmlspecialchars($r->admin) : htmlspecialchars($r->name ?: 'You');
        $when = date('D, M j \a\t g:i A T', strtotime($r->date));
        $msg = nl2br(htmlspecialchars(trim($r->message)));
        $items[] = '<div class="wrld-msg" style="border-top:1px solid #e4e4e7;padding:14px 0;">'
            . '<p style="font-weight:600;margin:0 0 2px 0;color:#18181b;font-size:13px;">' . $who
            . ' <span style="font-weight:400;color:#71717a;">&nbsp;' . $when . '</span></p>'
            . '<div style="margin-top:6px;color:#52525b;">' . $msg . '</div></div>';
    }
    // Original request goes last (oldest)
    $who = htmlspecialchars($ticket->name ?: 'You');
    $when = date('D, M j \a\t g:i A T', strtotime($ticket->date));
    $items[] = '<div class="wrld-msg" style="border-top:1px solid #e4e4e7;padding:14px 0;">'
        . '<p style="font-weight:600;margin:0 0 2px 0;color:#18181b;font-size:13px;">' . $who
        . ' <span style="font-weight:400;color:#71717a;">&nbsp;' . $when . '</span></p>'
        . '<div style="margin-top:6px;color:#52525b;">' . nl2br(htmlspecialchars(trim($ticket->message))) . '</div></div>';

    return ['wrld_ticket_history' => implode('', $items)];
});
'''

README = """# WRLD transactional email templates

Generated by build.py. Three visual directions (ledger, signal, thread) x three platforms.
Pick ONE direction and deploy its folder. Do not mix.

## One-time find and replace (all platforms)
- WRLD.TECH lockups are hotlinked from wrld.design (no replace needed):
    https://wrld.design/assets/logos/wrld-tech-black.png  (light mode)
    https://wrld.design/assets/logos/wrld-tech-white.png  (dark mode, swapped in by CSS)
  Apple Mail, iOS, Outlook for Mac, Outlook.com and new Outlook swap to the white lockup in dark mode.
  Gmail and Outlook for Windows ignore the swap and always show the black lockup.
- {{WRLDHOST_LOGO_LIGHT_URL}} / {{WRLDHOST_LOGO_DARK_URL}} -> WRLD.HOST lockups (assets/wrld-host-*.png in this package).
  Syncro templates no longer use {{logo_100}} (a single fixed image, no dark variant). There is NO {{location_logo_100}} tag.
  WHMCS uses {$company_logo_url} (Setup > General Settings > General > Logo). Confirm the field appears under the editor's merge-field list; if not, hardcode the URL.
- {{YEAR}} -> only the WHMCS files carry a year ({$date|date_format:'%Y'}). Syncro has no year tag, so the Syncro wrapper's legal line is evergreen.

## Syncro (helpdesk@wrld.tech)
Admin > Syncro Administration - PDF/Email Templates > Email Templates (https://wrld.syncromsp.com/templates/email)
1. Advanced (caution) > Edit HTML of Email Wrapper: paste syncro/00-email-wrapper.html. Keep {{email_body}}. {{gray_social_links}} is intentionally removed: its icons are images with no text, so image-blocking clients (Spark, Outlook) showed stray dots. The footer carries LinkedIn / Facebook / X as text links instead.
   The wrapper is shared by every Syncro email (invoices, estimates, portal invites), so it carries nothing ticket-specific.
2. Edit each template, click Source, select all, paste the matching body file, Update Template:
   - Ticket Comment       -> syncro/ticket-comment.html           (framed latest reply + full conversation)
                             or syncro/ticket-comment.compact.html (conversation only, newest first, untruncated)
   - Ticket Created       -> syncro/ticket-created.html
   - Ticket Autoresponder -> syncro/ticket-autoresponder.html
   - Ticket Resolved      -> syncro/ticket-resolved.html
3. Preview each template (Preview link on the list page renders the last real ticket), then comment on a test ticket.

Tags, verified against the editor's Available Template Tags list on 2026-09-22:
  {{reply_above_line}}        Syncro's reply marker. First row of every ticket body. Keep it or inbound replies carry the whole quoted email.
  {{logo_100}}                Account logo, 100px. Not used (no dark-mode variant); hosted lockups instead.
  {{ticket_number}} {{ticket_subject}} {{ticket_status}} {{ticket_date}} {{ticket_url}} {{tech_name}}
  {{customer_first_name}} {{customer_full_name}}
  {{comment_body}} {{comment_sender_name}} {{comment_created_at}}
                              The comment that fired the email. Available in Ticket Comment, Ticket Created and Ticket Resolved;
                              NOT in Ticket Autoresponder.
  {{initial_comment_body}}    The original request. Used in Created / Autoresponder.
  {{ticket_public_comments_for_email}}
                              Every public comment, newest first, each cut at 2500 characters. Two <div>s per comment.
  {{ticket_public_fulltext_comments_for_email}}
                              Same, uncut. Used by the compact comment template.
  Wrapper only: {{email_body}} {{account_name}}  ({{gray_social_links}} exists but is not used)
Tags that do NOT exist (they render as literal text): {{ticket_comment_body}} {{location_logo_100}} {{YEAR}}.

Why the latest reply appears twice in ticket-comment.html: Syncro has no "history without the newest comment" tag, and
its history markup cannot be trimmed reliably with CSS across clients. The default template frames the new reply once
and labels the block below "Full conversation" so the repeat reads as intended. If the repeat bothers you, deploy the
compact variant instead.

Editor behaviour to know about: the Simple Editor is CKEditor 4. It rewrites pasted HTML (orphan <tr>s get their own
<table>, width attributes move into style, font names are lower-cased). The body files are therefore single, complete
tables, and the wrapper injects {{email_body}} inside a <td>. Do not hand-edit the bodies in the WYSIWYG view.

## Gleap (feedback / chat -> email)
Project > Settings > Email > Email templates
- Message reply -> select language > Source > paste gleap/message-reply.html (keeps mandatory {{{htmlContent}}} inside a <table> and {{unsubscribeLink}}).
- Ticket received / auto-reply -> gleap/auto-reply.html.
Optional: create a signature under Settings > Email > Signatures and drop its {{{signature "name"}}} variable under the Latest reply block.
Variables used: {{companyName}} {{{htmlContent}}} {{{conversationHistory}}} {{bugRef}} {{user.name}} {{profileImageUrl}} {{unsubscribeLink}} {{unsubscribeText}} {{feedbackId}} {{{formData}}} {{{screenshot}}} {{feedbackUrl}} {{receiverName}}.

## WHMCS / wrld.host (support@wrld.host)
Two paths. Choose one.

Path A - WRLD wrapper (recommended for full brand control)
1. Addons > Lagom Email Template: deactivate (or leave installed but disabled). Lagom's addon replaces the WHMCS header/footer and will fight this design.
2. Configuration > System Settings > General Settings > Mail:
   - Email Header Content: paste whmcs/00-global-email-header.html
   - Email Footer Content: paste whmcs/00-global-email-footer.html
   - Email CSS Styling: leave empty (styles are inline / in the header file).
3. Configuration > System Settings > Email Templates > edit each, Disable Rich Text Editor, paste:
   - Support Ticket Reply            -> whmcs/support-ticket-reply.html
   - Support Ticket Opened           -> whmcs/support-ticket-opened.html
   - Invoice Created                 -> whmcs/invoice-created.html
   - Invoice Payment Confirmation    -> whmcs/invoice-payment-confirmation.html
   - Invoice Payment Failed          -> whmcs/invoice-payment-failed.html
4. Upload whmcs/hooks/wrld_ticket_history.php to /includes/hooks/ to enable {$wrld_ticket_history}.

Path B - keep Lagom Email Template (fastest, less control)
1. Lagom addon > Style: Default. Set brand colors in Lagom Style Manager to mono-950 #0a0a0a primary, accent #00adee; upload the black lockup logo in Branding; footer copyright "(c) {$dateYear} WRLD Inc."; social links FB/LinkedIn/X/YouTube/Instagram.
2. Paste ONLY the *.lagom-body.html fragments into the template bodies (they carry no header/footer).
3. Still install the hook for {$wrld_ticket_history}.

Merge fields used: {$client_first_name} {$client_name} {$company_name} {$company_logo_url} {$whmcs_url} {$ticket_id} {$ticket_tid} {$ticket_subject} {$ticket_department} {$ticket_status} {$ticket_message} {$ticket_link} {$invoice_num} {$invoice_total} {$invoice_date_due} {$invoice_link} {$invoice_payment_link} {$invoice_payment_method} {$invoice_html_contents} {$date} plus custom {$wrld_ticket_history}.
Note: WHMCS does not allow changing sender or subject on support ticket templates (email piping).

## QA checklist before go-live
- Send one of each template to a Gmail, Outlook desktop (Windows), Outlook.com, Apple Mail (dark mode on) and iOS Mail.
- Confirm the logo swaps correctly in dark mode (transparent PNGs only).
- Confirm reply-by-email still threads into the ticket (Syncro "Reply above this line", WHMCS piping subject untouched).
- Check that history renders newest-first with one rule per comment and that sender names are not collapsed onto the date (Syncro emits line-height:0 on the name; the wrapper CSS overrides it).
- Syncro: confirm no literal {{...}} text survives in a sent email (open the raw message and search for "{{").
"""

if __name__ == "__main__":
    build()
