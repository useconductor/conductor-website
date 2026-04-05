"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Terminal,
  Shield,
  Zap,
  Webhook,
  ArrowRight,
  Copy,
  Check,
  Code2,
  Globe,
  Database,
  GitBranch,
  Settings,
  FileText,
  Mail,
  Cloud,
  Lock,
  Server,
  Package,
  Activity,
  Key,
  Eye,
  AlertTriangle,
  Cpu,
  Box,
  MessageSquare,
} from "lucide-react";
import dynamic from "next/dynamic";
import { BorderBeam } from "@/components/ui/border-beam";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { NoiseTexture } from "@/components/ui/noise-texture";

const ScrollVelocity = dynamic(
  () => import("@/components/ui/scroll-velocity").then((m) => m.ScrollVelocity),
  { ssr: false }
);
const DockItem = dynamic(
  () => import("@/components/ui/magnetic-dock").then((m) => m.DockItem),
  { ssr: false }
);
const TerminalDemo = dynamic(
  () => import("@/components/terminal-demo").then((m) => m.TerminalDemo),
  { ssr: false }
);

// ─── Data ────────────────────────────────────────────────────────────────────

const aiClients = [
  { name: "Claude Code", abbr: "CC" },
  { name: "Cursor", abbr: "CR" },
  { name: "Cline", abbr: "CL" },
  { name: "Aider", abbr: "AI" },
  { name: "Windsurf", abbr: "WS" },
  { name: "Continue", abbr: "CO" },
  { name: "Roo Code", abbr: "RC" },
  { name: "Copilot", abbr: "GP" },
];

const stats = [
  { value: "100+", label: "plugins" },
  { value: "8", label: "AI clients" },
  { value: "1", label: "config line" },
  { value: "AES-256", label: "encryption" },
];

const features = [
  {
    icon: Package,
    title: "100+ Plugins",
    description:
      "File system, shell, git, databases, APIs, webhooks — every tool your AI agent needs, all bundled and maintained.",
    detail: "npm install -g @useconductor/conductor",
  },
  {
    icon: Shield,
    title: "Security built in",
    description:
      "AES-256-GCM encryption, approval gates, circuit breakers, and tamper-evident audit logging — not bolted on.",
    detail: "Zero plaintext secrets. Ever.",
  },
  {
    icon: Server,
    title: "One server, all tools",
    description:
      "Add one config block to your AI client. That's it. No per-tool servers, no per-tool configs.",
    detail: "Works with any MCP client",
  },
  {
    icon: Settings,
    title: "Zero config",
    description:
      "Install, add the config block, and go. Sensible defaults for everything. Deep config when you need it.",
    detail: "conductor config setup",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description:
      "External systems can trigger Conductor via HTTP. Outgoing events push to any endpoint with retry and HMAC signing.",
    detail: "7 event types · exponential backoff",
  },
  {
    icon: Activity,
    title: "Full observability",
    description:
      "Prometheus metrics, health checks, and SHA-256 chained audit logs. Every tool call recorded permanently.",
    detail: "GET /metrics · GET /audit",
  },
];

const plugins = [
  { name: "File System", description: "Read, write, search files", icon: FileText },
  { name: "Shell", description: "Execute with approval gates", icon: Terminal },
  { name: "Git", description: "Full git operations", icon: GitBranch },
  { name: "Web Fetch", description: "Fetch and parse content", icon: Globe },
  { name: "Database", description: "SQLite, Postgres, MySQL", icon: Database },
  { name: "Code Executor", description: "Isolated code sandboxes", icon: Code2 },
  { name: "Email", description: "SMTP / IMAP integration", icon: Mail },
  { name: "Cloud", description: "AWS, GCP, Azure", icon: Cloud },
  { name: "Security", description: "Keychain and secrets", icon: Lock },
  { name: "Webhooks", description: "In/out event handlers", icon: Webhook },
  { name: "Config", description: "Schema-validated config", icon: Settings },
  { name: "AI Manager", description: "Multi-provider routing", icon: Zap },
  { name: "Docker", description: "Container management", icon: Box },
  { name: "GitHub", description: "PRs, issues, repos", icon: GitBranch },
  { name: "Slack", description: "Messages and channels", icon: MessageSquare },
  { name: "Keychain", description: "OS credential store", icon: Key },
];

