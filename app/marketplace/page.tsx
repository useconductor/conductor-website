"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Download,
  Database,
  Zap,
  MessageSquare,
  BarChart,
  ShoppingCart,
  Mail,
  LayoutGrid,
  CheckSquare,
  Phone,
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
    name: "airtable",
    description: "Read and write Airtable bases, tables, and records.",
    icon: LayoutGrid,
    category: "productivity",
    downloads: "12k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install airtable",
  },
  {
    name: "anthropic",
    description: "Call Claude models directly from your AI agent via the Anthropic API.",
    icon: Zap,
    category: "ai",
    downloads: "18k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins install anthropic",
  },
  {
    name: "asana",
    description: "Manage Asana tasks, projects, and workspaces.",
    icon: CheckSquare,
    category: "productivity",
    downloads: "9k",
    rating: 4.5,
    official: true,
    installCmd: "conductor plugins install asana",
  },
  {
    name: "discord",
    description: "Send messages, read channels, and manage Discord servers.",
    icon: MessageSquare,
    category: "communication",
    downloads: "14k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install discord",
  },
  {
    name: "monday",
    description: "Read and update Monday.com boards, items, and columns.",
    icon: LayoutGrid,
    category: "productivity",
    downloads: "7k",
    rating: 4.4,
    official: true,
    installCmd: "conductor plugins install monday",
  },
  {
    name: "openai",
    description: "Call GPT and other OpenAI models from your AI agent.",
    icon: Zap,
    category: "ai",
    downloads: "22k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins install openai",
  },
  {
    name: "posthog",
    description: "Query PostHog analytics: events, funnels, feature flags, and insights.",
    icon: BarChart,
    category: "analytics",
    downloads: "6k",
    rating: 4.5,
    official: true,
    installCmd: "conductor plugins install posthog",
  },
  {
    name: "redis",
    description: "Get, set, delete, and query Redis keys and data structures.",
    icon: Database,
    category: "data",
    downloads: "11k",
    rating: 4.7,
    official: true,
    installCmd: "conductor plugins install redis",
  },
  {
    name: "sendgrid",
    description: "Send transactional and marketing emails via SendGrid.",
    icon: Mail,
    category: "communication",
    downloads: "8k",
    rating: 4.5,
    official: true,
    installCmd: "conductor plugins install sendgrid",
  },
  {
    name: "shopify",
    description: "Manage Shopify products, orders, customers, and inventory.",
    icon: ShoppingCart,
    category: "commerce",
    downloads: "10k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install shopify",
  },
  {
    name: "supabase",
    description: "Query Supabase tables, run RPC functions, and manage auth.",
    icon: Database,
    category: "data",
    downloads: "15k",
    rating: 4.8,
    official: true,
    installCmd: "conductor plugins install supabase",
  },
  {
    name: "trello",
    description: "Read and update Trello boards, lists, and cards.",
    icon: CheckSquare,
    category: "productivity",
    downloads: "6k",
    rating: 4.4,
    official: true,
    installCmd: "conductor plugins install trello",
  },
  {
    name: "twilio",
    description: "Send SMS messages and make calls via Twilio.",
    icon: Phone,
    category: "communication",
    downloads: "9k",
    rating: 4.6,
    official: true,
    installCmd: "conductor plugins install twilio",
  },
];

const categories = [
  "all",
  "ai",
  "analytics",
  "communication",
  "commerce",
  "data",
  "productivity",
];

function PluginCard({ plugin }: { plugin: Plugin }) {
  return (
    <Link href={`/docs/plugins/${plugin.name}`}>
    <SpotlightCard className="group flex flex-col p-5 cursor-pointer">
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
      </div>
    </SpotlightCard>
    </Link>
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
