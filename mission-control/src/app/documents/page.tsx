"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Folder,
  File,
  ChevronRight,
  ArrowLeft,
  Clock,
  HardDrive,
  Eye,
} from "lucide-react";

interface WorkspaceFile {
  name: string;
  path: string;
  size: number;
  modified: string;
  type: "file" | "directory";
}

function formatSize(bytes: number) {
  if (bytes === 0) return "--";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

function getFileIcon(name: string) {
  if (name.endsWith(".md")) return "md";
  if (name.endsWith(".json")) return "json";
  if (name.endsWith(".ts") || name.endsWith(".tsx")) return "ts";
  if (name.endsWith(".rtf")) return "doc";
  return "file";
}

function FileTypeTag({ name }: { name: string }) {
  const type = getFileIcon(name);
  const styles: Record<string, string> = {
    md: "text-accent bg-accent-subtle",
    json: "text-warning bg-warning/10",
    ts: "text-blue-400 bg-blue-400/10",
    doc: "text-success bg-success-subtle",
    file: "text-muted bg-card-border",
  };
  return (
    <span
      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${styles[type]}`}
    >
      {type}
    </span>
  );
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{
    name: string;
    content: string;
  } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetch("/api/workspace?type=documents")
      .then((r) => r.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      });
  }, []);

  async function handlePreview(file: WorkspaceFile) {
    if (file.type === "directory") return;
    setLoadingPreview(true);
    const res = await fetch(
      `/api/workspace?type=document&path=${encodeURIComponent(file.path)}`
    );
    const data = await res.json();
    setPreview({ name: file.name, content: data.content || "Unable to read" });
    setLoadingPreview(false);
  }

  const dirs = files.filter((f) => f.type === "directory");
  const regularFiles = files.filter((f) => f.type === "file");

  return (
    <div className="p-6 max-w-[960px]">
      <div className="mb-6">
        <h1 className="text-[15px] font-semibold flex items-center gap-2">
          <FileText size={16} className="text-accent" />
          Document Hub
        </h1>
        <p className="text-[13px] text-muted mt-0.5">
          Centralized view of workspace files and documents
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <HardDrive size={13} />
          <span>
            {files.length} item{files.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <Folder size={13} />
          <span>
            {dirs.length} folder{dirs.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <File size={13} />
          <span>
            {regularFiles.length} file{regularFiles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-[13px] text-muted">Loading documents...</p>
        </div>
      ) : preview ? (
        /* Preview pane */
        <div className="border border-card-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-card-bg border-b border-card-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreview(null)}
                className="p-1 rounded hover:bg-hover-bg transition-colors"
              >
                <ArrowLeft size={14} className="text-muted" />
              </button>
              <FileTypeTag name={preview.name} />
              <span className="text-[13px] font-medium">{preview.name}</span>
            </div>
          </div>
          <div className="p-4 max-h-[600px] overflow-auto">
            <pre className="text-[12px] font-mono text-foreground leading-relaxed whitespace-pre-wrap">
              {preview.content}
            </pre>
          </div>
        </div>
      ) : (
        /* File list */
        <div className="border border-card-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_100px_60px] px-4 py-2 border-b border-card-border bg-card-bg text-[11px] text-muted uppercase tracking-wider font-medium">
            <span>Name</span>
            <span>Size</span>
            <span>Modified</span>
            <span className="text-right">View</span>
          </div>
          <div className="divide-y divide-card-border">
            {files.map((file) => (
              <div
                key={file.path}
                className="grid grid-cols-[1fr_80px_100px_60px] items-center px-4 py-2.5 hover:bg-hover-bg transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {file.type === "directory" ? (
                    <Folder size={15} className="text-warning shrink-0" />
                  ) : (
                    <File size={15} className="text-muted shrink-0" />
                  )}
                  <span className="text-[13px] truncate">
                    {file.name}
                  </span>
                  {file.type === "file" && <FileTypeTag name={file.name} />}
                </div>
                <span className="text-[12px] text-muted-2">
                  {formatSize(file.size)}
                </span>
                <span className="text-[12px] text-muted-2 flex items-center gap-1">
                  <Clock size={10} />
                  {timeAgo(file.modified)}
                </span>
                <div className="text-right">
                  {file.type === "file" && (
                    <button
                      onClick={() => handlePreview(file)}
                      className="p-1.5 rounded hover:bg-card-border transition-colors opacity-0 group-hover:opacity-100"
                      title="Preview"
                    >
                      <Eye size={13} className="text-muted" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
