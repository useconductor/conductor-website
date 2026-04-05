import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const macConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

const macGlobalConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "conductor",
      "args": ["mcp", "start"]
    }
  }
}`;

const macEnvConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here",
        "SLACK_BOT_TOKEN": "xoxb_your_token_here",
        "CONDUCTOR_LOG_LEVEL": "info"
      }
    }
  }
}`;

const windowsConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@useconductor/conductor"]
    }
  }
}`;

const windowsGlobalConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "C:\\\\Users\\\\YourName\\\\AppData\\\\Roaming\\\\npm\\\\conductor.cmd",
      "args": ["mcp", "start"]
    }
  }
}`;

export default function ClaudeDesktopIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations · AI Clients</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Claude Desktop</h1>
        <p className="mt-3 text-[#666]">
          Add one JSON block to Claude Desktop&apos;s config file. Requires a full quit and reopen — not just a window refresh.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Config file location</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Platform</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-white">macOS</td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-[#888]">~/Library/Application Support/Claude/claude_desktop_config.json</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-white">Windows</td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-[#888]">%APPDATA%\Claude\claude_desktop_config.json</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            If the file doesn&apos;t exist, create it. If it exists, merge the <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">mcpServers</code> block into the existing JSON — don&apos;t overwrite other settings.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">macOS setup</h2>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">~/Library/Application Support/Claude/claude_desktop_config.json</span>
                <CopyButton text={macConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{macConfig}</code></pre>
            </div>
            <p className="text-xs text-[#555]">If you installed Conductor globally (<code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">npm install -g @useconductor/conductor</code>), you can use the binary directly:</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">with global install</span>
                <CopyButton text={macGlobalConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{macGlobalConfig}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Windows setup</h2>
          <p className="mb-4 text-sm text-[#666]">
            On Windows, wrap the command in <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">cmd /c</code> to ensure the PATH is resolved correctly.
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">%APPDATA%\Claude\claude_desktop_config.json</span>
                <CopyButton text={windowsConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{windowsConfig}</code></pre>
            </div>
            <p className="text-xs text-[#555]">With global install on Windows, use the full path to the .cmd file:</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">Windows — global install</span>
                <CopyButton text={windowsGlobalConfig} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{windowsGlobalConfig}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Passing plugin credentials</h2>
          <p className="mb-4 text-sm text-[#666]">
            Add an <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">env</code> object to pass credentials to Conductor without putting them in <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">~/.conductor/config.json</code>.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">with env vars</span>
              <CopyButton text={macEnvConfig} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{macEnvConfig}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">After saving the config</h2>
          <div className="space-y-2">
            {[
              { step: "1", text: "Save the config file." },
              { step: "2", text: "Completely quit Claude Desktop — File → Quit (macOS) or the system tray icon → Quit (Windows). Do not just close the window." },
              { step: "3", text: "Reopen Claude Desktop." },
              { step: "4", text: "Start a new conversation. Ask: \"list the files in my current directory\" — you should see Conductor call filesystem.list." },
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
              { problem: "No tools appear after restart", fix: "Open the MCP settings panel in Claude Desktop (Settings → MCP) to check if Conductor started. Look for startup errors there." },
              { problem: "JSON syntax error warning", fix: "Validate your config at jsonlint.com. A single misplaced comma or missing brace breaks the whole file." },
              { problem: 'macOS: "npx not found"', fix: "Claude Desktop launches with a minimal PATH that may not include npm. Use the full path: /usr/local/bin/npx or /opt/homebrew/bin/npx — find it with: which npx" },
              { problem: 'Windows: "The system cannot find the path specified"', fix: "Use cmd /c npx as shown above. Or use the full path to node.exe: C:\\Program Files\\nodejs\\npx.cmd" },
              { problem: "Tools appear but then disappear", fix: "Conductor crashed at startup. Check ~/.conductor/logs/error.log. Usually a missing dependency or config error." },
              { problem: "Some tools work, some don't", fix: "Plugin-level issue. Run conductor plugins list to see which plugins loaded. Use conductor doctor for a health check." },
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
        <Link href="/docs/integrations/claude-code" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Claude Code
        </Link>
        <Link href="/docs/integrations/cursor" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Cursor <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
