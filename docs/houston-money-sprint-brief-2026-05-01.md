# DispatchAnchor Houston Money Sprint - 2026-05-01

## Mission

Turn `/guides/` into the fastest possible money page for the Houston home-services niche.

The page should not feel like a free guide library anymore. It should sell one immediate action:

**Buy or request the $200 Houston Missed-Call Revenue Audit.**

Primary URL:

```text
https://jedaiflow.com/guides/
```

Primary Stripe checkout:

```text
https://buy.stripe.com/8x2bJ39f83TV6CC5Zt0RG0j
```

Primary phone:

```text
(762) 335-3110
```

Primary email:

```text
audit@dispatchanchor.com
```

## What changed

- `/guides/index.html` is now a Houston missed-call audit landing page.
- `/guides/thank-you.html` is now a post-submit conversion page that pushes the $200 audit immediately.
- Lead form posts to the existing Make webhook:

```text
https://hook.us2.make.com/2qi68q1xvuz1gguvb3bo1l1iebqxdl6j
```

## Live deploy blocker

GitHub is not the live deploy trigger. `jedaiflow.com` is Cloudflare Pages direct upload.

Fupie action when Cloudflare auth is available:

```bash
cd "/Users/johnjedlowski/Library/Mobile Documents/com~apple~CloudDocs/Cowork OS/AI Business HQ/fupela.github.io"
npx wrangler pages deploy . --project-name jedaiflow
```

Verify:

```bash
curl -L -s https://jedaiflow.com/guides/ --max-time 20 | rg -n "Houston Missed-Call Revenue Audit|Buy the \\$200 audit|houston-guides-money-page|762\\) 335-3110"
```

If Wrangler says "not authenticated," John needs to run `npx wrangler login` or set `CLOUDFLARE_API_TOKEN`.

## Why this positioning

The generic "AI receptionist for home services" space is crowded. The faster money angle is narrower:

- Houston specific.
- Trade specific.
- Revenue-leak specific.
- Paid diagnostic first.
- Audit credited toward setup.

Use "missed-call recovery" and "lead recovery," not generic "lead generation." Contractors distrust generic lead-gen pitches, but they already understand that missed calls and slow callbacks cost jobs.

## Offer ladder

1. Free checklist: missed-call recovery checklist.
2. Entry sale: `$200 Houston Missed-Call Revenue Audit`.
3. Setup sale: DispatchAnchor phone-answering/missed-call setup, with audit credited toward setup.
4. Retainer: AI phone answering + missed-call recovery monitoring.
5. Add-ons: after-hours triage, emergency escalation, weekly call report, CRM/Jobber/Housecall Pro handoff.

## Target ICP

Prioritize Houston-area businesses where calls are urgent, phone-first, and high-value.

Tier 1:

- Plumbing
- HVAC
- Electrical
- Restoration/water damage
- Garage door repair
- Locksmith

Tier 2:

- Roofing
- Appliance repair
- Pest control
- Pool service
- Handyman/home repair
- Pressure washing/exterior cleaning

Tier 3:

- Remodeling
- Landscaping
- General contractors

Best-fit prospect signals:

- Owner/operator answers phone personally.
- Website has a phone-first CTA.
- They advertise emergency, 24/7, same-day, or after-hours service.
- Reviews mention responsiveness, scheduling, emergency service, or missed callbacks.
- They are too small for a real call center but large enough that one booked job matters.
- They use a simple website, Google Business Profile, Facebook page, or contact form with no obvious AI/answering workflow.

Avoid for this sprint:

- Large franchises.
- National chains.
- Businesses with corporate call centers.
- Generic info@ inboxes unless there is no better path.
- Low-ticket businesses where the audit math is weak.

## Page conversion flow

1. Visitor lands on `/guides/`.
2. They see Houston + missed-call revenue audit immediately.
3. Primary CTA: Buy the $200 audit.
4. Secondary CTA: Request callback.
5. Callback form sends to Make with buyer-intent fields.
6. Thank-you page pushes Stripe audit again.
7. If not ready, visitor can open the free missed-call checklist.

## Lead form payload

Make receives JSON like:

