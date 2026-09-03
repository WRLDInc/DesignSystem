# Publishing the design system to 21st.dev

How the components in this repository reach the **WRLD team library on
[21st.dev](https://21st.dev)**, how a React project installs them, and how to
keep the library in step with the UI kits. This is the repo-side runbook; the
team-wide standard operating procedure lives in Craft
("SOP — 21st.dev at WRLD: Components, 21st AI & Publishing").

---

## 1. What is where

| | |
|---|---|
| **21st team** | WRLD (team id `6e4b7cb3-1f2f-4105-90ec-e6e842433474`) |
| **Library** | `wrld-tech` — agency-wide reusable sections. Client work goes in its own library (`casp3r`, …), never here. |
| **Install namespace** | `@ridgelawrence` — 21st attributes a team-library component to the account whose key published it, so install refs and registry URLs use the author namespace, not the team slug (`curtis-c-s-team`). Confirmed on the first publish, 3 Sep 2026. |
| **Visibility** | `private` by default — teammates and keyed installs only. Flip per component with `--visibility published`. |
| **Sources** | `registry/ui/*.tsx` (atoms) and `registry/blocks/*.tsx` (sections), one `*.demo.tsx` beside each |
| **Theme** | `registry/theme/wrld.css` — generated from `tokens/tokens.css`, never hand-edited |
| **Manifest** | `registry/manifest.json` — names, slugs, descriptions, tags, registry kind, library, visibility, stable refs |
| **Publisher** | `scripts/publish_21st.mjs` around the pinned `@21st-dev/cli` |

Every component in `ui_kits/` has exactly one port in `registry/`, named with a
`Wrld` prefix and a `wrld-` slug:

| Kit source | Registry port | Kind |
|---|---|---|
| `ui_kits/wrld-tech/Button.jsx` | `registry/ui/wrld-button.tsx` | ui |
| `ui_kits/wrld-tech/Eyebrow.jsx` | `registry/ui/wrld-eyebrow.tsx` | ui |
| `ui_kits/_shared/Lockup.jsx` | `registry/ui/wrld-lockup.tsx` | ui |
| `ui_kits/wrld-tech/HelpButton.jsx` | `registry/ui/wrld-help-button.tsx` | ui |
| `ui_kits/wrld-ai/StatCard.jsx` | `registry/ui/wrld-stat-card.tsx` | ui |
| `ui_kits/wrld-ai/TopBar.jsx` | `registry/ui/wrld-top-bar.tsx` | ui |
| `ui_kits/wrld-ai/RunHistory.jsx` | `registry/ui/wrld-run-history.tsx` | ui |
| `ui_kits/wrld-ai/AgentList.jsx` | `registry/ui/wrld-agent-list.tsx` | ui |
| `ui_kits/wrld-tech/Hero.jsx` | `registry/blocks/wrld-hero.tsx` | blocks |
| `ui_kits/wrld-tech/CTA.jsx` | `registry/blocks/wrld-cta.tsx` | blocks |
| `ui_kits/wrld-tech/ValuesStrip.jsx` | `registry/blocks/wrld-values-strip.tsx` | blocks |
| `ui_kits/wrld-tech/ServicesGrid.jsx` | `registry/blocks/wrld-services-grid.tsx` | blocks |
| `ui_kits/wrld-tech/Footer.jsx` | `registry/blocks/wrld-footer.tsx` | blocks |
| `ui_kits/wrld-ai/Sidebar.jsx` | `registry/blocks/wrld-sidebar.tsx` | blocks |
| `ui_kits/wrld-ai/AgentDetail.jsx` | `registry/blocks/wrld-agent-detail.tsx` | blocks |
| `ui_kits/wrld-tech/Header.jsx` | `registry/blocks/wrld-header.tsx` | blocks |

---

## 2. Credentials

Publishing into a team library requires a **team** API key. A personal key can
create a team-scoped draft but cannot publish it (HTTP 403 `draft_scope_changed`).

1. Mint or copy the team key at <https://21st.dev/settings/api-keys>.
2. Export it for the shell session only:

   ```bash
   export API_KEY_21ST=21st_sk_…      # TWENTYFIRST_TOKEN also works
   ```

3. Confirm it resolves to the team — `whoami` reports "Not logged in" even with a
   valid key, so use a team-scoped call instead:

   ```bash
   npx 21st library list --json      # should list wrld-tech and casp3r
   ```

**Never** commit the key, paste it into Craft or Slack, or put it in
`registry/manifest.json`. If a key is exposed anywhere, rotate it on 21st and
update the GitHub secret (section 6).

---

## 3. Rules for a registry file

21st publishes **one component file and one demo**. Additional local files,
`21st.json` and registry dependencies are not supported, which shapes every rule
below.

- **Self-contained.** No imports from `../` or `@/`. If a section needs the
  lockup or a button, inline a private copy and say so in the header. Only npm
  packages may be imported, and each must be declared in `package.json`
  (`react`, `lucide-react` today).
- **Provenance header.** The file starts with a comment naming the kit source
  (`ui_kits/…`), the token order and any deliberate deviations. Update it when
  the kit changes.
- **Portable tokens, in this order.** Every colour, font, shadow and easing is
  read from a small `t` map at the top of the file:

  ```ts
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))"
  ```

  `--wrld-*` wins on WRLD pages that link `tokens.css`; the host's shadcn /
  Tailwind v4 theme (`--color-*`) wins in the 21st preview and in stock shadcn
  apps; the literal is the WRLD light-mode value. Never assume the storage format
  of a raw shadcn variable (`hsl(var(--primary))` is rejected by the CLI); use
  `var(--color-*)` or `color-mix()` for tints.
- **Brand rules still apply.** Monochrome surfaces; accents only on hover, focus
  and motion; sentence case; no emoji; the authentic raster mark, never generated
  geometry. Components carry the mark inline as a 128px render of the original
  artwork (`registry/assets/wrld-mark-black-128.png`) and accept
  `markSrc` for the full-resolution file on `https://wrld.design/assets/logos/`.
- **Nothing external during a preview.** 21st's renderer refuses any request
  that leaves its origin: a typeface from `wrld.design` or a hotlinked mark fails
  the cover with "Capture request left its allowed origin". So demos load no
  fonts and no remote images. Previews therefore show the system stack where the
  tokens ask for Ubuntu or Montserrat; the installed component picks up the real
  typefaces on any page that loads them (`https://wrld.design/styles.css`).
- **Demos are the preview.** Each demo paints its frame with the same token
  chain and declares a module-level `settings` object whose keys become live
  controls in Studio. Strings become text fields, numbers sliders, booleans
  switches.
- **Accessibility.** Clickable rows are `<button>`s, nav links are `<a href>`,
  decorative elements are `aria-hidden`, motion respects
  `prefers-reduced-motion` where the kit did.
- **Slug equals filename.** `wrld-button.tsx` publishes as `wrld-button`; the
  manifest `name` supplies the display casing ("WRLD Button"), because 21st's
  auto-detected name would read "Wrld Button".

---

## 4. Commands

All of these run from the repo root after `npm ci`.

| Command | What it does |
|---|---|
| `npm run registry:theme` | Regenerate `registry/theme/wrld.css` from `tokens/tokens.css`. Run after any token change and commit the result. |
| `npm run registry:check` | Theme freshness + strict typecheck of every port and demo. Part of `npm run check` and of CI. |
| `npm run registry:render` | Build every component in 21st's sandbox and save a screenshot under `registry/.renders/<slug>/default.png`. Publishes nothing. One of 21st's render hosts sometimes returns a generic "Component Example" counter instead of the demo; every such capture is 2973×2232 (a real one is 3840×2880), so the script renders once more when it sees that size and, if it persists, sets the file aside as `scaffold.png` so nothing stages it. Still look at every PNG before publishing. |
| `npm run registry:publish` | Create a reviewed draft per component and print its Studio **CLI Review** URL. Finish there: check every demo in light and dark, then publish. When `registry/.renders/<slug>/default.png` exists the script stages it as the cover (`--preview`), so a cover you have already looked at ships instead of a blind regeneration; `--no-covers` opts out. |
| `npm run registry:publish -- --auto` | Headless: wait for the generated cover, publish, and record the refs. What CI uses. |
| `npm run registry:publish -- --only wrld-button,wrld-lockup` | Limit any mode to specific slugs. |
| `npm run registry:publish -- --auto --wait` | Poll the draft allowance every 90 s and start each component as soon as a slot frees (up to `--wait 7200` seconds per component). Without it the CLI sleeps a fixed ~58 minutes per retry when the allowance is exhausted, even if a slot frees three minutes later. Works with `--render` too. |
| `npm run registry:publish -- --visibility published` | Override the manifest visibility for this run. |
| `npm run registry:publish:theme -- --yes-public` | Publish the theme. **Themes are public** and every run creates a **new** theme — confirm with Ridgeway or Curtis first. Retag or rename with `npx 21st edit <id> --type theme`; only re-publish when colours change, then `npx 21st delete <old-id> --type theme --yes`. |
| `npm run registry:publish -- --dry-run` | Print the exact CLI commands without running them. |

Exit codes (the script mirrors the CLI and exits `1` if any component failed):

| Code | Meaning | Do |
|---|---|---|
| 0 | Published | Commit `registry/manifest.json` — it now holds the `component:<id>`. |
| 2 | Draft handed off | Open the printed Studio URL, or `npx 21st open draft:<uuid>`. The manifest records the draft. |
| 3 | Auth | Export a **team** key (section 2). |
| 4 | Rate limited | Wait, then re-run with `--only` for what is left. |
| 5 | Build failed | Fix the component; confirm with `npm run registry:render`. |
| 6 | Cover not ready | Re-run, or stage a cover in Studio. Full-bleed sections sometimes defeat the auto cover. |
| 7 | Conflict | The slug exists or a revision is pending. Record its `component:<id>` in the manifest and re-run so it becomes a revision. |

---

## 5. Updating a published component

The manifest's `component` field is the stable ref. When it is set, the
publisher passes `--component component:<id>` and 21st creates a **revision**
that goes through CLI Review; the live component does not change until that
revision is published. Never replace a recorded ref with a slug guess.

```bash
npx 21st components --json                 # inventory: every component and draft the key can manage
npm run registry:publish -- --only wrld-button   # revise from the local source
```

A change to a kit component is not finished until its port is updated too, and
the reverse. Keep the provenance header honest.

---

## 6. CI

- **`validate.yml` → `registry`** runs on every push and pull request:
  `npm ci`, theme freshness (`build_21st_theme.mjs --check`) and
  `tsc -p registry/tsconfig.json`. A token change without a regenerated theme
  fails here, not on 21st.
- **`publish-21st.yml`** is manual (*Actions → publish-21st → Run workflow*).
  Inputs: `only` (comma-separated slugs, empty for all) and `visibility`
  (`private` default). It needs the repository secret **`API_KEY_21ST`** (a team
  key; Settings → Secrets and variables → Actions). It publishes headlessly with
  `--auto`, then pushes the updated manifest to
  `chore/21st-manifest-<run id>` and links the pull request to open, so the
  stable refs land on `main`.

---

## 7. Installing WRLD components in a project

Private components install with the team key. This section is the consumer
guide; point teammates and client projects here.

**shadcn CLI, registry namespace.** In the project's `components.json`:

```json
{
  "registries": {
    "@wrld": {
      "url": "https://21st.dev/r/ridgelawrence/{name}.json",
      "headers": { "Authorization": "Bearer ${API_KEY_21ST}" }
    }
  }
}
```

```bash
export API_KEY_21ST=21st_sk_…
npx shadcn@latest add @wrld/wrld-button
```

**shadcn CLI, direct URL** (what `21st add --print` emits):

```bash
npx shadcn@latest add "https://21st.dev/r/ridgelawrence/wrld-button?api_key=$API_KEY_21ST"
```

**21st CLI.**

```bash
npx @21st-dev/cli add @ridgelawrence/wrld-button
```

**Theme.** Paste `registry/theme/wrld.css` (or link
`https://wrld.design/registry/theme/wrld.css`) into the project's `globals.css`
so stock shadcn components take on WRLD monochrome, the blue focus ring and the
Ubuntu / Montserrat / Ubuntu Mono stacks. Load the typefaces from
`https://wrld.design/fonts/` or bundle them.

Both `https://21st.dev/r/ridgelawrence/<slug>` and `…/<slug>.json` return the
registry item (verified with the team key on 3 Sep 2026); the team-slug form
`https://21st.dev/r/curtis-c-s-team/…` does not.

---

## 8. Adding a component

1. Build it in the UI kit first (`ui_kits/…`), so `_ds_bundle.js` and the
   preview pages stay the reference.
2. Port it: `registry/ui/<slug>.tsx` or `registry/blocks/<slug>.tsx` with the
   provenance header and the `t` token map; `<slug>.demo.tsx` with fonts, frame
   and `settings`.
3. Add its entry to `registry/manifest.json`: `slug`, `name`, `registry`,
   `file`, `demo`, a 10+ character `description` that says what it does and when
   to use it, one to five `tags`, `source`, and `component: null`.
4. `npm run registry:check`, then `npm run registry:render -- --only <slug>` and
   look at the PNG in both themes' terms: nothing blank, no wrong colours, the
   primary accent only on interaction.
5. Publish (section 4), review in Studio, commit the recorded ref.
6. Document: CHANGELOG, this runbook's component table, the Craft SOP, and a
   Slack follow-up in `#webdev`.

---

## 9. Known limits

- One component file + one demo per publish; no shared local modules, no
  `21st.json`, no `--registry-dep`. Hence the inlined lockups and buttons.
- **The draft allowance is the real budget.** Every `21st render` and every
  `21st publish` creates a draft, and the team allowance (20 at the time of
  writing) is a rolling window: a slot comes back about an hour after the
  render or publish that used it, and deleting a draft does not free one. The
  publisher prints the allowance before a batch; when it is short the CLI
  sleeps ~58 minutes per retry, which looks like a hang — pass `--wait` so the
  publisher polls for a slot and starts the next component the minute one
  frees. Spend slots on publishes first: a verified render costs a slot too, so
  render only what you intend to look at. `npx 21st components --json` shows
  `draftAllowance` at any time.
- Every `publish-theme` creates a new public theme. Treat the theme as a release,
  not a build artefact.
- `21st whoami` is a false negative with a valid key; `21st usage` is unavailable
  to team keys. Use `21st library list` to confirm scope.
- The 21st preview does not load `tokens.css`; components rely on the shadcn
  fallback layer there, which is why the token order in section 3 matters.
- The renderer blocks cross-origin requests during capture (fonts, images,
  fetches). Anything a demo needs must be inline; that is why the mark is a
  data URI and why previews use system type.
- Cover generation is not deterministic: one render host occasionally captures
  a generic "Component Example" counter instead of the demo. The publisher
  recognises it by size (2973×2232), re-renders once, sets a persisting one
  aside as `scaffold.png` and never stages a scaffold as a cover. Still look at
  every render before publishing and let the publisher stage the verified PNG.
  Two render requests in flight at once have also stalled for half an hour;
  run batches sequentially and rely on `--timeout`.
