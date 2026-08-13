/* @ds-bundle: {"format":4,"namespace":"WRLDTechDesignSystemRemix_6276ea","components":[{"name":"Lockup","sourcePath":"ui_kits/_shared/Lockup.jsx"},{"name":"AgentDetail","sourcePath":"ui_kits/wrld-ai/AgentDetail.jsx"},{"name":"AgentList","sourcePath":"ui_kits/wrld-ai/AgentList.jsx"},{"name":"RunHistory","sourcePath":"ui_kits/wrld-ai/RunHistory.jsx"},{"name":"Sidebar","sourcePath":"ui_kits/wrld-ai/Sidebar.jsx"},{"name":"StatCard","sourcePath":"ui_kits/wrld-ai/StatCard.jsx"},{"name":"TopBar","sourcePath":"ui_kits/wrld-ai/TopBar.jsx"},{"name":"Button","sourcePath":"ui_kits/wrld-tech/Button.jsx"},{"name":"CTA","sourcePath":"ui_kits/wrld-tech/CTA.jsx"},{"name":"Eyebrow","sourcePath":"ui_kits/wrld-tech/Eyebrow.jsx"},{"name":"Footer","sourcePath":"ui_kits/wrld-tech/Footer.jsx"},{"name":"Header","sourcePath":"ui_kits/wrld-tech/Header.jsx"},{"name":"Hero","sourcePath":"ui_kits/wrld-tech/Hero.jsx"},{"name":"ServicesGrid","sourcePath":"ui_kits/wrld-tech/ServicesGrid.jsx"},{"name":"ValuesStrip","sourcePath":"ui_kits/wrld-tech/ValuesStrip.jsx"}],"sourceHashes":{"styleguide/tweaks-panel.jsx":"57fac7f3caf9","ui_kits/_shared/Lockup.jsx":"6c0ff84ad9d2","ui_kits/wrld-ai/AgentDetail.jsx":"a4fd6eee8f43","ui_kits/wrld-ai/AgentList.jsx":"fd556cea7ab8","ui_kits/wrld-ai/RunHistory.jsx":"3884edd6598d","ui_kits/wrld-ai/Sidebar.jsx":"78381d580953","ui_kits/wrld-ai/StatCard.jsx":"a947957ae150","ui_kits/wrld-ai/TopBar.jsx":"f9434490ea66","ui_kits/wrld-tech/Button.jsx":"237884ba4310","ui_kits/wrld-tech/CTA.jsx":"524f2ca63191","ui_kits/wrld-tech/Eyebrow.jsx":"bbf587253c14","ui_kits/wrld-tech/Footer.jsx":"032ecfba508b","ui_kits/wrld-tech/Header.jsx":"516be493f364","ui_kits/wrld-tech/Hero.jsx":"675fb1562475","ui_kits/wrld-tech/ServicesGrid.jsx":"c302bc0eb9d0","ui_kits/wrld-tech/ValuesStrip.jsx":"e1c59922e2d5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WRLDTechDesignSystemRemix_6276ea = window.WRLDTechDesignSystemRemix_6276ea || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// styleguide/tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "styleguide/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/_shared/Lockup.jsx
try { (() => {
// Canonical WRLD lockup. Mark + wordmark + optional right-aligned sub-brand label.
// `sub` can be a string (always shown) or null/undefined (hidden).
// `animated` (boolean): when true, sub-label fades + wordmark nudges up smoothly when sub is set.
//   Use `animated` for nav lockups that morph on hover. Static lockups (footer, sub-cards) leave it off.
function Lockup({
  sub,
  theme = 'dark',
  size = 24,
  animated = false,
  style
}) {
  const markSrc = theme === 'light' ? '../../assets/logos/wrld-mark-white.png' : '../../assets/logos/wrld-mark-black.png';
  const fg = theme === 'light' ? '#fff' : '#000';
  const subFg = theme === 'light' ? '#a1a1aa' : '#52525b';
  const hasSub = !!sub;

  // Animated mode: text column has a fixed reserved height (wordmark + sub line) and
  // we shift the wordmark up by half a sub-line when sub appears, so it visually
  // re-centers around the mark instead of jumping.
  const subLineH = size * 0.5 + 4;
  const wordmarkY = animated ? hasSub ? -subLineH / 2 : 0 : 0;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      lineHeight: 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: markSrc,
    alt: "WRLD",
    style: {
      height: size * 1.7,
      width: size * 1.7,
      objectFit: 'contain',
      flexShrink: 0,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      paddingRight: '4.2em',
      lineHeight: 1,
      height: animated ? size + subLineH : 'auto',
      justifyContent: animated ? 'flex-start' : 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.04em',
      color: fg,
      transform: `translateY(${wordmarkY}px)`,
      transition: animated ? 'transform 280ms cubic-bezier(.2,.8,.2,1)' : 'none',
      marginTop: animated ? subLineH / 2 : 0
    }
  }, "WRLD"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      fontSize: size * 0.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: subFg,
      marginTop: 4,
      opacity: animated ? hasSub ? 1 : 0 : hasSub ? 1 : 0,
      transform: animated ? `translateY(${hasSub ? 0 : -4}px)` : 'none',
      transition: animated ? 'opacity 220ms ease, transform 280ms cubic-bezier(.2,.8,.2,1)' : 'none',
      height: animated ? subLineH : hasSub ? 'auto' : 0,
      display: animated ? 'block' : hasSub ? 'block' : 'none',
      pointerEvents: 'none'
    }
  }, sub || '')));
}
window.Lockup = Lockup;
Object.assign(__ds_scope, { Lockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/_shared/Lockup.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-ai/AgentDetail.jsx
try { (() => {
function AgentDetail({
  agent,
  runs
}) {
  if (!agent) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--fg-muted)',
      marginBottom: 8
    }
  }, "Agent \xB7 ", agent.id), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 24,
      letterSpacing: '-0.02em',
      margin: 0,
      marginBottom: 8
    }
  }, agent.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--fg-muted)',
      maxWidth: 640,
      margin: 0,
      lineHeight: 1.55
    }
  }, agent.description)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      padding: '8px 14px',
      borderRadius: 4,
      border: '1px solid var(--border-strong)',
      background: 'transparent',
      cursor: 'pointer'
    }
  }, "Edit prompt"), /*#__PURE__*/React.createElement("button", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      padding: '8px 14px',
      borderRadius: 4,
      border: '1px solid var(--fg)',
      background: 'var(--fg)',
      color: 'var(--fg-inverse)',
      cursor: 'pointer'
    }
  }, "Run now"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Runs \xB7 30d",
    value: "284",
    delta: "12% wow",
    deltaPositive: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Avg duration",
    value: "3.2s",
    delta: "0.4s wow",
    deltaPositive: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Success rate",
    value: "98.6%",
    delta: "0.2pp wow",
    deltaPositive: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Cost \xB7 30d",
    value: "$14.20",
    delta: "2% wow"
  })), /*#__PURE__*/React.createElement(RunHistory, {
    runs: runs
  }));
}
window.AgentDetail = AgentDetail;
Object.assign(__ds_scope, { AgentDetail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-ai/AgentDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-ai/AgentList.jsx
try { (() => {
function AgentRow({
  agent,
  active,
  onSelect
}) {
  const [hover, setHover] = React.useState(false);
  const statusColor = {
    healthy: 'var(--status-success)',
    degraded: 'var(--status-warning)',
    off: 'var(--fg-subtle)'
  }[agent.status];
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onSelect(agent.id),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 20px',
      borderRadius: 8,
      border: '1px solid var(--border)',
      background: active ? 'var(--bg-subtle)' : 'var(--bg-elevated)',
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
      boxShadow: hover && !active ? 'var(--shadow-md), var(--shadow-accent-secondary)' : 'none',
      transform: hover && !active ? 'translateY(-1px)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 4,
      background: 'var(--bg-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": agent.icon,
    style: {
      width: 18,
      height: 18
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, agent.name), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      background: statusColor,
      borderRadius: 99
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--fg-muted)',
      marginTop: 2
    }
  }, agent.summary)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-muted)',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", null, agent.runs, " runs"), /*#__PURE__*/React.createElement("div", null, agent.lastRun)));
}
function AgentList({
  agents,
  activeId,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, agents.map(a => /*#__PURE__*/React.createElement(AgentRow, {
    key: a.id,
    agent: a,
    active: activeId === a.id,
    onSelect: onSelect
  })));
}
window.AgentList = AgentList;
window.AgentRow = AgentRow;
Object.assign(__ds_scope, { AgentList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-ai/AgentList.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-ai/RunHistory.jsx
try { (() => {
function RunHistory({
  runs
}) {
  const statusBg = {
    success: {
      bg: '#ecfdf5',
      fg: '#065f46',
      dot: 'var(--status-success)'
    },
    running: {
      bg: 'var(--bg-muted)',
      fg: 'var(--fg)',
      dot: 'var(--accent-secondary)'
    },
    failed: {
      bg: '#fef2f2',
      fg: '#991b1b',
      dot: 'var(--status-danger)'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 20px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-subtle)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, "Recent runs"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-muted)'
    }
  }, "last 24h")), /*#__PURE__*/React.createElement("div", null, runs.map((r, i) => {
    const s = statusBg[r.status];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: '120px 1fr 100px 80px',
        gap: 16,
        alignItems: 'center',
        padding: '12px 20px',
        borderTop: i === 0 ? 'none' : '1px solid var(--border)',
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 8px',
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 500,
        background: s.bg,
        color: s.fg,
        width: 'fit-content'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        background: s.dot,
        borderRadius: 99
      }
    }), r.status), /*#__PURE__*/React.createElement("div", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, r.summary), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }
    }, r.duration), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        textAlign: 'right'
      }
    }, r.time));
  })));
}
window.RunHistory = RunHistory;
Object.assign(__ds_scope, { RunHistory });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-ai/RunHistory.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-ai/Sidebar.jsx
try { (() => {
function Sidebar({
  active,
  onNavigate
}) {
  const items = [{
    id: 'agents',
    label: 'Agents',
    icon: 'bot'
  }, {
    id: 'runs',
    label: 'Run history',
    icon: 'activity'
  }, {
    id: 'data',
    label: 'Data sources',
    icon: 'database'
  }, {
    id: 'integrations',
    label: 'Integrations',
    icon: 'plug'
  }, {
    id: 'team',
    label: 'Team',
    icon: 'users'
  }, {
    id: 'settings',
    label: 'Settings',
    icon: 'settings'
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 240,
      borderRight: '1px solid var(--border)',
      background: 'var(--bg-subtle)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      height: '100vh',
      position: 'sticky',
      top: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 8px',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Lockup, {
    sub: "AI",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--fg-muted)',
      padding: '0 8px',
      marginBottom: 4
    }
  }, "Workspace"), items.map(it => {
    const isActive = active === it.id;
    return /*#__PURE__*/React.createElement("a", {
      key: it.id,
      onClick: () => onNavigate(it.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        textDecoration: 'none',
        color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
        background: isActive ? 'var(--bg)' : 'transparent',
        border: isActive ? '1px solid var(--border)' : '1px solid transparent'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": it.icon,
      style: {
        width: 16,
        height: 16
      }
    }), /*#__PURE__*/React.createElement("span", null, it.label));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: '12px 10px',
      borderTop: '1px solid var(--border)',
      fontSize: 12,
      color: 'var(--fg-muted)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: 'var(--fg)'
    }
  }, "Acme Roofing"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11
    }
  }, "Pro plan \xB7 12 agents")));
}
window.Sidebar = Sidebar;
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-ai/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-ai/StatCard.jsx
try { (() => {
function StatCard({
  label,
  value,
  delta,
  deltaPositive
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 20,
      background: 'var(--bg-elevated)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--fg-muted)',
      marginBottom: 10
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 32,
      letterSpacing: '-0.02em',
      lineHeight: 1.1
    }
  }, value), delta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: deltaPositive ? 'var(--status-success)' : 'var(--fg-muted)'
    }
  }, deltaPositive ? '↑' : '↓', " ", delta));
}
window.StatCard = StatCard;
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-ai/StatCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-ai/TopBar.jsx
try { (() => {
function TopBar({
  title,
  subtitle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--border)',
      padding: '24px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--fg-muted)',
      marginBottom: 6
    }
  }, subtitle), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 28,
      letterSpacing: '-0.02em',
      margin: 0
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 500,
      padding: '8px 14px',
      borderRadius: 4,
      border: '1px solid var(--border-strong)',
      background: 'transparent',
      cursor: 'pointer'
    }
  }, "Export"), /*#__PURE__*/React.createElement("button", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 500,
      padding: '8px 14px',
      borderRadius: 4,
      border: '1px solid var(--fg)',
      background: 'var(--fg)',
      color: 'var(--fg-inverse)',
      cursor: 'pointer'
    }
  }, "+ New agent")));
}
window.TopBar = TopBar;
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-ai/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-tech/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  children,
  onClick,
  ...rest
}) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 500,
    padding: '10px 18px',
    borderRadius: 4,
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'all 200ms cubic-bezier(.2,.8,.2,1)'
  };
  const variants = {
    primary: {
      background: 'var(--fg)',
      color: 'var(--fg-inverse)',
      borderColor: 'var(--fg)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--fg)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--fg)'
    },
    warm: {
      background: 'var(--fg)',
      color: 'var(--fg-inverse)',
      borderColor: 'var(--fg)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverFx = {
    primary: hover ? {
      boxShadow: 'var(--shadow-accent-primary)',
      transform: 'translateY(-1px)'
    } : {},
    secondary: hover ? {
      borderColor: 'var(--fg)'
    } : {},
    ghost: hover ? {
      color: 'var(--accent-primary)'
    } : {},
    warm: hover ? {
      boxShadow: 'var(--shadow-accent-warm)',
      transform: 'translateY(-1px)'
    } : {}
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverFx[variant]
    }
  }, rest), children);
}
window.Button = Button;
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-tech/Button.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-tech/CTA.jsx
try { (() => {
function CTA() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '64px auto',
      padding: '80px 64px',
      background: 'var(--mono-950)',
      color: 'var(--mono-50)',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--mono-400)',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 16
    }
  }, "Get in touch"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: 44,
      lineHeight: 1.1,
      margin: 0,
      maxWidth: 640
    }
  }, "Tech that moves with you.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      padding: '14px 22px',
      borderRadius: 4,
      cursor: 'pointer',
      background: 'var(--mono-50)',
      color: 'var(--mono-950)',
      border: 'none'
    }
  }, "Start a conversation \u2192"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--mono-400)'
    }
  }, "ridge@wrld.tech \xB7 Dallas, TX"))));
}
window.CTA = CTA;
Object.assign(__ds_scope, { CTA });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-tech/CTA.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-tech/Eyebrow.jsx
try { (() => {
function Eyebrow({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--fg-muted)',
      ...style
    }
  }, children);
}
window.Eyebrow = Eyebrow;
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-tech/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-tech/Footer.jsx
try { (() => {
function Footer() {
  const cols = [{
    title: 'Services',
    items: ['Hosting', 'Design', 'AI', 'Managed IT', 'Support', 'Press']
  }, {
    title: 'Company',
    items: ['About', 'Values', 'Contact', 'Careers']
  }, {
    title: 'Resources',
    items: ['Client portal', 'Status', 'Brand kit', 'Privacy']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border)',
      padding: '48px 32px 32px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: 48,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Lockup, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--fg-muted)',
      maxWidth: 320,
      lineHeight: 1.55
    }
  }, "WRLD Tech Co., a DBA of WRLD Inc. SMB business technology, automation, and AI solutions.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--fg-muted)',
      marginBottom: 12
    }
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      fontSize: 13,
      color: 'var(--fg)',
      textDecoration: 'none'
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border)',
      paddingTop: 20,
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: 'var(--fg-muted)',
      fontFamily: 'var(--font-mono)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 WRLD Inc. \xB7 EIN 84-5122446 \xB7 Dallas, TX"), /*#__PURE__*/React.createElement("span", null, "v0.1.0")));
}
window.Footer = Footer;
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-tech/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-tech/Header.jsx
try { (() => {
// Header — submenu lives inside the nav grid (same column as its parent link)
// rather than as a free-floating overlay. The whole nav is a CSS grid; each
// top link occupies a column at row 1, and on hover the submenu fills row 2
// beneath that column. Siblings don't shift.
//
// Animation choreography:
//   - Slower, fade-dominant transitions (560ms opacity + 460ms translate).
//   - A sequence guard: when the hover target changes while a submenu is
//     mid-animation, the outgoing menu finishes its exit before the
//     incoming one starts. Rapid mouse-overs no longer jitter; they queue.
//   - A single "traveling underline" indicator slides between top links
//     instead of each item growing its own underline — a unified motion.
//   - Submenu items wrap into a second mini-column if the list is long
//     (so menus stay within the nav row's vertical envelope).

const NAV_MODEL = [{
  id: 'tech',
  label: 'Tech',
  sub: 'TECH',
  submenu: ['Why WRLD', 'Process', 'Case studies', 'Pricing']
}, {
  id: 'services',
  label: 'Services',
  sub: 'SERVICES',
  submenu: ['Managed IT', 'Monitoring', 'Patching', 'Onboarding']
}, {
  id: 'host',
  label: 'Host',
  sub: 'HOST',
  submenu: ['Plans', 'Stack', 'Status', 'Migrations']
}, {
  id: 'ai',
  label: 'AI',
  sub: 'AI',
  submenu: ['Build', 'Test', 'Deploy', 'RAG', 'Training', 'Chat']
}, {
  id: 'help',
  label: 'Help',
  sub: null,
  submenu: null
}, {
  id: 'contact',
  label: 'Contact',
  sub: null,
  submenu: null
}];
const EASE = 'cubic-bezier(.22, 1, .36, 1)';
const EASE_SOFT = 'cubic-bezier(.32, .72, .28, 1)';
const D_INDICATOR = 380; // traveling underline
const D_FADE_IN = 520; // submenu opacity in
const D_FADE_OUT = 360; // submenu opacity out (slightly faster)
const D_SLIDE_IN = 460; // submenu translate in
const D_SLIDE_OUT = 320; // submenu translate out
const D_CHROME = 480; // header padding-bottom
const STAGGER = 55; // per-submenu-item delay
const SETTLE_HOLD = 120; // ms to hold close before re-opening on rapid switch

function Header({
  activeRoute,
  onNavigate
}) {
  // hoverId   — what the user is currently pointed at (intent)
  // visibleId — what's actually visible / animating (state machine)
  // phase     — 'idle' | 'opening' | 'open' | 'closing'
  const [hoverId, setHoverId] = React.useState(null);
  const [visibleId, setVisibleId] = React.useState(null);
  const [phase, setPhase] = React.useState('idle');
  const [narrow, setNarrow] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const closeTimer = React.useRef(null);
  const phaseTimer = React.useRef(null);

  // For the traveling underline
  const navRef = React.useRef(null);
  const itemRefs = React.useRef({});
  const [indicator, setIndicator] = React.useState({
    left: 0,
    width: 0,
    opacity: 0
  });
  React.useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 900);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Drive the state machine off (hoverId, visibleId).
  // Rule: animations always finish. We never interrupt mid-phase.
  React.useEffect(() => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);

    // Same target: nothing to do.
    if (hoverId === visibleId) {
      if (phase === 'closing' && hoverId !== null) {
        // User came back to the still-closing menu — let it fully finish, then re-open.
        phaseTimer.current = setTimeout(() => {
          setVisibleId(hoverId);
          setPhase('opening');
          phaseTimer.current = setTimeout(() => setPhase('open'), D_FADE_IN + (NAV_MODEL.find(l => l.id === hoverId)?.submenu?.length || 0) * STAGGER);
        }, D_FADE_OUT);
      }
      return;
    }

    // Target changed.
    if (visibleId === null) {
      // No menu open → open the new one immediately.
      setVisibleId(hoverId);
      setPhase('opening');
      const len = NAV_MODEL.find(l => l.id === hoverId)?.submenu?.length || 0;
      phaseTimer.current = setTimeout(() => setPhase('open'), D_FADE_IN + len * STAGGER);
      return;
    }

    // A different menu is currently visible. Close it fully, settle, then open the new one.
    if (phase !== 'closing') {
      setPhase('closing');
    }
    phaseTimer.current = setTimeout(() => {
      // After exit completes…
      if (hoverId === null) {
        setVisibleId(null);
        setPhase('idle');
      } else {
        // Brief settle hold so the user perceives a finished beat,
        // then open the new menu.
        setVisibleId(null);
        setPhase('idle');
        phaseTimer.current = setTimeout(() => {
          setVisibleId(hoverId);
          setPhase('opening');
          const len = NAV_MODEL.find(l => l.id === hoverId)?.submenu?.length || 0;
          phaseTimer.current = setTimeout(() => setPhase('open'), D_FADE_IN + len * STAGGER);
        }, SETTLE_HOLD);
      }
    }, Math.max(D_FADE_OUT, D_SLIDE_OUT));
    return () => clearTimeout(phaseTimer.current);
  }, [hoverId, visibleId]);

  // Update the traveling underline whenever hover (or active route) changes,
  // OR whenever the nav itself resizes / reflows (which would otherwise leave
  // the indicator stranded at a stale x).
  const measureIndicator = React.useCallback(() => {
    const targetId = hoverId || activeRoute;
    const el = itemRefs.current[targetId];
    const navEl = navRef.current;
    if (!el || !navEl) {
      setIndicator(s => ({
        ...s,
        opacity: 0
      }));
      return;
    }
    const er = el.getBoundingClientRect();
    const nr = navEl.getBoundingClientRect();
    setIndicator({
      left: er.left - nr.left,
      width: er.width,
      opacity: 1
    });
  }, [hoverId, activeRoute]);
  React.useEffect(() => {
    measureIndicator();
  }, [measureIndicator, narrow]);
  React.useEffect(() => {
    if (!navRef.current) return;
    const ro = new ResizeObserver(() => measureIndicator());
    ro.observe(navRef.current);
    window.addEventListener('resize', measureIndicator);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureIndicator);
    };
  }, [measureIndicator]);
  const open = id => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHoverId(id);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHoverId(null), 180);
  };
  const visible = NAV_MODEL.find(l => l.id === visibleId);
  const showSubmenu = !!(visible && visible.submenu && (phase === 'opening' || phase === 'open'));
  const lockupSub = visible?.sub || null;

  // Reserve a fixed bottom slot equal to the tallest possible submenu so
  // the chrome doesn't bounce as different menus open. Submenu is now a
  // horizontal row that wraps at most twice (height ~ 2 rows).
  const SUBMENU_ROW_H = 22;
  const SUBMENU_MAX_ROWS = 2;
  const submenuSlotH = SUBMENU_ROW_H * SUBMENU_MAX_ROWS + 28;
  if (!narrow) {
    return /*#__PURE__*/React.createElement("header", {
      onMouseLeave: scheduleClose,
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        paddingBottom: showSubmenu ? submenuSlotH : 0,
        transition: `padding-bottom ${D_CHROME}ms ${EASE_SOFT}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'start',
        padding: '0 32px',
        gap: 32,
        position: 'relative',
        zIndex: 2,
        minHeight: 64
      }
    }, /*#__PURE__*/React.createElement("a", {
      onClick: () => onNavigate('home'),
      style: {
        display: 'flex',
        cursor: 'pointer',
        textDecoration: 'none',
        alignSelf: 'center',
        height: 64,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Lockup, {
      size: 20,
      animated: true,
      sub: lockupSub
    })), /*#__PURE__*/React.createElement("nav", {
      ref: navRef,
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: 36,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": true,
      style: {
        position: 'absolute',
        top: 32,
        height: 1,
        background: 'var(--accent-primary)',
        left: indicator.left,
        width: indicator.width,
        opacity: indicator.opacity,
        transition: `left ${D_INDICATOR}ms ${EASE}, width ${D_INDICATOR}ms ${EASE}, opacity ${D_FADE_OUT}ms ${EASE}`,
        willChange: 'left, width, opacity',
        pointerEvents: 'none'
      }
    }), NAV_MODEL.map(l => {
      const isHover = hoverId === l.id;
      const isActive = activeRoute === l.id;
      const owns = visibleId === l.id && (phase === 'opening' || phase === 'open');
      const isVisible = visibleId === l.id;
      const isShowing = isVisible && (phase === 'opening' || phase === 'open');
      return /*#__PURE__*/React.createElement("div", {
        key: l.id,
        onMouseEnter: () => open(l.id),
        style: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: 64
        }
      }, /*#__PURE__*/React.createElement("a", {
        ref: el => {
          itemRefs.current[l.id] = el;
        },
        onClick: () => onNavigate(l.id),
        style: {
          cursor: 'pointer',
          textDecoration: 'none',
          position: 'relative',
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: isActive || owns || isHover ? 'var(--accent-primary)' : 'var(--fg)',
          transition: `color ${D_FADE_OUT}ms ${EASE}`,
          display: 'inline-block'
        }
      }, l.label), l.submenu && isVisible && /*#__PURE__*/React.createElement(Submenu, {
        items: l.submenu,
        isShowing: isShowing,
        navRef: navRef,
        cellLeft: itemRefs.current[l.id],
        onMouseEnter: () => open(l.id),
        onMouseLeave: scheduleClose
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        alignSelf: 'center',
        height: 64,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "Client portal \u2197"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => onNavigate('contact')
    }, "Start a conversation"))));
  }

  // Narrow layout (unchanged).
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      onNavigate('home');
      setDrawerOpen(false);
    },
    style: {
      display: 'flex',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Lockup, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDrawerOpen(o => !o),
    "aria-label": "Menu",
    style: {
      width: 36,
      height: 36,
      border: '1px solid var(--border-strong)',
      background: 'transparent',
      borderRadius: 4,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 1,
      background: 'var(--fg)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 1,
      background: 'var(--fg)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 1,
      background: 'var(--fg)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: drawerOpen ? 600 : 0,
      overflow: 'hidden',
      transition: `max-height ${D_FADE_IN}ms ${EASE}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 20px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, NAV_MODEL.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.id,
    style: {
      borderTop: '1px solid var(--border)',
      padding: '14px 4px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      onNavigate(l.id);
      setDrawerOpen(false);
    },
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'var(--fg)',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.18em',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", null, l.label), l.sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      fontSize: 10,
      letterSpacing: '0.18em',
      color: 'var(--fg-muted)'
    }
  }, "WRLD \xB7 ", l.sub)), l.submenu && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 300,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--accent-primary)'
    }
  }, l.submenu.map(item => /*#__PURE__*/React.createElement("a", {
    key: item,
    style: {
      cursor: 'pointer'
    }
  }, item))))))));
}
window.Header = Header;

