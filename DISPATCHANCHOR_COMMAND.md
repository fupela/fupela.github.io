# DispatchAnchor Command Packet - 2026-05-01

## Current Objective

Make today about paid audit demand, not more setup.

Primary offer:

```text
$200 Houston Missed-Call Revenue Audit
```

Primary page:

```text
https://jedaiflow.com/guides/
```

Call packet:

```text
https://jedaiflow.com/call-packet/
```

Short links:

```text
https://jedaiflow.com/audit
https://jedaiflow.com/houston-audit
https://jedaiflow.com/missed-calls
```

Checkout:

```text
https://buy.stripe.com/8x2bJ39f83TV6CC5Zt0RG0j
```

Phone:

```text
(762) 335-3110
```

## Bridge Response For Jolie

Post or adapt this as one response to the six pending Fupie messages.

```text
[PELA -> JOLIE] ACK all six Fupie handoffs.

I am collapsing the queue into one operating lane so we do not fragment:

1. Status/blockers:
   - OpenClaw health is live.
   - GitHub source is updated.
   - Live money-page deploy still depends on Cloudflare direct upload.
   - Fupie owns deploy + Make webhook + Stripe notification verification.
   - Jolie owns social/product packaging, prospect hooks, reply monitoring, and staged outreach assets.

2. Social/product packaging lane:
   - Package only one offer today: the $200 Houston Missed-Call Revenue Audit.
   - Point every social/link mention to /audit or /guides/.
   - Do not dilute with generic guide-store, prompt-pack, or broad AI automation content.

3. Revenue push + guardrails:
   - Monitor replies and form/audit signals.
   - Escalate any warm buyer intent to John immediately.
   - Do not promise guaranteed revenue, exact recovered-call percentages, or setup pricing beyond "audit credited toward setup."
   - Do not submit contact forms that prohibit solicitation; stage those for John instead.

4. All-out Friday command:
   - Produce assets that can create revenue today: 3 social posts, 5 prospect hooks, 5 contact-form drafts, and one reply template.
   - Keep everything under the "recover missed calls before the customer calls the next company" frame.

5. DispatchAnchor prospects + call packet:
   - Use the top existing strategy cards first: LTP Plumbing, Tri-Tek Plumbing, Kenneth's Plumbing, Allstar AC, Level Up Roofing.
   - If fresh leads are needed, prioritize Houston HVAC, plumbing, electrical, restoration, garage door, locksmith, appliance repair, pest control, pool service, handyman, and pressure washing.

6. Mini-audit call hooks:
   - For each HOT prospect, write one observation, one missed-call leak, one audit ask, and one soft close.
   - Keep each hook specific enough that John can say it on a call without sounding scripted.

Report back with:
- page deploy status
- Make webhook status
- Stripe audit checkout status
- call packet status
- top 5 prospects
- social posts drafted/posted
- contact-form drafts staged/submitted
- replies or objections
```

## Fupie Lane

Fupie should keep this tight:

1. Deploy live site when Cloudflare auth is available:

```bash
npx wrangler pages deploy . --project-name jedaiflow
```

2. Verify money page:

```bash
curl -L -s https://jedaiflow.com/guides/ --max-time 20 | rg -n "Houston Missed-Call Revenue Audit|Buy the \\$200 audit|houston-guides-money-page"
```

3. Verify short links after Cloudflare deploy:

```bash
curl -sI https://jedaiflow.com/audit | head
curl -sI https://jedaiflow.com/missed-calls | head
curl -sI https://jedaiflow.com/call-packet/ | head
```

4. Confirm Make scenario is ON and receives:

```text
source=houston-guides-money-page
offer=Houston Missed-Call Revenue Audit
```

5. Confirm Stripe checkout:

```text
https://buy.stripe.com/8x2bJ39f83TV6CC5Zt0RG0j
```

6. Confirm purchase alerts go to John or create a lead record.

## Jolie Lane

Jolie should not wait for new strategy.

### Social Posts

Draft or post these with the correct UTM link.

Post 1:

