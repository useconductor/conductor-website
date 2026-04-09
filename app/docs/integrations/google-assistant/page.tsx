import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

export default function GoogleAssistantPage() {
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
          Google Assistant
        </h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to Google Home via Dialogflow or routines.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Method 1: Dialogflow</h2>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-3 text-sm text-[#888]">1. Create a Dialogflow agent at dialogflow.cloud.google.com</p>
            <p className="mb-3 text-sm text-[#888]">2. Create intents that map to Conductor tools</p>
            <p className="mb-3 text-sm text-[#888]">3. Use a fulfillment webhook that calls Conductor:</p>
            <CopyButton text="curl -X POST http://localhost:3000/api/tools/..." />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Method 2: Google Home Routines</h2>
          <p className="mb-4 text-sm text-[#666]">
            Create a routine that triggers a webhook, which calls Conductor via Zapier/Make.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Example Phrases</h2>
          <ul className="space-y-2 text-sm text-[#666]">
            <li>• "Hey Google, run my tests"</li>
            <li>• "Hey Google, deploy to production"</li>
          </ul>
        </section>
      </div>
    </div>
  );
}