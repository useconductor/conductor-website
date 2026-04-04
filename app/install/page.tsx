import {
  Terminal,
  Copy,
  Check,
  ArrowRight,
  Download,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

const installMethods = [
  {
    title: "npm (recommended)",
    description:
      "Install globally via npm. Works on all platforms with Node.js 18+.",
    command: "npm install -g @thealxlabs/conductor",
    icon: Terminal,
  },
  {
    title: "npx (no install)",
    description: "Run without installing. Useful for trying Conductor quickly.",
    command: "npx @thealxlabs/conductor",
    icon: Zap,
  },
  {
    title: "Install script",
    description: "Standalone binary installation. No Node.js required.",
    command: "curl -fsSL https://conductor.dev/install.sh | sh",
    icon: Download,
  },
];

const requirements = [
  "Node.js 18 or later (for npm/npx installation)",
  "macOS, Linux, or Windows",
  "At least 256MB RAM",
  "SQLite3 (bundled with sql.js, no system dependency)",
];

export default function InstallPage() {
  return (
    <div className="min-h-screen px-6 pt-24 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
            Getting Started
          </p>
          <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
            Install
          </h1>
          <p className="mt-3 text-[#888]">
            Get Conductor running on your machine.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 font-mono text-xl font-semibold">
              Requirements
            </h2>
            <ul className="space-y-2">
              {requirements.map((req) => (
                <li
                  key={req}
                  className="flex items-start gap-2 text-sm text-[#888]"
                >
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#555]" />
                  {req}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xl font-semibold">
              Installation Methods
            </h2>
            <div className="space-y-4">
              {installMethods.map((method) => (
                <div
                  key={method.title}
                  className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]"
                >
                  <div className="border-b border-[#1a1a1a] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <method.icon className="h-5 w-5 text-[#555]" />
                      <div>
                        <h3 className="font-mono text-sm font-semibold">
                          {method.title}
                        </h3>
                        <p className="text-xs text-[#666]">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <code className="text-sm font-mono text-[#ccc]">
                      {method.command}
                    </code>
                    <button className="shrink-0 rounded border border-[#222] bg-[#111] p-2 text-[#888] transition-colors hover:text-white">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xl font-semibold">
              Verify Installation
            </h2>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
              <pre className="p-4 text-sm font-mono text-[#ccc]">
                <code>{`conductor --version
# conductor 2.0.0

conductor doctor
# Checking system...
# Node.js: v20.11.0 ✓
# SQLite: available ✓
# Config: ~/.conductor/config.json ✓
# Database: ~/.conductor/conductor.db ✓
# All systems operational.`}</code>
              </pre>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xl font-semibold">Next Steps</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/quickstart"
                className="inline-flex items-center gap-2 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2 text-sm text-[#888] transition-colors hover:text-white"
              >
                Quick Start Guide
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/docs/mcp-server"
                className="inline-flex items-center gap-2 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2 text-sm text-[#888] transition-colors hover:text-white"
              >
                MCP Server Docs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
