import Link from "next/link";
import { ArrowRight, Shield, Lock, FileCheck, Eye, Key } from "lucide-react";

export default function SecurityPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Security
        </h1>
        <p className="mt-3 text-[#888]">
          Encryption, approval gates, and audit logging.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Security Model
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-[#888]">
            Conductor is designed with a defense-in-depth approach. Every layer
            has security controls, and no single point of failure compromises
            the system.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <Lock className="mb-3 h-5 w-5 text-[#555]" />
              <h3 className="mb-2 font-mono text-sm font-semibold">
                AES-256-GCM Encryption
              </h3>
              <p className="text-xs leading-relaxed text-[#666]">
                Secrets are encrypted at rest using AES-256-GCM. The encryption
                key is derived from the machine ID and stored in the OS
                keychain.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <Shield className="mb-3 h-5 w-5 text-[#555]" />
              <h3 className="mb-2 font-mono text-sm font-semibold">
                Command Whitelisting
              </h3>
              <p className="text-xs leading-relaxed text-[#666]">
                The shell plugin uses a strict allowlist. No eval() or exec().
                Only explicitly permitted commands can be executed.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <FileCheck className="mb-3 h-5 w-5 text-[#555]" />
              <h3 className="mb-2 font-mono text-sm font-semibold">
                Approval Gates
              </h3>
              <p className="text-xs leading-relaxed text-[#666]">
                Dangerous tools set requiresApproval: true. The user must
                explicitly approve before execution proceeds.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <Eye className="mb-3 h-5 w-5 text-[#555]" />
              <h3 className="mb-2 font-mono text-sm font-semibold">
                Audit Logging
              </h3>
              <p className="text-xs leading-relaxed text-[#666]">
                SHA-256 chained append-only log at ~/.conductor/audit.log.
                Tamper-evident — any modification breaks the chain.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Secret Management
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#888]">
            Secrets (API keys, tokens, passwords) are never stored in
            config.json. Instead, they are:
          </p>
          <ol className="list-inside space-y-2 text-sm text-[#888]">
            <li className="flex items-start gap-2">
              <span className="mt-1 font-mono text-xs text-[#555]">1.</span>
              Marked with secret: true in the plugin configSchema
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 font-mono text-xs text-[#555]">2.</span>
              Encrypted with AES-256-GCM using a machine-bound key
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 font-mono text-xs text-[#555]">3.</span>
              Stored in the OS keychain (macOS Keychain, Windows Credential
              Manager, Linux libsecret)
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Circuit Breaker
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#888]">
            Each tool has an independent circuit breaker that opens after
            repeated failures, preventing cascading errors and resource
            exhaustion.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-xs font-mono text-[#ccc]">
              <code>{`// Circuit breaker states
CLOSED   → Normal operation, requests pass through
OPEN     → All requests fail fast (no execution)
HALF_OPEN → Testing if service recovered`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Rate Limiting
          </h2>
          <p className="text-sm leading-relaxed text-[#888]">
            All HTTP endpoints are protected by express-rate-limit. The
            dashboard and webhook endpoints have independent rate limit
            configurations.
          </p>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/webhooks"
          className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
        >
          Next: Webhooks
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
