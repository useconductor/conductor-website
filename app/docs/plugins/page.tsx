import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type PluginRow = {
  name: string;
  category: string;
  tools: number;
  zeroConfig: boolean | "partial";
  description: string;
};

const builtinPlugins: PluginRow[] = [
  // Utilities
  { name: "calculator", category: "Utilities", tools: 3, zeroConfig: true, description: "Math expressions, unit conversions, percentages" },
  { name: "hash", category: "Utilities", tools: 5, zeroConfig: true, description: "MD5, SHA-1, SHA-256, SHA-512, bcrypt" },
  { name: "text-tools", category: "Utilities", tools: 6, zeroConfig: true, description: "Word count, JSON format, diff, encode/decode" },
  { name: "colors", category: "Utilities", tools: 4, zeroConfig: true, description: "Hex/RGB/HSL/name conversion" },
  { name: "timezone", category: "Utilities", tools: 3, zeroConfig: true, description: "Convert time between zones, list zones" },
  { name: "url-tools", category: "Utilities", tools: 4, zeroConfig: true, description: "Parse URLs, expand short links, encode/decode" },
  { name: "cron", category: "Utilities", tools: 2, zeroConfig: true, description: "Parse cron expressions, next run times" },
  { name: "fun", category: "Utilities", tools: 3, zeroConfig: true, description: "Jokes, random facts, coin flip" },
  // Developer
  { name: "shell", category: "Developer", tools: 4, zeroConfig: true, description: "Safe shell command execution (whitelist-based)" },
  { name: "github", category: "Developer", tools: 20, zeroConfig: "partial", description: "Issues, PRs, code search, releases, forks, notifications" },
  { name: "github-actions", category: "Developer", tools: 6, zeroConfig: false, description: "Trigger workflows, view runs, download artifacts" },
  { name: "linear", category: "Developer", tools: 9, zeroConfig: false, description: "Issues, cycles, projects, team management" },
  { name: "jira", category: "Developer", tools: 8, zeroConfig: false, description: "Issues, transitions, projects, sprints" },
  { name: "vercel", category: "Developer", tools: 7, zeroConfig: false, description: "Deployments, domains, environment variables" },
  { name: "docker", category: "Developer", tools: 8, zeroConfig: true, description: "Containers, images, volumes, compose" },
  { name: "n8n", category: "Developer", tools: 5, zeroConfig: false, description: "Trigger workflows, list executions" },
  { name: "figma", category: "Developer", tools: 5, zeroConfig: false, description: "Files, components, comments, exports" },
  // Communication
  { name: "slack", category: "Communication", tools: 6, zeroConfig: false, description: "Send messages, read channels, manage threads" },
  { name: "gmail", category: "Communication", tools: 7, zeroConfig: false, description: "Read, send, search, label, archive emails" },
  { name: "discord", category: "Communication", tools: 5, zeroConfig: false, description: "Send messages, read channels, manage roles" },
  { name: "twilio", category: "Communication", tools: 4, zeroConfig: false, description: "Send SMS, make calls, check logs" },
  // Productivity
  { name: "notion", category: "Productivity", tools: 8, zeroConfig: false, description: "Pages, databases, blocks, search" },
  { name: "gcal", category: "Productivity", tools: 6, zeroConfig: false, description: "Events, calendars, availability, scheduling" },
  { name: "gdrive", category: "Productivity", tools: 6, zeroConfig: false, description: "Files, folders, permissions, search" },
  { name: "airtable", category: "Productivity", tools: 6, zeroConfig: false, description: "Records, tables, views, formulas" },
  { name: "todoist", category: "Productivity", tools: 5, zeroConfig: false, description: "Tasks, projects, labels, filters" },
  { name: "notes", category: "Productivity", tools: 4, zeroConfig: true, description: "Local markdown notes in ~/.conductor/notes/" },
  { name: "memory", category: "Productivity", tools: 3, zeroConfig: true, description: "Local semantic memory stored in SQLite" },
  // Finance & Commerce
  { name: "stripe", category: "Finance", tools: 9, zeroConfig: false, description: "Payments, customers, subscriptions, refunds" },
  { name: "shopify", category: "Finance", tools: 7, zeroConfig: false, description: "Products, orders, customers, inventory" },
  { name: "crypto", category: "Finance", tools: 3, zeroConfig: true, description: "Crypto prices via public CoinGecko API" },
  // System & Network
  { name: "system", category: "System", tools: 5, zeroConfig: true, description: "CPU, memory, disk, processes, uptime" },
  { name: "network", category: "System", tools: 4, zeroConfig: true, description: "DNS lookup, IP geolocation, ping, port check" },
  { name: "weather", category: "System", tools: 3, zeroConfig: true, description: "Current conditions and forecasts via Open-Meteo" },
  // Other
  { name: "homekit", category: "Smart Home", tools: 6, zeroConfig: false, description: "Control HomeKit devices, scenes, automations" },
  { name: "spotify", category: "Media", tools: 7, zeroConfig: false, description: "Playback, playlists, search, library" },
  { name: "x", category: "Social", tools: 5, zeroConfig: false, description: "Post, search, read timeline, DMs" },
  { name: "translate", category: "Utilities", tools: 2, zeroConfig: true, description: "Text translation via LibreTranslate (free)" },
];

