# WRLD registry for 21st.dev

Self-contained TypeScript ports of the design system's UI kits, published to the
WRLD team library on [21st.dev](https://21st.dev) so React + shadcn projects can
install them with one command. The runbook is
[`../docs/21ST_PUBLISHING.md`](../docs/21ST_PUBLISHING.md).

```
registry/
├── manifest.json     what publishes where; the publisher records stable refs here
├── theme/wrld.css    GENERATED shadcn / Tailwind v4 theme — npm run registry:theme
├── assets/           the 128px render of the authentic mark that the lockup-bearing components inline
├── ui/               atoms      wrld-button · wrld-eyebrow · wrld-lockup · wrld-help-button
│                                wrld-stat-card · wrld-top-bar · wrld-run-history · wrld-agent-list
├── blocks/           sections   wrld-hero · wrld-cta · wrld-values-strip · wrld-services-grid
│                                wrld-footer · wrld-sidebar · wrld-agent-detail · wrld-header
└── tsconfig.json     strict typecheck — npm run registry:check
```

Each component is one file with a provenance header pointing at its `ui_kits/`
source, a `t` token map that resolves `--wrld-*` → the host's `--color-*` theme →
the WRLD literal, and a `*.demo.tsx` beside it that declares `settings` for live
controls in Studio. Demos load nothing external — 21st's renderer blocks
cross-origin requests during capture — so previews show system type and the
components carry the mark inline.

| Task | Command |
|---|---|
| Typecheck + theme freshness | `npm run registry:check` |
| Screenshot every component in 21st's sandbox | `npm run registry:render` |
| Publish or revise (Studio review) | `npm run registry:publish` |
| Publish headlessly | `npm run registry:publish -- --auto` |
| Publish the theme (public; confirm first) | `npm run registry:publish:theme -- --yes-public` |

Credentials: a **team** API key in `API_KEY_21ST`, never in this directory.
