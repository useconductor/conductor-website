"use client";

import Link from "next/link";
import {
  Terminal,
  Shield,
  Plug,
  Zap,
  Webhook,
  BarChart3,
  ArrowRight,
  Github,
  Search,
  Copy,
  Check,
  ChevronRight,
  Code2,
  Globe,
  Database,
  GitBranch,
  Settings,
  FileText,
  Mail,
  Cloud,
  Lock,
} from "lucide-react";
import { MatrixRain } from "@/components/ui/matrix-rain";
import { HyperText } from "@/components/ui/hyper-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { ScrollVelocity } from "@/components/ui/scroll-velocity";

const aiClients = [
  { name: "Claude Code", icon: "claude" },
  { name: "Cursor", icon: "cursor" },
  { name: "Cline", icon: "cline" },
  { name: "Aider", icon: "aider" },
  { name: "Windsurf", icon: "windsurf" },
  { name: "Continue", icon: "continue" },
  { name: "Roo Code", icon: "roo" },
  { name: "Copilot", icon: "copilot" },
];

const features = [
  {
    icon: Plug,
    title: "100+ Plugins",
    description:
      "File system, shell, git, databases, APIs, webhooks — every tool your AI agent needs.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "AES-256-GCM encryption, approval gates, circuit breakers, and audit logging built in.",
  },
  {
    icon: Zap,
    title: "MCP Native",
    description:
      "Built on the Model Context Protocol. Works with any MCP-compatible AI client out of the box.",
  },
  {
    icon: Settings,
    title: "Zero Config",
    description:
      "Install, point your AI client, and go. Sensible defaults with deep configuration when you need it.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description:
      "Trigger automations from external systems. Real-time event streaming with retry logic.",
  },
  {
    icon: BarChart3,
    title: "Observability",
    description:
      "Built-in metrics, health checks, and tamper-evident audit logs. Know everything that happens.",
  },
];

const plugins = [
  {
    name: "File System",
    description: "Read, write, search, and manage files",
    icon: FileText,
    category: "core",
  },
  {
    name: "Shell",
    description: "Execute commands with approval gates",
    icon: Terminal,
    category: "core",
  },
  {
    name: "Git",
    description: "Full git operations and repository management",
    icon: GitBranch,
    category: "core",
  },
  {
    name: "Web Fetch",
    description: "Fetch and parse web content",
    icon: Globe,
    category: "network",
  },
  {
    name: "Database",
    description: "Query SQLite, PostgreSQL, and more",
    icon: Database,
    category: "data",
  },
  {
    name: "Code Executor",
    description: "Run code in isolated sandboxes",
    icon: Code2,
    category: "core",
  },
  {
    name: "Email",
    description: "Send and receive emails via SMTP/IMAP",
    icon: Mail,
    category: "communication",
  },
  {
    name: "Cloud",
    description: "AWS, GCP, and Azure integrations",
    icon: Cloud,
    category: "cloud",
  },
  {
    name: "Security",
    description: "Keychain, encryption, and secrets",
    icon: Lock,
    category: "security",
  },
  {
    name: "Webhooks",
    description: "Incoming and outgoing webhook handlers",
    icon: Webhook,
    category: "network",
  },
  {
    name: "Config",
    description: "Configuration management and validation",
    icon: Settings,
    category: "core",
  },
  {
    name: "AI Manager",
    description: "Multi-provider AI orchestration",
    icon: Zap,
    category: "ai",
  },
];

const steps = [
  {
    step: "01",
    title: "Install",
    description:
      "npm install -g @thealxlabs/conductor or use the install script.",
  },
  {
    step: "02",
    title: "Configure",
    description:
      "Run conductor config setup to configure your plugins and AI providers.",
  },
  {
    step: "03",
    title: "Connect",
    description:
      "Point your AI client (Claude Code, Cursor, etc.) to the Conductor MCP server.",
  },
  {
    step: "04",
    title: "Build",
    description: "Your AI agent now has access to 100+ tools. Start building.",
  },
];

const mcpConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@thealxlabs/conductor"]
    }
  }
}`;

function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="absolute top-3 right-3 rounded-md border border-[#222] bg-[#111] p-1.5 text-[#888] transition-colors hover:text-white"
    >
      <Copy className="h-3.5 w-3.5" />
    </button>
  );
}

export default function HomePage() {
  return (
    <div className="relative">
      <NoiseTexture opacity={0.02} />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-14">
        <MatrixRain opacity={0.08} speed={0.3} />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#0a0a0a] px-3 py-1.5 text-xs text-[#888]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
            v2.0 — Now with 100+ plugins
          </div>

          <h1 className="font-mono text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
            <HyperText text="One connection." delay={200} />
            <br />
            <span className="text-[#555]">
              <HyperText text="Every tool." delay={600} />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-[#888]">
            The single MCP server that gives any AI agent access to 100+ tools.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="group inline-flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#e0e0e0]"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] px-6 py-2.5 text-sm text-[#888] transition-colors hover:text-white"
            >
              Read the docs
            </Link>
          </div>

          {/* MCP Config */}
          <div className="mx-auto mt-16 max-w-lg">
            <div className="relative overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#0a0a0a]">
              <BorderBeam size={150} duration={12} />
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2">
                <span className="text-xs font-mono text-[#555]">
                  claude_desktop_config.json
                </span>
              </div>
              <pre className="p-4 text-sm font-mono text-[#ccc]">
                <code>{mcpConfig}</code>
              </pre>
              <CopyButton text={mcpConfig} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-5 w-5 rotate-90 text-[#333]" />
        </div>
      </section>

      {/* AI Clients */}
      <section className="border-t border-[#1a1a1a] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-10 text-center text-xs font-mono uppercase tracking-widest text-[#555]">
            Works with your AI client
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {aiClients.map((client) => (
              <span
                key={client.name}
                className="text-sm font-medium text-[#555] transition-colors hover:text-white"
              >
                {client.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll Velocity */}
      <ScrollVelocity
        text="CONDUCTOR — MCP SERVER — 100+ TOOLS — ANY AI AGENT — "
        velocity={1.5}
      />

      {/* Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
              Features
            </p>
            <h2 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
              Everything your AI agent needs
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <SpotlightCard key={feature.title} className="group p-6">
                <BorderBeam size={100} duration={8} delay={Math.random() * 5} />
                <feature.icon className="mb-4 h-5 w-5 text-[#888]" />
                <h3 className="mb-2 font-mono text-sm font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#888]">
                  {feature.description}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Plugin Showcase */}
      <section className="border-t border-[#1a1a1a] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
              Plugins
            </p>
            <h2 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
              100+ plugins and counting
            </h2>
            <p className="mt-3 text-[#888]">
              From file system operations to cloud integrations. Every plugin is
              sandboxed, auditable, and secure.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plugins.map((plugin) => (
              <SpotlightCard key={plugin.name} className="group p-5">
                <div className="flex items-start gap-3">
                  <plugin.icon className="mt-0.5 h-4 w-4 text-[#555]" />
                  <div>
                    <h3 className="font-mono text-sm font-semibold">
                      {plugin.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#666]">
                      {plugin.description}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
            >
              View all plugins in the marketplace
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-[#1a1a1a] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
              How it works
            </p>
            <h2 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
              Four steps to full power
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.step}
                className="relative border-l border-[#1a1a1a] pl-6"
              >
                <span className="font-mono text-xs text-[#333]">
                  {step.step}
                </span>
                <h3 className="mt-2 font-mono text-sm font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#888]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1a1a1a] px-6 py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-mono text-3xl font-bold tracking-tight md:text-5xl">
            Ready to connect?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[#888]">
            Install Conductor and give your AI agent the tools it deserves.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="group inline-flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#e0e0e0]"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/install"
              className="inline-flex items-center gap-2 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] px-6 py-2.5 text-sm text-[#888] transition-colors hover:text-white"
            >
              <Terminal className="h-3.5 w-3.5" />
              Install now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
