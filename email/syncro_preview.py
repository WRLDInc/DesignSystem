#!/usr/bin/env python3
"""Render every Syncro body inside the Syncro wrapper with sample values, for review.
Writes dist/preview/syncro/<file>.html plus an index. Sample values are fictional."""
import re
from pathlib import Path
import build as B
ROOT = Path(__file__).parent
SRC = B.DIST / "templates" / "thread" / "syncro"
OUT = B.DIST / "preview" / "syncro"
PAY = ('<a href="#" style="display:inline-block;padding:6px 12px;border:1px solid #d4d4d8;border-radius:4px;color:#0a0a0a;text-decoration:none;">Pay with credit card</a>')
S = {
 "account_name": "WRLD Tech Co.", "account_phone": "469.299.9598", "account_email": "helpdesk@wrld.tech",
 "customer_first_name": "Jordan", "customer_phone": "214.555.0142", "customer_open_balance": "$481.69",
 "portal_login": "jordan@northlinevet.com", "invitation_url": "#", "portal_login_url": "#", "password_reset_url": "#",
 "online_profile_url": "#", "online_profile_cc_url": "#", "ach_verification_url": "#",
 "estimate_number": "1042", "estimate_date": "09-23-26", "estimate_total": "$3,480.00", "custom_estimate_message": "",
 "invoice_number": "7203", "invoice_date": "09-23-26", "invoice_due_date": "10-01-26", "invoice_date_paid": "09-24-26",
 "invoice_total": "$481.69", "invoice_balance_due": "$481.69", "invoice_payment_method": "Credit card", "custom_invoice_message": "",
 "pay_with_credit_card": PAY, "pay_with_paypal": "",
 "purchase_order_number": "PO-2231", "vendor_rep_first_name": "Sam", "vendor_rep_last_name": "Ortiz", "vendor_name": "Ingram Micro",
 "vendor_account_number": "88-2041", "purchase_order_expected_date": "09-30-26", "purchase_order_shipping_notes": "Ship to suite 101, dock B.",
 "purchase_order_general_notes": "Call before delivery.",
 "purchase_order_line_item_rows": "<tr><td>1</td><td>Ubiquiti U7 Pro</td><td>8177</td><td>U7-PRO</td><td align='right'>4</td><td align='right'>$189.00</td><td align='right'>$756.00</td></tr>"
                                  "<tr><td>2</td><td>Cat6 patch 3ft</td><td>0142</td><td>C6-3</td><td align='right'>12</td><td align='right'>$3.10</td><td align='right'>$37.20</td></tr>",
 "appointment_hours_from_now": "24 hours", "appointment_summary": "Network cabinet cleanup", "appointment_start_time": "Thu 09-24-26 10:00 AM",
 "appointment_end_time": "Thu 09-24-26 12:00 PM", "appointment_location": "4707 Algiers St, Dallas", "appointment_instructions": "Please have someone on site with access to the server closet.",
 "ticket_number": "431500", "ticket_subject": "Front desk scanner not saving", "reply_above_line": "----- REPLY ABOVE THIS LINE TO SEND A RESPONSE -----",
 "gray_social_links": "",
}
def main():
    OUT.mkdir(parents=True, exist_ok=True)
    wrapper = (SRC / "00-email-wrapper.html").read_text(encoding="utf-8")
    links = []
    for f in sorted(SRC.glob("*.html")):
        if f.name.startswith("00-") or f.name.startswith("ticket-c") or f.name in ("ticket-created.html","ticket-resolved.html","ticket-autoresponder.html"):
            continue
        body = f.read_text(encoding="utf-8")
        html = wrapper.replace("{{email_body}}", body)
        html = re.sub(r"\{\{([a-z0-9_]+)\}\}", lambda m: S.get(m.group(1), "[" + m.group(1) + "]"), html)
        (OUT / f.name).write_text(html, encoding="utf-8")
        links.append(f.name)
    (OUT / "index.html").write_text("<h1>Syncro previews</h1>" + "".join(f'<p><a href="{n}">{n}</a></p>' for n in links), encoding="utf-8")
    missing = sorted(set(re.findall(r"\[([a-z0-9_]+)\]", "".join((OUT / n).read_text(encoding="utf-8") for n in links))))
    print(len(links), "previews; tags without sample values:", missing)
if __name__ == "__main__":
    main()
