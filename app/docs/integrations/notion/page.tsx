// FILE: app/docs/integrations/notion/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const conductorConfig = `{
  "plugins": {
    "notion": {
      "token": "secret_your-internal-integration-token"
    }
  }
}`;

const oauthConfig = `{
  "plugins": {
    "notion": {
      "client_id": "your-oauth-client-id",
      "client_secret": "your-oauth-client-secret",
      "redirect_uri": "https://yourapp.com/notion/callback",
      "access_token": "access_token_from_exchange"
    }
  }
}`;

const pageGetExample = `// Get a page by ID
notion.page.get({
  page_id: "abc12345-6789-def0-1234-abcdef012345"
})

// The page ID from a Notion URL:
// https://notion.so/My-Page-abc123456789def01234abcdef012345
//                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Strip hyphens if needed — Conductor accepts both formats`;

const databaseQueryExample = `// Query a database with filters and sorts
notion.database.query({
  database_id: "abc12345-6789-def0-1234-abcdef012345",
  filter: {
    and: [
      {
        property: "Status",
        select: { equals: "In Progress" }
      },
      {
        property: "Due Date",
        date: { on_or_before: "2024-12-31" }
      }
    ]
  },
  sorts: [
    { property: "Due Date", direction: "ascending" }
  ],
  page_size: 25
})`;

const pageCreateExample = `// Create a page in a database
notion.page.create({
  parent: { database_id: "abc12345-6789-def0-1234-abcdef012345" },
  properties: {
    "Name": {
      title: [{ text: { content: "New task" } }]
    },
    "Status": {
      select: { name: "To Do" }
    },
    "Due Date": {
      date: { start: "2024-06-15" }
    },
    "Priority": {
      select: { name: "High" }
    }
  }
})

// Create a subpage under another page
notion.page.create({
  parent: { page_id: "parent-page-id-here" },
  properties: {
    title: [{ text: { content: "My Subpage" } }]
  }
})`;

const blockAppendExample = `// Append blocks to a page
notion.block.append({
  block_id: "abc12345-6789-def0-1234-abcdef012345",
  children: [
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "Section Title" } }]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          { type: "text", text: { content: "Normal text " } },
          {
            type: "text",
            text: { content: "bold text" },
            annotations: { bold: true }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [{ type: "text", text: { content: "A list item" } }]
      }
    }
  ]
})`;

const searchExample = `// Search across all pages and databases accessible to your integration
notion.search({
  query: "project roadmap",
  filter: { value: "page", property: "object" },  // "page" or "database"
  sort: { direction: "descending", timestamp: "last_edited_time" },
  page_size: 10
})`;

const oauthExchangeExample = `// After user completes OAuth consent, exchange the code for a token
POST https://api.notion.com/v1/oauth/token
Authorization: Basic base64(client_id:client_secret)
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "code_from_redirect",
  "redirect_uri": "https://yourapp.com/notion/callback"
}

// Response includes:
// access_token — store this in Conductor config
// workspace_id — the workspace the user authorized
// workspace_name — human-readable name
// bot_id — the bot ID for your integration in this workspace`;

const findIdNote = `// Finding Page IDs from Notion URLs:
// https://www.notion.so/workspace/My-Page-Title-abc123456789def01234abcdef012345
//                                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// That 32-char hex string is the page ID.
// With hyphens: abc12345-6789-def0-1234-abcdef012345

// Finding Database IDs:
// Open the database as a full page, then copy the URL.
// Same pattern — 32-char hex string at the end.

// From an inline database, click "..." → "Open as full page" first.`;

const propertyTypes = [
  { type: "title", format: '{ title: [{ text: { content: "..." } }] }', notes: "Required for all pages. Every database has one title property." },
  { type: "rich_text", format: '{ rich_text: [{ text: { content: "..." } }] }', notes: "Multi-line text. Supports annotations (bold, italic, etc.)." },
  { type: "number", format: "{ number: 42 }", notes: "Numeric value. Can be formatted as currency, percentage, etc." },
  { type: "select", format: '{ select: { name: "Option" } }', notes: "Single choice from a predefined list. Creates new option if not found." },
  { type: "multi_select", format: '{ multi_select: [{ name: "Tag1" }, { name: "Tag2" }] }', notes: "Multiple choices. Order is preserved." },
  { type: "date", format: '{ date: { start: "2024-06-01", end: "2024-06-30" } }', notes: "ISO 8601 date or datetime. end is optional for date ranges." },
  { type: "checkbox", format: "{ checkbox: true }", notes: "Boolean true/false." },
  { type: "url", format: '{ url: "https://example.com" }', notes: "URL string." },
  { type: "email", format: '{ email: "user@example.com" }', notes: "Email address string." },
  { type: "phone_number", format: '{ phone_number: "+1 555-555-5555" }', notes: "Phone number string. No validation enforced." },
  { type: "relation", format: '{ relation: [{ id: "page-id" }] }', notes: "References other pages by ID. The target must be accessible to your integration." },
  { type: "formula", format: "read-only", notes: "Computed value. Cannot be set directly; determined by Notion's formula engine." },
];

