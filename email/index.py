"""Build dist/index.html: the WRLD Email System spec page (Artifact)."""
import html, json, re
from pathlib import Path
from build import T, TITLES, DIRECTIONS

ROOT = Path(__file__).parent
DIST = ROOT / "dist"

def esc(s): return html.escape(s, quote=True)

DIR_META = {
    "ledger": ("Ledger", "Quiet card on a mono ground. Logo and ticket number float above the card; everything else is hairlines and type. Closest to the current look, least risk in Outlook.", "Lowest visual change, fastest approval"),
    "signal": ("Signal", "Near-black header band carries the white lockup and ticket number. The brand shows up before the client reads a word. Best when emails sit next to vendor emails in a crowded inbox.", "Strongest brand recognition"),
    "thread": ("Thread", "Conversation-first. The latest reply is a framed message on a muted panel; the full conversation follows as a quiet, ruled list, newest first. Designed around the complaint that clients lose context.", "Recommended"),
}
PLATFORM_ORDER = [("syncro", "Syncro (helpdesk@wrld.tech)"), ("gleap", "Gleap (in-app and email support)"), ("whmcs", "WHMCS / wrld.host (support@wrld.host)")]

VARS = {
    "syncro": [
        ("{{email_body}}", "Wrapper only. Where each template is injected, inside a <td>. Mandatory."),
        ("{{gray_social_links}} {{account_name}}", "Wrapper footer tags."),
        ("{{reply_above_line}}", "Syncro's reply marker. First row of every ticket body so inbound replies are trimmed."),
        ("{{logo_100}}", "Account logo at 100px (Admin > Account Settings). {{location_logo_100}} does not exist."),
        ("{{ticket_number}} {{ticket_subject}} {{ticket_status}}", "Header, title and status chip."),
        ("{{tech_name}} {{ticket_date}}", "Meta rows."),
        ("{{customer_first_name}} {{customer_full_name}}", "Greeting."),
        ("{{comment_body}} {{comment_sender_name}} {{comment_created_at}}", "The comment that fired the email. Ticket Comment, Created and Resolved only (not Autoresponder). {{ticket_comment_body}} does not exist."),
        ("{{ticket_public_comments_for_email}}", "All public comments, newest first, each cut at 2500 chars. Two <div>s per comment; the wrapper CSS restyles them."),
        ("{{ticket_public_fulltext_comments_for_email}}", "Same, uncut. Used by the compact comment template."),
        ("{{initial_comment_body}}", "Original request, used in Created / Autoresponder."),
        ("{{ticket_url}}", "Deep link into the ticket."),
    ],
    "gleap": [
        ("{{{htmlContent}}}", "The reply. Mandatory, must sit inside a <table>."),
        ("{{{conversationHistory}}}", "Prior messages in the conversation. The context block."),
        ("{{bugRef}}", "Ticket reference (#736)."),
        ("{{user.name}} {{profileImageUrl}}", "Replying agent's name and photo."),
        ("{{companyName}} {{projectName}}", "Brand strings from project settings."),
        ("{{unsubscribeLink}} {{unsubscribeText}}", "Mandatory on reply template."),
        ("{{feedbackId}} {{feedbackUrl}} {{receiverName}}", "Auto-reply template."),
        ("{{{formData}}} {{{screenshot}}}", "Auto-reply: what the customer submitted."),
        ('{{{signature "name"}}}', "Optional. Created under Settings > Email > Signatures."),
    ],
    "whmcs": [
        ("{$client_first_name} {$client_name} {$client_email}", "Greeting."),
        ("{$company_name} {$company_logo_url} {$whmcs_url} {$whmcs_link}", "Brand and links. Confirm {$company_logo_url} in the merge-field list under the editor."),
        ("{$ticket_tid} {$ticket_id} {$ticket_subject} {$ticket_department} {$ticket_status} {$ticket_priority}", "Header, title, meta."),
        ("{$ticket_message}", "The reply being sent."),
        ("{$ticket_link}", "Deep link to viewticket.php."),
        ("{$wrld_ticket_history}", "Custom. Added by includes/hooks/wrld_ticket_history.php. Prior replies, newest first."),
        ("{$invoice_num} {$invoice_total} {$invoice_date_due} {$invoice_date_created}", "Invoice header and chip."),
        ("{$invoice_html_contents}", "Line items table as WHMCS renders it."),
        ("{$invoice_link} {$invoice_payment_link} {$invoice_payment_method}", "CTAs."),
        ("{$date|date_format:'%Y'}", "Copyright year."),
    ],
}

