import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const cloudConfig = `// ~/.conductor/config.json
{
  "plugins": {
    "jira": {
      "enabled": true,
      "deployment": "cloud",
      "baseUrl": "https://yoursite.atlassian.net",
      "email": "you@yourcompany.com",
      "apiToken": "your-api-token-here"
    }
  }
}`;

const serverConfig = `// ~/.conductor/config.json — Jira Server / Data Center
{
  "plugins": {
    "jira": {
      "enabled": true,
      "deployment": "server",
      "baseUrl": "https://jira.yourcompany.com",
      "personalAccessToken": "your-PAT-here"
    }
  }
}`;

const jqlExamples = `-- Issues assigned to me, open
assignee = currentUser() AND resolution = Unresolved

-- Issues in a sprint
sprint in openSprints() AND project = "MYPROJ"

-- Recently updated bugs
issuetype = Bug AND updated >= -7d ORDER BY updated DESC

-- Issues with a specific label
labels = "backend" AND status != Done

-- Epic children
"Epic Link" = PROJ-123

-- Issues created this week
created >= startOfWeek() ORDER BY created DESC

-- Blockers
priority = Highest AND resolution = Unresolved

-- Issues in multiple projects
project in (PROJ1, PROJ2) AND status = "In Progress"`;

const transitionSql = `# Find transition IDs for an issue
conductor jira transitions --issue PROJ-123

# Output:
# ID    NAME
# 11    To Do
# 21    In Progress
# 31    In Review
# 41    Done`;

const customFields = `// Custom fields use IDs like customfield_10001
// Find them via: GET /rest/api/3/field

// In Conductor config — map friendly names to field IDs
{
  "plugins": {
    "jira": {
      "customFields": {
        "storyPoints": "customfield_10016",
        "epicLink":    "customfield_10014",
        "sprint":      "customfield_10020",
        "team":        "customfield_10001"
      }
    }
  }
}`;

const createIssue = `// Create an issue with custom fields
{
  "name": "jira.issue.create",
  "arguments": {
    "project": "PROJ",
    "summary": "Implement OAuth flow",
    "issuetype": "Story",
    "priority": "High",
    "assignee": "user@company.com",
    "labels": ["backend", "auth"],
    "customFields": {
      "storyPoints": 5,
      "sprint": "PROJ Sprint 14"
    }
  }
}`;

