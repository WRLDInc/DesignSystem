#!/usr/bin/env python3
"""
WRLD transactional email system - the non-ticket Syncro email bodies.

Portal invitations, password resets, billing documents (invoice, estimate, statement, PO),
payment problems, appointments and the lead autoresponder. Same components and wrapper as the
ticket emails in build.py; this file only adds the copy and the tag wiring.

Tag rule (enforced by validate()): a body may only use tags that Syncro lists for that template
in the editor, or tags the live template already used (Syncro notes that some tags only show in
Source view). Both lists live in syncro-live-backup/<date>/index.json and emails/<name>.html.

Run:  py -3 email/syncro_extra.py      (after build.py; writes into dist/templates/<dir>/syncro/)
"""
import json, re, sys
from pathlib import Path

import build as B
from build import (T, FONT_BODY, BRANDS, spacer, eyebrow, chip, button, text_link, meta_rows,
                   header, card_open, card_close, title_block, message_block, cta_row, help_strip,
                   footer, syncro_body, esc)

ROOT = Path(__file__).parent
BACKUP = ROOT / "syncro-live-backup" / "2026-09-23"
b = BRANDS["tech"]
QUICK_PAY = "https://wrld.tech/quick-pay"


# ---------------------------------------------------------------------------
# Small building blocks specific to these templates
# ---------------------------------------------------------------------------
def prose(html):
    """Body copy without a frame (ledger treatment) so empty optional tags leave no empty box."""
    return message_block(html, direction="ledger")

def optional_note(tag_html):
    """A platform-provided note (custom message, instructions). Unframed, so it vanishes when empty."""
    return (f'<tr><td class="wrld-body fg-muted" style="font-family:{FONT_BODY};font-size:15px;line-height:23px;'
            f'color:{T["mono600"]};padding-top:12px;">{tag_html}</td></tr>')

def details(rows, label=None):
    lab = f'<tr><td style="padding:18px 0 8px 0;">{eyebrow(label)}</td></tr>' if label else spacer(18)
    return lab + f"<tr><td>{meta_rows(rows)}</td></tr>"

def pay_tags():
    """{{pay_with_credit_card}} / {{pay_with_paypal}} render Syncro's own pay links (or nothing)."""
    return (f'<tr><td class="fg-muted" style="font-family:{FONT_BODY};font-size:14px;line-height:22px;'
            f'color:{T["mono600"]};padding-top:14px;">{{{{pay_with_credit_card}}}} {{{{pay_with_paypal}}}}</td></tr>')

def vendor_help():
    return f"""{spacer(24)}
<tr><td class="rule" style="border-top:1px solid {T['mono200']};padding:16px 0 12px 0;">
<span class="fg-muted" style="font-family:{FONT_BODY};font-size:13px;line-height:20px;color:{T['mono600']};">Questions about this order? Reply to this email or call <a href="tel:{b['phone_std_tel']}" class="fg" style="color:{T['mono950']};text-decoration:none;font-weight:500;">{b['phone_std']}</a>.</span>
</td></tr>"""

def items_table(rows_tag, columns):
    """Vendor PO line items. Syncro's rows tag emits bare <tr><td>...; .wrld-items styles them."""
    ths = "".join(
        f'<th align="{"right" if al == "r" else "left"}" style="font-family:{FONT_BODY};font-size:11px;line-height:14px;'
        f'font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:{T["mono500"]};text-align:{"right" if al == "r" else "left"};'
        f'padding:8px 6px;border-bottom:1px solid {T["mono300"]};" class="fg-muted rule">{h}</th>' for h, al in columns)
    return (f'{spacer(18)}<tr><td style="padding-bottom:8px;">{eyebrow("Order details")}</td></tr>'
            f'<tr><td><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="wrld-items" '
            f'style="width:100%;font-family:{FONT_BODY};font-size:13px;line-height:18px;color:{T["mono950"]};">'
            f'<thead><tr>{ths}</tr></thead><tbody>{rows_tag}</tbody></table></td></tr>')

