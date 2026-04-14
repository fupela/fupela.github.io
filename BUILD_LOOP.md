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
- [ ] [AGENT] Full loop test: write bridge msg → verify Telegram receives it → respond via Cowork Typer → verify Claude receives it
- [x] [AGENT] Verify watchdog is running: `launchctl list | grep openclaw`
- [ ] [AGENT] Report Batch 1 results to Claude via Cowork Typer. If all pass, ask Claude for Batch 2.

---

## BATCH HISTORY
(Completed batches get moved here with timestamps)
