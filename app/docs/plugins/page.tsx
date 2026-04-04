import Link from "next/link";
import {
  ArrowRight,
  Plug,
  Code,
  Shield,
  Settings,
  Terminal,
} from "lucide-react";

export default function PluginsPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-[#555]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Plugins
        </h1>
        <p className="mt-3 text-[#888]">
          The plugin system architecture and API.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Plugin Interface
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#888]">
            Every capability in Conductor is a plugin implementing the Plugin
            interface. Plugins are lazily initialized on first use.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-xs font-mono text-[#ccc]">
              <code>{`interface Plugin {
  name: string;
  description: string;
  version: string;
  initialize(conductor: Conductor): Promise<void>;
  isConfigured(): boolean;
  getTools(): PluginTool[];
  configSchema?: PluginConfigSchema;
  getContext?(): Promise<string | null>;
}`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Built-in Plugins
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                name: "File System",
                tools: "read, write, list, search, diff",
                icon: Terminal,
              },
              {
                name: "Shell",
                tools: "exec, eval, approval gate",
                icon: Terminal,
              },
              {
                name: "Git",
                tools: "status, commit, push, branch, log",
                icon: Terminal,
              },
              {
                name: "Web Fetch",
                tools: "fetch, parse, scrape",
                icon: Terminal,
              },
              {
                name: "Database",
                tools: "query, schema, migrate",
                icon: Terminal,
              },
              {
                name: "AI Manager",
                tools: "chat, complete, embed",
                icon: Terminal,
              },
            ].map((plugin) => (
              <div
                key={plugin.name}
                className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-4"
              >
                <h3 className="font-mono text-sm font-semibold">
                  {plugin.name}
                </h3>
                <p className="mt-1 text-xs text-[#666]">{plugin.tools}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            External Plugins
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#888]">
            Drop .js files into{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 text-xs">
              ~/.conductor/plugins/
            </code>{" "}
            to add external plugins. Each file must export a default class
            implementing the Plugin interface.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]">
            <pre className="p-4 text-xs font-mono text-[#ccc]">
              <code>{`// ~/.conductor/plugins/my-plugin.js
export default class MyPlugin {
  name = "my-plugin";
  description = "My custom plugin";
  version = "1.0.0";

  async initialize(conductor) {
    // Setup
  }

  isConfigured() {
    return true;
  }

  getTools() {
    return [
      {
        name: "my-tool",
        description: "Does something useful",
        inputSchema: { type: "object", properties: {} },
        handler: async (args) => {
          return { content: [{ type: "text", text: "Done!" }] };
        }
      }
    ];
  }
}`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Plugin Configuration
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#888]">
            Plugins can define a configSchema for setup via{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 text-xs">
              conductor config setup &lt;plugin&gt;
            </code>
            . Secret fields are stored in the OS keychain.
          </p>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/security"
          className="inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-white"
        >
          Next: Security
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
