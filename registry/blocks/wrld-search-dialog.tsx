import * as React from "react";

/**
 * WRLD Search Dialog — the WRLD.AI overlay (Search + Ask WRLD.AI) for React and
 * shadcn hosts, talking to a Cloudflare AI Search public endpoint. Defaults to
 * the WRLD namespace endpoint https://search.wrld.ai, which merges wrld.tech and
 * help.wrld.tech and tags every result with its `instance_id`.
 *
 * Source of truth: github.com/WRLDInc/DesignSystem — deploy/index.html (#aiDialog)
 * Guideline and spec: docs/AI_SEARCH_AGENTS.md §4–§5
 *
 * The host owns `open`, the trigger (WrldSearchTrigger) and the ⌘K listener
 * (wire `onShortcut` to flip `open`). The dialog owns focus, tabs, fetching,
 * streaming and every state's copy. `search` / `ask` can be replaced to route
 * through a same-origin proxy (the wrld.tech pattern) or to mock in a demo.
 *
 * Your origin must be in the endpoint's authorized hosts, or the browser will
 * see the outage state; that list is CORS, not authentication.
 */

const t = {
  bg: "var(--wrld-bg, var(--color-background, #ffffff))",
  bgSubtle: "var(--wrld-bg-subtle, var(--color-muted, #fafafa))",
  bgMuted: "var(--wrld-bg-muted, var(--color-accent, #f4f4f5))",
  bgElevated: "var(--wrld-bg-elevated, var(--color-card, #ffffff))",
  fg: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fgMuted: "var(--wrld-fg-muted, var(--color-muted-foreground, #52525b))",
  fgSubtle: "var(--wrld-fg-subtle, #71717a)",
  fgInverse: "var(--wrld-fg-inverse, var(--color-background, #ffffff))",
  border: "var(--wrld-border, var(--color-border, #e4e4e7))",
  borderStrong: "var(--wrld-border-strong, #d4d4d8)",
  accent: "var(--wrld-accent-primary, #007fee)",
  accentRgb: "var(--wrld-accent-primary-rgb, 0 127 238)",
  danger: "var(--wrld-status-danger, #ef4444)",
  display: "var(--wrld-font-display, Montserrat, 'Helvetica Neue', Arial, sans-serif)",
  body: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
  mono: "var(--wrld-font-mono, 'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, monospace)",
  radiusSm: "var(--wrld-radius-sm, 4px)",
  radiusMd: "var(--wrld-radius-md, 8px)",
  ease: "var(--wrld-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1))",
  duration: "var(--wrld-duration-default, 200ms)",
} as const;

export interface WrldSearchResult {
  title: string;
  url: string;
  description?: string;
  /** AI Search instance the chunk came from, e.g. "wereallylovedesign". */
  instance?: string;
  score?: number;
}

export interface WrldChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type WrldSearchFn = (query: string, signal: AbortSignal) => Promise<WrldSearchResult[]>;
export type WrldAskFn = (
  messages: WrldChatMessage[],
  onDelta: (text: string) => void,
  signal: AbortSignal,
) => Promise<WrldSearchResult[]>;

export interface WrldSearchDialogProps {
  open: boolean;
  onClose: () => void;
  /** Called on ⌘K / Ctrl K while the document has focus; flip `open` here. */
  onShortcut?: () => void;
  /** Cloudflare AI Search public endpoint (instance or namespace). */
  endpoint?: string;
  /** Narrow a namespace endpoint to some of its allowed instances. */
  instanceIds?: string[];
  /** Short labels for the instance chip. */
  instanceLabels?: Record<string, string>;
  maxResults?: number;
  eyebrow?: string;
  title?: string;
  placeholder?: string;
  askPlaceholder?: string;
  /** Where "Talk to WRLD" goes. */
  contactHref?: string;
  /** Replace the network calls (proxy, tests, demos). */
  search?: WrldSearchFn;
  ask?: WrldAskFn;
  initialMode?: "search" | "ask";
  /** Element id, for the trigger's aria-controls. */
  id?: string;
  style?: React.CSSProperties;
}

export const WRLD_SEARCH_ENDPOINT = "https://search.wrld.ai";
export const WRLD_INSTANCE_LABELS: Record<string, string> = {
  wereallylovedesign: "wrld.tech",
  "wrld-search": "help",
};

