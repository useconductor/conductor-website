import Link from "next/link";
import { ArrowRight, Terminal, Settings, Package, Shield, Webhook, FileText, HelpCircle, BookOpen, Code2, Zap, Server, Activity, GitBranch, Puzzle, Wrench, List } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const sections = [
  {
    title: "Getting Started",
    links: [
      { icon: Zap, title: "Quick Start", description: "Install, connect your AI client, verify tools.", href: "/docs/quickstart", tag: "Start here" },
      { icon: BookOpen, title: "How it works", description: "Architecture, tool call lifecycle, plugin model.", href: "/docs/concepts", tag: null },
      { icon: Terminal, title: "Installation", description: "npm, npx, standalone binary, all platforms.", href: "/docs/install", tag: null },
    ],
  },
  {
    title: "Core",
    links: [
      { icon: Settings, title: "Configuration", description: "Config file, env vars, CLI commands.", href: "/docs/mcp-server", tag: null },
      { icon: Server, title: "Transport modes", description: "stdio vs HTTP — when to use each.", href: "/docs/transport", tag: null },
      { icon: Package, title: "Plugin system", description: "Every built-in plugin with tool counts.", href: "/docs/plugins", tag: null },
      { icon: Shield, title: "Security", description: "Encryption, allowlists, approval gates.", href: "/docs/security", tag: null },
      { icon: Activity, title: "Audit logs", description: "SHA-256 chained log, CLI queries, SIEM forwarding.", href: "/docs/audit-logs", tag: null },
      { icon: Zap, title: "Circuit breakers", description: "Per-tool failure counters and open/close states.", href: "/docs/circuit-breakers", tag: null },
      { icon: Webhook, title: "Webhooks", description: "Incoming triggers and outgoing events.", href: "/docs/webhooks", tag: null },
    ],
  },
  {
    title: "Deployment",
    links: [
      { icon: Server, title: "Deployment guide", description: "Local, Docker, systemd, remote servers.", href: "/docs/deployment", tag: null },
      { icon: GitBranch, title: "CI/CD", description: "GitHub Actions, Docker Compose pipelines.", href: "/docs/ci-cd", tag: null },
    ],
  },
  {
    title: "Guides",
    links: [
      { icon: Puzzle, title: "Writing custom plugins", description: "Build and load your own tools in minutes.", href: "/docs/custom-plugins", tag: null },
      { icon: BookOpen, title: "More guides", description: "Remote deployment, integrations, migration.", href: "/docs/guides", tag: null },
    ],
  },
  {
    title: "Reference",
    links: [
      { icon: Terminal, title: "CLI reference", description: "Every command, flag, and option.", href: "/docs/cli", tag: null },
      { icon: FileText, title: "API reference", description: "HTTP endpoints and tool signatures.", href: "/docs/api-reference", tag: null },
      { icon: Code2, title: "SDKs", description: "TypeScript and Python client libraries.", href: "/docs/sdks", tag: null },
    ],
  },
  {
    title: "Resources",
    links: [
      { icon: HelpCircle, title: "FAQ", description: "Common setup questions answered.", href: "/docs/faq", tag: null },
      { icon: Wrench, title: "Troubleshooting", description: "10 common problems and how to fix them.", href: "/docs/troubleshooting", tag: null },
      { icon: List, title: "Changelog", description: "Every release, what changed, what broke.", href: "/docs/changelog", tag: null },
    ],
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
            npm install -g @useconductor/conductor
          </code>
          <CopyButton text="npm install -g @useconductor/conductor" />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#333]">
              {section.title}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {section.links.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4 transition-colors hover:border-[#2a2a2a]"
                >
                  <card.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#333]" />
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
        ))}
      </div>
    </div>
  );
}
