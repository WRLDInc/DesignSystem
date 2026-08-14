# Deploying the design system to wrld.design

How `WRLDInc/DesignSystem` becomes <https://wrld.design> — on Cloudflare
Workers with Static Assets, built and deployed by **Workers Builds** (the
Git integration) straight from this repository.

Everything in this document has been validated against the live WRLD Inc.
Cloudflare account and a local `wrangler deploy --dry-run`. Where something
could not be verified without an actual deploy, it is called out as a
verification step rather than stated as fact.

---

## 1. What ships, and why it is built rather than served raw

| | |
|---|---|
| **Cloudflare account** | WRLD Inc. — `1260edafa2dec8e0bdf243859e07c160` |
| **Zone** | `wrld.design` — `f0b528554e11028ff7446781b7737da8`, active |
| **Worker name** | `wrld-design-system` |
| **Config** | [`wrangler.jsonc`](../wrangler.jsonc) at the repo root |
| **Build** | `npm run build` → [`scripts/build_site.mjs`](../scripts/build_site.mjs) → `dist/` |
| **Served directory** | `dist/` (204 files, 4.7 MB) |
| **Worker script** | none — assets-only, so no billable requests |

### Why there is a build step at all

Every internal reference in this repo is root-relative *across* directories:
`styleguide/index.html` loads `../tokens/tokens.css`, `ui_kits/wrld-tech/index.html`
loads `../../_ds_bundle.js`, and the `@font-face` rules in `colors_and_type.css`
point at `./fonts/`. So the published tree has to mirror the repo's layout
exactly — nothing can be flattened or re-rooted.

That makes "just point Cloudflare at the repo root" look tempting. It is the
wrong call, for one decisive reason:

> **Workers does not exclude `.git`.** Cloudflare Pages used to do this
> automatically; Workers static assets explicitly does not. Workers Builds
> clones the repo, so a root deploy would publish the entire git history at
> `https://wrld.design/.git/` — every branch, every commit, and anything ever
> committed and later removed.

A root deploy would also serve `wrangler.jsonc`, `.github/` workflows, the
lint config, `scripts/`, `uploads/` (2.8 MB of screenshots and raw font
drops), `scraps/`, and a 2.6 MB duplicate single-file export.

`scripts/build_site.mjs` solves this structurally instead of with a
denylist: it copies an **explicit allowlist** into `dist/`, preserving
directory structure, then overlays the web root from `deploy/`. Anything not
named in `PUBLISH` cannot leak, because it is never copied.

The script has zero dependencies — Node built-ins only — so the build needs
no `npm install` of its own, and it **fails the build** if any published
file references an asset the allowlist did not copy.

### Options considered

| Approach | Pros | Cons |
|---|---|---|
| **Assets-only Worker + built `dist/` (chosen)** | No `.git`/config exposure by construction; no billable Worker invocations; explicit control of what is public; build-time verification gate | Needs a build command; static CORS only (`*`, not a per-origin allowlist) |
| Assets-only Worker, `directory: "."` + `.assetsignore` | No build step | One forgotten line in `.assetsignore` publishes git history; `directory: "."` isn't a documented value; ships working files by default |
| Worker with a script entrypoint (`main`) | Per-origin CORS, redirects, and header logic in code | Every request becomes billable; more moving parts than a static reference site needs |

The middle option is what most guides suggest. It puts a security-relevant
detail behind a line of config that a future contributor can quietly break.
The chosen option cannot fail that way.

---

## 2. Cloudflare dashboard — exact build configuration

> **Do this in order.** Commit and push `wrangler.jsonc` *before* connecting
> the repository. Connecting a repo with no Wrangler config triggers
> Cloudflare's autoconfig, which tries to detect a framework and opens a
> pull request against the repo guessing at build settings. For a
> hand-authored static repo it will guess wrong.

**Create:** Workers & Pages → **Create application** → **Get started** next
to *Import a repository* → select the Git account → select the repository.

**Later edits:** Workers & Pages → `wrld-design-system` → **Settings** →
**Build**. (Cloudflare's own docs label this tab both "Build" and "Builds"
in different places; it is the same screen.)

### Build settings

| Dashboard field | Value to enter | Notes |
|---|---|---|
| **Git account** | `WRLDInc` | Authorizes the *Cloudflare Workers and Pages* GitHub App |
| **Git repository** | `WRLDInc/DesignSystem` | |
| **Production branch** | `main` | |
| **Build command** | `npm run build` | Runs `node scripts/build_site.mjs`, producing `dist/` |
| **Deploy command** | `npx wrangler deploy` | Uses the version pinned in `package.json` |
| **Root directory** | *leave empty* | `wrangler.jsonc` is at the repo root |
| **API token** | *leave the auto-generated build token* | See the warning below — do **not** add your own |
| **Build watch paths — include** | `*` | Default; every path in the repo can affect the site |
| **Build watch paths — exclude** | *leave empty* | |
| **Build caching** | Enable | Optional; safe here |

