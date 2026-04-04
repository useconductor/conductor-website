import Link from "next/link";
import { ArrowRight, Terminal, Settings, Cloud, BookOpen, Database, Shield, Zap } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const guides = [
  {
    icon: Terminal,
    title: "Setting up your first MCP client",
    description: "Connect Claude Code, Cursor, or any MCP client to Conductor in under 5 minutes.",
    href: "#first-client",
    tag: "Beginner",
    readTime: "5 min",
  },
  {
    icon: Settings,
    title: "Writing a custom plugin",
    description: "Build your own plugin with the Plugin interface, configSchema, and tool definitions.",
    href: "#custom-plugins",
    tag: "Advanced",
    readTime: "15 min",
  },
  {
    icon: Cloud,
    title: "Deploying Conductor on a server",
    description: "Run Conductor as a remote MCP server with HTTP transport for shared team access.",
    href: "#remote-deployment",
    tag: "Intermediate",
    readTime: "10 min",
  },
  {
    icon: BookOpen,
    title: "Webhook integrations",
    description: "Connect GitHub, Slack, and other services to trigger Conductor automations.",
    href: "#webhook-integrations",
    tag: "Intermediate",
    readTime: "8 min",
  },
  {
    icon: Database,
    title: "Database plugin setup",
    description: "Connect to PostgreSQL, SQLite, MySQL, and other databases with full schema access.",
    href: "#database-setup",
    tag: "Beginner",
    readTime: "7 min",
  },
  {
    icon: Shield,
    title: "Shell plugin security hardening",
    description: "Configure the command allowlist, approval gates, and sandboxing for production use.",
    href: "#shell-hardening",
    tag: "Intermediate",
    readTime: "6 min",
  },
];

const firstClientGuide = {
  claudeCode: `claude mcp add conductor -- npx -y @thealxlabs/conductor`,
  claudeDesktop: `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@thealxlabs/conductor"]
    }
  }
}`,
  cursor: `{
  "conductor": {
    "command": "npx",
    "args": ["-y", "@thealxlabs/conductor"]
  }
}`,
};

const customPluginCode = `// ~/.conductor/plugins/jira.js
export default class JiraPlugin {
  name = "jira";
  description = "Jira issue management";
  version = "1.0.0";

  configSchema = {
    fields: [
      { key: "baseUrl", label: "Jira base URL", type: "string", required: true },
      { key: "email", label: "Email", type: "string", required: true },
      { key: "apiToken", label: "API Token", type: "string", secret: true, required: true },
    ],
  };

  async initialize(conductor) {
    const config = await conductor.config.get("jira");
    this.client = new JiraClient(config);
  }

  isConfigured() {
    return !!this.client;
  }

  getTools() {
    return [
      {
        name: "jira.create_issue",
        description: "Create a new Jira issue",
        inputSchema: {
          type: "object",
          properties: {
            summary: { type: "string", description: "Issue title" },
            description: { type: "string", description: "Issue body" },
            project: { type: "string", description: "Project key (e.g. ENG)" },
            type: { type: "string", enum: ["Bug", "Story", "Task"], default: "Task" },
          },
          required: ["summary", "project"],
        },
        handler: async ({ summary, description, project, type }) => {
          const issue = await this.client.createIssue({ summary, description, project, type });
          return {
            content: [{ type: "text", text: \`Created: \${issue.key} — \${issue.url}\` }],
          };
        },
      },
    ];
  }
}`;

const remoteDeployCode = `# Start with HTTP transport
conductor mcp start --transport http --port 3000

# Or as a systemd service
# /etc/systemd/system/conductor.service
[Unit]
Description=Conductor MCP Server
After=network.target

[Service]
ExecStart=/usr/local/bin/conductor mcp start --transport http --port 3000
Restart=always
User=conductor
Environment=CONDUCTOR_LOG_LEVEL=info

[Install]
WantedBy=multi-user.target`;

const remoteClientConfig = `{
  "mcpServers": {
    "conductor": {
      "url": "http://your-server:3000/sse",
      "transport": "sse"
    }
  }
}`;