def doc(direction, ref_label, ref_value, title, kicker, chip_html, blocks, help_html):
    parts = [header(direction, b, ref_label, ref_value), card_open(direction),
             title_block(title, chip_html, kicker=kicker)]
    parts += blocks
    parts += [help_html, card_close(), footer(b)]
    return parts

def primary(label, href, warm=False, secondary=None):
    sec = text_link(secondary[0], secondary[1], muted=True) if secondary else ""
    return cta_row(button(label, href, warm=warm), sec)


# ---------------------------------------------------------------------------
# Templates. key = Syncro template_name. Each returns (parts, preheader, reply_hint)
# ---------------------------------------------------------------------------
PORTAL = (b["portal_label"], b["portal"])

def portal_invitation(d):
    return doc(d, "Customer portal", "Invitation", "Finish setting up your portal login", "You're invited", "", [
        prose("<p>Hi there,</p><p>We created a WRLD Tech Co. customer portal login for you. The portal is where you open and track support requests, "
              "find your company's IT documentation, and review your account history.</p>"
              "<p>Set your password once and you're in. If you ever forget it, use Forgot password on the sign-in page or give us a call.</p>"),
        details([("Username", "{{portal_login}}")]),
        primary("Create your password", "{{invitation_url}}"),
    ], help_strip(b, reply_hint=False)), "Set your password to finish setting up your WRLD Tech Co. portal login.", False

def sso_portal_invitation(d):
    return doc(d, "Customer portal", "Invitation", "Your portal account is ready", "You're invited", "", [
        prose("<p>Hi there,</p><p>We created a WRLD Tech Co. customer portal account for you. Your organization signs in with single sign-on (SSO), "
              "so there's no separate password to set. Use the button below and sign in with your work account.</p>"),
        details([("Username", "{{portal_login}}")]),
        primary("Sign in to the portal", "{{portal_login_url}}"),
    ], help_strip(b, reply_hint=False)), "Sign in to your WRLD Tech Co. portal with your work account.", False

def portal_password_reset(d):
    return doc(d, "Customer portal", "Security", "Reset your portal password", "Account security", "", [
        prose("<p>We received a request to reset the password for your WRLD Tech Co. customer portal account.</p>"
              "<p>Use the button below to choose a new password. If you didn't ask for this, you can ignore this email and your password stays the same.</p>"),
        primary("Reset your password", "{{password_reset_url}}"),
    ], help_strip(b, reply_hint=False)), "Use this link to reset your WRLD Tech Co. portal password.", False

def estimate(d):
    return doc(d, "Estimate", "#{{estimate_number}}", "Your estimate is ready", "Estimate", "", [
        prose("<p>Hi {{customer_first_name}},</p><p>Your estimate is attached as a PDF. Review the scope and pricing, then reply to this email "
              "or give us a call to approve it or ask questions.</p>"),
        optional_note("{{custom_estimate_message}}"),
        details([("Estimate", "#{{estimate_number}}"), ("Date", "{{estimate_date}}"), ("Total", "{{estimate_total}}")]),
        primary("View your account", "{{online_profile_url}}", secondary=("Pay a deposit at wrld.tech/quick-pay", QUICK_PAY)),
    ], help_strip(b, reply_hint=False)), "Estimate #{{estimate_number}} from WRLD Tech Co. is attached.", False

def paid_invoice(d):
    return doc(d, "Invoice", "#{{invoice_number}}", "Payment received. Thank you.", "Receipt", chip("Paid", T["success"]), [
        prose("<p>Hi {{customer_first_name}},</p><p>A copy of your paid invoice is attached for your records. No action is needed.</p>"),
        optional_note("{{custom_invoice_message}}"),
        details([("Invoice", "#{{invoice_number}}"), ("Paid on", "{{invoice_date_paid}}"), ("Amount", "{{invoice_total}}"),
                 ("Method", "{{invoice_payment_method}}")]),
        primary("View your account", "{{online_profile_url}}", secondary=PORTAL),
    ], help_strip(b, reply_hint=False)), "Thanks for your payment. Your receipt for invoice #{{invoice_number}} is attached.", False

