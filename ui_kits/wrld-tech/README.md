# wrld.tech — Flagship UI Kit

Marketing site components for the flagship property. Monochromatic surfaces, accent on hover only, sentence case throughout.

**Tone dial:** warmth high · formality medium · technicality low · urgency low.
**Lead with:** strategic partnership, comprehensive one-stop. Soft-pedal: SMB-specialization (it's implicit on flagship).

## Files

- `index.html` — clickable homepage demo. Hero + services grid + values strip + CTA + footer.
- `Header.jsx`, `Hero.jsx`, `ServicesGrid.jsx`, `ValuesStrip.jsx`, `CTA.jsx`, `Footer.jsx` — modular sections.
- `Button.jsx`, `Eyebrow.jsx`, `HelpButton.jsx` — atoms.

## Notes

- Hero CTA hover uses `--accent-primary` (#007FEE).
- "Client portal ↗" link uses warm accent on hover (commerce).
- `HelpButton.jsx` is the WRLD Help launcher — the canonical visual for the
  Gleap widget's corner button (warm `#EE9300`, one of the few sanctioned
  static accent uses). Use it wherever a menu or card represents Help —
  e.g. the header mega menu's Help panel on wrld.tech.
- All sub-brand cards link out to their respective properties.
