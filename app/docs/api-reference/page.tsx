import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ApiReferencePage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Reference
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          API Reference
        </h1>
        <p className="mt-3 text-[#888]">
          Complete tool and endpoint reference.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">MCP Tools</h2>
          <p className="mb-4 text-sm text-[#888]">
            Each plugin exposes tools via the MCP protocol. Tools are discovered
            automatically by MCP-compatible clients.
          </p>
          <div className="space-y-3">
            {[
              {
                tool: "filesystem.read",
                desc: "Read file contents",
                input: "{ path: string }",
              },
              {
                tool: "filesystem.write",
                desc: "Write file contents",
                input: "{ path: string, content: string }",
              },
              {
                tool: "filesystem.list",
                desc: "List directory contents",
                input: "{ path: string }",
              },
              {
                tool: "filesystem.search",
                desc: "Search files by pattern",
                input: "{ path: string, pattern: string }",
              },
              {
                tool: "shell.exec",
                desc: "Execute a command",
                input: "{ command: string, args?: string[] }",
              },
              {
                tool: "git.status",
                desc: "Get git repository status",
                input: "{ path?: string }",
              },
              {
                tool: "git.commit",
                desc: "Create a git commit",
                input: "{ message: string, files?: string[] }",
              },
              {
                tool: "web.fetch",
                desc: "Fetch a URL",
                input: "{ url: string, format?: string }",
              },
              {
                tool: "db.query",
                desc: "Execute a database query",
                input: "{ query: string, params?: unknown[] }",
              },
            ].map((item) => (
              <div
                key={item.tool}
                className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-4"
              >
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono font-semibold text-white">
                    {item.tool}
                  </code>
                  <span className="text-xs text-[#555]">{item.input}</span>
                </div>
                <p className="mt-1 text-xs text-[#666]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            HTTP Endpoints
          </h2>
          <p className="mb-4 text-sm text-[#888]">
            When running with HTTP transport, the following endpoints are
            available:
          </p>
          <div className="space-y-2">
            {[
              { method: "GET", path: "/health", desc: "Health check" },
              {
                method: "GET",
                path: "/metrics",
                desc: "Prometheus-compatible metrics",
              },
              { method: "GET", path: "/audit", desc: "Audit log entries" },
              {
                method: "POST",
                path: "/hooks/:name",
                desc: "Incoming webhook endpoint",
              },
              {
                method: "GET",
                path: "/sse",
                desc: "Server-sent events stream",
              },
            ].map((endpoint) => (
              <div
                key={endpoint.path}
                className="flex items-center gap-3 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] p-3"
              >
                <span
                  className={`rounded px-2 py-0.5 text-xs font-mono font-semibold ${
                    endpoint.method === "GET"
                      ? "bg-[#111] text-[#888]"
                      : "bg-[#222] text-white"
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono">{endpoint.path}</code>
                <span className="ml-auto text-xs text-[#555]">
                  {endpoint.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Response Format
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-xs font-mono text-[#ccc]">
              <code>{`// MCP tool response
{
  "content": [
    { "type": "text", "text": "Result here" }
  ],
  "isError": false
}

// Error response
{
  "content": [
    { "type": "text", "text": "Error message" }
  ],
  "isError": true
}`}</code>
            </pre>
          </div>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/sdks"
          className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
        >
          Next: SDKs
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
