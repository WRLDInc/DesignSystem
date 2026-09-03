#!/usr/bin/env node
/**
 * Publish the WRLD design system registry to 21st.dev.
 *
 * Everything is driven by registry/manifest.json so a publish, an update and a
 * local render all use the same names, slugs, descriptions, tags, library and
 * stable component refs. The script writes those refs back into the manifest
 * after a successful publish; commit that change so the next publish revises
 * the existing component instead of colliding on the slug.
 *
 *   npm run registry:render                       build + screenshot every component locally; publishes nothing
 *   npm run registry:publish                      create reviewed drafts and print the Studio review URLs
 *   npm run registry:publish -- --auto            headless: wait for the generated cover, publish, record refs
 *   npm run registry:publish -- --only wrld-button,wrld-lockup
 *   npm run registry:publish:theme -- --yes-public   publish registry/theme/wrld.css (a PUBLIC community theme)
 *
 * Flags
 *   --only <a,b>        limit to these manifest slugs
 *   --visibility <v>    override the manifest visibility (published | private)
 *   --to <slug>         override the target library slug
 *   --auto              publish without a Studio round-trip (waits for the generated cover)
 *   --render            build + screenshot into registry/.renders/<slug>/ instead of publishing
 *   --theme             publish the theme instead of components; requires --yes-public
 *   --dry-run           print the CLI commands and change nothing
 *   --timeout <s>       give up on one component after this many seconds (default 900).
 *                       The CLI gets SIGINT so it deletes its temporary draft first.
 *   --no-covers         do not stage registry/.renders/<slug>/default.png as the cover.
 *                       By default a publish stages that verified render (from
 *                       `npm run registry:render`) with --preview, so 21st does not
 *                       have to regenerate a cover — one of its render hosts sometimes
 *                       returns a generic "Component Example" scaffold instead.
 *
 * Auth: the 21st CLI reads API_KEY_21ST or TWENTYFIRST_TOKEN from the environment,
 * or a saved `21st login` session. A TEAM API key is required for team libraries.
 * This script never reads, prints or stores the key.
 *
 * Exit codes mirror the CLI: 0 published · 2 draft handed off to Studio · 3 auth ·
 * 4 rate limited · 5 build failed · 6 cover not ready · 7 conflict. The script
 * exits 1 if any component fails, 2 if the only outcome was a Studio handoff.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = join(REPO, 'registry', 'manifest.json');
const RENDERS = join(REPO, 'registry', '.renders');
const REGISTRIES = new Set(['ui', 'hooks', 'blocks', 'icons']);
const VISIBILITIES = new Set(['published', 'private']);

const EXIT_MEANING = {
  0: 'published',
  1: 'failed',
  2: 'draft handed off — finish in Studio (CLI Review)',
  3: 'not authenticated — set API_KEY_21ST (a team key for team libraries) or run `npx 21st login`',
  4: 'rate limited — wait, then re-run with --only for the remaining slugs',
  5: 'build failed — fix the component, confirm with `npm run registry:render`',
  6: 'cover not ready — re-run, or stage one with `--preview` in Studio',
  7: 'conflict — the slug exists or a revision is pending; record its component:<id> in the manifest',
  124: 'timed out waiting on 21st — re-run later with --only for this slug',
  130: 'interrupted',
};

const fail = (msg) => {
  console.error(`\npublish_21st: ${msg}`);
  process.exit(1);
};

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flags = { only: null, visibility: null, to: null, auto: false, render: false, theme: false, dryRun: false, yesPublic: false, timeout: 900, covers: true };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const value = (inline) => {
    if (inline != null) return inline;
    const v = argv[++i];
    if (v == null || v.startsWith('--')) fail(`${a} needs a value`);
    return v;
  };
  const [name, inline] = a.includes('=') ? [a.slice(0, a.indexOf('=')), a.slice(a.indexOf('=') + 1)] : [a, null];
  switch (name) {
    case '--auto': flags.auto = true; break;
    case '--render': flags.render = true; break;
    case '--theme': flags.theme = true; break;
    case '--dry-run': flags.dryRun = true; break;
    case '--yes-public': flags.yesPublic = true; break;
    case '--no-covers': flags.covers = false; break;
    case '--only': flags.only = value(inline).split(',').map((s) => s.trim()).filter(Boolean); break;
    case '--visibility': flags.visibility = value(inline); break;
    case '--to': flags.to = value(inline); break;
    case '--timeout': flags.timeout = Number(value(inline)); break;
    case '--help': case '-h':
      console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*\n/, '').replace(/^ \* ?/gm, ''));
      process.exit(0);
    default: fail(`unknown flag ${a} (see --help)`);
  }
}
if (flags.visibility && !VISIBILITIES.has(flags.visibility)) fail(`--visibility must be published or private`);
if (!Number.isFinite(flags.timeout) || flags.timeout <= 0) fail('--timeout must be a positive number of seconds');
if (flags.render && flags.theme) fail('--render and --theme are exclusive');

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
const abs = (p) => resolve(REPO, p);
const rel = (p) => relative(REPO, p).split('\\').join('/');

const problems = [];
const slugs = new Set();
for (const c of manifest.components ?? []) {
  const where = `component "${c.slug ?? '?'}"`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug ?? '')) problems.push(`${where}: slug must be lowercase kebab-case`);
  if (slugs.has(c.slug)) problems.push(`${where}: duplicate slug`);
  slugs.add(c.slug);
  if (!c.name) problems.push(`${where}: missing name`);
  if (!c.description || c.description.length < 10) problems.push(`${where}: description must be at least 10 characters`);
  if (!REGISTRIES.has(c.registry)) problems.push(`${where}: registry must be one of ${[...REGISTRIES].join(', ')}`);
  if (!Array.isArray(c.tags) || c.tags.length < 1 || c.tags.length > 5) problems.push(`${where}: 1 to 5 tags`);
  if (!c.file || !existsSync(abs(c.file))) problems.push(`${where}: file not found: ${c.file}`);
  if (c.demo && !existsSync(abs(c.demo))) problems.push(`${where}: demo not found: ${c.demo}`);
  if (c.component != null && !Number.isInteger(c.component)) problems.push(`${where}: component must be the numeric id from component:<id>`);
}
if (!manifest.library) problems.push('manifest: missing "library" (the 21st library slug, e.g. wrld-tech)');
if (!VISIBILITIES.has(manifest.visibility)) problems.push('manifest: "visibility" must be published or private');
if (flags.theme) {
  if (!manifest.theme?.file || !existsSync(abs(manifest.theme.file))) problems.push(`theme: file not found: ${manifest.theme?.file}`);
  if (!manifest.theme?.name) problems.push('theme: missing name');
}
if (problems.length) {
  console.error('registry/manifest.json has problems:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

let selected = manifest.components;
if (flags.only) {
  const unknown = flags.only.filter((s) => !slugs.has(s));
  if (unknown.length) fail(`--only names slugs that are not in the manifest: ${unknown.join(', ')}`);
  selected = manifest.components.filter((c) => flags.only.includes(c.slug));
}

const saveManifest = () => writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

// ---------------------------------------------------------------------------
// The CLI: prefer the pinned devDependency, fall back to npx at that version.
// ---------------------------------------------------------------------------
const pkg = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8'));
const cliVersion = (pkg.devDependencies?.['@21st-dev/cli'] ?? 'latest').replace(/^[\^~]/, '');
const localBin = join(REPO, 'node_modules', '.bin', process.platform === 'win32' ? '21st.cmd' : '21st');
const cli = existsSync(localBin) ? [localBin] : ['npx', '--yes', `@21st-dev/cli@${cliVersion}`];

const hasKey = Boolean(process.env.TWENTYFIRST_TOKEN || process.env.API_KEY_21ST);
const hasLogin = existsSync(join(homedir(), '.config', '21st', 'auth.json'));
if (!hasKey && !hasLogin && !flags.dryRun) {
  console.error('No 21st credentials found: export API_KEY_21ST (team key) or run `npx 21st login`. Continuing — the CLI will report exit 3 if this is wrong.');
}

/**
 * Run the CLI. stdout is captured (the --json document); progress stays on
 * stderr. Resolves with { status, data, stdout }; never rejects.
 *
 * Stopping is two-stage: after --timeout seconds the CLI gets SIGINT, which
 * its own handler turns into "abort and delete the temporary draft". If it is
 * stuck in a request that ignores the abort (seen in the wild), SIGKILL follows
 * 30 seconds later so a batch never hangs on one component.
 */
