import Link from "next/link";
import { ArrowRight } from "lucide-react";

const arch = `┌─────────────────────────────────────────────────┐
│               AI Client (Claude Code)            │
│   "read src/index.ts"  →  calls filesystem.read  │
└───────────────────────┬─────────────────────────┘
                        │ MCP protocol (stdio / HTTP)
                        ▼
┌─────────────────────────────────────────────────┐
│                  Conductor                       │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Validate │→ │ Approve? │→ │ Circuit chk  │   │
│  └──────────┘  └──────────┘  └──────┬───────┘   │
│                                     │            │
│  ┌──────────────────────────────────▼──────────┐ │
│  │           Plugin handler runs               │ │
│  └──────────────────────────────────┬──────────┘ │
│                                     │            │
│  ┌──────────────────────────────────▼──────────┐ │
│  │    Audit log (SHA-256 chained)              │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
     Filesystem      Shell        Database`;

const pluginShape = `interface Plugin {
  name: string;            // unique identifier
  version: string;         // semver
  description: string;

  // JSON Schema — validated before handler runs
  configSchema?: JSONSchema;

  tools: ToolDefinition[];
}

interface ToolDefinition {
  name: string;            // e.g. "filesystem.read"
  description: string;     // shown to AI
  inputSchema: JSONSchema; // validated on every call
  requiresApproval?: boolean;

  handler(input: unknown, config: unknown): Promise<CallToolResult>;
}`;

const toolCallFlow = [
  {
    step: "1",
    title: "AI sends tool call",
    body: "The AI client sends a JSON-RPC `tools/call` request over the transport. This is the MCP wire format — Conductor is transport-agnostic.",
  },
  {
    step: "2",
    title: "Input validation",
    body: "The input is validated against the tool's `inputSchema` (JSON Schema). Invalid inputs are rejected before any code runs.",
  },
  {
    step: "3",
    title: "Approval gate",
    body: "If `requiresApproval: true`, execution pauses. Conductor writes a prompt to stderr and waits for the user to type 'y' or 'n'. The AI waits.",
  },
  {
    step: "4",
    title: "Circuit breaker check",
    body: "If the circuit is OPEN (too many recent failures), the call returns an error immediately. No handler is invoked. The AI is informed.",
  },
  {
    step: "5",
    title: "Handler runs",
    body: "The plugin's async handler executes. If it throws, Conductor retries with exponential backoff (configurable). Failures update the circuit breaker.",
  },
  {
    step: "6",
    title: "Audit log write",
    body: "The call, input hash, result, duration, and SHA-256 chain link are appended to ~/.conductor/audit.log. This step cannot be skipped.",
  },
  {
    step: "7",
    title: "Response returned",
    body: "The result is sent back to the AI client as a `CallToolResult`. The AI continues its task.",
  },
];

export default function ConceptsPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core Concepts
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          How Conductor works
        </h1>
        <p className="mt-3 text-[#666]">
          The architecture behind the tool call pipeline, plugin system, and security model.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Architecture</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Conductor sits between your AI client and the real world. The AI client
            speaks the MCP protocol — Conductor translates those tool calls into real
            operations (file reads, shell commands, database queries) and sends back results.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#060606]">
            <div className="border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">architecture</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-[#555]">
              <code>{arch}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Tool call lifecycle</h2>
          <p className="mb-5 text-sm text-[#666]">
            Every single tool call — regardless of plugin — goes through this exact sequence:
          </p>
          <div className="space-y-2">
            {toolCallFlow.map((item) => (
              <div key={item.step} className="flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <span className="mt-0.5 w-5 shrink-0 font-mono text-xs text-[#2a2a2a]">{item.step}</span>
                <div>
                  <p className="font-mono text-xs font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#555]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Plugin model</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            A plugin is a JavaScript module that exports a{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">Plugin</code>{" "}
            object. Conductor discovers and loads plugins at startup. Each plugin registers
            one or more tools, each with a typed input schema and a handler function.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#060606]">
            <div className="border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">plugin interface</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-[#888]">
              <code>{pluginShape}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-mono text-xl font-semibold">Transport layer</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Conductor supports two transport modes. The transport determines how the AI client
            communicates with Conductor — it has no effect on which tools are available or how
            they behave.
          </p>
          <div className="grid gap-px bg-[#1a1a1a] sm:grid-cols-2">
            {[
              {
                name: "stdio (default)",
                when: "Local AI clients: Claude Desktop, Claude Code, Cursor, Cline, Windsurf",
                how: "The AI client spawns a `conductor mcp start` process and talks to it over stdin/stdout. Lifecycle is managed by the client.",
                cmd: "conductor mcp start",
              },
              {
                name: "HTTP",
                when: "Remote access, shared team servers, CI/CD, webhooks",
                how: "Conductor binds to a port and exposes an HTTP/SSE endpoint. Multiple clients can connect simultaneously.",
                cmd: "conductor mcp start --transport http --port 3000",
              },
            ].map((t) => (
              <div key={t.name} className="bg-[#080808] p-6">
                <p className="font-mono text-sm font-semibold text-white">{t.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#555]">
                  <span className="text-[#333]">When to use: </span>{t.when}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#555]">{t.how}</p>
                <code className="mt-3 block font-mono text-[10px] text-[#2a2a2a]">{t.cmd}</code>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link href="/docs/transport" className="inline-flex items-center gap-1.5 font-mono text-xs text-[#444] hover:text-white transition-colors">
              Transport reference <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Security layers</h2>
          <div className="space-y-2">
            {[
              { label: "Input validation", desc: "JSON Schema enforced before every handler call. No handler runs with invalid input." },
              { label: "Allowlisting", desc: "Shell plugin restricts to an explicit command list. No eval, no wildcards, no exceptions." },
              { label: "Approval gates", desc: "Destructive operations pause for user confirmation. The AI cannot bypass this." },
              { label: "Circuit breakers", desc: "Per-tool failure counters. After threshold, circuit opens. Fail-fast, no cascades." },
              { label: "Encrypted secrets", desc: "AES-256-GCM, key in OS keychain. Secrets never appear in config files or logs." },
              { label: "Audit chain", desc: "SHA-256 linked append-only log. Every call recorded. Tampering is mathematically detectable." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                <code className="mt-0.5 shrink-0 font-mono text-xs text-white">{item.label}</code>
                <p className="text-xs text-[#444]">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link href="/docs/security" className="inline-flex items-center gap-1.5 font-mono text-xs text-[#444] hover:text-white transition-colors">
              Full security model <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/mcp-server" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Next: Configuration
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