const securityItems = [
  {
    icon: Lock,
    title: "AES-256-GCM encryption",
    body: "Secrets are encrypted before storage. Key is derived from machine ID and stored in the OS keychain — never in config files.",
  },
  {
    icon: Shield,
    title: "Approval gates",
    body: "Destructive tools (shell.exec, filesystem.delete) require explicit user confirmation before execution. Configurable per-tool.",
  },
  {
    icon: Eye,
    title: "Tamper-evident audit log",
    body: "SHA-256 chained log at ~/.conductor/audit.log. Every modification to any entry breaks the chain and is immediately detectable.",
  },
  {
    icon: AlertTriangle,
    title: "Circuit breakers",
    body: "Each tool has an independent circuit breaker. After 5 failures the circuit opens — requests fail fast, no cascading errors.",
  },
  {
    icon: Cpu,
    title: "Command allowlisting",
    body: "The shell plugin enforces a strict allowlist. No wildcards. No eval(). Only explicitly permitted commands can run.",
  },
  {
    icon: Activity,
    title: "Rate limiting",
    body: "All HTTP endpoints are rate-limited. Webhook and tool endpoints have independent limits, configurable per deployment.",
  },
];

const mcpConfig = `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@useconductor/conductor"]
    }
  }
}`;

// ─── Components ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute top-3 right-3 rounded border border-[#222] bg-[#0d0d0d] p-1.5 text-[#555] transition-colors hover:text-white"
      aria-label={copied ? "Copied" : "Copy"}
    >
      {copied
        ? <Check className="h-3.5 w-3.5 text-white" />
        : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#333]">
      {children}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="relative">
      <NoiseTexture opacity={0.02} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-14">
        {/* Subtle grid background instead of matrix rain */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#0d0d0d 1px, transparent 1px), linear-gradient(90deg, #0d0d0d 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          {/* Badge — renders immediately */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-1.5 font-mono text-xs text-[#555]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            v2.0 — Now with 100+ plugins
            <span className="mx-1 text-[#222]">/</span>
            <Link href="/docs/quickstart" className="text-[#666] hover:text-white transition-colors">
              Get started <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>

          {/* Headline — plain text, renders immediately */}
          <h1 className="font-mono text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl lg:text-[5.5rem]">
            One connection.
            <br />
            <span className="text-[#2e2e2e]">Every tool.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-[#555]">
            Give your AI agent access to 100+ tools with one config block.
            Files, shell, git, databases, cloud — all through a single server
            you control.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#e8e8e8]"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-md border border-[#222] px-5 py-2.5 text-sm text-[#666] transition-colors hover:border-[#444] hover:text-white"
            >
              Read the docs
            </Link>
            <Link
              href="/install"
              className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm text-[#444] transition-colors hover:text-white"
            >
              <Terminal className="h-3.5 w-3.5" />
              Install
            </Link>
          </div>

          {/* Config block */}
          <div className="mx-auto mt-16 max-w-md text-left">
            <div className="relative overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#060606]">
              <BorderBeam size={200} duration={14} />
              <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1a]" />
                <span className="ml-3 font-mono text-[10px] text-[#333]">
                  claude_desktop_config.json
                </span>
              </div>
              <pre className="p-5 font-mono text-sm leading-relaxed text-[#888]">
                <code>{mcpConfig}</code>
              </pre>
              <CopyButton text={mcpConfig} />
            </div>
          </div>
        </div>
      </section>

      {/* ── AI CLIENTS ───────────────────────────────────────── */}
      <section className="border-t border-[#1a1a1a] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#2a2a2a]">
            Works with every major AI coding client
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {aiClients.map((client) => (
              <DockItem key={client.name}>
                <div className="group flex cursor-default items-center gap-2 rounded-lg border border-[#111] bg-[#080808] px-4 py-2.5 transition-colors hover:border-[#222]">
                  <span className="font-mono text-[10px] text-[#222]">{client.abbr}</span>
                  <span className="font-mono text-xs text-[#444] transition-colors group-hover:text-[#888]">
                    {client.name}
                  </span>
                </div>
              </DockItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="border-t border-[#1a1a1a]">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-px bg-[#1a1a1a] md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#050505] px-8 py-10 text-center">
                <div className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#333]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCROLL VELOCITY ──────────────────────────────────── */}
      <div className="border-t border-[#1a1a1a]">
        <ScrollVelocity
          text="CONDUCTOR — 100+ TOOLS — ANY AI CLIENT — ZERO VENDOR LOCK-IN — "
          velocity={2}
        />
      </div>

      {/* ── TERMINAL DEMO ────────────────────────────────────── */}
      <section className="border-t border-[#1a1a1a] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Label>Live demo</Label>
              <h2 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
                Your AI, fully equipped.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#555]">
                Conductor sits between your AI client and the real world. Every
                tool call is validated, logged, and — for destructive ops —
                gated behind user approval before execution.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Read and write any file on disk",
                  "Run shell commands with an allowlist you control",
                  "Git: status, diff, commit, push — all of it",
                  "Query any database, inspect schemas",
                  "Fetch URLs, parse HTML, handle webhooks",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#555]">
                    <span className="h-px w-4 shrink-0 bg-[#222]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/docs/quickstart"
                  className="group inline-flex items-center gap-2 font-mono text-sm text-[#666] transition-colors hover:text-white"
                >
                  Get running in 5 minutes
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <BorderBeam size={300} duration={16} />
              <TerminalDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="border-t border-[#1a1a1a] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <Label>Features</Label>
            <h2 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
              Everything in one place
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-[#1a1a1a] sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <SpotlightCard key={f.title} className="rounded-none border-0 bg-[#050505] p-8">
                <f.icon className="mb-5 h-5 w-5 text-[#333]" />
                <h3 className="mb-2 font-mono text-sm font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#555]">{f.description}</p>
                <div className="mt-5 border-t border-[#0d0d0d] pt-4">
                  <code className="font-mono text-[10px] text-[#2a2a2a]">{f.detail}</code>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ─────────────────────────────────────────── */}
      <section className="border-t border-[#1a1a1a] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 grid items-end gap-8 lg:grid-cols-2">
            <div>
              <Label>Security</Label>
              <h2 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
                Defense-in-depth,<br />not an afterthought.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#555] lg:text-right">
              Secrets never touch config files. Destructive ops require
              explicit approval. Every action is logged immutably. No single
              failure compromises the system.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px bg-[#1a1a1a] sm:grid-cols-2 lg:grid-cols-3">
            {securityItems.map((item) => (
              <SpotlightCard key={item.title} className="rounded-none border-0 bg-[#050505] p-7">
                <item.icon className="mb-4 h-4 w-4 text-[#333]" />
                <h3 className="mb-2 font-mono text-sm font-semibold">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#555]">{item.body}</p>
              </SpotlightCard>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/docs/security"
              className="group inline-flex items-center gap-2 font-mono text-xs text-[#444] transition-colors hover:text-white"
            >
              Read the security model
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLUGINS ──────────────────────────────────────────── */}
      <section className="border-t border-[#1a1a1a] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 grid items-end gap-8 lg:grid-cols-2">
            <div>
              <Label>Plugins</Label>
              <h2 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
                100+ plugins,<br />all maintained.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#555] lg:text-right">
              Every plugin is sandboxed and auditable. Drop{" "}
              <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-xs">.js</code>{" "}
              files into{" "}
              <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-xs">
                ~/.conductor/plugins/
              </code>{" "}
              to add your own.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#1a1a1a] sm:grid-cols-3 lg:grid-cols-4">
            {plugins.map((p) => (
              <SpotlightCard key={p.name} className="rounded-none border-0 bg-[#050505] p-5">
                <div className="flex items-start gap-3">
                  <p.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a2a2a]" />
                  <div>
                    <h3 className="font-mono text-xs font-semibold leading-tight">{p.name}</h3>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#444]">{p.description}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/marketplace"
              className="group inline-flex items-center gap-2 font-mono text-xs text-[#444] transition-colors hover:text-white"
            >
              Browse all plugins
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────────── */}
      <section className="border-t border-[#1a1a1a] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <Label>How it works</Label>
            <h2 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
              One server. Every client. Every tool.
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#060606]">
            <BorderBeam size={400} duration={20} />
            <div className="p-8 md:p-12">
              <div className="grid items-center gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2a2a2a]">
                    Your AI client
                  </p>
                  {["Claude Code", "Cursor", "Cline", "Aider", "+ 4 more"].map((c) => (
                    <div
                      key={c}
                      className="rounded-md border border-[#111] bg-[#080808] px-3 py-2 font-mono text-xs text-[#555]"
                    >
                      {c}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="hidden items-center gap-2 md:flex">
                    <div className="h-px w-8 bg-[#1a1a1a]" />
                    <span className="font-mono text-[9px] text-[#222]">config block</span>
                    <div className="h-px w-8 bg-[#1a1a1a]" />
                  </div>
                  <SpotlightCard className="w-full p-6 text-center">
                    <BorderBeam size={100} duration={8} />
                    <Terminal className="mx-auto mb-3 h-6 w-6 text-[#444]" />
                    <div className="font-mono text-sm font-bold">conductor</div>
                    <div className="mt-1 font-mono text-[10px] text-[#333]">MCP server</div>
                    <div className="mt-3 space-y-1">
                      {["security pipeline", "audit logging", "circuit breakers"].map((l) => (
                        <div key={l} className="rounded bg-[#0d0d0d] px-2 py-1 font-mono text-[9px] text-[#333]">
                          {l}
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>
                  <div className="hidden items-center gap-2 md:flex">
                    <div className="h-px w-8 bg-[#1a1a1a]" />
                    <span className="font-mono text-[9px] text-[#222]">plugins</span>
                    <div className="h-px w-8 bg-[#1a1a1a]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2a2a2a]">
                    Tools
                  </p>
                  {[
                    "filesystem · shell · git",
                    "database · web · email",
                    "cloud · webhooks · AI",
                    "docker · github · slack",
                    "+ 90 more",
                  ].map((t) => (
                    <div
                      key={t}
                      className="rounded-md border border-[#111] bg-[#080808] px-3 py-2 font-mono text-xs text-[#555]"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECOND SCROLL ────────────────────────────────────── */}
      <div className="border-t border-[#1a1a1a]">
        <ScrollVelocity
          text="FILESYSTEM — SHELL — GIT — DATABASE — WEBHOOKS — EMAIL — CLOUD — AI — DOCKER — GITHUB — "
          velocity={-1.5}
        />
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="border-t border-[#1a1a1a] px-6 py-36">
        <div className="mx-auto max-w-2xl text-center">
          <Label>Get started</Label>
          <h2 className="font-mono text-4xl font-bold tracking-tight md:text-6xl">
            The last tool setup
            <br />
            you&apos;ll ever do.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#555]">
            One command. One config block. Your AI agent gets 100+ tools —
            files, code, git, databases, and more.
          </p>
          <div className="mx-auto mt-10 max-w-sm text-left">
            <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#060606]">
              <BorderBeam size={150} duration={10} />
              <pre className="p-4 pr-12 font-mono text-sm text-[#777]">
                <code>npm install -g @useconductor/conductor</code>
              </pre>
              <CopyButton text="npm install -g @useconductor/conductor" />
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="group inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#e8e8e8]"
            >
              Quick Start Guide
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-md border border-[#222] px-6 py-3 text-sm text-[#666] transition-colors hover:border-[#444] hover:text-white"
            >
              <Package className="h-3.5 w-3.5" />
              Browse plugins
            </Link>
          </div>
          <p className="mt-8 font-mono text-xs text-[#222]">
            Open source · MIT License · No vendor lock-in
          </p>
        </div>
      </section>
    </div>
  );
}
