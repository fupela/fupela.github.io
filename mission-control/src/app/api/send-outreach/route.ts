/**
 * POST /api/send-outreach
 *
 * Reads today's outreach draft file, sends emails via Gmail API,
 * and updates sent-log.json with status="sent".
 *
 * Body (optional): { date: "YYYY-MM-DD" }  — defaults to today
 * Body (optional): { dryRun: true }        — drafts only, no send
 */

import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { sendEmail, gmailConfigured } from "@/lib/gmail";

const WORKSPACE = join(process.env.HOME ?? "/Users/fupie", ".openclaw/workspace");

interface DraftEmail {
  to: string;
  business: string;
  subject: string;
  body: string;
  type: string;
  leadScore: string;
  status: "draft" | "sent" | "failed";
  messageId?: string;
  sentAt?: string;
  error?: string;
}

interface SentLogEntry {
  business: string;
  email: string;
  subject: string;
  sentDate: string;
  status: "draft" | "sent" | "failed";
  followUp3: string | null;
  followUp7: string | null;
  followUp14: string | null;
}

interface SentLog {
  emails: SentLogEntry[];
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { date?: string; dryRun?: boolean };
  const today = body.date ?? new Date().toISOString().slice(0, 10);
  const dryRun = body.dryRun ?? false;

  // ── Read draft file ──────────────────────────────────────────────────────────
  const draftPath = join(WORKSPACE, "outreach", `${today}.json`);
  if (!existsSync(draftPath)) {
    return NextResponse.json(
      { ok: false, error: `No draft file found for ${today} at ${draftPath}` },
      { status: 404 }
    );
  }

  const draftFile = JSON.parse(readFileSync(draftPath, "utf8")) as { emails: DraftEmail[] };
  const pending = draftFile.emails.filter((e) => e.status === "draft");

  if (pending.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No pending drafts" });
  }

  if (!gmailConfigured() && !dryRun) {
    return NextResponse.json(
      { ok: false, error: "Gmail not configured. Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_SENDER_EMAIL in .env.local" },
      { status: 503 }
    );
  }

  // ── Read sent log ────────────────────────────────────────────────────────────
  const logPath = join(WORKSPACE, "outreach", "sent-log.json");
  const log: SentLog = existsSync(logPath)
    ? JSON.parse(readFileSync(logPath, "utf8"))
    : { emails: [] };

  // ── Send emails ──────────────────────────────────────────────────────────────
  const results = { sent: 0, failed: 0, skipped: 0 };

  for (const email of pending) {
    if (!email.to || !email.to.includes("@")) {
      email.status = "failed";
      email.error = "invalid or missing email address";
      results.skipped++;
      continue;
    }

    // Skip if already in sent log
    const alreadySent = log.emails.some(
      (e) => e.email === email.to && e.sentDate === today
    );
    if (alreadySent) {
      results.skipped++;
      continue;
    }

    if (dryRun) {
      results.sent++;
      continue;
    }

    const result = await sendEmail({
      to: email.to,
      subject: email.subject,
      body: email.body,
      replyTo: undefined,
    });

    if (result.ok) {
      email.status = "sent";
      email.sentAt = new Date().toISOString();
      email.messageId = result.messageId;
      results.sent++;

      // Append to sent log
      log.emails.push({
        business: email.business,
        email: email.to,
        subject: email.subject,
        sentDate: today,
        status: "sent",
        followUp3: null,
        followUp7: null,
        followUp14: null,
      });
    } else {
      email.status = "failed";
      email.error = result.error;
      results.failed++;
    }

    // Small delay between sends to avoid rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  // ── Write back ───────────────────────────────────────────────────────────────
  if (!dryRun) {
    writeFileSync(draftPath, JSON.stringify(draftFile, null, 2));
    writeFileSync(logPath, JSON.stringify(log, null, 2));
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    date: today,
    sent: results.sent,
    failed: results.failed,
    skipped: results.skipped,
    total: pending.length,
  });
}

// GET — status check: how many sent today vs pending
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const today = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const draftPath = join(WORKSPACE, "outreach", `${today}.json`);
  const logPath = join(WORKSPACE, "outreach", "sent-log.json");

  const drafts = existsSync(draftPath)
    ? (JSON.parse(readFileSync(draftPath, "utf8")) as { emails: DraftEmail[] }).emails
    : [];

  const log: SentLog = existsSync(logPath)
    ? JSON.parse(readFileSync(logPath, "utf8"))
    : { emails: [] };

  const sentToday = log.emails.filter((e) => e.sentDate === today).length;

  return NextResponse.json({
    date: today,
    drafted: drafts.length,
    pending: drafts.filter((e) => e.status === "draft").length,
    sent: sentToday,
    failed: drafts.filter((e) => e.status === "failed").length,
    gmailConfigured: gmailConfigured(),
  });
}
