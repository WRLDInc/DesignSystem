(() => {
  "use strict";

  // Absolute URLs go into the copied prompt so it works once pasted into an
  // agent somewhere else. location.origin is right on wrld.design and on the
  // per-branch preview hosts alike.
  const ORIGIN = location.origin;
  const CARD_RENDER_WIDTH = 340; // px — every preview is scaled to fit this width

  // Every WRLD surface needs these regardless of which card was picked.
  const CORE_FILES = [
    { path: "tokens/tokens.css", label: "tokens.css — canonical --wrld-* design tokens, light + dark" },
    { path: "colors_and_type.css", label: "colors_and_type.css — @font-face + semantic colour/type foundation" },
    { path: "styles.css", label: "styles.css — single global entry point" },
    { path: "README.md", label: "README.md — brand rules: voice, casing, hover/focus states" },
    { path: "brand/CLAUDE.md", label: "brand/CLAUDE.md — master brand brief" },
    { path: "assets/logos/wrld-mark-black.png", label: "wrld-mark-black.png — starburst mark (light surfaces)" },
    { path: "assets/logos/wrld-mark-white.png", label: "wrld-mark-white.png — starburst mark (dark surfaces)" },
  ];

  const FONT_FILES = [
    "fonts/Montserrat-VariableFont_wght.ttf",
    "fonts/Ubuntu-Light.ttf",
    "fonts/Ubuntu-Regular.ttf",
    "fonts/Ubuntu-Medium.ttf",
    "fonts/Ubuntu-Bold.ttf",
    "fonts/UbuntuMono-Regular.ttf",
    "fonts/UbuntuMono-Bold.ttf",
  ];

  const state = { manifest: null };

  init();

  async function init() {
    initTheme();
    initHeaderOffset();
    initModal();
    const sectionsEl = document.getElementById("sections");
    sectionsEl.innerHTML = '<p class="ds-status">Loading the system…</p>';
    try {
      // Assets-only origin: read the manifest file directly, no API layer.
      // Root-absolute — this page is served from /system/.
      const res = await fetch("/_ds_manifest.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.manifest = await res.json();
    } catch (err) {
      sectionsEl.innerHTML =
        '<p class="ds-status">Couldn’t load the card manifest (' + escapeHtml(String(err.message || err)) +
        '). The <a href="/styleguide/">styleguide</a> still works.</p>';
      return;
    }
    sectionsEl.innerHTML = "";
    render(state.manifest);
    initSearch();
  }

  // -------------------------------------------------------- header offset
  // The sticky header wraps onto extra rows at narrow widths, so anchor
  // scroll-margins and the side nav's sticky top can't be a fixed number.
  // Publish its live height as --header-h; app.css does the arithmetic.
  function initHeaderOffset() {
    const header = document.querySelector("header.top");
    if (!header) return;
    const root = document.documentElement;
    const publish = () => root.style.setProperty("--header-h", `${Math.ceil(header.getBoundingClientRect().height)}px`);
    publish();
    if ("ResizeObserver" in window) {
      new ResizeObserver(publish).observe(header);
    } else {
      window.addEventListener("resize", publish);
    }
    // Fonts swapping in can change the header's height after first paint.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(publish);
  }

  // ---------------------------------------------------------------- theme
  // Cycles auto → light → dark. 'auto' defers to prefers-color-scheme, which
  // tokens.css already handles via :root[data-theme="auto"].
  function initTheme() {
    const root = document.documentElement;
    const btn = document.getElementById("theme-toggle");
    const ORDER = ["auto", "light", "dark"];
    const stored = safeGet("wrld-theme");
    apply(ORDER.includes(stored) ? stored : "auto");
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "auto";
      const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
      apply(next);
      safeSet("wrld-theme", next);
    });
    function apply(theme) {
      root.setAttribute("data-theme", theme);
      document.getElementById("theme-toggle-label").textContent = theme[0].toUpperCase() + theme.slice(1);
      btn.setAttribute("aria-label", "Colour theme: " + theme + ". Activate to change.");
    }
  }
  function safeGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function safeSet(key, val) { try { localStorage.setItem(key, val); } catch {} }

  // ------------------------------------------------------------- render
  function render(manifest) {
    const groups = new Map();
    for (const card of manifest.cards || []) {
      if (!groups.has(card.group)) groups.set(card.group, []);
      groups.get(card.group).push(card);
    }

    const sectionsEl = document.getElementById("sections");
    const navEl = document.getElementById("sidenav-list");

    for (const [group, cards] of groups) {
      const id = slug(group);
      navEl.appendChild(navLink(id, group));
      sectionsEl.appendChild(buildSection(id, group, cards.map(cardEl)));
    }

    if (manifest.templates?.length) {
      navEl.appendChild(navLink("templates", "Templates"));
      sectionsEl.appendChild(buildSection("templates", "Templates", manifest.templates.map(templateCardEl)));
    }

    navEl.appendChild(navLink("all-previews", "All previews"));

    // The landing page links /system#foundations. Park that alias right in
    // front of the Colors section (colours, spacing and type are the
    // foundations); it falls back to the top of the sections otherwise.
    const alias = document.getElementById("foundations");
    const colors = document.getElementById("colors");
    if (alias && colors) colors.parentNode.insertBefore(alias, colors);

    // The build only injects the preview index into the apex index.html, so
    // build this page's copy from the manifest — same canonical, extensionless
    // links, same order.
    const index = document.getElementById("preview-index");
    if (index) {
      index.innerHTML = "";
      for (const card of (manifest.cards || []).filter((c) => c.path.startsWith("preview/"))) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = toCanonical(card.path);
        a.textContent = card.path.replace(/^preview\//, "").replace(/\.html$/, "").replace(/-/g, " ");
        li.appendChild(a);
        index.appendChild(li);
      }
    }

    observeActiveSection();
    observeLazyPreviews();

    // Deep links from the landing page (/system#foundations, #components,
    // #brand) point at elements that only exist — or only settle into place —
    // after this render, so the browser's initial hash scroll misses them.
    settleHashScroll();
  }

  // Scroll to the hash target now, then again once web fonts have swapped in
  // (text above the target re-wraps, most visibly on phones) and once more
  // after the first previews have laid out, so the heading ends up where the
  // scroll-margin says it should.
  function settleHashScroll() {
    if (location.hash.length < 2) return;
    const go = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    };
    go();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    setTimeout(go, 600);
  }

  function buildSection(id, title, cardNodes) {
    const section = document.createElement("section");
    section.className = "ds-section";
    section.id = id;
    const h2 = document.createElement("h2");
    h2.textContent = title;
    const grid = document.createElement("div");
    grid.className = "card-grid";
    cardNodes.forEach((n) => grid.appendChild(n));
    section.append(h2, grid);
    return section;
  }

  function navLink(id, label) {
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.dataset.target = id;
    a.textContent = label;
    return a;
  }

  // The origin serves canonical extensionless URLs (html_handling:
  // auto-trailing-slash): /preview/foo.html 307s to /preview/foo and
  // /ui_kits/x/index.html 307s to /ui_kits/x/. Link the canonical form so
  // 28 iframes don't each cost a redirect hop.
  // Returned root-absolute, because this page is served from /system/ and
  // every card lives at the site root.
  function toCanonical(path) {
    let p = path.replace(/^\/+/, "");
    if (p.endsWith("/index.html")) p = p.slice(0, -"index.html".length);
    else if (p.endsWith(".html")) p = p.slice(0, -".html".length);
    return "/" + p;
  }

  function cardEl(card) {
    const [w, h] = (card.viewport || "700x300").split("x").map(Number);
    const scale = CARD_RENDER_WIDTH / w;
    const renderHeight = Math.round(h * scale);

    const el = document.createElement("article");
    el.className = "ds-card";
    el.dataset.name = card.name.toLowerCase();
    el.dataset.subtitle = (card.subtitle || "").toLowerCase();
    el.dataset.group = (card.group || "").toLowerCase();

    const preview = document.createElement("div");
    preview.className = "ds-card-preview";
    preview.style.height = `${renderHeight}px`;

    const iframe = document.createElement("iframe");
    iframe.loading = "lazy";
    iframe.title = card.name + " preview";
    iframe.tabIndex = -1;
    iframe.dataset.lazySrc = toCanonical(card.path);
    iframe.width = w;
    iframe.height = h;
    iframe.style.width = `${w}px`;
    iframe.style.height = `${h}px`;
    iframe.style.transform = `scale(${scale})`;
    iframe.style.transformOrigin = "top left";
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    preview.appendChild(iframe);

    const useBtn = document.createElement("button");
    useBtn.type = "button";
    useBtn.className = "btn btn-primary ds-card-use";
    useBtn.textContent = "Use";
    useBtn.setAttribute("aria-label", "Use " + card.name);
    useBtn.addEventListener("click", () => openModal(card, useBtn));
    preview.appendChild(useBtn);

    const body = document.createElement("div");
    body.className = "ds-card-body";
    const name = document.createElement("span");
    name.className = "ds-card-name";
    name.textContent = card.name;
    const subtitle = document.createElement("span");
    subtitle.className = "ds-card-subtitle";
    subtitle.textContent = card.subtitle || "";
    const open = document.createElement("a");
    open.className = "ds-card-open";
    open.href = toCanonical(card.path);
    open.target = "_blank";
    open.rel = "noopener";
    open.textContent = "Open standalone ↗";
    open.setAttribute("aria-label", "Open " + card.name + " standalone");
    body.append(name, subtitle, open);

    el.append(preview, body);
    return el;
  }

  function templateCardEl(tpl) {
    const el = document.createElement("article");
    el.className = "ds-card template-card";
    el.dataset.name = tpl.name.toLowerCase();
    el.dataset.subtitle = (tpl.description || "").toLowerCase();
    el.dataset.group = "templates";

    const preview = document.createElement("div");
    preview.className = "ds-card-preview";
    preview.style.height = "160px";
    preview.innerHTML = '<div class="ds-status">Paged document · open to view</div>';

    const useBtn = document.createElement("button");
    useBtn.type = "button";
    useBtn.className = "btn btn-primary ds-card-use";
    useBtn.textContent = "Use";
    useBtn.setAttribute("aria-label", "Use " + tpl.name);
    useBtn.addEventListener("click", () => openModal(templateAsCard(tpl), useBtn));
    preview.appendChild(useBtn);

    const body = document.createElement("div");
    body.className = "ds-card-body";
    const name = document.createElement("span");
    name.className = "ds-card-name";
    name.textContent = tpl.name;
    const subtitle = document.createElement("span");
    subtitle.className = "ds-card-subtitle";
    subtitle.textContent = tpl.description || "";
    const open = document.createElement("a");
    open.className = "ds-card-open";
    open.href = "/" + tpl.entryPath.replace(/^\/+/, "");
    open.target = "_blank";
    open.rel = "noopener";
    open.textContent = "Open template ↗";
    body.append(name, subtitle, open);

    el.append(preview, body);
    return el;
  }

  function templateAsCard(tpl) {
    return { name: tpl.name, group: "Templates", subtitle: tpl.description, path: tpl.entryPath, isTemplate: true, folder: tpl.folder };
  }

  // ------------------------------------------------------ lazy previews
  function observeLazyPreviews() {
    const frames = document.querySelectorAll(".ds-card-preview iframe[data-lazy-src]");
    if (!("IntersectionObserver" in window)) {
      frames.forEach((f) => { f.src = f.dataset.lazySrc; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const iframe = entry.target;
        if (iframe.dataset.lazySrc && !iframe.getAttribute("src")) iframe.src = iframe.dataset.lazySrc;
        io.unobserve(iframe);
      }
    }, { rootMargin: "200px" });
    frames.forEach((f) => io.observe(f));
  }

  function observeActiveSection() {
    const links = [...document.querySelectorAll("#sidenav-list a")];
    const sections = [...document.querySelectorAll(".ds-section")];
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((l) => l.classList.toggle("active", l.dataset.target === entry.target.id));
      }
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  // ------------------------------------------------------------- search
  function initSearch() {
    const input = document.getElementById("search");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll(".ds-card").forEach((card) => {
        // Name, subtitle, and the section (manifest group) the card sits in,
        // so "brand" or "components" finds everything under that heading.
        const haystack = `${card.dataset.name} ${card.dataset.subtitle} ${card.dataset.group || ""}`;
        card.hidden = !!q && !haystack.includes(q);
      });
      document.querySelectorAll("#sections .ds-section").forEach((section) => {
        section.hidden = ![...section.querySelectorAll(".ds-card")].some((c) => !c.hidden);
      });
    });
  }

  // -------------------------------------------------------------- modal
  const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;
  let statusTimer = null;

  function initModal() {
    const backdrop = document.getElementById("modal-backdrop");
    document.getElementById("modal-close").addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });

    document.addEventListener("keydown", (e) => {
      if (backdrop.hidden) return;
      if (e.key === "Escape") { closeModal(); return; }
      // Trap Tab inside the dialog — otherwise it leaks onto the page behind.
      if (e.key === "Tab") {
        const nodes = backdrop.querySelectorAll(FOCUSABLE);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    document.getElementById("modal-copy").addEventListener("click", () => {
      copyText(document.getElementById("modal-prompt").value);
    });
    document.getElementById("modal-copy-files").addEventListener("click", () => {
      const urls = [...document.querySelectorAll("#modal-files a")].map((a) => a.href);
      copyText(urls.join("\n"));
    });
  }

  function openModal(card, trigger) {
    lastFocused = trigger || document.activeElement;
    const { prompt, files } = buildPrompt(card);
    document.getElementById("modal-group").textContent = card.group || "";
    document.getElementById("modal-title").textContent = card.name;
    document.getElementById("modal-subtitle").textContent = card.subtitle || "";
    document.getElementById("modal-prompt").value = prompt;

    const filesEl = document.getElementById("modal-files");
    filesEl.innerHTML = "";
    files.forEach(({ url, label, core }) => {
      const li = document.createElement("li");
      if (core) li.className = "core";
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = label;
      li.appendChild(a);
      filesEl.appendChild(li);
    });

    const status = document.getElementById("modal-status");
    status.textContent = "";
    status.classList.remove("show");

    document.getElementById("modal-backdrop").hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close").focus();
  }

  function closeModal() {
    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  // A live region, not a visual toggle: set the text here so assistive tech
  // announces it, and say what actually happened.
  function announceCopyResult(ok) {
    const status = document.getElementById("modal-status");
    status.textContent = ok ? "Copied" : "Copy failed — select the text and copy manually";
    status.classList.add("show");
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.classList.remove("show"); status.textContent = ""; }, 1800);
  }

  function copyText(text) {
    const refocus = document.activeElement;
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      document.body.removeChild(ta);
      if (refocus && typeof refocus.focus === "function") refocus.focus();
      return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => announceCopyResult(true), () => announceCopyResult(fallback()));
    } else {
      announceCopyResult(fallback());
    }
  }

  // ------------------------------------------------- prompt generation
  function relatedComponentSources(card) {
    if (!card.path?.startsWith("ui_kits/")) return [];
    const folder = card.path.split("/").slice(0, -1).join("/"); // e.g. ui_kits/wrld-tech
    const all = state.manifest.components || [];
    const components = all.filter((c) => c.sourcePath.startsWith(folder + "/"));
    // Both product kits build on the shared Lockup.
    const lockup = all.find((c) => c.sourcePath === "ui_kits/_shared/Lockup.jsx");
    if (folder !== "ui_kits/_shared" && lockup && !components.includes(lockup)) components.push(lockup);
    return components.map((c) => c.sourcePath);
  }

  function buildPrompt(card) {
    const isComponent = card.path?.startsWith("ui_kits/");
    const isTemplate = !!card.isTemplate;
    const kind = isTemplate ? "template" : isComponent ? "UI kit" : "pattern";

    let specific = [card.path];
    if (isComponent) specific.push(...relatedComponentSources(card), "_ds_bundle.js", "_ds_manifest.json");
    if (isTemplate) specific = [card.path, `${card.folder}/support.js`, `${card.folder}/ds-base.js`];
    specific = [...new Set(specific)];

    const lines = [];
    lines.push(`Implement the "${card.name}" ${kind} from the WRLD design system — matching the real files below exactly, not an approximation.`);
    lines.push("");
    lines.push("Primary reference (live, publicly reachable):");
    specific.forEach((p) => lines.push(`- ${ORIGIN}/${p}`));
    lines.push("");
    lines.push("Core system files (always apply, on every WRLD surface):");
    CORE_FILES.forEach((f) => lines.push(`- ${ORIGIN}/${f.path} — ${f.label.split(" — ")[1] || f.label}`));
    lines.push("");
    lines.push("Self-hosted type (Montserrat variable, Ubuntu family, Ubuntu Mono) — load these exact files; never substitute Google Fonts:");
    FONT_FILES.forEach((f) => lines.push(`- ${ORIGIN}/${f}`));
    lines.push("");
    lines.push("Non-negotiables (from README.md):");
    lines.push("- Static surfaces stay 100% monochrome. The accents (#007fee primary, #00adee secondary, #EE9300 warm) are interactive-only — hover, focus, press — never a decorative fill or gradient background.");
    lines.push("- Light/dark is driven by [data-theme] on <html> (light, dark, auto) using the semantic tokens; never hardcode a hex value.");
    lines.push("- Sentence case everywhere in copy and labels. No Title Case, no ALL CAPS except eyebrow microtype (letter-spacing 0.12em) and the wordmark-as-type treatment (0.28em).");
    lines.push("- Radii: prefer sharp (0) or 4px; cards 8px; modals 12px. Avoid 16px+.");
    lines.push("- No emoji as iconography. Lucide (1.5px stroke, currentColor) or inline unicode arrows only.");
    lines.push("- Use the authentic starburst mark PNGs as shipped — never redraw, recolor, or add effects.");
    if (isComponent) {
      lines.push(`- Components are namespaced on window.${state.manifest.namespace || "WRLDTechDesignSystemRemix"} in _ds_bundle.js — read the referenced .jsx source for exact props before reimplementing.`);
    }

    const files = [
      ...specific.map((p) => ({ url: `${ORIGIN}/${p}`, label: p })),
      ...CORE_FILES.map((f) => ({ url: `${ORIGIN}/${f.path}`, label: f.path, core: true })),
      ...FONT_FILES.map((p) => ({ url: `${ORIGIN}/${p}`, label: p, core: true })),
    ];

    return { prompt: lines.join("\n"), files };
  }

  // --------------------------------------------------------- utilities
  function slug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