const errors = [
  { code: "object_not_found (404)", cause: "Page or database exists but your integration has not been shared access to it", fix: "Open the page in Notion → click Share → Invite → search for your integration name → Invite." },
  { code: "unauthorized (401)", cause: "Token is invalid, expired, or belongs to a different workspace", fix: "Verify the token starts with secret_ for internal integrations. Regenerate if needed." },
  { code: "validation_error (400)", cause: "The request body has invalid field values or missing required fields", fix: "Check the property type matches what the database expects. Read the error message detail field." },
  { code: "rate_limited (429)", cause: "Exceeded 3 requests/second", fix: "Slow down requests. Implement exponential backoff. Retry after the Retry-After header value." },
  { code: "restricted_resource (403)", cause: "Integration lacks capability for this action (e.g., insert but not update)", fix: "Check integration capabilities under your integration settings at notion.so/my-integrations." },
  { code: "Could not find page/database", cause: "Passing the page URL or name instead of the UUID", fix: "Use the 32-character UUID from the URL, not the page title or full URL." },
];

const tools = [
  { name: "notion.page.get", description: "Retrieve a page and its properties by page ID." },
  { name: "notion.page.create", description: "Create a new page inside a database or as a child of another page." },
  { name: "notion.page.update", description: "Update page properties. Cannot update page content — use block.append for that." },
  { name: "notion.database.query", description: "Query a database with optional filters, sorts, and pagination." },
  { name: "notion.database.create", description: "Create a new database as a child of a page." },
  { name: "notion.block.list", description: "List all child blocks of a page or block. Supports pagination." },
  { name: "notion.block.append", description: "Append new blocks to a page or existing block. Supports all block types." },
  { name: "notion.search", description: "Search across all pages and databases the integration has access to." },
  { name: "notion.user.list", description: "List all users in the workspace (requires user permissions capability)." },
];

