import Link from "next/link";
import { ArrowRight, Code2, Terminal, Globe } from "lucide-react";

export default function SdksPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Reference
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          SDKs
        </h1>
        <p className="mt-3 text-[#888]">
          Client libraries for integrating with Conductor programmatically.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Available SDKs
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#555]" />
                <h3 className="font-mono text-sm font-semibold">TypeScript</h3>
              </div>
              <code className="rounded bg-[#111] px-2 py-1 text-xs font-mono text-[#888]">
                npm i @conductor/sdk
              </code>
              <p className="mt-3 text-xs text-[#666]">
                Full type support, MCP client utilities, and plugin helpers.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#555]" />
                <h3 className="font-mono text-sm font-semibold">Python</h3>
              </div>
              <code className="rounded bg-[#111] px-2 py-1 text-xs font-mono text-[#888]">
                pip install conductor-sdk
              </code>
              <p className="mt-3 text-xs text-[#666]">
                Async client with webhook handling and event streaming.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#555]" />
                <h3 className="font-mono text-sm font-semibold">REST API</h3>
              </div>
              <code className="rounded bg-[#111] px-2 py-1 text-xs font-mono text-[#888]">
                HTTP/JSON
              </code>
              <p className="mt-3 text-xs text-[#666]">
                Use any HTTP client. OpenAPI spec available at /openapi.json.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            TypeScript Example
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-xs font-mono text-[#ccc]">
              <code>{`import { ConductorClient } from "@conductor/sdk";

const client = new ConductorClient({
  transport: "stdio",
  command: "npx",
  args: ["-y", "@thealxlabs/conductor"],
});

await client.connect();

// Call a tool directly
const result = await client.callTool("filesystem.read", {
  path: "./package.json",
});

console.log(result.content[0].text);

// List available tools
const tools = await client.listTools();
console.log(tools.map(t => t.name));

await client.disconnect();`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Python Example
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-xs font-mono text-[#ccc]">
              <code>{`from conductor import ConductorClient

client = ConductorClient(
    transport="http",
    base_url="http://localhost:3000"
)

async with client:
    result = await client.call_tool(
        "filesystem.read",
        path="./package.json"
    )
    print(result.content[0].text)`}</code>
            </pre>
          </div>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/guides"
          className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
        >
          Next: Guides
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
