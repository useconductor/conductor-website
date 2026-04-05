import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const aiderFlag = `aider --mcp-server "npx -y @useconductor/conductor"`;

const aiderConf = `## ~/.aider.conf.yml
mcp-server: "npx -y @useconductor/conductor"`;

const aiderEnv = `## ~/.aider.conf.yml
mcp-server: "npx -y @useconductor/conductor"
env:
  GITHUB_TOKEN: "ghp_your_token"
  CONDUCTOR_LOG_LEVEL: "info"`;

const aiderMulti = `## Multiple MCP servers
mcp-servers:
  - "npx -y @useconductor/conductor"
  - "npx -y @modelcontextprotocol/server-brave-search"`;

export default function AiderIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations · AI Clients</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Aider</h1>
        <p className="mt-3 text-[#666]">
          Aider supports MCP via a CLI flag or <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-sm">~/.aider.conf.yml</code>. Works in terminal — no IDE required.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Quick start — CLI flag</h2>
          <p className="mb-4 text-sm text-[#666]">Pass the MCP server as a flag when starting Aider:</p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={aiderFlag} />
            </div>
            <pre className="p-4 font-mono text-sm text-[#aaa]"><code>{aiderFlag}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Persistent config — .aider.conf.yml</h2>
          <p className="mb-4 text-sm text-[#666]">
            Add to <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">~/.aider.conf.yml</code> so Conductor starts every time:
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">~/.aider.conf.yml</span>
                <CopyButton text={aiderConf} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{aiderConf}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">with env vars</span>
                <CopyButton text={aiderEnv} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{aiderEnv}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">multiple MCP servers</span>
                <CopyButton text={aiderMulti} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{aiderMulti}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Aider version requirements</h2>
          <div className="space-y-2">
            {[
              { label: "MCP support added", val: "Aider v0.50.0+" },
              { label: "Check your version", val: "aider --version" },
              { label: "Update", val: "pip install --upgrade aider-chat" },
              { label: "Node.js required", val: "Node 18+ must be installed for npx to work" },
            ].map((r) => (
              <div key={r.label} className="flex gap-4 rounded border border-[#111] bg-[#070707] px-4 py-2.5">
                <span className="w-36 shrink-0 font-mono text-[10px] text-[#444]">{r.label}</span>
                <span className="text-xs text-[#555]">{r.val}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Troubleshooting</h2>
          <div className="space-y-3">
            {[
              { problem: '"Unknown option: --mcp-server"', fix: "Update Aider: pip install --upgrade aider-chat. MCP support was added in v0.50.0." },
              { problem: "MCP starts but Aider doesn't use tools", fix: "Aider uses MCP tools when the task clearly benefits from them. Be explicit: '/run list the files in src/' or reference a specific tool in your message." },
              { problem: "npx hangs at startup", fix: "First run downloads the package. If it hangs, check npm connectivity: npm ping. Or install globally first: npm install -g @useconductor/conductor." },
              { problem: "Conductor starts but shows no tools", fix: "Plugin config error at startup. Run conductor doctor in a separate terminal to check." },
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
        <Link href="/docs/integrations/continue" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Continue.dev
        </Link>
        <Link href="/docs/integrations/copilot" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          GitHub Copilot <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
