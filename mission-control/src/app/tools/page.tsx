"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tools")
      .then((r) => r.json())
      .then((data) => {
        setTools(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this tool?")) return;
    await fetch(`/api/tools?id=${id}`, { method: "DELETE" });
    setTools((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="p-6 max-w-[960px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold">Tools</h1>
          <p className="text-[13px] text-muted mt-0.5">
            {tools.length} tool{tools.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/tools/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-[12px] font-medium rounded-md transition-colors"
        >
          <Plus size={13} />
          New Tool
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-[13px] text-muted">Loading...</p>
        </div>
      ) : tools.length === 0 ? (
        <div className="border border-card-border rounded-lg py-16 text-center">
          <div className="w-10 h-10 rounded-lg bg-card-border mx-auto mb-3 flex items-center justify-center">
            <Wrench size={18} className="text-muted" />
          </div>
          <p className="text-[13px] text-muted mb-1">No tools yet</p>
          <p className="text-[12px] text-muted-2 mb-4">
            Create your first tool to get started
          </p>
          <Link
            href="/tools/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-[12px] font-medium rounded-md transition-colors"
          >
            <Plus size={13} />
            New Tool
          </Link>
        </div>
      ) : (
        <div className="border border-card-border rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_120px_80px] px-4 py-2 border-b border-card-border bg-card-bg text-[11px] text-muted uppercase tracking-wider font-medium">
            <span>Name</span>
            <span>Category</span>
            <span>Updated</span>
            <span className="text-right">Actions</span>
          </div>
          {/* Rows */}
          <div className="divide-y divide-card-border">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="grid grid-cols-[1fr_120px_120px_80px] items-center px-4 py-2.5 hover:bg-hover-bg transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">
                    {tool.name}
                  </p>
                  {tool.description && (
                    <p className="text-[11px] text-muted truncate mt-0.5">
                      {tool.description}
                    </p>
                  )}
                </div>
                <span className="text-[12px] text-muted">
                  {tool.category}
                </span>
                <span className="text-[12px] text-muted-2">
                  {new Date(tool.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/tools/${tool.id}`}
                    className="p-1.5 rounded hover:bg-card-border transition-colors"
                    title="Edit"
                  >
                    <Pencil size={13} className="text-muted" />
                  </Link>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    className="p-1.5 rounded hover:bg-danger-subtle transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} className="text-danger" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