const categories = Array.from(new Set(builtinPlugins.map((p) => p.category)));

const pluginInterface = `interface Plugin {
  name: string;
  description: string;
  version: string;

  // Called once on first use. Receives the Conductor instance for
  // access to config, database, AI manager, and other plugins.
  initialize(conductor: Conductor): Promise<void>;

  // Return false to show as "not_configured" in plugin list.
  // Tools from unconfigured plugins are not registered with MCP.
  isConfigured(): boolean;

  // The tools this plugin exposes to the MCP server.
  getTools(): PluginTool[];

  // Optional: guided setup via \`conductor plugins setup <name>\`
  configSchema?: PluginConfigSchema;

  // Optional: called each reasoning cycle for proactive context.
  // Return a string to inject into the AI's system prompt.
  getContext?(): Promise<string | null>;

  // Optional: cleanup on plugin disable or server shutdown.
  onUnload?(): Promise<void>;
}

interface PluginTool {
  name: string;
  description: string;
  inputSchema: JSONSchema7;

  // Set true for irreversible operations (delete, send, publish).
  // The MCP client will prompt the user before execution.
  requiresApproval?: boolean;

  handler(
    args: unknown,
    conductor: Conductor
  ): Promise<ToolResult>;
}`;

const fullPluginExample = `// ~/.conductor/plugins/planetscale.js
// A complete plugin example with credentials, error handling, and multiple tools

export default class PlanetScalePlugin {
  name = "planetscale";
  description = "Query PlanetScale databases via the PS API";
  version = "1.0.0";

  #apiKey = null;
  #orgName = null;
  #baseUrl = "https://api.planetscale.com/v1";

  configSchema = {
    fields: [
      {
        key: "apiKey",
        label: "Service Token",
        type: "string",
        secret: true,     // stored in OS keychain
        required: true,
        hint: "Create at app.planetscale.com/settings/service-tokens",
      },
      {
        key: "orgName",
        label: "Organization name",
        type: "string",
        required: true,
      },
    ],
  };

  async initialize(conductor) {
    this.#apiKey = await conductor.config.getSecret("planetscale.apiKey");
    this.#orgName = await conductor.config.get("planetscale.orgName");
    this.logger = conductor.logger;
  }

  isConfigured() {
    return !!this.#apiKey && !!this.#orgName;
  }

  getTools() {
    return [
      {
        name: "planetscale_databases",
        description: "List all databases in your organization",
        inputSchema: { type: "object", properties: {} },
        handler: async () => this.#listDatabases(),
      },
      {
        name: "planetscale_branches",
        description: "List branches for a database",
        inputSchema: {
          type: "object",
          properties: {
            database: { type: "string", description: "Database name" },
          },
          required: ["database"],
        },
        handler: async ({ database }) => this.#listBranches(database),
      },
      {
        name: "planetscale_query",
        description: "Run a read-only SQL query",
        inputSchema: {
          type: "object",
          properties: {
            database: { type: "string" },
            branch: { type: "string", default: "main" },
            sql: { type: "string", description: "SELECT statement" },
          },
          required: ["database", "sql"],
        },
        handler: async ({ database, branch = "main", sql }) => {
          if (!sql.trim().toUpperCase().startsWith("SELECT")) {
            throw new Error("Only SELECT queries are permitted");
          }
          return this.#runQuery(database, branch, sql);
        },
      },
    ];
  }

  async #request(path) {
    const res = await fetch(\`\${this.#baseUrl}/\${path}\`, {
      headers: {
        Authorization: \`Bearer \${this.#apiKey}\`,
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error(\`PlanetScale API error: \${res.status}\`);
    return res.json();
  }

  async #listDatabases() {
    const data = await this.#request(
      \`organizations/\${this.#orgName}/databases\`
    );
    return {
      content: [{ type: "text", text: JSON.stringify(data.data, null, 2) }],
    };
  }

  async #listBranches(database) {
    const data = await this.#request(
      \`organizations/\${this.#orgName}/databases/\${database}/branches\`
    );
    return {
      content: [{ type: "text", text: JSON.stringify(data.data, null, 2) }],
    };
  }

  async #runQuery(database, branch, sql) {
    this.logger.info(\`Querying \${database}/\${branch}\`);
    // implementation omitted for brevity
    return { content: [{ type: "text", text: "..." }] };
  }
}`;

