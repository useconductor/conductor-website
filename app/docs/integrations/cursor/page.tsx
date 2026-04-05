import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const cursorConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

const cursorConfigEnv = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token",
        "CONDUCTOR_LOG_LEVEL": "info"
      }
    }
  }
}`;

const projectConfig = `// .cursor/mcp.json — in repo root, shared with team
{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

export default function CursorIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations · AI Clients</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Cursor</h1>
        <p className="mt-3 text-[#666]">
          Add Conductor via Cursor&apos;s Settings panel or a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-sm">.cursor/mcp.json</code> file in your project.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Setup via Settings UI</h2>
          <div className="space-y-2">
            {[
              { step: "1", text: "Open Cursor. Go to Settings (⌘, or Ctrl+,)." },
              { step: "2", text: "Navigate to Features → MCP Servers." },
              { step: "3", text: "Click Add new MCP server." },
              { step: "4", text: 'Set name: conductor, type: command, command: npx -y @useconductor/conductor' },
              { step: "5", text: "Click Save. Cursor will start Conductor immediately — no restart needed." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                <span className="w-4 shrink-0 font-mono text-xs text-[#2a2a2a]">{s.step}</span>
                <span className="text-xs text-[#555]">{s.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Setup via config file</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Cursor reads MCP config from <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">~/.cursor/mcp.json</code> (global) or <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">.cursor/mcp.json</code> in the project root. Create or edit the global file:
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">~/.cursor/mcp.json</span>
                <CopyButton text={cursorConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{cursorConfig}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">.cursor/mcp.json — project-level, commit to repo</span>
                <CopyButton text={projectConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{projectConfig}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">With environment variables</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.cursor/mcp.json</span>
              <CopyButton text={cursorConfigEnv} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{cursorConfigEnv}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Enabling MCP in Cursor Agent</h2>
          <p className="mb-4 text-sm text-[#666]">
            MCP tools are available in Cursor&apos;s Agent mode (the chat panel). Make sure you&apos;re using Agent, not Chat — only Agent has tool use. In the chat panel, look for the agent toggle or <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">@conductor</code> mentions.
          </p>
          <div className="space-y-2">
            {[
              { label: "Mode required", val: "Agent (not Chat or Edit)" },
              { label: "Enable MCP", val: "Settings → Features → Enable MCP (should be on by default)" },
              { label: "See active tools", val: "In agent chat, click the tools icon to see all available MCP tools" },
            ].map((r) => (
              <div key={r.label} className="flex gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                <span className="w-32 shrink-0 font-mono text-[10px] text-[#444]">{r.label}</span>
                <span className="text-xs text-[#555]">{r.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Troubleshooting</h2>
          <div className="space-y-3">
            {[
              { problem: "Conductor not showing in MCP server list", fix: "Check the config file syntax (valid JSON). Cursor shows a red indicator next to servers that failed to start — hover it for the error." },
              { problem: "Server shows as started but no tools", fix: "Conductor may have crashed on startup. Check ~/.conductor/logs/error.log. Often a config validation error." },
              { problem: "npx hangs on first run", fix: "First run downloads the package — takes a few seconds. If it hangs more than 30s, check your npm registry connectivity: npm ping" },
              { problem: "Works globally but not in project", fix: "Project .cursor/mcp.json overrides the global config entirely. Make sure the project file has the conductor entry." },
              { problem: "Cursor uses an old Conductor version", fix: "npx -y always installs the latest. If you pinned a version, update it. Run: npx @useconductor/conductor --version to check." },
            ].map((t) => (
              <div key={t.problem} className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <p className="font-mono text-xs font-semibold text-white">{t.problem}</p>
                <p className="mt-1.5 text-xs text-[#555]">{t.fix}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8 flex items-center justify-between">
        <Link href="/docs/integrations/claude-desktop" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Claude Desktop
        </Link>
        <Link href="/docs/integrations/cline" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Cline / Roo Code <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
