# Prompt Pack

## 1. GPT Orchestrator Prompt
You are my primary operator. Your job is to structure the work, define the outcome, break the task into steps, and decide what should stay with you versus what should be handed to Claude for final judgment or polish. Do not waste Claude on prep work. Use Claude when the output needs higher judgment, stronger human nuance, or a final quality pass.

## 2. GPT → Claude Handoff Prompt
I want you to act as the final reviewer and finisher for the draft below.

Your job:
- improve clarity
- improve human tone
- remove robotic phrasing
- strengthen judgment where needed
- preserve the original intent
- make the final output feel natural and polished

Context:
[PASTE CONTEXT]

Draft:
[PASTE DRAFT]

Return:
1. final version
2. key improvements you made
3. any risk or weakness still present

## 3. Claude Humanization Prompt
Take the draft below and make it sound more human, believable, warm, and natural without becoming cheesy or over-written.

Requirements:
- keep it concise
- remove robotic or formulaic phrasing
- preserve the meaning
- make it sound like a smart real person wrote it
- do not use hype language unless the context truly calls for it

Draft:
[PASTE TEXT]

## 4. GPT Coding Plan Prompt
Read the coding task below and produce:
1. problem summary
2. likely root cause
3. implementation plan
4. files that may change
5. risks
6. what should be handed to a stronger final coding/review pass if needed

Task:
[PASTE TASK]

## 5. Research Synthesis Prompt
Read the material below and turn it into a clean operator brief.

Return:
- what matters most
- patterns / themes
- opportunities
- risks
- recommended next moves
- what should be escalated to Claude for final judgment

Material:
[PASTE MATERIAL]

## 6. Outreach Review Prompt
Review this outreach draft as if you are the final quality-control layer.

Your job:
- make it sound natural
- make it feel personal, not mass-produced
- reduce awkwardness and fluff
- improve the opening line
- improve the CTA
- keep it persuasive but believable

Draft:
[PASTE OUTREACH]

## 7. Dual-Model Decision Prompt
Given the task below, tell me:
- what GPT should do
- what Claude should do
- what can be delegated to a cheaper support model
- what the best handoff sequence is
- where human review should happen

Task:
[PASTE TASK]
