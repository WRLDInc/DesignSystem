"""WRLD email signatures: four directions, one data source per person.

    py -3 email/signature.py      # writes email/signatures/<person>/<direction>.html + index.html

Every image is hotlinked from wrld.design (PNG only; Gmail and Outlook drop SVG).
Inline styles only: signature fields in Spark, Outlook and Gmail strip <head> CSS.
"""
import html
from pathlib import Path

from build import T, FONT_DISPLAY, FONT_BODY, FONT_MONO, ADDRESS

ROOT = Path(__file__).parent / "signatures"
ASSETS = "https://wrld.design/assets/logos"
LOGO_BLACK = f"{ASSETS}/wrld-tech-black.png"        # 999x173, transparent: light surfaces only
LOGO_WHITE = f"{ASSETS}/wrld-tech-white.png"        # 999x173, transparent: dark surfaces only
MARK_TILE = f"{ASSETS}/favicons/favicon-256x256.png"  # starburst on #0a0a0a: survives dark mode

MAP_URL = "https://g.page/wrldtech"
PROPERTIES = [("WRLD.tech", "https://wrld.tech"), ("WRLD.host", "https://wrld.host"), ("WRLD.AI", "https://wrld.ai")]
SOCIALS = [
    ("LinkedIn", "https://linkedin.com/company/wrldtech"),
    ("Facebook", "https://facebook.com/WRLDTechCo"),
    ("X", "https://x.com/WRLDTechCo"),
    ("Instagram", "https://instagram.com/wrldtechco"),
    ("Teams", "https://teams.microsoft.com/l/team/19%3Aa6H9kVWXIiPQKY-2rYCoCpW1hbhw1rv6amcmh0aJ7HA1%40thread.tacv2/conversations?groupId=35c9b1e9-ea3a-41a9-8eb3-76b4861756f8&tenantId=5625da99-1355-4fea-accf-2a83bef5ce42"),
    ("GitHub", "https://github.com/WRLDInc"),
]
CTAS = [("Schedule a meeting", "https://calendar.wrld.tech/?utm_source=emailsignature&utm_medium=email"),
        ("View the WRLD Directory", "https://wrld.one/?utm_source=emailsignature&utm_medium=email")]

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


def button(label, href, solid=True):
    bg, fg, border = (INK, T["mono0"], INK) if solid else (T["mono0"], INK, T["mono300"])
    return (f'<td style="background-color:{bg};border:1px solid {border};border-radius:4px;mso-padding-alt:7px 14px;">'
            f'<a href="{esc(href)}" target="_blank" style="display:inline-block;font-family:{FONT_BODY};font-size:12px;'
            f'line-height:16px;font-weight:500;color:{fg};text-decoration:none;padding:7px 14px;border-radius:4px;">'
            f'{esc(label)}&nbsp;&rarr;</a></td>')


def buttons():
    return table(tr(button(*CTAS[0]), '<td style="width:8px;font-size:0;">&nbsp;</td>', button(*CTAS[1], solid=False)))


def logo(src, width, alt="WRLD Tech", href="https://wrld.tech"):
    h = round(width * 173 / 999)
    return (f'<a href="{href}" target="_blank" style="text-decoration:none;"><img src="{src}" width="{width}" height="{h}" '
            f'alt="{alt}" style="display:block;width:{width}px;height:auto;border:0;font-family:{FONT_DISPLAY};'
            f'font-size:13px;font-weight:700;color:{INK};"></a>')


def mark(size):
    return (f'<a href="https://wrld.tech" target="_blank" style="text-decoration:none;"><img src="{MARK_TILE}" '
            f'width="{size}" height="{size}" alt="WRLD" style="display:block;width:{size}px;height:{size}px;border:0;'
            f'border-radius:4px;"></a>')


def rule(color=RULE): return tr(f'<td style="border-top:1px solid {color};font-size:0;line-height:0;height:1px;">&nbsp;</td>')


# ---- Directions -------------------------------------------------------------

def split_stack(p):
    """Logo column, hairline divider, details column. Closest to the current layout."""
    left = td(mark(56) + f'<div style="height:10px;font-size:0;">&nbsp;</div>' + logo(LOGO_BLACK, 96),
              "vertical-align:top;width:96px;padding-right:20px;")
    right = table(
        tr(td(name_block(p))) + tr(td(eyebrow(p["company"]), "padding-top:2px;")) + gap(10)
        + tr(td(contact_rows(p))) + gap(10)
        + tr(td(joined(PROPERTIES, weight=500))) + tr(td(joined(SOCIALS, MUTED), "font-size:11px;"))
        + gap(12) + tr(td(buttons())))
    divider = f'<td style="width:1px;background-color:{RULE};font-size:0;">&nbsp;</td>'
    return table(tr(left, divider, td(right, "vertical-align:top;padding-left:20px;")), 480)


