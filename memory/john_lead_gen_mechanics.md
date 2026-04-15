---
name: Lead Generation & Outreach Mechanics
description: Scout workflow, lead scoring, email sending identity, Manus baseline, autonomous SOP
type: project
---

**Lead Gen Workflow**:
1. **Scout finds** leads via web research (Houston SMBs matching Jedaiflow ICP)
2. **Scout adds** contact details (email, contact form, decision-maker if discoverable)
3. **Pela scores** leads HOT/WARM/COOL using lead-pipeline skill
4. **Pela pushes** HOT + WARM to HubSpot as new contacts (company name + reason-to-engage in notes)
5. **Quill drafts** outreach for top leads (short, specific, references business + automation angle)
6. **Pela polishes** drafts (Opus-level human tone)
7. **Fupie sends** via autonomous SOP (or John reviews + sends manually if preferred)
8. **Echo queues** auto follow-ups (+3 days)

**Lead Scoring**:
- **HOT**: High-fit, clear automation need, likely to engage, reach out immediately
- **WARM**: Good fit, some automation potential, nurture track, might convert
- **COOL**: Low fit or unclear need, save for later or deprioritize

**Outreach Identity**:
- **From**: hello@jedaiflow.com (main outreach identity, Gmail Send-As alias required)
- **Reply-To**: john@jedaiflow.com (personal, John reads replies directly)
- **Note**: Send-As alias must be exposed in Gmail; no silent fallback to another email

**Autonomous Send SOP** (2026-04-14):
- File: `outreach/AUTONOMOUS_SEND_SOP.md`
- Fupie dispatches sends without Claude bridge task needed
- Checks `flags/HOLD_SENDS` before sending (kill-switch mechanism)
- Logs each send to `outreach/sent-log.json` with Gmail message ID
- Auto-queues Echo +3d follow-up after success
- **Kill-switch**: Bridge message with exact token `HOLD SENDS` pauses pipeline, or flag file `~/.openclaw/workspace/projects/agent-hq/mcp-bridge/flags/HOLD_SENDS` stops sends

**Manus Baseline** (old workflow, pre-Jedaiflow):
- 3-6 outreach batches/day
- 10-15 emails per batch
- Separate prompt-driven workflows for software sales vs one-on-one service sales
- Not the Jedaiflow outreach model (Jedaiflow is personal + strategic, not bulk)

**Current Pipeline Status**:
- Batch 3: 3 HOT leads drafted, polished, queued for send
- Batch 4: More lead gen + scaled outreach in planning
