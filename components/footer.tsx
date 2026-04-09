import Link from "next/link";
import { Terminal, Github } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Installation", href: "/install" },
      { label: "Quick Start", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "MCP Server", href: "/docs/mcp-server" },
      { label: "Plugins", href: "/docs/plugins" },
      { label: "Security", href: "/docs/security" },
      { label: "Webhooks", href: "/docs/webhooks" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "API Reference", href: "/docs/api-reference" },
      { label: "SDKs", href: "/docs/sdks" },
      { label: "Guides", href: "/docs/guides" },
      { label: "FAQ", href: "/docs/faq" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/useconductor/conductor",
        external: true,
      },
      {
        label: "Discord",
        href: "https://discord.gg/9AMpVkk5yv",
        external: true,
      },
      {
        label: "X / Twitter",
        href: "https://twitter.com/conductormcp",
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#050505]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Top: logo + cols */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-sm font-bold text-white"
            >
              <Terminal className="h-4 w-4 text-[#444]" />
              conductor
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-[#444]">
              The AI Tool Hub. One MCP server. Every tool.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/useconductor/conductor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#333] transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[#333]">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#555] transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[#555] transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#0f0f0f] pt-8 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-xs text-[#333]">
              &copy; 2026 Conductor
            </p>
            <span className="text-[#1a1a1a]">/</span>
            <p className="font-mono text-xs text-[#333]">Apache-2.0 License</p>
            <span className="text-[#1a1a1a]">/</span>
            <p className="font-mono text-xs text-[#333]">Built by TheAlxLabs</p>
            <span className="text-[#1a1a1a]">/</span>
            <Link href="/terms" className="font-mono text-xs text-[#333] hover:text-white">Terms</Link>
            <span className="text-[#1a1a1a]">/</span>
            <Link href="/privacy" className="font-mono text-xs text-[#333] hover:text-white">Privacy</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-[#111] px-2.5 py-1 font-mono text-[10px] text-[#333]">
              MCP v1.0 compatible
            </span>
            <span className="rounded-full border border-[#111] px-2.5 py-1 font-mono text-[10px] text-[#333]">
              Node.js 18+
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
