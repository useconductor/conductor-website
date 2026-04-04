import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tools = [
  {
    tool: "filesystem.read",
    desc: "Read the contents of a file",
    input: "{ path: string }",
    requiresApproval: false,
  },
  {
    tool: "filesystem.write",
    desc: "Write content to a file (creates if not exists)",
    input: "{ path: string, content: string }",
    requiresApproval: true,
  },
  {
    tool: "filesystem.list",
    desc: "List directory contents",
    input: "{ path: string, recursive?: boolean }",
    requiresApproval: false,
  },
  {
    tool: "filesystem.search",
    desc: "Search files by glob pattern or content",
    input: "{ path: string, pattern: string }",
    requiresApproval: false,
  },
  {
    tool: "filesystem.delete",
    desc: "Delete a file or directory",
    input: "{ path: string }",
    requiresApproval: true,
  },
  {
    tool: "shell.exec",
    desc: "Execute a shell command (requires approval or allowlist match)",
    input: "{ command: string, args?: string[], cwd?: string }",
    requiresApproval: true,
  },
  {
    tool: "git.status",
    desc: "Get repository status (staged, unstaged, untracked)",
    input: "{ path?: string }",
    requiresApproval: false,
  },
  {
    tool: "git.commit",
    desc: "Stage files and create a commit",
    input: "{ message: string, files?: string[], all?: boolean }",
    requiresApproval: true,
  },
  {
    tool: "git.diff",
    desc: "Show unstaged or staged diff",
    input: "{ path?: string, staged?: boolean }",
    requiresApproval: false,
  },
  {
    tool: "git.log",
    desc: "Show commit history",
    input: "{ path?: string, limit?: number }",
    requiresApproval: false,
  },
  {
    tool: "web.fetch",
    desc: "Fetch a URL and return parsed content",
    input: "{ url: string, format?: 'text' | 'markdown' | 'json' }",
    requiresApproval: false,
  },
  {
    tool: "db.query",
    desc: "Execute a SQL query",
    input: "{ query: string, params?: unknown[], database?: string }",
    requiresApproval: false,
  },
  {
    tool: "ai.chat",
    desc: "Send a message to an AI provider",
    input: "{ message: string, provider?: string, model?: string }",
    requiresApproval: false,
  },
];

const endpoints = [
  { method: "GET", path: "/health", desc: "Server health and uptime" },
  { method: "GET", path: "/metrics", desc: "Prometheus-compatible metrics" },
  { method: "GET", path: "/audit", desc: "Paginated audit log entries" },
  { method: "GET", path: "/tools", desc: "List all registered tools" },
  { method: "POST", path: "/tools/:name", desc: "Call a tool via HTTP" },
  { method: "POST", path: "/hooks/:name", desc: "Incoming webhook endpoint" },
  { method: "GET", path: "/sse", desc: "Server-sent events stream" },
  { method: "GET", path: "/plugins", desc: "List installed plugins and status" },
  { method: "GET", path: "/openapi.json", desc: "OpenAPI 3.0 spec" },
];

const responseFormat = `// Successful tool response
{
  "content": [
    { "type": "text", "text": "Result content here" }
  ],
  "isError": false
}

// Error response
{
  "content": [
    { "type": "text", "text": "Error: permission denied" }
  ],
  "isError": true
}

// Multi-content response
{
  "content": [
    { "type": "text", "text": "File listing:" },
    { "type": "text", "text": "src/\n  index.ts\n  utils.ts" }
  ],
  "isError": false
}`;

export default function ApiReferencePage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Reference
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          API Reference
        </h1>
        <p className="mt-3 text-[#666]">
          Complete tool and HTTP endpoint reference.
        </p>
      </div>

      <div className="space-y-12">
        {/* MCP Tools */}
        <section>
          <h2 className="mb-2 font-mono text-xl font-semibold">MCP Tools</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Tools are automatically discovered by MCP clients via the{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              tools/list
            </code>{" "}
            endpoint. Tools marked with an approval badge require user confirmation
            before execution.
          </p>
          <div className="space-y-2">
            {tools.map((item) => (
              <div
                key={item.tool}
                className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm font-semibold text-white">
                        {item.tool}
                      </code>
                      {item.requiresApproval && (
                        <span className="rounded border border-[#2a2a2a] px-1.5 py-0.5 font-mono text-[9px] text-[#555]">
                          requires approval
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#555]">{item.desc}</p>
                  </div>
                  <code className="shrink-0 rounded bg-[#0d0d0d] px-2 py-1 font-mono text-[10px] text-[#444]">
                    {item.input}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HTTP Endpoints */}
        <section>
          <h2 className="mb-2 font-mono text-xl font-semibold">
            HTTP Endpoints
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Available when running with{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              --transport http
            </code>
            . All endpoints return JSON.
          </p>
          <div className="space-y-2">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.path}
                className="flex items-center gap-3 rounded-md border border-[#1a1a1a] bg-[#080808] p-3"
              >
                <span
                  className={`shrink-0 rounded px-2 py-1 font-mono text-xs font-semibold ${
                    endpoint.method === "GET"
                      ? "bg-[#111] text-[#666]"
                      : "bg-[#1a1a1a] text-white"
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="font-mono text-sm">{endpoint.path}</code>
                <span className="ml-auto text-xs text-[#444]">
                  {endpoint.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Response format */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Response Format
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            All MCP tool responses follow the{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              CallToolResult
            </code>{" "}
            format specified by the MCP protocol.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{responseFormat}</code>
            </pre>
          </div>
        </section>

        {/* Rate limiting */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Rate Limiting</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            HTTP endpoints are protected by configurable rate limits. Defaults:
          </p>
          <div className="space-y-2">
            {[
              { endpoint: "/tools/*", limit: "100 req/min" },
              { endpoint: "/hooks/*", limit: "60 req/min" },
              { endpoint: "/metrics, /health", limit: "unlimited" },
            ].map((r) => (
              <div
                key={r.endpoint}
                className="flex items-center justify-between rounded-md border border-[#1a1a1a] bg-[#080808] p-3"
              >
                <code className="font-mono text-xs text-white">{r.endpoint}</code>
                <span className="font-mono text-xs text-[#555]">{r.limit}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Next */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/sdks"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Next: SDKs
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
