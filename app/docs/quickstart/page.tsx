import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const clientConfigs: {
  client: string;
  path: string;
  config: string;
  note?: string;
}[] = [
  {
    client: "Claude Code (CLI)",
    path: "one command",
    config: "claude mcp add conductor -- npx -y @useconductor/conductor",
    note: "This is the fastest path. Run it once, then restart Claude Code.",
  },
  {
    client: "Claude Desktop",
    path: "~/Library/Application Support/Claude/claude_desktop_config.json",
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`,
    note: "Restart Claude Desktop after saving.",
  },
  {
    client: "Cursor",
    path: "Settings → Features → MCP Servers",
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`,
  },
  {
    client: "Cline / Roo Code",
    path: "Cline panel → MCP icon → paste config",
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`,
  },
  {
    client: "Windsurf",
    path: "~/.codeium/windsurf/mcp_settings.json",
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`,
  },
  {
    client: "Continue.dev",
    path: "~/.continue/config.json",
    config: `{
  "mcpServers": [
    {
      "name": "conductor",
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  ]
}`,
    note: "Continue uses an array for mcpServers, not an object.",
  },
];

const verifyPrompts = [
  {
    prompt: "List the files in my current directory",
    tool: "filesystem.list",
    what: "Confirms the filesystem plugin is active",
  },
  {
    prompt: "What's the current git status?",
    tool: "git.status",
    what: "Confirms the git plugin is active",
  },
  {
    prompt: "Run echo hello",
    tool: "shell.exec",
    what: "Confirms shell is active (will ask for approval first)",
  },
];

export default function QuickStartPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Getting Started
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Quick Start
        </h1>
        <p className="mt-3 text-[#666]">
          Three steps: install, connect your AI client, verify it works.
        </p>
      </div>

      <div className="space-y-14">

        {/* Step 1: Install */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1a1a1a] font-mono text-xs text-[#444]">1</span>
            <h2 className="font-mono text-lg font-semibold">Install</h2>
          </div>
          <p className="mb-4 text-sm text-[#666]">
            Install globally with npm. Requires Node.js 18+. If you don&apos;t want a global install, skip to the npx config in Step 2 — it works without installing anything.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
              <code>npm install -g @useconductor/conductor</code>
            </pre>
            <CopyButton text="npm install -g @useconductor/conductor" className="absolute right-3 top-2.5" />
          </div>
          <p className="mt-3 text-xs text-[#555]">
            No Node.js? Use the{" "}
            <Link href="/install" className="underline decoration-[#333] underline-offset-2 hover:text-white">
              standalone binary installer
            </Link>
            .
          </p>
        </section>

        {/* Step 2: Connect */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1a1a1a] font-mono text-xs text-[#444]">2</span>
            <h2 className="font-mono text-lg font-semibold">Connect your AI client</h2>
          </div>
          <p className="mb-5 text-sm text-[#666]">
            Pick your client below. All of them use the same pattern — one config block that tells the client how to spawn Conductor.
          </p>
          <div className="space-y-4">
            {clientConfigs.map((cfg) => (
              <div key={cfg.client} className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-start justify-between border-b border-[#1a1a1a] px-4 py-3">
                  <div>
                    <h3 className="font-mono text-sm font-semibold">{cfg.client}</h3>
                    <p className="mt-0.5 font-mono text-[10px] text-[#3a3a3a]">{cfg.path}</p>
                  </div>
                  <CopyButton text={cfg.config} />
                </div>
                <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
                  <code>{cfg.config}</code>
                </pre>
                {cfg.note && (
                  <div className="border-t border-[#0d0d0d] px-4 py-2.5">
                    <p className="text-xs text-[#444]">{cfg.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Step 3: Verify */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1a1a1a] font-mono text-xs text-[#444]">3</span>
            <h2 className="font-mono text-lg font-semibold">Verify it works</h2>
          </div>
          <p className="mb-5 text-sm text-[#666]">
            Ask your AI one of these prompts. If Conductor is connected, you&apos;ll see it call the corresponding tool in real-time.
          </p>
          <div className="space-y-2">
            {verifyPrompts.map((item) => (
              <div key={item.tool} className="flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#333]" />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm text-white">&ldquo;{item.prompt}&rdquo;</p>
                  <div className="mt-1 flex items-center gap-3">
                    <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-[10px] text-[#555]">
                      {item.tool}
                    </code>
                    <span className="text-xs text-[#444]">{item.what}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="mb-4 font-mono text-lg font-semibold">Troubleshooting</h2>
          <div className="space-y-3">
            {[
              {
                problem: "Tools don't appear in my AI client",
                fix: "Make sure you restarted the client after adding the config. For Claude Desktop, quit and reopen — not just reload.",
              },
              {
                problem: "\"command not found: conductor\"",
                fix: 'Use the npx form in your config instead: "command": "npx", "args": ["-y", "@useconductor/conductor"]. This works without a global install.',
              },
              {
                problem: "Shell commands are rejected",
                fix: "The shell plugin requires a command allowlist. Run: conductor config setup shell  to configure which commands are permitted.",
              },
              {
                problem: "Can't find the config file location",
                fix: "Run: conductor config path  — it prints the full path to your config directory on every platform.",
              },
            ].map((item) => (
              <div key={item.problem} className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <h3 className="font-mono text-sm font-semibold text-white">{item.problem}</h3>
                <p className="mt-1.5 text-sm text-[#666]">{item.fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What's next */}
        <section>
          <h2 className="mb-4 font-mono text-lg font-semibold">What to read next</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { title: "All plugins", desc: "What each plugin does, what tools it adds", href: "/docs/plugins" },
              { title: "Configuration", desc: "Config file reference and all options", href: "/docs/mcp-server" },
              { title: "Security", desc: "Allowlists, approval gates, audit logs", href: "/docs/security" },
              { title: "Writing plugins", desc: "Build your own tool in 5 minutes", href: "/docs/guides" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4 transition-colors hover:border-[#2a2a2a]"
              >
                <div className="flex-1">
                  <h3 className="font-mono text-sm font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-[#555]">{item.desc}</p>
                </div>
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a2a2a] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/plugins" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Next: Plugins reference
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
