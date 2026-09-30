#!/usr/bin/env python3
"""
WRLD print templates for Syncro PDFs: invoice, estimate, statement, ticket, purchase order, purchase receipt.

One shared print stylesheet, one header / parties / items / totals / footer layout.
Layout is tables only: Syncro renders PDFs with an old WebKit engine, so no flexbox or grid.
No child combinators (">") in CSS, matching the email wrapper rule.

Tag rule (enforced): each template may only use tags its live Syncro version already used.
Live copies: syncro-live-backup/<date>/pdf/<category>-<id>.html

Run:  py -3 email/syncro_pdf.py      -> dist/templates/pdf/<name>.html
"""
import re, sys
from pathlib import Path
from build import T, LOGO_LIGHT, GOOGLE_FONTS

ROOT = Path(__file__).parent
BACKUP = ROOT / "syncro-live-backup" / "2026-09-23" / "pdf"
OUT = ROOT / "dist" / "templates" / "pdf"

FB = "Ubuntu,'Helvetica Neue',Helvetica,Arial,sans-serif"
FD = "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif"
FM = "'Ubuntu Mono',Menlo,Consolas,monospace"

CSS = f"""
html, body {{ margin:0; padding:0; font-family:{FB}; font-size:11px; line-height:16px; color:{T['mono950']}; word-wrap:break-word; }}
.wrld-doc {{ padding:0 36px; }}
table {{ border-collapse:collapse; }}
td, th {{ vertical-align:top; }}
a {{ color:{T['mono950']}; }}
.wrld-org {{ color:{T['mono600']}; font-size:10px; line-height:14px; padding-top:8px; }}
.wrld-doctype {{ font-family:{FD}; font-size:24px; line-height:28px; font-weight:600; letter-spacing:-0.01em; text-align:right; }}
.wrld-docno {{ font-family:{FM}; font-size:12px; line-height:16px; color:{T['mono600']}; text-align:right; padding-top:2px; }}
.wrld-stamp {{ text-align:right; padding-top:6px; }}
.wrld-rule {{ border-top:2px solid {T['mono950']}; height:0; line-height:0; font-size:0; margin:14px 0 16px 0; }}
.wrld-label {{ font-size:8.5px; line-height:12px; letter-spacing:0.14em; text-transform:uppercase; color:{T['mono500']}; padding-bottom:4px; }}
.wrld-addr {{ font-size:11px; line-height:16px; }}
.wrld-meta {{ width:100%; }}
.wrld-meta th {{ text-align:left; font-weight:400; color:{T['mono600']}; padding:3px 10px 3px 0; white-space:nowrap; }}
.wrld-meta td {{ text-align:right; padding:3px 0; }}
.wrld-meta tr.wrld-due th, .wrld-meta tr.wrld-due td {{ border-top:1px solid {T['mono950']}; padding-top:6px; font-weight:700; font-size:13px; color:{T['mono950']}; }}
.wrld-section {{ font-family:{FD}; font-size:12px; line-height:16px; font-weight:600; margin:18px 0 6px 0; }}
.invbody-items {{ width:100%; margin:16px 0 4px 0; }}
.invbody-items th {{ background-color:{T['mono100']}; border-top:1px solid {T['mono200']}; border-bottom:1px solid {T['mono200']};
  text-align:left; font-weight:600; font-size:8.5px; line-height:12px; letter-spacing:0.1em; text-transform:uppercase; color:{T['mono600']}; padding:7px 6px; }}
.invbody-items td {{ border-bottom:1px solid {T['mono200']}; padding:7px 6px; }}
.invbody-items .unitcost, .invbody-items .quantity, .invbody-items .linetotal, .invbody-items .num {{ text-align:right; }}
.invbody-items .center {{ text-align:center; }}
.wrld-totals {{ width:100%; }}
.wrld-totals th {{ text-align:left; font-weight:400; color:{T['mono600']}; padding:3px 10px 3px 0; }}
.wrld-totals td {{ text-align:right; padding:3px 0; white-space:nowrap; }}
.wrld-totals tr.wrld-grand th, .wrld-totals tr.wrld-grand td {{ border-top:1px solid {T['mono950']}; padding-top:7px; font-weight:700; font-size:13px; color:{T['mono950']}; }}
.wrld-pay {{ border:1px solid {T['mono200']}; border-left:3px solid {T['accentWarm']}; padding:9px 12px; margin-top:4px; }}
.wrld-pay-title {{ font-weight:700; font-size:11px; }}
.wrld-note {{ color:{T['mono600']}; font-size:10.5px; line-height:15px; }}
.wrld-banner {{ border:1px solid {T['mono300']}; padding:6px 10px; font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:{T['mono600']}; }}
.wrld-box {{ border:1px solid {T['mono200']}; background-color:{T['mono50']}; padding:10px 12px; }}
.wrld-foot {{ border-top:1px solid {T['mono200']}; margin-top:26px; padding-top:8px; color:{T['mono500']}; font-size:9.5px; line-height:13px; }}
.wrld-barcode {{ text-align:center; padding-top:14px; }}
.wrld-small {{ font-size:9.5px; line-height:13px; color:{T['mono600']}; }}
.wrld-comments blockquote {{ margin:0; padding:0 0 0 10px; border-left:2px solid {T['mono200']}; }}
ul.wrld-list {{ margin:4px 0 0 16px; padding:0; }}
ul.wrld-list li {{ margin:0 0 3px 0; }}
.page-avoid {{ page-break-inside:avoid; }}
.invbody-items thead {{ display:table-header-group; }}
"""

