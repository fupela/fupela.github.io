"use client";

import { useEffect, useState } from "react";
import { Brain, Search, Calendar, BookOpen } from "lucide-react";

interface MemoryEntry {
  date: string;
  content: string;
  lines: string[];
}

export default function MemoryPage() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/workspace?type=memory")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
        if (data.length > 0) setExpanded(data[0].date);
      });
  }, []);

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.date.includes(q) ||
      e.content.toLowerCase().includes(q) ||
      e.lines.some((l) => l.toLowerCase().includes(q))
    );
  });

  const totalEntries = entries.reduce((sum, e) => sum + e.lines.length, 0);

  function highlightSearch(text: string) {
    if (!search) return text;
    const idx = text.toLowerCase().indexOf(search.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-accent/30 text-foreground rounded px-0.5">
          {text.slice(idx, idx + search.length)}
        </mark>
        {text.slice(idx + search.length)}
      </>
    );
  }

  return (
    <div className="p-6 max-w-[960px]">
      <div className="mb-6">
        <h1 className="text-[15px] font-semibold flex items-center gap-2">
          <Brain size={16} className="text-accent" />
          Memory Journal
        </h1>
        <p className="text-[13px] text-muted mt-0.5">
          Searchable digital journal of agent interactions and learnings
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <Calendar size={13} />
          <span>{entries.length} days recorded</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <BookOpen size={13} />
          <span>{totalEntries} entries</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-2"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search memories... (names, topics, decisions)"
          className="w-full bg-input-bg border border-input-border rounded-md pl-9 pr-3 py-2 text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none focus:border-input-focus transition-colors"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-[13px] text-muted">Loading memories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-card-border rounded-lg py-16 text-center">
          <Brain size={24} className="text-muted mx-auto mb-2" />
          <p className="text-[13px] text-muted">
            {search ? "No matching memories" : "No memories recorded yet"}
          </p>
          {search && (
            <p className="text-[12px] text-muted-2 mt-1">
              Try different search terms
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div
              key={entry.date}
              className="border border-card-border rounded-lg overflow-hidden"
            >
              {/* Date header */}
              <button
                onClick={() =>
                  setExpanded(expanded === entry.date ? null : entry.date)
                }
                className="w-full flex items-center justify-between px-4 py-3 bg-card-bg hover:bg-hover-bg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center">
                    <Brain size={14} className="text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-medium">
                      {new Date(entry.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-[11px] text-muted">
                      {entry.lines.length} entr
                      {entry.lines.length === 1 ? "y" : "ies"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-muted-2 transition-transform ${expanded === entry.date ? "rotate-90" : ""}`}
                >
                  &rsaquo;
                </span>
              </button>

              {/* Entries */}
              {expanded === entry.date && (
                <div className="px-4 py-3 space-y-2 border-t border-card-border">
                  {entry.lines.length > 0 ? (
                    entry.lines.map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        <p className="text-[13px] text-foreground leading-relaxed">
                          {highlightSearch(line)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] text-muted italic">
                      No structured entries for this day
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
