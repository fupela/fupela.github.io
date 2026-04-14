"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Shield,
  Activity,
  Clock,
  Zap,
  Search,
  Brain,
  FileText,
  Send,
  MessageSquare,
  Eye,
  Cpu,
  DollarSign,
} from "lucide-react";

interface AgentInfo {
  name: string;
  codename: string;
  role: string;
  model: string;
  status: "active" | "idle" | "offline";
  mission: string;
  lastSeen: string;
  costTier: "free" | "cheap" | "moderate" | "premium";
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-success/10 text-success border-success/20",
    idle: "bg-warning/10 text-warning border-warning/20",
    offline: "bg-muted-2/10 text-muted-2 border-muted-2/20",
  };
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${styles[status] || styles.offline}`}
    >
      {status}
    </span>
  );
}

function CostBadge({ tier }: { tier: string }) {
  const styles: Record<string, { color: string; label: string }> = {
    free: { color: "text-success bg-success/10", label: "FREE" },
    cheap: { color: "text-accent bg-accent/10", label: "$" },
    moderate: { color: "text-warning bg-warning/10", label: "$$" },
    premium: { color: "text-danger bg-danger/10", label: "$$$" },
  };
  const s = styles[tier] || styles.cheap;
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.color}`}>
      {s.label}
    </span>
  );
}

function AgentIcon({ name }: { name: string }) {
  const icons: Record<string, typeof Bot> = {
    Fupie: Brain,
    Scout: Search,
    Quill: Send,
    Echo: MessageSquare,
    Forge: FileText,
    Muse: Zap,
    Sentinel: Eye,
    Pulse: Activity,
    Vault: Cpu,
    Orbit: Bot,
  };
  const Icon = icons[name] || Bot;
  return <Icon size={20} />;
}

function getRoleColor(role: string) {
  if (role.startsWith("Command")) return "text-accent";
  if (role.startsWith("Revenue")) return "text-success";
  if (role.startsWith("Growth")) return "text-warning";
  if (role.startsWith("System")) return "text-muted";
  return "text-foreground";
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/workspace?type=agents")
      .then((r) => r.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
        if (data.length > 0) setSelected(data[0].name);
      });
  }, []);

  const selectedAgent = agents.find((a) => a.name === selected);

  // Group agents by role category
  const groups = [
    { label: "Command", agents: agents.filter((a) => a.role.startsWith("Command")) },
    { label: "Revenue Team", agents: agents.filter((a) => a.role.startsWith("Revenue")) },
    { label: "Growth Team", agents: agents.filter((a) => a.role.startsWith("Growth")) },
    { label: "System", agents: agents.filter((a) => a.role.startsWith("System")) },
  ].filter((g) => g.agents.length > 0);

  return (
    <div className="p-6 max-w-[1100px]">
      <div className="mb-6">
        <h1 className="text-[15px] font-semibold flex items-center gap-2">
          <Bot size={16} className="text-accent" />
          Agent Roster
        </h1>
        <p className="text-[13px] text-muted mt-0.5">
          {agents.length} agents &mdash; {agents.filter((a) => a.status === "active").length} active
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-[13px] text-muted">Loading agents...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Agent list */}
          <div className="lg:col-span-2 space-y-4">
            {groups.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-[10px] text-muted-2 uppercase tracking-wider font-bold">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-card-border" />
                </div>
                <div className="space-y-1.5">
                  {group.agents.map((agent) => (
                    <button
                      key={agent.name}
                      onClick={() => setSelected(agent.name)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all glass-panel ${
                        selected === agent.name
                          ? "border-accent bg-accent-subtle glow-card"
                          : "border-card-border bg-card-bg hover:border-muted-2"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            selected === agent.name
                              ? "bg-accent/20"
                              : "bg-card-border"
                          } ${getRoleColor(agent.role)}`}
                        >
                          <AgentIcon name={agent.name} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold truncate">
                              {agent.name}
                            </p>
                            <CostBadge tier={agent.costTier} />
                            <StatusBadge status={agent.status} />
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-muted-2">
                              {agent.codename}
                            </p>
                            <span className="text-[9px] text-accent font-mono">
                              {agent.model}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Agent detail */}
          <div className="lg:col-span-3">
            {selectedAgent ? (
              <div className="border border-card-border rounded-lg overflow-hidden glass-panel glow-card">
                {/* Agent header */}
                <div className="px-6 py-5 bg-card-bg border-b border-card-border">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-accent-subtle flex items-center justify-center ${getRoleColor(selectedAgent.role)}`}>
                      <AgentIcon name={selectedAgent.name} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          {selectedAgent.name}
                        </h2>
                        <StatusBadge status={selectedAgent.status} />
                      </div>
                      <p className="text-[12px] text-muted mt-0.5">
                        {selectedAgent.codename} &mdash; {selectedAgent.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mission */}
                <div className="px-6 py-4 border-b border-card-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={13} className="text-muted" />
                    <span className="text-[11px] text-muted uppercase tracking-wider font-medium">
                      Mission
                    </span>
                  </div>
                  <p className="text-[13px] text-foreground leading-relaxed">
                    {selectedAgent.mission}
                  </p>
                </div>

                {/* Stats grid */}
                <div className="px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Cpu size={11} className="text-muted-2" />
                      <span className="text-[10px] text-muted uppercase tracking-wider">Model</span>
                    </div>
                    <p className="text-[12px] font-medium">{selectedAgent.model}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign size={11} className="text-muted-2" />
                      <span className="text-[10px] text-muted uppercase tracking-wider">Cost</span>
                    </div>
                    <CostBadge tier={selectedAgent.costTier} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity size={11} className="text-muted-2" />
                      <span className="text-[10px] text-muted uppercase tracking-wider">Status</span>
                    </div>
                    <p className="text-[12px] font-medium capitalize">{selectedAgent.status}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={11} className="text-muted-2" />
                      <span className="text-[10px] text-muted uppercase tracking-wider">Last Seen</span>
                    </div>
                    <p className="text-[12px] font-medium">{timeAgo(selectedAgent.lastSeen)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-card-border rounded-lg py-16 text-center glass-panel">
                <p className="text-[13px] text-muted">
                  Select an agent to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
