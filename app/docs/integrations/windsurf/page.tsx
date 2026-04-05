import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const windsurfConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

const windsurfEnvConfig = `{
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

export default function WindsurfIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations · AI Clients</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Windsurf</h1>
        <p className="mt-3 text-[#666]">
          Windsurf by Codeium uses a dedicated MCP settings file in the Codeium config directory. Edit the file, reload Windsurf.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Config file location</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead><tr className="border-b border-[#1a1a1a] bg-[#080808]">
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Platform</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Path</th>
              </tr></thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  ["macOS", "~/.codeium/windsurf/mcp_settings.json"],
                  ["Windows", "%USERPROFILE%\\.codeium\\windsurf\\mcp_settings.json"],
                  ["Linux", "~/.codeium/windsurf/mcp_settings.json"],
                ].map(([p, path]) => (
                  <tr key={p}>
                    <td className="px-4 py-3 font-mono text-xs text-white">{p}</td>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-[#888]">{path}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Setup</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              {[
                { step: "1", text: "Create or open ~/.codeium/windsurf/mcp_settings.json" },
                { step: "2", text: "Paste the config block below (merge with existing content if the file already exists)." },
                { step: "3", text: "Save the file." },
                { step: "4", text: "In Windsurf: open the Command Palette (⌘⇧P or Ctrl+Shift+P) and run Windsurf: Reload MCP Servers. Or fully restart Windsurf." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                  <span className="w-4 shrink-0 font-mono text-xs text-[#2a2a2a]">{s.step}</span>
                  <span className="text-xs text-[#555]">{s.text}</span>
                </div>
              ))}
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">~/.codeium/windsurf/mcp_settings.json</span>
                <CopyButton text={windsurfConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{windsurfConfig}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">With plugin credentials</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">with env vars</span>
              <CopyButton text={windsurfEnvConfig} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{windsurfEnvConfig}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Using Conductor in Windsurf</h2>
          <p className="mb-4 text-sm text-[#666]">
            MCP tools are available in Windsurf&apos;s Cascade agent. Open the Cascade panel and start a conversation — Conductor tools appear automatically when the task needs them. You can also explicitly reference tools:
          </p>
          <div className="space-y-2">
            {[
              '"List the files in this project" → filesystem.list',
              '"What changed since last commit?" → git.diff',
              '"Search for all TODO comments" → filesystem.search',
              '"Run npm test" → shell.exec (approval required)',
            ].map((p) => (
              <div key={p} className="rounded border border-[#111] bg-[#070707] px-4 py-2.5 font-mono text-xs text-[#555]">
                {p}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Troubleshooting</h2>
          <div className="space-y-3">
            {[
              { problem: "MCP servers not loading after config edit", fix: "Use Command Palette → Windsurf: Reload MCP Servers instead of just reopening a file. If that fails, fully quit and restart Windsurf." },
              { problem: "Config directory doesn't exist", fix: "Create it manually: mkdir -p ~/.codeium/windsurf then create mcp_settings.json there." },
              { problem: "npx not found", fix: "Windsurf inherits a limited shell PATH. Use the full path to npx: run which npx in a terminal and paste the absolute path as the command value." },
              { problem: "Conductor starts but Cascade doesn't call tools", fix: "Cascade uses tools when needed. Try phrasing requests as actions: 'Read package.json' not 'Can you see package.json?'" },
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
        <Link href="/docs/integrations/cline" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Cline
        </Link>
        <Link href="/docs/integrations/continue" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Continue.dev <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
