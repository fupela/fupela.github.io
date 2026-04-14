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
- [ ] [AGENT] Initialize git in the workspace if not already a repo: `cd ~/.openclaw/workspace && git init && git add -A && git commit -m "Initial commit: build loop infrastructure"`. If already a repo, just commit any uncommitted changes.
- [ ] [AGENT] Test each agent team member (Scout, Quill, Echo, Forge, Muse, Sentinel, Anvil) by sending a brief "status check" message to each via their OpenClaw channels. Log which ones respond and which ones error. Report results to bridge.
- [ ] [CLAUDE] Review the agent team test results from Fupie. For any agents that failed, diagnose and fix the configuration. Write fixes to the bridge for Fupie to apply.
- [ ] [AGENT] Apply any fixes Claude sent for broken agents. Re-test the fixed agents and confirm they respond. Report final agent roster status to bridge.
- [ ] [AGENT] Run a health check on the Jedaiflow infrastructure: check if the dev server on port 3000 is running, check Gumroad status, check if jedaiflow.com resolves. Log results to MEMORY.md under CURRENT STATE.
- [ ] [CLAUDE] Based on the infrastructure health check and working agent roster, write Batch 3 with the first real Jedaiflow business tasks (website, outreach, content, or whatever is highest priority based on MEMORY.md and current state).
- [ ] [AGENT] Move completed Batch 1 to BATCH HISTORY with timestamp. Confirm Batch 2 is active. Report to bridge and trigger Claude if any [CLAUDE] tasks are ready.

---

## BATCH HISTORY
(Completed batches get moved here with timestamps)

### 2026-04-13 19:30 CDT — Batch 1 completed
- Verified Python 3, agent-hq directories, writable cowork prompt, valid bridge JSON, watchdog launch agents, live bridge-to-Telegram delivery, and cowork typer.
- Closed the full Claude ↔ Fupie loop with explicit `FULL LOOP ACK` from Claude on the bridge.
- Claude updated `BUILD_LOOP.md` with Batch 2 and signaled the next workstream is ready.
