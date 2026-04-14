"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { LeadsData } from "@/app/api/leads/route";
import type { RevenueData } from "@/app/api/revenue/route";
import type { ActivityItem } from "@/app/api/activity/route";

// ─── Dashboard data hook ──────────────────────────────────────────────────────

interface DashData {
  leads: LeadsData | null;
  revenue: RevenueData | null;
  activity: ActivityItem[];
  lastFetched: Date | null;
}

function useDashData(): DashData {
  const [data, setData] = useState<DashData>({
    leads: null, revenue: null, activity: [], lastFetched: null,
  });

  const fetchAll = useCallback(async () => {
    try {
      const [leadsRes, revenueRes, activityRes] = await Promise.allSettled([
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/revenue").then((r) => r.json()),
        fetch("/api/activity").then((r) => r.json()),
      ]);
      setData({
        leads: leadsRes.status === "fulfilled" ? leadsRes.value : null,
        revenue: revenueRes.status === "fulfilled" ? revenueRes.value : null,
        activity:
          activityRes.status === "fulfilled" ? activityRes.value.items ?? [] : [],
        lastFetched: new Date(),
      });
    } catch {
      // silently keep previous data on network error
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(t);
  }, [fetchAll]);

  return data;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Agent {
  name: string;
  role: string;
  model: string;
  status: "active" | "idle" | "processing" | "sleeping";
  color: string;
  icon: string;
  tasksCompleted: number;
  tokensUsed: number;
  avgResponseTime: number;
  uptime: number;
  lastActive: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface DataFlow {
  id: number;
  fromAgent: number;
  toAgent: number;
  progress: number;
  color: string;
}

// ─── Agent Data ──────────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  {
    name: "Fupie",
    role: "The Brain",
    model: "Claude Opus 4.6",
    status: "active",
    color: "#a855f7",
    icon: "🧠",
    tasksCompleted: 1247,
    tokensUsed: 3_300_000,
    avgResponseTime: 4.2,
    uptime: 99.7,
    lastActive: "Just now",
  },
  {
    name: "Scout",
    role: "Lead Hunter",
    model: "Gemma 4 31B",
    status: "processing",
    color: "#3b82f6",
    icon: "🔍",
    tasksCompleted: 892,
    tokensUsed: 1_800_000,
    avgResponseTime: 2.8,
    uptime: 98.2,
    lastActive: "2m ago",
  },
  {
    name: "Quill",
    role: "Outreach Writer",
    model: "Gemma 4 31B",
    status: "active",
    color: "#10b981",
    icon: "✍️",
    tasksCompleted: 634,
    tokensUsed: 2_100_000,
    avgResponseTime: 3.5,
    uptime: 97.8,
    lastActive: "1m ago",
  },
  {
    name: "Echo",
    role: "Follow-Up Agent",
    model: "Gemma 4 31B",
    status: "idle",
    color: "#f59e0b",
    icon: "📡",
    tasksCompleted: 456,
    tokensUsed: 980_000,
    avgResponseTime: 2.1,
    uptime: 96.5,
    lastActive: "5m ago",
  },
  {
    name: "Forge",
    role: "Proposal Drafter",
    model: "DeepSeek V3",
    status: "processing",
    color: "#ef4444",
    icon: "⚒️",
    tasksCompleted: 312,
    tokensUsed: 1_500_000,
    avgResponseTime: 5.1,
    uptime: 95.3,
    lastActive: "3m ago",
  },
  {
    name: "Muse",
    role: "Content Creator",
    model: "Gemini 3 Flash",
    status: "active",
    color: "#ec4899",
    icon: "🎨",
    tasksCompleted: 578,
    tokensUsed: 1_200_000,
    avgResponseTime: 1.9,
    uptime: 98.9,
    lastActive: "Just now",
  },
  {
    name: "Sentinel",
    role: "Reputation Monitor",
    model: "Gemma 4 31B",
    status: "sleeping",
    color: "#6366f1",
    icon: "🛡️",
    tasksCompleted: 203,
    tokensUsed: 450_000,
    avgResponseTime: 1.5,
    uptime: 99.1,
    lastActive: "12m ago",
  },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// ─── Animated Background Canvas ──────────────────────────────────────────────

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: randomBetween(-0.3, 0.3),
        vy: randomBetween(-0.3, 0.3),
        size: randomBetween(1, 3),
        opacity: randomBetween(0.1, 0.4),
        color: ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"][
          Math.floor(Math.random() * 5)
        ],
        life: 0,
        maxLife: randomBetween(200, 600),
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const fadeIn = Math.min(p.life / 60, 1);
        const fadeOut = Math.max(1 - (p.life - p.maxLife + 60) / 60, 0);
        const alpha = p.opacity * fadeIn * (p.life > p.maxLife - 60 ? fadeOut : 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();

        if (p.life > p.maxLife) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = 0;
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Pulsing Agent Node (for orbital view) ───────────────────────────────────

function AgentOrbitNode({
  agent,
  angle,
  radius,
  selected,
  onClick,
}: {
  agent: Agent;
  angle: number;
  radius: number;
  selected: boolean;
  onClick: () => void;
}) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const x = Math.cos((angle * Math.PI) / 180) * radius + 50;
  const y = Math.sin((angle * Math.PI) / 180) * radius + 50;

  const pulseScale =
    agent.status === "processing"
      ? 1 + Math.sin((pulse * Math.PI) / 45) * 0.15
      : agent.status === "active"
        ? 1 + Math.sin((pulse * Math.PI) / 90) * 0.08
        : 1;

  const glowIntensity =
    agent.status === "processing" ? 20 : agent.status === "active" ? 12 : 6;

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      style={{ transform: `translate(${x}%, ${y}%)` }}
    >
      <circle
        cx="0"
        cy="0"
        r={selected ? 32 : 26}
        fill="rgba(15, 10, 30, 0.8)"
        stroke={agent.color}
        strokeWidth={selected ? 2.5 : 1.5}
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px ${agent.color})`,
          transform: `scale(${pulseScale})`,
          transformOrigin: "center",
          transition: "r 0.3s ease",
        }}
      />
      <text
        x="0"
        y="2"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="20"
        style={{ pointerEvents: "none" }}
      >
        {agent.icon}
      </text>
      <text
        x="0"
        y={selected ? 46 : 40}
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="600"
        style={{ pointerEvents: "none" }}
      >
        {agent.name}
      </text>
      <text
        x="0"
        y={selected ? 58 : 52}
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize="7"
        style={{ pointerEvents: "none" }}
      >
        {agent.role}
      </text>
      {/* Status indicator dot */}
      <circle
        cx="18"
        cy="-18"
        r="4"
        fill={
          agent.status === "active"
            ? "#10b981"
            : agent.status === "processing"
              ? "#f59e0b"
              : agent.status === "idle"
                ? "#6b7280"
                : "#374151"
        }
        style={{
          filter:
            agent.status === "active" || agent.status === "processing"
              ? `drop-shadow(0 0 4px ${agent.status === "active" ? "#10b981" : "#f59e0b"})`
              : "none",
        }}
      />
    </g>
  );
}

// ─── Data Flow Line (animated) ───────────────────────────────────────────────

function DataFlowLine({
  flow,
  agentPositions,
}: {
  flow: DataFlow;
  agentPositions: { x: number; y: number }[];
}) {
  const from = agentPositions[flow.fromAgent];
  const to = agentPositions[flow.toAgent];
  if (!from || !to) return null;

  const dashOffset = -flow.progress * 3;

  return (
    <line
      x1={`${from.x}%`}
      y1={`${from.y}%`}
      x2={`${to.x}%`}
      y2={`${to.y}%`}
      stroke={flow.color}
      strokeWidth="1.5"
      strokeDasharray="6 4"
      strokeDashoffset={dashOffset}
      opacity="0.4"
      style={{
        filter: `drop-shadow(0 0 3px ${flow.color})`,
      }}
    />
  );
}

// ─── Stat Card (glassmorphism) ───────────────────────────────────────────────

function GlassCard({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:border-opacity-60"
      style={{
        background: "rgba(15, 10, 40, 0.6)",
        borderColor: color + "40",
        boxShadow: `0 0 20px ${color}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Animated gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: color + "aa" }}>
            {title}
          </p>
          <p className="text-2xl font-bold mt-1 text-white">{value}</p>
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl">{icon}</span>
          {trend && (
            <span
              className="text-xs mt-2 px-1.5 py-0.5 rounded-full"
              style={{
                background: trend.startsWith("+") ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                color: trend.startsWith("+") ? "#10b981" : "#ef4444",
              }}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Activity Feed Item ──────────────────────────────────────────────────────

function ActivityItem({
  agent,
  action,
  time,
  detail,
}: {
  agent: string;
  action: string;
  time: string;
  detail?: string;
}) {
  const agentData = AGENTS.find((a) => a.name === agent);
  return (
    <div
      className="flex items-start gap-3 py-2.5 px-3 rounded-lg transition-colors duration-200"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
        style={{
          background: (agentData?.color || "#6366f1") + "20",
          border: `1px solid ${agentData?.color || "#6366f1"}40`,
        }}
      >
        {agentData?.icon || "🤖"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white">
          <span className="font-semibold" style={{ color: agentData?.color || "#a855f7" }}>
            {agent}
          </span>{" "}
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{action}</span>
        </p>
        {detail && (
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            {detail}
          </p>
        )}
      </div>
      <span className="text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
        {time}
      </span>
    </div>
  );
}

// ─── Mini Bar Chart ──────────────────────────────────────────────────────────

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-500"
          style={{
            height: `${(v / max) * 100}%`,
            background: `linear-gradient(to top, ${color}80, ${color})`,
            opacity: 0.4 + (i / data.length) * 0.6,
            animation: `barGrow 0.6s ease-out ${i * 0.05}s both`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Agent Detail Panel ──────────────────────────────────────────────────────

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const mockActivity = [12, 18, 8, 22, 15, 28, 20, 25, 30, 18, 22, 35];

  return (
    <div
      className="rounded-xl p-5 backdrop-blur-md border"
      style={{
        background: "rgba(15, 10, 40, 0.7)",
        borderColor: agent.color + "30",
        boxShadow: `0 0 30px ${agent.color}20`,
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{
              background: agent.color + "20",
              border: `1px solid ${agent.color}40`,
              boxShadow: `0 0 15px ${agent.color}30`,
            }}
          >
            {agent.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{agent.name}</h3>
            <p className="text-xs" style={{ color: agent.color }}>
              {agent.role} — {agent.model}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Tasks Done", value: agent.tasksCompleted.toLocaleString(), icon: "✅" },
          { label: "Tokens Used", value: formatTokens(agent.tokensUsed), icon: "🔤" },
          { label: "Avg Response", value: agent.avgResponseTime + "s", icon: "⚡" },
          { label: "Uptime", value: agent.uptime + "%", icon: "📈" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center py-2 px-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <span className="text-lg">{stat.icon}</span>
            <p className="text-sm font-bold text-white mt-1">{stat.value}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          Activity (Last 12 Hours)
        </p>
        <MiniBarChart data={mockActivity} color={agent.color} />
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function MissionControlDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [time, setTime] = useState(new Date());
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([]);
  const [liveTokens, setLiveTokens] = useState(11_330_000);
  const [liveEvents, setLiveEvents] = useState(39);
  const [liveMemories, setLiveMemories] = useState(32);
  const dash = useDashData();

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Orbit rotation
  useEffect(() => {
    const t = setInterval(() => setOrbitAngle((a) => (a + 0.15) % 360), 50);
    return () => clearInterval(t);
  }, []);

  // Simulate data flows between agents
  useEffect(() => {
    const t = setInterval(() => {
      setDataFlows((flows) => {
        const updated = flows
          .map((f) => ({ ...f, progress: f.progress + 2 }))
          .filter((f) => f.progress < 100);

        if (Math.random() > 0.6 && updated.length < 4) {
          const from = Math.floor(Math.random() * AGENTS.length);
          let to = Math.floor(Math.random() * AGENTS.length);
          while (to === from) to = Math.floor(Math.random() * AGENTS.length);
          updated.push({
            id: Date.now(),
            fromAgent: from,
            toAgent: to,
            progress: 0,
            color: AGENTS[from].color,
          });
        }
        return updated;
      });
    }, 100);
    return () => clearInterval(t);
  }, []);

  // Simulate live counters
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.7) setLiveTokens((v) => v + Math.floor(Math.random() * 5000));
      if (Math.random() > 0.9) setLiveEvents((v) => v + 1);
      if (Math.random() > 0.95) setLiveMemories((v) => v + 1);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  // Calculate agent positions on orbit
  const agentPositions = AGENTS.map((_, i) => {
    const angle = orbitAngle + (i * 360) / AGENTS.length;
    const radius = 35;
    return {
      x: Math.cos((angle * Math.PI) / 180) * radius + 50,
      y: Math.sin((angle * Math.PI) / 180) * radius + 50,
    };
  });

  const activeCount = AGENTS.filter((a) => a.status === "active" || a.status === "processing").length;
  const totalTasks = AGENTS.reduce((s, a) => s + a.tasksCompleted, 0);

  const activityFeed =
    dash.activity.length > 0
      ? dash.activity
      : [
          { agent: "Scout", action: "waiting for first run", time: "—", detail: "Wire the Lead Hunter cron to start" },
          { agent: "Quill", action: "standing by", time: "—", detail: "Outreach sends after first leads arrive" },
          { agent: "Forge", action: "ready", time: "—", detail: "Proposal Drafter fires on warm replies" },
          { agent: "Echo", action: "ready", time: "—", detail: "Follow-up sequences activate day 3/7/14" },
        ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#060212" }}>
      {/* Animated particle background */}
      <ParticleBackground />

      {/* Radial gradient overlays */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      {/* Content layer */}
      <div className="relative z-10">
        {/* Top bar */}
        <header
          className="border-b px-6 py-3 flex items-center justify-between backdrop-blur-sm"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(6, 2, 18, 0.7)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #6366f1)",
                  boxShadow: "0 0 15px rgba(139,92,246,0.4)",
                }}
              >
                <span className="text-lg font-black">J</span>
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wide">JEDAIFLOW</h1>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Mission Control v2.0
                </p>
              </div>
            </div>
            <div
              className="h-6 w-px mx-2"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#10b981",
                  boxShadow: "0 0 8px #10b981",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                All Systems Operational
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
              {time.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              OpenClaw v2026.4.11
            </span>
          </div>
        </header>

        <main className="p-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <GlassCard
              title="Active Agents"
              value={`${activeCount} / ${AGENTS.length}`}
              subtitle="Processing tasks"
              icon="🤖"
              color="#a855f7"
              trend="+2"
            />
            <GlassCard
              title="Tasks Completed"
              value={totalTasks.toLocaleString()}
              subtitle="All agents combined"
              icon="✅"
              color="#10b981"
              trend="+127"
            />
            <GlassCard
              title="Total Tokens"
              value={formatTokens(liveTokens)}
              subtitle="Across all models"
              icon="🔤"
              color="#3b82f6"
              trend="+248K"
            />
            <GlassCard
              title="Events Today"
              value={liveEvents}
              subtitle="Actions & triggers"
              icon="⚡"
              color="#f59e0b"
              trend="+12"
            />
            <GlassCard
              title="Memories"
              value={liveMemories}
              subtitle="Knowledge entries"
              icon="🧠"
              color="#ec4899"
              trend="+4"
            />
            <GlassCard
              title="Avg Response"
              value="3.0s"
              subtitle="Fleet average"
              icon="🏎️"
              color="#6366f1"
              trend="-0.8s"
            />
          </div>

          {/* Main Grid: Orbital View + Detail + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Agent Orbital View */}
            <div className="lg:col-span-5">
              <div
                className="rounded-xl border overflow-hidden backdrop-blur-md"
                style={{
                  background: "rgba(15, 10, 40, 0.5)",
                  borderColor: "rgba(255,255,255,0.06)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.05)",
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <h2 className="text-sm font-semibold text-white/80">Agent Network</h2>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Live agent communication & task flow
                  </p>
                </div>
                <div className="p-4">
                  <svg viewBox="-20 -20 140 140" className="w-full" style={{ maxHeight: "380px" }}>
                    {/* Orbit ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke="rgba(139,92,246,0.1)"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke="rgba(139,92,246,0.06)"
                      strokeWidth="12"
                    />

                    {/* Data flow lines */}
                    {dataFlows.map((flow) => (
                      <DataFlowLine
                        key={flow.id}
                        flow={flow}
                        agentPositions={agentPositions}
                      />
                    ))}

                    {/* Center hub */}
                    <circle cx="50" cy="50" r="8" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5" />
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="5" fontWeight="bold">
                      HUB
                    </text>

                    {/* Agent nodes */}
                    {AGENTS.map((agent, i) => (
                      <AgentOrbitNode
                        key={agent.name}
                        agent={agent}
                        angle={orbitAngle + (i * 360) / AGENTS.length}
                        radius={35}
                        selected={selectedAgent === i}
                        onClick={() => setSelectedAgent(selectedAgent === i ? null : i)}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Agent Detail + Status Grid */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Selected Agent Detail */}
              {selectedAgent !== null ? (
                <AgentDetailPanel
                  agent={AGENTS[selectedAgent]}
                  onClose={() => setSelectedAgent(null)}
                />
              ) : (
                <div
                  className="rounded-xl p-5 backdrop-blur-md border flex items-center justify-center"
                  style={{
                    background: "rgba(15, 10, 40, 0.5)",
                    borderColor: "rgba(255,255,255,0.06)",
                    minHeight: "200px",
                  }}
                >
                  <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Click an agent in the orbital view<br />to see detailed stats
                  </p>
                </div>
              )}

              {/* Agent Status Grid */}
              <div
                className="rounded-xl border backdrop-blur-md overflow-hidden"
                style={{
                  background: "rgba(15, 10, 40, 0.5)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <h2 className="text-sm font-semibold text-white/80">Fleet Status</h2>
                </div>
                <div className="p-3 space-y-1">
                  {AGENTS.map((agent, i) => (
                    <button
                      key={agent.name}
                      onClick={() => setSelectedAgent(selectedAgent === i ? null : i)}
                      className="w-full flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 text-left"
                      style={{
                        background:
                          selectedAgent === i
                            ? agent.color + "15"
                            : "rgba(255,255,255,0.02)",
                        borderLeft:
                          selectedAgent === i
                            ? `2px solid ${agent.color}`
                            : "2px solid transparent",
                      }}
                    >
                      <span className="text-base">{agent.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{agent.name}</p>
                        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {agent.model}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background:
                              agent.status === "active"
                                ? "#10b981"
                                : agent.status === "processing"
                                  ? "#f59e0b"
                                  : agent.status === "idle"
                                    ? "#6b7280"
                                    : "#374151",
                            boxShadow:
                              agent.status === "active"
                                ? "0 0 6px #10b981"
                                : agent.status === "processing"
                                  ? "0 0 6px #f59e0b"
                                  : "none",
                          }}
                        />
                        <span
                          className="text-[10px] capitalize"
                          style={{
                            color:
                              agent.status === "active"
                                ? "#10b981"
                                : agent.status === "processing"
                                  ? "#f59e0b"
                                  : "rgba(255,255,255,0.3)",
                          }}
                        >
                          {agent.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-3">
              <div
                className="rounded-xl border backdrop-blur-md overflow-hidden h-full"
                style={{
                  background: "rgba(15, 10, 40, 0.5)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div>
                    <h2 className="text-sm font-semibold text-white/80">Live Activity</h2>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Real-time agent actions
                    </p>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#10b981",
                      boxShadow: "0 0 8px #10b981",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
                <div className="p-2 space-y-0.5 max-h-[500px] overflow-y-auto">
                  {activityFeed.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        animation: `fadeSlideIn 0.4s ease-out ${i * 0.08}s both`,
                      }}
                    >
                      <ActivityItem {...item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: Pipeline + Jedaiflow Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Jedaiflow Pipeline */}
            <div
              className="rounded-xl border backdrop-blur-md overflow-hidden"
              style={{
                background: "rgba(15, 10, 40, 0.5)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <h2 className="text-sm font-semibold text-white/80">Jedaiflow Pipeline</h2>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Lead → Outreach → Proposal → Close
                </p>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  {[
                    { stage: "Leads Found", count: 47, agent: "Scout", color: "#3b82f6", icon: "🔍" },
                    { stage: "Outreach Sent", count: 28, agent: "Quill", color: "#10b981", icon: "✍️" },
                    { stage: "Follow-Ups", count: 15, agent: "Echo", color: "#f59e0b", icon: "📡" },
                    { stage: "Proposals", count: 6, agent: "Forge", color: "#ef4444", icon: "⚒️" },
                    { stage: "Closed", count: 2, agent: "Fupie", color: "#a855f7", icon: "🏆" },
                  ].map((s, i, arr) => (
                    <div key={s.stage} className="flex items-center gap-2 flex-1">
                      <div className="text-center flex-1">
                        <div
                          className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-xl mb-2"
                          style={{
                            background: s.color + "15",
                            border: `1px solid ${s.color}30`,
                            boxShadow: `0 0 12px ${s.color}20`,
                          }}
                        >
                          {s.icon}
                        </div>
                        <p className="text-lg font-bold text-white">{s.count}</p>
                        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {s.stage}
                        </p>
                        <p className="text-[9px] mt-0.5" style={{ color: s.color + "80" }}>
                          {s.agent}
                        </p>
                      </div>
                      {i < arr.length - 1 && (
                        <div
                          className="text-xs"
                          style={{
                            color: "rgba(255,255,255,0.15)",
                            animation: `flowArrow 1.5s ease-in-out ${i * 0.3}s infinite`,
                          }}
                        >
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Conversion bar */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Pipeline Conversion
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: "#10b981" }}>
                      4.3%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "43%",
                        background: "linear-gradient(90deg, #3b82f6, #10b981, #a855f7)",
                        animation: "progressGlow 2s ease-in-out infinite",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Jedaiflow Goals */}
            <div
              className="rounded-xl border backdrop-blur-md overflow-hidden"
              style={{
                background: "rgba(15, 10, 40, 0.5)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <h2 className="text-sm font-semibold text-white/80">Jedaiflow Goals — April 2026</h2>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  AI automation agency milestones
                </p>
              </div>
              <div className="p-5 space-y-4">
                {[
                  {
                    goal: "Monthly Recurring Revenue",
                    current: dash.revenue ? `$${dash.revenue.mrr.toLocaleString()}` : "$0",
                    target: "$5,000",
                    pct: dash.revenue ? Math.min(100, Math.round((dash.revenue.mrr / 5000) * 100)) : 0,
                    color: "#10b981",
                  },
                  {
                    goal: "Active Clients",
                    current: dash.revenue ? String(dash.revenue.activeClients) : "0",
                    target: "8",
                    pct: dash.revenue ? Math.min(100, Math.round((dash.revenue.activeClients / 8) * 100)) : 0,
                    color: "#3b82f6",
                  },
                  {
                    goal: "Leads in Pipeline",
                    current: dash.leads ? String(dash.leads.total) : "0",
                    target: "100",
                    pct: dash.leads ? Math.min(100, Math.round((dash.leads.total / 100) * 100)) : 0,
                    color: "#f59e0b",
                  },
                  {
                    goal: "Emails Sent",
                    current: dash.leads ? String(dash.leads.sent) : "0",
                    target: "200",
                    pct: dash.leads ? Math.min(100, Math.round((dash.leads.sent / 200) * 100)) : 0,
                    color: "#ec4899",
                  },
                  {
                    goal: "Proposals Sent",
                    current: dash.revenue ? String(dash.revenue.proposals) : "0",
                    target: "15",
                    pct: dash.revenue ? Math.min(100, Math.round((dash.revenue.proposals / 15) * 100)) : 0,
                    color: "#a855f7",
                  },
                ].map((g) => (
                  <div key={g.goal}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/70">{g.goal}</span>
                      <span className="text-xs font-mono">
                        <span className="font-bold text-white">{g.current}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)" }}> / {g.target}</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${g.pct}%`,
                          background: `linear-gradient(90deg, ${g.color}80, ${g.color})`,
                          boxShadow: `0 0 8px ${g.color}40`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Global CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; transform: translateX(-100%); }
          50% { opacity: 1; transform: translateX(100%); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes flowArrow {
          0%, 100% { opacity: 0.15; transform: translateX(0); }
          50% { opacity: 0.5; transform: translateX(4px); }
        }
        @keyframes progressGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.5); }
      `}</style>
    </div>
  );
}