```text
Houston contractors: your phone is not an inbox. It is a revenue channel.

If a customer calls while your tech is under a sink, in an attic, or driving between jobs, the first useful response usually wins.

I am offering a $200 missed-call revenue audit for Houston home-service businesses this week.

https://jedaiflow.com/audit
```

Post 2:

```text
The fix for missed calls is not "more marketing."

It is faster intake:
- answer or call back fast
- capture service + urgency + address
- alert the owner/dispatcher
- follow up before the customer calls the next company

Houston missed-call audit:
https://jedaiflow.com/missed-calls
```

Post 3:

```text
I am narrowing DispatchAnchor to one concrete Houston problem:

home-service calls that go unanswered, especially after-hours or while crews are on jobs.

The $200 audit checks phone path, website form, after-hours handoff, and follow-up timing.

https://jedaiflow.com/houston-audit
```

### Reply Template

Use for warm replies:

```text
Appreciate it. The audit is simple: I check your phone path, website form, after-hours handoff, and follow-up timing, then send the 2-3 fixes most likely to recover booked jobs.

It is $200 and credited toward setup if DispatchAnchor is a fit.

Fastest next step is here: https://jedaiflow.com/audit

If easier, send me your website + main business number and I can tell you what I would check first.
```

## Top Prospect Hooks

Use these first because strategy cards already exist.

### LTP Plumbing

Observation:

```text
Solo licensed plumber. If Eric is under a sink, the phone is uncovered.
```

Hook:

```text
Eric, quick question: when a call comes in while you are on a job, does it hit voicemail or do you have someone catch it? I am offering a $200 missed-call audit for Houston plumbers. I would check your phone path and show the fastest way to recover calls before they hire whoever answered first.
```

### Tri-Tek Plumbing

Observation:

```text
18-year Houston plumbing reputation. Calls are trust, not just leads.
```

Hook:

```text
Tommy, you have built 18 years of trust in Houston. The audit angle is simple: what happens to that trusted call when everyone is on a job? I can review the phone path, after-hours handoff, and follow-up timing and send the 2-3 fixes most likely to recover booked jobs.
```

### Kenneth's Plumbing

Observation:

```text
35+ years in East Houston. Referral calls need an answer, not voicemail.
```

Hook:

```text
Kenneth, with 35 years of referrals, a missed call is not just a lost job. It can be a loyal customer calling someone else. I am offering a $200 audit to find where calls and after-hours leads leak, then recommend the fastest recovery setup.
```

### Allstar AC & Heating

Observation:

```text
Houston HVAC season is starting. Summer missed calls are high-value.
```

Hook:

```text
Houston summer is the moment when AC calls become expensive to miss. I am offering a $200 audit for HVAC shops: phone path, after-hours intake, urgency routing, and follow-up timing. If it shows a fit, the audit is credited toward DispatchAnchor setup.
```

### Level Up Roofing

Observation:

```text
Storm season creates call spikes. Roofing leads are high-ticket and time-sensitive.
```

Hook:

```text
Rafael, storm calls come in waves, and the first roofer to respond often wins the inspection. I can audit your call/form path and after-hours handoff, then show how to capture storm leads without hiring temporary phone coverage.
```

## Guardrails

- Do not claim guaranteed revenue.
- Do not claim a specific missed-call rate for a prospect unless we have their data.
- Do not say "AI will replace your staff."
- Say "missed-call recovery" and "after-hours lead handling," not "lead generation."
- Do not ask prospects to text DispatchAnchor until the SMS number is live.
- Do not submit contact forms that ban solicitation.
- Do not invent customer testimonials.
- Do not quote setup price unless John approves the scope.
- Escalate any direct buying intent, pricing question, or call request to John immediately.

## Today Metrics

Report these at the end of the sprint:

- Live deploy: yes/no
- Webhook verified: yes/no
- Stripe verified: yes/no
- Short links verified: yes/no
- Social posts drafted/posted
- HOT prospects selected
- Contact-form drafts staged/submitted
- Warm replies
- Paid audits
- Objections heard
