/**
 * Gmail API client — OAuth 2.0 with refresh token.
 * No extra dependencies. Uses native fetch.
 *
 * Required env vars:
 *   GMAIL_CLIENT_ID
 *   GMAIL_CLIENT_SECRET
 *   GMAIL_REFRESH_TOKEN
 *   GMAIL_SENDER_EMAIL   (the address emails are sent FROM)
 */

// ─── Token cache ──────────────────────────────────────────────────────────────

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error("Gmail env vars not set (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN)");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) throw new Error(`Gmail token refresh failed: ${await res.text()}`);
  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

// ─── RFC 2822 builder ─────────────────────────────────────────────────────────

function buildRawEmail(opts: {
  from: string;
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}): string {
  const mime = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    opts.replyTo ? `Reply-To: ${opts.replyTo}` : "",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: quoted-printable",
    "",
    opts.body,
  ]
    .filter((line) => line !== "")
    .join("\r\n");

  return Buffer.from(mime).toString("base64url");
}

// ─── Send ─────────────────────────────────────────────────────────────────────

export interface SendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}): Promise<SendResult> {
  const sender = process.env.GMAIL_SENDER_EMAIL;
  if (!sender) return { ok: false, error: "GMAIL_SENDER_EMAIL not set" };

  try {
    const token = await getAccessToken();
    const raw = buildRawEmail({
      from: sender,
      to: opts.to,
      subject: opts.subject,
      body: opts.body,
      replyTo: opts.replyTo,
    });

    const res = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `Gmail send failed (${res.status}): ${err}` };
    }

    const data = await res.json() as { id: string };
    return { ok: true, messageId: data.id };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export function gmailConfigured(): boolean {
  return !!(
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN &&
    process.env.GMAIL_SENDER_EMAIL
  );
}
