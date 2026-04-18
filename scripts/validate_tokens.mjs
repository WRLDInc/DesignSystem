#!/usr/bin/env node
/**
 * Minimal token validator — keeps the three source-of-truth token files
 * (tokens.css, tokens.json, tokens.ts) from drifting on the colors that
 * matter most.
 *
 * Run: node scripts/validate_tokens.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');

const css = readFileSync(resolve(REPO, 'tokens/tokens.css'), 'utf8');
const json = JSON.parse(readFileSync(resolve(REPO, 'tokens/tokens.json'), 'utf8'));
const ts = readFileSync(resolve(REPO, 'tokens/tokens.ts'), 'utf8');

const errors = [];

const expected = {
  'mono-950': '#0a0a0a',
  'mono-0':   '#ffffff',
  'accent-primary':   '#007fee',
  'accent-secondary': '#00adee',
  'accent-warm':      '#EE9300',
};

for (const [name, hex] of Object.entries(expected)) {
  // CSS: look for --wrld-<name>: <hex>
  const cssRe = new RegExp(`--wrld-${name.replace(/-/g, '-')}\\s*:\\s*${hex.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&')}`, 'i');
  if (!cssRe.test(css)) errors.push(`CSS: missing --wrld-${name}: ${hex}`);

  // JSON
  let jsonVal = null;
  if (name.startsWith('mono-')) {
    jsonVal = json.color.mono[name.slice(5)]?.$value;
  } else if (name.startsWith('accent-')) {
    jsonVal = json.color.accent[name.slice(7)]?.$value;
  }
  if (!jsonVal || jsonVal.toLowerCase() !== hex.toLowerCase()) {
    errors.push(`JSON: missing or mismatched ${name} (got ${jsonVal})`);
  }

  // TS
  if (!ts.toLowerCase().includes(hex.toLowerCase())) {
    errors.push(`TS: ${hex} not found anywhere in tokens.ts`);
  }
}

if (errors.length) {
  console.error('Token validation FAILED:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('Tokens validated — all three sources agree on the canonical values.');
