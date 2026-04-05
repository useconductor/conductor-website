import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const clineConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

const clineConfigEnv = `{
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

export default function ClineIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations · AI Clients</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Cline / Roo Code</h1>
        <p className="mt-3 text-[#666]">
          Cline and Roo Code are VS Code extensions with a built-in MCP panel. Add Conductor from the sidebar — no config file editing required.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Setup via the MCP panel</h2>
          <div className="space-y-2">
            {[
              { step: "1", text: "Open VS Code. Install Cline (ext: saoudrizwan.claude-dev) or Roo Code (ext: RooVeterinaryInc.roo-cline) from the Extensions marketplace." },
              { step: "2", text: "Click the Cline/Roo Code icon in the Activity Bar (left sidebar)." },
              { step: "3", text: "In the panel, click the MCP Servers icon (looks like a plug)." },
              { step: "4", text: "Click Add Server. Paste the config JSON below." },
              { step: "5", text: "Click Save. Cline starts Conductor immediately." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                <span className="w-4 shrink-0 font-mono text-xs text-[#2a2a2a]">{s.step}</span>
                <span className="text-xs text-[#555]">{s.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Config to paste</h2>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">MCP server config</span>
                <CopyButton text={clineConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{clineConfig}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">with plugin credentials</span>
                <CopyButton text={clineConfigEnv} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{clineConfigEnv}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Config file location</h2>
          <p className="mb-3 text-sm text-[#666]">Cline and Roo Code store MCP config at:</p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead><tr className="border-b border-[#1a1a1a] bg-[#080808]">
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Platform</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Path</th>
              </tr></thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  ["macOS (Cline)", "~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"],
                  ["macOS (Roo Code)", "~/Library/Application Support/Code/User/globalStorage/RooVeterinaryInc.roo-cline/settings/cline_mcp_settings.json"],
                  ["Windows (Cline)", "%APPDATA%\\Code\\User\\globalStorage\\saoudrizwan.claude-dev\\settings\\cline_mcp_settings.json"],
                ].map(([p, path]) => (
                  <tr key={p}>
                    <td className="px-4 py-3 font-mono text-xs text-white whitespace-nowrap">{p}</td>
                    <td className="px-4 py-3"><code className="font-mono text-[10px] text-[#555] break-all">{path}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Roo Code vs Cline differences</h2>
          <div className="space-y-2">
            {[
              { label: "MCP support", val: "Both support MCP identically — same config format, same behavior." },
              { label: "Approval gates", val: "Both prompt you in the VS Code panel when Conductor requires approval for destructive ops." },
              { label: "Tool visibility", val: "Both show which MCP tools are being called in the conversation." },
              { label: "Config location", val: "Different extension IDs in the path — see table above. Otherwise identical." },
            ].map((r) => (
              <div key={r.label} className="flex gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                <span className="w-28 shrink-0 font-mono text-[10px] text-[#444]">{r.label}</span>
                <span className="text-xs text-[#555]">{r.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Troubleshooting</h2>
          <div className="space-y-3">
            {[
              { problem: "MCP icon not visible in panel", fix: "Make sure you're on Cline v2.0+ or Roo Code v1.0+. Earlier versions don't have the MCP panel. Update the extension." },
              { problem: "Server shows error state (red indicator)", fix: "Click the error indicator to see the full startup log. Most often: npx not found (PATH issue) or a JSON syntax error." },
              { problem: "Tools available but AI doesn't use them", fix: "Cline uses tools when the task clearly needs them. Try: 'Use the filesystem tool to list files in src/'. Explicit is better." },
              { problem: "PATH issues — npx not found", fix: "VS Code extensions inherit a limited PATH. Add the full path to npx in the command field, e.g. /usr/local/bin/npx" },
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
        <Link href="/docs/integrations/cursor" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Cursor
        </Link>
        <Link href="/docs/integrations/windsurf" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Windsurf <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
