import Link from "next/link";
import {
  Terminal,
  ArrowRight,
  Download,
  Shield,
  Zap,
  CheckCircle,
  Package,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";

interface InstallMethod {
  title: string;
  description: string;
  command: string;
  icon: React.ElementType;
  recommended?: boolean;
}

const installMethods: InstallMethod[] = [
  {
    title: "npm",
    description: "Install globally via npm. Works on all platforms with Node.js 18+.",
    command: "npm install -g @thealxlabs/conductor",
    icon: Package,
    recommended: true,
  },
  {
    title: "npx",
    description: "Run without a global install. Useful for quick evaluation.",
    command: "npx @thealxlabs/conductor",
    icon: Zap,
  },
  {
    title: "Install script",
    description: "Standalone binary. No Node.js required.",
    command: "curl -fsSL https://conductor.dev/install.sh | sh",
    icon: Download,
  },
];

const requirements = [
  "Node.js 18 or later (for npm/npx installation)",
  "macOS, Linux, or Windows",
  "256 MB RAM minimum",
  "SQLite3 (bundled via sql.js — no system dependency needed)",
];

const verifyOutput = `conductor --version
# conductor 2.0.0

conductor doctor
# Checking system...
# Node.js: v20.11.0   ok
# SQLite: available   ok
# Config: ~/.conductor/config.json   ok
# Database: ~/.conductor/conductor.db   ok
# All systems operational.`;

export default function InstallPage() {
  return (
    <div className="min-h-screen px-6 pb-20 pt-24">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-14">
          <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
            Getting Started
          </p>
          <h1 className="font-mono text-4xl font-bold tracking-tight md:text-5xl">
            Install
          </h1>
          <p className="mt-4 text-[#666]">
            Get Conductor running on your machine in under a minute.
          </p>
        </div>

        <div className="space-y-12">
          {/* Requirements */}
          <section>
            <h2 className="mb-5 font-mono text-sm font-semibold uppercase tracking-widest text-[#555]">
              Requirements
            </h2>
            <ul className="space-y-3">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-3 text-sm text-[#777]">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#333]" />
                  {req}
                </li>
              ))}
            </ul>
          </section>

          {/* Installation methods */}
          <section>
            <h2 className="mb-5 font-mono text-sm font-semibold uppercase tracking-widest text-[#555]">
              Installation Methods
            </h2>
            <div className="space-y-3">
              {installMethods.map((method) => (
                <div
                  key={method.title}
                  className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]"
                >
                  <div className="flex items-center justify-between border-b border-[#1a1a1a] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <method.icon className="h-4 w-4 text-[#444]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-mono text-sm font-semibold">
                            {method.title}
                          </h3>
                          {method.recommended && (
                            <span className="rounded border border-[#222] px-1.5 py-0.5 font-mono text-[10px] text-[#555]">
                              recommended
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-[#555]">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <code className="font-mono text-sm text-[#aaa]">
                      {method.command}
                    </code>
                    <CopyButton text={method.command} className="shrink-0 ml-4" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform-specific */}
          <section>
            <h2 className="mb-5 font-mono text-sm font-semibold uppercase tracking-widest text-[#555]">
              Platform Guides
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  platform: "macOS",
                  detail: "Homebrew or npm",
                  extra: "brew install node && npm install -g @thealxlabs/conductor",
                },
                {
                  platform: "Linux",
                  detail: "apt / yum / npm",
                  extra: "curl -fsSL https://conductor.dev/install.sh | sh",
                },
                {
                  platform: "Windows",
                  detail: "npm or PowerShell",
                  extra: "npm install -g @thealxlabs/conductor",
                },
              ].map((p) => (
                <div
                  key={p.platform}
                  className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5"
                >
                  <Terminal className="mb-3 h-4 w-4 text-[#444]" />
                  <h3 className="font-mono text-sm font-semibold">{p.platform}</h3>
                  <p className="mt-1 text-xs text-[#555]">{p.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Verify */}
          <section>
            <h2 className="mb-5 font-mono text-sm font-semibold uppercase tracking-widest text-[#555]">
              Verify Installation
            </h2>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-[#1e1e1e]" />
                <span className="h-2 w-2 rounded-full bg-[#1e1e1e]" />
                <span className="h-2 w-2 rounded-full bg-[#1e1e1e]" />
                <span className="ml-3 font-mono text-[10px] text-[#3a3a3a]">
                  terminal
                </span>
              </div>
              <pre className="p-5 text-xs font-mono leading-relaxed text-[#777]">
                <code>{verifyOutput}</code>
              </pre>
            </div>
          </section>

          {/* Next steps */}
          <section>
            <h2 className="mb-5 font-mono text-sm font-semibold uppercase tracking-widest text-[#555]">
              Next Steps
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/quickstart"
                className="inline-flex items-center gap-2 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-2 text-sm text-[#777] transition-colors hover:border-[#333] hover:text-white"
              >
                Quick Start Guide
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/docs/mcp-server"
                className="inline-flex items-center gap-2 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-2 text-sm text-[#777] transition-colors hover:border-[#333] hover:text-white"
              >
                MCP Server Docs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/docs/plugins"
                className="inline-flex items-center gap-2 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-2 text-sm text-[#777] transition-colors hover:border-[#333] hover:text-white"
              >
                Plugin Catalog
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
