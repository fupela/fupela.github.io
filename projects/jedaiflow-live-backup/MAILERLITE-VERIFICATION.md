# MailerLite Form Verification Report

**Date:** 2026-04-22 06:22 UTC  
**Agent:** Fupie  
**Task:** [AGENT:FUPIE] Verify MailerLite form is live and embedded on jedaiflow.com/guides/

---

## VERDICT: NO REAL MAILERLITE FORM — Mailto Fallback Only

### What Exists on the Live Site

The "newsletter" section on jedaiflow.com/ uses a **mailto fallback**, not a real MailerLite subscription form:

```html
<form class="newsletter-form" action="mailto:hello@jedaiflow.com" method="post" enctype="text/plain">
  <input type="email" name="email" placeholder="you@yourwork.com" required>
  <button type="submit" class="btn-primary">Subscribe</button>
</form>
<p style="font-size:13px; color:var(--text-dim); margin-top:18px;">
  Form posts to email for now. Unsubscribe any time.
</p>
```

**How it works:** When a user submits, it opens their default email client with a pre-filled email to `hello@jedaiflow.com` — NOT a proper newsletter subscription.

### What Should Exist

A proper MailerLite embedded form should look like:

```html
<form action="https://app.mailerlite.com/webforms/submit/XXXXXX" method="post" target="_blank">
  <input type="email" name="fields[email]" placeholder="Email" required>
  <button type="submit">Subscribe</button>
</form>
```

### Manual Steps for John to Fix

1. **Login to MailerLite** → https://dashboard.mailerlite.com
2. **Create a new webform** (if not already created)
3. **Get the embed code** → Forms → [Your Form] → Embed → HTML
4. **Replace the mailto form** in `index.html` (newsletter section) with the MailerLite embed
5. **Add the same form** to `/guides/` page
6. **Test** by submitting a test email and checking MailerLite subscribers list

### Impact

- ❌ No newsletter subscribers are being captured automatically
- ❌ Manual email processing required for every "subscription"
- ❌ No unsubscribe management
- ❌ No automated welcome email

---

**Reported by Fupie — 2026-04-22**
