import { NextRequest, NextResponse } from "next/server";
import {
  getMemoryEntries,
  getDocuments,
  getDocumentContent,
  getAgents,
  getActivityEvents,
  getModelUsage,
} from "@/lib/workspace";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  switch (type) {
    case "memory":
      return NextResponse.json(getMemoryEntries());
    case "documents":
      return NextResponse.json(getDocuments());
    case "document": {
      const filePath = searchParams.get("path");
      if (!filePath)
        return NextResponse.json({ error: "Path required" }, { status: 400 });
      const content = getDocumentContent(filePath);
      if (content === null)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ content });
    }
    case "agents":
      return NextResponse.json(getAgents());
    case "activity":
      return NextResponse.json(getActivityEvents());
    case "usage": {
      const windowParam = searchParams.get("window");
      const windowDays = windowParam ? parseInt(windowParam, 10) : undefined;
      return NextResponse.json(getModelUsage(windowDays));
    }
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}