export default function NotionIntegrationPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Notion</h1>
        <p className="mt-3 text-sm text-[#666]">
          Read and write Notion pages, databases, and blocks through Conductor. Covers internal
          integrations (the quick path), OAuth for multi-workspace apps, the critical page-sharing
          step that trips up almost everyone, and all database property types.
        </p>
      </div>

      {/* Auth approaches */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Authentication</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-1 font-mono text-xs font-semibold text-white">Internal Integration</p>
            <p className="text-xs text-[#555]">
              The simplest option. Creates a bot that lives entirely within one workspace. You get
              a secret token (starts with <span className="font-mono text-[#777]">secret_</span>) and
              manually share pages with it. Best for personal use, team automation, and single-workspace tools.
            </p>
          </div>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-1 font-mono text-xs font-semibold text-white">OAuth (Public Integration)</p>
            <p className="text-xs text-[#555]">
              Required if you're building a product that other Notion users will connect to. Users
              authorize via a Notion consent screen. You receive a per-workspace access token after
              the OAuth exchange. More complex to set up, but scales to multiple workspaces.
            </p>
          </div>
        </div>
      </section>

      {/* Creating internal integration */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Creating an internal integration</h2>
        <ol className="space-y-2 text-sm text-[#666]">
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">01</span>
            <span>Go to <span className="font-mono text-[#888]">notion.so/my-integrations</span> and click <strong className="text-[#aaa]">New integration</strong>.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">02</span>
            <span>Give it a name. Associate it with your workspace. Set it to <strong className="text-[#aaa]">Internal</strong>.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">03</span>
            <span>Under <strong className="text-[#aaa]">Capabilities</strong>, choose what the integration can do:
              <span className="font-mono text-[#777]"> Read content</span>,{" "}
              <span className="font-mono text-[#777]">Update content</span>, and{" "}
              <span className="font-mono text-[#777]">Insert content</span>.
              Note: <strong className="text-[#aaa]">Delete is not available</strong> by design — Notion doesn't expose a delete API.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">04</span>
            <span>Click <strong className="text-[#aaa]">Save</strong>, then copy the <strong className="text-[#aaa]">Internal Integration Secret</strong> (the <span className="font-mono text-[#888]">secret_...</span> token).</span>
          </li>
        </ol>
      </section>

      {/* THE CRITICAL STEP */}
      <section>
        <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-5">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#666]">
            Critical step — most common mistake
          </p>
          <h2 className="mb-3 font-mono text-lg font-semibold text-white">Share pages with your integration</h2>
          <p className="mb-3 text-sm text-[#666]">
            Internal integrations <strong className="text-[#aaa]">cannot see any pages by default</strong>.
            You must explicitly share each page (or a top-level page, which grants access to all children) with your integration.
          </p>
          <ol className="space-y-2 text-sm text-[#666]">
            <li className="flex gap-3">
              <span className="mt-0.5 font-mono text-[10px] text-[#333]">01</span>
              <span>Open the page in Notion you want Conductor to access.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 font-mono text-[10px] text-[#333]">02</span>
              <span>Click <strong className="text-[#aaa]">Share</strong> in the top-right corner.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 font-mono text-[10px] text-[#333]">03</span>
              <span>Click <strong className="text-[#aaa]">Invite</strong>, then search for your integration name.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 font-mono text-[10px] text-[#333]">04</span>
              <span>Click <strong className="text-[#aaa]">Invite</strong> to confirm. The integration will now have access to that page and all its children.</span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-[#444]">
            If you get <span className="font-mono text-[#666]">object_not_found</span> when calling the API,
            this is almost always the cause. The page exists — the integration just can't see it yet.
          </p>
        </div>
      </section>

      {/* Finding IDs */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Finding page and database IDs</h2>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
            <span className="font-mono text-[10px] text-[#3a3a3a]">finding IDs from URLs</span>
            <CopyButton text={findIdNote} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{findIdNote}</code></pre>
        </div>
      </section>

      {/* Conductor Config */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Conductor config</h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-[#555]">Internal integration (most common)</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.json</span>
                <CopyButton text={conductorConfig} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfig}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">OAuth (public integration)</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.json — oauth</span>
                <CopyButton text={oauthConfig} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{oauthConfig}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Available tools */}
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

      {/* Property types */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Database property types</h2>
        <p className="mb-4 text-sm text-[#666]">
          When creating or updating pages in a database, you must match the property type exactly.
          The property name is case-sensitive and must match the column name in Notion.
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
          <table className="w-full text-xs">
            <thead className="bg-[#080808]">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Type</th>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Format</th>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
              {propertyTypes.map((p) => (
                <tr key={p.type}>
                  <td className="px-4 py-2.5 font-mono text-[#888]">{p.type}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-[#555]">{p.format}</td>
                  <td className="px-4 py-2.5 text-[#444]">{p.notes}</td>
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
            <p className="mb-2 text-xs text-[#555]">Getting a page</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">notion.page.get</span>
                <CopyButton text={pageGetExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{pageGetExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Querying a database with filters</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">notion.database.query</span>
                <CopyButton text={databaseQueryExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{databaseQueryExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Creating a page in a database</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">notion.page.create</span>
                <CopyButton text={pageCreateExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{pageCreateExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Appending blocks to a page</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">notion.block.append</span>
                <CopyButton text={blockAppendExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{blockAppendExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Searching across all accessible content</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">notion.search</span>
                <CopyButton text={searchExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{searchExample}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* OAuth flow */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">OAuth for multi-workspace use</h2>
        <p className="mb-3 text-sm text-[#666]">
          If you're building a product that other Notion users connect, use the public OAuth flow.
          Create a public integration at <span className="font-mono text-[#888]">notion.so/my-integrations</span>,
          set a redirect URI, and implement the code exchange.
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
            <span className="font-mono text-[10px] text-[#3a3a3a]">OAuth token exchange</span>
            <CopyButton text={oauthExchangeExample} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{oauthExchangeExample}</code></pre>
        </div>
        <p className="mt-3 text-xs text-[#444]">
          The authorization URL follows the pattern:{" "}
          <span className="font-mono text-[#666]">https://api.notion.com/v1/oauth/authorize?client_id=...&response_type=code&owner=user&redirect_uri=...</span>
        </p>
      </section>

      {/* Rich text format */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Rich text format</h2>
        <p className="mb-3 text-sm text-[#666]">
          Notion represents formatted text as an array of rich text objects. Each object has a
          <span className="font-mono text-[#888]"> text</span> field (the content) and an{" "}
          <span className="font-mono text-[#888]">annotations</span> field (the formatting).
          Supported annotations: <span className="font-mono text-[#888]">bold</span>,{" "}
          <span className="font-mono text-[#888]">italic</span>,{" "}
          <span className="font-mono text-[#888]">strikethrough</span>,{" "}
          <span className="font-mono text-[#888]">underline</span>,{" "}
          <span className="font-mono text-[#888]">code</span>,{" "}
          <span className="font-mono text-[#888]">color</span>.
          Links are set via <span className="font-mono text-[#888]">text.link.url</span>.
        </p>
        <p className="text-xs text-[#444]">
          Notion AI blocks cannot be read or written via the API. If a page contains Notion AI
          content, that content will be absent from API responses. This is a Notion platform
          limitation, not a Conductor limitation.
        </p>
      </section>

      {/* Rate limits */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Rate limits</h2>
        <p className="text-sm text-[#666]">
          Notion enforces a limit of <strong className="text-[#aaa]">3 requests per second</strong> per integration.
          Exceeding this returns HTTP 429 with a <span className="font-mono text-[#888]">Retry-After</span> header.
          There are no separate tiers — all API methods share the same 3 req/sec budget.
          For bulk operations (like importing many pages), add a delay between requests or use
          batching where the API supports it (e.g., <span className="font-mono text-[#888]">block.append</span> accepts up to 100 children in one call).
        </p>
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
