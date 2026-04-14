import { NextResponse } from "next/server";
import { readSheet, sheetsConfigured } from "@/lib/sheets";

export interface RevenueData {
  totalRevenue: number;       // all-time gross
  monthRevenue: number;       // current calendar month
  totalSales: number;         // unit count all-time
  monthSales: number;         // unit count this month
  mrr: number;                // active recurring clients × $99
  activeClients: number;
  proposals: number;          // proposals sent
  proposalsWon: number;
  avgDealSize: number;
  configured: boolean;
}

const FALLBACK: RevenueData = {
  totalRevenue: 0, monthRevenue: 0,
  totalSales: 0, monthSales: 0,
  mrr: 0, activeClients: 0,
  proposals: 0, proposalsWon: 0,
  avgDealSize: 0, configured: false,
};

export async function GET() {
  if (!sheetsConfigured() || !process.env.GOOGLE_SHEETS_BUYERS_ID) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const buyersId = process.env.GOOGLE_SHEETS_BUYERS_ID!;
    const thisMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

    // Gumroad buyers — columns: Date(0) Source(1) Name(2) Email(3) Product(4) Amount(5) Status(6)
    const buyerRows = await readSheet(buyersId, "Buyers!A2:G");

    let totalRevenue = 0, monthRevenue = 0, totalSales = 0, monthSales = 0;

    for (const row of buyerRows) {
      const date = (row[0] ?? "").slice(0, 7);
      const amount = parseFloat((row[5] ?? "0").replace(/[^0-9.]/g, "")) || 0;
      totalRevenue += amount;
      totalSales++;
      if (date === thisMonth) {
        monthRevenue += amount;
        monthSales++;
      }
    }

    // Service clients — columns: Date(0) Business(1) Email(2) Service(3) Amount(4) Recurring(5) Status(6)
    let activeClients = 0, mrr = 0, proposals = 0, proposalsWon = 0, serviceRevenue = 0;
    if (process.env.GOOGLE_SHEETS_INBOUND_ID) {
      const clientRows = await readSheet(process.env.GOOGLE_SHEETS_INBOUND_ID, "Clients!A2:G");
      for (const row of clientRows) {
        const status = (row[6] ?? "").toLowerCase();
        const recurring = parseFloat((row[5] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        const amount = parseFloat((row[4] ?? "0").replace(/[^0-9.]/g, "")) || 0;
        if (status === "active") {
          activeClients++;
          mrr += recurring;
          serviceRevenue += amount;
        }
        if (status === "proposal_sent") proposals++;
        if (status === "won" || status === "active") proposalsWon++;
      }
      totalRevenue += serviceRevenue;
    }

    const avgDealSize =
      proposalsWon > 0 ? Math.round(serviceRevenue / proposalsWon) : 0;

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue),
      monthRevenue: Math.round(monthRevenue),
      totalSales, monthSales,
      mrr: Math.round(mrr),
      activeClients, proposals, proposalsWon, avgDealSize,
      configured: true,
    } satisfies RevenueData);
  } catch (err) {
    console.error("[/api/revenue]", err);
    return NextResponse.json({ ...FALLBACK, configured: true, error: String(err) }, { status: 500 });
  }
}
