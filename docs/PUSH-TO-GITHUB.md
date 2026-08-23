# Push to github.com/WRLDInc/DesignSystem

This repo has been initialized locally and is ready to push. Because the sandboxed environment in which these assets were generated doesn't have GitHub CLI or push credentials, the final push is a one-step operation you run locally.

## One-time setup

1. **Create the empty repo on GitHub.** Either:
   - Via browser: [github.com/new](https://github.com/new) → owner `WRLDInc`, name `DesignSystem`, visibility Private (recommended initially), **do NOT** initialize with README/LICENSE/.gitignore — this repo already has them.
   - Or via `gh` locally:
     ```bash
     gh repo create WRLDInc/DesignSystem --private --description "Canonical design system for WRLD Inc. and all WRLD brands."
     ```

## Push

From the workspace folder on your machine:

```bash
cd "WRLD Dev & Design/DesignSystem"

# Verify the local repo is clean and on main
git status
git log --oneline -n 5

# Add the remote (use SSH if you prefer)
git remote add origin git@github.com:WRLDInc/DesignSystem.git
# or: git remote add origin https://github.com/WRLDInc/DesignSystem.git

# Push the initial commit
git push -u origin main
```

## Recommended repo settings on GitHub

Once pushed:

- **Default branch:** `main`.
- **Branch protection on `main`:** require PR review (at minimum: Ridgeway approval on any file in `brand/`, `tokens/`, `assets/logos/`).
- **Visibility:** start Private. Flip to Public if and when the system becomes an external reference — e.g., hosted at `wrld.host/brand`.
- **Homepage URL:** `https://wrld.host/brand` (once the styleguide is deployed) or `https://baseline.is/brand/wrld` as an interim.
- **Topics:** `design-system`, `brand-guidelines`, `wrld`, `tokens`, `msp`.

## Deploying the styleguide

The `styleguide/index.html` is static — any of these work cleanly:

- **Quick (private):** serve over your VPC — `python3 -m http.server 4747 --directory styleguide` on a dev host and bind behind Tailscale / VPC-only.
- **GitHub Pages (public):** Settings → Pages → deploy from `/styleguide`.
- **Cloudflare Pages / Netlify:** connect the repo, output dir `styleguide`.
- **wrld.host/brand (canonical):** drop the repo into your cPanel document root for that subpath.

Recommendation: **dev-host behind VPC first**, promote to a public `wrld.host/brand` URL once content is reviewed and you're ready for partners to see it.

## After the first push

- Tag `v0.1.0` — `git tag v0.1.0 && git push --tags`.
- Open a draft PR with any day-one follow-ups (e.g., "resolve wrld.one scope", "reconcile with Baseline.is").
- Add the link to `brand/CLAUDE.md` from `baseline.is/brand/wrld` as the cross-reference in the open-questions section.
