# Quote template

Printable US Letter quotes and agreements on the WRLD quote framework. The
guideline is [`docs/QUOTE_DESIGN.md`](../../docs/QUOTE_DESIGN.md); read it
before producing a client document.

| File | What it is |
| --- | --- |
| `quote.css` | The framework. Every `wq-` block, built on `--wrld-*` tokens, with the `@page` and print rules. Imports `../../styles.css` for tokens and self-hosted fonts. |
| `index.html` | Reference managed services agreement: cover and letter, service overview, inclusions, coverage facts, retainer, line-item pricing, total band, onboarding fee, rate card, security stack, billing and payment terms, signatures. Seven sheets. |
| `tiered.html` | Reference one-page good / better / best quote with a comparison table and acceptance line. |

Both references use a fictional client (Northbend Logistics) and sample
values. Real client documents are produced outside this repo.

## Use it

1. Copy `index.html` (or `tiered.html`) next to your working files. Link
   `https://wrld.design/templates/quote/quote.css`, or vendor `quote.css` with
   `styles.css`, `tokens/`, `colors_and_type.css` and `fonts/` in the same
   relative layout.
2. Replace the reference number, client, contact, dates, line items, totals
   and the breakdown line. Add the client's logo inside `.wq-client`.
3. Keep each sheet's content inside its foot. If a block runs over, move it to
   the next `<article class="wq-sheet">` and renumber the page counters.
4. Chrome → Print → Save as PDF, Letter, margins none, background graphics on.

## Not in scope here

Web-rendered quotes in a portal use the React port,
[`registry/blocks/wrld-quote.tsx`](../../registry/blocks/wrld-quote.tsx).