def unpaid_invoice(d):
    return doc(d, "Invoice", "#{{invoice_number}}", "Your invoice is ready", "Invoice", "", [
        prose("<p>Hi {{customer_first_name}},</p><p>Your invoice is attached. If you have a card or bank account on file, it is charged automatically "
              "the following day and there's nothing you need to do.</p><p>You can also pay or update your payment method any time in the customer portal.</p>"),
        optional_note("{{custom_invoice_message}}"),
        details([("Invoice", "#{{invoice_number}}"), ("Invoice date", "{{invoice_date}}"), ("Due", "{{invoice_due_date}}"),
                 ("Balance due", "<strong>{{invoice_balance_due}}</strong>")]),
        primary("View and pay online", "{{online_profile_url}}", warm=True, secondary=("Quick pay at wrld.tech/quick-pay", QUICK_PAY)),
        pay_tags(),
    ], help_strip(b, reply_hint=False)), "Invoice #{{invoice_number}} from WRLD Tech Co. is attached.", False

def statement(d):
    return doc(d, "Statement", "Account", "Your account statement", "Statement", "", [
        prose("<p>Hi {{customer_first_name}},</p><p>Your latest account statement is attached. It lists recent invoices and payments along with any open balance.</p>"),
        details([("Open balance", "<strong>{{customer_open_balance}}</strong>")]),
        primary("View and pay online", "{{online_profile_url}}", warm=True, secondary=("Quick pay at wrld.tech/quick-pay", QUICK_PAY)),
        pay_tags(),
    ], help_strip(b, reply_hint=False)), "Your WRLD Tech Co. account statement is attached.", False

def form_email(kind):
    def f(d):
        return doc(d, kind.capitalize() + " form", "", f"Your {kind} form", f"{kind.capitalize()} form", "", [
            prose(f"<p>Hi {{{{customer_first_name}}}},</p><p>Your {kind} form is attached for your records. If anything on it looks wrong, reply to this email and we'll fix it.</p>"),
            primary("View your account", "{{online_profile_url}}"),
        ], help_strip(b, reply_hint=False)), f"Your {kind} form from WRLD Tech Co. is attached.", False
    return f

def purchase_order(d):
    return doc(d, "Purchase order", "#{{purchase_order_number}}", "Purchase order #{{purchase_order_number}}", "From WRLD Tech Co.", "", [
        prose("<p>Hi {{vendor_rep_first_name}},</p><p>Please find our purchase order below. The PDF copy is attached. "
              "Reply to confirm receipt and the expected ship date.</p>"),
        details([("Vendor", "{{vendor_name}}"), ("Attention", "{{vendor_rep_first_name}} {{vendor_rep_last_name}}"),
                 ("Our account #", "{{vendor_account_number}}"), ("Expected by", "{{purchase_order_expected_date}}"),
                 ("Contact", "{{account_phone}} &middot; {{account_email}}")]),
        details([("Shipping", "{{purchase_order_shipping_notes}}"), ("Notes", "{{purchase_order_general_notes}}")], label="Instructions"),
        items_table("{{purchase_order_line_item_rows}}", [("#", "l"), ("Item", "l"), ("UPC", "l"), ("SKU", "l"), ("Qty", "r"), ("Price", "r"), ("Total", "r")]),
    ], vendor_help()), "Purchase order #{{purchase_order_number}} from WRLD Tech Co.", False

