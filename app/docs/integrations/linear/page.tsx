// FILE: app/docs/integrations/linear/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const conductorConfig = `{
  "plugins": {
    "linear": {
      "api_key": "lin_api_your-personal-api-key"
    }
  }
}`;

const oauthConfig = `{
  "plugins": {
    "linear": {
      "client_id": "your-oauth-client-id",
      "client_secret": "your-oauth-client-secret",
      "redirect_uri": "https://yourapp.com/linear/callback",
      "access_token": "lin_oauth_access_token"
    }
  }
}`;

const createIssueExample = `// Create a new issue
linear.issue.create({
  teamId: "TEAM-UUID-HERE",          // required: UUID, not the slug
  title: "Fix login redirect bug",
  description: "Users are being redirected to /404 after login.",
  priority: 2,                        // 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low
  stateId: "STATE-UUID-HERE",        // optional: UUID of the workflow state
  assigneeId: "USER-UUID-HERE",      // optional
  labelIds: ["LABEL-UUID-1"],        // optional: array of label UUIDs
  projectId: "PROJECT-UUID-HERE"     // optional
})`;

const listIssuesExample = `// List issues with filters
linear.issue.list({
  teamId: "TEAM-UUID-HERE",
  filter: {
    state: { name: { eq: "In Progress" } },
    assignee: { id: { eq: "USER-UUID-HERE" } },
    priority: { gte: 2 }              // 2 = High priority or higher (lower number = higher priority)
  },
  orderBy: "updatedAt",
  first: 25
})

// Filter by cycle
linear.issue.list({
  cycleId: "CYCLE-UUID-HERE",
  filter: { state: { type: { neq: "completed" } } }
})

// Filter by project
linear.issue.list({
  projectId: "PROJECT-UUID-HERE"
})`;

const updateIssueExample = `// Update an issue
linear.issue.update({
  issueId: "ISSUE-UUID-HERE",        // UUID, not the identifier like ENG-123
  title: "Updated title",
  stateId: "NEW-STATE-UUID",
  priority: 1,                        // escalate to Urgent
  assigneeId: null                    // unassign
})`;

const commentExample = `// Add a comment to an issue
linear.issue.comment({
  issueId: "ISSUE-UUID-HERE",
  body: "Investigated this — it's caused by the session token expiry. Fix in progress."
})`;

const findStateIdsExample = `// State IDs are UUIDs — you can't use names like "In Progress" directly.
// To find state IDs for a team:
linear.team.list({})
// Then use the team ID to list workflow states via the API:
// GET https://api.linear.app/graphql with query:
// { team(id: "TEAM-UUID") { states { nodes { id name type } } } }
//
// State types: "triage", "backlog", "unstarted", "started", "completed", "cancelled"
// Note: within each type there can be multiple custom states with their own UUIDs.`;

const cyclesExample = `// List cycles (sprints) for a team
linear.cycle.list({
  teamId: "TEAM-UUID-HERE"
})
// Returns: id, name, number, startsAt, endsAt, completedAt, progress

// Get active cycle issues
linear.issue.list({
  filter: {
    cycle: { isActive: { eq: true } },
    team: { id: { eq: "TEAM-UUID-HERE" } }
  }
})`;

const projectsExample = `// List projects
linear.project.list({
  first: 50
})

// List issues in a project
linear.issue.list({
  projectId: "PROJECT-UUID-HERE",
  filter: {
    state: { type: { neq: "cancelled" } }
  }
})`;

const findSlugNote = `// Your workspace slug is in the Linear URL:
// https://linear.app/YOUR-SLUG/settings
//                  ^^^^^^^^^^^
// Example: https://linear.app/acme/settings → slug is "acme"

// Team IDs: linear.team.list({}) returns id, name, key, slug
// Project IDs: linear.project.list({}) returns id, name, slugId
// Member IDs: linear.member.list({}) returns id, name, email, displayName`;

const webhookExample = `// Linear can send webhooks to Conductor when issues change.
// Configure at: linear.app/YOUR-SLUG/settings/api → Webhooks
//
// Supported events:
//   Issue — created, updated, removed
//   Comment — created, updated, removed
//   Cycle — created, updated, removed
//   Project — created, updated, removed
//   IssueLabel — created, updated, removed
//
// The webhook payload includes the resource type, action, and full object data.
// Conductor receives these and can trigger automations based on the event.`;