const lifecycleStates = [
  {
    state: "registered",
    description: "Plugin class is registered with PluginManager. Not yet initialized.",
    color: "#333",
  },
  {
    state: "not_configured",
    description: "initialize() succeeded but isConfigured() returns false. Tools are not registered with MCP.",
    color: "#3a3a2a",
  },
  {
    state: "ready",
    description: "Initialized and configured. All tools are active and callable.",
    color: "#1a2a1a",
  },
  {
    state: "init_failed",
    description: "initialize() threw an error. Plugin is shown in startup summary with the error message.",
    color: "#2a1a1a",
  },
  {
    state: "disabled",
    description: "Manually disabled via CLI. Not initialized, not shown to MCP clients.",
    color: "#222",
  },
];

const cliCommands = [
  { cmd: "conductor plugins list", desc: "List all plugins with status, tool count, and config state" },
  { cmd: "conductor plugins enable <name>", desc: "Enable a plugin (initializes on next tool call)" },
  { cmd: "conductor plugins disable <name>", desc: "Disable a plugin immediately" },
  { cmd: "conductor plugins setup <name>", desc: "Interactive credential setup using the plugin's configSchema" },
  { cmd: "conductor plugins install <name>", desc: "Install a plugin from the marketplace" },
  { cmd: "conductor plugins uninstall <name>", desc: "Remove a marketplace plugin" },
  { cmd: "conductor plugins onboard", desc: "Interactive TUI plugin picker — browse, enable, and configure in one session" },
];