def ledger_line(p):
    """Single column, rules between groups. Reads well narrow; mirrors the ledger email direction."""
    return table(
        tr(td(logo(LOGO_BLACK, 132))) + gap(14)
        + tr(td(name_block(p, 17))) + tr(td(eyebrow(p["company"]), "padding-top:2px;")) + gap(12)
        + rule() + gap(10) + tr(td(contact_rows(p))) + gap(10) + rule() + gap(8)
        + tr(td(joined(PROPERTIES, weight=500) + SEP
                + joined(SOCIALS, MUTED), "font-size:11px;"))
        + gap(12) + tr(td(buttons())), 440)


def signal_strip(p):
    """Dark band with the white lockup and name, light body below. Mirrors the signal email direction."""
    band = table(
        tr(td(logo(LOGO_WHITE, 112), "vertical-align:middle;"),
           td(f'<div style="font-family:{FONT_DISPLAY};font-size:15px;line-height:19px;font-weight:600;color:{T["mono0"]};">'
              f'{esc(p["name"])}</div><div style="font-family:{FONT_BODY};font-size:11px;line-height:16px;color:{T["mono400"]};">'
              f'{esc(p["title"])}</div>', "vertical-align:middle;text-align:right;")),
        extra="width:100%;")
    body = table(
        tr(td(eyebrow(p["company"]))) + gap(8) + tr(td(contact_rows(p))) + gap(10)
        + tr(td(joined(PROPERTIES, weight=500) + SEP + joined(SOCIALS, MUTED), "font-size:11px;"))
        + gap(12) + tr(td(buttons())), extra="width:100%;")
    # Explicit white body (bgcolor for Outlook) so the card reads as a card on grey or dark message panes.
    return table(
        tr(td(band, f"background-color:{INK};padding:14px 18px;border-radius:8px 8px 0 0;"))
        + tr(td(body, f"background-color:{T['mono0']};padding:14px 18px 16px;border:1px solid {RULE};"
                      f"border-top:0;border-radius:0 0 8px 8px;").replace("<td ", f'<td bgcolor="{T["mono0"]}" ', 1)),
        480, f"background-color:{T['mono0']};")


def minimal_mark(p):
    """Mark tile plus three tight lines. Built for replies and mobile; dark-mode safe end to end."""
    contacts = (a(p["email"], f"mailto:{p['email']}") + dot() + a("O " + p["office"][0], p["office"][1])
                + dot() + a("D " + p["direct"][0], p["direct"][1]))
    links = (joined(PROPERTIES, weight=500) + SEP + a("Schedule", CTAS[0][1], INK, 500)
             + SEP + a("WRLD Directory", CTAS[1][1], INK, 500))
    right = table(
        tr(td(f'<span style="font-family:{FONT_DISPLAY};font-size:14px;font-weight:600;color:{INK};">{esc(p["name"])}</span>'
              f'<span style="color:{MUTED};">&nbsp;&nbsp;{esc(p["title"])}</span>'))
        + tr(td(eyebrow(p["company"])))
        + tr(td(contacts, "font-size:11px;padding-top:4px;"))
        + tr(td(a(ADDRESS, MAP_URL, MUTED), "font-size:11px;"))
        + tr(td(links, "font-size:11px;"))
        + tr(td(joined(SOCIALS, MUTED), "font-size:10px;")))
    return table(tr(td(mark(48), "vertical-align:top;padding-right:14px;"), td(right, "vertical-align:top;")), 460)


DIRECTIONS = {
    "split-stack": ("Split stack", split_stack, "Mark and lockup on the left, details on the right. Closest to today's layout."),
    "ledger-line": ("Ledger line", ledger_line, "One column with hairline rules. Calm, narrow, mobile-friendly."),
    "signal-strip": ("Signal strip", signal_strip, "Ink band with the white lockup. The boldest; matches the signal email direction."),
    "minimal-mark": ("Minimal mark", minimal_mark, "Mark tile and three lines. For replies and threads; dark-mode safe."),
}


def wrap(sig):
    # data-spark-custom-html keeps Spark from re-flowing the markup, same as the original signature.
    return f'<div data-spark-custom-html="true"><div dir="auto">{sig}</div></div>\n'


DARK_MODE = {
    "split-stack": ("Partial", "Mark tile survives dark mode; the small black lockup under it can fade on dark clients."),
    "ledger-line": ("At risk", "Black lockup on a transparent PNG; clients that darken the page without touching images hide it."),
    "signal-strip": ("Safe", "White lockup on an ink band reads in both modes."),
    "minimal-mark": ("Safe", "Only the ink mark tile; text inherits the client's dark mode."),
}


