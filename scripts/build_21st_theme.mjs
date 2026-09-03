#!/usr/bin/env node
/**
 * Generates registry/theme/wrld.css — the shadcn / Tailwind v4 compatible
 * theme that carries the WRLD tokens to 21st.dev and to any shadcn project.
 *
 * Why generated
 * -------------
 * `21st publish-theme` accepts one CSS file with a `:root` block and a `.dark`
 * block of `--name: value;` pairs. Hand-maintaining that file would create a
 * fourth source of truth next to tokens.css / tokens.json / tokens.ts, and it
 * would drift. So this script derives every value from tokens/tokens.css (the
 * canonical suite, including the light/dark semantic surfaces and shadows) and
 * stamps the version from tokens/tokens.json. CI runs it with --check.
 *
 * What the theme contains
 * -----------------------
 * 1. The standard shadcn token set (--background, --foreground, --primary,
 *    --border, --ring, --chart-*, --sidebar-*, --radius, --font-*), mapped
 *    from the WRLD semantic tokens so stock shadcn components render in WRLD
 *    monochrome with the blue focus ring.
 * 2. The `--wrld-*` tokens themselves, so the WRLD registry components resolve
 *    exactly when the theme is applied (their first fallback layer).
 *
 * Run: node scripts/build_21st_theme.mjs           write the file
 *      node scripts/build_21st_theme.mjs --check   fail if the file is stale
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(REPO, 'registry', 'theme', 'wrld.css');
const CHECK = process.argv.includes('--check');

const css = readFileSync(join(REPO, 'tokens', 'tokens.css'), 'utf8');
const meta = JSON.parse(readFileSync(join(REPO, 'tokens', 'tokens.json'), 'utf8')).meta ?? {};

// ---------------------------------------------------------------------------
// Parse tokens.css. The file has three top-level blocks we care about, each
// closed by a `}` at column 0: the base `:root {`, the light
// `:root,\n:root[data-theme="light"] {`, and the dark `:root[data-theme="dark"] {`.
// ---------------------------------------------------------------------------
const block = (marker) => {
  const i = css.indexOf(marker);
  if (i < 0) throw new Error(`tokens.css: could not find block "${marker}"`);
  const open = css.indexOf('{', i);
  const close = css.indexOf('\n}', open);
  if (open < 0 || close < 0) throw new Error(`tokens.css: unterminated block "${marker}"`);
  return css.slice(open + 1, close);
};
const vars = (text) => {
  const out = {};
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of clean.matchAll(/--wrld-([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].replace(/\s+/g, ' ').trim();
  }
  return out;
};

const base = vars(block(':root {'));
const light = vars(block(':root,\n:root[data-theme="light"] {'));
const dark = vars(block(':root[data-theme="dark"] {'));

/** Replace every var(--wrld-*) reference with its literal value. */
const resolveVars = (value, scope) => {
  let v = value;
  for (let i = 0; i < 12; i++) {
    const next = v.replace(/var\(--wrld-([a-z0-9-]+)\)/g, (_, key) => {
      if (scope[key] == null) throw new Error(`tokens.css: unresolved reference --wrld-${key} in "${value}"`);
      return scope[key];
    });
    if (next === v) return v;
    v = next;
  }
  throw new Error(`tokens.css: reference cycle while resolving "${value}"`);
};

const resolved = (mode) => {
  const scope = { ...base, ...mode };
  return Object.fromEntries(Object.entries(scope).map(([k, v]) => [k, resolveVars(v, scope)]));
};
const L = resolved(light);
const D = resolved(dark);

const need = (map, key) => {
  if (map[key] == null) throw new Error(`tokens.css: missing --wrld-${key}`);
  return map[key];
};

// ---------------------------------------------------------------------------
// shadcn mapping. `accent` in shadcn is the hover surface, not a brand accent;
// WRLD's interactive accents land on --ring and the chart scale instead, which
// is where shadcn puts colour that is allowed to be seen.
// ---------------------------------------------------------------------------
const shadcn = (m) => [
  ['background', need(m, 'bg')],
  ['foreground', need(m, 'fg')],
  ['card', need(m, 'bg-elevated')],
  ['card-foreground', need(m, 'fg')],
  ['popover', need(m, 'bg-elevated')],
  ['popover-foreground', need(m, 'fg')],
  ['primary', need(m, 'fg')],
  ['primary-foreground', need(m, 'fg-inverse')],
  ['secondary', need(m, 'bg-muted')],
  ['secondary-foreground', need(m, 'fg')],
  ['muted', need(m, 'bg-muted')],
  ['muted-foreground', need(m, 'fg-muted')],
  ['accent', need(m, 'bg-muted')],
  ['accent-foreground', need(m, 'fg')],
  ['destructive', need(m, 'status-danger')],
  ['destructive-foreground', need(m, 'mono-0')],
  ['border', need(m, 'border')],
  ['input', need(m, 'border-strong')],
  ['ring', need(m, 'accent-primary')],
  ['chart-1', need(m, 'accent-primary')],
  ['chart-2', need(m, 'accent-secondary')],
  ['chart-3', need(m, 'accent-warm')],
  ['chart-4', need(m, 'fg-muted')],
  ['chart-5', need(m, 'fg-subtle')],
  ['sidebar', need(m, 'bg-subtle')],
  ['sidebar-foreground', need(m, 'fg')],
  ['sidebar-primary', need(m, 'fg')],
  ['sidebar-primary-foreground', need(m, 'fg-inverse')],
  ['sidebar-accent', need(m, 'bg-muted')],
  ['sidebar-accent-foreground', need(m, 'fg')],
  ['sidebar-border', need(m, 'border')],
  ['sidebar-ring', need(m, 'accent-primary')],
];

