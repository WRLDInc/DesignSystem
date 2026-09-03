#!/usr/bin/env node
/**
 * Assembles the publishable wrld.design site into ./dist.
 *
 * Why a build step at all, for a repo with no bundler?
 * ---------------------------------------------------
 * Every internal reference in this repo is *root-relative across
 * directories* — styleguide/index.html loads '../tokens/tokens.css',
 * ui_kits/wrld-tech/index.html loads '../../_ds_bundle.js'. So the deployed
 * tree has to mirror the repo's directory layout exactly; we cannot flatten
 * or re-root anything. What we DO need is to publish a deliberate subset:
 * the repo also carries working files (scraps/, uploads/, a 2.6MB one-file
 * export, lint config, build scripts) that have no business being served.
 *
 * Hence: an explicit ALLOWLIST, copied structure-preserving into dist/,
 * with a web-root overlay from deploy/ and a hard verification gate that
 * fails the build if any referenced asset didn't make it.
 *
 * Zero dependencies, Node built-ins only — so Workers Builds needs no
 * `npm install` step and the repo needs no lockfile.
 *
 * Run: node scripts/build_site.mjs
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(REPO, 'dist');
const OVERLAY = join(REPO, 'deploy');

/**
 * What ships. Anything not listed here is NOT published.
 *
 * Deliberately excluded, with reasons:
 *   scraps/, uploads/        working files, screenshots, raw font drops
 *   WRLD Design System.html  2.6MB single-file export; duplicates
 *                            /styleguide/ and has spaces in the filename
 *   _adherence.oxlintrc.json lint config, not design content
 *   scripts/, package.json   build tooling
 *   .github/                 CI config
 *   styleguide/index-bundle-prep.html  intermediate working copy of index.html
 */
const PUBLISH = [
  // Public CSS entry points. Consumers link styles.css and get everything.
  'styles.css',
  'colors_and_type.css',

  // Canonical token suite (css + json + ts).
  'tokens',

  // Brand assets. Both trees are referenced: styleguide/preview use
  // ../assets/logos/*, ui_kits use ../../assets/logos/favicons/*, and the
  // deploy landing page + site.webmanifest consume root logos/favicons/*.
  'assets',
  'logos',

  // Self-hosted typefaces. colors_and_type.css @font-face points at
  // ./fonts/* relative to the repo root, so this path is load-bearing.
  'fonts',

  // Interactive reference surfaces.
  'styleguide',
  'preview',
  'ui_kits',

  // Component bundle consumed by the ui_kit index pages, plus its manifest.
  '_ds_bundle.js',
  '_ds_manifest.json',

  // The 21st.dev registry: the shadcn-compatible theme (linkable at
  // /registry/theme/wrld.css), the manifest of published components, and the
  // self-contained TSX sources with their demos. Published to be READ, like
  // the .jsx kits above; deploy/_headers labels .tsx as text/plain.
  'registry',

  // Written brand guidance. Already public on GitHub; part of the system.
  'brand',
  'docs',
  'README.md',
  'LICENSE',
];

/** Paths inside a published directory that must be skipped. */
const EXCLUDE = new Set([
  join('styleguide', 'index-bundle-prep.html'),
  // Typecheck config and local render output are tooling, not design content.
  join('registry', 'tsconfig.json'),
  join('registry', '.renders'),
]);

const log = (...a) => console.log(...a);
const rel = (p) => relative(REPO, p).split(sep).join('/');

/** Every file under a directory, recursively. */
const walkSync = (dir) => {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walkSync(p));
    else out.push(p);
  }
  return out;
};

// ---------------------------------------------------------------------------
// 1. Clean
// ---------------------------------------------------------------------------
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// ---------------------------------------------------------------------------
// 2. Copy the allowlist, preserving structure
// ---------------------------------------------------------------------------
let copiedFiles = 0;
let copiedBytes = 0;
const missingFromAllowlist = [];

for (const entry of PUBLISH) {
  const src = join(REPO, entry);
  if (!existsSync(src)) {
    missingFromAllowlist.push(entry);
    continue;
  }
  cpSync(src, join(DIST, entry), {
    recursive: true,
    filter: (from) => {
      const r = relative(REPO, from);
      return !EXCLUDE.has(r);
    },
  });
}

