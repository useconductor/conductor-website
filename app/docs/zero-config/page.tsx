import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type ZeroConfigPlugin = {
  name: string;
  tools: number;
  toolNames: string[];
  description: string;
  source?: string;
};

const zeroConfigPlugins: ZeroConfigPlugin[] = [
  {
    name: "calculator",
    tools: 3,
    toolNames: ["calculator_eval", "calculator_convert", "calculator_percentage"],
    description: "Evaluate math expressions, convert between any units, and calculate percentages. Powered by mathjs.",
    source: "Built-in",
  },
  {
    name: "shell",
    tools: 4,
    toolNames: ["shell_exec", "shell_background", "shell_kill", "shell_list"],
    description: "Safe shell command execution via a whitelist allowlist. Allowed: ls, git, npm, yarn, node, python, curl, ping, docker, and more.",
    source: "Built-in",
  },
  {
    name: "github",
    tools: 4,
    toolNames: ["github_user", "github_repo", "github_repos", "github_search_repos"],
    description: "Public GitHub data — user profiles, repository info, and code search — with no authentication required.",
    source: "Built-in (partial auth)",
  },
  {
    name: "weather",
    tools: 3,
    toolNames: ["weather_current", "weather_forecast", "weather_hourly"],
    description: "Real-time weather conditions and 7-day forecasts for any city or coordinates via Open-Meteo. Completely free, no API key.",
    source: "Open-Meteo",
  },
  {
    name: "hash",
    tools: 5,
    toolNames: ["hash_md5", "hash_sha1", "hash_sha256", "hash_sha512", "hash_bcrypt"],
    description: "Compute MD5, SHA-1, SHA-256, SHA-512 hashes and bcrypt password hashes for any input string.",
    source: "Built-in",
  },
  {
    name: "text-tools",
    tools: 6,
    toolNames: ["text_count", "text_format_json", "text_diff", "text_encode", "text_decode", "text_frequency"],
    description: "Word and character counts, JSON pretty-printing, line-by-line diff, Base64 and URL encoding/decoding, and word frequency analysis.",
    source: "Built-in",
  },
  {
    name: "colors",
    tools: 4,
    toolNames: ["colors_convert", "colors_name", "colors_palette", "colors_contrast"],
    description: "Convert between Hex, RGB, HSL, and CSS color names. Generate accessible color palettes and check contrast ratios.",
    source: "Built-in",
  },
  {
    name: "timezone",
    tools: 3,
    toolNames: ["timezone_convert", "timezone_now", "timezone_list"],
    description: "Convert timestamps between any two timezones, get current time in a specific zone, and list all IANA timezone names.",
    source: "Built-in",
  },
  {
    name: "network",
    tools: 4,
    toolNames: ["network_dns", "network_geoip", "network_ping", "network_port"],
    description: "DNS lookups for any domain, IP geolocation, ping a host, and check if a port is open.",
    source: "Public APIs",
  },
  {
    name: "url-tools",
    tools: 4,
    toolNames: ["url_parse", "url_expand", "url_encode", "url_decode"],
    description: "Parse URLs into components (protocol, host, path, query), expand short links, and encode/decode URL strings.",
    source: "Built-in",
  },
  {
    name: "notes",
    tools: 4,
    toolNames: ["notes_write", "notes_read", "notes_list", "notes_delete"],
    description: "Local markdown notes stored in ~/.conductor/notes/. A persistent, private scratchpad your AI can read and write across sessions.",
    source: "Local filesystem",
  },
  {
    name: "memory",
    tools: 3,
    toolNames: ["memory_store", "memory_recall", "memory_list"],
    description: "Local semantic memory stored in SQLite. Your AI can remember facts, preferences, and context between sessions without any external service.",
    source: "Local SQLite",
  },
  {
    name: "cron",
    tools: 2,
    toolNames: ["cron_parse", "cron_next"],
    description: "Parse cron expressions into human-readable schedules, and calculate the next N run times for a cron expression.",
    source: "Built-in",
  },
  {
    name: "crypto",
    tools: 3,
    toolNames: ["crypto_price", "crypto_prices", "crypto_trending"],
    description: "Cryptocurrency prices, market data, and trending coins via the public CoinGecko API. No API key required.",
    source: "CoinGecko (public)",
  },
  {
    name: "fun",
    tools: 3,
    toolNames: ["fun_joke", "fun_fact", "fun_flip"],
    description: "Random programming jokes, interesting facts, and a coin flip — for when your AI needs a personality.",
    source: "Built-in",
  },
  {
    name: "system",
    tools: 5,
    toolNames: ["system_cpu", "system_memory", "system_disk", "system_processes", "system_uptime"],
    description: "Real-time system metrics: CPU usage, memory consumption, disk space, top processes, and system uptime.",
    source: "Local OS",
  },
  {
    name: "translate",
    tools: 2,
    toolNames: ["translate_text", "translate_detect"],
    description: "Translate text between 100+ languages and auto-detect the source language using a free LibreTranslate instance.",
    source: "LibreTranslate (free)",
  },
  {
    name: "docker",
    tools: 8,
    toolNames: ["docker_containers", "docker_logs", "docker_images", "docker_volumes", "docker_start", "docker_stop", "docker_pull", "docker_container"],
    description: "Manage your local Docker environment. Requires Docker Engine or Docker Desktop running locally. No credentials needed.",
    source: "Local Docker socket",
  },
];