const priorityValues = [
  { value: "0", label: "No priority", notes: "Issue has not been prioritized yet" },
  { value: "1", label: "Urgent", notes: "Needs immediate attention, blocks others" },
  { value: "2", label: "High", notes: "Important, should be addressed soon" },
  { value: "3", label: "Medium", notes: "Normal priority work" },
  { value: "4", label: "Low", notes: "Nice to have, address when time permits" },
];

const tools = [
  { name: "linear.issue.create", description: "Create a new issue in a team. Returns the created issue ID and identifier (e.g., ENG-123)." },
  { name: "linear.issue.list", description: "List issues with optional filters for team, state, assignee, cycle, project, and priority." },
  { name: "linear.issue.update", description: "Update any field on an existing issue: title, description, state, priority, assignee, labels." },
  { name: "linear.issue.comment", description: "Add a comment to an issue. Supports Markdown in the body." },
  { name: "linear.issue.assign", description: "Assign an issue to a team member by their user UUID." },
  { name: "linear.cycle.list", description: "List all cycles (sprints) for a team, including active, upcoming, and completed ones." },
  { name: "linear.project.list", description: "List all projects in the workspace. Projects span across teams." },
  { name: "linear.team.list", description: "List all teams in the workspace with their IDs, keys, and slugs." },
  { name: "linear.member.list", description: "List all members of the workspace with their user IDs, names, and emails." },
  { name: "linear.label.list", description: "List all labels available in the workspace or for a specific team." },
];

const errors = [
  { code: "Authentication required", cause: "API key is missing or malformed in the request", fix: "Verify the token starts with lin_api_. Check there are no extra spaces or newlines in the config." },
  { code: "Entity not found", cause: "The UUID you passed doesn't correspond to any object in the workspace", fix: "Re-fetch the ID. UUIDs are case-sensitive. Make sure you're not mixing up team IDs, issue IDs, and user IDs." },
  { code: "You don't have permission", cause: "The API key belongs to a user who lacks access to the resource", fix: "Use an API key from a user with admin or member access. Guest users have restricted API access." },
  { code: "Argument validation error", cause: "A field value is wrong type, out of range, or refers to a non-existent enum value", fix: "Check priority is 0–4. Check stateId, assigneeId, and labelIds are valid UUIDs. Check dates are ISO 8601." },
];

