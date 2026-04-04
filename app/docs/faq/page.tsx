"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is Conductor?",
    a: "Conductor is an MCP (Model Context Protocol) server that exposes a plugin system as tools to AI agents. It gives any MCP-compatible AI client access to 100+ tools including file system operations, shell execution, git, databases, webhooks, and more.",
  },
  {
    q: "Which AI clients are supported?",
    a: "Any MCP-compatible client works with Conductor. This includes Claude Code, Cursor, Cline, Aider, Windsurf, Continue, Roo Code, GitHub Copilot, and any other client that supports the MCP protocol.",
  },
  {
    q: "Is Conductor secure?",
    a: "Yes. Conductor uses AES-256-GCM encryption for secrets, command whitelisting for shell operations, approval gates for dangerous tools, circuit breakers for fault tolerance, and SHA-256 chained audit logging for tamper-evident records.",
  },
  {
    q: "Where is my data stored?",
    a: "All state lives under ~/.conductor/: config.json for settings, conductor.db (SQLite) for conversation history, audit.log for tamper-evident audit records, and plugins/ for external plugin files. Secrets are stored in the OS keychain.",
  },
  {
    q: "How do I write a custom plugin?",
    a: "Create a .js file that exports a default class implementing the Plugin interface. Drop it into ~/.conductor/plugins/ and enable it with conductor plugins enable <name>. See the Plugins documentation for the full interface specification.",
  },
  {
    q: "Can I run Conductor on a remote server?",
    a: "Yes. Start Conductor with HTTP transport (conductor mcp start --transport http) and configure your AI clients to connect to the remote endpoint. The dashboard and webhook endpoints also work over HTTP.",
  },
  {
    q: "What happens when a tool fails?",
    a: "Each tool has an independent circuit breaker. After repeated failures, the circuit opens and requests fail fast. Conductor also retries with exponential backoff before opening the circuit. All failures are logged to the audit log.",
  },
  {
    q: "Is Conductor open source?",
    a: "Yes. The core Conductor project is open source and available on GitHub. External plugins can be shared through the marketplace.",
  },
  {
    q: "How do webhooks work?",
    a: "Conductor supports both incoming and outgoing webhooks. Incoming webhooks let external systems trigger actions. Outgoing webhooks send events (tool calls, plugin changes, system alerts) to external URLs with retry logic and signature verification.",
  },
  {
    q: "Can I use Conductor with Ollama or local models?",
    a: "Yes. The AI Manager plugin supports multiple providers including Claude, OpenAI, Gemini, and Ollama. Configure your preferred provider with conductor config setup ai-manager.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#1a1a1a]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-mono text-sm font-medium">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[#555]" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[#555]" />
        )}
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-[#888]">{answer}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Resources
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          FAQ
        </h1>
        <p className="mt-3 text-[#888]">
          Frequently asked questions about Conductor.
        </p>
      </div>

      <div>
        {faqs.map((faq) => (
          <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </div>
  );
}