def ach_reminder(d):
    return doc(d, "Billing", "Bank account", "Confirm your bank account", "Action needed", chip("Action needed", T["warning"]), [
        prose("<p>Hi {{customer_first_name}},</p><p>You recently saved a bank account for recurring billing. Before we can use it, our payment processor "
              "needs you to confirm a small test deposit.</p><p>Look for a small deposit in that account with a note that includes a code. "
              "Then use the button below to enter the code and the deposit amount.</p>"),
        primary("Verify your bank account", "{{ach_verification_url}}", warm=True, secondary=("Update payment method", "{{online_profile_cc_url}}")),
    ], help_strip(b, reply_hint=False)), "One quick step to finish adding your bank account.", False

def card_expired(d):
    return doc(d, "Billing", "#{{invoice_number}}", "Your card on file has expired", "Payment not processed", chip("Card expired", T["danger"]), [
        prose("<p>Hi {{customer_first_name}},</p><p>We tried to charge {{invoice_total}} for invoice #{{invoice_number}}, but the card on file has expired.</p>"
              "<p>Update your payment method, or make a one-time payment in the customer portal.</p>"),
        details([("Invoice", "#{{invoice_number}}"), ("Amount", "{{invoice_total}}")]),
        primary("Update payment method", "{{online_profile_cc_url}}", warm=True, secondary=("Pay online instead", "{{online_profile_url}}")),
    ], help_strip(b, reply_hint=False)), "We couldn't charge your card on file. It has expired.", False

def charge_failed(d):
    return doc(d, "Billing", "#{{invoice_number}}", "We couldn't process your payment", "Payment not processed", chip("Payment failed", T["danger"]), [
        prose("<p>Hi {{customer_first_name}},</p><p>Your recurring charge of {{invoice_total}} for invoice #{{invoice_number}} didn't go through.</p>"
              "<p>Update your payment method, or make a one-time payment in the customer portal.</p>"),
        details([("Invoice", "#{{invoice_number}}"), ("Amount", "{{invoice_total}}")]),
        primary("Update payment method", "{{online_profile_cc_url}}", warm=True, secondary=("Pay online instead", "{{online_profile_url}}")),
    ], help_strip(b, reply_hint=False)), "Your recurring payment to WRLD Tech Co. didn't go through.", False

def appointment_reminder(d):
    return doc(d, "Appointment", "Reminder", "Your appointment is in {{appointment_hours_from_now}}", "Reminder", "", [
        prose("<p>Hi there,</p><p>This is a reminder of your upcoming appointment with WRLD Tech Co. The calendar invite is attached.</p>"),
        details([("What", "{{appointment_summary}}"), ("When", "{{appointment_start_time}}"), ("Where", "{{appointment_location}}")]),
        optional_note("{{appointment_instructions}}"),
        prose("<p>Can't make it? Reply to this email and we'll find a new time.</p>"),
    ], help_strip(b, reply_hint=False)), "Reminder: your WRLD Tech Co. appointment is in {{appointment_hours_from_now}}.", False

def appointment(d):
    return doc(d, "Appointment", "Scheduled", "Your appointment is scheduled", "Appointment", chip("Scheduled", T["accentPrimary"]), [
        prose("<p>Hi there,</p><p>We scheduled an appointment with you. The details are below.</p>"),
        details([("Starts", "{{appointment_start_time}}"), ("Ends", "{{appointment_end_time}}"), ("Where", "{{appointment_location}}")]),
        optional_note("{{appointment_instructions}}"),
        primary("View your account", "{{online_profile_url}}"),
    ], help_strip(b, reply_hint=False)), "Your WRLD Tech Co. appointment: {{appointment_start_time}}.", False

def ticket_appointment(d):
    return doc(d, "Field visit", "Scheduled", "Your field visit is scheduled", "Field visit", chip("Scheduled", T["accentPrimary"]), [
        prose("<p>Hi there,</p><p>We scheduled a technician visit with you. The details are below.</p>"),
        details([("When", "{{appointment_start_time}}"), ("Where", "{{appointment_location}}"), ("Contact phone", "{{customer_phone}}")]),
        optional_note("{{appointment_instructions}}"),
        primary("View your account", "{{online_profile_url}}"),
    ], help_strip(b, reply_hint=True)), "Your WRLD Tech Co. field visit: {{appointment_start_time}}.", True

