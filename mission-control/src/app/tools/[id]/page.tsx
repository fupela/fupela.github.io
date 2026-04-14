"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ToolForm from "@/components/ToolForm";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
}

export default function EditToolPage() {
  const params = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tools")
      .then((r) => r.json())
      .then((tools: Tool[]) => {
        const found = tools.find((t) => t.id === params.id);
        setTool(found || null);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-[13px] text-muted">Loading...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="p-6">
        <p className="text-[13px] text-danger">Tool not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[960px]">
      <div className="mb-6">
        <h1 className="text-[15px] font-semibold">Edit Tool</h1>
        <p className="text-[13px] text-muted mt-0.5">{tool.name}</p>
      </div>
      <ToolForm initialData={tool} />
    </div>
  );
}
