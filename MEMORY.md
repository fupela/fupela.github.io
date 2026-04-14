# MEMORY.md — Shared Brain (Fupie + Claude)

Both agents read this file. Keep it lean, accurate, and current.

---

## LEARNED RULES
- Clipboard transfers between Cowork sandbox and Mac don't work reliably. Use mounted directories instead.
- Telegram bridge via AppleScript paste is fragile. Use Bot API (telegram_config.json) instead.
- openclaw config set uses space-separated syntax (key value), not equals sign (key=value).
- Always read BUILD_LOOP.md before starting work — it's the single source of truth for tasks.

---

## KEY DECISIONS
- **2026-04-13**: Set up Claude + Fupie autonomous build loop. Claude = code/architecture, Fupie = ops/QA/deploys/triggering.
- **2026-04-13**: Telegram is primary messaging channel for the build loop (Bot API via Fupie_bot).
- **2026-04-13**: macOS-native automation (AppleScript/osascript) for desktop control.
- **2026-04-13**: Bridge at `/Users/fupie/.openclaw/workspace/projects/agent-hq/mcp-bridge/messages.json`
- **2026-04-13**: John grants Claude authority to make efficiency improvements to the system without asking first.
- **2026-04-13**: Goal is lead generation and social media execution via the agent team, building toward passive income.
- **2026-04-13**: Writing workflow rule, GLM/GPT can prep and execute drafts, but Claude/Opus should do final quality polish for high-stakes human-facing writing, especially outreach emails and anything that needs to sound natural and human.
- **2026-04-13**: John wants final human involvement on very important items, especially deal-signing or anything front-facing with meaningful business risk.
- **2026-04-13**: Prefer non-redundant updates. If Claude already owns a scheduled update lane, route those updates through him instead of duplicating them from Fupie.

---

## INFRASTRUCTURE
- **OpenClaw Gateway**: localhost:18789, workspace at `/Users/fupie/.openclaw/workspace`
- **MCP Bridge**: `/Users/fupie/.openclaw/workspace/projects/agent-hq/mcp-bridge/messages.json`
- **Cowork Typer**: `/Users/fupie/.openclaw/workspace/projects/agent-hq/scripts/cowork_typer.py`
- **Bridge-to-Telegram**: `/Users/fupie/.openclaw/workspace/projects/agent-hq/scripts/bridge_to_telegram.py` (Bot API mode)
- **Telegram Config**: `/Users/fupie/.openclaw/workspace/projects/agent-hq/scripts/telegram_config.json`
- **Watchdog**: `/Users/fupie/.openclaw/watchdog.sh`
- **Agent Team**: Scout (research), Quill (outreach), Echo (follow-up), Forge (proposals), Muse (content), Sentinel (reputation), Anvil (code)
- **Channels**: Telegram (primary via Fupie_bot @fupela_bot)
- **Obsidian**: Bridged between OpenClaw Mac Mini and John's main PC
- **This Mac Mini is Fupie's dedicated machine** — John's main work happens on a separate PC

---

## OPENCLAW CONFIG
- `agents.defaults.sandbox.mode` = off
- `agents.defaults.subagents.runTimeoutSeconds` = 300
- `agents.defaults.subagents.maxConcurrent` = 3
- `agents.defaults.subagents.maxChildrenPerAgent` = 2
- `tools.loopDetection.enabled` = true

---

## CURRENT STATE
- **Build Loop**: Operational. Batch 1 complete, Batch 2 active (Echo fix and infrastructure health check completed, waiting on Claude to write Batch 3 after latest sync).
- **Sandbox Mode**: Fixed (off)
- **Cowork Typer**: Working (Fupie -> Claude)
- **Bridge-to-Telegram**: Working (Bot API mode)
- **Watchdog**: Running via launchd
- **Mission Control**: Running on port 3000 (HTTP 200). `.env.local` partially configured (Sheet IDs filled, private key + Gmail creds pending)
- **Claude's Name**: Pela (Team Cowork)
- **Custom Skills Installed**: build-loop-ops, fupie-session-boot, lead-pipeline, openclaw-agent-team
- **Scheduled Tasks**: build-loop-check (every 2 hours), morning-briefing (daily 7am)
- **Cowork Integrations**: HubSpot CRM, MailerLite, Slack, Gamma, Gmail, Google Calendar, Stripe, Google Drive, Cloudflare, Make.com, Chrome Extension, Notion
- **Integration Routing**: Fupie's agents handle research/writing/content; Pela handles all external API calls (CRM, email, payments, web browsing, presentations)
- **Agent Roster Health**: Scout, Quill, Echo, Forge, Muse, Sentinel, and Anvil all responding after Echo moved from `ollama/kimi-k2.5:cloud` to `openrouter/google/gemma-4-31b-it`.
- **Site Health**: `jedaiflow.com` resolving with HTTP 200. Gumroad storefront `jediquest77.gumroad.com` returning HTTP 200.
- **Product Sprint**: PIVOTED — "The OpenClaw + Claude Cowork Operator Stack Guide" — replaces the generic "Dual-Model Operator Guide." New angle: Anthropic cut off Claude subscriptions from OpenClaw on April 4 2026; guide covers API setup, OpenClaw model config, Cowork as the second agent, bridge architecture, cost optimization, 7-prompt pack. PDF built, social posts rewritten, Notion page updated. Launch price ~$12. Awaiting Gumroad login from John to complete listing.
- **Cowork Context (CRITICAL — read this)**: Claude Cowork (Pela) is not just a tool John uses — it IS the second agent in John's two-agent setup. Fupie (OpenClaw) = ops/research/content/code side. Pela (Cowork) = strategy/quality/external APIs side. The bridge between them IS the product being documented. When John asks about products, content, or workflows, always frame answers in the context of this specific OpenClaw + Cowork stack — not generic "GPT vs Claude" framing. John confirmed this context was missing from earlier product work and wants it explicitly understood going forward.

---

## ACTIVE PROBLEMS
- Google Cloud org policy may block service account key download
- Gmail OAuth refresh token not yet obtained
- Cowork Typer is slightly flaky (works but occasionally fails, retry succeeds)
- Main agent primary model (ollama/glm-5.1:cloud) times out — fix sent to Fupie: swap to openai-codex/gpt-5.4

---

## BUSINESS DIRECTION
- **Jedaiflow** = AI automation agency for small biz, creators, solopreneurs
- **Immediate priority**: Lead generation + social media presence
- **North star**: Passive income via scalable products/systems
- **John's constraint**: Full-time day job, limited hours per week

---

## OPERATING RULES
- **Approval boundary**: John stays in the loop for major business commitments, deal-signing, sensitive client-facing decisions, and other very important high-risk actions.
- **Writing stack**: GLM/GPT prepare context, briefs, and drafts. Claude/Opus performs the final human-polish pass for important outreach and persuasive writing.
- **Update routing**: Avoid duplicate updates. Prefer one clean reporting lane, and when Claude's scheduled update system already covers it, let Claude deliver the packaged update to John.
- **Collaboration model**: Fupie coordinates and surfaces what matters, Claude executes heavy lifting and final polish, John remains the front-facing closer when stakes are high.
