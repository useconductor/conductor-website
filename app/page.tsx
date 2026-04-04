import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MatrixRain } from "@/components/ui/matrix-rain";
import { HyperText } from "@/components/ui/hyper-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { MagneticDock } from "@/components/ui/magnetic-dock";
import {
  Terminal,
  Zap,
  Shield,
  Puzzle,
  Server,
  Code2,
  Globe,
  Cpu,
  Lock,
  Webhook,
  BookOpen,
  Rocket,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Layers,
  Settings,
  Download,
  MessageSquare,
  Workflow,
  Database,
  FileSearch,
  Cloud,
  Bot,
  KeyRound,
  Activity,
  Search,
  FolderTree,
  Clock,
  Bell,
  BarChart3,
  Eye,
} from "lucide-react";
import Link from "next/link";

const aiClients = [
  { name: "Claude Code", icon: MessageSquare },
  { name: "Cursor", icon: Code2 },
  { name: "Cline", icon: Bot },
  { name: "Aider", icon: Terminal },
  { name: "Windsurf", icon: Workflow },
  { name: "Continue", icon: GitBranch },
  { name: "Roo Code", icon: Cpu },
  { name: "Copilot", icon: Cloud },
];

const features = [
  {
    icon: Puzzle,
    title: "100+ Plugins",
    description:
      "Shell, GitHub, Jira, Slack, AWS, and dozens more. Every tool your AI agent needs, pre-built and ready.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "AES-256-GCM encryption, circuit breakers, approval gates, and tamper-evident audit logs.",
  },
  {
    icon: Server,
    title: "MCP Native",
    description:
      "Full Model Context Protocol support. Works with any MCP-compatible AI client out of the box.",
  },
  {
    icon: Zap,
    title: "Zero Config",
    description:
      "One JSON config block. Drop it in, and every tool is instantly available to your AI agent.",
  },
  {
    icon: Webhook,
    title: "Webhooks & Events",
    description:
      "Real-time event streaming, custom webhook endpoints, and reactive automation pipelines.",
  },
  {
    icon: Activity,
    title: "Observability",
    description:
      "Built-in metrics, audit logging, health checks, and a live dashboard for full visibility.",
  },
];

const plugins = [
  {
    icon: Terminal,
    name: "Shell",
    desc: "Execute shell commands with approval gates",
    category: "Core",
  },
  {
    icon: GitBranch,
    name: "Git",
    desc: "Repository operations, diffs, and branch management",
    category: "Dev",
  },
  {
    icon: Code2,
    name: "GitHub",
    desc: "Issues, PRs, repos, and GitHub Actions",
    category: "Dev",
  },
  {
    icon: Globe,
    name: "Web Search",
    desc: "Search the web with multiple providers",
    category: "Data",
  },
  {
    icon: Database,
    name: "SQLite",
    desc: "SQL database queries and management",
    category: "Data",
  },
  {
    icon: FileSearch,
    name: "Filesystem",
    desc: "Read, write, search, and manage files",
    category: "Core",
  },
  {
    icon: Cloud,
    name: "AWS",
    desc: "EC2, S3, Lambda, and 50+ AWS services",
    category: "Cloud",
  },
  {
    icon: MessageSquare,
    name: "Slack",
    desc: "Send messages, read channels, manage workspaces",
    category: "Comms",
  },
  {
    icon: Bot,
    name: "Telegram",
    desc: "Bot management and message handling",
    category: "Comms",
  },
  {
    icon: Clock,
    name: "Cron",
    desc: "Scheduled tasks and recurring jobs",
    category: "Automation",
  },
  {
    icon: Bell,
    name: "Notifications",
    desc: "Push, email, and in-app notifications",
    category: "Comms",
  },
  {
    icon: BarChart3,
    name: "Analytics",
    desc: "Metrics, dashboards, and reporting",
    category: "Data",
  },
];

