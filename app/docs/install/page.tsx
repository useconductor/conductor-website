import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const installCmds = {
  npm: "npm install -g @thealxlabs/conductor",
  npx: "npx @thealxlabs/conductor",
  macLinux: "curl -fsSL https://conductor.dev/install.sh | sh",
  windows: "irm https://conductor.dev/install.ps1 | iex",
};

const verifyCmd = "conductor doctor";

export default function DocsInstallPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Getting Started
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Installation
        </h1>
        <p className="mt-3 text-[#666]">
          Detailed installation instructions for all platforms.
        </p>
      </div>

      <div className="space-y-12">
        {/* Prerequisites */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Prerequisites
          </h2>
          <ul className="space-y-2">
            {[
              "Node.js 18+ (for npm/npx installation)",
              "macOS 12+, Ubuntu 20.04+, Debian 11+, or Windows 10+",
              "256 MB RAM minimum, 512 MB recommended",
              "SQLite3 is bundled — no system dependency needed",
            ].map((req) => (
              <li key={req} className="flex items-start gap-3 text-sm text-[#666]">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#333]" />
                {req}
              </li>
            ))}
          </ul>
        </section>

        {/* npm */}
        <section>
          <h2 className="mb-3 font-mono text-xl font-semibold">
            npm{" "}
            <span className="ml-2 rounded border border-[#1a1a1a] px-1.5 py-0.5 font-mono text-xs text-[#444]">
              recommended
            </span>
          </h2>
          <p className="mb-3 text-sm text-[#666]">
            Installs a global{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              conductor
            </code>{" "}
            binary. Requires Node.js 18+.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
              <code>{installCmds.npm}</code>
            </pre>
            <CopyButton text={installCmds.npm} className="absolute right-3 top-2.5" />
          </div>
        </section>

        {/* npx */}
        <section>
          <h2 className="mb-3 font-mono text-xl font-semibold">npx</h2>
          <p className="mb-3 text-sm text-[#666]">
            Run without installing. Fetches the latest version each time.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
              <code>{installCmds.npx}</code>
            </pre>
            <CopyButton text={installCmds.npx} className="absolute right-3 top-2.5" />
          </div>
        </section>

        {/* Standalone binary */}
        <section>
          <h2 className="mb-3 font-mono text-xl font-semibold">
            Standalone Binary
          </h2>
          <p className="mb-3 text-sm text-[#666]">
            No Node.js required. The install script detects your platform
            automatically.
          </p>
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-mono text-[#444]">
                macOS / Linux
              </p>
              <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
                  <code>{installCmds.macLinux}</code>
                </pre>
                <CopyButton text={installCmds.macLinux} className="absolute right-3 top-2.5" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-mono text-[#444]">
                Windows (PowerShell)
              </p>
              <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
                  <code>{installCmds.windows}</code>
                </pre>
                <CopyButton text={installCmds.windows} className="absolute right-3 top-2.5" />
              </div>
            </div>
          </div>
        </section>

        {/* Post-install */}
        <section>
          <h2 className="mb-3 font-mono text-xl font-semibold">
            Verify Installation
          </h2>
          <p className="mb-3 text-sm text-[#666]">
            Run{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              conductor doctor
            </code>{" "}
            to verify everything is working.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#777]">
              <code>{`$ conductor doctor
Checking system...
Node.js: v20.11.0   ok
SQLite: available   ok
Config: ~/.conductor/config.json   ok
Database: ~/.conductor/conductor.db   ok
All systems operational.`}</code>
            </pre>
          </div>
        </section>

        {/* Updating */}
        <section>
          <h2 className="mb-3 font-mono text-xl font-semibold">Updating</h2>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <pre className="p-4 pr-12 font-mono text-sm text-[#aaa]">
              <code>npm update -g @thealxlabs/conductor</code>
            </pre>
            <CopyButton
              text="npm update -g @thealxlabs/conductor"
              className="absolute right-3 top-2.5"
            />
          </div>
        </section>
      </div>

      {/* Next */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/quickstart"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Next: Quick Start
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
