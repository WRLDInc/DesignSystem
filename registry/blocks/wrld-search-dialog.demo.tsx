import * as React from "react";
import { WrldSearchDialog, type WrldSearchResult, type WrldChatMessage } from "./wrld-search-dialog";

// The demo never touches the network: 21st's renderer blocks cross-origin
// requests, and the real endpoint only answers WRLD origins. `search` and
// `ask` are mocked with the shapes the endpoint returns.

const PAGES: WrldSearchResult[] = [
  { title: "Managed IT that is explicitly not break-fix", url: "https://wrld.tech/services", description: "24/7 monitoring, patching and proactive infrastructure care.", instance: "wereallylovedesign" },
  { title: "How WRLD.Support tickets are prioritised", url: "https://help.wrld.tech/articles/priority", description: "Priority SLA line for covered clients, response targets by severity.", instance: "wrld-search" },
  { title: "Onboarding checklist for managed endpoints", url: "https://help.wrld.tech/articles/onboarding", description: "What we install, what we monitor, what you keep control of.", instance: "wrld-search" },
  { title: "Design tokens — WRLD.design", url: "https://wrld.design/system", description: "156 tokens, three themes, every one with a usage note.", instance: "wereallylovedesign" },
];

const search = async (query: string): Promise<WrldSearchResult[]> => {
  await new Promise((r) => setTimeout(r, 300));
  const q = query.toLowerCase();
  return PAGES.filter((p) => `${p.title} ${p.description ?? ""}`.toLowerCase().includes(q));
};

const ask = async (_messages: WrldChatMessage[], onDelta: (text: string) => void): Promise<WrldSearchResult[]> => {
  const words = "WRLD.Services covers 24/7 monitoring, patching and proactive infrastructure care for every managed endpoint. Response targets depend on severity, and covered clients have a priority SLA line around the clock.".split(" ");
  for (const w of words) {
    await new Promise((r) => setTimeout(r, 40));
    onDelta(`${w} `);
  }
  return PAGES.slice(0, 2);
};

const frame: React.CSSProperties = {
  minHeight: 560,
  padding: 32,
  background: "var(--wrld-bg, var(--color-background, #ffffff))",
  color: "var(--wrld-fg, var(--color-foreground, #0a0a0a))",
  fontFamily: "var(--wrld-font-body, Ubuntu, system-ui, sans-serif)",
};

const settings = {
  title: "WRLD.AI",
  eyebrow: "Search · Discover · Ask",
  placeholder: "Search WRLD services, guides, and ideas…",
  initialMode: "search" as "search" | "ask",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [open, setOpen] = React.useState(true);
  return (
    <div style={frame}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ padding: "10px 16px", border: "1px solid var(--wrld-border, #e4e4e7)", borderRadius: 9999, background: "transparent", color: "inherit", font: "inherit", cursor: "pointer" }}
      >
        Open WRLD.AI search (⌘K)
      </button>
      <WrldSearchDialog
        open={open}
        onClose={() => setOpen(false)}
        onShortcut={() => setOpen(true)}
        title={s.title}
        eyebrow={s.eyebrow}
        placeholder={s.placeholder}
        initialMode={s.initialMode}
        search={search}
        ask={ask}
      />
    </div>
  );
}