STEPS = {
    "syncro": [
        "Admin > Syncro Administration - PDF/Email Templates > Email Templates.",
        "Bottom of the list: Advanced (caution) > Edit HTML of Email Wrapper. Replace with 00-email-wrapper.html. Keep {{email_body}} and {{gray_social_links}}. The wrapper is shared by invoices and estimates too, so nothing ticket-specific lives in it.",
        "Edit Ticket Comment, Ticket Created, Ticket Autoresponder, Ticket Resolved. Click Source, select all, paste the matching file, Update Template. The editor is CKEditor 4 and rewrites pasted HTML, which is why each body is one complete table. Never touch the bodies in the WYSIWYG view.",
        "Ticket Comment ships in two variants. ticket-comment.html frames the new reply, then shows the full conversation (the new reply appears again at the top of it, because Syncro has no history-minus-latest tag). ticket-comment.compact.html shows the conversation only, newest first, untruncated.",
        "Preview each (the Preview link renders the last real ticket), then comment on a test ticket assigned to your own contact and open it in Spark, Outlook and on a phone. Search the raw message for \"{{\" to catch unresolved tags.",
    ],
    "gleap": [
        "Project > Settings > Email > Email templates > Message reply. Pick the language, click Source, paste message-reply.html.",
        "Repeat for the ticket-received auto-reply with auto-reply.html.",
        "Optional: create a team signature and drop its variable under the Latest reply block.",
        "Reply to a test ticket while logged out of the widget so Gleap falls back to email after 3 minutes.",
    ],
    "whmcs": [
        "Path A (recommended): deactivate Addons > Lagom Email Template. Configuration > System Settings > General Settings > Mail: paste 00-global-email-header.html into Email Header Content and 00-global-email-footer.html into Email Footer Content. Leave Email CSS Styling empty.",
        "Configuration > System Settings > Email Templates: open each template, Disable Rich Text Editor, paste the body file (Support Ticket Reply, Support Ticket Opened, Invoice Created, Invoice Payment Confirmation, Invoice Payment Failed).",
        "Upload hooks/wrld_ticket_history.php to /includes/hooks/ so {$wrld_ticket_history} resolves.",
        "Path B (keep Lagom): set Lagom Style Manager primary to #0a0a0a, accent to #00adee, upload the WRLD.HOST lockup in Branding, then paste only the *.lagom-body.html fragments. Still install the hook.",
    ],
}

def read(p): return (DIST / p).read_text()

def srcdoc(path):
    return esc(read(path))

def preview_block(direction, key):
    p = f"mockups/{direction}/{key}.html"
    sd = srcdoc(p)
    return f"""
<figure class="preview" data-dir="{direction}" data-key="{key}">
  <figcaption><span class="cap-title">{esc(TITLES[key])}</span><span class="cap-meta"><button class="pill on" data-w="desktop" type="button">Desktop</button><button class="pill" data-w="mobile" type="button">Mobile</button><button class="pill" data-w="dark" type="button">Dark</button></span></figcaption>
  <div class="frame desktop"><iframe title="{esc(TITLES[key])} {direction}" loading="lazy" srcdoc="{sd}"></iframe></div>
</figure>"""

def code_block(direction, platform, fname):
    path = DIST / "templates" / direction / platform / fname
    code = path.read_text()
    return f"""
<details class="code" data-dir="{direction}">
  <summary><code>{esc(platform)}/{esc(fname)}</code><span class="size">{len(code):,} chars</span><button class="copy" type="button">Copy</button></summary>
  <pre><code>{esc(code)}</code></pre>
</details>"""