// Mode-independent extras. --radius drives shadcn's rounded-* scale:
// with 4px, rounded-md is 2px and rounded-xl is 8px — buttons sharp, cards 8px,
// exactly the WRLD preference.
const staticExtras = [
  ['radius', need(L, 'radius-sm')],
  ['font-sans', need(L, 'font-body')],
  ['font-display', need(L, 'font-display')],
  ['font-mono', need(L, 'font-mono')],
];

// The --wrld-* passthrough. Base keys appear in :root only; mode keys in both.
const WRLD_BASE_KEYS = [
  ...Object.keys(base).filter((k) => /^mono-\d+$/.test(k)),
  'accent-primary', 'accent-primary-rgb', 'accent-secondary', 'accent-secondary-rgb', 'accent-warm', 'accent-warm-rgb',
  'status-success', 'status-warning', 'status-danger', 'status-info',
  'font-display', 'font-body', 'font-mono',
  'ls-display', 'ls-eyebrow', 'ls-caps-xl',
  'radius-0', 'radius-sm', 'radius-md', 'radius-lg', 'radius-pill',
  'duration-micro', 'duration-default', 'duration-emphasis', 'duration-reveal',
  'ease-standard', 'ease-enter', 'ease-exit', 'ease-precise',
];
const WRLD_MODE_KEYS = [
  'bg', 'bg-subtle', 'bg-muted', 'bg-elevated',
  'fg', 'fg-muted', 'fg-subtle', 'fg-inverse',
  'border', 'border-strong', 'logo', 'logo-inverse',
  'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg',
  'shadow-accent-primary', 'shadow-accent-secondary', 'shadow-accent-warm',
  'focus-ring',
];

const line = (name, value) => `  --${name}: ${value};`;
const section = (title) => `  /* ---- ${title} ---- */`;

const rootLines = [
  section('shadcn semantic tokens (light)'),
  ...shadcn(L).map(([k, v]) => line(k, v)),
  ...staticExtras.map(([k, v]) => line(k, v)),
  '',
  section('WRLD tokens — mirror of tokens/tokens.css, resolved to literals'),
  ...WRLD_BASE_KEYS.map((k) => line(`wrld-${k}`, need(L, k))),
  ...WRLD_MODE_KEYS.map((k) => line(`wrld-${k}`, need(L, k))),
];
const darkLines = [
  section('shadcn semantic tokens (dark)'),
  ...shadcn(D).map(([k, v]) => line(k, v)),
  '',
  section('WRLD tokens (dark)'),
  ...WRLD_MODE_KEYS.map((k) => line(`wrld-${k}`, need(D, k))),
];

const output = `/* ============================================================
   WRLD — shadcn / Tailwind v4 theme
   Design tokens v${meta.version ?? '?'} · canonical: ${meta.canonical ?? 'https://github.com/WRLDInc/DesignSystem'}

   GENERATED by scripts/build_21st_theme.mjs from tokens/tokens.css.
   Do not edit by hand — run \`npm run registry:theme\` after a token change.

   Modern minimalist, monochrome light/dark. Accents are interactive only:
   #007fee lands on --ring (focus) and the chart scale, never on a surface.
   Typefaces are not embedded; load them from https://wrld.design/fonts/
   or bundle Montserrat, Ubuntu and Ubuntu Mono yourself.

   Usage (shadcn / Tailwind v4): paste both blocks into your globals.css.
   Usage (21st.dev):             21st publish-theme registry/theme/wrld.css --name "WRLD"
   ============================================================ */

:root {
${rootLines.join('\n')}
}

.dark {
${darkLines.join('\n')}
}
`;

const rel = relative(REPO, OUT);
if (CHECK) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : null;
  if (current !== output) {
    console.error(`Theme check FAILED — ${rel} is stale or missing.`);
    console.error('Run: npm run registry:theme   (then commit the result)');
    process.exit(1);
  }
  console.log(`Theme check passed — ${rel} matches tokens/tokens.css.`);
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, output);
  console.log(`Wrote ${rel} (${output.split('\n').length} lines) from tokens/tokens.css v${meta.version ?? '?'}.`);
}
