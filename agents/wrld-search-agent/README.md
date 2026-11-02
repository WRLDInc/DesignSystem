# wrld-search-agent — reference McpAgent for WRLD projects

A copy-and-rename skeleton for a Cloudflare Agent that exposes WRLD content as
MCP tools, built with the [Agents SDK](https://developers.cloudflare.com/agents/)
on top of an `ai_search_namespaces` binding. It is the "build from here" that
`docs/AI_SEARCH_AGENTS.md` §6 points at. It is **not** a deployed service and it
is not part of the wrld.design build.

When you only need "let an assistant search our content", you do not need this:
point the client at `https://search.wrld.ai/mcp` (`.mcp.json` here shows how).
Use this skeleton when a project needs its own tools next to search — open a
ticket, look up a plan, read a status page — with per-session state.

## Files

| File | What it is |
| --- | --- |
| `wrangler.jsonc` | Durable Object binding + SQLite migration for the agent class, `ai_search_namespaces` binding with `remote: true`, observability on. |
| `src/index.ts` | `WrldSearchMcp extends McpAgent` with two tools: `search_wrld` (queries an instance, returns titles, URLs and excerpts as text) and `list_wrld_properties`. Exported through `McpAgent.serve("/mcp")`. |
| `.mcp.json` | How a client registers the hosted namespace endpoint and, once deployed, this agent. |
| `package.json` | Dependencies without pinned versions on purpose — pin them on first install (`npm install` writes the lockfile) and keep them pinned. |

## Adopt it

```bash
cp -r agents/wrld-search-agent ../my-project-agent && cd ../my-project-agent
npm install                       # pins versions in package-lock.json
npx wrangler dev                  # needs CLOUDFLARE_API_TOKEN: the AI Search binding is remote-only
npx wrangler deploy
```

Then:

1. Rename `WrldSearchMcp` and the Worker `name`; keep the Durable Object migration tag in step with the class name.
2. Change `INSTANCES` to the instances your project may search (they must exist in the bound namespace).
3. Add your own tools in `init()`. Names are `snake_case` verbs with a `wrld` prefix where they leave the project; descriptions say what system the tool reaches and when to use it. Results are text with the URL on its own line.
4. Declare every binding in `wrangler.jsonc` — never only in the dashboard (a dashboard-only binding is a destructive diff on the next deploy).
5. Put people-facing tools behind Cloudflare Access or the WRLD identity flow in `auth.md`; never behind an API token baked into the agent.

Verify with any MCP client, or:

```bash
curl -s https://<worker>.wrldtech.workers.dev/mcp -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```