const steps = [
  {
    step: "01",
    title: "Install Conductor",
    description:
      "One command to install. Conductor sets up its config, database, and encryption key automatically.",
    icon: Download,
  },
  {
    step: "02",
    title: "Configure Your Tools",
    description:
      "Enable the plugins you need. Each plugin has a simple config schema with validation.",
    icon: Settings,
  },
  {
    step: "03",
    title: "Connect Your AI Client",
    description:
      "Add the MCP server config to Claude, Cursor, Cline, or any MCP-compatible client.",
    icon: MessageSquare,
  },
  {
    step: "04",
    title: "Start Building",
    description:
      "Your AI agent now has access to 100+ tools. Ask it to do anything.",
    icon: Rocket,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <MatrixRain fontSize={12} speed={40} opacity={0.08} />
        <NoiseTexture opacity={0.02} />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ff6b2b]/20 bg-[#ff6b2b]/5 mb-8">
            <Zap className="h-3.5 w-3.5 text-[#ff6b2b]" />
            <span className="text-sm text-[#ff6b2b] font-medium">
              The universal MCP plugin system
            </span>
          </div>

          <HyperText
            text="One connection. Every tool."
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-gradient"
            duration={1200}
          />

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect Claude Code, Cursor, Cline, and every AI client to 100+
            plugins through a single MCP server. Ship faster with the AI
            integration hub built for developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/install"
              className="group flex items-center gap-2 px-8 py-3.5 bg-[#ff6b2b] text-white font-medium rounded-xl hover:bg-[#ff8550] transition-all glow-orange"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 px-8 py-3.5 border border-white/10 text-white/70 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Read the Docs
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-white/30 font-mono">
            <Terminal className="h-3.5 w-3.5" />
            <code>npm install -g @thealxlabs/conductor</code>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* AI Clients Bar */}
      <section className="border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-center text-sm text-white/30 mb-8 uppercase tracking-wider font-medium">
            Works with every AI client
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {aiClients.map((client) => (
              <div
                key={client.name}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-[#0a0a0a] hover:border-[#ff6b2b]/20 transition-colors group"
              >
                <client.icon className="h-6 w-6 text-white/30 group-hover:text-[#ff6b2b] transition-colors" />
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything your AI agent{" "}
            <span className="text-gradient">needs</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Conductor provides the infrastructure layer for AI agents to
            interact with the real world safely and reliably.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <SpotlightCard key={feature.title} className="p-6">
              <BorderBeam size={150} duration={15} delay={i * 2} />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-[#ff6b2b]/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-[#ff6b2b]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Plugin Grid */}
      <section className="border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Plugin <span className="text-gradient">ecosystem</span>
              </h2>
              <p className="text-white/40 text-lg max-w-xl">
                100+ pre-built plugins covering every category. From shell
                commands to cloud infrastructure.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="mt-4 md:mt-0 flex items-center gap-2 text-[#ff6b2b] hover:text-[#ff8550] transition-colors"
            >
              View all plugins
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {plugins.map((plugin, i) => (
              <SpotlightCard key={plugin.name} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#ff6b2b]/10 flex items-center justify-center">
                    <plugin.icon className="h-4.5 w-4.5 text-[#ff6b2b]" />
                  </div>
                  <span className="text-xs text-white/20 px-2 py-0.5 rounded-full bg-white/5">
                    {plugin.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold mb-1">{plugin.name}</h3>
                <p className="text-xs text-white/35 leading-relaxed">
                  {plugin.desc}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            From zero to fully-connected AI agent in four steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <SpotlightCard key={step.step} className="p-6">
              <BorderBeam size={120} duration={12} delay={i * 3} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-[#ff6b2b]/20 font-mono">
                    {step.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#ff6b2b]/10 flex items-center justify-center">
                    <step.icon className="h-4 w-4 text-[#ff6b2b]" />
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden p-12 md:p-16 text-center">
            <NoiseTexture opacity={0.03} />
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b2b]/5 via-transparent to-transparent" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to <span className="text-gradient">connect</span>?
              </h2>
              <p className="text-white/40 text-lg max-w-xl mx-auto mb-8">
                Install Conductor in seconds. Your AI agent will thank you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/install"
                  className="flex items-center gap-2 px-8 py-3.5 bg-[#ff6b2b] text-white font-medium rounded-xl hover:bg-[#ff8550] transition-all"
                >
                  <Download className="h-4 w-4" />
                  Install Now
                </Link>
                <Link
                  href="/docs/quickstart"
                  className="flex items-center gap-2 px-8 py-3.5 border border-white/10 text-white/70 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all"
                >
                  <Rocket className="h-4 w-4" />
                  Quick Start Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
