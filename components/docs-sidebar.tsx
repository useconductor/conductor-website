"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const docsNav = [
  {
    section: "Getting Started",
    links: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/quickstart", label: "Quick Start" },
      { href: "/docs/install", label: "Installation" },
      { href: "/docs/concepts", label: "How it works" },
    ],
  },
  {
    section: "Core",
    links: [
      { href: "/docs/mcp-server", label: "Configuration" },
      { href: "/docs/transport", label: "Transport modes" },
      { href: "/docs/plugins", label: "Plugin system" },
      { href: "/docs/zero-config", label: "Zero-config plugins" },
      { href: "/docs/security", label: "Security" },
      { href: "/docs/audit-logs", label: "Audit logs" },
      { href: "/docs/circuit-breakers", label: "Circuit breakers" },
      { href: "/docs/webhooks", label: "Webhooks" },
    ],
  },
  {
    section: "Deployment",
    links: [
      { href: "/docs/deployment", label: "Deployment guide" },
      { href: "/docs/ci-cd", label: "CI/CD" },
    ],
  },
  {
    section: "Guides",
    links: [
      { href: "/docs/custom-plugins", label: "Writing plugins" },
      { href: "/docs/guides", label: "More guides" },
    ],
  },
  {
    section: "Reference",
    links: [
      { href: "/docs/cli", label: "CLI reference" },
      { href: "/docs/api-reference", label: "API reference" },
      { href: "/docs/sdks", label: "SDKs" },
      { href: "/docs/mcp-compatibility", label: "MCP compatibility" },
    ],
  },
  {
    section: "Resources",
    links: [
      { href: "/docs/faq", label: "FAQ" },
      { href: "/docs/troubleshooting", label: "Troubleshooting" },
      { href: "/docs/changelog", label: "Changelog" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="sticky top-14 hidden w-56 shrink-0 overflow-y-auto border-r border-[#1a1a1a] px-6 py-8 md:block"
      style={{ height: "calc(100vh - 3.5rem)" }}
    >
      <nav className="space-y-6">
        {docsNav.map((group) => (
          <div key={group.section}>
            <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#333]">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-[#111] font-medium text-white"
                          : "text-[#666] hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
