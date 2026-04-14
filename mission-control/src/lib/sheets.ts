/**
 * Google Sheets client — no external dependencies.
 * Uses Node.js built-in crypto for service account JWT auth.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY          (full PEM, newlines as \n)
 *   GOOGLE_SHEETS_LEADS_ID      (sheet ID for leads pipeline)
 *   GOOGLE_SHEETS_BUYERS_ID     (sheet ID for Gumroad buyers)
 *   GOOGLE_SHEETS_INBOUND_ID    (sheet ID for inbound/form leads)
 */

import { createSign } from "crypto";

// ─── Token cache ──────────────────────────────────────────────────────────────

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) throw new Error("Google service account env vars not set");

  const privateKey = rawKey.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  ).toString("base64url");

  const unsigned = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer.sign(privateKey, "base64url");
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth2:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

export async function readSheet(sheetId: string, range: string): Promise<string[][]> {
  const token = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 120 }, // cache 2 minutes
  });
  if (!res.ok) throw new Error(`Sheets fetch failed (${res.status}): ${await res.text()}`);
  const data = await res.json() as { values?: string[][] };
  return data.values ?? [];
}

// ─── Config check ─────────────────────────────────────────────────────────────

export function sheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEETS_LEADS_ID
  );
}
