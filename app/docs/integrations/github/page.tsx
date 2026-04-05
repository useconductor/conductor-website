import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

// ─── Code snippets ────────────────────────────────────────────────────────────

const configClassicPAT = `# conductor.config.json
{
  "plugins": {
    "github": {
      "auth": {
        "type": "pat",
        "token": "ghp_your_personal_access_token"
      }
    }
  }
}`;

const configFineGrained = `# conductor.config.json
{
  "plugins": {
    "github": {
      "auth": {
        "type": "fine-grained-pat",
        "token": "github_pat_your_fine_grained_token"
      }
    }
  }
}`;

const configGitHubApp = `# conductor.config.json
{
  "plugins": {
    "github": {
      "auth": {
        "type": "github-app",
        "app_id": "123456",
        "installation_id": "78901234",
        "private_key_path": "~/.conductor/github-app.pem"
      }
    }
  }
}`;

const configEnvVars = `# Using environment variables (recommended for production)
export GITHUB_TOKEN=ghp_your_personal_access_token

# Or for GitHub App auth:
export GITHUB_APP_ID=123456
export GITHUB_INSTALLATION_ID=78901234
export GITHUB_PRIVATE_KEY_PATH=~/.conductor/github-app.pem

# Conductor will pick these up automatically`;

const exampleRepoGet = `{
  "tool": "github.repo.get",
  "input": {
    "owner": "myorg",
    "repo": "api-service"
  }
}`;

const exampleRepoCreate = `{
  "tool": "github.repo.create",
  "input": {
    "name": "new-service",
    "description": "Microservice for payment processing",
    "private": true,
    "auto_init": true,
    "gitignore_template": "Node"
  }
}`;

const exampleRepoFork = `{
  "tool": "github.repo.fork",
  "input": {
    "owner": "upstream-org",
    "repo": "open-source-lib",
    "organization": "myorg"
  }
}`;

const exampleIssueList = `{
  "tool": "github.issue.list",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "state": "open",
    "labels": ["bug", "priority:high"],
    "assignee": "octocat",
    "per_page": 50
  }
}`;

const exampleIssueCreate = `{
  "tool": "github.issue.create",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "title": "Rate limiter not resetting after TTL expiry",
    "body": "## Description\\nThe rate limiter counter is not being reset...\\n\\n## Steps to reproduce\\n1. Send 100 requests\\n2. Wait for TTL\\n3. Counter remains at 100",
    "labels": ["bug"],
    "assignees": ["octocat"],
    "milestone": 3
  }
}`;

const exampleIssueComment = `{
  "tool": "github.issue.comment",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "issue_number": 42,
    "body": "I've reproduced this locally. The TTL reset logic in\\n\`src/rate-limiter.ts:L87\` is not awaiting the async clear."
  }
}`;

const examplePRCreate = `{
  "tool": "github.pr.create",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "title": "fix: await async clear in rate limiter TTL reset",
    "body": "## Summary\\nFixes #42. Added \`await\` to the \`clearCounter()\` call...\\n\\n## Test plan\\n- [x] Unit tests pass\\n- [x] Integration tests pass",
    "head": "fix/rate-limiter-ttl",
    "base": "main",
    "draft": false,
    "reviewers": ["senior-dev"],
    "labels": ["bug", "ready-for-review"]
  }
}`;

const examplePRMerge = `{
  "tool": "github.pr.merge",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "pull_number": 118,
    "merge_method": "squash",
    "commit_title": "fix: await async clear in rate limiter TTL reset (#118)",
    "delete_branch": true
  }
}`;

const examplePRReview = `{
  "tool": "github.pr.review",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "pull_number": 118,
    "event": "REQUEST_CHANGES",
    "body": "Please add a test for the edge case where TTL expires mid-request.",
    "comments": [
      {
        "path": "src/rate-limiter.ts",
        "line": 87,
        "body": "This should be \`await clearCounter()\` — it's async."
      }
    ]
  }
}`;

const exampleBranchCreate = `{
  "tool": "github.branch.create",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "branch": "feat/new-auth-flow",
    "from": "main"
  }
}`;

const exampleBranchProtect = `{
  "tool": "github.branch.protect",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "branch": "main",
    "required_status_checks": {
      "strict": true,
      "contexts": ["ci/tests", "ci/lint"]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 2,
      "dismiss_stale_reviews": true
    }
  }
}`;

const exampleFileGet = `{
  "tool": "github.file.get",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "path": "src/rate-limiter.ts",
    "ref": "fix/rate-limiter-ttl"
  }
}`;

const exampleFileCreate = `{
  "tool": "github.file.create",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "path": "docs/rate-limiting.md",
    "message": "docs: add rate limiting documentation",
    "content": "# Rate Limiting\\n\\nThis service uses a sliding window...",
    "branch": "main"
  }
}`;

const exampleSearchCode = `{
  "tool": "github.search.code",
  "input": {
    "q": "clearCounter language:TypeScript repo:myorg/api-service",
    "per_page": 20
  }
}`;

