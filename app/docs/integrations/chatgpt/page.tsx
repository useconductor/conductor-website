import { CopyButton } from "@/components/copy-button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChatGPTPage() {
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
          ChatGPT (Web)
        </h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to ChatGPT via webhooks and automation platforms.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Method 1: Zapier/Make</h2>
          <p className="mb-4 text-sm text-[#666]">
            Use Conductor's webhook plugin to trigger actions from ChatGPT via Zapier or Make.
          </p>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-3 text-sm text-[#888]">1. Enable the webhook plugin in Conductor:</p>
            <CopyButton text="conductor plugins enable webhooks" />
            <p className="mt-4 mb-3 text-sm text-[#888]">2. Create a webhook trigger in Zapier/Make</p>
            <p className="mt-4 mb-3 text-sm text-[#888]">3. Use ChatGPT's custom actions or browse the Zapier directory</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Method 2: Siri Shortcuts</h2>
          <p className="mb-4 text-sm text-[#666]">
            Create a Siri Shortcut that triggers Conductor via its API, then call it from ChatGPT (mobile).
          </p>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-3 text-sm text-[#888]">1. Start Conductor's HTTP server:</p>
            <CopyButton text="conductor mcp start --http" />
            <p className="mt-4 mb-3 text-sm text-[#888]">2. Create a Shortcut that calls: http://localhost:3000/api/tools/webhook_send</p>
            <p className="mt-4 mb-3 text-sm text-[#888]">3. Add the shortcut to your iPhone's "Shortcuts from Apps" in ChatGPT</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Example Use Cases</h2>
          <ul className="space-y-2 text-sm text-[#666]">
            <li>• Ask ChatGPT to send a message via Conductor's Slack plugin</li>
            <li>• Trigger a Conductor workflow from ChatGPT</li>
            <li>• Have ChatGPT read files from Conductor's filesystem plugin</li>
          </ul>
        </section>
      </div>
    </div>
  );
}