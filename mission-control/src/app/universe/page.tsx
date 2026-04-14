"use client";

import { useEffect, useRef, useState } from "react";

interface AgentNode {
  id: string;
  name: string;
  codename: string;
  role: string;
  model: string;
  status: "active" | "idle" | "offline";
  mission: string;
  team: "command" | "revenue" | "growth" | "system";
  // layout
  x: number;
  y: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  size: number;
}

const TEAM_COLORS = {
  command: { primary: "#a78bfa", glow: "rgba(167,139,250,0.6)", dim: "rgba(167,139,250,0.15)" },
  revenue: { primary: "#34d399", glow: "rgba(52,211,153,0.6)",  dim: "rgba(52,211,153,0.15)" },
  growth:  { primary: "#60a5fa", glow: "rgba(96,165,250,0.6)",  dim: "rgba(96,165,250,0.15)" },
  system:  { primary: "#fbbf24", glow: "rgba(251,191,36,0.6)",  dim: "rgba(251,191,36,0.15)" },
};

const STATUS_OPACITY = { active: 1, idle: 0.55, offline: 0.25 };

const AGENTS: Omit<AgentNode, "x" | "y">[] = [
  { id: "fupie",    name: "Fupie",    codename: "The Brain",       role: "Command",      model: "Claude Opus 4.6",   status: "active",  mission: "Primary AI assistant and strategic brain.", team: "command", orbitRadius: 0,   orbitSpeed: 0,     orbitOffset: 0,    size: 52 },
  { id: "scout",    name: "Scout",    codename: "Lead Hunter",     role: "Prospecting",  model: "Gemma 4 31B",       status: "active",  mission: "Researches Houston-area small businesses.", team: "revenue", orbitRadius: 28,  orbitSpeed: 0.4,   orbitOffset: 0,    size: 36 },
  { id: "quill",    name: "Quill",    codename: "Outreach Writer", role: "Outreach",     model: "Gemma 4 31B",       status: "active",  mission: "Crafts personalized cold emails.",          team: "revenue", orbitRadius: 24,  orbitSpeed: 0.35,  orbitOffset: 2.1,  size: 36 },
  { id: "echo",     name: "Echo",     codename: "Follow-Up",       role: "Persistence",  model: "Gemma 4 31B",       status: "active",  mission: "Manages follow-up sequences.",              team: "revenue", orbitRadius: 30,  orbitSpeed: 0.3,   orbitOffset: 4.2,  size: 36 },
  { id: "forge",    name: "Forge",    codename: "Proposal",        role: "Closing",      model: "DeepSeek V3",       status: "idle",    mission: "Drafts tailored proposals.",                team: "revenue", orbitRadius: 22,  orbitSpeed: 0.45,  orbitOffset: 1.0,  size: 34 },
  { id: "muse",     name: "Muse",     codename: "Content",         role: "Growth",       model: "Gemini 3 Flash",    status: "idle",    mission: "Creates social media content.",             team: "growth",  orbitRadius: 26,  orbitSpeed: 0.38,  orbitOffset: 0,    size: 36 },
  { id: "sentinel", name: "Sentinel", codename: "Reputation",      role: "Retention",    model: "Gemma 4 31B",       status: "offline", mission: "Monitors client presence.",                 team: "growth",  orbitRadius: 22,  orbitSpeed: 0.42,  orbitOffset: 3.1,  size: 32 },
  { id: "pulse",    name: "Pulse",    codename: "Heartbeat",       role: "Background",   model: "Gemma 4 local",     status: "active",  mission: "Periodic check-ins and monitoring.",        team: "system",  orbitRadius: 20,  orbitSpeed: 0.5,   orbitOffset: 0,    size: 34 },
  { id: "vault",    name: "Vault",    codename: "Memory",          role: "Memory",       model: "Gemma 4 local",     status: "active",  mission: "Distills long-term memory.",                team: "system",  orbitRadius: 25,  orbitSpeed: 0.44,  orbitOffset: 2.0,  size: 34 },
  { id: "orbit",    name: "Orbit",    codename: "Mission Ctrl",    role: "Interface",    model: "Next.js",           status: "active",  mission: "Visual command center.",                    team: "system",  orbitRadius: 18,  orbitSpeed: 0.36,  orbitOffset: 4.5,  size: 32 },
];