### Build variables

Settings → Build → **Build Variables and Secrets**. Only one is worth setting:

| Variable | Value | Why |
|---|---|---|
| `NODE_VERSION` | `22` | Optional but recommended. Cloudflare's current default is 24.18.0; pinning 22 matches the `wrld.tech` pipeline and stops a future default bump from changing this build under you. The build itself only uses Node built-ins and works on 18+. |

**No other variables or secrets are required.** The build reads nothing from
the environment.

> **Do not set `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID` as build
> variables.** Workers Builds injects and manages its own build credential.
> A hand-set token would shadow it, and `account_id` is deliberately absent
> from `wrangler.jsonc` — this login can see three Cloudflare accounts
> (AffordaCare, WRLD AI, WRLD Inc.), and a wrong value there produces an
> opaque `code: 7003` routing error.

### Non-production branches

Leave **Builds for non-production branches** unchecked for now — the design
system has one canonical published state. If you later want per-branch
review builds, check it and set the non-production deploy command to
`npx wrangler versions upload` (which uploads a version *without* shifting
production traffic), not `wrangler deploy`.

### Build variables are per-trigger

Build variables are stored separately for the production and preview
triggers, and they are build-time only — they are a different store from the
Worker's runtime **Variables and Secrets**. Setting a value in the wrong
panel fails silently at the other end.

---

## 3. The domain

`wrld.design` is registered at Namecheap (registered 2024-12-18, expires
2026-12-18, `clientTransferProhibited`), and is now **active** on Cloudflare
in the WRLD Inc. account. Nameservers have already propagated at the
registry to `ali.ns.cloudflare.com` / `bart.ns.cloudflare.com` — the same
pair as `wrld.tech` and `wrld.host`.

This matters because Workers, unlike Pages, **cannot serve a custom domain
whose nameservers are not managed by Cloudflare**. That prerequisite is met.

### What the deploy does by itself

`wrangler.jsonc` declares:

```jsonc
"routes": [{ "pattern": "wrld.design", "custom_domain": true }]
```

On deploy, Cloudflare creates the proxied DNS record for the apex and issues
the certificate automatically. There is no DNS record to add by hand.

> **`routes` in this file overwrite the dashboard on every deploy.** This
> file owns the domain binding — do not also manage it in the UI, or the next
> deploy will silently revert your change.

### Existing DNS is safe

The zone currently holds six records, all email: five Namecheap
forwarding `MX` records and the matching SPF `TXT`. There is **no A, AAAA,
or CNAME at the apex and no `www` record**, so attaching the custom domain
collides with nothing. `MX` and the apex address record coexist fine —
email forwarding keeps working untouched.

### www

A Custom Domain matches **only** the exact hostname — `wrld.design` does not
cover `www.wrld.design` or any subdomain, and Custom Domains do not support
wildcard DNS. So `www` needs handling of its own.

`www.wrld.design` is deliberately *not* a second Custom Domain — serving the
same tree on two hostnames is duplicate content. Redirect it instead, which
takes **two** steps. Both are required:

**1. A proxied placeholder DNS record**, so `www` traffic reaches
Cloudflare's edge at all. Without this the redirect rule never fires,
because nothing routes there.

| Type | Name | Content | Proxy status |
|---|---|---|---|
| `A` | `www` | `192.0.2.0` | **Proxied** |

`192.0.2.0` is a reserved documentation address that is never contacted —
the request is answered at the edge by the rule below. (`AAAA www 100::`
works equally well.)

**2. A Redirect Rule** — Zone → Rules → Overview → Create rule → Redirect Rule:

- **When incoming requests match:** Custom filter expression →
  `http.host eq "www.wrld.design"`
- **Then:** Dynamic redirect → Target URL `concat("https://wrld.design", http.request.uri.path)`
- **Status:** 301, **Preserve query string** enabled

Pin the hostname with the filter expression rather than using Cloudflare's
zone-wide `https://www.*` wildcard example. That example matches every
`www.*` host in the zone, and — per Cloudflare's own table — being
HTTPS-only it leaves `http://www.wrld.design/` untouched.

This cannot be done in `_redirects`, which matches on path, not hostname.

### Canonical URL forms

`html_handling` is `auto-trailing-slash`, so each page has exactly one URL
that returns `200`; the others `307` to it. These were verified against a
local `wrangler dev` run, not inferred:

| Kind | Canonical | Also accepted (307s to canonical) |
|---|---|---|
| Root | `/` | `/index.html` |
| Directory index | `/styleguide/`, `/ui_kits/wrld-tech/` | `/styleguide`, `/styleguide/index.html` |
| Any other page | `/preview/colors-mono` | `/preview/colors-mono.html`, `/preview/colors-mono/` |
| Assets | `/tokens/tokens.css` | — (exact only) |

