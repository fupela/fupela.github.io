# BUILD_LOOP.md — Autonomous Task Tracker

## How The Loop Works

1. **Claude** plans a batch of 5-8 tasks, tags each one `[CLAUDE]` or `[AGENT]`
2. **Fupie** wakes up, reads this file, picks the next unchecked item
3. If it's `[AGENT]` → Fupie does it
4. If it's `[CLAUDE]` → Fupie triggers Claude via Cowork Typer
5. When the batch is done, Fupie triggers Claude to write the next batch
6. **The loop never stops.** If all tasks are done, trigger Claude immediately.

## Task Format
```
- [ ] [CLAUDE] Description of what Claude should build
- [ ] [AGENT] Description of what Fupie should do
- [x] [AGENT] Completed task (checked off)
```

## QA Checklist (run on every completed build task)
- [ ] `git diff` — verify real changes
- [ ] Syntax check — linter for file type
- [ ] File comparison — output matches request
- [ ] Deploy test — load URL / run test request if applicable

## Escalation Rules
- Loop stalled 30+ min → alert John via Telegram
- Task failed 3x → skip, log, move on, notify John
- Claude unresponsive 15+ min → dead man's switch → alert John

---

## BATCH 1 — Build Loop Infrastructure

Goal: Get the Claude ↔ Fupie autonomous loop running end-to-end.

- [x] [AGENT] Verify Python 3 is installed (`python3 --version`). If missing, install via Homebrew.
- [x] [AGENT] Verify project directories exist: `~/.openclaw/workspace/projects/agent-hq/{mcp-bridge,scripts,logs}`
- [x] [AGENT] Verify MCP bridge file: `messages.json` is valid JSON with a `messages` array (active bridge already contains test traffic).
- [x] [AGENT] Test `cowork_typer.py` — write "Build loop test" to `cowork_prompt.txt`, run the typer, verify it appears in Claude Desktop
- [x] [AGENT] Test `bridge_to_telegram.py` — write a test bridge message, verify it appears in Telegram
- [x] [AGENT] Full loop test: write bridge msg → verify Telegram receives it → respond via Cowork Typer → verify Claude receives it
- [x] [AGENT] Verify watchdog is running: `launchctl list | grep openclaw`
- [x] [AGENT] Report Batch 1 results to Claude via Cowork Typer. If all pass, ask Claude for Batch 2.

---

## BATCH 2 — Agent Team Activation & First Real Work

Goal: Verify OpenClaw agents work (sandbox mode is now off), initialize git, and get the agent team doing real Jedaiflow work.

- [x] [AGENT] Test that OpenClaw agents respond without the sandbox error. Webchat responds correctly (`MAIN_OK` seen twice), so the old Docker/sandbox crash is gone. Remaining issue is specific to the CLI/gateway invocation path, which still times out and was escalated to Claude via bridge for diagnosis.
- [x] [AGENT] Initialize git in the workspace if not already a repo: workspace was already a git repo, so Fupie committed the current uncommitted state as `2ea551b` (`Commit workspace state for batch 2`).
- [x] [AGENT] Test each agent team member (Scout, Quill, Echo, Forge, Muse, Sentinel, Anvil) by sending a brief "status check" message to each via their OpenClaw channels. Results: Scout, Quill, Forge, Muse, Sentinel, and Anvil all replied correctly. Echo (`follow-up`) timed out at 45s with no output. Reported to bridge for Claude review.
- [x] [CLAUDE] Review the agent team test results from Fupie. For any agents that failed, diagnose and fix the configuration. Write fixes to the bridge for Fupie to apply. **DONE**: Echo (follow-up) timeout diagnosed — model was set to `ollama/kimi-k2.5:cloud` (local, flaky). Fix sent to bridge: swap to `openrouter/google/gemma-4-31b-it` via `openclaw config set agents.list[3].model openrouter/google/gemma-4-31b-it`.
- [x] [AGENT] Apply any fixes Claude sent for broken agents. Re-test the fixed agents and confirm they respond. Report final agent roster status to bridge. Echo fix applied by switching `agents.list[3].model` to `openrouter/google/gemma-4-31b-it`, restarting the gateway, and re-testing successfully (`ECHO_OK`). Full specialist roster is now responding.
- [x] [AGENT] Run a health check on the Jedaiflow infrastructure: check if the dev server on port 3000 is running, check Gumroad status, check if jedaiflow.com resolves. Results: Mission Control on port 3000 returned HTTP 200, `https://jediquest77.gumroad.com` returned HTTP 200, and `https://jedaiflow.com` returned HTTP 200. Logged to MEMORY.md under CURRENT STATE.
- [x] [CLAUDE] Based on the infrastructure health check and working agent roster, write Batch 3 with the first real Jedaiflow business tasks (website, outreach, content, or whatever is highest priority based on MEMORY.md and current state). **DONE** — Batch 3 written below. Focus: lead gen + social execution around the OpenClaw + Cowork stack guide launch.
- [x] [AGENT] Move completed Batch 1 to BATCH HISTORY with timestamp. Confirm Batch 2 is active. Report to bridge and trigger Claude if any [CLAUDE] tasks are ready. **DONE** — Batch 1 already in history; Batch 2 ran to completion and is being moved below.

