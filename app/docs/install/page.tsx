import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function DocsInstallPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Getting Started
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Installation
        </h1>
        <p className="mt-3 text-[#888]">
          Detailed installation instructions for all platforms.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Prerequisites
          </h2>
          <ul className="space-y-2 text-sm text-[#888]">
            <li>Node.js 18+ or a standalone binary</li>
            <li>macOS 12+, Ubuntu 20+, Debian 11+, or Windows 10+</li>
            <li>256MB RAM minimum, 512MB recommended</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            npm Installation
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-sm font-mono text-[#ccc]">
              <code>npm install -g @thealxlabs/conductor</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Standalone Binary
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-sm font-mono text-[#ccc]">
              <code>{`# macOS / Linux
curl -fsSL https://conductor.dev/install.sh | sh

# Windows (PowerShell)
irm https://conductor.dev/install.ps1 | iex`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Post-Install</h2>
          <p className="mb-4 text-sm text-[#888]">
            After installation, run{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 text-xs">
              conductor doctor
            </code>{" "}
            to verify everything is working correctly.
          </p>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/quickstart"
          className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
        >
          Next: Quick Start
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
