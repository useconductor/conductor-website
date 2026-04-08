import Link from "next/link";

const releases = [
  {
    version: "2.0.0",
    date: "2025-04-01",
    tag: "Latest",
    summary: "100+ plugins, TypeScript SDK, HTTP transport overhaul, SHA-256 audit chain.",
    breaking: [
      "Config format changed — run `conductor config migrate` to upgrade ~/.conductor/config.json",
      "Plugin API v2: `handler(input, config)` replaces `handler(input, ctx)`. ctx.config moved to second arg.",
      "Audit log format updated — old logs readable but chain verification requires v2 entries",
    ],
    added: [
      "100+ built-in plugins across 8 categories",
      "TypeScript SDK: @useconductor/sdk",
      "HTTP transport with SSE event stream",
      "SHA-256 chained audit log with `conductor audit verify`",
      "Circuit breaker per-tool overrides in config",
      "Per-tool configSchema validation at startup",
      "Plugin onLoad / onUnload lifecycle hooks",
      "conductor plugins reload (hot reload without restart)",
      "Prometheus metrics at GET /metrics",
      "Bearer token auth for HTTP transport",
      "Docker image: ghcr.io/useconductor/conductor",
    ],
    fixed: [
      "Shell plugin no longer hangs on commands that produce no output",
      "Database plugin reconnects automatically after connection loss",
      "Audit log rotation no longer corrupts the chain",
    ],
  },
  {
    version: "1.5.2",
    date: "2025-02-14",
    tag: null,
    summary: "Patch release fixing Git plugin on Windows and database reconnection.",
    breaking: [],
    added: ["Git plugin: `git.stash`, `git.tag` tools added"],
    fixed: [
      "Git plugin: path separators on Windows now handled correctly",
      "Database plugin: connection pool exhaustion no longer crashes the process",
      "Config setup wizard no longer overwrites existing plugin configs",
    ],
  },
  {
    version: "1.5.0",
    date: "2025-01-28",
    tag: null,
    summary: "GitHub Actions plugin, webhook retry logic, and approval gate UI improvements.",
    breaking: [],
    added: [
      "New plugin: github-actions (trigger workflows, view runs, download artifacts)",
      "Webhook outgoing retries with exponential backoff (up to 5 attempts)",
      "Approval gate now shows tool name and input summary before prompting",
      "`conductor audit export` command for bulk export",
    ],
    fixed: [
      "Webhook HMAC signatures were computed on raw body but verified on parsed body — fixed",
      "Approval gate timeout (30s) now configurable via config.approvalTimeout",
    ],
  },
  {
    version: "1.4.0",
    date: "2025-01-10",
    tag: null,
    summary: "Notion, Linear, and Jira plugins. Filesystem glob patterns.",
    breaking: [],
    added: [
      "New plugin: notion (pages, databases, blocks, search)",
      "New plugin: linear (issues, cycles, projects)",
      "New plugin: jira (issues, transitions, sprints)",
      "Filesystem plugin: glob pattern support in filesystem.list",
      "Web fetch plugin: `format: 'markdown'` option for cleaner AI consumption",
    ],
    fixed: [
      "Filesystem plugin: reading binary files no longer returns garbled text",
      "Circuit breaker: HALF-OPEN state now correctly transitions on success",
    ],
  },
  {
    version: "1.3.0",
    date: "2024-12-18",
    tag: null,
    summary: "Docker plugin, encrypted local credential store for secrets.",
    breaking: [
      "Secrets in plaintext config.json are deprecated — migrate to `conductor secrets set`",
    ],
    added: [
      "New plugin: docker (containers, images, volumes, compose)",
      "Encrypted local credential store (AES-256-GCM) for secrets",
      "`conductor secrets set / get / delete` commands",
      "AES-256-GCM encryption for all stored secrets",
    ],
    fixed: [
      "Shell plugin: commands with spaces in arguments now handled correctly",
    ],
  },
  {
    version: "1.2.0",
    date: "2024-11-30",
    tag: null,
    summary: "Email (SMTP/IMAP), Slack, and Discord plugins.",
    breaking: [],
    added: [
      "New plugin: gmail (read, send, search, label)",
      "New plugin: slack (messages, channels, threads)",
      "New plugin: discord (messages, channels, roles)",
      "Plugin config hot-reload: changes to config.json take effect without restart",
    ],
    fixed: [
      "Memory leak in web.fetch when fetching large responses",
      "Git plugin: `git.push` now respects remote tracking branch",
    ],
  },
  {
    version: "1.1.0",
    date: "2024-11-10",
    tag: null,
    summary: "Custom plugin loading, approval gates, initial circuit breakers.",
    breaking: [],
    added: [
      "Custom plugin directory: drop .js files in ~/.conductor/plugins/",
      "Approval gates: requiresApproval: true halts execution for user confirmation",
      "Circuit breakers: configurable per-tool failure thresholds",
      "Audit log: SHA-256 chained append-only log",
      "`conductor audit list` command",
    ],
    fixed: [],
  },
  {
    version: "1.0.0",
    date: "2024-10-22",
    tag: null,
    summary: "Initial public release. Filesystem, shell, git, web fetch, and database plugins.",
    breaking: [],
    added: [
      "Core plugins: filesystem, shell, git, web.fetch, database",
      "stdio transport",
      "JSON Schema input validation",
      "Config file at ~/.conductor/config.json",
      "`conductor doctor` health check",
      "`conductor config setup` interactive wizard",
    ],
    fixed: [],
  },
];

export default function ChangelogPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Resources
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 text-[#666]">
          Every release, what changed, and what broke.
        </p>
      </div>

      <div className="space-y-10">
        {releases.map((r) => (
          <div key={r.version} className="border-t border-[#1a1a1a] pt-8 first:border-t-0 first:pt-0">
            <div className="mb-4 flex items-start gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-mono text-xl font-bold text-white">v{r.version}</h2>
                  {r.tag && (
                    <span className="rounded border border-[#1a1a1a] bg-[#0a0a0a] px-2 py-0.5 font-mono text-[10px] text-[#555]">
                      {r.tag}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-[10px] text-[#333]">{r.date}</p>
                <p className="mt-2 text-sm text-[#666]">{r.summary}</p>
              </div>
            </div>

            {r.breaking.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#555]">Breaking changes</p>
                <ul className="space-y-1.5">
                  {r.breaking.map((b) => (
                    <li key={b} className="flex items-start gap-3 rounded-md border border-[#1a1a1a] bg-[#080808] px-3 py-2.5">
                      <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#555]">!</span>
                      <span className="text-xs text-[#666]">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {r.added.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#333]">Added</p>
                <ul className="space-y-1">
                  {r.added.map((a) => (
                    <li key={a} className="flex items-start gap-3 px-1 py-1">
                      <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#2a2a2a]">+</span>
                      <span className="text-xs text-[#555]">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {r.fixed.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#333]">Fixed</p>
                <ul className="space-y-1">
                  {r.fixed.map((f) => (
                    <li key={f} className="flex items-start gap-3 px-1 py-1">
                      <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#2a2a2a]">~</span>
                      <span className="text-xs text-[#555]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link
          href="https://github.com/useconductor/conductor/releases"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#444] transition-colors hover:text-white"
        >
          Full release history on GitHub
          <span className="text-[#2a2a2a]">→</span>
        </Link>
      </div>
    </div>
  );
}