const exampleSearchIssues = `{
  "tool": "github.search.issues",
  "input": {
    "q": "is:open is:issue label:bug org:myorg created:>2026-01-01",
    "sort": "created",
    "order": "desc"
  }
}`;

const exampleReleaseCreate = `{
  "tool": "github.release.create",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "tag_name": "v2.4.0",
    "name": "v2.4.0 — Rate limiter fix + Auth improvements",
    "body": "## What's Changed\\n- fix: await async clear in rate limiter (#118)\\n- feat: OAuth2 PKCE flow (#115)\\n\\n**Full Changelog**: https://github.com/myorg/api-service/compare/v2.3.0...v2.4.0",
    "draft": false,
    "prerelease": false,
    "generate_release_notes": true
  }
}`;

const exampleActionsListWorkflows = `{
  "tool": "github.actions.list-workflows",
  "input": {
    "owner": "myorg",
    "repo": "api-service"
  }
}`;

const exampleActionsTrigger = `{
  "tool": "github.actions.trigger",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "workflow_id": "deploy.yml",
    "ref": "main",
    "inputs": {
      "environment": "production",
      "image_tag": "v2.4.0",
      "notify_slack": "true"
    }
  }
}`;

const exampleActionsGetRun = `{
  "tool": "github.actions.get-run",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "run_id": 9876543210
  }
}`;

const exampleActionsDownloadArtifact = `{
  "tool": "github.actions.download-artifact",
  "input": {
    "owner": "myorg",
    "repo": "api-service",
    "artifact_id": 1234567,
    "output_path": "/tmp/build-artifacts"
  }
}`;

const exampleNotificationsList = `{
  "tool": "github.notifications.list",
  "input": {
    "all": false,
    "participating": true,
    "per_page": 30
  }
}`;

const workflowDispatchYaml = `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:           # Required for github.actions.trigger
    inputs:
      environment:
        description: "Target environment"
        required: true
        default: "staging"
        type: choice
        options: [staging, production]
      image_tag:
        description: "Docker image tag"
        required: true
        type: string
      notify_slack:
        description: "Send Slack notification on deploy"
        required: false
        default: "false"
        type: boolean

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to \${{ inputs.environment }}
        run: ./scripts/deploy.sh \${{ inputs.image_tag }} \${{ inputs.environment }}`;

const webhookSetupCmd = `# 1. Start Conductor in HTTP transport mode
conductor mcp start --transport http --port 3000

# 2. Register the incoming webhook endpoint
conductor webhooks create \\
  --name "github-events" \\
  --path "/hooks/github" \\
  --secret "whsec_your_32_byte_hex_secret"

# GitHub will now POST to:
#   http://your-conductor-host:3000/hooks/github`;

const webhookVerifyNode = `const crypto = require("crypto");

// GitHub signs with X-Hub-Signature-256: sha256=<hex>
function verifyGitHubSignature(rawBody, signature, secret) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expected, "utf8")
  );
}`;

// ─── Tool catalog ─────────────────────────────────────────────────────────────

