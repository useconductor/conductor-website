import Link from "next/link";
import { ArrowRight } from "lucide-react";

const aiClients = [
  { name: "Claude Code", slug: "claude-code", desc: "One command setup. The fastest path to Conductor.", tag: "Recommended" },
  { name: "Claude Desktop", slug: "claude-desktop", desc: "JSON config block. Works on Mac and Windows.", tag: null },
  { name: "Cursor", slug: "cursor", desc: "Settings → Features → MCP Servers.", tag: null },
  { name: "Cline / Roo Code", slug: "cline", desc: "VS Code extension. MCP panel in sidebar.", tag: null },
  { name: "Windsurf", slug: "windsurf", desc: "mcp_settings.json in Codeium config dir.", tag: null },
  { name: "Continue.dev", slug: "continue", desc: "~/.continue/config.json with array syntax.", tag: null },
  { name: "Aider", slug: "aider", desc: "CLI flags or .aider.conf.yml config file.", tag: null },
  { name: "GitHub Copilot", slug: "copilot", desc: "VS Code settings or .vscode/mcp.json.", tag: null },
];

const services = [
  {
    category: "Google",
    slug: "google",
    desc: "Gmail, Calendar, Drive, Sheets, Docs, GCP — OAuth setup, service accounts, scopes.",
    services: ["Gmail", "Calendar", "Drive", "Sheets", "Cloud"],
    tag: "Most setup steps",
  },
  {
    category: "GitHub",
    slug: "github",
    desc: "Personal tokens, OAuth apps, GitHub Apps, Actions integration, fine-grained permissions.",
    services: ["Issues", "PRs", "Actions", "Repos"],
    tag: null,
  },
  {
    category: "Slack",
    slug: "slack",
    desc: "Bot tokens, socket mode, event subscriptions, OAuth scopes, workspace install.",
    services: ["Messages", "Channels", "Threads"],
    tag: null,
  },
  {
    category: "Notion",
    slug: "notion",
    desc: "Internal integrations, OAuth, sharing pages with your integration, API keys.",
    services: ["Pages", "Databases", "Blocks"],
    tag: null,
  },
  {
    category: "Linear",
    slug: "linear",
    desc: "API keys, OAuth, team slugs, workspace permissions.",
    services: ["Issues", "Cycles", "Projects"],
    tag: null,
  },
  {
    category: "Jira / Atlassian",
    slug: "jira",
    desc: "API tokens, cloud vs server, project keys, Atlassian account ID.",
    services: ["Issues", "Projects", "Sprints"],
    tag: null,
  },
  {
    category: "AWS",
    slug: "aws",
    desc: "IAM users, access keys, roles, regions, S3/EC2/Lambda/RDS permissions.",
    services: ["S3", "EC2", "Lambda", "RDS"],
    tag: null,
  },
  {
    category: "Database",
    slug: "database",
    desc: "PostgreSQL, MySQL, SQLite — connection strings, SSL, pooling, read-only users.",
    services: ["PostgreSQL", "MySQL", "SQLite"],
    tag: null,
  },
  {
    category: "Discord",
    slug: "discord",
    desc: "Bot tokens, intents, guild IDs, channel permissions, slash commands.",
    services: ["Messages", "Channels", "Roles"],
    tag: null,
  },
  {
    category: "Vercel",
    slug: "vercel",
    desc: "Access tokens, team IDs, project IDs, deployment hooks.",
    services: ["Deployments", "Domains", "Env vars"],
    tag: null,
  },
  {
    category: "Stripe",
    slug: "stripe",
    desc: "API keys, webhooks, restricted keys, test vs live mode.",
    services: ["Payments", "Customers", "Webhooks"],
    tag: null,
  },
  {
    category: "Docker",
    slug: "docker",
    desc: "Docker Desktop, remote sockets, context setup, registry credentials.",
    services: ["Containers", "Images", "Compose"],
    tag: null,
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Connect everything
        </h1>
        <p className="mt-3 text-[#666]">
          Step-by-step setup for every AI client and every service plugin. Every auth flow,
          every permission, every common error — all covered.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#333]">
            AI Clients
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {aiClients.map((c) => (
              <Link
                key={c.slug}
                href={`/docs/integrations/${c.slug}`}
                className="group flex items-start justify-between gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4 transition-colors hover:border-[#2a2a2a]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-semibold text-white">{c.name}</h3>
                    {c.tag && (
                      <span className="rounded border border-[#1a1a1a] px-1.5 py-0.5 font-mono text-[9px] text-[#555]">
                        {c.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[#555]">{c.desc}</p>
                </div>
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a2a2a] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#333]">
            Service plugins
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/docs/integrations/${s.slug}`}
                className="group flex items-start justify-between gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4 transition-colors hover:border-[#2a2a2a]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-semibold text-white">{s.category}</h3>
                    {s.tag && (
                      <span className="rounded border border-[#1a1a1a] px-1.5 py-0.5 font-mono text-[9px] text-[#555]">
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[#555]">{s.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.services.map((sv) => (
                      <span key={sv} className="rounded bg-[#0d0d0d] px-1.5 py-0.5 font-mono text-[9px] text-[#333]">
                        {sv}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a2a2a] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
