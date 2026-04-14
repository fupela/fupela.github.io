import { NextResponse } from "next/server";
import { readSheet, sheetsConfigured } from "@/lib/sheets";
import fs from "fs";
import path from "path";

export interface LeadsData {
  total: number;
  hot: number;
  warm: number;
  cool: number;
  sent: number;
  followUp: number;
  warmLeads: number;
  closed: number;
  conversionRate: number; // percent, warm leads / sent
  todayCount: number;
  configured: boolean;
}

const FALLBACK: LeadsData = {
  total: 0, hot: 0, warm: 0, cool: 0,
  sent: 0, followUp: 0, warmLeads: 0, closed: 0,
  conversionRate: 0, todayCount: 0, configured: false,
};

const WORKSPACE = path.resolve(process.cwd(), "..");

function readLocalLeads(): LeadsData {
  const today = new Date().toISOString().slice(0, 10);
  const leadsDir = path.join(WORKSPACE, "leads");
  const sentLogPath = path.join(WORKSPACE, "outreach", "sent-log.json");
  const warmLeadsPath = path.join(WORKSPACE, "outreach", "warm-leads.json");

  let hot = 0, warm = 0, cool = 0, todayCount = 0;

  // Read all lead files
  if (fs.existsSync(leadsDir)) {
    const files = fs.readdirSync(leadsDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(leadsDir, file), "utf-8"));
        const leads = data.leads ?? [];
        const isToday = file.startsWith(today);
        for (const lead of leads) {
          const score = (lead.score ?? "").toUpperCase();
          if (score === "HOT") hot++;
          else if (score === "WARM") warm++;
          else if (score === "COOL") cool++;
          if (isToday) todayCount++;
        }
      } catch { /* skip malformed */ }
    }
  }

  // Read sent log
  let sent = 0, followUp = 0;
  if (fs.existsSync(sentLogPath)) {
    try {
      const entries = JSON.parse(fs.readFileSync(sentLogPath, "utf-8")) as Array<Record<string, string>>;
      for (const entry of entries) {
        const status = (entry.status ?? "").toLowerCase();
        if (status === "sent") sent++;
        if (entry.followUp3 || entry.followUp7 || entry.followUp14) followUp++;
      }
    } catch { /* skip */ }
  }

  // Read warm leads
  let warmLeads = 0;
  if (fs.existsSync(warmLeadsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(warmLeadsPath, "utf-8"));
      const leads = Array.isArray(data) ? data : (data.leads ?? []);
      warmLeads = leads.filter((l: Record<string, string>) => (l.status ?? "").toLowerCase() !== "closed").length;
    } catch { /* skip */ }
  }

  const total = hot + warm + cool;
  const conversionRate = sent > 0 ? Math.round((warmLeads / sent) * 100) : 0;

  return {
    total, hot, warm, cool,
    sent, followUp, warmLeads, closed: 0,
    conversionRate, todayCount, configured: true,
  };
}

export async function GET() {
  if (!sheetsConfigured()) {
    return NextResponse.json(readLocalLeads());
  }

  try {
    const sheetId = process.env.GOOGLE_SHEETS_LEADS_ID!;
    const rows = await readSheet(sheetId, "Leads!A2:L");

    const today = new Date().toISOString().slice(0, 10);
    let hot = 0, warm = 0, cool = 0;
    let sent = 0, followUp = 0, warmLeads = 0, closed = 0;
    let todayCount = 0;

    for (const row of rows) {
      const score = (row[8] ?? "").toUpperCase();
      const status = (row[11] ?? "").toLowerCase();
      const date = (row[0] ?? "").slice(0, 10);

      if (score === "HOT") hot++;
      else if (score === "WARM") warm++;
      else if (score === "COOL") cool++;

      if (status === "sent") sent++;
      else if (status === "followup1" || status === "followup2") followUp++;
      else if (status === "warm_lead") warmLeads++;
      else if (status === "closed") closed++;

      if (date === today) todayCount++;
    }

    const total = rows.length;
    const conversionRate = sent > 0 ? Math.round((warmLeads / sent) * 100) : 0;

    return NextResponse.json({
      total, hot, warm, cool,
      sent, followUp, warmLeads, closed,
      conversionRate, todayCount,
      configured: true,
    } satisfies LeadsData);
  } catch (err) {
    console.error("[/api/leads]", err);
    return NextResponse.json({ ...FALLBACK, configured: true, error: String(err) }, { status: 500 });
  }
}
