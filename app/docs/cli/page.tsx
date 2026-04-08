import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type CommandRow = {
  cmd: string;
  desc: string;
};

type CommandGroup = {
  title: string;
  description?: string;
  commands: CommandRow[];
  extra?: string;
};

const globalFlags: CommandRow[] = [
  { cmd: "--help, -h", desc: "Show help for any command" },
  { cmd: "--version, -v", desc: "Print the installed Conductor version" },
  { cmd: "--config-dir <path>", desc: "Override the default ~/.conductor config directory" },
  { cmd: "--quiet, -q", desc: "Suppress non-error output (useful for scripting)" },
  { cmd: "--log-level <level>", desc: "Set log verbosity: error | warn | info | debug" },
];

const commandGroups: CommandGroup[] = [
  {
    title: "conductor init",
    description:
      "First-run wizard. Creates ~/.conductor/config.json and ~/.conductor/conductor.db, prompts for AI provider credentials, lets you select plugins, and optionally auto-configures Claude Desktop or Cursor.",
    commands: [
      { cmd: "conductor init", desc: "Run the interactive setup wizard" },
      { cmd: "conductor init --yes", desc: "Accept all defaults, skip prompts" },
      { cmd: "conductor init --provider anthropic", desc: "Pre-select AI provider and skip that prompt" },
    ],
    extra: `# What conductor init does:
# 1. Checks for Node.js 18+ and npm
# 2. Creates ~/.conductor/ directory structure
# 3. Prompts: instance name, AI provider, API key
# 4. Interactive plugin picker (space to select, enter to confirm)
# 5. Optional: auto-write AI client config (Claude Desktop, Cursor)
# 6. Generates ~/.conductor/.key (machine-bound AES-256-GCM key)`,
  },
  {
    title: "conductor mcp",
    description:
      "Start and manage the MCP server. The server exposes all enabled plugin tools to any MCP-compatible AI client. stdio transport is used by AI clients; HTTP/SSE transport is used for the dashboard.",
    commands: [
      { cmd: "conductor mcp start", desc: "Start MCP server on stdio transport (default)" },
      { cmd: "conductor mcp start --transport http", desc: "Start on HTTP/SSE transport (for dashboard)" },
      { cmd: "conductor mcp start --port 3000", desc: "Set the HTTP port (default: 3000)" },
      { cmd: "conductor mcp start --plugins calculator,weather", desc: "Load only a subset of plugins" },
      { cmd: "conductor mcp start --log-level debug", desc: "Enable verbose logging to stderr" },
      { cmd: "conductor mcp setup", desc: "Auto-configure Claude Desktop and Cursor config files" },
      { cmd: "conductor mcp setup --client cursor", desc: "Configure a specific client only" },
      { cmd: "conductor mcp status", desc: "Show server status, tool count, and active plugins" },
    ],
    extra: `# conductor mcp setup writes to:
# macOS Claude Desktop: ~/Library/Application Support/Claude/claude_desktop_config.json
# Windows Claude Desktop: %APPDATA%\\Claude\\claude_desktop_config.json
# Cursor (global):        ~/.cursor/mcp.json
# Cursor (project):       .cursor/mcp.json (if run from a project directory)`,
  },
  {
    title: "conductor plugins",
    description:
      "Manage the plugin registry. Enable, disable, configure, and install plugins. Changes take effect immediately without restarting the server.",
    commands: [
      { cmd: "conductor plugins list", desc: "List all plugins with status, tool count, and config state" },
      { cmd: "conductor plugins list --json", desc: "Output plugin list as JSON" },
      { cmd: "conductor plugins enable <name>", desc: "Enable a plugin" },
      { cmd: "conductor plugins enable github slack linear", desc: "Enable multiple plugins at once" },
      { cmd: "conductor plugins disable <name>", desc: "Disable a plugin immediately" },
      { cmd: "conductor plugins setup <name>", desc: "Interactive credential setup using the plugin's configSchema" },
      { cmd: "conductor plugins setup <name> --key <k> --value <v>", desc: "Set a single config value non-interactively" },
      { cmd: "conductor plugins install <name>", desc: "Install a plugin from the marketplace (npm)" },
      { cmd: "conductor plugins install <name>@1.2.3", desc: "Install a specific version" },
      { cmd: "conductor plugins uninstall <name>", desc: "Remove a marketplace plugin" },
      { cmd: "conductor plugins onboard", desc: "Launch the interactive TUI plugin picker" },
      { cmd: "conductor plugins info <name>", desc: "Show plugin details, tools, and config schema" },
    ],
    extra: `# conductor plugins list output example:
# NAME             STATUS          TOOLS   ZERO-CONFIG
# calculator       ready           3       ✓
# weather          ready           3       ✓
# github           ready           20      partial
# slack            not_configured  0       ✗
# linear           disabled        —       ✗`,
  },
  {
    title: "conductor config",
    description:
      "Read and write Conductor configuration. Non-secret values are stored in ~/.conductor/config.json. Secret values (API keys) are stored in the encrypted local credential store (AES-256-GCM) and never appear in config.json.",
    commands: [
      { cmd: "conductor config get <key>", desc: "Print a config value" },
      { cmd: "conductor config set <key> <value>", desc: "Set a non-secret config value" },
      { cmd: "conductor config list", desc: "Print all config values (secrets redacted)" },
      { cmd: "conductor config setup <plugin>", desc: "Run guided setup for a specific plugin" },
      { cmd: "conductor config reset", desc: "Reset config to defaults (preserves secrets in credential store)" },
      { cmd: "conductor config export", desc: "Export non-secret config to stdout as JSON" },
    ],
  },
  {
    title: "conductor ai",
    description:
      "Configure and test AI provider connections. Conductor supports Anthropic Claude, OpenAI, Google Gemini, and Ollama.",
    commands: [
      { cmd: "conductor ai setup", desc: "Interactive AI provider configuration wizard" },
      { cmd: "conductor ai test", desc: "Send a test prompt to verify the current provider is working" },
      { cmd: "conductor ai list", desc: "List configured providers and current default" },
      { cmd: "conductor ai use <provider>", desc: "Switch the active AI provider" },
    ],
    extra: `# Supported providers:
# anthropic    Claude 3.5 Sonnet, Claude 3 Opus, Haiku
# openai       GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
# gemini       Gemini 1.5 Pro, Gemini Flash
# ollama       Any local Ollama model (llama3, mistral, codestral, etc.)`,
  },
  {
    title: "conductor audit",
    description:
      "Interact with the append-only SHA-256 chained audit log at ~/.conductor/audit.log. Every tool call, input, and output is recorded with a chain of hashes to detect tampering.",
    commands: [
      { cmd: "conductor audit tail", desc: "Stream the live audit log in real time" },
      { cmd: "conductor audit tail --plugin github", desc: "Filter stream by plugin name" },
      { cmd: "conductor audit verify", desc: "Verify SHA-256 chain integrity (detect tampering)" },
      { cmd: "conductor audit export", desc: "Export full audit log to stdout as JSONL" },
      { cmd: "conductor audit export --format json", desc: "Export as a JSON array" },
      { cmd: "conductor audit export --since 24h", desc: "Export entries from the last 24 hours" },
      { cmd: "conductor audit stats", desc: "Show call counts, top tools, and error rates" },
    ],
    extra: `# Audit log entry structure (JSONL):
{
  "seq": 1042,
  "timestamp": "2026-04-04T10:23:45.123Z",
  "tool": "github_issues",
  "plugin": "github",
  "input": { "owner": "myorg", "repo": "api", "state": "open" },
  "output": { "count": 14 },
  "latency_ms": 312,
  "hash": "sha256:a3f4...",
  "prev_hash": "sha256:9b2c..."
}`,
  },
  {
    title: "conductor webhooks",
    description:
      "Manage outgoing webhooks. Conductor pushes signed events to your endpoints when tools are called, plugins change state, or the circuit breaker opens.",
    commands: [
      { cmd: "conductor webhooks list", desc: "List all registered webhooks" },
      { cmd: "conductor webhooks add --url <url>", desc: "Register a new webhook endpoint" },
      { cmd: "conductor webhooks add --url <url> --events tool.called,tool.failed", desc: "Subscribe to specific events only" },
      { cmd: "conductor webhooks add --url <url> --secret <s>", desc: "Add HMAC signing secret for verification" },
      { cmd: "conductor webhooks remove <id>", desc: "Remove a webhook by ID" },
      { cmd: "conductor webhooks test <id>", desc: "Send a test payload to a webhook endpoint" },
    ],
  },
  {
    title: "conductor doctor",
    description:
      "Diagnose your Conductor installation. Checks Node.js version, config file validity, plugin states, AI provider connectivity, database integrity, and credential store access.",
    commands: [
      { cmd: "conductor doctor", desc: "Run all health checks and print a report" },
      { cmd: "conductor doctor --fix", desc: "Attempt to auto-fix common issues (reinstall deps, reset DB)" },
      { cmd: "conductor doctor --json", desc: "Output results as JSON for scripting" },
    ],
    extra: `# conductor doctor checks:
# ✓ Node.js 18+ installed
# ✓ ~/.conductor/config.json valid
# ✓ ~/.conductor/conductor.db accessible
# ✓ Encrypted credential store accessible
# ✓ All enabled plugins: ready
# ✓ AI provider: connected (claude-3-5-sonnet-20241022)
# ✓ Audit log: 1042 entries, chain intact
# ⚠ slack: not_configured — run: conductor plugins setup slack`,
  },
  {
    title: "conductor dashboard",
    description:
      "Start the web dashboard. The dashboard provides a real-time view of tool calls, plugin health, audit logs, and metrics. Runs on HTTP transport.",
    commands: [
      { cmd: "conductor dashboard start", desc: "Start dashboard on http://localhost:4040" },
      { cmd: "conductor dashboard start --port 8080", desc: "Use a custom port" },
      { cmd: "conductor dashboard open", desc: "Open the dashboard in your default browser" },
    ],
  },
  {
    title: "conductor plugin-create",
    description:
      "Scaffold a new plugin with the correct directory structure, package.json, TypeScript config, and entry point. Generates a working plugin you can publish to the marketplace.",
    commands: [
      { cmd: "conductor plugin-create <name>", desc: "Scaffold a new plugin in the current directory" },
      { cmd: "conductor plugin-create <name> --typescript", desc: "Use TypeScript template (default: JS)" },
      { cmd: "conductor plugin-create <name> --publish", desc: "Include npm publish scripts" },
    ],
    extra: `# Generated structure:
# my-plugin/
#   package.json          (name: @conductor-plugins/my-plugin)
#   src/index.ts          (Plugin class with configSchema and getTools())
#   tsconfig.json
#   README.md
#   tests/index.test.ts`,
  },
];

