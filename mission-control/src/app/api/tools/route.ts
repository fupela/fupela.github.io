import { NextRequest, NextResponse } from "next/server";
import { getTools, saveTool, updateTool, deleteTool } from "@/lib/tools";

export async function GET() {
  return NextResponse.json(getTools());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, category, code } = body;

  if (!name || !code) {
    return NextResponse.json(
      { error: "Name and code are required" },
      { status: 400 }
    );
  }

  const tool = saveTool({
    name,
    description: description || "",
    category: category || "general",
    code,
  });
  return NextResponse.json(tool, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const tool = updateTool(id, data);
  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }
  return NextResponse.json(tool);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const deleted = deleteTool(id);
  if (!deleted) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