def build_index():
    previews = []
    keys_by_platform = {
        "syncro": ["syncro-ticket-comment", "syncro-ticket-comment-compact", "syncro-ticket-created", "syncro-ticket-resolved"],
        "gleap": ["gleap-message-reply", "gleap-auto-reply"],
        "whmcs": ["whmcs-support-ticket-reply", "whmcs-support-ticket-opened", "whmcs-invoice-created", "whmcs-invoice-paid", "whmcs-invoice-failed"],
    }
    files_by_platform = {
        "syncro": ["00-email-wrapper.html", "ticket-comment.html", "ticket-comment.compact.html", "ticket-created.html", "ticket-autoresponder.html", "ticket-resolved.html"],
        "gleap": ["message-reply.html", "auto-reply.html"],
        "whmcs": ["00-global-email-header.html", "00-global-email-footer.html", "support-ticket-reply.html", "support-ticket-opened.html", "invoice-created.html", "invoice-payment-confirmation.html", "invoice-payment-failed.html", "support-ticket-reply.lagom-body.html", "hooks/wrld_ticket_history.php"],
    }

    dir_tabs = "".join(f'<button class="tab{" on" if d == "thread" else ""}" data-dir="{d}" type="button"><span class="tab-name">{DIR_META[d][0]}</span><span class="tab-tag">{DIR_META[d][2]}</span></button>' for d in DIRECTIONS)
    dir_desc = "".join(f'<p class="dir-desc" data-dir="{d}" {"" if d == "thread" else "hidden"}>{esc(DIR_META[d][1])}</p>' for d in DIRECTIONS)

    platform_sections = []
    for pid, plabel in PLATFORM_ORDER:
        prev = "".join(preview_block(d, k) for d in DIRECTIONS for k in keys_by_platform[pid])
        codes = "".join(code_block(d, pid, f) for d in DIRECTIONS for f in files_by_platform[pid])
        vars_rows = "".join(f"<tr><td><code>{esc(v)}</code></td><td>{esc(n)}</td></tr>" for v, n in VARS[pid])
        steps = "".join(f"<li>{esc(s)}</li>" for s in STEPS[pid])
        platform_sections.append(f"""
<section class="platform" id="{pid}">
  <header class="sec-head"><span class="eyebrow">Platform</span><h2>{esc(plabel)}</h2></header>
  <div class="previews">{prev}</div>
  <div class="two">
    <div>
      <h3>Variables used</h3>
      <div class="tablewrap"><table class="vars"><tbody>{vars_rows}</tbody></table></div>
    </div>
    <div>
      <h3>Deploy</h3>
      <ol class="steps">{steps}</ol>
    </div>
  </div>
  <h3>Copy and paste</h3>
  <p class="muted">Files for the direction selected above. Replace the logo placeholders once (see Foundations), then paste.</p>
  {codes}
</section>""")

    tokens_rows = "".join(f'<tr><td><span class="swatch" style="background:{v}"></span><code>{k}</code></td><td><code>{v}</code></td><td>{u}</td></tr>' for k, v, u in [
        ("mono-100", T["mono100"], "Email ground (page background)."),
        ("mono-0", T["mono0"], "Card surface."),
        ("mono-200", T["mono200"], "Hairlines, card border, chip border."),
        ("mono-950", T["mono950"], "Headings, body text, primary button, Signal header band."),
        ("mono-600 / 500 / 400", T["mono500"], "History text, meta labels, footer, timestamps."),
        ("accent-primary", T["accentPrimary"], "Status chip dot and label on wrld.tech tickets. Never a fill."),
        ("accent-secondary", T["accentSecondary"], "Status chip on wrld.host tickets and the .HOST rule in the lockup."),
        ("accent-warm", T["accentWarm"], "Commerce CTA only: Pay invoice, Update payment method."),
        ("success / danger", T["success"], "Resolved, Paid / Payment failed chips. Semantic, not brand."),
    ])

    page = f"""<title>WRLD Email System</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Ubuntu:wght@400;500;700&family=Ubuntu+Mono&display=swap">
<style>
:root {{
  --bg:{T['mono0']}; --bg-subtle:{T['mono50']}; --bg-muted:{T['mono100']}; --fg:{T['mono950']}; --fg-muted:{T['mono600']}; --fg-subtle:{T['mono500']};
  --border:{T['mono200']}; --border-strong:{T['mono300']}; --accent:{T['accentPrimary']}; --warm:{T['accentWarm']}; --code-bg:{T['mono50']};
  --display:Montserrat,'Helvetica Neue',Arial,sans-serif; --body:Ubuntu,system-ui,sans-serif; --mono:'Ubuntu Mono',ui-monospace,Menlo,monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:{T['mono950']}; --bg-subtle:{T['mono900']}; --bg-muted:{T['mono800']}; --fg:{T['mono50']}; --fg-muted:{T['mono400']}; --fg-subtle:{T['mono500']}; --border:{T['mono800']}; --border-strong:{T['mono700']}; --code-bg:{T['mono900']}; }} }}
:root[data-theme="dark"] {{ --bg:{T['mono950']}; --bg-subtle:{T['mono900']}; --bg-muted:{T['mono800']}; --fg:{T['mono50']}; --fg-muted:{T['mono400']}; --fg-subtle:{T['mono500']}; --border:{T['mono800']}; --border-strong:{T['mono700']}; --code-bg:{T['mono900']}; }}
* {{ box-sizing:border-box; }}
body {{ margin:0; background:var(--bg); color:var(--fg); font-family:var(--body); font-size:16px; line-height:1.6; padding-inline:clamp(16px,4vw,48px); padding-block:0 96px; }}
a {{ color:inherit; text-decoration:underline; text-underline-offset:2px; }}
a:hover {{ color:var(--accent); }}
h1,h2,h3 {{ font-family:var(--display); letter-spacing:-0.02em; line-height:1.15; text-wrap:balance; margin:0; }}
h1 {{ font-size:clamp(30px,4.5vw,48px); font-weight:700; }}
h2 {{ font-size:clamp(22px,3vw,30px); font-weight:600; }}
h3 {{ font-size:18px; font-weight:600; margin:32px 0 10px; }}
p {{ margin:0 0 14px; max-width:68ch; }}
.muted {{ color:var(--fg-muted); }}
code {{ font-family:var(--mono); font-size:0.92em; }}
.eyebrow {{ display:block; font-family:var(--display); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--fg-subtle); margin-bottom:8px; }}
.wrap {{ max-width:1280px; margin:0 auto; }}
.masthead {{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:20px 0; border-bottom:1px solid var(--border); position:sticky; top:env(safe-area-inset-top,0px); background:var(--bg); z-index:5; flex-wrap:wrap; }}
.masthead .mark {{ width:28px; height:28px; }}
.masthead nav {{ display:flex; gap:18px; flex-wrap:wrap; font-size:14px; }}
.masthead nav a {{ text-decoration:none; color:var(--fg-muted); }}
.masthead nav a:hover {{ color:var(--fg); }}
.intro {{ padding:56px 0 40px; display:grid; grid-template-columns:minmax(0,1.4fr) minmax(0,1fr); gap:40px; align-items:start; }}
.intro .lede {{ font-size:19px; color:var(--fg-muted); max-width:56ch; }}
.problem {{ border:1px solid var(--border); padding:20px 22px; background:var(--bg-subtle); font-size:15px; }}
.problem strong {{ font-weight:500; }}
.problem ul {{ margin:8px 0 0 18px; padding:0; }}
.problem li {{ margin:4px 0; }}
.sec-head {{ margin:64px 0 20px; padding-top:32px; border-top:1px solid var(--border); }}
.tabs {{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1px; background:var(--border); border:1px solid var(--border); margin:20px 0 14px; }}
.tab {{ background:var(--bg); border:0; padding:16px 18px; text-align:left; cursor:pointer; font:inherit; color:var(--fg); display:flex; flex-direction:column; gap:4px; }}
.tab:hover {{ background:var(--bg-subtle); }}
.tab.on {{ background:var(--fg); color:var(--bg); }}
.tab-name {{ font-family:var(--display); font-weight:600; font-size:17px; }}
.tab-tag {{ font-size:12px; letter-spacing:0.06em; text-transform:uppercase; opacity:0.75; }}
.tab:focus-visible {{ outline:3px solid rgb(0 127 238 / .35); outline-offset:-3px; }}
.dir-desc {{ min-height:3.2em; }}
.previews {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,600px),1fr)); gap:24px; margin-top:20px; }}
.preview {{ margin:0; border:1px solid var(--border); background:var(--bg-subtle); }}
.preview figcaption {{ display:flex; justify-content:space-between; align-items:center; gap:8px; padding:10px 12px; border-bottom:1px solid var(--border); font-size:13px; flex-wrap:wrap; }}
.cap-title {{ font-weight:500; }}
.cap-meta {{ display:flex; gap:4px; }}
.pill {{ font:inherit; font-size:12px; padding:3px 10px; border:1px solid var(--border-strong); background:transparent; color:var(--fg-muted); cursor:pointer; border-radius:9999px; }}
.pill.on {{ background:var(--fg); color:var(--bg); border-color:var(--fg); }}
.frame {{ background:{T['mono100']}; display:flex; justify-content:center; padding:0; height:720px; overflow:hidden; }}
.frame iframe {{ border:0; width:100%; height:100%; background:transparent; color-scheme:light; }}
.frame.mobile iframe {{ width:390px; max-width:100%; box-shadow:0 0 0 1px var(--border); }}
.frame.dark iframe {{ width:390px; max-width:100%; color-scheme:dark; }}
.frame.dark {{ background:{T['mono950']}; }}
.two {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:32px; }}
.tablewrap {{ overflow-x:auto; border:1px solid var(--border); }}
table.vars, table.tokens {{ width:100%; border-collapse:collapse; font-size:14px; }}
table.vars td, table.tokens td {{ padding:10px 12px; border-top:1px solid var(--border); vertical-align:top; }}
table.vars tr:first-child td, table.tokens tr:first-child td {{ border-top:0; }}
table.vars td:first-child {{ white-space:nowrap; }}
table.vars code {{ background:var(--code-bg); padding:1px 5px; }}
.swatch {{ display:inline-block; width:14px; height:14px; border:1px solid var(--border-strong); vertical-align:-2px; margin-right:8px; }}
ol.steps {{ margin:0; padding-left:20px; }}
ol.steps li {{ margin:0 0 10px; font-size:15px; }}
details.code {{ border:1px solid var(--border); margin:8px 0; background:var(--bg-subtle); }}
details.code summary {{ display:flex; align-items:center; gap:12px; padding:10px 14px; cursor:pointer; list-style:none; font-size:14px; }}
details.code summary::-webkit-details-marker {{ display:none; }}
details.code summary::before {{ content:"+"; font-family:var(--mono); color:var(--fg-subtle); width:12px; }}
details.code[open] summary::before {{ content:"-"; }}
details.code .size {{ margin-left:auto; color:var(--fg-subtle); font-size:12px; }}
.copy {{ font:inherit; font-size:12px; padding:4px 10px; border:1px solid var(--border-strong); background:var(--bg); color:var(--fg); cursor:pointer; }}
.copy:hover {{ border-color:var(--fg); }}
details.code pre {{ margin:0; padding:14px; background:var(--code-bg); border-top:1px solid var(--border); overflow-x:auto; max-height:520px; font-size:12.5px; line-height:1.5; }}
.grid3 {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:20px; }}
.rule-card {{ border:1px solid var(--border); padding:18px 20px; font-size:15px; }}
.rule-card h4 {{ margin:0 0 6px; font-family:var(--display); font-size:15px; font-weight:600; }}
.rule-card p {{ margin:0; color:var(--fg-muted); }}
.anatomy {{ border:1px solid var(--border); overflow-x:auto; }}
.anatomy pre.mermaid {{ margin:0; padding:16px; background:var(--bg-subtle); }}
.check {{ columns:2; column-gap:32px; font-size:15px; padding-left:20px; }}
.check li {{ break-inside:avoid; margin-bottom:8px; }}
@media (max-width:760px) {{ .intro {{ grid-template-columns:1fr; }} .tabs {{ grid-template-columns:1fr; }} .check {{ columns:1; }} .frame {{ height:600px; }} }}
@media (prefers-reduced-motion:no-preference) {{ .tab, .pill, .copy {{ transition:background .2s cubic-bezier(.2,.8,.2,1), color .2s; }} }}
</style>

<div class="wrap">
<header class="masthead">
  <div style="display:flex;align-items:center;gap:12px">
    <svg class="mark" viewBox="0 0 200 200" aria-hidden="true"><g fill="currentColor">{re.search(r'<g fill="#0a0a0a">(.*?)</g>', (ROOT/'assets'/'wrld-mark-black.svg').read_text(), re.S).group(1)}</g></svg>
    <span style="font-family:var(--display);font-weight:700;letter-spacing:0.02em">WRLD Email System</span>
  </div>
  <nav><a href="#directions">Directions</a><a href="#foundations">Foundations</a><a href="#syncro">Syncro</a><a href="#gleap">Gleap</a><a href="#whmcs">WHMCS</a><a href="#qa">QA</a></nav>
</header>

<section class="intro">
  <div>
    <span class="eyebrow">Transactional email design system v1.0</span>
    <h1>One voice across Syncro, Gleap and wrld.host</h1>
    <p class="lede">A shared layout, token set and component kit for every automated email WRLD sends, with the full conversation attached so clients never have to hunt for context. Three visual directions, ten templates, copy-paste ready for each platform.</p>
  </div>
  <aside class="problem">
    <strong>What this fixes</strong>
    <ul>
      <li>Ticket emails read as one-off notes. History is present in Syncro but buried under a plain "History:" heading with no hierarchy.</li>
      <li>Three platforms, three looks: Syncro blue rules, Gleap indigo default, WHMCS navy Lagom skin with Roboto. None use WRLD type or tokens.</li>
      <li>Fixed-width 600px tables with no mobile stacking, no dark-mode handling, and PNG logos that vanish in Outlook.</li>
      <li>Phone numbers, portal links and legal footer differ email to email.</li>
    </ul>
  </aside>
</section>

<section id="directions">
  <header class="sec-head"><span class="eyebrow">Choose one</span><h2>Three directions, one system</h2></header>
  <p class="muted">Same components, same copy, same variables. Only the header treatment and how the conversation is framed change. Pick one and every preview and code block on this page follows.</p>
  <div class="tabs" role="tablist">{dir_tabs}</div>
  {dir_desc}
</section>

<section id="foundations">
  <header class="sec-head"><span class="eyebrow">Foundations</span><h2>Tokens, type and rules</h2></header>
  <div class="two">
    <div>
      <h3>Color</h3>
      <div class="tablewrap"><table class="tokens"><tbody>{tokens_rows}</tbody></table></div>
    </div>
    <div>
      <h3>Type</h3>
      <div class="tablewrap"><table class="tokens"><tbody>
        <tr><td><code>display</code></td><td>Montserrat 600, 24/30, -0.02em</td><td>Email title (h1). 22/28 under 620px.</td></tr>
        <tr><td><code>body</code></td><td>Ubuntu 400, 16/24</td><td>Message text. Never below 16px on the primary message.</td></tr>
        <tr><td><code>body-sm</code></td><td>Ubuntu 400, 14/21</td><td>History, meta rows, help strip.</td></tr>
        <tr><td><code>eyebrow</code></td><td>Ubuntu 500, 12/16, 0.12em caps</td><td>Section labels: Latest reply, Earlier in this ticket.</td></tr>
        <tr><td><code>mono</code></td><td>Ubuntu Mono 400, 12/16</td><td>Ticket, invoice and conversation references.</td></tr>
        <tr><td><code>caption</code></td><td>Ubuntu 400, 12/18</td><td>Footer, legal, unsubscribe.</td></tr>
      </tbody></table></div>
      <p class="muted" style="margin-top:12px;font-size:14px">Fonts load from Google Fonts where the client allows it (Apple Mail, iOS, Outlook for Mac, Thunderbird). Gmail and Outlook for Windows fall back to Helvetica Neue / Arial, which the layout is tuned for.</p>
    </div>
  </div>

  <h3>Anatomy</h3>
  <div class="anatomy"><pre class="mermaid">
flowchart TB
  A["Header: lockup + reference (Ticket #, Invoice #, Conversation #)"] --> B["Kicker + title + status chip"]
  B --> C["Latest reply: sender, time, message body (16px)"]
  C --> D["Meta rows: ticket, status, assigned to, opened"]
  D --> E["CTA row: primary button + text link"]
  E --> F["Earlier in this ticket: platform history tag, newest first"]
  F --> G["Help strip: reply hint + phone lines"]
  G --> H["Footer: links, legal, address, hours, unsubscribe"]
  classDef k fill:{T['mono100']},stroke:{T['mono300']},color:{T['mono950']};
  class A,B,C,D,E,F,G,H k;
</pre></div>

  <h3>Rules</h3>
  <div class="grid3">
    <div class="rule-card"><h4>Latest first, then everything else</h4><p>The reply that triggered the email is always the first thing after the title. History is a quieter block below the CTA, newest first, labeled plainly. Never interleave.</p></div>
    <div class="rule-card"><h4>Accents are status, not decoration</h4><p>Surfaces stay mono. Blue and sky appear only in the status chip dot and label. Warm orange is reserved for money CTAs. Success and danger are semantic chips only.</p></div>
    <div class="rule-card"><h4>600px hybrid layout</h4><p>Outer table is 100% wide with max-width 600px, MSO ghost table for Outlook. Under 620px, header cells stack, padding drops to 16px and buttons go full width.</p></div>
    <div class="rule-card"><h4>Dark mode is designed, not inverted</h4><p>color-scheme meta plus prefers-color-scheme and [data-ogsc] overrides swap page, card, text and border tokens. Logos ship as two transparent PNGs and swap with CSS. Nothing relies on inversion.</p></div>
    <div class="rule-card"><h4>Logos as transparent PNG</h4><p>SVG is unsupported in Gmail and Outlook. Export the lockup at 2x (264 x 52) with a transparent background so it survives dark mode. Syncro uses its own logo tag; WHMCS uses {'{$company_logo_url}'}.</p></div>
    <div class="rule-card"><h4>Sentence case, plain words</h4><p>Titles are the ticket subject as written. Labels are sentence case. No emoji, no exclamation points, no "Dear". Greeting is "Hi first name," and sign-off is the sub-brand.</p></div>
    <div class="rule-card"><h4>Reply-by-email stays intact</h4><p>Every Syncro ticket body opens with {{reply_above_line}}, Syncro's own marker, so quoted text is trimmed from inbound replies. WHMCS ticket subjects are never edited. Gleap keeps the unsubscribe placeholders.</p></div>
    <div class="rule-card"><h4>One help strip, one footer</h4><p>Phone lines, portal link, legal line and address come from a single source per brand (wrld.tech vs wrld.host). Change it in build.py, regenerate, redeploy.</p></div>
    <div class="rule-card"><h4>Sub-brand lockups</h4><p>wrld.tech tickets carry the WRLD.TECH lockup with the blue rule. wrld.host emails carry WRLD.HOST with the sky rule, derived from the same mark and Montserrat recipe.</p></div>
  </div>
</section>

{''.join(platform_sections)}

<section id="qa">
  <header class="sec-head"><span class="eyebrow">Before go-live</span><h2>QA checklist</h2></header>
  <ul class="check">
    <li>Send one of each template to Gmail web, Outlook for Windows, Outlook.com, Apple Mail with dark mode on, and iOS Mail.</li>
    <li>Confirm the logo swaps in dark mode and neither PNG shows a white box.</li>
    <li>Reply to a Syncro test email and confirm it threads into the ticket. Do the same from WHMCS.</li>
    <li>Confirm history renders newest first and the latest message is not duplicated at the top of the history block.</li>
    <li>Check a long ticket (10+ comments) for total length. Syncro sends all public comments; if it runs long, drop the history label to "Full conversation" and rely on the CTA.</li>
    <li>Check a comment containing an image or a code block in Gleap and Syncro.</li>
    <li>Tap targets: button height 44px on mobile, phone numbers tappable.</li>
    <li>Run each through a spam scorer once (Google Postmaster or mail-tester) after the logo URLs are live.</li>
  </ul>
  <p class="muted" style="margin-top:24px;font-size:14px">Source: WRLDInc/DesignSystem tokens. Generator and every file on this page live in the wrld-email-system package (build.py, shots.py, index.py). Regenerate rather than hand-editing HTML.</p>
</section>
</div>

<script>
(function(){{
  var dir = 'thread';
  try {{ dir = localStorage.getItem('wrld-email-dir') || dir; }} catch(e) {{}}
  function apply(d) {{
    dir = d;
    document.querySelectorAll('.tab').forEach(function(t){{ t.classList.toggle('on', t.dataset.dir===d); t.setAttribute('aria-selected', t.dataset.dir===d); }});
    document.querySelectorAll('.dir-desc').forEach(function(p){{ p.hidden = p.dataset.dir!==d; }});
    document.querySelectorAll('.preview, details.code').forEach(function(el){{ el.hidden = el.dataset.dir!==d; }});
    try {{ localStorage.setItem('wrld-email-dir', d); }} catch(e) {{}}
  }}
  document.querySelectorAll('.tab').forEach(function(t){{ t.addEventListener('click', function(){{ apply(t.dataset.dir); }}); }});
  document.querySelectorAll('.preview').forEach(function(fig){{
    fig.querySelectorAll('.pill').forEach(function(b){{
      b.addEventListener('click', function(){{
        fig.querySelectorAll('.pill').forEach(function(x){{ x.classList.toggle('on', x===b); }});
        var f = fig.querySelector('.frame'); f.className = 'frame ' + b.dataset.w;
        var ifr = fig.querySelector('iframe');
        var sd = ifr.getAttribute('srcdoc');
        var wantDark = b.dataset.w === 'dark';
        var hasDark = sd.indexOf('<html data-theme="dark"') !== -1 || sd.indexOf('force-dark') !== -1;
        // Force dark preview by turning the media query into an always-on rule inside the iframe copy
        if (wantDark && !hasDark) {{
          sd = sd.replace('@media (prefers-color-scheme: dark)', '@media all').replace('<style>', '<style data-force-dark="force-dark">');
          ifr.setAttribute('srcdoc', sd);
        }} else if (!wantDark && sd.indexOf('force-dark') !== -1) {{
          sd = sd.replace('<style data-force-dark="force-dark">', '<style>').replace('@media all', '@media (prefers-color-scheme: dark)');
          ifr.setAttribute('srcdoc', sd);
        }}
      }});
    }});
  }});
  document.querySelectorAll('.copy').forEach(function(b){{
    b.addEventListener('click', function(ev){{
      ev.preventDefault(); ev.stopPropagation();
      var code = b.closest('details').querySelector('pre code').textContent;
      function done(){{ b.textContent='Copied'; setTimeout(function(){{ b.textContent='Copy'; }}, 1600); }}
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, function(){{ fallback(); }}); else fallback();
      function fallback(){{ var ta=document.createElement('textarea'); ta.value=code; document.body.appendChild(ta); ta.select(); try{{document.execCommand('copy'); done();}}catch(e){{}} document.body.removeChild(ta); }}
    }});
  }});
  apply(dir);
}})();
</script>
"""
    (DIST / "index.html").write_text(page)
    print("index.html", len(page) // 1024, "KB")

if __name__ == "__main__":
    build_index()
