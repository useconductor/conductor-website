import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const envVars = [
  { key: "CONDUCTOR_LOG_LEVEL", default: "info", desc: "error | warn | info | debug" },
  { key: "CONDUCTOR_CONFIG_DIR", default: "~/.conductor", desc: "Override the config directory" },
  { key: "CONDUCTOR_TRANSPORT", default: "stdio", desc: "stdio | http" },
  { key: "CONDUCTOR_PORT", default: "3000", desc: "HTTP port (ignored for stdio)" },
  { key: "CONDUCTOR_PLUGINS", default: "(all enabled)", desc: "Comma-separated list to activate" },
  { key: "CONDUCTOR_NO_AUDIT", default: "false", desc: "Disable audit logging (not recommended)" },
];

const configExample = `// ~/.conductor/config.json
{
  "server": {
    "transport": "stdio",
    "logLevel": "info"
  },
  "plugins": {
    "shell": {
      "enabled": true,
      "allowedCommands": ["ls", "cat", "git", "npm", "node", "python3"],
      "requireApproval": ["rm", "mv", "chmod", "sudo"]
    },
    "filesystem": {
      "enabled": true,
      "allowedPaths": ["~", "/tmp"],
      "requireApproval": ["delete"]
    },
    "database": {
      "enabled": true,
      "connections": {
        "main": "sqlite:~/.conductor/app.db",
        "postgres": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}`;

const startCmds = `# Default: stdio transport (used by AI clients)
conductor mcp start

# HTTP transport (for remote/shared access)
conductor mcp start --transport http --port 3000

# Specific plugins only
conductor mcp start --plugins filesystem,shell,git

# Debug logging
conductor mcp start --log-level debug`;

const pipeline = [
  {
    step: "1",
    label: "Input validation",
    desc: "Tool inputs are validated against the plugin's JSON schema before anything else happens. Invalid inputs are rejected immediately.",
  },
  {
    step: "2",
    label: "Approval gate",
    desc: "If the tool has requiresApproval: true, execution pauses and the user must confirm in the terminal. The AI waits for the response.",
  },
  {
    step: "3",
    label: "Circuit breaker check",
    desc: "If the tool's circuit is OPEN (too many recent failures), the call fails fast with an error. The AI is informed and can try something else.",
  },
  {
    step: "4",
    label: "Handler execution",
    desc: "The plugin's handler runs with the validated input. Failures trigger retry with exponential backoff before updating the circuit breaker.",
  },
  {
    step: "5",
    label: "Audit log write",
    desc: "The call, input hash, result status, and SHA-256 chain link are appended to ~/.conductor/audit.log. Cannot be skipped.",
  },
];

export default function McpServerPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Configuration
        </h1>
        <p className="mt-3 text-[#666]">
          How Conductor works, how to configure it, and what happens when your AI calls a tool.
        </p>
      </div>

      <div className="space-y-12">

        {/* How it runs */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">How it runs</h2>
          <p className="text-sm leading-relaxed text-[#666]">
            When you add Conductor to your AI client&apos;s config, the client spawns a{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              conductor mcp start
            </code>{" "}
            process and talks to it over stdin/stdout (stdio transport). The process loads
            all enabled plugins, registers their tools, and waits for the AI to call them.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#666]">
            You don&apos;t need to start it manually. Your AI client handles the process lifecycle.
            If you want remote access or a shared team server, use HTTP transport instead.
          </p>
        </section>

        {/* Starting the server */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Start commands</h2>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={startCmds} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{startCmds}</code>
            </pre>
          </div>
        </section>

        {/* Config file */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Config file</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            The config file lives at{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              ~/.conductor/config.json
            </code>{" "}
            (or wherever{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              CONDUCTOR_CONFIG_DIR
            </code>{" "}
            points). Run{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              conductor config setup
            </code>{" "}
            to generate it interactively.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">
                ~/.conductor/config.json
              </span>
              <CopyButton text={configExample} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{configExample}</code>
            </pre>
          </div>
        </section>

        {/* What happens on a tool call */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">What happens on every tool call</h2>
          <p className="mb-5 text-sm text-[#666]">
            In order, every time your AI calls a tool:
          </p>
          <div className="space-y-2">
            {pipeline.map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4"
              >
                <span className="mt-0.5 w-4 shrink-0 font-mono text-xs text-[#2a2a2a]">{item.step}</span>
                <div>
                  <span className="font-mono text-xs font-semibold text-white">{item.label}</span>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#555]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Environment variables */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Environment variables</h2>
          <p className="mb-4 text-sm text-[#666]">
            All config can be overridden via environment variables. Useful for CI, Docker, or
            passing secrets without touching the config file.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Variable</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Default</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Values</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {envVars.map((v) => (
                  <tr key={v.key}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-white">{v.key}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-[#555]">{v.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#444]">{v.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CLI commands */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Useful CLI commands</h2>
          <div className="space-y-2">
            {[
              { cmd: "conductor doctor", desc: "Check system health — Node.js, config, database, plugins" },
              { cmd: "conductor config setup", desc: "Interactive setup wizard" },
              { cmd: "conductor config path", desc: "Print the config directory path" },
              { cmd: "conductor plugins list", desc: "List all plugins and their status" },
              { cmd: "conductor plugins enable <name>", desc: "Enable a plugin" },
              { cmd: "conductor plugins disable <name>", desc: "Disable a plugin" },
              { cmd: "conductor audit list", desc: "Print recent audit log entries" },
              { cmd: "conductor mcp start --log-level debug", desc: "Start with verbose logging for debugging" },
            ].map((item) => (
              <div key={item.cmd} className="flex items-start justify-between gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] p-3">
                <code className="shrink-0 font-mono text-xs text-white">{item.cmd}</code>
                <span className="text-right text-xs text-[#444]">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/plugins" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Next: Plugin reference
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
