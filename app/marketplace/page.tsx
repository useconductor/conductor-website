"use client";

import { useState } from "react";
import {
  Search,
  Plug,
  Star,
  Download,
  ArrowRight,
  Filter,
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
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BorderBeam } from "@/components/ui/border-beam";

const allPlugins = [
  {
    name: "File System",
    description: "Read, write, search, and manage files and directories",
    icon: FileText,
    category: "core",
    downloads: "125k",
    rating: 4.9,
    official: true,
  },
  {
    name: "Shell",
    description: "Execute commands with approval gates and allowlists",
    icon: Terminal,
    category: "core",
    downloads: "118k",
    rating: 4.8,
    official: true,
  },
  {
    name: "Git",
    description:
      "Full git operations including commit, push, branch, and merge",
    icon: Plug,
    category: "core",
    downloads: "102k",
    rating: 4.9,
    official: true,
  },
  {
    name: "Web Fetch",
    description: "Fetch URLs, parse HTML, extract structured data",
    icon: Globe,
    category: "network",
    downloads: "89k",
    rating: 4.7,
    official: true,
  },
  {
    name: "Database",
    description: "Query SQLite, PostgreSQL, MySQL, and MongoDB",
    icon: Database,
    category: "data",
    downloads: "76k",
    rating: 4.8,
    official: true,
  },
  {
    name: "Code Executor",
    description: "Run Python, JavaScript, TypeScript, and more",
    icon: Code2,
    category: "core",
    downloads: "71k",
    rating: 4.6,
    official: true,
  },
  {
    name: "Email",
    description: "Send and receive emails via SMTP and IMAP",
    icon: Mail,
    category: "communication",
    downloads: "45k",
    rating: 4.5,
    official: true,
  },
  {
    name: "Cloud",
    description: "AWS, GCP, and Azure cloud service integrations",
    icon: Cloud,
    category: "cloud",
    downloads: "38k",
    rating: 4.7,
    official: true,
  },
  {
    name: "Security",
    description: "Keychain management, encryption, and secret storage",
    icon: Lock,
    category: "security",
    downloads: "52k",
    rating: 4.9,
    official: true,
  },
  {
    name: "Webhooks",
    description: "Incoming and outgoing webhook handlers with retry",
    icon: Webhook,
    category: "network",
    downloads: "41k",
    rating: 4.6,
    official: true,
  },
  {
    name: "Config Manager",
    description: "Configuration management with validation",
    icon: Settings,
    category: "core",
    downloads: "95k",
    rating: 4.8,
    official: true,
  },
  {
    name: "AI Manager",
    description: "Multi-provider AI: Claude, OpenAI, Gemini, Ollama",
    icon: Zap,
    category: "ai",
    downloads: "130k",
    rating: 4.9,
    official: true,
  },
  {
    name: "Docker",
    description: "Container management and Docker operations",
    icon: Terminal,
    category: "cloud",
    downloads: "34k",
    rating: 4.5,
    official: false,
  },
  {
    name: "Jira",
    description: "Create, update, and query Jira issues",
    icon: FileText,
    category: "communication",
    downloads: "22k",
    rating: 4.4,
    official: false,
  },
  {
    name: "Slack",
    description: "Send messages and manage Slack channels",
    icon: Globe,
    category: "communication",
    downloads: "28k",
    rating: 4.6,
    official: false,
  },
  {
    name: "GitHub",
    description: "PR management, issues, and repository operations",
    icon: Plug,
    category: "cloud",
    downloads: "47k",
    rating: 4.8,
    official: false,
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
    <div className="min-h-screen px-6 pt-24 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
            Marketplace
          </p>
          <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
            Plugin Marketplace
          </h1>
          <p className="mt-3 text-[#888]">
            Browse and install plugins to extend Conductor&apos;s capabilities.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              placeholder="Search plugins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#555] outline-none focus:border-[#333]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-mono transition-colors ${
                  category === cat
                    ? "border-white bg-white text-black"
                    : "border-[#1a1a1a] bg-[#0a0a0a] text-[#888] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 text-xs text-[#555]">{filtered.length} plugins</p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plugin) => (
            <SpotlightCard key={plugin.name} className="group p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <plugin.icon className="mt-0.5 h-5 w-5 text-[#555]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-sm font-semibold">
                        {plugin.name}
                      </h3>
                      {plugin.official && (
                        <span className="rounded border border-[#1a1a1a] px-1.5 py-0.5 text-[10px] text-[#555]">
                          official
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#666]">
                      {plugin.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#1a1a1a] pt-3">
                <div className="flex items-center gap-3 text-xs text-[#555]">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {plugin.downloads}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {plugin.rating}
                  </span>
                </div>
                <button className="rounded-md border border-[#1a1a1a] px-2.5 py-1 text-xs text-[#888] transition-colors hover:text-white">
                  Install
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-mono text-sm text-[#555]">No plugins found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
