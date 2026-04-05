import Link from "next/link";
import { ArrowRight, Code2, Terminal, Globe } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const tsExample = `import { ConductorClient } from "@conductor/sdk";

const client = new ConductorClient({
  transport: "stdio",
  command: "npx",
  args: ["-y", "@useconductor/conductor"],
});

await client.connect();

// Call a tool
const result = await client.callTool("filesystem.read", {
  path: "./package.json",
});
console.log(result.content[0].text);

// List all available tools
const tools = await client.listTools();
console.log(tools.map((t) => t.name));

// Subscribe to events (HTTP transport only)
client.on("tool.complete", (event) => {
  console.log("Tool completed:", event.data.tool);
});

await client.disconnect();`;

const pyExample = `from conductor import ConductorClient

# HTTP transport
client = ConductorClient(
    transport="http",
    base_url="http://localhost:3000",
)

async with client:
    # Call a tool
    result = await client.call_tool(
        "filesystem.read",
        path="./package.json",
    )
    print(result.content[0].text)

    # List tools
    tools = await client.list_tools()
    print([t.name for t in tools])`;

const restExample = `# List tools
curl http://localhost:3000/tools

# Call a tool
curl -X POST http://localhost:3000/tools/filesystem.read \\
  -H "Content-Type: application/json" \\
  -d '{"path": "./package.json"}'

# Health check
curl http://localhost:3000/health

# Audit log
curl http://localhost:3000/audit`;

export default function SdksPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Reference
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          SDKs
        </h1>
        <p className="mt-3 text-[#666]">
          Client libraries for integrating with Conductor programmatically.
        </p>
      </div>

      <div className="space-y-12">
        {/* Available SDKs */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Available SDKs
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#444]" />
                <h3 className="font-mono text-sm font-semibold">TypeScript</h3>
              </div>
              <div className="flex items-center gap-2">
                <code className="rounded bg-[#111] px-2 py-1 font-mono text-xs text-[#888]">
                  npm i @conductor/sdk
                </code>
                <CopyButton text="npm i @conductor/sdk" />
              </div>
              <p className="mt-3 text-xs text-[#555]">
                Full type support, MCP client utilities, and plugin helpers.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#444]" />
                <h3 className="font-mono text-sm font-semibold">Python</h3>
              </div>
              <div className="flex items-center gap-2">
                <code className="rounded bg-[#111] px-2 py-1 font-mono text-xs text-[#888]">
                  pip install conductor-sdk
                </code>
                <CopyButton text="pip install conductor-sdk" />
              </div>
              <p className="mt-3 text-xs text-[#555]">
                Async client with webhook handling and event streaming.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#444]" />
                <h3 className="font-mono text-sm font-semibold">REST API</h3>
              </div>
              <code className="rounded bg-[#111] px-2 py-1 font-mono text-xs text-[#888]">
                HTTP / JSON
              </code>
              <p className="mt-3 text-xs text-[#555]">
                Use any HTTP client. OpenAPI spec at{" "}
                <code className="font-mono">/openapi.json</code>.
              </p>
            </div>
          </div>
        </section>

        {/* TypeScript */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            TypeScript Example
          </h2>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">
                index.ts
              </span>
              <CopyButton text={tsExample} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{tsExample}</code>
            </pre>
          </div>
        </section>

        {/* Python */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Python Example
          </h2>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">
                main.py
              </span>
              <CopyButton text={pyExample} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{pyExample}</code>
            </pre>
          </div>
        </section>

        {/* REST */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            REST API Examples
          </h2>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">
                curl
              </span>
              <CopyButton text={restExample} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{restExample}</code>
            </pre>
          </div>
        </section>
      </div>

      {/* Next */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/guides"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Next: Guides
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
