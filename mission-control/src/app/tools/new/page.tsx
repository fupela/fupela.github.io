import ToolForm from "@/components/ToolForm";

export default function NewToolPage() {
  return (
    <div className="p-6 max-w-[960px]">
      <div className="mb-6">
        <h1 className="text-[15px] font-semibold">Create New Tool</h1>
        <p className="text-[13px] text-muted mt-0.5">
          Build a custom tool for your workflow
        </p>
      </div>
      <ToolForm />
    </div>
  );
}