const tools = [
  // Repos
  { name: "github.repo.get", desc: "Fetch full metadata for a repository — description, visibility, default branch, star count, topics, and license.", example: exampleRepoGet },
  { name: "github.repo.list", desc: "List repositories for a user or org. Filter by type (all, public, private, forks, sources, member) and sort by created, updated, or pushed.", example: null },
  { name: "github.repo.create", desc: "Create a new repository under your account or an organization. Set visibility, default branch, gitignore template, and auto-init.", example: exampleRepoCreate },
  { name: "github.repo.fork", desc: "Fork a repository into your account or a specified organization.", example: exampleRepoFork },
  // Issues
  { name: "github.issue.list", desc: "List issues for a repo with filters: state, labels, assignee, milestone, since date, and pagination.", example: exampleIssueList },
  { name: "github.issue.get", desc: "Fetch a single issue by number, including its labels, assignees, milestone, and timeline summary.", example: null },
  { name: "github.issue.create", desc: "Open a new issue with title, body (Markdown), labels, assignees, and optional milestone.", example: exampleIssueCreate },
  { name: "github.issue.update", desc: "Edit an existing issue — change title, body, state (open/closed), labels, assignees, or milestone.", example: null },
  { name: "github.issue.close", desc: "Close an issue with an optional close reason (completed, not_planned).", example: null },
  { name: "github.issue.comment", desc: "Post a comment on an issue or pull request. Supports full GitHub-Flavored Markdown.", example: exampleIssueComment },
  // PRs
  { name: "github.pr.list", desc: "List pull requests filtered by state (open, closed, all), head branch, base branch, and sort order.", example: null },
  { name: "github.pr.get", desc: "Get full details of a pull request including review status, merge conflict state, changed files count, and CI check rollup.", example: null },
  { name: "github.pr.create", desc: "Open a pull request from head to base branch. Set draft mode, reviewers, assignees, labels, and milestone.", example: examplePRCreate },
  { name: "github.pr.merge", desc: "Merge a pull request with merge, squash, or rebase strategy. Optionally auto-delete the head branch after merge.", example: examplePRMerge },
  { name: "github.pr.review", desc: "Submit a review with APPROVE, REQUEST_CHANGES, or COMMENT. Supports inline comments on specific file lines.", example: examplePRReview },
  { name: "github.pr.comment", desc: "Post a review comment on a specific line or range in a pull request diff.", example: null },
  // Branches
  { name: "github.branch.list", desc: "List all branches in a repository with protection status and latest commit SHA.", example: null },
  { name: "github.branch.create", desc: "Create a new branch from any ref (branch name, tag, or commit SHA).", example: exampleBranchCreate },
  { name: "github.branch.delete", desc: "Delete a branch by name. Returns an error if the branch is the repo's default branch.", example: null },
  { name: "github.branch.protect", desc: "Configure branch protection rules: required status checks, required reviews, enforce admins, and restrict pushes.", example: exampleBranchProtect },
  // Commits
  { name: "github.commit.list", desc: "List commits on a branch or path, optionally filtered by author or date range.", example: null },
  { name: "github.commit.get", desc: "Get a commit by SHA — tree, parent commits, diff stats, and verification signature.", example: null },
  { name: "github.commit.compare", desc: "Compare two refs (branches, tags, or SHAs). Returns the merge base, commits behind/ahead, and diff stat.", example: null },
  // Files
  { name: "github.file.get", desc: "Read file content at a path on any ref. Returns decoded content and the blob SHA for subsequent updates.", example: exampleFileGet },
  { name: "github.file.create", desc: "Create a new file in the repository with a commit message. Content is automatically base64-encoded.", example: exampleFileCreate },
  { name: "github.file.update", desc: "Update an existing file. Requires the current blob SHA (returned by github.file.get) to prevent lost updates.", example: null },
  { name: "github.file.delete", desc: "Delete a file from a branch with a commit message. Requires the current blob SHA.", example: null },
  // Search
  { name: "github.search.code", desc: "Search for code across GitHub using the full code search syntax: language, repo, path, extension, and content filters.", example: exampleSearchCode },
  { name: "github.search.issues", desc: "Search issues and PRs org-wide or across all of GitHub. Supports all GitHub search qualifiers.", example: exampleSearchIssues },
  { name: "github.search.repos", desc: "Search repositories by name, topic, language, stars, and forks.", example: null },
  // Releases
  { name: "github.release.list", desc: "List all releases for a repository, ordered by created date descending.", example: null },
  { name: "github.release.create", desc: "Publish a release with tag, name, body, draft/prerelease flags, and optional auto-generated release notes.", example: exampleReleaseCreate },
  { name: "github.release.get", desc: "Get a release by ID or tag name, including asset download URLs.", example: null },
  // Actions
  { name: "github.actions.list-workflows", desc: "List all workflow files in a repository with their IDs, names, paths, and current state.", example: exampleActionsListWorkflows },
  { name: "github.actions.trigger", desc: "Trigger a workflow_dispatch event with custom inputs. The workflow must define on.workflow_dispatch in its YAML.", example: exampleActionsTrigger },
  { name: "github.actions.list-runs", desc: "List workflow runs with filters: workflow file, branch, event type, status (queued, in_progress, completed), and actor.", example: null },
  { name: "github.actions.get-run", desc: "Get full details of a workflow run including conclusion, timing, jobs URL, and triggered event.", example: exampleActionsGetRun },
  { name: "github.actions.download-artifact", desc: "Download a run artifact by artifact ID to a local path. Artifacts expire after 90 days by default.", example: exampleActionsDownloadArtifact },
  // Notifications
  { name: "github.notifications.list", desc: "List notifications for the authenticated user. Filter to unread only, or those you are participating in.", example: exampleNotificationsList },
  { name: "github.notifications.mark-read", desc: "Mark one or all notifications as read. Pass a thread ID for a single notification, or omit to mark all.", example: null },
];

// ─── Errors ───────────────────────────────────────────────────────────────────

