// FILE: app/docs/integrations/slack/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const conductorConfig = `{
  "plugins": {
    "slack": {
      "token": "xoxb-your-bot-token-here",
      "signing_secret": "your-signing-secret"
    }
  }
}`;

const socketModeConfig = `{
  "plugins": {
    "slack": {
      "token": "xoxb-your-bot-token-here",
      "app_token": "xapp-1-your-app-level-token",
      "socket_mode": true
    }
  }
}`;

const sendMessageExample = `// Send a message to a channel
slack.message.send({
  channel: "C0123456789",   // channel ID, not name
  text: "Hello from Conductor!"
})

// Send with blocks (Block Kit)
slack.message.send({
  channel: "C0123456789",
  text: "Fallback text",
  blocks: [
    {
      type: "section",
      text: { type: "mrkdwn", text: "*Hello!* This is a block message." }
    }
  ]
})`;

const threadReplyExample = `// Reply in a thread
slack.thread.reply({
  channel: "C0123456789",
  thread_ts: "1683000000.123456",  // timestamp of the parent message
  text: "This is a thread reply"
})`;

const listMessagesExample = `// List recent messages in a channel
slack.message.list({
  channel: "C0123456789",
  limit: 50,
  oldest: "1683000000",   // Unix timestamp — optional
  latest: "1684000000"    // Unix timestamp — optional
})`;

const reactionExample = `// Add a reaction to a message
slack.reaction.add({
  channel: "C0123456789",
  timestamp: "1683000000.123456",
  name: "thumbsup"   // emoji name without colons
})`;

const fileUploadExample = `// Upload a file to a channel
slack.file.upload({
  channels: ["C0123456789"],
  content: "File contents here as a string",
  filename: "report.txt",
  title: "My Report"
})`;

const findChannelIdNote = `// Channel IDs look like: C0123456789
// To find a channel ID in Slack:
// 1. Right-click the channel name → "Copy link"
//    The link ends in /C0123456789 — that's the ID
// 2. Or: channel details → scroll to bottom → "Channel ID"
//
// Workspace ID (team ID) looks like: T0123456789
// Settings & administration → Workspace settings
// The URL contains /T0123456789`;

const scopes = [
  { scope: "channels:read", description: "List public channels and see channel info" },
  { scope: "channels:history", description: "Read messages in public channels the bot has joined" },
  { scope: "channels:join", description: "Allow bot to join public channels" },
  { scope: "chat:write", description: "Send messages as the bot" },
  { scope: "chat:write.public", description: "Send messages to channels the bot hasn't joined" },
  { scope: "users:read", description: "View basic user info (name, email with users:read.email)" },
  { scope: "users:read.email", description: "View email addresses of users" },
  { scope: "files:read", description: "Read files shared in channels the bot can access" },
  { scope: "files:write", description: "Upload, edit, and delete files" },
  { scope: "reactions:read", description: "View emoji reactions and their authors" },
  { scope: "reactions:write", description: "Add and remove emoji reactions" },
  { scope: "im:read", description: "View direct messages that the bot is in" },
  { scope: "im:write", description: "Start direct messages with people" },
  { scope: "im:history", description: "Read messages in direct message conversations" },
  { scope: "groups:read", description: "View basic info about private channels the bot is in" },
  { scope: "groups:history", description: "Read messages in private channels the bot has joined" },
  { scope: "mpim:read", description: "View basic info about group direct messages the bot is in" },
  { scope: "mpim:history", description: "Read messages in group direct messages" },
];

const rateLimits = [
  { tier: "Tier 1", rateLimit: "~1 req/min", methods: "files.list, conversations.list, users.list" },
  { tier: "Tier 2", rateLimit: "~20 req/min", methods: "conversations.history, conversations.replies" },
  { tier: "Tier 3", rateLimit: "~50 req/min", methods: "chat.postMessage, reactions.add" },
  { tier: "Tier 4", rateLimit: "~100 req/min", methods: "auth.test, users.info" },
  { tier: "Special", rateLimit: "1 msg/sec per channel", methods: "chat.postMessage (per channel limit)" },
];

const errors = [
  { code: "channel_not_found", cause: "Channel ID is wrong or bot can't see the channel", fix: "Verify the channel ID. Make sure it's a channel ID (C...) not a name." },
  { code: "not_in_channel", cause: "Bot is not a member of the channel", fix: "Invite the bot: /invite @YourBotName in the channel, or add channels:join scope." },
  { code: "missing_scope", cause: "Token doesn't have the required OAuth scope", fix: "Add the scope in your Slack App settings → OAuth & Permissions, then reinstall." },
  { code: "token_revoked", cause: "The token has been revoked by an admin or user", fix: "Reinstall the app to the workspace to get a fresh token." },
  { code: "ratelimited", cause: "Too many API requests too quickly", fix: "Respect the Retry-After header. Implement exponential backoff." },
  { code: "invalid_auth", cause: "The token format is wrong or the token is invalid", fix: "Check the token starts with xoxb- (bot) or xoxp- (user). No extra spaces." },
  { code: "account_inactive", cause: "The Slack account associated with the token is deactivated", fix: "Reauthorize with an active account. For bot tokens, the app itself must be active." },
];

