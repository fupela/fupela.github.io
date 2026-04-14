"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Plus,
  Settings,
  Zap,
  Activity,
  Bot,
  Brain,
  FileText,
  Orbit,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/universe", label: "Universe", icon: Orbit },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/memory", label: "Memory", icon: Brain },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/tools", label: "Tools", icon: Wrench },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 bg-sidebar-bg glass-panel border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-12 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-accent flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.4)]">
            <Zap size={12} className="text-white" />
          </div>
          <span className="text-[13px] font-semibold tracking-tight">
            Mission Control
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2">
        <div className="space-y-0.5">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-[6px] rounded-md text-[13px] transition-all ${
                  active
                    ? "bg-accent-subtle text-accent font-medium shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                    : "text-muted hover:text-foreground hover:bg-hover-bg"
                }`}
              >
                <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* New Tool action */}
        <div className="mt-4 pt-3 border-t border-border">
          <Link
            href="/tools/new"
            className={`flex items-center gap-2.5 px-2.5 py-[6px] rounded-md text-[13px] transition-all ${
              pathname === "/tools/new"
                ? "bg-accent-subtle text-accent font-medium"
                : "text-muted hover:text-foreground hover:bg-hover-bg"
            }`}
          >
            <Plus size={15} strokeWidth={1.5} />
            New Tool
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent-subtle flex items-center justify-center shadow-[0_0_8px_rgba(139,92,246,0.2)]">
            <span className="text-[10px] font-medium text-accent">F</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-foreground truncate">
              fupie
            </p>
            <p className="text-[10px] text-muted-2 truncate">localhost:3000</p>
          </div>
          <Settings
            size={14}
            className="text-muted-2 hover:text-muted cursor-pointer transition-colors shrink-0"
          />
        </div>
      </div>
    </aside>
  );
}
