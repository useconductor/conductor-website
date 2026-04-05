import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const githubActions = `name: AI-assisted review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  conductor-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Conductor
        run: npm install -g @useconductor/conductor

      - name: Start Conductor (HTTP transport)
        run: |
          conductor mcp start --transport http --port 3000 &
          sleep 2
          curl -sf http://localhost:3000/health
        env:
          CONDUCTOR_AUTH_TOKEN: \${{ secrets.CONDUCTOR_TOKEN }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Run review
        run: |
          curl -s -X POST http://localhost:3000/tools/call \\
            -H "Authorization: Bearer \${{ secrets.CONDUCTOR_TOKEN }}" \\
            -H "Content-Type: application/json" \\
            -d '{
              "name": "git.diff",
              "arguments": { "staged": false }
            }'`;

const dockerCi = `# docker-compose.ci.yml
version: "3.9"
services:
  conductor:
    image: ghcr.io/useconductor/conductor:latest
    ports: ["3000:3000"]
    environment:
      CONDUCTOR_TRANSPORT: http
      CONDUCTOR_AUTH_TOKEN: \${CONDUCTOR_TOKEN}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 5s
      retries: 10

  test-runner:
    image: node:20
    depends_on:
      conductor:
        condition: service_healthy
    environment:
      CONDUCTOR_URL: http://conductor:3000
      CONDUCTOR_TOKEN: \${CONDUCTOR_TOKEN}
    command: npm test`;

const sdkCi = `import { ConductorClient } from "@useconductor/sdk";

const conductor = new ConductorClient({
  transport: "http",
  url: process.env.CONDUCTOR_URL ?? "http://localhost:3000",
  token: process.env.CONDUCTOR_TOKEN,
});

await conductor.connect();

// Run tests
const testResult = await conductor.callTool("shell.exec", {
  command: "npm",
  args: ["test", "--ci"],
});

// Parse output
const passed = testResult.content[0].text.includes("passing");

if (passed) {
  // Auto-commit if tests pass
  await conductor.callTool("git.commit", {
    message: "chore: auto-commit after CI pass",
    all: true,
  });
}

await conductor.disconnect();`;

const envCi = `# In your CI environment (GitHub Actions secrets, etc.)
CONDUCTOR_TOKEN=your-secure-token-here
CONDUCTOR_LOG_LEVEL=warn

# Plugin credentials
GITHUB_TOKEN=ghp_...
SLACK_BOT_TOKEN=xoxb-...`;

export default function CiCdPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Guides
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          CI/CD integration
        </h1>
        <p className="mt-3 text-[#666]">
          Run Conductor in GitHub Actions, Docker-based pipelines, and automated workflows.
          HTTP transport required — stdio doesn&apos;t work in CI.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Key differences in CI</h2>
          <div className="space-y-2">
            {[
              { label: "Transport", val: "Always HTTP in CI. stdio requires an interactive client process." },
              { label: "Auth", val: "Always set CONDUCTOR_AUTH_TOKEN. No auth = open to anyone on the network." },
              { label: "Approval gates", val: "Disable for automated tools or pre-approve via config. CI has no terminal for interactive prompts." },
              { label: "Log level", val: "Use warn or error in CI. info output is noisy in pipeline logs." },
              { label: "Health check", val: "Wait for GET /health before calling any tools. Don't assume it's up." },
            ].map((r) => (
              <div key={r.label} className="flex items-start gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                <span className="w-28 shrink-0 font-mono text-[10px] text-[#444]">{r.label}</span>
                <span className="text-xs text-[#555]">{r.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">GitHub Actions</h2>
          <p className="mb-4 text-sm text-[#666]">
            Start Conductor in the background, wait for the health check, then call tools via HTTP.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">.github/workflows/conductor.yml</span>
              <CopyButton text={githubActions} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{githubActions}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Docker Compose pipeline</h2>
          <p className="mb-4 text-sm text-[#666]">
            Run Conductor as a sidecar container. Use the{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">depends_on</code>{" "}
            health check condition to ensure Conductor is ready before your test runner starts.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">docker-compose.ci.yml</span>
              <CopyButton text={dockerCi} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{dockerCi}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Using the SDK in scripts</h2>
          <p className="mb-4 text-sm text-[#666]">
            For complex automation, use the TypeScript SDK instead of raw curl. It handles
            connection management and gives you typed tool results.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">ci-script.ts</span>
              <CopyButton text={sdkCi} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{sdkCi}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Disabling approval gates in CI</h2>
          <p className="mb-4 text-sm text-[#666]">
            Approval gates block on an interactive terminal prompt. In CI, there is no terminal.
            Disable them per-plugin in your CI config, or use a separate config file for CI runs.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.ci.json</span>
              <CopyButton text={`{
  "server": {
    "transport": "http",
    "port": 3000
  },
  "approvalGates": {
    "enabled": false
  },
  "plugins": {
    "shell": {
      "allowedCommands": ["npm", "node", "git", "pytest"]
    }
  }
}`} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{`{
  "server": {
    "transport": "http",
    "port": 3000
  },
  "approvalGates": {
    "enabled": false
  },
  "plugins": {
    "shell": {
      "allowedCommands": ["npm", "node", "git", "pytest"]
    }
  }
}`}</code>
            </pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            Point at the CI config:{" "}
            <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">CONDUCTOR_CONFIG_DIR=~/.conductor conductor mcp start --config config.ci.json</code>
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Secrets in CI</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">CI environment variables</span>
              <CopyButton text={envCi} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{envCi}</code>
            </pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            Store all credentials as CI secrets (GitHub: Settings → Secrets and variables). Never hardcode tokens.
          </p>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/deployment" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          See also: Deployment guide
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
