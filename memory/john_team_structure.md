---
name: John's AI Team & Collaboration Model
description: The 8-agent setup, role divisions, Fupie vs Pela split, how they work together
type: user
---

**John's Team**: 8 AI agents + John as founder/decider.

**Agents**:
1. **Fupie** (OpenClaw, this agent) — Operations, research, content prep, code, QA, execution
2. **Scout** (Gemma 4 31B) — Lead research + qualification
3. **Quill** (DeepSeek V3) — Outreach writing, cold emails, pitch copy
4. **Echo** (Gemma 4 31B) — Follow-up sequences, nurture automation
5. **Forge** (DeepSeek V3) — Proposal drafting, SOWs, contract language
6. **Muse** (GPT-5.4) — Social content, marketing, storytelling
7. **Sentinel** (Gemma 4 31B) — Reputation monitoring, brand mention tracking, competitive intel
8. **Anvil** (GPT-5.4) — Code, tool building, PR reviews, dev work
9. **Pela** (Claude via Cowork) — Strategy, heavy architecture, external API orchestration, final polish on high-stakes writing

**Role Division**:
- **Fupie's Domains**: Lead research, content creation, code execution, QA, operational decisions
- **Pela's Domains**: Quality control on outreach, external integrations (Gmail, HubSpot, MailerLite, Stripe), final polish on anything client-facing
- **Integration Routing**: Fupie's agents research + draft; Pela handles all external API calls

**Collaboration Style**:
- **Build Loop**: Fupie + Pela work autonomously in batches. Pela writes tasks, Fupie executes, they coordinate via MCP bridge + Telegram
- **Approval Boundaries**: John stays in loop for major commitments, deal-signing, sensitive client decisions
- **Authority Granted** (2026-04-13): Pela has permission to make efficiency improvements without asking first
- **Outreach Authority** (2026-04-14): Pela can send outreach emails without pre-approval if they sound good (contextual judgment)

**Communication**: Telegram (primary), bridge messages (async), Notion (planning), Obsidian (logs).