```json
{
  "name": "Owner name",
  "company": "Business name",
  "phone": "Phone number",
  "email": "Optional email",
  "trade": "Plumbing",
  "website": "https://example.com",
  "message": "What is leaking right now",
  "source": "houston-guides-money-page",
  "offer": "Houston Missed-Call Revenue Audit",
  "page_url": "https://jedaiflow.com/guides/",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "submitted_at": "ISO timestamp"
}
```

## Fupie / Fupela tasks today

1. Deploy the page to Cloudflare when auth is available.
2. Verify `/guides/` and `/guides/thank-you.html` live.
3. Confirm the Make scenario is ON and receives `source=houston-guides-money-page`.
4. Route new audit leads to John immediately:
   - Email alert to John.
   - HubSpot contact or lead record.
   - Optional Slack/Telegram alert.
5. Confirm Stripe checkout is still active for the $200 audit.
6. Add UTM tags for each outreach lane:
   - `?utm_source=phone&utm_medium=outreach&utm_campaign=houston_audit`
   - `?utm_source=contact_form&utm_medium=outreach&utm_campaign=houston_audit`
   - `?utm_source=x&utm_medium=social&utm_campaign=houston_audit`
   - `?utm_source=linkedin&utm_medium=social&utm_campaign=houston_audit`
7. Use batches 8 and 10 as seed lists, but verify every lead before outreach.
8. Do not waste today on broad site refactors. The only goal is paid audits or serious callback requests.

## Jolie tasks today

1. Post social content that points to `/guides/`.
2. Prioritize build-in-public and Houston contractor pain, not generic AI.
3. Create or queue 3 short posts:
   - "Houston contractors: your phone is a revenue channel, not an inbox."
   - "A missed call during a job can become a booked job if the follow-up starts in 60 seconds."
   - "I am offering a $200 missed-call revenue audit for Houston home-service businesses this week."
4. Turn the page into a short X thread:
   - Tweet 1: Houston contractors lose jobs when calls go unanswered.
   - Tweet 2: The fix is not more marketing. It is faster intake.
   - Tweet 3: DispatchAnchor reviews calls, forms, after-hours handoffs, and follow-up.
   - Tweet 4: Link to `/guides/` with UTM.
5. Draft one LinkedIn post from John's founder angle:
   - Former support/dispatch exposure.
   - Dad is a plumber.
   - Built DispatchAnchor because the pain is concrete.
6. If posting directly is blocked, write drafts to `content/` and bridge Fupie.

## Scout tasks today

Find 25 Houston-area leads, ranked by urgency and fit.

Fields:

- Business name
- Trade
- Owner or manager if public
- Website
- Phone
- Direct email if public
- Contact form URL
- Google Business Profile URL
- Evidence of urgent/after-hours/same-day service
- One-line missed-call angle
- Outreach lane: call, form, email, LinkedIn, or skip

Scoring:

- HOT: emergency/same-day phone-first trade, small operator, clear phone CTA, no obvious answering system.
- WARM: home-service operator with phone CTA but less urgent work.
- COOL: low urgency, franchise, weak fit, or no public contact path.

## Quill / outreach writing tasks

Write copy under 90 words. One specific observation, one outcome, one ask.

Do not say:

- "Revolutionize your business."
- "AI-powered digital transformation."
- "I noticed you may be struggling."
- "We can generate leads for you."

Say:

- "This is about recovering calls you already paid to create."
- "If someone calls while your tech is under a sink, the first useful response wins."
- "I can audit the call path and show the 2-3 fixes most likely to recover jobs."

## Phone opener

```text
Hey, is this [Business Name]?

This is John with DispatchAnchor here in Houston. I am calling because we help home-service companies recover missed calls and after-hours leads.

Quick question: when your techs are on jobs and a new customer calls, does that usually go to voicemail, a person, or a call service?
```

If they answer:

```text
Got it. I am offering a $200 missed-call revenue audit for Houston contractors this week. I look at the phone path, website form, after-hours handoff, and follow-up timing, then send the 2-3 fixes most likely to recover booked jobs. If you move forward with setup, I credit the audit toward it.
```

Close:

