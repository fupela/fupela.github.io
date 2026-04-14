import { NextResponse } from "next/server";
import { readSheet, sheetsConfigured } from "@/lib/sheets";
import fs from "fs";
import path from "path";

export interface ActivityItem {
  agent: string;
  action: string;
  detail: string;
  time: string;       // relative label, e.g. "2m ago"
  timestamp: number;  // epoch ms for sorting
  type: "lead" | "email" | "sale" | "inbound" | "content";
}

export interface ActivityData {
  items: ActivityItem[];
  configured: boolean;
}

function relativeTime(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const WORKSPACE = path.resolve(process.cwd(), "..");

function readLocalActivity(): ActivityItem[] {
  const events: ActivityItem[] = [];
  const today = new Date().toISOString().slice(0, 10);
  const leadsDir = path.join(WORKSPACE, "leads");
  const outreachDir = path.join(WORKSPACE, "outreach");

  // Read today's leads
  const todayLeadsPath = path.join(leadsDir, `${today}.json`);
  if (fs.existsSync(todayLeadsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(todayLeadsPath, "utf-8"));
      const leads = data.leads ?? [];
      const sector = data.sector ?? "businesses";
      events.push({
        agent: "Scout",
        action: `found ${leads.length} leads`,
        detail: `${leads.filter((l: Record<string,string>) => l.score === "HOT").length} HOT · ${leads.filter((l: Record<string,string>) => l.score === "WARM").length} WARM · sector: ${sector}`,
        time: relativeTime(today + "T06:03:00"),
        timestamp: new Date(today + "T06:03:00").getTime(),
        type: "lead",
      });
    } catch { /* skip */ }
  }

  // Read today's outreach drafts
  const todayOutreachPath = path.join(outreachDir, `${today}.json`);
  if (fs.existsSync(todayOutreachPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(todayOutreachPath, "utf-8"));
      const emails = data.emails ?? [];
      const readyCount = emails.filter((e: Record<string,string>) => e.status === "draft" || e.status === "ready").length;
      const needsEmail = emails.filter((e: Record<string,string>) => e.status === "needs_email").length;
      events.push({
        agent: "Quill",
        action: `drafted ${emails.length} emails`,
        detail: `${readyCount} ready to send · ${needsEmail} need email addresses`,
        time: relativeTime(today + "T07:47:00"),
        timestamp: new Date(today + "T07:47:00").getTime(),
        type: "email",
      });
    } catch { /* skip */ }
  }

  // Read sent log for any sent emails
  const sentLogPath = path.join(outreachDir, "sent-log.json");
  if (fs.existsSync(sentLogPath)) {
    try {
      const entries = JSON.parse(fs.readFileSync(sentLogPath, "utf-8")) as Array<Record<string, string>>;
      const todaySent = entries.filter((e) => (e.sentDate ?? "").startsWith(today) && e.status === "sent");
      if (todaySent.length > 0) {
        events.push({
          agent: "Quill",
          action: `sent ${todaySent.length} email${todaySent.length > 1 ? "s" : ""}`,
          detail: todaySent.map((e) => e.business).slice(0, 3).join(", "),
          time: relativeTime(today + "T09:00:00"),
          timestamp: new Date(today + "T09:00:00").getTime(),
          type: "email",
        });
      }
    } catch { /* skip */ }
  }

  // Read today's content
  const contentPath = path.join(WORKSPACE, "content", `${today}.json`);
  if (fs.existsSync(contentPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
      const posts = Array.isArray(data) ? data : (data.posts ?? []);
      if (posts.length > 0) {
        events.push({
          agent: "Muse",
          action: `generated ${posts.length} content pieces`,
          detail: "tweets · Reddit · LinkedIn · TikTok script",
          time: relativeTime(today + "T09:17:00"),
          timestamp: new Date(today + "T09:17:00").getTime(),
          type: "content",
        });
      }
    } catch { /* skip */ }
  }

  return events.sort((a, b) => b.timestamp - a.timestamp);
}

export async function GET() {
  if (!sheetsConfigured()) {
    const items = readLocalActivity();
    return NextResponse.json({ items, configured: true } satisfies ActivityData);
  }

  const events: ActivityItem[] = [];

  try {
    const leadsId = process.env.GOOGLE_SHEETS_LEADS_ID!;
    const leadRows = await readSheet(leadsId, "Leads!A2:L");
    const recentLeads = leadRows.slice(-20).reverse();
    for (const row of recentLeads) {
      const date = row[0] ?? "";
      const business = row[1] ?? "Unknown business";
      const score = (row[8] ?? "").toUpperCase();
      const status = (row[11] ?? "new").toLowerCase();
      if (!date) continue;

      if (status === "sent" || status === "followup1" || status === "followup2") {
        events.push({
          agent: "Quill",
          action: `sent ${status === "sent" ? "initial" : "follow-up"} outreach`,
          detail: `${business} — ${score} lead`,
          time: relativeTime(date),
          timestamp: new Date(date).getTime(),
          type: "email",
        });
      } else {
        events.push({
          agent: "Scout",
          action: `found ${score.toLowerCase()} lead`,
          detail: `${business} — Houston area`,
          time: relativeTime(date),
          timestamp: new Date(date).getTime(),
          type: "lead",
        });
      }
    }
  } catch (err) {
    console.error("[/api/activity] leads:", err);
  }

  if (process.env.GOOGLE_SHEETS_BUYERS_ID) {
    try {
      const rows = await readSheet(process.env.GOOGLE_SHEETS_BUYERS_ID, "Buyers!A2:G");
      for (const row of rows.slice(-10).reverse()) {
        const date = row[0] ?? "";
        const name = row[2] ? `${row[2].split(" ")[0]}` : "Someone";
        const product = row[4] ?? "AI Business Starter Kit";
        const amount = row[5] ?? "$19";
        if (!date) continue;
        events.push({
          agent: "Forge",
          action: "sale completed",
          detail: `${name} bought ${product} for ${amount}`,
          time: relativeTime(date),
          timestamp: new Date(date).getTime(),
          type: "sale",
        });
      }
    } catch (err) {
      console.error("[/api/activity] buyers:", err);
    }
  }

  if (process.env.GOOGLE_SHEETS_INBOUND_ID) {
    try {
      const rows = await readSheet(process.env.GOOGLE_SHEETS_INBOUND_ID, "Inbound Leads!A2:H");
      for (const row of rows.slice(-10).reverse()) {
        const date = row[0] ?? "";
        const source = row[1] ?? "form";
        const name = row[2] ? row[2].split(" ")[0] : "Someone";
        const intent = row[5] ?? "exploring";
        if (!date) continue;
        events.push({
          agent: "Echo",
          action: "inbound lead captured",
          detail: `${name} via ${source} — intent: ${intent}`,
          time: relativeTime(date),
          timestamp: new Date(date).getTime(),
          type: "inbound",
        });
      }
    } catch (err) {
      console.error("[/api/activity] inbound:", err);
    }
  }

  events.sort((a, b) => b.timestamp - a.timestamp);
  const items = events.slice(0, 12);

  return NextResponse.json({ items, configured: true } satisfies ActivityData);
}
