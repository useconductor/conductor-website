import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const stdioConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

const httpStart = `# Start on default port 3000
conductor mcp start --transport http

# Custom port
conductor mcp start --transport http --port 8080

# With TLS (provide cert + key)
conductor mcp start --transport http --port 443 \\
  --tls-cert /etc/conductor/cert.pem \\
  --tls-key  /etc/conductor/key.pem`;

const httpClientTs = `import { ConductorClient } from "@useconductor/sdk";

const client = new ConductorClient({
  transport: "http",
  url: "http://localhost:3000",
  // Optional auth token
  token: process.env.CONDUCTOR_TOKEN,
});

await client.connect();
const result = await client.callTool("filesystem.read", {
  path: "./package.json",
});`;

const httpCurl = `# List available tools
curl http://localhost:3000/tools

# Call a tool
curl -X POST http://localhost:3000/tools/call \\
  -H "Content-Type: application/json" \\
  -d '{"name":"filesystem.read","arguments":{"path":"./README.md"}}'

# Health check
curl http://localhost:3000/health`;

const sseExample = `# Subscribe to events (Server-Sent Events)
curl -N http://localhost:3000/events

# Response stream:
# data: {"type":"tool.start","data":{"tool":"shell.exec","id":"abc123"}}
# data: {"type":"tool.complete","data":{"tool":"shell.exec","id":"abc123","ms":142}}`;

const authConfig = `// ~/.conductor/config.json
{
  "server": {
    "transport": "http",
    "port": 3000,
    "auth": {
      "type": "bearer",
      "token": "your-secret-token-here"
    }
  }
}`;

const nginxConf = `# /etc/nginx/sites-available/conductor
server {
  listen 443 ssl;
  server_name conductor.yourcompany.com;

  ssl_certificate     /etc/letsencrypt/live/.../fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/.../privkey.pem;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    # Required for SSE
    proxy_buffering off;
    proxy_cache off;
  }
}`;

export default function TransportPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Transport modes
        </h1>
        <p className="mt-3 text-[#666]">
          stdio for local clients. HTTP for remote access, shared servers, and webhooks.
          Same tools either way.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">stdio (default)</h2>
          <p className="mb-5 mt-2 text-sm leading-relaxed text-[#666]">
            Your AI client spawns a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor mcp start</code> subprocess
            and communicates over stdin/stdout. The client owns the process lifecycle — Conductor
            starts when the client starts, exits when the client exits. This is the default for
            all desktop AI clients.
          </p>
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">claude_desktop_config.json (or equivalent)</span>
                <CopyButton text={stdioConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
                <code>{stdioConfig}</code>
              </pre>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { label: "Process model", val: "One process per client session. Exits with the client." },
              { label: "Concurrency", val: "Single client only. Not shareable." },
              { label: "Auth", val: "None needed — process is owned by the client user." },
              { label: "Webhooks", val: "Not supported (no inbound HTTP port)." },
            ].map((r) => (
              <div key={r.label} className="flex items-start gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                <span className="w-28 shrink-0 font-mono text-[10px] text-[#444]">{r.label}</span>
                <span className="text-xs text-[#555]">{r.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-1 font-mono text-xl font-semibold">HTTP</h2>
          <p className="mb-5 mt-2 text-sm leading-relaxed text-[#666]">
            Conductor binds to a TCP port and exposes MCP over HTTP + SSE. Multiple AI clients
            can connect simultaneously. Use this for remote servers, team deployments, CI/CD
            pipelines, and anywhere you need webhooks.
          </p>

          <div className="mb-6 overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">start commands</span>
              <CopyButton text={httpStart} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{httpStart}</code>
            </pre>
          </div>

          <div className="space-y-2">
            {[
              { label: "Process model", val: "Long-running daemon. Survives client disconnects." },
              { label: "Concurrency", val: "Unlimited concurrent clients." },
              { label: "Auth", val: "Bearer token (set in config or CONDUCTOR_AUTH_TOKEN env var)." },
              { label: "Webhooks", val: "Supported — incoming HTTP triggers available on /webhooks." },
              { label: "Events", val: "Server-Sent Events stream at /events for real-time tool notifications." },
            ].map((r) => (
              <div key={r.label} className="flex items-start gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                <span className="w-28 shrink-0 font-mono text-[10px] text-[#444]">{r.label}</span>
                <span className="text-xs text-[#555]">{r.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">HTTP endpoints</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Method</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Path</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  { method: "GET",  path: "/health",        desc: "Health check — returns status, uptime, version" },
                  { method: "GET",  path: "/tools",         desc: "List all registered tools with schemas" },
                  { method: "POST", path: "/tools/call",    desc: "Call a tool by name with arguments" },
                  { method: "GET",  path: "/plugins",       desc: "List loaded plugins and their status" },
                  { method: "GET",  path: "/events",        desc: "SSE stream — real-time tool events" },
                  { method: "POST", path: "/webhooks",      desc: "Incoming webhook trigger endpoint" },
                  { method: "GET",  path: "/metrics",       desc: "Prometheus-format metrics" },
                  { method: "GET",  path: "/audit",         desc: "Recent audit log entries (JSON)" },
                ].map((row) => (
                  <tr key={row.path}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-[10px] text-[#555]">{row.method}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-white">{row.path}</code>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#444]">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Calling the HTTP API</h2>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">curl</span>
                <CopyButton text={httpCurl} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
                <code>{httpCurl}</code>
              </pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">TypeScript SDK</span>
                <CopyButton text={httpClientTs} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
                <code>{httpClientTs}</code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Server-Sent Events</h2>
          <p className="mb-4 text-sm text-[#666]">
            Subscribe to the <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">/events</code> endpoint
            to receive real-time notifications for every tool call. Useful for dashboards, logging pipelines, and CI/CD systems.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">SSE stream</span>
              <CopyButton text={sseExample} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{sseExample}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Authentication</h2>
          <p className="mb-4 text-sm text-[#666]">
            For HTTP transport, enable bearer token auth to restrict access. Set the token in
            config or the <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">CONDUCTOR_AUTH_TOKEN</code> env var.
            All requests must include <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">Authorization: Bearer &lt;token&gt;</code>.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json</span>
              <CopyButton text={authConfig} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{authConfig}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Reverse proxy (nginx)</h2>
          <p className="mb-4 text-sm text-[#666]">
            Put Conductor behind nginx for TLS termination, access control, and rate limiting.
            Set <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">proxy_buffering off</code>{" "}
            — SSE requires it.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">nginx.conf</span>
              <CopyButton text={nginxConf} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{nginxConf}</code>
            </pre>
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/deployment" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Next: Deployment guide
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
