"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Brain,
  FileText,
  Search,
  Clock,
  Filter,
} from "lucide-react";

interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  agent: string;
  icon: string;
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "memory", label: "Memory" },
  { value: "system", label: "System" },
  { value: "document", label: "Documents" },
];

export default function ActivityPage() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/workspace?type=activity")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  const filtered = events.filter((e) => {
    if (filter !== "all" && e.type !== filter) return false;
    if (search && !e.description.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, ActivityEvent[]>>(
    (acc, event) => {
      const day = event.timestamp.split("T")[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push(event);
      return acc;
    },
    {}
  );

  return (
    <div className="p-6 max-w-[960px]">
      <div className="mb-6">
        <h1 className="text-[15px] font-semibold flex items-center gap-2">
          <Activity size={16} className="text-accent" />
          Activity Log
        </h1>
        <p className="text-[13px] text-muted mt-0.5">
          Timeline of agent events and system activity
        </p>
      </div>

      {/* Search and filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-2"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity..."
            className="w-full bg-input-bg border border-input-border rounded-md pl-9 pr-3 py-2 text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none focus:border-input-focus transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-card-bg border border-card-border rounded-md p-0.5">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                filter === f.value
                  ? "bg-accent-subtle text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-[13px] text-muted">Loading activity...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-card-border rounded-lg py-16 text-center">
          <Filter size={18} className="text-muted mx-auto mb-2" />
          <p className="text-[13px] text-muted">No matching events</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayEvents]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-card-border" />
                <span className="text-[11px] text-muted-2 font-medium px-2">
                  {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <div className="h-px flex-1 bg-card-border" />
              </div>

              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-hover-bg transition-colors group"
                  >
                    {/* Timeline dot */}
                    <div className="mt-1 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          event.type === "memory"
                            ? "bg-accent-subtle"
                            : event.type === "system"
                              ? "bg-warning/10"
                              : "bg-card-border"
                        }`}
                      >
                        {event.icon === "brain" ? (
                          <Brain size={14} className="text-accent" />
                        ) : event.icon === "search" ? (
                          <Search size={14} className="text-warning" />
                        ) : (
                          <FileText size={14} className="text-muted" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium">{event.title}</p>
                        <span className="text-[10px] text-muted-2 px-1.5 py-0.5 bg-card-bg rounded border border-card-border">
                          {event.agent}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <span className="text-[10px] text-muted-2 whitespace-nowrap flex items-center gap-1 mt-1">
                      <Clock size={10} />
                      {timeAgo(event.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
