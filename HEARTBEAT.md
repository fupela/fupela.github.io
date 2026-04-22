# Heartbeat Tasks

## Check on every heartbeat
- Check Telegram for unread messages
- Check Slack channels for activity
- Check if Mission Control dev server is running (port 3000), restart if down

## Rotate through (2-4x daily)
- Check email for urgent messages
- Review leads pipeline status
- Check Gumroad for new sales or activity
- Monitor agent health (are all 6 business agents responsive?)

## Proactive work (when idle)
- Update Obsidian session log with any new activity
- Review and organize new leads if any exist
- Check outreach email status

---

## Build Loop Checks (every heartbeat)

Priority checks — do these FIRST:
- [x] Are there uncompleted tasks in BUILD_LOOP.md? → Start the next [AGENT] task
- [x] Is there a [CLAUDE] task waiting? → Trigger Claude via Cowork Typer
- [ ] **IF TASK LIST IS EMPTY** → Trigger Claude to write the next batch. NEVER go idle.
- [x] Check bridge messages — anything unread from Claude? (`to="fupie"`, `read=false`)
- [ ] Dead Man's Switch: If Claude's last bridge message is 15+ min old and unacted on → alert John

Operational checks:
- [x] Git status — address uncommitted changes (M: .DS_Store, BUILD_LOOP.md, MEMORY.md, etc.)
- [x] Gateway health — verified stable on port 18789.
- [x] Bridge file — verified valid JSON.
- [x] Cowork Typer — verified writable.

### ✅ STATUS
- [x] Finalize Tasks 3 & 4 (Batch 3 Outreach) → DISPATCHED. SMTP active.

After finishing ANY task, immediately check what's next. No gaps between tasks.
