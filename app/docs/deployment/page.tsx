import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const dockerCompose = `version: "3.9"
services:
  conductor:
    image: ghcr.io/useconductor/conductor:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      CONDUCTOR_TRANSPORT: http
      CONDUCTOR_PORT: 3000
      CONDUCTOR_AUTH_TOKEN: \${CONDUCTOR_AUTH_TOKEN}
      CONDUCTOR_LOG_LEVEL: info
    volumes:
      # Persist config and audit logs
      - conductor_data:/home/conductor/.conductor
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  conductor_data:`;

const dockerfile = `FROM node:20-alpine

# Create non-root user
RUN addgroup -S conductor && adduser -S conductor -G conductor

WORKDIR /app
RUN npm install -g @useconductor/conductor

USER conductor

EXPOSE 3000
CMD ["conductor", "mcp", "start", "--transport", "http", "--port", "3000"]`;

const systemdUnit = `[Unit]
Description=Conductor MCP Server
After=network.target

[Service]
Type=simple
User=conductor
WorkingDirectory=/home/conductor
ExecStart=/usr/bin/conductor mcp start --transport http --port 3000
Restart=on-failure
RestartSec=5
Environment=CONDUCTOR_AUTH_TOKEN=your-token-here
Environment=CONDUCTOR_LOG_LEVEL=info

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=/home/conductor/.conductor

[Install]
WantedBy=multi-user.target`;

const systemdCmds = `# Install and enable
sudo systemctl daemon-reload
sudo systemctl enable conductor
sudo systemctl start conductor

# Check status
sudo systemctl status conductor

# View logs
journalctl -u conductor -f`;

const remoteMcpConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/client-sse",
        "https://conductor.yourcompany.com"
      ],
      "env": {
        "CONDUCTOR_TOKEN": "your-bearer-token"
      }
    }
  }
}`;

const envFile = `# .env (never commit this)
CONDUCTOR_AUTH_TOKEN=your-secret-token
CONDUCTOR_LOG_LEVEL=info
CONDUCTOR_PORT=3000

# Plugin credentials
GITHUB_TOKEN=ghp_...
SLACK_BOT_TOKEN=xoxb-...
NOTION_API_KEY=secret_...`;

export default function DeploymentPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Deployment
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Deployment guide
        </h1>
        <p className="mt-3 text-[#666]">
          Run Conductor locally, in Docker, or as a remote shared server. Same binary, different transport.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Deployment options</h2>
          <div className="grid gap-px bg-[#1a1a1a] sm:grid-cols-3">
            {[
              {
                title: "Local (stdio)",
                desc: "Default. Your AI client spawns Conductor per-session. No setup beyond the config block. Best for solo developers.",
                when: "Personal use, single machine",
              },
              {
                title: "Local (HTTP)",
                desc: "Conductor runs as a background process on your machine. Useful when multiple clients need to share one instance.",
                when: "Multiple local clients, webhooks",
              },
              {
                title: "Remote server",
                desc: "Run Conductor on a VPS or in Docker. Team members connect from anywhere. Full webhook and SSE support.",
                when: "Teams, CI/CD, shared infrastructure",
              },
            ].map((opt) => (
              <div key={opt.title} className="bg-[#080808] p-6">
                <p className="font-mono text-sm font-semibold text-white">{opt.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#555]">{opt.desc}</p>
                <p className="mt-3 font-mono text-[10px] text-[#333]">{opt.when}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Docker Compose</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            The fastest path to a production-ready remote deployment. Set{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">CONDUCTOR_AUTH_TOKEN</code>{" "}
            in your environment before starting.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">docker-compose.yml</span>
              <CopyButton text={dockerCompose} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{dockerCompose}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Dockerfile (custom image)</h2>
          <p className="mb-4 text-sm text-[#666]">
            Build your own image to bake in plugin configuration, custom plugins, or specific Node versions.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">Dockerfile</span>
              <CopyButton text={dockerfile} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{dockerfile}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">systemd (Linux VPS)</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Run Conductor as a system service with automatic restart, log journaling, and security hardening.
            Install Node.js 18+ and Conductor globally first.
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">/etc/systemd/system/conductor.service</span>
                <CopyButton text={systemdUnit} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
                <code>{systemdUnit}</code>
              </pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
                <CopyButton text={systemdCmds} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
                <code>{systemdCmds}</code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Connecting AI clients to a remote server</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Point your AI client at the remote Conductor instance instead of spawning a local process.
            Use the SSE transport URL.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">claude_desktop_config.json</span>
              <CopyButton text={remoteMcpConfig} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{remoteMcpConfig}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Secrets and environment variables</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Never put credentials in{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">config.json</code>.
            Pass them as environment variables. Conductor reads them at startup and stores encrypted
            copies in the OS keychain for future runs.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">.env</span>
              <CopyButton text={envFile} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{envFile}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Production checklist</h2>
          <div className="space-y-2">
            {[
              { item: "Enable bearer token auth", detail: "CONDUCTOR_AUTH_TOKEN or config.server.auth" },
              { item: "Put it behind a reverse proxy", detail: "nginx or Caddy — TLS termination, rate limiting" },
              { item: "Run as a non-root user", detail: "Dedicated conductor system user" },
              { item: "Mount a persistent volume for ~/.conductor", detail: "Config, audit logs, and encrypted secrets survive restarts" },
              { item: "Set CONDUCTOR_LOG_LEVEL=warn in production", detail: "info is noisy at scale" },
              { item: "Ship audit logs to a SIEM", detail: "audit.log is newline-delimited JSON — easy to forward" },
              { item: "Configure allowlists before enabling shell plugin", detail: "Default is no commands allowed" },
              { item: "Test the health endpoint in your monitoring", detail: "GET /health returns 200 with version + uptime" },
            ].map((c) => (
              <div key={c.item} className="flex items-start gap-3 rounded border border-[#111] bg-[#070707] px-4 py-3">
                <span className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-[#1a1a1a]" />
                <div>
                  <p className="font-mono text-xs text-white">{c.item}</p>
                  <p className="mt-0.5 text-[10px] text-[#444]">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/custom-plugins" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Next: Writing custom plugins
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