def lead_autoresponder(d):
    steps = ('<ol style="margin:0 0 12px 22px;padding:0;">'
             '<li style="margin:0 0 6px 0;">Open a ticket at <a href="https://support.wrld.tech" style="color:#0a0a0a;">support.wrld.tech</a>, '
             'or right-click the WRLD icon in your taskbar and choose Remote Support Request.</li>'
             '<li style="margin:0 0 6px 0;">Email us from the address we have on file for you.</li>'
             '<li style="margin:0;">Send to the support inbox directly. Don\'t CC helpdesk@wrld.tech or help@wrld.support.</li></ol>')
    return doc(d, "Support", "Not received", "We couldn't open a ticket from your email", "Action needed", chip("No ticket created", T["warning"]), [
        prose("<p>Hi there,</p><p>Your email reached us, but it didn't match a contact in our system, so <strong>no ticket was created</strong> "
              "and this inbox isn't watched for unmatched mail.</p><p>To get help, please do one of the following:</p>" + steps +
              "<p>Or just call us and we'll sort it out.</p>"),
        primary("Open a ticket online", "https://support.wrld.tech", secondary=("Call 469.299.9598", "tel:" + b["phone_std_tel"])),
    ], help_strip(b, reply_hint=False)), "No ticket was created from your email. Here's how to reach us.", False

TEMPLATES = {
    "portal_invitation_email_body": portal_invitation,
    "sso_portal_invitation_email_body": sso_portal_invitation,
    "portal_password_reset_email_body": portal_password_reset,
    "estimate_email_body": estimate,
    "paid_invoice_email_body": paid_invoice,
    "invoice_email_body": unpaid_invoice,
    "statement_email_body": statement,
    "intake_form_email_body": form_email("intake"),
    "outtake_form_email_body": form_email("outtake"),
    "purchase_order_email_body": purchase_order,
    "ach_validation_reminder_email_body": ach_reminder,
    "recurring_charge_expired_email_body": card_expired,
    "recurring_charge_failed_email_body": charge_failed,
    "appointment_reminder_email_body": appointment_reminder,
    "appointment_email_body": appointment,
    "ticket_appointment_email_body": ticket_appointment,
    "lead_autoresponder_email_body": lead_autoresponder,
}
FILENAMES = {k: k.replace("_email_body", "").replace("_body", "").replace("_", "-") + ".html" for k in TEMPLATES}


def render(direction, key):
    parts, pre, reply = TEMPLATES[key](direction)
    return syncro_body(parts, reply_hint=reply, preheader=pre)

def allowed_tags(key):
    idx = json.loads((BACKUP / "index.json").read_text(encoding="utf-8"))
    listed = set(idx["emails"][key]["available_tags"])
    live = set(re.findall(r"\{\{[a-z0-9_]+\}\}", (BACKUP / "emails" / f"{key}.html").read_text(encoding="utf-8")))
    return listed | live

def validate(html, key):
    used = set(re.findall(r"\{\{[a-z0-9_]+\}\}", html))
    return sorted(used - allowed_tags(key))

def main():
    bad = {}
    for d in B.DIRECTIONS:
        out = B.DIST / "templates" / d / "syncro"
        out.mkdir(parents=True, exist_ok=True)
        for key in TEMPLATES:
            html = render(d, key)
            (out / FILENAMES[key]).write_text(html, encoding="utf-8")
            v = validate(html, key)
            if v: bad[key] = v
    if bad:
        for k, v in bad.items(): print("NOT ALLOWED", k, v)
        sys.exit(1)
    print("wrote", len(TEMPLATES) * len(B.DIRECTIONS), "Syncro bodies; every tag is allowed for its template")

if __name__ == "__main__":
    main()