export default function PluginsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Plugin System
        </h1>
        <p className="mt-3 text-[#666]">
          Every tool in Conductor is a plugin. 40+ built-in plugins cover developer workflows,
          communication, productivity, finance, and system monitoring. Write your own in
          a single JavaScript file.
        </p>
      </div>

      <div className="space-y-14">
        {/* What is a plugin */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">The Plugin Interface</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            A plugin is a class implementing the <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">Plugin</code> interface.
            Plugins are <strong className="font-medium text-white">lazily initialized</strong> — the first time an AI calls any
            tool from a plugin, <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">initialize()</code> is called
            with the full Conductor instance, giving access to config, database, AI manager, and other plugins.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">TypeScript</span>
              <CopyButton text={pluginInterface} />
            </div>
            <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{pluginInterface}</code>
            </pre>
          </div>
        </section>

        {/* Lifecycle */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Plugin Lifecycle</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Plugins move through these states. A plugin in <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">not_configured</code> or{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">init_failed</code> state does not expose tools to MCP clients.
          </p>
          <div className="space-y-2">
            {lifecycleStates.map((item) => (
              <div
                key={item.state}
                className="flex items-start gap-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4"
                style={{ borderLeftColor: item.color, borderLeftWidth: "2px" }}
              >
                <code className="shrink-0 rounded bg-[#111] px-2 py-0.5 font-mono text-xs text-white">
                  {item.state}
                </code>
                <p className="text-xs leading-relaxed text-[#555]">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#444]">
            Run <code className="font-mono">conductor mcp start</code> to see a startup summary showing each
            plugin&apos;s state. Failed plugins are shown with the error message so you can diagnose
            credential or network issues immediately.
          </p>
        </section>

        {/* Built-in plugins table */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Built-in Plugins</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            {builtinPlugins.length} built-in plugins ship with Conductor.{" "}
            Plugins marked <span className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-[10px] text-white">zero-config</span> work
            immediately with no API keys or setup. Click any plugin name to see its full tool reference.
          </p>
          <div className="space-y-8">
            {categories.map((cat) => {
              const plugins = builtinPlugins.filter((p) => p.category === cat);
              return (
                <div key={cat}>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#333]">
                    {cat}
                  </p>
                  <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                          <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Plugin</th>
                          <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Tools</th>
                          <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Auth</th>
                          <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plugins.map((plugin, i) => (
                          <tr
                            key={plugin.name}
                            className={i < plugins.length - 1 ? "border-b border-[#111]" : ""}
                          >
                            <td className="px-4 py-3">
                              <Link
                                href={`/docs/plugins/${plugin.name}`}
                                className="font-mono font-medium text-white hover:underline underline-offset-2"
                              >
                                {plugin.name}
                              </Link>
                            </td>
                            <td className="px-4 py-3 font-mono text-[#444]">{plugin.tools}</td>
                            <td className="px-4 py-3">
                              {plugin.zeroConfig === true ? (
                                <span className="rounded bg-[#0a1a0a] px-2 py-0.5 font-mono text-[10px] text-[#446644]">
                                  zero-config
                                </span>
                              ) : plugin.zeroConfig === "partial" ? (
                                <span className="rounded bg-[#1a1a0a] px-2 py-0.5 font-mono text-[10px] text-[#666633]">
                                  partial
                                </span>
                              ) : (
                                <span className="rounded bg-[#111] px-2 py-0.5 font-mono text-[10px] text-[#444]">
                                  credentials
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-[#555]">{plugin.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CLI commands */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Managing Plugins</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            All plugin management is done through the CLI. Changes take effect immediately
            — no server restart required.
          </p>
          <div className="space-y-2">
            {cliCommands.map((item) => (
              <div
                key={item.cmd}
                className="flex items-center justify-between gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] p-3"
              >
                <div className="flex items-center gap-3">
                  <CopyButton text={item.cmd} />
                  <code className="font-mono text-xs text-white">{item.cmd}</code>
                </div>
                <span className="hidden text-right text-xs text-[#444] sm:block">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Setup */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Configuring Credentials</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Plugins that require credentials define a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">configSchema</code>.
            Running <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor plugins setup &lt;name&gt;</code> walks
            through the fields interactively. Fields marked <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">secret: true</code> are
            stored in your OS keychain — never in <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">config.json</code>.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text="conductor plugins setup github" />
            </div>
            <pre className="p-4 text-sm font-mono leading-relaxed text-[#888]">
              <code>{`$ conductor plugins setup github

? GitHub Personal Access Token: ghp_••••••••••••
? Default organization (optional): myorg

✓ Token stored in OS keychain
✓ github plugin configured — 20 tools now active`}</code>
            </pre>
          </div>
        </section>

        {/* Writing a plugin */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Writing a Plugin</h2>
          <p className="mb-2 text-sm leading-relaxed text-[#666]">
            Drop a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">.js</code> file into{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">~/.conductor/plugins/</code> and enable it.
            The file must export a default class implementing the Plugin interface. Here is a complete,
            production-ready example:
          </p>
          <div className="relative mt-4 overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/plugins/planetscale.js</span>
              <CopyButton text={fullPluginExample} />
            </div>
            <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{fullPluginExample}</code>
            </pre>
          </div>
          <div className="mt-4 space-y-2 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4 text-xs text-[#555]">
            <p className="font-mono font-medium text-white">Key patterns in the example above:</p>
            <ul className="mt-2 space-y-1.5 text-[#444]">
              <li><span className="font-mono text-[#666]">configSchema</span> — defines the credentials the user needs to provide; secret fields go to OS keychain</li>
              <li><span className="font-mono text-[#666]">initialize()</span> — reads secrets from keychain; only runs once on first tool call</li>
              <li><span className="font-mono text-[#666]">isConfigured()</span> — returns false until credentials are set, keeping tools out of MCP</li>
              <li><span className="font-mono text-[#666]">requiresApproval</span> — set this to true on any tool that mutates state (write, delete, send)</li>
              <li><span className="font-mono text-[#666]">Private methods</span> — use # private class fields for API request helpers</li>
            </ul>
          </div>
          <div className="mt-4 relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text="conductor plugins enable planetscale && conductor plugins setup planetscale" />
            </div>
            <pre className="p-4 text-sm font-mono text-[#888]">
              <code>{`conductor plugins enable planetscale
conductor plugins setup planetscale`}</code>
            </pre>
          </div>
        </section>

        {/* Publishing */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Publishing to the Marketplace</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Share your plugin with other Conductor users by publishing it to the marketplace.
            The marketplace is an npm registry namespace — publish your plugin as an npm package
            named <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">@conductor-plugins/your-plugin-name</code>.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={`npm publish --access public
# Users can then install with:
conductor plugins install planetscale`} />
            </div>
            <pre className="p-4 text-sm font-mono leading-relaxed text-[#888]">
              <code>{`# Publish to npm under the @conductor-plugins scope
npm publish --access public

# Users install your plugin with:
conductor plugins install planetscale`}</code>
            </pre>
          </div>
          <p className="mt-3 text-xs text-[#444]">
            Scaffold a new plugin with the correct package.json, tsconfig, and entry point using:{" "}
            <code className="font-mono">conductor plugin-create</code>
          </p>
        </section>
      </div>

      {/* Next */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8 flex items-center gap-6">
        <Link
          href="/docs/zero-config"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Zero-config Plugins
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
