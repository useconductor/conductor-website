import Link from "next/link";
import { ArrowRight, Webhook, Bell, Server } from "lucide-react";

export default function WebhooksPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Webhooks
        </h1>
        <p className="mt-3 text-[#888]">
          Event-driven integrations with external systems.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Overview</h2>
          <p className="text-sm leading-relaxed text-[#888]">
            Conductor supports both incoming and outgoing webhooks. Incoming
            webhooks allow external systems to trigger actions in Conductor.
            Outgoing webhooks send events to external endpoints when specific
            actions occur.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Incoming Webhooks
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#888]">
            Register a webhook endpoint that external services can POST to. The
            payload is validated and routed to the appropriate handler.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-xs font-mono text-[#ccc]">
              <code>{`// Register a webhook
conductor webhooks create \
  --name "github-events" \
  --url /hooks/github \
  --handler "process_github_event"`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Outgoing Webhooks
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#888]">
            Configure Conductor to send events to external URLs. Events include
            tool executions, plugin state changes, and system alerts.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-xs font-mono text-[#ccc]">
              <code>{`// Register an outgoing webhook
conductor webhooks register \
  --url "https://example.com/conductor-events" \
  --events "tool.call,tool.complete,plugin.error" \
  --secret "whsec_your_signing_secret"`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Event Types</h2>
          <div className="space-y-2">
            {[
              {
                event: "tool.call",
                description: "A tool execution was initiated",
              },
              {
                event: "tool.complete",
                description: "A tool execution completed",
              },
              { event: "tool.error", description: "A tool execution failed" },
              { event: "plugin.enabled", description: "A plugin was enabled" },
              {
                event: "plugin.disabled",
                description: "A plugin was disabled",
              },
              {
                event: "plugin.error",
                description: "A plugin encountered an error",
              },
              {
                event: "system.alert",
                description: "A system-level alert was triggered",
              },
            ].map((item) => (
              <div
                key={item.event}
                className="flex items-start gap-3 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] p-3"
              >
                <code className="rounded bg-[#111] px-2 py-0.5 text-xs font-mono text-white">
                  {item.event}
                </code>
                <span className="text-xs text-[#666]">{item.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Retry Logic</h2>
          <p className="text-sm leading-relaxed text-[#888]">
            Outgoing webhooks use exponential backoff with jitter for retries.
            Failed deliveries are retried up to 5 times with increasing delays:
            1s, 2s, 4s, 8s, 16s. After all retries are exhausted, the event is
            logged to the dead letter queue.
          </p>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/api-reference"
          className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
        >
          Next: API Reference
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