// Team cluster centers (% of container)
const TEAM_CENTERS = {
  command: { cx: 50, cy: 46 },
  revenue: { cx: 25, cy: 30 },
  growth:  { cx: 75, cy: 30 },
  system:  { cx: 50, cy: 72 },
};

// Connection pairs (team → team)
const CONNECTIONS: [string, string][] = [
  ["fupie", "scout"], ["fupie", "muse"], ["fupie", "pulse"],
  ["scout", "quill"], ["quill", "echo"], ["echo", "forge"],
  ["muse", "sentinel"], ["pulse", "vault"], ["vault", "orbit"],
];

function AgentOrb({
  agent,
  cx,
  cy,
  selected,
  onClick,
  containerW,
  containerH,
}: {
  agent: AgentNode;
  cx: number;
  cy: number;
  selected: boolean;
  onClick: () => void;
  containerW: number;
  containerH: number;
}) {
  const color = TEAM_COLORS[agent.team];
  const opacity = STATUS_OPACITY[agent.status];
  const px = (cx / 100) * containerW;
  const py = (cy / 100) * containerH;

  return (
    <g
      transform={`translate(${px}, ${py})`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Outer glow ring */}
      {agent.status === "active" && (
        <circle
          r={agent.size * 0.9}
          fill="none"
          stroke={color.glow}
          strokeWidth="1"
          opacity={0.4}
        >
          <animate attributeName="r" values={`${agent.size * 0.85};${agent.size * 1.1};${agent.size * 0.85}`} dur={`${3 + Math.random() * 2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur={`${3 + Math.random() * 2}s`} repeatCount="indefinite" />
        </circle>
      )}

      {/* Selection ring */}
      {selected && (
        <circle
          r={agent.size * 1.15}
          fill="none"
          stroke={color.primary}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity={0.8}
        >
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Main orb */}
      <circle
        r={agent.size * 0.5}
        fill={`url(#grad-${agent.id})`}
        opacity={opacity}
        style={{ filter: `drop-shadow(0 0 ${agent.size * 0.4}px ${color.glow})` }}
      />

      {/* Glass sheen */}
      <ellipse
        cx={-agent.size * 0.08}
        cy={-agent.size * 0.14}
        rx={agent.size * 0.18}
        ry={agent.size * 0.12}
        fill="rgba(255,255,255,0.25)"
        opacity={opacity * 0.7}
        transform="rotate(-30)"
      />

      {/* Name */}
      <text
        y={agent.size * 0.5 + 14}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={color.primary}
        opacity={opacity}
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {agent.name}
      </text>
      <text
        y={agent.size * 0.5 + 26}
        textAnchor="middle"
        fontSize="9"
        fill="rgba(255,255,255,0.45)"
        opacity={opacity}
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {agent.codename}
      </text>

      {/* Gradient def */}
      <defs>
        <radialGradient id={`grad-${agent.id}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="40%" stopColor={color.primary} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color.dim.replace("0.15", "0.9")} />
        </radialGradient>
      </defs>
    </g>
  );
}

export default function UniversePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const loop = () => {
      setTick(Date.now() - startRef.current);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Compute live positions
  const positions: Record<string, { cx: number; cy: number }> = {};
  for (const a of AGENTS) {
    const base = TEAM_CENTERS[a.team];
    if (a.orbitRadius === 0) {
      positions[a.id] = { cx: base.cx, cy: base.cy };
    } else {
      const t = (tick / 1000) * a.orbitSpeed + a.orbitOffset;
      // Scale orbit to % of container
      const rX = (a.orbitRadius / dims.w) * 100 * 2.2;
      const rY = (a.orbitRadius / dims.h) * 100 * 2.8;
      positions[a.id] = {
        cx: base.cx + Math.cos(t) * rX,
        cy: base.cy + Math.sin(t) * rY,
      };
    }
  }

  const selectedAgent = AGENTS.find((a) => a.id === selected) ?? null;

  return (
    <div className="relative h-full flex flex-col overflow-hidden" style={{ height: "calc(100vh - 0px)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between shrink-0 border-b border-border glass-panel z-10">
        <div>
          <h1 className="text-[14px] font-semibold text-foreground">Agent Universe</h1>
          <p className="text-[11px] text-muted mt-0.5">
            {AGENTS.filter((a) => a.status === "active").length} active ·{" "}
            {AGENTS.filter((a) => a.status === "idle").length} idle ·{" "}
            {AGENTS.filter((a) => a.status === "offline").length} offline
          </p>
        </div>
        <div className="flex gap-3 text-[11px]">
          {Object.entries(TEAM_COLORS).map(([team, c]) => (
            <div key={team} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: c.primary, boxShadow: `0 0 6px ${c.glow}` }} />
              <span className="text-muted capitalize">{team}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <svg width={dims.w} height={dims.h} className="absolute inset-0">
          <defs>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Connection lines */}
          {CONNECTIONS.map(([from, to]) => {
            const a = positions[from];
            const b = positions[to];
            if (!a || !b) return null;
            const ax = (a.cx / 100) * dims.w;
            const ay = (a.cy / 100) * dims.h;
            const bx = (b.cx / 100) * dims.w;
            const by = (b.cy / 100) * dims.h;
            const fromAgent = AGENTS.find((ag) => ag.id === from)!;
            const toAgent = AGENTS.find((ag) => ag.id === to)!;
            const active = fromAgent.status === "active" && toAgent.status === "active";
            return (
              <line
                key={`${from}-${to}`}
                x1={ax} y1={ay} x2={bx} y2={by}
                stroke={active ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.06)"}
                strokeWidth={active ? 1 : 0.5}
                strokeDasharray={active ? "none" : "3 4"}
              />
            );
          })}

          {/* Animated data pulses on active connections */}
          {CONNECTIONS.filter(([f, t]) => {
            const fa = AGENTS.find((a) => a.id === f);
            const ta = AGENTS.find((a) => a.id === t);
            return fa?.status === "active" && ta?.status === "active";
          }).map(([from, to]) => {
            const a = positions[from];
            const b = positions[to];
            if (!a || !b) return null;
            const ax = (a.cx / 100) * dims.w;
            const ay = (a.cy / 100) * dims.h;
            const bx = (b.cx / 100) * dims.w;
            const by = (b.cy / 100) * dims.h;
            return (
              <circle key={`pulse-${from}-${to}`} r="2" fill="rgba(167,139,250,0.8)">
                <animateMotion
                  dur={`${2.5 + Math.random() * 2}s`}
                  repeatCount="indefinite"
                  path={`M ${ax} ${ay} L ${bx} ${by}`}
                />
              </circle>
            );
          })}

          {/* Agent orbs */}
          {AGENTS.map((agent) => (
            <AgentOrb
              key={agent.id}
              agent={{ ...agent, x: 0, y: 0 }}
              cx={positions[agent.id]?.cx ?? 50}
              cy={positions[agent.id]?.cy ?? 50}
              selected={selected === agent.id}
              onClick={() => setSelected(selected === agent.id ? null : agent.id)}
              containerW={dims.w}
              containerH={dims.h}
            />
          ))}
        </svg>
      </div>

      {/* Agent detail panel */}
      {selectedAgent && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[420px] glass-panel border border-card-border rounded-xl px-5 py-4 z-20">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: TEAM_COLORS[selectedAgent.team].primary,
                    boxShadow: `0 0 8px ${TEAM_COLORS[selectedAgent.team].glow}`,
                  }}
                />
                <span className="text-[14px] font-semibold">{selectedAgent.name}</span>
                <span className="text-[10px] text-muted-2 bg-card-bg border border-card-border px-1.5 py-0.5 rounded">
                  {selectedAgent.codename}
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">{selectedAgent.role} · {selectedAgent.model}</p>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                selectedAgent.status === "active"
                  ? "text-success border-success bg-success-subtle"
                  : selectedAgent.status === "idle"
                  ? "text-warning border-warning bg-warning/10"
                  : "text-muted border-border bg-card-bg"
              }`}
            >
              {selectedAgent.status}
            </span>
          </div>
          <p className="text-[12px] text-muted leading-relaxed">{selectedAgent.mission}</p>
          <button
            onClick={() => setSelected(null)}
            className="mt-3 text-[10px] text-muted-2 hover:text-muted transition-colors"
          >
            dismiss
          </button>
        </div>
      )}
    </div>
  );
}