Publish and link the canonical forms. The generated landing page and
`sitemap.xml` already do — `scripts/build_site.mjs` emits extensionless
preview links and a redirect-free sitemap deliberately.

**There is no directory listing.** `/fonts/`, `/tokens/`, and
`/assets/logos/svg/` all return `404` — only files are served. Link a
specific file, never a directory.

---

## 4. Verify after the first deploy

The build and config are validated locally; these are the checks that need a
real deploy behind them.

```bash
# 1. The site answers, and directory URLs resolve to their index.
curl -sI https://wrld.design/            | head -1
curl -sI https://wrld.design/styleguide/ | head -1     # expect 200, not 404

# 2. CORS is present on the files other WRLD sites load cross-origin.
curl -sI https://wrld.design/styles.css        | grep -i access-control
curl -sI https://wrld.design/tokens/tokens.css | grep -i access-control

# 3. Config files are consumed, NOT served. Both must 404.
curl -so /dev/null -w '%{http_code}\n' https://wrld.design/_headers
curl -so /dev/null -w '%{http_code}\n' https://wrld.design/.git/config

# 4. Content-Type on the extensions Cloudflare does not document.
#    /tokens/tokens.ts must be text/plain, NOT video/mp2t — see below.
curl -sI https://wrld.design/fonts/Ubuntu-Regular.ttf    | grep -i content-type
curl -sI https://wrld.design/tokens/tokens.ts            | grep -i content-type
curl -sI https://wrld.design/styleguide/tweaks-panel.jsx | grep -i content-type

# 5. Cache headers landed as intended.
curl -sI https://wrld.design/fonts/Ubuntu-Regular.ttf | grep -i cache-control
curl -sI https://wrld.design/tokens/tokens.css        | grep -i cache-control

# 6. The custom 404 renders.
curl -s https://wrld.design/no-such-page | grep -o "<title>.*</title>"
```

Check 3 is the important one. If `/_headers` returns 200, the file is being
served as content instead of consumed as configuration, and none of the CORS
or cache rules are in effect.

All six checks were run against a local `wrangler dev` serving this exact
`dist/`, and all passed. Add one more check for the first *non-production*
build, which cannot be verified locally:

```bash
# 7. Preview URLs must be noindex'd — they are duplicate content otherwise.
curl -sI https://<version>-wrld-design-system.<subdomain>.workers.dev/ | grep -i x-robots-tag
```

If that returns nothing, the placeholder-hostname rule in `_headers` isn't
firing; the fallback is setting `preview_urls` to `false` in
`wrangler.jsonc` and giving up per-branch review URLs.

### Five things that were wrong until they were tested

Every one of these passed a reading of the docs and failed a real request.
They are recorded because each is a trap the next person will hit.

1. **`_headers` has no specificity precedence — colliding values are
   comma-joined, not replaced.** Every matching rule applies. An earlier
   revision set `Cache-Control` in both `/tokens/*` and `/*.ts`, and
   `tokens/tokens.ts` matches both, so it was served with
   `Cache-Control: public, max-age=3600, stale-while-revalidate=86400, public, max-age=3600, stale-while-revalidate=86400`
   — a malformed header on a URL other WRLD sites treat as a contract. The
   file now keeps every `Cache-Control` rule on a disjoint path set, and
   where rules overlap on path they set disjoint header *names*. Use
   `! Header-Name` (bang plus a mandatory space) to unset before re-setting.
2. **Header rules apply to 404 responses too.** A `/fonts/*` rule with
   `immutable` meant `GET /fonts/DoesNotExist-Bold.ttf` returned 404 with
   `Cache-Control: public, max-age=31536000, immutable` — a client that ever
   requested a wrong font path would cache that failure for a year and never
   revalidate, so adding the file later would not fix it for them. Fonts are
   now listed by exact filename.
3. **`.ts` is served as `video/mp2t`** — the correct IANA meaning of the
   extension, and useless for TypeScript. `tokens/tokens.ts` is a published
   entry point, so a browser offered it as a video download, and with
   `nosniff` a module import would be blocked. Overridden to `text/plain`,
   along with `.jsx`, `.md`, and the extensionless `LICENSE` (which had no
   `Content-Type` at all).
4. **`OPTIONS` returns 405.** The asset layer allows only GET and HEAD, so a
   CORS preflight can never succeed and `Access-Control-Allow-Methods` /
   `Access-Control-Max-Age` were fiction. Removed. Every real consumer
   request here is a simple request that never preflights.
5. **Directory URLs 404.** There is no directory listing, so `/fonts/` and
   `/tokens/` return 404 even though the directories exist. The build's
   reference check models this, so a directory link now fails the build
   instead of shipping as a dead link.