const runCli = (args, { json = true, quiet = false } = {}) =>
  new Promise((done) => {
    const [cmd, ...pre] = cli;
    const full = [...pre, ...args, ...(json ? ['--json'] : [])];
    if (flags.dryRun) {
      console.log(`  $ ${[cmd === localBin ? '21st' : cmd, ...full].map((s) => (/\s/.test(s) ? JSON.stringify(s) : s)).join(' ')}`);
      done({ status: 0, data: null, stdout: '' });
      return;
    }
    const child = spawn(cmd, full, {
      cwd: REPO,
      stdio: ['inherit', 'pipe', 'inherit'],
      env: process.env,
      shell: process.platform === 'win32',
    });
    let stdout = '';
    let pending = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      // The CLI prints progress and rate-limit waits on stdout in render mode.
      // Surface every non-JSON line as it arrives so a wait is never silent.
      pending += chunk;
      const lines = pending.split('\n');
      pending = lines.pop() ?? '';
      if (quiet) return;
      for (const line of lines) {
        const t = line.trim();
        // Skip JSON structure lines; keep the CLI's human progress and wait notices.
        if (t && !/^[{}\[\]"]/.test(t) && !/^[},]$/.test(t)) console.error(`  · ${t}`);
      }
    });
    let timedOut = false;
    const soft = setTimeout(() => {
      timedOut = true;
      console.error(`  no result after ${flags.timeout}s — interrupting the CLI so it deletes its draft`);
      child.kill('SIGINT');
    }, flags.timeout * 1000);
    const hard = setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) {
        console.error('  the CLI did not exit on SIGINT — killing it (its temporary draft may linger; `npx 21st components --json` shows the allowance)');
        child.kill('SIGKILL');
      }
    }, flags.timeout * 1000 + 30_000);
    child.on('error', (err) => {
      clearTimeout(soft);
      clearTimeout(hard);
      fail(`could not run the 21st CLI: ${err.message}`);
    });
    child.on('close', (code) => {
      clearTimeout(soft);
      clearTimeout(hard);
      if (timedOut) {
        console.error(`  timed out after ${flags.timeout}s — re-run later with --only for this slug`);
        done({ status: 124, data: null, stdout });
        return;
      }
      let data = null;
      if (json && stdout.trim()) {
        try {
          data = JSON.parse(stdout.trim());
        } catch {
          const s0 = stdout.indexOf('{');
          const e0 = stdout.lastIndexOf('}');
          if (s0 >= 0 && e0 > s0) {
            try { data = JSON.parse(stdout.slice(s0, e0 + 1)); } catch { data = null; }
          }
        }
      }
      done({ status: code ?? 1, data, stdout });
    });
  });

