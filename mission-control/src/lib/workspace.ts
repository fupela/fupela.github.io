import fs from "fs";
import path from "path";

const WORKSPACE = path.resolve(process.cwd(), "..");

export interface MemoryEntry {
  date: string;
  content: string;
  lines: string[];
}

export interface WorkspaceFile {
  name: string;
  path: string;
  size: number;
  modified: string;
  type: "file" | "directory";
}

export interface AgentInfo {
  name: string;
  codename: string;
  role: string;
  model: string;
  status: "active" | "idle" | "offline";
  mission: string;
  lastSeen: string;
  costTier: "free" | "cheap" | "moderate" | "premium";
}

/** Read all memory files from the workspace */
export function getMemoryEntries(): MemoryEntry[] {
  const memoryDir = path.join(WORKSPACE, "memory");
  if (!fs.existsSync(memoryDir)) return [];

  const files = fs.readdirSync(memoryDir).filter((f) => f.endsWith(".md"));
  return files
    .map((f) => {
      const content = fs.readFileSync(path.join(memoryDir, f), "utf-8");
      const lines = content
        .split("\n")
        .filter((l) => l.startsWith("- "))
        .map((l) => l.slice(2));
      return {
        date: f.replace(".md", ""),
        content,
        lines,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Read workspace documents */
export function getDocuments(): WorkspaceFile[] {
  const docs: WorkspaceFile[] = [];
  const entries = fs.readdirSync(WORKSPACE, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const fullPath = path.join(WORKSPACE, entry.name);
    const stat = fs.statSync(fullPath);

    if (entry.isDirectory()) {
      // Include top-level directories
      docs.push({
        name: entry.name,
        path: entry.name,
        size: 0,
        modified: stat.mtime.toISOString(),
        type: "directory",
      });
    } else {
      docs.push({
        name: entry.name,
        path: entry.name,
        size: stat.size,
        modified: stat.mtime.toISOString(),
        type: "file",
      });
    }
  }

  return docs.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/** Read a specific document */
export function getDocumentContent(filePath: string): string | null {
  const full = path.join(WORKSPACE, filePath);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return null;
  return fs.readFileSync(full, "utf-8");
}

/** Get agent information from workspace files */
export function getAgents(): AgentInfo[] {
  const agents: AgentInfo[] = [
    // === COMMAND ===
    {
      name: "Fupie",
      codename: "The Brain",
      role: "Command / Strategy",
      model: "Claude Opus 4.6",
      status: "active",
      mission:
        "Primary AI assistant and strategic brain. Handles complex decisions, architecture, business strategy, and direct conversations with John.",
      lastSeen: new Date().toISOString(),
      costTier: "premium",
    },

    // === REVENUE TEAM ===
    {
      name: "Scout",
      codename: "Lead Hunter",
      role: "Revenue / Prospecting",
      model: "Gemma 4 31B",
      status: "active",
      mission:
        "Researches Houston-area small businesses that need websites, payments, or automation. Scores leads by urgency and compiles actionable target lists daily.",
      lastSeen: new Date().toISOString(),
      costTier: "cheap",
    },
    {
      name: "Quill",
      codename: "Outreach Writer",
      role: "Revenue / Outreach",
      model: "Gemma 4 31B",
      status: "active",
      mission:
        "Crafts personalized cold emails from Scout's lead data. Every email is tailored to the specific business — no templates, no spam.",
      lastSeen: new Date().toISOString(),
      costTier: "cheap",
    },
    {
      name: "Echo",
      codename: "Follow-Up Agent",
      role: "Revenue / Persistence",
      model: "Gemma 4 31B",
      status: "active",
      mission:
        "Manages follow-up sequences on day 3, 7, and 14. No lead falls through the cracks. Flags warm replies for Forge.",
      lastSeen: new Date().toISOString(),
      costTier: "cheap",
    },
    {
      name: "Forge",
      codename: "Proposal Drafter",
      role: "Revenue / Closing",
      model: "DeepSeek V3",
      status: "idle",
      mission:
        "When a lead replies interested, drafts a tailored proposal with scope, pricing, and payment link. Makes saying yes effortless.",
      lastSeen: new Date(Date.now() - 1800000).toISOString(),
      costTier: "cheap",
    },

    // === GROWTH TEAM ===
    {
      name: "Muse",
      codename: "Content Creator",
      role: "Growth / Content",
      model: "Gemini 3 Flash",
      status: "idle",
      mission:
        "Creates social media content, blog posts, and Gumroad products. Builds John's brand and drives inbound leads through authentic storytelling.",
      lastSeen: new Date(Date.now() - 3600000).toISOString(),
      costTier: "moderate",
    },
    {
      name: "Sentinel",
      codename: "Reputation Monitor",
      role: "Growth / Retention",
      model: "Gemma 4 31B",
      status: "offline",
      mission:
        "Monitors client Google reviews, website uptime, and online presence. Creates upsell opportunities and check-in reasons. Activates when clients exist.",
      lastSeen: new Date(Date.now() - 86400000).toISOString(),
      costTier: "cheap",
    },

    // === SYSTEM TEAM ===
    {
      name: "Pulse",
      codename: "Heartbeat Monitor",
      role: "System / Background",
      model: "Gemma 4 (local)",
      status: "active",
      mission:
        "Periodic check-ins: monitors email, calendar, weather, and social mentions. Performs proactive background work while John sleeps.",
      lastSeen: new Date().toISOString(),
      costTier: "free",
    },
    {
      name: "Vault",
      codename: "Memory Curator",
      role: "System / Memory",
      model: "Gemma 4 (local)",
      status: "active",
      mission:
        "Reviews daily memory files and distills significant events, lessons, and insights into long-term memory. Your continuity engine.",
      lastSeen: new Date(Date.now() - 3600000).toISOString(),
      costTier: "free",
    },
    {
      name: "Orbit",
      codename: "Mission Control",
      role: "System / Interface",
      model: "Next.js",
      status: "active",
      mission:
        "Visual command center for monitoring agent activity, managing documents, browsing the memory journal, and overseeing the team.",
      lastSeen: new Date().toISOString(),
      costTier: "free",
    },
  ];

  return agents;
}

export interface ModelUsageStat {
  model: string;
  provider: string;
  sessions: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  estimatedCostUsd: number;
}

/** Aggregate per-model billing from OpenClaw sessions only (no Mac subscription data) */
export function getModelUsage(windowDays?: number): ModelUsageStat[] {
  const ocDir = path.join(process.env.HOME || "/Users/fupie", ".openclaw");
  const byModel: Record<string, ModelUsageStat> = {};

  let cutoffMs: number | null = null;
  if (windowDays) {
    cutoffMs = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  }

  function ensure(model: string, provider: string): ModelUsageStat {
    if (!byModel[model]) {
      byModel[model] = {
        model,
        provider,
        sessions: 0,
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        estimatedCostUsd: 0,
      };
    }
    return byModel[model];
  }

  // --- Source 1: All OpenClaw agents' sessions.json ---
  const agentsDir = path.join(ocDir, "agents");
  if (fs.existsSync(agentsDir)) {
    const agentDirs = fs
      .readdirSync(agentsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const agent of agentDirs) {
      const sessionsPath = path.join(
        agentsDir,
        agent,
        "sessions",
        "sessions.json"
      );
      if (!fs.existsSync(sessionsPath)) continue;
      let data: Record<string, Record<string, unknown>>;
      try {
        data = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
      } catch {
        continue;
      }
      for (const session of Object.values(data)) {
        if (typeof session !== "object" || session === null) continue;
        if (cutoffMs !== null) {
          const ts = (session.updatedAt as number) || 0;
          if (ts < cutoffMs) continue;
        }
        const model = (session.model as string) || "unknown";
        const provider = (session.modelProvider as string) || "unknown";
        // Skip subscription-covered providers — not actual OpenClaw API spend
        if (provider === "openai-codex") continue;
        const stat = ensure(model, provider);
        stat.sessions += 1;
        stat.inputTokens += (session.inputTokens as number) || 0;
        stat.outputTokens += (session.outputTokens as number) || 0;
        stat.cacheReadTokens += (session.cacheRead as number) || 0;
        stat.estimatedCostUsd += (session.estimatedCostUsd as number) || 0;
      }
    }
  }

  // --- Source 2: gateway.log CLI exec counts ---
  // These are Claude Code runs triggered by OpenClaw (not Mac subscription)
  const gatewayLog = path.join(ocDir, "logs", "gateway.log");
  const CLI_ALIASES: Record<string, string> = {
    opus: "claude-opus-4-6",
    sonnet: "claude-sonnet-4-6",
    haiku: "claude-haiku-4-5",
  };
  if (fs.existsSync(gatewayLog)) {
    const lines = fs.readFileSync(gatewayLog, "utf-8").split("\n");
    for (const line of lines) {
      if (!line.includes("cli exec:")) continue;
      const tsMatch = line.match(/^(\S+)/);
      if (!tsMatch) continue;
      const ts = new Date(tsMatch[1]).getTime();
      if (isNaN(ts) || (cutoffMs !== null && ts < cutoffMs)) continue;
      const modelMatch = line.match(/model=(\S+)/);
      if (!modelMatch) continue;
      const alias = modelMatch[1].toLowerCase();
      const modelName = CLI_ALIASES[alias] || alias;
      // Only increment session count — cost is already tracked in sessions.json
      const stat = ensure(modelName, "claude-cli");
      if (stat.sessions === 0) stat.sessions += 1; // avoid double-counting if already in sessions.json
    }
  }

  return Object.values(byModel)
    .filter((s) => s.sessions > 0 || s.estimatedCostUsd > 0 || s.inputTokens > 0)
    .sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd || b.inputTokens - a.inputTokens);
}

/** Get recent activity events from workspace */
export function getActivityEvents() {
  const events: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    agent: string;
    icon: string;
  }> = [];

  // Read memory entries for activity
  const memories = getMemoryEntries();
  memories.forEach((mem) => {
    mem.lines.forEach((line, i) => {
      events.push({
        id: `mem-${mem.date}-${i}`,
        type: "memory",
        title: "Memory Recorded",
        description: line,
        timestamp: `${mem.date}T12:00:00Z`,
        agent: "Fupie",
        icon: "brain",
      });
    });
  });

  // Read dream events
  const eventsPath = path.join(WORKSPACE, "memory", ".dreams", "events.jsonl");
  if (fs.existsSync(eventsPath)) {
    const lines = fs
      .readFileSync(eventsPath, "utf-8")
      .split("\n")
      .filter(Boolean);
    lines.forEach((line, i) => {
      try {
        const event = JSON.parse(line);
        events.push({
          id: `dream-${i}`,
          type: "system",
          title: event.type?.replace(/\./g, " ") || "System Event",
          description: `Query: "${event.query?.slice(0, 100) || "N/A"}" — ${event.resultCount || 0} results`,
          timestamp: event.timestamp || new Date().toISOString(),
          agent: "Memory Curator",
          icon: "search",
        });
      } catch {
        // skip malformed lines
      }
    });
  }

  // Check git log for recent commits
  const docs = getDocuments();
  docs.slice(0, 5).forEach((doc, i) => {
    events.push({
      id: `doc-${i}`,
      type: "document",
      title: "Document Updated",
      description: doc.name,
      timestamp: doc.modified,
      agent: "Fupie",
      icon: "file",
    });
  });

  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