if (missingFromAllowlist.length) {
  console.error('\nBuild failed — allowlisted paths do not exist in the repo:');
  for (const m of missingFromAllowlist) console.error(`  - ${m}`);
  console.error('\nFix scripts/build_site.mjs PUBLISH, or restore the files.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 3. Overlay the web root (landing page, 404, _headers, _redirects, robots)
// ---------------------------------------------------------------------------
if (!existsSync(OVERLAY)) {
  console.error(`Build failed — missing web-root overlay directory: ${rel(OVERLAY)}`);
  process.exit(1);
}
cpSync(OVERLAY, DIST, { recursive: true });

// ---------------------------------------------------------------------------
// 3b. Generate the parts of the landing page that must not be hand-maintained:
//     the preview index (so a new preview card is never silently unlisted)
//     and the version stamp.
// ---------------------------------------------------------------------------
const SITE_ORIGIN = 'https://wrld.design';
const indexPath = join(DIST, 'index.html');

const previewPages = readdirSync(join(DIST, 'preview'))
  .filter((f) => f.endsWith('.html'))
  .sort();

// Link the CANONICAL form, not the filename. Under
// html_handling: "auto-trailing-slash", /preview/foo.html 307-redirects to
// /preview/foo — so linking the .html costs every visitor a redirect hop.
const titleCaseless = (slug) => slug.replace(/-/g, ' ');
const previewList = previewPages
  .map((f) => {
    const slug = f.replace(/\.html$/, '');
    return `<li><a href="preview/${slug}">${titleCaseless(slug)}</a></li>`;
  })
  .join('\n        ');

const pkgVersion = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')).version;

let indexHtml = readFileSync(indexPath, 'utf8');
if (!indexHtml.includes('<!--PREVIEW_LIST-->')) {
  console.error('Build failed — deploy/index.html no longer contains the <!--PREVIEW_LIST--> marker.');
  process.exit(1);
}
indexHtml = indexHtml
  .replace('<!--PREVIEW_LIST-->', previewList)
  .replace(/(<span data-version>)[^<]*(<\/span>)/, `$1${pkgVersion}$2`);
writeFileSync(indexPath, indexHtml);

// ---------------------------------------------------------------------------
// 3c. Sitemap — robots.txt advertises it, so it has to exist.
// ---------------------------------------------------------------------------
// Emit the canonical URL for each page — the form that returns 200 rather
// than a 307. Under auto-trailing-slash that means: root is '/', a directory
// index keeps its trailing slash, and any other page drops '.html'.
// A sitemap full of redirecting URLs is a self-inflicted SEO problem.
const htmlPages = walkSync(DIST)
  .filter((f) => f.endsWith('.html'))
  .map((f) => relative(DIST, f).split(sep).join('/'))
  // 404 is noindex.
  .filter((p) => p !== '404.html')
  .map((p) => {
    if (p === 'index.html') return '';
    if (p.endsWith('/index.html')) return p.replace(/index\.html$/, '');
    return p.replace(/\.html$/, '');
  })
  .sort();

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...htmlPages.map((p) => `  <url><loc>${SITE_ORIGIN}/${p}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

// ---------------------------------------------------------------------------
// 4. Verify: every local reference in the shipped tree must resolve
//    *inside dist*. This is the gate that makes the allowlist safe to edit.
// ---------------------------------------------------------------------------
const SCAN_EXT = ['.html', '.css', '.js', '.jsx', '.ts', '.json', '.webmanifest'];
const REF_RE =
  /(?:href|src)\s*=\s*["']([^"']+)["']|url\(\s*['"]?([^'")]+)['"]?\s*\)|@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/gi;

/** Refs we intentionally do not resolve locally. */
const isExternal = (u) =>
  /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(u) || u.startsWith('#') || u.startsWith('{{');

const isFile = (p) => existsSync(p) && statSync(p).isFile();

/**
 * Resolve a path the way Cloudflare's asset layer actually does under
 * html_handling: "auto-trailing-slash", and return the file that would be
 * served (or null).
 *
 * This is the difference between "the path exists on disk" and "the URL
 * returns 200", and the two are NOT the same:
 *
 *   - A bare directory with no index.html 404s. Cloudflare does no
 *     directory listing, so linking /fonts/ is a broken link even though
 *     dist/fonts/ exists. Checking existsSync() alone would pass it.
 *   - Extensionless URLs work: /preview/colors-mono serves
 *     preview/colors-mono.html.
 *   - Directory URLs work when an index exists: /styleguide/ serves
 *     styleguide/index.html.
 */
const resolveAsCloudflareWould = (p) => {
  const bare = p.replace(/[/\\]+$/, '');
  if (isFile(bare)) return bare;
  if (isFile(`${bare}.html`)) return `${bare}.html`;
  if (isFile(join(bare, 'index.html'))) return join(bare, 'index.html');
  return null;
};

const allFiles = walkSync(DIST);
copiedFiles = allFiles.length;
copiedBytes = allFiles.reduce((n, f) => n + statSync(f).size, 0);

const broken = [];
const externalHosts = new Set();
let resolvedRefs = 0;

for (const file of allFiles) {
  if (!SCAN_EXT.some((x) => file.endsWith(x))) continue;
  // The one-file exports embed JS that trips the naive url() regex; we do not
  // ship them, but guard anyway against very large files.
  if (statSync(file).size > 3_000_000) continue;

  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(REF_RE)) {
    const raw = (m[1] ?? m[2] ?? m[3] ?? '').trim();
    if (!raw) continue;
    if (isExternal(raw)) {
      const host = raw.match(/^(?:https?:)?\/\/([^/]+)/i)?.[1];
      if (host) externalHosts.add(host);
      continue;
    }
    // Strip query/hash, decode, ignore template holes.
    const target = decodeURIComponent(raw.split('#')[0].split('?')[0]);
    if (!target || target.includes('{{')) continue;

    const base = target.startsWith('/') ? DIST : dirname(file);
    const resolvedPath = normalize(
      join(base, target.startsWith('/') ? target.slice(1) : target)
    );

    // Never allow a reference to escape dist/.
    if (!resolvedPath.startsWith(DIST)) {
      broken.push({ file, raw, reason: 'escapes dist/' });
      continue;
    }
    const hit = resolveAsCloudflareWould(resolvedPath);
    if (hit) resolvedRefs++;
    else {
      broken.push({
        file,
        raw,
        reason: `no file serves ${relative(DIST, resolvedPath) || '/'}`,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Report
// ---------------------------------------------------------------------------
const mb = (b) => (b / 1024 / 1024).toFixed(2);
log('');
log('wrld.design build');
log('─'.repeat(58));
log(`  output          dist/`);
log(`  files           ${copiedFiles}`);
log(`  total size      ${mb(copiedBytes)} MB`);
log(`  local refs OK   ${resolvedRefs}`);
log(`  external hosts  ${[...externalHosts].sort().join(', ') || 'none'}`);

// Cloudflare static-asset limits: 20,000 files, 25 MiB per file.
const LIMIT_FILES = 20000;
const LIMIT_FILE_BYTES = 25 * 1024 * 1024;
const oversized = allFiles.filter((f) => statSync(f).size > LIMIT_FILE_BYTES);
const limitErrors = [];
if (copiedFiles > LIMIT_FILES) {
  limitErrors.push(`${copiedFiles} files exceeds the Cloudflare limit of ${LIMIT_FILES}`);
}
for (const f of oversized) {
  limitErrors.push(`${relative(DIST, f)} is ${mb(statSync(f).size)} MB — over the 25 MiB per-file limit`);
}

if (broken.length) {
  console.error(`\nBuild failed — ${broken.length} unresolved local reference(s) in dist/:`);
  for (const b of broken.slice(0, 40)) {
    console.error(`  [${relative(DIST, b.file)}] '${b.raw}' → ${b.reason}`);
  }
  if (broken.length > 40) console.error(`  … and ${broken.length - 40} more`);
  console.error('\nA published file references something the allowlist did not copy.');
  console.error('Add the missing path to PUBLISH in scripts/build_site.mjs.');
  process.exit(1);
}

if (limitErrors.length) {
  console.error('\nBuild failed — Cloudflare static-asset limits exceeded:');
  for (const e of limitErrors) console.error(`  - ${e}`);
  process.exit(1);
}

log('─'.repeat(58));
log('  ok — every reference in dist/ resolves');
log('');