---

## BATCH 3 — First Revenue Batch: Lead Gen + Social Launch

Goal: Put the working agent roster on real Jedaiflow revenue work. Scout fills the top of the pipeline, Quill drafts outreach, Pela polishes and sends, Muse/Sentinel handle social + reputation around the OpenClaw + Cowork stack guide launch (live on Gumroad at https://jediquest77.gumroad.com/l/cqmqg).

Context Pela is carrying:
- Product is live on Gumroad, awaiting the SEO blog article deploy (parked — Pela will handle via Cloudflare MCP when John confirms hosting path).
- Social posts are staged in Notion; they publish after the blog goes live.
- Integration routing: agents research/draft, Pela handles all external APIs (HubSpot, Gmail, MailerLite, Slack, Chrome, Cloudflare).
- Writing stack: GLM/GPT drafts, Opus (Pela) does final human-polish pass on anything public-facing.

- [ ] [AGENT] Scout: find 10 Houston SMB leads that match the Jedaiflow ICP (small businesses, creators, solopreneurs — restaurants/food trucks, home services, boutique fitness, independent professionals). For each lead capture: business name, owner/decision-maker name if discoverable, website, category, a specific reason they'd benefit from AI automation (one sentence). Write results to `leads/batch-3-houston-smb.md`. Don't worry about emails yet — that's the next step.
- [ ] [AGENT] Scout: for the 10 leads above, find a best-guess business email or contact form URL for each. Use public web sources only. If no email is found, mark as "contact form" with the URL. Append to `leads/batch-3-houston-smb.md`.
- [ ] [CLAUDE] Pela review: score the 10 leads HOT/WARM/COOL using the lead-pipeline skill. Push HOT + WARM into HubSpot via MCP (new contacts with company + reason-to-engage in notes). Report pushed count + any skipped leads back to bridge.
- [ ] [AGENT] Quill: draft a cold outreach email to the top 3 HOT leads (Pela will flag them in bridge after the scoring step). Each draft: short, specific, references the actual business and the specific automation angle Scout identified. No generic templates. Write drafts to `outreach/batch-3-drafts.md` in separate labeled blocks.
- [ ] [CLAUDE] Pela final-polish pass on the 3 outreach drafts (Opus-level human tone), then queue them as Gmail drafts (not sent — John reviews and sends, per approval-boundary rule). Confirm back to bridge with Gmail draft IDs or the link to review.
- [ ] [AGENT] Muse: draft 3 short-form social posts for the OpenClaw + Cowork stack guide — one X/Twitter post, one LinkedIn post, one Reddit-style long-form post. Angle: the two-agent setup, not a "tool vs tool" framing. Hook on the April 4 Anthropic subscription cutoff. Write to `content/stack-guide-launch-social.md`.
- [ ] [AGENT] Sentinel: first reputation scan — Google "Jedaiflow" + "OpenClaw Cowork" on the open web, check for mentions on Reddit/X/HN. Write findings to `reputation-monitor/scan-001.md`. Flag anything actionable.
- [ ] [CLAUDE] Pela: final polish on the 3 social drafts, stage them in the Notion launch page (don't publish yet — waiting on blog article live). Report Notion links and stagedness back to bridge. Then trigger Fupie to start Batch 4 planning.

---

## BATCH HISTORY
(Completed batches get moved here with timestamps)

### 2026-04-13 19:30 CDT — Batch 1 completed
- Verified Python 3, agent-hq directories, writable cowork prompt, valid bridge JSON, watchdog launch agents, live bridge-to-Telegram delivery, and cowork typer.
- Closed the full Claude ↔ Fupie loop with explicit `FULL LOOP ACK` from Claude on the bridge.
- Claude updated `BUILD_LOOP.md` with Batch 2 and signaled the next workstream is ready.

### 2026-04-14 00:06 CDT — Batch 2 completed
- Sandbox-mode crash eliminated; webchat returns MAIN_OK (CLI/gateway invocation path still has a separate timeout, tracked as an open config issue — not blocking agent work).
- Workspace git baseline committed as `2ea551b`.
- Full 7-agent roster responding after Echo (follow-up) was swapped from `ollama/kimi-k2.5:cloud` to `openrouter/google/gemma-4-31b-it`.
- Infrastructure health verified: Mission Control (port 3000) HTTP 200, `jediquest77.gumroad.com` HTTP 200, `jedaiflow.com` HTTP 200.
- Product sprint pivoted and shipped: "The OpenClaw + Claude Cowork Operator Stack Guide" — PDF built, Gumroad product live at `https://jediquest77.gumroad.com/l/cqmqg`, social posts rewritten and staged in Notion, PDF copied to Desktop for John's upload flow.
- Blog article deploy to `jedaiflow.com/blog/openclaw-claude-mac-workaround` parked — no local website repo exists on the Mac Mini; Pela will deploy via Cloudflare MCP when John confirms the hosting path.