const tools = [
  { name: "slack.message.send", description: "Post a message to a channel or DM. Supports plain text and Block Kit blocks." },
  { name: "slack.message.list", description: "Fetch recent messages from a channel. Supports pagination and time-range filtering." },
  { name: "slack.channel.list", description: "List all public (and optionally private) channels in the workspace." },
  { name: "slack.channel.create", description: "Create a new channel. Bot must have channels:manage scope." },
  { name: "slack.channel.archive", description: "Archive an existing channel. Requires channels:manage scope." },
  { name: "slack.user.list", description: "List all users in the workspace including bots and deactivated accounts." },
  { name: "slack.user.info", description: "Get detailed profile info for a specific user by their user ID." },
  { name: "slack.file.upload", description: "Upload a file and optionally share it to one or more channels." },
  { name: "slack.reaction.add", description: "Add an emoji reaction to a specific message by channel and timestamp." },
  { name: "slack.thread.reply", description: "Reply to a message in its thread using the parent message's timestamp." },
];

export default function SlackIntegrationPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Slack</h1>
        <p className="mt-3 text-sm text-[#666]">
          Connect Conductor to Slack to send messages, manage channels, list users, upload files,
          and react to messages. Covers bot tokens, user tokens, OAuth scopes, Socket Mode for
          local dev, and every common error you'll hit.
        </p>
      </div>

      {/* Auth approaches */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Authentication</h2>
        <p className="mb-4 text-sm text-[#666]">
          Slack supports two token types. For Conductor, <strong className="text-[#aaa]">bot tokens</strong> are
          almost always the right choice. User tokens act on behalf of a specific person and are
          better suited to personal automation.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-1 font-mono text-xs font-semibold text-white">Bot Token (xoxb-)</p>
            <p className="text-xs text-[#555]">
              Issued to the Slack App itself. Acts as the bot user. Scoped to what the app is allowed
              to do. Recommended for shared workflows, automations, and production integrations.
              Stays valid until revoked.
            </p>
          </div>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-1 font-mono text-xs font-semibold text-white">User Token (xoxp-)</p>
            <p className="text-xs text-[#555]">
              Acts as a specific Slack user. Can read DMs and private channels that user has access
              to. Useful for personal scripts. Gets revoked when the user logs out or changes
              password. Less preferred for production.
            </p>
          </div>
        </div>
      </section>

      {/* Creating a Slack App */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Creating a Slack App</h2>
        <ol className="space-y-2 text-sm text-[#666]">
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">01</span>
            <span>Go to <span className="font-mono text-[#888]">api.slack.com/apps</span> and click <strong className="text-[#aaa]">Create New App</strong>.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">02</span>
            <span>Choose <strong className="text-[#aaa]">From scratch</strong>. Give it a name and pick your workspace.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">03</span>
            <span>Under <strong className="text-[#aaa]">OAuth & Permissions</strong>, scroll to <strong className="text-[#aaa]">Bot Token Scopes</strong> and add the scopes you need (see table below).</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">04</span>
            <span>Click <strong className="text-[#aaa]">Install to Workspace</strong>. Authorize on the OAuth screen.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">05</span>
            <span>Copy the <strong className="text-[#aaa]">Bot User OAuth Token</strong> (starts with <span className="font-mono text-[#888]">xoxb-</span>). This goes in your Conductor config.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">06</span>
            <span>Under <strong className="text-[#aaa]">Basic Information → App Credentials</strong>, copy your <strong className="text-[#aaa]">Signing Secret</strong>.</span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-[#444]">
          You can customize the bot's display name and icon under <strong className="text-[#666]">App Home → Your App's Presence in Slack</strong>.
          The display name is what appears in channels when the bot posts messages.
        </p>
      </section>

      {/* OAuth Scopes */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">OAuth Scopes</h2>
        <p className="mb-4 text-sm text-[#666]">
          Add these under <span className="font-mono text-[#888]">OAuth & Permissions → Bot Token Scopes</span>.
          Start with the minimum you need — Slack lets you add scopes later (but requires reinstalling the app after changes).
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
          <table className="w-full text-xs">
            <thead className="bg-[#080808]">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Scope</th>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">What it allows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
              {scopes.map((s) => (
                <tr key={s.scope}>
                  <td className="px-4 py-2.5 font-mono text-[#888]">{s.scope}</td>
                  <td className="px-4 py-2.5 text-[#555]">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[#444]">
          After adding scopes, always click <strong className="text-[#666]">Reinstall to Workspace</strong>. Scopes only take effect after reinstall.
        </p>
      </section>

      {/* Socket Mode */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Socket Mode (local dev)</h2>
        <p className="mb-4 text-sm text-[#666]">
          Socket Mode lets your app receive events over a persistent WebSocket connection instead of
          requiring a public HTTPS URL. This is ideal for local development or environments behind a
          firewall. To enable it, go to <strong className="text-[#aaa]">Socket Mode</strong> in your app settings,
          toggle it on, and generate an <strong className="text-[#aaa]">App-Level Token</strong> with the
          <span className="font-mono text-[#888]"> connections:write</span> scope. App-level tokens start
          with <span className="font-mono text-[#888]">xapp-</span>.
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
            <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.json — socket mode</span>
            <CopyButton text={socketModeConfig} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{socketModeConfig}</code></pre>
        </div>
        <p className="mt-3 text-xs text-[#444]">
          Event subscriptions still need to be configured in your app settings under
          <strong className="text-[#666]"> Event Subscriptions</strong>, even when using Socket Mode.
          Subscribe to events like <span className="font-mono text-[#666]">message.channels</span>,
          <span className="font-mono text-[#666]"> message.im</span>, and <span className="font-mono text-[#666]">app_mention</span>.
        </p>
      </section>

      {/* Conductor Config */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Conductor config</h2>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
            <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.json</span>
            <CopyButton text={conductorConfig} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfig}</code></pre>
        </div>
        <p className="mt-3 text-xs text-[#444]">
          Store your bot token in an environment variable and reference it via{" "}
          <span className="font-mono text-[#666]">${"{SLACK_BOT_TOKEN}"}</span> rather than hardcoding it.
          Never commit tokens to source control.
        </p>
      </section>

      {/* Available Tools */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Available tools</h2>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
          <table className="w-full text-xs">
            <thead className="bg-[#080808]">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Tool</th>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
              {tools.map((t) => (
                <tr key={t.name}>
                  <td className="px-4 py-2.5 font-mono text-[#888]">{t.name}</td>
                  <td className="px-4 py-2.5 text-[#555]">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage examples */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Usage examples</h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-[#555]">Sending messages</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">slack.message.send</span>
                <CopyButton text={sendMessageExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{sendMessageExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Replying to threads</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">slack.thread.reply</span>
                <CopyButton text={threadReplyExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{threadReplyExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Uploading files</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">slack.file.upload</span>
                <CopyButton text={fileUploadExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{fileUploadExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Adding reactions</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">slack.reaction.add</span>
                <CopyButton text={reactionExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{reactionExample}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Finding IDs */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Finding channel and workspace IDs</h2>
        <p className="mb-3 text-sm text-[#666]">
          Slack's API always uses IDs, never names. Channel names can change; IDs cannot.
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
            <span className="font-mono text-[10px] text-[#3a3a3a]">finding IDs</span>
            <CopyButton text={findChannelIdNote} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{findChannelIdNote}</code></pre>
        </div>
      </section>

      {/* Rate limits */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Rate limits</h2>
        <p className="mb-4 text-sm text-[#666]">
          Slack uses a tiered rate limit system. Each API method belongs to a tier.
          When you exceed a tier's limit, the API returns HTTP 429 with a{" "}
          <span className="font-mono text-[#888]">Retry-After</span> header specifying seconds to wait.
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
          <table className="w-full text-xs">
            <thead className="bg-[#080808]">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Tier</th>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Rate limit</th>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Example methods</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
              {rateLimits.map((r) => (
                <tr key={r.tier}>
                  <td className="px-4 py-2.5 font-mono text-[#888]">{r.tier}</td>
                  <td className="px-4 py-2.5 text-[#888]">{r.rateLimit}</td>
                  <td className="px-4 py-2.5 text-[#555]">{r.methods}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Common errors */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Common errors</h2>
        <div className="space-y-2">
          {errors.map((e) => (
            <div key={e.code} className="rounded-lg border border-[#1a1a1a] bg-[#060606] p-4">
              <p className="mb-1 font-mono text-xs text-[#888]">{e.code}</p>
              <p className="mb-1 text-xs text-[#555]">{e.cause}</p>
              <p className="text-xs text-[#444]">Fix: {e.fix}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Security best practices</h2>
        <ul className="space-y-2 text-sm text-[#666]">
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">—</span>
            <span>Store tokens in environment variables or a secrets manager. Never hardcode them in config files committed to source control.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">—</span>
            <span>Request only the scopes your integration actually needs. Slack's principle of least privilege reduces blast radius if a token is leaked.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">—</span>
            <span>Rotate tokens periodically and immediately if you suspect compromise. Revoke old tokens under <strong className="text-[#aaa]">OAuth & Permissions → Revoke tokens</strong>.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">—</span>
            <span>For production, use a dedicated bot account rather than a personal user token. This way the integration doesn't break if someone leaves the team.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">—</span>
            <span>Verify the <span className="font-mono text-[#888]">X-Slack-Signature</span> header on incoming webhooks using your signing secret to prevent spoofed requests.</span>
          </li>
        </ul>
      </section>

      {/* Back link */}
      <div className="border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/integrations"
          className="group inline-flex items-center gap-2 font-mono text-xs text-[#444] transition-colors hover:text-[#888]"
        >
          <ArrowRight className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
          All integrations
        </Link>
      </div>
    </div>
  );
}
