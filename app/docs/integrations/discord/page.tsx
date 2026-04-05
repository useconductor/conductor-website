// FILE: app/docs/integrations/discord/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const conductorConfig = `{
  "plugins": {
    "discord": {
      "token": "MTExxxxxxxxxxxxxxxxxxx.Xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "guildId": "123456789012345678"
    }
  }
}`;

const intentsNote = `// Required intents — enable in Discord Developer Portal
// Application → Bot → Privileged Gateway Intents

GUILDS              — basic guild info, channels, roles (non-privileged)
GUILD_MESSAGES      — receive message events in guilds (non-privileged)
GUILD_MEMBERS       — member list and join/leave events (PRIVILEGED)
MESSAGE_CONTENT     — read message content in guild messages (PRIVILEGED)

// Without MESSAGE_CONTENT, message.content will be empty string
// for bot messages unless the message mentions your bot directly.`;

const oauthUrl = `https://discord.com/api/oauth2/authorize
  ?client_id=YOUR_CLIENT_ID
  &permissions=8
  &scope=bot%20applications.commands

# Minimum permissions for most tools (instead of Administrator):
# 1024    — Read Messages / View Channels
# 2048    — Send Messages
# 16384   — Read Message History
# 268435456 — Manage Roles
# Add them together for the permissions integer`;

const slashCommandReg = `# Register slash commands globally (takes up to 1 hour to propagate)
curl -X POST \\
  https://discord.com/api/v10/applications/YOUR_APP_ID/commands \\
  -H "Authorization: Bot YOUR_BOT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"ping","description":"Replies with pong"}'

# Register for a single guild instantly (for development)
curl -X POST \\
  https://discord.com/api/v10/applications/YOUR_APP_ID/guilds/GUILD_ID/commands \\
  -H "Authorization: Bot YOUR_BOT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"ping","description":"Replies with pong"}'`;

const findIdsNote = `// Finding IDs — requires Developer Mode
// Settings → App Settings → Advanced → Developer Mode → ON

// Guild ID:   Right-click the server icon → Copy Server ID
// Channel ID: Right-click any channel → Copy Channel ID
// User ID:    Right-click any username → Copy User ID
// Message ID: Right-click any message → Copy Message ID`;

const tools = [
  { name: "discord.message.send", desc: "Send a message to a channel by channel ID. Supports content, embeds, and components." },
  { name: "discord.message.list", desc: "Fetch recent messages from a channel. Returns author, content, timestamp, and attachments." },
  { name: "discord.channel.list", desc: "List all channels in a guild including type, position, and parent category." },
  { name: "discord.channel.create", desc: "Create a new text, voice, or category channel in a guild." },
  { name: "discord.guild.list", desc: "List all guilds the bot is a member of." },
  { name: "discord.member.list", desc: "List members of a guild. Requires GUILD_MEMBERS privileged intent." },
  { name: "discord.role.list", desc: "List all roles in a guild with name, color, and position." },
  { name: "discord.role.assign", desc: "Assign a role to a guild member by user ID and role ID." },
];

const errors = [
  {
    code: "50001 Missing Access",
    cause: "The bot cannot see the channel or guild resource.",
    fix: "Ensure the bot role has View Channel permission in that channel. Check channel permission overwrites.",
  },
  {
    code: "50013 Missing Permissions",
    cause: "The bot can see the resource but lacks the required permission for the action.",
    fix: "Grant the bot role the specific permission (e.g., Send Messages, Manage Roles). Check per-channel overrides.",
  },
  {
    code: "10003 Unknown Channel",
    cause: "The channel ID does not exist or the bot cannot access it.",
    fix: "Verify the channel ID with Developer Mode. Confirm the bot is in the same guild.",
  },
  {
    code: "10007 Unknown Member",
    cause: "The user is not a member of the guild.",
    fix: "Confirm the user ID and that the user has not left the server.",
  },
  {
    code: "40060 Interaction already acknowledged",
    cause: "An interaction was responded to more than once.",
    fix: "Ensure your interaction handler only calls reply or deferReply once per interaction.",
  },
  {
    code: "Invalid token",
    cause: "The bot token is incorrect, expired, or was regenerated.",
    fix: "Go to Discord Developer Portal → Your App → Bot → Reset Token. Update the Conductor config with the new token.",
  },
  {
    code: "Privileged intent not enabled",
    cause: "GUILD_MEMBERS or MESSAGE_CONTENT intent is used but not enabled in the portal.",
    fix: "Go to Developer Portal → Your App → Bot → Privileged Gateway Intents. Toggle on the required intents.",
  },
  {
    code: "30001 Maximum guilds",
    cause: "The bot is in 100+ guilds without verification.",
    fix: "Apply for bot verification at discord.com/developers if your bot needs to join more than 100 guilds.",
  },
];

