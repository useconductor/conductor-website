import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

export default function AlexaPage() {
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
          Alexa
        </h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to Alexa via AWS Lambda and custom skills.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">How It Works</h2>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-3 text-sm text-[#888]">1. Create an Alexa Custom Skill in the Alexa Developer Console</p>
            <p className="mb-3 text-sm text-[#888]">2. Set the endpoint to an AWS Lambda function</p>
            <p className="mb-3 text-sm text-[#888]">3. The Lambda function calls Conductor's API:</p>
            <CopyButton text="curl -X POST http://localhost:3000/api/tools/..." />
            <p className="mt-4 mb-3 text-sm text-[#888]">4. Map Alexa intents to Conductor tool calls</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Example Phrases</h2>
          <ul className="space-y-2 text-sm text-[#666]">
            <li>• "Alexa, ask Conductor to run tests"</li>
            <li>• "Alexa, trigger deployment"</li>
            <li>• "Alexa, what's on my calendar"</li>
          </ul>
        </section>
      </div>
    </div>
  );
}