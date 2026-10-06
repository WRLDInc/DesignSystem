# Quote and agreement design guidelines

How a WRLD quote, managed services agreement or SOW is built: the blocks it is
made of, which tokens each block uses, how the copy reads, and what an agent
producing one must and must not do.

| Piece | Where |
| --- | --- |
| Printable framework (`wq-` classes) | [`templates/quote/quote.css`](../templates/quote/quote.css) |
| Reference document (sample client, sample values) | [`templates/quote/index.html`](../templates/quote/index.html), served at <https://wrld.design/templates/quote/> |
| Preview card | [`preview/documents-quote.html`](../preview/documents-quote.html), in the Documents section of `/system` |
| React port for portals and web quotes | [`registry/blocks/wrld-quote.tsx`](../registry/blocks/wrld-quote.tsx) |

Read [`README.md`](../README.md) and [`brand/CLAUDE.md`](../brand/CLAUDE.md)
first. Nothing here overrides them; this document applies them to one kind of
deliverable.

## 1. What this covers

| Document | Variant | Typical length |
| --- | --- | --- |
| Managed services agreement (one tier, recurring) | `agreement` | 6 to 8 Letter pages |
| Good / better / best quote | `tiered` (`wq-tiers` block) | 1 to 2 pages |
| Project quote or SOW (one-time, milestones) | `agreement` with the fee callout in place of the total band | 2 to 4 pages |

The reference document is the Essential tier managed IT agreement, with a
fictional client (Northbend Logistics) and sample values. Real client
documents are generated from the same framework and are never committed to
this repo: client names, contacts and pricing stay out of a public tree.

## 2. Anatomy

```
┌───────────────────────────────────────────────────────────┐
│ WRLD.TECH lockup        Q-2026-0142  ×  CLIENT MARK       │ 1 running head
├───────────────────────────────────────────────────────────┤
│ MANAGED IT & CYBERSECURITY AGREEMENT                      │ 2 cover: eyebrow
│ Client name                                               │   title = the client
│ One-line description. Prepared for <contact>.             │   lede
│ (Essential tier) (Partner pricing) (Month to month)       │   chips
│ PREPARED FOR · PREPARED BY · ISSUED · COVERAGE            │   meta strip
│                                                           │
│ Dear <first name>,  …  Sincerely, <account lead>          │ 3 cover letter
├───────────────────────────────────────────────────────────┤
│ 04  Pricing summary                                       │ 4 section
│ DEVICE CATEGORY   QTY   RATE / MO   MONTHLY   NOTES       │ 5 line items
│ ███ MONTHLY RECURRING TOTAL              $0,000.00 / mo █ │ 6 total band
│ ┌ ONE-TIME $0,000.00 │ what the fee covers ┐            │ 7 fee callout
├───────────────────────────────────────────────────────────┤
│ CLIENT · NAME                WRLD INC. · DBA WRLD TECH CO.│ 8 signatures
├───────────────────────────────────────────────────────────┤
│ WRLD Inc. [DBA WRLD Tech Co.]   helpdesk@ · phone   04/07 │ 9 running foot
└───────────────────────────────────────────────────────────┘
```

### Block reference

| Block | Class | Use for | Rules |
| --- | --- | --- | --- |
| Sheet | `wq-sheet` > `wq-head` + `wq-body` + `wq-foot` | Every page | Fixed 8.5 × 11in, 0.6in side margins, 0.5in top and bottom. Content that does not fit moves to the next sheet; nothing scales down to fit. |
| Running head | `wq-head` | Every page | WRLD.TECH lockup (`assets/logos/wrld-tech-black.png`, 18px tall), document reference in mono, `×`, the client mark. |
| Client mark | `wq-client` | Running head | The client's own logo file, 18 to 28px tall. With no file, their name as uppercase Montserrat (`wq-client-name`), never a recreated logo. |
| Cover | `wq-cover` | Page 1 | Eyebrow names the document type, title is the client's name, lede says what it is and who it is for. |
| Chips | `wq-chip`, `wq-chip.is-solid` | Cover | Tier (solid), pricing basis, term. Three at most. |
| Meta strip | `wq-meta` | Cover | Four fields: prepared for, prepared by, issued, plus term or coverage. |
| Letter | `wq-letter` | Page 1 | Salutation by first name, two or three short paragraphs, sign-off by the account lead with email and phone in mono. |
| Section | `wq-section` + `wq-section-head` | Each major part | Two-digit mono number, Montserrat 600 heading, hairline beneath. Numbering runs through the document. |
| List | `wq-list` (`.is-cols` for two columns) | Inclusions, terms, costs | Hairline rule bullets, drawn in CSS. Never dots, checks or emoji. |
| Facts | `wq-facts` | Coverage, SLA, included time | Four cells: label in mono caps, value in Montserrat 600, qualifier in muted body. |
| Line items | `wq-table` | Device inventory, services | Numerals in mono, right-aligned (`is-num`); the line total is the only bold column (`is-strong`). |
| Total band | `wq-total` | Monthly recurring total | The one inverted moment in the document, `--wrld-mono-950` on paper. One per document. The breakdown line underneath restates the arithmetic. |
| Fee callout | `wq-fee` | One-time fees (onboarding, project deposit) | Bordered, never inverted, so it reads as secondary to the recurring total. |
| Rate card | `wq-table` | Hourly rates beyond scope | Ranges in mono with spaced en dashes: `$95 – $135 / hr`. |
| Definition rows | `wq-defs` | Payment methods, security stack | Term, fee in mono, explanation. `wq-tag` marks the recommended method. |
| Note | `wq-note` | Pricing basis, caveats, phase-two scope | `--wrld-bg-subtle` panel, 4px radius, small type. Never a coloured left border. |
| Tiers | `wq-tiers` > `wq-tier` (`.is-recommended`) | Good / better / best | The recommended tier gets a 2px near-black border. No accent fill, no "most popular" ribbon. |
| Summary bar | `wq-summary` | Above signatures | Tier, client, term restated in one line so the signer sees what they are agreeing to. |
| Signatures | `wq-sign` > `wq-party` | Last page | Both parties. Client first, then WRLD Inc. Signature, printed name and title, date. |
| Running foot | `wq-foot` | Every page | Legal entity, contact line, page `NN / NN`. |

