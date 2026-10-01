# WRLD Design System — how Claude works here

Read `README.md` first. It is the source of truth for entity naming, tone, visual foundations and iconography. `brand/CLAUDE.md` is the master brand brief, `SKILL.md` is the `wrld-design` skill, and `docs/CONTRIBUTING.md` sets the review bar. Nothing in this file overrides those; it only says how Claude should operate inside the repo.

## Tooling that ships with the checkout

`.claude/settings.json` registers the `typesafe-ai` marketplace and enables the `typesafe@typesafe-ai` plugin for everyone who opens this repo in Claude Code. The plugin installs on first launch; nothing else is required. It provides the `typesafe:typesafe-ai` skill: System One models (Jev) that turn a question plus application state into a typed judgment — a Choice, a Noul (a yes/no probability) or a Score — rather than free text.

## When to reach for TypeSafe here

Use it wherever the repo needs a semantic judgment that ordinary code cannot make, and keep every rule, lookup and calculation in code. Invoke the skill before designing an integration; it points at the live docs (`https://docs.typesafe.ai/llms.txt`), which are the source of truth for the API, the SDKs and the question guidance.

| Task | Shape of the judgment | Notes |
| --- | --- | --- |
| Design review of a mock, component or page | One Noul per brand rule: monochrome static surfaces, accents interactive-only, sentence case, no emoji as iconography, radius 8px or tighter, Lucide at 1.5px stroke, Montserrat and Ubuntu only | Ask every rule over the same state in one request. Code aggregates; a single serious violation blocks regardless of the average. |
| Copy and tone review | Score against the tone dial for the target sub-brand; one Noul per anti-pattern ("unlimited", "revolutionary", competitor names, "IT guy") | Score levels must describe concrete copy, not adjectives. |
| Adherence lint triage (`_adherence.oxlintrc.json`) | Noul: is this raw hex, px or font literal a legitimate exception? | Rank warnings for a reviewer; never auto-suppress. |
| Consumer and issue triage (`docs/CONSUMERS.md`, GitHub issues) | Choice: token change, atom, block, docs or out of scope; Score: urgency | Include a no-match outcome. |
| PR routing | Choice: feat, fix, docs or chore; Noul: touches a path that needs Ridgeway's review | Routing only. The table in `docs/CONTRIBUTING.md` remains the policy. |
| Registry curation | Choice: `registry/ui` atom or `registry/blocks` section; tag selection | Select from the tags already in `registry/manifest.json`; do not invent new ones. |

## Guardrails

- Judgments inform; people decide. `brand/*.md`, `tokens/*` and `assets/logos/*` change only with Ridgeway's approval, whatever a score says.
- Confidence describes distribution concentration, not permission to act. Validate thresholds on real WRLD surfaces before relying on them, and send low-confidence or failing cases to a person.
- Keep raw judgments reusable. Store them, then let code apply weights and thresholds so a policy change does not rerun inference.
- Credentials stay out of the repo. Read the TypeSafe key from the environment; never commit it and never ship it to a browser.
- Do not add TypeSafe calls to the published site, the registry ports or the UI kits. The design system is a static artifact; TypeSafe is a review and triage tool around it.
