import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const oneCommand = `claude mcp add conductor -- npx -y @useconductor/conductor`;
const globalInstall = `# Install globally first (optional — npx works without it)
npm install -g @useconductor/conductor

# Then register with Claude Code
claude mcp add conductor -- conductor mcp start`;

const verifyCmd = `# List all registered MCP servers
claude mcp list

# Should show:
# conductor    npx -y @useconductor/conductor    enabled`;

const removeCmd = `claude mcp remove conductor`;

const envInConfig = `# Pass environment variables to Conductor from Claude Code
claude mcp add conductor \\
  -e GITHUB_TOKEN=ghp_... \\
  -e SLACK_BOT_TOKEN=xoxb-... \\
  -- npx -y @useconductor/conductor`;

const projectScope = `# Add to current project only (creates .mcp.json in repo root)
claude mcp add conductor --scope project -- npx -y @useconductor/conductor

# Add globally for all projects (default)
claude mcp add conductor --scope global -- npx -y @useconductor/conductor

# Add for current user only
claude mcp add conductor --scope user -- npx -y @useconductor/conductor`;

const mcpJson = `// .mcp.json — committed to repo, shared with team
{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

const testPrompts = `# These prompts verify specific plugins are working:

"List the files in the current directory"
→ Uses filesystem.list

"What's the git status of this repo?"
→ Uses git.status

"Run: echo hello"
→ Uses shell.exec (will ask for approval first)

"Search for TODO comments in src/"
→ Uses filesystem.search`;

export default function ClaudeCodeIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations · AI Clients</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Claude Code</h1>
        <p className="mt-3 text-[#666]">
          One command. Conductor works with Claude Code out of the box — no config file editing, no JSON, no restart required.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Setup — one command</h2>
          <p className="mb-4 text-sm text-[#666]">
            Run this once in any terminal. Claude Code registers Conductor immediately — it's available in the current session and all future sessions.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={oneCommand} />
            </div>
            <pre className="p-4 font-mono text-sm text-[#aaa]"><code>{oneCommand}</code></pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            This uses <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">npx</code> — no global install needed. Conductor downloads and runs on first use.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Setup — with global install</h2>
          <p className="mb-4 text-sm text-[#666]">
            If you installed Conductor globally with npm, register the binary directly. Slightly faster startup since it skips npx resolution.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={globalInstall} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{globalInstall}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Verify it worked</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={verifyCmd} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{verifyCmd}</code></pre>
          </div>
          <p className="mt-4 text-sm text-[#666]">Or ask Claude Code directly:</p>
          <div className="mt-3 overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">test prompts</span>
              <CopyButton text={testPrompts} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{testPrompts}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Passing environment variables</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Plugin credentials (GitHub token, Slack token, etc.) can be passed directly through Claude Code&apos;s MCP config using <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">-e</code> flags. These are stored securely and passed to the Conductor process at startup.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">with env vars</span>
              <CopyButton text={envInConfig} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{envInConfig}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Scope — global vs project</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            By default, <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">claude mcp add</code> registers globally (all projects). Use <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">--scope project</code> to create a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">.mcp.json</code> file in the repo — commit it to share Conductor with your team.
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">scope options</span>
                <CopyButton text={projectScope} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{projectScope}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">.mcp.json — commit to repo</span>
                <CopyButton text={mcpJson} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{mcpJson}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Managing Conductor in Claude Code</h2>
          <div className="space-y-2">
            {[
              { cmd: "claude mcp list", desc: "Show all registered MCP servers and their status" },
              { cmd: "claude mcp add conductor -- npx -y @useconductor/conductor", desc: "Register Conductor (run once)" },
              { cmd: "claude mcp remove conductor", desc: "Unregister Conductor" },
              { cmd: "claude mcp get conductor", desc: "Show Conductor's full config" },
            ].map((r) => (
              <div key={r.cmd} className="flex items-start justify-between gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                <code className="shrink-0 font-mono text-xs text-white">{r.cmd}</code>
                <span className="text-right text-xs text-[#444]">{r.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Troubleshooting</h2>
          <div className="space-y-3">
            {[
              {
                problem: "Tools don't appear after running claude mcp add",
                fix: "Claude Code picks up MCP servers on next invocation — no restart needed. Just start a new conversation and ask Claude to list files.",
              },
              {
                problem: '"npx: command not found"',
                fix: "npx ships with Node.js. Install Node.js 18+ from nodejs.org, then try again.",
              },
              {
                problem: "Conductor starts but shows 0 tools",
                fix: "Run conductor doctor to check plugin status. A plugin config error can prevent tools from registering.",
              },
              {
                problem: "Shell commands always rejected",
                fix: "The shell plugin requires an allowlist. Run: conductor config setup shell — or add allowedCommands to ~/.conductor/config.json.",
              },
              {
                problem: "Works in one project, not another",
                fix: "You may have registered with --scope project. Run claude mcp add --scope global to make it available everywhere.",
              },
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
        <Link href="/docs/integrations" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> All integrations
        </Link>
        <Link href="/docs/integrations/claude-desktop" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Claude Desktop <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
