import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const minimalPlugin = `// ~/.conductor/plugins/hello.js
module.exports = {
  name: "hello",
  version: "1.0.0",
  description: "A minimal example plugin",

  tools: [
    {
      name: "hello.greet",
      description: "Returns a greeting for the given name",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name to greet" },
        },
        required: ["name"],
      },

      async handler({ name }) {
        return {
          content: [{ type: "text", text: \`Hello, \${name}!\` }],
        };
      },
    },
  ],
};`;

const configPlugin = `// ~/.conductor/plugins/weather.js
module.exports = {
  name: "weather",
  version: "1.0.0",
  description: "Fetch current weather via OpenWeatherMap",

  // configSchema is validated at startup
  configSchema: {
    type: "object",
    properties: {
      apiKey: { type: "string" },
      units: { type: "string", enum: ["metric", "imperial"], default: "metric" },
    },
    required: ["apiKey"],
  },

  tools: [
    {
      name: "weather.current",
      description: "Get current weather for a city",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name, e.g. London" },
        },
        required: ["city"],
      },

      // config is the validated plugin config
      async handler({ city }, config) {
        const url =
          \`https://api.openweathermap.org/data/2.5/weather\` +
          \`?q=\${encodeURIComponent(city)}&units=\${config.units}\` +
          \`&appid=\${config.apiKey}\`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(\`Weather API error: \${res.status}\`);

        const data = await res.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                city: data.name,
                temp: \`\${data.main.temp}°\`,
                condition: data.weather[0].description,
                humidity: \`\${data.main.humidity}%\`,
              }, null, 2),
            },
          ],
        };
      },
    },
  ],
};`;

const configJson = `// ~/.conductor/config.json
{
  "plugins": {
    "weather": {
      "enabled": true,
      "apiKey": "your-openweathermap-key",
      "units": "imperial"
    }
  }
}`;

const approvalPlugin = `// Tool with approval gate
{
  name: "db.drop-table",
  description: "Drop a database table permanently",
  requiresApproval: true,  // user must confirm in terminal
  inputSchema: {
    type: "object",
    properties: {
      table: { type: "string" },
      database: { type: "string" },
    },
    required: ["table", "database"],
  },
  async handler({ table, database }, config) {
    const conn = await getConnection(config, database);
    await conn.query(\`DROP TABLE IF EXISTS \${table}\`);
    return { content: [{ type: "text", text: \`Dropped \${table}\` }] };
  },
}`;

const typescriptPlugin = `// ~/.conductor/plugins/myPlugin.ts
// Requires ts-node or pre-compilation
import type { Plugin, ToolDefinition } from "@useconductor/sdk";

interface Config {
  endpoint: string;
  apiKey: string;
}

const tools: ToolDefinition[] = [
  {
    name: "myPlugin.fetch",
    description: "Fetch data from the custom endpoint",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
      },
      required: ["path"],
    },
    async handler({ path }: { path: string }, config: Config) {
      const res = await fetch(\`\${config.endpoint}\${path}\`, {
        headers: { Authorization: \`Bearer \${config.apiKey}\` },
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  },
];

const plugin: Plugin = {
  name: "myPlugin",
  version: "1.0.0",
  description: "Fetches from a custom API",
  configSchema: {
    type: "object",
    properties: {
      endpoint: { type: "string" },
      apiKey: { type: "string" },
    },
    required: ["endpoint", "apiKey"],
  },
  tools,
};

module.exports = plugin;`;

const multiTool = `// Multiple related tools in one plugin
module.exports = {
  name: "notes",
  version: "1.0.0",
  description: "Local plaintext note storage",
  tools: [
    {
      name: "notes.write",
      description: "Save a note",
      requiresApproval: false,
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
        },
        required: ["title", "content"],
      },
      async handler({ title, content }) {
        const fs = require("fs/promises");
        const path = require("path");
        const dir = path.join(process.env.HOME, ".conductor", "notes");
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, \`\${title}.md\`), content, "utf8");
        return { content: [{ type: "text", text: \`Saved \${title}\` }] };
      },
    },
    {
      name: "notes.read",
      description: "Read a saved note",
      inputSchema: {
        type: "object",
        properties: { title: { type: "string" } },
        required: ["title"],
      },
      async handler({ title }) {
        const fs = require("fs/promises");
        const path = require("path");
        const file = path.join(process.env.HOME, ".conductor", "notes", \`\${title}.md\`);
        const content = await fs.readFile(file, "utf8");
        return { content: [{ type: "text", text: content }] };
      },
    },
    {
      name: "notes.list",
      description: "List all saved notes",
      inputSchema: { type: "object", properties: {} },
      async handler() {
        const fs = require("fs/promises");
        const path = require("path");
        const dir = path.join(process.env.HOME, ".conductor", "notes");
        const files = await fs.readdir(dir).catch(() => []);
        return { content: [{ type: "text", text: files.join("\\n") || "No notes yet." }] };
      },
    },
  ],
};`;

