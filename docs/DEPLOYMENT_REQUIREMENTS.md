# Requirements for WRLD deployments

What every public WRLD site must ship with, and the log of where each site
stands against it. A new deployment meets every requirement below before its
domain goes live, and gets a row in the [baseline log](#deployment-baseline-log)
in the same PR.

"Public WRLD site" means a WRLD-owned site that customers browse or fill forms
on: marketing pages, product landings, the help center, the status board, the
directory. It does not mean authenticated apps and portals, client sites, or
pages WRLD renders for a client (see [Out of scope](#out-of-scope)).

## R1. HubSpot embed code

Every page of a public WRLD site loads WRLD's HubSpot tracking code (portal
`4824142`). It feeds website analytics, collected forms, the cookie banner and
chat into the one HubSpot account, so a visitor who fills a form on wrld.tel and
later books from wrld.tech is one contact, not two.

Paste it verbatim:

```html
<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/4824142.js"></script>
<!-- End of HubSpot Embed Code -->
```

Rules:

- **Once, in the shared layout.** Put it in the base layout or the build step
  that every page passes through, never page by page. A new page then cannot ship
  without it. Place it at the end of `<head>`; `async defer` keeps it off the
  critical path.
- **Never edit the snippet.** Keep the `id="hs-script-loader"`: HubSpot and the
  idempotence checks in our builds key on it. Don't swap the portal ID; `4824142`
  is WRLD's own account and never belongs on a client site.
- **Astro:** add `is:inline` so Astro emits the tag as written instead of
  bundling it: `<script is:inline type="text/javascript" id="hs-script-loader" …>`.
- **Client-side routing (Mintlify, SPAs):** the tracking code records only the
  page it loaded on. Report route changes through the `_hsq` queue
  (`setPath` then `trackPageView`). `WRLDInc/docs/hubspot.js` is the reference.
- **Previews:** where a layout already keeps third parties off previews and admin
  views (wrld.one's `firstPartyOnly`), put HubSpot behind the same gate.
- **Content Security Policy:** a site with a CSP must allow HubSpot, or the tag
  silently does nothing. With a nonce and `'strict-dynamic'` (wrld.email), stamp
  the nonce on the loader tag and its child scripts are trusted; the other
  directives still need these hosts:

  | Directive | Hosts |
  | --- | --- |
  | `script-src` | `https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hscollectedforms.net https://*.usemessages.com https://*.hsadspixel.net https://*.hubspot.com` |
  | `connect-src` | `https://*.hubspot.com https://*.hubapi.com https://*.hs-banner.com https://*.hscollectedforms.net https://*.hsforms.com https://*.hs-analytics.net` |
  | `frame-src` | `https://*.hubspot.com` (chat) |
  | `img-src` | `https://*.hubspot.com https://*.hsforms.com` (tracking pixel) |
  | `style-src`, `font-src` | `https://*.hubspot.com https://*.hsappstatic.net` |

  The `script-src` hosts are the ones `js.hs-scripts.com/4824142.js` loads as of
  2026-11-22; re-check them if HubSpot adds a feature to the portal.
- **Consent:** where the site runs a consent manager (wrld.tech runs GetTerms),
  the embed sits after it so the CMP can classify and hold it.

Verify after deploy. The loader should appear exactly once per page:

```sh
curl -sL https://example.wrld.tech/ | grep -c 'js.hs-scripts.com/4824142.js'
```

Then open the page with DevTools: `js.hs-scripts.com/4824142.js` loads with a
200 and the console shows no CSP violation for a HubSpot host.

### Platforms without a repo

| Platform | Where the snippet goes |
| --- | --- |
| WHMCS (wrld.host, Lagom2 theme) | A hook, so theme updates cannot drop it: `includes/hooks/wrld_hubspot.php` returning the snippet from `add_hook('ClientAreaHeadOutput', 1, function ($vars) { return '…snippet…'; });` |
| WordPress | The HubSpot plugin connected to portal 4824142, or the theme's header via a child theme. Not both: two loaders double-count. |
| Mintlify | A `.js` file in the content root; Mintlify injects every one site-wide. |
| Hosted tools (Zapier Interfaces, Better Stack status pages) | The tool's own custom head/tracking setting, where the plan offers one. Log the site as pending until it is confirmed. |

## Deployment baseline log

One row per public WRLD site. Update the row in the same PR that changes the
site's compliance. Status: **live** (verified on the domain), **PR open**,
**manual** (needs someone with access to the platform), **excluded** (with the
reason).

| Site | Source | R1 HubSpot | Notes |
| --- | --- | --- | --- |
| wrld.tech | `WRLDInc/WeReallyLoveDesign` (`site/`) | [PR open](https://github.com/WRLDInc/WeReallyLoveDesign/pull/204) | `site/src/layouts/Base.astro`, after GTM and the GetTerms CMP |
| wrld.ai | `WRLDInc/masp` | [PR open](https://github.com/WRLDInc/masp/pull/12) | `src/layouts/Base.astro` |
| wrld.email | `WRLDInc/EmailBrandingWRLD` (`portal/public/site/`) | [PR open](https://github.com/WRLDInc/EmailBrandingWRLD/pull/21) | Landing page only, not the signed-in portal; CSP widened in `portal/worker/http.js` |
| wrld.help → help.wrld.tech | `WRLDInc/docs` (Mintlify) | [PR open](https://github.com/WRLDInc/docs/pull/91) | `hubspot.js`, with route-change page views |
| wrld.tel | `WRLDInc/wrld.tel` | [PR open](https://github.com/WRLDInc/wrld.tel/pull/2) | `index.html`, `privacy.html`, `terms.html` |
| wrld.one | `WRLDInc/wrld.one` | [PR open](https://github.com/WRLDInc/wrld.one/pull/50) | `src/layouts/BaseLayout.astro`, behind `firstPartyOnly` |
| wrld.domains | `WRLDInc/wrld.domains_quick` | [PR open](https://github.com/WRLDInc/wrld.domains_quick/pull/23) | `index.html` |
| pulse.wrld.tech | `WRLDInc/publicServicesStatus-web` | [PR open](https://github.com/WRLDInc/publicServicesStatus-web/pull/10) | Every page in `public/` |
| wrld.design | `WRLDInc/DesignSystem` | [PR open](https://github.com/WRLDInc/DesignSystem/pull/45) | Injected by `scripts/build_site.mjs` into the same full pages as Gleap |
| wrld.host | WHMCS, Lagom2 theme | manual | Add the WHMCS hook above on the server |
| wrld.support | Zapier Interfaces | manual | Add through Interfaces settings if the plan allows custom code |
| wrld.press | WordPress | manual | Answers automated checks with 403; confirm in wp-admin |
| status.wrld.host, wrld.services | Hosted status pages | manual | Optional: status pages carry no forms |
| wrld.dev | `WRLDInc/wrld-dev` | excluded | Deliberately scriptless developer landing (CSP `default-src 'none'`) |

## Out of scope

These never get WRLD's HubSpot embed:

- **Authenticated apps and portals**: the signatures portal, `sign.wrld.tech`,
  `dash.wrld.tech`, `dash.wrld.tel`, `triage.wrld.tech`,
  `cspmanagement.wrld.tech`, `/admin` routes. Collected forms would capture
  account and contract data.
- **Client sites and client renders**: anything built for a client, including
  WRLD Builder sites on `*.wrld.dev` and WRLD.AI Studio renders. A client who
  wants HubSpot gets their own portal.
- **Non-page surfaces**: `preview/*` cards, printable `templates/*`, email HTML,
  OG image templates.