export default function DiscordIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Discord</h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to Discord via a bot application. Covers creating an application, bot
          tokens, privileged intents, inviting your bot, finding IDs, slash commands, and all
          available tools.
        </p>
      </div>

      <div className="space-y-14">

        {/* Creating an application */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Creating a Discord application</h2>
          <ol className="space-y-2 text-sm text-[#666]">
            <li className="flex gap-3"><span className="font-mono text-[#444]">1.</span>Go to <span className="font-mono text-[#888]">discord.com/developers/applications</span> and sign in.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">2.</span>Click <span className="font-mono text-[#888]">New Application</span>. Give it a name like "Conductor Bot".</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">3.</span>Go to the <span className="font-mono text-[#888]">Bot</span> tab in the sidebar. Click <span className="font-mono text-[#888]">Add Bot</span>.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">4.</span>Under <span className="font-mono text-[#888]">Token</span>, click <span className="font-mono text-[#888]">Reset Token</span> and copy the token. Store it securely — it is only shown once.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">5.</span>Enable any required Privileged Gateway Intents (see below).</li>
          </ol>
          <div className="mt-4 rounded-lg border border-[#1a1a1a] bg-[#060606] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#3a3a3a]">Important: bot token vs OAuth token</p>
            <p className="mt-2 text-xs text-[#555]">
              Conductor requires the <span className="font-mono text-[#888]">Bot token</span> — found
              under Bot → Token. This is different from the OAuth2 client secret shown on the General
              Information page. Using the OAuth2 client secret as the bot token is a very common
              mistake and will result in an "Invalid token" error.
            </p>
          </div>
        </section>

        {/* Intents */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Gateway intents</h2>
          <p className="mb-3 text-sm text-[#666]">
            Intents control which events the bot receives. Some are privileged and must be explicitly
            enabled in the Developer Portal before they work. Missing a required intent is the most
            common cause of empty responses from member or message tools.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">required intents</span>
              <CopyButton text={intentsNote} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{intentsNote}</code></pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            Enable privileged intents at <span className="font-mono text-[#777]">Developer Portal → Your App → Bot → Privileged Gateway Intents</span>.
          </p>
        </section>

        {/* Inviting the bot */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Inviting the bot to a server</h2>
          <p className="mb-3 text-sm text-[#666]">
            Use the OAuth2 URL Generator in the Developer Portal, or construct the URL manually.
            Go to <span className="font-mono text-[#888]">OAuth2 → URL Generator</span>, select
            the <span className="font-mono text-[#888]">bot</span> and{" "}
            <span className="font-mono text-[#888]">applications.commands</span> scopes, then pick
            the required bot permissions. Copy the generated URL and open it in a browser.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">oauth2 invite url format</span>
              <CopyButton text={oauthUrl} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{oauthUrl}</code></pre>
          </div>
        </section>

        {/* Finding IDs */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Finding Guild, Channel, and User IDs</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">developer mode required</span>
              <CopyButton text={findIdsNote} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{findIdsNote}</code></pre>
          </div>
        </section>

        {/* Conductor config */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Conductor config</h2>
          <p className="mb-3 text-sm text-[#666]">
            The <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">guildId</code>{" "}
            is optional but recommended — it scopes all tool operations to a specific server by
            default. You can still override the guild on a per-call basis.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json</span>
              <CopyButton text={conductorConfig} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfig}</code></pre>
          </div>
        </section>

        {/* Slash commands */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Slash command registration</h2>
          <p className="mb-3 text-sm text-[#666]">
            Global commands propagate to all guilds but take up to 1 hour to update. Guild-scoped
            commands update instantly — use these during development. Conductor can register
            commands on your behalf, or you can register them directly via the Discord API.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">curl — register command</span>
              <CopyButton text={slashCommandReg} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{slashCommandReg}</code></pre>
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Available tools</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Tool</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {tools.map((t) => (
                  <tr key={t.name}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#888]">{t.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Rate limits */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Rate limits</h2>
          <p className="mb-3 text-sm text-[#666]">
            Discord enforces two types of rate limits. Per-route limits apply to specific endpoints
            (e.g., sending messages to a channel has a limit of 5 messages per 5 seconds per
            channel). The global rate limit is 50 requests per second across all routes for a
            single bot token. Conductor handles 429 responses with automatic backoff using the
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs"> retry_after</code>{" "}
            value from the response header.
          </p>
          <p className="text-sm text-[#666]">
            Webhook endpoints have separate rate limits from the bot API: 30 requests per 60
            seconds per webhook.
          </p>
        </section>

        {/* Common errors */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Common errors</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Error</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Cause</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {errors.map((e) => (
                  <tr key={e.code}>
                    <td className="px-4 py-3 font-mono text-xs text-[#888] align-top">{e.code}</td>
                    <td className="px-4 py-3 text-xs text-[#555] align-top">{e.cause}</td>
                    <td className="px-4 py-3 text-xs text-[#444] align-top">{e.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <div className="mt-14 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/integrations"
          className="inline-flex items-center gap-2 text-sm text-[#555] transition-colors hover:text-white"
        >
          All integrations
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
