import * as React from "react";
import { WrldQuote } from "./wrld-quote";

const frame: React.CSSProperties = {
  width: "min(960px, 100vw)",
  boxSizing: "border-box",
  padding: 24,
  background: "var(--wrld-bg-muted, var(--color-muted, #f4f4f5))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

// Sample client and sample values. Real client quotes never ship in a demo.
const settings = {
  reference: "Q-2026-SAMPLE",
  client: "Northbend Logistics",
  acceptLabel: "Accept agreement",
  total: "$3,770.00",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div style={frame}>
      <WrldQuote
        reference={s.reference}
        client={s.client}
        lede="Managed IT services agreement: Essential tier + dedicated DevOps retainer. Prepared for Dana Whitfield."
        chips={["Essential tier", "Partner pricing", "Month to month"]}
        meta={[
          { label: "Prepared for", value: "Dana Whitfield", detail: "COO, Northbend Logistics" },
          { label: "Prepared by", value: "Curtis Carney", detail: "Senior Account Manager" },
          { label: "Issued", value: "October 6, 2026" },
          { label: "Term", value: "Month to month", detail: "30 days written notice" },
        ]}
        sections={[
          {
            title: "What's included",
            items: [
              "Proactive 24/7 monitoring of every enrolled device via Syncro RMM",
              "Huntress managed EDR/ITDR with 24/7 SOC threat hunting",
              "Hexnode MDM and Apple Business Manager zero-touch deployment",
              "Helpdesk portal, Monday to Friday 8am–6pm CST, 1-hour critical response",
            ],
          },
        ]}
        pricingNote="Sample values. Per-device rates are the rates you pay, with partner pricing already applied."
        lineItems={[
          { label: "MacBook", qty: 12, rate: "$118.00", amount: "$1,416.00", note: "Office MacBooks" },
          { label: "Windows laptop", qty: 6, rate: "$104.00", amount: "$624.00", note: "Dispatch PC laptops" },
          { label: "Hexnode MDM licensing", qty: "Flat", rate: "$130.00", amount: "$130.00", note: "Mac environment" },
          { label: "Dedicated DevOps retainer", qty: "16 hrs", rate: "$1,600", amount: "$1,600.00", note: "No rollover" },
        ]}
        total={{ amount: s.total, breakdown: "12 MacBooks ($1,416.00) + 6 Windows laptops ($624.00) + Hexnode MDM ($130.00) + DevOps retainer ($1,600.00)" }}
        fees={[{ label: "One-time", amount: "$2,400.00", when: "Due upon signing", description: "Onboarding of all eighteen laptops: RMM and security stack enrollment, MDM, identity baseline, policy configuration and team orientation." }]}
        terms={[
          "Monthly recurring billing begins upon signing.",
          "60-day service quality and satisfaction guarantee.",
          "Month to month; either party may end the engagement with 30 days written notice.",
        ]}
        acceptLabel={s.acceptLabel}
        acceptHref="mailto:helpdesk@wrld.tech?subject=Accept%20Q-2026-SAMPLE"
      />
    </div>
  );
}
