/* =====================================================================
   WRLD theme for Trafft — calendar.wrld.tech — Custom JS
   Paste into: Trafft admin → Customize → Booking Website → Custom Code
               → Custom JS, wrapped in an HTML script element. Trafft writes
               the field into the document head with postscribe, which
               parses HTML: bare JavaScript is stored but never runs. Never
               write a closing script tag anywhere in this file, comments
               included, or the browser ends the script there. Pairs with
               custom.css; the CSS stands alone, so this file is optional.
   Source:     github.com/WRLDInc/DesignSystem — integrations/trafft/custom.js

   1. Keeps the browser-chrome colour (<meta name="theme-color">) on the
      WRLD mono surface. Trafft emits the admin primary (#027FEE), which
      tints mobile Safari / Android toolbars blue — a static accent fill.
   2. Optional: follows the visitor's OS light/dark preference — the WRLD
      data-theme="auto" behaviour, which Trafft's Light/Dark setting lacks.
      Off by default; set followSystemTheme to true to enable.
   ===================================================================== */
(function () {
  'use strict';

  // Trafft is a single-page app; never wire this up twice.
  if (window.__wrldTrafftTheme) return;
  window.__wrldTrafftTheme = true;

  var CONFIG = {
    followSystemTheme: false
  };

  var CHROME = { light: '#ffffff', dark: '#0a0a0a' }; // --wrld-bg per theme
  var root = document.documentElement;
  var scheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applySystemTheme() {
    if (!CONFIG.followSystemTheme || !scheme) return;
    var wanted = scheme.matches ? 'dark' : 'light';
    if (root.getAttribute('data-theme') !== wanted) root.setAttribute('data-theme', wanted);
  }

  function syncThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    var wanted = CHROME[currentTheme()];
    if (meta.getAttribute('content') !== wanted) meta.setAttribute('content', wanted);
  }

  function sync() {
    applySystemTheme();
    syncThemeColor();
  }

  sync();

  // Nuxt rewrites <html> attributes and head tags on navigation. Both
  // writers above only touch the DOM when the value differs, so these
  // observers settle after one pass instead of looping.
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  new MutationObserver(syncThemeColor).observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['content']
  });

  if (scheme) {
    if (scheme.addEventListener) scheme.addEventListener('change', sync);
    else if (scheme.addListener) scheme.addListener(sync); // Safari < 14
  }
})();