def build_index(slug="ridgeway-lawrence"):
    """Comparison page for review. Artifacts block remote images, so previews swap in data: copies
    of the same wrld.design PNGs; the copy buttons hand out the real hotlinked HTML."""
    import base64, json
    repo = Path(__file__).parent.parent / "assets" / "logos"
    local = {LOGO_BLACK: repo / "wrld-tech-black.png", LOGO_WHITE: repo / "wrld-tech-white.png",
             MARK_TILE: repo / "favicons" / "favicon-256x256.png"}
    swap = {url: "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode() for url, p in local.items()}
    cards, data = [], {}
    for key, (title, fn, blurb) in DIRECTIONS.items():
        sig = fn(PEOPLE[slug])
        preview = sig
        for url, uri in swap.items():
            preview = preview.replace(url, uri)
        data[key] = sig
        state, note = DARK_MODE[key]
        cards.append(f"""<article class="card">
  <header><h2>{title}</h2><span class="chip chip-{state.lower().replace(' ', '-')}" title="{esc(note)}">Dark mode: {state}</span></header>
  <p class="blurb">{esc(blurb)}</p>
  <div class="mail"><div class="mail-body">Thanks, talk soon.</div><div class="mail-sig">{preview}</div></div>
  <p class="note">{esc(note)}</p>
  <div class="actions"><button type="button" data-copy="{key}" data-mode="rich">Copy signature</button><button type="button" class="ghost" data-copy="{key}" data-mode="html">Copy HTML</button><span class="status" aria-live="polite"></span></div>
  <p class="path">email/signatures/{slug}/{key}.html</p>
</article>""")
    page = INDEX.replace("{{CARDS}}", "\n".join(cards)).replace("{{DATA}}", json.dumps(data).replace("</", "<\\/"))
    out = Path(__file__).parent / "dist" / "signatures.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    print(f"wrote {out}")


INDEX = """<title>WRLD email signatures</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&family=Ubuntu:wght@400;500&family=Ubuntu+Mono&display=swap">
<style>
/* Layout: one reading column of four review cards; each card holds a white message pane, since signatures land on message bodies. */
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
h2 { font-family: var(--display); font-size: 18px; font-weight: 600; letter-spacing: -0.01em; margin: 0; }
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
    <p class="eyebrow">wrld.design · email signatures</p>
    <h1>Ridgeway's signature in four directions</h1>
    <p class="lede">Same content as the current signature, rebuilt on WRLD design system tokens. Every image is hotlinked from wrld.design, CTAs are live HTML buttons instead of images, and socials are text links so nothing depends on a third-party icon host.</p>
  </div>
  <div class="grid">
{{CARDS}}
  </div>
  <div class="notes">
    <section><h3>What changed</h3><ul>
      <li>Images now come from <code>wrld.design/assets/logos</code>; the img.email and icns.email hosts are gone.</li>
      <li>Blue static labels, ALL CAPS title and the pin emoji replaced with monochrome eyebrow labels and sentence case.</li>
      <li>Schedule and WRLD Directory buttons are text, so they render with images off and scale on retina. Both carry <code>utm_source=emailsignature</code> and <code>utm_medium=email</code> so analytics files the clicks under Email.</li>
      <li>Phone links use dialable <code>tel:+1…</code> numbers; the office extension dials through.</li>
      <li>Twitter now points to x.com; the same handle.</li>
    </ul></section>
    <section><h3>Install in Spark</h3><ol>
      <li>Settings → Signatures → add or edit a signature.</li>
      <li>Use Copy HTML here, then paste into the HTML signature editor.</li>
      <li>Send a test to an Outlook and a Gmail address before rolling it out.</li>
    </ol></section>
    <section><h3>Install in Outlook</h3><ol>
      <li>Use Copy signature (rich text) here.</li>
      <li>Settings → Mail → Compose and reply → new signature → paste.</li>
      <li>Outlook desktop ignores rounded corners; the layout holds.</li>
    </ol></section>
  </div>
</div>
<script id="sigs" type="application/json">{{DATA}}</script>
<script>
const SIGS = JSON.parse(document.getElementById('sigs').textContent);
const WRAP = h => '<div data-spark-custom-html="true"><div dir="auto">' + h + '</div></div>';
function selectFallback(html) {
  const ta = document.createElement('textarea');
  ta.value = html; document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove(); return ok;
}
document.addEventListener('click', async e => {
  const btn = e.target.closest('button[data-copy]'); if (!btn) return;
  const html = WRAP(SIGS[btn.dataset.copy]);
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
</script>
"""


def main():
    for slug, person in PEOPLE.items():
        out = ROOT / slug
        out.mkdir(parents=True, exist_ok=True)
        for key, (_, fn, _) in DIRECTIONS.items():
            (out / f"{key}.html").write_text(wrap(fn(person)), encoding="utf-8")
            print(f"wrote {out / key}.html")
    build_index()


if __name__ == "__main__":
    main()
