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
    ],
  },
  {
    section: "Core",
    links: [
      { href: "/docs/mcp-server", label: "MCP Server" },
      { href: "/docs/plugins", label: "Plugin System" },
      { href: "/docs/zero-config", label: "Zero-Config Plugins" },
      { href: "/docs/security", label: "Security" },
      { href: "/docs/webhooks", label: "Webhooks" },
    ],
  },
  {
    section: "Reference",
    links: [
      { href: "/docs/cli", label: "CLI Reference" },
      { href: "/docs/mcp-compatibility", label: "MCP Compatibility" },
      { href: "/docs/api-reference", label: "API Reference" },
      { href: "/docs/sdks", label: "SDKs" },
    ],
  },
  {
    section: "Resources",
    links: [
      { href: "/docs/guides", label: "Guides" },
      { href: "/docs/faq", label: "FAQ" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="sticky top-14 hidden w-56 shrink-0 border-r border-[#1a1a1a] px-6 py-8 md:block"
      style={{ height: "calc(100vh - 3.5rem)" }}
    >
      <nav className="space-y-6">
        {docsNav.map((group) => (
          <div key={group.section}>
            <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#555]">
              {group.section}
            </p>
            <ul className="space-y-1">
              {group.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-[#111] font-medium text-white"
                          : "text-[#888] hover:text-white"
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
