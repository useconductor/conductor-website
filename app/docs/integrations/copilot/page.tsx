import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const vscodeMcpJson = `// .vscode/mcp.json — workspace-level, commit to repo
{
  "servers": {
    "conductor": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

const vscodeSettings = `// .vscode/settings.json — alternative approach
{
  "github.copilot.chat.mcp.enabled": true
}`;

const vscodeEnvMcp = `// .vscode/mcp.json with env vars
{
  "servers": {
    "conductor": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token",
        "CONDUCTOR_LOG_LEVEL": "info"
      }
    }
  }
}`;

const userMcp = `// User-level MCP config — VS Code user settings
// Open: File → Preferences → Settings → search "mcp"
// Or edit settings.json directly:
{
  "mcp": {
    "servers": {
      "conductor": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@useconductor/conductor"]
      }
    }
  }
}`;

export default function CopilotIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations · AI Clients</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">GitHub Copilot</h1>
        <p className="mt-3 text-[#666]">
          GitHub Copilot in VS Code supports MCP via <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-sm">.vscode/mcp.json</code> or VS Code user settings. Requires Copilot Chat extension and agent mode.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Requirements</h2>
          <div className="space-y-2">
            {[
              { label: "VS Code version", val: "1.99+ (MCP support added April 2025)" },
              { label: "Extension", val: "GitHub Copilot Chat (ms-vscode.copilot-chat)" },
              { label: "Mode", val: "Agent mode — MCP only works in Agent, not inline or Ask." },
              { label: "Node.js", val: "18+ required for npx" },
            ].map((r) => (
              <div key={r.label} className="flex gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                <span className="w-32 shrink-0 font-mono text-[10px] text-[#444]">{r.label}</span>
                <span className="text-xs text-[#555]">{r.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Workspace setup (.vscode/mcp.json)</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Create <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">.vscode/mcp.json</code> in your project root. Note: Copilot uses <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">servers</code> (not <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">mcpServers</code>) and each server has a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">type</code> field.
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">.vscode/mcp.json</span>
                <CopyButton text={vscodeMcpJson} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{vscodeMcpJson}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">with env vars</span>
                <CopyButton text={vscodeEnvMcp} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{vscodeEnvMcp}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">User-level setup</h2>
          <p className="mb-4 text-sm text-[#666]">
            To enable Conductor across all workspaces, add it to VS Code user settings:
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">VS Code user settings.json</span>
              <CopyButton text={userMcp} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{userMcp}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Using Conductor with Copilot Agent</h2>
          <div className="space-y-2">
            {[
              { step: "1", text: "Open Copilot Chat (⌃⌘I or View → Copilot Chat)." },
              { step: "2", text: "Switch to Agent mode — click the mode selector at the top of the chat panel and choose Agent." },
              { step: "3", text: "Type a prompt that needs a tool. Copilot will show which MCP tools it's considering and ask for confirmation." },
              { step: "4", text: "Approve the tool call. Conductor executes it and returns the result to Copilot." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                <span className="w-4 shrink-0 font-mono text-xs text-[#2a2a2a]">{s.step}</span>
                <span className="text-xs text-[#555]">{s.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Troubleshooting</h2>
          <div className="space-y-3">
            {[
              { problem: "MCP.json not recognized / no tools", fix: "Confirm VS Code is 1.99+. Check View → Output → GitHub Copilot for MCP errors. The .vscode/mcp.json file must be in the workspace root, not a subdirectory." },
              { problem: "Tools only available in Agent, not Chat", fix: "That's by design. MCP tools are only available in Agent mode. Switch using the mode dropdown in the Copilot Chat panel." },
              { problem: '"servers" key vs "mcpServers"', fix: "Copilot uses 'servers' (not 'mcpServers'). Using the wrong key means Conductor is silently ignored. Double-check the key name." },
              { problem: "type field required", fix: "Copilot requires each server entry to have type: 'stdio' or type: 'sse'. This field is optional or absent in other clients but required here." },
              { problem: "Approval prompt not appearing", fix: "VS Code may auto-approve some tools. Check Settings → GitHub Copilot → MCP → Auto Approve to see and configure the behavior." },
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
        <Link href="/docs/integrations/aider" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Aider
        </Link>
        <Link href="/docs/integrations" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          All integrations <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
