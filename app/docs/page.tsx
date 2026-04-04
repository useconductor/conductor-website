import Link from "next/link";
import {
  ArrowRight,
  Book,
  Zap,
  Shield,
  Plug,
  Webhook,
  Code2,
  FileText,
  HelpCircle,
} from "lucide-react";

const docCards = [
  {
    icon: Zap,
    title: "Quick Start",
    description: "Get up and running in 5 minutes",
    href: "/docs/quickstart",
  },
  {
    icon: Plug,
    title: "MCP Server",
    description: "Understanding the MCP protocol integration",
    href: "/docs/mcp-server",
  },
  {
    icon: Code2,
    title: "Plugins",
    description: "Plugin system architecture and API",
    href: "/docs/plugins",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Encryption, approvals, and audit logging",
    href: "/docs/security",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Event-driven integrations",
    href: "/docs/webhooks",
  },
  {
    icon: FileText,
    title: "API Reference",
    description: "Complete tool and endpoint reference",
    href: "/docs/api-reference",
  },
  {
    icon: Book,
    title: "Guides",
    description: "Step-by-step tutorials and walkthroughs",
    href: "/docs/guides",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description: "Frequently asked questions",
    href: "/docs/faq",
  },
];

export default function DocsPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Documentation
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Conductor Docs
        </h1>
        <p className="mt-3 text-[#888]">
          Everything you need to know about installing, configuring, and using
          Conductor.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {docCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5 transition-colors hover:border-[#333]"
          >
            <card.icon className="mt-0.5 h-5 w-5 text-[#555]" />
            <div>
              <h3 className="font-mono text-sm font-semibold">{card.title}</h3>
              <p className="mt-1 text-xs text-[#666]">{card.description}</p>
            </div>
            <ArrowRight className="ml-auto mt-0.5 h-4 w-4 text-[#333] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
