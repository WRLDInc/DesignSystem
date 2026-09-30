/**
 * wrld-search-agent — reference McpAgent for WRLD projects.
 *
 * Exposes WRLD content as MCP tools through the Cloudflare Agents SDK, with
 * retrieval from AI Search over an `ai_search_namespaces` binding. Copy, rename,
 * add your project's own tools in init(). Guideline: docs/AI_SEARCH_AGENTS.md §6.
 *
 * Verified against the Agents SDK docs (McpAgent + McpAgent.serve) and the
 * AI Search namespace binding docs (env.AI_SEARCH.get(name).search()) on
 * 2026-09-30. Pin package versions on first install.
 */
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/** Bindings declared in wrangler.jsonc. `AiSearchNamespace` comes from @cloudflare/workers-types. */
type Env = {
  AI_SEARCH: AiSearchNamespace;
};

/** The instances this agent may search. Every entry must exist in the bound namespace. */
const INSTANCES = {
  "wrld-tech": { instance: "wereallylovedesign", property: "wrld.tech", covers: "services, pricing philosophy, blog, company" },
  "wrld-help": { instance: "wrld-search", property: "help.wrld.tech", covers: "support articles, how-tos, SLAs, onboarding" },
} as const;

type InstanceKey = keyof typeof INSTANCES;

/** The subset of an AI Search chunk this agent reads. The binding returns the same shape as the public endpoint. */
type Chunk = {
  score?: number;
  text?: string;
  instance_id?: string;
  item?: { key?: string; metadata?: { title?: string; description?: string } };
};

export class WrldSearchMcp extends McpAgent<Env> {
  server = new McpServer({ name: "wrld-search-agent", version: "0.1.0" });

  async init() {
    this.server.tool(
      "search_wrld",
      "Search WRLD Tech Co. content: wrld.tech (services, blog, company) and help.wrld.tech (support articles, SLAs, onboarding). " +
        "Use it when a user asks what WRLD offers, how a WRLD service works, or how to do something in a WRLD product. " +
        "Returns page titles, URLs and excerpts from WRLD content only.",
      {
        query: z.string().min(2).max(500).describe("What to look for, in plain language."),
        property: z.enum(["wrld-tech", "wrld-help"]).optional().describe("Limit to one property. Omit to search wrld.tech."),
        limit: z.number().int().min(1).max(10).optional().describe("Maximum results, default 6."),
      },
      async ({ query, property, limit }) => {
        const key: InstanceKey = property ?? "wrld-tech";
        const target = INSTANCES[key];
        const instance = this.env.AI_SEARCH.get(target.instance);
        const response = (await instance.search({
          messages: [{ role: "user", content: query }],
          ai_search_options: { retrieval: { max_num_results: limit ?? 6 } },
        })) as { chunks?: Chunk[]; result?: { chunks?: Chunk[] } };
        // The binding answers unwrapped; the REST API wraps the same object in `result`. Read both.
        const chunks = response.chunks ?? response.result?.chunks ?? [];
        if (!chunks.length) {
          return { content: [{ type: "text", text: `No WRLD pages matched "${query}" on ${target.property}.` }] };
        }
        const lines = chunks.map((c, i) => {
          const title = c.item?.metadata?.title ?? c.item?.key ?? "Untitled";
          const excerpt = (c.text || c.item?.metadata?.description || "").replace(/\s+/g, " ").trim().slice(0, 400);
          return `${i + 1}. ${title}\n${c.item?.key ?? ""}\n${excerpt}`;
        });
        return { content: [{ type: "text", text: `Results from ${target.property}:\n\n${lines.join("\n\n")}` }] };
      },
    );

    this.server.tool(
      "list_wrld_properties",
      "List the WRLD properties this agent can search and what each one covers. Use it to decide the `property` argument of search_wrld.",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: (Object.keys(INSTANCES) as InstanceKey[])
              .map((k) => `${k}: ${INSTANCES[k].property} — ${INSTANCES[k].covers}`)
              .join("\n"),
          },
        ],
      }),
    );
  }
}

// Streamable HTTP MCP at /mcp. Add `McpAgent.serveSSE("/sse")` only if a legacy client needs it.
export default WrldSearchMcp.serve("/mcp");
