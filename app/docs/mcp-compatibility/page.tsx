import { CopyButton } from "@/components/copy-button";

interface Client {
  name: string;
  description: string;
  configPath: { label: string; path: string }[];
  config: string;
  notes?: string;
  link: string;
}

const stdioConfig = (variant: "global" | "npx" = "global") =>
  variant === "global"
    ? `{
  "mcpServers": {
    "conductor": {
      "command": "conductor",
      "args": ["mcp", "start"]
    }
  }
}`
    : `{
  "mcpServers": {
    "conductor": {
      "command": "npx",
      "args": ["-y", "@conductor/cli", "mcp", "start"]
    }
  }
}`;

const clients: Client[] = [
  {
    name: "Claude Desktop",
    description:
      "Anthropic's desktop application. The reference MCP client — full tool support, approval prompts, and streaming.",
    configPath: [
      {
        label: "macOS",
        path: "~/Library/Application Support/Claude/claude_desktop_config.json",
      },
      {
        label: "Windows",
        path: "%APPDATA%\\Claude\\claude_desktop_config.json",
      },
    ],
    config: stdioConfig("global"),
    notes:
      "Restart Claude Desktop after editing the config. The server appears under Settings > MCP Servers.",
    link: "https://claude.ai/download",
  },
  {
    name: "Cursor",
    description:
      "AI-native code editor built on VS Code. Supports MCP tools in Composer and Chat contexts.",
    configPath: [
      { label: "Project (recommended)", path: ".cursor/mcp.json" },
      { label: "Global", path: "~/.cursor/mcp.json" },
    ],
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "conductor",
      "args": ["mcp", "start"],
      "env": {}
    }
  }
}`,
    notes:
      "Project-level config takes precedence. After saving, reload Cursor (Cmd/Ctrl+Shift+P > Reload Window).",
    link: "https://cursor.com",
  },
  {
    name: "Cline (VS Code)",
    description:
      "Open-source AI coding agent extension for VS Code with full MCP support.",
    configPath: [
      {
        label: "VS Code Settings",
        path: "settings.json → cline.mcpServers",
      },
    ],
    config: `// In VS Code settings.json
{
  "cline.mcpServers": {
    "conductor": {
      "command": "conductor",
      "args": ["mcp", "start"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}`,
    notes:
      "Open VS Code settings (Cmd+, or Ctrl+,), click 'Edit in settings.json', and add the mcpServers entry. Or configure via the Cline panel > MCP Servers tab.",
    link: "https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev",
  },
  {
    name: "Continue.dev",
    description:
      "Open-source AI code assistant for VS Code and JetBrains with MCP tool support.",
    configPath: [{ label: "Config file", path: "~/.continue/config.json" }],
    config: `{
  "models": [...],
  "mcpServers": [
    {
      "name": "conductor",
      "command": "conductor",
      "args": ["mcp", "start"]
    }
  ]
}`,
    notes: "After editing config.json, reload Continue with the refresh button in the Continue panel.",
    link: "https://continue.dev",
  },
  {
    name: "Windsurf (Codeium)",
    description:
      "AI-first code editor from Codeium with Cascade agent that supports MCP.",
    configPath: [
      {
        label: "Config file",
        path: "~/.codeium/windsurf/mcp_settings.json",
      },
    ],
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "conductor",
      "args": ["mcp", "start"],
      "disabled": false
    }
  }
}`,
    notes: "Restart Windsurf after editing. MCP tools appear in the Cascade context.",
    link: "https://codeium.com/windsurf",
  },
  {
    name: "Zed",
    description:
      "High-performance multiplayer code editor with native MCP support in AI assistant.",
    configPath: [{ label: "Config file", path: "~/.config/zed/settings.json" }],
    config: `{
  "assistant": {
    "version": "2",
    "default_model": { "provider": "anthropic", "model": "claude-opus-4-5" }
  },
  "context_servers": {
    "conductor": {
      "command": {
        "path": "conductor",
        "args": ["mcp", "start"]
      }
    }
  }
}`,
    notes: "Zed uses 'context_servers' instead of 'mcpServers'. Restart Zed after editing.",
    link: "https://zed.dev",
  },
  {
    name: "Neovim (mcphub.nvim)",
    description:
      "Neovim plugin that integrates MCP servers with any Neovim AI assistant.",
    configPath: [{ label: "Lazy.nvim config", path: "~/.config/nvim/lua/plugins/mcphub.lua" }],
    config: `-- lazy.nvim plugin spec
{
  "ravitemer/mcphub.nvim",
  config = function()
    require("mcphub").setup({
      servers = {
        conductor = {
          command = "conductor",
          args = { "mcp", "start" },
        }
      }
    })
  end
}`,
    notes: "Works with Avante.nvim, codecompanion.nvim, and other Neovim AI plugins.",
    link: "https://github.com/ravitemer/mcphub.nvim",
  },
  {
    name: "Aider",
    description:
      "Terminal-based AI coding assistant with MCP tool support.",
    configPath: [
      { label: "CLI flag", path: "--mcp-server-command" },
      { label: "Config file", path: "~/.aider.conf.yml" },
    ],
    config: `# .aider.conf.yml
mcp_server_command:
  - conductor
  - mcp
  - start

# Or via CLI flag:
# aider --mcp-server-command "conductor mcp start"`,
    notes: "MCP tools appear in Aider's tool-use mode. Use --no-auto-commits if using write tools.",
    link: "https://aider.chat",
  },
  {
    name: "OpenAI Desktop",
    description:
      "OpenAI's desktop app with MCP support for GPT-4 and o-series models.",
    configPath: [
      {
        label: "macOS",
        path: "~/Library/Application Support/OpenAI/Desktop/mcp_servers.json",
      },
    ],
    config: stdioConfig("global"),
    notes:
      "OpenAI Desktop MCP support is in beta. Check the OpenAI Desktop release notes for the current config format.",
    link: "https://openai.com/chatgpt/desktop",
  },
  {
    name: "Gemini CLI",
    description:
      "Google's Gemini CLI tool with MCP server support.",
    configPath: [{ label: "Config file", path: "~/.gemini/settings.json" }],
    config: `{
  "mcpServers": {
    "conductor": {
      "command": "conductor",
      "args": ["mcp", "start"]
    }
  }
}`,
    notes: "Install with: npm install -g @google/gemini-cli",
    link: "https://github.com/google-gemini/gemini-cli",
  },
  {
    name: "VS Code (GitHub Copilot)",
    description:
      "GitHub Copilot in VS Code now supports MCP servers for tool use in agent mode.",
    configPath: [
      { label: "VS Code settings.json", path: "mcp.servers" },
    ],
    config: `// .vscode/mcp.json (project-level, recommended)
{
  "servers": {
    "conductor": {
      "type": "stdio",
      "command": "conductor",
      "args": ["mcp", "start"]
    }
  }
}`,
    notes:
      "Requires VS Code 1.99+ and GitHub Copilot Chat extension. Enable 'github.copilot.chat.mcp.enabled' in settings.",
    link: "https://code.visualstudio.com",
  },
];

export default function MCPCompatibilityPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="font-mono text-xs text-[#555] uppercase tracking-widest">
          MCP Compatibility
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Works with every MCP client
        </h1>
        <p className="text-[#888] leading-relaxed max-w-2xl">
          Conductor speaks the Model Context Protocol — the open standard for
          connecting AI agents to tools. Any client that supports MCP via stdio
          transport connects to Conductor in under a minute.
        </p>
      </div>

      {/* Auto-setup */}
      <div className="border border-[#1a1a1a] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <h2 className="font-semibold text-white">Auto-configure any client</h2>
        </div>
        <p className="text-[#888] text-sm leading-relaxed">
          The quickest way to connect any supported client is the interactive
          setup command. It detects installed clients and writes the config
          automatically.
        </p>
        <div className="border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2">
            <span className="font-mono text-xs text-[#555]">bash</span>
            <CopyButton text="conductor mcp setup" />
          </div>
          <pre className="p-4 font-mono text-sm text-[#888]">
            {`# Detects Claude Desktop, Cursor, Cline, and more
conductor mcp setup

# Or target a specific client:
conductor mcp setup --client claude
conductor mcp setup --client cursor`}
          </pre>
        </div>
      </div>

      {/* Client list */}
      <div className="space-y-8">
        <h2 className="text-xl font-semibold">Manual configuration</h2>
        <p className="text-[#888] text-sm">
          If you prefer manual setup, find your client below and add the config
          block to the appropriate file.
        </p>

        {clients.map((client) => (
          <div key={client.name} className="border border-[#1a1a1a] p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white">{client.name}</h3>
                <p className="text-[#888] text-sm mt-1">{client.description}</p>
              </div>
              <a
                href={client.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-mono text-[#555] hover:text-white border border-[#1a1a1a] px-2 py-1 transition-colors"
              >
                ↗ {client.link.split("//")[1]?.split("/")[0]}
              </a>
            </div>

            {/* Config file paths */}
            <div className="space-y-1">
              {client.configPath.map((p) => (
                <div key={p.label} className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-xs text-[#555] w-28 shrink-0">
                    {p.label}
                  </span>
                  <code className="font-mono text-xs text-[#888] bg-[#0a0a0a] px-2 py-1 rounded flex-1">
                    {p.path}
                  </code>
                </div>
              ))}
            </div>

            {/* Config block */}
            <div className="border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2">
                <span className="font-mono text-xs text-[#555]">json</span>
                <CopyButton text={client.config} />
              </div>
              <pre className="p-4 font-mono text-xs text-[#888] overflow-x-auto leading-relaxed">
                {client.config}
              </pre>
            </div>

            {/* Notes */}
            {client.notes && (
              <p className="text-xs text-[#555] leading-relaxed">
                ℹ {client.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* npx fallback */}
      <div className="border border-[#1a1a1a] p-6 space-y-4">
        <h2 className="font-semibold text-white">No global install? Use npx.</h2>
        <p className="text-[#888] text-sm leading-relaxed">
          If you haven&apos;t installed Conductor globally, replace{" "}
          <code className="font-mono text-xs bg-[#111] px-1 rounded text-white">
            conductor
          </code>{" "}
          with the npx equivalent in any config above:
        </p>
        <div className="border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2">
            <span className="font-mono text-xs text-[#555]">json</span>
            <CopyButton text={stdioConfig("npx")} />
          </div>
          <pre className="p-4 font-mono text-xs text-[#888]">
            {stdioConfig("npx")}
          </pre>
        </div>
      </div>

      {/* Transport note */}
      <div className="border border-[#1a1a1a] p-5 space-y-2">
        <h3 className="text-sm font-semibold text-white">Transport: stdio vs HTTP/SSE</h3>
        <p className="text-xs text-[#555] leading-relaxed">
          All AI client configs above use <strong className="text-[#888]">stdio transport</strong>{" "}
          — the client spawns the Conductor process and communicates over stdin/stdout. This is the
          recommended transport for local use. Conductor also supports{" "}
          <strong className="text-[#888]">HTTP/SSE transport</strong> for remote
          deployments:{" "}
          <code className="font-mono bg-[#0a0a0a] px-1 rounded">
            conductor mcp start --transport http --port 3000
          </code>
        </p>
      </div>
    </div>
  );
}
