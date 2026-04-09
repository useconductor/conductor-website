import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotebookLMPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/docs/integrations"
          className="mb-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3a3a3a] transition-colors hover:text-[#666]"
        >
          <ArrowLeft className="h-3 w-3" />
          Integrations
        </Link>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Non-MCP Integration
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          NotebookLM
        </h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to NotebookLM via API integrations.
        </p>
      </div>
      <p className="text-sm text-[#666]">
        NotebookLM doesn't have direct webhook support. Use the filesystem plugin to read sources, or trigger Conductor via Zapier webhooks before/after NotebookLM sessions.
      </p>
    </div>
  );
}