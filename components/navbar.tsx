"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Github, Terminal } from "lucide-react";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/plugins", label: "Plugins" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/install", label: "Install" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const shouldHide = pathname.startsWith('/login') || pathname.startsWith('/auth') || pathname === '/';
  
  useEffect(() => {
    if (shouldHide) return;
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [shouldHide]);

  if (shouldHide) return null;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-[#1a1a1a] bg-[#050505]/90 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          <Terminal className="h-4 w-4 text-[#555]" />
          conductor
          <span className="ml-1 rounded border border-[#1a1a1a] px-1.5 py-0.5 font-mono text-[9px] text-[#444]">
            v2
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  active ? "text-white" : "text-[#666] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://github.com/useconductor/conductor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#555] transition-colors hover:text-white"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <div className="h-4 w-px bg-[#1a1a1a]" />
          <Link
            href="/login"
            className="rounded-md bg-white px-3.5 py-1.5 font-mono text-xs font-semibold text-black transition-colors hover:bg-[#e8e8e8]"
          >
            Sign In
          </Link>
        </div>

        <button
          className="text-[#666] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#1a1a1a] bg-[#050505] px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#777] transition-colors hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/useconductor/conductor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#777] transition-colors hover:text-white"
            >
              GitHub
            </a>
            <Link
              href="/login"
              className="mt-2 inline-block w-full rounded-md bg-white px-4 py-2.5 text-center font-mono text-sm font-semibold text-black"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}