def page(title, body):
    return (f'<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>\n'
            f'<title>{title}</title>\n<link href="{GOOGLE_FONTS}" rel="stylesheet" type="text/css"/>\n'
            f'<style type="text/css">{CSS}</style>\n</head>\n<body>\n<div class="wrld-doc">\n{body}\n</div>\n</body>\n</html>\n')

ORG = ('<div class="wrld-org"><strong style="color:#0a0a0a;">WRLD Tech Co.</strong><br/>{{account_street}}<br/>'
       '{{account_city}}, {{account_state}} {{account_zip}}<br/>{{account_website}} &middot; {{account_phone}}</div>')

def top(doctype, docno, stamp="", org=ORG):
    return (f'<table width="100%" cellpadding="0" cellspacing="0"><tr>'
            f'<td width="55%"><img src="{LOGO_LIGHT}" width="176" height="30" alt="WRLD Tech Co." style="display:block;width:176px;height:auto;border:0;"/>{org}</td>'
            f'<td width="45%" align="right"><div class="wrld-doctype">{doctype}</div><div class="wrld-docno">{docno}</div>'
            f'{f"<div class=wrld-stamp>{stamp}</div>" if stamp else ""}</td></tr></table>\n<div class="wrld-rule">&nbsp;</div>')

def parties(label, addr_html, meta_rows):
    rows = "".join(
        f'<tr{" class=wrld-due" if due else ""}><th>{k}</th><td>{v}</td></tr>' for k, v, due in meta_rows)
    return (f'<table width="100%" cellpadding="0" cellspacing="0"><tr>'
            f'<td width="55%" style="padding-right:24px;"><div class="wrld-label">{label}</div><div class="wrld-addr">{addr_html}</div></td>'
            f'<td width="45%"><table class="wrld-meta" cellpadding="0" cellspacing="0">{rows}</table></td></tr></table>')

def items(columns, rows_tag):
    ths = "".join(f'<th class="{c}">{h}</th>' for h, c in columns)
    return (f'<table class="invbody-items" cellpadding="0" cellspacing="0"><thead><tr>{ths}</tr></thead>'
            f'<tbody>{rows_tag}</tbody></table>')

def totals(rows, left_html=""):
    trs = "".join(f'<tr{" class=wrld-grand" if grand else ""}><th>{k}</th><td>{v}</td></tr>' for k, v, grand in rows)
    return (f'<table width="100%" cellpadding="0" cellspacing="0" class="page-avoid"><tr>'
            f'<td width="55%" style="padding-right:24px;padding-top:10px;">{left_html}</td>'
            f'<td width="45%" style="padding-top:10px;"><table class="wrld-totals" cellpadding="0" cellspacing="0">{trs}</table></td></tr></table>')

def pay_box(ref):
    return (f'<div class="wrld-pay"><div class="wrld-pay-title">Pay online</div>'
            f'<div>Go to <a href="https://wrld.tech/quick-pay"><strong>wrld.tech/quick-pay</strong></a> and reference {ref}. '
            f'Cards and bank accounts on file are charged automatically.</div></div>')

FOOT = ('<div class="wrld-foot">Questions? helpdesk@wrld.tech &middot; 469.299.9598 &middot; Priority SLA line 469.850.3968 '
        '&middot; wrld.tech. Terms at wrld.tech/tos.</div>')

