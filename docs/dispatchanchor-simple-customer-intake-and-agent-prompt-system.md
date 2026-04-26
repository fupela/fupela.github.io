# DispatchAnchor Simple Customer Intake + Agent Prompt System

**Goal:** Keep the first customer portal simple. Collect baseline business information, use it to tailor the voice agent, and turn the answers into a repeatable prompt/knowledge-base package that an operator or agent can build from.

## Product Principle

DispatchAnchor should feel simple to the customer:

> Tell us about your business. We configure your AI dispatcher.

Customers should control business rules, not technical settings.

They should never have to think about:
- ElevenLabs
- Twilio
- webhooks
- API keys
- prompt engineering
- raw model settings
- SIP routing

## V1 Customer Flow

1. Customer logs in.
2. Customer completes setup checklist.
3. App stores their business and call-handling rules.
4. DispatchAnchor/admin reviews the intake.
5. A tailored agent prompt/knowledge package is generated.
6. Operator/agent builds or updates the voice agent.
7. Customer performs a test call.
8. Customer goes live with either a DispatchAnchor number or call forwarding.

## V1 Screens

### 1. Dashboard
- Agent status: Draft / Setup in progress / Test needed / Live
- Assigned phone number
- Setup progress
- Calls answered this week
- Latest captured calls/leads

### 2. Setup Checklist
- Business profile
- Services
- Hours
- Emergency rules
- Alert contacts
- Phone setup
- Test call
- Go live

### 3. Business Profile
Collect:
- Company name
- Owner / main contact
- Business website
- Main business phone
- Service area
- Trade/category
- Business hours
- After-hours policy

### 4. Services
Collect:
- Services offered
- Services not offered
- High-value services
- Emergency services
- Seasonal services
- Common customer questions

### 5. Call Rules
Collect:
- Should agent book appointments, qualify leads, or only take messages?
- What should count as urgent?
- What details must be collected on every call?
- How should pricing questions be handled?
- How should angry/frustrated callers be handled?
- What should the agent say if the business is fully booked?
- What should the agent say if the job is outside the service area?

### 6. Alerts
Collect:
- Primary SMS alert number
- Primary email alert
- Emergency alert contact
- Non-urgent lead contact
- Preferred call summary format

### 7. Phone Setup
Options:
- Use a new DispatchAnchor number
- Forward missed calls to DispatchAnchor
- Forward after-hours calls to DispatchAnchor
- Need help configuring forwarding

### 8. Call Inbox
Show:
- Caller name
- Caller phone
- Service needed
- Address/location
- Urgency
- Summary
- Transcript
- Recording link if available
- Status: New / Contacted / Booked / Lost / Spam

## Baseline Customer Intake Form

### Business Basics
```yaml
business_name:
owner_name:
website:
main_phone:
trade:
service_area:
timezone:
business_hours:
after_hours_policy:
```

### Services
```yaml
services_offered:
  -
services_not_offered:
  -
high_value_jobs:
  -
emergency_jobs:
  -
common_questions:
  - question:
    answer:
```

### Call Handling
```yaml
agent_goal: "book | qualify | message_only | hybrid"
booking_policy:
  can_book_directly: false
  should_collect_preferred_times: true
  calendar_link:
required_fields:
  - name
  - phone
  - address
  - service_needed
  - urgency
  - preferred_time
pricing_policy: "do_not_quote | diagnostic_fee_only | price_sheet | owner_confirms"
diagnostic_fee:
service_area_outside_response:
fully_booked_response:
angry_customer_response:
```

### Emergency Rules
```yaml
urgent_keywords:
  - active leak
  - flooding
  - sewer backup
  - no heat
  - no AC
  - electrical burning smell
emergency_escalation:
  sms_immediately: true
  call_owner: false
  email_summary: true
```

### Notifications
```yaml
primary_sms:
primary_email:
emergency_sms:
emergency_email:
summary_format: "short | detailed"
```

### Brand Voice
```yaml
agent_name: "Alex"
tone: "friendly, calm, professional, concise"
first_message:
things_to_never_say:
  -
things_to_always_say:
  -
```

## Repeatable Agent Prompt Template

Use the completed intake to generate this prompt for each customer.

```text
You are {{agent_name}}, the AI dispatcher for {{business_name}}, a {{trade}} company serving {{service_area}}.

Your job is to answer calls professionally, collect accurate service details, identify urgent calls, and help the business follow up quickly.

Tone:
- Friendly
- Calm
- Professional
- Concise
- Reassuring during emergencies
- Never robotic or overly casual

Business details:
- Company: {{business_name}}
- Trade: {{trade}}
- Service area: {{service_area}}
- Business hours: {{business_hours}}
- After-hours policy: {{after_hours_policy}}

Services offered:
{{services_offered}}

Services not offered:
{{services_not_offered}}

Your primary call goal:
{{agent_goal}}

Required information to collect:
{{required_fields}}

Emergency handling:
Treat calls as urgent if they involve:
{{urgent_keywords}}

If urgent:
1. Stay calm and reassuring.
2. Collect name, callback number, address, service issue, and immediate risk.
3. Tell the caller the issue will be flagged as urgent.
4. Do not promise exact arrival times unless provided in business rules.
5. Trigger the emergency summary/escalation.

Pricing policy:
{{pricing_policy}}

If asked about pricing:
{{pricing_response}}

If caller is outside service area:
{{service_area_outside_response}}

If schedule is full:
{{fully_booked_response}}

If caller is angry or frustrated:
{{angry_customer_response}}

Never:
- Invent prices, guarantees, technician availability, discounts, or licenses.
- Claim to be human.
- Give unsafe technical instructions.
- Promise emergency arrival times unless explicitly configured.
- End the call before collecting a callback number.

At the end of the call, summarize:
- Caller name
- Phone number
- Address/location
- Service needed
- Urgency
- Preferred time
- Any special notes

Then tell the caller that {{business_name}} will follow up according to the business rules.
```

## Admin Build Checklist

For each new customer:

1. Review completed intake.
2. Confirm no missing required fields.
3. Generate agent prompt from template.
4. Create/update voice agent.
5. Add business-specific knowledge base.
6. Connect assigned number or forwarding path.
7. Configure notification recipients.
8. Run one internal test call.
9. Send customer test instructions.
10. Mark account ready for go-live.

## What Stays Manual in V1

- Voice agent creation
- Phone number provisioning
- Advanced prompt review
- Customer-specific edge cases
- Forwarding troubleshooting
- Final go-live approval

## What Can Be Automated Later

- Prompt generation
- Knowledge-base generation
- Twilio number provisioning
- Customer-selected area code
- Carrier-specific forwarding instructions
- Alert routing rules
- Stripe subscription activation
- Usage/minute reporting
- CRM/calendar integrations

## MVP Success Criteria

V1 is successful if:

1. Customer can complete setup without a sales call.
2. Admin can create a tailored agent from the intake in under 30 minutes.
3. Customer can test the agent easily.
4. Customer can see captured calls/leads in one place.
5. The same intake can be reused for every home-services customer.