const envVars: CommandRow[] = [
  { cmd: "CONDUCTOR_CONFIG_DIR", desc: "Override config directory (default: ~/.conductor)" },
  { cmd: "CONDUCTOR_LOG_LEVEL", desc: "Log verbosity: error | warn | info | debug" },
  { cmd: "CONDUCTOR_TRANSPORT", desc: "MCP transport: stdio | http" },
  { cmd: "CONDUCTOR_PORT", desc: "HTTP transport port (default: 3000)" },
  { cmd: "CONDUCTOR_PLUGINS", desc: "Comma-separated list of plugins to activate" },
  { cmd: "CONDUCTOR_NO_KEYCHAIN", desc: "Disable OS keychain, use encrypted file fallback" },
  { cmd: "CONDUCTOR_DISABLE_AUDIT", desc: "Disable audit logging (not recommended for production)" },
  { cmd: "NO_COLOR", desc: "Disable ANSI color output (standard env var)" },
];

export default function CliPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Reference
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          CLI Reference
        </h1>
        <p className="mt-3 text-[#666]">
          Complete reference for every Conductor CLI command, flag, and environment variable.
        </p>
      </div>

      <div className="space-y-14">
        {/* Global flags */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Global Flags</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            These flags work with every command.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Flag</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Description</th>
                </tr>
              </thead>
              <tbody>
                {globalFlags.map((flag, i) => (
                  <tr key={flag.cmd} className={i < globalFlags.length - 1 ? "border-b border-[#111]" : ""}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-white">{flag.cmd}</code>
                    </td>
                    <td className="px-4 py-3 text-[#555]">{flag.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Command groups */}
        {commandGroups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 font-mono text-xl font-semibold">{group.title}</h2>
            {group.description && (
              <p className="mb-4 text-sm leading-relaxed text-[#666]">{group.description}</p>
            )}
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                    <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Command</th>
                    <th className="hidden px-4 py-2.5 text-left font-mono font-medium text-[#333] sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {group.commands.map((row, i) => (
                    <tr key={row.cmd} className={i < group.commands.length - 1 ? "border-b border-[#111]" : ""}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CopyButton text={row.cmd} />
                          <code className="font-mono text-white">{row.cmd}</code>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-[#555] sm:table-cell">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {group.extra && (
              <div className="relative mt-3 overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">example</span>
                  <CopyButton text={group.extra} />
                </div>
                <pre className="overflow-x-auto p-4 text-[11px] font-mono leading-relaxed text-[#555]">
                  <code>{group.extra}</code>
                </pre>
              </div>
            )}
          </section>
        ))}

        {/* Environment variables */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Environment Variables</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Environment variables override config file values. Useful for CI/CD, Docker, and
            team deployments where you want to configure Conductor without running the wizard.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Variable</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Description</th>
                </tr>
              </thead>
              <tbody>
                {envVars.map((env, i) => (
                  <tr key={env.cmd} className={i < envVars.length - 1 ? "border-b border-[#111]" : ""}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-white">{env.cmd}</code>
                    </td>
                    <td className="px-4 py-3 text-[#555]">{env.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">environment usage example</span>
              <CopyButton text={`CONDUCTOR_TRANSPORT=http CONDUCTOR_PORT=8080 CONDUCTOR_PLUGINS=github,linear conductor mcp start`} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{`# Start HTTP server on port 8080 with only github and linear plugins
CONDUCTOR_TRANSPORT=http \\
CONDUCTOR_PORT=8080 \\
CONDUCTOR_PLUGINS=github,linear \\
conductor mcp start`}</code>
            </pre>
          </div>
        </section>

        {/* Exit codes */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Exit Codes</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Code</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: "0", desc: "Success" },
                  { code: "1", desc: "General error (invalid args, config issue)" },
                  { code: "2", desc: "Plugin init failure" },
                  { code: "3", desc: "AI provider connection failure" },
                  { code: "4", desc: "Database error" },
                  { code: "127", desc: "Command not found (conductor not installed)" },
                ].map((row, i, arr) => (
                  <tr key={row.code} className={i < arr.length - 1 ? "border-b border-[#111]" : ""}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-white">{row.code}</code>
                    </td>
                    <td className="px-4 py-3 text-[#555]">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Next */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8 flex items-center gap-6">
        <Link
          href="/docs/plugins"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Plugin System
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/docs/webhooks"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Webhooks
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