BILL_TO = ('<strong>{{customer_business_name_or_customer_full_name}}</strong><br/>{{customer_billing_address}} {{customer_billing_address2}}<br/>'
           '{{customer_billing_city}}, {{customer_billing_state}} {{customer_billing_zip}}')
ITEM_COLS = [("Item", "item"), ("Description", "description"), ("Unit cost", "unitcost"), ("Qty", "quantity"), ("Line total", "linetotal")]


# ---------------------------------------------------------------------------
def invoice():
    return page("Invoice {{invoice_name}}", "\n".join([
        top("Invoice", "#{{invoice_number}}", "{{invoice_paid_stamp}}"),
        parties("Bill to", BILL_TO, [("Invoice #", "{{invoice_number}}", False), ("Invoice date", "{{invoice_date}}", False),
                                     ("Balance due", "{{invoice_balance_due}}", True)]),
        items(ITEM_COLS, "{{invoice_line_items_table}}"),
        totals([("Subtotal", "{{invoice_subtotal}}", False), ("{{tax_label}}", "{{invoice_tax}}", False),
                ("Invoice total", "{{invoice_total}}", False), ("Payments", "{{invoice_payments_amount}}", False),
                ("Credits", "{{invoice_misc_credits}}", False), ("Balance due", "{{invoice_balance_due}}", True)],
               pay_box("invoice #{{invoice_number}}")),
        '<div class="wrld-section">Notes</div><div class="wrld-note">{{invoice_message}}</div>',
        '<div class="wrld-section">Terms</div><div class="wrld-small">{{invoice_disclaimer}}</div>',
        FOOT,
        '<div class="wrld-barcode"><img src="https://barcode.services.syncromsp.com/barcodes/{{customer_phone}}.png" height="34" alt=""/></div>',
    ]))

def estimate():
    deposit = ('<div class="wrld-box page-avoid"><div class="wrld-pay-title">Deposit and payment</div>'
               '<div style="margin-top:3px;"><strong>Deposit required:</strong> 50% of the estimate total or the full cost of hardware, whichever is greater. '
               'This lets us order materials and schedule your project.</div>'
               '<ul class="wrld-list">'
               '<li><strong>Quick Pay:</strong> <a href="https://wrld.tech/quick-pay">wrld.tech/quick-pay</a> (reference estimate #{{estimate_number}})</li>'
               '<li><strong>ACH transfer:</strong> contact <a href="mailto:billing@wrld.tech">billing@wrld.tech</a> or {{account_phone}} for instructions</li>'
               '<li><strong>Check:</strong> payable to WRLD Technologies, mailed to {{account_street}}, {{account_city}}, {{account_state}} {{account_zip}}</li>'
               '</ul><div class="wrld-small" style="margin-top:5px;"><em>Work begins when the deposit is received. The balance is due on completion.</em></div></div>')
    terms = ('<div class="wrld-section">Estimate terms</div><ul class="wrld-list wrld-note">'
             '<li><strong>Valid for 30 days</strong> from the estimate date.</li>'
             '<li><strong>Scope:</strong> pricing is based on the specifications above. Changes may affect cost and timeline.</li>'
             '<li><strong>Hardware:</strong> ordered as soon as the deposit is received.</li>'
             '<li><strong>Final invoice:</strong> provided on completion. Re-approval is required if changes exceed 20%.</li></ul>'
             '<div class="wrld-small" style="margin-top:6px;"><strong>Deposit examples:</strong> $10,000 total with $3,000 hardware is a <strong>$5,000 deposit</strong> (50%). '
             '$10,000 total with $6,500 hardware is a <strong>$6,500 deposit</strong> (hardware cost).</div>'
             '<div class="wrld-section">Disclaimer</div><div class="wrld-small">This is an estimate only. A final invoice is provided after the project is complete. '
             'This estimate will be re-approved if pricing or timeframe changes by more than 20%. Thank you!</div>')
    return page("Estimate {{estimate_number}}", "\n".join([
        top("Estimate", "#{{estimate_number}}", "{{estimate_paid_stamp}}"),
        parties("Prepared for", BILL_TO, [("Estimate #", "{{estimate_number}}", False), ("Estimate date", "{{estimate_date}}", False),
                                          ("Estimate total", "{{estimate_total}}", True)]),
        items(ITEM_COLS, "{{estimate_line_items_table}}"),
        totals([("Subtotal", "{{estimate_subtotal}}", False), ("{{tax_label}}", "{{estimate_tax}}", False),
                ("Estimate total", "{{estimate_total}}", True)],
               '<div class="wrld-banner">This is an estimate, not an invoice</div>'),
        '<div class="wrld-note" style="margin-top:12px;">{{estimate_message}}</div>',
        '<div style="margin-top:14px;">' + deposit + '</div>',
        terms,
        FOOT,
    ]))