const COPY = {
  emptyTitle: "What are you looking for?",
  emptyBody: "Find services, guides, and ideas from WRLD.",
  loading: "Searching WRLD…",
  none: "No matching pages",
  searchOutage: "Search is temporarily unavailable. Please try again later or contact WRLD.",
  askTitle: "Ask WRLD.AI",
  askBody: "Ask about our services or explore an idea for your business.",
  askOutage: "WRLD.AI is temporarily unavailable. Please try again later or talk to our team.",
  footer: "Answers from WRLD content. Check sources before acting.",
} as const;

class WrldSearchOutage extends Error {}

/** The public endpoint answers unwrapped; the REST API wraps the same object in `result`. */
export function parseSearchResponse(body: unknown): WrldSearchResult[] {
  const root = (body && typeof body === "object" ? body : {}) as { chunks?: unknown; errors?: unknown; result?: unknown };
  const inner = (root.result && typeof root.result === "object" ? root.result : root) as { chunks?: unknown; errors?: unknown };
  const chunks = Array.isArray(inner.chunks) ? inner.chunks : [];
  const errors = Array.isArray(inner.errors) ? inner.errors : [];
  if (!chunks.length && errors.length) throw new WrldSearchOutage("all instances failed");
  const seen = new Set<string>();
  const out: WrldSearchResult[] = [];
  for (const c of chunks as Array<Record<string, unknown>>) {
    const item = (c.item ?? {}) as { key?: unknown; metadata?: Record<string, unknown> };
    const url = typeof item.key === "string" ? item.key : "";
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const meta = item.metadata ?? {};
    out.push({
      title: typeof meta.title === "string" && meta.title ? meta.title : url.replace(/^https?:\/\//, ""),
      url,
      description: typeof meta.description === "string" ? meta.description : undefined,
      instance: typeof c.instance_id === "string" ? c.instance_id : undefined,
      score: typeof c.score === "number" ? c.score : undefined,
    });
  }
  return out;
}

function makeSearch(endpoint: string, instanceIds: string[] | undefined, max: number): WrldSearchFn {
  return async (query, signal) => {
    const res = await fetch(`${endpoint.replace(/\/$/, "")}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: query }],
        ai_search_options: {
          ...(instanceIds?.length ? { instance_ids: instanceIds } : {}),
          retrieval: { metadata_only: true, max_num_results: max },
        },
      }),
      signal,
    });
    if (!res.ok) throw new WrldSearchOutage(`HTTP ${res.status}`);
    return parseSearchResponse(await res.json());
  };
}

function makeAsk(endpoint: string, instanceIds: string[] | undefined): WrldAskFn {
  return async (messages, onDelta, signal) => {
    const res = await fetch(`${endpoint.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify({
        messages,
        stream: true,
        ...(instanceIds?.length ? { ai_search_options: { instance_ids: instanceIds } } : {}),
      }),
      signal,
    });
    if (!res.ok || !res.body) throw new WrldSearchOutage(`HTTP ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let event = "";
    let sources: WrldSearchResult[] = [];
    const handle = (data: string) => {
      if (data === "[DONE]") return;
      let json: unknown;
      try {
        json = JSON.parse(data);
      } catch {
        return;
      }
      if (event === "chunks") {
        try {
          sources = parseSearchResponse(json);
        } catch {
          /* an empty chunks frame is not an outage once the model answers */
        }
        return;
      }
      const delta = (json as { choices?: Array<{ delta?: { content?: string } }> }).choices?.[0]?.delta?.content;
      if (delta) onDelta(delta);
    };
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).replace(/\r$/, "");
        buffer = buffer.slice(nl + 1);
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) handle(line.slice(5).trim());
        else if (line === "") event = "";
      }
    }
    return sources;
  };
}

const Icon = ({ d, size = 16 }: { d: React.ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d}
  </svg>
);
const SEARCH = (
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>
);
const ASK = (
  <>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 7v6M9 10h6" />
  </>
);
const CLOSE = <path d="M18 6 6 18M6 6l12 12" />;

function IconButton({
  label,
  children,
  onClick,
  autoFocus,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  autoFocus?: boolean;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      autoFocus={autoFocus}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        padding: 0,
        border: `1px solid ${hover ? t.accent : t.borderStrong}`,
        borderRadius: t.radiusSm,
        background: "transparent",
        color: hover ? t.accent : t.fg,
        cursor: "pointer",
        transition: `color ${t.duration} ${t.ease}, border-color ${t.duration} ${t.ease}`,
      }}
    >
      {children}
    </button>
  );
}

export function WrldSearchDialog({
  open,
  onClose,
  onShortcut,
  endpoint = WRLD_SEARCH_ENDPOINT,
  instanceIds,
  instanceLabels = WRLD_INSTANCE_LABELS,
  maxResults = 10,
  eyebrow = "Search · Discover · Ask",
  title = "WRLD.AI",
  placeholder = "Search WRLD services, guides, and ideas…",
  askPlaceholder = "What would you like to know?",
  contactHref = "https://wrld.tech/contact",
  search,
  ask,
  initialMode = "search",
  id = "wrld-search-dialog",
  style,
}: WrldSearchDialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const askRef = React.useRef<HTMLTextAreaElement>(null);
  const returnTo = React.useRef<HTMLElement | null>(null);
  const [mode, setMode] = React.useState<"search" | "ask">(initialMode);

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<WrldSearchResult[]>([]);
  const [searchState, setSearchState] = React.useState<"idle" | "loading" | "ok" | "empty" | "outage">("idle");

  const [messages, setMessages] = React.useState<WrldChatMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [streaming, setStreaming] = React.useState("");
  const [sources, setSources] = React.useState<WrldSearchResult[]>([]);
  const [askState, setAskState] = React.useState<"idle" | "loading" | "outage">("idle");

  const doSearch = React.useMemo(() => search ?? makeSearch(endpoint, instanceIds, maxResults), [search, endpoint, instanceIds, maxResults]);
  const doAsk = React.useMemo(() => ask ?? makeAsk(endpoint, instanceIds), [ask, endpoint, instanceIds]);

  // Native <dialog> open/close, scroll lock, focus return.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      returnTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      el.showModal();
      window.setTimeout(() => (mode === "ask" ? askRef.current : inputRef.current)?.focus(), 0);
      return () => {
        document.documentElement.style.overflow = prev;
      };
    }
    if (!open && el.open) {
      el.close();
      returnTo.current?.focus();
    }
    return undefined;
  }, [open, mode]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      if (open) onClose();
      else onShortcut?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onShortcut]);

  // Debounced search.
  React.useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearchState("idle");
      return undefined;
    }
    const ctl = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchState("loading");
      try {
        const r = await doSearch(q, ctl.signal);
        if (ctl.signal.aborted) return;
        setResults(r);
        setSearchState(r.length ? "ok" : "empty");
      } catch (err) {
        if (ctl.signal.aborted) return;
        setResults([]);
        setSearchState(err instanceof WrldSearchOutage ? "outage" : "outage");
      }
    }, 350);
    return () => {
      ctl.abort();
      window.clearTimeout(timer);
    };
  }, [query, doSearch]);

  const send = async () => {
    const text = draft.trim();
    if (!text || askState === "loading") return;
    const next: WrldChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setDraft("");
    setStreaming("");
    setSources([]);
    setAskState("loading");
    const ctl = new AbortController();
    let acc = "";
    try {
      const s = await doAsk(
        next,
        (d) => {
          acc += d;
          setStreaming(acc);
        },
        ctl.signal,
      );
      setSources(s);
      setMessages([...next, { role: "assistant", content: acc }]);
      setStreaming("");
      setAskState("idle");
    } catch {
      setAskState("outage");
    }
  };

  const tab = (m: "search" | "ask", label: string, icon: React.ReactNode) => {
    const on = mode === m;
    return (
      <button
        key={m}
        type="button"
        role="tab"
        aria-selected={on}
        aria-controls={`${id}-${m}`}
        tabIndex={on ? 0 : -1}
        onClick={() => setMode(m)}
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            setMode(m === "search" ? "ask" : "search");
          }
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          marginBottom: on ? -1 : 0,
          background: on ? t.bgElevated : "transparent",
          border: `1px solid ${on ? `color-mix(in srgb, ${t.borderStrong} 78%, ${t.accent} 22%)` : "transparent"}`,
          borderBottom: on ? `1px solid ${t.bgElevated}` : 0,
          borderRadius: `${t.radiusSm} ${t.radiusSm} 0 0`,
          font: "inherit",
          fontSize: 15,
          lineHeight: 1.2,
          color: on ? t.fg : t.fgMuted,
          cursor: "pointer",
        }}
      >
        <i
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            border: "1px solid currentColor",
            borderRadius: t.radiusSm,
            fontStyle: "normal",
          }}
        >
          <Icon d={icon} size={14} />
        </i>
        <span>{label}</span>
      </button>
    );
  };

  const chip = (instance?: string) =>
    instance ? (
      <span
        style={{
          font: `10px ${t.mono}`,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: t.fgMuted,
          border: `1px solid ${t.border}`,
          borderRadius: 3,
          padding: "2px 6px",
          whiteSpace: "nowrap",
          alignSelf: "start",
        }}
      >
        {instanceLabels[instance] ?? instance}
      </span>
    ) : null;

  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${t.border}`,
    borderRadius: t.radiusSm,
    background: t.bg,
    color: t.fg,
    fontFamily: t.body,
    fontSize: 14,
    outline: "none",
  };

  return (
    <dialog
      id={id}
      ref={ref}
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target !== ref.current) return;
        const r = ref.current.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose();
      }}
      style={{
        padding: 0,
        margin: "auto",
        width: "min(820px, calc(100vw - 1.25rem))",
        maxWidth: "none",
        maxHeight: "calc(100dvh - 1.25rem)",
        border: `1px solid color-mix(in srgb, ${t.borderStrong} 82%, ${t.accent} 18%)`,
        borderRadius: t.radiusMd,
        background: `color-mix(in srgb, ${t.bg} 92%, transparent)`,
        color: t.fg,
        boxShadow: `0 26px 80px -32px rgb(${t.accentRgb} / 0.28), 0 12px 32px rgb(0 0 0 / 0.12)`,
        fontFamily: t.body,
        backdropFilter: "blur(18px)",
        overscrollBehavior: "contain",
        flexDirection: "column",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 16px 12px" }}>
        <div>
          <div style={{ fontFamily: t.mono, fontSize: 12, letterSpacing: ".1em", color: t.fgMuted }}>{eyebrow}</div>
          <h2 id={`${id}-title`} style={{ margin: "2px 0 0", fontFamily: t.display, fontWeight: 600, fontSize: 20, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            {title}
          </h2>
        </div>
        <IconButton label="Close WRLD.AI search" onClick={onClose} autoFocus>
          <Icon d={CLOSE} size={18} />
        </IconButton>
      </div>

      <div role="tablist" aria-label="WRLD.AI mode" style={{ display: "flex", gap: 8, padding: "0 16px", borderBottom: `1px solid ${t.border}` }}>
        {tab("search", "Search", SEARCH)}
        {tab("ask", "Ask WRLD.AI", ASK)}
      </div>

      <div role="status" aria-live="polite" style={{ padding: "12px 16px", color: t.fgMuted, fontSize: 13 }} hidden={!(mode === "search" ? searchState === "outage" : askState === "outage")}>
        {mode === "search" ? COPY.searchOutage : COPY.askOutage}{" "}
        <a href={contactHref} style={{ marginLeft: 12, color: t.fg, textDecoration: "underline", textUnderlineOffset: 2 }}>
          Talk to WRLD
        </a>
      </div>

      <section id={`${id}-search`} role="tabpanel" hidden={mode !== "search"} style={{ minHeight: 220, overflow: "auto", flex: 1, padding: "12px 16px 16px" }}>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search WRLD"
          autoComplete="off"
          style={input}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = t.accent;
            e.currentTarget.style.boxShadow = `0 0 0 3px rgb(${t.accentRgb} / 0.28)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = t.border;
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {searchState === "idle" && (
            <div style={{ padding: "28px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: t.display, fontWeight: 600, fontSize: 16, letterSpacing: "-0.02em" }}>{COPY.emptyTitle}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: t.fgMuted }}>{COPY.emptyBody}</div>
            </div>
          )}
          {searchState === "loading" && <div style={{ padding: "16px 8px", fontSize: 13, color: t.fgMuted }}>{COPY.loading}</div>}
          {searchState === "empty" && <div style={{ padding: "16px 8px", fontSize: 14, color: t.fgMuted }}>{COPY.none}</div>}
          {searchState === "ok" &&
            results.map((r) => (
              <a
                key={r.url}
                href={r.url}
                onClick={onClose}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "2px 10px",
                  padding: "8px 10px",
                  borderRadius: t.radiusSm,
                  color: "inherit",
                  textDecoration: "none",
                  transition: `background ${t.duration} ${t.ease}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = t.bgMuted)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ gridRow: "1 / span 3" }}>{chip(r.instance)}</div>
                <div style={{ gridColumn: 1, fontFamily: t.mono, fontSize: 11, color: t.fgSubtle }}>{r.url.replace(/^https?:\/\//, "")}</div>
                {r.description && <div style={{ gridColumn: 1, fontSize: 13, lineHeight: 1.4, color: t.fgMuted }}>{r.description}</div>}
              </a>
            ))}
        </div>
      </section>

      <section id={`${id}-ask`} role="tabpanel" hidden={mode !== "ask"} style={{ display: mode === "ask" ? "flex" : "none", flexDirection: "column", minHeight: 220, height: "min(540px, 58dvh)", flex: "0 1 auto" }}>
        <div style={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>
          {messages.length === 0 && !streaming && (
            <div style={{ padding: "28px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: t.display, fontWeight: 600, fontSize: 16, letterSpacing: "-0.02em" }}>{COPY.askTitle}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: t.fgMuted }}>{COPY.askBody}</div>
            </div>
          )}
          {sources.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  style={{ display: "inline-flex", gap: 6, alignItems: "center", font: `11px ${t.mono}`, color: t.fgMuted, border: `1px solid ${t.border}`, borderRadius: 3, padding: "3px 7px", textDecoration: "none" }}
                >
                  {s.instance && <b style={{ font: `10px ${t.mono}`, letterSpacing: ".08em", textTransform: "uppercase", color: t.fgSubtle, fontWeight: 400 }}>{instanceLabels[s.instance] ?? s.instance}</b>}
                  {s.url.replace(/^https?:\/\//, "")}
                </a>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                margin: "0 0 12px",
                marginLeft: m.role === "user" ? "auto" : 0,
                maxWidth: "88%",
                padding: "10px 12px",
                borderRadius: t.radiusSm,
                background: m.role === "user" ? t.bgMuted : t.bg,
                border: m.role === "user" ? "none" : `1px solid ${t.border}`,
                fontSize: 14,
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          ))}
          {(streaming || askState === "loading") && (
            <div style={{ maxWidth: "88%", padding: "10px 12px", borderRadius: t.radiusSm, background: t.bg, border: `1px solid ${t.border}`, fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
              {streaming || COPY.loading}
              <span aria-hidden="true" style={{ display: "inline-block", width: 7, height: 15, background: t.fg, verticalAlign: -2, marginLeft: 2 }} />
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          style={{ display: "flex", gap: 8, padding: "10px 16px", borderTop: `1px solid ${t.border}`, alignItems: "flex-end" }}
        >
          <textarea
            ref={askRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder={askPlaceholder}
            aria-label="Your question for WRLD.AI"
            rows={1}
            style={{ ...input, resize: "none", minHeight: 40 }}
          />
          <button
            type="submit"
            disabled={askState === "loading" || !draft.trim()}
            style={{
              padding: "10px 14px",
              background: t.fg,
              color: t.fgInverse,
              border: `1px solid ${t.fg}`,
              borderRadius: t.radiusSm,
              fontFamily: t.body,
              fontSize: 14,
              fontWeight: 500,
              cursor: askState === "loading" || !draft.trim() ? "default" : "pointer",
              opacity: askState === "loading" || !draft.trim() ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </form>
      </section>

      <footer style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderTop: `1px solid ${t.border}`, color: t.fgMuted, fontSize: 12 }}>
        <span>{COPY.footer}</span>
        <span>
          <kbd style={{ fontFamily: t.mono }}>Esc</kbd> to close
        </span>
      </footer>
    </dialog>
  );
}