```text
Would it be useful if I sent the audit link, or would you rather I take a quick look at your site first and text you what I see?
```

## Contact form message

```text
Hi [Business Name] team - I am John with DispatchAnchor here in Houston.

I help home-service businesses recover missed calls and after-hours leads with AI phone answering, missed-call text-back, and cleaner intake notes.

I am offering a $200 missed-call revenue audit this week. I review the phone path, website form, after-hours handoff, and follow-up timing, then send the 2-3 fixes most likely to recover booked jobs. If you move forward with setup, the audit is credited toward setup.

Would it be worth sending this to whoever handles calls or scheduling?

Audit page: https://jedaiflow.com/guides/?utm_source=contact_form&utm_medium=outreach&utm_campaign=houston_audit
John
DispatchAnchor
(762) 335-3110
```

## Email draft

Subject options:

```text
missed calls at [Business Name]
quick Houston call audit
after-hours calls
```

Body:

```text
Hi [First Name],

I am John with DispatchAnchor here in Houston. I help home-service companies recover missed calls and after-hours leads.

I noticed [specific observation: emergency service / phone-first CTA / same-day repairs / after-hours calls]. If calls hit voicemail while the crew is on jobs, that is usually a recoverable leak.

I am offering a $200 missed-call revenue audit this week. I review your phone path, website form, after-hours handoff, and follow-up timing, then send the 2-3 fixes most likely to recover booked jobs. If you move forward with setup, I credit the audit toward it.

Worth a look?

John
DispatchAnchor
https://jedaiflow.com/guides/?utm_source=email&utm_medium=outreach&utm_campaign=houston_audit
(762) 335-3110
```

## SMS after a live call or voicemail

Only use SMS after a legitimate call/contact path.

```text
John with DispatchAnchor here in Houston. Good talking with you. Here is the $200 missed-call revenue audit page: https://jedaiflow.com/guides/?utm_source=sms&utm_medium=followup&utm_campaign=houston_audit

I will check your call/form path and send the fastest fixes I see.
```

## LinkedIn / X founder post

```text
Houston home-service owners do not need another vague AI pitch.

They need calls answered, urgency captured, and follow-up started before the customer calls the next company.

I built DispatchAnchor around one concrete problem: missed calls turning into lost jobs.

This week I am offering a $200 missed-call revenue audit for Houston plumbers, HVAC teams, electricians, roofers, garage door companies, appliance repair, pest control, and other home-service operators.

I review your phone path, website form, after-hours handoff, and follow-up timing, then send the 2-3 fixes most likely to recover booked jobs.

Audit page: https://jedaiflow.com/guides/?utm_source=linkedin&utm_medium=social&utm_campaign=houston_audit
```

## Today success metrics

Minimum:

- Cloudflare deploy completed.
- Make webhook verified.
- 10 HOT leads selected.
- 5 direct calls or contact-form submissions prepared.
- 3 social posts drafted or posted.

Good:

- 1 paid audit.
- 2 serious callback requests.
- 15 verified Houston leads.
- One contractor conversation that exposes real objections.

Great:

- 2+ paid audits.
- One setup call booked.
- A reusable objection list for the next page revision.

## Objections and answers

**"We already answer our calls."**

Great. The audit checks what happens when you cannot answer, after-hours, during jobs, or when a lead needs follow-up before your team gets back to the phone.

**"We use voicemail."**

Voicemail is a message holder, not a lead recovery system. The goal is to start the response before the customer calls the next company.

**"We already use an answering service."**

The audit can still check whether the handoff captures service, urgency, address, and booking intent in a way your team can act on quickly.

**"I do not want AI talking to customers."**

Start with missed-call text-back and intake summaries. Full AI answering is optional.

**"How much is setup?"**

The audit is $200 and credited toward setup. Setup depends on call flow, business rules, and whether they want missed-call recovery only or full AI answering.

## Do not do today

- Do not rebuild the entire brand.
- Do not write more generic AI blog posts before the page is live.
- Do not use broad "AI automation agency" language.
- Do not send cold volume through weak deliverability.
- Do not target low-value businesses just because contact info is easy.

The job today is simple: live page, verified capture, targeted Houston outreach, paid audit ask.
