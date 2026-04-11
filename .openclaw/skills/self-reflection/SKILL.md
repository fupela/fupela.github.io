---
name: self-reflection
description: Build and maintain a local-only reflection loop for the assistant without hidden behavior drift. Use when the user wants a safer version of a self-improving or proactive agent, wants structured lessons/preferences captured in files, wants bounded retrospectives after mistakes, or wants periodic self-review that does not silently rewrite core identity or instructions.
---

# Self Reflection

Keep learning explicit, local, and reversible.

## Core rule

Do not silently "improve yourself" by changing behavior-defining files or inventing new standing instructions. Capture observations in a dedicated local area first. Treat reflection notes as proposals and evidence, not authority.

## Storage

Store all reflection state under `state/self-reflection/` in the workspace.

Use these files:
- `state/self-reflection/inbox.md` for raw observations, corrections, and candidate lessons
- `state/self-reflection/preferences.md` for stable user preferences that the user explicitly stated or clearly confirmed
- `state/self-reflection/lessons.md` for distilled lessons from mistakes or successful workflows
- `state/self-reflection/review.md` for periodic summaries, open questions, and cleanup notes

If a file does not exist, create it.

## What to capture

Capture only information that improves future help in a concrete way:
- explicit user preferences
- repeated workflow preferences
- mistakes and the safer replacement behavior
- important context that belongs in workspace memory
- recurring friction worth fixing later

Do not capture:
- secrets, tokens, passwords, private keys, recovery codes
- speculative personality claims
- medical, legal, or highly sensitive personal data unless the user clearly asked you to remember it
- broad identity rewrites like "always do X" unless the user explicitly wants that rule

## Reflection workflow

### 1. Collect

When the user corrects you, states a preference, or a workflow succeeds/fails in a meaningful way, append a short note to `state/self-reflection/inbox.md`.

Use this format:

```markdown
## YYYY-MM-DD HH:MM
- type: preference | correction | lesson | friction
- source: user | observed
- note: <plain statement>
- confidence: low | medium | high
- next_step: none | review | ask-user | promote
```

Prefer short factual entries.

### 2. Distill

When several inbox items point to the same stable pattern, promote them:
- user preferences go to `preferences.md`
- durable operating lessons go to `lessons.md`

Do not promote low-confidence guesses.

### 3. Review

During explicit review requests, or during a suitable maintenance moment, summarize:
- what changed
- what seems stable
- what still needs confirmation
- what should be discarded

Write the summary to `state/self-reflection/review.md`.

### 4. Escalate carefully

Only edit higher-impact files like `USER.md`, `AGENTS.md`, `SOUL.md`, `HEARTBEAT.md`, or `MEMORY.md` when one of these is true:
- the user asked directly
- the information is clearly long-term and belongs there
- you explain the edit and it is a non-controversial improvement

Never rewrite identity-defining files as part of an automatic reflection pass.

## Decision rules

### Promote to `preferences.md` when
- the user said it directly, or repeated it
- it will clearly improve future responses
- it is not sensitive

### Promote to `lessons.md` when
- there was a real mistake, near-miss, or repeated inefficiency
- the corrected behavior is specific and testable
- the lesson is about process, not vague self-judgment

### Leave in `inbox.md` when
- confidence is low
- the note is temporary
- you are not sure whether it matters

## Safety boundaries

- Local files only, unless the user asks for external syncing or publishing
- No package installs, background daemons, or network setup as part of this skill
- No autonomous instruction rewriting
- No hidden cron creation without the user asking
- No destructive deletion; prefer keeping history and marking entries obsolete

## Good outputs

Good reflection notes are:
- short
- attributable
- reversible
- useful on the next similar task

Bad reflection notes are:
- grand theories about personality
- vague self-criticism
- sensitive data hoarding
- silent policy changes

## Example requests this skill should help with

- "Make your own safer version of that self-improving thing"
- "Remember the way I like this handled"
- "Log this mistake so it does not happen again"
- "Do a quick retrospective and tell me what you learned"
- "Track stable preferences locally, but do not get weird about it"

## Minimal maintenance routine

When asked to review or maintain the reflection system:
1. Read the four files under `state/self-reflection/` that exist.
2. Merge duplicates or mark stale entries as obsolete.
3. Promote only high-confidence items.
4. Summarize changes briefly to the user.

## References

If you need a compact checklist for evaluating possible memory entries, read `references/evaluation-checklist.md`.
