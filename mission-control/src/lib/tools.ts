import fs from "fs";
import path from "path";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "tools.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

export function getTools(): Tool[] {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function getTool(id: string): Tool | undefined {
  return getTools().find((t) => t.id === id);
}

export function saveTool(
  data: Omit<Tool, "id" | "createdAt" | "updatedAt">
): Tool {
  const tools = getTools();
  const tool: Tool = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tools.push(tool);
  fs.writeFileSync(DATA_FILE, JSON.stringify(tools, null, 2));
  return tool;
}

export function updateTool(
  id: string,
  data: Partial<Omit<Tool, "id" | "createdAt">>
): Tool | null {
  const tools = getTools();
  const idx = tools.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tools[idx] = { ...tools[idx], ...data, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(tools, null, 2));
  return tools[idx];
}

export function deleteTool(id: string): boolean {
  const tools = getTools();
  const filtered = tools.filter((t) => t.id !== id);
  if (filtered.length === tools.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
