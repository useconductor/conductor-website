import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Star, ExternalLink } from "lucide-react";

type Plugin = {
  name: string;
  description: string;
  longDescription?: string;
  icon: string;
  category: string;
  downloads: string;
  rating: number;
  official: boolean;
  installCmd: string;
  setupCmd?: string;
  tools: string[];
  credentials?: { name: string; required: boolean }[];
};

const PLUGINS: Record<string, Plugin> = {
  airtable: {
    name: "Airtable",
    description: "Read and write Airtable bases, tables, and records.",
    longDescription: "Query and manage Airtable bases from your AI. List records with filters, create new rows, update existing records, and manage table structure.",
    icon: "📊",
    category: "productivity",
    downloads: "12k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install airtable",
    setupCmd: "conductor plugins setup airtable",
    tools: ["airtable_records", "airtable_record", "airtable_create", "airtable_update", "airtable_delete", "airtable_bases"],
    credentials: [{ name: "AIRTABLE_TOKEN", required: true }],
  },
  asana: {
    name: "Asana",
    description: "Manage Asana tasks, projects, and workspaces.",
    longDescription: "Connect to Asana and manage tasks, projects, and workspaces. Create tasks, update assignments, and track progress.",
    icon: "✅",
    category: "productivity",
    downloads: "9k",
    rating: 4.5,
    official: true,
    installCmd: "conductor plugins install asana",
    setupCmd: "conductor plugins setup asana",
    tools: ["asana_tasks", "asana_task", "asana_create_task", "asana_update_task", "asana_projects"],
    credentials: [{ name: "ASANA_TOKEN", required: true }],
  },
  anthropic: {
    name: "Anthropic",
    description: "Call Claude models directly from your AI agent.",
    icon: "🤖",
    category: "ai",
    downloads: "18k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins install anthropic",
    tools: ["anthropic_complete"],
    credentials: [{ name: "ANTHROPIC_API_KEY", required: true }],
  },
  discord: {
    name: "Discord",
    description: "Send messages, read channels, and manage Discord servers.",
    longDescription: "Connect your AI to a Discord server via a bot token. Send messages to channels, read recent message history, manage roles.",
    icon: "💬",
    category: "communication",
    downloads: "14k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install discord",
    setupCmd: "conductor plugins setup discord",
    tools: ["discord_send", "discord_read", "discord_channels", "discord_members", "discord_roles"],
    credentials: [{ name: "DISCORD_TOKEN", required: true }],
  },
  github: {
    name: "GitHub",
    description: "Issues, PRs, code search, releases, and repo management.",
    longDescription: "Full GitHub access from your AI. Manage issues, pull requests, search code, and handle releases. Public data works without auth.",
    icon: "🐙",
    category: "developer",
    downloads: "22k",
    rating: 4.9,
    official: true,
    installCmd: "conductor plugins install github",
    setupCmd: "conductor plugins setup github",
    tools: ["github_user", "github_repo", "github_repos", "github_issues", "github_create_issue", "github_prs", "github_create_pr", "github_search_code", "github_search_repos", "github_releases"],
    credentials: [{ name: "GITHUB_TOKEN", required: false }],
  },
  gmail: {
    name: "Gmail",
    description: "Read, send, search, label, and archive emails.",
    longDescription: "Full Gmail access via Google API. Read inbox, send emails, search messages, manage labels, and archive.",
    icon: "📧",
    category: "communication",
    downloads: "16k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins install gmail",
    setupCmd: "conductor plugins setup gmail",
    tools: ["gmail_list", "gmail_send", "gmail_search", "gmail_labels", "gmail_archive", "gmail_trash"],
    credentials: [{ name: "GOOGLE_OAUTH", required: true }],
  },
  jira: {
    name: "Jira",
    description: "Issues, projects, sprints, and transitions.",
    longDescription: "Connect to Atlassian Jira. Manage issues, update status, track sprints, and handle project workflows.",
    icon: "📋",
    category: "productivity",
    downloads: "8k",
    rating: 4.4,
    official: true,
    installCmd: "conductor plugins install jira",
    setupCmd: "conductor plugins setup jira",
    tools: ["jira_issues", "jira_issue", "jira_create_issue", "jira_transition", "jira_sprints"],
    credentials: [{ name: "JIRA_TOKEN", required: true }],
  },
  linear: {
    name: "Linear",
    description: "Issues, cycles, projects, and team management.",
    longDescription: "Linear is the issue tracking platform for modern teams. Manage issues, cycles, and projects directly from your AI.",
    icon: "📈",
    category: "productivity",
    downloads: "11k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins install linear",
    setupCmd: "conductor plugins setup linear",
    tools: ["linear_issues", "linear_issue", "linear_create_issue", "linear_cycles", "linear_projects"],
    credentials: [{ name: "LINEAR_API_KEY", required: true }],
  },
  notion: {
    name: "Notion",
    description: "Pages, databases, blocks, and full-text search.",
    longDescription: "Read and write Notion pages and databases. Create pages, append blocks, query databases with filters.",
    icon: "📝",
    category: "productivity",
    downloads: "15k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins install notion",
    setupCmd: "conductor plugins setup notion",
    tools: ["notion_search", "notion_page", "notion_create_page", "notion_append", "notion_database_query"],
    credentials: [{ name: "NOTION_TOKEN", required: true }],
  },
  slack: {
    name: "Slack",
    description: "Send messages, read channels, manage threads.",
    longDescription: "Connect your AI to Slack. Send messages to channels, read history, manage threads, and add reactions.",
    icon: "💼",
    category: "communication",
    downloads: "17k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins install slack",
    setupCmd: "conductor plugins setup slack",
    tools: ["slack_send", "slack_read", "slack_channels", "slack_users", "slack_thread", "slack_react"],
    credentials: [{ name: "SLACK_BOT_TOKEN", required: true }],
  },
  stripe: {
    name: "Stripe",
    description: "Payments, customers, subscriptions, and refunds.",
    longDescription: "Manage Stripe payments, customers, subscriptions, and refunds. Query transactions and handle webhooks.",
    icon: "💳",
    category: "commerce",
    downloads: "10k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install stripe",
    setupCmd: "conductor plugins setup stripe",
    tools: ["stripe_customers", "stripe_payments", "stripe_subscriptions", "stripe_refunds", "stripe_balance"],
    credentials: [{ name: "STRIPE_KEY", required: true }],
  },
  vercel: {
    name: "Vercel",
    description: "Deployments, domains, environment variables.",
    longDescription: "Manage Vercel projects. List deployments, check build logs, manage domains and environment variables.",
    icon: "▲",
    category: "developer",
    downloads: "13k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins install vercel",
    setupCmd: "conductor plugins setup vercel",
    tools: ["vercel_projects", "vercel_deployments", "vercel_deployment", "vercel_logs", "vercel_env", "vercel_domains"],
    credentials: [{ name: "VERCEL_TOKEN", required: true }],
  },
};

