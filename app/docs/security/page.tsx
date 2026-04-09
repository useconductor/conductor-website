import Link from "next/link";
import { ArrowRight, Shield, Lock, FileCheck, Eye, AlertTriangle, Key, Server, Database } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const securityCards = [
  {
    icon: Lock,
    title: "AES-256-GCM Encryption",
    description:
      "Secrets are encrypted at rest using AES-256-GCM. Stored in an encrypted local credential store — never in config files.",
  },
  {
    icon: Server,
    title: "Zero-Knowledge Cloud",
    description:
      "Credentials are encrypted on your device before upload. We never see your plaintext keys — only encrypted blobs.",
  },
  {
    icon: Shield,
    title: "Command Allowlisting",
    description:
      "The shell plugin enforces a strict allowlist. Only explicitly permitted commands can be executed — no wildcards.",
  },
  {
    icon: FileCheck,
    title: "Approval Gates",
    description:
      "Dangerous tools set requiresApproval: true. Execution halts until the user explicitly approves via the terminal or dashboard.",
  },
  {
    icon: Eye,
    title: "Audit Logging",
    description:
      "SHA-256 chained append-only log at ~/.conductor/audit.log. Any modification breaks the chain, making tampering detectable.",
  },
  {
    icon: AlertTriangle,
    title: "Circuit Breakers",
    description:
      "Each tool has an independent circuit breaker. After repeated failures the circuit opens, preventing cascading errors.",
  },
  {
    icon: Key,
    title: "Encrypted Credential Store",
    description:
      "Secrets are stored in an encrypted local credential store (AES-256-GCM). Never written to config.json or any plain-text file.",
  },
  {
    icon: Database,
    title: "Self-Host Option",
    description:
      "Run your own Conductor Cloud. Full data sovereignty — your credentials never leave your infrastructure.",
  },
];

const circuitStates = `// Circuit breaker states
CLOSED    → Normal operation, requests pass through
OPEN      → All requests fail fast (circuit tripped)
HALF_OPEN → Testing whether the service has recovered`;

const allowlistConfig = `// ~/.conductor/config.json
{
  "plugins": {
    "shell": {
      "allowedCommands": [
        "ls", "cat", "echo", "pwd", "git", "npm", "node"
      ],
      "requireApproval": ["rm", "mv", "cp", "chmod"]
    }
  }
}`;

const auditEntry = `{
  "id": "evt_01HXYZ",
  "timestamp": "2026-01-15T10:23:45.123Z",
  "tool": "filesystem.write",
  "input": { "path": "/home/user/app/index.ts" },
  "result": "success",
  "hash": "sha256:a3f9b2...",
  "prevHash": "sha256:4c8d1e..."
}`;

export default function SecurityPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Security
        </h1>
        <p className="mt-3 text-[#666]">
          Defense-in-depth: encryption, approval gates, audit logging, and
          circuit breakers.
        </p>
      </div>

      <div className="space-y-12">
        {/* Security model overview */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Security Model
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-[#666]">
            Conductor is designed with defense-in-depth. Every layer has
            independent security controls — no single failure compromises the
            system. Secrets never touch config files. Dangerous operations
            require explicit approval. Every action is logged immutably.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {securityCards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5"
              >
                <card.icon className="mb-3 h-5 w-5 text-[#444]" />
                <h3 className="mb-2 font-mono text-sm font-semibold">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#555]">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Secret management */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Secret Management
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Secrets (API keys, tokens, passwords) are never stored in{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              config.json
            </code>
            . The flow:
          </p>
          <ol className="space-y-3">
            {[
              "Plugin configSchema marks the field with secret: true",
              "conductor config setup prompts for the value",
              "Value is encrypted with AES-256-GCM using a machine-bound key",
              "Encrypted value is stored in the encrypted local credential store",
              "At runtime, Conductor decrypts on demand — never written to disk",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#666]">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-[#2a2a2a]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Shell allowlist */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Shell Allowlist
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            The shell plugin uses a strict allowlist — no wildcard permissions.
            Configure allowed and approval-required commands in your config:
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">
                ~/.conductor/config.json
              </span>
              <CopyButton text={allowlistConfig} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{allowlistConfig}</code>
            </pre>
          </div>
        </section>

        {/* Circuit breaker */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Circuit Breaker
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Each tool has an independent circuit breaker. After 5 consecutive
            failures the circuit opens. All requests fail immediately until the
            half-open probe succeeds.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{circuitStates}</code>
            </pre>
          </div>
        </section>

        {/* Audit log */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Audit Log</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Every tool call is appended to{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              ~/.conductor/audit.log
            </code>
            . Each entry includes a SHA-256 hash of the previous entry —
            forming a chain that makes any tampering detectable.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{auditEntry}</code>
            </pre>
          </div>
          <p className="mt-3 text-xs text-[#444]">
            View the audit log with{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              conductor audit list
            </code>{" "}
            or query it via the HTTP API at{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              GET /audit
            </code>
            .
          </p>
        </section>

        {/* Rate limiting */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Rate Limiting
          </h2>
          <p className="text-sm leading-relaxed text-[#666]">
            When running with HTTP transport, all endpoints are protected by
            configurable rate limits using express-rate-limit. The dashboard,
            webhook, and tool endpoints have independent limits. Defaults are
            100 requests per minute per IP.
          </p>
        </section>

        {/* Zero-Knowledge Cloud Sync */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Zero-Knowledge Cloud Sync
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Conductor Cloud uses a zero-knowledge architecture for credential sync:
          </p>
          <ol className="space-y-3 mb-6">
            {[
              "You set an encryption password in the dashboard or CLI",
              "Your credentials are encrypted locally using AES-256-GCM with PBKDF2 key derivation",
              "Only the encrypted blob (ciphertext, IV, salt) is uploaded to the cloud",
              "On other devices, you enter your password to decrypt credentials locally",
              "We never see your plaintext API keys — ever",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#666]">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-[#2a2a2a]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="rounded-lg border border-green-900/30 bg-green-900/10 p-4">
            <p className="text-sm text-green-400">
              <strong>Important:</strong> If you forget your encryption password, your credentials cannot be recovered. 
              There is no password reset because we never store the plaintext.
            </p>
          </div>
          <p className="mt-4 text-sm text-[#666]">
            Self-hosting option available — see{" "}
            <Link href="/docs/cloud" className="text-white hover:underline">
              Self-Hosting Guide
            </Link>{" "}
            to run your own cloud server.
          </p>
        </section>
      </div>

      {/* Next */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/webhooks"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Next: Webhooks
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
