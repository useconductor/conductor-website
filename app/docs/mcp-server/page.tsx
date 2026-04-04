import Link from "next/link";
import { ArrowRight, Server, Shield, Zap, Plug } from "lucide-react";

export default function McpServerPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          MCP Server
        </h1>
        <p className="mt-3 text-[#888]">
          Understanding the Model Context Protocol integration.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">What is MCP?</h2>
          <p className="text-sm leading-relaxed text-[#888]">
            The Model Context Protocol (MCP) is an open standard that enables AI
            applications to connect to external tools and data sources.
            Conductor implements MCP as a server, exposing all plugin
            capabilities as tools that any MCP-compatible client can discover
            and invoke.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Architecture</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <Server className="mb-3 h-5 w-5 text-[#555]" />
              <h3 className="mb-2 font-mono text-sm font-semibold">
                Stdio Transport
              </h3>
              <p className="text-xs leading-relaxed text-[#666]">
                Primary transport for local AI clients. The MCP server
                communicates over stdin/stdout using JSON-RPC 2.0.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <Zap className="mb-3 h-5 w-5 text-[#555]" />
              <h3 className="mb-2 font-mono text-sm font-semibold">HTTP/SSE</h3>
              <p className="text-xs leading-relaxed text-[#666]">
                Remote transport for dashboard and webhook integrations.
                Server-sent events push real-time updates.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Tool Pipeline
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#888]">
            Every tool call passes through a security pipeline before execution:
          </p>
          <div className="space-y-2">
            {[
              {
                step: "1",
                label: "Circuit Breaker",
                desc: "Opens after repeated failures to prevent cascading errors",
              },
              {
                step: "2",
                label: "Retry with Backoff",
                desc: "Exponential backoff with jitter for transient failures",
              },
              {
                step: "3",
                label: "Audit Logging",
                desc: "SHA-256 chained append-only log of every call",
              },
              {
                step: "4",
                label: "Zod Validation",
                desc: "Input schema validation before handler invocation",
              },
              {
                step: "5",
                label: "Approval Gate",
                desc: "User approval required for dangerous operations",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-3 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] p-3"
              >
                <span className="font-mono text-xs text-[#333]">
                  {item.step}
                </span>
                <div>
                  <span className="font-mono text-xs font-semibold">
                    {item.label}
                  </span>
                  <p className="text-xs text-[#666]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Starting the Server
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-sm font-mono text-[#ccc]">
              <code>{`# Start with stdio transport (for AI clients)
conductor mcp start

# Start with HTTP transport (for dashboard)
conductor mcp start --transport http --port 3000

# Start with specific plugins only
conductor mcp start --plugins filesystem,shell,git`}</code>
            </pre>
          </div>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/plugins"
          className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
        >
          Next: Plugins
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