def statement():
    return page("Statement", "\n".join([
        top("Statement", "{{statement_date}}"),
        parties("Account", BILL_TO, [("Statement date", "{{statement_date}}", False), ("Balance due", "{{statement_amount_due}}", True)]),
        '<div class="wrld-section">Activity</div>',
        items([("Date", "item"), ("Activity", "description"), ("Amount", "unitcost"), ("Open amount", "linetotal")], "{{statement_line_items_table}}"),
        '<div class="wrld-section">Aging</div>',
        items([("Current", "center"), ("1-30 days", "center"), ("31-60 days", "center"), ("61-90 days", "center"), ("90+ days", "center"), ("Amount due", "center")],
              "{{statement_past_due_amounts_table}}"),
        '<div style="margin-top:14px;">' + pay_box("your account name") + '</div>',
        FOOT,
    ]))

def purchase_order():
    vendor = ('<strong>{{vendor_name}}</strong><br/>{{vendor_address}} {{vendor_address_2}}<br/>{{vendor_city}}, {{vendor_state}} {{vendor_zip}}')
    return page("Purchase order {{purchase_order_number}}", "\n".join([
        top("Purchase order", "#{{purchase_order_number}}"),
        parties("Vendor", vendor, [("P.O. #", "{{purchase_order_number}}", False), ("Purchase date", "{{purchase_order_date}}", False),
                                   ("Total", "{{purchase_order_amount}}", True)]),
        items([("Item", "item"), ("Description", "description"), ("UPC", "item"), ("Unit cost", "unitcost"), ("Qty", "quantity"), ("Line total", "linetotal")],
              "{{purchase_order_line_items_table}}"),
        totals([("Total", "{{purchase_order_amount}}", True)],
               '<div class="wrld-note">Ship to WRLD Tech Co., {{account_street}}, {{account_city}}, {{account_state}} {{account_zip}}. '
               'Please reference P.O. #{{purchase_order_number}} on all packing slips and invoices.</div>'),
        FOOT.replace("Questions?", "Questions about this order?"),
        '<div class="wrld-barcode"><img src="https://barcode.services.syncromsp.com/barcodes/{{purchase_order_number}}.png" height="34" alt=""/></div>',
    ]))

def purchase():
    cust = ('<strong>{{customer_business_name_or_customer_full_name}}</strong><br/>{{customer_address}} {{customer_address_2}}<br/>'
            '{{customer_city}}, {{customer_state}} {{customer_zip}}<br/><span class="wrld-small">Identification: {{purchase_identification}}</span>')
    return page("Purchase {{purchase_number}}", "\n".join([
        top("Purchase receipt", "#{{purchase_number}}", "{{purchase_paid_stamp}}"),
        parties("Customer", cust, [("Purchase #", "{{purchase_number}}", False), ("Purchase date", "{{purchase_date}}", False),
                                   ("Date paid", "{{purchase_paid_on}}", False), ("Amount paid", "{{purchase_amount}}", True)]),
        items(ITEM_COLS, "{{purchase_line_items_table}}"),
        totals([("Total paid", "{{purchase_amount}}", True)], '<div class="wrld-note"><strong>Thank you for your business!</strong></div>'),
        '<div style="margin-top:18px;">{{signature_line}}</div>',
        FOOT,
        '<div class="wrld-barcode"><img src="https://barcode.services.syncromsp.com/barcodes/{{customer_phone}}.png" height="34" alt=""/></div>',
    ]))