export default function LinearIntegrationPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Linear</h1>
        <p className="mt-3 text-sm text-[#666]">
          Create and manage Linear issues, cycles, and projects through Conductor. Covers personal
          API keys, OAuth apps, finding workspace and team IDs, state UUID lookup, priority values,
          and webhook configuration.
        </p>
      </div>

      {/* Auth approaches */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Authentication</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-1 font-mono text-xs font-semibold text-white">Personal API Key</p>
            <p className="text-xs text-[#555]">
              The quickest way to get started. Acts with the same permissions as your Linear user
              account. Goes to <span className="font-mono text-[#777]">Settings → API → Personal API keys</span>.
              Ideal for individual automation. Tokens start with{" "}
              <span className="font-mono text-[#777]">lin_api_</span>.
            </p>
          </div>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="mb-1 font-mono text-xs font-semibold text-white">OAuth App</p>
            <p className="text-xs text-[#555]">
              For team tools or products that multiple Linear users connect to. Create an OAuth app
              under <span className="font-mono text-[#777]">Settings → API → OAuth applications</span>.
              Users authorize via Linear's consent screen. More setup, but doesn't rely on one person's
              account.
            </p>
          </div>
        </div>
      </section>

      {/* Creating a personal API key */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Creating a personal API key</h2>
        <ol className="space-y-2 text-sm text-[#666]">
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">01</span>
            <span>Open Linear and click your workspace name in the top-left corner → <strong className="text-[#aaa]">Settings</strong>.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">02</span>
            <span>In the left sidebar, scroll to <strong className="text-[#aaa]">My Account → API</strong>.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">03</span>
            <span>Under <strong className="text-[#aaa]">Personal API keys</strong>, click <strong className="text-[#aaa]">Create key</strong>. Give it a descriptive label (e.g., "Conductor").</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">04</span>
            <span>Copy the key immediately — Linear only shows it once. It starts with <span className="font-mono text-[#888]">lin_api_</span>.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 font-mono text-[10px] text-[#333]">05</span>
            <span>Add it to your Conductor config (see below).</span>
          </li>
        </ol>
      </section>

      {/* Finding workspace and team info */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Finding workspace and team IDs</h2>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
            <span className="font-mono text-[10px] text-[#3a3a3a]">finding IDs</span>
            <CopyButton text={findSlugNote} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{findSlugNote}</code></pre>
        </div>
      </section>

      {/* Conductor Config */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Conductor config</h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-[#555]">Personal API key (most common)</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.json</span>
                <CopyButton text={conductorConfig} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfig}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">OAuth app</p>
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

      {/* Priority values */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Priority values</h2>
        <p className="mb-4 text-sm text-[#666]">
          Linear uses numeric priority values. Lower numbers are higher priority.
          Priority <span className="font-mono text-[#888]">0</span> means no priority has been assigned.
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
          <table className="w-full text-xs">
            <thead className="bg-[#080808]">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Value</th>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Label</th>
                <th className="px-4 py-2.5 text-left font-mono font-semibold text-[#444]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
              {priorityValues.map((p) => (
                <tr key={p.value}>
                  <td className="px-4 py-2.5 font-mono text-[#888]">{p.value}</td>
                  <td className="px-4 py-2.5 text-[#888]">{p.label}</td>
                  <td className="px-4 py-2.5 text-[#555]">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* State IDs */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Issue state IDs</h2>
        <p className="mb-3 text-sm text-[#666]">
          State names like "In Progress" or "Done" are human labels — the API uses UUIDs.
          Each team has its own set of workflow states. You must look up the UUID for the state
          you want before creating or updating issues.
        </p>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
            <span className="font-mono text-[10px] text-[#3a3a3a]">finding state UUIDs</span>
            <CopyButton text={findStateIdsExample} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{findStateIdsExample}</code></pre>
        </div>
        <p className="mt-3 text-xs text-[#444]">
          State types (<span className="font-mono text-[#666]">backlog</span>,{" "}
          <span className="font-mono text-[#666]">started</span>,{" "}
          <span className="font-mono text-[#666]">completed</span>, etc.) are consistent across teams,
          but the specific states within each type are team-specific with unique UUIDs.
        </p>
      </section>

      {/* Usage examples */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Usage examples</h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-[#555]">Creating an issue</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">linear.issue.create</span>
                <CopyButton text={createIssueExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{createIssueExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Listing and filtering issues</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">linear.issue.list</span>
                <CopyButton text={listIssuesExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{listIssuesExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Updating an issue</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">linear.issue.update</span>
                <CopyButton text={updateIssueExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{updateIssueExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Commenting on an issue</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">linear.issue.comment</span>
                <CopyButton text={commentExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{commentExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Working with cycles (sprints)</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">linear.cycle.list</span>
                <CopyButton text={cyclesExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{cyclesExample}</code></pre>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#555]">Working with projects</p>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">linear.project.list</span>
                <CopyButton text={projectsExample} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{projectsExample}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Webhooks from Linear</h2>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
            <span className="font-mono text-[10px] text-[#3a3a3a]">webhook setup</span>
            <CopyButton text={webhookExample} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{webhookExample}</code></pre>
        </div>
      </section>

      {/* Rate limits */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-semibold">Rate limits</h2>
        <p className="text-sm text-[#666]">
          Linear uses a <strong className="text-[#aaa]">GraphQL API</strong> with complexity-based rate limiting.
          Each query is assigned a complexity cost based on how many resources it fetches.
          The limit is <strong className="text-[#aaa]">1,500 complexity points per minute</strong>.
          Simple mutations (create, update) cost around 5–10 points.
          Paginated list queries cost more depending on the <span className="font-mono text-[#888]">first</span> argument.
          The API response includes <span className="font-mono text-[#888]">X-RateLimit-Requests-Remaining</span> and
          <span className="font-mono text-[#888]"> X-RateLimit-Complexity-Remaining</span> headers so you can track usage.
          HTTP 429 is returned when you exceed the limit; retry after 60 seconds.
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
