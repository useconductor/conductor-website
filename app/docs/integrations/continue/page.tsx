import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const continueConfig = `// ~/.continue/config.json
// Note: mcpServers is an ARRAY in Continue, not an object
{
  "mcpServers": [
    {
      "name": "conductor",
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  ]
}`;

const continueEnvConfig = `{
  "mcpServers": [
    {
      "name": "conductor",
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token",
        "CONDUCTOR_LOG_LEVEL": "info"
      }
    }
  ]
}`;

export default function ContinueIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations · AI Clients</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Continue.dev</h1>
        <p className="mt-3 text-[#666]">
          Continue uses an <strong className="font-semibold text-white">array</strong> for <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-sm">mcpServers</code>, not an object. This is the most common mistake when copying configs from other clients.
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
                  ["macOS / Linux", "~/.continue/config.json"],
                  ["Windows", "%USERPROFILE%\\.continue\\config.json"],
                ].map(([p, path]) => (
                  <tr key={p}>
                    <td className="px-4 py-3 font-mono text-xs text-white">{p}</td>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-[#888]">{path}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            You can also open it from VS Code: Continue sidebar → gear icon → Open config.json.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Setup</h2>
          <div className="space-y-4">
            <div className="rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
              <p className="font-mono text-xs font-semibold text-white">Important: array syntax</p>
              <p className="mt-1 text-xs text-[#555]">
                Unlike Claude Desktop or Cursor, Continue uses an array <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">[]</code> for <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">mcpServers</code>, not an object <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">{"{}"}</code>. Each server entry also uses <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">name</code> instead of being keyed by name.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">~/.continue/config.json</span>
                <CopyButton text={continueConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{continueConfig}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">with plugin credentials</span>
                <CopyButton text={continueEnvConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{continueEnvConfig}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">After saving</h2>
          <div className="space-y-2">
            {[
              { step: "1", text: "Save config.json." },
              { step: "2", text: "Continue auto-reloads the config. If tools don't appear, run the Reload Window command (⌘⇧P → Developer: Reload Window)." },
              { step: "3", text: "In the Continue chat panel, type: 'list the files in this directory' — you should see filesystem.list called." },
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
              { problem: '"mcpServers must be an array"', fix: "You used object syntax {} instead of array syntax []. Wrap the server entry in square brackets as shown above." },
              { problem: "MCP not loading after config save", fix: "Try: VS Code Command Palette → Continue: Open Logs — look for MCP startup errors. Then try Reload Window." },
              { problem: "Tools visible in settings but not used", fix: "Continue's MCP tool use depends on the model's capabilities. Use a model with tool-calling support (Claude, GPT-4o). Older models may not trigger MCP." },
              { problem: "npx PATH issues in VS Code", fix: "Use the full absolute path to npx. Run which npx in a terminal to find it, then use that path as the command value." },
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
        <Link href="/docs/integrations/windsurf" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Windsurf
        </Link>
        <Link href="/docs/integrations/aider" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Aider <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