A sweep of all 203 shipped files confirms no response carries a doubled
header. Worth re-running after any `_headers` edit.

Also confirm the `workers_dev: false` + `preview_urls: true` pairing behaves:
Cloudflare defaults preview URLs to follow `workers_dev`, so this
combination is set explicitly rather than relied on. If preview URLs don't
appear on a non-production build, that pairing is why.

---

## 5. Runbook notes

- **Worker name is load-bearing.** `name` in `wrangler.jsonc` must equal the
  dashboard Worker name; `wrangler deploy` resolves its target from it.
- **The build credential is user-scoped.** Workers Builds currently supports
  only user-owned API tokens, so the build is tied to the individual who
  authorized it. If that person's Cloudflare tokens are rolled or their
  account is removed, builds fail with an opaque *"build token … has been
  deleted or rolled"* error. Account-owned tokens are "coming soon".
- **The GitHub App is shared with Pages.** Uninstalling it to fix a Workers
  issue revokes access for every connected Pages project on that GitHub
  account too.
- **Changing repository is not an edit.** To point this Worker at a
  different repo you must disable builds, then reconnect.
- **A `[build]` block in `wrangler.jsonc` is ignored** by Workers Builds.
  Only the dashboard Build command runs.
- **Watch paths are bypassed** when a push has zero file changes, or 3,000+
  changed files, or 20+ commits — a large refactor builds regardless.
- **Limits:** 20-minute build ceiling; 20,000 files and 25 MiB per file on
  Free. This site is at 204 files and a 688 KB largest file, so there is
  plenty of room. `scripts/build_site.mjs` fails the build if either limit is
  ever crossed.
- **Never point a second Worker at `wrld.design`.** Interactively, wrangler
  prompts before taking a Custom Domain from another Worker. In CI it does
  not: the deploy path sets `override_existing_origin` and
  `override_existing_dns_record` when stdout is not a TTY, and Workers Builds
  is never a TTY. A second Worker declaring this domain would silently steal
  it and overwrite conflicting DNS.
- **A failed route is not a failed upload.** Wrangler uploads the script
  *before* attaching triggers. If the domain binding fails, you get a live
  but unrouted Worker and a red build ending in *"Successful trigger changes
  were not rolled back."* Fix the cause and re-run the build; no code change
  is needed.
- **Deleting a Custom Domain leaves its certificate behind.** The associated
  Advanced Certificate is not cleaned up automatically — remove it under
  SSL/TLS → Edge Certificates, or it lingers as an audit surprise.
- **`preview_urls` default is Wrangler-version-dependent** (it only follows
  `workers_dev` from v4.44.0+, and earlier versions differ in both
  directions). It is set explicitly in `wrangler.jsonc` for that reason —
  leave it explicit.
- **An apex `CNAME` would block the Custom Domain.** There is none today
  (the zone holds only `MX` and `TXT`), but if a DNS scan ever imports one,
  delete it before deploying.

---

## 6. Deliberate follow-ups

These are known and intentional, not oversights — but they should not stay
open forever.

1. **The styleguide still loads Google Fonts, and the UI kits load React,
   Babel, and Lucide from `unpkg.com`.** This contradicts both `SKILL.md`
   ("Reference these directly; do not pull from Google Fonts") and the
   `wrld.tech` build plan §1.4 ("Fonts are self-hosted … no external font
   CDN calls"). The typefaces are already self-hosted in `fonts/` and served
   from this origin, so the Google Fonts links are redundant as well as
   off-standard. Fixing this is a content change with real visual risk
   (font-weight mapping), so it is deliberately **not** bundled into this
   deployment change. It is also the prerequisite for a Content-Security-Policy
   that means anything — see the note in `deploy/_headers`.

2. **`wrld.design` is the *design services* property, per
   `brand/wrld-design.md`** — case studies, process, pricing — which is a
   different thing from the design system this Worker serves. Putting the
   system at the apex leaves the services site without its natural home.
   Worth deciding before this becomes load-bearing in links:
   - system at `ds.wrld.design`, apex reserved for services — cleanest split;
   - system at `wrld.design/system`, needs path-based routing;
   - system at the apex (current), services elsewhere.

   Switching is a one-line `pattern` change in `wrangler.jsonc` plus the
   matching custom domain — cheap now, expensive once other sites hardcode
   token URLs.

3. **Immutable font caching is a versioning commitment.** `/fonts/*` is
   served `max-age=31536000, immutable`, so a revised typeface must ship
   under a *new filename* — overwriting one leaves the old bytes in browser
   caches for a year.

4. **CORS is `*` and cannot be narrowed** while this stays an assets-only
   Worker. `_headers` supports only `*`, `null`, or one exact literal origin.
   Per-origin allow-listing would mean adding a script entrypoint and
   accepting billable requests.
