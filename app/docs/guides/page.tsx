import Link from "next/link";
import { ArrowRight, BookOpen, Terminal, Settings, Cloud } from "lucide-react";

const guides = [
  {
    icon: Terminal,
    title: "Setting up your first MCP client",
    description:
      "Step-by-step guide to connecting Claude Code, Cursor, or any MCP client to Conductor.",
    href: "/docs/guides/first-client",
    tag: "Beginner",
  },
  {
    icon: Settings,
    title: "Custom plugin development",
    description:
      "Build your own plugin with the Plugin interface, config schema, and tool definitions.",
    href: "/docs/guides/custom-plugins",
    tag: "Advanced",
  },
  {
    icon: Cloud,
    title: "Deploying Conductor on a server",
    description:
      "Run Conductor as a remote MCP server with HTTP transport for team access.",
    href: "/docs/guides/remote-deployment",
    tag: "Intermediate",
  },
  {
    icon: BookOpen,
    title: "Webhook integrations",
    description:
      "Connect GitHub, Slack, and other services to trigger Conductor automations.",
    href: "/docs/guides/webhook-integrations",
    tag: "Intermediate",
  },
  {
    icon: Terminal,
    title: "Shell plugin configuration",
    description:
      "Configure the command allowlist, approval gates, and sandbox settings.",
    href: "/docs/guides/shell-config",
    tag: "Intermediate",
  },
  {
    icon: Settings,
    title: "Database plugin setup",
    description: "Connect to PostgreSQL, SQLite, MySQL, and other databases.",
    href: "/docs/guides/database-setup",
    tag: "Beginner",
  },
];

export default function GuidesPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Resources
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Guides
        </h1>
        <p className="mt-3 text-[#888]">
          Step-by-step tutorials and walkthroughs.
        </p>
      </div>

      <div className="space-y-3">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5 transition-colors hover:border-[#333]"
          >
            <guide.icon className="mt-0.5 h-5 w-5 text-[#555]" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-semibold">
                  {guide.title}
                </h3>
                <span className="rounded-full border border-[#1a1a1a] px-2 py-0.5 text-[10px] text-[#555]">
                  {guide.tag}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#666]">{guide.description}</p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 text-[#333] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