export default function GuidesPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Resources
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Guides
        </h1>
        <p className="mt-3 text-[#666]">
          Step-by-step tutorials for common Conductor use cases.
        </p>
      </div>

      {/* Guide index */}
      <div className="mb-16 space-y-2">
        {guides.map((guide) => (
          <a
            key={guide.href}
            href={guide.href}
            className="group flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-5 transition-colors hover:border-[#2a2a2a]"
          >
            <guide.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#444]" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-semibold">{guide.title}</h3>
                <span className="rounded border border-[#1a1a1a] px-1.5 py-0.5 font-mono text-[9px] text-[#444]">
                  {guide.tag}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#555]">{guide.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#333]">{guide.readTime}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#2a2a2a] transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>
        ))}
      </div>

      {/* Guide: First Client */}
      <div id="first-client" className="scroll-mt-20 space-y-12">
        <div className="border-t border-[#1a1a1a] pt-12">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <Terminal className="h-5 w-5 text-[#444]" />
              <span className="rounded border border-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] text-[#444]">
                Beginner
              </span>
            </div>
            <h2 className="font-mono text-2xl font-bold">
              Setting up your first MCP client
            </h2>
            <p className="mt-2 text-sm text-[#666]">
              Connect any MCP-compatible AI client to Conductor in minutes.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-mono text-base font-semibold">
                1. Claude Code (CLI)
              </h3>
              <p className="mb-3 text-sm text-[#666]">
                The fastest way — one command registers Conductor as an MCP server:
              </p>
              <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
                  <code>{firstClientGuide.claudeCode}</code>
                </pre>
                <CopyButton text={firstClientGuide.claudeCode} className="absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-base font-semibold">
                2. Claude Desktop
              </h3>
              <p className="mb-3 text-sm text-[#666]">
                Edit{" "}
                <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
                  ~/Library/Application Support/Claude/claude_desktop_config.json
                </code>
                :
              </p>
              <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
                  <code>{firstClientGuide.claudeDesktop}</code>
                </pre>
                <CopyButton text={firstClientGuide.claudeDesktop} className="absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-base font-semibold">
                3. Cursor
              </h3>
              <p className="mb-3 text-sm text-[#666]">
                Open Cursor &rarr; Settings &rarr; Features &rarr; MCP Servers and paste:
              </p>
              <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
                  <code>{firstClientGuide.cursor}</code>
                </pre>
                <CopyButton text={firstClientGuide.cursor} className="absolute right-3 top-2.5" />
              </div>
            </div>

            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <h4 className="mb-2 font-mono text-sm font-semibold">
                Verify it&apos;s working
              </h4>
              <p className="text-sm text-[#666]">
                Ask your AI: &ldquo;List the files in my current directory using
                Conductor.&rdquo; If it uses the{" "}
                <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-xs">
                  filesystem.list
                </code>{" "}
                tool and returns a result, you&apos;re connected.
              </p>
            </div>
          </div>
        </div>

        {/* Guide: Custom Plugin */}
        <div id="custom-plugins" className="scroll-mt-20 border-t border-[#1a1a1a] pt-12">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <Settings className="h-5 w-5 text-[#444]" />
              <span className="rounded border border-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] text-[#444]">
                Advanced
              </span>
            </div>
            <h2 className="font-mono text-2xl font-bold">
              Writing a custom plugin
            </h2>
            <p className="mt-2 text-sm text-[#666]">
              Build a Jira integration as an example of the full plugin API.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-[#666]">
              External plugins live in{" "}
              <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
                ~/.conductor/plugins/
              </code>
              . Each file exports a default class implementing the{" "}
              <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
                Plugin
              </code>{" "}
              interface. Below is a full Jira plugin example:
            </p>

            <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
                <span className="font-mono text-[10px] text-[#3a3a3a]">
                  ~/.conductor/plugins/jira.js
                </span>
                <CopyButton text={customPluginCode} />
              </div>
              <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
                <code>{customPluginCode}</code>
              </pre>
            </div>

            <p className="text-sm leading-relaxed text-[#666]">
              Enable and configure the plugin:
            </p>

            <div className="space-y-3">
              {[
                { cmd: "conductor plugins enable jira", desc: "Enable the plugin" },
                { cmd: "conductor config setup jira", desc: "Configure credentials (stored in keychain)" },
                { cmd: "conductor plugins status jira", desc: "Verify it's active" },
              ].map((item) => (
                <div
                  key={item.cmd}
                  className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]"
                >
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <code className="font-mono text-sm text-white">{item.cmd}</code>
                      <p className="mt-0.5 text-xs text-[#555]">{item.desc}</p>
                    </div>
                    <CopyButton text={item.cmd} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guide: Remote Deployment */}
        <div id="remote-deployment" className="scroll-mt-20 border-t border-[#1a1a1a] pt-12">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <Cloud className="h-5 w-5 text-[#444]" />
              <span className="rounded border border-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] text-[#444]">
                Intermediate
              </span>
            </div>
            <h2 className="font-mono text-2xl font-bold">
              Deploying on a server
            </h2>
            <p className="mt-2 text-sm text-[#666]">
              Run Conductor as a shared MCP server accessible over the network.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-[#666]">
              Start Conductor with HTTP transport. AI clients connect via
              Server-Sent Events (SSE) instead of stdio.
            </p>

            <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
                <span className="font-mono text-[10px] text-[#3a3a3a]">
                  terminal / conductor.service
                </span>
                <CopyButton text={remoteDeployCode} />
              </div>
              <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
                <code>{remoteDeployCode}</code>
              </pre>
            </div>

            <p className="text-sm text-[#666]">
              Configure your AI client to connect remotely:
            </p>

            <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
                <span className="font-mono text-[10px] text-[#3a3a3a]">
                  claude_desktop_config.json
                </span>
                <CopyButton text={remoteClientConfig} />
              </div>
              <pre className="p-4 text-sm font-mono leading-relaxed text-[#888]">
                <code>{remoteClientConfig}</code>
              </pre>
            </div>

            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <h4 className="mb-2 font-mono text-sm font-semibold">
                Security note
              </h4>
              <p className="text-sm text-[#666]">
                When running over HTTP, use a reverse proxy (nginx, Caddy) with
                TLS and add authentication. Conductor&apos;s HTTP endpoints are
                not authenticated by default.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
