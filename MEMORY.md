# MEMORY.md — Shared Brain (Fupie + Claude)

Both agents read this file. Keep it lean, accurate, and current.

---

## LEARNED RULES
- Clipboard transfers between Cowork sandbox and Mac don't work reliably. Use mounted directories instead.
- Telegram bridge via AppleScript paste is fragile. Use Bot API (telegram_config.json) instead.
- openclaw config set uses space-separated syntax (key value), not equals sign (key=value).
- Always read BUILD_LOOP.md before starting work — it's the single source of truth for tasks.
- John reaches Pela via @Pela10_bot (john_telegram_relay.py). Config: telegram_config_john.json. Daemon runs via launchd plist com.openclaw.john-telegram-relay.plist. John's messages arrive as cowork_typer pastes with prefix "[Incoming message from John via his personal Telegram bot...]". Pela replies by writing bridge msgs from="claude" to="john-telegram". This is live and working — do NOT rebuild it.
- Jolie bridges into Pela via cowork_typer (same mechanism as John's relay). jolie_bridge_watcher.py is her tool for reading/writing the bridge.

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
- **Agent Team**: Scout (research), Quill (outreach), Echo (follow-up), Forge (proposals), Muse (content), Sentinel (reputation), Anvil (code), Jolie (Hermes-side local agent)
- **Channels**: Telegram (primary via Fupie_bot @fupela_bot + Jolie on Hermes)
- **Obsidian**: Bridged between OpenClaw Mac Mini and John's main PC
- **This Mac Mini is Fupie's dedicated machine (shared with Jolie via Hermes)** — John's main work happens on a separate PC
- **Himalaya CLI**: v1.2.0 installed on Mac Mini. Config: ~/.config/himalaya/config.toml. Account: jedaiflow (hello@jedaiflow.com). SMTP working via Gmail App Password. Send command: `himalaya message send -a jedaiflow`

---

## SUBSCRIPTIONS
- **Ollama**: $100/mo plan. Covers Fupie + Jolie on GLM-5.1:cloud. Agent submodels (Scout, Quill, etc.) use local/Ollama models. Gemini Flash planned for routine tasks (free tier, pending API key setup).
- **Claude (Anthropic)**: Pro plan $20/mo + pay-as-you-go. ~$60 credits remaining as of April 2026. Considering Max 5x ($100/mo) upgrade. Pela should ONLY use Opus for high-stakes work.

## OPENCLAW CONFIG
- `agents.defaults.sandbox.mode` = off
- `agents.defaults.subagents.runTimeoutSeconds` = 300
- `agents.defaults.subagents.maxConcurrent` = 3
- `agents.defaults.subagents.maxChildrenPerAgent` = 2
- `tools.loopDetection.enabled` = true

---

## CURRENT STATE (updated 2026-04-17)
- **Jolie (Hermes agent):** Active on bridge. GLM-5.1 on Mac Mini. Sender ID: jolie. Handles social/content/SEO. Has Obsidian vault read + Mac Mini execution. Bridge forwarder updated to forward jolie messages to Telegram.
- **Vibeship:** Landing page LIVE at https://jedaiflow.com/vibeship.html (HTTP 200 confirmed 2026-04-16). Design fixes + Stripe payment links requested by John (Pela's priority). CRITICAL: npm publish NOT YET RUN. John needs to run npm publish. Pela owns LinkedIn article + email announcement.
- **Batch 3:** COMPLETE. All 3 initial emails sent 2026-04-15 via Himalaya/SMTP + 3 follow-ups sent 2026-04-17 (Whatcha Cravin, Boot Shooters TX, Akaweih Law). Follow-up cycle closed.
- **Batch 4:** COMPLETE. Howdy Media outreach sent 2026-04-16. Follow-up due 2026-04-19.
- **Batch 5:** COMPLETE (6 email sends + 1 form-only). Breakfast Klub + Hiatus Spa + Sweat+Soul sent 2026-04-16 via Himalaya. Henry's Home Services + KDRx Pilates + Tahira Medspa + Growth Coach sent 2026-04-17 via Himalaya (Pela polished batch-5-home-services-polished.json). ONESweat (HOT) = form-only, skipped. Follow-ups due 2026-04-19.
- **Pipeline total: 17 sends, 0 replies** (early — statistically need 50+ sends for signal per Pela's analysis). Henry's Home Services is strongest ICP — will pivot conversation with John if it goes cold after follow-up.
- **Social Content (Home Services Pivot):** X pivot tweet posted 2026-04-17 ("We rebuilt our entire site around one offer..."). X bio updated to "24/7 AI Phone Answering for Houston Home Services...". 3 old generic tweets deleted from JedAIFlow account. LinkedIn posting BLOCKED — li_at cookie expired, need fresh cookies from John.
- **Bridge dedup bug:** FIXED 2026-04-15.
- **Site cohesion pass (2026-04-18):** Shipped shared nav+footer shell across jedaiflow.com. New `assets/jf-shell.css` + fenced `<!-- JF:NAV -->` / `<!-- JF:FOOTER -->` blocks on `index.html`, `shipclean/index.html`, `blog/openclaw-claude-mac-workaround.html`. New `/blog/` index page. Every page now nav = Product · Pricing · Blog · ShipClean · [Book demo → /#demo]. Removed ShipClean button from homepage hero (one primary CTA now). Stripe hrefs + `shipclean/thanks.html` + blog canonical + JSON-LD untouched. All 7 URLs confirmed HTTP 200. Commit `ab76fca`.
- **Site cohesion pass 2 (2026-04-21):** Legacy redirects done: `blog.html` → `/blog/`, `offer.html` → `/`, `free.html` → `/free/`. `products/*.html` left as-is (print CSS, no nav/footer per Pela decision). `sitemap.xml` updated: removed legacy URLs, added all blog posts + `/free/` + `/shipclean/`. Commit `d409a08`.
- **Hermes cron jobs (2026-04-21):** All 9 cron jobs switched to `glm-5.1:cloud`. 8/9 showing OK status. "Daily X news scan" (884a348512a9) had empty-response error on last run; will retry at next scheduled time. Main config default still `kimi-k2.6:cloud` but overridden per-job.
- **ElevenLabs agent (2026-04-21):** Agent Maya created (ID: `agent_6601kpq8mfzhf8avgf8h4v27pk56`). Voice set. System prompt + first message ready in Obsidian. **BLOCKED**: No `ELEVENLABS_API_KEY` available in env/config/keychain — needs John to provide key or apply via dashboard.


- **Build Loop**: Operational. Batches 1-3 complete, Batch 4 nearly done (8/9 tasks).
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
- Gmail OAuth refresh token not yet obtained (but Himalaya + App Password working as send path)
- Cowork Typer is slightly flaky (works but occasionally fails, retry succeeds)
- **VibeShip: Landing page NOW LIVE at jedaiflow.com/vibeship.html (HTTP 200). Design fixes + Stripe payment links still needed per John.
- **VibeShip: npm publish NOT YET RUN — John needs to run `npm publish`

---

## BUSINESS DIRECTION
- **Jedaiflow** = AI automation agency for HOME SERVICES (plumbers, HVAC, electricians, landscaping)
- **New brand**: "Ship Clean with Pella" — rebrand from generic Jedaiflow positioning
- **Core product**: AI-powered phone answering + lead follow-up for home service businesses
- **Target**: Houston home services businesses that miss 30-40% of incoming calls
- **Pricing**: ~$499 setup + $199/month per client
- **John's edge**: Worked CS for a plumbing company ~1yr, dad is a plumber. Real domain expertise.
- **Immediate priorities**: (1) Redesign site — dark/minimal/futuristic, one offer, one CTA (2) Build AI phone demo (Bland AI or Twilio+OpenAI) (3) Dogfood on ourselves — we ARE client zero (4) Launch build-in-public social content (5) First 5 clients via phone calls + live demos
- **North star**: Passive income via scalable products/systems
- **John's constraint**: Full-time day job, limited hours per week
- **2026-04-16**: Pivoted from generic AI automation to home services niche. Old outreach (general Houston SMBs) yielded 0 replies — too broad. Now focused on specific offer for specific sector.
- **2026-04-16**: Claude Pro pay-as-you-go credits low (~$60 remaining). Considering Max 5x. Pela should ONLY be invoked for Opus-level work — route everything else to Jolie (free) or Gemini Flash (free).
- **2026-04-16**: Gemini API free tier available — route routine agent tasks to Gemini Flash (1500 RPD free). Setup pending John getting API key.
- **2026-04-16**: VibeShip rebranding to "Ship Clean with Pella." Stripe integration ready. Site needs integration with main jedaiflow.com page.

---

## OPERATING RULES
- **Approval boundary**: John stays in the loop for major business commitments, deal-signing, sensitive client-facing decisions, and other very important high-risk actions.
- **Outreach sending rule**: Pela can send outreach emails without John's pre-approval when he judges them sound, unless there is a glaring reason John should review first (for example awkward wording, risky claims, or something that clearly feels off).
- **Writing stack**: GLM/GPT prepare context, briefs, and drafts. Claude/Opus performs the final human-polish pass for important outreach and persuasive writing.
- **Update routing**: Avoid duplicate updates. Prefer one clean reporting lane, and when Claude's scheduled update system already covers it, let Claude deliver the packaged update to John.
- **Collaboration model**: Fupie coordinates and surfaces what matters, Claude executes heavy lifting and final polish, John remains the front-facing closer when stakes are high.
