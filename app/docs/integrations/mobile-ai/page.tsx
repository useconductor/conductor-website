import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

export default function MobileAIPage() {
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
          Mobile AI Apps
        </h1>
        <p className="mt-3 text-[#666]">
          Use Conductor from iOS Shortcuts, Android Tasker, or mobile AI apps.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">iOS Shortcuts</h2>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-3 text-sm text-[#888]">1. Start Conductor HTTP server:</p>
            <CopyButton text="conductor mcp start --http" />
            <p className="mt-4 mb-3 text-sm text-[#888]">2. Create Shortcut with "URL" → "Get Contents of URL"</p>
            <p className="mt-4 mb-3 text-sm text-[#888]">3. Call from any app or Siri</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Android Tasker</h2>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-3 text-sm text-[#888]">1. Install Tasker from Play Store</p>
            <p className="mb-3 text-sm text-[#888]">2. Create task → HTTP Request action</p>
            <p className="mb-3 text-sm text-[#888]">3. Point to Conductor's API endpoint</p>
            <p className="mt-4 mb-3 text-sm text-[#888]">4. Trigger via widgets, automation, or voice</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Use Cases</h2>
          <ul className="space-y-2 text-sm text-[#666]">
            <li>• Run CI/CD commands from your phone</li>
            <li>• Send messages via Slack/Discord plugins</li>
            <li>• Query databases on the go</li>
            <li>• Trigger home automation via Conductor</li>
          </ul>
        </section>
      </div>
    </div>
  );
}