import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Download, Star, ExternalLink, 
  LayoutGrid, CheckSquare, MessageSquare, Mail,
  GitBranch, CreditCard, Settings, Zap, Cloud,
  Database, Code2, Terminal, FileText, Box,
  Users, Calendar, ShoppingCart, Link2
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type PluginData = {
  name: string;
  description: string;
  longDescription: string;
  icon: React.ElementType;
  category: string;
  downloads: string;
  rating: number;
  official: boolean;
  installCmd: string;
  setupCmd?: string;
  tools: string[];
  credentials?: { name: string; required: boolean; description: string }[];
  features: string[];
  useCases: string[];
  pricing: string;
  rateLimit: string;
  auth: string;
  platform: string;
  docsUrl?: string;
  websiteUrl?: string;
};

const PLUGINS: Record<string, PluginData> = {
  airtable: {
    name: "Airtable",
    description: "Read and write Airtable bases, tables, and records.",
    longDescription: "Connect your AI to Airtable to query databases, manage records, and automate spreadsheet workflows. Perfect for CRM, project tracking, and inventory management.",
    icon: LayoutGrid,
    category: "Productivity",
    downloads: "12k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install airtable",
    setupCmd: "conductor plugins setup airtable",
    tools: ["airtable_records", "airtable_record", "airtable_create", "airtable_update", "airtable_delete", "airtable_bases"],
    credentials: [
      { name: "AIRTABLE_TOKEN", required: true, description: "Airtable Personal Access Token with read/write scopes" }
    ],
    features: [
      "List and query records with filters",
      "Create, update, and delete records",
      "List all accessible bases",
      "Sort and paginate results"
    ],
    useCases: [
      "Track sales leads and customer data",
      "Manage project tasks and deadlines",
      "Inventory tracking and management",
      "Event planning and registration"
    ],
    pricing: "Free tier available, paid plans from $10/user/month",
    rateLimit: "5 requests/second",
    auth: "API Token",
    platform: "Cloud (Airtable hosted)",
  },
  asana: {
    name: "Asana",
    description: "Manage Asana tasks, projects, and workspaces.",
    longDescription: "Integrate with Asana to manage tasks, projects, and team workflows. Create tasks, update assignments, and track progress directly from your AI.",
    icon: CheckSquare,
    category: "Productivity",
    downloads: "9k",
    rating: 4.5,
    official: true,
    installCmd: "conductor plugins install asana",
    setupCmd: "conductor plugins setup asana",
    tools: ["asana_tasks", "asana_task", "asana_create_task", "asana_update_task", "asana_projects"],
    credentials: [
      { name: "ASANA_TOKEN", required: true, description: "Asana Personal Access Token" }
    ],
    features: [
      "List tasks in projects",
      "Create and update tasks",
      "List projects and workspaces",
      "Assign tasks to team members"
    ],
    useCases: [
      "Automated task creation from emails",
      "Daily standup summaries",
      "Project progress reporting",
      "Sprint planning assistance"
    ],
    pricing: "Free for teams up to 15 members",
    rateLimit: "100 requests/minute",
    auth: "API Token",
    platform: "Cloud (Asana hosted)",
  },
  anthropic: {
    name: "Anthropic",
    description: "Call Claude models directly from your AI agent.",
    longDescription: "Access Claude models (Claude 3.5, Claude 3, etc.) directly through Conductor. Enables advanced reasoning and code generation capabilities.",
    icon: Zap,
    category: "AI",
    downloads: "18k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins install anthropic",
    setupCmd: "conductor plugins setup anthropic",
    tools: ["anthropic_complete"],
    credentials: [
      { name: "ANTHROPIC_API_KEY", required: true, description: "Anthropic API key from console.anthropic.com" }
    ],
    features: [
      "Claude 3.5 Sonnet, Haiku, Opus models",
      "Vision support for images",
      "Tool use and function calling",
      "Token usage tracking"
    ],
    useCases: [
      "Advanced code generation",
      "Complex reasoning tasks",
      "Document analysis and summarization",
      "Multi-step problem solving"
    ],
    pricing: "Pay per million tokens (~$3-15/million)",
    rateLimit: "50 requests/minute (varies by plan)",
    auth: "API Key",
    platform: "Cloud (Anthropic hosted)",
    docsUrl: "https://docs.anthropic.com",
  },
  discord: {
    name: "Discord",
    description: "Send messages, read channels, and manage Discord servers.",
    longDescription: "Connect your AI to Discord to send messages, read channel history, manage roles, and automate server operations. Great for community management and alerts.",
    icon: MessageSquare,
    category: "Communication",
    downloads: "14k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install discord",
    setupCmd: "conductor plugins setup discord",
    tools: ["discord_send", "discord_read", "discord_channels", "discord_members", "discord_roles"],
    credentials: [
      { name: "DISCORD_TOKEN", required: true, description: "Discord Bot Token from developer portal" }
    ],
    features: [
      "Send messages to channels",
      "Read recent message history",
      "List channels and members",
      "Manage roles"
    ],
    useCases: [
      "Deploy notifications to #dev channel",
      "Community welcome messages",
      "Incident alert automation",
      "Team activity summaries"
    ],
    pricing: "Free for small servers, paid plans for large communities",
    rateLimit: "10 requests/second",
    auth: "Bot Token",
    platform: "Cloud (Discord hosted)",
    docsUrl: "https://discord.com/developers/docs",
  },
  github: {
    name: "GitHub",
    description: "Issues, PRs, code search, releases, and repo management.",
    longDescription: "Full GitHub integration for managing repositories, issues, pull requests, and releases. Public data works without authentication; private repos need a token.",
    icon: GitBranch,
    category: "Developer",
    downloads: "22k",
    rating: 4.9,
    official: true,
    installCmd: "conductor plugins install github",
    setupCmd: "conductor plugins setup github",
    tools: ["github_user", "github_repo", "github_repos", "github_issues", "github_create_issue", "github_prs", "github_create_pr", "github_search_code", "github_search_repos", "github_releases"],
    credentials: [
      { name: "GITHUB_TOKEN", required: false, description: "Personal Access Token with repo scope for private repos" }
    ],
    features: [
      "List and search repositories",
      "Manage issues and PRs",
      "Code search across repos",
      "Create releases and tags"
    ],
    useCases: [
      "Automated code review summaries",
      "Issue triage and management",
      "Release note generation",
      "Repository health checks"
    ],
    pricing: "Free for public repos, paid for private ($4/month)",
    rateLimit: "5,000 requests/hour",
    auth: "Personal Access Token",
    platform: "Cloud (GitHub hosted)",
    docsUrl: "https://docs.github.com",
    websiteUrl: "https://github.com",
  },
  gmail: {
    name: "Gmail",
    description: "Read, send, search, label, and archive emails.",
    longDescription: "Full Gmail access via Google OAuth. Read your inbox, send emails, search with Gmail syntax, manage labels, and archive messages. Your credentials never leave your machine.",
    icon: Mail,
    category: "Communication",
    downloads: "16k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins install gmail",
    setupCmd: "conductor plugins setup gmail",
    tools: ["gmail_list", "gmail_send", "gmail_search", "gmail_labels", "gmail_archive", "gmail_trash"],
    credentials: [
      { name: "GOOGLE_OAUTH", required: true, description: "Google OAuth 2.0 credentials with Gmail scopes" }
    ],
    features: [
      "List and read emails",
      "Send new emails",
      "Search with Gmail syntax",
      "Manage labels and archiving"
    ],
    useCases: [
      "Email summarization for meetings",
      "Automated follow-up reminders",
      "Support ticket routing",
      "Daily digest generation"
    ],
    pricing: "Free (15GB) or $2/month for 100GB",
    rateLimit: "Gmail API limits apply",
    auth: "OAuth 2.0",
    platform: "Cloud (Google hosted)",
    docsUrl: "https://developers.google.com/gmail/api",
    websiteUrl: "https://gmail.com",
  },
  jira: {
    name: "Jira",
    description: "Issues, projects, sprints, and transitions.",
    longDescription: "Connect to Atlassian Jira for enterprise issue tracking. Manage issues, update status, track sprints, and handle project workflows.",
    icon: Settings,
    category: "Productivity",
    downloads: "8k",
    rating: 4.4,
    official: true,
    installCmd: "conductor plugins install jira",
    setupCmd: "conductor plugins setup jira",
    tools: ["jira_issues", "jira_issue", "jira_create_issue", "jira_transition", "jira_sprints"],
    credentials: [
      { name: "JIRA_TOKEN", required: true, description: "Jira API token and instance URL" }
    ],
    features: [
      "List and search issues",
      "Create and update issues",
      "Transition issue status",
      "Track sprints"
    ],
    useCases: [
      "Sprint velocity reporting",
      "Issue creation from Slack",
      "Status update notifications",
      "Release ticket tracking"
    ],
    pricing: "Free for up to 10 users, paid from $7.50/user/month",
    rateLimit: "10 requests/second",
    auth: "API Token + Instance URL",
    platform: "Cloud or Self-hosted (Atlassian)",
    docsUrl: "https://developer.atlassian.com/cloud/jira/platform",
    websiteUrl: "https://atlassian.com/software/jira",
  },
  linear: {
    name: "Linear",
    description: "Issues, cycles, projects, and team management.",
    longDescription: "Linear is the modern issue tracking platform. Connect your AI to manage issues, cycles, and projects with a sleek API.",
    icon: CheckSquare,
    category: "Productivity",
    downloads: "11k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins install linear",
    setupCmd: "conductor plugins setup linear",
    tools: ["linear_issues", "linear_issue", "linear_create_issue", "linear_cycles", "linear_projects"],
    credentials: [
      { name: "LINEAR_API_KEY", required: true, description: "Linear API key from workspace settings" }
    ],
    features: [
      "List and create issues",
      "Manage cycles",
      "Track projects",
      "Assign team members"
    ],
    useCases: [
      "Quick issue creation from chat",
      "Cycle summary reports",
      "Sprint planning automation",
      "Team capacity planning"
    ],
    pricing: "Free for small teams, paid from $8/user/month",
    rateLimit: "100 requests/minute",
    auth: "API Key",
    platform: "Cloud (Linear hosted)",
    docsUrl: "https://developers.linear.app",
    websiteUrl: "https://linear.app",
  },
  notion: {
    name: "Notion",
    description: "Pages, databases, blocks, and full-text search.",
    longDescription: "Read and write Notion pages and databases. Create pages, append blocks, query databases with filters. Perfect for knowledge management and documentation.",
    icon: FileText,
    category: "Productivity",
    downloads: "15k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins install notion",
    setupCmd: "conductor plugins setup notion",
    tools: ["notion_search", "notion_page", "notion_create_page", "notion_append", "notion_database_query"],
    credentials: [
      { name: "NOTION_TOKEN", required: true, description: "Notion Internal Integration Token" }
    ],
    features: [
      "Full-text search across workspace",
      "Read and create pages",
      "Append blocks to pages",
      "Query databases with filters"
    ],
    useCases: [
      "Knowledge base queries",
      "Meeting notes automation",
      "Project documentation",
      "CRM and data tracking"
    ],
    pricing: "Free for personal, paid from $10/user/month",
    rateLimit: "3 requests/second",
    auth: "Internal Integration Token",
    platform: "Cloud (Notion hosted)",
    docsUrl: "https://developers.notion.com",
    websiteUrl: "https://notion.so",
  },
  slack: {
    name: "Slack",
    description: "Send messages, read channels, manage threads.",
    longDescription: "Connect your AI to Slack for team communication. Send messages, read history, manage threads, and add reactions. Essential for alerts and workflows.",
    icon: MessageSquare,
    category: "Communication",
    downloads: "17k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins install slack",
    setupCmd: "conductor plugins setup slack",
    tools: ["slack_send", "slack_read", "slack_channels", "slack_users", "slack_thread", "slack_react"],
    credentials: [
      { name: "SLACK_BOT_TOKEN", required: true, description: "Slack Bot Token with required scopes" }
    ],
    features: [
      "Send messages to channels/users",
      "Read channel history",
      "List channels and users",
      "Manage threads and reactions"
    ],
    useCases: [
      "Deploy and CI/CD notifications",
      "Incident alert escalation",
      "Daily standup summaries",
      "Support ticket routing"
    ],
    pricing: "Free for small teams, paid from $8.75/user/month",
    rateLimit: "20 requests/second",
    auth: "Bot Token + App Token",
    platform: "Cloud (Slack hosted)",
    docsUrl: "https://api.slack.com",
    websiteUrl: "https://slack.com",
  },
  stripe: {
    name: "Stripe",
    description: "Payments, customers, subscriptions, and refunds.",
    longDescription: "Manage Stripe payments, customers, and subscriptions. Query transactions, handle refunds, and track revenue metrics.",
    icon: CreditCard,
    category: "Finance",
    downloads: "10k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install stripe",
    setupCmd: "conductor plugins setup stripe",
    tools: ["stripe_customers", "stripe_payments", "stripe_subscriptions", "stripe_refunds", "stripe_balance"],
    credentials: [
      { name: "STRIPE_KEY", required: true, description: "Stripe Secret Key (use test key for development)" }
    ],
    features: [
      "List customers and payments",
      "Manage subscriptions",
      "Process refunds",
      "Check account balance"
    ],
    useCases: [
      "Revenue dashboard summaries",
      "Refund processing automation",
      "Payment failure alerts",
      "Subscription health checks"
    ],
    pricing: "2.9% + 30¢ per transaction",
    rateLimit: "100 requests/second",
    auth: "Secret Key",
    platform: "Cloud (Stripe hosted)",
    docsUrl: "https://stripe.com/docs",
    websiteUrl: "https://stripe.com",
  },
  vercel: {
    name: "Vercel",
    description: "Deployments, domains, environment variables.",
    longDescription: "Manage Vercel projects directly from your AI. List deployments, check build logs, manage domains, and configure environment variables.",
    icon: Cloud,
    category: "Developer",
    downloads: "13k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins install vercel",
    setupCmd: "conductor plugins setup vercel",
    tools: ["vercel_projects", "vercel_deployments", "vercel_deployment", "vercel_logs", "vercel_env", "vercel_domains"],
    credentials: [
      { name: "VERCEL_TOKEN", required: true, description: "Vercel Access Token from account settings" }
    ],
    features: [
      "List projects and deployments",
      "View build logs",
      "Manage environment variables",
      "Configure domains"
    ],
    useCases: [
      "Deployment status monitoring",
      "Build failure alerts",
      "Environment variable management",
      "Domain configuration"
    ],
    pricing: "Free hobby tier, Pro from $20/month",
    rateLimit: "100 requests/second",
    auth: "Access Token",
    platform: "Cloud (Vercel hosted)",
    docsUrl: "https://vercel.com/docs",
    websiteUrl: "https://vercel.com",
  },
};