export default function JiraIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">Integrations</p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Jira / Atlassian</h1>
        <p className="mt-3 text-[#666]">
          Connect to Jira Cloud, Jira Server, or Jira Data Center. Manage issues, run JQL queries, transition statuses, and work with sprints — all from your AI client.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Deployment types</h2>
          <div className="grid gap-px bg-[#1a1a1a] sm:grid-cols-3">
            {[
              { name: "Jira Cloud", host: "yoursite.atlassian.net", auth: "API token (id.atlassian.com)", note: "Most common. Free tier available." },
              { name: "Jira Server", host: "Self-hosted URL", auth: "Personal Access Token (PAT)", note: "On-premises, older versions." },
              { name: "Jira Data Center", host: "Self-hosted URL", auth: "Personal Access Token (PAT)", note: "Enterprise on-premises. Same API as Server." },
            ].map((d) => (
              <div key={d.name} className="bg-[#080808] p-5">
                <p className="font-mono text-sm font-semibold text-white">{d.name}</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex gap-2"><span className="w-10 font-mono text-[10px] text-[#333]">Host</span><span className="text-xs text-[#555]">{d.host}</span></div>
                  <div className="flex gap-2"><span className="w-10 font-mono text-[10px] text-[#333]">Auth</span><span className="text-xs text-[#555]">{d.auth}</span></div>
                </div>
                <p className="mt-3 font-mono text-[10px] text-[#2a2a2a]">{d.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Jira Cloud — API token</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            API tokens are tied to your Atlassian account. You use your account email as the username and the token as the password in Basic auth. Tokens are not project-scoped — they have the same permissions as your account.
          </p>
          <div className="space-y-3">
            {[
              { step: "1", text: "Go to id.atlassian.com → Security → API tokens" },
              { step: "2", text: "Click Create API token. Give it a label (e.g. Conductor)." },
              { step: "3", text: "Copy the token immediately — it's only shown once." },
              { step: "4", text: "Your base URL is https://YOURSITE.atlassian.net — find YOURSITE in your browser when logged in." },
              { step: "5", text: "Your email is the one you use to log in to Atlassian." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                <span className="w-4 shrink-0 font-mono text-xs text-[#2a2a2a]">{s.step}</span>
                <span className="text-xs text-[#555]">{s.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Jira Server / Data Center — Personal Access Token</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            PATs were introduced in Jira Server 8.14 and Data Center 8.14. If you&apos;re on an older version, use Basic auth (username + password) instead.
          </p>
          <div className="space-y-3">
            {[
              { step: "1", text: "Log in to Jira Server. Click your profile icon → Personal Access Tokens." },
              { step: "2", text: "Click Create token. Give it a name and optional expiry." },
              { step: "3", text: "Copy the token. In Conductor config, use personalAccessToken (not apiToken + email)." },
              { step: "4", text: "If on Jira < 8.14: use Basic auth with username and password fields instead." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                <span className="w-4 shrink-0 font-mono text-xs text-[#2a2a2a]">{s.step}</span>
                <span className="text-xs text-[#555]">{s.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Configuration</h2>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">Jira Cloud — ~/.conductor/config.json</span>
                <CopyButton text={cloudConfig} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{cloudConfig}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">Jira Server / Data Center</span>
                <CopyButton text={serverConfig} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{serverConfig}</code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Available tools</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Tool</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  ["jira.issue.get", "Get full issue details by key (e.g. PROJ-123)"],
                  ["jira.issue.create", "Create an issue with type, summary, description, fields"],
                  ["jira.issue.update", "Update summary, description, assignee, priority, custom fields"],
                  ["jira.issue.transition", "Move issue to a new status by transition ID"],
                  ["jira.issue.comment", "Add a comment to an issue"],
                  ["jira.issue.search", "Run a JQL query and return matching issues"],
                  ["jira.issue.assign", "Assign an issue to a user (by accountId or email)"],
                  ["jira.issue.link", "Link two issues (blocks, is blocked by, relates to)"],
                  ["jira.issue.attachment", "Upload a file attachment to an issue"],
                  ["jira.issue.transitions", "List available transitions for an issue"],
                  ["jira.project.list", "List all accessible projects"],
                  ["jira.project.get", "Get project details including issue types and components"],
                  ["jira.sprint.list", "List sprints in a board"],
                  ["jira.sprint.get", "Get sprint details including dates and state"],
                  ["jira.sprint.issues", "Get all issues in a sprint"],
                  ["jira.board.list", "List all boards (scrum and kanban)"],
                  ["jira.user.search", "Search users by email or display name"],
                  ["jira.user.me", "Get the authenticated user's account details"],
                ].map(([tool, desc]) => (
                  <tr key={tool}>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-white">{tool}</code></td>
                    <td className="px-4 py-3 text-xs text-[#444]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">JQL — Jira Query Language</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">jira.issue.search</code> takes a JQL string. JQL is Jira&apos;s SQL-like query language. Common patterns:
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">JQL examples</span>
              <CopyButton text={jqlExamples} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{jqlExamples}</code></pre>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Field</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Operators</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  ["project", "=, !=, in, not in", "Use project key (PROJ), not name"],
                  ["status", "=, !=, in, changed", "Use exact status name in quotes"],
                  ["assignee", "=, is EMPTY", "currentUser() for the authed user"],
                  ["priority", "=, !=, in", "Highest, High, Medium, Low, Lowest"],
                  ["issuetype", "=, !=, in", "Story, Bug, Task, Epic, Sub-task"],
                  ["created / updated", ">=, <=, >, <", "-7d, startOfWeek(), startOfMonth()"],
                  ["sprint", "in", "openSprints(), closedSprints(), or sprint name"],
                  ["labels", "=, in, is EMPTY", "Exact label string, case-sensitive"],
                ].map(([f, op, note]) => (
                  <tr key={f}>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-white">{f}</code></td>
                    <td className="px-4 py-3"><code className="font-mono text-[10px] text-[#555]">{op}</code></td>
                    <td className="px-4 py-3 text-xs text-[#444]">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Transitions</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            To transition an issue, you need the transition <em>ID</em>, not the name. IDs differ per project and per workflow. Always look them up first.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">Find transition IDs</span>
              <CopyButton text={transitionSql} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{transitionSql}</code></pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Custom fields</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Jira custom fields have IDs like <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">customfield_10016</code>. Map them to friendly names in config so Conductor can reference them by name.
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">config — custom field mapping</span>
                <CopyButton text={customFields} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{customFields}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">create issue with custom fields</span>
                <CopyButton text={createIssue} />
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{createIssue}</code></pre>
            </div>
          </div>
          <div className="mt-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
            <p className="font-mono text-xs font-semibold text-white">Finding custom field IDs</p>
            <p className="mt-1 text-xs text-[#555]">
              In Jira Cloud: Admin → Issues → Custom fields → click the field → the URL contains the ID.<br />
              Via API: <code className="rounded bg-[#111] px-1 py-0.5 font-mono text-[10px]">GET /rest/api/3/field</code> returns all fields with their IDs.<br />
              Common ones: Story Points = customfield_10016, Epic Link = customfield_10014, Sprint = customfield_10020.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Common errors</h2>
          <div className="space-y-3">
            {[
              {
                error: "401 Basic auth failed",
                cause: "Wrong email or API token. On Jira Cloud, email is your Atlassian account email. Password is the API token, not your Atlassian password.",
                fix: "Regenerate a new API token at id.atlassian.com → Security → API tokens.",
              },
              {
                error: "403 The caller does not have permission",
                cause: "Your account doesn't have access to the project or specific operation.",
                fix: "Ask a Jira admin to grant you project access. For Server: check your project role and global permissions.",
              },
              {
                error: "404 Issue does not exist or you do not have permission",
                cause: "Issue key is wrong, or your account can't see the project.",
                fix: "Verify the issue key. Check you have Browse Projects permission for that project.",
              },
              {
                error: "400 Field 'X' cannot be set",
                cause: "The field is not on the create/edit screen for that issue type, or it's a read-only field.",
                fix: "Ask admin to add the field to the screen. Or remove that field from your request.",
              },
              {
                error: "400 Invalid JQL",
                cause: "Syntax error in the JQL string — often unquoted values or wrong operator.",
                fix: "Validate JQL in Jira's issue search UI first. Quote string values (status = \"In Progress\", not status = In Progress).",
              },
              {
                error: "400 Transition is not valid",
                cause: "The transition ID doesn't exist for this issue, or the issue is already in the target status.",
                fix: "Use jira.issue.transitions to list valid transitions for the specific issue.",
              },
              {
                error: "429 Rate limit exceeded",
                cause: "Jira Cloud rate limits REST API calls per user per minute.",
                fix: "Add delays between bulk operations. Use JQL with maxResults to batch fetches. Jira Cloud limit: ~10 req/sec per user.",
              },
              {
                error: "XSRF check failed",
                cause: "Attempting to use cookie-based auth instead of Basic/Bearer token.",
                fix: "Ensure Conductor is using the API token, not a session cookie. Set the correct auth type in config.",
              },
            ].map((e) => (
              <div key={e.error} className="overflow-hidden rounded-lg border border-[#1a1a1a]">
                <div className="border-b border-[#1a1a1a] bg-[#080808] px-4 py-3">
                  <code className="font-mono text-xs text-white">{e.error}</code>
                </div>
                <div className="grid gap-px bg-[#1a1a1a] sm:grid-cols-2">
                  <div className="bg-[#060606] px-4 py-3">
                    <p className="mb-1 font-mono text-[10px] text-[#333]">Cause</p>
                    <p className="text-xs text-[#555]">{e.cause}</p>
                  </div>
                  <div className="bg-[#060606] px-4 py-3">
                    <p className="mb-1 font-mono text-[10px] text-[#333]">Fix</p>
                    <p className="text-xs text-[#555]">{e.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Jira Cloud vs Server differences</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Feature</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Cloud</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Server / DC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  ["Auth", "Email + API token", "PAT or Basic (user/pass)"],
                  ["API version", "REST API v3", "REST API v2"],
                  ["User ID", "accountId (UUID)", "Username or name field"],
                  ["Rate limiting", "~10 req/sec per user", "No hard limit (server capacity)"],
                  ["Base URL", "*.atlassian.net", "Your internal hostname"],
                  ["Sprint field", "customfield_10020", "May differ — check /rest/api/2/field"],
                ].map(([f, c, s]) => (
                  <tr key={f}>
                    <td className="px-4 py-3 font-mono text-xs text-white">{f}</td>
                    <td className="px-4 py-3 text-xs text-[#444]">{c}</td>
                    <td className="px-4 py-3 text-xs text-[#444]">{s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/integrations" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          All integrations
        </Link>
      </div>
    </div>
  );
}
