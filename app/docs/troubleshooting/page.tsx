import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const diagCmds = `# Full system health check
conductor doctor

# Verbose server startup (see every event)
conductor mcp start --log-level debug

# Check what plugins are loaded
conductor plugins list

# Validate config file
conductor config validate

# Check config path
conductor config path`;

const debugLog = `# Start in debug mode — every tool call logged to stderr
CONDUCTOR_LOG_LEVEL=debug conductor mcp start

# Sample debug output:
# [debug] Plugin loaded: filesystem (7 tools)
# [debug] Plugin loaded: shell (4 tools)
# [debug] Plugin loaded: git (9 tools)
# [info]  Conductor ready (22 tools across 6 plugins)
# [debug] Tool call: filesystem.read {"path":"./package.json"}
# [debug] Validation passed
# [debug] No approval required
# [debug] Circuit CLOSED — proceeding
# [debug] Handler complete in 2ms
# [debug] Audit entry written`;

export default function TroubleshootingPage() {
  const issues = [
    {
      problem: "Tools don't appear in my AI client",
      causes: [
        "Client not restarted after config change",
        "Config JSON syntax error",
        "Wrong config file location",
        "Conductor not installed globally",
      ],
      fix: `# 1. Verify Conductor is installed
which conductor || npx @useconductor/conductor --version

# 2. Validate your config file
conductor config validate

# 3. Test the connection manually
conductor mcp start --log-level debug

# 4. Hard restart your AI client (quit + reopen, not just reload)`,
    },
    {
      problem: '"command not found: conductor"',
      causes: ["Global npm install failed", "PATH doesn't include npm global bin"],
      fix: `# Check npm global bin location
npm bin -g

# Add it to your PATH (zsh example)
echo 'export PATH="$(npm bin -g):$PATH"' >> ~/.zshrc
source ~/.zshrc

# Or skip the global install entirely — use npx in your AI client config:
# "command": "npx", "args": ["-y", "@useconductor/conductor"]`,
    },
    {
      problem: "Shell commands rejected / not in allowlist",
      causes: ["Shell plugin allowlist is empty by default", "Command not in allowedCommands"],
      fix: `# Interactive setup
conductor config setup shell

# Or manually edit ~/.conductor/config.json:
# {
#   "plugins": {
#     "shell": {
#       "allowedCommands": ["ls", "cat", "git", "npm", "node", "python3"]
#     }
#   }
# }`,
    },
    {
      problem: "Filesystem operations refused",
      causes: ["Path outside allowedPaths", "allowedPaths not configured"],
      fix: `# Add paths to the allowlist
# ~/.conductor/config.json
# {
#   "plugins": {
#     "filesystem": {
#       "allowedPaths": ["~", "/tmp", "/var/www"]
#     }
#   }
# }

# Check what paths are currently allowed
conductor plugins info filesystem`,
    },
    {
      problem: "Database connection fails",
      causes: [
        "Wrong connection string",
        "Database not running",
        "Missing credentials",
        "Firewall blocking connection",
      ],
      fix: `# Test the connection string directly
conductor db test --connection "postgresql://user:pass@localhost:5432/mydb"

# Check plugin config
conductor plugins info database

# View detailed error
conductor mcp start --log-level debug`,
    },
    {
      problem: "Circuit breaker keeps tripping",
      causes: [
        "Underlying service is down",
        "Threshold too low for the tool",
        "Timeout too short for slow operations",
      ],
      fix: `# Check circuit states
conductor circuit list

# Reset a specific circuit
conductor circuit reset tool.name

# Increase threshold for a flaky tool in config:
# "circuitBreaker": {
#   "overrides": {
#     "web.fetch": { "failureThreshold": 10, "timeout": 15000 }
#   }
# }`,
    },
    {
      problem: "Audit log chain verification fails",
      causes: [
        "Log file was manually edited",
        "Disk corruption",
        "Log was truncated by a log rotation tool",
      ],
      fix: `# Check which entry broke the chain
conductor audit verify --verbose

# Archive the broken log and start fresh
mv ~/.conductor/audit.log ~/.conductor/audit.log.broken
# A new audit.log will be created on next tool call

# Note: The broken log still contains readable entries
# (the chain verification failure doesn't erase data)`,
    },
    {
      problem: "High memory or CPU usage",
      causes: [
        "Debug logging writing large volumes",
        "Many plugins with polling (webhooks, watchers)",
        "Large audit log file",
      ],
      fix: `# Switch to warn level in production
CONDUCTOR_LOG_LEVEL=warn conductor mcp start

# Rotate the audit log
conductor audit export --output audit-backup.json
conductor audit rotate

# Check which plugins are active
conductor plugins list --verbose`,
    },
    {
      problem: "Plugin fails to load",
      causes: [
        "Syntax error in plugin file",
        "Missing required config fields",
        "Plugin requires a package that isn't installed",
        "configSchema validation failed",
      ],
      fix: `# See the exact error
conductor mcp start --log-level debug 2>&1 | grep -A5 "plugin"

# Validate plugin manually
conductor plugins validate my-plugin

# Check config schema issues
conductor config validate`,
    },
    {
      problem: "Webhook events not firing",
      causes: [
        "Using stdio transport (webhooks require HTTP)",
        "Wrong secret for HMAC verification",
        "Firewall blocking inbound requests",
      ],
      fix: `# Webhooks require HTTP transport
conductor mcp start --transport http --port 3000

# Test the webhook endpoint
curl -X POST http://localhost:3000/webhooks \\
  -H "Content-Type: application/json" \\
  -d '{"type":"test","data":{}}'

# Check webhook config
conductor webhooks list`,
    },
  ];

  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Resources
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Troubleshooting
        </h1>
        <p className="mt-3 text-[#666]">
          Common problems, their causes, and how to fix them. Start with{" "}
          <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-sm">conductor doctor</code> — it catches most issues automatically.
        </p>
      </div>

      <div className="space-y-10">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Diagnostic commands</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">start here</span>
              <CopyButton text={diagCmds} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{diagCmds}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Enable debug logging</h2>
          <p className="mb-4 text-sm text-[#666]">
            Debug mode logs every tool call, validation step, and circuit breaker decision to stderr.
            Start here when something isn&apos;t working and you don&apos;t know why.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">debug mode</span>
              <CopyButton text={debugLog} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{debugLog}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-mono text-xl font-semibold">Common issues</h2>
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.problem} className="overflow-hidden rounded-lg border border-[#1a1a1a]">
                <div className="border-b border-[#1a1a1a] bg-[#080808] px-5 py-4">
                  <h3 className="font-mono text-sm font-semibold text-white">{issue.problem}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {issue.causes.map((c) => (
                      <span key={c} className="rounded border border-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] text-[#444]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative bg-[#060606]">
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#666]">
                    <code>{issue.fix}</code>
                  </pre>
                  <div className="absolute right-3 top-3">
                    <CopyButton text={issue.fix} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Still stuck?</h2>
          <div className="space-y-3">
            {[
              {
                title: "Check the FAQ",
                desc: "Covers the most common setup questions.",
                href: "/docs/faq",
              },
              {
                title: "Open a GitHub issue",
                desc: "Include the output of `conductor doctor` and `conductor mcp start --log-level debug`.",
                href: "https://github.com/useconductor/conductor/issues",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start justify-between gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4 transition-colors hover:border-[#2a2a2a]"
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[#555]">{item.desc}</p>
                </div>
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a2a2a] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