export default async function MarketplacePluginPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plugin = PLUGINS[id];

  if (!plugin) {
    notFound();
  }

  const IconComponent = plugin.icon;

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
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#1a1a1a] bg-[#080808]">
            <IconComponent className="h-8 w-8 text-[#666]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-3xl font-bold">{plugin.name}</h1>
              {plugin.official && (
                <span className="rounded border border-[#1a1a1a] bg-[#111] px-2 py-0.5 font-mono text-[10px] text-[#555]">
                  official
                </span>
              )}
            </div>
            <p className="mt-2 text-lg text-[#888]">{plugin.description}</p>
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
          <h2 className="mb-4 font-mono text-lg font-semibold">Quick Install</h2>
          <code className="block rounded bg-[#0d0d0d] p-3 font-mono text-sm text-[#888] mb-4">
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

        <div className="mb-8">
          <h2 className="mb-4 font-mono text-lg font-semibold">About</h2>
          <p className="text-[#666] leading-relaxed">{plugin.longDescription}</p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-mono text-lg font-semibold">Features</h2>
          <ul className="space-y-2">
            {plugin.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-[#666]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-mono text-lg font-semibold">Use Cases</h2>
          <ul className="space-y-2">
            {plugin.useCases.map((useCase, i) => (
              <li key={i} className="flex items-center gap-2 text-[#666]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                {useCase}
              </li>
            ))}
          </ul>
        </div>

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
            <h2 className="mb-4 font-mono text-lg font-semibold">Credentials Required</h2>
            <div className="space-y-3">
              {plugin.credentials.map((cred) => (
                <div key={cred.name} className="rounded border border-[#1a1a1a] bg-[#080808] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-white">{cred.name}</span>
                    {cred.required && (
                      <span className="rounded bg-[#1a1010] px-2 py-0.5 font-mono text-[10px] text-[#664444]">required</span>
                    )}
                  </div>
                  <p className="text-xs text-[#555]">{cred.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded border border-[#1a1a1a] bg-[#080808] p-4">
            <h3 className="font-mono text-xs text-[#555] mb-2">Pricing</h3>
            <p className="text-sm text-white">{plugin.pricing}</p>
          </div>
          <div className="rounded border border-[#1a1a1a] bg-[#080808] p-4">
            <h3 className="font-mono text-xs text-[#555] mb-2">Rate Limit</h3>
            <p className="text-sm text-white">{plugin.rateLimit}</p>
          </div>
          <div className="rounded border border-[#1a1a1a] bg-[#080808] p-4">
            <h3 className="font-mono text-xs text-[#555] mb-2">Auth Type</h3>
            <p className="text-sm text-white">{plugin.auth}</p>
          </div>
          <div className="rounded border border-[#1a1a1a] bg-[#080808] p-4">
            <h3 className="font-mono text-xs text-[#555] mb-2">Platform</h3>
            <p className="text-sm text-white">{plugin.platform}</p>
          </div>
        </div>

        <div className="flex gap-4 border-t border-[#1a1a1a] pt-6">
          <Link
            href="/docs/plugins"
            className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-white"
          >
            View full documentation
            <ExternalLink className="h-3 w-3" />
          </Link>
          {plugin.docsUrl && (
            <a
              href={plugin.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-white"
            >
              Official docs
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {plugin.websiteUrl && (
            <a
              href={plugin.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-white"
            >
              Visit website
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}