export default function CustomPluginsPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Guides
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Writing custom plugins
        </h1>
        <p className="mt-3 text-[#666]">
          Drop a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-sm">.js</code> file
          into <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-sm">~/.conductor/plugins/</code> and
          Conductor loads it automatically at startup. No compilation, no registration step.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Minimal plugin</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            A plugin is a CommonJS module that exports a plain object with{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">name</code>,{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">version</code>,{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">description</code>, and{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">tools</code>.
            Each tool has a name, description, JSON Schema input spec, and an async handler.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/plugins/hello.js</span>
              <CopyButton text={minimalPlugin} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{minimalPlugin}</code>
            </pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            Restart Conductor (or run{" "}
            <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">conductor plugins reload</code>),
            then ask your AI: <em>"use hello.greet with name Alex"</em>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Plugin with configuration</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Add a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">configSchema</code> to
            declare what config your plugin needs. Conductor validates it at startup — if required fields
            are missing the plugin refuses to load with a clear error. The validated config is passed as
            the second argument to every handler.
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/plugins/weather.js</span>
                <CopyButton text={configPlugin} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
                <code>{configPlugin}</code>
              </pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json — add plugin config</span>
                <CopyButton text={configJson} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
                <code>{configJson}</code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Approval gates</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Set <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">requiresApproval: true</code> on
            any tool that has destructive side effects. Conductor will halt execution and prompt the user
            before the handler runs. The AI waits for the response.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">tool with requiresApproval</span>
              <CopyButton text={approvalPlugin} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{approvalPlugin}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Multiple tools in one plugin</h2>
          <p className="mb-4 text-sm text-[#666]">
            Group related tools under one plugin. They share config, lifecycle, and context.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/plugins/notes.js</span>
              <CopyButton text={multiTool} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{multiTool}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">TypeScript</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            TypeScript plugins are supported with the <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">@useconductor/sdk</code> package,
            which exports full types. Either pre-compile to JavaScript or use{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">ts-node</code> for development.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/plugins/myPlugin.ts</span>
              <CopyButton text={typescriptPlugin} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{typescriptPlugin}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Plugin API reference</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Field</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Type</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Required</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  { field: "name", type: "string", req: "Yes", desc: "Unique plugin identifier. Used as the tool name prefix." },
                  { field: "version", type: "string", req: "Yes", desc: "Semver string. Logged at startup." },
                  { field: "description", type: "string", req: "Yes", desc: "Human-readable description shown in plugin list." },
                  { field: "configSchema", type: "JSONSchema", req: "No", desc: "JSON Schema for plugin config. Validated at startup." },
                  { field: "tools", type: "ToolDefinition[]", req: "Yes", desc: "Array of tool definitions (see below)." },
                  { field: "onLoad", type: "async (config) => void", req: "No", desc: "Lifecycle hook called once at plugin load. Good for DB connections." },
                  { field: "onUnload", type: "async () => void", req: "No", desc: "Called when Conductor shuts down. Close connections here." },
                ].map((r) => (
                  <tr key={r.field}>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-white">{r.field}</code></td>
                    <td className="px-4 py-3"><code className="font-mono text-[10px] text-[#555]">{r.type}</code></td>
                    <td className="px-4 py-3 text-xs text-[#444]">{r.req}</td>
                    <td className="px-4 py-3 text-xs text-[#444]">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-[#1a1a1a]">
            <div className="border-b border-[#1a1a1a] bg-[#080808] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">ToolDefinition fields</span>
            </div>
            <table className="w-full">
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  { field: "name", type: "string", req: "Yes", desc: "Full tool name e.g. pluginName.action. Dot-separated." },
                  { field: "description", type: "string", req: "Yes", desc: "Shown to the AI. Be specific — this is how the AI decides whether to use it." },
                  { field: "inputSchema", type: "JSONSchema", req: "Yes", desc: "Validated before handler runs. Use required[] for mandatory fields." },
                  { field: "requiresApproval", type: "boolean", req: "No", desc: "If true, user must confirm before handler runs. Default: false." },
                  { field: "handler", type: "async (input, config) => CallToolResult", req: "Yes", desc: "The actual implementation. Return { content: [{ type: 'text', text: '...' }] }." },
                ].map((r) => (
                  <tr key={r.field}>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-white">{r.field}</code></td>
                    <td className="px-4 py-3"><code className="font-mono text-[10px] text-[#555]">{r.type}</code></td>
                    <td className="px-4 py-3 text-xs text-[#444]">{r.req}</td>
                    <td className="px-4 py-3 text-xs text-[#444]">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Testing your plugin</h2>
          <div className="space-y-2">
            {[
              { cmd: "conductor plugins list", desc: "Confirm your plugin appears with status: enabled" },
              { cmd: "conductor plugins validate my-plugin", desc: "Validate config schema and tool definitions" },
              { cmd: "conductor doctor", desc: "Full system check including plugin health" },
              { cmd: "conductor mcp start --log-level debug", desc: "Verbose mode — see every tool call and validation error" },
            ].map((item) => (
              <div key={item.cmd} className="flex items-start justify-between gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] p-3">
                <code className="shrink-0 font-mono text-xs text-white">{item.cmd}</code>
                <span className="text-right text-xs text-[#444]">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/audit-logs" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Next: Audit logs
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