// ─── Submenu ──────────────────────────────────────────────────────────
// Horizontal row of links matching the top-nav type spec.
// Anchoring rules:
//   1. Try to fit starting at the parent link's left edge → nav's right edge.
//   2. If intrinsic width exceeds that gap but fits between nav's left edge
//      and the parent link's right edge → right-align (last item ends at
//      parent link's right edge).
//   3. Otherwise, set width to max-available and let flex-wrap drop to a
//      second row.
function Submenu({
  items,
  isShowing,
  navRef,
  cellLeft,
  onMouseEnter,
  onMouseLeave
}) {
  const ref = React.useRef(null);
  const [anchor, setAnchor] = React.useState({
    side: 'left',
    width: null
  });
  React.useLayoutEffect(() => {
    if (!ref.current || !navRef.current || !cellLeft) return;
    const el = ref.current;
    const navR = navRef.current.getBoundingClientRect();
    const parentR = cellLeft.getBoundingClientRect();

    // Measure intrinsic width by temporarily releasing the wrap constraint.
    const prevWidth = el.style.width;
    const prevFlexWrap = el.style.flexWrap;
    el.style.width = 'max-content';
    el.style.flexWrap = 'nowrap';
    const intrinsic = el.scrollWidth;
    el.style.width = prevWidth;
    el.style.flexWrap = prevFlexWrap;
    const availLeft = navR.right - parentR.left; // L→R from parent
    const availRight = parentR.right - navR.left; // R→L from parent

    if (intrinsic <= availLeft) {
      setAnchor({
        side: 'left',
        width: null
      });
    } else if (intrinsic <= availRight) {
      setAnchor({
        side: 'right',
        width: null
      });
    } else {
      // Wraps. Choose the side with more room and cap width to that side.
      if (availLeft >= availRight) setAnchor({
        side: 'left',
        width: availLeft
      });else setAnchor({
        side: 'right',
        width: availRight
      });
    }
  }, [items, isShowing, navRef, cellLeft]);
  const posStyle = anchor.side === 'right' ? {
    right: 0,
    left: 'auto'
  } : {
    left: 0,
    right: 'auto'
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    "aria-hidden": !isShowing,
    style: {
      position: 'absolute',
      top: '100%',
      ...posStyle,
      paddingTop: 14,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: anchor.side === 'right' ? 'flex-end' : 'flex-start',
      gap: 36,
      rowGap: 10,
      width: anchor.width || undefined,
      maxWidth: navRef.current ? navRef.current.getBoundingClientRect().width : undefined,
      pointerEvents: isShowing ? 'auto' : 'none'
    }
  }, items.map((item, i) => {
    const itemFadeDelay = isShowing ? 60 + i * STAGGER : 0;
    const itemSlideDelay = isShowing ? 40 + i * STAGGER : 0;
    return /*#__PURE__*/React.createElement("a", {
      key: item,
      style: {
        cursor: 'pointer',
        textDecoration: 'none',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--accent-primary)',
        opacity: isShowing ? 1 : 0,
        transform: `translateY(${isShowing ? 0 : -6}px)`,
        transition: `opacity ${isShowing ? D_FADE_IN : D_FADE_OUT}ms ${EASE_SOFT} ${itemFadeDelay}ms,` + `transform ${isShowing ? D_SLIDE_IN : D_SLIDE_OUT}ms ${EASE} ${itemSlideDelay}ms,` + `color ${D_FADE_OUT}ms ${EASE}`,
        willChange: 'transform, opacity',
        whiteSpace: 'nowrap',
        lineHeight: '22px'
      },
      onMouseEnter: e => e.currentTarget.style.color = 'var(--fg)',
      onMouseLeave: e => e.currentTarget.style.color = 'var(--accent-primary)'
    }, item);
  }));
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-tech/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-tech/Hero.jsx
try { (() => {
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '120px 32px 80px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "WRLD \xB7 Tech \xB7 Design \xB7 Support"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: 'clamp(2.5rem, 1.5rem + 4vw, 5rem)',
      lineHeight: 1.05,
      margin: '20px 0 24px',
      maxWidth: 900,
      textWrap: 'balance'
    }
  }, "Your strategic partner in technology and business growth."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 20,
      lineHeight: 1.55,
      color: 'var(--fg-muted)',
      maxWidth: 640,
      margin: '0 0 36px',
      textWrap: 'pretty'
    }
  }, "We're the technology arm of your business \u2014 hosting to hardware to AI, under one roof. Built for SMBs that move fast and expect their tech to keep up."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Start a conversation \u2192"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "See if we're a fit")));
}
window.Hero = Hero;
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-tech/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-tech/ServicesGrid.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ServiceCard({
  sub,
  body,
  href
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'block',
      padding: 24,
      borderRadius: 8,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      textDecoration: 'none',
      color: 'var(--fg)',
      transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
      boxShadow: hover ? 'var(--shadow-md), var(--shadow-accent-primary)' : 'none',
      transform: hover ? 'translateY(-2px)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Lockup, {
    sub: sub,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.55,
      color: 'var(--fg-muted)'
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: hover ? 'var(--accent-primary)' : 'var(--fg-subtle)',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, href.replace('https://', '')), /*#__PURE__*/React.createElement("span", null, "\u2197")));
}
function ServicesGrid() {
  const services = [{
    sub: 'HOST',
    body: 'Clustered, ethically-operated hosting. Reserved for clients and approved partners.',
    href: 'https://wrld.host'
  }, {
    sub: 'DESIGN',
    body: 'Design that ships. We build the sites we design, and we build them to work.',
    href: 'https://wrld.design'
  }, {
    sub: 'AI',
    body: 'Tailored agents tuned by humans who know your operations.',
    href: 'https://wrld.ai'
  }, {
    sub: 'SERVICES',
    body: '24/7 monitoring, patching, and proactive infrastructure care.',
    href: 'https://services.wrld.tech'
  }, {
    sub: 'SUPPORT',
    body: 'Real humans on the other end of every ticket. SLA-backed.',
    href: 'https://support.wrld.tech'
  }, {
    sub: 'PRESS',
    body: 'Premium WordPress hosting with WRLD-tuned plugins.',
    href: 'https://wrld.press'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '64px 32px',
      maxWidth: 1280,
      margin: '0 auto',
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "What we do"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--fg-muted)'
    }
  }, "Six service branches. One partner.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, services.map(s => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: s.sub
  }, s)))));
}
window.ServicesGrid = ServicesGrid;
window.ServiceCard = ServiceCard;
Object.assign(__ds_scope, { ServicesGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-tech/ServicesGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wrld-tech/ValuesStrip.jsx
try { (() => {
function ValuesStrip() {
  const values = [{
    num: '01',
    title: 'Move with urgency',
    body: 'Responsiveness is a feature, not a favor.'
  }, {
    num: '02',
    title: 'Innovation at the edge',
    body: 'Adopt new tools early — but ship, don\u2019t experiment.'
  }, {
    num: '03',
    title: 'Foundational integrity',
    body: 'Transparency is non-negotiable.'
  }, {
    num: '04',
    title: 'Excellence by action',
    body: 'Quality is proved by outcomes, not promises.'
  }, {
    num: '05',
    title: 'Collaboration & humility',
    body: 'Over-communicate. Stay approachable.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 32px',
      maxWidth: 1280,
      margin: '0 auto',
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "How we work"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: 40,
      lineHeight: 1.1,
      margin: '16px 0 40px',
      maxWidth: 720
    }
  }, "Five values, equally weighted. They shape every design and copy decision."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 24
    }
  }, values.map(v => /*#__PURE__*/React.createElement("div", {
    key: v.num,
    style: {
      borderTop: '1px solid var(--fg)',
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-muted)',
      marginBottom: 8
    }
  }, v.num), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: '-0.02em',
      marginBottom: 6
    }
  }, v.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.55,
      color: 'var(--fg-muted)'
    }
  }, v.body)))));
}
window.ValuesStrip = ValuesStrip;
Object.assign(__ds_scope, { ValuesStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wrld-tech/ValuesStrip.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Lockup = __ds_scope.Lockup;

__ds_ns.AgentDetail = __ds_scope.AgentDetail;

__ds_ns.AgentList = __ds_scope.AgentList;

__ds_ns.RunHistory = __ds_scope.RunHistory;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.TopBar = __ds_scope.TopBar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CTA = __ds_scope.CTA;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.ServicesGrid = __ds_scope.ServicesGrid;

__ds_ns.ValuesStrip = __ds_scope.ValuesStrip;

})();
