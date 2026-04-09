import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PerplexityPage() {
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
          Perplexity
        </h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to Perplexity via webhook automations.
        </p>
      </div>
      <p className="text-sm text-[#666]">
        Use Zapier or Make to create webhooks that trigger Conductor tools from Perplexity's browse feature.
      </p>
    </div>
  );
}