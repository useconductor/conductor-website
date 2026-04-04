import Link from "next/link";
import { ArrowRight, Terminal, Settings, Package, Shield, Webhook, FileText, HelpCircle, BookOpen, Code2, Zap } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const quickLinks = [
  {
    icon: Zap,
    title: "Quick Start",
    description: "Install, connect your AI client, verify tools are available.",
    href: "/docs/quickstart",
    tag: "Start here",
  },
  {
    icon: Package,
    title: "Plugin Reference",
    description: "Every plugin, every tool, with input/output examples.",
    href: "/docs/plugins",
    tag: null,
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Config file, environment variables, CLI commands.",
    href: "/docs/mcp-server",
    tag: null,
  },
  {
    icon: Shield,
    title: "Security",
    description: "Allowlists, approval gates, encryption, audit logs.",
    href: "/docs/security",
    tag: null,
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Incoming triggers and outgoing events.",
    href: "/docs/webhooks",
    tag: null,
  },
  {
    icon: FileText,
    title: "API Reference",
    description: "Every tool signature and HTTP endpoint.",
    href: "/docs/api-reference",
    tag: null,
  },
  {
    icon: Code2,
    title: "SDKs",
    description: "TypeScript and Python client libraries.",
    href: "/docs/sdks",
    tag: null,
  },
  {
    icon: BookOpen,
    title: "Guides",
    description: "Custom plugins, remote deployment, integrations.",
    href: "/docs/guides",
    tag: null,
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description: "Common questions and troubleshooting.",
    href: "/docs/faq",
    tag: null,
  },
];

export default function DocsPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Documentation
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Conductor Docs
        </h1>
        <p className="mt-3 text-[#666]">
          Everything you need to install, configure, and extend Conductor.
        </p>
      </div>

      {/* Install callout */}
      <div className="mb-10 overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
        <div className="border-b border-[#1a1a1a] px-4 py-2.5">
          <span className="font-mono text-[10px] text-[#3a3a3a]">install</span>
        </div>
        <div className="flex items-center justify-between p-4">
          <code className="font-mono text-sm text-[#aaa]">
            npm install -g @thealxlabs/conductor
          </code>
          <CopyButton text="npm install -g @thealxlabs/conductor" />
        </div>
      </div>

      {/* Links */}
      <div className="grid gap-2 sm:grid-cols-2">
        {quickLinks.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-5 transition-colors hover:border-[#2a2a2a]"
          >
            <card.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#444]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-semibold">{card.title}</h3>
                {card.tag && (
                  <span className="rounded border border-[#1a1a1a] px-1.5 py-0.5 font-mono text-[9px] text-[#555]">
                    {card.tag}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-[#555]">{card.description}</p>
            </div>
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a2a2a] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
