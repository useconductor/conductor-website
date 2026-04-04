"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is Conductor?",
        a: "Conductor is a Model Context Protocol (MCP) server that exposes a plugin system as tools to AI agents. It gives any MCP-compatible AI client access to 100+ tools — file system operations, shell execution, git, databases, webhooks, and more — through a single config block.",
      },
      {
        q: "What makes Conductor different from using individual MCP servers?",
        a: "Instead of configuring a separate MCP server for each tool (one for filesystem, one for git, one for databases...), Conductor provides them all through a single connection. One config line. One process. One audit log. One security model. Adding a new capability means enabling a plugin, not adding a new server entry.",
      },
      {
        q: "Is Conductor open source?",
        a: "Yes. The core Conductor project is open source under the MIT license and available on GitHub. External plugins can be shared through the marketplace.",
      },
      {
        q: "Which AI clients are supported?",
        a: "Any MCP-compatible client works with Conductor. This includes Claude Code (CLI), Claude Desktop, Cursor, Cline, Aider, Windsurf, Continue, Roo Code, GitHub Copilot, and any other client that supports the MCP protocol.",
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        q: "Is Conductor secure?",
        a: "Yes. Conductor uses AES-256-GCM encryption for secrets, strict command allowlisting for shell operations, user approval gates for dangerous tools, circuit breakers for fault tolerance, and SHA-256 chained audit logging for tamper-evident records. Secrets are stored in the OS keychain — never in config files.",
      },
      {
        q: "Where are my API keys and secrets stored?",
        a: "Secrets are stored in the OS keychain: macOS Keychain, Windows Credential Manager, or Linux libsecret (via libsecret / gnome-keyring). They are encrypted with AES-256-GCM before storage. They are never written to config.json or any plain-text file.",
      },
      {
        q: "Can the AI run any shell command it wants?",
        a: "No. The shell plugin uses a strict command allowlist. Only explicitly permitted commands can be executed. You configure the allowlist in config.json. Commands not on the list are rejected. Dangerous commands can be placed on an approval list, requiring user confirmation before execution.",
      },
      {
        q: "What happens if a tool fails repeatedly?",
        a: "Each tool has an independent circuit breaker. After 5 consecutive failures, the circuit opens and requests fail immediately (fail-fast). After a cooldown period, the circuit moves to half-open and tests whether the service has recovered. All failures are logged to the audit log.",
      },
    ],
  },
  {
    category: "Configuration & Plugins",
    items: [
      {
        q: "Where is all the data stored?",
        a: "All state lives under ~/.conductor/: config.json for settings, conductor.db (SQLite) for conversation history and metrics, audit.log for tamper-evident audit records, and plugins/ for external plugin files. You can override the directory with the CONDUCTOR_CONFIG_DIR environment variable.",
      },
      {
        q: "How do I write a custom plugin?",
        a: "Create a .js file that exports a default class implementing the Plugin interface (name, description, version, initialize(), isConfigured(), getTools()). Drop it into ~/.conductor/plugins/ and enable it with conductor plugins enable <name>. See the Plugins documentation for the full interface specification.",
      },
      {
        q: "How do I add a new plugin from the marketplace?",
        a: "Run conductor plugins install @community/<plugin-name>. For built-in plugins, use conductor plugins enable <name>. Configure credentials with conductor config setup <plugin-name>.",
      },
      {
        q: "Can I disable tools I don't want?",
        a: "Yes. You can disable entire plugins with conductor plugins disable <name>, or configure individual tools within a plugin using the plugin's configSchema. The shell plugin lets you configure the exact command allowlist and approval list.",
      },
    ],
  },
  {
    category: "Deployment & Scale",
    items: [
      {
        q: "Can I run Conductor on a remote server?",
        a: "Yes. Start with HTTP transport (conductor mcp start --transport http) and configure your AI clients to connect to the remote SSE endpoint. Use a reverse proxy with TLS for production deployments.",
      },
      {
        q: "Can multiple AI clients share one Conductor instance?",
        a: "Yes. When running with HTTP transport, multiple clients can connect to the same Conductor server simultaneously. Each connection is isolated at the session level.",
      },
      {
        q: "Can I use Conductor with Ollama or local models?",
        a: "Yes. The AI Manager plugin supports multiple providers including Claude, OpenAI, Gemini, and Ollama. Configure your preferred provider with conductor config setup ai-manager. Any model that supports tool calls works.",
      },
      {
        q: "How do webhooks work?",
        a: "Conductor supports both incoming and outgoing webhooks. Incoming webhooks let external systems (GitHub, CI, etc.) trigger tool executions. Outgoing webhooks send events (tool calls, plugin changes, system alerts) to external URLs with HMAC-SHA256 signing and exponential backoff retry logic.",
      },
    ],
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#0f0f0f]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between py-5 text-left"
      >
        <span className="pr-8 font-mono text-sm font-medium leading-relaxed">
          {question}
        </span>
        <span className="mt-0.5 shrink-0 text-[#444]">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-[#666]">{answer}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Resources
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          FAQ
        </h1>
        <p className="mt-3 text-[#666]">
          Frequently asked questions about Conductor.
        </p>
      </div>

      <div className="space-y-10">
        {faqs.map((group) => (
          <section key={group.category}>
            <h2 className="mb-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#333]">
              {group.category}
            </h2>
            <div className="border-t border-[#1a1a1a]">
              {group.items.map((faq) => (
                <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
