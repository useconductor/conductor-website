"use client";

import { useState } from "react";
import {
  Search,
  Star,
  Download,
  Terminal,
  Shield,
  Zap,
  Globe,
  Database,
  Code2,
  FileText,
  Settings,
  Webhook,
  Mail,
  Cloud,
  Lock,
  GitBranch,
  MessageSquare,
  Box,
  Key,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { CopyButton } from "@/components/copy-button";

interface Plugin {
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  downloads: string;
  rating: number;
  official: boolean;
  installCmd: string;
}

const allPlugins: Plugin[] = [
  {
    name: "File System",
    description: "Read, write, search, and manage files and directories with full path control.",
    icon: FileText,
    category: "core",
    downloads: "125k",
    rating: 4.9,
    official: true,
    installCmd: "conductor plugins enable filesystem",
  },
  {
    name: "Shell",
    description: "Execute commands with configurable allowlists and approval gates.",
    icon: Terminal,
    category: "core",
    downloads: "118k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins enable shell",
  },
  {
    name: "Git",
    description: "Full git operations including commit, push, branch, merge, and log.",
    icon: GitBranch,
    category: "core",
    downloads: "102k",
    rating: 4.9,
    official: true,
    installCmd: "conductor plugins enable git",
  },
  {
    name: "Web Fetch",
    description: "Fetch URLs, parse HTML, extract structured data, and handle redirects.",
    icon: Globe,
    category: "network",
    downloads: "89k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins enable web",
  },
  {
    name: "Database",
    description: "Query SQLite, PostgreSQL, MySQL, and MongoDB with schema introspection.",
    icon: Database,
    category: "data",
    downloads: "76k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins enable database",
  },
  {
    name: "Code Executor",
    description: "Run Python, JavaScript, TypeScript, Bash, and more in isolated sandboxes.",
    icon: Code2,
    category: "core",
    downloads: "71k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins enable executor",
  },
  {
    name: "Email",
    description: "Send and receive emails via SMTP and IMAP. Supports attachments and HTML.",
    icon: Mail,
    category: "communication",
    downloads: "45k",
    rating: 4.5,
    official: true,
    installCmd: "conductor plugins enable email",
  },
  {
    name: "Cloud",
    description: "AWS, GCP, and Azure cloud service integrations with credential management.",
    icon: Cloud,
    category: "cloud",
    downloads: "38k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins enable cloud",
  },
  {
    name: "Security",
    description: "Keychain management, AES-256 encryption, and secret storage utilities.",
    icon: Lock,
    category: "security",
    downloads: "52k",
    rating: 4.9,
    official: true,
    installCmd: "conductor plugins enable security",
  },
  {
    name: "Webhooks",
    description: "Incoming and outgoing webhook handlers with retry logic and HMAC signing.",
    icon: Webhook,
    category: "network",
    downloads: "41k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins enable webhooks",
  },
  {
    name: "Config Manager",
    description: "Configuration management with JSON schema validation and secret fields.",
    icon: Settings,
    category: "core",
    downloads: "95k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins enable config",
  },
  {
    name: "AI Manager",
    description: "Multi-provider AI: Claude, OpenAI, Gemini, and Ollama with routing.",
    icon: Zap,
    category: "ai",
    downloads: "130k",
    rating: 4.9,
    official: true,
    installCmd: "conductor plugins enable ai-manager",
  },
  {
    name: "Docker",
    description: "Container management, image builds, and Docker Compose operations.",
    icon: Box,
    category: "cloud",
    downloads: "34k",
    rating: 4.5,
    official: false,
    installCmd: "conductor plugins install @community/docker",
  },
  {
    name: "GitHub",
    description: "PR management, issue tracking, code review, and repository operations.",
    icon: GitBranch,
    category: "cloud",
    downloads: "47k",
    rating: 4.8,
    official: false,
    installCmd: "conductor plugins install @community/github",
  },
  {
    name: "Slack",
    description: "Send messages, read channels, manage threads, and handle Slack events.",
    icon: MessageSquare,
    category: "communication",
    downloads: "28k",
    rating: 4.6,
    official: false,
    installCmd: "conductor plugins install @community/slack",
  },
  {
    name: "Keychain",
    description: "Direct OS keychain access for macOS, Windows, and Linux credential stores.",
    icon: Key,
    category: "security",
    downloads: "21k",
    rating: 4.4,
    official: false,
    installCmd: "conductor plugins install @community/keychain",
  },
];

const categories = [
  "all",
  "core",
  "network",
  "data",
  "cloud",
  "ai",
  "security",
  "communication",
];

function PluginCard({ plugin }: { plugin: Plugin }) {
  return (
    <SpotlightCard className="group flex flex-col p-5">
      <div className="flex items-start gap-3">
        <plugin.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#444]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-sm font-semibold">{plugin.name}</h3>
            {plugin.official && (
              <span className="rounded border border-[#1a1a1a] px-1.5 py-0.5 font-mono text-[9px] text-[#444]">
                official
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#555]">
            {plugin.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#111] pt-3">
        <div className="flex items-center gap-4 text-xs text-[#444]">
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {plugin.downloads}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {plugin.rating}
          </span>
        </div>
        <CopyButton
          text={plugin.installCmd}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </SpotlightCard>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = allPlugins.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen px-6 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
            Marketplace
          </p>
          <h1 className="font-mono text-4xl font-bold tracking-tight md:text-5xl">
            Plugin Marketplace
          </h1>
          <p className="mt-4 text-[#666]">
            Browse and install plugins to extend Conductor&apos;s capabilities.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Search plugins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#1a1a1a] bg-[#080808] py-2.5 pl-9 pr-4 font-mono text-sm text-white placeholder-[#444] outline-none focus:border-[#333]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                  category === cat
                    ? "border-white bg-white text-black"
                    : "border-[#1a1a1a] bg-transparent text-[#666] hover:border-[#333] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="mb-5 font-mono text-xs text-[#3a3a3a]">
          {filtered.length} plugin{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((plugin) => (
              <PluginCard key={plugin.name} plugin={plugin} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-mono text-sm text-[#333]">
              No plugins match &quot;{search}&quot;
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="mt-3 font-mono text-xs text-[#555] transition-colors hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
