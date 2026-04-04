"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Github } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight text-white"
        >
          conductor
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/docs"
            className="text-sm text-[#888] transition-colors hover:text-white"
          >
            Docs
          </Link>
          <Link
            href="/marketplace"
            className="text-sm text-[#888] transition-colors hover:text-white"
          >
            Marketplace
          </Link>
          <Link
            href="/install"
            className="text-sm text-[#888] transition-colors hover:text-white"
          >
            Install
          </Link>
          <a
            href="https://github.com/conductor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888] transition-colors hover:text-white"
          >
            <Github className="h-4 w-4" />
          </a>
          <Link
            href="/docs/quickstart"
            className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-[#e0e0e0]"
          >
            Get Started
          </Link>
        </nav>

        <button
          className="md:hidden text-[#888]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#1a1a1a] bg-[#050505] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/docs"
              className="text-sm text-[#888] transition-colors hover:text-white"
              onClick={() => setOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/marketplace"
              className="text-sm text-[#888] transition-colors hover:text-white"
              onClick={() => setOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/install"
              className="text-sm text-[#888] transition-colors hover:text-white"
              onClick={() => setOpen(false)}
            >
              Install
            </Link>
            <a
              href="https://github.com/conductor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#888] transition-colors hover:text-white"
            >
              GitHub
            </a>
            <Link
              href="/docs/quickstart"
              className="mt-2 inline-block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-medium text-black"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
