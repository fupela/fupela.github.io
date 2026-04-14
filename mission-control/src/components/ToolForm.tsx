"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ToolFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    category: string;
    code: string;
  };
}

const CATEGORIES = [
  "general",
  "automation",
  "data",
  "communication",
  "integration",
  "utility",
];

export default function ToolForm({ initialData }: ToolFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [category, setCategory] = useState(initialData?.category || "general");
  const [code, setCode] = useState(
    initialData?.code ||
      `// Your tool code here\nexport default async function run(input) {\n  // Process input and return result\n  return { success: true, data: input };\n}\n`
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = { name, description, category, code };

    if (isEdit) {
      await fetch("/api/tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initialData!.id, ...payload }),
      });
    } else {
      await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    router.push("/tools");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-[640px]">
      <fieldset className="space-y-1">
        <label className="text-[12px] font-medium text-muted">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="My Custom Tool"
          className="w-full bg-input-bg border border-input-border rounded-md px-3 py-2 text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none focus:border-input-focus transition-colors"
        />
      </fieldset>

      <fieldset className="space-y-1">
        <label className="text-[12px] font-medium text-muted">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this tool do?"
          className="w-full bg-input-bg border border-input-border rounded-md px-3 py-2 text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none focus:border-input-focus transition-colors"
        />
      </fieldset>

      <fieldset className="space-y-1">
        <label className="text-[12px] font-medium text-muted">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-input-bg border border-input-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-input-focus transition-colors appearance-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="space-y-1">
        <label className="text-[12px] font-medium text-muted">Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          rows={16}
          spellCheck={false}
          className="w-full bg-input-bg border border-input-border rounded-md px-3 py-2.5 text-[13px] font-mono text-foreground placeholder:text-muted-2 focus:outline-none focus:border-input-focus transition-colors resize-y leading-relaxed"
        />
      </fieldset>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-3.5 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors"
        >
          {saving ? "Saving..." : isEdit ? "Update Tool" : "Create Tool"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-3.5 py-1.5 border border-card-border hover:bg-hover-bg text-[12px] font-medium text-muted rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