export default async function MarketplacePluginPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plugin = PLUGINS[id];

  if (!plugin) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-24">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/marketplace"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#666] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="mb-8 flex items-start gap-4">
          <span className="text-4xl">{plugin.icon}</span>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-3xl font-bold">{plugin.name}</h1>
              {plugin.official && (
                <span className="rounded border border-[#1a1a1a] bg-[#111] px-2 py-0.5 font-mono text-[10px] text-[#555]">
                  official
                </span>
              )}
            </div>
            <p className="mt-2 text-[#666]">{plugin.description}</p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-6 text-sm text-[#555]">
          <span className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {plugin.downloads} downloads
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {plugin.rating} rating
          </span>
          <span className="rounded bg-[#111] px-2 py-0.5 font-mono text-xs">{plugin.category}</span>
        </div>

        <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-6 mb-8">
          <h2 className="mb-4 font-mono text-lg font-semibold">Install</h2>
          <code className="block rounded bg-[#0d0d0d] p-3 font-mono text-sm text-[#888]">
            {plugin.installCmd}
          </code>
          {plugin.setupCmd && (
            <>
              <h2 className="mt-6 mb-4 font-mono text-lg font-semibold">Setup</h2>
              <code className="block rounded bg-[#0d0d0d] p-3 font-mono text-sm text-[#888]">
                {plugin.setupCmd}
              </code>
            </>
          )}
        </div>

        {plugin.longDescription && (
          <div className="mb-8">
            <h2 className="mb-4 font-mono text-lg font-semibold">About</h2>
            <p className="text-[#666]">{plugin.longDescription}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-4 font-mono text-lg font-semibold">Tools ({plugin.tools.length})</h2>
          <div className="flex flex-wrap gap-2">
            {plugin.tools.map((tool) => (
              <span
                key={tool}
                className="rounded border border-[#1a1a1a] bg-[#050505] px-3 py-1.5 font-mono text-xs text-[#666]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {plugin.credentials && plugin.credentials.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-mono text-lg font-semibold">Credentials</h2>
            <div className="space-y-2">
              {plugin.credentials.map((cred) => (
                <div key={cred.name} className="flex items-center gap-2">
                  <span className="font-mono text-sm text-white">{cred.name}</span>
                  {cred.required && (
                    <span className="rounded bg-[#1a1010] px-2 py-0.5 font-mono text-[10px] text-[#664444]">required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            href="/docs/plugins"
            className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-white"
          >
            View documentation
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}