## 3. Tokens

| Element | Token |
| --- | --- |
| Paper | `--wrld-mono-0`. Paper is light in every theme; the document is the artifact. |
| Screen canvas around the sheets | `--wrld-bg-muted`, sheets lifted with `--wrld-shadow-md` (screen only) |
| Body | `--wrld-font-body` 12.5px (≈ 9.5pt), `--wrld-lh-body`, `--wrld-fg` |
| Secondary copy | `--wrld-fg-muted` (`#52525b`, 7.7:1 on white) |
| Labels, running head and foot | `--wrld-font-mono` 9.5px, `--wrld-fg-subtle` (`#71717a`, 4.8:1 on white), 0.12em tracking, uppercase |
| Cover title | `--wrld-font-display` 700, 34px, `--wrld-ls-display` |
| Section heading | `--wrld-font-display` 600, 20px (`--wrld-fs-h4`) |
| Hairlines | `--wrld-border` for structure, `--wrld-border-strong` under table heads, `--wrld-mono-100` between rows |
| Total band | background `--wrld-mono-950`, text `--wrld-mono-50`, labels `--wrld-mono-400` (7.7:1 on near-black) |
| Radius | `--wrld-radius-md` (8px) on the total band, fee callout, facts and tiers; `--wrld-radius-sm` on notes; pill on chips |
| Spacing | `--wrld-space-*` only. Section gap 24px, block gap 12px |

**Colour.** A printed page has no hover, so it has no accent. The only colour
on paper is the blue rule inside the WRLD.TECH lockup. Status colours do not
appear in quotes. The React port brings the accents back on interactive
elements only: the accept button, links, focus rings.

## 4. Copy

- Sentence case for every heading and label in source; uppercase comes from CSS on eyebrows, labels and chips only.
- "We" for WRLD, "you" for the client. Use the client's name where the sentence needs a proper noun; never "the client" in body copy.
- Show the rate the client pays. Partner, friends and family or volume pricing is applied to the per-device rate and stated once in the pricing note, not shown as a strike-through or a discount line.
- Money: always two decimals in tables and totals (`$1,416.00`); ranges in the rate card may drop cents. Hours as `24 hrs`, multipliers as `1.25x–2x`.
- Product names as the vendor writes them: Syncro RMM, Huntress, Hexnode MDM, 1Password, UniFi, Apple Business Manager.
- Legal entity in the foot and signature block: `WRLD Inc. [DBA WRLD Tech Co.]`. The cover and letter use WRLD Tech Co.
- Contact line in the running foot: `helpdesk@wrld.tech · 469.299.9598`, or the account lead's direct line on a client's final copy.
- No emoji, no exclamation marks, no "revolutionary". Short paragraphs, two or three sentences.

## 5. Producing a client document

1. Copy `templates/quote/index.html` to the client's working folder, outside this repo. Keep `quote.css` linked from wrld.design or vendored beside it.
2. Replace the reference (`Q-2026-SAMPLE`), the client name, contact, dates and every value in the line items, total band and fee callout. Recalculate the breakdown line under the total.
3. Add the client's logo to the running head. If you do not have their file, leave their name as type and ask for the logo before the final send.
4. Check every sheet in the browser at 100%. If a sheet's content runs past its foot, move the last block to the next sheet; never shrink type.
5. Print to PDF from Chrome: Letter, margins none, background graphics on. The `@page` rule does the rest.
6. File the PDF and the HTML source in the client's Craft folder under Billing, with a revision history line.

## 6. Accessibility and print

- Text contrast is 4.5:1 or better on paper and inside the total band. `--wrld-mono-400` is only used on near-black.
- Tables use real `<th>` heads; the document has one `<h1>` (the client) and `<h2>` per section.
- Each sheet is an `<article>` labelled "Page N of M".
- The React port follows the theme. On the dark elevated surface `--wrld-fg-subtle` measures 3.7:1, so its labels use `--wrld-fg-muted` instead.
- Self-hosted fonts load from `fonts/` through `styles.css`. Never substitute Google Fonts; a PDF rendered before the fonts load is a broken PDF.

## 7. Do and don't

| Do | Don't |
| --- | --- |
| Put the client's logo in the running head | Recreate a client's logo in type or SVG |
| Keep one total band per document | Invert several blocks for emphasis |
| Move a block to the next sheet when it does not fit | Scale type down to squeeze a page |
| State the pricing basis once, in the note | Show strike-through "was" prices |
| Use the hairline bullet | Use ✓, •, or emoji bullets |
| Keep client documents out of this repo | Commit a real client's pricing as an example |

## Changelog

| Date | Change |
| --- | --- |
| 2026-10-06 | First version. Framework, reference document, card and React port, built from the Essential tier agreement structure. |