def ticket():
    org = ('<div class="wrld-org"><strong style="color:#0a0a0a;">WRLD Tech Co.</strong> &middot; WRLD Inc.<br/>'
           '{{account_street}}, {{account_city}}, {{account_state}} {{account_zip}}<br/>{{account_website}}<br/>'
           'Mon-Fri 9am-6pm CT: <strong style="color:#0a0a0a;">469.299.9598</strong> &middot; Priority SLA line: <strong style="color:#0a0a0a;">469.850.3968</strong></div>')
    client = ('<strong>{{customer_business_name_or_customer_full_name}}</strong><br/>{{ticket_address}} {{ticket_address_2}}<br/>'
              '{{ticket_city}}, {{ticket_state}} {{ticket_zip}}')
    specs = ('<table class="wrld-meta" cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;">'
             '<tr><th>Manufacturer</th><td>{{asset_custom_field_manufacturer}}</td></tr>'
             '<tr><th>Make / model</th><td>{{asset_custom_field_make}} {{asset_custom_field_model}}</td></tr>'
             '<tr><th>CPU / RAM</th><td>{{asset_custom_field_cpu_name}} / {{asset_custom_field_ram}}</td></tr>'
             '<tr><th>Operating system</th><td>{{asset_custom_field_os}}</td></tr></table>')
    primary_asset = ('<table class="wrld-meta" cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;">'
                     '<tr><th>Asset</th><td>{{asset_name}}</td></tr><tr><th>Serial</th><td>{{asset_serial_v2}}</td></tr>'
                     '<tr><th>Type</th><td>{{asset_type}}</td></tr><tr><th>Properties</th><td>{{asset_properties}}</td></tr></table>')
    return page("Ticket {{ticket_number}}", "\n".join([
        top("Service ticket", "#{{ticket_number}}", org=org),
        f'<div style="font-family:{FD};font-size:16px;line-height:21px;font-weight:600;margin-bottom:10px;">{{{{ticket_subject}}}}</div>',
        parties("Client", client, [("Ticket #", "{{ticket_number}}", False), ("Opened", "{{ticket_date}}", False),
                                   ("Created by", "{{ticket_creator_name}}", False), ("Status", "{{ticket_status}}", True)]),
        # {{ticket_public_comments}} prints every public comment, which the table below already lists.
        # Showing both duplicated the whole conversation, so only the table is kept (newest first).
        '<div class="wrld-section">Conversation</div>',
        items([("Date", "item"), ("Comment", "description")], "{{ticket_public_comments_table}}"),
        '<div class="wrld-section">Technical details</div>',
        '<table width="100%" cellpadding="0" cellspacing="0" class="page-avoid"><tr>'
        f'<td width="50%" style="padding-right:12px;"><div class="wrld-label">Primary device</div>{primary_asset}</td>'
        f'<td width="50%" style="padding-left:12px;"><div class="wrld-label">Specs</div>{specs}</td></tr></table>',
        items([("Asset name", "item"), ("Serial number", "description"), ("Type", "description"), ("Properties", "description")], "{{asset_table}}"),
        '<div class="wrld-label" style="margin-top:10px;">Other related assets</div><div class="wrld-note">{{assets}}</div>',
        '<div class="wrld-section">Metadata and attachments</div>',
        '<table width="100%" cellpadding="0" cellspacing="0"><tr><td width="50%" class="wrld-small" style="padding-right:12px;">{{ticket_meta_details}}</td>'
        '<td width="50%" style="padding-left:12px;">{{ticket_images_rendered}}</td></tr></table>',
        '<div class="wrld-section">Terms and disclaimer</div>'
        '<div class="wrld-small">View the Terms of Service at <a href="https://wrld.tech/tos">wrld.tech/tos</a>.<br/>{{ticket_disclaimer_template}}</div>',
        FOOT,
    ]))

TEMPLATES = {  # output file: (renderer, live backup file, Syncro edit id)
    "invoice.html": (invoice, "invoice-1270992.html", 1270992),
    "estimate.html": (estimate, "estimate-1232902.html", 1232902),
    "statement.html": (statement, "statement-1232901.html", 1232901),
    "ticket.html": (ticket, "ticket-2501297.html", 2501297),
    "purchase-order.html": (purchase_order, "purchase_order-1232906.html", 1232906),
    "purchase-receipt.html": (purchase, "purchase-1232905.html", 1232905),
}

def tags(s): return set(re.findall(r"\{\{[a-z0-9_]+\}\}", s))

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    problems = []
    for name, (fn, live, _id) in TEMPLATES.items():
        html = fn()
        if ">" in "".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S)):
            problems.append(f"{name}: '>' in CSS")
        live_tags = tags((BACKUP / live).read_text(encoding="utf-8"))
        extra = sorted(tags(html) - live_tags)
        dropped = sorted(live_tags - tags(html))
        if extra: problems.append(f"{name}: tags not in live template {extra}")
        (OUT / name).write_text(html, encoding="utf-8")
        print(f"{name:22} {len(html):6} chars  tags {len(tags(html)):2}  dropped from live: {dropped}")
    if problems:
        print("\n".join(problems)); sys.exit(1)
    print("all PDF templates use only tags from their live versions")

if __name__ == "__main__":
    main()