const errors = [
  {
    code: "401 Bad credentials",
    cause: "Token is expired, revoked, or malformed.",
    fix: "Generate a new PAT at github.com/settings/tokens. If using a GitHub App, check that the private key matches the app and the installation is still active.",
  },
  {
    code: "403 Resource not accessible by personal access token",
    cause: "The token is valid but lacks the required OAuth scope for this operation.",
    fix: "Re-generate the token and add the missing scope. Common offenders: workflow (Actions), read:org (org resources), notifications, delete_repo.",
  },
  {
    code: "404 on private repository",
    cause: "The token lacks repo scope, or the repository doesn't exist, or the token owner doesn't have access.",
    fix: "Ensure repo scope is checked when creating the PAT. For org repos, the token owner must be a member. For fine-grained PATs, add the specific repo to the token's resource access.",
  },
  {
    code: "403 on org resources",
    cause: "The organization has SAML SSO enabled and the token has not been authorized for SSO.",
    fix: "Go to github.com/settings/tokens, click the token, then click 'Configure SSO' and authorize it for the organization.",
  },
  {
    code: "422 Validation Failed",
    cause: "A required field has an invalid format, duplicate value, or violates a constraint.",
    fix: "Check the errors array in the response body — it lists which field failed validation and why. Common causes: duplicate branch name, invalid label name, PR head already exists.",
  },
  {
    code: "429 Too Many Requests (rate limited)",
    cause: "You've hit GitHub's primary rate limit (5,000 req/hr for authenticated users) or a secondary rate limit.",
    fix: "Check the Retry-After response header and wait that many seconds before retrying. For sustained high volume, switch to a GitHub App (15,000 req/hr) or GraphQL API. Conductor's built-in rate limit handler will respect Retry-After automatically.",
  },
  {
    code: "Push rejected (branch protection)",
    cause: "A direct push to a protected branch was attempted, bypassing required pull request reviews or status checks.",
    fix: "Create a branch, push to that branch, open a PR, get approvals and pass CI, then merge via github.pr.merge.",
  },
  {
    code: "GitHub App: installation not found",
    cause: "The installation_id in your config doesn't match an active installation of your GitHub App.",
    fix: "Go to github.com/settings/apps/{app-slug}/installations to find the correct installation ID. The app must be installed on the org or repo you're trying to access.",
  },
  {
    code: "Actions: workflow not triggerable",
    cause: "github.actions.trigger requires on.workflow_dispatch to be defined in the workflow YAML. If it's missing or the file doesn't exist on the target ref, GitHub returns 422.",
    fix: "Add the workflow_dispatch trigger to the workflow YAML and push it to the target branch before calling github.actions.trigger.",
  },
  {
    code: "Secondary rate limit (403)",
    cause: "Too many concurrent requests or mutations per minute. GitHub enforces secondary limits separately from the hourly quota.",
    fix: "Reduce request concurrency. Space out write operations (issue creation, PR comments) with small delays between batches. Conductor's retry logic handles this automatically with exponential backoff.",
  },
];

// ─── Rate limits table ────────────────────────────────────────────────────────

const rateLimits = [
  { api: "REST API", unauthenticated: "60 req/hr", pat: "5,000 req/hr", githubApp: "15,000 req/hr (installation)" },
  { api: "GraphQL API", unauthenticated: "—", pat: "5,000 points/hr", githubApp: "15,000 points/hr" },
  { api: "Search API", unauthenticated: "10 req/min", pat: "30 req/min", githubApp: "30 req/min" },
  { api: "Code Search", unauthenticated: "—", pat: "10 req/min", githubApp: "10 req/min" },
  { api: "Actions (workflow triggers)", unauthenticated: "—", pat: "500 per repo/day", githubApp: "500 per repo/day" },
];

// ─── Scopes table ─────────────────────────────────────────────────────────────

const classicScopes = [
  { scope: "repo", grants: "Full access to public and private repositories — read/write code, issues, PRs, releases, branches, and deployments." },
  { scope: "public_repo", grants: "Read/write access to public repositories only. Use when you don't need private repo access." },
  { scope: "repo:status", grants: "Read/write access to commit statuses (CI check state). Required for posting CI results." },
  { scope: "delete_repo", grants: "Permission to delete repositories. Requires repo scope too. Only include when specifically needed." },
  { scope: "workflow", grants: "Read/write GitHub Actions workflows. Required for github.actions.trigger and creating/editing workflow files." },
  { scope: "read:org", grants: "Read organization membership, teams, and projects. Required for listing org repos and members." },
  { scope: "write:org", grants: "Write access to org membership and projects. Required for managing teams and inviting members." },
  { scope: "notifications", grants: "Access notifications. Required for github.notifications.list and github.notifications.mark-read." },
  { scope: "gist", grants: "Create and update Gists." },
  { scope: "read:packages", grants: "Download packages from GitHub Packages." },
  { scope: "write:packages", grants: "Upload packages to GitHub Packages." },
];

