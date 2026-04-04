import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#050505]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/install"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  Installation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/docs/guides"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/faq"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/sdks"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  SDKs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              Developers
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/docs/api-reference"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/plugins"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  Plugin System
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/security"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              Connect
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://github.com/conductor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/conductor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/conductor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  X / Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1a1a1a] pt-8 md:flex-row">
          <p className="text-xs text-[#555]">
            &copy; 2026 Conductor. All rights reserved.
          </p>
          <p className="text-xs text-[#555]">Built by TheAlxLabs</p>
        </div>
      </div>
    </footer>
  );
}