const enabledByDefault = `# These plugins are enabled automatically on first run.
# You can disable any of them:
conductor plugins disable fun
conductor plugins disable crypto

# Or re-enable:
conductor plugins enable fun`;

const listOutput = `$ conductor plugins list

NAME          STATUS   TOOLS   ZERO-CONFIG
calculator    ready    3       ✓
shell         ready    4       ✓
weather       ready    3       ✓
hash          ready    5       ✓
text-tools    ready    6       ✓
colors        ready    4       ✓
timezone      ready    3       ✓
network       ready    4       ✓
url-tools     ready    4       ✓
notes         ready    4       ✓
memory        ready    3       ✓
cron          ready    2       ✓
crypto        ready    3       ✓
fun           ready    3       ✓
system        ready    5       ✓
translate     ready    2       ✓
github        ready    4       partial (public only)
docker        ready    8       ✓ (Docker required)`;

export default function ZeroConfigPage() {
  const totalTools = zeroConfigPlugins.reduce((sum, p) => sum + p.tools, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Zero-config Plugins
        </h1>
        <p className="mt-3 text-[#666]">
          {zeroConfigPlugins.length} plugins and {totalTools} tools that work immediately after install with no API keys, no accounts, and no setup.
          Install Conductor and they are ready.
        </p>
      </div>

      <div className="space-y-12">
        {/* What is zero-config */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">What is zero-config?</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Zero-config plugins work on the first <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor mcp start</code> with
            no credentials required. They use either built-in logic, your local system
            (filesystem, Docker socket, OS metrics), or free public APIs with no authentication.
          </p>
          <p className="text-sm leading-relaxed text-[#666]">
            When you run <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor init</code>,
            all zero-config plugins are enabled by default. You will immediately have{" "}
            <strong className="text-white">{totalTools} tools</strong> available in your AI client
            without entering a single API key.
          </p>
          <div className="mt-5 flex gap-4 text-xs text-[#444]">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <div className="font-mono text-2xl font-bold text-white">{zeroConfigPlugins.length}</div>
              <div className="mt-1">zero-config plugins</div>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <div className="font-mono text-2xl font-bold text-white">{totalTools}</div>
              <div className="mt-1">tools available instantly</div>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <div className="font-mono text-2xl font-bold text-white">0</div>
              <div className="mt-1">API keys required</div>
            </div>
          </div>
        </section>

        {/* Plugin list */}
        <section>
          <h2 className="mb-5 font-mono text-xl font-semibold">All zero-config plugins</h2>
          <div className="space-y-4">
            {zeroConfigPlugins.map((plugin) => (
              <div
                key={plugin.name}
                className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#1a1a1a] px-4 py-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/docs/plugins/${plugin.name}`}
                        className="font-mono text-sm font-semibold text-white hover:underline underline-offset-2"
                      >
                        {plugin.name}
                      </Link>
                      <span className="rounded bg-[#0a1a0a] px-2 py-0.5 font-mono text-[10px] text-[#446644]">
                        zero-config
                      </span>
                      <span className="font-mono text-[10px] text-[#333]">
                        {plugin.tools} {plugin.tools === 1 ? "tool" : "tools"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#555]">{plugin.description}</p>
                  </div>
                  {plugin.source && (
                    <span className="shrink-0 rounded bg-[#111] px-2 py-0.5 font-mono text-[10px] text-[#333]">
                      {plugin.source}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 px-4 py-3">
                  {plugin.toolNames.map((tool) => (
                    <code
                      key={tool}
                      className="rounded bg-[#111] px-2 py-0.5 font-mono text-[10px] text-[#666]"
                    >
                      {tool}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What happens on first start */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">What happens on first start</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            When <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor mcp start</code> runs
            for the first time, it initializes all zero-config plugins automatically. The startup summary
            shows every plugin&apos;s state so you can confirm everything is working:
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">conductor plugins list</span>
              <CopyButton text="conductor plugins list" />
            </div>
            <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-[#666]">
              <code>{listOutput}</code>
            </pre>
          </div>
        </section>

        {/* Disabling plugins */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Disabling a zero-config plugin</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            You may not need all zero-config plugins. Disable any plugin to remove its tools from
            your AI client&apos;s tool list. This reduces context and can make your AI more focused.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={enabledByDefault} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{enabledByDefault}</code>
            </pre>
          </div>
        </section>

        {/* Shell allowlist */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Shell plugin allowlist</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            The shell plugin is zero-config but not unrestricted. It uses a whitelist allowlist
            — only the commands in this list can be executed. There is no <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">eval()</code> or
            arbitrary subprocess execution.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">default allowed commands</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#666]">
              <code>{`ls, cat, head, tail, grep, find, wc, sort, uniq, cut, awk, sed
git, gh
npm, yarn, pnpm, npx, node
python, python3, pip, pip3
docker, docker-compose
curl, wget, ping, nslookup, dig
pwd, echo, which, env, ps, df, du, uptime
make, cargo, go, rustc`}</code>
            </pre>
          </div>
          <p className="mt-3 text-xs text-[#444]">
            Customize the allowlist by editing{" "}
            <code className="font-mono">~/.conductor/config.json</code> — add entries under{" "}
            <code className="font-mono">plugins.shell.allowedCommands</code>.
          </p>
        </section>

        {/* Privacy note */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Privacy and data handling</h2>
          <div className="space-y-3">
            {[
              {
                plugin: "notes, memory",
                note: "100% local. Data stored in ~/.conductor/. Nothing leaves your machine.",
              },
              {
                plugin: "weather",
                note: "Sends your location (city name or coordinates) to Open-Meteo servers. No account or personal data required.",
              },
              {
                plugin: "network",
                note: "DNS lookups and ping go to public DNS resolvers. IP geolocation queries a public API.",
              },
              {
                plugin: "crypto",
                note: "Price queries go to the CoinGecko public API. No personal data sent.",
              },
              {
                plugin: "translate",
                note: "Text is sent to a public LibreTranslate instance for translation. For sensitive text, self-host LibreTranslate and configure the URL.",
              },
              {
                plugin: "github (zero-config)",
                note: "Only public GitHub API endpoints are called. No authentication token is sent.",
              },
            ].map((item) => (
              <div
                key={item.plugin}
                className="flex items-start gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] p-3"
              >
                <code className="shrink-0 rounded bg-[#111] px-2 py-0.5 font-mono text-xs text-white">
                  {item.plugin}
                </code>
                <p className="text-xs text-[#555]">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Next */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8 flex items-center gap-6">
        <Link
          href="/docs/plugins"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          All Plugins
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/docs/security"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Security Model
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