const pick = (obj, ...keys) => {
  for (const k of keys) if (obj && obj[k] != null) return obj[k];
  return null;
};

/** Width × height of a PNG from its IHDR chunk, or null. */
const pngSize = (file) => {
  try {
    const fd = readFileSync(file);
    if (fd.length < 24 || fd.toString('latin1', 1, 4) !== 'PNG') return null;
    return { width: fd.readUInt32BE(16), height: fd.readUInt32BE(20) };
  } catch {
    return null;
  }
};
const coverFor = (slug) => join(RENDERS, slug, 'default.png');

/**
 * The team's draft allowance. Every render and every publish creates a draft
 * on 21st, and the allowance (20 at the time of writing) recovers over time.
 * A CLI run that sits silent for minutes is almost always waiting on it.
 */
const readAllowance = async () => {
  if (flags.dryRun) return null;
  const r = await runCli(['components'], { json: true, quiet: true });
  return r.data?.draftAllowance ?? null;
};

// ---------------------------------------------------------------------------
// Modes
// ---------------------------------------------------------------------------
const results = [];
const now = () => new Date().toISOString();

if (flags.theme) {
  const th = manifest.theme;
  if (!flags.yesPublic && !flags.dryRun) {
    fail(
      '21st themes are PUBLIC community themes (there is no private option) and every run creates a NEW theme rather than updating one.\n' +
        'Confirm with Ridgeway or Curtis, then re-run with --yes-public. To retag or rename an existing theme use `npx 21st edit <id> --type theme`.',
    );
  }
  console.log(`\nPublishing theme "${th.name}" from ${th.file} (public)`);
  const args = ['publish-theme', abs(th.file), '--name', th.name];
  if (th.tags?.length) args.push('--tags', th.tags.join(','));
  const r = await runCli(args, { json: false });
  if (r.stdout.trim()) console.log(r.stdout.trim());
  if (r.status === 0 && !flags.dryRun) {
    const url = r.stdout.match(/https?:\/\/21st\.dev\/\S+/)?.[0] ?? th.url ?? null;
    manifest.theme = { ...th, url, publishedAt: now() };
    saveManifest();
    console.log(`Recorded the theme URL in ${rel(MANIFEST_PATH)}. Find its id with: npx 21st search "${th.name}" --type theme --json`);
  }
  results.push({ slug: `theme:${th.name}`, status: r.status, url: manifest.theme.url });
} else {
  const to = flags.to ?? manifest.library;
  const visibility = flags.visibility ?? manifest.visibility;
  const mode = flags.render ? 'render' : flags.auto ? 'publish (headless, --auto)' : 'publish (Studio review)';
  console.log(`\n21st registry — ${mode} · library "${to}" · visibility ${visibility} · ${selected.length} component(s)`);
  const allowance = await readAllowance();
  if (allowance) {
    console.log(`draft allowance: ${allowance.remaining} of ${allowance.limit} remaining — each render or publish uses one`);
    if (allowance.remaining < selected.length) {
      console.log(`  only ${allowance.remaining} slot(s) for ${selected.length} component(s): the CLI will wait for the allowance to recover. Use --only to run what fits now.`);
    }
  }

  for (const entry of selected) {
    console.log(`\n▸ ${entry.name} (${entry.slug})${entry.component ? ` → revision of component:${entry.component}` : ''}`);
    if (flags.render) {
      const out = join(RENDERS, entry.slug);
      if (!flags.dryRun) mkdirSync(out, { recursive: true });
      const args = ['render', abs(entry.file), '--out', out];
      if (entry.demo) args.push('--demo', abs(entry.demo));
      const r = await runCli(args);
      const cover = pick(r.data, 'cover');
      if (r.status === 0) {
        const size = cover ? pngSize(cover) : null;
        const dims = size ? ` (${size.width}×${size.height})` : '';
        console.log(`  rendered → ${cover ? rel(cover) : rel(out)}${dims}`);
        console.log('  open the PNG: a generic "Component Example" counter means 21st\'s render host substituted its scaffold — re-run --only for this slug.');
      }
      results.push({ slug: entry.slug, status: r.status, url: cover ? rel(cover) : null });
      continue;
    }

    const args = [
      'publish', abs(entry.file),
      '--description', entry.description,
      '--name', entry.name,
      '--slug', entry.slug,
      '--tags', entry.tags.join(','),
      '--registry', entry.registry,
      '--to', to,
      '--visibility', visibility,
      '--no-open',
    ];
    if (entry.demo) args.push('--demo', abs(entry.demo));
    if (entry.component) args.push('--component', `component:${entry.component}`);
    if (flags.auto) args.push('--auto');
    if (flags.covers && existsSync(coverFor(entry.slug))) {
      // A cover you have looked at beats one 21st generates blind.
      args.push('--preview', coverFor(entry.slug));
      console.log(`  staging verified cover ${rel(coverFor(entry.slug))}`);
    } else if (flags.covers && !flags.dryRun) {
      console.log('  no local render for this slug — 21st will generate the cover (run `npm run registry:render -- --only ' + entry.slug + '` first to stage a verified one)');
    }

    const r = await runCli(args);
    const d = r.data ?? {};
    const url = pick(d, 'url', 'component_url', 'componentUrl');
    if (!flags.dryRun) {
      if (r.status === 0) {
        const id = pick(d, 'component_id', 'componentId');
        entry.component = Number.isInteger(id) ? id : Number.isInteger(Number(id)) && id != null ? Number(id) : entry.component;
        entry.url = url ?? entry.url ?? null;
        entry.installRef = pick(d, 'install_ref', 'installRef') ?? entry.installRef ?? null;
        entry.publishedAt = now();
        delete entry.draft;
        delete entry.draftUrl;
        console.log(`  published → ${entry.url ?? '(url not reported)'}${entry.installRef ? `  ·  install: ${entry.installRef}` : ''}`);
      } else if (r.status === 2) {
        entry.draft = pick(d, 'draft_id', 'draftId', 'draft') ?? entry.draft ?? null;
        entry.draftUrl = url ?? entry.draftUrl ?? null;
        console.log(`  draft handed off → ${entry.draftUrl ?? '(review url not reported)'}${entry.draft ? `  ·  resume: npx 21st open draft:${entry.draft}` : ''}`);
      } else {
        console.log(`  ${EXIT_MEANING[r.status] ?? `exit ${r.status}`}`);
      }
      saveManifest();
    }
    results.push({ slug: entry.slug, status: r.status, url: r.status === 0 ? entry.url : r.status === 2 ? entry.draftUrl : null });
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n' + '─'.repeat(72));
for (const r of results) {
  const meaning = flags.dryRun ? 'dry run' : flags.render ? (r.status === 0 ? 'rendered' : EXIT_MEANING[r.status] ?? `exit ${r.status}`) : EXIT_MEANING[r.status] ?? `exit ${r.status}`;
  console.log(`  ${r.slug.padEnd(28)} ${meaning}${r.url ? `  ${r.url}` : ''}`);
}
console.log('─'.repeat(72));
if (!flags.dryRun && !flags.render && results.some((r) => r.status === 0)) {
  console.log(`Stable refs were written to ${rel(MANIFEST_PATH)} — commit it.`);
}

const failed = results.filter((r) => r.status !== 0 && r.status !== 2);
const handedOff = results.filter((r) => r.status === 2);
process.exit(failed.length ? 1 : handedOff.length ? 2 : 0);
