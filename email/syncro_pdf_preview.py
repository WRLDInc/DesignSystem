"""Fill the PDF templates with sample values and rasterise them (Letter width) for review."""
import re, asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT = Path(__file__).parent; SRC = ROOT / "dist/templates/pdf"; OUT = ROOT / "dist/preview/pdf"
ROW = lambda *c: "<tr>" + "".join(f'<td class="{k}">{v}</td>' for k, v in c) + "</tr>"
ITEMS = (ROW(("item","Managed IT"),("description","Fully Managed - Business Basic (10/01 - 10/31)"),("unitcost","$44.99"),("quantity","10"),("linetotal","$449.90"))
       + ROW(("item","IP"),("description","Dedicated IP"),("unitcost","$4.00"),("quantity","1"),("linetotal","$4.00")))
S = {"account_street":"4707 Algiers St. Ste 101","account_city":"Dallas","account_state":"TX","account_zip":"75207","account_website":"wrld.tech","account_phone":"469.299.9598",
 "customer_business_name_or_customer_full_name":"Northline Veterinary Group","customer_billing_address":"1200 Elm St","customer_billing_address2":"Suite 4",
 "customer_billing_city":"Dallas","customer_billing_state":"TX","customer_billing_zip":"75201","customer_phone":"2145550142",
 "invoice_name":"7203","invoice_number":"7203","invoice_date":"09-23-26","invoice_balance_due":"$481.69","invoice_subtotal":"$453.90","tax_label":"Tax",
 "invoice_tax":"$27.79","invoice_total":"$481.69","invoice_payments_amount":"$0.00","invoice_misc_credits":"$0.00","invoice_paid_stamp":"",
 "invoice_message":"Thanks for being a WRLD client.","invoice_disclaimer":"View terms and conditions online at wrld.tech/tos.",
 "invoice_line_items_table":ITEMS,"estimate_line_items_table":ITEMS,"purchase_order_line_items_table":ITEMS.replace('<td class="description">','<td class="description">').replace('<td class="unitcost">','<td class="item">0142</td><td class="unitcost">'),
 "purchase_line_items_table":ITEMS,"estimate_number":"1042","estimate_date":"09-23-26","estimate_total":"$3,480.00","estimate_subtotal":"$3,280.00","estimate_tax":"$200.00",
 "estimate_paid_stamp":"","estimate_message":"Pricing includes on-site install.",
 "statement_date":"09-23-26","statement_amount_due":"$963.38",
 "statement_line_items_table":ROW(("item","09-01-26"),("description","Invoice #7120"),("unitcost","$481.69"),("linetotal","$481.69"))+ROW(("item","09-23-26"),("description","Invoice #7203"),("unitcost","$481.69"),("linetotal","$481.69")),
 "statement_past_due_amounts_table":ROW(("center","$481.69"),("center","$481.69"),("center","$0.00"),("center","$0.00"),("center","$0.00"),("center","$963.38")),
 "vendor_name":"Ingram Micro","vendor_address":"3351 Michelson Dr","vendor_address_2":"","vendor_city":"Irvine","vendor_state":"CA","vendor_zip":"92612",
 "purchase_order_number":"PO-2231","purchase_order_date":"09-23-26","purchase_order_amount":"$793.20",
 "purchase_number":"5521","purchase_date":"09-23-26","purchase_paid_on":"09-23-26","purchase_amount":"$120.00","purchase_paid_stamp":"","purchase_identification":"DL ****4410",
 "customer_address":"1200 Elm St","customer_address_2":"Suite 4","customer_city":"Dallas","customer_state":"TX","customer_zip":"75201","signature_line":"Signature: ______________________",
 "ticket_number":"431500","ticket_subject":"Front desk scanner not saving to shared drive","ticket_date":"Wed 09-16-26 09:12 AM","ticket_status":"In Progress",
 "ticket_creator_name":"Jordan Reyes","ticket_address":"1200 Elm St","ticket_address_2":"Suite 4","ticket_city":"Dallas","ticket_state":"TX","ticket_zip":"75201",
 "ticket_public_comments":"<p><strong>Marcus Hale</strong> Thu 09-17-26 10:41 AM</p><p>Re-mapped the shared drive and re-ran a test scan. Leaving open until end of day.</p>",
 "ticket_public_comments_table":ROW(("item","09-17-26"),("description","Re-mapped the shared drive."))+ROW(("item","09-16-26"),("description","Pushed a driver refresh remotely.")),
 "asset_name":"NLV-FRONT-01","asset_serial_v2":"5CG1234XYZ","asset_type":"Desktop","asset_properties":"Windows 11 Pro","asset_table":ROW(("item","NLV-FRONT-01"),("description","5CG1234XYZ"),("description","Desktop"),("description","Windows 11 Pro")),
 "asset_custom_field_manufacturer":"HP","asset_custom_field_make":"EliteDesk","asset_custom_field_model":"800 G6","asset_custom_field_cpu_name":"i5-10500","asset_custom_field_ram":"16 GB","asset_custom_field_os":"Windows 11 Pro",
 "assets":"Scanner: Fujitsu fi-7160","ticket_meta_details":"Source: Email","ticket_images_rendered":"","ticket_disclaimer_template":"Opting out of recommended backups is at your sole discretion."}
async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page(viewport={"width": 816, "height": 1056})
        for f in sorted(SRC.glob("*.html")):
            html = re.sub(r"\{\{([a-z0-9_]+)\}\}", lambda m: S.get(m.group(1), "[" + m.group(1) + "]"), f.read_text(encoding="utf-8"))
            missing = sorted(set(re.findall(r"\[([a-z0-9_]+)\]", html)))
            (OUT / f.name).write_text(html, encoding="utf-8")
            await pg.set_content(html); await pg.wait_for_timeout(900)
            await pg.screenshot(path=str(OUT / (f.stem + ".png")), full_page=True)
            print(f.name, "missing samples:", missing)
        await br.close()
asyncio.run(main())
