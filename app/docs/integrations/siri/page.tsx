import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

export default function SiriPage() {
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
          Siri & Apple Intelligence
        </h1>
        <p className="mt-3 text-[#666]">
          Trigger Conductor tools via iOS Shortcuts and AppleScript.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Setup</h2>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-3 text-sm text-[#888]">1. Start Conductor's HTTP server:</p>
            <CopyButton text="conductor mcp start --http" />
            <p className="mt-4 mb-3 text-sm text-[#888]">2. Create an iOS Shortcut:</p>
            <ul className="list-disc pl-4 text-sm text-[#666]">
              <li>Open Shortcuts app → Create new shortcut</li>
              <li>Add "URL" action → Enter http://localhost:3000/api/...</li>
              <li>Add "Get Contents of URL" action</li>
            </ul>
            <p className="mt-4 mb-3 text-sm text-[#888]">3. Say "Hey Siri, [shortcut name]" to trigger</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Example Shortcuts</h2>
          <ul className="space-y-2 text-sm text-[#666]">
            <li>• "Run npm test" → triggers shell_exec via HTTP API</li>
            <li>• "Send to Slack" → calls Conductor webhook</li>
            <li>• "Read my notes" → fetches from filesystem plugin</li>
          </ul>
        </section>
      </div>
    </div>
  );
}