const fineGrainedRepoPermissions = [
  { permission: "Contents", levels: "Read / Read & Write", use: "Read and write files, commits, branches, releases." },
  { permission: "Issues", levels: "Read / Read & Write", use: "List, read, create, update, and close issues." },
  { permission: "Pull requests", levels: "Read / Read & Write", use: "List, read, create, merge, and review PRs." },
  { permission: "Actions", levels: "Read / Read & Write", use: "Trigger workflows, read runs, download artifacts." },
  { permission: "Metadata", levels: "Read (mandatory)", use: "Basic repository info. Always required — cannot be deselected." },
  { permission: "Commit statuses", levels: "Read / Read & Write", use: "Read and post CI check statuses." },
  { permission: "Deployments", levels: "Read / Read & Write", use: "Create deployments and update deployment status." },
  { permission: "Secrets", levels: "Read / Read & Write", use: "Manage Actions secrets. Rarely needed — include only if required." },
  { permission: "Administration", levels: "Read / Read & Write", use: "Manage branch protection rules, webhooks, and repo settings." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function GitHubIntegrationPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          GitHub
        </h1>
        <p className="mt-3 text-[#666]">
          Issues, pull requests, repos, branches, commits, files, Actions workflows, releases,
          notifications, and code search — all accessible from your AI client via Conductor.
          Supports Personal Access Tokens, fine-grained PATs, and GitHub Apps.
        </p>
      </div>

      <div className="space-y-16">

        {/* ── 1. Overview ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Overview</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            The GitHub plugin exposes 40 tools covering every core GitHub API surface. You can ask
            your AI client to triage issues, open pull requests, trigger deployments, read files from
            any branch, and monitor Actions runs — without leaving your chat session.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { area: "Issues & PRs", desc: "Create, triage, label, comment, review, merge, and close issues and pull requests." },
              { area: "Repositories", desc: "List, create, fork, and configure repositories. Manage branch protection rules." },
              { area: "Files & Commits", desc: "Read and write files, compare commits, navigate branches and tags." },
              { area: "GitHub Actions", desc: "Trigger workflow_dispatch runs with custom inputs, poll run status, download artifacts." },
              { area: "Search", desc: "Search code, issues, and repositories across GitHub with the full query syntax." },
              { area: "Releases", desc: "Create and publish releases with auto-generated changelogs." },
              { area: "Notifications", desc: "List and mark as read your GitHub notification inbox." },
              { area: "Organizations", desc: "Work with org repos, teams, and members. Supports SAML SSO orgs." },
              { area: "Branches", desc: "Create, delete, list, and protect branches programmatically." },
            ].map((item) => (
              <div key={item.area} className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <h3 className="mb-1 font-mono text-xs font-semibold text-white">{item.area}</h3>
                <p className="text-xs leading-relaxed text-[#555]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. Authentication options ────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Authentication options</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Three authentication methods are supported. Choose based on your use case and security
            requirements.
          </p>
          <div className="space-y-3">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-mono text-sm font-semibold text-white">Personal Access Token (classic)</h3>
                <span className="shrink-0 rounded border border-[#1a1a1a] px-2 py-0.5 font-mono text-[9px] text-[#555]">
                  Easiest
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#555]">
                A single token with broad scope-based permissions. Best for personal use, local
                development, and prototyping. Tokens do not expire unless you set an expiration date.
                The downside: scopes are coarse — you can't restrict a classic PAT to a single repo.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-mono text-sm font-semibold text-white">Fine-grained Personal Access Token</h3>
                <span className="shrink-0 rounded border border-[#1a1a1a] px-2 py-0.5 font-mono text-[9px] text-[#555]">
                  Recommended
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#555]">
                Newer token type with per-repository and per-permission granularity. You choose exactly
                which repos the token can access and which permissions (read/write) it gets for each
                resource type. Always expires (max 1 year). Best for production personal use.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-mono text-sm font-semibold text-white">GitHub App</h3>
                <span className="shrink-0 rounded border border-[#1a1a1a] px-2 py-0.5 font-mono text-[9px] text-[#555]">
                  Teams &amp; Orgs
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#555]">
                A first-class GitHub entity with its own identity, higher API rate limits (15,000
                req/hr per installation vs 5,000 for PATs), and fine-grained permissions. Can be
                installed organization-wide or on specific repos. Ideal for CI/CD, shared team
                tooling, and production systems. Requires an App ID, Installation ID, and a PEM
                private key.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. Classic PAT ───────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Creating a classic PAT</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Navigate to{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
            </code>{" "}
            and click <strong className="text-white font-mono text-xs">Generate new token (classic)</strong>.
          </p>
          <div className="mb-6 space-y-2 text-sm leading-relaxed text-[#666]">
            {[
              'Set a descriptive Note (e.g. "Conductor MCP \u2014 local dev") so you can identify it later.',
              "Set an Expiration — 90 days is a reasonable default. Avoid \"No expiration\" for production.",
              "Select scopes from the table below. Start minimal and add scopes as tools return 403 errors.",
              "Click Generate token and copy it immediately — GitHub shows it only once.",
              "Store it securely: use conductor secret set GITHUB_TOKEN or your system keychain.",
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#333]">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Scope</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">What it grants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {classicScopes.map((row) => (
                  <tr key={row.scope}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-[11px] text-white">{row.scope}</code>
                    </td>
                    <td className="px-4 py-3 text-[#555]">{row.grants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#444]">
            For most Conductor use cases, selecting <code className="font-mono">repo</code>,{" "}
            <code className="font-mono">workflow</code>, and{" "}
            <code className="font-mono">read:org</code> covers everything. Add{" "}
            <code className="font-mono">notifications</code> if you want the notifications tools.
          </p>
        </section>

        {/* ── 4. Fine-grained PAT ──────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Creating a fine-grained PAT</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Navigate to{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens
            </code>{" "}
            and click <strong className="text-white font-mono text-xs">Generate new token</strong>.
          </p>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Resource owner</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Choose your personal account or an organization. For org tokens, the org admin must
                approve fine-grained PATs if the org has that policy enabled. Check under org Settings
                → Third-party access → Personal access tokens.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Repository access</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Choose <em className="text-[#888]">All repositories</em> for convenience or{" "}
                <em className="text-[#888]">Only select repositories</em> for tightest scope. Selecting
                specific repos is strongly recommended for tokens used in automation.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Expiration</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Fine-grained tokens always expire. Maximum is 1 year. Set a calendar reminder to
                rotate before expiry. Use 90 days for automation tokens and 1 year for personal use.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Permissions</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Repository permissions and account permissions are configured separately. Metadata
                (read-only) is always required and cannot be removed. Start with read-only and
                elevate to read &amp; write only where needed.
              </p>
            </div>
          </div>
          <h3 className="mb-3 font-mono text-sm font-semibold text-[#888]">Repository permissions</h3>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Permission</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Levels</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">When you need it</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {fineGrainedRepoPermissions.map((row) => (
                  <tr key={row.permission}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-[11px] text-white">{row.permission}</code>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-[#666]">{row.levels}</td>
                    <td className="px-4 py-3 text-[#555]">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 5. GitHub App ────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">GitHub App setup</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            GitHub Apps provide higher rate limits, finer-grained permissions, and a distinct identity
            that isn't tied to any single user account. Use them for team or organizational deployments.
          </p>
          <div className="mb-6 space-y-2 text-sm leading-relaxed text-[#666]">
            {[
              <>Navigate to <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">github.com/settings/apps</code> (for personal) or <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">github.com/organizations/YOUR_ORG/settings/apps</code> (for org). Click <strong className="text-white font-mono text-xs">New GitHub App</strong>.</>,
              "Set a unique App name, Homepage URL (any URL), and disable the Webhook URL if you don't need it (uncheck Active under Webhook).",
              <>Under <strong className="text-white font-mono text-xs">Repository permissions</strong>, grant the permissions your use case needs (see fine-grained permissions table above).</>,
              <>Under <strong className="text-white font-mono text-xs">Where can this GitHub App be installed?</strong>, choose <em className="text-[#888]">Only on this account</em> for private use or <em className="text-[#888]">Any account</em> for shared apps.</>,
              "Click Create GitHub App. Note the App ID shown on the app's settings page.",
              <>Scroll to <strong className="text-white font-mono text-xs">Private keys</strong> and click <strong className="text-white font-mono text-xs">Generate a private key</strong>. Download the .pem file and move it to a safe location, e.g., <code className="font-mono text-xs">~/.conductor/github-app.pem</code>.</>,
              <>Install the app: click <strong className="text-white font-mono text-xs">Install App</strong> in the left sidebar, choose your org or account, and select which repos to grant access. Note the <strong className="text-white font-mono text-xs">Installation ID</strong> from the URL after install: <code className="font-mono text-xs">github.com/settings/installations/INSTALLATION_ID</code>.</>,
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#333]">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="font-mono text-xs font-medium text-white">Required permissions for full Conductor access</p>
            <p className="mt-2 text-xs leading-relaxed text-[#555]">
              Repository: Contents (R&amp;W), Issues (R&amp;W), Pull requests (R&amp;W), Actions (R&amp;W),
              Commit statuses (R&amp;W), Metadata (R), Administration (R&amp;W for branch protection).
              Account permissions: none required unless you need to list org members.
            </p>
          </div>
        </section>

        {/* ── 6. Conductor config ──────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Conductor configuration</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Add the GitHub plugin to your Conductor config. Use environment variables for tokens —
            never commit credentials to source control.
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">Classic PAT</span>
                <CopyButton text={configClassicPAT} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{configClassicPAT}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">Fine-grained PAT</span>
                <CopyButton text={configFineGrained} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{configFineGrained}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">GitHub App</span>
                <CopyButton text={configGitHubApp} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{configGitHubApp}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">Environment variables (alternative)</span>
                <CopyButton text={configEnvVars} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{configEnvVars}</code></pre>
            </div>
          </div>
        </section>

        {/* ── 7. Tools ─────────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Available tools</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            40 tools across repositories, issues, pull requests, branches, commits, files, search,
            releases, Actions, and notifications.
          </p>
          <div className="space-y-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]"
              >
                <div className="flex items-start gap-4 px-4 py-3.5">
                  <code className="shrink-0 rounded bg-[#111] px-2.5 py-1 font-mono text-[11px] text-white">
                    {tool.name}
                  </code>
                  <span className="pt-0.5 text-xs leading-relaxed text-[#555]">{tool.desc}</span>
                </div>
                {tool.example && (
                  <div className="border-t border-[#0d0d0d]">
                    <div className="flex items-center justify-between border-b border-[#0d0d0d] px-4 py-2.5">
                      <span className="font-mono text-[10px] text-[#3a3a3a]">example input</span>
                      <CopyButton text={tool.example} />
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{tool.example}</code></pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. Organizations ─────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Working with organizations</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Most tools accept an <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">owner</code> field that can be either
            a personal username or an organization slug. Pass the org slug (the URL-safe name visible
            in <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">github.com/ORG_SLUG</code>) —
            not the organization's display name.
          </p>
          <div className="space-y-4">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Org-level permissions</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                To list private org repos, list org members, or access org-level team data, your token
                needs <code className="font-mono">read:org</code> (classic PAT) or the{" "}
                <em className="text-[#888]">Members</em> account permission (fine-grained PAT). Without
                this, tools that enumerate org resources will return empty results rather than an error,
                which can be confusing. If you're seeing fewer repos than expected, check that{" "}
                <code className="font-mono">read:org</code> is enabled.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">SAML SSO — authorizing tokens</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Organizations that enforce SAML Single Sign-On require every PAT to be explicitly
                authorized for that org, even if the token has the right scopes. Without SSO
                authorization, requests to org resources return{" "}
                <code className="font-mono">403 Resource protected by organization SAML enforcement</code>.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#555]">
                To authorize: go to{" "}
                <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-[10px]">
                  github.com/settings/tokens
                </code>
                , click your token, and look for the{" "}
                <strong className="text-white font-mono text-[10px]">Configure SSO</strong> button next
                to the organization name. Click it and complete the SSO flow. Fine-grained PATs for
                SSO orgs require the org admin to approve the token first.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Org slug vs display name</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Always use the org <em className="text-[#888]">slug</em> (login) in tool inputs, not
                the display name. The slug is what appears in the GitHub URL:{" "}
                <code className="font-mono text-[10px]">github.com/acme-corp</code> → slug is{" "}
                <code className="font-mono text-[10px]">acme-corp</code>. The display name might be{" "}
                <code className="font-mono text-[10px]">Acme Corporation</code> but that won't work as
                the <code className="font-mono text-[10px]">owner</code> field.
              </p>
            </div>
          </div>
        </section>

        {/* ── 9. Actions integration ───────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">GitHub Actions integration</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            Conductor can trigger GitHub Actions workflows, poll for completion, and download
            artifacts — turning your AI client into a deployment and CI orchestration interface.
          </p>
          <h3 className="mb-3 font-mono text-sm font-semibold text-[#888]">Setting up workflow_dispatch</h3>
          <p className="mb-3 text-sm leading-relaxed text-[#666]">
            The <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">github.actions.trigger</code> tool
            requires the target workflow to have an{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">on: workflow_dispatch</code> trigger.
            Define typed inputs to control what Conductor can pass at trigger time.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">.github/workflows/deploy.yml</span>
              <CopyButton text={workflowDispatchYaml} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{workflowDispatchYaml}</code></pre>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Trigger a run</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Call <code className="font-mono">github.actions.trigger</code> with the workflow filename
                or ID, the target branch, and any inputs defined in the workflow. The tool returns the
                triggered run's ID for subsequent polling.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Poll run status</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Use <code className="font-mono">github.actions.get-run</code> to check a run's status
                and conclusion. Poll every 15–30 seconds. Status values: <code className="font-mono">queued</code>,{" "}
                <code className="font-mono">in_progress</code>, <code className="font-mono">completed</code>.
                Conclusion values: <code className="font-mono">success</code>,{" "}
                <code className="font-mono">failure</code>, <code className="font-mono">cancelled</code>,{" "}
                <code className="font-mono">timed_out</code>, <code className="font-mono">skipped</code>.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Download artifacts</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                After a run completes, use <code className="font-mono">github.actions.list-runs</code> to
                find the run, then <code className="font-mono">github.actions.download-artifact</code> with
                the artifact ID to download the zip to a local path. Artifacts are only available while
                the run is retained — GitHub defaults to 90 days.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10. Webhooks from GitHub → Conductor ─────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Webhooks: GitHub → Conductor</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            You can configure GitHub to push events (push, issues, pull_request, release, etc.) to
            Conductor's HTTP webhook endpoint. Conductor validates the HMAC signature and routes the
            payload to a handler tool. Requires HTTP transport.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">Setup</span>
              <CopyButton text={webhookSetupCmd} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{webhookSetupCmd}</code></pre>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Configure webhook on GitHub</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Go to your repo or org → Settings → Webhooks → Add webhook. Set Payload URL to your
                Conductor HTTP server address (must be publicly reachable or use a tunnel like ngrok
                for local dev). Set Content type to{" "}
                <code className="font-mono text-[10px]">application/json</code>. Paste your HMAC secret
                into the Secret field. Choose which individual events to subscribe to — avoid{" "}
                <em className="text-[#888]">Send me everything</em> to minimize noise.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">HMAC signature verification</h3>
              <p className="mb-3 text-xs leading-relaxed text-[#555]">
                GitHub signs every webhook with your secret using HMAC-SHA256. The signature is sent
                in the <code className="font-mono text-[10px]">X-Hub-Signature-256</code> header as{" "}
                <code className="font-mono text-[10px]">sha256=&lt;hex&gt;</code>. Conductor verifies this
                automatically. If you're handling webhooks in your own code:
              </p>
              <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                  <span className="font-mono text-[10px] text-[#3a3a3a]">Node.js — signature verification</span>
                  <CopyButton text={webhookVerifyNode} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{webhookVerifyNode}</code></pre>
              </div>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold text-white">Recommended events to subscribe to</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["push", "pull_request", "issues", "issue_comment", "pull_request_review", "release", "workflow_run", "check_run", "deployment", "deployment_status"].map((ev) => (
                  <code key={ev} className="rounded bg-[#111] px-2 py-0.5 font-mono text-[10px] text-[#666]">
                    {ev}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. Errors ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Common errors and fixes</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            GitHub API errors map to specific root causes. Most can be resolved by adjusting token
            scopes, SSO authorization, or workflow configuration.
          </p>
          <div className="space-y-2">
            {errors.map((err) => (
              <div key={err.code} className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="border-b border-[#0d0d0d] px-4 py-3">
                  <code className="font-mono text-sm text-white">{err.code}</code>
                </div>
                <div className="grid gap-0 sm:grid-cols-2">
                  <div className="border-b border-[#0d0d0d] p-4 sm:border-b-0 sm:border-r sm:border-[#0d0d0d]">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#333]">Cause</p>
                    <p className="text-xs leading-relaxed text-[#555]">{err.cause}</p>
                  </div>
                  <div className="p-4">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#333]">Fix</p>
                    <p className="text-xs leading-relaxed text-[#555]">{err.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 12. Rate limits ──────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Rate limits</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            GitHub enforces both primary (per-hour) and secondary (per-minute concurrency) rate limits.
            Conductor respects the <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">Retry-After</code> and{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">X-RateLimit-Reset</code> headers automatically.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">API</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Unauthenticated</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">PAT</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">GitHub App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {rateLimits.map((row) => (
                  <tr key={row.api}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-[11px] text-white">{row.api}</code>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#555]">{row.unauthenticated}</td>
                    <td className="px-4 py-3 font-mono text-[#888]">{row.pat}</td>
                    <td className="px-4 py-3 font-mono text-[#888]">{row.githubApp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="font-mono text-xs font-medium text-white">Secondary rate limits</p>
            <p className="mt-1 text-xs leading-relaxed text-[#555]">
              In addition to the hourly quota, GitHub enforces secondary limits on concurrent requests
              and rapid write mutations (creating issues, comments, etc. in quick succession). These
              return <code className="font-mono">403</code> with a message like{" "}
              <code className="font-mono">You have exceeded a secondary rate limit</code>. Conductor
              handles these with exponential backoff. If you're doing bulk operations, introduce a
              small delay (100–500ms) between write calls to stay well within secondary limits.
            </p>
          </div>
        </section>

        {/* ── 13. Security best practices ──────────────────────────────────── */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Security best practices</h2>
          <div className="space-y-3">
            {[
              {
                title: "Prefer fine-grained PATs over classic PATs",
                desc: "Fine-grained tokens let you restrict access to exactly the repos and permissions needed. A classic PAT with repo scope grants read/write access to all your private repos — a significant blast radius if leaked.",
              },
              {
                title: "Apply minimal scopes",
                desc: "Only grant the permissions your workflow actually requires. Start with read-only and escalate to write only when a tool fails with 403. This limits damage from token exposure.",
              },
              {
                title: "Set expiration dates",
                desc: "Always set an expiration on tokens — 90 days for automation, up to 1 year for personal use. Calendar a reminder to rotate them before they expire. Fine-grained PATs enforce expiration; classic PATs do not.",
              },
              {
                title: "Never commit tokens to source control",
                desc: "Use environment variables or Conductor's built-in secret store (conductor secret set GITHUB_TOKEN). GitHub automatically scans repositories for accidentally committed tokens and immediately revokes them when found — but the exposure window before revocation can still be exploited.",
              },
              {
                title: "Use GitHub Apps for team and production use",
                desc: "GitHub Apps have their own identity, don't rely on a user account, and survive employee offboarding. Use them for any automation that multiple people depend on.",
              },
              {
                title: "Scope GitHub App installations tightly",
                desc: "Install GitHub Apps on only the repos they need, not the entire organization. Use the 'Only select repositories' option when installing.",
              },
              {
                title: "Store private keys securely",
                desc: "GitHub App private keys (.pem files) are equivalent to a master password for your app. Store them in a secrets manager (AWS Secrets Manager, HashiCorp Vault, 1Password Secrets Automation) rather than on disk in plaintext.",
              },
              {
                title: "Rotate tokens on any suspected exposure",
                desc: "If a token may have been exposed — leaked log, committed to a repo, sent in a message — revoke it immediately at github.com/settings/tokens and generate a new one. Don't wait for GitHub's automatic scanning.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <h3 className="mb-1.5 font-mono text-xs font-semibold text-white">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#555]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer nav */}
      <div className="mt-12 flex items-center gap-6 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/integrations"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          All integrations
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/docs/integrations/slack"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Slack integration
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/docs/webhooks"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          Conductor webhooks
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
