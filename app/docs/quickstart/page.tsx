import Link from "next/link";
import { ArrowRight, Copy, Terminal, Check } from "lucide-react";

const steps = [
  {
    title: "Install Conductor",
    code: "npm install -g @thealxlabs/conductor",
    description:
      "Install globally via npm, or use the install script for a standalone binary.",
  },
  {
    title: "Initialize configuration",
    code: "conductor config setup",
    description:
      "This creates ~/.conductor/config.json and sets up your database.",
  },
  {
    title: "Enable plugins",
    code: "conductor plugins enable filesystem shell git",
    description:
      "Enable the plugins you need. File system, shell, and git are recommended for getting started.",
  },
  {
    title: "Start the MCP server",
    code: "conductor mcp start",
    description: "Starts the MCP server on stdio. Point your AI client to it.",
  },
];

const mcpConfigs = [
  {
    client: "Claude Desktop",
    path: "~/Library/Application Support/Claude/claude_desktop_config.json",
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@thealxlabs/conductor"]
    }
  }
}`,
  },
  {
    client: "Cursor",
    path: "Settings > Features > MCP Servers",
    config: `{
  "conductor": {
    "command": "npx",
    "args": ["-y", "@thealxlabs/conductor"]
  }
}`,
  },
  {
    client: "Cline",
    path: "Cline MCP Settings",
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@thealxlabs/conductor"]
    }
  }
}`,
  },
];

export default function QuickStartPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Getting Started
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Quick Start
        </h1>
        <p className="mt-3 text-[#888]">
          Get Conductor running in under 5 minutes.
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((step, i) => (
          <div key={i} className="group">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1a1a1a] font-mono text-xs text-[#555]">
                {i + 1}
              </span>
              <h2 className="font-mono text-lg font-semibold">{step.title}</h2>
            </div>
            <p className="mb-3 text-sm text-[#888]">{step.description}</p>
            <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
              <pre className="p-4 text-sm font-mono text-[#ccc]">
                <code>{step.code}</code>
              </pre>
              <button className="absolute top-2 right-2 rounded border border-[#222] bg-[#111] p-1.5 text-[#888] transition-colors hover:text-white">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 border-t border-[#1a1a1a] pt-12">
        <h2 className="mb-6 font-mono text-xl font-semibold">
          Configure your AI client
        </h2>
        <div className="space-y-4">
          {mcpConfigs.map((cfg) => (
            <div
              key={cfg.client}
              className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]"
            >
              <div className="border-b border-[#1a1a1a] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-mono text-sm font-semibold">
                      {cfg.client}
                    </h3>
                    <p className="text-xs text-[#555]">{cfg.path}</p>
                  </div>
                </div>
              </div>
              <pre className="p-4 text-sm font-mono text-[#ccc]">
                <code>{cfg.config}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-4">
        <Link
          href="/docs/mcp-server"
          className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
        >
          Next: MCP Server
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
